let isSelectionMode = false;

function injectContentScripts(tabId) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ['content.js', 'selector.js']
  }, () => {
    if (chrome.runtime.lastError) {
      console.error('Script injection failed:', chrome.runtime.lastError.message);
    } else {
      console.log('Content scripts injected successfully');
    }
  });
}

chrome.action.onClicked.addListener((tab) => {
  injectContentScripts(tab.id);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in background:', request);
  if (request.action === 'startSelection') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        injectContentScripts(tabs[0].id);
        chrome.tabs.sendMessage(tabs[0].id, { action: 'startSelection' }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error sending startSelection message:', chrome.runtime.lastError.message);
          } else {
            console.log('startSelection message sent successfully');
          }
        });
      }
    });
  } else if (request.action === 'saveSelectors') {
    chrome.storage.sync.set({ hiddenSelectors: request.selectors }, () => {
      chrome.tabs.sendMessage(sender.tab.id, { action: 'updateSelectors', selectors: request.selectors });
    });
    isSelectionMode = false;
    sendResponse({ status: 'Selectors saved' });
  }
  return true; // Keeps the message channel open for asynchronous responses
});
