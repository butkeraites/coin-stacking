import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import CoinStack from './CoinStack'
import type { StackParams } from '../lib/geometry'

interface Props {
  params: StackParams
}

export default function Visualizer({ params }: Props) {
  return (
    <div className="relative h-[44vh] min-h-[260px] w-full overflow-hidden rounded-2xl bg-slate-800 ring-1 ring-white/10">
      <Canvas camera={{ position: [5, 3.5, 7], fov: 42 }} dpr={[1, 2]}>
        <color attach="background" args={['#1e293b']} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[6, 9, 5]} intensity={1.2} />
        <directionalLight position={[-6, 3, -4]} intensity={0.4} />
        <CoinStack params={params} />
        <gridHelper
          args={[24, 24, '#475569', '#334155']}
          position={[0, -params.height / 2 - 0.001, 0]}
        />
        <OrbitControls
          enablePan={false}
          minDistance={2}
          maxDistance={28}
          autoRotate
          autoRotateSpeed={0.6}
        />
      </Canvas>
      <span className="pointer-events-none absolute bottom-2 left-3 text-xs text-slate-400">
        drag to orbit · pinch to zoom
      </span>
    </div>
  )
}
