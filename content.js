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
