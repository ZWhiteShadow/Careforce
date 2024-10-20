let isSelectionMode = false;

chrome.action.onClicked.addListener((tab) => {
  if (isSelectionMode) {
    chrome.tabs.sendMessage(tab.id, { action: 'stopSelection' });
    isSelectionMode = false;
  } else {
    chrome.tabs.sendMessage(tab.id, { action: 'toggleHide' });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startSelection') {
    isSelectionMode = true;
    chrome.tabs.sendMessage(sender.tab.id, { action: 'startSelection' });
  } else if (request.action === 'saveSelectors') {
    chrome.storage.sync.set({ hiddenSelectors: request.selectors }, () => {
      chrome.tabs.sendMessage(sender.tab.id, { action: 'updateSelectors', selectors: request.selectors });
    });
    isSelectionMode = false;
  }
});
