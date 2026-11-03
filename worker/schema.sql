-- Run with: npx wrangler d1 execute functional-education-study --local --file=./schema.sql
-- Use --remote after the database has been created and the account is configured.

CREATE TABLE IF NOT EXISTS study_sessions (
  session_id TEXT PRIMARY KEY,
  participant_code TEXT NOT NULL UNIQUE,
  condition TEXT NOT NULL CHECK (condition IN ('ai', 'control')),
  phase TEXT NOT NULL CHECK (
    phase IN ('consent', 'pretest', 'lesson', 'posttest', 'questionnaire', 'complete')
  ),
  consent_given INTEGER NOT NULL CHECK (consent_given = 1),
  started_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS study_events (
  event_id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  phase TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  client_created_at TEXT NOT NULL,
  received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES study_sessions(session_id)
);

CREATE INDEX IF NOT EXISTS idx_study_events_session
  ON study_events(session_id);

CREATE INDEX IF NOT EXISTS idx_study_events_type
  ON study_events(event_type);
