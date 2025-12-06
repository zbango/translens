import type {
  Language,
  ProviderConfig,
  TranslationProvider,
} from "../../../types";

const defaultModel = "gpt-4o-mini";
const defaultBase = "https://api.openai.com";

export const openAIProvider: TranslationProvider = {
  id: "openai",
  name: "OpenAI",
  async translate(text, sourceLang, targetLang) {
    const apiKey = getConfig().apiKey;
    if (!apiKey) throw new Error("OpenAI API key missing");

    const body = {
      model: getConfig().model || defaultModel,
      messages: [
        {
          role: "system",
          content: `Translate from ${
            sourceLang || "auto"
          } to ${targetLang}. Return only the translated text.`,
        },
        { role: "user", content: text },
      ],
      temperature: 0.2,
    };

    const res = await fetch(
      `${getConfig().baseUrl || defaultBase}/v1/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`OpenAI error: ${res.status} ${msg}`);
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const translated = json.choices?.[0]?.message?.content?.trim();
    if (!translated) throw new Error("OpenAI returned empty response");
    return translated;
  },
  async validateConfig(config: ProviderConfig) {
    return Boolean(config.apiKey);
  },
  async getSupportedLanguages(): Promise<Language[]> {
    return commonLanguages;
  },
};

let cachedConfig: ProviderConfig | null = null;

export function setOpenAIConfig(config: ProviderConfig) {
  cachedConfig = config;
}

function getConfig(): ProviderConfig {
  return cachedConfig || {};
}

const commonLanguages: Language[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "zh", name: "Chinese" },
];
