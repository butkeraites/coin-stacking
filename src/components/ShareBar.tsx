import { useState } from 'react'
import type { StackParams } from '../lib/geometry'
import { encodeParams } from '../lib/url'

interface Props {
  params: StackParams
  onReset: () => void
}

export default function ShareBar({ params, onReset }: Props) {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const hash = encodeParams(params)
    const url = `${location.origin}${location.pathname}#${hash}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard blocked (e.g. insecure context) — at least update the bar.
      location.hash = hash
    }
  }

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={share}
        className="flex-1 rounded-xl bg-gold py-3 text-sm font-bold text-slate-900 transition active:scale-95"
      >
        {copied ? 'Link copied!' : 'Copy shareable link'}
      </button>
      <button
        type="button"
        onClick={onReset}
        className="rounded-xl bg-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 transition active:scale-95"
      >
        Reset
      </button>
    </div>
  )
}
