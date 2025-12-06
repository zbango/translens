import { useEffect, useState } from "react";
import "./App.css";
import { FileUpload } from "./components/FileUpload/FileUpload";
import { PDFViewer } from "./components/PDFViewer/PDFViewer";
import { SettingsPanel } from "./components/Settings/SettingsPanel";
import { TranslationPanel } from "./components/TranslationPanel/TranslationPanel";
import { useSettingsStore } from "./stores/settingsStore";
import { useTranslationStore } from "./stores/translationStore";
import type { SelectionData } from "./types";
import { useTranslation } from "react-i18next";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const { t } = useTranslation();
  const {
    provider,
    sourceLang,
    targetLang,
    uiLanguage,
    setUiLanguage,
    theme,
    setTheme,
  } = useSettingsStore();
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

  useEffect(() => {
    const body = document.body;
    body.classList.remove("theme-dark", "theme-light");
    body.classList.add(theme === "light" ? "theme-light" : "theme-dark");
  }, [theme]);

  return (
    <div className="min-h-screen text-slate-100">
      <div className="w-full px-6 py-8">
        <header className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-slate-400 uppercase tracking-[0.08em]">
              {t("app.title")}
            </p>
            <h1 className="text-2xl font-semibold text-slate-100">
              {t("app.subtitle")}
            </h1>
            <p className="text-sm text-slate-400">{t("app.privacy")}</p>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher
              active={uiLanguage}
              onChange={(lng) => {
                setUiLanguage(lng);
                void import("./i18n").then(({ default: i18nInstance }) =>
                  i18nInstance.changeLanguage(lng)
                );
              }}
            />
            <ThemeSwitcher
              active={theme}
              onToggle={() => setTheme(theme === "light" ? "dark" : "light")}
            />
            <div className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-2 text-sm text-accent font-semibold">
              {provider.toUpperCase()} • {targetLang.toUpperCase()}
            </div>
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

function ThemeSwitcher({
  active,
  onToggle,
}: {
  active: "light" | "dark";
  onToggle: () => void;
}) {
  const isLight = active === "light";
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm transition ${
        isLight
          ? "bg-white/80 text-slate-900 border-slate-200"
          : "bg-slate-900 text-slate-100 border-slate-700"
      }`}
      aria-label="Toggle theme"
    >
      <span>{isLight ? "🌞" : "🌙"}</span>
      <span>{isLight ? "Light" : "Dark"}</span>
    </button>
  );
}

function LanguageSwitcher({
  active,
  onChange,
}: {
  active: string;
  onChange: (lng: string) => void;
}) {
  const options = [
    { code: "en", label: "EN", flag: "🇺🇸" },
    { code: "es", label: "ES", flag: "🇪🇸" },
    { code: "fr", label: "FR", flag: "🇫🇷" },
  ];

  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-2 py-1">
      {options.map((opt) => (
        <button
          key={opt.code}
          onClick={() => onChange(opt.code)}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm transition ${
            active === opt.code
              ? "bg-accent/20 text-slate-100 border border-accent/60"
              : "text-slate-300 border border-transparent hover:border-slate-700"
          }`}
          aria-label={`Switch to ${opt.label}`}
        >
          <span>{opt.flag}</span>
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
