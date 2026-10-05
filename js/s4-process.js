/* Неделя 4, четверг 10:00 — «Процессы „как есть“ и „как будет“».
   Теория (соседние примеры — возврат обуви в магазине «Шаг» и заказ в кафе): зачем рисовать процесс — четыре линзы
   на схеме «как есть», переключатель AS-IS ↔ TO-BE с метриками, «честный AS-IS» (регламент против жизни);
   азбука BPMN 2.0 (12 элементов), шлюзы «или — или», «и», «и/или» на заказе в кафе с пробегом токена и ошибками
   слияния, бегущий токен по возврату обуви с переключателями; режим «найди ошибку» (6 типичных ошибок), уровни схемы,
   разрыв → требование.
   Практика на «Колосе»: мини-редактор BPMN — собрать заказ торта «как есть» по дорожкам; разметить разрывы AS-IS;
   лаборатория TO-BE — поставить шлюзы «48 часов» и «до 25 тортов», таймер, параллельные ветки и прогнать токен
   по трём сценариям; gap-анализ «было → стало → что нужно от системы»; ответ Нине своими словами. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'process';

  if (!document.getElementById('pr-css')) document.head.insertAdjacentHTML('beforeend', `<style id="pr-css">
    .pr-root, .pr-root .stack > * { min-width: 0; }
    .pr-root .seg button { white-space: normal; text-align: left; }
    .pr-lbl { font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .pr-two { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 16px; align-items: start; }
    .pr-two > * { min-width: 0; }
    .pr-two.wide { grid-template-columns: minmax(0, 1fr) minmax(0, 250px); }
    .pr-two.ed { grid-template-columns: minmax(0, .78fr) minmax(0, 1.22fr); }
    .pr-dg svg { display: block; margin: 0 auto; }
    .pr-kpi { display: flex; flex-wrap: wrap; gap: 6px; }
    .pr-kpi .chip { white-space: normal; }
    .pr-find { display: grid; gap: 6px; }
    .pr-fi { display: grid; grid-template-columns: 26px minmax(0, 1fr); gap: 8px; align-items: start; padding: 7px 10px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); font-size: 13.5px; line-height: 1.45; }
    .pr-fi > * { min-width: 0; }
    .pr-fi .n { width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font: 700 11px/1 var(--f-mono); background: var(--warn-soft); color: var(--warn); }
    .pr-fi.bad .n { background: var(--bad-soft); color: var(--bad); }
    .pr-fi.ok .n { background: var(--ok-soft); color: var(--ok); }
    .pr-fi.info .n { background: var(--info-soft); color: var(--info); }
    .pr-fi.bad { border-color: color-mix(in srgb, var(--bad) 50%, var(--border)); }
    .pr-fi.ok { border-color: color-mix(in srgb, var(--ok) 50%, var(--border)); }
    .pr-abc { display: grid; grid-template-columns: repeat(auto-fill, minmax(112px, 1fr)); gap: 6px; }
    .pr-el { display: grid; justify-items: center; gap: 2px; padding: 6px 6px 8px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); color: var(--text); font-size: 12px; line-height: 1.25; text-align: center; }
    .pr-el svg { width: 60px; height: 38px; display: block; }
    .pr-el[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); box-shadow: 0 0 0 1px var(--accent) inset; }
    .pr-card { border: 1px solid var(--border-strong); border-radius: 12px; background: var(--surface); padding: 12px 14px; display: grid; gap: 8px; }
    .pr-card > * { min-width: 0; }
    .pr-card h4 { font: 600 16px/1.25 var(--f-brand); margin: 0; }
    .pr-kv { display: grid; grid-template-columns: 112px minmax(0, 1fr); gap: 6px 10px; font-size: 13.5px; line-height: 1.45; }
    .pr-kv > * { min-width: 0; }
    .pr-kv > b { font: 600 10.5px/1.7 var(--f-mono); letter-spacing: .05em; text-transform: uppercase; color: var(--text-muted); }
    .pr-run { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 290px); gap: 14px; align-items: start; }
    .pr-run > * { min-width: 0; }
    .pr-ctl { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
    .pr-log { display: grid; gap: 4px; max-height: 330px; overflow-y: auto; font-size: 13px; line-height: 1.4; padding-right: 2px; align-content: start; }
    .pr-log div { padding: 5px 8px; border-radius: 8px; background: var(--surface); border: 1px solid var(--border); }
    .pr-log div.cur { border-color: var(--accent); background: var(--accent-soft); }
    .pr-log div.bad { border-color: var(--bad); background: var(--bad-soft); }
    .pr-log div.warn { border-color: var(--warn); background: var(--warn-soft); }
    .pr-sts { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; font-size: 12px; }
    .pr-sts span { padding: 2px 8px; border-radius: 99px; border: 1px solid var(--border); color: var(--text-muted); background: var(--surface); }
    .pr-sts span.on { border-color: var(--accent); color: var(--accent); background: var(--accent-soft); font-weight: 600; }
    .pr-sts span.rej.on { border-color: var(--bad); color: var(--bad); background: var(--bad-soft); }
    .pr-sts i { color: var(--text-muted); font-style: normal; }
    .pr-pal { display: flex; flex-wrap: wrap; gap: 6px; }
    .pr-cd { display: inline-grid; grid-template-columns: 18px minmax(0, 1fr); gap: 6px; align-items: start; text-align: left; padding: 6px 10px; border: 1px solid var(--border-strong); border-radius: 9px; background: var(--surface-2); color: var(--text); font-size: 13px; line-height: 1.35; max-width: 100%; }
    .pr-cd > * { min-width: 0; }
    .pr-cd .k { font-size: 13px; line-height: 1.3; text-align: center; }
    .pr-cd[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); box-shadow: 0 0 0 1px var(--accent) inset; }
    .pr-cd:disabled { opacity: .4; cursor: default; }
    .pr-cd.bad { border-color: var(--bad); background: var(--bad-soft); }
    .pr-cd.ok { border-color: var(--ok); background: var(--ok-soft); }
    .pr-lanes { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
    .pr-list { display: grid; gap: 4px; }
    .pr-li { display: grid; grid-template-columns: 22px minmax(0, 1fr) auto; gap: 6px 8px; align-items: center; padding: 6px 8px; border: 1px solid var(--border); border-radius: 9px; background: var(--surface); font-size: 13px; line-height: 1.35; }
    .pr-li > * { min-width: 0; }
    .pr-li .n { font: 700 11.5px/1 var(--f-mono); color: var(--text-muted); text-align: center; }
    .pr-li .ctl { display: flex; gap: 3px; align-items: center; flex-wrap: wrap; justify-content: flex-end; }
    .pr-li select { font-size: 12.5px; padding: 3px 4px; width: auto; max-width: 128px; }
    .pr-li.ok { border-color: var(--ok); } .pr-li.bad { border-color: var(--bad); background: var(--bad-soft); } .pr-li.warn { border-color: var(--warn); }
    .pr-ib { min-width: 28px; height: 28px; border-radius: 7px; border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text); font-size: 13px; padding: 0 6px; }
    .pr-ib:disabled { opacity: .35; }
    .pr-slots { display: grid; gap: 6px; }
    .pr-slot { display: grid; grid-template-columns: 24px minmax(0, 1fr); gap: 4px 8px; align-items: center; padding: 7px 9px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); font-size: 13px; line-height: 1.35; }
    .pr-slot > * { min-width: 0; }
    .pr-slot .n { width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; background: var(--accent); color: var(--accent-text); font: 700 11.5px/1 var(--f-mono); }
    .pr-slot select { grid-column: 1 / -1; font-size: 13px; padding: 6px 8px; }
    .pr-slot.ok { border-color: var(--ok); } .pr-slot.bad { border-color: var(--bad); background: var(--bad-soft); } .pr-slot.warn { border-color: var(--warn); background: var(--warn-soft); }
    .pr-runs { display: flex; flex-wrap: wrap; gap: 4px; }
    .pr-runs .chip { white-space: normal; }
    .pr-gm { display: grid; gap: 8px; }
    .pr-gr { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1fr) minmax(0, 1fr); gap: 8px 10px; padding: 10px 12px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); align-items: start; }
    .pr-gr > * { min-width: 0; }
    .pr-gr .was { font-size: 13.5px; line-height: 1.45; display: grid; gap: 3px; }
    .pr-gr .fld { display: grid; gap: 3px; }
    .pr-gr select { font-size: 13px; padding: 6px 8px; }
    .pr-gr.ok { border-color: var(--ok); } .pr-gr.warn { border-color: var(--warn); } .pr-gr.bad { border-color: var(--bad); }
    .pr-gr .why { grid-column: 1 / -1; font-size: 13px; color: var(--text-2); }
    .pr-gq { display: grid; gap: 8px; padding: 10px 12px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); font-size: 13.5px; line-height: 1.45; }
    .pr-gq > * { min-width: 0; }
    .pr-gq.ok { border-color: var(--ok); } .pr-gq.bad { border-color: var(--bad); }
    .pr-gq .opts { display: flex; flex-wrap: wrap; gap: 6px; }
    .pr-gq .opts .btn { white-space: normal; text-align: left; }
    .pr-chain { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
    .pr-chain span { padding: 7px 12px; border: 1px solid var(--border-strong); border-radius: 8px; background: var(--surface); font-size: 13.5px; }
    .pr-chain span.bad { border-color: var(--bad); background: var(--bad-soft); }
    .pr-chain span.big { font-weight: 600; background: var(--info-soft); border-color: color-mix(in srgb, var(--info) 45%, var(--border)); }
    .pr-chain i { color: var(--text-muted); font-style: normal; }
    .pr-ol { margin: 0; padding-left: 20px; display: grid; gap: 3px; font-size: 13.5px; }
    .pr-diff { display: grid; gap: 4px; font-size: 13.5px; }
    .pr-diff div { padding: 5px 10px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); }
    .pr-diff .minus { border-color: color-mix(in srgb, var(--bad) 45%, var(--border)); color: var(--text-2); }
    .pr-diff .minus b { color: var(--bad); }
    .pr-diff .plus { border-color: color-mix(in srgb, var(--ok) 45%, var(--border)); }
    .pr-diff .plus b { color: var(--ok); }
    .pr-glow { animation: prPulse 1.1s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
    @keyframes prPulse { 50% { opacity: .06; transform: scale(1.35); } }
    @media (prefers-reduced-motion: reduce) { .pr-glow { animation: none; } }
    @media (max-width: 860px) {
      .pr-two, .pr-two.wide, .pr-two.ed, .pr-run { grid-template-columns: minmax(0, 1fr); }
      .pr-gr { grid-template-columns: minmax(0, 1fr); }
    }
    @media (max-width: 440px) {
      .pr-kv { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .pr-kv > b { margin-top: 6px; }
      .pr-li { grid-template-columns: 18px minmax(0, 1fr); }
      .pr-li .ctl { grid-column: 1 / -1; justify-content: flex-start; }
    }
  </style>`);

  // ---------- общие помощники ----------
  const fresh = fn => pane => { const d = document.createElement('div'); pane.appendChild(d); fn(d); };
  const chip = (t, k) => `<span class="chip ${k || ''}">${t}</span>`;
  const sysBtn = (view, label, note) => `<div class="row"><button type="button" class="btn sm" data-sys="${esc(view)}">${esc(label)}</button>${note ? `<span class="small muted">${note}</span>` : ''}</div>`;
  const onSys = root => TR.on(root, 'click', '[data-sys]', (e, b) => { if (TR.system && TR.system.open) TR.system.open(b.dataset.sys); else ui.toast('Живая система «Колос» ещё собирается — загляните позже', 'warn'); });
  function wrapT(t, max) {
    const out = []; let line = '';
    String(t || '').split(/\s+/).forEach(w => { if (!w) return; if ((line + ' ' + w).trim().length > max && line) { out.push(line); line = w; } else line = (line + ' ' + w).trim(); });
    if (line) out.push(line);
    return out;
  }
  let UID = 0;

  // =====================================================================
  // Рендерер BPMN: пулы и дорожки идут столбцами слева направо, процесс течёт сверху вниз —
  // так схема помещается на экран телефона. Узлы ставятся в ячейку «дорожка × ряд», стрелки — ортогональные.
  // =====================================================================
  const LW = 150, BLK = 50, PGAP = 12, PT = 24, LHD = 34, TW = 128, ER = 15, GD = 20;
  const GWK = { xor: 1, and: 1, or: 1, slot: 1 };
  const COLS = { '': 'var(--text-2)', tok: 'var(--accent)', done: 'var(--accent)', bad: 'var(--bad)', ok: 'var(--ok)', dim: 'var(--border-strong)' };
  const isGw = k => !!GWK[k];

  function bLayout(m) {
    const pools = m.pools || [{ id: 'main', t: m.title || '' }];
    const main = pools.find(p => !p.black) || pools[0];
    const LX = {}, PL = [];
    let x = 1;
    pools.forEach((p, i) => {
      if (i) x += PGAP;
      if (p.black) { PL.push({ p, x, w: BLK }); LX['P:' + p.id] = { x, w: BLK }; x += BLK; return; }
      const ls = m.lanes.filter(l => (l.pool || main.id) === p.id), x0 = x;
      ls.forEach(l => { LX[l.id] = { x, w: l.w || LW, l }; x += l.w || LW; });
      PL.push({ p, x: x0, w: x - x0, lanes: ls });
    });
    const W = x + 1;
    const nr = Math.max(m.minRows || 0, m.nodes.reduce((a, n) => Math.max(a, n.row + 1), 0));
    const RH = [];
    for (let r = 0; r < nr; r++) {
      const ns = m.nodes.filter(n => n.row === r);
      RH.push((m.rh && m.rh[r]) || (ns.some(n => n.k === 'task') ? 70 : ns.some(n => n.lp === 'tr') ? 74 : ns.length ? 58 : 34));
    }
    const top = PT + LHD + 6, RY = [];
    let y = top; RH.forEach(h => { RY.push(y); y += h; });
    const H = y + 8, N = {};
    m.nodes.forEach(n => {
      const L = LX[n.lane] || { x: 0, w: LW };
      const cx = L.x + L.w / 2 + (n.dx || 0) * L.w, cy = RY[n.row] + RH[n.row] / 2 + (n.k === 'task' ? 0 : n.lp === 'tr' ? 8 : 0);
      let w, h, lines = null;
      if (n.k === 'task') { w = n.tw || TW; lines = wrapT(n.t, n.cpl || 18); h = Math.max(46, lines.length * 13 + 14); }
      else if (isGw(n.k)) { w = h = GD * 2; }
      else { w = h = ER * 2; }
      N[n.id] = { n, cx, cy, w, h, lines };
    });
    return { PL, LX, W, H, N };
  }
  function anc(L, id, other) {
    if (String(id).startsWith('P:')) { const P = L.LX[id], o = L.N[other]; return P ? { pool: true, cx: P.x + P.w / 2, cy: o ? o.cy : 0, w: P.w, h: 0, n: { k: 'pool' } } : null; }
    return L.N[id] || null;
  }
  function route(f, A, B) {
    const P = (x, y) => ({ x, y });
    const Lp = n => P(n.cx - n.w / 2, n.cy), Rp = n => P(n.cx + n.w / 2, n.cy), Tp = n => P(n.cx, n.cy - n.h / 2), Bp = n => P(n.cx, n.cy + n.h / 2);
    const dx = B.cx - A.cx, dy = B.cy - A.cy, dir = dx > 0 ? 1 : -1;
    if (A.pool || B.pool || (f.msg && Math.abs(dy) < 4)) {
      const a = dx > 0 ? Rp(A) : Lp(A), b = dx > 0 ? Lp(B) : Rp(B);
      return { pts: [a, P(b.x, a.y)], lab: P((a.x + b.x) / 2, a.y - 6), anchor: 'middle' };
    }
    if (f.msg) { const a = dx > 0 ? Rp(A) : Lp(A), b = dy > 0 ? Tp(B) : Bp(B); return { pts: [a, P(B.cx, a.y), b], lab: P((a.x + B.cx) / 2, a.y - 6), anchor: 'middle' }; }
    if (f.via === 'g' && Math.abs(dx) >= 2 && dy > 0) { const a = Bp(A), b = Tp(B), my = (a.y + b.y) / 2; return { pts: [a, P(a.x, my), P(b.x, my), b], lab: P(a.x + 7, a.y + 12), anchor: 'start' }; }
    if (Math.abs(dx) < 2) {
      if (dy > 0) { const a = Bp(A); return { pts: [a, Tp(B)], lab: P(A.cx + (f.ll ? -7 : 7), a.y + 12), anchor: f.ll ? 'end' : 'start' }; }
      const xo = A.cx + Math.max(A.w, B.w) / 2 + 16;
      return { pts: [Rp(A), P(xo, A.cy), P(xo, B.cy), Rp(B)], lab: P(xo + 4, (A.cy + B.cy) / 2), anchor: 'start' };
    }
    if (Math.abs(dy) < 4) { const a = dir > 0 ? Rp(A) : Lp(A), b = dir > 0 ? Lp(B) : Rp(B); return { pts: [a, b], lab: P(a.x + dir * 7, a.y - 6), anchor: dir > 0 ? 'start' : 'end' }; }
    if (isGw(A.n.k) && f.ex === 'b') { const a = Bp(A), b = dir > 0 ? Lp(B) : Rp(B); return { pts: [a, P(A.cx, B.cy), b], lab: P(A.cx + 7, a.y + 12), anchor: 'start' }; }
    if (isGw(A.n.k)) { const a = dir > 0 ? Rp(A) : Lp(A), b = dy > 0 ? Tp(B) : Bp(B); return { pts: [a, P(B.cx, a.y), b], lab: P(a.x + dir * 7, a.y - 6), anchor: dir > 0 ? 'start' : 'end' }; }
    if (isGw(B.n.k)) { const a = dy > 0 ? Bp(A) : Tp(A), b = dir > 0 ? Lp(B) : Rp(B); return { pts: [a, P(A.cx, B.cy), b], lab: P(A.cx + 7, a.y + 12), anchor: 'start' }; }
    const a = dy > 0 ? Bp(A) : Tp(A), b = dy > 0 ? Tp(B) : Bp(B), my = (a.y + b.y) / 2;
    return { pts: [a, P(a.x, my), P(b.x, my), b], lab: P(a.x + 7, a.y + 12), anchor: 'start' };
  }
  function midOf(pts) {
    let tot = 0; const seg = [];
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y); seg.push(l); tot += l; }
    let h = tot / 2;
    for (let i = 1; i < pts.length; i++) { if (h <= seg[i - 1]) { const t = seg[i - 1] ? h / seg[i - 1] : 0; return { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * t, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * t }; } h -= seg[i - 1]; }
    return pts[0];
  }
  const fid = f => `f:${f.a}-${f.b}`;
  const envelope = (cx, cy, filled, c) => `<rect x="${cx - 7}" y="${cy - 5}" width="14" height="10" rx="1.5" style="fill:${filled ? c : 'var(--surface)'};stroke:${c};stroke-width:1.3"/><path d="M${cx - 7} ${cy - 5} L${cx} ${cy + 1} L${cx + 7} ${cy - 5}" style="fill:none;stroke:${filled ? 'var(--surface)' : c};stroke-width:1.2"/>`;
  const clock = (cx, cy, c) => `<circle cx="${cx}" cy="${cy}" r="7.5" style="fill:var(--surface);stroke:${c};stroke-width:1.3"/><path d="M${cx} ${cy - 5} V${cy} L${cx + 4} ${cy + 2}" style="fill:none;stroke:${c};stroke-width:1.4;stroke-linecap:round"/>`;
  function shapeSvg(k, cx, cy, sv, w) {
    // одна фигура BPMN; sv — состояние подсветки
    const hi = { cur: 'var(--accent)', bad: 'var(--bad)', ok: 'var(--ok)', warn: 'var(--warn)', sel: 'var(--accent)', done: null }[sv] || null;
    const swx = hi ? 2.4 : 1.6;
    if (k === 'start' || k === 'msgstart') {
      const c = hi || 'var(--ok)';
      return `<circle cx="${cx}" cy="${cy}" r="${ER}" style="fill:var(--ok-soft);stroke:${c};stroke-width:${hi ? 2.6 : 1.8}"/>` + (k === 'msgstart' ? envelope(cx, cy, false, 'var(--ok)') : '');
    }
    if (k === 'end' || k === 'msgend') {
      const c = hi || 'var(--bad)';
      return `<circle cx="${cx}" cy="${cy}" r="${ER}" style="fill:var(--bad-soft);stroke:${c};stroke-width:${hi ? 4.2 : 3.4}"/>` + (k === 'msgend' ? envelope(cx, cy, true, 'var(--bad)') : '');
    }
    if (k === 'timer' || k === 'msg' || k === 'msgc') {
      const c = hi || 'var(--info)';
      return `<circle cx="${cx}" cy="${cy}" r="${ER}" style="fill:var(--info-soft);stroke:${c};stroke-width:${swx}"/><circle cx="${cx}" cy="${cy}" r="${ER - 3.5}" style="fill:none;stroke:${c};stroke-width:1.1"/>` + (k === 'timer' ? clock(cx, cy, 'var(--info)') : envelope(cx, cy, k === 'msg', 'var(--info)'));
    }
    if (k === 'slot') {
      return `<rect x="${cx - GD + 2}" y="${cy - GD + 2}" width="${2 * GD - 4}" height="${2 * GD - 4}" rx="8" style="fill:var(--accent-soft);stroke:${hi || 'var(--accent)'};stroke-width:1.6;stroke-dasharray:4 3"/><text x="${cx}" y="${cy + 5}" text-anchor="middle" style="fill:var(--accent);font:700 15px var(--f-mono)">?</text>`;
    }
    if (isGw(k)) {
      const c = hi || 'var(--warn)';
      let s = `<path d="M${cx} ${cy - GD} L${cx + GD} ${cy} L${cx} ${cy + GD} L${cx - GD} ${cy} Z" style="fill:var(--warn-soft);stroke:${c};stroke-width:${swx};stroke-linejoin:round"/>`;
      const ic = 'stroke:var(--warn);stroke-width:2.8;stroke-linecap:round;fill:none';
      if (k === 'xor') s += `<path d="M${cx - 6} ${cy - 6} L${cx + 6} ${cy + 6} M${cx + 6} ${cy - 6} L${cx - 6} ${cy + 6}" style="${ic}"/>`;
      if (k === 'and') s += `<path d="M${cx} ${cy - 8} V${cy + 8} M${cx - 8} ${cy} H${cx + 8}" style="${ic}"/>`;
      if (k === 'or') s += `<circle cx="${cx}" cy="${cy}" r="7.5" style="${ic};stroke-width:2.4"/>`;
      return s;
    }
    // задача
    const ww = w || TW, hh = 40;
    return `<rect x="${cx - ww / 2}" y="${cy - hh / 2}" width="${ww}" height="${hh}" rx="8" style="fill:var(--surface);stroke:${hi || 'var(--border-strong)'};stroke-width:${hi ? 2.2 : 1.3}"/>`;
  }
  function badge(x, y, t, k) {
    const c = { bad: 'var(--bad)', ok: 'var(--ok)', warn: 'var(--warn)', accent: 'var(--accent)', info: 'var(--info)' }[k || 'accent'] || 'var(--accent)';
    return `<circle cx="${x}" cy="${y}" r="10" style="fill:${c};stroke:var(--surface);stroke-width:2"/><text x="${x}" y="${y + 4}" text-anchor="middle" style="fill:var(--surface);font:700 11px var(--f-mono)">${esc(t)}</text>`;
  }
  function bSvg(m, o) {
    o = o || {};
    const L = bLayout(m), id = 'bp' + (++UID);
    const st = o.st || {}, fst = o.fst || {}, tok = o.tok || {}, wait = o.wait || {}, marks = o.marks || {}, fmarks = o.fmarks || {};
    let s = `<svg viewBox="0 0 ${L.W} ${L.H}" width="100%" style="min-width:${Math.min(L.W, o.minW || 500)}px;max-width:${L.W + 80}px" role="img" aria-label="${esc(m.title || 'Схема процесса в нотации BPMN')}">`;
    s += '<defs>' + ['', 'tok', 'done', 'bad', 'ok', 'dim'].map(k => `<marker id="${id}-a${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" style="fill:${COLS[k]}"/></marker>`).join('')
      + `<marker id="${id}-mo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M1 1 L9 5 L1 9 z" style="fill:var(--surface);stroke:var(--text-2);stroke-width:1.3"/></marker>`
      + `<marker id="${id}-ms" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7"><circle cx="5" cy="5" r="3.5" style="fill:var(--surface);stroke:var(--text-2);stroke-width:1.3"/></marker></defs>`;
    // пулы и дорожки
    L.PL.forEach(pl => {
      if (pl.p.black) {
        s += `<rect x="${pl.x}" y="1" width="${pl.w}" height="${L.H - 2}" rx="10" style="fill:var(--surface-3);stroke:var(--border-strong);stroke-width:1.3"/>`;
        s += `<text transform="translate(${pl.x + pl.w / 2} ${L.H / 2}) rotate(-90)" text-anchor="middle" dy="5" style="fill:var(--text);font:600 13px var(--f-brand)">${esc(pl.p.t)}</text>`;
        return;
      }
      s += `<rect x="${pl.x}" y="1" width="${pl.w}" height="${L.H - 2}" rx="10" style="fill:var(--surface);stroke:var(--border-strong);stroke-width:1.3"/>`;
      s += `<text x="${pl.x + pl.w / 2}" y="${PT - 8}" text-anchor="middle" style="fill:var(--text);font:600 12px var(--f-brand)">${esc(pl.p.t)}</text>`;
      s += `<path d="M${pl.x} ${PT} h${pl.w}" style="stroke:var(--border-strong);stroke-width:1.2"/>`;
      pl.lanes.forEach((l, i) => {
        const lx = L.LX[l.id], hl = o.laneHl && o.laneHl[l.id];
        if (hl) s += `<rect x="${lx.x + 1}" y="${PT + 1}" width="${lx.w - 2}" height="${L.H - PT - 3}" style="fill:${hl === 'bad' ? 'var(--bad-soft)' : 'var(--accent-soft)'};opacity:.75"/>`;
        else if (i % 2) s += `<rect x="${lx.x}" y="${PT + LHD}" width="${lx.w}" height="${L.H - PT - LHD - 2}" style="fill:var(--surface-2);opacity:.6"/>`;
        if (i) s += `<path d="M${lx.x} ${PT} V${L.H - 1}" style="stroke:var(--border);stroke-width:1.2"/>`;
        const ls = wrapT(l.t || '', 21);
        ls.forEach((ln, j) => { s += `<text x="${lx.x + lx.w / 2}" y="${PT + LHD / 2 + 4 + (j - (ls.length - 1) / 2) * 13}" text-anchor="middle" style="fill:var(--text-2);font:600 11.5px var(--f-body)">${esc(ln)}</text>`; });
        if (o.laneClick) s += `<rect data-lane="${esc(l.id)}" x="${lx.x}" y="${PT}" width="${lx.w}" height="${L.H - PT - 2}" style="fill:transparent;cursor:pointer"/>`;
      });
      s += `<path d="M${pl.x} ${PT + LHD} h${pl.w}" style="stroke:var(--border);stroke-width:1"/>`;
    });
    // потоки
    const labels = [], tops = [];
    m.flows.forEach((f, i) => {
      const A = anc(L, f.a, f.b), B = anc(L, f.b, f.a); if (!A || !B) return;
      const r = route(f, A, B), k = fst[i] || '', c = COLS[k] || COLS[''];
      const d = 'M' + r.pts.map(p => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L');
      if (f.msg) s += `<path d="${d}" style="fill:none;stroke:${k ? c : 'var(--text-2)'};stroke-width:${k === 'bad' ? 2.2 : 1.4};stroke-dasharray:6 4" marker-start="url(#${id}-ms)" marker-end="url(#${id}-mo)"/>`;
      else s += `<path d="${d}" style="fill:none;stroke:${c};stroke-width:${k === 'tok' ? 2.8 : k === 'done' ? 1.9 : k === 'bad' ? 2.4 : 1.5};stroke-linejoin:round;${k === 'done' ? 'opacity:.75;' : ''}" marker-end="url(#${id}-a${COLS[k] ? k : ''})"/>`;
      if (o.flowClick) s += `<path data-f="${i}" d="${d}" style="fill:none;stroke:transparent;stroke-width:14;cursor:pointer"/>`;
      if (f.t) labels.push(`<text x="${r.lab.x.toFixed(1)}" y="${r.lab.y.toFixed(1)}" text-anchor="${r.anchor || 'middle'}" style="fill:${k === 'tok' || k === 'bad' ? c : 'var(--text-2)'};font:600 11px var(--f-body);paint-order:stroke;stroke:var(--surface);stroke-width:3.5px;stroke-linejoin:round">${esc(f.t)}</text>`);
      const fm = fmarks[i] || fmarks[fid(f)];
      if (fm) { const mp = midOf(r.pts); [].concat(fm).forEach((b, j) => { tops.push(badge(mp.x + 12 + j * 21, mp.y - 2, b.t, b.k)); }); }
    });
    // узлы
    m.nodes.forEach(n => {
      const P = L.N[n.id], sv = st[n.id] || '';
      s += `<g data-n="${esc(n.id)}" style="${o.nodeClick ? 'cursor:pointer;' : ''}${sv === 'dim' ? 'opacity:.35' : ''}">`;
      if (n.k === 'task') {
        const fill = { cur: 'var(--accent-soft)', done: 'color-mix(in srgb, var(--accent) 8%, var(--surface))', bad: 'var(--bad-soft)', warn: 'var(--warn-soft)', ok: 'var(--ok-soft)' }[sv] || 'var(--surface)';
        const stroke = { cur: 'var(--accent)', done: 'color-mix(in srgb, var(--accent) 50%, var(--border-strong))', bad: 'var(--bad)', warn: 'var(--warn)', ok: 'var(--ok)', sel: 'var(--accent)' }[sv] || 'var(--border-strong)';
        s += `<rect x="${P.cx - P.w / 2}" y="${P.cy - P.h / 2}" width="${P.w}" height="${P.h}" rx="9" style="fill:${fill};stroke:${stroke};stroke-width:${sv && sv !== 'done' ? 2.3 : 1.3}${sv === 'sel' ? ';stroke-dasharray:5 3' : ''}"/>`;
        P.lines.forEach((ln, j) => { s += `<text x="${P.cx}" y="${P.cy + 4 + (j - (P.lines.length - 1) / 2) * 13}" text-anchor="middle" style="fill:var(--text);font:500 11.5px var(--f-body)">${esc(ln)}</text>`; });
        if (n.ico) s += `<text x="${P.cx + P.w / 2 - 3}" y="${P.cy - P.h / 2 + 12}" text-anchor="end" style="font-size:11px">${n.ico}</text>`;
      } else {
        s += shapeSvg(n.k, P.cx, P.cy, sv);
        if (sv === 'sel') s += `<circle cx="${P.cx}" cy="${P.cy}" r="${P.w / 2 + 5}" style="fill:none;stroke:var(--accent);stroke-width:1.6;stroke-dasharray:4 3"/>`;
        if (n.t) {
          const ls = wrapT(n.t, n.cpl || (isGw(n.k) ? 20 : 17)), lp = n.lp || 'r', lh = 12.5;
          const txt = (x, y, anc2) => ls.map((ln, j) => `<text x="${x}" y="${(y + j * lh).toFixed(1)}" text-anchor="${anc2}" style="fill:var(--text-2);font:500 11px var(--f-body);paint-order:stroke;stroke:var(--surface);stroke-width:3.5px;stroke-linejoin:round">${esc(ln)}</text>`).join('');
          if (lp === 'r') labels.push(txt(P.cx + P.w / 2 + 6, P.cy + 4 - (ls.length - 1) * lh / 2, 'start'));
          else if (lp === 'l') labels.push(txt(P.cx - P.w / 2 - 6, P.cy + 4 - (ls.length - 1) * lh / 2, 'end'));
          else if (lp === 'b') labels.push(txt(P.cx, P.cy + P.h / 2 + 13, 'middle'));
          else if (lp === 'tr') labels.push(txt(P.cx + 13, P.cy - P.h / 2 - 5 - (ls.length - 1) * lh, 'start'));
        }
      }
      s += '</g>';
    });
    s += labels.join('');
    // фишки (токены), ожидание на слиянии, значки-отметки
    Object.keys(tok).forEach(nid => {
      const P = L.N[nid]; if (!P || !tok[nid]) return;
      const x = P.cx + P.w / 2 - (P.n.k === 'task' ? 4 : 1), y = P.cy - P.h / 2 + (P.n.k === 'task' ? 4 : 1);
      s += `<circle class="pr-glow" cx="${x}" cy="${y}" r="12" style="fill:var(--accent);opacity:.28"/><circle cx="${x}" cy="${y}" r="8" style="fill:var(--accent);stroke:var(--surface);stroke-width:2"/>`;
      if (tok[nid] > 1) s += `<text x="${x}" y="${y + 3.5}" text-anchor="middle" style="fill:var(--accent-text);font:700 10px var(--f-mono)">${tok[nid]}</text>`;
    });
    Object.keys(wait).forEach(nid => {
      const P = L.N[nid]; if (!P || !wait[nid]) return;
      const x = P.cx - P.w / 2 - 8, y = P.cy - P.h / 2 - 2;
      s += `<rect x="${x - 17}" y="${y - 9}" width="34" height="17" rx="8" style="fill:var(--surface);stroke:var(--accent);stroke-width:1.4;stroke-dasharray:3 2"/><text x="${x}" y="${y + 3.5}" text-anchor="middle" style="fill:var(--accent);font:700 10px var(--f-mono)">${esc(wait[nid])}</text>`;
    });
    Object.keys(marks).forEach(nid => {
      const P = L.N[nid]; if (!P) return;
      [].concat(marks[nid]).forEach((b, j) => { s += badge(P.cx - P.w / 2 + 2 + j * 21, P.cy - P.h / 2 + 1, b.t, b.k); });
    });
    s += tops.join('');
    return s + '</svg>';
  }

  // =====================================================================
  // Движок токена: фишка бежит по потокам управления; шлюзы выбирают ветки по условиям среды env.
  // =====================================================================
  function simulate(m, env, max) {
    const N = {}; m.nodes.forEach(n => { N[n.id] = n; });
    const laneT = id => { const l = m.lanes.find(x => x.id === id); return l ? l.t : ''; };
    const seq = m.flows.map((f, i) => Object.assign({ i }, f)).filter(f => !f.msg && N[f.a] && N[f.b]);
    const outs = id => seq.filter(f => f.a === id), ins = id => seq.filter(f => f.b === id);
    const isJoin = id => (N[id].k === 'and' || N[id].k === 'or') && ins(id).length > 1;
    const nm = n => n.t ? `«${n.t}»` : '';
    let pos = {}, status = m.status0 || '', end = null;
    const hold = {}, arr = {}, orN = {}, exec = {}, order = [], visited = {}, frames = [];
    m.nodes.filter(n => n.k === 'start' || n.k === 'msgstart').forEach(n => { pos[n.id] = 1; visited[n.id] = 1; });
    const snap = (log, fired) => frames.push({ pos: Object.assign({}, pos), arr: Object.assign({}, arr), log, fired: fired || [], status, visited: Object.assign({}, visited) });
    const first = m.nodes.find(n => n.k === 'start' || n.k === 'msgstart');
    snap([first ? `● Начало: ${nm(first)}. Токен на старте.` : '✋ На схеме нет начального события.'], []);
    if (!first) return { frames, end: { kind: 'stuck' }, exec, order };
    const dflt = n => {
      if (n.k === 'task') return `▸ ${laneT(n.lane)}: ${nm(n)}`;
      if (n.k === 'timer') return `⏰ Таймер ${nm(n)} сработал.`;
      if (n.k === 'msg') return `✉ Отправлено сообщение ${nm(n)}.`;
      if (n.k === 'msgc') return `✉ Пришло сообщение ${nm(n)}.`;
      if (n.k === 'start' || n.k === 'msgstart') return `● ${nm(n)}`;
      return null;
    };
    for (let step = 0; step < (max || 44) && !end; step++) {
      const np = {}, log = [], fired = [];
      let moved = false;
      const put = id => { np[id] = (np[id] || 0) + 1; };
      const arrive = f => {
        fired.push(f.i); moved = true;
        if (f.st) status = f.st;
        const b = N[f.b]; visited[b.id] = 1;
        if (isJoin(b.id)) { arr[b.id] = (arr[b.id] || 0) + 1; return; }
        if (b.stIn) status = b.stIn;
        if (b.k === 'timer') hold[b.id] = b.wait || 1;
        else if (b.dur > 1) hold[b.id] = b.dur - 1;
        put(b.id);
      };
      for (const id of Object.keys(pos)) {
        const n = N[id];
        for (let c = pos[id]; c > 0; c--) {
          if (hold[id] > 0) {
            hold[id]--; put(id); moved = true;
            const w = n.k === 'timer' ? `⏳ Таймер ${nm(n)}: процесс ждёт.` : `⏳ ${nm(n)}: работа идёт…`;
            if (!log.includes(w)) log.push(w);
            continue;
          }
          exec[id] = (exec[id] || 0) + 1; order.push(id);
          if (n.st) status = n.st;
          const os = outs(id), line = typeof n.log === 'function' ? n.log(env) : n.log;
          if (n.k === 'end' || n.k === 'msgend') { log.push(line || `■ Конец: ${nm(n)}.`); moved = true; continue; }
          if (n.k === 'slot') { log.push('✋ Пустое место на схеме: токену некуда идти.'); end = { kind: 'stuck', at: id }; put(id); continue; }
          if (n.k === 'xor' && os.length > 1) {
            if (!os.some(f => f.c)) { log.push(`✋ Шлюз ${nm(n) || '«или — или»'} без условий на стрелках: токен не знает, какую ветку выбрать.`); end = { kind: 'stuck', at: id }; put(id); continue; }
            const pick = os.find(f => f.c && f.c(env)) || os.find(f => !f.c);
            if (!pick) { log.push(`✋ Шлюз ${nm(n)}: ни одно условие не выполнилось — токену некуда идти.`); end = { kind: 'stuck', at: id }; put(id); continue; }
            log.push(line || `◆ Шлюз «или — или» ${nm(n)}: ветка ${pick.t ? '«' + pick.t + '»' : 'по умолчанию'}, остальные закрыты.`);
            arrive(pick); continue;
          }
          if (n.k === 'and' && os.length > 1) { log.push(line || `✚ Параллельный шлюз «и»: ${os.length} ${TR.plural(os.length, 'ветка пошла', 'ветки пошли', 'веток пошли')} одновременно.`); os.forEach(arrive); continue; }
          if (n.k === 'or' && os.length > 1) {
            const sel = os.filter(f => !f.c || f.c(env));
            if (!sel.length) { log.push(`✋ Включающий шлюз ${nm(n)}: ни одно условие не выполнилось.`); end = { kind: 'stuck', at: id }; put(id); continue; }
            orN[id] = sel.length;
            log.push(line || `◯ Включающий шлюз «и/или»${n.t ? ' ' + nm(n) : ''}: ${sel.map(f => '«' + (f.t || '…') + '»').join(' и ')}.`);
            sel.forEach(arrive); continue;
          }
          if (!os.length) { log.push(`✋ На ${nm(n) || 'этом элементе'} процесс обрывается: стрелки дальше нет и конца нет.`); end = { kind: 'stuck', at: id }; put(id); continue; }
          if (n.k === 'task' && exec[id] > 1) log.push(`⚠ ${laneT(n.lane)}: ${nm(n)} — второй раз!`);
          else { const t = line || dflt(n); if (t) log.push(t); }
          os.forEach(arrive);
        }
      }
      for (const id of Object.keys(arr)) {
        const n = N[id], need = n.k === 'and' ? ins(id).length : (n.pair && orN[n.pair] != null ? orN[n.pair] : ins(id).length);
        if (arr[id] >= need && need > 0) { arr[id] -= need; put(id); moved = true; log.push(`${n.k === 'and' ? '✚' : '◯'} Слияние дождалось ${need === 1 ? 'единственной ветки' : 'всех веток (' + need + ')'} — дальше идёт один токен.`); }
      }
      pos = np;
      snap(log, fired);
      if (end) break;
      const live = Object.keys(pos).length, waiting = Object.keys(arr).filter(k => arr[k] > 0);
      if (!live && waiting.length) { end = { kind: 'deadlock', at: waiting[0] }; frames[frames.length - 1].log.push(`✋ Слияние ждёт ветку, которая никогда не придёт. Процесс завис.`); break; }
      if (!live) { end = { kind: 'done' }; break; }
      if (!moved) { end = { kind: 'stuck' }; break; }
    }
    if (!end) end = { kind: 'loop' };
    return { frames, end, exec, order };
  }
  function waitOf(m, f) {
    const w = {};
    Object.keys(f.arr || {}).forEach(id => { if (f.arr[id] > 0) { const n = m.flows.filter(x => x.b === id && !x.msg).length; w[id] = `${f.arr[id]}/${n}`; } });
    return w;
  }
  // Проигрыватель: кнопки, схема с фишкой, журнал и «шапка» справа
  function player(host, cfg) {
    let res = null, k = 0, timer = null, ended = false;
    host.innerHTML = `<div class="stack tight">
      <div class="pr-ctl"><button type="button" class="btn sm primary" data-pl="play">▶ Пустить токен</button><button type="button" class="btn sm" data-pl="step">Шаг →</button><button type="button" class="btn sm ghost" data-pl="reset">⟲ Сначала</button><button type="button" class="btn sm ghost" data-pl="all">В конец</button><span class="small dim tnum" data-pl-n></span></div>
      <div class="pr-run"><div class="board pr-dg" data-pl-svg></div><div class="stack tight" data-pl-side></div></div></div>`;
    const svgEl = TR.$('[data-pl-svg]', host), side = TR.$('[data-pl-side]', host), nEl = TR.$('[data-pl-n]', host);
    function compute() { res = simulate(cfg.model(), cfg.env()); k = 0; ended = false; }
    function stop() { clearInterval(timer); timer = null; const b = TR.$('[data-pl="play"]', host); if (b) b.textContent = '▶ Пустить токен'; }
    function draw() {
      const m = cfg.model(), f = res.frames[k], last = k === res.frames.length - 1;
      const st = {}, fst = {};
      Object.keys(f.visited).forEach(id => { st[id] = 'done'; });
      for (let j = 1; j <= k; j++) res.frames[j].fired.forEach(i => { fst[i] = 'done'; });
      f.fired.forEach(i => { fst[i] = 'tok'; });
      Object.keys(f.pos).forEach(id => { st[id] = 'cur'; });
      if (last && res.end.at) st[res.end.at] = 'bad';
      const extra = cfg.svg ? cfg.svg(f, last, res) : {};
      svgEl.innerHTML = bSvg(m, Object.assign({ st, fst, tok: f.pos, wait: waitOf(m, f) }, extra));
      const logs = [];
      for (let j = 0; j <= k; j++) res.frames[j].log.forEach(t => logs.push({ t, j }));
      side.innerHTML = (cfg.head ? cfg.head(f, last, res) : '') + `<div class="pr-lbl">Журнал токена</div><div class="pr-log">${logs.map(x => `<div class="${x.j === k ? 'cur' : ''} ${/^✋/.test(x.t) ? 'bad' : /^⚠/.test(x.t) ? 'warn' : ''}">${esc(x.t)}</div>`).join('')}</div>` + (last && cfg.foot ? cfg.foot(res) : '');
      const lg = TR.$('.pr-log', side); if (lg) lg.scrollTop = lg.scrollHeight;
      nEl.textContent = `шаг ${k} из ${res.frames.length - 1}`;
      if (last && !ended) { ended = true; cfg.onEnd && cfg.onEnd(res); }
    }
    function tick() {
      if (!host.isConnected) { stop(); return; }
      if (k >= res.frames.length - 1) { stop(); return; }
      k++; draw();
      if (k >= res.frames.length - 1) stop();
    }
    TR.on(host, 'click', '[data-pl]', (e, b) => {
      const a = b.dataset.pl;
      if (a === 'play') {
        if (timer) { stop(); return; }
        if (k >= res.frames.length - 1) { k = 0; ended = false; draw(); }
        b.textContent = '⏸ Пауза'; timer = setInterval(tick, cfg.speed || 750);
      }
      if (a === 'step') { stop(); tick(); }
      if (a === 'reset') { stop(); k = 0; ended = false; draw(); }
      if (a === 'all') { stop(); k = res.frames.length - 1; draw(); }
    });
    compute(); draw();
    return { rebuild() { stop(); compute(); draw(); }, stop, get res() { return res; } };
  }

  // =====================================================================
  // Теория 1. Зачем рисовать процесс: линзы, AS-IS ↔ TO-BE, честный AS-IS (соседний пример — возврат обуви в «Шаге»)
  // =====================================================================
  const SHOP_POOLS = [{ id: 'cust', t: 'Покупатель', black: true }, { id: 'shop', t: 'Магазин обуви «Шаг»' }];
  const RET_ASIS = {
    title: 'Возврат обуви «как есть»', pools: SHOP_POOLS,
    lanes: [{ id: 'sl', t: 'Продавец' }, { id: 'sr', t: 'Старший продавец' }, { id: 'ac', t: 'Бухгалтерия' }, { id: 'sy', t: 'Система магазина' }],
    nodes: [
      { id: 'n0', k: 'msgstart', t: 'Покупатель принёс пару и чек', lane: 'sl', row: 0 },
      { id: 'n1', k: 'task', t: 'Заполнить бумажное заявление', lane: 'sl', row: 1, ico: '📄' },
      { id: 'n2', k: 'task', t: 'Позвонить старшему продавцу', lane: 'sl', row: 2, ico: '☎' },
      { id: 'n3', k: 'task', t: 'Прийти из другого зала, осмотреть пару', lane: 'sr', row: 3 },
      { id: 'n4', k: 'task', t: 'Подписать заявление', lane: 'sr', row: 4, ico: '📄' },
      { id: 'n5', k: 'task', t: 'Отнести заявление в бухгалтерию на другой этаж', lane: 'sl', row: 5, ico: '📄' },
      { id: 'n6', k: 'task', t: 'Раз в неделю вернуть деньги по заявлениям', lane: 'ac', row: 6 },
      { id: 'n7', k: 'msgend', t: 'Деньги ушли на карту', lane: 'ac', row: 7 }
    ],
    flows: [{ a: 'P:cust', b: 'n0', msg: true, t: 'пара и чек' }, { a: 'n0', b: 'n1' }, { a: 'n1', b: 'n2' }, { a: 'n2', b: 'n3' }, { a: 'n3', b: 'n4' }, { a: 'n4', b: 'n5' }, { a: 'n5', b: 'n6' }, { a: 'n6', b: 'n7' }, { a: 'n7', b: 'P:cust', msg: true, t: 'деньги' }]
  };
  const RET_TOBE = {
    title: 'Возврат обуви «как будет»', pools: SHOP_POOLS, lanes: RET_ASIS.lanes,
    nodes: [
      { id: 'm0', k: 'msgstart', t: 'Покупатель принёс пару и чек', lane: 'sl', row: 0 },
      { id: 'm1', k: 'task', t: 'Отсканировать чек, осмотреть пару', lane: 'sl', row: 1 },
      { id: 'm2', k: 'xor', t: 'Не больше 14 дней и пару не носили?', lane: 'sy', row: 2, lp: 'tr', cpl: 16 },
      { id: 'm3', k: 'msgend', t: 'Отказ: предложили обмен', lane: 'sl', row: 2, lp: 'b' },
      { id: 'm4', k: 'task', t: 'Вернуть деньги на карту через терминал', lane: 'sy', row: 3 },
      { id: 'm5', k: 'msg', t: 'SMS: деньги вернули', lane: 'sy', row: 4, lp: 'l' },
      { id: 'm6', k: 'end', t: 'Возврат оформлен', lane: 'sy', row: 5, lp: 'l' }
    ],
    flows: [{ a: 'P:cust', b: 'm0', msg: true, t: 'пара и чек' }, { a: 'm0', b: 'm1' }, { a: 'm1', b: 'm2', via: 'g' }, { a: 'm2', b: 'm3', t: 'нет' }, { a: 'm2', b: 'm4', t: 'да' }, { a: 'm4', b: 'm5' }, { a: 'm5', b: 'm6' }, { a: 'm3', b: 'P:cust', msg: true, t: 'отказ' }, { a: 'm5', b: 'P:cust', msg: true, t: 'SMS' }],
    rh: { 2: 92 }
  };
  const LENS = [
    { v: 'lost', t: '🕳 Где теряется', k: 'bad', items: [
      { n: 'n1', t: 'Данные чека переписывают в заявление руками — опечатка в номере карты, и деньги уходят не туда.' },
      { n: 'n5', t: 'Бумага едет между этажами: заявление кладут «на стол бухгалтеру» — и оно теряется.' },
      { n: 'n7', t: 'Покупатель не знает, что с возвратом, и звонит: «Где мои деньги?»' }] },
    { v: 'wait', t: '⏳ Где ждут', k: 'warn', items: [
      { n: 'n3', t: 'Старший продавец в другом зале — покупатель стоит у кассы 10–15 минут.' },
      { n: 'n6', t: 'Бухгалтерия возвращает деньги раз в неделю — покупатель ждёт до 7 дней.' }] },
    { v: 'agree', t: '🤝 О чём договориться', k: 'info', items: [
      { n: 'n3', t: 'Кто решает, что пару не носили, — продавец или старший? Сейчас решают оба, и каждый думает, что другой.' },
      { n: 'n4', t: 'Бухгалтерии нужна подпись старшего, продавцу кажется, что хватит чека. Это правило надо записать, а не угадывать.' }] },
    { v: 'auto', t: '⚙ Что отдать системе', k: 'ok', items: [
      { n: 'n1', t: 'Заявление — электронное: данные подтягиваются из чека по штрихкоду.' },
      { n: 'n5', t: 'Передачу между людьми делает система: никто не носит бумагу.' },
      { n: 'n6', t: 'Деньги — на карту сразу, через тот же терминал, а не пачкой раз в неделю.' },
      { n: 'n7', t: 'Покупателю — SMS: возврат оформлен.' }] }
  ];
  function drawLens(pane) {
    let cur = 'lost';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Соседний пример — возврат обуви в магазине «Шаг». Так возврат идёт <b>сейчас</b>: схема собрана со слов продавцов и после часа у кассы. Пул слева — покупатель «чёрным ящиком»: что у него внутри, нам не важно, важно, что он приносит и получает. Переключайте линзы — одна и та же схема отвечает на разные вопросы.</p>
      <div class="row">${ui.seg('lens', LENS.map(l => ({ v: l.v, t: l.t })), cur, 'accent')}</div>
      <div class="pr-two wide"><div class="board pr-dg" data-dg></div><div class="stack tight"><div data-kpi></div><div class="pr-find" data-fd></div><div data-nt></div></div></div></div>`;
    function draw() {
      const L = LENS.find(x => x.v === cur), marks = {}, st = {};
      L.items.forEach((it, i) => { (marks[it.n] = marks[it.n] || []).push({ t: String(i + 1), k: L.k === 'info' ? 'info' : L.k }); st[it.n] = L.k === 'info' ? 'sel' : L.k; });
      TR.$('[data-dg]', pane).innerHTML = bSvg(RET_ASIS, { marks, st });
      TR.$('[data-kpi]', pane).innerHTML = `<div class="pr-kpi">${chip('передач из рук в руки: 3', 'warn')}${chip('бумажных шагов: 3', 'warn')}${chip('ожидание: до 7 дней', 'bad')}</div>`;
      TR.$('[data-fd]', pane).innerHTML = L.items.map((it, i) => `<div class="pr-fi ${L.k === 'info' ? 'info' : L.k}"><span class="n">${i + 1}</span><span>${esc(it.t)}</span></div>`).join('');
      TR.$('[data-nt]', pane).innerHTML = cur === 'auto'
        ? ui.note('info', 'Что здесь делает аналитик', 'Собирает схему с теми, кто делает работу (продавцы, старший, бухгалтер), сверяет её с тем, что видел своими глазами, и договаривается о ней с владельцем процесса. Артефакты: схема «как есть», схема «как будет», таблица разрывов.')
        : ui.note('', 'Зачем схема, если можно рассказать словами', 'В рассказе «ну, оформляем возврат» не видно ни передач, ни ожидания. На схеме каждая стрелка между дорожками — передача из рук в руки, а значит, место, где можно потерять, подождать или поспорить.');
    }
    ui.onSeg(pane, (n, v) => { cur = v; draw(); });
    draw();
  }
  function drawCompare(pane) {
    let mode = 'asis';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Тот же возврат «как будет». Дорожка «Система магазина» в схеме «как есть» пуста: системы в процессе просто нет. Переключайте и смотрите, что исчезло, что появилось и как изменились цифры.</p>
      <div class="row">${ui.seg('m', [{ v: 'asis', t: 'Как есть (AS-IS)' }, { v: 'tobe', t: 'Как будет (TO-BE)' }], mode, 'accent')}</div>
      <div class="pr-two wide"><div class="board pr-dg" data-dg></div><div class="stack tight" data-sd></div></div></div>`;
    function draw() {
      const tobe = mode === 'tobe';
      TR.$('[data-dg]', pane).innerHTML = bSvg(tobe ? RET_TOBE : RET_ASIS, tobe ? { st: { m2: 'ok', m4: 'ok', m5: 'ok' }, laneHl: {} } : {});
      TR.$('[data-sd]', pane).innerHTML = `<div class="pr-kpi">${tobe ? chip('передач из рук в руки: 0', 'ok') + chip('бумажных шагов: 0', 'ok') + chip('ожидание: минуты', 'ok') : chip('передач из рук в руки: 3', 'warn') + chip('бумажных шагов: 3', 'warn') + chip('ожидание: до 7 дней', 'bad')}</div>
        <div class="pr-lbl">${tobe ? 'Что изменилось' : 'Что болит'}</div>
        ${tobe ? `<div class="pr-diff">
          <div class="minus"><b>−</b> Бумажное заявление и поход в бухгалтерию</div>
          <div class="minus"><b>−</b> Старший продавец в каждом возврате <span class="small muted">(теперь — только в спорных случаях: это правило магазина)</span></div>
          <div class="plus"><b>+</b> Система сама проверяет 14 дней по чеку</div>
          <div class="plus"><b>+</b> Деньги — сразу через терминал</div>
          <div class="plus"><b>+</b> SMS покупателю</div></div>
          ${ui.note('ok', 'Разница — это и есть разрывы', 'Каждая строка «−» и «+» — разрыв между «как есть» и «как будет». Из разрывов вырастают требования к системе. Но не все: «старший — только в спорных случаях» меняет правило магазина, а не программу.')}`
        : `<ol class="pr-ol"><li>Покупатель ждёт старшего 10–15 минут.</li><li>Заявление теряется между этажами.</li><li>Деньги — раз в неделю.</li><li>Никто не знает, где возврат сейчас.</li></ol>${ui.note('info', 'AS-IS и TO-BE', '<b>AS-IS</b> («как есть») — модель текущего процесса со всеми обходными путями. <b>TO-BE</b> («как будет») — целевой процесс. Сначала честно рисуют первое, потом второе, а не наоборот: иначе автоматизируют то, чего нет.')}`}`;
    }
    ui.onSeg(pane, (n, v) => { mode = v; draw(); });
    draw();
  }
  const HONEST = {
    reg: { t: 'Как в регламенте', steps: ['Продавец принимает пару и чек', 'Старший продавец осматривает пару', 'Старший подписывает заявление', 'Продавец передаёт заявление в бухгалтерию'], note: 'Так написано в инструкции магазина. Схема аккуратная — и почти ничего не говорит о том, что болит.' },
    real: { t: 'Как на самом деле', steps: ['Продавец принимает пару и чек', 'Звонит старшему: «Тут возврат, нормальная пара»', 'Старший отвечает «оформляй», не глядя', 'Вечером подписывает пачку заявлений', 'Заявления копятся у кассы до пятницы'], bad: [1, 2, 3, 4], note: 'Так увидели за час у кассы. Осмотра нет, подпись — формальность, заявления копятся. Именно это и надо менять.' }
  };
  function drawHonest(pane) {
    let mode = 'reg';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Схему «как есть» рисуют по жизни, а не по инструкции. Сравните два рассказа о возврате в «Шаге».</p>
      <div class="row">${ui.seg('h', [{ v: 'reg', t: '📘 Как в регламенте' }, { v: 'real', t: '👀 Как на самом деле' }], mode, 'accent')}</div><div data-h></div></div>`;
    function draw() {
      const h = HONEST[mode];
      TR.$('[data-h]', pane).innerHTML = `<div class="pr-chain">${h.steps.map((s, i) => `${i ? '<i>→</i>' : ''}<span class="${h.bad && h.bad.includes(i) ? 'bad' : ''}">${esc(s)}</span>`).join('')}</div>
        ${ui.note(mode === 'real' ? 'warn' : '', h.t, esc(h.note))}
        ${mode === 'real' ? ui.note('info', 'Что потеряете, если нарисуете регламент', 'Схема «как будет» автоматизирует осмотр, которого никто не делает, а настоящая беда — пачка заявлений до пятницы — останется. Поэтому аналитик сверяет рассказы с наблюдением: так вы делали на Покровке в неделе 3.') : ''}`;
    }
    ui.onSeg(pane, (n, v) => { mode = v; draw(); });
    draw();
  }
  const howWhy = {
    id: 'how-why', covers: ['asis', 'gaps'], title: 'Как это работает: зачем рисовать процесс', free: true, noReset: true,
    simple: {
      icon: '🗺️',
      plain: 'Процесс — кто, что и в каком порядке делает, чтобы получить результат. Нарисованный процесс показывает то, чего не слышно в рассказе: где дело передают из рук в руки, где ждут и где теряют.',
      analogy: 'Банкет в кафе. Пока план у шеф-повара в голове, «всё под контролем». Нарисовали на доске — и видно, что торт и горячее ждут одну духовку, а официант узнаёт о заказе последним.',
      tech: '<b>Модель бизнес-процесса</b> — последовательность действий участников (дорожки), решений (шлюзы) и событий. <b>AS-IS</b> («как есть») — текущее состояние, <b>TO-BE</b> («как будет») — целевое; разница между ними — <b>разрывы</b> (gap), из которых вырастают требования. BABOK v3: задачи «Анализ текущего состояния» и «Определение будущего состояния», техника «Моделирование процессов».'
    },
    lead: ui.brief({
      situation: 'Сегодня — процессы. Соседний пример — возврат обуви в магазине «Шаг»: короткий, понятный и с теми же бедами, что у тортов «Колоса». «Колос» — в практике.',
      todo: [
        'Вкладка «Четыре линзы»: переключайте линзы и смотрите, что одна и та же схема говорит о потерях, ожидании, спорах и автоматизации.',
        'Вкладка «Как есть → как будет»: переключите AS-IS и TO-BE и сравните цифры и список изменений.',
        'Вкладка «Честный AS-IS»: сравните регламент и жизнь.'
      ],
      look: 'Номера на схеме совпадают с находками справа. Конверт в кружке — сообщение от другого участника, толстый круг — конец процесса.'
    }),
    render(el) {
      el.classList.add('pr-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'lens', t: 'Четыре линзы', render: fresh(drawLens) },
        { id: 'cmp', t: 'Как есть → как будет', render: fresh(drawCompare) },
        { id: 'hon', t: 'Честный AS-IS', render: fresh(drawHonest) }
      ], 'lens');
    }
  };

  // =====================================================================
  // Теория 2. Азбука BPMN, шлюзы на заказе в кафе, бегущий токен по возврату обуви
  // =====================================================================
  const ABC = [
    { id: 'start', t: 'Начальное событие', en: 'start event', what: 'С чего начинается процесс: пришёл покупатель, наступило 23:00, пришло письмо.', an: 'Звонок в дверь кухни: пришёл заказ.', rule: 'Одно понятное начало. В названии — что случилось («Покупатель принёс пару»), а не слово «Начало». Тонкий круг; конверт внутри — процесс начинается с сообщения.' },
    { id: 'end', t: 'Конечное событие', en: 'end event', what: 'Чем закончился процесс. Концов бывает несколько: «Возврат оформлен», «Отказано».', an: 'Блюдо отдали гостю — или гость ушёл, не дождавшись.', rule: 'Каждая ветка заканчивается концом, иначе непонятно, чем всё кончилось. Толстый круг.' },
    { id: 'timer', t: 'Таймер', en: 'timer intermediate event', what: 'Процесс ждёт времени: до 21:00, за день до выдачи, через 30 минут.', an: 'Тесто на расстойке: ничего не делаем, ждём 40 минут.', rule: 'Таймер — ожидание, а не действие. Подпишите, чего ждём. Двойной круг с часами.' },
    { id: 'msg', t: 'Сообщение', en: 'message intermediate event', what: 'Процесс получает или отправляет сообщение: SMS, письмо, ответ банка.', an: 'Звонок поставщика: «Мука приехала».', rule: 'Светлый конверт — ждём сообщение, тёмный — отправляем. Двойной круг.' },
    { id: 'task', t: 'Задача', en: 'task', what: 'Одно действие одного исполнителя.', an: 'Замесить тесто.', rule: 'Название — «глагол + что»: «Проверить чек», а не «Проверка» и не «Чек». Скруглённый прямоугольник.' },
    { id: 'xor', t: 'Шлюз «или — или»', en: 'exclusive gateway, XOR', what: 'Развилка: токен идёт ровно по одной ветке — той, чьё условие выполнилось.', an: 'Бизнес-ланч: суп или салат, что-то одно.', rule: 'На каждой исходящей стрелке — условие («да» / «нет», «до 14 дней» / «больше»). Ромб с крестом.' },
    { id: 'and', t: 'Шлюз «и»', en: 'parallel gateway, AND', what: 'Все ветки запускаются одновременно; слияние ждёт, пока придут все.', an: 'Пока печётся корж, варим крем; собираем торт, когда готово и то и другое.', rule: 'Условий нет. Что разделили «и», сливают тоже «и». Ромб с плюсом.' },
    { id: 'or', t: 'Шлюз «и/или»', en: 'inclusive gateway, OR', what: 'Запускаются все ветки, чьи условия верны: одна, две или все.', an: 'К кофе — сироп и/или корица, как попросит гость.', rule: 'Используют реже: схему с ним труднее читать. Слияние — тоже «и/или». Ромб с кругом.' },
    { id: 'lane', t: 'Дорожка', en: 'lane', what: 'Полоса исполнителя: роль, отдел или система. Всё, что в ней, делает он.', an: 'Зоны кухни: горячий цех, кондитерский, раздача.', rule: 'Дорожка — роль, а не имя: «Кассир», а не «Света».' },
    { id: 'pool', t: 'Пул', en: 'pool', what: 'Отдельный участник со своим процессом: компания, покупатель, банк. Внутри пула — дорожки.', an: 'Кафе и поставщик муки: у каждого своя кухня, рецепты друг друга они не видят.', rule: 'Если внутренности участника не важны, рисуют свёрнутый пул — «чёрный ящик».' },
    { id: 'seq', t: 'Поток управления', en: 'sequence flow', what: 'Сплошная стрелка: что за чем идёт внутри одного пула.', an: 'Порядок в рецепте: замесить → раскатать → выпечь.', rule: 'Не пересекает границу пула.' },
    { id: 'msgf', t: 'Поток сообщений', en: 'message flow', what: 'Пунктир с кружком: обмен между пулами — письмо, звонок, деньги.', an: 'Записка поставщику: «Привезите ещё два мешка».', rule: 'Только между пулами; внутри пула — сплошная стрелка.' }
  ];
  function abcIcon(id) {
    const W = 60, H = 38, cx = 30, cy = 19;
    let s = `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true">`;
    if (id === 'start') s += shapeSvg('start', cx, cy);
    else if (id === 'end') s += shapeSvg('end', cx, cy);
    else if (id === 'timer') s += shapeSvg('timer', cx, cy);
    else if (id === 'msg') s += shapeSvg('msg', cx, cy);
    else if (id === 'task') s += `<rect x="6" y="7" width="48" height="24" rx="6" style="fill:var(--surface);stroke:var(--border-strong);stroke-width:1.4"/><path d="M14 19 h32" style="stroke:var(--text-muted);stroke-width:2;stroke-linecap:round"/>`;
    else if (id === 'xor' || id === 'and' || id === 'or') s += shapeSvg(id, cx, cy);
    else if (id === 'lane') s += `<rect x="4" y="3" width="52" height="32" rx="4" style="fill:var(--surface);stroke:var(--border-strong)"/><path d="M22 3 V35 M40 3 V35" style="stroke:var(--border-strong)"/><path d="M4 11 H56" style="stroke:var(--border)"/>`;
    else if (id === 'pool') s += `<rect x="4" y="3" width="52" height="32" rx="4" style="fill:var(--surface);stroke:var(--text-2);stroke-width:1.6"/><path d="M4 11 H56" style="stroke:var(--text-2)"/>`;
    else if (id === 'seq') s += `<path d="M8 19 H48" style="stroke:var(--text-2);stroke-width:1.8"/><path d="M46 14 L54 19 L46 24 z" style="fill:var(--text-2)"/>`;
    else if (id === 'msgf') s += `<circle cx="10" cy="19" r="3.5" style="fill:var(--surface);stroke:var(--text-2);stroke-width:1.4"/><path d="M14 19 H46" style="stroke:var(--text-2);stroke-width:1.5;stroke-dasharray:5 3"/><path d="M46 14 L54 19 L46 24 z" style="fill:var(--surface);stroke:var(--text-2);stroke-width:1.3"/>`;
    return s + '</svg>';
  }
  function drawAbc(pane) {
    let cur = 'task';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">BPMN 2.0 (Business Process Model and Notation — нотация моделирования бизнес-процессов) — стандарт: одни и те же значки читают аналитик, заказчик и разработчик. Для большинства схем хватает этих двенадцати. Нажмите на значок.</p>
      <div class="pr-abc" data-abc></div><div data-card></div></div>`;
    function draw() {
      TR.$('[data-abc]', pane).innerHTML = ABC.map(a => `<button type="button" class="pr-el" data-el="${a.id}" aria-pressed="${a.id === cur}">${abcIcon(a.id)}<span>${esc(a.t)}</span></button>`).join('');
      const a = ABC.find(x => x.id === cur);
      TR.$('[data-card]', pane).innerHTML = `<div class="pr-card"><h4>${esc(a.t)} <span class="small muted">· ${esc(a.en)}</span></h4><div class="pr-kv"><b>Что это</b><span>${esc(a.what)}</span><b>На кухне</b><span>${esc(a.an)}</span><b>Правило</b><span>${esc(a.rule)}</span></div></div>`;
    }
    TR.on(pane, 'click', '[data-el]', (e, b) => { cur = b.dataset.el; draw(); });
    draw();
  }
  const CAFE_ITEMS = [{ v: 'c', t: '☕ кофе' }, { v: 's', t: '🥪 сэндвич' }, { v: 'd', t: '🍰 десерт' }];
  function cafeModel(split, join) {
    const lab = split !== 'and';
    return {
      title: 'Заказ в кафе', pools: [{ id: 'cafe', t: 'Кафе' }],
      lanes: [{ id: 'ba', t: 'Бариста' }, { id: 'ki', t: 'Кухня' }, { id: 'pa', t: 'Витрина десертов' }],
      nodes: [
        { id: 'k0', k: 'start', t: 'Гость сделал заказ', lane: 'ki', row: 0 },
        { id: 'k1', k: split, t: lab ? 'Что заказал гость?' : '', lane: 'ki', row: 1, lp: 'tr', cpl: 13 },
        { id: 'k2', k: 'task', t: 'Сварить кофе', lane: 'ba', row: 2 },
        { id: 'k3', k: 'task', t: 'Собрать сэндвич', lane: 'ki', row: 2, dur: 2 },
        { id: 'k4', k: 'task', t: 'Положить десерт', lane: 'pa', row: 2 },
        { id: 'k5', k: join, t: '', lane: 'ki', row: 3, pair: 'k1' },
        { id: 'k6', k: 'task', t: 'Подать заказ на подносе', lane: 'ki', row: 4 },
        { id: 'k7', k: 'end', t: 'Гость получил заказ', lane: 'ki', row: 5 }
      ],
      flows: [
        { a: 'k0', b: 'k1' },
        Object.assign({ a: 'k1', b: 'k2' }, lab ? { t: 'кофе', c: e => e.c } : {}),
        Object.assign({ a: 'k1', b: 'k3' }, lab ? { t: 'сэндвич', c: e => e.s } : {}),
        Object.assign({ a: 'k1', b: 'k4' }, lab ? { t: 'десерт', c: e => e.d } : {}),
        { a: 'k2', b: 'k5' }, { a: 'k3', b: 'k5' }, { a: 'k4', b: 'k5' }, { a: 'k5', b: 'k6' }, { a: 'k6', b: 'k7' }
      ]
    };
  }
  const GW_NAME = { xor: '«или — или»', and: '«и»', or: '«и/или»' };
  function drawGw(pane) {
    const S = { split: 'xor', join: 'xor', c: true, s: false, d: true };
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Соседний пример — кафе. Гость заказывает кофе, сэндвич и десерт в любом сочетании. Выберите, что он заказал, какой шлюз делит заказ на ветки и какой собирает поднос. Пустите токен и посмотрите, что гость получит.</p>
      <div class="stack tight">
        <div class="row"><span class="pr-lbl">Гость заказал</span>${CAFE_ITEMS.map(x => `<label class="toggle"><input type="checkbox" data-it="${x.v}" ${S[x.v] ? 'checked' : ''}> <span>${x.t}</span></label>`).join('')}</div>
        <div class="row"><span class="pr-lbl">Делим</span>${ui.seg('split', [{ v: 'xor', t: '◆ или — или' }, { v: 'and', t: '✚ и' }, { v: 'or', t: '◯ и/или' }], S.split, 'accent')}</div>
        <div class="row"><span class="pr-lbl">Собираем</span>${ui.seg('join', [{ v: 'xor', t: '◆ или — или' }, { v: 'and', t: '✚ и' }, { v: 'or', t: '◯ и/или' }], S.join, 'accent')}</div>
      </div><div data-pl></div></div>`;
    const env = () => ({ c: S.c, s: S.s, d: S.d });
    const p = player(TR.$('[data-pl]', pane), {
      model: () => cafeModel(S.split, S.join), env, speed: 700,
      foot: res => {
        const want = CAFE_ITEMS.filter(x => S[x.v]).map(x => x.t), made = [['k2', '☕ кофе'], ['k3', '🥪 сэндвич'], ['k4', '🍰 десерт']].filter(([id]) => res.exec[id]).map(x => x[1]);
        const trays = res.exec.k6 || 0, lost = want.filter(x => !made.includes(x)), extra = made.filter(x => !want.includes(x));
        let k = 'ok', msg = 'Гость получил ровно то, что заказал, на одном подносе.';
        if (res.end.kind === 'deadlock') { k = 'bad'; msg = `Поднос так и не подали: слияние ${GW_NAME[S.join]} ждёт ветку, которую никто не запускал. Гость ждёт вечно.`; }
        else if (res.end.kind === 'stuck') { k = 'bad'; msg = 'Токен застрял: ни одна ветка не подошла.'; }
        else if (trays > 1) { k = 'bad'; msg = `Подносов подали: ${trays}. Слияние «или — или» пропускает каждую ветку отдельно — гость получил заказ по частям.`; }
        else if (lost.length) { k = 'bad'; msg = `Потеряно: ${lost.join(', ')}. Шлюз «или — или» пускает только одну ветку — первую, чьё условие верно.`; }
        else if (extra.length) { k = 'bad'; msg = `Лишнее: ${extra.join(', ')}. Шлюз «и» запускает все ветки без условий — гостю принесли то, чего он не заказывал.`; }
        else if (S.split === 'xor' && want.length === 1) msg = 'Сработало, потому что заказано ровно одно. Закажите два блюда — и «или — или» потеряет одно.';
        else if (S.split === 'and') msg = 'Сработало, потому что заказано всё. Снимите одну галочку — и «и» всё равно сделает всё.';
        return ui.note(k, `Заказали: ${want.join(', ') || 'ничего'} · сделали: ${made.join(', ') || 'ничего'}`, msg) + (k === 'ok' && S.split === 'or' && S.join === 'or' ? ui.note('info', 'Правило', 'Что делит шлюз, то собирает шлюз того же типа: «и/или» → «и/или», «и» → «и». Тогда токены сходятся правильно.') : '');
      }
    });
    pane.addEventListener('change', e => { const c = e.target.closest('[data-it]'); if (!c) return; S[c.dataset.it] = c.checked; p.rebuild(); });
    ui.onSeg(pane, (n, v) => { S[n] = v; p.rebuild(); });
  }
  const RET_RUN = {
    title: 'Возврат обуви «как будет» с параллельными ветками', pools: SHOP_POOLS,
    lanes: [{ id: 'sl', t: 'Продавец' }, { id: 'cs', t: 'Касса' }, { id: 'wh', t: 'Склад' }],
    nodes: [
      { id: 'n0', k: 'msgstart', t: 'Покупатель принёс пару и чек', lane: 'sl', row: 0 },
      { id: 'n1', k: 'task', t: 'Проверить чек и осмотреть пару', lane: 'sl', row: 1 },
      { id: 'n2', k: 'xor', t: 'Не больше 14 дней и пару не носили?', lane: 'sl', row: 2, lp: 'tr', cpl: 15 },
      { id: 'n3', k: 'msgend', t: 'Отказ: предложили обмен', lane: 'sl', row: 3, lp: 'r', cpl: 13 },
      { id: 'n4', k: 'and', t: '', lane: 'cs', row: 3 },
      { id: 'n6', k: 'or', t: 'Чем платили?', lane: 'cs', row: 4, lp: 'tr' },
      { id: 'n7', k: 'task', t: 'Принять пару на склад', lane: 'wh', row: 4 },
      { id: 'n8', k: 'task', t: 'Вернуть деньги на карту', lane: 'cs', row: 5 },
      { id: 'n9', k: 'task', t: 'Вернуть бонусы покупателю', lane: 'sl', row: 5 },
      { id: 'n10', k: 'timer', t: 'Ждём 21:00', lane: 'wh', row: 5, lp: 'b', wait: 3 },
      { id: 'n12', k: 'or', t: '', lane: 'cs', row: 6, pair: 'n6' },
      { id: 'n11', k: 'task', t: 'Отправить пары поставщику партией', lane: 'wh', row: 6 },
      { id: 'n13', k: 'msg', t: 'SMS: возврат оформлен', lane: 'cs', row: 7, lp: 'r' },
      { id: 'n14', k: 'and', t: '', lane: 'cs', row: 8 },
      { id: 'n15', k: 'end', t: 'Возврат закрыт', lane: 'cs', row: 9 }
    ],
    flows: [
      { a: 'P:cust', b: 'n0', msg: true, t: 'пара и чек' },
      { a: 'n0', b: 'n1' }, { a: 'n1', b: 'n2' },
      { a: 'n2', b: 'n3', t: 'нет', c: e => !(e.days <= 14 && !e.worn) },
      { a: 'n2', b: 'n4', t: 'да', c: e => e.days <= 14 && !e.worn },
      { a: 'n3', b: 'P:cust', msg: true, t: 'отказ' },
      { a: 'n4', b: 'n6' }, { a: 'n4', b: 'n7' },
      { a: 'n6', b: 'n8', t: 'картой', c: e => e.pay !== 'bonus' },
      { a: 'n6', b: 'n9', t: 'бонусами', c: e => e.pay !== 'card' },
      { a: 'n7', b: 'n10' }, { a: 'n10', b: 'n11' },
      { a: 'n8', b: 'n12' }, { a: 'n9', b: 'n12' },
      { a: 'n12', b: 'n13' }, { a: 'n13', b: 'P:cust', msg: true, t: 'SMS' },
      { a: 'n13', b: 'n14' }, { a: 'n11', b: 'n14' }, { a: 'n14', b: 'n15' }
    ]
  };
  function drawRun(pane) {
    const S = { days: 5, worn: false, pay: 'card' };
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Представьте фишку, которая бежит по стрелкам, — это <b>токен</b>. На шлюзе «или — или» он выбирает одну ветку, на «и» — раздваивается, на «и/или» — идёт туда, где условия верны. Таймер держит его до нужного времени, слияние ждёт отставших. Меняйте условия и пускайте токен.</p>
      <div class="stack tight">
        <div class="row"><span class="pr-lbl">С покупки прошло</span>${ui.seg('days', [{ v: '5', t: '5 дней' }, { v: '20', t: '20 дней' }], '5', 'accent')}</div>
        <div class="row"><span class="pr-lbl">Пару носили?</span>${ui.seg('worn', [{ v: 'no', t: 'нет' }, { v: 'yes', t: 'да, подошва стёрта' }], 'no', 'accent')}</div>
        <div class="row"><span class="pr-lbl">Чем платили</span>${ui.seg('pay', [{ v: 'card', t: 'картой' }, { v: 'bonus', t: 'бонусами' }, { v: 'both', t: 'картой и бонусами' }], 'card', 'accent')}</div>
      </div><div data-pl></div></div>`;
    const p = player(TR.$('[data-pl]', pane), {
      model: () => RET_RUN, env: () => S, speed: 750,
      foot: res => res.order.includes('n15') ? ui.note('ok', 'Возврат закрыт', `Деньги и SMS ушли сразу, а пары уехали поставщику в 21:00. Слияние «и» внизу ждало склад — посмотрите в журнале, сколько шагов. ${S.pay === 'both' ? 'Включающий шлюз запустил обе ветки и дождался обеих.' : 'Включающий шлюз запустил одну ветку — и слияние ждало только её.'}`)
        : res.order.includes('n3') ? ui.note('warn', 'Отказ', 'Шлюз «или — или» выбрал ветку «нет»: дальше процесс не пошёл. Покупатель получил сообщение об отказе — у ветки есть свой конец.') : ''
    });
    ui.onSeg(pane, (n, v) => { if (n === 'days') S.days = +v; if (n === 'worn') S.worn = v === 'yes'; if (n === 'pay') S.pay = v; p.rebuild(); });
  }
  const howBpmn = {
    id: 'how-bpmn', covers: ['tobe'], title: 'Как это работает: азбука BPMN и бегущий токен', free: true, noReset: true,
    simple: {
      icon: '🔣',
      plain: 'BPMN — язык значков для процессов: кружки — события, прямоугольники — действия, ромбы — развилки, полосы — исполнители. Чтобы проверить схему, по ней мысленно пускают фишку и смотрят, куда она придёт.',
      analogy: 'Схема метро: кружок — станция, линия — путь, пересадка — развилка. Любой пассажир читает её без инструкции. А «пустить фишку» — проехать маршрут пальцем по карте до того, как спуститься в метро.',
      tech: '<b>BPMN 2.0</b> (Business Process Model and Notation, OMG 2011; ISO/IEC 19510:2013): события (начальное, промежуточное — таймер, сообщение, конечное), задачи, шлюзы (исключающий XOR, параллельный AND, включающий OR), пулы и дорожки, поток управления и поток сообщений. Поведение схемы описывают через <b>токен</b>: он проходит по потокам управления, шлюзы решают, куда и сколько токенов пойдёт.'
    },
    lead: ui.brief({
      situation: 'Ксения рисует на доске значки: «Двенадцати хватит почти для любой схемы. Но читать их мало — надо уметь их „прогнать“». Соседние примеры — заказ в кафе и возврат обуви.',
      todo: [
        'Вкладка «Азбука»: пройдитесь по двенадцати значкам.',
        'Вкладка «Шлюзы»: выберите, что заказал гость кафе, каким шлюзом делим и каким собираем. Пустите токен. Найдите сочетания, при которых гость остаётся без десерта, получает два подноса или ждёт вечно.',
        'Вкладка «Бежит токен»: меняйте условия возврата (дни, «носили?», чем платили) и смотрите, по каким веткам идёт токен.'
      ],
      look: 'Зелёная фишка — токен. Цифра на фишке — несколько токенов в одном месте. Плашка «1/2» у ромба — слияние дождалось одной ветки из двух. Справа — журнал: что случилось на каждом шаге.'
    }),
    render(el) {
      el.classList.add('pr-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'abc', t: 'Азбука', render: fresh(drawAbc) },
        { id: 'gw', t: 'Шлюзы', render: fresh(drawGw) },
        { id: 'run', t: 'Бежит токен', render: fresh(drawRun) }
      ], 'abc');
    }
  };

  // =====================================================================
  // Теория 3. Найди ошибку, уровни схемы, разрыв → требование
  // =====================================================================
  const BUG_M = {
    title: 'Возврат обуви — черновик стажёра', pools: SHOP_POOLS,
    lanes: [{ id: 'sl', t: 'Продавец' }, { id: 'nx', t: '' }, { id: 'wh', t: 'Склад' }],
    nodes: [
      { id: 'b0', k: 'start', t: 'Покупатель пришёл', lane: 'sl', row: 0 },
      { id: 'b1', k: 'task', t: 'Проверить чек и осмотреть пару', lane: 'sl', row: 1 },
      { id: 'b2', k: 'xor', t: 'Вернуть можно?', lane: 'sl', row: 2, lp: 'tr' },
      { id: 'b3', k: 'task', t: 'Отказать покупателю', lane: 'sl', row: 3 },
      { id: 'b4', k: 'task', t: 'Согласовать возврат', lane: 'nx', row: 3 },
      { id: 'b5', k: 'task', t: 'Вести учёт возвратов за год', lane: 'nx', row: 4 },
      { id: 'b6', k: 'task', t: 'Возврат', lane: 'sl', row: 5 },
      { id: 'b7', k: 'and', t: '', lane: 'sl', row: 6 },
      { id: 'b8', k: 'task', t: 'Нажать кнопку «Возврат» на кассе', lane: 'sl', row: 7 },
      { id: 'b9', k: 'task', t: 'Принять пару на склад', lane: 'wh', row: 7 },
      { id: 'b10', k: 'and', t: '', lane: 'sl', row: 8 },
      { id: 'b11', k: 'end', t: 'Возврат оформлен', lane: 'sl', row: 9 }
    ],
    flows: [
      { a: 'b0', b: 'b1' }, { a: 'b1', b: 'b2' }, { a: 'b2', b: 'b3' }, { a: 'b2', b: 'b4' }, { a: 'b4', b: 'b5' }, { a: 'b5', b: 'b6' },
      { a: 'b6', b: 'b7' }, { a: 'b7', b: 'b8' }, { a: 'b7', b: 'b9' }, { a: 'b8', b: 'P:cust', t: 'деньги' }, { a: 'b8', b: 'b10' }, { a: 'b9', b: 'b10' }, { a: 'b10', b: 'b11' }
    ]
  };
  const BUGS = [
    { id: 'gw', at: ['b2', 'f:b2-b3', 'f:b2-b4'], t: 'Шлюз без условий', why: 'На стрелках после «Вернуть можно?» нет условий. Какая ветка — «да», какая — «нет»? Токен застрянет, а разработчик решит сам.' },
    { id: 'lane', at: ['b4'], t: 'Задача без исполнителя', why: 'У дорожки нет названия. Кто согласует возврат: старший продавец, директор, бухгалтерия? Задача без исполнителя — ничья.' },
    { id: 'noend', at: ['b3'], t: 'Ветка без конца', why: '«Отказать покупателю» обрывается: нет конечного события. Чем всё закончилось — покупатель ушёл, ему предложили обмен?' },
    { id: 'lvl', at: ['b5', 'b8'], t: 'Смешаны уровни', why: '«Вести учёт возвратов за год» — целый процесс длиной в год, а «Нажать кнопку» — шаг инструкции к кассе. Рядом с «Проверить чек» оба выпадают из уровня схемы.' },
    { id: 'pool', at: ['f:b8-P:cust'], t: 'Сплошная стрелка в чужой пул', why: 'Поток управления не пересекает границу пула: магазин не управляет действиями покупателя. Между участниками — поток сообщений (пунктир с кружком).' },
    { id: 'noun', at: ['b6'], t: 'Задача названа существительным', why: '«Возврат» — это что: оформить, одобрить, выплатить? Задача — «глагол + что»: «Вернуть деньги на карту».' }
  ];
  const BUG_OK = { b0: 'Начальное событие на месте и подписано.', b1: 'Задача с глаголом, в дорожке исполнителя.', b7: 'Параллельный шлюз делит на две ветки…', b9: 'Задача с глаголом, исполнитель — склад.', b10: '…а такой же шлюз их собирает. Всё верно.', b11: 'Конец основной ветки на месте.' };
  function drawBugs(pane) {
    const mk = {}; let shown = false, all = false;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Стажёр нарисовал возврат обуви. В схеме шесть типичных ошибок. Нажимайте на подозрительные элементы и стрелки — они отметятся. Потом нажмите «Проверить себя».</p>
      <div class="pr-two wide"><div class="board pr-dg" data-dg></div><div class="stack tight"><div class="row"><span class="small dim tnum" data-cnt></span><button type="button" class="btn sm primary" data-b="check">Проверить себя</button><button type="button" class="btn sm ghost" data-b="all">Показать все ошибки</button><button type="button" class="btn sm ghost" data-b="reset">⟲ Заново</button></div><div class="pr-find" data-res></div></div></div></div>`;
    const flowIds = BUG_M.flows.map(fid);
    const bugOf = el => BUGS.find(b => b.at.includes(el));
    function draw() {
      const marks = {}, fmarks = {}, st = {}, fst = {};
      Object.keys(mk).forEach(el => {
        const b = bugOf(el), k = shown ? (b ? 'ok' : 'bad') : 'accent', badgeV = { t: shown ? (b ? '✓' : '✕') : '?', k };
        if (el.startsWith('f:')) { fmarks[flowIds.indexOf(el)] = badgeV; fst[flowIds.indexOf(el)] = shown ? (b ? 'ok' : 'bad') : 'tok'; }
        else { marks[el] = badgeV; st[el] = shown ? (b ? 'ok' : 'bad') : 'sel'; }
      });
      if (all) BUGS.forEach(b => { if (!b.at.some(x => mk[x])) b.at.forEach(x => { if (x.startsWith('f:')) fst[flowIds.indexOf(x)] = 'bad'; else st[x] = 'warn'; }); });
      TR.$('[data-dg]', pane).innerHTML = bSvg(BUG_M, { marks, fmarks, st, fst, nodeClick: true, flowClick: true });
      TR.$('[data-cnt]', pane).textContent = `Отмечено: ${Object.keys(mk).length}`;
      const found = BUGS.filter(b => b.at.some(x => mk[x])), wrong = Object.keys(mk).filter(x => !bugOf(x));
      let h = '';
      if (shown) {
        h += ui.note(found.length === BUGS.length && !wrong.length ? 'ok' : 'warn', `Найдено ошибок: ${found.length} из ${BUGS.length}`, wrong.length ? `Лишних отметок: ${wrong.length}.` : 'Лишних отметок нет.');
        h += found.map((b, i) => `<div class="pr-fi ok"><span class="n">✓</span><span><b>${esc(b.t)}.</b> ${esc(b.why)}</span></div>`).join('');
        h += wrong.map(x => `<div class="pr-fi bad"><span class="n">✕</span><span>${x.startsWith('f:') ? 'Эта стрелка в порядке.' : esc(BUG_OK[x] || 'Здесь всё в порядке.')}</span></div>`).join('');
        if (!all && found.length < BUGS.length) h += `<p class="small muted">Не найдено: ${BUGS.length - found.length}. Ищите дальше или нажмите «Показать все ошибки».</p>`;
      }
      if (all) h += BUGS.filter(b => !found.includes(b)).map(b => `<div class="pr-fi"><span class="n">!</span><span><b>${esc(b.t)}.</b> ${esc(b.why)}</span></div>`).join('');
      if (!shown && !all) h = ui.note('info', 'Подсказка', 'Ошибки бывают в значках, в подписях, в стрелках и в дорожках. Задайте каждому элементу вопросы: кто это делает? что дальше? чем кончается? на одном ли это уровне с соседями?');
      TR.$('[data-res]', pane).innerHTML = h;
    }
    pane.addEventListener('click', e => {
      const b = e.target.closest('[data-b]');
      if (b) { const a = b.dataset.b; if (a === 'check') shown = true; if (a === 'all') { all = true; shown = true; } if (a === 'reset') { Object.keys(mk).forEach(k => delete mk[k]); shown = false; all = false; } draw(); return; }
      const f = e.target.closest('[data-f]'), n = e.target.closest('[data-n]');
      const key = f ? flowIds[+f.dataset.f] : n ? n.dataset.n : null;
      if (!key) return;
      if (mk[key]) delete mk[key]; else mk[key] = 1;
      shown = false; draw();
    });
    draw();
  }
  const LVLS = {
    l1: { t: 'Карта процесса', d: '4–6 крупных шагов: для владельца бизнеса и первого разговора. Без шлюзов и дорожек.', chain: ['Принять пару', 'Решить, можно ли вернуть', 'Вернуть деньги', 'Вернуть пару поставщику'], big: true },
    l2: { t: 'Схема процесса (BPMN)', d: 'Задачи, шлюзы, дорожки, события. Уровень, на котором договариваются заказчик, аналитик и разработчики. Если какой-то шаг большой, его раскрывают отдельной схемой — подпроцессом.', bpmn: true },
    l3: { t: 'Инструкция или сценарий экрана', d: 'Кнопки, поля, клавиши. Это уже не BPMN-схема, а инструкция для продавца или шаги сценария использования.', list: ['Нажать «Возврат» на кассе', 'Отсканировать штрихкод чека', 'Выбрать пару из списка покупки', 'Нажать «Вернуть на карту»', 'Попросить покупателя приложить карту'] },
    mix: { t: 'Всё в одной схеме ✕', d: 'Год, пять минут и одно нажатие стоят в одной цепочке. Такую схему нельзя ни оценить, ни проверить: непонятно, что подробно, а что — целый проект.', chain: ['Развивать сеть магазинов', 'Проверить чек', 'Нажать F5', 'Вести учёт возвратов за год', 'Вернуть деньги'], bad: [0, 2, 3] }
  };
  function drawLevels(pane) {
    let cur = 'l2';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Один и тот же возврат можно нарисовать на разных уровнях подробности. Ошибка — не выбрать «неправильный» уровень, а смешать уровни в одной схеме.</p>
      <div class="row">${ui.seg('lv', [{ v: 'l1', t: '1 · Карта' }, { v: 'l2', t: '2 · Схема BPMN' }, { v: 'l3', t: '3 · Инструкция' }, { v: 'mix', t: 'Смешано ✕' }], cur, 'accent')}</div><div data-lv></div></div>`;
    function draw() {
      const L = LVLS[cur];
      let body = '';
      if (L.chain) body = `<div class="pr-chain">${L.chain.map((s, i) => `${i ? '<i>→</i>' : ''}<span class="${L.big ? 'big' : ''} ${L.bad && L.bad.includes(i) ? 'bad' : ''}">${esc(s)}</span>`).join('')}</div>`;
      if (L.bpmn) body = `<div class="board pr-dg">${bSvg(RET_TOBE)}</div>`;
      if (L.list) body = `<ol class="pr-ol">${L.list.map(s => `<li>${esc(s)}</li>`).join('')}</ol>`;
      TR.$('[data-lv]', pane).innerHTML = `<div class="stack tight">${body}${ui.note(cur === 'mix' ? 'bad' : cur === 'l2' ? 'ok' : 'info', L.t, esc(L.d))}</div>`;
    }
    ui.onSeg(pane, (n, v) => { cur = v; draw(); });
    draw();
  }
  const GQ = [
    { was: 'Бумажное заявление несут в бухгалтерию на другой этаж', to: 'Заявление электронное, бухгалтерия видит его сразу', opts: [{ t: 'Хранить заявление на возврат и показывать его бухгалтерии', ok: true }, { t: 'Ничего: это правило магазина' }], why: 'Это функция: системе нужно хранить заявление и показывать его. Требование к системе.' },
    { was: 'Деньги возвращают раз в неделю пачкой', to: 'Деньги возвращают сразу через терминал', opts: [{ t: 'Ничего: это правило магазина' }, { t: 'Возврат на карту через платёжный терминал', ok: true }], why: 'Нужна интеграция с терминалом и банком — требование к системе, а не только новое правило.' },
    { was: 'Покупатель ждёт старшего 10–15 минут, чтобы тот посмотрел пару', to: 'Продавец решает сам; старшего зовут только в спорных случаях', opts: [{ t: 'Кнопка «Позвать старшего» на кассе' }, { t: 'Ничего от системы: меняется правило магазина', ok: true }], why: 'Не каждый разрыв закрывается программой. Здесь меняется регламент — кто принимает решение. Кнопка не уберёт 15 минут ожидания.' },
    { was: 'Покупатель не знает, когда придут деньги, и звонит в магазин', to: 'Покупатель получает SMS: возврат оформлен, срок зачисления', opts: [{ t: 'Отправлять SMS при оформлении возврата', ok: true }, { t: 'Ничего: пусть звонит' }], why: 'Это функция системы: событие «возврат оформлен» → сообщение покупателю.' }
  ];
  function drawGapReq(pane) {
    const got = {};
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Gap-анализ (анализ разрывов) — таблица «было → стало → что нужно от системы». Для каждого разрыва возврата обуви решите, что нужно от системы. Осторожно: не все разрывы закрываются программой.</p>
      <div class="stack tight" data-gq></div><div data-sum></div></div>`;
    function draw() {
      TR.$('[data-gq]', pane).innerHTML = GQ.map((g, i) => {
        const a = got[i], ok = a != null && g.opts[a].ok;
        return `<div class="pr-gq ${a != null ? (ok ? 'ok' : 'bad') : ''}"><div class="pr-kv"><b>Было</b><span>${esc(g.was)}</span><b>Стало</b><span>${esc(g.to)}</span><b>От системы</b><div class="opts">${g.opts.map((o, j) => `<button type="button" class="btn sm ${a === j ? '' : 'ghost'}" aria-pressed="${a === j}" data-g="${i}|${j}">${esc(o.t)}</button>`).join('')}</div></div>${a != null ? `<div class="small">${ok ? '✓' : '✕'} ${esc(g.why)}</div>` : ''}</div>`;
      }).join('');
      const n = Object.keys(got).length, ok = GQ.filter((g, i) => got[i] != null && g.opts[got[i]].ok).length;
      TR.$('[data-sum]', pane).innerHTML = n === GQ.length ? ui.note(ok === n ? 'ok' : 'warn', `Верно ${ok} из ${n}`, 'Каждая строка «что нужно от системы» — кандидат в требование: ему дадут номер, источник (этот разрыв) и критерии приёмки. А строки «меняется правило» уходят в регламент и в протокол встречи — их согласует владелец процесса.') : '';
    }
    TR.on(pane, 'click', '[data-g]', (e, b) => { const [i, j] = b.dataset.g.split('|').map(Number); got[i] = j; draw(); });
    draw();
  }
  const howErrors = {
    id: 'how-errors', covers: ['gapmap', 'why'], title: 'Как это работает: ошибки на схеме и разрыв → требование', free: true, noReset: true,
    simple: {
      icon: '🔍',
      plain: 'У схем есть типичные болезни: развилка без условий, действие без исполнителя, ветка без конца, мелочь рядом с годовым планом. А готовая пара схем «как есть / как будет» превращается в список того, что нужно от системы.',
      analogy: 'Технолог проверяет новую техкарту торта: у каждого шага есть исполнитель? после «если крем расслоился» написано, что делать? нет ли рядом «взбить 3 минуты» и «закупать сливки на квартал»? Потом сравнивает со старой картой: что изменилось — то и надо закупить и объяснить людям.',
      tech: 'Типичные ошибки BPMN: шлюз без условий на исходящих потоках, задача вне дорожки или в безымянной дорожке, ветка без конечного события, смешение уровней детализации (решают подпроцессами), поток управления между пулами вместо потока сообщений, задача не «глагол + объект». <b>Анализ разрывов</b> (gap analysis): «было → стало → что нужно», часть разрывов закрывают требованиями к системе, часть — изменением правил и обучением (BABOK v3, «Определение стратегии изменений»).'
    },
    lead: ui.brief({
      situation: 'Схема готова — но верна ли она? И что с ней делать дальше? Соседний пример — снова возврат обуви в «Шаге».',
      todo: [
        'Вкладка «Найди ошибку»: найдите на схеме стажёра шесть типичных ошибок.',
        'Вкладка «Уровни»: переключите уровни подробности и посмотрите, как выглядит смешение.',
        'Вкладка «Разрыв → требование»: для каждого разрыва решите, что нужно от системы, а что — от правил магазина.'
      ],
      look: 'В «Найди ошибку» отмечать можно и элементы, и стрелки. После «Проверить себя» — зелёный ✓ у найденных ошибок, красный ✕ у лишних отметок.'
    }),
    render(el) {
      el.classList.add('pr-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'bugs', t: 'Найди ошибку', render: fresh(drawBugs) },
        { id: 'lvl', t: 'Уровни', render: fresh(drawLevels) },
        { id: 'gap', t: 'Разрыв → требование', render: fresh(drawGapReq) }
      ], 'bugs');
    }
  };

  // =====================================================================
  // Практика 1. Соберите заказ торта «как есть» (мини-редактор BPMN)
  // =====================================================================
  const AS_LANES = [{ id: 'cl', t: 'Клиент' }, { id: 'cs', t: 'Кассир пекарни' }, { id: 'tc', t: 'Технолог' }, { id: 'cf', t: 'Кондитер (цех)' }];
  const AS_POOL = [{ id: 'k', t: 'Сеть пекарен «Колос»' }];
  const AS = [
    { id: 's', k: 'start', t: 'Клиенту нужен торт: звонит или пишет', lane: ['cl'] },
    { id: 'a1', k: 'task', t: 'Записать заказ в тетрадь на кассе', lane: ['cs'], ico: '📒' },
    { id: 'a2', k: 'task', t: 'Прислать фото-образец и текст надписи', lane: ['cl'], ico: '📱' },
    { id: 'a3', k: 'task', t: 'Переслать фото кондитеру в личный мессенджер', lane: ['cs'], ico: '📱' },
    { id: 'a4', k: 'task', t: 'Накануне переписать торты из тетрадей на лист для цеха', lane: ['tc'], ico: '📄' },
    { id: 'a5', k: 'task', t: 'Испечь и украсить торт по листу и фото в телефоне', lane: ['cf'] },
    { id: 'a6', k: 'task', t: 'Отправить торт на точку с развозом', lane: ['cf', 'tc'] },
    { id: 'a7', k: 'task', t: 'Выдать торт и принять оплату за весь торт', lane: ['cs'] },
    { id: 'e', k: 'end', t: 'Клиент забрал торт', lane: ['cl', 'cs'] },
    { id: 'd1', k: 'task', t: 'Проверить, что до выдачи не меньше 48 часов', bad: 'Сейчас этого никто не проверяет: в тетрадь пишут любой срок. Это правило из «как будет». В схеме «как есть» — только то, что делают сегодня.' },
    { id: 'd2', k: 'task', t: 'Получить предоплату 50 %', bad: 'Вспомните рассказ Павла: когда клиент платит сегодня? Предоплата — это «как будет».' },
    { id: 'd3', k: 'task', t: 'Открыть фото заказа на планшете в цехе', bad: 'Планшета в цехе пока нет: фото живёт в личном телефоне кондитера. Не рисуйте будущее в «как есть».' },
    { id: 'd4', k: 'task', t: 'Проверить, сколько тортов уже принято на эту дату', bad: 'Сегодня никто не считает торты на дату — о перегрузе узнают накануне. Отсутствие проверки — разрыв, его отметим в следующем задании, а не нарисуем как шаг.' }
  ];
  const ASC = Object.fromEntries(AS.map(c => [c.id, c]));
  const AS_REQ = AS.filter(c => !c.bad);
  const AS_REF = [['s', 'cl'], ['a1', 'cs'], ['a2', 'cl'], ['a3', 'cs'], ['a4', 'tc'], ['a5', 'cf'], ['a6', 'cf'], ['a7', 'cs'], ['e', 'cl']].map(([c, l]) => ({ c, l }));
  const AS_PAIRS = [['s', 'a1'], ['s', 'a2'], ['a1', 'a3'], ['a2', 'a3'], ['a1', 'a4'], ['a3', 'a5'], ['a4', 'a5'], ['a5', 'a6'], ['a6', 'a7'], ['a7', 'e']];
  const KIND_ICO = { start: '○', end: '◉', task: '▭' };
  const laneName = id => (AS_LANES.find(l => l.id === id) || { t: '—' }).t;
  function asisModel(list, title) {
    const nodes = list.filter(x => ASC[x.c]).map((x, i) => { const c = ASC[x.c]; return { id: x.c, k: c.k, t: c.t, lane: x.l, row: i, ico: c.ico, lp: 'r', cpl: 15 }; });
    const flows = nodes.slice(1).map((n, i) => ({ a: nodes[i].id, b: n.id }));
    return { title: title || 'Заказ торта «как есть»', pools: AS_POOL, lanes: AS_LANES, nodes, flows, minRows: 3 };
  }
  function handoffs(list) { let n = 0; for (let i = 1; i < list.length; i++) { const a = ASC[list[i - 1].c], b = ASC[list[i].c]; if (a && b && a.k === 'task' && b.k === 'task' && list[i - 1].l !== list[i].l) n++; } return n; }
  function asEval(a) {
    const list = ((a && a.list) || []).filter(x => ASC[x.c]);
    const ids = list.map(x => x.c);
    const have = AS_REQ.filter(c => ids.includes(c.id));
    const dis = AS.filter(c => c.bad && ids.includes(c.id));
    const laneOk = have.filter(c => c.lane.includes(list.find(x => x.c === c.id).l));
    const pairOk = AS_PAIRS.filter(([x, y]) => ids.includes(x) && ids.includes(y) && ids.indexOf(x) < ids.indexOf(y));
    const presS = have.length / AS_REQ.length, laneS = laneOk.length / AS_REQ.length, orderS = pairOk.length / AS_PAIRS.length;
    const score = Math.max(0, Math.min(1, presS * 0.35 + laneS * 0.3 + orderS * 0.35 - dis.length * 0.08));
    return { list, ids, have, dis, laneOk, pairOk, presS, laneS, orderS, score, startFirst: ids[0] === 's', endLast: ids[ids.length - 1] === 'e' };
  }
  const asisTask = {
    id: 'asis', title: 'Соберите заказ торта «как есть»',
    simple: howWhy.simple,
    lead: ui.brief({
      situation: 'Встреча в цехе на Московском шоссе. Павел и Галина Ивановна рассказывают, как сейчас принимают торты (их слова — ниже). Цех делает до 25 тортов в день, теряется 2–3 заказа в неделю. Ксения: «Нарисуйте, как есть — честно, с тетрадью и личным телефоном. Не как должно быть».',
      todo: [
        'Прочитайте рассказ Павла и Галины Ивановны.',
        'В «Карточках» нажмите карточку, затем дорожку — кнопкой под карточками или прямо на схеме. Элемент встанет в конец процесса и соединится стрелкой с предыдущим.',
        'Порядок правьте стрелками ↑ ↓, дорожку — выпадающим списком, лишнее убирайте ✕. Среди карточек есть те, которых в сегодняшнем процессе нет.',
        'Нажмите «Проверить». Засчитывается от 85 %: начало первым, конец последним, все нужные шаги на месте и ни одного шага из «как будет».'
      ],
      look: 'Схема перерисовывается после каждого действия. Над ней счётчик передач из рук в руки и носители заказа (📒 тетрадь, 📱 личный телефон, 📄 лист): на каждой передаче информация может исказиться.'
    }),
    blank: () => ({ list: [] }),
    reference: () => ({ list: AS_REF.map(x => Object.assign({}, x)) }),
    render(el, ctx) {
      el.classList.add('pr-root');
      const a = ctx.ans; a.list = Array.isArray(a.list) ? a.list.filter(x => ASC[x.c]) : [];
      let pick = null;
      const ev = (ctx.result || ctx.readonly) ? asEval(a) : null;
      const order = TR.shuffle(AS.map(c => c.id), 'pr-asis');
      el.innerHTML = `<div class="stack">
        <div class="talk">${ui.say('pavel', 'Звонят или пишут нам в личку — кассир записывает в тетрадь: дату, начинку, надпись. Фото клиент присылает на телефон пекарни, а кассир пересылает его кондитеру. В личный мессенджер, другого нет.')}${ui.say('galya', 'Накануне вечером я собираю торты из тетрадей всех точек и переписываю на лист для цеха. Кондитер печёт по листу, а картинку смотрит у себя в телефоне. Утром торт уезжает на точку с развозом.')}${ui.say('pavel', 'Клиент приходит, забирает и платит за весь торт сразу. Предоплату не берём — как её пробить?')}</div>
        <div class="pr-two ed"><div class="stack tight">
          <div class="pr-lbl">Карточки</div><div class="pr-pal" data-pal></div>
          <div class="pr-lanes" data-lanes></div>
          <div class="pr-lbl">Ваш процесс</div><div class="pr-list" data-list></div>
        </div><div class="stack tight"><div class="pr-kpi" data-kpi></div><div class="board pr-dg" data-dg></div></div></div></div>`;
      function draw() {
        const used = new Set(a.list.map(x => x.c));
        TR.$('[data-pal]', el).innerHTML = order.map(id => { const c = ASC[id], mkx = ev && used.has(id) ? (c.bad ? 'bad' : '') : ''; return `<button type="button" class="pr-cd ${mkx}" data-cd="${id}" aria-pressed="${pick === id}" ${used.has(id) || ctx.readonly ? 'disabled' : ''}><span class="k">${KIND_ICO[c.k]}</span><span>${esc(c.t)}${c.ico ? ' ' + c.ico : ''}</span></button>`; }).join('');
        TR.$('[data-lanes]', el).innerHTML = ctx.readonly ? '' : pick ? `<span class="small">В какую дорожку?</span>${AS_LANES.map(l => `<button type="button" class="btn sm" data-ln="${l.id}">${esc(l.t)}</button>`).join('')}<button type="button" class="btn sm ghost" data-ln="">Отмена</button>` : '<span class="small dim">Нажмите карточку — затем дорожку.</span>';
        TR.$('[data-list]', el).innerHTML = a.list.length ? a.list.map((x, i) => {
          const c = ASC[x.c];
          let k = '';
          if (ev) k = c.bad ? 'bad' : c.lane.includes(x.l) ? 'ok' : 'warn';
          return `<div class="pr-li ${k}"><span class="n">${i + 1}</span><span>${KIND_ICO[c.k]} ${esc(c.t)}</span><span class="ctl">${ctx.readonly ? `<span class="small muted">${esc(laneName(x.l))}</span>` : `<select data-sl="${i}" aria-label="Дорожка">${AS_LANES.map(l => `<option value="${l.id}" ${l.id === x.l ? 'selected' : ''}>${esc(l.t)}</option>`).join('')}</select><button type="button" class="pr-ib" data-mv="${i}|-1" aria-label="Выше" ${i === 0 ? 'disabled' : ''}>↑</button><button type="button" class="pr-ib" data-mv="${i}|1" aria-label="Ниже" ${i === a.list.length - 1 ? 'disabled' : ''}>↓</button><button type="button" class="pr-ib" data-rm="${i}" aria-label="Убрать">✕</button>`}</span></div>`;
        }).join('') : '<div class="small dim">Пока пусто.</div>';
        const ho = handoffs(a.list), media = [...new Set(a.list.map(x => ASC[x.c].ico).filter(Boolean))];
        TR.$('[data-kpi]', el).innerHTML = `${chip('элементов: ' + a.list.length, 'info')}${chip('передач из рук в руки: ' + ho, ho >= 4 ? 'warn' : '')}${media.length ? chip('носители: ' + media.join(' '), 'warn') : ''}`;
        const st = {};
        if (ev) a.list.forEach(x => { const c = ASC[x.c]; st[x.c] = c.bad ? 'bad' : c.lane.includes(x.l) ? '' : 'warn'; });
        TR.$('[data-dg]', el).innerHTML = bSvg(asisModel(a.list), { laneClick: !!pick && !ctx.readonly, laneHl: pick ? Object.fromEntries(AS_LANES.map(l => [l.id, 1])) : null, st, minW: 520 });
      }
      function place(l) {
        if (!pick || ctx.readonly) return;
        if (l) { a.list.push({ c: pick, l }); ctx.save(); ctx.decide('Процесс торта «как есть»', a.list.map(x => ASC[x.c].t + ' [' + laneName(x.l) + ']').join(' → ')); }
        pick = null; draw();
      }
      if (!ctx.readonly) {
        el.addEventListener('click', e => {
          const cd = e.target.closest('[data-cd]'); if (cd) { pick = pick === cd.dataset.cd ? null : cd.dataset.cd; draw(); return; }
          const ln = e.target.closest('[data-ln]'); if (ln) { place(ln.dataset.ln); return; }
          const lane = e.target.closest('[data-lane]'); if (lane) { place(lane.dataset.lane); return; }
          const mv = e.target.closest('[data-mv]');
          if (mv) { const [i, d] = mv.dataset.mv.split('|').map(Number), j = i + d; if (j < 0 || j >= a.list.length) return; [a.list[i], a.list[j]] = [a.list[j], a.list[i]]; ctx.save(); draw(); return; }
          const rm = e.target.closest('[data-rm]'); if (rm) { a.list.splice(+rm.dataset.rm, 1); ctx.save(); draw(); }
        });
        el.addEventListener('change', e => { const s = e.target.closest('[data-sl]'); if (!s) return; a.list[+s.dataset.sl].l = s.value; ctx.save(); draw(); });
      }
      draw();
    },
    check(ans) {
      const ev = asEval(ans), notes = [];
      if (!ev.list.length) return { ok: false, score: 0, summary: 'Процесс пока пуст.', notes: [{ ok: false, html: 'Начните с события: что запускает процесс? Потом — кто первым берёт заказ в руки.' }] };
      const miss = AS_REQ.filter(c => !ev.ids.includes(c.id));
      if (miss.length) notes.push({ ok: false, html: `Не хватает шагов: ${miss.length}. Перечитайте рассказ: ${miss.some(c => c.id === 'a3') ? 'как фото попадает к кондитеру? ' : ''}${miss.some(c => c.id === 'a4') ? 'как торты из девяти тетрадей попадают в цех? ' : ''}${miss.some(c => c.k !== 'task') ? 'у процесса есть начало и конец? ' : ''}`.trim() });
      ev.dis.forEach(c => notes.push({ ok: false, html: `«${esc(c.t)}» — ${esc(c.bad)}` }));
      ev.have.filter(c => !ev.laneOk.includes(c)).forEach(c => notes.push({ ok: 'warn', html: `«${esc(c.t)}» стоит не в той дорожке. Кто это делает по рассказу?` }));
      if (!ev.startFirst) notes.push({ ok: false, html: 'Первым должно стоять начальное событие: с чего всё начинается?' });
      if (!ev.endLast) notes.push({ ok: false, html: 'Последним должно стоять конечное событие: чем процесс заканчивается?' });
      if (ev.orderS < 1 && ev.presS > 0.5) notes.push({ ok: 'warn', html: `Порядок верен на ${Math.round(ev.orderS * 100)} %. Проверьте: может ли кондитер печь раньше, чем технолог перепишет торты на лист? Когда клиент платит?` });
      const ok = ev.score >= 0.85 && !ev.dis.length && ev.startFirst && ev.endLast && ev.presS === 1;
      if (ok) notes.push({ ok: true, html: `Процесс собран честно: ${handoffs(ev.list)} передач из рук в руки и три носителя — тетрадь, личный телефон, лист.` });
      return {
        ok, score: ev.score, notes,
        summary: `Шагов на месте: ${ev.have.length} из ${AS_REQ.length}, в своей дорожке: ${ev.laneOk.length}. Порядок: ${Math.round(ev.orderS * 100)} %. Шагов из «как будет»: ${ev.dis.length}.`,
        mentor: ev.dis.length >= 2 ? 'Самая частая ошибка в схеме «как есть» — нарисовать сразу хороший процесс. Но тогда мы не увидим, что чинить. Рисуем то, что делают сегодня, со всеми тетрадями и личными телефонами.' : null
      };
    },
    explain: `<div class="board pr-dg">${bSvg(asisModel(AS_REF), { minW: 520 })}</div>
      <p>Так заказ торта идёт сегодня. Пять передач из рук в руки (клиент → кассир → клиент → кассир → технолог → кондитер → кассир) и три носителя: <b>тетрадь</b> на кассе, <b>личный телефон</b> кондитера, <b>лист</b> технолога. Каждая передача — место, где «С юбилеем» может превратиться в «С днём рождения».</p>
      <p>В «как есть» нет предоплаты, проверки 48 часов, планшета в цехе и подсчёта тортов на дату. Их не рисуют: схема «как есть» показывает сегодняшний день, а отсутствие проверки — это разрыв, который отметим в следующем задании.</p>
      <p>Порядок местами допускает варианты: фото может прийти раньше записи в тетрадь, а конец можно поставить в дорожку кассира («Торт выдан»). Главное — честные носители и передачи.</p>
      <p class="small muted">Источники: BPMN 2.0 (OMG) — дорожки, события, потоки; BABOK v3 — «Анализ текущего состояния», техника «Моделирование процессов».</p>`,
    refNote: 'Начальное событие стоит в дорожке клиента, конец можно поставить и у клиента, и у кассира. Фото может прийти и до записи в тетрадь.',
    report: ans => { const ev = asEval(ans); return ev.list.map((x, i) => `${i + 1}. ${ASC[x.c].t} [${laneName(x.l)}]${ASC[x.c].bad ? ' ✗ из «как будет»' : ASC[x.c].lane.includes(x.l) ? '' : ' (дорожка?)'}`).join('\n') || '—'; }
  };

  // =====================================================================
  // Практика 2. Разметьте разрывы на схеме «как есть»
  // =====================================================================
  const GAPS = [
    { id: 'g1', n: '1', t: 'Нет единой записи заказа', ok: ['a1', 'a4', 'f:a3-a4'], h: 'Где заказ существует в виде, который видит только одна касса, и где его переписывают руками?' },
    { id: 'x1', n: '2', t: 'Кондитер невнимательно украшает торты', bad: 'Кондитер печёт по листу и картинке в телефоне. Ошибки на торте — следствие. Где информация искажается раньше, чем доходит до него?' },
    { id: 'g2', n: '3', t: 'Нет предоплаты', ok: ['a1', 'a7'], h: 'В какой момент в процессе появляются деньги? А где они должны были бы появиться впервые?' },
    { id: 'g3', n: '4', t: 'Фото и надпись теряются по дороге', ok: ['a2', 'a3', 'a5', 'f:a2-a3', 'f:a3-a4'], h: 'Где фото уходит из процесса в личный канал, не связанный с заказом?' },
    { id: 'x2', n: '5', t: 'Торт едет на точку с утренним развозом', bad: 'Развоз работает: торт приезжает вовремя. Разрыв — где теряется информация, деньги или контроль.' },
    { id: 'g4', n: '6', t: 'Никто не проверяет мощность цеха и срок 48 часов', ok: ['a1', 'a4'], h: 'В какой момент принимают заказ, не спросив, успеет ли цех? И когда о перегрузе узнают?' }
  ];
  const GREAL = GAPS.filter(g => g.ok);
  const AS_REF_M = asisModel(AS_REF);
  const AS_FIDS = AS_REF_M.flows.map(fid);
  const placeName = p => p.startsWith('f:') ? `стрелка «${ASC[p.slice(2).split('-')[0]].t}» → «${ASC[p.slice(2).split('-')[1]].t}»` : `«${ASC[p] ? ASC[p].t : p}»`;
  function gEval(a) {
    const m = (a && a.m) || {};
    const res = GAPS.map(g => ({ g, at: m[g.id], st: !m[g.id] ? (g.ok ? 'miss' : 'none') : g.ok ? (g.ok.includes(m[g.id]) ? 'ok' : 'wrong') : 'dis' }));
    const good = res.filter(r => r.st === 'ok').length, dis = res.filter(r => r.st === 'dis').length;
    return { res, good, dis, score: Math.max(0, good / GREAL.length - dis * 0.15) };
  }
  const gapsTask = {
    id: 'gaps', title: 'Разметьте разрывы на схеме «как есть»',
    simple: howWhy.simple,
    lead: ui.brief({
      situation: 'Схема «как есть» висит на стене цеха. Нина Сергеевна: «2–3 сорванных торта в неделю, а к прошлому 8 Марта из 140 тортов потеряли девять. Покажите, где именно мы их теряем». Рядом с вами шесть стикеров — но не всё на них разрывы процесса.',
      todo: [
        'Нажмите стикер-разрыв, затем элемент или стрелку на схеме, где он возникает. Стикер встанет туда с номером.',
        'Чтобы перенести стикер, выберите его снова и нажмите на другое место. «Убрать» — снять со схемы.',
        'Стикеры, которые не являются разрывами процесса, на схему не ставьте.',
        'Нажмите «Проверить». Засчитывается, если все четыре настоящих разрыва стоят на своих местах и ни один ложный не попал на схему.'
      ],
      lookTitle: 'На что опереться',
      look: 'Блокнот: торт принимается минимум за 48 часов с предоплатой 50 % — это правило «Колоса»; цех делает до 25 тортов в день; фото и надпись кондитер должен видеть в цехе. Разрыв — место, где процесс не выполняет правило или теряет информацию, деньги, контроль. У некоторых разрывов несколько верных мест.'
    }),
    blank: () => ({ m: {} }),
    reference: () => ({ m: { g1: 'a1', g2: 'a1', g3: 'a3', g4: 'a1' } }),
    render(el, ctx) {
      el.classList.add('pr-root');
      const a = ctx.ans; a.m = a.m || {};
      let pick = null;
      const ev = (ctx.result || ctx.readonly) ? gEval(a) : null;
      el.innerHTML = `<div class="pr-two ed"><div class="stack tight"><div class="pr-lbl">Стикеры</div><div class="pr-find" data-st></div><div data-hint></div></div><div class="stack tight"><div class="board pr-dg" data-dg></div></div></div>`;
      function draw() {
        TR.$('[data-st]', el).innerHTML = GAPS.map(g => {
          const at = a.m[g.id], r = ev ? ev.res.find(x => x.g.id === g.id) : null;
          const k = r ? ({ ok: 'ok', wrong: 'bad', dis: 'bad', miss: '', none: '' })[r.st] : '';
          return `<div class="pr-fi ${k}"><span class="n">${g.n}</span><span class="stack tight" style="gap:4px"><span><b>${esc(g.t)}</b></span><span class="small muted">${at ? 'на схеме: ' + esc(placeName(at)) : 'не на схеме'}</span>${ctx.readonly ? '' : `<span class="row" style="gap:6px"><button type="button" class="btn xs ${pick === g.id ? '' : 'ghost'}" aria-pressed="${pick === g.id}" data-pk="${g.id}">${pick === g.id ? 'Выбран — нажмите на схему' : at ? 'Перенести' : 'Поставить на схему'}</button>${at ? `<button type="button" class="btn xs ghost" data-un="${g.id}">Убрать</button>` : ''}</span>`}</span></div>`;
        }).join('');
        TR.$('[data-hint]', el).innerHTML = pick ? ui.note('info', 'Куда поставить?', 'Нажмите на шаг или на стрелку между шагами.') : '';
        const marks = {}, fmarks = {}, st = {};
        GAPS.forEach(g => {
          const at = a.m[g.id]; if (!at) return;
          const r = ev ? ev.res.find(x => x.g.id === g.id) : null, k = r ? (r.st === 'ok' ? 'ok' : 'bad') : (g.ok ? 'accent' : 'accent');
          const b = { t: g.n, k };
          if (at.startsWith('f:')) (fmarks[AS_FIDS.indexOf(at)] = fmarks[AS_FIDS.indexOf(at)] || []).push(b);
          else { (marks[at] = marks[at] || []).push(b); st[at] = r ? (r.st === 'ok' ? 'ok' : 'bad') : 'warn'; }
        });
        TR.$('[data-dg]', el).innerHTML = bSvg(AS_REF_M, { marks, fmarks, st, nodeClick: !!pick, flowClick: !!pick, minW: 520 });
      }
      if (!ctx.readonly) {
        el.addEventListener('click', e => {
          const pk = e.target.closest('[data-pk]'); if (pk) { pick = pick === pk.dataset.pk ? null : pk.dataset.pk; draw(); return; }
          const un = e.target.closest('[data-un]'); if (un) { delete a.m[un.dataset.un]; ctx.save(); draw(); return; }
          if (!pick) return;
          const f = e.target.closest('[data-f]'), n = e.target.closest('[data-n]');
          const at = f ? AS_FIDS[+f.dataset.f] : n ? n.dataset.n : null;
          if (!at) return;
          a.m[pick] = at; pick = null; ctx.save();
          ctx.decide('Разрывы «как есть»', GAPS.filter(g => a.m[g.id]).map(g => g.t + ' → ' + placeName(a.m[g.id])).join('; '));
          draw();
        });
      }
      draw();
    },
    check(ans) {
      const ev = gEval(ans), notes = [];
      ev.res.forEach(r => {
        if (r.st === 'miss') notes.push({ ok: false, html: `Стикер «${esc(r.g.t)}» не на схеме. ${esc(r.g.h)}` });
        if (r.st === 'wrong') notes.push({ ok: false, html: `«${esc(r.g.t)}» стоит на ${esc(placeName(r.at))}. ${esc(r.g.h)}` });
        if (r.st === 'dis') notes.push({ ok: false, html: `«${esc(r.g.t)}» — не разрыв процесса. ${esc(r.g.bad)}` });
        if (r.st === 'ok') notes.push({ ok: true, html: `«${esc(r.g.t)}» — на своём месте.` });
      });
      const ok = ev.good === GREAL.length && !ev.dis;
      return {
        ok, score: ev.score, notes,
        summary: `Настоящих разрывов на месте: ${ev.good} из ${GREAL.length}. Ложных на схеме: ${ev.dis}.`,
        mentor: ev.dis ? 'Разрыв — не «кто-то плохо работает», а место, где процесс сам по себе теряет информацию, деньги или контроль. Если поменять кондитера, а процесс оставить, торты будут теряться и дальше.' : null
      };
    },
    explain: `${ui.table(['Разрыв', 'Где возникает', 'Чем подтверждается'], [
        ['Нет единой записи заказа', 'Тетрадь на кассе одной из 9 пекарен; лист, на который технолог переписывает торты', '2–3 сорванных заказа в неделю: путают дату, надпись, начинку'],
        ['Нет предоплаты', 'Приём заказа: денег не берут; платят только при выдаче', 'Правило «Колоса»: предоплата 50 %; по 54-ФЗ на неё нужен чек «предоплата»'],
        ['Фото и надпись теряются', 'Фото уходит в личный мессенджер кондитера, не связанный с заказом', 'Галина Ивановна: кондитер должен видеть фото и надпись в цехе'],
        ['Нет проверки мощности и срока', 'Приём заказа: в тетрадь пишут любой срок и любое число тортов; о перегрузе узнают накануне', 'Цех делает до 25 тортов в день, в праздники до 60; 140 тортов за 3 дня к 8 Марта — 9 потеряли']
      ])}
      <p>Многие разрывы сходятся в одной точке — <b>приёме заказа в тетрадь</b>: там не берут денег, не проверяют срок и мощность, и запись видит только одна касса. Поэтому на ней можно ставить сразу три стикера, и это не ошибка — это главная точка изменения.</p>
      <p>«Кондитер невнимательно украшает» и «торт едет с развозом» — ловушки. Первое — следствие разрывов, а не причина: замена кондитера ничего не исправит. Второе работает, и менять его не нужно: gap-анализ показывает и то, что остаётся как есть.</p>
      <p class="small muted">Источник: BABOK v3 — «Анализ текущего состояния»: проблемы и их причины ищут в процессе, а не в людях.</p>`,
    refNote: 'Несколько мест засчитываются: «нет единой записи» — тетрадь или лист технолога; «нет предоплаты» — приём заказа или выдача; «фото теряется» — пересылка в личный мессенджер или выпечка по фото из телефона; «нет проверки» — приём заказа или лист технолога.',
    report: ans => gEval(ans).res.map(r => `- ${r.g.t} → ${r.at ? placeName(r.at) : 'не на схеме'} ${r.st === 'ok' ? '✓' : r.st === 'none' ? '' : '✗'}`).join('\n')
  };

  // =====================================================================
  // Практика 3. Лаборатория TO-BE: шлюзы, таймер, параллельные ветки и прогон токена
  // =====================================================================
  const SLOTV = {
    x48: { k: 'xor', label: 'До выдачи ≥ 48 часов?', t: 'Шлюз «или — или»: «До выдачи ≥ 48 часов?»' },
    xcap: { k: 'xor', label: 'На дату меньше 25 тортов?', t: 'Шлюз «или — или»: «На дату меньше 25 тортов?»' },
    and: { k: 'and', label: '', t: 'Параллельный шлюз «и»' },
    xnone: { k: 'xor', label: 'Проверить заявку?', t: 'Шлюз «или — или» «Проверить заявку?» (без условий на стрелках)' },
    timer: { k: 'timer', label: 'За день до даты выдачи', t: 'Таймер «За день до даты выдачи»', wait: 2 },
    msg3: { k: 'msg', label: 'Напомнить клиенту', t: 'Сообщение «Напомнить клиенту»' },
    xor: { k: 'xor', label: '', t: 'Шлюз «или — или»' },
    or: { k: 'or', label: '', t: 'Шлюз «и/или»' },
    msg: { k: 'msg', label: 'SMS: торт готов', t: 'Сообщение «SMS: торт готов»' },
    timer6: { k: 'timer', label: 'Через сутки', t: 'Таймер «Через сутки»', wait: 2 }
  };
  const SLOTS = [
    { id: 's1', where: 'после «Оформить заявку»: первая проверка', opts: ['x48', 'xcap', 'and', 'xnone'] },
    { id: 's2', where: 'сразу за первой проверкой: вторая проверка', opts: ['x48', 'xcap', 'and', 'xnone'] },
    { id: 's3', where: 'после «Чек „предоплата“; торт — в план цеха»', opts: ['timer', 'msg3'] },
    { id: 's4', where: 'перед двумя ветками «Напомнить» и «Испечь»', opts: ['and', 'xor', 'or'] },
    { id: 's5', where: 'где ветки сходятся перед «Отметить „Готов“»', opts: ['and', 'xor', 'or'] },
    { id: 's6', where: 'после «Отметить „Готов“»', opts: ['msg', 'timer6'] }
  ];
  const CHECKS = {
    x48: { yes: e => e.h >= 48, no: e => e.h < 48, rej: 'Отклонён: до выдачи меньше 48 часов' },
    xcap: { yes: e => e.n < 25, no: e => e.n >= 25, rej: 'Отклонён: цех занят на эту дату' }
  };
  const RUNS = [{ k: '72-18', h: 72, n: 18, t: 'Обычный заказ: за 3 дня, на дату 18 тортов' }, { k: '30-18', h: 30, n: 18, t: 'Поздно: до выдачи 30 часов' }, { k: '72-25', h: 72, n: 25, t: 'Цех занят: на дату уже 25 тортов' }];
  const CAKE_ST = ['Заявка', 'Согласован', 'Предоплачен', 'В производстве', 'Готов', 'Выдан'];
  function slotNode(id, v, lane, row) {
    const o = SLOTV[v], base = { id, lane, row };
    if (!o) return Object.assign(base, { k: 'slot', t: '' });
    return Object.assign(base, { k: o.k, t: o.label, lp: o.k === 'timer' || o.k === 'msg' ? 'r' : 'tr', cpl: 16, wait: o.wait, pair: id === 's5' ? 's4' : undefined });
  }
  function checkFlows(sid, v, yesTo, noTo, yesSt) {
    const C = CHECKS[v];
    if (C) return [{ a: sid, b: yesTo, t: 'да', c: C.yes, st: yesSt, ex: sid === 's2' ? 'b' : undefined, ll: sid === 's1' }, { a: sid, b: noTo, t: 'нет', c: C.no, st: 'Отклонён' }];
    return [{ a: sid, b: yesTo, st: yesSt, ex: sid === 's2' ? 'b' : undefined }, { a: sid, b: noTo, st: v === 'and' ? 'Отклонён' : undefined }];
  }
  function cakeModel(s) {
    s = s || {};
    const nodes = [
      { id: 'c0', k: 'start', t: 'Клиенту нужен торт к дате', lane: 'cl', row: 0 },
      { id: 'c1', k: 'task', t: 'Оформить заявку: дата, начинка, надпись, фото', lane: 'cl', row: 1, st: 'Заявка' },
      slotNode('s1', s.s1, 'sy', 2),
      { id: 'r1', k: 'end', t: (CHECKS[s.s1] || { rej: 'Отклонён' }).rej, lane: 'cs', row: 2, lp: 'l', cpl: 14, log: '■ Конец: заявка отклонена, денег не взяли.' },
      slotNode('s2', s.s2, 'sy', 3),
      { id: 'r2', k: 'end', t: (CHECKS[s.s2] || { rej: 'Отклонён' }).rej, lane: 'cs', row: 3, lp: 'l', cpl: 14, log: '■ Конец: заявка отклонена, денег не взяли.' },
      { id: 'c2', k: 'task', t: 'Внести предоплату 50 %', lane: 'cl', row: 4, st: 'Предоплачен' },
      { id: 'c3', k: 'task', t: 'Чек «предоплата»; торт — в план цеха с фото', lane: 'sy', row: 5 },
      slotNode('s3', s.s3, 'sy', 6),
      slotNode('s4', s.s4, 'sy', 7),
      { id: 'c4', k: 'task', t: 'Напомнить клиенту: SMS «завтра ваш торт»', lane: 'sy', row: 8 },
      { id: 'c5', k: 'task', t: 'Испечь и украсить торт по фото с планшета', lane: 'cf', row: 8, dur: 3, stIn: 'В производстве' },
      slotNode('s5', s.s5, 'sy', 9),
      { id: 'c6', k: 'task', t: 'Отметить «Готов»', lane: 'cf', row: 10, st: 'Готов' },
      slotNode('s6', s.s6, 'sy', 11),
      { id: 'c7', k: 'task', t: 'Выдать торт, принять остаток, чек полного расчёта', lane: 'cs', row: 12, st: 'Выдан' },
      { id: 'c8', k: 'end', t: 'Торт у клиента', lane: 'cs', row: 13 }
    ];
    const par = s.s4 === 'xor' || s.s4 === 'or';
    const flows = [{ a: 'c0', b: 'c1' }, { a: 'c1', b: 's1', via: 'g' }]
      .concat(checkFlows('s1', s.s1, 's2', 'r1'), checkFlows('s2', s.s2, 'c2', 'r2', 'Согласован'))
      .concat([{ a: 'c2', b: 'c3' }, { a: 'c3', b: 's3' }, { a: 's3', b: 's4' },
        Object.assign({ a: 's4', b: 'c4' }, par ? { t: 'напомнить', c: () => true } : {}),
        Object.assign({ a: 's4', b: 'c5' }, par ? { t: 'испечь', c: () => true } : {}),
        { a: 'c4', b: 's5' }, { a: 'c5', b: 's5' }, { a: 's5', b: 'c6', ex: 'b' }, { a: 'c6', b: 's6' }, { a: 's6', b: 'c7' }, { a: 'c7', b: 'c8' }]);
    return { title: 'Заказ торта «как будет»', pools: [{ id: 'k', t: 'Заказ торта «как будет»' }], lanes: [{ id: 'cl', t: 'Клиент' }, { id: 'cs', t: 'Кассир' }, { id: 'sy', t: 'Система «Колос»' }, { id: 'cf', t: 'Цех (кондитер)' }], nodes, flows };
  }
  function cakeOutcome(s, res, env) {
    const out = [], ex = res.exec, has = id => (ex[id] || 0) > 0;
    const expect = env.h < 48 || env.n >= 25 ? 'reject' : 'issue';
    const rej = has('r1') || has('r2'), iss = has('c8');
    if (res.end.kind === 'stuck') out.push({ k: 'bad', t: 'Токен застрял — схема не доводит заказ до конца.' });
    if (res.end.kind === 'deadlock') out.push({ k: 'bad', t: 'Процесс завис на слиянии: оно ждёт ветку, которую никто не запускал. Торт так и не выдали.' });
    if (rej && iss) out.push({ k: 'bad', t: 'Заказ и отклонили, и выдали: параллельный шлюз пустил токен по обеим веткам проверки.' });
    else if (expect === 'reject' && iss) out.push({ k: 'bad', t: env.h < 48 ? 'Торт приняли за 30 часов до выдачи — цех не успевает, правило 48 часов нарушено.' : 'Приняли 26-й торт на дату — цех физически не успеет.' });
    else if (expect === 'issue' && rej) out.push({ k: 'bad', t: 'Отклонили нормальный заказ: условия на стрелках перепутаны.' });
    const io = id => res.order.indexOf(id);
    if (has('c6') && (!has('c5') || io('c6') < io('c5'))) out.push({ k: 'bad', t: '«Готов» отметили раньше, чем торт испекли: клиент придёт за тортом, которого ещё нет.' });
    if ((ex.c6 || 0) > 1) out.push({ k: 'bad', t: `«Готов» отметили ${ex.c6} раза — и SMS «торт готов» ушло дважды.` });
    if (has('c4') && !has('c5') && expect === 'issue' && !rej) out.push({ k: 'bad', t: 'Клиенту напомнили, а торт никто не испёк: пошла только одна ветка.' });
    if (has('c5') && s.s3 !== 'timer') out.push({ k: 'warn', t: 'Торт начали печь сразу после оплаты — за трое суток до выдачи, а не накануне.' });
    if (iss && s.s6 === 'timer6') out.push({ k: 'warn', t: 'Клиент узнал о готовности только через сутки: торт стоял на точке.' });
    if (!out.some(x => x.k === 'bad')) {
      if (expect === 'issue' && iss) out.unshift({ k: 'ok', t: `Торт ${s.s3 === 'timer' ? 'испекли накануне' : 'испекли'}, «Готов» — после выпечки, ${s.s6 === 'msg' ? 'SMS ушло, ' : ''}выдали с чеком полного расчёта.` });
      if (expect === 'reject' && rej) out.unshift({ k: 'ok', t: 'Заявку отклонили до оплаты: денег не взяли, цех не перегружен.' });
    }
    return out;
  }
  function tbEval(a) {
    const s = (a && a.s) || {}, runs = (a && a.runs) || {};
    const ck = v => v === 'x48' || v === 'xcap';
    const p = {};
    p.s1 = ck(s.s1) ? 1 : 0;
    p.s2 = ck(s.s2) && s.s2 !== s.s1 ? 1 : 0;
    p.s3 = s.s3 === 'timer' ? 1 : 0;
    const orPair = s.s4 === 'or' && s.s5 === 'or';
    p.s4 = s.s4 === 'and' ? 1 : orPair ? 0.85 : 0;
    p.s5 = s.s5 === 'and' && s.s4 !== 'xor' ? 1 : orPair ? 0.85 : s.s5 === 'or' && s.s4 === 'and' ? 0.5 : 0;
    p.s6 = s.s6 === 'msg' ? 1 : 0;
    const slotS = (p.s1 + p.s2 + p.s3 + p.s4 + p.s5 + p.s6) / 6;
    const runOk = RUNS.filter(r => runs[r.k] === 'ok');
    const slotsOk = p.s1 && p.s2 && p.s3 && p.s6 && ((s.s4 === 'and' && s.s5 === 'and') || orPair);
    return { s, p, slotS, runOk, orPair, slotsOk, score: slotS * 0.8 + (runOk.length / RUNS.length) * 0.2 };
  }
  const tobeTask = {
    id: 'tobe', title: 'Лаборатория: соберите «как будет» и прогоните токен',
    simple: howBpmn.simple,
    lead: ui.brief({
      situation: 'Схема «как будет» почти готова: Ксения расставила задачи по дорожкам, но оставила шесть пустых мест — развилки, ожидание и сообщения. Галина Ивановна: «Если система примет торт за сутки или двадцать шестой на дату — я не испеку». Лера: «А я прогоню токен по всем трём случаям, которые вижу в блокноте».',
      todo: [
        'Справа под номерами 1–6 выберите для каждого пустого места элемент. Номера совпадают с вопросами на схеме.',
        'Выберите условия сценария («До выдачи», «Тортов на эту дату») и нажмите «▶ Пустить токен». Следите за журналом и статусом торта.',
        'Прогоните три сценария: обычный заказ (72 часа, 18 тортов), «поздно» (30 часов) и «цех занят» (25 тортов). После правки схемы прогоны сбрасываются.',
        'Нажмите «Проверить». Засчитывается, когда все шесть мест заполнены верно и все три прогона закончились без ошибок.'
      ],
      lookTitle: 'На что опереться',
      look: 'Блокнот: торт — минимум за 48 часов, предоплата 50 %; цех — до 25 тортов в день; по 54-ФЗ при предоплате — чек «предоплата», при выдаче — чек полного расчёта; фото и надпись кондитер видит на планшете. «Испечь» идёт дольше, чем «Напомнить», — смотрите, кто придёт к слиянию первым.'
    }),
    blank: () => ({ s: {}, runs: {} }),
    reference: () => ({ s: { s1: 'x48', s2: 'xcap', s3: 'timer', s4: 'and', s5: 'and', s6: 'msg' }, runs: { '72-18': 'ok', '30-18': 'ok', '72-25': 'ok' } }),
    render(el, ctx) {
      el.classList.add('pr-root');
      const a = ctx.ans; a.s = a.s || {}; a.runs = a.runs || {};
      const E = { h: 72, n: 18 };
      const ev = (ctx.result || ctx.readonly) ? tbEval(a) : null;
      el.innerHTML = `<div class="stack">
        ${sysBtn('status/cake', 'Открыть систему «Колос»: статусы торта', 'Диаграмма состояний торта — те же статусы, что бегут под токеном.')}
        <div class="pr-lbl">Пустые места на схеме</div><div class="pr-slots" data-slots style="grid-template-columns:repeat(auto-fit, minmax(min(100%, 320px), 1fr))"></div>
        <div class="row"><span class="pr-lbl">До выдачи</span>${ui.seg('h', [{ v: '72', t: '72 часа' }, { v: '30', t: '30 часов' }], '72', 'accent')}<span class="pr-lbl">Тортов на эту дату</span>${ui.seg('n', [{ v: '18', t: '18' }, { v: '25', t: '25' }], '18', 'accent')}</div>
        <div class="pr-runs" data-runs></div>
        <div data-pl></div></div>`;
      function drawSlots() {
        TR.$('[data-slots]', el).innerHTML = SLOTS.map((sl, i) => {
          const v = a.s[sl.id], k = ev ? (ev.p[sl.id] === 1 ? 'ok' : ev.p[sl.id] > 0 ? 'warn' : 'bad') : '';
          return `<div class="pr-slot ${k}"><span class="n">${i + 1}</span><span class="small">${esc(sl.where)}</span><select data-slot="${sl.id}" aria-label="Место ${i + 1}" ${ctx.readonly ? 'disabled' : ''}><option value="">— пусто —</option>${sl.opts.map(o => `<option value="${o}" ${v === o ? 'selected' : ''}>${esc(SLOTV[o].t)}</option>`).join('')}</select></div>`;
        }).join('');
      }
      function drawRuns() {
        TR.$('[data-runs]', el).innerHTML = `<span class="pr-lbl">Прогоны</span>` + RUNS.map(r => chip((a.runs[r.k] === 'ok' ? '✓ ' : a.runs[r.k] === 'bad' ? '✕ ' : '○ ') + esc(r.t), a.runs[r.k] === 'ok' ? 'ok' : a.runs[r.k] === 'bad' ? 'bad' : '')).join('');
      }
      const marksOf = () => { const m = {}; SLOTS.forEach((sl, i) => { m[sl.id] = { t: String(i + 1), k: ev ? (ev.p[sl.id] === 1 ? 'ok' : ev.p[sl.id] > 0 ? 'warn' : 'bad') : 'accent' }; }); return m; };
      const p = player(TR.$('[data-pl]', el), {
        model: () => cakeModel(a.s), env: () => E, speed: 650,
        svg: () => ({ marks: marksOf(), minW: 560 }),
        head: f => { const cur = f.status, ri = CAKE_ST.indexOf(cur); return `<div class="pr-lbl">Статус торта</div><div class="pr-sts">${CAKE_ST.map((x, i) => `${i ? '<i>→</i>' : ''}<span class="${x === cur ? 'on' : ri > i ? 'past' : ''}">${esc(x)}</span>`).join('')}<i>·</i><span class="rej ${cur === 'Отклонён' ? 'on' : ''}">Отклонён</span></div>`; },
        foot: res => { const o = cakeOutcome(a.s, res, E); return o.map(x => ui.note(x.k, x.k === 'ok' ? 'Прогон без ошибок' : x.k === 'bad' ? 'Что пошло не так' : 'Обратите внимание', esc(x.t))).join(''); },
        onEnd: res => {
          if (ctx.readonly) return;
          const key = `${E.h}-${E.n}`; if (!RUNS.some(r => r.k === key)) return;
          const o = cakeOutcome(a.s, res, E);
          a.runs[key] = o.some(x => x.k === 'bad') || res.end.kind !== 'done' ? 'bad' : 'ok';
          ctx.save(); drawRuns();
        }
      });
      el.addEventListener('change', e => {
        const s = e.target.closest('[data-slot]'); if (!s || ctx.readonly) return;
        if (s.value) a.s[s.dataset.slot] = s.value; else delete a.s[s.dataset.slot];
        a.runs = {}; ctx.save();
        ctx.decide('Схема торта «как будет»', SLOTS.map((sl, i) => `${i + 1}: ${a.s[sl.id] ? SLOTV[a.s[sl.id]].t : '—'}`).join('; '));
        drawRuns(); p.rebuild();
      });
      ui.onSeg(el, (n, v) => { E[n] = +v; p.rebuild(); });
      onSys(el);
      drawSlots(); drawRuns();
    },
    check(ans) {
      const ev = tbEval(ans), s = ev.s, notes = [];
      const ck = v => v === 'x48' || v === 'xcap';
      if (!ck(s.s1) || !ck(s.s2) || s.s1 === s.s2) {
        if (s.s1 === 'and' || s.s2 === 'and') notes.push({ ok: false, html: 'Параллельный шлюз на проверке пускает токен по обеим веткам — заказ одновременно принят и отклонён. Здесь нужен выбор одной ветки по условию.' });
        if (s.s1 === 'xnone' || s.s2 === 'xnone') notes.push({ ok: false, html: 'Шлюз без условий: прогоните токен — он застрянет. Какое правило из блокнота должно стоять на стрелках?' });
        if (ck(s.s1) && s.s1 === s.s2) notes.push({ ok: false, html: 'Обе проверки одинаковые. В блокноте про торты два разных правила — какое второе?' });
        if (!s.s1 || !s.s2) notes.push({ ok: false, html: 'Места 1 и 2 пусты: что система должна проверить, прежде чем брать деньги?' });
      } else notes.push({ ok: true, html: 'Две проверки до оплаты — 48 часов и мощность цеха. Порядок не важен.' });
      if (s.s3 !== 'timer') notes.push({ ok: false, html: s.s3 ? 'Сообщение не заставляет процесс ждать: торт пекут сразу после оплаты, за трое суток до праздника. Какой элемент держит токен до нужного дня?' : 'Место 3 пусто: что заставит процесс подождать до дня перед выдачей?' });
      if (s.s4 === 'xor') notes.push({ ok: false, html: 'Шлюз «или — или» пускает только одну ветку: клиенту напомнили, а торт никто не испёк. А нужно и то и другое.' });
      else if (!s.s4) notes.push({ ok: false, html: 'Место 4 пусто: как запустить сразу две ветки — напоминание и выпечку?' });
      if (s.s5 === 'xor') notes.push({ ok: false, html: 'Слияние «или — или» пропускает каждую ветку отдельно: «Готов» отмечают дважды, и первый раз — до того, как торт испекли. Какой шлюз дождётся обеих веток?' });
      else if (!s.s5) notes.push({ ok: false, html: 'Место 5 пусто: где ветки сходятся, кто-то должен их дождаться.' });
      else if (s.s5 === 'or' && s.s4 === 'and') notes.push({ ok: 'warn', html: 'Работает, но смешаны типы: что разделили «и», то и сливают «и». Так схему читать проще.' });
      if (ev.orPair) notes.push({ ok: 'warn', html: 'Пара «и/или» → «и/или» работает, но условия здесь всегда «да»: обе ветки нужны в каждом заказе. Параллельный шлюз «и» говорит это прямо.' });
      if (s.s6 !== 'msg') notes.push({ ok: false, html: s.s6 ? 'Таймер «через сутки» задерживает выдачу: торт стоит, клиент не знает, что он готов. Как клиент узнает о готовности сразу?' : 'Место 6 пусто: как клиент узнает, что торт готов?' });
      const miss = RUNS.filter(r => ans && ans.runs && ans.runs[r.k] !== 'ok');
      if (miss.length) notes.push({ ok: ev.slotsOk ? false : 'info', html: `Прогоны без ошибок: ${ev.runOk.length} из ${RUNS.length}. ${ev.slotsOk ? 'Прогоните токен: ' + miss.map(r => '«' + esc(r.t) + '»').join(', ') + '.' : 'Сначала поправьте схему — после правки прогоны сбрасываются.'}` });
      const ok = !!ev.slotsOk && ev.runOk.length === RUNS.length;
      return {
        ok, score: ev.score, notes,
        summary: `Места заполнены верно на ${Math.round(ev.slotS * 100)} %. Прогоны без ошибок: ${ev.runOk.length} из ${RUNS.length}.`,
        mentor: s.s5 === 'xor' && s.s4 === 'and' ? 'Посмотрите журнал прогона: «Напомнить» короче, чем «Испечь», поэтому его токен первым проходит слияние «или — или» — и «Готов» ставят пустой коробке. Это самая коварная ошибка BPMN: схема выглядит нормально, а процесс врёт.' : null
      };
    },
    explain: `<div class="board pr-dg">${bSvg(cakeModel({ s1: 'x48', s2: 'xcap', s3: 'timer', s4: 'and', s5: 'and', s6: 'msg' }), { minW: 560 })}</div>
      <ul class="checks">
        <li><b>1–2. Две проверки «или — или» до оплаты</b> — 48 часов и не больше 25 тортов на дату. Деньги не берут, пока не ясно, что цех успеет. Порядок проверок не важен. В праздники лимит — 60 с дополнительной сменой: это настройка лимита, а не новая схема.</li>
        <li><b>3. Таймер «за день до даты выдачи»</b>: после предоплаты процесс ждёт, иначе торт пекут за трое суток.</li>
        <li><b>4–5. «И» делит и «и» собирает</b>: напоминание и выпечка идут параллельно, а «Готов» ставят, только когда пришли обе ветки. Слияние «или — или» пропустило бы короткую ветку первой — и «Готов» достался бы пустой коробке.</li>
        <li><b>6. Сообщение «SMS: торт готов»</b> — клиент узнаёт сразу, а не звонит в пекарню.</li>
      </ul>
      <p>Статусы под токеном — та же статусная модель торта: <b>Заявка → Согласован → Предоплачен → В производстве → Готов → Выдан</b>, ветка <b>Отклонён</b>. Деньги по 54-ФЗ — два чека: «предоплата» и полного расчёта.</p>
      <p>Честно о том, чего на схеме нет: оплата может не пройти, клиент может отменить, кассир может оформить заявку за клиента по телефону (40 % постоянных клиентов старше 55 лет). Это ещё ветки и ещё одна дорожка — Лера про них спросит. Схема — договор о главном пути и главных развилках, а не всё сразу.</p>
      <p class="small muted">Источник: BPMN 2.0 (OMG; ISO/IEC 19510:2013) — поведение шлюзов описано через токены: параллельное слияние ждёт все входящие ветки, исключающее — пропускает каждую.</p>`,
    report: ans => { const ev = tbEval(ans); return SLOTS.map((sl, i) => `- ${i + 1}: ${ev.s[sl.id] ? SLOTV[ev.s[sl.id]].t : '—'} ${ev.p[sl.id] === 1 ? '✓' : ev.p[sl.id] ? '~' : '✗'}`).join('\n') + `\n- прогоны: ${RUNS.map(r => r.k + '=' + ((ans.runs || {})[r.k] || '—')).join(', ')}`; }
  };

  // =====================================================================
  // Практика 4. Gap-анализ: было → стало → что нужно от системы
  // =====================================================================
  const GM_TO = [
    { v: 't1', t: 'Одна запись заказа в системе: её видят кассир, технолог и кондитер' },
    { v: 't2', t: 'Фото и надпись прикреплены к заказу и видны на планшете в цехе' },
    { v: 't3', t: 'Заявку проверяют на 48 часов и загрузку цеха ещё до оплаты' },
    { v: 't4', t: 'Предоплата 50 % при оформлении, остаток — при выдаче' },
    { v: 't5', t: 'Без изменений: торт едет на точку с развозом' },
    { v: 't6', t: 'Клиенту приходит SMS: напоминание накануне и «торт готов»' },
    { v: 'tx', t: 'Свои курьеры развозят все торты по домам' }
  ];
  const GM_NEED = [
    { v: 'n1', t: 'Хранить заказ торта (дата, начинка, надпись, фото) и его статусы от «Заявка» до «Выдан»' },
    { v: 'n2', t: 'Прикреплять фото-образец к заказу и показывать его на экране цеха' },
    { v: 'n3', t: 'Не принимать торт ближе чем за 48 часов и сверх 25 на дату (в праздники — 60), предлагать другую дату' },
    { v: 'n4', t: 'Принимать 50 % онлайн с чеком «предоплата» в «КассаПро», при выдаче — чек полного расчёта' },
    { v: 'n5', t: 'Ничего нового: этот шаг процесса не меняется' },
    { v: 'n6', t: 'Отправлять SMS по таймеру за день до выдачи и при статусе «Готов»' },
    { v: 'nx', t: 'Сделать приложение красивым, как у Додо' }
  ];
  const GM = [
    { id: 'm1', was: 'Заказ — строка в тетради на кассе одной из 9 пекарен; технолог переписывает его на лист', to: 't1', need: 'n1', h: 'Тетрадь у кассы видит только эта касса. Что должно появиться вместо неё — и что для этого хранит система?' },
    { id: 'm2', was: 'Фото-образец уходит в личный мессенджер кондитера', to: 't2', need: 'n2', h: 'Где должно жить фото, чтобы кондитер не листал личный телефон?' },
    { id: 'm3', was: 'Принимают любой заказ; о перегрузе цеха узнают накануне вечером', to: 't3', need: 'n3', h: 'Какие два правила из блокнота должны сработать до того, как взяли деньги?' },
    { id: 'm4', was: 'Платят всю сумму при выдаче, предоплаты нет', to: 't4', need: 'n4', h: 'Сколько и когда платит клиент по правилу «Колоса» — и что требует 54-ФЗ при предоплате?' },
    { id: 'm5', was: 'Готовый торт едет на точку с утренним развозом', to: 't5', need: 'n5', h: 'Не каждый шаг — разрыв. Что в процессе работает и меняться не должно?' },
    { id: 'm6', was: 'Клиент узнаёт, готов ли торт, только когда приходит за ним', to: 't6', need: 'n6', h: 'Как клиент узнает, что торт готов, — и кто напомнит ему накануне?' }
  ];
  function gmEval(a) {
    const to = (a && a.to) || {}, need = (a && a.need) || {};
    const rows = GM.map(r => ({ r, to: to[r.id], need: need[r.id], okTo: to[r.id] === r.to, okNeed: need[r.id] === r.need }));
    const pts = rows.reduce((s, x) => s + (x.okTo ? 1 : 0) + (x.okNeed ? 1 : 0), 0);
    return { rows, pts, score: pts / (GM.length * 2) };
  }
  const gapmapTask = {
    id: 'gapmap', title: 'Gap-анализ: было → стало → что нужно от системы',
    simple: howErrors.simple,
    lead: ui.brief({
      situation: 'Схемы «как есть» и «как будет» согласованы с Галиной Ивановной и Павлом. Игорь: «Мне нужна таблица для отчёта по обследованию: что меняется и что из этого строить. Дима по ней оценит разработку». Шесть строк «было» Ксения уже выписала.',
      todo: [
        'Для каждой строки «Было» выберите, что «Стало» по схеме «как будет».',
        'Во втором списке выберите, что для этого нужно от системы. В каждом списке есть вариант-ловушка.',
        'Нажмите «Проверить». Засчитывается от 10 верных ответов из 12.'
      ],
      look: 'Не каждый разрыв — новая функция: что-то в процессе может остаться как есть. Последний столбец — будущие требования: у каждого появится номер, источник (этот разрыв) и критерии приёмки.'
    }),
    blank: () => ({ to: {}, need: {} }),
    reference: () => ({ to: Object.fromEntries(GM.map(r => [r.id, r.to])), need: Object.fromEntries(GM.map(r => [r.id, r.need])) }),
    render(el, ctx) {
      el.classList.add('pr-root');
      const a = ctx.ans; a.to = a.to || {}; a.need = a.need || {};
      const ev = (ctx.result || ctx.readonly) ? gmEval(a) : null;
      const toO = TR.shuffle(GM_TO, 'pr-gm-to'), needO = TR.shuffle(GM_NEED, 'pr-gm-need');
      el.innerHTML = `<div class="stack">${sysBtn('screens/shop', 'Открыть систему «Колос»: планшет цеха', 'Как выглядят торты с фото и загрузка «18 из 25» на экране цеха.')}<div class="pr-gm">${GM.map(r => {
        const x = ev ? ev.rows.find(y => y.r.id === r.id) : null, k = x ? (x.okTo && x.okNeed ? 'ok' : x.okTo || x.okNeed ? 'warn' : 'bad') : '';
        return `<div class="pr-gr ${k}"><div class="was"><span class="pr-lbl">Было</span><span>${esc(r.was)}</span></div>
          <label class="fld"><span class="pr-lbl">Стало</span><select data-to="${r.id}" ${ctx.readonly ? 'disabled' : ''}><option value="">Выберите…</option>${toO.map(o => `<option value="${o.v}" ${a.to[r.id] === o.v ? 'selected' : ''}>${esc(o.t)}</option>`).join('')}</select></label>
          <label class="fld"><span class="pr-lbl">Что нужно от системы</span><select data-need="${r.id}" ${ctx.readonly ? 'disabled' : ''}><option value="">Выберите…</option>${needO.map(o => `<option value="${o.v}" ${a.need[r.id] === o.v ? 'selected' : ''}>${esc(o.t)}</option>`).join('')}</select></label>
          ${x && !(x.okTo && x.okNeed) && !ctx.readonly ? `<div class="why">${esc(r.h)}</div>` : ''}</div>`;
      }).join('')}</div></div>`;
      if (!ctx.readonly) el.addEventListener('change', e => {
        const t = e.target.closest('[data-to]'), n = e.target.closest('[data-need]');
        if (t) { if (t.value) a.to[t.dataset.to] = t.value; else delete a.to[t.dataset.to]; }
        if (n) { if (n.value) a.need[n.dataset.need] = n.value; else delete a.need[n.dataset.need]; }
        if (t || n) { ctx.save(); const row = (t || n).closest('.pr-gr'); row.classList.remove('ok', 'warn', 'bad'); const w = TR.$('.why', row); if (w) w.remove(); }
      });
      onSys(el);
    },
    check(ans) {
      const ev = gmEval(ans), notes = [];
      const empty = ev.rows.filter(x => !x.to || !x.need).length;
      if (empty) notes.push({ ok: false, html: `Не заполнено строк: ${empty}.` });
      ev.rows.forEach((x, i) => {
        if (!x.to && !x.need) return;
        if (x.okTo && x.okNeed) return;
        const trap = x.to === 'tx' || x.need === 'nx';
        notes.push({ ok: false, html: `Строка ${i + 1}: ${trap ? (x.to === 'tx' ? 'своя курьерская служба — не в первой версии (Won’t). ' : '«красиво, как у Додо» — вкус, а не потребность. ') : ''}${esc(x.r.h)}` });
      });
      const m5 = ev.rows.find(x => x.r.id === 'm5');
      const ok = ev.pts >= 10 && !ev.rows.some(x => x.to === 'tx' || x.need === 'nx');
      if (ok) notes.push({ ok: true, html: 'Таблица разрывов готова: пять изменений и один шаг, который остаётся как есть.' });
      return {
        ok, score: ev.score, notes,
        summary: `Верных ответов: ${ev.pts} из ${GM.length * 2}.`,
        mentor: m5 && m5.to && !m5.okTo ? 'Развоз в 06:30 и 11:00 работает. Gap-анализ — это не «поменять всё», а честно отметить, что меняем, а что оставляем. Так в оценку Димы не попадёт лишняя работа.' : null
      };
    },
    explain: `${ui.table(['Было', 'Стало', 'Что нужно от системы'], GM.map(r => [esc(r.was), esc(GM_TO.find(o => o.v === r.to).t), esc(GM_NEED.find(o => o.v === r.need).t)]))}
      <p>Каждая строка последнего столбца — кандидат в требование. На следующем шаге ему дадут номер, источник (этот разрыв и факт из блокнота) и критерии приёмки — и всё это потянется к цели БЦ-3: ни одного потерянного торта к 8 Марта 2027.</p>
      <p>Строка про развоз — не ошибка в таблице, а её смысл: gap-анализ показывает и то, что остаётся как есть. Иначе в оценку попадёт «доработка развоза», которую никто не просил. А «свои курьеры» и «как у Додо» — ловушки: первое не входит в первую версию, второе — вкус, а не потребность.</p>
      <p>В жизни в такой таблице бывает ещё столбец «изменение правил и обучение»: например, кто решает про дополнительную праздничную смену. Не каждый разрыв закрывается программой.</p>
      <p class="small muted">Источник: BABOK v3 — «Определение будущего состояния», «Определение стратегии изменений» (анализ разрывов).</p>`,
    report: ans => gmEval(ans).rows.map(x => `- ${x.r.was} → ${x.to ? GM_TO.find(o => o.v === x.to).t : '—'} ${x.okTo ? '✓' : '✗'} | ${x.need ? GM_NEED.find(o => o.v === x.need).t : '—'} ${x.okNeed ? '✓' : '✗'}`).join('\n')
  };

  // =====================================================================
  // Практика 5. Ответ Нине своими словами
  // =====================================================================
  const W_RUBRIC = [
    'Схема «как есть» показывает, как на самом деле: тетрадь на кассе, фото в личном мессенджере кондитера, лист технолога, оплата только при выдаче',
    'Называет разрывы: нет единой записи, нет предоплаты, фото и надпись теряются, никто не проверяет мощность цеха и срок 48 часов',
    'Описывает «как будет»: одна запись торта, проверки 48 часов и до 25 тортов на дату, предоплата 50 % с чеком, фото на планшете в цехе, SMS',
    'Связывает с целью: ни одного потерянного торта к 8 Марта 2027 (БЦ-3), 2–3 сорванных заказа в неделю сейчас, 9 потерянных к прошлому 8 Марта',
    'Схема — общий язык и основа требований: по ней договорились Нина, Галина Ивановна и Павел, по ней оценивает Дима; разрывы превратились в требования, а что-то осталось как есть'
  ];
  const W_REF = 'Нина Сергеевна, эти картинки — не украшение, а способ найти, где именно теряются торты. Мы нарисовали, как заказ идёт сейчас: тетрадь на кассе, фото в личном мессенджере кондитера, лист, который Галина Ивановна переписывает накануне, оплата только при выдаче. На схеме сразу видно четыре разрыва: нет единой записи заказа, нет предоплаты, фото и надпись теряются по дороге, никто не проверяет, успеет ли цех и есть ли 48 часов. Отсюда 2–3 сорванных заказа в неделю и 9 потерянных тортов к прошлому 8 Марта. Потом мы нарисовали, как будет: одна запись торта, которую видят кассир, технолог и кондитер; система не примет торт ближе чем за 48 часов и сверх 25 на день; предоплата 50 % с чеком; фото — на планшете в цехе; SMS накануне и когда торт готов. Каждый разрыв превратился в требование к системе, а развоз мы менять не будем — он работает. По этой схеме вы, Галина Ивановна и Павел договорились, как будет, и по ней же Дима оценит работу. Это прямой путь к вашей цели — ни одного потерянного торта к 8 Марта 2027.';
  const whyTask = {
    id: 'why', title: 'Ответьте Нине: зачем вы рисовали картинки',
    simple: {
      icon: '💬',
      plain: 'Заказчику не нужна нотация — ему нужно знать, что схема дала его бизнесу: где теряются деньги и заказы и что изменится.',
      analogy: 'Технолог не объясняет директору, как читать техкарту. Он говорит: «Мы нашли, почему торты выходят разными, — вот что поменяем».',
      tech: 'Модели процессов — инструмент общего понимания и источник требований: разрывы AS-IS/TO-BE трассируются к бизнес-целям (BABOK v3, «Анализ стратегии»). Говорить с заказчиком — на языке его целей, без терминов нотации.'
    },
    lead: ui.brief({
      situation: 'Пятница, звонок Нины Сергеевны: «Игорь говорит, вы три дня рисовали картинки. Я вам за обследование плачу шестьсот тысяч. Сделайте уже приложение — и торты перестанут теряться».',
      todo: [
        'Напишите ответ Нине Сергеевне: 6–10 предложений, от 300 символов. Без слов «BPMN», «шлюз», «токен» — она их не знает.',
        'Скажите, что показала схема «как есть», что изменится, как это связано с её целью и зачем это было нужно до приложения.',
        'Нажмите «Проверить с Ксенией (Claude)» или «Сверить с эталоном самому» и честно отметьте раскрытые пункты. Засчитывается от 60 %.'
      ],
      lookTitle: 'На что опереться',
      look: 'Ваши схемы и таблица разрывов из заданий выше. Цифры: 2–3 сорванных заказа в неделю, к прошлому 8 Марта — 140 тортов за 3 дня, 9 потеряли; цель — ни одного потерянного к 8 Марта 2027. Договор: обследование — 3 недели, 600 тыс. ₽, в него входит описать процессы «как есть» и «как будет».'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: W_REF, self: W_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('pr-root');
      el.insertAdjacentHTML('beforeend', `<div class="talk">${ui.say('nina', 'Сделайте уже приложение — и торты перестанут теряться. Зачем картинки?')}</div>`);
      const j = document.createElement('div'); j.style.marginTop = '12px'; el.appendChild(j);
      ui.justify(j, {
        id: 'pr-why', q: 'Ответ Нине Сергеевне: что дали схемы «как есть» и «как будет»?', placeholder: 'Нина Сергеевна, …',
        qPlain: 'Напишите ответ владелице сети пекарен, которая считает, что моделировать процессы не нужно, а нужно сразу делать приложение. Объясните без терминов нотации: что показала схема текущего процесса заказа торта (тетрадь, личный мессенджер, лист технолога, оплата при выдаче), какие разрывы нашлись (нет единой записи, нет предоплаты, фото теряется, нет проверки мощности и 48 часов), что изменится (одна запись, проверки, предоплата 50 % с чеком, фото на планшете, SMS), как это связано с целью «ни одного потерянного торта к 8 Марта» и почему схема — общий язык и основа требований.',
        rubric: W_RUBRIC, reference: W_REF, value: ctx.ans.j, readonly: ctx.readonly, minLen: 300,
        onChange: v => { ctx.ans.j = v; ctx.save(); ctx.decide('Ответ Нине: зачем схемы', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j);
      return {
        ok: s >= 0.6, score: s,
        summary: s ? `Оценка ответа: ${Math.round(s * 100)} %.` : 'Напишите ответ (от 300 символов) и проверьте его с Ксенией или сверьте с эталоном сами.',
        notes: s && s < 0.6 ? [{ ok: false, html: 'Нине важно не «как мы рисовали», а «что нашли и что изменится для тортов». Начните с её боли — 9 потерянных тортов — и покажите, где именно они терялись.' }] : []
      };
    },
    explain: '<p>Сильный ответ говорит на языке Нины: не «мы построили модель AS-IS в нотации BPMN», а «мы нашли, где теряются торты». Схема — не цель, а способ увидеть разрывы, договориться с Галиной Ивановной и Павлом и не написать лишнего.</p><p>Напомните о договоре: описать процессы «как есть» и «как будет» — часть обследования, за которое она платит. Без этого разработка начнётся с «приложения как у Додо», а торты продолжат теряться в той же тетради — только теперь с красивыми кнопками.</p><p class="small muted">Источник: BABOK v3 — модели процессов как общий язык заинтересованных лиц; трассировка требований к бизнес-целям.</p>',
    report: ans => (ans.j && ans.j.text) ? ans.j.text : '—'
  };

  // =====================================================================
  TR.stage({
    id: ID, act: 4, order: 340, slot: 'Чт 10:00', title: 'Процессы «как есть» и «как будет»',
    when: 'четверг, 29 октября, 10:00 · переговорная «Квант Софт», на стене — четыре дорожки из малярного скотча',
    intro: [
      { who: 'galya', html: 'Торты у нас теряются не у кассы и не в цеху, а между ними. Кассир записала, кондитер получила фото в телефон, я переписала на лист — и где-то по дороге «С юбилеем» превратилось в «С днём рождения».' },
      { who: 'dima', html: 'А мне нужна одна картинка: кто что делает, где решение и где система. Абзацем это не прочитать.' },
      { who: 'ksenia', html: 'Сегодня рисуем процесс заказа торта: сначала «как есть» — честно, с тетрадью и личным телефоном кондитера, — потом «как будет». Разница между картинками — это разрывы, а из разрывов вырастают требования. Язык схем — BPMN; начнём с соседнего примера, возврата обуви в магазине.' }
    ],
    facts: ['F-cake48', 'F-cakeloss', 'F-cakephoto', 'F-cakecap', 'F-54fz', 'F-deadline'],
    glossary: [
      { term: 'Бизнес-процесс', simple: 'Кто, что и в каком порядке делает, чтобы получить результат: от звонка клиента до торта в руках.', tech: 'Последовательность действий участников, которая по событию-триггеру приводит к результату, ценному для клиента или бизнеса.' },
      { term: 'Модель «как есть» (AS-IS)', simple: 'Честная картинка, как работают сейчас — с тетрадями и обходными путями.', tech: 'Модель текущего состояния процесса. Строится по интервью, наблюдению и документам; основа для поиска разрывов (BABOK v3, «Анализ текущего состояния»).' },
      { term: 'Модель «как будет» (TO-BE)', simple: 'Картинка, как будет работать после изменений.', tech: 'Модель целевого состояния процесса: что делают люди, что система, какие правила и проверки (BABOK v3, «Определение будущего состояния»).' },
      { term: 'BPMN 2.0', simple: 'Язык значков для процессов: кружки, прямоугольники, ромбы, полосы.', tech: 'Business Process Model and Notation — нотация моделирования бизнес-процессов, стандарт OMG (2011), ISO/IEC 19510:2013. Поведение схемы описывают через токен, который бежит по потокам управления.' },
      { term: 'Событие', simple: 'Что-то случилось: пришёл заказ, наступило 23:00, процесс закончился.', tech: 'Кружок BPMN: начальное (тонкий), промежуточное (двойной — таймер, сообщение), конечное (толстый).' },
      { term: 'Задача', simple: 'Одно действие одного исполнителя: «Записать заказ».', tech: 'Атомарная работа в процессе; название — «глагол + объект». Если её надо раскрыть подробнее — подпроцесс.' },
      { term: 'Шлюз', simple: 'Развилка: «или — или», «и», «и/или».', tech: 'Ромб BPMN: исключающий (XOR — ровно одна ветка по условию), параллельный (AND — все ветки, слияние ждёт все), включающий (OR — ветки с верными условиями). Слияние — шлюзом того же типа.' },
      { term: 'Дорожка и пул', simple: 'Дорожка — полоса исполнителя (кассир, цех, система). Пул — отдельный участник со своим процессом (магазин, покупатель, банк).', tech: 'Lane — роль или подразделение внутри участника; pool — участник взаимодействия. Свёрнутый пул — «чёрный ящик», внутренности которого не моделируют.' },
      { term: 'Поток управления и поток сообщений', simple: 'Сплошная стрелка — что за чем внутри одного участника. Пунктир — письмо или звонок между участниками.', tech: 'Sequence flow — порядок внутри пула, не пересекает его границу; message flow — обмен между пулами.' },
      { term: 'Анализ разрывов (gap-анализ)', simple: 'Сравнить «как есть» и «как будет» и выписать, что меняется и что для этого нужно.', tech: 'Таблица «было → стало → что нужно»: разрывы закрываются требованиями к системе, изменением правил или обучением; то, что не меняется, тоже фиксируют.' }
    ],
    outro: 'Теперь вы читаете и рисуете процесс в BPMN: события, задачи, шлюзы «или — или», «и» и «и/или», дорожки и пулы, потоки управления и сообщений — и проверяете схему, прогоняя по ней токен. Вы честно собрали заказ торта «как есть», нашли четыре разрыва, построили «как будет» с проверками 48 часов и мощности цеха, таймером и параллельными ветками и превратили разрывы в будущие требования. Завтра утром — ценность и приоритеты: что из этого войдёт в первую версию к 1 марта.',
    tasks: [howWhy, howBpmn, howErrors, asisTask, gapsTask, tobeTask, gapmapTask, whyTask]
  });
})();
