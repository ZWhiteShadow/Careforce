let hiddenSelectors = [];

function toggleHiddenElements() {
  hiddenSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.classList.toggle('sf-hide');
    });
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleHide') {
    toggleHiddenElements();
    sendResponse({status: 'success'});
  } else if (request.action === 'updateSelectors') {
    hiddenSelectors = request.selectors;
    toggleHiddenElements();
  }
});

chrome.storage.sync.get('hiddenSelectors', ({ hiddenSelectors: savedSelectors }) => {
  if (savedSelectors) {
    hiddenSelectors = savedSelectors;
    toggleHiddenElements();
  }
});

console.log('Content script loaded');

// Add this at the end of the file
chrome.runtime.sendMessage({ action: 'contentScriptReady' }, (response) => {
  console.log('Background script acknowledged content script ready');
});

// Include all the code from selector.js here
