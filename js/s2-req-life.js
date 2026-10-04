/* Неделя 2, четверг 10:00 — «Жизнь требования».
   Теория: инженерия требований как процесс (выявление → анализ → спецификация → проверка → управление, «что если пропустить»),
   паспорт требования («убери атрибут — кто пострадает»), где хранят требования (вики, трекер, таблица, система управления);
   статусы на соседних примерах и базовая версия с запросом на изменение; лаборатория трассировки цели БЦ-3.
   Практика: карточка требования про сводку в 1С; провести «торт за 48 часов» по статусам;
   собрать матрицу трассировки «Колоса» и найти дыры; ответить Диме, зачем трассировка. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;

  if (!document.getElementById('rql-css')) document.head.insertAdjacentHTML('beforeend', `<style id="rql-css">
    .rql-root, .rql-root .stack > * { min-width: 0; }
    .rql-root .seg button { white-space: normal; text-align: left; }
    .rql-root .btn { white-space: normal; }
    .rql-h3 { margin: 2px 0 0; font: 600 18px/1.3 var(--f-brand); }
    .rql-lbl { display: block; font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 3px; }
    .rql-steps { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; }
    .rql-st { display: grid; justify-items: center; align-content: start; gap: 4px; padding: 8px 4px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); color: var(--text-2); font-size: 12.5px; line-height: 1.2; text-align: center; min-width: 0; }
    .rql-st .ic { font-size: 18px; line-height: 1; }
    .rql-st .nm { min-width: 0; overflow-wrap: anywhere; }
    .rql-st[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--text); box-shadow: 0 0 0 1px var(--accent); }
    .rql-st.skip { border-style: dashed; border-color: var(--bad); }
    .rql-st.skip .nm { text-decoration: line-through; }
    .rql-brace { display: grid; grid-template-columns: 4fr 1fr; gap: 6px; font: 600 10px/1.3 var(--f-mono); letter-spacing: .06em; text-transform: uppercase; color: var(--text-muted); text-align: center; }
    .rql-brace span { border-top: 2px solid var(--border-strong); padding-top: 4px; }
    .rql-flow { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    .rql-box { padding: 9px 12px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface); font-size: 14px; min-width: 0; }
    .rql-box.an { border-color: color-mix(in srgb, var(--violet) 45%, var(--border)); background: var(--violet-soft); }
    .rql-pass { display: grid; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; background: var(--surface); }
    .rql-pr { display: grid; grid-template-columns: 150px minmax(0, 1fr) auto; gap: 4px 12px; align-items: center; padding: 8px 12px; border-top: 1px solid var(--border); font-size: 14px; }
    .rql-pr:first-child { border-top: 0; }
    .rql-pr .k { font: 600 11px/1.3 var(--f-mono); letter-spacing: .06em; text-transform: uppercase; color: var(--accent); }
    .rql-pr .v { min-width: 0; }
    .rql-pr.off { background: var(--bad-soft); }
    .rql-pr.off .k { color: var(--bad); }
    .rql-pr.off .v { text-decoration: line-through; color: var(--text-muted); }
    .rql-pr .miss { grid-column: 1 / -1; font-size: 13px; color: var(--text); }
    .rql-pr .why { grid-column: 2 / -1; font-size: 12.5px; color: var(--text-muted); }
    .rql-stores { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
    .rql-store { display: grid; gap: 6px; align-content: start; padding: 10px 12px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); font-size: 13.5px; min-width: 0; }
    .rql-store.best { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent); }
    .rql-store h4 { font: 600 14px/1.3 var(--f-brand); margin: 0; }
    .rql-dots { display: inline-flex; gap: 3px; }
    .rql-dots i { width: 10px; height: 10px; border-radius: 50%; background: var(--surface-3); border: 1px solid var(--border-strong); }
    .rql-dots i.on { background: var(--accent); border-color: var(--accent); }
    .rql-qs { display: grid; gap: 8px; }
    .rql-qs .q { display: grid; grid-template-columns: minmax(0, 1fr); gap: 4px; font-size: 13.5px; }
    .rql-line { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; }
    .rql-sch { display: inline-block; padding: 4px 10px; border-radius: 99px; border: 1px solid var(--border-strong); background: var(--surface-2); font-size: 13px; color: var(--text-2); }
    .rql-sch.cur { border-color: var(--accent); background: var(--accent); color: var(--accent-text); font-weight: 600; }
    .rql-sch.past { border-color: color-mix(in srgb, var(--accent) 50%, var(--border)); color: var(--text); }
    .rql-sch.side { border-style: dashed; }
    .rql-sch.side.cur { border-style: solid; background: var(--warn); border-color: var(--warn); color: var(--bg); }
    .rql-arr { color: var(--text-muted); font-size: 13px; }
    .rql-log { display: grid; gap: 4px; font-size: 13.5px; }
    .rql-log > div { display: grid; grid-template-columns: 120px minmax(0, 1fr); gap: 8px; padding: 6px 10px; border-radius: 8px; background: var(--surface); border: 1px solid var(--border); }
    .rql-req { display: grid; gap: 8px; padding: 12px 14px; border-radius: 12px; border: 1px solid var(--border); background: var(--surface); }
    .rql-req.base { border-color: var(--info); box-shadow: inset 4px 0 0 var(--info); }
    .rql-req .t { font-size: 15px; }
    .rql-req mark { background: var(--warn-soft); color: inherit; border-radius: 4px; padding: 0 3px; }
    .rql-cr { display: grid; gap: 8px; padding: 12px 14px; border-radius: 12px; border: 1px dashed var(--warn); background: var(--warn-soft); }
    .rql-cr ul { margin: 0; padding-left: 20px; display: grid; gap: 3px; font-size: 14px; }
    .rql-tl { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.2fr) minmax(0, 1.3fr) minmax(0, 1fr) minmax(0, 1.1fr); gap: 8px; }
    .rql-col { display: grid; gap: 6px; align-content: start; min-width: 0; }
    .rql-col > .h { font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--text-muted); padding: 0 2px; grid-column: 1 / -1; }
    .rql-node { text-align: left; display: grid; gap: 2px; padding: 7px 9px; border-radius: 9px; border: 1px solid var(--border); background: var(--surface); font-size: 12.5px; line-height: 1.3; min-width: 0; color: var(--text-2); }
    .rql-node b { font: 600 12px/1.3 var(--f-mono); color: var(--text); }
    .rql-node:hover { border-color: var(--text-muted); }
    .rql-node.sel { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-glow); background: var(--accent-soft); color: var(--text); }
    .rql-node.bw { border-color: var(--info); background: var(--info-soft); color: var(--text); }
    .rql-node.fw { border-color: var(--violet); background: var(--violet-soft); color: var(--text); }
    .rql-node.dim { opacity: .5; }
    .rql-node.prob { box-shadow: inset 4px 0 0 var(--bad); }
    .rql-legend { display: flex; flex-wrap: wrap; gap: 6px 12px; font-size: 12.5px; color: var(--text-2); }
    .rql-legend i { display: inline-block; width: 12px; height: 12px; border-radius: 3px; vertical-align: -1px; margin-right: 4px; border: 1px solid; }
    .rql-edges { display: flex; flex-wrap: wrap; gap: 6px; }
    .rql-edges .chip { white-space: normal; }
    .rql-edges button.x { border: 0; background: none; padding: 0 2px; color: inherit; font-size: 13px; }
    .rql-form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px 14px; }
    .rql-form .wide { grid-column: 1 / -1; }
    .rql-root select.ok { border-color: var(--ok); box-shadow: 0 0 0 1px var(--ok); }
    .rql-root select.bad { border-color: var(--bad); box-shadow: 0 0 0 1px var(--bad); }
    .rql-hint { font-size: 12.5px; color: var(--text-2); }
    .rql-hint.bad { color: var(--bad); }
    .rql-radio { display: grid; gap: 6px; }
    .rql-ro { text-align: left; display: grid; grid-template-columns: 18px minmax(0, 1fr); gap: 8px; padding: 8px 10px; border: 1px solid var(--border); border-radius: 9px; background: var(--surface); font-size: 14px; width: 100%; }
    .rql-ro .mk { width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid var(--border-strong); margin-top: 2px; }
    .rql-ro[aria-pressed="true"] { border-color: var(--accent); }
    .rql-ro[aria-pressed="true"] .mk { background: var(--accent); border-color: var(--accent); box-shadow: inset 0 0 0 3px var(--surface); }
    .rql-ro.ok { border-color: var(--ok); background: var(--ok-soft); }
    .rql-ro.bad { border-color: var(--bad); background: var(--bad-soft); }
    .rql-ro:disabled { opacity: 1; cursor: default; }
    .rql-paper { display: grid; gap: 12px; padding: 14px; border-radius: 12px; border: 1px solid var(--border-strong); background: var(--surface); }
    .rql-tlp { display: grid; }
    .rql-tst { display: flex; align-items: center; gap: 8px; }
    .rql-tr { display: grid; gap: 4px; padding: 8px 0 8px 18px; margin-left: 16px; border-left: 2px dashed var(--border-strong); }
    .rql-tr.ok { border-left-color: var(--ok); border-left-style: solid; }
    .rql-tr.bad { border-left-color: var(--bad); border-left-style: solid; }
    .rql-tr .why { font-size: 13px; color: var(--text-2); }
    .rql-mx { display: grid; gap: 8px; }
    .rql-mr { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 190px) minmax(0, 190px); gap: 6px 10px; align-items: center; padding: 8px 10px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); font-size: 14px; }
    .rql-mr .id { font: 600 12px/1.3 var(--f-mono); color: var(--text-muted); margin-right: 6px; }
    .rql-mr .why { grid-column: 1 / -1; font-size: 13px; color: var(--text-2); }
    .rql-mr.ok { border-color: var(--ok); } .rql-mr.bad { border-color: var(--bad); } .rql-mr.warn { border-color: var(--warn); }
    .rql-tests { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
    .rql-test { padding: 7px 10px; border-radius: 8px; border: 1px dashed var(--border-strong); background: var(--surface); font-size: 13px; }
    .rql-test b { font-family: var(--f-mono); font-size: 12px; }
    .rql-cov { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
    .rql-cov .stat .v { font-size: 14px; line-height: 1.3; font-family: var(--f-body); }
    .rql-rtm td.c { text-align: center; font-weight: 700; }
    .rql-rtm td.c.ok { color: var(--ok); }
    @media (max-width: 860px) {
      .rql-tl { grid-template-columns: minmax(0, 1fr); }
      .rql-col { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .rql-stores { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .rql-mr { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
      .rql-mr > .t { grid-column: 1 / -1; }
      .rql-cov { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 560px) {
      .rql-steps { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .rql-st { grid-template-columns: 22px minmax(0, 1fr); justify-items: start; align-items: center; text-align: left; padding: 7px 8px; }
      .rql-brace { display: none; }
      .rql-flow, .rql-stores, .rql-form, .rql-tests, .rql-col { grid-template-columns: minmax(0, 1fr); }
      .rql-pr { grid-template-columns: minmax(0, 1fr) auto; }
      .rql-pr .v { grid-column: 1 / -1; grid-row: 2; }
      .rql-pr .why { grid-column: 1 / -1; }
      .rql-mr { grid-template-columns: minmax(0, 1fr); }
      .rql-log > div { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .rql-root .mrow { grid-template-columns: minmax(0, 1fr); }
    }
  </style>`);

  // ---------- общие помощники ----------
  const plainT = s => String(s || '').replace(/<[^>]+>/g, '');
  const chip = (txt, k) => `<span class="chip ${k || ''}">${txt}</span>`;
  const dots = n => `<span class="rql-dots" aria-label="${n} из 5">${[1, 2, 3, 4, 5].map(k => `<i class="${k <= n ? 'on' : ''}"></i>`).join('')}</span>`;
  const GOALS = [
    { v: 'g1', t: 'БЦ-1 — списания с 12 % до 7 %' },
    { v: 'g2', t: 'БЦ-2 — выручка +15 %' },
    { v: 'g3', t: 'БЦ-3 — ни одного потерянного торта' },
    { v: 'g4', t: 'БЦ-4 — сверка с 2 часов до 15 минут' }
  ];
  const goalT = v => (GOALS.find(g => g.v === v) || { t: '—' }).t;

  // =====================================================================
  // Теория 1. Инженерия требований: процесс, паспорт, где хранят
  // =====================================================================
  const RE = [
    { id: 'elicit', t: 'Выявление', ic: '👂', en: 'elicitation',
      what: 'Узнать, что нужно: у людей, из документов, наблюдением.',
      an: 'Расспрашивает, наблюдает, читает документы; каждое пожелание записывает вместе с источником — кто сказал и где.',
      who: 'Павел, кассиры, Олег Петрович', out: 'Заметки встреч и наблюдений с источниками',
      ex: 'На смене на Покровке Павел говорит: «Списания пишем ручкой в журнал после закрытия, часть забываем, в Excel переносим раз в неделю».',
      skip: 'Требование записали со слов Нины: «пусть кассиры вносят списания». Как на самом деле устроен вечер в пекарне, никто не видел.' },
    { id: 'analyze', t: 'Анализ', ic: '🔬', en: 'analysis',
      what: 'Разобраться: зачем это, как связано с целью, не спорит ли с другими требованиями, чего не хватает.',
      an: 'Связывает с целью БЦ-1, задаёт вопросы «а если…», ищет противоречия, отделяет потребность от решения, вместе с Димой прикидывает объём.',
      who: 'Павел, Олег Петрович, Дима', out: 'Уточнённые правила, решённые вопросы, связь с целью',
      ex: 'Олег Петрович считает, что вносит управляющий, Павел — что кассир. Выясняем, как на самом деле, и что будет, если кассир ошибся или забыл.',
      skip: 'Противоречие «управляющий или кассир» никто не заметил. Его найдёт Лера на тестировании — или кассир в первый вечер пилота.' },
    { id: 'spec', t: 'Спецификация', ic: '📝', en: 'specification',
      what: 'Записать так, чтобы все поняли одинаково: формулировка, атрибуты, критерий проверки.',
      an: 'Пишет требование по правилам вчерашней тренировки и заполняет его паспорт: ID, источник, приоритет, статус, версия, цель, критерий.',
      who: 'аналитик; иногда вместе с Лерой', out: 'Требование в реестре с атрибутами',
      ex: 'В реестре появляется «ФТ-31. Кассир после закрытия, с 21:00 до 21:30, вносит списание: товар, количество, причина» — статус «На анализе», версия 0.1.',
      skip: 'Договорились устно. Через месяц Павел помнит «до 22:00», Дима — «в любое время», а Олег Петрович — «только управляющий».' },
    { id: 'validate', t: 'Проверка', ic: '✅', en: 'verification и validation',
      what: 'Убедиться, что записано правильно и что записано то, что нужно. Ревью и согласование.',
      an: 'Проводит ревью с Димой и Лерой — однозначно? проверяемо? выполнимо? — и показывает Павлу и Нине Сергеевне: это то, что вам нужно?',
      who: 'Дима, Лера, Павел, Нина Сергеевна', out: 'Замечания исправлены, требование согласовано',
      ex: 'Лера: «А если пекарня закрылась позже и кассир вносит в 21:40?» Павел: «Конечно, можно». Требование уточнили, Нина согласовала.',
      skip: 'Вопрос «а в 21:40?» Лера задаёт уже на тестировании, Павел отвечает «конечно, можно» — и код переделывают.' },
    { id: 'manage', t: 'Управление', ic: '🗂', en: 'management',
      what: 'Вести требование всю его жизнь: статус, версия, связи, изменения.',
      an: 'Обновляет статус и версию, связывает требование с целью, историями и тестами; изменения после согласования проводит через запрос на изменение.',
      who: 'вся команда, Игорь, Нина Сергеевна', out: 'Реестр со статусами, базовая версия, матрица трассировки, журнал изменений',
      ex: 'ФТ-31: «Согласовано», версия 1.0, связано с целью БЦ-1, историей ИСТ-12 и тестом ТК-40.',
      skip: 'Через месяц в чате три редакции ФТ-31. Какая действует, не знает никто: Дима делает одну, Лера проверяет другую.' }
  ];
  const ATTRS = [
    { id: 'id', t: 'ID', v: 'ФТ-31', why: 'Уникальный постоянный номер. На него ссылаются истории, задачи и тесты.', miss: '«То требование про списания» — какое? В реестре их пять. Ссылки из задач ведут в никуда.' },
    { id: 'text', t: 'Формулировка', v: 'Кассир после закрытия пекарни, с 21:00 до 21:30, вносит списание: товар из списка, количество в штуках, причина из списка.', why: 'Само требование — по правилам хорошей формулировки.', miss: 'Паспорт без требования: номер, статус и автор есть, а что делать — неизвестно.' },
    { id: 'src', t: 'Источник', v: 'Павел, смена на Покровке', why: 'Кто сказал и где. К нему идут с вопросами по сути.', miss: 'Через месяц никто не помнит, откуда взялось «с 21:00». Переспросить не у кого.' },
    { id: 'author', t: 'Автор', v: 'Вы, младший системный аналитик', why: 'Кто записал. К нему — вопросы о формулировке.', miss: 'Дима не знает, кого спросить, что значит «причина из списка», — и придумывает свой список.' },
    { id: 'prio', t: 'Приоритет', v: 'Should — нужно, но можно позже первой версии', why: 'Насколько важно и в какую версию.', miss: 'В первую версию тащат всё подряд, а когда не хватает времени, режут не то.' },
    { id: 'status', t: 'Статус', v: 'Согласовано', why: 'Где требование сейчас в своей жизни.', miss: 'Дима берёт в работу то, что Нина ещё не согласовала, — или не берёт согласованное.' },
    { id: 'ver', t: 'Версия', v: '1.0 — согласованная', why: 'Какая редакция действует.', miss: 'В чате три редакции: «до 21:30», «до 22:00», «в любое время». Какая правильная?' },
    { id: 'goal', t: 'Связь с целью', v: 'БЦ-1 — снизить списания с 12 % до 7 %', why: 'Зачем это бизнесу.', miss: 'Бюджет урезали — и непонятно, что можно вычеркнуть без вреда для целей Нины.' },
    { id: 'crit', t: 'Критерий проверки', v: 'В 21:10 внесено «Круассан, 4 шт., не продано» — утром запись есть в отчёте Нины с причиной и временем.', why: 'Как поймём, что сделано.', miss: 'Лера проверяет «на глаз», приёмка превращается в спор.' }
  ];
  const STORES = [
    { id: 'wiki', t: 'Вики', sub: 'Confluence и похожие', ic: '📚', plus: 'Связный текст, схемы, глоссарий; заказчику легко читать и комментировать.', minus: 'Статусы и связи ведут вручную; при сотнях требований страницы расползаются.' },
    { id: 'tracker', t: 'Трекер задач', sub: 'Jira и похожие', ic: '🎫', plus: 'Статусы, исполнители, связи с задачами и тестами — «из коробки»; команда и так там работает.', minus: 'Длинное описание и общая картина теряются в карточках; заказчику там неуютно.' },
    { id: 'table', t: 'Таблица', sub: 'Excel, Google Таблицы', ic: '📊', plus: 'Быстро начать, легко фильтровать и строить матрицу трассировки; понятно всем.', minus: 'Слабая история изменений, неудобно работать вместе; на сотнях строк — хаос.' },
    { id: 'rms', t: 'Система управления требованиями', sub: 'специальный класс программ', ic: '🏛', plus: 'Версия каждого требования, базовые версии, трассировка до тестов, отчёты для аудита — то, что требуют регуляторы.', minus: 'Дорого, долго внедрять, нужно учиться; для сети пекарен — из пушки по воробьям.' }
  ];
  function storeFit(id, a) {
    let s;
    if (id === 'wiki') s = 3 + (a.team === 'wiki' ? 1 : 0) - (a.n === 'many' ? 1 : 0) - (a.audit === 'yes' ? 1 : 0);
    if (id === 'tracker') s = 3 + (a.team === 'tracker' ? 1 : 0) - (a.audit === 'yes' ? 1 : 0);
    if (id === 'table') s = 3 + (a.n === 'few' ? 1 : a.n === 'mid' ? -1 : -2) - (a.audit === 'yes' ? 1 : 0);
    if (id === 'rms') s = 1 + (a.n === 'many' ? 2 : a.n === 'mid' ? 1 : 0) + (a.audit === 'yes' ? 2 : 0);
    return Math.max(1, Math.min(5, s));
  }
  const howProcess = {
    id: 'how-process', covers: ['card'], title: 'Как это работает: путь требования и его паспорт', free: true, noReset: true,
    simple: {
      icon: '🧭',
      plain: 'Требование не появляется готовым. Его узнают, разбирают, записывают, проверяют с людьми — и дальше ведут всю жизнь проекта.',
      analogy: 'Заказ торта: расспросили клиентку → уточнили, что цех успеет → записали в бланк → прочитали бланк клиентке вслух → бланк висит в цехе со статусом «принят / в работе / готов».',
      tech: '<b>Инженерия требований</b> у Вигерса и Битти делится на <b>разработку требований</b> (выявление, анализ, спецификация, проверка) и <b>управление требованиями</b> (статусы, версии, изменения, трассировка). В BABOK v3 то же разложено по областям знаний: «Выявление и сотрудничество», «Анализ требований и определение решения», «Управление жизненным циклом требований».'
    },
    lead: ui.brief({
      situation: 'Соседний пример — требование к планшету списаний: кассир вносит, что не продали. Проследим его путь от фразы Павла на смене до записи в реестре и посмотрим, из чего состоит его паспорт.',
      todo: [
        'Вкладка «Путь»: нажимайте стадии по очереди. Включите «Пропустить эту стадию» — что сломается?',
        'Вкладка «Паспорт»: убирайте атрибуты по одному и читайте, кто и когда пострадает. Какой атрибут вам кажется самым незаменимым?',
        'Вкладка «Где хранят»: ответьте на три вопроса о проекте и посмотрите, какое хранилище подходит лучше.'
      ],
      look: 'Пять стадий — не каскад: каждое новое требование проходит этот путь заново, а новые требования приходят всё время — и в разработке, и в сопровождении. Паспорт — это атрибуты: сведения о требовании, а не само требование.'
    }),
    render(el) {
      el.classList.add('rql-root');
      const tb = document.createElement('div'); el.appendChild(tb);
      ui.tabs(tb, [{ id: 'path', t: 'Путь', render: drawPath }, { id: 'pass', t: 'Паспорт', render: drawPass }, { id: 'store', t: 'Где хранят', render: drawStore }], 'path');
    }
  };
  function drawPath(pane) {
    const st = { i: 0, skip: new Set(), vv: 'ver' };
    pane.innerHTML = `<div class="stack"><div class="rql-steps" data-steps></div><div class="rql-brace"><span>разработка требований</span><span>управление</span></div><div data-card></div></div>`;
    function draw() {
      TR.$('[data-steps]', pane).innerHTML = RE.map((s, i) => `<button type="button" class="rql-st ${st.skip.has(i) ? 'skip' : ''}" data-i="${i}" aria-pressed="${i === st.i}"><span class="ic" aria-hidden="true">${s.ic}</span><span class="nm">${i + 1}. ${esc(s.t)}</span></button>`).join('');
      const s = RE[st.i], off = st.skip.has(st.i);
      TR.$('[data-card]', pane).innerHTML = `<div class="card">
        <div><div class="eyebrow">Стадия ${st.i + 1} из ${RE.length} · ${esc(s.en)}</div><h3 class="rql-h3">${s.ic} ${esc(s.t)}</h3></div>
        <div><b>${esc(s.what)}</b></div>
        <div class="rql-flow"><div class="rql-box an"><span class="rql-lbl">Аналитик делает</span>${esc(s.an)}</div><div class="rql-box"><span class="rql-lbl">С кем</span>${esc(s.who)}</div><div class="rql-box"><span class="rql-lbl">На выходе</span>${esc(s.out)}</div></div>
        <div class="rql-box"><span class="rql-lbl">Планшет списаний</span>${esc(s.ex)}</div>
        ${s.id === 'validate' ? `<div class="row"><span class="small dim">Два вопроса проверки:</span>${ui.seg('vv', [{ v: 'ver', t: 'верификация' }, { v: 'val', t: 'валидация' }], st.vv)}</div>
          ${st.vv === 'ver' ? ui.note('info', 'Верификация — «испекли по рецепту?»', 'Записано правильно: однозначно, полно, проверяемо, не противоречит другим. Проверяют Дима и Лера на ревью требований.') : ui.note('info', 'Валидация — «испекли тот торт, который хотел клиент?»', 'Записано то, что действительно нужно бизнесу. Проверяют с источником и заказчиком: Павел и Нина Сергеевна.')}` : ''}
        <label class="toggle"><input type="checkbox" data-skip ${off ? 'checked' : ''}> <span>Пропустить эту стадию</span></label>
        ${off ? ui.note('bad', 'Что сломается', esc(s.skip)) : ''}
      </div>`;
    }
    TR.on(pane, 'click', '[data-i]', (e, b) => { st.i = +b.dataset.i; draw(); });
    pane.addEventListener('change', e => { if (e.target.matches('[data-skip]')) { if (e.target.checked) st.skip.add(st.i); else st.skip.delete(st.i); draw(); } });
    ui.onSeg(pane, (n, v) => { if (n === 'vv') { st.vv = v; draw(); } });
    draw();
  }
  function drawPass(pane) {
    const off = new Set();
    function draw() {
      pane.innerHTML = `<div class="stack">
        <div class="row between"><span class="small dim">Атрибутов на месте: <b>${ATTRS.length - off.size}</b> из ${ATTRS.length}</span>${off.size ? '<button type="button" class="btn xs ghost" data-all>Вернуть всё</button>' : ''}</div>
        <div class="rql-pass">${ATTRS.map(a => `<div class="rql-pr ${off.has(a.id) ? 'off' : ''}"><span class="k">${esc(a.t)}</span><span class="v">${esc(a.v)}</span><button type="button" class="btn xs ${off.has(a.id) ? '' : 'ghost'}" data-a="${a.id}">${off.has(a.id) ? 'Вернуть' : 'Убрать'}</button>${off.has(a.id) ? `<div class="miss">⚠ ${esc(a.miss)}</div>` : `<div class="why">${esc(a.why)}</div>`}</div>`).join('')}</div>
        ${off.size >= 3 ? ui.note('warn', 'Заметили?', 'Атрибуты нужны не аналитику, а <b>другим</b>: источник — тому, кто уточняет; статус — Диме; критерий — Лере; связь с целью — Нине и Игорю, когда режут объём.') : ''}
        ${ui.note('info', 'Сколько атрибутов вести', 'Решает команда. Небольшому проекту хватит ID, формулировки, источника, приоритета, статуса и критерия проверки. В медицине и авиации атрибутов десятки: риск, обоснование, способ проверки, релиз. Вигерс и Битти советуют начинать с малого набора и добавлять то, что реально используют. Атрибуты из ISO/IEC/IEEE 29148 близки: идентификатор, владелец, приоритет, риск, обоснование, тип.')}
      </div>`;
    }
    TR.on(pane, 'click', '[data-a]', (e, b) => { const id = b.dataset.a; if (off.has(id)) off.delete(id); else off.add(id); draw(); });
    TR.on(pane, 'click', '[data-all]', () => { off.clear(); draw(); });
    draw();
  }
  function drawStore(pane) {
    const a = { n: 'few', audit: 'no', team: 'tracker' };
    pane.innerHTML = `<div class="stack">
      <div class="rql-qs">
        <div class="q"><span>Сколько требований в проекте?</span>${ui.seg('n', [{ v: 'few', t: 'десятки' }, { v: 'mid', t: 'сотни' }, { v: 'many', t: 'тысячи' }], a.n)}</div>
        <div class="q"><span>Нужен аудит: история каждого изменения и доказательство, что каждое требование проверено (медицина, авиация, банки)?</span>${ui.seg('audit', [{ v: 'no', t: 'нет' }, { v: 'yes', t: 'да' }], a.audit)}</div>
        <div class="q"><span>Где уже работает команда?</span>${ui.seg('team', [{ v: 'tracker', t: 'в трекере задач' }, { v: 'wiki', t: 'в вики' }, { v: 'none', t: 'пока нигде' }], a.team)}</div>
      </div>
      <div class="rql-stores" data-st></div>
      <div data-sn></div>
    </div>`;
    function draw() {
      const fit = Object.fromEntries(STORES.map(s => [s.id, storeFit(s.id, a)])), max = Math.max(...Object.values(fit));
      TR.$('[data-st]', pane).innerHTML = STORES.map(s => `<div class="rql-store ${fit[s.id] === max ? 'best' : ''}"><h4>${s.ic} ${esc(s.t)}</h4><span class="small dim">${esc(s.sub)}</span><div class="row"><span class="small">Подходит:</span>${dots(fit[s.id])}</div><div class="small"><b>+</b> ${esc(s.plus)}</div><div class="small muted"><b>−</b> ${esc(s.minus)}</div></div>`).join('');
      const kolos = a.n === 'few' && a.audit === 'no' && a.team === 'tracker';
      TR.$('[data-sn]', pane).innerHTML = kolos
        ? ui.note('ok', 'Это ответы «Колоса»', 'Десятки требований, без регулятора, команда Димы живёт в трекере. Так и сделали: описание и бизнес-контекст — на странице в вики, требования и истории со статусами — в трекере, со ссылками друг на друга; матрица трассировки — таблицей раз в спринт. Главное правило: <b>одно место правды</b>, а в других — ссылки, а не копии.')
        : ui.note('info', 'Честно', 'Единственно правильного места нет, и чаще всего хранилища комбинируют: текст — в вики, статусы — в трекере, сводки — в таблице. Плохо не «не та программа», а когда правда живёт в трёх местах и ещё в чате. Чтобы увидеть ответы «Колоса», выберите: десятки, нет, в трекере.');
    }
    ui.onSeg(pane, (n, v) => { a[n] = v; draw(); });
    draw();
  }

  // =====================================================================
  // Теория 2. Статусы и базовая версия
  // =====================================================================
  const ST = {
    proposed: { t: 'Предложено', d: 'Кто-то попросил. Записано с источником, но ещё не разобрано.' },
    analysis: { t: 'На анализе', d: 'Аналитик уточняет, связывает с целью, ищет противоречия, пишет формулировку и критерий.' },
    approved: { t: 'Согласовано', d: 'Заказчик и команда договорились. Требование вошло в базовую версию и в план.' },
    inwork: { t: 'В работе', d: 'Взято в спринт: у разработчиков есть задачи.' },
    done: { t: 'Реализовано', d: 'Код готов и выложен на тестовый стенд; разработчик проверил его своими тестами.' },
    verified: { t: 'Проверено', d: 'Тесты по критерию проверки пройдены — требование выполнено.' },
    rejected: { t: 'Отклонено', d: 'Решили не делать: нет пользы, противоречит цели, невыполнимо. Запись остаётся — с причиной.' },
    deferred: { t: 'Отложено', d: 'Делать, но не сейчас: в одну из следующих версий.' }
  };
  const MAIN = ['proposed', 'analysis', 'approved', 'inwork', 'done', 'verified'];
  const SIDE = ['rejected', 'deferred'];
  const EXS = [
    { id: 'w', t: 'ФТ-31 · списания на планшете', steps: [
      { s: 'proposed', who: 'Павел', e: 'На смене Павел говорит: «Списания пишем ручкой после закрытия, часть забываем». Аналитик записывает пожелание с источником.' },
      { s: 'analysis', who: 'аналитик', e: 'Аналитик уточняет у Павла и Олега Петровича, кто вносит и когда, связывает с целью БЦ-1, пишет формулировку и критерий.' },
      { s: 'approved', who: 'Нина Сергеевна', e: 'Ревью с Димой и Лерой пройдено, Нина согласовала. Версия 1.0 — в базовой версии требований.' },
      { s: 'inwork', who: 'Дима', e: 'Требование взяли в спринт: задача у разработчика.' },
      { s: 'done', who: 'разработчик', e: 'Код готов и выложен на тестовый стенд.' },
      { s: 'verified', who: 'Лера', e: 'Лера прошла тест-кейс: в 21:10 внесено «Круассан, 4 шт., не продано» — утром запись в отчёте Нины.' }
    ] },
    { id: 'r', t: 'Скидка 30 % после 19:00 · идея Риты', steps: [
      { s: 'proposed', who: 'Рита', e: 'Рита на встрече: «Давайте скидку 30 % на выпечку после 19:00 в приложении!» Записано с источником.' },
      { s: 'analysis', who: 'аналитик', e: 'Галина Ивановна: «Тогда все будут ждать 19:00, а план выпечки сломается». Связь с целью спорная: меньше списаний, но и меньше выручки.' },
      { s: 'deferred', who: 'Нина Сергеевна', e: 'Нина: «Вернёмся после пилота, когда увидим реальные списания». Не в первой версии — но и не забыто.' }
    ] },
    { id: 'p', t: 'Прогноз погоды на планшете', steps: [
      { s: 'proposed', who: 'Дима', e: 'Дима предложил: видел в другом приложении.' },
      { s: 'analysis', who: 'аналитик', e: 'Нет ни заинтересованного лица, ни цели: план по погоде правит технолог в другом месте.' },
      { s: 'rejected', who: 'Нина Сергеевна', e: 'Отклонено: «нет источника и цели». Причина записана — чтобы через месяц не предложить снова.' }
    ] }
  ];
  const BASE_EDITS = [
    { who: 'Павел', why: 'Павел: «Иногда закрываемся позже — давайте до 22:00».', from: 'с 21:00 до 21:30', to: 'с 21:00 до 22:00' },
    { who: 'Олег Петрович', why: 'Олег Петрович: «Мне нужно ещё количество в рублях».', from: 'количество в штуках', to: 'количество в штуках и сумма в рублях' }
  ];
  const howStatus = {
    id: 'how-status', covers: ['statuses'], title: 'Как это работает: статусы и базовая версия', free: true, noReset: true,
    simple: {
      icon: '🚦',
      plain: 'У каждого требования есть статус — где оно сейчас: только предложено, согласовано, делается, сделано, проверено, отложено или отклонено.',
      analogy: 'Бланк заказа торта в цехе: «принят → согласован с клиенткой → в работе → готов → выдан». А подписанный бланк — это базовая версия: до подписи клиентка меняет начинку сколько угодно, после — только звонком, с новой ценой и новой подписью.',
      tech: 'Статусы близки к предложенным Вигерсом и Битти: предложено, на анализе, согласовано, реализовано, проверено, отложено, отклонено. <b>Базовая версия</b> (baseline) — согласованный набор требований, на который опираются оценка, план, разработка и тесты. После неё изменения идут через <b>запрос на изменение</b>: анализ влияния → решение владельца продукта → новая версия.'
    },
    lead: ui.brief({
      situation: 'Соседние примеры: три требования с разной судьбой — списания на планшете, скидка Риты после 19:00 и прогноз погоды на планшете. И одно требование, которое после согласования попросили изменить.',
      todo: [
        'Вкладка «Статусы»: выберите пример и нажимайте «Следующее событие →». Смотрите, что должно случиться для каждого перехода и кто его делает.',
        'Пройдите все три примера: один доходит до «Проверено», два сворачивают в сторону. Чем «Отложено» отличается от «Отклонено»?',
        'Вкладка «Базовая версия»: поменяйте требование до согласования, потом нажмите «Согласовать» и попробуйте поменять снова. Что изменилось?'
      ],
      look: 'Зелёный — текущий статус, обведённые — пройденные. Пунктир — боковые ветки. Важно не название статуса (в командах они разные), а <b>правило перехода</b>: что именно должно случиться и кто это подтверждает.'
    }),
    render(el) {
      el.classList.add('rql-root');
      const tb = document.createElement('div'); el.appendChild(tb);
      ui.tabs(tb, [{ id: 'st', t: 'Статусы', render: drawStatuses }, { id: 'base', t: 'Базовая версия', render: drawBaseline }], 'st');
    }
  };
  function statusMap(cur, passed) {
    const sc = id => `<span class="rql-sch ${SIDE.includes(id) ? 'side' : ''} ${id === cur ? 'cur' : passed.includes(id) ? 'past' : ''}">${esc(ST[id].t)}</span>`;
    return `<div class="stack tight"><div class="rql-line">${MAIN.map((id, i) => sc(id) + (i < MAIN.length - 1 ? '<span class="rql-arr">→</span>' : '')).join('')}</div>
      <div class="rql-line"><span class="small dim">в сторону:</span>${sc('deferred')}${sc('rejected')}</div></div>`;
  }
  function drawStatuses(pane) {
    let ex = 0, k = 0;
    pane.innerHTML = `<div class="stack"><div class="row"><span class="small dim">Пример:</span>${ui.seg('ex', EXS.map((x, i) => ({ v: i, t: x.t })), ex)}</div><div data-b></div></div>`;
    function draw() {
      const E = EXS[ex], step = E.steps[k], passed = E.steps.slice(0, k).map(s => s.s);
      TR.$('[data-b]', pane).innerHTML = `<div class="stack">
        ${statusMap(step.s, passed)}
        <div class="card flat"><div class="eyebrow">Статус сейчас</div><h3 class="rql-h3">${esc(ST[step.s].t)}</h3><div class="small muted">${esc(ST[step.s].d)}</div></div>
        <div class="rql-log">${E.steps.slice(0, k + 1).map(s => `<div><b>${esc(ST[s.s].t)}</b><span>${esc(s.e)} <span class="dim">· ${esc(s.who)}</span></span></div>`).join('')}</div>
        <div class="row between"><button type="button" class="btn sm ghost" data-reset ${k === 0 ? 'disabled' : ''}>⟲ Сначала</button><button type="button" class="btn sm primary" data-next ${k >= E.steps.length - 1 ? 'disabled' : ''}>Следующее событие →</button></div>
        ${k >= E.steps.length - 1 ? ui.note(step.s === 'verified' ? 'ok' : step.s === 'deferred' ? 'warn' : 'info', 'Чем закончилось', step.s === 'verified' ? 'Полный путь. Заметьте: «Реализовано» и «Проверено» — разные статусы. «У меня работает» разработчика — ещё не проверка.' : step.s === 'deferred' ? '«Отложено» — нужно, но не сейчас. Требование остаётся в реестре и вернётся, когда Нина решит.' : '«Отклонено» — не будем делать. Запись не удаляют, а оставляют с причиной: иначе идея вернётся через месяц.') : ''}
      </div>`;
    }
    TR.on(pane, 'click', '[data-next]', () => { k = Math.min(k + 1, EXS[ex].steps.length - 1); draw(); });
    TR.on(pane, 'click', '[data-reset]', () => { k = 0; draw(); });
    ui.onSeg(pane, (n, v) => { if (n === 'ex') { ex = +v; k = 0; draw(); } });
    draw();
  }
  function drawBaseline(pane) {
    const st = { base: false, ver: [0, 1], edits: 0, cr: false, crStep: 0, decided: null, log: ['0.1 — первая запись после смены на Покровке'] };
    const textOf = n => { let t = 'Кассир после закрытия пекарни, <mark>с 21:00 до 21:30</mark>, вносит списание: товар из списка, <mark>количество в штуках</mark>, причина из списка.'; for (let i = 0; i < n; i++) t = t.replace(BASE_EDITS[i].from, BASE_EDITS[i].to); return t; };
    function draw() {
      const verS = st.ver.join('.');
      const nextEdit = BASE_EDITS[st.edits];
      pane.innerHTML = `<div class="stack">
        <div class="rql-req ${st.base ? 'base' : ''}">
          <div class="row between"><b class="mono">ФТ-31</b><span class="row">${chip('версия ' + verS, st.base ? 'info' : '')}${st.base ? chip('🔒 в базовой версии', 'info') : chip('черновик', 'warn')}</span></div>
          <div class="t">${textOf(st.edits)}</div>
        </div>
        ${!st.base ? `<div class="row">${nextEdit ? `<button type="button" class="btn sm" data-edit>${esc(nextEdit.who)} просит поправить</button>` : ''}<button type="button" class="btn sm primary" data-base>Согласовать с Ниной → базовая версия 1.0</button></div>
          ${ui.note('info', 'До согласования', 'Правки — обычная работа анализа: поговорили, поправили, версия 0.2, 0.3. Никаких процедур — требование ещё никто не взял в работу.')}`
          : st.decided ? '' : !st.cr ? `<div class="row"><button type="button" class="btn sm" data-cr>Павел: «А давайте вносить до 22:30»</button></div>
          ${ui.note('info', 'После согласования', 'На версию 1.0 уже опираются оценка Игоря, задача Димы и тест Леры. Тихая правка текста сломает их всех.')}` : ''}
        ${st.cr && !st.decided ? `<div class="rql-cr">
          <div class="eyebrow">Запрос на изменение · ФТ-31</div>
          <div class="small"><b>1. Кто и зачем.</b> Павел: «Летом закрываемся позже — давайте вносить до 22:30».</div>
          ${st.crStep >= 1 ? `<div class="small"><b>2. Анализ влияния — по связям требования:</b></div><ul><li>напоминание кассиру в 21:30 (ФТ-33) — сдвинуть;</li><li>отчёт для Нины утром — не меняется;</li><li>тест ТК-40 — дописать проверку 22:20 и 22:40;</li><li>памятка кассиров — обновить;</li><li>оценка Димы: полдня работы.</li></ul>` : `<button type="button" class="btn sm" data-step>Провести анализ влияния</button>`}
          ${st.crStep >= 1 ? `<div class="small"><b>3. Решение владельца продукта — Нины Сергеевны:</b></div><div class="row"><button type="button" class="btn sm primary" data-dec="ok">Принять</button><button type="button" class="btn sm" data-dec="later">Отложить</button><button type="button" class="btn sm ghost" data-dec="no">Отклонить</button></div>` : ''}
        </div>` : ''}
        ${st.decided ? ui.note(st.decided === 'ok' ? 'ok' : 'info', 'Решение записано', st.decided === 'ok' ? 'Версия 1.1: окно до 22:30. Обновлены напоминание, тест и памятка — все знают, какая редакция действует.' : st.decided === 'later' ? 'Версия 1.0 остаётся. Запрос лежит в списке отложенных — вернутся к нему после пилота.' : 'Версия 1.0 остаётся. Причина отказа записана в запросе: Павлу есть что ответить.') + `<div class="row"><button type="button" class="btn xs ghost" data-again>⟲ Начать сначала</button></div>` : ''}
        <div class="stack tight"><div class="eyebrow">Журнал версий</div><div class="rql-log">${st.log.map(l => `<div><b>${esc(l.split(' — ')[0])}</b><span>${esc(l.split(' — ').slice(1).join(' — '))}</span></div>`).join('')}</div></div>
        ${st.decided ? ui.note('warn', 'Это не бюрократия', 'До базовой версии правка — минута разговора. После — запрос, анализ влияния и решение заказчика. Зато никто не делает и не проверяет «вчерашнюю» редакцию. Как вести запросы на изменение, оценивать их цену и договариваться — подробно в неделе 5.') : ''}
      </div>`;
    }
    TR.on(pane, 'click', '[data-edit]', () => { const e = BASE_EDITS[st.edits]; st.edits++; st.ver = [0, st.ver[1] + 1]; st.log.push(`0.${st.ver[1]} — ${e.why} Поправили сразу.`); draw(); });
    TR.on(pane, 'click', '[data-base]', () => { st.base = true; st.ver = [1, 0]; st.log.push('1.0 — ревью с Димой и Лерой, Нина Сергеевна согласовала. Базовая версия.'); draw(); });
    TR.on(pane, 'click', '[data-cr]', () => { st.cr = true; draw(); });
    TR.on(pane, 'click', '[data-step]', () => { st.crStep = 1; draw(); });
    TR.on(pane, 'click', '[data-dec]', (e, b) => {
      st.decided = b.dataset.dec;
      if (st.decided === 'ok') { st.ver = [1, 1]; st.log.push('1.1 — запрос на изменение Павла принят Ниной: окно до 22:30.'); }
      else st.log.push(`1.0 — запрос Павла ${st.decided === 'later' ? 'отложен' : 'отклонён'}, причина записана.`);
      draw();
    });
    TR.on(pane, 'click', '[data-again]', () => { Object.assign(st, { base: false, ver: [0, 1], edits: 0, cr: false, crStep: 0, decided: null, log: ['0.1 — первая запись после смены на Покровке'] }); draw(); });
    draw();
  }

  // =====================================================================
  // Теория 3. Трассировка: лаборатория цели БЦ-3
  // =====================================================================
  const TN = [
    { id: 'БЦ-3', c: 'g', t: 'Ни одного потерянного заказа торта к 8 Марта 2027' },
    { id: 'ФТ-20', c: 'r', t: 'Заказ торта — одна запись: дата и время выдачи, пекарня, начинка, вес, надпись, фото-образец' },
    { id: 'ФТ-21', c: 'r', t: 'Торт принимается, только если до выдачи не меньше 48 часов' },
    { id: 'ФТ-22', c: 'r', t: 'На одну дату — не больше 25 тортов, в праздники — 60' },
    { id: 'ФТ-23', c: 'r', t: 'Кондитер видит заказ с фото и надписью на планшете цеха' },
    { id: 'ИСТ-07', c: 's', t: 'Как покупатель, я хочу заказать торт с фото-образцом и надписью, чтобы получить именно то, что задумал' },
    { id: 'ИСТ-08', c: 's', t: 'Как технолог, я хочу, чтобы система не принимала торты сверх мощности цеха, чтобы не срывать заказы' },
    { id: 'ИСТ-09', c: 's', t: 'Как кондитер, я хочу видеть заказ с фото на планшете, чтобы не искать его в мессенджере' },
    { id: 'КОЛ-41', c: 'k', t: 'Форма заказа торта в приложении' },
    { id: 'КОЛ-42', c: 'k', t: 'Проверка 48 часов и мощности цеха на сервере' },
    { id: 'КОЛ-43', c: 'k', t: 'Экран цеха: карточка торта с фото' },
    { id: 'КОЛ-45', c: 'k', t: 'Анимация конфетти после заказа торта' },
    { id: 'ТК-30', c: 't', t: 'Все поля заказа торта сохраняются и видны кассиру и цеху' },
    { id: 'ТК-31', c: 't', t: 'Заказ за 49 часов до выдачи принят, за 47 — отказ с объяснением' },
    { id: 'ТК-32', c: 't', t: '26-й торт на обычный день не принимается' },
    { id: 'ТК-33', c: 't', t: 'Фото и надпись из заказа видны на планшете цеха' }
  ];
  const TE = [
    ['БЦ-3', 'ФТ-20'], ['БЦ-3', 'ФТ-21'], ['БЦ-3', 'ФТ-22'], ['БЦ-3', 'ФТ-23'],
    ['ФТ-20', 'ИСТ-07'], ['ФТ-21', 'ИСТ-07'], ['ФТ-22', 'ИСТ-08'], ['ФТ-23', 'ИСТ-09'],
    ['ИСТ-07', 'КОЛ-41'], ['ИСТ-07', 'КОЛ-42'], ['ИСТ-08', 'КОЛ-42'], ['ИСТ-09', 'КОЛ-43'],
    ['ФТ-20', 'ТК-30'], ['ФТ-21', 'ТК-31'], ['ФТ-22', 'ТК-32'], ['ФТ-23', 'ТК-33']
  ];
  const COLS = [{ c: 'g', t: 'Бизнес-цель' }, { c: 'r', t: 'Требования' }, { c: 's', t: 'Истории' }, { c: 'k', t: 'Задачи' }, { c: 't', t: 'Тесты' }];
  const nodeC = id => (TN.find(n => n.id === id) || {}).c;
  function traceHealth(edges) {
    const inc = (id, c) => edges.some(([a, b]) => b === id && nodeC(a) === c), out = (id, c) => edges.some(([a, b]) => a === id && nodeC(b) === c);
    const R = TN.filter(n => n.c === 'r'), P = [];
    R.forEach(r => {
      if (!inc(r.id, 'g')) P.push({ id: r.id, k: 'orphan', t: `${r.id} — висящее требование: не ведёт ни к одной цели. Зачем его делать?` });
      if (!out(r.id, 't')) P.push({ id: r.id, k: 'untested', t: `${r.id} — непроверенное: ни один тест не подтвердит, что оно выполнено.` });
      if (!out(r.id, 's')) P.push({ id: r.id, k: 'unbuilt', t: `${r.id} — никто не делает: нет ни истории, ни задачи.` });
    });
    TN.filter(n => n.c === 's').forEach(s => { if (!inc(s.id, 'r')) P.push({ id: s.id, k: 'orphan', t: `${s.id} — история без требования: откуда она взялась?` }); });
    TN.filter(n => n.c === 'k').forEach(k => { if (!inc(k.id, 's')) P.push({ id: k.id, k: 'gold', t: `${k.id} — работа без требования: делаем то, чего никто не просил.` }); });
    TN.filter(n => n.c === 't').forEach(t => { if (!inc(t.id, 'r')) P.push({ id: t.id, k: 'orphan', t: `${t.id} — тест непонятно чего: не связан ни с одним требованием.` }); });
    const gR = R.filter(r => edges.some(([a, b]) => a === 'БЦ-3' && b === r.id)), gT = gR.filter(r => out(r.id, 't'));
    const goal = !gR.length ? 'bad' : gT.length === gR.length ? 'ok' : gT.length ? 'warn' : 'bad';
    return { P, goal, gR: gR.length, gT: gT.length };
  }
  const howTrace = {
    id: 'how-trace', covers: ['matrix', 'why-trace'], title: 'Как это работает: трассировка вперёд и назад', free: true, noReset: true,
    simple: {
      icon: '🔗',
      plain: 'Трассировка — это ниточки между целью, требованием, задачей и тестом. По ним видно, откуда требование и что из него выросло.',
      analogy: 'Ярлык на противне: из какой партии муки, по какому рецепту, для какого заказа. Нашли брак — за минуту понятно, что ещё испечено из той же муки и кому это уже продали.',
      tech: '<b>Трассировка назад</b> — откуда требование: цель, источник. <b>Вперёд</b> — во что превратилось: истории, задачи, код, тесты. Связи хранят в <b>матрице трассировки</b> (requirements traceability matrix) или ссылками в трекере. В BABOK v3 это задача «Трассировка требований», у Вигерса и Битти — глава о связях в цепочке требований.'
    },
    lead: ui.brief({
      situation: 'Цель Нины Сергеевны БЦ-3 — «ни одного потерянного заказа торта к 8 Марта 2027». Ниже фрагмент её цепочки: цель → требования → истории → задачи разработчиков → тесты Леры.',
      todo: [
        'Нажмите на БЦ-3 — подсветится всё, что из неё выросло. Потом нажмите на тест или задачу — подсветится, откуда они пришли.',
        'Под схемой — связи выбранного элемента. Разорвите одну (✕) и посмотрите на «Здоровье трассировки»: какие требования повисли, какие стали непроверенными, что стало с целью?',
        'Найдите задачу, у которой уже сейчас нет требования. Чем это плохо?'
      ],
      look: 'Голубым — назад (откуда пришло), фиолетовым — вперёд (во что превратилось). Красная полоска слева — у элемента проблема. Связи здесь в одну сторону, но читать их можно в обе.'
    }),
    render(el) {
      el.classList.add('rql-root');
      const st = { sel: 'БЦ-3', cut: new Set() };
      el.innerHTML = `<div class="stack">
        <div class="rql-legend"><span><i style="background:var(--accent-soft);border-color:var(--accent)"></i>выбрано</span><span><i style="background:var(--info-soft);border-color:var(--info)"></i>назад: откуда</span><span><i style="background:var(--violet-soft);border-color:var(--violet)"></i>вперёд: во что</span><span><i style="background:var(--surface);border-color:var(--bad);box-shadow:inset 3px 0 0 var(--bad)"></i>есть проблема</span></div>
        <div class="rql-tl" data-tl></div>
        <div data-sel></div>
        <div data-health></div>
      </div>`;
      const edges = () => TE.filter(e => !st.cut.has(e.join('>')));
      function closure(id, dir, E) {
        const seen = new Set(), q = [id];
        while (q.length) { const x = q.shift(); E.forEach(([a, b]) => { const y = dir > 0 ? (a === x ? b : null) : (b === x ? a : null); if (y && !seen.has(y)) { seen.add(y); q.push(y); } }); }
        return seen;
      }
      function draw() {
        const E = edges(), fw = closure(st.sel, 1, E), bw = closure(st.sel, -1, E), H = traceHealth(E), probIds = new Set(H.P.map(p => p.id));
        if (H.goal !== 'ok') probIds.add('БЦ-3');
        TR.$('[data-tl]', el).innerHTML = COLS.map(col => `<div class="rql-col"><div class="h">${esc(col.t)}</div>${TN.filter(n => n.c === col.c).map(n => {
          const cls = n.id === st.sel ? 'sel' : bw.has(n.id) ? 'bw' : fw.has(n.id) ? 'fw' : 'dim';
          return `<button type="button" class="rql-node ${cls} ${probIds.has(n.id) ? 'prob' : ''}" data-n="${esc(n.id)}"><b>${esc(n.id)}</b><span>${esc(n.t)}</span></button>`;
        }).join('')}</div>`).join('');
        const mine = TE.filter(e => e[0] === st.sel || e[1] === st.sel);
        const node = TN.find(n => n.id === st.sel);
        TR.$('[data-sel]', el).innerHTML = `<div class="card flat"><div class="eyebrow">Выбрано: ${esc(node.id)}</div><div class="small">${esc(node.t)}</div>
          <div class="small"><b>Назад (откуда):</b> ${bw.size ? [...bw].map(esc).join(', ') : '<span class="dim">ничего — это начало цепочки или связь разорвана</span>'}</div>
          <div class="small"><b>Вперёд (во что):</b> ${fw.size ? [...fw].map(esc).join(', ') : '<span class="dim">ничего — это конец цепочки или связь разорвана</span>'}</div>
          <div class="rql-edges">${mine.length ? mine.map(e => { const k = e.join('>'), off = st.cut.has(k); return `<span class="chip ${off ? 'bad' : 'info'}">${esc(e[0])} → ${esc(e[1])} <button type="button" class="x" data-cut="${esc(k)}" aria-label="${off ? 'Вернуть связь' : 'Разорвать связь'}">${off ? '↺' : '✕'}</button></span>`; }).join('') : '<span class="small dim">У этого элемента нет связей.</span>'}${st.cut.size ? '<button type="button" class="btn xs ghost" data-restore>Вернуть все связи</button>' : ''}</div></div>`;
        const gTxt = H.goal === 'ok' ? `Цель БЦ-3 проверяема: все ${H.gR} требования к ней проверяются тестами.` : !H.gR ? 'Цель БЦ-3 не покрыта ни одним требованием: к ней ничего не ведёт.' : H.gT ? `Цель БЦ-3 проверена частично: тесты есть у ${H.gT} из ${H.gR} требований.` : 'Цель БЦ-3 не проверена: ни у одного её требования нет теста.';
        TR.$('[data-health]', el).innerHTML = `<div class="stack tight"><div class="eyebrow">Здоровье трассировки</div>
          ${ui.note(H.goal === 'ok' ? 'ok' : H.goal === 'warn' ? 'warn' : 'bad', 'Цель', esc(gTxt))}
          ${H.P.length ? `<ul class="checks">${H.P.map(p => `<li class="${p.k === 'gold' ? 'warn' : 'bad'}">${esc(p.t)}</li>`).join('')}</ul>` : '<div class="small">Проблем нет.</div>'}
          ${H.P.length === 1 && H.P[0].id === 'КОЛ-45' ? ui.note('info', 'Работа без требования', 'КОЛ-45 — конфетти: никто не просил, ни к одной истории не привязано. Трассировка назад ловит «позолоту» — лишнюю работу, которая ест время спринта. Разорвите любую связь — и увидите, как ломается цепочка.') : ''}</div>`;
      }
      TR.on(el, 'click', '[data-n]', (e, b) => { st.sel = b.dataset.n; draw(); });
      TR.on(el, 'click', '[data-cut]', (e, b) => { const k = b.dataset.cut; if (st.cut.has(k)) st.cut.delete(k); else st.cut.add(k); draw(); });
      TR.on(el, 'click', '[data-restore]', () => { st.cut.clear(); draw(); });
      draw();
    }
  };

  // =====================================================================
  // Практика 1. Карточка требования
  // =====================================================================
  const FIELDS = [
    { id: 'id', t: 'ID', opts: [{ v: 'a', t: 'ФТ-14' }, { v: 'b', t: '«Выгрузка в 1С»' }, { v: 'c', t: '6 — как в письме Нины' }], ok: ['a'],
      hint: 'ID должен быть уникальным и не меняться. Что из этого переживёт переименование требования или новое письмо Нины?', why: 'Уникальный постоянный номер по схеме реестра: на него сошлются задачи и тесты.' },
    { id: 'text', t: 'Формулировка', wide: true, radio: true, opts: [{ v: 'a', t: 'Выгрузка в 1С.' }, { v: 'b', t: 'Каждый день до 09:00 система передаёт в 1С одну сводку продаж всех 9 пекарен за прошедший день: выручка по каждой пекарне и каждому способу оплаты.' }, { v: 'c', t: 'Система должна быстро и удобно выгружать продажи в 1С, Excel и т. д.' }], ok: ['b'],
      hint: 'Вспомните вчерашнее: однозначно? полно? проверяемо? нет ли слов-ловушек?', why: 'Однозначно (до 09:00, одна сводка, все 9 пекарен), полно (что в сводке) и проверяемо.' },
    { id: 'src', t: 'Источник', opts: [{ v: 'a', t: 'Олег Петрович (интервью) и п. 6 письма Нины' }, { v: 'b', t: 'Дима, тимлид' }, { v: 'c', t: 'Вы — аналитик' }, { v: 'd', t: 'Так делают все пекарни' }], ok: ['a'],
      hint: 'Источник — тот, кто попросил и с кем уточнять. Кто живёт с этой проблемой каждое утро?', why: 'Олег Петрович, а в письме Нины — п. 6. К ним идут с вопросами по сути.' },
    { id: 'author', t: 'Автор', opts: [{ v: 'a', t: 'Вы — младший системный аналитик' }, { v: 'b', t: 'Олег Петрович' }, { v: 'c', t: 'Нина Сергеевна' }, { v: 'd', t: 'Дима, тимлид' }], ok: ['a'],
      hint: 'Автор и источник — не одно и то же. Кто записал эту формулировку?', why: 'Записали вы — к вам вопросы о формулировке.' },
    { id: 'prio', t: 'Приоритет', opts: [{ v: 'a', t: 'Must — обязательно в первой версии' }, { v: 'b', t: 'Should — нужно, но можно позже' }, { v: 'c', t: 'Could — если останется время' }, { v: 'd', t: 'Won’t — не в этот раз' }], ok: ['a'],
      hint: 'Перечитайте ситуацию: что Игорь и Нина говорили об объёме первой версии?', why: 'Сводная выгрузка в 1С — в обязательном объёме первой версии. Подробно про MoSCoW — в неделе 4.' },
    { id: 'status', t: 'Статус', opts: Object.keys(ST).filter(k => MAIN.includes(k)).map(k => ({ v: k, t: ST[k].t })), ok: ['analysis'], alt: ['proposed'],
      hint: 'Нина карточку ещё не видела, а вы прямо сейчас уточняете формат. Что из этого может быть правдой?', why: '«На анализе»: вы уточняете формат у Олега Петровича. «Предложено» тоже допустимо; главное — не «Согласовано».' },
    { id: 'ver', t: 'Версия', opts: [{ v: 'a', t: '0.1 — черновик' }, { v: 'b', t: '1.0 — согласованная' }, { v: 'c', t: '2.0' }], ok: ['a'],
      hint: 'Что обычно означает «1.0»? Было ли уже согласование?', why: 'Пока не согласовано — черновик. 1.0 обычно ставят, когда требование вошло в базовую версию.' },
    { id: 'goal', t: 'Связь с целью', opts: GOALS, ok: ['g4'],
      hint: 'Какая цель Нины — про утро Олега Петровича?', why: 'БЦ-4: ручная сверка с 2 часов до 15 минут в день.' },
    { id: 'crit', t: 'Критерий проверки', wide: true, radio: true, opts: [{ v: 'a', t: 'Олег Петрович доволен выгрузкой.' }, { v: 'b', t: 'Продажи 9 пекарен за 14 февраля лежат в 1С 15 февраля до 09:00 одной сводкой; суммы по каждой пекарне совпадают с отчётом «КассаПро».' }, { v: 'c', t: 'Выгрузка работает без ошибок.' }], ok: ['b'],
      hint: 'Как Лера получит ответ «да» или «нет»? Что она сравнит и с чем?', why: 'Есть дата, время, что проверяем и с чем сверяем — ответ «да» или «нет».' }
  ];
  const fGood = (f, v) => f.ok.includes(v) || (f.alt || []).includes(v);
  const optT = (f, v) => (f.opts.find(o => o.v === v) || { t: '—' }).t;
  const cardTask = {
    id: 'card', title: 'Заведите карточку требования',
    simple: howProcess.simple,
    lead: ui.brief({
      situation: 'Олег Петрович на интервью рассказал, как каждое утро сводит продажи, — его слова ниже. В письме Нины это пункт 6: «Выгрузка в 1С». В черновом объёме первой версии, который Игорь обсуждал с Ниной, сводная выгрузка в 1С — среди обязательных. Вы заводите карточку в реестре требований — там уже есть ФТ-01…ФТ-13 — и прямо сейчас уточняете у Олега Петровича формат сводки. Нина карточку ещё не видела.',
      todo: [
        'Заполните все девять атрибутов карточки: выберите вариант в каждом поле.',
        'Внизу — как карточка будет выглядеть строкой в реестре. Перечитайте её глазами Димы и Леры.',
        'Нажмите «Проверить». Засчитывается от 8 верных полей из 9.'
      ],
      look: 'Ловушки: автор и источник — разные люди; статус и версия должны говорить правду о том, что уже случилось; формулировка и критерий — по правилам вчерашней тренировки.'
    }),
    blank: () => ({ f: {} }),
    reference: () => ({ f: Object.fromEntries(FIELDS.map(f => [f.id, f.ok[0]])) }),
    render(el, ctx) {
      el.classList.add('rql-root');
      const a = ctx.ans; a.f = a.f || {};
      const mark = f => { if (ctx.readonly) return 'ok'; if (!ctx.result) return ''; const v = a.f[f.id]; return !v ? 'bad' : fGood(f, v) ? 'ok' : 'bad'; };
      const note = f => { if (ctx.readonly) return `<div class="rql-hint">${esc(f.why)}</div>`; if (!ctx.result) return ''; const v = a.f[f.id]; if (v && fGood(f, v)) return ''; return `<div class="rql-hint bad">${v ? '' : 'Не выбрано. '}${esc(f.hint)}</div>`; };
      el.innerHTML = `<div class="stack">
        ${ui.say('oleg', 'Каждое утро я 2 часа свожу продажи 9 пекарен руками в Excel. Мне нужно, чтобы к 9 утра в 1С уже лежала одна сводка за вчера.')}
        <div class="rql-paper"><div class="eyebrow">Реестр требований «Колоса» · новая карточка</div>
          <div class="rql-form">${FIELDS.map(f => f.radio
            ? `<div class="field wide" data-fld="${f.id}"><span>${esc(f.t)}</span><div class="rql-radio">${f.opts.map(o => { const on = a.f[f.id] === o.v, m = on ? mark(f) : ''; return `<button type="button" class="rql-ro ${m}" data-r="${f.id}" data-v="${o.v}" aria-pressed="${on}" ${ctx.readonly ? 'disabled' : ''}><span class="mk"></span><span>${esc(o.t)}</span></button>`; }).join('')}</div>${note(f)}</div>`
            : `<label class="field ${f.wide ? 'wide' : ''}" data-fld="${f.id}"><span>${esc(f.t)}</span><select data-s="${f.id}" class="${mark(f)}" ${ctx.readonly ? 'disabled' : ''}><option value="">Выберите…</option>${f.opts.map(o => `<option value="${o.v}" ${a.f[f.id] === o.v ? 'selected' : ''}>${esc(o.t)}</option>`).join('')}</select>${note(f)}</label>`).join('')}</div>
        </div>
        <div class="stack tight"><div class="eyebrow">Так карточка выглядит строкой реестра</div><div data-row></div></div>
      </div>`;
      const drawRow = () => {
        const g = id => { const f = FIELDS.find(x => x.id === id), v = a.f[id]; return v ? esc(optT(f, v)) : '<span class="dim">—</span>'; };
        TR.$('[data-row]', el).innerHTML = ui.table(['ID', 'Требование', 'Источник', 'Автор', 'Приоритет', 'Статус', 'Версия', 'Цель', 'Критерий'], [[g('id'), g('text'), g('src'), g('author'), g('prio'), g('status'), g('ver'), g('goal'), g('crit')]]);
      };
      drawRow();
      if (ctx.readonly) return;
      el.addEventListener('change', e => {
        const s = e.target.closest('[data-s]'); if (!s) return;
        if (s.value) a.f[s.dataset.s] = s.value; else delete a.f[s.dataset.s];
        s.classList.remove('ok', 'bad'); const h = TR.$('.rql-hint', s.closest('[data-fld]')); if (h) h.remove();
        ctx.save(); drawRow();
      });
      TR.on(el, 'click', '[data-r]', (e, b) => {
        a.f[b.dataset.r] = b.dataset.v; ctx.save();
        const box = b.closest('[data-fld]');
        TR.$$('[data-r]', box).forEach(x => { x.setAttribute('aria-pressed', String(x === b)); x.classList.remove('ok', 'bad'); });
        const h = TR.$('.rql-hint', box); if (h) h.remove();
        drawRow();
      });
    },
    check(ans) {
      const f = (ans && ans.f) || {};
      const ev = FIELDS.map(x => ({ x, v: f[x.id], ok: !!f[x.id] && fGood(x, f[x.id]) }));
      const good = ev.filter(e => e.ok).length;
      const notes = ev.filter(e => !e.ok).map(e => ({ ok: false, html: `<b>${esc(e.x.t)}</b>: ${e.v ? '' : 'не выбрано. '}${esc(e.x.hint)}` }));
      if (ev.find(e => e.x.id === 'status' && e.v === 'proposed')) notes.push({ ok: 'info', html: '<b>Статус</b>: «Предложено» засчитано. Точнее — «На анализе»: вы уже разбираете требование с Олегом Петровичем.' });
      if (good === FIELDS.length) notes.push({ ok: true, html: 'Все девять атрибутов на месте.' });
      const authorSrc = f.author === 'b' && f.src === 'a';
      return {
        ok: good >= 8, score: good / FIELDS.length, notes,
        summary: `Верно: ${good} из ${FIELDS.length}.`,
        mentor: good >= 8 ? null : authorSrc ? 'Источник вы нашли верно. А автор — это кто держал ручку? Олег Петрович рассказал, но формулировку написали не он.' : 'Для каждого поля спросите себя: кому этот атрибут понадобится и что он должен из него узнать — правду о том, что уже случилось, а не о том, что будет.'
      };
    },
    explain: `<p>Карточка — паспорт требования. Каждый атрибут нужен кому-то конкретному:</p>
      <ul class="checks">
        <li><b>ID</b> «ФТ-14» — постоянный: название и номер пункта в письме поменяются, а ссылки из задач и тестов должны остаться.</li>
        <li><b>Источник ≠ автор.</b> Источник — Олег Петрович (и п. 6 письма Нины): к нему вопросы по сути. Автор — вы: к вам вопросы о формулировке.</li>
        <li><b>Статус и версия говорят правду</b>: Нина ещё не видела — значит, не «Согласовано» и не 1.0. «На анализе», версия 0.1.</li>
        <li><b>Связь с целью</b> — БЦ-4: сверка с 2 часов до 15 минут. Без неё требование нельзя защитить при сокращении объёма.</li>
        <li><b>Формулировка и критерий</b> — по правилам вчерашней тренировки: «Выгрузка в 1С» неполна, «быстро и удобно… и т. д.» — сплошные ловушки, «Олег доволен» не проверить.</li>
      </ul>
      <p>Сколько атрибутов вести — решает команда; этот набор близок к тому, что предлагают Вигерс и Битти (ID, источник, автор, приоритет, статус, версия, обоснование, критерий проверки) и ISO/IEC/IEEE 29148:2018.</p>`,
    report: ans => FIELDS.map(x => { const v = ((ans && ans.f) || {})[x.id]; return `- ${x.t}: ${v ? optT(x, v) : '—'}${v && fGood(x, v) ? ' ✓' : ' ✗'}`; }).join('\n')
  };

  // =====================================================================
  // Практика 2. Провести «торт за 48 часов» по статусам
  // =====================================================================
  const EV = [
    { v: 'e1', t: 'Вы взяли требование в разбор: уточняете у Галины Ивановны мощность цеха и праздничные дни, у Нины — почему именно 48 часов' },
    { v: 'e2', t: 'Ревью с Димой и Лерой пройдено, Нина Сергеевна согласовала на встрече; требование вошло в базовую версию 1.0' },
    { v: 'e3', t: 'Требование взяли в спринт: Дима завёл задачу КОЛ-42, разработчик начал работу' },
    { v: 'e4', t: 'Код готов: разработчик проверил его своими тестами и выложил сборку на тестовый стенд' },
    { v: 'e5', t: 'Лера прошла тест-кейсы: заказ за 49 часов до выдачи принят, за 47 — отказ с понятным сообщением; дефектов нет' },
    { v: 'e6', t: 'Нина Сергеевна сказала по телефону: «В целом нормально»' },
    { v: 'e7', t: 'Дима сказал: «Сделать несложно, часа на четыре»' },
    { v: 'e8', t: 'Разработчик написал в чат: «Готово, у меня работает»' }
  ];
  const EV_ORDER = ['e6', 'e3', 'e1', 'e8', 'e5', 'e7', 'e2', 'e4'];
  const EV_WRONG = {
    e6: 'Устное «в целом нормально» — не согласование: нет записи, нет базовой версии, Дима и Лера не смотрели.',
    e7: 'Оценка Димы — часть анализа, но не согласование и не начало работы.',
    e8: '«У меня работает» — ещё не реализация и тем более не проверка: сборки на стенде нет, Лера не проверяла.'
  };
  const TRANS = [
    { id: 't1', a: 'proposed', b: 'analysis', ok: 'e1', hint: 'Что должно начаться, чтобы требование перестало просто лежать в списке?' },
    { id: 't2', a: 'analysis', b: 'approved', ok: 'e2', hint: 'Кто должен сказать «да» и где это записано?' },
    { id: 't3', a: 'approved', b: 'inwork', ok: 'e3', hint: 'Когда требование попадает к разработчикам?' },
    { id: 't4', a: 'inwork', b: 'done', ok: 'e4', hint: 'Что значит «реализовано» — и где это можно потрогать?' },
    { id: 't5', a: 'done', b: 'verified', ok: 'e5', hint: 'Кто и как подтверждает, что требование выполнено?' }
  ];
  const CHQ = {
    q: 'Требование согласовано (версия 1.0) и уже в работе. Нина Сергеевна пишет: «Давайте торт за 24 часа — клиенты просят». Что происходит с требованием?', seed: 'rql-chq',
    options: [
      { t: 'Это запрос на изменение: оцениваем влияние — мощность цеха, смены Галины Ивановны, задача КОЛ-42, тесты Леры; решение за Ниной; если примет — версия 1.1, связанные задачи и тесты обновляют', ok: 1, why: 'Да: базовая версия не запрещает изменения, а делает их управляемыми.' },
      { t: 'Аналитик сразу меняет 48 на 24 в тексте — заказчик же просит', why: 'Задача в работе, тесты написаны под 48 часов. Тихая правка — и Дима делает одно, Лера проверяет другое, а цех не успевает.' },
      { t: 'Отказать: требование согласовано, менять его нельзя', why: 'Менять можно. Базовая версия — не запрет, а точка отсчёта для изменений.' },
      { t: 'Завести рядом новое требование «24 часа», а старое оставить', why: 'Тогда в наборе два противоречащих требования — вчерашний урок про непротиворечивость.' }
    ]
  };
  const CHQ_OK = CHQ.options.findIndex(o => o.ok);
  const BR = [
    { id: 'b1', t: 'Баллы лояльности: 5 % начисляем, баллами можно оплатить до 30 % чека', sub: 'Нина: «Хочу, но не к 1 марта — во втором квартале 2027»', ok: 'deferred', hint: 'Нина хочет это — но когда?' },
    { id: 'b2', t: 'Срочный торт за 3 часа (идея Риты)', sub: 'Галина Ивановна: «Цех не успеет — минимум 48 часов». Нина отказалась от идеи', ok: 'rejected', hint: 'Будут ли это делать вообще?' },
    { id: 'b3', t: 'Предоплата 50 % за торт', sub: 'Ревью пройдено, Нина подтвердила на встрече, вошло в базовую версию', ok: 'approved', hint: 'Что уже случилось с требованием — и что ещё нет?' }
  ];
  const BR_CH = ['proposed', 'analysis', 'approved', 'deferred', 'rejected'].map(k => ({ v: k, t: ST[k].t }));
  function stEval(ans) {
    const tr = (ans && ans.tr) || {}, br = (ans && ans.br) || {};
    const t = TRANS.map(x => ({ x, v: tr[x.id], ok: tr[x.id] === x.ok }));
    const b = BR.map(x => ({ x, v: br[x.id], ok: br[x.id] === x.ok }));
    const ch = ((ans && ans.ch) || [])[0], chOk = ch === CHQ_OK;
    const tg = t.filter(z => z.ok).length, bg = b.filter(z => z.ok).length;
    return { t, b, ch, chOk, tg, bg, score: tg / TRANS.length * 0.6 + (chOk ? 0.2 : 0) + bg / BR.length * 0.2 };
  }
  const statusesTask = {
    id: 'statuses', title: 'Проведите «торт за 48 часов» по статусам',
    simple: howStatus.simple,
    lead: ui.brief({
      situation: 'Требование ФТ-21 «Система принимает заказ торта, только если до выдачи не меньше 48 часов» пришло от Нины Сергеевны и Галины Ивановны и ведёт к цели БЦ-3. Игорь просит расписать для команды правило: что должно случиться, чтобы требование перешло в следующий статус.',
      todo: [
        'На пути от «Предложено» до «Проверено» пять переходов. Для каждого выберите событие, которое его разрешает. Событий восемь — три из них ничего не разрешают.',
        'Справа от пути — журнал требования: он собирается из ваших ответов. Перечитайте его: правдоподобная ли получилась история?',
        'Ответьте, что будет, если Нина попросит изменить уже согласованное требование, и определите статусы ещё трёх требований.',
        'Нажмите «Проверить». Засчитывается, если верны хотя бы 4 перехода из 5, вопрос про изменение решён верно и общий балл от 80 %.'
      ],
      look: 'Правило перехода — это событие, которое кто-то подтверждает и которое где-то записано. Слова в чате и по телефону переходом не считаются.'
    }),
    blank: () => ({ tr: {}, ch: [], br: {} }),
    reference: () => ({ tr: Object.fromEntries(TRANS.map(x => [x.id, x.ok])), ch: [CHQ_OK], br: Object.fromEntries(BR.map(x => [x.id, x.ok])) }),
    render(el, ctx) {
      el.classList.add('rql-root');
      const a = ctx.ans; a.tr = a.tr || {}; a.br = a.br || {}; a.ch = a.ch || [];
      const show = !!(ctx.result || ctx.readonly);
      const evT = v => (EV.find(e => e.v === v) || { t: '' }).t;
      el.innerHTML = `<div class="stack">
        <div class="rql-req"><div class="row between"><b class="mono">ФТ-21</b><span class="row">${chip('источник: Нина Сергеевна, Галина Ивановна', 'info')}${chip('цель: БЦ-3', '')}</span></div><div class="t">Система принимает заказ торта, только если до выдачи не меньше 48 часов.</div></div>
        <div class="grid2" style="align-items:start"><div class="rql-tlp" data-tl></div><div class="stack tight"><div class="eyebrow">Журнал ФТ-21</div><div class="rql-log" data-log></div></div></div>
        <div class="card flat" data-ch></div>
        <div class="card flat"><div class="q"><b>Какой статус сейчас у этих требований?</b></div><div data-br></div></div>
      </div>`;
      function drawTl() {
        TR.$('[data-tl]', el).innerHTML = MAIN.map((s, i) => {
          const tr = TRANS[i - 1];
          let between = '';
          if (tr) {
            const v = a.tr[tr.id], k = show ? (ctx.readonly || v === tr.ok ? 'ok' : 'bad') : '';
            const why = ctx.readonly ? '' : show && v !== tr.ok ? `<div class="why">${v && EV_WRONG[v] ? esc(EV_WRONG[v]) + ' ' : ''}${esc(tr.hint)}</div>` : '';
            between = `<div class="rql-tr ${k}"><select data-t="${tr.id}" class="${k}" aria-label="Что разрешает переход ${esc(ST[tr.a].t)} → ${esc(ST[tr.b].t)}" ${ctx.readonly ? 'disabled' : ''}><option value="">Что должно случиться?</option>${EV_ORDER.map(ev => `<option value="${ev}" ${v === ev ? 'selected' : ''}>${esc(evT(ev))}</option>`).join('')}</select>${why}</div>`;
          }
          return between + `<div class="rql-tst"><span class="rql-sch ${i === 0 || (TRANS[i - 1] && a.tr[TRANS[i - 1].id]) ? 'past' : ''}">${esc(ST[s].t)}</span></div>`;
        }).join('');
      }
      function drawLog() {
        const rows = [`<div><b>${esc(ST.proposed.t)}</b><span>Нина и Галина Ивановна на встрече: «торт — минимум за 48 часов».</span></div>`];
        for (const tr of TRANS) { const v = a.tr[tr.id]; if (!v) break; rows.push(`<div><b>${esc(ST[tr.b].t)}</b><span>${esc(evT(v))}</span></div>`); }
        if (rows.length < MAIN.length) rows.push(`<div><b class="dim">…</b><span class="dim">дальше журнал пуст: выберите событие для следующего перехода</span></div>`);
        TR.$('[data-log]', el).innerHTML = rows.join('');
      }
      drawTl(); drawLog();
      ui.quiz(TR.$('[data-ch]', el), Object.assign({}, CHQ, { value: a.ch, readonly: ctx.readonly, reveal: show ? (ctx.result || true) : null, onChange: v => { a.ch = v; ctx.save(); } }));
      let brRv = null;
      if (ctx.readonly) brRv = Object.fromEntries(BR.map(x => [x.id, { s: 'ok', why: `${esc(ST[x.ok].t)}.` }]));
      else if (ctx.result) brRv = Object.fromEntries(BR.map(x => { const v = a.br[x.id]; return [x.id, v === x.ok ? { s: 'ok' } : { s: 'bad', why: (v ? '' : 'Не выбрано. ') + esc(x.hint) }]; }));
      ui.match(TR.$('[data-br]', el), { rows: BR.map(x => ({ id: x.id, t: esc(x.t), sub: esc(x.sub) })), choices: BR_CH, value: a.br, reveal: brRv, readonly: ctx.readonly, placeholder: 'Статус…', onChange: v => { a.br = v; ctx.save(); } });
      if (ctx.readonly) return;
      el.addEventListener('change', e => {
        const s = e.target.closest('[data-t]'); if (!s) return;
        if (s.value) a.tr[s.dataset.t] = s.value; else delete a.tr[s.dataset.t];
        ctx.save(); drawTl(); drawLog();
      });
    },
    check(ans) {
      const ev = stEval(ans), notes = [];
      ev.t.forEach(z => { if (!z.ok) notes.push({ ok: false, html: `${esc(ST[z.x.a].t)} → ${esc(ST[z.x.b].t)}: ${z.v ? (EV_WRONG[z.v] ? esc(EV_WRONG[z.v]) + ' ' : 'это событие случается на другом шаге. ') : 'не выбрано. '}${esc(z.x.hint)}` }); });
      if (ev.tg === TRANS.length) notes.push({ ok: true, html: 'Все пять переходов — с правильными событиями.' });
      if (!ev.chOk) notes.push({ ok: false, html: ev.ch == null ? 'Вопрос про изменение после согласования: не отвечено.' : 'Вопрос про изменение: подумайте, на что уже опираются Дима и Лера, и кто решает, менять ли требование.' });
      ev.b.forEach(z => { if (!z.ok) notes.push({ ok: false, html: `«${esc(z.x.t)}»: ${z.v ? '' : 'не выбрано. '}${esc(z.x.hint)}` }); });
      const ok = ev.tg >= 4 && ev.chOk && ev.score >= 0.8;
      return {
        ok, score: ev.score, notes,
        summary: `Переходов верно: ${ev.tg} из ${TRANS.length}. Изменение после согласования: ${ev.chOk ? 'верно' : 'неверно'}. Статусы трёх требований: ${ev.bg} из ${BR.length}.`,
        mentor: ok ? null : 'Каждый переход — это событие, которое кто-то подтверждает и записывает. Слова в чате или по телефону звучат обнадёживающе, но ничего не подтверждают.'
      };
    },
    explain: `<p>Правило перехода — это событие, которое кто-то подтверждает:</p>
      <ul class="checks">
        <li><b>Предложено → На анализе</b>: аналитик взял в разбор — уточняет мощность цеха и смысл 48 часов.</li>
        <li><b>На анализе → Согласовано</b>: ревью с командой и согласие заказчика, зафиксированное в базовой версии. «В целом нормально» по телефону — не согласование.</li>
        <li><b>Согласовано → В работе</b>: требование в спринте, есть задача. Оценка Димы — часть анализа, а не начало работы.</li>
        <li><b>В работе → Реализовано</b>: сборка на тестовом стенде. «У меня работает» — ещё нет.</li>
        <li><b>Реализовано → Проверено</b>: тесты по критерию пройдены — граница 48 часов проверена с двух сторон.</li>
      </ul>
      <p>Баллы — <b>Отложено</b> (хотим, но во втором квартале 2027), срочный торт — <b>Отклонено</b> (цех не успеет), предоплата 50 % — <b>Согласовано</b>. А просьба «24 часа вместо 48» после согласования — <b>запрос на изменение</b>: анализ влияния, решение Нины, новая версия. Подробно о запросах на изменение — в неделе 5. Источник: Вигерс и Битти — статусы требований и управление изменениями; BABOK v3 — «Управление жизненным циклом требований».</p>`,
    report: ans => { const ev = stEval(ans); return ev.t.map(z => `- ${ST[z.x.a].t} → ${ST[z.x.b].t}: ${z.v ? (EV.find(e => e.v === z.v) || {}).t : '—'}${z.ok ? ' ✓' : ' ✗'}`).join('\n') + `\n- Изменение после согласования: ${ev.chOk ? '✓' : '✗'}\n` + ev.b.map(z => `- ${z.x.t}: ${z.v ? ST[z.v].t : '—'}${z.ok ? ' ✓' : ' ✗'}`).join('\n'); }
  };

  // =====================================================================
  // Практика 3. Матрица трассировки «Колоса»
  // =====================================================================
  const MT = [
    { v: 'T1', t: 'Заказ на завтра оформлен в 22:29 — он есть в плане выпечки на 23:00; в 22:31 заказ на завтра не принимается' },
    { v: 'T2', t: 'На Покровке выбран интервал 08:00–08:30 на завтра — заказ создан с этим интервалом; интервал раньше 07:00 выбрать нельзя' },
    { v: 'T3', t: 'Торт переведён в статус «Готов» — покупателю приходит SMS с кодом заказа и адресом пекарни' },
    { v: 'T4', t: 'Предоплата 50 % за торт: пробит чек «предоплата»; при выдаче — чек полного расчёта на остаток' },
    { v: 'T5', t: 'Интервал 08:00–08:30, заказ не оплачен: в 08:59 он ещё ждёт, в 09:01 — статус «Не выкуплен», выпечка вернулась в продажу' }
  ];
  const MR = [
    { id: 'R1', t: 'Заказ на завтра принимается до 22:30; в 23:00 предзаказы автоматически добавляются к плану выпечки', g: ['g1', 'g2'], tt: 'T1', gh: 'Что меняется в цехе, когда предзаказы попадают в план выпечки? Меньше лишнего — и меньше «круассанов нет».' },
    { id: 'R2', t: 'Покупатель выбирает пекарню и получасовой интервал выдачи с 07:00 до 21:00', g: ['g2'], tt: 'T2', gh: 'Предзаказ — ради чего он «Колосу»: денег, тортов или сверки?' },
    { id: 'R3', t: 'Кассир оформляет предзаказ за покупателя, который звонит по телефону', g: ['g2'], tt: 'none', gh: '40 % постоянных клиентов старше 55 лет. Что «Колос» потеряет без них?' },
    { id: 'R4', t: 'Каждый день до 09:00 система передаёт в 1С одну сводку продаж всех пекарен за прошедший день', g: ['g4'], tt: 'none', gh: 'Чьё утро это требование меняет — и какая цель про это?' },
    { id: 'R5', t: 'Покупатель получает SMS, когда его торт готов', g: ['g3'], tt: 'T3', gh: 'Про какой продукт это требование и какая беда с ним сейчас?' },
    { id: 'R6', t: 'При предоплате торта пробивается чек «предоплата», при выдаче — чек полного расчёта', g: ['law'], tt: 'T4', gh: 'Это хотела Нина — или этого требует кто-то другой?' },
    { id: 'R7', t: 'Кассир после закрытия вносит списания на планшете', g: ['g1'], tt: 'none', gh: 'Какую цифру Нины это требование помогает увидеть и снизить?' },
    { id: 'R8', t: 'На главном экране приложения — анимация падающих круассанов', g: ['none'], tt: 'none', gh: 'К какой из четырёх целей это ведёт — честно?' },
    { id: 'R9', t: 'Неоплаченный предзаказ держим 30 минут после конца интервала, потом выпечка уходит в продажу', g: ['g1', 'g2'], tt: 'T5', gh: 'Что происходит с выпечкой, если её не забрали и не вернули в продажу?' }
  ];
  const MG_CH = GOALS.concat([{ v: 'law', t: 'Закон или ограничение — не цель' }, { v: 'none', t: 'Ни к одной цели' }]);
  const MT_CH = MT.map(x => ({ v: x.v, t: x.v.replace('T', 'ТК-') })).concat([{ v: 'none', t: 'Проверки нет' }]);
  const MQ = {
    q: 'Посмотрите на свою матрицу. Что из этого — настоящие дыры и правильные выводы? Отметьте всё верное.', multi: true, seed: 'rql-mq',
    options: [
      { t: 'Анимация круассанов не ведёт ни к одной цели: выяснить, кто и зачем её просил, и, скорее всего, вывести из первой версии', ok: 1, why: 'Да: висящее требование ест время, ничего не давая целям.' },
      { t: 'Цель БЦ-4 (сверка за 15 минут) ничем не проверяется: у сводки в 1С нет ни одного теста', ok: 1, why: 'Да: цель Олега Петровича на пилоте никто не проверит. Нужны критерий и тест.' },
      { t: 'Заказ по телефону через кассира и списания на планшете не проверяются: дописать критерии приёмки и тесты вместе с Лерой', ok: 1, why: 'Да: непроверенное требование — непринятое требование.' },
      { t: 'Чеки по 54-ФЗ не ведут к бизнес-цели — это лишнее требование, его надо убрать', why: 'Нет: у него есть источник — закон. Требования из законов и ограничений трассируются к ним, а не к целям.' },
      { t: 'Тестов меньше, чем требований, — это дыра: их должно быть поровну', why: 'Нет: один тест может проверять несколько требований, а одному требованию бывает нужно десять тестов. Важно, чтобы у каждого требования была проверка.' }
    ]
  };
  const MQ_OK = MQ.options.map((o, i) => o.ok ? i : -1).filter(i => i >= 0);
  function mxEval(ans) {
    const g = (ans && ans.g) || {}, t = (ans && ans.t) || {};
    const rows = MR.map(r => ({ r, gv: g[r.id], tv: t[r.id], gOk: !!g[r.id] && r.g.includes(g[r.id]), tOk: t[r.id] === r.tt }));
    const sel = new Set((ans && ans.q) || []), qGood = MQ_OK.filter(i => sel.has(i)).length, qBad = [...sel].filter(i => !MQ_OK.includes(i)).length;
    const gs = rows.filter(x => x.gOk).length / MR.length, ts = rows.filter(x => x.tOk).length / MR.length, qs = Math.max(0, (qGood - qBad) / MQ_OK.length);
    return { rows, qGood, qBad, gs, ts, qs, score: gs * 0.4 + ts * 0.4 + qs * 0.2 };
  }
  function coverage(g, t) {
    return GOALS.map(G => {
      const rs = MR.filter(r => g[r.id] === G.v), tested = rs.filter(r => t[r.id] && t[r.id] !== 'none');
      const k = !rs.length ? 'bad' : tested.length === rs.length ? 'ok' : tested.length ? 'warn' : 'bad';
      const s = !rs.length ? 'нет требований' : tested.length === rs.length ? 'проверена' : tested.length ? 'проверена частично' : 'не проверена';
      return { G, rs, tested, k, s };
    });
  }
  const matrixTask = {
    id: 'matrix', title: 'Соберите матрицу трассировки «Колоса»',
    simple: howTrace.simple,
    lead: ui.brief({
      situation: 'Перед встречей с Ниной Игорь просит фрагмент матрицы трассировки: девять требований из реестра, четыре бизнес-цели и пять тест-кейсов, которые Лера уже написала. Его вопрос: «Каждая цель чем-то проверяется? Нет ли лишнего?»',
      todo: [
        'Для каждого требования выберите, к какой цели оно ведёт (или что это закон, или что цели нет), и каким тест-кейсом проверяется (или что проверки нет).',
        'Справа внизу живёт сводка: покрытие целей, висящие и непроверенные требования, матрица в табличном виде. Она пересчитывается от ваших ответов.',
        'Ответьте на вопрос: какие выводы из матрицы верны.',
        'Нажмите «Проверить». Засчитывается от 80 % и без неверных выводов в вопросе.'
      ],
      lookTitle: 'Бизнес-цели «Колоса»',
      look: 'БЦ-1 — снизить списания с 12 % до 7 %; БЦ-2 — выручка +15 % за счёт предзаказа и доставки; БЦ-3 — ни одного потерянного заказа торта к 8 Марта 2027; БЦ-4 — ручная сверка продаж с 2 часов до 15 минут. Где разумны две цели, засчитывается любая.'
    }),
    blank: () => ({ g: {}, t: {}, q: [] }),
    reference: () => ({ g: Object.fromEntries(MR.map(r => [r.id, r.g[0]])), t: Object.fromEntries(MR.map(r => [r.id, r.tt])), q: MQ_OK.slice() }),
    render(el, ctx) {
      el.classList.add('rql-root');
      const a = ctx.ans; a.g = a.g || {}; a.t = a.t || {}; a.q = a.q || [];
      const show = !!(ctx.result || ctx.readonly);
      const sel = (kind, r, list, cur, cls) => `<select data-k="${kind}" data-r="${r.id}" class="${cls}" aria-label="${kind === 'g' ? 'Цель' : 'Проверка'}: ${esc(r.t)}" ${ctx.readonly ? 'disabled' : ''}><option value="">${kind === 'g' ? 'Цель…' : 'Проверка…'}</option>${list.map(c => `<option value="${c.v}" ${cur === c.v ? 'selected' : ''}>${esc(c.t)}</option>`).join('')}</select>`;
      el.innerHTML = `<div class="stack">
        <div class="stack tight"><div class="eyebrow">Тест-кейсы Леры</div><div class="rql-tests">${MT.map(x => `<div class="rql-test"><b>${x.v.replace('T', 'ТК-')}</b> ${esc(x.t)}</div>`).join('')}</div></div>
        <div class="rql-mx">${MR.map(r => {
          const gOk = !!a.g[r.id] && r.g.includes(a.g[r.id]), tOk = a.t[r.id] === r.tt;
          const k = show ? (ctx.readonly || (gOk && tOk) ? 'ok' : gOk || tOk ? 'warn' : 'bad') : '';
          let why = '';
          if (ctx.readonly) why = `<div class="why">${esc(r.g.map(v => (MG_CH.find(c => c.v === v) || {}).t).join(' или '))}; ${r.tt === 'none' ? 'проверки нет — это дыра' : 'проверяется ' + r.tt.replace('T', 'ТК-')}.</div>`;
          else if (show && !(gOk && tOk)) why = `<div class="why">${!gOk ? esc(r.gh) + ' ' : ''}${!tOk ? 'Проверка: перечитайте тест-кейсы — какой из них подтверждает именно это требование? Если ни один — так и отметьте.' : ''}</div>`;
          return `<div class="rql-mr ${k}"><div class="t"><span class="id">${r.id}</span>${esc(r.t)}</div>${sel('g', r, MG_CH, a.g[r.id], show ? (ctx.readonly || gOk ? 'ok' : 'bad') : '')}${sel('t', r, MT_CH, a.t[r.id], show ? (ctx.readonly || tOk ? 'ok' : 'bad') : '')}${why}</div>`;
        }).join('')}</div>
        <div data-sum></div>
        <div class="card flat" data-q></div>
      </div>`;
      function drawSum() {
        const cov = coverage(a.g, a.t), orphan = MR.filter(r => a.g[r.id] === 'none'), untested = MR.filter(r => a.t[r.id] === 'none'), empty = MR.filter(r => !a.g[r.id] || !a.t[r.id]).length;
        const head = ['Требование', 'БЦ-1', 'БЦ-2', 'БЦ-3', 'БЦ-4', 'Закон', 'Проверка'];
        const rows = MR.map(r => [`<b class="mono">${r.id}</b>`].concat(['g1', 'g2', 'g3', 'g4', 'law'].map(v => a.g[r.id] === v ? '●' : '')).concat([a.t[r.id] ? (a.t[r.id] === 'none' ? '<span class="dim">нет</span>' : a.t[r.id].replace('T', 'ТК-')) : '']));
        TR.$('[data-sum]', el).innerHTML = `<div class="stack tight"><div class="eyebrow">Сводка по вашей матрице${empty ? ` · не заполнено строк: ${empty}` : ''}</div>
          <div class="rql-cov">${cov.map(c => `<div class="stat"><span class="k">${esc(c.G.t.split(' — ')[0])}</span><span class="v ${c.k}">${esc(c.s)}</span><span class="s">требований: ${c.rs.length}, с проверкой: ${c.tested.length}</span></div>`).join('')}</div>
          <div class="small"><b>Висящие (ни к одной цели):</b> ${orphan.length ? orphan.map(r => r.id).join(', ') : '<span class="dim">нет</span>'} · <b>Без проверки:</b> ${untested.length ? untested.map(r => r.id).join(', ') : '<span class="dim">нет</span>'}</div>
          <details class="more"><summary>Матрица в табличном виде — так её ведут в таблице или вики</summary><div>${ui.table(head, rows).replace('class="tbl"', 'class="tbl rql-rtm"').replace(/<td>●<\/td>/g, '<td class="c ok">●</td>')}</div></details></div>`;
      }
      drawSum();
      ui.quiz(TR.$('[data-q]', el), Object.assign({}, MQ, { value: a.q, readonly: ctx.readonly, reveal: show ? (ctx.result || true) : null, onChange: v => { a.q = v; ctx.save(); } }));
      if (ctx.readonly) return;
      el.addEventListener('change', e => {
        const s = e.target.closest('select[data-k]'); if (!s) return;
        const bag = a[s.dataset.k];
        if (s.value) bag[s.dataset.r] = s.value; else delete bag[s.dataset.r];
        s.classList.remove('ok', 'bad'); const row = s.closest('.rql-mr'); row.classList.remove('ok', 'warn', 'bad'); const w = TR.$('.why', row); if (w) w.remove();
        ctx.save(); drawSum();
      });
    },
    check(ans) {
      const ev = mxEval(ans), notes = [];
      const gBad = ev.rows.filter(x => !x.gOk), tBad = ev.rows.filter(x => !x.tOk);
      gBad.slice(0, 4).forEach(x => notes.push({ ok: false, html: `${x.r.id}, цель: ${x.gv ? '' : 'не выбрано. '}${esc(x.r.gh)}` }));
      if (gBad.length > 4) notes.push({ ok: false, html: `И ещё ${gBad.length - 4} ${TR.plural(gBad.length - 4, 'строка', 'строки', 'строк')} с целью не сходятся.` });
      if (tBad.length) notes.push({ ok: false, html: `Проверка не сходится в ${tBad.length} ${TR.plural(tBad.length, 'строке', 'строках', 'строках')}: ${tBad.map(x => x.r.id).join(', ')}. Для каждой спросите: какой тест-кейс Леры подтверждает именно это требование? Если ни один — так и отметьте: это и есть дыра.` });
      if (ev.qBad) notes.push({ ok: false, html: 'В выводах отмечено неверное. Подумайте, откуда ещё, кроме целей, приходят требования и обязаны ли тесты и требования идти один к одному.' });
      else if (ev.qGood < MQ_OK.length) notes.push({ ok: 'warn', html: `Верных выводов отмечено ${ev.qGood} из ${MQ_OK.length}. Посмотрите на сводку: какие цели и требования в ней красные?` });
      if (!gBad.length && !tBad.length) notes.push({ ok: true, html: 'Матрица собрана верно.' });
      const ok = ev.score >= 0.8 && ev.qBad === 0;
      return {
        ok, score: ev.score, notes,
        summary: `Цели верно: ${MR.length - gBad.length} из ${MR.length}. Проверки верно: ${MR.length - tBad.length} из ${MR.length}. Выводы: ${ev.qGood} из ${MQ_OK.length}, неверных ${ev.qBad}.`,
        mentor: ok ? null : 'Читайте матрицу в обе стороны. Назад: «зачем это требование?» Вперёд: «чем мы докажем, что оно сделано?» Пустой ответ — не ошибка студента, а находка аналитика.'
      };
    },
    explain: `<p>Матрица отвечает на два вопроса Игоря:</p>
      <ul class="checks">
        <li><b>Назад — «нет ли лишнего?»</b> Анимация круассанов не ведёт ни к одной цели: висящее требование. Его не удаляют молча — спрашивают, кто просил и зачем, и, скорее всего, выводят из первой версии. А чеки по 54-ФЗ — не сирота: их источник — закон.</li>
        <li><b>Вперёд — «каждая цель проверяется?»</b> Нет: у сводки в 1С нет теста, и цель БЦ-4 (15 минут вместо 2 часов) на пилоте никто не проверит. Ещё два непроверенных требования — заказ по телефону и списания на планшете.</li>
        <li><b>Не ровно</b> — нормально: одно требование может вести к двум целям (заказ до 22:30 — и меньше списаний, и меньше «круассанов нет»), один тест — проверять несколько требований.</li>
      </ul>
      <p>Дыры в матрице — не провал, а польза: их нашли до пилота. Источник: BABOK v3, задача «Трассировка требований»; Вигерс и Битти — матрица трассировки и связи в цепочке требований.</p>`,
    report: ans => mxEval(ans).rows.map(x => `- ${x.r.id}: цель ${x.gv ? (MG_CH.find(c => c.v === x.gv) || {}).t : '—'}${x.gOk ? ' ✓' : ' ✗'}; проверка ${x.tv ? (MT_CH.find(c => c.v === x.tv) || {}).t : '—'}${x.tOk ? ' ✓' : ' ✗'}`).join('\n')
  };

  // =====================================================================
  // Практика 4. Ответ Диме: зачем трассировка
  // =====================================================================
  const WT_RUBRIC = [
    'Назад: у каждого требования видно, откуда оно и к какой цели ведёт, — при споре или сокращении бюджета понятно, кого спросить и что можно вычеркнуть (пример: анимация круассанов)',
    'Вперёд: видно, что каждое требование сделано и проверено; дыры видны до пилота, а не после (пример: сводка в 1С и цель БЦ-4 без теста)',
    'Анализ влияния: при изменении (48 → 24 часа) по связям сразу видно, какие задачи и тесты затронуты',
    '«Понятно сегодня» — не значит «понятно через полгода и новому человеку»: 40 требований — это уже сотни связей',
    'Соразмерность: не отдельная бюрократия — хватает ссылок в трекере или простой таблицы; глубину выбирают по рискам проекта'
  ];
  const WT_REF = 'Дима, согласен: матрица ради матрицы не нужна. Но вот что она даёт нам с вами. Назад: у каждого требования видно, откуда оно и к какой цели Нины ведёт, — когда урежут бюджет или Нина спросит, зачем анимация круассанов, ответ найдётся за минуту. Вперёд: видно, что сделано и что проверено, — мы уже нашли, что у сводки в 1С нет ни одного теста, а значит, цель Олега Петровича «15 минут вместо 2 часов» на пилоте никто не проверит. А когда Нина попросит торт за 24 часа вместо 48, по связям сразу видно, какие задачи и тесты придётся трогать, — без раскопок в чате. 40 требований — это уже сотни связей: сегодня они в голове, через полгода и у нового разработчика — нет. Отдельной системы не нужно: хватит ссылок между требованием, задачей и тестом в трекере и сводной таблицы раз в спринт.';
  const whyTraceTask = {
    id: 'why-trace', title: 'Ответить Диме: зачем трассировка',
    simple: {
      icon: '💬',
      plain: 'Разработчику важно не «требование стандарта», а меньше переделок, понятные задачи и спокойная приёмка.',
      analogy: 'Ярлык на противне кажется лишней бумажкой — пока не найдут брак в партии муки и не придётся за час понять, что из неё испекли и кому продали.',
      tech: 'Аргументы: трассировка назад (источник и цель — что можно вычеркнуть и кого спросить), вперёд (реализация и проверка — где дыры), анализ влияния изменений; соразмерность — глубина трассировки по рискам. Опора — BABOK v3, «Трассировка требований»; Вигерс и Битти.'
    },
    lead: ui.brief({
      situation: 'Вы показали матрицу на планёрке. Дима, тимлид, морщится: «Зачем нам матрица трассировки? У нас 40 требований, и так всё понятно. Это бюрократия». Игорь кивает вам: «Ответьте Диме — коротко и по делу».',
      todo: [
        'Напишите Диме 5–8 предложений (от 250 символов). Без лекции — на примерах «Колоса».',
        'Покажите, что трассировка даёт ему самому, и согласитесь там, где он прав.',
        'Нажмите «Проверить с Ксенией (Claude)» или «Сверить с эталоном самому» и честно отметьте раскрытые пункты. Засчитывается от 60 %.'
      ],
      lookTitle: 'На что опереться',
      look: 'Лаборатория БЦ-3 (что случается, когда рвётся звено) и ваша матрица: анимация круассанов без цели, сводка в 1С без теста, будущая просьба Нины «24 часа вместо 48». Дима прав в одном: бюрократия ради бюрократии не нужна. Скажите, сколько трассировки достаточно.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: WT_REF, self: WT_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('rql-root');
      el.insertAdjacentHTML('beforeend', ui.say('dima', 'Зачем нам матрица трассировки? У нас 40 требований, и так всё понятно. Это бюрократия.'));
      const j = document.createElement('div'); j.style.marginTop = '12px'; el.appendChild(j);
      ui.justify(j, {
        id: 'rql-trace', q: 'Зачем трассировка, если «и так всё понятно»?', qPlain: 'Объясните тимлиду разработки, зачем проекту сети пекарен трассировка требований (связи цель — требование — задача — тест), если у команды 40 требований и ему кажется, что всё и так понятно.',
        rubric: WT_RUBRIC, reference: WT_REF, value: ctx.ans.j, readonly: ctx.readonly, minLen: 250,
        placeholder: 'Дима, …',
        onChange: v => { ctx.ans.j = v; ctx.save(); ctx.decide('Ответ Диме: зачем трассировка', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j);
      return {
        ok: s >= 0.6, score: s,
        summary: s ? `Оценка ответа: ${Math.round(s * 100)} %.` : 'Напишите ответ (от 250 символов) и проверьте его с Ксенией или сверьте с эталоном сами.',
        notes: s && s < 0.6 ? [{ ok: false, html: 'Диме нужны три вещи: что трассировка даёт команде (назад — зачем, вперёд — что проверено), как она экономит время при изменениях и сколько её достаточно, чтобы не было бюрократии.' }] : []
      };
    },
    explain: `<p>Сильный ответ тимлиду соглашается с главным — «бюрократия не нужна» — и показывает пользу на его задачах: меньше работы без требования (конфетти и анимация), меньше переделок при изменениях (по связям сразу видно, что трогать), спокойная приёмка (каждая цель чем-то проверяется).</p>
      <p>Глубину трассировки выбирают по рискам. «Колосу» хватит ссылок в трекере и сводной таблицы; медицинскому прибору — специальной системы и трассировки до каждого теста. Анализ влияния изменений по трассировке — тема недели 5.</p>`,
    report: ans => (ans.j && ans.j.text) ? ans.j.text : '—'
  };

  // =====================================================================
  TR.stage({
    id: 'req-life', act: 2, order: 140, slot: 'Чт 10:00', title: 'Жизнь требования',
    when: 'четверг, 10:00 · переговорная «Квант Софт», реестр требований на экране',
    intro: [
      { who: 'igor', html: 'Нина Сергеевна спросила в чате: «Торт за 48 часов — это мы уже точно решили? А баллы когда?» Я полез искать: часть требований в её письме, часть в заметках с интервью, часть в чате. Что согласовано, а что нет, — ответить не смог.' },
      { who: 'ksenia', html: 'Значит, пора навести порядок. Вчера мы учились писать требование хорошо. Сегодня — как оно <b>живёт</b>: откуда приходит, какой у него паспорт, через какие статусы проходит, где хранится и как связано с целью Нины и тестом Леры. Ваша работа — завести карточку, провести требование по статусам и собрать матрицу трассировки «Колоса». А Игорь получит ответ для Нины.' }
    ],
    facts: [],
    glossary: [
      { term: 'Инженерия требований', simple: 'Весь путь заказа торта: расспросить, уточнить, записать в бланк, сверить с клиенткой и следить за бланком до выдачи.', tech: 'Деятельность по работе с требованиями: разработка требований (выявление, анализ, спецификация, проверка) и управление требованиями (статусы, версии, изменения, трассировка). Вигерс и Битти; BABOK v3.' },
      { term: 'Выявление требований', simple: 'Расспросить клиентку и посмотреть, как она празднует.', tech: 'Получение информации о потребностях от заинтересованных лиц и из других источников: интервью, наблюдение, анализ документов, воркшопы. Подробно — в неделе 3.' },
      { term: 'Спецификация требований', simple: 'Записать заказ в бланк так, чтобы кондитер понял без звонка.', tech: 'Запись требований в согласованной форме и с атрибутами — так, чтобы их одинаково поняли все читатели.' },
      { term: 'Верификация и валидация требований', simple: 'Верификация — «записали по правилам?», валидация — «записали тот торт, который хочет клиентка?».', tech: 'Верификация — проверка качества записи (однозначно, полно, проверяемо, непротиворечиво), обычно ревью с командой. Валидация — подтверждение, что требования отражают реальные потребности, с заинтересованными лицами.' },
      { term: 'Управление требованиями', simple: 'Следить за бланком: статус, правки, что из него уже испекли.', tech: 'Ведение требований на протяжении жизни проекта: статусы, версии, базовая версия, изменения, трассировка. В BABOK v3 — «Управление жизненным циклом требований».' },
      { term: 'Атрибуты требования', simple: 'Поля бланка вокруг самого заказа: номер, кто заказал, кто записал, срочность, статус.', tech: 'Сведения о требовании: ID, источник, автор, приоритет, статус, версия, связь с целью, критерий проверки, обоснование, риск. Набор выбирает команда.' },
      { term: 'Статус требования', simple: '«Принят → согласован → в работе → готов → выдан» на бланке в цехе.', tech: 'Этап жизни требования: предложено, на анализе, согласовано, в работе, реализовано, проверено; в сторону — отложено, отклонено. Для каждого перехода — правило: какое событие и кто подтверждает.' },
      { term: 'Трассировка требований', simple: 'Ярлык на противне: из какой муки, по какому рецепту, для какого заказа.', tech: 'Связи требования назад (источник, бизнес-цель) и вперёд (истории, задачи, код, тесты). Нужна, чтобы видеть лишнее и непроверенное и оценивать влияние изменений.' },
      { term: 'Матрица трассировки', simple: 'Таблица «заказ — рецепт — противень — дегустация».', tech: 'Таблица связей: строки — требования, столбцы — цели, истории, задачи, тесты (requirements traceability matrix). Показывает висящие требования и непроверенные цели.' },
      { term: 'Базовая версия требований', simple: 'Подписанный бланк заказа торта: дальше правки — только звонком, с новой ценой и подписью.', tech: 'Baseline — согласованный набор требований определённой версии, на который опираются оценка, план, разработка и тесты. После неё изменения идут через запрос на изменение: анализ влияния → решение владельца продукта → новая версия.' }
    ],
    outro: 'Требование — не фраза в письме, а живой объект. У него есть паспорт — ID, источник, автор, приоритет, статус, версия, цель и критерий проверки, — путь по статусам с понятными правилами переходов и связи в обе стороны: от цели Нины до теста Леры. После согласования оно попадает в базовую версию и дальше меняется только через запрос на изменение — подробно в неделе 5. Хранить можно в вики, трекере или таблице, лишь бы правда жила в одном месте. Со следующей недели — выявление: кого спрашивать, как задавать вопросы и что видно только на смене в пекарне.',
    tasks: [howProcess, howStatus, howTrace, cardTask, statusesTask, matrixTask, whyTraceTask]
  });
})();
