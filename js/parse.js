'use strict';
// Interpretazione dei documenti, categorie, confronto nomi e conversioni di unità.

const CATS = [
  { id: 'latticini', name: 'Latticini', icon: '🥛' },
  { id: 'frutta', name: 'Frutta', icon: '🍎' },
  { id: 'verdure', name: 'Verdure', icon: '🥕' },
  { id: 'proteine', name: 'Proteine', icon: '🍗' },
  { id: 'carbo', name: 'Carbo', icon: '🍞' },
  { id: 'varie', name: 'Varie', icon: '🧂' },
];
const UNITS = ['g', 'pz', 'ml'];
const WEEK_LETTERS = ['L', 'Ma', 'Me', 'G', 'V', 'S', 'D'];

const CAT_RULES = [
  ['varie', /burro di arachid|frutta secca|miele|confettur|marmellat|^cioccolat|\bpate\b|olio|passata|aceto|\bsale\b|barrett|nutella|dolcific|spezie|sugo|pesto|ketchup|maionese/],
  ['carbo', /pasta di lenticch|riso soffiat|\bpane\b|panin|pasta|\briso\b|piadin|pancak|avena|popcorn|\bmais\b|farro|orzo|quinoa|cous|gnocch|patat|cracker|fette biscott|gallett|biscott|cornflakes|cereal|tortill|focacc|grissin/],
  ['proteine', /carne|vitello|manzo|pollo|tacchino|maiale|bresaola|prosciutto|fesa|salmone|tonno|pesce|merluzz|gamber|calamar|\buov|ceci|lenticch|fagiol|tofu|mortadella|salame|orata|branzin|sgombr|polpo|seppi|hamburger|bistecc|legum|speck|cozze|vongol/],
  ['latticini', /yogurt|latte|formagg|mozzarell|grana|parmigian|robiola|ricotta|stracchin|\bburro\b|provola|philadelphia|kefir|skyr|scamorz|feta|panna/],
  ['frutta', /\bmel[ae]\b|\bper[ae]\b|banan|\buva\b|kiwi|\bpesc[ah]e?\b|albicocc|fragol|melone|anguri|lampon|mirtill|nespol|\bfich|mango|aranc|mandarin|prugn|ananas|limon|ciliegi|cachi|clementin|frutti di bosco|pompelm|papaya|avocado/],
  ['verdure', /zucchin|pomodor|carot|spinac|insalat|lattug|rucola|pisell|melanzan|peperon|cipoll|finocch|sedan|asparag|bietol|valerian|songino|broccol|cavol|fagiolin|fung|porri|puntarell|radicch|cetriol|zucca|carciof|verdur|minestron|aglio/],
];

function classify(name, section) {
  const n = norm(name);
  for (const [cat, re] of CAT_RULES) if (re.test(n)) return cat;
  const s = norm(section || '');
  if (/frutta|verdur/.test(s)) return 'verdure';
  if (/latticin|formagg/.test(s)) return 'latticini';
  if (/carne|pesce/.test(s)) return 'proteine';
  if (/pane|cereal/.test(s)) return 'carbo';
  return 'varie';
}

// ---------- normalizzazione e confronto nomi ----------
const STOP = new Set('di da del dello della dei degli delle al allo alla ai agli alle all e ed con il lo la i gli le un uno una in per es sl s l o senza tipo circa g gr ml pz a gia pronto pronti pronta pronte piccolo piccoli piccola piccole grande grandi fresco fresca freschi fresche misto mista misti miste'.split(' '));

function norm(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\([^)]*\)/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim();
}
function stem(w) { return w.length > 3 ? w.replace(/[aeiou]$/, '') : w; }
function toks(s) { return norm(s).split(' ').filter(w => w && !STOP.has(w) && !/^\d+$/.test(w)).map(stem); }
function alts(name) {
  return String(name || '').replace(/\([^)]*\)/g, ' ').split(/\s+o\s+|\//i).map(s => s.trim()).filter(Boolean);
}
function nameScore(a, b) {
  const A = toks(a), B = toks(b);
  if (!A.length || !B.length) return 0;
  const SA = new Set(A), SB = new Set(B);
  const c = [...SA].filter(x => SB.has(x)).length;
  if (!c) return 0;
  const sub = A.every(x => SB.has(x)) || B.every(x => SA.has(x));
  if (!(A[0] === B[0] || sub)) return 0;
  return 2 * c / (SA.size + SB.size);
}
// Trova l'elemento di `list` con il nome più simile a `name`.
function bestMatch(name, list, opts = {}) {
  const min = opts.min ?? 0.5;
  let best = null, bs = 0;
  for (const x of list) {
    let s = 0;
    for (const a of alts(name)) for (const b of alts(x.name)) s = Math.max(s, nameScore(a, b));
    if (s > 0 && opts.bonus) s += opts.bonus(x);
    if (s > bs) { bs = s; best = x; }
  }
  return bs >= min ? best : null;
}

// ---------- unità ----------
const PZ_W = { mel: 180, per: 180, banan: 120, carot: 80, uov: 60, mozzarell: 110, kiwi: 80, zucchin: 200, pomodor: 120, pesc: 150, albicocc: 40, prugn: 40, aranc: 180, mandarin: 80, gallett: 9, fett: 10, cracker: 7, pancak: 30, piadin: 120, mandorl: 1.2, noc: 5, yogurt: 125, panin: 70 };
function pzWeight(name) {
  for (const t of toks(name)) for (const k in PZ_W) if (t.startsWith(k)) return PZ_W[k];
  return null;
}
function convert(q, from, to, name) {
  if (q == null || !from || !to) return null;
  if (from === to) return q;
  const mass = u => u === 'g' || u === 'ml';
  if (mass(from) && mass(to)) return q;
  const w = pzWeight(name);
  if (!w) return null;
  if (from === 'pz' && mass(to)) return q * w;
  if (mass(from) && to === 'pz') return q / w;
  return null;
}
const r1 = x => Math.round(x * 10) / 10;
function fmtNum(n) { return String(r1(n)).replace('.', ','); }
function fmtQty(q, u) { return q == null ? '' : `${fmtNum(q)} ${u || ''}`.trim(); }
function cap(s) { s = String(s || '').trim(); return s.charAt(0).toUpperCase() + s.slice(1); }

// Confezioni della lista spesa, es. nota "5 vasetti da 150g" -> {n:5, word:'vasetti', size:150}
const PACK_WORDS = [['vasetto', 'vasetti'], ['scatoletta', 'scatolette'], ['mozzarella', 'mozzarelle'], ['confezione', 'confezioni'],
  ['busta', 'buste'], ['vaschetta', 'vaschette'], ['bottiglia', 'bottiglie'], ['pacchetto', 'pacchetti'], ['tavoletta', 'tavolette']];
function packOf(it) {
  const m = String(it.note || '').match(/^(\d+)\s+([a-zà-ü]+)\s+da\s+(\d+)(?:\s*-\s*(\d+))?\s*(g|ml)\b/i);
  if (!m || it.unit !== m[5].toLowerCase()) return null;
  return { n: +m[1], word: m[2].toLowerCase(), size: m[4] ? (+m[3] + +m[4]) / 2 : +m[3] };
}
function packWord(word, k) {
  const p = PACK_WORDS.find(w => w.includes(word));
  return p ? p[k === 1 ? 0 : 1] : word;
}

// ---------- quantità ----------
const NUM = String.raw`(\d+(?:[.,]\d+)?)(?:\s*[-\/]\s*(\d+(?:[.,]\d+)?))?`;
const toN = s => parseFloat(String(s).replace(',', '.'));
const rng = (a, b) => b != null ? (toN(a) + toN(b)) / 2 : toN(a);
const rlab = (a, b) => b != null ? `${a}-${b}` : a;
const LIQ = /\b(olio|latte|aceto|acqua|succo)\b/i;
const CONTAINER = /^(scatolett[ae]|vasett[io]|confezion[ei]|pacchett[io]|bustin[ae]|bust[ae])\s+(di\s+)?/i;

function unitNorm(u, q) {
  u = u.toLowerCase();
  if (u === 'kg') return ['g', q * 1000];
  if (u === 'l') return ['ml', q * 1000];
  if (u === 'gr') return ['g', q];
  return [u, q];
}

function mkItem(name, qty, unit, label, note) {
  name = String(name).replace(/^(di|d')\s*/i, '').replace(/\s+/g, ' ').trim().replace(/[.;,:]+$/, '');
  return { name: cap(name), qty: qty == null ? null : r1(qty), unit: qty == null ? null : unit, label, note: note || '' };
}

// Interpreta una riga di alimento della dieta, es. "150-200g di zucchine", "3 uova", "2 cucchiaini di olio".
function parseFoodLine(raw) {
  const s = raw.replace(/\s+/g, ' ').trim().replace(/^[+•·\-–]\s*/, '').replace(/^conditi con:?\s*/i, '');
  const notes = [];
  const clean = s.replace(/\(([^)]*)\)/g, (m, x) => { notes.push(x.trim()); return ' '; })
    .replace(/\s+/g, ' ').trim().replace(/[.;,]+$/, '');
  const note = notes.join('; ');
  let m;
  if ((m = clean.match(new RegExp(`^${NUM}\\s*(kg|gr|g|ml|l)\\b\\.?\\s*(?:di\\s+|d')?(.*)$`, 'i')))) {
    const [u, q] = unitNorm(m[3], rng(m[1], m[2]));
    return mkItem(m[4], q, u, `${rlab(m[1], m[2])} ${m[3].toLowerCase()}`, note);
  }
  if ((m = clean.match(new RegExp(`^${NUM}\\s*(cucchiain[oi]|cucchiai|cucchiaio)\\s+(?:di\\s+|d')?(.*)$`, 'i')))) {
    const per = /cucchiain/i.test(m[3]) ? 5 : 10;
    return mkItem(m[4], rng(m[1], m[2]) * per, LIQ.test(m[4]) ? 'ml' : 'g', `${rlab(m[1], m[2])} ${m[3].toLowerCase()}`, note);
  }
  if ((m = clean.match(new RegExp(`^${NUM}\\s+(.+?)\\s+da\\s+${NUM}\\s*(g|ml)\\b(.*)$`, 'i')))) {
    const name = (m[3] + (m[7] || '')).replace(CONTAINER, '');
    return mkItem(name, rng(m[1], m[2]) * rng(m[4], m[5]), m[6].toLowerCase(),
      `${rlab(m[1], m[2])} × ${rlab(m[4], m[5])} ${m[6].toLowerCase()}`, note);
  }
  if ((m = clean.match(new RegExp(`^${NUM}\\s+(.+)$`)))) {
    return mkItem(m[3].replace(CONTAINER, ''), rng(m[1], m[2]), 'pz', `${rlab(m[1], m[2])} pz`, note);
  }
  if ((m = clean.match(new RegExp(`^(.+?)\\s+da\\s+${NUM}\\s*(g|ml)\\b`, 'i')))) {
    return mkItem(m[1], rng(m[2], m[3]), m[4].toLowerCase(), `${rlab(m[2], m[3])} ${m[4].toLowerCase()}`, note);
  }
  return mkItem(clean, null, null, '', note);
}

// ---------- file DIETA ----------
function parseDiet(blocks) {
  const days = [], notes = [];
  let cur = null, note = null, after = false;
  for (const b of blocks) {
    if (b.type === 'p') {
      const t = b.text;
      if (!t) continue;
      const m = t.match(/^giorno\s*(\d+)/i);
      if (m && !after) { cur = { n: +m[1], meals: [] }; days.push(cur); continue; }
      if (days.length && (/titolo\s*1|heading\s*1/i.test(b.style) || /^[A-ZÀ-Ü ]{5,}$/.test(t))) {
        after = true; note = { title: cap(t.toLowerCase()), lines: [] }; notes.push(note); continue;
      }
      if (after && note) note.lines.push(t);
    } else if (b.type === 'tbl') {
      if (cur && !after) {
        for (const row of b.rows) {
          if (row.length < 2) continue;
          const name = row[0].join(' ').trim();
          let lines = row.slice(1).flat();
          if (!name || !lines.length) continue;
          let title = '';
          if (lines.length > 1 && parseFoodLine(lines[0]).qty == null) { title = lines[0]; lines = lines.slice(1); }
          cur.meals.push({ name: cap(name.toLowerCase()), title, items: lines.map(l => ({ raw: l, ...parseFoodLine(l) })) });
        }
      } else if (note) {
        for (const row of b.rows) note.lines.push(row.map(c => c.join(' ')).join(' — '));
      }
    }
  }
  if (!days.length) throw new Error('nel file non ho trovato nessun "GIORNO 1, 2, …"');
  days.sort((a, b) => a.n - b.n);
  return { days, notes };
}

// ---------- file LISTA SPESA ----------
function parseShopLine(t, section) {
  const i = t.indexOf(':');
  const name = (i >= 0 ? t.slice(0, i) : t).trim();
  const rest = i >= 0 ? t.slice(i + 1) : '';
  const [qPart, ...noteParts] = rest.split('→');
  const q = qPart.replace(/\([^)]*\)/g, ' ').replace(/\b(circa|totali|totale)\b/gi, ' ').replace(/\s+/g, ' ').trim();
  let qty = null, unit = null, m;
  if ((m = q.match(new RegExp(`^${NUM}\\s*(kg|gr|g|ml|l)\\b`, 'i')))) [unit, qty] = unitNorm(m[3], rng(m[1], m[2]));
  else if ((m = q.match(new RegExp(`^${NUM}\\s+\\S+.*?\\s+da\\s+${NUM}\\s*(g|ml)\\b`, 'i')))) { qty = rng(m[1], m[2]) * rng(m[3], m[4]); unit = m[5].toLowerCase(); }
  else if ((m = q.match(new RegExp(`^${NUM}`)))) { qty = rng(m[1], m[2]); unit = 'pz'; }
  let extra = noteParts.join('→').trim();
  if (/\sda\s/i.test(q) && !extra) extra = q;
  return {
    name: cap(name), qty: qty == null ? null : Math.round(qty), unit,
    note: extra || (qty == null ? qPart.trim() : ''), cat: classify(name, section), checked: false,
  };
}

function parseShopping(blocks) {
  const items = [];
  let section = '';
  for (const b of blocks) {
    if (b.type !== 'p' || !b.text) continue;
    const t = b.text;
    if (/lista della spesa/i.test(t)) continue;
    if (!(b.list || t.includes(':'))) { section = t; continue; }
    items.push(parseShopLine(t, section));
  }
  if (!items.length) throw new Error('nel file non ho trovato alimenti (formato "Nome: quantità")');
  return items;
}
