/* Неделя 1, четверг 10:00: модели жизненного цикла и договор.
   Теория (живая): каскад и пять советов Ройса, V-модель «стадия ↔ своя проверка»; ярусы или черновик (инкременты и итерации),
   спираль Боэма (витки по рискам), поток заявок; фиксированная цена против оплаты по факту.
   Практика: лаборатория «Нина передумала на N-м месяце» в пяти моделях, подбор модели под шесть проектов,
   договор «Колоса» по частям, объяснение для Игоря. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;

  if (!document.getElementById('mdl-css')) document.head.insertAdjacentHTML('beforeend', `<style id="mdl-css">
    .mdl-root, .mdl-root .stack { min-width: 0; }
    .mdl-root .stack > * { min-width: 0; }
    .mdl-root .seg button { white-space: normal; text-align: left; }
    .mdl-box { display: grid; gap: 12px; padding: 14px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); min-width: 0; }
    .mdl-box > * { min-width: 0; }
    .mdl-set { display: grid; grid-template-columns: minmax(0, 170px) minmax(0, 1fr); gap: 8px 14px; align-items: center; }
    .mdl-set > * { min-width: 0; }
    .mdl-set > .lbl { font-size: 13.5px; color: var(--text-2); }
    .mdl-set > .seg { justify-self: start; max-width: 100%; }
    .mdl-range { width: 100%; margin: 4px 0; accent-color: var(--accent); }
    .mdl-stairs { display: grid; gap: 6px; }
    .mdl-st { margin-left: calc(var(--i) * min(8%, 52px)); max-width: 380px; border: 1px solid var(--border-strong); border-radius: 10px; padding: 8px 12px; background: var(--surface-2); display: grid; gap: 4px; min-width: 0; }
    .mdl-st b { font: 600 14px/1.3 var(--f-brand); }
    .mdl-st .o { font-size: 12px; color: var(--text-muted); }
    .mdl-st .chip { font-size: 11.5px; padding: 1px 8px; white-space: normal; }
    .mdl-st.cur { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent) inset; background: var(--accent-soft); }
    .mdl-st.done { opacity: .72; }
    .mdl-st.back { border-color: var(--bad); background: var(--bad-soft); opacity: 1; }
    .mdl-st.cur.back { box-shadow: 0 0 0 1px var(--bad) inset; }
    .mdl-loop { margin-left: calc(var(--i) * min(8%, 52px)); font-size: 12px; color: var(--info); }
    .mdl-pilot, .mdl-backline { border: 1px dashed var(--info); border-radius: 10px; padding: 8px 12px; font-size: 13px; background: var(--info-soft); }
    .mdl-backline { border-color: var(--bad); background: var(--bad-soft); }
    .mdl-vbox { cursor: pointer; }
    .mdl-vbox:focus-visible rect { stroke: var(--accent); stroke-width: 2.4; }
    .mdl-mgrid { display: grid; grid-template-columns: minmax(0, 170px) repeat(6, minmax(0, 1fr)); gap: 3px 4px; font-size: 12.5px; align-items: center; }
    .mdl-mgrid .h { font: 600 11px/1.2 var(--f-mono); color: var(--text-muted); text-align: center; }
    .mdl-mgrid .c { height: 16px; border-radius: 4px; background: var(--surface-2); }
    .mdl-mgrid .c.on { background: var(--info); }
    .mdl-mgrid .c.on.late { background: var(--bad); }
    .mdl-mgrid .c.on.early { background: var(--ok); }
    .mdl-cakes { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
    .mdl-cake { display: grid; gap: 6px; align-content: start; border: 1px solid var(--border); border-radius: 12px; padding: 10px 12px; background: var(--surface); min-width: 0; }
    .mdl-cake svg { width: 100%; max-width: 170px; justify-self: center; display: block; }
    .mdl-cake .see { font-size: 13px; color: var(--text-2); }
    .mdl-risk { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 6px 10px; align-items: center; padding: 8px 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); }
    .mdl-risk.off { border-color: color-mix(in srgb, var(--ok) 45%, var(--border)); }
    .mdl-risk .meter { grid-column: 1 / -1; }
    .mdl-risk .pi { font: 12px/1.3 var(--f-mono); color: var(--text-muted); }
    .mdl-days { display: grid; grid-template-columns: repeat(14, minmax(0, 1fr)); gap: 2px; }
    .mdl-days span { height: 26px; border-radius: 4px; background: var(--surface-2); font: 10.5px/26px var(--f-mono); text-align: center; color: var(--text-muted); min-width: 0; overflow: hidden; }
    .mdl-days span.arr { background: var(--bad-soft); box-shadow: inset 0 0 0 1.5px var(--bad); color: var(--bad); }
    .mdl-days span.wait { background: var(--warn-soft); color: var(--warn); }
    .mdl-days span.fix { background: var(--ok-soft); box-shadow: inset 0 0 0 1.5px var(--ok); color: var(--ok); }
    .mdl-scale { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 8px; align-items: center; font-size: 12.5px; }
    .mdl-scale .bar { display: flex; height: 14px; border-radius: 7px; overflow: hidden; background: var(--surface-3); }
    .mdl-scale .bar i { display: block; height: 100%; }
    .mdl-gantt { display: grid; gap: 4px; }
    .mdl-row { display: grid; grid-template-columns: 170px minmax(0, 1fr); gap: 8px; align-items: center; font-size: 12.5px; }
    .mdl-row > * { min-width: 0; }
    .mdl-row .nm { overflow-wrap: anywhere; line-height: 1.25; color: var(--text-2); }
    .mdl-row .nm.chg { color: var(--bad); font-weight: 600; }
    .mdl-row .nm.see { color: var(--ok); font-weight: 600; }
    .mdl-track { position: relative; height: 18px; background: var(--surface-2); border-radius: 5px; overflow: hidden; }
    .mdl-bar { position: absolute; top: 3px; height: 12px; border-radius: 3px; min-width: 2px; }
    .mdl-bar.spr { box-shadow: inset -2px 0 0 var(--surface-2); }
    .mdl-bar.redo { background: repeating-linear-gradient(45deg, var(--bad) 0 4px, var(--bad-soft) 4px 8px); }
    .mdl-bar.new { background: var(--accent); }
    .mdl-cl { position: absolute; top: 0; bottom: 0; width: 2px; margin-left: -1px; background: var(--bad); }
    .mdl-dm { position: absolute; top: 3px; width: 12px; height: 12px; margin-left: -6px; border-radius: 50%; background: var(--ok); box-shadow: 0 0 0 2px var(--surface-2); }
    .mdl-dm.proto { background: var(--warn); border-radius: 2px; transform: rotate(45deg); width: 10px; height: 10px; top: 4px; margin-left: -5px; }
    .mdl-axis { position: relative; height: 16px; font: 10.5px/16px var(--f-mono); color: var(--text-muted); }
    .mdl-axis span { position: absolute; transform: translateX(-50%); white-space: nowrap; }
    .mdl-legend { display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: 12px; color: var(--text-2); }
    .mdl-legend i { display: inline-block; width: 16px; height: 10px; border-radius: 3px; margin-right: 5px; vertical-align: -1px; }
    .mdl-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
    .mdl-stats .v { font-size: 18px; overflow-wrap: anywhere; }
    .mdl-cmp { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; }
    .mdl-cmp button.stat { text-align: left; cursor: pointer; font: inherit; color: inherit; }
    .mdl-cmp button.stat:disabled { cursor: default; opacity: 1; }
    .mdl-cmp .stat.cur { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent); }
    .mdl-cmp .v { font-size: 15px; }
    @media (max-width: 640px) {
      .mdl-set { grid-template-columns: minmax(0, 1fr); gap: 4px; }
      .mdl-set > .lbl { margin-top: 8px; }
      .mdl-row { grid-template-columns: 96px minmax(0, 1fr); font-size: 11.5px; gap: 6px; }
      .mdl-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .mdl-cakes { grid-template-columns: minmax(0, 1fr); }
      .mdl-mgrid { grid-template-columns: minmax(0, 96px) repeat(6, minmax(0, 1fr)); font-size: 11.5px; }
      .mdl-scale { grid-template-columns: minmax(0, 1fr); }
    }
  </style>`);

  // ---------- общие помощники ----------
  const quizRef = QS => QS.map(cfg => cfg.options.map((o, i) => o.ok ? i : -1).filter(i => i >= 0));
  const plainT = s => String(s || '').replace(/<[^>]+>/g, '');
  const num = x => (Math.round(x * 10) / 10).toLocaleString('ru-RU');
  const ned = x => num(x) + ' ' + (Number.isInteger(x) ? TR.plural(x, 'неделя', 'недели', 'недель') : 'недели');
  const lockAll = (el, ro) => { if (ro) TR.$$('[data-seg] button, input[type=range], button[data-pick]', el).forEach(b => { b.disabled = true; }); };

  // =====================================================================
  // Теория 1. Каскад и V-модель (соседний пример: склад мукомольного комбината)
  // =====================================================================
  const ST5 = [
    { t: 'Требования', o: 'выход: подписанное ТЗ' },
    { t: 'Проектирование', o: 'выход: технический проект' },
    { t: 'Разработка', o: 'выход: код' },
    { t: 'Тестирование', o: 'выход: протоколы испытаний' },
    { t: 'Внедрение', o: 'выход: система у пользователей' }
  ];
  const CASC = {
    plain: [
      { cur: 0, note: '<b>1. Требования.</b> Аналитик собирает требования склада и пишет техническое задание (ТЗ). Заказчик его подписывает — дальше ТЗ «заморожено». Стадия закончилась, к ней не возвращаются.' },
      { cur: 1, note: '<b>2. Проектирование.</b> По ТЗ проектируют систему: экраны, данные, связь с бухгалтерией. Вопросы к ТЗ теперь неудобны — оно подписано.' },
      { cur: 2, note: '<b>3. Разработка.</b> Программисты четыре месяца пишут код по проекту. Заказчик всё это время не видит ничего работающего — только отчёты «готово на 60 %».' },
      { cur: 3, bad: true, note: '<b>4. Тестирование.</b> Систему впервые проверяют целиком — и находят: склад считает муку мешками по 50 кг, а в ТЗ записали килограммы. Ошибка родилась на первой ступени, а нашли её на четвёртой.' },
      { cur: 3, back: [3, 0], bad: true, note: '<b>Возврат.</b> Чтобы исправить, надо подняться на три ступени: поправить и заново подписать ТЗ, переделать проект, переписать код, снова протестировать. Вода в каскаде вверх не течёт — подниматься дорого. Это та самая «соль вместо сахара» из вчерашней тренировки.' },
      { cur: 4, note: '<b>5. Внедрение.</b> Через полгода с лишним кладовщики впервые работают с системой — и только теперь замечают, чего не хватает. Новые пожелания — во вторую версию.' }
    ],
    royce: [
      { cur: 0, ex: ['pre'], note: '<b>Ройс, 1970. Совет 1: сначала — черновой проект.</b> Ещё до подробного анализа набросать, как будет устроена программа: так сразу видно, что вообще выполнимо и где узкие места.' },
      { cur: 1, ex: ['pre', 'docs'], note: '<b>Совет 2: документировать.</b> Ройс был за подробные документы: без них, писал он, руководитель не видит, что происходит, а новый человек не разберётся. Каскад и документы — не враги здравого смысла.' },
      { cur: 2, ex: ['pre', 'docs', 'twice'], note: '<b>Совет 3: сделать дважды.</b> Первую, пилотную версию сделать быстро — примерно за треть срока — и проверить на ней самые рискованные решения. Вторую — уже настоящую. По сути это первая итерация.' },
      { cur: 3, ex: ['pre', 'docs', 'twice', 'test'], note: '<b>Совет 4: планировать и контролировать тестирование.</b> Тестирование — самая дорогая стадия: к ней готовятся заранее, а проверяют специалисты, не авторы кода.' },
      { cur: 3, ex: ['pre', 'docs', 'twice', 'test', 'cust'], note: '<b>Совет 5: вовлекать заказчика</b> — не только в начале и в конце, а формально и постоянно, на нескольких точках до сдачи.' },
      { cur: 4, ok: true, ex: ['pre', 'docs', 'twice', 'test', 'cust', 'loops'], note: '<b>Итог.</b> Про лестницу без возвратов сам Ройс написал: идея верная, но в таком виде она «рискованна и напрашивается на провал». Его вариант — с возвратами между соседними стадиями, пилотной версией и заказчиком внутри процесса. Слова «каскад» (waterfall) в статье нет: название появилось позже, а картинку взяли из начала статьи, не дочитав до советов.' }
    ]
  };
  function stairsHTML(step, mode) {
    const ex = new Set(step.ex || []), back = step.back;
    let h = '<div class="mdl-stairs">';
    ST5.forEach((s, i) => {
      if (mode === 'royce' && ex.has('loops') && i > 0) h += `<div class="mdl-loop" style="--i:${i}">↕ можно вернуться на соседнюю стадию</div>`;
      const cls = [];
      if (i === step.cur) cls.push('cur'); else if (i < step.cur) cls.push('done');
      if (back && i >= back[1] && i <= back[0]) cls.push('back');
      const chips = [];
      if (mode === 'royce') {
        if (ex.has('pre') && i === 0) chips.push('<span class="chip info">+ черновой проект заранее</span>');
        if (ex.has('docs')) chips.push('<span class="chip">📄 документ</span>');
        if (ex.has('test') && i === 3) chips.push('<span class="chip warn">план тестов готов заранее</span>');
        if (ex.has('cust') && (i === 0 || i === 1 || i === 3)) chips.push('<span class="chip ok">👤 заказчик участвует</span>');
      }
      h += `<div class="mdl-st ${cls.join(' ')}" style="--i:${i}"><b>${i + 1}. ${s.t}</b><span class="o">${s.o}</span>${chips.length ? `<div class="row" style="gap:4px">${chips.join('')}</div>` : ''}</div>`;
    });
    if (mode === 'royce' && ex.has('twice')) h += '<div class="mdl-pilot">🔁 <b>Сделать дважды.</b> Сначала — пилотная версия примерно за треть срока: на ней проверяют самые рискованные решения. Потом — настоящая.</div>';
    if (back) h += `<div class="mdl-backline">↩ Возврат со стадии «${ST5[back[0]].t}» на «${ST5[back[1]].t}»: ${back[0] - back[1]} ступени вверх — и все их проходить заново</div>`;
    return h + '</div>';
  }
  function drawCasc(pane) {
    const st = { mode: 'plain', k: 0 };
    pane.innerHTML = `<div class="stack">
      <div class="row"><span class="small dim">Вариант:</span>${ui.seg('cm', [{ v: 'plain', t: 'Как каскад обычно рисуют' }, { v: 'royce', t: 'Что на самом деле предлагал Ройс' }], st.mode, 'accent')}</div>
      <div class="row"><button type="button" class="btn sm primary" data-cs="next">Шаг →</button><button type="button" class="btn sm ghost" data-cs="reset">⟲ Сначала</button><span class="small dim tnum" data-cn></span></div>
      <div data-stairs></div>
      <div data-cnote></div>
    </div>`;
    function draw() {
      const steps = CASC[st.mode], step = steps[st.k];
      TR.$('[data-stairs]', pane).innerHTML = stairsHTML(step, st.mode);
      TR.$('[data-cnote]', pane).innerHTML = ui.note(step.bad ? 'bad' : step.ok ? 'ok' : '', `Шаг ${st.k + 1} из ${steps.length}`, step.note);
      TR.$('[data-cn]', pane).textContent = `${st.k + 1} / ${steps.length}`;
      TR.$('[data-cs="next"]', pane).disabled = st.k >= steps.length - 1;
    }
    ui.onSeg(pane, (n, v) => { if (n === 'cm') { st.mode = v; st.k = 0; draw(); } });
    TR.on(pane, 'click', '[data-cs]', (e, b) => { if (b.dataset.cs === 'next') st.k = Math.min(st.k + 1, CASC[st.mode].length - 1); else st.k = 0; draw(); });
    draw();
  }

  const V_L = ['Требования\nзаказчика', 'Требования\nк системе', 'Архитектура', 'Проект\nмодулей'];
  const V_R = ['Приёмочные\nиспытания', 'Системные\nтесты', 'Интеграционные\nтесты', 'Модульные\nтесты'];
  const V_INFO = [
    { l: 'Требования заказчика', lw: 'что нужно складу и зачем: сценарии кладовщика и бухгалтера', r: 'Приёмочные испытания', what: 'решает ли система задачу заказчика — в его сценариях и его словами', who: 'аналитик и заказчик', ex: '«Кладовщик принимает машину муки — 20 мешков — и через минуту видит новый остаток».' },
    { l: 'Требования к системе', lw: 'что именно делает система: функции, правила, ограничения', r: 'Системные тесты', what: 'вся система целиком выполняет каждое требование', who: 'аналитик и тестировщик', ex: '«При приёмке в мешках остаток пересчитывается в килограммы: 1 мешок = 50 кг».' },
    { l: 'Архитектура', lw: 'из каких частей система и как они связаны с бухгалтерией', r: 'Интеграционные тесты', what: 'части правильно говорят друг с другом и с внешними системами', who: 'архитектор, разработчики, тестировщик', ex: '«Склад раз в сутки передаёт остатки в бухгалтерию, и цифры сходятся».' },
    { l: 'Проект модулей', lw: 'как устроен каждый кусочек программы', r: 'Модульные тесты', what: 'каждый кусочек кода по отдельности делает то, что задумано', who: 'разработчики', ex: '«Функция пересчёта: 3 мешка → 150 кг, 0 мешков → 0 кг».' }
  ];
  function vSvg(sel) {
    const W = 372, BW = 126, BH = 38, OFF = 14, DY = 50;
    const lx = i => 6 + i * OFF, rx = i => W - 6 - BW - i * OFF, yy = i => 6 + i * DY;
    const cX = (W - BW) / 2, cY = yy(4), H = cY + BH + 8;
    const txt = (x, y, label, on) => { const ls = label.split('\n'); return ls.map((ln, j) => `<text x="${x}" y="${y + (j - (ls.length - 1) / 2) * 14 + 4}" text-anchor="middle" style="fill:var(--text);font-size:12px;${on ? 'font-weight:600' : ''}">${esc(ln)}</text>`).join(''); };
    const box = (x, y, label, on, k, side) => `<g class="mdl-vbox" data-vp="${k}" tabindex="0" role="button" aria-label="${esc(label.replace('\n', ' '))}"><rect x="${x}" y="${y}" width="${BW}" height="${BH}" rx="8" style="fill:${on ? (side === 'r' ? 'var(--ok-soft)' : 'var(--accent-soft)') : 'var(--surface-2)'};stroke:${on ? (side === 'r' ? 'var(--ok)' : 'var(--accent)') : 'var(--border-strong)'};stroke-width:${on ? 2 : 1}"/>${txt(x + BW / 2, y + BH / 2, label, on)}</g>`;
    const ln = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:var(--text-muted);stroke-width:1.4" marker-end="url(#mdlv-a)"/>`;
    let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:480px;display:block;margin:0 auto" role="img" aria-label="V-модель: стадии разработки слева и их проверки справа">`;
    s += '<defs><marker id="mdlv-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" style="fill:var(--text-muted)"/></marker></defs>';
    for (let i = 0; i < 3; i++) s += ln(lx(i) + BW / 2, yy(i) + BH, lx(i + 1) + BW / 2, yy(i + 1));
    s += ln(lx(3) + BW / 2, yy(3) + BH, cX + 26, cY);
    s += ln(cX + BW - 26, cY, rx(3) + BW / 2, yy(3) + BH);
    for (let i = 3; i > 0; i--) s += ln(rx(i) + BW / 2, yy(i), rx(i - 1) + BW / 2, yy(i - 1) + BH);
    for (let i = 0; i < 4; i++) { const on = sel === i, y = yy(i) + BH / 2; s += `<line x1="${lx(i) + BW + 3}" y1="${y}" x2="${rx(i) - 3}" y2="${y}" style="stroke:${on ? 'var(--accent)' : 'var(--border-strong)'};stroke-width:${on ? 2.2 : 1.2};stroke-dasharray:5 4"/>`; }
    for (let i = 0; i < 4; i++) s += box(lx(i), yy(i), V_L[i], sel === i, i, 'l') + box(rx(i), yy(i), V_R[i], sel === i, i, 'r');
    s += box(cX, cY, 'Код', sel === 4, 4, 'l');
    return s + '</svg>';
  }
  function vInfo(sel) {
    if (sel === 4) return ui.note('', 'Код — дно буквы V', 'Здесь спуск от общего к частному заканчивается и начинается подъём: проверки идут снизу вверх — от мелких кусочков кода к приёмке заказчиком.');
    const v = V_INFO[sel];
    return `<div class="grid2">
      <div class="card"><div class="eyebrow">Стадия слева</div><b>${v.l}</b><div class="small muted">Решаем: ${v.lw}.</div></div>
      <div class="card"><div class="eyebrow">Её проверка справа</div><b>${v.r}</b><div class="small muted">Проверяем: ${v.what}. Кто: ${v.who}.</div></div>
    </div>${ui.note('', 'Пример с комбината', v.ex)}`;
  }
  const V_TL = {
    late: [['Пишем требования', [1], ''], ['План приёмки', [6], 'late'], ['План системных тестов', [5], 'late'], ['План интеграционных тестов', [5], 'late']],
    early: [['Пишем требования', [1], ''], ['План приёмки', [1], 'early'], ['План системных тестов', [2], 'early'], ['План интеграционных тестов', [3], 'early']]
  };
  function vTimeline(when) {
    const rows = V_TL[when];
    let h = '<div class="mdl-mgrid"><span class="small dim">месяц</span>' + [1, 2, 3, 4, 5, 6].map(m => `<span class="h">${m}</span>`).join('');
    rows.forEach(([t, ms, k]) => { h += `<span>${t}</span>` + [1, 2, 3, 4, 5, 6].map(m => `<span class="c ${ms.includes(m) ? 'on ' + k : ''}"></span>`).join(''); });
    h += '</div>';
    h += when === 'late'
      ? ui.note('bad', 'Проверку вспоминают в конце', 'Вопрос «а как мы это проверим?» впервые звучит на 5–6-м месяце. Неоднозначность «мешки или килограммы» к этому времени уже в коде.')
      : ui.note('ok', 'Проверку продумывают сразу', 'Лера пишет приёмочный сценарий уже в 1-й месяц — и сразу спрашивает: «В чём кладовщик считает — в мешках или в килограммах?» Ошибку в ТЗ нашли до того, как её запрограммировали. Но заметьте: V-модель делает проверку ранней, а не проект гибче — поменять требования на 4-м месяце в ней так же дорого, как в каскаде.');
    return h;
  }
  function drawV(pane) {
    const st = { sel: 0, when: 'early' };
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Нажмите на любую стадию слева или справа — подсветится её пара. Слева спускаемся от общего к частному, справа поднимаемся от мелких проверок к приёмке.</p>
      <div data-v></div>
      <div data-vinfo></div>
      <div class="mdl-box"><div class="row"><span class="small dim">Когда пишем план проверки:</span>${ui.seg('vw', [{ v: 'late', t: 'в конце, как в простом каскаде' }, { v: 'early', t: 'сразу на своей стадии (V-модель)' }], st.when, 'accent')}</div><div class="stack" data-vtl></div></div>
    </div>`;
    function draw() { TR.$('[data-v]', pane).innerHTML = vSvg(st.sel); TR.$('[data-vinfo]', pane).innerHTML = vInfo(st.sel); }
    function drawTl() { TR.$('[data-vtl]', pane).innerHTML = vTimeline(st.when); }
    TR.on(pane, 'click', '[data-vp]', (e, g) => { st.sel = +g.dataset.vp; draw(); });
    pane.addEventListener('keydown', e => { const g = e.target.closest && e.target.closest('[data-vp]'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); st.sel = +g.dataset.vp; draw(); const n = TR.$(`[data-vp="${st.sel}"]`, pane); n && n.focus(); } });
    ui.onSeg(pane, (n, v) => { if (n === 'vw') { st.when = v; drawTl(); } });
    draw(); drawTl();
  }

  const howWaterfall = {
    id: 'how-waterfall', covers: ['lab'], title: 'Как это работает: каскад и V-модель', free: true, noReset: true,
    simple: {
      icon: '🎂',
      plain: 'Каскад — делать всё по очереди и по одному разу: сначала полностью договорились, потом полностью нарисовали, потом сделали, проверили и отдали. Вернуться назад можно, но дорого.',
      analogy: 'Свадебный торт по чертежу: вкус, ярусы и надпись согласовали за месяц, кондитер закупил продукты и испёк. Если за день до свадьбы невеста скажет «давайте не три яруса, а пять» — переделывать почти всё. Зато если ничего не меняется, это самый понятный и спокойный путь.',
      tech: '<b>Каскадная модель</b> (waterfall) — стадии жизненного цикла идут строго друг за другом, выход одной — вход следующей, работающий результат заказчик видит в конце. Картинку-лестницу нарисовал Уинстон Ройс в статье 1970 года — и там же предупредил, что в чистом виде она рискованна. <b>V-модель</b> — тот же порядок стадий, но каждой стадии слева в пару поставлен свой уровень проверки справа, и проверку планируют сразу.'
    },
    lead: ui.brief({
      situation: 'Соседний пример, не «Колос»: «Квант Софт» делает программу учёта склада для мукомольного комбината — поставщика муки. ТЗ подписано, меняться не должно. Посмотрим, как такой проект идёт каскадом, что на самом деле советовал Ройс и чем от каскада отличается V-модель.',
      todo: [
        'Вкладка «Каскад и Ройс»: в варианте «Как каскад обычно рисуют» нажимайте «Шаг →» и читайте пояснение под лестницей. Где родилась ошибка и где её нашли?',
        'Переключитесь на «Что на самом деле предлагал Ройс» и пройдите пять его советов. Что из них похоже на итерации?',
        'Вкладка «V-модель»: нажмите каждую стадию слева и посмотрите её пару справа. Потом переключите «Когда пишем план проверки» и сравните две строки месяцев.'
      ],
      look: 'Лестница — стадии каскада сверху вниз. Зелёная рамка — где мы сейчас, красная — путь назад при ошибке. На V-схеме пунктир соединяет стадию с её проверкой; сетка ниже — в каком месяце пишем каждый документ.'
    }),
    render(el) {
      el.classList.add('mdl-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [{ id: 'casc', t: 'Каскад и Ройс', render: drawCasc }, { id: 'v', t: 'V-модель', render: drawV }], 'casc');
      el.insertAdjacentHTML('beforeend', `<div style="margin-top:12px">${ui.note('info', 'Позиция аналитика', 'В каскаде главный артефакт аналитика — ТЗ, которое подписывают и «замораживают»; ошибка в нём стоит дороже всего. В V-модели аналитик ещё и вместе с тестировщиком готовит сценарии приёмки — уже на стадии требований. Вопрос «как мы это проверим?» — лучший детектор размытых формулировок.')}</div>`);
    }
  };

  // =====================================================================
  // Теория 2. Инкременты, итерации, спираль, поток (соседние примеры: торт к юбилею, «умная» печь, сайт кофеен)
  // =====================================================================
  const CAKE = [
    { id: 'casc', t: 'Каскад', w: [
      { s: ['plan', 'plan', 'plan', 'plan'], see: 'Чертёж на бумаге: все ярусы, крем, свечи. Попробовать нечего.' },
      { s: ['hidden', 'hidden', 'hidden', 'hidden'], see: 'Торт на кухне, показывать нечего: «ждите».' },
      { s: ['hidden', 'hidden', 'hidden', 'hidden'], see: 'Всё ещё на кухне. Передумать про верхний ярус поздно — бисквит испечён.' },
      { s: ['done', 'done', 'done', 'done'], see: 'Готовый торт целиком — в день праздника. Понравился ли, узнаём только сейчас.' }] },
    { id: 'inc', t: 'Инкременты: по ярусу', w: [
      { s: ['done', 'none', 'none', 'none'], see: 'Нижний ярус полностью готов и украшен — его уже можно попробовать.' },
      { s: ['done', 'done', 'none', 'none'], see: 'Два яруса готовы. Каждый — законченный кусок.' },
      { s: ['done', 'done', 'done', 'none'], see: 'Три яруса. Поменять форму торта трудно: нижние уже готовы.' },
      { s: ['done', 'done', 'done', 'done'], see: 'Свечи сверху — готово. Торт собран частями по плану, составленному в начале.' }] },
    { id: 'iter', t: 'Итерации: черновик целиком', w: [
      { s: ['sponge', 'sponge', 'sponge', 'none'], see: 'Весь торт из голого бисквита: видны форма и размер. Заказчица: «Верхний ярус бы поменьше».' },
      { s: ['cream', 'cream', 'cream', 'none'], slim: true, see: 'Весь торт в креме, верх уже уменьшили. «А крем — голубой, под цвет зала».' },
      { s: ['done', 'done', 'done', 'none'], slim: true, blue: true, see: 'Украсили, крем голубой. Каждую неделю — торт целиком и всё лучше.' },
      { s: ['done', 'done', 'done', 'done'], slim: true, blue: true, see: 'Свечи и последние правки. Торт рос целиком и менялся по отзывам.' }] }
  ];
  function cakeSvg(w, label) {
    const st = w.s, T = [{ x: 20, w: 100, y: 80, h: 28 }, { x: 32, w: 76, y: 54, h: 26 }, w.slim ? { x: 48, w: 44, y: 32, h: 22 } : { x: 40, w: 60, y: 32, h: 22 }];
    let s = `<svg viewBox="0 0 140 122" role="img" aria-label="${esc(label)}"><line x1="8" y1="109" x2="132" y2="109" style="stroke:var(--border-strong);stroke-width:2;stroke-linecap:round"/>`;
    if (st.every(x => x === 'hidden')) return s + '<rect x="30" y="38" width="80" height="64" rx="8" style="fill:var(--surface-3);stroke:var(--border-strong)"/><text x="70" y="70" text-anchor="middle" style="font-size:20px">🔒</text><text x="70" y="92" text-anchor="middle" style="fill:var(--text-2);font-size:11px">на кухне</text></svg>';
    T.forEach((t, i) => {
      const k = st[i]; if (k === 'none') return;
      let fill = 'none', stroke = 'var(--text-muted)', dash = '';
      if (k === 'plan') dash = 'stroke-dasharray:4 3;';
      if (k === 'sponge') { fill = 'color-mix(in srgb, var(--warn) 32%, var(--surface))'; stroke = 'var(--warn)'; }
      if (k === 'cream' || k === 'done') { fill = w.blue ? 'var(--info-soft)' : 'var(--surface-3)'; stroke = w.blue ? 'var(--info)' : 'var(--text-2)'; }
      s += `<rect x="${t.x}" y="${t.y}" width="${t.w}" height="${t.h}" rx="4" style="fill:${fill};stroke:${stroke};stroke-width:1.5;${dash}"/>`;
      if (k === 'done') {
        const n = Math.max(3, Math.round(t.w / 14));
        for (let j = 0; j < n; j++) s += `<circle cx="${(t.x + (j + .5) * t.w / n).toFixed(1)}" cy="${t.y + 3}" r="2.6" style="fill:var(--pink)"/>`;
        const q = (t.w - 6) / 4;
        s += `<path d="M${t.x + 3} ${t.y + t.h - 8} q ${(q / 2).toFixed(1)} -5 ${q.toFixed(1)} 0 t ${q.toFixed(1)} 0 t ${q.toFixed(1)} 0 t ${q.toFixed(1)} 0" style="fill:none;stroke:var(--accent);stroke-width:1.4"/>`;
      }
    });
    const tp = st[3], top = T[2];
    if (tp !== 'none' && tp !== 'hidden') {
      const cx = top.x + top.w / 2;
      [-10, 0, 10].forEach(dx => {
        s += `<rect x="${cx + dx - 2}" y="${top.y - 14}" width="4" height="14" rx="1" style="fill:${tp === 'plan' ? 'none' : 'var(--violet)'};stroke:var(--violet);${tp === 'plan' ? 'stroke-dasharray:2 2;' : ''}"/>`;
        if (tp !== 'plan') s += `<circle cx="${cx + dx}" cy="${top.y - 17}" r="2.4" style="fill:var(--warn)"/>`;
      });
    }
    return s + '</svg>';
  }
  function drawCake(pane) {
    const st = { wk: 1, open: false };
    pane.innerHTML = `<div class="stack">
      <label class="field"><span>Заказчица заходит в кондитерскую: <b data-wk></b></span><input type="range" class="mdl-range" min="1" max="4" step="1" value="1" data-cw aria-label="Неделя"></label>
      <div class="mdl-cakes" data-cakes></div>
      <div data-rev></div>
    </div>`;
    function draw() {
      TR.$('[data-wk]', pane).textContent = `неделя ${st.wk} из 4`;
      TR.$('[data-cakes]', pane).innerHTML = CAKE.map(c => { const w = c.w[st.wk - 1]; return `<div class="mdl-cake"><b>${c.t}</b>${cakeSvg(w, c.t + ', неделя ' + st.wk)}<div class="see">${w.see}</div></div>`; }).join('');
      TR.$('[data-rev]', pane).innerHTML = st.open
        ? ui.note('ok', 'А Agile — это какое?', 'И то и другое сразу. Каждые 2 недели — законченный работающий кусок (инкремент), а по отзывам заказчика уже сделанное улучшают (итерация). Поэтому Scrum и похожие подходы называют <b>итеративно-инкрементными</b>. И заметьте: у итераций уже на первой неделе есть «торт целиком» — заказчица может оценить главное.')
        : '<button type="button" class="btn sm" data-ag style="white-space:normal;text-align:left">А Scrum и вообще Agile — это ярусами или черновиком? Подумайте и откройте ответ</button>';
    }
    TR.$('[data-cw]', pane).addEventListener('input', e => { st.wk = +e.target.value; draw(); });
    TR.on(pane, 'click', '[data-ag]', () => { st.open = true; draw(); });
    draw();
  }

  const RISKS = [
    { id: 'sensor', t: 'Датчик температуры врёт при 250 °C', p: 3, i: 3, fix: 'стенд с датчиком в настоящей печи' },
    { id: 'cert', t: 'Печь не пройдёт сертификацию безопасности', p: 2, i: 3, fix: 'разбор чернового проекта с лабораторией' },
    { id: 'ui', t: 'Пекарь не справится с экраном в перчатках', p: 2, i: 2, fix: 'бумажный прототип экрана на смене' },
    { id: 'color', t: 'Директору не понравится цвет корпуса', p: 3, i: 1, fix: 'показать три картинки' }
  ];
  const RISK0 = RISKS.reduce((s, r) => s + r.p * r.i, 0);
  function spiralSvg(turn) {
    const W = 300, H = 236, cx = 150, cy = 118, th0 = -3 * Math.PI / 4, k = 88 / (6 * Math.PI);
    let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:440px;display:block;margin:0 auto" role="img" aria-label="Спиральная модель: витки по четырём четвертям">`;
    s += `<line x1="${cx}" y1="18" x2="${cx}" y2="${H - 18}" style="stroke:var(--border-strong);stroke-dasharray:3 4"/><line x1="10" y1="${cy}" x2="${W - 10}" y2="${cy}" style="stroke:var(--border-strong);stroke-dasharray:3 4"/>`;
    [[6, 12, 'start', '1. Цели и варианты'], [W - 6, 12, 'end', '2. Риски: найти и снять'], [W - 6, H - 4, 'end', '3. Сделать и проверить'], [6, H - 4, 'start', '4. План витка']].forEach(([x, y, a, t], i) => {
      s += `<text x="${x}" y="${y}" text-anchor="${a}" style="fill:${i === 1 ? 'var(--accent)' : 'var(--text-2)'};font-size:11.5px;font-weight:600">${t}</text>`;
    });
    for (let j = 0; j < 3; j++) {
      const pts = [];
      for (let a = 0; a <= 2 * Math.PI + 0.001; a += 0.08) { const th = th0 + 2 * Math.PI * j + a, r = 6 + k * (th - th0); pts.push(`${(cx + r * Math.cos(th)).toFixed(1)},${(cy + r * Math.sin(th)).toFixed(1)}`); }
      const done = j < turn, cur = j === turn;
      s += `<polyline points="${pts.join(' ')}" style="fill:none;stroke:${done ? 'var(--accent)' : cur ? 'var(--info)' : 'var(--text-muted)'};stroke-width:${done || cur ? 2.4 : 1.2};${done ? '' : 'stroke-dasharray:5 4;'}"/>`;
    }
    s += `<circle cx="${cx}" cy="${cy}" r="4" style="fill:var(--accent)"/>`;
    return s + '</svg>';
  }
  function drawSpiral(pane) {
    const st = { picks: [] };
    pane.innerHTML = '<div class="stack"><div data-sp></div><div class="stack tight" data-rk></div><div class="stack" data-sv></div></div>';
    function draw() {
      const n = st.picks.length, rest = RISKS.reduce((s, r) => s + (st.picks.includes(r.id) ? 1 : r.p * r.i), 0);
      TR.$('[data-sp]', pane).innerHTML = spiralSvg(Math.min(n, 2));
      TR.$('[data-rk]', pane).innerHTML = `<div class="row between"><span class="eyebrow">Риски «умной» печи · ${n < 2 ? `виток ${n + 1} из 2 до разработки` : 'витки пройдены — старт разработки'}</span><span class="small dim tnum">остаточный риск: ${rest} из ${RISK0}</span></div>` + RISKS.map(r => {
        const off = st.picks.includes(r.id), ex = off ? 1 : r.p * r.i;
        return `<div class="mdl-risk ${off ? 'off' : ''}"><div><b>${r.t}</b><div class="pi">вероятность ${'●'.repeat(r.p)}${'○'.repeat(3 - r.p)} · ущерб ${'●'.repeat(r.i)}${'○'.repeat(3 - r.i)}${off ? ' · снят: ' + r.fix : ''}</div></div>
          <button type="button" class="btn xs ${off ? 'ghost' : ''}" data-rp="${r.id}" ${off || n >= 2 ? 'disabled' : ''}>${off ? 'снят ✓' : `Снять на витке ${n + 1}`}</button>${ui.meter(ex / 9, ex >= 6 ? 'bad' : ex >= 4 ? 'warn' : '')}</div>`;
      }).join('');
      let v = '';
      if (n < 2) v = ui.note('', 'Ваш ход', `До старта разработки бюджет позволяет пройти <b>два</b> витка, и на каждом можно дёшево снять только один риск — стендом, прототипом или разговором. Какой снимать ${n ? 'вторым' : 'первым'}?`);
      else {
        const best = st.picks.includes('sensor') && st.picks.includes('cert');
        v = ui.note(best ? 'ok' : st.picks.includes('sensor') ? 'warn' : 'bad', best ? 'Так и задумана спираль' : 'Опасное осталось на потом',
          (best ? `Вы сняли два самых опасных риска — датчик и сертификацию. В разработку проект входит с остаточным риском ${rest} из ${RISK0}. Цвет корпуса и экран в перчатках тоже важны, но ошибка в них дешевле.`
            : `Остаточный риск при старте разработки — ${rest} из ${RISK0}. Самые дорогие сюрпризы выстрелят уже в разработке, когда менять дорого. Спираль требует начинать виток с самого опасного, а не с самого простого.`) +
          ' <button type="button" class="btn xs ghost" data-rr>⟲ Заново</button>');
      }
      v += ui.note('info', 'Боэм, 1986/1988', 'Каждый виток проходит четыре четверти: цели → поиск и снятие главных рисков → разработка и проверка → план следующего витка. Спираль хороша для больших, дорогих и рискованных проектов: «железо», безопасность, новая технология. Для обычного приложения анализ рисков на каждом витке — лишняя тяжесть.');
      TR.$('[data-sv]', pane).innerHTML = v;
    }
    TR.on(pane, 'click', '[data-rp]', (e, b) => { if (st.picks.length < 2 && !st.picks.includes(b.dataset.rp)) st.picks.push(b.dataset.rp); draw(); });
    TR.on(pane, 'click', '[data-rr]', () => { st.picks = []; draw(); });
    draw();
  }

  function drawFlow(pane) {
    const st = { mode: 'sprint', day: 9 };
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Соседний пример — сопровождение сайта сети кофеен. Работа приходит заявками: мелкие правки, вопросы, а иногда срочное — «не проходит оплата». Проекта с концом нет, есть поток.</p>
      <div class="mdl-box"><div class="mdl-set">
        <div class="lbl">Как работает команда</div>${ui.seg('fm', [{ v: 'sprint', t: 'Спринты по 2 недели, план на спринт' }, { v: 'flow', t: 'Поток: не больше 2 задач в работе' }], st.mode, 'accent')}
        <div class="lbl">«Не проходит оплата» пришло</div><label class="field" style="gap:2px"><span data-fd></span><input type="range" class="mdl-range" min="1" max="13" step="1" value="${st.day}" data-fr aria-label="День, когда пришла срочная ошибка"></label>
      </div></div>
      <div class="mdl-days" data-days></div>
      <div data-fn></div>
    </div>`;
    function draw() {
      TR.$('[data-fd]', pane).innerHTML = `на <b>${st.day}-й день</b> двухнедельного спринта`;
      const wait = 14 - st.day, fix = st.mode === 'flow' ? st.day + 1 : null;
      TR.$('[data-days]', pane).innerHTML = Array.from({ length: 14 }, (_, i) => i + 1).map(d => {
        let c = '', t = d;
        if (d === st.day) { c = 'arr'; t = '!'; } else if (st.mode === 'sprint' && d > st.day) c = 'wait'; else if (d === fix) { c = 'fix'; t = '✓'; }
        return `<span class="${c}" title="день ${d}">${t}</span>`;
      }).join('');
      TR.$('[data-fn]', pane).innerHTML = st.mode === 'sprint'
        ? ui.note('bad', `Ждёт ${wait} ${TR.plural(wait, 'день', 'дня', 'дней')} до следующего спринта`, 'План спринта уже согласован — срочная ошибка ждёт следующего планирования. Можно сорвать спринт ради срочного, но тогда страдает цель спринта. Многие Scrum-команды держат дежурного под срочное — это уже смесь подходов.')
        : ui.note('ok', 'Взяли на следующий день', 'Задачу берут, как только освободилось место (лимит — 2 задачи в работе). Общего ритма показов нет, зато срочное не ждёт. Так обычно и ведут сопровождение — потоком, по Kanban. Подробно — завтра и на 5-й неделе.');
    }
    ui.onSeg(pane, (n, v) => { if (n === 'fm') { st.mode = v; draw(); } });
    TR.$('[data-fr]', pane).addEventListener('input', e => { st.day = +e.target.value; draw(); });
    draw();
  }

  const howIter = {
    id: 'how-iter', covers: ['pick', 'lab'], title: 'Как это работает: частями, по кругу и по рискам', free: true, noReset: true,
    simple: {
      icon: '🥐',
      plain: 'Можно не делать всё разом, а показывать результат часто: либо готовыми кусками (инкременты), либо сначала черновик целиком, а потом улучшать (итерации). Спираль — тоже по кругу, но каждый круг начинают с самого опасного риска.',
      analogy: 'Новая выпечка в пекарне: испекли пробную партию, дали попробовать постоянным покупателям, поправили рецепт, испекли снова. А трёхъярусный торт можно собирать по ярусу — каждый сразу готов и украшен — или сначала собрать весь торт из голого бисквита, показать форму и потом доводить.',
      tech: '<b>Инкрементная модель</b> — объём делят на части и поставляют по очереди, каждая часть рабочая; план частей составлен в начале. <b>Итеративная</b> — повторяют цикл «анализ → проект → разработка → проверка» и с каждым кругом улучшают продукт по обратной связи. Agile-подходы (Scrum) — итеративные и инкрементные сразу. <b>Спиральная модель</b> Барри Боэма (1986/1988) — витки, в каждом: цели → анализ и снижение главных рисков (часто прототипом) → разработка и проверка → план следующего витка.'
    },
    lead: ui.brief({
      situation: 'Три соседних примера: трёхъярусный торт к юбилею, который кондитер показывает заказчице раз в неделю; «умная» печь с датчиками — большой рискованный проект; сопровождение сайта сети кофеен, где работа приходит заявками.',
      todo: [
        'Вкладка «Ярусами или черновиком»: двигайте ползунок недель и сравнивайте, что видит заказчица в каждом подходе. Потом ответьте себе на вопрос под тортами и откройте ответ.',
        'Вкладка «Спираль Боэма»: у вас два витка до старта разработки. Выберите, какие риски снимать, и посмотрите остаточный риск. Нажмите «Заново» и попробуйте по-другому.',
        'Вкладка «Поток заявок»: переключите «Спринты» и «Поток» и подвигайте день, когда пришла срочная ошибка.'
      ],
      look: 'Торт с пунктиром — только чертёж, замок — показать нечего, бисквитный цвет — черновик, украшенный — готово. На спирали зелёные витки пройдены, синий — текущий. Полоса под риском: красная — опасно, жёлтая — терпимо. В днях спринта: «!» — пришла ошибка, жёлтое — ждёт, «✓» — взяли в работу.'
    }),
    render(el) {
      el.classList.add('mdl-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [{ id: 'cake', t: 'Ярусами или черновиком', render: drawCake }, { id: 'spiral', t: 'Спираль Боэма', render: drawSpiral }, { id: 'flow', t: 'Поток заявок', render: drawFlow }], 'cake');
      el.insertAdjacentHTML('beforeend', `<div style="margin-top:12px">${ui.note('info', 'Позиция аналитика', 'В итерациях аналитик не пишет одно большое ТЗ, а готовит требования порциями — на спринт-два вперёд — и после каждого показа уточняет их с заказчиком. В спирали помогает найти и описать риски и проверить их прототипом. В потоке разбирает входящие заявки: что случилось, кого задевает, насколько срочно.')}</div>`);
    }
  };

  // =====================================================================
  // Теория 3. Договор: фиксированная цена или оплата по факту (соседний пример: приложение сети кофеен)
  // =====================================================================
  const CL = [
    { v: 'clear', t: 'всё ясно и записано', res: 0.1, lo: 0.9, hi: 1.15 },
    { v: 'rough', t: 'ясно в общих чертах', res: 0.3, lo: 0.8, hi: 1.5 },
    { v: 'fog', t: 'почти ничего не ясно', res: 0.6, lo: 0.6, hi: 2.5 }
  ];
  const BASE_MLN = 2;
  const mln = x => (Math.round(x * 10) / 10).toLocaleString('ru-RU') + ' млн ₽';
  const CT_VERDICT = {
    'fp|clear': ['ok', 'Хорошая пара: объём ясен — резерв небольшой, обе стороны спокойны, приёмка по ТЗ.'],
    'fp|rough': ['warn', 'Резерв уже около 30 %, а каждая неясность превращается в спор «это входило в ТЗ?».'],
    'fp|fog': ['bad', 'Подрядчик заложит резерв 60 % — или откажется. Заказчик переплатит или утонет в допсоглашениях.'],
    'tm|clear': ['warn', 'Можно, но если объём ясен и стабилен, заказчику спокойнее знать цену заранее.'],
    'tm|rough': ['ok', 'Объём уточняют по ходу, заказчик видит, куда уходят деньги, и сам решает, что важнее.'],
    'tm|fog': ['ok', 'Честнее всего для тумана: платят за работу и каждые 2 недели решают, что дальше. Но риск бюджета у заказчика — нужны потолок и строгие приоритеты.']
  };
  function drawContract(el) {
    const st = { type: 'fp', cl: 'rough', chg: 'no' };
    el.innerHTML = `<div class="stack">
      <div class="mdl-box"><div class="mdl-set">
        <div class="lbl">Договор</div>${ui.seg('ct', [{ v: 'fp', t: 'Фиксированная цена' }, { v: 'tm', t: 'Оплата по факту (T&amp;M)' }], st.type, 'accent')}
        <div class="lbl">Требования к началу работ</div>${ui.seg('cc', CL.map(c => ({ v: c.v, t: c.t })), st.cl, 'accent')}
        <div class="lbl">На 3-м месяце заказчик</div>${ui.seg('cg', [{ v: 'no', t: 'ничего не меняет' }, { v: 'yes', t: 'просит оплату по QR-коду' }], st.chg, 'accent')}
      </div></div>
      <div class="mdl-stats" data-cs></div>
      <div class="mdl-box" data-sc></div>
      <div data-cv></div>
    </div>`;
    function draw() {
      const c = CL.find(x => x.v === st.cl), fp = st.type === 'fp';
      const price = fp ? mln(BASE_MLN * (1 + c.res)) : `${mln(BASE_MLN * c.lo).replace(' млн ₽', '')}–${mln(BASE_MLN * c.hi)}`;
      TR.$('[data-cs]', el).innerHTML = `
        <div class="stat"><span class="k">Цена в договоре</span><span class="v">${fp ? price : 'по факту'}</span><span class="s">${fp ? `оценка ${mln(BASE_MLN)} + резерв ${Math.round(c.res * 100)} %` : `честная вилка оценки: ${price}`}</span></div>
        <div class="stat"><span class="k">Если всё по оценке</span><span class="v ${fp && c.res > .2 ? 'warn' : ''}">${fp ? price : mln(BASE_MLN)}</span><span class="s">${fp ? 'резерв заказчик платит всё равно' : 'платят за фактические часы'}</span></div>
        <div class="stat"><span class="k">Изменение объёма</span><span class="v ${st.chg === 'yes' ? (fp ? 'bad' : 'ok') : ''}" style="font-size:15px">${st.chg === 'no' ? '—' : fp ? '1–2 недели переговоров' : 'на ближайшем демо'}</span><span class="s">${st.chg === 'no' ? 'заказчик ничего не менял' : fp ? 'запрос на изменение → оценка → допсоглашение' : 'новое встаёт в список работ, заказчик решает, что подвинуть'}</span></div>
        <div class="stat"><span class="k">Чтобы не поссориться</span><span class="v" style="font-size:14px">${fp ? 'подробное ТЗ' : 'прозрачность'}</span><span class="s">${fp ? 'критерии приёмки и порядок изменений в договоре' : 'демо каждые 2 недели, отчёт по часам, потолок бюджета'}</span></div>`;
      const sup = fp ? 75 : 25;
      TR.$('[data-sc]', el).innerHTML = `<div class="eyebrow">Кто держит риск «работы оказалось больше»</div>
        <div class="mdl-scale"><span>Подрядчик ${sup} %</span><div class="bar" role="img" aria-label="Подрядчик ${sup} %, заказчик ${100 - sup} %"><i style="width:${sup}%;background:var(--violet)"></i><i style="width:${100 - sup}%;background:var(--info)"></i></div><span>Заказчик ${100 - sup} %</span></div>
        <div class="small muted">${fp ? 'Подрядчик рискует деньгами — поэтому закладывает резерв и строго держит объём. Заказчик рискует переплатить за резерв и спорить о границах ТЗ.' : 'Заказчик рискует бюджетом — поэтому ему нужны демо, отчёты и потолок. Подрядчик рискует меньше, но обязан быть прозрачным.'}</div>`;
      const [k, txt] = CT_VERDICT[st.type + '|' + st.cl];
      TR.$('[data-cv]', el).innerHTML = ui.note(k, 'Что выйдет', txt + (st.chg === 'yes' ? (fp ? ' А просьба про QR-код — это запрос на изменение: оценка, цена, подпись, и только потом работа.' : ' Просьба про QR-код просто встаёт в список работ — заказчик сам решает, что ради неё подвинуть.') : ''));
    }
    ui.onSeg(el, (n, v) => { if (n === 'ct') st.type = v; else if (n === 'cc') st.cl = v; else if (n === 'cg') st.chg = v; else return; draw(); });
    draw();
  }
  const howContract = {
    id: 'how-contract', covers: ['contract', 'igor'], title: 'Как это работает: фиксированная цена или оплата по факту', free: true, noReset: true,
    simple: {
      icon: '🧾',
      plain: 'Договориться о деньгах можно двумя способами. «Фиксированная цена» — заранее договорились, что сделаем и за сколько; всё новое — отдельная договорённость. «Оплата по факту» — платят за реально потраченное время, а что делать дальше, заказчик решает по ходу.',
      analogy: 'Ремонт кухни. «Под ключ по смете» — цена известна заранее, но захотели перенести мойку — доплата и новая смета, а прораб с самого начала заложил запас на сюрпризы. «Мастер с почасовой оплатой» — планы можно менять хоть каждый день, но итоговую сумму никто не знает, и следить за ней приходится самому.',
      tech: '<b>Fixed price</b> (фиксированная цена) — объём, срок и цена закреплены в договоре; риск перерасхода несёт подрядчик, поэтому закладывает резерв; изменения — через запрос на изменение и допсоглашение. <b>Time &amp; materials</b> (T&amp;M, «время и материалы») — оплата фактических часов по ставкам; объём гибкий, риск бюджета у заказчика, поэтому нужны прозрачность и контроль. В любом договоре три величины — объём, срок, цена; зафиксировать все три, когда требования в тумане, можно только с большим запасом. Бывают гибриды: короткий этап с фиксированной ценой, чтобы разогнать туман, а дальше по факту; оплата по факту с потолком бюджета; фиксированная цена за каждый спринт.'
    },
    lead: ui.brief({
      situation: 'Соседний пример: сеть кофеен заказывает у «Квант Софт» приложение для заказа кофе навынос. Оценка работ — около 2 млн ₽. Как ни договорись о деньгах, у кого-то будет риск. Посмотрим — у кого и во что он обходится.',
      todo: [
        'Выберите тип договора и насколько ясны требования. Пройдите все три уровня ясности для обоих договоров.',
        'Включите «просит оплату по QR-коду» и сравните, что происходит с изменением в каждом договоре.',
        'Найдите, при каких условиях каждый договор честен для обеих сторон.'
      ],
      look: 'Карточки — цена в договоре, что выйдет при исполнении по оценке, путь изменения и что нужно, чтобы не поссориться. Полоса — кто несёт риск, если работы окажется больше. Чем гуще туман в требованиях, тем шире честная вилка оценки — в начале проекта она может ошибаться в разы (это называют «конусом неопределённости»).'
    }),
    render(el) {
      el.classList.add('mdl-root');
      const d = document.createElement('div'); el.appendChild(d); drawContract(d);
      el.insertAdjacentHTML('beforeend', `<div style="margin-top:12px">${ui.note('info', 'Позиция аналитика', 'Договор подписывают Игорь и заказчик, но от аналитика зависит, насколько ясен объём: чем лучше выявлены требования, тем меньше резерв и споров. В договоре с фиксированной ценой аналитик проверяет каждое «а давайте ещё» — входит ли оно в согласованный объём, и помогает оформить запрос на изменение. При оплате по факту — готовит понятные варианты с ценой, чтобы заказчик мог выбрать.')}</div>`);
    }
  };

  // =====================================================================
  // Практика 1. Лаборатория «Нина передумала на N-м месяце»
  // =====================================================================
  const NEW = 4;            // торты, если знать о них с начала: 4 недели работы команды
  const PLAN = 24;          // 24 недели работы команды = 100 % бюджета
  const sprintSegs = (from, to) => { const r = []; for (let s = from; s < to; s += 2) r.push([s, s + 2, 'spr']); return r; };
  const W_REDO = [
    'Ничего не переделываем: требования не менялись. Проект идёт ровно по плану — но Нина впервые увидит систему только на приёмке.',
    'Почти ничего: требования ещё собираем — торты просто входят в ТЗ. Срок растёт только на саму работу по тортам.',
    'Пересогласовать и заново подписать ТЗ; доработать проект: у торта свой статус, предоплата 50 %, фото-образец для кондитера.',
    'Переподписать ТЗ, переделать проект и схему данных, переписать начатый код заказа — теперь заказы двух видов.',
    'Переподписать ТЗ, переделать проект, переписать половину готового кода заказа и оплаты, обновить план тестов.',
    'Всё то же, плюс заново прогнать тесты: торты задели заказ, оплату и чеки. Найденные ошибки — снова в разработку.',
    'Остановить внедрение, пройти все стадии заново и переобучить кассиров. Или отложить торты во вторую версию — и к 8 Марта снова тетрадь.'
  ];
  const SIM = {
    water: { t: 'Каскад', base: 24, ins: 'now',
      rows: [['Требования', [[0, 4]]], ['Проектирование', [[4, 8]]], ['Разработка', [[8, 17]]], ['Тестирование', [[17, 21]]], ['Внедрение', [[21, 24]]]],
      demos: [[21, 'work']], rework: [0, 0, 2, 5, 8, 12, 16], redo: W_REDO,
      tail: 'Чем ниже по лестнице, тем больше сделано и подписано «под старое» — и тем дороже подниматься назад.' },
    v: { t: 'V-модель', base: 24, ins: 'now',
      rows: [['Требования + план приёмки', [[0, 4]]], ['Проект + план системных тестов', [[4, 6]]], ['Архитектура + план интеграции', [[6, 8]]], ['Код и модульные тесты', [[8, 16]]], ['Интеграционные тесты', [[16, 18]]], ['Системные тесты', [[18, 21]]], ['Приёмка и внедрение', [[21, 24]]]],
      demos: [[21, 'work']], rework: [0, 0, 2.5, 6, 9, 13, 17],
      redo: W_REDO.map((t, i) => i >= 2 ? t + ' И ещё переписать готовые планы проверок: приёмки, системных и интеграционных тестов.' : t),
      tail: 'V-модель делает проверку ранней и продуманной, но не делает проект гибче: к переделке добавляются ещё и планы тестов.' },
    inc: { t: 'Инкрементная', base: 24, ins: 22,
      rows: [['Требования и архитектура', [[0, 4]]], ['Инкремент 1: предзаказ', [[4, 10]]], ['Инкремент 2: оплата и чеки', [[10, 16]]], ['Инкремент 3: кассир и 1С', [[16, 22]]], ['Внедрение', [[22, 24]]]],
      demos: [[10, 'work'], [16, 'work'], [22, 'work']], rework: [0, 0, 1, 1.5, 2, 3, 5],
      redo: [
        'Ничего: три инкремента идут по плану. Первый работающий кусок Нина получит на 3-м месяце.',
        'Почти ничего: торты станут четвёртым инкрементом, общий план чуть растёт.',
        'Перепланировать инкременты и чуть поправить архитектуру: торты — отдельный инкремент в конце.',
        'Торты — новый инкремент в конце. Уже сданный «предзаказ» придётся слегка доработать: заказ теперь бывает двух видов.',
        'Как на 3-м месяце, плюс доработать идущий инкремент оплаты: для торта предоплата 50 %.',
        'Доработать два сданных инкремента и добавить четвёртый — срок сдвигается.',
        'Три инкремента уже работают у кассиров: дорабатывать живое и добавлять ещё один инкремент.'],
      tail: 'Ещё не начатые куски меняются дёшево, уже сданные — дороже. А план частей составлен в начале и сам по себе не гнётся.' },
    iter: { t: 'Итеративная (спринты)', base: 24, ins: 23,
      rows: [['Обследование', [[0, 3]]], ['Спринты по 2 недели', sprintSegs(3, 23)], ['Пилот и запуск', [[23, 24]]]],
      demos: [5, 7, 9, 11, 13, 15, 17, 19, 21, 23].map(w => [w, 'work']), rework: [0, 0.5, 0.5, 1, 1, 1.5, 2],
      redo: [
        'Ничего: спринты идут, Нина каждые 2 недели видит работающее и уточняет детали прямо на демо.',
        'Торты — в бэклог (список будущих работ), Нина ставит им приоритет. Чуть переделать план спринтов.',
        'Торты — в бэклог. На ближайшем планировании Нина решает, что важнее. Переделка мелкая: соседний код, который писали без учёта тортов.',
        'Торты — в бэклог. На ближайшем планировании Нина решает, что важнее. Переделка мелкая: соседний код, который писали без учёта тортов.',
        'Торты — в бэклог, мелкая переделка соседнего кода. Если запуск сдвигать нельзя, Нина может убрать из релиза что-то менее важное — например, «повторить прошлый заказ».',
        'Торты — в бэклог. Готового кода уже много — поправить под торты придётся больше. Срок держим, вытесняя менее важное, или сдвигаем.',
        'Почти всё готово: торты займут ещё пару спринтов. Решать Нине — сдвинуть запуск или запустить без тортов и добавить их следом.'],
      tail: 'Торты не ломают сделанное, а встают в очередь работ, и Нина сама решает, что важнее. Цена гибкости — итоговый объём и сумму заранее не знает никто.' },
    spiral: { t: 'Спиральная', base: 26, ins: 'now',
      rows: [['Виток 1: цели, риски, прототип экранов', [[0, 5]]], ['Виток 2: прототип связи с кассой', [[5, 11]]], ['Виток 3: разработка и проверка', [[11, 19]]], ['Виток 4: доводка и внедрение', [[19, 26]]]],
      demos: [[5, 'proto'], [11, 'proto'], [19, 'work'], [26, 'work']], rework: [0, 0, 1, 2, 3, 5, 8],
      redo: [
        'Ничего: витки идут по плану. Но анализ рисков на каждом витке стоит времени — для нашего проекта это +2 недели к плану.',
        'Почти ничего: торты входят в цели первого витка, их риски оценят вместе с остальными.',
        'Добавить торты в цели второго витка: новый риск — мощность цеха, до 25 тортов в день.',
        'Новый риск посреди разработки: переоценить риски, доработать прототипы и начатый код.',
        'Как на 3-м месяце, но готового кода уже больше.',
        'Нужен дополнительный виток — срок растёт.',
        'Последний виток: торты — это ещё один полный виток.'],
      tail: 'Спираль переносит изменения лучше каскада — на каждом витке пересматривают цели, — но каждый виток с анализом рисков стоит времени.' }
  };
  const MK = ['water', 'v', 'inc', 'iter', 'spiral'];
  const monthOf = w => Math.max(1, Math.ceil(w / 4 - 1e-9));
  function simRun(mk, m) {
    const M = SIM[mk], c = m ? (m - 1) * 4 + 2 : null;
    const re = m ? M.rework[m] : 0, extra = m ? NEW + re : 0;
    const ins = c == null ? null : (M.ins === 'now' ? c : Math.max(c, M.ins));
    const shift = seg => {
      const [s, e, k] = seg;
      if (ins == null || e <= ins) return [[s, e, k]];
      if (s >= ins) return [[s + extra, e + extra, k]];
      return [[s, ins, k], [ins + extra, e + extra, k]];
    };
    const rows = M.rows.map(([t, segs]) => ({ t, segs: segs.flatMap(shift) }));
    let demos = M.demos.map(([w, k]) => [ins != null && w > ins ? w + extra : w, k]);
    if (mk === 'iter' && ins != null) for (let w = ins + 2; w <= ins + extra; w += 2) demos.push([w, 'work']);
    demos = demos.sort((a, b) => a[0] - b[0]);
    const end = M.base + extra, works = demos.filter(d => d[1] === 'work'), protos = demos.filter(d => d[1] === 'proto');
    return {
      mk, m, c, ins, re, extra, rows, demos, end, base: M.base, budget: Math.round(end / PLAN * 100),
      firstWork: works.length ? works[0][0] : end, firstProto: protos.length ? protos[0][0] : null, nWork: works.length
    };
  }
  const ROWC = ['var(--info)', 'var(--violet)', 'var(--cyan)', 'var(--pink)', 'var(--warn)', 'var(--info)', 'var(--violet)'];
  function ganttHTML(r) {
    const T = Math.max(PLAN, Math.ceil(r.end / 4) * 4), pct = w => (w / T * 100).toFixed(2) + '%';
    const cl = r.c != null ? `<span class="mdl-cl" style="left:${pct(r.c)}"></span>` : '';
    let h = '<div class="mdl-gantt">';
    r.rows.forEach((row, i) => {
      h += `<div class="mdl-row"><span class="nm">${esc(row.t)}</span><div class="mdl-track">${row.segs.map(([s, e, k]) => `<span class="mdl-bar ${k || ''}" style="left:${pct(s)};width:${pct(e - s)};background:${ROWC[i % ROWC.length]}"></span>`).join('')}${cl}</div></div>`;
    });
    if (r.extra) {
      h += `<div class="mdl-row"><span class="nm chg">Звонок Нины: торты</span><div class="mdl-track">${r.re ? `<span class="mdl-bar redo" style="left:${pct(r.ins)};width:${pct(r.re)}" title="переделка"></span>` : ''}<span class="mdl-bar new" style="left:${pct(r.ins + r.re)};width:${pct(NEW)}" title="новая работа"></span>${cl}</div></div>`;
    }
    h += `<div class="mdl-row"><span class="nm see">Нина видит</span><div class="mdl-track">${r.demos.map(([w, k]) => `<span class="mdl-dm ${k === 'proto' ? 'proto' : ''}" style="left:${pct(Math.min(w, T - 0.3))}" title="${k === 'proto' ? 'прототип' : 'работающая система'}, неделя ${num(w)}"></span>`).join('')}${cl}</div></div>`;
    h += `<div class="mdl-row"><span class="nm small dim">месяцы</span><div class="mdl-axis">${Array.from({ length: T / 4 }, (_, k) => `<span style="left:${pct(k * 4 + 2)}">${k + 1}</span>`).join('')}</div></div>`;
    h += `</div><div class="mdl-legend" style="margin-top:8px"><span><i style="background:var(--bad);width:3px"></i>звонок Нины</span><span><i style="background:repeating-linear-gradient(45deg,var(--bad) 0 4px,var(--bad-soft) 4px 8px)"></i>переделка сделанного</span><span><i style="background:var(--accent)"></i>новая работа: торты</span><span><i style="background:var(--ok);border-radius:50%;width:10px"></i>Нина трогает работающее</span><span><i style="background:var(--warn);width:9px;height:9px;transform:rotate(45deg)"></i>видит прототип</span></div>`;
    return h;
  }
  function labNote(r) {
    const M = SIM[r.mk];
    if (!r.m) {
      if (r.mk === 'water' || r.mk === 'v') return ui.note('warn', 'По плану — но вслепую', `Без изменений всё идёт по плану: ${r.end} недель, понятные документы и подписи. Но работающую систему Нина впервые потрогает на ${monthOf(r.firstWork)}-м месяце. Если мы её где-то не так поняли, узнаем только тогда.`);
      if (r.mk === 'spiral') return ui.note('warn', 'Тяжеловато для нашего проекта', `${r.end} недель — анализ рисков на каждом витке стоит времени. Для проекта без больших технических рисков это лишняя тяжесть.`);
      return ui.note('ok', 'По плану и на виду', `${r.end} недель, а работающее Нина видит уже на ${monthOf(r.firstWork)}-м месяце — всего ${r.nWork} ${TR.plural(r.nWork, 'показ', 'показа', 'показов')} до запуска.`);
    }
    const k = r.extra <= 5 ? 'ok' : r.extra <= 9 ? 'warn' : 'bad';
    return ui.note(k, `Звонок на ${r.m}-м месяце: +${ned(r.extra)}`, `${ned(NEW)} — сами торты, ${ned(r.re)} — переделка того, что уже сделано «под старое». ${M.tail}`);
  }
  const LAB_QS = [
    { q: '1. Нина решила «торты тоже нужны» на 4-м месяце. Почему в итеративной модели это обошлось намного дешевле, чем в каскаде?', seed: 'mdl-lab-q1', options: [
      { t: 'В каскаде к 4-му месяцу уже подписано ТЗ, готов проект и пишется код под старый объём — всё это переделывают. В итерациях торты встают в очередь работ, а сделанное почти не задето', ok: 1, why: 'Верно. Цена изменения — это сколько уже сделано «под старое» и сколько стадий надо пройти заново.' },
      { t: 'Итеративные команды работают быстрее, пишут код почти без ошибок и поэтому легко успевают сделать торты сверх плана', why: 'Команда в симуляторе одна и та же. Разница не в скорости, а в том, сколько уже сделано под старый объём.' },
      { t: 'В итеративной модели не нужен анализ требований и проектирование, поэтому на торты просто уходит меньше работы', why: 'Анализ нужен в любой модели — в итерациях его делают порциями перед каждым спринтом.' },
      { t: 'В каскаде изменения запрещены договором, и Игорю пришлось бы заключать с Ниной новый договор на торты', why: 'Не запрещены — их проводят через запрос на изменение. Просто к 4-му месяцу менять приходится гораздо больше.' }] },
    { q: '2. Что верно про V-модель — по тому, что вы видели в симуляторе?', seed: 'mdl-lab-q2', options: [
      { t: 'Она заставляет заранее продумать проверку каждой стадии, но к позднему изменению не гибче каскада — ещё и планы тестов переделывать', ok: 1, why: 'Верно. V-модель — про качество и раннюю проверку, а не про гибкость.' },
      { t: 'Она гибче каскада: раз проверки спланированы заранее, вернуться назад и поменять требования можно почти без затрат', why: 'Посмотрите на переделку у V-модели на 4-м месяце — она даже больше, чем у каскада.' },
      { t: 'В ней Нина видит работающую систему раньше, чем в итерациях, потому что тесты пишут с первого месяца', why: 'Посмотрите на строку «Нина видит»: в V-модели первый кружок появляется только на приёмке.' },
      { t: 'Это другое название спиральной модели: те же витки, только нарисованные буквой V', why: 'Спираль идёт витками по рискам, а V-модель — один проход с парами «стадия ↔ проверка».' }] },
    { q: '3. Когда каскад не проигрывает итерациям?', seed: 'mdl-lab-q3', options: [
      { t: 'Когда требования ясны с самого начала и почти не меняются — или изменение пришло, пока требования ещё собирают', ok: 1, why: 'Верно. На 1-м месяце каскад даже чуть дешевле итераций, а без изменений идёт ровно по плану и проще в договоре.' },
      { t: 'Никогда: каскад устарел, и в 2026 году им не пользуется ни одна компания', why: 'Используется — в госзаказах по ГОСТ, в проектах с фиксированным ТЗ, в отдельных пакетах вроде интеграций. Устарела только вера, что он подходит всем.' },
      { t: 'Когда заказчик хочет как можно раньше потрогать работающий результат и поправить его по ходу', why: 'Наоборот: в каскаде работающее появляется в самом конце.' },
      { t: 'Когда команда маленькая и все сидят в одной комнате, поэтому документы почти не нужны', why: 'Размер команды здесь ни при чём — важно, насколько стабильны требования.' }] }
  ];
  const LAB_NEED = MK.map(k => k + '|4').concat(['water|1']);
  const labTask = {
    id: 'lab', title: 'Лаборатория: Нина передумала на N-м месяце',
    simple: howWaterfall.simple,
    lead: ui.brief({
      situation: `Учебная модель проекта, похожего на наш: команда «Квант Софт», ${PLAN} недели работы команды — это 100 % бюджета. Представьте, что в первоначальном объёме тортов нет. На каком-то месяце Нина Сергеевна звонит Игорю: «А торты тоже через приложение — к 8 Марта мы опять потеряем заказы!» Если знать о тортах с самого начала, это ${NEW} недели работы.`,
      todo: [
        'Вверху выберите модель, ползунком — месяц, когда Нина передумала.',
        'Прогоните все пять моделей при звонке на <b>4-м месяце</b>. Карточки сравнения под шкалой заполняются по мере прогонов — по ним удобно сравнивать.',
        'Поставьте «Каскад» и сдвиньте звонок на <b>1-й месяц</b>, потом — на «не передумала». Что изменилось?',
        'Ответьте на три вопроса внизу и нажмите «Проверить».'
      ],
      look: 'Строки — стадии модели, полосы — когда идёт стадия. Красная черта — звонок Нины, красная штриховка — переделка сделанного, зелёное — новая работа по тортам. Зелёные кружки — когда Нина может потрогать работающую программу, жёлтые ромбы — только прототип. «Бюджет» — сколько недель работы ушло с переделкой (24 недели = 100 %). Цифры учебные, но соотношения — как в жизни.'
    }),
    blank: () => ({ model: 'water', month: 4, seen: [], q: [] }),
    reference: () => ({ model: 'iter', month: 4, seen: LAB_NEED.slice(), q: quizRef(LAB_QS) }),
    render(el, ctx) {
      el.classList.add('mdl-root');
      const a = ctx.ans; a.seen = a.seen || []; a.q = a.q || [];
      if (!SIM[a.model]) a.model = 'water';
      if (a.month == null) a.month = 4;
      const mark = () => { const k = a.model + '|' + a.month; if (!ctx.readonly && !a.seen.includes(k)) { a.seen.push(k); ctx.save(); } };
      mark();
      el.innerHTML = `<div class="stack">
        <div class="mdl-box"><div class="mdl-set">
          <div class="lbl">Модель</div>${ui.seg('model', MK.map(k => ({ v: k, t: SIM[k].t })), a.model, 'accent')}
          <div class="lbl">Нина передумала</div><label class="field" style="gap:2px"><span data-ml></span><input type="range" class="mdl-range" min="0" max="6" step="1" value="${a.month}" data-m aria-label="Месяц, когда Нина передумала"></label>
        </div></div>
        <div data-g></div>
        <div class="mdl-stats" data-st></div>
        <div class="card flat"><div class="eyebrow">Что переделываем</div><div data-redo></div></div>
        <div data-n></div>
        <div class="stack tight"><div class="eyebrow">Сравнение при звонке на этом же месяце · заполняется по мере прогонов</div><div class="mdl-cmp" data-cmp></div></div>
        <div class="card flat stack" data-q></div>
      </div>`;
      function draw() {
        const r = simRun(a.model, a.month);
        TR.$('[data-ml]', el).innerHTML = a.month ? `на <b>${a.month}-м месяце</b> (неделя ${r.c})` : '<b>не передумала</b> — тортов в объёме нет';
        TR.$('[data-g]', el).innerHTML = ganttHTML(r);
        const bk = r.budget <= 110 ? 'ok' : r.budget <= 130 ? 'warn' : 'bad';
        TR.$('[data-st]', el).innerHTML = `
          <div class="stat"><span class="k">Срок</span><span class="v">${r.end} нед.</span><span class="s">${r.extra ? `+${num(r.extra)} к плану` : 'по плану'}</span></div>
          <div class="stat"><span class="k">Бюджет</span><span class="v ${bk}">${r.budget} %</span><span class="s">24 недели = 100 %</span></div>
          <div class="stat"><span class="k">Нина впервые трогает</span><span class="v ${monthOf(r.firstWork) <= 3 ? 'ok' : 'bad'}">${monthOf(r.firstWork)}-й мес.</span><span class="s">${r.firstProto != null ? `прототип — на ${monthOf(r.firstProto)}-м` : 'работающую программу'}</span></div>
          <div class="stat"><span class="k">Показов работающего</span><span class="v">${r.nWork}</span><span class="s">до запуска</span></div>`;
        TR.$('[data-redo]', el).innerHTML = `<p class="small">${SIM[a.model].redo[a.month]}</p>`;
        TR.$('[data-n]', el).innerHTML = labNote(r);
        TR.$('[data-cmp]', el).innerHTML = MK.map(k => {
          const seen = a.seen.includes(k + '|' + a.month), rr = simRun(k, a.month);
          return `<button type="button" class="stat ${k === a.model ? 'cur' : ''}" data-pick="${k}"><span class="k">${SIM[k].t}</span><span class="v ${seen ? (rr.budget <= 110 ? 'ok' : rr.budget <= 130 ? 'warn' : 'bad') : ''}">${seen ? `${rr.budget} %` : '—'}</span><span class="s">${seen ? `${rr.extra ? '+' + num(rr.extra) + ' нед. · ' : ''}трогает на ${monthOf(rr.firstWork)}-м мес.` : 'ещё не прогнана — нажмите'}</span></button>`;
        }).join('');
        lockAll(el, ctx.readonly);
      }
      const setModel = v => { a.model = v; TR.$$('[data-seg="model"] button', el).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v))); mark(); if (!ctx.readonly) ctx.save(); draw(); };
      ui.onSeg(el, (n, v) => { if (n === 'model' && !ctx.readonly) setModel(v); });
      TR.on(el, 'click', '[data-pick]', (e, b) => { if (!ctx.readonly) setModel(b.dataset.pick); });
      TR.$('[data-m]', el).addEventListener('input', e => { if (ctx.readonly) return; a.month = +e.target.value; mark(); ctx.save(); draw(); });
      draw();
      const qbox = TR.$('[data-q]', el), rv = ctx.readonly || (ctx.result && ctx.result.ok) ? true : null;
      qbox.insertAdjacentHTML('beforeend', '<div class="eyebrow">Выводы из лаборатории</div>');
      LAB_QS.forEach((cfg, i) => {
        const d = document.createElement('div'); qbox.appendChild(d);
        ui.quiz(d, Object.assign({}, cfg, { value: a.q[i] || [], readonly: ctx.readonly, reveal: rv, onChange: v => { a.q[i] = v; ctx.save(); } }));
      });
    },
    check(ans) {
      const seen = new Set(ans.seen || []), miss = LAB_NEED.filter(k => !seen.has(k));
      const qs = LAB_QS.map((cfg, i) => ui.quizScore(cfg, (ans.q || [])[i] || []));
      const notes = [];
      MK.forEach(k => { if (!seen.has(k + '|4')) notes.push({ ok: 'warn', html: `Модель «${SIM[k].t}» при звонке на 4-м месяце ещё не прогнана.` }); });
      if (!seen.has('water|1')) notes.push({ ok: 'warn', html: 'Поставьте каскад и сдвиньте звонок Нины на 1-й месяц — посмотрите, во что обходится раннее изменение.' });
      if (!miss.length) notes.push({ ok: true, html: 'Все нужные прогоны сделаны.' });
      const HINTS = [
        'Вопрос 1: сравните блок «Что переделываем» у каскада и итераций на 4-м месяце. Что в каскаде к этому моменту уже сделано и подписано под старый объём?',
        'Вопрос 2: посмотрите на V-модель на 4-м месяце — сколько переделки и когда появляется первый зелёный кружок.',
        'Вопрос 3: какой была переделка в каскаде при звонке на 1-м месяце и без звонка вовсе?'
      ];
      qs.forEach((q, i) => notes.push(q.ok ? { ok: true, html: `Вопрос ${i + 1}: верно.` } : { ok: false, html: HINTS[i] }));
      const score = (LAB_NEED.length - miss.length) / LAB_NEED.length * 0.3 + qs.reduce((s, q) => s + q.score, 0) / qs.length * 0.7;
      return {
        ok: !miss.length && qs.every(q => q.ok), score, notes,
        summary: `Прогонов: ${LAB_NEED.length - miss.length} из ${LAB_NEED.length} · вопросов верно: ${qs.filter(q => q.ok).length} из ${qs.length}.`,
        mentor: miss.length ? 'Сначала соберите картину целиком: все пять моделей на 4-м месяце рядом в карточках сравнения скажут больше любых определений.' : null
      };
    },
    explain: (() => {
      const R = MK.map(k => simRun(k, 4));
      return `<p>При звонке Нины на 4-м месяце:</p>${ui.table(['Модель', 'Срок и бюджет', 'Нина впервые трогает работающее'], R.map(r => [SIM[r.mk].t, `+${num(r.extra)} нед. → ${r.budget} %`, `${monthOf(r.firstWork)}-й месяц`]))}
      <p>Механизм один: <b>цена изменения = сколько уже сделано «под старое» × сколько стадий надо пройти заново</b>. В каскаде к 4-му месяцу подписано ТЗ, готов проект, пишется код — всё это переделывают, а Нина впервые видит систему уже после переделки. В итерациях торты встают в очередь работ, а Нина каждые 2 недели видит работающее и сама решает, что важнее.</p>
      <p>Каскад при этом не «плохой»: при звонке на 1-м месяце или без изменений он идёт ровно по плану и проще в договоре. Сам Ройс в 1970 году предупреждал: опасен не порядок стадий, а то, что проверка и заказчик появляются только в конце. V-модель лечит первое (проверку планируют сразу), но не второе. Спираль Боэма (1986/1988) терпит изменения лучше каскада, но тяжела для проекта без больших рисков.</p>
      <p>У «Колоса» требования точно будут меняться — Нина говорит «хотелками», её «ТЗ» займёт полстраницы. Поэтому разработка у нас идёт спринтами с демо. Цифры в лаборатории учебные; в жизни поздняя переделка в каскаде бывает и дороже — помните эвристику «примерно ×10 на каждой стадии».</p>`;
    })(),
    report(ans) {
      const seen = ans.seen || [];
      return `Прогоны: ${seen.join(', ') || '—'}\n` + LAB_QS.map((cfg, i) => `- Вопрос ${i + 1}: ${ui.quizScore(cfg, (ans.q || [])[i] || []).ok ? 'верно' : 'неверно'}`).join('\n');
    }
  };

  // =====================================================================
  // Практика 2. Подберите модель под шесть проектов
  // =====================================================================
  const PM = [
    { v: 'water', t: 'Каскад' },
    { v: 'v', t: 'V-модель' },
    { v: 'inc', t: 'Инкрементная' },
    { v: 'iter', t: 'Итеративная, Agile (спринты с демо)' },
    { v: 'spiral', t: 'Спиральная (витки по рискам)' },
    { v: 'flow', t: 'Поток заявок (Kanban)' }
  ];
  const PROJ = [
    { id: 'gov', t: 'Госзаказ: система учёта для областного министерства по ГОСТ 34', sub: 'ТЗ утверждено и меняться не будет; оплата этапами после подписания актов; приёмочные испытания по программе и методике',
      ok: { water: 'Классика каскада: требования утверждены и стабильны, ГОСТ 34.601 описывает стадии по порядку, деньги — по актам этапов.', v: 'Тоже верно: раз есть программа и методика испытаний, проверку для каждой стадии можно планировать сразу — это V-модель, тот же каскад с парными проверками.' },
      alt: { inc: [0.5, 'Сдавать частями можно, если ТЗ это предусматривает. Но главное здесь — утверждённое ТЗ и стадии с актами.'] },
      hint: 'Меняются ли здесь требования? Как устроена оплата и что говорит ГОСТ 34.601 о порядке стадий?' },
    { id: 'startup', t: 'Стартап: приложение, где пекарни вечером продают остатки выпечки со скидкой', sub: 'Никто не знает, нужно ли это покупателям; денег — на 4 месяца; идеи меняются каждую неделю',
      ok: { iter: 'Требования неизвестны и будут меняться — нужно как можно раньше показать работающее настоящим людям и учиться на отзывах.' },
      alt: { spiral: [0.5, 'Риск большой — это верно замечено. Но спираль тяжела для стартапа на 4 месяца: витки с формальным анализом рисков съедят время. Короткие итерации проверяют главный риск — «нужно ли это людям» — быстрее.'], inc: [0.5, 'Частями — да, но план частей заранее стартапу не составить: он ещё не знает, что нужно рынку.'] },
      hint: 'Известно ли заранее, что нужно делать? Во что обойдутся полгода разработки того, что окажется никому не нужным?' },
    { id: 'med', t: 'Программа для медицинского прибора — дозатора лекарства', sub: 'Ошибка опасна для жизни; регулятор требует доказать, что каждое требование проверено; требования стабильны',
      ok: { v: 'Каждой стадии — свой уровень проверки и связь «требование → проверка»: ровно то, что требует регулятор. Для медицинского ПО есть стандарт IEC 62304, процессы по нему обычно выстраивают по V-модели.' },
      alt: { spiral: [0.5, 'Риски высокие — спираль для разработки самого прибора применяют, особенно на ранних стадиях. Но для доказательства «каждое требование проверено» нужна строгая пара «стадия ↔ проверка» — это V-модель.'], water: [0.5, 'Требования стабильны — каскад рядом. Но регулятору мало «протестировали в конце»: нужна проверка на каждом уровне, продуманная заранее.'] },
      hint: 'Что требует регулятор? Какая модель ставит каждой стадии в пару свою проверку?' },
    { id: 'support', t: 'Сопровождение «Колоса» после пилота', sub: 'Заявки от 9 пекарен каждый день: ошибки, мелкие доработки; срочная ошибка кассы — за часы, а не за недели',
      ok: { flow: 'Это не проект с концом, а поток заявок разного размера и срочности: задачу берут, как только освободилось место. Так и записано у «Колоса»: после пилота — сопровождение по Kanban.' },
      alt: { iter: [0.5, 'Спринты тоже работают, но срочная ошибка кассы не может ждать конца спринта. Для потока заявок удобнее Kanban.'] },
      hint: 'Есть ли у этой работы начало и конец? Может ли срочная ошибка кассы ждать две недели до следующего спринта?' },
    { id: 'kassa', t: 'Интеграция с «КассаПро» внутри проекта «Колоса»', sub: 'Публичный API и регламент вендора, объём фиксирован; в конце — сертификация у вендора, 3 недели',
      ok: { v: 'Требования задаёт вендор, они не меняются. Каждому уровню — своя проверка, а сертификация вендора — по сути приёмочные испытания. Внутри Agile-проекта такой пакет вполне может жить по своей модели.', water: 'Объём фиксирован регламентом вендора, менять нечего — пакет можно вести каскадом, заранее заложив 3 недели сертификации. Внутри Agile-проекта отдельный кусок вполне может жить по другой модели.' },
      alt: { iter: [0.5, 'Делать спринтами можно — команда и так в спринтах. Но требования здесь не меняются, а сертификация одна и в конце: как пакет это ближе к каскаду или V-модели.'] },
      hint: 'Кто задаёт требования к интеграции и будут ли они меняться? Что ждёт в конце — демо Нине или формальная проверка вендора?' },
    { id: 'app', t: 'Приложение «Колоса»: предзаказ и торты', sub: 'Нина говорит «хотелками» и будет уточнять на ходу; пилот в 2 пекарнях к 1 февраля, все 9 — к 1 марта', crit: true,
      ok: { iter: 'Требования будут уточняться, а Нине важно видеть результат и решать по ходу. Каждые 2 недели — демо и новый работающий кусок: итеративно-инкрементная разработка, как и записано в договоре.' },
      alt: { inc: [0.5, 'Частями — верно, но объём Нина будет уточнять по ходу: нужно не только «сдаём частями», но и «переделываем по обратной связи».'] },
      hint: 'Насколько ясны требования Нины? Как часто ей нужно видеть результат, чтобы вовремя сказать «не то»?' }
  ];
  function pickEval(v) {
    v = v || {};
    return PROJ.map(p => {
      const got = v[p.id];
      if (got && p.ok[got]) return { p, s: 'ok', pts: 1, why: p.ok[got] };
      if (got && p.alt && p.alt[got]) return { p, s: 'warn', pts: p.alt[got][0], why: p.alt[got][1] };
      return { p, s: 'bad', pts: 0, empty: !got, why: p.hint };
    });
  }
  const pickTask = {
    id: 'pick', title: 'Подберите модель под проект',
    simple: howIter.simple,
    lead: ui.brief({
      situation: 'Игорь собирает портфель «Квант Софт» на квартал: «Подскажи, какую модель взять для каждого из шести проектов — а то у нас всё по привычке спринтами». Среди проектов есть и куски нашего «Колоса».',
      todo: [
        'Для каждого проекта выберите модель в выпадающем списке.',
        'Перед выбором спросите себя: насколько ясны и стабильны требования? Насколько дорога ошибка и нужен ли формальный контроль? Это проект с концом или поток заявок?',
        'Нажмите «Проверить». Засчитывается от 80 % и при верном выборе для приложения «Колоса». Где у практиков нет единого мнения, засчитываются два ответа — с пояснением.'
      ],
      look: 'Модель выбирают не по моде, а по условиям: стабильность требований, цена ошибки и риски, как часто нужен результат, кто и как платит за изменения. В одном большом проекте разные куски могут жить по разным моделям.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: { gov: 'water', startup: 'iter', med: 'v', support: 'flow', kassa: 'v', app: 'iter' } }),
    render(el, ctx) {
      el.classList.add('mdl-root');
      let reveal = null;
      if (ctx.result || ctx.readonly) { const full = ctx.readonly || (ctx.result && ctx.result.ok); reveal = {}; pickEval(ctx.ans.v).forEach(x => { reveal[x.p.id] = { s: x.s, why: full || x.s === 'ok' ? x.why : (x.s === 'warn' ? 'Близко, но не точно. ' : '') + x.p.hint }; }); }
      const d = document.createElement('div'); el.appendChild(d);
      ui.match(d, { rows: PROJ.map(p => ({ id: p.id, t: `<b>${p.t}</b>`, sub: p.sub })), choices: PM, value: ctx.ans.v || {}, reveal, readonly: ctx.readonly, placeholder: 'Выберите модель…', onChange: v => { ctx.ans.v = v; ctx.save(); } });
    },
    check(ans) {
      const ev = pickEval(ans && ans.v), pts = ev.reduce((s, x) => s + x.pts, 0), score = pts / PROJ.length;
      const appOk = ev.find(x => x.p.id === 'app').s === 'ok';
      const notes = [];
      ev.forEach(x => {
        if (x.s === 'warn') notes.push({ ok: 'warn', html: `«${esc(x.p.t)}» — засчитано наполовину: близко, но есть вариант точнее. ${x.p.hint}` });
        if (x.s === 'bad') notes.push({ ok: false, html: `«${esc(x.p.t)}» — ${x.empty ? 'не выбрано. ' : ''}${x.p.hint}` });
      });
      if (!notes.length) notes.push({ ok: true, html: 'Все шесть проектов — по подходящим моделям.' });
      return {
        ok: score >= 0.8 && appOk, score, notes,
        summary: `Точно: ${ev.filter(x => x.s === 'ok').length} из ${PROJ.length}, наполовину: ${ev.filter(x => x.s === 'warn').length}.`,
        mentor: appOk ? null : 'Начните с нашего приложения: вспомните, как Нина формулирует пожелания и как часто она хочет видеть результат.'
      };
    },
    explain: `<p>Короткое правило выбора:</p>
      <ul class="checks">
        <li><b>Требования стабильны, работа по актам</b> — каскад; если проверка каждой стадии важна и формальна — V-модель.</li>
        <li><b>Ошибка опасна, регулятор требует доказательств</b> — V-модель: у каждого требования — своя проверка.</li>
        <li><b>Большие технические риски</b> — спираль: витки, каждый начинают с самого опасного риска.</li>
        <li><b>Требования неясны и будут меняться</b> — итерации с частыми показами (Agile).</li>
        <li><b>Работа — поток заявок без конца</b> — Kanban.</li>
      </ul>
      <p>Посмотрите на «Колос»: в одном проекте живут сразу несколько моделей. Обследование — короткий этап с понятным объёмом, разработка — спринты, интеграция с «КассаПро» — пакет с фиксированным объёмом и сертификацией в конце, сопровождение — поток. Это нормально и называется <b>гибридом</b>.</p>
      <p>Где практики спорят: для госзаказа и интеграции одни выберут каскад, другие — V-модель; для прибора на ранних стадиях применяют и спираль. Важно не название, а аргумент: стабильность требований, цена ошибки, риски, как часто нужен результат.</p>`,
    report: ans => pickEval(ans && ans.v).map(x => `- ${x.p.t} → ${(PM.find(m => m.v === (ans.v || {})[x.p.id]) || { t: '—' }).t} ${x.s === 'ok' ? '✓' : x.s === 'warn' ? '≈' : '✗'}`).join('\n')
  };

  // =====================================================================
  // Практика 3. Договор «Колоса» по частям
  // =====================================================================
  const CB = [{ id: 'fp', t: 'Фиксированная цена', sub: 'fixed price' }, { id: 'tm', t: 'Оплата по факту', sub: 'time & materials' }];
  const CT = [
    { id: 'c1', t: 'Цена и объём известны до начала работ', b: 'fp' },
    { id: 'c2', t: 'Подрядчик закладывает в цену резерв на риски', b: 'fp' },
    { id: 'c3', t: 'Новая функция — через запрос на изменение и допсоглашение', b: 'fp' },
    { id: 'c4', t: 'Если работы оказалось больше, платит подрядчик', b: 'fp' },
    { id: 'c5', t: 'Заказчик платит за фактически отработанные часы', b: 'tm' },
    { id: 'c6', t: 'Заказчик может менять приоритеты на каждом демо', b: 'tm' },
    { id: 'c7', t: 'Если работы оказалось больше, платит заказчик — ему нужны отчёты, демо и потолок бюджета', b: 'tm' },
    { id: 'c8', t: 'Подходит, когда объём будут уточнять по ходу', b: 'tm' },
    { id: 'k1', t: '«Колос», этап 1: обследование — 3 недели, 600 тыс. ₽', sub: 'выявить требования, описать процессы, согласовать объём первой версии', b: 'fp', kol: true, hint: 'Ясно ли заранее, что и сколько времени делают аналитики на обследовании? Неизвестен только результат, а объём работы — вполне.' },
    { id: 'k2', t: '«Колос», этап 2: разработка приложения', sub: 'спринты по 2 недели, демо Нине в конце каждого', b: 'tm', kol: true, hint: 'Будут ли меняться требования к приложению? Кто каждые 2 недели решает, что делать дальше?' },
    { id: 'k3', t: '«Колос»: интеграция с «КассаПро»', sub: 'публичный API, регламент вендора, сертификация 3 недели', b: 'fp', kol: true, hint: 'Кто задаёт объём интеграции и будет ли он меняться? Что обязательно заложить в план заранее?' }
  ];
  function ctEval(v) { v = v || {}; return CT.map(c => ({ c, s: v[c.id] === c.b ? 'ok' : 'bad', empty: !v[c.id] })); }
  const contractTask = {
    id: 'contract', title: 'Договор «Колоса»: что фиксируем, что нет',
    simple: howContract.simple,
    lead: ui.brief({
      situation: 'Игорь показывает договор с «Колосом»: два этапа и отдельный пакет. Прежде чем объяснять его Нине, проверим, что вы сами различаете два вида договоров и понимаете, почему части «Колоса» оформлены именно так. Бюджет «Колоса» на первый год — 6 млн ₽.',
      todo: [
        'Разложите 11 карточек по двум корзинам: нажмите карточку, потом корзину (на компьютере можно перетаскивать).',
        'Восемь карточек — свойства договоров, три — части договора «Колоса».',
        'Нажмите «Проверить». Засчитывается от 80 % и при верных трёх карточках «Колоса».'
      ],
      lookTitle: 'Подсказка',
      look: 'Для каждой карточки спросите: кто платит, если работы окажется больше, чем думали? И что нужно, чтобы поменять объём — подпись или решение на демо?'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(CT.map(c => [c.id, c.b])) }),
    render(el, ctx) {
      el.classList.add('mdl-root');
      let reveal = null;
      if (ctx.result || ctx.readonly) { reveal = {}; ctEval(ctx.ans.v).forEach(x => { reveal[x.c.id] = x.s; }); }
      const d = document.createElement('div'); el.appendChild(d);
      ui.sort(d, { items: CT.map(c => ({ id: c.id, t: c.kol ? `<b>${c.t}</b>` : c.t, sub: c.sub })), buckets: CB, value: ctx.ans.v || {}, reveal, readonly: ctx.readonly, seed: 'mdl-ct', onChange: v => { ctx.ans.v = v; ctx.save(); } });
    },
    check(ans) {
      const ev = ctEval(ans && ans.v), good = ev.filter(x => x.s === 'ok').length, score = good / CT.length;
      const kolBad = ev.filter(x => x.c.kol && x.s !== 'ok'), propBad = ev.filter(x => !x.c.kol && x.s !== 'ok');
      const notes = kolBad.map(x => ({ ok: false, html: `${esc(x.c.t)} — ${x.empty ? 'не разложено. ' : ''}${x.c.hint}` }));
      if (propBad.length) notes.push({ ok: false, html: `Свойства договоров: не на месте ${propBad.length} из 8. Для каждой спросите: кто несёт риск «работы больше» и как меняют объём?` });
      if (!notes.length) notes.push({ ok: true, html: 'Все одиннадцать карточек — в своих корзинах.' });
      return { ok: score >= 0.8 && !kolBad.length, score, notes, summary: `На месте: ${good} из ${CT.length}.` };
    },
    explain: `<p>Договор «Колоса» — <b>гибрид</b>, и каждая часть оформлена под свои условия:</p>
      <ul class="checks">
        <li><b>Обследование — фиксированная цена 600 тыс. ₽, 3 недели.</b> Объём работы аналитиков понятен: интервью, наблюдение, процессы, согласование первой версии. Результат этапа как раз и разгоняет туман — после него понятно, что делать.</li>
        <li><b>Разработка — оплата по факту, спринты по 2 недели.</b> Требования будут уточняться, Нина каждые 2 недели видит демо и решает, что важнее. Изменения не требуют допсоглашений.</li>
        <li><b>«КассаПро» — пакет с фиксированным объёмом.</b> Требования задаёт вендор публичным API и регламентом, они не меняются, а сертификация 3 недели — фиксированный этап, который нельзя «переиграть на демо». Его надо заранее поставить в план до 1 февраля.</li>
      </ul>
      <p>Риск оплаты по факту для Нины — итоговая сумма заранее неизвестна. Его держат бюджетом 6 млн ₽ на год, приоритетами (MoSCoW — на 4-й неделе) и демо. Практики спорят, что надёжнее для заказчика: фиксированная цена кажется спокойнее, но при тумане в требованиях за неё платят резервом и спорами «это входило в ТЗ?».</p>`,
    report: ans => ctEval(ans && ans.v).map(x => `- ${x.c.t} → ${(CB.find(b => b.id === (ans.v || {})[x.c.id]) || { t: '—' }).t} ${x.s === 'ok' ? '✓' : '✗'}`).join('\n')
  };

  // =====================================================================
  // Практика 4. Объясните Игорю (для Нины)
  // =====================================================================
  const IG_RUBRIC = [
    'Одну честную цену за всё приложение сейчас не назвать: требования ещё не ясны и будут меняться — цена была бы с большим запасом или со спорами на каждом изменении',
    'Поэтому сначала обследование с фиксированной ценой (3 недели, 600 тыс. ₽): объём работы понятен, а результат — согласованная первая версия',
    'Разработка — по факту работы, спринтами по 2 недели: Нина каждые 2 недели видит работающее и сама решает, что дальше; изменения не ждут второй версии',
    'Касса отдельно: требования задаёт вендор и они не меняются, объём фиксирован, а сертификация 3 недели — её надо заранее заложить в план',
    'Честно о минусе: итоговая сумма заранее не известна — её держат бюджетом 6 млн ₽, приоритетами («сначала важное») и прозрачностью на демо'
  ];
  const IG_REF = 'Нина Сергеевна, одну честную цену за всё приложение сейчас назвать нельзя: требования ещё не ясны, и вы сами будете их уточнять — так всегда бывает с новым продуктом. Если бы мы назвали цену, в ней был бы большой запас на риски, а каждое ваше «а давайте ещё» превращалось бы в спор и допсоглашение. Поэтому договор в два этапа. Сначала три недели обследования за фиксированные 600 тысяч: мы выясняем, что нужно, описываем процессы и вместе с вами согласуем первую версию. Потом разработка с оплатой по факту, спринтами по две недели: каждые две недели вы видите работающую часть приложения и сами решаете, что делать дальше, — новые идеи не ждут второй версии. Касса — отдельной строкой, потому что там правила задаём не мы и не вы, а «КассаПро»: их требования не меняются, а их проверка занимает три недели, и её надо заранее поставить в план. Честно о минусе: при оплате по факту итоговую сумму заранее не знает никто, поэтому мы держим её в бюджете 6 миллионов на год, делаем сначала самое важное и на каждом показе видно, куда ушли деньги.';
  const igorTask = {
    id: 'igor', title: 'Объясните Игорю: почему у «Колоса» такой договор',
    simple: {
      icon: '🗣️',
      plain: 'Владелице бизнеса не нужны слова «fixed price» и «итерации». Ей нужно понять: почему нельзя одну цену, что она получает взамен и какой у этого минус.',
      analogy: 'Объяснить, почему ремонт старой квартиры делают так: сначала мастер за фиксированную плату вскрывает стены и составляет смету, а дальше работают по факту — неизвестно, что за обоями.',
      tech: 'Аргументы: неопределённость требований → резерв и споры при фиксированной цене; фиксированный этап обследования снимает туман; T&M со спринтами и демо даёт управление приоритетами; пакет «КассаПро» — фиксированный объём от вендора и сертификация; риск бюджета держат потолком, приоритетами и прозрачностью.'
    },
    lead: ui.brief({
      situation: 'Игорь после звонка Нины Сергеевны: «Она спрашивает: почему вы не назовёте одну цену за всё приложение, как строители за ремонт? И почему касса у вас отдельной строкой? Напиши мне 5–8 предложений — перескажу ей своими словами. Без жаргона, она этого не любит».',
      todo: [
        'Напишите 5–8 предложений простым языком (от 200 символов).',
        'Ответьте на два вопроса Нины: почему не одна цена и почему касса отдельно. Скажите, что она получает взамен, и честно — в чём минус.',
        'Нажмите «Проверить с Ксенией (Claude)», если доступно, или «Сверить с эталоном самому» и отметьте пункты, которые у вас прозвучали. Засчитывается от 60 %.'
      ],
      lookTitle: 'На что опереться',
      look: 'Факты: обследование — 3 недели, 600 тыс. ₽; разработка — по факту, спринты по 2 недели с демо; «КассаПро» — публичный API, регламент, сертификация 3 недели; бюджет первого года — 6 млн ₽. Нина ценит, когда её понимают с полуслова, и не любит технических слов.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: IG_REF, self: IG_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('mdl-root');
      el.insertAdjacentHTML('beforeend', ui.say('igor', 'Нина спрашивает: «Почему вы не назовёте одну цену, как строители? И почему касса отдельной строкой?» Помоги — мне нужно 5–8 предложений, которые я ей перескажу.'));
      const j = document.createElement('div'); j.style.marginTop = '12px'; el.appendChild(j);
      ui.justify(j, {
        id: 'mdl-igor', q: 'Почему у «Колоса» договор в два этапа, а касса — отдельным пакетом?',
        qPlain: 'Объясните владелице пекарен без жаргона: почему подрядчик не называет одну цену за всё приложение, почему договор в два этапа (обследование с фиксированной ценой, затем разработка по факту спринтами) и почему интеграция с кассой — отдельный пакет с фиксированным объёмом. Что она получает и какой минус.',
        rubric: IG_RUBRIC, reference: IG_REF, value: ctx.ans.j, readonly: ctx.readonly, minLen: 200,
        onChange: v => { ctx.ans.j = v; ctx.save(); ctx.decide('Договор «Колоса» — объяснение для Нины', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j);
      return {
        ok: s >= 0.6, score: s,
        summary: s ? `Оценка объяснения: ${Math.round(s * 100)} %.` : 'Напишите ответ (от 200 символов) и проверьте его с Ксенией или сверьте с эталоном сами.',
        notes: s && s < 0.6 ? [{ ok: false, html: 'Нине важны три вещи: почему нельзя одну цену (что будет, если всё-таки назвать), что она получает взамен (каждые 2 недели) и почему касса живёт по чужим правилам.' }] : []
      };
    },
    explain: '<p>Хорошее объяснение для заказчика — не про типы договоров, а про <b>причину, выгоду и цену</b>. Причина: требования в тумане, и одна цена означала бы резерв или споры. Выгода: фиксированное обследование снимает туман, а дальше Нина каждые 2 недели видит работающее и управляет приоритетами. Особый случай — касса: её правила задаёт вендор, а сертификация занимает 3 недели. Минус: итоговую сумму заранее не знает никто — его честно называют и показывают, как держат под контролем.</p><p>Обратите внимание: такое объяснение — тоже работа аналитика. Игорь отвечает за договор, но чтобы он мог объяснить его Нине, кто-то должен перевести с языка моделей и договоров на язык её бизнеса.</p>',
    report: ans => (ans.j && ans.j.text) ? ans.j.text : '—'
  };

  // =====================================================================
  TR.stage({
    id: 'models', act: 1, order: 50, slot: 'Чт 10:00', title: 'Каскад, V-модель, итерации',
    when: 'четверг, 10:00 · переговорная «Квант Софт» · Ксения и Игорь',
    intro: [
      { who: 'igor', html: 'Нина Сергеевна по телефону: «Почему вы не назовёте одну цену за всё приложение, как строители за ремонт?» А юрист «КассаПро» прислал регламент: фиксированный объём и три недели сертификации. Мне нужно объяснить ей наш договор в два этапа — и самому ещё раз убедиться, что он правильный.' },
      { who: 'ksenia', html: 'Вчера мы разобрали стадии жизненного цикла. Сегодня — в каком порядке их проходить и как часто показывать результат: это и есть модели жизненного цикла. Сначала потрогаем руками каскад, V-модель, итерации и спираль, потом прогоним наш проект в лаборатории, подберём модели шести проектам — и поможем Игорю с ответом Нине.' }
    ],
    facts: [],
    glossary: [
      { term: 'Модель жизненного цикла', simple: 'Порядок, в котором проходят стадии разработки, и то, как часто заказчик видит результат.', tech: 'Схема организации стадий жизненного цикла ПО во времени: последовательно (каскад), с парными проверками (V-модель), частями (инкрементная), повторяющимися циклами (итеративная), витками по рискам (спиральная).' },
      { term: 'Каскадная модель (waterfall)', simple: 'Свадебный торт по чертежу: всё согласовали заранее, испекли, отдали. Переделать ярус после выпечки — дорого.', tech: 'Стадии идут строго последовательно, выход одной — вход следующей; результат заказчик видит в конце. Картинка — из статьи У. Ройса 1970 года, который сам предупреждал о рисках такой схемы без возвратов.' },
      { term: 'V-модель', simple: 'Каждому шагу рецепта — своя дегустация, и что именно пробовать, решают сразу, когда пишут рецепт.', tech: 'Вариант каскада: каждой стадии разработки (требования, проект системы, архитектура, модули) сопоставлен свой уровень проверки (приёмочные, системные, интеграционные, модульные тесты); план проверки пишут на той же стадии.' },
      { term: 'Инкрементная модель', simple: 'Торт по ярусам: каждый ярус сразу готов и украшен.', tech: 'Объём делят на части (инкременты), которые разрабатывают и поставляют по очереди; каждая часть рабочая, план частей составлен заранее.' },
      { term: 'Итеративная модель', simple: 'Пробная партия, отзывы, поправили рецепт, снова испекли.', tech: 'Цикл «анализ → проект → разработка → проверка» повторяется, и продукт улучшается по обратной связи. Agile-подходы итеративные и инкрементные одновременно.' },
      { term: 'Спиральная модель', simple: 'Каждый круг начинаем с того, что страшнее всего может сломаться, и проверяем это дёшево.', tech: 'Модель Б. Боэма (1986/1988): витки из четырёх четвертей — цели, анализ и снижение рисков (часто прототипом), разработка и проверка, план следующего витка. Для больших рискованных проектов.' },
      { term: 'Fixed price (фиксированная цена)', simple: 'Ремонт «под ключ по смете»: цена известна, но перенос мойки — доплата и новая смета.', tech: 'Договор с закреплёнными объёмом, сроком и ценой; риск перерасхода несёт подрядчик и закладывает резерв; изменения — через запрос на изменение и допсоглашение.' },
      { term: 'Time & materials (оплата по факту)', simple: 'Мастер с почасовой оплатой: планы можно менять, но итоговую сумму никто не знает заранее.', tech: 'Договор с оплатой фактически отработанного времени по ставкам; объём гибкий, риск бюджета у заказчика — нужны прозрачность (демо, отчёты) и потолок бюджета.' },
      { term: 'Запрос на изменение (change request)', simple: 'Записка «хочу не три яруса, а пять» с ответом кондитера: сколько стоит и когда будет.', tech: 'Формальная заявка на изменение согласованного объёма: описание, анализ влияния на сроки и стоимость, решение и подпись. Обязателен при фиксированной цене, полезен в любой модели.' }
    ],
    outro: 'Модель жизненного цикла — не мода, а ответ на вопрос «насколько мы уверены в требованиях и как часто нужно проверять, что делаем то». Каскад хорош, когда всё ясно и стабильно; V-модель — когда проверка должна быть строгой; спираль — когда велики риски; итерации — когда требования будут меняться. У «Колоса» всё сразу: короткое обследование с фиксированной ценой, разработка спринтами, касса — пакетом, сопровождение — потоком. Завтра разберём, что такое Agile на самом деле — и какие мифы вокруг него ходят.',
    tasks: [howWaterfall, howIter, howContract, labTask, pickTask, contractTask, igorTask]
  });
})();
