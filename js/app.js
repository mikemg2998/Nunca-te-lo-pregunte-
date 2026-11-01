/* Interfaz de «Nunca te lo pregunté». El teléfono reparte las cartas; la pareja juega. */
(function () {
const { CARDS } = window.NTP_CARDS;
const D = window.NTP_DIRECTOR;
const BY_ID = Object.fromEntries(CARDS.map(c => [c.id, c]));

/* ---------- iconos lineales ---------- */
const I = {
  libre: '<path d="M4 5.5h16v10.5H10l-6 4z"/>',
  predice: '<path d="M2.5 12s3.6-6.2 9.5-6.2 9.5 6.2 9.5 6.2-3.6 6.2-9.5 6.2S2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.6"/>',
  alavez: '<rect x="3" y="5.5" width="9.5" height="13.5" rx="1.6" transform="rotate(-9 7.75 12.25)"/><rect x="11.5" y="5" width="9.5" height="13.5" rx="1.6" transform="rotate(7 16.25 11.75)"/>',
  juicio: '<path d="M12 4v15.5M8 19.5h8M5 7.5h14"/><path d="M5 7.5 2.6 13h4.8zM19 7.5 16.6 13h4.8z"/><path d="M2.6 13a2.4 1.8 0 0 0 4.8 0M16.6 13a2.4 1.8 0 0 0 4.8 0"/>',
  caos: '<path d="M11 3c.7 4.6 3.6 7.6 8.2 8.3-4.6.7-7.5 3.7-8.2 8.3-.7-4.6-3.6-7.6-8.2-8.3C7.4 10.6 10.3 7.6 11 3z"/><path d="M19 3.5v3M17.5 5h3"/><circle cx="19.5" cy="19.5" r="1"/>',
  rapida: '<path d="M13.5 2.5 5 13.5h6.2L10 21.5l8.5-11h-6.2z"/>',
  mark: '<path d="M6.5 3.5h11v17l-5.5-4.2-5.5 4.2z"/>',
  marks: '<path d="M8 3.5h10.5v15.5"/><path d="M5.5 6.5h10v14l-5-3.8-5 3.8z"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  back: '<path d="M15 5 8 12l7 7"/>',
  die: '<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r=".9"/><circle cx="15" cy="15" r=".9"/><circle cx="15" cy="9" r=".9"/><circle cx="9" cy="15" r=".9"/>',
  moon: '<path d="M19.5 14.5A7.8 7.8 0 1 1 9.5 4.5a6.3 6.3 0 0 0 10 10z"/>',
  spiral: '<path d="M12 12a1.4 1.4 0 0 1 2.8 0 2.8 2.8 0 0 1-5.6 0 4.2 4.2 0 0 1 8.4 0 5.6 5.6 0 0 1-11.2 0 7 7 0 0 1 14 0"/>',
  laugh: '<circle cx="12" cy="12" r="8.5"/><path d="M8 13.5c1 2 2.3 3 4 3s3-1 4-3M9 9.5h.01M15 9.5h.01"/>',
  play: '<path d="M7 5v14l11-7z"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1"/>',
  home: '<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="1.5"/>',
};
const ic = k => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${I[k]}</svg>`;
const MECH_LABEL = { libre: 'Libre', rapida: 'Sin pensar', predice: 'Predice', alavez: 'A la vez', juicio: 'Juicio', caos: 'Caos' };
/* Tipos de carta elegibles a mano: [clave, icono, nombre, descripción, filtro] */
const TYPE_LIST = [
  ['pref', 'libre', '¿Qué prefieres?', 'Dos opciones. Ninguna buena del todo.', { mechs: ['libre'], cats: ['pref'] }],
  ['saber', 'libre', 'Conocimiento inútil', 'Lo que sabes de mí sin haberlo estudiado.', { mechs: ['libre'], cats: ['obs'] }],
  ['hipo', 'libre', 'Hipotéticos', 'Mundos raros, situaciones ridículamente concretas.', { mechs: ['libre'], cats: ['hip', 'mini', 'esp'] }],
  ['exis', 'moon', 'Existenciales', 'Profundas sin avisar.', { mechs: ['libre'], cats: ['exis'] }],
  ['lore', 'libre', 'Lore de la pareja', 'Nuestra historia, nuestras reglas, nuestros clásicos.', { mechs: ['libre'], cats: ['lore', 'ctx', 'tit', 'expl', 'acus'] }],
  ['teo', 'laugh', 'Teorías y rankings', 'Explicaciones innecesarias, listas imposibles.', { mechs: ['libre'], cats: ['teo', 'rank', 'comp'] }],
  ['rapida', 'rapida', 'Sin pensar', 'Lo primero que salga.', { mechs: ['rapida'] }],
  ['predice', 'predice', 'Predice', 'Uno adivina. El otro responde. A la de tres.', { mechs: ['predice'] }],
  ['alavez', 'alavez', 'A la vez', 'Los dos a la vez, a la de tres.', { mechs: ['alavez'] }],
  ['juicio', 'juicio', 'Juicio', 'Dos posturas asignadas. Defendedlas.', { mechs: ['juicio'] }],
];
const TYPE_BY = Object.fromEntries(TYPE_LIST.map(t => [t[0], t]));
const MODE_LIST = [
  ['random', 'die', 'Random total', 'El motor decide todo.'],
  ['risas', 'laugh', 'Solo risas', 'Absurdo, teorías, rankings y respuestas rápidas.'],
  ['tres', 'moon', '3 a.m.', 'Existenciales y extrañamente profundas.'],
  ['conoces', 'predice', '¿De verdad me conoces?', 'Predicciones y conocimiento de pareja.'],
  ['demonios', 'spiral', 'Qué demonios', 'Las más raras del mazo.'],
  ['caos', 'caos', 'Caos', 'Reglas que cambian el juego, juicios y predicciones.'],
];

/* ---------- almacenamiento local ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem('ntp.' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('ntp.' + k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem('ntp.' + k); } catch (e) {} },
};
const DEF = { p1: '', p2: '', judge: 0, rarity: false, haptics: true };
const S = {
  screen: 'home',
  settings: Object.assign({}, DEF, store.get('settings', {})),
  favs: store.get('favs', []),
  seen: new Set(store.get('seen', [])),
  game: store.get('game', null),
  recent: store.get('recent', []), // bloques de 25 cartas recientes, del más nuevo al más viejo: tardan en volver
  mode: 'random', type: null,
  card: null, step: null, tmp: {}, from: 'home', dev: null, confirmReset: false,
};
const saveSettings = () => store.set('settings', S.settings);
const saveFavs = () => store.set('favs', S.favs);
const saveSeen = () => store.set('seen', [...S.seen]);
const saveGame = () => S.game ? store.set('game', S.game) : store.del('game');
const saveRecent = () => store.set('recent', S.recent.slice(0, 6));
const app = document.getElementById('app');
let timer = null, swipeLock = false, seq = 0, pending = [];
function later(fn, ms) { const my = seq; const id = setTimeout(() => { if (my === seq) fn(); }, ms); pending.push(id); return id; }
function cancelAll() { clearInterval(timer); timer = null; pending.forEach(clearTimeout); pending = []; seq++; swipeLock = false; }

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const rich = s => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>');
const plain = s => s.replace(/\*/g, '');
const name = k => esc((k === 1 ? S.settings.p1 : S.settings.p2).trim() || (k === 1 ? 'Jugador 1' : 'Jugador 2'));
const AB = () => { const t = S.game ? S.game.turn % 2 : 0; return t === 0 ? [name(1), name(2)] : [name(2), name(1)]; };
function buzz(ms) { if (!S.settings.haptics) return; try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} }
function toast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 1700); }
const plural = (n, a, b) => n === 1 ? a : b;

/* ---------- partida ---------- */
function startGame(mode, pool, type) {
  const t = type ? TYPE_BY[type] : null;
  const filter = t ? t[4] : null;
  S.game = { mode, type: type || null, label: t ? t[2] : (D.MODES[mode] || D.MODES.random).name, filter, history: [], used: [], pool: pool || null,
    started: Date.now(), turn: 0, rule: null, cur: null };
  nextCard(true);
}
function drawCard() {
  const g = S.game;
  let ctxCards = CARDS;
  if (S.dev) ctxCards = CARDS.filter(c => c.mech === S.dev);
  let c = D.pick(g, { cards: ctxCards, seen: S.seen, rule: g.rule, recent: S.recent });
  if (!c) { g.used = []; g.history = g.history.slice(-8); c = D.pick(g, { cards: ctxCards, seen: S.seen, rule: g.rule, recent: S.recent }); } // mazo agotado: se vuelve a barajar
  if (!c) return null;
  D.record(g, c); g.cur = c.id;
  if (g.used.length % 25 === 0) { S.recent.unshift(g.used.slice(-25)); S.recent = S.recent.slice(0, 6); saveRecent(); }
  return c;
}
function nextCard(first) {
  cancelAll();
  const c = drawCard();
  if (!c) { toast('No hay cartas de este tipo'); S.game = null; saveGame(); S.screen = 'modes'; render(true); return; }
  S.card = c; S.step = firstStep(c); S.tmp = {};
  S.screen = 'play'; saveGame(); render(true);
  if (c.mech === 'caos') buzz(12);
}
function firstStep(c) { return { predice: 'think', alavez: 'ready', juicio: 'idle', caos: 'show' }[c.mech] || 'show'; }
function leave(then) {
  if (S.leaving) return; S.leaving = true;
  const card = document.getElementById('card');
  if (card && !card.classList.contains('gone')) { card.classList.add('leave'); later(() => { S.leaving = false; then(); }, 150); }
  else { S.leaving = false; then(); }
}
function finish(outcome) {
  const g = S.game, c = S.card; if (!g || !c || S.leaving) return;
  S.seen.add(c.id); saveSeen();
  if (c.mech !== 'caos' && g.rule) {
    const r = g.rule;
    if (r.affects !== 'juicio' || c.mech === 'juicio') r.left--;
    if (r.left <= 0) g.rule = null;
  }
  if (['predice', 'alavez', 'juicio'].includes(c.mech)) g.turn++;
  leave(nextCard);
}

/* ---------- favoritas ---------- */
function toggleFav(id) {
  const i = S.favs.indexOf(id);
  if (i >= 0) { S.favs.splice(i, 1); toast('Quitada de favoritas'); }
  else { S.favs.unshift(id); toast('Guardada'); }
  saveFavs(); saveGame();
  document.querySelectorAll(`.mark[data-id="${id}"]`).forEach(b => b.classList.toggle('on', S.favs.includes(id)));
}

/* ---------- pantallas ---------- */
function homeView() {
  return `<section class="home">
    <div class="deck" aria-hidden="true"><div></div><div></div><div><span>?</span></div></div>
    <h1>Nunca te lo <em>pregunté</em></h1>
    <p class="tag">Después de tantos años, todavía quedan preguntas.</p>
    <div class="actions"><button class="btn primary" data-a="${S.game ? 'continue' : 'go'}" data-v="modes">Leeeeeet’s go</button>
      <div class="links">${S.game ? '<button class="link" data-a="go" data-v="modes">Otra mezcla</button>' : ''}<button class="link" data-a="go" data-v="favs">Favoritas</button><button class="link" data-a="go" data-v="settings">Ajustes</button></div></div>
  </section>`;
}
function modesView() {
  return `<div class="s-head"><button class="ibtn" data-a="go" data-v="home" aria-label="Volver">${ic('back')}</button></div>
  <h2 class="h2">¿Qué os apetece hoy?</h2>
  <p class="sub">Toca una mezcla o un tipo de carta y empezamos.</p>
  <div class="names"><label for="n1">Uno<input id="n1" type="text" maxlength="16" placeholder="Jugador 1" value="${esc(S.settings.p1)}" data-set="p1"></label>
  <label for="n2">Otro<input id="n2" type="text" maxlength="16" placeholder="Jugador 2" value="${esc(S.settings.p2)}" data-set="p2"></label></div>
  <span class="g-lab">Mezclas</span>
  <div class="modes">${MODE_LIST.map(([k, i, t, d]) => `<button class="mode" data-a="mode" data-v="${k}">${ic(i)}<b>${t}</b><span>${d}</span></button>`).join('')}</div>
  <span class="g-lab">Tipos de carta</span>
  <div class="types">${TYPE_LIST.map(([k, i, t, d]) => `<button class="type" data-a="type" data-v="${k}"><b>${t}</b><span>${d}</span></button>`).join('')}</div>
`;
}
function loadingView() { return `<div class="loading">${S.loadingText}</div>`; }

function head() {
  const g = S.game, label = g.label || (D.MODES[g.mode] || D.MODES.random).name;
  let rule = '';
  if (g.rule) {
    const r = g.rule, pips = '<i></i>'.repeat(Math.max(0, r.left));
    const unit = r.affects === 'juicio' ? 'próximo juicio' : `${r.left} ${plural(r.left, 'carta', 'cartas')}`;
    rule = `<div style="display:flex;align-items:center"><button class="rule" data-a="ruleinfo" aria-label="Regla activa: ${esc(r.text)}"><span class="pips">${pips}</span><span><b>${esc(r.name)}</b> · ${unit}</span></button>${r.affects === 'veto' && r.vetoes > 0 ? `<button class="rule veto" data-a="veto">Vetar · ${r.vetoes}</button>` : ''}</div>`;
  }
  const dev = S.devOn ? `<div class="devbar">${['', 'libre', 'rapida', 'predice', 'alavez', 'juicio', 'caos'].map(m => `<button class="${(S.dev || '') === m ? 'on' : ''}" data-a="dev" data-v="${m}">${m || 'director'}</button>`).join('')}</div>` : '';
  return `${dev}<header class="g-head"><button class="ibtn" data-a="menu" aria-label="Menú">${ic('close')}</button>
    <div class="g-meta"><span>${esc(label)}</span></div></header>${rule}`;
}
function qClass(c) { const n = c.len; return n > 150 ? 'q long' : n < 70 ? 'q short' : 'q'; }
function cardTop(c, label) {
  const on = S.favs.includes(c.id);
  const txt = label || (c.mech === 'libre' || c.mech === 'rapida' ? c.catLabel : MECH_LABEL[c.mech]);
  return `<div class="c-top"><span class="mech">${ic(c.mech)}${esc(txt)}</span><button class="mark ${on ? 'on' : ''}" data-a="fav" data-id="${c.id}" aria-label="Guardar">${ic('mark')}</button></div>`;
}
const rar = c => S.settings.rarity ? `<div class="dots" aria-label="Rareza ${c.r} de 5">${[1, 2, 3, 4, 5].map(k => `<i class="${k <= c.r ? 'f' : ''}"></i>`).join('')}</div>` : '';
const roles = (a, b) => `<div class="roles"><b>${a}</b><span>predice a</span><b>${b}</b></div>`;

function playView() {
  const c = S.card, g = S.game, [A, B] = AB(), st = S.step;
  let body = '', acts = '';
  const skip = '<button class="link" data-a="pass">Saltar</button>';
  const next = `<button class="btn primary" data-a="done">Siguiente</button>`;
  if (c.mech === 'libre' || c.mech === 'rapida') acts = next;
  if (c.mech === 'predice') {
    body = roles(A, B);
    if (st === 'think') { body += `<p class="ins"><b>${A}</b>, piensa qué responderá ${B}. No lo digas todavía.</p>`; acts = `<button class="btn primary" data-a="step" data-v="ready">Ya la tengo</button>${skip}`; }
    if (st === 'ready') { body += `<p class="ins"><b>${B}</b>, piensa tu respuesta. A la de tres habláis los dos a la vez: ${A} su predicción, ${B} la verdad.</p>`; acts = `<button class="btn primary" data-a="count">A la de 3</button>`; }
    if (st === 'done') acts = next;
  }
  if (c.mech === 'alavez') {
    if (st === 'ready') { body = `<p class="ins">Pensadla cada uno. No la digáis. A la de tres, los dos a la vez.</p>`; acts = `<button class="btn primary" data-a="count">A la de 3</button>${skip}`; }
    if (st === 'done') acts = next;
  }
  if (c.mech === 'juicio') {
    const swap = g.rule && g.rule.affects === 'juicio' && g.rule.name === 'Cambio de bando';
    const t = S.settings.judge, j = S.tmp;
    const who = (n, l) => `<span class="who">${swap ? '' : `<b>${n}</b> · `}Postura ${l}</span>`;
    const ring = side => {
      if (!t || st === 'done') return '';
      const live = st === side, done = side === 'a' && st !== 'idle' && st !== 'a';
      const left = live ? j.left : done ? 0 : t;
      return `<div class="ring" id="ring-${side}"><svg viewBox="0 0 50 50"><circle class="bg" cx="25" cy="25" r="23"/><circle class="fg" cx="25" cy="25" r="23" style="stroke-dashoffset:${144.5 * (1 - left / t)}"/></svg><span>${left}</span></div>`;
    };
    body = `<div class="duel ${st === 'a' || st === 'b' ? 'running' : ''}"><div class="side ${st === 'a' ? 'live' : ''}">${who(A, 'A')}<p>${esc(c.a)}</p>${ring('a')}</div>
      <div class="vs">vs</div><div class="side ${st === 'b' ? 'live' : ''}">${who(B, 'B')}<p>${esc(c.b)}</p>${ring('b')}</div></div>`;
    if (st === 'idle' && swap) body += `<p class="ins">Cambio de bando: cada uno defiende la postura que no comparte.</p>`;
    acts = st === 'idle' ? (t ? `<button class="btn primary" data-a="jstart">Defendedlas · ${t} s cada uno</button>${skip}` : `${next}${skip}`)
      : st === 'a' ? `<button class="btn primary" data-a="jnext">Turno de ${B}</button>`
      : st === 'b' ? `<button class="btn primary" data-a="jnext">Terminar</button>`
      : next;
  }
  if (c.mech === 'caos') {
    const dur = c.n === 0 ? 'Ahora mismo' : c.affects === 'juicio' ? 'Hasta el próximo juicio' : c.n === 1 ? 'Solo la próxima carta' : `Durante ${c.n} cartas`;
    return head() + `<div class="stage"><article class="card caos" id="card"><div class="face"><div class="sheen"></div>
      ${cardTop(c)}<div class="q-wrap"><div class="caos-mark">${ic('caos')}</div><h2 class="name">${esc(c.name)}</h2><p class="q center">${rich(c.text)}</p></div>
      <div class="c-body"><div class="dur">${c.n ? `<span class="pips">${'<i></i>'.repeat(c.n)}</span>` : ''}${dur}</div></div></div></article></div>
      <div class="actions"><button class="btn primary" data-a="accept">${c.n ? 'Acepto la regla' : 'Hecho'}</button><button class="link" data-a="pass">Saltar</button></div>`;
  }
  const inner = `<div class="face">${cardTop(c)}<div class="q-wrap"><h2 class="${qClass(c)}">${rich(c.text)}</h2></div>${body ? `<div class="c-body">${body}</div>` : ''}${rar(c)}</div>`;
  return head() + `<div class="stage"><article class="card" id="card"><span class="swipe-tag save">Guardar</span><span class="swipe-tag pass">Pasar</span>${inner}</article></div>
    <div class="actions">${acts}</div>`;
}

function favsView() {
  const list = S.favs.map(id => BY_ID[id]).filter(Boolean);
  return `<div class="s-head"><button class="ibtn" data-a="backfrom" aria-label="Volver">${ic('back')}</button></div>
  <h2 class="h2">Favoritas</h2><p class="sub">${list.length ? `${list.length} ${plural(list.length, 'carta guardada', 'cartas guardadas')}.` : ''}</p>
  ${list.length ? list.map(c => `<div class="fav"><span class="cat">${MECH_LABEL[c.mech]} · ${esc(c.catLabel)}</span><p>${c.mech === 'caos' ? `<b style="font-weight:400;color:var(--gold-2)">${esc(c.name)}.</b> ` : ''}${esc(plain(c.text))}</p><button class="mark on" data-a="fav" data-id="${c.id}" aria-label="Quitar">${ic('mark')}</button></div>`).join('')
    : `<p class="empty">Todavía no hay favoritas. Guarda una carta con el marcador, o deslízala hacia la derecha.</p>`}
  ${list.length >= 3 ? `<div class="actions"><button class="btn primary" data-a="playfavs">Jugar las favoritas</button></div>` : ''}`;
}
function seg(key, opts) { return `<div class="seg">${opts.map(([v, l]) => `<button class="${S.settings[key] === v ? 'on' : ''}" data-a="setv" data-k="${key}" data-v="${JSON.stringify(v).replace(/"/g, '&quot;')}">${l}</button>`).join('')}</div>`; }
function settingsView() {
  return `<div class="s-head"><button class="ibtn" data-a="backfrom" aria-label="Volver">${ic('back')}</button></div>
  <h2 class="h2">Ajustes</h2>
  <div class="set"><span>Nombres</span><div class="names" style="margin:0"><input id="s1" type="text" maxlength="16" placeholder="Jugador 1" aria-label="Nombre del jugador 1" value="${esc(S.settings.p1)}" data-set="p1"><input id="s2" type="text" maxlength="16" placeholder="Jugador 2" aria-label="Nombre del jugador 2" value="${esc(S.settings.p2)}" data-set="p2"></div></div>
  <div class="set"><span>Tiempo de los juicios</span>${seg('judge', [[0, 'Sin tiempo'], [30, '30 s'], [60, '60 s']])}</div>
  <div class="set"><span>Mostrar la rareza de cada carta</span>${seg('rarity', [[false, 'No'], [true, 'Sí']])}</div>
  <div class="set"><span>Vibración</span>${seg('haptics', [[true, 'Sí'], [false, 'No']])}</div>
  <div class="set"><span>Historial</span><p>Habéis visto ${S.seen.size} de ${CARDS.length} cartas. Las que no habéis visto salen antes, y las recientes tardan en volver.</p>
    ${S.confirmReset ? `<div class="pills"><button class="pill on" data-a="reset">Sí, reiniciar</button><button class="pill" data-a="noreset">Cancelar</button></div>` : `<button class="btn ghost" data-a="askreset">Reiniciar historial</button>`}</div>`;
}

function render(anim) {
  const v = { home: homeView, modes: modesView, loading: loadingView, play: playView, favs: favsView, settings: settingsView }[S.screen];
  app.innerHTML = v();
  const card = document.getElementById('card');
  if (card) {
    if (anim) card.classList.add('enter'); else if (S.swap) card.classList.add('swap');
    S.swap = false;
    attachSwipe(card);
    if (S.card.mech === 'juicio' && (S.step === 'a' || S.step === 'b')) runJudge();
  }
  if (anim) window.scrollTo(0, 0);
}

/* ---------- juicio ---------- */
function runJudge() {
  clearInterval(timer);
  const t = S.settings.judge;
  timer = setInterval(() => {
    S.tmp.left--;
    const ring = document.getElementById('ring-' + S.step);
    if (ring) { ring.querySelector('.fg').style.strokeDashoffset = 144.5 * (1 - S.tmp.left / t); ring.querySelector('span').textContent = S.tmp.left; }
    if (S.tmp.left <= 3 && S.tmp.left > 0) buzz(5);
    if (S.tmp.left <= 0) judgeNext();
  }, 1000);
}
function judgeNext() { clearInterval(timer); timer = null; if (S.step === 'a') { S.step = 'b'; S.tmp.left = S.settings.judge; } else S.step = 'done'; render(); }

/* ---------- cuenta atrás ---------- */
function countdown() {
  const card = document.getElementById('card'); if (!card) return;
  const ov = document.createElement('div'); ov.className = 'count'; card.appendChild(ov);
  const btn = document.querySelector('[data-a="count"]'); if (btn) btn.style.visibility = 'hidden';
  buzz(10);
  let k = 3;
  const tick = () => {
    if (k === 0) { ov.innerHTML = '<span class="word">¡Ya!</span>'; buzz(20); later(() => { S.step = 'done'; S.swap = true; render(); }, 750); return; }
    ov.innerHTML = `<span>${k}</span>`; k--; later(tick, 700);
  };
  tick();
}

/* ---------- eventos ---------- */
app.addEventListener('input', e => {
  const t = e.target;
  if (t.dataset.set) { S.settings[t.dataset.set] = t.value; saveSettings(); }
});
app.addEventListener('click', e => {
  const b = e.target.closest('[data-a]'); if (!b) return;
  const a = b.dataset.a, v = b.dataset.v;
  switch (a) {
    case 'go': if (S.screen === 'play') cancelAll(); S.from = S.screen === 'play' ? 'play' : 'home'; S.screen = v; S.confirmReset = false; render(true); break;
    case 'backfrom': S.screen = S.from === 'play' && S.game ? 'play' : 'home'; render(true); break;
    case 'continue': resume(); break;
    case 'mode': S.mode = v; S.type = null; deal(); break;
    case 'type': S.type = v; deal(); break;
    case 'playfavs': S.loadingText = 'Barajando las mejores…'; S.screen = 'loading'; render(); setTimeout(() => startGame('favs', S.favs.slice()), 800); break;
    case 'fav': toggleFav(b.dataset.id); if (S.screen === 'favs') render(); break;
    case 'done': finish('answered'); break;
    case 'pass': finish('passed'); break;
    case 'step': S.step = v; S.swap = true; render(); break;
    case 'count': if (!S.tmp.counting) { S.tmp.counting = true; countdown(); } break;
    case 'jstart': S.step = 'a'; S.tmp.left = S.settings.judge; buzz(8); render(); break;
    case 'jnext': judgeNext(); break;
    case 'accept': {
      const c = S.card; if (S.leaving) break;
      if (c.n > 0) { S.game.rule = { name: c.name, text: plain(c.text), affects: c.affects, left: c.n, vetoes: c.affects === 'veto' ? 2 : 0 }; toast('Regla activada'); }
      S.seen.add(c.id); saveSeen(); buzz(10);
      leave(nextCard); break;
    }
    case 'ruleinfo': if (S.game.rule) toast(S.game.rule.text); break;
    case 'veto': if (S.game.rule && S.game.rule.vetoes > 0) { S.game.rule.vetoes--; toast('Vetada. Sin explicaciones.'); finish('passed'); } break;
    case 'menu': openMenu(); break;
    case 'dev': S.dev = v || null; render(); break;
    case 'setv': S.settings[b.dataset.k] = JSON.parse(v); saveSettings(); render(); break;
    case 'askreset': S.confirmReset = true; render(); break;
    case 'noreset': S.confirmReset = false; render(); break;
    case 'reset': S.seen = new Set(); saveSeen(); S.confirmReset = false; toast('Historial reiniciado'); render(); break;
  }
});

function deal() {
  if (S.screen === 'loading') return;
  S.loadingText = S.type ? 'Barajando solo esas…' : 'Buscando algo que nunca os habéis preguntado…'; S.screen = 'loading'; render();
  setTimeout(() => startGame(S.mode, null, S.type), 900);
}
function resume() { if (!S.game) return; cancelAll(); S.card = BY_ID[S.game.cur] || drawCard(); S.step = firstStep(S.card); S.tmp = {}; S.screen = 'play'; render(true); }
/* atrás: adónde lleva cada pantalla cuando se desliza desde el borde izquierdo */
function goBack() {
  const sheet = document.querySelector('.sheet'); if (sheet) { sheet.remove(); return; }
  if (S.screen === 'home' || S.screen === 'loading') return;
  if (S.screen === 'play') { cancelAll(); S.screen = 'modes'; render(true); return; }
  if ((S.screen === 'favs' || S.screen === 'settings') && S.from === 'play' && S.game) { resume(); return; }
  S.screen = 'home'; S.confirmReset = false; render(true);
}
function attachBackGesture() {
  let on = false, sx = 0, sy = 0, dx = 0, hint = null;
  const EDGE = 28, GO = 90;
  const cancel = () => { on = false; app.style.transition = 'transform .2s ease'; app.style.transform = ''; if (hint) { hint.remove(); hint = null; } };
  document.addEventListener('pointerdown', e => {
    if (e.clientX > EDGE || (e.pointerType === 'mouse' && e.button !== 0)) return;
    if (S.screen === 'home' || S.screen === 'loading') return;
    on = true; sx = e.clientX; sy = e.clientY; dx = 0;
    hint = document.createElement('div'); hint.className = 'back-hint'; hint.innerHTML = ic('back'); document.body.appendChild(hint);
    e.preventDefault();
  }, { capture: true, passive: false });
  document.addEventListener('pointermove', e => {
    if (!on) return; dx = e.clientX - sx;
    if (Math.abs(e.clientY - sy) > 60 && dx < 30) { cancel(); return; }
    const k = Math.min(1, Math.max(0, dx) / GO);
    app.style.transition = 'none'; app.style.transform = `translateX(${Math.max(0, dx) * .35}px)`;
    if (hint) { hint.style.opacity = k; hint.style.transform = `translate(${-24 + k * 36}px,-50%) scale(${.7 + k * .3})`; hint.classList.toggle('ready', k >= 1); }
    e.preventDefault();
  }, { capture: true, passive: false });
  const end = () => { if (!on) return; const go = dx >= GO; cancel(); if (go) { buzz(8); goBack(); } };
  document.addEventListener('pointerup', end, true); document.addEventListener('pointercancel', cancel, true);
}
function openMenu() {
  const el = document.createElement('div'); el.className = 'sheet';
  el.innerHTML = `<div class="sheet-card" role="dialog" aria-label="Menú">
    <button data-m="close">${ic('play')}Seguir jugando</button><button data-m="modes">${ic('die')}Otra mezcla</button>
    <button data-m="favs">${ic('marks')}Favoritas</button><button data-m="settings">${ic('gear')}Ajustes</button><button data-m="home">${ic('home')}Volver al inicio</button></div>`;
  el.addEventListener('click', e => {
    const b = e.target.closest('[data-m]'); if (!b && e.target !== el) return;
    el.remove(); const m = b ? b.dataset.m : 'close';
    if (m === 'modes') { cancelAll(); S.screen = 'modes'; render(true); }
    if (m === 'favs' || m === 'settings') { S.from = 'play'; S.screen = m; render(true); }
    if (m === 'home') { cancelAll(); S.screen = 'home'; render(true); }
  });
  document.body.appendChild(el);
}

/* ---------- deslizar la carta ---------- */
function canSwipe() { const c = S.card; return c && c.mech !== 'caos' && S.step === firstStep(c); }
function swipeOut(dir) {
  const card = document.getElementById('card'); if (!card || swipeLock) return; swipeLock = true;
  if (dir > 0 && !S.favs.includes(S.card.id)) toggleFav(S.card.id);
  card.style.transition = 'transform .22s ease-in, opacity .22s ease-in';
  card.style.transform = `translateX(${dir * 460}px) rotate(${dir * 9}deg)`; card.style.opacity = '0'; card.classList.add('gone');
  later(() => { swipeLock = false; finish(dir > 0 ? 'answered' : 'passed'); }, 220);
}
function attachSwipe(card) {
  let sx = 0, sy = 0, dx = 0, on = false;
  const sv = card.querySelector('.swipe-tag.save'), ps = card.querySelector('.swipe-tag.pass');
  card.addEventListener('pointerdown', e => { if (e.target.closest('button,input') || !canSwipe() || e.clientX <= 28) return; on = true; sx = e.clientX; sy = e.clientY; dx = 0; card.style.transition = 'none'; });
  card.addEventListener('pointermove', e => {
    if (!on) return; dx = e.clientX - sx;
    if (Math.abs(e.clientY - sy) > 40 && Math.abs(dx) < 20) { on = false; card.style.transform = ''; return; }
    if (Math.abs(dx) > 6 && !card.hasPointerCapture(e.pointerId)) card.setPointerCapture(e.pointerId);
    card.style.transform = `translateX(${dx}px) rotate(${dx / 24}deg)`;
    if (sv) { sv.style.opacity = Math.max(0, Math.min(1, (dx - 20) / 70)); ps.style.opacity = Math.max(0, Math.min(1, (-dx - 20) / 70)); }
  });
  const end = () => { if (!on) return; on = false; card.style.transition = ''; if (dx > 100) swipeOut(1); else if (dx < -100) swipeOut(-1); else { card.style.transform = ''; if (sv) { sv.style.opacity = 0; ps.style.opacity = 0; } } };
  card.addEventListener('pointerup', end); card.addEventListener('pointercancel', end);
}

/* ---------- arranque ---------- */
S.devOn = location.hash === '#dev';
if (S.devOn) window.__ntp = S;
window.addEventListener('hashchange', () => { S.devOn = location.hash === '#dev'; if (S.screen === 'play') render(); });
attachBackGesture();
render();
})();
