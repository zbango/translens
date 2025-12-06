import type {
  ProviderId,
  TranslationProvider,
  TranslationRequest,
  TranslationResult,
} from "../../types";
import { getCached, setCached } from "./cache";
import { anthropicProvider } from "./providers/anthropic";
import { libreTranslateProvider } from "./providers/libretranslate";
import { ollamaProvider } from "./providers/ollama";
import { openAIProvider } from "./providers/openai";

const providers: Record<ProviderId, TranslationProvider> = {
  openai: openAIProvider,
  anthropic: anthropicProvider,
  ollama: ollamaProvider,
  libretranslate: libreTranslateProvider,
};

export function getProvider(id: ProviderId) {
  return providers[id];
}

export function listProviders() {
  return Object.values(providers);
}

export async function translate(
  request: TranslationRequest
): Promise<TranslationResult> {
  const provider = providers[request.provider];
  if (!provider) throw new Error(`Unknown provider: ${request.provider}`);

  const cached = getCached(
    request.provider,
    request.text,
    request.sourceLang,
    request.targetLang
  );
  if (cached) {
    return { translatedText: cached, provider: request.provider, cached: true };
  }

  const translatedText = await provider.translate(
    request.text,
    request.sourceLang,
    request.targetLang
  );
  setCached(
    request.provider,
    request.text,
    request.sourceLang,
    request.targetLang,
    translatedText
  );

  return { translatedText, provider: request.provider, cached: false };
}
