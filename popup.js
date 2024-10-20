document.getElementById('toggleButton').addEventListener('click', () => {
  console.log('Toggle button clicked');
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleHide' });
  });
});

document.getElementById('selectButton').addEventListener('click', () => {
  console.log('Select button clicked');
  chrome.runtime.sendMessage({ action: 'startSelection' }, (response) => {
    console.log('Response from background:', response);
  });
  window.close();
});
