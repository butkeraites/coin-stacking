import { computeAreas, type StackParams } from '../lib/geometry'

const format = (value: number | null) =>
  value === null ? 'Undefined at this tilt' : value.toFixed(3)

const ROWS = [
  {
    key: 'csa' as const,
    code: 'CSA',
    name: 'Cylinder surface area',
    blurb: 'A single upright coin with no tilt — 2πr(r + h).',
  },
  {
    key: 'ocsa' as const,
    code: 'OCSA',
    name: 'Oblique cylinder surface area',
    blurb: 'The whole stack sheared into one leaning cylinder.',
  },
  {
    key: 'cssa' as const,
    code: 'CSSA',
    name: 'Coin stack surface area',
    blurb: 'Real stack: every coin wall plus the exposed crescents.',
  },
]

export default function ResultsCard({ params }: { params: StackParams }) {
  const areas = computeAreas(params)

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
        Surface areas
      </h2>
      {ROWS.map((row) => (
        <div
          key={row.key}
          className="rounded-2xl bg-slate-800/70 p-4 ring-1 ring-white/10"
        >
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <span className="rounded bg-gold/20 px-1.5 py-0.5 text-xs font-bold text-gold">
                {row.code}
              </span>
              <span className="ml-2 text-sm text-slate-300">{row.name}</span>
            </div>
            <span className="text-lg font-bold tabular-nums text-white">
              {format(areas[row.key])}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">{row.blurb}</p>
        </div>
      ))}
    </section>
  )
}
