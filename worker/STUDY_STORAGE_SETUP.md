# Study data storage: Cloudflare Worker + D1

This project keeps the existing recursion-tree endpoint and adds a separate `POST /api/sync`
endpoint for study-session data.

## What is implemented

- A consent/start screen with the participant information sheet, a pseudonym chosen by the
  participant (stored as `participant_code`; it must be unique, and a pseudonym already used is
  refused at the start) and a consent checkbox.
- Study phases: consent -> 12-question pretest -> lesson -> 12-question posttest -> questionnaire -> completion.
- Pretest and posttest questions are displayed one at a time. Answers are required, earlier
  questions cannot be revisited, and no correctness feedback or score is shown during testing.
- Each answer is stored as a `test_answer_submitted` event. Each completed test stores the
  version and total/category scores in a `test_completed` event.
- The test order is fixed for every participant: test version A is the pretest and test version B
  is the posttest (`TEST_ORDER` in `session.js`). The order is still stored with the session and in
  the `consent_recorded` event.
- The current phase, participant code, condition, test order, assessment progress, learning-activity
  draft, and unsynchronized events are saved in browser `localStorage`.
- The learning activity restores the current exercise, placed blocks, and completed exercises
  after a refresh.
- The browser sends session metadata and queued events to the Worker at `/api/sync`.
- The Worker validates the request and stores sessions and events in D1.
- The original Worker endpoint for AI recursion trees is preserved.

- The final questionnaire (phase 4) is shown to both groups right after the posttest: three required
  Likert statements (1-5: recursive calls, error identification, termination reasoning) and one
  optional open question. The AI group also gets one extra optional open question about the AI's help.
  Drafts are saved in `localStorage` after every change, so a refresh does not lose answers. The
  submission is stored as a single `questionnaire_submitted` event, followed by `study_completed`.
  No Worker or schema change is needed for it.

## 1. Create the D1 database

From this `worker/` directory, after you have access to the Cloudflare account:

```bash
npx wrangler d1 create functional-education-study
```

Wrangler prints a database ID. Add the following to `wrangler.toml`, replacing the placeholder:

```toml
[[d1_databases]]
binding = "DB"
database_name = "functional-education-study"
database_id = "PASTE_THE_DATABASE_ID_HERE"
```

Do not leave the binding commented out when you want the Worker to use D1.

## 2. Create the tables

For a local development database:

```bash
npx wrangler d1 execute functional-education-study --local --file=./schema.sql
```

For the real Cloudflare database:

```bash
npx wrangler d1 execute functional-education-study --remote --file=./schema.sql
```

The schema is idempotent (`CREATE TABLE IF NOT EXISTS`), so it can be applied again safely.

## 3. Test and deploy

Run the Worker locally:

```bash
npm install
npx wrangler dev
```

Serve the static site locally on `localhost` or `127.0.0.1`. The frontend sends its requests
to `http://localhost:8787` in local development.

Once the D1 binding and schema are configured, test the consent flow and verify that records
are created in D1. Then deploy:

```bash
npx wrangler deploy
```

The existing AI tree generation still uses the `CLAUDE_API_KEY` Worker secret. Do not put
that key in frontend code or commit it to Git.

## 4. Inspect the stored data

List sessions:

```sql
SELECT * FROM study_sessions ORDER BY created_at;
```

List events for all participants:

```sql
SELECT session_id, event_type, phase, client_created_at, payload_json
FROM study_events
ORDER BY received_at;
```

The event table stores JSON payloads so the test and questionnaire implementations can add
their response data without needing a new table for every question.

Questionnaire answers (one row per participant, `aiFeedback` is NULL for the control group):

```sql
SELECT
  s.participant_code,
  s.condition,
  json_extract(e.payload_json, '$.responses.recursive_calls')       AS recursive_calls,
  json_extract(e.payload_json, '$.responses.error_identification')  AS error_identification,
  json_extract(e.payload_json, '$.responses.termination_reasoning') AS termination_reasoning,
  json_extract(e.payload_json, '$.openFeedback')                    AS open_feedback,
  json_extract(e.payload_json, '$.aiFeedback')                      AS ai_feedback
FROM study_events e
JOIN study_sessions s ON s.session_id = e.session_id
WHERE e.event_type = 'questionnaire_submitted'
ORDER BY s.participant_code;
```

## Important before recruiting participants

1. Re-read the participant information sheet in `index.html` once more (contacts, duration, data
   storage and retention) and make sure it matches what is actually done.
2. Confirm the institution's data-protection and ethics requirements, including the appropriate
   data location, retention period, withdrawal/deletion procedure, and who can access the account.
3. Participants choose a pseudonym. Do not ask participants to enter names, email
   addresses, student numbers, or other direct identifiers.
4. Restrict Cloudflare account membership and database access to the research team.
5. Test the complete flow with dummy data before collecting real responses.

CORS restricts which browser origins can call the Worker, but it is not authentication:
a non-browser client can still call a public endpoint. The current implementation is intended
as a small-study prototype, not a hardened public data-collection platform. If the study requires
stronger authenticity or abuse protection, add a participant-specific access token or another
server-side verification mechanism before deployment.

## Local persistence versus server persistence

`localStorage` is used to recover the participant's current session if the page is refreshed.
It is not a substitute for the database: it remains on that browser/device and can be cleared.
The event outbox retries synchronization when the network returns. Until the Worker has a valid
D1 binding and the schema is applied, `/api/sync` returns `storage_not_configured` and the
events remain queued locally.
