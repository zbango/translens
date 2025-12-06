import type { ProviderId, SelectionData } from '../../types'

interface TranslationPanelProps {
  selection: SelectionData | null
  translatedText: string | null
  loading: boolean
  error: string | null
  cached: boolean
  providerUsed: ProviderId | null
  onClear: () => void
}

export function TranslationPanel({
  selection,
  translatedText,
  loading,
  error,
  cached,
  providerUsed,
  onClear,
}: TranslationPanelProps) {
  const hasData = Boolean(selection)
  return (
    <div className="rounded-2xl glass p-4 border border-slate-800/60 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-slate-100">Translation</p>
          <p className="text-xs text-slate-500">
            {providerUsed ? providerUsed.toUpperCase() : 'Select text to translate'}
            {cached ? ' • cached' : ''}
          </p>
        </div>
        <button
          className="text-xs text-slate-400 hover:text-slate-200"
          onClick={onClear}
          disabled={!hasData}
        >
          Clear
        </button>
      </div>

      <div className="text-xs text-slate-400 mb-2 line-clamp-3 min-h-[40px] italic">
        {selection ? `“${selection.text}”` : 'Highlight text in the PDF to see translation here.'}
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 flex-1 min-h-[180px]">
        {loading && <p className="text-slate-400 text-sm">Translating...</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {!loading && !error && translatedText && (
          <p className="text-slate-100 text-base whitespace-pre-wrap">{translatedText}</p>
        )}
        {!loading && !error && !translatedText && (
          <p className="text-slate-500 text-sm">No translation yet.</p>
        )}
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          className="px-3 py-1.5 rounded-lg bg-accent text-slate-900 text-sm font-semibold disabled:opacity-50"
          onClick={() => translatedText && navigator.clipboard.writeText(translatedText)}
          disabled={!translatedText}
        >
          Copy
        </button>
      </div>
    </div>
  )
}

