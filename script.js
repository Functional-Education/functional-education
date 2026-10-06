const exercises = [
  {
    id: 'sum',
    label: '1. Sum',
    title: 'Exercise 1: Sum from 0 to n',
    prompt: 'Arrange the blocks to define a recursive function for the sum of the first n natural numbers.',
    instruction: 'Use the worked example from the theory section to build this first exercise.',
    problem: 'Write a recursive function that returns the sum of all numbers from 0 to n. Assume n is a whole number greater than or equal to 0.',
    goal: 'Identify the base case, reduce the input by 1, and combine the current value with the recursive result.',
    functionText: 'function sum(n):',
    blocks: [
      { id: 'if', type: 'if', text: 'if n == 0:' },
      { id: 'return-base', type: 'return', text: 'return 0' },
      { id: 'recursive', type: 'call', text: 'return n + sum(n - 1)' },
      { id: 'bait-1', type: 'bait', text: 'if n < 0:' },
      { id: 'bait-2', type: 'bait', text: 'return n' },
      { id: 'bait-3', type: 'call', text: 'sum(n + 1)' },
      { id: 'bait-4', type: 'return', text: 'return sum(n - 1)' },
      { id: 'bait-5', type: 'call', text: 'return n + sum(n + 1)' },
      { id: 'bait-6', type: 'bait', text: 'if n == 1:' }
    ],
    hint: 'Start from the theory example: the base case return goes inside the if-block, and the recursive return stays outside it.',
    successMessage: 'Correct! The base case is nested inside the if-block, and the recursive step stays at the same level as the condition.',
    errorMessage: 'Not quite. The return for the base case must be indented inside the if-block, and the recursive call must be outside it.'
  },
  {
    id: 'fibonacci',
    label: '2. Fibonacci',
    title: 'Exercise 2: nth Fibonacci Number',
    prompt: 'Arrange the blocks to define a recursive function that finds the nth Fibonacci number.',
    instruction: '',
    problem: 'Write a recursive function that returns the nth Fibonacci number. Assume n is 0 or a positive whole number. The Fibonacci sequence starts 0, 1, 1, 2, 3, 5, so fibonacci(0) = 0 and fibonacci(1) = 1.',
    goal: 'Use a small base case for the first Fibonacci values, then combine two smaller recursive calls.',
    functionText: 'function fibonacci(n):',
    blocks: [
      { id: 'if', type: 'if', text: 'if n <= 1:' },
      { id: 'return-base', type: 'return', text: 'return n' },
      { id: 'recursive', type: 'call', text: 'return fibonacci(n - 1) + fibonacci(n - 2)' },
      { id: 'bait-1', type: 'bait', text: 'if n == 2:' },
      { id: 'bait-2', type: 'bait', text: 'return 1' },
      { id: 'bait-3', type: 'call', text: 'return fibonacci(n - 1)' },
      { id: 'bait-4', type: 'call', text: 'return fibonacci(n - 1) + fibonacci(n - 1)' },
      { id: 'bait-5', type: 'bait', text: 'if n < 1:' },
      { id: 'bait-6', type: 'call', text: 'return fibonacci(n - 2)' }
    ],
    hint: 'The base case should handle the smallest Fibonacci inputs, and the recursive return should combine two smaller Fibonacci calls.',
    successMessage: 'Correct! The base case handles the smallest values, and the recursive step combines two smaller Fibonacci calls.',
    errorMessage: 'Not quite. Keep the base case return inside the if-block, and keep the recursive combination outside it.'
  },
  {
    id: 'reverse',
    label: '3. Reverse',
    title: 'Exercise 3: Reverse a String',
    prompt: 'Arrange the blocks to define a recursive function that reverses a string.',
    instruction: '',
    problem: 'Write a recursive function that returns a reversed version of a string. Assume text can be empty. In this exercise, first(text) means the first character, and rest(text) means everything except the first character.',
    goal: 'Use the empty string as the base case, then reverse the rest of the text and place the first character at the end.',
    functionText: 'function reverse(text):',
    blocks: [
      { id: 'if', type: 'if', text: 'if text == "":' },
      { id: 'return-base', type: 'return', text: 'return ""' },
      { id: 'recursive', type: 'call', text: 'return reverse(rest(text)) + first(text)' },
      { id: 'bait-1', type: 'bait', text: 'if length(text) == 1:' },
      { id: 'bait-2', type: 'bait', text: 'return first(text)' },
      { id: 'bait-3', type: 'call', text: 'return first(text) + reverse(rest(text))' },
      { id: 'bait-4', type: 'call', text: 'return reverse(first(text)) + rest(text)' },
      { id: 'bait-5', type: 'return', text: 'return text' },
      { id: 'bait-6', type: 'bait', text: 'if text == "ab":' }
    ],
    hint: 'Think of the smallest string first. Then recurse on the rest of the text and add the current first character at the end.',
    successMessage: 'Correct! The function stops on the empty string and rebuilds the text in reverse order.',
    errorMessage: 'Not quite. The empty-string return belongs inside the if-block, and the recursive rebuild belongs outside it.'
  },
  {
    id: 'palindrome',
    label: '4. Palindrome',
    title: 'Exercise 4: Check a Palindrome',
    prompt: 'Arrange the blocks to define a recursive function that checks whether a word is a palindrome.',
    instruction: '',
    problem: 'Write a recursive function that returns true when a word is a palindrome. A palindrome is a word that reads the same forwards and backwards, like level. Assume the input is a single word. In this exercise, first(word) is the first letter, last(word) is the last letter, and middle(word) is the part between them.',
    goal: 'Use a very short word as the base case, then compare the first and last letters while recurring on the middle part.',
    functionText: 'function isPalindrome(word):',
    blocks: [
      { id: 'if', type: 'if', text: 'if length(word) <= 1:' },
      { id: 'return-base', type: 'return', text: 'return true' },
      { id: 'recursive', type: 'call', text: 'return first(word) == last(word) and isPalindrome(middle(word))' },
      { id: 'bait-1', type: 'bait', text: 'if first(word) == last(word):' },
      { id: 'bait-2', type: 'bait', text: 'return false' },
      { id: 'bait-3', type: 'call', text: 'return isPalindrome(word)' },
      { id: 'bait-4', type: 'call', text: 'return first(word) == last(word)' },
      { id: 'bait-5', type: 'bait', text: 'if length(word) == 2:' },
      { id: 'bait-6', type: 'call', text: 'return first(word) != last(word) and isPalindrome(middle(word))' }
    ],
    hint: 'If the word is very short, it is already a palindrome. Otherwise compare the outside letters and recurse on the middle.',
    successMessage: 'Correct! The function stops on very short words and then checks matching ends while recurring on the middle.',
    errorMessage: 'Not quite. Keep the true base case inside the if-block, and keep the recursive comparison outside it.'
  }
];

let currentExerciseIndex = 0;
let selectedOrder = [];
let draggedBlockId = null;
const completedExercises = new Set();
let hasCelebratedAllExercises = false;
let currentBlockOrder = [];

const blockBank = document.getElementById('block-bank');
const answerZone = document.getElementById('answer-zone');
const feedback = document.getElementById('feedback');
const checkBtn = document.getElementById('checkBtn');
const resetBtn = document.getElementById('resetBtn');
const exerciseTitle = document.getElementById('exercise-title');
const exercisePrompt = document.getElementById('exercise-prompt');
const exerciseInstruction = document.getElementById('exercise-instruction');
const problemText = document.getElementById('problem-text');
const goalText = document.getElementById('goal-text');
const exerciseSelector = document.getElementById('exercise-selector');

function getCurrentExercise() {
  return exercises[currentExerciseIndex];
}

function createFunctionNode() {
  return {
    id: 'function',
    type: 'function',
    text: getCurrentExercise().functionText,
    children: []
  };
}

function hasStandardShape(root, ifId, baseId, recursiveId) {
  if (!root || root.id !== 'function') return false;

  const children = root.children || [];
  if (children.length !== 2) return false;

  const ifNode = children.find((entry) => entry.id === ifId);
  const recursiveNode = children.find((entry) => entry.id === recursiveId);

  if (!ifNode || !recursiveNode) return false;
  if (children.some((entry) => entry.id !== ifId && entry.id !== recursiveId)) return false;
  if (ifNode.children.length !== 1 || ifNode.children[0].id !== baseId) return false;
  if (recursiveNode.children.length > 0) return false;

  return true;
}

function shuffleList(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function resetBlockOrder() {
  currentBlockOrder = shuffleList(getCurrentExercise().blocks.map((block) => block.id));
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

function getBlockById(blockId) {
  const fromBank = getCurrentExercise().blocks.find((block) => block.id === blockId);
  if (fromBank) return fromBank;
  if (blockId === 'function') {
    ensureFunctionRoot();
    return selectedOrder[0];
  }
  return null;
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
  const targetParent = parentId ? findNode(selectedOrder, parentId) : getFunctionNode();

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

function renderExerciseSelector() {
  exerciseSelector.innerHTML = '';

  exercises.forEach((exercise, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    const isActive = index === currentExerciseIndex;
    const isCompleted = completedExercises.has(exercise.id);
    button.className = `exercise-chip ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`.trim();

    const label = document.createElement('span');
    label.className = 'exercise-chip-label';
    label.textContent = exercise.label;

    const checkmark = document.createElement('span');
    checkmark.className = 'exercise-chip-check';
    checkmark.setAttribute('aria-hidden', 'true');
    checkmark.textContent = '✓';

    button.appendChild(label);
    if (isCompleted) {
      button.appendChild(checkmark);
    }

    button.addEventListener('click', () => {
      if (currentExerciseIndex === index) return;
      currentExerciseIndex = index;
      selectedOrder = [createFunctionNode()];
      resetBlockOrder();
      renderExerciseContent();
      renderBlocks();
      renderAnswerZone();
      hideFeedback();
    });
    exerciseSelector.appendChild(button);
  });
}

function renderExerciseContent() {
  const exercise = getCurrentExercise();
  exerciseTitle.textContent = exercise.title;
  exercisePrompt.textContent = exercise.prompt;
  exerciseInstruction.textContent = exercise.instruction;
  exerciseInstruction.style.display = exercise.instruction ? 'block' : 'none';
  problemText.textContent = exercise.problem;
  goalText.textContent = exercise.goal;
  renderExerciseSelector();
}

function renderBlocks() {
  blockBank.innerHTML = '';
  if (currentBlockOrder.length === 0) {
    resetBlockOrder();
  }

  const blockMap = new Map(getCurrentExercise().blocks.map((block) => [block.id, block]));
  const availableBlocks = currentBlockOrder
    .map((blockId) => blockMap.get(blockId))
    .filter((block) => block && !findNode(selectedOrder, block.id));

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
  return hasStandardShape(selectedOrder[0], 'if', 'return-base', 'recursive');
}

function launchConfetti() {
  const existing = document.querySelector('.confetti-layer');
  if (existing) {
    existing.remove();
  }

  const colors = ['#3b82f6', '#16a34a', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  const layer = document.createElement('div');
  layer.className = 'confetti-layer';

  for (let index = 0; index < 80; index += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = colors[index % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.5}s`;
    piece.style.animationDuration = `${3 + Math.random() * 1.8}s`;
    piece.style.transform = `translateY(-12vh) rotate(${Math.random() * 360}deg)`;
    layer.appendChild(piece);
  }

  document.body.appendChild(layer);

  window.setTimeout(() => {
    layer.remove();
  }, 5200);
}

function checkAnswer() {
  ensureFunctionRoot();
  const exercise = getCurrentExercise();

  if (selectedOrder.length === 0) {
    showFeedback('Start by choosing some blocks for the function.', 'error');
    return;
  }

  if (isCorrectSolution()) {
    const wasCompleted = completedExercises.has(exercise.id);
    completedExercises.add(exercise.id);
    renderExerciseSelector();
    showFeedback(exercise.successMessage, 'success');

    if (!wasCompleted && completedExercises.size === exercises.length && !hasCelebratedAllExercises) {
      hasCelebratedAllExercises = true;
      launchConfetti();
    }
  } else {
    showFeedback(exercise.errorMessage, 'error');
  }
}

function resetActivity() {
  selectedOrder = [createFunctionNode()];
  resetBlockOrder();
  renderBlocks();
  renderAnswerZone();
  hideFeedback();
}

function showHint() {
  showFeedback(getCurrentExercise().hint, 'info');
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

selectedOrder = [createFunctionNode()];
resetBlockOrder();
renderExerciseContent();
renderBlocks();
renderAnswerZone();

window.addBlockToAnswer = addBlockToAnswer;
window.resetActivity = resetActivity;
window.isCorrectSolution = isCorrectSolution;
