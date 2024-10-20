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
    } else {
      console.log('startSelection message sent successfully');
    }
  });
  window.close();
});
