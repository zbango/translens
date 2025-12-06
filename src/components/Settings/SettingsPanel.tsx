import { useMemo } from 'react'
import { useSettingsStore } from '../../stores/settingsStore'
import type { ProviderId } from '../../types'

const languages = [
  { code: 'auto', name: 'Auto-detect' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
]

const providerLabels: Record<ProviderId, string> = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  ollama: 'Ollama (local)',
  libretranslate: 'LibreTranslate',
}

export function SettingsPanel() {
  const { provider, setProvider, sourceLang, targetLang, setLanguages, configs, updateConfig } =
    useSettingsStore()
  const currentConfig = useMemo(() => configs[provider] || {}, [configs, provider])

  const handleInput = (field: 'apiKey' | 'baseUrl' | 'model', value: string) => {
    updateConfig(provider, { [field]: value })
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl glass p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-slate-200 font-semibold">Provider</p>
            <p className="text-xs text-slate-500">Switch between available backends</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(providerLabels) as ProviderId[]).map((id) => (
            <button
              key={id}
              onClick={() => setProvider(id)}
              className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                provider === id
                  ? 'border-accent bg-accent/10 text-slate-100'
                  : 'border-slate-800 bg-slate-900 text-slate-300'
              }`}
            >
              {providerLabels[id]}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl glass p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-200 font-semibold">Languages</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Source</label>
            <select
              className="w-full rounded-lg bg-slate-900 border border-slate-800 text-slate-100 px-3 py-2"
              value={sourceLang}
              onChange={(e) => setLanguages(e.target.value, targetLang, e.target.value === 'auto')}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Target</label>
            <select
              className="w-full rounded-lg bg-slate-900 border border-slate-800 text-slate-100 px-3 py-2"
              value={targetLang}
              onChange={(e) => setLanguages(sourceLang, e.target.value)}
            >
              {languages
                .filter((lang) => lang.code !== 'auto')
                .map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-xl glass p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-200 font-semibold">Provider Settings</p>
          <p className="text-xs text-slate-500">{providerLabels[provider]}</p>
        </div>
        {['openai', 'anthropic'].includes(provider) && (
          <InputRow
            label="API Key"
            placeholder="sk-..."
            type="password"
            value={currentConfig.apiKey || ''}
            onChange={(v) => handleInput('apiKey', v)}
          />
        )}
        {['openai', 'anthropic', 'ollama', 'libretranslate'].includes(provider) && (
          <InputRow
            label="Base URL"
            placeholder="https://api.openai.com"
            value={currentConfig.baseUrl || ''}
            onChange={(v) => handleInput('baseUrl', v)}
          />
        )}
        {['openai', 'anthropic', 'ollama'].includes(provider) && (
          <InputRow
            label="Model"
            placeholder="gpt-4o-mini / claude-3 / llama3.2"
            value={currentConfig.model || ''}
            onChange={(v) => handleInput('model', v)}
          />
        )}
        <p className="text-xs text-slate-500">
          Credentials stay in localStorage and are never sent anywhere except to the chosen provider.
        </p>
      </div>
    </div>
  )
}

function InputRow({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  type?: string
}) {
  return (
    <label className="block text-sm text-slate-200">
      <span className="block text-xs text-slate-400 mb-1">{label}</span>
      <input
        type={type}
        className="w-full rounded-lg bg-slate-900 border border-slate-800 text-slate-100 px-3 py-2"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

