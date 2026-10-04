/* Неделя 2, понедельник 10:00: потребность и решение.
   Теория: что такое требование (заказ торта; простыми словами, BABOK v3, IEEE 610.12; игра «требование или ещё нет?»);
   проблема → потребность → требование → решение («сверло и отверстие», лестница «Зачем? / Как?», переключатель «говорит / нужно»);
   уровни Вигерса и классы BABOK на соседнем примере (библиотека: продление книг онлайн).
   Практика: разметить письмо-«ТЗ» Нины (DOMAIN §6), лаборатория «докопайтесь до потребности» за кнопкой и Excel,
   разложить требования «Колоса» по уровням и сопоставить Вигерса с BABOK, ответ Нине своими словами. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'req-what';

  if (!document.getElementById('rqw-css')) document.head.insertAdjacentHTML('beforeend', `<style id="rqw-css">
    .rqw-root, .rqw-root .stack > * { min-width: 0; }
    .rqw-root .seg button { white-space: normal; text-align: left; }
    .rqw-hl { background: var(--accent-soft); color: var(--text); border-radius: 4px; padding: 0 3px; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
    .rqw-defx { font-size: 15px; line-height: 1.6; }
    .rqw-ol { margin: 0; padding-left: 20px; display: grid; gap: 4px; }
    .rqw-cake { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px; }
    .rqw-part { text-align: left; border: 1px solid var(--border-strong); border-radius: 10px; padding: 8px 10px; background: var(--surface-2); display: grid; gap: 2px; min-width: 0; color: var(--text); font-size: 14px; line-height: 1.35; align-content: start; }
    .rqw-part .k { font: 600 10.5px/1.2 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .rqw-part[aria-pressed="true"] { border-color: var(--ok); background: var(--ok-soft); }
    .rqw-part[aria-pressed="true"] .k { color: var(--ok); }
    .rqw-part[aria-pressed="false"] > span:nth-child(2) { text-decoration: line-through; color: var(--text-muted); }
    .rqw-part.how { border-style: dashed; }
    .rqw-part.how[aria-pressed="false"] > span:nth-child(2) { text-decoration: none; }
    .rqw-part.how[aria-pressed="true"] { border-color: var(--violet); background: var(--violet-soft); }
    .rqw-part.how[aria-pressed="true"] .k { color: var(--violet); }
    .rqw-game { display: grid; gap: 8px; }
    .rqw-gq { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 6px 12px; align-items: center; padding: 8px 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); }
    .rqw-gq.ok { border-color: var(--ok); } .rqw-gq.bad { border-color: var(--bad); }
    .rqw-gq .why { grid-column: 1 / -1; font-size: 13px; color: var(--text-2); }
    .rqw-gq .row { gap: 4px; }
    .rqw-drill { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 14px; align-items: start; }
    .rqw-drill > * { min-width: 0; }
    .rqw-ladder { display: grid; gap: 6px; }
    .rqw-rung { display: grid; grid-template-columns: 130px minmax(0, 1fr); gap: 10px; align-items: center; padding: 8px 12px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface); font-size: 14px; line-height: 1.35; transition: background .2s, border-color .2s, opacity .2s; }
    .rqw-rung .lv { font: 600 10.5px/1.25 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .rqw-rung.on { border-color: var(--accent); background: var(--accent-soft); }
    .rqw-rung.on .lv { color: var(--accent); }
    .rqw-rung.off { opacity: .5; border-style: dashed; }
    .rqw-talk { display: grid; gap: 4px; padding: 10px 12px; border-radius: 10px; background: var(--surface-2); border: 1px solid var(--border); font-size: 14px; }
    .rqw-opts { display: flex; flex-wrap: wrap; gap: 5px; }
    .rqw-opts .chip { white-space: normal; text-align: left; }
    .rqw-says { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 10px; }
    .rqw-sc { border: 1px solid var(--border); border-radius: 12px; padding: 12px 14px; background: var(--surface); display: grid; gap: 8px; align-content: start; min-width: 0; }
    .rqw-sc.need { border-color: color-mix(in srgb, var(--ok) 50%, var(--border)); background: var(--ok-soft); }
    .rqw-sc .who { font: 600 10.5px/1.2 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .rqw-sc .sd { font: 600 16px/1.35 var(--f-brand); }
    .rqw-sc .nd { font-size: 14px; }
    .rqw-sc .chip, .rqw-sc .btn { justify-self: start; }
    .rqw-lv { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr); gap: 14px; align-items: start; }
    .rqw-lv > * { min-width: 0; }
    .rqw-steps { display: grid; gap: 4px; }
    .rqw-step { border: 1px solid var(--border); border-radius: 12px; padding: 10px 12px; background: var(--surface); display: grid; gap: 6px; transition: opacity .2s, border-color .2s; }
    .rqw-step.on { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent) inset; }
    .rqw-step.off { opacity: .45; border-style: dashed; }
    .rqw-step ul { margin: 0; padding-left: 18px; display: grid; gap: 3px; font-size: 13.5px; }
    .rqw-arr { font: 600 13px/1 var(--f-mono); color: var(--text-muted); text-align: center; }
    .rqw-sidec { display: grid; gap: 6px; }
    .rqw-sd { border: 1px solid var(--border); border-left: 3px solid var(--violet); border-radius: 10px; padding: 8px 10px; background: var(--surface); display: grid; gap: 3px; font-size: 13.5px; line-height: 1.35; }
    .rqw-sd .k { font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .06em; text-transform: uppercase; color: var(--violet); }
    .rqw-sd.grey { border-left-color: var(--border-strong); opacity: .7; }
    .rqw-sd.grey .k { color: var(--text-muted); text-transform: none; letter-spacing: 0; font-family: var(--f-body); font-size: 12px; }
    .rqw-sd.new { border-left-color: var(--ok); background: var(--ok-soft); }
    .rqw-sd.new .k { color: var(--ok); }
    .rqw-ghost { border: 1px dashed var(--border-strong); border-radius: 10px; padding: 12px; }
    .rqw-def { display: grid; grid-template-columns: 150px minmax(0, 1fr); gap: 6px 14px; font-size: 14px; }
    .rqw-def > .k { font: 600 11px/1.5 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); padding-top: 2px; }
    .rqw-def > .v { min-width: 0; }
    .rqw-pal { display: flex; flex-wrap: wrap; gap: 6px; }
    .rqw-pen { display: inline-flex; align-items: center; gap: 7px; border: 1px solid var(--border-strong); background: var(--surface); border-radius: 9px; padding: 6px 10px; font-size: 13px; font-weight: 500; color: var(--text); text-align: left; }
    .rqw-pen i { width: 12px; height: 12px; border-radius: 3px; flex: none; }
    .rqw-pen[aria-pressed="true"] { box-shadow: 0 0 0 2px var(--accent); border-color: var(--accent); }
    .rqw-pen small { color: var(--text-muted); font-size: 11.5px; display: block; line-height: 1.2; }
    .rqw-mail { border: 1px solid var(--border-strong); border-radius: 12px; background: var(--surface); padding: 14px 16px; font-size: 15px; line-height: 2; }
    .rqw-mail .hd { line-height: 1.4; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-bottom: 6px; }
    .rqw-mail ol { margin: 4px 0; padding-left: 24px; }
    .rqw-frag { cursor: pointer; border-radius: 5px; padding: 2px 3px; border-bottom: 2px dashed var(--border-strong); box-decoration-break: clone; -webkit-box-decoration-break: clone; }
    .rqw-frag:hover { background: var(--surface-3); }
    .rqw-frag:focus-visible { outline: 2px solid var(--accent); }
    .rqw-frag sup.tg { font: 700 9.5px/1 var(--f-mono); letter-spacing: .04em; margin-left: 3px; text-transform: uppercase; }
    .rqw-frag[data-tag="sol"] { background: color-mix(in srgb, var(--violet) 20%, transparent); border-bottom: 2px solid var(--violet); } .rqw-frag[data-tag="sol"] sup.tg { color: var(--violet); }
    .rqw-frag[data-tag="need"] { background: color-mix(in srgb, var(--ok) 20%, transparent); border-bottom: 2px solid var(--ok); } .rqw-frag[data-tag="need"] sup.tg { color: var(--ok); }
    .rqw-frag[data-tag="goal"] { background: color-mix(in srgb, var(--info) 20%, transparent); border-bottom: 2px solid var(--info); } .rqw-frag[data-tag="goal"] sup.tg { color: var(--info); }
    .rqw-frag[data-tag="wish"] { background: color-mix(in srgb, var(--warn) 22%, transparent); border-bottom: 2px solid var(--warn); } .rqw-frag[data-tag="wish"] sup.tg { color: var(--warn); }
    .rqw-frag[data-tag="limit"] { background: color-mix(in srgb, var(--pink) 20%, transparent); border-bottom: 2px solid var(--pink); } .rqw-frag[data-tag="limit"] sup.tg { color: var(--pink); }
    .rqw-mk { font: 700 12px/1 var(--f-mono); margin-left: 3px; }
    .rqw-mk.ok { color: var(--ok); } .rqw-mk.bad { color: var(--bad); } .rqw-mk.warn { color: var(--warn); }
    .rqw-dot-sol { background: var(--violet); } .rqw-dot-need { background: var(--ok); } .rqw-dot-goal { background: var(--info); } .rqw-dot-wish { background: var(--warn); } .rqw-dot-limit { background: var(--pink); } .rqw-dot-erase { background: none; border: 1.5px dashed var(--text-muted); }
    .rqw-dig { display: grid; grid-template-columns: minmax(0, 1fr) 270px; gap: 16px; align-items: start; }
    .rqw-dig > * { min-width: 0; }
    .rqw-chat { display: grid; gap: 10px; }
    .rqw-kind { font-size: 12.5px; line-height: 1.4; padding: 6px 10px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface-2); color: var(--text-2); margin-left: 50px; }
    .rqw-kind b { font-weight: 600; }
    .rqw-kind.good { border-color: color-mix(in srgb, var(--ok) 45%, var(--border)); }
    .rqw-kind.good b { color: var(--ok); }
    .rqw-kind.sol b, .rqw-kind.lead b { color: var(--warn); }
    .rqw-kind.sol, .rqw-kind.lead { border-color: color-mix(in srgb, var(--warn) 45%, var(--border)); }
    .rqw-kind.jargon { border-color: color-mix(in srgb, var(--bad) 45%, var(--border)); }
    .rqw-kind.jargon b { color: var(--bad); }
    .rqw-qs { display: grid; gap: 6px; }
    .rqw-qs .btn { justify-content: flex-start; text-align: left; white-space: normal; font-weight: 500; line-height: 1.35; }
    .rqw-rungs { display: grid; gap: 6px; }
    .rqw-rg { border: 1px solid var(--border); border-radius: 10px; padding: 8px 10px; background: var(--surface); display: grid; gap: 4px; font-size: 13px; line-height: 1.35; }
    .rqw-rg .t { font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .rqw-rg.on { border-color: var(--ok); background: var(--ok-soft); }
    .rqw-rg.on .t { color: var(--ok); }
    .rqw-rg.sol { border-color: color-mix(in srgb, var(--violet) 45%, var(--border)); }
    .rqw-rg.sol .t { color: var(--violet); }
    .rqw-rg ul { margin: 0; padding-left: 16px; display: grid; gap: 2px; }
    .rqw-rg .decoy { color: var(--warn); }
    @media (max-width: 760px) {
      .rqw-drill, .rqw-lv, .rqw-dig { grid-template-columns: minmax(0, 1fr); }
      .rqw-def { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .rqw-def > .v { margin-bottom: 8px; }
    }
    @media (max-width: 440px) {
      .rqw-gq { grid-template-columns: minmax(0, 1fr); }
      .rqw-rung { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .rqw-kind { margin-left: 0; }
      .rqw-mail { padding: 12px; font-size: 14.5px; }
    }
  </style>`);

  // ---------- общие помощники ----------
  const quizRef = cfg => cfg.options.map((o, i) => o.ok ? i : -1).filter(i => i >= 0);
  const plainT = s => String(s || '').replace(/<[^>]+>/g, '');
  // вкладка рисуется в свежий контейнер: старые обработчики уходят вместе со старым содержимым
  const fresh = fn => pane => { const d = document.createElement('div'); pane.appendChild(d); fn(d); };

  // =====================================================================
  // Теория 1. Что такое требование (соседний пример — заказ торта к юбилею, фразы заказчиков из других бизнесов)
  // =====================================================================
  const CAKE_PARTS = [
    { id: 'what', k: 'что', t: 'шоколадный торт', miss: 'Без вкуса кондитер испечёт «фирменный» медовик. Вкусно, но мама просила шоколадный.' },
    { id: 'size', k: 'сколько', t: 'на 12 человек', miss: 'Без размера испекут стандартный, на 8 человек, — четырём гостям не хватит.' },
    { id: 'text', k: 'надпись', t: '«С юбилеем, мама»', miss: 'Без точного текста напишут дежурное «С днём рождения».' },
    { id: 'when', k: 'когда', t: 'к субботе, 15:00', miss: 'Без срока торт будет готов «к выходным» — в воскресенье утром. Праздник прошёл.' },
    { id: 'nuts', k: 'нельзя', t: 'без орехов — у мамы аллергия', miss: 'Без запрета кондитер украсит торт грецким орехом, как любит. Это уже опасно.' }
  ];
  const CAKE_HOW = { id: 'how', k: 'способ', t: 'печь 40 минут при 180°, крем на сливках 33 %' };
  const DEFS = [
    { v: 'plain', t: 'Простыми словами', src: 'как объяснить новичку',
      html: 'Требование — это <span class="rqw-hl">записанное условие</span>: что должно уметь или каким должно быть то, что мы делаем, <span class="rqw-hl">чтобы человек решил свою задачу</span>. Хорошее требование можно проверить.',
      cake: 'Бланк заказа: «шоколадный, на 12 человек, надпись „С юбилеем, мама“, к субботе 15:00, без орехов».' },
    { v: 'babok', t: 'BABOK v3', src: 'IIBA, руководство по бизнес-анализу',
      html: 'Требование — <span class="rqw-hl">пригодное к использованию представление потребности</span>. Требования помогают понять, какую ценность даст решение, если их выполнить.',
      cake: 'Потребность — порадовать маму на юбилее. Требование — запись этой потребности, по которой можно испечь: вкус, размер, надпись, срок, запрет.' },
    { v: 'ieee', t: 'IEEE 610.12', src: 'словарь программной инженерии; то же — в ISO/IEC/IEEE 24765',
      html: '<ol class="rqw-ol"><li><span class="rqw-hl">Условие или возможность</span>, нужные пользователю, чтобы решить задачу или достичь цели.</li><li>Условие или возможность, которыми должна обладать система, чтобы <span class="rqw-hl">выполнить договор, стандарт или спецификацию</span>.</li><li><span class="rqw-hl">Документированное представление</span> условия или возможности из пунктов 1 и 2.</li></ol>',
      cake: '1 — клиентке нужен торт к 15:00 субботы. 2 — торт обязан соответствовать санитарным нормам, даже если клиентка о них не говорила. 3 — всё это записано на бланке, а не держится в голове кассира.' }
  ];
  const YN = [
    { t: '«Хочу, чтобы сайт кофейни был современный»', ok: false, why: 'Пока это вкус: «современный» не проверить. Спросите, что мешает гостям на нынешнем сайте, — там и прячется требование.' },
    { t: '«Гость может отменить бронь столика не позже чем за 2 часа до визита»', ok: true, why: 'Требование: кто (гость), что может (отменить бронь), условие с числом (за 2 часа). Его можно проверить.' },
    { t: '«Сделайте как в приложении соседнего фитнес-клуба»', ok: false, why: 'Это образец готового решения. Что именно там нравится и зачем это вашим клиентам?' },
    { t: '«Бариста видит заказы из приложения в порядке времени готовности»', ok: true, why: 'Требование: кто (бариста), что (видит заказы), в каком порядке. Проверяемо.' },
    { t: '«Нам нужен чат-бот»', ok: false, why: 'Это решение. Какую задачу он решит? Может, хватит часов работы на сайте и автоответа.' },
    { t: '«Данные клиентов фитнес-клуба хранятся на серверах в России»', ok: true, why: 'Тоже требование — ограничение по закону (152-ФЗ о персональных данных). Его нельзя нарушить, и его можно проверить.' }
  ];

  const howWhat = {
    id: 'how-what', covers: ['mark'], title: 'Как это работает: что такое требование', free: true, noReset: true,
    simple: {
      icon: '🎂',
      plain: 'Требование — записанное условие: что должно уметь или каким должно быть то, что мы делаем, чтобы человек решил свою задачу. Не «как сделать», а «что должно получиться и как понять, что получилось».',
      analogy: 'Заказ торта: «шоколадный, на 12 человек, надпись „С юбилеем, мама“, к субботе 15:00, без орехов». Каждая часть — условие. Уберите любую — кондитер испечёт честно, но не тот торт. А «пеките 40 минут при 180°» — уже не требование клиентки, а способ: его выбирает кондитер.',
      tech: '<b>BABOK v3</b>: требование — «пригодное к использованию представление потребности». <b>IEEE 610.12</b> (и ISO/IEC/IEEE 24765): условие или возможность, нужные пользователю для решения задачи; условие или возможность, которыми должна обладать система, чтобы выполнить договор или стандарт; документированное представление такого условия. Требование описывает <i>что</i> и <i>зачем</i>, а не <i>как</i>.'
    },
    lead: ui.brief({
      situation: 'Соседний пример — заказ торта к юбилею мамы, без всякой программы, и фразы заказчиков из других бизнесов: кофейни и фитнес-клуба. Две вкладки: из чего состоит требование и как отличить его от того, что им только кажется.',
      todo: [
        'Вкладка «Заказ торта»: убирайте части заказа по одной и смотрите, какой торт получится. Потом нажмите на плашку «способ» и прочитайте, почему это уже не требование клиентки.',
        'Вкладка «Три определения»: переключите «Простыми словами», «BABOK v3» и «IEEE 610.12». Найдите, что общего у всех трёх.',
        'Там же — игра «Требование или ещё нет?»: шесть фраз. Для каждой решите сами, потом прочитайте пояснение.'
      ],
      look: 'Зелёная плашка — условие есть в заказе. Зачёркнутая — пропало, и торт будет не тот. Пунктирная фиолетовая — способ, а не условие: его выбирает исполнитель.'
    }),
    render(el) {
      el.classList.add('rqw-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'cake', t: 'Заказ торта', render: fresh(drawCake) },
        { id: 'defs', t: 'Три определения', render: fresh(drawDefs) }
      ], 'cake');
    }
  };
  function drawCake(pane) {
    const on = { what: true, size: true, text: true, when: true, nuts: true, how: false };
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Клиентка звонит в пекарню и заказывает торт к юбилею мамы. Каждая плашка — часть заказа. Нажмите на плашку, чтобы убрать её из заказа или вернуть.</p>
      <div class="rqw-cake" data-parts></div>
      <div class="stack" data-res></div>
    </div>`;
    function draw() {
      TR.$('[data-parts]', pane).innerHTML = CAKE_PARTS.concat([CAKE_HOW]).map(p => {
        const how = p.id === 'how', o = !!on[p.id];
        const st = how ? (o ? 'клиентка диктует способ' : 'нажмите — клиентка продиктует способ') : (o ? 'в заказе' : 'убрано из заказа');
        return `<button type="button" class="rqw-part ${how ? 'how' : ''}" data-cp="${p.id}" aria-pressed="${o}"><span class="k">${esc(p.k)}</span><span>${esc(p.t)}</span><span class="small dim">${st}</span></button>`;
      }).join('');
      const lost = CAKE_PARTS.filter(p => !on[p.id]);
      let h = lost.length
        ? ui.note('bad', `Торт не тот: потеряно условий — ${lost.length} из 5`, `<ul class="checks">${lost.map(p => `<li class="bad">${esc(p.miss)}</li>`).join('')}</ul>`)
        : ui.note('ok', 'Торт тот самый', 'Каждая часть заказа — условие, которое можно проверить: шоколадный? на 12 человек? надпись слово в слово? готов к субботе 15:00? без орехов? Это и есть требования: не «как печь», а «что должно получиться и как понять, что получилось».');
      if (on.how) h += ui.note('warn', 'А это уже не требование клиентки', 'Время, температура и жирность сливок — способ, его выбирает кондитер. Продиктовав способ, клиентка отнимает у мастера свободу сделать лучше: вдруг такой крем течёт в жару? А если торт не удастся — кто виноват: рецепт клиентки или кондитер? В проектах так же: «сделайте в Excel», «нужна кнопка» — это способ, а не требование.');
      if (!lost.length && !on.how) h += ui.note('info', 'Заметьте: условия бывают разные', '«Что» — это функция. «Сколько» и «когда» — условия качества и сроки. «Нельзя с орехами» — ограничение. Завтра, в тренировке «Виды требований», разложим так требования «Колоса».');
      TR.$('[data-res]', pane).innerHTML = h;
    }
    TR.on(pane, 'click', '[data-cp]', (e, b) => { on[b.dataset.cp] = !on[b.dataset.cp]; draw(); });
    draw();
  }
  function drawDefs(pane) {
    let cur = 'plain';
    const got = {};
    pane.innerHTML = `<div class="stack">
      <div class="row"><span class="small dim">Определение:</span>${ui.seg('df', DEFS.map(d => ({ v: d.v, t: d.t })), cur, 'accent')}</div>
      <div data-def></div>
      ${ui.note('info', 'Что общего у всех трёх', 'Требование говорит о <b>потребности человека</b> и об <b>условии</b>, по которому видно, что она удовлетворена, — а не о способе. И оно <b>записано</b>: то, что держится в голове, — ещё не требование.')}
      <div class="eyebrow">Игра «Требование или ещё нет?»</div>
      <div class="rqw-game" data-g></div>
      <div data-gs></div>
    </div>`;
    function drawDef() {
      const d = DEFS.find(x => x.v === cur);
      TR.$('[data-def]', pane).innerHTML = `<div class="card flat"><div class="row between"><b>${esc(d.t)}</b><span class="small dim">${esc(d.src)}</span></div><div class="rqw-defx">${d.html}</div><div class="small muted"><b>На торте:</b> ${esc(d.cake)}</div></div>`;
    }
    function drawGame() {
      TR.$('[data-g]', pane).innerHTML = YN.map((g, i) => {
        const a = got[i], st = a == null ? '' : (a === g.ok ? 'ok' : 'bad');
        return `<div class="rqw-gq ${st}"><span>${esc(g.t)}</span><div class="row"><button type="button" class="btn xs" data-yn="${i}|1" aria-pressed="${a === true}">Требование</button><button type="button" class="btn xs" data-yn="${i}|0" aria-pressed="${a === false}">Ещё нет</button></div>${a != null ? `<div class="why">${a === g.ok ? '✓ ' : '✕ Не совсем. '}${esc(g.why)}</div>` : ''}</div>`;
      }).join('');
      const n = Object.keys(got).length, ok = YN.filter((g, i) => got[i] === g.ok).length;
      TR.$('[data-gs]', pane).innerHTML = n === YN.length ? ui.note(ok === n ? 'ok' : 'warn', `Верно ${ok} из ${n}`, 'Подсказка на будущее: «ещё нет» — не значит «выбросить». Вкус, образец и готовое решение — ценные подсказки. За каждой прячется потребность, и задача аналитика — до неё докопаться, а потом записать требование так, чтобы его можно было проверить.') : '';
    }
    ui.onSeg(pane, (n, v) => { if (n === 'df') { cur = v; drawDef(); } });
    TR.on(pane, 'click', '[data-yn]', (e, b) => { const [i, v] = b.dataset.yn.split('|'); got[i] = v === '1'; drawGame(); });
    drawDef(); drawGame();
  }

  // =====================================================================
  // Теория 2. От проблемы к решению (соседний пример — сверло и полка, пять заказчиков из других бизнесов)
  // =====================================================================
  const DRILL = [
    { lv: 'Решение', said: '«Дайте сверло на 8 мм»', ask: null, n: 1, opts: ['сверло на 8 мм'] },
    { lv: 'Тоже решение, помельче', said: 'Нужно отверстие в стене', ask: ['Зачем вам сверло?', 'Просверлить отверстие под дюбель.'], n: 3, opts: ['сверло на 8 мм', 'перфоратор', 'позвать мастера'] },
    { lv: 'Требование', said: 'Полка над столом: около 40 книг, до 15 кг, шириной не больше метра', ask: ['А отверстие зачем?', 'Повесить полку над столом. Книг штук сорок, тяжёлые.'], n: 4, opts: ['навесная полка на дюбелях', 'полка на клеевых креплениях', 'полка на рейлинге', 'книжная стенка до потолка'] },
    { lv: 'Потребность', said: 'Хранить книги так, чтобы видеть корешки и легко доставать нужную', ask: ['А полка зачем?', 'Чтобы книги не лежали стопками, а я видел корешки и доставал нужную.'], n: 7, opts: ['любая из полок', 'напольный стеллаж', 'шкаф со стеклянными дверцами', 'часть книг — в электронном виде'] },
    { lv: 'Проблема', said: 'Книги стопками на полу: пылятся, нужную не найти, сын об них спотыкается', ask: ['А сейчас что не так?', 'Лежат на полу стопками. Пылятся, нужную не найдёшь, сын об них спотыкается.'], n: 10, opts: ['всё, что ниже', 'отдать часть книг в библиотеку', 'продать прочитанное', 'больше не покупать бумажные'] }
  ];
  const LENS = [
    { v: 'sol', t: 'решения: «сверло на 8 мм»', k: 'bad', ttl: 'Записали решение', h: 'Продавец продал сверло. Дома выяснилось: стена бетонная — нужен перфоратор, а дюбель под 8 мм не удержит 15 кг книг. «Требование» выполнено, задача — нет. Покупатель вернулся злой.' },
    { v: 'need', t: 'потребности и условий: «полка над столом, 40 книг, до 15 кг»', k: 'ok', ttl: 'Записали потребность и условия', h: 'Продавец спросил, что за стена, сколько весят книги и где будет полка, — и предложил полку на рейлинге с правильным крепежом. Покупатель ушёл с решением, о котором сам не знал.' },
    { v: 'top', t: 'самой большой цели: «порядок в доме»', k: 'warn', ttl: 'Забрались слишком высоко', h: 'Продавец начал обсуждать шкафы, ремонт и «расхламление». Через час покупатель ушёл без покупки. Слишком высоко — и задача перестаёт быть вашей: строительный магазин не решает, как устроить жизнь в квартире.' }
  ];
  const SAYS = [
    { who: 'Владелец кофейни', said: '«Нужен чат-бот в Telegram»', kind: 'решение', need: 'Вечером и в выходные гости пишут: «вы работаете 1 января?», «есть без глютена?» — около 30 вопросов в день остаются без ответа, часть гостей уходит к соседям.', q: '«Что происходит сейчас, когда гость пишет вам вечером?»' },
    { who: 'Директор автосервиса', said: '«Сделайте выгрузку в Excel»', kind: 'решение', need: 'Каждое утро знать, какие машины больше двух дней ждут запчастей, чтобы позвонить поставщику до того, как клиент начнёт ругаться.', q: '«Что вы будете делать с этой таблицей, когда откроете её?»' },
    { who: 'Завуч школы', said: '«Хочу приложение, как у банка»', kind: 'образец и вкус', need: 'Родители звонят узнать расписание и оценки — секретарь тратит на звонки полдня. Нужно, чтобы родители находили это сами.', q: '«Что именно нравится в приложении банка? Кому сейчас тяжелее всего?»' },
    { who: 'Хозяйка салона красоты', said: '«Нужны SMS-напоминания»', kind: 'решение', need: 'Клиентки забывают о записи — 4–5 пустых окон в неделю у мастеров. Нужно, чтобы клиентка пришла или заранее освободила время.', q: '«Сколько записей в неделю срывается и почему?»' },
    { who: 'Главврач поликлиники', said: '«Чтобы всё работало быстро и удобно»', kind: 'неизмеримое пожелание', need: 'С 8:00 до 9:00 пациенты не могут дозвониться в регистратуру: линия занята. Нужно записаться к врачу без звонка в утренний пик.', q: '«Где сейчас медленно и неудобно? Покажете на примере вчерашнего утра?»' }
  ];

  const howChain = {
    id: 'how-chain', covers: ['dig'], title: 'Как это работает: от проблемы к решению', free: true, noReset: true,
    simple: {
      icon: '🔩',
      plain: 'Заказчик почти всегда приходит с готовым решением: «дайте кнопку», «сделайте выгрузку». За решением прячется потребность — что человеку на самом деле нужно. А за потребностью — проблема или цель бизнеса. Аналитик поднимается вопросом «зачем?», находит потребность и уже из неё пишет требование.',
      analogy: 'Покупатель в строительном магазине просит сверло на 8 мм. Но сверло ему не нужно — ему нужно отверстие. И отверстие не нужно — нужно повесить полку, чтобы книги не лежали на полу. Узнав это, продавец предложит полку на рейлинге — с правильным крепежом или вовсе без сверления.',
      tech: 'Цепочка <b>проблема → потребность → требование → решение</b>. Потребность — проблема или возможность, которую нужно решить (BABOK v3). Требование описывает, <i>что</i> должно быть верно, чтобы потребность была удовлетворена; решение — <i>как</i> это будет сделано. Мысль «людям нужно не сверло, а отверстие» часто приписывают маркетологу Теодору Левитту.'
    },
    lead: ui.brief({
      situation: 'Соседний пример — покупатель в строительном магазине и пять заказчиков из других бизнесов: кофейня, автосервис, школа, салон красоты, поликлиника. Две вкладки: лестница «Зачем? — Как?» и переключатель «что говорит заказчик / что ему нужно».',
      todo: [
        'Вкладка «Сверло и отверстие»: начните снизу, с того, что попросил покупатель. Нажимайте «Зачем? ↑» и смотрите, как меняется ступень и сколько становится вариантов решения.',
        'Спуститесь обратно кнопкой «Как? ↓». Переключите «Аналитик записал требование на уровне…» и сравните три исхода.',
        'Вкладка «Говорит / нужно»: переключите режим для всех пяти карточек сразу или переворачивайте по одной. Обратите внимание на вопрос, который помог докопаться.'
      ],
      look: 'Счётчик вариантов растёт, чем выше вы поднимаетесь: потребность разрешает много решений, а решение — одно. Но слишком высоко — тоже плохо: «порядок в доме» уже не задача строительного магазина.'
    }),
    render(el) {
      el.classList.add('rqw-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'drill', t: 'Сверло и отверстие', render: fresh(drawDrill) },
        { id: 'says', t: 'Говорит / нужно', render: fresh(drawSays) }
      ], 'drill');
    }
  };
  function drawDrill(pane) {
    let lvl = 0, lens = 'need';
    pane.innerHTML = `<div class="stack">
      <div class="row"><button type="button" class="btn sm primary" data-up>Зачем? ↑</button><button type="button" class="btn sm" data-down>Как? ↓</button><span class="small dim tnum" data-cnt></span></div>
      <div class="rqw-drill"><div class="rqw-ladder" data-lad></div><div class="stack" data-side></div></div>
      <div class="stack tight"><div class="eyebrow">Аналитик записал требование на уровне…</div>${ui.seg('lens', LENS.map(l => ({ v: l.v, t: l.t })), lens)}</div>
      <div class="stack" data-lens></div>
    </div>`;
    function draw() {
      TR.$('[data-lad]', pane).innerHTML = DRILL.map((r, i) => ({ r, i })).reverse().map(({ r, i }) => {
        const known = i <= lvl;
        return `<div class="rqw-rung ${i === lvl ? 'on' : known ? '' : 'off'}"><span class="lv">${esc(r.lv)}</span><span>${known ? esc(r.said) : '— ещё не выяснено: спросите «Зачем?»'}</span></div>`;
      }).join('');
      const r = DRILL[lvl];
      TR.$('[data-side]', pane).innerHTML = `<div class="rqw-talk">${r.ask ? `<div><b>Продавец:</b> ${esc(r.ask[0])}</div><div><b>Покупатель:</b> ${esc(r.ask[1])}</div>` : `<div><b>Покупатель:</b> ${esc(r.said)}</div><div class="small dim">Продавец может просто продать сверло. А может спросить «зачем?».</div>`}</div>
        <div class="stat"><span class="k">Вариантов решения на этой ступени</span><span class="v">${r.n}</span>${ui.meter(r.n / 10, '')}</div>
        <div class="rqw-opts">${r.opts.map(o => `<span class="chip">${esc(o)}</span>`).join('')}</div>`;
      TR.$('[data-cnt]', pane).textContent = `ступень ${lvl + 1} из ${DRILL.length}`;
      TR.$('[data-up]', pane).disabled = lvl >= DRILL.length - 1;
      TR.$('[data-down]', pane).disabled = lvl <= 0;
    }
    function drawLens() {
      const L = LENS.find(x => x.v === lens);
      TR.$('[data-lens]', pane).innerHTML = ui.note(L.k, L.ttl, L.h) + (lens === 'need' ? ui.note('info', 'Что здесь делает аналитик', 'Поднимается вопросом «зачем?» до потребности и проблемы, проверяет у заказчика, что понял верно, и записывает требование на уровне <b>потребности и условий</b>: «около 40 книг, до 15 кг, над столом». Решение — какую полку и каким крепежом — выбирает команда, а аналитик может предложить варианты. Цепочка целиком: <b>проблема → потребность → требование → решение</b>.') : '');
    }
    TR.on(pane, 'click', '[data-up]', () => { if (lvl < DRILL.length - 1) lvl++; draw(); });
    TR.on(pane, 'click', '[data-down]', () => { if (lvl > 0) lvl--; draw(); });
    ui.onSeg(pane, (n, v) => { if (n === 'lens') { lens = v; drawLens(); } });
    draw(); drawLens();
  }
  function drawSays(pane) {
    let mode = 'say';
    const flip = {};
    pane.innerHTML = `<div class="stack">
      <div class="row"><span class="small dim">Показать:</span>${ui.seg('sm', [{ v: 'say', t: '🗣 Что говорит заказчик' }, { v: 'need', t: '🎯 Что ему нужно' }], mode, 'accent')}</div>
      <div class="rqw-says" data-cards></div>
      <div data-sn></div>
    </div>`;
    function isNeed(i) { return flip[i] != null ? flip[i] : mode === 'need'; }
    function draw() {
      TR.$('[data-cards]', pane).innerHTML = SAYS.map((s, i) => {
        const n = isNeed(i);
        return `<div class="rqw-sc ${n ? 'need' : ''}"><span class="who">${esc(s.who)}</span>${n
          ? `<div class="nd">${esc(s.need)}</div><div class="small dim">Помог вопрос: ${esc(s.q)}</div>`
          : `<div class="sd">${esc(s.said)}</div><span class="chip warn">${esc(s.kind)}</span>`}<button type="button" class="btn xs ghost" data-fl="${i}">${n ? '← что говорит' : 'что нужно →'}</button></div>`;
      }).join('');
      const allNeed = SAYS.every((s, i) => isNeed(i));
      TR.$('[data-sn]', pane).innerHTML = allNeed ? ui.note('info', 'Что здесь делает аналитик', 'Ни один заказчик не соврал и не ошибся — они просто говорят на языке решений, потому что так проще. Решение в словах заказчика — не мусор, а подсказка: за ним всегда стоит потребность. Обратите внимание на вопросы: они о том, <b>что происходит сейчас</b> и <b>что человек будет делать</b> с результатом, — а не «какого цвета кнопку». Подробно о вопросах — на неделе 3.') : '';
    }
    ui.onSeg(pane, (n, v) => { if (n === 'sm') { mode = v; Object.keys(flip).forEach(k => delete flip[k]); draw(); } });
    TR.on(pane, 'click', '[data-fl]', (e, b) => { const i = +b.dataset.fl; flip[i] = !isNeed(i); draw(); });
    draw();
  }

  // =====================================================================
  // Теория 3. Уровни и классы требований (соседний пример — библиотека, продление книг онлайн)
  // =====================================================================
  const WIG_OF = { biz: 'Бизнес-требования', user: 'Пользовательские требования', func: 'Функциональные требования', nfr: 'Нефункциональное: атрибут качества', rule: 'Бизнес-правило', con: 'Ограничение', ifc: 'Внешний интерфейс', trans: 'Отдельной ступени нет' };
  const BABOK_OF = {
    biz: { t: 'Бизнес-требования' },
    user: { t: 'Требования заинтересованных лиц' },
    func: { t: 'Требования к решению · функциональные' },
    nfr: { t: 'Требования к решению · нефункциональные' },
    ifc: { t: 'Требования к решению · обмен с внешней системой' },
    rule: { t: 'Не отдельный класс: бизнес-правила разбирают отдельной техникой и выводят из них требования к решению', grey: true },
    con: { t: 'Не класс, а ограничение: фактор, который нельзя изменить и который сужает выбор решения', grey: true },
    trans: { t: 'Переходные требования', isNew: true }
  };
  const LIB_STEPS = [
    { id: 'biz', items: ['Сократить очереди на абонементе на 30 % за полгода: сейчас половина визитов — только чтобы продлить книгу'], who: 'директор библиотеки', q: '«Зачем это библиотеке? По какой цифре поймём, что получилось?»', doc: 'документ о концепции и границах проекта (vision and scope)' },
    { id: 'user', items: ['Читатель хочет продлить книгу из дома, чтобы не ехать в библиотеку', 'Библиотекарь хочет видеть онлайн-продления в своём журнале, чтобы не продлить одну книгу дважды'], who: 'читатели и библиотекари', q: '«Что вы хотите сделать? В какой ситуации? Что мешает сейчас?»', doc: 'сценарии использования (use case) или пользовательские истории (user story)' },
    { id: 'func', items: ['Система показывает читателю книги на руках и сроки возврата', 'Система продлевает срок на 14 дней по нажатию «Продлить»', 'Система отказывает в продлении, если на книгу есть очередь, и объясняет причину', 'Система записывает онлайн-продление в журнал библиотекаря'], who: 'аналитик выводит их из пользовательских и обсуждает с командой', q: '«Что именно делает система? А если на книгу очередь? А если срок уже прошёл?»', doc: 'спецификация требований к ПО (SRS, функциональные требования)' }
  ];
  const LIB_SIDE = [
    { id: 'nfr', x: 'Список книг открывается не дольше 2 секунд в 95 % случаев' },
    { id: 'rule', x: 'Книгу можно продлить не больше двух раз подряд; книги из читального зала не продлеваются' },
    { id: 'con', x: 'Вход — только по номеру читательского билета; данные читателей хранятся в России (152-ФЗ)' },
    { id: 'ifc', x: 'Сроки и очереди берутся из программы учёта книг, которая уже работает в библиотеке' },
    { id: 'trans', x: 'Перенести 40 000 читательских билетов из старой картотеки; месяц принимать продления и по телефону, и онлайн; обучить библиотекарей' }
  ];
  const CAFE = [
    { t: '«Через год 30 % заказов кофе — через приложение, а не у кассы»', ok: 'biz', why: 'Цель бизнеса в цифрах и со сроком — бизнес-требование.' },
    { t: '«Гость хочет заказать кофе по дороге и забрать без очереди»', ok: 'user', why: 'Человек и его задача, без слова «система» — пользовательское требование.' },
    { t: '«Система показывает гостю время, когда заказ будет готов»', ok: 'func', why: 'Действует система — функциональное требование.' },
    { t: '«Заказ можно отменить, пока бариста не начал его готовить»', ok: 'side', why: 'Правило бизнеса, которое действует и без программы, — сбоку от лестницы.' },
    { t: '«Оплата проходит через платёжный сервис банка»', ok: 'side', why: 'Обмен с чужой системой — внешний интерфейс, сбоку от лестницы.' }
  ];
  const CAFE_B = [{ v: 'biz', t: 'Бизнес' }, { v: 'user', t: 'Пользоват.' }, { v: 'func', t: 'Функц.' }, { v: 'side', t: 'Сбоку' }];

  const howLevels = {
    id: 'how-levels', covers: ['levels', 'nina'], title: 'Как это работает: уровни и классы требований', free: true, noReset: true,
    simple: {
      icon: '🪜',
      plain: 'Одна хотелка бизнеса превращается в лесенку требований. Наверху — зачем это бизнесу (цель в цифрах). Ниже — что хотят сделать люди. Ещё ниже — что именно делает система. А сбоку — то, что действует сразу на всех ступенях: насколько хорошо, по каким правилам, в каких рамках и с какими чужими системами.',
      analogy: 'В пекарне: хозяйка решила продавать больше свадебных тортов (цель). Невесте нужно заказать торт заранее и быть уверенной, что его не перепутают (пользовательское). Кассир записывает заказ на бланк с датой, ярусами и фото (функция). А сбоку — правило «свадебный торт принимаем за неделю», рамка «цех печёт не больше трёх таких тортов в день» и качество «крем не течёт при +25».',
      tech: '<b>Вигерс и Битти</b>: три уровня — <b>бизнес-требования</b> (зачем: цели и выгоды), <b>пользовательские</b> (что пользователи должны уметь сделать), <b>функциональные</b> (что делает система). Рядом — <b>нефункциональные</b> (атрибуты качества), <b>бизнес-правила</b>, <b>ограничения</b> и <b>внешние интерфейсы</b>. <b>BABOK v3</b> делит по-своему: бизнес-требования, требования заинтересованных лиц, требования к решению (функциональные и нефункциональные) и <b>переходные</b> — нужные только на время перехода со старого на новое.'
    },
    lead: ui.brief({
      situation: 'Соседний пример — городская библиотека хочет, чтобы книги можно было продлевать онлайн. Одна хотелка «продлевать из дома» спускается по лестнице уровней. Переключатель показывает, как те же требования раскладывают два главных источника: книга Вигерса и Битти и руководство BABOK.',
      todo: [
        'Вкладка «Лестница»: нажимайте «Шаг вниз ↓». На каждой ступени прочитайте карточку под лестницей: кто это говорит, о чём спрашивает аналитик и где это записывают.',
        'Включите «Показать то, что сбоку» — появятся качество, правила, ограничения и интерфейсы.',
        'Переключите классификацию на «BABOK v3». Какие карточки сменили название? Какие стали серыми? Какая появилась как новый класс?',
        'Вкладка «Проверь себя»: пять фраз из кофейни — на какой они ступени?'
      ],
      look: 'Число в углу ступени — сколько на ней требований: чем ниже, тем их больше и тем они точнее. Серая карточка в режиме BABOK — то, что BABOK отдельным классом требований не считает. Зелёная — класс, которого нет у Вигерса.'
    }),
    render(el) {
      el.classList.add('rqw-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'lad', t: 'Лестница', render: fresh(drawLevels) },
        { id: 'self', t: 'Проверь себя', render: fresh(drawCafe) }
      ], 'lad');
    }
  };
  function drawLevels(pane) {
    const st = { cls: 'wig', cur: 0, side: false };
    pane.innerHTML = `<div class="stack">
      <div class="row"><span class="small dim">Классификация:</span>${ui.seg('cls', [{ v: 'wig', t: 'Вигерс и Битти' }, { v: 'babok', t: 'BABOK v3' }], st.cls, 'accent')}</div>
      <div class="row"><button type="button" class="btn sm primary" data-dn>Шаг вниз ↓</button><button type="button" class="btn sm ghost" data-top>⟲ Наверх</button><label class="toggle"><input type="checkbox" data-sd> <span>Показать то, что сбоку</span></label></div>
      <div class="rqw-lv"><div class="rqw-steps" data-steps></div><div class="rqw-sidec" data-side></div></div>
      <div class="stack" data-info></div>
    </div>`;
    const lab = id => st.cls === 'wig' ? WIG_OF[id] : BABOK_OF[id].t;
    function draw() {
      TR.$('[data-steps]', pane).innerHTML = LIB_STEPS.map((s, i) => {
        const open = i <= st.cur;
        return `${i ? '<div class="rqw-arr">↓</div>' : ''}<div class="rqw-step ${i === st.cur ? 'on' : ''} ${open ? '' : 'off'}"><div class="row between"><b>${esc(lab(s.id))}</b><span class="chip ${open ? 'info' : ''}">${open ? s.items.length : '?'}</span></div>${open ? `<ul>${s.items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '<span class="small dim">Нажмите «Шаг вниз ↓»</span>'}</div>`;
      }).join('');
      const side = TR.$('[data-side]', pane);
      if (!st.side) side.innerHTML = `<div class="rqw-ghost small dim">Сбоку от лестницы — качество, правила, ограничения и интерфейсы${st.cls === 'babok' ? ', а в BABOK ещё и переходные требования' : ''}. Включите «Показать то, что сбоку».</div>`;
      else side.innerHTML = LIB_SIDE.map(x => {
        const B = BABOK_OF[x.id];
        const cls = st.cls === 'babok' ? (B.grey ? 'grey' : B.isNew ? 'new' : '') : (x.id === 'trans' ? 'grey' : '');
        const k = st.cls === 'wig' && x.id === 'trans' ? 'Отдельной ступени нет: перенос данных и обучение обычно уходят в план внедрения' : lab(x.id);
        return `<div class="rqw-sd ${cls}"><span class="k">${esc(k)}</span><span>${esc(x.x)}</span></div>`;
      }).join('');
      const s = LIB_STEPS[st.cur];
      let info = `<div class="card flat"><h4>Ступень ${st.cur + 1} · ${esc(lab(s.id))}</h4><div class="rqw-def">
        <span class="k">Кто говорит</span><div class="v">${esc(s.who)}</div>
        <span class="k">Вопрос аналитика</span><div class="v">${esc(s.q)}</div>
        <span class="k">Где записывают</span><div class="v">${esc(s.doc)}</div>
      </div></div>`;
      if (st.cur === 2 && st.cls === 'wig') info += ui.note('info', 'Одна хотелка — десяток требований', `Одна цель → 2 пользовательских → 4 функциональных${st.side ? ' — и ещё 4 сбоку' : ''}. Функциональные требования не придумывают из головы: их выводят из пользовательских, а те — из бизнес-целей. Поэтому у каждого требования есть ответ на вопрос «зачем», а у Нины Сергеевны — ответ на вопрос «за что я плачу».`);
      if (st.cls === 'babok') info += ui.note('ok', 'Те же требования — другие названия', 'Бизнес-требования остались бизнес-требованиями. Пользовательские стали <b>требованиями заинтересованных лиц</b> — не только пользователей, но и, например, бухгалтера или юриста. Функциональные и нефункциональные — две половины <b>требований к решению</b>. Бизнес-правила и ограничения BABOK отдельными классами не считает. Зато есть <b>переходные</b> — перенос данных, обучение, временная работа «по-старому» и «по-новому». Обе схемы в ходу; единого мнения нет — важно, чтобы команда понимала друг друга.');
      TR.$('[data-info]', pane).innerHTML = info;
      TR.$('[data-dn]', pane).disabled = st.cur >= LIB_STEPS.length - 1;
    }
    TR.on(pane, 'click', '[data-dn]', () => { if (st.cur < LIB_STEPS.length - 1) st.cur++; draw(); });
    TR.on(pane, 'click', '[data-top]', () => { st.cur = 0; draw(); });
    pane.addEventListener('change', e => { if (e.target.matches('[data-sd]')) { st.side = e.target.checked; draw(); } });
    ui.onSeg(pane, (n, v) => { if (n === 'cls') { st.cls = v; draw(); } });
    draw();
  }
  function drawCafe(pane) {
    const got = {};
    function draw() {
      const n = Object.keys(got).length, ok = CAFE.filter((c, i) => got[i] === c.ok).length;
      pane.innerHTML = `<div class="stack">
        <p class="small muted">Сеть кофеен у дома запускает приложение. На какой ступени каждая фраза? «Сбоку» — качество, правило, ограничение или интерфейс.</p>
        <div class="rqw-game">${CAFE.map((c, i) => {
          const g = got[i], st = g == null ? '' : g === c.ok ? 'ok' : 'bad';
          return `<div class="rqw-gq ${st}"><span>${esc(c.t)}</span><div class="row">${CAFE_B.map(b => `<button type="button" class="btn xs" data-cf="${i}|${b.v}" aria-pressed="${g === b.v}">${esc(b.t)}</button>`).join('')}</div>${g ? `<div class="why">${g === c.ok ? '✓ ' : '✕ Не совсем. '}${esc(c.why)}</div>` : ''}</div>`;
        }).join('')}</div>
        ${n === CAFE.length ? ui.note(ok === n ? 'ok' : 'warn', `Верно ${ok} из ${n}`, 'Быстрый способ: <b>есть цифра и срок для бизнеса</b> — бизнес-требование; <b>действует человек</b> — пользовательское; <b>действует система</b> — функциональное; <b>правило, качество, рамка или чужая система</b> — сбоку.') : ''}
      </div>`;
    }
    TR.on(pane, 'click', '[data-cf]', (e, b) => { const [i, v] = b.dataset.cf.split('|'); got[i] = v; draw(); });
    draw();
  }

  // =====================================================================
  // Практика 1. Разметьте письмо Нины Сергеевны (DOMAIN §6)
  // =====================================================================
  const TAGS = [
    { v: 'sol', t: 'Решение', s: 'реш', d: 'как сделать: кнопка, программа, образец' },
    { v: 'need', t: 'Потребность', s: 'потр', d: 'что человеку нужно сделать или получить' },
    { v: 'goal', t: 'Цель или проблема', s: 'цель', d: 'что болит у бизнеса, ради чего всё' },
    { v: 'wish', t: 'Неизмеримое пожелание', s: 'пож', d: 'красиво, быстро, удобно — без чисел' },
    { v: 'limit', t: 'Ограничение, рамка', s: 'огр', d: 'сроки, очерёдность — то, что задано' }
  ];
  const TAG_T = Object.fromEntries(TAGS.map(t => [t.v, t]));
  const F = (id, t, ok, extra) => Object.assign({ id, t, ok }, extra || {});
  const LETTER = [
    [F('f-dodo', 'Приложение как у Додо,', 'sol', { alt: { wish: '«Как у Додо» — отчасти вкус. Но прежде всего это готовый образец решения: приложение как у другой компании. Что Нине в нём нравится и зачем это её покупателям?' } }), ' ', F('f-pretty', 'чтобы было красиво и быстро.', 'wish')],
    [F('f-btn', 'Кнопка «Заказать заранее»:', 'sol', { crit: true }), ' ', F('f-pick', 'клиент выбирает булки и время, когда заберёт.', 'need', { alt: { sol: 'Здесь уже нет ни кнопки, ни программы — только что человек хочет сделать. Это ближе к потребности, хотя «выбирает» ещё немного подсказывает способ.' } })],
    [F('f-card', 'Оплата картой.', 'sol', { alt: { need: 'Заплатить заранее — потребность. Но «картой» — уже способ: а СБП? а наличными на месте? Что здесь главнее — что нужно или как?' } })],
    [F('f-points', 'Баллы, как в Спортмастере.', 'sol')],
    [F('f-see', 'Чтобы технолог видел все заказы', 'need', { alt: { sol: '«Видел» — чуть-чуть способ, но кто и что хочет — уже есть. Это ближе к потребности; копать глубже будем во втором задании.' } }), ' ', F('f-excel', 'в Excel.', 'sol', { crit: true })],
    [F('f-1c', 'Выгрузка в 1С.', 'sol', { alt: { limit: '1С уже стоит у Олега Петровича, и менять её никто не будет — в этом смысле это рамка. Но сама «выгрузка» — способ. Зачем она? Кто сейчас делает это руками?' } })],
    [F('f-cakes', 'Торты тоже через приложение,', 'sol', { alt: { need: 'Заказывать торты — потребность, но «через приложение» — способ. Есть и другие: по телефону через кассира, на сайте. Что в этой фразе сказано — что или как?' } }), ' ', F('f-lose', 'а то теряем.', 'goal', { alt: { need: '«Не терять» — потребность бизнеса, верно. Но это скорее боль, ради которой всё затевается: 2–3 сорванных заказа в неделю. Какой тег про боль бизнеса?' } })],
    [F('f-deliv', 'Доставку тоже,', 'need', { also: { sol: 'доставку можно считать и потребностью покупателей, и готовым решением — у практиков тут нет единого мнения.' } }), ' ', F('f-later', 'но можно потом.', 'limit')],
    [F('f-always', 'Всё должно работать всегда и без сбоев.', 'wish')],
    [F('f-elder', 'Удобно для бабушек.', 'wish', { alt: { need: 'За этим и правда прячется потребность: пожилые покупатели должны суметь заказать. Но в таком виде — «удобно» — как Лера это проверит?' } })]
  ];
  const LAST = [F('f-ny', 'Запуск — к Новому году,', 'limit'), ' ', F('f-8m', 'крайний срок — до 8 Марта.', 'limit')];
  const FRAGS = LETTER.flat().concat(LAST).filter(p => typeof p !== 'string');
  const MHINT = {
    sol: 'Называет ли фраза конкретную вещь — кнопку, программу, образец, способ оплаты? Можно ли получить то же самое по-другому?',
    need: 'Есть ли здесь конкретная кнопка или программа — или только то, что человек хочет сделать или получить?',
    goal: 'Это способ, пожелание — или боль бизнеса, ради которой всё затевается?',
    wish: 'Как Лера проверит это? Есть ли тут число, условие, что-то измеримое?',
    limit: 'Это про то, что делает система, — или про рамки, в которых придётся работать: сроки, очерёдность? Можем ли мы это поменять сами?'
  };
  const CONTRA_Q = {
    q: 'Два фрагмента письма спорят друг с другом. Какие?', seed: 'rqw-contra',
    options: [
      { t: '«Запуск — к Новому году» и «крайний срок — до 8 Марта»', ok: 1, why: 'Да: это два разных срока. Какой из них настоящий и что именно должно работать к каждой дате — вопрос к Нине. Забегая вперёд: договорятся о пилоте в двух пекарнях к 1 февраля и о запуске во всех девяти к 1 марта — чтобы обкатать до 8 Марта.' },
      { t: '«Оплата картой» и «Баллы, как в Спортмастере»', why: 'Это два разных способа, но они не мешают друг другу: можно платить картой и копить баллы.' },
      { t: '«Доставку тоже» и «но можно потом»', why: 'Это не спор, а очерёдность в одной фразе: доставка нужна, но позже.' },
      { t: '«Выгрузка в 1С» и «Чтобы технолог видел все заказы в Excel»', why: 'Разные люди и разные задачи: 1С — бухгалтеру, план — технологу. Друг другу они не мешают.' }
    ]
  };
  function markEval(v) {
    v = v || {};
    return FRAGS.map(f => {
      const got = v[f.id];
      if (got === f.ok) return { f, s: 'ok', pts: 1, got };
      if (f.also && f.also[got]) return { f, s: 'ok', pts: 1, got, why: f.also[got], info: true };
      if (f.alt && f.alt[got]) return { f, s: 'warn', pts: 0.5, got, why: f.alt[got] };
      return { f, s: 'bad', pts: 0, got, empty: !got };
    });
  }
  function letterHTML(v, rv) {
    const frag = p => {
      if (typeof p === 'string') return esc(p);
      const tg = v[p.id], T = TAG_T[tg], r = rv && rv[p.id];
      return `<span class="rqw-frag" role="button" tabindex="0" data-f="${p.id}" ${tg ? `data-tag="${tg}"` : ''} aria-label="${esc(p.t)}${T ? ' — ' + esc(T.t) : ''}">${esc(p.t)}${T ? `<sup class="tg">${T.s}</sup>` : ''}${r ? `<span class="rqw-mk ${r}">${r === 'ok' ? '✓' : r === 'warn' ? '≈' : '✕'}</span>` : ''}</span>`;
    };
    return `<div class="rqw-mail"><div class="hd small dim">От: Нина Сергеевна · Кому: Игорь, «Квант Софт» · Тема: ТЗ</div>
      <div>Добрый день! Коротко, что нам нужно.</div>
      <ol>${LETTER.map(l => `<li>${l.map(frag).join('')}</li>`).join('')}</ol>
      <div>${LAST.map(frag).join('')}</div><div>Нина</div></div>`;
  }
  const markTask = {
    id: 'mark', title: 'Разметьте «ТЗ» Нины Сергеевны',
    simple: howWhat.simple,
    lead: ui.brief({
      situation: 'Понедельник, 09:40. Нина Сергеевна прислала Игорю письмо с темой «ТЗ» — десять пунктов и сроки. Игорь переслал: «Нина пишет, что тут всё понятно и можно начинать. Дима ждёт оценку». Ксения: «Сначала разметим: где в письме решение, где потребность, где боль бизнеса, где неизмеримое пожелание и где рамки. Иначе Дима будет оценивать кнопки, а не задачи».',
      todo: [
        'Выберите маркер в панели «Маркеры» — например, «Решение».',
        'Нажимайте на фрагменты письма с пунктирным подчёркиванием — они окрасятся в цвет маркера. Повторное нажатие тем же маркером снимает разметку; «Ластик» стирает любую.',
        'Разметьте все 17 фрагментов. Внизу ответьте, какие два фрагмента спорят друг с другом.',
        'Нажмите «Проверить». Засчитывается от 80 % — и только если «кнопка» и «Excel» размечены верно: от них зависит следующее задание.'
      ],
      lookTitle: 'Подсказка',
      look: 'Решение отвечает на «как?» и называет конкретную вещь. Потребность отвечает на «что нужно человеку?». Цель или проблема — «зачем бизнесу, что болит». Неизмеримое пожелание не проверить без чисел. Ограничение — то, что задано извне: сроки, очерёдность.'
    }),
    blank: () => ({ v: {}, q: [] }),
    reference: () => ({ v: Object.fromEntries(FRAGS.map(f => [f.id, f.ok])), q: quizRef(CONTRA_Q) }),
    render(el, ctx) {
      el.classList.add('rqw-root');
      const a = ctx.ans; a.v = a.v || {}; a.q = a.q || [];
      let pen = 'sol';
      let rv = null;
      if (ctx.result) { rv = {}; markEval(a.v).forEach(x => { if (!x.empty) rv[x.f.id] = x.s; }); }
      el.innerHTML = `<div class="stack">
        ${ctx.readonly ? '' : `<div class="stack tight"><div class="eyebrow">Маркеры</div><div class="rqw-pal" data-pal></div></div>`}
        <div data-mail></div>
        <div class="row between"><span class="small dim" data-cnt></span><span class="small dim">${TAGS.map(t => `<span style="white-space:nowrap"><i class="rqw-dot-${t.v}" style="display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:4px"></i>${esc(t.s)} — ${esc(t.t.toLowerCase())}</span>`).join(' · ')}</span></div>
        <div class="card flat" data-q></div>
      </div>`;
      function drawPal() {
        const p = TR.$('[data-pal]', el); if (!p) return;
        p.innerHTML = TAGS.concat([{ v: 'erase', t: 'Ластик', d: 'снять разметку' }]).map(t => `<button type="button" class="rqw-pen" data-pen="${t.v}" aria-pressed="${pen === t.v}"><i class="rqw-dot-${t.v}"></i><span>${esc(t.t)}<small>${esc(t.d)}</small></span></button>`).join('');
      }
      function drawMail() {
        TR.$('[data-mail]', el).innerHTML = letterHTML(a.v, rv);
        const n = FRAGS.filter(f => a.v[f.id]).length;
        TR.$('[data-cnt]', el).textContent = `Размечено ${n} из ${FRAGS.length}`;
      }
      function mark(id) {
        if (ctx.readonly) return;
        if (pen === 'erase' || a.v[id] === pen) delete a.v[id]; else a.v[id] = pen;
        if (rv) delete rv[id];
        ctx.save(); drawMail();
      }
      drawPal(); drawMail();
      TR.on(el, 'click', '[data-pen]', (e, b) => { pen = b.dataset.pen; drawPal(); });
      TR.on(el, 'click', '[data-f]', (e, b) => mark(b.dataset.f));
      TR.on(el, 'keydown', '[data-f]', (e, b) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); mark(b.dataset.f); } });
      ui.quiz(TR.$('[data-q]', el), Object.assign({}, CONTRA_Q, { value: a.q, readonly: ctx.readonly, reveal: ctx.result, onChange: v => { a.q = v; ctx.save(); } }));
    },
    check(ans) {
      const ev = markEval(ans && ans.v);
      const pts = ev.reduce((s, x) => s + x.pts, 0) / FRAGS.length;
      const q = ui.quizScore(CONTRA_Q, (ans && ans.q) || []);
      const crit = ev.filter(x => x.f.crit && x.s !== 'ok');
      const notes = [];
      const empty = ev.filter(x => x.empty);
      if (empty.length) notes.push({ ok: false, html: `Не размечено ${empty.length} из ${FRAGS.length}: ${empty.map(x => `«${esc(x.f.t)}»`).join(', ')}.` });
      ev.forEach(x => {
        if (x.s === 'bad' && !x.empty) notes.push({ ok: false, html: `«${esc(x.f.t)}» — размечено как «${esc(((TAG_T[x.got] || { t: String(x.got) }).t).toLowerCase())}». ${MHINT[x.f.ok]}` });
        else if (x.s === 'warn') notes.push({ ok: 'warn', html: `«${esc(x.f.t)}» — ${esc(x.why)}` });
        else if (x.info) notes.push({ ok: 'info', html: `«${esc(x.f.t)}» — засчитано: ${esc(x.why)}` });
      });
      if (!ev.some(x => x.s !== 'ok')) notes.push({ ok: true, html: 'Все семнадцать фрагментов размечены точно.' });
      notes.push(q.ok ? { ok: true, html: 'Противоречие найдено: два разных срока.' } : { ok: false, html: 'Противоречие: перечитайте последнюю строку письма. Может ли что-то случиться и «к», и «до» разных дат одновременно?' });
      const score = pts * 0.8 + q.score * 0.2;
      const solAsNeed = ev.filter(x => x.f.ok === 'sol' && (x.got === 'need' || x.got === 'goal')).length;
      return {
        ok: score >= 0.8 && !crit.length && q.ok, score, notes,
        summary: `Точно: ${ev.filter(x => x.s === 'ok').length} из ${FRAGS.length}, близко: ${ev.filter(x => x.s === 'warn').length}.`,
        mentor: crit.length ? 'Подставьте вместо «кнопки» и «Excel» другой способ — например, звонок кассиру или бумажный список. Если задача человека всё равно решается, перед вами не потребность, а один из способов.'
          : solAsNeed >= 2 ? 'Заказчик почти всегда говорит на языке решений. Если фраза называет конкретную вещь — кнопку, программу, образец, способ оплаты, — это способ, даже когда он очень разумный.' : null
      };
    },
    explain: `<p>В письме из семнадцати фрагментов только три говорят о потребностях и один — о боли бизнеса. Ещё три — рамки (сроки и очерёдность), а <b>десять — готовые решения и неизмеримые пожелания</b>. Это нормально: заказчик описывает то, что видит, — экраны и знакомые программы.</p>
      ${ui.table(['Фрагмент', 'Что это', 'Что за ним стоит'], [
        ['Приложение как у Додо', 'решение-образец', 'Что нравится в Додо? Скорее всего — заказ заранее и выдача без очереди'],
        ['красиво и быстро', 'пожелание', 'Быстро — сколько секунд и при какой нагрузке? Красиво — вопрос к дизайнеру, не к требованиям'],
        ['Кнопка «Заказать заранее»', 'решение', 'Потребность: забрать нужное без очереди, зная, что товар ждёт; цель — выручка +15 %'],
        ['клиент выбирает булки и время', 'потребность', 'Уже близко к пользовательскому требованию'],
        ['Оплата картой', 'решение', 'Потребность — заплатить удобно; Нина хочет и онлайн, и на месте'],
        ['Баллы, как в Спортмастере', 'решение', 'Зачем? Чтобы возвращались — это ещё предстоит выяснить'],
        ['технолог видел все заказы', 'потребность', 'Точнее: предзаказы попадают в план выпечки'],
        ['в Excel', 'решение', 'Excel — привычный инструмент, а не цель'],
        ['Выгрузка в 1С', 'решение', 'Олег Петрович сводит продажи руками 2 часа — цель 15 минут'],
        ['Торты через приложение', 'решение', 'Потребность — заказать торт и не потерять заказ'],
        ['а то теряем', 'проблема, цель', '2–3 сорванных торта в неделю; цель — ни одного к 8 Марта'],
        ['Доставку тоже / но можно потом', 'потребность / рамка', 'Очерёдность: не в первой версии'],
        ['всегда и без сбоев', 'пожелание', '«Всегда» не бывает: сколько процентов времени, когда можно обслуживать?'],
        ['Удобно для бабушек', 'пожелание', 'Кто эти покупатели, что у них есть и чего нет — смартфон, зрение?'],
        ['к Новому году / до 8 Марта', 'рамки, которые спорят', 'Какой срок настоящий и что к нему должно работать?']
      ])}
      <p>Важно: разметка — не приговор письму. Решение заказчика — подсказка, куда копать. Задача аналитика — не отбросить «кнопку», а понять, <b>зачем</b> она, и предложить способ, который решит задачу лучше. В следующем задании докопаемся до потребностей за кнопкой и Excel.</p>`,
    report: ans => {
      const ev = markEval(ans && ans.v);
      return ev.map(x => `- «${x.f.t}» → ${x.got && TAG_T[x.got] ? TAG_T[x.got].t : '—'} ${x.s === 'ok' ? '✓' : x.s === 'warn' ? '≈' : '✗'}`).join('\n') + `\nПротиворечие: ${ui.quizScore(CONTRA_Q, (ans && ans.q) || []).ok ? 'найдено' : 'не найдено'}.`;
    }
  };

  // =====================================================================
  // Практика 2. Лаборатория «Докопайтесь до потребности»
  // =====================================================================
  const KIND = {
    good: 'Хороший вопрос',
    sol: 'Вопрос о решении',
    lead: 'Наводящий вопрос',
    jargon: 'Жаргон не по адресу'
  };
  const DIG = {
    btn: {
      t: 'Кнопка «Заказать заранее»', who: 'nina', said: 'Кнопка «Заказать заранее»: клиент выбирает булки и время, когда заберёт.', solItem: 'Кнопка «Заказать заранее»', pat: 4,
      bye: 'Всё, у меня поставщик. Давайте в другой раз — и без этих ваших слов, пожалуйста.',
      qs: [
        { id: 'b1', k: 'good', rung: 'goal', t: 'Что сейчас происходит утром на Покровке, когда человек приходит за круассанами?', a: 'Очередь! С полвосьмого до девяти — человек восемь–двенадцать. А к девяти популярное заканчивается: круассанов нет, люди разворачиваются и уходят к конкурентам.', got: 'Проблема: утром очередь 8–12 человек, к 9:00 популярное заканчивается — клиенты уходят к конкурентам', why: 'вопрос о том, что происходит сейчас. О прошлом и настоящем люди рассказывают точнее, чем о будущем.' },
        { id: 'b2', k: 'good', rung: 'need', t: 'Что изменится для покупателя, если он сможет заказать заранее?', a: 'Придёт к своему времени, заберёт пакет и не будет стоять. И точно знает, что его круассаны его ждут, а не закончились.', got: 'Покупателю нужно: получить нужное к своему времени, без очереди, и быть уверенным, что товар его ждёт', why: 'вопрос о ценности для человека — прямой путь к потребности.' },
        { id: 'b3', k: 'good', rung: 'goal', t: 'Как вы через год поймёте, что предзаказ сработал?', a: 'Выручка вырастет — люди перестанут уходить. Рассчитываю процентов на пятнадцать за год, вместе с доставкой. И Галине Ивановне легче: будет заранее знать, сколько печь.', got: 'Цель: выручка сети +15 % за год (вместе с доставкой); цех заранее знает, сколько печь', why: 'вопрос о мере успеха превращает «хочу» в бизнес-цель с цифрой.' },
        { id: 'b4', k: 'good', rung: 'need', t: 'А сейчас кто-нибудь заказывает заранее? Как?', a: 'Торты — по телефону, кассир пишет в тетрадку. А булки никак: кто первый пришёл, того и круассан.', got: 'Сейчас заранее можно заказать только торт — по телефону, в тетрадь; выпечку — никак', why: 'вопрос о том, как задачу решают сегодня, показывает, что уже есть и чего не хватает.' },
        { id: 'b5', k: 'sol', t: 'Кнопку сделать зелёной, как у Додо, или в цветах «Колоса»?', a: 'Ой, ну это вы сами решите. Чтобы красиво.', why: 'вы остались на нижней ступени. Цвет кнопки — работа дизайнера, и для задачи Нины он неважен.', pd: -1 },
        { id: 'b6', k: 'lead', t: 'Вы же хотите, чтобы кнопка была прямо на главном экране?', a: 'Ну… да, наверное. Вам виднее.', got: '«Кнопка на главном экране» — Нина согласилась, но это ваша догадка, а не её потребность', gotRung: 'sol', why: '«да» ничего не значит — Нина согласилась бы с любым вариантом. Вы получили ложное подтверждение решения.', pd: -1 },
        { id: 'b7', k: 'jargon', t: 'Предзаказы принимать через REST API или через очередь сообщений?', a: 'Я не знаю, что это такое. Вы же специалисты — сделайте нормально.', why: 'Нина не знает этих слов и не должна. Такие решения принимает команда Димы.', pd: -2 }
      ],
      picks: {
        q: 'Какая формулировка — потребность за «кнопкой»?', seed: 'rqw-pick-btn',
        options: [
          { t: 'Покупатель может заранее заказать выпечку в своей пекарне к выбранному времени и забрать её без очереди, зная, что товар его ждёт', ok: 1, why: 'Да: кто, что хочет получить и зачем — и ни слова о кнопке. Кнопка — лишь один из способов.' },
          { t: 'На главном экране приложения есть заметная кнопка «Заказать заранее», как у Додо', why: 'Это всё то же решение — да ещё с местом и образцом. Потребности здесь нет.' },
          { t: 'Приложение должно быть быстрым и удобным', why: 'Неизмеримое пожелание и ни слова о том, что нужно покупателю.' },
          { t: 'Увеличить выручку сети на 15 % за 12 месяцев', half: 1, why: 'Это ступенька выше — бизнес-цель. Она отвечает «зачем бизнесу», но не говорит, что нужно покупателю.' }
        ]
      }
    },
    excel: {
      t: '«…в Excel»', who: 'galya', said: 'Чтобы технолог видел все заказы в Excel.', solItem: 'Все заказы — в Excel', pat: 4,
      bye: 'Мне пора в цех, у меня в три утра смена. Давайте в другой раз — и попроще.',
      qs: [
        { id: 'e1', k: 'good', rung: 'goal', t: 'Галина Ивановна, как вы сейчас решаете, сколько печь на завтра?', a: 'В 23:00 сажусь с Excel: смотрю продажи прошлой недели и правлю на глаз. Дождь — хлеба побольше, десертов поменьше. Ошибусь — вечером лишнее уходит в списание, а утром круассанов не хватает.', got: 'Проблема: план считают «на глаз» — вечером лишнее в списание, утром нехватка', why: 'вопрос о том, как работа идёт сейчас. Показывает настоящий процесс, а не мечту о нём.' },
        { id: 'e2', k: 'good', rung: 'need', t: 'Что вы будете делать с заказами, когда их увидите?', a: 'Сложу с планом. Руками: двадцать позиций по девяти точкам, к полуночи глаза слипаются. Мне главное — чтобы заказанное точно испекли, а лишнего не напекли.', got: 'Технологу нужно: чтобы предзаказы входили в план выпечки без ручного сложения и ошибок', why: 'вопрос «что вы будете делать с этим?» показывает, зачем человеку данные, — а это и есть потребность.' },
        { id: 'e3', k: 'good', rung: 'need', t: 'А если бы заказы сами попадали в план, без таблицы, — это бы вам подошло?', a: 'Если сами и без ошибок — да хоть без Excel. Мне таблица не нужна, мне нужен правильный план к 23:00.', got: 'Excel — привычный инструмент, а не цель: нужен правильный план к 23:00', why: 'вопрос «а если…» проверяет догадку, когда вы уже поняли, как человек работает. Он отделяет потребность от привычного инструмента.' },
        { id: 'e4', k: 'good', rung: 'goal', t: 'А что бывает, когда план ошибается?', a: 'Утром круассанов не хватает — Павел ругается. Вечером остаётся лишнее — пишем в списание. Нина Сергеевна говорит, списания — больше миллиона в месяц.', got: 'Цель: меньше списаний (сейчас больше миллиона рублей в месяц) и меньше нехватки по утрам', why: 'вопрос о последствиях выводит на деньги бизнеса — к цели.' },
        { id: 'e5', k: 'sol', t: 'Вам удобнее файл .xlsx или .csv?', a: 'Не знаю, какая разница. Чтобы открывалось.', why: 'вы уточняете решение, ещё не поняв задачу. Галина Ивановна не знает, чем отличаются форматы, — и не должна.', pd: -1 },
        { id: 'e6', k: 'lead', t: 'Вы ведь хотите видеть заказы в реальном времени, правда?', a: 'Ну… да, наверное. Хотя мне их к 23:00 надо, раньше-то зачем.', got: '«Заказы в реальном времени» — согласилась из вежливости, а нужно к 23:00', gotRung: 'sol', why: 'ответ подсказан в самом вопросе. Галина Ивановна согласилась из вежливости — и чуть не получила ненужную функцию.', pd: -1 },
        { id: 'e7', k: 'jargon', t: 'Выгрузку делать по расписанию через cron или по событию?', a: 'Я не понимаю, о чём вы. Мне план нужен к 23:00, остальное — ваше дело.', why: 'технолог не обязан знать слова разработчиков. Как запускать выгрузку, решит команда Димы.', pd: -2 }
      ],
      picks: {
        q: 'Какая формулировка — потребность за «Excel»?', seed: 'rqw-pick-xl',
        options: [
          { t: 'Предзаказы на завтра автоматически попадают в план выпечки к 23:00, чтобы технолог не сводил их вручную и ничего не терялось', ok: 1, why: 'Да: что нужно, кому и зачем. Excel не упомянут — и не нужен, если план считается сам.' },
          { t: 'Система каждые 5 минут выгружает все заказы в файл Excel для технолога', why: 'Это тот же Excel, только подробнее. Галине Ивановне нужна не таблица, а правильный план.' },
          { t: 'Технолог видит все заказы', half: 1, why: 'Ближе, но «видеть» — не то, что ей нужно. Что она делает с заказами после того, как увидела?' },
          { t: 'Снизить списания с 12 % до 7 % за 12 месяцев', half: 1, why: 'Это ступенька выше — бизнес-цель Нины. А что нужно самой Галине Ивановне?' }
        ]
      }
    }
  };
  const DIG_RUNGS = [
    { id: 'goal', t: 'Цель и проблема бизнеса', sub: 'зачем это бизнесу' },
    { id: 'need', t: 'Потребность', sub: 'что нужно человеку' },
    { id: 'sol', t: 'Решение', sub: 'что сказано в письме' }
  ];
  const patLeft = (T, asked) => T.pat + asked.reduce((s, id) => s + ((T.qs.find(q => q.id === id) || {}).pd || 0), 0);
  function trackEval(tid, a) {
    const T = DIG[tid], asked = (((a && a.asked) || {})[tid] || []).filter(id => T.qs.some(q => q.id === id));
    const qs = asked.map(id => T.qs.find(q => q.id === id));
    const need = qs.some(q => q.k === 'good' && q.rung === 'need');
    const goal = qs.some(q => q.k === 'good' && q.rung === 'goal');
    const bad = qs.filter(q => q.k !== 'good').length;
    const pi = ((a && a.pick) || {})[tid];
    const o = pi != null ? T.picks.options[pi] : null;
    const pick = o ? (o.ok ? 1 : o.half ? 0.4 : 0) : 0;
    const score = Math.max(0, (need ? 0.3 : 0) + (goal ? 0.2 : 0) + pick * 0.5 - bad * 0.05);
    return { T, need, goal, bad, pick, picked: !!o, score, qs };
  }
  const digTask = {
    id: 'dig', title: 'Лаборатория: докопайтесь до потребности',
    simple: howChain.simple,
    lead: ui.brief({
      situation: 'После разметки Ксения: «Два главных решения в письме — кнопка и Excel. Позвоните Нине Сергеевне про кнопку, а Галине Ивановне — про Excel: она как раз пришла на смену. У каждой есть минут десять, терпение не бесконечное. Поднимитесь от решения к потребности и к цели — и сформулируйте потребность одной фразой».',
      todo: [
        'Выберите, что раскапываете: «Кнопка» (разговор с Ниной) или «Excel» (разговор с Галиной Ивановной).',
        'Задавайте вопросы из списка «Ваш следующий вопрос». Читайте ответ и пометку под ним. Справа — лестница: что вы уже выяснили на каждой ступени, и шкала терпения собеседника.',
        'Терпение кончилось — разговор окончен. Можно начать заново, но в жизни второй попытки обычно нет.',
        'Под разговором выберите формулировку потребности. Повторите для второго решения и нажмите «Проверить». Засчитывается от 75 %, если в обоих разговорах вы дошли до потребности и выбрали её точную формулировку.'
      ],
      look: 'Зелёная ступень — вы её достигли. Хорошие вопросы поднимают вас вверх, вопросы о решении, наводящие и на жаргоне тратят терпение и ничего не дают, а наводящий ещё и кладёт на нижнюю ступень ложную «договорённость» — она подсвечена оранжевым.'
    }),
    blank: () => ({ tr: 'btn', asked: { btn: [], excel: [] }, pick: {} }),
    reference: () => ({ tr: 'btn', asked: { btn: ['b1', 'b2', 'b3'], excel: ['e1', 'e2', 'e3'] }, pick: { btn: quizRef(DIG.btn.picks)[0], excel: quizRef(DIG.excel.picks)[0] } }),
    render(el, ctx) {
      el.classList.add('rqw-root');
      const a = ctx.ans;
      a.asked = a.asked || {}; a.asked.btn = a.asked.btn || []; a.asked.excel = a.asked.excel || []; a.pick = a.pick || {};
      let tr = a.tr === 'excel' ? 'excel' : 'btn';
      el.innerHTML = `<div class="stack">
        <div class="stack tight"><div class="eyebrow">Что раскапываем</div>${ui.seg('tr', [{ v: 'btn', t: 'п. 2 · Кнопка «Заказать заранее» — Нина Сергеевна' }, { v: 'excel', t: 'п. 5 · «…в Excel» — Галина Ивановна' }], tr, 'accent')}</div>
        <div data-track></div>
      </div>`;
      const box = TR.$('[data-track]', el);
      function drawTrack() {
        box.innerHTML = '';
        const d = document.createElement('div'); box.appendChild(d);
        const T = DIG[tr], asked = a.asked[tr], pat = patLeft(T, asked), P = TR.PEOPLE[T.who];
        const ev = trackEval(tr, a);
        const qs = ev.qs;
        const items = { sol: [{ t: T.solItem }], need: [], goal: [] };
        qs.forEach(q => { if (q.got) items[q.k === 'good' ? q.rung : (q.gotRung || 'sol')].push({ t: q.got, decoy: q.k !== 'good' }); });
        const reached = { sol: true, need: ev.need, goal: ev.goal };
        const chat = qs.map(q => ui.say('me', esc(q.t)) + ui.say(T.who, esc(q.a)) + `<div class="rqw-kind ${q.k}"><b>${KIND[q.k]}:</b> ${esc(q.why)}</div>`).join('');
        // порядок вопросов перемешан, но стабилен: хорошие не должны стоять первыми
        const left = TR.shuffle(T.qs, 'rqw-dig-' + tr).filter(q => !asked.includes(q.id));
        d.innerHTML = `<div class="stack">
          <div class="rqw-dig">
            <div class="stack">
              <div class="rqw-chat">${ui.say(T.who, '<span class="small dim">Из письма:</span> «' + esc(T.said) + '»')}${chat}${pat <= 0 ? ui.say(T.who, esc(T.bye)) : ''}</div>
              ${ctx.readonly ? '' : `<div class="stack tight"><div class="eyebrow">Ваш следующий вопрос</div>${pat <= 0 ? ui.note('bad', 'Разговор окончен', 'Терпение собеседника кончилось. Начните заново и задавайте вопросы о его работе и задачах, а не о кнопках и технологиях.') : `<div class="rqw-qs">${left.map(q => `<button type="button" class="btn sm" data-q="${q.id}">${esc(q.t)}</button>`).join('')}</div>`}
                ${asked.length ? '<div><button type="button" class="btn ghost sm" data-restart>⟲ Начать разговор заново</button></div>' : ''}</div>`}
            </div>
            <div class="stack">
              <div class="stat"><span class="k">Терпение · ${esc(P.name)}</span>${ui.meter(Math.max(0, pat) / T.pat, pat >= 3 ? '' : pat >= 2 ? 'warn' : 'bad')}<span class="s">${Math.max(0, pat)} из ${T.pat}</span></div>
              <div class="rqw-rungs">${DIG_RUNGS.map(r => `<div class="rqw-rg ${r.id === 'sol' ? 'sol' : reached[r.id] ? 'on' : ''}"><span class="t">${esc(r.t)} · ${esc(r.sub)}</span>${items[r.id].length ? `<ul>${items[r.id].map(x => `<li class="${x.decoy ? 'decoy' : ''}">${esc(x.t)}</li>`).join('')}</ul>` : '<span class="small dim">пока пусто</span>'}</div>`).join('<div class="rqw-arr">↑</div>')}</div>
            </div>
          </div>
          <div class="card flat" data-pick></div>
        </div>`;
        ui.quiz(TR.$('[data-pick]', d), Object.assign({}, T.picks, {
          value: a.pick[tr] != null ? [a.pick[tr]] : [], readonly: ctx.readonly, reveal: ctx.result ? true : null,
          onChange: v => { a.pick[tr] = v[0]; ctx.save(); ctx.decide('Потребность за «' + T.t + '»', plainT(T.picks.options[v[0]].t)); }
        }));
      }
      ui.onSeg(el, (n, v) => { if (n !== 'tr') return; tr = v; if (!ctx.readonly) { a.tr = v; ctx.save(); } drawTrack(); });
      TR.on(el, 'click', '[data-q]', (e, b) => {
        if (ctx.readonly) return;
        const T = DIG[tr], asked = a.asked[tr];
        if (patLeft(T, asked) <= 0 || asked.includes(b.dataset.q)) return;
        asked.push(b.dataset.q); ctx.save(); drawTrack();
      });
      TR.on(el, 'click', '[data-restart]', () => { if (ctx.readonly) return; a.asked[tr] = []; ctx.save(); drawTrack(); });
      drawTrack();
    },
    check(ans) {
      const A = trackEval('btn', ans), B = trackEval('excel', ans);
      const score = (A.score + B.score) / 2;
      const notes = [];
      [['Кнопка', A, 'покупателя'], ['Excel', B, 'технолога']].forEach(([nm, X, whom]) => {
        if (!X.qs.length) { notes.push({ ok: false, html: `${nm}: разговора ещё не было. Начните с того, как работа идёт сейчас.` }); }
        else {
          if (!X.need) notes.push({ ok: false, html: `${nm}: вы ещё не поднялись до потребности. Спросите, что изменится для ${whom} и что человек будет делать с результатом.` });
          if (!X.goal) notes.push({ ok: 'warn', html: `${nm}: не хватает верхней ступени — что болит у бизнеса сейчас и как поймём, что стало лучше.` });
          if (X.bad) notes.push({ ok: 'warn', html: `${nm}: ${X.bad} ${TR.plural(X.bad, 'вопрос ушёл', 'вопроса ушли', 'вопросов ушли')} вниз или вбок — о решении, наводящий или на жаргоне. Собеседник ответил, но потребность от этого не прояснилась.` });
        }
        if (!X.picked) notes.push({ ok: false, html: `${nm}: формулировка потребности не выбрана.` });
        else if (X.pick === 0.4) notes.push({ ok: 'warn', html: `${nm}: выбранная формулировка — ступенька выше или в сторону. Что нужно самому человеку — без процентов и без «видеть»?` });
        else if (X.pick === 0) notes.push({ ok: false, html: `${nm}: в выбранной формулировке всё ещё спрятан способ или пожелание. Уберите «как» и оставьте «что и зачем».` });
        if (X.need && X.goal && X.pick === 1 && !X.bad) notes.push({ ok: true, html: `${nm}: от решения до потребности и цели — пройдено чисто.` });
      });
      return {
        ok: score >= 0.75 && A.pick === 1 && B.pick === 1 && A.need && B.need, score, notes,
        summary: `Кнопка: ${Math.round(A.score * 100)} %, Excel: ${Math.round(B.score * 100)} %.`,
        mentor: (A.bad + B.bad) >= 3 ? 'Заметили, что вопросы о решении и технологиях ничего не дали? Люди хорошо знают свою работу и свою боль — спрашивайте о них. О кнопках и форматах команда решит сама, когда поймёт задачу.' : null
      };
    },
    explain: `<p>За двумя решениями из письма — две разные потребности:</p>
      ${ui.table(['Сказано', 'Потребность', 'Цель бизнеса'], [
        ['Кнопка «Заказать заранее»', 'Покупатель заранее заказывает выпечку в своей пекарне к выбранному времени и забирает без очереди, зная, что товар его ждёт', 'Выручка +15 % за год (БЦ-2): клиенты перестают уходить к конкурентам'],
        ['…в Excel', 'Предзаказы сами попадают в план выпечки к 23:00 — технолог не сводит их руками', 'Списания с 12 % до 7 % (БЦ-1): лишнего не пекут, нужное — пекут']
      ])}
      <ul class="checks">
        <li><b>Работают вопросы о настоящем и о пользе:</b> «что сейчас происходит?», «что вы будете делать с этим?», «что изменится?», «как поймём, что сработало?».</li>
        <li><b>Не работают</b> вопросы о решении («какого цвета кнопка»), наводящие («вы же хотите…?») и жаргон («REST или очередь?»). Первые оставляют вас внизу, вторые дают ложное «да», третьи сжигают терпение.</li>
        <li><b>«А если бы…?»</b> хорош, когда вы уже поняли работу человека: им проверяют догадку. Галина Ивановна сама сказала, что Excel ей не нужен, — нужен правильный план.</li>
      </ul>
      <p>Обратите внимание: Excel оказался вовсе не нужен, а «кнопка» — лишь один из способов. В первой версии предзаказ можно будет сделать и через кассира по телефону — для тех, у кого нет смартфона. Вопросы подробно разберём на неделе 3; техника «5 почему» — родом из производственной системы Тойоты.</p>`,
    report: ans => ['btn', 'excel'].map(tid => {
      const X = trackEval(tid, ans), T = DIG[tid];
      const pi = ((ans && ans.pick) || {})[tid];
      return `**${T.t}** (${TR.PEOPLE[T.who].name}): вопросов ${X.qs.length}, плохих ${X.bad}; потребность ${X.need ? 'достигнута' : 'не достигнута'}, цель ${X.goal ? 'достигнута' : 'не достигнута'}.\n` +
        X.qs.map(q => `- ${q.t} — ${KIND[q.k]}`).join('\n') + `\nФормулировка: ${pi != null ? plainT(T.picks.options[pi].t) : '—'} ${X.pick === 1 ? '✓' : X.pick ? '≈' : '✗'}`;
    }).join('\n\n')
  };

  // =====================================================================
  // Практика 3. Разложите требования «Колоса» по уровням
  // =====================================================================
  const LB = [
    { id: 'biz', t: 'Бизнес-требование', sub: 'зачем бизнесу: цель в цифрах' },
    { id: 'user', t: 'Пользовательское', sub: 'что человек хочет сделать' },
    { id: 'func', t: 'Функциональное', sub: 'что делает система' },
    { id: 'side', t: 'Сбоку от лестницы', sub: 'качество, правило, ограничение, интерфейс' },
    { id: 'trans', t: 'Переходное', sub: 'нужно только на время перехода (BABOK)' }
  ];
  const LHINT = {
    biz: 'Есть ли здесь цифра и срок, понятные владелице? Это про то, зачем проект бизнесу, — или про то, что делает человек или система?',
    user: 'Кто здесь хочет что-то сделать? Есть ли слово «система» — или пока только человек и его задача?',
    func: 'Кто здесь действует — человек или система? «Система показывает / добавляет / передаёт» — это какая ступень?',
    side: 'Это действие системы — или правило, число качества, закон, которые действуют сразу на многих ступенях?',
    trans: 'Будет ли это нужно через год после запуска? Или только на время перехода со старого способа работы на новый?'
  };
  const LCARDS = [
    { id: 'c-waste', t: 'Снизить списания выпечки с 12 % до 7 % за 12 месяцев', ok: 'biz' },
    { id: 'c-cakes', t: 'Ни одного потерянного заказа торта к 8 Марта 2027', ok: 'biz' },
    { id: 'c-recon', t: 'Сократить ручную сверку продаж с 2 часов до 15 минут в день', ok: 'biz' },
    { id: 'c-u-buy', t: 'Покупатель хочет заранее заказать выпечку в своей пекарне к удобному времени и забрать без очереди', ok: 'user' },
    { id: 'c-u-plan', t: 'Технолог хочет, чтобы предзаказы сами попадали в план выпечки и их не нужно было сводить вручную', ok: 'user' },
    { id: 'c-u-phone', t: 'Кассир хочет оформить предзаказ за покупателя, который звонит по телефону', ok: 'user', alt: { func: 'Почти: из этого вырастет функция «экран кассира: оформить заказ за покупателя». Но в такой формулировке действует человек и говорит, что хочет сделать.' } },
    { id: 'c-f-slot', t: 'Система показывает покупателю получасовые интервалы выдачи с 07:00 до 21:00 в выбранной пекарне', ok: 'func' },
    { id: 'c-f-plan', t: 'Система в 23:00 добавляет оплаченные предзаказы на завтра к плану выпечки цеха', ok: 'func' },
    { id: 'c-f-1c', t: 'Система формирует сводку продаж за день и передаёт её в 1С до 09:00 следующего дня', ok: 'func', alt: { side: 'Обмен с 1С — это и внешний интерфейс, верно. Но фраза описывает действие системы: «формирует и передаёт».' } },
    { id: 'c-s-cutoff', t: 'Заказ на завтра принимается до 22:30', ok: 'side', alt: { func: 'Из правила вырастет функция «система не принимает заказ на завтра после 22:30». Но сама фраза — правило бизнеса: оно действовало бы и с тетрадью вместо программы.' } },
    { id: 'c-s-speed', t: '95 % ответов приложения — быстрее 1 секунды при 400 заказах в час', ok: 'side' },
    { id: 'c-s-54', t: 'При предоплате пробивается чек «предоплата», при выдаче — чек полного расчёта (54-ФЗ)', ok: 'side' },
    { id: 'c-t-book', t: 'Перенести в систему заказы тортов из тетради, принятые до запуска', ok: 'trans' },
    { id: 'c-t-train', t: 'Обучить кассиров всех 9 пекарен работе с экраном выдачи до 1 марта', ok: 'trans' }
  ];
  const BAB_ROWS = [
    { id: 'm-biz', t: 'Бизнес-требования', ok: 'b-biz' },
    { id: 'm-user', t: 'Пользовательские требования', ok: 'b-sh' },
    { id: 'm-func', t: 'Функциональные требования', ok: 'b-sf' },
    { id: 'm-nfr', t: 'Нефункциональные требования (атрибуты качества)', ok: 'b-snf' }
  ];
  const BAB_CH = [
    { v: 'b-biz', t: 'Бизнес-требования' },
    { v: 'b-sh', t: 'Заинтересованных лиц' },
    { v: 'b-sf', t: 'К решению: функциональные' },
    { v: 'b-snf', t: 'К решению: нефункцион.' },
    { v: 'b-tr', t: 'Переходные' }
  ];
  function levelsEval(v) {
    v = v || {};
    return LCARDS.map(c => {
      const got = v[c.id];
      if (got === c.ok) return { c, s: 'ok', pts: 1, got };
      if (c.alt && c.alt[got]) return { c, s: 'warn', pts: 0.5, got, why: c.alt[got] };
      return { c, s: 'bad', pts: 0, got, empty: !got };
    });
  }
  const levelsTask = {
    id: 'levels', title: 'Разложите требования «Колоса» по уровням',
    simple: howLevels.simple,
    lead: ui.brief({
      situation: 'Ксения собрала первый черновик требований «Колоса» — из письма Нины, ваших разговоров и договора. Дима: «Мне нужно видеть, что откуда растёт: какие цели, чьи задачи, что делает система и что висит сбоку. Иначе я не пойму, что можно отложить без вреда для целей». А в шаблоне «Колоса» оказались термины BABOK — надо сопоставить.',
      todo: [
        'Разложите 14 карточек по пяти корзинам: нажмите карточку, потом корзину (на компьютере можно перетаскивать).',
        'Для каждой спросите себя: кто здесь действует — бизнес, человек или система? Это правило, качество или закон? Понадобится ли это через год?',
        'Ниже сопоставьте ступени Вигерса с классами BABOK — выберите класс в каждой строке.',
        'Нажмите «Проверить». Засчитывается от 80 %. Где карточка честно стоит на границе двух ступеней, второй ответ засчитывается наполовину — с пояснением.'
      ],
      lookTitle: 'Подсказка',
      look: 'Бизнес-требование — цифра и срок для бизнеса. Пользовательское — «человек хочет…». Функциональное — «система делает…». Сбоку — правило, число качества, закон. Переходное — только на время перехода.'
    }),
    blank: () => ({ v: {}, m: {} }),
    reference: () => ({ v: Object.fromEntries(LCARDS.map(c => [c.id, c.ok])), m: Object.fromEntries(BAB_ROWS.map(r => [r.id, r.ok])) }),
    render(el, ctx) {
      el.classList.add('rqw-root');
      const a = ctx.ans; a.v = a.v || {}; a.m = a.m || {};
      let reveal = null, mrev = null;
      if (ctx.result) {
        reveal = {}; levelsEval(a.v).forEach(x => { reveal[x.c.id] = x.s; });
        mrev = {}; BAB_ROWS.forEach(r => { if (a.m[r.id]) mrev[r.id] = { s: a.m[r.id] === r.ok ? 'ok' : 'bad', why: a.m[r.id] === r.ok ? '' : 'Вспомните переключатель «Вигерс / BABOK» на лестнице библиотеки.' }; });
      }
      el.innerHTML = `<div class="stack"><div data-sort></div><div class="eyebrow">Вигерс ↔ BABOK: как называется та же ступень в BABOK?</div><p class="small dim">В списке — классы BABOK: бизнес-требования, требования заинтересованных лиц, требования к решению (функциональные и нефункциональные), переходные требования.</p><div data-match></div></div>`;
      ui.sort(TR.$('[data-sort]', el), { items: LCARDS.map(c => ({ id: c.id, t: c.t })), buckets: LB, value: a.v, reveal, readonly: ctx.readonly, seed: 'rqw-levels', onChange: v => { a.v = v; ctx.save(); } });
      ui.match(TR.$('[data-match]', el), { rows: BAB_ROWS.map(r => ({ id: r.id, t: `<b>${esc(r.t)}</b> <span class="small dim">(Вигерс)</span>` })), choices: BAB_CH, value: a.m, reveal: mrev, readonly: ctx.readonly, placeholder: 'Класс в BABOK…', onChange: v => { a.m = v; ctx.save(); } });
    },
    check(ans) {
      const ev = levelsEval(ans && ans.v);
      const sortS = ev.reduce((s, x) => s + x.pts, 0) / LCARDS.length;
      const m = (ans && ans.m) || {};
      const mOk = BAB_ROWS.filter(r => m[r.id] === r.ok).length;
      const notes = [];
      ev.forEach(x => {
        if (x.s === 'warn') notes.push({ ok: 'warn', html: `«${esc(x.c.t)}» — ${esc(x.why)}` });
        else if (x.s === 'bad') notes.push({ ok: false, html: `«${esc(x.c.t)}» — ${x.empty ? 'не разложено. ' : ''}${LHINT[x.c.ok]}` });
      });
      if (ev.every(x => x.s === 'ok')) notes.push({ ok: true, html: 'Все четырнадцать карточек — на своих ступенях.' });
      if (mOk === BAB_ROWS.length) notes.push({ ok: true, html: 'Вигерс и BABOK сопоставлены верно.' });
      else notes.push({ ok: false, html: `Сопоставление с BABOK: верно ${mOk} из ${BAB_ROWS.length}. Подсказка: у BABOK пользователи — лишь часть «заинтересованных лиц», а функциональные и нефункциональные — две половины одного класса.` });
      const score = sortS * 0.75 + (mOk / BAB_ROWS.length) * 0.25;
      const userAsFunc = ev.filter(x => (x.c.ok === 'user' && x.got === 'func') || (x.c.ok === 'func' && x.got === 'user')).length;
      return {
        ok: score >= 0.8, score, notes,
        summary: `Карточки: точно ${ev.filter(x => x.s === 'ok').length} из ${LCARDS.length}, близко ${ev.filter(x => x.s === 'warn').length}. BABOK: ${mOk} из ${BAB_ROWS.length}.`,
        mentor: userAsFunc >= 2 ? 'Самая частая путаница — пользовательское и функциональное. Посмотрите на подлежащее: «покупатель хочет…» — это задача человека; «система показывает…» — это уже ответ системы на неё.' : null
      };
    },
    explain: `<p>Лестница «Колоса» на одном примере — предзаказ:</p>
      <ul class="checks">
        <li><b>Бизнес-требования</b> — цели Нины в цифрах: списания 12 % → 7 %, ни одного потерянного торта к 8 Марта, сверка 15 минут вместо 2 часов. Они отвечают на «зачем бизнесу» и потом станут мерой успеха проекта.</li>
        <li><b>Пользовательские</b> — задачи людей: покупатель хочет заказать заранее, технолог — получать предзаказы в плане, кассир — оформить заказ за того, кто звонит.</li>
        <li><b>Функциональные</b> — что делает система: показывает интервалы, добавляет предзаказы в план в 23:00, отправляет сводку в 1С.</li>
        <li><b>Сбоку</b> — правило 22:30 (бизнес-правило), 95 % ответов быстрее секунды (атрибут качества), чеки по 54-ФЗ (закон — у Вигерса это тоже разновидность бизнес-правил, в каноне «Колоса» — ограничение).</li>
        <li><b>Переходные</b> (BABOK) — перенести заказы из тетради и обучить кассиров. Через год они не нужны, но без них запуск 1 марта сорвётся.</li>
      </ul>
      <p>Зачем Диме эта лестница: если функцию можно отложить и ни одна цель от этого не пострадает — её откладывают первой. А если у функции нет «родителя» наверху — стоит спросить, зачем она вообще. Связь «цель → задача → функция» называют <b>трассировкой</b>; подробно — в четверг, «Жизнь требования».</p>`,
    report: ans => levelsEval(ans && ans.v).map(x => `- ${x.c.t} → ${(LB.find(b => b.id === x.got) || { t: '—' }).t} ${x.s === 'ok' ? '✓' : x.s === 'warn' ? '≈' : '✗'}`).join('\n') +
      '\nВигерс ↔ BABOK:\n' + BAB_ROWS.map(r => `- ${r.t} → ${(BAB_CH.find(c => c.v === ((ans && ans.m) || {})[r.id]) || { t: '—' }).t} ${((ans && ans.m) || {})[r.id] === r.ok ? '✓' : '✗'}`).join('\n')
  };

  // =====================================================================
  // Практика 4. Ответьте Нине Сергеевне
  // =====================================================================
  const NINA_RUBRIC = [
    'Благодарит и показывает, что письмо полезно: в нём видно, что болит — очереди, пустая витрина к 9 утра, потерянные торты, ручная сверка',
    'Без жаргона объясняет, что часть пунктов — уже готовые способы (кнопка, Excel, «как у Додо») и команде важно понять, что за ними стоит, чтобы не сделать «то, да не то»',
    'Приводит пример «зачем»: Excel нужен, чтобы предзаказы попали в план выпечки, — если они будут попадать туда сами, таблица может и не понадобиться',
    'Говорит, что «всегда без сбоев», «быстро» и «удобно для бабушек» нужно превратить в цифры и условия, иначе работу нельзя ни оценить, ни проверить',
    'Замечает спор сроков (Новый год или 8 Марта) и предлагает конкретный следующий шаг — короткую встречу с понятной целью'
  ];
  const NINA_REF = 'Нина Сергеевна, спасибо за письмо — по нему сразу видно, что болит: утренние очереди, к девяти пустая витрина, теряются торты, Олег Петрович каждое утро два часа сводит продажи. Часть пунктов — уже готовые способы: кнопка, Excel, «как у Додо». Мы их не отбрасываем, но хотим понять, что за ними стоит, чтобы не сделать «то, да не то». Например, Excel для Галины Ивановны: если предзаказы будут сами попадать в план выпечки к 23:00, таблица ей, возможно, вообще не понадобится — и сводить руками ничего не придётся. А «всегда без сбоев» и «удобно для бабушек» нужно превратить в цифры и условия: сколько времени система обязана работать, кто ваши покупатели постарше и что у них есть, — иначе мы не сможем ни честно оценить работу, ни проверить её. И сроки: в письме и Новый год, и 8 Марта — важно понять, что к какой дате должно работать. Предлагаю встречу на 40 минут на этой неделе: пройдём по вашим пунктам, и после неё Игорь даст оценку.';
  const ninaTask = {
    id: 'nina', title: 'Ответьте Нине Сергеевне',
    simple: {
      icon: '✉️',
      plain: 'Заказчик не обязан писать требования — это ваша работа. Ему нужно понять, зачем вам вопросы, и почувствовать, что его услышали.',
      analogy: 'Покупательница принесла кондитеру фото торта из журнала: «Хочу такой». Хороший кондитер не скажет «это не заказ». Он похвалит выбор и спросит: на сколько гостей, к какому дню, что именно нравится — цвет, ярусы, ягоды?',
      tech: 'Ответ заказчику на «ТЗ»: признать ценность (боли и цели видны), объяснить разницу между решением и потребностью на его языке, привести пример из его же письма, назвать, что нужно уточнить (неизмеримое, противоречия), и предложить конкретный следующий шаг (встреча, цель, время). Без жаргона и без «вы неправильно написали».'
    },
    lead: ui.brief({
      situation: 'Ксения отправила Нине Сергеевне короткое письмо: «Прежде чем оценивать, хотим уточнить пару вещей». Через 10 минут — ответ в чате проекта. Игорь: «Ответьте вы — спокойно и по-человечески. Цель — чтобы она согласилась на встречу на 40 минут на этой неделе».',
      todo: [
        'Прочитайте сообщение Нины.',
        'Напишите ответ: 6–9 предложений, от 250 символов. Без слов «требование», «функциональный», «потребность» через строчку — говорите на её языке.',
        'Нажмите «Проверить с Ксенией (Claude)» или «Сверить с эталоном самому» и честно отметьте раскрытые пункты. Засчитывается от 60 %.'
      ],
      lookTitle: 'На что опереться',
      look: 'Разметка письма: где решения, где пожелания, где спорят сроки. Лаборатория: Excel Галине Ивановне не нужен — нужен правильный план к 23:00; кнопка — способ, а потребность — забрать без очереди и быть уверенным, что товар ждёт.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: NINA_REF, self: NINA_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('rqw-root');
      el.insertAdjacentHTML('beforeend', ui.say('nina', 'Я же всё написала, десять пунктов! Что там непонятного? Почему нельзя сразу делать? Опять вопросы, опять встречи — а время идёт.'));
      const j = document.createElement('div'); j.style.marginTop = '12px'; el.appendChild(j);
      ui.justify(j, {
        id: 'rqw-nina', q: 'Ответ Нине: зачем уточнять, если «всё написано»?', qPlain: 'Ответьте владелице сети пекарен на её сообщение «Я же всё написала, десять пунктов, почему нельзя сразу делать?». Объясните без жаргона, зачем уточнять письмо-«ТЗ», где в нём готовые решения и неизмеримые пожелания, приведите пример из её письма и предложите следующий шаг — короткую встречу.',
        rubric: NINA_RUBRIC, reference: NINA_REF, value: ctx.ans.j, readonly: ctx.readonly, minLen: 250,
        onChange: v => { ctx.ans.j = v; ctx.save(); ctx.decide('Ответ Нине на «ТЗ»', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j);
      return {
        ok: s >= 0.6, score: s,
        summary: s ? `Оценка ответа: ${Math.round(s * 100)} %.` : 'Напишите ответ (от 250 символов) и проверьте его с Ксенией или сверьте с эталоном сами.',
        notes: s && s < 0.6 ? [{ ok: false, html: 'Нина услышит не «ваше ТЗ плохое», а «вас поняли, и вот зачем мы спрашиваем». Возьмите пример из её же письма — кнопку или Excel — и покажите, что за ним стоит и что она выиграет от уточнения.' }] : []
      };
    },
    explain: '<p>Сильный ответ строится в четыре хода: <b>признать</b> (письмо полезно — видно, что болит), <b>объяснить на примере из её письма</b> (Excel → правильный план к 23:00), <b>назвать, что уточнить</b> («всегда», «удобно», два срока) и <b>предложить шаг</b> (встреча на 40 минут с понятной целью и результатом — оценкой от Игоря).</p><p>Чего избегать: «ваше ТЗ — не ТЗ», «нам нужны функциональные требования», «вы неправильно сформулировали». Нина — заказчик и спонсор, а не студентка. Письмо-«ТЗ» — нормальная первая точка: превратить его в требования — работа аналитика. Как вести такую встречу и задавать вопросы, разберём на неделе 3.</p>',
    report: ans => (ans.j && ans.j.text) ? ans.j.text : '—'
  };

  // =====================================================================
  TR.stage({
    id: ID, act: 2, order: 110, slot: 'Пн 10:00', title: 'Потребность и решение',
    when: 'понедельник, 12 октября, 10:00 · переговорная «Квант Софт»',
    intro: [
      { who: 'igor', html: 'Доброе утро! Нина Сергеевна прислала «ТЗ» — так она назвала письмо на полстраницы. Десять пунктов и сроки. Пишет: «Тут всё понятно, начинайте». Дима уже спрашивает, когда будет оценка.' },
      { who: 'dima', html: 'Я прочитал. «Как у Додо», «всегда без сбоев», «удобно для бабушек»… Это я оценить не могу. Что из этого вообще задача?' },
      { who: 'ksenia', html: 'Вот и разберёмся. Сегодня — что такое требование и чем оно отличается от готового решения, которое заказчик принёс с собой. Разметим письмо Нины, докопаемся до того, что ей на самом деле нужно, и разложим требования по уровням.' }
    ],
    facts: [],
    glossary: [
      { term: 'Требование', simple: 'Бланк заказа торта: шоколадный, на 12 человек, надпись, к субботе 15:00, без орехов. Без любой части — торт не тот.', tech: 'Записанное условие или возможность, нужные человеку для решения задачи или которыми должна обладать система (IEEE 610.12, ISO/IEC/IEEE 24765). По BABOK v3 — «пригодное к использованию представление потребности».' },
      { term: 'Потребность', simple: 'Не сверло, а отверстие — и даже не отверстие, а полка для книг.', tech: 'Проблема или возможность, которую нужно решить (BABOK v3). То, что человеку на самом деле нужно, — в отличие от способа, который он предлагает.' },
      { term: 'Решение', simple: 'Конкретный способ: сверло на 8 мм, кнопка, Excel.', tech: 'Конкретный способ удовлетворить потребность. Заказчик часто приносит готовое решение; аналитик выясняет потребность за ним и оставляет выбор способа команде, предлагая варианты.' },
      { term: 'Бизнес-требование', simple: 'Зачем хозяйке пекарни проект: «списания — с 12 % до 7 % за год».', tech: 'Верхний уровень по Вигерсу: цели и выгоды бизнеса, ради которых создаётся система, — измеримо и со сроком. В «Колосе» это БЦ-1…БЦ-4.' },
      { term: 'Пользовательское требование', simple: 'Что человек хочет сделать: «заказать заранее и забрать без очереди».', tech: 'Средний уровень по Вигерсу: задачи, которые пользователи должны уметь выполнить с помощью системы. Записывают сценариями использования или пользовательскими историями.' },
      { term: 'Требование заинтересованного лица', simple: 'Чего хочет каждый, кого касается проект, — не только покупатель, но и бухгалтер, и технолог.', tech: 'Класс BABOK v3: потребности конкретных заинтересованных лиц, которые должно удовлетворить решение. Мост между бизнес-требованиями и требованиями к решению.' },
      { term: 'Требование к решению', simple: 'Что именно и насколько хорошо должна делать система.', tech: 'Класс BABOK v3: характеристики решения — функциональные (что делает) и нефункциональные (насколько хорошо, при каких условиях).' },
      { term: 'Переходное требование', simple: 'Временные леса на стройке: нужны только пока переезжаем со старого на новое.', tech: 'Класс BABOK v3: что нужно для перехода от текущего состояния к будущему и не нужно после — перенос данных, обучение, параллельная работа старого и нового способа.' },
      { term: 'Бизнес-правило', simple: 'Правило пекарни, которое действует и без программы: «заказ на завтра — до 22:30».', tech: 'Политика, правило, закон или расчёт, по которым работает бизнес (Вигерс). Из правил выводят функциональные требования; правило живёт дольше любой программы.' },
      { term: 'Ограничение', simple: 'То, что нельзя поменять: печь одна, торты — не больше 25 в день, срок — 1 марта.', tech: 'Условие, которое сужает выбор решения: закон, срок, бюджет, обязательная технология или чужая система (Вигерс; в BABOK — «фактор, который нельзя изменить»).' }
    ],
    outro: 'Письмо Нины — не ТЗ, а честный список её боли и готовых идей. Теперь вы отличаете решение от потребности, умеете подняться вопросом «зачем?» до цели и раскладываете требования по ступеням: бизнес → люди → система, а сбоку — правила, ограничения, качество и интерфейсы. Завтра в 10:00 разберём виды требований — и посмотрим, что сломается утром 8 Марта, если забыть про «насколько хорошо».',
    tasks: [howWhat, howChain, howLevels, markTask, digTask, levelsTask, ninaTask]
  });
})();
