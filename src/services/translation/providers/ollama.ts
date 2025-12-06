import type { Language, ProviderConfig, TranslationProvider } from '../../../types'

const defaultModel = 'llama3.2'
const defaultBase = 'http://localhost:11434'

export const ollamaProvider: TranslationProvider = {
  id: 'ollama',
  name: 'Ollama (local)',
  async translate(text, sourceLang, targetLang) {
    const baseUrl = getConfig().baseUrl || defaultBase
    const model = getConfig().model || defaultModel

    const body = {
      model,
      prompt: `Translate the following from ${sourceLang || 'auto'} to ${targetLang}. Respond with only the translated text.\n\n${text}`,
      stream: false,
    }

    const res = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const msg = await res.text()
      throw new Error(`Ollama error: ${res.status} ${msg}`)
    }

    const json = (await res.json()) as any
    const translated = json?.response?.trim()
    if (!translated) throw new Error('Ollama returned empty response')
    return translated
  },
  async validateConfig(config: ProviderConfig) {
    const base = config.baseUrl || defaultBase
    try {
      const res = await fetch(`${base}/api/tags`)
      return res.ok
    } catch {
      return false
    }
  },
  async getSupportedLanguages(): Promise<Language[]> {
    return commonLanguages
  },
}

let cachedConfig: ProviderConfig | null = null

export function setOllamaConfig(config: ProviderConfig) {
  cachedConfig = config
}

function getConfig(): ProviderConfig {
  return cachedConfig || {}
}

const commonLanguages: Language[] = [
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

