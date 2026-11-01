/* Director de partida: decide qué carta sale después. Un DJ de conversaciones.
 * Probabilidades ponderadas + restricciones. Nunca una secuencia fija ni aprendible.
 *   1. Elige la mecánica (pesos de la mezcla, enfriamientos, picos de la curva, reglas activas).
 *   2. Elige la carta dentro de esa mecánica, penalizando lo reciente: familia semántica (ideas, no redacción),
 *      tema, territorio, profundidad, energía, marco temporal, estructura de frase, rareza, cartas ya vistas.
 *   Después de algo profundo, algo ligero. Después de mucho absurdo, algo real y concreto. Después de varios
 *   recuerdos, cambio de tiempo. Después de varias cartas tranquilas, algo rápido. Siempre como tendencia, nunca como regla.
 */
(function (root) {
const MECHS = ['libre', 'rapida', 'predice', 'alavez', 'juicio', 'caos'];

const MODES = {
  random:   { name: 'Random total', mech: { libre: .42, rapida: .10, predice: .16, alavez: .11, juicio: .15, caos: .06 } },
  risas:    { name: 'Solo risas', mech: { libre: .40, rapida: .18, predice: .12, alavez: .08, juicio: .17, caos: .05 },
              cat: { teo: 2, rank: 2, esp: 1.8, acus: 2, tit: 1.6, expl: 1.6, hip: 1.4, mini: 1.3, lore: 1.2, cotid: .6, antes: .5, exis: .12, intim: .15, pref: .8 },
              depth: { 1: 1.2, 2: 1.1, 3: .7, 4: .15, 5: .05 }, juicioReal: .5 },
  tres:     { name: '3 a.m.', mech: { libre: .58, rapida: .03, predice: .14, alavez: .12, juicio: .09, caos: .04 },
              cat: { exis: 3, antes: 1.6, intim: 1.6, cotid: 1, hip: 1.2, mini: 1.2, pref: 1.4, lore: 1.3, comp: 1.1, rank: .2, acus: .15, tit: .3, teo: .4, expl: .4 },
              depth: { 1: .5, 2: .7, 3: 1.3, 4: 2, 5: 2 }, energy: { 1: 1.6, 2: 1, 3: .5 } },
  antes:    { name: 'Antes de mí', mech: { libre: .54, rapida: .04, predice: .18, alavez: .12, juicio: .08, caos: .04 },
              cat: { antes: 3.5, exis: 1, cotid: .5, pref: .6, lore: .5, obs: .3, hip: .4, mini: .3, esp: .3, teo: .3, rank: .3, acus: .2, tit: .2, expl: .2, comp: .6 },
              tag: { antes: 3, nostalgia: 3, infancia: 2, adolescencia: 2, colegio: 2, primeras: 2, recuerdos: 1.5 } },
  conoces:  { name: '¿De verdad me conoces?', mech: { libre: .32, rapida: .10, predice: .30, alavez: .20, juicio: .05, caos: .03 },
              cat: { obs: 3, lore: 2, comp: 1.6, ctx: 1.6, cdb: 2, cotid: .8, teo: .3, rank: .4, mini: .5, hip: .6, antes: .5 } },
  demonios: { name: 'Qué demonios', mech: { libre: .46, rapida: .08, predice: .16, alavez: .10, juicio: .13, caos: .07 },
              rar: [0, .08, .12, 1, 4, 5], juicioReal: .35 },
  caos:     { name: 'Caos', mech: { libre: .30, rapida: .08, predice: .15, alavez: .10, juicio: .15, caos: .22 }, caosGap: 2, caosMax: 99 },
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
  return { mode: opts.mode || 'random', history: [], used: [], pool: opts.pool || null, filter: opts.filter || null };
}

/* ctx: { cards, seen:Set, rule, recent:[[ids de la última partida], [anterior], ...], maxIntimacy (0–3), rng }
 * game.filter: { mechs:[...], cats:[...] } restringe el mazo a un tipo de carta elegido a mano. */
function pick(game, ctx) {
  const rng = ctx.rng || Math.random;
  const M = MODES[game.mode] || MODES.random; // una mezcla retirada cae en Random total
  const used = new Set(game.used);
  const F = game.filter;
  const maxI = ctx.maxIntimacy == null ? 1 : ctx.maxIntimacy;
  const pool = (game.pool ? ctx.cards.filter(c => game.pool.includes(c.id)) : ctx.cards)
    .filter(c => !used.has(c.id) && c.i <= maxI && (!F || ((!F.mechs || F.mechs.includes(c.mech)) && (!F.cats || F.cats.includes(c.cat)))));
  if (!pool.length) return null;
  // memoria entre partidas: cuanto más reciente, más tarda en volver (penalización fuerte pero temporal)
  const recentPen = new Map();
  (ctx.recent || []).forEach((ids, k) => { const pen = [.03, .08, .2, .4, .6, .8][k] || 1; ids.forEach(id => { if (!recentPen.has(id)) recentPen.set(id, pen); }); });
  const H = game.history, pos = H.length, last = H[H.length - 1], last2 = H[H.length - 2], last3 = H[H.length - 3];
  const ruleActive = ctx.rule && ctx.rule.left > 0;

  // 1 · mecánica
  const mw = MECHS.map(m => {
    let w = M.mech[m] || 0;
    if (!pool.some(c => c.mech === m)) return 0;
    const gap = m === 'caos' ? (M.caosGap || COOLDOWN.caos) : COOLDOWN[m];
    if (gap) { for (let k = 1; k <= gap; k++) if (H[H.length - k] && H[H.length - k].mech === m) return 0; }
    if (m === 'libre' && last && last2 && last.mech === 'libre' && last2.mech === 'libre') w *= .35; // tres preguntas directas seguidas: raro
    if (m === 'libre' && last && last2 && last3 && last.mech === 'libre' && last2.mech === 'libre' && last3.mech === 'libre') return 0;
    if (pos === 0 && (m === 'caos' || m === 'juicio')) return 0;
    if (pos < 3 && m === 'caos') return 0;
    if (m === 'caos' && ruleActive) return 0;
    if (m === 'caos' && H.filter(h => h.mech === 'caos').length >= (M.caosMax || 3)) return 0;
    const peak = (pos >= 7 && pos <= 11) || (pos >= 16 && pos <= 20);
    if (peak && (m === 'juicio' || m === 'caos')) w *= 1.8;
    if (ruleActive && ctx.rule.affects === 'juicio' && m === 'juicio') w *= 4;
    if (last && last.dur === 2 && m === 'rapida') w *= 1.6; // después de algo largo, algo rápido
    if (last && last.d >= 4 && (m === 'rapida' || m === 'alavez')) w *= 1.4; // después de algo profundo, algo ligero y compartido
    if (last && last2 && last.e === 1 && last2.e === 1 && (m === 'rapida' || m === 'caos' || m === 'juicio')) w *= 1.5; // tras calma, algo con chispa
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
  const recentTerr = H.slice(-2).map(h => h.terr);
  const famStrong = new Set(H.slice(-14).filter(h => h.famX).map(h => h.fam)), famSoft = new Set(H.slice(-5).map(h => h.fam));
  const gameTags = new Map(); H.forEach(h => h.tags.forEach(t => gameTags.set(t, (gameTags.get(t) || 0) + 1)));
  const single = F && F.mechs && F.mechs.length === 1 && (!F.cats || F.cats.length === 1); // un solo tipo: no castigar lo inevitable
  const lowRun = last && last2 && last.r <= 2 && last2.r <= 2;
  const absurdRun = last && last2 && last.r >= 3 && last2.r >= 3; // mucha energía absurda: pedir algo real y concreto
  const pastRun = last && last2 && last.time === 'past' && last2.time === 'past';
  const deepRun = H.slice(-3).filter(h => h.d >= 4).length;
  const calmRun = last && last2 && last3 && last.e === 1 && last2.e === 1 && last3.e === 1;
  const hotRun = last && last2 && last.e === 3 && last2.e === 3;
  const lastJuicio = (() => { for (let k = H.length - 1; k >= 0; k--) if (H[k].mech === 'juicio') return H[k]; return null; })();
  const lastIntim = H.slice(-3).some(h => h.i >= 2);
  // «¿Qué prefieres?» debe ser un formato reconocible: si lleva 6 cartas sin salir, sube; si acaba de salir, baja.
  const sincePref = (() => { for (let k = 1; k <= H.length; k++) if (H[H.length - k].cat === 'pref') return k; return 99; })();
  let cands = pool.filter(c => c.mech === mech);
  const score = c => {
    let w = 1;
    if (M.cat && M.cat[c.cat] != null) w *= M.cat[c.cat];
    if (M.tag) for (const t of c.tags) if (M.tag[t]) { w *= M.tag[t]; break; }
    if (M.depth) w *= M.depth[c.d] || 1;
    if (M.energy) w *= M.energy[c.e] || 1;
    if (M.rar) w *= M.rar[c.r];
    if (ctx.seen && ctx.seen.has(c.id)) w *= .04;
    if (recentPen.has(c.id)) w *= recentPen.get(c.id);
    // familia semántica: la misma idea con otra redacción no es variedad
    if (c.famX && famStrong.has(c.fam)) w *= .03;
    else if (famSoft.has(c.fam)) w *= .3;
    if (!single) {
      if (recentCats.has(c.cat)) w *= .1;
      if (recentTerr[1] === c.terr && recentTerr[0] === c.terr) w *= .25; // tres cartas del mismo territorio seguidas: casi nunca
      if (c.cat === 'pref') w *= sincePref >= 6 ? 6 : sincePref <= 2 ? .1 : 1.6;
    }
    let overlap = 0; for (const t of c.tags) if (recentTags.has(t)) overlap++;
    if (overlap) w *= Math.pow(.25, overlap);
    for (const t of c.tags) { const n = gameTags.get(t) || 0; if (n >= 2) w *= .5; } // mismo tema varias veces en la partida
    if (recentOpen.has(c.open)) w *= .12; // misma estructura de frase
    if (last) {
      if (last.r >= 4 && c.r >= 4) w *= .2;
      if (last.r === 5 && c.r === 5) w = 0;
      if (lowRun && c.r >= 3) w *= 1.8;
      if (absurdRun) w *= c.real ? 2.2 : .45;
      // profundidad: después de algo profundo, algo curioso o ligero
      if (last.d >= 4 && c.d >= 4) w *= .15;
      if (last.d >= 4 && c.d <= 2) w *= 1.6;
      if (deepRun >= 2 && c.d >= 4) w *= .1;
      if (last.d === 5 && c.d === 5) w = 0;
      if (last.dur === 2 && c.dur === 2) w *= .3;
      // energía: variedad de ritmo
      if (hotRun && c.e === 3) w *= .4;
      if (calmRun && c.e === 3) w *= 1.8;
      if (calmRun && c.e === 1) w *= .5;
      // marco temporal: tras varios recuerdos, cambio de tiempo
      if (pastRun && c.time === 'past') w *= .25;
      if (last.time !== 'now' && c.time === last.time && last2 && last2.time === c.time) w *= .3;
      if (last.emotion && c.emotion === last.emotion) w *= .5;
    }
    // juicio: alternar lo real y lo absurdo según la proporción editorial de la mezcla
    if (c.mech === 'juicio') {
      const share = M.juicioReal == null ? .45 : M.juicioReal;
      w *= c.real ? share : 1 - share;
      if (lastJuicio && lastJuicio.real === c.real) w *= .5;
    }
    // intimidad: nunca en las dos primeras cartas, y no dos cartas íntimas seguidas
    if (c.i >= 2 && pos < 5) w *= .15;
    if (c.i >= 1 && pos < 2) w *= .3;
    if (c.i >= 1 && lastIntim) w *= .15;
    if (pos < 2 && c.r >= 4 && game.mode !== 'demonios') w *= .1;
    if (pos < 2 && c.d >= 4) w *= .15;
    return w;
  };
  let card = weighted(cands, cands.map(score), rng);
  if (!card) { cands = pool; card = weighted(cands, cands.map(c => Math.max(score(c), 1e-6)), rng); }
  return card;
}

function record(game, card) {
  game.used.push(card.id);
  game.history.push({ id: card.id, mech: card.mech, cat: card.cat, terr: card.territory, r: card.r, d: card.d, e: card.e, i: card.i, dur: card.dur,
    tags: card.tags, open: card.open, fam: card.fam, famX: card.famExplicit, time: card.time, emotion: card.emotion, real: card.real });
}

const api = { MODES, MECHS, newGame, pick, record };
if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.NTP_DIRECTOR = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
