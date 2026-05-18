# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`coin-stacking` is a geometry project that computes surface areas of solid bodies
related to a stack of coins. The entire program lives in `main.py` and depends
only on the Python standard library (`math`).

## Commands

- Run the program: `python main.py` — prints surface areas for the hard-coded
  `test_cases` list in the `__main__` block.
- There is no build step, dependency manifest, lint config, or test suite.

## Architecture

`main.py` exposes three surface-area calculators, each accepting `**kwargs` so
they can all be called with the same test-case dict:

- `calculate_CSA(radius, height)` — straight ("right") cylinder surface area.
- `calculate_OCSA(radius, height, angle)` — oblique cylinder surface area;
  returns `None` when `angle` is a multiple of `math.pi` (degenerate case).
- `calculate_CSSA(radius, height, angle, number_of_coins)` — coin-stack surface
  area. Models the stack as overlapping discs, summing per-coin `lune_area`
  contributions via a nested helper, and returns `None` for degenerate angles.

The `__main__` block iterates a list of test-case dicts, calls all three
functions on each, and prints the results indexed by case number.

## Conventions

- Functions are named by acronym (CSA / OCSA / CSSA); the docstring on each
  function expands the acronym — keep that convention when adding calculators.
- Degenerate inputs return `None` rather than raising; preserve this pattern.
- New test scenarios are added by appending dicts to `test_cases` in `main.py`.
