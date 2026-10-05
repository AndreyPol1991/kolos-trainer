/* Неделя 5, вторник 10:00 — «Kanban и поток».
   Теория: доска и шесть практик Kanban на кухне кафе (переключатели «включить практику», колонка «очередь | в работе»),
   две школы — Kanban Guide 2020 и метод Андерсона; поток: многозадачность на диаграмме Ганта, закон Литтла с ползунками,
   где начинается отсчёт времени цикла; классы обслуживания с кривыми стоимости задержки, Scrumban, что ломается,
   если перепутать подход.
   Практика: главная лаборатория — симулятор потока заявок сопровождения «Колоса» с WIP-лимитами по колонкам
   (неделя/месяц, без лимитов и с ними, накопление, время цикла, узкое место у аналитика); закон Литтла на трёх ситуациях;
   10 заявок по классам обслуживания; явные правила колонки «Анализ» (мини-редактор с признаками); ответ своими словами —
   почему сопровождению Kanban, а разработке MVP — Scrum. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;

  if (!document.getElementById('kbn-css')) document.head.insertAdjacentHTML('beforeend', `<style id="kbn-css">
    .kbn-root, .kbn-root .stack { min-width: 0; }
    .kbn-root .stack > * { min-width: 0; }
    .kbn-root .seg button { white-space: normal; text-align: left; }
    .kbn-box { display: grid; gap: 10px; padding: 14px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); min-width: 0; }
    .kbn-box > * { min-width: 0; }
    .kbn-lbl { font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--text-muted); }
    .kbn-pts { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 6px; }
    .kbn-pt { text-align: left; font: inherit; font-size: 13.5px; color: inherit; border: 1px solid var(--border-strong); background: var(--surface-2); border-radius: 9px; padding: 7px 10px; cursor: pointer; display: grid; grid-template-columns: 18px minmax(0, 1fr); gap: 8px; align-items: start; min-width: 0; }
    .kbn-pt .mk { width: 16px; height: 16px; border-radius: 4px; border: 2px solid var(--border-strong); margin-top: 1px; display: grid; place-items: center; font-size: 11px; line-height: 1; color: transparent; }
    .kbn-pt[aria-pressed="true"] { border-color: var(--ok); background: var(--ok-soft); }
    .kbn-pt[aria-pressed="true"] .mk { border-color: var(--ok); background: var(--ok); color: var(--surface); }
    .kbn-pt.extra { border-style: dashed; }
    .kbn-board { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; }
    .kbn-col { border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); padding: 8px; display: grid; gap: 6px; align-content: start; min-width: 0; }
    .kbn-col.hot { border-color: var(--bad); box-shadow: 0 0 0 1px var(--bad); }
    .kbn-col .hd { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: baseline; gap: 4px; font: 600 13px/1.3 var(--f-brand); }
    .kbn-col .hd small { font: 600 10.5px/1.2 var(--f-mono); color: var(--text-muted); }
    .kbn-col .lim { font: 600 11px/1 var(--f-mono); padding: 3px 6px; border-radius: 99px; background: var(--accent-soft); color: var(--accent); white-space: nowrap; }
    .kbn-col .lim.no { background: var(--surface-3); color: var(--text-muted); }
    .kbn-col .lim.over { background: var(--bad-soft); color: var(--bad); }
    .kbn-col .rule { font-size: 11.5px; color: var(--text-2); border-left: 2px solid var(--accent); padding-left: 6px; }
    .kbn-subs { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 5px; }
    .kbn-subs.one { grid-template-columns: minmax(0, 1fr); }
    .kbn-sub { border-radius: 7px; background: var(--surface); border: 1px dashed var(--border-strong); padding: 5px; display: grid; gap: 4px; align-content: start; min-height: 46px; min-width: 0; }
    .kbn-sub.w { border-style: solid; }
    .kbn-sub .st { font: 600 9.5px/1.2 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .kbn-chips { display: flex; flex-wrap: wrap; gap: 3px; }
    .kbn-card { font-size: 12px; line-height: 1.25; padding: 4px 6px; border-radius: 6px; background: var(--surface-2); border: 1px solid var(--border-strong); min-width: 0; overflow-wrap: anywhere; }
    .kbn-card .age { font: 600 10px/1 var(--f-mono); color: var(--text-muted); margin-left: 4px; }
    .kbn-card.old { border-color: var(--bad); background: var(--bad-soft); }
    .kbn-card.old .age { color: var(--bad); }
    .kbn-c { font: 600 10.5px/1 var(--f-mono); min-width: 24px; height: 20px; padding: 0 4px; border-radius: 5px; display: inline-grid; place-items: center; border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text); cursor: pointer; }
    .kbn-c.a1 { border-color: var(--warn); background: var(--warn-soft); }
    .kbn-c.a2 { border-color: var(--bad); background: var(--bad-soft); color: var(--bad); }
    .kbn-c.blk { border-style: dashed; }
    .kbn-c.sel { box-shadow: 0 0 0 2px var(--accent); }
    .kbn-done { font: 600 22px/1.1 var(--f-mono); color: var(--ok); }
    .kbn-strip { display: grid; gap: 8px; }
    .kbn-foot { font-size: 12.5px; color: var(--text-2); padding: 6px 10px; border-radius: 8px; background: var(--surface-2); }
    .kbn-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    .kbn-stats .v { font-size: 17px; overflow-wrap: anywhere; }
    .kbn-set { display: grid; grid-template-columns: minmax(0, 190px) minmax(0, 1fr) 54px; gap: 6px 12px; align-items: center; font-size: 13.5px; }
    .kbn-set > * { min-width: 0; }
    .kbn-set .val { font: 600 13px/1 var(--f-mono); text-align: right; }
    .kbn-range { width: 100%; accent-color: var(--accent); }
    .kbn-range:disabled { opacity: .4; }
    .kbn-cfd { width: 100%; max-width: 600px; height: auto; display: block; }
    .kbn-legend { display: flex; flex-wrap: wrap; gap: 4px 12px; font-size: 12px; color: var(--text-2); }
    .kbn-legend i { display: inline-block; width: 12px; height: 10px; border-radius: 3px; margin-right: 4px; vertical-align: -1px; }
    .kbn-cmp { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 8px; }
    .kbn-gantt { display: grid; gap: 4px; }
    .kbn-grow { display: grid; grid-template-columns: 110px minmax(0, 1fr); gap: 8px; align-items: center; font-size: 12.5px; }
    .kbn-grow > * { min-width: 0; }
    .kbn-track { position: relative; height: 18px; background: var(--surface-2); border-radius: 5px; overflow: hidden; }
    .kbn-bar { position: absolute; top: 3px; height: 12px; border-radius: 3px; }
    .kbn-axis { position: relative; height: 16px; font: 10.5px/16px var(--f-mono); color: var(--text-muted); }
    .kbn-axis span { position: absolute; transform: translateX(-50%); white-space: nowrap; }
    .kbn-people { display: flex; flex-wrap: wrap; gap: 2px; font-size: 18px; line-height: 1; min-height: 24px; }
    .kbn-big { font: 600 26px/1.1 var(--f-mono); }
    .kbn-formula { font: 600 15px/1.4 var(--f-mono); padding: 8px 12px; border-radius: 8px; background: var(--code-bg); border: 1px solid var(--border); overflow-x: auto; }
    .kbn-journey { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 3px; }
    .kbn-journey > div { font-size: 11.5px; line-height: 1.25; padding: 6px 4px; text-align: center; border-radius: 6px; background: var(--surface-2); border: 1px solid var(--border); min-width: 0; overflow-wrap: anywhere; }
    .kbn-journey > div.in { background: var(--accent-soft); border-color: var(--accent); color: var(--text); }
    .kbn-cls { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; }
    .kbn-cls button { font: inherit; font-size: 13px; text-align: left; color: inherit; border: 1px solid var(--border-strong); background: var(--surface-2); border-radius: 9px; padding: 7px 9px; cursor: pointer; display: grid; gap: 2px; min-width: 0; }
    .kbn-cls button[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .kbn-cls button small { color: var(--text-muted); font-size: 11.5px; }
    .kbn-kv { display: grid; grid-template-columns: minmax(0, 150px) minmax(0, 1fr); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; background: var(--surface); }
    .kbn-kv > div { padding: 8px 12px; border-top: 1px solid var(--border); font-size: 14px; min-width: 0; overflow-wrap: anywhere; }
    .kbn-kv > div:nth-child(-n+2) { border-top: 0; }
    .kbn-kv .k { font: 600 11px/1.4 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); background: var(--surface-2); }
    .kbn-calc { display: grid; gap: 8px; padding: 12px 14px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); }
    .kbn-calc.ok { border-color: var(--ok); } .kbn-calc.bad { border-color: var(--bad); } .kbn-calc.warn { border-color: var(--warn); }
    .kbn-inrow { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
    .kbn-inrow input { width: 110px; max-width: 100%; font: 600 15px/1 var(--f-mono); padding: 6px 8px; }
    .kbn-feats { display: flex; flex-wrap: wrap; gap: 6px; }
    .kbn-feats .chip { white-space: normal; }
    .kbn-root textarea { width: 100%; max-width: 100%; }
    @media (max-width: 640px) {
      .kbn-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .kbn-set { grid-template-columns: minmax(0, 1fr) 54px; }
      .kbn-set .lbl { grid-column: 1 / -1; margin-top: 6px; }
      .kbn-cmp { grid-template-columns: minmax(0, 1fr); }
      .kbn-kit .kbn-subs { grid-template-columns: minmax(0, 1fr); }
      .kbn-grow { grid-template-columns: 84px minmax(0, 1fr); font-size: 11.5px; }
      .kbn-journey { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .kbn-cls { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .kbn-kv { grid-template-columns: minmax(0, 1fr); }
      .kbn-kv > div:nth-child(2) { border-top: 0; }
      .kbn-kv > div.k { border-top: 1px solid var(--border); padding-bottom: 2px; }
      .kbn-kv > div:first-child { border-top: 0; }
      .kbn-kv > div.v { border-top: 0; padding-top: 4px; }
    }
  </style>`);

  // ---------- общие помощники ----------
  const chip = (t, k) => `<span class="chip ${k || ''}">${t}</span>`;
  const num = x => (Math.round(x * 10) / 10).toLocaleString('ru-RU');
  const dn = x => TR.plural(Math.round(x), 'день', 'дня', 'дней');
  const anNote = html => `<div style="margin-top:12px">${ui.note('info', 'Позиция аналитика', html)}</div>`;
  const quizRef = QS => QS.map(cfg => cfg.options.map((o, i) => o.ok ? i : -1).filter(i => i >= 0));

  // =====================================================================
  // Теория 1. Доска и шесть практик Kanban (соседний пример — кухня кафе)
  // =====================================================================
  const PRACT = [
    { id: 'vis', t: 'Визуализировать работу', what: 'Вся работа видна на доске: колонки — шаги процесса, карточки — заказы.', gain: 'Видно, где что лежит, без вопросов «а где мой омлет?».', lose: 'Заказы в голове у повара и на бумажках: что-то забыто, что-то сделано дважды.' },
    { id: 'wip', t: 'Ограничить незавершённую работу (WIP)', what: 'В колонке «Готовим» — не больше 3 заказов в работе. Новый берут, когда закончили старый.', gain: 'Повар доводит до конца, блюда не стынут в ожидании, время заказа падает.', lose: 'Повар начал 6 блюд сразу — два остыли, гость ждёт 25 минут.' },
    { id: 'flow', t: 'Управлять потоком', what: 'Следить, сколько заказ идёт от начала до конца, и разбирать застрявшие.', gain: 'Застрявший заказ виден по возрасту — его спасают раньше, чем гость пожалуется.', lose: 'Про застрявший заказ узнают, когда гость уже ругается.' },
    { id: 'pol', t: 'Сделать правила явными', what: 'Под колонками записано: когда заказ можно взять и когда он считается готовым.', gain: 'Новичок работает так же, как опытный; спорят о правиле, а не о людях.', lose: 'Каждый понимает «готово» по-своему: салат ушёл без заправки.' },
    { id: 'fb', t: 'Петли обратной связи', what: 'Короткая встреча у доски каждый день, разбор потока раз в неделю, отзывы гостей.', gain: 'Проблемы всплывают за день, а не за месяц.', lose: 'Одни и те же задержки каждый обед, и вслух о них никто не говорит.' },
    { id: 'imp', t: 'Улучшать вместе, экспериментом', what: 'Менять процесс маленькими шагами и проверять цифрами: «два человека на сборке в обед — время упало?»', gain: 'Улучшения проверены, а не «кажется, стало лучше».', lose: 'Процесс годами не меняется — или меняется по прихоти начальника.' }
  ];
  const KIT = { accepted: ['Каша овсяная', 'Суп дня'], cook: ['Сырники', 'Омлет', 'Латте ×2', 'Блины', 'Салат', 'Круассан'], out: ['Капучино'], done: ['Чай', 'Эспрессо', 'Тост'] };
  function kitchen(on, split) {
    if (!on.vis) return `<div class="kbn-box"><span class="kbn-lbl">Доски нет</span><div class="small">Заказы — на бумажках у кассы и в голове у повара: «сырники, омлет, латте два, блины… а суп кто-то брал?». Сколько заказов в работе, какой застрял, кто что делает — не видно никому, кроме повара. И то не всегда.</div></div>`;
    const ages = on.wip ? [9, 7, 4] : [31, 24, 22, 15, 12, 6];
    const inW = on.wip ? KIT.cook.slice(0, 3) : KIT.cook;
    const inQ = on.wip ? KIT.cook.slice(3) : [];
    const card = (t, i, aged) => `<div class="kbn-card ${on.flow && aged && ages[i] >= 20 ? 'old' : ''}">${esc(t)}${on.flow && aged ? `<span class="age">${ages[i]} мин</span>` : ''}</div>`;
    const lim = n => on.wip ? `<span class="lim">≤ ${n}</span>` : '';
    const rule = t => on.pol ? `<div class="rule">${t}</div>` : '';
    const cookBody = split
      ? `<div class="kbn-subs"><div class="kbn-sub"><span class="st">очередь</span>${inQ.map(t => `<div class="kbn-card">${esc(t)}</div>`).join('') || '<span class="small dim">—</span>'}</div><div class="kbn-sub w"><span class="st">в работе</span>${inW.map((t, i) => card(t, i, true)).join('')}</div></div>`
      : `<div class="kbn-subs one"><div class="kbn-sub w">${inQ.concat(inW).map((t, i) => card(t, inQ.length ? (i < inQ.length ? 99 : i - inQ.length) : i, i >= inQ.length)).join('')}</div></div>`;
    let h = `<div class="kbn-board kbn-kit">
      <div class="kbn-col"><div class="hd">Принято</div>${rule('Берём сверху; срочное (аллергия, ребёнок плачет) — сразу')}${KIT.accepted.map(t => `<div class="kbn-card">${esc(t)}</div>`).join('')}</div>
      <div class="kbn-col ${on.flow && !on.wip ? 'hot' : ''}"><div class="hd">Готовим ${lim(3)}</div>${rule('Берём новый, когда доделали старый')}${cookBody}</div>
      <div class="kbn-col"><div class="hd">Выдача ${lim(2)}</div>${rule('Готово: состав сверен с чеком, приборы, салфетки')}${KIT.out.map(t => `<div class="kbn-card">${esc(t)}</div>`).join('')}</div>
      <div class="kbn-col"><div class="hd">Отдано</div>${KIT.done.map(t => `<div class="kbn-card">${esc(t)}</div>`).join('')}</div></div>`;
    const foot = [];
    if (on.flow) foot.push(on.wip ? '⏱ Среднее время заказа — 12 минут, самый старый в работе — 9 минут.' : '⏱ Среднее время заказа — 24 минуты, самый старый в работе — 31 минута: сырники стынут, гость нервничает.');
    if (on.fb) foot.push('🗣 11:45 — пятиминутка у доски перед обедом; в пятницу — разбор, где заказы ждали дольше всего.');
    if (on.imp) foot.push('🧪 Эксперимент недели: в обед второй человек на выдаче. Через неделю смотрим, упало ли время заказа.');
    if (foot.length) h += `<div class="kbn-strip">${foot.map(f => `<div class="kbn-foot">${f}</div>`).join('')}</div>`;
    return h;
  }
  const SCHOOLS = {
    guide: { t: 'Kanban Guide (2020)', who: 'Дэниел Ваканти и Джон Коулман; руководство в духе Scrum Guide — короткое и строгое.', core: 'Три практики: определить и визуализировать рабочий процесс; активно управлять элементами в работе; улучшать процесс. В «определение рабочего процесса» входят: что считать единицей работы, где она начинается и заканчивается, колонки, как ограничивают WIP, явные правила и ожидаемый срок выполнения.', metrics: 'Четыре обязательные: незавершённая работа (WIP), пропускная способность, время цикла, возраст элемента в работе.', extra: 'Классов обслуживания нет; вместо них — ожидание по сроку (SLE): «85 % заявок закрываем за 5 дней».' },
    anderson: { t: 'Метод Андерсона (2010)', who: 'Дэвид Андерсон, книга «Канбан. Альтернативный путь в Agile»; сообщество Kanban University.', core: 'Шесть общих практик: визуализировать; ограничивать незавершённую работу; управлять потоком; делать правила явными; вводить петли обратной связи; улучшать вместе и эволюционно. Принципы: начни с того, что делаешь сейчас; меняй постепенно; уважай текущие роли.', metrics: 'Время выполнения и время цикла, пропускная способность, накопительная диаграмма потока; плюс разговор с заказчиком о сроках и рисках.', extra: 'Классы обслуживания (срочно, с датой, обычное, нематериальное), каденции встреч, работа с заказчиком на входе в систему.' }
  };
  function drawSchools(pane) {
    let cur = 'anderson';
    pane.innerHTML = `<div class="stack"><div class="row">${ui.seg('sch', Object.keys(SCHOOLS).map(k => ({ v: k, t: SCHOOLS[k].t })), cur, 'accent')}</div><div data-sch></div>
      ${ui.note('warn', 'Честно: школы спорят', 'Обе выросли из одной идеи — тянуть работу, а не толкать, и ограничивать незавершённое. Но расходятся в деталях: нужны ли классы обслуживания, сколько практик «обязательных», как называть метрики. В разговоре про Kanban полезно уточнять, о какой школе речь. В «Колосе» берём шесть практик Андерсона и метрики Kanban Guide — так делают многие команды.')}</div>`;
    function draw() {
      const s = SCHOOLS[cur];
      TR.$('[data-sch]', pane).innerHTML = `<div class="kbn-kv"><div class="k">Кто</div><div class="v">${s.who}</div><div class="k">Суть</div><div class="v">${s.core}</div><div class="k">Метрики</div><div class="v">${s.metrics}</div><div class="k">Особенное</div><div class="v">${s.extra}</div></div>`;
    }
    ui.onSeg(pane, (n, v) => { if (n === 'sch') { cur = v; draw(); } });
    draw();
  }
  const howBoard = {
    id: 'how-board', covers: ['wip-lab', 'rules'], title: 'Как это работает: доска, лимиты и шесть практик Kanban', free: true, noReset: true,
    simple: {
      icon: '🥖',
      plain: 'Kanban — не про стикеры, а про то, чтобы работа текла: всё видно, начатого немного, правила записаны, и команда регулярно смотрит, где застревает.',
      analogy: 'Полки в цеху: «заказано → в печи → остывает → на витрине». В печь больше 6 противней не влезает — седьмой ждёт. В разработке «печи» нет, поэтому лимит приходится ставить самим.',
      tech: '<b>Kanban</b> — метод управления потоком работы. По Дэвиду Андерсону — шесть практик: визуализировать, ограничивать незавершённую работу (WIP — work in progress), управлять потоком, делать правила явными, вводить петли обратной связи, улучшать вместе. <b>Kanban Guide 2020</b> (Ваканти, Коулман) сводит их к трём: определить и визуализировать процесс, активно управлять работой, улучшать. Ролей и итераций Kanban не добавляет: «начни с того, что есть».'
    },
    lead: ui.brief({
      situation: 'Соседний пример — кухня кафе в обед. Шесть переключателей — шесть практик Kanban. Сначала все выключены: доски нет. Включайте практики по одной и смотрите, что меняется на доске и под ней. Вторая вкладка — две школы Kanban и чем они отличаются.',
      todo: [
        'Включайте практики по одной, сверху вниз. После каждой читайте карточку: что даёт практика и что бывает без неё.',
        'Включите «Управлять потоком» без лимита WIP, а потом добавьте лимит: как изменились время заказа и колонка «Готовим»?',
        'Переключите «Разделить колонку на очередь и в работе»: что стало видно?',
        'Откройте вкладку «Две школы» и сравните их.'
      ],
      look: 'Цифра «≤ 3» у колонки — лимит незавершённой работы. Красная рамка колонки — там копится. У карточек в работе — возраст в минутах; красная — застряла. Строка с цветной чертой слева под заголовком — явное правило колонки.'
    }),
    render(el, ctx) {
      el.classList.add('kbn-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [{ id: 'b', t: 'Доска и практики', render: pane => {
        const on = Object.assign({}, ctx.ans.on || {}); let split = !!ctx.ans.split, last = ctx.ans.last || '';
        pane.innerHTML = `<div class="stack">
          <div class="row between"><span class="kbn-lbl">Практики Kanban</span><span class="small dim" data-pc></span></div>
          <div class="kbn-pts">${PRACT.map((p, i) => `<button type="button" class="kbn-pt" data-pt="${p.id}" aria-pressed="${!!on[p.id]}"><span class="mk">✓</span><span>${i + 1}. ${p.t}</span></button>`).join('')}<button type="button" class="kbn-pt extra" data-split aria-pressed="${split}"><span class="mk">✓</span><span>Разделить колонку «Готовим» на «очередь» и «в работе»</span></button></div>
          <div data-kb></div><div data-kn></div></div>`;
        function draw() {
          TR.$('[data-kb]', pane).innerHTML = kitchen(on, split);
          TR.$('[data-pc]', pane).innerHTML = `Включено: <b>${PRACT.filter(p => on[p.id]).length}</b> из 6`;
          const p = PRACT.find(x => x.id === last);
          let n = '';
          if (last === 'split') n = ui.note(split ? 'ok' : '', split ? 'Очередь отдельно от работы' : 'Одна колонка «Готовим»', split ? (on.wip ? 'Теперь видно: три заказа реально готовят, три — ждут. Ожидание — тоже время гостя, но его хотя бы видно, и с ним можно работать.' : 'Без лимита очередь пуста — всё сразу «в работе». Повар жонглирует шестью заказами, и разделение ничего не показывает. Включите лимит WIP.') : 'Ждущие и готовящиеся заказы в одной куче: кажется, что повар занят всем сразу, а на деле половина просто лежит.');
          else if (p) n = ui.note(on[p.id] ? 'ok' : 'bad', (on[p.id] ? 'Включено: ' : 'Выключено: ') + p.t, `${p.what}<br><b>${on[p.id] ? 'Что даёт' : 'Без неё'}:</b> ${on[p.id] ? p.gain : p.lose}`);
          else n = ui.note('', 'С чего начать', 'Kanban начинают с того, что есть: не меняют роли и процесс, а сначала делают работу видимой. Включите первую практику.');
          if (PRACT.every(x => on[x.id])) n += ui.note('ok', 'Все шесть', 'Это и есть Kanban: процесс тот же, но работа видна, начатого немного, правила записаны, команда регулярно смотрит на поток и улучшает его по цифрам.');
          TR.$('[data-kn]', pane).innerHTML = n;
        }
        const save = () => { ctx.ans.on = Object.assign({}, on); ctx.ans.split = split; ctx.ans.last = last; ctx.save(); };
        TR.on(pane, 'click', '[data-pt]', (e, b) => { const id = b.dataset.pt; on[id] = !on[id]; b.setAttribute('aria-pressed', String(on[id])); last = id; draw(); save(); });
        TR.on(pane, 'click', '[data-split]', (e, b) => { split = !split; b.setAttribute('aria-pressed', String(split)); last = 'split'; draw(); save(); });
        draw();
      } }, { id: 's', t: 'Две школы Kanban', render: drawSchools }], 'b');
      el.insertAdjacentHTML('beforeend', anNote('В сопровождении аналитик отвечает за левые колонки доски: разбирает входящие заявки, уточняет у пекарни, что сломалось и как должно быть, оценивает влияние на кассу и 1С, пишет критерии — и только потом заявка идёт в разработку. Явные правила колонки «Анализ» обычно пишет именно он.'));
    }
  };

  // =====================================================================
  // Теория 2. Поток: многозадачность, закон Литтла, где начинается отсчёт
  // =====================================================================
  const SW = 0.1;
  const effK = k => k <= 1 ? 1 : 1 / (1 + SW * (k - 1) * k / 2);
  function gantt(k, loss) {
    // 4 заявки по 2 дня работы; одновременно в работе k штук, остальные ждут
    const N = 4, W = 2, rem = Array(N).fill(W), start = Array(N).fill(null), end = Array(N).fill(null);
    let t = 0; const dt = 0.05;
    while (end.some(x => x == null) && t < 60) {
      const act = []; for (let i = 0; i < N && act.length < k; i++) if (end[i] == null) act.push(i);
      act.forEach(i => { if (start[i] == null) start[i] = t; });
      const e = loss ? effK(act.length) : 1;
      act.forEach(i => { rem[i] -= dt * e / act.length; if (rem[i] <= 1e-9 && end[i] == null) end[i] = t + dt; });
      t += dt;
    }
    return { start, end, avg: end.reduce((s, x) => s + x, 0) / N, last: Math.max(...end), by8: end.filter(x => x <= 8 + 1e-6).length };
  }
  function drawMulti(pane) {
    let k = 4, loss = true;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Соседний пример — аналитик соседней команды получил четыре заявки, на каждую нужно 2 дня работы. Сколько брать одновременно?</p>
      <div class="kbn-box"><div class="kbn-set"><span class="lbl">Заявок в работе одновременно</span><input type="range" class="kbn-range" min="1" max="4" step="1" value="${k}" data-mk aria-label="Заявок одновременно"><span class="val" data-mkv>${k}</span></div>
      <div class="row">${ui.seg('loss', [{ v: '1', t: 'Переключение отнимает время' }, { v: '0', t: 'Переключение бесплатно (так не бывает)' }], '1', 'accent')}</div></div>
      <div data-mg></div></div>`;
    function draw() {
      const g = gantt(k, loss), T = Math.max(14, Math.ceil(g.last));
      const pct = x => (x / T * 100).toFixed(2) + '%';
      const COL = ['var(--info)', 'var(--violet)', 'var(--accent)', 'var(--warn)'];
      TR.$('[data-mkv]', pane).textContent = k;
      TR.$('[data-mg]', pane).innerHTML = `<div class="kbn-gantt">${g.start.map((s, i) => `<div class="kbn-grow"><span>Заявка ${i + 1}</span><div class="kbn-track"><span class="kbn-bar" style="left:0;width:${pct(s)};background:var(--surface-3)"></span><span class="kbn-bar" style="left:${pct(s)};width:${pct(g.end[i] - s)};background:${COL[i]}"></span></div></div>`).join('')}
        <div class="kbn-grow"><span class="small dim">дни</span><div class="kbn-axis">${[0, 2, 4, 6, 8, 10, 12, 14].filter(x => x <= T).map(x => `<span style="left:${pct(x)}">${x}</span>`).join('')}</div></div></div>
        <div class="kbn-stats" style="margin-top:10px"><div class="stat"><span class="k">Среднее время цикла</span><span class="v ${g.avg <= 5.01 ? 'ok' : 'bad'}">${num(g.avg)} ${dn(g.avg)}</span><span class="s">от начала до «готово»</span></div><div class="stat"><span class="k">Закрыто к 8-му дню</span><span class="v">${g.by8} из 4</span></div><div class="stat"><span class="k">Последняя готова</span><span class="v">на ${num(g.last)}-й день</span></div></div>
        ${ui.note(k === 1 ? 'ok' : 'warn', k === 1 ? 'По одной: первая готова через 2 дня' : 'Все сразу: первая готова поздно', k === 1 ? 'Пропускная способность та же — 4 заявки за 8 дней, — а среднее время цикла минимальное: каждая заявка ждёт, но недолго, и уходит готовой.' : `При ${k} одновременно заявки готовы позже${loss ? ', а потери на переключение растягивают всё ещё сильнее' : ''}. Даже если переключение бесплатное, среднее время цикла растёт: заявки «в работе» дольше, хотя работы столько же. Это и есть закон Литтла: больше в работе при той же скорости — дольше каждая.`)}`;
    }
    TR.on(pane, 'input', '[data-mk]', (e, r) => { k = +r.value; draw(); });
    ui.onSeg(pane, (n, v) => { if (n === 'loss') { loss = v === '1'; draw(); } });
    draw();
  }
  function drawLittle(pane) {
    let wip = 12, th = 1, unk = 'ct';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Соседний пример — очередь в кофейне у вокзала. В очереди люди (это «незавершённая работа»), бариста обслуживает сколько-то человек в минуту (пропускная способность). Сколько ждёт каждый?</p>
      <div class="kbn-people" data-lp aria-hidden="true"></div>
      <div class="kbn-box"><div class="kbn-set">
        <span class="lbl">Людей в очереди (в среднем)</span><input type="range" class="kbn-range" min="1" max="20" step="1" value="${wip}" data-lw aria-label="Людей в очереди"><span class="val" data-lwv>${wip}</span>
        <span class="lbl">Обслуживает в минуту</span><input type="range" class="kbn-range" min="0.5" max="3" step="0.5" value="${th}" data-lt aria-label="Обслуживает в минуту"><span class="val" data-ltv>${th}</span>
      </div></div>
      <div data-lr></div>
      ${ui.note('warn', 'Когда закон работает', 'Это закон про <b>средние за долгий период</b> в устойчивой системе: сколько пришло, столько примерно и ушло. На одном дне или одной заявке он не обязан сходиться. И единицы должны совпадать: если пропускная способность в заявках за неделю, время получится в неделях.')}</div>`;
    function draw() {
      const ct = wip / th;
      TR.$('[data-lwv]', pane).textContent = wip; TR.$('[data-ltv]', pane).textContent = num(th);
      TR.$('[data-lp]', pane).innerHTML = '🧍'.repeat(wip);
      TR.$('[data-lr]', pane).innerHTML = `<div class="kbn-formula">время ожидания = в очереди ÷ пропускная способность = ${wip} ÷ ${num(th)} = ${num(ct)} мин</div>
        <div class="row"><span class="kbn-big ${ct <= 6 ? '' : 'bad'}" style="color:${ct <= 6 ? 'var(--ok)' : 'var(--bad)'}">${num(ct)} мин</span><span class="small muted">${ct > 10 ? 'Человек опоздает на электричку. Помогут два способа: меньше людей в очереди (предзаказ!) или быстрее обслуживать.' : ct > 6 ? 'Терпимо, но в утренний пик люди начнут уходить.' : 'Очередь движется — люди спокойно успевают.'}</span></div>
        <div class="small muted">Та же формула в трёх видах: <b>время = в работе ÷ пропускная</b>; <b>в работе = время × пропускная</b>; <b>пропускная = в работе ÷ время</b>. Закон Литтла (Джон Литтл, 1961) — из теории очередей; в Kanban его используют для заявок: «в работе 8 заявок, закрываем 2 в день — каждая идёт около 4 дней».</div>`;
    }
    TR.on(pane, 'input', '[data-lw]', (e, r) => { wip = +r.value; draw(); });
    TR.on(pane, 'input', '[data-lt]', (e, r) => { th = +r.value; draw(); });
    draw();
  }
  const JOURNEY = ['Заявка пришла', 'Взяли в анализ', 'Разработка', 'Тестирование', 'Готово', 'Выкатили в пекарни'];
  const SPANS = {
    ct: { t: 'Время цикла', from: 1, to: 4, txt: 'От момента, когда команда начала работу (взяла в анализ), до «Готово». Так считает Kanban Guide 2020: от «начато» до «закончено» — где эти точки, команда определяет сама и записывает.' },
    lt: { t: 'Время выполнения (lead time)', from: 0, to: 5, txt: 'От появления заявки до того, как результат у пользователя. Это то время, которое чувствует Павел: «я написал во вторник, а кнопка появилась через 9 дней».' },
    age: { t: 'Возраст заявки', from: 1, to: 2, txt: 'Сколько уже длится начатая, но не законченная заявка. Единственная метрика, которая предупреждает заранее: если возраст больше обычного времени цикла — заявку надо спасать сейчас.' }
  };
  function drawMetrics(pane) {
    let cur = 'ct';
    pane.innerHTML = `<div class="stack"><div class="row">${ui.seg('jm', Object.keys(SPANS).map(k => ({ v: k, t: SPANS[k].t })), cur, 'accent')}</div><div data-jr></div>
      ${ui.note('', 'Ещё две метрики', '<b>Пропускная способность</b> — сколько заявок закрыто за период: «12 за неделю». <b>Незавершённая работа (WIP)</b> — сколько заявок начато и не закончено прямо сейчас.')}
      ${ui.note('warn', 'Честно о словах', 'Термины «lead time» и «cycle time» разные авторы понимают по-разному: у одних время цикла — только работа разработчиков, у других — весь путь. Договоритесь в команде, откуда и докуда считаете, и запишите это в явные правила.')}</div>`;
    function draw() {
      const s = SPANS[cur];
      TR.$('[data-jr]', pane).innerHTML = `<div class="kbn-journey">${JOURNEY.map((j, i) => `<div class="${i >= s.from && i <= s.to ? 'in' : ''}">${j}</div>`).join('')}</div><div class="small" style="margin-top:6px">${s.txt}</div>`;
    }
    ui.onSeg(pane, (n, v) => { if (n === 'jm') { cur = v; draw(); } });
    draw();
  }
  const howFlow = {
    id: 'how-flow', covers: ['little'], title: 'Как это работает: поток, время цикла и закон Литтла', free: true, noReset: true,
    simple: {
      icon: '⏳',
      plain: 'Чем больше дел начато одновременно, тем дольше каждое из них идёт до конца — даже если люди работают так же быстро. Поэтому в Kanban ограничивают начатое и меряют, сколько дней заявка идёт от начала до конца.',
      analogy: 'Очередь в пекарне: 12 человек, кассир обслуживает одного в минуту — каждый стоит около 12 минут. Чтобы стоять меньше, надо или меньше людей в очереди (предзаказ), или кассир быстрее.',
      tech: '<b>Время цикла</b> — сколько заявка идёт от начала работы до «готово». <b>Пропускная способность</b> — сколько заявок закрывают за период. <b>WIP</b> — сколько начато и не закончено. <b>Закон Литтла</b> (Джон Литтл, 1961): среднее время прохождения = средний объём незавершённой работы ÷ средняя пропускная способность — для средних за долгий период в устойчивой системе. Эвристика Джеральда Вайнберга: каждая лишняя параллельная задача съедает заметную долю времени на переключение.'
    },
    lead: ui.brief({
      situation: 'Три вкладки. «Многозадачность» — четыре заявки по 2 дня: что будет, если делать их по одной или все сразу. «Закон Литтла» — очередь в кофейне с ползунками. «Откуда считать» — путь заявки и где начинаются и заканчиваются разные метрики.',
      todo: [
        'Вкладка «Многозадачность»: двигайте ползунок от 1 до 4. Сравните среднее время цикла. Потом выберите «Переключение бесплатно» — время всё равно растёт?',
        'Вкладка «Закон Литтла»: двигайте оба ползунка и найдите два разных способа сократить ожидание до 6 минут и меньше.',
        'Вкладка «Откуда считать»: переключите три метрики и посмотрите, какой отрезок пути каждая меряет.'
      ],
      look: 'На диаграмме серое — заявка ждёт, цветное — в работе. Закон Литтла работает для средних за долгий период: в задачах практики все ситуации именно такие.'
    }),
    render(el) {
      el.classList.add('kbn-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [{ id: 'm', t: 'Многозадачность', render: drawMulti }, { id: 'l', t: 'Закон Литтла', render: drawLittle }, { id: 'j', t: 'Откуда считать', render: drawMetrics }], 'm');
      el.insertAdjacentHTML('beforeend', anNote('Аналитику эти цифры нужны, чтобы говорить с бизнесом фактами: не «мы стараемся», а «в среднем заявка идёт 4 дня, 85 % — быстрее 6 дней; если брать больше одновременно, станет дольше». И чтобы честно видеть себя: если перед «Анализом» копится очередь, узкое место — вы.'));
    }
  };

  // =====================================================================
  // Теория 3. Классы обслуживания, Scrumban, что ломается при неверном подходе
  // =====================================================================
  const CLS = {
    exp: { t: 'Срочно', en: 'expedite', ex: 'Кофемашина в зале сломалась — каждый час без неё теряем выручку.', policy: 'Берём сразу, даже если колонка заполнена (лимит можно превысить). Одновременно — не больше одной срочной: если срочно всё, не срочно ничего. Отдельная дорожка сверху доски.', curve: [[0, 10], [1, 70], [3, 95], [10, 98]] },
    date: { t: 'С фиксированной датой', en: 'fixed date', ex: 'Меню к 14 февраля: после праздника оно никому не нужно.', policy: 'Начинать заранее: дата минус обычное время цикла с запасом. До даты задержка почти ничего не стоит, после — обрыв.', curve: [[0, 2], [6.9, 4], [7, 92], [10, 95]] },
    std: { t: 'Обычное', en: 'standard', ex: 'Добавить в меню сироп «солёная карамель».', policy: 'Основной поток: берём по порядку, который определил владелец, в пределах лимитов. Стоимость задержки растёт плавно.', curve: [[0, 0], [10, 55]] },
    int: { t: 'Нематериальное', en: 'intangible', ex: 'Обновить программу кассы до того, как старая версия начнёт сбоить.', policy: 'Сейчас задержка почти бесплатна, но потом резко дорожает. Держат постоянную долю ёмкости — например, одну заявку из пяти, — иначе такие задачи не делают никогда.', curve: [[0, 0], [5, 6], [8, 25], [10, 70]] }
  };
  function curveSvg(pts) {
    const X = x => 30 + x / 10 * 260, Y = y => 128 - y;
    const path = pts.map((p, i) => (i ? 'L' : 'M') + X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1)).join(' ');
    return `<svg viewBox="0 0 300 146" width="100%" style="max-width:420px" role="img" aria-label="Стоимость задержки во времени">
      <line x1="30" y1="128" x2="292" y2="128" style="stroke:var(--border-strong)"/><line x1="30" y1="16" x2="30" y2="128" style="stroke:var(--border-strong)"/>
      <path d="${path}" style="fill:none;stroke:var(--bad);stroke-width:2.5"/>
      <text x="292" y="142" text-anchor="end" style="fill:var(--text-muted);font-size:10px">время задержки →</text>
      <text x="34" y="11" style="fill:var(--text-muted);font-size:10px">↑ цена задержки</text></svg>`;
  }
  function drawClasses(pane) {
    let cur = 'exp';
    pane.innerHTML = `<div class="stack"><div class="kbn-cls">${Object.keys(CLS).map(k => `<button type="button" data-cl="${k}" aria-pressed="${k === cur}"><b>${CLS[k].t}</b><small>${CLS[k].en}</small></button>`).join('')}</div><div data-clv></div>
      ${ui.note('', 'Откуда это', 'Четыре класса обслуживания — из метода Дэвида Андерсона. Класс — это правило «как с этой заявкой обращаемся», а не степень громкости заявителя. В Kanban Guide 2020 классов нет — там ожидание по сроку.')}</div>`;
    function draw() {
      const c = CLS[cur];
      TR.$$('[data-cl]', pane).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cl === cur)));
      TR.$('[data-clv]', pane).innerHTML = `<div class="kbn-box"><div>${curveSvg(c.curve)}</div><div><span class="kbn-lbl">Пример (кофейня)</span><div>${c.ex}</div></div><div><span class="kbn-lbl">Правило</span><div>${c.policy}</div></div></div>`;
    }
    TR.on(pane, 'click', '[data-cl]', (e, b) => { cur = b.dataset.cl; draw(); });
    draw();
  }
  const SB_ROWS = [['plan', 'Планирование'], ['commit', 'Обязательство'], ['roles', 'Роли'], ['wip', 'Ограничение работы'], ['change', 'Новое посреди периода'], ['meet', 'Обзор и ретроспектива'], ['measure', 'Что меряют']];
  const SB = {
    scrum: { t: 'Scrum', plan: 'Раз в спринт (2 недели)', commit: 'Цель спринта', roles: 'Владелец продукта, Scrum-мастер, разработчики', wip: 'Косвенно: берут в спринт сколько успеют', change: 'В бэклог, на следующее планирование', meet: 'Каждый спринт', measure: 'Цель достигнута? Скорость' },
    scrumban: { t: 'Scrumban', plan: 'Регулярно, но по сигналу: «в колонке «Готово к работе» меньше 5 заявок — пополняем»', commit: 'Короткие цели или ожидание по сроку', roles: 'Как в команде было; часто без Scrum-мастера', wip: 'Явные лимиты на колонки', change: 'Можно взять, как только освободилось место', meet: 'Обзор и ретроспектива по графику — остались из Scrum', measure: 'Время цикла, пропускная способность' },
    kanban: { t: 'Kanban', plan: 'Непрерывно: берут новое, когда освободилось место', commit: 'Ожидание по сроку: «85 % — за 5 дней»', roles: 'Не вводит новых', wip: 'Явные лимиты — главное', change: 'Сразу, по классу обслуживания', meet: 'Каденции по договорённости: ежедневно у доски, обзор потока', measure: 'Время цикла, пропускная, возраст, WIP' }
  };
  function drawScrumban(pane) {
    let cur = 'scrumban';
    pane.innerHTML = `<div class="stack"><div class="row">${ui.seg('sb', Object.keys(SB).map(k => ({ v: k, t: SB[k].t })), cur, 'accent')}</div><div data-sbv></div>
      ${ui.note('info', 'Scrumban', 'Название придумал Кори Ладас (2008): сначала — как путь команды от Scrum к Kanban. Сегодня так называют любые смеси: спринты с лимитами на колонках, Kanban с регулярными обзорами и ретроспективами. У Scrum.org есть отдельное руководство «Kanban для Scrum-команд». Чистых процессов в жизни мало — важно понимать, что вы взяли и зачем.')}</div>`;
    function draw() { const s = SB[cur]; TR.$('[data-sbv]', pane).innerHTML = `<div class="kbn-kv">${SB_ROWS.map(([k, t]) => `<div class="k">${t}</div><div class="v">${s[k]}</div>`).join('')}</div>`; }
    ui.onSeg(pane, (n, v) => { if (n === 'sb') { cur = v; draw(); } });
    draw();
  }
  const MIX = {
    s2k: { t: 'Новый продукт — по Kanban', who: 'Приложение кофеен в первые полгода', breaks: ['Нет цели на две недели: команда закрывает заявки, но непонятно, куда движется продукт.', 'Нет обязательного показа: владелец кофеен видит результат, только когда сам спросит.', 'Большие куски работы не режутся: заявка «каталог меню» висит в разработке месяц.'], fix: 'Если всё же Kanban — добавить цель продукта, регулярный обзор с владельцем и правило «заявка не больше 3 дней работы».' },
    k2s: { t: 'Поддержка — по Scrum', who: 'Кофейни после запуска: 15 заявок в неделю', breaks: ['Срочная ошибка ждёт следующего планирования — или спринт ломают каждый день, и цель спринта теряет смысл.', 'Планировать две недели вперёд нечего: заявки приходят завтра.', 'Демо на 15 мелких правок превращается в формальность.'], fix: 'Если всё же спринты — держать долю ёмкости на срочное и не притворяться, что цель спринта не меняется.' }
  };
  function drawMix(pane) {
    let cur = 'k2s';
    pane.innerHTML = `<div class="stack"><p class="small muted">Соседний пример — приложение сети кофеен. Что ломается, если подход не подходит работе?</p><div class="row">${ui.seg('mx', Object.keys(MIX).map(k => ({ v: k, t: MIX[k].t })), cur, 'accent')}</div><div data-mx></div></div>`;
    function draw() {
      const m = MIX[cur];
      TR.$('[data-mx]', pane).innerHTML = `<div class="kbn-box"><span class="kbn-lbl">${m.who}</span><ul class="checks">${m.breaks.map(b => `<li class="bad">${b}</li>`).join('')}</ul>${ui.note('warn', 'Если иначе нельзя', m.fix)}</div>`;
    }
    ui.onSeg(pane, (n, v) => { if (n === 'mx') { cur = v; draw(); } });
    draw();
  }
  const howClasses = {
    id: 'how-classes', covers: ['classes', 'why'], title: 'Как это работает: классы обслуживания и Scrumban', free: true, noReset: true,
    simple: {
      icon: '🚦',
      plain: 'Не все заявки одинаковые: одна горит прямо сейчас, другая важна к определённой дате, третья подождёт, четвёртая станет срочной через полгода, если о ней забыть. Для каждого вида — своё правило.',
      analogy: 'В пекарне: сломалась печь — бросают всё; торты к 8 Марта — заранее по календарю; новый вкус маффина — в обычном порядке; почистить вытяжку — понемногу каждую неделю, иначе однажды пожар.',
      tech: '<b>Классы обслуживания</b> (Д. Андерсон): <b>срочно</b> (expedite), <b>с фиксированной датой</b> (fixed date), <b>обычное</b> (standard), <b>нематериальное</b> (intangible — техдолг, обновления). Они опираются на <b>стоимость задержки</b> — сколько теряем за каждый день ожидания (Дон Рейнертсен). <b>Scrumban</b> (Кори Ладас, 2008) — смесь Scrum и Kanban.'
    },
    lead: ui.brief({
      situation: 'Три вкладки на соседних примерах. «Классы обслуживания» — четыре класса, у каждого — кривая стоимости задержки и правило. «Scrum, Scrumban, Kanban» — что меняется между ними. «Что ломается» — что будет, если взять подход, который не подходит работе.',
      todo: [
        'Вкладка «Классы обслуживания»: переключите все четыре и сравните кривые. Где задержка дорожает сразу, где — после даты, где — нескоро?',
        'Вкладка «Scrum, Scrumban, Kanban»: переключите и посмотрите, какие строки меняются.',
        'Вкладка «Что ломается»: прочитайте оба варианта.'
      ],
      look: 'Кривая — сколько стоит задержка в зависимости от того, сколько заявка ждёт. Чем круче она поднимается сразу, тем раньше заявку надо взять.'
    }),
    render(el) {
      el.classList.add('kbn-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [{ id: 'c', t: 'Классы обслуживания', render: drawClasses }, { id: 's', t: 'Scrum, Scrumban, Kanban', render: drawScrumban }, { id: 'x', t: 'Что ломается', render: drawMix }], 'c');
      el.insertAdjacentHTML('beforeend', anNote('Класс заявке обычно назначают на входе — при разборе, и часто это делает аналитик вместе с владельцем продукта. Важно не путать громкость с классом: «Олег Петрович очень просит» — не повод для «срочно», если есть обходной путь. Правила классов записывают на доске, чтобы спорили с правилом, а не с людьми.'));
    }
  };

  // =====================================================================
  // Практика 1. Лаборатория: симулятор потока сопровождения «Колоса»
  // =====================================================================
  const ARR = [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1];
  const DAYS = 20;
  const PROF = [
    { a: .5, ask: 0, d: 1, t: .5 }, { a: 1, ask: 1, d: 1.5, t: .5 }, { a: .5, ask: 0, d: .5, t: .25 }, { a: .5, ask: 1, d: 2, t: .5 },
    { a: .5, ask: 0, d: 1, t: .5 }, { a: .5, ask: 0, d: 1, t: .5 }, { a: .5, ask: 2, d: 1, t: .5 }, { a: 1, ask: 0, d: 1.5, t: .5 },
    { a: .5, ask: 0, d: .5, t: .25 }, { a: .5, ask: 1, d: 1, t: .5 }
  ];
  const REQ = [
    'Покровка: кассир не находит предзаказ по коду, если код начинается с нуля',
    'Галина Ивановна: в плане выпечки не видно предзаказов на второй развоз',
    'Павел: кнопку «Выдано» сделать крупнее — в перчатках промахиваются',
    'Олег Петрович: в сводке для 1С не сходится сумма оплат при получении',
    'Покупательница: SMS «заказ готов» пришло раньше, чем заказ собрали',
    'Вторая пилотная пекарня: после 20:00 список на экране кассира не обновляется',
    'Рита: ссылка на предзаказ в посте ВКонтакте',
    'Павел: показывать имя покупателя рядом с кодом заказа',
    'Кассир: после обрыва связи заказ «завис» в статусе «Оплачен»',
    'Олег Петрович: сводка в 1С пришла в 09:20 вместо 09:00',
    'Павел: короткий код не печатается на чеке',
    'Покупатель: нет интервала 20:30–21:00',
    'Галина Ивановна: предзаказы на завтра — отдельным листом для цеха',
    'Вторая пилотная пекарня: заказ в 22:31 принят, хотя приём до 22:30',
    'Рита: поменять текст пуш-уведомления',
    'Павел: отменённые заказы висят в списке выдачи',
    'Кассир-новичок: на экране оплаты непонятная ошибка вместо подсказки',
    'Олег Петрович: возврат при отмене не попадает в сводку',
    'Нина: число невыкупленных заказов за день — в отчёт',
    'Анна Павловна: в приложении слишком мелкий шрифт',
    'Покровка: при слабом модеме экран выдачи грузится 20 секунд',
    'Галина Ивановна: в плане нет заказов, оформленных через кассира по телефону',
    'Павел: сортировать заказы на выдачу по интервалу',
    'Покупатель: СБП оплачено, а заказ «Ждёт оплаты»',
    'Рита: промокод для подписчиков ВКонтакте',
    'Олег Петрович: у чека предоплаты не тот признак расчёта',
    'Вторая пилотная пекарня: дубли заказов после двойного нажатия «Оплатить»',
    'Павел: распечатка списка заказов на утро',
    'Кассир: статус «Не выкуплен» не ставится через 30 минут после интервала',
    'Нина: показывать в приложении, что круассаны — с 07:30'
  ];
  const STG = [{ k: 'a', t: 'Анализ', who: 'вы', n: 1, max: 6 }, { k: 'd', t: 'Разработка', who: '2 разработчика', n: 2, max: 8 }, { k: 't', t: 'Тестирование', who: 'Лера', n: 1, max: 6 }];
  const WRK = { a: 1, d: 2, t: 1 };
  function kbItems() { const out = []; let n = 0; ARR.forEach((k, day) => { for (let i = 0; i < k; i++) { const p = PROF[n % PROF.length]; out.push({ id: n + 1, arr: day, a: p.a, ask: p.ask, d: p.d, t: p.t, title: REQ[n] || 'Заявка ' + (n + 1) }); n++; } }); return out; }
  // L: { a, d, t } — лимит «в работе» на колонку; 0 — без лимита
  function kbSim(L, days) {
    const its = kbItems().map(x => Object.assign(x, { st: '', sub: 'q', rem: 0, blk: 0, asked: false, done: null }));
    const lim = c => L && L[c] > 0 ? L[c] : 1e9;
    const hist = [];
    for (let d = 0; d < days; d++) {
      its.forEach(x => { if (x.arr === d) { x.st = 'a'; x.sub = 'q'; x.rem = x.a; } });
      const fin = [];
      ['t', 'd', 'a'].forEach(c => {
        let cap = Math.min(WRK[c], lim(c)); const got = new Map();
        for (let g = 0; g < 30 && cap > 1e-9; g++) {
          let w = its.filter(x => x.st === c && x.sub === 'w').length;
          its.forEach(x => { if (x.st === c && x.sub === 'q' && w < lim(c)) { x.sub = 'w'; w++; } });
          const live = its.filter(x => x.st === c && x.sub === 'w' && x.blk === 0 && x.rem > 1e-9);
          const act = live.filter(x => (got.get(x) || 0) < 1 - 1e-9);
          if (!act.length) break;
          const e = effK(Math.max(1, live.length / WRK[c]));
          const share = cap * e / act.length;
          let used = 0;
          act.forEach(x => {
            const q = Math.min(share, 1 - (got.get(x) || 0), x.rem);
            x.rem -= q; got.set(x, (got.get(x) || 0) + q); used += q;
            if (c === 'a' && !x.asked && x.ask > 0 && x.rem <= x.a / 2 + 1e-9 && x.rem > 1e-9) { x.asked = true; x.blk = x.ask + 1; }
            if (x.rem <= 1e-9) { x.sub = 'f'; fin.push(x); }
          });
          cap -= used / e;
          if (used < 1e-9) break;
        }
      });
      fin.forEach(x => { if (x.st === 't') { x.st = 'done'; x.done = d; } else if (x.st === 'd') { x.st = 't'; x.sub = 'q'; x.rem = x.t; } else if (x.st === 'a') { x.st = 'd'; x.sub = 'q'; x.rem = x.d; } });
      its.forEach(x => { if (x.blk > 0) x.blk -= 1; });
      const cnt = (st, sub) => its.filter(x => x.st === st && (!sub || x.sub === sub)).length;
      hist.push({ a: cnt('a'), d: cnt('d'), t: cnt('t'), aq: cnt('a', 'q'), dq: cnt('d', 'q'), tq: cnt('t', 'q'), done: cnt('done') });
    }
    const closed = its.filter(x => x.done != null);
    const ct = closed.length ? closed.reduce((s, x) => s + (x.done - x.arr + 1), 0) / closed.length : 0;
    const open = its.filter(x => x.arr < days && x.done == null);
    const ageAvg = open.length ? open.reduce((s, x) => s + (days - x.arr), 0) / open.length : 0;
    const ageMax = open.length ? Math.max(...open.map(x => days - x.arr)) : 0;
    const n = Math.max(1, hist.length);
    const avg = k => hist.reduce((s, h) => s + h[k], 0) / n;
    const wip = hist.reduce((s, h) => s + h.a + h.d + h.t, 0) / n;
    const pile = STG.map(s => ({ k: s.k, t: s.t, v: avg(s.k) })).sort((x, y) => y.v - x.v)[0];
    return { its, hist, closed: closed.length, ct, ctR: Math.round(ct * 10) / 10, open: open.length, ageAvg, ageMax, wip, th: closed.length / n, pile, days };
  }
  const limOf = a => a && a.on ? { a: a.a, d: a.d, t: a.t } : { a: 0, d: 0, t: 0 };
  const sigOf = a => a && a.on ? `on:${a.a},${a.d},${a.t}` : 'off';
  const BASE = kbSim({ a: 0, d: 0, t: 0 }, DAYS);
  function cfdSvg(hist, day) {
    const W = 440, H = 170, P = 28, maxY = 30, X = d => P + d / DAYS * (W - P - 8), Y = v => H - 18 - v / maxY * (H - 30);
    const cum = hist.slice(0, day).map(h => { const s1 = h.done, s2 = s1 + h.t, s3 = s2 + h.d, s4 = s3 + h.a; return [s1, s2, s3, s4]; });
    if (!cum.length) return `<svg class="kbn-cfd" viewBox="0 0 ${W} ${H}" role="img" aria-label="Накопительная диаграмма потока"><text x="${W / 2}" y="${H / 2}" text-anchor="middle" style="fill:var(--text-muted);font-size:14px">Прогоните хотя бы день — здесь появится диаграмма</text></svg>`;
    const pts = cum.map((c, i) => [i + 1, c]);
    const band = (lo, hi, col) => {
      const top = pts.map(([d, c]) => `${X(d).toFixed(1)},${Y(c[hi]).toFixed(1)}`);
      const bot = pts.slice().reverse().map(([d, c]) => `${X(d).toFixed(1)},${Y(lo < 0 ? 0 : c[lo]).toFixed(1)}`);
      return `<polygon points="${[`${X(0)},${Y(0)}`].concat(top, bot.length ? bot : []).join(' ')}" style="fill:${col};stroke:none"/>`;
    };
    let s = `<svg class="kbn-cfd" viewBox="0 0 ${W} ${H}" role="img" aria-label="Накопительная диаграмма потока">`;
    for (let v = 0; v <= maxY; v += 10) s += `<line x1="${P}" y1="${Y(v)}" x2="${W - 8}" y2="${Y(v)}" style="stroke:var(--border);stroke-dasharray:3 4"/><text x="${P - 4}" y="${Y(v) + 4}" text-anchor="end" style="fill:var(--text-muted);font-size:12px">${v}</text>`;
    s += band(2, 3, 'color-mix(in srgb, var(--info) 55%, transparent)') + band(1, 2, 'color-mix(in srgb, var(--violet) 55%, transparent)') + band(0, 1, 'color-mix(in srgb, var(--warn) 60%, transparent)') + band(-1, 0, 'color-mix(in srgb, var(--ok) 60%, transparent)');
    [0, 5, 10, 15, 20].forEach(d => { s += `<text x="${X(d)}" y="${H - 4}" text-anchor="middle" style="fill:var(--text-muted);font-size:12px">${d}</text>`; });
    return s + '</svg>';
  }
  function boardHtml(r, on, L, sel) {
    const its = r.its;
    const c = (x) => { const fin = x.st === 'done', age = fin ? x.done - x.arr + 1 : r.days - x.arr; return `<button type="button" class="kbn-c ${age >= 6 ? 'a2' : age >= 4 ? 'a1' : ''} ${x.blk > 0 ? 'blk' : ''} ${sel === x.id ? 'sel' : ''}" data-kc="${x.id}" title="${esc('#' + x.id + ' · ' + x.title + ' · ' + (fin ? 'готово за ' : '') + age + ' дн.')}">${x.blk > 0 ? '⏳' : ''}${x.id}</button>`; };
    const pileK = r.days ? r.pile.k : '';
    let h = '<div class="kbn-board">';
    STG.forEach(s => {
      const q = its.filter(x => x.st === s.k && x.sub === 'q'), w = its.filter(x => x.st === s.k && x.sub !== 'q');
      const limTxt = on ? `<span class="lim ${w.length > L[s.k] ? 'over' : ''}">в работе ≤ ${L[s.k]}</span>` : '<span class="lim no">без лимита</span>';
      h += `<div class="kbn-col ${pileK === s.k && (q.length + w.length) >= 5 ? 'hot' : ''}"><div class="hd"><span>${s.t} <small>${s.who}</small></span>${limTxt}</div>
        <div class="kbn-subs"><div class="kbn-sub"><span class="st">очередь · ${q.length}</span><div class="kbn-chips">${q.map(c).join('')}</div></div><div class="kbn-sub w"><span class="st">в работе · ${w.length}</span><div class="kbn-chips">${w.map(c).join('')}</div></div></div></div>`;
    });
    const done = its.filter(x => x.st === 'done');
    h += `<div class="kbn-col"><div class="hd"><span>Готово</span></div><div class="kbn-done">${done.length}</div><div class="kbn-chips">${done.slice(-8).map(c).join('')}</div></div></div>`;
    return h;
  }
  function labVerdict(r, on) {
    if (!r.days) return ui.note('', 'Месяц сопровождения впереди', 'В день приходит одна-две заявки из двух пилотных пекарен — за месяц 30. Нажмите «Прогнать неделю» и посмотрите, что происходит на доске.');
    const A = r.its.filter(x => x.st === 'a').length, D = r.its.filter(x => x.st === 'd').length;
    if (!on) {
      if (A >= 6) return ui.note('bad', 'Затор у аналитика', `В «Анализе» ${A} ${TR.plural(A, 'заявка', 'заявки', 'заявок')}: вы отвечаете каждой пекарне «уже смотрю», берёте всё сразу и переключаетесь между ними. Каждая лишняя заявка в работе съедает время на переключение, поэтому до разработки доходит всё меньше — в «Разработке» сейчас ${D}. Разработчики простаивают, а очередь у вас растёт.`);
      return ui.note('warn', 'Пока терпимо', 'Заявок ещё немного, переключений мало. Прогоните дальше — что будет, когда их станет больше?');
    }
    const q = STG.map(s => ({ s, n: r.its.filter(x => x.st === s.k && x.sub === 'q').length })).sort((x, y) => y.n - x.n)[0];
    if (r.ctR >= 5 && r.closed > 0) return ui.note('warn', `Время цикла ${num(r.ct)} ${dn(r.ct)}`, `Очередь больше всего перед колонкой «${q.s.t}» (${q.n}). Если лимит меньше, чем людей в колонке, кто-то простаивает; если намного больше — люди снова жонглируют. Подберите лимиты так, чтобы работа не стояла и не копилась.`);
    return ui.note('ok', 'Поток идёт', `Заявок в работе немного, каждая доводится до конца. Больше всего ждут перед «${q.s.t}» — за этой колонкой и следите: там узкое место.`);
  }
  const labTask = {
    id: 'wip-lab', title: 'Лаборатория: поток заявок сопровождения',
    simple: howBoard.simple,
    lead: ui.brief({
      situation: 'Февраль 2027, пилот в двух пекарнях запущен. Заявки сыплются от Павла, Галины Ивановны, Олега Петровича, Риты и покупателей — по одной-две в день, за месяц 30. На доске три колонки: «Анализ» — вы одна или один, «Разработка» — два разработчика, «Тестирование» — Лера. У каждой колонки — «очередь» и «в работе». Пока лимитов нет: кто получил заявку, тот сразу её «взял в работу».',
      todo: [
        'Нажмите «Прогнать месяц» без лимитов. Посмотрите на доску, на «Где копится» и на число закрытых. Нажмите на номер заявки, чтобы прочитать её.',
        'Включите лимиты и двигайте ползунки «в работе ≤» для каждой колонки. После каждой настройки прогоняйте неделю или месяц.',
        'Добейтесь за месяц: среднее время цикла меньше 5 дней, а закрыто не меньше, чем без лимитов. Оставьте эту настройку и нажмите «Проверить».'
      ],
      look: 'Номер — заявка, цвет — возраст: жёлтый — 4–5 дней, красный — 6 и больше; ⏳ — ждём ответа пекарни. Время цикла — от появления заявки на доске до «Готово». Красная рамка — колонка, где копится больше всего. Диаграмма внизу — накопительная: ширина полосы — сколько заявок в колонке; расширяется — там затор. Модель учебная: потери на переключение мягче, чем в эвристике Вайнберга, но механизм настоящий.'
    }),
    blank: () => ({ on: false, a: 3, d: 4, t: 2, day: 0, seen: [] }),
    reference: () => ({ on: true, a: 2, d: 2, t: 1, day: DAYS, seen: ['off', 'on:2,2,1'] }),
    render(el, ctx) {
      el.classList.add('kbn-root');
      const a = ctx.ans;
      ['a', 'd', 't'].forEach((k, i) => { if (!(a[k] >= 1)) a[k] = [3, 4, 2][i]; });
      a.day = Math.max(0, Math.min(DAYS, a.day || 0)); a.seen = Array.isArray(a.seen) ? a.seen : []; a.on = !!a.on;
      let sel = null;
      el.innerHTML = `<div class="stack">
        <div class="kbn-box">
          <div class="row">${ui.seg('lon', [{ v: '0', t: 'Без лимитов' }, { v: '1', t: 'С лимитами WIP' }], a.on ? '1' : '0', 'accent')}</div>
          <div class="kbn-set">${STG.map(s => `<span class="lbl">${s.t} (${s.who}): в работе ≤</span><input type="range" class="kbn-range" min="1" max="${s.max}" step="1" value="${a[s.k]}" data-lim="${s.k}" aria-label="Лимит: ${s.t}" ${a.on && !ctx.readonly ? '' : 'disabled'}><span class="val" data-limv="${s.k}">${a.on ? a[s.k] : 'нет'}</span>`).join('')}</div>
        </div>
        <div class="row"><button type="button" class="btn sm" data-run="1">+1 день</button><button type="button" class="btn sm" data-run="5">Прогнать неделю</button><button type="button" class="btn sm primary" data-run="20">Прогнать месяц</button><button type="button" class="btn sm ghost" data-run="0">⟲ Сначала</button><span class="small dim" data-dl></span></div>
        <div data-bd></div><div data-ki></div>
        <div class="kbn-stats" data-st></div>
        <div data-vd></div>
        <div class="kbn-box"><span class="kbn-lbl">Накопительная диаграмма потока</span><div data-cfd></div>
          <div class="kbn-legend"><span><i style="background:color-mix(in srgb, var(--info) 55%, transparent)"></i>Анализ</span><span><i style="background:color-mix(in srgb, var(--violet) 55%, transparent)"></i>Разработка</span><span><i style="background:color-mix(in srgb, var(--warn) 60%, transparent)"></i>Тестирование</span><span><i style="background:color-mix(in srgb, var(--ok) 60%, transparent)"></i>Готово</span><span>по горизонтали — дни, по вертикали — заявки</span></div></div>
        <div data-cmp></div>
      </div>`;
      function draw() {
        const L = limOf(a), r = kbSim(L, a.day), month = kbSim(L, DAYS);
        TR.$('[data-dl]', el).textContent = `День ${a.day} из ${DAYS}`;
        TR.$('[data-bd]', el).innerHTML = boardHtml(r, a.on, L, sel);
        const it = sel && r.its.find(x => x.id === sel);
        TR.$('[data-ki]', el).innerHTML = it && it.st ? `<div class="kbn-foot">#${it.id} · ${esc(it.title)} · ${it.st === 'done' ? `готово за ${it.done - it.arr + 1} ${dn(it.done - it.arr + 1)}` : `на доске ${r.days - it.arr} ${dn(r.days - it.arr)}`}${it.blk > 0 ? ' · ждём ответа пекарни' : ''}</div>` : '';
        TR.$('[data-st]', el).innerHTML = r.days ? `
          <div class="stat"><span class="k">Закрыто</span><span class="v">${r.closed}</span><span class="s">пришло ${r.its.filter(x => x.arr < r.days).length}</span></div>
          <div class="stat"><span class="k">Среднее время цикла</span><span class="v ${r.closed ? (r.ctR < 5 ? 'ok' : 'bad') : ''}">${r.closed ? num(r.ct) + ' дн.' : '—'}</span><span class="s">по закрытым</span></div>
          <div class="stat"><span class="k">В работе сейчас</span><span class="v">${r.its.filter(x => ['a', 'd', 't'].includes(x.st)).length}</span><span class="s">в среднем ${num(r.wip)}</span></div>
          <div class="stat"><span class="k">Незакрытые</span><span class="v ${r.ageMax >= 6 ? 'bad' : ''}">${r.open}</span><span class="s">самой старой ${r.ageMax} ${dn(r.ageMax)}</span></div>
          <div class="stat"><span class="k">Где копится</span><span class="v">${r.pile.t}</span><span class="s">в среднем ${num(r.pile.v)} заявки</span></div>
          <div class="stat"><span class="k">Закон Литтла</span><span class="v">${r.closed ? num(r.wip / r.th) + ' дн.' : '—'}</span><span class="s">в работе ÷ пропускная</span></div>` : '';
        TR.$('[data-vd]', el).innerHTML = labVerdict(r, a.on) + (r.days >= 10 && r.closed && Math.abs(r.wip / r.th - r.ct) > 3 ? ui.note('warn', 'Почему Литтл не сходится со средним', 'Среднее время считают только по закрытым заявкам — а самые долгие ещё висят. Когда работа копится, среднее по закрытым врёт в лучшую сторону. Смотрите на возраст незакрытых: он честнее.') : '');
        TR.$('[data-cfd]', el).innerHTML = cfdSvg(r.hist, a.day);
        const okNow = a.on && month.ctR < 5 && month.closed >= BASE.closed;
        TR.$('[data-cmp]', el).innerHTML = `<div class="kbn-lbl" style="margin-bottom:6px">Итог месяца: сравнение</div><div class="kbn-cmp">
          <div class="stat"><span class="k">Без лимитов ${a.seen.includes('off') ? '' : '(ещё не прогоняли)'}</span><span class="v">${a.seen.includes('off') ? `${BASE.closed} закрыто · ${num(BASE.ct)} дн.` : '?'}</span><span class="s">${a.seen.includes('off') ? `незакрытых ${BASE.open}, самой старой ${BASE.ageMax} ${dn(BASE.ageMax)}` : 'прогоните месяц без лимитов'}</span></div>
          <div class="stat"><span class="k">${a.on ? `Ваши лимиты ${a.a} / ${a.d} / ${a.t}` : 'Ваши лимиты'}</span><span class="v ${a.on && a.seen.includes(sigOf(a)) ? (okNow ? 'ok' : 'bad') : ''}">${a.on && a.seen.includes(sigOf(a)) ? `${month.closed} закрыто · ${num(month.ct)} дн.` : '?'}</span><span class="s">${a.on ? (a.seen.includes(sigOf(a)) ? (okNow ? 'цель: меньше 5 дней, закрыто не меньше — есть' : `цель: меньше 5 дней и не меньше ${BASE.closed} закрытых`) : 'прогоните месяц с этими лимитами') : 'включите лимиты'}</span></div></div>`;
        TR.$$('[data-lim]', el).forEach(i => { i.disabled = !a.on || ctx.readonly; });
        TR.$$('[data-limv]', el).forEach(v => { v.textContent = a.on ? a[v.dataset.limv] : 'нет'; });
        if (ctx.readonly) TR.$$('[data-seg] button, [data-run]', el).forEach(b => { b.disabled = true; });
      }
      const save = () => ctx.save();
      TR.on(el, 'click', '[data-run]', (e, b) => {
        if (ctx.readonly) return;
        const n = +b.dataset.run;
        a.day = n === 0 ? 0 : n === 20 ? DAYS : Math.min(DAYS, a.day + n);
        if (a.day === DAYS && !a.seen.includes(sigOf(a))) { a.seen.push(sigOf(a)); const m = kbSim(limOf(a), DAYS); ctx.decide('Kanban: прогон месяца ' + (a.on ? `${a.a}/${a.d}/${a.t}` : 'без лимитов'), `закрыто ${m.closed}, время цикла ${num(m.ct)} дн.`); }
        save(); draw();
      });
      TR.on(el, 'input', '[data-lim]', (e, r) => { if (ctx.readonly) return; a[r.dataset.lim] = +r.value; if (a.day === DAYS && !a.seen.includes(sigOf(a))) a.day = 0; save(); draw(); });
      TR.on(el, 'click', '[data-kc]', (e, b) => { sel = +b.dataset.kc; draw(); });
      ui.onSeg(el, (n, v) => { if (n !== 'lon' || ctx.readonly) return; a.on = v === '1'; if (a.day === DAYS && !a.seen.includes(sigOf(a))) a.day = 0; save(); draw(); });
      draw();
    },
    check(ans) {
      ans = ans || {}; const seen = Array.isArray(ans.seen) ? ans.seen : [], notes = [];
      const sawOff = seen.includes('off');
      const on = !!ans.on, L = limOf(ans), m = kbSim(L, DAYS), ran = on && seen.includes(sigOf(ans));
      notes.push(sawOff ? { ok: true, html: `Месяц без лимитов прогнан: закрыто ${BASE.closed}, среднее время ${num(BASE.ct)} дн., незакрытых ${BASE.open}.` } : { ok: false, html: 'Сначала прогоните месяц без лимитов — это точка сравнения.' });
      if (!on) notes.push({ ok: false, html: 'Лимиты выключены. Включите их и подберите для каждой колонки.' });
      else {
        if (!ran) notes.push({ ok: false, html: `Настройка ${ans.a} / ${ans.d} / ${ans.t} ещё не прогнана за месяц. Нажмите «Прогнать месяц».` });
        notes.push(m.ctR < 5 ? { ok: true, html: `Среднее время цикла — ${num(m.ct)} дн.` } : { ok: false, html: `Среднее время цикла — ${num(m.ct)} дн. Где копится очередь? Хватает ли лимита, чтобы все люди в колонке были заняты, — и не слишком ли он велик, чтобы снова жонглировать?` });
        notes.push(m.closed >= BASE.closed ? { ok: true, html: `Закрыто ${m.closed} — не меньше, чем без лимитов (${BASE.closed}).` } : { ok: false, html: `Закрыто ${m.closed} — меньше, чем без лимитов (${BASE.closed}). Слишком жёсткий лимит оставляет кого-то без работы.` });
        if (L.d === 1) notes.push({ ok: 'warn', html: 'В разработке два человека, а лимит — одна заявка. Чем занят второй?' });
      }
      const ok = sawOff && on && ran && m.ctR < 5 && m.closed >= BASE.closed;
      const score = ok ? 1 : (sawOff ? 0.2 : 0) + (on ? 0.1 : 0) + (ran ? 0.1 : 0) + (on && m.ctR < 5 ? 0.3 : on ? Math.max(0, 0.3 - (m.ct - 5) * 0.1) : 0) + (on && m.closed >= BASE.closed ? 0.2 : 0);
      return { ok, score: Math.min(1, score), notes, summary: on ? `Лимиты ${ans.a} / ${ans.d} / ${ans.t}: за месяц закрыто ${m.closed}, среднее время цикла ${num(m.ct)} дн. Без лимитов: ${BASE.closed} и ${num(BASE.ct)} дн.` : 'Лимиты выключены.',
        mentor: !ok && on && m.ctR >= 5 ? (m.pile.k === 'a' ? 'Посмотрите на «Анализ»: это вы. Сколько заявок один человек может вести одновременно, не теряя время на переключения, — и что делать, пока одна ждёт ответа пекарни?' : `За месяц больше всего копится в «${m.pile.t}». Сколько людей в этой колонке — и какой у неё лимит?`) : null };
    },
    explain: (() => {
      const rows = [[0, 0, 0], [3, 4, 2], [2, 3, 2], [1, 2, 1], [2, 2, 1], [2, 2, 2], [1, 1, 1]].map(([x, y, z]) => { const r = kbSim({ a: x, d: y, t: z }, DAYS); return [x ? `${x} / ${y} / ${z}` : 'без лимитов', String(r.closed), num(r.ct) + ' дн.', String(r.open), r.pile.t]; });
      return `<p>Как ведёт себя поток за месяц при разных лимитах «Анализ / Разработка / Тестирование»:</p>
      ${ui.table(['Лимиты', 'Закрыто', 'Время цикла', 'Не закрыто', 'Где копится'], rows)}
      <ul class="checks">
        <li class="bad"><b>Без лимитов</b> узкое место — «Анализ», то есть аналитик. Он берёт каждую заявку «в работу», чтобы пекарня не ждала, переключается между десятком дел — и до разработки доходит всё меньше. Разработчики простаивают, хотя работы полно.</li>
        <li><b>Лимит около числа людей</b> (аналитику — 1–2, разработке — 2, тестированию — 1–2) даёт короткое время цикла и больше закрытых заявок. Лимит 2 у аналитика полезен: пока одна заявка ждёт ответа пекарни, он работает над второй.</li>
        <li class="warn"><b>Слишком жёсткий лимит</b> (разработке — 1 при двух разработчиках) оставляет человека без работы, и узким местом становится разработка.</li>
      </ul>
      <p>Это закон Литтла в действии: время цикла = незавершённая работа ÷ пропускная способность. Меньше начатого — быстрее каждая заявка; а убранные переключения ещё и поднимают пропускную способность. Заявки, которые ждут в очереди «Анализа», при этом видны всем: если очередь растёт, это разговор с Ниной о приоритетах, а не повод взять всё сразу.</p>
      <p class="small muted">Источники: Д. Андерсон, «Канбан. Альтернативный путь в Agile» (2010); Kanban Guide (Д. Ваканти, Дж. Коулман, 2020); Дж. Литтл (1961); Дж. Вайнберг, «Quality Software Management» — потери на переключение.</p>`;
    })(),
    refNote: 'Подходят и другие настройки — например, 1 / 2 / 1, 2 / 2 / 2, 3 / 2 / 1. Общее у них: работа не копится у аналитика, разработчики не простаивают, у Леры не больше одной-двух заявок. Заметьте: если вход в поток ограничен уже в «Анализе», дальше по доске много не накопится даже при широком лимите — поэтому лимит начинают с узкого места.',
    report: ans => { const m = kbSim(limOf(ans), DAYS); return `Лимиты: ${ans && ans.on ? `${ans.a}/${ans.d}/${ans.t}` : 'выключены'} → закрыто ${m.closed}, время цикла ${num(m.ct)} дн. (без лимитов: ${BASE.closed}, ${num(BASE.ct)} дн.)\nПрогоны: ${((ans && ans.seen) || []).join(', ') || '—'}`; }
  };

  // =====================================================================
  // Практика 2. Закон Литтла на трёх ситуациях
  // =====================================================================
  const LT = [
    { id: 's1', title: 'Колонка «Анализ»', text: 'В феврале в колонке «Анализ» в среднем 6 заявок одновременно, а аналитик закрывает в среднем 2 заявки в день.', q: 'Сколько дней в среднем заявка проводит в анализе?', unit: 'дн.', ans: 3,
      errs: [[12, 'Похоже, вы умножили. Время = незавершённая работа ÷ пропускная способность.'], [0.33, 'Формула перевёрнута: делить надо незавершённую работу на пропускную способность.']] },
    { id: 's2', title: 'Всё сопровождение', text: 'Сопровождение закрывает 10 заявок в неделю (5 рабочих дней), среднее время цикла — 4 рабочих дня.', q: 'Сколько заявок в среднем одновременно в работе?', unit: 'заявок', ans: 8,
      errs: [[40, 'Проверьте единицы: время в днях, а пропускная способность — в неделях. Сколько заявок в день?'], [2.5, 'Здесь неизвестна незавершённая работа: в работе = время × пропускная способность.'], [0.4, 'Здесь неизвестна незавершённая работа: в работе = время × пропускная способность.']] },
    { id: 's3a', title: 'Жалоба Павла', text: 'Павел: «Заявки идут в среднем 12 дней». На доске в работе в среднем 18 заявок.', q: 'Какая пропускная способность — заявок в день?', unit: 'в день', ans: 1.5,
      errs: [[216, 'Похоже, вы умножили. Пропускная способность = в работе ÷ время.'], [0.67, 'Формула перевёрнута: пропускная способность = в работе ÷ время.']] },
    { id: 's3b', title: 'Цель Нины', text: 'Нина хочет, чтобы заявки шли 6 дней при той же пропускной способности, что в ситуации выше.', q: 'Сколько заявок держать в работе одновременно?', unit: 'заявок', ans: 9,
      errs: [[3, 'Вы разделили 18 на 6. Но в работе = время × пропускная способность, а пропускная способность — из прошлой ситуации.'], [4, 'Формула перевёрнута: в работе = время × пропускная способность.'], [36, 'Пропускная способность не меняется — она 1,5 в день, а не 3 и не 6.']] }
  ];
  const LQ = { q: 'Лимит снизили с 18 до 9 заявок, но разработчик заболел, и пропускная способность упала с 1,5 до 0,75 заявки в день. Что со средним временем цикла?', seed: 'kbn-lq',
    options: [
      { t: 'Не изменится: 9 ÷ 0,75 = 12 дней — столько же, сколько было', ok: 1, why: 'Верно. Лимит помогает, только если пропускная способность не падает. Поэтому лимит подбирают, глядя на людей в колонке.' },
      { t: 'Сократится вдвое: лимит же вдвое меньше', why: 'Время зависит от двух чисел. Пропускная способность тоже упала вдвое.' },
      { t: 'Вырастет вдвое: людей меньше', why: 'Людей меньше, но и в работе вдвое меньше. Посчитайте: 9 ÷ 0,75.' },
      { t: 'Закон Литтла здесь неприменим', why: 'Применим: это средние за период. Посчитайте по формуле.' }
    ] };
  const parseNum = s => { const v = parseFloat(String(s == null ? '' : s).replace(',', '.').replace(/[^\d.\-]/g, '')); return isNaN(v) ? null : v; };
  function ltEval(ans) {
    const v = (ans && ans.v) || {};
    return LT.map(s => {
      const x = parseNum(v[s.id]);
      if (x == null) return { s, st: 'empty', pts: 0 };
      if (Math.abs(x - s.ans) <= 0.05 + 1e-9 || Math.abs(x - s.ans) / s.ans <= 0.02) return { s, st: 'ok', pts: 1, x };
      const e = s.errs.find(([w]) => Math.abs(x - w) <= 0.06 * Math.max(1, w));
      return { s, st: 'bad', pts: 0, x, hint: e ? e[1] : 'Какая из трёх величин здесь неизвестна? Запишите формулу и проверьте единицы.' };
    });
  }
  const littleTask = {
    id: 'little', title: 'Закон Литтла: посчитайте три ситуации',
    simple: howFlow.simple,
    lead: ui.brief({
      situation: 'Игорь готовит для Нины отчёт по сопровождению за февраль и просит прикинуть цифры по закону Литтла. Все данные — средние за месяц, система устойчивая: сколько заявок пришло, примерно столько и закрыли.',
      todo: [
        'Для каждой ситуации найдите неизвестную величину и впишите ответ числом (дробные — через запятую).',
        'Следите за единицами: время в рабочих днях, пропускная способность — в заявках за день.',
        'Ответьте на вопрос с подвохом внизу и нажмите «Проверить». Засчитывается, если все четыре числа верны и вопрос — тоже; допускается одна ошибка в числах.'
      ],
      lookTitle: 'Формула',
      look: 'Среднее время цикла = средняя незавершённая работа ÷ средняя пропускная способность. Из неё же: в работе = время × пропускная; пропускная = в работе ÷ время.'
    }),
    blank: () => ({ v: {}, q: [] }),
    reference: () => ({ v: Object.fromEntries(LT.map(s => [s.id, String(s.ans).replace('.', ',')])), q: quizRef([LQ]) }),
    render(el, ctx) {
      el.classList.add('kbn-root');
      const a = ctx.ans; a.v = a.v || {}; a.q = a.q || [];
      const show = !!(ctx.result || ctx.readonly);
      const ev = Object.fromEntries(ltEval(a).map(x => [x.s.id, x]));
      el.innerHTML = `<div class="stack">${LT.map((s, i) => { const r = ev[s.id]; return `<div class="kbn-calc ${show ? (r.st === 'ok' ? 'ok' : 'bad') : ''}"><span class="kbn-lbl">${i < 2 ? 'Ситуация ' + (i + 1) : 'Ситуация 3' + (i === 2 ? 'а' : 'б')} · ${s.title}</span><div>${s.text}</div><div class="kbn-inrow"><b>${s.q}</b></div><div class="kbn-inrow"><input type="text" inputmode="decimal" data-lv="${s.id}" value="${esc(a.v[s.id] || '')}" aria-label="${esc(s.q)}" ${ctx.readonly ? 'readonly' : ''}><span class="small dim">${s.unit}</span>${show && r.st === 'ok' ? chip('верно', 'ok') : ''}</div>${show && r.st === 'bad' ? `<div class="small" style="color:var(--bad)">${r.hint}</div>` : ''}${ctx.readonly ? `<div class="small muted">${s.id === 's1' ? '6 ÷ 2 = 3 дня' : s.id === 's2' ? '10 в неделю = 2 в день; 4 × 2 = 8 заявок' : s.id === 's3a' ? '18 ÷ 12 = 1,5 заявки в день' : '6 × 1,5 = 9 заявок'}</div>` : ''}</div>`; }).join('')}
        <div class="card flat" data-q></div></div>`;
      TR.on(el, 'input', '[data-lv]', (e, i) => { if (ctx.readonly) return; a.v[i.dataset.lv] = i.value; ctx.save(); });
      ui.quiz(TR.$('[data-q]', el), Object.assign({}, LQ, { value: a.q[0] || [], readonly: ctx.readonly, reveal: ctx.readonly || (ctx.result && ctx.result.ok) ? true : null, onChange: v => { a.q = [v]; ctx.save(); } }));
    },
    check(ans) {
      const ev = ltEval(ans), q = ui.quizScore(LQ, ((ans && ans.q) || [])[0] || []), notes = [];
      ev.forEach((x, i) => {
        const nm = i < 2 ? `Ситуация ${i + 1}` : `Ситуация 3${i === 2 ? 'а' : 'б'}`;
        if (x.st === 'ok') notes.push({ ok: true, html: `${nm}: верно.` });
        else if (x.st === 'empty') notes.push({ ok: false, html: `${nm}: ответа нет.` });
        else notes.push({ ok: false, html: `${nm}: ${x.hint}` });
      });
      notes.push(q.ok ? { ok: true, html: 'Вопрос с подвохом: верно.' } : { ok: false, html: 'Вопрос с подвохом: посчитайте новое время по формуле — что делим на что?' });
      const good = ev.filter(x => x.st === 'ok').length;
      const score = good / LT.length * 0.8 + q.score * 0.2;
      return { ok: good >= 3 && q.ok && score >= 0.8, score, notes, summary: `Чисел верно: ${good} из ${LT.length}; вопрос — ${q.ok ? 'верно' : 'неверно'}.` };
    },
    explain: `${ui.table(['Ситуация', 'Расчёт', 'Ответ'], [['1. «Анализ»', '6 в работе ÷ 2 в день', '3 дня'], ['2. Сопровождение', '10 в неделю = 2 в день; 4 дня × 2 в день', '8 заявок'], ['3а. Жалоба Павла', '18 в работе ÷ 12 дней', '1,5 в день'], ['3б. Цель Нины', '6 дней × 1,5 в день', '9 заявок']])}
      <p>Вывод для Нины из ситуации 3: чтобы заявки шли вдвое быстрее, не нужно нанимать людей — достаточно вдвое меньше держать начатым, если пропускная способность не упадёт. Остальные заявки ждут в очереди, но честно: их видно, и Нина решает, что брать первым.</p>
      <p>Вопрос с подвохом — главная оговорка: лимит сокращает время, только пока пропускная способность держится. Поэтому лимит подбирают по людям в колонке, а не «чем меньше, тем лучше». И закон работает на средних за долгий период: на одной заявке или одном дне он не обязан сходиться.</p>
      <p class="small muted">Источники: Дж. Литтл, «A Proof for the Queuing Formula L = λW» (1961); Kanban Guide 2020; Д. Ваканти, «Actionable Agile Metrics for Predictability» (2015).</p>`,
    report: ans => ltEval(ans).map(x => `- ${x.s.title}: ${x.x == null ? '—' : x.x} ${x.st === 'ok' ? '✓' : '✗'}`).join('\n') + `\nВопрос: ${ui.quizScore(LQ, ((ans && ans.q) || [])[0] || []).ok ? 'верно' : 'неверно'}`
  };

  // =====================================================================
  // Практика 3. Классы обслуживания: 10 заявок «Колоса»
  // =====================================================================
  const CB = [{ id: 'exp', t: 'Срочно', sub: 'берём сразу, сверх лимита' }, { id: 'date', t: 'С фиксированной датой', sub: 'начать заранее, к сроку' }, { id: 'std', t: 'Обычное', sub: 'по порядку, в лимите' }, { id: 'int', t: 'Нематериальное', sub: 'техдолг: доля ёмкости' }];
  const CI = [
    { id: 'c1', t: 'Касса на Покровке не пробивает чеки предоплаты — покупатели уходят без заказа', b: 'exp', h: 'Сколько теряем за каждый час ожидания? Есть ли обходной путь?' },
    { id: 'c2', t: 'Приложение с утра не открывается у всех покупателей', b: 'exp', h: 'Сколько теряем за каждый час ожидания? Есть ли обходной путь?' },
    { id: 'c3', t: 'Торты к 8 Марта: поднять лимит с 25 до 60 тортов в день на 6–8 марта', b: 'date', h: 'Когда эта работа станет бесполезной? Что будет, если сделать её на день позже?' },
    { id: 'c4', t: 'Рита: баннер к акции 14 февраля — акция уже объявлена во ВКонтакте', b: 'date', alt: { std: 0.5 }, h: 'Что будет с баннером 15 февраля?' },
    { id: 'c5', t: 'Платёжный шлюз отключает старую версию подключения 1 апреля — нужно перейти на новую', b: 'date', alt: { int: 0.5 }, h: 'Похоже на техдолг, но у него есть дата. Что важнее для правила обслуживания?' },
    { id: 'c6', t: 'Павел: кнопку «Выдано» сделать крупнее — в перчатках промахиваются', b: 'std', alt: { exp: 0 }, h: 'Неудобно, но работает. Сколько стоит неделя ожидания — и есть ли обходной путь?' },
    { id: 'c7', t: 'Сводка в 1С пришла с ошибкой по одной пекарне — Олег Петрович поправил руками и очень просит починить', b: 'std', alt: { exp: 0.25 }, h: 'Громко — не значит срочно. Есть ли обходной путь и сколько стоит день ожидания?' },
    { id: 'c8', t: 'Рита: поменять текст SMS «заказ готов»', b: 'std', h: 'Есть ли дата, после которой это бесполезно? Сколько стоит неделя ожидания?' },
    { id: 'c9', t: 'Переписать запутанный расчёт интервалов — каждая правка в нём занимает вдвое дольше', b: 'int', alt: { std: 0.5 }, h: 'Заметит ли это покупатель? Когда задержка начнёт стоить дорого?' },
    { id: 'c10', t: 'Добавить автотесты на правило «заказ на завтра до 22:30»', b: 'int', alt: { std: 0.5 }, h: 'Заметит ли это покупатель сегодня? Что будет через полгода без тестов?' }
  ];
  const CQ = { q: 'Касса на Покровке не пробивает чеки, а в «Разработке» лимит уже занят тремя обычными заявками. Что делаете?', seed: 'kbn-cq',
    options: [
      { t: 'Берём сразу на срочную дорожку, даже сверх лимита: так записано в правилах для «срочно». Одновременно — не больше одной срочной', ok: 1, why: 'Верно. Срочный класс — явное правило: разрешено превысить лимит, но срочных не может быть много.' },
      { t: 'Ставим в очередь — лимит есть лимит', why: 'Лимит защищает поток от многозадачности, но срочный класс — записанное исключение. Каждый час без чеков стоит денег.' },
      { t: 'Снимаем лимиты со всех колонок, пока горит', why: 'Снимать лимиты целиком — вернуться к хаосу. Исключение делают для одной срочной заявки.' },
      { t: 'Ждём следующего планирования', why: 'Это логика спринта, а у сопровождения поток: срочное берут сразу.' }
    ] };
  function clEval(v) {
    v = v || {};
    return CI.map(it => { const got = v[it.id]; if (got === it.b) return { it, s: 'ok', pts: 1 }; if (got && it.alt && it.alt[got]) return { it, s: 'warn', pts: it.alt[got] }; return { it, s: 'bad', pts: 0, empty: !got }; });
  }
  const classesTask = {
    id: 'classes', title: 'Классы обслуживания: 10 заявок',
    simple: howClasses.simple,
    lead: ui.brief({
      situation: 'Начало февраля. Во входящих — десять заявок от пекарен, Риты, Олега Петровича и команды. Павел просит: «Сделайте, чтобы срочное не ждало, а остальное не терялось». Нина согласовала четыре класса обслуживания — теперь их надо назначить.',
      todo: [
        'Разложите 10 заявок по четырём классам: нажмите карточку, потом корзину.',
        'Для каждой спросите: сколько стоит день ожидания? Есть ли дата, после которой работа бесполезна? Есть ли обходной путь?',
        'Ответьте на вопрос о правиле срочного класса и нажмите «Проверить». Засчитывается от 80 % и при верном ответе на вопрос.'
      ],
      lookTitle: 'Подсказка',
      look: 'Класс выбирают по стоимости задержки, а не по тому, кто громче просит. Техническая работа с жёсткой датой — уже не «нематериальное».'
    }),
    blank: () => ({ v: {}, q: [] }),
    reference: () => ({ v: Object.fromEntries(CI.map(x => [x.id, x.b])), q: quizRef([CQ]) }),
    render(el, ctx) {
      el.classList.add('kbn-root');
      const a = ctx.ans; a.v = a.v || {}; a.q = a.q || [];
      let reveal = null;
      if (ctx.result || ctx.readonly) { reveal = {}; clEval(a.v).forEach(x => { reveal[x.it.id] = x.s; }); }
      const d = document.createElement('div'); el.appendChild(d);
      ui.sort(d, { items: CI.map(x => ({ id: x.id, t: x.t })), buckets: CB, value: a.v, reveal, readonly: ctx.readonly, seed: 'kbn-cls', onChange: v => { a.v = v; ctx.save(); } });
      const q = document.createElement('div'); q.className = 'card flat'; q.style.marginTop = '12px'; el.appendChild(q);
      ui.quiz(q, Object.assign({}, CQ, { value: a.q[0] || [], readonly: ctx.readonly, reveal: ctx.readonly || (ctx.result && ctx.result.ok) ? true : null, onChange: v => { a.q = [v]; ctx.save(); } }));
    },
    check(ans) {
      const ev = clEval(ans && ans.v), q = ui.quizScore(CQ, ((ans && ans.q) || [])[0] || []), notes = [];
      ev.forEach(x => {
        if (x.s === 'warn') notes.push({ ok: 'warn', html: `«${esc(x.it.t)}» — близко, засчитано частично. ${x.it.h}` });
        if (x.s === 'bad') notes.push({ ok: false, html: `«${esc(x.it.t)}» — ${x.empty ? 'не разложено. ' : ''}${x.it.h}` });
      });
      if (!notes.length) notes.push({ ok: true, html: 'Все десять заявок — в своих классах.' });
      notes.push(q.ok ? { ok: true, html: 'Правило срочного класса: верно.' } : { ok: false, html: 'Правило срочного класса: что записано для «срочно» — и сколько срочных может быть одновременно?' });
      const s = ev.reduce((t, x) => t + x.pts, 0) / CI.length, score = s * 0.8 + q.score * 0.2;
      const loud = ev.find(x => x.it.id === 'c7' && (ans.v || {}).c7 === 'exp');
      return { ok: s >= 0.8 && q.ok, score, notes, summary: `Точно: ${ev.filter(x => x.s === 'ok').length} из ${CI.length}; вопрос — ${q.ok ? 'верно' : 'неверно'}.`, mentor: loud ? 'Олег Петрович просит очень настойчиво — но сводку он уже поправил руками. Если всё громкое станет срочным, срочная дорожка забьётся, и настоящий пожар с кассой будет ждать.' : null };
    },
    explain: `${ui.table(['Класс', 'Заявки', 'Почему'], [['Срочно', 'касса не пробивает чеки; приложение не открывается', 'каждый час — потерянные покупатели и выручка, обходного пути нет'], ['С датой', 'торты к 8 Марта; баннер к 14 февраля; переход шлюза к 1 апреля', 'после даты работа бесполезна или всё ломается; начинают заранее — дата минус время цикла'], ['Обычное', 'кнопка «Выдано»; ошибка в сводке 1С с обходным путём; текст SMS', 'задержка стоит понемногу, берут по порядку, который определила Нина'], ['Нематериальное', 'переписать расчёт интервалов; автотесты на 22:30', 'сегодня никто не заметит, но без них каждое следующее изменение дороже; держат долю ёмкости']])}
      <p>Две ловушки. <b>Громкость</b>: Олег Петрович просит настойчиво, но обходной путь есть — это обычная заявка. <b>Техдолг с датой</b>: переход платёжного шлюза — техническая работа, но 1 апреля старое подключение перестанет работать, поэтому класс — «с датой».</p>
      <p>Правило срочного класса — исключение, записанное заранее: брать сразу, можно сверх лимита, но не больше одной срочной одновременно. Иначе «срочно» становится всё, и класс теряет смысл. Где практики спорят: многие команды обходятся без классов вовсе (в Kanban Guide 2020 их нет) и управляют сроками через ожидание по сроку.</p>
      <p class="small muted">Источники: Д. Андерсон, «Канбан» (2010) — классы обслуживания; Д. Рейнертсен, «The Principles of Product Development Flow» (2009) — стоимость задержки.</p>`,
    report: ans => clEval(ans && ans.v).map(x => `- ${x.it.t} → ${(CB.find(b => b.id === ((ans && ans.v) || {})[x.it.id]) || { t: '—' }).t} ${x.s === 'ok' ? '✓' : x.s === 'warn' ? '≈' : '✗'}`).join('\n')
  };

  // =====================================================================
  // Практика 4. Явные правила колонки «Анализ» (мини-редактор)
  // =====================================================================
  const RF = [
    { id: 'what', t: 'что не так или что нужно — и кому', re: /(что (именно )?(не так|сломал|нужно|случил|хотят)|проблем|симптом|кто (написал|просит|заявил)|заявител|для кого|зачем|пекарн|пользовател)/, hint: 'Из правил не видно, что должно быть понятно о самой заявке: что случилось или что нужно, от кого и зачем.' },
    { id: 'repro', t: 'для ошибки: где и как повторить', re: /(шаг|воспроизв|повтор|скриншот|снимок экрана|на какой касс|когда случ|при каких|где случ)/, hint: 'Для ошибки разработчику нужно её повторить. Что для этого должно быть в заявке?' },
    { id: 'accept', t: 'критерии приёмки: как проверить', re: /(критери|ожидаем|как провер|приёмк|приемк|дано|тогда|проверит|результат)/, hint: 'По чему Лера поймёт, что заявка сделана?' },
    { id: 'class', t: 'класс обслуживания и срок', re: /(класс|срочн|дат[аыеу]|срок|приоритет|дедлайн|к \d+ (марта|февраля|апреля))/, hint: 'Как разработчики поймут, брать заявку сразу, к дате или по порядку?' },
    { id: 'impact', t: 'влияние: касса, 1С, правила', re: /(влия|затраг|касс|1с|1c|54|чек|правил[оа]? (22|48|30)|интеграц|зависим|что ещё сломается|последств)/, hint: 'Что ещё может задеть правка: чеки, сводку в 1С, правила 22:30 и 30 минут?' },
    { id: 'agreed', t: 'согласовано с заявителем или владельцем', re: /(соглас|подтвер|павел|павл|нин[аеойу]|галин|владел|заказчик|олег)/, hint: 'Кто подтвердил, что сделать нужно именно так?' },
    { id: 'size', t: 'размер: небольшая или разрезана', re: /(\d+\s*(дн|дня|день|час)|разрез|разби|размер|оцен|небольш|мелк)/, hint: 'Что делать с заявкой, которая тянет на две недели работы?' }
  ];
  const RTRAP = /(всё понятно|все понятно|по возможности|как можно (скорее|быстрее)|быстро|удобно|если надо|и т\.?\s?д|когда будет время|аналитик решает сам|на усмотрение)/i;
  function rlEval(txt) {
    const t = String(txt || ''), low = t.toLowerCase();
    const lines = t.split(/\n/).map(x => x.trim()).filter(x => x.length >= 8);
    const f = Object.fromEntries(RF.map(r => [r.id, r.re.test(low)]));
    const n = Object.values(f).filter(Boolean).length;
    const trap = RTRAP.test(low);
    const wip = /(не больше \d|лимит|wip|одновременно)/.test(low);
    const score = Math.max(0, n / RF.length - (trap ? 0.15 : 0) - (lines.length < 4 && n ? 0.1 : 0));
    return { f, n, lines: lines.length, trap, wip, score, empty: !t.trim(), ok: n >= 5 && lines.length >= 4 && !trap && score >= 0.7 };
  }
  const RL_REF = 'Заявка уходит из «Анализа» в «Разработку», когда:\n1. Понятно, что не так или что нужно, кто написал и зачем это пекарне.\n2. Для ошибки есть шаги воспроизведения: где, когда, на какой кассе, скриншот.\n3. Записаны критерии приёмки — как Лера проверит результат (Дано / Когда / Тогда).\n4. Определён класс обслуживания и срок, если он есть.\n5. Проверено влияние: чеки по 54-ФЗ, сводка в 1С, правила 22:30, 30 минут, 48 часов.\n6. Решение подтверждено с заявителем (Павел, Галина Ивановна) или с Ниной, если меняется правило.\n7. Работы не больше 3 дней — иначе заявка разрезана на части.\nИ ещё: в «Анализе» в работе одновременно не больше 2 заявок.';
  function rlLive(ev) {
    const miss = RF.find(r => !ev.f[r.id]);
    const say = ev.empty ? ['dima', 'Жду правила. Каждое — отдельной строкой: «заявка уходит в разработку, когда…»'] : ev.trap ? ['lera', 'Слова вроде «быстро», «удобно», «по возможности» я не проверю. Что именно должно быть в заявке?'] : miss ? [miss.id === 'accept' || miss.id === 'repro' ? 'lera' : 'dima', miss.hint] : ev.lines < 4 ? ['dima', 'Разбейте на пункты, по одному правилу в строке, — так их проще сверять у доски.'] : ['dima', 'С такими правилами я не переспрашиваю, а Лера знает, что проверять. Вешаем под колонку.'];
    return `<div class="kbn-feats">${RF.map(r => chip((ev.f[r.id] ? '✓ ' : '✕ ') + r.t, ev.f[r.id] ? 'ok' : ev.empty ? '' : 'bad')).join('')}${ev.wip ? chip('+ лимит колонки', 'info') : ''}</div>${ui.say(say[0], esc(say[1]))}`;
  }
  const rulesTask = {
    id: 'rules', title: 'Явные правила колонки «Анализ»',
    simple: {
      icon: '📋',
      plain: 'Явное правило колонки — записанное «когда можно передавать дальше». Это Definition of Done, только не для всей работы, а для одного шага.',
      analogy: 'Под полкой «остывает» в цеху висит листок: «на витрину — не раньше 20 минут, корка не мягкая, ценник наклеен». Новичок не спрашивает, опытный не спорит.',
      tech: 'Явные правила (explicit policies) — одна из шести практик Kanban по Андерсону; в Kanban Guide 2020 они входят в «определение рабочего процесса». Хорошее правило проверяемо и короткое; его пересматривают на разборе потока.'
    },
    lead: ui.brief({
      situation: 'Вторая неделя сопровождения. Дима недоволен: «Из «Анализа» заявки приходят как есть: «касса глючит, Павел». Я полдня выясняю, что сломалось, а Лера не знает, что проверять». Ксения предлагает записать правила колонки «Анализ» — когда заявка готова уйти в разработку — и повесить их под колонкой.',
      todo: [
        'Напишите правила колонки «Анализ»: по одному в строке, начиная с «Заявка уходит в «Разработку», когда…» (от 4 строк).',
        'Под полем — признаки, которые проверяет редактор, и реплика Димы или Леры. Добивайтесь хотя бы пяти зелёных из семи.',
        'Нажмите «Проверить». Засчитывается при пяти признаках из семи, от четырёх строк и без размытых слов вроде «быстро» и «по возможности».'
      ],
      look: 'Редактор ищет признаки по словам, а не понимает смысл: перечитайте правила глазами Димы и Леры. Можно добавить и лимит колонки — это плюс, но не обязательно.'
    }),
    blank: () => ({ text: '' }),
    reference: () => ({ text: RL_REF }),
    render(el, ctx) {
      el.classList.add('kbn-root');
      const a = ctx.ans; a.text = a.text || '';
      el.innerHTML = `<div class="stack">${ui.say('dima', 'Вот что пришло сегодня из «Анализа»: «Касса глючит. Павел». Что глючит? На какой кассе? Как я пойму, что починил?')}
        <label class="field"><span>Правила колонки «Анализ»</span><textarea rows="9" data-rl placeholder="Заявка уходит в «Разработку», когда:&#10;1. …&#10;2. …" ${ctx.readonly ? 'readonly' : ''}>${esc(a.text)}</textarea></label>
        <div data-rlive></div></div>`;
      const paint = () => { TR.$('[data-rlive]', el).innerHTML = rlLive(rlEval(a.text)); };
      paint();
      if (!ctx.readonly) TR.on(el, 'input', '[data-rl]', (e, t) => { a.text = t.value; ctx.save(); paint(); });
    },
    check(ans) {
      const ev = rlEval(ans && ans.text), notes = [];
      if (ev.empty) return { ok: false, score: 0, summary: 'Правила не написаны.', notes: [{ ok: false, html: 'Напишите правила — по одному в строке.' }] };
      RF.forEach(r => notes.push(ev.f[r.id] ? { ok: true, html: r.t } : { ok: false, html: r.hint }));
      if (ev.lines < 4) notes.push({ ok: 'warn', html: 'Правил меньше четырёх строк. Разбейте на пункты — так их сверяют у доски.' });
      if (ev.trap) notes.push({ ok: false, html: 'Есть размытые слова («быстро», «удобно», «по возможности», «всё понятно»). Как их проверить у доски?' });
      if (ev.wip) notes.push({ ok: true, html: 'Плюс: в правилах есть лимит колонки.' });
      return { ok: ev.ok, score: Math.min(1, ev.score + (ev.wip ? 0.05 : 0)), notes, summary: `Признаков: ${ev.n} из ${RF.length}, строк: ${ev.lines}.` };
    },
    explain: `${ui.code(RL_REF, 'text', 'Эталон: правила колонки «Анализ»')}
      <p>Каждое правило отвечает на вопрос того, кто стоит правее на доске: Диме — что сломалось и как повторить, Лере — как проверить, обоим — срочно ли и что ещё заденет правка. Пункт про согласование защищает от переделок: заявитель и владелец продукта подтвердили, что нужно именно это.</p>
      <p>Правила колонки — не бюрократия: их немного, они проверяемы и висят на доске. Если правило мешает потоку (например, «согласовать с Ниной» тормозит каждую мелочь), его меняют на разборе потока — так и выглядит практика «улучшать вместе».</p>
      <p>Где спорят: делать ли правила колонок чек-листом или полагаться на разговор (три амиго). Чек-лист не заменяет разговора, но не даёт забыть главное, когда заявок двадцать в день.</p>
      <p class="small muted">Источники: Д. Андерсон, «Канбан» (2010) — явные правила; Kanban Guide 2020 — определение рабочего процесса; PRACTICES.md — Definition of Ready.</p>`,
    report: ans => (ans && ans.text) || '—'
  };

  // =====================================================================
  // Практика 5. Ответ своими словами: почему сопровождению Kanban, а MVP — Scrum
  // =====================================================================
  const WY_RUBRIC = [
    'Разная работа: MVP — новый продукт с целью продукта и сроком, объём уточняется, нужны цель на две недели и показ Нине; сопровождение — поток заявок разного размера и срочности, без конца',
    'Срочное не может ждать спринта: касса не пробивает чеки — чинить за часы; в Kanban есть класс «срочно» и задачу берут сразу',
    'Kanban даёт предсказуемость через лимиты и метрики: время цикла, пропускная способность; лимиты не дают заявкам висеть, а аналитику — брать всё сразу',
    'Что Нина сохраняет: регулярный обзор раз в две недели (что закрыто, сколько дней в среднем), её приоритеты в очереди, ретроспективы — по сути Scrumban',
    'Честно: это не догма — сопровождение можно вести спринтами, но цена — ожидание срочного или постоянно сломанная цель спринта; разработку тортов до 1 марта продолжают в спринтах'
  ];
  const WY_REF = 'Нина Сергеевна, мы не перестали работать регулярно — просто работа стала другой. Приложение до пилота — это новый продукт: была цель к 1 марта, объём уточнялся, и каждые две недели вы смотрели результат и решали, что дальше. Для этого спринты удобны. Сопровождение — это поток: каждый день одна-две заявки от Павла, Галины Ивановны, Олега Петровича, и они разные — от текста SMS до кассы, которая не пробивает чеки. Если касса сломалась утром, ждать до следующего спринта нельзя: в Kanban такая заявка идёт по срочной дорожке и её берут сразу. Остальное идёт по порядку, который определяете вы, а лимиты не дают нам хвататься за всё сразу и ничего не доводить. Вместо обещаний «в спринте» вы видите цифры: в среднем заявка идёт четыре дня, за две недели закрыли столько-то. Показы мы сохраняем — раз в две недели обзор: что закрыли, что висит, что брать первым. Торты к 1 марта команда Димы продолжает делать спринтами. Это не догма: можно и сопровождение вести спринтами, но тогда срочное либо ждёт, либо ломает план каждый день.';
  const whyTask = {
    id: 'why', title: 'Своими словами: почему сопровождению Kanban',
    simple: {
      icon: '⚖️',
      plain: 'Подход выбирают под работу: продукт с целью и сроком — короткие циклы с показами; поток разных заявок — доска с лимитами и правилами срочности.',
      analogy: 'Новое меню к открытию готовят по плану недели и дегустируют. А заказы гостей в обед никто не планирует на две недели вперёд — их берут по мере поступления, и сгоревшую духовку чинят сразу.',
      tech: 'Аргументы: характер работы (продукт с целью vs поток), стоимость задержки и класс «срочно», лимиты WIP и метрики потока, сохранённые каденции обзора и ретроспективы (Scrumban), честность о компромиссах.'
    },
    lead: ui.brief({
      situation: 'Нина Сергеевна пишет Игорю: «Почему после пилота вы перестали работать спринтами? Мне нравились показы раз в две недели. Это вы расслабились?» Игорь просит вас подготовить ответ — коротко и понятно, без слов «WIP» и «пропускная способность».',
      todo: [
        'Напишите 6–10 предложений (от 300 символов): почему для сопровождения Kanban, а для разработки MVP — Scrum, и что Нина при этом сохраняет.',
        'Опирайтесь на «Колос»: срочные поломки кассы, поток заявок из пекарен, торты к 1 марта.',
        'Нажмите «Проверить с Ксенией (Claude)», если доступно, или «Сверить с эталоном самому». Засчитывается от 60 %.'
      ],
      lookTitle: 'На что опереться',
      look: 'Лаборатория потока (что бывает без лимитов), классы обслуживания (касса — срочно), закон Литтла (время заявки — в цифрах), вкладка «Что ломается». Нина не любит жаргон: «лимит» можно объяснить как «не хватаемся за всё сразу».'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: WY_REF, self: WY_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('kbn-root');
      el.insertAdjacentHTML('beforeend', ui.say('nina', 'Почему после пилота вы перестали работать спринтами? Мне нравились показы раз в две недели. Это вы расслабились?'));
      const j = document.createElement('div'); j.style.marginTop = '12px'; el.appendChild(j);
      ui.justify(j, {
        id: 'kbn-why', q: 'Почему сопровождению — Kanban, а разработке MVP — Scrum?',
        qPlain: 'Объясните владелице сети пекарен без жаргона, почему после пилота сопровождение ведут по Kanban, а разработку первой версии вели и ведут спринтами (Scrum); что она при этом сохраняет; где это не догма.',
        rubric: WY_RUBRIC, reference: WY_REF, value: ctx.ans.j, readonly: ctx.readonly, minLen: 300,
        placeholder: 'Нина Сергеевна, работа стала другой: … Если касса сломалась утром, … Вы по-прежнему видите … Торты к 1 марта …',
        onChange: v => { ctx.ans.j = v; ctx.save(); ctx.decide('Почему сопровождению Kanban — ответ Нине', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j);
      return {
        ok: s >= 0.6, score: s,
        summary: s ? `Оценка ответа: ${Math.round(s * 100)} %.` : 'Напишите ответ (от 300 символов) и проверьте его с Ксенией или сверьте с эталоном сами.',
        notes: s && s < 0.6 ? [{ ok: false, html: 'Нине важно услышать: работа стала другой (поток, а не продукт), срочное не может ждать спринта, она по-прежнему видит результат и решает, что первым, — и что торты продолжают делать спринтами.' }] : []
      };
    },
    explain: `<p>Сильный ответ начинает не с названий методов, а с работы: продукт с целью и сроком против потока разных заявок. Дальше — то, что Нина почувствует: касса чинится сразу, остальное идёт в её порядке, а вместо «сделаем в спринте» — честные цифры: сколько дней в среднем идёт заявка.</p>
      <p>Важно снять её страх «расслабились»: показы раз в две недели остаются — это обзор потока; ретроспективы тоже. По сути это Scrumban: каденции из Scrum, поток и лимиты из Kanban. И честная оговорка: сопровождение можно вести и спринтами — многие команды так делают, — но тогда приходится держать запас под срочное и мириться с тем, что цель спринта постоянно ломается.</p>
      <p class="small muted">Источники: DOMAIN — договор «Колоса»: спринты по 2 недели на разработку, после пилота — сопровождение по Kanban; Kanban Guide 2020; Scrum Guide 2020; К. Ладас, «Scrumban» (2008).</p>`,
    report: ans => (ans && ans.j && ans.j.text) ? ans.j.text : '—'
  };

  // =====================================================================
  TR.stage({
    id: 'kanban', act: 5, order: 420, slot: 'Вт 10:00', title: 'Kanban и поток',
    when: 'вторник, 10:00 · перенесёмся в февраль: пилот в двух пекарнях запущен',
    intro: [
      { who: 'igor', html: 'Пилот в двух пекарнях работает с 1 февраля. Команда Димы доделывает торты к 1 марта, а заявки с пилота уже сыплются: Павел, Галина Ивановна, Олег Петрович — по одной-две в день.' },
      { who: 'pavel', html: 'Утром касса не пробила чек предоплаты. Мне что, ждать две недели до вашего спринта?' },
      { who: 'ksenia', html: 'Не надо ждать. По договору после пилота сопровождение идёт по Kanban. Сегодня — доска, лимиты незавершённой работы, поток и закон Литтла. Главное — прогоним месяц заявок в симуляторе и найдём, где они застревают. Подсказка: у нас с вами.' }
    ],
    facts: ['F-54fz', 'F-1c', 'F-net', 'F-cakecap'],
    glossary: [
      { term: 'Kanban-доска', simple: 'Полки в цеху: «заказано → в печи → остывает → на витрине» — видно, где каждый противень.', tech: 'Визуализация рабочего процесса: колонки — шаги, карточки — элементы работы. Колонку часто делят на «очередь» и «в работе», чтобы видеть ожидание.' },
      { term: 'Лимит WIP', simple: 'В печь влезает 6 противней — седьмой ждёт, пока освободится место.', tech: 'Ограничение незавершённой работы (work in progress) на колонку или процесс. Новое берут, когда закончили начатое; сокращает переключения и время цикла.' },
      { term: 'Время цикла', simple: 'Сколько заказ идёт от «начали» до «готово».', tech: 'Cycle time — время от начала работы над элементом до его завершения (Kanban Guide 2020). Где начинать и заканчивать отсчёт, команда записывает в явных правилах.' },
      { term: 'Пропускная способность', simple: 'Сколько тортов цех отдаёт за день.', tech: 'Throughput — число элементов, завершённых за единицу времени: «12 заявок в неделю».' },
      { term: 'Закон Литтла', simple: '12 человек в очереди, кассир обслуживает одного в минуту — каждый стоит около 12 минут.', tech: 'Среднее время прохождения = средняя незавершённая работа ÷ средняя пропускная способность (Дж. Литтл, 1961). Работает для средних за долгий период в устойчивой системе.' },
      { term: 'Возраст заявки', simple: 'Сколько уже лежит начатый заказ — если дольше обычного, его пора спасать.', tech: 'Work item age — время с начала работы над незавершённым элементом. Предупреждает о застревании раньше, чем время цикла.' },
      { term: 'Класс обслуживания', simple: 'Сломалась печь — бросают всё; торты к празднику — заранее; новый маффин — по очереди.', tech: 'Правило обработки заявки по стоимости задержки (Д. Андерсон): срочно, с фиксированной датой, обычное, нематериальное.' },
      { term: 'Явные правила', simple: 'Листок под полкой: «на витрину — не раньше 20 минут остывания».', tech: 'Explicit policies — записанные правила процесса: когда элемент можно взять, когда передать дальше, как обращаться с классами обслуживания.' },
      { term: 'Узкое место', simple: 'Одна печь на весь цех: сколько ни замешивай теста, больше не испечёшь.', tech: 'Шаг процесса с наименьшей пропускной способностью; перед ним копится очередь. Ускорять имеет смысл прежде всего его.' },
      { term: 'Scrumban', simple: 'Двухнедельные дегустации остались, а заказы берут по мере поступления.', tech: 'Смесь Scrum и Kanban (К. Ладас, 2008): каденции обзора и ретроспективы из Scrum, поток, лимиты WIP и метрики из Kanban.' }
    ],
    outro: 'Kanban — не про стикеры, а про поток: работа видна, начатого немного, правила записаны, время цикла измерено, процесс улучшают по цифрам. Закон Литтла объясняет, почему «взять всё сразу» замедляет всех, — и в нашей лаборатории узким местом без лимитов оказался аналитик. Для потока заявок сопровождения — Kanban с классами обслуживания, для продукта с целью и показами — Scrum; когда нужно и то и другое — Scrumban. Дальше — как передавать задачу разработчикам и дизайнеру, чтобы она не возвращалась с вопросами.',
    tasks: [howBoard, howFlow, howClasses, labTask, littleTask, classesTask, rulesTask, whyTask]
  });
})();
