let isSelecting = false;

function updateStatus(message) {
  document.getElementById('statusMessage').textContent = message;
}

document.getElementById('selectButton').addEventListener('click', () => {
  console.log('Select button clicked');
  if (!isSelecting) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      document.getElementById('pageFrame').src = tabs[0].url;
      chrome.runtime.sendMessage({ action: 'startSelection' }, (response) => {
        console.log('Response from background:', response);
        if (chrome.runtime.lastError) {
          console.error('Error sending startSelection message:', chrome.runtime.lastError.message);
          updateStatus('Error starting selection mode');
        } else if (response && response.status === 'Error') {
          console.error('Error starting selection mode:', response.error);
          updateStatus('Error starting selection mode');
        } else {
          console.log('startSelection process completed successfully');
          isSelecting = true;
          document.getElementById('selectButton').textContent = 'Selecting...';
          document.getElementById('confirmButton').style.display = 'block';
          updateStatus('Click on elements in the page to select them');
        }
      });
    });
  }
});

document.getElementById('confirmButton').addEventListener('click', () => {
  console.log('Confirm button clicked');
  chrome.runtime.sendMessage({ action: 'confirmSelection' }, (response) => {
    console.log('Response from background:', response);
    if (chrome.runtime.lastError) {
      console.error('Error sending confirmSelection message:', chrome.runtime.lastError.message);
      updateStatus('Error confirming selection');
    } else {
      console.log('confirmSelection process completed successfully');
      isSelecting = false;
      document.getElementById('selectButton').textContent = 'Select Elements to Hide';
      document.getElementById('confirmButton').style.display = 'none';
      updateStatus('Selection confirmed and elements hidden');
    }
  });
});

document.getElementById('toggleButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleHide' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error toggling hidden elements:', chrome.runtime.lastError.message);
        updateStatus('Error toggling hidden elements');
      } else {
        updateStatus('Hidden elements toggled');
      }
    });
  });
});
