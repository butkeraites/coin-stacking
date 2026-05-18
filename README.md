# Coin Stack Studio

Compute and visualize the surface areas of a tilted stack of coins.

The project has two parts that implement the same geometry:

- **`main.py`** — a standard-library Python reference that prints surface
  areas for a set of test cases. Run it with `python3 main.py`.
- **Coin Stack Studio** (`src/`) — a mobile-first, installable web app that
  renders the stack in 3D and recomputes the areas live as you drag sliders.

## The three surface areas

| Code | Body | Formula idea |
|------|------|--------------|
| CSA  | Right cylinder | `2πr(r + h)` |
| OCSA | Oblique (leaning) cylinder | slant axis `h / sin θ` |
| CSSA | Real coin stack | coin walls + end caps + exposed crescents |

## Running the web app

```bash
npm install
npm run dev      # local dev server
npm test         # geometry test suite
npm run build    # static production bundle in dist/
```

## Deployment

Pushes to `main` are built and published to GitHub Pages by
`.github/workflows/deploy.yml`. Enable it once under
**Settings → Pages → Build and deployment → Source: GitHub Actions**.
The app is a static bundle and works offline once installed.
