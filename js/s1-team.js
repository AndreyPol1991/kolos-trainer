/* Неделя 1, вторник 10:00 — «Команда разработки».
   Теория: карта команды (кто чем занят, что ждёт от аналитика, живые реплики при плохом и хорошем аналитике),
   путь задачи через команду («через забор» против «трёх амиго»), RACI на пальцах (матрица с поломками).
   Практика: кому адресовать вопрос или артефакт; разметка черновика «кому это помешает»;
   лаборатория «аналитик выпал»; RACI запуска пилота предзаказа; ответ Нине «зачем мне аналитик». */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;

  if (!document.getElementById('team-css')) document.head.insertAdjacentHTML('beforeend', `<style id="team-css">
    .team-root, .team-root .stack > * { min-width: 0; }
    .team-root .seg button { white-space: normal; text-align: left; }
    .team-root .btn { white-space: normal; text-align: left; }
    .team-map { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
    .team-zone { display: grid; gap: 6px; align-content: start; padding: 10px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); min-width: 0; }
    .team-role { display: flex; align-items: center; gap: 8px; width: 100%; text-align: left; border: 1px solid var(--border); background: var(--surface-2); color: var(--text); border-radius: 9px; padding: 7px 9px; font-size: 13.5px; line-height: 1.25; cursor: pointer; min-width: 0; }
    .team-role:hover { border-color: var(--border-strong); }
    .team-role[aria-pressed="true"] { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent); background: var(--accent-soft); }
    .team-role .ic { flex: none; width: 22px; text-align: center; }
    .team-role .nm { min-width: 0; overflow-wrap: break-word; hyphens: auto; }
    .team-role .dot { margin-left: auto; flex: none; width: 7px; height: 7px; border-radius: 50%; background: var(--accent); }
    .team-facts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .team-fact { padding: 10px 12px; border-radius: 10px; background: var(--surface); border: 1px solid var(--border); font-size: 14px; min-width: 0; }
    .team-fact > b { display: block; font-size: 11.5px; text-transform: uppercase; letter-spacing: .05em; color: var(--text-muted); margin-bottom: 4px; }
    .team-fact.need { border-color: color-mix(in srgb, var(--ok) 45%, var(--border)); background: var(--ok-soft); }
    .team-fact.hurt { border-color: color-mix(in srgb, var(--bad) 45%, var(--border)); background: var(--bad-soft); }
    .team-h3 { margin: 2px 0 0; font: 600 18px/1.3 var(--f-brand); }
    .team-raci { overflow-x: auto; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); max-width: 100%; }
    .team-raci table { border-collapse: collapse; width: 100%; font-size: 13px; }
    .team-raci th, .team-raci td { border-bottom: 1px solid var(--border); padding: 6px 5px; text-align: center; vertical-align: middle; }
    .team-raci th { font-weight: 600; font-size: 12px; color: var(--text-2); line-height: 1.2; }
    .team-raci th .sb { font-weight: 400; color: var(--text-muted); font-size: 11px; }
    .team-raci .rl { text-align: left; min-width: 128px; line-height: 1.3; }
    .team-raci tr:last-child td { border-bottom: 0; }
    .team-raci tr.ok td.rl { box-shadow: inset 3px 0 0 var(--ok); }
    .team-raci tr.bad td.rl { box-shadow: inset 3px 0 0 var(--bad); }
    .team-raci tr.warn td.rl { box-shadow: inset 3px 0 0 var(--warn); }
    .team-cell { width: 34px; height: 30px; border-radius: 7px; border: 1px dashed var(--border-strong); background: transparent; font: 700 14px/1 var(--f-mono); color: var(--text-muted); cursor: pointer; padding: 0; }
    .team-cell[data-v="R"] { border: 1px solid var(--info); background: var(--info-soft); color: var(--info); }
    .team-cell[data-v="A"] { border: 1px solid var(--accent); background: var(--accent-soft); color: var(--accent); }
    .team-cell[data-v="C"] { border: 1px solid var(--warn); background: var(--warn-soft); color: var(--warn); }
    .team-cell[data-v="I"] { border: 1px solid var(--border-strong); background: var(--surface-3); color: var(--text-2); }
    .team-cell:disabled { cursor: default; }
    .team-legend { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
    .team-legend .card { gap: 4px; font-size: 13.5px; align-content: start; }
    .team-legend .lt { font: 700 20px/1 var(--f-mono); }
    .team-doc { padding: 16px 18px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); font-size: 15px; line-height: 2; }
    .team-doc h4 { margin: 0 0 6px; font: 600 15px/1.4 var(--f-brand); }
    .team-doc p { margin: 0 0 8px; }
    .team-doc .lbl { color: var(--text-muted); font-size: 13px; text-transform: uppercase; letter-spacing: .05em; margin-right: 4px; }
    .team-frag { color: var(--text); background: var(--surface-3); border-bottom: 2px dashed var(--border-strong); border-radius: 4px; padding: 2px 4px; cursor: pointer; -webkit-box-decoration-break: clone; box-decoration-break: clone; }
    .team-frag:hover, .team-frag:focus-visible { background: var(--accent-soft); outline: none; }
    .team-frag.cur { outline: 2px solid var(--accent); background: var(--accent-soft); }
    .team-frag.set { border-bottom-style: solid; border-bottom-color: var(--info); }
    .team-frag.ok { border-bottom: 2px solid var(--ok); background: var(--ok-soft); }
    .team-frag.bad { border-bottom: 2px solid var(--bad); background: var(--bad-soft); }
    .team-frag.warn { border-bottom: 2px solid var(--warn); background: var(--warn-soft); }
    .team-frag.ro { cursor: default; }
    .team-tag { display: inline-block; margin: 0 2px 0 4px; padding: 0 7px; border-radius: 99px; font-size: 11.5px; line-height: 1.7; background: var(--info-soft); color: var(--info); vertical-align: 1px; white-space: nowrap; }
    .team-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .team-chips .chip { cursor: pointer; white-space: normal; text-align: left; }
    .team-chips .chip[aria-pressed="true"] { border-color: var(--accent); color: var(--text); background: var(--accent-soft); }
    .team-pipe { display: grid; gap: 8px; }
    .team-step { display: grid; grid-template-columns: 28px minmax(0, 1fr); gap: 10px; padding: 10px 12px; border: 1px solid var(--border); border-left-width: 4px; border-radius: 10px; background: var(--surface); }
    .team-step.ok { border-left-color: var(--ok); }
    .team-step.warn { border-left-color: var(--warn); }
    .team-step.bad { border-left-color: var(--bad); }
    .team-step .ttl { font-weight: 600; font-size: 14px; }
    .team-step ul { margin: 4px 0 0; padding-left: 18px; display: grid; gap: 4px; font-size: 13.5px; }
    .team-step li.plant::marker { content: "⚑ "; color: var(--warn); }
    .team-step li.found::marker { content: "✗ "; color: var(--bad); }
    .team-step li.found b { color: var(--bad); }
    .team-picks { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .team-pick { display: grid; grid-template-columns: 20px minmax(0, 1fr); gap: 8px; align-items: start; padding: 10px 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); cursor: pointer; text-align: left; color: var(--text); font-size: 14px; }
    .team-pick[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .team-pick:disabled { opacity: .5; cursor: not-allowed; }
    .team-pick .bx { width: 18px; height: 18px; border-radius: 5px; border: 2px solid var(--border-strong); margin-top: 2px; }
    .team-pick[aria-pressed="true"] .bx { background: var(--accent); border-color: var(--accent); }
    .team-pick .d { font-size: 12.5px; color: var(--text-2); }
    .team-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
    .team-stats .v { font-size: 16px; overflow-wrap: anywhere; }
    .team-sum { display: grid; gap: 6px; }
    @media (max-width: 860px) { .team-map { grid-template-columns: repeat(2, minmax(0, 1fr)); } .team-legend { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 760px) { .team-picks { grid-template-columns: minmax(0, 1fr); } .team-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 560px) {
      .team-facts { grid-template-columns: minmax(0, 1fr); }
      .team-raci th, .team-raci td { padding: 5px 2px; }
      .team-raci .rl { min-width: 104px; font-size: 12.5px; padding-left: 6px; }
      .team-raci th { font-size: 11px; }
      .team-raci thead th:not(.rl) { writing-mode: vertical-rl; transform: rotate(180deg); white-space: nowrap; text-align: left; vertical-align: bottom; padding: 6px 2px; }
      .team-raci thead th:not(.rl) .sb { display: none; }
      .team-raci thead th.rl { vertical-align: bottom; }
      .team-cell { width: 28px; height: 28px; font-size: 13px; }
      .team-doc { padding: 12px; font-size: 14.5px; }
      .team-zone { padding: 8px; }
      .team-role { font-size: 13px; padding: 6px 7px; gap: 6px; }
      .team-role .ic { display: none; }
    }
  </style>`);

  // ---------- общие помощники ----------
  const L = (id, t, sub) => ({ id, t, sub });
  const quizRef = cfg => cfg.options.map((o, i) => o.ok ? i : -1).filter(i => i >= 0);
  const plainT = s => String(s || '').replace(/<[^>]+>/g, '');

  // пошаговые сценарии на ui.seq с переключателем вариантов
  function walk(el, cfg) {
    let cur = cfg.scenarios[0].id;
    el.innerHTML = `<div class="stack">${cfg.scenarios.length > 1 ? `<div class="row"><span class="small dim">Вариант:</span>${ui.seg('wk', cfg.scenarios.map(s => ({ v: s.id, t: s.t })), cur, 'accent')}</div>` : ''}<div data-w></div><div data-sum></div></div>`;
    const box = TR.$('[data-w]', el), sum = TR.$('[data-sum]', el);
    function show(id) {
      cur = id; const sc = cfg.scenarios.find(s => s.id === id);
      box.innerHTML = ''; sum.innerHTML = '';
      const d = document.createElement('div'); box.appendChild(d);
      ui.seq(d, { lanes: sc.lanes, steps: sc.steps, title: sc.t, laneW: cfg.laneW || 150, hint: 'Нажимайте «Шаг →» и читайте пояснение под схемой.', onEnd() { sum.innerHTML = sc.sum ? ui.note(sc.sumKind || '', 'Итог', sc.sum) : ''; } });
    }
    ui.onSeg(el, (n, v) => { if (n === 'wk') show(v); });
    show(cur);
  }

  // реплики: [{who, html}] — who='sys' рисуется плашкой без персонажа
  const talk = lines => `<div class="talk">${lines.map(x => x.who === 'sys' ? ui.note(x.k || '', x.title || '', x.html) : ui.say(x.who, x.html)).join('')}</div>`;

  // =====================================================================
  // Теория 1. Карта команды (соседний пример: учёт списаний в планшете)
  // =====================================================================
  const ZONES = [
    { id: 'biz', t: 'Бизнес и деньги' },
    { id: 'an', t: 'Анализ и дизайн' },
    { id: 'dev', t: 'Разработка' },
    { id: 'ops', t: 'Качество и эксплуатация' }
  ];
  const ROLES = [
    {
      id: 'po', z: 'biz', ico: '👑', t: 'Владелец продукта', en: 'Product Owner, заказчик',
      kolos: 'Нина Сергеевна. Ежедневные вопросы она передаёт Павлу (пекарни) и Галине Ивановне (цех).',
      big: 'Отдельный человек от бизнеса; бывает, что один владелец продукта на несколько команд.',
      does: 'Решает, что важнее, и принимает результат. Платит и отвечает за то, чтобы продукт был нужен бизнесу.',
      out: 'Решения о приоритетах, «да» или «нет» на демо, подпись под объёмом работ',
      needs: 'Понятные варианты с ценой и последствиями, ясные вопросы, итоги встреч письменно',
      hurts: 'Вопросы про таблицы, жаргон, «а как вы хотите?» без вариантов',
      bad: [{ who: 'me', html: 'Нина Сергеевна, какие поля нужны в таблице списаний и какой у них тип данных?' }, { who: 'nina', html: 'Я не знаю, что такое «тип данных». Мне надо понять, сколько мы выбрасываем! Вы же специалисты.' }],
      good: [{ who: 'me', html: 'Можно сделать два варианта. Первый: кассир вносит, сколько не продали, — вы утром видите итог по каждой пекарне. Второй: ещё и причину — не продали, брак, отдали в приют. Второй дольше и дороже, зато видно, <i>почему</i> выбрасываем. Какой важнее к весне?' }, { who: 'nina', html: 'Второй! Мне как раз надо понять почему. Пришлите это письмом — покажу Галине Ивановне.' }]
    },
    {
      id: 'pm', z: 'biz', ico: '📅', t: 'Руководитель проекта', en: 'Project Manager, PM',
      kolos: 'Игорь из «Квант Софт».', big: 'Руководитель проекта или программы; на больших проектах ему помогают администраторы проекта.',
      does: 'Отвечает за сроки, бюджет, риски и договор. Планирует, кто что и когда делает, держит заказчика в курсе.',
      out: 'План и график, оценка, отчёты о статусе, договор и дополнительные соглашения',
      needs: 'Оценимый объём, риски в требованиях, влияние каждого изменения на сроки и деньги',
      hurts: '«Ещё одна маленькая хотелка» без анализа влияния',
      bad: [{ who: 'me', html: 'Нина ещё хочет причины списаний. Я уже сказал разработчикам — там мелочь.' }, { who: 'igor', html: 'Стоп. Какая мелочь? Это справочник причин, поле на экране, колонка в отчёте. Сколько дней? Что сдвигаем? В договоре этого нет.' }],
      good: [{ who: 'me', html: 'Нина просит причины списаний: справочник, поле на экране и колонка в отчёте. Дима прикинул — плюс несколько дней. Варианты: сдвинуть другую задачу или взять в следующий спринт.' }, { who: 'igor', html: 'Вот с этим можно идти к Нине. Подготовлю ей два варианта по срокам.' }]
    },
    {
      id: 'product', z: 'biz', ico: '📈', t: 'Продакт-менеджер', en: 'Product Manager',
      kolos: 'Отдельного продакта нет: ценность и метрики определяет Нина вместе с Ритой.',
      big: 'Отдельная роль в продуктовых компаниях: исследует пользователей, ставит гипотезы, следит за метриками.',
      does: 'Отвечает за ценность продукта: какие проблемы пользователей решаем и по каким цифрам поймём, что получилось.',
      out: 'Гипотезы, метрики, план развития продукта',
      needs: 'Связь каждого требования с метрикой и целью',
      hurts: 'Требования без «зачем»',
      bad: [{ who: 'me', html: 'Делаем справочник причин списаний: брак, не продали, на корм.' }, { who: 'rita', html: 'А зачем? Какую цифру мы этим сдвинем? Я не смогу объяснить Нине, что это даст.' }],
      good: [{ who: 'me', html: 'Причины нужны для цели Нины — снизить списания с 12 % до 7 % за год. Через месяц увидим, что выбрасываем больше всего, и поправим план выпечки.' }, { who: 'rita', html: 'О, понятно! Беру эту цифру себе — буду смотреть каждую неделю.' }]
    },
    {
      id: 'ba', z: 'an', ico: '🗺️', t: 'Бизнес-аналитик', en: 'Business Analyst',
      kolos: 'На обследовании эту работу делает Ксения: процессы «Колоса», цели, потребности.',
      big: 'Часто отдельный человек на стороне заказчика или в консалтинге.',
      does: 'Изучает бизнес: процессы, цели, проблемы и потребности. Отвечает на вопрос «что и зачем нужно бизнесу».',
      out: 'Процессы «как есть» и «как будет», бизнес-требования, цели',
      needs: 'Смежная роль: системный аналитик продолжает его работу «внутрь системы»',
      hurts: 'Экраны и таблицы без понимания процесса',
      bad: [{ who: 'me', html: 'Ксения, процессы — это ваше. Мне бы сразу экраны.' }, { who: 'ksenia', html: 'Экраны без процесса — гадание. Кто вносит списания, когда и зачем — от этого зависят и поля, и правила.' }],
      good: [{ who: 'me', html: 'Я прочитал ваше описание процесса списаний. Вопрос: кто подтверждает списание — кассир или управляющий?' }, { who: 'ksenia', html: 'Хороший вопрос, в описании его нет. Спросим Павла вместе.' }]
    },
    {
      id: 'sa', z: 'an', ico: '🧭', t: 'Системный аналитик', en: 'System Analyst',
      kolos: 'Ксения (ведущий аналитик) и вы (младший).', big: 'Несколько аналитиков, у каждого своя часть системы или своя команда.',
      does: 'Переводит потребности бизнеса в требования к системе: сценарии, правила, данные, интеграции, критерии приёмки. Отвечает команде на вопросы.',
      out: 'Требования и спецификации, сценарии, модели данных, критерии приёмки',
      needs: 'Это вы. От остальных вам нужны ответы, решения и обратная связь',
      hurts: '—',
      bad: [{ who: 'ksenia', html: 'Посмотрите на остальные роли: у каждого свой список того, что он ждёт от вас. Если кто-то додумывает за бизнес сам — значит, мы ему чего-то не дали.' }],
      good: [{ who: 'ksenia', html: 'Ваша работа — чтобы никто в команде не додумывал за бизнес. Каждому — своё: Нине варианты, Игорю влияние, Соне сценарии, Диме цифры, Лере критерии.' }]
    },
    {
      id: 'design', z: 'an', ico: '🎨', t: 'Дизайнер интерфейсов', en: 'UX/UI-дизайнер',
      kolos: 'Соня, на полставки: приложение покупателя и экран кассира.', big: 'Отдел дизайна: исследователи пользователей, дизайнеры интерфейсов, авторы текстов.',
      does: 'Придумывает, как человек будет пользоваться системой: пути, экраны, кнопки, тексты.',
      out: 'Пользовательские пути, макеты экранов, прототипы',
      needs: 'Сценарии, роли, данные на экране, все состояния (пусто, ошибка, загрузка), ограничения',
      hurts: '«Нарисуй кнопку» без сценария и без крайних случаев',
      bad: [{ who: 'me', html: 'Соня, нарисуй экран списаний: таблица и кнопка «Сохранить».' }, { who: 'sonya', html: 'А кто им пользуется — кассир или управляющий? Что видит человек, если списаний сегодня нет? А если планшет потерял связь?' }],
      good: [{ who: 'me', html: 'Сценарий: кассир в конце смены вносит, что не продано. Состояния: списаний нет; сохраняется; нет связи — запись хранится на планшете и уйдёт позже; ошибка. Данные: товар, количество, причина.' }, { who: 'sonya', html: 'По такому можно рисовать. Завтра покажу черновик — посмотрите, все ли состояния на месте?' }]
    },
    {
      id: 'lead', z: 'dev', ico: '🏗️', t: 'Тимлид и архитектор', en: 'Team Lead, Architect',
      kolos: 'Дима: и ведёт разработчиков, и решает, как устроена система.', big: 'Архитектор — отдельный человек на несколько команд, у каждой команды свой тимлид.',
      does: 'Решает, как устроена система и на чём её делать. Оценивает работу, распределяет задачи, следит за качеством кода.',
      out: 'Архитектура, выбор технологий, оценка задач, проверка кода коллег',
      needs: 'Функциональные и нефункциональные требования в цифрах, интеграции, данные',
      hurts: 'Готовое решение вместо требования («сделайте на Kafka»)',
      bad: [{ who: 'me', html: 'Дима, списания сделай на Kafka — я читал, что так правильно.' }, { who: 'dima', html: 'А зачем там Kafka? Сколько записей в день, кто их потом читает, что будет без связи? Дайте требования — решение я подберу сам.' }],
      good: [{ who: 'me', html: 'Девять пекарен вносят списания раз в день, в конце смены. Бухгалтерии нужна сводка раз в день. Без связи планшет хранит записи и отправляет, когда связь появится.' }, { who: 'dima', html: 'Нагрузка маленькая — обойдёмся без лишнего. А работу без связи оценю отдельно. Напишите критерии приёмки — оценю в сторипоинтах.' }]
    },
    {
      id: 'front', z: 'dev', ico: '🖥️', t: 'Фронтенд-разработчик', en: 'Frontend',
      kolos: 'В команде Димы два разработчика; на небольшом проекте один человек часто делает и фронтенд, и бэкенд.', big: 'Отдельная группа: веб-интерфейсы, экраны в браузере.',
      does: 'Делает то, что человек видит и нажимает в браузере: экраны, формы, кнопки, сообщения об ошибках.',
      out: 'Код экранов: экран кассира, сайт',
      needs: 'Однозначные спецификации экранов: поля, правила проверки, тексты ошибок, состояния',
      hurts: 'Размытые задачи, меняющиеся на ходу требования',
      bad: [{ who: 'me', html: 'Поле «количество» — ну, какое-нибудь число.' }, { who: 'dima', html: 'Целое? До скольких? Что пишем, если ввели ноль? Без этого фронтенд будет угадывать, а Лера потом вернёт.' }],
      good: [{ who: 'me', html: 'Количество — целое число от 1 до 99. Ноль или пусто — кнопка «Сохранить» неактивна, подсказка «Укажите количество».' }, { who: 'dima', html: 'Понятно, берём в работу.' }]
    },
    {
      id: 'back', z: 'dev', ico: '⚙️', t: 'Бэкенд-разработчик', en: 'Backend',
      kolos: 'Та же команда Димы.', big: 'Отдельные команды на разные части серверной логики.',
      does: 'Делает «кухню, которую клиент не видит»: правила, расчёты, хранение данных, связи с другими системами.',
      out: 'Серверная часть, база данных, API, интеграции',
      needs: 'Правила и крайние случаи, ответы на вопросы в течение дня',
      hurts: 'Правила, которые знает только заказчик в голове; ответы через неделю',
      bad: [{ who: 'dima', html: 'Мы спросили в понедельник: можно ли исправить списание после того, как оно ушло в отчёт? Ответа нет до сих пор. Разработчик сделал «нельзя» — надеемся, угадал.' }],
      good: [{ who: 'me', html: 'Уточнил у Павла: исправить можно в тот же день, потом — только управляющий. Дописал в критерии приёмки.' }, { who: 'dima', html: 'Через час после вопроса — отлично. Делаем, Лера уже видит критерий.' }]
    },
    {
      id: 'mobile', z: 'dev', ico: '📱', t: 'Мобильный разработчик', en: 'iOS, Android',
      kolos: 'Приложение покупателя для iOS и Android делает команда Димы.', big: 'Отдельные люди или команды на iOS и на Android.',
      does: 'Делает приложение для телефона: экраны, уведомления, работу при плохой связи, обновления в магазинах приложений.',
      out: 'Приложения для iOS и Android',
      needs: 'Сценарии с учётом телефона: плохая связь, уведомления, разные экраны, старые версии приложения',
      hurts: 'Требования «как на сайте» без особенностей телефона',
      bad: [{ who: 'dima', html: 'В требованиях просто «как на сайте». А если связь пропала посреди оформления? Уведомление нужно? Мобильной части это надо знать до начала работы.' }],
      good: [{ who: 'dima', html: 'Есть отдельный раздел: что видит человек без связи и какие уведомления приходят. Мобильную часть оценили без сюрпризов.' }]
    },
    {
      id: 'qa', z: 'ops', ico: '🧪', t: 'Тестировщик', en: 'QA, Quality Assurance',
      kolos: 'Лера.', big: 'Отдел тестирования: ручные тестировщики и автоматизаторы.',
      does: 'Проверяет, что сделано то, что нужно, и ничего не сломалось. Ищет, где система ведёт себя не так, как обещано.',
      out: 'Тест-кейсы, отчёты о дефектах, отчёт о тестировании',
      needs: 'Проверяемые требования, критерии приёмки, граничные значения, ожидаемый результат',
      hurts: '«Быстро», «удобно», «и т. д.» — проверить невозможно',
      bad: [{ who: 'me', html: 'Списания вносятся быстро и удобно.' }, { who: 'lera', html: 'Как мне это проверить? «Быстро» — это сколько? А если внесут ноль? А минус три батона?' }],
      good: [{ who: 'me', html: 'Кассир вносит списание не больше чем за 3 нажатия; количество — от 1 до 99; ноль и пусто не сохраняются.' }, { who: 'lera', html: 'Проверю 0, 1, 99 и 100. А что видит кассир при 100 — подсказку или ошибку? Допишем?' }]
    },
    {
      id: 'devops', z: 'ops', ico: '🛠️', t: 'DevOps-инженер', en: 'DevOps, эксплуатация',
      kolos: 'Отдельного человека на проекте нет.', big: 'Команда эксплуатации: серверы, выкатка, мониторинг, дежурства.',
      does: 'Следит, чтобы система была развёрнута и работала: серверы, выкатка новых версий, мониторинг, резервные копии.',
      out: 'Настроенные серверы, автоматическая выкатка, мониторинг и оповещения',
      needs: 'Окна обслуживания, требования к доступности',
      hurts: 'Нет цифр: когда можно выключать систему и сколько простоя допустимо',
      bad: [{ who: 'sys', k: 'bad', title: 'В требованиях', html: '«Система работает всегда и без сбоев». Когда же её обновлять? Ночью? А если цех начинает работу затемно?' }],
      good: [{ who: 'sys', k: 'ok', title: 'В требованиях', html: '«Обновлять только ночью, когда кассы и цех не работают; приём заказов недоступен не больше нескольких часов в месяц». По такому можно планировать выкатки и дежурства.' }]
    },
    {
      id: 'support', z: 'ops', ico: '🎧', t: 'Поддержка', en: 'Support',
      kolos: 'Появится после пилота: сопровождение по Kanban — заявки от пекарен, ошибки, мелкие доработки.', big: 'Первая линия отвечает пользователям, вторая разбирает сложные случаи, третья — разработчики.',
      does: 'Принимает обращения пользователей: «не работает», «как сделать», «нашёл ошибку». Решает сам или передаёт команде.',
      out: 'Ответы пользователям, заявки на исправление, база известных проблем',
      needs: 'Инструкции, известные ограничения',
      hurts: 'Ограничения, о которых знает только аналитик',
      bad: [{ who: 'sys', k: 'bad', title: 'Заявка', html: 'Кассир: «Планшет не сохраняет списание!» Поддержка не знает, что без связи запись хранится на планшете и уйдёт позже, — заводит срочную ошибку, разработчиков срывают с задач.' }],
      good: [{ who: 'sys', k: 'ok', title: 'Заявка', html: 'В памятке есть: «Без связи значок облака серый — запись сохранится и уйдёт сама». Поддержка отвечает кассиру за минуту.' }]
    }
  ];

  const howMap = {
    id: 'how-map', covers: ['who-asks', 'draft'], title: 'Как это работает: карта команды', free: true, noReset: true,
    simple: {
      icon: '🧑‍🍳',
      plain: 'Систему делает не один программист, а команда. У каждого своя часть работы — и каждому от аналитика нужно своё.',
      analogy: 'Пекарня перед праздником. Нина Сергеевна решает, что печь. Управляющий следит, чтобы успели и уложились в деньги. Технолог пишет техкарту с граммами — это работа аналитика. Пекари пекут по техкарте — разработчики. Дегустатор сверяет торт с заказом — тестировщик. Оформитель витрины думает, как покупатель найдёт торт, — дизайнер. Печник следит, чтобы печь работала, и чинит её ночью — DevOps. Кассир принимает жалобы — поддержка. Ошибка в техкарте — и все остальные работают зря.',
      tech: 'Типичные роли: владелец продукта (Product Owner), руководитель проекта (PM), продакт-менеджер, бизнес- и системный аналитики, дизайнер (UX/UI), архитектор и тимлид, разработчики (фронтенд, бэкенд, мобильные), тестировщик (QA), DevOps, поддержка. <b>Роль — не должность</b>: в маленькой команде один человек держит две-три роли (у «Колоса» Дима — и тимлид, и архитектор). В Scrum Guide 2020 зон ответственности всего три — Product Owner, Scrum Master и Developers; аналитик входит в Developers.'
    },
    lead: ui.brief({
      situation: 'Соседний пример — будущая функция «Учёт списаний в планшете»: кассир в конце смены вносит, что не продали, а Нина Сергеевна видит, сколько выбрасывают. Над ней работает вся команда. Тринадцать ролей разложены по четырём зонам.',
      todo: [
        'Нажимайте на роли по очереди. Для каждой прочитайте: чем занят человек, что он выдаёт и что ждёт от аналитика.',
        'Переключатель «Аналитик принёс»: сравните, что слышит роль от плохого и от хорошего аналитика, и с каким вопросом человек приходит в ответ.',
        'Переключатель «Где»: как роль выглядит в команде «Колоса» и в большой компании.'
      ],
      look: 'Зелёная плашка — что роль ждёт от аналитика, красная — чем ей мешает плохой аналитик. Точка справа у роли — вы её уже открыли. Названия и границы ролей в разных компаниях разные — здесь так, как принято в «Квант Софт».'
    }),
    render(el) {
      el.classList.add('team-root');
      const st = { sel: 'qa', mode: 'bad', lens: 'kolos', seen: new Set(['qa']) };
      el.innerHTML = `<div class="stack">
        <div class="row"><span class="small dim">Где:</span>${ui.seg('lens', [{ v: 'kolos', t: 'в «Колосе»' }, { v: 'big', t: 'в большой компании' }], st.lens)}<span class="small dim" data-cnt></span></div>
        <div class="team-map" data-map></div>
        <div data-detail></div>
        ${ui.note('info', 'Позиция аналитика', 'К аналитику приходят с вопросами все — от Нины до Леры. Он не решает за них, а приносит каждому то, без чего тот будет додумывать за бизнес. Поэтому первое, что делает новичок в проекте, — узнаёт команду в лицо: кто что решает, к кому с каким вопросом идти и кому какой артефакт нужен.')}
      </div>`;
      function drawMap() {
        TR.$('[data-map]', el).innerHTML = ZONES.map(z => `<div class="team-zone"><div class="eyebrow">${esc(z.t)}</div>${ROLES.filter(r => r.z === z.id).map(r => `<button type="button" class="team-role" data-role="${r.id}" aria-pressed="${st.sel === r.id}"><span class="ic" aria-hidden="true">${r.ico}</span><span class="nm">${esc(r.t)}</span>${st.seen.has(r.id) ? '<span class="dot" title="Уже открыта"></span>' : ''}</button>`).join('')}</div>`).join('');
        TR.$('[data-cnt]', el).textContent = `Открыто ролей: ${st.seen.size} из ${ROLES.length}`;
      }
      function drawDetail() {
        const r = ROLES.find(x => x.id === st.sel), z = ZONES.find(x => x.id === r.z);
        TR.$('[data-detail]', el).innerHTML = `<div class="card">
          <div><div class="eyebrow">${esc(z.t)}</div><h3 class="team-h3">${r.ico} ${esc(r.t)} <span class="small dim" style="font-weight:400">· ${esc(r.en)}</span></h3></div>
          <div class="small"><b>${st.lens === 'kolos' ? 'В «Колосе»' : 'В большой компании'}:</b> ${r[st.lens]}</div>
          <div class="team-facts">
            <div class="team-fact"><b>Чем занят</b>${r.does}</div>
            <div class="team-fact"><b>Что выдаёт</b>${r.out}</div>
            <div class="team-fact need"><b>Что ждёт от аналитика</b>${r.needs}</div>
            <div class="team-fact hurt"><b>Чем мешает плохой аналитик</b>${r.hurts}</div>
          </div>
          <div class="row"><span class="small dim">Аналитик принёс:</span>${ui.seg('mode', [{ v: 'bad', t: 'плохо' }, { v: 'good', t: 'хорошо' }], st.mode, 'accent')}</div>
          ${talk(r[st.mode])}
        </div>`;
      }
      TR.on(el, 'click', '[data-role]', (e, b) => { st.sel = b.dataset.role; st.seen.add(st.sel); drawMap(); drawDetail(); });
      ui.onSeg(el, (n, v) => { if (n === 'mode' || n === 'lens') { st[n] = v; drawDetail(); } });
      drawMap(); drawDetail();
    }
  };

  // =====================================================================
  // Теория 2. Путь задачи через команду (соседний пример: «Повторить прошлый заказ»)
  // =====================================================================
  const PATH_LANES = [L('nina', 'Нина', 'владелец'), L('igor', 'Игорь', 'PM'), L('an', 'Аналитик', 'вы'), L('sonya', 'Соня', 'дизайн'), L('dev', 'Разработка', 'Дима и команда'), L('lera', 'Лера', 'QA')];
  const howPath = {
    id: 'how-path', covers: ['no-analyst', 'why-analyst'], title: 'Как это работает: путь задачи через команду', free: true, noReset: true,
    simple: {
      icon: '🛤️',
      plain: 'Задача идёт по команде как эстафетная палочка: идея → требование → макет → код → проверка → показ заказчику. Ломается чаще всего не работа, а передача.',
      analogy: 'Заказ торта без записи: кассир передал кондитеру устно, кондитер — оформителю. Про аллергию на орехи узнали, когда торт уже обсыпали орехами. А можно до начала собрать у доски троих — кассира, кондитера и оформителя — и за пять минут прочитать заказ вместе.',
      tech: '<b>Передача «через забор»</b> (handoff) — каждый получает результат предыдущего и работает в одиночку, вопросы всплывают на следующем шаге. <b>Три амиго</b> — аналитик (или владелец продукта), разработчик и тестировщик обсуждают задачу до разработки: зачем, как сделать, как проверить. Рядом — <b>уточнение бэклога</b> (refinement) и <b>Definition of Ready</b>: задача готова к работе, когда команда понимает, что делать и как проверить.'
    },
    lead: ui.brief({
      situation: 'Соседний пример — функция «Повторить прошлый заказ» из списка «можно, если останется время». Нина Сергеевна: «Постоянные берут одно и то же — пусть заказывают в одно касание». Задача проходит через всю команду. Два варианта: аналитик пишет постановку один и передаёт дальше — или до разработки собирает «трёх амиго».',
      todo: [
        'Вариант «Через забор»: нажимайте «Шаг →» и читайте пояснение под схемой. Найдите момент, где всплывают вопросы.',
        'Вариант «Три амиго»: пройдите так же. Кто задаёт те же вопросы — и когда?',
        'Сравните итоги: сколько дней и откуда взялась переделка.'
      ],
      look: 'Колонки — участники, стрелка — передача задачи или вопрос, пунктир — ответ, плашка через колонки — встреча или итог. Числа дней — модель для учёбы, а не замер.'
    }),
    render(el) {
      el.classList.add('team-root');
      walk(el, {
        laneW: 140,
        scenarios: [
          {
            id: 'fence', t: 'Через забор', lanes: PATH_LANES, sumKind: 'bad',
            sum: 'Каждый в цепочке честно сделал свою часть. Сломалась передача: вопросы задали слишком поздно, когда ответы уже стоили переделки.',
            steps: [
              { from: 'nina', to: 'igor', t: 'хочу «повторить\nпрошлый заказ»', note: 'Нина Сергеевна на встрече: «Постоянные берут одно и то же. Хочу кнопку „как в прошлый раз“». Пока это <b>хотелка</b> — идея решения, а не требование.' },
              { from: 'igor', to: 'an', t: 'разберись и оцени', note: 'Игорь передаёт задачу аналитику: прежде чем обещать срок, нужно понять, что именно делаем.' },
              { from: 'an', to: 'an', t: 'пишет постановку\nв одиночку', kind: 'warn', note: 'Аналитик пишет постановку сам, ни с кем не обсуждая. Кажется, так быстрее.' },
              { from: 'an', to: 'dev', t: 'постановка\n«через забор»', kind: 'warn', note: 'Постановку отдают разработчикам, и аналитик считает свою работу законченной. Так и говорят: «перекинуть через забор».' },
              { from: 'dev', to: 'dev', t: '6 дней кода:\n«нет товара — пропустим»', kind: 'bad', note: 'Разработчики встречают вопрос, которого нет в постановке: «а если одного товара сегодня нет?». Обсудить не с кем — решают сами: молча пропустить его.' },
              { from: 'dev', to: 'lera', t: 'готово, проверяй', note: 'Готовую функцию отдают Лере. Она видит задачу впервые.' },
              { from: 'lera', to: 'an', t: 'а если круассанов нет?\nа если цена выросла?', kind: 'warn', note: 'Лера сразу задаёт вопросы, которые надо было задать до разработки. Сейчас ответы стоят дороже: код уже написан.' },
              { from: 'an', to: 'nina', t: 'уточняет', note: 'Аналитик идёт к Нине. Ответ: «Молча нельзя! Предупредить клиента и предложить замену».' },
              { from: 'an', to: 'dev', t: 'переделать', kind: 'bad', note: 'Разработчики переделывают то, что уже сделали. Соне приходится дорисовывать экран, которого не было.' },
              { from: 'nina', to: 'lera', t: 'Итог: 12 дней, из них 3 — переделка', box: true, kind: 'bad', note: 'Задача прошла через всех, но вопросы всплыли в конце. Каждый шаг назад — потерянные дни.' }
            ]
          },
          {
            id: 'amigos', t: 'Три амиго', lanes: PATH_LANES, sumKind: 'ok',
            sum: 'Вопросы те же — но заданы вовремя. Получасовой разговор сэкономил дни переделки. Подробно о трёх амиго и передаче задач — в неделе 5.',
            steps: [
              { from: 'nina', to: 'igor', t: 'хочу «повторить\nпрошлый заказ»', note: 'Та же хотелка Нины Сергеевны.' },
              { from: 'igor', to: 'an', t: 'разберись и оцени', note: 'Та же передача аналитику.' },
              { from: 'an', to: 'nina', t: 'зачем? как часто\nберут одно и то же?', note: 'Аналитик сначала выясняет потребность: кто эти клиенты, что они делают сейчас, что для них важно.' },
              { from: 'an', to: 'lera', t: 'Три амиго: аналитик + разработка + Лера, 30 минут', box: true, kind: 'accent', note: '<b>Три амиго</b> — аналитик, разработчик и тестировщик вместе читают задачу до разработки. Каждый смотрит со своей стороны: зачем, как сделать, как проверить.' },
              { from: 'lera', to: 'an', t: 'а если товара нет?\nа если цена выросла?', kind: 'info', note: 'Те же вопросы Леры — но до разработки. Ответить на них сейчас стоит пару минут.' },
              { from: 'an', to: 'nina', t: 'уточняет', note: 'Нина: «Предупредить клиента и предложить замену». Ответ сразу попадает в критерии приёмки.' },
              { from: 'an', to: 'sonya', t: 'сценарий и все\nсостояния', note: 'Соня получает сценарий со всеми состояниями: товара нет, цена изменилась, прошлых заказов нет.' },
              { from: 'sonya', to: 'dev', t: 'макет', note: 'Макет со всеми состояниями уходит в разработку.' },
              { from: 'dev', to: 'lera', t: 'готово', note: 'Разработка без сюрпризов: ответы уже есть в критериях приёмки.' },
              { from: 'lera', to: 'lera', t: 'проверка по\nкритериям — прошло', kind: 'ok', note: 'Лера проверяет ровно то, о чём договорились на трёх амиго.' },
              { from: 'dev', to: 'nina', t: 'демо', reply: true, kind: 'ok', note: 'В конце спринта функцию показывают Нине. Она принимает.' },
              { from: 'nina', to: 'lera', t: 'Итог: 9 дней, переделки нет', box: true, kind: 'ok', note: 'Тот же объём работы — без шага назад.' }
            ]
          }
        ]
      });
      el.insertAdjacentHTML('beforeend', `<div style="margin-top:12px">${ui.note('info', 'Позиция аналитика', 'Аналитик не «сдаёт постановку и уходит». Он ведёт задачу до приёмки: собирает трёх амиго, отвечает на вопросы в течение дня, помогает Лере отличить баг от нового требования и стоит рядом на демо.')}</div>`);
    }
  };

  // =====================================================================
  // Теория 3. RACI на пальцах (соседний пример: торт к 8 Марта внутри пекарни)
  // =====================================================================
  const CYCLE = ['', 'R', 'A', 'C', 'I'];
  function raciLint(cols, row) {
    const vals = cols.map(c => (row || {})[c.id] || ''), cnt = k => vals.filter(x => x === k).length;
    const A = cnt('A'), R = cnt('R'), C = cnt('C');
    if (!vals.some(Boolean)) return [{ k: 'warn', t: 'строка пустая — никто ничего не делает' }];
    const out = [];
    if (A === 0) out.push({ k: 'bad', t: R ? 'делать есть кому, а отвечать за результат — некому (нет A)' : 'никто не делает и никто не отвечает' });
    if (A > 1) out.push({ k: 'bad', t: `главных (A) — ${A}: каждый думает, что решает он` });
    if (C >= cols.length - 1) out.push({ k: 'warn', t: 'согласовывать почти со всеми — решение будет ждать каждого' });
    if (!out.length) out.push({ k: 'ok', t: R ? 'один отвечает, понятно, кто делает' : 'один отвечает и делает сам — так бывает' });
    return out;
  }
  function raciTable(el, cfg) {
    const v = cfg.value;
    el.innerHTML = `<div class="team-raci"><table><thead><tr><th class="rl">Что делаем</th>${cfg.cols.map(c => `<th>${esc(c.t)}${c.sub ? `<div class="sb">${esc(c.sub)}</div>` : ''}</th>`).join('')}</tr></thead>
      <tbody>${cfg.rows.map(r => `<tr data-row="${r.id}" class="${(cfg.reveal && cfg.reveal[r.id]) || ''}"><td class="rl">${esc(r.t)}</td>${cfg.cols.map(c => { const x = (v[r.id] || {})[c.id] || ''; return `<td><button type="button" class="team-cell" data-r="${r.id}" data-c="${c.id}" data-v="${x}" aria-label="${esc(r.t)} — ${esc(c.t)}: ${x || 'пусто'}" ${cfg.readonly ? 'disabled' : ''}>${x || '·'}</button></td>`; }).join('')}</tr>`).join('')}</tbody></table></div>`;
    if (!cfg.readonly) TR.on(el, 'click', '.team-cell', (e, b) => {
      const r = b.dataset.r, c = b.dataset.c; v[r] = v[r] || {};
      const nx = CYCLE[(CYCLE.indexOf(v[r][c] || '') + 1) % CYCLE.length];
      if (nx) v[r][c] = nx; else delete v[r][c];
      b.dataset.v = nx; b.textContent = nx || '·';
      b.setAttribute('aria-label', b.getAttribute('aria-label').replace(/: [^:]*$/, ': ' + (nx || 'пусто')));
      const tr = b.closest('tr'); if (tr) tr.className = '';
      cfg.onChange && cfg.onChange(v, r);
    });
  }
  const filled = (cols, row) => cols.some(c => (row || {})[c.id]);
  const lintHTML = (cols, rows, v) => {
    const used = rows.filter(r => filled(cols, v[r.id]));
    if (!used.length) return '<div class="small dim">Заполните строки — проверка формата появится здесь.</div>';
    return `<ul class="checks">${used.map(r => raciLint(cols, v[r.id]).map(x => `<li class="${x.k === 'ok' ? '' : x.k}"><b>${esc(r.t)}</b>: ${esc(x.t)}</li>`).join('')).join('')}</ul>${used.length < rows.length ? `<div class="small dim">Заполнено строк: ${used.length} из ${rows.length}.</div>` : ''}`;
  };
  const RACI_LEGEND = `<div class="team-legend">
    <div class="card flat"><span class="lt" style="color:var(--info)">R</span><b>Делает</b><span class="small muted">Responsible — исполнитель, «руки». Может быть несколько.</span></div>
    <div class="card flat"><span class="lt" style="color:var(--accent)">A</span><b>Отвечает</b><span class="small muted">Accountable — с кого спросят и кто принимает работу. <b>Ровно один</b> на строку.</span></div>
    <div class="card flat"><span class="lt" style="color:var(--warn)">C</span><b>Советуемся</b><span class="small muted">Consulted — спрашиваем до решения, разговор в обе стороны.</span></div>
    <div class="card flat"><span class="lt" style="color:var(--text-2)">I</span><b>В курсе</b><span class="small muted">Informed — сообщаем после, в одну сторону.</span></div>
  </div>`;

  const BK_COLS = [L('kassir', 'Кассир'), L('pavel', 'Павел', 'управляющий'), L('galya', 'Галина Ивановна', 'технолог'), L('kond', 'Кондитер'), L('lesha', 'Лёша', 'курьер'), L('nina', 'Нина Сергеевна')];
  const BK_ROWS = [L('take', 'Принять заказ торта'), L('cap', 'Проверить, хватит ли мощности цеха'), L('bake', 'Испечь и оформить торт'), L('ship', 'Отвезти торт клиенту'), L('extra', 'Решить, брать ли торт сверх лимита в праздник')];
  const BK_GOOD = {
    take: { kassir: 'R', pavel: 'A', galya: 'C', kond: 'I' },
    cap: { kassir: 'I', pavel: 'I', galya: 'A', kond: 'C' },
    bake: { pavel: 'I', galya: 'A', kond: 'R', lesha: 'I' },
    ship: { kassir: 'I', pavel: 'A', lesha: 'R' },
    extra: { kassir: 'I', pavel: 'C', galya: 'C', kond: 'I', lesha: 'I', nina: 'A' }
  };
  const BK_BREAKS = [
    { id: 'good', t: 'Как надо', k: 'ok', fix: v => v, story: 'В каждой строке один A, понятно, кто делает, с кем советуются и кого предупредить. Так цех переживает праздник без сорванных тортов.' },
    { id: 'twoA', t: 'Двое главных', k: 'bad', fix: v => { v.extra.galya = 'A'; return v; }, story: 'Нина Сергеевна пообещала клиентке торт сверх лимита, а Галина Ивановна в тот же час отказала. Клиентка получила два разных ответа — и написала об этом во ВКонтакте.' },
    { id: 'noA', t: 'Никто не отвечает', k: 'bad', fix: v => { delete v.ship.pavel; return v; }, story: 'Лёша везёт торты, но за доставку никто не отвечает. Клиент не берёт трубку — Лёша звонит всем подряд: кассиру, технологу, Нине. Решить некому, торт катается по городу.' },
    { id: 'allC', t: 'Согласовать со всеми', k: 'warn', fix: v => { Object.assign(v.take, { pavel: 'A', galya: 'C', kond: 'C', lesha: 'C', nina: 'C' }); return v; }, story: 'Прежде чем принять заказ, кассир обзванивает Павла, Галину Ивановну, кондитера, Лёшу и Нину Сергеевну. Клиентка ждала 20 минут и ушла в соседнюю кондитерскую.' },
    { id: 'noI', t: 'Забыли предупредить', k: 'warn', fix: v => { delete v.bake.lesha; return v; }, story: 'Торт готов в 10:00, но Лёшу не предупредили. Он узнал в 14:00, когда клиентка уже звонила: «Где мой торт?». Таблица выглядит «правильной» — проверка этого не ловит, ловит только здравый смысл.' }
  ];
  const howRaci = {
    id: 'how-raci', covers: ['raci'], title: 'Как это работает: RACI на пальцах', free: true, noReset: true,
    simple: {
      icon: '📋',
      plain: 'RACI — табличка, где для каждого дела записано: кто делает, кто отвечает, с кем советуются и кого просто предупреждают.',
      analogy: 'Доска в цеху перед 8 Марта: «Торт к юбилею: печёт кондитер (делает), за торт отвечает Галина Ивановна (отвечает), про надпись спросить кассира (советуемся), Лёше сказать, когда готово (в курсе)». Когда на доске два «отвечает» — спорят. Когда ни одного — торт стоит.',
      tech: '<b>R</b> (Responsible) — исполнитель, может быть несколько. <b>A</b> (Accountable) — отвечает за результат и принимает работу, <b>ровно один на задачу</b>. <b>C</b> (Consulted) — консультирует до решения. <b>I</b> (Informed) — получает сообщение после. Матрица ответственности пришла из практики управления проектами; к ней вернёмся в неделе 3, когда будем строить карту заинтересованных лиц.'
    },
    lead: ui.brief({
      situation: 'Соседний пример не из ИТ — заказ торта к 8 Марта внутри пекарни. Кто принимает заказ, кто проверяет мощность цеха, кто печёт, кто везёт и кто решает, брать ли торт сверх лимита в праздник. Сейчас таблица заполнена «как надо».',
      todo: [
        'Прочитайте легенду R, A, C, I и таблицу «как надо».',
        'Нажимайте кнопки поломок: «Двое главных», «Никто не отвечает», «Согласовать со всеми», «Забыли предупредить». Читайте, что случилось в цеху.',
        'Пощёлкайте клетки сами: клик меняет букву по кругу (пусто → R → A → C → I). Следите за проверкой под таблицей.'
      ],
      look: 'Строка — действие, столбец — человек. Проверка под таблицей ловит главные ошибки: в строке нет A или их больше одного, согласовывать приходится почти со всеми. Красное — опасно, жёлтое — подозрительно, без пометки — порядок.'
    }),
    render(el) {
      el.classList.add('team-root');
      let v = TR.clone(BK_GOOD), cur = 'good';
      el.innerHTML = `<div class="stack">${RACI_LEGEND}
        <div class="row"><span class="small dim">Поломки:</span><div class="row" data-br></div></div>
        <div data-tbl></div><div data-lint></div><div data-story></div></div>`;
      const drawBtns = () => { TR.$('[data-br]', el).innerHTML = BK_BREAKS.map(b => `<button type="button" class="btn sm ${b.id === 'good' ? '' : 'ghost'}" data-bk="${b.id}" aria-pressed="${cur === b.id}">${esc(b.t)}</button>`).join(''); };
      const drawLint = () => { TR.$('[data-lint]', el).innerHTML = lintHTML(BK_COLS, BK_ROWS, v); };
      function drawStory() {
        const b = BK_BREAKS.find(x => x.id === cur);
        TR.$('[data-story]', el).innerHTML = b ? ui.note(b.k, 'Что случилось в цеху', b.story) : ui.note('', 'Вы правите сами', 'Смотрите на проверку выше. И помните: таблица без ошибок формата ещё не значит, что все нужные люди в курсе.');
      }
      function drawTable() {
        const t = TR.$('[data-tbl]', el); const fresh = document.createElement('div'); t.replaceWith(fresh); fresh.setAttribute('data-tbl', '');
        raciTable(fresh, { cols: BK_COLS, rows: BK_ROWS, value: v, onChange: () => { cur = null; drawBtns(); drawLint(); drawStory(); } });
      }
      TR.on(el, 'click', '[data-bk]', (e, b) => {
        const br = BK_BREAKS.find(x => x.id === b.dataset.bk); cur = br.id;
        v = br.fix(TR.clone(BK_GOOD));
        drawBtns(); drawTable(); drawLint(); drawStory();
      });
      drawBtns(); drawTable(); drawLint(); drawStory();
    }
  };

  // =====================================================================
  // Практика 1. Кому адресовать вопрос или артефакт
  // =====================================================================
  const WHO = [
    { v: 'po', t: 'Нина — владелец продукта' },
    { v: 'pm', t: 'Игорь — PM' },
    { v: 'product', t: 'Продакт (метрики)' },
    { v: 'design', t: 'Соня — дизайнер' },
    { v: 'lead', t: 'Дима — тимлид, архитектор' },
    { v: 'dev', t: 'Разработчики' },
    { v: 'qa', t: 'Лера — QA' },
    { v: 'devops', t: 'DevOps' },
    { v: 'support', t: 'Поддержка' }
  ];
  const ASK = [
    { id: 'prio', t: 'Вопрос: что важнее к 1 марта — торты на заказ или баллы лояльности?', ok: 'po', crit: true, hint: 'Кто в проекте решает, что важнее, и платит за это?', why: 'Приоритеты решает владелец продукта. Аналитик приносит варианты с ценой, но выбирает Нина.' },
    { id: 'cost', t: 'Вопрос: Рита просит баллы в первую версию. Что станет со сроком 1 марта и бюджетом 6 млн ₽?', ok: 'pm', crit: true, alt: { po: 'Решать будет Нина — но с цифрами в руках. Сначала нужно влияние на срок и бюджет, а это зона Игоря.' }, hint: 'Кто отвечает за сроки, бюджет и договор?', why: 'Влияние на сроки и деньги — зона руководителя проекта. С его оценкой идут к Нине за решением.' },
    { id: 'states', t: 'Сценарий «Кассир выдаёт заказ» со всеми состояниями: заказов нет, оплата не прошла, связь пропала', ok: 'design', alt: { dev: 'Разработчикам он тоже нужен — но сначала по нему рисуют экраны.' }, hint: 'Кто придумывает, что человек видит на экране в каждом из этих случаев?', why: 'Дизайнеру нужны сценарии и все состояния — по ним Соня рисует экраны, а не только «счастливый путь».' },
    { id: 'load', t: 'Вопрос: выдержит ли система 400 заказов в час в утренний пик и как связать её с «КассаПро»?', ok: 'lead', hint: 'Кто решает, как устроена система и на чём её делать?', why: 'Нагрузка и интеграции — вопросы архитектуры. Диме нужны цифры от аналитика, а решение — его.' },
    { id: 'tz', t: 'Ответ на вопрос из рабочего чата: по какому времени считать 22:30 — сервера или пекарни? Проверку пишут прямо сейчас', ok: 'dev', alt: { lead: 'Диме тоже стоит знать, но ответа ждёт тот, кто прямо сейчас пишет код.' }, hint: 'Кто ждёт этот ответ, чтобы дописать код сегодня?', why: 'Разработчикам нужны ответы в течение дня — иначе они додумают сами или встанут.' },
    { id: 'edges', t: 'Список проверок на границах: заказ в 22:29, ровно в 22:30 и в 22:31', ok: 'qa', alt: { dev: 'Разработчики по нему тоже сверяются, но в первую очередь это материал для проверки.' }, hint: 'Кому нужны граничные значения и ожидаемый результат, чтобы проверить работу?', why: 'Граничные значения и ожидаемый результат — то, из чего Лера делает тест-кейсы.' },
    { id: 'window', t: 'Требование: обновлять систему только с 01:00 до 02:30, когда закрыты кассы и цех', ok: 'devops', alt: { lead: 'Дима учтёт это в архитектуре, но выкатку и окна обслуживания держит эксплуатация.' }, hint: 'Кто выкатывает новые версии и следит, чтобы система работала?', why: 'Окна обслуживания и доступность нужны эксплуатации, чтобы выкатывать новые версии, не мешая пекарням.' },
    { id: 'memo', t: 'Памятка: что делать, если пропала связь и заказ не виден на экране кассира', ok: 'support', hint: 'К кому придёт кассир, когда что-то не работает?', why: 'Поддержке нужны инструкции и известные ограничения — иначе каждая заявка превращается в расследование.' },
    { id: 'metric', t: 'Вопрос: по какой цифре через год поймём, что предзаказ поднял выручку?', ok: 'product', alt: { po: 'В «Колосе» это действительно Нина — вместе с Ритой. Но вопрос о метрике и гипотезе — работа продакта, кто бы её ни выполнял.' }, hint: 'Чья работа — ценность продукта, гипотезы и метрики?', why: 'Метрики и гипотезы — зона продакта. В «Колосе» её держит Нина вместе с Ритой.' }
  ];
  function askEval(v) {
    v = v || {};
    return ASK.map(r => {
      const got = v[r.id];
      if (got === r.ok) return { r, s: 'ok', pts: 1 };
      if (r.alt && r.alt[got]) return { r, s: 'warn', pts: 0.5 };
      return { r, s: 'bad', pts: 0, empty: !got };
    });
  }
  const whoOf = v => (WHO.find(w => w.v === v) || { t: '—' }).t;
  const askTask = {
    id: 'who-asks', title: 'Кому это нести',
    simple: howMap.simple,
    lead: ui.brief({
      situation: 'Ваша первая неделя на проекте «Колос». В блокноте скопились вопросы и готовые материалы, и каждый надо отнести тому, кто по нему решает или кому он нужен для работы. Нести всё Нине Сергеевне нельзя — у неё пекарни. Нести всё Игорю тоже — он не рисует экраны и не пишет код.',
      todo: [
        'Для каждой из девяти строк выберите в списке, к кому вы с этим пойдёте.',
        'Спрашивайте себя: кто решает? кто это будет делать? кому без этого не начать работу?',
        'Нажмите «Проверить». Засчитывается от 80 %, и две строки — про приоритеты и про влияние на срок — обязательны. Некоторые строки допускают второй ответ: он засчитывается наполовину, с пояснением.'
      ],
      look: 'Роли смотрите в разделе теории «Карта команды». В «Колосе» роли пересекаются: отдельного продакта нет, Дима — и тимлид, и архитектор. Поэтому выбирайте не должность, а того, чья это работа.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(ASK.map(r => [r.id, r.ok])) }),
    render(el, ctx) {
      el.classList.add('team-root');
      let reveal = null;
      if (ctx.result) { reveal = {}; askEval(ctx.ans.v).forEach(x => { reveal[x.r.id] = { s: x.s, why: x.s === 'ok' || ctx.readonly ? x.r.why : (x.s === 'warn' ? x.r.alt[ctx.ans.v[x.r.id]] : x.r.hint) }; }); }
      const box = document.createElement('div'); el.appendChild(box);
      ui.match(box, {
        rows: ASK.map(r => ({ id: r.id, t: esc(r.t) })), choices: WHO, value: ctx.ans.v || {}, reveal, readonly: ctx.readonly, placeholder: 'К кому идём…',
        onChange: v => { ctx.ans.v = v; ctx.save(); }
      });
    },
    check(ans) {
      const ev = askEval(ans && ans.v), pts = ev.reduce((s, x) => s + x.pts, 0), score = pts / ASK.length;
      const critBad = ev.filter(x => x.r.crit && x.s !== 'ok');
      const notes = [];
      ev.forEach(x => {
        if (x.s === 'ok') return;
        if (x.s === 'warn') notes.push({ ok: 'warn', html: `«${esc(x.r.t)}» — ${x.r.alt[(ans.v || {})[x.r.id]]}` });
        else notes.push({ ok: false, html: `«${esc(x.r.t)}» — ${x.empty ? 'не выбрано. ' : ''}${x.r.hint}` });
      });
      if (!notes.length) notes.push({ ok: true, html: 'Все девять — по адресу.' });
      const good = ev.filter(x => x.s === 'ok').length;
      return {
        ok: score >= 0.8 && !critBad.length, score, notes,
        summary: `По адресу: ${good} из ${ASK.length}, допустимо: ${ev.filter(x => x.s === 'warn').length}.`,
        mentor: critBad.length ? 'Начните с главного различия: кто <b>решает, что важнее</b>, и кто <b>считает, во что это обойдётся</b>. Это два разных человека, и к ним ходят в определённом порядке.' : null
      };
    },
    explain: `<p>Аналитик — «диспетчер» вопросов: он знает, кто в команде что решает, и не несёт каждый вопрос Нине. Опорные различия:</p>
      <ul class="checks">
        <li><b>Нина решает, что важнее</b>, а Игорь считает, <b>во что это обойдётся</b> по срокам и деньгам. Сначала влияние — потом решение.</li>
        <li><b>Соне — сценарии и состояния</b>, Диме — <b>требования в цифрах</b> (нагрузка, интеграции), разработчикам — <b>ответы в течение дня</b>, Лере — <b>границы и ожидаемый результат</b>.</li>
        <li><b>DevOps и поддержка</b> вступают в конце, но требования для них пишут заранее: окна обслуживания, памятки, известные ограничения.</li>
      </ul>
      <p>В жизни роли пересекаются: у «Колоса» нет отдельного продакта, а Дима — и тимлид, и архитектор. Поэтому спрашивайте себя не «какая должность», а «чья это работа».</p>`,
    report: ans => askEval(ans && ans.v).map(x => `- ${x.r.t} → ${whoOf((ans.v || {})[x.r.id])} ${x.s === 'ok' ? '✓' : x.s === 'warn' ? '≈' : '✗'}`).join('\n')
  };

  // =====================================================================
  // Практика 2. Разметить черновик: кому эта фраза помешает
  // =====================================================================
  const DR_WHO = [
    { v: 'po', t: 'Нине', full: 'Нине Сергеевне (владелец)' },
    { v: 'pm', t: 'Игорю', full: 'Игорю (PM)' },
    { v: 'design', t: 'Соне', full: 'Соне (дизайн)' },
    { v: 'lead', t: 'Диме', full: 'Диме (тимлид, архитектор)' },
    { v: 'dev', t: 'разработчикам', full: 'разработчикам' },
    { v: 'qa', t: 'Лере', full: 'Лере (QA)' },
    { v: 'none', t: 'всё в порядке', full: 'никому — фраза нормальная' }
  ];
  const DRAFT = [
    { id: 'f1', t: 'Сделать предзаказ быстрым и удобным для всех.', ok: ['qa'], alt: { design: 'Соне тоже нечего рисовать по «удобно», но первой споткнётся проверка: как доказать, что «быстро»?' }, hint: 'Представьте, что вам надо это проверить. Сколько — «быстро»? Для кого — «удобно»?', why: 'Лере нечего проверить: «быстро» и «удобно» не измерить. Нужны цифры и сценарии.' },
    { id: 'f7', t: 'Клиент выбирает пекарню и получасовой интервал выдачи с 07:00 до 21:00.', ok: ['none'], hint: 'Перечитайте: что здесь непонятно или непроверяемо? Не каждая фраза — проблема.', why: 'Нормальная фраза: понятно, что выбирает клиент и в каких границах. Её можно нарисовать, сделать и проверить.' },
    { id: 'f3', t: 'На главном экране — большая зелёная кнопка «Заказать» справа внизу.', ok: ['design'], hint: 'Кто рисует экраны? Что ему нужно знать, кроме цвета и места кнопки?', why: '«Нарисуй кнопку» без сценария. Соне нужны путь покупателя, данные на экране и все состояния, а место кнопки она предложит сама.' },
    { id: 'f8', t: 'Оплата картой, СБП и т. д.', ok: ['qa', 'dev'], hint: 'Что скрывается за «и т. д.»? Кто будет это делать и проверять?', why: '«И т. д.» — список без конца: разработчики не знают, что делать, Лера — что проверять. Нужен полный список способов.' },
    { id: 'f9', t: 'Если что-то пойдёт не так, показать ошибку.', ok: ['design'], alt: { qa: 'Лере тоже не хватает ожидаемого результата, но сначала кто-то должен придумать, что именно увидит человек в каждом случае.' }, hint: 'Что именно «не так»? Где и как это увидит человек?', why: 'Какая ошибка, где, что делать человеку дальше? Соне нужны все неудачные состояния по отдельности: оплата не прошла, товар закончился, приём на завтра закрыт.' },
    { id: 'f2', t: 'Заказы хранить в Kafka, а остатки считать в Redis.', ok: ['lead'], hint: 'Это требование — или уже выбранное техническое решение? Кто в команде выбирает технологии?', why: 'Готовое техническое решение вместо требования. Диме нужны нагрузка, данные и интеграции — а инструмент он выберет сам.' },
    { id: 'f6', t: 'Время приёма заказов на завтра — уточню потом, пока сделайте как-нибудь, поправим.', ok: ['dev'], alt: { qa: 'Лера тоже не сможет проверить, но первыми пострадают те, кто прямо сейчас напишет код «как-нибудь».', lead: 'Дима переживёт, а вот код по этой фразе напишут и потом перепишут другие.' }, hint: 'Кто прямо сейчас напишет код по этой фразе — и будет его переписывать?', why: 'Разработчики напишут «как-нибудь», а потом переделают: требование поменяется на ходу. Правило надо выяснить до разработки.' },
    { id: 'f4', t: 'Заодно добавить баллы — Рита просила, это мелочь на пару дней.', ok: ['pm'], alt: { po: 'Решать будет Нина, но первым об эту «мелочь» споткнётся план и бюджет.' }, hint: 'Кто отвечает за сроки и бюджет — и узнает о «мелочи» последним?', why: 'Хотелка без анализа влияния. Игорю нужна оценка и ответ, что сдвинется. Решит Нина — но с цифрами от вас и Игоря.' },
    { id: 'f5', t: 'Согласовать с Ниной Сергеевной ER-модель и контракт API.', ok: ['po'], hint: 'С кем здесь предлагают обсуждать таблицы и контракты? Что этот человек из них поймёт?', why: 'Нине не нужны таблицы и API. Ей нужны варианты на её языке: что увидит клиент, сколько стоит, что будет к 1 марта.' }
  ];
  const DOC = [
    { lbl: 'Что делаем', parts: ['Клиент заходит в приложение и заказывает выпечку на завтра или на сегодня.', { f: 'f1' }, { f: 'f7' }, { f: 'f3' }] },
    { lbl: 'Оплата', parts: [{ f: 'f8' }, { f: 'f9' }] },
    { lbl: 'Техника', parts: [{ f: 'f2' }, { f: 'f6' }] },
    { lbl: 'Ещё', parts: [{ f: 'f4' }, { f: 'f5' }] }
  ];
  function draftEval(m) {
    m = m || {};
    return DRAFT.map(f => {
      const got = m[f.id];
      if (f.ok.includes(got)) return { f, s: 'ok', pts: 1 };
      if (f.alt && f.alt[got]) return { f, s: 'warn', pts: 0.5 };
      return { f, s: 'bad', pts: 0, empty: !got };
    });
  }
  const drTag = v => (DR_WHO.find(w => w.v === v) || { t: '?' }).t;
  const draftTask = {
    id: 'draft', title: 'Кому помешает эта фраза',
    simple: {
      icon: '🖍️',
      plain: 'Плохая фраза в постановке бьёт не «по качеству вообще», а по конкретному человеку в команде.',
      analogy: 'Техкарта с пометкой «сахара — по вкусу» мешает пекарю; «украсить красиво» — оформителю; «испечь к утру, как-нибудь успеем» — управляющему. Каждый споткнётся о своё.',
      tech: 'Что каждой роли нужно от аналитика и чем ей мешает плохой аналитик — в разделе «Карта команды». Свойства хорошего требования (однозначное, проверяемое, выполнимое и другие) — по ISO/IEC/IEEE 29148, подробно в неделе 2.'
    },
    lead: ui.brief({
      situation: 'В папке проекта вы нашли черновик постановки «Предзаказ выпечки», написанный наспех. Ксения: «Прежде чем отправлять команде, прочитайте глазами каждого из них. Кто первым споткнётся?»',
      todo: [
        'Нажмите на выделенную фразу в черновике (или она выберется сама — по порядку).',
        'Под черновиком выберите, кому из команды эта фраза помешает больше всех. Если фраза нормальная — так и отметьте.',
        'Разметьте все девять фраз и нажмите «Проверить». Засчитывается от 75 %. Где допустимы два ответа, второй засчитывается наполовину.'
      ],
      look: 'Метка после фразы — ваш выбор. После проверки зелёная подсветка — верно, жёлтая — допустимо, красная — подумайте ещё. Не каждая фраза в черновике плохая.'
    }),
    blank: () => ({ m: {} }),
    reference: () => ({ m: Object.fromEntries(DRAFT.map(f => [f.id, f.ok[0]])) }),
    render(el, ctx) {
      el.classList.add('team-root');
      const a = ctx.ans; a.m = a.m || {};
      let rv = null;
      if (ctx.result) { rv = {}; draftEval(a.m).forEach(x => { rv[x.f.id] = x.s; }); }
      let cur = ctx.readonly ? null : (DRAFT.find(f => !a.m[f.id]) || DRAFT[0]).id;
      el.innerHTML = '<div class="stack"><div data-doc></div><div data-pick></div><div data-why></div></div>';
      const fragHTML = id => {
        const f = DRAFT.find(x => x.id === id), got = a.m[id];
        const cls = ['team-frag', ctx.readonly ? 'ro' : '', cur === id ? 'cur' : '', got ? 'set' : '', rv && rv[id] ? rv[id] : ''].join(' ');
        return `<span class="${cls}" ${ctx.readonly ? '' : 'role="button" tabindex="0"'} data-f="${id}">${esc(f.t)}</span>${got ? `<span class="team-tag">${esc(drTag(got))}</span>` : ''} `;
      };
      function drawDoc() {
        TR.$('[data-doc]', el).innerHTML = `<div class="team-doc"><h4>Задача: предзаказ выпечки · черновик</h4>${DOC.map(p => `<p><span class="lbl">${esc(p.lbl)}.</span> ${p.parts.map(x => typeof x === 'string' ? esc(x) + ' ' : fragHTML(x.f)).join('')}</p>`).join('')}</div>`;
      }
      function drawPick() {
        const box = TR.$('[data-pick]', el);
        if (ctx.readonly) { box.innerHTML = ''; return; }
        const f = DRAFT.find(x => x.id === cur), n = DRAFT.filter(x => a.m[x.id]).length;
        box.innerHTML = `<div class="card flat"><div class="small dim">Выбранная фраза:</div><div><b>«${esc(f.t)}»</b></div>
          <div class="small">Кому из команды она помешает больше всех?</div>
          <div class="team-chips">${DR_WHO.map(w => `<button type="button" class="chip" data-w="${w.v}" aria-pressed="${a.m[cur] === w.v}">${esc(w.full)}</button>`).join('')}</div>
          <div class="small dim">Размечено: ${n} из ${DRAFT.length}</div></div>`;
      }
      function drawWhy() {
        const box = TR.$('[data-why]', el);
        if (ctx.readonly) {
          box.innerHTML = `<div class="stack tight">${DRAFT.map(f => `<div class="card flat"><div><b>«${esc(f.t)}»</b></div><div class="team-chips">${f.ok.map(v => `<span class="chip ${v === 'none' ? 'ok' : 'info'}">${esc((DR_WHO.find(w => w.v === v) || {}).full)}</span>`).join('')}</div><div class="small muted">${f.why}</div></div>`).join('')}</div>`;
          return;
        }
        box.innerHTML = '';
      }
      drawDoc(); drawPick(); drawWhy();
      if (ctx.readonly) return;
      const pickFrag = id => { cur = id; drawDoc(); drawPick(); };
      TR.on(el, 'click', '[data-f]', (e, s) => pickFrag(s.dataset.f));
      el.addEventListener('keydown', e => { const s = e.target.closest('[data-f]'); if (s && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); pickFrag(s.dataset.f); const n = TR.$(`[data-f="${s.dataset.f}"]`, el); n && n.focus(); } });
      TR.on(el, 'click', '[data-w]', (e, b) => {
        a.m[cur] = b.dataset.w; if (rv) delete rv[cur];
        ctx.save();
        const next = DRAFT.find(x => !a.m[x.id]);
        if (next) cur = next.id;
        drawDoc(); drawPick();
      });
    },
    check(ans) {
      const ev = draftEval(ans && ans.m), score = ev.reduce((s, x) => s + x.pts, 0) / DRAFT.length;
      const notes = [];
      ev.forEach(x => {
        if (x.s === 'ok') return;
        if (x.s === 'warn') notes.push({ ok: 'warn', html: `«${esc(x.f.t)}» — ${x.f.alt[(ans.m || {})[x.f.id]]}` });
        else notes.push({ ok: false, html: `«${esc(x.f.t)}» — ${x.empty ? 'не размечено. ' : ''}${x.f.hint}` });
      });
      const fine = ev.find(x => x.f.id === 'f7');
      if (!notes.length) notes.push({ ok: true, html: 'Все девять фраз прочитаны глазами нужного человека.' });
      const good = ev.filter(x => x.s === 'ok').length;
      return {
        ok: score >= 0.75, score, notes,
        summary: `Точно: ${good} из ${DRAFT.length}, допустимо: ${ev.filter(x => x.s === 'warn').length}.`,
        mentor: fine && fine.s !== 'ok' && (ans.m || {}).f7 ? 'Не спешите чинить всё подряд. Хороший аналитик видит и то, что в тексте уже в порядке, — иначе правки никогда не закончатся.' : null
      };
    },
    explain: `<p>Каждая плохая фраза бьёт по конкретному человеку: «быстро и удобно» — по Лере, «Kafka и Redis» — по Диме, «зелёная кнопка справа внизу» и «показать ошибку» — по Соне, «мелочь на пару дней» — по Игорю, «ER-модель» — по Нине, «сделайте как-нибудь» — по разработчикам. А фраза про пекарню и получасовой интервал — нормальная: не каждую строку надо чинить.</p>
      <p>Как это выглядит в жизни: такой черновик — не «плохой текст», а <b>несколько будущих переделок</b>. Каждая всплывёт у своего человека, и чаще всего тогда, когда переделывать уже дорого. Привычка перечитать постановку глазами каждой роли — одна из самых полезных для аналитика.</p>`,
    report: ans => draftEval(ans && ans.m).map(x => `- «${x.f.t}» → ${(DR_WHO.find(w => w.v === (ans.m || {})[x.f.id]) || { full: '—' }).full} ${x.s === 'ok' ? '✓' : x.s === 'warn' ? '≈' : '✗'}`).join('\n')
  };

  // =====================================================================
  // Практика 3. Лаборатория «Аналитик выпал» (торты на заказ)
  // =====================================================================
  const CONTR = [
    { id: 'rules', t: 'Выяснить правила торта у Нины и Галины Ивановны', d: 'за сколько часов принимать, какая предоплата, сколько тортов цех делает в обычный день и в праздник' },
    { id: 'states', t: 'Описать для Сони сценарий со всеми состояниями', d: 'на дату нет мест, оплата не прошла, фото не загрузилось' },
    { id: 'crit', t: 'Написать критерии приёмки с границами', d: 'ровно 48 часов — можно, 47 часов 59 минут — нельзя; торт сверх праздничного лимита — отказ' },
    { id: 'law', t: 'Выяснить у Олега Петровича законы и интеграции', d: 'какие чеки нужны при предоплате 50 % и при выдаче, через «КассаПро»' },
    { id: 'amigo', t: 'Обсудить задачу втроём с Димой и Лерой до разработки', d: '«три амиго»: полчаса вопросов до того, как пишут код' },
    { id: 'memo', t: 'Записать итоги встречи с Ниной и согласовать письмом', d: 'фото-образец и надпись, кондитер видит их на планшете в цехе' }
  ];
  const PIPE = [
    { id: 'meet', t: 'Встреча с Ниной Сергеевной', who: 'nina', okT: 'Нина рассказала про торты, итоги записаны и согласованы письмом.' },
    { id: 'design', t: 'Дизайн: Соня', who: 'sonya', okT: 'Соня рисует заказ торта и все неудачные состояния.' },
    { id: 'dev', t: 'Разработка: Дима и команда', who: 'dima', okT: 'Разработчики пишут по правилам и критериям, вопросы закрыты до начала.' },
    { id: 'test', t: 'Тестирование: Лера', who: 'lera', okT: 'Лера проверяет по критериям, включая границы.' },
    { id: 'demo', t: 'Демо Нине в конце спринта', who: 'nina', okT: 'Нина видит то, о чём просила.' },
    { id: 'pilot', t: 'Приёмка и пилот в двух пекарнях', who: 'oleg', okT: 'Чеки правильные, кассиры и кондитеры работают по новой схеме.' },
    { id: 'march', t: 'Эксплуатация: неделя 8 Марта', who: 'galya', okT: 'Цех принимает не больше тортов, чем может испечь. Ни одного потерянного заказа.' }
  ];
  const BRK = {
    rules: { plant: 'dev', found: 'march', days: 12, lost: true, plantT: 'Разработчики не знают ни про 48 часов, ни про мощность цеха: приложение принимает любые торты на любую дату.', foundT: 'За два дня до праздника Галина Ивановна видит в планшете на 7 марта больше тортов, чем цех может сделать даже с дополнительной сменой. Обзвон с отказами, скандал во ВКонтакте — ровно то, от чего «Колос» уходил.' },
    states: { plant: 'design', found: 'test', days: 4, plantT: 'Соня рисует только удачный путь: что видит клиент при ошибке, не знает никто.', foundT: 'Лера: «Оплата не прошла — белый экран. Мест на дату нет — а заказ принят». Дорисовка и переделка.' },
    crit: { plant: 'test', found: 'pilot', days: 5, lost: true, plantT: 'Лера проверяет «вроде работает» на обычных датах — границ в требованиях нет.', foundT: 'В пилоте приложение приняло торт за 47 часов 30 минут до выдачи. Кондитер не успевает, Павел обзванивает клиентку.' },
    law: { plant: 'dev', found: 'pilot', days: 15, deadline: true, plantT: 'Дима закладывает одну оплату: о двух чеках никто не сказал.', foundT: 'Олег Петрович на приёмке: «При предоплате нужен чек „предоплата“, при выдаче — чек полного расчёта, так требует 54-ФЗ». Доработка связи с «КассаПро» и их сертификация — ещё 3 недели. Срок 1 марта сорван.' },
    amigo: { plant: 'dev', found: 'test', days: 2, plantT: 'Разработчик споткнулся: «Срок считать от момента заказа или от начала дня?» Обсудить не с кем — решил сам.', foundT: 'Лера находит расхождение с тем, что ждёт Нина. Переделка и повторная проверка.' },
    memo: { plant: 'meet', found: 'demo', days: 3, unhappy: true, plantT: 'Нина рассказала про фото-образец и надпись, но итоги никто не записал.', foundT: 'Демо: «А где фото? Кондитер должен видеть его в цехе! Я же говорила!» Ещё несколько дней доработки и недовольный заказчик.' }
  };
  const ALL_C = CONTR.map(c => c.id);
  function labSim(missing) {
    const rows = PIPE.map(p => ({ p, plant: [], found: [] }));
    let days = 0, lost = false, deadline = false, unhappy = false;
    missing.forEach(id => {
      const b = BRK[id]; if (!b) return;
      rows.find(r => r.p.id === b.plant).plant.push(id);
      rows.find(r => r.p.id === b.found).found.push(id);
      days += b.days; lost = lost || !!b.lost; deadline = deadline || !!b.deadline; unhappy = unhappy || !!b.unhappy;
    });
    return { rows, days, lost, deadline, unhappy };
  }
  const pickOf = a => (a.pick || []).filter(id => BRK[id]).slice(0, 3);
  const missingOf = a => a.mode === 'none' ? ALL_C.slice() : ALL_C.filter(id => !pickOf(a).includes(id));
  const LAB_Q = {
    q: 'Почему пропуски «правила торта» и «законы и интеграции» обходятся дороже всех?', seed: 'team-lab-q',
    options: [
      { t: 'Их находят позже всех — на приёмке и в праздничную неделю, когда переделывать приходится уже код, интеграцию, сертификацию и отношения с клиентами', ok: 1, why: 'Да. Дорогими их делает не объём, а момент, когда ошибку нашли: поверх неё уже всё построено.' },
      { t: 'Эти требования самые длинные, их дольше всего записывать', why: 'Записать их — час-два. Дорогими их делает не объём, а момент, когда ошибку нашли.' },
      { t: 'Разработчики хуже всего пишут код для оплаты и тортов', why: 'Код написан честно — по тому, что знали. Ошибка заложена в требованиях, а не в коде.' },
      { t: 'Нина и Олег Петрович слишком поздно приходят на встречи', why: 'Они ответили бы в первый же день — их просто никто не спросил.' }
    ]
  };
  const labTask = {
    id: 'no-analyst', title: 'Лаборатория: аналитик выпал',
    simple: howPath.simple,
    lead: ui.brief({
      situation: 'Ксения на обследовании цеха, вы на больничном. Задача «Торты через приложение» ушла в разработку как есть — одной строкой из письма Нины Сергеевны: «Торты тоже через приложение, а то теряем». Команда работает без аналитика. Потом вы возвращаетесь, но до старта спринта у вас <b>3 дня</b>, а работы аналитика по задаче — на 6.',
      todo: [
        'Режим «Аналитик выпал»: пройдите конвейер сверху вниз. Где заложена мина (⚑) и где она взрывается (✗)? Сколько дней переделки?',
        'Переключитесь на «Аналитик вернулся: 3 дня». Отметьте три дела, которые сделаете обязательно. Следите за счётчиками и конвейером.',
        'Найдите набор, при котором срок 1 марта держится и торты к 8 Марта не теряются, а переделки — не больше 10 дней.',
        'Ответьте на вопрос внизу и нажмите «Проверить».'
      ],
      look: 'Конвейер — путь задачи от встречи с Ниной до праздничной недели. ⚑ — где ошибка заложена, ✗ — где её нашли и сколько дней стоит переделка. Каждое дело аналитика — один день. Числа — модель для учёбы, не замер.'
    }),
    blank: () => ({ mode: 'none', pick: [], seenNone: false, q: [] }),
    reference: () => ({ mode: 'pick', pick: ['rules', 'law', 'crit'], seenNone: true, q: quizRef(LAB_Q) }),
    render(el, ctx) {
      el.classList.add('team-root');
      const a = ctx.ans; a.pick = a.pick || []; a.q = a.q || []; a.mode = a.mode || 'none';
      if (a.mode === 'none' && !a.seenNone && !ctx.readonly) { a.seenNone = true; ctx.save(); }
      el.innerHTML = `<div class="stack">
        <div class="row"><span class="small dim">Режим:</span>${ui.seg('mode', [{ v: 'none', t: 'Аналитик выпал' }, { v: 'pick', t: 'Аналитик вернулся: 3 дня' }], a.mode, 'accent')}</div>
        <div data-picks></div>
        <div class="team-stats" data-stats></div>
        <div class="team-pipe" data-pipe></div>
        <div class="card flat" data-q></div>
      </div>`;
      function drawPicks() {
        const box = TR.$('[data-picks]', el);
        if (a.mode === 'none') { box.innerHTML = ui.note('warn', 'Аналитика нет', 'Ни одно из шести дел не сделано. Задача идёт по команде одной строкой из письма.'); return; }
        const n = pickOf(a).length;
        box.innerHTML = `<div class="stack tight"><div class="eyebrow">Что вы успеете за 3 дня · выбрано ${n} из 3</div><div class="team-picks">${CONTR.map(c => {
          const on = a.pick.includes(c.id), dis = ctx.readonly || (!on && n >= 3);
          return `<button type="button" class="team-pick" data-pk="${c.id}" aria-pressed="${on}" ${dis ? 'disabled' : ''}><span class="bx" aria-hidden="true"></span><span><b>${esc(c.t)}</b><div class="d">${esc(c.d)}</div></span></button>`;
        }).join('')}</div></div>`;
      }
      function drawSim() {
        const s = labSim(missingOf(a));
        const dK = s.days > 10 ? 'bad' : s.days > 5 ? 'warn' : 'ok';
        const dl = s.deadline ? ['bad', 'сорван'] : s.days > 10 ? ['warn', 'под угрозой'] : ['ok', 'держим'];
        TR.$('[data-stats]', el).innerHTML = `
          <div class="stat"><span class="k">Переделка</span><span class="v ${dK}">${s.days} ${TR.plural(s.days, 'день', 'дня', 'дней')}</span><span class="s">в модели</span></div>
          <div class="stat"><span class="k">Срок 1 марта</span><span class="v ${dl[0]}">${dl[1]}</span><span class="s">все 9 пекарен и торты</span></div>
          <div class="stat"><span class="k">Торты к 8 Марта</span><span class="v ${s.lost ? 'bad' : 'ok'}">${s.lost ? 'теряем заказы' : 'без потерь'}</span><span class="s">цель — ни одного потерянного</span></div>
          <div class="stat"><span class="k">Нина на демо</span><span class="v ${s.unhappy ? 'warn' : 'ok'}">${s.unhappy ? 'недовольна' : 'довольна'}</span><span class="s">видит то, о чём просила?</span></div>`;
        TR.$('[data-pipe]', el).innerHTML = s.rows.map(r => {
          const k = r.found.length ? 'bad' : r.plant.length ? 'warn' : 'ok';
          const items = [...r.plant.map(id => `<li class="plant">${esc(BRK[id].plantT)}</li>`), ...r.found.map(id => `<li class="found">${esc(BRK[id].foundT)} <b>+${BRK[id].days} ${TR.plural(BRK[id].days, 'день', 'дня', 'дней')}</b></li>`)];
          const p = TR.PEOPLE[r.p.who] || { ini: '?' };
          return `<div class="team-step ${k}"><div class="avatar sm" data-p="${r.p.who}" aria-hidden="true">${esc(p.ini)}</div><div><div class="ttl">${esc(r.p.t)}</div>${items.length ? `<ul>${items.join('')}</ul>` : `<div class="small muted">${esc(r.p.okT)}</div>`}</div></div>`;
        }).join('');
      }
      drawPicks(); drawSim();
      ui.quiz(TR.$('[data-q]', el), Object.assign({}, LAB_Q, { value: a.q, readonly: ctx.readonly, reveal: ctx.result, onChange: v => { a.q = v; ctx.save(); } }));
      if (ctx.readonly) { TR.$$('[data-seg] button', el).forEach(b => { b.disabled = true; }); return; }
      ui.onSeg(el, (n, v) => {
        if (n !== 'mode') return;
        a.mode = v; if (v === 'none') a.seenNone = true;
        ctx.save(); drawPicks(); drawSim();
      });
      TR.on(el, 'click', '[data-pk]', (e, b) => {
        const id = b.dataset.pk;
        if (a.pick.includes(id)) a.pick = a.pick.filter(x => x !== id);
        else if (pickOf(a).length < 3) a.pick = a.pick.concat(id);
        ctx.save(); ctx.decide('Три дня аналитика на торты', pickOf(a).map(x => CONTR.find(c => c.id === x).t).join('; ') || '—');
        drawPicks(); drawSim();
      });
    },
    check(ans) {
      const pick = pickOf(ans || {}), miss = ALL_C.filter(id => !pick.includes(id)), s = labSim(miss);
      const q = ui.quizScore(LAB_Q, (ans && ans.q) || []);
      const hasR = pick.includes('rules'), hasL = pick.includes('law');
      const notes = [];
      if (!ans.seenNone) notes.push({ ok: 'warn', html: 'Сначала посмотрите режим «Аналитик выпал» целиком: где закладываются мины и где они взрываются.' });
      if (pick.length < 3) notes.push({ ok: 'warn', html: `Выбрано ${pick.length} из 3 дел. Используйте все три дня.` });
      if (!hasR) notes.push({ ok: false, html: 'Осталась поломка, которую находят в самую последнюю неделю — перед 8 Марта. Что к тому времени уже построено поверх неё и кто пострадает?' });
      if (!hasL) notes.push({ ok: false, html: 'Осталась поломка, которую находят на приёмке пилота, — и она одна сдвигает срок 1 марта. Почему её так дорого чинить так поздно?' });
      if (hasR && hasL && s.days > 10) notes.push({ ok: 'warn', html: `Переделки ещё ${s.days} ${TR.plural(s.days, 'день', 'дня', 'дней')}. Какой третий день спасает больше всего?` });
      if (hasR && hasL && s.days <= 10) notes.push({ ok: true, html: `Срок держится, торты не теряются, переделки — ${s.days} ${TR.plural(s.days, 'день', 'дня', 'дней')}.` });
      notes.push(q.ok ? { ok: true, html: 'Вопрос: верно — дорого то, что находят поздно.' } : { ok: false, html: 'Вопрос внизу: посмотрите, на какой строке конвейера взрываются самые дорогие поломки. Что общего у этих строк?' });
      const score = (ans.seenNone ? 0.1 : 0) + (hasR ? 0.2 : 0) + (hasL ? 0.2 : 0) + (s.days <= 10 ? 0.2 : s.days <= 12 ? 0.1 : 0) + q.score * 0.3;
      return {
        ok: !!ans.seenNone && hasR && hasL && s.days <= 10 && q.ok, score: Math.min(1, score), notes,
        summary: `Выбрано: ${pick.length ? pick.map(id => { const t = CONTR.find(c => c.id === id).t; return esc(t[0].toLowerCase() + t.slice(1)); }).join('; ') : 'ничего'}. Переделка в модели — ${s.days} ${TR.plural(s.days, 'день', 'дня', 'дней')}.`,
        mentor: hasR && hasL ? null : 'Смотрите не на то, какое дело «важнее звучит», а на то, <b>где взрывается</b> поломка без него. Чем ниже по конвейеру — тем больше построено поверх ошибки.'
      };
    },
    explain: `<p>Самые дорогие пропуски — не самые сложные, а те, что находят <b>позже всех</b>: мощность цеха всплывает в неделю 8 Марта, два чека по 54-ФЗ — на приёмке, когда нужна ещё и сертификация «КассаПро» на 3 недели. К этому моменту поверх ошибки уже построены код, интеграция и ожидания клиентов.</p>
      <ul class="checks">
        <li>Лучший набор на 3 дня: <b>правила торта</b>, <b>законы и интеграции</b> и <b>критерии приёмки с границами</b>. Сценарий с состояниями вместо критериев — почти так же хорошо.</li>
        <li>Итоги встречи и «три амиго» — быстрые дела, их поломки находят рано. Их не бросают — просто делают в первые же дни спринта.</li>
        <li>Каждая поломка <b>заложена</b> в одном месте, а <b>взрывается</b> в другом — позже и у другого человека. Это и есть цена отсутствия аналитика: работа не исчезает, её просто делают поздно и дорого.</li>
      </ul>
      <p>Завтра, в тренировке «Жизненный цикл», посмотрим на эту закономерность отдельно: почему ошибка дорожает с каждой стадией.</p>`,
    report: ans => `Режим «аналитик выпал» просмотрен: ${ans.seenNone ? 'да' : 'нет'}.\nТри дела: ${pickOf(ans).map(id => CONTR.find(c => c.id === id).t).join('; ') || '—'}.\nПеределка в модели: ${labSim(ALL_C.filter(id => !pickOf(ans).includes(id))).days} дн.\nВопрос: ${ui.quizScore(LAB_Q, ans.q || []).ok ? 'верно' : 'неверно'}.`
  };

  // =====================================================================
  // Практика 4. RACI для запуска пилота предзаказа
  // =====================================================================
  const PR_COLS = [L('nina', 'Нина', 'владелец'), L('igor', 'Игорь', 'PM'), L('an', 'Аналитики', 'Ксения и вы'), L('dev', 'Дима', 'и разработчики'), L('lera', 'Лера', 'QA'), L('pavel', 'Павел', 'пекарни')];
  const PR_ROWS = [
    { id: 'scope', t: 'Решить, что входит в пилот 1 февраля', A: ['nina'], need: { an: ['R', 'C'] }, hint: 'Кто в проекте решает, что важнее, и принимает результат? Аналитик здесь не решает, но без него решать не из чего.' },
    { id: 'req', t: 'Описать требования и критерии приёмки к предзаказу', A: ['an', 'nina'], need: { an: ['A', 'R'], lera: ['C'] }, hint: 'Кто пишет требования руками? И когда Лере лучше увидеть критерии приёмки — до разработки или после?' },
    { id: 'plan', t: 'Оценить работу и спланировать спринты', A: ['igor'], need: { dev: ['R'] }, hint: 'Кто отвечает за сроки и план? А кто знает, сколько на самом деле займёт код?' },
    { id: 'build', t: 'Разработать предзаказ и экран кассира', A: ['dev'], need: { an: ['C', 'I'] }, hint: 'Кто отвечает за код и его качество? Аналитик код не пишет, но к нему приходят с вопросами.' },
    { id: 'test', t: 'Проверить предзаказ перед пилотом', A: ['lera'], need: { an: ['C', 'I'] }, hint: 'Кто отвечает за проверку? Аналитик её не ведёт, но знает, что должно получиться.' },
    { id: 'accept', t: 'Показать пилот на демо и принять результат', A: ['nina'], need: {}, hint: 'Кто говорит «да, это то, что нужно» и подписывает?' },
    { id: 'train', t: 'Обучить кассиров пилотных пекарен', A: ['pavel'], need: { an: ['R', 'C'] }, hint: 'Чьи это кассиры и кто отвечает за работу пекарни? А кто лучше всех знает сценарии и напишет памятку?' }
  ];
  const PR_REF = {
    scope: { nina: 'A', igor: 'C', an: 'R', dev: 'C', lera: 'I', pavel: 'C' },
    req: { nina: 'C', igor: 'I', an: 'A', dev: 'C', lera: 'C', pavel: 'C' },
    plan: { nina: 'I', igor: 'A', an: 'C', dev: 'R', lera: 'C' },
    build: { igor: 'I', an: 'C', dev: 'A', lera: 'C' },
    test: { igor: 'I', an: 'C', dev: 'C', lera: 'A' },
    accept: { nina: 'A', igor: 'R', an: 'R', dev: 'C', lera: 'C', pavel: 'C' },
    train: { nina: 'I', igor: 'I', an: 'R', pavel: 'A' }
  };
  function prEval(v) {
    v = v || {};
    return PR_ROWS.map(r => {
      const row = v[r.id] || {}, vals = PR_COLS.map(c => row[c.id] || '');
      const As = PR_COLS.filter(c => row[c.id] === 'A').map(c => c.id);
      const oneA = As.length === 1, aOk = oneA && r.A.includes(As[0]);
      const needOk = Object.entries(r.need).every(([c, allowed]) => allowed.includes(row[c] || ''));
      const tooC = vals.filter(x => x === 'C').length >= PR_COLS.length - 1;
      const score = (oneA ? 0.3 : 0) + (aOk ? 0.5 : 0) + (needOk ? 0.2 : 0);
      return { r, oneA, aOk, needOk, tooC, nA: As.length, empty: !vals.some(Boolean), score, s: aOk && needOk && !tooC ? 'ok' : (oneA ? 'warn' : 'bad') };
    });
  }
  const raciTask = {
    id: 'raci', title: 'RACI: запуск пилота предзаказа',
    simple: howRaci.simple,
    lead: ui.brief({
      situation: 'Игорь готовит план пилота: к 1 февраля 2027 предзаказ должен заработать в двух пекарнях. На прошлом проекте «Квант Софт» пилот сорвался, потому что каждый думал, что решает кто-то другой. Игорь: «Соберите RACI на семь главных дел — обсудим на планёрке».',
      todo: [
        'Для каждой строки щёлкайте клетки: клик меняет букву по кругу (пусто → R → A → C → I).',
        'В каждой строке — ровно один A. Подумайте, кто делает руками (R), с кем советоваться до (C) и кого предупредить после (I). Пустая клетка — человек в этом деле не участвует.',
        'Следите за проверкой под таблицей и нажмите «Проверить». Засчитывается от 80 %, и во всех строках должен быть ровно один A.'
      ],
      look: 'Колонка «Аналитики» — это вы с Ксенией. Обратите внимание, где аналитик делает (R), где отвечает (A), а где его только спрашивают (C). Проверка под таблицей ловит формат, а кто именно A — проверит кнопка «Проверить».'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: TR.clone(PR_REF) }),
    render(el, ctx) {
      el.classList.add('team-root');
      const a = ctx.ans; a.v = a.v || {};
      let reveal = null;
      if (ctx.result) { reveal = {}; prEval(a.v).forEach(x => { reveal[x.r.id] = x.s; }); }
      el.innerHTML = `<div class="stack">${RACI_LEGEND}<div data-tbl></div><div data-lint></div>
        ${ui.note('info', 'Позиция аналитика', 'В RACI проекта аналитик почти никогда не пустой: где-то он делает (требования, памятки), где-то с ним советуются (код, проверка). Если в строке про разработку у аналитика пусто — разработчикам не к кому идти с вопросами.')}</div>`;
      const drawLint = () => { TR.$('[data-lint]', el).innerHTML = lintHTML(PR_COLS, PR_ROWS, a.v); };
      raciTable(TR.$('[data-tbl]', el), { cols: PR_COLS, rows: PR_ROWS, value: a.v, readonly: ctx.readonly, reveal, onChange: v => { a.v = v; ctx.save(); drawLint(); } });
      drawLint();
    },
    check(ans) {
      const ev = prEval(ans && ans.v), score = ev.reduce((s, x) => s + x.score, 0) / PR_ROWS.length;
      const notes = [];
      ev.forEach(x => {
        if (x.s === 'ok') return;
        if (x.empty) notes.push({ ok: false, html: `«${esc(x.r.t)}»: строка пустая. ${x.r.hint}` });
        else if (!x.oneA) notes.push({ ok: false, html: `«${esc(x.r.t)}»: ${x.nA ? `A стоит у ${x.nA} человек` : 'нет A'} — нужен ровно один. ${x.r.hint}` });
        else if (!x.aOk) notes.push({ ok: false, html: `«${esc(x.r.t)}»: A стоит не у того, кто отвечает за результат. ${x.r.hint}` });
        else if (!x.needOk) notes.push({ ok: 'warn', html: `«${esc(x.r.t)}»: отвечающий выбран верно, но проверьте роли остальных. ${x.r.hint}` });
        else if (x.tooC) notes.push({ ok: 'warn', html: `«${esc(x.r.t)}»: согласовывать почти со всеми — решение будет ждать каждого. С кем действительно нужно советоваться?` });
      });
      const allOneA = ev.every(x => x.oneA);
      if (!notes.length) notes.push({ ok: true, html: 'Во всех семи строках один отвечающий и понятные роли.' });
      return {
        ok: score >= 0.8 && allOneA, score, notes,
        summary: `Строк в порядке: ${ev.filter(x => x.s === 'ok').length} из ${PR_ROWS.length}.`,
        mentor: allOneA ? null : 'Начните с правила, без которого RACI не работает: <b>в каждой строке ровно один A</b>. Двое главных — спор, ни одного — дело повисло.'
      };
    },
    explain: `<p>Главное правило RACI — <b>ровно один A в строке</b>: тот, с кого спросят за результат. R может быть несколько; C — те, с кем советуются до; I — кому сообщают после.</p>
      <ul class="checks">
        <li>Что входит в пилот, решает Нина (A), аналитики готовят варианты (R).</li>
        <li>Требования пишут аналитики (A или R — если подписывает Нина, A у неё). Лера — C уже на этой строке: проверяемость критериев обсуждают до разработки.</li>
        <li>План — Игорь (A), оценка — Дима с командой (R). Код — Дима (A), аналитик — C: к нему приходят с вопросами, но код он не пишет.</li>
        <li>Проверка — Лера (A). Приёмка — снова Нина. Обучение кассиров — Павел (A): это его люди, а памятку и сценарии готовят аналитики (R).</li>
      </ul>
      <p>Где у практиков нет единого мнения: можно ли ставить одному человеку и A, и R, и нужна ли RACI вообще в маленькой команде. Многие команды ведут её только для спорных зон — кто решает про сроки, кто принимает результат. Это нормально: RACI — способ договориться, а не отчёт ради отчёта.</p>`,
    report: ans => prEval(ans && ans.v).map(x => `- ${x.r.t}: ${PR_COLS.map(c => `${c.t}=${((ans.v || {})[x.r.id] || {})[c.id] || '·'}`).join(', ')} ${x.s === 'ok' ? '✓' : x.s === 'warn' ? '≈' : '✗'}`).join('\n')
  };

  // =====================================================================
  // Практика 5. Ответить Нине: зачем мне аналитик
  // =====================================================================
  const WHY_RUBRIC = [
    'Каждый в команде получает от аналитика своё: разработчики — правила и крайние случаи, дизайнер — сценарии и состояния экранов, тестировщица — проверяемые критерии; без этого каждый додумывает сам',
    'Пример из жизни «Колоса»: торты без лимита мощности к 8 Марта, два чека по 54-ФЗ, правило 22:30 — такие пропуски находят поздно, и это дорого',
    'Аналитик бережёт время Нины: вместо вопросов от пятерых людей — одни понятные вопросы, варианты с ценой и итоги письменно',
    'Честно: в маленьких командах часть этой работы делят разработчики и тестировщики, но сама работа не исчезает — её кто-то должен сделать',
    'Говорит на языке Нины: деньги, сроки, потерянные заказы — без жаргона'
  ];
  const WHY_REF = 'Нина Сергеевна, программисты сделают ровно то, что поймут из задачи. Если в задаче написано «торты через приложение», они не спросят, сколько тортов цех делает в праздник, — и к 8 Марта приложение примет больше, чем вы можете испечь. Тестировщица не проверит то, чего нет в требованиях, а дизайнер нарисует только случай, когда всё хорошо. Аналитик заранее выясняет у вас, Галины Ивановны и Олега Петровича правила — 48 часов, лимит цеха, чеки по закону — и раздаёт каждому в команде то, что ему нужно. Вам не придётся отвечать пятерым людям на одни и те же вопросы: вы получите варианты с ценой и письмо с итогами. Честно скажу: в маленьких командах эту работу иногда делят между собой программисты и тестировщики. Но работа никуда не девается — её делают урывками, и ошибки находят позже, когда переделывать приходится уже готовое.';
  const whyTask = {
    id: 'why-analyst', title: 'Ответить Нине: зачем мне аналитик',
    simple: {
      icon: '🗣️',
      plain: 'Заказчику не нужны слова «требования» и «спецификации». Ему нужно понять, что он теряет без аналитика: деньги, сроки, заказы.',
      analogy: 'Объяснить хозяйке пекарни, зачем нужен технолог, если пекари и так умеют печь. Без техкарты каждый печёт «как понял» — а выясняется это, когда торт уже на витрине.',
      tech: 'Аргументы: что каждая роль получает от аналитика (сценарии, правила, критерии), рост цены ошибки, найденной поздно, время заказчика. Честно — о спорах практиков: в некоторых командах работу аналитика делят между собой разработчики, тестировщики и владелец продукта.'
    },
    lead: ui.brief({
      situation: 'Игорь отправил Нине Сергеевне смету. Через час она звонит: «Тут аналитики — Ксения и вы. Зачем мне платить людям, которые не пишут код? Пусть программисты сами у меня всё спросят». Игорь: «Ответь ей письмом, я поправлю и отправлю».',
      todo: [
        'Напишите Нине 5–8 предложений без технического жаргона (от 200 символов).',
        'Покажите, что сломается без аналитика, на живом примере «Колоса». И будьте честны: что бывает в маленьких командах.',
        'Нажмите «Проверить с Ксенией (Claude)» или «Сверить с эталоном самому» и честно отметьте раскрытые пункты. Засчитывается от 60 %.'
      ],
      lookTitle: 'На что опереться',
      look: 'Лаборатория «Аналитик выпал»: где закладывались мины и где взрывались. Карта команды: кому что нужно от аналитика. Нина ценит, когда её понимают с полуслова, и не любит слова «таблица» и «спецификация».'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: WHY_REF, self: WHY_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('team-root');
      el.insertAdjacentHTML('beforeend', ui.say('nina', 'Тут в смете аналитики. Зачем мне платить людям, которые не пишут код? Пусть программисты сами у меня всё спросят — я же отвечу!'));
      const j = document.createElement('div'); j.style.marginTop = '12px'; el.appendChild(j);
      ui.justify(j, {
        id: 'team-why', q: 'Зачем «Колосу» аналитик, если код пишут программисты?', qPlain: 'Объясните владелице сети пекарен без жаргона, зачем ей платить аналитикам, если код пишут программисты, — что сломается без аналитика, и честно, как бывает в маленьких командах.',
        rubric: WHY_RUBRIC, reference: WHY_REF, value: ctx.ans.j, readonly: ctx.readonly, minLen: 200,
        onChange: v => { ctx.ans.j = v; ctx.save(); ctx.decide('Зачем аналитик (ответ Нине)', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j);
      return {
        ok: s >= 0.6, score: s,
        summary: s ? `Оценка ответа: ${Math.round(s * 100)} %.` : 'Напишите ответ (от 200 символов) и проверьте его с Ксенией или сверьте с эталоном сами.',
        notes: s && s < 0.6 ? [{ ok: false, html: 'Нине важно три вещи: что сломается без аналитика (живой пример с тортами или чеками), что она выиграет сама и честный ответ, бывает ли без аналитика.' }] : []
      };
    },
    explain: `<p>Сильный ответ Нине — не «аналитики нужны, потому что так положено», а про её деньги, сроки и торты. Покажите цепочку: без аналитика каждый додумывает за бизнес сам → ошибки находят поздно → переделка стоит дней и срывает сроки.</p>
      <p>И честно: в небольших продуктовых командах работу аналитика иногда делят между разработчиками, тестировщиком и владельцем продукта — у практиков нет единого мнения, нужна ли отдельная роль. Но <b>сама работа</b> — выяснить правила, записать сценарии, договориться о критериях — не исчезает. Вопрос только в том, кто её сделает и сколько это будет стоить.</p>`,
    report: ans => (ans.j && ans.j.text) ? ans.j.text : '—'
  };

  // =====================================================================
  TR.stage({
    id: 'team', act: 1, order: 30, slot: 'Вт 10:00', title: 'Команда разработки',
    when: 'вторник, 10:00 · опенспейс «Квант Софт», стол команды «Колоса»',
    intro: [
      { who: 'ksenia', html: 'Вчера мы говорили, кто такой аналитик. Сегодня — с кем он работает. На проекте «Колос» в «Квант Софт» нас семеро и ещё дизайнер на полставки, а со стороны «Колоса» — Нина Сергеевна и её люди. Каждый ждёт от вас чего-то своего.' },
      { who: 'dima', html: 'Сразу скажу, что нужно мне: не «сделайте кнопку», а что должно получиться и как это проверить. Как сделать — наша работа.' },
      { who: 'lera', html: 'А мне — чтобы каждое «быстро» и «удобно» превращалось в цифры. Иначе я не знаю, что проверять.' }
    ],
    facts: [],
    glossary: [
      { term: 'Команда разработки', simple: 'Бригада на кухне: каждый делает свою часть одного заказа.', tech: 'Люди, которые вместе создают и поддерживают систему: владелец продукта, руководитель проекта, аналитики, дизайнер, разработчики, тестировщики, эксплуатация, поддержка. Роль — не должность: один человек может держать несколько ролей.' },
      { term: 'Владелец продукта (Product Owner)', simple: 'Хозяйка пекарни: решает, что печь в первую очередь, и пробует результат.', tech: 'Отвечает за ценность продукта: управляет бэклогом и приоритетами, принимает результат. В Scrum Guide 2020 — одна из трёх зон ответственности. В «Колосе» — Нина Сергеевна.' },
      { term: 'Руководитель проекта (PM)', simple: 'Управляющий: следит, чтобы успели к сроку и уложились в деньги.', tech: 'Project Manager — отвечает за сроки, бюджет, риски, договор и связь с заказчиком. В «Квант Софт» — Игорь.' },
      { term: 'Продакт-менеджер', simple: 'Тот, кто решает, какие новые булки нужны покупателям, и смотрит, продаются ли они.', tech: 'Product Manager — отвечает за ценность продукта: исследует пользователей, ставит гипотезы, выбирает метрики. В продуктовых компаниях — отдельная роль; в проектах на заказ её часто выполняет заказчик.' },
      { term: 'Тимлид и архитектор', simple: 'Старший пекарь и инженер цеха: решают, как устроено производство, и распределяют работу.', tech: 'Тимлид ведёт разработчиков и оценивает задачи; архитектор решает, из каких частей состоит система и на каких технологиях. В небольшой команде это один человек — у «Колоса» Дима.' },
      { term: 'Фронтенд, бэкенд, мобильная разработка', simple: 'Витрина, кухня за стеной и доставка на дом: что видит покупатель, что происходит внутри и что у него в телефоне.', tech: 'Фронтенд — интерфейс в браузере; бэкенд — серверная логика, данные и интеграции; мобильная разработка — приложения для iOS и Android.' },
      { term: 'Тестировщик (QA)', simple: 'Дегустатор: пробует торт и сверяет его с заказом.', tech: 'Quality Assurance — обеспечение качества: проверяет, что система делает то, что требуется, ищет дефекты, пишет тест-кейсы по критериям приёмки. У «Колоса» — Лера.' },
      { term: 'DevOps', simple: 'Тот, кто следит, чтобы печь была исправна, и ночью меняет в ней детали, пока пекарня закрыта.', tech: 'Практики и роль на стыке разработки и эксплуатации: автоматическая сборка и выкатка, серверы, мониторинг, резервные копии, окна обслуживания.' },
      { term: 'RACI', simple: 'Доска в цеху: кто делает, кто отвечает, с кем советуются, кому сообщают.', tech: 'Матрица ответственности: R (Responsible) — исполнитель, A (Accountable) — отвечает за результат, ровно один на задачу, C (Consulted) — консультирует до решения, I (Informed) — информируется после.' },
      { term: 'Три амиго', simple: 'Кассир, кондитер и оформитель вместе читают заказ торта, прежде чем ставить тесто.', tech: 'Практика: аналитик (или владелец продукта), разработчик и тестировщик обсуждают задачу до разработки — каждый со своей стороны: зачем, как сделать, как проверить.' }
    ],
    outro: 'Теперь вы знаете команду в лицо. Аналитик — не начальник и не секретарь: он приносит каждому то, без чего тот будет додумывать за бизнес. Нине — варианты с ценой, Игорю — влияние на сроки, Соне — сценарии и состояния, Диме — требования в цифрах, Лере — проверяемые критерии. И помните лабораторию: без аналитика работа не исчезает, её просто находят поздно. Завтра посмотрим, как система проживает всю жизнь — от идеи до дня, когда её выключат, — и почему ошибка дорожает с каждой стадией.',
    tasks: [howMap, howPath, howRaci, askTask, draftTask, labTask, raciTask, whyTask]
  });
})();
