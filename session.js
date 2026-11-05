(() => {
  'use strict';

  const STORAGE_KEY = 'functional-education-study-session-v1';
  const IS_AI_VERSION = new URLSearchParams(window.location.search).get('version') === 'ai';
  const CONDITION = IS_AI_VERSION ? 'ai' : 'control';
  const WORKER_API_URL = ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:8787'
    : 'https://functional-education-trees.functional-education-trees.workers.dev';
  const MAX_OUTBOX_EVENTS = 500;
  // Every participant takes test version A as pretest and test version B as posttest.
  const TEST_ORDER = 'AB';

  const phaseIds = {
    consent: 'consent-phase',
    pretest: 'pretest-phase',
    lesson: 'lesson-phase',
    posttest: 'posttest-phase',
    questionnaire: 'questionnaire-phase',
    complete: 'complete-phase'
  };

  const elements = {
    participantCode: document.getElementById('participant-code'),
    consentCheckbox: document.getElementById('consent-checkbox'),
    consentError: document.getElementById('consent-error'),
    startButton: document.getElementById('start-study-btn'),
    lessonContinue: document.getElementById('lesson-continue-btn'),
    posttestConfirmation: document.getElementById('posttest-confirmation')
  };

  let session = loadSession();
  let syncInProgress = false;

  function loadSession() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== 1 || !parsed.sessionId) return null;
      return parsed;
    } catch (error) {
      console.warn('Could not restore the study session from local storage.', error);
      return null;
    }
  }

  function persistSession() {
    if (!session) return;
    session.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('Could not save the study session locally.', error);
      showConsentError('Your browser could not save this session. Please check available storage and try again.');
    }
  }

  function showScreen(phase) {
    Object.entries(phaseIds).forEach(([name, id]) => {
      const screen = document.getElementById(id);
      if (screen) screen.classList.toggle('hidden', name !== phase);
    });
    document.body.classList.toggle('study-not-lesson', phase !== 'lesson');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function showConsentError(message) {
    elements.consentError.textContent = message;
    elements.consentError.classList.remove('hidden');
  }

  function clearConsentError() {
    elements.consentError.textContent = '';
    elements.consentError.classList.add('hidden');
  }

  function makeId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    return `evt-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function recordEvent(eventType, payload = {}) {
    if (!session) return;
    session.outbox = Array.isArray(session.outbox) ? session.outbox : [];
    if (session.outbox.length >= MAX_OUTBOX_EVENTS) {
      console.warn('Study event outbox is full; the oldest unsynchronized event is dropped to keep the newest one.');
      session.outbox.shift();
    }

    session.outbox.push({
      eventId: makeId(),
      eventType,
      phase: session.phase,
      payload,
      clientCreatedAt: new Date().toISOString()
    });
    persistSession();
    flushOutbox();
  }

  async function flushOutbox() {
    if (!session || syncInProgress || !navigator.onLine) return;
    if (!Array.isArray(session.outbox) || session.outbox.length === 0) return;

    syncInProgress = true;
    let syncSucceeded = false;
    const batch = session.outbox.slice(0, 50);
    const sessionSnapshot = {
      sessionId: session.sessionId,
      participantCode: session.participantCode,
      condition: session.condition,
      phase: session.phase,
      consentGiven: session.consentGiven,
      startedAt: session.startedAt,
      updatedAt: session.updatedAt
    };

    try {
      const response = await fetch(`${WORKER_API_URL}/api/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session: sessionSnapshot, events: batch })
      });

      if (!response.ok) {
        const detail = await response.text().catch(() => '');
        throw new Error(`Study sync failed (${response.status}): ${detail}`);
      }

      const result = await response.json();
      const accepted = new Set(result.acceptedEventIds || []);
      session.outbox = session.outbox.filter((event) => !accepted.has(event.eventId));
      persistSession();
      syncSucceeded = true;
    } catch (error) {
      // Keep the outbox in local storage. It will be retried on the next event,
      // when the browser comes back online, or when the page becomes visible.
      console.warn('Study data is waiting to synchronize.', error);
    } finally {
      syncInProgress = false;
      if (syncSucceeded && session && Array.isArray(session.outbox) && session.outbox.length > 0) {
        flushOutbox();
      }
    }
  }

  function renderPhaseContent(phase) {
    if (window.AssessmentTests && ['pretest', 'posttest'].includes(phase)) {
      window.AssessmentTests.render(phase);
    }
    if (window.Questionnaire && phase === 'questionnaire') {
      window.Questionnaire.render();
    }
  }

  function setPhase(nextPhase) {
    if (!session || !phaseIds[nextPhase]) return;
    const previousPhase = session.phase;
    session.phase = nextPhase;
    persistSession();
    recordEvent('phase_changed', { from: previousPhase, to: nextPhase });
    showScreen(nextPhase);
    renderPhaseContent(nextPhase);

    if (nextPhase === 'lesson' && session.learningState && window.restoreLearningState) {
      window.restoreLearningState(session.learningState);
    }
    flushOutbox();
  }

  // Ask the server whether this pseudonym is already taken. Only an explicit "already used"
  // answer blocks the start: if the server is unreachable or not configured, the study continues
  // offline and the data is synchronized later.
  async function isPseudonymAvailable(candidate) {
    try {
      const response = await fetch(`${WORKER_API_URL}/api/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session: {
            sessionId: candidate.sessionId,
            participantCode: candidate.participantCode,
            condition: candidate.condition,
            phase: candidate.phase,
            consentGiven: candidate.consentGiven,
            startedAt: candidate.startedAt,
            updatedAt: candidate.updatedAt
          },
          events: []
        })
      });
      if (response.status === 409) {
        const data = await response.json().catch(() => ({}));
        if (data.error === 'participant_code_already_used') return false;
      }
    } catch (error) {
      console.warn('Could not check the pseudonym with the server.', error);
    }
    return true;
  }

  async function startStudy() {
    clearConsentError();

    const participantCode = elements.participantCode.value.trim();
    if (!/^[A-Za-z0-9_-]{2,40}$/.test(participantCode)) {
      showConsentError('Enter a pseudonym of 2 to 40 letters, numbers, hyphens or underscores (no spaces).');
      return;
    }
    if (!elements.consentCheckbox.checked) {
      showConsentError('Please confirm that you have read the study information and agree to participate.');
      return;
    }
    if (session && session.phase !== 'complete') {
      showConsentError('An unfinished study session is already saved in this browser. Resume it by refreshing the page, or contact the research team before changing participants.');
      return;
    }

    const candidate = {
      version: 1,
      sessionId: makeId(),
      participantCode,
      condition: CONDITION,
      testOrder: TEST_ORDER,
      assessments: {},
      phase: 'consent',
      consentGiven: true,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      learningState: null,
      outbox: []
    };

    elements.startButton.disabled = true;
    const available = await isPseudonymAvailable(candidate);
    elements.startButton.disabled = false;
    if (!available) {
      showConsentError('This pseudonym is already used by another participant. Please choose a different one.');
      return;
    }

    session = candidate;
    persistSession();
    recordEvent('consent_recorded', { consentGiven: true, testOrder: session.testOrder });
    setPhase('pretest');
  }

  function resumeOrStart() {
    if (session) {
      if (session.condition !== CONDITION) {
        showScreen('consent');
        showConsentError(
          `A saved ${session.condition} session exists in this browser, but this link is for the ${CONDITION} condition. Please use the original study link or contact the research team.`
        );
        elements.startButton.disabled = true;
        elements.participantCode.value = session.participantCode || '';
        return;
      }

      elements.participantCode.value = session.participantCode || '';
      showScreen(session.phase in phaseIds ? session.phase : 'consent');
      renderPhaseContent(session.phase);
      if (session.phase === 'lesson' && session.learningState && window.restoreLearningState) {
        window.restoreLearningState(session.learningState);
      }
      flushOutbox();
      return;
    }

    showScreen('consent');
  }

  elements.startButton.addEventListener('click', startStudy);
  elements.lessonContinue.addEventListener('click', () => {
    if (!session || session.phase !== 'lesson') return;
    if (window.areAllExercisesCompleted()) {
      setPhase('posttest');
      return;
    }
    elements.posttestConfirmation.returnValue = '';
    elements.posttestConfirmation.showModal();
  });

  elements.posttestConfirmation.addEventListener('close', () => {
    if (!session || session.phase !== 'lesson') return;
    if (elements.posttestConfirmation.returnValue === 'proceed') {
      setPhase('posttest');
      return;
    }
    document.querySelector('#exercise-selector .active').focus();
    document.getElementById('exercise-navigation-title').scrollIntoView({ block: 'center' });
  });

  window.addEventListener('online', flushOutbox);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') flushOutbox();
  });
  window.addEventListener('beforeunload', persistSession);

  window.StudySession = {
    getSession: () => session ? {
      sessionId: session.sessionId,
      participantCode: session.participantCode,
      condition: session.condition,
      phase: session.phase
    } : null,
    getCondition: () => CONDITION,
    isActive: () => Boolean(session && session.consentGiven),
    isTestPhase: () => Boolean(session && ['pretest', 'posttest'].includes(session.phase)),
    getTestVersion(phase) {
      return phase === 'pretest' ? TEST_ORDER[0] : TEST_ORDER[1];
    },
    getAssessmentState(phase) {
      if (!session) return { currentIndex: 0, responses: {}, selectedOption: null };
      session.assessments = session.assessments || {};
      return session.assessments[phase] || { currentIndex: 0, responses: {}, selectedOption: null };
    },
    saveAssessmentProgress(phase, currentIndex, responses, selectedOption) {
      if (!session || !session.consentGiven) return;
      session.assessments = session.assessments || {};
      session.assessments[phase] = { currentIndex, responses, selectedOption };
      persistSession();
    },
    recordAssessmentAnswer(phase, answer) {
      if (!session || !session.consentGiven) return;
      if (session.phase !== phase) return;
      recordEvent('test_answer_submitted', answer);
      persistSession();
    },
    completeAssessment(phase, results) {
      if (!session || session.phase !== phase) return;
      session.assessments = session.assessments || {};
      if (session.assessments[phase]?.completed) return;
      session.assessments[phase] = { ...(session.assessments[phase] || {}), completed: true, results };
      persistSession();
      recordEvent('test_completed', results);
      setPhase(phase === 'pretest' ? 'lesson' : 'questionnaire');
    },
    getQuestionnaireState() {
      if (!session) return { responses: {}, open: {} };
      const saved = session.questionnaire || {};
      return { responses: saved.responses || {}, open: saved.open || {} };
    },
    saveQuestionnaireProgress(progress) {
      if (!session || !session.consentGiven || session.phase !== 'questionnaire') return;
      if (session.questionnaire?.completed) return;
      session.questionnaire = { responses: progress.responses, open: progress.open };
      persistSession();
    },
    completeQuestionnaire(results) {
      if (!session || session.phase !== 'questionnaire') return;
      if (session.questionnaire?.completed) return;
      session.questionnaire = { ...(session.questionnaire || {}), completed: true, results };
      persistSession();
      recordEvent('questionnaire_submitted', results);
      recordEvent('study_completed', {});
      setPhase('complete');
    },
    recordEvent,
    saveLearningState(learningState) {
      if (!session || !session.consentGiven) return;
      session.learningState = learningState;
      persistSession();
    },
    flush: flushOutbox
  };

  document.body.classList.add(IS_AI_VERSION ? 'version-ai' : 'version-control');
  const conditionLabel = document.getElementById('condition-label');
  if (conditionLabel) conditionLabel.textContent = IS_AI_VERSION ? 'AI version' : 'Control version';

  resumeOrStart();
})();
