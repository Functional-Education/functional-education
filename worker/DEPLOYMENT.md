# Deployment instructions (Cloudflare + GitHub Pages)

Goal: put the study online so that participants can follow it and their answers are stored.
The site (static files) is served by GitHub Pages. The Worker (`worker/`) calls the Claude API for
the AI recursion trees and stores the study data in a Cloudflare D1 database.

Who needs what:
- access to the Cloudflare account that owns the Worker `functional-education-trees`
- a Claude API key (the one used by the existing deployment, or a new one)
- admin access to the GitHub repository (Settings > Pages)

All `npx wrangler ...` commands are run from the `worker/` folder.

## 1. Get the code and log in

```bash
git pull
cd worker
npm install
npx wrangler login
```

## 2. Create the production database

```bash
npx wrangler d1 create functional-education-study
```

Wrangler prints a `database_id`. Open `worker/wrangler.toml` and make sure it contains the binding
below with the real ID (the committed file may contain a dummy all-zeros ID used for local tests,
replace it):

```toml
[[d1_databases]]
binding = "DB"
database_name = "functional-education-study"
database_id = "THE_REAL_ID_PRINTED_BY_WRANGLER"
```

Commit and push this change (the ID is not a secret).

## 3. Create the tables in the remote database

```bash
npx wrangler d1 execute functional-education-study --remote --file=./schema.sql
```

Check: `npx wrangler d1 execute functional-education-study --remote --command "SELECT name FROM sqlite_master WHERE type='table';"`
must list `study_sessions` and `study_events`.

## 4. Set the Claude API key (production secret)

```bash
npx wrangler secret list
npx wrangler secret put CLAUDE_API_KEY
```

Only run `secret put` if `CLAUDE_API_KEY` is not already in the list. Never commit the key and never
commit `worker/.dev.vars` (it is only for local development).

## 5. Deploy the Worker

```bash
npx wrangler deploy
```

Wrangler prints the Worker URL. It must be exactly:

```
https://functional-education-trees.functional-education-trees.workers.dev
```

This URL is hard-coded in `session.js` (`WORKER_API_URL`) and in `recursion-tree.js`
(`DEPLOYED_TREE_API_URL`). If Wrangler prints a different URL, update both constants, commit and push.

## 6. Check the allowed website origin

In `worker/src/index.js`, `ALLOWED_ORIGINS` contains `https://functional-education.github.io`.
It must match the origin (scheme + host, no path) where the site is published. If the site is
published somewhere else (for example `https://<user>.github.io`), add that origin to the set,
then run `npx wrangler deploy` again. Without this, the browser blocks every request to the Worker.

## 7. Publish the site with GitHub Pages

In the repository: Settings > Pages > "Deploy from a branch" > `main` / `(root)`. `index.html`
must be at the root of the published folder. Wait for the Pages deployment to finish, then open the
site.

Note: everything in the repository root is public once published, including the `docs/` folder.
Remove or move out of the repository any file that should not be public.

## 8. Smoke test on the live site, then clean up

Use two throw-away pseudonyms that start with `smoke-` and go through the whole study once in each
version (pretest, lesson with at least one exercise check, posttest, questionnaire):

- AI version: `<SITE_URL>/?version=ai` (pseudonym `smoke-ai`)
- Control version: `<SITE_URL>/?version=control` (pseudonym `smoke-control`)

In the AI version, check that a recursion tree is generated after checking an exercise.

Verify that the data reached the remote database:

```bash
npx wrangler d1 execute functional-education-study --remote --command "SELECT participant_code, condition, phase FROM study_sessions;"
npx wrangler d1 execute functional-education-study --remote --command "SELECT s.participant_code, e.event_type, COUNT(*) AS n FROM study_events e JOIN study_sessions s ON s.session_id = e.session_id GROUP BY s.participant_code, e.event_type;"
```

Expected per participant: 24 `test_answer_submitted`, 2 `test_completed`, 1 `questionnaire_submitted`,
1 `study_completed`, and phase `complete`.

Then delete the test data (events first, then sessions):

```bash
npx wrangler d1 execute functional-education-study --remote --command "DELETE FROM study_events WHERE session_id IN (SELECT session_id FROM study_sessions WHERE participant_code LIKE 'smoke-%');"
npx wrangler d1 execute functional-education-study --remote --command "DELETE FROM study_sessions WHERE participant_code LIKE 'smoke-%';"
```

## 9. Links to give to participants

Share exactly one of these links per participant, 10 participants per link (20 in total):

- AI group: `<SITE_URL>/?version=ai`
- Control group: `<SITE_URL>/?version=control`

Participants choose their own pseudonym on the first page. They should use one computer and one
browser, complete the study in one sitting, and not clear their browser data in between (their
progress is saved in the browser).

## 10. During the study

Progress (use `--remote`):

```bash
npx wrangler d1 execute functional-education-study --remote --command "SELECT condition, phase, COUNT(*) AS n FROM study_sessions GROUP BY condition, phase;"
```

Test scores and questionnaire answers: see the queries in `STUDY_STORAGE_SETUP.md`.

Back up the data regularly and at the end of the study:

```bash
npx wrangler d1 export functional-education-study --remote --output=study-backup.sql
```

Do not commit the backup to the repository (it contains participant data).

## 11. After the study

The information sheet promises that data is kept until the end of the semester and then deleted.
Once the analysis is finished, delete the database:

```bash
npx wrangler d1 delete functional-education-study
```

If a participant asks for deletion earlier, delete their rows using their pseudonym (events first,
then the session).
