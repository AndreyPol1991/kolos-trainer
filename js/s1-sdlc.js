/* Неделя 1, среда 10:00 — «Жизненный цикл».
   Теория: стадии жизненного цикла рядом с путём торта (вход, выход, кто главный, что делает аналитик);
   цепочка входов и выходов («убери артефакт — посмотри, кто гадает») и стандарты (ГОСТ 34.601, ISO/IEC/IEEE 12207);
   рост стоимости ошибки на пекарне («соль вместо сахара») и честный разговор об эвристике «×10».
   Практика: расставить события «Колоса» по жизни системы; паспорт артефактов (выход и вход);
   лаборатория «забыли правило 22:30»; аналитик на каждой стадии; ответ Нине «зачем обследование». */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;

  if (!document.getElementById('sdlc-css')) document.head.insertAdjacentHTML('beforeend', `<style id="sdlc-css">
    .sdlc-root, .sdlc-root .stack > * { min-width: 0; }
    .sdlc-root .seg button { white-space: normal; text-align: left; }
    .sdlc-root .btn { white-space: normal; }
    .sdlc-h3 { margin: 2px 0 0; font: 600 19px/1.3 var(--f-brand); }
    .sdlc-steps { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 6px; }
    .sdlc-steps.six { grid-template-columns: repeat(6, minmax(0, 1fr)); }
    .sdlc-st { display: grid; justify-items: center; align-content: start; gap: 4px; padding: 8px 4px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); color: var(--text-2); font-size: 12px; line-height: 1.2; text-align: center; cursor: pointer; min-width: 0; position: relative; }
    .sdlc-st .n { width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center; background: var(--surface-3); font: 700 12px/1 var(--f-mono); color: var(--text); flex: none; }
    .sdlc-st .ic { font-size: 18px; line-height: 1; }
    .sdlc-st .nm { min-width: 0; overflow-wrap: break-word; }
    .sdlc-st .sub { font-size: 11px; color: var(--text-muted); }
    .sdlc-st[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--text); box-shadow: 0 0 0 1px var(--accent); }
    .sdlc-st[aria-pressed="true"] .n { background: var(--accent); color: var(--accent-text); }
    .sdlc-st.seen::after { content: "✓"; position: absolute; top: 4px; right: 6px; font-size: 11px; color: var(--ok); }
    .sdlc-st.ok { border-color: var(--ok); }
    .sdlc-st.bad { border-color: var(--bad); }
    .sdlc-st.ok .n { background: var(--ok-soft); color: var(--ok); }
    .sdlc-st.bad .n { background: var(--bad-soft); color: var(--bad); }
    .sdlc-ex { padding: 10px 12px; border-radius: 10px; background: var(--surface); border: 1px dashed var(--border-strong); font-size: 14.5px; }
    .sdlc-flow { display: grid; grid-template-columns: minmax(0, 1fr) 24px minmax(0, 1.1fr) 24px minmax(0, 1fr); gap: 6px; align-items: stretch; }
    .sdlc-flow .arr { display: grid; place-items: center; color: var(--text-muted); font-size: 18px; }
    .sdlc-box { padding: 10px 12px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface); font-size: 14px; min-width: 0; }
    .sdlc-box > b:first-child { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: var(--text-muted); margin-bottom: 4px; }
    .sdlc-box.mid { border-color: color-mix(in srgb, var(--accent) 55%, var(--border)); background: var(--accent-soft); }
    .sdlc-an { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px 14px; align-items: start; padding: 12px 14px; border-radius: 10px; border: 1px solid color-mix(in srgb, var(--violet) 45%, var(--border)); background: var(--violet-soft); font-size: 14px; }
    .sdlc-dots { display: inline-flex; gap: 3px; padding-top: 3px; }
    .sdlc-dots i { width: 10px; height: 10px; border-radius: 50%; background: var(--surface-3); border: 1px solid var(--border-strong); }
    .sdlc-dots i.on { background: var(--violet); border-color: var(--violet); }
    .sdlc-load { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 6px; padding: 10px 8px 6px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); }
    .sdlc-load .col { display: grid; grid-template-rows: 90px auto; gap: 4px; justify-items: center; min-width: 0; }
    .sdlc-load .bw { position: relative; width: 100%; display: flex; align-items: flex-end; justify-content: center; }
    .sdlc-load .bar { width: 100%; max-width: 44px; border-radius: 6px 6px 2px 2px; background: color-mix(in srgb, var(--violet) 70%, transparent); }
    .sdlc-load .bar.cur { background: var(--accent); }
    .sdlc-load .lb { font-size: 10.5px; color: var(--text-muted); text-align: center; line-height: 1.15; overflow-wrap: break-word; min-width: 0; }
    .sdlc-chain { display: grid; }
    .sdlc-node { padding: 9px 12px; border: 1px solid var(--border); border-left: 4px solid var(--ok); border-radius: 10px; background: var(--surface); display: grid; gap: 3px; font-size: 14px; }
    .sdlc-node.bad { border-left-color: var(--bad); background: var(--bad-soft); }
    .sdlc-node.warn { border-left-color: var(--warn); }
    .sdlc-node .ttl { font-weight: 600; }
    .sdlc-link { display: grid; grid-template-columns: 26px minmax(0, 1fr) auto; gap: 8px; align-items: center; padding: 5px 0 5px 8px; }
    .sdlc-link .ar { color: var(--text-muted); font-size: 16px; text-align: center; }
    .sdlc-link .art { font-size: 13.5px; padding: 4px 10px; border-radius: 8px; border: 1px dashed var(--border-strong); background: var(--surface-2); min-width: 0; }
    .sdlc-link.off .art { text-decoration: line-through; color: var(--text-muted); border-color: var(--bad); }
    .sdlc-loop { margin-top: 8px; padding: 8px 12px; border-radius: 10px; border: 1px dashed var(--info); color: var(--text-2); font-size: 13.5px; }
    .sdlc-chart { border: 1px solid var(--border); border-radius: 10px; background: var(--surface); padding: 24px 10px 8px; }
    .sdlc-chart .plot { position: relative; height: 150px; display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 8px; border-bottom: 1px solid var(--border-strong); }
    .sdlc-chart .col { position: relative; height: 100%; display: flex; align-items: flex-end; justify-content: center; z-index: 1; min-width: 0; }
    .sdlc-chart .bar { position: relative; width: 100%; max-width: 56px; border-radius: 6px 6px 0 0; background: var(--border-strong); }
    .sdlc-chart .bar.cur { background: var(--bad); }
    .sdlc-chart .bar .v { position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: 2px; font: 600 11px/1.3 var(--f-mono); color: var(--text-2); white-space: nowrap; }
    .sdlc-chart .bar.cur .v { color: var(--bad); }
    .sdlc-chart .labels { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 8px; margin-top: 6px; }
    .sdlc-chart .lb { font-size: 11px; line-height: 1.2; color: var(--text-muted); text-align: center; overflow-wrap: break-word; min-width: 0; }
    .sdlc-gl { position: absolute; left: 0; right: 0; border-top: 1px dashed var(--border); z-index: 0; }
    .sdlc-gl span { position: absolute; left: 2px; top: -13px; font: 10px/1 var(--f-mono); color: var(--text-muted); }
    .sdlc-redo { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
    .sdlc-redo .it { display: flex; gap: 8px; align-items: flex-start; padding: 6px 10px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); font-size: 13.5px; color: var(--text-muted); min-width: 0; }
    .sdlc-redo .it::before { content: "○"; flex: none; }
    .sdlc-redo .it.on { border-color: color-mix(in srgb, var(--bad) 50%, var(--border)); background: var(--bad-soft); color: var(--text); }
    .sdlc-redo .it.on::before { content: "↺"; color: var(--bad); font-weight: 700; }
    .sdlc-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    .sdlc-stats .v { font-size: 18px; overflow-wrap: anywhere; }
    .sdlc-ppl { display: flex; flex-wrap: wrap; gap: 6px; }
    .sdlc-ppl .chip { gap: 6px; padding: 2px 10px 2px 3px; }
    .sdlc-ppl .avatar { width: 20px; height: 20px; font-size: 8.5px; }
    .sdlc-io { display: grid; gap: 8px; }
    .sdlc-io-row { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr); gap: 8px 12px; align-items: end; padding: 10px 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); }
    .sdlc-io-row.ok { border-color: var(--ok); }
    .sdlc-io-row.warn { border-color: var(--warn); }
    .sdlc-io-row.bad { border-color: var(--bad); }
    .sdlc-io-row .t { align-self: center; font-size: 14px; }
    .sdlc-io-row .field > span { font-size: 12px; color: var(--text-muted); }
    .sdlc-io-row select.ok { border-color: var(--ok); }
    .sdlc-io-row select.bad { border-color: var(--bad); }
    .sdlc-io-row .why { grid-column: 1 / -1; font-size: 13px; color: var(--text-2); }
    .sdlc-aw { display: grid; gap: 10px; }
    .sdlc-awnav { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 4px; }
    .sdlc-awnav .sdlc-st { padding: 6px 2px; font-size: 11px; }
    .sdlc-awnav .sdlc-st.done:not(.ok):not(.bad) .n { background: var(--info-soft); color: var(--info); }
    @media (max-width: 860px) {
      .sdlc-flow { grid-template-columns: minmax(0, 1fr); }
      .sdlc-flow .arr { transform: rotate(90deg); height: 18px; }
      .sdlc-steps { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      .sdlc-steps.six { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .sdlc-io-row { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
      .sdlc-io-row .t { grid-column: 1 / -1; }
    }
    @media (max-width: 560px) {
      .sdlc-steps { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .sdlc-steps .sdlc-st { grid-template-columns: 24px minmax(0, 1fr); justify-items: start; align-items: center; text-align: left; padding: 7px 8px; }
      .sdlc-steps .sdlc-st .ic { display: none; }
      .sdlc-steps.six { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .sdlc-steps.six .sdlc-st .sub { grid-column: 2; }
      .sdlc-redo { grid-template-columns: minmax(0, 1fr); }
      .sdlc-stats { gap: 6px; }
      .sdlc-stats .stat { padding: 8px; }
      .sdlc-stats .k { font-size: 9.5px; }
      .sdlc-stats .v { font-size: 15px; }
      .sdlc-stats .s { display: none; }
      .sdlc-io-row { grid-template-columns: minmax(0, 1fr); }
      .sdlc-an { grid-template-columns: minmax(0, 1fr); }
      .sdlc-load .lb, .sdlc-chart .lb { font-size: 9.5px; }
      .sdlc-chart .plot, .sdlc-chart .labels { gap: 4px; }
      .sdlc-chart .bar .v { font-size: 10px; }
      .sdlc-awnav .sdlc-st { padding: 6px 0; }
      .sdlc-awnav .nm { display: none; }
    }
  </style>`);

  // ---------- общие помощники ----------
  const quizRef = cfg => cfg.options.map((o, i) => o.ok ? i : -1).filter(i => i >= 0);
  const plainT = s => String(s || '').replace(/<[^>]+>/g, '');
  const dots = n => `<span class="sdlc-dots" aria-label="загрузка ${n} из 5">${[1, 2, 3, 4, 5].map(k => `<i class="${k <= n ? 'on' : ''}"></i>`).join('')}</span>`;
  const person = id => { const p = TR.PEOPLE[id] || { name: id, ini: '?' }; return `<span class="chip"><span class="avatar" data-p="${esc(id)}" aria-hidden="true">${esc(p.ini)}</span>${esc(p.name)}</span>`; };
  // столбики «во сколько раз дороже»: pts [{lb, v, lab}], cur — индекс текущего, scale lin|log
  function chartHTML(pts, cur, scale) {
    const max = Math.max(...pts.map(p => p.v));
    const L = v => (Math.log10(v) + 0.35) / (Math.log10(max) + 0.35);
    const h = v => scale === 'log' ? L(v) : v / max;
    const grid = scale === 'log' ? [1, 10, 100].filter(g => g <= max).map(g => `<div class="sdlc-gl" style="bottom:${(L(g) * 100).toFixed(1)}%"><span>×${g}</span></div>`).join('') : '';
    return `<div class="sdlc-chart" role="img" aria-label="Цена исправления по стадиям">
      <div class="plot">${grid}${pts.map((p, i) => `<div class="col"><div class="bar ${i === cur ? 'cur' : ''}" style="height:${Math.max(1.5, h(p.v) * 100).toFixed(1)}%"><span class="v">${esc(p.lab)}</span></div></div>`).join('')}</div>
      <div class="labels">${pts.map(p => `<div class="lb">${esc(p.lb)}</div>`).join('')}</div></div>`;
  }

  // =====================================================================
  // Стадии жизненного цикла (общие для теории и практики)
  // =====================================================================
  const STG = [
    {
      id: 'init', t: 'Инициация', sh: 'Инициация', ico: '💡', load: 2,
      cake: { h: 'Заказ', d: 'Клиентка звонит: «Нужен торт на юбилей мамы». Пекарня решает: берёмся ли, к какой дате и сколько это будет стоить.', in: 'Звонок клиентки', out: 'Договорились: торт к субботе, примерная цена', lead: 'Кассир и управляющий' },
      it: { h: '«Хочу видеть, сколько выбрасываем»', d: 'Нина Сергеевна приходит с идеей планшета списаний. Решают: делаем ли, зачем, сколько денег и времени готовы потратить.', in: 'Идея или проблема бизнеса', out: 'Цель и границы, бюджет и сроки, решение «делаем», договор', lead: 'Заказчик и руководитель проекта' },
      an: 'Помогает сформулировать проблему и цель, прикидывает, сколько времени нужно на анализ и с кем встречаться.',
      q: 'Какую проблему решаем и по какой цифре поймём, что решили?'
    },
    {
      id: 'req', t: 'Анализ требований', sh: 'Анализ', ico: '🔎', load: 5,
      cake: { h: 'Расспросить клиентку', d: 'На сколько человек, какая начинка, какая надпись, есть ли аллергия, когда и куда привезти.', in: 'Договорённость о заказе', out: 'Записанный заказ: начинка, вес, надпись, аллергии, срок', lead: 'Кассир (расспрашивает и записывает)' },
      it: { h: 'Кто, когда и зачем вносит списания', d: 'Аналитик расспрашивает кассиров, управляющего, технолога и бухгалтера, описывает процесс и правила.', in: 'Цель и границы проекта', out: 'Требования и критерии приёмки, согласованные с заказчиком', lead: 'Аналитик' },
      an: 'Главная стадия аналитика: выявляет требования, описывает, проверяет с командой и согласует с заказчиком.',
      q: 'Кто вносит списание — и что будет, если он забыл?'
    },
    {
      id: 'design', t: 'Проектирование', sh: 'Проектирование', ico: '📐', load: 3,
      cake: { h: 'Рецепт и техкарта', d: 'Сколько ярусов, какой каркас, сколько коржей, какие формы и в какую печь.', in: 'Записанный заказ', out: 'Техкарта: ярусы, граммы, формы, порядок работ', lead: 'Технолог' },
      it: { h: 'Как это устроить', d: 'Архитектор решает, где хранить данные и как передать их бухгалтерии; дизайнер рисует экран планшета.', in: 'Требования и критерии приёмки', out: 'Макеты экранов, схема данных и интеграций, архитектурные решения', lead: 'Архитектор и дизайнер' },
      an: 'Отвечает на вопросы, проверяет, что решение покрывает все требования, уточняет крайние случаи.',
      q: 'Что видит кассир, если пропала связь?'
    },
    {
      id: 'dev', t: 'Разработка', sh: 'Разработка', ico: '⌨️', load: 3,
      cake: { h: 'Закупка и выпечка', d: 'Купить продукты, замесить, испечь коржи, собрать и украсить.', in: 'Техкарта и продукты', out: 'Собранный торт', lead: 'Кондитер' },
      it: { h: 'Пишут код', d: 'Разработчики делают экран планшета и серверную часть, собирают версию для проверки.', in: 'Макеты, схемы, требования', out: 'Работающий код, сборка для проверки', lead: 'Тимлид и разработчики' },
      an: 'Отвечает на вопросы в течение дня, уточняет правила, готовит следующие задачи.',
      q: 'Можно ли исправить списание после отправки в отчёт?'
    },
    {
      id: 'test', t: 'Тестирование', sh: 'Тестирование', ico: '🧪', load: 3,
      cake: { h: 'Дегустация и сверка', d: 'Попробовать, взвесить, сверить надпись и начинку с заказом.', in: 'Собранный торт и записанный заказ', out: 'Торт проверен: вкус, вес, надпись', lead: 'Технолог' },
      it: { h: 'Проверяют', d: 'Тестировщик проверяет по критериям приёмки: 0 штук, 99 штук, без связи, двойное нажатие.', in: 'Сборка и критерии приёмки', out: 'Отчёт о тестировании, исправленные дефекты', lead: 'Тестировщик' },
      an: 'Помогает отличить ошибку от нового требования, уточняет ожидаемый результат.',
      q: 'Это ошибка — или так и задумано?'
    },
    {
      id: 'deploy', t: 'Внедрение', sh: 'Внедрение', ico: '🚚', load: 2,
      cake: { h: 'Выдача', d: 'Отдать торт клиентке, рассказать, как хранить, принять оплату.', in: 'Проверенный торт', out: 'Торт у клиентки, оплата получена', lead: 'Кассир' },
      it: { h: 'Запускают у людей', d: 'Пилот в двух пекарнях, обучение кассиров, перенос справочника товаров, приёмка заказчиком.', in: 'Проверенная версия, инструкции', out: 'Система работает у пользователей, акт приёмки', lead: 'Руководитель проекта и заказчик' },
      an: 'Готовит памятки и сценарий демо, помогает на приёмке, собирает вопросы первой недели.',
      q: 'Как кассиру за смену разобраться с новым экраном?'
    },
    {
      id: 'support', t: 'Сопровождение', sh: 'Сопровождение', ico: '🔧', load: 2,
      cake: { h: 'Отзывы и поправки', d: 'Клиентка пишет: «Слишком сладко». Технолог правит рецепт для следующих тортов.', in: 'Отзывы и жалобы', out: 'Поправленный рецепт', lead: 'Технолог' },
      it: { h: 'Живут и улучшают', d: 'Заявки «не сохраняется», мелкие доработки, обновления. Самая долгая стадия — годы.', in: 'Работающая система, заявки пользователей', out: 'Исправления, новые версии, запросы на изменения', lead: 'Поддержка и команда сопровождения' },
      an: 'Разбирает заявки: ошибка это или новое требование; описывает доработки.',
      q: 'Это ошибка или новая возможность?'
    },
    {
      id: 'retire', t: 'Вывод из эксплуатации', sh: 'Вывод', ico: '📦', load: 1,
      cake: { h: 'Снять с витрины', d: 'Этот торт больше не печём: остатки продаём, рецепт — в архив, постоянных покупателей предупреждаем.', in: 'Решение больше не печь', out: 'Рецепт в архиве, покупатели предупреждены', lead: 'Нина Сергеевна' },
      it: { h: 'Выключают', d: 'Через годы планшеты заменяют новой системой: переносят данные, архивируют, отключают старое.', in: 'Решение о замене или закрытии', out: 'Данные перенесены или в архиве, система отключена, пользователи предупреждены', lead: 'Заказчик и эксплуатация' },
      an: 'Описывает, какие данные перенести, что и сколько хранить, кого и когда предупредить.',
      q: 'Где через три года взять списания за прошлый год?'
    }
  ];
  const stgT = id => (STG.find(s => s.id === id) || { t: '—' }).t;
  const STG_CH = STG.map((s, i) => ({ v: s.id, t: `${i + 1}. ${s.t}` }));

  // =====================================================================
  // Теория 1. Стадии жизненного цикла (соседний пример: планшет списаний и путь торта)
  // =====================================================================
  const howStages = {
    id: 'how-stages', covers: ['kolos-order', 'analyst-where'], title: 'Как это работает: стадии жизненного цикла', free: true, noReset: true,
    simple: {
      icon: '🎂',
      plain: 'У любой системы есть жизнь: её задумывают, выясняют, какой она должна быть, придумывают устройство, делают, проверяют, запускают, годами поддерживают — и однажды выключают.',
      analogy: 'Путь торта: заказ → расспросить клиентку → рецепт и техкарта → закупка и выпечка → дегустация → выдача → отзывы и поправки рецепта → торт снимают с ассортимента. Пропустить шаг можно, но тогда о проблеме узнаете позже — и дороже.',
      tech: '<b>Жизненный цикл программного обеспечения</b> — все стадии от замысла до вывода из эксплуатации. Обычно выделяют: инициация → анализ требований → проектирование → разработка → тестирование → внедрение → сопровождение → вывод из эксплуатации. Названия и границы стадий в разных стандартах и компаниях разные (ГОСТ 34.601-90, ISO/IEC/IEEE 12207), суть одна.'
    },
    lead: ui.brief({
      situation: 'Соседний пример — будущий «планшет списаний»: кассир вносит, что не продали, а Нина Сергеевна видит, сколько выбрасывают. Пройдём его жизнь целиком — рядом с путём торта.',
      todo: [
        'Нажимайте стадии по порядку (или «Дальше →»). Для каждой смотрите: что на входе, что на выходе, кто главный.',
        'Переключатель «Пример»: путь торта или планшет списаний. Где аналогия совпадает?',
        'Фиолетовый блок — что делает аналитик на этой стадии и с каким вопросом приходит. Включите «Загрузка аналитика по стадиям»: где пик и есть ли стадия, где он не нужен совсем?'
      ],
      look: 'Вход — без чего стадию не начать. Выход — что она отдаёт следующей. Точки у аналитика — насколько он загружен на стадии; это условная картинка по опыту «Квант Софт», а не норматив.'
    }),
    render(el) {
      el.classList.add('sdlc-root');
      const st = { i: 0, lens: 'it', load: false, seen: new Set([0]) };
      el.innerHTML = `<div class="stack">
        <div class="row"><span class="small dim">Пример:</span>${ui.seg('lens', [{ v: 'it', t: '📋 планшет списаний' }, { v: 'cake', t: '🎂 путь торта' }], st.lens)}</div>
        <div class="sdlc-steps" data-steps></div>
        <div data-card></div>
        <div class="row between"><button type="button" class="btn sm ghost" data-nav="-1">← Назад</button><button type="button" class="btn sm" data-nav="1">Дальше →</button></div>
        <label class="toggle"><input type="checkbox" data-load> <span>Загрузка аналитика по стадиям</span></label>
        <div data-loadbox></div>
        ${ui.note('info', 'По порядку или кругами?', 'Здесь стадии идут друг за другом. В жизни их часто проходят короткими кругами: в каждом двухнедельном спринте немного анализа, проектирования, кода и проверки. Стадии от этого не исчезают — меняется их размер. Про каскад, V-модель и итерации — завтра.')}
      </div>`;
      function drawSteps() {
        TR.$('[data-steps]', el).innerHTML = STG.map((s, i) => `<button type="button" class="sdlc-st ${st.seen.has(i) && i !== st.i ? 'seen' : ''}" data-i="${i}" aria-pressed="${i === st.i}"><span class="n">${i + 1}</span><span class="ic" aria-hidden="true">${s.ico}</span><span class="nm">${esc(s.sh)}</span></button>`).join('');
      }
      function drawCard() {
        const s = STG[st.i], ex = s[st.lens];
        TR.$('[data-card]', el).innerHTML = `<div class="card">
          <div><div class="eyebrow">Стадия ${st.i + 1} из ${STG.length}</div><h3 class="sdlc-h3">${s.ico} ${esc(s.t)}</h3></div>
          <div class="sdlc-ex"><b>${st.lens === 'cake' ? 'В пекарне' : 'Планшет списаний'}: ${esc(ex.h)}.</b> ${esc(ex.d)}</div>
          <div class="sdlc-flow"><div class="sdlc-box"><b>Вход</b>${esc(ex.in)}</div><div class="arr" aria-hidden="true">→</div><div class="sdlc-box mid"><b>Кто главный</b>${esc(ex.lead)}</div><div class="arr" aria-hidden="true">→</div><div class="sdlc-box"><b>Выход</b>${esc(ex.out)}</div></div>
          <div class="sdlc-an"><div><b>Аналитик в ИТ-проекте:</b> ${esc(s.an)}<div class="small muted" style="margin-top:4px">Приходит с вопросом: «${esc(s.q)}»</div></div>${dots(s.load)}</div>
        </div>`;
        TR.$('[data-nav="-1"]', el).disabled = st.i === 0;
        TR.$('[data-nav="1"]', el).disabled = st.i === STG.length - 1;
      }
      function drawLoad() {
        TR.$('[data-loadbox]', el).innerHTML = st.load ? `<div class="stack tight"><div class="sdlc-load">${STG.map((s, i) => `<div class="col"><div class="bw"><div class="bar ${i === st.i ? 'cur' : ''}" style="height:${s.load * 18}px" title="${esc(s.t)}: ${s.load} из 5"></div></div><div class="lb">${esc(s.sh)}</div></div>`).join('')}</div>
          <div class="small muted">Пик — на анализе требований. Но нуля нет нигде: даже при выводе из эксплуатации кто-то должен знать, какие данные важны и кому.</div></div>` : '';
      }
      const go = i => { st.i = Math.max(0, Math.min(STG.length - 1, i)); st.seen.add(st.i); drawSteps(); drawCard(); drawLoad(); };
      TR.on(el, 'click', '[data-i]', (e, b) => go(+b.dataset.i));
      TR.on(el, 'click', '[data-nav]', (e, b) => go(st.i + (+b.dataset.nav)));
      el.addEventListener('change', e => { if (e.target.matches('[data-load]')) { st.load = e.target.checked; drawLoad(); } });
      ui.onSeg(el, (n, v) => { if (n === 'lens') { st.lens = v; drawCard(); } });
      drawSteps(); drawCard(); drawLoad();
    }
  };

  // =====================================================================
  // Теория 2. Входы, выходы и стандарты
  // =====================================================================
  const LINKS = [
    { a: 'Цель и границы проекта, договор', miss: 'Аналитик не знает, где границы: обследует всё подряд — и кассы, и доставку, и франшизу. Время кончилось, а главного нет.' },
    { a: 'Требования и критерии приёмки', miss: 'Архитектор и дизайнер гадают: «наверное, списания раз в день», «наверное, без причин». Решение строят на догадках.' },
    { a: 'Макеты и схема данных', miss: 'Каждый разработчик делает экран «как видит»: два экрана не похожи друг на друга, данные не сходятся с бухгалтерией.' },
    { a: 'Сборка на тестовом стенде', miss: 'Тестировщику нечего проверять — или он проверяет на компьютере разработчика: «у меня работает».' },
    { a: 'Отчёт о тестировании, закрытые дефекты', miss: 'Выкатывают, не зная, что проверено. Ошибки находят кассиры — в утренний пик.' },
    { a: 'Акт приёмки, памятки, обученные люди', miss: 'Поддержка не знает, как система должна работать: каждая заявка — расследование.' },
    { a: 'Решение о замене и карта данных', miss: 'Старую систему выключают «в пятницу вечером» — и выясняется, что списаний за прошлый год нигде нет.' }
  ];
  const STD = {
    gost: {
      t: 'ГОСТ 34.601-90',
      rows: {
        init: '1. Формирование требований к АС (обследование объекта, обоснование необходимости системы)',
        req: '1. Формирование требований к АС · 2. Разработка концепции АС · 3. Техническое задание',
        design: '4. Эскизный проект · 5. Технический проект',
        dev: '6. Рабочая документация (в том числе разработка программ)',
        test: '7. Ввод в действие: предварительные испытания',
        deploy: '7. Ввод в действие: подготовка персонала, опытная эксплуатация, приёмочные испытания',
        support: '8. Сопровождение АС',
        retire: 'Отдельной стадии нет'
      },
      note: '«Автоматизированные системы. Стадии создания» — стандарт 1990 года, до сих пор живой в госзаказе и крупных компаниях: если в договоре написано «по ГОСТ 34», стадии и документы идут ровно так. Стадии идут по порядку, на каждой — свой комплект документов (техническое задание — по ГОСТ 34.602-2020). Отдельной стадии вывода из эксплуатации в нём нет. В 2021 году вышел ГОСТ Р 59793-2021 на ту же тему, но в разговорах по-прежнему говорят «по 34-му ГОСТу».'
    },
    iso: {
      t: 'ISO/IEC/IEEE 12207',
      rows: {
        init: 'Анализ бизнеса или миссии; процессы соглашения (приобретение, поставка); планирование проекта',
        req: 'Определение потребностей и требований заинтересованных сторон; определение требований к системе и ПО',
        design: 'Определение архитектуры; определение проекта (дизайна)',
        dev: 'Реализация; комплексирование (интеграция)',
        test: 'Верификация (сделано по требованиям?) и валидация (сделано то, что нужно?)',
        deploy: 'Передача в эксплуатацию (transition); валидация у пользователей',
        support: 'Эксплуатация; сопровождение',
        retire: 'Изъятие из эксплуатации (disposal)'
      },
      note: '«Процессы жизненного цикла программного обеспечения» (редакция 2017 года). Описывает не стадии, а процессы: их можно выполнять в любом порядке и повторять, поэтому стандарт подходит и для каскада, и для итераций. Кроме технических процессов в нём есть процессы соглашения (заказчик и поставщик), организационные и управления проектом. Ловушка: процесс «системный анализ» в стандарте — это расчёты и моделирование для принятия решений, а не вся работа системного аналитика.'
    },
    kvant: {
      t: 'Как у «Колоса»',
      rows: {
        init: 'Запрос Нины Сергеевны, договор на обследование',
        req: 'Обследование: 3 недели, 600 тыс. ₽, фиксированная цена',
        design: 'Внутри каждого спринта (2 недели): уточнили задачу → спроектировали → сделали → проверили → показали Нине на демо',
        dev: 'Внутри спринта, по задачам из бэклога',
        test: 'Внутри спринта; в конце — демо и приёмка заказчиком',
        deploy: 'Пилот в 2 пекарнях к 1 февраля 2027, все 9 и торты — к 1 марта',
        support: 'Сопровождение по Kanban: заявки от пекарен, ошибки, мелкие доработки',
        retire: 'Пока далеко, но о нём думают, когда решают, где и сколько хранить данные'
      },
      note: 'В жизни стадии не всегда идут строго по одной. У «Колоса» обследование — отдельный этап с фиксированной ценой, а дальше в каждом двухнедельном спринте есть немного анализа, проектирования, кода и проверки. Но у каждой работы всё равно есть вход и выход. Почему договор устроен именно так — в четверг.'
    }
  };
  const howIO = {
    id: 'how-io', covers: ['artifacts'], title: 'Как это работает: входы, выходы и стандарты', free: true, noReset: true,
    simple: {
      icon: '🔗',
      plain: 'Каждая стадия что-то получает на вход и что-то отдаёт на выход. Выход одной — вход следующей. Нет входа — следующая стадия работает на догадках.',
      analogy: 'Конвейер в цехе: без техкарты пекарь замешивает «на глаз», без готовых коржей оформителю нечего украшать, без накладной водитель не знает, куда везти.',
      tech: '<b>Вход</b> стадии — артефакты и решения, без которых её не начать; <b>выход</b> — результаты, которые она передаёт дальше; <b>артефакт</b> — результат работы, который можно передать и проверить. <b>ГОСТ 34.601-90</b> описывает стадии и этапы создания автоматизированной системы с документами на каждой; <b>ISO/IEC/IEEE 12207</b> — процессы жизненного цикла, которые можно выполнять в любом порядке и повторять.'
    },
    lead: ui.brief({
      situation: 'Тот же соседний пример — планшет списаний. Сверху вниз — стадии, между ними — артефакты: выход одной стадии становится входом следующей. На второй вкладке — как те же стадии называются в стандартах.',
      todo: [
        'Вкладка «Входы и выходы»: нажмите «Убрать» у любого артефакта и посмотрите, что случится со следующими стадиями. Верните и попробуйте другой.',
        'Найдите артефакт, без которого на догадках работает больше всего стадий.',
        'Вкладка «Стандарты»: переключайте ГОСТ 34.601, ISO/IEC/IEEE 12207 и «Как у „Колоса“». Найдите стадию, которой в ГОСТ 34.601 нет.'
      ],
      look: 'Красная стадия осталась без входа и гадает. Жёлтая работает поверх чужих догадок. Синяя пунктирная плашка внизу — сопровождение рождает новые требования: жизненный цикл замыкается в круг.'
    }),
    render(el) {
      el.classList.add('sdlc-root');
      const tabsEl = document.createElement('div'); el.appendChild(tabsEl);
      ui.tabs(tabsEl, [
        { id: 'chain', t: 'Входы и выходы', render: pane => drawChain(pane) },
        { id: 'std', t: 'Стандарты', render: pane => drawStd(pane) }
      ], 'chain');
    }
  };
  function drawChain(pane) {
    const off = new Set();
    function draw() {
      const firstOff = Math.min(...[...off], 99);
      let guess = 0;
      const html = STG.map((s, i) => {
        const starved = off.has(i - 1), after = !starved && i - 1 > firstOff;
        const k = starved ? 'bad' : after ? 'warn' : '';
        if (k) guess++;
        const node = `<div class="sdlc-node ${k}"><div class="ttl">${i + 1}. ${esc(s.t)}</div>${starved ? `<div class="small">${esc(LINKS[i - 1].miss)}</div>` : after ? '<div class="small muted">Работает поверх догадок предыдущих стадий: всё, что сделано, может оказаться не тем.</div>' : `<div class="small muted">Выход: ${esc(s.it.out)}</div>`}</div>`;
        const link = i < LINKS.length ? `<div class="sdlc-link ${off.has(i) ? 'off' : ''}"><span class="ar" aria-hidden="true">↓</span><span class="art">${esc(LINKS[i].a)}</span><button type="button" class="btn xs ${off.has(i) ? '' : 'ghost'}" data-lk="${i}">${off.has(i) ? 'Вернуть' : 'Убрать'}</button></div>` : '';
        return node + link;
      }).join('');
      pane.innerHTML = `<div class="stack">
        <div class="row between"><span class="small dim">Стадий на догадках: <b>${guess}</b> из ${STG.length}</span>${off.size ? '<button type="button" class="btn xs ghost" data-reset>Вернуть всё</button>' : ''}</div>
        <div class="sdlc-chain">${html}</div>
        <div class="sdlc-loop">↺ Из сопровождения — запросы на изменения обратно в <b>анализ требований</b>: каждая доработка проходит свой маленький цикл. Жизненный цикл — не линия, а круг.</div>
        ${guess >= 5 ? ui.note('warn', 'Заметили?', 'Чем раньше пропал вход, тем больше стадий работает на догадках. Требования — один из самых «дальнобойных» артефактов: по ним рисуют, программируют и проверяют.') : ''}
      </div>`;
    }
    TR.on(pane, 'click', '[data-lk]', (e, b) => { const i = +b.dataset.lk; if (off.has(i)) off.delete(i); else off.add(i); draw(); });
    TR.on(pane, 'click', '[data-reset]', () => { off.clear(); draw(); });
    draw();
  }
  function drawStd(pane) {
    let cur = 'gost';
    pane.innerHTML = `<div class="stack"><div class="row"><span class="small dim">Смотрим:</span>${ui.seg('std', Object.keys(STD).map(k => ({ v: k, t: STD[k].t })), cur, 'accent')}</div><div data-std></div></div>`;
    function draw() {
      const s = STD[cur];
      TR.$('[data-std]', pane).innerHTML = ui.table(['Стадия', s.t], STG.map(g => [`<b>${esc(g.t)}</b>`, esc(s.rows[g.id])]), { rowClass: r => /нет$/.test(plainT(r[1])) ? 'bad' : '' }) + `<div style="margin-top:10px">${ui.note('info', s.t, esc(s.note))}</div>`;
    }
    ui.onSeg(pane, (n, v) => { if (n === 'std') { cur = v; draw(); } });
    draw();
  }

  // =====================================================================
  // Теория 3. Цена ошибки растёт («соль вместо сахара», пекарня)
  // =====================================================================
  const SALT = [
    { id: 'recipe', lb: 'Рецепт', t: 'В техкарте', x: 1, time: '1 минута', who: 'galya', say: 'Ой, в техкарте «соль 300 г» вместо сахара. Исправила карандашом, пока никто не начал.' },
    { id: 'weigh', lb: 'Навеска', t: 'При взвешивании', x: 3, time: '10 минут', who: 'galya', say: 'Пекарь звонит: «300 граммов соли на один торт — точно?» Нет, конечно. Пересыпали навеску.' },
    { id: 'dough', lb: 'Тесто', t: 'В тесте', x: 10, time: 'около часа', who: 'galya', say: 'Тесто солёное. В мусор, замешиваем заново — печь простаивает.' },
    { id: 'taste', lb: 'Торт', t: 'На дегустации готового торта', x: 30, time: 'полдня', who: 'galya', say: 'Коржи испечены, крем, украшение — а торт солёный. Выбрасываем целиком и звоним клиентке: к трём не успеем.' },
    { id: 'counter', lb: 'Витрина', t: 'На витрине', x: 100, time: 'день и выручка', who: 'pavel', say: 'Пирожные с этим кремом уже продаём. Покупатели возвращаются, отдаём деньги, снимаем всю партию.' },
    { id: 'home', lb: 'Дома', t: 'У покупателя и во ВКонтакте', x: 300, time: 'месяцы', who: 'anna', say: 'Внучка резала торт при гостях… а он солёный. Больше я у вас не закажу. И отзыв уже читают все ваши подписчики.' }
  ];
  const SALT_REDO = [
    { t: 'Строчка в техкарте', from: 0 },
    { t: 'Навеска продуктов', from: 1 },
    { t: 'Тесто и продукты на замес', from: 2 },
    { t: 'Коржи, крем, украшение', from: 3 },
    { t: 'Срок для клиентки', from: 3 },
    { t: 'Вся партия на витрине и возвраты денег', from: 4 },
    { t: 'Постоянная покупательница и отзыв во ВКонтакте', from: 5 }
  ];
  const HONEST = `<details class="more"><summary>Откуда «×10» и насколько ему верить</summary><div>
    <p>Барри Боэм в книге «Экономика программной инженерии» (1981) по данным реальных проектов показал: ошибку в требованиях, найденную в эксплуатации, исправлять в десятки–сотни раз дороже, чем найденную на анализе. С тех пор это много раз пересказывали — часто как «правило 1–10–100»: на анализе — 1, в разработке — 10, в эксплуатации — 100.</p>
    <ul class="checks">
      <li class="warn">Точные множители в разных исследованиях разные, а часть исходных данных старая и плохо проверяемая — это подробно разбирает Лоран Боссави в книге «The Leprechauns of Software Engineering».</li>
      <li class="warn">В небольших проектах с короткими итерациями разрыв меньше: ошибку находят на демо через две недели, а не через полгода.</li>
      <li>Направление при этом не спорят: чем больше построено поверх ошибки, тем больше приходится переделывать.</li>
    </ul>
    <p><b>Как говорить с заказчиком и на собеседовании:</b> «чем позже нашли ошибку в требованиях, тем дороже её исправить — по разным оценкам в разы и в десятки раз». Без «ровно в 100 раз».</p>
  </div></details>`;
  const howCost = {
    id: 'how-cost', covers: ['salt-lab', 'why-survey'], title: 'Как это работает: цена ошибки растёт', free: true, noReset: true,
    simple: {
      icon: '🧂',
      plain: 'Чем позже нашли ошибку, тем больше уже построено поверх неё — и тем больше приходится переделывать.',
      analogy: 'Соль вместо сахара. Заметили в рецепте — исправили карандашом. В тесте — выбросили тесто. На витрине — вернули деньги. У покупателя на юбилее — потеряли клиента и получили отзыв во ВКонтакте.',
      tech: 'Эвристика роста стоимости ошибки (Барри Боэм, «Экономика программной инженерии», 1981, и последующие работы): ошибку в требованиях, найденную в эксплуатации, исправлять в десятки–сотни раз дороже, чем на анализе. Её часто пересказывают как «правило 1–10–100» или «примерно ×10 на крупный этап». Это <b>правило для разговора, а не точный закон</b>: множители в разных проектах разные.'
    },
    lead: ui.brief({
      situation: 'Соседний пример из пекарни: в техкарте торта ошибка — соль вместо сахара. Её могут заметить на шести разных шагах. Ниже — что придётся выбросить и переделать в каждом случае.',
      todo: [
        'Нажимайте шаги по очереди — от рецепта до отзыва во ВКонтакте. Смотрите, как растёт список «Что выбрасываем и переделываем».',
        'Переключите шкалу графика: обычная и логарифмическая. На какой видно, что первые шаги вообще чего-то стоят?',
        'Откройте «Откуда „×10“ и насколько ему верить» — это важно, чтобы не повторять миф на собеседовании.'
      ],
      look: 'Столбики — условная цена исправления, если в рецепте она равна 1. Числа для наглядности, это не замер. На логарифмической шкале каждая пунктирная линия — в 10 раз больше предыдущей.'
    }),
    render(el) {
      el.classList.add('sdlc-root');
      const st = { i: 0, scale: 'lin' };
      el.innerHTML = `<div class="stack">
        <div class="eyebrow">Где заметили соль вместо сахара</div>
        <div class="sdlc-steps six" data-at></div>
        <div data-out></div>
        <div class="row"><span class="small dim">Шкала графика:</span>${ui.seg('scale', [{ v: 'lin', t: 'обычная' }, { v: 'log', t: 'логарифмическая' }], st.scale)}</div>
        <div data-chart></div>
        <div data-scnote></div>
        ${HONEST}
        ${ui.note('info', 'Это не только про каскад', 'В коротких итерациях — спринт две недели, демо в конце — забытое требование чаще всплывает на демо, а не через полгода в эксплуатации. Кривая та же, но ошибка не успевает «уехать» далеко. Поэтому гибкие подходы не отменяют анализ, а делают его чаще и мельче. Подробно — завтра.')}
      </div>`;
      function draw() {
        const s = SALT[st.i];
        TR.$('[data-at]', el).innerHTML = SALT.map((x, i) => `<button type="button" class="sdlc-st" data-at="${i}" aria-pressed="${i === st.i}"><span class="n">${i + 1}</span><span class="nm">${esc(x.t)}</span></button>`).join('');
        const redo = SALT_REDO.filter(r => r.from <= st.i).length;
        TR.$('[data-out]', el).innerHTML = `<div class="stack tight">
          <div class="sdlc-stats">
            <div class="stat"><span class="k">Цена исправления</span><span class="v ${s.x >= 30 ? 'bad' : s.x >= 10 ? 'warn' : 'ok'}">×${s.x}</span><span class="s">условно, если в рецепте — 1</span></div>
            <div class="stat"><span class="k">Сколько времени</span><span class="v">${esc(s.time)}</span><span class="s">на исправление</span></div>
            <div class="stat"><span class="k">Переделываем</span><span class="v ${redo > 3 ? 'bad' : redo > 1 ? 'warn' : 'ok'}">${redo} из ${SALT_REDO.length}</span><span class="s">пунктов списка ниже</span></div>
          </div>
          ${ui.say(s.who, esc(s.say))}
          <div class="eyebrow">Что выбрасываем и переделываем</div>
          <div class="sdlc-redo">${SALT_REDO.map(r => `<div class="it ${r.from <= st.i ? 'on' : ''}">${esc(r.t)}</div>`).join('')}</div>
        </div>`;
        TR.$('[data-chart]', el).innerHTML = chartHTML(SALT.map(x => ({ lb: x.lb, v: x.x, lab: '×' + x.x })), st.i, st.scale);
        TR.$('[data-scnote]', el).innerHTML = `<div class="small muted">${st.scale === 'lin' ? 'На обычной шкале первые столбики почти не видны — настолько дешевле поймать ошибку в рецепте.' : 'На логарифмической шкале видно ровную лестницу: каждый шаг дороже предыдущего в несколько раз, каждые два шага — примерно в 10.'}</div>`;
      }
      TR.on(el, 'click', '[data-at]', (e, b) => { st.i = +b.dataset.at; draw(); });
      ui.onSeg(el, (n, v) => { if (n === 'scale') { st.scale = v; draw(); } });
      draw();
    }
  };

  // =====================================================================
  // Практика 1. События «Колоса» по порядку жизни системы
  // =====================================================================
  const EV = [
    { id: 'e1', st: 'init', t: 'Игорь и Нина Сергеевна подписывают договор на обследование: 3 недели, 600 тыс. ₽', hint: 'Без договора и решения «делаем» никто не начнёт работу.' },
    { id: 'e2', st: 'req', t: 'Вы с Ксенией интервьюируете Нину Сергеевну и выходите на смену в пекарню на Покровке в 06:00', hint: 'Чтобы рисовать и программировать, сначала надо выяснить, что нужно.' },
    { id: 'e3', st: 'design', t: 'Дима решает, как передавать чеки в «КассаПро», а Соня рисует экран кассира', hint: 'Решения Димы и макеты Сони опираются на требования — и нужны до кода.' },
    { id: 'e4', st: 'dev', t: 'Разработчики пишут правило приёма заказов на завтра и экран сборки заказов', hint: 'Код пишут по требованиям и макетам.' },
    { id: 'e5', st: 'test', t: 'Лера проверяет заказы в 22:29, 22:30 и 22:31 и заводит дефекты', hint: 'Лере нужна готовая сборка: пока нет кода, проверять нечего.' },
    { id: 'e6', st: 'deploy', t: '1 февраля: пилот в двух пекарнях, кассиров обучают за смену', hint: 'В пекарни выпускают только то, что уже проверено.' },
    { id: 'e7', st: 'support', t: 'Кассир пишет заявку «чек при выдаче не пробился» — команда разбирает её по Kanban', hint: 'Заявки от пекарен появляются, когда система уже работает у людей.' },
    { id: 'e8', st: 'retire', t: 'Через несколько лет «Колос» переходит на новую платформу: старые заказы — в архив, систему отключают', hint: 'Систему отключают в самом конце её жизни — после лет работы.' }
  ];
  const EV_IDS = EV.map(e => e.id);
  const orderTask = {
    id: 'kolos-order', title: 'Жизнь системы «Колоса» по порядку',
    simple: howStages.simple,
    lead: ui.brief({
      situation: 'Игорь рисует для Нины Сергеевны план жизни будущей системы «Колос-заказы» — от договора до дня, когда её когда-нибудь выключат. Карточки событий перемешались.',
      todo: [
        'Расставьте 8 событий в том порядке, в котором они случатся в жизни системы: кнопки ↑ ↓ или перетаскивание.',
        'Для каждой карточки спросите себя: что должно быть готово, чтобы это событие стало возможным?',
        'Нажмите «Проверить». Засчитывается, если не на своём месте не больше двух карточек (одна перестановка соседей).'
      ],
      look: 'Подсказка: у каждого события есть вход. Лере нечего проверять без сборки, пилоту нечего запускать без проверки, а разработчикам нечего писать без требований и макетов.'
    }),
    blank: () => ({ v: [] }),
    reference: () => ({ v: EV_IDS.slice() }),
    render(el, ctx) {
      el.classList.add('sdlc-root');
      let reveal = null;
      if (ctx.result) { reveal = {}; (ctx.ans.v || []).forEach((id, i) => { reveal[id] = EV_IDS[i] === id ? 'ok' : 'bad'; }); }
      const box = document.createElement('div'); el.appendChild(box);
      ui.order(box, {
        items: EV.map(e => ({ id: e.id, t: esc(e.t), sub: ctx.readonly ? esc(stgT(e.st)) : '' })), value: ctx.ans.v, reveal, readonly: ctx.readonly, seed: 'sdlc-kolos-7',
        onChange: v => { ctx.ans.v = v; ctx.save(); }
      });
    },
    check(ans) {
      const v = (ans && ans.v) || [];
      const full = v.length === EV_IDS.length && EV_IDS.every(id => v.includes(id));
      const score = full ? ui.orderScore(v, EV_IDS) : 0;
      const wrong = full ? EV.filter((e, i) => v[i] !== e.id) : [];
      const ok = score >= 0.9 && wrong.length <= 2;
      const notes = [];
      if (!full) notes.push({ ok: false, html: 'Карточки ещё не расставлены — подвиньте хотя бы одну, чтобы начать.' });
      wrong.slice(0, 4).forEach(e => notes.push({ ok: ok ? 'warn' : false, html: `«${esc(e.t)}» — не на своём месте. ${e.hint}` }));
      if (wrong.length > 4) notes.push({ ok: 'warn', html: `И ещё ${wrong.length - 4} ${TR.plural(wrong.length - 4, 'карточка', 'карточки', 'карточек')} не на месте.` });
      if (full && !wrong.length) notes.push({ ok: true, html: 'Все восемь событий — в порядке жизни системы.' });
      return {
        ok, score: ok ? score : Math.min(score, 0.79), notes,
        summary: full ? `Верных пар: ${Math.round(score * 100)} %, на своём месте: ${EV.length - wrong.length} из ${EV.length}.` : 'Порядок пока не задан.',
        mentor: ok || !full ? null : 'Идите от входов: что должно уже существовать, чтобы событие стало возможным? Договор — до интервью, требования — до кода, проверка — до пилота.'
      };
    },
    explain: `<p>Порядок: договор (<b>инициация</b>) → интервью и смена в пекарне (<b>анализ требований</b>) → решения Димы и макеты Сони (<b>проектирование</b>) → код (<b>разработка</b>) → проверки Леры (<b>тестирование</b>) → пилот 1 февраля (<b>внедрение</b>) → заявки по Kanban (<b>сопровождение</b>) → переход на новую платформу (<b>вывод из эксплуатации</b>).</p>
      <p>В жизни «Колоса» стадии будут накладываться: внутри каждого двухнедельного спринта есть и немного анализа, и проектирования, и кода, и проверки. Но логика «что нужно, чтобы начать» не меняется — поэтому порядок стадий полезно держать в голове даже в Agile.</p>`,
    report: ans => ((ans && ans.v) || []).map((id, i) => { const e = EV.find(x => x.id === id); return `${i + 1}. ${e ? e.t : id}${EV_IDS[i] === id ? ' ✓' : ' ✗'}`; }).join('\n') || '—'
  };

  // =====================================================================
  // Практика 2. Паспорт артефактов: где создаётся и кому нужен дальше
  // =====================================================================
  const IN_CH = STG_CH.concat([{ v: 'new', t: 'Новой системе, которая придёт на смену' }]);
  const ARTS = [
    { id: 'a1', t: 'Договор на обследование (3 недели, 600 тыс. ₽) и цели «Колоса»', out: 'init', inn: ['req'], hO: 'Это решение «делаем и на каких условиях». Его принимают до того, как выяснили требования, или после?', hI: 'Кто первым начинает работать по этому договору?' },
    { id: 'a2', t: 'Требования и критерии приёмки к предзаказу, согласованные с Ниной', out: 'req', inn: ['design', 'dev', 'test'], hO: 'На какой стадии выясняют и согласуют, что нужно?', hI: 'Кому эти требования нужны, чтобы начать свою работу?' },
    { id: 'a3', t: 'Макеты экрана кассира и схема связи с «КассаПро», 1С и «ПэйМост»', out: 'design', inn: ['dev'], hO: 'Где решают, как система будет устроена и как выглядит?', hI: 'Кто будет делать по этим макетам и схемам?' },
    { id: 'a4', t: 'Сборка приложения с предзаказом на тестовом стенде', out: 'dev', inn: ['test'], hO: 'Где рождается работающий код?', hI: 'Кому нужна готовая сборка?' },
    { id: 'a5', t: 'Отчёт о тестировании: что проверено, какие дефекты закрыты', out: 'test', inn: ['deploy'], hO: 'Где проверяют и закрывают дефекты?', hI: 'Кто решает, можно ли выпускать в пекарни, и опирается на этот отчёт?' },
    { id: 'a6', t: 'Памятка кассира и акт приёмки пилота в двух пекарнях', out: 'deploy', inn: ['support'], hO: 'Где систему запускают у людей и принимают?', hI: 'Кто будет отвечать на вопросы кассиров, когда пилот уже идёт?' },
    { id: 'a7', t: 'Журнал заявок от пекарен и запросы на доработки', out: 'support', inn: ['req'], hO: 'Когда появляются заявки от живых пользователей?', hI: 'Каждая доработка — это новое требование. Куда она возвращается, прежде чем её делать?' },
    { id: 'a8', t: 'План переноса данных и отключения старой системы', out: 'retire', inn: ['new'], hO: 'В самом конце жизни системы что с ней делают?', hI: 'Данные и уроки старой системы — кому они нужны дальше?' }
  ];
  function ioEval(o, i) {
    o = o || {}; i = i || {};
    return ARTS.map(a => {
      const okO = o[a.id] === a.out, okI = a.inn.includes(i[a.id]);
      return { a, okO, okI, emO: !o[a.id], emI: !i[a.id], pts: (okO ? 0.5 : 0) + (okI ? 0.5 : 0), s: okO && okI ? 'ok' : okO || okI ? 'warn' : 'bad' };
    });
  }
  const artTask = {
    id: 'artifacts', title: 'Паспорт артефактов: выход и вход',
    simple: howIO.simple,
    lead: ui.brief({
      situation: 'Ксения просит составить для Игоря «паспорт артефактов» проекта «Колос»: на какой стадии каждый рождается и кому нужен дальше. Восемь артефактов — от договора до плана отключения.',
      todo: [
        'Для каждого артефакта в списке «Создаётся на стадии» выберите, где он появляется (выход).',
        'В списке «Нужен дальше» — какой стадии он нужен на входе.',
        'Нажмите «Проверить». Засчитывается от 80 %. Где допустимы несколько ответов, засчитывается любой из них.'
      ],
      look: 'Выход одной стадии — вход следующей, но не всегда соседней: требования нужны и дизайнеру, и разработчикам, и Лере. А заявки сопровождения — подумайте, куда они попадают: жизненный цикл бывает кругом.'
    }),
    blank: () => ({ o: {}, i: {} }),
    reference: () => ({ o: Object.fromEntries(ARTS.map(a => [a.id, a.out])), i: Object.fromEntries(ARTS.map(a => [a.id, a.inn[0]])) }),
    render(el, ctx) {
      el.classList.add('sdlc-root');
      const a = ctx.ans; a.o = a.o || {}; a.i = a.i || {};
      const rv = ctx.result ? Object.fromEntries(ioEval(a.o, a.i).map(x => [x.a.id, x])) : null;
      const sel = (k, art, list, cur, cls) => `<select data-k="${k}" data-a="${art.id}" class="${cls || ''}" aria-label="${k === 'o' ? 'Создаётся на стадии' : 'Нужен дальше'}: ${esc(art.t)}" ${ctx.readonly ? 'disabled' : ''}><option value="">Выберите…</option>${list.map(c => `<option value="${c.v}" ${cur === c.v ? 'selected' : ''}>${esc(c.t)}</option>`).join('')}</select>`;
      el.innerHTML = `<div class="sdlc-io">${ARTS.map(art => {
        const r = rv && rv[art.id];
        let why = '';
        if (r && ctx.readonly) why = `<div class="why">Создаётся: ${esc(stgT(art.out))}. Нужен дальше: ${art.inn.map(v => esc(v === 'new' ? 'новой системе' : stgT(v))).join(', ')}.</div>`;
        else if (r && r.s !== 'ok') why = `<div class="why">${!r.okO ? esc(art.hO) + ' ' : ''}${!r.okI ? esc(art.hI) : ''}</div>`;
        return `<div class="sdlc-io-row ${r ? r.s : ''}"><div class="t">${esc(art.t)}</div>
          <label class="field"><span>Создаётся на стадии</span>${sel('o', art, STG_CH, a.o[art.id], r ? (r.okO ? 'ok' : 'bad') : '')}</label>
          <label class="field"><span>Нужен дальше</span>${sel('i', art, IN_CH, a.i[art.id], r ? (r.okI ? 'ok' : 'bad') : '')}</label>${why}</div>`;
      }).join('')}</div>`;
      if (ctx.readonly) return;
      el.addEventListener('change', e => {
        const s = e.target.closest('select[data-k]'); if (!s) return;
        const bag = a[s.dataset.k];
        if (s.value) bag[s.dataset.a] = s.value; else delete bag[s.dataset.a];
        s.classList.remove('ok', 'bad');
        const row = s.closest('.sdlc-io-row'); row.classList.remove('ok', 'warn', 'bad'); const w = TR.$('.why', row); if (w) w.remove();
        ctx.save();
      });
    },
    check(ans) {
      const ev = ioEval(ans && ans.o, ans && ans.i), score = ev.reduce((s, x) => s + x.pts, 0) / ARTS.length;
      const notes = [];
      ev.forEach(x => {
        if (x.s === 'ok') return;
        const parts = [];
        if (!x.okO) parts.push((x.emO ? 'стадия создания не выбрана. ' : '') + x.a.hO);
        if (!x.okI) parts.push((x.emI ? 'стадия-получатель не выбрана. ' : '') + x.a.hI);
        notes.push({ ok: x.s === 'warn' ? 'warn' : false, html: `«${esc(x.a.t)}»: ${esc(parts.join(' '))}` });
      });
      const loop = ev.find(x => x.a.id === 'a7');
      if (!notes.length) notes.push({ ok: true, html: 'Все восемь артефактов — на своих стадиях.' });
      return {
        ok: score >= 0.8, score, notes,
        summary: `Верных ответов: ${ev.reduce((s, x) => s + (x.okO ? 1 : 0) + (x.okI ? 1 : 0), 0)} из ${ARTS.length * 2}.`,
        mentor: loop && !loop.okI && (ans.i || {}).a7 ? 'Подумайте о заявке «хочу поменять пекарню в оплаченном заказе». Прежде чем её делать, кто-то должен выяснить, что именно нужно, и описать. Это какая стадия?' : null
      };
    },
    explain: `<p>Выход каждой стадии — вход следующей. Обратите внимание на три места:</p>
      <ul class="checks">
        <li><b>Требования</b> нужны не только дизайнеру и архитектору: по ним пишут код и по ним проверяет Лера. Поэтому ошибка в требованиях расползается дальше всех.</li>
        <li><b>Заявки сопровождения</b> возвращаются в анализ требований: каждая доработка — новое требование, со своим разбором и критериями. Жизненный цикл — не линия, а круг.</li>
        <li><b>План отключения</b> нужен системе, которая придёт на смену: данные и уроки старой переезжают в новую.</li>
      </ul>
      <p>В ГОСТ 34.601 у каждой стадии свой комплект документов-выходов (например, техническое задание по ГОСТ 34.602-2020). В Scrum артефакты другие — бэклог, инкремент, — но идея «что на входе, что на выходе» та же.</p>`,
    report: ans => ioEval(ans && ans.o, ans && ans.i).map(x => `- ${x.a.t}: создаётся — ${esc(stgT((ans.o || {})[x.a.id]))}${x.okO ? ' ✓' : ' ✗'}; нужен — ${(ans.i || {})[x.a.id] === 'new' ? 'новой системе' : stgT((ans.i || {})[x.a.id])}${x.okI ? ' ✓' : ' ✗'}`).join('\n')
  };

  // =====================================================================
  // Практика 3. Лаборатория «Соль вместо сахара»: забыли правило 22:30
  // =====================================================================
  const FIND = [
    { id: 'an', t: 'Анализ требований', sub: 'ревью требований', lb: 'Анализ', h: 1, who: 'galya', ppl: ['me', 'galya'],
      say: 'А заказы, которые придут после 22:30, куда? В 23:00 я план выпечки фиксирую.',
      what: 'На ревью требований с Галиной Ивановной всплывает вопрос. Аналитик дописывает правило: «Заказ на завтра принимается до 22:30 по времени пекарни: в 23:00 технолог фиксирует план выпечки» — и один критерий приёмки.',
      biz: 'Бизнес ничего не заметил.' },
    { id: 'design', t: 'Проектирование', sub: 'Соня рисует экран', lb: 'Проект', h: 3, who: 'sonya', ppl: ['me', 'sonya', 'dima', 'galya'],
      say: 'Что видит клиент, если оформляет заказ на завтра в 22:45? Такого экрана в сценарии нет.',
      what: 'Дописать требование, Соня дорисовывает состояние «приём на завтра закрыт», Дима добавляет время отсечки в схему данных.',
      biz: 'Бизнес ничего не заметил.' },
    { id: 'dev', t: 'Разработка', sub: 'код уже пишут', lb: 'Код', h: 10, who: 'dima', ppl: ['me', 'dima', 'sonya', 'igor', 'galya'],
      say: 'Мы уже сделали приём заказов на завтра круглые сутки. Теперь нужна отсечка в 22:30? Переписываем проверку, экран и передачу в план выпечки.',
      what: 'Требование, макет, схема, код проверки, экран оформления, передача заказов в план выпечки. Задача из следующего спринта сдвигается.',
      biz: 'Бизнес пока ничего не заметил, но спринт поплыл.' },
    { id: 'test', t: 'Тестирование', sub: 'Лера проверяет', lb: 'Тесты', h: 25, who: 'lera', ppl: ['me', 'lera', 'dima', 'sonya', 'igor', 'nina'],
      say: 'Оформила заказ на завтра в 23:40 — прошёл. А в плане выпечки его нет: план уже зафиксирован в 23:00. Так и задумано?',
      what: 'Всё то же, плюс тест-кейсы, повторная проверка соседних функций и новая сборка. Демо Нине переносится.',
      biz: 'Нина на демо видит, что предзаказ «ещё не готов».' },
    { id: 'pilot', t: 'Пилот в 2 пекарнях', sub: 'живые клиенты', lb: 'Пилот', h: 50, who: 'pavel', ppl: ['me', 'pavel', 'dima', 'lera', 'igor', 'galya', 'oleg'],
      say: 'Клиентка пришла за круассанами к восьми утра, а их не испекли! Заказ она сделала в полночь — приложение приняло.',
      what: 'Всё то же, плюс срочная выкатка исправления, ручной перенос заказов в план, обзвон клиентов, возвраты денег, новая памятка кассирам.',
      biz: 'Клиенты пришли за заказом, а его нет. Павел и кассиры извиняются в утренний пик.' },
    { id: 'ops', t: 'Все 9 пекарен', sub: 'неделя перед 8 Марта', lb: '9 пекарен', h: 100, who: 'nina', ppl: ['me', 'nina', 'rita', 'pavel', 'dima', 'lera', 'igor', 'galya', 'oleg'],
      say: 'Мне пишут во ВКонтакте: «Оплатила — не испекли!» Как такое случилось за неделю до 8 Марта?',
      what: 'Всё то же, плюс исправление сразу в 9 пекарнях, компенсации, разбор с Ниной, ответы в соцсетях, недоверие кассиров к системе.',
      biz: 'Ровно то, от чего «Колос» уходил: потерянные заказы и скандал в соцсетях.' }
  ];
  const IT_REDO = [
    { t: 'Требование и критерий приёмки', from: 0 },
    { t: 'Макет экрана «приём закрыт»', from: 1 },
    { t: 'Схема данных и правило в API', from: 1 },
    { t: 'Код проверки и экран оформления', from: 2 },
    { t: 'Передача заказов в план выпечки', from: 2 },
    { t: 'Тест-кейсы и повторная проверка', from: 3 },
    { t: 'Срочная выкатка исправления', from: 4 },
    { t: 'Ручной перенос заказов и обзвон клиентов', from: 4 },
    { t: 'Памятка и переобучение кассиров', from: 4 },
    { t: 'Компенсации и ответы во ВКонтакте', from: 5 }
  ];
  const fmtH = h => h >= 100 ? '100+ ч' : h + ' ч';
  const SALT_Q = {
    q: 'Что аналитик может сделать на стадии анализа, чтобы такая ошибка нашлась там, где она стоит 1 час? Отметьте всё полезное.', multi: true, seed: 'sdlc-salt-q',
    options: [
      { t: 'Спросить Галину Ивановну, что происходит с заказами в 23:00 и позже', ok: 1, why: 'Да: правило 22:30 живёт у технолога в голове. Вопрос про время и границы его достаёт.' },
      { t: 'Пройти с цехом «сутки одного заказа» по часам: когда принят, когда попал в план, когда испечён, когда выдан', ok: 1, why: 'Да: прогон по времени вытаскивает все отсечки и окна.' },
      { t: 'Провести ревью требований с Димой и Лерой: «а если заказ придёт в 22:31? а в 23:40?»', ok: 1, why: 'Да: граничные вопросы Леры дешевле всего задать до кода.' },
      { t: 'У каждого правила записать источник: кто сказал и почему именно так', ok: 1, why: 'Да: правило без источника легко потерять или переврать — и не у кого переспросить.' },
      { t: 'Ничего: такие ошибки всё равно найдёт Лера на тестировании', why: 'Найдёт — но уже за 25 часов, а не за 1.' },
      { t: 'Сократить анализ, чтобы быстрее начать писать код', why: 'Тогда ошибка проживёт дольше и найдётся позже — дороже.' },
      { t: 'Попросить разработчиков быть внимательнее', why: 'Разработчики сделают ровно то, что написано. Правила 22:30 в требованиях нет — внимательность не поможет.' }
    ]
  };
  const SQ_OK = quizRef(SALT_Q);
  function saltQ(sel) {
    sel = new Set(sel || []);
    const good = SQ_OK.filter(i => sel.has(i)).length, bad = [...sel].filter(i => !SQ_OK.includes(i)).length;
    return { good, bad, score: Math.max(0, (good - bad) / SQ_OK.length), ok: good >= SQ_OK.length - 1 && bad === 0 };
  }
  const saltTask = {
    id: 'salt-lab', title: 'Лаборатория: соль вместо сахара',
    simple: howCost.simple,
    lead: ui.brief({
      situation: 'Требование, которое легко забыть: «Заказ на завтра принимается до 22:30 по времени пекарни: в 23:00 Галина Ивановна фиксирует план выпечки». Допустим, на анализе его не записали — и приложение принимает заказы на завтра круглые сутки. Кто-то эту ошибку обязательно найдёт. Вопрос — на какой стадии.',
      todo: [
        'В блоке «Где нашли ошибку» выберите стадию — от анализа требований до всех 9 пекарен перед 8 Марта.',
        'Для каждой смотрите: кто нашёл и что сказал, что приходится переделывать, кто втянут, во сколько раз дороже и что заметил бизнес. Пройдите хотя бы 4 стадии, обязательно первую и последнюю.',
        'Ответьте на вопрос внизу — что аналитик может сделать заранее — и нажмите «Проверить».'
      ],
      look: 'Часы — работа команды на исправление в нашей модели (на анализе — 1 час). Красным в списке — то, что приходится переделывать; серым — что пока не затронуто. Это иллюстрация эвристики, а не замер: в реальных проектах множители другие, направление — то же.'
    }),
    blank: () => ({ st: 'an', seen: [], q: [], scale: 'lin' }),
    reference: () => ({ st: 'pilot', seen: FIND.map(f => f.id), q: SQ_OK.slice(), scale: 'log' }),
    render(el, ctx) {
      el.classList.add('sdlc-root');
      const a = ctx.ans; a.seen = a.seen || []; a.q = a.q || []; a.st = a.st || 'an'; a.scale = a.scale || 'lin';
      const mark = () => { if (!ctx.readonly && !a.seen.includes(a.st)) { a.seen.push(a.st); ctx.save(); } };
      mark();
      el.innerHTML = `<div class="stack">
        <div class="eyebrow">Где нашли ошибку</div>
        <div class="sdlc-steps six" data-find></div>
        <div data-out></div>
        <div class="row"><span class="small dim">Шкала графика:</span>${ui.seg('scale', [{ v: 'lin', t: 'обычная' }, { v: 'log', t: 'логарифмическая' }], a.scale)}</div>
        <div data-chart></div>
        ${ui.note('info', 'Позиция аналитика', 'На стадии анализа ошибку находит сам аналитик — вопросами. На всех следующих её находит кто-то другой, и аналитик всё равно участвует в исправлении: правит требования, объясняет, договаривается. Только уже дороже.')}
        <div class="card flat" data-q></div>
      </div>`;
      function draw() {
        const idx = Math.max(0, FIND.findIndex(f => f.id === a.st)), f = FIND[idx];
        TR.$('[data-find]', el).innerHTML = FIND.map((x, i) => `<button type="button" class="sdlc-st ${a.seen.includes(x.id) && i !== idx ? 'seen' : ''}" data-f="${x.id}" aria-pressed="${i === idx}" ${ctx.readonly ? 'disabled' : ''}><span class="n">${i + 1}</span><span class="nm">${esc(x.t)}</span><span class="sub">${esc(x.sub)}</span></button>`).join('');
        const redo = IT_REDO.filter(r => r.from <= idx).length;
        TR.$('[data-out]', el).innerHTML = `<div class="stack tight">
          <div class="sdlc-stats">
            <div class="stat"><span class="k">Во сколько раз дороже</span><span class="v ${f.h >= 25 ? 'bad' : f.h >= 10 ? 'warn' : 'ok'}">×${f.h}${f.h >= 100 ? '+' : ''}</span><span class="s">чем на анализе</span></div>
            <div class="stat"><span class="k">Работа команды</span><span class="v">${fmtH(f.h)}</span><span class="s">в модели</span></div>
            <div class="stat"><span class="k">Переделываем</span><span class="v ${redo > 5 ? 'bad' : redo > 2 ? 'warn' : 'ok'}">${redo} из ${IT_REDO.length}</span><span class="s">пунктов списка ниже</span></div>
          </div>
          ${ui.say(f.who, esc(f.say))}
          <div class="small">${esc(f.what)}</div>
          <div class="row top"><span class="small dim" style="padding-top:3px">Кто втянут:</span><div class="sdlc-ppl">${f.ppl.map(person).join('')}</div></div>
          ${ui.note(idx >= 4 ? 'bad' : idx >= 2 ? 'warn' : 'ok', 'Что заметил бизнес', esc(f.biz))}
          <div class="eyebrow">Что переделываем</div>
          <div class="sdlc-redo">${IT_REDO.map(r => `<div class="it ${r.from <= idx ? 'on' : ''}">${esc(r.t)}</div>`).join('')}</div>
        </div>`;
        TR.$('[data-chart]', el).innerHTML = chartHTML(FIND.map(x => ({ lb: x.lb, v: x.h, lab: fmtH(x.h) })), idx, a.scale);
      }
      draw();
      const showRv = ctx.readonly || (ctx.result && ctx.result.ok);
      ui.quiz(TR.$('[data-q]', el), Object.assign({}, SALT_Q, { value: a.q, readonly: ctx.readonly, reveal: showRv ? ctx.result : null, onChange: v => { a.q = v; ctx.save(); } }));
      if (ctx.readonly) { TR.$$('[data-seg] button', el).forEach(b => { b.disabled = true; }); return; }
      TR.on(el, 'click', '[data-f]', (e, b) => { a.st = b.dataset.f; mark(); ctx.save(); draw(); });
      ui.onSeg(el, (n, v) => { if (n === 'scale') { a.scale = v; ctx.save(); draw(); } });
    },
    check(ans) {
      const seen = ((ans && ans.seen) || []).filter(id => FIND.some(f => f.id === id));
      const seenOk = seen.includes('an') && seen.includes('ops') && seen.length >= 4;
      const q = saltQ(ans && ans.q);
      const notes = [];
      if (!seen.includes('an')) notes.push({ ok: 'warn', html: 'Посмотрите стадию «Анализ требований» — это точка отсчёта: сколько стоит ошибка, если её поймать там.' });
      if (!seen.includes('ops')) notes.push({ ok: 'warn', html: 'Посмотрите последнюю стадию — все 9 пекарен перед 8 Марта. Что там добавляется к часам команды?' });
      if (seen.length < 4) notes.push({ ok: 'warn', html: `Просмотрено стадий: ${seen.length} из ${FIND.length}. Нужно хотя бы 4.` });
      else if (seenOk) notes.push({ ok: true, html: `Просмотрено стадий: ${seen.length} из ${FIND.length}.` });
      if (q.bad) notes.push({ ok: false, html: `${q.bad === 1 ? 'Среди отмеченных есть вариант, который не помогает' : `Среди отмеченных есть ${q.bad} ${TR.plural(q.bad, 'вариант', 'варианта', 'вариантов')}, которые не помогают`} найти ошибку <i>раньше</i>. Спросите себя про каждый: на какой стадии при этом найдётся ошибка?` });
      if (q.good < SQ_OK.length - 1) notes.push({ ok: false, html: `Полезных действий отмечено ${q.good} из ${SQ_OK.length}. Что ещё аналитик может сделать до кода — с цехом, с командой, с самой записью правила?` });
      if (q.ok) notes.push({ ok: true, html: 'Вопрос: верно — ошибку дешевле всего достать вопросами на анализе.' });
      const score = Math.min(seen.length, 4) / 4 * 0.3 + q.score * 0.7;
      return {
        ok: seenOk && q.ok, score, notes,
        summary: `Стадий просмотрено: ${seen.length} из ${FIND.length}. Полезных действий: ${q.good} из ${SQ_OK.length}, лишних: ${q.bad}.`,
        mentor: q.ok ? null : 'Ищите действия, после которых правило 22:30 появится в требованиях <b>до</b> того, как кто-то начнёт рисовать и программировать.'
      };
    },
    explain: `<p>Одна и та же забытая строчка стоит 1 час на анализе и 100+ часов во всех пекарнях перед праздником. Дорожает не сама строчка, а всё, что успели построить поверх неё: макет, схему, код, тесты, выкатку, обучение, ожидания клиентов.</p>
      <ul class="checks">
        <li>До разработки (анализ, проектирование) бизнес ничего не замечает — это дешёвая зона.</li>
        <li>С пилота к часам команды добавляются потери бизнеса: клиенты без заказа, обзвоны, отзывы. Их в часах не посчитать.</li>
        <li>«×100» в модели — иллюстрация. В реальных проектах множители другие, а в коротких итерациях разрыв меньше. Но направление одно.</li>
      </ul>
      <p>Лучшее противоядие — вопросы на анализе: «что происходит в 23:00?», сутки одного заказа по часам, ревью требований с Димой и Лерой, источник у каждого правила. Опора — эвристика Боэма (1981) и последующие работы; помните о её ограничениях.</p>`,
    report: ans => `Просмотрены стадии: ${((ans && ans.seen) || []).map(id => (FIND.find(f => f.id === id) || { t: id }).t).join(', ') || '—'}.\nОтмечено: ${((ans && ans.q) || []).map(i => plainT(SALT_Q.options[i] && SALT_Q.options[i].t) + (SQ_OK.includes(i) ? ' ✓' : ' ✗')).join('; ') || '—'}.`
  };

  // =====================================================================
  // Практика 4. Аналитик на каждой стадии
  // =====================================================================
  const AW = [
    { id: 'w1', st: 'init', who: 'igor', say: 'Нина хочет понять, сколько стоит обследование. Сколько тебе нужно дней и с кем встречаться?', hint: 'Что аналитик может дать на инициации, если требований ещё нет?', opts: [
      { t: 'Составить список тем и людей — Нина, Павел, Галина Ивановна, Олег Петрович, — прикинуть встречи и разбор и прийти к Игорю с оценкой и допущениями', ok: 1, why: 'Да: на инициации аналитик помогает понять объём анализа и честно называет, на чём держится оценка.' },
      { t: '«Сколько скажете, столько и сделаю»', why: 'Тогда срок назначат наугад, а отвечать за него будете вы. Оценка — ваш вклад в инициацию.' },
      { t: 'Отказаться: требований ещё нет, значит, оценить ничего нельзя', why: 'Требований нет, но темы и люди известны. Оценка с допущениями лучше, чем никакой.' }] },
    { id: 'w2', st: 'req', who: 'nina', say: 'Нужна кнопка «Заказать заранее», как у Додо! Запишите.', hint: 'Кнопка — это потребность или способ? Что стоит за ней?', opts: [
      { t: 'Выяснить, зачем: что сейчас происходит у кассы и что Нина хочет изменить, — а уже потом обсуждать кнопку', ok: 1, why: 'Да: за решением «кнопка» стоит потребность. Её и выясняют на анализе.' },
      { t: 'Записать «кнопка как у Додо» и отдать Соне рисовать', why: 'Это решение, а не требование. Соня нарисует кнопку, но не узнает, зачем она и для кого.' },
      { t: 'Объяснить Нине, что кнопка — это не требование, и закрыть тему', why: 'Нина права в главном — ей что-то нужно. Задача аналитика — выяснить что, а не поправлять заказчика.' }] },
    { id: 'w3', st: 'design', who: 'dima', say: 'Предлагаю хранить остатки витрины прямо в «КассаПро», без своей базы. Нормально?', hint: 'Кто выбирает технологии? И что тогда приносит аналитик?', opts: [
      { t: 'Рассказать, какие требования к остаткам важны — как часто обновлять, что будет без связи, сколько заказов в пик, — и вместе проверить, покрывает ли их вариант Димы', ok: 1, why: 'Да: на проектировании аналитик не выбирает технологию, но проверяет, что решение покрывает требования.' },
      { t: 'Это решение Димы, аналитика не касается', why: 'Касается: если решение не покрывает требования, это всплывёт на тестировании или в пилоте.' },
      { t: 'Настоять на своей базе — так правильнее', why: 'Выбор технологии — зона архитектора. Аналитик приносит требования и факты, а не готовое решение.' }] },
    { id: 'w4', st: 'dev', who: 'dima', say: 'До скольких принимаем заказ на завтра — по времени сервера или пекарни? Разработчик пишет проверку прямо сейчас.', hint: 'Сколько разработчик может ждать ответа? И где должен остаться ответ?', opts: [
      { t: 'Ответить в тот же день: по местному времени пекарни; если не уверены — уточнить у Галины Ивановны и дописать критерий приёмки', ok: 1, why: 'Да: на разработке аналитик отвечает быстро и записывает ответ туда, где его найдут Лера и следующий разработчик.' },
      { t: '«Сделайте, как вам удобнее, потом поправим»', why: 'Это решение за бизнес — и будущая переделка.' },
      { t: 'Ответить на следующей неделе, после встречи с заказчиком', why: 'Неделю разработчик либо стоит, либо угадывает.' }] },
    { id: 'w5', st: 'test', who: 'lera', say: 'Заказ на завтра нельзя изменить после 22:30. Это баг или так и задумано? В требованиях ничего нет.', hint: 'Чего нет в требованиях — это ошибка кода или пробел в требованиях? Кто решает, нужно ли?', opts: [
      { t: 'Выяснить у бизнеса, нужно ли изменение; если это новое требование — оформить запрос на изменение, а не чинить молча как баг', ok: 1, why: 'Да: «баг или новое требование» — один из главных вопросов аналитика на тестировании.' },
      { t: 'Раз в требованиях нет — значит, не баг. Закрыть', why: 'Формально верно, но если бизнесу это нужно, пробел всплывёт в пилоте. Разберитесь.' },
      { t: 'Попросить разработчиков срочно сделать изменение заказа', why: 'Это новая функция без анализа и оценки. Её нужно описать и согласовать, а не протащить тайком.' }] },
    { id: 'w6', st: 'deploy', who: 'pavel', say: 'Через неделю пилот. Как моим кассирам за смену разобраться с новым экраном?', hint: 'Кто лучше всех знает сценарии кассира? И в каком виде они нужны кассиру?', opts: [
      { t: 'Подготовить короткую памятку по сценариям кассира, пройти её с Павлом на настоящем экране и собрать вопросы первой недели', ok: 1, why: 'Да: на внедрении аналитик превращает требования в понятные инструкции и ловит первые вопросы.' },
      { t: 'Отправить кассирам ссылку на требования — там всё есть', why: 'Требования пишут для команды. Кассиру в утренний пик нужна памятка на страницу.' },
      { t: 'Это задача Павла, аналитика не касается', why: 'Павел отвечает за своих людей, но лучше всех сценарии знает аналитик.' }] },
    { id: 'w7', st: 'support', who: 'pavel', say: 'Клиентка хочет поменять пекарню в уже оплаченном заказе, а кассир не может. Почините!', hint: 'Это ошибка или новое требование? Что с ним делают дальше?', opts: [
      { t: 'Разобрать заявку: ошибка это или новая возможность; если новая — описать, оценить с Игорем, согласовать с Ниной и поставить в очередь', ok: 1, why: 'Да: на сопровождении аналитик отделяет ошибки от новых требований и запускает для них маленький цикл заново.' },
      { t: 'Сразу попросить разработчиков сделать — клиент же просит', why: 'Без анализа изменение может сломать план выпечки и чеки. Сначала разбор.' },
      { t: 'Ответить, что так и задумано, и закрыть заявку', why: 'Может, и задумано — но запрос живой. Его стоит записать и показать Нине.' }] },
    { id: 'w8', st: 'retire', who: 'oleg', say: 'Если через несколько лет перейдёте на новую систему, где будут продажи и чеки за прошлые годы? Мне их хранить.', hint: 'Что нужно знать, прежде чем выключать систему? У кого спросить?', opts: [
      { t: 'Описать, какие данные перенести, какие отправить в архив и сколько хранить, кого и когда предупредить, — и согласовать с Олегом Петровичем', ok: 1, why: 'Да: вывод из эксплуатации — тоже требования: к данным, срокам и людям.' },
      { t: 'Просто выключить: новая система же есть', why: 'Тогда пропадут данные, которые бухгалтерия обязана хранить.' },
      { t: 'Это вопрос администраторов, аналитика не касается', why: 'Технически отключат администраторы, но что и сколько хранить — требование бизнеса. Его выясняет аналитик.' }] }
  ];
  const awEval = a => AW.map(w => { const v = (a || {})[w.id], i = v && v[0]; return { w, empty: i == null, ok: i != null && !!(w.opts[i] && w.opts[i].ok) }; });
  const awTask = {
    id: 'analyst-where', title: 'Аналитик на каждой стадии',
    simple: {
      icon: '🧭',
      plain: 'Аналитик нужен не только в начале. На каждой стадии к нему приходят со своим вопросом — и по вопросу понятно, где сейчас проект.',
      analogy: 'Технолог в пекарне: составляет рецепт, отвечает пекарю «сколько дрожжей?», пробует на дегустации, разбирает жалобы покупателей и решает, что делать с рецептом, который сняли с витрины.',
      tech: 'Пик работы аналитика — анализ требований, но он участвует во всех стадиях: оценка на инициации, ответы и проверка решений при проектировании и разработке, «ошибка или новое требование» на тестировании и в сопровождении, памятки на внедрении, требования к данным при выводе из эксплуатации.'
    },
    lead: ui.brief({
      situation: 'Неделя за неделей к вам приходят люди с вопросами. По вопросу можно понять, на какой стадии проект и чего от вас ждут. Восемь стадий — восемь ситуаций.',
      todo: [
        'Для каждой стадии прочитайте реплику и выберите, как поступит аналитик. Переключайте стадии кнопками сверху или «Дальше →».',
        'Ответьте на все восемь и нажмите «Проверить». Засчитывается от 7 из 8.'
      ],
      look: 'Неверные варианты здесь не глупые — так часто поступают новички: «это не моё», «потом поправим», «решу за них». Ищите вариант, где аналитик не решает за других, но и не уходит в сторону.'
    }),
    blank: () => ({ a: {} }),
    reference: () => ({ a: Object.fromEntries(AW.map(w => [w.id, [w.opts.findIndex(o => o.ok)]])) }),
    render(el, ctx) {
      el.classList.add('sdlc-root');
      const ans = ctx.ans; ans.a = ans.a || {};
      const res = ctx.result ? Object.fromEntries(awEval(ans.a).map(x => [x.w.id, x])) : null;
      const quizIn = (box, w) => ui.quiz(box, { q: '', options: w.opts, seed: 'sdlc-aw-' + w.id, value: ans.a[w.id] || [], readonly: ctx.readonly, reveal: res && !res[w.id].empty ? ctx.result : null, onChange: v => { ans.a[w.id] = v; ctx.save(); drawNav(); } });
      const head = (w, i) => `<div><div class="eyebrow">Стадия ${i + 1} из ${AW.length}</div><h3 class="sdlc-h3">${esc(stgT(w.st))}</h3></div>${ui.say(w.who, esc(w.say))}`;
      if (ctx.readonly) {
        el.innerHTML = `<div class="stack">${AW.map((w, i) => `<div class="card flat">${head(w, i)}<div data-qq="${w.id}"></div></div>`).join('')}</div>`;
        AW.forEach(w => quizIn(TR.$(`[data-qq="${w.id}"]`, el), w));
        return;
      }
      let cur = 0;
      el.innerHTML = '<div class="sdlc-aw"><div class="sdlc-awnav" data-nav></div><div class="card flat" data-cur></div><div class="row between"><button type="button" class="btn sm ghost" data-mv="-1">← Назад</button><span class="small dim" data-cnt></span><button type="button" class="btn sm" data-mv="1">Дальше →</button></div></div>';
      function drawNav() {
        TR.$('[data-nav]', el).innerHTML = AW.map((w, i) => {
          const done = (ans.a[w.id] || []).length > 0, r = res && res[w.id];
          return `<button type="button" class="sdlc-st ${done ? 'done' : ''} ${r && !r.empty ? (r.ok ? 'ok' : 'bad') : ''}" data-go="${i}" aria-pressed="${i === cur}" title="${esc(stgT(w.st))}"><span class="n">${i + 1}</span><span class="nm">${esc(STG.find(s => s.id === w.st).sh)}</span></button>`;
        }).join('');
        const n = AW.filter(w => (ans.a[w.id] || []).length).length;
        TR.$('[data-cnt]', el).textContent = `Отвечено: ${n} из ${AW.length}`;
      }
      function drawCur() {
        const w = AW[cur], box = TR.$('[data-cur]', el);
        box.innerHTML = head(w, cur) + '<div data-qq></div>';
        quizIn(TR.$('[data-qq]', box), w);
        TR.$('[data-mv="-1"]', el).disabled = cur === 0;
        TR.$('[data-mv="1"]', el).disabled = cur === AW.length - 1;
      }
      TR.on(el, 'click', '[data-go]', (e, b) => { cur = +b.dataset.go; drawNav(); drawCur(); });
      TR.on(el, 'click', '[data-mv]', (e, b) => { cur = Math.max(0, Math.min(AW.length - 1, cur + (+b.dataset.mv))); drawNav(); drawCur(); });
      drawNav(); drawCur();
    },
    check(ans) {
      const ev = awEval(ans && ans.a), good = ev.filter(x => x.ok).length;
      const notes = ev.filter(x => !x.ok).map(x => ({ ok: false, html: `«${esc(stgT(x.w.st))}»: ${x.empty ? 'не отвечено. ' : ''}${esc(x.w.hint)}` }));
      if (!notes.length) notes.push({ ok: true, html: 'На всех восьми стадиях аналитик на своём месте.' });
      return {
        ok: good >= 7, score: good / AW.length, notes,
        summary: `Верно: ${good} из ${AW.length}.`,
        mentor: good >= 7 ? null : 'Общая черта верных вариантов: аналитик не решает за других (технологии — Диме, приоритеты — Нине), но и не говорит «это не моё». Он приносит факты и формулирует, что нужно.'
      };
    },
    explain: `<p>Аналитик нужен на всех стадиях, но его роль меняется: на инициации помогает понять, что и зачем обследовать; на анализе — главный; дальше отвечает на вопросы, следит, чтобы решения покрывали требования, отличает баг от нового требования, готовит памятки и разбирает заявки. Даже при выводе из эксплуатации нужен человек, который знает, какие данные важны и кому.</p>
      <p>Общая черта верных вариантов: аналитик <b>не решает за других</b> (технологии — Диме, приоритеты — Нине), но и <b>не уходит в сторону</b>. Он приносит факты, задаёт вопросы и записывает ответ туда, где его найдут.</p>`,
    report: ans => awEval(ans && ans.a).map(x => `- ${stgT(x.w.st)}: ${x.empty ? '—' : plainT(x.w.opts[((ans.a || {})[x.w.id] || [])[0]].t)} ${x.ok ? '✓' : '✗'}`).join('\n')
  };

  // =====================================================================
  // Практика 5. Ответ Нине: зачем обследование
  // =====================================================================
  const SV_RUBRIC = [
    'Обследование даёт на выходе согласованные требования, процессы и объём первой версии — без них нечего оценивать, рисовать и программировать',
    'Ошибка дорожает со стадией: на бумаге её исправляют за час, в коде — за дни, в пилоте — ещё и с потерянными заказами; пример — правило 22:30 или мощность цеха',
    'Честно: «×10» и «в 100 раз» — эвристика, а не точный закон; направление верное, цифры у всех разные',
    'Связь с деньгами и сроком: 600 тыс. ₽ — около 10 % бюджета, цена фиксированная, а переделки без анализа скорее сорвут 1 марта',
    'На языке Нины: без жаргона, про торты, круассаны, деньги и сроки'
  ];
  const SV_REF = 'Нина Сергеевна, три недели обследования — это не задержка, а страховка срока. За это время мы вместе с вами, Галиной Ивановной и Олегом Петровичем выясним правила: до скольких принимать заказы на завтра, сколько тортов цех может сделать, какие чеки нужны по закону. Если начать программировать сразу, эти правила всё равно всплывут — но позже: на проверке, на пилоте или в неделю 8 Марта. Исправить правило на бумаге — час работы. Исправить его в готовом приложении — дни, а на пилоте — ещё и клиенты, которые пришли за круассанами, а их не испекли. Говорят, что это в десятки раз дороже; точной цифры никто не назовёт, но направление всегда одно. 600 тысяч — около десятой части бюджета, и цена фиксированная. А на выходе у вас будет согласованный список того, что войдёт к 1 марта, — и мы сможем честно назвать срок и стоимость разработки.';
  const surveyTask = {
    id: 'why-survey', title: 'Ответить Нине: зачем обследование',
    simple: {
      icon: '✉️',
      plain: 'Заказчику важно не «как устроен жизненный цикл», а что он получит за свои деньги и почему это сбережёт срок.',
      analogy: 'Объяснить клиентке, зачем пятнадцать минут расспросов перед заказом свадебного торта: иначе торт испекут быстро — но не тот, и переделывать будет поздно.',
      tech: 'Аргументы: выход стадии анализа — вход для оценки, проектирования и разработки; рост стоимости ошибки по стадиям (эвристика, не закон); договор «Колоса» — обследование по фиксированной цене, разработка по факту работы.'
    },
    lead: ui.brief({
      situation: 'Нина Сергеевна пишет Игорю: «Зачем мне платить 600 тысяч за три недели „обследования“? Давайте сразу программировать — до 1 марта мало времени». Игорь пересылает вам: «Набросай ответ, я поправлю и отправлю».',
      todo: [
        'Напишите Нине 5–8 предложений без технического жаргона (от 250 символов).',
        'Ответьте на её страх: почему анализ не крадёт время, а бережёт его. Опирайтесь на лабораторию «Соль вместо сахара».',
        'Нажмите «Проверить с Ксенией (Claude)» или «Сверить с эталоном самому» и честно отметьте раскрытые пункты. Засчитывается от 60 %.'
      ],
      lookTitle: 'На что опереться',
      look: 'Цифры: бюджет первого года — 6 млн ₽, обследование — 600 тыс. ₽ и 3 недели по фиксированной цене, пилот — 1 февраля, все 9 пекарен и торты — 1 марта 2027. Правило 22:30 и мощность цеха — живые примеры. И не обещайте Нине «ровно в 100 раз дешевле» — это эвристика.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: SV_REF, self: SV_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('sdlc-root');
      el.insertAdjacentHTML('beforeend', ui.say('nina', 'Зачем мне платить 600 тысяч за три недели «обследования»? Я вам и так всё расскажу. Давайте сразу программировать — до 1 марта мало времени!'));
      const j = document.createElement('div'); j.style.marginTop = '12px'; el.appendChild(j);
      ui.justify(j, {
        id: 'sdlc-survey', q: 'Зачем «Колосу» три недели обследования перед разработкой?', qPlain: 'Объясните владелице сети пекарен без жаргона, зачем платить 600 тысяч за три недели обследования перед разработкой, если до срока 1 марта мало времени.',
        rubric: SV_RUBRIC, reference: SV_REF, value: ctx.ans.j, readonly: ctx.readonly, minLen: 250,
        onChange: v => { ctx.ans.j = v; ctx.save(); ctx.decide('Зачем обследование (ответ Нине)', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j);
      return {
        ok: s >= 0.6, score: s,
        summary: s ? `Оценка ответа: ${Math.round(s * 100)} %.` : 'Напишите ответ (от 250 символов) и проверьте его с Ксенией или сверьте с эталоном сами.',
        notes: s && s < 0.6 ? [{ ok: false, html: 'Нине важно три вещи: что она получит на выходе обследования, почему без него срок скорее сорвётся (живой пример) и честный разговор о цифрах.' }] : []
      };
    },
    explain: `<p>Хороший ответ заказчику связывает жизненный цикл с его деньгами: выход стадии анализа — вход для оценки и разработки; без него оценка — гадание, а ошибки находят позже и дороже. И важная честность: «в 100 раз» — не закон природы. Скажите «чем позже, тем дороже» и дайте живой пример — этого достаточно.</p>
      <p>Так и устроен договор «Колоса»: короткое обследование по фиксированной цене, а разработка — по факту работы, спринтами. Почему именно так — завтра, в тренировке про модели разработки.</p>`,
    report: ans => (ans.j && ans.j.text) ? ans.j.text : '—'
  };

  // =====================================================================
  TR.stage({
    id: 'sdlc', act: 1, order: 40, slot: 'Ср 10:00', title: 'Жизненный цикл',
    when: 'среда, 10:00 · переговорная «Квант Софт», маркерная доска',
    intro: [
      { who: 'igor', html: 'Нина Сергеевна прочитала договор и звонит: «Зачем мне три недели обследования за 600 тысяч? Давайте сразу программировать — до 1 марта мало времени». Мне нужно ей ответить. Поможете?' },
      { who: 'ksenia', html: 'Поможем. Но сначала разберёмся сами. У любой системы есть жизненный цикл — от идеи до дня, когда её выключат. На каждой стадии у аналитика своя работа, а ошибка, пропущенная в начале, дорожает с каждым шагом. В конце напишете Нине ответ сами.' }
    ],
    facts: [],
    glossary: [
      { term: 'Жизненный цикл ПО', simple: 'Путь торта: заказ → рецепт → закупка → выпечка → дегустация → выдача → отзывы и новый рецепт.', tech: 'Все стадии существования системы — от замысла до вывода из эксплуатации. ISO/IEC/IEEE 12207 описывает его как набор процессов, ГОСТ 34.601-90 — как стадии создания.' },
      { term: 'Стадия жизненного цикла', simple: 'Шаг пути торта, после которого есть понятный результат: рецепт, тесто, готовый торт.', tech: 'Период жизненного цикла со своей целью, входами, выходами и критериями завершения: инициация, анализ требований, проектирование, разработка, тестирование, внедрение, сопровождение, вывод из эксплуатации.' },
      { term: 'Вход и выход стадии', simple: 'Что нужно, чтобы начать (мука и рецепт), и что получится в конце (тесто).', tech: 'Входы — артефакты и решения, без которых стадию не начать; выходы — результаты, которые стадия передаёт следующей.' },
      { term: 'Артефакт', simple: 'Всё, что остаётся на бумаге или в файлах после работы: рецепт, техкарта, накладная.', tech: 'Результат работы, который можно передать и проверить: требования, макеты, код, тест-кейсы, инструкции, акты.' },
      { term: 'Пилот (опытная эксплуатация)', simple: 'Продавать новую булку сначала в двух пекарнях, а не сразу во всех девяти.', tech: 'Запуск системы на ограниченном числе пользователей или площадок, чтобы проверить её в реальной работе до полного внедрения. У «Колоса» — 2 пекарни к 1 февраля 2027.' },
      { term: 'Сопровождение', simple: 'После выдачи торта — отзывы, жалобы, поправки рецепта.', tech: 'Стадия, на которой систему эксплуатируют, исправляют ошибки и дорабатывают по запросам. Самая долгая по времени. У «Колоса» после пилота — по Kanban.' },
      { term: 'Вывод из эксплуатации', simple: 'Снять торт с витрины: остатки продать, рецепт — в архив, постоянных покупателей предупредить.', tech: 'Завершение жизни системы: перенос или архивирование данных, отключение, уведомление пользователей. В ISO/IEC/IEEE 12207 — процесс изъятия (disposal).' },
      { term: 'Рост стоимости ошибки', simple: 'Соль вместо сахара: в рецепте — исправили карандашом, в тесте — выбросили тесто, на витрине — вернули деньги и потеряли клиента.', tech: 'Эвристика (Боэм, 1981, и последующие работы): чем позже найдена ошибка в требованиях, тем дороже исправление — в эксплуатации в десятки–сотни раз дороже, чем на анализе. «×10 на этап» — правило для разговора, не точный закон.' },
      { term: 'ГОСТ 34.601-90', simple: 'Государственный «регламент цеха»: какие стадии проходит система и какие документы на каждой.', tech: '«Автоматизированные системы. Стадии создания»: формирование требований, концепция, техническое задание, эскизный и технический проект, рабочая документация, ввод в действие, сопровождение. Часто обязателен в госпроектах. В 2021 году вышел ГОСТ Р 59793-2021 на ту же тему.' },
      { term: 'ISO/IEC/IEEE 12207', simple: 'Международный справочник: какие работы вообще бывают при создании программ — без жёсткого порядка.', tech: 'Международный стандарт процессов жизненного цикла ПО (редакция 2017): процессы соглашения, организационного обеспечения, управления проектом и технические — от анализа бизнеса до изъятия из эксплуатации.' }
    ],
    outro: 'Жизненный цикл — это карта: где мы сейчас, что должно быть на входе и что отдаём дальше. Аналитик нужен на всех стадиях, но дешевле всего его работа на анализе: там ошибка — исправление карандашом. И помните, что «×10» — эвристика, а не закон: важна не цифра, а направление. Завтра — модели разработки: каскад, V-модель и итерации — разные способы пройти эти стадии. И разберёмся, почему у «Колоса» договор в два этапа.',
    tasks: [howStages, howIO, howCost, orderTask, artTask, saltTask, awTask, surveyTask]
  });
})();
