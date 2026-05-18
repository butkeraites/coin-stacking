# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`coin-stacking` computes the surface areas of solid bodies formed by a tilted
("sheared") stack of coins. It has two parts that implement the **same math**:

- `main.py` — the canonical Python reference implementation (standard library
  only). Run it directly to print results for hard-coded test cases.
- `src/` — **Coin Stack Studio**, a mobile-first PWA that visualizes the stack
  in 3D and computes the areas live in the browser.

`src/lib/geometry.ts` is a deliberate formula-for-formula port of `main.py`.
**When you change a formula, change it in both files** and keep
`src/lib/geometry.test.ts` green.

## Commands

- `python3 main.py` — run the reference implementation.
- `npm install` — install web app dependencies.
- `npm run dev` — start the Vite dev server.
- `npm test` — run the Vitest geometry suite (`vitest run`).
- `npm run build` — type-check (`tsc -b`) and produce the static `dist/` bundle.
- `npm run preview` — serve the built bundle locally.
- Run one test file: `npx vitest run src/lib/geometry.test.ts`

## The geometry

Three surface-area calculators, each with a Python and a TypeScript form:

- **CSA** — right cylinder total surface area, `2*pi*r*(r + h)`.
- **OCSA** — oblique cylinder leaning `angle` radians from its base; the slant
  axis length is `h / sin(angle)`.
- **CSSA** — coin stack: sums every coin's lateral wall, the two outer end
  caps, and the exposed crescent (`lune`) of each interior face. The `lune` is
  a full disc minus the circular lens of overlap with the neighbouring coin.

Degenerate angles (`sin(angle)` within `1e-9` of zero) return `None` in Python
and `null` in TypeScript — preserve this convention. A single-coin CSSA equals
OCSA, which the test suite asserts.

## Web app architecture

- **Stack:** Vite + React 18 + TypeScript, Tailwind CSS, `@react-three/fiber`
  + `drei` for the Three.js 3D view, `vite-plugin-pwa` for offline/installable
  support. No backend — the app is a fully static bundle.
- **State flows one way:** `App.tsx` holds a single `StackParams` object and
  passes it down. Every parameter change is mirrored into the URL hash
  (`src/lib/url.ts`, `encode/decodeParams`), so any view is shareable and
  restorable. `App.tsx` also listens for `hashchange`.
- **Components** (`src/components/`): `Visualizer`/`CoinStack` (3D render),
  `Controls` (sliders), `ResultsCard` (the three areas), `CompareChart`
  (SVG plot of CSSA vs. coin count), `ShareBar`.
- **Deploy:** `.github/workflows/deploy.yml` builds and publishes `dist/` to
  GitHub Pages on every push to `main`. `vite.config.ts` `base` is
  `/coin-stacking/` and **must match the repo name** for asset URLs to resolve.

## Conventions

- Calculator functions are named by acronym (CSA / OCSA / CSSA); each docstring
  expands the acronym — keep that when adding calculators.
- Angles are radians internally; the UI edits degrees and converts at the
  boundary. Parameter ranges live in `LIMITS` in `src/lib/url.ts`.
- New Python test scenarios are appended to `test_cases` in `main.py`.
