import type { Language, ProviderConfig, TranslationProvider } from '../../../types'

const defaultModel = 'claude-3-5-sonnet-latest'
const defaultBase = 'https://api.anthropic.com'

export const anthropicProvider: TranslationProvider = {
  id: 'anthropic',
  name: 'Anthropic',
  async translate(text, sourceLang, targetLang) {
    const apiKey = getConfig().apiKey
    if (!apiKey) throw new Error('Anthropic API key missing')

    const body = {
      model: getConfig().model || defaultModel,
      messages: [
        {
          role: 'user',
          content: `Translate from ${sourceLang || 'auto'} to ${targetLang}. Return only the translated text.\n\n${text}`,
        },
      ],
      max_tokens: 4000,
      temperature: 0.2,
    }

    const res = await fetch(`${getConfig().baseUrl || defaultBase}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const msg = await res.text()
      throw new Error(`Anthropic error: ${res.status} ${msg}`)
    }

    const json = (await res.json()) as any
    const translated = json?.content?.[0]?.text?.trim()
    if (!translated) throw new Error('Anthropic returned empty response')
    return translated
  },
  async validateConfig(config: ProviderConfig) {
    return Boolean(config.apiKey)
  },
  async getSupportedLanguages(): Promise<Language[]> {
    return commonLanguages
  },
}

let cachedConfig: ProviderConfig | null = null

export function setAnthropicConfig(config: ProviderConfig) {
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

