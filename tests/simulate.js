// Simula partidas completas con el director y comprueba ritmo y variedad.
// Uso: node tests/simulate.js [partidas]
const { CARDS } = require('../js/cards.js');
const D = require('../js/director.js');

const N = +(process.argv[2] || 100), LEN = 25;
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

let fails = [];
const report = {};
for (const mode of Object.keys(D.MODES).filter(m => m !== 'favs')) {
  const seen = new Set();
  const stats = { mech: {}, maxSameMech: 0, sameCatAdj: 0, r5pairs: 0, openRepeat: 0, caosPerGame: 0, prefPerGame: 0, r: [0, 0, 0, 0, 0, 0], unseenShare: 0, cards: 0 };
  for (let g = 0; g < N; g++) {
    const rng = mulberry(g * 7919 + mode.length);
    const game = D.newGame({ mode, length: LEN });
    let rule = null, freshThisGame = 0;
    for (let i = 0; i < LEN; i++) {
      const c = D.pick(game, { cards: CARDS, seen, rule, rng });
      if (!c) { fails.push(`${mode}: sin carta en la posición ${i}`); break; }
      if (!seen.has(c.id)) freshThisGame++;
      D.record(game, c);
      if (rule && c.mech !== 'caos') { if (rule.affects === 'any' || rule.affects === 'veto' || (rule.affects === 'juicio' && c.mech === 'juicio')) rule.left--; if (rule.left <= 0) rule = null; }
      if (c.mech === 'caos' && c.n > 0) rule = { affects: c.affects, left: c.n };
    }
    game.used.forEach(id => seen.add(id));
    const h = game.history; stats.cards += h.length; stats.unseenShare += freshThisGame / h.length;
    let run = 1;
    for (let i = 0; i < h.length; i++) {
      stats.mech[h[i].mech] = (stats.mech[h[i].mech] || 0) + 1; stats.r[h[i].r]++;
      if (i) {
        run = h[i].mech === h[i - 1].mech ? run + 1 : 1; stats.maxSameMech = Math.max(stats.maxSameMech, run);
        if (h[i].cat === h[i - 1].cat) stats.sameCatAdj++;
        if (h[i].r === 5 && h[i - 1].r === 5) stats.r5pairs++;
        if (h[i].open === h[i - 1].open) stats.openRepeat++;
        if (h[i].mech !== 'libre' && h[i].mech === h[i - 1].mech) fails.push(`${mode}: ${h[i].mech} repetida seguida en la partida ${g}`);
      }
    }
    stats.caosPerGame += h.filter(x => x.mech === 'caos').length;
    stats.prefPerGame += h.filter(x => x.cat === 'pref').length;
    if (new Set(h.map(x => x.id)).size !== h.length) fails.push(`${mode}: carta repetida dentro de una partida`);
  }
  stats.caosPerGame = +(stats.caosPerGame / N).toFixed(2);
  stats.prefPerGame = +(stats.prefPerGame / N).toFixed(2);
  if (mode === 'random' && stats.prefPerGame < 2.5) fails.push(`random: solo ${stats.prefPerGame} «qué prefieres» por partida`);
  stats.unseenShare = Math.round(stats.unseenShare / N * 100) + '%';
  for (const k in stats.mech) stats.mech[k] = Math.round(stats.mech[k] / stats.cards * 100) + '%';
  stats.r = stats.r.slice(1).map(x => Math.round(x / stats.cards * 100) + '%').join(' ');
  if (stats.r5pairs) fails.push(`${mode}: dos cartas de rareza 5 seguidas (${stats.r5pairs})`);
  if (stats.maxSameMech > 3) fails.push(`${mode}: ${stats.maxSameMech} cartas seguidas de la misma mecánica`);
  delete stats.cards; report[mode] = stats;
}
console.table(report);

// Tipos de carta elegidos a mano: el director debe servir solo ese tipo y no quedarse sin cartas.
const FILTERS = [
  ['pref', { mechs: ['libre'], cats: ['pref'] }], ['saber', { mechs: ['libre'], cats: ['obs'] }], ['hipo', { mechs: ['libre'], cats: ['hip', 'mini', 'esp'] }],
  ['exis', { mechs: ['libre'], cats: ['exis'] }], ['lore', { mechs: ['libre'], cats: ['lore', 'ctx', 'tit', 'expl', 'acus'] }], ['teo', { mechs: ['libre'], cats: ['teo', 'rank', 'comp'] }],
  ['rapida', { mechs: ['rapida'] }], ['predice', { mechs: ['predice'] }], ['alavez', { mechs: ['alavez'] }], ['juicio', { mechs: ['juicio'] }],
];
for (const [name, filter] of FILTERS) {
  for (let g = 0; g < 20; g++) {
    const rng = mulberry(g * 131 + name.length);
    const game = Object.assign(D.newGame({ mode: 'random', length: LEN }), { filter });
    const size = CARDS.filter(c => filter.mechs.includes(c.mech) && (!filter.cats || filter.cats.includes(c.cat))).length;
    for (let i = 0; i < Math.min(LEN, size); i++) {
      const c = D.pick(game, { cards: CARDS, seen: new Set(), rule: null, rng });
      if (!c) { fails.push(`tipo ${name}: sin carta en la posición ${i}`); break; }
      if (!filter.mechs.includes(c.mech) || (filter.cats && !filter.cats.includes(c.cat))) fails.push(`tipo ${name}: carta fuera del tipo (${c.mech}/${c.cat})`);
      D.record(game, c);
    }
  }
}

// Memoria entre partidas: las cartas de la partida anterior casi no deben volver en la siguiente.
let overlap = 0, trials = 0;
for (let t = 0; t < 40; t++) {
  const rng = mulberry(t * 977 + 5);
  let recent = [];
  for (let g = 0; g < 3; g++) {
    const game = D.newGame({ mode: 'random', length: LEN });
    for (let i = 0; i < LEN; i++) { const c = D.pick(game, { cards: CARDS, seen: new Set(), rule: null, recent, rng }); D.record(game, c); }
    if (recent.length) { const prev = new Set(recent[0]); overlap += game.used.filter(id => prev.has(id)).length; trials++; }
    recent.unshift(game.used.slice());
  }
}
const repeatRate = overlap / (trials * LEN);
console.log('Repetición respecto a la partida anterior:', (repeatRate * 100).toFixed(1) + '%');
if (repeatRate > .04) fails.push(`memoria entre partidas: ${(repeatRate * 100).toFixed(1)}% de cartas repetidas de la partida anterior`);
const bank = {}; CARDS.forEach(c => bank[c.mech] = (bank[c.mech] || 0) + 1);
console.log('Banco:', bank, 'total', CARDS.length);
if (fails.length) { console.log('✗ Fallos:\n' + [...new Set(fails)].slice(0, 20).join('\n')); process.exit(1); }
console.log('✓ Todo correcto');
