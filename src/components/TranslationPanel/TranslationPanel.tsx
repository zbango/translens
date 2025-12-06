import { useTranslation } from "react-i18next";
import type { ProviderId, SelectionData } from "../../types";

interface TranslationPanelProps {
  selection: SelectionData | null;
  translatedText: string | null;
  loading: boolean;
  error: string | null;
  cached: boolean;
  providerUsed: ProviderId | null;
  onClear: () => void;
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
  const { t } = useTranslation();
  const hasData = Boolean(selection);
  return (
    <div className="rounded-2xl glass p-4 border border-slate-800/60 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-slate-100">
            {t("translation.title")}
          </p>
          <p className="text-xs text-slate-400">
            {providerUsed
              ? providerUsed.toUpperCase()
              : t("translation.selectPrompt")}
            {cached ? ` • ${t("translation.cached")}` : ""}
          </p>
        </div>
        <button
          className="text-xs text-slate-400 hover:text-slate-200"
          onClick={onClear}
          disabled={!hasData}
        >
          {t("translation.clear")}
        </button>
      </div>

      <div className="text-xs text-slate-400 mb-2 line-clamp-3 min-h-[40px] italic">
        {selection ? `“${selection.text}”` : t("translation.selectPrompt")}
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 flex-1 min-h-[180px]">
        {loading && (
          <p className="text-slate-400 text-sm">
            {t("translation.translating")}
          </p>
        )}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {!loading && !error && translatedText && (
          <p className="text-slate-100 text-base whitespace-pre-wrap">
            {translatedText}
          </p>
        )}
        {!loading && !error && !translatedText && (
          <p className="text-slate-400 text-sm">
            {t("translation.noTranslation")}
          </p>
        )}
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          className="px-3 py-1.5 rounded-lg bg-accent text-slate-900 text-sm font-semibold disabled:opacity-50"
          onClick={() =>
            translatedText && navigator.clipboard.writeText(translatedText)
          }
          disabled={!translatedText}
        >
          {t("translation.copy")}
        </button>
      </div>
    </div>
  );
}
