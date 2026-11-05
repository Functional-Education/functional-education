(() => {
  'use strict';

  const tests = {
    A: [
      { id: 'A1', category: 'base_cases', prompt: 'We want to compute the factorial of an integer n ≥ 0. Which condition guarantees that the function returns the correct result?', code: 'function factorial(n):\n    if CONDITION:\n        return 1\n    return n * factorial(n - 1)', options: ['n == 1', 'n == 0', 'n < 0', 'n > 0'], answer: 1 },
      { id: 'A2', category: 'base_cases', prompt: 'We want to count the digits of a positive integer. The // operator divides and rounds down to a whole number; for example, 47 // 10 is 4. Which condition identifies the base case?', code: 'function count_digits(n):\n    if CONDITION:\n        return 1\n    return 1 + count_digits(n // 10)', options: ['n == 0', 'n < 10', 'n > 10', 'n == 10'], answer: 1 },
      { id: 'A3', category: 'base_cases', prompt: 'A string is traversed recursively by removing its first character at each call. Here, len(s) gives the number of characters, s[1:] is the string without its first character, and s[0] is the first character (only available if the string is not empty). Which condition correctly handles all strings, including the empty string?', code: 'function process(s):\n    if CONDITION:\n        return 0\n    return 1 + process(s[1:])', options: ['len(s) == 1', 'len(s) == 0', 'len(s) > 1', 's[0] == ""'], answer: 1 },
      { id: 'A4', category: 'base_cases', prompt: 'A sequence is defined by F(n) = F(n−1) + F(n−2), for n ≥ 2, with F(0)=2 and F(1)=3. Which piece of code contains the two required base cases?', code: '', options: ['if n == 0: return 2  /  if n == 1: return 3', 'if n == 1: return 2  /  if n == 2: return 3', 'if n <= 2: return 2', 'if n == 0: return 3  /  if n == 1: return 2'], answer: 0 },
      { id: 'A5', category: 'tracing', prompt: 'What value does f(2) return?', code: 'function f(n):\n    if n == 0:\n        return 2\n    return 3 * f(n - 1) + 1', options: ['10', '19', '22', '28'], answer: 2 },
      { id: 'A6', category: 'tracing', prompt: 'What is the exact order of the printed lines when calling f(3)? The print(...) instruction displays its values on one line, separated by a space. Each comma in the answers separates two printed lines.', code: 'function f(n):\n    if n == 0:\n        return\n    print("A", n)\n    f(n - 1)\n    print("B", n)\n    return', options: ['A 3, A 2, A 1, B 1, B 2, B 3', 'A 3, B 3, A 2, B 2, A 1, B 1', 'A 1, A 2, A 3, B 1, B 2, B 3', 'A 3, A 2, A 1, B 3, B 2, B 1'], answer: 0 },
      { id: 'A7', category: 'tracing', prompt: 'How many calls to f are made in total when calling f(3), counting the initial call?', code: 'function f(n):\n    if n <= 1:\n        return 1\n    return f(n - 1) + f(n - 2)', options: ['4', '5', '6', '7'], answer: 1 },
      { id: 'A8', category: 'tracing', prompt: 'What value does f(3) return?', code: 'function f(n):\n    if n == 0:\n        return 1\n    return n + f(n - 1)', options: ['4', '5', '6', '7'], answer: 3 },
      { id: 'A9', category: 'termination', prompt: 'We call f(11). What happens?', code: 'function f(n):\n    if n <= 2:\n        return\n    return f(n - 3)', options: ['The function only terminates when n equals 0.', 'The function terminates when n becomes less than or equal to 2.', 'The function does not terminate, because n becomes negative.', 'The function does not terminate, because it does not decrease by 1.'], answer: 1 },
      { id: 'A10', category: 'termination', prompt: 'We call f(3). Does the function terminate?', code: 'function f(n):\n    if n == 1:\n        return\n    return f(n + 2)', options: ['Yes, because it has a base case.', 'Yes, because n increases at each call.', 'No, because n moves away from the base case value.', 'No, because the function contains no recursive call.'], answer: 2 },
      { id: 'A11', category: 'termination', prompt: 'We call f(25). The // operator divides and rounds down to a whole number; for example, 9 // 2 is 4. Which sequence represents the values of n, starting with the initial call and ending at the base case?', code: 'function f(n):\n    if n <= 1:\n        return\n    return f(n // 2)', options: ['25 → 12 → 6 → 3 → 1', '25 → 12 → 6 → 3 → 0', '25 → 13 → 7 → 4 → 2', '25 → 12 → 6 → 3 → 2 → 1'], answer: 0 },
      { id: 'A12', category: 'termination', prompt: 'We call f(6). Does the function terminate?', code: 'function f(n):\n    if n == 0:\n        return\n    return f(n - 2)', options: ['Yes, because the sequence reaches 0.', 'No, because the sequence becomes negative.', 'No, because the function has no base case.', 'Yes, because any decrease of n guarantees termination.'], answer: 0 }
    ],
    B: [
      { id: 'B1', category: 'base_cases', prompt: 'The function must return the sum of the integers from 1 to n, for any integer n ≥ 0. What should replace BASE_VALUE so that sum_to(0) and all other valid calls return the correct result?', code: 'function sum_to(n):\n    if n == 0:\n        return BASE_VALUE\n    return n + sum_to(n - 1)', options: ['0', '1', 'n + 1', 'sum_to(n - 1)'], answer: 0 },
      { id: 'B2', category: 'base_cases', prompt: 'The function must multiply two non-negative integers a and b using repeated addition. Which condition makes it return the correct result for all such inputs, including b = 0?', code: 'function multiply(a, b):\n    if CONDITION:\n        return 0\n    return a + multiply(a, b - 1)', options: ['a == 0', 'b == 1', 'b == 0', 'a == b'], answer: 2 },
      { id: 'B3', category: 'base_cases', prompt: 'The function must reverse any string, including the empty string. Here, len(s) gives the number of characters, s[-1] is the last character (only available if the string is not empty), s[:-1] is the string without its last character, and + joins strings. What should replace BASE_VALUE?', code: 'function reverse(s):\n    if len(s) == 0:\n        return BASE_VALUE\n    return s[-1] + reverse(s[:-1])', options: ['0', 's[-1]', '" " (a single space)', '"" (the empty string)'], answer: 3 },
      { id: 'B4', category: 'base_cases', prompt: 'A sequence is defined for integers n ≥ 0 by G(n) = G(n−1) + 2 * G(n−2) for n ≥ 2, with G(0)=2 and G(1)=5. Which inputs must have their own base cases so that recursive calls never need a value of G at a negative input?', code: '', options: ['Only n == 0', 'Only n == 1', 'Both n == 0 and n == 1', 'Both n == 2 and n == 3'], answer: 2 },
      { id: 'B5', category: 'tracing', prompt: 'What value does f(5) return?', code: 'function f(n):\n    if n <= 1:\n        return 2\n    return n + f(n - 2)', options: ['7', '10', '12', '15'], answer: 1 },
      { id: 'B6', category: 'tracing', prompt: 'What is the exact order of the printed lines when calling f(4)? The print(...) instruction displays its values on one line, separated by a space. Each comma in the answers separates two printed lines.', code: 'function f(n):\n    if n == 0:\n        print("stop")\n        return\n    print("enter", n)\n    f(n - 2)\n    print("leave", n)\n    return', options: ['enter 4, leave 4, enter 2, leave 2, stop', 'stop, enter 2, leave 2, enter 4, leave 4', 'enter 4, enter 2, stop, leave 4, leave 2', 'enter 4, enter 2, stop, leave 2, leave 4'], answer: 3 },
      { id: 'B7', category: 'tracing', prompt: 'How many calls to f are made in total when calling f(2), counting the initial call? Each appearance of f(n - 1) makes a separate call.', code: 'function f(n):\n    if n == 0:\n        return 1\n    return f(n - 1) + f(n - 1)', options: ['3', '4', '7', '8'], answer: 2 },
      { id: 'B8', category: 'tracing', prompt: 'What value does digit_sum(243) return? The // operator divides and rounds down to a whole number, and % gives the remainder after division. For example, 47 // 10 is 4 and 47 % 10 is 7.', code: 'function digit_sum(n):\n    if n < 10:\n        return n\n    return n % 10 + digit_sum(n // 10)', options: ['5', '7', '9', '243'], answer: 2 },
      { id: 'B9', category: 'termination', prompt: 'We call f(8). Does the recursion reach its base case?', code: 'function f(n):\n    if n == 0:\n        return\n    return f(n - 3)', options: ['Yes, because subtracting 3 always reaches 0.', 'Yes, because any negative value satisfies n == 0.', 'No, because n does not change between calls.', 'No, because the values go from 2 to -1 and then keep decreasing without reaching 0.'], answer: 3 },
      { id: 'B10', category: 'termination', prompt: 'We call f(1). What happens?', code: 'function f(n):\n    if n >= 10:\n        return\n    return f(n + 3)', options: ['It terminates when n reaches 10: 1 → 4 → 7 → 10.', 'It does not terminate, because n increases.', 'It terminates immediately, because 1 is less than 10.', 'It does not terminate, because the base case requires n to equal 0.'], answer: 0 },
      { id: 'B11', category: 'termination', prompt: 'We call f(2). Which sequence represents the values of n, starting with the initial call and ending at the base case?', code: 'function f(n):\n    if n >= 20:\n        return\n    return f(2 * n + 1)', options: ['2 → 4 → 8 → 16 → 32', '2 → 5 → 11 → 23', '2 → 5 → 11 → 20', '2 → 5 → 11 → 23 → 47'], answer: 1 },
      { id: 'B12', category: 'termination', prompt: 'Does this function reach its base case for every integer n ≥ 0, even when n is not a multiple of 4?', code: 'function f(n):\n    if n <= 0:\n        return\n    return f(n - 4)', options: ['No, only multiples of 4 can reach the base case.', 'Yes, because repeated subtraction eventually makes n zero or negative.', 'No, because the base case does not allow negative values.', 'Yes, because every recursive function eventually stops.'], answer: 1 }
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
