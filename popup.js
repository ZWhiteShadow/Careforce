document.getElementById('toggleButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleHide' });
  });
});

document.getElementById('selectButton').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'startSelection' });
  window.close();
});
