# FUTURE//SIGNAL — Master Product & Engineering Roadmap

**Status:** Living plan; implementation status must be updated only when code, tests and evidence support the claim.

## North star

An open experimental platform that helps people understand complex systems, explore possible futures, test interventions and inspect the evidence and uncertainty behind every result.

FUTURE//SIGNAL is a decision-support and learning platform, not an oracle. A generated signal is a hypothesis prompt. A synthetic simulation is a teaching model. Neither is a verified discovery or a real-world forecast.

## Product pillars

1. **Research** — question formulation, experiments, datasets, evidence records and reproducible reports.
2. **Risk intelligence** — source-backed monitoring of changing indicators, with explicit freshness, coverage and uncertainty.
3. **World simulation** — connected system models, scenarios, failure propagation, recovery and interventions.
4. **Academy** — beginner, intermediate and expert explanations grounded in the same model and data.
5. **Open discovery** — public contributions, review, versioned experiments and reproducible publications.
6. **Decision support** — compare options and communicate trade-offs without automating high-stakes decisions.

## Engineering principles

- Preserve the static GitHub Pages experience and zero-paid-service baseline until a separately reviewed architecture change is justified.
- Keep model code deterministic where possible; record seed, model version and effective parameters.
- Validate inputs at module boundaries; reject non-finite and structurally invalid values.
- Keep synthetic outputs visibly distinct from measured observations.
- Store source provenance, retrieval time, data coverage and verification state for external evidence.
- Never equate a URL with a verified source or a model score with real-world accuracy.
- Keep user-submitted evidence unverified until human review.
- Add new capabilities behind tests and preserve backwards compatibility for exported world records.
- Do not introduce credentials, private user data or secrets into the static client.
- No autonomous actuation or safety-critical recommendations.

## Delivery phases and acceptance gates

### Phase 1 — Scientific foundation

**Scope**
- Input validation and effective parameter reporting.
- Versioned experiment definitions and run metadata.
- Baseline/intervention comparison and sensitivity analysis.
- Benchmarks, edge-case tests and reproducibility checks.
- Evidence record schema and clear verification states.
- Beginner/expert interpretation and limitation disclosures.

**Exit gate**
- All supported models pass deterministic regression tests.
- Invalid input is rejected explicitly.
- Every saved run can identify its model version, seed, effective parameters and assumptions.
- No UI implies a synthetic result is an empirical forecast.

### Phase 2 — Real-world data and signal monitoring

**Scope**
- Public data adapters with source-specific contracts.
- Unit, timezone, geography and missing-data normalization.
- Retrieval timestamp, source publication timestamp and freshness policy.
- Source provenance and data licensing notes.
- Signal thresholds tested against historical data.

**Exit gate**
- Every displayed observation is traceable to a source and timestamp.
- Missing, stale or incomplete data is visible.
- Alert quality is measured with false-positive and false-negative analysis.
- No risk alert is described as a prediction without validated performance.

### Phase 3 — Connected system simulator

**Scope**
- Typed entities, links, dependencies and constraints.
- Geographic and temporal dimensions where data supports them.
- Cascading failures, targeted/random disruptions and recovery.
- Intervention comparison and parameter sensitivity.
- Domain adapters kept separate from generic simulation primitives.

**Exit gate**
- Each domain model has documented equations, calibration data, assumptions and independent validation.
- Model scope and unsupported conditions are visible.
- Experts review any real-world application before decision use.

### Phase 4 — Research and education

**Scope**
- Guided research questions and experiment templates.
- Shared beginner/intermediate/expert explanations.
- Exportable reports and reproducibility bundles.
- Learning checks and worked examples.

**Exit gate**
- A new user can reproduce a tutorial without hidden setup.
- Exports contain enough metadata to rerun the experiment.
- Educational content distinguishes analogy from domain evidence.

### Phase 5 — Open collaboration

**Scope**
- Reviewed submissions, project versions and contribution history.
- Peer review and moderation workflows.
- Public/private sharing only after privacy and backend architecture review.
- Citation and attribution support.

**Exit gate**
- Submission status and review history are auditable.
- Unreviewed content cannot appear as verified findings.
- Privacy, abuse and retention controls are documented.

### Phase 6 — AI-assisted research

**Scope**
- Optional AI assistance for literature discovery, hypothesis drafting and experiment configuration.
- Source-grounded summaries with claim-level citations.
- Contradiction detection and human review.
- Sandboxed, permission-limited tool execution.

**Exit gate**
- AI claims are traceable to sources.
- AI-generated content is labelled.
- No model can silently publish findings or execute real-world interventions.
- Evaluation includes citation correctness, omission and hallucination audits.

## First research tracks: Pakistan to global

Start with bounded, public-data case studies:
- Karachi urban heat and rainfall exposure (only where reliable spatial data exists).
- Water availability and demand indicators.
- Electricity generation/demand and outage resilience where licensed data is available.
- Urban mobility and transport network resilience where open network data exists.

Expand to regional and global comparisons only after source coverage and methodology are documented. Do not infer city-level conditions from national averages.

## Current verified baseline

The repository currently contains:
- Static HTML/CSS/JavaScript frontend.
- Deterministic daily hypothesis prompt generator.
- Three synthetic experiment families: network, swarm and bounded-resource/energy.
- Paired deterministic baseline/intervention comparisons.
- Browser-local universe progress and evidence entries.
- GitHub Actions generation and regression workflow.
- GitHub Issue Forms for proposals and bug reports.

The current platform does **not** provide a permanent backend, shared identity, multiplayer state, autonomous literature review, validated real-world forecasts or independently verified discoveries.

## Change control

Every implementation batch should:
1. Start from a repository audit and current branch head.
2. Use a feature branch.
3. Include tests and documentation.
4. Run CI and inspect the result.
5. Open a reviewable pull request.
6. Merge only after checks pass and the diff is reviewed.

A roadmap item is not complete because it is described here; it is complete only when the acceptance gate is met.
