# FUTURE//SIGNAL

**An open, evolving playground for science questions, engineering experiments and possible futures.**

FUTURE//SIGNAL is a participatory digital evolution universe built as a static web laboratory for GitHub Free. It turns cross-disciplinary ideas into testable questions, gives visitors specialist perspectives and conceptual system blueprints, lets them run and compare transparent toy models, and preserves an evidence-labelled trail of discoveries and community-reviewed proposals.

## The core loop\n\n**Daily signal → specialist council → blueprint → simulation → controlled comparison → evidence ledger → community review → next world cycle.** The goal is not to claim that software predicts the future; it is to make possible futures concrete enough to question, design, test and improve.\n\n## What it does

- **Daily signal:** a date-seeded, deterministic rules engine combines science and engineering domains into a structured experiment prompt, with variables, caveats and three transparent research lenses (systems mapper, skeptic, experimentalist).
- **Interactive experiment:** a shared, tested browser-side network model runs 100 reproducible trials, reports the largest connected component as a share of survivors and as a share of the original population, tracks mean survivors and cluster size, and plots trial outcomes.
- **Scientific transparency:** every signal exposes its variables and caveats; the model mathematics and interpretation limits are documented in `docs/NETWORK_MODEL.md`.
- **Signal archive and map:** searchable history plus a traceable signal-to-domain map. The map only displays explicit archive classifications; it does not invent scientific links.
- **Personal collection:** save and remove signals in local browser storage.
- **Shareable signals:** URL parameters identify a specific signal for sharing.
- **Structured community proposals:** GitHub Issue Forms require a testable hypothesis, method, variables, evidence status, limitations and safety notes.
- **Bug reporting:** a separate reproducible bug form captures steps, expected behavior, actual behavior and environment.

## Architecture and constraints

- GitHub Pages hosts the static frontend.
- GitHub Actions runs the Node.js generator daily and commits the JSON output to the repository.
- The frontend uses plain HTML, CSS and JavaScript. Experiments run locally in the visitor's browser.
- No LLMs, inference APIs, paid APIs, database, or always-on server.
- No fake users, engagement metrics, or fabricated scientific claims.

## Scientific integrity

The daily generator is deterministic and template-based. It does **not** independently discover scientific facts or perform literature review. A signal is a hypothesis starter, not a scientific finding.

The network experiment is an explicitly simplified graph model. It reports two distinct quantities across 100 deterministic trials: the largest component as a fraction of surviving nodes (conditional connectivity), and as a fraction of the original node population (overall retained connectivity). It also reports mean survivors and mean largest-cluster size. It is not a validated model of a power grid, city, biological system, or production network. Real applications require measured parameters, domain expertise, independent validation and safety review.

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
- `app.js` — data loading, archive, saved signals, sharing and comparative experiment interface\n- `universe.js` — daily missions, specialist council, component blueprints, evidence ledger, local progression and world backup/restore
- `data/daily.json` — latest published signal
- `data/archive/index.json` — rolling archive (up to 365 entries)
- `scripts/generate.mjs` — deterministic, schema-validated signal generator
- `scripts/lib/network.mjs` — shared network experiment engine
- `tests/core.test.mjs` — zero-dependency regression tests
- `docs/NETWORK_MODEL.md` — model definition, metric and limitations\n- `docs/UNIVERSE_ARCHITECTURE.md` — universe schema and technical boundaries\n- `docs/PRODUCT_VISION.md` — core product concept and evolution principles
- `docs/MASTER_ROADMAP.md` — phased product and engineering plan with acceptance gates
- `docs/RESEARCH_PROTOCOL.md` — evidence classes, experiment metadata and validation standards\n- `CONTRIBUTING.md` — proposal review and contribution process
- `.github/workflows/daily-signal.yml` — scheduled publishing

## Contribute

Use the repository's **Propose a signal** issue form. Include the question, hypothesis, method, variables, references and limitations. Use **Report a bug** for reproducible product issues. For any real-world experiment, include appropriate safety review.
\n\n## Experiment engine v2\n\nThe browser now includes three deterministic, locally executed experiment families: network resilience (graph connectivity under random node loss), swarm exploration (coverage in an obstacle grid), and energy resilience (storage/generation/demand balance over 120 steps). Daily signals are assigned to a compatible family by transparent domain-name rules; this mapping is a routing heuristic, not scientific evidence. All models expose assumptions and caveats, run 100 seeded trials by default, and support CSV export, shareable setup URLs and one-factor sensitivity analysis. Runs and sensitivity sweeps can also be exported as JSON records with model version, seed, requested/effective parameters, signal context and trial-level outputs.\n\nModel outputs are synthetic teaching models, not validated predictions or empirical discoveries. Use controlled comparisons, change one parameter at a time, and consult domain experts before applying any result to real systems.\n
 
## Living universe experience

The Universe Control Room adds a playable progression loop:

- Four transparent specialist roles (Scout, Systems Architect, Skeptic and Builder) analyze the current signal using deterministic rules. They are not LLM agents.
- Mission directives reward local evolution XP for scanning, building and simulation.
- The Creation Bay stores named habitat, swarm, city, energy and ecosystem blueprints in browser storage.
- Blueprints can be stress-tested using the existing deterministic synthetic model families.
- A discovery log records local actions and can be exported as JSON.
- Community proposals route through GitHub Issue Forms for human review.

Progress is local to the browser/device. GitHub Pages has no user database, shared multiplayer state or server-side identity. XP is a local game mechanic, not scientific merit. Simulation outputs are synthetic teaching models, not validated predictions.

See docs/UNIVERSE_ARCHITECTURE.md for architecture, limitations and the next evolution path.

 
## Comparative experimentation and evidence ledger
The lab now compares a baseline with visitor-selected settings using paired deterministic random streams. It reports mean and median paired score changes and counts improved, tied and declined trials. Pairing improves repeatability but is not statistical proof or model validation.

Blueprints contain typed conceptual modules. Adding modules changes the bounded parameters used by the relevant synthetic stress-test model. This is an educational design proxy, not CAD, a physical bill of materials or an engineering specification.

The evidence ledger attaches HTTPS references to a signal and labels each source type and relationship (supports, challenges or context). Only URL format is checked; source contents and peer-review status are not automatically verified. Entries remain visibly user-submitted and unverified until human review.

Daily signals carry a versioned world-state object with biome, anomaly and a transparent pressure modifier. The modifier changes the initial lab setup and visitors can override it.

 
## Community review and contribution
Signal proposals enter through GitHub Issue Forms and are automatically labelled for review. A maintainer must check testability, evidence quality, limitations and safety before any accepted proposal is added to the deterministic generator. Issue submissions are not automatically published as daily signals. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Product and research standards

- [Master product and engineering roadmap](docs/MASTER_ROADMAP.md) — phased delivery plan with measurable exit gates.
- [Research integrity protocol](docs/RESEARCH_PROTOCOL.md) — evidence classes, experiment metadata, comparison rules, data provenance and validation ladder.

A roadmap item is not complete because it is documented; it is complete only when its acceptance gate is implemented and verified.
