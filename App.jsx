import { useState, useMemo } from "react";

const REGIONS = {
  BR: { name: "Brasil", emoji: "🇧🇷", color: "#009c3b" },
  SA: { name: "América do Sul", emoji: "🌎", color: "#6366f1" },
  CA: { name: "América Central", emoji: "🏝️", color: "#f59e0b" },
  NA: { name: "América do Norte", emoji: "🇺🇸", color: "#3b82f6" },
  EU: { name: "Europa", emoji: "🇪🇺", color: "#8b5cf6" },
  ME: { name: "Oriente Médio", emoji: "🕌", color: "#ef4444" },
  AF: { name: "África", emoji: "🌍", color: "#f97316" },
  AS: { name: "Ásia", emoji: "🌏", color: "#ec4899" },
  OC: { name: "Oceania", emoji: "🦘", color: "#14b8a6" },
};

const CABINS = {
  eco: { name: "Econômica", short: "ECO", color: "#22c55e", icon: "💺", fare: "X" },
  pe: { name: "Premium Eco", short: "PE", color: "#eab308", icon: "🪑", fare: "—" },
  exec: { name: "Executiva", short: "EXEC", color: "#3b82f6", icon: "🛋️", fare: "U" },
  first: { name: "Primeira", short: "1ST", color: "#a855f7", icon: "👑", fare: "Z" },
};

const TABLE = {
  "BR-SA": { eco: 24000, pe: 43200, exec: 48000, first: 84000 },
  "BR-CA": { eco: 42000, pe: 43200, exec: 90000, first: 144000 },
  "BR-NA": { eco: 57000, pe: 75600, exec: 135000, first: 216000 },
  "BR-EU": { eco: 62000, pe: 137500, exec: 157500, first: 270000 },
  "BR-ME": { eco: 95000, pe: 114000, exec: 198000, first: 252000 },
  "BR-AF": { eco: 80700, pe: 90700, exec: 201600, first: 336000 },
  "BR-AS": { eco: 121500, pe: 220500, exec: 292000, first: 378000 },
  "BR-OC": { eco: 125500, pe: 214000, exec: 248000, first: 317000 },
};

const AIRLINES = {
  DL: { name: "Delta Air Lines", alliance: "SkyTeam", hub: "ATL/JFK", color: "#003366", direct: true, highlight: true, search: "delta", note: "Melhor custo-benefício EUA. Delta One lie-flat.", product: { eco: "Comfort+ / Main Cabin", exec: "Delta One (lie-flat suíte)", first: "—" }, tip: "delta.com → Shop with Miles → Somente ida. Classe X/U." },
  QR: { name: "Qatar Airways", alliance: "oneworld", hub: "DOH", color: "#5C0632", direct: true, highlight: true, search: "aa", note: "⚠️ Desde ago/2025 só rotas de/para Brasil. QSuites top mundial.", product: { eco: "Tela individual", exec: "QSuites (suíte privativa)", first: "Primeira excepcional" }, tip: "aa.com → Resgatar milhas → GRU→DOH. Classe X/U/Z." },
  BA: { name: "British Airways", alliance: "oneworld", hub: "LHR", color: "#075AAA", direct: true, highlight: true, search: "aa", note: "Direto GRU→LHR ~11h. Club World renovada. Gateway Europa.", product: { eco: "World Traveller", exec: "Club World (suíte)", first: "First" }, tip: "aa.com → GRU→LHR. Conexão fácil toda Europa." },
  IB: { name: "Iberia", alliance: "oneworld", hub: "MAD", color: "#D50000", direct: true, highlight: false, search: "aa", note: "Direto GRU→MAD. Gateway Espanha/Portugal.", product: { eco: "Turista", exec: "Business (lie-flat)", first: "—" }, tip: "aa.com → GRU→MAD." },
  AM: { name: "Aeromexico", alliance: "SkyTeam", hub: "MEX", color: "#00205B", direct: true, highlight: false, search: "delta", note: "Direto GRU→MEX. Conexão Cancún e Caribe.", product: { eco: "Turista", exec: "Clase Premier (787)", first: "—" }, tip: "delta.com → GRU→MEX." },
  LH: { name: "Lufthansa", alliance: "Star Alliance", hub: "FRA", color: "#05164D", direct: true, highlight: true, search: "united", note: "Direto GRU→FRA ~12h. Allegris (suíte com porta) top.", product: { eco: "Economy", exec: "Allegris (suíte)", first: "First (sublime)" }, tip: "united.com → Award Travel → GRU→FRA." },
  LX: { name: "Swiss", alliance: "Star Alliance", hub: "ZRH", color: "#C8102E", direct: false, highlight: false, search: "united", note: "Via Zurique. Produto excelente.", product: { eco: "Economy", exec: "Business (lie-flat)", first: "First" }, tip: "united.com → GRU→ZRH." },
  OS: { name: "Austrian", alliance: "Star Alliance", hub: "VIE", color: "#E2001A", direct: false, highlight: false, search: "united", note: "Via Viena. Europa Central/Leste.", product: { eco: "Economy", exec: "Business", first: "—" }, tip: "united.com → GRU→VIE." },
  AY: { name: "Finnair", alliance: "oneworld", hub: "HEL", color: "#0B1560", direct: false, highlight: false, search: "aa", note: "HEL = rota mais curta Europa→Ásia.", product: { eco: "Economy", exec: "Business (Marimekko)", first: "—" }, tip: "aa.com → GRU→HEL." },
  JL: { name: "Japan Airlines", alliance: "oneworld", hub: "NRT", color: "#C8102E", direct: false, highlight: false, search: "aa", note: "Melhor opção Japão. Apex Suite top 3 mundial.", product: { eco: "Economy", exec: "Apex Suite (top)", first: "First (única)" }, tip: "aa.com → Conexão DOH/LHR→NRT." },
  CX: { name: "Cathay Pacific", alliance: "oneworld", hub: "HKG", color: "#005F5F", direct: false, highlight: false, search: "aa", note: "Hub HKG. Aria Suite novíssima.", product: { eco: "Economy", exec: "Aria Suite", first: "First" }, tip: "aa.com → Via DOH→HKG." },
  QF: { name: "Qantas", alliance: "oneworld", hub: "SYD", color: "#E0001B", direct: false, highlight: false, search: "aa", note: "Austrália/NZ via DOH.", product: { eco: "Economy", exec: "Business", first: "First" }, tip: "aa.com → DOH→SYD." },
  VS: { name: "Virgin Atlantic", alliance: "SkyTeam", hub: "LHR", color: "#D71920", direct: true, highlight: false, search: "delta", note: "Direto GRU→LHR. Upper Class com bar.", product: { eco: "Economy Delight", exec: "Upper Class (bar)", first: "—" }, tip: "delta.com → GRU→LHR." },
  RJ: { name: "Royal Jordanian", alliance: "oneworld", hub: "AMM", color: "#00205B", direct: false, highlight: false, search: "aa", note: "Gateway Jordânia/Petra.", product: { eco: "Economy", exec: "Business", first: "—" }, tip: "aa.com → Conexão→AMM." },
  AR: { name: "Aerolíneas Arg.", alliance: "SkyTeam", hub: "EZE", color: "#6CACE4", direct: true, highlight: false, search: "delta", note: "GRU→EZE frequente.", product: { eco: "Economy", exec: "Business", first: "—" }, tip: "delta.com → GRU→EZE." },
};

const DESTS = [
  { city: "Nova York", code: "JFK", country: "EUA", region: "NA", airlines: ["DL"], direct: true, time: "10h", tip: "Melhor custo-benefício! Delta One lie-flat. JFK T4." },
  { city: "Atlanta", code: "ATL", country: "EUA", region: "NA", airlines: ["DL"], direct: true, time: "10h30", tip: "Hub Delta. Conexão doméstica EUA." },
  { city: "Miami", code: "MIA", country: "EUA", region: "NA", airlines: ["DL"], direct: false, time: "~12h", tip: "Via ATL (Delta). Sem direto por parceira." },
  { city: "Los Angeles", code: "LAX", country: "EUA", region: "NA", airlines: ["DL"], direct: false, time: "~15h", tip: "Via ATL/JFK. Alternativa: LATAM direto (dinâmico)." },
  { city: "Londres", code: "LHR", country: "Reino Unido", region: "EU", airlines: ["BA", "VS"], direct: true, time: "11h30", tip: "2 opções diretas! BA Club World OU Virgin Upper Class." },
  { city: "Madrid", code: "MAD", country: "Espanha", region: "EU", airlines: ["IB"], direct: true, time: "10h30", tip: "Iberia direto. Trem AVE→BCN em 2h30." },
  { city: "Paris", code: "CDG", country: "França", region: "EU", airlines: ["BA", "AY"], direct: false, time: "~14h", tip: "Via LHR (BA, 1h) ou HEL (Finnair)." },
  { city: "Frankfurt", code: "FRA", country: "Alemanha", region: "EU", airlines: ["LH"], direct: true, time: "12h", tip: "Lufthansa direto! Allegris suíte. Hub Europa." },
  { city: "Amsterdã", code: "AMS", country: "Holanda", region: "EU", airlines: ["BA", "LH"], direct: false, time: "~13h", tip: "Via LHR (1h15) ou FRA (1h)." },
  { city: "Roma", code: "FCO", country: "Itália", region: "EU", airlines: ["IB", "BA"], direct: false, time: "~14h", tip: "Via MAD (2h30) ou LHR (BA)." },
  { city: "Lisboa", code: "LIS", country: "Portugal", region: "EU", airlines: ["IB", "BA"], direct: false, time: "~13h", tip: "Via MAD (1h voo)." },
  { city: "Barcelona", code: "BCN", country: "Espanha", region: "EU", airlines: ["IB", "BA"], direct: false, time: "~13h", tip: "Via MAD (shuttle 1h15)." },
  { city: "Doha", code: "DOH", country: "Catar", region: "ME", airlines: ["QR"], direct: true, time: "14h", tip: "Qatar direto! QSuites = melhor exec mundo. Conecta Ásia/África." },
  { city: "Dubai", code: "DXB", country: "EAU", region: "ME", airlines: ["QR"], direct: false, time: "~17h", tip: "Via DOH (1h). Stopover em Doha possível!" },
  { city: "Tóquio", code: "NRT", country: "Japão", region: "AS", airlines: ["JL", "QR"], direct: false, time: "~24h", tip: "Via DOH ou LHR/HEL. JAL Apex Suite top mundial." },
  { city: "Hong Kong", code: "HKG", country: "China", region: "AS", airlines: ["CX", "QR"], direct: false, time: "~22h", tip: "Via DOH. Cathay Aria Suite novíssima." },
  { city: "Bangkok", code: "BKK", country: "Tailândia", region: "AS", airlines: ["QR"], direct: false, time: "~22h", tip: "Via DOH. QSuites no trecho longo." },
  { city: "Sydney", code: "SYD", country: "Austrália", region: "OC", airlines: ["QF", "QR"], direct: false, time: "~28h", tip: "Via DOH (Qatar direto DOH→SYD)." },
  { city: "Melbourne", code: "MEL", country: "Austrália", region: "OC", airlines: ["QF", "QR"], direct: false, time: "~28h", tip: "Via DOH. Mesmo custo que Sydney." },
  { city: "Cidade do México", code: "MEX", country: "México", region: "CA", airlines: ["AM"], direct: true, time: "10h", tip: "Aeromexico direto! 42k eco = mais barato que doméstico!" },
  { city: "Cancún", code: "CUN", country: "México", region: "CA", airlines: ["AM"], direct: false, time: "~13h", tip: "Via MEX (2h15). Mesmo preço 42k eco!" },
  { city: "Buenos Aires", code: "EZE", country: "Argentina", region: "SA", airlines: ["AR"], direct: true, time: "2h45", tip: "Aerolíneas direto. Compare LATAM dinâmico!" },
  { city: "Santiago", code: "SCL", country: "Chile", region: "SA", airlines: ["AR"], direct: false, time: "~5h", tip: "Via EZE. LATAM direto pode ser melhor (dinâmico)." },
  { city: "Zurique", code: "ZRH", country: "Suíça", region: "EU", airlines: ["LX"], direct: false, time: "~13h", tip: "Swiss. Chocolates Sprüngli a bordo." },
  { city: "Viena", code: "VIE", country: "Áustria", region: "EU", airlines: ["OS"], direct: false, time: "~14h", tip: "Austrian. Gateway Europa Central." },
  { city: "Helsinque", code: "HEL", country: "Finlândia", region: "EU", airlines: ["AY"], direct: false, time: "~16h", tip: "Finnair. Gateway Ásia rota polar." },
  { city: "Munique", code: "MUC", country: "Alemanha", region: "EU", airlines: ["LH"], direct: false, time: "~13h", tip: "Lufthansa via FRA. Baviera próxima." },
  { city: "Edimburgo", code: "EDI", country: "Escócia", region: "EU", airlines: ["BA"], direct: false, time: "~15h", tip: "Via LHR (1h20). Mesmo custo que Londres!" },
  { city: "Amã", code: "AMM", country: "Jordânia", region: "ME", airlines: ["RJ"], direct: false, time: "~18h", tip: "Royal Jordanian. Petra, Mar Morto." },
  { city: "Joanesburgo", code: "JNB", country: "África do Sul", region: "AF", airlines: ["QR"], direct: false, time: "~20h", tip: "Via DOH. Gateway safáris." },
];

const fmt = n => n.toLocaleString("pt-BR");

function buildLinks(dest, date) {
  const d = date || "";
  const fmtDelta = d ? `${d.slice(5,7)}/${d.slice(8,10)}/${d.slice(0,4)}` : "";
  const links = [];
  const engines = new Set(dest.airlines.map(c => AIRLINES[c]?.search).filter(Boolean));

  if (engines.has("aa")) links.push({ name: "AA.com (oneworld)", tag: "OW", tagColor: "#ef4444", url: d ? `https://www.aa.com/booking/search?locale=en_US&pax=1&type=OneWay&searchType=Award&from=GRU&to=${dest.code}&date=${d}` : "https://www.aa.com/booking/find-flights", hasDate: !!d, note: `Award GRU→${dest.code}. Classes X/U/Z.` });
  if (engines.has("delta")) links.push({ name: "Delta.com (SkyTeam)", tag: "ST", tagColor: "#3b82f6", url: d ? `https://www.delta.com/flight-search/book-a-flight?tripType=ONE_WAY&departureDate=${fmtDelta}&originCity=GRU&destinationCity=${dest.code}&paxCount=1&shopWithMiles=true` : "https://www.delta.com/flight-search/search", hasDate: !!d, note: `Shop with Miles GRU→${dest.code}.` });
  if (engines.has("united")) links.push({ name: "United.com (Star Alliance)", tag: "SA", tagColor: "#eab308", url: d ? `https://www.united.com/en/us/fsr/choose-flights?f=GRU&t=${dest.code}&d=${d}&tt=1&at=1&rm=1&px=1` : "https://www.united.com/en/us/book-flight/united-awards", hasDate: !!d, note: `Award Travel GRU→${dest.code}.` });
  links.push({ name: "Seats.aero (alertas grátis)", tag: "🔔", tagColor: "#22c55e", url: `https://seats.aero/search?origin=GRU&destination=${dest.code}`, hasDate: false, note: "Monitore disponibilidade + alertas email." });
  links.push({ name: "Google Flights (comparar R$)", tag: "💰", tagColor: "#64748b", url: d ? `https://www.google.com/travel/flights?q=GRU+to+${dest.code}+on+${d}&curr=BRL` : `https://www.google.com/travel/flights?q=GRU+to+${dest.code}&curr=BRL`, hasDate: !!d, note: "Compare preço em R$ para custo/milha." });
  return links;
}

function Pill({ children, bg, color }) {
  return <span style={{ display: "inline-block", padding: "2px 7px", borderRadius: 5, fontSize: 9, fontWeight: 700, background: bg, color, lineHeight: "16px" }}>{children}</span>;
}

function DestCard({ d, cabin, trip }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [copied, setCopied] = useState(false);
  const r = REGIONS[d.region], ci = CABINS[cabin], t = TABLE[`BR-${d.region}`];
  const mult = trip === "rt" ? 2 : 1;
  const total = (t?.[cabin] || 0) * mult;
  const links = buildLinks(d, date);
  const cabinName = ci?.name || "Executiva";
  const waMsg = `Quero resgatar passagens com meus Pontos LATAM Pass\nMinha viagem seria: Ida\nOrigem: GRU\nDestino: ${d.code}\nData de ida: ${date || "AAAA-MM-DD"}\nCabine: ${cabinName}\nAdultos: 1\nCrianças: 0\nBebês: 0`;
  const copyWA = () => { navigator.clipboard.writeText(waMsg); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div style={{ background: open ? "#0f1629" : "#111827", borderRadius: 14, border: open ? `1px solid ${r.color}40` : "1px solid #1e293b", overflow: "hidden", transition: "all 0.2s" }}>
      <div onClick={() => setOpen(!open)} style={{ padding: "13px 16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, flex: 1, minWidth: 0 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: r.color + "18", border: `1px solid ${r.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{r.emoji}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#f1f5f9", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              {d.city} <span style={{ fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono',monospace", fontWeight: 500 }}>{d.code}</span>
              {d.direct && <Pill bg="#22c55e15" color="#22c55e">DIRETO</Pill>}
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {d.country} · ~{d.time} · {d.airlines.map(c => AIRLINES[c]?.name || c).join(", ")}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 8, color: "#64748b", fontWeight: 700, textTransform: "uppercase", marginBottom: 1 }}>{ci.icon} {ci.short} · {trip === "rt" ? "I/V" : "IDA"}</div>
            <span style={{ background: ci.color + "18", color: ci.color, border: `1px solid ${ci.color}40`, padding: "3px 10px", borderRadius: 18, fontSize: 13, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>{fmt(total)}</span>
          </div>
          <span style={{ color: "#475569", fontSize: 13, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>▾</span>
        </div>
      </div>

      {open && (
        <div style={{ padding: "0 16px 18px" }}>
          <div style={{ padding: "10px 13px", borderRadius: 9, background: "#1e1b4b20", border: "1px solid #312e8125", fontSize: 12, color: "#c7d2fe", lineHeight: 1.5, marginBottom: 12 }}>✈️ {d.tip}</div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 5, marginBottom: 14 }}>
            {Object.entries(CABINS).map(([k, c]) => (
              <div key={k} style={{ background: "#0a0e1a", borderRadius: 8, padding: "8px", textAlign: "center", border: k === cabin ? `1px solid ${c.color}45` : "1px solid #1e293b" }}>
                <div style={{ fontSize: 8, color: "#64748b", fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>{c.icon} {c.short}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 700, color: k === cabin ? c.color : "#94a3b8" }}>{fmt((t?.[k] || 0) * mult)}</div>
                <div style={{ fontSize: 7, color: "#475569" }}>Tarifa {c.fare}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "#0d1117", borderRadius: 11, border: "1px solid #1e293b", padding: 14, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 180 }}>
                <label style={{ fontSize: 9, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.7px", display: "block", marginBottom: 4 }}>📅 Data de ida</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  min={new Date(Date.now() + 86400000 * 14).toISOString().slice(0, 10)}
                  max={new Date(Date.now() + 86400000 * 365).toISOString().slice(0, 10)}
                  style={{ width: "100%", padding: "9px 12px", background: "#111827", border: "1px solid #2d3748", borderRadius: 8, color: "#e2e8f0", fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none" }} />
              </div>
              {date && <div style={{ background: "#22c55e12", borderRadius: 7, padding: "5px 10px", border: "1px solid #22c55e25" }}>
                <div style={{ fontSize: 8, color: "#22c55e", fontWeight: 700, textTransform: "uppercase" }}>✓ Links com data</div>
                <div style={{ fontSize: 11, color: "#22c55e", fontWeight: 600 }}>GRU→{d.code} · {new Date(date+"T12:00:00").toLocaleDateString("pt-BR",{day:"2-digit",month:"short",year:"numeric"})}</div>
              </div>}
            </div>

            <div style={{ fontSize: 9, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 7 }}>🔗 Buscar disponibilidade award</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {links.map((l, i) => (
                <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", background: "#111827", borderRadius: 9, border: "1px solid #1e293b", textDecoration: "none", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                    <Pill bg={l.tagColor + "20"} color={l.tagColor}>{l.tag}</Pill>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#f1f5f9" }}>{l.name} {l.hasDate && <span style={{ fontSize: 9, color: "#22c55e" }}>✓ data</span>}</div>
                      <div style={{ fontSize: 9, color: "#94a3b8" }}>{l.note}</div>
                    </div>
                  </div>
                  <span style={{ color: "#818cf8", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>Abrir ↗</span>
                </a>
              ))}
            </div>
          </div>

          <div style={{ background: "#0d1117", borderRadius: 11, border: "1px solid #1e293b", padding: 12, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 9, color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>📱 WhatsApp LATAM</span>
              <button onClick={copyWA} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #22c55e35", background: copied ? "#22c55e18" : "transparent", color: "#22c55e", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>{copied ? "✓ Copiado!" : "Copiar"}</button>
            </div>
            <pre style={{ background: "#111827", borderRadius: 8, padding: 10, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#22c55e", lineHeight: 1.8, whiteSpace: "pre-wrap", margin: 0, border: "1px solid #1e293b" }}>{waMsg}</pre>
            <div style={{ marginTop: 7, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              <a href={`https://wa.me/56968250850?text=${encodeURIComponent(waMsg)}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 7, background: "#25D36618", color: "#25D366", border: "1px solid #25D36635", fontSize: 11, fontWeight: 700, textDecoration: "none" }}>WhatsApp LATAM ↗</a>
              <span style={{ fontSize: 9, color: "#64748b" }}>Call: 4002-5700 (2→3→1)</span>
            </div>
          </div>

          <div style={{ fontSize: 9, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 5 }}>Companhias</div>
          {d.airlines.map(code => { const a = AIRLINES[code]; if (!a) return null; const ck = cabin === "pe" ? "eco" : cabin; return (
            <div key={code} style={{ background: "#0d1117", borderRadius: 9, padding: "10px 12px", border: `1px solid ${a.color}20`, marginBottom: 5 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: a.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#e2e8f0", fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${a.color}35` }}>{code}</div>
                <div><span style={{ fontWeight: 700, fontSize: 12, color: "#f1f5f9" }}>{a.name}</span>{a.highlight && <span style={{ fontSize: 9 }}> ⭐</span>}<div style={{ fontSize: 9, color: "#94a3b8" }}>{a.alliance} · {a.hub}{a.direct && " · ✈️ Direto GRU"}</div></div>
              </div>
              <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3 }}>{a.note}</div>
              <div style={{ fontSize: 10, color: "#64748b" }}>{ci?.icon} <strong style={{ color: "#e2e8f0" }}>Produto:</strong> {a.product[ck] || "—"}</div>
            </div>
          );})}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("search");
  const [region, setRegion] = useState("all");
  const [cabin, setCabin] = useState("exec");
  const [direct, setDirect] = useState(false);
  const [search, setSearch] = useState("");
  const [trip, setTrip] = useState("rt");
  const [sort, setSort] = useState("miles");
  const [maxMiles, setMaxMiles] = useState(800000);
  const [expP, setExpP] = useState(null);

  const filtered = useMemo(() => {
    const mult = trip === "rt" ? 2 : 1;
    let ds = DESTS.filter(d => {
      if (region !== "all" && d.region !== region) return false;
      if (direct && !d.direct) return false;
      if (search) { const q = search.toLowerCase(); return d.city.toLowerCase().includes(q) || d.code.toLowerCase().includes(q) || d.country.toLowerCase().includes(q); }
      return true;
    }).map(d => ({ ...d, sm: (TABLE[`BR-${d.region}`]?.[cabin] || 999999) * mult })).filter(d => d.sm <= maxMiles);
    if (sort === "miles") ds.sort((a, b) => a.sm - b.sm);
    else if (sort === "city") ds.sort((a, b) => a.city.localeCompare(b.city));
    else ds.sort((a, b) => a.region.localeCompare(b.region));
    return ds;
  }, [region, cabin, direct, search, trip, sort, maxMiles]);

  const tBtn = (id, icon, label) => <button key={id} onClick={() => setTab(id)} style={{ padding: "9px 15px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: tab === id ? 700 : 500, color: tab === id ? "#fff" : "#94a3b8", borderRadius: 8, background: tab === id ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "transparent", fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap" }}>{icon} {label}</button>;
  const fBtn = (on, fn, label, ac = "#6366f1") => <button onClick={fn} style={{ padding: "5px 11px", borderRadius: 6, cursor: "pointer", fontSize: 10, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", border: on ? `1px solid ${ac}` : "1px solid #2d3748", background: on ? ac + "20" : "transparent", color: on ? ac : "#94a3b8" }}>{label}</button>;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e1a", color: "#e2e8f0", fontFamily: "'DM Sans',-apple-system,sans-serif" }}>
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse at 20% 0%,rgba(99,102,241,.1) 0%,transparent 60%),radial-gradient(ellipse at 80% 100%,rgba(139,92,246,.06) 0%,transparent 50%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ padding: "22px 18px 0", maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#6366f1,#a855f7)", fontSize: 18, boxShadow: "0 4px 16px rgba(99,102,241,.3)" }}>✈️</div>
            <div>
              <h1 style={{ fontSize: 21, fontWeight: 800, margin: 0, letterSpacing: "-0.5px", background: "linear-gradient(135deg,#c7d2fe,#e9d5ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Miles Hunter</h1>
              <p style={{ margin: 0, fontSize: 10, color: "#64748b", fontWeight: 500 }}>LATAM Pass · Tabela Fixa · Deep Links · GRU 🇧🇷</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 3, marginTop: 16, background: "#111827", borderRadius: 11, padding: 3, border: "1px solid #1e293b", overflowX: "auto" }}>
            {tBtn("search", "🔍", "Destinos")}{tBtn("table", "📊", "Tabela")}{tBtn("partners", "🤝", "Parceiros")}{tBtn("howto", "📖", "Emitir")}
          </div>
        </div>

        <div style={{ padding: "16px 18px 36px", maxWidth: 900, margin: "0 auto" }}>
          {tab === "search" && (<div>
            <div style={{ background: "#111827", borderRadius: 13, border: "1px solid #1e293b", padding: 14, marginBottom: 14 }}>
              <input type="text" placeholder="🔍  Buscar cidade, país ou IATA..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", padding: "11px 13px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 9, color: "#e2e8f0", fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", boxSizing: "border-box", marginBottom: 10 }} />
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 9, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 4 }}>Região</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                  {fBtn(region === "all", () => setRegion("all"), "🌐 Todos")}
                  {Object.entries(REGIONS).filter(([k]) => k !== "BR").map(([k, rv]) => <span key={k}>{fBtn(region === k, () => setRegion(k), `${rv.emoji} ${rv.name.split("/")[0].split("(")[0].trim()}`, rv.color)}</span>)}
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
                <div><div style={{ fontSize: 9, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 4 }}>Classe</div><div style={{ display: "flex", gap: 3 }}>{Object.entries(CABINS).map(([k, c]) => <span key={k}>{fBtn(cabin === k, () => setCabin(k), `${c.icon} ${c.short}`, c.color)}</span>)}</div></div>
                <div><div style={{ fontSize: 9, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 4 }}>Viagem</div><div style={{ display: "flex", gap: 3 }}>{fBtn(trip === "rt", () => setTrip("rt"), "↔️ I/V")}{fBtn(trip === "ow", () => setTrip("ow"), "→ Ida")}</div></div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "end", flexWrap: "wrap" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", fontSize: 10, color: direct ? "#22c55e" : "#94a3b8", fontWeight: 600 }}><input type="checkbox" checked={direct} onChange={e => setDirect(e.target.checked)} style={{ accentColor: "#22c55e" }} />Diretos GRU</label>
                <div style={{ flex: 1, minWidth: 140 }}><div style={{ fontSize: 9, color: "#64748b", fontWeight: 700, textTransform: "uppercase", marginBottom: 1 }}>Máx: {fmt(maxMiles)}</div><input type="range" min={30000} max={800000} step={10000} value={maxMiles} onChange={e => setMaxMiles(Number(e.target.value))} style={{ width: "100%", accentColor: "#6366f1" }} /></div>
                <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: "5px 9px", borderRadius: 6, border: "1px solid #2d3748", background: "#0a0e1a", color: "#e2e8f0", fontSize: 10, fontFamily: "'DM Sans',sans-serif" }}><option value="miles">↑ Milhas</option><option value="city">A→Z</option><option value="region">Região</option></select>
              </div>
            </div>
            <div style={{ marginBottom: 8, fontSize: 10, color: "#64748b", fontWeight: 600 }}>{filtered.length} destinos · {CABINS[cabin].icon} {CABINS[cabin].name} · {trip === "rt" ? "I/V" : "Ida"} — <span style={{ color: "#818cf8" }}>Clique → detalhes, data e deep links</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {filtered.map(d => <DestCard key={d.code} d={d} cabin={cabin} trip={trip} />)}
              {!filtered.length && <div style={{ textAlign: "center", padding: 36, color: "#64748b", fontSize: 12 }}>Nenhum destino. Ajuste filtros.</div>}
            </div>
          </div>)}

          {tab === "table" && (<div>
            <div style={{ background: "#111827", borderRadius: 13, border: "1px solid #1e293b", padding: 14, marginBottom: 14 }}>
              <h2 style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>Tabela Fixa — Brasil → Mundo (por trecho)</h2>
              <p style={{ margin: 0, fontSize: 10, color: "#64748b" }}>Jul/2024 · Parceiras · Reajuste 02/03/2026 (não BR)</p>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, background: "#111827", borderRadius: 13, border: "1px solid #1e293b", overflow: "hidden", fontSize: 11 }}>
                <thead><tr>
                  <th style={{ padding: "11px 12px", textAlign: "left", background: "#1e1b4b", color: "#c7d2fe", fontWeight: 700, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #312e81" }}>Destino</th>
                  {Object.entries(CABINS).map(([k, c]) => <th key={k} style={{ padding: "11px 12px", textAlign: "center", background: "#1e1b4b", color: c.color, fontWeight: 700, fontSize: 9, textTransform: "uppercase", borderBottom: "1px solid #312e81", whiteSpace: "nowrap" }}>{c.icon} {c.short}</th>)}
                </tr></thead>
                <tbody>{Object.entries(TABLE).map(([key, vals], i) => { const rv = REGIONS[key.split("-")[1]]; return (
                  <tr key={key} style={{ background: i % 2 ? "#0f172a40" : "transparent" }}>
                    <td style={{ padding: "11px 12px", fontWeight: 600, color: rv?.color, borderBottom: "1px solid #1e293b", whiteSpace: "nowrap" }}>{rv?.emoji} {rv?.name}</td>
                    {Object.keys(CABINS).map(ck => <td key={ck} style={{ padding: "11px 12px", textAlign: "center", fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, color: "#e2e8f0", borderBottom: "1px solid #1e293b" }}>{fmt(vals[ck])}</td>)}
                  </tr>);})}</tbody>
              </table>
            </div>
            <div style={{ marginTop: 14, padding: "10px 14px", background: "#1e1b4b18", borderRadius: 10, border: "1px solid #312e8125", fontSize: 10, color: "#a5b4fc", lineHeight: 1.7 }}>
              <strong>💡</strong> I/V = x2 · NÃO vale LATAM · Conexão outra região = soma · Emissão: 4002-5700 ou WA +56 9 6825 0850 · 120+ dias = sem taxa
            </div>
          </div>)}

          {tab === "partners" && (<div>
            <div style={{ background: "#111827", borderRadius: 13, border: "1px solid #1e293b", padding: 14, marginBottom: 14 }}>
              <h2 style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>15 Parceiras LATAM Pass</h2>
              <p style={{ margin: 0, fontSize: 10, color: "#64748b" }}>Clique para detalhes e dicas</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {Object.entries(AIRLINES).map(([code, a]) => { const isE = expP === code; return (
                <div key={code} style={{ background: "#111827", borderRadius: 12, border: isE ? `1px solid ${a.color}40` : "1px solid #1e293b", overflow: "hidden" }}>
                  <div onClick={() => setExpP(isE ? null : code)} style={{ padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 7, background: a.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#e2e8f0", fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${a.color}35` }}>{code}</div>
                      <div><div style={{ fontWeight: 700, fontSize: 12, color: "#f1f5f9" }}>{a.name} {a.highlight && "⭐"}</div><div style={{ fontSize: 9, color: "#94a3b8" }}>{a.alliance} · {a.hub}{a.direct && " · ✈️ Direto"}</div></div>
                    </div>
                    <span style={{ color: "#475569", fontSize: 12, transform: isE ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
                  </div>
                  {isE && <div style={{ padding: "0 14px 12px" }}>
                    <div style={{ fontSize: 11, color: "#cbd5e1", lineHeight: 1.6, marginBottom: 8 }}>{a.note}</div>
                    <div style={{ background: "#0a0e1a", borderRadius: 8, padding: "8px 10px", border: "1px solid #1e293b", fontSize: 10, color: "#f59e0b", lineHeight: 1.5, marginBottom: 8 }}>💡 {a.tip}</div>
                    <div style={{ fontSize: 10, color: "#94a3b8" }}><strong style={{ color: "#64748b" }}>Produto:</strong> {Object.entries(a.product).filter(([,v]) => v !== "—").map(([k,v]) => `${CABINS[k]?.icon} ${v}`).join(" · ")}</div>
                  </div>}
                </div>);})}
            </div>
          </div>)}

          {tab === "howto" && (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "#111827", borderRadius: 13, border: "1px solid #1e293b", padding: 18 }}>
              <h2 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>🎯 Passo a Passo</h2>
              {[
                { s: 1, t: "Escolha destino + data", d: "Na aba Destinos, clique e selecione a data. Deep links são gerados automaticamente.", c: "#6366f1" },
                { s: 2, t: "Clique nos deep links", d: "aa.com/delta.com/united.com abrem com GRU, destino e data preenchidos. Procure X/U/Z.", c: "#8b5cf6" },
                { s: 3, t: "Anote voo + classe", d: "Data, nº voo, aeroportos, classe tarifária. NÃO reserve no site.", c: "#a855f7" },
                { s: 4, t: "Envie à LATAM", d: "Template WhatsApp gerado automaticamente. Clique 'WhatsApp LATAM' ou ligue 4002-5700.", c: "#c084fc" },
                { s: 5, t: "Confirme emissão", d: "Atendente verifica no sistema. Se não achar, tente outro. 2-3 tentativas é normal.", c: "#e879f9" },
              ].map(s => <div key={s.s} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 30, height: 30, borderRadius: 7, background: s.c + "20", border: `1px solid ${s.c}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: s.c, fontFamily: "'JetBrains Mono',monospace", flexShrink: 0 }}>{s.s}</div>
                <div><div style={{ fontWeight: 700, fontSize: 12, color: "#f1f5f9", marginBottom: 1 }}>{s.t}</div><div style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.5 }}>{s.d}</div></div>
              </div>)}
            </div>
            <div style={{ background: "linear-gradient(135deg,#1e1b4b,#111827)", borderRadius: 13, border: "1px solid #312e81", padding: 18 }}>
              <h3 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: "#c7d2fe" }}>🏆 Sweet Spots</h3>
              <div style={{ fontSize: 10, color: "#a5b4fc", lineHeight: 1.9 }}>
                <p style={{ margin: "0 0 6px" }}><strong style={{ color: "#e9d5ff" }}>🥇 EUA Delta:</strong> 57k eco / 135k exec. I/V 114k / 270k.</p>
                <p style={{ margin: "0 0 6px" }}><strong style={{ color: "#e9d5ff" }}>🥈 Europa BA/LH:</strong> 62k eco / 157.5k exec. Direto LHR/FRA.</p>
                <p style={{ margin: "0 0 6px" }}><strong style={{ color: "#e9d5ff" }}>🥉 México AM:</strong> 42k eco / 90k exec. Mais barato que doméstico!</p>
                <p style={{ margin: "0 0 6px" }}><strong style={{ color: "#e9d5ff" }}>🌟 Qatar QSuites:</strong> 198k exec trecho. Melhor exec do mundo.</p>
                <p style={{ margin: "0 0 6px" }}><strong style={{ color: "#e9d5ff" }}>📅 Antecedência:</strong> 120+ dias intl. Award liberado ~330 dias antes.</p>
                <p style={{ margin: "0 0 6px" }}><strong style={{ color: "#e9d5ff" }}>🔔 Seats.aero:</strong> Alertas grátis de disponibilidade por email.</p>
                <p style={{ margin: 0 }}><strong style={{ color: "#e9d5ff" }}>⚡ Compare:</strong> latam.com dinâmico pode ser menor que fixo parceira.</p>
              </div>
            </div>
          </div>)}
        </div>
        <div style={{ textAlign: "center", padding: "12px 18px 28px", fontSize: 9, color: "#334155" }}>Miles Hunter v2 · Tabela fixa LATAM Pass Jul/2024 · Reajuste BR mar/2026 · latampass.latam.com</div>
      </div>
    </div>
  );
}
