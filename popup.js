document.getElementById('toggleButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleHide' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else if (response && response.status === 'success') {
        chrome.storage.sync.get('hideElements', ({ hideElements }) => {
          chrome.storage.sync.set({ hideElements: !hideElements });
        });
      }
    });
  });
});
