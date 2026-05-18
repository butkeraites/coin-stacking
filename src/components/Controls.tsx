import type { StackParams } from '../lib/geometry'
import { LIMITS } from '../lib/url'

interface Props {
  params: StackParams
  onChange: (next: StackParams) => void
}

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit?: string
  format?: (value: number) => string
  onChange: (value: number) => void
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  format,
  onChange,
}: SliderProps) {
  return (
    <label className="block">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-sm font-medium text-slate-300">{label}</span>
        <span className="text-sm font-semibold text-gold">
          {format ? format(value) : value}
          {unit ? ` ${unit}` : ''}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  )
}

export default function Controls({ params, onChange }: Props) {
  const angleDeg = (params.angle * 180) / Math.PI

  return (
    <section className="space-y-5 rounded-2xl bg-slate-800/70 p-4 ring-1 ring-white/10">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
        Parameters
      </h2>
      <Slider
        label="Coin radius"
        value={params.radius}
        {...LIMITS.radius}
        format={(v) => v.toFixed(1)}
        onChange={(radius) => onChange({ ...params, radius })}
      />
      <Slider
        label="Stack height"
        value={params.height}
        {...LIMITS.height}
        format={(v) => v.toFixed(1)}
        onChange={(height) => onChange({ ...params, height })}
      />
      <Slider
        label="Tilt angle"
        value={angleDeg}
        min={LIMITS.angleDeg.min}
        max={LIMITS.angleDeg.max}
        step={LIMITS.angleDeg.step}
        unit="°"
        format={(v) => v.toFixed(0)}
        onChange={(deg) =>
          onChange({ ...params, angle: (deg * Math.PI) / 180 })
        }
      />
      <Slider
        label="Number of coins"
        value={params.numberOfCoins}
        {...LIMITS.numberOfCoins}
        onChange={(numberOfCoins) => onChange({ ...params, numberOfCoins })}
      />
    </section>
  )
}
