/**
 * Robust Yahoo CMP fetcher using Yahoo's public quote endpoint.
 * - No external libs
 * - Works for NSE/BSE by appending .NS / .BO
 * - Falls back through multiple ticker variants
 * - Short timeout to avoid hanging requests
 */

type YahooQuote = {
  quoteResponse?: {
    result?: Array<{ regularMarketPrice?: number | null }>;
  };
};

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari";
const YF_BASES = [
  "https://query1.finance.yahoo.com",
  "https://query2.finance.yahoo.com", // fallback host
];

export async function getYahooCMP(symbol: string, exchange: string): Promise<number | null> {
  try {
    const cleanSymbol = sanitizeSymbol(symbol);
    const ex = (exchange || "").toUpperCase();

    // Preferred order of tickers to try
    const candidates = dedupe([
      mapToYahooTicker(cleanSymbol, ex), // e.g. TCS.NS or RELIANCE.BO
      cleanSymbol,                       // plain
      `${cleanSymbol}.NS`,               // force NSE
      `${cleanSymbol}.BO`,               // force BSE
    ]).filter(Boolean) as string[];

    for (const ticker of candidates) {
      const price = await fetchCMP(ticker);
      if (typeof price === "number") return price;
    }

    return null;
  } catch (err) {
    console.error("getYahooCMP failed:", err);
    return null;
  }
}

function sanitizeSymbol(s: string) {
  return (s || "").trim().toUpperCase().replace(/\s+/g, "");
}

function mapToYahooTicker(symbol: string, exchange: string) {
  if (exchange === "NSE") return `${symbol}.NS`;
  if (exchange === "BSE") return `${symbol}.BO`;
  return symbol; // US / other markets may already be correct
}

function dedupe<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

async function fetchCMP(ticker: string, timeoutMs = 5000): Promise<number | null> {
  const urlPaths = YF_BASES.map(
    base => `${base}/v7/finance/quote?symbols=${encodeURIComponent(ticker)}`
  );

  for (const url of urlPaths) {
    const json = await getJSON<YahooQuote>(url, timeoutMs).catch(() => null);
    const price = json?.quoteResponse?.result?.[0]?.regularMarketPrice;
    if (typeof price === "number") return price;
  }
  return null;
}

async function getJSON<T = unknown>(url: string, timeoutMs: number): Promise<T> {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA },
      signal: ac.signal,
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(t);
  }
}
