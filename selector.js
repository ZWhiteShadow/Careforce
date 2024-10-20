let selectedElements = [];

function enableSelectionMode() {
  document.body.style.cursor = 'crosshair';
  document.addEventListener('click', handleElementClick, true);
}

function handleElementClick(event) {
  event.preventDefault();
  event.stopPropagation();
  
  const element = event.target;
  element.style.outline = '2px solid red';
  
  const selector = generateSelector(element);
  if (!selectedElements.includes(selector)) {
    selectedElements.push(selector);
  }
}

function generateSelector(element) {
  if (element.id) {
    return `#${element.id}`;
  }
  if (element.className) {
    return `.${element.className.split(' ').join('.')}`;
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

function disableSelectionMode() {
  document.body.style.cursor = 'default';
  document.removeEventListener('click', handleElementClick, true);
  chrome.runtime.sendMessage({action: 'saveSelectors', selectors: selectedElements});
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startSelection') {
    enableSelectionMode();
  } else if (request.action === 'stopSelection') {
    disableSelectionMode();
  }
});
