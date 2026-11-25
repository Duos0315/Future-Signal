# Network resilience model

## Purpose

This browser experiment is a small, deterministic graph exercise. It is intended to make assumptions visible and let visitors compare configurations. It is not a calibrated representation of a power grid, city, ecosystem, internet, or biological network.

## Graph construction

- There are N nodes arranged on a ring (supported range: 3–500).
- Each node connects to its k nearest neighbors clockwise and k nearest neighbors counter-clockwise.
- The degree control is therefore a *link radius*, not total degree. The nominal node degree is 2k for the supported configurations.
- Each node independently survives with probability 1 - p, where p is the selected failure rate.
- The model does not simulate recovery, weighted links, capacity, geography, attack strategies, or correlated failures.

## Metrics

For each trial:
1. Sample node survival independently.
2. Find connected components among surviving nodes with breadth-first search.
3. Let L be the size of the largest component, S the number of surviving nodes, and N the original node count.
4. Report both 100 × L/S (conditional connectivity; 0 when S is zero) and 100 × L/N (overall retained connectivity).

The interface headline is **retained connectivity**: the mean of 100 × L/N. It also shows **node survival rate** (100 × S/N), **conditional connectivity** (100 × L/S, or 0 when S=0), and mean largest-component size. These metrics answer different questions: how much of the original network remains connected, how many nodes survived, and how intact the survivors are as a group.

## Reproducibility

The seed is derived from the selected network settings and signal identifier using a small deterministic PRNG. Re-running the same configuration for the same signal produces the same trial sequence. Changing the signal or any model input changes the seed.

## Interpretation limits

Retained connectivity prevents a 100% conditional-connectivity score from hiding node loss. Example: if N=60, S=51 and L=51, then retained connectivity is 85%, survival rate is 85%, and conditional connectivity is 100%. The remaining 51 nodes are perfectly connected to one another, but 9 of the original 60 nodes failed.

These metrics do not measure total service delivered, capacity, latency, resilience to targeted attacks, recovery time, or the cost of adding links. A future model should compare random with targeted failures. Do not use this toy result to make engineering, safety, or investment decisions.

## Additional browser experiment families

The experiment selector exposes two additional synthetic models. The resource model can be used as a deliberately simplified analogy for energy, water or other bounded supplies; it does not model the domain-specific physics:

- **Swarm exploration:** a 24 × 24 grid, randomly placed blocked cells, and simple agents that move to neighboring free cells. The score is the share of reachable cells visited during 90 movement steps. Agent behavior is intentionally minimal; it is not a validated ant-colony or multi-robot algorithm.
- **Energy resilience:** a capped storage reservoir is updated over 120 time steps using stochastic generation and demand. The primary score is the percentage of steps where demand is fully served; average stored reserve and unmet energy are secondary diagnostics. Units are illustrative and are not calibrated to a real installation.

All three families use seeded pseudo-randomness and 100 trials by default. The selected signal identifier and model inputs determine the seed. Results are reproducible for the same code version and settings, but they are not empirical measurements. Domain-to-model assignment is a transparent keyword heuristic. A daily prompt may still describe a research question broader than the toy model can answer; the interface must disclose that mismatch rather than implying the simulation validates the prompt.

## Paired scenario comparisons

The comparison engine runs baseline and intervention scenarios for the same number of trials with the same independently seeded random stream for each trial index. It reports per-trial score deltas, mean and median delta, and counts of improved, tied and declined trials. Models may consume random values differently within a trial, so paired seeds are a reproducibility aid rather than a strict statistical design. It does not estimate confidence intervals or establish causal effects.

## Reader guide

The experiment interface includes two explanation levels. The beginner guide uses a familiar analogy and a worked example; the expert notes define variables, formulas and assumptions. Both views use the same model output. The network headline score is retained connectivity (largest component divided by the original node count), while survival rate and conditional connectivity remain separate diagnostics.
