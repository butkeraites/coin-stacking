import { describe, expect, it } from 'vitest'
import {
  coinStackSurfaceArea,
  cylinderSurfaceArea,
  luneArea,
  obliqueCylinderSurfaceArea,
} from './geometry'

const close = (a: number, b: number) => Math.abs(a - b) < 1e-9

describe('cylinderSurfaceArea', () => {
  it('matches 2*pi*r*(r + h)', () => {
    expect(close(cylinderSurfaceArea(1, 1), 2 * Math.PI * 2)).toBe(true)
  })
})

describe('obliqueCylinderSurfaceArea', () => {
  it('equals the right cylinder when vertical (angle = pi/2)', () => {
    const ocsa = obliqueCylinderSurfaceArea(1, 1, Math.PI / 2)
    expect(ocsa).not.toBeNull()
    expect(close(ocsa as number, cylinderSurfaceArea(1, 1))).toBe(true)
  })

  it('returns null for degenerate angles', () => {
    expect(obliqueCylinderSurfaceArea(1, 1, 0)).toBeNull()
    expect(obliqueCylinderSurfaceArea(1, 1, Math.PI)).toBeNull()
  })
})

describe('luneArea', () => {
  it('is a full disc when the neighbour does not overlap', () => {
    expect(close(luneArea(1, 2), Math.PI)).toBe(true)
    expect(close(luneArea(1, 5), Math.PI)).toBe(true)
  })

  it('is zero when the neighbour fully overlaps', () => {
    expect(close(luneArea(1, 0), 0)).toBe(true)
  })
})

describe('coinStackSurfaceArea', () => {
  it('equals the oblique cylinder for a single coin', () => {
    const angle = Math.PI / 3
    const cssa = coinStackSurfaceArea(1, 1, angle, 1)
    const ocsa = obliqueCylinderSurfaceArea(1, 1, angle)
    expect(close(cssa as number, ocsa as number)).toBe(true)
  })

  it('grows with the number of coins', () => {
    const angle = Math.PI / 4
    const five = coinStackSurfaceArea(1, 1, angle, 5) as number
    const ten = coinStackSurfaceArea(1, 1, angle, 10) as number
    expect(ten).toBeGreaterThan(five)
  })

  it('returns null for degenerate input', () => {
    expect(coinStackSurfaceArea(1, 1, 0, 5)).toBeNull()
    expect(coinStackSurfaceArea(1, 1, Math.PI / 3, 0)).toBeNull()
  })
})
