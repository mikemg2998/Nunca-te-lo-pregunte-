/* Interfaz de «Nunca te lo pregunté». El teléfono presenta la chispa; las personas hacen el resto. */
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
  pref: '<path d="M4 7h7M4 12h7M4 17h7"/><path d="M14 9.5 17.5 6 21 9.5M14 14.5l3.5 3.5 3.5-3.5"/>',
  mark: '<path d="M6.5 3.5h11v17l-5.5-4.2-5.5 4.2z"/>',
  marks: '<path d="M8 3.5h10.5v15.5"/><path d="M5.5 6.5h10v14l-5-3.8-5 3.8z"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  back: '<path d="M15 5 8 12l7 7"/>',
  die: '<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r=".9"/><circle cx="15" cy="15" r=".9"/><circle cx="15" cy="9" r=".9"/><circle cx="9" cy="15" r=".9"/>',
  moon: '<path d="M19.5 14.5A7.8 7.8 0 1 1 9.5 4.5a6.3 6.3 0 0 0 10 10z"/>',
  spiral: '<path d="M12 12a1.4 1.4 0 0 1 2.8 0 2.8 2.8 0 0 1-5.6 0 4.2 4.2 0 0 1 8.4 0 5.6 5.6 0 0 1-11.2 0 7 7 0 0 1 14 0"/>',
  laugh: '<circle cx="12" cy="12" r="8.5"/><path d="M8 13.5c1 2 2.3 3 4 3s3-1 4-3M9 9.5h.01M15 9.5h.01"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/><path d="M4 4.5 6.5 7M20 4.5 17.5 7"/>',
  play: '<path d="M7 5v14l11-7z"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1"/>',
  home: '<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z"/>',
};
const ic = k => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${I[k]}</svg>`;
const MECH_LABEL = { libre: 'Pregunta', rapida: 'Sin pensar', predice: 'Predice', alavez: 'A la vez', juicio: 'Juicio', caos: 'Caos' };
const QCATS = ['obs', 'cdb', 'hip', 'mini', 'exis', 'esp', 'lore', 'teo', 'comp', 'rank', 'acus', 'tit', 'expl', 'ctx', 'rap', 'antes', 'cotid', 'intim'];
/* Tipos de carta elegibles a mano: [clave, icono, nombre, descripción, filtro, mezcla que lo gobierna] */
const TYPE_LIST = [
  ['preguntas', 'libre', 'Preguntas', 'Lo que nunca te había preguntado.', { mechs: ['libre', 'rapida'], cats: QCATS }],
  ['juicio', 'juicio', 'Juicio', 'Dos posturas. Defendedlas.', { mechs: ['juicio'] }],
  ['pref', 'pref', '¿Qué prefieres?', 'Dos opciones. Ninguna buena del todo.', { mechs: ['libre'], cats: ['pref'] }],
  ['alavez', 'alavez', 'A la vez', 'Los dos, a la de tres.', { mechs: ['alavez'] }],
  ['predice', 'predice', 'Predice', 'Uno adivina lo que dirá el otro.', { mechs: ['predice'] }],
  ['caos', 'caos', 'Caos', 'Reglas que cambian la conversación.', null, 'caos'],
];
const TYPE_BY = Object.fromEntries(TYPE_LIST.map(t => [t[0], t]));
const MODE_LIST = [
  ['random', 'die', 'Random total', 'El director decide. Todo puede salir.'],
  ['risas', 'laugh', 'Solo risas', 'Absurdo, teorías, rankings, respuestas rápidas.'],
  ['tres', 'moon', '3 a.m.', 'Existenciales, íntimas, sin prisa.'],
  ['antes', 'clock', 'Antes de mí', 'Infancia, colegio, primeras veces, lo que ya no existe.'],
  ['conoces', 'predice', '¿De verdad me conoces?', 'Predicciones y lo que sabes sin haberlo estudiado.'],
  ['demonios', 'spiral', 'Qué demonios', 'Las más raras del mazo.'],
];

/* ---------- almacenamiento local ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem('ntp.' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('ntp.' + k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem('ntp.' + k); } catch (e) {} },
};
const DEF = { p1: '', p2: '', judge: 0, haptics: true, intimacy: 1 };
const S = {
  screen: 'home',
  settings: Object.assign({}, DEF, store.get('settings', {})),
  favs: store.get('favs', []),
  seen: new Set(store.get('seen', [])),
  game: store.get('game', null),
  recent: store.get('recent', []), // bloques de 25 cartas recientes, del más nuevo al más viejo: tardan en volver
  learned: store.get('learned', {}), // cuántas veces se ha jugado cada mecánica: las instrucciones se acortan con el uso
  mode: 'random', type: null,
  card: null, step: null, tmp: {}, from: 'home', dev: null, confirmReset: false, trans: 'idle',
};
const saveSettings = () => store.set('settings', S.settings);
const saveFavs = () => store.set('favs', S.favs);
const saveSeen = () => store.set('seen', [...S.seen]);
const saveGame = () => S.game ? store.set('game', S.game) : store.del('game');
const saveRecent = () => store.set('recent', S.recent.slice(0, 6));
const saveLearned = () => store.set('learned', S.learned);
const app = document.getElementById('app');
let timer = null, seq = 0, pending = [];
function later(fn, ms) { const my = seq; const id = setTimeout(() => { if (my === seq) fn(); }, ms); pending.push(id); return id; }
function cancelAll() { clearInterval(timer); timer = null; pending.forEach(clearTimeout); pending = []; seq++; S.trans = 'idle'; }
const reduced = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const rich = s => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>');
const plain = s => s.replace(/\*/g, '');
const name = k => esc((k === 1 ? S.settings.p1 : S.settings.p2).trim() || (k === 1 ? 'Uno' : 'Otro'));
const AB = () => { const t = S.game ? S.game.turn % 2 : 0; return t === 0 ? [name(1), name(2)] : [name(2), name(1)]; };
function buzz(ms) { if (!S.settings.haptics) return; try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} }
function toast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 1700); }
const plural = (n, a, b) => n === 1 ? a : b;

/* ---------- partida ---------- */
function startGame(mode, pool, type) {
  const t = type ? TYPE_BY[type] : null;
  const filter = t ? t[4] : null;
  if (t && t[5]) mode = t[5];
  S.game = { mode, type: type || null, label: t ? t[2] : (D.MODES[mode] || D.MODES.random).name, filter, history: [], used: [], pool: pool || null,
    started: Date.now(), turn: 0, rule: null, cur: null };
  nextCard(true);
}
function ctxFor(g) { let cards = CARDS; if (S.dev) cards = CARDS.filter(c => c.mech === S.dev); return { cards, seen: S.seen, rule: g.rule, recent: S.recent, maxIntimacy: S.settings.intimacy }; }
function drawCard() {
  const g = S.game;
  let c = D.pick(g, ctxFor(g));
  if (!c) { g.used = []; g.history = g.history.slice(-8); c = D.pick(g, ctxFor(g)); } // mazo agotado: se vuelve a barajar
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

/* Transición entre cartas: IDLE → LEAVING → (fin de la animación) → nueva carta → ENTERING → (fin) → IDLE.
 * Guiada por eventos reales con un tope de seguridad; durante la transición no se aceptan acciones de carta. */
function afterAnim(el, type, fn, max) {
  let done = false; const my = seq;
  const end = () => { if (done || my !== seq) return; done = true; el.removeEventListener(type, end); fn(); };
  el.addEventListener(type, end);
  later(end, reduced() ? 30 : max);
}
function leave(then) {
  if (S.trans !== 'idle') return;
  const card = document.getElementById('card');
  if (!card) { then(); return; }
  S.trans = 'leaving';
  if (!card.classList.contains('gone')) card.classList.add('leave');
  afterAnim(card, 'transitionend', () => { S.trans = 'idle'; then(); }, 260);
}
function finish() {
  const g = S.game, c = S.card; if (!g || !c || S.trans !== 'idle') return;
  S.seen.add(c.id); saveSeen();
  if (c.mech !== 'caos' && g.rule) {
    const r = g.rule;
    if (r.affects !== 'juicio' || c.mech === 'juicio') r.left--;
    if (r.left <= 0) g.rule = null;
  }
  if (['predice', 'alavez', 'juicio'].includes(c.mech)) g.turn++;
  S.learned[c.mech] = (S.learned[c.mech] || 0) + 1; saveLearned();
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
    <div class="actions"><button class="btn primary" data-a="go" data-v="modes">Leeeeeet’s go</button>
      <div class="links"><button class="link" data-a="go" data-v="favs">Favoritas</button><button class="link" data-a="go" data-v="settings">Ajustes</button></div></div>
  </section>`;
}
function modesView() {
  return `<div class="s-head"><button class="ibtn" data-a="go" data-v="home" aria-label="Volver">${ic('back')}</button></div>
  <h2 class="h2">¿Qué os apetece hoy?</h2>
  <div class="names"><label for="n1">Uno<input id="n1" type="text" maxlength="16" placeholder="Nombre" value="${esc(S.settings.p1)}" data-set="p1"></label>
  <label for="n2">Otro<input id="n2" type="text" maxlength="16" placeholder="Nombre" value="${esc(S.settings.p2)}" data-set="p2"></label></div>
  <span class="g-lab">Mezclas</span>
  <div class="modes">${MODE_LIST.map(([k, i, t, d]) => `<button class="mode" data-a="mode" data-v="${k}">${ic(i)}<b>${t}</b><span>${d}</span></button>`).join('')}</div>
  <span class="g-lab">Tipos de carta</span>
  <div class="types">${TYPE_LIST.map(([k, i, t, d]) => `<button class="type" data-a="type" data-v="${k}">${ic(i)}<b>${t}</b><span>${d}</span></button>`).join('')}</div>
`;
}

function head() {
  const g = S.game, label = g.label || (D.MODES[g.mode] || D.MODES.random).name;
  let rule = '';
  if (g.rule) {
    const r = g.rule, pips = '<i></i>'.repeat(Math.max(0, r.left));
    const unit = r.affects === 'juicio' ? 'próximo juicio' : `${r.left} ${plural(r.left, 'carta', 'cartas')}`;
    rule = `<div class="rule-row"><button class="rule" data-a="ruleinfo" aria-label="Regla activa: ${esc(r.text)}"><span class="pips">${pips}</span><span><b>${esc(r.name)}</b> · ${unit}</span></button>${r.affects === 'veto' && r.vetoes > 0 ? `<button class="rule veto" data-a="veto">Vetar · ${r.vetoes}</button>` : ''}</div>`;
  }
  const dev = S.devOn ? `<div class="devbar">${['', 'libre', 'rapida', 'predice', 'alavez', 'juicio', 'caos'].map(m => `<button class="${(S.dev || '') === m ? 'on' : ''}" data-a="dev" data-v="${m}">${m || 'director'}</button>`).join('')}</div>` : '';
  return `${dev}<header class="g-head"><button class="ibtn" data-a="menu" aria-label="Menú">${ic('close')}</button>
    <div class="g-meta"><span>${esc(label)}</span></div></header>${rule}`;
}
/* escala tipográfica adaptativa: una pregunta de siete palabras no se trata como una de cuatro líneas */
function qClass(c) { const n = c.len; return 'q ' + (n <= 45 ? 'xl' : n <= 80 ? 'l' : n <= 120 ? 'm' : n <= 170 ? 's' : 'xs'); }
function cardTop(c, label) {
  const on = S.favs.includes(c.id);
  const txt = label || (c.mech === 'libre' ? c.catLabel : MECH_LABEL[c.mech]);
  return `<div class="c-top"><span class="mech">${esc(txt)}</span><button class="mark ${on ? 'on' : ''}" data-a="fav" data-id="${c.id}" aria-label="Guardar">${ic('mark')}</button></div>`;
}
const roles = (a, b) => `<div class="roles"><b>${a}</b><span>predice a</span><b>${b}</b></div>`;
const learned = m => (S.learned[m] || 0) >= 6; // la mecánica ya se conoce: menos texto

function playView() {
  const c = S.card, g = S.game, [A, B] = AB(), st = S.step;
  let body = '', acts = '';
  const skip = '<button class="link" data-a="pass">Saltar</button>';
  const next = `<button class="btn primary" data-a="done">Siguiente</button>`;
  if (c.mech === 'libre' || c.mech === 'rapida') acts = next;
  if (c.mech === 'predice') {
    const quick = learned('predice');
    body = roles(A, B);
    if (st === 'think') { body += quick ? '' : `<p class="ins"><b>${A}</b>, intenta adivinar qué responderá ${B}. Cuando la tengas, cuenta atrás.</p>`; acts = `<button class="btn primary" data-a="count">Ya la tengo</button>${skip}`; }
    if (st === 'done') { body += quick ? `<p class="ins"><b>${B}</b> responde. Luego <b>${A}</b>.</p>` : `<p class="ins"><b>${B}</b> responde de verdad. Después, <b>${A}</b> dice lo que había pensado.</p>`; acts = next; }
  }
  if (c.mech === 'alavez') {
    const quick = learned('alavez');
    if (st === 'ready') { body = quick ? '' : `<p class="ins">Pensadla cada uno sin decirla. A la de tres, los dos a la vez.</p>`; acts = `<button class="btn primary" data-a="count">A la de 3</button>${skip}`; }
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
    return head() + `<div class="stage"><article class="card caos" id="card"><div class="face">
      ${cardTop(c)}<div class="q-wrap"><div class="caos-mark">${ic('caos')}</div><h2 class="name">${esc(c.name)}</h2><p class="q rule-text">${rich(c.text)}</p>
      <div class="dur">${c.n ? `<span class="pips">${'<i></i>'.repeat(c.n)}</span>` : ''}${dur}</div></div></div></article></div>
      <div class="actions"><button class="btn primary" data-a="accept">Vale</button>${skip}</div>`;
  }
  const inner = `<div class="face">${cardTop(c)}<div class="q-wrap"><h2 class="${qClass(c)}">${rich(c.text)}</h2></div>${body ? `<div class="c-body">${body}</div>` : ''}</div>`;
  return head() + `<div class="stage"><article class="card" id="card"><span class="swipe-tag pass">Pasar</span>${inner}</article></div>
    <div class="actions">${acts}</div>`;
}

function favsView() {
  const list = S.favs.map(id => BY_ID[id]).filter(Boolean);
  return `<div class="s-head"><button class="ibtn" data-a="backfrom" aria-label="Volver">${ic('back')}</button></div>
  <h2 class="h2">Favoritas</h2><p class="sub">${list.length ? `${list.length} ${plural(list.length, 'carta guardada', 'cartas guardadas')}.` : ''}</p>
  ${list.length ? list.map(c => `<div class="fav"><span class="cat">${MECH_LABEL[c.mech]}${c.mech === 'libre' ? ' · ' + esc(c.catLabel) : ''}</span><p>${c.mech === 'caos' ? `<b>${esc(c.name)}.</b> ` : ''}${esc(plain(c.text))}</p><button class="mark on" data-a="fav" data-id="${c.id}" aria-label="Quitar">${ic('mark')}</button></div>`).join('')
    : `<p class="empty">Todavía no hay favoritas. Guarda una carta con el marcador.</p>`}
  ${list.length >= 3 ? `<div class="actions"><button class="btn primary" data-a="playfavs">Jugar las favoritas</button></div>` : ''}`;
}
function seg(key, opts) { return `<div class="seg">${opts.map(([v, l]) => `<button class="${S.settings[key] === v ? 'on' : ''}" data-a="setv" data-k="${key}" data-v="${JSON.stringify(v).replace(/"/g, '&quot;')}">${l}</button>`).join('')}</div>`; }
function settingsView() {
  const intim = ['Sin cartas íntimas.', 'Atracción, detalles, romanticismo.', 'Además, deseo y preferencias.', 'Además, fantasías y lo nunca dicho.'][S.settings.intimacy] || '';
  return `<div class="s-head"><button class="ibtn" data-a="backfrom" aria-label="Volver">${ic('back')}</button></div>
  <h2 class="h2">Ajustes</h2>
  <div class="set"><span>Nombres</span><div class="names" style="margin:0"><input id="s1" type="text" maxlength="16" placeholder="Uno" aria-label="Nombre del jugador 1" value="${esc(S.settings.p1)}" data-set="p1"><input id="s2" type="text" maxlength="16" placeholder="Otro" aria-label="Nombre del jugador 2" value="${esc(S.settings.p2)}" data-set="p2"></div></div>
  <div class="set"><span>Intimidad</span>${seg('intimacy', [[0, 'No'], [1, 'Suave'], [2, 'Media'], [3, 'Alta']])}<p>${intim} Siempre conversación, nunca retos.</p></div>
  <div class="set"><span>Tiempo de los juicios</span>${seg('judge', [[0, 'Sin tiempo'], [30, '30 s'], [60, '60 s']])}</div>
  <div class="set"><span>Vibración</span>${seg('haptics', [[true, 'Sí'], [false, 'No']])}</div>
  <div class="set"><span>Historial</span><p>Habéis visto ${S.seen.size} de ${CARDS.length} cartas. Las que no habéis visto salen antes, y las recientes tardan en volver.</p>
    ${S.confirmReset ? `<div class="pills"><button class="pill on" data-a="reset">Sí, reiniciar</button><button class="pill" data-a="noreset">Cancelar</button></div>` : `<button class="btn ghost" data-a="askreset">Reiniciar historial</button>`}</div>`;
}

function render(anim) {
  const v = { home: homeView, modes: modesView, play: playView, favs: favsView, settings: settingsView }[S.screen];
  const changed = S.lastScreen !== S.screen; S.lastScreen = S.screen;
  app.innerHTML = v();
  app.style.transform = ''; // por si quedó un arrastre a medias
  document.querySelectorAll('.back-hint').forEach(h => h.remove());
  document.body.classList.toggle('fixed', S.screen === 'play'); // la pantalla de cartas no se desplaza
  if (changed) { app.classList.remove('in'); void app.offsetWidth; app.classList.add('in'); } // fundido entre pantallas: repinta todo, sin restos
  const card = document.getElementById('card');
  if (card) {
    if (anim) { S.trans = 'entering'; card.classList.add('enter'); afterAnim(card, 'animationend', () => { S.trans = 'idle'; }, 400); }
    else if (S.swap) card.classList.add('swap');
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

/* ---------- cuenta atrás: 3 · 2 · 1 y se revela, sin pantalla de «ya» ---------- */
function countdown() {
  const card = document.getElementById('card'); if (!card) return;
  const ov = document.createElement('div'); ov.className = 'count'; card.appendChild(ov);
  document.querySelectorAll('.actions button').forEach(b => { b.style.visibility = 'hidden'; });
  buzz(10);
  const step = reduced() ? 450 : 620;
  let k = 3;
  const tick = () => {
    if (k === 0) { ov.classList.add('go'); buzz(25); later(() => { S.step = 'done'; S.swap = true; render(); }, 180); return; }
    ov.innerHTML = `<span class="n n${k}">${k}</span>`; k--; later(tick, step);
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
  const busy = S.trans !== 'idle';
  switch (a) {
    case 'go': if (S.screen === 'play') cancelAll(); S.from = S.screen === 'play' ? 'play' : 'home'; S.screen = v; S.confirmReset = false; render(true); break;
    case 'backfrom': S.screen = S.from === 'play' && S.game ? 'play' : 'home'; render(true); break;
    case 'mode': S.mode = v; S.type = null; startGame(S.mode, null, null); break;
    case 'type': S.type = v; S.mode = 'random'; startGame('random', null, v); break;
    case 'playfavs': startGame('favs', S.favs.slice()); break;
    case 'fav': toggleFav(b.dataset.id); if (S.screen === 'favs') render(); break;
    case 'done': if (!busy) finish(); break;
    case 'pass': if (!busy) finish(); break;
    case 'count': if (!busy && !S.tmp.counting) { S.tmp.counting = true; countdown(); } break;
    case 'jstart': S.step = 'a'; S.tmp.left = S.settings.judge; buzz(8); render(); break;
    case 'jnext': judgeNext(); break;
    case 'accept': {
      const c = S.card; if (busy) break;
      if (c.n > 0) S.game.rule = { name: c.name, text: plain(c.text), affects: c.affects, left: c.n, vetoes: c.affects === 'veto' ? 2 : 0 };
      S.seen.add(c.id); saveSeen(); buzz(10);
      leave(nextCard); break;
    }
    case 'ruleinfo': if (S.game.rule) toast(S.game.rule.text); break;
    case 'veto': if (!busy && S.game.rule && S.game.rule.vetoes > 0) { S.game.rule.vetoes--; toast('Vetada. Sin explicaciones.'); finish(); } break;
    case 'menu': openMenu(); break;
    case 'dev': S.dev = v || null; render(); break;
    case 'setv': S.settings[b.dataset.k] = JSON.parse(v); saveSettings(); render(); break;
    case 'askreset': S.confirmReset = true; render(); break;
    case 'noreset': S.confirmReset = false; render(); break;
    case 'reset': S.seen = new Set(); saveSeen(); S.confirmReset = false; toast('Historial reiniciado'); render(); break;
  }
});

function resume() { if (!S.game) return; cancelAll(); S.card = BY_ID[S.game.cur] || drawCard(); S.step = firstStep(S.card); S.tmp = {}; S.screen = 'play'; render(true); }
/* atrás: adónde lleva cada pantalla cuando se desliza desde el borde izquierdo */
function goBack() {
  const sheet = document.querySelector('.sheet'); if (sheet) { sheet.remove(); return; }
  if (S.screen === 'home') return;
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
    if (S.screen === 'home') return;
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

/* ---------- deslizar la carta a la izquierda: pasar ---------- */
function canSwipe() { const c = S.card; return c && c.mech !== 'caos' && S.step === firstStep(c) && S.trans === 'idle'; }
function swipeOut(card) {
  if (S.trans !== 'idle') return;
  S.trans = 'leaving';
  card.style.transition = 'transform .22s ease-in, opacity .22s ease-in';
  card.style.transform = 'translateX(-460px) rotate(-9deg)'; card.style.opacity = '0'; card.classList.add('gone');
  afterAnim(card, 'transitionend', () => { S.trans = 'idle'; finish(); }, 260);
}
function attachSwipe(card) {
  let sx = 0, sy = 0, dx = 0, on = false;
  const ps = card.querySelector('.swipe-tag.pass');
  card.addEventListener('pointerdown', e => { if (e.target.closest('button,input') || !canSwipe() || e.clientX <= 28) return; on = true; sx = e.clientX; sy = e.clientY; dx = 0; card.style.transition = 'none'; });
  card.addEventListener('pointermove', e => {
    if (!on) return; dx = e.clientX - sx;
    if (Math.abs(e.clientY - sy) > 40 && Math.abs(dx) < 20) { on = false; card.style.transform = ''; return; }
    if (Math.abs(dx) > 6 && !card.hasPointerCapture(e.pointerId)) card.setPointerCapture(e.pointerId);
    const x = Math.min(dx, 0) + Math.max(dx, 0) * .25; // hacia la derecha apenas se mueve: guardar es con el marcador
    card.style.transform = `translateX(${x}px) rotate(${x / 24}deg)`;
    if (ps) ps.style.opacity = Math.max(0, Math.min(1, (-dx - 20) / 70));
  });
  const end = () => { if (!on) return; on = false; card.style.transition = ''; if (dx < -100) swipeOut(card); else { card.style.transform = ''; if (ps) ps.style.opacity = 0; } };
  card.addEventListener('pointerup', end); card.addEventListener('pointercancel', end);
}

/* ---------- arranque ---------- */
S.devOn = location.hash === '#dev';
if (S.devOn) window.__ntp = S;
window.addEventListener('hashchange', () => { S.devOn = location.hash === '#dev'; if (S.screen === 'play') render(); });
attachBackGesture();
render();
})();
