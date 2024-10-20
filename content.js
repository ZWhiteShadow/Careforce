const toggleHiddenElements = () => {
  const elementsToHide = document.querySelectorAll('.slds-page-header, .slds-tabs_default');
  elementsToHide.forEach(element => {
    element.classList.toggle('sf-hide');
  });
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleHide') {
    toggleHiddenElements();
    sendResponse({status: 'success'});
  }
});

// Initial hide on page load
chrome.storage.sync.get('hideElements', ({ hideElements }) => {
  if (hideElements) {
    toggleHiddenElements();
  }
});
