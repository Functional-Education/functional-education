import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-opus-5-5';

const ALLOWED_ORIGINS = new Set(['https://functional-education.github.io']);
const LOCAL_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

const FIELD_LIMITS = { problem: 1000, code: 2000, traceCall: 100 };

const TREE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['nodes', 'terminates', 'final_result', 'comment'],
  properties: {
    nodes: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['depth', 'call', 'result', 'kind'],
        properties: {
          depth: { type: 'integer' },
          call: { type: 'string' },
          result: { type: 'string' },
          kind: { type: 'string', enum: ['base', 'recursive', 'truncated', 'error'] }
        }
      }
    },
    terminates: { type: 'boolean' },
    final_result: { type: 'string' },
    comment: { type: 'string' }
  }
};

const SYSTEM_PROMPT = `You trace recursive pseudocode written by beginner programming students and describe the execution as a recursion tree. The students are undergraduates learning recursion and functional programming (no mutable data) for the first time.

Pseudocode rules:
- Indentation defines blocks, as in Python. A line indented under "if ...:" runs only when the condition is true. A line indented under any line that is not an "if" is a structural mistake: treat it as never executed and mention it in the comment.
- Lines run top to bottom and "return" ends the call immediately. A call that reaches the end of the function without returning returns no value (write "no value").
- A line that is neither an "if" nor a "return" still runs: a bare call such as "sum(n + 1)" still recurses (its value is discarded), and an assignment such as "n = n - 1" changes the variable for the rest of that call. Assignments are mutation, which functional programming avoids; point it out if present.
- "and" short-circuits: when the left side is false, the right side is not evaluated.
- String helpers: first(s) is the first character, rest(s) is everything except the first character, last(s) is the last character, middle(s) is everything except the first and last characters, length(s) is the number of characters. + concatenates strings. first or last of "" is an error; rest and middle of a string that is too short return "".

Trace the given call exactly as the code is written. Never silently fix the student's code.

Tree format:
- nodes lists every function call in depth-first pre-order: a call, then the calls it makes in the order they are made, then its next sibling. The initial call has depth 0; a call made by a call at depth d has depth d + 1.
- call: the call with argument values substituted, e.g. sum(2) or reverse("bc").
- result: how the returned value is computed from the children's results, ending with the value, e.g. "2 + 1 = 3", "\\"cb\\" + \\"a\\" = \\"cba\\"", "0", "true". Use "?" when the call never returns.
- kind: "base" when the call returns without making any recursive call, "recursive" when it makes recursive calls, "error" when the call fails (result briefly says why), "truncated" for a single placeholder node with call "…" and result "" put where the recursion would continue forever.
- If the recursion never terminates, list the first 4 nested calls, then one truncated node, and set terminates to false.
- final_result is the value returned by the initial call, or "never returns", or a short error description.

comment: 2 to 4 short sentences in plain text (no markdown) for a beginner, about this specific tree. Say where the recursion stops (which base case is reached) or why it never stops, how the input changes from one level to the next, and how the results are combined on the way back up. If the submission is incorrect, point at the level of the tree or the line of code where things go wrong, but do not write the corrected code and do not say which blocks to choose.`;

function isAllowedOrigin(origin) {
  return ALLOWED_ORIGINS.has(origin) || LOCAL_ORIGIN.test(origin);
}

function jsonResponse(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      Vary: 'Origin'
    }
  });
}

function validateBody(body) {
  if (!body || typeof body !== 'object') return 'Body must be a JSON object.';
  for (const [field, limit] of Object.entries(FIELD_LIMITS)) {
    const value = body[field];
    if (typeof value !== 'string' || !value.trim()) return `"${field}" must be a non-empty string.`;
    if (value.length > limit) return `"${field}" is too long.`;
  }
  if (typeof body.isCorrect !== 'boolean') return '"isCorrect" must be a boolean.';
  return null;
}

function buildUserMessage({ problem, code, traceCall, isCorrect }) {
  const verdict = isCorrect
    ? 'The exercise checker marked this submission as correct.'
    : 'The exercise checker marked this submission as incorrect. The checker compares against one expected solution, so if the code still behaves correctly for this call, say so.';

  return `Exercise: ${problem}

${verdict}

Student code:
\`\`\`
${code}
\`\`\`

Trace this call: ${traceCall}`;
}

async function generateTree(apiKey, body) {
  const client = new Anthropic({ apiKey });
  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    thinking: { type: 'adaptive' },
    output_config: {
      effort: 'medium',
      format: { type: 'json_schema', schema: TREE_SCHEMA }
    },
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildUserMessage(body) }]
  });

  if (response.stop_reason === 'refusal') return { error: 'refused', status: 422 };
  if (response.stop_reason === 'max_tokens') return { error: 'too_long', status: 502 };

  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock) return { error: 'empty', status: 502 };

  return { tree: JSON.parse(textBlock.text), status: 200 };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    if (!isAllowedOrigin(origin)) {
      return new Response('Forbidden', { status: 403 });
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
          Vary: 'Origin'
        }
      });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'method_not_allowed' }, 405, origin);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: 'invalid_request', detail: 'Body is not valid JSON.' }, 400, origin);
    }

    const invalid = validateBody(body);
    if (invalid) {
      return jsonResponse({ error: 'invalid_request', detail: invalid }, 400, origin);
    }

    try {
      const result = await generateTree(env.CLAUDE_API_KEY, body);
      return result.tree
        ? jsonResponse(result.tree, 200, origin)
        : jsonResponse({ error: result.error }, result.status, origin);
    } catch (error) {
      console.error(error);
      if (error instanceof Anthropic.APIError && (error.status === 429 || error.status >= 500)) {
        return jsonResponse({ error: 'busy' }, 503, origin);
      }
      return jsonResponse({ error: 'server_error' }, 500, origin);
    }
  }
};
