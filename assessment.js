(() => {
  'use strict';

  const tests = {
    A: [
      { id: 'A1', category: 'base_cases', prompt: 'We want to compute the factorial of an integer n ≥ 0. Which condition guarantees that the function returns the correct result?', code: 'def factorial(n):\n    if CONDITION:\n        return 1\n    return n * factorial(n - 1)', options: ['n == 1', 'n == 0', 'n < 0', 'n > 0'], answer: 1 },
      { id: 'A2', category: 'base_cases', prompt: 'We want to count the digits of a positive integer. Which condition identifies the base case?', code: 'def count_digits(n):\n    if CONDITION:\n        return 1\n    return 1 + count_digits(n // 10)', options: ['n == 0', 'n < 10', 'n > 10', 'n == 10'], answer: 1 },
      { id: 'A3', category: 'base_cases', prompt: 'A string is traversed recursively by removing its first character at each call. Which condition correctly handles all strings, including the empty string?', code: 'def process(s):\n    if CONDITION:\n        return 0\n    return 1 + process(s[1:])', options: ['len(s) == 1', 'len(s) == 0', 'len(s) > 1', 's[0] == ""'], answer: 1 },
      { id: 'A4', category: 'base_cases', prompt: 'A sequence is defined by F(n) = F(n−1) + F(n−2), for n ≥ 2, with F(0)=2 and F(1)=3. Which excerpt contains the two required base cases?', code: '', options: ['if n == 0: return 2  /  if n == 1: return 3', 'if n == 1: return 2  /  if n == 2: return 3', 'if n <= 2: return 2', 'if n == 0: return 3  /  if n == 1: return 2'], answer: 0 },
      { id: 'A5', category: 'tracing', prompt: 'What value does f(2) return?', code: 'def f(n):\n    if n == 0:\n        return 2\n    return 3 * f(n - 1) + 1', options: ['10', '19', '22', '28'], answer: 2 },
      { id: 'A6', category: 'tracing', prompt: 'What is the exact order of the printed lines when calling f(3)?', code: 'def f(n):\n    if n == 0:\n        return\n    print("A", n)\n    f(n - 1)\n    print("B", n)', options: ['A 3, A 2, A 1, B 1, B 2, B 3', 'A 3, B 3, A 2, B 2, A 1, B 1', 'A 1, A 2, A 3, B 1, B 2, B 3', 'A 3, A 2, A 1, B 3, B 2, B 1'], answer: 0 },
      { id: 'A7', category: 'tracing', prompt: 'How many calls to f are made in total when calling f(3), counting the initial call?', code: 'def f(n):\n    if n <= 1:\n        return 1\n    return f(n - 1) + f(n - 2)', options: ['4', '5', '6', '7'], answer: 1 },
      { id: 'A8', category: 'tracing', prompt: 'What value does f(3) return?', code: 'def f(n):\n    if n == 0:\n        return 1\n    return n + f(n - 1)', options: ['4', '5', '6', '7'], answer: 3 },
      { id: 'A9', category: 'termination', prompt: 'We call f(11). What happens?', code: 'def f(n):\n    if n <= 2:\n        return\n    f(n - 3)', options: ['The function only terminates when n equals 0.', 'The function terminates when n becomes less than or equal to 2.', 'The function does not terminate, because n becomes negative.', 'The function does not terminate, because it does not decrease by 1.'], answer: 1 },
      { id: 'A10', category: 'termination', prompt: 'We call f(3). Does the function terminate?', code: 'def f(n):\n    if n == 1:\n        return\n    f(n + 2)', options: ['Yes, because it has a base case.', 'Yes, because n increases at each call.', 'No, because n moves away from the base case value.', 'No, because the function contains no recursive call.'], answer: 2 },
      { id: 'A11', category: 'termination', prompt: 'We call f(25). Which sequence represents the values of n during the recursive calls?', code: 'def f(n):\n    if n <= 1:\n        return\n    f(n // 2)', options: ['25 → 12 → 6 → 3 → 1', '25 → 12 → 6 → 3 → 0', '25 → 13 → 7 → 4 → 2', '25 → 12 → 6 → 3 → 2 → 1'], answer: 0 },
      { id: 'A12', category: 'termination', prompt: 'We call f(6). Does the function terminate?', code: 'def f(n):\n    if n == 0:\n        return\n    f(n - 2)', options: ['Yes, because the sequence reaches 0.', 'No, because the sequence becomes negative.', 'No, because the function has no base case.', 'Yes, because any decrease of n guarantees termination.'], answer: 0 }
    ],
    B: [
      { id: 'B1', category: 'base_cases', prompt: 'We want to compute 3ⁿ for any integer n ≥ 0. Which condition guarantees that the function returns the correct result?', code: 'def power(n):\n    if CONDITION:\n        return 1\n    return 3 * power(n - 1)', options: ['n == 1', 'n == 0', 'n < 0', 'n > 0'], answer: 1 },
      { id: 'B2', category: 'base_cases', prompt: 'We want to count the binary digits of a positive integer. Which condition identifies the base case?', code: 'def count_bits(n):\n    if CONDITION:\n        return 1\n    return 1 + count_bits(n // 2)', options: ['n == 0', 'n < 2', 'n > 2', 'n == 2'], answer: 1 },
      { id: 'B3', category: 'base_cases', prompt: 'A list is traversed recursively by removing its last element at each call. Which condition correctly handles all lists, including the empty list?', code: 'def process(items):\n    if CONDITION:\n        return 0\n    return 1 + process(items[:-1])', options: ['len(items) == 1', 'len(items) == 0', 'len(items) > 1', 'items[-1] == []'], answer: 1 },
      { id: 'B4', category: 'base_cases', prompt: 'A sequence is defined by G(n) = G(n−1) + G(n−2), for n ≥ 2, with G(0)=4 and G(1)=5. Which excerpt contains the two required base cases?', code: '', options: ['if n == 0: return 4  /  if n == 1: return 5', 'if n == 1: return 4  /  if n == 2: return 5', 'if n <= 2: return 4', 'if n == 0: return 5  /  if n == 1: return 4'], answer: 0 },
      { id: 'B5', category: 'tracing', prompt: 'What value does f(2) return?', code: 'def f(n):\n    if n == 0:\n        return 3\n    return 2 * f(n - 1) + 1', options: ['9', '13', '15', '19'], answer: 2 },
      { id: 'B6', category: 'tracing', prompt: 'What is the exact order of the printed lines when calling f(3)?', code: 'def f(n):\n    if n == 0:\n        return\n    print("B", n)\n    f(n - 1)\n    print("A", n)', options: ['B 3, B 2, B 1, A 1, A 2, A 3', 'B 3, A 3, B 2, A 2, B 1, A 1', 'B 1, B 2, B 3, A 1, A 2, A 3', 'B 3, B 2, B 1, A 3, A 2, A 1'], answer: 0 },
      { id: 'B7', category: 'tracing', prompt: 'How many calls to f are made in total when calling f(3), counting the initial call?', code: 'def f(n):\n    if n <= 1:\n        return 0\n    return f(n - 1) + f(n - 2)', options: ['3', '4', '5', '6'], answer: 2 },
      { id: 'B8', category: 'tracing', prompt: 'What value does f(3) return?', code: 'def f(n):\n    if n == 0:\n        return 2\n    return n + f(n - 1)', options: ['6', '7', '8', '9'], answer: 2 },
      { id: 'B9', category: 'termination', prompt: 'We call f(14). What happens?', code: 'def f(n):\n    if n <= 3:\n        return\n    f(n - 4)', options: ['The function only terminates when n equals 0.', 'The function terminates when n becomes less than or equal to 3.', 'The function does not terminate, because n becomes negative.', 'The function does not terminate, because it does not decrease by 1.'], answer: 1 },
      { id: 'B10', category: 'termination', prompt: 'We call f(4). Does the function terminate?', code: 'def f(n):\n    if n == 2:\n        return\n    f(n + 3)', options: ['Yes, because it has a base case.', 'Yes, because n increases at each call.', 'No, because n moves away from the base case value.', 'No, because the function contains no recursive call.'], answer: 2 },
      { id: 'B11', category: 'termination', prompt: 'We call f(31). Which sequence represents the values of n during the recursive calls?', code: 'def f(n):\n    if n <= 1:\n        return\n    f(n // 2)', options: ['31 → 15 → 7 → 3 → 1', '31 → 15 → 7 → 3 → 0', '31 → 16 → 8 → 4 → 2 → 1', '31 → 15 → 7 → 3 → 2 → 1'], answer: 0 },
      { id: 'B12', category: 'termination', prompt: 'We call f(9). Does the function terminate?', code: 'def f(n):\n    if n == 0:\n        return\n    f(n - 3)', options: ['Yes, because the sequence reaches 0.', 'No, because the sequence becomes negative.', 'No, because the function has no base case.', 'Yes, because any decrease of n guarantees termination.'], answer: 0 }
    ]
  };

  Object.entries(tests).forEach(([version, questions]) => {
    const ids = new Set(questions.map((question) => question.id));
    const counts = questions.reduce((result, question) => {
      result[question.category] = (result[question.category] || 0) + 1;
      return result;
    }, {});
    if (questions.length !== 12 || ids.size !== 12 ||
        ['base_cases', 'tracing', 'termination'].some((category) => counts[category] !== 4) ||
        questions.some((question) => !Number.isInteger(question.answer) || question.answer < 0 || question.answer >= question.options.length)) {
      throw new Error(`Invalid assessment question bank: version ${version}`);
    }
  });

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }

  function render(phase) {
    if (!['pretest', 'posttest'].includes(phase) || !window.StudySession) return;
    const mount = document.getElementById(`${phase}-content`);
    if (!mount) return;

    const version = window.StudySession.getTestVersion(phase);
    const questions = tests[version];
    const saved = window.StudySession.getAssessmentState(phase);
    const state = {
      index: Math.min(saved.currentIndex || 0, questions.length),
      responses: saved.responses || {},
      selected: saved.selectedOption ?? null
    };

    function save() {
      window.StudySession.saveAssessmentProgress(phase, state.index, state.responses, state.selected);
    }

    function draw() {
      if (state.index >= questions.length) {
        mount.innerHTML = `
          <div class="assessment-complete">
            <h2>${phase === 'pretest' ? 'Pretest complete' : 'Posttest complete'}</h2>
            <p>Thank you. Your answers have been saved. You can continue.</p>
            <button class="primary-btn" id="assessment-finish" type="button">${phase === 'pretest' ? 'Continue to the lesson' : 'Continue to the questionnaire'}</button>
          </div>`;
        mount.querySelector('#assessment-finish').addEventListener('click', () => {
          const results = calculateResults(questions, state.responses);
          window.StudySession.completeAssessment(phase, { version, ...results });
        });
        return;
      }

      const question = questions[state.index];
      const selected = state.selected ?? state.responses[question.id] ?? null;
      const progress = Math.round((state.index / questions.length) * 100);
      const codeHtml = question.code
        ? `<pre class="assessment-code"><code>${escapeHtml(question.code)}</code></pre>`
        : '';
      const choicesHtml = question.options.map((option, index) => `
        <label class="assessment-option ${selected === index ? 'selected' : ''}">
          <input type="radio" name="assessment-answer" value="${index}" ${selected === index ? 'checked' : ''} />
          <span class="assessment-option-letter">${String.fromCharCode(65 + index)}.</span>
          <span>${escapeHtml(option)}</span>
        </label>`).join('');

      mount.innerHTML = `
        <div class="assessment-header">
          <span>Individual assessment</span>
          <span>Question ${state.index + 1} / ${questions.length}</span>
        </div>
        <div class="assessment-progress" role="progressbar" aria-valuemin="0" aria-valuemax="12" aria-valuenow="${state.index}">
          <span style="width: ${progress}%"></span>
        </div>
        <h2 class="assessment-question">${escapeHtml(question.prompt)}</h2>
        ${codeHtml}
        <fieldset class="assessment-options">
          <legend class="sr-only">Choose one answer</legend>
          ${choicesHtml}
        </fieldset>
        <div class="assessment-footer">
          <span class="assessment-note">Once submitted, an answer cannot be changed.</span>
          <button class="primary-btn" id="assessment-next" type="button" ${selected === null ? 'disabled' : ''}>
            ${state.index === questions.length - 1 ? 'Finish the test' : 'Next question'}
          </button>
        </div>`;

      mount.querySelectorAll('input[name="assessment-answer"]').forEach((input) => {
        input.addEventListener('change', () => {
          state.selected = Number(input.value);
          save();
          draw();
        });
      });

      mount.querySelector('#assessment-next').addEventListener('click', () => {
        if (state.selected === null) return;
        const answer = state.selected;
        state.responses[question.id] = answer;
        state.index += 1;
        state.selected = null;
        save();
        window.StudySession.recordAssessmentAnswer(phase, {
          questionId: question.id,
          category: question.category,
          selectedOption: String.fromCharCode(65 + answer),
          correct: answer === question.answer,
          testVersion: version
        });
        draw();
      });
    }

    draw();
  }

  function calculateResults(questions, responses) {
    const scores = { base_cases_score: 0, tracing_score: 0, termination_score: 0, total_score: 0 };
    const keys = { base_cases: 'base_cases_score', tracing: 'tracing_score', termination: 'termination_score' };
    questions.forEach((question) => {
      if (responses[question.id] === question.answer) {
        scores[keys[question.category]] += 1;
        scores.total_score += 1;
      }
    });
    return scores;
  }

  window.AssessmentTests = { render };
})();
