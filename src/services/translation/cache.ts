import type { ProviderId } from "../../types";

type CacheKey = `${ProviderId}:${string}:${string}:${string}`;

const memoryCache = new Map<CacheKey, string>();
const STORAGE_KEY = "translation-cache-v1";

function buildKey(
  provider: ProviderId,
  text: string,
  source: string,
  target: string
): CacheKey {
  return `${provider}:${source}:${target}:${text}` as CacheKey;
}

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Record<CacheKey, string>;
    Object.entries(parsed).forEach(([k, v]) =>
      memoryCache.set(k as CacheKey, v)
    );
  } catch {
    // ignore storage errors
  }
}

function persist() {
  try {
    const obj: Record<string, string> = {};
    memoryCache.forEach((value, key) => {
      obj[key] = value;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch {
    // ignore storage errors
  }
}

export function getCached(
  provider: ProviderId,
  text: string,
  source: string,
  target: string
) {
  if (memoryCache.size === 0) loadPersisted();
  return memoryCache.get(buildKey(provider, text, source, target)) ?? null;
}

export function setCached(
  provider: ProviderId,
  text: string,
  source: string,
  target: string,
  translation: string
) {
  memoryCache.set(buildKey(provider, text, source, target), translation);
  persist();
}

export function clearCache() {
  memoryCache.clear();
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
