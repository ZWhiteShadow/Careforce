document.getElementById('toggleButton').addEventListener('click', () => {
  console.log('Toggle button clicked');
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleHide' });
  });
});

let isSelecting = false;

document.getElementById('selectButton').addEventListener('click', () => {
  console.log('Select button clicked');
  if (!isSelecting) {
    chrome.runtime.sendMessage({ action: 'startSelection' }, (response) => {
      console.log('Response from background:', response);
      if (chrome.runtime.lastError) {
        console.error('Error sending startSelection message:', chrome.runtime.lastError.message);
      } else if (response && response.status === 'Error') {
        console.error('Error starting selection mode:', response.error);
      } else {
        console.log('startSelection process completed successfully');
        isSelecting = true;
        document.getElementById('selectButton').textContent = 'Selecting...';
        document.getElementById('confirmButton').style.display = 'block';
      }
    });
  }
});

document.getElementById('confirmButton').addEventListener('click', () => {
  console.log('Confirm button clicked');
  chrome.runtime.sendMessage({ action: 'confirmSelection' }, (response) => {
    console.log('Response from background:', response);
    if (chrome.runtime.lastError) {
      console.error('Error sending confirmSelection message:', chrome.runtime.lastError.message);
    } else {
      console.log('confirmSelection process completed successfully');
      isSelecting = false;
      document.getElementById('selectButton').textContent = 'Select Elements to Hide';
      document.getElementById('confirmButton').style.display = 'none';
    }
  });
  window.close();
});
