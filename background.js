let isSelectionMode = false;
let contentScriptsInjected = false;

function injectContentScripts(tabId) {
  if (contentScriptsInjected) {
    console.log('Content scripts already injected');
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js', 'selector.js']
    }, () => {
      if (chrome.runtime.lastError) {
        console.error('Script injection failed:', chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError);
      } else {
        console.log('Content scripts injected successfully');
        contentScriptsInjected = true;
        resolve();
      }
    });
  });
}

function sendMessageWithRetry(tabId, message, maxRetries = 3, delay = 1000) {
  return new Promise((resolve, reject) => {
    function attemptSend(retriesLeft) {
      chrome.tabs.sendMessage(tabId, message, (response) => {
        if (chrome.runtime.lastError) {
          console.log(`Attempt failed, ${retriesLeft} retries left`);
          if (retriesLeft > 0) {
            setTimeout(() => attemptSend(retriesLeft - 1), delay);
          } else {
            reject(chrome.runtime.lastError);
          }
        } else {
          resolve(response);
        }
      });
    }
    attemptSend(maxRetries);
  });
}

chrome.action.onClicked.addListener((tab) => {
  injectContentScripts(tab.id);
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'srm.lightning.force.com' },
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});

// Remove the tabs.onUpdated listener as we're now using content_scripts in manifest

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in background:', request);
  if (request.action === 'startSelection') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        injectContentScripts(tabs[0].id)
          .then(() => sendMessageWithRetry(tabs[0].id, { action: 'startSelection' }))
          .then((response) => {
            console.log('startSelection message sent successfully', response);
            sendResponse({ status: 'Selection mode started' });
          })
          .catch((error) => {
            console.error('Error in startSelection process:', error);
            sendResponse({ status: 'Error', error: error.message });
          });
      }
    });
    return true; // Indicates that the response will be sent asynchronously
  } else if (request.action === 'saveSelectors') {
    chrome.storage.sync.set({ hiddenSelectors: request.selectors }, () => {
      chrome.tabs.sendMessage(sender.tab.id, { action: 'updateSelectors', selectors: request.selectors });
    });
    isSelectionMode = false;
    sendResponse({ status: 'Selectors saved' });
  }
  if (request.action === 'contentScriptReady') {
    console.log('Content script ready in tab:', sender.tab.id);
    contentScriptsInjected = true;
    sendResponse({ status: 'Acknowledged' });
  } else if (request.action === 'confirmSelection') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        sendMessageWithRetry(tabs[0].id, { action: 'confirmSelection' })
          .then((response) => {
            console.log('confirmSelection message sent successfully', response);
            sendResponse({ status: 'Selection confirmed' });
          })
          .catch((error) => {
            console.error('Error in confirmSelection process:', error);
            sendResponse({ status: 'Error', error: error.message });
          });
      }
    });
    return true; // Indicates that the response will be sent asynchronously
  }
  return true; // Keeps the message channel open for asynchronous responses
});
