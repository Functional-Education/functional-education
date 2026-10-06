const blocks = [
  { id: 'if', type: 'if', text: 'if n == 0:' },
  { id: 'return-base', type: 'return', text: 'return 0' },
  { id: 'recursive', type: 'call', text: 'return n + sum(n - 1)' },
  { id: 'bait-1', type: 'bait', text: 'if n < 0:' },
  { id: 'bait-2', type: 'bait', text: 'return n' },
  { id: 'bait-3', type: 'call', text: 'sum(n + 1)' }
];

function createFunctionNode() {
  return {
    id: 'function',
    type: 'function',
    text: 'function sum(n):',
    children: []
  };
}

const functionNode = createFunctionNode();

let selectedOrder = [createFunctionNode()];
let draggedBlockId = null;

const blockBank = document.getElementById('block-bank');
const answerZone = document.getElementById('answer-zone');
const feedback = document.getElementById('feedback');
const hintBtn = document.getElementById('hintBtn');
const checkBtn = document.getElementById('checkBtn');
const resetBtn = document.getElementById('resetBtn');

function getBlockById(blockId) {
  const fromBank = blocks.find((block) => block.id === blockId);
  if (fromBank) return fromBank;
  if (blockId === 'function') {
    ensureFunctionRoot();
    return selectedOrder[0];
  }
  return null;
}

function ensureFunctionRoot() {
  if (!selectedOrder.length || selectedOrder[0].id !== 'function') {
    selectedOrder = [createFunctionNode()];
  }
}

function getFunctionNode() {
  ensureFunctionRoot();
  return selectedOrder[0];
}

function findNode(list, blockId) {
  for (const entry of list) {
    if (entry.id === blockId) return entry;
    const child = findNode(entry.children || [], blockId);
    if (child) return child;
  }
  return null;
}

function addBlockToAnswer(blockId, parentId = null) {
  if (blockId === 'function') {
    showFeedback('The function header is fixed and cannot be removed.', 'info');
    return;
  }

  if (findNode(selectedOrder, blockId)) {
    showFeedback('This block is already in the function.', 'info');
    return;
  }

  const newEntry = { id: blockId, children: [] };
  let targetParent = null;

  if (parentId) {
    targetParent = findNode(selectedOrder, parentId);
  } else {
    targetParent = getFunctionNode();
  }

  if (!parentId && (blockId === 'return-base' || blockId === 'bait-2')) {
    targetParent = getFunctionNode();
  }

  if (!targetParent) {
    showFeedback('This block cannot be placed there.', 'error');
    return;
  }

  targetParent.children.push(newEntry);
  renderBlocks();
  renderAnswerZone();
  showFeedback('Block added to the function. Drop it onto a block to nest it under it.', 'info');
}

function removeBlockById(list, blockId) {
  if (blockId === 'function') return false;

  const index = list.findIndex((entry) => entry.id === blockId);
  if (index >= 0) {
    list.splice(index, 1);
    return true;
  }

  for (const entry of list) {
    if (removeBlockById(entry.children || [], blockId)) {
      return true;
    }
  }

  return false;
}

function renderBlocks() {
  blockBank.innerHTML = '';
  const availableBlocks = blocks.filter((block) => !findNode(selectedOrder, block.id));

  availableBlocks.forEach((block) => {
    const blockEl = document.createElement('div');
    blockEl.className = `block block-${block.type}`;
    blockEl.draggable = true;
    blockEl.textContent = block.text;
    blockEl.dataset.id = block.id;

    blockEl.addEventListener('dragstart', (event) => {
      draggedBlockId = block.id;
      event.dataTransfer.setData('text/plain', block.id);
    });

    blockEl.addEventListener('click', () => {
      addBlockToAnswer(block.id);
    });

    blockBank.appendChild(blockEl);
  });
}

function renderAnswerZone() {
  ensureFunctionRoot();
  answerZone.innerHTML = '';
  answerZone.classList.add('code-zone');

  const codeBlock = document.createElement('div');
  codeBlock.className = 'code-block';

  const functionRoot = selectedOrder[0];
  const functionNode = document.createElement('div');
  functionNode.className = 'node';

  const functionLine = document.createElement('div');
  functionLine.className = 'node-line';
  functionLine.setAttribute('data-id', functionRoot.id);
  const functionToken = document.createElement('span');
  functionToken.className = 'code-token token-function';
  functionToken.textContent = functionRoot.text;
  functionLine.appendChild(functionToken);
  functionNode.appendChild(functionLine);

  if (functionRoot.children && functionRoot.children.length > 0) {
    const childWrapper = document.createElement('div');
    childWrapper.className = 'node-children';
    functionRoot.children.forEach((child) => renderNode(child, childWrapper, false));
    functionNode.appendChild(childWrapper);
  }

  codeBlock.appendChild(functionNode);
  answerZone.appendChild(codeBlock);
}

function renderNode(entry, parentNode, isNested = false) {
  const block = getBlockById(entry.id);
  if (!block) return;

  const node = document.createElement('div');
  node.className = 'node';

  const line = document.createElement('div');
  line.className = `node-line ${isNested ? 'nested' : ''}`;
  line.setAttribute('data-id', entry.id);
  line.draggable = true;

  const token = document.createElement('span');
  token.className = `code-token token-${block.type}`;
  token.textContent = block.text;

  line.appendChild(token);

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'remove-btn';
  removeBtn.textContent = '×';
  removeBtn.title = 'Remove this block';
  removeBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    removeBlockById(selectedOrder, entry.id);
    renderBlocks();
    renderAnswerZone();
    showFeedback('Block removed.', 'info');
  });
  line.appendChild(removeBtn);

  line.addEventListener('dragstart', (event) => {
    draggedBlockId = entry.id;
    event.dataTransfer.setData('text/plain', entry.id);
  });

  line.addEventListener('dragover', (event) => {
    event.preventDefault();
    line.classList.add('drop-target');
  });

  line.addEventListener('dragleave', () => {
    line.classList.remove('drop-target');
  });

  line.addEventListener('drop', (event) => {
    event.preventDefault();
    const droppedId = event.dataTransfer.getData('text/plain') || draggedBlockId;
    if (!droppedId || droppedId === entry.id) return;
    addBlockToAnswer(droppedId, entry.id);
    line.classList.remove('drop-target');
  });

  node.appendChild(line);

  if (entry.children && entry.children.length > 0) {
    const childWrapper = document.createElement('div');
    childWrapper.className = 'node-children';
    entry.children.forEach((child) => renderNode(child, childWrapper, true));
    node.appendChild(childWrapper);
  }

  parentNode.appendChild(node);
}

function isCorrectSolution() {
  ensureFunctionRoot();
  const root = selectedOrder[0];
  if (!root || root.id !== 'function') return false;

  const children = root.children || [];
  if (children.length !== 2) return false;

  const ifNode = children.find((entry) => entry.id === 'if');
  const recursiveNode = children.find((entry) => entry.id === 'recursive');

  if (!ifNode || !recursiveNode) return false;
  if (children.some((entry) => entry.id !== 'if' && entry.id !== 'recursive')) return false;
  if (ifNode.children.length !== 1 || ifNode.children[0].id !== 'return-base') return false;
  if (recursiveNode.children.length > 0) return false;

  return true;
}

function checkAnswer() {
  ensureFunctionRoot();
  if (selectedOrder.length === 0) {
    showFeedback('Start by choosing some blocks for the function.', 'error');
    return;
  }

  if (isCorrectSolution()) {
    showFeedback(
      'Correct! The base case is nested inside the if-block, and the recursive step stays at the same level as the condition.',
      'success'
    );
  } else {
    showFeedback(
      'Not quite. The return for the base case must be indented inside the if-block, and the recursive call must be outside it.',
      'error'
    );
  }
}

function resetActivity() {
  selectedOrder = [createFunctionNode()];
  renderBlocks();
  renderAnswerZone();
  hideFeedback();
}

function showHint() {
  showFeedback(
    'Hint: the function header stays at the top. Drag the if-block into the function and drop the return inside it. Keep the recursive expression at the same level as the if-block.',
    'info'
  );
}

function showFeedback(message, type) {
  feedback.textContent = message;
  feedback.className = `feedback ${type}`;
  feedback.classList.remove('hidden');
}

function hideFeedback() {
  feedback.classList.add('hidden');
}

answerZone.addEventListener('dragover', (event) => {
  event.preventDefault();
});

answerZone.addEventListener('drop', (event) => {
  event.preventDefault();
  const droppedId = event.dataTransfer.getData('text/plain') || draggedBlockId;
  if (!droppedId) return;
  addBlockToAnswer(droppedId);
});

checkBtn.addEventListener('click', checkAnswer);
resetBtn.addEventListener('click', resetActivity);
hintBtn.addEventListener('click', showHint);

renderBlocks();
renderAnswerZone();
