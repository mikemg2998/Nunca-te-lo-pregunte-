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
const bank = {}; CARDS.forEach(c => bank[c.mech] = (bank[c.mech] || 0) + 1);
console.log('Banco:', bank, 'total', CARDS.length);
if (fails.length) { console.log('✗ Fallos:\n' + [...new Set(fails)].slice(0, 20).join('\n')); process.exit(1); }
console.log('✓ Todo correcto');
