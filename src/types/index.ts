export type ProviderId = "openai" | "anthropic" | "ollama" | "libretranslate";

export interface Language {
  code: string;
  name: string;
}

export interface ProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

export interface TranslationProvider {
  id: ProviderId;
  name: string;
  translate: (
    text: string,
    sourceLang: string,
    targetLang: string
  ) => Promise<string>;
  validateConfig: (config: ProviderConfig) => Promise<boolean>;
  getSupportedLanguages: () => Promise<Language[]>;
}

export interface TranslationRequest {
  text: string;
  sourceLang: string;
  targetLang: string;
  provider: ProviderId;
}

export interface TranslationResult {
  translatedText: string;
  provider: ProviderId;
  cached: boolean;
}

export interface SelectionData {
  text: string;
  rect: DOMRect;
}
