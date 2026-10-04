/* Неделя 2, вторник 10:00: виды требований.
   Теория: «что делает» и «насколько хорошо» (онлайн-кинотеатр: ручки качества при одной и той же функции), пять видов
   на одном экране оплаты, формы, в которых живут требования (история, сценарий, строка спецификации, макет);
   модель качества ISO/IEC 25010 (8 характеристик в ред. 2011 = ГОСТ Р ИСО/МЭК 25010-2015, 9 в ред. 2023) и FURPS+;
   явные, неявные и восхищающие требования — мостик к модели Кано (гостиница, график «сделано → довольство»).
   Практика: классификатор 20 фраз «Колоса», найти НФТ внутри функциональных, лаборатория «утро 8 Марта без НФТ»
   (бюджет на качество и последствия), явные/неявные/восхищающие, ответ Нине своими словами. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'req-types';

  if (!document.getElementById('rqt-css')) document.head.insertAdjacentHTML('beforeend', `<style id="rqt-css">
    .rqt-root, .rqt-root .stack > * { min-width: 0; }
    .rqt-root .seg button { white-space: normal; text-align: left; }
    .rqt-fn { border: 1px solid color-mix(in srgb, var(--ok) 50%, var(--border)); background: var(--ok-soft); border-radius: 10px; padding: 8px 12px; display: flex; flex-wrap: wrap; gap: 6px 10px; align-items: center; font-size: 14px; }
    .rqt-cine { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 14px; align-items: start; }
    .rqt-cine > * { min-width: 0; }
    .rqt-knob { display: grid; gap: 4px; }
    .rqt-knob .k { font-size: 13.5px; font-weight: 600; }
    .rqt-knob .k span { font-weight: 400; color: var(--text-muted); font-size: 12.5px; }
    .rqt-shot { display: grid; grid-template-columns: 250px minmax(0, 1fr); gap: 16px; align-items: start; }
    .rqt-shot > * { min-width: 0; }
    .rqt-phone { width: 250px; max-width: 100%; border: 2px solid var(--border-strong); border-radius: 26px; padding: 12px 12px 16px; background: var(--surface); display: grid; gap: 8px; align-content: start; justify-self: center; }
    .rqt-phone .bar { height: 5px; width: 56px; border-radius: 5px; background: var(--border-strong); justify-self: center; }
    .rqt-phone .hd { font: 600 13px/1.3 var(--f-brand); color: var(--text-2); border-bottom: 1px solid var(--border); padding-bottom: 6px; }
    .rqt-phone .ln { display: flex; gap: 6px; align-items: flex-start; justify-content: space-between; font-size: 13px; line-height: 1.35; }
    .rqt-phone .ln > span { min-width: 0; }
    .rqt-phone .pay { display: flex; gap: 6px; align-items: center; justify-content: space-between; }
    .rqt-phone .mock-btn { flex: 1; text-align: center; border-radius: 9px; padding: 8px; font-weight: 600; font-size: 13px; background: var(--accent); color: var(--accent-text); }
    .rqt-hs { display: inline-grid; place-items: center; flex: none; width: 20px; height: 20px; border-radius: 50%; background: var(--violet); color: var(--surface); font: 700 11px/1 var(--f-mono); font-style: normal; }
    .rqt-game { display: grid; gap: 8px; }
    .rqt-gq { display: grid; grid-template-columns: minmax(0, 1fr); gap: 6px; padding: 8px 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); }
    .rqt-gq.ok { border-color: var(--ok); } .rqt-gq.bad { border-color: var(--bad); }
    .rqt-gq .why { font-size: 13px; color: var(--text-2); }
    .rqt-gq .row { gap: 4px; }
    .rqt-gq .hd { display: flex; gap: 8px; align-items: flex-start; }
    .rqt-iso { display: grid; grid-template-columns: repeat(auto-fill, minmax(165px, 1fr)); gap: 8px; }
    .rqt-tile { text-align: left; border: 1px solid var(--border-strong); border-radius: 10px; padding: 8px 10px; background: var(--surface-2); display: grid; gap: 4px; align-content: start; min-width: 0; color: var(--text); }
    .rqt-tile .t { font: 600 14px/1.25 var(--f-brand); }
    .rqt-tile .chip { justify-self: start; white-space: normal; font-size: 11.5px; padding: 1px 8px; }
    .rqt-tile[aria-pressed="true"] { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent) inset; background: var(--accent-soft); }
    .rqt-tile.new { border-color: var(--ok); }
    .rqt-def { display: grid; grid-template-columns: 150px minmax(0, 1fr); gap: 6px 14px; font-size: 14px; }
    .rqt-def > .k { font: 600 11px/1.5 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); padding-top: 2px; }
    .rqt-def > .v { min-width: 0; }
    .rqt-letters { display: flex; flex-wrap: wrap; gap: 6px; }
    .rqt-letter { width: 46px; height: 46px; border-radius: 10px; border: 1px solid var(--border-strong); background: var(--surface-2); font: 700 20px/1 var(--f-brand); color: var(--text); }
    .rqt-letter[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); }
    .rqt-form { border: 1px solid var(--border); border-radius: 12px; background: var(--surface); padding: 12px 14px; display: grid; gap: 8px; font-size: 14px; }
    .rqt-form ol, .rqt-form ul { margin: 0; padding-left: 20px; display: grid; gap: 3px; }
    .rqt-mini { width: 220px; max-width: 100%; border: 2px solid var(--border-strong); border-radius: 22px; padding: 10px 12px 14px; display: grid; gap: 8px; background: var(--surface-2); }
    .rqt-mini .poster { height: 70px; border-radius: 8px; background: linear-gradient(135deg, var(--violet-soft), var(--info-soft)); display: grid; place-items: center; font-size: 26px; }
    .rqt-mini .b { border: 1px dashed var(--border-strong); border-radius: 8px; padding: 6px; text-align: center; font-size: 13px; font-weight: 600; }
    .rqt-mini .b.on { border-style: solid; border-color: var(--ok); color: var(--ok); }
    .rqt-kano { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: 14px; align-items: start; }
    .rqt-kano > * { min-width: 0; }
    .rqt-range { width: 100%; accent-color: var(--accent); }
    .rqt-leg { display: flex; flex-wrap: wrap; gap: 4px 14px; font-size: 12.5px; color: var(--text-2); }
    .rqt-leg i { display: inline-block; width: 16px; height: 3px; border-radius: 2px; margin-right: 6px; vertical-align: middle; }
    .rqt-kc { border: 1px solid var(--border); border-left: 4px solid var(--border-strong); border-radius: 10px; padding: 8px 12px; background: var(--surface); display: grid; gap: 3px; font-size: 13.5px; line-height: 1.4; }
    .rqt-kc .h { display: flex; justify-content: space-between; gap: 8px; align-items: baseline; flex-wrap: wrap; }
    .rqt-kc .h .cls { font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; }
    .rqt-kc.imp { border-left-color: var(--violet); } .rqt-kc.imp .cls { color: var(--violet); }
    .rqt-kc.exp { border-left-color: var(--info); } .rqt-kc.exp .cls { color: var(--info); }
    .rqt-kc.wow { border-left-color: var(--ok); } .rqt-kc.wow .cls { color: var(--ok); }
    .rqt-sents { display: grid; gap: 8px; }
    .rqt-sent { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 8px; padding: 8px 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); line-height: 1.95; font-size: 14.5px; }
    .rqt-sent .n { font: 600 12px/1.95 var(--f-mono); color: var(--text-muted); }
    .rqt-chunk { cursor: pointer; border-radius: 5px; padding: 2px 3px; border-bottom: 2px dashed var(--border-strong); box-decoration-break: clone; -webkit-box-decoration-break: clone; }
    .rqt-chunk:hover { background: var(--surface-3); }
    .rqt-chunk:focus-visible { outline: 2px solid var(--accent); }
    .rqt-chunk.on { background: color-mix(in srgb, var(--warn) 22%, transparent); border-bottom: 2px solid var(--warn); }
    .rqt-mk { font: 700 12px/1 var(--f-mono); margin-left: 3px; }
    .rqt-mk.ok { color: var(--ok); } .rqt-mk.bad { color: var(--bad); } .rqt-mk.warn { color: var(--warn); }
    .rqt-lab { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); gap: 16px; align-items: start; }
    .rqt-lab > * { min-width: 0; }
    .rqt-nfrs { display: grid; gap: 6px; }
    .rqt-nfr { display: grid; grid-template-columns: 34px minmax(0, 1fr) auto; gap: 2px 10px; align-items: center; padding: 8px 10px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); text-align: left; color: var(--text); width: 100%; }
    .rqt-nfr[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .rqt-nfr .sw { width: 30px; height: 18px; border-radius: 9px; background: var(--surface-3); border: 1px solid var(--border-strong); position: relative; }
    .rqt-nfr .sw::after { content: ""; position: absolute; top: 2px; left: 2px; width: 12px; height: 12px; border-radius: 50%; background: var(--text-muted); transition: left .15s; }
    .rqt-nfr[aria-pressed="true"] .sw { background: var(--accent); border-color: var(--accent); }
    .rqt-nfr[aria-pressed="true"] .sw::after { left: 14px; background: var(--surface); }
    .rqt-nfr .t { font-weight: 600; font-size: 14px; line-height: 1.3; }
    .rqt-nfr .c { font: 600 12px/1 var(--f-mono); color: var(--text-muted); white-space: nowrap; }
    .rqt-nfr .d { grid-column: 2 / -1; font-size: 12.5px; color: var(--text-2); line-height: 1.35; }
    .rqt-nfr.deny { border-color: var(--bad); }
    .rqt-tl { display: grid; gap: 6px; }
    .rqt-ev { display: grid; grid-template-columns: 104px minmax(0, 1fr); gap: 10px; padding: 7px 10px; border-left: 3px solid var(--border-strong); background: var(--surface); border-radius: 0 8px 8px 0; font-size: 13.5px; line-height: 1.4; }
    .rqt-ev .tm { font: 600 11.5px/1.5 var(--f-mono); color: var(--text-muted); }
    .rqt-ev.bad { border-left-color: var(--bad); background: var(--bad-soft); }
    .rqt-ev.ok { border-left-color: var(--ok); background: var(--ok-soft); }
    .rqt-stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px; }
    .rqt-stats .stat .v { font-size: 14.5px; font-family: var(--f-body); line-height: 1.3; }
    @media (max-width: 760px) {
      .rqt-cine, .rqt-shot, .rqt-kano, .rqt-lab { grid-template-columns: minmax(0, 1fr); }
      .rqt-def { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .rqt-def > .v { margin-bottom: 8px; }
    }
    @media (max-width: 440px) {
      .rqt-ev { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .rqt-sent { padding: 8px 10px; font-size: 14px; }
    }
  </style>`);

  // ---------- общие помощники ----------
  const quizRef = cfg => cfg.options.map((o, i) => o.ok ? i : -1).filter(i => i >= 0);
  const fresh = fn => pane => { const d = document.createElement('div'); pane.appendChild(d); fn(d); };

  // =====================================================================
  // Теория 1. Что делает и насколько хорошо (соседний пример — онлайн-кинотеатр)
  // =====================================================================
  const KNOBS = [
    { id: 'start', t: 'Фильм начинает играть через', iso: 'производительность', opts: [
      { v: 'a', t: '2 с', s: 1, r: 'Нажал — и смотрит. Никто даже не замечает.' },
      { v: 'b', t: '10 с', s: 0.5, r: 'Раздражает: «опять грузится». Смотрят, но ворчат.' },
      { v: 'c', t: '40 с', s: 0, r: 'Закрывают приложение и включают конкурента.' }] },
    { id: 'up', t: 'Сервис доступен', iso: 'надёжность', opts: [
      { v: 'a', t: '99,9 % времени', s: 1, r: 'Около 45 минут простоя в месяц — ночью, никто не заметит.' },
      { v: 'b', t: '99 %', s: 0.5, r: 'Около 7 часов простоя в месяц — кто-то обязательно попадёт на вечер пятницы.' },
      { v: 'c', t: '95 %', s: 0, r: 'Около 36 часов в месяц — полтора дня без кино. Отписываются.' }] },
    { id: 'tv', t: 'Работает на телевизорах', iso: 'переносимость', opts: [
      { v: 'a', t: 'новых и пятилетних', s: 1, r: 'Семья смотрит на том телевизоре, что уже стоит в комнате.' },
      { v: 'c', t: 'только новых', s: 0, r: 'Семьи со старыми телевизорами не могут смотреть вовсе — и не платят.' }] },
    { id: 'subs', t: 'Субтитры для слабослышащих', iso: 'удобство использования', opts: [
      { v: 'a', t: 'есть', s: 1, r: 'Смотрят и те, кто плохо слышит, — и родители, пока ребёнок спит.' },
      { v: 'c', t: 'нет', s: 0, r: 'Часть зрителей не может смотреть совсем.' }] },
    { id: 'pwd', t: 'Пароли зрителей хранятся', iso: 'защищённость', opts: [
      { v: 'a', t: 'зашифрованными', s: 1, r: 'Даже если базу украдут, паролей в ней не прочитать.' },
      { v: 'c', t: 'открытым текстом', s: 0, r: 'Утечка базы — и все пароли у злоумышленников: новости, штраф, отток зрителей.' }] }
  ];
  const KIND5 = [
    { v: 'f', t: 'Функция' },
    { v: 'nfr', t: 'Качество (НФТ)' },
    { v: 'rule', t: 'Правило' },
    { v: 'con', t: 'Ограничение' },
    { v: 'ifc', t: 'Интерфейс' }
  ];
  const SPOTS = [
    { n: 1, t: 'Кнопка «Оплатить 399 ₽»', req: 'Система списывает плату за месяц и сразу открывает доступ ко всем фильмам', ok: 'f', why: 'Что делает система — функциональное требование.' },
    { n: 2, t: 'Подпись «Пробные 7 дней — один раз на номер»', req: 'Пробный период даётся один раз на один номер телефона', ok: 'rule', why: 'Бизнес-правило: так решил кинотеатр, и оно действовало бы даже при оплате в кассе. Из него вырастет функция «проверить, был ли уже пробный период».' },
    { n: 3, t: 'Значки «Карта · СБП»', req: 'Принимаем только карты российских банков и СБП', ok: 'con', why: 'Ограничение: рамка, которую кинотеатр не выбирает, — так велят закон и договор с банком. Она сужает выбор решения.' },
    { n: 4, t: 'Строка «Платёж проводит банк»', req: 'Оплату проводит платёжный сервис банка: кинотеатр отправляет сумму и получает ответ «оплачено» или «отказ» по его API', ok: 'ifc', why: 'Обмен с чужой системой по её правилам — внешний интерфейс.' },
    { n: 5, t: 'Экран «открылся за 1,2 с»', req: 'Экран оплаты открывается не дольше 2 секунд в 95 % случаев', ok: 'nfr', why: 'Не «что», а «насколько быстро» — нефункциональное требование, производительность.' },
    { n: 6, t: 'Замок «Данные карты не хранятся у кинотеатра»', req: 'Номер карты вводится на странице банка и не сохраняется у кинотеатра', ok: 'nfr', also: 'con', why: 'Это защищённость — нефункциональное требование. Часто оно приходит как ограничение: так требует стандарт безопасности платёжных карт. Оба ответа честные.' }
  ];
  const FORMS = [
    { v: 'story', t: 'Пользовательская история', who: 'команда в Scrum: разработчики, тестировщик, владелец продукта',
      html: '<p><b>Как</b> зритель, который часто летает, <b>я хочу</b> скачать фильм заранее, <b>чтобы</b> посмотреть его в самолёте без интернета.</p><div class="small muted"><b>Критерии приёмки:</b></div><ul class="small"><li>Дано: фильм скачан. Когда телефон без связи. Тогда фильм воспроизводится.</li><li>Скачанный фильм доступен 30 дней, потом просит выйти в интернет.</li></ul>' },
    { v: 'uc', t: 'Сценарий использования', who: 'разработчики и тестировщики, когда важны шаги и ветки',
      html: '<p><b>Сценарий «Скачать фильм».</b> Актор — зритель. Предусловие — подписка активна.</p><ol class="small"><li>Зритель открывает страницу фильма.</li><li>Нажимает «Скачать».</li><li>Система проверяет свободное место в телефоне.</li><li>Система скачивает фильм и показывает «Доступен офлайн».</li></ol><p class="small"><b>Расширение 3а.</b> Места не хватает — система предлагает скачать в меньшем качестве.</p>' },
    { v: 'srs', t: 'Строка спецификации', who: 'все, кому нужен точный перечень: подрядчик, заказчик на приёмке',
      html: ui.table(['ID', 'Требование', 'Источник', 'Приоритет'], [['ФТ-17', 'Система позволяет скачать фильм для просмотра без интернета. Скачанный фильм доступен 30 дней.', 'опрос зрителей, май', 'Should']]) },
    { v: 'mock', t: 'Макет экрана', who: 'дизайнер, разработчики интерфейса, заказчик на показе',
      html: '<div class="rqt-mini"><div class="poster" aria-hidden="true">🎬</div><b style="font-size:14px">Фильм «Дорога домой»</b><div class="b">⬇ Скачать</div><div class="b on">✓ Доступен офлайн · 30 дней</div></div><p class="small muted">Макет показывает, как требование выглядит на экране, — но не объясняет «зачем» и не перечисляет все ветки.</p>' }
  ];

  const howKinds = {
    id: 'how-kinds', covers: ['classify', 'hidden'], title: 'Как это работает: что делает и насколько хорошо', free: true, noReset: true,
    simple: {
      icon: '🥐',
      plain: 'Функциональное требование говорит, что система делает. Нефункциональное — насколько хорошо она это делает: как быстро, как надёжно, насколько удобно и безопасно. Ещё бывают правила бизнеса, ограничения (то, что нельзя поменять) и обмен с чужими системами.',
      analogy: 'В пекарне «что печём» — это круассан. А «насколько хорошо» — тёплый, хрустящий, к 7:30 и без очереди. Круассан будет круассаном и холодным, и в 11 утра, — но покупатель уйдёт к соседям.',
      tech: 'По Вигерсу: <b>функциональные требования</b> — поведение системы; <b>нефункциональные</b> — прежде всего атрибуты качества (производительность, надёжность, удобство, защищённость и др.); <b>бизнес-правила</b> — политики и правила бизнеса (у Вигерса сюда относят и законы); <b>ограничения</b> — то, что сужает выбор решения (закон, бюджет, срок, технология); <b>внешние интерфейсы</b> — обмен с пользователями, другими системами и устройствами.'
    },
    lead: ui.brief({
      situation: 'Соседний пример — онлайн-кинотеатр: зритель оформляет подписку и смотрит фильмы. Три вкладки: чем «что делает» отличается от «насколько хорошо», пять видов требований на одном экране оплаты и формы, в которых требования живут.',
      todo: [
        'Вкладка «Что делает / насколько хорошо»: двигайте переключатели качества и следите за довольством зрителей. Заметьте: функция «показать фильм» выполнена во всех вариантах.',
        'Вкладка «Пять видов на одном экране»: для каждой пометки на макете решите, что это за требование, потом прочитайте пояснение.',
        'Вкладка «Где живут требования»: переключите четыре формы одного и того же требования и сравните, кому какая нужна.'
      ],
      look: 'Шкала довольства — среднее по пяти переключателям. Фиолетовые кружки с цифрами на макете — места, где спрятаны требования.'
    }),
    render(el) {
      el.classList.add('rqt-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'well', t: 'Что делает / насколько хорошо', render: fresh(drawCine) },
        { id: 'shot', t: 'Пять видов на одном экране', render: fresh(drawShot) },
        { id: 'forms', t: 'Где живут требования', render: fresh(drawForms) }
      ], 'well');
    }
  };
  function drawCine(pane) {
    const st = { start: 'b', up: 'b', tv: 'c', subs: 'c', pwd: 'a' };
    pane.innerHTML = `<div class="stack">
      <div class="rqt-fn"><b>Функция:</b> зритель выбирает фильм и смотрит его по подписке ${ui.status('выполнена во всех вариантах', 'ok')}</div>
      <div class="rqt-cine"><div class="stack">${KNOBS.map(k => `<div class="rqt-knob"><span class="k">${esc(k.t)} <span>· ${esc(k.iso)}</span></span>${ui.seg(k.id, k.opts.map(o => ({ v: o.v, t: o.t })), st[k.id], 'accent')}</div>`).join('')}</div>
      <div class="stack" data-out></div></div>
    </div>`;
    function draw() {
      const ch = KNOBS.map(k => ({ k, o: k.opts.find(o => o.v === st[k.id]) }));
      const avg = ch.reduce((s, x) => s + x.o.s, 0) / ch.length;
      const kind = avg >= 0.85 ? 'ok' : avg >= 0.5 ? 'warn' : 'bad';
      TR.$('[data-out]', pane).innerHTML = `<div class="stat"><span class="k">Довольство зрителей</span><span class="v ${kind}">${Math.round(avg * 100)} %</span>${ui.meter(avg, kind === 'ok' ? '' : kind)}</div>
        <ul class="checks">${ch.map(x => `<li class="${x.o.s === 1 ? '' : x.o.s ? 'warn' : 'bad'}">${esc(x.o.r)}</li>`).join('')}</ul>
        ${avg >= 0.99 ? ui.note('ok', 'Функция та же — качество другое', 'Зритель видит одно и то же: фильм играет. Но теперь он играет быстро, всегда, на любом телевизоре, с субтитрами и без риска утечки. Всё это — нефункциональные требования. Если их не записать, разработчик выберет то, что ему проще, — и честно сдаст «функцию».') : ui.note('info', 'Что здесь важно аналитику', 'Заказчик почти никогда не говорит «старт видео за 2 секунды». Он говорит «чтобы не тормозило» — или молчит, потому что это само собой разумеется. Аналитик спрашивает о качестве сам и записывает его <b>числом</b>.')}`;
    }
    ui.onSeg(pane, (n, v) => { if (st[n] != null) { st[n] = v; draw(); } });
    draw();
  }
  function drawShot(pane) {
    const got = {};
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Экран оплаты подписки в приложении кинотеатра. На нём спрятаны шесть требований разных видов — по одному на каждую цифру.</p>
      <div class="rqt-shot">
        <div class="rqt-phone" aria-label="Макет экрана оплаты">
          <div class="bar"></div><div class="hd">Кинотеатр · Оплата подписки</div>
          <div class="ln"><span>Подписка на месяц</span><b>399 ₽</b></div>
          <div class="ln"><span class="small">Пробные 7 дней — один раз на номер телефона</span><i class="rqt-hs">2</i></div>
          <div class="ln"><span class="small">💳 Карта · СБП</span><i class="rqt-hs">3</i></div>
          <div class="ln"><span class="small">🏦 Платёж проводит банк</span><i class="rqt-hs">4</i></div>
          <div class="ln"><span class="small">🔒 Данные карты не хранятся у кинотеатра</span><i class="rqt-hs">6</i></div>
          <div class="pay"><span class="mock-btn">Оплатить 399 ₽</span><i class="rqt-hs">1</i></div>
          <div class="ln"><span class="small dim">⏱ экран открылся за 1,2 с</span><i class="rqt-hs">5</i></div>
        </div>
        <div class="rqt-game" data-g></div>
      </div>
      <div data-gs></div>
    </div>`;
    function draw() {
      TR.$('[data-g]', pane).innerHTML = SPOTS.map(s => {
        const a = got[s.n], good = a && (a === s.ok || a === s.also);
        return `<div class="rqt-gq ${a ? (good ? 'ok' : 'bad') : ''}"><div class="hd"><i class="rqt-hs">${s.n}</i><span><b>${esc(s.t)}</b><br><span class="small muted">Требование: ${esc(s.req)}</span></span></div>
          <div class="row">${KIND5.map(k => `<button type="button" class="btn xs" data-sp="${s.n}|${k.v}" aria-pressed="${a === k.v}">${esc(k.t)}</button>`).join('')}</div>
          ${a ? `<div class="why">${good ? '✓ ' : '✕ Не совсем. '}${esc(s.why)}</div>` : ''}</div>`;
      }).join('');
      const n = Object.keys(got).length, ok = SPOTS.filter(s => got[s.n] && (got[s.n] === s.ok || got[s.n] === s.also)).length;
      TR.$('[data-gs]', pane).innerHTML = n === SPOTS.length ? ui.note(ok === n ? 'ok' : 'warn', `Верно ${ok} из ${n}`, 'Пять вопросов-фильтров: <b>что делает система?</b> — функция; <b>насколько хорошо?</b> — качество; <b>так решил бизнес?</b> — правило; <b>можем ли мы это поменять?</b> если нет — ограничение; <b>с кем обмен?</b> — интерфейс. На одном маленьком экране — все пять, и каждому виду нужны свои вопросы аналитика.') : '';
    }
    TR.on(pane, 'click', '[data-sp]', (e, b) => { const [n, v] = b.dataset.sp.split('|'); got[n] = v; draw(); });
    draw();
  }
  function drawForms(pane) {
    let cur = 'story';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Одно требование онлайн-кинотеатра — «скачать фильм, чтобы смотреть без интернета» — в четырёх формах.</p>
      ${ui.seg('fm', FORMS.map(f => ({ v: f.v, t: f.t })), cur, 'accent')}
      <div data-form></div>
      ${ui.note('info', 'Подробно — на неделе 4', 'Формы не заменяют друг друга: история даёт «кто и зачем», сценарий — шаги и ветки, спецификация — точный перечень с номерами, макет — как это выглядит. Ещё требования живут в таблицах бизнес-правил, в глоссарии, в документах вроде ТЗ по ГОСТ 34.602-2020. Как их писать, разберём в тренировках «User story», «Use case» и «Документы аналитика».')}
    </div>`;
    function draw() {
      const f = FORMS.find(x => x.v === cur);
      TR.$('[data-form]', pane).innerHTML = `<div class="rqt-form"><div class="row between"><b>${esc(f.t)}</b><span class="small dim">Кому: ${esc(f.who)}</span></div>${f.html}</div>`;
    }
    ui.onSeg(pane, (n, v) => { if (n === 'fm') { cur = v; draw(); } });
    draw();
  }

  // =====================================================================
  // Теория 2. Модель качества ISO/IEC 25010 и FURPS+
  // =====================================================================
  const ISO = [
    { id: 'func', n11: 'Функциональная пригодность', n23: 'Функциональная пригодность', q: 'Делает ли всё нужное — полно и правильно?', sub: 'полнота, корректность, целесообразность', an: 'Торт того вкуса, размера и с той надписью, что заказали.', ex: 'Сумма к оплате считается верно: корзина, скидка, баллы — до копейки.', ask: 'Все ли задачи пользователя закрыты? Где ошибка в расчёте недопустима?' },
    { id: 'perf', n11: 'Производительность', n23: 'Производительность', q: 'Как быстро и сколько выдерживает?', sub: 'время ответа, использование ресурсов, ёмкость', an: 'Сколько противней в час выдаёт печь и не остывает ли она в пик.', ex: '95 % ответов приложения быстрее 1 секунды при 400 заказах в час.', ask: 'Сколько людей одновременно? Когда пик? Сколько секунд человек готов ждать?' },
    { id: 'compat', n11: 'Совместимость', n23: 'Совместимость', q: 'Уживается ли с другими системами и понимает ли их?', sub: 'сосуществование, обмен данными с другими системами', an: 'Новая печь встала в цех, работает от той же вытяжки и не мешает старой.', ex: 'Сводка продаж приходит в 1С в том виде, который 1С понимает.', ask: 'С какими системами обмениваемся? Что уже стоит и не должно сломаться?' },
    { id: 'usab', n11: 'Удобство использования', n23: 'Способность к взаимодействию', was: 'удобство использования', q: 'Легко ли людям понять, научиться, не ошибиться?', sub: 'понятность, изучаемость, защита от ошибок, доступность для людей с ограничениями', an: 'Ценник, который видно издалека, и кассир, которого научили за день.', ex: 'Новый кассир осваивает экран выдачи за одну смену обучения.', ask: 'Кто пользователи? Сколько времени на обучение? Какие ошибки опасны?' },
    { id: 'rel', n11: 'Надёжность', n23: 'Надёжность', q: 'Работает ли, когда нужно, и переживает ли сбои?', sub: 'готовность, отказоустойчивость, восстанавливаемость', an: 'Запасной генератор: свет мигнул — печь не остановилась.', ex: 'Приём заказов доступен 99,5 % времени в месяц — это не больше ~3,6 часа простоя.', ask: 'Когда система нужна? Сколько простоя допустимо? Что будет при обрыве связи?' },
    { id: 'sec', n11: 'Защищённость', n23: 'Защищённость', q: 'Защищены ли данные от чужих и от подделки?', sub: 'конфиденциальность, целостность, подлинность, отслеживаемость действий', an: 'Касса под ключом, а журнал заказов не лежит на прилавке.', ex: 'Посторонний не откроет чужой заказ, подобрав номер в ссылке.', ask: 'Какие данные чувствительны? Кто что видит? Какие действия записываем в журнал?' },
    { id: 'maint', n11: 'Сопровождаемость', n23: 'Сопровождаемость', q: 'Легко ли менять, чинить и проверять?', sub: 'модульность, анализируемость, изменяемость, тестируемость', an: 'Рецептура записана в техкарте: новый технолог заменит сахар на мёд, не ломая весь хлеб.', ex: 'Время приёма заказов (сейчас 22:30) меняется в настройках, без программиста.', ask: 'Что будет меняться чаще всего? Кто будет менять — программист или администратор?' },
    { id: 'port', n11: 'Переносимость', n23: 'Гибкость', was: 'переносимость', q: 'Можно ли перенести, установить, расширить?', sub: 'адаптируемость, устанавливаемость, заменяемость; в 2023 сюда добавили масштабируемость', an: 'Рецепт, который работает и в новом цехе с другой печью.', ex: 'Приложение одинаково работает на iOS и Android; через два года система обслуживает 15 пекарен.', ask: 'На каких устройствах? Как будем расти? Что придётся заменить через пару лет?' },
    { id: 'safety', n11: null, n23: 'Безопасность', isNew: true, q: 'Не причиняет ли вреда людям и окружению?', sub: 'работа в безопасных рамках, предупреждение об опасности, безопасный отказ', an: 'Печь сама отключается при перегреве и не открывается на полном жару.', ex: 'Если в заказе торта отмечена аллергия, кондитер видит крупное предупреждение, а не строчку мелким шрифтом.', ask: 'Может ли ошибка системы навредить человеку? Что система делает, если не уверена?' }
  ];
  const FURPS = [
    { k: 'F', en: 'Functionality', ru: 'Функциональность', d: 'Что система делает. У Грейди сюда входила и защищённость.', iso: 'функциональная пригодность, отчасти защищённость', ex: 'Предзаказ, оплата, чеки, план выпечки.' },
    { k: 'U', en: 'Usability', ru: 'Удобство', d: 'Насколько легко людям понять, научиться, не ошибиться.', iso: 'удобство использования', ex: 'Новый кассир осваивает экран выдачи за одну смену.' },
    { k: 'R', en: 'Reliability', ru: 'Надёжность', d: 'Работает ли, когда нужно, переживает ли сбои, не теряет ли данные.', iso: 'надёжность', ex: 'Приём заказов доступен 99,5 % времени в месяц.' },
    { k: 'P', en: 'Performance', ru: 'Производительность', d: 'Скорость, нагрузка, ресурсы.', iso: 'производительность', ex: '95 % ответов быстрее 1 секунды при 400 заказах в час.' },
    { k: 'S', en: 'Supportability', ru: 'Поддерживаемость', d: 'Легко ли менять, настраивать, переносить и проверять.', iso: 'сопровождаемость, переносимость, совместимость', ex: 'Время приёма заказов 22:30 меняется в настройках, без программиста.' },
    { k: '+', en: 'Design, Implementation, Interface, Physical', ru: 'Плюс: ограничения', d: 'Ограничения проектирования и реализации, интерфейсы с другими системами, физические требования.', iso: 'в модели качества ISO 25010 этого нет — это ограничения и интерфейсы', ex: 'Только через публичный API «КассаПро» после их сертификации; данные покупателей — в России (152-ФЗ).' }
  ];
  const howIso = {
    id: 'how-iso', covers: ['lab'], title: 'Как это работает: модель качества ISO 25010 и FURPS+', free: true, noReset: true,
    simple: {
      icon: '🧭',
      plain: 'Чтобы не забыть ни одно «насколько хорошо», у аналитиков есть готовый список — модель качества. Идёте по нему, как по чек-листу, и про каждый пункт спрашиваете: важно ли это здесь и в каких цифрах.',
      analogy: 'Технолог принимает новую печь не на глаз, а по списку: сколько противней в час, держит ли температуру, переживёт ли скачок напряжения, легко ли чистить, встанет ли в цех рядом со старой, не обожжёт ли пекаря.',
      tech: '<b>ISO/IEC 25010</b> — модель качества программного продукта. Редакция 2011 (в России — <b>ГОСТ Р ИСО/МЭК 25010-2015</b>): 8 характеристик — функциональная пригодность, производительность, совместимость, удобство использования, надёжность, защищённость, сопровождаемость, переносимость. Редакция <b>2023</b>: 9 — добавлена безопасность (safety), удобство названо «способностью к взаимодействию», переносимость — «гибкостью». <b>FURPS+</b> — более старая и короткая схема Роберта Грейди (Hewlett-Packard).'
    },
    lead: ui.brief({
      situation: 'Модель качества — общий язык аналитика, архитектора и тестировщика. Примеры — из будущей системы «Колоса» и из пекарни. Две вкладки: ISO/IEC 25010 в двух редакциях и короткая схема FURPS+.',
      todo: [
        'Вкладка «ISO/IEC 25010»: нажимайте на плитки характеристик и читайте карточку: о чём вопрос, из чего состоит, пример «Колоса» и что спросит аналитик.',
        'Переключите редакцию на 2023. Какие плитки переименовали? Какая появилась? Чем «безопасность» отличается от «защищённости»?',
        'Вкладка «FURPS+»: нажмите на каждую букву и найдите, какой характеристике ISO она соответствует. Что спрятано за «плюсом»?'
      ],
      look: 'Оранжевая метка «было: …» — характеристику переименовали в 2023. Зелёная «новое» — характеристики не было в 2011.'
    }),
    render(el) {
      el.classList.add('rqt-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'iso', t: 'ISO/IEC 25010', render: fresh(drawIso) },
        { id: 'furps', t: 'FURPS+', render: fresh(drawFurps) }
      ], 'iso');
    }
  };
  function drawIso(pane) {
    let ed = '2011', sel = 'perf';
    pane.innerHTML = `<div class="stack">
      <div class="row"><span class="small dim">Редакция:</span>${ui.seg('ed', [{ v: '2011', t: '2011 · ГОСТ Р ИСО/МЭК 25010-2015 · 8' }, { v: '2023', t: '2023 · 9' }], ed, 'accent')}</div>
      <div class="rqt-iso" data-tiles></div>
      <div data-card></div>
      <div data-en></div>
    </div>`;
    function draw() {
      const list = ISO.filter(x => ed === '2023' || x.n11);
      if (!list.some(x => x.id === sel)) sel = 'func';
      TR.$('[data-tiles]', pane).innerHTML = list.map(x => `<button type="button" class="rqt-tile ${ed === '2023' && x.isNew ? 'new' : ''}" data-iso="${x.id}" aria-pressed="${sel === x.id}"><span class="t">${esc(ed === '2023' ? x.n23 : x.n11)}</span>${ed === '2023' && x.was ? `<span class="chip warn">было: ${esc(x.was)}</span>` : ''}${ed === '2023' && x.isNew ? '<span class="chip ok">новое</span>' : ''}<span class="small dim">${esc(x.q)}</span></button>`).join('');
      const x = ISO.find(i => i.id === sel);
      TR.$('[data-card]', pane).innerHTML = `<div class="card flat"><h4>${esc(ed === '2023' ? x.n23 : x.n11)}</h4><div class="rqt-def">
        <span class="k">Вопрос</span><div class="v"><b>${esc(x.q)}</b></div>
        <span class="k">Из чего состоит</span><div class="v">${esc(x.sub)}</div>
        <span class="k">В пекарне</span><div class="v">${esc(x.an)}</div>
        <span class="k">Пример «Колоса»</span><div class="v">${esc(x.ex)}</div>
        <span class="k">Спросит аналитик</span><div class="v">${esc(x.ask)}</div>
      </div></div>`;
      TR.$('[data-en]', pane).innerHTML = ed === '2023'
        ? ui.note('warn', 'Защищённость и безопасность — не одно и то же', '<b>Защищённость</b> (security) — защита данных и системы от людей: посторонних, злоумышленников, подделки. <b>Безопасность</b> (safety) — защита людей от системы: чтобы её ошибка никому не навредила. У «Колоса» почти всё — про защищённость, но пример с аллергией в заказе торта — уже про безопасность.')
        : ui.note('info', 'Как этим пользоваться', 'Модель — не анкета, которую заполняют целиком, а чек-лист против забывчивости. Пройдите по восьми плиткам и про каждую спросите: важно ли это для «Колоса» и в каких цифрах? Где ответ «важно» — появляется нефункциональное требование с числом и способом проверки.');
    }
    ui.onSeg(pane, (n, v) => { if (n === 'ed') { ed = v; draw(); } });
    TR.on(pane, 'click', '[data-iso]', (e, b) => { sel = b.dataset.iso; draw(); });
    draw();
  }
  function drawFurps(pane) {
    let cur = 'F';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">FURPS придумал Роберт Грейди в Hewlett-Packard в конце 1980-х; «плюс» добавили позже. Схема короче ISO и до сих пор встречается в шаблонах и на собеседованиях.</p>
      <div class="rqt-letters">${FURPS.map(f => `<button type="button" class="rqt-letter" data-fu="${esc(f.k)}" aria-pressed="${cur === f.k}" aria-label="${esc(f.en)}">${esc(f.k)}</button>`).join('')}</div>
      <div data-fc></div>
      ${ui.note('info', 'Какую схему выбрать', 'Честно: единого стандарта в компаниях нет. Кто-то идёт по ISO 25010, кто-то — по FURPS+, кто-то — по своему списку категорий в шаблоне. Важна не схема, а привычка пройти по ней и ни про что не забыть. Подробно о нефункциональных требованиях в цифрах — на неделе 4.')}
    </div>`;
    function draw() {
      const f = FURPS.find(x => x.k === cur);
      TR.$$('[data-fu]', pane).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.fu === cur)));
      TR.$('[data-fc]', pane).innerHTML = `<div class="card flat"><h4>${esc(f.k)} — ${esc(f.ru)} <span class="small dim">(${esc(f.en)})</span></h4><div class="rqt-def">
        <span class="k">Что это</span><div class="v">${esc(f.d)}</div>
        <span class="k">В ISO 25010</span><div class="v">${esc(f.iso)}</div>
        <span class="k">Пример «Колоса»</span><div class="v">${esc(f.ex)}</div>
      </div></div>`;
    }
    TR.on(pane, 'click', '[data-fu]', (e, b) => { cur = b.dataset.fu; draw(); });
    draw();
  }

  // =====================================================================
  // Теория 3. Явные, неявные и восхищающие (соседний пример — гостиница; мостик к модели Кано)
  // =====================================================================
  const KCLS = {
    imp: { t: 'Неявное', kano: 'по Кано — обязательное', col: 'var(--violet)', f: x => -1 + (1 - Math.pow(1 - x, 3)) },
    exp: { t: 'Явное', kano: 'по Кано — одномерное', col: 'var(--info)', f: x => -0.75 + 1.3 * x },
    wow: { t: 'Восхищающее', kano: 'по Кано — привлекательное', col: 'var(--ok)', f: x => Math.pow(x, 3) }
  };
  const HOTEL = {
    now: [
      { k: 'imp', t: 'Чистое постельное бельё', s: 'Никто не попросит — это само собой. Но если бельё несвежее, отзыв будет гневным.' },
      { k: 'exp', t: 'Скорость Wi-Fi', s: 'Гость сам спросит: «А интернет быстрый?» Чем быстрее, тем довольнее.' },
      { k: 'wow', t: 'Бутылка воды и записка от горничной', s: 'Никто не ждёт. Нет — не расстроятся; есть — напишут восторженный отзыв.' }
    ],
    past: [
      { k: 'imp', t: 'Чистое постельное бельё', s: 'Как и сегодня — само собой разумеется.' },
      { k: 'exp', t: 'Число каналов в телевизоре', s: 'Гости спрашивали о нём так же, как сегодня о скорости интернета.' },
      { k: 'wow', t: 'Бесплатный Wi-Fi в номере', s: 'Тогда — приятный сюрприз. Сегодня его отсутствие — повод для гневного отзыва: восхищающее стало неявным.' }
    ]
  };
  const moodOf = v => v <= -0.6 ? ['bad', 'злится'] : v <= -0.2 ? ['warn', 'недоволен'] : v < 0.2 ? ['', 'не замечает'] : v < 0.6 ? ['ok', 'доволен'] : ['ok', 'в восторге'];
  function kanoSVG(x) {
    const X = v => 44 + v * 270, Y = v => 112 - v * 86;
    let s = `<svg viewBox="0 0 330 236" width="100%" style="max-width:520px" role="img" aria-label="График: насколько хорошо сделано и насколько доволен человек">`;
    s += `<line x1="44" y1="18" x2="44" y2="206" style="stroke:var(--border-strong)"/><line x1="44" y1="112" x2="318" y2="112" style="stroke:var(--border-strong);stroke-dasharray:4 4"/>`;
    s += `<text x="50" y="26" style="fill:var(--text-muted);font-size:11px">в восторге</text><text x="50" y="128" style="fill:var(--text-muted);font-size:11px">всё равно</text><text x="50" y="202" style="fill:var(--text-muted);font-size:11px">злится</text>`;
    s += `<text x="44" y="226" style="fill:var(--text-muted);font-size:11px">нет совсем</text><text x="318" y="226" text-anchor="end" style="fill:var(--text-muted);font-size:11px">сделано отлично →</text>`;
    Object.keys(KCLS).forEach(k => {
      const c = KCLS[k], pts = [];
      for (let i = 0; i <= 40; i++) pts.push(X(i / 40).toFixed(1) + ',' + Y(c.f(i / 40)).toFixed(1));
      s += `<polyline points="${pts.join(' ')}" style="fill:none;stroke:${c.col};stroke-width:2.4"/>`;
    });
    s += `<line x1="${X(x)}" y1="18" x2="${X(x)}" y2="206" style="stroke:var(--text-2);stroke-dasharray:3 4"/>`;
    Object.keys(KCLS).forEach(k => { const c = KCLS[k]; s += `<circle cx="${X(x)}" cy="${Y(c.f(x))}" r="6" style="fill:${c.col};stroke:var(--surface);stroke-width:2"/>`; });
    return s + '</svg>';
  }
  const howKano = {
    id: 'how-kano', covers: ['kano', 'why'], title: 'Как это работает: явные, неявные и восхищающие', free: true, noReset: true,
    simple: {
      icon: '🎁',
      plain: 'Одни требования заказчик говорит вслух. Другие считает само собой разумеющимися и молчит — но без них всё остальное бессмысленно. Третьих он вообще не ждёт, а когда получает — радуется.',
      analogy: '«Хлеб должен быть свежим» никто не скажет — это неявное. «Круассаны к 7:30» — скажут, это явное. А тёплый круассан в подарок в день рождения никто не просил — это восхищает.',
      tech: '<b>Явные</b> требования называют сами заинтересованные лица. <b>Неявные</b> подразумеваются и всплывают, только когда нарушены. <b>Восхищающие</b> — то, чего не ждут. Это мостик к <b>модели Кано</b> (Нориаки Кано, 1984): обязательные, одномерные и привлекательные свойства (ещё — безразличные и обратные). Подробно — на неделе 4, «Ценность и приоритеты».'
    },
    lead: ui.brief({
      situation: 'Соседний пример — гостиница. Три свойства номера ведут себя по-разному: одно никто не замечает, пока оно в порядке, другое тем лучше, чем больше, третье радует, хотя его никто не ждал. Переключатель «время» показывает, как восхищение со временем становится нормой.',
      todo: [
        'Двигайте ползунок «Насколько хорошо сделано» от «нет совсем» до «отлично» и смотрите на три точки на графике и на подписи в карточках справа.',
        'Найдите положение, где неявное уже «не злит», а восхищающее ещё «не замечают».',
        'Переключите «Время» на «пятнадцать лет назад» и сравните, что было восхищающим тогда.'
      ],
      look: 'Фиолетовая линия — неявное: в лучшем случае «всё равно». Синяя — явное: чем лучше, тем довольнее. Зелёная — восхищающее: без него не злятся, с ним — в восторге.'
    }),
    render(el) {
      el.classList.add('rqt-root');
      let x = 0.3, era = 'now';
      el.innerHTML = `<div class="stack">
        <div class="row"><span class="small dim">Время:</span>${ui.seg('era', [{ v: 'now', t: 'сегодня' }, { v: 'past', t: 'пятнадцать лет назад' }], era, 'accent')}</div>
        <label class="stack tight"><span class="small dim">Насколько хорошо сделано</span><input type="range" class="rqt-range" min="0" max="100" value="30" data-x aria-label="Насколько хорошо сделано"></label>
        <div class="rqt-kano"><div class="stack tight"><div class="board" data-ch style="padding:8px"></div><div class="rqt-leg">${Object.keys(KCLS).map(k => `<span><i style="background:${KCLS[k].col}"></i>${esc(KCLS[k].t.toLowerCase())}</span>`).join('')}</div></div><div class="stack tight" data-cards></div></div>
        <div data-kn></div>
      </div>`;
      function draw() {
        TR.$('[data-ch]', el).innerHTML = kanoSVG(x);
        TR.$('[data-cards]', el).innerHTML = HOTEL[era].map(h => {
          const c = KCLS[h.k], m = moodOf(c.f(x));
          return `<div class="rqt-kc ${h.k}"><div class="h"><span class="cls">${esc(c.t)} · ${esc(c.kano)}</span>${ui.status(m[1], m[0])}</div><b>${esc(h.t)}</b><span class="small muted">${esc(h.s)}</span></div>`;
        }).join('');
        TR.$('[data-kn]', el).innerHTML = era === 'past'
          ? ui.note('warn', 'Восхищение стареет', 'Wi-Fi в номере когда-то восхищал, а сегодня его отсутствие злит. То же будет с «повторить прошлый заказ» или SMS «заказ готов»: то, что сегодня радует покупателей «Колоса», через несколько лет станет нормой.')
          : ui.note('info', 'Что здесь делает аналитик', '<b>Явные</b> требования услышите на интервью. <b>Неявные</b> никто не скажет — их видно, когда наблюдаете работу, и они всплывают на вопросах Леры «а если…?». <b>Восхищающие</b> находят, когда понимают потребность лучше самого заказчика. Самые опасные — неявные: про них забывают, а потом они ломают праздник.');
      }
      TR.$('[data-x]', el).addEventListener('input', e => { x = (+e.target.value) / 100; draw(); });
      ui.onSeg(el, (n, v) => { if (n === 'era') { era = v; draw(); } });
      draw();
    }
  };

  // =====================================================================
  // Практика 1. Классификатор: 20 фраз «Колоса»
  // =====================================================================
  const CB = [
    { id: 'f', t: 'Функциональное', sub: 'что делает система или человек в ней' },
    { id: 'nfr', t: 'Нефункциональное', sub: 'насколько хорошо: скорость, надёжность, удобство…' },
    { id: 'rule', t: 'Бизнес-правило', sub: 'правило бизнеса, действует и без программы' },
    { id: 'con', t: 'Ограничение', sub: 'рамка, которую нельзя поменять: закон, срок, бюджет' },
    { id: 'ifc', t: 'Внешний интерфейс', sub: 'обмен с чужой системой или устройством' }
  ];
  const CHINT = {
    f: 'Если это убрать, система перестанет что-то делать? Кто здесь действует и что происходит?',
    nfr: 'Здесь главное «что делает» — или «насколько хорошо»: сколько секунд, процентов, без потерь, за сколько обучения?',
    rule: 'Действовало бы это правило, если бы заказы по-прежнему писали в тетрадь? Кто его придумал — бизнес или закон? Может ли Нина завтра его поменять?',
    con: 'Можем ли мы это изменить сами? Или это рамка извне — закон, бюджет, срок?',
    ifc: 'С кем здесь обмен — с чужой системой или устройством? Чья это система и кто диктует правила обмена?'
  };
  const CL = [
    { id: 'p-slot', t: 'Покупатель выбирает пекарню и получасовой интервал выдачи', ok: 'f' },
    { id: 'p-issue', t: 'Кассир отмечает заказ как «Выдан»', ok: 'f' },
    { id: 'p-photo', t: 'Кондитер видит фото-образец и надпись торта на планшете в цехе', ok: 'f' },
    { id: 'p-sms', t: 'Система отправляет покупателю SMS «Заказ готов»', ok: 'f', alt: { ifc: 'SMS уходит через чужой SMS-шлюз — это ещё и интерфейс. Но сама фраза — о том, что делает система.' } },
    { id: 'p-plan', t: 'Система добавляет оплаченные предзаказы на завтра к плану выпечки', ok: 'f' },
    { id: 'p-speed', t: '95 % ответов приложения — быстрее 1 секунды при 400 заказах в час', ok: 'nfr' },
    { id: 'p-avail', t: 'Приём заказов доступен 99,5 % времени в месяц', ok: 'nfr' },
    { id: 'p-learn', t: 'Новый кассир осваивает экран выдачи за одну смену обучения', ok: 'nfr' },
    { id: 'p-offline', t: 'После обрыва связи касса досылает чеки в течение 15 минут без потери', ok: 'nfr', alt: { f: '«Досылает» — действие, верно. Но главное здесь — насколько надёжно: за сколько минут и без потерь.' } },
    { id: 'p-cutoff', t: 'Заказ на завтра принимается до 22:30', ok: 'rule' },
    { id: 'p-cake', t: 'Торт принимается минимум за 48 часов, предоплата 50 %', ok: 'rule' },
    { id: 'p-hold', t: 'Неоплаченный предзаказ держат 30 минут после конца интервала, потом выпечка уходит в продажу', ok: 'rule' },
    { id: 'p-free', t: 'Отмена бесплатна не позже чем за 2 часа до начала интервала', ok: 'rule' },
    { id: 'p-54', t: 'При предоплате пробивается чек «предоплата», при выдаче — чек полного расчёта (54-ФЗ)', ok: 'con', also: { rule: 'у Вигерса законы — разновидность бизнес-правил, а в каноне «Колоса» и в BABOK это ограничение. Обе точки зрения встречаются.' } },
    { id: 'p-pd', t: 'Персональные данные покупателей хранятся на серверах в России (152-ФЗ)', ok: 'con', alt: { nfr: 'Похоже на защищённость, но выбора тут нет: так велит закон. Это рамка извне.' } },
    { id: 'p-budget', t: 'Первая версия укладывается в бюджет 6 млн ₽', ok: 'con' },
    { id: 'p-pilot', t: 'Предзаказ работает в 2 пилотных пекарнях к 1 февраля 2027', ok: 'con' },
    { id: 'p-1c', t: 'Сводка продаж за день уходит в 1С одной выгрузкой к 09:00', ok: 'ifc', alt: { f: 'Собрать сводку — функция. Но главное в фразе — обмен с чужой системой: что, куда, в каком виде и когда.' } },
    { id: 'p-kassa', t: 'Чеки пробиваются через облачные кассы «КассаПро» по их публичному API', ok: 'ifc', alt: { con: 'Это и рамка: только их API и только после их сертификации. Но в первую очередь фраза — про обмен с чужой системой.' } },
    { id: 'p-pay', t: 'Оплата картой и СБП проходит через платёжный шлюз «ПэйМост»', ok: 'ifc' }
  ];
  function clEval(v) {
    v = v || {};
    return CL.map(c => {
      const got = v[c.id];
      if (got === c.ok) return { c, s: 'ok', pts: 1, got };
      if (c.also && c.also[got]) return { c, s: 'ok', pts: 1, got, why: c.also[got], info: true };
      if (c.alt && c.alt[got]) return { c, s: 'warn', pts: 0.5, got, why: c.alt[got] };
      return { c, s: 'bad', pts: 0, got, empty: !got };
    });
  }
  const classifyTask = {
    id: 'classify', title: 'Классификатор: 20 фраз «Колоса»',
    simple: howKinds.simple,
    lead: ui.brief({
      situation: 'После вчерашнего разбора письма у Ксении в черновике двадцать фраз — из письма Нины, договора и первых разговоров. Дима: «Разложи по видам. Функции я раздам разработчикам. Качество заложу в архитектуру — его потом не докрутишь. Правила вынесем в настройки, чтобы Нина могла их менять. Ограничения — в план и смету. Интерфейсы — отдельному человеку, у “КассаПро” свой регламент».',
      todo: [
        'Разложите 20 карточек по пяти корзинам: нажмите карточку, потом корзину (на компьютере можно перетаскивать).',
        'Для каждой задайте пять вопросов-фильтров: что делает система? насколько хорошо? так решил бизнес? можем ли поменять? с кем обмен?',
        'Нажмите «Проверить». Засчитывается от 80 %. Где практики честно спорят о виде, засчитываются оба ответа; где фраза стоит на границе — второй ответ даёт половину балла.'
      ],
      lookTitle: 'Подсказка',
      look: 'Правило отличается от ограничения тем, что его придумал бизнес и бизнес может его поменять: время 22:30 Нина может сдвинуть, закон и бюджет — нет.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(CL.map(c => [c.id, c.ok])) }),
    render(el, ctx) {
      el.classList.add('rqt-root');
      let reveal = null;
      if (ctx.result) { reveal = {}; clEval(ctx.ans.v).forEach(x => { reveal[x.c.id] = x.s; }); }
      const box = document.createElement('div'); el.appendChild(box);
      ui.sort(box, { items: CL.map(c => ({ id: c.id, t: c.t })), buckets: CB, value: ctx.ans.v || {}, reveal, readonly: ctx.readonly, seed: 'rqt-classify', onChange: v => { ctx.ans.v = v; ctx.save(); } });
    },
    check(ans) {
      const ev = clEval(ans && ans.v), score = ev.reduce((s, x) => s + x.pts, 0) / CL.length;
      const notes = [];
      const empty = ev.filter(x => x.empty);
      if (empty.length) notes.push({ ok: false, html: `Не разложено ${empty.length} из ${CL.length}.` });
      ev.forEach(x => {
        if (x.s === 'warn') notes.push({ ok: 'warn', html: `«${esc(x.c.t)}» — ${esc(x.why)}` });
        else if (x.info) notes.push({ ok: 'info', html: `«${esc(x.c.t)}» — засчитано: ${esc(x.why)}` });
        else if (x.s === 'bad' && !x.empty) notes.push({ ok: false, html: `«${esc(x.c.t)}» — ${CHINT[x.c.ok]}` });
      });
      if (ev.every(x => x.s === 'ok')) notes.push({ ok: true, html: 'Все двадцать — по своим видам.' });
      const v = (ans && ans.v) || {};
      const fnf = ev.filter(x => (x.c.ok === 'f' && v[x.c.id] === 'nfr') || (x.c.ok === 'nfr' && v[x.c.id] === 'f')).length;
      const rc = ev.filter(x => x.s === 'bad' && ((x.c.ok === 'rule' && v[x.c.id] === 'con') || (x.c.ok === 'con' && v[x.c.id] === 'rule'))).length;
      return {
        ok: score >= 0.8, score, notes,
        summary: `Точно: ${ev.filter(x => x.s === 'ok').length} из ${CL.length}, близко: ${ev.filter(x => x.s === 'warn').length}.`,
        mentor: fnf >= 2 ? 'Спросите про каждую фразу: если это убрать, система перестанет что-то делать — или будет делать то же самое, но хуже? Первое — функция, второе — качество.'
          : rc >= 2 ? 'Правило и ограничение отличает одно: правило придумал бизнес, и Нина может завтра его поменять. Закон, бюджет и срок пилота она поменять не может.' : null
      };
    },
    explain: `<p>Пять видов — пять разных разговоров и пять разных судеб в проекте:</p>
      ${ui.table(['Вид', 'Примеры «Колоса»', 'Что с ним делают'], [
        ['Функциональное', 'интервал выдачи, «Выдан», фото торта в цехе, SMS, план выпечки', 'Разработчики программируют, Лера проверяет по критериям приёмки'],
        ['Нефункциональное', '95 % быстрее секунды, 99,5 % времени, кассир за смену, чеки досылаются за 15 минут', 'Дима закладывает в архитектуру с самого начала: потом не докрутить'],
        ['Бизнес-правило', '22:30, торт за 48 часов и 50 %, держим 30 минут, отмена за 2 часа', 'Выносят в настройки: Нина может поменять их без программиста'],
        ['Ограничение', '54-ФЗ, 152-ФЗ, бюджет 6 млн ₽, пилот к 1 февраля', 'Не обсуждаются, но стоят денег и сроков — в план и смету'],
        ['Внешний интерфейс', '1С, «КассаПро», «ПэйМост»', 'Описывают данные, формат, время и поведение при сбое; у чужой системы — свои правила']
      ])}
      <p>Границы честно размыты. Законы Вигерс относит к бизнес-правилам, а канон «Колоса» и BABOK — к ограничениям. «Сводка в 1С» — и функция, и интерфейс. Важно не угадать ярлык, а <b>не потерять вопросы</b>, которые нужны каждому виду: про правило — кто может его менять, про качество — какое число и как проверить, про интерфейс — что делать, если чужая система молчит.</p>`,
    report: ans => clEval(ans && ans.v).map(x => `- ${x.c.t} → ${(CB.find(b => b.id === x.got) || { t: '—' }).t} ${x.s === 'ok' ? '✓' : x.s === 'warn' ? '≈' : '✗'}`).join('\n')
  };

  // =====================================================================
  // Практика 2. Найдите НФТ, спрятанные в функциональных
  // =====================================================================
  const ISO_CH = [
    { v: 'func', t: 'Функциональная пригодность' },
    { v: 'perf', t: 'Производительность' },
    { v: 'compat', t: 'Совместимость' },
    { v: 'usab', t: 'Удобство использования' },
    { v: 'rel', t: 'Надёжность' },
    { v: 'sec', t: 'Защищённость' },
    { v: 'maint', t: 'Сопровождаемость' },
    { v: 'port', t: 'Переносимость' }
  ];
  const C = (id, t, iso, alt) => ({ id, t, iso: iso || null, alt: alt || [] });
  const HID = [
    { id: 'h1', ch: [C('h1a', 'Кассир находит заказ по коду'), C('h1b', 'и отмечает его как выданный'), C('h1c', 'за 2–3 секунды,', 'perf', ['usab']), C('h1d', 'даже в утренний пик 07:30–09:00.', 'perf')] },
    { id: 'h2', ch: [C('h2a', 'Приложение принимает предзаказы'), C('h2b', 'круглосуточно,', 'rel'), C('h2c', 'кроме окна обслуживания 01:00–02:30.', 'rel', ['maint'])] },
    { id: 'h3', ch: [C('h3a', 'Кассир'), C('h3b', 'в первый же день работы, без инструкции,', 'usab'), C('h3c', 'оформляет предзаказ за покупателя,'), C('h3d', 'который звонит по телефону.')] },
    { id: 'h4', ch: [C('h4a', 'Покупатель открывает свой заказ по ссылке из SMS;'), C('h4b', 'посторонний не может открыть чужой заказ, подобрав номер в ссылке.', 'sec')] },
    { id: 'h5', ch: [C('h5a', 'Касса пробивает чек «предоплата»'), C('h5b', 'и при обрыве связи досылает его в течение 15 минут без потери.', 'rel')] },
    { id: 'h6', ch: [C('h6a', 'Покупатель выбирает пекарню и интервал выдачи'), C('h6b', 'одинаково в приложении на iOS и на Android.', 'port', ['compat'])] },
    { id: 'h7', ch: [C('h7a', 'Система добавляет оплаченные предзаказы на завтра'), C('h7b', 'к плану выпечки цеха'), C('h7c', 'в 23:00.')] }
  ];
  const trimT = t => String(t).replace(/[,.;:]+$/, '');
  const CHUNKS = HID.flatMap(s => s.ch.map(c => Object.assign({ sid: s.id }, c)));
  const NFR_CH = CHUNKS.filter(c => c.iso);
  const FP_WHY = {
    h7c: '«в 23:00» — это не «насколько хорошо», а когда это происходит по правилу бизнеса: план выпечки фиксируют в 23:00.',
    h3d: '«который звонит по телефону» — уточняет, за кого кассир оформляет заказ. Это часть функции, а не её качество.'
  };
  function hidEval(a) {
    a = a || {};
    const mk = (a.mk || []).filter(id => CHUNKS.some(c => c.id === id));
    const cmap = a.c || {};
    const tp = NFR_CH.filter(c => mk.includes(c.id));
    const fp = CHUNKS.filter(c => !c.iso && mk.includes(c.id));
    const miss = NFR_CH.filter(c => !mk.includes(c.id));
    const chr = tp.map(c => ({ c, got: cmap[c.id], s: cmap[c.id] === c.iso ? 'ok' : c.alt.includes(cmap[c.id]) ? 'warn' : cmap[c.id] ? 'bad' : 'empty' }));
    const det = Math.max(0, (tp.length - 0.5 * fp.length) / NFR_CH.length);
    const chS = chr.reduce((s, x) => s + (x.s === 'ok' ? 1 : x.s === 'warn' ? 0.5 : 0), 0) / NFR_CH.length;
    return { mk, tp, fp, miss, chr, det, chS, score: det * 0.6 + chS * 0.4 };
  }
  const hiddenTask = {
    id: 'hidden', title: 'Найдите НФТ, спрятанные в функциональных',
    simple: howKinds.simple,
    lead: ui.brief({
      situation: 'Вы вчера написали семь черновых функциональных требований. Дима вернул их с пометкой: «Тут внутри спрятано качество. Вынеси его отдельно и назови характеристику по ISO 25010 — иначе оно потеряется: функцию сделают, а секунды и проценты никто не проверит». Лера добавила: «И не тащи в качество то, что им не является».',
      todo: [
        'Нажимайте на части предложений, которые говорят не «что делает», а «насколько хорошо». Отмеченная часть подсветится; повторное нажатие снимает отметку.',
        'Для каждой найденной части выберите характеристику качества в списке «Найденное качество» под предложениями.',
        'В одном предложении качества нет вовсе — не отмечайте лишнего: за каждую лишнюю отметку снимается половина балла.',
        'Нажмите «Проверить». Засчитывается от 80 %.'
      ],
      lookTitle: 'Подсказка',
      look: 'Качество выдают слова про «насколько»: секунды и проценты, «всегда» и «кроме…», «даже когда…», «без потерь», «новичок справится», «одинаково на разных устройствах», «чужой не сможет…». Время, когда что-то происходит по правилу бизнеса, — не качество.'
    }),
    blank: () => ({ mk: [], c: {} }),
    reference: () => ({ mk: NFR_CH.map(c => c.id), c: Object.fromEntries(NFR_CH.map(c => [c.id, c.iso])) }),
    render(el, ctx) {
      el.classList.add('rqt-root');
      const a = ctx.ans; a.mk = a.mk || []; a.c = a.c || {};
      let rv = null;
      if (ctx.result) {
        rv = {};
        const ev = hidEval(a);
        ev.tp.forEach(c => { const x = ev.chr.find(y => y.c.id === c.id); rv[c.id] = x.s === 'ok' ? 'ok' : x.s === 'warn' ? 'warn' : 'bad'; });
        ev.fp.forEach(c => { rv[c.id] = 'bad'; });
      }
      el.innerHTML = `<div class="stack"><div class="rqt-sents" data-s></div><div class="eyebrow">Найденное качество — какая это характеристика ISO 25010?</div><div data-m></div></div>`;
      function drawS() {
        TR.$('[data-s]', el).innerHTML = HID.map((s, i) => `<div class="rqt-sent"><span class="n">${i + 1}</span><div>${s.ch.map(c => {
          const on = a.mk.includes(c.id), r = rv && rv[c.id];
          return `<span class="rqt-chunk ${on ? 'on' : ''}" role="button" tabindex="0" data-ck="${c.id}" aria-pressed="${on}">${esc(c.t)}${r ? `<span class="rqt-mk ${r}">${r === 'ok' ? '✓' : r === 'warn' ? '≈' : '✕'}</span>` : ''}</span>`;
        }).join(' ')}</div></div>`).join('');
      }
      function drawM() {
        const box = TR.$('[data-m]', el);
        const rows = CHUNKS.filter(c => a.mk.includes(c.id));
        if (!rows.length) { box.innerHTML = '<p class="small dim">Пока ничего не отмечено. Нажмите на часть предложения выше.</p>'; return; }
        let mrev = null;
        if (ctx.result) { mrev = {}; const ev = hidEval(a); ev.chr.forEach(x => { if (x.got) mrev[x.c.id] = { s: x.s === 'empty' ? 'bad' : x.s }; }); ev.fp.forEach(c => { mrev[c.id] = { s: 'bad', why: 'Это не качество — снимите отметку.' }; }); }
        const d = document.createElement('div'); box.innerHTML = ''; box.appendChild(d);
        ui.match(d, { rows: rows.map(c => ({ id: c.id, t: `«${esc(trimT(c.t))}»`, sub: `предложение ${HID.findIndex(s => s.id === c.sid) + 1}` })), choices: ISO_CH, value: a.c, reveal: mrev, readonly: ctx.readonly, placeholder: 'Характеристика…', onChange: v => { a.c = v; ctx.save(); } });
      }
      function toggle(id) {
        if (ctx.readonly) return;
        if (a.mk.includes(id)) { a.mk = a.mk.filter(x => x !== id); delete a.c[id]; } else a.mk.push(id);
        if (rv) delete rv[id];
        ctx.save(); drawS(); drawM();
      }
      TR.on(el, 'click', '[data-ck]', (e, b) => toggle(b.dataset.ck));
      TR.on(el, 'keydown', '[data-ck]', (e, b) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(b.dataset.ck); } });
      drawS(); drawM();
    },
    check(ans) {
      const ev = hidEval(ans);
      const notes = [];
      const missS = HID.map((s, i) => ev.miss.some(c => c.sid === s.id) ? i + 1 : 0).filter(Boolean);
      if (missS.length) notes.push({ ok: false, html: `${missS.length > 1 ? 'В предложениях' : 'В предложении'} ${missS.join(', ')} ещё спрятано «насколько хорошо». Ищите секунды и проценты, «всегда», «даже когда», «без потерь», «новичок справится», «одинаково на разных…», «чужой не сможет».` });
      ev.fp.forEach(c => notes.push({ ok: false, html: FP_WHY[c.id] || `«${esc(trimT(c.t))}» — описывает, кто действует или что делает система. Если это убрать, система перестанет что-то делать — значит, это функция, а не качество.` }));
      ev.chr.forEach(x => {
        if (x.s === 'empty') notes.push({ ok: 'warn', html: `«${esc(trimT(x.c.t))}» — найдено верно; выберите характеристику качества.` });
        else if (x.s === 'bad') notes.push({ ok: false, html: `«${esc(trimT(x.c.t))}» — найдено верно, но характеристика другая. Это про скорость, про «работает, когда нужно», про людей, про защиту от чужих или про разные платформы?` });
        else if (x.s === 'warn') notes.push({ ok: 'warn', html: `«${esc(trimT(x.c.t))}» — характеристика засчитана наполовину: это близко, но главное здесь другое. Перечитайте вопросы плиток ISO.` });
      });
      if (!notes.length) notes.push({ ok: true, html: 'Всё качество найдено и названо, лишнего не отмечено.' });
      return {
        ok: ev.score >= 0.8, score: ev.score, notes,
        summary: `Найдено ${ev.tp.length} из ${NFR_CH.length}, лишних отметок: ${ev.fp.length}, характеристик верно: ${ev.chr.filter(x => x.s === 'ok').length}.`,
        mentor: ev.fp.length >= 2 ? 'Лера права: не всё, что звучит важно, — качество. Время по правилу бизнеса, кто действует и над чем — это функция. Качество отвечает на вопрос «насколько хорошо».' : null
      };
    },
    explain: `<p>Почему качество выносят из функций отдельно: функцию «кассир находит заказ по коду» сделают и проверят, а «за 2–3 секунды в пик» потеряется, если оно спрятано в середине фразы. Отдельное нефункциональное требование получает своё число, условия и способ проверки.</p>
      ${ui.table(['Было (функция с качеством внутри)', 'Функция', 'Качество (ISO 25010)'], [
        ['Кассир находит заказ по коду и отмечает выданным за 2–3 секунды даже в пик', 'Кассир находит заказ по коду и отмечает его как выданный', 'Производительность: поиск и отметка — не дольше 3 секунд, в том числе с 07:30 до 09:00'],
        ['Приложение принимает предзаказы круглосуточно, кроме окна 01:00–02:30', 'Приложение принимает предзаказы', 'Надёжность (готовность): доступно круглосуточно, обслуживание — только 01:00–02:30'],
        ['Кассир в первый день, без инструкции, оформляет заказ за звонящего', 'Кассир оформляет предзаказ за покупателя, который звонит', 'Удобство: новый кассир справляется в первый день без инструкции'],
        ['…посторонний не откроет чужой заказ, подобрав номер', 'Покупатель открывает свой заказ по ссылке из SMS', 'Защищённость: по подобранной ссылке чужой заказ не открывается'],
        ['…досылает чек за 15 минут без потери', 'Касса пробивает чек «предоплата»', 'Надёжность (отказоустойчивость): после обрыва чек досылается за 15 минут без потери'],
        ['…одинаково на iOS и Android', 'Покупатель выбирает пекарню и интервал', 'Переносимость: одинаково работает на iOS и Android'],
        ['…в 23:00', 'Система добавляет предзаказы к плану выпечки в 23:00', '— (23:00 — правило бизнеса, не качество)']
      ])}
      <p>Это не значит, что фразы с качеством внутри — запрещены. В истории для команды их можно оставить рядом. Но в списке нефункциональных требований каждое должно стоять отдельно — с числом и способом проверки. Как писать их измеримо, разберём в среду и подробно — на неделе 4.</p>`,
    report: ans => {
      const ev = hidEval(ans);
      return `Найдено ${ev.tp.length} из ${NFR_CH.length}, лишних: ${ev.fp.length}.\n` + CHUNKS.filter(c => ev.mk.includes(c.id)).map(c => `- «${c.t}» → ${c.iso ? ((ISO_CH.find(x => x.v === ((ans && ans.c) || {})[c.id]) || { t: '—' }).t + (((ans && ans.c) || {})[c.id] === c.iso ? ' ✓' : ' ✗')) : 'лишняя отметка ✗'}`).join('\n');
    }
  };

  // =====================================================================
  // Практика 3. Лаборатория «Утро 8 Марта без НФТ»
  // =====================================================================
  const BUDGET = 36;
  const LAB = [
    { id: 'avail', must: true, cost: 8, t: 'Готовность сервиса', d: 'Приём заказов доступен 99,5 % времени в месяц; обслуживание — только ночью, 01:00–02:30' },
    { id: 'speed', must: true, cost: 10, t: 'Скорость под нагрузкой', d: '95 % ответов приложения быстрее 1 секунды при 400 заказах в час' },
    { id: 'fz54', must: true, cost: 6, t: 'Чеки по 54-ФЗ', d: 'При предоплате — чек «предоплата», при выдаче — чек полного расчёта' },
    { id: 'offline', must: true, cost: 6, t: 'Офлайн-режим кассы', d: 'При обрыве связи касса продолжает выдачу и досылает чеки в течение 15 минут без потери' },
    { id: 'access', must: true, cost: 6, t: 'Доступность для людей', d: 'Крупный шрифт, контраст и понятные подписи — для тех, кто плохо видит и не дружит со смартфоном' },
    { id: 'dark', cost: 4, t: 'Тёмная тема', d: 'Приложение можно переключить в тёмные цвета' },
    { id: 'anim', cost: 5, t: 'Анимация круассана', d: 'Пока заказ оформляется, на экране «печётся» круассан' },
    { id: 'en', cost: 6, t: 'Английская версия', d: 'Приложение на английском для туристов' }
  ];
  const MUSTS = LAB.filter(x => x.must);
  const FAIL = {
    access: { tm: '7 марта, 20:00', t: 'Анна Павловна не может разобрать мелкий шрифт и попасть по маленькой кнопке. Торт для дочери так и не заказан. Она звонит в пекарню — в вечерней суете трубку не берут.' },
    avail: { tm: '7 марта, 21:30', t: 'Обновление системы поставили на вечер, «пока никого нет». Приём заказов недоступен до полуночи, а приём на завтра закрывается в 22:30: заказать к празднику уже нельзя. Пик в 400 заказов в час уходит в никуда.' },
    speed: { tm: '8 марта, 07:40', t: 'В пик приложение отвечает по 8–10 секунд. Покупатели жмут «Заказать» дважды — у кассы разбираются с двойными заказами и возвратами.' },
    fz54: { tm: '08:00', t: 'По предоплатам тортов (50 %) не пробиты чеки «предоплата». Олег Петрович увидит это на сверке: нарушение 54-ФЗ — штраф и проверка налоговой.' },
    offline: { tm: '08:10', t: 'У кассы на Покровке на 12 минут пропала связь. Касса не может ни выдать предзаказ, ни пробить чек — очередь до дверей, предзаказчики стоят вместе со всеми.' }
  };
  const NICE = {
    dark: { tm: '09:30', t: 'Пара покупателей похвалила тёмную тему.' },
    anim: { tm: '07:41', t: 'Пока приложение думает, на экране печётся круассан. Кто-то улыбнулся.' },
    en: { tm: '12:00', t: 'Двое туристов оформили заказ на английском.' }
  };
  const BASE_EV = [
    { tm: '7 марта, 21:00', t: 'Вечер перед праздником: до 22:30 нужно принять заказы на утро — выпечку и торты к столу.' },
    { tm: '8 марта, 07:00', t: 'Пекарни открылись. На Покровке два кассира, на полке — торты к празднику.' },
    { tm: '07:30–09:00', t: 'Утренний пик: очередь 8–12 человек, предзаказчики идут за своими пакетами.' },
    { tm: '10:00', t: 'Нина Сергеевна открывает сводку утра.' }
  ];
  const tmKey = tm => { const m = String(tm).match(/(\d+) марта, (\d\d):(\d\d)|^(\d\d):(\d\d)/); if (!m) return 0; return m[1] ? (+m[1]) * 10000 + (+m[2]) * 100 + (+m[3]) : 8 * 10000 + (+m[4]) * 100 + (+m[5]); };
  const LAB_CH = [
    { v: 'rel-av', t: 'Надёжность: готовность' },
    { v: 'rel-ft', t: 'Надёжность: переживает сбой' },
    { v: 'perf', t: 'Производительность' },
    { v: 'usab', t: 'Удобство: доступность' },
    { v: 'sec', t: 'Защищённость' },
    { v: 'maint', t: 'Сопровождаемость' },
    { v: 'law', t: 'Не ISO: закон, ограничение' }
  ];
  const LAB_OK = { avail: 'rel-av', speed: 'perf', fz54: 'law', offline: 'rel-ft', access: 'usab' };
  const LAB_HALF = { avail: ['rel-ft'], offline: ['rel-av'] };
  const costOf = on => LAB.filter(x => on.includes(x.id)).reduce((s, x) => s + x.cost, 0);
  function labEval(a) {
    a = a || {};
    const on = (a.on || []).filter(id => LAB.some(x => x.id === id));
    const m = a.m || {};
    const mustOn = MUSTS.filter(x => on.includes(x.id));
    const rows = MUSTS.map(x => ({ x, got: m[x.id], s: m[x.id] === LAB_OK[x.id] ? 'ok' : (LAB_HALF[x.id] || []).includes(m[x.id]) ? 'warn' : m[x.id] ? 'bad' : 'empty' }));
    const mS = rows.reduce((s, r) => s + (r.s === 'ok' ? 1 : r.s === 'warn' ? 0.5 : 0), 0) / MUSTS.length;
    const cost = costOf(on);
    const score = (mustOn.length / MUSTS.length) * 0.6 + mS * 0.4;
    return { on, mustOn, rows, mS, cost, over: cost > BUDGET, score };
  }
  const labTask = {
    id: 'lab', title: 'Лаборатория: утро 8 Марта без НФТ',
    simple: howIso.simple,
    lead: ui.brief({
      situation: 'Игорь: «На качество в первой версии у нас условно 36 дней работы команды — остальное уходит на функции. Нина уже спросила про тёмную тему и анимацию: “Это же красиво!”». Ксения: «Давайте посмотрим, что будет утром 8 Марта, — это главный день года для “Колоса”: в прошлом году 140 тортов за три дня и 9 потерянных заказов».',
      todo: [
        'Слева включайте и выключайте нефункциональные требования. Каждое стоит дней работы; больше 36 включить нельзя — сначала выключите что-нибудь.',
        'Справа смотрите, как меняется вечер 7 марта и утро 8 марта: красные события — что сломалось, и пять карточек итога.',
        'Найдите набор, при котором утро проходит без потерь. Затем ниже, в «Что это за качество», выберите для каждого из пяти главных требований характеристику ISO 25010 — или «не ISO: закон».',
        'Нажмите «Проверить». Засчитывается от 80 %, если все пять главных требований включены и бюджет не превышен.'
      ],
      look: 'Невидимые требования не видны, пока работают. Тёмная тема и анимация заметны сразу — но на утро 8 Марта не влияют. Наберите сначала то, без чего праздник ломается.'
    }),
    blank: () => ({ on: ['dark', 'anim'], m: {} }),
    reference: () => ({ on: MUSTS.map(x => x.id), m: Object.assign({}, LAB_OK) }),
    render(el, ctx) {
      el.classList.add('rqt-root');
      const a = ctx.ans; a.on = Array.isArray(a.on) ? a.on : []; a.m = a.m || {};
      let deny = null;
      el.innerHTML = `<div class="stack">
        <div class="rqt-lab">
          <div class="stack tight"><div class="eyebrow">Качество в первой версии</div><div data-bud></div><div class="rqt-nfrs" data-list></div><div data-deny></div></div>
          <div class="stack tight"><div class="eyebrow">Вечер 7 марта и утро 8 марта</div><div class="rqt-tl" data-tl></div><div class="rqt-stats" data-st></div></div>
        </div>
        <div class="eyebrow">Что это за качество?</div>
        <div data-m></div>
      </div>`;
      function draw() {
        const cost = costOf(a.on);
        const broken = MUSTS.filter(x => !a.on.includes(x.id)).length;
        TR.$('[data-bud]', el).innerHTML = `<div class="stat"><span class="k">Занято дней</span><span class="v ${cost > BUDGET ? 'bad' : ''}">${cost} из ${BUDGET}</span>${ui.meter(Math.min(1, cost / BUDGET), cost > BUDGET ? 'bad' : cost === BUDGET ? '' : 'warn')}<span class="s">${broken ? `Утро 8 Марта: сломано ${broken} из ${MUSTS.length} — красные события в хронике` : 'Утро 8 Марта проходит без потерь'}</span></div>`;
        TR.$('[data-list]', el).innerHTML = LAB.map(x => `<button type="button" class="rqt-nfr ${deny === x.id ? 'deny' : ''}" data-nf="${x.id}" aria-pressed="${a.on.includes(x.id)}" ${ctx.readonly ? 'disabled' : ''}><span class="sw" aria-hidden="true"></span><span class="t">${esc(x.t)}</span><span class="c">${x.cost} дн.</span><span class="d">${esc(x.d)}</span></button>`).join('');
        TR.$('[data-deny]', el).innerHTML = deny ? ui.note('bad', 'Не влезает', `Свободно ${BUDGET - cost} дн., а «${esc(LAB.find(x => x.id === deny).t)}» стоит ${LAB.find(x => x.id === deny).cost}. Сначала выключите что-нибудь — Игорь бюджет не растянет.`) : '';
        const ev = BASE_EV.map(e => Object.assign({ k: '' }, e));
        MUSTS.forEach(x => { if (!a.on.includes(x.id)) ev.push(Object.assign({ k: 'bad' }, FAIL[x.id])); });
        Object.keys(NICE).forEach(id => { if (a.on.includes(id)) ev.push(Object.assign({ k: 'ok' }, NICE[id])); });
        ev.sort((p, q) => tmKey(p.tm) - tmKey(q.tm));
        TR.$('[data-tl]', el).innerHTML = ev.map(e => `<div class="rqt-ev ${e.k}"><span class="tm">${esc(e.tm)}</span><span>${esc(e.t)}</span></div>`).join('');
        const off = id => !a.on.includes(id);
        const fails = MUSTS.filter(x => off(x.id)).length;
        const st = [
          ['Заказы', off('avail') ? ['bad', 'не приняты вечером 7-го'] : off('speed') ? ['warn', 'двойные и возвраты'] : ['ok', 'приняты вовремя']],
          ['Очередь у кассы', off('offline') ? ['bad', 'до дверей'] : off('speed') ? ['warn', 'дольше обычного'] : ['ok', '8–12 человек, без задержек']],
          ['Закон', off('fz54') ? ['bad', 'нарушение 54-ФЗ'] : ['ok', 'чеки пробиты']],
          ['Покупатели постарше', off('access') ? ['bad', 'не смогли заказать'] : ['ok', 'заказали сами']],
          ['Нина Сергеевна', fails === 0 ? ['ok', 'довольна'] : fails <= 2 ? ['warn', 'недовольна'] : ['bad', 'в ярости']]
        ];
        TR.$('[data-st]', el).innerHTML = st.map(s => `<div class="stat"><span class="k">${esc(s[0])}</span><span class="v ${s[1][0]}">${esc(s[1][1])}</span></div>`).join('');
      }
      function drawM() {
        let mrev = null;
        if (ctx.result) { mrev = {}; labEval(a).rows.forEach(r => { if (r.got) mrev[r.x.id] = { s: r.s, why: r.s === 'ok' ? '' : r.s === 'warn' ? 'Близко: обе — надёжность. Но одно про «работает, когда нужно», другое — про «переживает обрыв».' : 'Перечитайте вопросы плиток ISO 25010. А закон — вообще не характеристика качества.' }; }); }
        ui.match(TR.$('[data-m]', el), { rows: MUSTS.map(x => ({ id: x.id, t: `<b>${esc(x.t)}</b>`, sub: x.d })), choices: LAB_CH, value: a.m, reveal: mrev, readonly: ctx.readonly, placeholder: 'Характеристика…', onChange: v => { a.m = v; ctx.save(); } });
      }
      TR.on(el, 'click', '[data-nf]', (e, b) => {
        if (ctx.readonly) return;
        const id = b.dataset.nf, x = LAB.find(i => i.id === id);
        if (a.on.includes(id)) { a.on = a.on.filter(i => i !== id); deny = null; }
        else if (costOf(a.on) + x.cost > BUDGET) { deny = id; draw(); return; }
        else { a.on.push(id); deny = null; }
        ctx.save(); ctx.decide('Качество в первой версии (8 Марта)', LAB.filter(i => a.on.includes(i.id)).map(i => i.t).join(', ') || '—');
        draw();
      });
      draw(); drawM();
    },
    check(ans) {
      const ev = labEval(ans);
      const notes = [];
      if (ev.over) notes.push({ ok: false, html: `Набор стоит ${ev.cost} дн. — больше бюджета ${BUDGET}. Игорь так не согласует.` });
      if (ev.mustOn.length < MUSTS.length) notes.push({ ok: false, html: `Утро 8 Марта всё ещё ломается: включено ${ev.mustOn.length} из ${MUSTS.length} требований, без которых праздник не пройдёт. Посмотрите на красные события в хронике — что их убирает?` });
      else notes.push({ ok: true, html: 'Утро 8 Марта проходит без потерь: все пять невидимых требований на месте.' });
      const niceOn = ev.on.filter(id => !MUSTS.some(x => x.id === id));
      if (niceOn.length && ev.mustOn.length < MUSTS.length) notes.push({ ok: 'warn', html: 'Красивое включено, а праздник ломается. То, что видно глазами, легко продать заказчику, — но именно поэтому аналитик первым делом защищает невидимое.' });
      ev.rows.forEach(r => {
        if (r.s === 'empty') notes.push({ ok: false, html: `«${esc(r.x.t)}» — характеристика не выбрана.` });
        else if (r.s === 'warn') notes.push({ ok: 'warn', html: `«${esc(r.x.t)}» — близко: это надёжность, но другая её сторона. «Работает, когда нужно» или «переживает обрыв»?` });
        else if (r.s === 'bad') notes.push({ ok: false, html: `«${esc(r.x.t)}» — характеристика другая. Спросите: это про скорость, про доступность во времени, про сбои, про людей — или это вообще закон?` });
      });
      return {
        ok: ev.mustOn.length === MUSTS.length && !ev.over && ev.score >= 0.8, score: ev.score, notes,
        summary: `Главных требований включено: ${ev.mustOn.length} из ${MUSTS.length}, бюджет: ${ev.cost} из ${BUDGET} дн., характеристик верно: ${ev.rows.filter(r => r.s === 'ok').length} из ${MUSTS.length}.`,
        mentor: niceOn.length >= 2 ? 'Нина попросила тёмную тему, потому что её видно. Про чеки, обрывы связи и простой ночью она не писала, потому что их не видно, пока они работают. Защищать невидимое — работа аналитика.' : null
      };
    },
    explain: `<p>Пять невидимых требований стоят ровно весь бюджет на качество — и каждое закрывает свою дыру в празднике:</p>
      ${ui.table(['Требование', 'Что ломается без него', 'Вид'], [
        ['Готовность 99,5 %, обслуживание 01:00–02:30', 'Обновление вечером 7 марта — заказы на праздник не приняты', 'Надёжность: готовность'],
        ['95 % ответов быстрее 1 с при 400 в час', 'Пик тормозит, двойные заказы, очередь', 'Производительность'],
        ['Чеки по 54-ФЗ', 'Штраф и проверка, ручные чеки задним числом', 'Ограничение: закон (не характеристика ISO)'],
        ['Офлайн-режим кассы, досыл за 15 минут', 'Обрыв связи — выдача встала, очередь до дверей', 'Надёжность: отказоустойчивость'],
        ['Крупный шрифт и контраст', 'Покупатели постарше не могут заказать сами', 'Удобство: доступность для людей']
      ])}
      <p>Обратите внимание на слово «доступность» — у него два смысла. <b>Доступность сервиса во времени</b> (99,5 %) — это надёжность, в ГОСТ Р ИСО/МЭК 25010 она называется «готовность». <b>Доступность для людей</b> — крупный шрифт, контраст, понятные подписи — это удобство использования. Путать их на встрече — значит договориться о разном.</p>
      <p>Тёмная тема и анимация — не плохие идеи. Просто они видны, их легко попросить и легко принять на демо. А невидимое качество закладывают в архитектуру с самого начала: «докрутить скорость» или «добавить офлайн» через месяц после запуска стоит в разы дороже. Заказчик редко пишет такие требования сам — их выясняет и защищает аналитик.</p>`,
    report: ans => {
      const ev = labEval(ans);
      return `Включено (${ev.cost} из ${BUDGET} дн.): ${LAB.filter(x => ev.on.includes(x.id)).map(x => x.t).join(', ') || '—'}\n` + ev.rows.map(r => `- ${r.x.t} → ${(LAB_CH.find(c => c.v === r.got) || { t: '—' }).t} ${r.s === 'ok' ? '✓' : r.s === 'warn' ? '≈' : '✗'}`).join('\n');
    }
  };

  // =====================================================================
  // Практика 4. Явные, неявные, восхищающие
  // =====================================================================
  const KB = [
    { id: 'exp', t: 'Явное', sub: 'сказано словами — в письме или на встрече' },
    { id: 'imp', t: 'Неявное', sub: 'само собой разумеется — никто не скажет' },
    { id: 'wow', t: 'Восхищающее', sub: 'никто не ждёт — приятный сюрприз' }
  ];
  const KHINT = {
    exp: 'Есть ли это в письме Нины? Перечитайте десять пунктов.',
    imp: 'Скажет ли кто-нибудь это вслух? А если этого не будет — что случится?',
    wow: 'Ждёт ли этого покупатель? Расстроится ли он, если этого не будет?'
  };
  const KITEMS = [
    { id: 'k-card', t: 'Оплата картой', ok: 'exp' },
    { id: 'k-cakes', t: 'Заказ торта через приложение', ok: 'exp' },
    { id: 'k-points', t: 'Баллы за покупки', ok: 'exp' },
    { id: 'k-fresh', t: 'Выпечка в предзаказе — сегодняшняя, свежая', ok: 'imp' },
    { id: 'k-ready', t: 'Заказ действительно собран к началу выбранного интервала', ok: 'imp' },
    { id: 'k-data', t: 'Телефон покупателя не утекает посторонним', ok: 'imp' },
    { id: 'k-photo', t: 'Фото готового торта приходит покупателю до выдачи', ok: 'wow' },
    { id: 'k-repeat', t: '«Повторить прошлый заказ» в одно касание', ok: 'wow' },
    { id: 'k-bday', t: 'Тёплый круассан в подарок в день рождения', ok: 'wow' }
  ];
  const KANO_Q = {
    q: 'Через пять лет «повторить прошлый заказ» есть у всех пекарен города. Что станет с этим требованием?', seed: 'rqt-kano-q',
    options: [
      { t: 'Станет неявным: его будут ждать как само собой разумеющееся, а его отсутствие начнёт раздражать', ok: 1, why: 'Да: восхищение со временем становится нормой — как Wi-Fi в гостинице.' },
      { t: 'Останется восхищающим навсегда — это же удобно', why: 'Удобно, но привычно. Когда это есть у всех, никто уже не восхищается.' },
      { t: 'Станет ненужным — все и так научатся заказывать', why: 'Нужным оно останется; изменится то, как люди к нему относятся.' },
      { t: 'Станет бизнес-требованием', why: 'Модель Кано — про отношение покупателей, а не про уровень требования.' }
    ]
  };
  function kanoEval(v) {
    v = v || {};
    return KITEMS.map(k => ({ k, got: v[k.id], s: v[k.id] === k.ok ? 'ok' : 'bad', empty: !v[k.id] }));
  }
  const kanoTask = {
    id: 'kano', title: 'Явные, неявные, восхищающие',
    simple: howKano.simple,
    lead: ui.brief({
      situation: 'Рита прислала список «что людям понравится», Ксения добавила к нему пункты из письма Нины и свои заметки. Ксения: «Разложите, что из этого заказчик сказал сам, что подразумевает молча, а что станет приятным сюрпризом. Неявное — главный кандидат на “забыли”, а восхищающее — на “отложим, если не хватит денег”».',
      todo: [
        'Разложите 9 карточек по трём корзинам.',
        'Для каждой спросите: это есть в письме Нины? скажет ли кто-нибудь это вслух? расстроится ли покупатель, если этого не будет?',
        'Ответьте на вопрос в конце и нажмите «Проверить». Засчитывается от 80 %.'
      ],
      lookTitle: 'Подсказка',
      look: 'Явное — названо словами. Неявное — не названо, но без него скандал. Восхищающее — не названо и никто не ждёт; нет — не расстроятся.'
    }),
    blank: () => ({ v: {}, q: [] }),
    reference: () => ({ v: Object.fromEntries(KITEMS.map(k => [k.id, k.ok])), q: quizRef(KANO_Q) }),
    render(el, ctx) {
      el.classList.add('rqt-root');
      const a = ctx.ans; a.v = a.v || {}; a.q = a.q || [];
      let reveal = null;
      if (ctx.result) { reveal = {}; kanoEval(a.v).forEach(x => { reveal[x.k.id] = x.s; }); }
      const box = document.createElement('div'); el.appendChild(box);
      ui.sort(box, { items: KITEMS.map(k => ({ id: k.id, t: k.t })), buckets: KB, value: a.v, reveal, readonly: ctx.readonly, seed: 'rqt-kano', onChange: v => { a.v = v; ctx.save(); } });
      const q = document.createElement('div'); q.className = 'card flat'; q.style.marginTop = '14px'; el.appendChild(q);
      ui.quiz(q, Object.assign({}, KANO_Q, { value: a.q, readonly: ctx.readonly, reveal: ctx.result, onChange: v => { a.q = v; ctx.save(); } }));
    },
    check(ans) {
      const ev = kanoEval(ans && ans.v), good = ev.filter(x => x.s === 'ok').length;
      const q = ui.quizScore(KANO_Q, (ans && ans.q) || []);
      const notes = [];
      const empty = ev.filter(x => x.empty).length;
      if (empty) notes.push({ ok: false, html: `Не разложено ${empty} из ${KITEMS.length}.` });
      ev.forEach(x => { if (x.s === 'bad' && !x.empty) notes.push({ ok: false, html: `«${esc(x.k.t)}» — ${KHINT[x.k.ok]}` }); });
      if (good === KITEMS.length) notes.push({ ok: true, html: 'Все девять — по местам.' });
      notes.push(q.ok ? { ok: true, html: 'Вопрос: верно — восхищение со временем становится нормой.' } : { ok: false, html: 'Вопрос: вспомните переключатель «время» в теории — что стало с Wi-Fi в гостинице?' });
      const score = (good / KITEMS.length) * 0.75 + q.score * 0.25;
      const impAsWow = ev.filter(x => x.k.ok === 'imp' && x.got === 'wow').length;
      return {
        ok: score >= 0.8 && q.ok, score, notes,
        summary: `По местам: ${good} из ${KITEMS.length}.`,
        mentor: impAsWow ? 'Свежая выпечка и собранный вовремя заказ никого не восхитят — их просто ждут. Зато их отсутствие запомнят надолго. Это и есть признак неявного требования.' : null
      };
    },
    explain: `<ul class="checks">
        <li><b>Явные</b> — оплата картой, торты через приложение, баллы. Всё это есть в письме Нины. Их легко собрать: достаточно слушать.</li>
        <li><b>Неявные</b> — свежая выпечка, заказ собран к началу интервала, телефон покупателя не утекает. Их никто не скажет: «само собой». Но если нарушить — скандал в соцсетях, как с потерянными тортами к 8 Марта. Их находят наблюдением, вопросами «а если…?» и чек-листами вроде ISO 25010.</li>
        <li><b>Восхищающие</b> — фото готового торта, «повторить заказ», круассан в день рождения. Без них не расстроятся, с ними — расскажут подругам. Их приоритет решают отдельно: это кандидаты на «если останется время».</li>
      </ul>
      <p>Восхищение стареет: через несколько лет «повторить заказ» станет неявным требованием. Это и есть мостик к <b>модели Кано</b>: обязательные, одномерные и привлекательные свойства. Как по ней расставлять приоритеты, разберём на неделе 4.</p>`,
    report: ans => kanoEval(ans && ans.v).map(x => `- ${x.k.t} → ${(KB.find(b => b.id === x.got) || { t: '—' }).t} ${x.s === 'ok' ? '✓' : '✗'}`).join('\n') + `\nВопрос о «старении» восхищения: ${ui.quizScore(KANO_Q, (ans && ans.q) || []).ok ? 'верно' : 'неверно'}.`
  };

  // =====================================================================
  // Практика 5. Объясните Нине, зачем нефункциональные требования
  // =====================================================================
  const WHY_RUBRIC = [
    'Простыми словами объясняет разницу: функции — что делает система (принять заказ, пробить чек), качество — насколько хорошо (быстро, без сбоев, удобно)',
    'Превращает «всегда» и «удобно» в цифры и условия: например, 99,5 % времени с обслуживанием ночью 01:00–02:30, 95 % ответов быстрее секунды в пик, крупный шрифт',
    'Называет то, чего в письме нет, но без чего нельзя: чеки по 54-ФЗ, хранение данных покупателей по 152-ФЗ, работа кассы при обрыве связи',
    'Показывает последствия для её бизнеса на примере утра 8 Марта: заказы не приняты, очередь, штраф',
    'Объясняет, зачем договориться заранее: от этих чисел зависит, как и за сколько строят систему, а «докрутить» потом — в разы дороже'
  ];
  const WHY_REF = 'Нина Сергеевна, в вашем письме главное уже есть: что система должна делать — принимать предзаказы, торты, оплату, отдавать сводку в 1С. Это функции. Но есть вторая половина — насколько хорошо она это делает. «Всегда и без сбоев» мы предлагаем записать так: приём заказов работает 99,5 % времени в месяц, а обновления — только ночью, с часа до половины третьего. «Чтобы не тормозило» — в утренний пик, до 400 заказов в час, 95 % ответов быстрее секунды. «Удобно для бабушек» — крупный шрифт, понятные подписи и заказ через кассира по телефону. И то, чего в письме нет, но без чего нельзя: чеки по 54-ФЗ при предоплате и при выдаче, данные покупателей — по 152-ФЗ, касса продолжает работать, если на Покровке пропала связь. Представьте утро 8 Марта: если не договориться об этом заранее, обновление вечером 7-го закроет приём заказов, касса встанет при обрыве связи, а за непробитые чеки придёт штраф. От этих цифр зависит, как Дима будет строить систему и сколько это стоит, — «докрутить» скорость или офлайн-режим после запуска выйдет в разы дороже. Поэтому предлагаю сейчас согласовать пять-шесть таких цифр.';
  const whyTask = {
    id: 'why', title: 'Объясните Нине, зачем «какие-то нефункциональные»',
    simple: {
      icon: '🗣️',
      plain: 'Заказчик думает о том, что система делает. О том, насколько хорошо, он вспоминает, только когда что-то сломалось. Ваша задача — объяснить это заранее, его словами и на его примерах.',
      analogy: 'Хозяйке новой пекарни объясняют, почему в смете не только витрина и печи, но и запасной генератор, вытяжка и кассовый аппарат по закону. Без них в первый же праздник встанет всё.',
      tech: 'Аргументация нефункциональных требований для заказчика: перевод неизмеримых пожеланий («всегда», «быстро», «удобно») в числа и условия; явный перечень неявных требований (законы, отказоустойчивость); последствия на сценарии пиковой нагрузки; влияние на архитектуру и стоимость (ошибка в требованиях дорожает с каждой стадией — эвристика Боэма).'
    },
    lead: ui.brief({
      situation: 'Ксения отправила Нине Сергеевне черновой список нефункциональных требований. Через час — ответ в чате. Игорь: «Ответьте вы. Нам нужно её согласие на пять-шесть цифр до конца обследования — иначе Дима не сможет оценить архитектуру».',
      todo: [
        'Прочитайте сообщение Нины.',
        'Напишите ответ: 6–9 предложений, от 300 символов. Без слова «нефункциональные» через строчку — говорите про её пекарни, праздники и деньги.',
        'Нажмите «Проверить с Ксенией (Claude)» или «Сверить с эталоном самому» и честно отметьте раскрытые пункты. Засчитывается от 60 %.'
      ],
      lookTitle: 'На что опереться',
      look: 'Пункты 9 и 10 её письма — «всегда и без сбоев», «удобно для бабушек». Классификатор: что из «Колоса» — качество, правило, ограничение. Лаборатория: что ломается утром 8 Марта без пяти невидимых требований.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: WHY_REF, self: WHY_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('rqt-root');
      el.insertAdjacentHTML('beforeend', ui.say('nina', 'Я же написала: «всё должно работать всегда и без сбоев» и «удобно для бабушек». Чего вам ещё не хватает? Зачем мне какие-то «нефункциональные требования»? И при чём тут законы — это же к Олегу Петровичу.'));
      const j = document.createElement('div'); j.style.marginTop = '12px'; el.appendChild(j);
      ui.justify(j, {
        id: 'rqt-why', q: 'Ответ Нине: зачем записывать «насколько хорошо» в цифрах?', qPlain: 'Ответьте владелице сети пекарен, которая считает, что «всё должно работать всегда» и «удобно для бабушек» — уже достаточно. Объясните без жаргона разницу между тем, что система делает, и тем, насколько хорошо; превратите её пожелания в цифры; назовите то, чего нет в письме (законы, работа при обрыве связи); покажите последствия на утре 8 Марта и объясните, зачем договориться заранее.',
        rubric: WHY_RUBRIC, reference: WHY_REF, value: ctx.ans.j, readonly: ctx.readonly, minLen: 300,
        onChange: v => { ctx.ans.j = v; ctx.save(); ctx.decide('Ответ Нине про качество', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j);
      return {
        ok: s >= 0.6, score: s,
        summary: s ? `Оценка ответа: ${Math.round(s * 100)} %.` : 'Напишите ответ (от 300 символов) и проверьте его с Ксенией или сверьте с эталоном сами.',
        notes: s && s < 0.6 ? [{ ok: false, html: 'Нину убеждают не термины, а её же праздник. Возьмите «всегда» из её письма, превратите в число и покажите, что случится утром 8 Марта, если числа не будет.' }] : []
      };
    },
    explain: '<p>Сильный ответ опирается на её же слова: «всегда» и «удобно» уже в письме — аналитик не спорит, а <b>уточняет числом</b>. Дальше — то, о чём заказчик не думает, потому что это невидимо: законы, обрыв связи, обслуживание ночью. И главный аргумент — <b>её главный день</b>: утро 8 Марта, когда в прошлом году потеряли 9 заказов.</p><p>Последний ход — деньги: от цифр качества зависит архитектура, а значит и смета. Это честно: «95 % быстрее секунды при 400 заказах в час» и «как-нибудь побыстрее» стоят по-разному. Договориться заранее дешевле, чем переделывать после запуска. Как сделать каждое такое требование измеримым и проверяемым — в среду, «Хорошее требование».</p>',
    report: ans => (ans.j && ans.j.text) ? ans.j.text : '—'
  };

  // =====================================================================
  TR.stage({
    id: ID, act: 2, order: 120, slot: 'Вт 10:00', title: 'Виды требований',
    when: 'вторник, 13 октября, 10:00 · переговорная «Квант Софт»',
    intro: [
      { who: 'dima', html: 'Вчера вы разложили письмо Нины по уровням. Сегодня мне нужно другое: что из этого функции, а что — качество. Функции мы запрограммируем. Качество я заложу в архитектуру — его потом не докрутишь. Перепутаете — узнаем об этом утром 8 Марта.' },
      { who: 'lera', html: 'А я спрошу, как это проверить. «Всегда без сбоев» — это сколько? «Удобно для бабушек» — это как? И что будет, если на Покровке пропадёт интернет?' },
      { who: 'ksenia', html: 'Требования бывают разных видов, и у каждого — свои вопросы. Сегодня научимся различать функции, качество, правила, ограничения и интерфейсы, пройдём по модели качества ISO 25010 и посмотрим, что случится в главный день года, если о качестве забыть.' }
    ],
    facts: [],
    glossary: [
      { term: 'Функциональное требование', simple: '«Что печём»: круассан, торт с надписью, предзаказ на утро.', tech: 'Описывает поведение системы: что она делает в ответ на действия пользователя или события. Пример: «Система добавляет оплаченные предзаказы к плану выпечки в 23:00».' },
      { term: 'Нефункциональное требование', simple: '«Насколько хорошо печём»: тёплый, хрустящий, к 7:30, без очереди.', tech: 'Требование к качеству системы и условиям её работы: производительность, надёжность, удобство, защищённость и т. д. Записывается числом и способом проверки: «95 % ответов быстрее 1 с при 400 заказах в час». Сокращённо — НФТ.' },
      { term: 'Атрибут качества', simple: 'Одна сторона «насколько хорошо»: скорость, надёжность, удобство.', tech: 'Свойство системы, по которому судят о её качестве (Вигерс). Атрибуты качества — основная часть нефункциональных требований; их перечень задают модели качества (ISO/IEC 25010, FURPS+).' },
      { term: 'ISO/IEC 25010', simple: 'Чек-лист технолога для приёмки новой печи — только для программ.', tech: 'Международная модель качества программного продукта. Ред. 2011 (ГОСТ Р ИСО/МЭК 25010-2015) — 8 характеристик; ред. 2023 — 9: добавлена безопасность (safety), удобство названо «способностью к взаимодействию», переносимость — «гибкостью».' },
      { term: 'FURPS+', simple: 'Короткая памятка из пяти букв и плюса.', tech: 'Схема классификации требований Роберта Грейди (Hewlett-Packard): Functionality, Usability, Reliability, Performance, Supportability; «+» — ограничения проектирования, реализации, интерфейсов и физические.' },
      { term: 'Внешний интерфейс', simple: 'Договор с поставщиком муки: что, когда и в каком виде привозят.', tech: 'Требование к обмену системы с внешним миром: пользователями (экраны), другими системами (1С, «КассаПро», «ПэйМост») и устройствами. Описывает данные, формат, время и поведение при сбое.' },
      { term: 'Явное требование', simple: 'То, что заказчик сказал вслух: «Оплата картой».', tech: 'Требование, которое заинтересованные лица называют сами — в письме, на интервью, на встрече.' },
      { term: 'Неявное требование', simple: '«Хлеб должен быть свежим» — никто не скажет, но без этого всё бессмысленно.', tech: 'Требование, которое подразумевается и всплывает, только когда нарушено. Выявляется наблюдением, вопросами «а если…?», чек-листами качества и законов.' },
      { term: 'Восхищающее требование', simple: 'Тёплый круассан в подарок в день рождения: никто не ждал — все рады.', tech: 'Свойство, которого не ждут: его отсутствие не расстраивает, наличие радует. Со временем становится нормой. По модели Кано — привлекательное свойство.' },
      { term: 'Модель Кано', simple: 'Как разное влияет на довольство: бельё в гостинице, скорость Wi-Fi, записка от горничной.', tech: 'Модель Нориаки Кано (1984): свойства продукта бывают обязательными, одномерными, привлекательными, безразличными и обратными. Используется для приоритизации (неделя 4).' }
    ],
    outro: 'Теперь вы видите в требованиях не одну кучу, а пять видов: что делает система, насколько хорошо, по каким правилам бизнеса, в каких рамках и с кем обменивается. Модель ISO 25010 — ваш чек-лист против забывчивости, а Кано напоминает: самые важные требования часто никто не произносит. В среду научимся писать требования так, чтобы Лера могла их проверить.',
    tasks: [howKinds, howIso, howKano, classifyTask, hiddenTask, labTask, kanoTask, whyTask]
  });
})();
