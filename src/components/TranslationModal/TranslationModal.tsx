import { useEffect, useMemo } from 'react'
import type { ProviderId, SelectionData } from '../../types'

interface TranslationModalProps {
  selection: SelectionData | null
  translatedText: string | null
  loading: boolean
  error: string | null
  cached: boolean
  providerUsed: ProviderId | null
  onClose: () => void
  onCopy?: () => void
}

export function TranslationModal({
  selection,
  translatedText,
  loading,
  error,
  cached,
  providerUsed,
  onClose,
}: TranslationModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const cardStyle = useMemo(() => {
    if (!selection) return null
    const padding = 16
    const width = 360
    const top = selection.rect.bottom + window.scrollY + 8
    const clampedLeft = Math.min(
      Math.max(padding, selection.rect.left + window.scrollX),
      window.innerWidth - width - padding,
    )
    return { top, left: clampedLeft, width }
  }, [selection])

  if (!selection || !cardStyle) return null

  return (
    <div
      className="fixed z-40 max-w-[85vw] rounded-xl glass p-4 text-slate-100 shadow-2xl border border-slate-800/70"
      style={cardStyle}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-slate-400">
          {providerUsed ? providerUsed.toUpperCase() : 'TRANSLATION'} {cached ? '(cached)' : ''}
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 text-sm rounded px-2"
          aria-label="Close translation"
        >
          ✕
        </button>
      </div>
      <div className="text-xs text-slate-500 mb-2 line-clamp-2 italic">“{selection.text}”</div>
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 min-h-[72px]">
        {loading && <p className="text-slate-400 text-sm">Translating...</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {!loading && !error && translatedText && (
          <p className="text-slate-100 text-base whitespace-pre-wrap">{translatedText}</p>
        )}
      </div>
      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          className="px-3 py-1.5 rounded-lg bg-accent text-slate-900 text-sm font-semibold"
          onClick={() => translatedText && navigator.clipboard.writeText(translatedText)}
          disabled={!translatedText}
        >
          Copy
        </button>
      </div>
    </div>
  )
}

