/* Неделя 1, понедельник 11:00: язык разработчика.
   Теория: слои системы (фронтенд, шлюз, сервисы, данные, очередь, внешние системы) и путь запроса по ним;
   матрёшка большой компании (АС → функциональная подсистема → сервис → конфигурационная единица) на «Колосе» и в банке;
   путь кода до прода по стендам (DEV, ИФТ, НТ, ПСИ, ПРОМ), релиз, ЗНИ, хотфикс, фича-флаг, ТУЗ.
   Практика: разложить фразы из чата разработчиков, сопоставить термины, перевести сообщения Димы. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'devlang';

  if (!document.getElementById('dl-css')) document.head.insertAdjacentHTML('beforeend', `<style id="dl-css">
    .dl-root, .dl-root .stack > * { min-width: 0; }
    .dl-two { display: grid; grid-template-columns: minmax(0, 300px) minmax(0, 1fr); gap: 14px; align-items: start; }
    .dl-layers { display: grid; gap: 6px; }
    .dl-layer { display: grid; gap: 2px; text-align: left; padding: 9px 12px; border: 1px solid var(--border); border-left: 4px solid var(--border-strong); border-radius: 10px; background: var(--surface-2); color: var(--text); cursor: pointer; font: inherit; transition: border-color .2s, background .2s, transform .2s; }
    .dl-layer small { font: 600 10.5px/1.2 var(--f-mono); letter-spacing: .06em; text-transform: uppercase; color: var(--text-muted); }
    .dl-layer.on { border-color: var(--accent); background: var(--accent-soft); }
    .dl-layer.lit { border-left-color: var(--ok); background: var(--ok-soft, var(--accent-soft)); transform: translateX(6px); }
    .dl-card { display: grid; gap: 10px; padding: 14px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); }
    .dl-card h4 { margin: 0; }
    .dl-card p { margin: 0; line-height: 1.5; }
    .dl-say { padding: 8px 12px; border-radius: 10px; background: var(--surface-2); font-family: var(--f-mono); font-size: 13px; }
    .dl-nest { display: grid; gap: 8px; padding: 12px; border: 2px solid var(--accent); border-radius: 14px; }
    .dl-nest .dl-lvl { text-align: left; font: inherit; color: var(--text); cursor: pointer; background: none; border: 0; padding: 0; }
    .dl-nest .dl-lvl b { font-size: 13px; color: var(--accent); }
    .dl-fps { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; }
    .dl-fp { display: grid; gap: 6px; padding: 10px; border: 2px dashed var(--info); border-radius: 12px; }
    .dl-svc { display: flex; flex-wrap: wrap; gap: 4px; }
    .dl-svc span { padding: 2px 8px; font: 12px/1.4 var(--f-mono); border: 1px solid var(--border-strong); border-radius: 6px; background: var(--surface-2); }
    .dl-svc span.ke { border-style: dotted; color: var(--text-muted); }
    .dl-picked { outline: 3px solid var(--accent); outline-offset: 2px; }
    .dl-envs { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; }
    .dl-env { display: grid; gap: 4px; justify-items: center; padding: 10px 6px; text-align: center; font: inherit; color: var(--text); cursor: pointer; border: 1px solid var(--border); border-radius: 12px; background: var(--surface-2); }
    .dl-env b { font-size: 15px; }
    .dl-env small { font-size: 11.5px; color: var(--text-muted); line-height: 1.25; }
    .dl-env.on { border-color: var(--accent); background: var(--accent-soft); }
    .dl-env.here { box-shadow: 0 0 0 3px var(--ok) inset; }
    @media (max-width: 720px) { .dl-two { grid-template-columns: minmax(0, 1fr); } .dl-envs { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (prefers-reduced-motion: reduce) { .dl-layer { transition: none; } .dl-layer.lit { transform: none; } }
  </style>`);

  const fresh = fn => pane => { pane.innerHTML = ''; fn(pane); };

  // =====================================================================
  // Теория 1. Слои системы и путь запроса
  // =====================================================================
  const LAYERS = [
    { id: 'user', k: 'снаружи', t: 'Пользователь', what: 'Человек с телефоном или кассир за экраном. Он видит только экран и ждёт ответа.', dev: '«На клиенте у пользователя старая версия, пусть обновит приложение»', ask: 'Кто пользователь, что он хочет сделать и что увидит, если всё сломалось?' },
    { id: 'front', k: 'клиент', t: 'Фронтенд', what: 'Экраны, кнопки, проверки полей. Работает у человека: в браузере (веб) или в телефоне (мобильное приложение).', dev: '«Фронт отрисовал форму, но запрос на бэк не отправил: упал на валидации»', ask: 'Какие состояния у экрана: загрузка, пусто, ошибка, данные? Что проверяем ещё до отправки?' },
    { id: 'gw', k: 'вход', t: 'API-шлюз', what: 'Единая дверь в систему: проверяет, кто пришёл, ограничивает частоту запросов и передаёт запрос нужному сервису.', dev: '«Шлюз режет запросы без токена, вот и 401»', ask: 'Кому можно вызывать этот метод и сколько раз в секунду?' },
    { id: 'svc', k: 'сервер', t: 'Бэкенд-сервисы', what: 'Программы на сервере, каждая отвечает за своё: заказы, оплата, уведомления. Здесь живут бизнес-правила вроде «приём до 22:30». Адрес, по которому сервис принимает запрос, называют эндпоинтом.', dev: '«Эндпоинт POST /orders в сервисе заказов отдаёт 500 на пустой корзине»', ask: 'В каком сервисе живёт правило? Что сервис отвечает при каждой ошибке?' },
    { id: 'data', k: 'память', t: 'Данные', what: 'База данных хранит заказы и остатки, кэш держит частые ответы рядом, хранилище файлов держит картинки и чеки.', dev: '«Нужна миграция: добавим в таблицу orders колонку pickup_at и индекс»', ask: 'Какие поля храним, сколько времени и что будет при удалении?' },
    { id: 'queue', k: 'асинхронно', t: 'Очередь и шина', what: 'Почтовый ящик между сервисами: один кладёт сообщение, другой заберёт, когда сможет. Так работа не теряется, если сосед занят.', dev: '«Сервис заказов публикует событие order.paid в топик, уведомления его читают»', ask: 'Что будет, если сообщение придёт дважды или с опозданием?' },
    { id: 'ext', k: 'чужое', t: 'Внешние системы', what: 'Системы других компаний: платёжный шлюз, касса по 54-ФЗ, 1С. Их правила мы не меняем, только подстраиваемся.', dev: '«Интеграция с ПэйМост: их API отвечает 30 секунд, ставим таймаут и повтор»', ask: 'Что делаем, если внешняя система молчит или отвечает ошибкой?' },
  ];
  const PATH = ['user', 'front', 'gw', 'svc', 'data', 'queue', 'ext'];

  function drawLayers(pane) {
    let picked = 'front', timer = null;
    pane.innerHTML = `<div class="dl-two">
      <div class="stack tight"><div class="dl-layers" data-ls></div><button type="button" class="btn" data-run>Пройти путь заказа</button></div>
      <div class="dl-card" data-card aria-live="polite"></div>
    </div>`;
    function draw(lit) {
      TR.$('[data-ls]', pane).innerHTML = LAYERS.map(x => `<button type="button" class="dl-layer ${x.id === picked ? 'on' : ''} ${lit === x.id ? 'lit' : ''}" data-l="${x.id}"><small>${esc(x.k)}</small><b>${esc(x.t)}</b></button>`).join('');
      const x = LAYERS.find(l => l.id === picked);
      TR.$('[data-card]', pane).innerHTML = `<h4>${esc(x.t)}</h4><p>${esc(x.what)}</p><div><div class="small dim">Как скажет разработчик</div><div class="dl-say">${esc(x.dev)}</div></div><div><div class="small dim">Что спросит аналитик</div><p>${esc(x.ask)}</p></div>`;
    }
    TR.on(pane, 'click', '[data-l]', (e, b) => { picked = b.dataset.l; draw(); });
    TR.on(pane, 'click', '[data-run]', () => {
      clearInterval(timer);
      let i = 0;
      timer = setInterval(() => {
        if (i >= PATH.length || !pane.isConnected) { clearInterval(timer); draw(); return; }
        picked = PATH[i]; draw(PATH[i]); i++;
      }, 900);
    });
    draw();
  }

  // =====================================================================
  // Теория 2. Матрёшка большой компании
  // =====================================================================
  const NEST = {
    kolos: {
      as: 'АС «Колос-заказы»',
      fps: [
        { t: 'ФП «Заказы»', svc: ['order-service', 'cart-service'], ke: ['БД orders'] },
        { t: 'ФП «Оплата»', svc: ['payment-service'], ke: ['адаптер ПэйМост'] },
        { t: 'ФП «План выпечки»', svc: ['bake-plan-service'], ke: ['задание 23:00'] },
        { t: 'ФП «Уведомления»', svc: ['notify-service'], ke: ['SMS-шлюз'] },
      ],
    },
    bank: {
      as: 'АС «Кредитный конвейер» (условный пример)',
      fps: [
        { t: 'ФП «Заявка»', svc: ['application-service', 'docs-service'], ke: ['БД заявок'] },
        { t: 'ФП «Решение»', svc: ['scoring-service', 'limits-service'], ke: ['модель скоринга'] },
        { t: 'ФП «Выдача»', svc: ['contract-service', 'payout-service'], ke: ['шина к АБС'] },
      ],
    },
  };
  const LEVELS = {
    as: { t: 'АС — автоматизированная система', p: 'Целая система, у которой есть владелец, бюджет и команды: «Колос-заказы» целиком. Термин из ГОСТ 34, его используют в крупных компаниях и банках, в том числе в Сбере.' },
    fp: { t: 'ФП — функциональная подсистема', p: 'Крупная часть АС, отвечающая за свою область: заказы, оплата, уведомления. Часто у каждой ФП своя команда и свой бэклог.' },
    svc: { t: 'Сервис (микросервис)', p: 'Отдельная программа внутри подсистемы: order-service, payment-service. Его можно выкатить и перезапустить отдельно от остальных.' },
    ke: { t: 'КЭ — конфигурационная единица', p: 'Всё, что учитывают как отдельный кирпичик в реестре: сервис, база, задание, адаптер. По КЭ видно, что именно поменялось в релизе и кто за это отвечает.' },
  };

  function drawNest(pane) {
    let mode = 'kolos', lvl = 'as';
    pane.innerHTML = `<div class="stack">
      <div class="row"><span class="small dim">Пример:</span>${ui.seg('nest', [{ v: 'kolos', t: 'Пекарня «Колос»' }, { v: 'bank', t: 'Большой банк' }], mode, 'accent')}</div>
      <div data-box></div><div class="dl-card" data-card aria-live="polite"></div>
    </div>`;
    function draw() {
      const n = NEST[mode];
      TR.$('[data-box]', pane).innerHTML = `<div class="dl-nest ${lvl === 'as' ? 'dl-picked' : ''}">
        <button type="button" class="dl-lvl" data-lv="as"><b>АС</b> ${esc(n.as)}</button>
        <div class="dl-fps">${n.fps.map(fp => `<div class="dl-fp ${lvl === 'fp' ? 'dl-picked' : ''}">
          <button type="button" class="dl-lvl" data-lv="fp"><b>ФП</b> ${esc(fp.t.replace(/^ФП /, ''))}</button>
          <div class="dl-svc">${fp.svc.map(s => `<span class="${lvl === 'svc' ? 'dl-picked' : ''}" data-lv="svc" role="button" tabindex="0">${esc(s)}</span>`).join('')}${fp.ke.map(s => `<span class="ke ${lvl === 'ke' ? 'dl-picked' : ''}" data-lv="ke" role="button" tabindex="0">${esc(s)}</span>`).join('')}</div>
        </div>`).join('')}</div>
      </div><p class="small dim">Нажимайте на уровни: АС, подсистему, сервис или кирпичик с точечной рамкой.</p>`;
      const l = LEVELS[lvl];
      TR.$('[data-card]', pane).innerHTML = `<h4>${esc(l.t)}</h4><p>${esc(l.p)}</p>`;
    }
    ui.onSeg(pane, (name, v) => { mode = v; draw(); });
    TR.on(pane, 'click', '[data-lv]', (e, b) => { lvl = b.dataset.lv; draw(); });
    draw();
  }

  // =====================================================================
  // Теория 3. Путь кода до прода
  // =====================================================================
  const ENVS = [
    { id: 'dev', t: 'DEV', s: 'разработка', p: 'Стенд разработчиков. Здесь всё ломается и чинится по десять раз в день. Аналитик сюда заглядывает редко.' },
    { id: 'ift', t: 'ИФТ', s: 'интеграционно-функциональное тестирование', p: 'Тестировщики проверяют функции и связи с соседями. Здесь аналитик чаще всего смотрит, как сделано по его требованиям.' },
    { id: 'nt', t: 'НТ', s: 'нагрузочное тестирование', p: 'Проверяют, выдержит ли система утренний наплыв заказов. Цифры нагрузки берут из нефункциональных требований.' },
    { id: 'psi', t: 'ПСИ', s: 'приёмо-сдаточные испытания', p: 'Заказчик принимает работу по критериям приёмки. Если критерии размыты, споры начинаются именно здесь.' },
    { id: 'prom', t: 'ПРОМ', s: 'промышленная среда, «прод»', p: 'Настоящие пользователи и настоящие деньги. Сюда выкатывают по заявке на изменение (ЗНИ) в согласованное окно.' },
  ];
  const WORDS = [
    ['Релиз', 'набор изменений, который выкатывают вместе'],
    ['ЗНИ', 'заявка на изменение: разрешение выкатить релиз на ПРОМ'],
    ['Хотфикс', 'срочная починка прода вне плана релизов'],
    ['Фича-флаг', 'выключатель: код уже на проде, но функция включается отдельно, например только для одной пекарни'],
    ['ТУЗ', 'техническая учётная запись: «логин» не человека, а системы для интеграции'],
    ['Откат', 'возврат прошлой версии, если релиз сломал прод'],
  ];

  function drawEnvs(pane) {
    let picked = 'ift', here = null, timer = null;
    pane.innerHTML = `<div class="stack">
      <div class="dl-envs" data-envs></div>
      <div class="row"><button type="button" class="btn" data-ship>Выпустить релиз «предзаказ к 8:00»</button><span class="small dim" data-st></span></div>
      <div class="dl-card" data-card aria-live="polite"></div>
      ${ui.table(['Слово', 'Что значит'], WORDS.map(([a, b]) => [`<b>${esc(a)}</b>`, esc(b)]))}
    </div>`;
    function draw() {
      TR.$('[data-envs]', pane).innerHTML = ENVS.map(e => `<button type="button" class="dl-env ${e.id === picked ? 'on' : ''} ${e.id === here ? 'here' : ''}" data-e="${e.id}"><b>${esc(e.t)}</b><small>${esc(e.s)}</small></button>`).join('');
      const e = ENVS.find(x => x.id === picked);
      TR.$('[data-card]', pane).innerHTML = `<h4>${esc(e.t)}: ${esc(e.s)}</h4><p>${esc(e.p)}</p>`;
    }
    TR.on(pane, 'click', '[data-e]', (ev, b) => { picked = b.dataset.e; draw(); });
    TR.on(pane, 'click', '[data-ship]', () => {
      clearInterval(timer);
      let i = 0;
      const st = TR.$('[data-st]', pane);
      timer = setInterval(() => {
        if (!pane.isConnected) { clearInterval(timer); return; }
        if (i >= ENVS.length) { clearInterval(timer); st.textContent = 'Релиз на проде. Фича включена флагом для одной пекарни.'; return; }
        here = ENVS[i].id; picked = here; draw();
        st.textContent = i === ENVS.length - 1 ? 'Заявка на изменение согласована, выкатываем в окно.' : `Проверки на ${ENVS[i].t} пройдены.`;
        i++;
      }, 1000);
    });
    draw();
  }

  const howStack = {
    id: 'how-stack', covers: ['sort', 'match', 'dima'], title: 'Как это работает: язык разработчика', free: true,
    simple: {
      icon: '🗣',
      plain: 'Разработчики говорят коротко: «бэк отдаёт пятисотку», «на ИФТ не задеплоено», «выкатим под флагом». За каждым словом стоит часть системы или шаг выпуска. Если знать карту, разговор перестаёт быть шифром.',
      analogy: 'Пекарня изнутри: витрина (фронт), дверь служебного входа (шлюз), цеха по участкам (сервисы), склад и журнал (данные), лоток для заказов между цехами (очередь), поставщики (внешние системы). А крупная сеть пекарен делится на отделы с владельцами: так устроены АС и подсистемы.',
      tech: '<b>Фронтенд</b> работает у пользователя, <b>бэкенд</b> на сервере и состоит из <b>сервисов</b>, у сервиса есть <b>эндпоинты</b>. В крупных компаниях система называется <b>АС</b>, делится на <b>функциональные подсистемы</b>, а каждый кирпичик в реестре это <b>КЭ</b>. Код идёт по <b>стендам</b> до <b>ПРОМа</b> по <b>ЗНИ</b>.'
    },
    lead: ui.brief({
      situation: 'Дима, тимлид разработки, говорит на своём языке. Чтобы понимать его с первого раза, разберём карту системы и путь кода до прода.',
      todo: [
        'Вкладка «Слои системы»: нажмите на каждый слой и прочитайте, как о нём говорит разработчик. Потом нажмите «Пройти путь заказа».',
        'Вкладка «АС и подсистемы»: переключите пример с пекарни на банк и пощёлкайте по уровням.',
        'Вкладка «Путь до прода»: выпустите релиз и посмотрите, через какие стенды он идёт.'
      ],
      look: 'Справа всегда три вещи: что это, как скажет разработчик и какой вопрос задаст аналитик.'
    }),
    render(el) {
      el.classList.add('dl-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'ls', t: 'Слои системы', render: fresh(drawLayers) },
        { id: 'as', t: 'АС и подсистемы', render: fresh(drawNest) },
        { id: 'env', t: 'Путь до прода', render: fresh(drawEnvs) }
      ], 'ls');
    }
  };

  // =====================================================================
  // Практика 1. Чат разработчиков: куда относится фраза
  // =====================================================================
  const BUCKETS = [
    { id: 'front', t: 'Фронтенд', sub: 'экран и то, что у пользователя' },
    { id: 'back', t: 'Бэкенд', sub: 'сервисы, правила, эндпоинты' },
    { id: 'data', t: 'Данные', sub: 'база, кэш, миграции' },
    { id: 'ops', t: 'Выпуск и доступы', sub: 'стенды, релизы, флаги, учётки' },
  ];
  const PHRASES = [
    { id: 'p1', t: 'Кнопка «Оплатить» не блокируется, пока идёт запрос', ok: 'front', why: 'Это поведение экрана у пользователя.' },
    { id: 'p2', t: 'Вёрстка поехала на маленьких экранах', ok: 'front', why: 'Как выглядит экран: чистый фронтенд.' },
    { id: 'p3', t: 'Маска телефона в форме не даёт ввести код +7', ok: 'front', alt: 'back', why: 'Проверка в форме работает в браузере. На бэке её тоже нужно дублировать, поэтому второй ответ засчитан частично.' },
    { id: 'p4', t: 'Эндпоинт POST /orders отдаёт 500 на пустой корзине', ok: 'back', why: 'Код 500 и эндпоинт: ошибка в сервисе на сервере.' },
    { id: 'p5', t: 'Сервис оплаты не дождался ответа и упал по таймауту', ok: 'back', why: 'Сервис на сервере ждёт ответ внешней системы.' },
    { id: 'p6', t: 'Правило «приём до 22:30» вынесем в сервис заказов', ok: 'back', why: 'Бизнес-правило живёт в сервисе, а не на экране.' },
    { id: 'p7', t: 'Нужен индекс по полю phone, поиск тормозит', ok: 'data', why: 'Индекс в таблице базы данных.' },
    { id: 'p8', t: 'Миграция добавит в orders колонку pickup_at', ok: 'data', why: 'Миграция меняет структуру базы.' },
    { id: 'p9', t: 'В кэше висит вчерашний остаток круассанов', ok: 'data', alt: 'back', why: 'Кэш это хранилище данных. Сбрасывать его будет сервис, поэтому бэкенд засчитан частично.' },
    { id: 'p10', t: 'Сборка упала на ИФТ, релиз откатили', ok: 'ops', why: 'Стенд и откат релиза: путь кода до прода.' },
    { id: 'p11', t: 'Включим функцию флагом только для Покровки', ok: 'ops', alt: 'back', why: 'Фича-флаг управляет выпуском. Проверяет флаг сервис, поэтому бэкенд засчитан частично.' },
    { id: 'p12', t: 'Для связи с «КассаПро» нужна ТУЗ', ok: 'ops', why: 'Техническая учётная запись: доступ системы к системе.' },
  ];
  function sortEval(v) {
    v = v || {};
    return PHRASES.map(p => {
      const got = v[p.id];
      const s = got === p.ok ? 'ok' : got && got === p.alt ? 'warn' : 'bad';
      return { p, s, pts: s === 'ok' ? 1 : s === 'warn' ? 0.5 : 0, empty: !got };
    });
  }
  const sortTask = {
    id: 'sort', title: 'Чат разработчиков: о какой части речь',
    simple: howStack.simple,
    lead: ui.brief({
      situation: 'Вы читаете общий чат команды «Колос-заказы». Чтобы понимать, кому задать вопрос, разложите фразы по частям системы.',
      todo: ['Нажмите карточку, потом корзину (на компьютере можно перетаскивать).', 'Нажмите «Проверить». Засчитывается от 80 %. У некоторых фраз второй ответ засчитан частично.'],
      look: 'Экран и то, что у человека в руках, это фронт. Правило и эндпоинт это бэк. Таблица, индекс и кэш это данные. Стенды, релизы, флаги и учётки это выпуск.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(PHRASES.map(p => [p.id, p.ok])) }),
    render(el, ctx) {
      el.classList.add('dl-root');
      let reveal = null;
      if (ctx.result) { reveal = {}; sortEval(ctx.ans.v).forEach(x => { reveal[x.p.id] = x.s; }); }
      const box = document.createElement('div'); el.appendChild(box);
      ui.sort(box, { items: PHRASES.map(p => ({ id: p.id, t: p.t })), buckets: BUCKETS, value: ctx.ans.v || {}, reveal, readonly: ctx.readonly, seed: 'dl-sort', onChange: v => { ctx.ans.v = v; ctx.save(); } });
    },
    check(ans) {
      const ev = sortEval(ans && ans.v), score = ev.reduce((s, x) => s + x.pts, 0) / PHRASES.length;
      const notes = ev.filter(x => x.s !== 'ok').map(x => ({ ok: x.s === 'warn' ? 'warn' : false, html: `«${esc(x.p.t)}» — ${x.empty ? 'не разложено. ' : ''}${esc(x.p.why)}` }));
      if (!notes.length) notes.push({ ok: true, html: 'Все двенадцать фраз на своих местах.' });
      return { ok: score >= 0.8, score, notes, summary: `Точно: ${ev.filter(x => x.s === 'ok').length} из ${PHRASES.length}.`, mentor: score >= 0.8 ? null : 'Спросите про каждую фразу: это видит человек, это правило на сервере, это хранится или это про выпуск?' };
    },
    explain: '<p>Зачем это аналитику: по фразе понятно, к кому идти. Экран и его поведение решает фронтенд, правило и ответ эндпоинта решает бэкенд, структуру хранения решают вместе с разработчиком базы, а выпуск и доступы идут через стенды, релизы и заявки.</p>',
    report: ans => sortEval(ans && ans.v).map(x => `- ${x.p.t} → ${(BUCKETS.find(b => b.id === (ans.v || {})[x.p.id]) || { t: '—' }).t} ${x.s === 'ok' ? '✓' : x.s === 'warn' ? '~' : '✗'}`).join('\n')
  };

  // =====================================================================
  // Практика 2. Сопоставьте термин и смысл
  // =====================================================================
  const TERMS = [
    { id: 'as', t: 'АС', ok: 'a' }, { id: 'fp', t: 'ФП', ok: 'b' }, { id: 'ke', t: 'КЭ', ok: 'c' },
    { id: 'svc', t: 'Микросервис', ok: 'd' }, { id: 'ep', t: 'Эндпоинт', ok: 'e' }, { id: 'ift', t: 'ИФТ', ok: 'f' },
    { id: 'psi', t: 'ПСИ', ok: 'g' }, { id: 'prom', t: 'ПРОМ', ok: 'h' }, { id: 'zni', t: 'ЗНИ', ok: 'i' },
    { id: 'tuz', t: 'ТУЗ', ok: 'j' }, { id: 'flag', t: 'Фича-флаг', ok: 'k' }, { id: 'legacy', t: 'Легаси', ok: 'l' },
  ];
  const MEANINGS = [
    { v: 'a', t: 'вся автоматизированная система с владельцем' },
    { v: 'b', t: 'крупная часть системы под свою область' },
    { v: 'c', t: 'кирпичик в реестре: сервис, база, задание' },
    { v: 'd', t: 'отдельная программа, которую выкатывают сама по себе' },
    { v: 'e', t: 'адрес, по которому сервис принимает запрос' },
    { v: 'f', t: 'стенд, где проверяют функции и связи с соседями' },
    { v: 'g', t: 'приёмка работы заказчиком по критериям' },
    { v: 'h', t: 'настоящая среда с живыми пользователями' },
    { v: 'i', t: 'разрешение выкатить изменения на прод' },
    { v: 'j', t: 'учётная запись для системы, а не для человека' },
    { v: 'k', t: 'выключатель функции без нового релиза' },
    { v: 'l', t: 'старый код, который страшно трогать' },
  ];
  function matchEval(v) {
    v = v || {};
    return TERMS.map(x => ({ x, s: v[x.id] === x.ok ? 'ok' : 'bad', empty: !v[x.id] }));
  }
  const matchTask = {
    id: 'match', title: 'Словарь разработчика: термин и смысл',
    simple: howStack.simple,
    lead: ui.brief({
      situation: 'Ксения дала вам шпаргалку, но смыслы перепутались. Верните каждому термину его значение.',
      todo: ['Выберите значение для каждого из двенадцати терминов.', 'Нажмите «Проверить». Засчитывается от 80 %.'],
      look: 'Если сомневаетесь, вернитесь в теорию: АС, ФП и КЭ во второй вкладке, стенды и ЗНИ в третьей.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(TERMS.map(x => [x.id, x.ok])) }),
    render(el, ctx) {
      el.classList.add('dl-root');
      let reveal = null;
      if (ctx.result) { reveal = {}; matchEval(ctx.ans.v).forEach(r => { reveal[r.x.id] = { s: r.s }; }); }
      const box = document.createElement('div'); el.appendChild(box);
      ui.match(box, { rows: TERMS.map(x => ({ id: x.id, t: `<b>${esc(x.t)}</b>` })), choices: MEANINGS, value: ctx.ans.v || {}, reveal, readonly: ctx.readonly, placeholder: 'Выберите значение', onChange: v => { ctx.ans.v = v; ctx.save(); } });
    },
    check(ans) {
      const ev = matchEval(ans && ans.v), good = ev.filter(r => r.s === 'ok').length, score = good / TERMS.length;
      const notes = ev.filter(r => r.s === 'bad').map(r => ({ ok: false, html: `<b>${esc(r.x.t)}</b> — ${esc((MEANINGS.find(m => m.v === r.x.ok) || {}).t || '')}` }));
      if (!notes.length) notes.push({ ok: true, html: 'Словарь собран целиком.' });
      return { ok: score >= 0.8, score, notes, summary: `Верно: ${good} из ${TERMS.length}.`, mentor: score >= 0.8 ? null : 'Начните с матрёшки: АС больше ФП, ФП больше сервиса, а КЭ это кирпичик в реестре.' };
    },
    explain: '<p>Эти слова звучат на каждой планёрке крупной компании. Аналитику не нужно уметь всё это делать, но нужно понимать, о чём речь, и задавать правильный вопрос: в какой подсистеме правило, на каком стенде проверять, по какой заявке выкатываем.</p>',
    report: ans => matchEval(ans && ans.v).map(r => `- ${r.x.t} ${r.s === 'ok' ? '✓' : '✗'}`).join('\n')
  };

  // =====================================================================
  // Практика 3. Переведите Диму
  // =====================================================================
  const DIMA = [
    { q: '«Фронт готов, но бэк ещё не задеплоен на ИФТ, так что на стенде у вас будет 404».', options: [
      { t: 'Экран сделан, а серверная часть ещё не выложена на тестовый стенд: проверять рано.', ok: true, why: 'Деплой это выкладка. Без бэка экран обращается в пустоту и получает 404.' },
      { t: 'Всё готово, просто страница с ошибкой 404 так задумана.', why: '404 здесь значит «адрес не найден»: сервиса на стенде ещё нет.' },
      { t: 'Нужно срочно писать хотфикс на прод.', why: 'Прод тут ни при чём: речь о тестовом стенде.' }] },
    { q: '«Это легаси, туда лучше не лезть. Сделаем через адаптер».', options: [
      { t: 'Старую систему менять опасно, поэтому напишем прослойку, которая будет с ней общаться.', ok: true, why: 'Адаптер переводит наш запрос на язык старой системы, не трогая её код.' },
      { t: 'Старую систему выключат на этой неделе.', why: 'Наоборот, её оставляют как есть.' },
      { t: 'Нужен новый стенд для тестирования.', why: 'Адаптер это программа-прослойка, а не стенд.' }] },
    { q: '«Выкатим под фича-флагом, на ПРОМе включим для одной пекарни».', options: [
      { t: 'Код попадёт на прод выключенным, а функцию включат только для одной точки.', ok: true, why: 'Флаг позволяет проверить функцию на живых людях без риска для всей сети.' },
      { t: 'Функцию сразу увидят все пекарни.', why: 'Флаг как раз ограничивает, кто её видит.' },
      { t: 'Функция поедет только на тестовый стенд.', why: 'ПРОМ это настоящая среда, а не стенд.' }] },
    { q: '«По ЗНИ окно в четверг. Хотфикс только если ляжет прод».', options: [
      { t: 'Плановый выпуск в четверг, внеплановая починка только при аварии.', ok: true, why: 'ЗНИ задаёт согласованное окно выпуска, хотфикс бывает лишь при поломке прода.' },
      { t: 'Хотфиксы выпускают каждый четверг.', why: 'Хотфикс не по расписанию: это срочная починка.' },
      { t: 'ЗНИ это ошибка, которую надо исправить.', why: 'ЗНИ это заявка на изменение, то есть разрешение на выпуск.' }] },
  ];
  const dimaTask = {
    id: 'dima', title: 'Переведите Диму',
    simple: howStack.simple,
    lead: ui.brief({
      situation: 'Дима написал в чат четыре сообщения. Нина Сергеевна просит объяснить ей человеческим языком, что происходит.',
      todo: ['Для каждого сообщения выберите верный перевод.', 'Нажмите «Проверить». Засчитываются все четыре.'],
      look: 'Ищите в сообщении слова-маркеры: стенд, деплой, легаси, флаг, ЗНИ, хотфикс.'
    }),
    blank: () => ({ v: [] }),
    reference: () => ({ v: DIMA.map(d => [d.options.findIndex(o => o.ok)]) }),
    render(el, ctx) {
      el.classList.add('dl-root');
      const value = ctx.ans.v || [];
      DIMA.forEach((d, i) => {
        const box = document.createElement('div'); box.className = 'dl-card'; el.appendChild(box);
        ui.quiz(box, { q: `<b>Дима:</b> ${esc(d.q)}`, options: d.options, value: value[i] || [], reveal: ctx.readonly || ctx.result ? (ctx.result || true) : null, readonly: ctx.readonly, seed: `dl-dima-${i}`,
          onChange: v => { const next = (ctx.ans.v || []).slice(); next[i] = v; ctx.ans.v = next; ctx.save(); } });
      });
    },
    check(ans) {
      const v = (ans && ans.v) || [];
      const res = DIMA.map((d, i) => ui.quizScore(d, v[i]));
      const good = res.filter(r => r.ok).length, score = good / DIMA.length;
      const notes = DIMA.map((d, i) => ({ ok: res[i].ok, html: `${esc(d.q)} — ${res[i].ok ? 'верно' : esc(d.options.find(o => o.ok).t)}` }));
      return { ok: good === DIMA.length, score, notes, summary: `Верно: ${good} из ${DIMA.length}.`, mentor: good === DIMA.length ? null : 'Вернитесь во вкладку «Путь до прода»: там стенды, флаги, ЗНИ и хотфикс.' };
    },
    explain: '<p>Перевод с языка разработчика на язык бизнеса это ежедневная работа аналитика. Заказчику не нужны слова «деплой» и «ЗНИ», ему нужно знать, когда он увидит функцию и что может пойти не так.</p>',
    report: ans => DIMA.map((d, i) => `- ${d.q} ${ui.quizScore(d, ((ans && ans.v) || [])[i]).ok ? '✓' : '✗'}`).join('\n')
  };

  // =====================================================================
  TR.stage({
    id: ID, act: 1, order: 15, slot: 'Пн 11:00', title: 'Язык разработчика: от фронта до АС',
    when: 'понедельник, 5 октября, 11:00 · переговорная «Квант Софт»',
    intro: [
      { who: 'dima', html: 'Утром разобрали, из чего сделан софт. Теперь честно: на планёрке я скажу «бэк отдаёт пятисотку, на ИФТ не задеплоено, выкатим под флагом». Давайте научимся понимать это с первого раза.' },
      { who: 'ksenia', html: 'И ещё одна вещь. В больших компаниях систему называют <b>АС</b>, делят её на подсистемы, а каждый кирпичик учитывают как <b>КЭ</b>. Если вы потом придёте в банк, эти слова встретятся в первый же день.' },
      { who: 'igor', html: 'Нина Сергеевна тоже будет спрашивать, «когда уже». Ваша задача: понимать Диму и переводить его ответы на человеческий язык.' }
    ],
    facts: [],
    glossary: [
      { term: 'Сервис (микросервис)', simple: 'Отдельный цех пекарни: делает своё дело и не мешает соседям.', tech: 'Отдельная программа на сервере со своей задачей (заказы, оплата, уведомления), которую выкатывают и перезапускают отдельно.' },
      { term: 'Эндпоинт', simple: 'Окошко конкретного цеха, куда подают определённый заказ.', tech: 'Адрес и метод, по которым сервис принимает запрос: POST /orders.' },
      { term: 'API-шлюз', simple: 'Служебный вход с охранником: проверяет пропуск и показывает, в какой цех идти.', tech: 'Единая точка входа в систему: проверка доступа, ограничение частоты, маршрутизация к сервисам.' },
      { term: 'АС', simple: 'Вся сеть пекарен целиком, у которой есть хозяин.', tech: 'Автоматизированная система (ГОСТ 34): система с владельцем, бюджетом и командами. Термин широко используют крупные компании и банки.' },
      { term: 'Функциональная подсистема (ФП)', simple: 'Отдел сети: заказы, касса, производство.', tech: 'Крупная часть АС со своей областью ответственности, часто со своей командой и бэклогом.' },
      { term: 'КЭ', simple: 'Строчка в инвентарной книге: каждая печь и каждый холодильник на учёте.', tech: 'Конфигурационная единица: учитываемый элемент инфраструктуры (сервис, база, задание, адаптер) в реестре конфигураций.' },
      { term: 'Стенд', simple: 'Тренировочная кухня, где пробуют рецепт до витрины.', tech: 'Отдельная среда для разработки и проверок: DEV, ИФТ, НТ, ПСИ. ПРОМ это промышленная среда с живыми пользователями.' },
      { term: 'ЗНИ', simple: 'Подписанное разрешение поменять рецепт во всей сети.', tech: 'Заявка на изменение: согласование выпуска релиза на ПРОМ в определённое окно.' },
      { term: 'Фича-флаг', simple: 'Выключатель новой булочки: испекли, но на витрину пока не ставим.', tech: 'Настройка, которая включает функцию без нового релиза, например только для части пользователей.' },
      { term: 'ТУЗ', simple: 'Пропуск не для человека, а для машины поставщика.', tech: 'Техническая учётная запись: доступ одной системы к другой при интеграции.' },
      { term: 'Легаси', simple: 'Старая печь, которая работает, но никто не помнит, как её чинить.', tech: 'Унаследованный код или система, изменения в которых рискованны.' },
      { term: 'Хотфикс', simple: 'Срочно заменить сломавшуюся деталь печи посреди смены.', tech: 'Срочное исправление на проде вне плана релизов.' }
    ],
    outro: 'Теперь «бэк не задеплоен на ИФТ» звучит как обычная фраза: серверная часть ещё не выложена на тестовый стенд. Вы знаете слои системы, матрёшку АС и подсистем и путь кода до прода. В 14:00 разберёмся, чем весь день занят системный аналитик.',
    tasks: [howStack, sortTask, matchTask, dimaTask]
  });
})();
