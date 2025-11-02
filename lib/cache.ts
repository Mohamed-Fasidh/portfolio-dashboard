import {LRUCache} from 'lru-cache';

const ttl = 30 * 1000; // 30s cache

export const metricsCache = new LRUCache<string, any>({
  max: 500,
  ttl,
});

export function cacheKey(symbol: string, exchange: string) {
  return `${symbol}:${exchange}`.toUpperCase();
}
