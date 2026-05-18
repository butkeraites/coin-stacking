import { useCallback, useEffect, useState } from 'react'
import type { StackParams } from './lib/geometry'
import { DEFAULT_PARAMS, decodeParams, encodeParams } from './lib/url'
import Visualizer from './components/Visualizer'
import Controls from './components/Controls'
import ResultsCard from './components/ResultsCard'
import CompareChart from './components/CompareChart'
import ShareBar from './components/ShareBar'

export default function App() {
  const [params, setParams] = useState<StackParams>(() =>
    decodeParams(window.location.hash),
  )

  // Keep the URL hash in sync so the current view is always shareable.
  useEffect(() => {
    const next = `#${encodeParams(params)}`
    if (next !== window.location.hash) {
      window.history.replaceState(null, '', next)
    }
  }, [params])

  // React to back/forward navigation and externally pasted links.
  useEffect(() => {
    const onHashChange = () => setParams(decodeParams(window.location.hash))
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const reset = useCallback(() => setParams(DEFAULT_PARAMS), [])

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col gap-4 p-4 pb-10 lg:max-w-5xl">
      <header className="pt-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          Coin Stack <span className="text-gold">Studio</span>
        </h1>
        <p className="text-sm text-slate-400">
          Tilt a stack of coins and watch its surface area change.
        </p>
      </header>

      <Visualizer params={params} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Controls params={params} onChange={setParams} />
        <ResultsCard params={params} />
      </div>

      <CompareChart params={params} />
      <ShareBar params={params} onReset={reset} />

      <footer className="pt-2 text-center text-xs text-slate-500">
        Surface-area math ported from <code>main.py</code> · works offline
      </footer>
    </div>
  )
}
