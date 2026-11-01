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
const MECH_LABEL = { libre: 'Libre', rapida: '5 segundos', predice: 'Predice', alavez: 'A la vez', juicio: 'Juicio', caos: 'Caos' };
const MODE_LIST = [
  ['random', 'die', 'Random total', 'El motor decide todo.'],
  ['risas', 'laugh', 'Solo risas', 'Absurdo, teorías, rankings y respuestas rápidas.'],
  ['tres', 'moon', '3 a.m.', 'Existenciales y extrañamente profundas.'],
  ['conoces', 'predice', '¿De verdad me conoces?', 'Predicciones y conocimiento de pareja.'],
  ['demonios', 'spiral', 'Qué demonios', 'Las más raras del mazo.'],
  ['rapido', 'rapida', 'Rápido', 'Todo se responde en segundos.'],
  ['caos', 'caos', 'Caos', 'Reglas que cambian el juego, juicios y predicciones.'],
];

/* ---------- almacenamiento local ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem('ntp.' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('ntp.' + k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem('ntp.' + k); } catch (e) {} },
};
const DEF = { p1: '', p2: '', judge: 30, length: 25, write: true, rarity: false, haptics: true };
const S = {
  screen: 'home',
  settings: Object.assign({}, DEF, store.get('settings', {})),
  favs: store.get('favs', []),
  seen: new Set(store.get('seen', [])),
  game: store.get('game', null),
  mode: 'random',
  card: null, step: null, tmp: {}, from: 'home', dev: null, confirmReset: false,
};
const saveSettings = () => store.set('settings', S.settings);
const saveFavs = () => store.set('favs', S.favs);
const saveSeen = () => store.set('seen', [...S.seen]);
const saveGame = () => S.game ? store.set('game', S.game) : store.del('game');
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
function startGame(mode, pool) {
  S.game = { mode, length: pool ? Math.min(pool.length, S.settings.length) : S.settings.length, history: [], used: [], pool: pool || null,
    started: Date.now(), turn: 0, rule: null,
    stats: { answered: 0, saved: 0, matches: 0, compared: 0, juicios: 0, caos: 0, passed: 0 }, cur: null };
  nextCard(true);
}
function drawCard() {
  const g = S.game;
  let ctxCards = CARDS;
  if (S.dev) ctxCards = CARDS.filter(c => c.mech === S.dev);
  const c = D.pick(g, { cards: ctxCards, seen: S.seen, rule: g.rule });
  if (!c) return null;
  D.record(g, c); g.cur = c.id;
  return c;
}
function nextCard(first) {
  cancelAll();
  if (S.game.history.length >= S.game.length) return endGame();
  const c = drawCard();
  if (!c) return endGame();
  S.card = c; S.step = firstStep(c); S.tmp = {};
  S.screen = 'play'; saveGame(); render(true);
  if (c.mech === 'caos') buzz(12);
}
function firstStep(c) { return { predice: 'think', alavez: 'p1', juicio: 'idle', caos: 'show' }[c.mech] || 'show'; }
function leave(then) {
  if (S.leaving) return; S.leaving = true;
  const card = document.getElementById('card');
  if (card && !card.classList.contains('gone')) { card.classList.add('leave'); later(() => { S.leaving = false; then(); }, 150); }
  else { S.leaving = false; then(); }
}
function finish(outcome) {
  const g = S.game, c = S.card; if (!g || !c || S.leaving) return;
  if (outcome === 'answered' && c.mech !== 'caos') g.stats.answered++;
  if (outcome === 'passed') g.stats.passed++;
  if (c.mech === 'juicio' && outcome === 'answered') g.stats.juicios++;
  S.seen.add(c.id); saveSeen();
  if (c.mech !== 'caos' && g.rule) {
    const r = g.rule;
    if (r.affects !== 'juicio' || c.mech === 'juicio') r.left--;
    if (r.left <= 0) g.rule = null;
  }
  if (['predice', 'alavez', 'juicio'].includes(c.mech)) g.turn++;
  leave(nextCard);
}
function endGame() {
  cancelAll(); S.leaving = false;
  S.last = S.game; S.game = null; saveGame(); S.screen = 'end'; render(true);
}

/* ---------- favoritas ---------- */
function toggleFav(id) {
  const i = S.favs.indexOf(id);
  if (i >= 0) { S.favs.splice(i, 1); toast('Quitada de favoritas'); if (S.game) S.game.stats.saved = Math.max(0, S.game.stats.saved - 1); }
  else { S.favs.unshift(id); toast('Guardada'); if (S.game && S.screen === 'play') S.game.stats.saved++; }
  saveFavs(); saveGame();
  document.querySelectorAll(`.mark[data-id="${id}"]`).forEach(b => b.classList.toggle('on', S.favs.includes(id)));
}

/* ---------- pantallas ---------- */
function homeView() {
  return `<section class="home">
    <div class="deck" aria-hidden="true"><div></div><div></div><div><span>?</span></div></div>
    <h1>Nunca te lo <em>pregunté</em></h1>
    <p class="tag">Después de tantos años, todavía quedan preguntas.</p>
    <div class="actions"><button class="btn primary" data-a="go" data-v="modes">Nueva partida</button>
      <div class="links">${S.game ? '<button class="link" data-a="continue">Continuar</button>' : ''}<button class="link" data-a="go" data-v="favs">Favoritas</button><button class="link" data-a="go" data-v="settings">Ajustes</button></div></div>
  </section>`;
}
function modesView() {
  return `<div class="s-head"><button class="ibtn" data-a="go" data-v="home" aria-label="Volver">${ic('back')}</button></div>
  <h2 class="h2">¿Qué os apetece hoy?</h2>
  <div class="modes" role="radiogroup">${MODE_LIST.map(([k, i, t, d]) => `<button class="mode ${S.mode === k ? 'on' : ''}" role="radio" aria-checked="${S.mode === k}" data-a="mode" data-v="${k}">${ic(i)}<b>${t}</b><span>${d}</span></button>`).join('')}</div>
  <div class="names"><label for="n1">Uno<input id="n1" type="text" maxlength="16" placeholder="Jugador 1" value="${esc(S.settings.p1)}" data-set="p1"></label>
  <label for="n2">Otro<input id="n2" type="text" maxlength="16" placeholder="Jugador 2" value="${esc(S.settings.p2)}" data-set="p2"></label></div>
  <div class="actions"><button class="btn primary" data-a="start">Repartir</button></div>`;
}
function loadingView() { return `<div class="loading">${S.loadingText}</div>`; }

function head() {
  const g = S.game, M = D.MODES[g.mode];
  const n = Math.min(g.history.length, g.length);
  let rule = '';
  if (g.rule) {
    const r = g.rule, pips = '<i></i>'.repeat(Math.max(0, r.left));
    const unit = r.affects === 'juicio' ? 'próximo juicio' : `${r.left} ${plural(r.left, 'carta', 'cartas')}`;
    rule = `<div style="display:flex;align-items:center"><button class="rule" data-a="ruleinfo"><span class="pips">${pips}</span><span><b>${esc(r.name)}</b> · ${unit}</span></button>${r.affects === 'veto' && r.vetoes > 0 ? `<button class="rule veto" data-a="veto">Vetar · ${r.vetoes}</button>` : ''}</div>`;
  }
  const dev = S.devOn ? `<div class="devbar">${['', 'libre', 'rapida', 'predice', 'alavez', 'juicio', 'caos'].map(m => `<button class="${(S.dev || '') === m ? 'on' : ''}" data-a="dev" data-v="${m}">${m || 'director'}</button>`).join('')}</div>` : '';
  return `${dev}<header class="g-head"><button class="ibtn" data-a="menu" aria-label="Menú">${ic('close')}</button>
    <div class="g-meta"><span>${M.name}</span><span class="n"><b>${n}</b> / ${g.length}</span></div></header>
    <div class="prog"><i style="width:${n / g.length * 100}%"></i></div>${rule}`;
}
function qClass(c) { const n = c.len; return n > 150 ? 'q long' : n < 70 ? 'q short' : 'q'; }
function cardTop(c, label) {
  const on = S.favs.includes(c.id);
  const txt = label || (c.mech === 'libre' || c.mech === 'rapida' ? c.catLabel : MECH_LABEL[c.mech]);
  return `<div class="c-top"><span class="mech">${ic(c.mech)}${esc(txt)}</span><button class="mark ${on ? 'on' : ''}" data-a="fav" data-id="${c.id}" aria-label="Guardar">${ic('mark')}</button></div>`;
}
const rar = c => S.settings.rarity ? `<div class="dots" aria-label="Rareza ${c.r} de 5">${[1, 2, 3, 4, 5].map(k => `<i class="${k <= c.r ? 'f' : ''}"></i>`).join('')}</div>` : '';
const choice = (label, opts, key) => `<div class="choice"><span class="lab">${label}</span><div class="pills">${opts.map(o => `<button class="pill ${S.tmp[key] === o ? 'on' : ''}" data-a="pick" data-k="${key}" data-v="${o}">${o}</button>`).join('')}</div></div>`;
const writing = c => c.write && S.settings.write;
const passFace = (who, extra) => `<div class="face pass"><div class="q-mark">?</div><p class="q short center">Pásale el teléfono a <b>${who}</b>.</p>${extra || ''}</div>`;

function playView() {
  const c = S.card, g = S.game, [A, B] = AB(), st = S.step;
  let body = '', acts = '', face = null;
  const skip = '<button class="link" data-a="pass">Saltar</button>';
  const next = `<button class="btn primary" data-a="done">Siguiente</button>`;
  if (c.mech === 'libre' || c.mech === 'rapida') acts = next;
  if (c.mech === 'predice') {
    const w = writing(c);
    if (st === 'think') {
      body = `<p class="ins"><b>${A}</b>, adivina qué responderá ${B}. ${w ? 'Escríbelo.' : 'Guárdatelo.'}</p>${w ? `<textarea id="ta" placeholder="Tu predicción" aria-label="Tu predicción">${esc(S.tmp.pred || '')}</textarea>` : ''}`;
      acts = `<button class="btn primary" data-a="${w ? 'lock' : 'step'}" data-v="pass">${w ? 'Bloquear predicción' : 'Ya la tengo'}</button>${skip}`;
    }
    if (st === 'pass') { face = passFace(B, S.tmp.pred ? `<div class="locked">${ic('lock')}Predicción bloqueada</div>` : ''); acts = `<button class="btn primary" data-a="step" data-v="answer">Ya lo tiene</button>`; }
    if (st === 'answer') {
      const w2 = !!S.tmp.pred;
      body = `<p class="ins"><b>${B}</b>, responde en voz alta. ${w2 ? 'Después, revelad la predicción.' : `Después, ${A} dice su predicción.`}</p>`;
      if (w2 && !S.tmp.revealed) acts = `<button class="btn primary" data-a="revealpred">Revelar</button>`;
      else {
        if (w2) body += `<div class="written"><span>La predicción de ${A}</span><p>${esc(S.tmp.pred)}</p></div>`;
        body += choice('¿Acertó?', ['Sí', 'Casi', 'Ni de cerca'], 'm');
        acts = next;
      }
    }
  }
  if (c.mech === 'alavez') {
    const w = writing(c);
    if (st === 'p1' || st === 'p2') {
      const who = st === 'p1' ? A : B, key = st === 'p1' ? 'a1' : 'a2';
      body = `<p class="ins"><b>${who}</b>, ${w ? 'escribe tu respuesta sin que te vean.' : 'piensa tu respuesta. No la digas.'}</p>${w ? `<textarea id="ta" data-k="${key}" placeholder="Tu respuesta" aria-label="Tu respuesta">${esc(S.tmp[key] || '')}</textarea>` : ''}`;
      acts = `<button class="btn primary" data-a="${w ? 'lock' : 'step'}" data-v="${st === 'p1' ? 'pass' : 'together'}">${w ? 'Bloquear' : 'La tengo'}</button>${st === 'p1' ? skip : ''}`;
    }
    if (st === 'pass') { face = passFace(B, S.tmp.a1 ? `<div class="locked">${ic('lock')}Respuesta de ${A} bloqueada</div>` : ''); acts = `<button class="btn primary" data-a="step" data-v="p2">Ya lo tiene</button>`; }
    if (st === 'together') { body = `<p class="ins">${S.tmp.a1 ? 'Las dos respuestas están bloqueadas.' : 'Los dos la tenéis. Ahora decidla a la vez.'}</p>`; acts = `<button class="btn primary" data-a="count">3 · 2 · 1</button>`; }
    if (st === 'compare') {
      if (S.tmp.a1) body = `<div class="written"><span>${A}</span><p>${esc(S.tmp.a1)}</p></div><div class="written"><span>${B}</span><p>${esc(S.tmp.a2 || '—')}</p></div>`;
      body += choice('¿Coincidió?', ['Sí', 'Más o menos', 'Nada que ver'], 'm');
      acts = next;
    }
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
  const inner = face || `<div class="face">${cardTop(c)}<div class="q-wrap"><h2 class="${qClass(c)}">${rich(c.text)}</h2></div>${body ? `<div class="c-body">${body}</div>` : ''}${rar(c)}</div>`;
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
  <div class="set"><span>Cartas por partida</span>${seg('length', [[15, '15'], [25, '25'], [40, '40']])}</div>
  <div class="set"><span>Cartas con escritura secreta</span>${seg('write', [[true, 'Sí'], [false, 'No, todo de palabra']])}</div>
  <div class="set"><span>Mostrar la rareza de cada carta</span>${seg('rarity', [[false, 'No'], [true, 'Sí']])}</div>
  <div class="set"><span>Vibración</span>${seg('haptics', [[true, 'Sí'], [false, 'No']])}</div>
  <div class="set"><span>Historial</span><p>Habéis visto ${S.seen.size} de ${CARDS.length} cartas. Las que no habéis visto salen antes.</p>
    ${S.confirmReset ? `<div class="pills"><button class="pill on" data-a="reset">Sí, reiniciar</button><button class="pill" data-a="noreset">Cancelar</button></div>` : `<button class="btn ghost" data-a="askreset">Reiniciar historial</button>`}</div>`;
}
function endView() {
  const g = S.last; if (!g) return homeView();
  const s = g.stats, mins = Math.round((Date.now() - g.started) / 60000);
  const rows = [[s.answered, plural(s.answered, 'pregunta', 'preguntas')]];
  if (s.saved) rows.push([s.saved, plural(s.saved, 'guardada', 'guardadas')]);
  if (s.compared) rows.push([s.matches, plural(s.matches, 'coincidencia', 'coincidencias')]);
  let joke = null;
  if (s.juicios) joke = [s.juicios, plural(s.juicios, 'discusión completamente innecesaria', 'discusiones completamente innecesarias')];
  else if (s.caos) joke = [s.caos, plural(s.caos, 'regla de caos obedecida, más o menos', 'reglas de caos obedecidas, más o menos')];
  else if (s.passed) joke = [s.passed, plural(s.passed, 'pregunta esquivada con elegancia', 'preguntas esquivadas con elegancia')];
  const time = mins >= 5 ? ` · ${mins >= 60 ? `${Math.floor(mins / 60)} h ${mins % 60} min` : `${mins} min`} de sobremesa` : '';
  return `<div class="s-head"></div><h2 class="h2">Fin de la partida</h2><p class="sub">${D.MODES[g.mode].name}${time}</p>
  <div class="stats">${rows.map(([n, l]) => `<div class="stat"><b>${n}</b><span>${l}</span></div>`).join('')}${joke ? `<div class="stat joke"><b>${joke[0]}</b><span>${joke[1]}</span></div>` : ''}</div>
  <div class="actions"><button class="btn primary" data-a="go" data-v="modes">Otra partida</button><button class="btn ghost" data-a="go" data-v="favs">${ic('marks')}Ver favoritas</button></div>`;
}

function render(anim) {
  const v = { home: homeView, modes: modesView, loading: loadingView, play: playView, favs: favsView, settings: settingsView, end: endView }[S.screen];
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
  buzz(10);
  let k = 3;
  const tick = () => {
    if (k === 0) { ov.innerHTML = '<span class="word">Revelad.</span>'; buzz(20); later(() => { S.step = 'compare'; S.swap = true; render(); }, 700); return; }
    ov.innerHTML = `<span>${k}</span>`; k--; later(tick, 650);
  };
  tick();
}

/* ---------- eventos ---------- */
app.addEventListener('input', e => {
  const t = e.target;
  if (t.dataset.set) { S.settings[t.dataset.set] = t.value; saveSettings(); }
  if (t.id === 'ta') { if (S.card.mech === 'predice') S.tmp.pred = t.value; else S.tmp[t.dataset.k] = t.value; }
});
app.addEventListener('click', e => {
  const b = e.target.closest('[data-a]'); if (!b) return;
  const a = b.dataset.a, v = b.dataset.v;
  switch (a) {
    case 'go': if (S.screen === 'play') cancelAll(); S.from = S.screen === 'play' ? 'play' : 'home'; S.screen = v; S.confirmReset = false; render(true); break;
    case 'backfrom': S.screen = S.from === 'play' && S.game ? 'play' : 'home'; render(true); break;
    case 'continue': if (S.game) { cancelAll(); S.card = BY_ID[S.game.cur] || drawCard(); S.step = firstStep(S.card); S.tmp = {}; S.screen = 'play'; render(true); } break;
    case 'mode': S.mode = v; app.querySelectorAll('.mode').forEach(m => { m.classList.toggle('on', m.dataset.v === v); m.setAttribute('aria-checked', m.dataset.v === v); }); break;
    case 'start': S.loadingText = 'Buscando algo que nunca os habéis preguntado…'; S.screen = 'loading'; render(); setTimeout(() => startGame(S.mode), 1100); break;
    case 'playfavs': S.loadingText = 'Barajando las mejores…'; S.screen = 'loading'; render(); setTimeout(() => startGame('favs', S.favs.slice()), 800); break;
    case 'fav': toggleFav(b.dataset.id); if (S.screen === 'favs') render(); break;
    case 'done': finish('answered'); break;
    case 'pass': finish('passed'); break;
    case 'step': S.step = v; S.swap = true; render(); break;
    case 'lock': {
      const key = S.card.mech === 'predice' ? 'pred' : (S.step === 'p1' ? 'a1' : 'a2');
      if (!(S.tmp[key] || '').trim()) { toast('Escribe algo antes de bloquear'); break; }
      buzz(8);
      const ta = document.getElementById('ta'); if (ta) { ta.style.transition = 'filter .3s, opacity .3s'; ta.style.filter = 'blur(6px)'; ta.style.opacity = '.4'; }
      later(() => { S.step = v; S.swap = true; render(); }, 320);
      break;
    }
    case 'revealpred': S.tmp.revealed = true; S.swap = true; buzz(15); render(); break;
    case 'count': countdown(); break;
    case 'pick': {
      const first = S.tmp[b.dataset.k] == null;
      S.tmp[b.dataset.k] = v;
      if (first && (S.card.mech === 'predice' || S.card.mech === 'alavez')) S.game.stats.compared++;
      if (S.card.mech === 'predice' || S.card.mech === 'alavez') {
        S.game.stats.matches += (v === 'Sí' ? 1 : 0) - (S.tmp._wasYes ? 1 : 0); S.tmp._wasYes = v === 'Sí';
      }
      render(); break;
    }
    case 'jstart': S.step = 'a'; S.tmp.left = S.settings.judge; buzz(8); render(); break;
    case 'jnext': judgeNext(); break;
    case 'accept': {
      const c = S.card; if (S.leaving) break; S.game.stats.caos++;
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

function openMenu() {
  const el = document.createElement('div'); el.className = 'sheet';
  el.innerHTML = `<div class="sheet-card" role="dialog" aria-label="Menú">
    <button data-m="close">${ic('play')}Seguir jugando</button><button data-m="end">${ic('stop')}Terminar partida</button>
    <button data-m="favs">${ic('marks')}Favoritas</button><button data-m="settings">${ic('gear')}Ajustes</button><button data-m="home">${ic('home')}Volver al inicio</button></div>`;
  el.addEventListener('click', e => {
    const b = e.target.closest('[data-m]'); if (!b && e.target !== el) return;
    el.remove(); const m = b ? b.dataset.m : 'close';
    if (m === 'end') endGame();
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
  card.addEventListener('pointerdown', e => { if (e.target.closest('button,textarea,input') || !canSwipe()) return; on = true; sx = e.clientX; sy = e.clientY; dx = 0; card.style.transition = 'none'; });
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
render();
})();
