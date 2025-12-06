import type { Language, ProviderConfig, TranslationProvider } from '../../../types'

const defaultBase = 'https://libretranslate.com'

export const libreTranslateProvider: TranslationProvider = {
  id: 'libretranslate',
  name: 'LibreTranslate',
  async translate(text, sourceLang, targetLang) {
    const baseUrl = getConfig().baseUrl || defaultBase
    const body = new URLSearchParams({
      q: text,
      source: sourceLang || 'auto',
      target: targetLang,
      format: 'text',
      api_key: getConfig().apiKey || '',
    })

    const res = await fetch(`${baseUrl}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })

    if (!res.ok) {
      const msg = await res.text()
      throw new Error(`LibreTranslate error: ${res.status} ${msg}`)
    }

    const json = (await res.json()) as any
    const translated = json?.translatedText?.trim()
    if (!translated) throw new Error('LibreTranslate returned empty response')
    return translated
  },
  async validateConfig(_config: ProviderConfig) {
    return true
  },
  async getSupportedLanguages(): Promise<Language[]> {
    return [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'ar', name: 'Arabic' },
      { code: 'hi', name: 'Hindi' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ru', name: 'Russian' },
      { code: 'zh', name: 'Chinese' },
    ]
  },
}

let cachedConfig: ProviderConfig | null = null

export function setLibreTranslateConfig(config: ProviderConfig) {
  cachedConfig = config
}

function getConfig(): ProviderConfig {
  return cachedConfig || {}
}

