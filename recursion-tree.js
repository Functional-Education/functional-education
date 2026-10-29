const DEPLOYED_TREE_API_URL = 'https://functional-education-trees.functional-education-trees.workers.dev';
const LOCAL_TREE_API_URL = 'http://localhost:8787';

const TREE_API_URL = ['localhost', '127.0.0.1'].includes(window.location.hostname)
  ? LOCAL_TREE_API_URL
  : DEPLOYED_TREE_API_URL;

const TREE_ERROR_MESSAGES = {
  busy: 'The AI service is busy right now. Check your answer again in a moment.',
  refused: 'The AI declined to generate a tree for this solution.',
  too_long: 'The generated tree was too long. Try checking your answer again.'
};

class TreeGenerationError extends Error {}

async function generateRecursionTree(request) {
  let response;
  try {
    response = await fetch(TREE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
  } catch {
    throw new TreeGenerationError('The recursion tree service could not be reached. Check your internet connection.');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new TreeGenerationError(
      TREE_ERROR_MESSAGES[data.error] || 'The recursion tree could not be generated. Try checking your answer again.'
    );
  }

  return data;
}

function isLastSibling(nodes, index) {
  const depth = nodes[index].depth;
  for (let next = index + 1; next < nodes.length; next += 1) {
    if (nodes[next].depth < depth) return true;
    if (nodes[next].depth === depth) return false;
  }
  return true;
}

function formatTreeNode(node) {
  if (node.kind === 'truncated') return '… never reaches a base case ✗';

  const label = node.result ? `${node.call} → ${node.result}` : node.call;
  if (node.kind === 'base') return `${label}   (base case)`;
  if (node.kind === 'error') return `${label}   ⚠`;
  return label;
}

function renderTreeText(rawNodes) {
  // Clamp depths so a malformed jump (e.g. 0 -> 2) still draws a connected tree.
  const nodes = [];
  rawNodes.forEach((node, index) => {
    const maxDepth = index === 0 ? 0 : nodes[index - 1].depth + 1;
    nodes.push({ ...node, depth: Math.max(0, Math.min(node.depth, maxDepth)) });
  });

  const lastAtDepth = [];
  return nodes
    .map((node, index) => {
      const isLast = isLastSibling(nodes, index);
      lastAtDepth[node.depth] = isLast;
      if (node.depth === 0) return formatTreeNode(node);

      const guides = lastAtDepth
        .slice(1, node.depth)
        .map((ancestorIsLast) => (ancestorIsLast ? '    ' : '│   '))
        .join('');
      return `${guides}${isLast ? '└── ' : '├── '}${formatTreeNode(node)}`;
    })
    .join('\n');
}

window.RecursionTree = {
  generate: generateRecursionTree,
  render: renderTreeText,
  TreeGenerationError
};
