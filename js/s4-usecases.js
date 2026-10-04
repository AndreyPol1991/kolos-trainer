/* Неделя 4, вторник 10:00: сценарии использования (use case) по Коберну.
   Теория (соседний пример — банкомат «Снять наличные»): части сценария и что ломается без каждой, уровни цели
   (облако, воздушный змей, море, рыба, моллюск), минимальные гарантии и гарантии успеха; основной поток и расширения
   с ветвлением, шаги без интерфейса, правила хорошего шага; UML-диаграмма вариантов использования (слои, include/extend,
   типичные ошибки) и сравнение «история или сценарий» по ситуациям.
   Практика: собрать шапку и основной поток «Оформить предзаказ»; лаборатория «Прогоните сценарий» — ветки и реакции
   системы; разметить диаграмму вариантов использования «Колоса» (живая SVG); переписать шаги без интерфейса
   (мини-редактор); записка команде — когда история, когда сценарий. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'usecases';

  if (!document.getElementById('uc-css')) document.head.insertAdjacentHTML('beforeend', `<style id="uc-css">
    .uc-root, .uc-root .stack > * { min-width: 0; }
    .uc-root .seg button { white-space: normal; text-align: left; }
    .uc-two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px; align-items: start; }
    .uc-two > * { min-width: 0; }
    .uc-lbl { font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .uc-card { border: 1px solid var(--border-strong); border-radius: 12px; background: var(--surface); padding: 12px 14px; display: grid; grid-template-columns: minmax(0, 1fr); gap: 8px; }
    .uc-card > * { min-width: 0; }
    .uc-tpl { display: grid; gap: 6px; }
    .uc-part { display: grid; grid-template-columns: 170px minmax(0, 1fr) auto; gap: 6px 12px; align-items: start; padding: 8px 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); font-size: 14px; }
    .uc-part > * { min-width: 0; }
    .uc-part .k { font: 600 11px/1.5 var(--f-mono); letter-spacing: .06em; text-transform: uppercase; color: var(--accent); padding-top: 2px; }
    .uc-part .v ol { margin: 0; padding-left: 18px; display: grid; gap: 2px; }
    .uc-part.off { border-color: var(--bad); background: var(--bad-soft); }
    .uc-part.off .v { text-decoration: line-through; color: var(--text-muted); }
    .uc-part.off .k { color: var(--bad); }
    .uc-part .brk { grid-column: 1 / -1; font-size: 13.5px; color: var(--bad); }
    .uc-ladder { display: grid; gap: 6px; }
    .uc-lv { display: grid; grid-template-columns: 40px minmax(0, 1fr); gap: 10px; align-items: center; padding: 8px 12px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface); text-align: left; color: var(--text); width: 100%; }
    .uc-lv .i { font-size: 24px; text-align: center; }
    .uc-lv .t { font: 600 14.5px/1.25 var(--f-brand); }
    .uc-lv .s { font-size: 12.5px; color: var(--text-muted); }
    .uc-lv.sea { background: color-mix(in srgb, var(--info) 14%, var(--surface)); border-color: color-mix(in srgb, var(--info) 45%, var(--border)); }
    .uc-lv[aria-pressed="true"] { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent) inset; }
    .uc-goal { display: grid; gap: 6px; padding: 8px 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); }
    .uc-goal.ok { border-color: var(--ok); } .uc-goal.bad { border-color: var(--bad); }
    .uc-goal .row { gap: 4px; }
    .uc-ib { min-width: 38px; height: 34px; border-radius: 8px; border: 1px solid var(--border-strong); background: var(--surface-2); font-size: 17px; padding: 0 6px; color: var(--text); }
    .uc-ib[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .uc-why { font-size: 13px; color: var(--text-2); }
    .uc-flow { display: grid; gap: 4px; }
    .uc-st { display: grid; grid-template-columns: 28px minmax(0, 1fr); gap: 8px; align-items: start; padding: 6px 10px; border-left: 3px solid var(--accent); background: var(--surface); border-radius: 0 8px 8px 0; font-size: 13.5px; line-height: 1.4; }
    .uc-st > * { min-width: 0; }
    .uc-st .n { width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center; background: var(--accent-soft); color: var(--accent); font: 700 12px/1 var(--f-mono); }
    .uc-st.cur { background: var(--accent-soft); box-shadow: 0 0 0 1px var(--accent) inset; }
    .uc-br { margin-left: 34px; display: grid; grid-template-columns: 38px minmax(0, 1fr); gap: 4px 8px; align-items: start; padding: 6px 10px; border: 1px dashed var(--border-strong); border-left: 3px solid var(--border-strong); border-radius: 0 8px 8px 0; font-size: 13px; line-height: 1.4; background: var(--surface); }
    .uc-br > * { min-width: 0; }
    .uc-br .lab { font: 700 12px/1.5 var(--f-mono); color: var(--text-2); }
    .uc-br .go { grid-column: 2; font-size: 12.5px; font-weight: 600; }
    .uc-br.alt { border-left-color: var(--ok); } .uc-br.alt .go { color: var(--ok); }
    .uc-br.exc { border-left-color: var(--bad); } .uc-br.exc .go { color: var(--bad); }
    .uc-br.pend .go { color: var(--warn); }
    .uc-br.m-ok { border-color: var(--ok); border-style: solid; }
    .uc-br.m-warn { border-color: var(--warn); border-style: solid; background: var(--warn-soft); }
    .uc-br.m-bad { border-color: var(--bad); border-style: solid; background: var(--bad-soft); }
    .uc-lab { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr); gap: 16px; align-items: start; }
    .uc-lab > * { min-width: 0; }
    .uc-now { border: 1px solid var(--accent); background: var(--accent-soft); border-radius: 10px; padding: 10px 12px; font-size: 14.5px; display: grid; gap: 4px; }
    .uc-evs { display: grid; gap: 6px; }
    .uc-ev { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 8px; align-items: start; text-align: left; padding: 8px 10px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); color: var(--text); width: 100%; font-size: 13.5px; line-height: 1.4; }
    .uc-ev .mk { width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid var(--border-strong); margin-top: 1px; }
    .uc-ev[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .uc-ev[aria-pressed="true"] .mk { background: var(--accent); border-color: var(--accent); box-shadow: inset 0 0 0 3px var(--surface); }
    .uc-ends { display: grid; gap: 5px; padding: 8px 10px; border: 1px dashed var(--border-strong); border-radius: 10px; background: var(--surface-2); }
    .uc-end { text-align: left; padding: 6px 10px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); color: var(--text); width: 100%; font-size: 13px; line-height: 1.4; }
    .uc-end[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .uc-dg svg { display: block; }
    .uc-layers { display: flex; flex-wrap: wrap; gap: 6px 14px; }
    .uc-sits { display: grid; gap: 6px; }
    .uc-sit { text-align: left; padding: 8px 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); color: var(--text); width: 100%; font-size: 13.5px; }
    .uc-sit[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .uc-cmp { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 12px; align-items: start; }
    .uc-cmp > * { min-width: 0; }
    .uc-cmp .uc-card.win { border-color: var(--ok); box-shadow: 0 0 0 1px var(--ok) inset; }
    .uc-cmp .uc-card.dim { opacity: .55; }
    .uc-cmp ol, .uc-cmp ul { margin: 0; padding-left: 18px; display: grid; gap: 2px; font-size: 13px; }
    .uc-mark { background: color-mix(in srgb, var(--bad) 22%, transparent); border-bottom: 2px solid var(--bad); border-radius: 3px; padding: 0 2px; }
    .uc-rw { border: 1px solid var(--border); border-radius: 12px; padding: 12px 14px; background: var(--surface); display: grid; grid-template-columns: minmax(0, 1fr); gap: 8px; }
    .uc-rw > * { min-width: 0; }
    .uc-rw.ok { border-color: var(--ok); } .uc-rw.warn { border-color: var(--warn); } .uc-rw.bad { border-color: var(--bad); }
    .uc-rw .was { font-size: 14px; padding: 7px 10px; border-radius: 8px; background: var(--surface-2); line-height: 1.6; }
    .uc-rw textarea { min-height: 52px; }
    .uc-feats { display: flex; flex-wrap: wrap; gap: 6px; }
    .uc-feats .chip { white-space: normal; }
    .uc-good { display: grid; gap: 6px; }
    .uc-gs { display: grid; gap: 6px; padding: 8px 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); font-size: 14px; }
    .uc-gs.ok { border-color: var(--ok); } .uc-gs.bad { border-color: var(--bad); }
    @media (max-width: 760px) {
      .uc-two, .uc-lab, .uc-cmp { grid-template-columns: minmax(0, 1fr); }
      .uc-part { grid-template-columns: minmax(0, 1fr) auto; }
      .uc-part .k { grid-column: 1; }
      .uc-part .v { grid-column: 1 / -1; grid-row: 2; }
      .uc-part > button { grid-column: 2; grid-row: 1; }
    }
    @media (max-width: 440px) {
      .uc-br { margin-left: 14px; }
    }
  </style>`);

  // ---------- общие помощники ----------
  const fresh = fn => pane => { const d = document.createElement('div'); pane.appendChild(d); fn(d); };
  const chip = (t, k) => `<span class="chip ${k || ''}">${t}</span>`;
  const quizRef = cfg => cfg.options.map((o, i) => o.ok ? i : -1).filter(i => i >= 0);
  const LETTER = 'абвгд';
  const goText = g => !g ? 'реакция системы не выбрана' : g === 'x' ? '✕ конец: цель не достигнута' : g[0] === 'r' ? `↩ возврат к шагу ${g.slice(1)}` : `→ дальше с шага ${g.slice(1)}`;
  const goKind = g => !g ? 'pend' : g === 'x' ? 'exc' : 'alt';
  // Карта сценария: основной поток и ветки (номера расширений — как у Коберна: 7а, 7б)
  function flowMap(steps, branches, cur) {
    return `<div class="uc-flow">${steps.map((s, i) => {
      const bs = branches.filter(b => b.step === i + 1);
      return `<div class="uc-st ${cur === i ? 'cur' : ''}"><span class="n">${i + 1}</span><span>${esc(s)}</span></div>` + bs.map((b, j) => `<div class="uc-br ${goKind(b.go)} ${b.mark ? 'm-' + b.mark : ''}"><span class="lab">${i + 1}${LETTER[j]}</span><span>${esc(b.t)}${b.react ? `<br><span class="small muted">${esc(b.react)}</span>` : ''}</span><span class="go">${goText(b.go)} · ${b.go ? (b.go === 'x' ? 'исключение' : 'альтернатива') : '?'}</span></div>`).join('');
    }).join('')}</div>`;
  }
  const sysBtn = () => `<div class="row"><button type="button" class="btn sm" data-sys>Открыть систему «Колос»</button><span class="small muted">Живой сценарий заказа с кнопками «что если» — посмотрите, как ветки выглядят в работающей системе.</span></div>`;
  const onSys = root => TR.on(root, 'click', '[data-sys]', () => { if (TR.system && TR.system.open) TR.system.open('scenario'); else ui.toast('Живая система «Колос» ещё собирается — загляните позже', 'warn'); });

  // Диаграмма вариантов использования (UML): акторы слева и справа, граница системы, эллипсы, include/extend
  function wrapWords(t, max) {
    const out = []; let line = '';
    String(t).split(/\s+/).forEach(w => { if ((line + ' ' + w).trim().length > max && line) { out.push(line); line = w; } else line = (line + ' ' + w).trim(); });
    if (line) out.push(line);
    return out;
  }
  function ucDiagram(o) {
    const W = o.W || 760, ROW = 72, top = 56;
    const L = o.left || [], R = o.right || [], U = o.ucs || [];
    const hide = o.hide || {}, bad = o.bad || {};
    const col1 = new Set(o.col1 || []);
    const c0 = U.filter(u => !col1.has(u.id)), c1 = U.filter(u => col1.has(u.id));
    const n = Math.max(L.length, R.length, c0.length, c1.length, 2);
    const H = top + n * ROW + 20;
    const bx1 = 140, bx2 = W - 160;
    const two = c1.length > 0 && c0.length > 0;
    const colX = two ? [bx1 + (bx2 - bx1) * 0.25, bx1 + (bx2 - bx1) * 0.76] : [(bx1 + bx2) / 2];
    const rx = two ? (bx2 - bx1) * 0.17 : (bx2 - bx1) * 0.28, ry = 25;
    const yOf = (i, cnt) => top + (n * ROW) * (i + 0.5) / Math.max(1, cnt);
    const P = {};
    L.forEach((a, i) => { P[a.id] = { x: 64, y: yOf(i, L.length), k: 'actor', side: 'L' }; });
    R.forEach((a, i) => { P[a.id] = { x: W - 74, y: yOf(i, R.length), k: a.human ? 'actor' : 'sys', side: 'R' }; });
    (two ? c0 : U).forEach((u, i, arr) => { P[u.id] = { x: colX[0], y: yOf(i, arr.length), k: 'uc' }; });
    if (two) c1.forEach((u, i) => { P[u.id] = { x: colX[1], y: yOf(i, c1.length), k: 'uc' }; });
    const edge = (p, q) => {
      if (p.k === 'uc') { const dx = q.x - p.x, dy = q.y - p.y, t = 1 / Math.sqrt((dx / rx) ** 2 + (dy / ry) ** 2 || 1); return { x: p.x + dx * t, y: p.y + dy * t }; }
      if (p.k === 'sys') return { x: p.x - 62, y: p.y };
      return { x: p.x + (p.side === 'R' ? -18 : 18), y: p.y - 8 };
    };
    const mk = `${o.id || 'ucd'}-${TR.hash(JSON.stringify([L, R, U].map(a => a.map(x => x.id))))}`;
    const stroke = id => o.hl === id ? 'var(--accent)' : bad[id] ? 'var(--bad)' : 'var(--text-2)';
    let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="min-width:560px;max-width:${W + 120}px" role="img" aria-label="${esc(o.title || 'Диаграмма вариантов использования')}">
      <defs><marker id="${mk}-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10" style="fill:none;stroke:var(--violet);stroke-width:1.6"/></marker>
      <marker id="${mk}-s" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" style="fill:var(--bad)"/></marker></defs>`;
    if (!hide.boundary) s += `<g data-el="boundary" style="cursor:pointer"><rect x="${bx1}" y="14" width="${bx2 - bx1}" height="${H - 24}" rx="14" style="fill:color-mix(in srgb, var(--surface-2) 70%, transparent);stroke:${o.hl === 'boundary' ? 'var(--accent)' : 'var(--border-strong)'};stroke-width:${o.hl === 'boundary' ? 2.5 : 1.6}"/><text x="${bx1 + 14}" y="36" style="fill:var(--text-muted);font:600 13px var(--f-brand)">${esc(o.title || 'Система')}</text></g>`;
    const line = (p, q, st) => { const a = edge(p, q), b = edge(q, p); return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" style="${st}"/>`; };
    // слои: линии → эллипсы (непрозрачные, прячут пересечения) → подписи стрелок → акторы
    if (!hide.assoc) (o.assoc || []).forEach(([a, b]) => { if (P[a] && P[b]) s += line(P[a], P[b], 'stroke:var(--text-2);stroke-width:1.5'); });
    const labels = [];
    const dep = (from, to, label, kind) => {
      const p = P[from], q = P[to]; if (!p || !q) return '';
      const a = edge(p, q), b = edge(q, p), mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      if (label) labels.push(`<text x="${mx}" y="${my - 5}" text-anchor="middle" style="fill:var(--violet);font:600 12px var(--f-mono);paint-order:stroke;stroke:var(--surface-2);stroke-width:5px">${esc(label)}</text>`);
      return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" style="stroke:${kind === 'seq' ? 'var(--bad)' : 'var(--violet)'};stroke-width:1.6;${kind === 'seq' ? '' : 'stroke-dasharray:6 4'}" marker-end="url(#${mk}-${kind === 'seq' ? 's' : 'a'})"/>`;
    };
    if (!hide.inc) (o.inc || []).forEach(([a, b]) => { s += dep(a, b, '«include»'); });
    if (!hide.ext) (o.ext || []).forEach(([a, b]) => { s += dep(a, b, '«extend»'); });
    (o.seq || []).forEach(([a, b]) => { s += dep(a, b, '', 'seq'); });
    if (!hide.ucs) U.forEach(u => {
      const p = P[u.id], ls = wrapWords(u.t, Math.max(12, Math.floor(rx / 3.9)));
      s += `<g data-el="${esc(u.id)}" style="cursor:pointer"><ellipse cx="${p.x}" cy="${p.y}" rx="${rx}" ry="${ry + (ls.length > 2 ? 6 : 0)}" style="fill:color-mix(in srgb, var(--warn) 12%, var(--surface));stroke:${stroke(u.id)};stroke-width:${o.hl === u.id || bad[u.id] ? 2.4 : 1.4}"/>`;
      ls.forEach((ln, j) => { s += `<text x="${p.x}" y="${p.y + 4 + (j - (ls.length - 1) / 2) * 14}" text-anchor="middle" style="fill:var(--text);font:500 12.5px var(--f-body)">${esc(ln)}</text>`; });
      s += '</g>';
    });
    s += labels.join('');
    if (!hide.actors) [...L, ...R].forEach(a => {
      const p = P[a.id], c = stroke(a.id), ls = wrapWords(a.t, p.k === 'sys' ? 14 : 15);
      s += `<g data-el="${esc(a.id)}" style="cursor:pointer">`;
      if (p.k === 'sys') {
        const h = 30 + ls.length * 14;
        s += `<rect x="${p.x - 62}" y="${p.y - h / 2}" width="124" height="${h}" rx="7" style="fill:var(--info-soft);stroke:${c};stroke-width:${o.hl === a.id || bad[a.id] ? 2.4 : 1.4}"/><text x="${p.x}" y="${p.y - h / 2 + 15}" text-anchor="middle" style="fill:var(--info);font:600 10.5px var(--f-mono)">«система»</text>`;
        ls.forEach((ln, j) => { s += `<text x="${p.x}" y="${p.y - h / 2 + 31 + j * 14}" text-anchor="middle" style="fill:var(--text);font:600 12px var(--f-body)">${esc(ln)}</text>`; });
      } else {
        const sw = `stroke:${c};stroke-width:${o.hl === a.id || bad[a.id] ? 2.6 : 1.8};fill:none`;
        s += `<circle cx="${p.x}" cy="${p.y - 26}" r="8" style="${sw}"/><line x1="${p.x}" y1="${p.y - 18}" x2="${p.x}" y2="${p.y + 4}" style="${sw}"/><line x1="${p.x - 13}" y1="${p.y - 10}" x2="${p.x + 13}" y2="${p.y - 10}" style="${sw}"/><path d="M${p.x - 11} ${p.y + 20} L${p.x} ${p.y + 4} L${p.x + 11} ${p.y + 20}" style="${sw}"/>`;
        ls.forEach((ln, j) => { s += `<text x="${p.x}" y="${p.y + 36 + j * 14}" text-anchor="middle" style="fill:var(--text);font:600 12px var(--f-body)">${esc(ln)}</text>`; });
      }
      s += '</g>';
    });
    Object.keys(bad).forEach(id => { const p = P[id]; if (!p) return; const x = p.k === 'uc' ? p.x + rx - 6 : p.x + 22, y = p.k === 'uc' ? p.y - ry : p.y - 38; s += `<circle cx="${x}" cy="${y}" r="10" style="fill:var(--bad)"/><text x="${x}" y="${y + 4}" text-anchor="middle" style="fill:var(--surface);font:700 12px var(--f-mono)">${esc(bad[id])}</text>`; });
    return s + '</svg>';
  }

  // =====================================================================
  // Теория 1. Сценарий по Коберну: части, уровни, гарантии (соседний пример — банкомат)
  // =====================================================================
  const ATM_STEPS = [
    'Клиент вставляет карту.',
    'Банкомат проверяет карту и просит ПИН-код.',
    'Клиент вводит ПИН-код.',
    'Банкомат проверяет ПИН-код через банк.',
    'Клиент выбирает сумму.',
    'Банкомат запрашивает у банка разрешение на списание.',
    'Банкомат возвращает карту.',
    'Банкомат выдаёт наличные, банк списывает сумму со счёта.'
  ];
  const ATM_PARTS = [
    { id: 'actor', k: 'Основной актор', v: 'Клиент банка. <span class="small muted">Вспомогательный актор — банк (процессинговый центр): внешняя система, которая проверяет ПИН и разрешает списание.</span>', brk: 'Непонятно, чьими глазами описан сценарий: клиента или инкассатора, который загружает кассеты. У них разные цели и разные шаги.' },
    { id: 'goal', k: 'Цель', v: 'Получить наличные со своего счёта.', brk: 'Нечем проверить, чем закончился сценарий — успехом или нет. Нет цели — нет и границ: где сценарий начинается и где кончается.' },
    { id: 'level', k: 'Уровень', v: '🌊 Море — пользовательская цель: один человек, один присест.', brk: 'В одном документе смешаются «управлять деньгами семьи» и «ввести ПИН-код»: сценарии выйдут то огромными, то мелкими, и их не сравнить.' },
    { id: 'stake', k: 'Заинтересованные лица и интересы', v: '<b>Клиент</b> — получить деньги и не потерять карту. <b>Банк</b> — выдать ровно столько, сколько списано, и не выдать без денег на счёте. <b>Инкассатор</b> — точный учёт купюр в кассетах.', brk: 'Забудут интерес банка — и при обрыве связи банкомат выдаст деньги «на доверии». Интересы тех, кого нет у экрана, защищает аналитик.' },
    { id: 'pre', k: 'Предусловие', v: 'Банкомат работает, в нём есть наличные.', brk: 'Тестировщик проверит сценарий на пустом банкомате и заведёт «ошибку». Предусловие — то, что уже верно до начала; внутри сценария его не проверяют.' },
    { id: 'trig', k: 'Триггер', v: 'Клиент вставляет карту.', brk: 'Неясно, с какого события всё начинается: с карты, с телефона у бесконтактного считывателя или с приложения банка.' },
    { id: 'min', k: 'Минимальные гарантии', v: 'Деньги не списываются без выдачи; каждая операция записана в журнал; карта возвращается клиенту или задерживается по правилам банка.', brk: 'Сбой на шаге 7 — и никто не знает, списаны ли деньги. Клиент в ярости, банк разбирается неделю. Минимальные гарантии верны при <b>любом</b> исходе.' },
    { id: 'succ', k: 'Гарантии успеха', v: 'Клиент получил наличные и карту; со счёта списана ровно выданная сумма; операция записана.', brk: 'Неясно, что должно быть правдой в конце: деньги выданы? списаны? записаны? Каждый поймёт «успех» по-своему.' },
    { id: 'main', k: 'Основной поток', v: `<ol>${ATM_STEPS.map(s => `<li>${esc(s)}</li>`).join('')}</ol>`, brk: 'Нет «ствола», от которого отходят ветки: непонятно, как выглядит обычный, самый частый путь.' },
    { id: 'ext', k: 'Расширения', v: '3а. ПИН-код неверный. 5а. Сумму нельзя выдать купюрами. 6а. На счёте не хватает денег. 6б. Нет связи с банком. 8а. Клиент не забрал деньги.', brk: 'Описан только «счастливый путь». Всё, что идёт не так, разработчик решит сам — или не решит вовсе. А ошибки живут именно здесь.' }
  ];
  function drawParts(pane) {
    const off = {};
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Сценарий использования (use case) по Алистеру Коберну — договор о поведении системы: кто чего хочет добиться, кому ещё это важно и что система обещает при любом исходе. Соседний пример — банкомат, сценарий «Снять наличные». Нажимайте «Убрать», чтобы увидеть, что ломается без каждой части.</p>
      <div class="uc-tpl" data-tpl></div><div data-sum></div></div>`;
    function draw() {
      TR.$('[data-tpl]', pane).innerHTML = ATM_PARTS.map(p => `<div class="uc-part ${off[p.id] ? 'off' : ''}"><span class="k">${esc(p.k)}</span><span class="v">${p.v}</span><button type="button" class="btn xs ${off[p.id] ? '' : 'ghost'}" data-off="${p.id}">${off[p.id] ? 'Вернуть' : 'Убрать'}</button>${off[p.id] ? `<span class="brk">✕ ${p.brk}</span>` : ''}</div>`).join('');
      const n = Object.values(off).filter(Boolean).length;
      TR.$('[data-sum]', pane).innerHTML = n ? ui.note(n >= 3 ? 'bad' : 'warn', `Убрано частей: ${n}`, 'Каждая часть отвечает на свой вопрос команды. Убираете часть — вопрос остаётся, только ответ на него дадут без вас: разработчик в коде, тестировщик в баг-репорте, клиент в жалобе.') : ui.note('info', 'Что здесь делает аналитик', 'Пишет сценарий вместе с теми, кто знает процесс, и проверяет его с разработчиком и тестировщиком. Особенно ценны части, о которых никто не вспомнит сам: интересы тех, кого нет у экрана, и минимальные гарантии.');
    }
    TR.on(pane, 'click', '[data-off]', (e, b) => { off[b.dataset.off] = !off[b.dataset.off]; draw(); });
    draw();
  }

  const LEVELS = [
    { id: 'cloud', ico: '☁️', t: 'Облако', sub: 'очень общая цель', ex: 'Пользоваться услугами банка', q: 'Цели всей организации или большой группы людей. Таких сценариев — один-два на систему, они дают общую картину.' },
    { id: 'kite', ico: '🪁', t: 'Воздушный змей', sub: 'сводная цель', ex: 'Управлять деньгами семьи', q: 'Объединяет несколько пользовательских целей, которые идут друг за другом за дни и недели.' },
    { id: 'sea', ico: '🌊', t: 'Море', sub: 'пользовательская цель', ex: 'Снять наличные', q: 'Одно дело одного человека за один присест — от пары минут до получаса. Тест кофе-брейка: сделал — и можно со спокойной душой пойти выпить кофе. Большинство сценариев пишут на этом уровне.' },
    { id: 'fish', ico: '🐟', t: 'Рыба', sub: 'подфункция', ex: 'Проверить ПИН-код', q: 'Кусок пользовательской цели, сам по себе пользы не даёт. В отдельный сценарий его выносят, только если он нужен в нескольких местах.' },
    { id: 'clam', ico: '🐚', t: 'Моллюск', sub: 'слишком мелко', ex: 'Проверить, что в ПИН-коде 4 цифры', q: 'На этом уровне сценарии не пишут: это строка правила или проверка в коде.' }
  ];
  const GOALS = [
    { t: 'Снять наличные', ok: 'sea' }, { t: 'Ввести ПИН-код', ok: 'fish' }, { t: 'Управлять деньгами семьи', ok: 'kite' },
    { t: 'Перевести деньги другу', ok: 'sea' }, { t: 'Проверить, что сумма кратна 100', ok: 'clam' }, { t: 'Пользоваться услугами банка', ok: 'cloud' }
  ];
  function drawLevels(pane) {
    let cur = 'sea';
    const got = {};
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Коберн раскладывает цели по высоте — от облаков до морского дна. Нажмите уровень, чтобы прочитать его, потом определите уровень шести целей справа.</p>
      <div class="uc-two"><div class="stack tight"><div class="uc-ladder" data-lad></div><div data-lvi></div></div><div class="stack tight"><div class="uc-lbl">На каком уровне эта цель?</div><div class="stack tight" data-gl></div><div data-gs></div></div></div></div>`;
    function draw() {
      TR.$('[data-lad]', pane).innerHTML = LEVELS.map(l => `<button type="button" class="uc-lv ${l.id === 'sea' ? 'sea' : ''}" data-lv="${l.id}" aria-pressed="${l.id === cur}"><span class="i" aria-hidden="true">${l.ico}</span><span><span class="t">${esc(l.t)}</span> <span class="s">· ${esc(l.sub)}</span><br><span class="s">например: ${esc(l.ex)}</span></span></button>`).join('');
      const l = LEVELS.find(x => x.id === cur);
      TR.$('[data-lvi]', pane).innerHTML = ui.note(cur === 'sea' ? 'ok' : 'info', `${l.ico} ${l.t}`, esc(l.q));
      TR.$('[data-gl]', pane).innerHTML = GOALS.map((g, i) => { const a = got[i], ok = a && a === g.ok; return `<div class="uc-goal ${a ? (ok ? 'ok' : 'bad') : ''}"><b>${esc(g.t)}</b><div class="row">${LEVELS.map(x => `<button type="button" class="uc-ib" data-gv="${i}|${x.id}" aria-pressed="${a === x.id}" title="${esc(x.t)}">${x.ico}</button>`).join('')}</div>${a ? `<div class="uc-why">${ok ? '✓ Верно.' : '✕ Не тот уровень. Подумайте: это один присест одного человека? Даёт ли это пользу само по себе?'}</div>` : ''}</div>`; }).join('');
      const n = Object.keys(got).length, ok = GOALS.filter((g, i) => got[i] === g.ok).length;
      TR.$('[data-gs]', pane).innerHTML = n === GOALS.length ? ui.note(ok === n ? 'ok' : 'warn', `Верно ${ok} из ${n}`, 'Главный уровень — море: «Снять наличные», «Перевести деньги другу». В «Колосе» это «Оформить предзаказ», «Выдать заказ», «Заказать торт». А «Выбрать интервал» — рыба: шаг внутри сценария.') : '';
    }
    TR.on(pane, 'click', '[data-lv]', (e, b) => { cur = b.dataset.lv; draw(); });
    TR.on(pane, 'click', '[data-gv]', (e, b) => { const [i, v] = b.dataset.gv.split('|'); got[i] = v; draw(); });
    draw();
  }

  const CUTS = [{ v: '2', t: 'на шаге 2' }, { v: '4', t: 'на шаге 4' }, { v: '6', t: 'на шаге 6' }, { v: '7', t: 'на шаге 7' }, { v: '8', t: 'на шаге 8' }, { v: 'ok', t: '✓ успех' }];
  const G_ST = {
    good: {
      '2': ['не тронут', 'нет', 'возвращена', 'прервано на шаге 2'],
      '4': ['не тронут', 'нет', 'возвращена', 'банк не ответил на проверку ПИН'],
      '6': ['не тронут: списание не подтверждено', 'нет', 'возвращена', 'нет связи с банком'],
      '7': ['не тронут', 'нет', 'задержана по правилам — клиенту сказано, где её получить', 'сбой при возврате карты'],
      '8': ['списание отменено', 'нет', 'возвращена', 'купюры застряли; заявка инкассатору'],
      ok: ['списано ровно выданное', 'у клиента', 'возвращена', 'операция записана']
    },
    bad: {
      '2': ['не тронут', 'нет', 'возвращена', '—'],
      '4': ['не тронут', 'нет', 'возвращена', '—'],
      '6': ['непонятно: может, списано, может, нет', 'нет', 'в банкомате', 'пусто'],
      '7': ['списано', 'нет', 'в банкомате', 'пусто'],
      '8': ['списано', 'нет', 'возвращена', 'пусто'],
      ok: ['списано ровно выданное', 'у клиента', 'возвращена', 'операция записана']
    }
  };
  function drawGuar(pane) {
    let cut = '7', mode = 'good';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Сценарий может оборваться на любом шаге: пропала связь, застряли купюры. Выберите, где оборвалось, и сравните банкомат, где минимальные гарантии записали, с банкоматом, где о них забыли.</p>
      <div class="row">${ui.seg('cut', CUTS, cut, 'accent')}</div>
      <div class="row">${ui.seg('mode', [{ v: 'good', t: 'С минимальными гарантиями' }, { v: 'bad', t: 'Без них' }], mode, 'accent')}</div>
      <div data-g></div></div>`;
    function draw() {
      const r = G_ST[mode][cut], ref = G_ST.good[cut];
      const rows = ['Деньги на счёте', 'Наличные у клиента', 'Карта', 'Журнал операций'].map((k, i) => [k, esc(r[i]), r[i] === ref[i] ? chip('✓', 'ok') : chip('✕', 'bad')]);
      const fail = cut !== 'ok' && mode === 'bad' && ['6', '7', '8'].includes(cut);
      TR.$('[data-g]', pane).innerHTML = `${ui.table(['Что', 'Состояние', ''], rows)}${cut === 'ok' ? ui.note('ok', 'Гарантии успеха', 'Когда цель достигнута, верны и минимальные гарантии, и гарантии успеха: деньги у клиента, со счёта списано ровно столько же, всё записано.') : fail ? ui.note('bad', 'Клиент без денег, но со списанием', 'Без минимальных гарантий разработчик не знал, что делать при сбое, — и сделал «как получилось». Теперь банк неделю разбирается с жалобой.') : ui.note('info', 'Минимальные гарантии', 'Верны при любом исходе, даже при сбое: деньги не списаны без выдачи, карта не потеряна, всё записано. Гарантии успеха — только когда цель достигнута.')}`;
    }
    ui.onSeg(pane, (n, v) => { if (n === 'cut') cut = v; if (n === 'mode') mode = v; draw(); });
    draw();
  }

  const howAnatomy = {
    id: 'how-anatomy', covers: ['flow'], title: 'Как это работает: сценарий — договор о поведении', free: true, noReset: true,
    simple: {
      icon: '📜',
      plain: 'Сценарий использования описывает, как человек с помощью системы добивается своей цели: по шагам, с ветками, где всё идёт не так, и с обещаниями — что будет правдой в конце, даже если всё сломалось.',
      analogy: 'Технологическая карта торта в цехе: для кого торт и к какому часу, что должно быть готово до начала (бисквит остыл), шаги по порядку и что делать, если крем расслоился или не хватило ягод. И обещание: даже если торт не удался, заказчику позвонят до 12:00, а не в момент выдачи.',
      tech: 'По Алистеру Коберну («Современные методы описания функциональных требований к системам»): <b>основной актор</b> и <b>цель</b>; <b>уровень</b> (облако, воздушный змей, море — пользовательская цель, рыба — подфункция, моллюск); <b>заинтересованные лица и интересы</b>; <b>предусловия</b>; <b>минимальные гарантии</b> (верны при любом исходе) и <b>гарантии успеха</b> (постусловия); <b>триггер</b>; <b>основной успешный сценарий</b>; <b>расширения</b>.'
    },
    lead: ui.brief({
      situation: 'Вчера были истории — карточки «кто, что, зачем». Сегодня — сценарий использования (use case). Соседний пример — банкомат, сценарий «Снять наличные». «Колос» — в практике.',
      todo: [
        'Вкладка «Части сценария»: прочитайте шаблон и уберите по очереди несколько частей — что ломается без каждой?',
        'Вкладка «Уровни цели»: пройдите лестницу от облака до моллюска и определите уровень шести целей.',
        'Вкладка «Гарантии»: выберите, на каком шаге оборвался сценарий, и переключите «с минимальными гарантиями / без них».'
      ],
      look: 'Красным — части, которые вы убрали, и то, что без них ломается. Зелёный уровень «море» — тот, на котором пишут большинство сценариев.'
    }),
    render(el) {
      el.classList.add('uc-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'parts', t: 'Части сценария', render: fresh(drawParts) },
        { id: 'levels', t: 'Уровни цели', render: fresh(drawLevels) },
        { id: 'guar', t: 'Гарантии', render: fresh(drawGuar) }
      ], 'parts');
    }
  };

  // =====================================================================
  // Теория 2. Основной поток и расширения; шаги без интерфейса
  // =====================================================================
  const ATM_EXT = [
    { step: 3, t: 'ПИН-код неверный', react: 'Банкомат просит ввести снова; после третьей ошибки задерживает карту.', go: 'r3', alt: 'x' },
    { step: 5, t: 'Сумму нельзя выдать имеющимися купюрами', react: 'Банкомат предлагает ближайшие суммы.', go: 'r5' },
    { step: 6, t: 'На счёте не хватает денег', react: 'Банкомат сообщает об этом и предлагает меньшую сумму.', go: 'r5' },
    { step: 6, t: 'Нет связи с банком', react: 'Банкомат сообщает, возвращает карту; ничего не списано.', go: 'x' },
    { step: 8, t: 'Клиент не забрал деньги за 30 секунд', react: 'Банкомат забирает купюры обратно, банк отменяет списание.', go: 'x' }
  ];
  function drawBranches(pane) {
    const open = {};
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Основной поток — самый частый путь, без «если». Всё, что идёт иначе, — <b>расширения</b>: условие на конкретном шаге (номер шага + буква: 6а, 6б) и реакция системы. Нажимайте «Что может пойти не так?» и смотрите, как сценарий ветвится.</p>
      <div class="uc-two"><div class="stack tight" data-sts></div><div class="stack tight"><div class="uc-lbl">Сценарий «Снять наличные», как он записан</div><div data-map></div></div></div>
      ${ui.note('info', 'Альтернатива или исключение', 'У Коберна всё это — расширения. Во многих шаблонах (RUP, российские ТЗ) их делят: <b>альтернативный поток</b> ведёт к цели другим путём (меньшая сумма — и деньги всё-таки выданы), <b>исключение</b> — цель не достигнута (нет связи с банком). Важно не название, а чтобы для каждой ветки была записана реакция системы и куда сценарий идёт дальше.')}
      ${sysBtn()}
    </div>`;
    function draw() {
      TR.$('[data-sts]', pane).innerHTML = ATM_STEPS.map((s, i) => {
        const has = ATM_EXT.some(x => x.step === i + 1);
        return `<div class="uc-goal"><span><b>${i + 1}.</b> ${esc(s)}</span>${has ? `<button type="button" class="btn xs ${open[i + 1] ? '' : 'ghost'}" data-op="${i + 1}" aria-pressed="${!!open[i + 1]}" style="justify-self:start">${open[i + 1] ? 'Скрыть ветки' : 'Что может пойти не так?'}</button>` : ''}</div>`;
      }).join('');
      TR.$('[data-map]', pane).innerHTML = flowMap(ATM_STEPS, ATM_EXT.filter(x => open[x.step]));
    }
    TR.on(pane, 'click', '[data-op]', (e, b) => { const k = b.dataset.op; open[k] = !open[k]; draw(); });
    onSys(pane);
    draw();
  }

  const ATM_UI = [
    ['Клиент вставляет карту в щель справа под экраном.', 'Клиент вставляет карту.'],
    ['Банкомат показывает синий экран с полем из четырёх звёздочек.', 'Банкомат просит ПИН-код.'],
    ['Клиент набирает цифры на клавиатуре и жмёт зелёную кнопку «Ввод».', 'Клиент вводит ПИН-код.'],
    ['Клиент нажимает кнопку «5000» в правой колонке экрана.', 'Клиент выбирает сумму.'],
    ['Если банк ответил «нет», на экране мигает красная надпись.', 'Если на счёте не хватает денег, банкомат сообщает об этом и предлагает меньшую сумму.'],
    ['Из лотка внизу выезжают купюры.', 'Банкомат выдаёт наличные.']
  ];
  function drawNeutral(pane) {
    let mode = 'ui';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Один и тот же сценарий, записанный двумя способами. Переключайте и смотрите, что подсвечено.</p>
      ${ui.seg('nm', [{ v: 'ui', t: 'С интерфейсом' }, { v: 'n', t: 'Нейтрально к интерфейсу' }], mode, 'accent')}
      <div data-nt></div></div>`;
    function draw() {
      TR.$('[data-nt]', pane).innerHTML = `<div class="uc-flow">${ATM_UI.map((p, i) => `<div class="uc-st"><span class="n">${i + 1}</span><span>${mode === 'ui' ? markUI(p[0]) : esc(p[1])}</span></div>`).join('')}</div>
        ${mode === 'ui' ? ui.note('bad', 'Что не так', 'Завтра банкомат станет бесконтактным, а послезавтра его заменит приложение — и весь сценарий придётся переписать. А в шаге 5 правило вообще потерялось: «мигает красная надпись» — а что дальше? Можно ли снять меньше?') : ui.note('ok', 'Так лучше', 'Сценарий говорит о намерениях человека и ответах системы. Он останется верным при любом экране. Кнопки, цвета и поля — в макете дизайнера и спецификации экрана. А правило из шага 5 теперь записано словами.')}`;
    }
    ui.onSeg(pane, (n, v) => { if (n === 'nm') { mode = v; draw(); } });
    draw();
  }

  const GOOD_STEPS = [
    { t: 'Клиент вводит ПИН-код.', ok: true, why: 'Кто → что делает. Коротко и без интерфейса.' },
    { t: 'Ввод ПИН-кода.', ok: false, why: 'Нет действующего лица: кто вводит — клиент или банкомат?' },
    { t: 'Банкомат проверяет ПИН-код через банк.', ok: true, why: 'Шаг системы: что она делает и с кем.' },
    { t: 'Если ПИН верный, банкомат просит сумму, а если нет — просит ПИН снова.', ok: false, why: 'В основном потоке нет «если». Неверный ПИН — расширение 3а.' },
    { t: 'Клиент переводит взгляд на экран и тянется к клавиатуре.', ok: false, why: 'Движения, а не намерение. Пишем, чего человек добивается.' },
    { t: 'Банкомат отправляет в банк запрос POST /auth с номером карты.', ok: false, why: 'Детали реализации — решение разработчиков. В сценарии — «проверяет через банк».' },
    { t: 'Клиент выбирает сумму.', ok: true, why: 'Намерение человека, без кнопок.' }
  ];
  function drawGood(pane) {
    const got = {};
    pane.innerHTML = `<div class="stack"><p class="small muted">Правила хорошего шага по Коберну: кто → что делает; намерение, а не движения; без интерфейса и без деталей реализации; без «если» в основном потоке. Отметьте каждый шаг.</p><div class="uc-good" data-gd></div><div data-gds></div></div>`;
    function draw() {
      TR.$('[data-gd]', pane).innerHTML = GOOD_STEPS.map((g, i) => { const a = got[i], ok = a != null && a === g.ok; return `<div class="uc-gs ${a != null ? (ok ? 'ok' : 'bad') : ''}"><span>${esc(g.t)}</span><div class="row"><button type="button" class="btn xs" data-gd="${i}|1" aria-pressed="${a === true}">✓ хороший</button><button type="button" class="btn xs" data-gd="${i}|0" aria-pressed="${a === false}">✕ плохой</button></div>${a != null ? `<div class="uc-why">${ok ? '✓' : '✕ Не совсем.'} ${esc(g.why)}</div>` : ''}</div>`; }).join('');
      const n = Object.keys(got).length, ok = GOOD_STEPS.filter((g, i) => got[i] === g.ok).length;
      TR.$('[data-gds]', pane).innerHTML = n === GOOD_STEPS.length ? ui.note(ok === n ? 'ok' : 'warn', `Верно ${ok} из ${n}`, 'Хороший шаг читается вслух как простое предложение: «Покупатель выбирает пекарню». «Система сообщает, что приём закрыт». Если в шаге есть «если» — это расширение; если кнопка — это макет.') : '';
    }
    TR.on(pane, 'click', '[data-gd]', (e, b) => { const [i, v] = b.dataset.gd.split('|'); got[i] = v === '1'; draw(); });
    draw();
  }

  const howFlow = {
    id: 'how-flow', covers: ['ext', 'neutral'], title: 'Как это работает: ствол и ветки', free: true, noReset: true,
    simple: {
      icon: '🌳',
      plain: 'Сначала пишут обычный путь, когда всё идёт хорошо, — без «если». Потом на каждом шаге спрашивают: что может пойти не так или иначе? Каждый ответ — отдельная ветка: условие, реакция системы и куда сценарий идёт дальше. И всё это — словами о намерениях людей, без кнопок и цветов.',
      analogy: 'Маршрут развоза в 06:30: обычный путь — цех → Покровка → остальные пекарни. А на полях водитель помечает: «пробка на мосту — объезд через Канавинский», «точка закрыта — оставить у охраны и позвонить Павлу». Маршрут не зависит от марки машины — как сценарий не зависит от экрана.',
      tech: 'Коберн: <b>основной успешный сценарий</b> — 3–9 шагов «кто → что делает»; <b>расширения</b> нумеруются по шагу (6а, 6б), состоят из условия и шагов обработки и заканчиваются возвратом к шагу, продолжением или неуспехом. Многие шаблоны делят ветки на <b>альтернативные потоки</b> (цель достигнута иначе) и <b>исключения</b> (цель не достигнута). Шаги пишут <b>нейтрально к интерфейсу</b>: детали экрана — в спецификации экрана и макете.'
    },
    lead: ui.brief({
      situation: 'Тот же банкомат. Лера: «В сценарии мне важнее всего ветки — там живут ошибки». Соня: «А кнопки и цвета оставьте мне — в макете».',
      todo: [
        'Вкладка «Ветки банкомата»: нажимайте «Что может пойти не так?» у шагов и смотрите, как растёт карта сценария справа: номера веток, реакции, возврат или конец.',
        'Вкладка «Без интерфейса»: переключите «С интерфейсом / Нейтрально» и найдите правило, которое пряталось за «красной надписью».',
        'Вкладка «Хороший шаг»: отметьте семь шагов — хороший или плохой.'
      ],
      look: 'Зелёная граница ветки — альтернатива (цель всё-таки достигнута), красная — исключение. Кнопка «Открыть систему „Колос“» показывает живой сценарий заказа с «что если».'
    }),
    render(el) {
      el.classList.add('uc-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'br', t: 'Ветки банкомата', render: fresh(drawBranches) },
        { id: 'neu', t: 'Без интерфейса', render: fresh(drawNeutral) },
        { id: 'good', t: 'Хороший шаг', render: fresh(drawGood) }
      ], 'br');
    }
  };

  // =====================================================================
  // Теория 3. Диаграмма вариантов использования; история или сценарий
  // =====================================================================
  const ATM_D = {
    title: 'Банкомат',
    left: [{ id: 'cl', t: 'Клиент' }, { id: 'ink', t: 'Инкассатор' }],
    right: [{ id: 'bank', t: 'Процессинг банка' }],
    ucs: [{ id: 'cash', t: 'Снять наличные' }, { id: 'bal', t: 'Проверить баланс' }, { id: 'load', t: 'Загрузить кассеты' }, { id: 'chk', t: 'Напечатать чек' }, { id: 'pin', t: 'Проверить ПИН-код' }],
    col1: ['pin', 'chk'],
    assoc: [['cl', 'cash'], ['cl', 'bal'], ['ink', 'load'], ['bank', 'pin']],
    inc: [['cash', 'pin'], ['bal', 'pin']],
    ext: [['chk', 'cash']]
  };
  const ATM_INFO = {
    cl: ['Основной актор', 'Роль человека, который сам работает с системой ради своей цели. Рисуют слева. Актор — роль, а не конкретный человек: и студентка, и пенсионер здесь «Клиент».'],
    ink: ['Ещё один актор', 'У инкассатора своя цель и свой сценарий. Один человек может играть разные роли.'],
    bank: ['Внешняя система — вспомогательный актор', 'Чужая система, с которой наша обменивается данными. Её рисуют актором (часто справа, с пометкой «система»): она вне нашей границы, мы её не строим.'],
    boundary: ['Граница системы', 'Прямоугольник — то, что мы строим. Внутри — варианты использования, снаружи — акторы. Граница отвечает на вопрос «что входит в проект».'],
    cash: ['Вариант использования', 'Цель актора на уровне моря, глаголом: «Снять наличные». Каждому эллипсу соответствует текстовый сценарий — диаграмма лишь оглавление.'],
    bal: ['Вариант использования', '«Проверить баланс» — ещё одна цель клиента.'],
    load: ['Вариант использования', 'Цель инкассатора. Без неё банкомат быстро опустеет.'],
    pin: ['Подфункция через «include»', '«Проверить ПИН-код» нужен и для снятия, и для баланса — его выносят и подключают через «include»: базовый сценарий <b>всегда</b> его выполняет. Стрелка — от базового к включаемому.'],
    chk: ['Расширение через «extend»', '«Напечатать чек» срабатывает <b>не всегда</b>, а при условии: клиент попросил чек. Стрелка — от расширения к базовому сценарию.']
  };
  const BAD_D = {
    title: 'Банкомат',
    left: [{ id: 'ivan', t: 'Иван Петров' }],
    right: [{ id: 'db', t: 'База данных' }],
    ucs: [{ id: 'press', t: 'Нажать кнопку «Ввод»' }, { id: 'pin2', t: 'Ввести ПИН-код' }, { id: 'sum', t: 'Выбрать сумму' }, { id: 'get', t: 'Получить деньги' }],
    assoc: [['ivan', 'press'], ['ivan', 'pin2'], ['db', 'get']],
    seq: [['pin2', 'sum'], ['sum', 'get']],
    bad: { ivan: 1, press: 2, sum: 3, db: 4 }
  };
  const BAD_LIST = [
    'Актор «Иван Петров» — конкретный человек. На диаграмме — роли: «Клиент».',
    '«Нажать кнопку „Ввод“» — шаг интерфейса, а не цель. Эллипс — цель на уровне моря.',
    'Сплошные стрелки «Ввести ПИН → Выбрать сумму → Получить деньги» — это блок-схема. Диаграмма вариантов использования не показывает порядок шагов: порядок — в тексте сценария.',
    '«База данных» — часть нашей системы, а не внешний актор. Актор — тот, кто снаружи и чего-то хочет или что-то отвечает.'
  ];
  function drawDiagram(pane) {
    let mode = 'good', hl = null;
    const layers = { actors: true, boundary: true, ucs: true, assoc: true, inc: true, ext: true };
    const LN = { actors: 'Акторы', boundary: 'Граница', ucs: 'Варианты', assoc: 'Связи с акторами', inc: '«include»', ext: '«extend»' };
    pane.innerHTML = `<div class="stack">
      <p class="small muted">UML-диаграмма вариантов использования — оглавление сценариев: кто (акторы) чего хочет (эллипсы) от системы (граница). Включайте слои по одному и нажимайте на элементы. Потом переключите на «Типичные ошибки».</p>
      ${ui.seg('dm', [{ v: 'good', t: 'Правильно' }, { v: 'bad', t: 'Типичные ошибки' }], mode, 'accent')}
      <div data-ly></div>
      <div class="board uc-dg" data-dg></div>
      <div data-di></div></div>`;
    function draw() {
      TR.$('[data-ly]', pane).innerHTML = mode === 'good' ? `<div class="uc-layers">${Object.keys(LN).map(k => `<label class="toggle"><input type="checkbox" data-ly="${k}" ${layers[k] ? 'checked' : ''}> <span>${LN[k]}</span></label>`).join('')}</div>` : '';
      const hide = {}; Object.keys(layers).forEach(k => { hide[k] = !layers[k]; });
      TR.$('[data-dg]', pane).innerHTML = mode === 'good' ? ucDiagram(Object.assign({ id: 'atm', hide, hl }, ATM_D)) : ucDiagram(Object.assign({ id: 'atmbad' }, BAD_D));
      if (mode === 'bad') TR.$('[data-di]', pane).innerHTML = `<ol class="small" style="margin:0;padding-left:20px;display:grid;gap:4px">${BAD_LIST.map(x => `<li>${esc(x)}</li>`).join('')}</ol>${ui.note('info', 'И ещё одна ошибка — без картинки', 'Выносить через «include» каждый мелкий шаг («Выбрать сумму», «Ввести ПИН»). «include» — для общего куска, который нужен в нескольких сценариях. Иначе диаграмма превращается в паутину из рыбы и моллюсков.')}`;
      else { const inf = hl && ATM_INFO[hl]; TR.$('[data-di]', pane).innerHTML = inf ? ui.note('info', inf[0], inf[1]) : '<p class="small dim">Нажмите на актора, эллипс или границу системы.</p>'; }
    }
    pane.addEventListener('change', e => { const c = e.target.closest('[data-ly]'); if (!c) return; layers[c.dataset.ly] = c.checked; draw(); });
    pane.addEventListener('click', e => { if (mode !== 'good') return; const g = e.target.closest('[data-el]'); if (!g) return; hl = g.getAttribute('data-el'); draw(); });
    ui.onSeg(pane, (n, v) => { if (n === 'dm') { mode = v; hl = null; draw(); } });
    draw();
  }

  const SITS = [
    { t: 'Команда планирует спринт и решает, что делать первым', w: 'story', why: 'Истории маленькие, у каждой своя ценность — их легко сравнить и переставить.' },
    { t: 'Тестировщику нужны все ветки ошибок при снятии денег', w: 'uc', why: 'Расширения сценария — готовый список проверок: неверный ПИН, нет денег, нет связи.' },
    { t: 'Подрядчик по фиксированной цене должен понять полный объём', w: 'uc', why: 'Сценарий показывает все шаги и ветки — по нему можно оценить и зафиксировать объём.' },
    { t: 'Владелец выбирает, что войдёт в первый релиз', w: 'story', why: 'Истории раскладываются на карте и режутся линией релиза.' },
    { t: 'Интеграция с банком: много шагов и ответов чужой системы', w: 'uc', why: 'Нужна последовательность и реакция на каждый ответ банка — это стихия сценария.' },
    { t: 'Небольшое улучшение: показывать остаток на чеке', w: 'story', why: 'Одна карточка с критериями — сценарий здесь был бы бюрократией.' },
    { t: 'Большой сценарий надо сделать за несколько спринтов', w: 'both', why: 'Сценарий режут на срезы: основной поток — одна история, каждая ветка — ещё одна. Так предлагает Айвар Якобсон в Use-Case 2.0.' }
  ];
  function drawCompare(pane) {
    let cur = 0;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Одна и та же функция банкомата в двух форматах. Нажимайте ситуации слева — справа подсветится формат, который в ней полезнее.</p>
      <div class="uc-two"><div class="uc-sits" data-sits></div><div class="stack tight"><div class="uc-cmp" data-cmp></div><div data-cw></div></div></div>
      ${ui.note('info', 'Честно о спорах', 'Майк Кон («Пользовательские истории») подчёркивает: история меньше сценария и написана ради разговора и ценности, сценарий — шире и подробнее, ради полноты поведения. Одни команды пишут только истории, другие — сценарии, третьи — и то и другое. Это не «старое против нового», а разные инструменты.')}
    </div>`;
    function draw() {
      const s = SITS[cur];
      TR.$('[data-sits]', pane).innerHTML = SITS.map((x, i) => `<button type="button" class="uc-sit" data-si="${i}" aria-pressed="${i === cur}">${esc(x.t)}</button>`).join('');
      const cls = k => s.w === 'both' || s.w === k ? 'win' : 'dim';
      TR.$('[data-cmp]', pane).innerHTML = `<div class="uc-card ${cls('story')}"><span class="uc-lbl">Пользовательская история</span><div class="small"><b>Как</b> клиент банка, <b>я хочу</b> снять наличные в банкомате, <b>чтобы</b> расплатиться там, где не берут карту.</div><ul><li>Неверный ПИН трижды — карта задерживается</li><li>Не хватает денег — предложить меньшую сумму</li></ul></div>
        <div class="uc-card ${cls('uc')}"><span class="uc-lbl">Сценарий использования</span><div class="small"><b>Снять наличные.</b> Актор — клиент; цель — получить наличные; гарантии…</div><ol><li>Клиент вставляет карту.</li><li>…</li><li>Банкомат выдаёт наличные.</li></ol><div class="small">3а · 5а · 6а · 6б · 8а — расширения</div></div>`;
      TR.$('[data-cw]', pane).innerHTML = ui.note(s.w === 'both' ? 'ok' : 'info', s.w === 'story' ? 'Здесь удобнее история' : s.w === 'uc' ? 'Здесь удобнее сценарий' : 'Здесь нужны оба', esc(s.why));
    }
    TR.on(pane, 'click', '[data-si]', (e, b) => { cur = +b.dataset.si; draw(); });
    draw();
  }

  const howDiagram = {
    id: 'how-diagram', covers: ['diagram', 'why'], title: 'Как это работает: диаграмма-оглавление и выбор формата', free: true, noReset: true,
    simple: {
      icon: '🗺️',
      plain: 'Диаграмма вариантов использования — картинка-оглавление: кто снаружи пользуется системой (человечки и чужие системы), какие цели он достигает (овалы) и где граница того, что мы строим. Подробности — в тексте сценариев. А история и сценарий — не соперники: одна удобна для планирования, другой — для полноты.',
      analogy: 'Схема кухни на двери цеха: кто входит (пекари, кондитеры, поставщик муки), какие участки им нужны (тесто, печь, склад) и где стена цеха. По схеме печь не растопишь — для этого технологические карты. Но без схемы новичок заблудится.',
      tech: 'UML-диаграмма вариантов использования: <b>акторы</b> (роли людей и внешние системы), <b>граница системы</b>, <b>варианты использования</b> (эллипсы, цель глаголом), <b>ассоциации</b>; <b>«include»</b> — базовый сценарий всегда выполняет включаемый (общий кусок нескольких сценариев), <b>«extend»</b> — расширение срабатывает при условии; стрелка extend — от расширения к базовому. Порядок шагов диаграмма не показывает. История vs сценарий — Майк Кон; Use-Case 2.0 (Айвар Якобсон, 2011) — сценарий режут на срезы-истории.'
    },
    lead: ui.brief({
      situation: 'Тот же банкомат. Дима: «Нарисуй одну картинку, чтобы было видно, что вообще есть в системе». Игорь: «А в договоре мне что приложить — истории или сценарии?».',
      todo: [
        'Вкладка «Диаграмма»: включайте слои по одному, нажимайте на акторов, эллипсы и границу. Найдите, чем «include» отличается от «extend» и куда смотрят их стрелки. Переключите на «Типичные ошибки».',
        'Вкладка «История или сценарий»: нажимайте семь ситуаций и смотрите, какой формат в каждой полезнее.'
      ],
      look: 'Пунктирные фиолетовые стрелки — «include» и «extend». Красные номера в режиме ошибок соответствуют списку под диаграммой. На телефоне диаграмму можно прокрутить вбок.'
    }),
    render(el) {
      el.classList.add('uc-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'dg', t: 'Диаграмма', render: fresh(drawDiagram) },
        { id: 'cmp', t: 'История или сценарий', render: fresh(drawCompare) }
      ], 'dg');
    }
  };

  // =====================================================================
  // Практика 1. Соберите сценарий «Оформить предзаказ»: шапка и основной поток
  // =====================================================================
  const HF = [
    { v: 'goal', t: 'Цель' }, { v: 'primary', t: 'Основной актор' }, { v: 'second', t: 'Вспомогательные акторы' },
    { v: 'stake', t: 'Заинтересованное лицо и его интерес' }, { v: 'level', t: 'Уровень' }, { v: 'pre', t: 'Предусловие' },
    { v: 'succ', t: 'Гарантия успеха (постусловие)' }, { v: 'min', t: 'Минимальная гарантия' }, { v: 'none', t: 'Не из шапки сценария' }
  ];
  const HROWS = [
    { id: 'h1', t: 'Забрать выпечку к выбранному времени в своей пекарне без очереди', ok: 'goal' },
    { id: 'h2', t: 'Покупатель', ok: 'primary' },
    { id: 'h3', t: 'Платёжный шлюз «ПэйМост», кассы «КассаПро»', ok: 'second' },
    { id: 'h4', t: 'Технолог: предзаказы на завтра попадают в план выпечки к 23:00', ok: 'stake' },
    { id: 'h5', t: 'Бухгалтер: продажи и чеки сходятся без ручной сверки', ok: 'stake' },
    { id: 'h6', t: 'Море: одно дело одного человека за один присест', ok: 'level' },
    { id: 'h7', t: 'Покупатель вошёл по номеру телефона', ok: 'pre' },
    { id: 'h8', t: 'Заказ «Оплачен» или «Ждёт оплаты на месте» и попал в план выпечки или зарезервирован из остатков', ok: 'succ' },
    { id: 'h9', t: 'Деньги не списаны без заказа; каждая попытка оплаты записана', ok: 'min' },
    { id: 'h10', t: 'Кнопка «Оформить» — зелёная, внизу экрана', ok: 'none' }
  ];
  const H_HINT = {
    goal: 'чего человек добивается — тот самый «тест кофе-брейка». Какая это часть шапки?',
    primary: 'чьими глазами написан сценарий — кто начинает и получает пользу?',
    second: 'это чужие системы, которые помогают по ходу сценария. Как их называют?',
    stake: 'этого человека нет у экрана, но у него есть интерес к результату. Какая это часть шапки?',
    level: 'это ответ на вопрос «на какой высоте цель»?',
    pre: 'это уже верно до начала сценария — внутри его не проверяют.',
    succ: 'это правда в конце, когда цель достигнута.',
    min: 'это верно при любом исходе, даже при сбое.',
    none: 'это решение интерфейса. Место ему — в макете Сони, а не в сценарии.'
  };
  const FLOW = [
    { id: 'o1', t: 'Покупатель выбирает пекарню.' },
    { id: 'o2', t: 'Система показывает свободные получасовые интервалы выдачи на сегодня и на завтра.' },
    { id: 'o3', t: 'Покупатель выбирает интервал.' },
    { id: 'o4', t: 'Система показывает товары, доступные к этому интервалу.' },
    { id: 'o5', t: 'Покупатель добавляет товары и подтверждает заказ.' },
    { id: 'o6', t: 'Система проверяет, что товары доступны, и показывает сумму к оплате.' },
    { id: 'o7', t: 'Покупатель оплачивает заказ картой или через СБП.' },
    { id: 'o8', t: 'Система получает подтверждение оплаты от «ПэйМост» и пробивает чек «предоплата» через «КассаПро».' },
    { id: 'o9', t: 'Система присваивает заказу статус «Оплачен» и показывает покупателю код заказа.' }
  ];
  const FLOW_IDS = FLOW.map(x => x.id);
  function flowEval(a) {
    const m = (a && a.m) || {}, o = (a && a.o) || [];
    const rows = HROWS.map(r => ({ r, got: m[r.id], s: m[r.id] === r.ok ? 'ok' : m[r.id] ? 'bad' : 'empty' }));
    const mS = rows.filter(x => x.s === 'ok').length / HROWS.length;
    const valid = o.length === FLOW_IDS.length && FLOW_IDS.every(id => o.includes(id));
    const oS = valid ? ui.orderScore(o, FLOW_IDS) : 0;
    return { rows, mS, oS, valid, o, score: mS * 0.45 + oS * 0.55 };
  }
  const flowTask = {
    id: 'flow', title: 'Соберите сценарий «Оформить предзаказ»',
    simple: howAnatomy.simple,
    lead: ui.brief({
      situation: 'Ксения набросала сценарий «Оформить предзаказ» на стикерах, а Лера, как всегда, всё перемешала, пока искала свои тесты. Ксения: «Соберите обратно. Сначала шапка: кто, чего хочет, кому ещё это важно, что верно до начала и что гарантируем в конце. Потом основной поток — самый частый путь, без „если“».',
      todo: [
        'В «Шапке» для каждой строки выберите, какая это часть сценария. Одна строка в шапку не входит вовсе.',
        'В «Основном потоке» стрелками ↑ ↓ (или перетаскиванием) расставьте 9 шагов по порядку. Шаги покупателя и системы чередуются.',
        'Нажмите «Проверить». Засчитывается, если шапка верна от 80 % и порядок шагов — от 90 %.'
      ],
      look: 'Канон «Колоса»: покупатель входит по номеру телефона, выбирает пекарню и получасовой интервал, добавляет товары, оплачивает картой или СБП через «ПэйМост», при предоплате «КассаПро» пробивает чек «предоплата» (54-ФЗ), покупатель получает код заказа.'
    }),
    blank: () => ({ m: {}, o: [] }),
    reference: () => ({ m: Object.fromEntries(HROWS.map(r => [r.id, r.ok])), o: FLOW_IDS.slice() }),
    render(el, ctx) {
      el.classList.add('uc-root');
      const a = ctx.ans; a.m = a.m || {}; a.o = Array.isArray(a.o) ? a.o : [];
      el.innerHTML = `<div class="stack"><div class="uc-lbl">Шапка сценария «Оформить предзаказ»</div><div data-hm></div><div class="uc-lbl">Основной поток</div><div data-fo></div></div>`;
      let mrev = null, orev = null;
      if (ctx.result || ctx.readonly) {
        const ev = flowEval(a);
        mrev = {}; ev.rows.forEach(x => { if (x.got) mrev[x.r.id] = { s: x.s }; });
        if (ev.valid) { orev = {}; a.o.forEach((id, i) => { orev[id] = FLOW_IDS[i] === id ? 'ok' : 'bad'; }); }
      }
      ui.match(TR.$('[data-hm]', el), { rows: HROWS.map(r => ({ id: r.id, t: esc(r.t) })), choices: HF, value: a.m, reveal: mrev, readonly: ctx.readonly, placeholder: 'Часть сценария…', onChange: v => { a.m = v; ctx.save(); } });
      ui.order(TR.$('[data-fo]', el), { items: FLOW.map(x => ({ id: x.id, t: esc(x.t) })), value: a.o, reveal: orev, readonly: ctx.readonly, seed: 'uc-flow', onChange: v => { a.o = v; ctx.save(); } });
    },
    check(ans) {
      const ev = flowEval(ans), notes = [];
      const empty = ev.rows.filter(x => x.s === 'empty').length;
      if (empty) notes.push({ ok: false, html: `В шапке не размечено строк: ${empty} из ${HROWS.length}.` });
      ev.rows.filter(x => x.s === 'bad').forEach(x => notes.push({ ok: false, html: `«${esc(x.r.t)}» — ${H_HINT[x.r.ok]}` }));
      if (!ev.rows.some(x => x.s !== 'ok')) notes.push({ ok: true, html: 'Шапка собрана верно.' });
      if (!ev.valid) notes.push({ ok: false, html: 'Основной поток не расставлен.' });
      else if (ev.oS >= 0.999) notes.push({ ok: true, html: 'Основной поток — по порядку: покупатель и система по очереди.' });
      else notes.push({ ok: ev.oS >= 0.9 ? 'warn' : false, html: `Порядок шагов верен на ${Math.round(ev.oS * 100)} %. Проговорите вслух: что должен увидеть покупатель, прежде чем сделать следующий шаг? Может ли система пробить чек раньше, чем пришло подтверждение оплаты?` });
      const swapped = ev.rows.some(x => (x.r.ok === 'succ' && x.got === 'min') || (x.r.ok === 'min' && x.got === 'succ'));
      return {
        ok: ev.mS >= 0.8 && ev.oS >= 0.9, score: ev.score, notes,
        summary: `Шапка: ${ev.rows.filter(x => x.s === 'ok').length} из ${HROWS.length}. Основной поток: ${Math.round(ev.oS * 100)} %.`,
        mentor: swapped ? 'Гарантии путают чаще всего. Спросите: это верно, только если всё получилось, — или даже когда оплата сорвалась? Первое — гарантия успеха, второе — минимальная.' : null
      };
    },
    explain: `${ui.table(['Часть', '«Оформить предзаказ»'], [
        ['Цель · уровень', 'Забрать выпечку к выбранному времени без очереди · море'],
        ['Основной актор', 'Покупатель'],
        ['Вспомогательные акторы', '«ПэйМост» (оплата), «КассаПро» (чеки)'],
        ['Заинтересованные лица', 'Технолог — предзаказы в плане к 23:00; бухгалтер — продажи и чеки сходятся; кассир — быстрая выдача в пик'],
        ['Предусловие', 'Покупатель вошёл по номеру телефона'],
        ['Минимальные гарантии', 'Деньги не списаны без заказа; попытки оплаты записаны'],
        ['Гарантии успеха', '«Оплачен» или «Ждёт оплаты на месте»; в плане выпечки или в резерве из остатков'],
        ['Не из шапки', 'Цвет и место кнопки — макет']
      ])}
      <p>Основной поток чередует покупателя и систему: человек выбирает — система показывает и проверяет. Чек «предоплата» пробивается только после подтверждения оплаты: по 54-ФЗ чек отражает реальный расчёт. Оплата при получении, 22:30, «нет товара» — не в основном потоке, а в расширениях: это следующее задание.</p>
      <p>Обратите внимание: в шапке есть люди, которых нет у экрана, — технолог и бухгалтер. Их интересы защищает аналитик. Без строки технолога разработчик сделает резерв с витрины — и забудет про план выпечки.</p>
      <p class="small muted">Источник: Алистер Коберн, «Современные методы описания функциональных требований к системам» (Writing Effective Use Cases).</p>`,
    report: ans => { const ev = flowEval(ans); return ev.rows.map(x => `- ${x.r.t} → ${(HF.find(c => c.v === x.got) || { t: '—' }).t} ${x.s === 'ok' ? '✓' : '✗'}`).join('\n') + `\nПорядок шагов: ${(ev.o || []).map(id => FLOW_IDS.indexOf(id) + 1).join(', ') || '—'} (${Math.round(ev.oS * 100)} %)`; }
  };

  // =====================================================================
  // Практика 2. Лаборатория «Прогоните сценарий»: ветки и реакции системы
  // =====================================================================
  const EV = [
    { id: 'e1', step: 1, req: true, t: 'У покупателя нет смартфона — он звонит в пекарню', ends: [
      { t: 'Кассир оформляет предзаказ за покупателя на своём экране: те же шаги, код заказа — по телефону и на чеке', go: 'c2', ok: true },
      { t: 'Отказать: предзаказ только через приложение', go: 'x' },
      { t: 'Предложить прийти утром и постоять в очереди, как раньше', go: 'x' }] },
    { id: 'd1', step: 1, dis: true, t: 'Покупателю не нравится цвет кнопок', why: 'это вкус и макет, а не поведение системы', ends: [
      { t: 'Система предлагает выбрать другую тему оформления', go: 'r1' }, { t: 'Сценарий продолжается как обычно', go: 'c2' }] },
    { id: 'e8', step: 2, opt: true, t: 'На сегодня свободных интервалов уже не осталось', ends: [
      { t: 'Система показывает интервалы на завтра', go: 'c3', ok: true },
      { t: 'Система показывает пустой экран', go: 'x' },
      { t: 'Система принимает заказ на любое время сверх лимита', go: 'c3' }] },
    { id: 'e2', step: 3, req: true, t: 'Сейчас позже 22:30 — приём заказов на завтра закрыт', ends: [
      { t: 'Система предупреждает, что приём на завтра закрыт в 22:30, и предлагает только то, что уже в плане выпечки, или заказ на сегодня из витрины', go: 'c4', ok: true },
      { t: 'Система всё равно принимает заказ на завтра — цех как-нибудь допечёт', go: 'c4' },
      { t: 'Система показывает «Сервис недоступен» до утра', go: 'x' }] },
    { id: 'd2', step: 3, dis: true, t: 'Курьер стоит в пробке', why: 'доставки нет в первой версии, и это не про оформление предзаказа', ends: [
      { t: 'Система предлагает интервал попозже', go: 'r3' }, { t: 'Система отменяет заказ', go: 'x' }] },
    { id: 'd7', step: 4, dis: true, t: 'Позиций около 120 — покупатель долго листает', why: 'это вопрос удобства и макета (поиск, категории), а не ветка поведения', ends: [
      { t: 'Система показывает подсказку', go: 'c5' }, { t: 'Система сокращает ассортимент', go: 'c5' }] },
    { id: 'e4', step: 5, req: true, t: 'Нужного товара нет к этому интервалу: на сегодня он кончился на витрине или это круассаны раньше 07:30', ends: [
      { t: 'Система показывает, что товара нет к этому интервалу, и предлагает другой интервал или замену', go: 'r3', ok: true },
      { t: 'Система принимает заказ, а утром пекарня позвонит и извинится', go: 'c6' },
      { t: 'Система молча убирает товар из заказа', go: 'c6' }] },
    { id: 'd3', step: 5, dis: true, t: 'Покупатель хочет добавить торт с надписью', why: 'это другой сценарий — «Заказать торт»: за 48 часов, предоплата 50 %', ends: [
      { t: 'Система добавляет торт в этот же заказ', go: 'c6' }, { t: 'Система предлагает торт на завтра', go: 'c6' }] },
    { id: 'e9', step: 6, opt: true, t: 'Пока покупатель выбирал, последние круассаны купили на витрине', ends: [
      { t: 'Система сообщает, что товара уже нет, и предлагает замену', go: 'r5', ok: true },
      { t: 'Система оформляет заказ — разберутся на кассе', go: 'c7' },
      { t: 'Система отменяет весь заказ', go: 'x' }] },
    { id: 'e5', step: 7, req: true, t: 'Банк отклонил оплату картой', ends: [
      { t: 'Заказ остаётся «Создан»; система предлагает повторить оплату, выбрать СБП или оплату при получении', go: 'r7', ok: true },
      { t: 'Система удаляет заказ — собирать корзину заново', go: 'x' },
      { t: 'Заказ считается оплаченным — разберутся на кассе', go: 'c9' }] },
    { id: 'e6', step: 7, req: true, t: 'Покупатель хочет оплатить при получении', ends: [
      { t: 'Заказ получает статус «Ждёт оплаты на месте», покупатель получает код; заказ держат 30 минут после конца интервала', go: 'c9', ok: true },
      { t: 'Отказать: только онлайн-оплата', go: 'x' },
      { t: 'Пробить чек «предоплата», хотя денег ещё нет', go: 'c9' }] },
    { id: 'd4', step: 7, dis: true, t: 'У «ПэйМост» поменялся логотип', why: 'это не меняет поведения системы', ends: [
      { t: 'Система показывает новый логотип', go: 'c8' }, { t: 'Система приостанавливает оплату', go: 'x' }] },
    { id: 'e7', step: 8, opt: true, t: 'Нет связи с «КассаПро» — чек не пробился', ends: [
      { t: 'Заказ остаётся «Оплачен», чек ставится в очередь и досылается, когда связь вернётся', go: 'c9', ok: true },
      { t: 'Вернуть деньги и отменить заказ', go: 'x' },
      { t: 'Не пробивать чек вовсе', go: 'c9' }] },
    { id: 'd5', step: 8, dis: true, t: 'Разработчик хочет переписать модуль оплаты', why: 'это работа команды, а не событие в жизни покупателя', ends: [
      { t: 'Система ждёт новую версию', go: 'r8' }, { t: 'Сценарий продолжается', go: 'c9' }] },
    { id: 'd6', step: 9, dis: true, t: 'Покупатель забыл код заказа', why: 'это уже сценарий «Получить заказ» на кассе, а не оформление', ends: [
      { t: 'Система присылает код ещё раз', go: 'r9' }, { t: 'Кассир ищет заказ по телефону', go: 'c9' }] }
  ];
  const EXT_STEPS = FLOW.map(x => x.t);
  const EV_HINT = {
    e1: 'Кто из постоянных покупателей «Колоса» не пройдёт уже первый шаг? Вспомните Анну Павловну.',
    e2: 'Что, если покупатель открыл приложение поздно вечером? Вспомните правило цеха.',
    e4: 'Всегда ли нужный товар есть к выбранному интервалу? Вспомните витрину в 10:30 и первую партию круассанов.',
    e5: 'Всегда ли оплата проходит с первого раза?',
    e6: 'Все ли платят онлайн? Вспомните спор Олега Петровича и Нины Сергеевны.'
  };
  const evOrder = step => TR.shuffle(EV.filter(e => e.step === step), 'uc-ev-' + step);
  const endOrder = e => TR.shuffle(e.ends.map((_, i) => i), 'uc-end-' + e.id);
  function extEval(a) {
    const add = ((a && a.add) || []).filter(id => EV.some(e => e.id === id));
    const end = (a && a.end) || {};
    const req = EV.filter(e => e.req), opt = EV.filter(e => e.opt), dis = EV.filter(e => e.dis);
    const endOk = e => { const i = end[e.id]; return i != null && !!e.ends[i] && !!e.ends[i].ok; };
    const reqFound = req.filter(e => add.includes(e.id)), reqEndOk = reqFound.filter(endOk);
    const optOk = opt.filter(e => add.includes(e.id) && endOk(e));
    const disAdded = dis.filter(e => add.includes(e.id));
    const noEnd = EV.filter(e => add.includes(e.id) && !e.dis && end[e.id] == null);
    const wrongEnd = EV.filter(e => add.includes(e.id) && !e.dis && end[e.id] != null && !endOk(e));
    const score = Math.max(0, Math.min(1, 0.5 * reqFound.length / req.length + 0.35 * reqEndOk.length / req.length + 0.15 * optOk.length / opt.length - 0.1 * disAdded.length));
    return { add, end, req, reqFound, reqEndOk, optOk, disAdded, noEnd, wrongEnd, endOk, score };
  }
  const extTask = {
    id: 'ext', title: 'Лаборатория: прогоните сценарий',
    simple: howFlow.simple,
    lead: ui.brief({
      situation: 'Основной поток «Оформить предзаказ» собран. Лера садится рядом: «А теперь пройдём его по шагам. На каждом спрашиваю: что может пойти не так или иначе? Если ветки нет в сценарии — Дима сделает „как-нибудь“, а я узнаю об этом на пилоте». На каждом шаге есть и настоящие развилки, и то, что к этому сценарию не относится.',
      todo: [
        'Слева идите по шагам кнопками «Дальше →» и «← Назад». На каждом шаге отметьте события, которые действительно ветвят этот сценарий. Ненужное не отмечайте.',
        'Для каждого отмеченного события выберите реакцию системы. Справа сценарий ветвится: номер ветки (как у Коберна — 7а, 7б), реакция и куда он идёт дальше — возврат, продолжение или конец.',
        'Нажмите «Проверить». Засчитывается, если найдены все пять главных развилок, верная реакция хотя бы у четырёх из них и в сценарии не больше одной лишней ветки.'
      ],
      lookTitle: 'На что опереться',
      look: 'Блокнот: заказ на завтра — до 22:30, на сегодня — только из витрины; первая партия круассанов — в 07:20; оплата онлайн или на месте; неоплаченный держат 30 минут после конца интервала; 40 % постоянных клиентов старше 55 лет, заказ по телефону через кассира должен остаться; модем на Покровке отваливается — чеки досылают.'
    }),
    blank: () => ({ add: [], end: {} }),
    reference: () => ({ add: EV.filter(e => !e.dis).map(e => e.id), end: Object.fromEntries(EV.filter(e => !e.dis).map(e => [e.id, e.ends.findIndex(x => x.ok)])) }),
    render(el, ctx) {
      el.classList.add('uc-root');
      const a = ctx.ans; a.add = Array.isArray(a.add) ? a.add : []; a.end = a.end || {};
      let cur = 0;
      el.innerHTML = `<div class="stack">${sysBtn()}<div class="uc-lab"><div class="stack tight" data-walk></div><div class="stack tight"><div class="uc-lbl">Сценарий «Оформить предзаказ», как он сейчас записан</div><div data-stat></div><div data-map></div></div></div></div>`;
      let showMarks = !!(ctx.result || ctx.readonly);
      function branches() {
        const ev = showMarks ? extEval(a) : null;
        const out = [];
        EV.forEach(e => { if (!a.add.includes(e.id)) return; const i = a.end[e.id], en = i != null ? e.ends[i] : null; out.push({ step: e.step, t: e.t, react: en ? en.t : '', go: en ? en.go : null, mark: ev ? (e.dis ? 'bad' : ev.endOk(e) ? 'ok' : 'warn') : '' }); });
        return out;
      }
      function draw() {
        const step = cur + 1, evs = evOrder(step);
        TR.$('[data-walk]', el).innerHTML = `<div class="uc-lbl">Прогон: шаг ${step} из ${FLOW.length}</div>
          <div class="uc-now"><b>${step}. ${esc(FLOW[cur].t)}</b><span class="small">Что может пойти не так или иначе на этом шаге?</span></div>
          <div class="uc-evs">${evs.map(e => `<button type="button" class="uc-ev" data-ev="${e.id}" aria-pressed="${a.add.includes(e.id)}" ${ctx.readonly ? 'disabled' : ''}><span class="mk"></span><span>${esc(e.t)}</span></button>
            ${a.add.includes(e.id) ? `<div class="uc-ends"><span class="uc-lbl">Как реагирует система?</span>${endOrder(e).map(i => `<button type="button" class="uc-end" data-end="${e.id}|${i}" aria-pressed="${a.end[e.id] === i}" ${ctx.readonly ? 'disabled' : ''}>${esc(e.ends[i].t)}</button>`).join('')}</div>` : ''}`).join('')}</div>
          <div class="row between"><button type="button" class="btn sm" data-nav="-1" ${cur === 0 ? 'disabled' : ''}>← Назад</button><span class="small dim tnum">${step} / ${FLOW.length}</span><button type="button" class="btn sm primary" data-nav="1" ${cur === FLOW.length - 1 ? 'disabled' : ''}>Дальше →</button></div>
          ${cur === FLOW.length - 1 ? ui.note('info', 'Прогон закончен', 'Посмотрите на сценарий справа целиком. Нет ли шага, где покупатели «Колоса» спотыкаются каждый день, а ветки нет? Можно вернуться назад.') : ''}`;
        const bs = branches();
        const alt = bs.filter(b => b.go && b.go !== 'x').length, exc = bs.filter(b => b.go === 'x').length, pend = bs.filter(b => !b.go).length;
        TR.$('[data-stat]', el).innerHTML = `<div class="row">${chip('веток: ' + bs.length, 'info')}${chip('альтернатив: ' + alt, 'ok')}${chip('исключений: ' + exc, exc ? 'bad' : '')}${pend ? chip('без реакции: ' + pend, 'warn') : ''}</div>`;
        TR.$('[data-map]', el).innerHTML = flowMap(EXT_STEPS, bs, cur);
      }
      el.addEventListener('click', e => {
        const nv = e.target.closest('[data-nav]'); if (nv) { cur = Math.max(0, Math.min(FLOW.length - 1, cur + (+nv.dataset.nav))); draw(); return; }
        if (ctx.readonly) return;
        if (e.target.closest('[data-ev], [data-end]')) showMarks = false;
        const b = e.target.closest('[data-ev]');
        if (b) { const id = b.dataset.ev; if (a.add.includes(id)) { a.add = a.add.filter(x => x !== id); delete a.end[id]; } else a.add = a.add.concat(id); ctx.save(); ctx.decide('Ветки сценария «Оформить предзаказ»', EV.filter(x => a.add.includes(x.id)).map(x => x.step + ': ' + x.t).join('; ') || '—'); draw(); return; }
        const en = e.target.closest('[data-end]');
        if (en) { const [id, i] = en.dataset.end.split('|'); a.end[id] = +i; ctx.save(); draw(); }
      });
      onSys(el);
      draw();
    },
    check(ans) {
      const ev = extEval(ans), notes = [];
      ev.req.filter(e => !ev.add.includes(e.id)).forEach(e => notes.push({ ok: false, html: `Шаг ${e.step}: ${EV_HINT[e.id]}` }));
      ev.reqFound.filter(e => !ev.endOk(e)).forEach(e => notes.push({ ok: ev.end[e.id] == null ? 'warn' : false, html: ev.end[e.id] == null ? `Ветка «${esc(e.t)}» — реакция системы не выбрана.` : `Ветка «${esc(e.t)}»: такая реакция ломает цель покупателя или правило «Колоса». Какая реакция сохранит заказ и правило?` }));
      ev.disAdded.forEach(e => notes.push({ ok: false, html: `Лишняя ветка «${esc(e.t)}» — ${esc(e.why)}.` }));
      EV.filter(e => e.opt && ev.add.includes(e.id) && !ev.endOk(e)).forEach(e => notes.push({ ok: 'warn', html: `Ветка «${esc(e.t)}» нужна, но реакция ${ev.end[e.id] == null ? 'не выбрана' : 'не та: что сохранит заказ покупателя?'}` }));
      if (ev.optOk.length) notes.push({ ok: 'info', html: `Сверх главного найдено веток: ${ev.optOk.length} — это хорошо: Лера проверит и их.` });
      if (ev.reqFound.length === ev.req.length && ev.reqEndOk.length === ev.req.length && !ev.disAdded.length) notes.push({ ok: true, html: 'Все главные развилки на месте, реакции системы сохраняют и цель покупателя, и правила «Колоса».' });
      return {
        ok: ev.reqFound.length === ev.req.length && ev.reqEndOk.length >= 4 && ev.disAdded.length <= 1 && ev.score >= 0.75, score: ev.score, notes,
        summary: `Главных развилок найдено: ${ev.reqFound.length} из ${ev.req.length}, с верной реакцией: ${ev.reqEndOk.length}. Дополнительных: ${ev.optOk.length}. Лишних веток: ${ev.disAdded.length}.`,
        mentor: ev.disAdded.length >= 2 ? 'Ветка сценария — событие, которое меняет поведение системы в этом сценарии. Цвет кнопок, логотипы, торты и курьеры — это макет, другие сценарии или вообще не про систему.' : ev.reqFound.length < 3 ? 'Идите по шагам глазами покупателей «Колоса»: поздний вечер, пустая витрина, отказ банка, бабушка без смартфона, оплата наличными на кассе. Каждый такой человек — ветка.' : null
      };
    },
    explain: `${ui.table(['Ветка', 'Реакция системы', 'Дальше'], [
        ['1а. Нет смартфона — звонит в пекарню', 'Кассир оформляет заказ за покупателя на своём экране', '→ шаг 2 (тот же поток, другой исполнитель)'],
        ['3а. Позже 22:30', 'Предупреждение о 22:30; только то, что в плане, или на сегодня из витрины', '→ шаг 4'],
        ['5а. Нет товара к интервалу', 'Сообщить и предложить другой интервал или замену', '↩ шаг 3'],
        ['7а. Банк отклонил оплату', 'Заказ «Создан»; повторить, СБП или оплата при получении', '↩ шаг 7'],
        ['7б. Оплата при получении', '«Ждёт оплаты на месте», код; держим 30 минут после интервала', '→ шаг 9'],
        ['2а, 6а, 8а (дополнительно)', 'Интервалы на завтра; замена купленного товара; чек в очередь и досыл', '→ / ↩']
      ])}
      <p>Все пять главных развилок — из блокнота: правило цеха 22:30, первая партия в 07:20, спор об оплате, покупатели старше 55 лет без смартфона. Ветки находят не фантазией, а знанием предметной области — вот зачем была неделя 3.</p>
      <p>Ветка 1а — интересный случай. Её можно записать расширением, «вариацией технологии» (у Коберна есть такой раздел: тот же сценарий, другой канал) или отдельным сценарием «Оформить предзаказ по телефону» с основным актором «Кассир». Последний вариант удобнее, если у кассира свои шаги, — так и сделаем на диаграмме в следующем задании.</p>
      <p>Лишние ветки — не безобидны: каждая превращается в работу разработчика и тесты Леры. Торт и доставка — другие сценарии, цвет кнопок и логотип — макет, переписать модуль — работа команды, а не событие в жизни покупателя.</p>
      <p class="small muted">Источник: Алистер Коберн — расширения, их нумерация и «вариации технологий и данных»; Гойко Аджич — поиск примеров на границах правил.</p>`,
    report: ans => { const ev = extEval(ans); return EV.filter(e => ev.add.includes(e.id)).map(e => { const i = ev.end[e.id]; return `- шаг ${e.step}: ${e.t} → ${i != null ? e.ends[i].t : 'реакция не выбрана'} ${e.dis ? '[лишняя]' : ev.endOk(e) ? '✓' : '✗'}`; }).join('\n') || '—'; }
  };

  // =====================================================================
  // Практика 3. Разметьте диаграмму вариантов использования «Колоса»
  // =====================================================================
  const DB = [
    { id: 'actor', t: 'Актор-человек', sub: 'роль снаружи, рисуют слева' },
    { id: 'uc', t: 'Вариант использования', sub: 'цель внутри границы системы' },
    { id: 'ext', t: 'Внешняя система', sub: 'чужая система — актор справа' },
    { id: 'none', t: 'Не на диаграмме', sub: 'не роль, не цель, не внешняя система' }
  ];
  const DI = [
    { id: 'a1', t: 'Покупатель', ok: 'actor' }, { id: 'a2', t: 'Кассир', ok: 'actor' }, { id: 'a3', t: 'Технолог', ok: 'actor' },
    { id: 'u1', t: 'Оформить предзаказ', ok: 'uc' }, { id: 'u2', t: 'Оформить предзаказ по телефону', ok: 'uc' }, { id: 'u3', t: 'Оплатить заказ онлайн', ok: 'uc' },
    { id: 'u4', t: 'Выдать заказ', ok: 'uc' }, { id: 'u5', t: 'Посмотреть план выпечки', ok: 'uc' }, { id: 'u6', t: 'Проверить наличие к интервалу', ok: 'uc' },
    { id: 'x1', t: 'Платёжный шлюз «ПэйМост»', ok: 'ext' }, { id: 'x2', t: 'Кассы «КассаПро»', ok: 'ext' },
    { id: 'n1', t: 'Анна Павловна', ok: 'none', h: 'это конкретный человек, а на диаграмме — роли. И по телефону за неё с системой работает кассир.' },
    { id: 'n2', t: 'Нажать кнопку «Оплатить»', ok: 'none', h: 'нажатие кнопки — шаг интерфейса, а не цель. Эллипс — цель на уровне моря.' },
    { id: 'n3', t: 'База данных заказов', ok: 'none', h: 'база данных — часть нашей системы, а не тот, кто с ней взаимодействует снаружи.' }
  ];
  const D_HINT = {
    actor: 'это роль человека, который сам работает с системой. Где на диаграмме такие роли?',
    uc: 'это цель, которую кто-то достигает с помощью системы. Где живут цели?',
    ext: 'это чужая система, с которой «Колос-заказы» обменивается данными. Она внутри нашей границы или снаружи?'
  };
  const DR_CH = [
    { v: 'a1', t: 'Покупатель' }, { v: 'a2', t: 'Кассир' }, { v: 'a3', t: 'Технолог' }, { v: 'x1', t: '«ПэйМост»' }, { v: 'x2', t: '«КассаПро»' },
    { v: 'inc', t: '«include» — выполняется всегда' }, { v: 'ext', t: '«extend» — срабатывает при условии' }
  ];
  const DR = [
    { id: 'r1', t: '«Оформить предзаказ» — кто его начинает?', ok: 'a1', uc: 'u1' },
    { id: 'r2', t: '«Оформить предзаказ по телефону» — кто его начинает?', ok: 'a2', uc: 'u2' },
    { id: 'r3', t: '«Выдать заказ» — кто его начинает?', ok: 'a2', uc: 'u4' },
    { id: 'r4', t: '«Посмотреть план выпечки» — кто его начинает?', ok: 'a3', uc: 'u5' },
    { id: 'r5', t: '«Оплатить заказ онлайн» — с какой внешней системой связан?', ok: 'x1', uc: 'u3' },
    { id: 'r6', t: '«Выдать заказ» — с какой внешней системой связан? (чек полного расчёта)', ok: 'x2', uc: 'u4' },
    { id: 'r7', t: '«Проверить наличие к интервалу» и оба «Оформить предзаказ…»: проверка нужна при каждом оформлении', ok: 'inc' },
    { id: 'r8', t: '«Оплатить заказ онлайн» и «Оформить предзаказ»: оплата сразу — только если покупатель не выбрал оплату при получении', ok: 'ext' }
  ];
  const DR_HINT = {
    a1: 'чья это цель? Кто получает пользу и начинает сценарий?', a2: 'кто в «Колосе» делает это у кассы?', a3: 'кому в цехе нужен план выпечки?',
    x1: 'какая чужая система принимает карту и СБП?', x2: 'какая чужая система пробивает чеки по 54-ФЗ?',
    inc: '«include» — общий кусок, который базовый сценарий выполняет всегда; «extend» — добавка, которая срабатывает только при условии. Какой здесь случай?',
    ext: '«include» — общий кусок, который базовый сценарий выполняет всегда; «extend» — добавка, которая срабатывает только при условии. Какой здесь случай?'
  };
  function dEval(a) {
    const s = (a && a.s) || {}, r = (a && a.r) || {};
    const sr = DI.map(x => ({ x, got: s[x.id], st: s[x.id] === x.ok ? 'ok' : s[x.id] ? 'bad' : 'empty' }));
    const rr = DR.map(x => ({ x, got: r[x.id], st: r[x.id] === x.ok ? 'ok' : r[x.id] ? 'bad' : 'empty' }));
    const sS = sr.filter(x => x.st === 'ok').length / DI.length, rS = rr.filter(x => x.st === 'ok').length / DR.length;
    return { sr, rr, sS, rS, score: sS * 0.55 + rS * 0.45 };
  }
  function kolosDiagram(a, opts) {
    const s = (a && a.s) || {}, r = (a && a.r) || {};
    const pick = b => DI.filter(x => s[x.id] === b).map(x => ({ id: x.id, t: x.t }));
    const ucs = pick('uc');
    const assoc = [];
    DR.slice(0, 6).forEach(x => { if (r[x.id] && x.uc) assoc.push([r[x.id], x.uc]); });
    const inc = [], ext = [];
    if (r.r7 === 'inc') { inc.push(['u1', 'u6'], ['u2', 'u6']); } else if (r.r7 === 'ext') { ext.push(['u6', 'u1'], ['u6', 'u2']); }
    if (r.r8 === 'ext') ext.push(['u3', 'u1']); else if (r.r8 === 'inc') inc.push(['u1', 'u3']);
    return ucDiagram(Object.assign({ id: 'kolos', title: 'Система «Колос-заказы»', left: pick('actor'), right: pick('ext'), ucs, col1: ['u3', 'u6'], assoc, inc, ext }, opts || {}));
  }
  const diagramTask = {
    id: 'diagram', title: 'Разметьте диаграмму вариантов использования «Колоса»',
    simple: howDiagram.simple,
    lead: ui.brief({
      situation: 'Игорь готовит приложение к договору на разработку: «Мне нужна одна картинка — кто пользуется системой и что в неё входит. Нина её посмотрит, а Дима по ней прикинет объём». Ксения выписала на стикеры всё, что прозвучало на встречах.',
      todo: [
        'Разложите 14 стикеров по четырём корзинам: актор-человек, вариант использования, внешняя система, «не на диаграмме». Нажмите стикер, потом корзину (на компьютере можно перетаскивать).',
        'В «Связях» для каждой строки выберите, кто начинает сценарий, с какой внешней системой он связан, или каким отношением связаны два сценария.',
        'Диаграмма внизу рисуется из ваших ответов — смотрите, всё ли на своих местах. Нажмите «Проверить». Засчитывается от 80 %, если «include» и «extend» выбраны верно.'
      ],
      look: 'Человечки слева — роли людей, прямоугольники справа с пометкой «система» — чужие системы, эллипсы внутри рамки — цели. «include» — кусок, который выполняется всегда; «extend» — добавка при условии. На телефоне диаграмму можно прокрутить вбок.'
    }),
    blank: () => ({ s: {}, r: {} }),
    reference: () => ({ s: Object.fromEntries(DI.map(x => [x.id, x.ok])), r: Object.fromEntries(DR.map(x => [x.id, x.ok])) }),
    render(el, ctx) {
      el.classList.add('uc-root');
      const a = ctx.ans; a.s = a.s || {}; a.r = a.r || {};
      el.innerHTML = `<div class="stack"><div class="uc-lbl">Стикеры</div><div data-ds></div><div class="uc-lbl">Связи</div><div data-dr></div><div class="uc-lbl">Диаграмма из ваших ответов</div><div class="board uc-dg" data-dd></div></div>`;
      const ev = (ctx.result || ctx.readonly) ? dEval(a) : null;
      const paint = () => { TR.$('[data-dd]', el).innerHTML = kolosDiagram(a); };
      let srev = null, rrev = null;
      if (ev) { srev = {}; ev.sr.forEach(x => { if (x.got) srev[x.x.id] = x.st; }); rrev = {}; ev.rr.forEach(x => { if (x.got) rrev[x.x.id] = { s: x.st }; }); }
      ui.sort(TR.$('[data-ds]', el), { items: DI.map(x => ({ id: x.id, t: esc(x.t) })), buckets: DB, value: a.s, reveal: srev, readonly: ctx.readonly, seed: 'uc-diag', onChange: v => { a.s = v; ctx.save(); paint(); } });
      ui.match(TR.$('[data-dr]', el), { rows: DR.map(x => ({ id: x.id, t: esc(x.t) })), choices: DR_CH, value: a.r, reveal: rrev, readonly: ctx.readonly, placeholder: 'Выберите…', onChange: v => { a.r = v; ctx.save(); paint(); } });
      paint();
    },
    check(ans) {
      const ev = dEval(ans), notes = [];
      const se = ev.sr.filter(x => x.st === 'empty').length, re = ev.rr.filter(x => x.st === 'empty').length;
      if (se) notes.push({ ok: false, html: `Не разложено стикеров: ${se} из ${DI.length}.` });
      if (re) notes.push({ ok: false, html: `Не выбрано связей: ${re} из ${DR.length}.` });
      ev.sr.filter(x => x.st === 'bad').forEach(x => notes.push({ ok: false, html: `«${esc(x.x.t)}» — ${esc(x.x.ok === 'none' ? x.x.h : D_HINT[x.x.ok])}` }));
      ev.rr.filter(x => x.st === 'bad').forEach(x => notes.push({ ok: false, html: `${esc(x.x.t)} — ${esc(DR_HINT[x.x.ok])}` }));
      if (ev.sS === 1 && ev.rS === 1) notes.push({ ok: true, html: 'Диаграмма собрана: три роли, две внешние системы, шесть целей, include и extend на своих местах.' });
      const incExt = ev.rr.filter(x => ['r7', 'r8'].includes(x.x.id) && x.st !== 'ok').length;
      if (incExt && ev.score >= 0.8) notes.push({ ok: false, html: 'Без верных «include» и «extend» диаграмма не засчитывается: это главное, что отличает её от простого списка.' });
      return {
        ok: ev.score >= 0.8 && incExt === 0, score: ev.score, notes,
        summary: `Стикеры: ${ev.sr.filter(x => x.st === 'ok').length} из ${DI.length}. Связи: ${ev.rr.filter(x => x.st === 'ok').length} из ${DR.length}.`,
        mentor: incExt === 2 && ev.rr.filter(x => ['r7', 'r8'].includes(x.x.id) && x.st === 'bad').length === 2 ? 'Include и extend часто путают местами. Проверочный вопрос: базовый сценарий без этого куска вообще может закончиться? Не может — include. Может, а кусок добавляется лишь иногда — extend.' : null
      };
    },
    explain: `<div class="board uc-dg">${kolosDiagram({ s: Object.fromEntries(DI.map(x => [x.id, x.ok])), r: Object.fromEntries(DR.map(x => [x.id, x.ok])) }, { id: 'kolosref' })}</div>
      <ul class="checks">
        <li><b>Акторы — роли.</b> Анна Павловна — покупательница, но по телефону с системой работает кассир. Поэтому «Оформить предзаказ по телефону» начинает Кассир. Некоторые аналитики добавляют к нему Покупателя вторым актором — это допустимо.</li>
        <li><b>Внешние системы — снаружи.</b> «ПэйМост» и «КассаПро» мы не строим, мы с ними обмениваемся. А база данных — внутри нашей системы и на диаграмме не появляется.</li>
        <li><b>«include»</b> — проверка наличия к интервалу нужна при каждом оформлении, в приложении и по телефону: общий кусок выносят один раз.</li>
        <li><b>«extend»</b> — онлайн-оплата добавляется к оформлению только при условии (покупатель не выбрал оплату на месте). Стрелка смотрит от расширения к базовому сценарию.</li>
        <li><b>Не на диаграмме</b> — кнопки и шаги: порядок и интерфейс живут в тексте сценария и макете.</li>
      </ul>
      <p>Такая картинка — оглавление для Нины и Игоря: видно, что входит в первую версию и с кем «Колос» обменивается данными. А для разработки нужен текст каждого сценария. Источник: UML 2.5 (OMG), Алистер Коберн о том, что диаграмма не заменяет текст.</p>`,
    report: ans => { const ev = dEval(ans); return ev.sr.map(x => `- ${x.x.t} → ${(DB.find(b => b.id === x.got) || { t: '—' }).t} ${x.st === 'ok' ? '✓' : '✗'}`).join('\n') + '\n' + ev.rr.map(x => `- ${x.x.t} → ${(DR_CH.find(c => c.v === x.got) || { t: '—' }).t} ${x.st === 'ok' ? '✓' : '✗'}`).join('\n'); }
  };

  // =====================================================================
  // Практика 4. Перепишите шаги без интерфейса (мини-редактор)
  // =====================================================================
  const UI_PRE = ['кнопк', 'нажим', 'нажал', 'нажат', 'нажм', 'жмет', 'клик', 'тапа', 'тапн', 'тапнет', 'синю', 'синей', 'синяя', 'синий', 'зелен', 'красн', 'серую', 'серой', 'серая', 'серый', 'экран', 'выпадающ', 'галочк', 'чекбокс', 'свайп', 'вкладк', 'иконк', 'страниц', 'всплыва', 'перетаск', 'скролл', 'листает', 'пролист', 'шапк', 'слайдер', 'плашк', 'курсор', 'некликаб', 'лотк', 'лоток', 'щел', 'мигает', 'звездочк'];
  const UI_EXACT = ['поле', 'поля', 'полях', 'полем', 'меню', 'окне', 'окно', 'окошко', 'ок'];
  const normW = w => w.toLowerCase().replace(/ё/g, 'е');
  const isUI = w => { const x = normW(w); return UI_EXACT.includes(x) || UI_PRE.some(p => x.startsWith(p)); };
  const uiWords = tx => (String(tx || '').match(/[А-Яа-яЁёA-Za-z0-9]+/g) || []).filter(isUI);
  function markUI(tx) { return String(tx || '').split(/([А-Яа-яЁёA-Za-z0-9]+)/).map(p => p && isUI(p) ? `<mark class="uc-mark">${esc(p)}</mark>` : esc(p)).join(''); }
  const NT = s => normW(String(s || ''));
  const RW = [
    { id: 'w1', bad: 'Покупатель тапает по иконке пекарни на карте и жмёт синюю кнопку «Выбрать».', who: /покупател/, mean: t => /пекарн/.test(t), mh: 'Куда делась пекарня? Шаг про то, что покупатель её выбирает.', ref: 'Покупатель выбирает пекарню.' },
    { id: 'w2', bad: 'Система показывает выпадающий список, где свободные интервалы зелёные, а занятые серые.', who: /систем/, mean: t => /интервал/.test(t) && /(свобод|доступ)/.test(t), mh: 'Что именно показывает система? Какие интервалы видит покупатель?', ref: 'Система показывает свободные получасовые интервалы выдачи.' },
    { id: 'w3', bad: 'Если уже 22:31, кнопка «На завтра» становится серой и некликабельной.', who: /систем/, mean: t => /22[:.]3\d|22 ?ч/.test(t) && /(сообща|предупрежд|не принима|закрыт|предлага|недоступ|нельзя)/.test(t), mh: 'Серая кнопка прятала правило. Какое? Запишите его словами: что сообщает система и что она предлагает после 22:30.', ref: 'Если приём заказов на завтра уже закрыт (после 22:30), система сообщает об этом и предлагает только то, что уже запланировано в выпечку.' },
    { id: 'w4', bad: 'Покупатель перетаскивает карточки товаров в корзину внизу экрана.', who: /покупател/, mean: t => /(товар|выпечк|позици)/.test(t) && /(добав|выбира|клад|собира)/.test(t), mh: 'Что покупатель делает с товарами — какое у него намерение?', ref: 'Покупатель добавляет товары в заказ.' },
    { id: 'w5', bad: 'Покупатель нажимает «Оплатить», вводит 16 цифр карты в поля и жмёт «ОК» во всплывающем окне банка.', who: /покупател/, mean: t => /(оплач|оплат|плат)/.test(t), mh: 'Чего добивается покупатель всеми этими нажатиями?', ref: 'Покупатель оплачивает заказ картой или через СБП.' },
    { id: 'w6', bad: 'На экране появляется зелёная галочка и крупный текст с кодом.', who: /(систем|покупател)/, mean: t => /код/.test(t), mh: 'Что важно для покупателя в этом шаге? Что он должен узнать?', ref: 'Система подтверждает заказ и сообщает покупателю код заказа.' }
  ];
  const RWF = [{ id: 'ui', t: 'без слов интерфейса' }, { id: 'mean', t: 'смысл и правило сохранены' }, { id: 'who', t: 'понятно, кто действует' }];
  function rwEval(r, tx) {
    const t = NT(tx).trim(), changed = t.length >= 10 && t !== NT(r.bad).trim();
    const words = uiWords(tx);
    const f = { ui: changed && !words.length, mean: changed && r.mean(t), who: changed && r.who.test(t) };
    const n = Object.values(f).filter(Boolean).length;
    return { f, n, changed, words, pass: n === 3, empty: !t };
  }
  function rwLive(r, tx) {
    const ev = rwEval(r, tx);
    const line = ev.empty ? 'Жду ваш вариант. Начните с того, кто действует: «Покупатель…» или «Система…».'
      : !ev.changed ? 'Пока это почти то же самое, что было.'
        : ev.words.length ? `«${esc(ev.words[0])}» — это моё, из макета. В сценарии — что человек делает или что делает система.`
          : !ev.f.mean ? esc(r.mh) : !ev.f.who ? 'Кто это делает — покупатель или система? Начните шаг с действующего лица.' : 'Отлично: такой шаг переживёт любой мой макет.';
    return `${ev.changed && ev.words.length ? `<div class="was">${markUI(tx)}</div>` : ''}<div class="uc-feats">${RWF.map(x => chip((ev.f[x.id] ? '✓ ' : '✕ ') + esc(x.t), ev.f[x.id] ? 'ok' : ev.empty ? '' : 'bad')).join('')}</div>${ui.say('sonya', line)}`;
  }
  const neutralTask = {
    id: 'neutral', title: 'Перепишите сценарий без интерфейса',
    simple: howFlow.simple,
    lead: ui.brief({
      situation: 'Стажёр из соседней команды прислал «сценарий» предзаказа, списанный с макета. Соня: «Тут половина — мои кнопки и цвета. Я завтра перенесу кнопку вниз — и ваш сценарий врёт. А где-то за серой кнопкой вообще спряталось правило». Дима: «И мне непонятно, что делать: красить кнопку или проверять время?».',
      todo: [
        'Для каждого из шести шагов напишите в поле нейтральный вариант: кто действует и чего добивается — без кнопок, цветов, экранов и жестов.',
        'Под полем — три признака, по которым проверяет редактор, и реплика Сони. Слова интерфейса подсвечиваются красным. Добивайтесь трёх зелёных признаков.',
        'Нажмите «Проверить». Засчитывается, если хотя бы пять шагов проходят все признаки и общий балл от 80 %.'
      ],
      lookTitle: 'Подсказка',
      look: 'Хороший шаг читается как простое предложение: «Покупатель выбирает пекарню». «Система сообщает, что…». Если в шаге было правило (серая кнопка после 22:31), оно должно остаться — словами. Редактор проверяет признаки, а не смысл: перечитайте шаг глазами Димы.'
    }),
    blank: () => ({ t: {} }),
    reference: () => ({ t: Object.fromEntries(RW.map(r => [r.id, r.ref])) }),
    render(el, ctx) {
      el.classList.add('uc-root');
      const a = ctx.ans; a.t = a.t || {};
      el.innerHTML = `<div class="stack">${RW.map((r, i) => `<div class="uc-rw" data-rw="${r.id}"><span class="uc-lbl">Шаг ${i + 1} · было</span><div class="was">${markUI(r.bad)}</div>
        <label class="field"><span>Стало — нейтрально к интерфейсу</span><textarea rows="2" data-rt="${r.id}" placeholder="Покупатель … / Система …" ${ctx.readonly ? 'readonly' : ''}>${esc(a.t[r.id] || '')}</textarea></label><div data-rl="${r.id}"></div></div>`).join('')}</div>`;
      const paint = id => {
        const r = RW.find(x => x.id === id), box = TR.$(`[data-rw="${id}"]`, el), ev = rwEval(r, a.t[id]);
        TR.$(`[data-rl="${id}"]`, el).innerHTML = rwLive(r, a.t[id]);
        box.classList.remove('ok', 'warn', 'bad');
        if (ctx.result || ctx.readonly) box.classList.add(ev.pass ? 'ok' : ev.n >= 2 ? 'warn' : 'bad');
      };
      RW.forEach(r => paint(r.id));
      if (ctx.readonly) return;
      el.addEventListener('input', e => { const ta = e.target.closest('[data-rt]'); if (!ta) return; a.t[ta.dataset.rt] = ta.value; ctx.save(); paint(ta.dataset.rt); });
    },
    check(ans) {
      const t = (ans && ans.t) || {};
      const ev = RW.map(r => ({ r, e: rwEval(r, t[r.id]) }));
      const pass = ev.filter(x => x.e.pass).length, score = ev.reduce((s, x) => s + x.e.n / 3, 0) / RW.length;
      const notes = ev.map((x, i) => {
        if (x.e.empty) return { ok: false, html: `Шаг ${i + 1}: пока пусто.` };
        if (!x.e.changed) return { ok: false, html: `Шаг ${i + 1}: это почти то же, что было.` };
        if (x.e.pass) return { ok: true, html: `Шаг ${i + 1}: нейтрально, смысл на месте.` };
        const m = [];
        if (!x.e.f.ui) m.push(`остались слова интерфейса: ${x.e.words.slice(0, 3).map(w => '«' + esc(w) + '»').join(', ')}`);
        if (!x.e.f.mean) m.push(esc(x.r.mh));
        if (!x.e.f.who) m.push('непонятно, кто действует — покупатель или система');
        const msg = m.join('; ');
        return { ok: x.e.n >= 2 ? 'warn' : false, html: `Шаг ${i + 1}: ${msg}${/[.?!»]$/.test(msg) ? '' : '.'}` };
      });
      const lost = ev.find(x => x.r.id === 'w3' && x.e.changed && !x.e.f.mean);
      return {
        ok: pass >= 5 && score >= 0.8, score, notes,
        summary: `Проходят все признаки: ${pass} из ${RW.length}. Общий балл: ${Math.round(score * 100)} %.`,
        mentor: lost ? 'Самое коварное — шаг 3. Там интерфейс не просто лишний: он прятал правило. «Серая кнопка» — это «после 22:30 заказ на завтра не принимается». Уберёте кнопку и не запишете правило — правило исчезнет из требований.' : null
      };
    },
    explain: `${ui.table(['Было', 'Стало'], RW.map(r => [markUI(r.bad), esc(r.ref)]))}
      <p>Нейтральный к интерфейсу сценарий живёт дольше любого макета: Соня может перенести кнопку, заменить список на календарь, а приложение — на голосового помощника, и сценарий останется верным. Детали экрана не пропадают — они переезжают в макет и спецификацию экрана, где у них свой читатель.</p>
      <p>Главная опасность интерфейса в сценарии — <b>спрятанная логика</b>. «Кнопка становится серой после 22:31» выглядит как дизайн, а на деле это бизнес-правило 22:30. Аналитик вытаскивает такие правила на свет и записывает словами — иначе разработчик честно сделает серую кнопку, а проверку времени на сервере забудет.</p>
      <p class="small muted">Источник: Алистер Коберн — «держите интерфейс вне сценария» (keep the UI out).</p>`,
    refNote: 'Формулировки — пример: засчитываются любые шаги без слов интерфейса, с действующим лицом и сохранённым смыслом.',
    report: ans => RW.map((r, i) => { const tx = ((ans && ans.t) || {})[r.id] || ''; const e = rwEval(r, tx); return `- Шаг ${i + 1}: ${tx.trim() || '—'} ${e.pass ? '✓' : '✗'}`; }).join('\n')
  };

  // =====================================================================
  // Практика 5. Записка команде: когда история, когда сценарий
  // =====================================================================
  const W_RUBRIC = [
    'История — единица планирования и разговора: маленькая, с ценностью и критериями приёмки; удобна для бэклога, приоритетов и линии MVP к 1 марта',
    'Сценарий — когда много шагов, веток и ошибок и есть внешние системы: «Оформить предзаказ» с оплатой через «ПэйМост», чеками «КассаПро», правилами 22:30 и 30 минут',
    'Приводит примеры «Колоса» для обоих: история — например, «повторить прошлый заказ» или SMS «заказ готов»; сценарий — оформление предзаказа, выдача с оплатой на месте, обмен с «КассаПро»',
    'Показывает, что форматы не исключают друг друга: сценарий режут на истории (основной поток и ветки — отдельные срезы), а критерии историй берут из веток сценария',
    'Учитывает читателя и договор: для фиксированного пакета «КассаПро» и для тестов Леры нужен полный перечень веток, для спринтов по оплате за фактическую работу — истории'
  ];
  const W_REF = 'Предлагаю не выбирать одно из двух. Бэклог ведём историями: это единица планирования и разговора с Ниной — маленькие карточки с ценностью и критериями приёмки, их удобно сравнивать, раскладывать на карте и резать линией MVP к 1 марта. Простые вещи вроде «повторить прошлый заказ» или SMS «заказ готов» прекрасно живут одной историей. Но у нас есть сценарии с большим числом шагов, веток и чужих систем: «Оформить предзаказ» (22:30, нет товара, банк отказал, оплата на месте, «ПэйМост», чек «предоплата» в «КассаПро») и «Выдать заказ» с оплатой на месте и чеком полного расчёта. Для них пишем сценарии использования: Лере нужен полный перечень веток для тестов, а Игорю — полный объём для пакета «КассаПро» с фиксированной ценой, иначе его не оценить. Связываем так: сценарий режем на истории — основной поток одна история, каждая важная ветка ещё одна; критерии приёмки историй берём из веток сценария. Так спринты живут историями, а целостная картина поведения не теряется.';
  const whyTask = {
    id: 'why', title: 'Записка команде: история или сценарий',
    simple: {
      icon: '⚖️',
      plain: 'История и сценарий — не соперники. История — маленькая карточка для планирования и разговора. Сценарий — подробная карта поведения со всеми ветками. Выбирают по тому, кто будет читать и что ему нужно.',
      analogy: 'В пекарне есть доска заказов на день — короткие строки «Покровка: 40 круассанов к 06:30». И есть технологические карты — подробные, со всеми «если тесто не поднялось». Доска — чтобы решить, что печь сегодня. Карта — чтобы испечь правильно.',
      tech: 'Майк Кон: истории меньше, нацелены на ценность и разговор; сценарии шире, описывают поведение полностью. Use-Case 2.0 (Айвар Якобсон, 2011): сценарий режут на срезы, каждый реализуется как история. Выбор зависит от читателя, сложности и договора (фиксированный объём или оплата по факту).'
    },
    lead: ui.brief({
      situation: 'Утренний чат команды: Дима, Лера и Игорь спорят, как записывать требования к предзаказу, — их сообщения ниже. Ксения: «Напишите команде короткую записку: когда в „Колосе“ история, а когда сценарий использования — и как они уживаются».',
      todo: [
        'Прочитайте спор в чате.',
        'Напишите записку: 6–10 предложений, от 300 символов. С примерами «Колоса» — какие вещи историями, какие сценариями и как связать одно с другим.',
        'Нажмите «Проверить с Ксенией (Claude)» или «Сверить с эталоном самому» и честно отметьте раскрытые пункты. Засчитывается от 60 %.'
      ],
      lookTitle: 'На что опереться',
      look: 'Вкладка «История или сценарий» в теории: семь ситуаций. Лаборатория: сколько веток у «Оформить предзаказ». Договор «Колоса»: обследование — фиксированная цена, разработка — оплата по факту работы, спринты по 2 недели, пакет «КассаПро» — фиксированный объём.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: W_REF, self: W_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('uc-root');
      el.insertAdjacentHTML('beforeend', `<div class="talk">${ui.say('dima', 'Давайте весь предзаказ писать только историями. Use case — это водопад, их никто не читает.')}${ui.say('lera', 'А я без сценария не соберу тесты на оплату: банк отказал, нет связи с «КассаПро», оплата на месте.')}${ui.say('igor', 'А мне для пакета «КассаПро» с фиксированной ценой нужен полный перечень шагов и ошибок — иначе не оценить.')}</div>`);
      const j = document.createElement('div'); j.style.marginTop = '12px'; el.appendChild(j);
      ui.justify(j, {
        id: 'uc-why', q: 'Записка команде: когда в «Колосе» пользовательская история, а когда сценарий использования?', placeholder: 'Коллеги, предлагаю…',
        qPlain: 'Напишите записку команде проекта для сети пекарен: когда записывать требования пользовательскими историями, а когда сценариями использования. Нужно объяснить роль историй (планирование, ценность, MVP), когда нужен сценарий (много веток, внешние системы: платёжный шлюз и кассы, правила 22:30 и 30 минут), привести примеры для обоих, показать, как они уживаются (сценарий режут на истории, критерии из веток), и учесть читателя и договор (фиксированный пакет интеграции с кассами, тестировщик, спринты).',
        rubric: W_RUBRIC, reference: W_REF, value: ctx.ans.j, readonly: ctx.readonly, minLen: 300,
        onChange: v => { ctx.ans.j = v; ctx.save(); ctx.decide('Записка: история или сценарий', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j);
      return {
        ok: s >= 0.6, score: s,
        summary: s ? `Оценка записки: ${Math.round(s * 100)} %.` : 'Напишите записку (от 300 символов) и проверьте её с Ксенией или сверьте с эталоном сами.',
        notes: s && s < 0.6 ? [{ ok: false, html: 'Спор в чате — не «кто прав», а «кому что нужно». Диме — маленькие куски для спринтов, Лере — все ветки, Игорю — полный объём пакета. Покажите, как оба формата закрывают эти нужды вместе.' }] : []
      };
    },
    explain: '<p>Правы все трое — каждый о своём. Дима прав, что спринты удобнее планировать историями. Лера права, что ветки оплаты в карточку не влезут. Игорь прав, что фиксированную цену без полного перечня не назвать. Сильная записка не выбирает победителя, а распределяет форматы по задачам и связывает их: <b>сценарий — карта поведения, истории — куски этой карты для спринтов</b>.</p><p>В «Колосе» разумно так: сценарии для «Оформить предзаказ», «Выдать заказ», «Заказать торт» и обмена с «КассаПро»; истории — для бэклога, включая срезы этих сценариев и мелкие улучшения. Это и есть идея Use-Case 2.0 Айвара Якобсона. А чем заменить «никто не читает» — короткими сценариями без интерфейса, как вы писали сегодня.</p>',
    report: ans => (ans.j && ans.j.text) ? ans.j.text : '—'
  };

  // =====================================================================
  TR.stage({
    id: ID, act: 4, order: 320, slot: 'Вт 10:00', title: 'Use case',
    when: 'вторник, 27 октября, 10:00 · переговорная «Квант Софт», маркерная доска',
    intro: [
      { who: 'lera', html: 'Вчерашние истории хороши для спринта. Но мне для оплаты нужны все ветки: банк отказал, покупатель передумал, связь пропала. На карточке их не видно.' },
      { who: 'dima', html: 'А я против толстых документов. Use case — это же водопад: написали сто страниц, никто не читает.' },
      { who: 'ksenia', html: 'Сегодня — сценарии использования по Коберну: кто чего хочет добиться, кому ещё это важно, что система обещает при любом исходе, основной путь и ветки. Возьмём главный сценарий «Колоса» — «Оформить предзаказ», нарисуем диаграмму вариантов использования и к концу разберёмся, кто из вас прав. Подсказка: оба.' }
    ],
    facts: ['F-cutoff', 'F-slot', 'F-pay', 'F-54fz', 'F-elder', 'F-hold', 'F-batch', 'F-obs-modem'],
    glossary: [
      { term: 'Сценарий использования (use case)', simple: 'Подробная карта: как человек с помощью системы добивается цели — по шагам, с ветками и обещаниями.', tech: 'Описание поведения системы при взаимодействии с актором ради его цели: основной успешный сценарий, расширения, предусловия и гарантии (Алистер Коберн, «Современные методы описания функциональных требований к системам»).' },
      { term: 'Актор', simple: 'Тот, кто снаружи и чего-то хочет от системы или ей отвечает: покупатель, кассир, платёжный шлюз.', tech: 'Роль (не конкретный человек) или внешняя система. Основной актор начинает сценарий ради своей цели; вспомогательный помогает по ходу (например, «ПэйМост»).' },
      { term: 'Уровень цели', simple: 'Высота цели: от облаков («вести бизнес») до морского дна («проверить формат ПИН»).', tech: 'По Коберну: облако и воздушный змей — сводные цели; море — пользовательская цель (один человек, один присест, тест кофе-брейка); рыба — подфункция; моллюск — слишком мелко.' },
      { term: 'Заинтересованные лица и интересы', simple: 'Те, кого нет у экрана, но кому важен результат: технолог, бухгалтер.', tech: 'Раздел сценария: кто ещё зависит от его результата и чего хочет. Определяет, что система должна проверить и записать, даже если основной актор об этом не думает.' },
      { term: 'Предусловие', simple: 'Что уже верно до начала: покупатель вошёл по номеру телефона.', tech: 'Условие, которое система гарантирует перед стартом сценария; внутри сценария его не проверяют.' },
      { term: 'Минимальные гарантии', simple: 'Обещание на любой исход: деньги не спишут без заказа.', tech: 'Что верно после сценария при любом исходе, включая сбой. Защищает интересы заинтересованных лиц.' },
      { term: 'Гарантии успеха (постусловие)', simple: 'Что правда в конце, если всё получилось: заказ оплачен и попал в план.', tech: 'Состояние системы после успешного завершения сценария: цель актора достигнута, интересы заинтересованных лиц удовлетворены.' },
      { term: 'Основной поток', simple: 'Обычный путь, когда всё идёт хорошо, — без «если».', tech: 'Основной успешный сценарий: обычно 3–9 шагов «кто → что делает», чередование актора и системы, без условий и деталей интерфейса.' },
      { term: 'Расширение (альтернатива, исключение)', simple: 'Ветка «а если…»: банк отказал, после 22:30, нет товара.', tech: 'Условие на шаге основного потока (нумерация 7а, 7б) и шаги обработки; заканчивается возвратом, продолжением или неуспехом. Во многих шаблонах делят на альтернативные потоки (цель достигнута иначе) и исключения (цель не достигнута).' },
      { term: 'Диаграмма вариантов использования', simple: 'Картинка-оглавление: человечки, овалы-цели и рамка системы.', tech: 'UML-диаграмма: акторы, граница системы, варианты использования и связи; «include» — базовый сценарий всегда выполняет включаемый, «extend» — расширение срабатывает при условии. Порядок шагов не показывает.' }
    ],
    outro: 'Теперь вы пишете сценарий по Коберну: кто и ради какой цели действует, кому ещё это важно, что верно до начала и что система обещает при любом исходе, основной поток без интерфейса и ветки, где всё идёт не так. Вы разметили диаграмму вариантов использования «Колоса» и знаете, когда история, а когда сценарий: история — для планирования и разговора, сценарий — для веток, интеграций и полного перечня, а связывают их срезами. Завтра — нефункциональные требования: насколько быстро и надёжно всё это должно работать.',
    tasks: [howAnatomy, howFlow, howDiagram, flowTask, extTask, diagramTask, neutralTask, whyTask]
  });
})();
