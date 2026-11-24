# Network resilience model

## Purpose

This browser experiment is a small, deterministic graph exercise. It is intended to make assumptions visible and let visitors compare configurations. It is not a calibrated representation of a power grid, city, ecosystem, internet, or biological network.

## Graph construction

- There are N nodes arranged on a ring.
- Each node connects to its k nearest neighbors clockwise and k nearest neighbors counter-clockwise.
- The degree control is therefore a *link radius*, not total degree. The nominal node degree is 2k for the supported even-size configurations.
- Each node independently survives with probability 1 - p, where p is the selected failure rate.
- The model does not simulate recovery, weighted links, capacity, geography, attack strategies, or correlated failures.

## Metric

For each trial:
1. Sample node survival independently.
2. Find connected components among surviving nodes with breadth-first search.
3. Let L be the size of the largest component and S the number of surviving nodes.
4. Report 100 × L/S. If S is zero, report 0.

The interface reports the mean, minimum and maximum of 100 trials. A value of 100% means all surviving nodes belong to one component. It does **not** mean all original nodes survived.

## Reproducibility

The seed is derived from the selected network settings and signal identifier using a small deterministic PRNG. Re-running the same configuration for the same signal produces the same trial sequence. Changing the signal or any model input changes the seed.

## Interpretation limits

This metric measures fragmentation conditional on survivors. It does not measure total service delivered, capacity, latency, resilience to targeted attacks, recovery time, or the cost of adding links. A high score at a high failure rate can still mean that very few nodes remain, so always inspect the failure-rate setting and survivor count.

A future model should report both (a) fraction of original nodes in the largest component and (b) fraction of surviving nodes in the largest component, and should compare random with targeted failures. Do not use this toy result to make engineering, safety, or investment decisions.
