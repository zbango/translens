import { useState } from "react";
import "./App.css";
import { FileUpload } from "./components/FileUpload/FileUpload";
import { PDFViewer } from "./components/PDFViewer/PDFViewer";
import { SettingsPanel } from "./components/Settings/SettingsPanel";
import { TranslationPanel } from "./components/TranslationPanel/TranslationPanel";
import { useSettingsStore } from "./stores/settingsStore";
import { useTranslationStore } from "./stores/translationStore";
import type { SelectionData } from "./types";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const { provider, sourceLang, targetLang } = useSettingsStore();
  const {
    selection,
    translatedText,
    loading,
    error,
    cached,
    providerUsed,
    translateSelection,
    setSelection,
    clear,
  } = useTranslationStore();

  const handleSelection = (sel: SelectionData) => {
    setSelection(sel);
    translateSelection(sel, provider, sourceLang, targetLang);
  };

  return (
    <div className="min-h-screen text-slate-100">
      <div className="w-full px-6 py-8">
        <header className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-slate-400 uppercase tracking-[0.08em]">
              TRANSLENS
            </p>
            <h1 className="text-2xl font-semibold text-slate-100">
              Instant, local-first translations
            </h1>
            <p className="text-sm text-slate-400">
              PDFs stay in-browser. Only the selected snippet is sent to your
              chosen provider.
            </p>
          </div>
          <div className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-2 text-sm text-accent font-semibold">
            {provider.toUpperCase()} • {targetLang.toUpperCase()}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6">
          <div className="space-y-4">
            <FileUpload onFileSelected={(f) => setFile(f)} />
            <SettingsPanel />
          </div>

          <div className="rounded-2xl glass p-4 border border-slate-800/60 min-h-[70vh]">
            <PDFViewer file={file} onSelection={handleSelection} />
          </div>

          <div className="hidden lg:block">
            <TranslationPanel
              selection={selection}
              translatedText={translatedText}
              loading={loading}
              error={error}
              cached={cached}
              providerUsed={providerUsed}
              onClear={clear}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
