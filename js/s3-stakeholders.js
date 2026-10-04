/* Неделя 3, понедельник 10:00 — «Кого спрашивать».
   Теория (соседний пример — школьная столовая «Перемена», предзаказ обедов через приложение для родителей):
   луковица заинтересованных лиц и контрольный список с мета-вопросом «кого ещё спросить?»; матрица влияние/интерес
   (Менделоу) с перетаскиванием и стратегиями квадрантов, «чьё „да“ считается» — RACI решений; план коммуникаций —
   симулятор «кому, как и как часто».
   Практика на «Колосе»: лаборатория «кого забыли — что сломается в день запуска 1 марта»; матрица влияние/интерес
   для десяти заинтересованных лиц и стратегии; RACI четырёх спорных решений и «чьё „да“ считается»; план
   коммуникаций с живыми реакциями; ответ Игорю своими словами — почему нельзя спрашивать только Нину. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'stakeholders';

  if (!document.getElementById('stk-css')) document.head.insertAdjacentHTML('beforeend', `<style id="stk-css">
    .stk-root, .stk-root .stack > * { min-width: 0; }
    .stk-root .seg button { white-space: normal; text-align: left; }
    .stk-lbl { font: 600 11px/1.35 var(--f-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--text-muted); }
    .stk-two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 14px; align-items: start; }
    .stk-two > * { min-width: 0; }
    .stk-onion svg { width: 100%; max-width: 380px; display: block; margin: 0 auto; }
    .stk-onion [data-ring], .stk-onion [data-pp] { cursor: pointer; }
    .stk-ppl { display: grid; gap: 5px; }
    .stk-p { display: grid; grid-template-columns: 24px minmax(0, 1fr); gap: 8px; align-items: start; text-align: left; border: 1px solid var(--border); background: var(--surface); border-radius: 9px; padding: 6px 9px; font-size: 13.5px; line-height: 1.4; width: 100%; color: var(--text); }
    .stk-p .n { font: 700 11.5px/22px var(--f-mono); text-align: center; border-radius: 50%; width: 22px; height: 22px; background: var(--surface-3); color: var(--text-2); }
    .stk-p[aria-pressed="true"] { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent) inset; }
    .stk-p.off { opacity: .4; }
    .stk-det { border: 1px solid var(--border); border-left: 4px solid var(--accent); border-radius: 10px; background: var(--surface); padding: 10px 14px; display: grid; gap: 6px; font-size: 14px; }
    .stk-det b.h { font: 600 15px/1.3 var(--f-brand); }
    .stk-det .k { font: 600 11px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .stk-chk { display: grid; gap: 6px; }
    .stk-chk label { display: grid; grid-template-columns: 20px minmax(0, 1fr); gap: 8px; align-items: start; border: 1px solid var(--border); border-radius: 10px; padding: 8px 10px; background: var(--surface); cursor: pointer; font-size: 14px; line-height: 1.4; }
    .stk-chk label.on { border-color: var(--ok); background: color-mix(in srgb, var(--ok-soft) 60%, var(--surface)); }
    .stk-chk input { accent-color: var(--accent); width: 16px; height: 16px; margin-top: 3px; }
    .stk-chk small { display: block; color: var(--text-muted); font-size: 12.5px; }
    .stk-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .stk-chips .chip { white-space: normal; }
    .stk-scenes { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 8px; }
    .stk-scene { border: 1px solid var(--border); border-radius: 10px; background: var(--surface); padding: 8px 11px; font-size: 13.5px; line-height: 1.45; display: grid; gap: 3px; align-content: start; min-width: 0; }
    .stk-scene .h { font: 600 12px/1.3 var(--f-mono); color: var(--violet); letter-spacing: .02em; }
    .stk-find .buckets { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
    .stk-find .bucket[data-b="none"] { border-style: dashed; }
    .stk-day { display: grid; gap: 5px; }
    .stk-ev { display: grid; grid-template-columns: 74px minmax(0, 1fr); gap: 4px 10px; align-items: start; border: 1px solid var(--border); border-left: 4px solid var(--border-strong); border-radius: 9px; background: var(--surface); padding: 7px 10px; font-size: 13.5px; line-height: 1.45; }
    .stk-ev .tm { font: 600 12px/1.5 var(--f-mono); color: var(--text-muted); }
    .stk-ev.ok { border-left-color: var(--ok); } .stk-ev.bad { border-left-color: var(--bad); background: color-mix(in srgb, var(--bad-soft) 45%, var(--surface)); } .stk-ev.warn { border-left-color: var(--warn); }
    .stk-ev b { margin-right: 4px; } .stk-ev.ok b { color: var(--ok); } .stk-ev.bad b { color: var(--bad); } .stk-ev.warn b { color: var(--warn); }
    .stk-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    .stk-mx { display: grid; gap: 8px; }
    .stk-mx-wrap { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 6px; align-items: stretch; }
    .stk-mx-y { writing-mode: vertical-rl; transform: rotate(180deg); font: 600 11px/1.2 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); text-align: center; }
    .stk-mx-x { font: 600 11px/1.2 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); text-align: center; padding-left: 28px; }
    .stk-mx-board { position: relative; height: 340px; border: 1px solid var(--border-strong); border-radius: 12px; overflow: hidden; background: var(--surface); touch-action: manipulation; }
    .stk-mx-board .q { position: absolute; width: 50%; height: 50%; padding: 6px 8px; font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .04em; color: var(--text-muted); pointer-events: none; }
    .stk-mx-board .q.HL { left: 0; top: 0; background: color-mix(in srgb, var(--warn) 9%, var(--surface)); }
    .stk-mx-board .q.HH { right: 0; top: 0; background: color-mix(in srgb, var(--accent) 11%, var(--surface)); text-align: right; border-left: 1px dashed var(--border-strong); }
    .stk-mx-board .q.LL { left: 0; bottom: 0; background: var(--surface); border-top: 1px dashed var(--border-strong); display: flex; align-items: flex-end; }
    .stk-mx-board .q.LH { right: 0; bottom: 0; background: color-mix(in srgb, var(--info) 9%, var(--surface)); text-align: right; border-left: 1px dashed var(--border-strong); border-top: 1px dashed var(--border-strong); display: flex; align-items: flex-end; justify-content: flex-end; }
    .stk-mx-board [data-toks] { position: absolute; inset: 16px 46px; }
    .stk-tk { position: absolute; transform: translate(-50%, -50%); border: 1.5px solid var(--border-strong); background: var(--surface-2); color: var(--text); border-radius: 99px; padding: 3px 9px; font-size: 12.5px; font-weight: 600; line-height: 1.3; white-space: nowrap; cursor: grab; touch-action: none; user-select: none; z-index: 2; box-shadow: 0 1px 0 var(--border); }
    .stk-tray .stk-tk { position: relative; transform: none; }
    .stk-tk.picked { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); z-index: 4; }
    .stk-tk.drag { z-index: 5; cursor: grabbing; opacity: .9; }
    .stk-tk.ok { border-color: var(--ok); background: var(--ok-soft); color: var(--ok); }
    .stk-tk.warn { border-color: var(--warn); background: var(--warn-soft); color: var(--warn); }
    .stk-tk.bad { border-color: var(--bad); background: var(--bad-soft); color: var(--bad); }
    .stk-tk:disabled { cursor: default; opacity: 1; }
    .stk-tray { display: flex; flex-wrap: wrap; gap: 6px; padding: 10px; border: 1px dashed var(--border-strong); border-radius: 12px; min-height: 46px; background: var(--surface); }
    .stk-raci { overflow-x: auto; max-width: 100%; }
    .stk-raci table { border-collapse: separate; border-spacing: 3px; min-width: 520px; width: 100%; font-size: 13.5px; }
    .stk-raci th { font: 600 11px/1.25 var(--f-mono); color: var(--text-muted); text-align: center; padding: 4px 2px; }
    .stk-raci th small { display: block; font-weight: 400; font-family: var(--f-body); letter-spacing: 0; }
    .stk-raci td.rl, .stk-raci th.rl { text-align: left; min-width: 170px; color: var(--text); font-family: var(--f-body); font-size: 13.5px; font-weight: 500; line-height: 1.35; padding: 4px 6px; }
    .stk-raci tr.ok td.rl { box-shadow: inset 3px 0 0 var(--ok); } .stk-raci tr.warn td.rl { box-shadow: inset 3px 0 0 var(--warn); } .stk-raci tr.bad td.rl { box-shadow: inset 3px 0 0 var(--bad); }
    .stk-cell { width: 100%; min-width: 40px; height: 34px; border-radius: 8px; border: 1px solid var(--border-strong); background: var(--surface); font: 700 14px/1 var(--f-mono); color: var(--text-muted); }
    .stk-cell[data-v="R"] { color: var(--info); border-color: var(--info); background: var(--info-soft); }
    .stk-cell[data-v="A"] { color: var(--accent); border-color: var(--accent); background: var(--accent-soft); }
    .stk-cell[data-v="C"] { color: var(--warn); border-color: var(--warn); background: var(--warn-soft); }
    .stk-cell[data-v="I"] { color: var(--text-2); background: var(--surface-3); }
    .stk-cell:disabled { opacity: 1; cursor: default; }
    .stk-say-btns { display: flex; flex-wrap: wrap; gap: 6px; }
    .stk-cm { display: grid; gap: 8px; }
    .stk-cmrow { border: 1px solid var(--border); border-left: 4px solid var(--border-strong); border-radius: 10px; background: var(--surface); padding: 9px 12px; display: grid; gap: 7px; }
    .stk-cmrow.ok { border-left-color: var(--ok); } .stk-cmrow.warn { border-left-color: var(--warn); } .stk-cmrow.bad { border-left-color: var(--bad); }
    .stk-cmrow .hd { display: flex; flex-wrap: wrap; gap: 4px 10px; align-items: baseline; justify-content: space-between; }
    .stk-cmrow .hd b { font: 600 15px/1.3 var(--f-brand); }
    .stk-cmrow .sels { display: grid; grid-template-columns: minmax(0, 1fr); gap: 6px; }
    .stk-cmrow .sels .field { grid-template-columns: 130px minmax(0, 1fr); align-items: center; gap: 4px 10px; }
    .stk-cmrow .re { font-size: 13.5px; line-height: 1.45; color: var(--text-2); }
    .stk-cmrow .re.ok { color: var(--ok); } .stk-cmrow .re.bad { color: var(--bad); } .stk-cmrow .re.warn { color: var(--warn); }
    .stk-sim { display: grid; gap: 6px; }
    .stk-sim .r { display: grid; grid-template-columns: 150px minmax(0, 1fr); gap: 6px 12px; align-items: start; border: 1px solid var(--border); border-left: 4px solid var(--border-strong); border-radius: 10px; background: var(--surface); padding: 8px 10px; }
    .stk-sim .r.ok { border-left-color: var(--ok); } .stk-sim .r.warn { border-left-color: var(--warn); } .stk-sim .r.bad { border-left-color: var(--bad); }
    .stk-sim .r .who b { font: 600 14px/1.3 var(--f-brand); display: block; }
    .stk-sim .r .who small { color: var(--text-muted); font-size: 12px; }
    .stk-sim .r .ctl { display: grid; gap: 5px; }
    .stk-sim .r .re { font-size: 13px; color: var(--text-2); line-height: 1.4; }
    .stk-sim .seg button { padding: 4px 8px; font-size: 12.5px; }
    @media (max-width: 760px) { .stk-two { grid-template-columns: minmax(0, 1fr); } }
    @media (max-width: 560px) {
      .stk-cmrow .sels .field { grid-template-columns: minmax(0, 1fr); }
      .stk-ppl { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .stk-sim .r { grid-template-columns: minmax(0, 1fr); }
      .stk-ev { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .stk-stats { gap: 6px; }
      .stk-stats .stat { padding: 8px; }
      .stk-mx-board { height: 300px; }
      .stk-tk { font-size: 12px; padding: 2px 7px; }
      .stk-find .bucket { padding: 8px 6px; }
      .stk-find .tok { font-size: 13px; padding: 5px 7px; }
    }
  </style>`);

  // ---------- общие помощники ----------
  const fresh = fn => pane => { const d = document.createElement('div'); pane.appendChild(d); fn(d); };
  const quizRef = cfg => cfg.options.map((o, i) => o.ok ? i : -1).filter(i => i >= 0);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const qt = t => esc(/^«/.test(t) ? t : "«" + t + "»");
  const quadOf = p => p ? (p.y >= 50 ? 'H' : 'L') + (p.x >= 50 ? 'H' : 'L') : '';
  const QUAD = {
    HH: { t: 'Управлять плотно', s: 'влияние ↑ · интерес ↑', d: 'Ключевые игроки. Вовлекать в решения, встречаться регулярно, приносить варианты с ценой, договорённости фиксировать письменно.', miss: 'Если недооценить: решение примут без них — и отменят на следующий день.' },
    HL: { t: 'Держать удовлетворёнными', s: 'влияние ↑ · интерес ↓', d: 'Могут остановить проект, но им не до деталей. Коротко, по делу и заранее: что от них нужно и к какому сроку. Не заваливать письмами.', miss: 'Если недооценить: «вдруг» отказ или проверка за неделю до запуска. Если переоценить — раздражение от лишних писем.' },
    LH: { t: 'Держать в курсе', s: 'влияние ↓ · интерес ↑', d: 'Им важно, но решают не они. Регулярно сообщать, звать на демо и проверки, собирать отзывы. Их интересы до тех, кто решает, доносит аналитик.', miss: 'Если недооценить: узнают обо всём в день запуска и не станут пользоваться.' },
    LL: { t: 'Наблюдать', s: 'влияние ↓ · интерес ↓', d: 'Минимум сил: сообщать по необходимости и следить, не изменилось ли их положение.', miss: 'Ошибка — забыть совсем: положение на карте меняется.' }
  };

  // Доска «влияние / интерес» с перетаскиванием. x — интерес (0…100 слева направо), y — влияние (0…100 снизу вверх).
  // cfg: { items:[{id,t,title}], value:{id:{x,y}}, readonly, reveal:{id:'ok'|'warn'|'bad'}, labels:{HH,HL,LH,LL}, picked, onChange(value,id), onPick(id) }
  function mxBoard(el, cfg) {
    let value = TR.clone(cfg.value || {}), picked = cfg.picked || null, drag = null;
    const lab = cfg.labels || { HH: QUAD.HH.s, HL: QUAD.HL.s, LH: QUAD.LH.s, LL: QUAD.LL.s };
    el.innerHTML = `<div class="stk-mx">
      <div class="stk-mx-wrap"><div class="stk-mx-y">Влияние на проект →</div>
        <div class="stk-mx-board" data-board role="group" aria-label="Матрица влияние / интерес">
          <div class="q HL">${lab.HL}</div><div class="q HH">${lab.HH}</div><div class="q LL"><span>${lab.LL}</span></div><div class="q LH"><span>${lab.LH}</span></div>
          <div data-toks></div></div></div>
      <div class="stk-mx-x">Интерес к проекту →</div>
      ${cfg.tray === false ? '' : '<div class="stk-tray" data-tray aria-label="Ещё не на матрице"></div>'}
      ${cfg.readonly || cfg.hint === false ? '' : '<div class="small dim">Перетащите карточку на матрицу или нажмите на карточку, затем на место на матрице. Стрелки на клавиатуре двигают выбранную карточку. Вернуть карточку — перетащите её вниз, в лоток.</div>'}
    </div>`;
    const board = TR.$('[data-board]', el), toks = TR.$('[data-toks]', el), tray = TR.$('[data-tray]', el);
    const tk = (it, onB) => {
      const p = value[it.id], rv = cfg.reveal && cfg.reveal[it.id];
      return `<button type="button" class="stk-tk ${rv || ''} ${picked === it.id ? 'picked' : ''}" data-tk="${esc(it.id)}" ${onB ? `style="left:${p.x}%;top:${100 - p.y}%"` : ''} ${cfg.readonly ? 'disabled' : ''} title="${esc(it.title || it.t)}" aria-label="${esc(it.title || it.t)}${onB ? `: влияние ${p.y}, интерес ${p.x}` : ': ещё не на матрице'}">${esc(it.t)}</button>`;
    };
    function draw() {
      toks.innerHTML = cfg.items.filter(i => value[i.id]).map(i => tk(i, true)).join('');
      if (tray) tray.innerHTML = cfg.items.filter(i => !value[i.id]).map(i => tk(i, false)).join('') || '<span class="small dim">Все карточки на матрице.</span>';
    }
    const inside = (r, e) => e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    // координаты — во внутреннем слое с отступами: длинная подпись у края матрицы не обрезается
    const toPct = e => { const r = toks.getBoundingClientRect(); return { x: Math.round(clamp((e.clientX - r.left) / r.width * 100, 0, 100)), y: Math.round(clamp(100 - (e.clientY - r.top) / r.height * 100, 0, 100)) }; };
    function emit(id) { cfg.onChange && cfg.onChange(TR.clone(value), id); }
    function place(id, p) { value[id] = p; picked = null; draw(); emit(id); cfg.onPick && cfg.onPick(id); }
    function unplace(id) { delete value[id]; picked = null; draw(); emit(id); cfg.onPick && cfg.onPick(null); }
    if (!cfg.readonly) {
      el.addEventListener('pointerdown', e => {
        const b = e.target.closest('[data-tk]'); if (!b) return;
        drag = { id: b.dataset.tk, b, x0: e.clientX, y0: e.clientY, moved: false, onB: !!value[b.dataset.tk] };
        try { b.setPointerCapture(e.pointerId); } catch (err) { }
      });
      el.addEventListener('pointermove', e => {
        if (!drag) return;
        const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
        if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 6) return;
        drag.moved = true; drag.b.classList.add('drag');
        if (drag.onB && inside(board.getBoundingClientRect(), e)) { const p = toPct(e); drag.b.style.left = p.x + '%'; drag.b.style.top = (100 - p.y) + '%'; drag.b.style.transform = ''; }
        else drag.b.style.transform = drag.onB ? `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))` : `translate(${dx}px, ${dy}px)`;
      });
      el.addEventListener('pointerup', e => {
        if (!drag) return; const d = drag; drag = null;
        if (!d.moved) { picked = picked === d.id ? null : d.id; draw(); cfg.onPick && cfg.onPick(picked || (value[d.id] ? d.id : null)); return; }
        if (inside(board.getBoundingClientRect(), e)) place(d.id, toPct(e));
        else if (tray && inside(tray.getBoundingClientRect(), e)) unplace(d.id);
        else draw();
      });
      el.addEventListener('pointercancel', () => { drag = null; draw(); });
      board.addEventListener('click', e => { if (!picked || e.target.closest('[data-tk]')) return; place(picked, toPct(e)); });
      if (tray) tray.addEventListener('click', e => { if (!picked || e.target.closest('[data-tk]') || !value[picked]) return; unplace(picked); });
      el.addEventListener('keydown', e => {
        const b = e.target.closest('[data-tk]'); if (!b) return;
        const id = b.dataset.tk, map = { ArrowLeft: [-5, 0], ArrowRight: [5, 0], ArrowUp: [0, 5], ArrowDown: [0, -5] }, m = map[e.key];
        if (!m) return; e.preventDefault();
        const p = value[id] || { x: 50, y: 50 };
        value[id] = { x: clamp(p.x + m[0], 0, 100), y: clamp(p.y + m[1], 0, 100) }; picked = id; draw(); emit(id); cfg.onPick && cfg.onPick(id);
        const nb = TR.$(`[data-tk="${id}"]`, toks); nb && nb.focus();
      });
    }
    draw();
    return { set(v) { value = TR.clone(v || {}); draw(); }, get value() { return TR.clone(value); } };
  }

  // =====================================================================
  // Теория 1. Кто такие заинтересованные лица и как найти всех (школьная столовая «Перемена»)
  // =====================================================================
  const SP = [
    { id: 'parents', ring: 1, t: 'Родители', need: 'заказать и оплатить обед заранее, видеть, что ребёнок поел', miss: 'Интерфейс сделали «как удобно бухгалтерии» — родители не понимают, что заказали, и звонят в школу.' },
    { id: 'kids', ring: 1, t: 'Ученики', need: 'быстро получить свой обед на перемене', miss: 'Выдача по фамилии из списка — половина перемены уходит на очередь у раздачи.' },
    { id: 'cooks', ring: 1, t: 'Повара на раздаче', need: 'знать заранее, сколько и каких порций готовить', miss: 'Заказы приходят в 10:00, а продукты закладывают в 8:00 — порций не хватает.' },
    { id: 'cashier', ring: 1, t: 'Кассир столовой', need: 'принять деньги у тех, кто без приложения, и закрыть смену', miss: 'Касса не видит заказов из приложения — часть детей оплачивает обед дважды.' },
    { id: 'director', ring: 2, t: 'Директор школы', need: 'заказчик: решает, сколько тратить и что важнее', miss: 'Его не забудут — идея его. Опасно другое: спросить только его.' },
    { id: 'accounting', ring: 2, t: 'Бухгалтерия', need: 'льготное питание: компенсация из бюджета, отчёт по каждому ребёнку', miss: 'Льготникам выставили полную цену, отчёт для компенсации собирают руками.' },
    { id: 'nurse', ring: 2, t: 'Медсестра', need: 'аллергии и диеты детей — в каждом заказе', miss: 'Ребёнку с аллергией на орехи заказали ореховый пирог: система об аллергии не знала.' },
    { id: 'vendor', ring: 2, t: 'Поставщик школьной кассы', need: 'интеграция по своим правилам и в свои сроки', miss: 'Касса и приложение не связаны: о правилах поставщика узнали за неделю до запуска.' },
    { id: 'it', ring: 2, t: 'Учитель информатики', need: 'настроить планшет на раздаче и отвечать на «не работает»', miss: 'В первый день планшет на раздаче не подключён к школьному Wi-Fi, и звонить некому.' },
    { id: 'sanpin', ring: 3, t: 'Роспотребнадзор', need: 'меню и хранение продуктов — по санитарным правилам', miss: 'Меню в приложении не совпадает с утверждённым — предписание при первой же проверке.' },
    { id: 'nophone', ring: 3, t: 'Семьи без смартфона', need: 'по-прежнему платить на кассе', miss: '«Только через приложение» — бабушка, которая водит внука, не может оплатить ему обед.' },
    { id: 'teachers', ring: 3, t: 'Классные руководители', need: 'сейчас собирают заявки на обеды — их работа изменится', miss: 'Их легко пропустить: не пользователи и не заказчики. А только они знают, как сейчас устроены заявки и отказы.' }
  ];
  const SPN = Object.fromEntries(SP.map((p, i) => [p.id, i + 1]));
  const RINGS = { 1: { t: 'Работают с системой руками', d: 'кто нажимает кнопки каждый день' }, 2: { t: 'Рядом с системой', d: 'кто решает, платит, получает выгоду, чья система связана с нашей, кто её обслуживает' }, 3: { t: 'Широкое окружение', d: 'закон, те, кому станет хуже, и те, кого легко не заметить' } };
  const NOVICE = ['director', 'parents'];
  function onionSVG(selRing, pick, view) {
    const R = [0, 46, 92, 134, 174];
    const fills = ['', 'color-mix(in srgb, var(--accent) 13%, var(--surface))', 'color-mix(in srgb, var(--info) 11%, var(--surface))', 'color-mix(in srgb, var(--violet) 9%, var(--surface))'];
    let s = '<svg viewBox="0 0 360 360" role="img" aria-label="Луковица заинтересованных лиц школьной столовой">';
    for (let k = 3; k >= 1; k--) s += `<circle data-ring="${k}" cx="180" cy="180" r="${R[k + 1]}" style="fill:${fills[k]};stroke:${selRing === k ? 'var(--accent)' : 'var(--border-strong)'};stroke-width:${selRing === k ? 2.5 : 1}"/>`;
    s += `<circle cx="180" cy="180" r="${R[1]}" style="fill:var(--accent-soft);stroke:var(--accent);stroke-width:1.5"/>`;
    s += '<text x="180" y="177" text-anchor="middle" style="fill:var(--text);font-size:12px;font-weight:600">Предзаказ</text><text x="180" y="192" text-anchor="middle" style="fill:var(--text);font-size:12px;font-weight:600">обедов</text>';
    [[1, 'руками'], [2, 'рядом'], [3, 'окружение']].forEach(([k, t]) => { s += `<text x="180" y="${180 - (R[k] + R[k + 1]) / 2 + 4}" text-anchor="middle" style="fill:var(--text-muted);font-size:11px;font-family:var(--f-mono);letter-spacing:.06em;pointer-events:none">${t.toUpperCase()}</text>`; });
    [1, 2, 3].forEach(k => {
      const list = SP.filter(p => p.ring === k), rm = (R[k] + R[k + 1]) / 2;
      list.forEach((p, i) => {
        const a = (-58 + 296 * (i + 0.5) / list.length) * Math.PI / 180, x = 180 + rm * Math.cos(a), y = 180 + rm * Math.sin(a);
        const off = view === 'novice' && !NOVICE.includes(p.id), on = pick === p.id;
        s += `<g data-pp="${p.id}" style="opacity:${off ? 0.22 : 1}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="12" style="fill:${on ? 'var(--accent)' : 'var(--surface)'};stroke:${on ? 'var(--accent)' : 'var(--text-2)'};stroke-width:1.5"/><text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="middle" style="fill:${on ? 'var(--bg)' : 'var(--text)'};font-size:11.5px;font-weight:700;font-family:var(--f-mono);pointer-events:none">${SPN[p.id]}</text></g>`;
      });
    });
    return s + '</svg>';
  }
  function drawOnion(pane) {
    let ring = 0, pick = 'nurse', view = 'analyst';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Школьная столовая «Перемена» запускает предзаказ обедов: родители заказывают и оплачивают в приложении, повара видят, сколько порций готовить. Идея директора. Кого касается эта система? Нажимайте на кольца и номера.</p>
      <div class="row">${ui.seg('ov', [{ v: 'novice', t: 'Как видит новичок' }, { v: 'analyst', t: 'Как видит аналитик' }], view, 'accent')}</div>
      <div class="stk-two stk-onion"><div data-svg></div><div class="stack tight"><div data-det></div><div class="stk-ppl" data-list></div></div></div>
      <div data-note></div>
    </div>`;
    function draw() {
      TR.$('[data-svg]', pane).innerHTML = onionSVG(ring, pick, view);
      const p = SP.find(x => x.id === pick);
      let det = '';
      if (p) det = `<div class="stk-det"><b class="h">${SPN[p.id]}. ${esc(p.t)}</b><span class="k">${esc(RINGS[p.ring].t)}</span><div><b>Что ему нужно:</b> ${esc(p.need)}</div><div><b>Если забыть:</b> ${esc(p.miss)}</div></div>`;
      else if (ring) det = `<div class="stk-det"><b class="h">${esc(RINGS[ring].t)}</b><div>${esc(RINGS[ring].d)}.</div><div class="small muted">Здесь: ${SP.filter(x => x.ring === ring).map(x => esc(x.t)).join(', ')}.</div></div>`;
      TR.$('[data-det]', pane).innerHTML = det;
      TR.$('[data-list]', pane).innerHTML = SP.map(x => `<button type="button" class="stk-p ${view === 'novice' && !NOVICE.includes(x.id) ? 'off' : ''}" data-pp="${x.id}" aria-pressed="${pick === x.id}"><span class="n">${SPN[x.id]}</span><span>${esc(x.t)}</span></button>`).join('');
      TR.$('[data-note]', pane).innerHTML = view === 'novice'
        ? ui.note('warn', 'Видно 2 из 12', 'Новичок видит заказчика (директора) и тех, «для кого делаем» (родителей). Остальные десять узнают о системе в день запуска — и почти каждый может её сломать.')
        : ui.note('info', 'Модель «луковицы»', 'В середине — система. Ближнее кольцо — кто работает с ней руками. Среднее — кто рядом: решает, платит, получает выгоду, владеет смежной системой, обслуживает. Внешнее — широкое окружение: закон, те, кому станет хуже, и те, кого легко не заметить. Чем дальше от центра, тем легче забыть.');
    }
    TR.on(pane, 'click', '[data-pp]', (e, b) => { e.stopPropagation(); pick = b.dataset.pp; ring = 0; draw(); });
    TR.on(pane, 'click', '[data-ring]', (e, b) => { if (e.target.closest('[data-pp]')) return; ring = +b.dataset.ring; pick = null; draw(); });
    ui.onSeg(pane, (n, v) => { if (n === 'ov') { view = v; draw(); } });
    draw();
  }
  const CHK = [
    { id: 'users', t: 'Пользователи разных ролей', q: 'Кто будет нажимать кнопки? В каких ролях? Есть ли новички, люди без опыта, люди в особых условиях?', who: ['parents', 'kids', 'cooks', 'cashier'] },
    { id: 'money', t: 'Заказчик и деньги', q: 'Кто решает и платит? Кто считает деньги и отчитывается?', who: ['director', 'accounting'] },
    { id: 'law', t: 'Закон и регуляторы', q: 'Какие правила касаются продуктов, здоровья, денег, данных? Кто за них отвечает?', who: ['sanpin', 'nurse'] },
    { id: 'ops', t: 'Эксплуатация и поддержка', q: 'Кто будет настраивать, учить, чинить и отвечать на «не работает»?', who: ['it'] },
    { id: 'sys', t: 'Смежные системы и их владельцы', q: 'С какими системами придётся связаться? Кто ими владеет и по каким правилам пускает?', who: ['vendor'] },
    { id: 'hurt', t: 'Те, кто пострадает', q: 'Кому станет хуже? Кто потеряет привычный способ?', who: ['nophone'] },
    { id: 'meta', t: 'Мета-вопрос в конце каждой встречи', q: '«Кого ещё стоит спросить? Кто знает об этом больше?» (Гаус и Вайнберг)', who: ['teachers'] }
  ];
  function drawCheck(pane) {
    const on = new Set();
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Та же столовая. Директор пришёл сам — его нашли. Пройдите по строкам контрольного списка: отмечайте строку — и смотрите, кто находится. Последняя строка — не категория, а вопрос, который задают каждому.</p>
      <div class="stk-two"><div class="stk-chk" data-chk></div><div class="stack tight"><div data-meter></div><div class="stk-chips" data-found></div><div data-left></div></div></div>
    </div>`;
    function draw() {
      TR.$('[data-chk]', pane).innerHTML = CHK.map(c => `<label class="${on.has(c.id) ? 'on' : ''}"><input type="checkbox" data-ck="${c.id}" ${on.has(c.id) ? 'checked' : ''}><span><b>${esc(c.t)}</b><small>${esc(c.q)}</small></span></label>`).join('');
      const found = ['director'].concat(...CHK.filter(c => on.has(c.id)).map(c => c.who)).filter((x, i, a) => a.indexOf(x) === i);
      TR.$('[data-meter]', pane).innerHTML = `<div class="stat"><span class="k">Нашли</span><span class="v ${found.length === SP.length ? 'ok' : found.length < 6 ? 'bad' : 'warn'}">${found.length} из ${SP.length}</span>${ui.meter(found.length / SP.length, found.length === SP.length ? '' : 'warn')}</div>`;
      TR.$('[data-found]', pane).innerHTML = found.map(id => `<span class="chip ${id === 'director' ? '' : 'ok'}">${SPN[id]}. ${esc(SP.find(p => p.id === id).t)}</span>`).join('');
      const left = SP.length - found.length;
      TR.$('[data-left]', pane).innerHTML = left
        ? `<p class="small dim">Не найдено ещё ${left}. ${on.has('meta') ? '' : 'Заметьте: одного человека не находит ни одна категория.'}</p>`
        : ui.note('ok', 'Все двенадцать', 'Классных руководителей нашёл только мета-вопрос: они не пользователи, не заказчики и не регуляторы, но знают, как сейчас устроены заявки и отказы. Список — каркас, а «кого ещё спросить?» достраивает его.');
    }
    pane.addEventListener('change', e => { const c = e.target.closest('[data-ck]'); if (!c) return; if (c.checked) on.add(c.dataset.ck); else on.delete(c.dataset.ck); draw(); });
    draw();
  }
  const howWho = {
    id: 'how-who', covers: ['find'], title: 'Как это работает: кто такие заинтересованные лица и как найти всех', free: true, noReset: true,
    simple: {
      icon: '🧅',
      plain: 'Заинтересованное лицо — любой, кого коснётся система: кто будет ею пользоваться, кто за неё платит и решает, кто её чинит, кто по закону её проверяет, чья система с ней связана и даже кому она навредит. Заказчик — только один из них. Остальные сами не придут: их надо искать.',
      analogy: 'Новый рецепт в пекарне касается не только хозяйки: пекарю — печь, кассиру — продавать, покупателю — есть, поставщику — возить другую муку, санэпидемстанции — проверять. Забыли поставщика — в понедельник нет нужной муки.',
      tech: '<b>Заинтересованное лицо</b> (stakeholder) — человек, группа или организация, которые влияют на изменение, зависят от него или считают, что зависят (BABOK v3). Искать помогают <b>контрольный список</b> категорий, <b>модель «луковицы»</b> Иана Александера (система → кто работает с ней → кто рядом → широкое окружение, включая «негативных» заинтересованных) и <b>мета-вопрос</b> «кого ещё спросить?» (Гаус и Вайнберг). Источник — DOMAIN §9 «Заинтересованные лица».'
    },
    lead: ui.brief({
      situation: 'Соседний пример — школьная столовая «Перемена»: директор хочет, чтобы родители заказывали и оплачивали обеды заранее в приложении. Две вкладки: луковица заинтересованных лиц и контрольный список.',
      todo: [
        '«Луковица»: переключите «Как видит новичок» и «Как видит аналитик». Нажимайте на номера и кольца — читайте, что нужно каждому и что сломается, если его забыть.',
        '«Контрольный список»: отмечайте строки по одной и следите, кто находится. Найдите, кого не находит ни одна категория.'
      ],
      look: 'Номер на кольце — человек или организация. Чем дальше от центра, тем легче забыть. В списке зелёные — найдены по строкам, серый — пришёл сам.'
    }),
    render(el) {
      el.classList.add('stk-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'onion', t: 'Луковица', render: fresh(drawOnion) },
        { id: 'check', t: 'Контрольный список', render: fresh(drawCheck) }
      ], 'onion');
      el.insertAdjacentHTML('beforeend', `<div style="margin-top:12px">${ui.note('info', 'Позиция аналитика', 'Карту заинтересованных лиц составляет аналитик — в первые дни, до интервью. С заказчиком он её сверяет («кого я забыл?»), а дальше дополняет после каждой встречи. Артефакт — список заинтересованных лиц: кто, чем занят, что ему нужно, как с ним связаться.')}</div>`);
    }
  };

  // =====================================================================
  // Теория 2. Влияние, интерес и кто решает
  // =====================================================================
  const SG = [
    { id: 'director', t: 'Директор', x: 86, y: 88 },
    { id: 'sanpin', t: 'Роспотребнадзор', x: 14, y: 84 },
    { id: 'accounting', t: 'Бухгалтерия', x: 36, y: 68 },
    { id: 'vendor', t: 'Поставщик кассы', x: 22, y: 56 },
    { id: 'parents', t: 'Родители', x: 86, y: 40 },
    { id: 'nurse', t: 'Медсестра', x: 68, y: 30 },
    { id: 'cooks', t: 'Повара', x: 84, y: 17 },
    { id: 'kids', t: 'Ученики', x: 70, y: 6 },
    { id: 'teachers', t: 'Классные рук.', x: 30, y: 40 },
    { id: 'it', t: 'Учитель информатики', x: 22, y: 16 }
  ];
  function drawGridTheory(pane) {
    let pos = Object.fromEntries(SG.map(g => [g.id, { x: g.x, y: g.y }])), pick = 'sanpin', inspect = false;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Та же столовая, двенадцать найденных минус двое. По горизонтали — насколько человеку не всё равно, по вертикали — насколько он может повлиять на проект: остановить, разрешить, дать денег. Перетаскивайте карточки и смотрите, как меняется стратегия.</p>
      <label class="toggle"><input type="checkbox" data-ins> <span>Через месяц — плановая проверка Роспотребнадзора</span></label>
      <div class="stk-two"><div data-b></div><div class="stack tight"><div data-det></div><div class="stack tight" data-q4></div></div></div>
    </div>`;
    const labels = { HH: QUAD.HH.t, HL: QUAD.HL.t, LH: QUAD.LH.t, LL: QUAD.LL.t };
    const bd = mxBoard(TR.$('[data-b]', pane), { items: SG.map(g => ({ id: g.id, t: g.t })), value: pos, labels, tray: false, hint: false, picked: pick,
      onChange: (v) => { pos = v; drawDet(); }, onPick: id => { if (id) pick = id; drawDet(); } });
    function drawDet() {
      const g = SG.find(x => x.id === pick), p = pos[pick], q = QUAD[quadOf(p)];
      TR.$('[data-det]', pane).innerHTML = g && q ? `<div class="stk-det"><b class="h">${esc(g.t)}</b><span class="k">${esc(q.s)}</span><div><b>${esc(q.t)}.</b> ${esc(q.d)}</div><div class="small muted">${esc(q.miss)}</div></div>` : '';
      TR.$('[data-q4]', pane).innerHTML = Object.keys(QUAD).map(k => { const n = SG.filter(x => quadOf(pos[x.id]) === k).map(x => x.t); return `<div class="small"><b>${esc(QUAD[k].t)}</b>: ${n.length ? esc(n.join(', ')) : '—'}</div>`; }).join('');
    }
    pane.addEventListener('change', e => {
      if (!e.target.closest('[data-ins]')) return;
      inspect = e.target.checked; pos.sanpin = { x: inspect ? 78 : 14, y: 84 }; pick = 'sanpin'; bd.set(pos); drawDet();
      ui.toast(inspect ? 'Роспотребнадзору стало интересно: теперь его — плотно, с меню и документами заранее.' : 'Проверки нет — снова «держать удовлетворёнными».', 'info');
    });
    drawDet();
    pane.insertAdjacentHTML('beforeend', ui.note('warn', 'Влияние — не важность', 'Ученики в углу «влияние ↓», но обеды — для них. Матрица отвечает на вопрос «сколько сил тратить на общение», а не «чьи потребности важнее». Интересы тех, кто внизу, до решающих доносит аналитик.'));
  }
  const RC = [{ id: 'director', t: 'Директор' }, { id: 'accounting', t: 'Бухгалтерия' }, { id: 'nurse', t: 'Медсестра' }, { id: 'chef', t: 'Шеф-повар' }, { id: 'parents', t: 'Родители' }, { id: 'an', t: 'Аналитик' }];
  const RD = [
    { id: 'cash', t: 'Принимать ли оплату на кассе, а не только в приложении', v: { director: 'A', accounting: 'C', chef: 'I', parents: 'I', an: 'R' } },
    { id: 'allergy', t: 'Как отмечать аллергии в заказе', v: { director: 'A', nurse: 'C', parents: 'C', chef: 'I', an: 'R' } },
    { id: 'cutoff', t: 'До скольких принимать заказ на завтра', v: { director: 'I', chef: 'A', parents: 'I', an: 'R' } }
  ];
  const ROLE_T = { R: 'готовит (R)', A: 'решает (A)', C: 'советуется до (C)', I: 'узнаёт после (I)', '': 'не участвует' };
  function drawYes(pane) {
    let d = 'cash', who = null;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Решений в проекте десятки, и по каждому кто-нибудь скажет «да». Чьё «да» делает решение решением? Для каждого спорного решения договариваются по RACI: <b>A</b> — решает (ровно один), <b>R</b> — готовит, <b>C</b> — с ним советуются до, <b>I</b> — ему сообщают после.</p>
      <div class="row">${ui.seg('rd', RD.map(x => ({ v: x.id, t: x.t })), d, 'accent')}</div>
      <div class="stk-raci" data-t></div>
      <div class="stk-lbl">Кто сказал вам «да»?</div>
      <div class="stk-say-btns" data-w></div>
      <div data-v></div>
    </div>`;
    function draw() {
      const r = RD.find(x => x.id === d);
      TR.$('[data-t]', pane).innerHTML = `<table><thead><tr><th class="rl">Решение</th>${RC.map(c => `<th>${esc(c.t)}</th>`).join('')}</tr></thead><tbody><tr><td class="rl">${esc(r.t)}</td>${RC.map(c => `<td><button type="button" class="stk-cell" data-v="${r.v[c.id] || ''}" disabled>${r.v[c.id] || '·'}</button></td>`).join('')}</tr></tbody></table>`;
      TR.$('[data-w]', pane).innerHTML = RC.filter(c => c.id !== 'an').map(c => `<button type="button" class="btn sm ${who === c.id ? '' : 'ghost'}" data-who="${c.id}" aria-pressed="${who === c.id}">${esc(c.t)}</button>`).join('');
      let v = '';
      if (who) {
        const role = r.v[who] || '', A = RC.find(c => r.v[c.id] === 'A');
        const nm = RC.find(c => c.id === who).t;
        if (role === 'A') v = ui.note('ok', 'Это решение', `${esc(nm)} здесь решает (A). Запишите решение туда, где его найдут, — в письмо-итог или протокол, поменяйте статус требования и сообщите тем, у кого I.`);
        else if (role === 'C') v = ui.note('warn', 'Это мнение советника', `${esc(nm)} здесь советует (C). Его «да» важно — без него решать нельзя, — но решает ${esc(A.t.toLowerCase())}. Попросите подтверждение у того, кто решает, письменно.`);
        else if (role === 'I') v = ui.note('warn', 'Это не решение', `${esc(nm)} здесь узнаёт после (I). Его «да» значит «я в курсе», а не «согласовано». Решает ${esc(A.t.toLowerCase())}.`);
        else v = ui.note('bad', 'Этого человека в решении нет', `${esc(nm)} в этом решении не участвует. Его «да» — просто приятный разговор. Решает ${esc(A.t.toLowerCase())}.`);
      }
      TR.$('[data-v]', pane).innerHTML = v;
    }
    ui.onSeg(pane, (n, v) => { if (n === 'rd') { d = v; who = null; draw(); } });
    TR.on(pane, 'click', '[data-who]', (e, b) => { who = b.dataset.who; draw(); });
    draw();
    pane.insertAdjacentHTML('beforeend', ui.note('info', 'Заметьте', 'Во втором решении «A» у директора, в третьем — у шеф-повара: решает не всегда самый главный, а тот, у кого ответственность за результат. Про RACI команды разработки — тренировка «Команда разработки»; здесь та же таблица, но для решений заказчика.'));
  }
  const howGrid = {
    id: 'how-grid', covers: ['grid', 'decide'], title: 'Как это работает: влияние, интерес и чьё «да» считается', free: true, noReset: true,
    simple: {
      icon: '🎯',
      plain: 'Всех найденных нельзя опрашивать одинаково: не хватит ни времени, ни терпения у людей. Их раскладывают по двум вопросам — насколько человек может повлиять на проект и насколько ему не всё равно. От места на карте зависит, как с ним работать. А для каждого спорного решения договариваются, кто решает, с кем советоваться и кого предупредить.',
      analogy: 'Перед свадьбой с невестой и её мамой обсуждают всё — они решают и переживают. Ресторан держат довольным: может сорвать праздник, но ваши споры о цветах ему неинтересны. Гостям — приглашение и программу: интересно, но не решают. Соседям по залу хватит таблички «Закрытое мероприятие».',
      tech: '<b>Матрица влияние/интерес</b> (power/interest grid, Обри Менделоу, 1991): высокое влияние и интерес — «управлять плотно» (ключевые игроки); высокое влияние, низкий интерес — «держать удовлетворёнными»; низкое влияние, высокий интерес — «держать в курсе»; низкие оба — «наблюдать». Положение меняется со временем. <b>RACI для решений</b>: R — готовит, A — решает и отвечает (ровно один), C — советуются до, I — сообщают после. Решение согласовано, когда его подтвердил A (PRACTICES §3).'
    },
    lead: ui.brief({
      situation: 'Снова столовая «Перемена». Две вкладки: матрица влияние/интерес и «чьё „да“ считается» — RACI решений заказчика.',
      todo: [
        '«Матрица»: перетаскивайте карточки между квадрантами (или нажмите на карточку, затем на место) — рядом меняется стратегия. Включите «плановую проверку» и посмотрите, куда сдвинется Роспотребнадзор.',
        '«Чьё „да“ считается»: выберите решение и нажимайте на людей в строке «Кто сказал вам „да“?». Сравните, что значит «да» от A, от C и от I.'
      ],
      look: 'Четыре квадранта — четыре стратегии общения. Пунктир — середина шкал. В RACI буква в клетке — роль человека именно в этом решении.'
    }),
    render(el) {
      el.classList.add('stk-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'grid', t: 'Матрица влияние / интерес', render: fresh(drawGridTheory) },
        { id: 'yes', t: 'Чьё «да» считается', render: fresh(drawYes) }
      ], 'grid');
    }
  };

  // =====================================================================
  // Теория 3. План коммуникаций (симулятор, столовая)
  // =====================================================================
  const CH = [{ v: 'meet', t: 'Встреча' }, { v: 'letter', t: 'Письмо' }, { v: 'chat', t: 'Общий чат' }, { v: 'memo', t: 'Памятка, объявление' }, { v: 'push', t: 'Push в приложении' }];
  const FR = [{ v: 'day', t: 'Каждый день' }, { v: 'week', t: 'Раз в неделю' }, { v: 'event', t: 'К важным событиям' }];
  const CS = [
    { id: 'dir', t: 'Директор', q: 'управлять плотно', good: ['meet', 'week'],
      ch: { meet: ['ok', 'Встреча на 20 минут: решения принимаются, вопросы не копятся.'], letter: ['warn', 'Письма читает, но спорные вопросы без разговора висят.'], chat: ['bad', 'В общем чате 60 сообщений в день — директор из него вышел.'], memo: ['bad', 'Памятка на стене — директору здесь решать нечего.'], push: ['bad', 'Push в родительском приложении директору не приходит.'] },
      fr: { day: ['bad', 'Каждый день — «вы меня дёргаете».'], week: ['ok', ''], event: ['warn', 'Только «к событиям» — решения ждут неделями.'] } },
    { id: 'acc', t: 'Бухгалтерия', q: 'держать удовлетворёнными', good: ['letter', 'event'],
      ch: { meet: ['warn', 'Встреча ради одного вопроса — жалко времени, но придут.'], letter: ['ok', 'Письмо с примером отчёта по льготникам — проверят и ответят по делу.'], chat: ['bad', 'Вопрос про компенсацию утонул в чате.'], memo: ['bad', 'Объявление бухгалтерии ничего не даёт.'], push: ['bad', 'Push бухгалтерии не приходит.'] },
      fr: { day: ['bad', 'Каждый день — перестали открывать.'], week: ['warn', 'Еженедельные письма «для сведения» — начинают пропускать.'], event: ['ok', ''] } },
    { id: 'cook', t: 'Повара', q: 'держать в курсе', good: ['memo', 'event'],
      ch: { meet: ['warn', 'Собрание после смены — устали, но выслушают.'], letter: ['bad', 'Почту на кухне никто не читает.'], chat: ['bad', 'Руки в тесте — не до телефона.'], memo: ['ok', 'Памятка у раздачи и 15 минут показа перед запуском — работает.'], push: ['bad', 'Приложение родительское — поварам не приходит.'] },
      fr: { day: ['bad', 'Каждый день — шум.'], week: ['warn', 'Раз в неделю за месяц до запуска — рано, забудут.'], event: ['ok', ''] } },
    { id: 'par', t: 'Родители', q: 'держать в курсе', good: ['push', 'event'],
      ch: { meet: ['warn', 'Собрание — придёт треть.'], letter: ['warn', 'Письмо откроет половина.'], chat: ['warn', 'Чаты классов: дойдёт, но обрастёт слухами.'], memo: ['warn', 'Объявление в школе увидят только те, кто заходит.'], push: ['ok', 'Push в приложении — дошло всем, кто заказывает.'] },
      fr: { day: ['bad', 'Каждый день — отключили уведомления.'], week: ['warn', 'Раз в неделю без повода — привыкают не читать.'], event: ['ok', ''] } },
    { id: 'nop', t: 'Семьи без смартфона', q: 'держать в курсе', good: ['memo', 'event'],
      ch: { meet: ['warn', 'Собрание — придут единицы.'], letter: ['bad', 'Электронной почты нет.'], chat: ['bad', 'Чата нет — нет смартфона.'], memo: ['ok', 'Объявление у кассы и слова кассира — дошло.'], push: ['bad', 'Push не дойдёт: смартфона нет.'] },
      fr: { day: ['bad', 'Каждый день — никто так не живёт.'], week: ['warn', 'Раз в неделю — лишнее.'], event: ['ok', ''] } }
  ];
  const worst = (a, b) => { const r = { ok: 0, warn: 1, bad: 2 }; return r[a[0]] >= r[b[0]] ? a : b; };
  function drawSim(pane) {
    let st = Object.fromEntries(CS.map(c => [c.id, { ch: 'chat', fr: 'day' }]));
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Та же столовая, месяц до запуска. Для каждого выберите способ и частоту — под кнопками реакция. Начнём с того, что делают чаще всего: всех в общий чат и каждый день.</p>
      <div class="row"><button type="button" class="btn sm ghost" data-pre="same">Всем одинаково: общий чат каждый день</button><button type="button" class="btn sm" data-pre="map">По карте</button></div>
      <div class="stk-stats" data-s></div>
      <div class="stk-sim" data-r></div>
    </div>`;
    function draw() {
      let ok = 0, warn = 0, bad = 0;
      TR.$('[data-r]', pane).innerHTML = CS.map(c => {
        const s = st[c.id], r = worst(c.ch[s.ch], c.fr[s.fr]);
        if (r[0] === 'ok') ok++; else if (r[0] === 'warn') warn++; else bad++;
        const txt = r[0] === 'ok' ? c.ch[s.ch][1] : r[1];
        return `<div class="r ${r[0]}"><div class="who"><b>${esc(c.t)}</b><small>${esc(c.q)}</small></div><div class="ctl">${ui.seg('ch|' + c.id, CH, s.ch)}${ui.seg('fr|' + c.id, FR, s.fr)}<div class="re">${esc(txt)}</div></div></div>`;
      }).join('');
      TR.$('[data-s]', pane).innerHTML = `<div class="stat"><span class="k">Дошло</span><span class="v ok">${ok}</span></div><div class="stat"><span class="k">С риском</span><span class="v warn">${warn}</span></div><div class="stat"><span class="k">Не дошло</span><span class="v bad">${bad}</span></div>`;
    }
    ui.onSeg(pane, (n, v) => { const [k, id] = n.split('|'); if (!st[id]) return; st[id][k] = v; draw(); });
    TR.on(pane, 'click', '[data-pre]', (e, b) => { CS.forEach(c => { st[c.id] = b.dataset.pre === 'map' ? { ch: c.good[0], fr: c.good[1] } : { ch: 'chat', fr: 'day' }; }); draw(); });
    draw();
    pane.insertAdjacentHTML('beforeend', ui.note('info', 'Что записывают в план коммуникаций', 'Для каждого заинтересованного лица: <b>что</b> ему нужно знать и что нужно от него; <b>как часто</b>; <b>каким способом</b>; <b>кто отвечает</b> за общение. План берут из карты влияние/интерес: «управлять плотно» — лично и регулярно, «держать удовлетворёнными» — коротко и к сроку, «держать в курсе» — массово и к событиям.'));
  }
  const howComm = {
    id: 'how-comm', covers: ['comm', 'why'], title: 'Как это работает: план коммуникаций', free: true, noReset: true,
    simple: {
      icon: '📣',
      plain: 'План коммуникаций — табличка: кому, что, как часто и каким способом мы сообщаем и что у кого спрашиваем. Одному нужен короткий разговор раз в неделю, другому — памятка у кассы, третьему — официальное письмо по его правилам. Одна и та же рассылка для всех — это когда никто ничего не прочитал.',
      analogy: 'Свадьба: невеста получает звонок каждый вечер, ресторан — смету и сценарий письмом к сроку, гости — открытку с программой, а бабушка — звонок от внука, а не сообщение в мессенджере.',
      tech: '<b>План коммуникаций</b> (BABOK v3 — планирование вовлечения заинтересованных лиц): для каждого — какая информация, формат, канал, частота, ответственный. Строится по матрице влияние/интерес. Хорошая практика — после каждой встречи письмо-итог, решения фиксировать там, где их найдут (PRACTICES §2–3).'
    },
    lead: ui.brief({
      situation: 'Столовая «Перемена», месяц до запуска. Пятеро заинтересованных лиц из разных квадрантов матрицы. Симулятор показывает, дошло ли сообщение и как на него отреагировали.',
      todo: [
        'Посмотрите на старт «всем в общий чат каждый день»: сколько сообщений не дошло?',
        'Для каждого подберите способ и частоту так, чтобы реакция стала зелёной. Потом нажмите «По карте» и сравните со своим вариантом.'
      ],
      look: 'Зелёная полоса — дошло, жёлтая — дошло с риском, красная — не дошло или раздражает. Счётчики сверху — итог по всем пятерым.'
    }),
    render(el) {
      el.classList.add('stk-root');
      const d = document.createElement('div'); el.appendChild(d);
      drawSim(d);
    }
  };

  // =====================================================================
  // Практика 1. Лаборатория: кого забыли — что сломается в день запуска
  // =====================================================================
  const SCENES = [
    { ico: '📄', h: 'Договор, первая страница', t: '«Заказчик — сеть пекарен «Колос» в лице владелицы Нины Сергеевны. Этап 1 — обследование: 3 недели, 600 тыс. ₽».' },
    { ico: '🧾', h: 'Письмо главного бухгалтера', t: '«По 54-ФЗ при предоплате — чек „предоплата“, при выдаче — чек полного расчёта; кассы у нас облачные. И сводку продаж мне в 1С к 09:00 — сейчас я два часа свожу её руками».' },
    { ico: '☎️', h: 'Звонок на кассу, 18:40', t: '«Светочка, отложи мне бородинский на вечер, я после работы зайду». Звонит Анна Павловна, 67 лет, смартфоном пользуется с трудом.' },
    { ico: '🧤', h: 'Заметка Павла', t: '«Новенькие на кассе каждый месяц, учим один день. В перчатках по экрану не попасть. А если модем отвалится — кому звонить?»' },
    { ico: '🌙', h: 'Цех, 23:00', t: 'Галина Ивановна утверждает план выпечки на завтра: «Предзаказы должны падать в мой план сами. Переписывать руками не буду».' },
    { ico: '📝', h: 'Черновик анкеты Риты', t: '«Имя, телефон, день рождения — для подарка. И ссылку на заказ прямо в пост: у нас 18 тыс. подписчиков ВКонтакте».' },
    { ico: '📦', h: 'Регламент вендора касс', t: '«Интеграция с облачными кассами — только через публичный API и после сертификации. Срок проверки — 3 недели».' },
    { ico: '💳', h: 'Список интеграций от Димы', t: '«Карты и СБП — через платёжный шлюз „ПэйМост“. При отмене — возврат на ту же карту в течение 3 рабочих дней».' },
    { ico: '🚗', h: 'Лёша у подъезда', t: '«Клиент не берёт трубку, а в тетради ни подъезда, ни телефона того, кому торт».' },
    { ico: '⏰', h: 'Покровка, 07:45', t: 'В очереди 12 человек. Мужчина в куртке смотрит на часы и уходит, не дождавшись.' }
  ];
  const FB = [
    { id: 'users', t: 'Пользователи разных ролей', sub: 'кто нажимает кнопки' },
    { id: 'money', t: 'Заказчик и деньги', sub: 'кто решает, платит, считает' },
    { id: 'law', t: 'Закон и регуляторы', sub: 'кто отвечает за правила' },
    { id: 'ops', t: 'Эксплуатация и поддержка', sub: 'кто учит, чинит, отвечает на «не работает»' },
    { id: 'sys', t: 'Смежные системы и их владельцы', sub: 'с кем связь и кто за неё отвечает' },
    { id: 'hurt', t: 'Те, кто пострадает', sub: 'кому станет хуже, кто потеряет привычное' },
    { id: 'none', t: 'Не касается системы', sub: 'не заинтересованное лицо' }
  ];
  const FBT = Object.fromEntries(FB.map(b => [b.id, b.t]));
  const FC = [
    { id: 'nina', t: 'Нина Сергеевна', sub: 'владелица сети', ok: ['money'], key: 1, hint: 'Сцена «Договор»: без неё не обойтись, но она — одна из многих.' },
    { id: 'buyers', t: 'Покупатели с приложением', sub: 'заказывают заранее', ok: ['users'], hint: 'Для кого вообще делают предзаказ? Их тоже надо спрашивать, а не только представлять.' },
    { id: 'elder', t: 'Анна Павловна и покупатели 55+', sub: 'многие без смартфона', ok: ['users', 'hurt'], key: 1, hint: 'Сцена «Звонок на кассу, 18:40»: кто потеряет привычный способ, если «теперь только через приложение»?' },
    { id: 'cash', t: 'Кассиры, в том числе новенькие', sub: 'обучение — 1 день', ok: ['users', 'hurt'], key: 1, hint: 'Сцена «Заметка Павла»: кто будет нажимать кнопки в перчатках на второй неделе работы?' },
    { id: 'queue', t: 'Покупатели в живой очереди', sub: 'без предзаказа', ok: ['hurt', 'users'], hint: 'Сцена «Покровка, 07:45»: кому станет хуже, если выдача предзаказов задержит кассу?' },
    { id: 'pavel', t: 'Павел', sub: 'управляющий на Покровке', ok: ['ops', 'users', 'money'], hint: 'Кто отвечает за пекарню, учит кассиров и первым узнаёт, что «не работает»?' },
    { id: 'galya', t: 'Галина Ивановна', sub: 'технолог, начальник цеха', ok: ['users', 'money'], hint: 'Сцена «Цех, 23:00»: в чей план должны падать предзаказы?' },
    { id: 'oleg', t: 'Олег Петрович', sub: 'главный бухгалтер', ok: ['money', 'law', 'sys'], key: 1, hint: 'Сцена «Письмо главного бухгалтера»: кто окажется в беде в 09:00 утра после запуска и кто отвечает за чеки?' },
    { id: 'lawyer', t: 'Юрист по персональным данным', sub: 'свой или приходящий — уточнить', ok: ['law'], key: 1, hint: 'Сцена «Черновик анкеты Риты»: телефон и день рождения — чьи это данные и по какому закону их можно собирать?' },
    { id: 'kassapro', t: '«КассаПро»', sub: 'вендор облачных касс', ok: ['sys', 'law'], key: 1, hint: 'Сцена «Регламент вендора касс»: чья система и чьи правила, а сколько длится проверка?' },
    { id: 'paymost', t: '«ПэйМост»', sub: 'платёжный шлюз', ok: ['sys'], hint: 'Сцена «Список интеграций»: через кого идут деньги и возвраты?' },
    { id: 'lesha', t: 'Лёша', sub: 'курьер, возит торты', ok: ['users', 'hurt'], key: 1, hint: 'Сцена «Лёша у подъезда»: какие данные заказа нужны тому, кто везёт торт?' },
    { id: 'rita', t: 'Рита', sub: 'маркетолог, группа ВКонтакте', ok: ['money', 'users', 'sys'], hint: 'Сцена «Черновик анкеты»: кто приведёт покупателей и кому нужна ссылка на заказ?' },
    { id: 'support', t: 'Поддержка «Квант Софт» после запуска', sub: 'заявки пекарен, ошибки', ok: ['ops'], hint: 'Заметка Павла заканчивается вопросом «кому звонить?». Кто ответит?' },
    { id: 'dodo', t: '«Додо Пицца»', sub: 'на её приложение ссылается Нина', ok: ['none'], hint: 'Система «Колоса» как-то меняет их работу? Источник идей — не то же самое, что заинтересованное лицо.' },
    { id: 'flour', t: 'Поставщик муки', sub: 'возит муку в цех', ok: ['none'], hint: 'Изменится ли из-за предзаказа то, как он возит муку? Если бы автоматизировали закупки — изменилось бы.' },
    { id: 'landlord', t: 'Арендодатель цеха', sub: 'Московское шоссе', ok: ['none'], hint: 'Что меняет предзаказ в его жизни?' }
  ];
  const DAY = [
    { tm: '28.02, 23:00', who: 'galya', ok: 'Галина Ивановна утверждает план: предзаказы на завтра уже в нём — она сама проверяла этот экран на демо.', bad: 'Предзаказы пришли Галине Ивановне отдельным файлом, в её план они не попали. Утром половины заказанных круассанов нет.' },
    { tm: '06:50', who: 'cash', ok: 'Новый кассир, вторая неделя работы, открывает экран выдачи: крупные кнопки, памятка на одну страницу. Одного дня обучения хватило.', bad: 'Экран выдачи делали по рассказам управляющего: мелкие кнопки, поиск по фамилии с клавиатуры. Новый кассир в перчатках не может найти заказ.' },
    { tm: '07:45', who: 'queue', ok: 'Пик, в очереди 12 человек. Выдача по короткому коду не задерживает живую очередь — это проверили на смене заранее.', bad: 'Пик, в очереди 12 человек. Кассир ищет пакеты предзаказов под прилавком, живая очередь стоит, трое уходят.' },
    { tm: '08:00', who: 'kassapro', ok: 'Первый онлайн-заказ оплачен — чек «предоплата» уходит через «КассаПро»: заявку на сертификацию подали заранее, с запасом.', bad: 'Первый онлайн-заказ оплачен, а чек «предоплата» не пробивается: про сертификацию у «КассаПро» вспомнили за неделю, а проверка идёт 3 недели. Продажа без чека — нарушение 54-ФЗ.' },
    { tm: '08:10', who: 'elder', ok: 'Анна Павловна звонит: «Отложите бородинский на вечер». Кассир оформляет заказ за неё на экране — как раньше, только без тетради.', bad: 'Анна Павловна звонит на кассу. Кассир: «Теперь только через приложение». Смартфона у неё нет, а таких — 40 % постоянных клиентов старше 55.' },
    { tm: '09:00', who: 'oleg', ok: 'Олег Петрович открывает 1С: сводка за вчера уже там, вместе с онлайн-оплатами и чеками.', bad: 'Олег Петрович открывает 1С: онлайн-оплат в сводке нет, чеки «предоплата» он видит впервые. Сверка теперь дольше прежних двух часов.' },
    { tm: '09:20', who: 'support', ok: 'На Покровке отвалился модем. Павел пишет заявку в поддержку: куда писать и как быстро ответят, договорились до запуска.', bad: 'На Покровке отвалился модем, заказы не приходят на экран кассира. Павел звонит Нине, Нина — Игорю, Игорь — Диме. Кто чинит и в какой срок — никто не договаривался.' },
    { tm: '10:30', who: 'lawyer', ok: 'Покупательница просит удалить её телефон и день рождения. Порядок удаления по 152-ФЗ готов — его заранее проверил юрист.', bad: 'Покупательница пишет: «Где согласие на обработку данных? Удалите мой телефон». Согласия в приложении нет, как удалять — никто не знает. Это 152-ФЗ.' },
    { tm: '11:15', who: 'paymost', ok: 'Покупатель отменил заказ за 3 часа до интервала — деньги вернутся на ту же карту за 3 рабочих дня: возвраты с «ПэйМост» настроены.', bad: 'Покупатель отменил заказ за 3 часа до интервала, а возврат не уходит: с «ПэйМост» обсуждали только приём оплаты.' },
    { tm: '12:00', who: 'rita', ok: 'Рита публикует пост для 18 тыс. подписчиков: ссылка ведёт прямо в предзаказ.', bad: 'Рита узнала о запуске из чата пекарни. Пост «Заказывайте заранее!» ведёт на сайт-визитку, где заказать нельзя.' },
    { tm: '13:30', who: 'lesha', ok: 'Лёша везёт торт: в заказе адрес, подъезд и телефон того, кому торт.', bad: 'Лёша стоит у подъезда с тортом: в заказе нет ни подъезда, ни телефона получателя, клиент не берёт трубку.' },
    { tm: '16:00', who: 'buyers', ok: 'Покупатели оформляют заказы на завтра: пекарня, получасовой интервал, оплата — без регистрации на пять экранов.', bad: 'Покупателей ни разу не спросили. В отзывах: «где выбрать пекарню?», «зачем регистрация ради булки?».' },
    { tm: '19:00', who: 'pavel', ok: 'Вечер на Покровке: полки под заказы нет, но место под прилавком Павел разметил по кодам заказов — пакеты не путают.', bad: 'На Покровке нет места под полку заказов: пакеты под прилавком подписаны маркером «Лена». Лен три — отдали не тот пакет.' },
    { tm: '21:00', who: 'nina', ok: 'Нина Сергеевна смотрит итоги первого дня: это тот объём, который она сама согласовала.', bad: 'Нина Сергеевна впервые видит систему в день запуска: «Я не это заказывала!».' }
  ];
  const onMap = (v, id) => !!v[id] && v[id] !== 'none';
  function findEval(v) {
    v = v || {};
    const rows = FC.map(c => {
      const b = v[c.id] || '';
      let pts, s;
      if (c.ok[0] === 'none') { pts = b === 'none' ? 1 : b ? 0 : 0.5; s = b === 'none' ? 'ok' : b ? 'bad' : ''; }
      else if (!b || b === 'none') { pts = 0; s = b ? 'bad' : ''; }
      else if (c.ok.includes(b)) { pts = 1; s = 'ok'; }
      else { pts = 0.5; s = 'warn'; }
      return { c, b, pts, s };
    });
    const real = rows.filter(r => r.c.ok[0] !== 'none');
    return {
      rows, score: rows.reduce((s, r) => s + r.pts, 0) / rows.length,
      lostKey: real.filter(r => r.c.key && !onMap(v, r.c.id)),
      found: real.filter(r => onMap(v, r.c.id)).length, total: real.length,
      extra: rows.filter(r => r.c.ok[0] === 'none' && onMap(v, r.c.id))
    };
  }
  function dayHTML(v) {
    v = v || {};
    const rows = DAY.map(ev => ({ ev, ok: onMap(v, ev.who) }));
    const broke = rows.filter(r => !r.ok).length, extra = FC.filter(c => c.ok[0] === 'none' && onMap(v, c.id));
    return `<div class="stack tight"><div class="stk-stats">
        <div class="stat"><span class="k">Сломалось</span><span class="v ${broke ? 'bad' : 'ok'}">${broke}</span></div>
        <div class="stat"><span class="k">Учли заранее</span><span class="v ok">${rows.length - broke}</span></div>
        <div class="stat"><span class="k">Лишние встречи</span><span class="v ${extra.length ? 'warn' : ''}">${extra.length}</span></div></div>
      <div class="stk-day">${rows.map(r => `<div class="stk-ev ${r.ok ? 'ok' : 'bad'}"><span class="tm">${esc(r.ev.tm)}</span><div><b>${r.ok ? 'Учли.' : 'Сломалось.'}</b>${esc(r.ok ? r.ev.ok : r.ev.bad)}</div></div>`).join('')}
        ${extra.map(c => `<div class="stk-ev warn"><span class="tm">до запуска</span><div><b>Лишняя встреча.</b>Полтора часа обследования ушли на ${qt(c.t)} — а предзаказ их работу не меняет.</div></div>`).join('')}</div></div>`;
  }
  const findTask = {
    id: 'find', title: 'Лаборатория: кого забыли — что сломается в день запуска',
    simple: howWho.simple,
    lead: ui.brief({
      situation: 'Понедельник, 19 октября. Игорь: «В договоре заказчик один — Нина Сергеевна. Её и спрашиваем, остальных не дёргаем: обследование — 3 недели и 600 тысяч». Ксения молча кладёт перед вами десять сцен — фрагменты договора, писем и заметок. В каждой спрятан кто-то, кого коснётся предзаказ. Соберите карту и проверьте её на дне запуска — 1 марта 2027, все 9 пекарен и торты.',
      todo: [
        'Прочитайте сцены-подсказки. Подумайте, кто в каждой из них — заинтересованное лицо.',
        'Разложите карточки по строкам контрольного списка: нажмите на карточку, затем на строку (на компьютере можно перетаскивать). Кто не заинтересованное лицо — в «Не касается системы». Если человек подходит к двум строкам, выберите любую подходящую.',
        'Нажмите «Прогнать день запуска» и посмотрите, что ломается из-за тех, кого нет на карте. Дополняйте карту — день пересчитывается сразу.',
        'Нажмите «Проверить». Засчитывается от 80 %, и в день запуска не должно ломаться то, без чего пекарни не работают по закону и не обслуживают своих покупателей.'
      ],
      look: 'Красная строка дня — что-то сломалось, потому что этого человека не спросили. Зелёная — учли заранее. Жёлтая — лишняя встреча: на карте тот, кого система не касается. Карточки в лотке не считаются найденными.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(FC.map(c => [c.id, c.ok[0]])), ran: true }),
    render(el, ctx) {
      el.classList.add('stk-root', 'stk-find');
      const a = ctx.ans; a.v = a.v || {};
      const judged = !!(ctx.result || ctx.readonly);
      el.innerHTML = `<div class="stack">
        <div class="stk-lbl">Сцены-подсказки</div>
        <div class="stk-scenes">${SCENES.map(s => `<div class="stk-scene"><span class="h">${s.ico} ${esc(s.h)}</span><span>${esc(s.t)}</span></div>`).join('')}</div>
        <div class="stk-lbl">Карта заинтересованных лиц по контрольному списку</div>
        <div data-sort></div>
        <div class="stk-lbl">Лаборатория: понедельник, 1 марта 2027 — день запуска</div>
        <div class="row"><button type="button" class="btn primary sm" data-run ${ctx.readonly ? 'disabled' : ''}>▶ Прогнать день запуска</button><span class="small dim" data-runs></span></div>
        <div data-day></div>
        ${ui.note('info', 'Позиция аналитика', 'Карта заинтересованных лиц — первый артефакт обследования. По ней аналитик планирует встречи (неделя 3), а потом трассирует требования к источнику: «чек „предоплата“ — Олег Петрович, 54-ФЗ».')}
      </div>`;
      const drawDay = () => {
        TR.$('[data-day]', el).innerHTML = a.ran || ctx.readonly ? dayHTML(a.v) : '<p class="small dim">Соберите карту и нажмите «Прогнать день запуска». Пересчитывается при каждом изменении карты.</p>';
        TR.$('[data-runs]', el).textContent = a.runs ? `Прогонов: ${a.runs}` : '';
      };
      let reveal = null;
      if (judged) { reveal = {}; findEval(a.v).rows.forEach(r => { if (r.s) reveal[r.c.id] = r.s; }); }
      ui.sort(TR.$('[data-sort]', el), {
        items: FC.map(c => ({ id: c.id, t: esc(c.t), sub: esc(c.sub) })), buckets: FB, value: a.v, readonly: ctx.readonly, seed: 'stk-find', reveal,
        onChange: v => { a.v = v; ctx.save(); drawDay(); }
      });
      TR.on(el, 'click', '[data-run]', () => {
        if (ctx.readonly) return;
        a.ran = true; a.runs = (a.runs || 0) + 1; ctx.save(); drawDay();
        const ev = findEval(a.v);
        ctx.decide('Карта заинтересованных лиц: найдено', `${ev.found} из ${ev.total}`);
      });
      drawDay();
    },
    check(ans) {
      const v = (ans && ans.v) || {}, ev = findEval(v), notes = [];
      if (!ev.found) notes.push({ ok: false, html: 'Карта пуста: ни одна карточка не разложена по строкам контрольного списка.' });
      ev.lostKey.forEach(r => notes.push({ ok: false, html: `Без этого человека в день запуска ломается важное. ${r.c.hint}` }));
      ev.rows.forEach(r => {
        if (r.c.ok[0] === 'none') { if (r.s === 'bad') notes.push({ ok: 'warn', html: `${qt(r.c.t)} на карте. ${r.c.hint}` }); return; }
        if (!r.c.key && !onMap(v, r.c.id)) notes.push({ ok: 'warn', html: `Кого-то ещё нет на карте. ${r.c.hint}` });
        else if (r.s === 'warn') notes.push({ ok: 'warn', html: `${qt(r.c.t)} — в строке «${esc(FBT[r.b])}». Спросите себя: он нажимает кнопки, решает и платит, отвечает за закон, учит и чинит, владеет смежной системой или потеряет привычное?` });
      });
      const ok = ev.score >= 0.8 && !ev.lostKey.length;
      if (ok && !notes.length) notes.push({ ok: true, html: 'Все четырнадцать на карте и в подходящих строках. День запуска проходит без поломок.' });
      return {
        ok, score: ev.score, notes,
        summary: `На карте: ${ev.found} из ${ev.total}. В день запуска ломается: ${DAY.filter(d => !onMap(v, d.who)).length} из ${DAY.length}.${ev.extra.length ? ` Лишних на карте: ${ev.extra.length}.` : ''}`,
        mentor: ev.lostKey.length >= 3 ? 'Игорь будет доволен — встреч меньше. А потом, 1 марта, он же будет звонить вам в 08:00. Пройдитесь по сценам ещё раз: в каждой есть кто-то, кроме Нины.'
          : ok ? 'Заметьте, как мало из этих людей упомянуто в договоре: один человек из четырнадцати. Остальных нашли сцены, контрольный список и вопрос «кого ещё спросить?».' : null
      };
    },
    explain: `${ui.table(['Строка списка', 'Кто на карте «Колоса»', 'Что ломается без них'], [
        ['Пользователи разных ролей', 'покупатели с приложением; Анна Павловна и покупатели 55+; кассиры, в том числе новенькие; Галина Ивановна; Лёша', 'экран в перчатках, заказ через кассира, план выпечки, адрес и телефон для курьера'],
        ['Заказчик и деньги', 'Нина Сергеевна; Олег Петрович; Рита', 'объём, который никто не согласовал; сводка в 1С; ссылка из ВКонтакте'],
        ['Закон и регуляторы', 'юрист по персональным данным (152-ФЗ); Олег Петрович (54-ФЗ)', 'согласие и удаление данных; чеки «предоплата» и полного расчёта'],
        ['Эксплуатация и поддержка', 'Павел; поддержка «Квант Софт»', 'кто учит кассиров, кому звонить, когда отвалился модем'],
        ['Смежные системы и их владельцы', '«КассаПро»; «ПэйМост»; 1С (владелец — Олег Петрович); ВКонтакте (Рита)', 'сертификация 3 недели, возвраты на карту'],
        ['Те, кто пострадает', 'покупатели в живой очереди; Анна Павловна', 'очередь в пик 07:30–09:00; потеря привычного «отложи мне»']
      ])}
      <p><b>Почему не только Нина.</b> Нина знает цели и решает, но не знает, как пробивается чек «предоплата», как новичок в перчатках ищет заказ и сколько длится сертификация у вендора. Каждая красная строка дня запуска — требование, которое можно было выяснить за полчаса в октябре, а не исправлять в марте (помните правило «×10 на каждой стадии»).</p>
      <p><b>«Забытые» — почти всегда одни и те же:</b> бухгалтерия, юрист, новички и люди в особых условиях, люди без смартфона, «люди в поле» вроде курьера, владельцы смежных систем. Строка «Те, кто пострадает» — самая неочевидная: живая очередь не пользуется предзаказом, но страдает от него первой. Лишние на карте не ломают запуск, но съедают время обследования: «Додо Пицца» — источник идей для анализа конкурентов, а не заинтересованное лицо.</p>
      <p>Источники: BABOK v3 (анализ заинтересованных лиц); Иан Александер, «A Taxonomy of Stakeholders» (2005) — модель «луковицы» и «негативные» заинтересованные лица; Гаус и Вайнберг, «Exploring Requirements» — мета-вопрос «кого ещё спросить?».</p>`,
    refNote: 'Строки списка в эталоне — одна из возможных раскладок. Засчитываются и другие подходящие строки: Олег Петрович — «Закон» или «Смежные системы» (он владелец 1С); Павел — «Пользователи» или «Заказчик»; «КассаПро» — «Закон»; Анна Павловна, кассиры, Лёша — «Те, кто пострадает».',
    report: ans => { const v = (ans && ans.v) || {}, ev = findEval(v); return FB.map(b => `${b.t}: ${FC.filter(c => v[c.id] === b.id).map(c => c.t).join('; ') || '—'}`).join('\n') + `\nВ лотке: ${FC.filter(c => !v[c.id]).map(c => c.t).join('; ') || '—'}\nПрогонов дня запуска: ${(ans && ans.runs) || 0}. Сломалось в день запуска: ${DAY.filter(d => !onMap(v, d.who)).length} из ${DAY.length}. Балл ${Math.round(ev.score * 100)} %.`; }
  };

  // =====================================================================
  // Практика 2. Матрица влияние/интерес для «Колоса» + стратегии
  // =====================================================================
  const GC = [
    { id: 'nina', t: 'Нина', title: 'Нина Сергеевна, владелица', ok: ['HH'], ref: { x: 88, y: 90 }, hint: 'Кто подписывает объём и платит? И насколько ей не всё равно?' },
    { id: 'oleg', t: 'Олег П.', title: 'Олег Петрович, главный бухгалтер', ok: ['HH'], half: ['HL'], ref: { x: 72, y: 74 }, hint: 'Может ли главбух остановить запуск из-за чеков? И равнодушен ли он к проекту, который должен снять с него 2 часа сверки каждое утро?' },
    { id: 'galya', t: 'Галина И.', title: 'Галина Ивановна, технолог', ok: ['HH'], half: ['LH'], ref: { x: 90, y: 66 }, hint: 'Нина делегирует ей ежедневные вопросы по цеху. А без её плана выпечки предзаказ не испечь — это влияние.' },
    { id: 'pavel', t: 'Павел', title: 'Павел, управляющий на Покровке', ok: ['HH'], half: ['LH'], ref: { x: 64, y: 58 }, hint: 'Нина делегирует ему операционные вопросы. Его пекарня — пилотная, его кассиры будут работать в системе.' },
    { id: 'kassapro', t: 'КассаПро', title: '«КассаПро», вендор облачных касс', ok: ['HL'], half: ['HH'], ref: { x: 14, y: 84 }, hint: 'Может ли вендор сорвать запуск? Насколько ему важен именно «Колос»?' },
    { id: 'lawyer', t: 'Юрист', title: 'Юрист по персональным данным', ok: ['HL'], half: ['HH'], ref: { x: 28, y: 70 }, hint: 'Может ли запуск остановиться из-за 152-ФЗ? Интересна ли юристу сама выпечка?' },
    { id: 'cash', t: 'Кассиры', title: 'Кассиры, в том числе новенькие', ok: ['LH'], half: ['HH'], ref: { x: 82, y: 26 }, hint: 'Им точно не всё равно — это их смена. А решают ли они, что войдёт в систему?' },
    { id: 'anna', t: 'Анна П.', title: 'Анна Павловна и покупатели 55+', ok: ['LH'], half: ['LL'], ref: { x: 66, y: 10 }, hint: 'Ей важно сохранить «отложи мне». А может ли она повлиять на решения проекта сама?' },
    { id: 'rita', t: 'Рита', title: 'Рита, маркетолог', ok: ['LH', 'HH'], ref: { x: 56, y: 40 }, hint: 'Рите очень интересно. Решает ли она объём?' },
    { id: 'lesha', t: 'Лёша', title: 'Лёша, курьер', ok: ['LH', 'LL'], ref: { x: 36, y: 16 }, hint: 'Решает ли курьер что-то в проекте?' }
  ];
  const ST_CH = [
    { v: 'close', t: 'Управлять плотно' },
    { v: 'sat', t: 'Держать удовлетворёнными' },
    { v: 'inf', t: 'Держать в курсе' },
    { v: 'mon', t: 'Наблюдать' },
    { v: 'skip', t: 'Не тратить на них время' }
  ];
  const ST_ROWS = [{ id: 'HH', t: 'Влияние высокое, интерес высокий', ok: 'close' }, { id: 'HL', t: 'Влияние высокое, интерес низкий', ok: 'sat' }, { id: 'LH', t: 'Влияние низкое, интерес высокий', ok: 'inf' }, { id: 'LL', t: 'Влияние низкое, интерес низкий', ok: 'mon' }];
  const GQ = {
    q: 'Анна Павловна оказалась в нижней половине: влияние низкое. Что это значит для аналитика?', seed: 'stk-gq2',
    options: [
      { t: 'Её интересы сами до решений не дойдут — их донесёт аналитик: наблюдение на кассе, разговор с кассирами, требование «заказ через кассира»', ok: 1, why: 'Да. Матрица говорит, сколько сил тратить на общение, а не чьи потребности важнее.' },
      { t: 'Её можно не спрашивать: она ничего не решает', why: '40 % постоянных клиентов старше 55. Не спросить — потерять их в день запуска.' },
      { t: 'Нужно звать её на все встречи с Ниной', why: 'Это лишнее для неё и не меняет её влияния. Её голос в проекте — через аналитика и через Нину, которая «их не бросит».' },
      { t: 'Матрица ошиблась: раз таких клиентов 40 %, её влияние высокое', why: 'Влияние в матрице — власть над решениями проекта. Важность клиентов для выручки — другой вопрос, и его решает Нина.' }
    ]
  };
  function gridEval(ans) {
    const a = ans || {}, P = a.p || {};
    const rows = GC.map(g => { const q = quadOf(P[g.id]); const pts = !q ? 0 : g.ok.includes(q) ? 1 : (g.half || []).includes(q) ? 0.5 : 0; return { g, q, pts, s: !q ? '' : pts === 1 ? 'ok' : pts ? 'warn' : 'bad' }; });
    const place = rows.reduce((s, r) => s + r.pts, 0) / GC.length;
    const S = a.s || {}, sOk = ST_ROWS.filter(r => S[r.id] === r.ok).length;
    const q = ui.quizScore(GQ, a.q || []);
    return { rows, place, sOk, q, score: place * 0.6 + sOk / 4 * 0.25 + q.score * 0.15 };
  }
  const gridTask = {
    id: 'grid', title: 'Матрица влияние/интерес для «Колоса»',
    simple: howGrid.simple,
    lead: ui.brief({
      situation: 'Карта собрана: четырнадцать заинтересованных лиц. Ксения: «На три недели обследования у нас не больше пятнадцати встреч. Кого плотно, кого коротко, кого держим в курсе — решим по матрице». Десять главных карточек — перед вами.',
      todo: [
        'Шаг 1: перетащите каждую карточку на матрицу (или нажмите на карточку, потом на место). Влияние — может ли человек остановить, разрешить или изменить проект. Интерес — насколько ему не всё равно.',
        'Шаг 2: для каждого квадранта выберите стратегию общения. Подсказка, что значит каждая, — в теории «Матрица влияние / интерес»: перетащите там любую карточку.',
        'Шаг 3: ответьте на вопрос про Анну Павловну и нажмите «Проверить». Засчитывается от 80 % и все четыре стратегии верны.'
      ],
      look: 'Подписи квадрантов — сочетание влияния и интереса. Точное место внутри квадранта не важно — важно, в каком квадранте. У некоторых людей честный ответ — на границе: там засчитываются оба квадранта.'
    }),
    blank: () => ({ p: {}, s: {}, q: [] }),
    reference: () => ({ p: Object.fromEntries(GC.map(g => [g.id, g.ref])), s: Object.fromEntries(ST_ROWS.map(r => [r.id, r.ok])), q: quizRef(GQ) }),
    render(el, ctx) {
      el.classList.add('stk-root');
      const a = ctx.ans; a.p = a.p || {}; a.s = a.s || {}; a.q = a.q || [];
      const judged = !!(ctx.result || ctx.readonly), ev = gridEval(a);
      el.innerHTML = `<div class="stack">
        <div class="stk-lbl">Шаг 1 · Разместите на матрице</div><div data-b></div>
        <div class="stk-lbl">Шаг 2 · Стратегия для каждого квадранта</div><div data-m></div>
        <div class="stk-lbl">Шаг 3 · Вопрос</div><div class="card flat" data-q></div>
        ${ui.note('info', 'Позиция аналитика', 'Матрицу аналитик рисует для себя и команды, а не показывает людям: «вы у нас в углу „наблюдать“» никого не обрадует. Из неё вырастает план коммуникаций — следующее задание.')}
      </div>`;
      let reveal = null;
      if (judged) { reveal = {}; ev.rows.forEach(r => { if (r.s) reveal[r.g.id] = r.s; }); }
      mxBoard(TR.$('[data-b]', el), { items: GC.map(g => ({ id: g.id, t: g.t, title: g.title })), value: a.p, readonly: ctx.readonly, reveal, onChange: v => { a.p = v; ctx.save(); } });
      let mrev = null;
      if (judged) { mrev = {}; ST_ROWS.forEach(r => { if (a.s[r.id]) mrev[r.id] = { s: a.s[r.id] === r.ok ? 'ok' : 'bad' }; }); }
      ui.match(TR.$('[data-m]', el), { rows: ST_ROWS.map(r => ({ id: r.id, t: esc(r.t) })), choices: ST_CH, value: a.s, readonly: ctx.readonly, reveal: mrev, placeholder: 'Выберите стратегию…', onChange: v => { a.s = v; ctx.save(); } });
      ui.quiz(TR.$('[data-q]', el), Object.assign({}, GQ, { value: a.q, readonly: ctx.readonly, reveal: ctx.result, onChange: v => { a.q = v; ctx.save(); } }));
    },
    check(ans) {
      const ev = gridEval(ans), notes = [];
      const miss = ev.rows.filter(r => !r.q).length;
      if (miss) notes.push({ ok: false, html: `На матрице нет ${miss} из ${GC.length} карточек.` });
      ev.rows.forEach(r => { if (r.q && r.pts < 1) notes.push({ ok: r.pts ? 'warn' : false, html: `${qt(r.g.title)}${r.pts ? ' — спорно' : ''}: ${r.g.hint}` }); });
      if (ev.sOk < 4) notes.push({ ok: false, html: `Стратегии: верно ${ev.sOk} из 4. Подумайте: кто может остановить проект, но не хочет вникать? С кем вы принимаете решения вместе? Кому важно, но решают не они?` });
      notes.push(ev.q.ok ? { ok: true, html: 'Вопрос: верно — низкое влияние не значит «можно не спрашивать».' } : { ok: false, html: 'Вопрос: что меряет вертикальная ось — важность потребностей или власть над решениями проекта?' });
      const ok = ev.score >= 0.8 && ev.sOk === 4;
      return {
        ok, score: ev.score, notes,
        summary: `Размещение: ${Math.round(ev.place * 100)} %. Стратегии: ${ev.sOk} из 4. Вопрос: ${ev.q.ok ? 'верно' : 'неверно'}.`,
        mentor: ev.rows.some(r => r.g.id === 'kassapro' && r.q && r.q[0] === 'L') ? '«КассаПро» в нижней половине — опасно. Их проверка длится 3 недели: забудете заранее подать заявку — и запуск без чеков. Влияние — это не «важный ли он человек», а «может ли он остановить проект».' : null
      };
    },
    explain: `${ui.table(['Квадрант', 'Кто у «Колоса»', 'Как работаем'], [
        ['<b>Управлять плотно</b> · влияние ↑, интерес ↑', 'Нина Сергеевна, Олег Петрович, Галина Ивановна, Павел (Рита — на границе)', 'встречи каждую неделю, варианты с ценой, письмо-итог после каждой встречи'],
        ['<b>Держать удовлетворёнными</b> · влияние ↑, интерес ↓', '«КассаПро», юрист по персональным данным', 'коротко, по делу и заранее: заявка на сертификацию с запасом, текст согласия на проверку к сроку'],
        ['<b>Держать в курсе</b> · влияние ↓, интерес ↑', 'кассиры, Анна Павловна и покупатели 55+, Рита, Лёша', 'наблюдение, демо и пробы на смене, памятки, объявления; их интересы до Нины доносит аналитик'],
        ['<b>Наблюдать</b> · влияние ↓, интерес ↓', 'Лёша — честно и здесь: торты он возит, но решений не ждёт', 'сообщать по необходимости, следить, не изменилось ли']
      ])}
      <p><b>Где у практиков нет единого мнения.</b> Олег Петрович — «плотно» или «держать удовлетворёнными»? Галина Ивановна и Павел — ключевые игроки или «в курсе»? Ответ зависит от того, сколько власти им делегирует Нина; в «Колосе» она делегирует ежедневные вопросы Павлу и Галине — поэтому они наверху. Рита на границе: интерес высокий, а влияние — через Нину.</p>
      <p><b>Две ловушки матрицы.</b> Первая — «вниз значит неважно»: внизу Анна Павловна и кассиры, а без них система не работает. Вторая — «нарисовали один раз»: люди движутся. Ближе к запуску интерес «КассаПро» и юриста вырастет, а после запуска наверх поднимется поддержка. Источник — Обри Менделоу (1991), матрица влияние/интерес; DOMAIN §9.</p>`,
    refNote: 'Положение внутри квадранта в эталоне — примерное. Засчитываются оба квадранта для Риты (интерес высокий, влияние — через Нину) и Лёши (интерес средний). Наполовину — Олег Петрович в «держать удовлетворёнными», Галина Ивановна и Павел в «держать в курсе», кассиры в «управлять плотно».',
    report: ans => { const ev = gridEval(ans), a = ans || {}; return ev.rows.map(r => `- ${r.g.title}: ${r.q ? QUAD[r.q].t : '—'} ${r.s === 'ok' ? '✓' : r.s === 'warn' ? '≈' : r.s ? '✗' : ''}`).join('\n') + `\nСтратегии: ${ST_ROWS.map(r => `${r.t} → ${(ST_CH.find(c => c.v === (a.s || {})[r.id]) || {}).t || '—'}`).join('; ')}\nВопрос про Анну Павловну: ${ev.q.ok ? 'верно' : 'неверно'}.`; }
  };

  // =====================================================================
  // Практика 3. Кто решает: RACI спорных решений и «чьё „да“ считается»
  // =====================================================================
  const DCOL = [{ id: 'nina', t: 'Нина', sub: 'владелица' }, { id: 'oleg', t: 'Олег П.', sub: 'главбух' }, { id: 'galya', t: 'Галина И.', sub: 'технолог' }, { id: 'pavel', t: 'Павел', sub: 'управляющий' }, { id: 'cash', t: 'Кассиры', sub: 'смена' }, { id: 'me', t: 'Вы', sub: 'аналитик' }];
  const DROW = [
    { id: 'pay', t: 'Оставить ли оплату при получении', A: ['nina'], need: { oleg: ['C'], me: ['R', 'C'] }, ref: { nina: 'A', oleg: 'C', pavel: 'C', cash: 'I', me: 'R' }, hint: 'Это спор Олега Петровича («только онлайн») и Нины («бабушки платят наличными»). Кто вправе выбрать между их интересами — и чьё мнение обязательно услышать до решения?' },
    { id: 'slot', t: 'С какого времени можно выбирать интервал выдачи: с 07:00 или с 07:30', A: ['nina'], need: { galya: ['C'], me: ['R', 'C'] }, ref: { nina: 'A', galya: 'C', pavel: 'C', cash: 'I', me: 'R' }, hint: 'Нина хочет «хоть 07:05», Галина Ивановна не гарантирует круассан раньше 07:30. Кто решает, а кого нельзя не спросить?' },
    { id: 'peak', t: 'Кто выдаёт предзаказы в утренний пик: кассир или отдельный человек', A: ['nina'], halfA: ['pavel'], need: { pavel: ['C', 'R'], cash: ['C', 'I'] }, ref: { nina: 'A', pavel: 'C', cash: 'C', me: 'R' }, hint: '«Лишнего человека в смену не дам» — чьи это слова и чьи это деньги? Кого коснётся решение прямо у кассы?' },
    { id: 'c1', t: 'Формат сводки продаж для 1С', A: ['oleg'], need: { me: ['R', 'C'] }, ref: { nina: 'I', oleg: 'A', me: 'R' }, hint: 'Кто каждое утро работает с этой сводкой и отвечает за учёт? Не всё в проекте решает владелица.' }
  ];
  const CYC = ['', 'R', 'A', 'C', 'I'];
  const DQ = [
    { q: 'Галина Ивановна в коридоре: «Ладно, пусть выбирают хоть с 07:00». Что вы делаете?', seed: 'stk-dq1b', options: [
      { t: 'Записываю как её мнение и выношу решение Нине: здесь Галина Ивановна советует, а решает Нина', ok: 1, why: 'Да. «Да» советника важно, но решение — за тем, у кого A. И проверьте, понимает ли Галина Ивановна, что обещает: первая партия бывает в 07:20.' },
      { t: 'Ставлю требованию статус «согласовано» — технолог же не против', why: 'В этом решении технолог — советник. Нина может сказать иначе, и требование «согласовано» окажется фикцией.' },
      { t: 'Ничего не делаю: раз она согласна, спорить не о чем', why: 'Устное «да» в коридоре через неделю превратится в «я такого не говорила». И решает здесь не она.' }] },
    { q: 'Олег Петрович отвечает на ваше письмо: «Формат сводки — как в вашем примере, согласен». Что это?', seed: 'stk-dq2', options: [
      { t: 'Согласовано: в этом решении отвечает он. Сохраняю письмо и меняю статус требования', ok: 1, why: 'Да. A здесь — Олег Петрович, письменное подтверждение есть. Нину — в курсе (I).' },
      { t: 'Ещё нужно подтверждение Нины — она владелица, без неё ничего не согласовано', why: 'Если по каждому решению ждать владелицу, проект встанет. Формат учёта — зона Олега Петровича; Нине достаточно знать.' },
      { t: 'Это мнение, надо собрать всех на встречу', why: 'Встреча ради уже принятого решения — лишняя трата времени всех, кого вы позовёте.' }] },
    { q: 'Нина на встрече: «Выдаёт кассир, лишнего человека в смену не дам». Павел недоволен. Что дальше?', seed: 'stk-dq3', options: [
      { t: 'Фиксирую решение в письме-итоге, сообщаю кассирам; опасение Павла про очередь записываю как риск и ищу меры: выдача по короткому коду, проверка на смене', ok: 1, why: 'Да. Решение принято тем, кто вправе. Интерес Павла — «очередь не стоит» — никуда не делся: его закрывают требованиями, а не спором.' },
      { t: 'Ищу способ переубедить Нину — Павел прав', why: 'Аналитик не выбирает победителя. Можно вернуться к вопросу с новыми данными пилота, но не тайком.' },
      { t: 'Прошу Диму на всякий случай сделать экран для отдельного выдающего', why: 'Это работа против принятого решения и трата бюджета на то, что владелица не заказывала.' }] }
  ];
  function decEval(ans) {
    const v = (ans && ans.v) || {};
    const rows = DROW.map(r => {
      const row = v[r.id] || {}, vals = DCOL.map(c => row[c.id] || '');
      const As = DCOL.filter(c => row[c.id] === 'A').map(c => c.id);
      const oneA = As.length === 1, aOk = oneA && r.A.includes(As[0]), aHalf = oneA && (r.halfA || []).includes(As[0]);
      const needOk = Object.entries(r.need).every(([c, allowed]) => allowed.includes(row[c] || ''));
      const tooC = vals.filter(x => x === 'C').length >= DCOL.length - 1;
      const score = (oneA ? 0.3 : 0) + (aOk ? 0.5 : aHalf ? 0.25 : 0) + (needOk ? 0.2 : 0);
      return { r, oneA, aOk, aHalf, needOk, tooC, nA: As.length, empty: !vals.some(Boolean), score, s: aOk && needOk && !tooC ? 'ok' : oneA ? 'warn' : 'bad' };
    });
    const tbl = rows.reduce((s, x) => s + x.score, 0) / DROW.length;
    const qs = DQ.map((q, i) => ui.quizScore(q, ((ans && ans.q) || {})[i] || []));
    const qScore = qs.filter(x => x.ok).length / DQ.length;
    return { rows, tbl, qs, qScore, score: tbl * 0.6 + qScore * 0.4 };
  }
  const decideTask = {
    id: 'decide', title: 'Кто решает: RACI спорных решений',
    simple: howGrid.simple,
    lead: ui.brief({
      situation: 'На прошлой неделе вскрылись четыре вопроса, по которым заинтересованные лица говорят разное. Ксения: «Пока не договоримся, чьё „да“ считается, требования будут „согласованы“ трижды и по-разному. Заполните RACI решений — Игорь покажет её Нине на встрече».',
      todo: [
        'Для каждой строки щёлкайте клетки: клик меняет букву по кругу (пусто → R → A → C → I). Пустая клетка — человек в этом решении не участвует.',
        'В каждой строке — ровно один A: тот, кто решает и отвечает. C — с кем обязательно советуются до, I — кому сообщают после, R — кто готовит решение.',
        'Ответьте на три вопроса «чьё „да“ считается» и нажмите «Проверить». Засчитывается от 80 %, и во всех строках ровно один A.'
      ],
      look: 'Колонка «Вы» — аналитик. Решений по объёму аналитик не принимает, но готовит их: варианты, цену, последствия. Таблица на телефоне прокручивается вбок.'
    }),
    blank: () => ({ v: {}, q: {} }),
    reference: () => ({ v: Object.fromEntries(DROW.map(r => [r.id, TR.clone(r.ref)])), q: Object.fromEntries(DQ.map((q, i) => [i, quizRef(q)])) }),
    render(el, ctx) {
      el.classList.add('stk-root');
      const a = ctx.ans; a.v = a.v || {}; a.q = a.q || {};
      const judged = !!(ctx.result || ctx.readonly), ev = decEval(a);
      el.innerHTML = `<div class="stack">
        <div class="stk-lbl">RACI решений «Колоса»</div>
        <div class="stk-raci" data-t></div>
        <div data-lint></div>
        <div class="stk-lbl">Чьё «да» считается</div>
        ${DQ.map((q, i) => `<div class="card flat" data-q="${i}"></div>`).join('')}
      </div>`;
      const st = {}; if (judged) ev.rows.forEach(x => { st[x.r.id] = x.s; });
      function drawT() {
        TR.$('[data-t]', el).innerHTML = `<table><thead><tr><th class="rl">Решение</th>${DCOL.map(c => `<th>${esc(c.t)}<small>${esc(c.sub)}</small></th>`).join('')}</tr></thead><tbody>${DROW.map(r => `<tr class="${st[r.id] || ''}"><td class="rl">${esc(r.t)}</td>${DCOL.map(c => { const x = (a.v[r.id] || {})[c.id] || ''; return `<td><button type="button" class="stk-cell" data-r="${r.id}" data-c="${c.id}" data-v="${x}" aria-label="${esc(r.t)} — ${esc(c.t)}: ${x || 'пусто'}" ${ctx.readonly ? 'disabled' : ''}>${x || '·'}</button></td>`; }).join('')}</tr>`).join('')}</tbody></table>`;
      }
      function drawLint() {
        const used = DROW.filter(r => Object.values(a.v[r.id] || {}).some(Boolean));
        TR.$('[data-lint]', el).innerHTML = used.length ? `<ul class="checks">${used.map(r => { const row = a.v[r.id] || {}, nA = DCOL.filter(c => row[c.id] === 'A').length, nC = DCOL.filter(c => row[c.id] === 'C').length; const k = nA === 1 ? (nC >= DCOL.length - 1 ? 'warn' : '') : 'bad'; const t = nA === 0 ? 'нет A — решать некому' : nA > 1 ? `A у ${nA} человек — каждый думает, что решает он` : nC >= DCOL.length - 1 ? 'советоваться почти со всеми — решение будет ждать каждого' : 'один решает'; return `<li class="${k}"><b>${esc(r.t)}</b>: ${t}</li>`; }).join('')}</ul>` : '<p class="small dim">Заполните строки — здесь появится проверка формата: один ли A в строке.</p>';
      }
      drawT(); drawLint();
      if (!ctx.readonly) TR.on(el, 'click', '.stk-cell', (e, b) => {
        const r = b.dataset.r, c = b.dataset.c; a.v[r] = a.v[r] || {};
        const nx = CYC[(CYC.indexOf(a.v[r][c] || '') + 1) % CYC.length];
        if (nx) a.v[r][c] = nx; else delete a.v[r][c];
        b.dataset.v = nx; b.textContent = nx || '·';
        const tr = b.closest('tr'); if (tr) tr.className = '';
        ctx.save(); drawLint();
      });
      DQ.forEach((q, i) => ui.quiz(TR.$(`[data-q="${i}"]`, el), Object.assign({}, q, { value: a.q[i] || [], readonly: ctx.readonly, reveal: ctx.result, onChange: v => { a.q[i] = v; ctx.save(); } })));
    },
    check(ans) {
      const ev = decEval(ans), notes = [];
      ev.rows.forEach(x => {
        if (x.s === 'ok') return;
        if (x.empty) notes.push({ ok: false, html: `«${esc(x.r.t)}»: строка пустая. ${x.r.hint}` });
        else if (!x.oneA) notes.push({ ok: false, html: `«${esc(x.r.t)}»: ${x.nA ? `A стоит у ${x.nA} человек` : 'нет A'} — нужен ровно один. ${x.r.hint}` });
        else if (!x.aOk) notes.push({ ok: x.aHalf ? 'warn' : false, html: `«${esc(x.r.t)}»: ${x.aHalf ? 'спорно, кто здесь решает.' : 'A стоит не у того, кто вправе решать.'} ${x.r.hint}` });
        else if (!x.needOk) notes.push({ ok: 'warn', html: `«${esc(x.r.t)}»: решающий выбран верно, но проверьте остальных. ${x.r.hint}` });
        else if (x.tooC) notes.push({ ok: 'warn', html: `«${esc(x.r.t)}»: советоваться почти со всеми — с кем действительно нужно?` });
      });
      ev.qs.forEach((q, i) => { if (!q.ok) notes.push({ ok: false, html: `Вопрос ${i + 1}: какая роль у этого человека именно в этом решении — A, C или I?` }); });
      const allOneA = ev.rows.every(x => x.oneA);
      if (!notes.length) notes.push({ ok: true, html: 'Во всех решениях один решающий, советники названы, а «да» вы различаете по ролям.' });
      return {
        ok: ev.score >= 0.8 && allOneA, score: ev.score, notes,
        summary: `Строк в порядке: ${ev.rows.filter(x => x.s === 'ok').length} из ${DROW.length}. Вопросы: ${ev.qs.filter(q => q.ok).length} из ${DQ.length}.`,
        mentor: !allOneA ? 'Начните с правила: в каждой строке ровно один A. Двое решающих — спор, ни одного — решение повиснет до запуска.'
          : ev.rows.find(x => x.r.id === 'c1' && x.oneA && !x.aOk) ? 'Формат сводки для 1С — не про стратегию сети, а про учёт. Если по каждой мелочи ждать Нину, она станет бутылочным горлышком проекта.' : null
      };
    },
    explain: `<p><b>Три спорных решения из четырёх принимает Нина</b> — это противоречия между заинтересованными лицами (DOMAIN §5): оплата на месте (Олег ↔ Нина), время с 07:00 или 07:30 (Нина ↔ Галина Ивановна), отдельный человек в пик (Павел ↔ Нина). Аналитик не выбирает победителя: он готовит решение (R) — варианты, цену, последствия — и выносит его тому, кто вправе решать. А вот <b>формат сводки для 1С</b> — зона Олега Петровича: решает он, Нина в курсе.</p>
      <p><b>Почему C обязателен.</b> Решение по оплате без Олега Петровича вернёт ручную сверку; решение по времени без Галины Ивановны пообещает клиентам круассан, которого в 07:05 ещё нет (первая партия — в 07:20).</p>
      <p><b>Чьё «да» считается.</b> Требование согласовано, когда его подтвердил тот, у кого A, — письменно: письмо, протокол, статус в реестре (PRACTICES §3). «Да» советника в коридоре — ценное мнение, но не решение. Подробнее о том, как вести такие встречи и фиксировать итог, — в пятницу, «Работа с бизнесом».</p>
      <p>Где у практиков нет единого мнения: ставить ли A и R одному человеку, нужна ли RACI для каждого решения. Многие ведут её только для спорных зон — как здесь. Источник: матрица ответственности RACI (практика управления проектами), DOMAIN §9.</p>`,
    refNote: 'В эталоне — одна из верных раскладок. Засчитываются и варианты: аналитик — C вместо R; Павел в строке про пик — R; кассиры — I. Павел как A в строке про пик — наполовину: людей в смену даёт Нина.',
    report: ans => { const ev = decEval(ans), v = (ans && ans.v) || {}; return ev.rows.map(x => `- ${x.r.t}: ${DCOL.map(c => `${c.t}=${(v[x.r.id] || {})[c.id] || '·'}`).join(', ')} ${x.s === 'ok' ? '✓' : x.s === 'warn' ? '≈' : '✗'}`).join('\n') + `\nВопросы «чьё да»: ${ev.qs.map((q, i) => `${i + 1} ${q.ok ? '✓' : '✗'}`).join(', ')}`; }
  };

  // =====================================================================
  // Практика 4. План коммуникаций «Колоса»
  // =====================================================================
  const CW = [
    { v: 'w1', t: 'Решения: варианты с ценой и последствиями, итоги встреч' },
    { v: 'w2', t: 'Формат сводки для 1С и чеки по 54-ФЗ — согласовать и подтвердить' },
    { v: 'w3', t: 'Правила выдачи и плана выпечки — проверить на смене, сработает ли' },
    { v: 'w4', t: 'Что изменится в смене: как выдать заказ и что делать, если не работает' },
    { v: 'w5', t: 'Заявка на сертификацию и вопросы по их API' },
    { v: 'w6', t: 'Заказ через кассира и по телефону остаётся — как им пользоваться' },
    { v: 'w7', t: 'Полное техническое задание на 80 страниц' },
    { v: 'w8', t: 'Статус каждой задачи разработчиков' }
  ];
  const CF = [
    { v: 'f1', t: 'Каждый день' },
    { v: 'f2', t: 'Раз в неделю на обследовании, потом — демо раз в 2 недели' },
    { v: 'f3', t: 'При каждом решении по его теме' },
    { v: 'f4', t: 'Заранее, по их регламенту — с запасом до нужной даты' },
    { v: 'f5', t: 'Перед пилотом и перед запуском' }
  ];
  const CC = [
    { v: 'c1', t: 'Короткая встреча 30 минут + письмо-итог' },
    { v: 'c2', t: 'Письмо с примером или таблицей' },
    { v: 'c3', t: 'Разговор на точке и в цехе + чат проекта' },
    { v: 'c4', t: 'Обучение в пекарне + памятка на одну страницу у кассы' },
    { v: 'c5', t: 'Официальная заявка по регламенту вендора' },
    { v: 'c6', t: 'Объявление у кассы и слова кассира' },
    { v: 'c7', t: 'Push-уведомление в приложении' },
    { v: 'c8', t: 'Общий чат со всеми' }
  ];
  const CR = [
    { id: 'nina', t: 'Нина Сергеевна', q: 'управлять плотно', w: ['w1'], f: ['f2'], fh: ['f3'], c: ['c1'],
      re: { w: 'Нина: «Мне не нужны подробности — мне нужно, что решить и сколько это стоит».', f: { f1: 'Нина: «Вы меня каждый день дёргаете — я девятью пекарнями управляю».', f4: 'Нина узнаёт о решениях, когда всё уже сделано.', f5: 'Нина впервые видит систему перед пилотом: «Я не это заказывала!»', f3: 'Решений много — Нина получает письмо почти каждый день. На грани.' }, c: { c2: 'Нина: «Опять таблицы… Скажите словами».', c8: 'Нина: «Двести сообщений в чате — я не читаю».', c7: 'Push владелице? Нина не пользуется приложением как покупатель.', c4: 'Памятка — для кассиров, Нине решать нечего.', c5: 'Заявка по регламенту — это про вендора, не про Нину.', c6: 'Объявление у кассы — для покупателей.', c3: 'Разговоры на точке — Нина бывает в пекарнях, но решения так не фиксируются.' } },
      ok: 'Нина: «Полчаса в неделю и письмо после — так можно работать».' },
    { id: 'oleg', t: 'Олег Петрович', q: 'управлять плотно, но по своей теме', w: ['w2'], f: ['f3'], fh: ['f2'], c: ['c2'],
      re: { w: 'Олег Петрович: «Это не моя тема. Мне — сводка и чеки».', f: { f1: 'Олег Петрович: «Я каждое утро сверяю продажи — не до ваших ежедневных писем».', f4: 'Сводку согласовали с Олегом Петровичем в последний момент — не та структура.', f5: 'Олег Петрович впервые видит сводку перед пилотом — и находит в ней ошибки.' }, c: { c1: 'Встреча ради одного формата — Олег Петрович просит «пришлите пример, я посмотрю».', c8: 'В общем чате пример сводки утонул.', c3: 'Олег Петрович в пекарнях не бывает.', c4: 'Памятка для кассиров — не про учёт.', c5: 'Олег Петрович — не вендор.', c6: 'Объявление у кассы — не для главбуха.', c7: 'Push главбуху бессмыслен.' } },
      ok: 'Олег Петрович: «Пример сводки получил, поправил два поля. Подтверждаю письмом».' },
    { id: 'ops', t: 'Павел и Галина Ивановна', q: 'управлять плотно', w: ['w3'], f: ['f2'], fh: ['f3'], c: ['c3'],
      re: { w: 'Павел: «Это всё красиво, а на смене как будет?»', f: { f1: 'Павел: «Каждый день вопросы? У меня смена».', f4: 'Правила выдачи проверили в последний момент — на смене они не работают.', f5: 'Галина Ивановна видит экран плана впервые перед пилотом — переделка.' }, c: { c1: 'Встреча в офисе — Павел не может уйти со смены, Галина Ивановна спит после ночи.', c2: 'Письмо с таблицей Павел открывает вечером — и не открывает.', c8: 'Общий чат: важное тонет в шуме.', c4: 'Памятка — для кассиров. С Павлом и Галиной Ивановной правила надо проверять, а не сообщать.', c5: 'Регламент вендора тут ни при чём.', c6: 'Объявление у кассы — для покупателей.', c7: 'Push — не для сотрудников.' } },
      ok: 'Павел: «Пришли на смену, посмотрели, как я выдаю, — так бы сразу».' },
    { id: 'cash', t: 'Кассиры', q: 'держать в курсе', w: ['w4'], f: ['f5'], c: ['c4'],
      re: { w: 'Кассир: «А мне-то что делать, когда клиент пришёл за заказом?»', f: { f1: 'Каждый день новости? Через месяц половина кассиров уже новые.', f2: 'Раз в неделю за три месяца до запуска — кассиры к марту сменятся.', f3: 'Кассиры не участвуют в решениях — им нужен итог, а не процесс.', f4: 'Регламент вендора — это не про кассиров.' }, c: { c1: 'Встреча в офисе? Кассир на смене, и через месяц он уже другой.', c2: 'Письмо кассиру? Почты на кассе нет.', c3: 'Чат проекта — кассиров в нём нет, да и новеньким его не перешлют.', c5: 'Регламент вендора — не для кассиров.', c6: 'Объявление у кассы — для покупателей, кассиру нужна инструкция.', c7: 'Push в приложении покупателя кассиру не придёт.', c8: 'Общий чат: новенькие о нём не знают.' } },
      ok: 'Новый кассир: «Показали за 15 минут, памятка у кассы — разобралась».' },
    { id: 'kassapro', t: '«КассаПро»', q: 'держать удовлетворёнными', w: ['w5'], f: ['f4'], c: ['c5'],
      re: { w: '«КассаПро»: «По этому вопросу мы не консультируем».', f: { f1: 'Вендор не отвечает на ежедневные письма: у него очередь заявок.', f2: 'Еженедельные письма вендору без заявки — уходят в никуда.', f3: 'Вендору не важны ваши решения — у него регламент.', f5: 'Заявка «перед пилотом» — а проверка идёт 3 недели. Пилот без чеков.' }, c: { c1: 'Встреча? Вендор работает по регламенту и письменным заявкам.', c2: 'Письмо «в свободной форме» вендор вернёт: нужна заявка по регламенту.', c3: 'Разговоры на точке тут ни при чём.', c4: 'Памятка — для кассиров.', c6: 'Объявление у кассы — для покупателей.', c7: 'Push вендору? Нет.', c8: 'В общем чате вендора нет.' } },
      ok: '«КассаПро»: «Заявка принята, проверка — 3 недели, сроки до пилота с запасом».' },
    { id: 'elder', t: 'Анна Павловна и покупатели 55+', q: 'держать в курсе', w: ['w6'], f: ['f5'], c: ['c6'],
      re: { w: 'Анна Павловна: «Деточка, мне бы просто знать, можно ли по-прежнему через Свету».', f: { f1: 'Каждый день о проекте? Анна Павловна такого не просила.', f2: 'Раз в неделю о проекте — Анне Павловне это ни к чему.', f3: 'В решениях Анна Павловна не участвует.', f4: 'Регламент — это про вендора.' }, c: { c1: 'Встреча с покупателями 55+? Придут единицы.', c2: 'Письмо — электронной почты у многих нет.', c3: 'Чат проекта — не для покупателей.', c4: 'Памятка для кассиров не объяснит покупателю, что изменится.', c5: 'Регламент вендора — не для покупателей.', c7: 'Push не дойдёт: смартфона нет.', c8: 'Общий чат — нет смартфона.' } },
      ok: 'Анна Павловна: «Света сказала, что всё как раньше, только без тетради. Ну и славно».' }
  ];
  function cmRow(r, s) {
    s = s || {};
    const part = (k, okL, half) => !s[k] ? null : okL.includes(s[k]) ? 1 : (half || []).includes(s[k]) ? 0.5 : 0;
    const pw = part('w', r.w), pf = part('f', r.f, r.fh), pc = part('c', r.c);
    const vals = [pw, pf, pc], filled = vals.filter(x => x != null).length, sc = vals.reduce((t, x) => t + (x || 0), 0) / 3;
    let k = '', msg = '';
    if (filled < 3) { k = ''; msg = 'Выберите что, как часто и каким способом.'; }
    else if (pw === 0) { k = 'bad'; msg = r.re.w; }
    else if (pc === 0) { k = 'bad'; msg = r.re.c[s.c] || 'Сообщение не дошло.'; }
    else if (pf === 0) { k = 'bad'; msg = r.re.f[s.f] || 'Не вовремя.'; }
    else if (pf === 0.5) { k = 'warn'; msg = r.re.f[s.f] || 'Дошло, но частота на грани.'; }
    else { k = 'ok'; msg = r.ok; }
    return { pw, pf, pc, sc, k, msg, full: filled === 3 };
  }
  function cmEval(ans) {
    const S = (ans && ans.s) || {};
    const rows = CR.map(r => Object.assign({ r }, cmRow(r, S[r.id])));
    return { rows, score: rows.reduce((t, x) => t + x.sc, 0) / CR.length, ok: rows.filter(x => x.k === 'ok').length, bad: rows.filter(x => x.k === 'bad').length };
  }
  const commTask = {
    id: 'comm', title: 'План коммуникаций: кому, что, как часто и как',
    simple: howComm.simple,
    lead: ui.brief({
      situation: 'Матрица готова. Игорь: «Только не надо всех в один чат — в прошлом проекте там было 300 сообщений в день, и главное никто не видел». Составьте план коммуникаций на обследование и запуск для шести заинтересованных лиц из разных квадрантов матрицы.',
      todo: [
        'Для каждого выберите в трёх списках: что ему нужно от нас (или нам от него), как часто и каким способом.',
        'Под каждой строкой — живая реакция человека: дошло, дошло с риском или не дошло. Меняйте выбор, пока реакция не станет зелёной.',
        'Нажмите «Проверить». Засчитывается от 80 %, и ни одна строка не должна остаться красной.'
      ],
      look: 'Цвет полосы слева — итог по строке. Счётчики сверху — сколько сообщений дошло. Подсказка — квадрант матрицы под именем: он задаёт стиль общения.'
    }),
    blank: () => ({ s: {} }),
    reference: () => ({ s: Object.fromEntries(CR.map(r => [r.id, { w: r.w[0], f: r.f[0], c: r.c[0] }])) }),
    render(el, ctx) {
      el.classList.add('stk-root');
      const a = ctx.ans; a.s = a.s || {};
      const opt = (list, cur) => `<option value="">—</option>${list.map(o => `<option value="${o.v}" ${cur === o.v ? 'selected' : ''}>${esc(o.t)}</option>`).join('')}`;
      el.innerHTML = `<div class="stack"><div class="stk-stats" data-st></div><div class="stk-cm">${CR.map(r => { const s = a.s[r.id] || {}; return `<div class="stk-cmrow" data-row="${r.id}">
          <div class="hd"><b>${esc(r.t)}</b><span class="small dim">${esc(r.q)}</span></div>
          <div class="sels"><label class="field"><span>Что</span><select data-k="w" ${ctx.readonly ? 'disabled' : ''}>${opt(CW, s.w)}</select></label>
            <label class="field"><span>Как часто</span><select data-k="f" ${ctx.readonly ? 'disabled' : ''}>${opt(CF, s.f)}</select></label>
            <label class="field"><span>Каким способом</span><select data-k="c" ${ctx.readonly ? 'disabled' : ''}>${opt(CC, s.c)}</select></label></div>
          <div class="re" data-re></div></div>`; }).join('')}</div>
        ${ui.note('info', 'Позиция аналитика', 'План коммуникаций аналитик согласует с руководителем проекта: Игорь отвечает за отчёты о сроках и деньгах, аналитик — за вопросы, решения по требованиям и письма-итоги. Артефакт — таблица «кто — что — как часто — каким способом — кто отвечает».')}</div>`;
      function draw() {
        const ev = cmEval(a);
        ev.rows.forEach(x => {
          const box = TR.$(`[data-row="${x.r.id}"]`, el); if (!box) return;
          box.className = 'stk-cmrow ' + x.k;
          const re = TR.$('[data-re]', box); re.className = 're ' + x.k; re.textContent = x.msg;
        });
        TR.$('[data-st]', el).innerHTML = `<div class="stat"><span class="k">Дошло</span><span class="v ok">${ev.ok}</span></div><div class="stat"><span class="k">С риском</span><span class="v warn">${ev.rows.filter(x => x.k === 'warn').length}</span></div><div class="stat"><span class="k">Не дошло</span><span class="v bad">${ev.bad}</span></div>`;
      }
      el.addEventListener('change', e => {
        const s = e.target.closest('select[data-k]'); if (!s || ctx.readonly) return;
        const id = s.closest('[data-row]').dataset.row; a.s[id] = a.s[id] || {};
        if (s.value) a.s[id][s.dataset.k] = s.value; else delete a.s[id][s.dataset.k];
        ctx.save(); draw();
      });
      draw();
    },
    check(ans) {
      const ev = cmEval(ans), notes = [];
      ev.rows.forEach(x => {
        if (!x.full) { notes.push({ ok: false, html: `${qt(x.r.t)}: заполните все три списка.` }); return; }
        if (x.k === 'bad' || x.k === 'warn') notes.push({ ok: x.k === 'warn' ? 'warn' : false, html: `${qt(x.r.t)} (${esc(x.r.q)}): ${esc(x.msg)}` });
      });
      if (!notes.length) notes.push({ ok: true, html: 'Все шесть сообщений дошли — каждому своим способом и вовремя.' });
      return {
        ok: ev.score >= 0.8 && ev.bad === 0, score: ev.score, notes,
        summary: `Дошло: ${ev.ok} из ${CR.length}, не дошло: ${ev.bad}.`,
        mentor: ev.rows.some(x => x.r.id === 'kassapro' && x.full && x.pf === 0) ? 'С вендором главное — срок: проверка 3 недели. Всё, что «перед пилотом», для него уже поздно.'
          : ev.rows.filter(x => (ans && ans.s && ans.s[x.r.id] || {}).c === 'c8').length >= 2 ? 'Общий чат кажется удобным, потому что он удобен вам. План коммуникаций пишут от читателя: где он бывает и что успевает прочитать.' : null
      };
    },
    explain: `${ui.table(['Кто', 'Что', 'Как часто', 'Каким способом'], CR.map(r => [esc(r.t), esc(CW.find(o => o.v === r.w[0]).t), esc(CF.find(o => o.v === r.f[0]).t), esc(CC.find(o => o.v === r.c[0]).t)]))}
      <p><b>Принцип один: писать от читателя.</b> Нине — коротко, словами и с вариантами (она раздражается от таблиц); Олегу Петровичу — наоборот, письмо с примером: он сверяет цифры. Павлу и Галине Ивановне правила не «сообщают», а проверяют на смене и в цехе. Кассирам — к запуску и в виде памятки: обучение — один день, новенькие каждый месяц. Вендору — по его регламенту и заранее: 3 недели проверки. Анне Павловне — через кассира, которому она доверяет.</p>
      <p><b>Что не входит в план.</b> «Полное ТЗ на 80 страниц» никому из этого списка не нужно, а «статус каждой задачи» — внутренняя кухня команды. Заинтересованным лицам — то, что касается их работы и их решений.</p>
      <p>Источники: BABOK v3 (планирование вовлечения заинтересованных лиц); матрица влияние/интерес; PRACTICES §2 — письмо-итог после каждой встречи.</p>`,
    refNote: 'Засчитывается наполовину: Нине и Павлу с Галиной Ивановной — «при каждом решении по его теме», Олегу Петровичу — «раз в неделю».',
    report: ans => cmEval(ans).rows.map(x => { const s = ((ans && ans.s) || {})[x.r.id] || {}; return `- ${x.r.t}: ${(CW.find(o => o.v === s.w) || {}).t || '—'} · ${(CF.find(o => o.v === s.f) || {}).t || '—'} · ${(CC.find(o => o.v === s.c) || {}).t || '—'} ${x.k === 'ok' ? '✓' : x.k === 'warn' ? '≈' : '✗'}`; }).join('\n')
  };

  // =====================================================================
  // Практика 5. Ответ Игорю: почему нельзя спрашивать только Нину
  // =====================================================================
  const WH_RUBRIC = [
    'Нина знает цели и решает, но не знает деталей чужой работы: чеки по 54-ФЗ (Олег Петрович), согласие и удаление данных по 152-ФЗ (юрист), выдачу в перчатках у кассира, план выпечки в 23:00 (Галина Ивановна), сертификацию у «КассаПро»',
    'Приводит конкретный пример «забытого» и что сломается в день запуска: нет чека «предоплата», Анна Павловна без смартфона, сертификация 3 недели, сводка без онлайн-оплат',
    'Говорит о цене ошибки: требование, найденное после запуска, обходится во много раз дороже вопроса сейчас — именно для этого и есть обследование за 600 тыс. ₽',
    'Не предлагает «опросить всех одинаково»: по матрице влияние/интерес — кого плотно, кого коротко, кому памятку; встречи короткие, время Нины бережём',
    'Решения по-прежнему за Ниной: остальные — источники требований и советники, противоречия между ними выносим ей с вариантами'
  ];
  const WH_REF = 'Игорь, Нина знает, чего хочет бизнес, и решает. Но она не знает, как по 54-ФЗ пробиваются два чека, как удалять данные по 152-ФЗ, как новенький кассир в перчатках ищет заказ и что «КассаПро» проверяет интеграцию 3 недели. Если не спросить Олега Петровича, в день запуска чек «предоплата» не пробьётся — это штраф. Если не спросить кассиров и не посмотреть на Анну Павловну, мы потеряем покупателей без смартфона — а это 40 % постоянных. Найти такое сейчас стоит час разговора, а после запуска — переделку и сорванное 1 марта; обследование за 600 тысяч ровно для этого. При этом я не предлагаю всех звать на все встречи: по матрице Нина, Олег Петрович, Павел и Галина Ивановна — регулярно, вендору и юристу — короткие письма к сроку, кассирам — наблюдение на смене и памятка. Решения остаются за Ниной: остальных мы спрашиваем, а противоречия выносим ей с вариантами.';
  const whyTask = {
    id: 'why', title: 'Ответьте Игорю: почему нельзя спрашивать только Нину',
    simple: howComm.simple,
    lead: ui.brief({
      situation: 'Игорь увидел ваш план встреч на три недели и хмурится: «Олег, кассиры, юрист, вендор… Нина — заказчик, она платит. Опросим её — и хватит. Каждая встреча — деньги из 600 тысяч на обследование».',
      todo: [
        'Напишите ответ Игорю: 5–8 предложений, от 300 символов. Он руководитель проекта — говорите про сроки, деньги и риски, а не про «так правильно».',
        'Нажмите «Проверить с Ксенией (Claude)» или «Сверить с эталоном самому» и честно отметьте раскрытые пункты. Засчитывается от 60 %.'
      ],
      lookTitle: 'На что опереться',
      look: 'Лаборатория дня запуска (что сломалось), матрица влияние/интерес (не всех одинаково), RACI (кто решает), план коммуникаций (кому как).'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: WH_REF, self: WH_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('stk-root');
      el.insertAdjacentHTML('beforeend', ui.say('igor', 'Нина — заказчик, она платит. Опросим её — и хватит. Зачем вам ещё восемь встреч? Объясните так, чтобы я мог это защитить, если Нина спросит, куда ушли деньги.'));
      const j = document.createElement('div'); j.style.marginTop = '12px'; el.appendChild(j);
      ui.justify(j, {
        id: 'stk-why', q: 'Почему нельзя спрашивать только Нину?',
        qPlain: 'Ответьте руководителю проекта, который хочет опрашивать только заказчицу, владелицу сети пекарен, чтобы сэкономить бюджет обследования. Объясните, чего она не знает и кто знает; приведите пример, что сломается в день запуска; скажите о цене позднего обнаружения; покажите, что встречи будут разными по формату и не все одинаково частыми; подчеркните, что решения остаются за владелицей.',
        rubric: WH_RUBRIC, reference: WH_REF, value: ctx.ans.j, readonly: ctx.readonly, minLen: 300,
        placeholder: 'Игорь, … (чего Нина не знает и кто знает; что сломается; сколько стоит; как не тратить лишнего; кто решает)',
        onChange: v => { ctx.ans.j = v; ctx.save(); ctx.decide('Ответ Игорю: почему не только Нина', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j);
      return {
        ok: s >= 0.6, score: s,
        summary: s ? `Оценка ответа: ${Math.round(s * 100)} %.` : 'Напишите ответ (от 300 символов) и проверьте его с Ксенией или сверьте с эталоном сами.',
        notes: s && s < 0.6 ? [{ ok: false, html: 'Игоря убедят не принципы, а риск и деньги: что именно сломается 1 марта и сколько будет стоить исправить это после запуска. И покажите, что встречи будут экономными.' }] : []
      };
    },
    explain: '<p>Сильный ответ говорит с Игорем на его языке: риски, сроки, деньги. «Нина не знает про второй чек по 54-ФЗ» — это не теория, это штраф 1 марта. «Сертификация 3 недели» — это сорванный пилот. Цена вопроса сейчас — час разговора; цена ошибки после запуска — переделка, о которой говорит правило «×10 на каждой стадии».</p><p>И вторая половина — экономия: не все одинаково. Матрица говорит, кого плотно, кого коротко, кому памятку; RACI — что решает по-прежнему Нина. Так аналитик защищает и бюджет, и качество требований.</p><p>Опора: BABOK v3 (анализ заинтересованных лиц), Вигерс и Битти — «Разработка требований к ПО» (у каждого класса пользователей — свои требования, представитель каждого класса должен быть услышан).</p>',
    report: ans => (ans && ans.j && ans.j.text) ? ans.j.text : '—'
  };

  // =====================================================================
  TR.stage({
    id: ID, act: 3, order: 210, slot: 'Пн 10:00', title: 'Кого спрашивать',
    when: 'понедельник, 19 октября, 10:00 · переговорная «Квант Софт», на доске — пустой круг',
    intro: [
      { who: 'igor', html: 'В договоре заказчик один — Нина Сергеевна. Её и спрашиваем. Обследование — 3 недели и 600 тысяч, каждая лишняя встреча — деньги.' },
      { who: 'ksenia', html: 'Нина знает, чего хочет бизнес. Но чеки по 54-ФЗ знает Олег Петрович, а как кассир в перчатках ищет заказ — только кассир. Сегодня найдём всех, кого коснётся предзаказ, разложим их на карте и решим, с кем как говорить и чьё «да» считается.' }
    ],
    facts: ['F-elder', 'F-54fz', 'F-pd', 'F-staff', 'F-peak', 'F-plan', 'F-1c', 'F-pay', 'F-batch'],
    glossary: [
      { term: 'Заинтересованное лицо', simple: 'Все, кого касается новый рецепт: пекарь, кассир, покупатель, поставщик муки, санэпидемстанция.', tech: 'Stakeholder — человек, группа или организация, которые влияют на изменение, зависят от него или считают, что зависят (BABOK v3). Не только заказчик: пользователи, регуляторы, владельцы смежных систем, эксплуатация, «негативные» заинтересованные.' },
      { term: 'Карта заинтересованных лиц', simple: 'Список всех, кого коснётся система, с тем, что каждому нужно и как с ним связаться.', tech: 'Артефакт анализа заинтересованных лиц: роль, интересы, влияние, интерес, контакт, источник требований. Ведётся с начала обследования и дополняется после каждой встречи.' },
      { term: 'Модель «луковицы»', simple: 'Круги вокруг системы: кто с ней работает руками, кто рядом, кто далеко — и кого легко забыть.', tech: 'Модель Иана Александера (A Taxonomy of Stakeholders, 2005): продукт → система (операторы, обслуживание) → окружающая система (выгодополучатели, смежные системы, покупатель) → широкое окружение (регуляторы, «негативные» заинтересованные, спонсоры).' },
      { term: '«Негативное» заинтересованное лицо', simple: 'Тот, кому от новой системы станет хуже: живая очередь, которая ждёт, пока кассир ищет предзаказ.', tech: 'Negative stakeholder — тот, кому система вредит или кто теряет от её появления. Его интересы — источник ограничений и нефункциональных требований.' },
      { term: 'Матрица влияние/интерес', simple: 'С невестой обсуждаем всё, ресторан держим довольным, гостям — приглашение, соседям — табличка.', tech: 'Power/interest grid (Обри Менделоу, 1991): «управлять плотно», «держать удовлетворёнными», «держать в курсе», «наблюдать». Определяет стратегию общения, а не важность потребностей. Положение меняется со временем.' },
      { term: 'RACI для решений', simple: 'По каждому спорному решению — кто решает, кто готовит, с кем советуемся до и кого предупреждаем после.', tech: 'R — готовит, A — решает и отвечает (ровно один), C — консультирует до решения, I — информируется после. Решение согласовано, когда его подтвердил A, письменно.' },
      { term: 'План коммуникаций', simple: 'Невесте — звонок каждый вечер, ресторану — смета письмом к сроку, бабушке — звонок от внука.', tech: 'Для каждого заинтересованного лица: какая информация, формат, канал, частота, ответственный (BABOK v3 — планирование вовлечения заинтересованных лиц). Строится по матрице влияние/интерес.' },
      { term: 'Мета-вопрос', simple: '«Кого ещё стоит спросить?» — в конце каждого разговора.', tech: 'Вопрос о самом процессе выявления (Гаус и Вайнберг, «Exploring Requirements»): «Кто ещё знает об этом больше?», «Что я должен был спросить, но не спросил?».' }
    ],
    outro: 'Заинтересованные лица — не «заказчик», а все, кого коснётся система: пользователи разных ролей, те, кто решает и платит, закон, эксплуатация, смежные системы и те, кому станет хуже. Найти их помогают контрольный список, луковица и вопрос «кого ещё спросить?». Матрица влияние/интерес подсказывает, сколько сил тратить на каждого, RACI — чьё «да» считается, план коммуникаций — кому, что, как часто и каким способом. Завтра — искусство вопроса: что спрашивать у тех, кого нашли.',
    tasks: [howWho, howGrid, howComm, findTask, gridTask, decideTask, commTask, whyTask]
  });
})();
