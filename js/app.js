'use strict';

// ---------- utilità ----------
const $ = (s, r = document) => r.querySelector(s);
function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat(Infinity)) {
    if (k == null || k === false || k === '') continue;
    el.append(k.nodeType ? k : String(k));
  }
  return el;
}
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const clone = o => JSON.parse(JSON.stringify(o));
const DAYS = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
const DAYS_LONG = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
const MONTHS = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
const pad = n => String(n).padStart(2, '0');
const dkey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const planDayNum = d => d.getDay() === 0 ? 7 : d.getDay(); // Lunedì = Giorno 1
const parseQty = v => { const n = parseFloat(String(v).replace(',', '.')); return isNaN(n) ? null : n; };

const IC = {
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="8.2" stroke-width="3.4" stroke-dasharray="3.2 3.24"/><circle cx="12" cy="12" r="6" stroke-width="2"/><circle cx="12" cy="12" r="2.2" stroke-width="2"/></svg>',
  fridge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="5.5" y="2.5" width="13" height="19" rx="2.2"/><path d="M5.5 9.5h13M9 5v2.2M9 12v4"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 4h2.3l2.4 10.3a1 1 0 0 0 1 .7h9.3a1 1 0 0 0 1-.7L20.8 7.5H6.2M9.5 8v4.5M13 8v4.5M16.5 8v4.5"/><circle cx="9" cy="19.2" r="1.4"/><circle cx="17" cy="19.2" r="1.4"/></svg>',
  plate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="6.3"/><circle cx="12" cy="12" r="3.8"/><path d="M2.5 3.5v5.2a1.4 1.4 0 0 0 2.8 0V3.5M3.9 3.5v17M21 3.5c-1.6 1-2 3.5-2 6.5h2v10.5"/></svg>',
  grip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 7h14M5 12h14M5 17h14"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12.5l4 4 8-9"/></svg>',
  left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 12h12"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6.5h16M9.5 6.5V4.5h5v2M6.5 6.5l1 13a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1l1-13M10 10.5v6.5M14 10.5v6.5"/></svg>',
  pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1-4.5L16 4.5a2.1 2.1 0 0 1 3 3L8 18.5z"/><path d="M14 7l3 3"/></svg>',
};

// ---------- stato ----------
const KEY = 'dieta-app-v1';
function blank() { return { v: 1, plan: null, planName: '', shop: [], shopName: '', pantry: [], days: {}, tab: 'dieta' }; }
// stato iniziale con dieta e lista spesa già caricate (js/defaults.js)
function initial() {
  const s = blank();
  if (typeof DEFAULT_DATA !== 'undefined') {
    const d = clone(DEFAULT_DATA);
    s.plan = d.plan; s.planName = d.planName;
    s.shop = d.shop.map(i => ({ id: uid(), ...i })); s.shopName = d.shopName;
  }
  return s;
}
function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 1) return Object.assign(blank(), s); } catch (e) { }
  return initial();
}
let S = load();
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('Errore nel salvataggio dei dati'); }
}
let curDate = today();
let followToday = true;
let delMode = false;

// annulla: salva una copia dello stato prima di un'azione
function snapshot() { return JSON.stringify(S); }
function undoTo(snap) { S = JSON.parse(snap); save(); render(); }

// ---------- toast ----------
let toastTimer;
function toast(msg, action, fn, ms = 3500) {
  const t = $('#toast');
  t.replaceChildren(h('span', null, msg));
  if (action) t.append(h('button', { onclick: () => { t.classList.remove('show'); fn(); } }, action));
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), ms);
}

// ---------- fogli (modali) ----------
function sheet({ title, body, okLabel = 'Fatto', onOk, noOk }) {
  const bg = h('div', { class: 'sheet-bg' });
  const close = () => { bg.classList.remove('open'); setTimeout(() => bg.remove(), 220); };
  const sh = h('div', { class: 'sheet', role: 'dialog', 'aria-label': title },
    h('div', { class: 'sheet-head' },
      h('button', { class: 'link', onclick: close }, noOk ? 'Chiudi' : 'Annulla'),
      h('div', { class: 'sheet-title' }, title),
      noOk ? h('span') : h('button', { class: 'link strong', onclick: () => { if (onOk() !== false) close(); } }, okLabel)),
    h('div', { class: 'sheet-body' }, body));
  bg.append(sh);
  bg.addEventListener('click', e => { if (e.target === bg) close(); });
  document.body.append(bg);
  requestAnimationFrame(() => bg.classList.add('open'));
  return close;
}
function field(label, input) { return h('label', { class: 'field' }, h('span', null, label), input); }

// ---------- suggerimenti nomi ----------
// Nomi già noti all'app: dispensa, lista spesa e dieta (senza doppioni).
function knownFoods() {
  const map = new Map();
  const add = (name, unit, cat, src) => {
    const k = toks(name).join(' ');
    if (k && !map.has(k)) map.set(k, { name, unit, cat: cat || classify(name), src });
  };
  S.pantry.forEach(p => add(p.name, p.unit, p.cat, 'In dispensa'));
  S.shop.forEach(i => add(i.name, i.unit, i.cat, 'In lista spesa'));
  // dalla dieta solo i nomi che non somigliano già a uno della lista o della dispensa
  if (S.plan) S.plan.days.forEach(d => d.meals.forEach(m => m.items.forEach(i => {
    if (i.qty != null && !bestMatch(i.name, [...map.values()])) add(i.name, i.unit, null, 'Dalla dieta');
  })));
  return [...map.values()];
}
// Avvolge un campo nome con l'elenco dei suggerimenti; onPick(food) quando ne scegli uno.
function withSuggest(input, onPick) {
  const list = h('div', { class: 'sugg' });
  const wrap = h('div', { class: 'sugg-wrap' }, input, list);
  const hide = () => list.replaceChildren();
  const show = () => {
    const q = norm(input.value);
    if (q.length < 2) return hide();
    const words = q.split(' ');
    const found = knownFoods()
      .map(f => {
        const n = norm(f.name);
        const nw = n.split(' ');
        const ok = words.every(w => nw.some(x => x.startsWith(w)) || n.includes(w));
        return ok ? { f, rank: (n.startsWith(q) ? 0 : 1) + n.length / 1000 } : null;
      })
      .filter(Boolean).sort((a, b) => a.rank - b.rank).slice(0, 6).map(x => x.f);
    if (found.length === 1 && norm(found[0].name) === q) return hide();
    list.replaceChildren(...found.map(f => {
      const c = CATS.find(x => x.id === f.cat);
      return h('button', {
        type: 'button', class: 'sugg-item',
        onpointerdown: e => e.preventDefault(),
        onclick: e => { e.preventDefault(); input.value = f.name; hide(); onPick && onPick(f); },
      }, h('span', { class: 'sugg-ic' }, c ? c.icon : ''), h('span', { class: 'sugg-nm' }, f.name), h('span', { class: 'sugg-src' }, f.src));
    }));
  };
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('autocorrect', 'off');
  input.addEventListener('input', show);
  input.addEventListener('focus', show);
  input.addEventListener('blur', () => setTimeout(hide, 150));
  wrap.list = list;
  return wrap;
}
function unitSelect(val) {
  return h('select', { class: 'unit' }, UNITS.map(u => h('option', { value: u, selected: u === (val || 'g') }, u)));
}
function catChips(selected, onPick) {
  const wrap = h('div', { class: 'chips' });
  const draw = sel => wrap.replaceChildren(...CATS.map(c => h('button', {
    type: 'button', class: 'chip' + (c.id === sel ? ' on' : ''),
    onclick: () => { wrap.dataset.val = c.id; wrap.dataset.touched = '1'; draw(c.id); onPick && onPick(c.id); },
  }, `${c.icon} ${c.name}`)));
  wrap.dataset.val = selected || '';
  wrap.set = id => { wrap.dataset.val = id; draw(id); };
  draw(selected);
  return wrap;
}

// ---------- header ----------
function updateClock() {
  const d = new Date();
  $('#hdr-date').textContent = `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  $('#hdr-time').textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  if (followToday && dkey(curDate) !== dkey(today())) { curDate = today(); render(); }
}

// ---------- render generale ----------
let lastTab = null;
function render() {
  const main = $('#main');
  const keep = lastTab === S.tab ? main.scrollTop : 0;
  lastTab = S.tab;
  syncShop();
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === S.tab));
  main.replaceChildren();
  ({ dieta: renderDieta, spesa: renderSpesa, frigo: renderFrigo })[S.tab](main);
  main.scrollTop = keep;
}
function setTab(t) { if (S.tab !== t) { S.tab = t; delMode = false; save(); render(); $('#main').scrollTop = 0; } }

function empty(icon, title, text, btn) {
  return h('div', { class: 'empty' }, h('div', { class: 'empty-ic', html: icon }), h('h2', null, title), h('p', null, text),
    btn && h('button', { class: 'primary', onclick: btn[1] }, btn[0]));
}
function checkBtn(on, size, fn, label) {
  return h('button', { class: `chk ${size}${on ? ' on' : ''}`, 'aria-label': label, 'aria-pressed': on ? 'true' : 'false', onclick: fn, html: IC.check });
}
function catHead(c, count) {
  return h('div', { class: 'cat-head' }, h('span', { class: 'cat-ic' }, c.icon), h('span', null, c.name), count != null && h('span', { class: 'cat-count' }, count));
}

// ================= DIETA =================
function buildDay(key) {
  if (!S.plan) return null;
  const d = new Date(key + 'T00:00:00');
  const pd = S.plan.days.find(x => x.n === planDayNum(d)) || S.plan.days[(planDayNum(d) - 1) % S.plan.days.length];
  if (!pd) return null;
  return {
    n: pd.n,
    meals: pd.meals.map(m => ({ id: uid(), name: m.name, title: m.title, items: m.items.map(i => ({ ...clone(i), id: uid(), done: false, used: null })) })),
  };
}
const getDay = key => S.days[key] || buildDay(key);
function ensureDay(key) { if (!S.days[key]) S.days[key] = buildDay(key); return S.days[key]; }

function findPantryFor(name) {
  return bestMatch(name, S.pantry.filter(p => p.qty != null), { bonus: p => p.qty > 0 ? 0.05 : 0 });
}
function setDone(it, done, log) {
  if (!!it.done === done) return;
  it.done = done;
  if (done) {
    it.used = null;
    if (it.qty == null) return;
    const p = findPantryFor(it.name);
    const amount = p ? convert(it.qty, it.unit, p.unit, it.name) : null;
    if (!p || amount == null) { log.miss.push(it.name); return; }
    const take = r1(Math.min(p.qty, amount));
    p.qty = r1(p.qty - take);
    it.used = { pid: p.id, amount: take };
    log.done.push(`−${fmtQty(take, p.unit)} ${p.name}`);
  } else {
    const u = it.used;
    const p = u && S.pantry.find(x => x.id === u.pid);
    if (p) { p.qty = r1((p.qty || 0) + u.amount); log.done.push(`+${fmtQty(u.amount, p.unit)} ${p.name}`); }
    it.used = null;
  }
}
function report(log) {
  const parts = [];
  if (log.done.length) parts.push(log.done.length <= 2 ? log.done.join(', ') : `${log.done.length} alimenti aggiornati in dispensa`);
  if (log.miss.length) parts.push(log.miss.length === 1 ? `${log.miss[0]}: non in dispensa` : `${log.miss.length} non in dispensa`);
  if (parts.length) toast(parts.join(' · '));
}
function toggleItem(key, mi, ii) {
  const day = ensureDay(key), it = day.meals[mi].items[ii], log = { done: [], miss: [] };
  setDone(it, !it.done, log);
  save(); render(); report(log);
}
function toggleMeal(key, mi) {
  const day = ensureDay(key), meal = day.meals[mi], log = { done: [], miss: [] };
  const all = meal.items.length && meal.items.every(i => i.done);
  meal.items.forEach(i => setDone(i, !all, log));
  save(); render(); report(log);
}

function renderDieta(main) {
  const key = dkey(curDate), isToday = key === dkey(today());
  const shift = n => { curDate = new Date(curDate); curDate.setDate(curDate.getDate() + n); followToday = dkey(curDate) === dkey(today()); render(); };
  main.append(h('div', { class: 'daynav' },
    h('button', { class: 'round', 'aria-label': 'Giorno precedente', onclick: () => shift(-1), html: IC.left }),
    h('button', { class: 'daylabel', onclick: () => { curDate = today(); followToday = true; render(); } },
      h('div', { class: 'dl-main' }, `${DAYS_LONG[curDate.getDay()]} ${curDate.getDate()} ${MONTHS[curDate.getMonth()]}`),
      h('div', { class: 'dl-sub' + (isToday ? ' today' : '') }, isToday ? 'Oggi' : 'Tocca per tornare a oggi')),
    h('button', { class: 'round', 'aria-label': 'Giorno successivo', onclick: () => shift(1), html: IC.right })));

  if (!S.plan) {
    main.append(empty(IC.plate, 'Nessuna dieta caricata', 'Apri le impostazioni e carica il file Word della dieta.', ['Apri impostazioni', openSettings]));
    return;
  }
  const day = getDay(key);
  if (!day) return;
  main.append(h('div', { class: 'plan-day' }, `Giorno ${day.n} del piano`));
  main.append(daySummary(day));

  const list = h('div', { id: 'meals' });
  day.meals.forEach((meal, mi) => {
    const grip = h('span', { class: 'grip big', 'aria-label': 'Sposta pasto', html: IC.grip });
    grip.addEventListener('pointerdown', e => startDrag(e, sec, 'meal', key));
    let sec;
    if (meal.extra) {
      // pasto extra inserito a mano
      sec = h('section', { class: 'meal extra', 'data-mi': mi },
        h('div', { class: 'meal-head' }, grip,
          h('div', { class: 'meal-title' }, h('div', { class: 'meal-name' }, meal.name, h('span', { class: 'badge' }, 'Extra')),
            h('div', { class: 'meal-macro' }, macroLine(meal.extra))),
          h('button', { class: 'icon-btn', 'aria-label': 'Modifica ' + meal.name, onclick: () => editExtra(key, mi), html: IC.pencil })));
      list.append(sec);
      return;
    }
    const allDone = meal.items.length > 0 && meal.items.every(i => i.done);
    const mm = mealMacros(meal);
    const freeSlot = meal.items.length > 0 && meal.items.every(i => i.qty == null); // es. "Pasto a scelta"
    sec = h('section', { class: 'meal' + (allDone ? ' done' : ''), 'data-mi': mi },
      h('div', { class: 'meal-head' }, grip,
        h('div', { class: 'meal-title' }, h('div', { class: 'meal-name' }, meal.name), meal.title && h('div', { class: 'meal-sub' }, meal.title),
          mm.kcal > 0 && h('div', { class: 'meal-macro' }, macroLine(mm))),
        checkBtn(allDone, 'big', () => toggleMeal(key, mi), 'Completa ' + meal.name)),
      h('div', { class: 'items' }, meal.items.map((it, ii) => {
        const g = h('span', { class: 'grip', 'aria-label': 'Sposta alimento', html: IC.grip });
        const im = itemMacros(it);
        const row = h('div', { class: 'item' + (it.done ? ' done' : ''), 'data-mi': mi, 'data-ii': ii }, g,
          h('div', { class: 'item-text' }, h('span', { class: 'item-name' }, it.name),
            it.note && h('span', { class: 'item-note' }, it.note),
            im && h('span', { class: 'item-kcal' }, `≈ ${fmtInt(im.kcal)} kcal`)),
          h('span', { class: 'item-qty' }, it.label),
          checkBtn(it.done, 'small', () => toggleItem(key, mi, ii), 'Segna ' + it.name));
        g.addEventListener('pointerdown', e => startDrag(e, row, 'item', key));
        return row;
      })),
      freeSlot && h('button', { class: 'free-btn', onclick: () => editFree(key, mi) },
        meal.free ? `✏️ ${meal.free.name || 'Pasto libero'} · ${fmtInt(meal.free.kcal)} kcal` : '＋ Inserisci kcal e macro del pasto libero'));
    list.append(sec);
  });
  main.append(list,
    h('div', { class: 'end-actions center' },
      h('button', { class: 'secondary big', onclick: () => addExtra(key) }, '＋ Pasto extra')),
    h('p', { class: 'hint' }, 'Tieni premuto ≡ e trascina per riordinare i pasti o spostare un alimento in un altro pasto. Kcal e macro sono stime.'));
}

// ---------- kcal e macro ----------
const fmtInt = n => Math.round(n || 0).toLocaleString('it-IT');
const macroLine = m => `≈ ${fmtInt(m.kcal)} kcal · P ${fmtInt(m.p)} · C ${fmtInt(m.c)} · G ${fmtInt(m.f)}`;

function daySummary(day) {
  const plan = ZERO(), eaten = ZERO();
  for (const m of day.meals) { addMacros(plan, mealMacros(m)); addMacros(eaten, mealMacros(m, true)); }
  const pct = plan.kcal ? Math.min(100, eaten.kcal / plan.kcal * 100) : 0;
  const kcalOf = { p: 4, c: 4, f: 9 };
  const macro = (k, label) => h('div', { class: 'mac mac-' + k },
    h('div', { class: 'mac-lbl' }, label),
    h('div', { class: 'mac-val' }, `${fmtInt(plan[k])} g`),
    h('div', { class: 'mac-sub' }, `${plan.kcal ? Math.round(plan[k] * kcalOf[k] / plan.kcal * 100) : 0}% · mangiati ${fmtInt(eaten[k])} g`));
  return h('div', { class: 'day-sum' },
    h('div', { class: 'sum-top' },
      h('div', null, h('span', { class: 'sum-kcal' }, fmtInt(plan.kcal)), h('span', { class: 'sum-unit' }, ' kcal'), h('div', { class: 'sum-lbl' }, 'previste oggi')),
      h('div', { class: 'sum-eaten' }, h('div', { class: 'sum-lbl' }, 'Mangiato'), h('b', null, `${fmtInt(eaten.kcal)} kcal`))),
    h('div', { class: 'bar' }, h('span', { style: `width:${pct}%` })),
    h('div', { class: 'macs' }, macro('p', 'Proteine'), macro('c', 'Carboidrati'), macro('f', 'Grassi')));
}

// foglio per inserire nome, kcal e macro (pasto extra o pasto libero)
function macroSheet({ title, values, presets, onSave, onDelete }) {
  const v = values || {};
  const num = (val, ph) => h('input', { inputmode: 'decimal', placeholder: ph, value: val != null ? String(r1(val)).replace('.', ',') : '' });
  const name = h('input', { value: v.name || '', placeholder: 'Es. Pasto libero', autocapitalize: 'sentences' });
  const kcal = num(v.kcalIn, 'Auto'), p = num(v.p, '0'), c = num(v.c, '0'), f = num(v.f, '0');
  const chips = h('div', { class: 'chips' }, presets.map(t => h('button', { type: 'button', class: 'chip', onclick: () => { name.value = t; } }, t)));
  const close = sheet({
    title, okLabel: 'Salva',
    body: h('div', null,
      field('Nome', name), chips,
      h('div', { class: 'field-row4' }, field('Kcal', kcal), field('Proteine g', p), field('Carbo g', c), field('Grassi g', f)),
      h('p', { class: 'hint' }, 'Valori indicativi. Se lasci vuote le kcal le calcolo io dai macronutrienti (P×4 + C×4 + G×9).'),
      onDelete && h('button', { class: 'secondary danger wide', type: 'button', onclick: () => { onDelete(); close(); } }, 'Elimina')),
    onOk: () => {
      const vals = [kcal, p, c, f].map(i => parseQty(i.value));
      if (vals.every(x => x == null)) { kcal.focus(); return false; }
      const m = macrosFromInput(...vals);
      onSave({ name: name.value.trim(), ...m, kcalIn: vals[0] });
    },
  });
}
function addExtra(key) {
  macroSheet({
    title: 'Pasto extra', presets: ['Pasto libero', 'Snack extra', 'Aperitivo', 'Dolce'],
    onSave: v => {
      const day = ensureDay(key);
      day.meals.push({ id: uid(), name: v.name || 'Pasto extra', title: '', items: [], extra: v });
      save(); render(); toast(`Aggiunto: ${v.name || 'Pasto extra'} (${fmtInt(v.kcal)} kcal)`);
    },
  });
}
function editExtra(key, mi) {
  const meal = ensureDay(key).meals[mi];
  macroSheet({
    title: 'Modifica pasto extra', values: { ...meal.extra, name: meal.name }, presets: ['Pasto libero', 'Snack extra', 'Aperitivo', 'Dolce'],
    onSave: v => { meal.name = v.name || meal.name; meal.extra = v; save(); render(); },
    onDelete: () => {
      const snap = snapshot();
      const day = ensureDay(key); day.meals.splice(mi, 1); save(); render();
      toast(`Eliminato: ${meal.name}`, 'Annulla', () => undoTo(snap));
    },
  });
}
function editFree(key, mi) {
  const meal = ensureDay(key).meals[mi];
  macroSheet({
    title: meal.name + ' · pasto libero', values: meal.free || { name: 'Pasto libero' }, presets: ['Pizza', 'Sushi', 'Hamburger', 'Pasta', 'Pasto libero'],
    onSave: v => { meal.free = v; save(); render(); },
    onDelete: meal.free && (() => { delete meal.free; save(); render(); }),
  });
}

// trascinamento (pasti e alimenti)
function startDrag(e, el, kind, key) {
  e.preventDefault();
  const main = $('#main'), list = $('#meals');
  if (kind === 'meal') list.classList.add('collapsed');
  const rect = el.getBoundingClientRect();
  const ghost = el.cloneNode(true);
  ghost.classList.add('ghost');
  Object.assign(ghost.style, { width: rect.width + 'px', left: rect.left + 'px', top: rect.top + 'px' });
  document.body.append(ghost);
  el.classList.add('dragging');
  document.body.classList.add('noselect');
  const offY = Math.min(e.clientY - rect.top, ghost.getBoundingClientRect().height - 4);
  let y = e.clientY, running = true;

  const place = () => {
    ghost.style.top = (y - offY) + 'px';
    if (kind === 'meal') {
      const others = [...list.children].filter(x => x !== el);
      const before = others.find(m => { const r = m.getBoundingClientRect(); return y < r.top + r.height / 2; }) || null;
      if (el.nextSibling !== before) list.insertBefore(el, before);
    } else {
      const meals = [...list.children].filter(m => !m.classList.contains('extra'));
      let target = meals.find(m => { const r = m.getBoundingClientRect(); return y >= r.top && y <= r.bottom; });
      if (!target) target = y < meals[0].getBoundingClientRect().top ? meals[0] : meals[meals.length - 1];
      const box = target.querySelector('.items');
      const others = [...box.children].filter(x => x !== el);
      const before = others.find(it => { const r = it.getBoundingClientRect(); return y < r.top + r.height / 2; }) || null;
      if (el.parentNode !== box || el.nextSibling !== before) box.insertBefore(el, before);
    }
  };
  const loop = () => {
    if (!running) return;
    const r = main.getBoundingClientRect();
    if (y < r.top + 60) main.scrollTop -= 9; else if (y > r.bottom - 60) main.scrollTop += 9;
    place();
    requestAnimationFrame(loop);
  };
  const move = ev => { y = ev.clientY; ev.preventDefault(); };
  const up = () => {
    running = false;
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up);
    window.removeEventListener('pointercancel', up);
    ghost.remove();
    document.body.classList.remove('noselect');
    const day = ensureDay(key);
    const meals = clone(day.meals);
    if (kind === 'meal') {
      day.meals = [...list.children].map(m => meals[+m.dataset.mi]);
    } else {
      [...list.children].forEach(m => {
        meals[+m.dataset.mi].newItems = [...m.querySelectorAll('.item')].map(it => meals[+it.dataset.mi].items[+it.dataset.ii]);
      });
      day.meals = meals.map(m => { m.items = m.newItems; delete m.newItems; return m; });
    }
    save(); render();
  };
  window.addEventListener('pointermove', move, { passive: false });
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', up);
  requestAnimationFrame(loop);
}

// ================= SPESA =================
function shopDays() {
  const map = new Map();
  if (!S.plan) return map;
  for (const d of S.plan.days) for (const m of d.meals) for (const it of m.items) {
    const s = bestMatch(it.name, S.shop);
    if (s) { if (!map.has(s.id)) map.set(s.id, new Set()); map.get(s.id).add(d.n); }
  }
  const out = new Map();
  for (const [id, set] of map) out.set(id, [...set].sort((a, b) => a - b).map(n => WEEK_LETTERS[(n - 1) % 7]).join('-'));
  return out;
}

function renderSpesa(main) {
  main.append(h('h1', { class: 'page-title' }, 'Lista della spesa'));
  if (!S.shop.length) {
    main.append(empty(IC.cart, 'Lista vuota', 'Carica il file Word della lista spesa nelle impostazioni, oppure aggiungi alimenti con +.', ['Aggiungi alimenti', openShopAdd]));
    main.append(spesaActions());
    return;
  }
  const days = shopDays();
  const st = new Map(S.shop.map(i => [i.id, shopStatus(i)]));
  const visible = S.shop.filter(i => st.get(i.id).kind !== 'covered');
  if (!visible.length) main.append(h('p', { class: 'hint' }, 'Hai già tutto in dispensa 🎉'));
  for (const c of CATS) {
    const items = visible.filter(i => i.cat === c.id);
    if (!items.length) continue;
    const box = h('div', { class: 'card' });
    for (const it of items) {
      const s = st.get(it.id);
      const msg = s.kind === 'partial' ? `Ne hai già ${s.haveLabel} · da comprare ${s.label}`
        : s.kind === 'out' ? (it.auto ? 'Finito in dispensa · da ricomprare' : 'Finito in dispensa') : '';
      box.append(h('div', { class: `row shop ${s.kind}` + (it.checked ? ' checked' : '') + (delMode ? ' del' : '') },
        delMode && h('button', { class: 'del-dot', 'aria-label': 'Elimina ' + it.name, onclick: () => delShop(it), html: IC.minus }),
        h('button', { class: 'cell-name', onclick: () => delMode ? delShop(it) : editItem(it, 'shop') },
          h('span', { class: 'nm' }, it.name),
          h('span', { class: 'qt' }, s.kind === 'partial' ? s.label : fmtQty(it.qty, it.unit)),
          msg && h('span', { class: 'st' }, msg),
          it.note && h('span', { class: 'nt' }, it.note)),
        h('span', { class: 'cell-days' }, days.get(it.id) || ''),
        !delMode && checkBtn(it.checked, 'small', () => { it.checked = !it.checked; save(); render(); }, 'Comprato ' + it.name)));
    }
    main.append(catHead(c, items.length), box);
  }
  const cov = S.shop.filter(i => st.get(i.id).kind === 'covered');
  if (cov.length) {
    main.append(h('details', { class: 'covered' },
      h('summary', null, `✓ Già in dispensa (${cov.length})`),
      h('div', { class: 'card' }, cov.map(i => {
        const p = st.get(i.id).p;
        return h('div', { class: 'row' }, h('span', { class: 'nm' }, i.name), h('span', { class: 'qt' }, 'hai ' + fmtQty(p.qty, p.unit)));
      }))));
  }
  main.append(spesaActions(st));
}
function spesaActions(st) {
  const n = S.shop.filter(i => i.checked && (!st || st.get(i.id).kind !== 'covered')).length;
  return h('div', { class: 'end-actions' },
    h('button', { class: 'round lg' + (delMode ? ' danger-on' : ''), 'aria-label': 'Modalità elimina', onclick: () => { delMode = !delMode; render(); }, html: IC.trash }),
    h('button', { class: 'round lg', 'aria-label': 'Aggiungi alimenti', onclick: openShopAdd, html: IC.plus }),
    h('button', { class: 'primary pill', onclick: fineSpesa, disabled: delMode }, n ? `Fine spesa (${n})` : 'Fine spesa'));
}
function delShop(it) {
  const snap = snapshot();
  S.shop = S.shop.filter(x => x !== it);
  const p = it.auto && S.pantry.find(x => x.id === it.pid);
  if (p) p.noShop = true; // non riproporlo finché non lo ricompri
  if (!S.shop.length) delMode = false;
  save(); render();
  toast(`Eliminato: ${it.name}`, 'Annulla', () => undoTo(snap));
}
function openShopAdd() {
  const rows = h('div', { class: 'add-rows' });
  const addRow = () => {
    const nm = h('input', { class: 'nm', placeholder: 'Nome alimento', autocapitalize: 'sentences' });
    const unit = unitSelect('g');
    const r = h('div', { class: 'add-item' });
    nm.addEventListener('input', () => { delete r.dataset.cat; });
    const sug = withSuggest(nm, f => { if (f.unit) unit.value = f.unit; r.dataset.cat = f.cat; r.querySelector('.qt').focus(); });
    r.append(h('div', { class: 'add-row' }, nm, h('input', { class: 'qt', placeholder: 'Peso', inputmode: 'decimal' }), unit), sug.list);
    rows.append(r);
    nm.focus();
  };
  const body = h('div', null, rows,
    h('button', { class: 'add-more', type: 'button', onclick: addRow }, h('span', { html: IC.plus }), 'Aggiungi un altro alimento'),
    h('p', { class: 'hint' }, 'La categoria viene scelta in automatico. Puoi cambiarla toccando l\'alimento nella lista.'));
  sheet({
    title: 'Aggiungi alla spesa', body, okLabel: 'Conferma', onOk: () => {
      let n = 0;
      for (const r of rows.children) {
        const name = r.querySelector('.nm').value.trim();
        if (!name) continue;
        const qty = parseQty(r.querySelector('.qt').value);
        S.shop.push({ id: uid(), name: cap(name), qty, unit: qty == null ? null : r.querySelector('select').value, note: '', cat: r.dataset.cat || classify(name), checked: false });
        n++;
      }
      if (n) { save(); render(); toast(n === 1 ? 'Alimento aggiunto' : `${n} alimenti aggiunti`); }
    },
  });
  addRow();
}
function addToPantry(it) {
  const p = it.qty == null ? S.pantry.find(x => norm(x.name) === norm(it.name)) : pantryFor(it);
  const amount = p && it.qty != null ? convert(it.qty, it.unit, p.unit, it.name) : null;
  if (p && it.qty == null) return;
  if (p && amount != null) { p.qty = r1(p.qty + amount); p.full = Math.max(p.full || 0, p.qty); return; }
  S.pantry.push({ id: uid(), name: it.name, qty: it.qty, unit: it.unit, cat: it.cat, full: it.qty });
}

// confronto lista spesa <-> dispensa
function pantryFor(it) {
  return bestMatch(it.name, S.pantry.filter(p => p.qty != null), { min: 0.85 });
}
// normal | covered (già tutto in dispensa) | partial (blu) | out (finito, arancio)
function shopStatus(it) {
  const p = it.pid ? S.pantry.find(x => x.id === it.pid) : pantryFor(it);
  if (!p || p.qty == null) return { kind: 'normal' };
  if (p.qty <= 0) return { kind: 'out', p };
  const have = it.qty == null ? null : convert(p.qty, p.unit, it.unit, it.name);
  if (have == null) return { kind: 'normal', p };
  if (have >= it.qty - 0.01) return { kind: 'covered', p };
  const need = it.qty - have, pack = packOf(it);
  if (pack) {
    const k = Math.ceil(need / pack.size - 0.01), hp = r1(have / pack.size);
    return {
      kind: 'partial', p, need: k * pack.size, label: `${k} ${packWord(pack.word, k)}`,
      haveLabel: Number.isInteger(hp) ? `${hp} ${packWord(pack.word, hp)}` : fmtQty(have, it.unit),
    };
  }
  return { kind: 'partial', p, need: r1(need), label: fmtQty(need, it.unit), haveLabel: fmtQty(have, it.unit) };
}
// aggiunge alla spesa gli alimenti finiti in dispensa e toglie quelli tornati disponibili
function syncShop() {
  let changed = false;
  for (const p of S.pantry) if (p.noShop && p.qty !== 0) { delete p.noShop; changed = true; }
  S.shop = S.shop.filter(it => {
    if (!it.auto || it.checked) return true;
    const p = S.pantry.find(x => x.id === it.pid);
    if (p && p.qty === 0) return true;
    changed = true;
    return false;
  });
  for (const p of S.pantry) {
    if (p.qty !== 0 || p.noShop) continue;
    if (S.shop.some(it => it.pid === p.id) || bestMatch(p.name, S.shop, { min: 0.85 })) continue;
    const full = p.full || null;
    S.shop.push({ id: uid(), name: p.name, qty: full, unit: full ? p.unit : null, note: '', cat: p.cat, checked: false, auto: true, pid: p.id });
    changed = true;
  }
  if (changed) save();
}
function fineSpesa() {
  const done = S.shop.filter(i => i.checked).map(i => [i, shopStatus(i)]).filter(([, st]) => st.kind !== 'covered');
  if (!done.length) { toast('Spunta prima gli alimenti che hai comprato'); return; }
  const snap = snapshot();
  done.forEach(([it, st]) => addToPantry({ ...it, qty: st.kind === 'partial' ? st.need : it.qty }));
  S.shop = S.shop.filter(i => !i.checked);
  save(); render();
  toast(`${done.length} ${done.length === 1 ? 'alimento aggiunto' : 'alimenti aggiunti'} alla dispensa`, 'Annulla', () => undoTo(snap), 5000);
}

// ================= FRIGO / DISPENSA =================
function renderFrigo(main) {
  main.append(h('h1', { class: 'page-title' }, 'Dispensa'));
  if (!S.pantry.length) {
    main.append(empty(IC.fridge, 'Dispensa vuota', 'Quando premi "Fine spesa" gli alimenti comprati arrivano qui. Puoi anche aggiungerli a mano.'));
  }
  for (const c of CATS) {
    const items = S.pantry.filter(i => i.cat === c.id);
    if (!items.length) continue;
    const box = h('div', { class: 'card' });
    for (const it of items) {
      const fg = h('div', { class: 'row pantry' + (it.qty === 0 ? ' finished' : '') },
        h('span', { class: 'nm' }, it.name),
        h('span', { class: 'qt' }, it.qty === 0 ? 'finito' : it.qty == null ? '—' : fmtQty(it.qty, it.unit)),
        h('button', { class: 'icon-btn', 'aria-label': 'Modifica ' + it.name, onclick: () => editItem(it, 'pantry'), html: IC.pencil }));
      const wrap = h('div', { class: 'swipe' }, h('div', { class: 'swipe-bg' }, h('span', { html: IC.trash }), 'Elimina'), fg);
      swipeable(wrap, fg, () => {
        const snap = snapshot();
        S.pantry = S.pantry.filter(x => x !== it);
        save(); render();
        toast(`Eliminato: ${it.name}`, 'Annulla', () => undoTo(snap));
      });
      box.append(wrap);
    }
    main.append(catHead(c, items.length), box);
  }
  if (S.pantry.length) main.append(h('p', { class: 'hint' }, 'Scorri un alimento verso destra per eliminarlo.'));
  main.append(h('div', { class: 'end-actions center' },
    h('button', { class: 'primary pill', onclick: openPantryAdd }, h('span', { class: 'btn-ic', html: IC.plus }), 'Aggiungi alimento')));
}
function swipeable(wrap, fg, onDelete) {
  let x0, y0, dx = 0, active = false, lock = null;
  wrap.addEventListener('pointerdown', e => {
    if (e.target.closest('button')) return;
    x0 = e.clientX; y0 = e.clientY; dx = 0; active = true; lock = null; fg.style.transition = 'none';
  });
  wrap.addEventListener('pointermove', e => {
    if (!active) return;
    const ddx = e.clientX - x0, ddy = e.clientY - y0;
    if (!lock && (Math.abs(ddx) > 8 || Math.abs(ddy) > 8)) lock = Math.abs(ddx) > Math.abs(ddy) ? 'x' : 'y';
    if (lock === 'x') { dx = Math.max(0, ddx); fg.style.transform = `translateX(${dx}px)`; wrap.classList.toggle('armed', dx > 110); }
  });
  const end = () => {
    if (!active) return;
    active = false;
    fg.style.transition = '';
    if (lock === 'x' && dx > 110) { fg.style.transform = 'translateX(110%)'; setTimeout(onDelete, 180); }
    else { fg.style.transform = ''; wrap.classList.remove('armed'); }
  };
  wrap.addEventListener('pointerup', end);
  wrap.addEventListener('pointercancel', end);
}
function openPantryAdd() {
  const name = h('input', { placeholder: 'Es. Carote', autocapitalize: 'sentences' });
  const qty = h('input', { placeholder: 'Quantità', inputmode: 'decimal' });
  const unit = unitSelect('g');
  const chips = catChips('');
  name.addEventListener('input', () => { if (!chips.dataset.touched && name.value.trim()) chips.set(classify(name.value)); });
  sheet({
    title: 'Aggiungi in dispensa', okLabel: 'Aggiungi',
    body: h('div', null, h('div', { class: 'field' }, h('span', null, 'Categoria'), chips),
      h('div', { class: 'field' }, h('span', null, 'Nome'), withSuggest(name, f => {
        chips.set(f.cat); chips.dataset.touched = '1';
        if (f.unit) unit.value = f.unit;
        qty.focus();
      })),
      h('div', { class: 'field-row' }, field('Quantità', qty), field('Unità', unit))),
    onOk: () => {
      const n = name.value.trim();
      if (!n) { name.focus(); return false; }
      const q = parseQty(qty.value);
      // se l'alimento è già in dispensa, somma la quantità invece di crearne un doppione
      const ex = S.pantry.find(p => toks(p.name).join(' ') === toks(n).join(' '));
      const add = ex && q != null ? convert(q, unit.value, ex.unit || unit.value, n) : null;
      if (ex && add != null) {
        ex.qty = r1((ex.qty || 0) + add); ex.unit = ex.unit || unit.value; ex.full = Math.max(ex.full || 0, ex.qty);
        save(); render(); toast(`${ex.name}: ora ${fmtQty(ex.qty, ex.unit)}`);
        return;
      }
      S.pantry.push({ id: uid(), name: cap(n), qty: q, unit: q == null ? null : unit.value, cat: chips.dataset.val || classify(n), full: q });
      save(); render(); toast('Aggiunto in dispensa');
    },
  });
  setTimeout(() => name.focus(), 250);
}

// modifica (spesa o dispensa)
function editItem(it, kind) {
  const name = h('input', { value: it.name, autocapitalize: 'sentences' });
  const qty = h('input', { value: it.qty == null ? '' : String(r1(it.qty)).replace('.', ','), inputmode: 'decimal', placeholder: '—' });
  const unit = unitSelect(it.unit);
  const chips = catChips(it.cat);
  sheet({
    title: 'Modifica', okLabel: 'Salva',
    body: h('div', null, h('div', { class: 'field' }, h('span', null, 'Nome'), withSuggest(name, f => chips.set(f.cat))),
      h('div', { class: 'field-row' }, field('Quantità', qty), field('Unità', unit)),
      h('div', { class: 'field' }, h('span', null, 'Categoria'), chips),
      it.note && h('p', { class: 'hint' }, it.note)),
    onOk: () => {
      const n = name.value.trim();
      if (!n) return false;
      it.name = n; it.qty = parseQty(qty.value); it.unit = it.qty == null ? null : unit.value; it.cat = chips.dataset.val || it.cat;
      if (kind === 'pantry' && it.qty > (it.full || 0)) it.full = it.qty;
      save(); render();
    },
  });
}

// ================= IMPOSTAZIONI =================
function pickFile(accept, fn) {
  const inp = h('input', { type: 'file', accept, style: 'display:none' });
  inp.addEventListener('change', () => { if (inp.files[0]) fn(inp.files[0]); inp.remove(); });
  document.body.append(inp);
  inp.click();
}
const DOCX = '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

async function loadDietFile(file) {
  try {
    const plan = parseDiet(await readDocx(await file.arrayBuffer()));
    const t = dkey(today());
    for (const k of Object.keys(S.days)) {
      if (k >= t && !S.days[k].meals.some(m => m.items.some(i => i.done))) delete S.days[k];
    }
    S.plan = plan; S.planName = file.name;
    save(); render(); refreshSettings();
    const meals = plan.days.reduce((a, d) => a + d.meals.length, 0);
    toast(`Dieta caricata: ${plan.days.length} giorni, ${meals} pasti`);
  } catch (e) { alert('Non riesco a leggere il file della dieta: ' + e.message); }
}
async function loadShopFile(file) {
  try {
    const items = parseShopping(await readDocx(await file.arrayBuffer()));
    if (S.shop.length && !confirm(`La lista attuale ha ${S.shop.length} alimenti. Vuoi sostituirla con quella del file?`)) return;
    S.shop = items.map(i => ({ id: uid(), ...i })); S.shopName = file.name;
    save(); render(); refreshSettings();
    toast(`Lista spesa caricata: ${items.length} alimenti`);
  } catch (e) { alert('Non riesco a leggere il file della lista spesa: ' + e.message); }
}
async function exportBackup() {
  const name = `dieta-backup-${dkey(new Date())}.json`;
  const file = new File([JSON.stringify(S)], name, { type: 'application/json' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], title: name }); return; } catch (e) { if (e.name === 'AbortError') return; }
  }
  const a = h('a', { href: URL.createObjectURL(file), download: name });
  document.body.append(a); a.click(); a.remove();
}
function importBackup(file) {
  file.text().then(t => {
    const s = JSON.parse(t);
    if (!s || s.v !== 1) throw new Error('file di backup non valido');
    if (!confirm('Ripristinare il backup? I dati attuali verranno sostituiti.')) return;
    S = Object.assign(blank(), s); save(); render(); refreshSettings(); toast('Backup ripristinato');
  }).catch(e => alert('Errore: ' + e.message));
}

let settingsBody = null;
function refreshSettings() {
  if (!settingsBody || !settingsBody.isConnected) return;
  settingsBody.replaceChildren(...settingsContent());
}
function settingsContent() {
  const fileRow = (n, title, current, fn) => h('div', { class: 'set-row' },
    h('div', { class: 'set-num' }, n),
    h('div', { class: 'set-text' }, h('div', { class: 'set-title' }, title), h('div', { class: 'set-sub' }, current || 'Nessun file caricato')),
    h('button', { class: 'secondary', onclick: () => pickFile(DOCX, fn) }, current ? 'Sostituisci' : 'Carica'));
  const out = [
    h('h3', null, 'Inserisci file'),
    h('div', { class: 'card' },
      fileRow(1, 'Dieta', S.planName && `${S.planName} · ${S.plan.days.length} giorni`, loadDietFile),
      fileRow(2, 'Lista spesa', S.shopName, loadShopFile)),
    h('p', { class: 'hint' }, 'File Word (.docx). Salvali sull\'iPhone (es. in iCloud Drive o "Sul mio iPhone") e sceglili da qui. Il Giorno 1 della dieta corrisponde al lunedì.'),
  ];
  if (S.plan && S.plan.notes.length) {
    out.push(h('h3', null, 'Indicazioni della nutrizionista'));
    out.push(h('div', { class: 'card' }, S.plan.notes.map(n => h('details', { class: 'note' },
      h('summary', null, n.title), h('ul', null, n.lines.map(l => h('li', null, l)))))));
  }
  out.push(
    h('h3', null, 'Backup'),
    h('div', { class: 'card pad' },
      h('p', { class: 'set-sub' }, 'I dati restano solo su questo iPhone. Ogni tanto salva un backup su File o iCloud.'),
      h('div', { class: 'btn-row' },
        h('button', { class: 'secondary', onclick: exportBackup }, 'Esporta backup'),
        h('button', { class: 'secondary', onclick: () => pickFile('.json,application/json', importBackup) }, 'Ripristina'))),
    h('h3', null, 'Azzera'),
    h('div', { class: 'card pad' }, h('div', { class: 'btn-row' },
      h('button', { class: 'secondary danger', onclick: () => { if (confirm('Svuotare completamente la dispensa?')) { S.pantry = []; save(); render(); toast('Dispensa svuotata'); } } }, 'Svuota dispensa'),
      h('button', { class: 'secondary danger', onclick: () => { if (confirm('Cancellare TUTTI i dati dell\'app? Dieta e lista spesa torneranno quelle originali.')) { S = initial(); save(); render(); refreshSettings(); toast('Dati cancellati'); } } }, 'Cancella tutto'))),
    h('p', { class: 'version' }, 'Dieta · Spesa · Dispensa — v1.0'));
  return out;
}
function openSettings() {
  settingsBody = h('div', { class: 'settings' }, settingsContent());
  sheet({ title: 'Impostazioni', body: settingsBody, noOk: true });
}

// ---------- avvio ----------
function init() {
  $('#btn-settings').innerHTML = IC.gear;
  $('#btn-settings').addEventListener('click', openSettings);
  const icons = { frigo: IC.fridge, spesa: IC.cart, dieta: IC.plate };
  document.querySelectorAll('.tab').forEach(b => {
    b.querySelector('.pill').innerHTML = icons[b.dataset.tab];
    b.addEventListener('click', () => setTab(b.dataset.tab));
  });
  updateClock();
  setInterval(updateClock, 10000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) updateClock(); });
  render();
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => { });
  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => { });
}
init();
