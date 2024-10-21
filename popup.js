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
    if (chrome.runtime.lastError) {
      console.error('Error sending startSelection message:', chrome.runtime.lastError.message);
    } else if (response && response.status === 'Error') {
      console.error('Error starting selection mode:', response.error);
    } else {
      console.log('startSelection process completed successfully');
    }
  });
  window.close();
});
