import { describe, expect, it, beforeEach, vi } from 'vitest'
import type { TranslationProvider } from '../../types'

const mocks = vi.hoisted(() => ({
  openai: { translate: vi.fn(async () => 'hello') },
  anth: { translate: vi.fn(async () => 'anth') },
  ollama: { translate: vi.fn(async () => 'ollama') },
  libre: { translate: vi.fn(async () => 'libre') },
}))

function makeProvider(
  id: TranslationProvider['id'],
  name: string,
  translateImpl: () => Promise<string>,
): TranslationProvider {
  return {
    id,
    name,
    translate: translateImpl,
    validateConfig: async () => true,
    getSupportedLanguages: async () => [],
  }
}

vi.mock('./providers/openai', () => ({
  openAIProvider: makeProvider('openai', 'OpenAI', mocks.openai.translate),
}))
vi.mock('./providers/anthropic', () => ({
  anthropicProvider: makeProvider('anthropic', 'Anthropic', mocks.anth.translate),
}))
vi.mock('./providers/ollama', () => ({
  ollamaProvider: makeProvider('ollama', 'Ollama', mocks.ollama.translate),
}))
vi.mock('./providers/libretranslate', () => ({
  libreTranslateProvider: makeProvider('libretranslate', 'LibreTranslate', mocks.libre.translate),
}))

// simple localStorage shim
class MemoryStorage {
  store: Record<string, string> = {}
  getItem(key: string) {
    return this.store[key] ?? null
  }
  setItem(key: string, value: string) {
    this.store[key] = value
  }
  removeItem(key: string) {
    delete this.store[key]
  }
  clear() {
    this.store = {}
  }
}
;(globalThis as any).localStorage = new MemoryStorage()

import { translate } from './TranslationService'
import { clearCache } from './cache'

describe('TranslationService', () => {
  beforeEach(() => {
    ;(globalThis as any).localStorage.clear()
    clearCache()
    vi.clearAllMocks()
  })

  it('routes to the chosen provider', async () => {
    const result = await translate({
      text: 'hola',
      sourceLang: 'es',
      targetLang: 'en',
      provider: 'openai',
    })
    expect(result.translatedText).toBe('hello')
    expect(mocks.openai.translate).toHaveBeenCalledTimes(1)
    expect(result.cached).toBe(false)
  })

  it('returns cached results on repeated calls', async () => {
    const first = await translate({
      text: 'hola',
      sourceLang: 'es',
      targetLang: 'en',
      provider: 'openai',
    })
    const second = await translate({
      text: 'hola',
      sourceLang: 'es',
      targetLang: 'en',
      provider: 'openai',
    })
    expect(first.cached).toBe(false)
    expect(second.cached).toBe(true)
    expect(mocks.openai.translate).toHaveBeenCalledTimes(1)
  })
})

