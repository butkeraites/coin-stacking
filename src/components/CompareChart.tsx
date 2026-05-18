import { useMemo } from 'react'
import { coinStackSurfaceArea, type StackParams } from '../lib/geometry'
import { LIMITS } from '../lib/url'

const WIDTH = 320
const HEIGHT = 150
const PAD = { top: 12, right: 14, bottom: 26, left: 40 }

export default function CompareChart({ params }: { params: StackParams }) {
  const points = useMemo(() => {
    const out: { n: number; value: number }[] = []
    for (
      let n = LIMITS.numberOfCoins.min;
      n <= LIMITS.numberOfCoins.max;
      n++
    ) {
      const value = coinStackSurfaceArea(
        params.radius,
        params.height,
        params.angle,
        n,
      )
      if (value !== null) out.push({ n, value })
    }
    return out
  }, [params.radius, params.height, params.angle])

  if (points.length < 2) {
    return (
      <section className="rounded-2xl bg-slate-800/70 p-4 ring-1 ring-white/10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Coins vs. surface area
        </h2>
        <p className="mt-2 text-sm text-slate-400">Undefined at this tilt.</p>
      </section>
    )
  }

  const minN = points[0].n
  const maxN = points[points.length - 1].n
  const values = points.map((p) => p.value)
  const minV = Math.min(...values)
  const maxV = Math.max(...values)
  const spanV = maxV - minV || 1

  const toX = (n: number) =>
    PAD.left + ((n - minN) / (maxN - minN)) * (WIDTH - PAD.left - PAD.right)
  const toY = (v: number) =>
    HEIGHT -
    PAD.bottom -
    ((v - minV) / spanV) * (HEIGHT - PAD.top - PAD.bottom)

  const path = points
    .map(
      (p, i) =>
        `${i === 0 ? 'M' : 'L'}${toX(p.n).toFixed(1)} ${toY(p.value).toFixed(1)}`,
    )
    .join(' ')

  const currentN = Math.round(params.numberOfCoins)
  const current = points.find((p) => p.n === currentN)

  return (
    <section className="space-y-2 rounded-2xl bg-slate-800/70 p-4 ring-1 ring-white/10">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
        Coins vs. surface area
      </h2>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label="Coin stack surface area as a function of coin count"
      >
        <line
          x1={PAD.left}
          y1={HEIGHT - PAD.bottom}
          x2={WIDTH - PAD.right}
          y2={HEIGHT - PAD.bottom}
          stroke="#475569"
        />
        <line
          x1={PAD.left}
          y1={PAD.top}
          x2={PAD.left}
          y2={HEIGHT - PAD.bottom}
          stroke="#475569"
        />
        <path d={path} fill="none" stroke="#d4af37" strokeWidth={2.5} />
        {current && (
          <circle
            cx={toX(current.n)}
            cy={toY(current.value)}
            r={4.5}
            fill="#f0c75e"
            stroke="#0f172a"
            strokeWidth={2}
          />
        )}
        <text x={PAD.left} y={HEIGHT - 8} fill="#94a3b8" fontSize={9}>
          {minN} coins
        </text>
        <text
          x={WIDTH - PAD.right}
          y={HEIGHT - 8}
          fill="#94a3b8"
          fontSize={9}
          textAnchor="end"
        >
          {maxN} coins
        </text>
        <text x={4} y={PAD.top + 6} fill="#94a3b8" fontSize={9}>
          {maxV.toFixed(1)}
        </text>
        <text x={4} y={HEIGHT - PAD.bottom} fill="#94a3b8" fontSize={9}>
          {minV.toFixed(1)}
        </text>
      </svg>
      <p className="text-xs text-slate-400">
        Marker shows the current {currentN}-coin stack. More coins expose more
        crescent edge, converging as the per-coin overlap shrinks.
      </p>
    </section>
  )
}
