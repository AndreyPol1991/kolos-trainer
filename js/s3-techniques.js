/* Неделя 3, пятница 11:00 — «Техники выявления».
   Теория (соседний пример — школьная столовая, которая хочет предзаказ обедов): карта одиннадцати техник с фильтрами
   «кого услышать», «что узнать», «где мы», «сколько времени» и карточками (что даёт, сильные и слабые стороны, цена);
   широта против глубины; анкета по модели Кано (пара вопросов, таблица 5×5, подсчёт и коэффициенты, смещение выборки);
   план выявления (порядок «прочитать → спросить → посмотреть → посчитать → договориться → проверить → согласовать»,
   плохой и хороший план, сколько стоят часы людей).
   Практика на «Колосе»: подобрать технику к 8 ситуациям; разобрать мини-анкету по Кано (5 фич); главная лаборатория —
   план обследования на 3 недели (бюджет дней, покрытие тем и заинтересованных лиц, порядок, «чего не узнаем»);
   ответ Нине своими словами, зачем три недели обследования. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'techniques';

  if (!document.getElementById('tch-css')) document.head.insertAdjacentHTML('beforeend', `<style id="tch-css">
    .tch-root, .tch-root .stack > * { min-width: 0; }
    .tch-root .seg button { white-space: normal; text-align: left; }
    .tch-lbl { font: 600 11px/1.35 var(--f-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--text-muted); }
    /* карта техник */
    .tch-filters { display: grid; gap: 8px; }
    .tch-frow { display: grid; grid-template-columns: 150px minmax(0, 1fr); gap: 4px 10px; align-items: start; }
    .tch-frow .k { font-size: 13px; font-weight: 600; color: var(--text-2); padding-top: 5px; }
    .tch-presets { display: flex; flex-wrap: wrap; gap: 6px; }
    .tch-presets .btn { white-space: normal; text-align: left; }
    .tch-tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px; }
    .tch-tile { text-align: left; border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text); border-radius: 12px; padding: 9px 10px; display: grid; gap: 4px; font-size: 13.5px; line-height: 1.35; width: 100%; min-width: 0; }
    .tch-tile:hover { border-color: var(--text-muted); }
    .tch-tile .i { font-size: 20px; line-height: 1; }
    .tch-tile b { font: 600 14px/1.3 var(--f-brand); }
    .tch-tile.fit { border-color: var(--ok); background: color-mix(in srgb, var(--ok-soft) 70%, var(--surface-2)); }
    .tch-tile.near { border-color: var(--warn); }
    .tch-tile.off { opacity: .45; }
    .tch-tile[aria-pressed="true"] { box-shadow: 0 0 0 2px var(--accent) inset; opacity: 1; }
    .tch-det { border: 1px solid var(--border); border-radius: 12px; background: var(--surface); padding: 12px 14px; display: grid; gap: 8px; }
    .tch-det h4 { font: 600 17px/1.3 var(--f-brand); }
    .tch-det .en { font: 500 12px/1.3 var(--f-mono); color: var(--text-muted); }
    .tch-kv { display: grid; grid-template-columns: 130px minmax(0, 1fr); gap: 6px 12px; font-size: 14px; line-height: 1.45; }
    .tch-kv .k { font: 600 10.5px/1.7 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .tch-kv .plus { color: var(--ok); } .tch-kv .minus { color: var(--bad); }
    .tch-cost { font: 700 14px/1 var(--f-mono); color: var(--warn); letter-spacing: .05em; }
    .tch-map svg text { font-family: var(--f-body); }
    .tch-map .pt { cursor: pointer; }
    /* Кано */
    .tch-kq { display: grid; gap: 4px; }
    .tch-kq .k { font-size: 14px; font-weight: 600; }
    .tch-btns { display: flex; flex-wrap: wrap; gap: 4px; }
    .tch-btn { border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text); border-radius: 8px; padding: 4px 9px; font-size: 13px; line-height: 1.3; text-align: left; }
    .tch-btn:hover:not(:disabled) { border-color: var(--text-muted); }
    .tch-btn[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); font-weight: 600; }
    .tch-kres { border: 1px solid var(--border); border-left: 5px solid var(--border-strong); border-radius: 10px; background: var(--surface); padding: 10px 14px; display: grid; gap: 4px; }
    .tch-kres .c { font: 700 17px/1.3 var(--f-brand); }
    .tch-ktbl td, .tch-ktbl th { text-align: center; white-space: nowrap; }
    .tch-ktbl td:first-child, .tch-ktbl th:first-child { text-align: left; }
    .tch-ktbl td.on { background: var(--accent-soft); box-shadow: inset 0 0 0 2px var(--accent); font-weight: 700; }
    .tch-ktbl td.cl { cursor: pointer; }
    .tch-ktbl td.cl:hover { background: var(--surface-3); }
    .tch-cnt { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px; }
    .tch-cn { border: 1px solid var(--border); border-left: 4px solid var(--border-strong); border-radius: 10px; background: var(--surface); padding: 8px 10px; display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 4px 8px; align-items: center; font-size: 13.5px; }
    .tch-cn .v { font: 700 18px/1 var(--f-mono); }
    .tch-cn .pm { grid-column: 1 / -1; display: flex; gap: 4px; }
    .tch-cn .pm button { width: 30px; height: 26px; border-radius: 7px; border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text); padding: 0; font-weight: 700; }
    .tch-bars { display: grid; gap: 6px; }
    .tch-bar { display: grid; grid-template-columns: 170px minmax(0, 1fr) auto; gap: 8px; align-items: center; font-size: 13px; }
    .tch-bar .t { height: 12px; border-radius: 6px; background: var(--surface-3); overflow: hidden; }
    .tch-bar .t i { display: block; height: 100%; background: var(--info); border-radius: 6px; }
    .tch-bar .n { font: 600 12px/1 var(--f-mono); color: var(--text-2); text-align: right; }
    /* план */
    .tch-steps { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 4px; }
    .tch-st { border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text-2); border-radius: 9px; padding: 6px 4px; font-size: 12px; line-height: 1.3; text-align: center; display: grid; gap: 2px; min-width: 0; }
    .tch-st .n { font: 700 12px/1 var(--f-mono); }
    .tch-st[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); font-weight: 600; }
    .tch-st.skip { border-style: dashed; border-color: var(--bad); color: var(--bad); text-decoration: line-through; }
    .tch-days { display: grid; gap: 6px; }
    .tch-day { display: grid; grid-template-columns: 54px minmax(0, 1fr); gap: 10px; align-items: start; padding: 7px 10px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); font-size: 14px; line-height: 1.45; text-align: left; width: 100%; color: var(--text); }
    .tch-day .d { font: 600 12px/1.7 var(--f-mono); color: var(--text-muted); }
    .tch-day.bad { border-color: var(--bad); cursor: pointer; } .tch-day.bad:hover { background: var(--bad-soft); }
    .tch-day.good { border-left: 4px solid var(--ok); }
    .tch-day[aria-pressed="true"] { box-shadow: 0 0 0 2px var(--bad) inset; }
    .tch-calc { width: 100%; accent-color: var(--accent); }
    /* лаборатория плана */
    .tch-lab { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 16px; align-items: start; }
    .tch-lab > * { min-width: 0; }
    .tch-weeks { display: grid; gap: 8px; }
    .tch-wk { display: grid; grid-template-columns: 84px minmax(0, 1fr); gap: 8px; align-items: stretch; }
    .tch-wk .h { display: grid; gap: 2px; align-content: center; font-size: 12.5px; line-height: 1.3; }
    .tch-wk .h b { font: 600 13px/1.2 var(--f-brand); }
    .tch-wk .h .u { font: 600 12px/1 var(--f-mono); }
    .tch-wk .h .u.over { color: var(--bad); }
    .tch-cal { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 4px; }
    .tch-dc { border: 1px solid var(--border); border-radius: 8px; background: var(--surface); display: grid; grid-template-rows: auto 1fr 1fr; min-height: 76px; overflow: hidden; min-width: 0; }
    .tch-dc .dn { font: 600 10px/1.4 var(--f-mono); color: var(--text-muted); text-align: center; border-bottom: 1px solid var(--border); background: var(--surface-2); }
    .tch-hs { font-size: 11px; line-height: 1.2; padding: 3px 4px; display: flex; align-items: center; justify-content: center; text-align: center; min-width: 0; overflow-wrap: anywhere; border-top: 1px dashed var(--border); }
    .tch-hs:nth-child(2) { border-top: 0; }
    .tch-hs.on { background: var(--accent-soft); color: var(--text); font-weight: 600; }
    .tch-hs.int { background: var(--info-soft); } .tch-hs.obs { background: var(--violet-soft); } .tch-hs.cnt { background: var(--warn-soft); } .tch-hs.grp { background: var(--ok-soft); } .tch-hs.rd { background: var(--surface-3); }
    .tch-hs.fix { background: repeating-linear-gradient(135deg, var(--surface-2), var(--surface-2) 6px, var(--surface-3) 6px, var(--surface-3) 12px); color: var(--text-muted); }
    .tch-ovf { font-size: 12.5px; color: var(--bad); grid-column: 2; }
    .tch-cards { display: grid; gap: 6px; }
    .tch-card { border: 1px solid var(--border); border-radius: 11px; background: var(--surface); padding: 8px 10px; display: grid; grid-template-columns: 28px minmax(0, 1fr); gap: 4px 8px; align-items: start; }
    .tch-card .i { font-size: 18px; line-height: 1.3; text-align: center; }
    .tch-card .b { display: grid; gap: 4px; min-width: 0; }
    .tch-card .t { font-size: 14px; line-height: 1.35; font-weight: 600; }
    .tch-card .m { font-size: 12px; color: var(--text-muted); line-height: 1.35; }
    .tch-card.in { border-color: color-mix(in srgb, var(--accent) 50%, var(--border)); }
    .tch-card.out { opacity: .6; }
    .tch-wb { display: flex; flex-wrap: wrap; gap: 4px; grid-column: 2; }
    .tch-wb button { border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text-2); border-radius: 7px; padding: 3px 9px; font-size: 12.5px; line-height: 1.3; }
    .tch-wb button[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); font-weight: 600; }
    .tch-wb button.no[aria-pressed="true"] { border-color: var(--text-muted); background: var(--surface-3); color: var(--text-2); }
    .tch-cov { display: flex; flex-wrap: wrap; gap: 5px; }
    .tch-cov .chip { white-space: normal; font-size: 12.5px; }
    .tch-risk { display: grid; gap: 6px; }
    .tch-risk li { font-size: 13.5px; line-height: 1.45; }
    .tch-kf { border: 1px solid var(--border); border-radius: 12px; background: var(--surface); padding: 10px 12px; display: grid; gap: 8px; }
    .tch-kf h4 { font: 600 15px/1.3 var(--f-brand); }
    .tch-kf .qq { font-size: 13px; color: var(--text-2); line-height: 1.45; }
    .tch-kr { display: grid; grid-template-columns: minmax(0, 1fr) minmax(150px, 210px); gap: 6px 10px; align-items: center; padding: 6px 8px; border: 1px solid var(--border); border-radius: 9px; font-size: 13.5px; line-height: 1.4; }
    .tch-kr.ok { border-color: var(--ok); } .tch-kr.bad { border-color: var(--bad); }
    .tch-kr select { width: 100%; min-width: 0; }
    .tch-kr .n { font: 600 12px/1 var(--f-mono); color: var(--text-muted); white-space: nowrap; }
    .tch-tally { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; font-size: 13px; }
    @media (min-width: 901px) { .tch-side { position: sticky; top: 72px; max-height: calc(100vh - 90px); overflow-y: auto; padding-right: 2px; } }
    @media (max-width: 900px) { .tch-lab { grid-template-columns: minmax(0, 1fr); } }
    @media (max-width: 640px) {
      .tch-frow, .tch-kv { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .tch-steps { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      .tch-bar { grid-template-columns: 110px minmax(0, 1fr) auto; }
      .tch-wk { grid-template-columns: minmax(0, 1fr); }
      .tch-wk .h { display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 10px; }
      .tch-dc { min-height: 66px; }
      .tch-hs { font-size: 10px; padding: 2px; }
      .tch-kr { grid-template-columns: minmax(0, 1fr); }
    }
  </style>`);

  // ---------- общие помощники ----------
  const fresh = fn => pane => { const d = document.createElement('div'); pane.appendChild(d); fn(d); };
  const quizRef = cfg => cfg.options.map((o, i) => o.ok ? i : -1).filter(i => i >= 0);
  const pct = x => Math.round(x * 100) + ' %';
  const clamp = x => Math.max(0, Math.min(1, x));
  const nf = x => String(Math.round(x * 10) / 10).replace('.', ',');
  const btns = (key, opts, cur) => `<div class="tch-btns" role="group">${opts.map(x => `<button type="button" class="tch-btn" data-pk="${esc(key)}" data-pv="${esc(x.v)}" aria-pressed="${String(cur) === String(x.v)}">${esc(x.t)}</button>`).join('')}</div>`;

  // =====================================================================
  // Теория 1. Карта техник (соседний пример — школьная столовая)
  // =====================================================================
  const TECH = [
    { id: 'int', ico: '🎙️', t: 'Интервью', en: 'interview', what: 'Разговор один на один (или вдвоём) по заранее подготовленным темам.', when: 'В начале: понять цели, правила, проблемы и «почему». С ключевыми людьми.', plus: 'глубина и «почему»; можно уточнять и переспрашивать; строит доверие', minus: 'мнение одного человека; рассказывают, как должно быть, а не как есть; дорого на много людей', cost: 1, costT: '1 час встречи + 1–2 часа на подготовку и письмо-итог', gives: 'цели, правила, причины', ex: 'Завуч: зачем школе предзаказ обедов, кто платит, какие правила питания.', people: ['one'], need: ['goals', 'rules'], stage: ['problem', 'nosol'], minT: 'hours', x: .14, y: .8 },
    { id: 'survey', ico: '📋', t: 'Анкетирование', en: 'survey, questionnaire', what: 'Одинаковые вопросы большому числу людей — на бумаге или онлайн.', when: 'Когда нужно «сколько» и людей много: сотни и тысячи.', plus: 'большой охват; цифры; дёшево на одного человека', minus: 'нельзя переспросить; отвечают не все — выборка смещается; плохо объясняет «почему»', cost: 2, costT: '1 день составить и проверить на 3–5 людях + неделя сбора ответов', gives: 'цифры: сколько, как часто, насколько важно', ex: '600 родителей: сколько готовы заказывать обед заранее.', people: ['many'], need: ['count'], stage: ['problem', 'sol'], minT: 'weeks', x: .9, y: .2 },
    { id: 'obs', ico: '👀', t: 'Наблюдение', en: 'observation, job shadowing', what: 'Постоять рядом и посмотреть, как работают на самом деле.', when: 'Когда важно «как на самом деле»: обходные пути, условия, неявное.', plus: 'видно то, о чём не скажут; проверяет слова', minus: 'люди при свидетелях работают «по инструкции»; видно «что», но не всегда «почему»; занимает смену', cost: 2, costT: 'смена 3–6 часов + разбор заметок', gives: 'неявные требования, обходные пути, условия работы', ex: 'Большая перемена в столовой: очередь, раздача, оплата.', people: ['one', 'group'], need: ['real'], stage: ['problem'], minT: 'hours', x: .2, y: .93 },
    { id: 'ws', ico: '🤝', t: 'Воркшоп', en: 'workshop, фасилитированная сессия', what: 'Встреча нескольких заинтересованных лиц с ведущим, повесткой и результатом.', when: 'Когда разным людям нужно договориться: правила, приоритеты, спорные места.', plus: 'согласие «здесь и сейчас»; все слышат друг друга; быстрее переписки', minus: 'дорого по времени участников; громкие перекрикивают тихих; без подготовки — пустой разговор', cost: 3, costT: '1 день подготовки + 2–3 часа для 5–8 человек + протокол', gives: 'согласованные правила и решения', ex: 'Завуч, повар, бухгалтер и родком договариваются о правилах отмены обеда.', people: ['group'], need: ['agree', 'rules', 'ideas'], stage: ['nosol', 'sol'], minT: 'days', x: .5, y: .72 },
    { id: 'brain', ico: '💡', t: 'Мозговой штурм', en: 'brainstorming', what: 'Короткая сессия: сначала много идей без критики, потом отбор.', when: 'Когда проблему понимаем, а решений мало: «а как ещё можно?».', plus: 'много идей быстро; вовлекает команду', minus: 'идеи без проверки; легко уйти в фантазии; нужен ведущий', cost: 1, costT: '1 час для 4–8 человек', gives: 'идеи и варианты решений', ex: 'Как сделать, чтобы дети не забывали забрать заказанный обед?', people: ['group'], need: ['ideas'], stage: ['nosol'], minT: 'hours', x: .36, y: .3 },
    { id: 'focus', ico: '🗣️', t: 'Фокус-группа', en: 'focus group', what: 'Обсуждение с 6–10 похожими людьми под руководством ведущего (модератора).', when: 'Когда нужно понять отношение и мотивы группы, реакцию на идею.', plus: 'видны мнения и споры внутри группы; быстрее, чем восемь интервью', minus: 'мнения подстраиваются под громких; говорят, а не делают; не даёт цифр', cost: 2, costT: 'несколько дней — собрать участников; 1,5–2 часа встречи', gives: 'отношение, мотивы, реакция на идею', ex: 'Восемь родителей обсуждают, удобно ли заказывать обед накануне до 20:00.', people: ['group'], need: ['goals', 'react'], stage: ['problem', 'sol'], minT: 'days', x: .6, y: .55 },
    { id: 'docs', ico: '📄', sh: 'Документы', t: 'Анализ документов', en: 'document analysis', what: 'Прочитать то, что уже записано: регламенты, бланки, журналы, договоры, письма.', when: 'В самом начале, до встреч: чтобы не спрашивать то, что уже записано.', plus: 'дёшево; не отнимает время у людей; даёт правила, термины, цифры', minus: 'документы устаревают; показывают «как должно быть», а не «как есть»', cost: 1, costT: 'от нескольких часов до дня', gives: 'правила, форматы, история, термины', ex: 'Меню, правила питания, договор с поставщиком, журнал выдачи.', people: ['none'], need: ['rules'], stage: ['problem'], minT: 'hours', x: .55, y: .42 },
    { id: 'sys', ico: '🔌', sh: 'Анализ систем', t: 'Анализ систем и интерфейсов', en: 'interface analysis', what: 'Изучить программы, которые уже есть, и их связи: экраны, поля, отчёты, API, правила обмена.', when: 'Когда новая система будет жить рядом со старыми или обмениваться с ними данными.', plus: 'точные поля и форматы; видны ограничения чужих систем', minus: 'нужен доступ и документация; технически сложнее', cost: 2, costT: '1–2 дня', gives: 'данные, форматы, ограничения интеграций', ex: 'Электронный дневник и школьная система оплаты: что они отдают и принимают.', people: ['none'], need: ['rules'], stage: ['problem', 'sol'], minT: 'days', x: .3, y: .5 },
    { id: 'proto', ico: '🧪', sh: 'Прототип', t: 'Прототипирование', en: 'prototyping', what: 'Сделать черновик экрана — на бумаге или кликабельный — и дать человеку попробовать.', when: 'Когда есть набросок решения и надо проверить, поймут ли его люди.', plus: 'реакция на настоящее, а не на слова; ошибки видны до разработки', minus: 'спорят о цвете кнопок; черновик принимают за почти готовое', cost: 2, costT: '1 день на прототип + час на 5 человек', gives: 'реакция и ошибки удобства', ex: 'Бумажный экран «Заказать обед» — дать пяти родителям и одной бабушке.', people: ['one', 'group'], need: ['react'], stage: ['sol'], minT: 'days', x: .22, y: .66 },
    { id: 'comp', ico: '🔍', sh: 'Конкуренты', t: 'Анализ конкурентов', en: 'benchmarking, market analysis', what: 'Посмотреть, как похожую задачу решили другие: приложения, сайты, процессы.', when: 'Когда нужны идеи и ориентиры или заказчик говорит «хочу как у них».', plus: 'готовые идеи и чужие ошибки; общий язык с заказчиком', minus: 'чужое решение под чужие условия; соблазн скопировать', cost: 1, costT: 'около дня', gives: 'идеи, ориентиры, ожидания пользователей', ex: 'Как устроен предзаказ обедов в соседних школах и в корпоративных столовых.', people: ['none'], need: ['ideas'], stage: ['nosol'], minT: 'days', x: .66, y: .26 },
    { id: 'data', ico: '📊', t: 'Анализ данных', en: 'data mining', what: 'Разобрать накопленные записи: продажи, чеки, журналы, обращения.', when: 'Когда нужно знать, как люди ведут себя на самом деле, — в цифрах.', plus: 'реальное поведение тысяч людей; не отнимает их время', minus: 'данные бывают грязными; цифры не объясняют «почему»', cost: 2, costT: '1–2 дня', gives: 'цифры: спрос, пики, повторяемость', ex: 'Журнал выдачи обедов за год: сколько порций остаётся по дням недели.', people: ['none', 'many'], need: ['count', 'real'], stage: ['problem'], minT: 'days', x: .94, y: .36 }
  ];
  const TBY = Object.fromEntries(TECH.map(t => [t.id, t]));
  const FILT = [
    { k: 'people', t: 'Кого надо услышать', o: [{ v: 'any', t: 'неважно' }, { v: 'none', t: 'никого — читаем' }, { v: 'one', t: '1–3 человек' }, { v: 'group', t: 'группу 5–10' }, { v: 'many', t: 'сотни и больше' }] },
    { k: 'need', t: 'Что нужно узнать', o: [{ v: 'any', t: 'неважно' }, { v: 'goals', t: 'цели и «почему»' }, { v: 'real', t: 'как на самом деле' }, { v: 'rules', t: 'правила и данные' }, { v: 'count', t: 'цифры: сколько' }, { v: 'ideas', t: 'идеи' }, { v: 'agree', t: 'договориться' }, { v: 'react', t: 'реакцию на решение' }] },
    { k: 'stage', t: 'Где мы сейчас', o: [{ v: 'any', t: 'неважно' }, { v: 'problem', t: 'разбираемся в проблеме' }, { v: 'nosol', t: 'проблема ясна, решения нет' }, { v: 'sol', t: 'есть набросок решения' }] },
    { k: 'time', t: 'Сколько есть времени', o: [{ v: 'any', t: 'неважно' }, { v: 'hours', t: 'пара часов' }, { v: 'days', t: 'несколько дней' }, { v: 'weeks', t: 'неделя и больше' }] }
  ];
  const TRANK = { hours: 0, days: 1, weeks: 2 };
  const PRESETS = [
    { t: '600 родителей: сколько будут заказывать?', f: { people: 'many', need: 'count', stage: 'problem', time: 'weeks' } },
    { t: 'Завуч и повар спорят о правилах отмены', f: { people: 'group', need: 'agree', stage: 'nosol', time: 'days' } },
    { t: 'Поймут ли бабушки экран заказа?', f: { people: 'one', need: 'react', stage: 'sol', time: 'days' } },
    { t: 'Как на раздаче на самом деле?', f: { people: 'group', need: 'real', stage: 'problem', time: 'hours' } }
  ];
  function fitOf(t, f) {
    let act = 0, ok = 0;
    if (f.people !== 'any') { act++; if (t.people.includes(f.people)) ok++; }
    if (f.need !== 'any') { act++; if (t.need.includes(f.need)) ok++; }
    if (f.stage !== 'any') { act++; if (t.stage.includes(f.stage)) ok++; }
    if (f.time !== 'any') { act++; if (TRANK[t.minT] <= TRANK[f.time]) ok++; }
    return !act ? '' : ok === act ? 'fit' : ok === act - 1 ? 'near' : 'off';
  }
  const costStr = c => '₽'.repeat(c) + '<span style="opacity:.3">' + '₽'.repeat(3 - c) + '</span>';
  function techDetail(t) {
    return `<div class="tch-det"><div><h4>${t.ico} ${esc(t.t)}</h4><span class="en">${esc(t.en)}</span></div>
      <div class="tch-kv">
        <span class="k">Что это</span><span>${esc(t.what)}</span>
        <span class="k">Когда брать</span><span>${esc(t.when)}</span>
        <span class="k">Что даёт</span><span>${esc(t.gives)}</span>
        <span class="k">Сильные стороны</span><span class="plus">${esc(t.plus)}</span>
        <span class="k">Слабые стороны</span><span class="minus">${esc(t.minus)}</span>
        <span class="k">Сколько стоит</span><span><span class="tch-cost">${costStr(t.cost)}</span> ${esc(t.costT)}</span>
        <span class="k">В столовой</span><span>${esc(t.ex)}</span>
      </div></div>`;
  }
  function drawFinder(pane) {
    const f = { people: 'any', need: 'any', stage: 'any', time: 'any' };
    let cur = 'int';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Школа хочет, чтобы родители заказывали обед заранее. Аналитику надо многое выяснить — и у каждой задачи своя техника. Выставьте условия — подходящие техники загорятся зелёным, «почти» — жёлтым. Или начните с готовой ситуации.</p>
      <div class="tch-presets">${PRESETS.map((p, i) => `<button type="button" class="btn sm" data-pr="${i}">${esc(p.t)}</button>`).join('')}<button type="button" class="btn sm ghost" data-pr="x">Сбросить</button></div>
      <div class="tch-filters" data-f></div>
      <div class="tch-tiles" data-t></div>
      <div data-d></div>
    </div>`;
    function drawF() { TR.$('[data-f]', pane).innerHTML = FILT.map(g => `<div class="tch-frow"><span class="k">${esc(g.t)}</span>${ui.seg('f-' + g.k, g.o, f[g.k])}</div>`).join(''); }
    function drawT() {
      TR.$('[data-t]', pane).innerHTML = TECH.map(t => { const ft = fitOf(t, f); return `<button type="button" class="tch-tile ${ft}" data-ti="${t.id}" aria-pressed="${cur === t.id}"><span class="i" aria-hidden="true">${t.ico}</span><b>${esc(t.t)}</b><span class="small dim">${ft === 'fit' ? 'подходит' : ft === 'near' ? 'почти' : ft === 'off' ? 'не то' : esc(t.gives)}</span></button>`; }).join('');
      TR.$('[data-d]', pane).innerHTML = techDetail(TBY[cur]);
    }
    ui.onSeg(pane, (n, v) => { if (n.startsWith('f-')) { f[n.slice(2)] = v; drawT(); } });
    TR.on(pane, 'click', '[data-ti]', (e, b) => { cur = b.dataset.ti; drawT(); });
    TR.on(pane, 'click', '[data-pr]', (e, b) => {
      if (b.dataset.pr === 'x') Object.keys(f).forEach(k => { f[k] = 'any'; });
      else Object.assign(f, PRESETS[+b.dataset.pr].f);
      const best = TECH.find(t => fitOf(t, f) === 'fit'); if (best) cur = best.id;
      drawF(); drawT();
    });
    drawF(); drawT();
  }
  function mapSVG(cur) {
    const W = 520, H = 330, X = v => 50 + v * 440, Y = v => 290 - v * 260;
    let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="min-width:480px;max-width:640px;display:block" role="img" aria-label="Техники: широта охвата и глубина понимания">`;
    s += `<rect x="${X(0)}" y="${Y(1)}" width="${X(1) - X(0)}" height="${Y(0) - Y(1)}" rx="8" style="fill:none;stroke:var(--border)"/>`;
    s += `<line x1="${X(.5)}" y1="${Y(1)}" x2="${X(.5)}" y2="${Y(0)}" style="stroke:var(--border);stroke-dasharray:4 4"/><line x1="${X(0)}" y1="${Y(.5)}" x2="${X(1)}" y2="${Y(.5)}" style="stroke:var(--border);stroke-dasharray:4 4"/>`;
    s += `<text x="${X(1) - 6}" y="${Y(1) + 18}" text-anchor="end" style="fill:var(--text-muted);font-size:12px">здесь нет ни одной техники</text>`;
    s += `<text x="${X(.5)}" y="${H - 8}" text-anchor="middle" style="fill:var(--text-2);font-size:12.5px">широта: сколько людей или случаев охватывает →</text>`;
    s += `<text transform="translate(16 ${Y(.5)}) rotate(-90)" text-anchor="middle" style="fill:var(--text-2);font-size:12.5px">глубина: «почему» и «как на самом деле» →</text>`;
    TECH.forEach(t => {
      const on = t.id === cur, cx = X(t.x), cy = Y(t.y), right = t.x > .75;
      s += `<g class="pt" data-mp="${t.id}"><circle cx="${cx}" cy="${cy}" r="${on ? 9 : 7}" style="fill:${on ? 'var(--accent)' : 'var(--info)'};stroke:var(--surface);stroke-width:2"/><text x="${right ? cx - 12 : cx + 12}" y="${cy + 4}" ${right ? 'text-anchor="end"' : ''} style="fill:${on ? 'var(--text)' : 'var(--text-2)'};font-size:12.5px;font-weight:${on ? 700 : 500}">${esc(t.sh || t.t)}</text></g>`;
    });
    return s + '</svg>';
  }
  function drawMap(pane) {
    let cur = 'survey';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Каждая техника — компромисс. Одни охватывают много людей, но не объясняют «почему». Другие объясняют, но только про двоих-троих. Нажмите на точку.</p>
      <div class="board tch-map" style="padding:8px;overflow-x:auto" data-m></div>
      <div data-d></div>
      ${ui.note('info', 'Поэтому техники комбинируют', 'Правый верхний угол пуст: нет техники, которая сразу и про тысячу людей, и глубоко. Аналитик сочетает: интервью и наблюдение дают «почему» и «как на самом деле», анкета и данные — «сколько». Если разные техники говорят одно и то же — вывод надёжен (это называют триангуляцией). Если спорят — копать дальше.')}
    </div>`;
    function draw() { TR.$('[data-m]', pane).innerHTML = mapSVG(cur); TR.$('[data-d]', pane).innerHTML = techDetail(TBY[cur]); }
    TR.on(pane, 'click', '[data-mp]', (e, g) => { cur = g.dataset.mp; draw(); });
    draw();
  }
  const howMap = {
    id: 'how-map', covers: ['pick'], title: 'Как это работает: карта техник — что, когда и сколько стоит', free: true, noReset: true,
    simple: {
      icon: '🧰',
      plain: 'Техника выявления — это способ узнать, что нужно людям. Спросить одного — интервью. Спросить тысячу — анкета. Посмотреть, как работают, — наблюдение. Собрать спорящих за одним столом — воркшоп. Дать потрогать черновик — прототип. У каждого способа своя цена и своя добыча, поэтому выбирают по задаче, а не по привычке.',
      analogy: 'Как в пекарне узнать, что людям нравится? Спросить постоянную покупательницу (интервью), раздать листочки у кассы (анкета), посмотреть, что уходит первым (наблюдение и данные продаж), устроить дегустацию новой булки (прототип), заглянуть к соседям-конкурентам (анализ конкурентов).',
      tech: 'BABOK v3 описывает техники выявления: интервью, анкетирование (survey or questionnaire), наблюдение, воркшопы, мозговой штурм, фокус-группы, анализ документов, анализ интерфейсов, прототипирование, сравнительный анализ и анализ рынка (benchmarking and market analysis), анализ данных (data mining) и др. Вигерс и Битти советуют сочетать несколько техник и подбирать их под тип заинтересованных лиц и вид знания.'
    },
    lead: ui.brief({
      situation: 'Соседний пример — школьная столовая хочет, чтобы родители заказывали обеды заранее. Аналитик выбирает, как всё выяснить: у кого спросить, что посчитать, на что посмотреть.',
      todo: [
        '«Подбор по условиям»: нажмите готовую ситуацию или выставьте четыре условия сами. Нажмите на любую технику — внизу появится её карточка.',
        '«Широта и глубина»: нажимайте на точки и сравнивайте, что даёт каждая техника.'
      ],
      look: 'Зелёный — техника подходит по всем условиям, жёлтый — по всем, кроме одного, бледный — не то. В карточке: ₽ — дёшево (часы аналитика), ₽₽ — дни или время многих людей, ₽₽₽ — дни аналитика плюс часы нескольких занятых людей.'
    }),
    render(el) {
      el.classList.add('tch-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'find', t: 'Подбор по условиям', render: fresh(drawFinder) },
        { id: 'map', t: 'Широта и глубина', render: fresh(drawMap) }
      ], 'find');
    }
  };

  // =====================================================================
  // Теория 2. Анкета по модели Кано (школьная столовая)
  // =====================================================================
  const KA = [{ v: 'like', t: 'Нравится' }, { v: 'must', t: 'Так и должно быть' }, { v: 'neu', t: 'Всё равно' }, { v: 'live', t: 'Терплю' }, { v: 'dis', t: 'Не нравится' }];
  const KMID = { like: 'R', must: 'I', neu: 'I', live: 'I', dis: 'M' };
  const KT = { like: { like: 'Q', must: 'A', neu: 'A', live: 'A', dis: 'O' }, must: KMID, neu: KMID, live: KMID, dis: { like: 'R', must: 'R', neu: 'R', live: 'R', dis: 'Q' } };
  const KC = {
    M: { t: 'Обязательное', s: 'обяз.', d: 'Есть — не замечают, нет — злятся. Без этого уйдут.', col: 'var(--violet)' },
    O: { t: 'Одномерное', s: 'одном.', d: 'Чем больше и лучше, тем довольнее.', col: 'var(--info)' },
    A: { t: 'Привлекательное', s: 'привл.', d: 'Нет — не расстроятся, есть — радует.', col: 'var(--ok)' },
    I: { t: 'Безразличное', s: 'безр.', d: 'Никому нет дела.', col: 'var(--text-muted)' },
    R: { t: 'Обратное', s: 'обр.', d: 'Раздражает тех, кто ответил.', col: 'var(--bad)' },
    Q: { t: 'Сомнительный ответ', s: '?', d: 'Человек противоречит себе — вопрос поняли неверно.', col: 'var(--warn)' }
  };
  const KORD = ['M', 'O', 'A', 'I', 'R', 'Q'];
  const SCH = [
    { v: 'pre', t: 'Заказ обеда накануне', f: 'Если в приложении можно заказать обед накануне — как вы к этому отнесётесь?', d: 'Если заказать обед накануне нельзя — как вы к этому отнесётесь?', a: ['like', 'dis'] },
    { v: 'photo', t: 'Меню на неделю с фото', f: 'Если в приложении есть меню на неделю с фото блюд — как вы к этому отнесётесь?', d: 'Если меню с фото нет — как вы к этому отнесётесь?', a: ['like', 'neu'] },
    { v: 'cash', t: 'Оплата наличными у кассы', f: 'Если заказанный обед можно оплатить наличными у кассы — как вы к этому отнесётесь?', d: 'Если наличными оплатить нельзя — как вы к этому отнесётесь?', a: ['must', 'dis'] },
    { v: 'push', t: 'Уведомление «ребёнок поел»', f: 'Если приложение присылает уведомление, что ребёнок получил обед, — как вы к этому отнесётесь?', d: 'Если такого уведомления нет — как вы к этому отнесётесь?', a: ['like', 'live'] }
  ];
  const KBAD = [
    { q: '«Вам нужен предзаказ обедов?» (да / нет)', w: 'Все скажут «да» — и не видно, без этого уйдут или это просто приятно. У Кано всегда пара вопросов: «если есть» и «если нет».' },
    { q: '«Как вам удобный и быстрый предзаказ?»', w: 'Наводящий: слова «удобный и быстрый» подсказывают ответ.' },
    { q: '«Нравится ли вам предзаказ и оплата картой?»', w: 'Двойной: два свойства в одном вопросе. Человеку может нравиться одно и не нравиться другое.' }
  ];
  function drawPair(pane) {
    let cur = 'pre', bad = false;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Анкета Кано спрашивает про каждое свойство дважды: «если оно есть» (функциональный вопрос) и «если его нет» (дисфункциональный). Ответы одни и те же для всех вопросов.</p>
      <div class="row">${ui.seg('pq', SCH.map(x => ({ v: x.v, t: x.t })), cur, 'accent')}</div>
      <div data-q></div>
      <div class="row"><button type="button" class="btn sm" data-bad>${'Как спрашивать нельзя'}</button></div>
      <div data-b></div>
    </div>`;
    function draw() {
      const x = SCH.find(s => s.v === cur);
      TR.$('[data-q]', pane).innerHTML = `<div class="card flat"><div class="tch-kq"><span class="tch-lbl">Если есть</span><span class="k">${esc(x.f)}</span></div><div class="tch-kq"><span class="tch-lbl">Если нет</span><span class="k">${esc(x.d)}</span></div><div class="tch-lbl">Варианты ответа</div><div class="tch-btns">${KA.map(a => `<span class="chip">${esc(a.t)}</span>`).join('')}</div></div>`;
      TR.$('[data-b]', pane).innerHTML = bad ? `<div class="stack tight">${KBAD.map(b => ui.note('bad', b.q, esc(b.w))).join('')}${ui.note('info', 'Ещё правила', 'Одно свойство — одна пара вопросов. Слова человека, а не аналитика: «заказать накануне», а не «функция предзаказа». Прежде чем рассылать — проверить анкету на 3–5 людях: поймут ли вопросы так, как вы задумали.')}</div>` : '';
      TR.$('[data-bad]', pane).textContent = bad ? 'Скрыть плохие вопросы' : 'Как спрашивать нельзя';
    }
    ui.onSeg(pane, (n, v) => { cur = v; draw(); });
    TR.on(pane, 'click', '[data-bad]', () => { bad = !bad; draw(); });
    draw();
  }
  function kTable(f, d, click) {
    return `<div class="tbl-wrap"><table class="tbl tch-ktbl"><thead><tr><th>Если есть ↓ / нет →</th>${KA.map(a => `<th>${esc(a.t)}</th>`).join('')}</tr></thead><tbody>${KA.map(r => `<tr><td><b>${esc(r.t)}</b></td>${KA.map(c => `<td class="${r.v === f && c.v === d ? 'on' : ''} ${click ? 'cl' : ''}" ${click ? `data-kc="${r.v}|${c.v}"` : ''} style="color:${KC[KT[r.v][c.v]].col}">${esc(KC[KT[r.v][c.v]].s)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  function drawKTable(pane) {
    let f = 'like', d = 'dis';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Пара ответов одного человека даёт категорию. Выберите ответы кнопками или нажмите на клетку таблицы.</p>
      <div class="tch-kq"><span class="k">«Если есть» — ответ</span><div data-f></div></div>
      <div class="tch-kq"><span class="k">«Если нет» — ответ</span><div data-d></div></div>
      <div data-r></div><div data-t></div>
      <div class="small muted">Сокращения: обяз. — обязательное, одном. — одномерное, привл. — привлекательное, безр. — безразличное, обр. — обратное, ? — сомнительный ответ.</div>
    </div>`;
    function draw() {
      const c = KC[KT[f][d]];
      TR.$('[data-f]', pane).innerHTML = btns('kf', KA, f);
      TR.$('[data-d]', pane).innerHTML = btns('kd', KA, d);
      TR.$('[data-r]', pane).innerHTML = `<div class="tch-kres" style="border-left-color:${c.col}"><span class="small dim">Категория</span><span class="c" style="color:${c.col}">${esc(c.t)}</span><span>${esc(c.d)}</span></div>`;
      TR.$('[data-t]', pane).innerHTML = kTable(f, d, true);
    }
    TR.on(pane, 'click', '[data-pk]', (e, b) => { if (b.dataset.pk === 'kf') f = b.dataset.pv; else d = b.dataset.pv; draw(); });
    TR.on(pane, 'click', '[data-kc]', (e, b) => { [f, d] = b.dataset.kc.split('|'); draw(); });
    draw();
  }
  function kanoCoef(c) {
    const base = (c.A || 0) + (c.O || 0) + (c.M || 0) + (c.I || 0);
    return base ? { better: ((c.A || 0) + (c.O || 0)) / base, worse: ((c.O || 0) + (c.M || 0)) / base } : { better: 0, worse: 0 };
  }
  function coefSVG(k) {
    const X = v => 40 + v * 250, Y = v => 270 - v * 250;
    let s = `<svg viewBox="0 0 300 300" width="100%" style="max-width:320px;display:block" role="img" aria-label="Коэффициенты удовлетворённости">`;
    s += `<rect x="40" y="20" width="250" height="250" style="fill:none;stroke:var(--border)"/><line x1="${X(.5)}" y1="20" x2="${X(.5)}" y2="270" style="stroke:var(--border);stroke-dasharray:4 4"/><line x1="40" y1="${Y(.5)}" x2="290" y2="${Y(.5)}" style="stroke:var(--border);stroke-dasharray:4 4"/>`;
    s += `<text x="${X(.25)}" y="${Y(.92)}" text-anchor="middle" style="fill:var(--ok);font-size:12px">привлекательное</text><text x="${X(.75)}" y="${Y(.92)}" text-anchor="middle" style="fill:var(--info);font-size:12px">одномерное</text>`;
    s += `<text x="${X(.25)}" y="${Y(.06)}" text-anchor="middle" style="fill:var(--text-muted);font-size:12px">безразличное</text><text x="${X(.75)}" y="${Y(.06)}" text-anchor="middle" style="fill:var(--violet);font-size:12px">обязательное</text>`;
    s += `<text x="165" y="292" text-anchor="middle" style="fill:var(--text-2);font-size:11.5px">насколько расстроит отсутствие →</text>`;
    s += `<text transform="translate(18 145) rotate(-90)" text-anchor="middle" style="fill:var(--text-2);font-size:11.5px">насколько порадует наличие →</text>`;
    s += `<circle cx="${X(k.worse)}" cy="${Y(k.better)}" r="8" style="fill:var(--accent);stroke:var(--surface);stroke-width:2"/>`;
    return s + '</svg>';
  }
  function drawCount(pane) {
    const c = { M: 2, O: 4, A: 9, I: 4, R: 1, Q: 0 };
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Свойство «Уведомление „ребёнок поел“», ответили 20 родителей. Категорию каждого человека уже посчитали по таблице. Меняйте числа кнопками − и + и смотрите на итог.</p>
      <div class="tch-cnt" data-c></div>
      <div class="grid2" style="align-items:start"><div data-r></div><div class="board" style="padding:8px" data-g></div></div>
      ${ui.note('info', 'Как читать', 'Простое правило — по большинству. Сомнительные ответы (Q) отбрасывают, а если их много — вопрос сформулирован плохо. Коэффициенты (Бергер и соавторы, 1993) уточняют, когда категории почти равны: «порадует» = (привл. + одном.) ÷ (привл. + одном. + обяз. + безр.), «расстроит» = (одном. + обяз.) ÷ та же сумма.')}
    </div>`;
    function draw() {
      const tot = KORD.reduce((s, k) => s + c[k], 0);
      const mode = KORD.filter(k => k !== 'Q').slice().sort((a, b) => c[b] - c[a])[0];
      const top = KORD.filter(k => k !== 'Q').map(k => c[k]).sort((a, b) => b - a);
      const k = kanoCoef(c);
      TR.$('[data-c]', pane).innerHTML = KORD.map(x => `<div class="tch-cn" style="border-left-color:${KC[x].col}"><span>${esc(KC[x].t)}</span><span class="v">${c[x]}</span><span class="pm"><button type="button" data-cm="${x}|-1" aria-label="Меньше">−</button><button type="button" data-cm="${x}|1" aria-label="Больше">+</button></span></div>`).join('');
      TR.$('[data-r]', pane).innerHTML = `<div class="stack tight"><div class="tch-kres" style="border-left-color:${KC[mode].col}"><span class="small dim">Всего ответов: ${tot}. По большинству:</span><span class="c" style="color:${KC[mode].col}">${esc(KC[mode].t)}</span><span class="small">«Порадует»: <b>${nf(k.better)}</b> · «расстроит»: <b>${nf(k.worse)}</b></span></div>
        ${top[0] - top[1] <= 1 ? ui.note('warn', 'Почти поровну', 'Две категории идут вровень. Смотрите на коэффициенты и на группы ответивших: возможно, у разных людей разное отношение.') : ''}
        ${c.Q >= 3 ? ui.note('warn', 'Много сомнительных', 'Люди противоречат себе — проверьте формулировку вопроса.') : ''}</div>`;
      TR.$('[data-g]', pane).innerHTML = coefSVG(k);
    }
    TR.on(pane, 'click', '[data-cm]', (e, b) => { const [x, d] = b.dataset.cm.split('|'); c[x] = Math.max(0, Math.min(40, c[x] + (+d))); draw(); });
    draw();
  }
  const WHO = [
    { t: 'Родители 30–45 лет', n: 140, on: 140, p: 64 },
    { t: 'Бабушки и дедушки', n: 60, on: 6, p: 52 },
    { t: 'Опекуны и другие', n: 20, on: 12, p: 16 }
  ];
  function drawSample(pane) {
    let ch = 'chat';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Свойство «Оплата наличными у кассы». Обеды забирают и оплачивают 220 взрослых. Опрос можно разослать в родительский чат или ещё и раздать бумажные анкеты в столовой.</p>
      <div class="row">${ui.seg('ch', [{ v: 'chat', t: 'Только опрос в чате' }, { v: 'both', t: 'Чат + бумажные анкеты в столовой' }], ch, 'accent')}</div>
      <div class="tch-bars" data-b></div><div data-r></div>
    </div>`;
    function draw() {
      const rows = WHO.map(w => ({ w, got: ch === 'chat' ? w.on : Math.round(w.n * 0.8) }));
      const total = rows.reduce((s, r) => s + r.got, 0);
      // для бабушек наличные — обязательное, для родителей — безразличное
      const mustN = rows.reduce((s, r) => s + Math.round(r.got * (r.w.t.startsWith('Бабушки') ? .8 : r.w.t.startsWith('Опекуны') ? .4 : .12)), 0);
      const share = total ? mustN / total : 0;
      TR.$('[data-b]', pane).innerHTML = rows.map(r => `<div class="tch-bar"><span>${esc(r.w.t)}</span><span class="t"><i style="width:${r.got / r.w.n * 100}%"></i></span><span class="n">${r.got} из ${r.w.n}</span></div>`).join('');
      TR.$('[data-r]', pane).innerHTML = ch === 'chat'
        ? ui.note('bad', `Итог: «безразличное» — обязательным его назвали ${pct(share)}`, 'В чате сидят родители — им всё равно, они платят картой. Бабушки в чате почти не отвечают. По такой анкете наличные «можно убрать» — и больше четверти тех, кто забирает обеды, останутся без способа оплаты. Это смещение выборки: ответили не те, кого касается.')
        : ui.note('ok', `Итог: для бабушек и дедушек — «обязательное», всего ${pct(share)} ответов`, 'Бумажные анкеты в столовой достали тех, кого нет в чате. Видно: у разных групп разное отношение — значит, смотреть надо по группам, а не одним числом на всех.');
    }
    ui.onSeg(pane, (n, v) => { ch = v; draw(); });
    draw();
  }
  const howKano = {
    id: 'how-kano', covers: ['kano'], title: 'Как это работает: анкета по модели Кано', free: true, noReset: true,
    simple: {
      icon: '📋',
      plain: 'Анкета — способ услышать сотни людей. Чтобы понять не только «нравится ли», но и «уйдут ли без этого», модель Кано спрашивает про каждое свойство дважды: как вам, если оно есть, и как вам, если его нет. По паре ответов свойство попадает в одну из категорий. И важно, кто ответил: если анкету видели не все, цифры обманут.',
      analogy: 'Хозяйка пекарни спрашивает покупателей про свежий хлеб и про бесплатную воду. Про хлеб: «есть — так и должно быть, нет — уйду». Про воду: «есть — приятно, нет — ничего страшного». Хлеб — обязательный, вода — приятный бонус. А если спросить только тех, кто пришёл вечером, утренние покупатели в ответы не попадут.',
      tech: '<b>Модель Кано</b> (Нориаки Кано, 1984): пара вопросов — функциональный («если есть») и дисфункциональный («если нет») — и таблица оценки 5×5 дают категории: обязательное (M), одномерное (O), привлекательное (A), безразличное (I), обратное (R), сомнительное (Q). Итог по свойству — по большинству или по коэффициентам удовлетворённости (Бергер и соавторы, 1993). На неделе 2 вы различали явные, неявные и восхищающие требования — это те же категории; здесь — как их измерить анкетой. Как из категорий строить порядок работ — неделя 4, «Ценность и приоритеты».'
    },
    lead: ui.brief({
      situation: 'Школьная столовая готовит анкету для родителей о будущем приложении: что для них обязательно, что приятно, а что всё равно.',
      todo: [
        '«Пара вопросов»: переключите четыре свойства и посмотрите, как звучит пара вопросов. Нажмите «Как спрашивать нельзя».',
        '«Таблица 5×5»: выберите ответы кнопками или нажмите на клетки; найдите все шесть категорий.',
        '«Считаем ответы»: меняйте числа и смотрите, как меняется итог и точка на графике.',
        '«Кто ответил»: переключите канал опроса и сравните итог.'
      ],
      look: 'Строки таблицы — ответ «если есть», столбцы — «если нет». На графике: вверху — то, что радует, справа — то, без чего расстроятся.'
    }),
    render(el) {
      el.classList.add('tch-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'pair', t: 'Пара вопросов', render: fresh(drawPair) },
        { id: 'tbl', t: 'Таблица 5×5', render: fresh(drawKTable) },
        { id: 'cnt', t: 'Считаем ответы', render: fresh(drawCount) },
        { id: 'smp', t: 'Кто ответил', render: fresh(drawSample) }
      ], 'pair');
    }
  };

  // =====================================================================
  // Теория 3. План выявления: порядок, люди, время
  // =====================================================================
  const STEPS7 = [
    { t: 'Прочитать', tech: 'анализ документов и данных', know: 'термины, правила на бумаге, цифры: сколько обедов, сколько остаётся', skip: 'на встречах спрашиваете то, что давно записано, — и тратите доверие' },
    { t: 'Спросить', tech: 'интервью с ключевыми людьми', know: 'цели, правила, проблемы и «почему»: завуч, повар, бухгалтер', skip: 'не знаете целей — дальше всё мимо: анкета не о том, воркшоп без повестки' },
    { t: 'Посмотреть', tech: 'наблюдение', know: 'как на самом деле: очередь на перемене, раздача, оплата, обходные пути', skip: 'неявные требования всплывут после запуска («а кто раздаёт заказанное?»)' },
    { t: 'Посчитать', tech: 'анкета, анализ данных', know: 'сколько людей и насколько им это важно', skip: 'спорите мнениями: «всем нужно» против «никому не нужно»' },
    { t: 'Договориться', tech: 'воркшоп', know: 'общие правила и решения по спорным местам', skip: 'противоречия (завуч против повара) уходят в разработку и всплывают на демо' },
    { t: 'Проверить', tech: 'прототип', know: 'понимают ли люди экран, где спотыкаются', skip: 'ошибки удобства находят на пилоте — исправлять в разы дороже' },
    { t: 'Согласовать', tech: 'встреча и письмо-итог', know: 'подписанный объём первой версии', skip: 'обследование не закрыто: каждый помнит договорённости по-своему' }
  ];
  function drawOrder(pane) {
    let cur = 0;
    const skip = new Set();
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Хороший план идёт от дешёвого к дорогому и от понимания к решению. Пройдите шаги и попробуйте пропустить какой-нибудь.</p>
      <div class="tch-steps" data-s></div>
      <div data-c></div>
      <div class="row"><button type="button" class="btn sm" data-sv="-1">← Назад</button><button type="button" class="btn sm primary" data-sv="1">Дальше →</button><label class="toggle"><input type="checkbox" data-sk> <span>Пропустить этот шаг</span></label></div>
      <div data-sum></div>
    </div>`;
    function draw() {
      const s = STEPS7[cur];
      TR.$('[data-s]', pane).innerHTML = STEPS7.map((x, i) => `<button type="button" class="tch-st ${skip.has(i) ? 'skip' : ''}" data-si="${i}" aria-pressed="${i === cur}"><span class="n">${i + 1}</span><span>${esc(x.t)}</span></button>`).join('');
      TR.$('[data-c]', pane).innerHTML = `<div class="tch-det"><h4>${cur + 1}. ${esc(s.t)}</h4><div class="tch-kv"><span class="k">Техники</span><span>${esc(s.tech)}</span><span class="k">Что знаем после</span><span>${esc(s.know)}</span></div>${skip.has(cur) ? ui.note('bad', 'Если пропустить', esc(s.skip)) : ''}</div>`;
      TR.$('[data-sk]', pane).checked = skip.has(cur);
      TR.$('[data-sum]', pane).innerHTML = skip.size ? ui.note('warn', `Пропущено шагов: ${skip.size}`, Array.from(skip).sort().map(i => `<b>${esc(STEPS7[i].t)}</b> — ${esc(STEPS7[i].skip)}`).join('<br>')) : ui.note('info', 'Это не жёсткий конвейер', 'Шаги пересекаются: интервью и наблюдение идут вперемешку, анкета собирается фоном неделю, после прототипа иногда возвращаются к интервью. Но порядок «сначала понять — потом решать — потом проверить» держится всегда.');
    }
    TR.on(pane, 'click', '[data-si]', (e, b) => { cur = +b.dataset.si; draw(); });
    TR.on(pane, 'click', '[data-sv]', (e, b) => { cur = Math.max(0, Math.min(STEPS7.length - 1, cur + (+b.dataset.sv))); draw(); });
    pane.addEventListener('change', e => { if (e.target.matches('[data-sk]')) { if (e.target.checked) skip.add(cur); else skip.delete(cur); draw(); } });
    draw();
  }
  const PLANS = {
    bad: [
      { d: 'День 1', t: 'Анкета всем 600 родителям: «Нужен ли вам предзаказ?»', w: 'Анкета до интервью: не знаете, о чём спрашивать. И вопрос «да / нет» — все скажут «да».' },
      { d: 'День 2', t: 'Кликабельный прототип приложения', w: 'Рисуете решение, ещё не поняв проблему. Потом жалко выбрасывать.' },
      { d: 'День 3', t: 'Воркшоп со всеми: завуч, повар, бухгалтер, родком', w: 'Воркшоп до интервью: спорят мнениями, повестки нет, решений нет.' },
      { d: 'Дни 4–5', t: 'Интервью с завучем', w: 'Цели и правила узнаёте последними — половину сделанного придётся переделать.' },
      { d: 'Дни 6–9', t: 'Пишем документ', w: 'Повар и раздача не услышаны вовсе: никто не видел большую перемену. Бабушки, которые забирают обеды, — тоже.' },
      { d: 'День 10', t: 'Отправили документ завучу', w: 'Без согласования: «отправили» — не значит «договорились».' }
    ],
    good: [
      { d: 'День 1', t: 'Прочитать: меню, правила питания, договор с поставщиком, журнал выдачи за год' },
      { d: 'День 2', t: 'Интервью: завуч (цели, правила), повар (раздача, сроки заказа продуктов)' },
      { d: 'День 3', t: 'Наблюдение: большая перемена в столовой + интервью с бухгалтером' },
      { d: 'День 4', t: 'Анализ систем: электронный дневник и школьная система оплаты' },
      { d: 'Дни 5–9', t: 'Анкета: чат + бумажные анкеты в столовой, сбор неделю фоном' },
      { d: 'День 6', t: 'Воркшоп: завуч, повар, бухгалтер, родком — правила заказа и отмены' },
      { d: 'День 8', t: 'Прототип на бумаге: пять родителей и две бабушки' },
      { d: 'День 10', t: 'Согласование объёма с завучем, письмо-итог всем' }
    ]
  };
  function drawPlans(pane) {
    let cur = 'bad', pick = -1;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Две недели обследования в школьной столовой. Одинаковое время, разный порядок. В плохом плане нажмите на красные строки.</p>
      <div class="row">${ui.seg('pl', [{ v: 'bad', t: 'Плохой план' }, { v: 'good', t: 'Хороший план' }], cur, 'accent')}</div>
      <div class="tch-days" data-d></div><div data-w></div>
    </div>`;
    function draw() {
      TR.$('[data-d]', pane).innerHTML = PLANS[cur].map((x, i) => cur === 'bad'
        ? `<button type="button" class="tch-day bad" data-pi="${i}" aria-pressed="${pick === i}"><span class="d">${esc(x.d)}</span><span>${esc(x.t)}</span></button>`
        : `<div class="tch-day good"><span class="d">${esc(x.d)}</span><span>${esc(x.t)}</span></div>`).join('');
      TR.$('[data-w]', pane).innerHTML = cur === 'bad'
        ? (pick >= 0 ? ui.note('bad', 'Что не так', esc(PLANS.bad[pick].w)) : ui.note('info', 'Нажмите на строку', 'В каждой строке плохого плана есть ошибка порядка или пропуск.'))
        : ui.note('ok', 'Почему так лучше', 'Сначала дёшево и широко: документы, ключевые люди, как на самом деле. Потом — цифры (анкета собирается фоном) и договорённости между людьми. Потом проверка решения на тех, кто будет им пользоваться, включая бабушек. В конце — согласование. Услышаны завуч, повар, бухгалтер, родители, бабушки, учтены чужие системы.');
    }
    ui.onSeg(pane, (n, v) => { cur = v; pick = -1; draw(); });
    TR.on(pane, 'click', '[data-pi]', (e, b) => { pick = +b.dataset.pi; draw(); });
    draw();
  }
  function drawCost(pane) {
    let n = 6;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Сколько стоит услышать N человек разными способами. Часы аналитика — это деньги проекта, часы участников — время занятых людей, которое у них тоже не бесконечное. Цифры примерные.</p>
      <label class="stack tight"><span class="small" data-nl></span><input type="range" class="tch-calc" min="2" max="30" value="${n}" data-n aria-label="Сколько человек услышать"></label>
      <div data-t></div>
    </div>`;
    function draw() {
      const groups = Math.ceil(n / 8);
      const rows = [
        ['Интервью по одному', n + ' × 2,5 ч = ' + nf(n * 2.5), n + ' ч', 'глубина и «почему» от каждого'],
        ['Фокус-группа (до 8 человек)', groups + ' × 12 ч = ' + groups * 12, n * 2 + ' ч', 'отношение и споры внутри группы'],
        ['Воркшоп (до 8 человек)', n <= 8 ? '14' : '— больше 8 человек не договорятся', n <= 8 ? n * 3 + ' ч' : '—', 'согласие по спорным правилам'],
        ['Анкета', '16 — от числа людей почти не зависит', nf(n * 0.1) + ' ч', 'цифры, но без «почему»']
      ];
      TR.$('[data-nl]', pane).innerHTML = `Сколько человек услышать: <b>${n}</b>`;
      TR.$('[data-t]', pane).innerHTML = ui.table(['Способ', 'Часы аналитика', 'Часы участников', 'Что получим'], rows)
        + ui.note('info', 'Вывод', n <= 4 ? 'Людей мало — интервью по одному дешевле и глубже всего.' : n <= 8 ? 'Интервью уже дороже фокус-группы и воркшопа. Если людям надо договориться между собой — воркшоп; если понять отношение — фокус-группа.' : 'Людей много — интервью с каждым не потянуть. Ключевых — интервью, остальных — анкета, спорящих — на воркшоп.');
    }
    TR.$('[data-n]', pane).addEventListener('input', e => { n = +e.target.value; draw(); });
    draw();
  }
  const howPlan = {
    id: 'how-plan', covers: ['plan', 'why'], title: 'Как это работает: план выявления — порядок, люди, время', free: true, noReset: true,
    simple: {
      icon: '🗓️',
      plain: 'План выявления отвечает на вопросы: какие техники, с кем, в каком порядке и сколько это займёт. Сначала читаем и спрашиваем, потом смотрим и считаем, потом договариваемся и проверяем, в конце согласуем. И честно пишем, чего не узнаем, если на что-то не хватит времени.',
      analogy: 'Как готовить праздничный стол: сначала спросить гостей про аллергии, потом посмотреть, что есть в холодильнике, потом купить продукты, потом готовить и пробовать. Если сначала купить продукты, а потом спросить про аллергии, половина покупок окажется лишней.',
      tech: 'В BABOK v3 это задача «Подготовка к выявлению» (Prepare for Elicitation): цель, техники, участники, логистика, материалы; затем проведение, подтверждение результатов (письмо-итог, согласование) и передача. Результат — <b>план выявления</b>: таблица «техника — с кем — когда — цель — что получим». Опора — PRACTICES.md §2.1–2.3.'
    },
    lead: ui.brief({
      situation: 'Школьная столовая, две недели обследования. Три вкладки: в каком порядке, как выглядит плохой и хороший план и сколько стоит услышать людей.',
      todo: [
        '«Порядок»: пройдите семь шагов кнопкой «Дальше»; на любом шаге отметьте «Пропустить» и прочитайте последствия.',
        '«Плохой план и хороший»: в плохом плане нажмите на каждую красную строку, потом переключитесь на хороший.',
        '«Сколько стоит»: двигайте ползунок от 2 до 30 человек и смотрите, какой способ дешевле.'
      ],
      look: 'Зачёркнутый шаг — пропущенный: внизу копится список того, что сломается. В расчёте два вида цены — часы аналитика и часы участников.'
    }),
    render(el) {
      el.classList.add('tch-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'ord', t: 'Порядок', render: fresh(drawOrder) },
        { id: 'pl', t: 'Плохой план и хороший', render: fresh(drawPlans) },
        { id: 'cost', t: 'Сколько стоит', render: fresh(drawCost) }
      ], 'ord');
    }
  };

  // =====================================================================
  // Практика 1. Подобрать технику к восьми ситуациям «Колоса»
  // =====================================================================
  const PS = [
    { id: 's1', t: 'Узнать, что думают о предзаказе 18 тыс. подписчиков «Колоса» во ВКонтакте', ok: 'survey' },
    { id: 's2', t: 'Понять, как Олег Петрович каждое утро два часа сводит продажи девяти пекарен в Excel', ok: 'obs', alt: { docs: [1, 'Его файлы Excel и выгрузки «КассаПро» — тоже хороший ход: увидите формат. Но где именно уходят два часа, покажет наблюдение. Засчитано, а лучше вместе.'], int: [0.5, 'Олег Петрович расскажет, как должно быть, а лишние ручные шаги пропустит — они для него привычны. Лучше сесть рядом в 07:00.'] } },
    { id: 's3', t: 'Договориться Рите и Галине Ивановне о скидке на выпечку после 19:00', ok: 'ws' },
    { id: 's4', t: 'Проверить, поймут ли покупатели старше 55 экран заказа', ok: 'proto', alt: { focus: [0.5, 'Обсудят охотно, но не покажут, где споткнутся. Дайте черновик экрана в руки.'] } },
    { id: 's5', t: 'Узнать, что умеет API «КассаПро» и какие у вендора правила интеграции', ok: 'sys', alt: { docs: [1, 'Документация API и регламент — тоже документы: засчитано. Анализ документов и анализ интерфейсов здесь идут рука об руку.'], int: [0.5, 'Созвон с вендором поможет, но правила интеграции записаны в их документации — начните с неё.'] } },
    { id: 's6', t: 'Разобрать тетрадь тортов за прошлый март: сколько было заказов и какие ошибки', ok: 'docs', alt: { data: [0.5, 'Переписав тетрадь в таблицу, вы получите данные для подсчёта. Но начинается всё с чтения документа.'] } },
    { id: 's7', t: 'Понять, как устроен предзаказ у «Додо» и сетевых кофеен, — Нина пишет «как у Додо»', ok: 'comp', alt: { sys: [0.5, 'Разобрать приложение «Додо» как систему — близко. Но цель здесь — идеи и ожидания покупателей, а не интеграция.'] } },
    { id: 's8', t: 'Обсудить с 6–8 постоянными покупателями замену бумажных карточек баллами', ok: 'focus', alt: { int: [0.5, 'Интервью по одному глубже, но дольше; в группе видно, как мнения цепляются друг за друга.'], survey: [0.5, 'Анкета даст цифры, но не объяснит «почему». Хороша после фокус-группы.'] } }
  ];
  const PHINT = {
    survey: 'Сколько людей надо услышать? Можно ли поговорить с каждым лично?',
    obs: 'Он расскажет, как привык. А что, если просто сесть рядом и посмотреть?',
    ws: 'Двое с противоположными позициями. Где они услышат интересы друг друга и договорятся при ведущем?',
    proto: 'Как узнать, поймёт ли человек экран, — спросить его или дать попробовать?',
    sys: 'Здесь не люди, а чужая программа и её правила обмена. Что изучать?',
    docs: 'Всё уже записано. Что сделать с записями в первую очередь?',
    comp: 'Это не про «Колос», а про других. Как изучают чужие решения?',
    focus: 'Шесть-восемь человек одновременно, обсуждение отношения и мотивов — какой формат?'
  };
  function pickEval(ans) {
    const v = (ans && ans.v) || {};
    const rows = PS.map(s => { const g = v[s.id], a = s.alt && s.alt[g], p = g === s.ok ? 1 : a ? a[0] : 0; return { s, g, p, a, st: !g ? 'empty' : p === 1 ? 'ok' : p ? 'warn' : 'bad' }; });
    return { rows, score: rows.reduce((x, r) => x + r.p, 0) / PS.length };
  }
  const pickTask = {
    id: 'pick', title: 'Подберите технику к восьми ситуациям',
    simple: howMap.simple,
    lead: ui.brief({
      situation: 'Ксения выписала на доску восемь вопросов, на которые надо ответить за обследование. «Для каждого — своя техника. Ошибёмся — потратим день и узнаем не то».',
      todo: [
        'Для каждой ситуации выберите в списке технику, которая подходит лучше всего.',
        'Нажмите «Проверить». Засчитывается от 80 %. Где практики честно спорят, второй вариант тоже засчитывается — полностью или наполовину, с пояснением.'
      ],
      look: 'Вспомните четыре вопроса из теории: кого надо услышать, что нужно узнать, где мы сейчас и сколько есть времени. Три техники из списка здесь не понадобятся.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(PS.map(s => [s.id, s.ok])) }),
    render(el, ctx) {
      el.classList.add('tch-root');
      const a = ctx.ans; a.v = a.v || {};
      let reveal = null;
      if (ctx.result) { reveal = {}; pickEval(a).rows.forEach(r => { if (r.g) reveal[r.s.id] = { s: r.st, why: r.a ? r.a[1] : r.st === 'bad' ? PHINT[r.s.ok] : '' }; }); }
      const m = document.createElement('div'); el.appendChild(m);
      ui.match(m, { rows: PS.map(s => ({ id: s.id, t: esc(s.t) })), choices: TECH.map(t => ({ v: t.id, t: t.t })), value: a.v, reveal, readonly: ctx.readonly, placeholder: 'Техника…', onChange: v => { a.v = v; ctx.save(); } });
    },
    check(ans) {
      const ev = pickEval(ans), notes = [];
      const empty = ev.rows.filter(r => r.st === 'empty').length;
      if (empty) notes.push({ ok: false, html: `Не выбрано для ${empty} из ${PS.length} ситуаций.` });
      ev.rows.forEach(r => {
        if (r.st === 'bad') notes.push({ ok: false, html: `«${esc(r.s.t)}» — ${esc(PHINT[r.s.ok])}` });
        else if (r.a) notes.push({ ok: r.p === 1 ? true : 'warn', html: `«${esc(r.s.t)}» — ${esc(r.a[1])}` });
      });
      const ok = ev.score >= 0.8;
      return {
        ok, score: ev.score, notes,
        summary: `Точно: ${ev.rows.filter(r => r.g === r.s.ok).length} из ${PS.length}; спорно, но засчитано: ${ev.rows.filter(r => r.a).length}.`,
        mentor: ev.rows.some(r => r.s.id === 's1' && r.g === 'int') ? 'Восемнадцать тысяч интервью — это два года без выходных. Когда людей много, их считают анкетой, а «почему» узнают у нескольких.' : ok ? 'Заметьте: интервью не понадобилось ни разу. Это не значит, что оно плохое, — просто у каждой задачи свой инструмент, а интервью — только один из них.' : null
      };
    },
    explain: `${ui.table(['Ситуация', 'Техника', 'Почему'], [
        ['18 тыс. подписчиков ВКонтакте', 'Анкетирование', 'людей много, нужны цифры; не забыть бумажную анкету для тех, кого нет во ВКонтакте'],
        ['Как Олег сводит продажи', 'Наблюдение (+ его файлы)', 'привычные ручные шаги на словах пропускают'],
        ['Рита и Галина Ивановна', 'Воркшоп', 'противоположные позиции: договариваться вместе при ведущем, по интересам'],
        ['Поймут ли покупатели 55+ экран', 'Прототипирование', 'реакция на черновик в руках, а не на слова'],
        ['API и правила «КассаПро»', 'Анализ систем и интерфейсов (+ документы)', 'чужая система и её регламент'],
        ['Тетрадь тортов за март', 'Анализ документов', 'всё уже записано — прочитать и разобрать ошибки'],
        ['«Как у Додо»', 'Анализ конкурентов', 'идеи и ожидания покупателей; не копировать, а понять'],
        ['Карточки → баллы, 6–8 постоянных', 'Фокус-группа', 'отношение и мотивы группы; анкета — следом, для цифр']
      ])}
      <p>Не понадобились интервью, мозговой штурм и анализ данных — это не значит, что они хуже. Интервью с Ниной уже было; данные продаж нужны для плана выпечки; мозговой штурм — когда проблема понятна, а решений мало. Выбор техники — вопрос «кого услышать, что узнать, где мы и сколько времени», а не привычки. Источники: BABOK v3 (техники выявления); Вигерс и Битти — сочетать техники под тип заинтересованных лиц.</p>`,
    report: ans => pickEval(ans).rows.map(r => `- ${r.s.t} → ${(TBY[r.g] || { t: '—' }).t} ${r.st === 'ok' ? '✓' : r.st === 'warn' ? '≈' : '✗'}`).join('\n')
  };

  // =====================================================================
  // Практика 2. Разобрать мини-анкету по Кано
  // =====================================================================
  const KF = [
    { id: 'f1', t: 'Заказ по телефону через кассира', f: 'Если заказ можно оформить по телефону или у кассира — как вам?', d: 'Если так заказать нельзя, только в приложении, — как вам?', rows: [['must', 'dis', 7], ['neu', 'dis', 5], ['like', 'dis', 3], ['neu', 'neu', 5]], note: 'Из 12 человек, для которых это обязательное, 10 — старше 55: они заполняли бумажную анкету у кассы.' },
    { id: 'f2', t: 'Выбор получасового интервала выдачи', f: 'Если можно выбрать получасовой интервал, когда забрать заказ, — как вам?', d: 'Если интервал выбрать нельзя («заберёте в течение дня») — как вам?', rows: [['like', 'dis', 9], ['must', 'dis', 4], ['like', 'neu', 4], ['neu', 'neu', 3]] },
    { id: 'f3', t: 'SMS «Заказ готов»', f: 'Если придёт SMS «Заказ готов» — как вам?', d: 'Если SMS не придёт — как вам?', rows: [['like', 'neu', 8], ['like', 'live', 4], ['neu', 'neu', 5], ['like', 'dis', 3]] },
    { id: 'f4', t: 'Баллы вместо бумажных карточек', f: 'Если вместо бумажной карточки будут баллы в приложении — как вам?', d: 'Если баллов не будет, останется бумажная карточка, — как вам?', rows: [['neu', 'neu', 7], ['like', 'neu', 4], ['neu', 'live', 3], ['dis', 'like', 4], ['like', 'like', 2]] },
    { id: 'f5', t: 'Ежедневные push-уведомления об акциях', f: 'Если приложение каждый день присылает уведомления об акциях — как вам?', d: 'Если таких уведомлений не будет — как вам?', rows: [['dis', 'like', 8], ['live', 'neu', 4], ['dis', 'neu', 5], ['like', 'neu', 3]] }
  ];
  const KROWS = KF.reduce((a, f) => a.concat(f.rows.map((r, i) => ({ id: f.id + '-' + i, f: f.id, fa: r[0], da: r[1], n: r[2], cat: KT[r[0]][r[1]] }))), []);
  const KAT = Object.fromEntries(KA.map(a => [a.v, a.t]));
  const KQ1 = {
    q: 'Рита: «Баллы — самое важное! Без них приложение никто не скачает». Что ответить, опираясь на анкету?', seed: 'tch-kq1',
    options: [
      { t: '«По анкете баллы большинству безразличны, а четверых даже раздражают. Предлагаю не тратить на них первую версию — и вернуться к ним с данными о повторных покупках»', ok: 1, why: 'Да: данные вместо громкости голоса, и дверь не закрыта.' },
      { t: '«Анкета показала, что баллы не нужны. Вычёркиваем навсегда»', why: 'Одна анкета на 20 человек — не приговор, и категории со временем меняются. Не «навсегда», а «не сейчас».' },
      { t: '«Раз маркетолог уверена — ставим баллы в обязательное»', why: 'Уверенность — не данные. Для этого анкету и проводили.' },
      { t: '«Посчитаем без тех, кому всё равно, — тогда баллы станут привлекательными»', why: 'Это подгонка данных под желаемый ответ. Безразличие — тоже ответ.' }
    ]
  };
  const KQ2 = {
    q: 'Почему хорошо, что кроме опроса во ВКонтакте раздавали бумажные анкеты у кассы?', seed: 'tch-kq2',
    options: [
      { t: 'Иначе почти не ответили бы покупатели старше 55 — и заказ через кассира выглядел бы безразличным, хотя для них он обязательный', ok: 1, why: 'Да: смещение выборки. 40 % постоянных клиентов «Колоса» старше 55.' },
      { t: 'Бумажные анкеты дешевле онлайн-опроса', why: 'Дороже: их надо раздать, собрать и перенести в таблицу. Дело не в цене.' },
      { t: 'Так больше ответов, а чем больше ответов, тем точнее', why: 'Количество не спасает, если отвечают не те. Десять тысяч ответов только от молодых — всё равно смещённая картина.' },
      { t: 'Бумажным ответам можно больше доверять', why: 'Канал не делает ответ честнее. Важно, кто именно ответил.' }
    ]
  };
  const kMode = tally => KORD.filter(k => k !== 'Q').slice().sort((a, b) => tally[b] - tally[a])[0];
  function kanoEval(ans) {
    const c = (ans && ans.c) || {};
    const rows = KROWS.map(r => ({ r, g: c[r.id], s: !c[r.id] ? 'empty' : c[r.id] === r.cat ? 'ok' : 'bad' }));
    const part = rows.filter(x => x.s === 'ok').length / KROWS.length;
    const q1 = ui.quizScore(KQ1, (ans && ans.q1) || []), q2 = ui.quizScore(KQ2, (ans && ans.q2) || []);
    const feats = KF.map(f => {
      const fr = rows.filter(x => x.r.f === f.id), tally = Object.fromEntries(KORD.map(k => [k, 0])), truth = Object.fromEntries(KORD.map(k => [k, 0]));
      fr.forEach(x => { if (x.g) tally[x.g] += x.r.n; truth[x.r.cat] += x.r.n; });
      const done = fr.every(x => x.g);
      return { f, tally, truth, done, mine: done ? kMode(tally) : null, right: kMode(truth) };
    });
    return { rows, part, q1, q2, feats, score: part * 0.7 + q1.score * 0.15 + q2.score * 0.15 };
  }
  const kanoTask = {
    id: 'kano', title: 'Разберите мини-анкету по Кано',
    simple: howKano.simple,
    lead: ui.brief({
      situation: 'Рита за неделю собрала пробную анкету: 20 покупателей ответили на пары вопросов про пять возможных функций приложения — часть во ВКонтакте, часть на бумаге у кассы на Покровке. Цифры анкеты учебные. Ксения: «Разберите по таблице Кано — и посмотрим, кто прав в споре про баллы».',
      todo: [
        'Для каждой строки ответов выберите категорию по таблице Кано: строка таблицы — ответ «если есть», столбец — ответ «если нет». Таблица — под рамкой «Подсказка».',
        'Под каждой функцией появится подсчёт и итог по большинству.',
        'Ответьте на два вопроса внизу и нажмите «Проверить». Засчитывается от 80 % и верный ответ Рите.'
      ],
      look: 'Число справа — сколько человек ответили именно такой парой. Итог по функции — категория, набравшая больше всего человек; сомнительные ответы (Q) в итоге не участвуют. Порядок работ по Кано: обязательные → одномерные → привлекательные; безразличные и обратные не делают.'
    }),
    blank: () => ({ c: {}, q1: [], q2: [] }),
    reference: () => ({ c: Object.fromEntries(KROWS.map(r => [r.id, r.cat])), q1: quizRef(KQ1), q2: quizRef(KQ2) }),
    render(el, ctx) {
      el.classList.add('tch-root');
      const a = ctx.ans; a.c = a.c || {}; a.q1 = a.q1 || []; a.q2 = a.q2 || [];
      const judged = !!ctx.result;
      el.innerHTML = `<div class="stack">
        <details class="more"><summary>Подсказка: таблица Кано 5×5</summary><div>${kTable(null, null, false)}<div class="small muted">обяз. — обязательное (M), одном. — одномерное (O), привл. — привлекательное (A), безр. — безразличное (I), обр. — обратное (R), ? — сомнительный (Q).</div></div></details>
        <div class="stack" data-fs></div>
        <div class="card flat" data-q1></div><div class="card flat" data-q2></div>
      </div>`;
      function tallyHTML(fe) {
        return `<div class="tch-tally"><span class="small dim">Подсчёт:</span>${KORD.filter(k => fe.tally[k]).map(k => `<span class="chip" style="color:${KC[k].col}">${esc(KC[k].s)} ${fe.tally[k]}</span>`).join('') || '<span class="small dim">выберите категории</span>'}${fe.done ? `<span class="small">→ итог: <b style="color:${KC[fe.mine].col}">${esc(KC[fe.mine].t)}</b></span>` : ''}</div>`;
      }
      function draw() {
        const ev = kanoEval(a);
        TR.$('[data-fs]', el).innerHTML = KF.map(f => {
          const fe = ev.feats.find(x => x.f.id === f.id);
          return `<div class="tch-kf"><h4>${esc(f.t)}</h4><div class="qq">Если есть: «${esc(f.f)}»<br>Если нет: «${esc(f.d)}»</div>
            ${KROWS.filter(r => r.f === f.id).map(r => { const x = ev.rows.find(y => y.r.id === r.id); return `<div class="tch-kr ${judged && x.g ? x.s : ''}"><span>Есть: «${esc(KAT[r.fa])}» · нет: «${esc(KAT[r.da])}» <span class="n">— ${r.n} чел.</span></span>
              <select data-kr="${r.id}" aria-label="Категория" ${ctx.readonly ? 'disabled' : ''}><option value="">Категория…</option>${KORD.map(k => `<option value="${k}" ${a.c[r.id] === k ? 'selected' : ''}>${esc(KC[k].t)}</option>`).join('')}</select></div>`; }).join('')}
            <div data-tl="${f.id}">${tallyHTML(fe)}</div>${f.note ? `<div class="small muted">${esc(f.note)}</div>` : ''}</div>`;
        }).join('');
      }
      el.addEventListener('change', e => {
        const s = e.target.closest('select[data-kr]'); if (!s || ctx.readonly) return;
        if (s.value) a.c[s.dataset.kr] = s.value; else delete a.c[s.dataset.kr];
        s.closest('.tch-kr').classList.remove('ok', 'bad');
        ctx.save();
        const fid = s.dataset.kr.split('-')[0], fe = kanoEval(a).feats.find(x => x.f.id === fid);
        TR.$(`[data-tl="${fid}"]`, el).innerHTML = tallyHTML(fe);
      });
      draw();
      ui.quiz(TR.$('[data-q1]', el), Object.assign({}, KQ1, { value: a.q1, readonly: ctx.readonly, reveal: ctx.result, onChange: v => { a.q1 = v; ctx.save(); } }));
      ui.quiz(TR.$('[data-q2]', el), Object.assign({}, KQ2, { value: a.q2, readonly: ctx.readonly, reveal: ctx.result, onChange: v => { a.q2 = v; ctx.save(); } }));
    },
    check(ans) {
      const ev = kanoEval(ans), notes = [];
      const empty = ev.rows.filter(x => x.s === 'empty').length;
      if (empty) notes.push({ ok: false, html: `Не размечено строк: ${empty} из ${KROWS.length}.` });
      ev.feats.forEach(fe => {
        const bad = ev.rows.filter(x => x.r.f === fe.f.id && x.s === 'bad');
        if (!bad.length) { if (fe.done) notes.push({ ok: true, html: `«${esc(fe.f.t)}»: итог — ${esc(KC[fe.right].t.toLowerCase())}.` }); return; }
        notes.push({ ok: fe.done && fe.mine === fe.right ? 'warn' : false, html: `«${esc(fe.f.t)}»: ошибок в строках — ${bad.length}${fe.done && fe.mine === fe.right ? ' (итог всё равно сошёлся)' : ''}. Например, «есть: ${esc(KAT[bad[0].r.fa])} · нет: ${esc(KAT[bad[0].r.da])}» — найдите строку «${esc(KAT[bad[0].r.fa])}» и столбец «${esc(KAT[bad[0].r.da])}».` });
      });
      notes.push(ev.q1.ok ? { ok: true, html: 'Ответ Рите: верно.' } : { ok: false, html: 'Ответ Рите: что показала анкета про баллы — и значит ли это «никогда»?' });
      notes.push(ev.q2.ok ? { ok: true, html: 'Вопрос про бумажные анкеты: верно.' } : { ok: false, html: 'Бумажные анкеты: посмотрите на приписку под первой функцией — кто их заполнял?' });
      const ok = ev.score >= 0.8 && ev.q1.ok;
      return {
        ok, score: ev.score, notes,
        summary: `Строки: ${ev.rows.filter(x => x.s === 'ok').length} из ${KROWS.length}. Итоги по функциям: ${ev.feats.filter(fe => fe.done && fe.mine === fe.right).length} из ${KF.length}. Вопросы: ${(ev.q1.ok ? 1 : 0) + (ev.q2.ok ? 1 : 0)} из 2.`,
        mentor: ok ? 'Теперь у спора про баллы есть данные. Но помните: двадцать человек — это пробная анкета. Перед решением её стоит повторить на сотнях — с той же парой вопросов и тем же бумажным листом у кассы.' : null
      };
    },
    explain: `${ui.table(['Функция', 'Итог', 'Что это значит для «Колоса»'], [
        ['Заказ через кассира', '<b>Обязательное</b> (12 из 20)', 'без него уйдут — прежде всего покупатели 55+; в MVP (DOMAIN §4)'],
        ['Получасовой интервал', '<b>Одномерное</b> (9)', 'чем точнее и удобнее, тем довольнее; основа предзаказа'],
        ['SMS «Заказ готов»', '<b>Привлекательное</b> (12)', 'радует, но без него не уйдут — «можно позже» (Should)'],
        ['Баллы вместо карточек', '<b>Безразличное</b> (10), обратное у 4', 'не тратить первую версию; бумажные карточки пока работают'],
        ['Push об акциях каждый день', '<b>Обратное</b> (13)', 'не делать — или только по согласию и с отключением']
      ])}
      <p><b>Механика.</b> Пара ответов → клетка таблицы 5×5 → категория человека → итог по большинству (сомнительные отбрасываем). Если категории идут вровень — смотрят коэффициенты удовлетворённости (Бергер и соавторы, 1993) и группы ответивших.</p>
      <p><b>Кто ответил.</b> Без бумажных анкет у кассы заказ через кассира «утонул» бы: во ВКонтакте почти нет покупателей старше 55, а для них он обязательный. На неделе 2 эти категории назывались «неявное», «явное» и «восхищающее»; на неделе 4 по ним будем строить порядок работ. Цифры анкеты в задании учебные.</p>`,
    report: ans => { const ev = kanoEval(ans); return ev.feats.map(fe => `- ${fe.f.t}: ${fe.done ? KC[fe.mine].t : 'не размечено'}${fe.done && fe.mine === fe.right ? ' ✓' : ' ✗'}`).join('\n') + `\nСтрок верно: ${ev.rows.filter(x => x.s === 'ok').length} из ${KROWS.length}. Ответ Рите: ${ev.q1.ok ? 'верно' : 'неверно'}. Бумажные анкеты: ${ev.q2.ok ? 'верно' : 'неверно'}.`; }
  };

  // =====================================================================
  // Практика 3. Главная лаборатория: три недели обследования
  // =====================================================================
  const TOPICS = ['Бизнес и цели', 'Предзаказ', 'Торты на заказ', 'Производство', 'Деньги и учёт', 'Клиенты и лояльность', 'Пекарни и остатки', 'Качество и доступность', 'Наблюдение в пекарне', 'Доставка'];
  const TOPIC_REQ = TOPICS.slice(0, 9);
  const STK = { nina: 'Нина Сергеевна', pavel: 'Павел', cashiers: 'кассиры', galya: 'Галина Ивановна', oleg: 'Олег Петрович', rita: 'Рита', buyers55: 'покупатели 55+', kassapro: '«КассаПро»', buyers: 'покупатели', lesha: 'Лёша' };
  const WHO_REQ = ['nina', 'pavel', 'cashiers', 'galya', 'oleg', 'rita', 'buyers55', 'kassapro'];
  const CARDS = [
    { id: 'docs', ico: '📄', ty: 'rd', ab: 'Документы', t: 'Анализ документов: письмо Нины, тетрадь тортов, Excel плана выпечки, журнал списаний', sz: 1, top: ['Торты на заказ', 'Производство', 'Пекарни и остатки'], who: [] },
    { id: 'int-nina', ico: '🎙️', ty: 'int', ab: 'Нина', t: 'Интервью: Нина Сергеевна — цели, сроки, предзаказ, торты', sz: 0.5, top: ['Бизнес и цели', 'Предзаказ', 'Торты на заказ', 'Качество и доступность'], who: ['nina'] },
    { id: 'int-galya', ico: '🎙️', ty: 'int', ab: 'Галина', t: 'Интервью: Галина Ивановна — план выпечки, развоз, торты', sz: 0.5, top: ['Производство', 'Торты на заказ'], who: ['galya'] },
    { id: 'int-oleg', ico: '🎙️', ty: 'int', ab: 'Олег', t: 'Интервью: Олег Петрович — чеки, сверка, 1С, персональные данные', sz: 0.5, top: ['Деньги и учёт', 'Клиенты и лояльность'], who: ['oleg'] },
    { id: 'int-rita', ico: '🎙️', ty: 'int', ab: 'Рита', t: 'Интервью: Рита — покупатели, лояльность, ВКонтакте', sz: 0.5, top: ['Клиенты и лояльность'], who: ['rita'] },
    { id: 'int-lesha', ico: '🎙️', ty: 'int', ab: 'Лёша', t: 'Интервью: Лёша — доставка тортов', sz: 0.5, top: ['Доставка'], who: ['lesha'] },
    { id: 'obs-shop', ico: '👀', ty: 'obs', ab: 'Смена', t: 'Наблюдение: утренняя смена на Покровке', sz: 1, top: ['Наблюдение в пекарне', 'Пекарни и остатки', 'Предзаказ'], who: ['pavel', 'cashiers'] },
    { id: 'obs-ceh', ico: '👀', ty: 'obs', ab: 'Цех', t: 'Наблюдение: ночь в цеху, 03:00–07:00', sz: 1, top: ['Производство'], who: ['galya'] },
    { id: 'obs-oleg', ico: '👀', ty: 'obs', ab: 'Сверка', t: 'Наблюдение: утренняя сверка у Олега Петровича', sz: 0.5, top: ['Деньги и учёт'], who: ['oleg'] },
    { id: 'survey', ico: '📋', ty: 'cnt', ab: 'Анкета', t: 'Анкета покупателей по Кано: ВКонтакте + бумажная у кассы (сбор — неделя)', sz: 1, top: ['Клиенты и лояльность', 'Предзаказ', 'Качество и доступность'], who: ['buyers', 'buyers55'] },
    { id: 'survey-vk', ico: '📋', ty: 'cnt', ab: 'Анкета ВК', t: 'Анкета только во ВКонтакте (сбор — неделя)', sz: 0.5, top: ['Клиенты и лояльность', 'Предзаказ'], who: ['buyers'] },
    { id: 'focus', ico: '🗣️', ty: 'grp', ab: 'Фокус-группа', t: 'Фокус-группа: 6–8 постоянных покупателей', sz: 1, top: ['Клиенты и лояльность', 'Качество и доступность'], who: ['buyers', 'buyers55'] },
    { id: 'kassa', ico: '🔌', ty: 'rd', ab: 'КассаПро', t: 'Анализ «КассаПро»: API, регламент интеграции, сертификация', sz: 1, top: ['Деньги и учёт'], who: ['kassapro'] },
    { id: 'data', ico: '📊', ty: 'rd', ab: 'Данные', t: 'Анализ данных: чеки «КассаПро» за год — продажи по часам и пекарням', sz: 1, top: ['Производство', 'Пекарни и остатки', 'Бизнес и цели'], who: [] },
    { id: 'comp', ico: '🔍', ty: 'rd', ab: 'Конкуренты', t: 'Анализ конкурентов: «Додо», кофейни, сетевые пекарни', sz: 1, top: ['Предзаказ'], who: [] },
    { id: 'brain', ico: '💡', ty: 'grp', ab: 'Штурм', t: 'Мозговой штурм с командой «Квант Софт»', sz: 0.5, top: ['Клиенты и лояльность'], who: [] },
    { id: 'ws', ico: '🤝', ty: 'grp', ab: 'Воркшоп', t: 'Воркшоп: правила предзаказа и противоречия — Нина, Павел, Галина Ивановна, Рита, Олег Петрович', sz: 1, top: ['Предзаказ', 'Деньги и учёт', 'Производство'], who: ['nina', 'pavel', 'galya', 'rita', 'oleg'] },
    { id: 'proto', ico: '🧪', ty: 'grp', ab: 'Прототип 55+', t: 'Прототип экрана заказа: проверка на пяти покупателях старше 55', sz: 1.5, top: ['Качество и доступность', 'Предзаказ'], who: ['buyers', 'buyers55'] },
    { id: 'proto-k', ico: '🧪', ty: 'grp', ab: 'Прототип кассы', t: 'Прототип экрана кассира: проверка у прилавка, в перчатках', sz: 1, top: ['Пекарни и остатки', 'Качество и доступность'], who: ['cashiers', 'pavel'] },
    { id: 'agree', ico: '✍️', ty: 'grp', ab: 'Согласование', t: 'Согласование объёма первой версии с Ниной Сергеевной', sz: 0.5, top: ['Бизнес и цели'], who: ['nina'] }
  ];
  const CBY = Object.fromEntries(CARDS.map(c => [c.id, c]));
  const CAP = { 1: 5, 2: 5, 3: 3 };
  const TOPIC_RISK = {
    'Бизнес и цели': 'Не знаем целей и метрик Нины — не докажем, что первая версия их двигает.',
    'Предзаказ': 'Правила предзаказа (22:30, интервалы, 30 минут) останутся догадками.',
    'Торты на заказ': 'Не разберём, почему теряются 2–3 торта в неделю, — 8 Марта повторится.',
    'Производство': 'План выпечки в 23:00 и «круассаны не раньше 07:30» — пообещаем покупателям невозможное.',
    'Деньги и учёт': '54-ФЗ, сверка и 1С мимо — штрафы и ручная сверка останутся.',
    'Клиенты и лояльность': 'Не узнаем, что важно покупателям, — спор о баллах решит громкость голоса.',
    'Пекарни и остатки': 'Остатки, обучение кассиров, обрывы связи мимо — экран кассира не выдержит утра на Покровке.',
    'Качество и доступность': 'Не проверим, поймут ли экран покупатели постарше и что значит «не тормозит».',
    'Наблюдение в пекарне': 'Не увидим «отложи мне», пакеты под прилавком и кассу без связи — неявные требования всплывут на пилоте.'
  };
  const WHO_RISK = {
    nina: 'Нина Сергеевна не услышана — нет целей, и объём некому подписать.',
    pavel: 'Павел не услышан — операционка пекарни мимо.',
    cashiers: 'Кассиры не услышаны — а им каждый день работать с экраном выдачи.',
    galya: 'Галина Ивановна не услышана — план выпечки и мощность цеха мимо.',
    oleg: 'Олег Петрович не услышан — 54-ФЗ и сверка мимо.',
    rita: 'Рита не услышана — лояльность и ВКонтакте без источника.',
    buyers55: '40 % постоянных покупателей старше 55 — их голос не услышим.',
    kassapro: 'Правила интеграции «КассаПро» и 3 недели сертификации узнаем на разработке — сорвём пилот 1 февраля.'
  };
  function planEval(ans) {
    const w = (ans && ans.w) || {};
    const wk = id => w[id] || 0, inPlan = id => [1, 2, 3].includes(w[id]);
    const used = { 1: 0, 2: 0, 3: 0 };
    CARDS.forEach(c => { if (inPlan(c.id)) used[w[c.id]] += c.sz; });
    const over = [1, 2, 3].filter(k => used[k] > CAP[k] + 1e-9);
    const topics = new Set(), who = new Set();
    CARDS.forEach(c => { if (inPlan(c.id)) { c.top.forEach(t => topics.add(t)); c.who.forEach(x => who.add(x)); } });
    const topicCov = TOPIC_REQ.filter(t => topics.has(t)).length / TOPIC_REQ.length;
    const whoCov = WHO_REQ.filter(x => who.has(x)).length / WHO_REQ.length;
    const R = [];
    const rule = (id, p, t) => R.push({ id, p, t });
    rule('docs', wk('docs') === 1 ? 1 : 0, !wk('docs') ? 'Без анализа документов придём на интервью неподготовленными.' : 'Документы — после встреч: на интервью спросим то, что можно было прочитать.');
    rule('nina', wk('int-nina') === 1 ? 1 : 0, !wk('int-nina') ? 'Нет интервью с Ниной — цели и ограничения спонсора не узнаем.' : 'Интервью с Ниной не в первую неделю — цели узнаем поздно, план может оказаться не про то.');
    rule('ws', [2, 3].includes(wk('ws')) ? 1 : 0, !wk('ws') ? 'Без воркшопа противоречия (Рита ↔ Галина Ивановна, Олег ↔ Нина, Павел ↔ Нина) уйдут в разработку нерешёнными.' : 'Воркшоп в первую неделю — до интервью и наблюдения: спорят мнениями, без фактов.');
    rule('proto', [2, 3].includes(wk('proto')) ? 1 : 0, !wk('proto') ? 'Не проверим экран заказа на покупателях постарше — узнаем на пилоте.' : 'Прототип в первую неделю — рисуем решение раньше, чем поняли проблему.');
    const sw = wk('survey') || wk('survey-vk');
    rule('survey', sw === 2 ? 1 : sw === 1 ? 0.5 : 0, !sw ? 'Без анкеты цифр по покупателям не будет — спорим мнениями.' : sw === 1 ? 'Анкета в первую неделю — до интервью: не знаем ещё, о чём спрашивать. Лучше во второй.' : 'Анкета в последнюю неделю — ответы не успеют собраться (нужна неделя).');
    rule('vk', wk('survey-vk') && !wk('survey') ? 0 : wk('survey-vk') && wk('survey') ? 0.5 : 1, wk('survey-vk') && wk('survey') ? 'Две анкеты сразу — лишние полдня: бумажная + ВКонтакте уже включает ВКонтакте.' : 'Анкета только во ВКонтакте — смещение выборки: 40 % постоянных старше 55 выпадут.');
    rule('agree', wk('agree') === 3 ? 1 : 0, !wk('agree') ? 'Объём первой версии не согласован — этап обследования не закрыт по договору.' : 'Согласование не в последнюю неделю — подписываем объём до того, как всё узнали.');
    const rules = R.reduce((s, r) => s + r.p, 0) / R.length;
    let score = 0.35 * topicCov + 0.3 * whoCov + 0.35 * rules;
    if (over.length) score *= 0.6;
    const undecided = CARDS.filter(c => w[c.id] == null).length;
    return { w, used, over, topics, who, topicCov, whoCov, R, rules, score: clamp(score), undecided };
  }
  const REF_PLAN = { docs: 1, 'int-nina': 1, 'int-galya': 1, 'int-oleg': 1, 'int-rita': 1, 'obs-shop': 1, 'obs-ceh': 1, survey: 2, kassa: 2, data: 2, ws: 2, 'obs-oleg': 2, proto: 3, 'proto-k': 3, agree: 3, 'survey-vk': 0, focus: 0, comp: 0, brain: 0, 'int-lesha': 0 };
  const DAYN = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'];
  function calHTML(ev) {
    return [1, 2, 3].map(k => {
      const slots = [], fixed = k === 3 ? 4 : 0, free = 10 - fixed;
      const list = CARDS.filter(c => ev.w[c.id] === k);
      let ovf = [];
      list.forEach(c => { const n = Math.round(c.sz * 2); if (slots.length + n <= free) for (let i = 0; i < n; i++) slots.push({ c, first: i === 0 }); else ovf.push(c); });
      while (slots.length < free) slots.push(null);
      for (let i = 0; i < fixed; i++) slots.push({ fix: 1, first: i === 0 || i === 2 });
      const days = DAYN.map((d, i) => `<div class="tch-dc"><span class="dn">${d}</span>${[slots[i * 2], slots[i * 2 + 1]].map(s => !s ? '<span class="tch-hs"></span>' : s.fix ? `<span class="tch-hs fix">${s.first ? 'процессы и документ' : ''}</span>` : `<span class="tch-hs ${s.c.ty}" title="${esc(s.c.t)}">${s.first ? esc(s.c.ab) : '…'}</span>`).join('')}</div>`).join('');
      const over = ev.used[k] > CAP[k] + 1e-9;
      return `<div class="tch-wk"><div class="h"><b>Неделя ${k}</b><span class="u ${over ? 'over' : ''}">${nf(ev.used[k])} из ${CAP[k]} дн.</span>${k === 3 ? '<span class="small dim">+2 дня — процессы и документ</span>' : ''}</div><div class="tch-cal">${days}</div>${ovf.length ? `<div class="tch-ovf">Не влезло: ${ovf.map(c => esc(c.ab)).join(', ')}</div>` : ''}</div>`;
    }).join('');
  }
  const planTask = {
    id: 'plan', title: 'Лаборатория: три недели обследования',
    simple: howPlan.simple,
    lead: ui.brief({
      situation: 'Договор с «Колосом»: обследование — 3 недели (15 рабочих дней) по фиксированной цене 600 тыс. ₽. Два последних дня третьей недели уже заняты: процессы «как есть» и «как будет» и документ объёма. На выявление остаётся 13 дней, а карточек — на 16. Игорь: «В понедельник покажу план Нине. Каждый лишний день — за наш счёт».',
      todo: [
        'Для каждой из 20 карточек нажмите «Неделя 1», «Неделя 2», «Неделя 3» — или «не делаем». Интервью и смену на Покровке, которые уже были, тоже ставьте в план: Нина хочет видеть всю картину.',
        'Следите за календарём (сколько дней занято), покрытием тем и людей и списком «Чего не узнаем». Он обновляется сразу.',
        'Нажмите «Проверить». Засчитывается от 80 %: ни одна неделя не переполнена, согласование объёма — в третью неделю.'
      ],
      look: 'В календаре половина клетки — полдня. Цвет — тип техники: синий — интервью, фиолетовый — наблюдение, жёлтый — анкета, зелёный — работа с группой, серый — документы и системы. Покрытие считается по темам блокнота и заинтересованным лицам; «Доставку» можно сознательно не изучать — её нет в первой версии.'
    }),
    blank: () => ({ w: {} }),
    reference: () => ({ w: Object.assign({}, REF_PLAN) }),
    render(el, ctx) {
      el.classList.add('tch-root');
      const a = ctx.ans; a.w = a.w || {};
      el.innerHTML = `<div class="stack">
        <div class="tch-lbl">Календарь обследования</div>
        <div class="tch-weeks" data-cal></div>
        <div class="tch-tally" data-sum></div>
        <div class="tch-lab"><div class="stack tight"><div class="tch-lbl">Карточки: что, с кем, сколько дней</div><div class="tch-cards" data-cards></div></div>
          <div class="stack tch-side" data-side></div></div>
      </div>`;
      function drawCards() {
        TR.$('[data-cards]', el).innerHTML = CARDS.map(c => {
          const v = a.w[c.id];
          return `<div class="tch-card ${[1, 2, 3].includes(v) ? 'in' : v === 0 ? 'out' : ''}"><span class="i" aria-hidden="true">${c.ico}</span><div class="b"><span class="t">${esc(c.t)}</span><span class="m">${nf(c.sz)} дн.${c.who.length ? ' · ' + c.who.map(x => esc(STK[x])).join(', ') : ''}</span></div>
            <div class="tch-wb" role="group" aria-label="Неделя">${[1, 2, 3].map(k => `<button type="button" data-cw="${c.id}|${k}" aria-pressed="${v === k}" ${ctx.readonly ? 'disabled' : ''}>Неделя ${k}</button>`).join('')}<button type="button" class="no" data-cw="${c.id}|0" aria-pressed="${v === 0}" ${ctx.readonly ? 'disabled' : ''}>не делаем</button></div></div>`;
        }).join('');
      }
      function drawRest() {
        const ev = planEval(a);
        TR.$('[data-cal]', el).innerHTML = calHTML(ev);
        const risks = [];
        ev.over.forEach(k => risks.push({ k: 'bad', t: `Неделя ${k} переполнена на ${nf(ev.used[k] - CAP[k])} дн.: цена фиксированная — переработка за счёт «Квант Софт».` }));
        TOPIC_REQ.filter(t => !ev.topics.has(t)).forEach(t => risks.push({ k: 'bad', t: TOPIC_RISK[t] }));
        WHO_REQ.filter(x => !ev.who.has(x)).forEach(x => risks.push({ k: 'bad', t: WHO_RISK[x] }));
        ev.R.filter(r => r.p < 1).forEach(r => { if (!risks.some(x => x.t === r.t)) risks.push({ k: r.p ? 'warn' : 'bad', t: r.t }); });
        TR.$('[data-sum]', el).innerHTML = `<span class="chip ${ev.over.length ? 'bad' : 'ok'}">дни: ${nf(ev.used[1] + ev.used[2] + ev.used[3])} из 13</span><span class="chip ${ev.topicCov === 1 ? 'ok' : ''}">темы: ${TOPIC_REQ.filter(t => ev.topics.has(t)).length} из ${TOPIC_REQ.length}</span><span class="chip ${ev.whoCov === 1 ? 'ok' : ''}">люди: ${WHO_REQ.filter(x => ev.who.has(x)).length} из ${WHO_REQ.length}</span><span class="chip ${risks.length ? 'warn' : 'ok'}">рисков: ${risks.length}</span>${ev.undecided ? `<span class="chip">не решено карточек: ${ev.undecided}</span>` : ''}`;
        TR.$('[data-side]', el).innerHTML = `<div class="stack tight"><div class="tch-lbl">Темы блокнота</div><div class="tch-cov">${TOPICS.map(t => `<span class="chip ${ev.topics.has(t) ? 'ok' : t === 'Доставка' ? '' : 'bad'}">${ev.topics.has(t) ? '✓' : '○'} ${esc(t)}</span>`).join('')}</div></div>
          <div class="stack tight"><div class="tch-lbl">Кого услышим</div><div class="tch-cov">${WHO_REQ.concat(['buyers', 'lesha']).map(x => `<span class="chip ${ev.who.has(x) ? 'ok' : WHO_REQ.includes(x) ? 'bad' : ''}">${ev.who.has(x) ? '✓' : '○'} ${esc(STK[x])}</span>`).join('')}</div></div>
          <div class="stack tight"><div class="tch-lbl">Чего не узнаем</div>${risks.length ? `<ul class="checks tch-risk">${risks.map(r => `<li class="${r.k}">${esc(r.t)}</li>`).join('')}</ul>` : ui.note('ok', 'Рисков не видно', 'Все темы и люди покрыты, порядок разумный, недели не переполнены.')}
          ${ev.topics.has('Доставка') ? '' : `<p class="small muted">Доставку не изучаем — её нет в первой версии (II квартал 2027). Это осознанный риск, а не пропуск.</p>`}</div>`;
      }
      TR.on(el, 'click', '[data-cw]', (e, b) => {
        if (ctx.readonly) return;
        const [id, k] = b.dataset.cw.split('|');
        a.w[id] = +k; ctx.save();
        const ev = planEval(a); ctx.decide('План обследования: дни по неделям', [1, 2, 3].map(x => nf(ev.used[x])).join(' / '));
        drawCards(); drawRest();
      });
      drawCards(); drawRest();
    },
    check(ans) {
      const ev = planEval(ans), notes = [];
      if (ev.over.length) notes.push({ ok: false, html: `Переполнены недели: ${ev.over.join(', ')}. Что можно не делать или сделать дешевле — и что вы честно запишете в «чего не узнаем»?` });
      const mt = TOPIC_REQ.filter(t => !ev.topics.has(t)), mw = WHO_REQ.filter(x => !ev.who.has(x));
      notes.push(mt.length ? { ok: false, html: `Темы без источника: ${mt.map(esc).join(', ')}. Какая карточка закрыла бы каждую?` } : { ok: true, html: 'Все темы блокнота покрыты.' });
      notes.push(mw.length ? { ok: false, html: `Не услышаны: ${mw.map(x => esc(STK[x])).join(', ')}.` } : { ok: true, html: 'Все ключевые заинтересованные лица в плане.' });
      ev.R.forEach(r => { if (r.p < 1) notes.push({ ok: r.p ? 'warn' : false, html: esc(r.t) }); });
      if (ev.undecided) notes.push({ ok: 'warn', html: `Не решено карточек: ${ev.undecided}. «Не делаем» — тоже решение: его стоит принять явно.` });
      const ok = !ev.over.length && ev.score >= 0.8 && (ans && ans.w && ans.w.agree) === 3;
      return {
        ok, score: ev.score, notes,
        summary: `Дни: ${nf(ev.used[1])} / ${nf(ev.used[2])} / ${nf(ev.used[3])} из 5 / 5 / 3. Темы: ${pct(ev.topicCov)}. Люди: ${pct(ev.whoCov)}. Порядок: ${pct(ev.rules)}.`,
        mentor: ev.over.length ? 'Фиксированная цена — это не «постараемся», а граница. Хороший план не тот, где есть всё, а тот, где честно написано, что мы сознательно не делаем и чем рискуем.'
          : ok ? 'Этот план не стыдно показать Нине: у каждой карточки есть «зачем», у каждой недели — запас, а в «чего не узнаем» — только то, что вы выбросили осознанно.' : null
      };
    },
    explain: `${ui.table(['Неделя', 'Что делаем', 'Зачем именно тогда'], [
        ['1 · понять (5 дней)', 'документы; интервью с Ниной, Галиной Ивановной, Олегом Петровичем и Ритой; смена на Покровке; ночь в цеху', 'дёшево и широко: цели, правила, как на самом деле. Документы — первыми, чтобы не спрашивать записанное'],
        ['2 · посчитать и договориться (4,5 дня)', 'анкета (ВКонтакте + бумага у кассы) — собирается неделю фоном; «КассаПро»; данные продаж; сверка у Олега; воркшоп', 'анкету составляем после интервью; воркшоп — когда факты на руках; «КассаПро» пораньше: сертификация 3 недели'],
        ['3 · проверить и согласовать (3 дня + 2)', 'прототип экрана заказа на покупателях 55+; прототип экрана кассира у прилавка; согласование объёма', 'проверяем решение на тех, кто будет им пользоваться, и закрываем этап подписью Нины']
      ])}
      <p><b>Что выбросили и почему.</b> Анкету только во ВКонтакте (смещение: 55+ не ответят), фокус-группу (покупателей уже слышим через анкету и прототип), конкурентов и мозговой штурм (идеи — не главное на обследовании, «как у Додо» обсудим на воркшопе), Лёшу (доставка — не в первой версии). Это не единственный верный план: можно, например, взять фокус-группу вместо данных продаж — тогда в «чего не узнаем» появится «план выпечки — только со слов».</p>
      <p><b>Позиция аналитика.</b> План выявления — артефакт: техника, с кем, когда, цель, что получим. Его согласуют с руководителем проекта и заказчиком до начала встреч (BABOK v3, «Подготовка к выявлению»). «Чего не узнаем» — честная часть плана, а не признание в слабости.</p>`,
    report: ans => { const ev = planEval(ans); return [1, 2, 3].map(k => `Неделя ${k} (${nf(ev.used[k])} из ${CAP[k]} дн.): ${CARDS.filter(c => ev.w[c.id] === k).map(c => c.ab).join(', ') || '—'}`).join('\n') + `\nНе делаем: ${CARDS.filter(c => ev.w[c.id] === 0).map(c => c.ab).join(', ') || '—'}\nТемы ${pct(ev.topicCov)}, люди ${pct(ev.whoCov)}, порядок ${pct(ev.rules)}${ev.over.length ? ', переполнены недели: ' + ev.over.join(', ') : ''}`; }
  };

  // =====================================================================
  // Практика 4. Ответ Нине: зачем три недели обследования
  // =====================================================================
  const WHY_RUBRIC = [
    'Объясняет, что один человек, даже владелица, не знает всего: у кассиров, цеха, бухгалтерии и покупателей свои знания; называет хотя бы три источника',
    'Называет конкретные способы и зачем каждый: смена в пекарне — то, о чём не говорят; анкета — мнение сотен покупателей, включая тех, кому за 55; общая встреча — договориться о спорном; черновик экрана — проверить, поймут ли; документы «КассаПро» — правила подключения касс',
    'Говорит о цене ошибки: исправить сейчас в разы дешевле, чем после запуска; вспоминает потерянные торты и 8 Марта',
    'Связывает со сроками и деньгами Нины: три недели и 600 тыс. ₽ зафиксированы в договоре, пилот — 1 февраля, все пекарни — к 1 марта',
    'Пишет уважительно и без жаргона, предлагает показать план по дням и говорит, что она получит в конце — согласованный объём первой версии'
  ];
  const WHY_REF = 'Нина Сергеевна, вы знаете о «Колосе» больше всех — и поэтому многое для вас само собой разумеется. А система будет работать в руках кассиров, технолога, бухгалтера и покупателей, и у каждого своя правда. За одно утро на Покровке мы увидели то, чего не было в нашем разговоре: Анна Павловна просит отложить бородинский, пакеты с заказами лежат под прилавком и путаются, касса по 10–15 минут работает без связи. Не увидь мы этого, экран кассира не выдержал бы первого же утра. Поэтому за три недели мы поговорим с Галиной Ивановной и Олегом Петровичем и посмотрим ночную смену в цеху и утреннюю сверку; раздадим анкету покупателям — во ВКонтакте и бумажную у кассы, чтобы ответили и те, кому за 55; соберём вас с Павлом, Ритой, Галиной Ивановной и Олегом Петровичем, чтобы договориться о спорном — оплате на месте, вечерней скидке, времени выдачи; дадим покупателям постарше попробовать черновик экрана; разберём правила подключения касс «КассаПро». Ошибку, найденную сейчас, исправить в разы дешевле, чем после запуска, — после прошлого 8 Марта цена ошибки вам известна. Три недели и 600 тысяч зафиксированы в договоре, сроки — пилот 1 февраля и все пекарни к 1 марта — не сдвигаются. В конце вы получите согласованный объём первой версии. Если хотите, в понедельник покажу план по дням.';
  const whyTask = {
    id: 'why', title: 'Ответьте Нине: зачем три недели обследования',
    simple: howPlan.simple,
    lead: ui.brief({
      situation: 'Игорь отправил Нине план обследования. Через десять минут она звонит ему, а он пересылает вам её сообщение: «Ответьте вы — вы этот план собирали».',
      todo: [
        'Прочитайте сообщение Нины.',
        'Напишите ответ: 7–10 предложений, от 300 символов. Говорите о её бизнесе, людях и сроках — без слов «техника выявления», «стейкхолдер», «воркшоп».',
        'Нажмите «Проверить с Ксенией (Claude)» или «Сверить с эталоном самому» и честно отметьте раскрытые пункты. Засчитывается от 60 %.'
      ],
      lookTitle: 'На что опереться',
      look: 'Смена на Покровке (что увидели, чего не было в интервью), карта техник (что даёт каждая), лаборатория плана (что будет, если что-то выбросить), анкета Кано (кто ответит, если раздавать только во ВКонтакте).'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: WHY_REF, self: WHY_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('tch-root');
      el.insertAdjacentHTML('beforeend', ui.say('nina', 'Зачем три недели и шестьсот тысяч на разговоры? Задайте мне все вопросы за один вечер — я вам всё расскажу. И делайте уже приложение!'));
      const j = document.createElement('div'); j.style.marginTop = '12px'; el.appendChild(j);
      ui.justify(j, {
        id: 'tch-why', q: 'Ответ Нине: зачем три недели обследования, если можно спросить её за вечер?',
        qPlain: 'Ответьте владелице сети пекарен, которая предлагает вместо трёх недель обследования один вечер вопросов к ней. Объясните без жаргона, почему одного человека мало, какие способы узнать требования вы используете и зачем каждый, какова цена ошибки, найденной поздно, как это укладывается в её сроки и деньги, и что она получит в конце.',
        rubric: WHY_RUBRIC, reference: WHY_REF, value: ctx.ans.j, readonly: ctx.readonly, minLen: 300,
        placeholder: 'Нина Сергеевна, … (почему одного разговора мало; что и у кого узнаем; чем рискуем, если пропустим; сроки и деньги; что получите в конце)',
        onChange: v => { ctx.ans.j = v; ctx.save(); ctx.decide('Ответ Нине: зачем три недели обследования', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j);
      return {
        ok: s >= 0.6, score: s,
        summary: s ? `Оценка ответа: ${Math.round(s * 100)} %.` : 'Напишите ответ (от 300 символов) и проверьте его с Ксенией или сверьте с эталоном сами.',
        notes: s && s < 0.6 ? [{ ok: false, html: 'Нину убедят не названия техник, а картинки из её же пекарни: «отложи мне бородинский», пакеты под прилавком, 8 Марта. Покажите, чего она сама не знает, — и что это стоит, если узнать поздно.' }] : []
      };
    },
    explain: '<p>Сильный ответ начинает с уважения к знаниям Нины — и честно говорит, что их мало: кассиры, цех, бухгалтерия и покупатели знают своё. Дальше — не названия техник, а картинки: «отложи мне бородинский», пакеты под прилавком, бумажная анкета у кассы для тех, кому за 55. Потом — цена ошибки (эвристика «на каждом этапе примерно ×10», DOMAIN §9) и прошлое 8 Марта. И в конце — сроки, деньги и что она получит: согласованный объём первой версии.</p><p>Это та же работа переводчика, что и во всей неделе: техника выявления — инструмент аналитика, а заказчику важны результат, риск и цена (PRACTICES.md §3).</p>',
    report: ans => (ans.j && ans.j.text) ? ans.j.text : '—'
  };

  // =====================================================================
  TR.stage({
    id: ID, act: 3, order: 250, slot: 'Пт 11:00', title: 'Техники выявления',
    when: 'пятница, 23 октября, 11:00 · переговорная «Квант Софт», план обследования на доске',
    intro: [
      { who: 'igor', html: 'В понедельник показываю Нине Сергеевне план обследования. Три недели, 600 тысяч, цена фиксированная: каждый лишний день — за наш счёт.' },
      { who: 'ksenia', html: 'Интервью и смену на Покровке вы уже попробовали. Сегодня — весь набор инструментов: анкеты, воркшопы, фокус-группы, прототипы, анализ документов, систем и данных. Когда что брать, сколько стоит, что даёт — и как собрать из этого план на три недели.' },
      { who: 'rita', html: 'А я уже анкету запустила! Двадцать ответов, правда… Но там всё про баллы, сами увидите.' }
    ],
    facts: ['F-vk', 'F-elder', 'F-loyalty', 'F-1c', 'F-cakeloss', 'F-deadline', 'F-budget'],
    glossary: [
      { term: 'Выявление требований', simple: 'Узнать, что на самом деле нужно людям, — спросить, посмотреть, посчитать, дать попробовать.', tech: 'Elicitation — деятельность по получению информации от заинтересованных лиц и из других источников (BABOK v3): подготовка, проведение, подтверждение результатов. Требования не «собирают», а выявляют: многое люди не скажут сами.' },
      { term: 'Анкетирование', simple: 'Одинаковые вопросы сотням людей — на бумаге у кассы или во ВКонтакте.', tech: 'Survey or questionnaire (BABOK v3): набор вопросов для большого числа респондентов; закрытые вопросы дают цифры, открытые — формулировки. Перед рассылкой проверяют на 3–5 людях.' },
      { term: 'Фокус-группа', simple: 'Шесть-восемь постоянных покупателей за одним столом обсуждают идею с ведущим.', tech: 'Focus group (BABOK v3): модерируемое обсуждение группы похожих людей для выявления отношения, мотивов и реакции на идею. Даёт качество, а не количество.' },
      { term: 'Воркшоп', simple: 'Нина, Павел, Галина Ивановна и Олег Петрович с ведущим договариваются о спорных правилах.', tech: 'Workshop, фасилитированная сессия (BABOK v3): структурированная встреча заинтересованных лиц с ведущим (фасилитатором), повесткой и ожидаемым результатом — согласованными требованиями или решениями.' },
      { term: 'Мозговой штурм', simple: 'Сначала накидать много идей без критики, потом выбрать лучшие.', tech: 'Brainstorming (BABOK v3): групповая генерация идей с отложенной критикой и последующим отбором. Уместен, когда проблема понятна, а вариантов решения мало.' },
      { term: 'Анализ интерфейсов', simple: 'Разобраться, как устроены чужие программы, с которыми будем «дружить»: «КассаПро», 1С.', tech: 'Interface analysis (BABOK v3): изучение интерфейсов между решением и другими системами, людьми и устройствами — данные, форматы, правила обмена, ограничения.' },
      { term: 'Прототип', simple: 'Черновик экрана на бумаге — дать покупателю попробовать, пока ничего не запрограммировано.', tech: 'Prototyping (BABOK v3): модель будущего решения для проверки и уточнения требований. Бывает «на выброс» и эволюционный, бумажный и кликабельный. Пятерых пользователей часто хватает, чтобы найти основные проблемы удобства (Якоб Нильсен).' },
      { term: 'Анкета Кано', simple: 'Про каждое свойство два вопроса: «если есть — как вам?» и «если нет — как вам?».', tech: 'Опросник по модели Кано (1984): функциональный и дисфункциональный вопросы, таблица оценки 5×5 → обязательное, одномерное, привлекательное, безразличное, обратное, сомнительное. Итог — по большинству или по коэффициентам удовлетворённости (Бергер и соавторы, 1993).' },
      { term: 'Смещение выборки', simple: 'Анкета только во ВКонтакте не услышит бабушек — и решит, что заказ через кассира никому не нужен.', tech: 'Sampling bias — систематическое отличие ответивших от тех, о ком делают выводы. Лечится выбором каналов (онлайн + бумага), квотами по группам и анализом ответов по группам.' },
      { term: 'План выявления', simple: 'Таблица: что делаем, с кем, когда, зачем и что получим. И честное «чего не узнаем».', tech: 'Результат подготовки к выявлению (BABOK v3, Prepare for Elicitation): техники, участники, порядок, сроки, материалы, ожидаемые результаты; согласуется с руководителем проекта и заказчиком.' }
    ],
    outro: 'Теперь у вас не один инструмент, а набор: интервью — за «почему», наблюдение — за «как на самом деле», анкета и данные — за «сколько», воркшоп — чтобы договориться, прототип — чтобы проверить. Выбираете по четырём вопросам: кого услышать, что узнать, где мы и сколько есть времени. Анкету Кано разбираете по паре вопросов и таблице — и помните, кто на неё ответил. А план выявления честно говорит не только что сделаем, но и чего не узнаем. Сегодня в 15:00 — работа с бизнесом: как вести встречу, писать письмо-итог и говорить «нет» с вариантами.',
    tasks: [howMap, howKano, howPlan, pickTask, kanoTask, planTask, whyTask]
  });
})();
