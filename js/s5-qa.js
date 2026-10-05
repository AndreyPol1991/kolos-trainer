/* Неделя 5, четверг 10:00: аналитик и QA, приёмка.
   Теория: верификация и валидация («испекли по рецепту?» и «испекли то, что хотел клиент?»), ревью требований
   с тестировщиком до разработки (соседний пример — химчистка); тесты из требований — классы эквивалентности,
   граничные значения и таблица решений (соседний пример — доставка кофейни); баг, изменение или недопонимание
   (дерево решений), тестирование в спринте и приёмка заказчиком (UAT), демо — как ломается и как правильно.
   Практика: лаборатория «классы и границы» для правил «Колоса» (22:30, интервалы 07:00–21:00, 48 часов, 25 и 60 тортов) —
   студент выбирает тестовые значения и ожидаемый результат, система показывает, какие ошибки реализации ловит каждое;
   таблица решений отмены предзаказа с пропущенной комбинацией; восемь «багов» Леры; план UAT пилота в 2 пекарнях;
   ответ своими словами — почему Лере нужен аналитик и наоборот. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'qa';

  if (!document.getElementById('qa-css')) document.head.insertAdjacentHTML('beforeend', `<style id="qa-css">
    .qa-root, .qa-root .stack > * { min-width: 0; }
    .qa-root .seg button { white-space: normal; text-align: left; }
    .qa-lbl { font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .qa-lbl.ok { color: var(--ok); } .qa-lbl.bad { color: var(--bad); } .qa-lbl.warn { color: var(--warn); }
    .qa-two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px; align-items: start; }
    .qa-two > * { min-width: 0; }
    .qa-vv { display: grid; grid-template-columns: 110px repeat(2, minmax(0, 1fr)); gap: 6px; align-items: stretch; }
    .qa-vv .h { font: 600 11px/1.3 var(--f-mono); letter-spacing: .05em; text-transform: uppercase; color: var(--text-muted); display: flex; align-items: center; justify-content: center; text-align: center; padding: 4px; }
    .qa-q { border: 1px solid var(--border); border-radius: 10px; padding: 10px; background: var(--surface); text-align: center; color: var(--text); font-size: 13.5px; display: grid; gap: 4px; place-items: center; min-height: 74px; }
    .qa-q .i { font-size: 24px; }
    .qa-q[aria-pressed="true"] { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent) inset; background: var(--accent-soft); }
    .qa-cls { display: grid; gap: 6px; }
    .qa-it { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px; align-items: center; border: 1px solid var(--border); border-radius: 10px; padding: 8px 10px; background: var(--surface); font-size: 14px; }
    .qa-it.ok { border-color: var(--ok); } .qa-it.bad { border-color: var(--bad); }
    .qa-it .btns { display: flex; gap: 5px; flex-wrap: wrap; }
    .qa-req { font-size: 15px; line-height: 1.7; border: 1px solid var(--border-strong); border-radius: 12px; padding: 12px 14px; background: var(--surface); }
    .qa-req mark { background: transparent; color: inherit; border-bottom: 2px dotted var(--text-muted); padding: 0 1px; }
    .qa-req mark.on { background: var(--warn-soft); border-bottom: 2px solid var(--warn); border-radius: 3px; }
    .qa-req mark.done { border-bottom: 2px solid var(--ok); }
    .qa-req.after { border-color: var(--ok); background: var(--ok-soft); }
    .qa-sl { width: 100%; accent-color: var(--accent); }
    .qa-ctl { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
    .qa-big { font: 700 26px/1 var(--f-mono); min-width: 110px; text-align: center; }
    .qa-band { display: grid; grid-template-columns: 1fr 10fr 10fr; gap: 3px; font: 600 11.5px/1.2 var(--f-mono); text-align: center; }
    .qa-band span { padding: 6px 4px; border-radius: 6px; }
    .qa-band .bad { background: var(--bad-soft); color: var(--bad); } .qa-band .warn { background: var(--warn-soft); color: var(--warn); } .qa-band .ok { background: var(--ok-soft); color: var(--ok); }
    .qa-tw { overflow-x: auto; border: 1px solid var(--border); border-radius: 10px; }
    .qa-dt { border-collapse: collapse; width: 100%; font-size: 13px; min-width: 520px; }
    .qa-dt th, .qa-dt td { border-bottom: 1px solid var(--border); padding: 6px 8px; text-align: center; }
    .qa-dt th:first-child, .qa-dt td:first-child { text-align: left; color: var(--text-2); font-weight: 600; white-space: nowrap; }
    .qa-dt th { font: 600 11px/1.3 var(--f-mono); color: var(--text-muted); background: var(--surface-2); }
    .qa-dt td.q { background: var(--warn-soft); color: var(--warn); font-weight: 700; }
    .qa-dt td.y { color: var(--ok); font-weight: 600; } .qa-dt td.n { color: var(--bad); font-weight: 600; }
    .qa-dt td.dash { color: var(--text-muted); }
    .qa-dt td.act { font-weight: 600; color: var(--text); }
    .qa-dt tr.sep td { border-top: 2px solid var(--border-strong); }
    .qa-tree { display: grid; gap: 6px; }
    .qa-node { display: grid; grid-template-columns: 26px minmax(0, 1fr); gap: 8px; align-items: start; border: 1px solid var(--border); border-radius: 10px; padding: 8px 10px; background: var(--surface); font-size: 14px; }
    .qa-node .n { font: 700 12px/1.6 var(--f-mono); color: var(--text-muted); }
    .qa-node .a { color: var(--text-2); font-size: 13px; }
    .qa-node.y { border-left: 4px solid var(--ok); } .qa-node.no { border-left: 4px solid var(--bad); }
    .qa-verdict { border-radius: 12px; padding: 10px 14px; font-size: 14px; display: grid; gap: 4px; border: 2px solid; }
    .qa-verdict b { font: 700 16px/1.3 var(--f-brand); }
    .qa-verdict.defect { border-color: var(--bad); background: var(--bad-soft); } .qa-verdict.change { border-color: var(--violet); background: var(--violet-soft); } .qa-verdict.nobug { border-color: var(--info); background: var(--info-soft); }
    .qa-moments { display: grid; gap: 8px; }
    .qa-mo { display: grid; grid-template-columns: 130px minmax(0, 1fr); gap: 10px; border: 1px solid var(--border); border-left: 4px solid var(--border-strong); border-radius: 10px; padding: 8px 12px; background: var(--surface); font-size: 14px; }
    .qa-mo.ok { border-left-color: var(--ok); } .qa-mo.bad { border-left-color: var(--bad); }
    .qa-mo .k { font: 600 11px/1.6 var(--f-mono); letter-spacing: .05em; text-transform: uppercase; color: var(--text-muted); }
    /* лаборатория границ */
    .qa-rules { display: flex; flex-wrap: wrap; gap: 6px; }
    .qa-rules button { border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text); border-radius: 9px; padding: 6px 10px; font-size: 13px; font-weight: 600; display: inline-flex; gap: 6px; align-items: center; }
    .qa-rules button[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); }
    .qa-rules button .st { font: 600 11px/1 var(--f-mono); padding: 3px 6px; border-radius: 99px; background: var(--surface-3); color: var(--text-2); }
    .qa-rules button .st.ok { background: var(--ok-soft); color: var(--ok); } .qa-rules button .st.bad { background: var(--bad-soft); color: var(--bad); }
    .qa-rule { border: 1px solid color-mix(in srgb, var(--info) 40%, var(--border)); background: var(--info-soft); border-radius: 12px; padding: 10px 14px; font-size: 14.5px; line-height: 1.5; display: grid; gap: 4px; }
    .qa-vals { display: grid; grid-template-columns: repeat(auto-fill, minmax(132px, 1fr)); gap: 6px; }
    .qa-val { border: 1px solid var(--border); border-radius: 10px; background: var(--surface); display: grid; gap: 5px; padding: 6px; min-width: 0; }
    .qa-val.on { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent) inset; }
    .qa-val.cls-y { background: color-mix(in srgb, var(--ok) 10%, var(--surface)); } .qa-val.cls-n { background: color-mix(in srgb, var(--bad) 9%, var(--surface)); }
    .qa-val .vb { border: 0; background: none; color: var(--text); font: 700 15px/1.2 var(--f-mono); text-align: left; padding: 2px 4px; display: flex; gap: 6px; align-items: center; }
    .qa-val .vb .mk { width: 15px; height: 15px; border-radius: 4px; border: 2px solid var(--border-strong); flex: none; }
    .qa-val.on .vb .mk { background: var(--accent); border-color: var(--accent); }
    .qa-val .sub { font: 12px/1.3 var(--f-body); color: var(--text-2); padding: 0 4px; }
    .qa-val .ex { display: flex; gap: 4px; }
    .qa-val .ex button { flex: 1 1 0; border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text-2); border-radius: 7px; padding: 3px 4px; font-size: 11.5px; font-weight: 600; }
    .qa-val .ex button[aria-pressed="true"].y { background: var(--ok-soft); border-color: var(--ok); color: var(--ok); }
    .qa-val .ex button[aria-pressed="true"].n { background: var(--bad-soft); border-color: var(--bad); color: var(--bad); }
    .qa-val .wrong { font-size: 11.5px; color: var(--bad); padding: 0 4px; }
    .qa-bugs { display: grid; gap: 6px; }
    .qa-bug { display: grid; grid-template-columns: 26px minmax(0, 1fr); gap: 8px; align-items: start; border: 1px solid var(--border); border-radius: 10px; padding: 7px 10px; background: var(--surface); font-size: 13.5px; }
    .qa-bug.ok { border-color: var(--ok); } .qa-bug.bad { border-color: var(--bad); background: color-mix(in srgb, var(--bad) 6%, var(--surface)); }
    .qa-bug .ic { font: 700 15px/1.3 var(--f-mono); }
    .qa-bug.ok .ic { color: var(--ok); } .qa-bug.bad .ic { color: var(--bad); }
    .qa-bug .by { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 3px; }
    .qa-bug code { font-size: 12px; }
    /* таблица решений */
    .qa-dtab { border-collapse: collapse; width: 100%; font-size: 13.5px; min-width: 560px; }
    .qa-dtab th, .qa-dtab td { border-bottom: 1px solid var(--border); padding: 6px 8px; text-align: left; vertical-align: middle; }
    .qa-dtab th { font: 600 11px/1.3 var(--f-mono); letter-spacing: .04em; text-transform: uppercase; color: var(--text-muted); background: var(--surface-2); }
    .qa-dtab tr.ok td { background: var(--ok-soft); } .qa-dtab tr.bad td { background: var(--bad-soft); } .qa-dtab tr.warn td { background: var(--warn-soft); }
    .qa-dtab tr.new td:first-child { box-shadow: inset 3px 0 0 var(--accent); }
    .qa-dtab select { max-width: 100%; font-size: 13px; }
    .qa-dtab .n { font: 600 12px/1 var(--f-mono); color: var(--text-muted); }
    @media (max-width: 620px) {
      .qa-dtab { min-width: 0; }
      .qa-dtab thead { display: none; }
      .qa-dtab, .qa-dtab tbody, .qa-dtab tr, .qa-dtab td { display: block; width: 100%; }
      .qa-dtab tr { border-bottom: 2px solid var(--border-strong); padding: 6px 0; }
      .qa-dtab td { border-bottom: 0; padding: 3px 10px; display: grid; grid-template-columns: 112px minmax(0, 1fr); gap: 8px; align-items: center; }
      .qa-dtab td::before { content: attr(data-l); font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .04em; text-transform: uppercase; color: var(--text-muted); }
      .qa-dtab td:last-child:empty { display: none; }
      .qa-dtab select { width: 100%; }
      .qa-dtab td[data-l="Что делает система"] { grid-template-columns: minmax(0, 1fr); gap: 3px; }
    }
    /* баг-репорты */
    .qa-rep { border: 1px solid var(--border); border-radius: 12px; background: var(--surface); padding: 10px 12px; display: grid; gap: 6px; }
    .qa-rep.ok { border-color: var(--ok); } .qa-rep.bad { border-color: var(--bad); } .qa-rep.warn { border-color: var(--warn); }
    .qa-rep .hd { display: flex; flex-wrap: wrap; gap: 6px 10px; align-items: baseline; }
    .qa-rep .hd b { font: 600 14.5px/1.3 var(--f-brand); }
    .qa-rep .id { font: 600 11.5px/1 var(--f-mono); color: var(--text-muted); }
    .qa-rep dl { display: grid; grid-template-columns: 96px minmax(0, 1fr); gap: 3px 10px; margin: 0; font-size: 13.5px; }
    .qa-rep dt { font: 600 10.5px/1.7 var(--f-mono); letter-spacing: .05em; text-transform: uppercase; color: var(--text-muted); }
    .qa-rep dd { margin: 0; min-width: 0; }
    .qa-rep .nx { font-size: 13px; color: var(--text-2); border-top: 1px dashed var(--border); padding-top: 6px; }
    .qa-crit { display: grid; gap: 6px; }
    .qa-ck { display: grid; grid-template-columns: 20px minmax(0, 1fr); gap: 8px; align-items: start; padding: 7px 10px; border: 1px solid var(--border); border-radius: 9px; background: var(--surface); text-align: left; color: var(--text); width: 100%; font-size: 13.5px; line-height: 1.4; }
    .qa-ck .mk { width: 16px; height: 16px; border-radius: 4px; border: 2px solid var(--border-strong); margin-top: 1px; }
    .qa-ck[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .qa-ck[aria-pressed="true"] .mk { background: var(--accent); border-color: var(--accent); }
    .qa-ck.ok { border-color: var(--ok); } .qa-ck.bad { border-color: var(--bad); background: var(--bad-soft); }
    @media (max-width: 760px) {
      .qa-two { grid-template-columns: minmax(0, 1fr); }
      .qa-vv { grid-template-columns: 70px repeat(2, minmax(0, 1fr)); }
      .qa-mo { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .qa-rep dl { grid-template-columns: minmax(0, 1fr); gap: 0; }
      .qa-rep dd { margin-bottom: 4px; }
      .qa-vals { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .qa-it { grid-template-columns: minmax(0, 1fr); }
    }
  </style>`);

  const chip = (t, k) => `<span class="chip ${k || ''}">${t}</span>`;

  // =====================================================================
  // Теория 1. Верификация, валидация, ревью требований
  // =====================================================================
  const VV = {
    'yy': { i: '🎂', t: 'Принято', s: 'Испекли строго по рецепту — и это тот торт, который хотел клиент. Так и должно быть.' },
    'yn': { i: '🥜', t: 'Верификация пройдена, валидация — нет', s: 'Торт по рецепту: шоколадный с орехами. Но у ребёнка аллергия, а при приёме заказа об этом не спросили. Кондитер не виноват — ошибка в требованиях. Проверка «по рецепту» её не найдёт.' },
    'ny': { i: '🍰', t: 'Валидация пройдена, верификация — нет', s: 'Кондитер «улучшил» рецепт — заменил крем. Клиенту даже понравилось. Но это отступление от требований: в следующий раз никто не знает, что печь, а другой клиент обидится.' },
    'nn': { i: '🗑️', t: 'Ни то, ни другое', s: 'Не по рецепту и не то, что нужно. Такое ловят ещё на кухне — если проверяют.' }
  };
  const VV_Q = [
    { t: 'Лера проверила: в 22:31 заказ на завтра не принимается — как в критерии приёмки', ok: 'ver' },
    { t: 'На пилоте Павел: «С кодами выдача в пик идёт быстрее, чем по тетради, пакеты не путаем»', ok: 'val' },
    { t: 'При выдаче пробивается чек полного расчёта — как записано в требовании', ok: 'ver' },
    { t: 'Нина на демо: «Сделано по описанию, но мне нужно, чтобы цех видел заказы раньше 23:00»', ok: 'val' }
  ];
  function drawVV(pane) {
    let cur = 'yn'; const pick = {};
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Два вопроса к готовому торту. Нажмите на клетку.</p>
      <div class="qa-vv">
        <span class="h"></span><span class="h">То, что хотел клиент ✓</span><span class="h">Не то, что хотел ✕</span>
        <span class="h">По рецепту ✓</span><button type="button" class="qa-q" data-vv="yy"><span class="i">🎂</span>принято</button><button type="button" class="qa-q" data-vv="yn"><span class="i">🥜</span>по рецепту, но не то</button>
        <span class="h">Не по рецепту ✕</span><button type="button" class="qa-q" data-vv="ny"><span class="i">🍰</span>понравилось, но не по рецепту</button><button type="button" class="qa-q" data-vv="nn"><span class="i">🗑️</span>брак</button>
      </div>
      <div data-vvo></div>
      ${ui.note('info', 'В софте', '<b>Верификация</b> — «сделали правильно?»: Лера сверяет с требованиями и критериями приёмки. <b>Валидация</b> — «сделали то, что нужно?»: Нина, Павел и кассиры проверяют на своих задачах — на демо и на пилоте. Ошибку в самих требованиях верификация не найдёт: она честно подтвердит, что сделано «по рецепту».')}
      <div class="eyebrow">Что здесь — верификация или валидация?</div>
      <div class="qa-cls" data-vvq></div>
    </div>`;
    function draw() {
      TR.$$('[data-vv]', pane).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.vv === cur)));
      const v = VV[cur];
      TR.$('[data-vvo]', pane).innerHTML = ui.note(cur === 'yy' ? 'ok' : cur === 'nn' ? 'bad' : 'warn', v.t, esc(v.s));
      TR.$('[data-vvq]', pane).innerHTML = VV_Q.map((q, i) => {
        const p = pick[i], st = p ? (p === q.ok ? 'ok' : 'bad') : '';
        return `<div class="qa-it ${st}"><span>${esc(q.t)}${p ? `<div class="small ${st === 'ok' ? '' : 'dim'}">${p === q.ok ? '✓ ' : '✕ Нет: '}${q.ok === 'ver' ? 'сверяем с тем, что записано, — верификация' : 'проверяем, решает ли это задачу людей, — валидация'}</div>` : ''}</span><span class="btns"><button type="button" class="btn xs" data-vq="${i}" data-v="ver" aria-pressed="${p === 'ver'}">Верификация</button><button type="button" class="btn xs" data-vq="${i}" data-v="val" aria-pressed="${p === 'val'}">Валидация</button></span></div>`;
      }).join('');
    }
    TR.on(pane, 'click', '[data-vv]', (e, b) => { cur = b.dataset.vv; draw(); });
    TR.on(pane, 'click', '[data-vq]', (e, b) => { pick[b.dataset.vq] = b.dataset.v; draw(); });
    draw();
  }
  const RV = [
    { m: 'cancel', c: 'А если из пяти вещей две уже в работе — можно отменить остальные три?', fix: 'целиком или отдельные вещи, которые ещё не в работе' },
    { m: 'before', c: 'Как клиент поймёт, что обработка началась? Какой статус — граница?', fix: 'пока вещь в статусе «Принята» (до «В работе»)' },
    { m: 'money', c: 'Все деньги? Куда — на карту, наличными, бонусами?', fix: 'стоимость отменённых вещей — тем же способом, которым платили' },
    { m: 'fast', c: '«Быстро» — это сколько? Как я это проверю на тесте?', fix: 'в течение 3 рабочих дней' }
  ];
  function drawReview(pane) {
    let step = 0;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Соседний пример — требование к приложению химчистки. Аналитик и тестировщица читают его вместе <b>до</b> разработки. Нажимайте «Лера читает дальше».</p>
      <div class="row"><button type="button" class="btn sm primary" data-rv="next">Лера читает дальше →</button><button type="button" class="btn sm ghost" data-rv="reset">⟲ Сначала</button><span class="small dim tnum" data-rvn></span></div>
      <div data-rvt></div><div data-rvc></div><div data-rvs></div>
    </div>`;
    function draw() {
      const on = k => { const i = RV.findIndex(x => x.m === k); return i === step - 1 ? 'on' : i < step - 1 ? 'done' : ''; };
      TR.$('[data-rvn]', pane).textContent = `${Math.min(step, RV.length)} / ${RV.length}`;
      TR.$('[data-rvt]', pane).innerHTML = step > RV.length
        ? `<div class="qa-req after"><span class="qa-lbl ok">После ревью</span><div>Пока вещь в статусе «Принята» (до «В работе»), клиент может отменить заказ целиком или отдельные вещи, которые ещё не в работе. Стоимость отменённых вещей возвращается тем же способом, которым платили, в течение 3 рабочих дней.</div></div>`
        : `<div class="qa-req"><span class="qa-lbl">Требование</span><div>Клиент может <mark class="${on('cancel')}">отменить заказ</mark> <mark class="${on('before')}">до начала обработки</mark>. <mark class="${on('money')}">Деньги возвращаются</mark> <mark class="${on('fast')}">быстро</mark>.</div></div>`;
      const cur = RV[step - 1];
      TR.$('[data-rvc]', pane).innerHTML = cur ? ui.say('lera', esc(cur.c)) + `<p class="small"><b>Договорились:</b> ${esc(cur.fix)}</p>` : step > RV.length ? '' : '<p class="small dim">Два предложения. Сколько вопросов найдёт тестировщица?</p>';
      TR.$('[data-rvs]', pane).innerHTML = step > RV.length ? ui.note('ok', 'Цена ревью', '<b>20 минут на двоих.</b> Если бы те же четыре вопроса всплыли на тесте — около двух дней переделки. В работе у клиентов — ручные возвраты и жалобы. Ревью требований — это тоже тестирование, только документа, без запуска кода.') : '';
      const b = TR.$('[data-rv="next"]', pane); if (b) { b.disabled = step > RV.length; b.textContent = step === RV.length ? 'Показать, что получилось →' : 'Лера читает дальше →'; }
    }
    TR.on(pane, 'click', '[data-rv]', (e, b) => { if (b.dataset.rv === 'next') step++; else step = 0; draw(); });
    draw();
  }
  const howVV = {
    id: 'how-vv', covers: ['bounds', 'bugs'], title: 'Как это работает: верификация, валидация и ревью требований', free: true, noReset: true,
    simple: {
      icon: '🎂',
      plain: 'К готовой работе два разных вопроса. Верификация: сделали правильно — так, как записано в требованиях? Валидация: сделали то, что нужно, — решает ли это задачу бизнеса? Можно идеально сделать не то. Самое дешёвое место, чтобы поймать ошибки обоих видов, — совместное чтение требований до кода.',
      analogy: '«Испекли строго по рецепту?» — верификация. «Испекли тот торт, который хотел клиент?» — валидация. Торт по рецепту, но с орехами для ребёнка-аллергика проверку рецепта прошёл, а заказчика подвёл.',
      tech: '<b>Верификация</b> (verification) — подтверждение, что продукт соответствует заданным требованиям; <b>валидация</b> (validation) — что он отвечает потребностям пользователей и предполагаемому использованию (глоссарий ISTQB; ISO/IEC/IEEE 29148). Короче, по Боэму: «правильно ли мы строим продукт?» и «тот ли продукт мы строим?». <b>Ревью требований</b> — статическое тестирование: дефекты находят в документе без запуска кода.'
    },
    lead: ui.brief({
      situation: 'Лера пришла к вам с распечаткой критериев: «Давай почитаем вместе, пока ребята не начали. Потом будет дороже». Прежде чем браться за тесты «Колоса», разберитесь, что именно и когда проверяют.',
      todo: [
        'Вкладка «Два вопроса к торту»: нажмите на все четыре клетки, затем отнесите четыре фразы к верификации или валидации.',
        'Вкладка «Ревью требований»: нажимайте «Лера читает дальше» и смотрите, как из двух предложений получается проверяемое требование.'
      ],
      look: 'Позиция аналитика: он отвечает за то, чтобы требования были проверяемыми и верными. Ревью он проводит вместе с тестировщиком до разработки, а валидацию — вместе с заказчиком на демо и на пилоте.'
    }),
    render(el) {
      el.classList.add('qa-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'vv', t: 'Два вопроса к торту', render: drawVV },
        { id: 'rv', t: 'Ревью требований с Лерой', render: drawReview }
      ], 'vv');
    }
  };

  // =====================================================================
  // Теория 2. Классы, границы, таблица решений (соседний пример — кофейня)
  // =====================================================================
  const DLV_EXP = v => v <= 0 ? 'нельзя' : v < 1000 ? '150 ₽' : 'бесплатно';
  const DLV_IMPL = [
    { id: 'A', t: 'Разработчик А: «сумма больше 1 000»', f: v => v <= 0 ? 'нельзя' : v > 1000 ? 'бесплатно' : '150 ₽' },
    { id: 'B', t: 'Разработчик Б: опечатка — порог 100 ₽', f: v => v <= 0 ? 'нельзя' : v >= 100 ? 'бесплатно' : '150 ₽' },
    { id: 'C', t: 'Разработчик В: забыл про пустой заказ', f: v => v < 1000 ? '150 ₽' : 'бесплатно' }
  ];
  function drawClasses(pane) {
    let v = 500; const tests = [];
    pane.innerHTML = `<div class="stack">
      <div class="qa-rule"><span class="qa-lbl">Соседний пример · кофейня у дома</span><div>Доставка бесплатна при заказе <b>от 1 000 ₽</b>. Меньше — доставка 150 ₽. Пустой заказ (0 ₽) оформить нельзя.</div></div>
      <div class="qa-band"><span class="bad">0</span><span class="warn">1 … 999 ₽ → 150 ₽</span><span class="ok">1 000 ₽ и больше → бесплатно</span></div>
      <p class="small muted">Три класса эквивалентности: внутри каждого система ведёт себя одинаково — значит, хватит одного представителя. А ошибки прячутся на стыках классов. Три разработчика сделали по-своему. Подберите тесты, которые поймают всех троих.</p>
      <div class="qa-ctl"><button type="button" class="btn sm" data-cv="-100">−100</button><button type="button" class="btn sm" data-cv="-1">−1</button><span class="qa-big tnum" data-cvv></span><button type="button" class="btn sm" data-cv="1">+1</button><button type="button" class="btn sm" data-cv="100">+100</button><button type="button" class="btn sm primary" data-cadd>Добавить тест</button><button type="button" class="btn sm ghost" data-cclr>Очистить</button></div>
      <input type="range" class="qa-sl" min="0" max="2000" step="1" value="${v}" data-cr aria-label="Сумма заказа">
      <div data-ct></div><div data-cs></div>
    </div>`;
    function draw() {
      TR.$('[data-cvv]', pane).textContent = v.toLocaleString('ru-RU') + ' ₽';
      TR.$('[data-cr]', pane).value = v;
      if (!tests.length) { TR.$('[data-ct]', pane).innerHTML = '<p class="small dim">Тестов пока нет. Поставьте сумму и нажмите «Добавить тест».</p>'; TR.$('[data-cs]', pane).innerHTML = ''; return; }
      const cols = ['Сумма', 'Ожидаем'].concat(DLV_IMPL.map(x => x.id));
      const rows = tests.map(t => [`<b class="tnum">${t.toLocaleString('ru-RU')} ₽</b>`, DLV_EXP(t)].concat(DLV_IMPL.map(x => { const r = x.f(t), bad = r !== DLV_EXP(t); return bad ? `<span style="color:var(--bad);font-weight:700">${r} ✕ поймал</span>` : `<span class="dim">${r}</span>`; })));
      TR.$('[data-ct]', pane).innerHTML = ui.table(cols, rows);
      const caught = DLV_IMPL.filter(x => tests.some(t => x.f(t) !== DLV_EXP(t)));
      TR.$('[data-cs]', pane).innerHTML = `<ul class="checks">${DLV_IMPL.map(x => `<li class="${caught.includes(x) ? '' : 'bad'}">${esc(x.t)} — ${caught.includes(x) ? 'пойман' : 'пока проходит все ваши тесты'}</li>`).join('')}</ul>`
        + (caught.length === DLV_IMPL.length ? ui.note('ok', `Все пойманы за ${tests.length} ${TR.plural(tests.length, 'тест', 'теста', 'тестов')}`, tests.length <= 4 ? 'Это и есть приём: по представителю из каждого класса + значения на границе и рядом с ней (999 и 1 000). Для «от 1 000» граница — само 1 000: оно уже бесплатно.' : 'Работает, но тестов много. Какие из них из одного класса и ничего нового не ловят?') : '');
    }
    TR.on(pane, 'click', '[data-cv]', (e, b) => { v = Math.max(0, Math.min(2000, v + (+b.dataset.cv))); draw(); });
    pane.addEventListener('input', e => { if (e.target.matches('[data-cr]')) { v = +e.target.value; TR.$('[data-cvv]', pane).textContent = v.toLocaleString('ru-RU') + ' ₽'; } });
    pane.addEventListener('change', e => { if (e.target.matches('[data-cr]')) { v = +e.target.value; draw(); } });
    TR.on(pane, 'click', '[data-cadd]', () => { if (!tests.includes(v)) { tests.push(v); tests.sort((a, b) => a - b); } draw(); });
    TR.on(pane, 'click', '[data-cclr]', () => { tests.length = 0; draw(); });
    draw();
  }
  const DT_COLS = [];
  [1, 0].forEach(sum => [1, 0].forEach(zone => [1, 0].forEach(reg => DT_COLS.push({ sum, zone, reg }))));
  const dtAct = c => !c.zone ? '?' : c.reg ? 'бесплатно' : c.sum ? 'бесплатно' : '150 ₽';
  function drawDT(pane) {
    let step = 1;
    const ST = [
      { t: 'Выписать условия и действия', n: 'Правило: «Доставка бесплатна, если заказ от 1 000 ₽ и адрес в зоне 3 км. Постоянным клиентам в зоне — всегда бесплатно». Условий три: сумма, зона, постоянный клиент. У каждого два варианта.' },
      { t: 'Перемножить: 2 × 2 × 2 = 8', n: 'Столько разных сочетаний бывает в жизни. Каждое — отдельное правило таблицы, отдельный тест. Пропустите одно — и именно его встретит первый же клиент.' },
      { t: 'Заполнить действия из требования', n: 'Для каждого столбца ищем ответ в тексте правила. Где ответа нет — ставим «?».' },
      { t: 'Найти дыры', n: 'Все четыре столбца «вне зоны» — с вопросом. Правило молчит: доставляем ли мы вне 3 км вообще? Это не решает ни тестировщик, ни разработчик — вопрос владелице кофейни, одной строкой.' },
      { t: 'Свернуть одинаковое', n: 'В зоне постоянному — бесплатно при любой сумме: два столбца сливаются в один, сумма там «не важна» (—). Таблица короче, тестов меньше, а покрытие то же.' }
    ];
    pane.innerHTML = `<div class="stack">
      <div class="row"><button type="button" class="btn sm primary" data-dt="next">Шаг →</button><button type="button" class="btn sm ghost" data-dt="reset">⟲ Сначала</button><span class="small dim tnum" data-dtn></span></div>
      <div data-dtnote></div><div class="qa-tw" data-dtt></div>
    </div>`;
    function draw() {
      const s = ST[step - 1];
      TR.$('[data-dtn]', pane).textContent = `${step} / ${ST.length}`;
      TR.$('[data-dtnote]', pane).innerHTML = ui.note(step === 4 ? 'warn' : 'info', `${step}. ${s.t}`, esc(s.n));
      const yn = v => v ? '<td class="y">да</td>' : '<td class="n">нет</td>';
      let cols = DT_COLS.slice();
      if (step >= 5) cols = cols.filter(c => !(c.zone && c.reg && !c.sum)).map(c => c.zone && c.reg ? Object.assign({}, c, { sum: '—' }) : c);
      if (step === 1) { TR.$('[data-dtt]', pane).innerHTML = `<table class="qa-dt"><tbody><tr><td>Условие 1</td><td>Заказ от 1 000 ₽?</td></tr><tr><td>Условие 2</td><td>Адрес в зоне 3 км?</td></tr><tr><td>Условие 3</td><td>Постоянный клиент?</td></tr><tr class="sep"><td>Действие</td><td>Доставка: бесплатно или 150 ₽</td></tr></tbody></table>`; return; }
      TR.$('[data-dtt]', pane).innerHTML = `<table class="qa-dt"><thead><tr><th>Правило</th>${cols.map((c, i) => `<th>${i + 1}</th>`).join('')}</tr></thead><tbody>
        <tr><td>От 1 000 ₽?</td>${cols.map(c => c.sum === '—' ? '<td class="dash">—</td>' : yn(c.sum)).join('')}</tr>
        <tr><td>В зоне 3 км?</td>${cols.map(c => yn(c.zone)).join('')}</tr>
        <tr><td>Постоянный?</td>${cols.map(c => yn(c.reg)).join('')}</tr>
        <tr class="sep"><td>Доставка</td>${cols.map(c => step < 3 ? '<td class="dash">…</td>' : dtAct(c) === '?' ? `<td class="${step >= 4 ? 'q' : 'act'}">?</td>` : `<td class="act">${dtAct(c)}</td>`).join('')}</tr></tbody></table>`;
    }
    TR.on(pane, 'click', '[data-dt]', (e, b) => { step = b.dataset.dt === 'next' ? Math.min(ST.length, step + 1) : 1; draw(); });
    draw();
  }
  const howTests = {
    id: 'how-tests', covers: ['bounds', 'table'], title: 'Как это работает: тесты из требований — классы, границы, таблица решений', free: true, noReset: true,
    simple: {
      icon: '🧪',
      plain: 'Все значения не проверить — их бесконечно много. Поэтому значения делят на группы, внутри которых система ведёт себя одинаково, и берут по одному из каждой. Плюс значения ровно на границе и рядом — ошибаются чаще всего там. Если правило зависит от нескольких условий, перебирают все сочетания в таблице и находят пропуски.',
      analogy: 'Технолог не пробует каждую булку из партии: берёт по одной с каждого противня. Но первую и последнюю булку смотрит всегда — у краёв противня они подгорают чаще.',
      tech: 'Техники тест-дизайна (ISTQB, «чёрный ящик»): <b>эквивалентное разбиение</b> (equivalence partitioning) — классы валидных и невалидных значений; <b>анализ граничных значений</b> (boundary value analysis) — значение на границе и ближайшие соседи; <b>таблица решений</b> (decision table) — условия × действия, число правил = произведение вариантов условий. Тест-кейс: предусловия, шаги, входные данные, <b>ожидаемый результат</b>.'
    },
    lead: ui.brief({
      situation: 'Лера: «Тесты я придумываю не из головы, а из ваших требований. Чем точнее правило, тем меньше тестов нужно и тем больше ошибок они ловят». Посмотрите, как это работает, на соседнем примере — доставке из кофейни.',
      todo: [
        'Вкладка «Классы и границы»: подбирайте суммы кнопками или ползунком и нажимайте «Добавить тест». Добейтесь, чтобы все три разработчика были пойманы, и как можно меньшим числом тестов.',
        'Вкладка «Таблица решений»: нажимайте «Шаг →» и смотрите, как перебор сочетаний находит дыру в правиле.'
      ],
      look: 'Позиция аналитика: тестировщик выводит тесты из требований, поэтому аналитик пишет правила с точными границами («от 1 000 ₽ включительно») и отвечает на вопросы, которые таблица решений находит в требованиях.'
    }),
    render(el) {
      el.classList.add('qa-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'cls', t: 'Классы и границы', render: drawClasses },
        { id: 'dt', t: 'Таблица решений', render: drawDT }
      ], 'cls');
    }
  };

  // =====================================================================
  // Теория 3. Баг или изменение, UAT, демо
  // =====================================================================
  const TREE = {
    q1: { t: 'Есть ли в требованиях правило про это?', yes: 'q2', no: 'new' },
    q2: { t: 'Система работает так, как записано?', yes: 'q3', no: 'defect' },
    q3: { t: 'Бизнес подтверждает, что правило верное?', yes: 'nobug', no: 'fix' }
  };
  const VERD = {
    defect: { k: 'defect', t: 'Дефект', s: 'В спринт: разработчик чинит, тестировщик перепроверяет по тому же правилу.' },
    nobug: { k: 'nobug', t: 'Не баг: так задумано', s: 'Ответить ссылкой на требование. Если путаются многие — поправить формулировку, памятку или текст на экране.' },
    new: { k: 'change', t: 'Новое требование', s: 'Запрос на изменение: аналитик с командой оценивает влияние, решает владелец продукта, задача — в бэклог.' },
    fix: { k: 'change', t: 'Изменение требования', s: 'Сделано по требованию, но правило устарело или было неверным. Запрос на изменение, решение владельца продукта.' }
  };
  const CASES = [
    { id: 'a', t: 'Скидка 10 % не применилась к заказу на 990 ₽', ans: { q1: [1, 'В требованиях: «скидка 10 % на заказы от 1 000 ₽»'], q2: [1, '990 ₽ меньше 1 000 — скидки и не должно быть'], q3: [1, 'Владелица: порог правильный'] } },
    { id: 'b', t: 'Пальто сдали в пятницу, приложение пишет «готово в воскресенье», а в воскресенье химчистка закрыта', ans: { q1: [1, 'В требованиях: «срок — 3 рабочих дня»'], q2: [0, 'Система считает календарные дни, а не рабочие'] } },
    { id: 'c', t: 'Клиенты просят оплачивать дорогую чистку частями', ans: { q1: [0, 'Об оплате частями в требованиях ни слова'] } },
    { id: 'd', t: 'Напоминание «заберите вещь» приходит за 1 день — клиенты не успевают', ans: { q1: [1, 'В требованиях: «напомнить за 1 день до конца бесплатного хранения»'], q2: [1, 'Напоминание приходит ровно за день'], q3: [0, 'Владелица: «Да, дня мало. Давайте за три»'] } }
  ];
  function drawTree(pane) {
    let cs = 'a', step = 0;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Соседний пример — четыре «бага» химчистки. Выберите случай и проходите вопросы по порядку. Аналитик здесь незаменим: он знает, что записано и кто это решал.</p>
      <div class="row" data-cs></div>
      <div data-tr></div>
    </div>`;
    function draw() {
      TR.$('[data-cs]', pane).innerHTML = CASES.map((c, i) => `<button type="button" class="btn xs" data-case="${c.id}" aria-pressed="${cs === c.id}">Случай ${i + 1}</button>`).join('');
      const c = CASES.find(x => x.id === cs);
      let node = 'q1', h = `<div class="qa-rule"><span class="qa-lbl">Лера пишет</span><div><b>«${esc(c.t)}»</b></div></div><div class="qa-tree">`, k = 0, end = null;
      while (TREE[node] && k < step) {
        const a = c.ans[node];
        h += `<div class="qa-node ${a[0] ? 'y' : 'no'}"><span class="n">${k + 1}</span><div><b>${esc(TREE[node].t)}</b> — ${a[0] ? 'да' : 'нет'}<div class="a">${esc(a[1])}</div></div></div>`;
        node = a[0] ? TREE[node].yes : TREE[node].no; k++;
      }
      if (TREE[node]) h += `<div class="qa-node"><span class="n">${k + 1}</span><div><b>${esc(TREE[node].t)}</b><div><button type="button" class="btn xs primary" data-tn>Проверить по требованиям →</button></div></div></div>`;
      else end = VERD[node];
      h += '</div>';
      if (end) h += `<div class="qa-verdict ${end.k}"><b>${esc(end.t)}</b><span>${esc(end.s)}</span></div>`;
      TR.$('[data-tr]', pane).innerHTML = h;
    }
    TR.on(pane, 'click', '[data-case]', (e, b) => { cs = b.dataset.case; step = 0; draw(); });
    TR.on(pane, 'click', '[data-tn]', () => { step++; draw(); });
    draw();
  }
  const UAT_ROWS = [
    ['Кто проверяет', 'Лера, тестировщица', 'Нина, Павел, кассиры, Галина Ивановна, Олег Петрович'],
    ['Когда', 'в каждом спринте, до демо', 'перед запуском: пилот в 2 пекарнях к 1 февраля 2027'],
    ['Где и на чём', 'тестовый стенд, тестовые данные', 'реальные смены, реальные покупатели и деньги'],
    ['Главный вопрос', '«Сделано по требованиям?» — верификация', '«Это решает нашу задачу?» — валидация'],
    ['По чему проверяют', 'критерии приёмки историй, тест-кейсы', 'сценарии приёмки и критерии «принято», согласованные заранее'],
    ['Итог', 'дефекты и отчёт о тестировании', 'протокол: принято / принято с замечаниями / не принято'],
    ['Что делает аналитик', 'ревью критериев, разбор спорных «багов»', 'готовит сценарии и критерии с заказчиком, ведёт журнал замечаний, разбирает: баг или изменение']
  ];
  function drawUAT(pane) {
    let m = 1;
    pane.innerHTML = `<div class="stack">
      ${ui.seg('um', [{ v: '1', t: '🧪 Тестирование в спринте' }, { v: '2', t: '🥐 Приёмка заказчиком (UAT)' }], String(m), 'accent')}
      <div data-ut></div>
      ${ui.note('info', 'UAT — user acceptance testing', 'Приёмочное тестирование пользователями. Не повторяет работу Леры: проверяет не «по описанию ли», а «можно ли с этим жить». Поэтому сценарии — из реальной смены, а критерии «принято» договариваются <b>до</b> пилота, а не после.')}
    </div>`;
    function draw() { TR.$('[data-ut]', pane).innerHTML = `<div class="qa-moments">${UAT_ROWS.map(r => `<div class="qa-mo ${m === 2 ? 'ok' : ''}"><span class="k">${esc(r[0])}</span><span>${esc(r[m])}</span></div>`).join('')}</div>`; }
    ui.onSeg(pane, (n, v) => { if (n === 'um') { m = +v; draw(); } });
    draw();
  }
  const DEMO = [
    ['Подготовка', 'Слайды: «Выполнено 40 % работ»', 'Сценарий на стенде: заказ на завтра → код → выдача на планшете кассира'],
    ['Кто в зале', 'Только Нина; Павла «не стали отвлекать»', 'Нина, Павел, Галина Ивановна — те, кто будет пользоваться'],
    ['Показ', 'Разработчик показывает таблицы базы и логи', 'Павел сам находит заказ по коду на планшете'],
    ['Вопрос', '«Вам нравится?» — «Ну, красиво»', '«Как это будет в 08:15, когда в очереди десять человек?»'],
    ['Итог', 'Замечания устно, к пятнице забыты', 'Замечания — в журнал: баг, изменение или вопрос; ответственный и срок; бэклог обновлён']
  ];
  function drawDemo(pane) {
    let m = 1;
    pane.innerHTML = `<div class="stack">
      ${ui.seg('dm', [{ v: '1', t: '✕ Как ломается' }, { v: '2', t: '✓ Как правильно' }], String(m), 'accent')}
      <div data-dmo></div>
      <p class="small muted">По Scrum Guide 2020 обзор спринта (Sprint Review) — рабочая сессия с заинтересованными лицами, а не презентация. Демо в конце каждого спринта — ранняя валидация: Нина видит работающий кусок раз в две недели, а не в феврале.</p>
    </div>`;
    function draw() { TR.$('[data-dmo]', pane).innerHTML = `<div class="qa-moments">${DEMO.map(r => `<div class="qa-mo ${m === 2 ? 'ok' : 'bad'}"><span class="k">${esc(r[0])}</span><span>${esc(r[m])}</span></div>`).join('')}</div>`; }
    ui.onSeg(pane, (n, v) => { if (n === 'dm') { m = +v; draw(); } });
    draw();
  }
  const howUAT = {
    id: 'how-uat', covers: ['bugs', 'uat', 'why'], title: 'Как это работает: баг или изменение, приёмка и демо', free: true, noReset: true,
    simple: {
      icon: '🧾',
      plain: 'Не всё, что тестировщик назвал «багом», — ошибка разработчика. Иногда сделано ровно по требованию, но требование устарело — это изменение. Иногда так и задумано, просто не все знали — это недопонимание. Разбирают вместе: аналитик знает, что записано и почему. А финальную проверку — подходит ли система бизнесу — делает сам заказчик.',
      analogy: 'Клиентка вернула торт: «Надпись не та!». Смотрят бланк: на торте ровно как в бланке — значит, ошиблись при приёме заказа, а не кондитер. В бланке «С днём рождения», а на торте «С днём варенья» — виноват кондитер. А если теперь ей нужны ещё и свечи — это новый заказ.',
      tech: '<b>Дефект</b> (bug) — расхождение фактического результата с ожидаемым по требованию (ISTQB). Нет требования или его меняют — <b>запрос на изменение</b> (change request): оценка влияния, решение владельца продукта. <b>Приёмочное тестирование пользователями</b> (UAT) — валидация на реальных сценариях с заранее согласованными критериями приёмки. <b>Демо</b> (Sprint Review) — показ работающего результата спринта и сбор обратной связи.'
    },
    lead: ui.brief({
      situation: 'Лера принесла список «багов» с прошлой недели, а Игорь напомнил: «К пилоту 1 февраля нужен план приёмки с Ниной и Павлом». Посмотрите, как отличить баг от изменения, чем приёмка отличается от тестов Леры и как выглядит хорошее демо.',
      todo: [
        'Вкладка «Баг, изменение или недопонимание»: пройдите все четыре случая химчистки кнопкой «Проверить по требованиям →».',
        'Вкладка «Тесты Леры и UAT»: переключите режимы и сравните строки.',
        'Вкладка «Демо»: переключите «Как ломается» и «Как правильно».'
      ],
      look: 'Позиция аналитика: он судья в спорах «баг или нет» — не по мнению, а по требованиям и журналу решений; он готовит приёмку с заказчиком и следит, чтобы замечания демо попали в бэклог.'
    }),
    render(el) {
      el.classList.add('qa-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'tree', t: 'Баг, изменение или недопонимание', render: drawTree },
        { id: 'uat', t: 'Тесты Леры и UAT', render: drawUAT },
        { id: 'demo', t: 'Демо', render: drawDemo }
      ], 'tree');
    }
  };

  // =====================================================================
  // Практика 1. Лаборатория: классы и границы для правил «Колоса»
  // =====================================================================
  const vv = (list) => list.map((v, i) => Object.assign({ id: 'v' + i }, v));
  const BR = [
    { id: 'cut', t: '22:30', title: 'Приём заказа на завтра',
      rule: 'Заказ на завтра принимается <b>до 22:30</b>: в 23:00 фиксируется план выпечки. По журналу решений из чата спринта: <b>в 22:30:00 приём уже закрыт</b>. Приложение принимает заказы круглосуточно.',
      input: 'Время, когда покупатель оформляет заказ на завтра', y: 'принят', n: 'отклонён', budget: 5,
      hint: 'Посмотрите на оба края класса «принят»: где он кончается вечером — и где начинается?',
      vals: vv([{ t: '00:10', sub: 'ночью', x: 10 }, { t: '07:00', x: 420 }, { t: '12:00', x: 720 }, { t: '22:00', x: 1320 }, { t: '22:29', x: 1349 }, { t: '22:30', x: 1350 }, { t: '22:31', x: 1351 }, { t: '22:59', x: 1379 }, { t: '23:30', x: 1410 }]),
      exp: x => x < 1350,
      bugs: [
        { t: 'Сравнение «не позже 22:30» вместо «раньше 22:30»: в 22:30 ещё принимает', f: x => x <= 1350 },
        { t: 'Перепутали с планом выпечки: принимает до 23:00', f: x => x < 1380 },
        { t: 'Опечатка в константе: закрывает приём в 22:00', f: x => x < 1320 },
        { t: '«После 22:30 закрыто до утра»: ночью заказ на завтра тоже не принимается', f: x => x >= 420 && x < 1350 }
      ] },
    { id: 'slot', t: '07:00–21:00', title: 'Интервал выдачи',
      rule: 'Покупатель выбирает получасовой интервал выдачи <b>с 07:00 до 21:00</b>: первый — 07:00–07:30, последний — 20:30–21:00. Интервал начинается ровно в :00 или в :30.',
      input: 'Начало интервала, который выбирает покупатель', y: 'можно', n: 'нельзя', budget: 6,
      hint: 'У интервалов две границы — утром и вечером, — и ещё одно правило: «ровно в :00 или :30».',
      vals: vv([{ t: '06:30', x: 390 }, { t: '07:00', x: 420 }, { t: '07:15', x: 435 }, { t: '07:30', x: 450 }, { t: '12:00', x: 720 }, { t: '20:30', x: 1230 }, { t: '21:00', x: 1260 }, { t: '21:30', x: 1290 }]),
      exp: x => x >= 420 && x <= 1230 && x % 30 === 0,
      bugs: [
        { t: '«До 21:00» поняли как начало: есть интервал 21:00–21:30', f: x => x >= 420 && x <= 1260 && x % 30 === 0 },
        { t: 'Конец интервала сравнивают «раньше 21:00»: пропал последний интервал 20:30–21:00', f: x => x >= 420 && x + 30 < 1260 && x % 30 === 0 },
        { t: '«Развоз в 06:30» — первый интервал открыли с 06:30', f: x => x >= 390 && x <= 1230 && x % 30 === 0 },
        { t: 'Начало не проверяют на :00 и :30 — можно выбрать 07:15', f: x => x >= 420 && x <= 1230 },
        { t: '«Строго после открытия»: первого интервала 07:00–07:30 нет', f: x => x > 420 && x <= 1230 && x % 30 === 0 }
      ] },
    { id: 'cake', t: '48 часов', title: 'Торт на заказ',
      rule: 'Торт принимается <b>минимум за 48 часов</b> до выдачи — ровно за 48 часов можно. Дата выдачи не может быть в прошлом.',
      input: 'За сколько часов до выдачи оформляют торт', y: 'принят', n: 'отказ', budget: 5,
      hint: 'Кроме границы 48 часов есть ещё один невалидный класс. Какие даты вообще не имеют смысла?',
      vals: vv([{ t: '−72 ч', sub: 'дата 3 дня назад', x: -72 }, { t: '0 ч', sub: 'на сейчас', x: 0 }, { t: '24 ч', x: 24 }, { t: '47 ч', x: 47 }, { t: '48 ч', x: 48 }, { t: '49 ч', x: 49 }, { t: '72 ч', x: 72 }, { t: '336 ч', sub: 'за 2 недели', x: 336 }]),
      exp: x => x >= 48,
      bugs: [
        { t: 'Строго больше 48 часов: ровно за 48 — отказ', f: x => x > 48 },
        { t: 'Перепутали с сутками: хватает 24 часов', f: x => x >= 24 },
        { t: 'Разницу считают без знака: торт «на позапрошлый вторник» принимается', f: x => Math.abs(x) >= 48 }
      ] },
    { id: 'cap', t: '25 / 60 тортов', title: 'Мощность цеха',
      rule: 'Цех делает <b>до 25 тортов в день</b>, в праздничные дни — <b>до 60</b> с дополнительной сменой. Больше принимать нельзя.',
      input: 'Сколько тортов уже принято на эту дату, когда приходит новый заказ', y: 'принять', n: 'отказ', budget: 5,
      hint: 'В правиле два лимита — для обычного дня и для праздника. У каждого своя граница.',
      vals: vv([{ t: '0', sub: 'обычный день', x: { n: 0 } }, { t: '12', sub: 'обычный день', x: { n: 12 } }, { t: '24', sub: 'обычный день', x: { n: 24 } }, { t: '25', sub: 'обычный день', x: { n: 25 } }, { t: '25', sub: 'праздник', x: { n: 25, h: 1 } }, { t: '59', sub: 'праздник', x: { n: 59, h: 1 } }, { t: '60', sub: 'праздник', x: { n: 60, h: 1 } }]),
      exp: x => x.n < (x.h ? 60 : 25),
      bugs: [
        { t: '«Не больше 25» поняли как «принято ≤ 25»: берёт 26-й торт', f: x => x.h ? x.n < 60 : x.n <= 25 },
        { t: 'Отказ уже 25-му торту: сравнивают «меньше 24»', f: x => x.h ? x.n < 60 : x.n < 24 },
        { t: 'Праздничный лимит не включается: 7 марта отказ после 25-го торта', f: x => x.n < 25 },
        { t: 'В праздник берёт 61-й торт: «принято ≤ 60»', f: x => x.h ? x.n <= 60 : x.n < 25 }
      ] }
  ];
  function brEval(r, sel) {
    sel = sel || {};
    const chosen = r.vals.filter(v => Object.prototype.hasOwnProperty.call(sel, v.id));
    const noExp = chosen.filter(v => !sel[v.id]);
    const wrongExp = chosen.filter(v => sel[v.id] && (sel[v.id] === 'y') !== r.exp(v.x));
    const good = chosen.filter(v => sel[v.id] && (sel[v.id] === 'y') === r.exp(v.x));
    const bugs = r.bugs.map((b, i) => ({ b, i, by: good.filter(v => b.f(v.x) !== r.exp(v.x)) }));
    const caught = bugs.filter(x => x.by.length).length;
    const over = chosen.length > r.budget;
    const score = Math.max(0, (caught / r.bugs.length) * 0.7 + (chosen.length ? good.length / chosen.length : 0) * 0.3 - (over ? 0.2 : 0));
    return { chosen, noExp, wrongExp, good, bugs, caught, over, score, done: caught === r.bugs.length && !wrongExp.length && !noExp.length && !over };
  }
  function boundsEval(a) {
    const s = (a && a.s) || {};
    const per = Object.fromEntries(BR.map(r => [r.id, brEval(r, s[r.id])]));
    const score = BR.reduce((t, r) => t + per[r.id].score, 0) / BR.length;
    return { per, score, ok: BR.every(r => per[r.id].done) };
  }
  const boundsTask = {
    id: 'bounds', title: 'Лаборатория: классы и границы для правил «Колоса»',
    simple: {
      icon: '📏',
      plain: 'Делим значения на группы, где система ведёт себя одинаково, и берём по одному из каждой — плюс значения ровно на границе и вплотную к ней. Каждый тест — это значение и ожидаемый результат.',
      analogy: 'Из партии булок пробуют по одной с каждого противня — и обязательно крайние: у краёв они подгорают чаще.',
      tech: 'Эквивалентное разбиение и анализ граничных значений (ISTQB). Тест считается полезным, если он падает на ошибочной реализации и проходит на правильной. Тест с неверным ожидаемым результатом даёт ложную тревогу.'
    },
    lead: ui.brief({
      situation: 'Лера готовит тесты на четыре правила «Колоса». Дима предупредил: «В спринте три разработчика, каждый мог понять границу по-своему». У Леры есть варианты, как их ошибиться, — но какие именно, она вам пока не говорит. Задача — подобрать тестовые значения так, чтобы поймать все ошибки, уложившись в лимит тестов.',
      todo: [
        'Вверху выберите правило: «22:30», «07:00–21:00», «48 часов», «25 / 60 тортов».',
        'В сетке значений отметьте тестовое значение и сразу выберите, что должна сделать система: например, «принят» или «отклонён».',
        'Ниже смотрите список ошибок реализации: какие уже пойманы и каким значением. Непойманные скрыты, пока вы их не поймаете (или нажмите «Показать, какие ошибки ищем»).',
        'Если правильная система не проходит ваш тест — проверьте ожидаемый результат: это ложная тревога.',
        'Нажмите «Проверить». Засчитывается, если в каждом из четырёх правил пойманы все ошибки, все ожидаемые результаты верны и число тестов не больше лимита.'
      ],
      look: 'Ошибки почти всегда сидят на краях классов: «<» вместо «≤», соседняя константа, забытый второй край. Значения из середины класса ловят мало. Позиция аналитика: точные границы в требованиях («в 22:30:00 уже закрыто», «ровно за 48 часов можно») — то, из чего Лера делает тесты.'
    }),
    blank: () => ({ s: {} }),
    reference: () => ({ s: {
      cut: { v0: 'y', v4: 'y', v5: 'n' },
      slot: { v0: 'n', v1: 'y', v2: 'n', v5: 'y', v6: 'n' },
      cake: { v0: 'n', v3: 'n', v4: 'y' },
      cap: { v2: 'y', v3: 'n', v5: 'y', v6: 'n' }
    } }),
    render(el, ctx) {
      el.classList.add('qa-root');
      const a = ctx.ans; a.s = a.s || {};
      let cur = 'cut', show = !!ctx.readonly;
      const rv = !!(ctx.result || ctx.readonly), D = ctx.readonly ? 'disabled' : '';
      el.innerHTML = `<div class="stack"><div class="qa-rules" data-rt></div><div data-rb></div></div>`;
      function draw() {
        const all = boundsEval(a);
        TR.$('[data-rt]', el).innerHTML = BR.map(r => { const e = all.per[r.id]; return `<button type="button" data-rule="${r.id}" aria-pressed="${cur === r.id}">${esc(r.t)}<span class="st ${e.done ? 'ok' : e.chosen.length ? 'bad' : ''}">${e.caught}/${r.bugs.length}</span></button>`; }).join('');
        const r = BR.find(x => x.id === cur), sel = a.s[r.id] || {}, e = all.per[r.id];
        const falseAlarm = e.wrongExp;
        TR.$('[data-rb]', el).innerHTML = `<div class="stack">
          <div class="qa-rule"><span class="qa-lbl">${esc(r.title)}</span><div>${r.rule}</div><div class="small muted">Вход теста: ${esc(r.input)}.</div></div>
          <div class="row between"><span class="eyebrow">Тестовые значения</span>${chip(`тестов: ${e.chosen.length} из ${r.budget}`, e.over ? 'bad' : e.chosen.length ? 'info' : '')}</div>
          <div class="qa-vals">${r.vals.map(v => {
            const on = Object.prototype.hasOwnProperty.call(sel, v.id), ex = sel[v.id] || '';
            const cls = ctx.readonly ? (r.exp(v.x) ? 'cls-y' : 'cls-n') : '';
            const wrong = on && ex && (ex === 'y') !== r.exp(v.x);
            return `<div class="qa-val ${on ? 'on' : ''} ${cls}"><button type="button" class="vb" data-tv="${v.id}" aria-pressed="${on}" ${D}><span class="mk" aria-hidden="true"></span>${esc(v.t)}</button>${v.sub ? `<span class="sub">${esc(v.sub)}</span>` : ''}
              ${on ? `<div class="ex"><button type="button" class="y" data-te="${v.id}" data-v="y" aria-pressed="${ex === 'y'}" ${D}>${esc(r.y)}</button><button type="button" class="n" data-te="${v.id}" data-v="n" aria-pressed="${ex === 'n'}" ${D}>${esc(r.n)}</button></div>${!ex ? '<span class="wrong">что ожидаем?</span>' : wrong ? '<span class="wrong">ложная тревога</span>' : ''}` : ''}</div>`;
          }).join('')}</div>
          ${falseAlarm.length ? ui.note('bad', 'Ложная тревога', `Правильная система не проходит ${TR.plural(falseAlarm.length, 'ваш тест', 'ваши тесты', 'ваши тесты')} ${falseAlarm.map(v => v.t).join(', ')}. Перечитайте правило и ожидаемый результат: такой тест Лера завела бы как баг, а бага нет.`) : ''}
          ${e.over ? ui.note('warn', 'Тестов больше лимита', 'Какие значения из одного класса и ничего нового не ловят?') : ''}
          <div class="row between"><span class="eyebrow">Ошибки реализации · поймано ${e.caught} из ${r.bugs.length}</span>${ctx.readonly ? '' : `<button type="button" class="btn xs ghost" data-show>${show ? 'Скрыть непойманные' : 'Показать, какие ошибки ищем'}</button>`}</div>
          <div class="qa-bugs">${e.bugs.map(x => `<div class="qa-bug ${x.by.length ? 'ok' : rv || e.chosen.length ? 'bad' : ''}"><span class="ic">${x.by.length ? '✓' : '?'}</span><div>${x.by.length || show ? esc(x.b.t) : `Ошибка №${x.i + 1} — пока не поймана`}${x.by.length ? `<div class="by">${x.by.map(v => chip('ловит ' + esc(v.t) + (v.sub ? ' · ' + esc(v.sub) : ''), 'ok')).join('')}</div>` : ''}</div></div>`).join('')}</div>
          ${e.done ? ui.note('ok', 'Правило покрыто', `Все ошибки пойманы за ${e.chosen.length} ${TR.plural(e.chosen.length, 'тест', 'теста', 'тестов')}, ложных тревог нет.`) : ''}
        </div>`;
      }
      el.addEventListener('click', e => {
        const rb = e.target.closest('[data-rule]'); if (rb) { cur = rb.dataset.rule; draw(); return; }
        if (e.target.closest('[data-show]')) { show = !show; draw(); return; }
        if (ctx.readonly) return;
        const tv = e.target.closest('[data-tv]'), te = e.target.closest('[data-te]');
        const s = a.s[cur] = a.s[cur] || {};
        if (tv) { if (Object.prototype.hasOwnProperty.call(s, tv.dataset.tv)) delete s[tv.dataset.tv]; else s[tv.dataset.tv] = ''; }
        else if (te) s[te.dataset.te] = te.dataset.v;
        else return;
        ctx.save(); ctx.decide('Тестовые значения: ' + cur, BR.find(x => x.id === cur).vals.filter(v => v.id in s).map(v => v.t + '→' + (s[v.id] || '?')).join(', '));
        draw();
      });
      draw();
    },
    check(ans) {
      const all = boundsEval(ans), notes = [];
      BR.forEach(r => {
        const e = all.per[r.id];
        if (!e.chosen.length) { notes.push({ ok: false, html: `Правило «${esc(r.t)}»: тестов нет.` }); return; }
        if (e.noExp.length) notes.push({ ok: false, html: `Правило «${esc(r.t)}»: у ${e.noExp.length} ${TR.plural(e.noExp.length, 'теста', 'тестов', 'тестов')} не выбран ожидаемый результат. Тест без ожидания ничего не проверяет.` });
        if (e.wrongExp.length) notes.push({ ok: false, html: `Правило «${esc(r.t)}»: ожидаемый результат расходится с правилом в ${e.wrongExp.length} ${TR.plural(e.wrongExp.length, 'тесте', 'тестах', 'тестах')}. Перечитайте, включена ли граница.` });
        if (e.caught < r.bugs.length) notes.push({ ok: false, html: `Правило «${esc(r.t)}»: поймано ${e.caught} из ${r.bugs.length}. ${esc(r.hint)}` });
        if (e.over) notes.push({ ok: 'warn', html: `Правило «${esc(r.t)}»: ${e.chosen.length} тестов при лимите ${r.budget}. Какие значения лежат в одном классе и ловят одно и то же?` });
        if (e.done) notes.push({ ok: true, html: `Правило «${esc(r.t)}» покрыто: ${e.chosen.length} ${TR.plural(e.chosen.length, 'тест', 'теста', 'тестов')}.` });
      });
      return {
        ok: all.ok, score: all.score, notes,
        summary: `Покрыто правил: ${BR.filter(r => all.per[r.id].done).length} из ${BR.length}. Ошибок поймано: ${BR.reduce((t, r) => t + all.per[r.id].caught, 0)} из ${BR.reduce((t, r) => t + r.bugs.length, 0)}.`,
        mentor: BR.some(r => all.per[r.id].wrongExp.length) ? 'Тест с неверным ожиданием опаснее, чем отсутствие теста: он «находит» баг в правильной системе, и команда чинит то, что работало. Поэтому ожидаемый результат берут из требования, а не из головы, — а аналитик пишет границы так, чтобы их нельзя было понять двояко.' : null
      };
    },
    explain: `<ul class="checks">
        <li><b>22:30.</b> Классы: «принят» с 00:00 до 22:29 и «отклонён» с 22:30. Хватает трёх: <b>22:29</b> (ловит «22:00»), <b>22:30</b> (ловит «≤ 22:30» и «до 23:00») и <b>ночное значение 00:10</b> — приложение круглосуточное, а «закрыто до утра» — частая ошибка. 12:00 ничего не ловит: середина класса.</li>
        <li><b>07:00–21:00.</b> Три невалидных класса: раньше 07:00, позже 20:30 и «не на :00/:30». Границы с обеих сторон: <b>06:30 и 07:00</b> утром, <b>20:30 и 21:00</b> вечером, плюс <b>07:15</b>.</li>
        <li><b>48 часов.</b> <b>47 и 48</b> — граница (ровно 48 можно), <b>−72</b> — класс «дата в прошлом», который легко забыть.</li>
        <li><b>25 / 60.</b> Два лимита — две границы: <b>24 и 25</b> в обычный день, <b>59 и 60</b> в праздник. «Праздник, 59» ловит и выключенный праздничный лимит.</li>
      </ul>
      <p>Тест — это пара «значение + ожидаемый результат». Ожидание берут из требования и журнала решений: «в 22:30:00 уже закрыто» Нина подтвердила в чате спринта. Без этой записи Лера и Дима спорили бы о границе на демо.</p>
      <p class="small muted">Источники: ISTQB Foundation Level — эквивалентное разбиение и анализ граничных значений; Ли Коупленд, «Практическое руководство по разработке тестов».</p>`,
    report: ans => { const all = boundsEval(ans), s = (ans && ans.s) || {}; return BR.map(r => `${r.t}: ${r.vals.filter(v => v.id in (s[r.id] || {})).map(v => `${v.t}${v.sub ? ' (' + v.sub + ')' : ''} → ${(s[r.id] || {})[v.id] === 'y' ? r.y : (s[r.id] || {})[v.id] === 'n' ? r.n : '?'}`).join(', ') || '—'}; поймано ${all.per[r.id].caught}/${r.bugs.length}`).join('\n'); }
  };

  // =====================================================================
  // Практика 2. Таблица решений: отмена предзаказа
  // =====================================================================
  const PAY = { online: 'Онлайн (карта, СБП)', site: 'На месте' };
  const WHEN = { early: 'За 2 часа и раньше', late: 'Позже, меньше чем за 2 часа' };
  const PAID = { y: 'Да', n: 'Нет' };
  const ACT = [
    { v: 'refund', t: 'Отменить, вернуть деньги на ту же карту за 3 рабочих дня' },
    { v: 'keep', t: 'Отменить, деньги за выпечку не возвращать' },
    { v: 'none', t: 'Отменить, возвращать нечего' },
    { v: 'imp', t: 'Невозможное сочетание' },
    { v: 'ask', t: 'Правило молчит — вопрос Нине' }
  ];
  const DT_OK = { 'online-early-y': 'refund', 'online-late-y': 'keep', 'online-early-n': 'none', 'online-late-n': 'none', 'site-early-y': 'imp', 'site-late-y': 'imp', 'site-early-n': 'none', 'site-late-n': 'ask' };
  const DT_LERA = [['online', 'early', 'y'], ['online', 'late', 'y'], ['site', 'early', 'n'], ['online', 'early', 'n'], ['site', 'early', 'y'], ['online', 'late', 'n'], ['site', 'late', 'y']];
  const dkey = r => `${r.pay}-${r.when}-${r.paid}`;
  function dtEval(a) {
    const rows = ((a && a.rows) || []).filter(r => r && r.pay && r.when && r.paid);
    const seen = {}, dup = [];
    rows.forEach(r => { const k = dkey(r); if (seen[k]) dup.push(k); else seen[k] = r; });
    let pts = 0, good = 0;
    const per = {};
    Object.keys(DT_OK).forEach(k => {
      const r = seen[k];
      if (!r) { per[k] = 'miss'; return; }
      const sameAll = rows.filter(x => dkey(x) === k).every(x => x.act === DT_OK[k]);
      if (r.act === DT_OK[k] && sameAll) { pts += 1; good++; per[k] = 'ok'; } else { pts += 0.3; per[k] = 'bad'; }
    });
    const covered = Object.keys(seen).length;
    return { per, good, covered, dup, score: pts / 8, ok: covered === 8 && !dup.length && good >= 7 && per['site-late-n'] === 'ok' };
  }
  const tableTask = {
    id: 'table', title: 'Таблица решений: отмена предзаказа',
    simple: howTests.simple,
    lead: ui.brief({
      situation: 'Лера начала таблицу решений для отмены предзаказа и принесла её вам: «Проверь, всё ли я учла. И что делаем в каждой строке — я не уверена». Правило из требований: «Отмена бесплатно не позже чем за 2 часа до начала интервала; позже — деньги за свежую выпечку не возвращают. Возврат — на ту же карту в течение 3 рабочих дней». Оплата — онлайн при оформлении или на месте при получении.',
      todo: [
        'В каждой строке таблицы выберите в последнем столбце, что делает система.',
        'Посчитайте, сколько сочетаний трёх условий бывает. Если строк меньше — найдите пропущенное сочетание и добавьте его кнопкой «+ Добавить строку», выбрав условия в выпадающих списках.',
        'Если для сочетания правило ничего не говорит — так и отметьте: это вопрос к бизнесу, а не решение Леры или ваше.',
        'Нажмите «Проверить». Засчитывается, если есть все сочетания без повторов, не меньше 7 действий верны и пропущенное сочетание разобрано правильно.'
      ],
      look: 'Три условия по два варианта — сколько это строк? Некоторые сочетания в жизни невозможны: их тоже отмечают, чтобы никто не тратил на них тесты. Позиция аналитика: он отвечает, что делать в каждой строке по требованиям, и несёт Нине вопросы по строкам, где правило молчит.'
    }),
    blank: () => ({ rows: DT_LERA.map(([pay, when, paid]) => ({ pay, when, paid, act: '', lera: true })) }),
    reference: () => ({ rows: DT_LERA.concat([['site', 'late', 'n']]).map(([pay, when, paid], i) => ({ pay, when, paid, act: DT_OK[`${pay}-${when}-${paid}`], lera: i < 7 })) }),
    render(el, ctx) {
      el.classList.add('qa-root');
      const a = ctx.ans; a.rows = Array.isArray(a.rows) ? a.rows : [];
      const rv = !!(ctx.result || ctx.readonly), D = ctx.readonly ? 'disabled' : '';
      const sel = (name, map, val, i) => `<select data-dc="${name}" data-i="${i}" ${D} aria-label="${name}"><option value="">—</option>${Object.keys(map).map(k => `<option value="${k}" ${val === k ? 'selected' : ''}>${esc(map[k])}</option>`).join('')}</select>`;
      function draw() {
        const ev = dtEval(a);
        el.innerHTML = `<div class="stack">
          <div class="qa-tw"><table class="qa-dtab"><thead><tr><th>№</th><th>Оплата</th><th>Когда отменяет</th><th>Деньги уже получены</th><th>Что делает система</th><th></th></tr></thead><tbody>
          ${a.rows.map((r, i) => {
            const k = (r.pay && r.when && r.paid) ? dkey(r) : '', st = rv && k ? (r.act === DT_OK[k] ? 'ok' : 'bad') : '';
            return `<tr class="${st} ${r.lera ? '' : 'new'}"><td class="n" data-l="Строка">${i + 1}</td>
              <td data-l="Оплата">${r.lera ? esc(PAY[r.pay]) : sel('pay', PAY, r.pay, i)}</td>
              <td data-l="Когда отменяет">${r.lera ? esc(WHEN[r.when]) : sel('when', WHEN, r.when, i)}</td>
              <td data-l="Деньги получены">${r.lera ? esc(PAID[r.paid]) : sel('paid', PAID, r.paid, i)}</td>
              <td data-l="Что делает система"><select data-dc="act" data-i="${i}" ${D} aria-label="Действие"><option value="">Выберите…</option>${ACT.map(x => `<option value="${x.v}" ${r.act === x.v ? 'selected' : ''}>${esc(x.t)}</option>`).join('')}</select></td>
              <td>${r.lera || ctx.readonly ? '' : `<button type="button" class="btn xs ghost" data-del="${i}" aria-label="Удалить строку">✕</button>`}</td></tr>`;
          }).join('')}</tbody></table></div>
          <div class="row between">${ctx.readonly ? '<span></span>' : '<button type="button" class="btn sm" data-add>+ Добавить строку</button>'}
            <span class="row">${chip(`строк в таблице: ${a.rows.length}`, '')}${chip(`разных сочетаний: ${ev.covered}`, ev.covered === 8 ? 'ok' : '')}${ev.dup.length ? chip(`повторов: ${ev.dup.length}`, 'bad') : ''}</span></div>
          <p class="small dim">Строки 1–7 — черновик Леры, их условия не меняются. Добавленные строки отмечены полосой слева.</p>
        </div>`;
      }
      el.addEventListener('change', e => {
        const s = e.target.closest('[data-dc]'); if (!s || ctx.readonly) return;
        const r = a.rows[+s.dataset.i]; if (!r) return;
        r[s.dataset.dc] = s.value; ctx.save(); draw();
      });
      el.addEventListener('click', e => {
        if (ctx.readonly) return;
        if (e.target.closest('[data-add]')) { a.rows.push({ pay: '', when: '', paid: '', act: '' }); ctx.save(); draw(); return; }
        const d = e.target.closest('[data-del]'); if (d) { a.rows.splice(+d.dataset.del, 1); ctx.save(); draw(); }
      });
      draw();
    },
    check(ans) {
      const ev = dtEval(ans), notes = [];
      if (ev.covered < 8) notes.push({ ok: false, html: `В таблице ${ev.covered} разных сочетаний. Три условия по два варианта — сколько их должно быть? Переберите по порядку: сначала все строки «онлайн», потом все «на месте».` });
      if (ev.dup.length) notes.push({ ok: 'warn', html: 'Одно и то же сочетание встречается дважды. Повтор не добавляет теста — а если действия разные, таблица противоречит сама себе.' });
      const bad = Object.keys(ev.per).filter(k => ev.per[k] === 'bad');
      if (bad.includes('online-early-y') || bad.includes('online-late-y')) notes.push({ ok: false, html: 'Для онлайн-оплаты проверьте строки ещё раз по правилу: что значит «за 2 часа и раньше» и что — «позже»? Куда и за сколько дней возвращаются деньги?' });
      if (bad.includes('site-early-y') || bad.includes('site-late-y')) notes.push({ ok: false, html: 'Может ли быть так, что покупатель выбрал оплату на месте, а деньги уже получены до выдачи? Если такого не бывает — как это отметить в таблице?' });
      if (bad.includes('online-early-n') || bad.includes('online-late-n') || bad.includes('site-early-n')) notes.push({ ok: false, html: 'В строках, где деньги не получены, подумайте: что тут можно «вернуть» или «не вернуть»?' });
      if (ev.per['site-late-n'] === 'bad') notes.push({ ok: false, html: 'Пропущенное сочетание вы нашли, но что о нём говорит правило? Если правило молчит, кто вправе решить?' });
      if (!notes.length) notes.push({ ok: true, html: 'Восемь сочетаний, два невозможных, одна дыра в требованиях — вопрос Нине.' });
      return {
        ok: ev.ok, score: ev.score, notes,
        summary: `Сочетаний в таблице: ${ev.covered} из 8. Верных действий: ${ev.good} из 8.`,
        mentor: ev.per['site-late-n'] === 'miss' ? 'Пропущенная строка — не случайность: именно о ней не подумали и в требованиях. Таблица решений хороша тем, что честный перебор находит то, о чём никто не спросил.' : null
      };
    },
    explain: `<ul class="checks">
        <li><b>Сколько строк.</b> Оплата (2) × время отмены (2) × деньги получены (2) = <b>8</b>. У Леры 7 — пропущено «на месте, позже 2 часов, денег нет».</li>
        <li><b>Онлайн.</b> Оплачено и раньше 2 часов — возврат на ту же карту за 3 рабочих дня; позже — деньги за свежую выпечку не возвращают. Не оплачено (оплата не прошла) — отменяем, возвращать нечего.</li>
        <li><b>На месте.</b> До выдачи деньги получены быть не могут — оба сочетания «оплачено» невозможны: отмечаем, чтобы не тратить на них тесты. Не оплачено и раньше 2 часов — отменяем, возвращать нечего.</li>
        <li><b>Дыра.</b> На месте, позже 2 часов, денег нет: правило про «не возвращаем деньги» тут не работает — денег нет, а выпечка уже собрана. Можно ли так отменять за пять минут без последствий? Это решение о деньгах и дисциплине покупателей — <b>вопрос Нине</b>. Тот же вопрос Лера задала на груминге, поэтому история «Отмена предзаказа» и не готова к спринту.</li>
      </ul>
      <p class="small muted">Источники: ISTQB Foundation Level — тестирование по таблице решений; Ли Коупленд, «Практическое руководство по разработке тестов».</p>`,
    report: ans => { const ev = dtEval(ans); return ((ans && ans.rows) || []).map((r, i) => `${i + 1}. ${PAY[r.pay] || '?'} · ${WHEN[r.when] || '?'} · получены: ${PAID[r.paid] || '?'} → ${(ACT.find(x => x.v === r.act) || { t: '—' }).t}`).join('\n') + `\nСочетаний: ${ev.covered}/8, верных: ${ev.good}/8`; }
  };

  // =====================================================================
  // Практика 3. Восемь «багов» Леры
  // =====================================================================
  const BCAT = [{ v: 'defect', t: '🐞 Дефект — чинить' }, { v: 'change', t: '🔁 Изменение — запрос' }, { v: 'nobug', t: '✅ Не баг — так задумано' }];
  const BNEXT = {
    defect: 'Дальше: в спринт; Дима чинит, Лера перепроверяет по тому же критерию.',
    change: 'Дальше: запрос на изменение; аналитик с Димой оценивает влияние, решает Нина, задача — в бэклог.',
    nobug: 'Дальше: ответить ссылкой на требование или журнал решений; если путаница повторяется — поправить формулировку.'
  };
  const BUGS = [
    { id: 'KOLOS-141', t: 'Заказ на завтра принят в 22:35', by: 'Лера', steps: 'Понедельник 22:35, приложение, Покровка → «Завтра» → круассан ×2 → оплатить', exp: 'Приём на завтра закрыт, предложено взять из запланированного', act: 'Заказ принят, код К-318', ok: 'defect' },
    { id: 'KOLOS-142', t: 'Неоплаченный заказ на 08:00–08:30 стал «Не выкуплен» в 08:45', by: 'Лера', steps: 'Заказ с оплатой на месте, интервал 08:00–08:30, покупатель не пришёл', exp: 'Держим до 09:00, затем «Не выкуплен»', act: 'В 08:45 статус «Не выкуплен», выпечка ушла на витрину', ok: 'defect' },
    { id: 'KOLOS-143', t: 'Без связи на экране кассира белый экран', by: 'Лера', steps: 'Отключить сеть на планшете кассира, нажать «Выдать» у К-247', exp: 'Офлайн-режим из спецификации: плашка «Нет связи», кнопки работают, чеки уходят потом', act: 'Белый экран, помогает только перезагрузка', ok: 'defect' },
    { id: 'KOLOS-144', t: 'Круассаны недоступны в интервал 07:00–07:30', by: 'Лера', steps: 'Выбрать интервал 07:00–07:30, открыть каталог', exp: 'Все товары доступны для заказа', act: 'Круассаны серые с подписью «первая партия — после 07:20»', ok: 'nobug' },
    { id: 'KOLOS-145', t: 'При оплате на месте нет чека «предоплата»', by: 'Лера', steps: 'Оформить заказ с оплатой на месте', exp: 'Чек «предоплата» при оформлении, как при онлайн-оплате', act: 'При оформлении чека нет; один чек полного расчёта при выдаче', ok: 'nobug' },
    { id: 'KOLOS-146', t: 'Заказ на завтра в 22:30:00 отклонён', by: 'Лера', steps: 'Перевести часы стенда на 22:30:00, оформить заказ на завтра', exp: 'В постановке «до 22:30» — значит, ещё принимаем', act: 'Отклонён: «Приём заказов на завтра закрыт»', ok: 'nobug' },
    { id: 'KOLOS-147', t: 'Нет кнопки «Повторить прошлый заказ»', by: 'Павел на демо', steps: 'Открыть «Мои заказы» у постоянного покупателя', exp: '«Постоянные берут одно и то же — пусть повторяют одной кнопкой»', act: 'Кнопки нет', ok: 'change' },
    { id: 'KOLOS-148', t: 'Кассир видит заказы только ближайших интервалов', by: 'Павел на демо', steps: 'Открыть экран выдачи в 07:40', exp: '«Хочу видеть заказы на два часа вперёд, чтобы собирать заранее»', act: 'Видны текущий интервал и два соседних — как в спецификации экрана', ok: 'change' }
  ];
  function bugsEval(a) {
    const v = (a && a.v) || {}, per = {};
    let good = 0, crit = 0;
    BUGS.forEach(b => { const x = v[b.id]; per[b.id] = !x ? 'none' : x === b.ok ? 'ok' : 'bad'; if (x === b.ok) good++; if (b.ok === 'defect' && x === 'nobug') crit++; });
    return { per, good, crit, score: good / BUGS.length };
  }
  const bugsTask = {
    id: 'bugs', title: 'Восемь «багов» Леры: дефект, изменение или не баг',
    simple: howUAT.simple,
    lead: ui.brief({
      situation: 'Пятница, после демо второго спринта. В трекере восемь новых «багов»: шесть завела Лера, два — Павел прямо на демо. Дима: «Я не возьму в работу то, что не баг. Разберитесь, что из этого чинить». Под рукой — блокнот, критерии историй, спецификация экрана выдачи и журнал решений из чата спринта.',
      todo: [
        'Прочитайте отчёт: шаги, что ожидалось, что получилось и кто завёл.',
        'Выберите: «🐞 Дефект» (система работает не по требованию), «🔁 Изменение» (требования нет в согласованном объёме или его хотят поменять) или «✅ Не баг» (так задумано, ожидание было неверным).',
        'Нажмите «Проверить». Засчитывается от 7 из 8 и если ни один настоящий дефект не назван «не багом».'
      ],
      look: 'Сравнивайте «Ожидалось» не со здравым смыслом, а с требованием: кто записал это ожидание и откуда оно взялось? Позиция аналитика: он судья в спорах «баг или нет» — по требованиям и журналу решений, а изменения относит Нине как запрос с оценкой влияния.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(BUGS.map(b => [b.id, b.ok])) }),
    render(el, ctx) {
      el.classList.add('qa-root');
      const a = ctx.ans; a.v = a.v || {};
      const rv = !!(ctx.result || ctx.readonly), D = ctx.readonly ? 'disabled' : '';
      function draw() {
        const ev = bugsEval(a);
        el.innerHTML = `<div class="stack">${BUGS.map(b => {
          const x = a.v[b.id], st = rv ? (ev.per[b.id] === 'ok' ? 'ok' : 'bad') : '';
          return `<div class="qa-rep ${st}"><div class="hd"><span class="id">${b.id}</span><b>${esc(b.t)}</b><span class="small dim">завёл(а): ${esc(b.by)}</span></div>
            <dl><dt>Шаги</dt><dd>${esc(b.steps)}</dd><dt>Ожидалось</dt><dd>${esc(b.exp)}</dd><dt>Фактически</dt><dd>${esc(b.act)}</dd></dl>
            <div class="row">${BCAT.map(c => `<button type="button" class="btn xs" data-bg="${b.id}" data-v="${c.v}" aria-pressed="${x === c.v}" ${D}>${c.t}</button>`).join('')}</div>
            ${x ? `<div class="nx">${esc(BNEXT[x])}</div>` : ''}</div>`;
        }).join('')}</div>`;
      }
      el.addEventListener('click', e => {
        const b = e.target.closest('[data-bg]'); if (!b || ctx.readonly) return;
        a.v[b.dataset.bg] = b.dataset.v; ctx.save(); ctx.decide('Баг-репорт ' + b.dataset.bg, BCAT.find(c => c.v === b.dataset.v).t); draw();
      });
      draw();
    },
    check(ans) {
      const ev = bugsEval(ans), v = (ans && ans.v) || {}, notes = [];
      BUGS.forEach(b => {
        const p = ev.per[b.id], x = v[b.id];
        if (p === 'none') notes.push({ ok: false, html: `${b.id}: без решения.` });
        else if (p === 'bad' && b.ok === 'defect') notes.push({ ok: false, html: `${b.id}: есть ли требование про это — и выполняется ли оно? Найдите его в блокноте или спецификации экрана.` });
        else if (p === 'bad' && b.ok === 'nobug') notes.push({ ok: false, html: x === 'defect' ? `${b.id}: откуда взялось «Ожидалось»? Сверьте его с правилом в блокноте и журнале решений — работает ли система против правила?` : `${b.id}: нужно ли что-то менять, если поведение совпадает с правилом, а правило никто не оспаривает?` });
        else if (p === 'bad') notes.push({ ok: false, html: `${b.id}: было ли это в согласованном объёме первой версии? Кто решает, добавлять ли новое?` });
      });
      if (!notes.length) notes.push({ ok: true, html: 'Три дефекта в спринт, три «не бага» со ссылкой на правило, два запроса на изменение — Нине.' });
      return {
        ok: ev.good >= 7 && !ev.crit, score: ev.score, notes,
        summary: `Верно: ${ev.good} из ${BUGS.length}.${ev.crit ? ` Настоящих дефектов, названных «не багом»: ${ev.crit}.` : ''}`,
        mentor: ev.crit ? 'Пропустить настоящий дефект хуже, чем поспорить о лишнем: «не баг» закрывает разговор, и ошибка уезжает на пилот — к кассирам и покупателям. Сначала найдите правило, потом решайте.' : null
      };
    },
    explain: `<ul class="checks">
        <li><b>Дефекты (141, 142, 143).</b> Есть правило — система работает против него: 22:30, «держим 30 минут после конца интервала» (до 09:00), офлайн-режим из спецификации экрана.</li>
        <li><b>Не баги (144, 145, 146).</b> Круассаны в 07:00–07:30 недоступны по правилу цеха: первая партия в 07:20. Чек «предоплата» при оплате на месте не нужен — 54-ФЗ. 22:30:00 — решение Нины в журнале. Но сигнал полезный: в постановке до сих пор «до 22:30» — аналитик правит формулировку на «с 22:30 приём закрыт», чтобы спор не повторился.</li>
        <li><b>Изменения (147, 148).</b> «Повторить прошлый заказ» — в списке «можно, если останется время», не в MVP. Список на два часа вперёд — новое пожелание Павла, а сделано по спецификации. Оба — запрос на изменение: оценка с Димой, решение Нины. Не баг, но и не «нет»: хорошие идеи из демо живут в бэклоге.</li>
      </ul>
      <p>Разбор «баг или нет» — работа на двоих: Лера видит расхождение, аналитик знает, что записано и почему. Без аналитика Дима чинил бы «не баги», а изменения прятались бы под видом дефектов и съедали спринт без решения владельца.</p>
      <p class="small muted">Источники: ISTQB — дефект как расхождение с ожидаемым результатом; Карл Вигерс, Джой Битти — управление изменениями требований.</p>`,
    report: ans => { const ev = bugsEval(ans), v = (ans && ans.v) || {}; return BUGS.map(b => `${b.id} ${b.t} → ${v[b.id] ? BCAT.find(c => c.v === v[b.id]).t : '—'} ${ev.per[b.id] === 'ok' ? '✓' : '✗'}`).join('\n'); }
  };

  // =====================================================================
  // Практика 4. План UAT для пилота в 2 пекарнях
  // =====================================================================
  const U_B = [
    { id: 'shop', t: 'Пекарня: Павел и кассиры', sub: 'сценарии на реальной смене' },
    { id: 'back', t: 'Цех и бухгалтерия', sub: 'Галина Ивановна, Олег Петрович' },
    { id: 'nina', t: 'Нина Сергеевна', sub: 'взгляд владельца и решение' },
    { id: 'no', t: 'Не для приёмки пилота', sub: 'проверяют раньше или в другой волне' }
  ];
  const U_I = [
    { id: 'u1', t: 'В пик 07:30–09:00 кассир находит предзаказ по коду и выдаёт; чек полного расчёта пробит', ok: 'shop' },
    { id: 'u2', t: 'Анна Павловна звонит — кассир оформляет предзаказ за неё, оплата на месте', ok: 'shop' },
    { id: 'u3', t: 'Модем отключили на 15 минут: кассир выдаёт заказы офлайн, потом чеки дошли', ok: 'shop' },
    { id: 'u4', t: 'Неоплаченный заказ через 30 минут после интервала стал «Не выкуплен», выпечка вернулась на витрину', ok: 'shop' },
    { id: 'u5', t: 'В 23:00 предзаказы пилотных пекарен — в плане выпечки на планшете цеха', ok: 'back' },
    { id: 'u6', t: 'Утром сводка продаж пилотных пекарен в 1С сходится с кассой', ok: 'back' },
    { id: 'u7', t: 'Сама заказывает на завтра с телефона и забирает на Покровке', ok: 'nina' },
    { id: 'u8', t: 'По итогам пилота решает: принято, принято с замечаниями или нет — и идём ли во все 9 пекарен', ok: 'nina' },
    { id: 'u9', t: 'Заказать торт к 8 Марта с фото-образцом', ok: 'no' },
    { id: 'u10', t: 'Сервер отвечает быстрее 1 секунды при 400 заказах в час', ok: 'no' },
    { id: 'u11', t: 'Нажимать все кнопки подряд и искать, где упадёт', ok: 'no' }
  ];
  const U_K = [
    { id: 'k1', t: 'Все сценарии пройдены на реальных сменах в обеих пилотных пекарнях', good: true },
    { id: 'k8', t: 'Нине понравилось на демо', good: false },
    { id: 'k2', t: 'Критичных дефектов нет; некритичные записаны с ответственным и сроком', good: true },
    { id: 'k3', t: 'За время пилота не потерян ни один предзаказ', good: true },
    { id: 'k9', t: 'Багов нет совсем', good: false },
    { id: 'k4', t: 'После обрыва связи до 15 минут чеки дошли без потерь', good: true },
    { id: 'k5', t: 'Сводка продаж пилотных пекарен в 1С — к 09:00 следующего дня', good: true },
    { id: 'k10', t: 'Лера прогнала все автотесты — значит, принято', good: false },
    { id: 'k6', t: 'Новый кассир после однодневного обучения выдаёт предзаказ по коду без подсказки', good: true },
    { id: 'k11', t: 'Приложение работает быстро и удобно', good: false },
    { id: 'k7', t: 'Нина Сергеевна подписала протокол: «принято» или «принято с замечаниями»', good: true }
  ];
  function uatEval(a) {
    const s = (a && a.s) || {}, k = (a && a.k) || {};
    const sGood = U_I.filter(x => s[x.id] === x.ok).length;
    const kGood = U_K.filter(x => x.good && k[x.id]).length, kBad = U_K.filter(x => !x.good && k[x.id]).length, kAll = U_K.filter(x => x.good).length;
    const sr = sGood / U_I.length, kr = Math.max(0, (kGood - kBad) / kAll);
    return { sGood, kGood, kBad, kAll, score: sr * 0.55 + kr * 0.45, sr, kr };
  }
  const uatTask = {
    id: 'uat', title: 'План приёмки пилота в двух пекарнях',
    simple: howUAT.simple,
    lead: ui.brief({
      situation: 'До пилота 1 февраля 2027 месяц. Предзаказ запускается в двух пекарнях, одна из них — Покровка; торты пойдут во второй волне, к 1 марта. Игорь: «Без подписи Нины во все 9 пекарен не идём. Соберите план приёмки: кто что проверяет и по каким признакам мы скажем „принято“».',
      todo: [
        'Разложите 11 сценариев по исполнителям: кто проверяет его на пилоте. Нажмите на карточку, затем на корзину (или перетащите). Что не относится к приёмке пилота — в последнюю корзину.',
        'Ниже отметьте критерии «принято» — по ним Нина подпишет протокол. Лишнее не отмечайте.',
        'Нажмите «Проверить». Засчитывается от 80 %, если не отмечен ни один «плохой» критерий.'
      ],
      look: 'Приёмка — не повтор тестов Леры. Это реальные люди на реальной смене с реальными деньгами, и вопрос «можно ли с этим жить?». Критерий хорош, если его можно проверить и о нём договорились до пилота. Позиция аналитика: готовит сценарии и критерии вместе с Ниной и Павлом, ведёт журнал замечаний и разбирает их: баг, изменение или вопрос.'
    }),
    blank: () => ({ s: {}, k: {} }),
    reference: () => ({ s: Object.fromEntries(U_I.map(x => [x.id, x.ok])), k: Object.fromEntries(U_K.filter(x => x.good).map(x => [x.id, true])) }),
    render(el, ctx) {
      el.classList.add('qa-root');
      const a = ctx.ans; a.s = a.s || {}; a.k = a.k || {};
      const rv = !!(ctx.result || ctx.readonly), D = ctx.readonly ? 'disabled' : '';
      el.innerHTML = `<div class="stack"><div class="eyebrow">Сценарии приёмки: кто проверяет</div><div data-us></div><div class="eyebrow">Критерии «принято»</div><div class="qa-crit" data-ukl></div></div>`;
      const reveal = rv ? Object.fromEntries(U_I.filter(x => a.s[x.id]).map(x => [x.id, a.s[x.id] === x.ok ? 'ok' : 'bad'])) : null;
      ui.sort(TR.$('[data-us]', el), { items: U_I.map(x => ({ id: x.id, t: esc(x.t) })), buckets: U_B, value: a.s, readonly: ctx.readonly, reveal, seed: 'qa-uat', onChange: v => { a.s = v; ctx.save(); } });
      function drawK() {
        TR.$('[data-ukl]', el).innerHTML = U_K.map(x => { const on = !!a.k[x.id], mk = rv && on ? (x.good ? 'ok' : 'bad') : ''; return `<button type="button" class="qa-ck ${mk}" data-uk="${x.id}" aria-pressed="${on}" ${D}><span class="mk" aria-hidden="true"></span><span>${esc(x.t)}</span></button>`; }).join('');
      }
      el.addEventListener('click', e => {
        const b = e.target.closest('[data-uk]'); if (!b || ctx.readonly || !b.matches('button')) return;
        a.k[b.dataset.uk] = !a.k[b.dataset.uk]; if (!a.k[b.dataset.uk]) delete a.k[b.dataset.uk];
        ctx.save(); ctx.decide('Критерии приёмки пилота', U_K.filter(x => a.k[x.id]).map(x => x.t).join('; ')); drawK();
      });
      drawK();
    },
    check(ans) {
      const ev = uatEval(ans), s = (ans && ans.s) || {}, notes = [];
      const wrong = U_I.filter(x => s[x.id] && s[x.id] !== x.ok), empty = U_I.filter(x => !s[x.id]);
      if (empty.length) notes.push({ ok: false, html: `Не разложено сценариев: ${empty.length}.` });
      if (wrong.some(x => x.ok === 'no')) notes.push({ ok: false, html: 'Среди сценариев приёмки есть то, что проверяют раньше и другими руками, или то, чего нет в пилоте. Что запускается 1 февраля, а что — 1 марта? Кто меряет скорость сервера?' });
      if (wrong.some(x => x.ok !== 'no' && s[x.id] === 'no')) notes.push({ ok: false, html: 'Часть настоящих сценариев пилота вы убрали из приёмки. Кто, кроме кассиров, работает с предзаказами каждый день?' });
      if (wrong.some(x => x.ok !== 'no' && s[x.id] !== 'no')) notes.push({ ok: 'warn', html: 'Некоторые сценарии отданы не тем людям. Кто в «Колосе» встречается с этой ситуацией в своей работе?' });
      if (ev.kGood < ev.kAll) notes.push({ ok: 'warn', html: `Критериев «принято» отмечено ${ev.kGood} из ${ev.kAll} нужных. Вспомните цели «Колоса»: ни одного потерянного заказа, сверка в 1С, кассиры-новички, обрывы связи.` });
      if (ev.kBad) notes.push({ ok: false, html: 'Среди критериев есть те, что нельзя проверить или которые подменяют решение заказчика. Как Нина поймёт по такому критерию, что можно подписывать?' });
      if (!notes.length) notes.push({ ok: true, html: 'План приёмки готов: сценарии у тех, кто живёт с системой, критерии проверяемые и согласованы заранее.' });
      return {
        ok: ev.score >= 0.8 && !ev.kBad, score: ev.score, notes,
        summary: `Сценариев на месте: ${ev.sGood} из ${U_I.length}. Критериев: ${ev.kGood} из ${ev.kAll}, лишних ${ev.kBad}.`
      };
    },
    explain: `<ul class="checks">
        <li><b>Павел и кассиры</b> проверяют то, что будет каждое утро: выдачу по коду в пик, заказ по телефону за Анну Павловну, работу без связи, «Не выкуплен» через 30 минут.</li>
        <li><b>Цех и бухгалтерия</b> — предзаказы в плане выпечки в 23:00 и сводку в 1С. Это тоже пользователи системы, хоть и не стоят у кассы.</li>
        <li><b>Нина</b> проверяет глазами владельца и покупателя и принимает решение — это и есть валидация.</li>
        <li><b>Не для приёмки пилота:</b> торты — во второй волне к 1 марта; скорость сервера при 400 заказах в час проверяет команда нагрузочным тестом до пилота; «нажимать всё подряд» — исследовательское тестирование Леры.</li>
        <li><b>Критерии</b> проверяемые и договорены до пилота: сценарии на реальных сменах, нет критичных дефектов, ни одного потерянного заказа, чеки после обрыва связи, 1С к 09:00, кассир-новичок справляется, подпись Нины. «Понравилось», «багов нет совсем», «быстро и удобно» и «автотесты прошли» — не критерии приёмки.</li>
      </ul>
      <p class="small muted">Источники: ISTQB — приёмочное тестирование пользователями; Карл Вигерс, Джой Битти — критерии приёмки и валидация требований.</p>`,
    report: ans => { const ev = uatEval(ans), s = (ans && ans.s) || {}, k = (ans && ans.k) || {}; return U_B.map(b => `${b.t}: ${U_I.filter(x => s[x.id] === b.id).map(x => x.t).join('; ') || '—'}`).join('\n') + `\nКритерии: ${U_K.filter(x => k[x.id]).map(x => x.t).join('; ') || '—'}\nБалл: ${Math.round(ev.score * 100)} %`; }
  };

  // =====================================================================
  // Практика 5. Почему Лере нужен аналитик и наоборот
  // =====================================================================
  const Q_RUBRIC = [
    'Лере нужны проверяемые требования: критерии с примерами, точные границы (22:29 / 22:30 / 22:31), ожидаемый результат — иначе она сверяет код с кодом, а не с тем, что нужно бизнесу',
    'Аналитик знает источник и смысл правила, ведёт журнал решений и помогает отличить дефект от изменения и недопонимания',
    'Аналитику нужна Лера: ревью требований до разработки и таблицы решений находят неоднозначности и дыры раньше, чем они станут переделкой',
    'Верификация (Лера проверяет по требованиям) и валидация (Нина и Павел на демо и пилоте) — разные вопросы; аналитик связывает их и готовит приёмку с критериями',
    'Есть пример из «Колоса»: пропущенная строка отмены при оплате на месте, решение по 22:30:00, «баг» с круассанами в 07:00 или белый экран без связи',
    'Вывод: работают в паре на всём пути — от ревью до приёмки, а не по схеме «сдал — принял»'
  ];
  const Q_REF = 'Дима, если Лера будет проверять по коду, она проверит, что код делает то, что делает. А ей нужно проверять, что система делает то, что нужно «Колосу». Это знаю я: откуда правило, кто его решил, где граница. Пример — 22:30:00: в постановке было «до 22:30», и без журнала решений Лера завела бы баг на правильную систему, а вы бы его «починили». Из «багов» прошлой недели три были не багами и два — новыми пожеланиями Павла; отличить их можно только по требованиям, иначе вы чините не то, а изменения проходят мимо Нины. И наоборот: мне Лера нужна до разработки. На ревью она за 20 минут находит то, что я пропустил: в таблице отмены не было строки «оплата на месте, отмена позже 2 часов» — правило молчало, и это вопрос к Нине, а не к коду. Её классы и границы — 22:29, 22:30, 22:31, ночное 00:10 — заставляют меня писать правила точно. Лера отвечает за верификацию — сделано ли по требованиям; я вместе с Ниной и Павлом — за валидацию на демо и на пилоте, с критериями приёмки, о которых договорились заранее. Так что мы не «сдал — принял», а пара на всём пути: от ревью требований до подписи Нины.';
  const whyTask = {
    id: 'why', title: 'Ответ Диме: почему Лере нужен аналитик и наоборот',
    simple: howVV.simple,
    lead: ui.brief({
      situation: 'Ретроспектива второго спринта. Дима: «Давайте упростим: Лера берёт задачи прямо у нас и проверяет по коду. Аналитику не надо тратить время на тесты, разбор багов и приёмку — пусть пишет требования для следующего спринта».',
      todo: [
        'Ответьте Диме своими словами: 6–10 предложений, от 300 символов. Объясните, зачем Лере аналитик — и зачем аналитику Лера.',
        'Опирайтесь на сегодняшнее: границы 22:30, таблицу отмены, восемь «багов», план приёмки.',
        'Нажмите «Проверить с Ксенией (Claude)» или «Сверить с эталоном самому», затем «Проверить». Засчитывается от 60 %.'
      ],
      look: 'Сильный ответ — с примерами из «Колоса», а не общими словами про «коммуникацию». Позиция аналитика: он отвечает за то, чтобы требования были проверяемыми и верными, и потому работает с тестировщиком на всём пути задачи.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: Q_REF, self: Q_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('qa-root');
      const a = ctx.ans; a.j = a.j || {};
      el.innerHTML = ui.say('dima', 'Давайте упростим: Лера берёт задачи прямо у нас и проверяет по коду. Аналитику не надо тратить время на тесты, разбор багов и приёмку.') + ui.say('lera', 'Я не уверена… Но объясните Диме вы — вам виднее, зачем мы друг другу.') + '<div style="margin-top:12px"></div>';
      const j = document.createElement('div'); el.appendChild(j);
      ui.justify(j, {
        id: 'qa-why', q: 'Ответ Диме: зачем Лере аналитик и зачем аналитику Лера?', placeholder: 'Дима, …',
        qPlain: 'Ответьте тимлиду, который предлагает, чтобы тестировщица проверяла задачи прямо по коду без участия аналитика. Объясните на кейсе сети пекарен, зачем тестировщику аналитик и зачем аналитику тестировщик: проверяемые требования, разбор багов, ревью требований, верификация и валидация, приёмка.',
        rubric: Q_RUBRIC, reference: Q_REF, value: a.j, readonly: ctx.readonly, minLen: 300,
        onChange: v => { a.j = v; ctx.save(); ctx.decide('Ответ Диме про аналитика и QA', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j), t = ((ans && ans.j && ans.j.text) || '').trim(), notes = [];
      if (t.length < 300) notes.push({ ok: false, html: `Ответ короче 300 символов (${t.length}). Дима инженер — убедят примеры, а не общие слова.` });
      if (!(ans && ans.j && (ans.j.ai || ans.j.self))) notes.push({ ok: false, html: 'Проверьте ответ: «Проверить с Ксенией» или «Сверить с эталоном самому» — и отметьте пункты, которые у вас есть.' });
      else if (s < 0.6) notes.push({ ok: false, html: 'Пока мало пунктов. Подумайте в обе стороны: что Лера не может без аналитика — и что аналитик не увидит без Леры? И про два разных вопроса к готовой работе.' });
      else notes.push({ ok: true, html: `Ответ: ${Math.round(s * 100)} %.` });
      return { ok: s >= 0.6 && t.length >= 300, score: s, notes };
    },
    explain: `<p>Главная мысль: <b>тестировщик проверяет по требованиям, а за требования отвечает аналитик</b>. Если убрать аналитика, Лера будет сверять код с кодом — и честно подтверждать ошибки в требованиях. Если убрать Леру, аналитик не увидит неоднозначностей, пока их не найдёт покупатель.</p>
      <p>В «Колосе» это видно на каждом шаге: граница 22:30:00 из журнала решений, пропущенная строка в таблице отмены, «баги», которые оказались правилами цеха и 54-ФЗ, приёмка пилота с критериями, о которых договорились заранее.</p>
      <p class="small muted">Источники: ISTQB — статическое тестирование и приёмка; Гойко Аджич, «Specification by Example» — требования и тесты как одна живая документация; практика трёх амиго.</p>`,
    report: ans => `Ответ Диме: ${(ans && ans.j && ans.j.text) || '—'}`
  };

  // =====================================================================
  TR.stage({
    id: ID, act: 5, order: 440, slot: 'Чт 10:00', title: 'Аналитик и QA: приёмка',
    when: 'четверг, 10:00 · второй спринт, завтра демо · стол Леры в опенспейсе «Квант Софт»',
    intro: [
      { who: 'lera', html: 'Прочитала вчерашний журнал решений: в 22:30:00 приём уже закрыт. Наконец есть что проверять! Но у меня ещё восемь «багов», и я не уверена, что все они баги.' },
      { who: 'igor', html: 'И к пилоту 1 февраля нужен план приёмки с Ниной и Павлом. Без подписи Нины во все 9 пекарен не идём.' },
      { who: 'ksenia', html: 'Сегодня — как аналитик работает с тестировщиком: требования читаем вместе до кода, тесты выводим из правил, спорные «баги» разбираем по требованиям, а итог проверяет сам заказчик. Лера — ваш лучший союзник, а не контролёр.' }
    ],
    facts: ['F-cutoff', 'F-slot', 'F-hold', 'F-cancel', 'F-refund', 'F-cake48', 'F-cakecap', 'F-pay', 'F-54fz', 'F-batch', 'F-net', 'F-1c', 'F-deadline', 'F-elder', 'F-hours'],
    glossary: [
      { term: 'Верификация', simple: 'Проверка «сделали правильно»: так, как записано в требованиях.', tech: 'Verification — подтверждение соответствия продукта заданным требованиям (ISTQB). По Боэму: «правильно ли мы строим продукт?».' },
      { term: 'Валидация', simple: 'Проверка «сделали то, что нужно»: решает ли это задачу бизнеса и людей.', tech: 'Validation — подтверждение, что продукт отвечает потребностям пользователей и предполагаемому использованию. По Боэму: «тот ли продукт мы строим?».' },
      { term: 'Ревью требований', simple: 'Команда читает требования до разработки и ищет дыры, неоднозначности и непроверяемое.', tech: 'Статическое тестирование документа (ISTQB): дефекты находят без запуска кода. Самый дешёвый способ поймать ошибку требований.' },
      { term: 'Тест-кейс', simple: 'Записанная проверка: что дано, что делаем, что должно получиться.', tech: 'Предусловия, входные данные, шаги и ожидаемый результат для проверки конкретного требования (ISTQB). Без ожидаемого результата тест ничего не проверяет.' },
      { term: 'Класс эквивалентности', simple: 'Группа значений, при которых система ведёт себя одинаково: достаточно проверить одно.', tech: 'Equivalence partitioning — разбиение входных данных на валидные и невалидные классы; из каждого берут представителя.' },
      { term: 'Граничное значение', simple: 'Значение ровно на границе правила и рядом: 22:29, 22:30, 22:31.', tech: 'Boundary value analysis — тесты на краях классов эквивалентности: ошибки вида «< вместо ≤» прячутся именно там.' },
      { term: 'Таблица решений', simple: 'Таблица всех сочетаний условий и того, что система делает в каждом.', tech: 'Decision table: условия × действия; число правил — произведение вариантов условий (2 × 2 × 2 = 8). Находит пропущенные и невозможные сочетания.' },
      { term: 'Дефект (баг)', simple: 'Система работает не так, как записано в требованиях.', tech: 'Defect — расхождение фактического результата с ожидаемым. Если требования нет или оно неверно — это не дефект кода, а запрос на изменение или вопрос к бизнесу.' },
      { term: 'Запрос на изменение', simple: 'Просьба сделать иначе или добавить новое после того, как требования согласованы.', tech: 'Change request — оценивают влияние на сроки и деньги, решает владелец продукта. Подробно — в тренировке «Изменения и конфликты».' },
      { term: 'Приёмочное тестирование (UAT)', simple: 'Заказчик и будущие пользователи проверяют систему на своих задачах и решают, принять ли её.', tech: 'User Acceptance Testing — валидация на реальных сценариях и данных с заранее согласованными критериями приёмки. Итог — протокол «принято / принято с замечаниями / не принято».' }
    ],
    outro: 'Теперь вы и Лера — пара, а не «сдал — принял». Требования вы читаете вместе до кода, тесты выводятся из правил — классы, границы, таблицы решений, — а спорные «баги» разбираете по требованиям и журналу решений: дефект, изменение или недопонимание. Итог проверяет не Лера, а Нина, Павел и кассиры на пилоте — по критериям, о которых договорились заранее. Завтра — что делать, когда требования меняются, а люди спорят.',
    tasks: [howVV, howTests, howUAT, boundsTask, tableTask, bugsTask, uatTask, whyTask]
  });
})();
