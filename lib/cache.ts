// Minimal in-memory TTL cache (no external deps)
type Entry<T> = { value: T; expiresAt: number };

const store = new Map<string, Entry<any>>();
const TTL = 30_000; // 30s

export const metricsCache = {
  get<T = any>(key: string): T | undefined {
    const e = store.get(key);
    if (!e) return undefined;
    if (Date.now() > e.expiresAt) { store.delete(key); return undefined; }
    return e.value as T;
  },
  set<T = any>(key: string, value: T, ttl: number = TTL) {
    store.set(key, { value, expiresAt: Date.now() + ttl });
  },
  delete(key: string) { store.delete(key); },
  clear() { store.clear(); }
};

export function cacheKey(symbol: string, exchange: string) {
  return `${symbol}:${exchange}`.toUpperCase();
}
