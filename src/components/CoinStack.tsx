import { useMemo } from 'react'
import type { StackParams } from '../lib/geometry'

interface Props {
  params: StackParams
}

/**
 * Renders the coins as flat cylinders sheared along X. Each coin keeps its
 * faces parallel to the base; the lean comes from a constant lateral offset
 * between neighbours, matching the oblique-cylinder model in geometry.ts.
 */
export default function CoinStack({ params }: Props) {
  const { radius, height, angle, numberOfCoins } = params
  const n = Math.max(1, Math.round(numberOfCoins))
  const coinHeight = height / n
  const offset = coinHeight / Math.tan(angle)

  const positions = useMemo(() => {
    const centerX = ((n - 1) * offset) / 2
    return Array.from({ length: n }, (_, i): [number, number, number] => [
      i * offset - centerX,
      (i + 0.5) * coinHeight - height / 2,
      0,
    ])
  }, [n, offset, coinHeight, height])

  return (
    <group>
      {positions.map((position, i) => {
        const isEnd = i === 0 || i === n - 1
        return (
          <mesh key={i} position={position}>
            <cylinderGeometry args={[radius, radius, coinHeight, 72]} />
            <meshStandardMaterial
              color={isEnd ? '#f0c75e' : '#d4af37'}
              metalness={0.85}
              roughness={0.28}
            />
          </mesh>
        )
      })}
    </group>
  )
}
