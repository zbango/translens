import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { FileUpload } from "./components/FileUpload/FileUpload";
import { PDFViewer } from "./components/PDFViewer/PDFViewer";
import { SettingsPanel } from "./components/Settings/SettingsPanel";
import { TranslationPanel } from "./components/TranslationPanel/TranslationPanel";
import { useSettingsStore } from "./stores/settingsStore";
import { useTranslationStore } from "./stores/translationStore";
import type { SelectionData } from "./types";
import { useTranslation } from "react-i18next";
import Logo from "./assets/logo.png";
import Joyride, { STATUS } from "react-joyride";
import type { CallBackProps, Step } from "react-joyride";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [tourRun, setTourRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
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

  const steps = useMemo<Step[]>(
    () => [
      {
        target: '[data-tour="upload"]',
        title: "Load your PDF",
        content: "Drop or pick a PDF. It stays local in your browser.",
        disableBeacon: true,
      },
      {
        target: '[data-tour="settings"]',
        title: "Pick provider & languages",
        content:
          "Choose provider, set API keys, and select source/target languages.",
      },
      {
        target: '[data-tour="viewer"]',
        title: "Highlight text",
        content: "Select text on the PDF to translate instantly.",
      },
      {
        target: '[data-tour="translation"]',
        title: "See the translation",
        content: "Translations appear here with copy and cached state.",
      },
      {
        target: '[data-tour="header-actions"]',
        title: "UI & theme",
        content: "Switch UI language, theme, and sponsor link.",
      },
    ],
    []
  );

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index, type } = data;
    if (type === "step:after" || type === "error:target_not_found") {
      setStepIndex(index + 1);
    }
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setTourRun(false);
      setStepIndex(0);
    }
  };

  useEffect(() => {
    const body = document.body;
    body.classList.remove("theme-dark", "theme-light");
    body.classList.add(theme === "light" ? "theme-light" : "theme-dark");
  }, [theme]);

  return (
    <div className="min-h-screen text-slate-100">
      <Joyride
        steps={steps}
        run={tourRun}
        stepIndex={stepIndex}
        callback={handleJoyrideCallback}
        continuous
        showSkipButton
        disableScrolling
        styles={{
          options: {
            zIndex: 30000,
            primaryColor: "#38bdf8",
            backgroundColor: "#0f172a",
            textColor: "#e2e8f0",
          },
          tooltip: { borderRadius: 12 },
        }}
      />
      <div className="w-full px-6 py-8">
        <header
          className="flex items-center justify-between mb-6"
          data-tour="header-actions"
        >
          <div className="flex items-start gap-3">
            <img
              src={Logo}
              alt="TransLens logo"
              className="w-12 h-12 flex-shrink-0 drop-shadow-sm"
            />
            <div>
              <p className="text-sm text-slate-400 uppercase tracking-[0.08em]">
                {t("app.title")}
              </p>
              <h1 className="text-2xl font-semibold text-slate-100">
                {t("app.subtitle")}
              </h1>
              <p className="text-sm text-slate-400">{t("app.privacy")}</p>
            </div>
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
            <a
              href="https://buymeacoffee.com/zbango"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-md border border-accent/60 bg-accent/10 text-sm text-accent font-semibold hover:bg-accent/20 transition flex items-center gap-2"
            >
              <span role="img" aria-label="heart" className="text-red-500">
                ❤️
              </span>
              <span>Sponsor</span>
            </a>
            <button
              onClick={() => {
                setStepIndex(0);
                setTourRun(true);
              }}
              className="px-3 py-2 rounded-md border border-slate-800 bg-slate-900/60 text-sm text-slate-100 hover:border-accent/60 transition"
            >
              Guide
            </button>
            <div className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-2 text-sm text-accent font-semibold">
              {provider.toUpperCase()} • {targetLang.toUpperCase()}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6">
          <div className="space-y-4" data-tour="upload">
            <FileUpload onFileSelected={(f) => setFile(f)} />
            <div data-tour="settings">
              <SettingsPanel />
            </div>
          </div>

          <div
            className="rounded-2xl glass p-4 border border-slate-800/60 min-h-[70vh]"
            data-tour="viewer"
          >
            <PDFViewer file={file} onSelection={handleSelection} />
          </div>

          <div className="hidden lg:block" data-tour="translation">
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
