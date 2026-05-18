import type { StackParams } from './geometry'

export const DEFAULT_PARAMS: StackParams = {
  radius: 1,
  height: 1,
  angle: Math.PI / 3,
  numberOfCoins: 5,
}

export const LIMITS = {
  radius: { min: 0.1, max: 5, step: 0.1 },
  height: { min: 0.1, max: 10, step: 0.1 },
  /** Tilt is edited in degrees in the UI, stored in radians. */
  angleDeg: { min: 10, max: 170, step: 1 },
  numberOfCoins: { min: 1, max: 40, step: 1 },
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const round = (value: number) => Math.round(value * 1000) / 1000

/** Serialise params into a URL hash fragment (angle exposed as degrees). */
export function encodeParams(params: StackParams): string {
  const query = new URLSearchParams({
    r: String(round(params.radius)),
    h: String(round(params.height)),
    a: String(round((params.angle * 180) / Math.PI)),
    n: String(Math.round(params.numberOfCoins)),
  })
  return query.toString()
}

/** Parse a URL hash fragment back into clamped, valid params. */
export function decodeParams(hash: string): StackParams {
  const query = new URLSearchParams(hash.replace(/^#/, ''))
  const pick = (key: string, fallback: number) => {
    const raw = query.get(key)
    const value = Number(raw)
    return raw !== null && Number.isFinite(value) ? value : fallback
  }

  const degrees = clamp(
    pick('a', (DEFAULT_PARAMS.angle * 180) / Math.PI),
    LIMITS.angleDeg.min,
    LIMITS.angleDeg.max,
  )

  return {
    radius: clamp(
      pick('r', DEFAULT_PARAMS.radius),
      LIMITS.radius.min,
      LIMITS.radius.max,
    ),
    height: clamp(
      pick('h', DEFAULT_PARAMS.height),
      LIMITS.height.min,
      LIMITS.height.max,
    ),
    angle: (degrees * Math.PI) / 180,
    numberOfCoins: Math.round(
      clamp(
        pick('n', DEFAULT_PARAMS.numberOfCoins),
        LIMITS.numberOfCoins.min,
        LIMITS.numberOfCoins.max,
      ),
    ),
  }
}
