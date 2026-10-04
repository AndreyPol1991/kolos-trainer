/* Неделя 1, понедельник 09:00: из чего сделан софт.
   Теория: программа → приложение → система; фронтенд, бэкенд, база данных, интеграции (разрез «глазами покупателя /
   глазами аналитика»); интерфейсы UI, API, аппаратный; клиент и сервер — путь одного запроса, где живёт правило,
   что видит человек, когда часть молчит. Соседние примеры: сервис доставки еды, банкомат, «сколько круассанов осталось».
   Практика: разложить части будущей системы «Колоса», путь одного нажатия «Заказать», лаборатория «сломайте одну часть»,
   объяснить Нине Сергеевне, зачем ей то, чего покупатель не видит. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'software';

  if (!document.getElementById('sw-css')) document.head.insertAdjacentHTML('beforeend', `<style id="sw-css">
    .sw-root, .sw-root .stack > * { min-width: 0; }
    .sw-root .seg button { white-space: normal; text-align: left; }
    .sw-box { display: grid; gap: 12px; padding: 14px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); min-width: 0; }
    .sw-box > * { min-width: 0; }
    .sw-tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 8px; }
    .sw-tile { border: 1px solid var(--border); border-radius: 10px; padding: 8px 10px; background: var(--surface-2); font-size: 13.5px; line-height: 1.35; display: grid; gap: 3px; transition: opacity .2s, border-color .2s, background .2s; min-width: 0; }
    .sw-tile .k { font: 600 10.5px/1.2 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .sw-tile.on { border-color: var(--accent); background: var(--accent-soft); box-shadow: 0 0 0 1px var(--accent) inset; }
    .sw-tile.on .k { color: var(--accent); }
    .sw-tile.off { opacity: .38; }
    .sw-arch { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
    .sw-part { position: relative; text-align: left; border: 1px solid var(--border-strong); border-radius: 12px; padding: 10px 12px 12px; background: var(--surface-2); display: grid; gap: 4px; align-content: start; min-width: 0; color: var(--text); }
    .sw-part .ic { font-size: 22px; line-height: 1.1; }
    .sw-part b { font: 600 14.5px/1.25 var(--f-brand); }
    .sw-part small { color: var(--text-2); font-size: 12.5px; line-height: 1.35; }
    .sw-part[aria-pressed="true"] { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent) inset; }
    .sw-part.hid { background: repeating-linear-gradient(135deg, var(--surface-2) 0 8px, var(--surface-3) 8px 16px); border-style: dashed; }
    .sw-part.hid .ic, .sw-part.hid b, .sw-part.hid small { filter: blur(3px); opacity: .55; }
    .sw-part .qn { position: absolute; top: 8px; right: 8px; font: 600 11px/1 var(--f-mono); padding: 3px 7px; border-radius: 99px; background: var(--violet-soft); color: var(--violet); }
    .sw-wire { display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: 12.5px; color: var(--text-muted); }
    .sw-wire span { white-space: nowrap; }
    .sw-def { display: grid; grid-template-columns: 170px minmax(0, 1fr); gap: 6px 14px; font-size: 14px; }
    .sw-def > .k { font: 600 11px/1.5 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); padding-top: 2px; }
    .sw-def > .v { min-width: 0; }
    .sw-def ul { margin: 0; padding-left: 18px; display: grid; gap: 2px; }
    .sw-if { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
    .sw-if .card { align-content: start; }
    .sw-if .tag { justify-self: start; }
    .sw-game { display: grid; gap: 8px; }
    .sw-gq { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 6px 12px; align-items: center; padding: 8px 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); }
    .sw-gq.ok { border-color: var(--ok); } .sw-gq.bad { border-color: var(--bad); }
    .sw-gq .why { grid-column: 1 / -1; font-size: 13px; color: var(--text-2); }
    .sw-gq .row { gap: 4px; }
    .sw-phone { width: 236px; max-width: 100%; border: 2px solid var(--border-strong); border-radius: 26px; padding: 12px 12px 16px; background: var(--surface); display: grid; gap: 8px; justify-self: center; align-content: start; min-height: 250px; }
    .sw-phone .bar { height: 5px; width: 56px; border-radius: 5px; background: var(--border-strong); justify-self: center; }
    .sw-phone .hd { font: 600 13px/1.3 var(--f-brand); color: var(--text-2); border-bottom: 1px solid var(--border); padding-bottom: 6px; }
    .sw-phone .it { display: flex; justify-content: space-between; gap: 8px; font-size: 13.5px; padding: 4px 0; border-bottom: 1px dashed var(--border); }
    .sw-phone .it b { font-family: var(--f-mono); }
    .sw-phone .it.zero b { color: var(--bad); }
    .sw-phone .msg { border-radius: 12px; padding: 10px 12px; font-size: 13.5px; line-height: 1.4; background: var(--surface-2); border: 1px solid var(--border); }
    .sw-phone .msg.ok { background: var(--ok-soft); border-color: color-mix(in srgb, var(--ok) 40%, transparent); }
    .sw-phone .msg.bad { background: var(--bad-soft); border-color: color-mix(in srgb, var(--bad) 40%, transparent); }
    .sw-phone .msg.warn { background: var(--warn-soft); border-color: color-mix(in srgb, var(--warn) 40%, transparent); }
    .sw-phone .msg.empty { color: var(--text-muted); border-style: dashed; text-align: center; }
    .sw-phone .spin { display: grid; place-items: center; gap: 6px; padding: 24px 0; color: var(--text-muted); font-size: 13px; }
    .sw-phone .spin i { width: 26px; height: 26px; border-radius: 50%; border: 3px solid var(--surface-3); border-top-color: var(--accent); animation: sw-rot 1s linear infinite; }
    @keyframes sw-rot { to { transform: rotate(360deg); } }
    .sw-lab { display: grid; grid-template-columns: 250px minmax(0, 1fr); gap: 16px; align-items: start; }
    .sw-lab > * { min-width: 0; }
    .sw-state { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .sw-state .stat .v { font-size: 15px; font-family: var(--f-body); }
    .sw-rows { display: grid; gap: 6px; }
    .sw-rule { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 4px 12px; align-items: center; padding: 8px 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); }
    .sw-rule .s { grid-column: 1 / -1; font-size: 13px; color: var(--text-2); }
    .sw-rule.ok { border-color: color-mix(in srgb, var(--ok) 50%, var(--border)); }
    .sw-rule.bad { border-color: color-mix(in srgb, var(--bad) 50%, var(--border)); }
    .sw-rule.hl { border-color: color-mix(in srgb, var(--warn) 50%, var(--border)); }
    .sw-pick { display: grid; gap: 6px; }
    .sw-pick button { text-align: left; white-space: normal; justify-content: flex-start; font-weight: 500; line-height: 1.35; }
    @media (max-width: 760px) {
      .sw-arch { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .sw-if { grid-template-columns: minmax(0, 1fr); }
      .sw-lab { grid-template-columns: minmax(0, 1fr); }
      .sw-def { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .sw-def > .v { margin-bottom: 8px; }
    }
    @media (max-width: 420px) {
      .sw-state { grid-template-columns: minmax(0, 1fr); }
      .sw-gq { grid-template-columns: minmax(0, 1fr); }
    }
  </style>`);

  // ---------- общие помощники ----------
  const L = (id, t, sub) => ({ id, t, sub });
  const quizRef = cfg => cfg.options.map((o, i) => o.ok ? i : -1).filter(i => i >= 0);
  const plainT = s => String(s || '').replace(/<[^>]+>/g, '');
  // вкладка рисуется в свежий контейнер: старые обработчики уходят вместе со старым содержимым
  const fresh = fn => pane => { const d = document.createElement('div'); pane.appendChild(d); fn(d); };

  // проигрыватель сценариев на ui.seq с переключателем вариантов
  function walk(el, cfg) {
    let cur = cfg.scenarios[0].id;
    el.innerHTML = `<div class="stack">${cfg.scenarios.length > 1 ? `<div class="row"><span class="small dim">Вариант:</span>${ui.seg('wk', cfg.scenarios.map(s => ({ v: s.id, t: s.t })), cur, 'accent')}</div>` : ''}<div data-w></div><div data-sum></div></div>`;
    const box = TR.$('[data-w]', el), sum = TR.$('[data-sum]', el);
    function show(id) {
      cur = id; const sc = cfg.scenarios.find(s => s.id === id);
      box.innerHTML = ''; sum.innerHTML = '';
      const d = document.createElement('div'); box.appendChild(d);
      ui.seq(d, { lanes: sc.lanes, steps: sc.steps, title: sc.t, laneW: cfg.laneW || 160, hint: 'Нажимайте «Шаг →» и читайте пояснение под схемой. «Проиграть» покажет всё подряд.', onEnd() { sum.innerHTML = sc.sum ? ui.note(sc.sumKind || '', 'Итог', sc.sum) : ''; } });
    }
    ui.onSeg(el, (n, v) => { if (n === 'wk') show(v); });
    show(cur);
  }

  // =====================================================================
  // Теория 1. Из чего сделана система (соседний пример — сервис доставки еды, банкомат)
  // =====================================================================
  const LEVELS = [
    { v: 'prog', t: 'Программа' },
    { v: 'app', t: 'Приложение' },
    { v: 'sys', t: 'Система' }
  ];
  const TILES = [
    { id: 'calc', k: 'программа', t: 'Расчёт цены доставки по расстоянию', lv: ['prog'] },
    { id: 'cli', k: 'приложение', t: 'Приложение покупателя: меню, корзина, «Оформить»', lv: ['app'] },
    { id: 'cur', k: 'приложение', t: 'Приложение курьера: куда ехать, «Доставлено»', lv: ['app'] },
    { id: 'rest', k: 'приложение', t: 'Экран ресторана: новые заказы, «Готово»', lv: ['app'] },
    { id: 'srv', k: 'сервер', t: 'Сервер с правилами: «минимальный заказ 500 ₽», «не принят за 5 минут — отдать другому ресторану»', lv: [] },
    { id: 'db', k: 'база данных', t: 'База: рестораны, меню, заказы, адреса', lv: [] },
    { id: 'ext', k: 'чужие системы', t: 'Банк, карты, SMS-сервис', lv: [] },
    { id: 'ppl', k: 'люди', t: 'Повара, курьеры, поддержка', lv: [] },
    { id: 'rules', k: 'порядок работы', t: 'Кто что делает, если курьер заболел или ресторан закрылся', lv: [] }
  ];
  const LEVEL_TXT = {
    prog: {
      plain: '<b>Программа</b> — набор инструкций, которые выполняет компьютер. Маленькая или огромная — всё равно программа. В сервисе доставки их десятки; подсвечена одна — она считает цену доставки по расстоянию.',
      an: 'В пекарне это <b>рецепт одного изделия</b>: точные шаги, которые выполняются одинаково каждый раз.'
    },
    app: {
      plain: '<b>Приложение</b> — программа, с которой работает человек, чтобы решить свою задачу. У сервиса доставки их три — для трёх разных людей: покупателя, курьера и ресторана.',
      an: 'В пекарне это <b>прилавок с кассой</b>: место, где человек делает своё дело — выбирает, платит, получает.'
    },
    sys: {
      plain: '<b>Система</b> — всё вместе ради общей цели: несколько приложений, сервер с правилами, база данных, чужие системы, а ещё люди и порядок их работы. Убери одну часть — цель не достигается: заказ оформлен, а везти некому.',
      an: 'В пекарне это <b>вся пекарня</b>: цех, развоз, кассы, бухгалтерия, люди и правила смен — ради «свежий хлеб у покупателя».'
    }
  };
  const PARTS_T = [
    { id: 'front', ic: '📱', t: 'Фронтенд', sub: 'приложение в телефоне, сайт',
      what: 'Всё, что человек видит и нажимает: экраны, кнопки, списки, сообщения об ошибках. Работает у пользователя — в телефоне или браузере. Ещё говорят «клиентская часть» и «пользовательский интерфейс» (UI).',
      an: 'Витрина и прилавок: красиво разложено, можно выбрать и заплатить. Но булки здесь не пекут.',
      ex: 'Меню ресторана, корзина, кнопка «Оформить», экран «Курьер в пути».',
      q: ['Какие экраны нужны и кто ими пользуется — покупатель, курьер, ресторан?', 'Что человек видит, когда пусто, грузится, ошибка, нет связи?', 'Какие данные на каждом экране и откуда они берутся?'] },
    { id: 'back', ic: '⚙️', t: 'Бэкенд', sub: 'сервер: правила и расчёты',
      what: 'Программа на сервере — мощном компьютере в дата-центре. Принимает запросы от всех фронтендов, проверяет правила, считает, меняет статусы, обращается к чужим системам. Пользователь его никогда не видит.',
      an: 'Кухня и цех: покупатель их не видит, но именно там решают, что можно испечь, сколько и к какому времени.',
      ex: '«Минимальный заказ 500 ₽», «ресторан сейчас открыт?», расчёт цены доставки, «заказ не приняли за 5 минут — отдать другому».',
      q: ['Какие правила действуют и откуда они взялись — договор, закон, решение владельца?', 'Какие статусы проходит заказ и кто их меняет?', 'Что система делает, если правило нарушено?'] },
    { id: 'db', ic: '🗄️', t: 'База данных', sub: 'хранит всё, что надо помнить',
      what: 'Хранилище записей: заказы, товары, клиенты, оплаты. Бэкенд кладёт туда данные и достаёт их. Ни приложение, ни человек не ходят в базу напрямую — только через бэкенд.',
      an: 'Склад и журнал заказов: что лежит на полках, кто что заказал, кому выдали. Без журнала к вечеру никто не вспомнит, чей был торт.',
      ex: 'Рестораны и их меню, заказы со статусами, адреса покупателей, история заказов.',
      q: ['Какие данные храним и зачем нужно каждое поле?', 'Сколько храним и кто имеет доступ? Персональные данные — по 152-ФЗ.', 'Как связаны записи: покупатель → заказ → позиции заказа?'] },
    { id: 'ext', ic: '🔌', t: 'Интеграции', sub: 'связи с чужими системами',
      what: 'Связи с системами других компаний: банк, карты, SMS, бухгалтерия. У каждой свой API — свои правила, как к ней обращаться. Мы их не меняем, а подстраиваемся и договариваемся.',
      an: 'Договор с поставщиком муки: кто, что, когда и в каком виде привозит. Поставщик опоздал — у пекарни беда, хотя пекарня ни при чём.',
      ex: 'Банк списывает деньги, сервис карт строит маршрут курьеру, SMS-сервис присылает код входа.',
      q: ['Какие данные отдаём и получаем, в каком виде и когда?', 'Что делаем, если чужая система не отвечает?', 'Какие у неё ограничения: проверка перед подключением, лимиты, часы работы?'] }
  ];
  const IF_KINDS = [
    { v: 'ui', t: 'UI', name: 'Пользовательский интерфейс', who: 'человек ↔ программа', an: 'Прилавок и меню на доске: человек смотрит, выбирает, показывает пальцем.', ex: 'Экран банкомата: кнопки «Снять наличные», «Другая сумма».' },
    { v: 'api', t: 'API', name: 'Программный интерфейс', who: 'программа ↔ программа', an: 'Окошко выдачи с правилами: что можно попросить, в каком виде и что тебе ответят. Люди в окошко не заглядывают — общаются программы.', ex: 'Банкомат спрашивает у сервера банка: «На карте хватит 5 000 ₽?» — и получает ответ «да» или «нет».' },
    { v: 'hw', t: 'Аппаратный', name: 'Аппаратный интерфейс', who: 'программа ↔ устройство', an: 'Вилка и розетка: железки заранее договорились о форме разъёма и напряжении.', ex: 'Программа банкомата командует купюроприёмнику и принтеру чеков.' }
  ];
  const IF_GAME = [
    { id: 'g1', t: 'Вы выбираете сироп на сенсорном экране терминала в кофейне', ok: 'ui', why: 'Человек нажимает на экран — пользовательский интерфейс.' },
    { id: 'g2', t: 'Приложение такси спрашивает у сервиса карт, сколько ехать до адреса', ok: 'api', why: 'Одна программа спрашивает другую — людей в этом разговоре нет. Это API.' },
    { id: 'g3', t: 'Фитнес-браслет передаёт пульс в телефон по Bluetooth', ok: 'hw', why: 'Программа телефона получает данные от устройства — аппаратный интерфейс.' },
    { id: 'g4', t: 'Интернет-магазин передаёт службе доставки адрес и вес посылки', ok: 'api', why: 'Две программы разных компаний обмениваются данными по договорённым правилам — API.' },
    { id: 'g5', t: 'На сайте кинотеатра вы выбираете места на схеме зала', ok: 'ui', why: 'Схема зала — экран для человека.' },
    { id: 'g6', t: 'Весы на кассе магазина передают вес яблок в программу кассы', ok: 'hw', why: 'Устройство отдаёт программе данные через разъём — аппаратный интерфейс.' }
  ];

  const howParts = {
    id: 'how-parts', covers: ['parts', 'nina'], title: 'Как это работает: из чего сделана система', free: true, noReset: true,
    simple: {
      icon: '🧩',
      plain: 'То, что человек видит в телефоне, — только верхушка. Под ней спрятаны сервер с правилами, хранилище записей и связи с чужими системами. Всё вместе — система.',
      analogy: 'Покупатель видит витрину и кассу. Но за стеной — цех, где пекут по техкартам; склад и журнал заказов; договоры с поставщиком муки и бухгалтерией. Без цеха витрина пустая, сколько её ни украшай.',
      tech: '<b>Фронтенд</b> (клиентская часть, UI) — то, что работает у пользователя. <b>Бэкенд</b> (серверная часть) — бизнес-логика: правила, расчёты, статусы. <b>База данных</b> — хранение. <b>Интеграции</b> — обмен с внешними системами через их API. <b>Интерфейс</b> — граница, на которой встречаются две стороны: пользовательский (UI), программный (API), аппаратный.'
    },
    lead: ui.brief({
      situation: 'Соседний пример — сервис доставки еды, которым вы наверняка пользовались. Три вкладки: из чего он состоит по уровням, как выглядит в разрезе и где в нём «стыки» — интерфейсы. С «Колосом» будет то же самое, только вместо ресторанов — пекарни.',
      todo: [
        'Вкладка «Программа, приложение, система»: переключайте уровень и смотрите, какие плитки подсвечиваются.',
        'Вкладка «Что за стеной»: включите «Глазами покупателя», потом «Глазами аналитика». Нажмите на каждую из четырёх частей и прочитайте карточку под ними.',
        'Вкладка «Интерфейсы»: прочитайте три вида и сыграйте в «Какой это интерфейс?» — шесть примеров из жизни.'
      ],
      look: 'Подсвеченная плитка — входит в выбранный уровень. Заштрихованная часть — её не видит покупатель. Фиолетовая метка «?3» — сколько вопросов к этой части задаст аналитик.'
    }),
    render(el) {
      el.classList.add('sw-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'lv', t: 'Программа, приложение, система', render: fresh(drawLevels) },
        { id: 'arch', t: 'Что за стеной', render: fresh(drawArch) },
        { id: 'if', t: 'Интерфейсы', render: fresh(drawIf) }
      ], 'lv');
    }
  };
  function drawLevels(pane) {
    let lv = 'prog';
    pane.innerHTML = `<div class="stack">
      <div class="row"><span class="small dim">Уровень:</span>${ui.seg('lv', LEVELS, lv, 'accent')}</div>
      <div class="sw-tiles" data-tl></div>
      <div data-tx></div>
    </div>`;
    function draw() {
      TR.$('[data-tl]', pane).innerHTML = TILES.map(x => {
        const on = lv === 'sys' || x.lv.includes(lv);
        return `<div class="sw-tile ${on ? 'on' : 'off'}"><span class="k">${esc(x.k)}</span><span>${esc(x.t)}</span></div>`;
      }).join('');
      const tx = LEVEL_TXT[lv];
      TR.$('[data-tx]', pane).innerHTML = `<div class="stack tight"><p>${tx.plain}</p><p class="muted">${tx.an}</p></div>` +
        (lv === 'sys' ? ui.note('info', 'Что здесь важно аналитику', 'Заказчик обычно говорит «приложение», потому что видит только его. Аналитик проверяет, о какой части системы на самом деле речь: какие ещё экраны нужны, какие правила, что хранить, с кем обмениваться данными и кто из людей что делает. Если посчитать только приложение — сроки и смета окажутся неправдой.') : '');
    }
    ui.onSeg(pane, (n, v) => { if (n === 'lv') { lv = v; draw(); } });
    draw();
  }
  function drawArch(pane) {
    let lens = 'cust', sel = 'front';
    pane.innerHTML = `<div class="stack">
      <div class="row"><span class="small dim">Смотреть:</span>${ui.seg('lens', [{ v: 'cust', t: '👤 Глазами покупателя' }, { v: 'an', t: '🔎 Глазами аналитика' }], lens, 'accent')}</div>
      <div class="sw-arch" data-ar></div>
      <div class="sw-wire"><span>📱 телефон</span><span>⇄ интернет ⇄</span><span>⚙️ сервер</span><span>⇄ 🗄️ база</span><span>⚙️ сервер ⇄ 🔌 чужие системы</span></div>
      <div data-card></div>
    </div>`;
    function draw() {
      TR.$('[data-ar]', pane).innerHTML = PARTS_T.map(p => {
        const hid = lens === 'cust' && p.id !== 'front';
        return `<button type="button" class="sw-part ${hid ? 'hid' : ''}" data-part="${p.id}" aria-pressed="${sel === p.id}">${lens === 'an' ? `<span class="qn">?${p.q.length}</span>` : ''}<span class="ic" aria-hidden="true">${p.ic}</span><b>${esc(p.t)}</b><small>${esc(p.sub)}</small></button>`;
      }).join('');
      const p = PARTS_T.find(x => x.id === sel);
      const card = TR.$('[data-card]', pane);
      if (lens === 'cust' && sel !== 'front') {
        card.innerHTML = ui.note('warn', 'Покупатель этого не видит', `«${esc(p.t)}» — за стеной. Покупатель узнаёт о нём, только когда что-то идёт не так: «заказ не оформился», «оплата не прошла», «курьер не назначен». Переключитесь на «Глазами аналитика», чтобы заглянуть внутрь.`);
        return;
      }
      card.innerHTML = `<div class="card flat"><h4>${p.ic} ${esc(p.t)}</h4><div class="sw-def">
        <span class="k">Что это</span><div class="v">${p.what}</div>
        <span class="k">В пекарне</span><div class="v">${p.an}</div>
        <span class="k">В доставке еды</span><div class="v">${p.ex}</div>
        ${lens === 'an' ? `<span class="k">Спросит аналитик</span><div class="v"><ul>${p.q.map(q => `<li>${q}</li>`).join('')}</ul></div>` : `<span class="k">Покупатель видит</span><div class="v">Только эту часть. Для него «приложение» и есть весь сервис.</div>`}
      </div></div>`;
    }
    ui.onSeg(pane, (n, v) => { if (n === 'lens') { lens = v; draw(); } });
    TR.on(pane, 'click', '[data-part]', (e, b) => { sel = b.dataset.part; draw(); });
    draw();
  }
  function drawIf(pane) {
    const got = {};
    pane.innerHTML = `<div class="stack">
      <p class="muted small">Интерфейс — место, где встречаются две стороны и договариваются, как общаться. Соседний пример — банкомат: у него есть все три вида.</p>
      <div class="sw-if">${IF_KINDS.map(k => `<div class="card"><span class="chip info tag">${esc(k.t)}</span><b>${esc(k.name)}</b><span class="small dim">${esc(k.who)}</span><span class="small">${k.an}</span><span class="small muted">Банкомат: ${k.ex}</span></div>`).join('')}</div>
      <div class="eyebrow">Игра «Какой это интерфейс?»</div>
      <div class="sw-game" data-g></div>
      <div data-gs></div>
    </div>`;
    function draw() {
      TR.$('[data-g]', pane).innerHTML = IF_GAME.map(g => {
        const a = got[g.id], st = a ? (a === g.ok ? 'ok' : 'bad') : '';
        return `<div class="sw-gq ${st}"><span>${esc(g.t)}</span><div class="row">${IF_KINDS.map(k => `<button type="button" class="btn xs" data-gi="${g.id}|${k.v}" aria-pressed="${a === k.v}">${esc(k.t)}</button>`).join('')}</div>${a ? `<div class="why">${a === g.ok ? '✓ ' : '✕ Не совсем. '}${g.why}</div>` : ''}</div>`;
      }).join('');
      const n = Object.keys(got).length, ok = IF_GAME.filter(g => got[g.id] === g.ok).length;
      TR.$('[data-gs]', pane).innerHTML = n === IF_GAME.length ? ui.note(ok === n ? 'ok' : 'warn', `Верно ${ok} из ${n}`, 'Подсказка на будущее: спросите себя, <b>кто с кем</b> встречается. Человек с экраном — UI. Программа с программой — API. Программа с железкой — аппаратный интерфейс. Аналитик описывает все три: экраны, обмен данными и устройства, которые должны работать вместе.') : '';
    }
    TR.on(pane, 'click', '[data-gi]', (e, b) => { const [id, v] = b.dataset.gi.split('|'); got[id] = v; draw(); });
    draw();
  }

  // =====================================================================
  // Теория 2. Клиент, сервер и один запрос (соседний пример — «сколько круассанов осталось?»)
  // =====================================================================
  const REQ_LANES = [L('who', 'Покупатель', 'человек'), L('app', 'Приложение', 'клиент, в телефоне'), L('be', 'Бэкенд', 'сервер «Колос-заказы»'), L('db', 'База данных', 'остатки, товары')];
  const REQ_STEPS = [
    { from: 'who', to: 'app', t: 'открыть «Покровка»', note: 'Покупатель открывает в приложении страницу пекарни на Покровке. Человек нажимает на экран — это пользовательский интерфейс (UI).' },
    { from: 'app', to: 'be', t: 'запрос: остатки\nна Покровке?', note: 'Само приложение остатков не знает. Оно — <b>клиент</b>: отправляет запрос на <b>сервер</b> через интернет. Запрос — короткое сообщение по договорённому формату. Договорённость о таких сообщениях и есть программный интерфейс — <b>API</b>.' },
    { from: 'be', to: 'be', t: 'проверить: что\nможно показать', note: 'Бэкенд решает, что отдать: только эту пекарню, только товары в продаже, без закупочных цен. Правила живут здесь, а не в телефоне.' },
    { from: 'be', to: 'db', t: 'найти остатки', note: 'Бэкенд спрашивает у базы данных записи об остатках этой пекарни. В базу ходит только он.' },
    { from: 'db', to: 'be', t: 'круассан 14,\nбородинский 6', reply: true, kind: 'ok', note: 'База возвращает записи. Пунктир — это ответ.' },
    { from: 'be', to: 'app', t: 'ответ: список', reply: true, kind: 'ok', note: 'Сервер отправляет приложению ответ — тоже по договорённому формату API.' },
    { from: 'app', to: 'app', t: 'нарисовать карточки', note: 'Фронтенд превращает сухой список в картинку: карточки товаров, фото, «осталось 14».' },
    { from: 'app', to: 'who', t: '«Круассан —\nосталось 14»', reply: true, kind: 'accent', note: 'Покупатель видит результат. Из восьми шагов он видел два — первый и последний. Всё между ними — «за стеной».' }
  ];
  const RULE_IN = [
    { id: 'new', t: 'Приложение, свежая версия', front: 'ok', fwhy: 'Проверку 48 часов написали в новой версии: дата «завтра» неактивна.' },
    { id: 'old', t: 'Приложение, которое не обновляли полгода', front: 'bad', fwhy: 'В старой версии этой проверки ещё не было — заказ ушёл.' },
    { id: 'site', t: 'Сайт', front: 'bad', fwhy: 'Сайт — другой фронтенд. Проверку там написать забыли.' },
    { id: 'cash', t: 'Экран кассира: заказ по телефону', front: 'bad', fwhy: 'На экране кассира проверки нет — «а вдруг клиенту очень надо».' }
  ];
  const BRK_OPTS = [{ v: 'none', t: 'всё работает' }, { v: 'net', t: 'у покупателя пропал интернет' }, { v: 'db', t: 'база не отвечает' }];
  const HOW_OPTS = [{ v: 'raw', t: 'как получилось само' }, { v: 'spec', t: 'как описал аналитик' }];

  const howRequest = {
    id: 'how-request', covers: ['path', 'break'], title: 'Как это работает: клиент, сервер и путь запроса', free: true, noReset: true,
    simple: {
      icon: '🛎️',
      plain: 'Телефон сам ничего не решает и не хранит. Он спрашивает сервер, сервер проверяет правила, заглядывает в базу и отвечает. Телефон только красиво показывает ответ.',
      analogy: 'Покупатель спрашивает у кассира: «Круассаны остались?» Кассир не знает — кричит в цех. Цех смотрит в журнал и отвечает. Кассир передаёт ответ. Покупатель слышал только вопрос и ответ — разговор кассира с цехом прошёл мимо него.',
      tech: '<b>Клиент–сервер</b>: клиент (приложение, сайт, экран кассира) отправляет <b>запрос</b>, сервер (бэкенд) выполняет бизнес-логику, работает с базой данных и возвращает <b>ответ</b>. Формат запросов и ответов задаёт <b>API</b>. Правила проверяет сервер — один раз для всех клиентов.'
    },
    lead: ui.brief({
      situation: 'Соседний пример — не заказ, а простой вопрос: «сколько круассанов осталось на Покровке?». Покупатель открывает пекарню в приложении «Колоса» и видит остатки. Три вкладки: путь запроса по шагам, где должно жить правило и что видит человек, когда одна из частей молчит.',
      todo: [
        'Вкладка «Один запрос»: нажимайте «Шаг →» и читайте пояснение под схемой. Посчитайте, сколько шагов видел покупатель.',
        'Вкладка «Где живёт правило»: переключите, кто проверяет правило «торт — минимум за 48 часов». Сравните, через какие входы проскакивает торт «на завтра».',
        'Вкладка «Когда часть молчит»: «уроните» интернет или базу и сравните, что видит покупатель, если ошибку никто не описал, и если описал аналитик.'
      ],
      look: 'На схеме колонки — участники, стрелка — запрос, пунктир — ответ, стрелка в ту же колонку — действие внутри участника. В телефоне рядом со схемой — ровно то, что увидит покупатель.'
    }),
    render(el) {
      el.classList.add('sw-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'one', t: 'Один запрос', render: fresh(pane => walk(pane, { laneW: 170, scenarios: [{ id: 'one', t: 'Сколько круассанов осталось', lanes: REQ_LANES, steps: REQ_STEPS, sumKind: 'info', sum: 'Это и есть <b>клиент–сервер</b>: клиент спрашивает, сервер решает и отвечает. Ни телефон, ни человек не лезут в базу напрямую. Фронтенд — шаги 1, 2 и 7–8, бэкенд — 3–6. Покупатель видит только первый и последний шаг — а аналитик описывает все.' }] })) },
        { id: 'rule', t: 'Где живёт правило', render: fresh(drawRule) },
        { id: 'fail', t: 'Когда часть молчит', render: fresh(drawFail) }
      ], 'one');
    }
  };
  function drawRule(pane) {
    let where = 'front';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Правило «Колоса»: <b>торт принимается минимум за 48 часов</b>, иначе цех не успеет. Сейчас понедельник, 12:00. Четыре человека пытаются заказать торт на завтра, на вторник 12:00, — через разные входы.</p>
      <div class="row"><span class="small dim">Правило проверяет:</span>${ui.seg('where', [{ v: 'front', t: 'только фронтенд (каждый экран сам)' }, { v: 'back', t: 'бэкенд (сервер, один для всех)' }], where, 'accent')}</div>
      <div class="sw-rows" data-rows></div>
      <div data-rn></div>
    </div>`;
    function draw() {
      let passed = 0;
      TR.$('[data-rows]', pane).innerHTML = RULE_IN.map(r => {
        const st = where === 'back' ? 'ok' : r.front;
        if (st === 'bad') passed++;
        const why = where === 'back' ? 'Экран отправил заказ на сервер, сервер проверил 48 часов и ответил: «Торт можно заказать не раньше чем за 48 часов».' : r.fwhy;
        return `<div class="sw-rule ${st}"><b>${esc(r.t)}</b>${st === 'ok' ? ui.status('не принят — верно', 'ok') : ui.status('торт проскочил', 'bad')}<span class="s">${why}</span></div>`;
      }).join('');
      TR.$('[data-rn]', pane).innerHTML = where === 'front'
        ? ui.note('bad', `Проскочило ${passed} из 4`, 'Каждый экран — отдельная программа. Правило, написанное в одном экране, не действует в другом. Галина Ивановна утром найдёт три торта «на завтра», которые цех не успевает испечь.')
        : ui.note('ok', 'Ни одного', 'Все входы спрашивают один и тот же сервер — правило работает для всех сразу, даже для экрана, который появится через год. Фронтенд может <i>дополнительно</i> сделать неподходящие даты серыми — для удобства, но не вместо сервера.') +
          ui.note('info', 'Что здесь важно аналитику', 'Правило — свойство системы, а не кнопки. В требованиях пишут: «Система не принимает заказ торта раньше чем за 48 часов до выдачи», — а не «кнопка серая». Тогда разработчики проверят его на сервере, а тестировщица Лера проверит все входы.');
    }
    ui.onSeg(pane, (n, v) => { if (n === 'where') { where = v; draw(); } });
    draw();
  }
  function phoneList(kind) {
    const items = [['Круассан', 14], ['Бородинский', 6], ['Багет', 9]];
    if (kind === 'list') return items.map(([n, k]) => `<div class="it"><span>${n}</span><b>осталось ${k}</b></div>`).join('');
    if (kind === 'zero') return items.map(([n]) => `<div class="it zero"><span>${n}</span><b>осталось 0</b></div>`).join('');
    return '';
  }
  function drawFail(pane) {
    const st = { brk: 'none', how: 'raw' };
    pane.innerHTML = `<div class="stack">
      <div class="stack tight"><div class="row"><span class="small dim">Что сломалось:</span>${ui.seg('brk', BRK_OPTS, st.brk, 'accent')}</div>
      <div class="row"><span class="small dim">Приложение сделано:</span>${ui.seg('how', HOW_OPTS, st.how)}</div></div>
      <div class="sw-lab"><div class="sw-phone" data-ph></div><div class="stack" data-fx></div></div>
    </div>`;
    function draw() {
      let body, side;
      if (st.brk === 'none') {
        body = phoneList('list');
        side = ui.note('ok', 'Всё работает', 'Запрос дошёл до сервера, сервер — до базы, ответ вернулся. Покупатель видит остатки. Выберите поломку.');
      } else if (st.brk === 'net') {
        body = st.how === 'raw' ? '<div class="spin"><i></i>Загрузка…</div>' : '<div class="msg warn">Нет связи с интернетом. Проверьте подключение и нажмите «Повторить».</div><button type="button" class="btn sm" tabindex="-1">Повторить</button>';
        side = (st.how === 'raw'
          ? ui.note('bad', 'Как получилось само: вечная загрузка', 'Запрос не ушёл дальше телефона. Никто не написал, что делать в этом случае, — приложение просто крутит значок. Покупатель ждёт, тыкает, закрывает приложение.')
          : ui.note('ok', 'Как описал аналитик', 'Приложение знает, что связи нет, — и говорит это прямо. Человек понимает, что дело в его телефоне, а не в пекарне, и что делать дальше.'));
      } else {
        body = st.how === 'raw' ? phoneList('zero') : '<div class="msg bad">Не получилось загрузить остатки. Обновите через минуту.</div><button type="button" class="btn sm" tabindex="-1">Обновить</button>';
        side = (st.how === 'raw'
          ? ui.note('bad', 'Как получилось само: «осталось 0»', 'Сервер не дождался базы и вернул пустой список. Приложение нарисовало нули. Покупатель уверен, что круассаны раскупили, и идёт к конкурентам — хотя на витрине их 14. Это хуже честной ошибки.')
          : ui.note('ok', 'Как описал аналитик', 'Пустой ответ из-за ошибки и «товар закончился» — разные состояния, и показывать их надо по-разному. Человек знает: дело не в круассанах, надо обновить.'));
      }
      TR.$('[data-ph]', pane).innerHTML = `<div class="bar"></div><div class="hd">Колос · Покровка</div>${body}`;
      TR.$('[data-fx]', pane).innerHTML = side + (st.brk !== 'none' ? ui.note('info', 'Что здесь важно аналитику', 'Разработчик сам не решит, что сказать покупателю при сбое: это вопрос не кода, а бизнеса. Поэтому для каждого экрана аналитик описывает не только «как должно быть», но и состояния «пусто», «загрузка», «ошибка», «нет связи» — и текст, который увидит человек.') : '');
    }
    ui.onSeg(pane, (n, v) => { if (n === 'brk' || n === 'how') { st[n] = v; draw(); } });
    draw();
  }

  // =====================================================================
  // Практика 1. Разложите будущую систему «Колоса» по частям
  // =====================================================================
  const PB = [
    { id: 'ui', t: 'Экран для человека (UI)', sub: 'фронтенд: что видят и нажимают' },
    { id: 'be', t: 'Бэкенд', sub: 'правила и расчёты за стеной' },
    { id: 'db', t: 'База данных', sub: 'что надо помнить' },
    { id: 'int', t: 'Интеграция', sub: 'чужая система, через её API' },
    { id: 'hw', t: 'Аппаратный интерфейс', sub: 'устройство, «железо»' }
  ];
  const HINT = {
    ui: 'Это то, что человек видит и нажимает, или то, что происходит после нажатия?',
    be: 'Это надо помнить — или это действие, решение, расчёт? И кто должен делать его одинаково для приложения, сайта и кассира?',
    db: 'Это действие — или то, что системе надо помнить и завтра, и через месяц?',
    int: 'Чья это система — «Колоса» или другой компании? Можем ли мы поменять, как она работает?',
    hw: 'Это программа — или устройство, которое можно потрогать руками?'
  };
  const PARTS = [
    { id: 'p-btn', t: 'Кнопка «Заказать» и корзина в приложении покупателя', ok: 'ui' },
    { id: 'p-cash', t: 'Экран кассира на планшете: заказы к выдаче', ok: 'ui' },
    { id: 'p-shop', t: 'Экран цеха: торт с фото-образцом и надписью', ok: 'ui', alt: { db: 'Фото и надпись действительно хранятся в базе. Но здесь речь об экране, на который смотрит кондитер, — где он видит торт?' } },
    { id: 'p-cutoff', t: 'Правило: заказ на завтра принимается до 22:30', ok: 'be' },
    { id: 'p-hold', t: 'Правило: неоплаченный заказ держим 30 минут после конца интервала, потом выпечка уходит в продажу', ok: 'be' },
    { id: 'p-plan', t: 'Сложить предзаказы всех пекарен и добавить их к плану выпечки к 23:00', ok: 'be', alt: { db: 'Готовый план, конечно, хранится в базе. Но «сложить и добавить» — это расчёт. Кто его делает?' } },
    { id: 'p-orders', t: 'Все заказы с их статусами: «Создан», «Оплачен», «Выдан»', ok: 'db' },
    { id: 'p-client', t: 'Телефон, имя и день рождения покупателя', ok: 'db' },
    { id: 'p-cat', t: 'Каталог: около 120 позиций с ценами и фото', ok: 'db' },
    { id: 'p-kassa', t: 'Пробить чек «предоплата» в облачной кассе «КассаПро»', ok: 'int', alt: { hw: 'Принтер чеков — железо у кассы. Но «КассаПро» — облачный сервис другой компании: мы обращаемся к нему через их API. Это интеграция.' } },
    { id: 'p-1c', t: 'Отправить сводку продаж за день в 1С к 09:00', ok: 'int', alt: { be: 'Собрать сводку — работа бэкенда, верно. Но доставить её в 1С — чужую систему со своими правилами — это интеграция.' } },
    { id: 'p-pay', t: 'Списать деньги с карты через платёжный шлюз «ПэйМост»', ok: 'int' },
    { id: 'p-printer', t: 'Принтер чеков у кассы', ok: 'hw' },
    { id: 'p-scan', t: 'Сканер штрихкодов у кассы', ok: 'hw' }
  ];
  function partsEval(v) {
    v = v || {};
    return PARTS.map(p => {
      const got = v[p.id];
      if (got === p.ok) return { p, s: 'ok', pts: 1 };
      if (p.alt && p.alt[got]) return { p, s: 'warn', pts: 0.5, why: p.alt[got] };
      return { p, s: 'bad', pts: 0, empty: !got };
    });
  }
  const partsTask = {
    id: 'parts', title: 'Разложите будущую систему «Колоса» по частям',
    simple: howParts.simple,
    lead: ui.brief({
      situation: 'Игорь прислал первые наброски Нины Сергеевны и черновой список того, что будет в системе предзаказа «Колоса». Дима просит: «Разложи по частям — я хоть пойму, кому из ребят что достанется: фронтендеру, бэкендеру или тому, кто делает интеграции».',
      todo: [
        'Разложите 14 карточек по пяти корзинам: нажмите карточку, потом корзину (на компьютере можно перетаскивать).',
        'Для каждой спросите себя: человек это видит? это правило или расчёт? это надо помнить? это чужая система? это устройство?',
        'Нажмите «Проверить». Засчитывается от 80 %. Некоторые карточки допускают второй ответ — он засчитывается наполовину, с пояснением.'
      ],
      lookTitle: 'Подсказка',
      look: 'Экран — то, что видит человек. Бэкенд — глагол: проверить, посчитать, сложить, снять. База — существительное: что хранится. Интеграция — чужая компания. Аппаратный интерфейс — то, что стоит на прилавке.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(PARTS.map(p => [p.id, p.ok])) }),
    render(el, ctx) {
      el.classList.add('sw-root');
      let reveal = null;
      if (ctx.result) { reveal = {}; partsEval(ctx.ans.v).forEach(x => { reveal[x.p.id] = x.s; }); }
      const box = document.createElement('div'); el.appendChild(box);
      ui.sort(box, {
        items: PARTS.map(p => ({ id: p.id, t: p.t })), buckets: PB, value: ctx.ans.v || {}, reveal, readonly: ctx.readonly, seed: 'sw-parts',
        onChange: v => { ctx.ans.v = v; ctx.save(); }
      });
    },
    check(ans) {
      const ev = partsEval(ans && ans.v), pts = ev.reduce((s, x) => s + x.pts, 0), score = pts / PARTS.length;
      const notes = [];
      ev.forEach(x => {
        if (x.s === 'warn') notes.push({ ok: 'warn', html: `«${esc(x.p.t)}» — ${x.why}` });
        else if (x.s === 'bad') notes.push({ ok: false, html: `«${esc(x.p.t)}» — ${x.empty ? 'не разложено. ' : ''}${HINT[x.p.ok]}` });
      });
      const good = ev.filter(x => x.s === 'ok').length;
      if (!notes.length) notes.push({ ok: true, html: 'Все четырнадцать — на своих местах.' });
      const beBad = ev.filter(x => x.p.ok === 'be' && x.s === 'bad').length;
      return {
        ok: score >= 0.8, score, notes,
        summary: `Точно: ${good} из ${PARTS.length}, допустимо: ${ev.filter(x => x.s === 'warn').length}.`,
        mentor: score >= 0.8 ? null : beBad ? 'Правила «Колоса» — 22:30, 30 минут, план к 23:00 — нигде не видны глазами, но решают всё. Вспомните вкладку «Где живёт правило»: кто проверяет их для всех входов сразу?' : 'Сначала разделите карточки на «видно глазами», «надо помнить», «надо сделать» и «чужое». Потом уже уточняйте.'
      };
    },
    explain: `<p>Части системы «Колоса» — те же, что у любого сервиса:</p>
      <ul class="checks">
        <li><b>Экраны (UI)</b> — приложение покупателя, экран кассира, экран цеха. Три фронтенда для трёх разных людей — каждый со своими задачами.</li>
        <li><b>Бэкенд</b> — правила 22:30 и 30 минут, сложение предзаказов в план выпечки. Правило живёт на сервере, чтобы действовать одинаково для приложения, сайта и кассира.</li>
        <li><b>База данных</b> — заказы со статусами, покупатели, каталог. То, что надо помнить завтра и через месяц.</li>
        <li><b>Интеграции</b> — «КассаПро» (чеки по 54-ФЗ), 1С (сводка для Олега Петровича), «ПэйМост» (оплата). Это чужие системы: у каждой свой API и свои правила. У «КассаПро» ещё и проверка подключения — 3 недели.</li>
        <li><b>Аппаратный интерфейс</b> — принтер чеков и сканер на кассе.</li>
      </ul>
      <p>Зачем это аналитику: у каждой части свои вопросы. К экранам — что видит человек и что при ошибке. К бэкенду — какие правила и статусы. К базе — что храним и сколько (152-ФЗ). К интеграциям — что отдаём, когда и что делать, если они молчат. Если пропустить часть, пропустите и её требования.</p>`,
    report: ans => partsEval(ans && ans.v).map(x => `- ${x.p.t} → ${(PB.find(b => b.id === (ans.v || {})[x.p.id]) || { t: '—' }).t} ${x.s === 'ok' ? '✓' : x.s === 'warn' ? '≈' : '✗'}`).join('\n')
  };

  // =====================================================================
  // Практика 2. Путь одного нажатия «Заказать»
  // =====================================================================
  const PATH = [
    { id: 'tap', t: 'Покупатель нажимает «Заказать»: приложение собирает корзину, пекарню и интервал выдачи' },
    { id: 'send', t: 'Приложение отправляет запрос через интернет на сервер «Колос-заказы»' },
    { id: 'rules', t: 'Бэкенд проверяет правила: приём заказов на завтра ещё открыт, интервал 08:00–08:30 есть' },
    { id: 'save', t: 'Бэкенд записывает заказ в базу данных со статусом «Создан»' },
    { id: 'pay', t: 'Бэкенд просит «ПэйМост» списать 420 ₽ с карты — «ПэйМост» отвечает: оплачено' },
    { id: 'paid', t: 'Бэкенд меняет статус заказа в базе на «Оплачен»' },
    { id: 'check', t: 'Бэкенд отправляет в «КассаПро» чек «предоплата» по 54-ФЗ' },
    { id: 'reply', t: 'Приложение получает ответ и показывает: «Заказ принят, ждём вас завтра с 08:00 до 08:30»' },
    { id: 'plan', t: 'В 23:00 заказ попадает в план выпечки на экране цеха' }
  ];
  const PATH_REF = PATH.map(p => p.id);
  const PATH_ALT = ['tap', 'send', 'rules', 'save', 'pay', 'paid', 'reply', 'check', 'plan'];
  const PATH_RULES = [
    { a: 'tap', b: 'send', html: 'Запрос ушёл на сервер раньше, чем покупатель нажал кнопку. Что именно приложение отправило бы?' },
    { a: 'send', b: 'rules', html: 'Бэкенд проверяет правила — но как он узнал о заказе, если приложение ещё ничего не отправило?' },
    { a: 'rules', b: 'save', html: 'Заказ уже записан, а правила проверяются потом. Что делать с записью, если приём на завтра закрыт?' },
    { a: 'save', b: 'pay', html: 'Деньги списаны, а заказа в базе ещё нет. Что будет с деньгами покупателя, если запись в этот момент не удастся?' },
    { a: 'pay', b: 'paid', html: 'Статус «Оплачен» поставлен до того, как «ПэйМост» подтвердил оплату. А если карта отклонена?' },
    { a: 'pay', b: 'check', html: 'Чек «предоплата» пробит — а за какие деньги, если оплата ещё не прошла?' },
    { a: 'pay', b: 'reply', html: 'Приложение пишет «Заказ принят», а оплата ещё не прошла. Что, если карта отклонена?' },
    { a: 'reply', b: 'plan', html: 'План выпечки собирается в 23:00 — для всех заказов разом. Может ли это случиться раньше, чем покупатель увидел «Заказ принят»?' }
  ];
  const ORDER_LANES = [L('app', 'Приложение', 'телефон'), L('be', 'Бэкенд', '«Колос-заказы»'), L('db', 'База данных'), L('pay', '«ПэйМост»', 'оплата'), L('kassa', '«КассаПро»', 'чеки'), L('shop', 'Экран цеха', 'план выпечки')];
  const ORDER_STEPS = [
    { from: 'app', to: 'app', t: 'нажали «Заказать»', note: 'Фронтенд собирает всё, что выбрал покупатель: Покровка, завтра 08:00–08:30, корзина на 420 ₽.' },
    { from: 'app', to: 'be', t: 'заказ: Покровка,\n08:00–08:30, 420 ₽', note: 'Запрос уходит через интернет на сервер. Дальше покупатель ничего не видит — только крутится значок.' },
    { from: 'be', to: 'be', t: 'правила: до 22:30?\nинтервал есть?', note: 'Бэкенд проверяет правила «Колоса». Если приём на завтра закрыт — сразу ответ с объяснением, без записи и без оплаты.' },
    { from: 'be', to: 'db', t: 'записать заказ:\n«Создан»', note: 'Заказ записан в базу. Теперь он не потеряется, даже если дальше что-то пойдёт не так.' },
    { from: 'be', to: 'pay', t: 'списать 420 ₽', note: 'Бэкенд обращается к чужой системе — платёжному шлюзу «ПэйМост» — через его API.' },
    { from: 'pay', to: 'be', t: 'оплачено', reply: true, kind: 'ok', note: '«ПэйМост» подтвердил оплату.' },
    { from: 'be', to: 'db', t: 'статус «Оплачен»', note: 'Только после подтверждения оплаты статус меняется на «Оплачен».' },
    { from: 'be', to: 'kassa', t: 'чек «предоплата»', note: 'По 54-ФЗ при предоплате пробивается чек «предоплата». Его пробивает облачная касса «КассаПро» — тоже интеграция.' },
    { from: 'kassa', to: 'be', t: 'чек пробит', reply: true, kind: 'ok', note: '«КассаПро» подтвердила чек. (Этот шаг и ответ покупателю можно поменять местами: чек иногда досылают сразу после ответа.)' },
    { from: 'be', to: 'app', t: 'заказ принят', reply: true, kind: 'accent', note: 'Покупатель видит «Заказ принят». Из одиннадцати шагов он видел первый и этот.' },
    { from: 'be', to: 'shop', t: '23:00: в план выпечки', kind: 'info', note: 'Вечером бэкенд складывает все предзаказы и добавляет их к плану выпечки — Галина Ивановна видит их на экране цеха.' }
  ];
  function pathBest(v) {
    v = v || [];
    const a = ui.orderScore(v, PATH_REF), b = ui.orderScore(v, PATH_ALT);
    return a >= b ? { score: a, ref: PATH_REF } : { score: b, ref: PATH_ALT };
  }
  const pathTask = {
    id: 'path', title: 'Путь одного нажатия «Заказать»',
    simple: howRequest.simple,
    lead: ui.brief({
      situation: 'Вечер понедельника, 21:40. Покупатель в приложении «Колоса» собрал корзину на 420 ₽ — круассаны на завтра, на Покровку, интервал 08:00–08:30 — и нажимает «Заказать» с оплатой картой. Дима: «Если аналитик не понимает, что происходит после нажатия, он не опишет, что делать, когда что-то сломается. Разложи по порядку».',
      todo: [
        'Расставьте девять шагов в том порядке, в котором они происходят: стрелки ↑ ↓ справа (на компьютере можно перетаскивать).',
        'Для каждой пары соседних шагов спросите себя: может ли второй случиться, пока не случился первый?',
        'Нажмите «Проверить». Засчитывается от 85 %, и без «опасных» перестановок — когда деньги, чек или статус идут впереди того, от чего они зависят. Когда всё верно, появится схема — проиграйте её.'
      ],
      look: 'Номер слева — позиция шага. После проверки зелёная рамка — шаг на своём месте, красная — не на своём. Порядок «чек → ответ покупателю» и «ответ → чек» засчитываются оба.'
    }),
    blank: () => ({ v: [] }),
    reference: () => ({ v: PATH_REF.slice() }),
    render(el, ctx) {
      el.classList.add('sw-root');
      let reveal = null;
      if (ctx.result) { const best = pathBest(ctx.ans.v); reveal = {}; (ctx.ans.v || []).forEach((id, i) => { reveal[id] = best.ref[i] === id ? 'ok' : 'bad'; }); }
      const box = document.createElement('div'); el.appendChild(box);
      ui.order(box, { items: PATH, value: ctx.ans.v, reveal, readonly: ctx.readonly, seed: 'sw-path-2', onChange: v => { ctx.ans.v = v; ctx.save(); } });
      if (ctx.readonly || (ctx.result && ctx.result.ok)) {
        const h = document.createElement('div'); h.style.marginTop = '14px'; el.appendChild(h);
        h.innerHTML = '<div class="eyebrow" style="margin-bottom:8px">Тот же путь на схеме — проиграйте</div><div data-seqbox></div>';
        ui.seq(TR.$('[data-seqbox]', h), { lanes: ORDER_LANES, steps: ORDER_STEPS, laneW: 146, title: 'Путь нажатия «Заказать»', hint: 'Нажмите «Проиграть» или «Шаг →». Покупатель видит только первый шаг и «заказ принят».' });
      }
    },
    check(ans) {
      const v = (ans && ans.v) || [];
      const best = pathBest(v), notes = [];
      const pos = id => v.indexOf(id);
      const broken = v.length === PATH.length ? PATH_RULES.filter(r => !(pos(r.a) < pos(r.b))) : [];
      const crit = broken.filter(r => ['rules|save', 'save|pay', 'pay|paid', 'pay|check', 'pay|reply'].includes(r.a + '|' + r.b));
      broken.forEach(r => notes.push({ ok: false, html: r.html }));
      if (v.length !== PATH.length) notes.push({ ok: false, html: 'Шаги ещё не расставлены — подвиньте хотя бы один, чтобы список сохранился.' });
      if (!notes.length && best.score < 1) notes.push({ ok: 'warn', html: 'Опасных перестановок нет, но пара шагов стоит не на своём месте. Проверьте, что раньше: запрос или проверка правил? запись или оплата?' });
      if (!notes.length) notes.push({ ok: true, html: 'Все девять шагов — по порядку.' });
      const score = v.length === PATH.length ? best.score : 0;
      return {
        ok: score >= 0.85 && !crit.length, score, notes,
        summary: `Порядок совпал на ${Math.round(score * 100)} %${crit.length ? `, опасных перестановок: ${crit.length}` : ''}.`,
        mentor: crit.some(r => r.a === 'pay' || r.b === 'pay') ? 'Спросите про деньги: в какой момент они списываются — и что уже должно быть сделано к этому моменту, чтобы покупатель не остался без денег и без заказа?' : crit.length ? 'Что проще: сразу отказать, если правило нарушено, или сначала записать заказ, а потом думать, что с ним делать?' : null
      };
    },
    explain: `<p>Путь одного нажатия: <b>приложение → запрос → правила → запись «Создан» → оплата → «Оплачен» → чек → ответ покупателю</b>, а вечером — план выпечки.</p>
      <ul class="checks">
        <li><b>Правила — до записи.</b> Нарушил правило — сразу понятный ответ, без мусора в базе.</li>
        <li><b>Запись — до оплаты.</b> Если сначала списать деньги, а запись не удастся, у покупателя не будет ни денег, ни заказа. Запись «Создан» — страховка: даже при сбое мы знаем, что человек пытался заказать.</li>
        <li><b>«Оплачен» и чек — только после подтверждения оплаты.</b> Иначе «Колос» печёт и пробивает чеки за то, чего не получил.</li>
        <li><b>План выпечки</b> собирается в 23:00 для всех заказов сразу — это отдельный шаг, не связанный с конкретным нажатием.</li>
      </ul>
      <p>Покупатель из всего пути видит два шага: «Заказать» и «Заказ принят». Описывать аналитику — все. Именно в промежутке прячутся вопросы «а что, если…», о которых пойдёт речь в следующем задании.</p>`,
    report: ans => ((ans && ans.v) || []).map((id, i) => `${i + 1}. ${(PATH.find(p => p.id === id) || { t: id }).t}`).join('\n') || '—'
  };

  // =====================================================================
  // Практика 3. Лаборатория «Сломайте одну часть»
  // =====================================================================
  const LAB_LANES = [L('app', 'Приложение', 'телефон покупателя'), L('be', 'Бэкенд', '«Колос-заказы»'), L('db', 'База данных'), L('pay', '«ПэйМост»', 'оплата'), L('kassa', '«КассаПро»', 'чеки'), L('cash', 'Экран кассира', 'Покровка')];
  const S = {
    tap: { from: 'app', to: 'app', t: 'нажали «Заказать»', note: 'Покупатель нажал «Заказать». Корзина на 420 ₽, Покровка, завтра 08:00–08:30.' },
    send: { from: 'app', to: 'be', t: 'заказ', note: 'Запрос ушёл на сервер.' },
    rules: { from: 'be', to: 'be', t: 'правила: ок', note: 'Правила соблюдены.' },
    save: { from: 'be', to: 'db', t: 'записать «Создан»', note: 'Заказ записан в базу.' },
    pay: { from: 'be', to: 'pay', t: 'списать 420 ₽', note: 'Бэкенд просит «ПэйМост» списать деньги.' },
    payOk: { from: 'pay', to: 'be', t: 'оплачено', reply: true, kind: 'ok', note: '«ПэйМост»: оплачено.' },
    paid: { from: 'be', to: 'db', t: '«Оплачен»', note: 'Статус — «Оплачен».' },
    check: { from: 'be', to: 'kassa', t: 'чек «предоплата»', note: 'Чек уходит в «КассаПро».' },
    checkOk: { from: 'kassa', to: 'be', t: 'пробит', reply: true, kind: 'ok', note: 'Чек пробит.' },
    reply: { from: 'be', to: 'app', t: 'ответ', reply: true, kind: 'accent', note: 'Приложение получило ответ сервера.' },
    cash: { from: 'be', to: 'cash', t: 'новый заказ\nв списке выдачи', kind: 'info', note: 'Заказ появился в списке выдачи на экране кассира на Покровке.' }
  };
  const step = (k, over) => Object.assign({}, S[k], over || {});
  const LAB_SC = [
    { v: 'ok', t: 'Всё работает', steps: [step('tap'), step('send'), step('rules'), step('save'), step('pay'), step('payOk'), step('paid'), step('check'), step('checkOk'), step('reply', { t: 'заказ принят' }), step('cash')],
      state: { order: ['ok', '«Оплачен»'], money: ['ok', 'списано 420 ₽'], check: ['ok', 'пробит'], cash: ['ok', 'видит заказ'] } },
    { v: 'net', t: 'У покупателя пропал интернет', steps: [step('tap'), step('send', { lost: true, kind: 'bad', note: 'Покупатель в метро: связи нет. Запрос не ушёл дальше телефона — сервер о заказе даже не знает.' }), { from: 'app', to: 'app', t: 'ответа нет 15 с', kind: 'warn', note: 'Приложение ждёт ответа и не дожидается.' }],
      state: { order: ['bad', 'нет: сервер не знает'], money: ['ok', 'не списаны'], check: ['', 'не нужен'], cash: ['', 'нечего показывать'] },
      an: 'Описать: приложение само понимает, что связи нет, сохраняет корзину и предлагает повторить. Никаких повторных списаний — до оплаты дело не дошло.' },
    { v: 'db', t: 'Упала база данных', steps: [step('tap'), step('send'), step('rules'), step('save', { lost: true, kind: 'bad', note: 'База данных не отвечает: записать заказ некуда.' }), { from: 'be', to: 'be', t: 'не записать —\nв оплату не идём', kind: 'warn', note: 'Бэкенд не идёт в оплату: брать деньги за заказ, который нигде не записан, нельзя.' }, step('reply', { t: 'ошибка', kind: 'bad', note: 'Сервер отвечает приложению: оформить не получилось.' })],
      state: { order: ['bad', 'нет: не записан'], money: ['ok', 'не списаны'], check: ['', 'не нужен'], cash: ['', 'нечего показывать'] },
      an: 'Описать: при сбое записи — не списывать деньги и честно сказать, что заказ не оформлен. Отдельно — кого и как предупредить в «Квант Софт», чтобы базу подняли до утреннего пика.' },
    { v: 'pay', t: 'Не отвечает «ПэйМост»', steps: [step('tap'), step('send'), step('rules'), step('save'), step('pay', { lost: true, kind: 'bad', note: 'Платёжный шлюз «ПэйМост» лежит: запрос до банка не дошёл, деньги не списаны.' }), { from: 'be', to: 'be', t: 'ждали 30 с —\nоплаты нет', kind: 'warn', note: 'Бэкенд подождал и сдался. Заказ записан, но не оплачен — он остаётся «Создан».' }, step('reply', { t: 'оплата не прошла', kind: 'bad', note: 'Сервер отвечает приложению: оплата не прошла.' })],
      state: { order: ['warn', '«Создан», не оплачен'], money: ['ok', 'не списаны'], check: ['', 'не нужен'], cash: ['', 'пока не показываем'] },
      an: 'Описать: что видит покупатель, можно ли повторить оплату, можно ли выбрать «Оплатить при получении» (Нина хочет оба способа), и сколько держать неоплаченный заказ «Создан».' },
    { v: 'kassa', t: 'Не отвечает «КассаПро»', steps: [step('tap'), step('send'), step('rules'), step('save'), step('pay'), step('payOk'), step('paid'), step('check', { lost: true, kind: 'bad', note: '«КассаПро» не отвечает: чек «предоплата» не пробит.' }), { from: 'be', to: 'db', t: 'чек: дослать позже', kind: 'warn', note: 'Бэкенд ставит чек в очередь «дослать». Деньги уже списаны, заказ оплачен — отменять его нельзя.' }, step('reply', { t: 'заказ принят' }), step('cash')],
      state: { order: ['ok', '«Оплачен»'], money: ['ok', 'списано 420 ₽'], check: ['bad', 'не пробит — дослать'], cash: ['ok', 'видит заказ'] },
      an: 'Описать: чек досылается автоматически, сколько раз и как долго пробовать, кому сигнал, если не удалось, — по 54-ФЗ чек обязателен, иначе штраф. Олег Петрович должен видеть такие заказы при сверке.' },
    { v: 'shop', t: 'У кассы на Покровке пропал интернет', steps: [step('tap'), step('send'), step('rules'), step('save'), step('pay'), step('payOk'), step('paid'), step('check'), step('checkOk'), step('reply', { t: 'заказ принят' }), step('cash', { lost: true, kind: 'bad', note: 'У кассы на Покровке пропал интернет: экран кассира не получил новый заказ. Утром покупатель придёт — а кассир его не найдёт.' })],
      state: { order: ['ok', '«Оплачен»'], money: ['ok', 'списано 420 ₽'], check: ['ok', 'пробит'], cash: ['bad', 'не видит заказ'] },
      an: 'Описать: экран кассира показывает, что связи нет и данные устарели («обновлено в 07:52»), догружает заказы, когда связь вернулась, и даёт найти заказ по коду. Покупателю об этом знать не нужно — он всё сделал правильно.' }
  ];
  const FAILS = LAB_SC.filter(s => s.v !== 'ok');
  const MSG = [
    { v: 'm-ok', t: '«Заказ принят! Ждём вас завтра с 08:00 до 08:30 на Покровке»', kind: 'ok' },
    { v: 'm-net', t: '«Нет связи с интернетом. Заказ не отправлен, корзина сохранена — нажмите «Повторить», когда связь появится»', kind: 'warn' },
    { v: 'm-err', t: '«Не получилось оформить заказ. Деньги не списаны — попробуйте через пару минут»', kind: 'bad' },
    { v: 'm-pay', t: '«Оплата не прошла, деньги не списаны. Попробуйте ещё раз или выберите «Оплатить при получении»»', kind: 'bad' },
    { v: 'm-spin', t: 'Крутящийся значок загрузки без текста — пусть подождёт', kind: 'spin' }
  ];
  const EVAL = {
    net: { 'm-net': ['ok'], 'm-err': ['warn', 'Честно, но неточно. Приложение знает, что связи нет, — если сказать прямо, человек поймёт, что делать: выйти из метро и повторить.'], 'm-pay': ['bad', 'До оплаты дело не дошло — сервер даже не знает о заказе. Человек начнёт подозревать свою карту.'], 'm-ok': ['bad', 'Покупатель утром придёт за заказом, которого нет ни в базе, ни у кассира.', true], 'm-spin': ['bad', 'Человек не понимает, что происходит, жмёт ещё раз или уходит. Ответа не будет никогда.'] },
    db: { 'm-err': ['ok'], 'm-net': ['bad', 'С интернетом у покупателя всё в порядке — он будет перезагружать телефон зря и злиться.'], 'm-pay': ['bad', 'Оплата тут ни при чём — до неё не дошло. Человек попробует другую карту, и снова неудачно.'], 'm-ok': ['bad', 'Заказ нигде не записан. Покупатель придёт за круассанами, которых для него никто не пёк.', true], 'm-spin': ['bad', 'Сервер ответил ошибкой — а человек этого так и не узнает.'] },
    pay: { 'm-pay': ['ok'], 'm-err': ['warn', 'Правда, но без выхода. Нина хочет, чтобы можно было заплатить и на месте, — предложите это человеку прямо здесь.'], 'm-net': ['bad', 'Интернет у покупателя есть — молчит платёжный шлюз.'], 'm-ok': ['bad', 'Заказ не оплачен. Человек решит, что заплатил, а утром на кассе выяснится обратное.', true], 'm-spin': ['bad', 'Бэкенд уже знает, что оплата не прошла, — зачем держать человека в неведении?'] },
    kassa: { 'm-ok': ['ok'], 'm-err': ['bad', 'Деньги уже списаны, заказ оплачен и записан. Покупатель решит, что ничего не вышло, и закажет ещё раз — два списания и скандал.', true], 'm-pay': ['bad', 'Оплата прошла — а вы пишете, что нет. Человек заплатит второй раз.', true], 'm-net': ['bad', 'Заказ дошёл и оплачен — сообщение о связи его обманет. Он повторит заказ.', true], 'm-spin': ['bad', 'Заказ готов — а человек смотрит на значок загрузки и не знает, что всё получилось.'] },
    shop: { 'm-ok': ['ok'], 'm-err': ['bad', 'У покупателя всё получилось: заказ оплачен и записан. Ошибка заставит его заказать повторно.', true], 'm-pay': ['bad', 'Оплата прошла — человек заплатит второй раз.', true], 'm-net': ['bad', 'Интернет пропал у кассы, а не у покупателя. Его телефон в порядке, заказ принят.', true], 'm-spin': ['bad', 'Заказ готов — а человек смотрит на значок загрузки.'] }
  };
  const LAB_HINT = {
    net: 'Где остановился запрос? Знает ли сервер о заказе? Что поможет человеку понять, что делать дальше?',
    db: 'Записан ли заказ? Списаны ли деньги? Что честно сказать человеку?',
    pay: 'Что с заказом и с деньгами? Какой ещё способ оплаты хочет оставить Нина Сергеевна?',
    kassa: 'Что получил покупатель: заказ записан? деньги списаны? Должен ли он вообще узнать о проблеме с чеком?',
    shop: 'У кого пропал интернет — у покупателя или у кассы? Что получил сам покупатель?'
  };
  const LAB_Q = {
    q: 'Сбои «КассаПро» и интернета у кассы покупатель не замечает: он видит «Заказ принят». Значит ли это, что аналитику о них можно не думать?', seed: 'sw-lab-q',
    options: [
      { t: 'Нет. Покупателю всё равно, но чек не пробит, а кассир не видит заказ. Аналитик описывает, что система делает «за стеной»: досылает чек, показывает кассиру, что данные устарели, кого предупредить', ok: 1, why: 'Верно. Невидимые для покупателя сбои бьют по другим людям — по кассиру, бухгалтеру, а через штраф по 54-ФЗ — по самой Нине.' },
      { t: 'Да. Покупатель доволен — значит, всё работает, остальное забота разработчиков', why: 'Разработчик не знает, сколько раз досылать чек и что показать кассиру, — это правила бизнеса, их описывает аналитик.' },
      { t: 'Да. Такие сбои редкие, их можно описать после запуска', why: 'Интернет у касс и чужие сервисы падают регулярно. После запуска это будут уже потерянные заказы и штрафы.' },
      { t: 'Нет. Надо обязательно показать покупателю ошибку, чтобы он знал о сбое', why: 'Покупатель ничего не может с этим сделать — зато испугается и закажет второй раз. Ошибку показывают тому, кто может действовать.' }
    ]
  };
  function labEval(m) {
    m = m || {};
    return FAILS.map(sc => {
      const got = m[sc.v];
      if (!got) return { sc, s: 'bad', pts: 0, empty: true };
      const e = EVAL[sc.v][got] || ['bad', ''];
      return { sc, s: e[0], pts: e[0] === 'ok' ? 1 : e[0] === 'warn' ? 0.5 : 0, why: e[1], crit: !!e[2] };
    });
  }
  function phoneMsg(sc, chosen) {
    if (sc.v === 'ok') chosen = 'm-ok';
    const m = MSG.find(x => x.v === chosen);
    if (!m) return '<div class="msg empty">Что увидит покупатель?<br>Выберите справа ↓</div>';
    if (m.kind === 'spin') return '<div class="spin"><i></i>Загрузка…</div>';
    return `<div class="msg ${m.kind}">${esc(m.t.replace(/^«|»$/g, ''))}</div>`;
  }
  const breakTask = {
    id: 'break', title: 'Лаборатория: сломайте одну часть',
    simple: howRequest.simple,
    lead: ui.brief({
      situation: 'Тот же заказ: 21:40, корзина на 420 ₽, Покровка, завтра 08:00–08:30, оплата картой. Дима: «Любая часть может замолчать: связь в метро, наша база, чужой “ПэйМост”, чужая “КассаПро”, модем на кассе. Что в этот момент видит покупатель — решаю не я. Это пишет аналитик». Вы проектируете сообщение, которое увидит человек, для пяти поломок.',
      todo: [
        'Выберите поломку в блоке «Что сломалось». Схема покажет, где оборвался путь заказа (пройти по шагам: «⟲ Сначала», затем «Шаг →»). Посмотрите на четыре карточки «За стеной»: что с заказом, деньгами, чеком и экраном кассира.',
        'Решите, что должен увидеть покупатель, и выберите сообщение в списке «Что покажет приложение». Телефон слева сразу покажет ваш выбор.',
        'Повторите для всех пяти поломок. Внизу — таблица ваших решений.',
        'Ответьте на вопрос в конце и нажмите «Проверить». Засчитывается от 80 %, без «опасных» сообщений.'
      ],
      look: '<p>Опасное сообщение — то, после которого покупатель сделает плохое: придёт за несуществующим заказом или оплатит второй раз. Сначала ответьте себе: записан ли заказ? списаны ли деньги? Сообщение должно говорить правду о том, что получилось <b>у покупателя</b>.</p><p>Красный крест на схеме — сообщение не дошло. Оранжевая стрелка — что делает сервер после сбоя.</p>'
    }),
    blank: () => ({ sc: 'ok', seen: [], m: {}, q: [] }),
    reference: () => ({ sc: 'kassa', seen: FAILS.map(s => s.v), m: { net: 'm-net', db: 'm-err', pay: 'm-pay', kassa: 'm-ok', shop: 'm-ok' }, q: quizRef(LAB_Q) }),
    render(el, ctx) {
      el.classList.add('sw-root');
      const a = ctx.ans; a.seen = a.seen || []; a.m = a.m || {}; a.q = a.q || []; a.sc = a.sc || 'ok';
      const showAn = ctx.readonly || !!ctx.result;
      el.innerHTML = `<div class="stack">
        <div class="stack tight"><div class="eyebrow">Что сломалось</div>${ui.seg('sc', LAB_SC.map(s => ({ v: s.v, t: s.t })), a.sc, 'accent')}</div>
        <div data-seqbox></div>
        <div class="sw-lab"><div class="sw-phone" data-ph></div><div class="stack" data-side></div></div>
        <div class="stack tight"><div class="eyebrow">Ваши решения</div><div data-sum></div></div>
        <div class="card flat" data-q></div>
      </div>`;
      const seqEl = document.createElement('div'); TR.$('[data-seqbox]', el).appendChild(seqEl);
      const sq = ui.seq(seqEl, { lanes: LAB_LANES, steps: LAB_SC[0].steps, laneW: 146, start: 'all', title: 'Путь заказа при поломке' });
      function draw() {
        const sc = LAB_SC.find(s => s.v === a.sc) || LAB_SC[0];
        sq.set(sc.steps, { all: true });
        TR.$('[data-ph]', el).innerHTML = `<div class="bar"></div><div class="hd">Колос · ваш заказ</div>${phoneMsg(sc, a.m[sc.v])}`;
        const st = sc.state, card = (k, t) => `<div class="stat"><span class="k">${k}</span><span class="v ${t[0]}">${esc(t[1])}</span></div>`;
        let side = `<div class="eyebrow">За стеной</div><div class="sw-state">${card('Заказ в базе', st.order)}${card('Деньги', st.money)}${card('Чек по 54-ФЗ', st.check)}${card('Экран кассира', st.cash)}</div>`;
        if (sc.v === 'ok') side += ui.note('ok', 'Всё работает', 'Так выглядит нормальный путь. Выберите поломку выше.');
        else {
          const r = ctx.result ? labEval(a.m).find(x => x.sc.v === sc.v) : null;
          side += `<div class="eyebrow">Что покажет приложение</div><div class="sw-pick">${MSG.map(m => `<button type="button" class="btn sm" data-msg="${m.v}" aria-pressed="${a.m[sc.v] === m.v}" ${ctx.readonly ? 'disabled' : ''}>${esc(m.t)}</button>`).join('')}</div>`;
          if (r && r.s !== 'ok') side += ui.note(r.s === 'warn' ? 'warn' : 'bad', r.empty ? 'Не выбрано' : 'Что будет', r.empty ? LAB_HINT[sc.v] : esc(r.why));
          if (showAn && sc.an) side += ui.note('info', 'Что ещё описывает аналитик', sc.an);
        }
        TR.$('[data-side]', el).innerHTML = side;
        const rv = ctx.result ? Object.fromEntries(labEval(a.m).map(x => [x.sc.v, x.s])) : {};
        TR.$('[data-sum]', el).innerHTML = `<div class="sw-rows">${FAILS.map(s => {
          const m = MSG.find(x => x.v === a.m[s.v]), k = rv[s.v] === 'warn' ? 'hl' : (rv[s.v] || '');
          return `<div class="sw-rule ${k}"><b>${esc(s.t)}</b>${(a.seen || []).includes(s.v) ? '' : ui.status('не открыта', '')}<span class="s">${m ? esc(m.t) : '— сообщение не выбрано'}</span></div>`;
        }).join('')}</div>`;
      }
      function mark() { if (!ctx.readonly && a.sc !== 'ok' && !a.seen.includes(a.sc)) { a.seen.push(a.sc); ctx.save(); } }
      mark(); draw();
      ui.quiz(TR.$('[data-q]', el), Object.assign({}, LAB_Q, { value: a.q, readonly: ctx.readonly, reveal: ctx.result, onChange: v => { a.q = v; ctx.save(); } }));
      ui.onSeg(el, (n, v) => { if (n !== 'sc') return; a.sc = v; mark(); if (!ctx.readonly) ctx.save(); draw(); });
      TR.on(el, 'click', '[data-msg]', (e, b) => {
        if (ctx.readonly) return;
        a.m[a.sc] = b.dataset.msg; ctx.save();
        ctx.decide('Сообщение при поломке: ' + (LAB_SC.find(s => s.v === a.sc) || {}).t, plainT((MSG.find(x => x.v === b.dataset.msg) || {}).t));
        draw();
      });
    },
    check(ans) {
      const ev = labEval(ans && ans.m), seen = (ans && ans.seen) || [];
      const rows = ev.reduce((s, x) => s + x.pts, 0) / FAILS.length;
      const q = ui.quizScore(LAB_Q, (ans && ans.q) || []);
      const seenK = FAILS.filter(s => seen.includes(s.v)).length / FAILS.length;
      const crit = ev.filter(x => x.crit);
      const notes = [];
      ev.forEach(x => {
        if (x.s === 'ok') notes.push({ ok: true, html: `«${esc(x.sc.t)}» — сообщение говорит правду о том, что получилось у покупателя.` });
        else if (x.empty) notes.push({ ok: false, html: `«${esc(x.sc.t)}» — сообщение не выбрано. ${LAB_HINT[x.sc.v]}` });
        else notes.push({ ok: x.s === 'warn' ? 'warn' : false, html: `«${esc(x.sc.t)}» — ${esc(x.why)}${x.s === 'bad' ? ' ' + LAB_HINT[x.sc.v] : ''}` });
      });
      notes.push(q.ok ? { ok: true, html: 'Вопрос: верно — невидимые для покупателя сбои всё равно описывает аналитик.' } : { ok: false, html: 'Вопрос в конце: подумайте, кто пострадает от непробитого чека и от кассира, который не видит заказ, — и кто должен заранее решить, что система делает в этих случаях.' });
      const score = rows * 0.6 + q.score * 0.25 + seenK * 0.15;
      return {
        ok: score >= 0.8 && !crit.length && q.ok, score, notes,
        summary: `Сообщений по делу: ${ev.filter(x => x.s === 'ok').length} из ${FAILS.length}${crit.length ? `, опасных: ${crit.length}` : ''}.`,
        mentor: crit.length ? 'Опасное сообщение — то, после которого человек сделает хуже: придёт за несуществующим заказом или заплатит второй раз. Для каждой поломки сначала посмотрите на карточки «Заказ в базе» и «Деньги» — и только потом выбирайте.' : null
      };
    },
    explain: `<p>Сообщение покупателю должно говорить правду о том, <b>что получилось у него</b>: записан ли заказ и списаны ли деньги. А что сломалось «за стеной» — ему знать не нужно.</p>
      ${ui.table(['Поломка', 'Покупатель видит', 'За стеной — что описывает аналитик'], [
        ['Пропал интернет у покупателя', '«Нет связи… корзина сохранена»', 'Сервер о заказе не знает. Приложение само определяет, что связи нет, и не теряет корзину.'],
        ['Упала база', '«Не получилось оформить… деньги не списаны»', 'Деньги не списываем, раз заказ не записан. Кому сигнал, чтобы подняли базу до утреннего пика.'],
        ['Не отвечает «ПэйМост»', '«Оплата не прошла… или оплатить при получении»', 'Заказ «Создан» без оплаты: сколько его держать, можно ли перевести на оплату на месте.'],
        ['Не отвечает «КассаПро»', '«Заказ принят»', 'Чек досылается автоматически; кого предупредить, если не вышло. По 54-ФЗ чек обязателен.'],
        ['Нет интернета у кассы', '«Заказ принят»', 'Экран кассира честно показывает, что данные устарели, и догружает заказы, когда связь вернулась.']
      ])}
      <p>Самые коварные сбои — те, которых покупатель не видит: ошибка на экране заставила бы его заказать второй раз, а молчание системы оставит без чека Олега Петровича и без заказа кассира. Разработчик сам этого не решит: это правила бизнеса. Такие требования называют <b>обработкой ошибок</b> и <b>альтернативными сценариями</b> — их подробно разберём в неделе 4.</p>`,
    report: ans => {
      const m = (ans && ans.m) || {};
      return FAILS.map(s => `- ${s.t}: ${plainT((MSG.find(x => x.v === m[s.v]) || { t: '—' }).t)}`).join('\n') + `\nВопрос о невидимых сбоях: ${ui.quizScore(LAB_Q, (ans && ans.q) || []).ok ? 'верно' : 'неверно'}.`;
    }
  };

  // =====================================================================
  // Практика 4. Объясните Нине Сергеевне
  // =====================================================================
  const NINA_RUBRIC = [
    'Приложение — только видимая часть, витрина и прилавок; покупатель видит лишь её',
    'За витриной нужна «кухня» — сервер с правилами её бизнеса (приём до 22:30, торт за 48 часов, заказ держим 30 минут): правила живут не в телефоне',
    'Нужна база — «журнал», где хранятся заказы, товары и покупатели, чтобы ничего не терялось, как сейчас в тетради',
    'Нужны связи с чужими системами: оплата («ПэйМост»), чеки по 54-ФЗ («КассаПро»), сводка продаж в 1С',
    'Связь с её целями без жаргона: экраны кассира и цеха, предзаказы в плане выпечки, меньше списаний, торты не теряются, меньше ручной сверки'
  ];
  const NINA_REF = 'Нина Сергеевна, приложение — это витрина и прилавок: покупатель видит только их. Но чтобы заказ с витрины превратился в булку на полке, нужна «кухня», которую покупатель не видит, — сервер с вашими правилами: заказ на завтра — до 22:30, торт — за 48 часов, невыкупленный заказ держим 30 минут. Нужен «журнал» — база, где хранятся все заказы, товары и покупатели, иначе торты будут теряться, как сейчас в тетради. Нужны договорённости с чужими системами: «ПэйМост» спишет деньги с карты, «КассаПро» пробьёт чек по 54-ФЗ, а сводка продаж сама уйдёт в 1С — Олег Петрович перестанет сводить её руками по два часа. И ещё два экрана: для кассира и для цеха — без них Галина Ивановна не увидит предзаказы в плане выпечки, и списания не уменьшатся. Красивое приложение без всего этого — как витрина без пекарни: заказать можно, а испечь и выдать некому.';
  const ninaTask = {
    id: 'nina', title: 'Объясните Нине Сергеевне',
    simple: {
      icon: '🗣️',
      plain: 'Заказчику не нужны слова «бэкенд» и «интеграция». Ему нужно понять, за что он платит и что получит его бизнес.',
      analogy: 'Объяснить хозяйке новой пекарни, почему смета не только на витрину: нужны ещё печи, склад, договор с поставщиком муки и касса. Без них витрина красивая, но пустая.',
      tech: 'Аналитик переводит устройство системы на язык бизнеса: каждая «невидимая» часть — через пользу для целей заказчика (БЦ-1…БЦ-4) и через ограничения (54-ФЗ, 152-ФЗ). Термины — только с бытовым объяснением.'
    },
    lead: ui.brief({
      situation: 'Нина Сергеевна после звонка с Игорем пишет в чат проекта: «Игорь сказал, что приложение — это только верхушка, а ещё нужны какие-то сервер, база и интеграции. Мне нужно приложение как у Додо, красивое и быстрое. Зачем мне платить за то, чего покупатель даже не увидит?» Игорь просит вас ответить — коротко и по-человечески.',
      todo: [
        'Напишите Нине 5–8 предложений, от 200 символов. Если употребляете слово «сервер», «база» или «интеграция» — объясните его по-пекарски.',
        'Ответьте на её вопрос: что ещё, кроме приложения, нужно — и зачем это лично ей и её пекарням.',
        'Нажмите «Проверить с Ксенией (Claude)» или «Сверить с эталоном самому» и отметьте раскрытые пункты. Засчитывается от 60 %.'
      ],
      lookTitle: 'На что опереться',
      look: 'Витрина и кухня. Правила «Колоса» — 22:30, 48 часов, 30 минут. Чеки по 54-ФЗ — через «КассаПро», оплата — через «ПэйМост», сводка для Олега Петровича — в 1С. Экраны кассира и цеха — тоже часть системы. Цели Нины: списания с 12 % до 7 %, ни одного потерянного торта к 8 Марта, сверка 15 минут вместо 2 часов.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: NINA_REF, self: NINA_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('sw-root');
      el.insertAdjacentHTML('beforeend', ui.say('nina', 'Мне нужно приложение как у Додо, красивое и быстрое. Зачем мне платить за то, чего покупатель даже не увидит?'));
      const j = document.createElement('div'); j.style.marginTop = '12px'; el.appendChild(j);
      ui.justify(j, {
        id: 'sw-nina', q: 'Зачем «Колосу» то, чего покупатель не видит?', qPlain: 'Объясните владелице сети пекарен без жаргона: что, кроме приложения, нужно для предзаказа (сервер с правилами, база данных, связи с оплатой, кассами и 1С, экраны кассира и цеха) и зачем это её бизнесу.',
        rubric: NINA_RUBRIC, reference: NINA_REF, value: ctx.ans.j, readonly: ctx.readonly, minLen: 200,
        onChange: v => { ctx.ans.j = v; ctx.save(); ctx.decide('Объяснение Нине: из чего система', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j);
      return {
        ok: s >= 0.6, score: s,
        summary: s ? `Оценка объяснения: ${Math.round(s * 100)} %.` : 'Напишите ответ (от 200 символов) и проверьте его с Ксенией или сверьте с эталоном сами.',
        notes: s && s < 0.6 ? [{ ok: false, html: 'Нине важно не устройство, а польза. Для каждой невидимой части ответьте: что сломается в её пекарнях без неё — заказы, торты, чеки, сверка?' }] : []
      };
    },
    explain: '<p>Хорошее объяснение для заказчика — не урок информатики, а <b>карта пользы</b>: каждая невидимая часть привязана к его боли или цели. Сервер — потому что правила 22:30 и 48 часов должны работать для приложения, сайта и кассира одинаково. База — потому что торты теряются в тетради. Интеграции — потому что чеки по 54-ФЗ обязательны, а Олег Петрович тратит 2 часа на сверку. Экраны кассира и цеха — потому что без них предзаказ не дойдёт до витрины и плана выпечки.</p><p>Обратите внимание на слово «как у Додо»: это не требование, а вкус. Разбирать такие фразы — «что за ними стоит» — будем на неделе 2.</p>',
    report: ans => (ans.j && ans.j.text) ? ans.j.text : '—'
  };

  // =====================================================================
  TR.stage({
    id: ID, act: 1, order: 10, slot: 'Пн 09:00', title: 'Из чего сделан софт',
    when: 'понедельник, 5 октября, 09:00 · опенспейс «Квант Софт»',
    intro: [
      { who: 'igor', html: 'Добро пожаловать в «Квант Софт»! Вчера вечером написала Нина Сергеевна, владелица сети пекарен «Колос»: «Хотим приложение, чтобы клиенты заказывали заранее. Как у Додо». Девять пекарен, свой цех, 6 000 чеков в день. Вы — на этом проекте с первого дня.' },
      { who: 'dima', html: 'Сразу предупрежу: я буду говорить «фронт», «бэк», «база», «API», «интеграция». И когда что-то сломается — а оно сломается, — я спрошу у аналитика, что в этот момент видит покупатель.' },
      { who: 'ksenia', html: 'Поэтому начнём с того, из чего вообще сделано то, что Нина называет «приложением». К обеду эти слова должны стать для вас не заклинаниями, а понятными частями пекарни: витриной, кухней, журналом и договорами с поставщиками.' }
    ],
    facts: [],
    glossary: [
      { term: 'Программа', simple: 'Рецепт для компьютера: точные шаги, которые он выполняет одинаково каждый раз.', tech: 'Набор инструкций, которые выполняет компьютер. Может быть крошечной (расчёт цены доставки) или огромной.' },
      { term: 'Приложение', simple: 'Прилавок, за которым человек делает своё дело: выбирает, платит, получает.', tech: 'Программа (или несколько), с которой работает пользователь, чтобы решить свою задачу: приложение покупателя, экран кассира.' },
      { term: 'Система', simple: 'Вся пекарня целиком: цех, витрина, касса, бухгалтерия, люди и правила смен — ради свежего хлеба у покупателя.', tech: 'Совокупность программ, баз данных, интеграций, людей и процессов, работающих вместе ради общей цели. Система «Колос-заказы» включает приложение, экраны кассира и цеха, бэкенд, базу и связи с «КассаПро», 1С и «ПэйМост».' },
      { term: 'Интерфейс', simple: 'Место встречи двух сторон и договорённость, как общаться: прилавок между покупателем и кассиром.', tech: 'Граница взаимодействия: пользовательский (UI — экраны и кнопки), программный (API — между программами), аппаратный (между программой и устройством: принтер чеков, сканер).' },
      { term: 'API', simple: 'Окошко выдачи с правилами: что можно попросить, в каком виде и что тебе ответят.', tech: 'Application Programming Interface — программный интерфейс: описание запросов и ответов, по которым одна программа обращается к другой. У «КассаПро» и «ПэйМост» свои API — «Колос» подстраивается под них.' },
      { term: 'Клиент и сервер', simple: 'Покупатель спрашивает у кассира, кассир — у цеха, цех отвечает.', tech: 'Схема работы: клиент (приложение, сайт, экран кассира) отправляет запрос, сервер выполняет логику, работает с базой данных и возвращает ответ.' },
      { term: 'Фронтенд', simple: 'Витрина и прилавок: всё, что видит и нажимает человек.', tech: 'Клиентская часть системы: экраны, кнопки, сообщения. Работает у пользователя — в телефоне, браузере, на планшете кассира.' },
      { term: 'Бэкенд', simple: 'Кухня, которую покупатель не видит: там решают, что можно, сколько и когда.', tech: 'Серверная часть: бизнес-правила (22:30, 48 часов, 30 минут), расчёты, статусы, обращения к базе и к чужим системам. Одна для всех фронтендов.' },
      { term: 'База данных', simple: 'Склад и журнал заказов: что лежит, кто что заказал, кому выдали.', tech: 'Хранилище записей: заказы, товары, остатки, покупатели. Работает с ней только бэкенд.' },
      { term: 'Интеграция', simple: 'Договор с поставщиком муки: кто, что, когда и в каком виде привозит.', tech: 'Связь с внешней системой через её API: «КассаПро» (чеки по 54-ФЗ), 1С (сводка продаж), «ПэйМост» (оплата картой и СБП), SMS-шлюз, ВКонтакте.' }
    ],
    outro: 'Теперь за словом «приложение» вы видите всю пекарню: витрину (фронтенд), кухню (бэкенд), журнал (базу данных) и договоры с поставщиками (интеграции). Аналитик описывает не только то, что видно на экране, но и то, что происходит за стеной, — особенно когда что-то ломается. В 14:00 разберёмся, кто такой системный аналитик и чем он занят весь день.',
    tasks: [howParts, howRequest, partsTask, pathTask, breakTask, ninaTask]
  });
})();
