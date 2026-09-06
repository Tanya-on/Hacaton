# AGENTS.md

## Project
Static landing page for hackathon "ТОП: старт твоего успеха" (ИРИИТ-РТФ, case 9). Language in UI/code is Russian. Single page, no backend.

## Structure
- `src/index.html:1` — entrypoint, links `style.css` and `script.js` via relative paths
- `src/style.css` — all styles (dark theme `#0F172A` / blue `#3B82F6`)
- `src/script.js:1` — countdown timer hardcoded to `2026-09-03T10:00:00`, updates `#days/#hours/#minutes/#seconds`
- `README.md`, `PRODUCT.md`, `PLAN.md`, `TASKS.md`, `docs/agent/tasks/` — exist but currently empty (vibe-coding doc placeholders)
- `.gitignore` is a generic Node template; no Node project exists yet

## Running
No build, no package manager, no dependencies. Do not add `package.json` unless user requests.
Preview: open `src/index.html` directly or serve:
```
python3 -m http.server -d src 8000
# or
npx serve src
```

## Tooling
No `package.json`, no tests, no lint, no typecheck, no CI, no `opencode.json` / `.opencode/`. Verification is manual browser check.

## Conventions
- Keep vanilla HTML/CSS/JS unless migration is explicitly requested. Do not introduce frameworks.
- Keep existing Russian copy; do not translate UI text.
- Timer target date in `src/script.js:1` — update there if event date changes.
- If adding docs, follow intended locations: product vision → `PRODUCT.md`, implementation plan → `PLAN.md`, task breakdown → `TASKS.md` / `docs/agent/tasks/`.
