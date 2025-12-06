import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProviderConfig, ProviderId } from '../types'
import { setAnthropicConfig } from '../services/translation/providers/anthropic'
import { setLibreTranslateConfig } from '../services/translation/providers/libretranslate'
import { setOllamaConfig } from '../services/translation/providers/ollama'
import { setOpenAIConfig } from '../services/translation/providers/openai'

type ProviderSettings = Record<ProviderId, ProviderConfig>

interface SettingsState {
  provider: ProviderId
  sourceLang: string
  targetLang: string
  autoDetect: boolean
  uiLanguage: string
  theme: 'dark' | 'light'
  configs: ProviderSettings
  setProvider: (provider: ProviderId) => void
  setLanguages: (source: string, target: string, autoDetect?: boolean) => void
  updateConfig: (provider: ProviderId, config: ProviderConfig) => void
  setUiLanguage: (lng: string) => void
  setTheme: (theme: 'dark' | 'light') => void
}

const defaultConfigs: ProviderSettings = {
  openai: { model: 'gpt-4o-mini' },
  anthropic: { model: 'claude-3-5-sonnet-latest' },
  ollama: { baseUrl: 'http://localhost:11434', model: 'llama3.2' },
  libretranslate: { baseUrl: 'https://libretranslate.com' },
}

const applyConfigToProvider = (provider: ProviderId, config: ProviderConfig) => {
  switch (provider) {
    case 'openai':
      setOpenAIConfig(config)
      break
    case 'anthropic':
      setAnthropicConfig(config)
      break
    case 'ollama':
      setOllamaConfig(config)
      break
    case 'libretranslate':
      setLibreTranslateConfig(config)
      break
  }
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      provider: 'openai',
      sourceLang: 'auto',
      targetLang: 'en',
      autoDetect: true,
      uiLanguage: 'en',
      theme: 'dark',
      configs: defaultConfigs,
      setProvider: (provider) => set({ provider }),
      setLanguages: (source, target, autoDetect = get().autoDetect) =>
        set({ sourceLang: source, targetLang: target, autoDetect }),
      updateConfig: (provider, config) =>
        set((state) => {
          const merged = { ...state.configs[provider], ...config }
          applyConfigToProvider(provider, merged)
          return { configs: { ...state.configs, [provider]: merged } }
        }),
      setUiLanguage: (lng) => set({ uiLanguage: lng }),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'translens-settings' },
  ),
)

// Prime providers with stored configs on load
const initial = useSettingsStore.getState()
Object.entries(initial.configs).forEach(([id, cfg]) =>
  applyConfigToProvider(id as ProviderId, cfg),
)

