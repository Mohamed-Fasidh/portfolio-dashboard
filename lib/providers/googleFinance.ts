import * as cheerio from "cheerio";

/** ---------- Fundamentals (P/E + latest earnings) ---------- */
export async function getGoogleFundamentals(
  symbol: string,
  exchange: string
): Promise<{ pe: number | null; earnings: string | null }> {
  try {
    const ex = mapToGoogleExchange(exchange);
    const url = `https://www.google.com/finance/quote/${encodeURIComponent(symbol)}:${encodeURIComponent(ex)}?hl=en`;
    const html = await fetchHtml(url, 6000);
    if (!html) return { pe: null, earnings: null };
    const $ = cheerio.load(html);

    let pe: number | null = null;
    let earnings: string | null = null;

    $('div div:contains("P/E ratio")').each((_, el) => {
      const val = $(el).parent().find("div").last().text().trim();
      const num = Number(val.replace(/,/g, ""));
      if (!Number.isNaN(num)) pe = num;
    });

    const labels = ["Earnings date", "Latest earnings", "Earnings"];
    $("div").each((_, el) => {
      const text = $(el).text().trim();
      if (labels.some((l) => text === l)) {
        const val = $(el).parent().find("div").last().text().trim();
        if (val) earnings = val;
      }
    });

    if (pe === null) {
      const m = html.match(/P\/E ratio\s*([0-9]+(?:\.[0-9]+)?)/i);
      if (m) pe = Number(m[1]);
    }
    if (earnings === null) {
      const m2 = html.match(/Earnings(?:\s*date)?\s*([A-Za-z]{3,9}\.?,?\s*\d{1,2},?\s*\d{4}|Q\d\s*FY\d{2,4}[^<]*)/i);
      if (m2) earnings = m2[1];
    }

    return { pe, earnings };
  } catch {
    return { pe: null, earnings: null };
  }
}

/** ---------- CMP fallback (Google Finance) ---------- */
export async function getGoogleCMP(symbol: string, exchange: string): Promise<number | null> {
  try {
    const ex = mapToGoogleExchange(exchange);
    const url = `https://www.google.com/finance/quote/${encodeURIComponent(symbol)}:${encodeURIComponent(ex)}?hl=en`;
    const html = await fetchHtml(url, 6000);
    if (!html) return null;

    // tighter price extraction to avoid picking index values
    const m =
      html.match(/<div[^>]+class="[^"]*YMlKec[^"]*"[^>]*>([^<]+)<\/div>/) ||
      html.match(/data-last-price="([0-9.,-]+)"/i);

    if (!m) return null;
    const raw = m[1].replace(/[^\d.,-]/g, "").replace(/,/g, "");
    const num = Number(raw);
    return Number.isFinite(num) ? num : null;
  } catch {
    return null;
  }
}

/** ---------- helpers ---------- */
function mapToGoogleExchange(exchange: string) {
  const ex = (exchange || "").toUpperCase();
  if (ex.includes("NSE")) return "NSE";
  if (ex.includes("BSE")) return "BSE";
  return ex || "NSE";
}

async function fetchHtml(url: string, timeoutMs = 6000): Promise<string | null> {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0", "Accept-Language": "en-US,en;q=0.9" },
      cache: "no-store",               // do NOT add next: { revalidate: 0 } together
      signal: ac.signal,
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}
