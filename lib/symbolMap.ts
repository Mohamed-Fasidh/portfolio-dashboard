export function resolveCandidates(rawSymbol: string): string[] {
  const s = (rawSymbol || "").trim().toUpperCase();
  const map: Record<string, string[] | undefined> = {
    SBI: ["SBIN"],
    ICICI: ["ICICIBANK"],
    HDFC: ["HDFCBANK"],
    TATA: ["TATAMOTORS", "TATASTEEL", "TATAPOWER", "TATACOMM"],
    BAJAJ: ["BAJFINANCE", "BAJAJFINSV", "BAJAJ_AUTO"],
    DEEPAK: ["DEEPAKNTR", "DEEPAKFERT"],
    ASTRAL: ["ASTRAL"],
    DMART: ["DMART"],
    POLYCAB: ["POLYCAB"],
    TANLA: ["TANLA"],
    AFFLE: ["AFFLE"],
    GENSOL: ["GENSOL"],
    KPI: ["KPITTECH", "KAYNES"],
    BLS: ["BLS"],
    FINE: ["FINEORG"],
    CLEAN: ["CLEAN"],
    HARIOM: ["HARIOMPIPE"],
  };
  return Array.from(new Set([s, ...(map[s] ?? [])]));
}

export function sanitizeExchange(ex?: string) {
  const e = (ex || "").trim().toUpperCase();
  return e === "BSE" ? "BSE" : "NSE";
}
