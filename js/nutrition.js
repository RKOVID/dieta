'use strict';
// Valori nutrizionali medi per 100 g (tabelle CREA / USDA, arrotondati). Sono stime.
// [regola sul nome, kcal, proteine, carboidrati, grassi, grammi per pezzo, densità per ml]
// L'ordine conta: le regole più specifiche vengono prima.
const NUTR = [
  [/pasta di lenticch/, 340, 25, 52, 2],
  [/riso soffiat/, 380, 7.5, 84, 1],
  [/gallett.*ciocc|ciocc.*gallett/, 480, 7, 65, 21, 15],
  [/barrett/, 430, 6, 68, 14, 23],
  [/burro di arachid/, 590, 25, 12, 49],
  [/yogurt greco/, 57, 10, 3.6, 0.2, 150],
  [/yogurt/, 43, 4, 5.5, 0.2, 125],
  [/(spalmabil|cremoso).*light|light.*(spalmabil|cremoso)/, 150, 8, 4.5, 11],
  [/spalmabil|philadelphia/, 230, 7, 3.5, 21],
  [/mozzarell/, 160, 20, 1, 8, 110],
  [/robiola|stracchin/, 275, 13, 2, 24],
  [/ricotta/, 140, 9, 3.5, 10],
  [/grana|parmigian/, 392, 33, 0, 28],
  [/latte/, 46, 3.3, 5, 1.6, null, 1.03],
  [/fesa|bresaola|prosciutto/, 110, 22, 1, 2],
  [/pollo/, 100, 23, 0, 1],
  [/tacchino/, 107, 24, 0, 1],
  [/vitello|manzo|carne/, 107, 21, 0, 2.5],
  [/salmon/, 185, 20, 0, 12],
  [/tonno/, 105, 24, 0, 1],
  [/gamber|calamar/, 70, 14, 0.5, 1],
  [/\buov/, 143, 12.6, 0.7, 9.5, 55],
  [/frutta secca|mandorl|mandrol|\bnoc[ei]\b|anacard|arachid/, 600, 20, 12, 52, 1.2],
  [/olio/, 899, 0, 0, 99.9, null, 0.92],
  [/cioccolat/, 560, 8, 40, 38],
  [/miele/, 304, 0.3, 80, 0],
  [/confettur|marmellat/, 220, 0.4, 54, 0],
  [/pate|oliv/, 240, 1.5, 3, 25],
  [/fette biscott/, 410, 11, 73, 6, 9],
  [/biscott/, 450, 7, 70, 15, 10],
  [/cracker/, 430, 9.5, 70, 11, 6.5],
  [/gallett/, 380, 8, 80, 3, 8],
  [/fiocchi|avena|cornflakes/, 370, 13, 60, 7],
  [/piadin/, 310, 8, 50, 8, 120],
  [/pancak/, 250, 6, 40, 7, 30],
  [/\bpane\b|panin|bruschett/, 270, 8.5, 55, 1.5],
  [/\briso\b|farro|orzo|quinoa|cous/, 360, 7, 80, 0.6],
  [/pasta|gnocch/, 355, 12.5, 72, 1.5],
  [/mais|popcorn/, 365, 10, 70, 4.5],
  [/patat/, 80, 2, 17, 0.1, 150],
  [/lenticch|ceci|fagiol/, 340, 23, 50, 2],
  [/pisell/, 77, 5.4, 12.7, 0.4],
  [/\bmel[ae]\b/, 52, 0.3, 14, 0.2, 180],
  [/\bper[ae]\b/, 57, 0.4, 15, 0.1, 180],
  [/banan/, 89, 1.1, 23, 0.3, 120],
  [/\buva\b/, 69, 0.7, 18, 0.2],
  [/kiwi/, 61, 1.1, 15, 0.5, 80],
  [/pomodor/, 18, 0.9, 3.9, 0.2, 120],
  [/zucchin/, 17, 1.2, 3.1, 0.3, 200],
  [/carot/, 41, 0.9, 9.6, 0.2, 80],
  [/spinac/, 23, 2.9, 3.6, 0.4],
  [/insalat|lattug|rucola|valerian/, 15, 1.4, 2.2, 0.2],
  [/verdur/, 25, 1.5, 4, 0.3],
];

const ZERO = () => ({ kcal: 0, p: 0, c: 0, f: 0 });
function addMacros(a, b) { if (b) { a.kcal += b.kcal; a.p += b.p; a.c += b.c; a.f += b.f; } return a; }

// Macro di un alimento della dieta (null se non stimabile)
function itemMacros(it) {
  if (it.qty == null) return null;
  const n = norm(alts(it.name)[0] || it.name);
  const r = NUTR.find(x => x[0].test(n));
  if (!r) return null;
  const [, kcal, p, c, f, pz, dens] = r;
  let g;
  if (it.unit === 'pz') g = it.qty * (pz || pzWeight(it.name) || 0);
  else if (it.unit === 'ml') g = it.qty * (dens || 1);
  else g = it.qty;
  if (!g) return null;
  const k = g / 100;
  return { kcal: kcal * k, p: p * k, c: c * k, f: f * k };
}
// Macro di un pasto: alimenti + eventuali valori inseriti a mano (pasto libero / extra)
function mealMacros(meal, onlyDone) {
  const t = ZERO();
  if (meal.extra) return addMacros(t, meal.extra); // un pasto extra conta sempre come mangiato
  for (const it of meal.items) if (!onlyDone || it.done) addMacros(t, itemMacros(it));
  if (meal.free && (!onlyDone || (meal.items.length && meal.items.every(i => i.done)))) addMacros(t, meal.free);
  return t;
}
function macrosFromInput(kcal, p, c, f) {
  p = p || 0; c = c || 0; f = f || 0;
  return { kcal: kcal != null ? kcal : p * 4 + c * 4 + f * 9, p, c, f };
}
