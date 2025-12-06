import { create } from 'zustand'
import type { ProviderId, SelectionData } from '../types'
import { translate } from '../services/translation/TranslationService'

interface TranslationState {
  selection: SelectionData | null
  translatedText: string | null
  loading: boolean
  error: string | null
  cached: boolean
  providerUsed: ProviderId | null
  setSelection: (selection: SelectionData | null) => void
  clear: () => void
  translateSelection: (
    selection: SelectionData,
    provider: ProviderId,
    sourceLang: string,
    targetLang: string,
  ) => Promise<void>
}

export const useTranslationStore = create<TranslationState>((set) => ({
  selection: null,
  translatedText: null,
  loading: false,
  error: null,
  cached: false,
  providerUsed: null,
  setSelection: (selection) => set({ selection }),
  clear: () =>
    set({
      selection: null,
      translatedText: null,
      loading: false,
      error: null,
      cached: false,
      providerUsed: null,
    }),
  translateSelection: async (selection, provider, sourceLang, targetLang) => {
    set({ loading: true, error: null, translatedText: null, selection })
    try {
      const result = await translate({
        text: selection.text,
        sourceLang,
        targetLang,
        provider,
      })
      set({
        translatedText: result.translatedText,
        loading: false,
        cached: result.cached,
        providerUsed: provider,
      })
    } catch (err: any) {
      set({
        error: err?.message || 'Translation failed',
        loading: false,
        translatedText: null,
        cached: false,
      })
    }
  },
}))

