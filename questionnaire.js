(() => {
  'use strict';

  const QUESTIONNAIRE_VERSION = 'm4-v1';
  const MAX_OPEN_LENGTH = 1500;
  const SCALE_LABELS = ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'];

  // Likert items shown to both groups (identical wording so that both groups can be compared).
  const likertItems = [
    { id: 'recursive_calls', text: 'The lesson helped me understand how recursive calls are executed.' },
    { id: 'error_identification', text: 'The lesson helped me identify errors in recursive functions.' },
    { id: 'termination_reasoning', text: 'The lesson helped me reason about whether a recursive function terminates.' }
  ];

  // Optional open questions. "open_feedback" is shown to both groups, "ai_feedback" only to the AI group.
  const openQuestions = [
    {
      id: 'open_feedback',
      text: 'What aspects of the lesson did you find particularly useful or confusing?',
      hint: {
        ai: 'You can comment, for example, on the AI-generated recursion trees, the explanations, or the exercises.',
        control: 'You can comment, for example, on the explanations or the exercises.'
      },
      conditions: ['ai', 'control']
    },
    {
      id: 'ai_feedback',
      text: 'What did you think of the AI’s help for learning this lesson?',
      hint: {
        ai: 'For example: were the AI-generated recursion trees useful, confusing, or neither, and why?'
      },
      conditions: ['ai']
    }
  ];

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }

  function render() {
    if (!window.StudySession) return;
    const mount = document.getElementById('questionnaire-content');
    if (!mount) return;

    const condition = window.StudySession.getCondition();
    const questions = openQuestions.filter((question) => question.conditions.includes(condition));
    const saved = window.StudySession.getQuestionnaireState();
    const state = {
      responses: { ...(saved.responses || {}) },
      open: { ...(saved.open || {}) }
    };

    function save() {
      window.StudySession.saveQuestionnaireProgress({ responses: state.responses, open: state.open });
    }

    const likertHtml = likertItems.map((item, itemIndex) => `
      <fieldset class="likert-item" data-item="${item.id}">
        <legend class="likert-statement">${itemIndex + 1}. ${escapeHtml(item.text)}</legend>
        <div class="likert-scale">
          ${SCALE_LABELS.map((label, index) => `
            <label class="likert-option ${state.responses[item.id] === index + 1 ? 'selected' : ''}">
              <input type="radio" name="likert-${item.id}" value="${index + 1}" ${state.responses[item.id] === index + 1 ? 'checked' : ''} />
              <span class="likert-number">${index + 1}</span>
              <span class="likert-label">${escapeHtml(label)}</span>
            </label>`).join('')}
        </div>
      </fieldset>`).join('');

    const openHtml = questions.map((question) => {
      const value = state.open[question.id] || '';
      const hint = question.hint[condition] || '';
      return `
        <div class="questionnaire-open">
          <label class="questionnaire-open-label" for="open-${question.id}">${escapeHtml(question.text)} <span class="questionnaire-optional">(optional)</span></label>
          ${hint ? `<p class="questionnaire-hint">${escapeHtml(hint)}</p>` : ''}
          <textarea id="open-${question.id}" class="questionnaire-textarea" data-question="${question.id}" maxlength="${MAX_OPEN_LENGTH}" rows="4">${escapeHtml(value)}</textarea>
          <div class="questionnaire-counter" data-counter="${question.id}">${value.length} / ${MAX_OPEN_LENGTH}</div>
        </div>`;
    }).join('');

    mount.innerHTML = `
      <p class="questionnaire-intro">
        Please indicate how much you agree with each statement
        (1 = Strongly disagree, 5 = Strongly agree). There are no right or wrong answers,
        and this questionnaire is not scored.
      </p>
      ${likertHtml}
      ${openHtml}
      <p id="questionnaire-error" class="feedback error hidden" role="alert"></p>
      <div class="assessment-footer">
        <span class="assessment-note">The three statements are required. The open question(s) are optional.</span>
        <button class="primary-btn" id="questionnaire-submit" type="button">Finish study</button>
      </div>`;

    const errorBox = mount.querySelector('#questionnaire-error');
    const submitButton = mount.querySelector('#questionnaire-submit');

    // Update the selection in place (no full redraw) so that text typed in the open fields is never lost.
    mount.querySelectorAll('.likert-item input[type="radio"]').forEach((input) => {
      input.addEventListener('change', () => {
        const fieldset = input.closest('.likert-item');
        state.responses[fieldset.dataset.item] = Number(input.value);
        fieldset.querySelectorAll('.likert-option').forEach((option) => {
          option.classList.toggle('selected', option.contains(input) && input.checked);
        });
        errorBox.classList.add('hidden');
        save();
      });
    });

    mount.querySelectorAll('.questionnaire-textarea').forEach((textarea) => {
      textarea.addEventListener('input', () => {
        state.open[textarea.dataset.question] = textarea.value;
        mount.querySelector(`[data-counter="${textarea.dataset.question}"]`).textContent =
          `${textarea.value.length} / ${MAX_OPEN_LENGTH}`;
        save();
      });
    });

    submitButton.addEventListener('click', () => {
      const missing = likertItems.find((item) => !Number.isInteger(state.responses[item.id]));
      if (missing) {
        errorBox.textContent = 'Please answer all three statements before finishing the study.';
        errorBox.classList.remove('hidden');
        const firstInput = mount.querySelector(`[data-item="${missing.id}"] input`);
        if (firstInput) firstInput.focus();
        return;
      }

      submitButton.disabled = true;
      const results = {
        questionnaireVersion: QUESTIONNAIRE_VERSION,
        condition,
        responses: likertItems.reduce((result, item) => {
          result[item.id] = state.responses[item.id];
          return result;
        }, {}),
        openFeedback: (state.open.open_feedback || '').trim() || null
      };
      // The AI-specific answer is only included for the AI group (absent = question not asked).
      if (condition === 'ai') {
        results.aiFeedback = (state.open.ai_feedback || '').trim() || null;
      }
      window.StudySession.completeQuestionnaire(results);
    });
  }

  window.Questionnaire = { render };
})();
