let hiddenSelectors = [];
let selectedElements = [];
let hiddenElements = [];

function generateSelector(element) {
  if (element.id) return `#${element.id}`;
  if (element.className) {
    const classes = element.className.split(' ').join('.');
    return `.${classes}`;
  }
  let selector = element.tagName.toLowerCase();
  let parent = element.parentElement;
  while (parent) {
    const siblings = parent.children;
    const index = Array.from(siblings).indexOf(element) + 1;
    selector = `${parent.tagName.toLowerCase()} > ${selector}:nth-child(${index})`;
    if (parent === document.body) break;
    parent = parent.parentElement;
  }
  return selector;
}

function enableSelectionMode() {
  console.log('Selection mode enabled');
  document.body.style.cursor = 'crosshair';
  document.addEventListener('click', handleElementClick, true);
}

function handleElementClick(event) {
  console.log('Element clicked:', event.target);
  event.preventDefault();
  event.stopPropagation();
  
  const element = event.target;
  element.style.outline = '2px solid red';
  
  const selector = generateSelector(element);
  if (!selectedElements.includes(selector)) {
    selectedElements.push(selector);
  }
}

function disableSelectionMode() {
  console.log('Selection mode disabled');
  document.body.style.cursor = 'default';
  document.removeEventListener('click', handleElementClick, true);
}

function hideSelectedElements() {
  selectedElements.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.style.display = 'none';
      hiddenElements.push(element);
    });
  });
  saveSelections();
}

function toggleHiddenElements() {
  hiddenElements.forEach(element => {
    element.style.display = element.style.display === 'none' ? '' : 'none';
  });
}

function saveSelections() {
  chrome.storage.sync.set({ hiddenSelectors: selectedElements }, () => {
    console.log('Selections saved:', selectedElements);
  });
}

function loadAndApplySelections() {
  chrome.storage.sync.get('hiddenSelectors', ({ hiddenSelectors }) => {
    if (hiddenSelectors) {
      selectedElements = hiddenSelectors;
      hideSelectedElements();
    }
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in content script:', request);
  if (request.action === 'startSelection') {
    enableSelectionMode();
    sendResponse({ status: 'Selection mode started' });
  } else if (request.action === 'confirmSelection') {
    disableSelectionMode();
    hideSelectedElements();
    sendResponse({ status: 'Selection confirmed and hidden' });
  } else if (request.action === 'toggleHide') {
    toggleHiddenElements();
    sendResponse({ status: 'Hidden elements toggled' });
  }
  return true;
});

loadAndApplySelections();

console.log('Content script loaded');

// Add this at the end of the file
chrome.runtime.sendMessage({ action: 'contentScriptReady' }, (response) => {
  console.log('Background script acknowledged content script ready');
});

// Include all the code from selector.js here
