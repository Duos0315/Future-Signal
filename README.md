# FUTURE//SIGNAL

**An open, evolving playground for science questions, engineering experiments and possible futures.**

FUTURE//SIGNAL is a static web laboratory designed to run on GitHub Free. Its purpose is to turn cross-disciplinary ideas into testable questions, let visitors manipulate transparent toy models, and preserve a growing trail of daily signals.

## What it does

- **Daily signal:** a date-seeded, deterministic rules engine combines science and engineering domains into a structured experiment prompt.
- **Interactive experiment:** a browser-side network resilience model runs 100 reproducible trials, measures the largest surviving connected component, and plots trial outcomes.
- **Signal archive:** searchable and filterable archive, with full experiment records retained in new archive entries.
- **Personal collection:** save and remove signals in local browser storage.
- **Shareable signals:** URL parameters identify a specific signal for sharing.
- **Community input:** visitors can propose ideas through GitHub Issues.

## Architecture and constraints

- GitHub Pages hosts the static frontend.
- GitHub Actions runs the Node.js generator daily and commits the JSON output to the repository.
- The frontend uses plain HTML, CSS and JavaScript. Experiments run locally in the visitor's browser.
- No LLMs, inference APIs, paid APIs, database, or always-on server.
- No fake users, engagement metrics, or fabricated scientific claims.

## Scientific integrity

The daily generator is deterministic and template-based. It does **not** independently discover scientific facts or perform literature review. A signal is a hypothesis starter, not a scientific finding.

The network experiment is an explicitly simplified graph model. It measures the fraction of surviving nodes in the largest connected component across 100 deterministic trials. It is not a validated model of a power grid, city, biological system, or production network. Real applications require measured parameters, domain expertise, independent validation and safety review.

## Daily publishing

The workflow is scheduled for 00:17 UTC (05:17 Pakistan Standard Time). It can also be started manually:

1. Open **Actions** in the repository.
2. Select **Generate daily signal**.
3. Choose **Run workflow** on `main`.

The workflow writes `data/daily.json` and updates `data/archive/index.json`. GitHub Actions may delay scheduled jobs during periods of high load.

## Run locally

Serve the repository root with any static server, for example:

```bash
python -m http.server 8000
```

Open http://localhost:8000.

Generate a signal:

```bash
node scripts/generate.mjs
```

## Project map

- `index.html` — semantic page structure and accessible controls
- `styles.css` — responsive visual system
- `app.js` — data loading, archive, saved signals, sharing and experiment engine
- `data/daily.json` — latest published signal
- `data/archive/index.json` — rolling archive (up to 365 entries)
- `scripts/generate.mjs` — deterministic signal generator
- `.github/workflows/daily-signal.yml` — scheduled publishing

## Contribute

Open a GitHub Issue with the question, system, variables, assumptions, references and limitations. For any real-world experiment, include appropriate safety review.
