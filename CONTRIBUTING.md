# Contributing to FUTURE//SIGNAL

Thanks for helping expand the experiment universe. Contributions are reviewed for clarity, reproducibility and scientific integrity.

## Propose a signal
Use the **Propose a signal** issue form. A useful proposal includes:
- A precise cross-disciplinary domain and testable hypothesis.
- One clear research question.
- A method with baseline/control and intervention.
- Variables, measurements and expected observations.
- References where available, clearly distinguished from speculation.
- Limitations, safety considerations and the boundary between toy models and real systems.

## Review and publishing flow
1. GitHub Issue Forms collect structured submissions.
2. The community-triage workflow labels new submissions and acknowledges receipt.
3. A maintainer reviews testability, evidence, safety, novelty and fit with the project's current model families.
4. Accepted ideas may be adapted into deterministic generator templates or a documented model proposal.
5. Changes are submitted through a pull request with tests and a clear caveat.
6. Only merged, validated code/data appears in the public daily signal archive.

Opening an issue does not automatically publish a signal or validate a claim. A proposal may be revised, deferred or declined.

## Model and code changes
- Keep generators deterministic for a fixed date and version.
- Add regression tests for new rules and experiment families.
- Document equations, units, assumptions, parameter bounds and failure modes.
- Never describe synthetic outputs as empirical discoveries, predictions or safety certification.
- Avoid adding paid services, credentials, external inference APIs or a permanent backend without an explicit project decision.

## Pull requests
Explain the problem, approach, tests, user-visible effect, scientific limitations and any migration impact. Keep changes grouped into coherent product-level batches.
