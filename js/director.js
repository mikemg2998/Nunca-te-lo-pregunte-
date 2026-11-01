/* Director de partida: decide qué carta sale después.
 * Probabilidades ponderadas + restricciones. Nunca una secuencia fija.
 *   1. Elige la mecánica (pesos del modo, enfriamientos, picos de la curva, reglas activas).
 *   2. Elige la carta dentro de esa mecánica (modo, rareza reciente, profundidad, duración,
 *      categoría y temas recientes, arranque de frase repetido, cartas ya vistas).
 */
(function (root) {
const MECHS = ['libre', 'rapida', 'predice', 'alavez', 'juicio', 'caos'];

const MODES = {
  random:   { name: 'Random total', mech: { libre: .40, rapida: .12, predice: .17, alavez: .12, juicio: .11, caos: .06 } },
  risas:    { name: 'Solo risas', mech: { libre: .40, rapida: .18, predice: .12, alavez: .08, juicio: .17, caos: .05 },
              cat: { teo: 2, rank: 2, esp: 1.8, acus: 2, tit: 1.6, expl: 1.6, hip: 1.4, mini: 1.3, lore: 1.2, exis: .12, pref: .7 }, depth: [1.2, .7, .08] },
  tres:     { name: '3 a.m.', mech: { libre: .56, rapida: .04, predice: .15, alavez: .14, juicio: .07, caos: .04 },
              cat: { exis: 3, hip: 1.6, mini: 1.6, pref: 1.6, lore: 1.3, comp: 1.3, rank: .3, acus: .2, tit: .4, teo: .6, expl: .5 }, depth: [.6, 1.5, 2.2] },
  conoces:  { name: '¿De verdad me conoces?', mech: { libre: .32, rapida: .10, predice: .30, alavez: .20, juicio: .05, caos: .03 },
              cat: { obs: 3, lore: 2, comp: 1.6, ctx: 1.6, cdb: 2, teo: .3, rank: .4, mini: .5, hip: .6 } },
  demonios: { name: 'Qué demonios', mech: { libre: .46, rapida: .08, predice: .16, alavez: .10, juicio: .13, caos: .07 },
              rar: [0, .08, .12, 1, 4, 5] },
  rapido:   { name: 'Rápido', mech: { libre: .28, rapida: .42, predice: .12, alavez: .12, juicio: .06, caos: 0 },
              shortOnly: true },
  caos:     { name: 'Caos', mech: { libre: .30, rapida: .08, predice: .18, alavez: .12, juicio: .18, caos: .14 }, caosGap: 3 },
  favs:     { name: 'Favoritas', mech: { libre: .4, rapida: .12, predice: .17, alavez: .12, juicio: .11, caos: .08 } },
};

const COOLDOWN = { rapida: 2, predice: 2, alavez: 2, juicio: 3, caos: 6 };

function weighted(items, w, rng) {
  let total = 0; for (const x of w) total += x;
  if (total <= 0) return null;
  let t = rng() * total;
  for (let i = 0; i < items.length; i++) { t -= w[i]; if (t <= 0) return items[i]; }
  return items[items.length - 1];
}

function newGame(opts) {
  return { mode: opts.mode || 'random', length: opts.length || 25, history: [], used: [], pool: opts.pool || null };
}

/* ctx: { cards, seen:Set, rule, recent:[[ids de la última partida], [anterior], ...], rng }
 * game.filter: { mechs:[...], cats:[...] } restringe el mazo a un tipo de carta elegido a mano. */
function pick(game, ctx) {
  const rng = ctx.rng || Math.random;
  const M = MODES[game.mode] || MODES.random;
  const used = new Set(game.used);
  const F = game.filter;
  const pool = (game.pool ? ctx.cards.filter(c => game.pool.includes(c.id)) : ctx.cards)
    .filter(c => !used.has(c.id) && (!F || ((!F.mechs || F.mechs.includes(c.mech)) && (!F.cats || F.cats.includes(c.cat)))));
  if (!pool.length) return null;
  // memoria entre partidas: cuanto más reciente, más tarda en volver (penalización fuerte pero temporal)
  const recentPen = new Map();
  (ctx.recent || []).forEach((ids, k) => { const pen = [.03, .08, .2, .4, .6, .8][k] || 1; ids.forEach(id => { if (!recentPen.has(id)) recentPen.set(id, pen); }); });
  const H = game.history, pos = H.length, last = H[H.length - 1], last2 = H[H.length - 2];
  const ruleActive = ctx.rule && ctx.rule.left > 0;

  // 1 · mecánica
  const mw = MECHS.map(m => {
    let w = M.mech[m] || 0;
    if (!pool.some(c => c.mech === m)) return 0;
    const gap = m === 'caos' ? (M.caosGap || COOLDOWN.caos) : COOLDOWN[m];
    if (gap) { for (let k = 1; k <= gap; k++) if (H[H.length - k] && H[H.length - k].mech === m) return 0; }
    if (m === 'libre' && last && last2 && last.mech === 'libre' && last2.mech === 'libre') return 0;
    if (pos === 0 && (m === 'caos' || m === 'juicio')) return 0;
    if (pos < 3 && m === 'caos') return 0;
    if (m === 'caos' && ruleActive) return 0;
    if (m === 'caos' && game.mode !== 'caos' && H.filter(h => h.mech === 'caos').length >= 3) return 0;
    const peak = (pos >= 7 && pos <= 11) || (pos >= 16 && pos <= 20);
    if (peak && (m === 'juicio' || m === 'caos')) w *= 1.8;
    if (ruleActive && ctx.rule.affects === 'juicio' && m === 'juicio') w *= 4;
    if (last && last.dur === 2 && m === 'rapida') w *= 1.6; // después de algo largo, algo rápido
    return w;
  });
  let mech = weighted(MECHS, mw, rng);
  if (!mech) { // todo en enfriamiento: relajar, pero nunca repetir la última mecánica
    const alt = MECHS.filter(m => m !== 'caos' && (!last || m !== last.mech) && pool.some(c => c.mech === m));
    mech = alt.length ? alt[Math.floor(rng() * alt.length)] : pool[Math.floor(rng() * pool.length)].mech;
  }

  // 2 · carta
  const recent = H.slice(-6), recentTags = new Set(recent.flatMap(h => h.tags));
  const recentCats = new Set(H.slice(-2).map(h => h.cat)), recentOpen = new Set(H.slice(-6).map(h => h.open));
  const gameTags = new Map(); H.forEach(h => h.tags.forEach(t => gameTags.set(t, (gameTags.get(t) || 0) + 1)));
  const single = F && F.mechs && F.mechs.length === 1 && (!F.cats || F.cats.length === 1); // un solo tipo: no castigar lo inevitable
  const lowRun = last && last2 && last.r <= 2 && last2.r <= 2;
  // «¿Qué prefieres?» debe ser un formato reconocible: si lleva 6 cartas sin salir, sube; si acaba de salir, baja.
  const sincePref = (() => { for (let k = 1; k <= H.length; k++) if (H[H.length - k].cat === 'pref') return k; return 99; })();
  let cands = pool.filter(c => c.mech === mech);
  const score = c => {
    let w = 1;
    if (M.cat && M.cat[c.cat] != null) w *= M.cat[c.cat];
    if (M.depth) w *= M.depth[c.d] || 1;
    if (M.rar) w *= M.rar[c.r];
    if (M.shortOnly) w *= c.len > 130 ? .2 : c.len > 95 ? .6 : 1.2;
    if (ctx.seen && ctx.seen.has(c.id)) w *= .04;
    if (recentPen.has(c.id)) w *= recentPen.get(c.id);
    if (!single) {
      if (recentCats.has(c.cat)) w *= .1;
      if (c.cat === 'pref') w *= sincePref >= 6 ? 6 : sincePref <= 2 ? .1 : 1.6;
    }
    let overlap = 0; for (const t of c.tags) if (recentTags.has(t)) overlap++;
    if (overlap) w *= Math.pow(.25, overlap);
    for (const t of c.tags) { const n = gameTags.get(t) || 0; if (n >= 2) w *= .5; } // mismo tema varias veces en la partida
    if (recentOpen.has(c.open)) w *= .12;
    if (last) {
      if (last.r >= 4 && c.r >= 4) w *= .2;
      if (last.r === 5 && c.r === 5) w = 0;
      if (lowRun && c.r >= 3) w *= 1.8;
      if (last.d === 2 && c.d === 2) w *= .15;
      if (last.dur === 2 && c.dur === 2) w *= .3;
    }
    if (pos < 2 && c.r >= 4 && game.mode !== 'demonios') w *= .1;
    if (pos < 2 && c.d === 2) w *= .2;
    return w;
  };
  let card = weighted(cands, cands.map(score), rng);
  if (!card) { cands = pool; card = weighted(cands, cands.map(c => Math.max(score(c), 1e-6)), rng); }
  return card;
}

function record(game, card) {
  game.used.push(card.id);
  game.history.push({ id: card.id, mech: card.mech, cat: card.cat, r: card.r, d: card.d, dur: card.dur, tags: card.tags, open: card.open });
}

const api = { MODES, MECHS, newGame, pick, record };
if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.NTP_DIRECTOR = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
