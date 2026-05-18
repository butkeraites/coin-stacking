// TypeScript port of main.py. Kept formula-for-formula in sync with the
// Python module so both stay verifiable against each other.

export interface StackParams {
  /** Coin radius. */
  radius: number
  /** Total stack height (sum of every coin's sub-height). */
  height: number
  /** Lean of the stack from the base plane, in radians. */
  angle: number
  /** How many coins make up the stack. */
  numberOfCoins: number
}

const TWO_PI = 2 * Math.PI

// sin(angle) is treated as zero within this tolerance, since floating-point
// sin(pi) is ~1e-16 rather than exactly 0.
const DEGENERATE_SIN = 1e-9

/** Total surface area of a right cylinder: 2*pi*r*(r + h). */
export function cylinderSurfaceArea(radius: number, height: number): number {
  return TWO_PI * radius * (radius + height)
}

/**
 * Total surface area of an oblique cylinder leaning `angle` radians from its
 * base plane. The slanted axis has length h / sin(angle).
 * Returns null for degenerate angles where sin(angle) === 0.
 */
export function obliqueCylinderSurfaceArea(
  radius: number,
  height: number,
  angle: number,
): number | null {
  const sinA = Math.sin(angle)
  if (Math.abs(sinA) < DEGENERATE_SIN) return null
  return TWO_PI * radius * (radius + height / Math.abs(sinA))
}

/**
 * Exposed crescent (lune) area of one coin face partially covered by an
 * equal-radius neighbour whose centre is `distance` away: the full disc
 * minus the circular lens of overlap. With no overlap the whole disc shows.
 */
export function luneArea(radius: number, distance: number): number {
  const d = Math.abs(distance)
  const fullDisc = Math.PI * radius * radius
  if (d >= 2 * radius) return fullDisc
  const lens =
    2 * radius * radius * Math.acos(d / (2 * radius)) -
    (d / 2) * Math.sqrt(4 * radius * radius - d * d)
  return fullDisc - lens
}

/**
 * Surface area of a sheared stack of identical coins. Sums the lateral wall
 * of every coin, the two outer end caps, and the exposed lune of each
 * interior face. Returns null for degenerate angles.
 */
export function coinStackSurfaceArea(
  radius: number,
  height: number,
  angle: number,
  numberOfCoins: number,
): number | null {
  const sinA = Math.sin(angle)
  const n = Math.floor(numberOfCoins)
  if (Math.abs(sinA) < DEGENERATE_SIN || n < 1) return null

  const lateral = TWO_PI * radius * (height / Math.abs(sinA))
  const caps = 2 * Math.PI * radius * radius
  if (n === 1) return lateral + caps

  const distanceBetweenCenters = height / n / Math.tan(angle)
  const interior = 2 * (n - 1) * luneArea(radius, distanceBetweenCenters)
  return lateral + caps + interior
}

export interface StackAreas {
  csa: number
  ocsa: number | null
  cssa: number | null
}

/** Convenience wrapper computing all three areas for a parameter set. */
export function computeAreas(params: StackParams): StackAreas {
  return {
    csa: cylinderSurfaceArea(params.radius, params.height),
    ocsa: obliqueCylinderSurfaceArea(
      params.radius,
      params.height,
      params.angle,
    ),
    cssa: coinStackSurfaceArea(
      params.radius,
      params.height,
      params.angle,
      params.numberOfCoins,
    ),
  }
}
