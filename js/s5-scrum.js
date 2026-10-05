/* Неделя 5, понедельник 10:00 — «Scrum изнутри».
   Теория: карта каркаса по Scrum Guide 2020 (3 зоны ответственности, 5 событий, 3 артефакта и их обязательства,
   переключатель «+ практики команд»); спринт «Колоса» по дням — календарь двух недель с дорожками «команда / аналитик /
   с кем говорит» и переключателем «аналитик на спринт вперёд / в том же спринте»; оценка — planning poker с картами
   и разбором расхождения, спор «пункты, часы или без оценок», скорость и прогноз диапазоном.
   Практика: разложить элементы Scrum с ловушками; лаборатория «спринт 3 Колоса» (решения аналитика по дням и последствия);
   планирование спринта 4 — набор под скорость и цель спринта (мини-редактор с признаками); ответ своими словами —
   где аналитик в Scrum. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;

  if (!document.getElementById('scr-css')) document.head.insertAdjacentHTML('beforeend', `<style id="scr-css">
    .scr-root, .scr-root .stack { min-width: 0; }
    .scr-root .stack > * { min-width: 0; }
    .scr-root .seg button { white-space: normal; text-align: left; }
    .scr-box { display: grid; gap: 10px; padding: 14px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); min-width: 0; }
    .scr-box > * { min-width: 0; }
    .scr-map { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
    .scr-col { border: 1px solid var(--border); border-radius: 12px; background: var(--surface); padding: 10px; display: grid; gap: 6px; align-content: start; min-width: 0; }
    .scr-col .h { font: 600 11px/1.3 var(--f-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--text-muted); }
    .scr-col.pr { grid-column: 1 / -1; border-style: dashed; background: var(--surface-2); }
    .scr-col.pr .items { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 6px; }
    .scr-el { text-align: left; font: inherit; color: inherit; border: 1px solid var(--border-strong); background: var(--surface-2); border-radius: 9px; padding: 7px 10px; cursor: pointer; display: grid; gap: 1px; min-width: 0; }
    .scr-el b { font-size: 13.5px; font-weight: 600; overflow-wrap: anywhere; }
    .scr-el .s { font-size: 11.5px; color: var(--text-muted); overflow-wrap: anywhere; }
    .scr-el:hover { border-color: var(--text-muted); }
    .scr-el.cm { margin-left: 16px; border-color: color-mix(in srgb, var(--violet) 55%, transparent); }
    .scr-el.cm b::before { content: "↳ "; color: var(--violet); }
    .scr-el.prx { border-style: dashed; background: var(--surface); }
    .scr-el.lit { box-shadow: 0 0 0 2px var(--violet); }
    .scr-el.on { border-color: var(--accent); background: var(--accent-soft); box-shadow: none; }
    .scr-el.seen:not(.on) b::after { content: " ✓"; color: var(--ok); font-weight: 400; }
    .scr-kv { display: grid; grid-template-columns: minmax(0, 150px) minmax(0, 1fr); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; background: var(--surface); }
    .scr-kv > div { padding: 8px 12px; border-top: 1px solid var(--border); font-size: 14px; min-width: 0; overflow-wrap: anywhere; }
    .scr-kv > div:nth-child(-n+2) { border-top: 0; }
    .scr-kv .k { font: 600 11px/1.4 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); background: var(--surface-2); }
    .scr-kv .k.an { color: var(--accent); }
    .scr-cal { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; }
    .scr-wk { grid-column: 1 / -1; font: 600 11px/1.2 var(--f-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--text-muted); margin-top: 2px; }
    .scr-day { font: inherit; color: inherit; text-align: left; border: 1px solid var(--border-strong); border-radius: 10px; background: var(--surface-2); padding: 6px 8px; cursor: pointer; display: grid; gap: 3px; align-content: start; min-height: 62px; min-width: 0; }
    .scr-day .dn { font: 600 11px/1.2 var(--f-mono); color: var(--text-muted); }
    .scr-day .ev { font-size: 12px; line-height: 1.25; overflow-wrap: anywhere; }
    .scr-day.ok { box-shadow: inset 3px 0 0 var(--ok); } .scr-day.bad { box-shadow: inset 3px 0 0 var(--bad); } .scr-day.warn { box-shadow: inset 3px 0 0 var(--warn); }
    .scr-day.on { border-color: var(--accent); background: var(--accent-soft); }
    .scr-day .short { display: none; }
    .scr-lane { display: grid; grid-template-columns: minmax(0, 150px) minmax(0, 1fr); gap: 10px; padding: 8px 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); }
    .scr-lane > * { min-width: 0; overflow-wrap: anywhere; }
    .scr-lane .k { font: 600 11px/1.5 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .scr-lane.an { border-color: color-mix(in srgb, var(--accent) 50%, transparent); }
    .scr-lane.an .k { color: var(--accent); }
    .scr-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
    .scr-stats .v { font-size: 17px; overflow-wrap: anywhere; }
    .scr-deck { display: flex; flex-wrap: wrap; gap: 6px; }
    .scr-pc { width: 44px; height: 60px; border-radius: 8px; border: 1px solid var(--border-strong); background: var(--surface); font: 600 18px/1 var(--f-mono); display: grid; place-items: center; cursor: pointer; color: var(--text); transition: transform .12s; }
    .scr-pc:hover { border-color: var(--text-muted); }
    .scr-pc[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); transform: translateY(-4px); }
    .scr-pc:disabled { cursor: default; }
    .scr-tbl { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; }
    .scr-seat { display: grid; justify-items: center; gap: 4px; padding: 8px 4px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); font-size: 12px; text-align: center; min-width: 0; }
    .scr-seat .c { width: 40px; height: 54px; border-radius: 7px; display: grid; place-items: center; font: 600 17px/1 var(--f-mono); border: 1px solid var(--border-strong); background: repeating-linear-gradient(45deg, var(--surface-3) 0 6px, var(--surface-2) 6px 12px); color: transparent; }
    .scr-seat .c.up { background: var(--surface-2); color: var(--text); }
    .scr-seat .c.hi { border-color: var(--bad); color: var(--bad); box-shadow: 0 0 0 1px var(--bad); }
    .scr-seat .c.lo { border-color: var(--info); color: var(--info); box-shadow: 0 0 0 1px var(--info); }
    .scr-seat .nm { overflow-wrap: anywhere; line-height: 1.2; color: var(--text-2); }
    .scr-story { padding: 10px 14px; border-radius: 10px; border: 1px solid color-mix(in srgb, var(--warn) 45%, transparent); background: var(--warn-soft); font-size: 14.5px; }
    .scr-story .lbl, .scr-lbl { font: 600 10.5px/1.2 var(--f-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 3px; }
    .scr-opts { display: grid; gap: 6px; }
    .scr-opt { text-align: left; font: inherit; font-size: 14px; color: inherit; border: 1px solid var(--border-strong); background: var(--surface-2); border-radius: 9px; padding: 8px 10px; cursor: pointer; display: grid; grid-template-columns: 16px minmax(0, 1fr); gap: 8px; align-items: start; min-width: 0; }
    .scr-opt .mk { width: 14px; height: 14px; border-radius: 50%; border: 2px solid var(--border-strong); margin-top: 3px; }
    .scr-opt:hover { border-color: var(--text-muted); }
    .scr-opt[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .scr-opt[aria-pressed="true"] .mk { border-color: var(--accent); background: var(--accent); }
    .scr-opt:disabled { cursor: default; }
    .scr-opt.ok { border-color: var(--ok); } .scr-opt.warn { border-color: var(--warn); } .scr-opt.bad { border-color: var(--bad); }
    .scr-lday { border: 1px solid var(--border); border-radius: 12px; background: var(--surface); padding: 12px 14px; display: grid; gap: 8px; min-width: 0; }
    .scr-lday .when { font: 600 11px/1.3 var(--f-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--text-muted); }
    .scr-lday.ok { border-color: var(--ok); } .scr-lday.warn { border-color: var(--warn); } .scr-lday.bad { border-color: var(--bad); }
    .scr-goalbar { padding: 10px 14px; border-radius: 10px; background: var(--accent-soft); border: 1px solid color-mix(in srgb, var(--accent) 40%, transparent); font-size: 14px; }
    .scr-bl { display: grid; gap: 6px; }
    .scr-bi { text-align: left; font: inherit; color: inherit; display: grid; grid-template-columns: 22px minmax(0, 1fr) auto; gap: 10px; align-items: center; padding: 8px 10px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); cursor: pointer; min-width: 0; }
    .scr-bi:hover { border-color: var(--text-muted); }
    .scr-bi .no { font: 600 12px/1 var(--f-mono); color: var(--text-muted); }
    .scr-bi .t { min-width: 0; overflow-wrap: anywhere; font-size: 14px; }
    .scr-bi .t .small { display: block; margin-top: 2px; }
    .scr-bi .pts { font: 600 13px/1 var(--f-mono); padding: 5px 8px; border-radius: 6px; background: var(--surface-3); white-space: nowrap; }
    .scr-bi[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .scr-bi.ok { border-color: var(--ok); } .scr-bi.bad { border-color: var(--bad); } .scr-bi.warn { border-color: var(--warn); }
    .scr-bi:disabled { cursor: default; }
    .scr-feats { display: flex; flex-wrap: wrap; gap: 6px; }
    .scr-feats .chip { white-space: normal; }
    .scr-root textarea { width: 100%; max-width: 100%; }
    .scr-bar { position: relative; height: 22px; border-radius: 6px; background: var(--surface-3); overflow: hidden; }
    .scr-bar i { position: absolute; top: 0; bottom: 0; border-radius: 6px; }
    .scr-bar span { position: absolute; top: 0; line-height: 22px; font: 600 11px/22px var(--f-mono); padding: 0 6px; color: var(--text); white-space: nowrap; }
    .scr-range { width: 100%; accent-color: var(--accent); }
    .scr-set { display: grid; grid-template-columns: minmax(0, 170px) minmax(0, 1fr) 46px; gap: 6px 12px; align-items: center; font-size: 13.5px; }
    .scr-set > * { min-width: 0; }
    .scr-set .val { font: 600 13px/1 var(--f-mono); text-align: right; }
    .scr-pros { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .scr-pros ul { margin: 0; padding-left: 18px; display: grid; gap: 4px; font-size: 13.5px; }
    @media (max-width: 640px) {
      .scr-map { grid-template-columns: minmax(0, 1fr); }
      .scr-kv { grid-template-columns: minmax(0, 1fr); }
      .scr-kv > div:nth-child(2) { border-top: 0; }
      .scr-kv > div.k { border-top: 1px solid var(--border); padding-bottom: 2px; }
      .scr-kv > div:first-child { border-top: 0; }
      .scr-kv > div.v { border-top: 0; padding-top: 4px; }
      .scr-cal { gap: 4px; }
      .scr-day { padding: 5px 5px; min-height: 58px; }
      .scr-day .ev { font-size: 10.5px; }
      .scr-day .full { display: none; } .scr-day .short { display: block; }
      .scr-lane { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .scr-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .scr-tbl { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .scr-set { grid-template-columns: minmax(0, 1fr) 46px; }
      .scr-set .lbl { grid-column: 1 / -1; margin-top: 6px; }
      .scr-pros { grid-template-columns: minmax(0, 1fr); }
      .scr-bi { grid-template-columns: 18px minmax(0, 1fr) auto; gap: 8px; }
    }
  </style>`);

  // ---------- общие помощники ----------
  const chip = (t, k) => `<span class="chip ${k || ''}">${t}</span>`;
  const sayAs = (name, ini, html) => `<div class="say"><div class="avatar" aria-hidden="true">${esc(ini)}</div><div class="bubble"><div class="who"><b>${esc(name)}</b></div><div>${html}</div></div></div>`;
  const anNote = html => `<div style="margin-top:12px">${ui.note('info', 'Позиция аналитика', html)}</div>`;

  // =====================================================================
  // Теория 1. Каркас Scrum: зоны ответственности, события, артефакты и обязательства
  // =====================================================================
  const FR_ROWS = [['one', 'Одной фразой'], ['time', 'Сколько длится'], ['bakery', 'В пекарне'], ['kolos', 'В «Колосе»'], ['an', 'Где аналитик'], ['confuse', 'Часто путают'], ['without', 'Если убрать']];
  const FR = {
    roles: [
      { id: 'po', t: 'Владелец продукта', s: 'Product Owner',
        one: 'Один человек, который решает, что в продукте важнее, и отвечает за его ценность. Он упорядочивает бэклог продукта.',
        bakery: 'Хозяйка пекарни: решает, что печь в первую очередь, и пробует результат.',
        kolos: 'Нина Сергеевна. Ежедневные вопросы она делегирует Павлу (операционка) и Галине Ивановне (цех). Scrum Guide это разрешает: работу можно поручить другим, но отвечает за решения всё равно владелец продукта.',
        an: 'Готовит для Нины варианты с ценой и последствиями, пишет истории и критерии. Но порядок в бэклоге решает Нина, а не аналитик.',
        confuse: 'Это не комитет и не «заказчик вообще», а один человек. Аналитик не становится владельцем продукта, даже если пишет весь бэклог.',
        without: 'Команда сама гадает, что важнее, — и делает то, о чём громче просят.' },
      { id: 'sm', t: 'Scrum-мастер', s: 'Scrum Master',
        one: 'Отвечает за то, чтобы Scrum работал: учит команду и организацию, убирает помехи, помогает событиям быть полезными и укладываться во время.',
        bakery: 'Старший смены, который следит, чтобы пятиминутка у печи не превращалась в собрание на час, и добывает муку, если она кончилась.',
        kolos: 'Должности «Scrum-мастер» в списке команды «Колоса» нет. Scrum Guide описывает зону ответственности, а не должность: кто её несёт, решают в компании. Частый компромисс — руководитель проекта, и практики о нём спорят: тот, кто отвечает за сроки, легко начинает давить, а не помогать.',
        an: 'Приносит на ретроспективу то, что видит первым: вопросы висят по два дня, истории приходят сырыми, Нина не успевает на обзоры.',
        confuse: 'Не начальник команды и не секретарь, который пишет протоколы.',
        without: 'Встречи расползаются по времени, помехи никто не убирает, Scrum превращается в «созвоны ради созвонов».' },
      { id: 'dev', t: 'Разработчики', s: 'Developers',
        one: 'Все, кто делает работающий результат спринта: программисты, тестировщик, дизайнер, аналитик. Сами решают, как сделать работу.',
        bakery: 'Вся бригада цеха: тестомес, пекарь, кондитер, контролёр — каждый делает свою часть одного торта.',
        kolos: 'Дима, два разработчика, Лера, Соня, Ксения и вы. Вся Scrum-команда обычно не больше 10 человек.',
        an: 'Аналитик — один из разработчиков. Scrum Guide не знает должностей «аналитик», «тестировщик», «тимлид»: внутри разработчиков нет подкоманд и начальников.',
        confuse: '«Разработчик» в Scrum — не только программист. В редакции 2020 «команду разработки» переименовали в «разработчиков», а слово «роли» — в «зоны ответственности».',
        without: 'Задачи раздают сверху, и никто не отвечает за результат целиком.' }
    ],
    events: [
      { id: 'sprint', t: 'Спринт', s: 'Sprint — контейнер',
        one: 'Отрезок фиксированной длины, внутри которого проходят все остальные события. Следующий спринт начинается сразу после предыдущего.',
        time: 'Не дольше месяца. У «Квант Софт» — 2 недели, 10 рабочих дней.',
        bakery: 'Двухнедельное меню: в начале выбрали, что печём, в конце — дегустация и разбор.',
        kolos: 'Спринт 3 — с планирования в понедельник до ретроспективы в пятницу через неделю. Демо Нине в конце — по договору.',
        an: 'Держит в голове два спринта: текущий (отвечать команде в тот же день) и следующий (готовить истории).',
        confuse: 'Спринт — тоже событие, а не просто период. Цель спринта по ходу не меняют, а объём можно уточнить с владельцем продукта.',
        without: 'Без коротких циклов результат и обратная связь появляются только в конце проекта — это каскад.' },
      { id: 'plan', t: 'Планирование спринта', s: 'Sprint Planning',
        one: 'Отвечает на три вопроса: зачем этот спринт (цель), что успеем (истории), как сделаем (план задач).',
        time: 'До 8 часов на месячный спринт. Для двухнедельного обычно короче — до 4 часов.',
        bakery: 'Утро понедельника: хозяйка говорит, что важнее на две недели, пекари решают, сколько успеют и как.',
        kolos: 'Нина подтверждает порядок и цель, команда Димы выбирает истории под свою скорость и раскладывает их на задачи.',
        an: 'Рассказывает истории и отвечает на вопросы. Истории должны прийти готовыми — переписывать критерии на планировании поздно.',
        confuse: 'Цель спринта формулирует вся Scrum-команда, а не только владелец продукта.',
        without: 'Каждый делает «своё», и к обзору нечего показать одним куском.' },
      { id: 'daily', t: 'Ежедневный Scrum', s: 'Daily Scrum',
        one: 'Разработчики сверяют, как идут к цели спринта, и при необходимости меняют план на день.',
        time: '15 минут, каждый рабочий день в одно и то же время.',
        bakery: 'Пятиминутка у печи в начале смены: что горит, кому помочь.',
        kolos: 'В 10:00 у доски или созвоном. Подробные разговоры — сразу после, с теми, кого они касаются.',
        an: 'Слушает, где команда споткнулась о требования. Вопрос разбирает сразу после встречи, а не на ней.',
        confuse: 'Это не отчёт начальнику. Три обязательных вопроса «что делал, что буду делать, что мешает» в редакции 2020 убрали — формат команда выбирает сама.',
        without: 'Проблема всплывает через неделю, а не на следующий день.' },
      { id: 'review', t: 'Обзор спринта', s: 'Sprint Review',
        one: 'Команда и заинтересованные лица смотрят, что сделано, и вместе решают, что делать дальше. Рабочая встреча, а не презентация.',
        time: 'До 4 часов на месячный спринт; для двухнедельного обычно до 2 часов.',
        bakery: 'Дегустация: хозяйка и управляющие пробуют новую выпечку и говорят, что поменять.',
        kolos: 'Нина, Павел и Галина Ивановна сами пробуют приложение и экран кассира. Отзывы и решения — в бэклог.',
        an: 'Готовит сценарий показа на живых примерах, записывает решения и отзывы в бэклог.',
        confuse: '«Демо» — часть обзора, а не отдельное событие. И обзор — не «ворота»: готовое можно выпустить и раньше.',
        without: 'Владелица впервые увидит продукт на запуске — как в каскаде.' },
      { id: 'retro', t: 'Ретроспектива', s: 'Sprint Retrospective',
        one: 'Команда разбирает, как работала, — люди, взаимодействие, инструменты, определение «готово» — и выбирает улучшения.',
        time: 'До 3 часов на месячный спринт; для двухнедельного обычно до 1,5 часа. Завершает спринт.',
        bakery: 'После смены: почему опять не хватило противней и что поменять завтра.',
        kolos: 'Только Scrum-команда. Итог — одна-две конкретные перемены на следующий спринт.',
        an: 'Приносит наблюдения: где ждали ответов, какие истории оказались сырыми. Берёт на себя улучшение, которое касается требований.',
        confuse: 'Не поиск виноватых и не жалобная книга.',
        without: 'Одни и те же грабли каждый спринт.' }
    ],
    arts: [
      { id: 'pb', t: 'Бэклог продукта', s: 'Product Backlog', cm: 'pg',
        one: 'Упорядоченный список всего, что может понадобиться продукту. Единственный источник работы для команды.',
        bakery: 'Общий список всех будущих рецептов, от самого нужного к «когда-нибудь».',
        kolos: 'Истории предзаказа и тортов, сводка в 1С, баллы. Порядок определяет Нина.',
        an: 'Ведёт и уточняет вместе с Ниной: режет эпики, пишет критерии, поднимает вопросы.',
        confuse: 'Это не ТЗ, утверждённое раз и навсегда: бэклог живой и меняется после каждого обзора.' },
      { id: 'sb', t: 'Бэклог спринта', s: 'Sprint Backlog', cm: 'sg',
        one: 'Цель спринта + выбранные истории + план, как их сделать. Принадлежит разработчикам и меняется по ходу спринта.',
        bakery: 'Меню на эти две недели и раскладка, кто что печёт.',
        kolos: 'Доска спринта у Димы: истории спринта 3 и их задачи.',
        an: 'Следит, чтобы у каждой истории в спринте были понятные критерии, и отвечает на вопросы по ним.',
        confuse: 'Владелец продукта не дописывает туда новые задачи посреди спринта — новое идёт в бэклог продукта.' },
      { id: 'inc', t: 'Инкремент', s: 'Increment', cm: 'dod',
        one: 'Шаг к цели продукта: проверенная, работающая часть, которой можно пользоваться. За спринт их может быть несколько.',
        bakery: 'Готовый торт, который можно поставить на витрину, а не «почти испечённый».',
        kolos: 'Например: покупатель уже выбирает пекарню и интервал и оформляет предзаказ на тестовом стенде.',
        an: 'Сверяет с критериями приёмки и показывает на обзоре.',
        confuse: 'Неготовое по Definition of Done в инкремент не входит — даже «почти готовое».' }
    ],
    cms: [
      { id: 'pg', t: 'Цель продукта', s: 'обязательство бэклога продукта', of: 'pb',
        one: 'Куда движется продукт; ради неё упорядочен бэклог. Одна цель за раз.',
        kolos: 'Предзаказ и торты работают во всех 9 пекарнях к 1 марта 2027 (пилот в двух — 1 февраля).',
        an: 'Помогает связать каждую историю с целью: если связи нет — повод спросить Нину, зачем это сейчас.' },
      { id: 'sg', t: 'Цель спринта', s: 'обязательство бэклога спринта', of: 'sb',
        one: 'Одна фраза: зачем этот спринт. Её формулирует вся команда на планировании.',
        kolos: 'Спринт 2: «Покупатель выбирает пекарню и получасовой интервал и оформляет предзаказ на завтра до 22:30».',
        an: 'Помогает сформулировать цель как результат для человека, а не как список задач.',
        confuse: 'Цель держат, а состав работ можно уточнять: так у команды есть гибкость.' },
      { id: 'dod', t: 'Definition of Done', s: 'обязательство инкремента', of: 'inc',
        one: 'Общее определение «готово»: каким требованиям качества должна соответствовать работа, чтобы стать инкрементом.',
        kolos: 'Например: код проверен коллегой, автотесты зелёные, критерии приёмки выполнены, Лера проверила на стенде, Нина видит на обзоре.',
        an: 'Критерии приёмки — у каждой истории свои, Definition of Done — общий для всех историй. Аналитик следит, чтобы их не путали.',
        confuse: 'Это обязательство из Scrum Guide, а не пожелание отдельной команды.' }
    ],
    prs: [
      { id: 'refine', t: 'Уточнение бэклога', s: 'refinement, «груминг»',
        one: 'Разбить, уточнить, оценить истории заранее. В Scrum Guide это постоянная деятельность, а не событие: когда и как — команда решает сама.',
        kolos: 'Команда «Колоса» договорилась собираться на час раз в спринт, а между встречами уточнять по ходу.',
        an: 'Главная работа аналитика в Scrum: правила, примеры, макеты, вопросы — до планирования.',
        confuse: 'В редакциях 2013–2017 был ориентир «обычно не больше 10 % времени разработчиков»; в 2020 его убрали.' },
      { id: 'dor', t: 'Definition of Ready', s: 'практика команд',
        one: 'Чек-лист «история готова к спринту»: понятна, есть критерии приёмки, макет (если нужен), зависимости известны, оценена командой.',
        kolos: 'Дима просит: «В спринт — только готовые по DoR».',
        an: 'Доводит истории до готовности на спринт-два вперёд.',
        confuse: 'В Scrum Guide его нет. Критики предупреждают: жёсткий DoR превращает Scrum в мини-каскад — «не возьмём, пока не будет идеально».' },
      { id: 'poker', t: 'Planning poker и сторипоинты', s: 'практика оценки',
        one: 'Способ оценки: все одновременно показывают карту с размером истории, расхождение обсуждают.',
        kolos: 'Команда Димы оценивает истории в сторипоинтах на уточнении бэклога.',
        an: 'Приносит правила и крайние случаи — от них зависит размер.',
        confuse: 'Scrum Guide говорит только, что размер оценивают разработчики. Как — не говорит. Покер придумал Джеймс Греннинг (2002), прославил Майк Кон.' },
      { id: 'dual', t: 'Работа на спринт вперёд', s: 'dual-track',
        one: 'Аналитик и дизайнер готовят истории следующего спринта, пока команда делает текущий.',
        kolos: 'Вы и Ксения готовите спринт 3, пока команда делает спринт 2.',
        an: 'Так у планирования всегда есть готовые истории.',
        confuse: 'Практика (Дезире Сай, 2007; позже Джефф Паттон и Марти Каган), а не правило Scrum. Риск — конвейер «аналитик → разработка»; лекарство — уточнять вместе с командой.' }
    ]
  };
  const FR_ALL = [].concat(FR.roles, FR.events, FR.arts, FR.cms, FR.prs);
  const FR_CORE = FR_ALL.filter(x => !FR.prs.includes(x));
  const howFrame = {
    id: 'how-frame', covers: ['frame'], title: 'Как это работает: каркас Scrum — кто, когда, что', free: true, noReset: true,
    simple: {
      icon: '🧺',
      plain: 'Scrum — короткий свод правил: кто решает, что важнее, кто делает и кто следит за правилами; какие встречи и когда; что лежит у всех на виду и к какой цели это ведёт.',
      analogy: 'Двухнедельное меню пекарни. Хозяйка решает, что печь в первую очередь, пекари сами решают как, старший смены следит, чтобы пятиминутка не превращалась в собрание на час. В начале выбрали меню, каждый день — пятиминутка у печи, в конце — дегустация и разбор.',
      tech: '<b>Scrum Guide 2020</b> (Кен Швабер, Джефф Сазерленд): <b>3 зоны ответственности</b> — владелец продукта, Scrum-мастер, разработчики; <b>5 событий</b> — спринт (контейнер), планирование спринта, ежедневный Scrum, обзор спринта, ретроспектива; <b>3 артефакта</b> и у каждого <b>обязательство</b>: бэклог продукта → цель продукта, бэклог спринта → цель спринта, инкремент → Definition of Done. Уточнение бэклога — деятельность, а не событие. Всё остальное — практики команд.'
    },
    lead: ui.brief({
      situation: 'Карта Scrum-каркаса в трёх колонках: кто, когда, что на столе. У каждого элемента — карточка: смысл одной фразой, сколько длится, как это выглядит в пекарне и в «Колосе», где аналитик, что путают и что будет, если элемент убрать.',
      todo: [
        'Нажимайте элементы по очереди и читайте карточку. Откройте все 14 элементов Scrum Guide — счётчик над картой.',
        'Нажмите на артефакт и посмотрите, какое обязательство подсветится фиолетовым.',
        'Переключите «+ практики команд» и сравните: что из привычных слов в Scrum Guide есть, а чего нет.'
      ],
      look: 'Фиолетовая стрелка ↳ — обязательство артефакта: то, к чему он ведёт. Пунктирные элементы внизу — практики команд вокруг Scrum: полезные, но не из Scrum Guide (кроме уточнения бэклога — оно в Guide есть, но как деятельность, а не событие). Строка «Где аналитик» выделена цветом.'
    }),
    render(el, ctx) {
      el.classList.add('scr-root');
      const seen = new Set(Array.isArray(ctx.ans.seen) ? ctx.ans.seen : []);
      let cur = ctx.ans.cur || 'po', mode = ctx.ans.mode || 'guide';
      seen.add(cur);
      el.innerHTML = `<div class="stack">
        <div class="row between"><div class="row">${ui.seg('fm', [{ v: 'guide', t: 'Только Scrum Guide' }, { v: 'all', t: '+ практики команд' }], mode, 'accent')}</div><span class="small dim" data-fc></span></div>
        <div class="scr-map" data-map></div>
        <div data-det></div>
      </div>`;
      const btn = (x, cls) => `<button type="button" class="scr-el ${cls || ''}" data-fe="${x.id}"><b>${x.t}</b><span class="s">${x.s}</span></button>`;
      function drawMap() {
        const it = FR_ALL.find(x => x.id === cur) || FR.roles[0];
        const pair = it.cm || it.of || null;
        const cls = x => [x.id === cur ? 'on' : '', x.id === pair ? 'lit' : '', seen.has(x.id) ? 'seen' : ''].join(' ');
        TR.$('[data-map]', el).innerHTML = `
          <div class="scr-col"><div class="h">Кто · 3 зоны ответственности</div>${FR.roles.map(x => btn(x, cls(x))).join('')}</div>
          <div class="scr-col"><div class="h">Когда · 5 событий</div>${FR.events.map(x => btn(x, cls(x))).join('')}</div>
          <div class="scr-col"><div class="h">Что на столе · 3 артефакта</div>${FR.arts.map(a => btn(a, cls(a)) + btn(FR.cms.find(c => c.id === a.cm), 'cm ' + cls(FR.cms.find(c => c.id === a.cm)))).join('')}</div>
          ${mode === 'all' ? `<div class="scr-col pr"><div class="h">Вокруг Scrum · практики команд</div><div class="items">${FR.prs.map(x => btn(x, 'prx ' + cls(x))).join('')}</div></div>` : ''}`;
        const n = FR_CORE.filter(x => seen.has(x.id)).length;
        TR.$('[data-fc]', el).innerHTML = `Открыто: <b>${n}</b> из ${FR_CORE.length}${mode === 'all' ? ` · практик: ${FR.prs.filter(x => seen.has(x.id)).length} из ${FR.prs.length}` : ''}`;
      }
      function drawDet() {
        const it = FR_ALL.find(x => x.id === cur) || FR.roles[0];
        const isPr = FR.prs.includes(it);
        const rows = FR_ROWS.filter(([k]) => it[k]).map(([k, t]) => `<div class="k ${k === 'an' ? 'an' : ''}">${t}</div><div class="v">${it[k]}</div>`).join('');
        const pairTxt = it.cm ? ui.note('', 'Обязательство', `${esc(FR.cms.find(c => c.id === it.cm).t)} — ${FR.cms.find(c => c.id === it.cm).one}`) : '';
        TR.$('[data-det]', el).innerHTML = `<div class="stack tight"><div class="row"><b style="font-size:16px">${it.t}</b><span class="small dim">${it.s}</span>${isPr ? chip(it.id === 'refine' ? 'есть в Guide, но не событие' : 'не из Scrum Guide', 'warn') : chip('Scrum Guide 2020', 'ok')}</div><div class="scr-kv">${rows}</div>${pairTxt}</div>`;
      }
      const save = () => { ctx.ans.seen = Array.from(seen); ctx.ans.cur = cur; ctx.ans.mode = mode; ctx.save(); };
      TR.on(el, 'click', '[data-fe]', (e, b) => { cur = b.dataset.fe; seen.add(cur); drawMap(); drawDet(); save(); if (FR_CORE.every(x => seen.has(x.id))) ctx.ready && ctx.ready(); });
      ui.onSeg(el, (n, v) => { if (n === 'fm') { mode = v; if (mode === 'guide' && FR.prs.some(x => x.id === cur)) cur = 'po'; drawMap(); drawDet(); save(); } });
      drawMap(); drawDet();
      el.insertAdjacentHTML('beforeend', anNote('В Scrum Guide нет слова «аналитик» — и это не значит, что аналитик не нужен. Он один из разработчиков: делает свою часть инкремента — требования, правила, критерии, — участвует в планировании, обзоре и ретроспективе и больше всех работает в уточнении бэклога. Нужен ли отдельный аналитик в Scrum-команде — честно спорный вопрос: одни команды обходятся без него, другие, как «Квант Софт», держат.'));
    }
  };

  // =====================================================================
  // Теория 2. Спринт «Колоса» по дням: аналитик на спринт вперёд или в том же спринте
  // =====================================================================
  const SD = [
    { n: 1, d: 'Пн', tag: '📋 Планирование', sh: '📋 План',
      ahead: { k: 'ok', ev: 'Планирование спринта 2 — до 4 часов.', team: 'Выбирают истории под свою скорость, вместе с Ниной формулируют цель спринта, раскладывают истории на задачи.', an: 'Рассказывает истории, отвечает на вопросы, открытые записывает с ответственным и сроком. Истории пришли готовыми — их уточняли ещё в прошлом спринте.', who: 'Нина (первые полчаса: порядок и цель), Дима, разработчики, Лера', art: 'Бэклог спринта и цель: «Покупатель выбирает пекарню и получасовой интервал и оформляет предзаказ на завтра до 22:30».' },
      same: { k: 'bad', ev: 'Планирование растянулось на 6 часов.', team: 'Дима: «Критериев нет — оценить не можем». Истории берут «под честное слово».', an: 'Дописывает критерии прямо на встрече, пока все ждут.', who: 'вся команда ждёт одного человека', art: 'Размытая цель: «поработать над предзаказом».' } },
    { n: 2, d: 'Вт', tag: '☕ 15 минут',
      ahead: { k: 'ok', ev: 'Ежедневный Scrum, 15 минут.', team: 'Делают выбор интервала. Вопрос: «Интервалы — с 07:00 или с 07:30?»', an: 'Отвечает в течение часа по блокноту: интервалы с 07:00, а круассаны раньше 07:30 не обещаем. Потом — к Павлу с первыми вопросами по историям спринта 3.', who: 'Дима; Павел по телефону', art: 'Ответ в задаче и заметки к историям спринта 3.' },
      same: { k: 'bad', ev: 'Ежедневный Scrum.', team: 'Начинают «как поняли»: критерии ещё пишутся.', an: 'Пишет критерии к историям, которые уже в работе.', who: 'ни с кем — некогда', art: 'Критерии, которые прочитают после того, как код уже написан.' } },
    { n: 3, d: 'Ср', tag: '☕ + три амиго', sh: '☕ +3 амиго',
      ahead: { k: 'ok', ev: 'Ежедневный Scrum; после — 30 минут трёх амиго.', team: 'Разработка идёт.', an: 'Три амиго по истории «Выдача по короткому коду» из спринта 3: аналитик, Дима, Лера. Красные карточки — вопросы Павлу.', who: 'Дима и Лера', art: 'Правила, примеры и три вопроса к истории спринта 3.' },
      same: { k: 'bad', ev: 'Ежедневный Scrum.', team: 'Двое ждут ответа Павла про первый интервал.', an: 'Отправил Павлу письмо с вопросами, ответа пока нет.', who: 'письмо Павлу', art: 'Ожидание: два разработчика по полдня.' } },
    { n: 4, d: 'Чт', tag: '☕ 15 минут',
      ahead: { k: 'ok', ev: 'Ежедневный Scrum.', team: 'Первая история почти готова, Лера пишет проверки.', an: 'Павел ответил — критерии истории спринта 3 дописаны. Соня рисует экран выдачи для кассира с крупными кнопками: руки в муке и перчатках.', who: 'Павел и Соня', art: 'Критерии и макет экрана выдачи.' },
      same: { k: 'bad', ev: 'Ежедневный Scrum.', team: 'Павел ответил — правило оказалось другим, кусок кода переписывают.', an: 'Меняет критерии истории, которая уже в работе.', who: 'Павел', art: 'Переделка — около 6 часов.' } },
    { n: 5, d: 'Пт', tag: '☕ 15 минут',
      ahead: { k: 'ok', ev: 'Ежедневный Scrum.', team: 'Первая история готова.', an: 'Вместе с Лерой сверяет готовую историю с критериями — до обзора, а не на нём.', who: 'Лера', art: 'История «Выбор интервала» готова по Definition of Done.' },
      same: { k: 'warn', ev: 'Ежедневный Scrum.', team: 'Лера: «По какой версии критериев проверять?»', an: 'Объясняет, какая версия свежая.', who: 'Лера', art: 'Две версии критериев в двух местах.' } },
    { n: 6, d: 'Пн', tag: '☕ 15 минут',
      ahead: { k: 'ok', ev: 'Ежедневный Scrum.', team: 'Вопрос: «Заказ, оформленный ровно в 22:30, — принимаем?»', an: 'Это решение владельца продукта, а не разработчика: звонок Нине на 5 минут, ответ — в критерии и журнал решений.', who: 'Нина Сергеевна', art: 'Решение по границе 22:30 записано.' },
      same: { k: 'bad', ev: 'Ежедневный Scrum.', team: 'Тот же вопрос про 22:30 — разработчик решает сам.', an: 'Всё ещё дописывает текущие истории. До спринта 3 руки не дошли.', who: '—', art: 'Решение «на глаз», без владельца продукта.' } },
    { n: 7, d: 'Вт', tag: '🔍 Уточнение', sh: '🔍 Уточн.',
      ahead: { k: 'ok', ev: 'Уточнение бэклога — час всей командой. Не событие Scrum, а договорённость команды.', team: 'Оценивают истории спринта 3 покером, самую большую режут на две.', an: 'Ведёт разговор по историям: правила, примеры, макеты; записывает новые вопросы.', who: 'Дима, разработчики, Лера, Соня', art: 'Оценённые и разрезанные истории спринта 3.' },
      same: { k: 'bad', ev: 'Уточнения нет: «некогда, горит спринт».', team: 'Доделывают текущее.', an: 'Доделывает критерии текущего спринта.', who: '—', art: 'Истории спринта 3 никто не видел.' } },
    { n: 8, d: 'Ср', tag: '☕ 15 минут',
      ahead: { k: 'ok', ev: 'Ежедневный Scrum.', team: 'Последние истории спринта 2.', an: 'Сверяет истории спринта 3 с Definition of Ready: 5 из 6 готовы, по шестой ждёт ответа Галины Ивановны. Готовит сценарий обзора.', who: 'Галина Ивановна', art: 'Список готовых историй и сценарий показа.' },
      same: { k: 'bad', ev: 'Ежедневный Scrum.', team: 'Ясно, что всё не успеть: «сделаем часть».', an: 'Помогает тестировать то, что успели.', who: 'Лера', art: 'Цель спринта под угрозой.' } },
    { n: 9, d: 'Чт', tag: '☕ 15 минут',
      ahead: { k: 'ok', ev: 'Ежедневный Scrum.', team: 'Доделывают, Лера проверяет по Definition of Done.', an: 'Подтверждает с Ниной время обзора и собирает вопросы, которые надо на нём решить.', who: 'Нина Сергеевна', art: 'Повестка обзора.' },
      same: { k: 'warn', ev: 'Ежедневный Scrum.', team: 'Спешка, проверки урезают.', an: 'Вспоминает, что Нину на обзор никто не позвал.', who: '—', art: 'Риск: на обзоре не будет того, кто решает.' } },
    { n: 10, d: 'Пт', tag: '🎂 Обзор · 🔁 Ретро', sh: '🎂 🔁 Обзор, ретро',
      ahead: { k: 'ok', ev: 'Обзор спринта (до 2 часов) и ретроспектива (до 1,5 часа).', team: 'Показывают работающее на планшете; на ретроспективе выбирают одно улучшение.', an: 'Ведёт сценарий показа: Нина сама выбирает интервал и оформляет заказ. Отзывы и решения — в бэклог. В понедельник планирование спринта 3 — истории готовы.', who: 'Нина, Павел, Галина Ивановна; на ретроспективе — только команда', art: 'Обновлённый бэклог и одно улучшение процесса.' },
      same: { k: 'bad', ev: 'Обзор и ретроспектива.', team: 'Показали половину. Нина: «А где выбор интервала?»', an: 'Записывает претензии. В понедельник планирование спринта 3 — готовых историй нет, всё повторится.', who: 'Нина', art: 'Ни одной истории, готовой к следующему спринту.' } }
  ];
  const SD_LANES = [['ev', 'Событие'], ['team', 'Команда'], ['an', 'Аналитик'], ['who', 'С кем говорит'], ['art', 'Что получается']];
  const SD_SUM = {
    ahead: [['Готово к планированию спринта 3', '5 из 6', 'ok'], ['Разработчики ждали ответов', '≈ 2 ч', 'ok'], ['Цель спринта 2', 'достигнута', 'ok'], ['На обзоре', 'решения Нины', 'ok']],
    same: [['Готово к планированию спринта 3', '0 из 6', 'bad'], ['Разработчики ждали ответов', '≈ 14 ч', 'bad'], ['Цель спринта 2', 'не достигнута', 'bad'], ['На обзоре', 'претензии', 'bad']]
  };
  const howSprint = {
    id: 'how-sprint', covers: ['sprint-lab', 'analyst'], title: 'Как это работает: спринт «Колоса» по дням', free: true, noReset: true,
    simple: {
      icon: '📅',
      plain: 'Две недели спринта — это не «все программируют». Каждый день у аналитика две работы: отвечать команде на вопросы по текущим историям и готовить истории следующего спринта, чтобы на планировании было что брать.',
      analogy: 'Технолог в цехе. Сегодня печём по готовым техкартам и он отвечает пекарям «сколько соли?» сразу, а не через три дня. Параллельно он дописывает техкарты к новому меню через две недели — иначе в понедельник печь будет нечего.',
      tech: 'Scrum Guide говорит, что уточнение бэклога — постоянная деятельность команды. Работа аналитика и дизайнера «на спринт-два вперёд» называется <b>dual-track</b> (Дезире Сай, 2007; Джефф Паттон, Марти Каган) — это практика, а не правило Scrum. Таймбоксы для двухнедельного спринта выведены из Scrum Guide (там даны пределы для месячного: планирование до 8 ч, обзор до 4 ч, ретроспектива до 3 ч; для короткого спринта обычно меньше).'
    },
    lead: ui.brief({
      situation: 'Спринт 2 «Колоса» — 10 рабочих дней. Календарь можно смотреть в двух вариантах: как прошёл спринт, когда аналитик готовил истории заранее, и как он мог пройти, если аналитик работает в том же спринте, что и команда.',
      todo: [
        'Нажимайте дни по очереди (или «День →») и читайте дорожки: событие, команда, аналитик, с кем говорит, что получается.',
        'Переключите «Аналитик в том же спринте» и пройдите те же дни. Где начинает ломаться?',
        'Сравните итоги внизу: сколько историй готово к следующему планированию и сколько разработчики ждали ответов.'
      ],
      look: 'Полоска слева у дня: зелёная — всё идёт, жёлтая — трение, красная — поломка. Дорожка «Аналитик» выделена цветом. Уточнение бэклога во вторник второй недели — не событие Scrum, а договорённость команды «Колоса». Цифры часов — учебные, механизм — настоящий.'
    }),
    render(el, ctx) {
      el.classList.add('scr-root');
      let mode = ctx.ans.mode || 'ahead', day = ctx.ans.day || 1;
      const seen = new Set(Array.isArray(ctx.ans.seen) ? ctx.ans.seen : []);
      el.innerHTML = `<div class="stack">
        <div class="row">${ui.seg('sm', [{ v: 'ahead', t: 'Аналитик на спринт вперёд' }, { v: 'same', t: 'Аналитик в том же спринте' }], mode, 'accent')}</div>
        <div class="scr-cal" data-cal></div>
        <div class="row between"><button type="button" class="btn sm ghost" data-dn="-1">← День</button><span class="small dim" data-dc></span><button type="button" class="btn sm" data-dn="1">День →</button></div>
        <div class="stack tight" data-lanes></div>
        <div class="eyebrow">Итог спринта в этом варианте</div>
        <div class="scr-stats" data-sum></div>
        <div data-sn></div>
      </div>`;
      function draw() {
        seen.add(mode + day);
        TR.$('[data-cal]', el).innerHTML = '<div class="scr-wk">Неделя 1</div>' + SD.map(s => `${s.n === 6 ? '<div class="scr-wk">Неделя 2</div>' : ''}<button type="button" class="scr-day ${s[mode].k} ${s.n === day ? 'on' : ''}" data-day="${s.n}" aria-pressed="${s.n === day}"><span class="dn">${s.d} · ${s.n}</span><span class="ev full">${s.tag}</span><span class="ev short">${s.sh || s.tag.replace('15 минут', '15 мин')}</span></button>`).join('');
        const s = SD[day - 1], v = s[mode];
        TR.$('[data-dc]', el).textContent = `День ${day} из 10 · ${s.d}`;
        TR.$('[data-lanes]', el).innerHTML = SD_LANES.map(([k, t]) => `<div class="scr-lane ${k === 'an' ? 'an' : ''}"><span class="k">${t}</span><span>${v[k]}</span></div>`).join('');
        TR.$('[data-sum]', el).innerHTML = SD_SUM[mode].map(([k, val, c]) => `<div class="stat"><span class="k">${k}</span><span class="v ${c}">${val}</span></div>`).join('');
        TR.$('[data-sn]', el).innerHTML = mode === 'ahead'
          ? ui.note('ok', 'Почему работает', 'Истории к планированию готовы заранее, вопросы закрываются в тот же день, на обзоре — тот, кто решает. Аналитик всё время в двух спринтах: отвечает по текущему и готовит следующий.')
          : ui.note('bad', 'Как ломается', 'Аналитик всё время догоняет текущий спринт: разработчики ждут, критерии меняются под готовый код, следующий спринт никто не готовит — и в понедельник всё повторяется. Это не лень, а ловушка: без опережения из неё не выбраться.');
      }
      const save = () => { ctx.ans.mode = mode; ctx.ans.day = day; ctx.ans.seen = Array.from(seen); ctx.save(); };
      TR.on(el, 'click', '[data-day]', (e, b) => { day = +b.dataset.day; draw(); save(); });
      TR.on(el, 'click', '[data-dn]', (e, b) => { day = Math.max(1, Math.min(10, day + (+b.dataset.dn))); draw(); save(); });
      ui.onSeg(el, (n, v) => { if (n === 'sm') { mode = v; draw(); save(); } });
      draw();
      el.insertAdjacentHTML('beforeend', `<div style="margin-top:12px">${ui.note('warn', 'Честно о работе «на спринт вперёд»', 'Это практика, а не правило Scrum, и у неё есть критики. Если аналитик уходит вперёд один и «спускает» готовые истории, команда превращается в конвейер: разработчики не участвуют в разговоре, а Scrum — в мини-каскад. Лекарство — уточнять вместе: три амиго, час уточнения всей командой, вопросы разработчиков до планирования. И не уходить слишком далеко: на 1–2 спринта, а не на квартал — иначе после первого же обзора половину придётся переписывать.')}</div>` + anNote('Каждый день спринта у аналитика: ответить команде в тот же день; поговорить с теми, кто знает правила (Павел, Галина Ивановна, Нина); довести истории следующего спринта до готовности; подготовить обзор так, чтобы на нём был владелец продукта и решения записались в бэклог.'));
    }
  };

  // =====================================================================
  // Теория 3. Оценка: planning poker, сторипоинты, споры, скорость и прогноз
  // =====================================================================
  const DECK = ['1', '2', '3', '5', '8', '13', '20', '?', '☕'];
  const SEATS = [{ id: 'dima', t: 'Дима, тимлид' }, { id: 'be', t: 'Бэкенд-разработчик' }, { id: 'mob', t: 'Мобильный разработчик' }, { id: 'lera', t: 'Лера, тестировщица' }, { id: 'me', t: 'Вы' }];
  const PK = [
    { id: 'r1', story: 'Как покупатель, я хочу сам отменить предзаказ в приложении, чтобы не платить за то, что не заберу.',
      votes: { dima: '3', be: '3', mob: '5', lera: '13' }, hi: 'lera', lo: 'dima',
      talk: [
        ['ksenia', 'Разброс от 3 до 13. Не усредняем — пусть объяснят крайние: Лера и Дима.'],
        ['lera', 'Отмена после оплаты — это возврат на ту же карту в течение 3 рабочих дней, а для кассы нужен чек возврата. И граница: отменили за 1 час 59 минут до интервала — деньги не возвращаем, покупателю надо это показать.'],
        ['dima', 'А я оценивал кнопку «Отменить» для неоплаченного заказа. Про возврат денег и чек не подумал.'],
        ['$mob', 'Ещё экран подтверждения: «Точно отменить? Деньги вернутся за 3 рабочих дня».'],
        ['ksenia', 'Правила отмены у нас в блокноте есть, а в карточку истории их не перенесли — поэтому оценки и разъехались. Это наша работа: правила — в критерии до оценки.']
      ],
      opts: [
        { v: 'avg', t: 'Взять среднее — примерно 6 — и идти дальше', k: 'bad', out: 'Среднее прячет разногласие: половина команды думает о кнопке, половина — о возврате денег. Через неделю выяснится, что история вдвое больше.' },
        { v: 'lead', t: 'Принять 3 — Дима тимлид, ему виднее', k: 'bad', out: 'Оценка общая, а не начальника. Лучше всех в этом вопросе разобралась Лера — она вспомнила про возврат и чек.' },
        { v: 'split', t: 'Записать правила отмены в критерии, разрезать на две истории и переоценить', k: 'ok', out: 'Отмена неоплаченного заказа — переголосовали: 3, 3, 3, 3, 3. Отмена оплаченного с возвратом и чеком — 8, 8, 8, 13, 8. Оценки сошлись, потому что все теперь говорят об одном и том же. Восьмёрка — повод подумать, не разрезать ли ещё.' },
        { v: 'max', t: 'Взять 13 — перестрахуемся', k: 'warn', out: 'Перестраховка раздувает план и прячет ту же проблему: неясно, что входит в историю.' }
      ] },
    { id: 'r2', story: 'Как технолог, я хочу, чтобы предзаказы на завтра сами попадали в план выпечки в 23:00, чтобы не переписывать их вручную.',
      votes: { dima: '?', be: '13', mob: '1', lera: '8' }, hi: 'be', lo: 'mob',
      talk: [
        ['dima', '«?» — я не знаю, где сейчас живёт план выпечки. Это Excel у Галины Ивановны? Его надо будет читать или заменить?'],
        ['$be', 'Если план — это Excel, нужна загрузка файла и сверка. Это много.'],
        ['$mob', 'В приложении покупателя тут ничего не меняется, поэтому у меня 1.'],
        ['lera', 'Проверять придётся на настоящем плане цеха: 23:00, правки по погоде, вторая партия.'],
        ['ksenia', 'Знак вопроса — честный ответ: не хватает знаний. Это не провал оценки, а сигнал. И оценивают историю целиком, а не работу одного человека.']
      ],
      opts: [
        { v: 'force', t: 'Попросить Диму всё-таки назвать число', k: 'bad', out: 'Число без знаний — угадайка. А потом её примут за обещание.' },
        { v: 'spike', t: 'Сначала выяснить: аналитик — к Галине Ивановне смотреть, как считают план; разработчики — короткое исследование на день. Потом переоценить', k: 'ok', out: 'Короткое исследование с ограничением по времени (spike) превращает «?» в знание. Аналитик приносит, как план устроен сейчас: в 23:00, «на глаз», в Excel, с правкой по погоде. После этого оценки сойдутся.' },
        { v: 'mob', t: 'Взять 1 — мобильному разработчику работы почти нет', k: 'bad', out: 'Оценивают историю целиком. То, что одному работы мало, не делает историю маленькой.' },
        { v: 'drop', t: 'Убрать историю из бэклога — слишком сложно', k: 'bad', out: 'Предзаказы в плане выпечки — обязательная часть первой версии. Сложность — повод выяснить, а не выбросить.' }
      ] }
  ];
  const DEB = {
    sp: { t: 'Сторипоинты', what: 'Относительный размер: «эта история примерно вдвое больше той». В пункты входят объём, сложность и неясность. Карты — ряд, похожий на Фибоначчи: 1, 2, 3, 5, 8, 13, 20.',
      plus: ['Сравнивать проще, чем угадывать часы.', 'Не зависит от того, кто будет делать — быстрый или медленный разработчик.', 'Через несколько спринтов видна скорость команды — по ней прогнозируют.'],
      minus: ['Заказчик не понимает, что такое «пункт», и пересчитывает в часы сам.', 'Пункты легко превратить в норму: «поднимите скорость» — и истории дорожают.', 'Скорости разных команд несравнимы, а их всё равно сравнивают.'],
      who: 'Многие Scrum-команды. Рон Джеффрис, которого считают автором сторипоинтов, позже писал, что сожалеет, во что их превратили, — если он их и придумал.' },
    h: { t: 'Часы', what: 'Сколько часов работы займёт задача. Понятно всем, в том числе заказчику и бухгалтерии.',
      plus: ['Понятно без перевода: заказчику, руководителю, договору с оплатой по факту работы.', 'Удобно для маленьких задач внутри спринта.'],
      minus: ['Люди плохо угадывают абсолютное время, особенно у новой работы.', 'Оценка превращается в обещание, и за «перерасход» ругают.', 'Часы одного разработчика — не часы другого.'],
      who: 'Команды на договорах «по факту работы», сопровождение, внутренние задачи. Многие оценивают истории в пунктах, а задачи внутри спринта — в часах.' },
    no: { t: '#NoEstimates', what: 'Не оценивать каждую историю, а резать работу на маленькие куски примерно одного размера и считать штуки: сколько закрываем за неделю.',
      plus: ['Не тратится время на споры о числах.', 'Прогноз строится по фактам — сколько штук реально закрываем.', 'Подталкивает резать истории мельче, а это полезно само по себе.'],
      minus: ['Работает, только если команда умеет резать истории на похожие по размеру.', 'Заказчику всё равно нужен ответ «когда»: его дают по статистике, а не «на глаз».', 'Название пугает руководителей: кажется, что «планировать не будем».'],
      who: 'Движение Вуди Зуилла и Васко Дуарте (с 2012 года). Это не «не планировать», а планировать по статистике потока — близко к Kanban.' }
  };
  function drawPoker(pane, ctx) {
    const st = ctx.ans.pk = ctx.ans.pk || {};
    let r = ctx.ans.pkr || 'r1';
    pane.innerHTML = `<div class="stack">
      <div class="row">${ui.seg('pkr', PK.map((x, i) => ({ v: x.id, t: 'История ' + (i + 1) })), r, 'accent')}</div>
      <div data-pk></div></div>`;
    function draw() {
      const R = PK.find(x => x.id === r), s = st[r] = st[r] || { my: '', ph: 0, dec: '' };
      const up = s.ph >= 1;
      const card = (id) => { const v = id === 'me' ? (s.my || '·') : R.votes[id]; const c = !up ? '' : id === R.hi ? 'up hi' : id === R.lo ? 'up lo' : 'up'; return `<span class="c ${c}">${up ? esc(v) : '?'}</span>`; };
      let h = `<div class="stack"><div class="scr-story"><span class="lbl">История на оценке</span>${esc(R.story)}</div>
        <div class="small muted">Эталон команды — 3 пункта: «Как кассир, я хочу найти предзаказ по короткому коду, чтобы выдать его без ошибок». Сравнивайте с ним: больше, меньше, во сколько раз?</div>
        <div><span class="scr-lbl">Ваша карта</span><div class="scr-deck">${DECK.map(c => `<button type="button" class="scr-pc" data-pc="${esc(c)}" aria-pressed="${s.my === c}" ${up ? 'disabled' : ''}>${esc(c)}</button>`).join('')}</div></div>
        <div class="scr-tbl">${SEATS.map(x => `<div class="scr-seat">${card(x.id)}<span class="nm">${x.t}</span></div>`).join('')}</div>`;
      if (!up) h += `<div class="row"><button type="button" class="btn primary sm" data-pkv ${s.my ? '' : 'disabled'}>Вскрыть карты</button><span class="small dim">${s.my ? 'Все показывают одновременно — чтобы никто не подстраивался под тимлида.' : 'Сначала выберите свою карту.'}</span></div>`;
      else {
        h += `<div class="stack tight">${R.talk.map(([who, t]) => who[0] === '$' ? sayAs(who === '$mob' ? 'Мобильный разработчик' : 'Бэкенд-разработчик', who === '$mob' ? 'М' : 'Б', esc(t)) : ui.say(who, esc(t))).join('')}</div>
          <div class="eyebrow">Что делаем с расхождением?</div>
          <div class="scr-opts">${R.opts.map(o => `<button type="button" class="scr-opt ${s.dec === o.v ? o.k : ''}" data-pd="${o.v}" aria-pressed="${s.dec === o.v}"><span class="mk"></span><span>${esc(o.t)}</span></button>`).join('')}</div>`;
        const o = R.opts.find(x => x.v === s.dec);
        if (o) h += ui.note(o.k, o.k === 'ok' ? 'Так и делают' : o.k === 'warn' ? 'Можно, но…' : 'Так не стоит', o.out);
        h += `<div><button type="button" class="btn xs ghost" data-pkre>⟲ Сыграть раунд заново</button></div>`;
      }
      TR.$('[data-pk]', pane).innerHTML = h + '</div>';
    }
    const save = () => { ctx.ans.pkr = r; ctx.save(); };
    TR.on(pane, 'click', '[data-pc]', (e, b) => { const s = st[r]; if (s.ph) return; s.my = b.dataset.pc; draw(); save(); });
    TR.on(pane, 'click', '[data-pkv]', () => { st[r].ph = 1; draw(); save(); });
    TR.on(pane, 'click', '[data-pd]', (e, b) => { st[r].dec = b.dataset.pd; draw(); save(); });
    TR.on(pane, 'click', '[data-pkre]', () => { st[r] = { my: '', ph: 0, dec: '' }; draw(); save(); });
    ui.onSeg(pane, (n, v) => { if (n === 'pkr') { r = v; draw(); save(); } });
    draw();
  }
  function drawDebate(pane) {
    let cur = 'sp';
    pane.innerHTML = `<div class="stack"><div class="row">${ui.seg('deb', Object.keys(DEB).map(k => ({ v: k, t: DEB[k].t })), cur, 'accent')}</div><div data-db></div>
      ${ui.note('warn', 'Честно: единого ответа нет', 'Scrum Guide не требует ни пунктов, ни часов, ни покера — только чтобы размер оценивали те, кто будет делать работу. Команды делают по-разному, и опытные практики спорят до сих пор. Аналитику важно не выдавать привычку своей команды за единственную правду.')}
      ${ui.note('info', 'Как в «Колосе»', 'Команда Димы оценивает истории в сторипоинтах, чтобы планировать спринт по своей скорости. Договор на разработку — оплата по факту работы, поэтому часы всё равно считают — для счёта. Нине прогноз дают не обещанием даты, а диапазоном: «при нашей скорости — от N до M спринтов».')}</div>`;
    function draw() {
      const d = DEB[cur];
      TR.$('[data-db]', pane).innerHTML = `<div class="scr-box"><div><span class="scr-lbl">Что это</span>${d.what}</div>
        <div class="scr-pros"><div class="note ok"><div class="ttl">Плюсы</div><ul>${d.plus.map(x => `<li>${x}</li>`).join('')}</ul></div><div class="note bad"><div class="ttl">Минусы</div><ul>${d.minus.map(x => `<li>${x}</li>`).join('')}</ul></div></div>
        <div class="small muted"><b>Кто так делает.</b> ${d.who}</div></div>`;
    }
    ui.onSeg(pane, (n, v) => { if (n === 'deb') { cur = v; draw(); } });
    draw();
  }
  function drawForecast(pane) {
    const v = [18, 26, 22]; let push = false; const LEFT = 120;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Соседний пример — приложение сети кофеен. В бэклоге осталось ${LEFT} пунктов. Скорость — сколько пунктов команда закрыла в каждом из трёх последних спринтов. Двигайте ползунки и смотрите прогноз.</p>
      <div class="scr-box"><div class="scr-set">${v.map((x, i) => `<span class="lbl">Спринт ${i + 1}: скорость</span><input type="range" class="scr-range" min="8" max="40" step="1" value="${x}" data-fv="${i}" aria-label="Скорость спринта ${i + 1}"><span class="val" data-fvv="${i}">${x}</span>`).join('')}</div></div>
      <div data-fo></div>
      <div class="row"><button type="button" class="btn sm" data-fpush aria-pressed="false">Руководитель: «Поднимите скорость на 20 %»</button></div>
      <div data-fp></div></div>`;
    function draw() {
      const k = push ? 1.2 : 1, vv = v.map(x => Math.round(x * k)), mn = Math.min(...vv), mx = Math.max(...vv), av = vv.reduce((s, x) => s + x, 0) / vv.length;
      const left = Math.round(LEFT * k);
      const fast = Math.ceil(left / mx), slow = Math.ceil(left / mn), mid = Math.ceil(left / av);
      const W = Math.max(slow, 12);
      TR.$('[data-fo]', pane).innerHTML = `<div class="scr-bar" aria-hidden="true"><i style="left:${fast / W * 100}%;width:${Math.max(2, (slow - fast) / W * 100)}%;background:var(--accent-soft);box-shadow:inset 0 0 0 1px var(--accent)"></i><span style="left:${fast / W * 100}%">${fast}–${slow}</span></div>
        <div class="row small"><span>Средняя скорость: <b class="tnum">${Math.round(av)}</b> пунктов</span><span>Прогноз: <b>от ${fast} до ${slow} ${TR.plural(slow, 'спринта', 'спринтов', 'спринтов')}</b> (${fast * 2}–${slow * 2} недель), скорее всего около ${mid}</span></div>
        ${ui.note(slow - fast >= 3 ? 'warn' : 'ok', slow - fast >= 3 ? 'Скорость скачет — прогноз широкий' : 'Скорость ровная — прогноз узкий', slow - fast >= 3 ? 'Честный ответ заказчику — диапазон. Сузить его можно, только сделав работу предсказуемее: истории мельче и одинаковее, меньше переключений.' : 'Даже ровная скорость даёт диапазон, а не дату. Прогноз пересчитывают после каждого спринта.')}`;
      TR.$('[data-fp]', pane).innerHTML = push ? ui.note('bad', 'Пункты подорожали', `Скорость «выросла» до ${Math.round(av)} пунктов, но работы делается столько же: те же истории теперь оценивают дороже, и в бэклоге «стало» ${left} пунктов вместо ${LEFT}. Прогноз в спринтах не изменился. Когда мера становится целью, она перестаёт быть хорошей мерой (закон Гудхарта). Скорость — инструмент планирования команды, а не показатель продуктивности.`) : '';
      v.forEach((x, i) => { TR.$(`[data-fvv="${i}"]`, pane).textContent = vv[i]; });
    }
    TR.on(pane, 'input', '[data-fv]', (e, r) => { v[+r.dataset.fv] = +r.value; draw(); });
    TR.on(pane, 'click', '[data-fpush]', (e, b) => { push = !push; b.setAttribute('aria-pressed', String(push)); draw(); });
    draw();
  }
  const howEstimate = {
    id: 'how-estimate', covers: ['goal'], title: 'Как это работает: оценка, planning poker и скорость', free: true, noReset: true,
    simple: {
      icon: '🃏',
      plain: 'Оценка в Scrum — не обещание, а способ поговорить: все одновременно показывают, насколько большой им кажется работа. Если цифры разошлись, кто-то знает то, чего не знают другие. По сумме оценок и скорости прошлых спринтов команда понимает, сколько брать в следующий.',
      analogy: 'Пекари прикидывают новый торт: «Это как наш «Наполеон» — или вдвое сложнее?» Один говорит «как «Наполеон»», другой — «втрое». Оказывается, второй знает, что крем надо выстаивать ночь. Важна не цифра, а то, что это всплыло до выпечки.',
      tech: '<b>Planning poker</b> — Джеймс Греннинг (2002), прославил Майк Кон («Agile Estimating and Planning», 2005): карты с рядом, похожим на Фибоначчи, одновременное вскрытие, обсуждение крайних оценок, переголосование. <b>Сторипоинт</b> — относительная единица размера истории. <b>Скорость</b> (velocity) — сколько пунктов команда закрывает за спринт; её используют для прогноза диапазоном. Scrum Guide 2020 требует лишь, чтобы размер оценивали те, кто делает работу. <b>#NoEstimates</b> — подход без оценки каждой истории, по статистике потока.'
    },
    lead: ui.brief({
      situation: 'Три вкладки. «Раунд покера» — оценка двух историй «Колоса» с командой Димы: вы кладёте свою карту, все вскрываются одновременно, потом обсуждение расхождения и решение, что с ним делать. «Пункты, часы или без оценок» — честный спор. «Скорость и прогноз» — как из скорости прошлых спринтов получается прогноз (соседний пример — приложение кофеен).',
      todo: [
        'Вкладка «Раунд покера»: выберите карту для истории 1 и нажмите «Вскрыть карты». Прочитайте, почему разошлись Лера и Дима, и выберите, что делать с расхождением. Попробуйте разные варианты.',
        'Переключитесь на историю 2 — там Дима кладёт карту «?». Что это значит?',
        'Вкладка «Пункты, часы или без оценок»: сравните три подхода. Вкладка «Скорость и прогноз»: подвигайте скорость и нажмите кнопку руководителя.'
      ],
      look: 'После вскрытия красным обведена самая высокая карта, синим — самая низкая: их владельцы объясняют первыми. Карта «?» — «не знаю, не хватает информации», «☕» — «нужен перерыв». Правильного числа здесь нет: важно, что команда делает с расхождением.'
    }),
    render(el, ctx) {
      el.classList.add('scr-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [{ id: 'pk', t: 'Раунд покера', render: p => drawPoker(p, ctx) }, { id: 'db', t: 'Пункты, часы или без оценок', render: drawDebate }, { id: 'fc', t: 'Скорость и прогноз', render: drawForecast }], 'pk');
      el.insertAdjacentHTML('beforeend', anNote('Аналитик в оценке — тот, кто приносит правила и крайние случаи: отмена за 2 часа, возврат за 3 рабочих дня, чек по 54-ФЗ. Если их нет в критериях, оценки разъезжаются, и вы слышите это на покере. Голосует ли аналитик сам — команды решают по-разному: в Scrum он один из разработчиков, но оценивают те, кто будет делать работу.'));
    }
  };

  // =====================================================================
  // Практика 1. Разложите Scrum по полочкам (с ловушками)
  // =====================================================================
  const FB = [
    { id: 'role', t: 'Зона ответственности', sub: 'кто' },
    { id: 'event', t: 'Событие', sub: 'когда' },
    { id: 'art', t: 'Артефакт', sub: 'что на столе' },
    { id: 'cm', t: 'Обязательство артефакта', sub: 'к чему ведёт' },
    { id: 'pr', t: 'Практика команды', sub: 'полезно, но не из Scrum Guide' },
    { id: 'err', t: 'Так в Scrum нет', sub: 'ошибка' }
  ];
  const HINT = {
    role: 'Это про людей и ответственность или про встречу? Сколько зон ответственности в Scrum Guide 2020?',
    event: 'Это происходит во времени? Вспомните, что спринт — тоже событие.',
    art: 'Это то, что лежит у команды на столе, или цель, к которой оно ведёт?',
    cm: 'Это сам список или результат, к которому список ведёт? У каждого из трёх артефактов — своё обязательство.',
    pr: 'Найдёте ли вы это слово в Scrum Guide 2020? Если нет — откуда оно и вредно ли оно?',
    err: 'Перечитайте утверждение целиком: сколько зон ответственности и событий в Scrum Guide и есть ли внутри разработчиков начальники?'
  };
  const FI = [
    { id: 'f1', t: 'Владелец продукта — Нина Сергеевна', b: 'role' },
    { id: 'f2', t: 'Разработчики: Дима, два разработчика, Лера, Соня, Ксения и вы', b: 'role' },
    { id: 'f3', t: 'Scrum-мастер', b: 'role' },
    { id: 'f4', t: 'Аналитик — отдельная, четвёртая зона ответственности Scrum', b: 'err', crit: true, h: 'Сколько зон ответственности в Scrum Guide 2020 и называет ли он должности — «аналитик», «тестировщик»?' },
    { id: 'f5', t: 'Тимлид — начальник над разработчиками, отдельная роль Scrum', b: 'err', h: 'Есть ли внутри разработчиков подкоманды и начальники по Scrum Guide?' },
    { id: 'f6', t: 'Спринт: 2 недели, внутри — все остальные события', b: 'event', h: 'Спринт — просто календарный период или тоже событие Scrum?' },
    { id: 'f7', t: 'Планирование спринта', b: 'event' },
    { id: 'f8', t: 'Ежедневный Scrum, 15 минут', b: 'event' },
    { id: 'f9', t: 'Обзор спринта с Ниной Сергеевной', b: 'event' },
    { id: 'f10', t: 'Груминг (уточнение бэклога) — шестое обязательное событие Scrum', b: 'err', crit: true, alt: { pr: 0.5 }, h: 'Само уточнение бэклога полезно, но перечитайте утверждение: «шестое обязательное событие». Сколько событий в Scrum Guide 2020 и как он называет уточнение — событием или деятельностью?' },
    { id: 'f11', t: 'Бэклог продукта', b: 'art', alt: { cm: 0.5 } },
    { id: 'f12', t: 'Бэклог спринта', b: 'art', alt: { cm: 0.5 } },
    { id: 'f13', t: 'Инкремент', b: 'art', alt: { cm: 0.5 } },
    { id: 'f14', t: 'Цель продукта: предзаказ и торты во всех 9 пекарнях к 1 марта', b: 'cm', alt: { art: 0.5 } },
    { id: 'f15', t: 'Цель спринта', b: 'cm', alt: { art: 0.5 } },
    { id: 'f16', t: 'Definition of Done', b: 'cm', alt: { pr: 0.5 }, h: 'Есть ли Definition of Done в Scrum Guide 2020? К какому артефакту он привязан?' },
    { id: 'f17', t: 'Definition of Ready', b: 'pr', alt: { err: 0.5 }, h: 'В Scrum Guide его нет — но вредна ли сама идея проверять историю перед спринтом?' },
    { id: 'f18', t: 'Planning poker и сторипоинты', b: 'pr', alt: { err: 0.5 } },
    { id: 'f19', t: 'Аналитик готовит истории на спринт вперёд', b: 'pr', alt: { err: 0.5 } }
  ];
  const WHY = {
    f4: 'В Scrum Guide 2020 три зоны ответственности. Аналитик входит в разработчиков.',
    f5: 'Внутри разработчиков нет подкоманд и иерархий: тимлид в Scrum — тоже разработчик.',
    f10: 'Событий пять. Уточнение бэклога в Scrum Guide — постоянная деятельность, а не событие; отдельная встреча по нему — договорённость команды.',
    f16: 'Обязательство инкремента по Scrum Guide 2020, а не пожелание команды.',
    f17: 'Практика команд: в Scrum Guide нет. Полезна, если не превращается в «не возьмём, пока не идеально».'
  };
  function frEval(v) {
    v = v || {};
    return FI.map(it => {
      const got = v[it.id];
      if (got === it.b) return { it, s: 'ok', pts: 1 };
      if (got && it.alt && it.alt[got]) return { it, s: 'warn', pts: it.alt[got] };
      return { it, s: 'bad', pts: 0, empty: !got };
    });
  }
  const frameTask = {
    id: 'frame', title: 'Разложите Scrum по полочкам',
    simple: howFrame.simple,
    lead: ui.brief({
      situation: 'Перед планированием спринта 3 Дима повесил на доску карточки — «чтобы новенькие не путались». Половина из них — правда из Scrum Guide 2020, часть — полезные практики команды, а пара — ошибки, которые вы ещё услышите на собеседованиях.',
      todo: [
        'Разложите 19 карточек по шести корзинам: нажмите карточку, потом корзину.',
        'В «Так в Scrum нет» — утверждения, которые противоречат Scrum Guide. В «Практику команды» — то, чего в Scrum Guide нет, но что команды полезно используют.',
        'Нажмите «Проверить». Засчитывается от 80 % и если обе главные ловушки — про аналитика и про груминг — пойманы.'
      ],
      lookTitle: 'Подсказка',
      look: 'Спросите про каждую карточку: это люди, время, «что на столе», цель, к которой ведёт артефакт, — или чего-то такого в Scrum Guide вообще нет? Обязательств ровно три — по одному на артефакт.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(FI.map(x => [x.id, x.b])) }),
    render(el, ctx) {
      el.classList.add('scr-root');
      let reveal = null;
      if (ctx.result || ctx.readonly) { reveal = {}; frEval(ctx.ans.v).forEach(x => { reveal[x.it.id] = x.s; }); }
      const d = document.createElement('div'); el.appendChild(d);
      ui.sort(d, { items: FI.map(x => ({ id: x.id, t: x.t })), buckets: FB, value: ctx.ans.v || {}, reveal, readonly: ctx.readonly, seed: 'scr-frame', onChange: v => { ctx.ans.v = v; ctx.save(); } });
      if (ctx.readonly) {
        const t = document.createElement('div'); t.style.marginTop = '12px';
        t.innerHTML = ui.table(['Карточка', 'Куда', 'Почему'], FI.map(x => [esc(x.t), FB.find(b => b.id === x.b).t, WHY[x.id] || '']));
        el.appendChild(t);
      }
    },
    check(ans) {
      const ev = frEval(ans && ans.v), score = ev.reduce((s, x) => s + x.pts, 0) / FI.length;
      const critBad = ev.filter(x => x.it.crit && x.s !== 'ok');
      const notes = [];
      ev.forEach(x => {
        if (x.s === 'ok') return;
        const h = x.it.h || HINT[x.it.b];
        if (x.s === 'warn') notes.push({ ok: 'warn', html: `«${esc(x.it.t)}» — близко, засчитано наполовину. ${h}` });
        else notes.push({ ok: false, html: `«${esc(x.it.t)}» — ${x.empty ? 'не разложено. ' : ''}${h}` });
      });
      if (!notes.length) notes.push({ ok: true, html: 'Все 19 карточек на своих местах.' });
      return {
        ok: score >= 0.8 && !critBad.length, score, notes: notes.slice(0, 8).concat(notes.length > 8 ? [{ ok: 'info', html: `И ещё ${notes.length - 8} — проверьте после исправления этих.` }] : []),
        summary: `Точно: ${ev.filter(x => x.s === 'ok').length} из ${FI.length}, наполовину: ${ev.filter(x => x.s === 'warn').length}.`,
        mentor: critBad.length ? 'Про аналитика и груминг вас спросят на первом же собеседовании. Сколько зон ответственности и сколько событий в Scrum Guide 2020 — и как там названо уточнение бэклога?' : null
      };
    },
    explain: `<p>Scrum Guide 2020 — это 3 + 5 + 3: <b>зоны ответственности</b> (владелец продукта, Scrum-мастер, разработчики), <b>события</b> (спринт как контейнер, планирование, ежедневный Scrum, обзор, ретроспектива), <b>артефакты</b> с обязательствами (бэклог продукта → цель продукта, бэклог спринта → цель спринта, инкремент → Definition of Done).</p>
      <ul class="checks">
        <li class="bad"><b>«Аналитик — отдельная роль».</b> Нет: Scrum Guide не называет должностей. Аналитик — один из разработчиков, как и тестировщица, и дизайнер, и тимлид.</li>
        <li class="bad"><b>«Груминг — событие».</b> Нет: уточнение бэклога — постоянная деятельность. Команда может назначить для него встречу, но это её договорённость, не шестое событие.</li>
        <li><b>Definition of Done</b> — обязательство из Scrum Guide; <b>Definition of Ready</b>, покер, сторипоинты, работа на спринт вперёд — практики команд. Они полезны, но о них спорят, и в разных компаниях их делают по-разному.</li>
      </ul>
      <p>Зачем это аналитику: на собеседовании и в чужой команде вы будете слышать «у нас так положено по Scrum». Полезно отличать, что действительно из Scrum Guide, а что — привычка команды, которую можно обсуждать.</p>
      <p class="small muted">Источник: Кен Швабер, Джефф Сазерленд, «Руководство по Scrum» (Scrum Guide), редакция ноября 2020 года — есть официальный перевод на русский на scrumguides.org.</p>`,
    report: ans => frEval(ans && ans.v).map(x => `- ${x.it.t} → ${(FB.find(b => b.id === ((ans && ans.v) || {})[x.it.id]) || { t: '—' }).t} ${x.s === 'ok' ? '✓' : x.s === 'warn' ? '≈' : '✗'}`).join('\n')
  };

  // =====================================================================
  // Практика 2. Лаборатория «Спринт 3 «Колоса»»: решения аналитика по дням
  // =====================================================================
  const LD = [
    { id: 'l1', when: 'Пн · день 1', ev: 'Планирование спринта 3',
      sit: 'Нина подтвердила порядок, команда сформулировала цель. Дима раскладывает истории на задачи и задаёт вопросы по критериям «Выдачи по короткому коду».',
      opts: [
        { v: 'a', t: 'Сижу на планировании: отвечаю на вопросы, открытые записываю с ответственным и сроком', k: 'ok', r: 0, b: 0, w: 0, out: 'Планирование уложилось в 3 часа. Два открытых вопроса — у вас, с ответственным: Павел до вторника.' },
        { v: 'b', t: 'Не иду: Ксения справится, а я сразу сяду за истории спринта 4', k: 'bad', r: 1, b: 10, w: 0, out: 'Истории спринта 4 сдвинулись, но два вопроса по коду выдачи никто не записал. Они всплыли в среду, и разработка встала на полтора дня.' },
        { v: 'c', t: 'Иду и прямо на встрече переписываю критерии, чтобы стали идеальными', k: 'bad', r: 0, b: 2, w: 4, out: 'Планирование растянулось до 6 часов: команда ждала, пока вы печатаете. Таймбокс сорван, часть критериев поменялась уже после оценки.' }
      ] },
    { id: 'l2', when: 'Вт · день 2', ev: 'Вопрос в чате',
      say: ['dima', 'В «Выдаче по коду»: код из 4 цифр или из 6? И что делать, если кассир ввёл неверный? Пока не ответите — не начинаем.'],
      opts: [
        { v: 'a', t: 'Сегодня же спросить Павла (15 минут), дописать критерий и ответить в чат', k: 'ok', r: 0, b: 1, w: 0, out: 'Павел ответил за 15 минут, критерий дописан, разработка пошла после обеда.' },
        { v: 'b', t: 'Ответить в пятницу — сейчас занят историями спринта 4', k: 'bad', r: 1, b: 16, w: 0, out: 'Истории спринта 4 продвинулись, но два разработчика полтора дня ждали или делали «что-нибудь другое»: 16 часов простоя — дороже всего, что вы успели.' },
        { v: 'c', t: '«Делайте, как считаете правильным»', k: 'bad', r: 0, b: 0, w: 10, out: 'Разработчики выбрали 6 цифр. На обзоре Павел скажет: «Кассир в перчатках шесть цифр не наберёт», — переделка на полтора дня.' }
      ] },
    { id: 'l3', when: 'Чт · день 4', ev: 'Тихий день',
      sit: 'Разработка идёт, вопросов нет. Ксения напоминает: «Через неделю планирование спринта 4 — торты. Историй шесть, готова одна».',
      opts: [
        { v: 'a', t: 'Сесть с Галиной Ивановной и Соней за истории про торты: 48 часов, не больше 25 в день, фото-образец — в критерии и макеты', k: 'ok', r: 2, b: 0, w: 0, out: 'Две истории про торты получили правила, примеры и макет. Галина Ивановна сама вспомнила про праздничный лимит в 60 тортов.' },
        { v: 'b', t: 'Помочь Лере проверять готовые истории спринта 3', k: 'warn', r: 0, b: 0, w: -2, out: 'Текущему спринту стало чуть легче — это нормальная помощь в команде. Но торты как были сырыми, так и остались, а до планирования неделя.' },
        { v: 'c', t: 'Написать подробное ТЗ на все торты сразу, на три спринта вперёд', k: 'warn', r: 1, b: 0, w: 4, out: 'Получился документ на 20 страниц. Готовой к спринту стала одна история, а половину написанного придётся менять после первого же обзора — так вы уходите в мини-каскад.' }
      ] },
    { id: 'l4', when: 'Пн · день 6', ev: 'Письмо от владелицы',
      say: ['nina', 'В пятницу на показ не приду, пусть Павел посмотрит. Решения — потом.'],
      opts: [
        { v: 'a', t: 'Предложить варианты: перенести обзор на время, когда Нина свободна, или письменно дать Павлу и Галине Ивановне право решать по предзаказу и тортам', k: 'ok', r: 0, b: 0, w: 0, out: 'Нина выбрала четверг, 16:00. Обзор не отменили, а сдвинули, и решать будет тот, кто вправе.' },
        { v: 'b', t: '«Хорошо, покажем Павлу»', k: 'bad', r: -1, b: 0, w: 4, out: 'На обзоре Павел: «Торты — не мне решать». Два вопроса Нине висят неделю — история про лимит тортов не готова к планированию.' },
        { v: 'c', t: 'Отменить обзор — покажем всё в следующем спринте', k: 'bad', r: 0, b: 0, w: 8, out: 'Обзор — обязательное событие, его не отменяют из-за занятости гостя. Отзывы придут через две недели, когда сделано вдвое больше, — переделка дороже.' }
      ] },
    { id: 'l5', when: 'Вт · день 7', ev: 'Уточнение бэклога',
      sit: 'Ксения предлагает час с Димой и Лерой по историям тортов.',
      opts: [
        { v: 'a', t: 'Провести уточнение втроём, как три амиго: Лера ищет границы, Дима — что сложно; большую историю режем и оцениваем', k: 'ok', r: 2, b: 0, w: 0, out: '' },
        { v: 'b', t: 'Отправить истории Диме письмом — пусть прочитает и оценит сам', k: 'warn', r: 0, b: 0, w: 0, out: 'Дима ответил вопросами через два дня: оценить без разговора не смог. Ни одна история не стала готовой.' },
        { v: 'c', t: 'Пропустить — истории понятные, обсудим на планировании', k: 'bad', r: 0, b: 0, w: 0, out: 'Обсуждение переехало на планирование спринта 4 — а там на него нет времени.' }
      ] },
    { id: 'l6', when: 'Ср · день 8', ev: 'Вопрос тестировщицы',
      say: ['lera', 'В «Оплате при получении»: заказ становится «Не выкуплен» через 30 минут после конца интервала или после закрытия пекарни? В критериях не сказано.'],
      opts: [
        { v: 'a', t: 'Свериться с правилом в блокноте, дописать критерий, сказать Диме и Лере', k: 'ok', r: 0, b: 0, w: 0, out: 'Правило есть: держим 30 минут после конца интервала, потом выпечка уходит в продажу. Критерий дописан за 10 минут.' },
        { v: 'b', t: 'Раз нашлась дыра — переписать критерии всех историй спринта', k: 'bad', r: 0, b: 6, w: 10, out: 'Разработчики день ждали новых критериев, часть готового пришлось сверять заново. Одна дыра не повод переписывать всё.' },
        { v: 'c', t: 'Отложить до обзора — спросим Нину в пятницу', k: 'warn', r: 0, b: 4, w: 4, out: 'Правило уже было в блокноте — спрашивать Нину не требовалось. Два дня Лера проверяла «наугад».' }
      ] },
    { id: 'l7', when: 'Пт · день 10', ev: 'Обзор спринта и ретроспектива',
      sit: 'Последний день спринта 3.',
      opts: [
        { v: 'a', t: 'Показ на живых примерах: Павел сам выдаёт заказ по коду; отзывы и решения — в бэклог; на ретроспективе — одно улучшение', k: 'ok', r: 1, b: 0, w: 0, out: '' },
        { v: 'b', t: 'Показать слайды: «Сделано 80 %»', k: 'bad', r: 0, b: 0, w: 4, out: 'Слайды не потрогать: никто не заметил, что код на экране выдачи мелкий. Главная мера прогресса — работающий продукт.' },
        { v: 'c', t: 'Не ходить: обзор — для Нины и Димы, а у меня торты', k: 'bad', r: -1, b: 0, w: 2, out: 'Отзывы про выдачу кто-то записал на салфетке, решение Нины по тортам в бэклог никто не перенёс.' }
      ] }
  ];
  const LAB_GOAL = 'Покупатель в пилотной пекарне может оформить предзаказ с оплатой при получении, а кассир выдаёт заказ по короткому коду.';
  const labSig = ch => LD.map(d => (ch || {})[d.id] || '-').join('');
  function labRun(ch) {
    ch = ch || {};
    let ready = 1, block = 0, rework = 0;
    const out = {};
    LD.forEach(d => {
      const o = d.opts.find(x => x.v === ch[d.id]); if (!o) return;
      let r = o.r, txt = o.out;
      if (d.id === 'l5' && o.v === 'a') { r = ch.l3 === 'a' ? 2 : 1; txt = ch.l3 === 'a' ? 'Черновики про торты уже были — за час Лера нашла три границы (47 и 48 часов, 25-й и 26-й торт, праздничный лимит), Дима разрезал большую историю. Ещё две истории готовы.' : 'Обсуждать почти нечего: истории про торты сырые. За час довели до готовности одну.'; }
      if (d.id === 'l7' && o.v === 'a') { r = ch.l4 === 'a' ? 1 : 0; txt = ch.l4 === 'a' ? 'Нина сама оформила заказ и попросила крупнее код на экране выдачи — в бэклог. Её решение по праздничному лимиту тортов сделало готовой ещё одну историю. На ретроспективе договорились: вопросы Павлу — в общий чат, ответ в течение дня.' : 'Показ живой, отзывы записаны, но Нины на обзоре не было — решения по тортам опять ждут её.'; }
      ready += r; block += o.b; rework += o.w;
      out[d.id] = { k: o.k, txt };
    });
    ready = Math.max(0, Math.min(6, ready)); rework = Math.max(0, rework);
    const all = LD.every(d => ch[d.id]);
    const goalOk = block + rework <= 12;
    const review = ch.l4 === 'a' && ch.l7 === 'a';
    const bad = LD.filter(d => out[d.id] && out[d.id].k === 'bad');
    const warn = LD.filter(d => out[d.id] && out[d.id].k === 'warn');
    return { ready, block, rework, goalOk, review, all, out, bad, warn, pass: all && ready >= 5 && block <= 8 && rework <= 8 && review && !bad.length };
  }
  const labTask = {
    id: 'sprint-lab', title: 'Лаборатория: спринт 3 «Колоса»',
    simple: howSprint.simple,
    lead: ui.brief({
      situation: `Спринт 3, две недели. Цель спринта: «${LAB_GOAL}» Вы — аналитик команды. Через две недели — планирование спринта 4 про торты: из шести историй к спринту готова одна. В семь дней спринта случится что-то, что требует вашего решения.`,
      todo: [
        'Для каждого из семи дней выберите, что делаете вы как аналитик.',
        'Нажмите «▶ Прогнать спринт» и прочитайте, что вышло из каждого решения, — под каждым днём и в итогах.',
        'Меняйте решения и прогоняйте снова, пока не выполните условия: к планированию спринта 4 готовы минимум 5 историй из 6, разработчики ждали не больше 8 часов, переделок не больше 8 часов, обзор прошёл с решениями владелицы, и ни одного решения, которое ломает работу команды.',
        'Нажмите «Проверить».'
      ],
      look: 'Последствия видны только после прогона — как в жизни: сначала решаешь, потом видишь. «Готово к спринту 4» — истории про торты с правилами, примерами и макетом. «Ждали ответа» — часы простоя разработчиков. «Переделки» — часы на переделку уже сделанного. Цифры учебные, механизм — настоящий.'
    }),
    blank: () => ({ ch: {}, ran: '', runs: 0 }),
    reference: () => { const ch = Object.fromEntries(LD.map(d => [d.id, 'a'])); return { ch, ran: labSig(ch), runs: 1 }; },
    render(el, ctx) {
      el.classList.add('scr-root');
      const a = ctx.ans; a.ch = a.ch || {}; a.runs = a.runs || 0;
      const box = document.createElement('div'); box.className = 'stack'; el.appendChild(box);
      function draw() {
        const sig = labSig(a.ch), fresh = a.ran && a.ran === sig, res = labRun(a.ch);
        const showOut = fresh || ctx.readonly;
        let h = `<div class="scr-goalbar"><span class="scr-lbl">Цель спринта 3</span>${esc(LAB_GOAL)}</div>`;
        h += LD.map(d => {
          const o = showOut && res.out[d.id];
          return `<div class="scr-lday ${o ? o.k : ''}" data-ld="${d.id}"><div class="when">${d.when} · ${d.ev}</div>
            ${d.sit ? `<div>${esc(d.sit)}</div>` : ''}${d.say ? ui.say(d.say[0], esc(d.say[1])) : ''}
            <div class="scr-opts">${d.opts.map(x => `<button type="button" class="scr-opt" data-lo="${d.id}|${x.v}" aria-pressed="${a.ch[d.id] === x.v}" ${ctx.readonly ? 'disabled' : ''}><span class="mk"></span><span>${esc(x.t)}</span></button>`).join('')}</div>
            ${o ? ui.note(o.k, o.k === 'ok' ? 'Что вышло' : o.k === 'warn' ? 'Что вышло: с потерями' : 'Что вышло: поломка', esc(o.txt)) : ''}</div>`;
        }).join('');
        const n = LD.filter(d => a.ch[d.id]).length;
        h += `<div class="row"><button type="button" class="btn primary" data-lrun ${n < LD.length || ctx.readonly ? 'disabled' : ''}>▶ Прогнать спринт</button><span class="small dim">${n < LD.length ? `Выбрано решений: ${n} из ${LD.length}` : fresh ? `Прогонов: ${a.runs}. Поменяйте решения и прогоните снова, если что-то не сходится.` : a.ran ? 'Решения изменились — прогоните спринт заново.' : 'Все решения выбраны — прогоните спринт.'}</span></div>`;
        if (showOut) {
          h += `<div class="eyebrow">Итоги спринта 3</div><div class="scr-stats">
            <div class="stat"><span class="k">Готово к спринту 4</span><span class="v ${res.ready >= 5 ? 'ok' : 'bad'}">${res.ready} из 6</span><span class="s">нужно 5+</span></div>
            <div class="stat"><span class="k">Ждали ответа</span><span class="v ${res.block <= 8 ? 'ok' : 'bad'}">${res.block} ч</span><span class="s">не больше 8</span></div>
            <div class="stat"><span class="k">Переделки</span><span class="v ${res.rework <= 8 ? 'ok' : 'bad'}">${res.rework} ч</span><span class="s">не больше 8</span></div>
            <div class="stat"><span class="k">Цель спринта</span><span class="v ${res.goalOk ? 'ok' : 'bad'}">${res.goalOk ? 'достигнута' : 'нет'}</span><span class="s">${res.review ? 'обзор с решениями Нины' : 'обзор без решений Нины'}</span></div></div>`;
          h += res.pass ? ui.say('dima', `На планировании спринта 4 у нас ${res.ready} ${TR.plural(res.ready, 'готовая история', 'готовые истории', 'готовых историй')} про торты и ни одной «допишем по ходу». Так и работаем.`)
            : res.ready < 5 ? ui.say('dima', `На планировании спринта 4 готовых историй ${res.ready} из 6. Берём их, остальное — «допишем по ходу»? Мы это уже проходили.`)
              : res.block > 8 ? ui.say('dima', `Мы ${res.block} часов ждали ответов. Это почти ${Math.round(res.block / 8)} ${TR.plural(Math.round(res.block / 8), 'день', 'дня', 'дней')} одного разработчика.`)
                : !res.review ? ui.say('ksenia', 'Обзор без того, кто решает, — это показ, а не обзор. Как сделать, чтобы на нём были решения Нины — или того, кому она их доверила?')
                  : ui.say('ksenia', 'Цифры почти сходятся, но одно из решений ломает работу команды. Посмотрите, какой день подсвечен красным.');
        }
        box.innerHTML = h;
      }
      TR.on(box, 'click', '[data-lo]', (e, b) => {
        if (ctx.readonly) return;
        const [d, v] = b.dataset.lo.split('|'); a.ch[d] = v; ctx.save(); draw();
      });
      TR.on(box, 'click', '[data-lrun]', () => {
        if (ctx.readonly) return;
        a.ran = labSig(a.ch); a.runs = (a.runs || 0) + 1; ctx.save();
        const r = labRun(a.ch); ctx.decide('Спринт 3: итог прогона', `готово ${r.ready}/6, ждали ${r.block} ч, переделки ${r.rework} ч`);
        draw();
      });
      draw();
    },
    check(ans) {
      ans = ans || {}; const ch = ans.ch || {}, r = labRun(ch), notes = [];
      const n = LD.filter(d => ch[d.id]).length;
      if (n < LD.length) return { ok: false, score: n / LD.length * 0.3, summary: `Решений выбрано: ${n} из ${LD.length}.`, notes: [{ ok: false, html: 'Выберите решение на каждый день и прогоните спринт.' }] };
      const ran = ans.ran === labSig(ch);
      if (!ran) notes.push({ ok: false, html: 'Текущие решения ещё не прогнаны. Нажмите «▶ Прогнать спринт» и посмотрите, что из них вышло.' });
      notes.push(r.ready >= 5 ? { ok: true, html: `К спринту 4 готово ${r.ready} из 6 историй.` } : { ok: false, html: `К спринту 4 готово ${r.ready} из 6. В какой день спринта было время готовить торты — и кто вам для этого нужен?` });
      notes.push(r.block <= 8 ? { ok: true, html: `Разработчики ждали ответов ${r.block} ч.` } : { ok: false, html: `Разработчики ждали ответов ${r.block} ч. Что дороже: час аналитика сегодня или полтора дня двух разработчиков?` });
      notes.push(r.rework <= 8 ? { ok: true, html: `Переделок — ${r.rework} ч.` } : { ok: false, html: `Переделок — ${r.rework} ч. Где решение приняли без того, кто знает правило, — или переписали больше, чем требовалось?` });
      notes.push(r.review ? { ok: true, html: 'Обзор прошёл с решениями владелицы.' } : { ok: false, html: 'На обзоре не было решений Нины. Кто вправе решать за неё и как это оформить? И что нужно, чтобы обзор был рабочей встречей, а не показом слайдов?' });
      r.bad.forEach(d => notes.push({ ok: false, html: `${d.when}: это решение ломает работу команды. Перечитайте, что из него вышло.` }));
      r.warn.forEach(d => notes.push({ ok: 'warn', html: `${d.when}: решение с потерями — можно лучше.` }));
      const goodDays = LD.filter(d => r.out[d.id] && r.out[d.id].k === 'ok').length;
      const metrics = [r.ready >= 5, r.block <= 8, r.rework <= 8, r.review].filter(Boolean).length / 4;
      const score = Math.min(1, (ran ? 0.1 : 0) + metrics * 0.5 + goodDays / LD.length * 0.4);
      return { ok: ran && r.pass, score, notes, summary: `Готово к спринту 4: ${r.ready}/6 · ждали ${r.block} ч · переделки ${r.rework} ч · решений «как надо»: ${goodDays} из ${LD.length}.` };
    },
    explain: `<p>У аналитика в спринте две работы одновременно, и обе нельзя бросить:</p>
      <ul class="checks">
        <li><b>Текущий спринт.</b> Быть на планировании, отвечать на вопросы в тот же день (час аналитика дешевле полутора дней двух разработчиков), не переписывать всё из-за одной дыры, сверяться с уже известными правилами.</li>
        <li><b>Следующий спринт.</b> В тихие дни — уточнять истории с теми, кто знает правила (Галина Ивановна, Павел), и с дизайнером; на уточнении — с командой, как три амиго. Не дальше чем на 1–2 спринта: ТЗ на три спринта вперёд — мини-каскад.</li>
        <li><b>Обзор с тем, кто решает.</b> Владелец продукта может поручить работу другим, но отвечать за решения остаётся сам. Если Нина не может прийти — перенести обзор или письменно передать Павлу и Галине Ивановне право решать в их вопросах. Отменять обзор и показывать слайды — нельзя: главная мера прогресса — работающий продукт.</li>
      </ul>
      <p>Помочь Лере тестировать в тихий день — нормальная работа в команде. Но если через неделю планирование, а истории сырые, ваш вклад в цель следующего спринта важнее. Это выбор, а не правило: в другом спринте правильным будет помочь Лере.</p>
      <p class="small muted">Источники: Scrum Guide 2020 (обязательства, события, ответственность владельца продукта); Д. Сай, «Adapting Usability Investigations for Agile User-centered Design» (2007) — работа на спринт вперёд.</p>`,
    report: ans => { const r = labRun(ans && ans.ch); return LD.map(d => { const o = d.opts.find(x => x.v === ((ans && ans.ch) || {})[d.id]); return `- ${d.when}: ${o ? o.t : '—'} ${o ? (o.k === 'ok' ? '✓' : o.k === 'warn' ? '≈' : '✗') : ''}`; }).join('\n') + `\nИтог: готово ${r.ready}/6, ждали ${r.block} ч, переделки ${r.rework} ч, обзор ${r.review ? 'с решениями Нины' : 'без решений Нины'}`; }
  };

  // =====================================================================
  // Практика 3. Планирование спринта 4: набор под скорость и цель спринта
  // =====================================================================
  const CAP = 17;
  const BL = [
    { id: 'b1', t: 'Торт: заявка с фото-образцом и надписью', pts: 5, ready: true, topic: 'cake' },
    { id: 'b2', t: 'Торт: не раньше чем за 48 часов и не больше 25 тортов в день', pts: 3, ready: true, topic: 'cake' },
    { id: 'b3', t: 'Торт: предоплата 50 % и чек «предоплата»', pts: 8, ready: false, why: 'зависит от пакета «КассаПро»: сертификация ещё идёт', topic: 'cake' },
    { id: 'b4', t: 'Торт: планшет кондитера — заказ с фото и надписью в цехе', pts: 5, ready: true, topic: 'cake' },
    { id: 'b5', t: 'Торт: SMS покупателю «торт готов»', pts: 3, ready: true, topic: 'cake' },
    { id: 'b6', t: 'Торт: отмена заказа и возврат предоплаты', pts: 5, ready: false, why: 'правила отмены торта Нина ещё не согласовала', topic: 'cake' },
    { id: 'b7', t: 'Сводная выгрузка продаж в 1С к 09:00', pts: 8, ready: true, topic: 'onec' },
    { id: 'b8', t: 'Техдолг: автотесты на расчёт интервалов выдачи', pts: 2, ready: true, topic: 'tech' },
    { id: 'b9', t: 'Баллы лояльности: начислять 5 %', pts: 8, ready: true, topic: 'loyal' }
  ];
  const GF = [
    { id: 'what', t: 'про что: торты', hint: 'Из цели не видно, о чём спринт. Какая тема объединяет выбранные истории?' },
    { id: 'who', t: 'для кого', hint: 'Кому станет лучше после спринта: покупателю, кондитеру, цеху?' },
    { id: 'res', t: 'результат, который можно показать', hint: 'Что человек сможет сделать или увидеть на обзоре? Глаголы вроде «может заказать», «видит».' },
    { id: 'notlist', t: 'не список задач', hint: 'Цель — одна мысль «зачем», а не перечень историй или задач с номерами.' },
    { id: 'honest', t: 'не обещает невзятого', hint: 'Цель обещает то, чего нет в выбранных историях. Перечитайте её рядом с набором.' }
  ];
  function goalEval(ans) {
    const sel = (ans && ans.sel) || [], txt = String((ans && ans.goal) || '').trim();
    const items = BL.filter(b => sel.includes(b.id)), sum = items.reduce((s, b) => s + b.pts, 0);
    const notReady = items.filter(b => !b.ready);
    const foreign = items.filter(b => b.topic === 'onec' || b.topic === 'loyal');
    const topOk = sel.includes('b1') && sel.includes('b2');
    const over = sum > CAP, under = sum < 12;
    const has = id => sel.includes(id);
    const low = txt.toLowerCase();
    const f = {
      what: /торт/.test(low),
      who: /(покупател|клиент|кондитер|цех|кассир|технолог|галин|нин)/.test(low),
      res: /(может|могут|сможет|смогут|видит|видят|получа|принима|оформ|заказыва|заказать|узна)/.test(low),
      notlist: txt.length > 0 && !/(истори[июйя]\s*\d|\bb\d|задач|\d\s*\)|\n\s*\d|сделать все|закрыть все|\d+\s*истор)/.test(low) && (txt.match(/[,;]/g) || []).length <= 4,
      honest: txt.length > 0 && !((/(предоплат|возврат|отмен)/.test(low) && !has('b3') && !has('b6')) || (/(1с|1c|выгрузк)/.test(low) && !has('b7')) || (/балл/.test(low) && !has('b9')) || (/(sms|смс)/.test(low) && !has('b5')))
    };
    const gn = Object.values(f).filter(Boolean).length;
    const short = txt.length >= 30 && txt.length <= 280;
    let selScore = 1;
    if (!items.length) selScore = 0;
    else {
      if (notReady.length) selScore -= 0.5;
      if (over) selScore -= 0.4;
      if (under) selScore -= 0.2;
      if (foreign.length) selScore -= 0.3;
      if (!topOk) selScore -= 0.2;
    }
    selScore = Math.max(0, selScore);
    const goalScore = txt ? (gn / GF.length) * (short ? 1 : 0.8) : 0;
    const score = selScore * 0.55 + goalScore * 0.45;
    return { items, sum, notReady, foreign, topOk, over, under, f, gn, short, txt, selScore, goalScore, score, ok: items.length > 0 && !notReady.length && !over && !foreign.length && topOk && !under && gn >= 4 && f.honest && short && score >= 0.8 };
  }
  function dimaSays(ev) {
    if (!ev.items.length) return 'Жду набор. Скорость у нас 18, 22, 20, но в этот спринт бэкенд-разработчик 3 дня в отпуске — берём не больше 17 пунктов.';
    if (ev.notReady.length) return `«${ev.notReady[0].t}» — не готова: ${ev.notReady[0].why}. Сырую историю в спринт не берём.`;
    if (ev.over) return `${ev.sum} ${TR.plural(ev.sum, 'пункт', 'пункта', 'пунктов')} при потолке ${CAP}. В прошлый раз, когда взяли больше, чем можем, половина «почти готового» переехала в следующий спринт.`;
    if (ev.foreign.length) return `«${ev.foreign[0].t}» — из другой оперы. Цель спринта распадается на две, и непонятно, что важнее, если не успеем.`;
    if (!ev.topOk) return 'Нина поставила первыми заявку торта и проверку 48 часов. Почему мы их не берём?';
    if (ev.under) return `${ev.sum} ${TR.plural(ev.sum, 'пункт', 'пункта', 'пунктов')} — мы можем больше. Что ещё из готового работает на ту же цель?`;
    if (!ev.txt) return 'Набор хороший. Теперь цель: одна фраза — зачем этот спринт.';
    const miss = GF.find(g => !ev.f[g.id]);
    if (miss) return miss.hint;
    if (!ev.short) return 'Цель длинновата. Одна-две фразы, которые помнит вся команда.';
    return 'Такую цель я повешу над доской. Если что-то пойдёт не так, будет понятно, что важнее сохранить.';
  }
  const GOAL_REF = 'Покупатель может заказать торт с фото-образцом и надписью не позже чем за 48 часов и в пределах 25 тортов в день, а кондитер видит заказ с фото на планшете в цехе; когда торт готов, покупатель получает SMS.';
  const goalTask = {
    id: 'goal', title: 'Планирование спринта 4: набор и цель',
    simple: howEstimate.simple,
    lead: ui.brief({
      situation: 'Понедельник, планирование спринта 4. Нина выстроила бэклог: первыми — торты, к 8 Марта это главное. Скорость команды в спринтах 1–3: 18, 22 и 20 пунктов. Но бэкенд-разработчик 3 дня из 10 в отпуске, и Дима говорит: «Берём не больше 17 пунктов». Две истории про торты ещё не готовы.',
      todo: [
        'Нажимайте истории, чтобы взять их в спринт. Следите за суммой пунктов и за пометкой «не готова».',
        'Соберите набор, который работает на одну цель и не превышает 17 пунктов.',
        'Напишите цель спринта — одну-две фразы: зачем этот спринт, кому станет лучше, что можно будет показать на обзоре. Под полем — признаки, которые проверяет редактор, и реплика Димы.',
        'Нажмите «Проверить». Засчитывается, если набор готов, по силам и про одно, а у цели не меньше четырёх признаков из пяти.'
      ],
      look: 'Цель спринта по Scrum Guide — обязательство бэклога спринта: её формулирует вся команда, и она даёт гибкость — если что-то не успеваем, понятно, что сохранить. Редактор проверяет признаки, а не смысл: перечитайте цель глазами Нины на обзоре.'
    }),
    blank: () => ({ sel: [], goal: '' }),
    reference: () => ({ sel: ['b1', 'b2', 'b4', 'b5'], goal: GOAL_REF }),
    render(el, ctx) {
      el.classList.add('scr-root');
      const a = ctx.ans; a.sel = Array.isArray(a.sel) ? a.sel : []; a.goal = a.goal || '';
      const show = !!(ctx.result || ctx.readonly);
      el.innerHTML = `<div class="stack">
        <div class="eyebrow">Бэклог продукта — в порядке Нины</div>
        <div class="scr-bl" data-bl></div>
        <div data-sum></div>
        <label class="field"><span>Цель спринта 4</span><textarea rows="4" data-goal placeholder="Покупатель может … , а … видит …" ${ctx.readonly ? 'readonly' : ''}>${esc(a.goal)}</textarea></label>
        <div data-live></div></div>`;
      function drawList() {
        const ev = goalEval(a);
        TR.$('[data-bl]', el).innerHTML = BL.map((b, i) => {
          const on = a.sel.includes(b.id);
          let cls = '';
          if (show && on) cls = !b.ready || b.topic === 'onec' || b.topic === 'loyal' ? 'bad' : 'ok';
          return `<button type="button" class="scr-bi ${cls}" data-bi="${b.id}" aria-pressed="${on}" ${ctx.readonly ? 'disabled' : ''}><span class="no">${i + 1}</span><span class="t">${esc(b.t)}${b.ready ? '' : `<span class="small" style="color:var(--warn)">не готова: ${esc(b.why)}</span>`}</span><span class="pts">${b.pts} п.</span></button>`;
        }).join('');
        const k = ev.over ? 'bad' : ev.sum >= 12 ? 'ok' : 'warn';
        TR.$('[data-sum]', el).innerHTML = `<div class="row between"><span>Взято: <b class="tnum">${ev.sum}</b> из ${CAP} пунктов</span>${ev.notReady.length ? chip('в наборе есть неготовая история', 'bad') : ''}</div>${ui.meter(ev.sum / CAP, k)}`;
      }
      function drawLive() {
        const ev = goalEval(a);
        TR.$('[data-live]', el).innerHTML = `<div class="scr-feats">${GF.map(g => chip((ev.f[g.id] ? '✓ ' : '✕ ') + g.t, ev.f[g.id] ? 'ok' : ev.txt ? 'bad' : '')).join('')}${ev.txt && !ev.short ? chip('длина: 1–2 фразы', 'warn') : ''}</div>${ui.say('dima', esc(dimaSays(ev)))}`;
      }
      drawList(); drawLive();
      if (ctx.readonly) return;
      TR.on(el, 'click', '[data-bi]', (e, b) => {
        const id = b.dataset.bi, i = a.sel.indexOf(id);
        if (i >= 0) a.sel.splice(i, 1); else a.sel.push(id);
        ctx.save(); drawList(); drawLive();
      });
      TR.on(el, 'input', '[data-goal]', (e, t) => { a.goal = t.value; ctx.save(); drawLive(); });
    },
    check(ans) {
      const ev = goalEval(ans), notes = [];
      if (!ev.items.length) notes.push({ ok: false, html: 'Набор пуст: возьмите в спринт истории из бэклога.' });
      if (ev.notReady.length) notes.push({ ok: false, html: `В наборе неготовая история: «${esc(ev.notReady[0].t)}». Что с ней не так и можно ли её начинать?` });
      if (ev.over) notes.push({ ok: false, html: `${ev.sum} ${TR.plural(ev.sum, 'пункт', 'пункта', 'пунктов')} при потолке ${CAP}. Скорость — среднее за прошлые спринты, но в этом спринте людей меньше.` });
      if (ev.foreign.length) notes.push({ ok: false, html: `«${esc(ev.foreign[0].t)}» — работает ли это на ту же цель, что и остальное? Что ставила первым Нина?` });
      if (ev.items.length && !ev.topOk) notes.push({ ok: 'warn', html: 'Первые истории в порядке Нины не взяты. Почему команда обходит самое важное?' });
      if (ev.items.length && ev.under && !ev.over) notes.push({ ok: 'warn', html: `${ev.sum} ${TR.plural(ev.sum, 'пункт', 'пункта', 'пунктов')} — заметно меньше, чем команда может. Что ещё из готового работает на ту же цель?` });
      if (ev.items.length && !ev.notReady.length && !ev.over && !ev.foreign.length && ev.topOk && !ev.under) notes.push({ ok: true, html: `Набор: ${ev.sum} ${TR.plural(ev.sum, 'пункт', 'пункта', 'пунктов')}, всё готово, про одно.` });
      if (!ev.txt) notes.push({ ok: false, html: 'Цель спринта не написана.' });
      else {
        GF.forEach(g => { if (!ev.f[g.id]) notes.push({ ok: g.id === 'honest' ? false : 'warn', html: 'Цель: ' + g.hint }); });
        if (!ev.short) notes.push({ ok: 'warn', html: 'Цель: одна-две фразы (30–280 символов), которые помнит вся команда.' });
        if (ev.gn === GF.length && ev.short) notes.push({ ok: true, html: 'Цель: про торты, для людей, показуемый результат, без списка задач и лишних обещаний.' });
      }
      return { ok: ev.ok, score: ev.score, notes, summary: `Набор: ${ev.sum}/${CAP} пунктов · признаков цели: ${ev.gn} из ${GF.length}.` };
    },
    explain: `<p>Эталонный набор — 16 пунктов, все готовы и все про торты:</p>
      ${ui.table(['История', 'Пункты', 'Почему'], [['Заявка с фото и надписью', '5', 'первой в порядке Нины; без неё нет торта в системе'], ['48 часов и 25 в день', '3', 'правило цеха; без него снова сорванные заказы'], ['Планшет кондитера', '5', 'кондитер видит фото и надпись — то, что сейчас теряется в мессенджерах'], ['SMS «торт готов»', '3', 'замыкает путь покупателя; можно заменить автотестами (2) — тоже 14–16 пунктов'], ['Предоплата и чек', '—', 'не готова: ждёт сертификации «КассаПро»'], ['Отмена и возврат', '—', 'не готова: правила не согласованы'], ['1С и баллы', '—', 'готовы, но из другой цели; баллы — во втором квартале']])}
      <p><b>Цель спринта</b> — не «сделать истории 1, 2, 4, 5», а зачем: «Покупатель может заказать торт с фото-образцом и надписью не позже чем за 48 часов и в пределах 25 тортов в день, а кондитер видит заказ на планшете в цехе». Если к четвергу ясно, что SMS не успеть, цель подсказывает, что сохранить, а чем пожертвовать.</p>
      <p>Почему 17, а не 20: скорость — среднее прошлых спринтов, а не обещание. Когда людей меньше, команда сама уменьшает набор. И «не готова» — не формальность: история без согласованных правил превратится в вопросы посреди спринта, как в лаборатории.</p>
      <p class="small muted">Источники: Scrum Guide 2020 — цель спринта как обязательство бэклога спринта; Майк Кон, «Agile Estimating and Planning» (2005) — скорость и планирование по ней.</p>`,
    refNote: 'Возможны и другие верные наборы: вместо SMS — автотесты на интервалы (14 пунктов), или все пять готовых историй про торты без SMS. Главное — готово, по силам, про одно.',
    report: ans => { const ev = goalEval(ans); return `Набор: ${ev.items.map(b => b.t).join('; ') || '—'} (${ev.sum} п.)\nЦель: ${ev.txt || '—'}`; }
  };

  // =====================================================================
  // Практика 4. Ответ своими словами: где аналитик в Scrum
  // =====================================================================
  const AN_RUBRIC = [
    'Scrum Guide не называет должностей: аналитик входит в разработчиков — всех, кто делает инкремент; «отдельной роли аналитика» нет',
    'Главная работа — уточнение бэклога с владельцем продукта: правила, критерии приёмки, примеры, макеты, зависимости — чтобы истории были готовы к планированию',
    'Работает на спринт-два вперёд — но это практика (dual-track), а не правило Scrum; уточняет вместе с командой (три амиго), чтобы не превратить Scrum в мини-каскад',
    'В текущем спринте: на планировании объясняет истории, по ходу отвечает на вопросы в тот же день, помогает с приёмкой, на обзоре показывает и записывает решения в бэклог',
    'Не заменяет владельца продукта: порядок и решения — за Ниной (или теми, кому она их поручила), аналитик приносит варианты и последствия'
  ];
  const AN_REF = 'В Scrum Guide нет должностей — ни аналитика, ни тестировщика, ни тимлида. Есть три зоны ответственности, и я вхожу в «разработчиков»: это все, кто делает работающий результат спринта. Моя часть инкремента — требования. Главное, что я делаю, — уточнение бэклога вместе с Ниной: перевожу её «хочу торты через приложение» в истории с правилами (48 часов, 25 тортов в день), критериями приёмки, примерами и макетами Сони, выясняю зависимости вроде сертификации «КассаПро». Обычно я работаю на спринт-два вперёд, чтобы на планировании были готовые истории, — но это наша практика, а не правило Scrum, и уточняем мы вместе с Димой и Лерой, как три амиго, иначе получится конвейер и мини-каскад. В текущем спринте я на планировании объясняю истории, днём отвечаю на вопросы в тот же день, чтобы никто не простаивал, помогаю Лере с приёмкой, а на обзоре веду показ и записываю решения Нины в бэклог. Решения о порядке и правилах принимаю не я, а Нина или те, кому она это поручила, — я приношу ей варианты и их цену.';
  const analystTask = {
    id: 'analyst', title: 'Своими словами: где аналитик в Scrum',
    simple: {
      icon: '🧭',
      plain: 'Ответ на вопрос «зачем вы в команде» — это не «Scrum так велит», а что вы делаете для результата спринта и когда.',
      analogy: 'Технолог в цехе: печь не включает, но без его техкарт пекари гадают, а с вопросами «сколько соли» идут к нему в любой момент смены.',
      tech: 'Аргументы: Scrum Guide 2020 — разработчики как все, кто делает инкремент; уточнение бэклога как деятельность; dual-track как практика с рисками; участие в событиях; ответственность владельца продукта за решения и порядок бэклога.'
    },
    lead: ui.brief({
      situation: 'После ретроспективы спринта 3 Дима пересказывает спор из соседней команды «Квант Софт»: там убеждены, что в Scrum аналитик лишний. Он просит вас ответить — «так, чтобы я мог переслать им в чат».',
      todo: [
        'Напишите 6–10 предложений (от 300 символов): где аналитик по Scrum Guide, что он делает до спринта, во время спринта и на обзоре, и чего он не делает.',
        'Скажите честно, что из этого правило Scrum, а что — практика команды.',
        'Нажмите «Проверить с Ксенией (Claude)», если доступно, или «Сверить с эталоном самому». Засчитывается от 60 %.'
      ],
      lookTitle: 'На что опереться',
      look: 'Карта каркаса и календарь спринта из теории; ваши решения в лаборатории; цель спринта 4. Ответ — для разработчиков: можно говорить «бэклог», «спринт», «критерии приёмки».'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: AN_REF, self: AN_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('scr-root');
      el.insertAdjacentHTML('beforeend', ui.say('dima', 'Соседи говорят: «В Scrum Guide три роли, аналитика там нет. Значит, он лишний — пусть владелец продукта сам пишет истории». Ответьте им? Коротко, но по делу.'));
      const j = document.createElement('div'); j.style.marginTop = '12px'; el.appendChild(j);
      ui.justify(j, {
        id: 'scr-analyst', q: 'Где аналитик в Scrum и зачем он команде?',
        qPlain: 'Объясните разработчикам соседней команды, где аналитик по Scrum Guide 2020, что он делает до спринта, в спринте и на обзоре, что из этого правило Scrum, а что практика команды, и чего аналитик не делает вместо владельца продукта.',
        rubric: AN_RUBRIC, reference: AN_REF, value: ctx.ans.j, readonly: ctx.readonly, minLen: 300,
        placeholder: 'По Scrum Guide аналитик — … До спринта он … В спринте … На обзоре … Решения при этом принимает …',
        onChange: v => { ctx.ans.j = v; ctx.save(); ctx.decide('Где аналитик в Scrum — ответ', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j);
      return {
        ok: s >= 0.6, score: s,
        summary: s ? `Оценка ответа: ${Math.round(s * 100)} %.` : 'Напишите ответ (от 300 символов) и проверьте его с Ксенией или сверьте с эталоном сами.',
        notes: s && s < 0.6 ? [{ ok: false, html: 'Соседям нужно услышать: где аналитик по Scrum Guide (не отдельная роль), что он делает до спринта и во время него, что из этого — практика, а не правило, и что решения остаются за владельцем продукта.' }] : []
      };
    },
    explain: `<p>Хороший ответ не спорит о словах «роль» и «должность», а показывает работу. Scrum Guide описывает зоны ответственности: аналитик — один из разработчиков, его часть инкремента — требования. Самая заметная его работа — уточнение бэклога: правила, критерии, примеры, макеты и зависимости, чтобы на планировании было что брать.</p>
      <p>Честность — сильная сторона ответа: «работа на спринт вперёд» и Definition of Ready — практики, а не правила Scrum, и у них есть риск мини-каскада. Лекарство — уточнять вместе с командой. И граница: решения о порядке и правилах — за владельцем продукта; аналитик приносит варианты и их цену, но не решает за Нину.</p>
      <p>Спорный вопрос — есть ли отдельный аналитик в Scrum-команде — так и остаётся спорным: в маленьких продуктовых командах его работу часто делят владелец продукта и разработчики. Аргумент «за» — не традиция, а результат: меньше простоев, меньше переделок, готовые истории к планированию.</p>
      <p class="small muted">Источники: Scrum Guide 2020; PRACTICES.md — три амиго, Definition of Ready, работа с командой.</p>`,
    report: ans => (ans && ans.j && ans.j.text) ? ans.j.text : '—'
  };

  // =====================================================================
  TR.stage({
    id: 'scrum', act: 5, order: 410, slot: 'Пн 10:00', title: 'Scrum изнутри',
    when: 'понедельник, 10:00 · переговорная «Квант Софт», планирование спринта 3',
    intro: [
      { who: 'igor', html: 'Обследование давно позади, Нина подписала объём первой версии, два спринта разработки прошли. Сегодня планируем третий. Мне важно, чтобы пилот в двух пекарнях заработал к 1 февраля.' },
      { who: 'dima', html: 'А мне важно, чтобы на планировании не было историй «допишем критерии по ходу». Во втором спринте мы полтора дня ждали ответа про код выдачи.' },
      { who: 'ksenia', html: 'На первой неделе мы смотрели на Scrum издалека. Сегодня — изнутри: кто за что отвечает по Scrum Guide 2020, что происходит в каждый день спринта и где в нём аналитик. Потом проживём спринт 3 сами, спланируем спринт 4 и честно поспорим об оценках.' }
    ],
    facts: ['F-cake48', 'F-cakecap', 'F-cakephoto', 'F-cancel', 'F-refund', 'F-hold'],
    glossary: [
      { term: 'Бэклог продукта', simple: 'Общий список всех будущих рецептов — от самого нужного к «когда-нибудь».', tech: 'Product Backlog — упорядоченный список всего, что может понадобиться продукту; единственный источник работы Scrum-команды. Порядок определяет владелец продукта. Обязательство — цель продукта.' },
      { term: 'Бэклог спринта', simple: 'Меню на эти две недели и раскладка, кто что печёт.', tech: 'Sprint Backlog — цель спринта, выбранные элементы бэклога продукта и план их выполнения. Принадлежит разработчикам. Обязательство — цель спринта.' },
      { term: 'Цель спринта', simple: 'Одна фраза: зачем эти две недели. Если не успеваем всё — понятно, что спасать.', tech: 'Sprint Goal — единая цель спринта, которую формулирует вся Scrum-команда на планировании; даёт гибкость в составе работ (Scrum Guide 2020).' },
      { term: 'Инкремент', simple: 'Готовый торт на витрине, а не «почти испечённый».', tech: 'Increment — проверенный шаг к цели продукта, пригодный к использованию. Работа, не соответствующая Definition of Done, в инкремент не входит.' },
      { term: 'Definition of Done', simple: 'Общее для всех «готово»: испечён, остыл, проверен, упакован.', tech: 'Формальное описание состояния инкремента, когда он соответствует требованиям качества продукта. Обязательство инкремента по Scrum Guide 2020; общее для всех историй, в отличие от критериев приёмки.' },
      { term: 'Definition of Ready', simple: 'Чек-лист «техкарта готова — можно ставить в план».', tech: 'Практика команд (в Scrum Guide нет): история понятна, есть критерии приёмки, макет при необходимости, известны зависимости, оценена. Риск жёсткого DoR — мини-каскад.' },
      { term: 'Уточнение бэклога (refinement, груминг)', simple: 'Заранее разобрать будущие заказы: что, как, сколько займёт.', tech: 'Постоянная деятельность по разбиению, уточнению и оценке элементов бэклога продукта. По Scrum Guide 2020 — не событие; встречу для него команда назначает по договорённости.' },
      { term: 'Planning poker', simple: 'Все одновременно показывают, насколько сложным кажется торт, и спорят о крайних оценках.', tech: 'Техника оценки (Дж. Греннинг, 2002; М. Кон): карты с рядом, похожим на Фибоначчи, одновременное вскрытие, обсуждение расхождений, переголосование.' },
      { term: 'Сторипоинт (story point)', simple: '«Этот торт вдвое сложнее «Наполеона»» — сравнение, а не часы.', tech: 'Относительная единица размера истории: объём, сложность, неясность. Не переводится в часы напрямую; скорости разных команд в пунктах несравнимы.' },
      { term: 'Скорость команды (velocity)', simple: 'Сколько тортов в среднем бригада успевает за две недели.', tech: 'Сколько пунктов команда закрывает за спринт. Используется для планирования и прогноза диапазоном; превращение скорости в норму ведёт к «инфляции» оценок.' }
    ],
    outro: 'Scrum — это 3 зоны ответственности, 5 событий и 3 артефакта с обязательствами. Всё остальное — Definition of Ready, покер, сторипоинты, работа на спринт вперёд — практики команд, и о них честно спорят. Аналитик — один из разработчиков: держит истории готовыми на спринт-два вперёд, но уточняет их вместе с командой, отвечает на вопросы в тот же день и приводит на обзор того, кто решает. Завтра — февраль: пилот запущен, и работа превращается в поток заявок. Там спринты неудобны — поговорим про Kanban.',
    tasks: [howFrame, howSprint, howEstimate, frameTask, labTask, goalTask, analystTask]
  });
})();
