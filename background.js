chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { action: 'toggleHide' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else if (response && response.status === 'success') {
      chrome.storage.sync.get('hideElements', ({ hideElements }) => {
        chrome.storage.sync.set({ hideElements: !hideElements });
      });
    }
  });
});
