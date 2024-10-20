let isSelectionMode = false;

chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked, isSelectionMode:', isSelectionMode);
  if (isSelectionMode) {
    chrome.tabs.sendMessage(tab.id, { action: 'stopSelection' });
    isSelectionMode = false;
  } else {
    chrome.tabs.sendMessage(tab.id, { action: 'toggleHide' });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in background:', request);
  if (request.action === 'startSelection') {
    isSelectionMode = true;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'startSelection' });
    });
    sendResponse({ status: 'Selection mode started' });
  } else if (request.action === 'saveSelectors') {
    chrome.storage.sync.set({ hiddenSelectors: request.selectors }, () => {
      chrome.tabs.sendMessage(sender.tab.id, { action: 'updateSelectors', selectors: request.selectors });
    });
    isSelectionMode = false;
    sendResponse({ status: 'Selectors saved' });
  }
  return true; // Keeps the message channel open for asynchronous responses
});
