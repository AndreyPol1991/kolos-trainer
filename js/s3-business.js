/* Неделя 3, пятница 15:00 — «Работа с бизнесом».
   Теория: встреча и письмо-итог (соседний пример — стоматологическая клиника «Улыбка»: симулятор встречи на 45 минут,
   письмо «до/после» с разметкой и канцеляритом); интересы и позиции по Фишеру и Юри, конструктор «нет» с вариантами
   и ценой, вопросы на демо (та же клиника); перевод «одна новость — два языка» для Нины и Димы и управление ожиданиями
   (что Нина услышит в день запуска).
   Практика на «Колосе»: повестка встречи про оплату на месте (цель, участники и роли, пункты с минутами в 45 минут);
   переговоры Нины и Олега Петровича — интересы под позициями и живая встреча со шкалами «интересы / варианты / отношения»;
   мини-редактор письма-итога с проверкой признаков; «скажите нет» Рите — диагноз трёх черновиков и свой ответ
   с живой проверкой; ответ Олегу Петровичу своими словами. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'business';

  if (!document.getElementById('biz-css')) document.head.insertAdjacentHTML('beforeend', `<style id="biz-css">
    .biz-root, .biz-root .stack > * { min-width: 0; }
    .biz-root .seg button { white-space: normal; text-align: left; }
    .biz-lbl { font: 600 11px/1.35 var(--f-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--text-muted); }
    .biz-two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 14px; align-items: start; }
    .biz-two > * { min-width: 0; }
    .biz-tg { display: grid; gap: 6px; }
    .biz-tg label { display: grid; grid-template-columns: 20px minmax(0, 1fr); gap: 8px; align-items: start; border: 1px solid var(--border); border-radius: 10px; padding: 7px 10px; background: var(--surface); cursor: pointer; font-size: 14px; line-height: 1.4; }
    .biz-tg label.on { border-color: var(--ok); background: color-mix(in srgb, var(--ok-soft) 55%, var(--surface)); }
    .biz-tg input { accent-color: var(--accent); width: 16px; height: 16px; margin-top: 3px; }
    .biz-bar { position: relative; height: 22px; border-radius: 8px; background: var(--surface-3); overflow: hidden; display: flex; }
    .biz-bar i { display: block; height: 100%; }
    .biz-bar i.ok { background: var(--ok); } .biz-bar i.bad { background: var(--bad); } .biz-bar i.over { background: repeating-linear-gradient(45deg, var(--bad) 0 6px, var(--bad-soft) 6px 12px); }
    .biz-bar b { position: absolute; top: 0; bottom: 0; width: 3px; background: var(--text); }
    .biz-bar-l { display: flex; justify-content: space-between; font: 600 11.5px/1.3 var(--f-mono); color: var(--text-muted); }
    .biz-log { display: grid; gap: 5px; }
    .biz-log div { border: 1px solid var(--border); border-left: 4px solid var(--border-strong); border-radius: 9px; padding: 6px 10px; font-size: 13.5px; line-height: 1.45; background: var(--surface); }
    .biz-log div.ok { border-left-color: var(--ok); } .biz-log div.bad { border-left-color: var(--bad); }
    .biz-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    .biz-mail { border: 1px solid var(--border-strong); border-radius: 12px; background: var(--surface); overflow: hidden; }
    .biz-mail .hd { padding: 8px 12px; border-bottom: 1px solid var(--border); font-size: 13.5px; background: var(--surface-2); overflow-wrap: anywhere; }
    .biz-mail .hd span { color: var(--text-muted); margin-right: 6px; }
    .biz-mail .bd { padding: 10px 12px; font-size: 14px; line-height: 1.55; white-space: pre-wrap; overflow-wrap: anywhere; }
    .biz-mail .bd .ln { min-height: 1.55em; }
    .biz-mail .bd .ln.q { background: color-mix(in srgb, var(--warn-soft) 70%, transparent); border-radius: 4px; }
    mark.biz-m { background: none; color: inherit; border-radius: 3px; padding: 0 1px; }
    .biz-mk mark.biz-m.f { background: var(--info-soft); box-shadow: inset 0 -2px 0 var(--info); }
    .biz-mk mark.biz-m.d { background: var(--ok-soft); box-shadow: inset 0 -2px 0 var(--ok); }
    .biz-mk mark.biz-m.q { background: var(--warn-soft); box-shadow: inset 0 -2px 0 var(--warn); }
    .biz-mk mark.biz-m.c { background: var(--violet-soft); box-shadow: inset 0 -2px 0 var(--violet); }
    .biz-mk mark.biz-m.bad, mark.biz-m.bad { background: var(--bad-soft); box-shadow: inset 0 -2px 0 var(--bad); text-decoration: line-through; text-decoration-color: color-mix(in srgb, var(--bad) 60%, transparent); }
    .biz-legend { display: flex; flex-wrap: wrap; gap: 6px; }
    .biz-legend .chip { white-space: normal; }
    .biz-flip { display: flex; flex-wrap: wrap; gap: 6px; }
    .biz-flip button { border: 1px dashed var(--bad); background: var(--bad-soft); color: var(--text); border-radius: 8px; padding: 4px 9px; font-size: 13px; line-height: 1.35; text-align: left; }
    .biz-flip button.on { border-style: solid; border-color: var(--ok); background: var(--ok-soft); }
    .biz-ice { display: grid; gap: 6px; }
    .biz-ice .lay { border: 1px solid var(--border); border-radius: 10px; padding: 8px 11px; font-size: 14px; line-height: 1.45; background: var(--surface); }
    .biz-ice .lay small { display: block; font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 2px; }
    .biz-ice .lay.pos { border-color: var(--bad); background: color-mix(in srgb, var(--bad-soft) 55%, var(--surface)); }
    .biz-ice .lay.why { border-style: dashed; }
    .biz-ice .lay.int { border-color: var(--ok); background: color-mix(in srgb, var(--ok-soft) 55%, var(--surface)); }
    .biz-ice .wl { height: 0; border-top: 2px dashed var(--info); margin: 4px 0; position: relative; }
    .biz-ice .wl::after { content: "под водой — интересы"; position: absolute; right: 0; top: -9px; font: 600 10px/1 var(--f-mono); color: var(--info); background: var(--surface-2); padding: 0 4px; }
    .biz-opts { display: grid; gap: 6px; }
    .biz-opt { text-align: left; border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text); border-radius: 10px; padding: 8px 12px; font-size: 14px; line-height: 1.45; width: 100%; }
    .biz-opt:hover { border-color: var(--accent); }
    .biz-vr { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 6px 10px; align-items: center; border: 1px solid var(--border); border-radius: 10px; padding: 7px 10px; background: var(--surface); font-size: 14px; }
    .biz-vr .m { display: flex; gap: 4px; flex-wrap: wrap; justify-content: flex-end; }
    .biz-meters { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    .biz-nb { border: 1px dashed var(--border-strong); border-radius: 10px; padding: 8px 12px; background: var(--surface); display: grid; gap: 4px; font-size: 13.5px; }
    .biz-nb .it { display: grid; grid-template-columns: 18px minmax(0, 1fr); gap: 6px; }
    .biz-nb .it.pos { color: var(--text-muted); }
    .biz-nb .it.int { color: var(--ok); font-weight: 600; }
    .biz-narr { font-size: 13.5px; color: var(--text-2); font-style: italic; border-left: 3px solid var(--border-strong); padding-left: 10px; }
    .biz-out { border: 1px solid var(--border); border-left: 5px solid var(--border-strong); border-radius: 10px; padding: 10px 14px; background: var(--surface); display: grid; gap: 4px; }
    .biz-out.ok { border-left-color: var(--ok); } .biz-out.warn { border-left-color: var(--warn); } .biz-out.bad { border-left-color: var(--bad); }
    .biz-out b.h { font: 600 16px/1.3 var(--f-brand); }
    .biz-ag { display: grid; gap: 5px; }
    .biz-ai { display: grid; grid-template-columns: 22px 22px minmax(0, 1fr) auto auto; gap: 6px 8px; align-items: center; border: 1px solid var(--border); border-radius: 10px; padding: 6px 8px; background: var(--surface); font-size: 14px; line-height: 1.4; }
    .biz-ai.off { opacity: .62; background: transparent; border-style: dashed; }
    .biz-ai.ok { border-color: var(--ok); } .biz-ai.bad { border-color: var(--bad); } .biz-ai.warn { border-color: var(--warn); }
    .biz-ai input { accent-color: var(--accent); width: 16px; height: 16px; }
    .biz-ai .n { font: 600 12px/1 var(--f-mono); color: var(--text-muted); text-align: center; }
    .biz-ai .min { font: 600 12.5px/1 var(--f-mono); color: var(--text-2); white-space: nowrap; }
    .biz-ai .mv { display: flex; gap: 3px; }
    .biz-ai .mv button { width: 28px; height: 28px; border-radius: 7px; border: 1px solid var(--border-strong); background: var(--surface-2); padding: 0; }
    .biz-ai .mv button:disabled { opacity: .35; }
    .biz-ppl { display: flex; flex-wrap: wrap; gap: 6px; }
    .biz-ppl .chip small { color: var(--text-muted); font-size: 11.5px; }
    .biz-roles { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    .biz-chk { display: grid; gap: 4px; }
    .biz-chk li b { color: var(--text); }
    .biz-ed { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 14px; align-items: start; }
    .biz-ed > * { min-width: 0; }
    .biz-ed textarea { min-height: 380px; font-size: 14px; }
    .biz-notes { border: 1px solid var(--border); border-radius: 10px; background: var(--surface); padding: 8px 12px; font-size: 13.5px; line-height: 1.5; }
    .biz-notes ul { margin: 4px 0 0; padding-left: 18px; }
    .biz-demo { display: grid; gap: 6px; }
    @media (min-width: 561px) { .biz-root .matcher .mrow { grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); } }
    .biz-mail .bd .ln.cf { background: color-mix(in srgb, var(--violet-soft) 80%, transparent); border-radius: 4px; }
    @media (max-width: 860px) { .biz-ed { grid-template-columns: minmax(0, 1fr); } .biz-ed textarea { min-height: 300px; } }
    @media (max-width: 760px) { .biz-two { grid-template-columns: minmax(0, 1fr); } }
    @media (max-width: 560px) {
      .biz-roles { grid-template-columns: minmax(0, 1fr); }
      .biz-meters, .biz-stats { gap: 6px; }
      .biz-meters .stat, .biz-stats .stat { padding: 8px; }
      .biz-meters .stat .k, .biz-stats .stat .k { font-size: 9.5px; letter-spacing: .04em; }
      .biz-ai { grid-template-columns: 20px minmax(0, 1fr) auto; }
      .biz-ai .n { display: none; }
      .biz-ai .min { grid-column: 2; justify-self: start; }
      .biz-ai .mv { grid-column: 3; grid-row: 1 / span 2; flex-direction: column; }
      .biz-vr { grid-template-columns: minmax(0, 1fr); }
      .biz-vr .m { justify-content: flex-start; }
    }
  </style>`);

  // ---------- общие помощники ----------
  const fresh = fn => pane => { const d = document.createElement('div'); pane.appendChild(d); fn(d); };
  const quizRef = cfg => cfg.options.map((o, i) => o.ok ? i : -1).filter(i => i >= 0);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  // разметка текста: [[f]]…[[/]] → <mark class="biz-m f">…</mark>
  const mk = s => esc(s).replace(/\[\[(f|d|q|c|bad)\]\]/g, '<mark class="biz-m $1">').replace(/\[\[\/\]\]/g, '</mark>');
  const unmk = s => String(s).replace(/\[\[(?:f|d|q|c|bad|\/)\]\]/g, '');
  const LEG = `<div class="biz-legend"><span class="chip info">факты с цифрами</span><span class="chip ok">решения</span><span class="chip warn">вопрос: кто и до когда</span><span class="chip" style="color:var(--violet)">просьба подтвердить</span><span class="chip bad">канцелярит</span></div>`;

  // =====================================================================
  // Теория 1. Встреча и письмо-итог (клиника «Улыбка»)
  // =====================================================================
  const MT = [
    { id: 'goal', t: 'Цель одной фразой — в приглашении', on: 'Цель в приглашении: «Решить, как сократить неявки на приём». Все пришли с цифрами по неявкам.', off: '0–12 мин. Спорят, зачем собрались: главврач думал — про цены, администратор — про отмены.', waste: 12, dec: -1 },
    { id: 'agenda', t: 'Повестка с минутами', on: 'По повестке: 5 минут факты, 15 — варианты, 10 — решение, 5 — итоги.', off: 'Отмены обсуждали 35 минут, до напоминаний дошли под конец — встреча затянулась на 15 минут.', over: 15, dec: -1 },
    { id: 'decider', t: 'Пришёл тот, кто решает (главврач)', on: 'Главврач на встрече — решение принято здесь же.', off: 'Варианты нашли, но решать некому: главврача нет — «перенесём на следующую неделю».', zero: true },
    { id: 'roles', t: 'Роли: кто ведёт, кто записывает', on: 'Аналитик ведёт, администратор записывает решения на доске.', off: 'Никто не записывал: через день — три версии решения.', own: 2 },
    { id: 'park', t: '«Парковка» для посторонних тем', on: 'Про новые кресла — на «парковку», вернёмся отдельно.', off: 'Администратор 10 минут рассказывал про новые кресла — тема важная, но не сегодняшняя.', waste: 10 },
    { id: 'sum', t: 'Резюме вслух за 5 минут до конца', on: 'Проговорили вслух: кто что делает и к какому сроку.', off: 'Разошлись, не проговорив, кто что делает к какому сроку.', own: 2 }
  ];
  function drawMeet(pane) {
    const on = new Set(['decider']);
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Клиника «Улыбка» хочет сократить неявки пациентов. Встреча — 45 минут: главврач, администратор и аналитик. Включайте элементы подготовки и смотрите, как проходит встреча.</p>
      <div class="row"><button type="button" class="btn sm ghost" data-all="0">Всё выключить</button><button type="button" class="btn sm" data-all="1">Всё включить</button></div>
      <div class="biz-two"><div class="biz-tg" data-tg></div><div class="stack tight"><div class="biz-stats" data-st></div><div class="biz-bar-l"><span>0 мин</span><span data-bl></span></div><div class="biz-bar" data-bar></div><div class="biz-log" data-log></div></div></div>
    </div>`;
    function draw() {
      TR.$('[data-tg]', pane).innerHTML = MT.map(m => `<label class="${on.has(m.id) ? 'on' : ''}"><input type="checkbox" data-m="${m.id}" ${on.has(m.id) ? 'checked' : ''}><span>${esc(m.t)}</span></label>`).join('');
      let dec = 3, own = 0, waste = 0, over = 0;
      MT.forEach(m => { if (on.has(m.id)) return; dec += m.dec || 0; own += m.own || 0; waste += m.waste || 0; over += m.over || 0; });
      if (!on.has('decider')) dec = 0;
      dec = Math.max(0, dec);
      const total = 45 + over, use = Math.max(0, 45 - waste);
      TR.$('[data-bar]', pane).innerHTML = `<i class="ok" style="width:${use / total * 100}%"></i><i class="bad" style="width:${Math.min(45, waste) / total * 100}%"></i>${over ? `<i class="over" style="width:${over / total * 100}%"></i><b style="left:calc(${45 / total * 100}% - 1px)"></b>` : ''}`;
      TR.$('[data-bl]', pane).textContent = over ? `45 мин + ${over} сверх` : '45 мин';
      TR.$('[data-st]', pane).innerHTML = `<div class="stat"><span class="k">Решений</span><span class="v ${dec >= 3 ? 'ok' : dec ? 'warn' : 'bad'}">${dec}</span></div><div class="stat"><span class="k">Вопросов без хозяина</span><span class="v ${own ? 'bad' : 'ok'}">${own}</span></div><div class="stat"><span class="k">Минут впустую</span><span class="v ${waste + over ? 'bad' : 'ok'}">${waste + over}</span></div>`;
      TR.$('[data-log]', pane).innerHTML = MT.map(m => `<div class="${on.has(m.id) ? 'ok' : 'bad'}">${esc(on.has(m.id) ? m.on : m.off)}</div>`).join('');
    }
    pane.addEventListener('change', e => { const c = e.target.closest('[data-m]'); if (!c) return; if (c.checked) on.add(c.dataset.m); else on.delete(c.dataset.m); draw(); });
    TR.on(pane, 'click', '[data-all]', (e, b) => { on.clear(); if (b.dataset.all === '1') MT.forEach(m => on.add(m.id)); draw(); });
    draw();
  }
  const ML_BAD = { subj: 'Совещание', body: 'Добрый день!\n\n[[bad]]В ходе совещания[[/]] были рассмотрены вопросы, [[bad]]связанные с[[/]] неявками пациентов. По итогам обсуждения [[bad]]было принято решение[[/]] о [[bad]]целесообразности[[/]] внедрения напоминаний. [[bad]]Данный[[/]] вопрос [[bad]]является[[/]] приоритетным и будет [[bad]]проработан в рабочем порядке[[/]].\n\nПросим [[bad]]принять к сведению[[/]].\n\nС уважением, команда проекта' };
  const ML_GOOD = { subj: 'Итоги встречи 14.10: неявки — решили про SMS, ответьте до 16.10', body: 'Добрый день!\n\nЧто выяснили:\n— [[f]]18 пациентов в неделю[[/]] не приходят на приём — это около [[f]]14 часов[[/]] простоя кресел.\n— Чаще всего не приходят те, кто записался больше чем за [[f]]2 недели[[/]].\n\nЧто решили:\n— [[d]]За сутки до приёма отправляем SMS с кнопками «Подтвердить» и «Перенести».[[/]]\n— [[d]]Предоплату пока не вводим.[[/]]\n\nОткрытые вопросы:\n[[q]]— Сколько стоит SMS-рассылка — администратор, до 16.10.[[/]]\n[[q]]— Кому SMS не отправлять (дети, пациенты без мобильного) — главврач, до 18.10.[[/]]\n\n[[c]]Если я что-то понял(а) не так — поправьте до 16.10. Если правок нет, считаем решение согласованным.[[/]]' };
  const FLIP = [['в ходе совещания', 'на встрече'], ['было принято решение', 'решили'], ['осуществлять', 'делать'], ['в целях', 'чтобы'], ['данный вопрос', 'этот вопрос'], ['является приоритетным', 'важнее остального'], ['принять к сведению', 'подтвердите до …'], ['в рабочем порядке', 'кто и до когда']];
  function drawMail(pane) {
    let v = 'bad', mark = true;
    const fl = new Set();
    pane.innerHTML = `<div class="stack">
      <p class="small muted">После встречи в «Улыбке» аналитик пишет письмо-итог. Сравните два письма об одной и той же встрече.</p>
      <div class="row">${ui.seg('ml', [{ v: 'bad', t: 'Как часто пишут' }, { v: 'good', t: 'Как надо' }], v, 'accent')}<label class="toggle"><input type="checkbox" data-mk checked> <span>Показать разметку</span></label></div>
      <div data-l></div><div data-w></div>
      <div class="biz-lbl">Канцелярит → по-человечески (нажмите)</div>
      <div class="biz-flip" data-f></div>
    </div>`;
    function draw() {
      const m = v === 'bad' ? ML_BAD : ML_GOOD;
      TR.$('[data-l]', pane).innerHTML = `<div class="biz-mail ${mark ? 'biz-mk' : ''}"><div class="hd"><span>Тема:</span>${esc(m.subj)}</div><div class="bd">${mark ? mk(m.body) : esc(unmk(m.body))}</div></div>${mark ? LEG : ''}`;
      TR.$('[data-w]', pane).innerHTML = v === 'bad'
        ? ui.note('bad', 'Что не так', 'Тема ничего не говорит. Ни одной цифры. «Было принято решение о целесообразности» — а что именно решили? Кто, что и к какому сроку делает — нет. «Принять к сведению» вместо просьбы подтвердить — значит, если кто-то понял иначе, это всплывёт только через месяц.')
        : ui.note('ok', 'Почему так лучше', 'Тема — уже краткий итог и просьба. Факты — с цифрами. Решения — отдельно, каждое — одно действие. У каждого открытого вопроса есть хозяин и срок. В конце — просьба подтвердить и что будет, если молчат. Читается за минуту, через месяц находится поиском.');
      TR.$('[data-f]', pane).innerHTML = FLIP.map((p, i) => `<button type="button" class="${fl.has(i) ? 'on' : ''}" data-fi="${i}">${esc(fl.has(i) ? p[1] : p[0])}</button>`).join('');
    }
    ui.onSeg(pane, (n, x) => { if (n === 'ml') { v = x; draw(); } });
    pane.addEventListener('change', e => { if (e.target.closest('[data-mk]')) { mark = e.target.checked; draw(); } });
    TR.on(pane, 'click', '[data-fi]', (e, b) => { const i = +b.dataset.fi; if (fl.has(i)) fl.delete(i); else fl.add(i); draw(); });
    draw();
  }
  const howMeet = {
    id: 'how-meet', covers: ['agenda', 'letter'], title: 'Как это работает: встреча и письмо-итог', free: true, noReset: true,
    simple: {
      icon: '🗓️',
      plain: 'Встреча — это способ принять решение, а не поговорить. До неё — цель одной фразой, повестка с минутами и тот, кто вправе решать, в списке приглашённых. После — короткое письмо в тот же день: что узнали, что решили, что осталось и кто за это отвечает к какому сроку. Письмо превращает разговор в договорённость.',
      analogy: 'Семейный совет перед ремонтом кухни. Не сказали заранее, что сегодня выбираем плитку, — полвечера уйдёт на шторы, а папа, который платит, придёт к концу. А без записки на холодильнике через неделю каждый вспомнит «решение» по-своему.',
      tech: 'Подготовка (PRACTICES §2.1): цель, участники и роли (ведущий, секретарь, принимающий решение), повестка с таймингом, «парковка» для посторонних тем. Итог — <b>письмо-резюме</b> (follow-up) в течение суток: факты с цифрами, решения, открытые вопросы с ответственными и сроками, просьба подтвердить (PRACTICES §2.3). Писать ясно и коротко, без канцелярита: Максим Ильяхов, Людмила Сарычева — «Пиши, сокращай», «Новые правила деловой переписки».'
    },
    lead: ui.brief({
      situation: 'Соседний пример — стоматологическая клиника «Улыбка»: пациенты записываются и не приходят. Две вкладки: симулятор 45-минутной встречи и два письма-итога об одной встрече.',
      todo: [
        '«Встреча»: нажмите «Всё выключить», потом включайте элементы подготовки по одному — следите за решениями, минутами и вопросами без хозяина.',
        '«Письмо-итог»: переключите «Как часто пишут» и «Как надо», включите разметку. Понажимайте на канцелярит внизу.'
      ],
      look: 'Полоса — 45 минут встречи: зелёное — время по делу, красное — впустую, штриховка — сверх времени. В письме цвет разметки — признак хорошего итога, зачёркнутое красное — канцелярит.'
    }),
    render(el) {
      el.classList.add('biz-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'meet', t: 'Встреча: соберите и проиграйте', render: fresh(drawMeet) },
        { id: 'mail', t: 'Письмо-итог: до и после', render: fresh(drawMail) }
      ], 'meet');
      el.insertAdjacentHTML('beforeend', `<div style="margin-top:12px">${ui.note('info', 'Позиция аналитика', 'Встречу по требованиям готовит и ведёт аналитик: он знает, что надо выяснить и что решить. Решает — заказчик. Артефакты — повестка до встречи и письмо-итог после; в реестре требований решение получает статус «согласовано» со ссылкой на письмо.')}</div>`);
    }
  };

  // =====================================================================
  // Теория 2. Интересы и позиции, «нет» с вариантами, демо (клиника «Улыбка»)
  // =====================================================================
  const ICE = [
    { id: 'doc', t: 'Главврач', pos: '«Онлайн-запись — только с предоплатой!»', why: '«Пациенты записываются и не приходят. Кресло простаивает, врач сидит без работы».', int: 'Чтобы кресло не пустовало и врачи не теряли деньги' },
    { id: 'adm', t: 'Администратор', pos: '«Никакой предоплаты!»', why: '«Пожилые пациенты не умеют платить онлайн — звонят мне и ругаются, а кто-то уходит в другую клинику».', int: 'Не терять постоянных пациентов и не тонуть в звонках' }
  ];
  const ICE_OPT = [
    { t: 'SMS за сутки с кнопками «Подтвердить» и «Перенести»; освободившееся время — тем, кто в листе ожидания', doc: 'ok', adm: 'ok' },
    { t: 'Предоплата только для длинных процедур — больше часа', doc: 'ok', adm: 'warn' },
    { t: 'Предоплата для всех', doc: 'ok', adm: 'bad' },
    { t: 'Ничего не менять', doc: 'bad', adm: 'ok' }
  ];
  function drawIce(pane) {
    const lv = { doc: 0, adm: 0 };
    let opts = false, crit = false;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">В «Улыбке» запускают онлайн-запись. Главврач и администратор спорят — и каждый прав по-своему. Спрашивайте «зачем?», пока под позицией не появится интерес.</p>
      <div class="biz-two" data-c></div><div data-o></div>
    </div>`;
    const mark = k => k === 'ok' ? ui.status('да', 'ok') : k === 'warn' ? ui.status('частично', 'warn') : ui.status('нет', 'bad');
    function draw() {
      TR.$('[data-c]', pane).innerHTML = ICE.map(p => `<div class="biz-ice"><b>${esc(p.t)}</b>
        <div class="lay pos"><small>Позиция — что требует</small>${esc(p.pos)}</div>
        <div class="wl"></div>
        ${lv[p.id] >= 1 ? `<div class="lay why"><small>Зачем?</small>${esc(p.why)}</div>` : ''}
        ${lv[p.id] >= 2 ? `<div class="lay int"><small>Интерес — почему требует</small>${esc(p.int)}</div>` : ''}
        ${lv[p.id] < 2 ? `<button type="button" class="btn sm" data-why="${p.id}">Спросить «${lv[p.id] ? 'а для чего это вам?' : 'что за этим стоит?'}»</button>` : ''}</div>`).join('');
      const both = lv.doc >= 2 && lv.adm >= 2;
      let h = '';
      if (!both) h = '<p class="small dim">Когда оба интереса будут видны, можно искать варианты.</p>';
      else {
        h += opts ? `<div class="stack tight"><div class="biz-lbl">Варианты — сначала придумываем, потом выбираем</div>${ICE_OPT.map(o => `<div class="biz-vr"><span>${esc(o.t)}</span><span class="m"><span class="small dim">главврач</span>${mark(o.doc)}<span class="small dim">администратор</span>${mark(o.adm)}</span></div>`).join('')}</div>` : '<button type="button" class="btn sm primary" data-op>Придумать варианты</button>';
        if (opts) h += crit ? ui.note('ok', 'Объективный критерий', 'Через месяц сравним неявки: было 18 в неделю. Если станет меньше 8 — предоплату не вводим; если нет — вернёмся к варианту с предоплатой для длинных процедур. Спорить о том, «кто прав», больше не нужно — решат цифры.') : '<div style="margin-top:8px"><button type="button" class="btn sm" data-cr>Как поймём, что вариант сработал?</button></div>';
      }
      TR.$('[data-o]', pane).innerHTML = h;
    }
    TR.on(pane, 'click', '[data-why]', (e, b) => { lv[b.dataset.why]++; draw(); });
    TR.on(pane, 'click', '[data-op]', () => { opts = true; draw(); });
    TR.on(pane, 'click', '[data-cr]', () => { crit = true; draw(); });
    draw();
    pane.insertAdjacentHTML('beforeend', ui.note('info', 'Четыре принципа Фишера и Юри', '1) Отделять людей от проблемы: спорят не главврач с администратором, а оба — с неявками. 2) Интересы, а не позиции. 3) Несколько вариантов до выбора. 4) Объективные критерии: цифры, закон, данные пилота. И помните про апельсин из «Простыми словами»: «зачем тебе?» иногда решает спор целиком.'));
  }
  const NOP = [
    { id: 'p1', t: 'Признать интерес', s: 'Понимаю зачем: пациентам из области не придётся ездить на контрольный осмотр.', good: 1 },
    { id: 'p2', t: 'Вариант с ценой', s: 'Можно сделать к запуску, но это ещё около 3 недель работы — запуск сдвинется на конец месяца.', good: 1 },
    { id: 'p3', t: 'Вариант дешевле', s: 'Или к запуску — запись на звонок врача по телефону, а видео — следующим этапом.', good: 1 },
    { id: 'p4', t: 'Последствия', s: 'Если сдвигать запуск, сдвинутся и напоминания о приёмах — а ради них всё затевали.', good: 1 },
    { id: 'p5', t: 'Кто решает', s: 'Решать вам — к пятнице подготовлю оба варианта с цифрами.', good: 1 },
    { id: 'x1', t: 'Голое «нельзя»', s: 'Нет, это невозможно, в объём не входит.' },
    { id: 'x2', t: 'Сразу «да»', s: 'Хорошо, сделаем к запуску!' }
  ];
  function drawNo(pane) {
    const on = new Set();
    pane.innerHTML = `<div class="stack">
      <p class="small muted">За месяц до запуска главврач «Улыбки» просит: «Добавьте к запуску ещё видеоконсультации!». Соберите ответ из частей и смотрите на реакцию.</p>
      <div class="biz-narr">Главврач: «Добавьте к запуску видеоконсультации — это же современно!»</div>
      <div class="biz-tg" data-p></div>
      <div class="biz-meters" data-m></div>
      <div data-a></div>
    </div>`;
    function draw() {
      TR.$('[data-p]', pane).innerHTML = NOP.map(p => `<label class="${on.has(p.id) ? 'on' : ''}"><input type="checkbox" data-np="${p.id}" ${on.has(p.id) ? 'checked' : ''}><span><b>${esc(p.t)}</b> <span class="small muted">— ${esc(p.s)}</span></span></label>`).join('');
      const g = NOP.filter(p => p.good && on.has(p.id)).length, no = on.has('x1'), yes = on.has('x2');
      let trust = 50 + g * 8 - (no ? 30 : 0) + (yes ? 15 : 0), date = 100 - (yes ? 60 : 0);
      trust = clamp(trust, 0, 100); date = clamp(date, 0, 100);
      const k = v => v >= 60 ? '' : v >= 40 ? 'warn' : 'bad';
      TR.$('[data-m]', pane).innerHTML = `<div class="stat"><span class="k">Доверие главврача</span><span class="v ${k(trust)}">${trust}</span>${ui.meter(trust / 100, k(trust))}</div><div class="stat"><span class="k">Срок запуска</span><span class="v ${k(date)}">${date}</span>${ui.meter(date / 100, k(date))}</div><div class="stat"><span class="k">Частей ответа</span><span class="v">${g} из 5</span></div>`;
      const text = NOP.filter(p => on.has(p.id)).map(p => p.s).join(' ');
      let re, kind;
      if (!on.size) { re = 'Соберите ответ: отметьте части слева.'; kind = 'info'; }
      else if (yes && no) { re = 'Главврач: «Так да или нет?» — ответ противоречит сам себе.'; kind = 'bad'; }
      else if (yes) { re = 'Главврач доволен… а через месяц запуск сорван: видео не успели, напоминания тоже. «Почему вы не сказали сразу?»'; kind = 'bad'; }
      else if (no) { re = 'Главврач: «Невозможно? Тогда найду подрядчика, у которого возможно».'; kind = 'bad'; }
      else if (g >= 4 && on.has('p5')) { re = 'Главврач: «Давайте к запуску телефонную запись, видео — потом. Спасибо, что посчитали».'; kind = 'ok'; }
      else if (g >= 2) { re = 'Главврач слушает, но решить не может: не хватает ' + (!on.has('p5') ? 'понимания, кто решает и когда будут цифры.' : !on.has('p3') ? 'варианта дешевле — выбирать не из чего.' : 'цены или последствий.'); kind = 'warn'; }
      else { re = 'Главврач: «И что вы предлагаете?»'; kind = 'warn'; }
      TR.$('[data-a]', pane).innerHTML = (text ? ui.say('me', esc(text)) : '') + ui.note(kind, 'Реакция', esc(re));
    }
    pane.addEventListener('change', e => { const c = e.target.closest('[data-np]'); if (!c) return; if (c.checked) on.add(c.dataset.np); else on.delete(c.dataset.np); draw(); });
    draw();
  }
  const DEMO = [
    { q: '«Вам нравится?»', a: 'Да, симпатично.', l: 'Ничего. Это вежливость, а не информация.', k: 'bad' },
    { q: '«Всё понятно?»', a: 'Да-да, понятно.', l: 'Ничего: люди редко признаются, что не поняли.', k: 'bad' },
    { q: '«Запишите пациента на четверг так, как в понедельник в 9 утра, когда звонят трое сразу»', a: 'Так… а где отметить, что приём повторный? И пока я ищу свободное время, второй звонок уже сорвался.', l: 'Нет признака «повторный приём», а запись требует слишком много шагов. Две доработки.', k: 'ok' },
    { q: '«Пациент перезвонил и просит перенести приём. Покажите, что сделаете»', a: 'Отменяю и записываю заново? Тогда он потеряет своё место…', l: 'Нет переноса записи — только отмена. Требование найдено на демо, а не после запуска.', k: 'ok' },
    { q: '«Чего здесь не хватает для вашего обычного понедельника?»', a: 'Видеть с утра, кто не подтвердил SMS, — чтобы обзвонить.', l: 'Новый сценарий для администратора: список неподтверждённых записей.', k: 'ok' }
  ];
  function drawDemo(pane) {
    const asked = new Set();
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Демо в «Улыбке»: администратор впервые видит экран записи. У вас пять вопросов. Какие из них что-то дают?</p>
      <div class="biz-opts" data-q></div><div class="biz-stats" data-s></div><div class="biz-demo" data-a></div>
    </div>`;
    function draw() {
      TR.$('[data-q]', pane).innerHTML = DEMO.map((d, i) => `<button type="button" class="biz-opt" data-dq="${i}" ${asked.has(i) ? 'disabled style="opacity:.55"' : ''}>${esc(d.q)}</button>`).join('');
      const found = [...asked].filter(i => DEMO[i].k === 'ok').length;
      TR.$('[data-s]', pane).innerHTML = `<div class="stat"><span class="k">Задано вопросов</span><span class="v">${asked.size}</span></div><div class="stat"><span class="k">Найдено доработок</span><span class="v ${found ? 'ok' : ''}">${found}</span></div><div class="stat"><span class="k">Пустых ответов</span><span class="v ${[...asked].length - found ? 'bad' : ''}">${asked.size - found}</span></div>`;
      TR.$('[data-a]', pane).innerHTML = [...asked].reverse().map(i => { const d = DEMO[i]; return `${ui.say('me', esc(d.q))}<div class="say"><div class="avatar" aria-hidden="true">А</div><div class="bubble"><div class="who"><b>Администратор</b></div><div>${esc(d.a)}</div></div></div>${ui.note(d.k, 'Что узнали', esc(d.l))}`; }).join('');
    }
    TR.on(pane, 'click', '[data-dq]', (e, b) => { asked.add(+b.dataset.dq); draw(); });
    draw();
    pane.insertAdjacentHTML('beforeend', ui.note('info', 'Правило демо', 'Показывать работающее и просить сделать реальную задачу из своего дня — «как в понедельник в 9 утра». Спрашивать о прошлом и о деле, а не о вкусе (The Mom Test). В Scrum это обзор спринта (Sprint Review): заказчик смотрит инкремент, команда собирает отзывы и правит бэклог.'));
  }
  const howYes = {
    id: 'how-yes', covers: ['talks'], title: 'Как это работает: интересы, «нет» с вариантами и демо', free: true, noReset: true,
    simple: {
      icon: '🍊',
      plain: 'Позиция — то, что человек требует: «только так!». Интерес — почему он этого хочет. Спорить о позициях — перетягивать канат. Докопаться до интересов — и часто находится вариант, где выигрывают оба. А если всё же надо отказать, говорят не «нельзя», а «можно так, это стоит столько; или вот вариант дешевле — решать вам».',
      analogy: 'Две сестры делят один апельсин пополам. Одна выжимает сок и выбрасывает корку, другая натирает корку в пирог и выбрасывает мякоть. Спроси они друг друга «зачем тебе?» — обе получили бы всё.',
      tech: 'Роджер Фишер, Уильям Юри — «Переговоры без поражения» (Getting to Yes): 1) отделять людей от проблемы; 2) интересы, а не позиции; 3) варианты взаимной выгоды до выбора; 4) объективные критерии (цифры, закон, данные пилота). «Нет» аналитика — варианты с ценой и последствиями, решение за владельцем продукта (PRACTICES §3). Демо — работающий результат и вопросы о реальном использовании, а не «нравится ли».'
    },
    lead: ui.brief({
      situation: 'Снова клиника «Улыбка». Три вкладки: спор главврача и администратора о предоплате, просьба «добавьте ещё видео к запуску» и демо экрана записи.',
      todo: [
        '«Позиция и интерес»: нажимайте «Спросить» под каждой позицией, пока не появится интерес. Потом придумайте варианты и найдите критерий.',
        '«Как сказать „нет“»: отмечайте части ответа и следите за реакцией и шкалами. Попробуйте голое «нельзя» и сразу «да».',
        '«Демо»: задайте пять вопросов и сравните, какие из них нашли доработки.'
      ],
      look: 'Красная рамка — позиция, зелёная — интерес под водой. В вариантах видно, чей интерес каждый закрывает. В «нет» шкалы — доверие и срок запуска.'
    }),
    render(el) {
      el.classList.add('biz-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'ice', t: 'Позиция и интерес', render: fresh(drawIce) },
        { id: 'no', t: 'Как сказать «нет»', render: fresh(drawNo) },
        { id: 'demo', t: 'Демо: что спрашивать', render: fresh(drawDemo) }
      ], 'ice');
    }
  };

  // =====================================================================
  // Теория 3. Перевод и ожидания («Колос»)
  // =====================================================================
  const NEWS = [
    { id: 'kassa', t: 'Сертификация «КассаПро» — 3 недели',
      nina: { bad: ['Нина Сергеевна, по фискализации: интеграцию с API облачной кассы вендор сертифицирует по своему SLA — 15 рабочих дней, иначе ОФД не примет чеки.', 'Я ничего не поняла. Это хорошо или плохо?', 'Жаргон (API, SLA, ОФД, фискализация) и нет главного: что это значит для её бизнеса и что от неё нужно.'],
        good: ['Нина Сергеевна, чтобы чеки пробивались по закону, «КассаПро» проверяет нашу работу 3 недели. Значит, заявку подаём заранее, с запасом, — иначе пилот 1 февраля пройдёт без чеков, а это штраф. От вас нужна только подпись на заявке.', 'Понятно. Присылайте — подпишу.', 'Язык выгод и рисков: закон, штраф, срок пилота — и одно действие, которое нужно от неё.'] },
      dima: { bad: ['Дим, там у кассы какая-то проверка, долгая. Имей в виду.', 'Какая проверка? Сколько длится? Что проверяют? Мне нечего оценивать.', 'Нет фактов: срок, что проверяют, что нужно от команды, как поймём, что готово.'],
        good: ['«КассаПро»: интеграция только через их публичный API, после сертификации — 3 недели. Нужны два чека по 54-ФЗ: «предоплата» и полный расчёт. Тестовый стенд и сценарии сертификации — заранее, с запасом до пилота. Готово, когда на тестовой кассе проходят оба типа чеков.', 'Понял. Заведу задачу на стенд, оценку дам к среде.', 'Язык правил и критериев: что, сколько, к какому сроку и как проверить.'] } },
    { id: 'cutoff', t: 'Заказ на завтра — до 22:30',
      nina: { bad: ['Реализуем cutoff по серверному времени с валидацией на бэкенде, после дедлайна заказ уходит в reject.', 'Чего?..', 'Ни одного слова, понятного владелице. И не сказано, зачем правило и что увидит покупатель.'],
        good: ['Заказы на завтра принимаем до 22:30, потому что в 23:00 Галина Ивановна утверждает план выпечки. После 22:30 покупатель увидит только то, что уже испекут, и подсказку, почему так. Заказ, который цех не успеет испечь, мы просто не примем.', 'Логично. Галина Ивановна будет довольна.', 'Причина (план в 23:00), что увидит покупатель и какой риск снимаем.'] },
      dima: { bad: ['Вечером заказы на завтра принимать не надо — где-то после половины одиннадцатого.', '«Где-то» — это сколько? По какому времени? А если корзину собрали в 22:29, а оплатили в 22:31?', 'Размытое «где-то», нет граничных значений и источника времени.'],
        good: ['Правило: заказ на завтра с позициями вне плана принимается до 22:30:00 по времени сервера. Граничные значения: 22:29:59 — принят, 22:30:00 — нет. Какой момент считать — открытие корзины или оплату, — уточняю у Нины, отвечу завтра.', 'Отлично. Жду ответа про момент — от него зависит проверка.', 'Точное правило, граница и честное «не знаю — уточню», а не догадка.'] } },
    { id: 'net', t: 'На Покровке пропадает интернет',
      nina: { bad: ['Нужен offline-first на клиенте кассира с локальным кэшем и синхронизацией через очередь.', 'Это сколько стоит и мне зачем?', 'Решение на техническом языке вместо проблемы бизнеса и цены.'],
        good: ['На Покровке и ещё в двух пекарнях интернет пропадает на 10–15 минут. Предлагаю сделать так, чтобы кассир и в это время выдавал заказы, а чеки досылались потом. Это добавит работы — Дима оценит к пятнице, и я принесу цену. Без этого в такие минуты очередь будет стоять.', 'Очередь стоять не должна. Жду цену.', 'Проблема её бизнеса (очередь), предложение, цена — позже и с датой, решение — за ней.'] },
      dima: { bad: ['Там иногда плохой интернет, сделайте, чтобы работало.', '«Иногда» — это как часто и надолго? Что именно должно работать?', 'Нет цифр и нет поведения системы, которое можно проверить.'],
        good: ['Экран кассира должен работать при обрыве связи до 15 минут: выдача по коду из сохранённых заказов на день, после восстановления связи всё досылается без потерь. Касса уже так работает — у неё есть офлайн-режим. Нужна оценка к пятнице.', 'Понятная задача. Оценю.', 'Цифра (15 минут), поведение, критерий «без потерь» и срок оценки.'] } }
  ];
  function drawTr(pane) {
    let n = 'kassa', who = 'nina', q = 'bad';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Три новости «Колоса» на этой неделе. Одна и та же новость — для Нины и для Димы. Переключайте и сравнивайте.</p>
      <div class="row">${ui.seg('nw', NEWS.map(x => ({ v: x.id, t: x.t })), n, 'accent')}</div>
      <div class="row">${ui.seg('au', [{ v: 'nina', t: 'Для Нины (владелица)' }, { v: 'dima', t: 'Для Димы (тимлид)' }], who)}${ui.seg('ql', [{ v: 'bad', t: 'Плохо' }, { v: 'good', t: 'Хорошо' }], q)}</div>
      <div data-o></div>
    </div>`;
    function draw() {
      const x = NEWS.find(y => y.id === n)[who][q];
      TR.$('[data-o]', pane).innerHTML = ui.say('me', esc(x[0])) + ui.say(who, esc(x[1])) + ui.note(q === 'good' ? 'ok' : 'bad', q === 'good' ? 'Почему работает' : 'Что не так', esc(x[2]));
    }
    ui.onSeg(pane, (k, v) => { if (k === 'nw') n = v; if (k === 'au') who = v; if (k === 'ql') q = v; draw(); });
    draw();
    pane.insertAdjacentHTML('beforeend', ui.note('info', 'Правило перевода', 'Бизнесу — что изменится в деньгах, сроках, рисках, клиентах и что нужно решить. Команде — правила, цифры, граничные значения, критерии готовности. И в обе стороны: «удобно для бабушек» от Нины для Димы превращается в «заказ через экран кассира, без регистрации покупателя».'));
  }
  const EXA = [
    { id: 'a1', t: 'В октябре сказали, что будет в первой версии и когда, — и чего не будет' },
    { id: 'a2', t: 'Каждое изменение — с ценой: «это плюс неделя, что убираем?»' },
    { id: 'a3', t: 'Показывали работающее каждые 2 недели на демо' },
    { id: 'a4', t: 'После каждой встречи — письмо-итог с решениями' },
    { id: 'a5', t: '«Всё должно работать всегда» перевели в цифры: окно обслуживания 01:00–02:30' }
  ];
  const EXS = [
    { by: 'a1', t: '«Почему не к Новому году? Я всем сказала, что в январе можно заказывать!»' },
    { by: 'a1', t: '«А где баллы? И доставка? Я же писала!»' },
    { by: 'a2', t: '«Почему торты сдвинулись на неделю? Из-за кнопки „повторить“? Я не просила такой ценой!»' },
    { by: 'a3', t: '«Я не это заказывала! Где фото торта для кондитера?»' },
    { by: 'a4', t: '«Мы же договорились, что можно с 07:00!» — Галина Ивановна: «Я такого не обещала»' },
    { by: 'a5', t: '«В полвторого ночи приложение не работало — мне позвонила знакомая!» А это было окно обслуживания' }
  ];
  function drawExp(pane) {
    const on = new Set();
    pane.innerHTML = `<div class="stack">
      <p class="small muted">1 марта, вечер. Нина Сергеевна подводит итоги запуска. Что она скажет, зависит от того, что аналитик делал с октября. Включайте действия слева.</p>
      <div class="biz-two"><div class="biz-tg" data-a></div><div class="stack tight"><div data-m></div><div class="stack tight" data-s></div></div></div>
    </div>`;
    function draw() {
      TR.$('[data-a]', pane).innerHTML = EXA.map(a => `<label class="${on.has(a.id) ? 'on' : ''}"><input type="checkbox" data-ea="${a.id}" ${on.has(a.id) ? 'checked' : ''}><span>${esc(a.t)}</span></label>`).join('');
      const left = EXS.filter(s => !on.has(s.by)), sat = clamp(100 - left.length * 15, 0, 100), k = sat >= 80 ? '' : sat >= 50 ? 'warn' : 'bad';
      TR.$('[data-m]', pane).innerHTML = `<div class="stat"><span class="k">Нина довольна запуском</span><span class="v ${k}">${sat}</span>${ui.meter(sat / 100, k)}</div>`;
      TR.$('[data-s]', pane).innerHTML = left.length ? left.map(s => ui.say('nina', esc(s.t))).join('') : ui.say('nina', 'Всё, как договаривались. Покажите, что у нас в плане на второй квартал.');
    }
    pane.addEventListener('change', e => { const c = e.target.closest('[data-ea]'); if (!c) return; if (c.checked) on.add(c.dataset.ea); else on.delete(c.dataset.ea); draw(); });
    draw();
    pane.insertAdjacentHTML('beforeend', ui.note('warn', 'Ожидания создаются и молчанием', 'Нина писала «к Новому году» и «баллы, как в Спортмастере». Если ей никто не сказал иначе — она этого ждёт. Сюрприз в день запуска — почти всегда несказанное в октябре, а не плохой код.'));
  }
  const howTalk = {
    id: 'how-talk', covers: ['no', 'why'], title: 'Как это работает: перевод и ожидания', free: true, noReset: true,
    simple: {
      icon: '🔁',
      plain: 'Одна и та же новость звучит по-разному для владелицы и для разработчика. Бизнесу — что изменится в деньгах, сроках и рисках и что нужно решить. Команде — правила, цифры и как проверить. А ожидания — это обещания, которые заказчик слышит, даже если вы их не давали: о том, чего не будет, говорят заранее.',
      analogy: 'Врач говорит пациенту: «Через неделю будете ходить без палочки, если каждый день делать упражнения», а медсестре: «ЛФК дважды в день по 20 минут, нагрузка — треть веса». Новость одна — язык разный.',
      tech: 'Аналитик — переводчик между бизнесом и командой. Бизнесу — язык выгод, рисков, сроков и вариантов с ценой; команде — язык правил, данных и критериев приёмки (PRACTICES §3). <b>Управление ожиданиями</b>: заранее говорить, что будет и чего не будет в первой версии, сроки и цену изменений; показывать работающее на демо каждые 2 недели; фиксировать решения письменно.'
    },
    lead: ui.brief({
      situation: 'Теперь — на «Колосе». Две вкладки: три новости этой недели для Нины и для Димы и вечер 1 марта, когда Нина подводит итоги запуска.',
      todo: [
        '«Одна новость — два языка»: выберите новость, адресата и «Плохо» / «Хорошо». Сравните, как реагируют Нина и Дима.',
        '«Ожидания»: включайте действия аналитика по одному и смотрите, какие претензии Нины исчезают.'
      ],
      look: 'Реплика под вашим сообщением — реакция адресата. В «Ожиданиях» шкала — насколько Нина довольна запуском; каждая претензия — несказанное или незаписанное раньше.'
    }),
    render(el) {
      el.classList.add('biz-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'tr', t: 'Одна новость — два языка', render: fresh(drawTr) },
        { id: 'exp', t: 'Ожидания: что услышит Нина', render: fresh(drawExp) }
      ], 'tr');
    }
  };

  // =====================================================================
  // Практика 1. Повестка встречи: оплата на месте
  // =====================================================================
  const GOAL = {
    q: 'Цель встречи — одной фразой в приглашении', seed: 'biz-goal',
    options: [
      { t: 'Решить, какие способы оплаты будут в первой версии, так чтобы не вернулась ручная сверка и не потерялись покупатели без карты', ok: 1, why: 'Да: что решаем и чьи интересы держим в голове — ясно ещё до встречи.' },
      { t: 'Обсудить оплату', why: 'Обсуждать можно бесконечно. Что должно появиться к концу встречи?' },
      { t: 'Убедить Олега Петровича, что оплата на месте нужна', why: 'Это позиция одной стороны: Олег Петрович придёт обороняться.' },
      { t: 'Показать Нине макеты экрана оплаты', why: 'Макет может быть средством. Но что надо решить?' }
    ]
  };
  const PP = [{ id: 'nina', t: 'Нина Сергеевна', sub: 'владелица' }, { id: 'oleg', t: 'Олег Петрович', sub: 'главбух' }, { id: 'pavel', t: 'Павел', sub: 'управляющий' }, { id: 'me', t: 'Вы', sub: 'аналитик' }, { id: 'ksenia', t: 'Ксения', sub: 'ведущий аналитик' }, { id: 'dima', t: 'Дима', sub: 'тимлид' }, { id: 'rita', t: 'Рита', sub: 'маркетолог' }];
  const ROLES = [{ id: 'lead', t: 'Ведёт встречу' }, { id: 'notes', t: 'Записывает' }, { id: 'decide', t: 'Принимает решение' }];
  const AG = [
    { id: 'a1', t: 'Цель и что решаем сегодня', m: 3, pos: 1 },
    { id: 'a2', t: 'Факты: как платят сейчас, сколько времени уходит на сверку, сколько покупателей старше 55', m: 7, pos: 2 },
    { id: 'a3', t: 'Что важно каждому: сверка и чеки — Олегу Петровичу, покупатели без карты — Нине Сергеевне', m: 8, pos: 3 },
    { id: 'a4', t: 'Варианты оплаты на месте и цена каждого', m: 12, pos: 4 },
    { id: 'a5', t: 'Решение и как поймём, что оно работает (критерии)', m: 8, pos: 5 },
    { id: 'a6', t: 'Итоги: кто что делает и к какому сроку; письмо-итог — сегодня', m: 5, pos: 6 },
    { id: 'd1', t: 'Баллы лояльности — раз уж все собрались', m: 10, why: 'другая тема и другие люди — на «парковку»' },
    { id: 'd2', t: 'Цвет и текст кнопки «Оплатить»', m: 7, why: 'вопрос к дизайнеру, а не к владелице и главбуху' },
    { id: 'd3', t: 'Обзор устройства платёжного шлюза', m: 10, why: 'внутренняя кухня команды — заказчику нужны варианты и цена' },
    { id: 'd4', t: 'Разбор, кто виноват в ручной сверке', m: 6, why: 'поиск виноватых ссорит; нужны факты, а не вина' }
  ];
  const AGN = AG.filter(a => a.pos), AGORD = TR.shuffle(AG.map(a => a.id), 'biz-ag');
  const LIMIT = 45;
  function agEval(ans) {
    const a = ans || {}, inv = a.inv || {}, R = a.roles || {}, on = a.on || {};
    const order = Array.isArray(a.order) && a.order.length === AG.length ? a.order : AGORD;
    const goal = ui.quizScore(GOAL, a.goal || []);
    let ppl = 0; const pn = [];
    if (inv.nina && inv.oleg) ppl += 0.35; else pn.push({ ok: false, html: 'Кого обязательно позвать на встречу о споре двух людей? Оба должны быть в комнате.' });
    if (R.decide === 'nina') ppl += 0.35; else pn.push({ ok: false, html: R.decide ? 'Решающий выбран не тот: чей это спор и чья это сеть? Кто вправе выбрать между интересами Олега Петровича и покупателей?' : 'Не назначен тот, кто принимает решение. Без него встреча закончится словами «перенесём».' });
    const an = ['me', 'ksenia'];
    if (an.includes(R.lead) && an.includes(R.notes) && R.lead !== R.notes) ppl += 0.3;
    else if (an.includes(R.lead) && R.lead === R.notes) { ppl += 0.15; pn.push({ ok: 'warn', html: 'Вести встречу и записывать одновременно трудно — что-то потеряется. Кто из команды может взять одну из ролей?' }); }
    else if (R.lead || R.notes) pn.push({ ok: false, html: 'Кто ведёт и кто записывает? Встречу по требованиям готовит команда аналитиков — не заказчик.' });
    else pn.push({ ok: false, html: 'Не назначены ведущий и тот, кто записывает.' });
    [R.lead, R.notes, R.decide].forEach(p => { if (p && !inv[p]) { ppl -= 0.1; } });
    if ([R.lead, R.notes, R.decide].some(p => p && !inv[p])) pn.push({ ok: false, html: 'Роль назначена человеку, которого нет в списке приглашённых.' });
    if (inv.rita) { ppl -= 0.15; pn.push({ ok: 'warn', html: 'Рита на встрече про оплату на месте — зачем? Каждый лишний участник — лишние темы и минуты.' }); }
    ppl = clamp(ppl, 0, 1);
    const incl = AG.filter(x => on[x.id]), total = incl.reduce((s, x) => s + x.m, 0);
    const selOk = AG.filter(x => x.pos ? !!on[x.id] : !on[x.id]).length / AG.length;
    const seq = order.filter(id => on[id] && AGN.some(n => n.id === id)), corr = AGN.filter(n => on[n.id]).map(n => n.id);
    const ord = corr.length >= 2 ? ui.orderScore(seq, corr) * (corr.length / AGN.length) : 0;
    const score = goal.score * 0.2 + ppl * 0.25 + selOk * 0.3 + ord * 0.25;
    return { goal, ppl, pn, incl, total, selOk, ord, order, score, decOk: R.decide === 'nina' };
  }
  const agendaTask = {
    id: 'agenda', title: 'Повестка встречи: оплата на месте',
    simple: howMeet.simple,
    lead: ui.brief({
      situation: 'Пятница, 15:00. В 16:00 — встреча с Ниной Сергеевной и Олегом Петровичем: оставлять ли в первой версии оплату при получении. Олег Петрович против («иначе снова ручная сверка»), Нина — за («бабушки платят наличными»). У Нины 45 минут между двумя пекарнями. Ксения: «Соберите повестку и разошлите до 15:30. Встреча без повестки превращается в спор».',
      todo: [
        'Шаг 1: выберите цель встречи — одну фразу для приглашения.',
        'Шаг 2: нажатием отметьте, кого позвать, и назначьте роли: кто ведёт, кто записывает, кто принимает решение.',
        'Шаг 3: соберите повестку — включите нужные пункты (лишние оставьте выключенными) и расставьте их по порядку стрелками. Минуты у пунктов заданы: всё должно уложиться в 45 минут.',
        'Нажмите «Проверить». Засчитывается от 80 %; встреча укладывается в 45 минут, а решающий есть на встрече.'
      ],
      look: 'Полоса времени — сумма минут включённых пунктов: зелёная — укладываетесь, красная — перебор. Хорошая повестка идёт от фактов к решению: зачем собрались → как есть → что важно каждому → варианты → решение → кто что делает.'
    }),
    blank: () => ({ goal: [], inv: {}, roles: {}, on: {}, order: AGORD.slice() }),
    reference: () => ({ goal: quizRef(GOAL), inv: { nina: true, oleg: true, me: true, ksenia: true }, roles: { lead: 'me', notes: 'ksenia', decide: 'nina' }, on: Object.fromEntries(AGN.map(x => [x.id, true])), order: AGN.map(x => x.id).concat(AG.filter(x => !x.pos).map(x => x.id)) }),
    render(el, ctx) {
      el.classList.add('biz-root');
      const a = ctx.ans; a.inv = a.inv || {}; a.roles = a.roles || {}; a.on = a.on || {}; a.goal = a.goal || [];
      if (!Array.isArray(a.order) || a.order.length !== AG.length) a.order = AGORD.slice();
      const judged = !!(ctx.result || ctx.readonly);
      el.innerHTML = `<div class="stack">
        <div class="biz-lbl">Шаг 1 · Цель</div><div class="card flat" data-g></div>
        <div class="biz-lbl">Шаг 2 · Кого позвать и роли</div><div class="biz-ppl" data-p></div><div class="biz-roles" data-r></div>
        <div class="biz-lbl">Шаг 3 · Повестка</div>
        <div class="stack tight"><div class="biz-bar-l"><span data-tt></span><span>лимит ${LIMIT} мин</span></div><div class="biz-bar" data-bar></div></div>
        <div class="biz-ag" data-ag></div>
        ${ui.note('info', 'Позиция аналитика', 'Повестку готовит аналитик, рассылает её до встречи и ведёт по ней разговор. Решение принимает тот, кто вправе, — но без повестки, фактов и вариантов ему не из чего выбирать.')}
      </div>`;
      ui.quiz(TR.$('[data-g]', el), Object.assign({}, GOAL, { value: a.goal, readonly: ctx.readonly, reveal: ctx.result, onChange: v => { a.goal = v; ctx.save(); } }));
      function drawP() {
        TR.$('[data-p]', el).innerHTML = PP.map(p => `<button type="button" class="chip" data-pp="${p.id}" aria-pressed="${!!a.inv[p.id]}" ${ctx.readonly ? 'disabled' : ''}>${a.inv[p.id] ? '✓ ' : ''}${esc(p.t)} <small>${esc(p.sub)}</small></button>`).join('');
        const invd = PP.filter(p => a.inv[p.id]);
        TR.$('[data-r]', el).innerHTML = ROLES.map(r => `<label class="field"><span>${esc(r.t)}</span><select data-role="${r.id}" ${ctx.readonly ? 'disabled' : ''}><option value="">—</option>${invd.map(p => `<option value="${p.id}" ${a.roles[r.id] === p.id ? 'selected' : ''}>${esc(p.t)}</option>`).join('')}${a.roles[r.id] && !a.inv[a.roles[r.id]] ? `<option value="${a.roles[r.id]}" selected>${esc((PP.find(p => p.id === a.roles[r.id]) || {}).t || '')} (не приглашён)</option>` : ''}</select></label>`).join('');
      }
      function drawAg() {
        const inc = a.order.filter(id => a.on[id]), exc = a.order.filter(id => !a.on[id]);
        const total = inc.reduce((s, id) => s + AG.find(x => x.id === id).m, 0), over = total > LIMIT;
        TR.$('[data-tt]', el).textContent = `Сейчас: ${total} мин`;
        const sc = Math.max(LIMIT, total);
        TR.$('[data-bar]', el).innerHTML = `<i class="${over ? 'bad' : 'ok'}" style="width:${Math.min(total, LIMIT) / sc * 100}%"></i>${over ? `<i class="over" style="width:${(total - LIMIT) / sc * 100}%"></i><b style="left:calc(${LIMIT / sc * 100}% - 1px)"></b>` : ''}`;
        const row = (id, k, inOn) => {
          const x = AG.find(y => y.id === id);
          let cls = inOn ? '' : 'off';
          if (judged) cls += x.pos ? (inOn ? ' ok' : (ctx.readonly ? ' bad' : '')) : (inOn ? ' bad' : '');
          return `<div class="biz-ai ${cls}"><input type="checkbox" data-on="${id}" ${inOn ? 'checked' : ''} ${ctx.readonly ? 'disabled' : ''} aria-label="В повестку: ${esc(x.t)}"><span class="n">${inOn ? k + 1 : ''}</span><span>${esc(x.t)}${judged && !x.pos && inOn ? `<span class="small" style="display:block;color:var(--bad)">${esc(x.why)}</span>` : ''}</span><span class="min">${x.m} мин</span>${inOn && !ctx.readonly ? `<span class="mv"><button type="button" data-mv="-1" data-id="${id}" aria-label="Выше" ${k === 0 ? 'disabled' : ''}>↑</button><button type="button" data-mv="1" data-id="${id}" aria-label="Ниже" ${k === inc.length - 1 ? 'disabled' : ''}>↓</button></span>` : '<span></span>'}</div>`;
        };
        TR.$('[data-ag]', el).innerHTML = (inc.length ? inc.map((id, k) => row(id, k, true)).join('') : '<p class="small dim">Повестка пуста — включите пункты ниже.</p>')
          + (exc.length ? `<div class="biz-lbl" style="margin-top:6px">Не в повестке</div>${exc.map(id => row(id, 0, false)).join('')}` : '');
      }
      drawP(); drawAg();
      if (ctx.readonly) return;
      TR.on(el, 'click', '[data-pp]', (e, b) => { const id = b.dataset.pp; a.inv[id] = !a.inv[id]; if (!a.inv[id]) delete a.inv[id]; ctx.save(); drawP(); });
      el.addEventListener('change', e => {
        const s = e.target.closest('select[data-role]');
        if (s) { if (s.value) a.roles[s.dataset.role] = s.value; else delete a.roles[s.dataset.role]; ctx.save(); if (s.dataset.role === 'decide' && s.value) ctx.decide('Встреча об оплате: решает', (PP.find(p => p.id === s.value) || {}).t || s.value); return; }
        const c = e.target.closest('[data-on]');
        if (c) { const id = c.dataset.on; if (c.checked) { a.on[id] = true; a.order = a.order.filter(x => x !== id); const lastIn = a.order.reduce((m, x, i) => a.on[x] ? i : m, -1); a.order.splice(lastIn + 1, 0, id); } else delete a.on[id]; ctx.save(); drawAg(); }
      });
      TR.on(el, 'click', '[data-mv]', (e, b) => {
        const id = b.dataset.id, d = +b.dataset.mv, inc = a.order.filter(x => a.on[x]), k = inc.indexOf(id), other = inc[k + d];
        if (!other) return;
        const i = a.order.indexOf(id), j = a.order.indexOf(other);
        [a.order[i], a.order[j]] = [a.order[j], a.order[i]]; ctx.save(); drawAg();
      });
    },
    check(ans) {
      const ev = agEval(ans), notes = [];
      if (!ev.goal.ok) notes.push({ ok: false, html: 'Цель: что должно появиться к концу встречи — разговор или решение? И чьи интересы оно должно учесть?' });
      ev.pn.forEach(n => notes.push(n));
      const missing = AGN.filter(x => !ev.incl.includes(x)).length, extra = ev.incl.filter(x => !x.pos);
      if (missing) notes.push({ ok: false, html: `В повестке не хватает ${missing} ${TR.plural(missing, 'пункта', 'пунктов', 'пунктов')} из пути «факты → интересы → варианты → решение → итоги». Чего не хватает, чтобы дойти до решения?` });
      extra.forEach(x => notes.push({ ok: false, html: `«${esc(x.t)}» — нужен ли этот пункт, чтобы решить про оплату на месте?` }));
      if (ev.total > LIMIT) notes.push({ ok: false, html: `Повестка — ${ev.total} минут при лимите ${LIMIT}. Нина уедет до решения.` });
      if (ev.ord < 0.95 * (AGN.filter(x => ev.incl.includes(x)).length / AGN.length) && ev.incl.filter(x => x.pos).length >= 2) notes.push({ ok: 'warn', html: 'Порядок: можно ли выбирать вариант раньше, чем все услышали факты и интересы друг друга? Решение — после вариантов, итоги — в конце.' });
      const ok = ev.score >= 0.8 && ev.decOk && ev.total <= LIMIT && ev.goal.ok;
      if (ok && !notes.length) notes.push({ ok: true, html: 'Цель ясна, решающий в комнате, повестка ведёт от фактов к решению и укладывается в 45 минут.' });
      return {
        ok, score: ev.score, notes,
        summary: `Цель: ${ev.goal.ok ? 'верно' : 'неверно'}. Участники и роли: ${Math.round(ev.ppl * 100)} %. Пункты: ${Math.round(ev.selOk * 100)} %. Порядок: ${Math.round(ev.ord * 100)} %. Время: ${ev.total} из ${LIMIT} мин.`,
        mentor: !ev.decOk ? 'Самая дорогая ошибка встречи — отсутствие того, кто решает. Тогда все 45 минут — это обмен мнениями, а решение «перенесём».'
          : ev.incl.some(x => x.id === 'd1') ? 'Баллы — хорошая тема для другой встречи. Здесь она съест 10 минут и уведёт разговор от решения. Для таких тем — «парковка».' : null
      };
    },
    explain: `${ui.table(['№', 'Пункт', 'Мин'], AGN.map(x => [x.pos, esc(x.t), x.m]).concat([['', '<b>Итого</b>', '<b>43</b>']]))}
      <p><b>Цель — решение, а не обсуждение.</b> Формулировка сразу говорит, чьи интересы держим в голове: сверка у Олега Петровича и покупатели без карты у Нины. Так никто не приходит «защищаться».</p>
      <p><b>Люди и роли.</b> Решает Нина: это её сеть и её спор с главбухом (RACI из понедельника). Олег Петрович — обязательно: без него решение вернёт ручную сверку. Ведёт и записывает команда аналитиков — вдвоём, потому что ведущему некогда записывать. Павел и Дима — по желанию: Павел знает, как оплата на месте выглядит у кассы в пик, Дима может оценить варианты, но цену можно принести и после. Рите здесь делать нечего.</p>
      <p><b>Порядок повестки</b> повторяет переговоры по Фишеру и Юри: факты → интересы → варианты → критерии и решение → кто что делает. Посторонние темы — баллы, цвет кнопки, архитектура шлюза, поиск виноватых — на «парковку»: каждая съедает минуты, а вместе они не оставляют времени на решение. Источник — PRACTICES §2.1 и §3.</p>`,
    refNote: 'Засчитываются также: Ксения ведёт, вы записываете; Павел и Дима в списке приглашённых.',
    report: ans => { const ev = agEval(ans), a = ans || {}; return `Цель: ${(GOAL.options[(a.goal || [])[0]] || {}).t || '—'}\nПриглашены: ${PP.filter(p => (a.inv || {})[p.id]).map(p => p.t).join(', ') || '—'}\nРоли: ${ROLES.map(r => `${r.t} — ${(PP.find(p => p.id === (a.roles || {})[r.id]) || {}).t || '—'}`).join('; ')}\nПовестка (${ev.total} мин): ${ev.order.filter(id => (a.on || {})[id]).map(id => AG.find(x => x.id === id).t).join(' → ') || '—'}\nБалл ${Math.round(ev.score * 100)} %.`; }
  };

  // =====================================================================
  // Практика 2. Переговоры: оплата на месте (интересы под позициями + живая встреча)
  // =====================================================================
  const IR = [
    { id: 'r1', t: 'Олег Петрович: «Только онлайн-оплата!»', ok: 'i1' },
    { id: 'r2', t: 'Нина Сергеевна: «Оплата на месте должна остаться»', ok: 'i2' },
    { id: 'r3', t: 'Павел: «В пик предзаказы пусть выдаёт отдельный человек»', ok: 'i3' },
    { id: 'r4', t: 'Нина Сергеевна: «Лишнего человека в смену не дам»', ok: 'i4' },
    { id: 'r5', t: 'Галина Ивановна: «Раньше 07:30 круассан не гарантирую»', ok: 'i5' }
  ];
  const IC = [
    { v: 'i1', t: 'Не сверять продажи руками и не получить штраф за чеки' },
    { v: 'i2', t: 'Не потерять постоянных покупателей, которые не платят онлайн' },
    { v: 'i3', t: 'Чтобы живая очередь в пик не стояла' },
    { v: 'i4', t: 'Не раздувать фонд зарплаты ради новой системы' },
    { v: 'i5', t: 'Не обещать покупателям того, что цех не успевает' },
    { v: 'x1', t: 'Показать, кто здесь главный' },
    { v: 'x2', t: 'Чтобы ничего не менялось' },
    { v: 'x3', t: 'Закончить проект побыстрее' }
  ];
  const IR_HINT = { r1: 'Что случится с утром Олега Петровича, если часть оплат пойдёт мимо онлайна? И чем ещё он рискует по закону?', r2: 'Кто из покупателей платит на месте и что будет, если им станет неудобно?', r3: 'Что Павел видит каждое утро с 07:30 до 09:00?', r4: 'Отдельный человек в смену — это что для владелицы?', r5: 'Во сколько первая партия круассанов бывает на точке — и что будет, если клиенту пообещали 07:05?' };
  const RND = [
    { id: 'r1', narr: 'Нина Сергеевна и Олег Петрович садятся. Олег открывает ноутбук с Excel, Нина смотрит на часы: у неё 45 минут. Ваша первая фраза:', o: [
      { v: 'a', ok: 1, t: 'Спасибо, что нашли время. Цель — решить, какие способы оплаты будут в первой версии, так чтобы не вернулась ручная сверка и не потерялись покупатели без карты. В конце — решение и кто что делает.', d: { i: 10, o: 0, r: 10 }, re: [['nina', 'Хорошо, по делу. Начинайте.']] },
      { v: 'b', t: 'Давайте быстро: оплату на месте оставляем или нет? Голосуем.', d: { o: -5, r: -5 }, re: [['oleg', 'Голосуем? Нас двое, и мы за разное.']] },
      { v: 'c', t: 'Я подготовил(а) двадцать слайдов про платёжные шлюзы — начнём с архитектуры.', d: { r: -10 }, re: [['nina', 'Мне через 45 минут в пекарню. Давайте к делу.']] }] },
    { id: 'r2', say: ['oleg', 'Скажу сразу: только онлайн. Иначе я опять буду каждое утро сверять руками.'], o: [
      { v: 'a', ok: 1, t: 'Олег Петрович, расскажите, как выглядит утро сверки сейчас: что именно вы сверяете и где расходится?', d: { i: 35, r: 5 }, reveal: 'oleg', re: [['oleg', 'Девять точек, у каждой своя выгрузка. Онлайн, касса, а торты — вообще по тетради. Два часа ищу, где не сходится. А если чек не тот — штраф по 54-ФЗ, и отвечаю я.']] },
      { v: 'b', t: 'Нина Сергеевна уже решила: оплата на месте будет.', d: { r: -20 }, re: [['oleg', 'Тогда зачем меня позвали?']] },
      { v: 'c', t: 'Вы правы, давайте только онлайн.', d: { o: -10, r: -15 }, re: [['nina', 'А мои покупатели? Вы со мной это обсуждали?']] }] },
    { id: 'r3', say: ['nina', 'Бабушки платят наличными. Если оставить только онлайн — уйдут к соседям.'], o: [
      { v: 'a', ok: 1, t: 'Нина Сергеевна, а кто именно платит на месте? Им важны наличные — или чтобы не пришлось ничего делать в телефоне?', d: { i: 35, r: 5 }, reveal: 'nina', re: [['nina', 'Сорок процентов постоянных — старше пятидесяти пяти. Многие и заказывают через кассира. Им главное — прийти и заплатить, как привыкли: наличными или картой на кассе.']] },
      { v: 'b', t: 'Бабушки скоро научатся — все переходят на онлайн.', d: { r: -20 }, re: [['nina', 'Это мои покупатели пятнадцать лет. Я их не брошу.']] },
      { v: 'c', t: 'Это вопрос маркетинга, не мне решать.', d: { r: -10 }, re: [['nina', 'А кому? Вы же аналитик.']] }] },
    { id: 'r4', narr: ev => ev.rev.size === 2 ? 'Интересы на столе: у Олега Петровича — сверка и чеки, у Нины — покупатели, которые платят на кассе. Что дальше?' : `Позиции прозвучали, а интересы — ${ev.rev.size ? 'только у одного из двоих' : 'ни у кого'}. Что дальше?`, o: [
      { v: 'a', ok: 1, t: 'Давайте сначала накидаем варианты, не выбирая: оплата на месте через ту же кассу «КассаПро» по коду заказа — тогда она сама попадает в сводку; оплата на месте только для заказов через кассира; оплата на месте с лимитом суммы. Потом сравним.', d: { o: 45, r: 5 }, re: [['oleg', 'Через ту же кассу и по коду заказа? Тогда это одна выгрузка… Интересно.']] },
      { v: 'b', t: 'Предлагаю компромисс: оплата на месте только по вторникам и четвергам.', d: { o: 5, r: -5 }, re: [['oleg', 'Почему по вторникам? Это не решает ни мою сверку, ни её покупателей.']] },
      { v: 'c', t: 'Раз мнения разделились — пусть решит Игорь.', d: { r: -10 }, re: [['nina', 'Игорь? Это моя сеть. При чём тут Игорь?']] }] },
    { id: 'r5', say: ['oleg', 'Хорошо. А откуда я знаю, что сверка правда уйдёт?'], o: [
      { v: 'a', ok: 1, t: 'Давайте заранее договоримся о критериях: в пилоте в 2 пекарнях сверка — не дольше 15 минут в день, это цель проекта, и все чеки — по 54-ФЗ. Через месяц смотрим цифры вместе. Не сработает — возвращаемся к вопросу.', d: { o: 25, i: 10, r: 10 }, re: [['oleg', 'Пятнадцать минут я проверю лично. Согласен на пилот.']] },
      { v: 'b', t: 'Поверьте, у других клиентов так работает.', d: { r: -5 }, re: [['oleg', 'Других клиентов я не сверяю.']] },
      { v: 'c', t: 'Дима сказал, что всё будет хорошо.', d: { r: -5 }, re: [['oleg', 'Дима сверку не делает.']] }] },
    { id: 'r6', say: ['nina', 'Хорошо. Что решаем?'], o: [
      { v: 'a', ok: 1, out: 'close', t: 'Предлагаю записать: оплата на месте остаётся — через кассу «КассаПро» по коду заказа, в сводку попадает сама. Критерии — сверка до 15 минут и чеки по 54-ФЗ, смотрим через месяц пилота. Олег Петрович присылает пример сводки, я — письмо-итог сегодня. Решение за вами, Нина Сергеевна.', d: { o: 10, r: 5 }, re: [['nina', 'Так и решим. Жду письмо.']] },
      { v: 'b', out: 'vague', t: 'Решайте сами, а я потом напишу, что получилось.', d: { r: -5 }, re: [['nina', 'Я думала, вы поможете нам решить…']] },
      { v: 'c', out: 'pressure', t: 'Раз Нина Сергеевна за — значит, оплата на месте. Олег Петрович как-нибудь справится.', d: { r: -25 }, re: [['oleg', 'Как-нибудь? Хорошо. Только сверять это будете вы.']] }] }
  ];
  const RHINT = {
    r1: 'Первая фраза задаёт встречу. Знают ли участники, что решаем и чьи интересы держим в голове?',
    r2: 'Олег Петрович назвал позицию. Что за ней стоит? Спросите о его прошлом опыте, а не спорьте.',
    r3: 'Нина назвала позицию. Кто эти покупатели и что для них важно на самом деле?',
    r4: 'Сначала варианты, потом выбор — и вариант должен закрывать оба интереса, а не делить спор пополам.',
    r5: 'Как договориться без «поверьте»? Что можно измерить в пилоте?',
    r6: 'Кто решает и что должно остаться после встречи: решение, критерии, кто что делает?'
  };
  const NB = { oleg: 'Олег Петрович: не сверять 9 точек руками по 2 часа и не получить штраф за чеки', nina: 'Нина Сергеевна: покупатели 55+ платят на кассе, как привыкли, — их не потерять' };
  function talkEval(ans) {
    const a = ans || {}, M = a.m || {}, S = a.s || {};
    const mOk = IR.filter(r => M[r.id] === r.ok).length;
    let i = 0, o = 0, r = 60; const rev = new Set();
    const rows = RND.map(rd => { const x = rd.o.find(y => y.v === S[rd.id]); if (x) { i += x.d.i || 0; o += x.d.o || 0; r += x.d.r || 0; if (x.reveal) rev.add(x.reveal); } return { rd, x, ok: !!(x && x.ok) }; });
    i = clamp(i, 0, 100); o = clamp(o, 0, 100); r = clamp(r, 0, 100);
    const last = rows[rows.length - 1].x;
    const out = !last ? '' : last.out === 'close' ? (i >= 60 && o >= 60 ? 'criteria' : 'shaky') : last.out;
    const good = rows.filter(x => x.ok).length;
    return { mOk, rows, i, o, r, rev, out, good, done: rows.filter(x => x.x).length, score: mOk / IR.length * 0.3 + good / RND.length * 0.7 };
  }
  const OUT = {
    criteria: { k: 'ok', t: 'Решение по объективным критериям', d: 'Оплата на месте остаётся через кассу «КассаПро» по коду заказа, в сводку — автоматически. Критерии — сверка до 15 минут и чеки по 54-ФЗ, через месяц пилота — проверка цифр. Оба вышли со встречи со своим интересом.' },
    shaky: { k: 'warn', t: 'Решение есть, но на шатком основании', d: 'Слова правильные, но кто-то из участников так и не был услышан или вариантов было мало. Такое решение пересматривают на следующей же неделе.' },
    vague: { k: 'bad', t: 'Разошлись без решения', d: 'Через неделю — та же встреча и тот же спор. Пилот ближе на неделю.' },
    pressure: { k: 'bad', t: 'Решение давлением', d: 'Формально решили, но Олег Петрович не согласен и будет искать, где «не сходится». Проигравший в переговорах — будущий противник проекта.' }
  };
  const talksTask = {
    id: 'talks', title: 'Переговоры: Нина, Олег Петрович и оплата на месте',
    simple: howYes.simple,
    lead: ui.brief({
      situation: 'Пятница, 16:00, офис «Колоса» на Московском шоссе. Повестка разослана. Перед встречей Ксения: «Помните, они не враги друг другу. За „только онлайн“ и „оплата на месте“ стоят интересы — найдите их, и спорить станет не о чем». Ведёте вы.',
      todo: [
        'Шаг 1, разминка: под каждой позицией из споров «Колоса» выберите интерес — почему человек этого требует.',
        'Шаг 2, встреча: читайте реплики и выбирайте свои. Следите за шкалами «Интересы раскрыты», «Варианты» и «Отношения» и за блокнотом встречи. Шесть ходов — в конце решение (или нет).',
        'Нажмите «Проверить». Засчитывается от 80 %, и встреча должна закончиться решением по объективным критериям. «Начать встречу заново» сбрасывает ходы.'
      ],
      look: 'Блокнот встречи: серым — позиции, зелёным — найденные интересы. Хорошее решение получается, когда интересы раскрыты и вариантов несколько — от 60 по обеим шкалам. Отношения падают от давления и споров о позициях.'
    }),
    blank: () => ({ m: {}, s: {} }),
    reference: () => ({ m: Object.fromEntries(IR.map(r => [r.id, r.ok])), s: Object.fromEntries(RND.map(r => [r.id, 'a'])) }),
    render(el, ctx) {
      el.classList.add('biz-root');
      const a = ctx.ans; a.m = a.m || {}; a.s = a.s || {};
      const judged = !!(ctx.result || ctx.readonly);
      el.innerHTML = `<div class="stack">
        <div class="biz-lbl">Шаг 1 · Позиция → интерес</div><div data-mt></div>
        <div class="biz-lbl">Шаг 2 · Встреча 16:00</div>
        <div class="biz-meters" data-me></div>
        <div class="biz-nb" data-nb></div>
        <div class="stack" data-chat></div>
        <div data-out></div>
        <div class="row" data-rs></div>
      </div>`;
      let mrev = null;
      if (judged) { mrev = {}; IR.forEach(r => { if (a.m[r.id]) mrev[r.id] = { s: a.m[r.id] === r.ok ? 'ok' : 'bad' }; }); }
      ui.match(TR.$('[data-mt]', el), { rows: IR.map(r => ({ id: r.id, t: esc(r.t) })), choices: IC, value: a.m, readonly: ctx.readonly, reveal: mrev, placeholder: 'Интерес…', onChange: v => { a.m = v; ctx.save(); } });
      function draw() {
        const ev = talkEval(a), k = v => v >= 60 ? '' : v >= 30 ? 'warn' : 'bad';
        TR.$('[data-me]', el).innerHTML = [['Интересы раскрыты', ev.i], ['Варианты', ev.o], ['Отношения', ev.r]].map(([t, v]) => `<div class="stat"><span class="k">${t}</span><span class="v ${k(v)}">${v}</span>${ui.meter(v / 100, k(v))}</div>`).join('');
        TR.$('[data-nb]', el).innerHTML = `<div class="biz-lbl">Блокнот встречи</div>
          <div class="it pos"><span>·</span><span>Олег Петрович: «только онлайн» — позиция</span></div>
          <div class="it pos"><span>·</span><span>Нина Сергеевна: «оплата на месте» — позиция</span></div>
          ${['oleg', 'nina'].filter(x => ev.rev.has(x)).map(x => `<div class="it int"><span>✓</span><span>${esc(NB[x])}</span></div>`).join('')}`;
        let h = '';
        for (const rd of RND) {
          if (rd.narr) h += `<div class="biz-narr">${esc(typeof rd.narr === 'function' ? rd.narr(ev) : rd.narr)}</div>`;
          if (rd.say) h += ui.say(rd.say[0], esc(rd.say[1]));
          const pick = rd.o.find(x => x.v === a.s[rd.id]);
          if (pick) {
            const tag = judged ? `<div>${pick.ok ? ui.status('сильный ход', 'ok') : ui.status('слабый ход', 'bad')}</div>` : '';
            h += ui.say('me', esc(pick.t) + tag);
            pick.re.forEach(([w, t]) => { h += ui.say(w, esc(t)); });
            continue;
          }
          if (ctx.readonly) break;
          const order = TR.shuffle(rd.o.map(x => x.v), 'biz-' + rd.id);
          h += `<div class="biz-opts">${order.map(v => { const x = rd.o.find(y => y.v === v); return `<button type="button" class="biz-opt" data-rd="${rd.id}|${x.v}">${esc(x.t)}</button>`; }).join('')}</div>`;
          break;
        }
        TR.$('[data-chat]', el).innerHTML = h;
        const o = ev.out && OUT[ev.out];
        TR.$('[data-out]', el).innerHTML = o ? `<div class="biz-out ${o.k}"><b class="h">${esc(o.t)}</b><span>${esc(o.d)}</span></div>` : '';
        TR.$('[data-rs]', el).innerHTML = !ctx.readonly && Object.keys(a.s).length ? '<button type="button" class="btn sm ghost" data-reset>⟲ Начать встречу заново</button>' : '';
      }
      TR.on(el, 'click', '[data-rd]', (e, b) => {
        if (ctx.readonly) return;
        const [rid, v] = b.dataset.rd.split('|'); a.s[rid] = v; ctx.save();
        if (rid === 'r6') { const ev = talkEval(a); ctx.decide('Итог встречи об оплате', OUT[ev.out] ? OUT[ev.out].t : v); }
        draw();
      });
      TR.on(el, 'click', '[data-reset]', () => { if (ctx.readonly) return; a.s = {}; ctx.save(); draw(); });
      draw();
    },
    check(ans) {
      const ev = talkEval(ans), notes = [], M = (ans && ans.m) || {};
      IR.forEach(r => { if (M[r.id] !== r.ok) notes.push({ ok: false, html: `${esc(r.t)} — ${M[r.id] ? 'интерес не тот' : 'интерес не выбран'}. ${IR_HINT[r.id]}` }); });
      if (ev.done < RND.length) notes.push({ ok: false, html: `Встреча не закончена: ${ev.done} из ${RND.length} ходов.` });
      ev.rows.forEach((x, k) => { if (x.x && !x.ok) notes.push({ ok: false, html: `Ход ${k + 1}: ${RHINT[x.rd.id]}` }); });
      if (ev.out && ev.out !== 'criteria') notes.push({ ok: ev.out === 'shaky' ? 'warn' : false, html: `Итог встречи: «${OUT[ev.out].t}». ${ev.out === 'shaky' ? 'Посмотрите на шкалы интересов и вариантов — где меньше 60?' : 'Решение должно быть принято тем, кто вправе, и по критериям, которые можно проверить.'}` });
      const ok = ev.score >= 0.8 && ev.out === 'criteria';
      if (ok && !notes.length) notes.push({ ok: true, html: 'Интересы найдены, варианты придуманы до выбора, решение — по критериям, которые проверит сам Олег Петрович.' });
      return {
        ok, score: ev.score, notes,
        summary: `Интересы под позициями: ${ev.mOk} из ${IR.length}. Сильных ходов: ${ev.good} из ${RND.length}. Шкалы: интересы ${ev.i}, варианты ${ev.o}, отношения ${ev.r}.${ev.out ? ` Итог: ${OUT[ev.out].t.toLowerCase()}.` : ''}`,
        mentor: ev.out === 'pressure' ? 'Вы «выиграли» за Нину — и получили Олега Петровича в противники. По Фишеру и Юри хорошее соглашение — то, которое обе стороны готовы выполнять.'
          : ev.rows.some(x => x.x && x.x.v === 'b' && x.rd.id === 'r4') ? 'Компромисс «по вторникам» — классическое «поделить апельсин пополам». Он не закрывает ничей интерес. Ищите вариант, где каждый получает своё.' : null
      };
    },
    explain: `<p><b>Шесть ходов — четыре принципа Фишера и Юри.</b></p>
      <ol>
        <li><b>Цель вместо «голосуем».</b> Первая фраза отделяет людей от проблемы: мы вместе решаем, как не вернуть сверку и не потерять покупателей.</li>
        <li><b>Интересы, а не позиции.</b> Под «только онлайн» — «не сверять 9 точек по 2 часа и не получить штраф» (54-ФЗ). Под «оплата на месте» — «покупатели 55+ платят на кассе, как привыкли» (их 40 % постоянных). Их находят вопросом о прошлом опыте, а не спором.</li>
        <li><b>Варианты до выбора.</b> «Через ту же кассу по коду заказа» закрывает оба интереса сразу: оплата на месте остаётся, но в сводку попадает автоматически. «По вторникам» — деление апельсина пополам, оно не закрывает ничего.</li>
        <li><b>Объективные критерии.</b> Не «поверьте», а цифры пилота: сверка до 15 минут (цель проекта, БЦ-4) и чеки по 54-ФЗ. Через месяц — проверка, а не спор.</li>
      </ol>
      <p>И последний ход — решение принимает тот, кто вправе (Нина), а аналитик фиксирует: кто что делает и письмо-итог сегодня. Разминка с позициями Павла, Галины Ивановны и Нины — те же противоречия из блокнота (DOMAIN §5): у каждого — свой интерес, и он почти всегда разумен. Источник: Роджер Фишер, Уильям Юри, «Переговоры без поражения» (Getting to Yes).</p>`,
    report: ans => { const ev = talkEval(ans), M = (ans && ans.m) || {}; return IR.map(r => `- ${r.t} → ${(IC.find(c => c.v === M[r.id]) || {}).t || '—'} ${M[r.id] === r.ok ? '✓' : '✗'}`).join('\n') + '\n' + ev.rows.map((x, k) => `${k + 1}. ${x.x ? x.x.t : '—'} ${x.x ? (x.ok ? '✓' : '✗') : ''}`).join('\n') + `\nИтог: ${ev.out ? OUT[ev.out].t : '—'}; интересы ${ev.i}, варианты ${ev.o}, отношения ${ev.r}.`; }
  };

  // =====================================================================
  // Практика 3. Письмо-итог: мини-редактор с проверкой признаков
  // =====================================================================
  const L = 'а-яё';
  const STOP = [
    [/в ходе/gi, 'в ходе'], [/было принято|принято решение/gi, 'было принято решение'], [/осуществл[а-яё]*/gi, 'осуществлять'], [/в рамках/gi, 'в рамках'],
    [new RegExp(`(^|[^${L}])данн(ый|ого|ому|ым|ая|ой|ую|ом)(?![${L}])`, 'gi'), 'данный'], [/являет[а-яё]*/gi, 'является'], [/имеет место/gi, 'имеет место'], [/целесообразн[а-яё]*/gi, 'целесообразность'],
    [/к сведению/gi, 'принять к сведению'], [/в рабочем порядке/gi, 'в рабочем порядке'], [/проработ[а-яё]*/gi, 'проработать'], [/в целях/gi, 'в целях'],
    [/в настоящее время/gi, 'в настоящее время'], [/вышеуказанн[а-яё]*|вышеизложенн[а-яё]*/gi, 'вышеуказанный'], [/связанн(ые|ых|ым) с/gi, 'связанные с'], [/по итогам обсуждения/gi, 'по итогам обсуждения']
  ];
  const RE_FACT = /\d+([.,]\d+)?\s*(%|₽|(процент|час|мин|пекар|точ[еклиа]|руб|тыс|чек|заказ|покупател|клиент)[а-яё]*)/gi;
  const RE_DEC = /решили|договорились|решение:/i;
  const RE_OWN = new RegExp(`(Олег|Нин[аеуыо]|Павел|Павл|Ксени|Дим[аеуыо]|Игор|Рит[аеуыо]|Галин|(^|[^${L}])(мы|я)(?![${L}]))`, 'i');
  const RE_DUE = /до\s+(\d{1,2}([.\s]\d{1,2}|\s+(октября|ноября|декабря|января))|понедельника|вторника|среды|четверга|пятницы|субботы|конца)/i;
  const RE_CONF = /подтверд|поправьте|если.{0,40}(не так|ошиб|неточн)|правки/i;
  const LT_DRAFT = { subj: 'Встреча', text: 'Добрый день!\n\nВ ходе совещания были рассмотрены вопросы, связанные с осуществлением оплаты в рамках проекта. По итогам обсуждения было принято решение о целесообразности сохранения оплаты на месте при условии проработки вопроса интеграции. Данный вопрос является приоритетным.\n\nТакже имеет место ряд открытых вопросов, которые будут проработаны в рабочем порядке.\n\nПросим принять к сведению.\n\nС уважением, команда «Квант Софт»' };
  const LT_REF = { subj: 'Итоги встречи 23.10: оплата на месте остаётся — прошу подтвердить до 27.10', text: 'Нина Сергеевна, Олег Петрович, добрый вечер!\n\nКоротко об итогах встречи.\n\nЧто выяснили:\n— Олег Петрович сейчас сводит продажи 9 пекарен руками — около 2 часов каждое утро. Цель — 15 минут.\n— 40 % постоянных покупателей старше 55 лет, многие платят на месте.\n— По 54-ФЗ нужны два чека: «предоплата» и полный расчёт.\n\nЧто решили:\n— Оплата на месте остаётся. Принимаем её через кассу «КассаПро» по коду заказа — так она сама попадает в сводку для 1С.\n— Через месяц пилота смотрим цифры: сверка не дольше 15 минут в день, все чеки по 54-ФЗ.\n\nОткрытые вопросы:\n— Пример сводки для 1С — Олег Петрович, до 28 октября.\n— Как часто не забирают неоплаченные заказы — Павел, данные за 2 недели, до 6 ноября.\n— Нужен ли лимит суммы для оплаты на месте — решает Нина Сергеевна до 30 октября; варианты с ценой пришлю я до 28 октября.\n\nЕсли я что-то понял(а) не так — поправьте, пожалуйста, до 27 октября. Если правок нет, считаем решения согласованными.\n\nАналитик проекта, «Квант Софт»' };
  function stopHits(t) { const out = []; STOP.forEach(([re, w]) => { re.lastIndex = 0; if (re.test(t)) out.push(w); re.lastIndex = 0; }); return out; }
  function ltEval(ans) {
    const subj = String((ans && ans.subj) || ''), text = String((ans && ans.text) || ''), body = text.trim();
    const facts = new Set((body.match(RE_FACT) || []).map(x => x.toLowerCase().replace(/\s+/g, ' '))).size;
    const qLines = body.split('\n').filter(l => RE_OWN.test(l) && RE_DUE.test(l) && !RE_CONF.test(l)).length;
    const stops = stopHits(subj + '\n' + body);
    const C = [
      { id: 'subj', t: 'Тема говорит, о чём письмо и что нужно от читателя', ok: subj.trim().length >= 12 && /итог|решил|решени|оплат/i.test(subj) && !/^\s*(встреча|совещание)\s*$/i.test(subj), hint: 'Тема «Встреча» потеряется среди сотни писем. Что решили и что нужно от читателя — уже в теме.' },
      { id: 'facts', t: 'Факты с цифрами — хотя бы два', ok: facts >= 2, crit: 1, hint: 'Что выяснили — в цифрах: сколько часов сверки, сколько пекарен, какая доля покупателей. Цифры — в заметках со встречи.' },
      { id: 'dec', t: 'Решения — отдельно и словами «решили» / «договорились»', ok: RE_DEC.test(body), crit: 1, hint: '«Было принято решение о целесообразности» — а что именно решили? Одно решение — одно действие.' },
      { id: 'open', t: 'Открытые вопросы: у каждого ответственный и срок — хотя бы два', ok: qLines >= 2, crit: 1, hint: 'Каждый вопрос — отдельной строкой: что, кто (имя) и до какой даты («до 28 октября»).' },
      { id: 'conf', t: 'Просьба подтвердить или поправить', ok: RE_CONF.test(body), crit: 1, hint: '«Принять к сведению» не просит ответа. Попросите поправить до даты — и скажите, что будет, если правок нет.' },
      { id: 'clean', t: 'Без канцелярита', ok: !stops.length, crit: 1, hint: `Канцелярит: ${stops.map(s => '«' + s + '»').join(', ')}. Как сказать проще?` },
      { id: 'len', t: 'Коротко: от 300 до 1500 знаков', ok: body.length >= 300 && body.length <= 1500, hint: body.length < 300 ? 'Слишком коротко — всё ли важное попало?' : 'Длинновато: читатель бросит на середине. Что можно убрать?' }
    ];
    const n = C.filter(c => c.ok).length;
    return { C, n, score: n / C.length, critOk: C.filter(c => c.crit).every(c => c.ok), facts, qLines, stops, len: body.length };
  }
  function ltPreview(subj, text) {
    const lines = String(text || '').split('\n');
    const body = lines.map(ln => {
      const ranges = [];
      const add = (re, cls) => { re.lastIndex = 0; let m; while ((m = re.exec(ln))) { if (!m[0].length) { re.lastIndex++; continue; } let s = m.index, e = s + m[0].length; if (cls === 'bad' && m[1] != null && /^[^а-яё]?$/i.test(m[1]) && m[0].length > m[1].length && re.source.startsWith('(^|')) s += m[1].length; ranges.push([s, e, cls]); } re.lastIndex = 0; };
      STOP.forEach(([re]) => add(re, 'bad'));
      add(RE_FACT, 'f');
      add(/решили|договорились/gi, 'd');
      ranges.sort((x, y) => x[0] - y[0]);
      let out = '', p = 0;
      ranges.forEach(([s, e, c]) => { if (s < p) return; out += esc(ln.slice(p, s)) + `<mark class="biz-m ${c}">${esc(ln.slice(s, e))}</mark>`; p = e; });
      out += esc(ln.slice(p));
      const cls = RE_CONF.test(ln) ? 'cf' : RE_OWN.test(ln) && RE_DUE.test(ln) ? 'q' : '';
      return `<div class="ln ${cls}">${out || '&nbsp;'}</div>`;
    }).join('');
    return `<div class="biz-mail biz-mk"><div class="hd"><span>Тема:</span>${esc(subj || '—')}</div><div class="bd" style="white-space:normal">${body}</div></div>`;
  }
  const letterTask = {
    id: 'letter', title: 'Письмо-итог: отредактируйте черновик',
    simple: howMeet.simple,
    lead: ui.brief({
      situation: 'Встреча закончилась в 16:45 — решение есть. Ксения: «Черновик письма я набросала на бегу, в такси, — он ужасен. Перепишите: факты с цифрами, решения, открытые вопросы — у каждого ответственный и срок, просьба подтвердить. Коротко и без канцелярита. Отправить надо сегодня». Заметки со встречи — рядом с редактором.',
      todo: [
        'Перепишите тему и текст письма прямо в редакторе. Цифры и договорённости берите из заметок со встречи.',
        'Следите за живой проверкой под редактором и за предпросмотром: цифры подсвечиваются синим, решения — зелёным, строки «кто и до когда» — жёлтым, канцелярит — зачёркнут красным.',
        'Нажмите «Проверить». Засчитывается, когда выполнены все пять главных признаков (факты, решения, вопросы с ответственными и сроками, просьба подтвердить, без канцелярита) и не меньше 6 из 7 признаков в целом.'
      ],
      look: 'Проверка ищет признаки по словам и цифрам, а не понимает смысл: «Олег Петрович, до 28 октября» в одной строке она увидит, а «Олегу — к концу месяца» может не заметить. Пишите каждый открытый вопрос отдельной строкой.'
    }),
    blank: () => TR.clone(LT_DRAFT),
    reference: () => TR.clone(LT_REF),
    render(el, ctx) {
      el.classList.add('biz-root');
      const a = ctx.ans; if (a.subj == null) a.subj = LT_DRAFT.subj; if (a.text == null) a.text = LT_DRAFT.text;
      el.innerHTML = `<div class="stack">
        <div class="biz-ed">
          <div class="stack tight">
            <label class="field"><span>Тема</span><input type="text" data-subj value="${esc(a.subj)}" ${ctx.readonly ? 'readonly' : ''}></label>
            <label class="field"><span>Текст письма</span><textarea data-text ${ctx.readonly ? 'readonly' : ''}>${esc(a.text)}</textarea></label>
            <div class="row"><span class="small dim" data-len></span>${ctx.readonly ? '' : '<button type="button" class="btn xs ghost" data-restore>Вернуть черновик Ксении</button>'}</div>
          </div>
          <div class="stack tight">
            <div class="biz-notes"><b>Заметки со встречи 23.10 (Ксения)</b><ul>
              <li>Олег П.: сверка 9 пекарен руками ~2 ч каждое утро; цель проекта — 15 мин.</li>
              <li>Нина: 40 % постоянных — старше 55, многие платят на месте.</li>
              <li>54-ФЗ: чек «предоплата» + чек полного расчёта.</li>
              <li><b>Решили:</b> оплата на месте остаётся — через кассу «КассаПро» по коду заказа, в сводку для 1С сама.</li>
              <li><b>Критерии:</b> пилот (2 пекарни) — сверка ≤ 15 мин в день, все чеки по 54-ФЗ; смотрим через месяц.</li>
              <li>Открыто: пример сводки — Олег П. до 28.10; как часто не забирают неоплаченные заказы — Павел, данные за 2 недели, до 6.11; лимит суммы для оплаты на месте — решает Нина до 30.10, варианты — мы до 28.10.</li>
            </ul></div>
            <div class="biz-lbl">Живая проверка</div><ul class="checks biz-chk" data-chk></ul>
          </div>
        </div>
        <div class="biz-lbl">Предпросмотр с разметкой</div>
        <div data-prev></div>
        ${LEG}
        ${ui.note('info', 'Позиция аналитика', 'Письмо-итог пишет тот, кто вёл встречу, — в тот же день. Оно становится источником для реестра требований: «оплата на месте через кассу по коду заказа — согласовано 23.10, письмо-итог». Если через месяц кто-то вспомнит иначе, письмо найдётся поиском.')}
      </div>`;
      function draw() {
        const ev = ltEval(a);
        TR.$('[data-chk]', el).innerHTML = ev.C.map(c => `<li class="${c.ok ? '' : c.crit ? 'bad' : 'warn'}"><b>${esc(c.t)}</b>${c.ok ? '' : `<div class="small muted">${esc(c.hint)}</div>`}</li>`).join('');
        TR.$('[data-len]', el).textContent = `${ev.len} знаков · признаков ${ev.n} из ${ev.C.length}`;
        TR.$('[data-prev]', el).innerHTML = ltPreview(a.subj, a.text);
      }
      if (!ctx.readonly) {
        el.addEventListener('input', e => {
          if (e.target.matches('[data-subj]')) a.subj = e.target.value;
          else if (e.target.matches('[data-text]')) a.text = e.target.value;
          else return;
          ctx.save(); draw();
        });
        TR.on(el, 'click', '[data-restore]', () => { a.subj = LT_DRAFT.subj; a.text = LT_DRAFT.text; TR.$('[data-subj]', el).value = a.subj; TR.$('[data-text]', el).value = a.text; ctx.save(); draw(); });
      }
      draw();
    },
    check(ans) {
      const ev = ltEval(ans), notes = [];
      ev.C.forEach(c => { if (!c.ok) notes.push({ ok: c.crit ? false : 'warn', html: `<b>${esc(c.t)}.</b> ${esc(c.hint)}` }); });
      const ok = ev.critOk && ev.n >= 6;
      if (ok) notes.push({ ok: true, html: 'Все главные признаки письма-итога на месте. Нина прочтёт за минуту, Олег Петрович найдёт свои цифры.' });
      return {
        ok, score: ev.score, notes,
        summary: `Признаков: ${ev.n} из ${ev.C.length}. Цифр-фактов: ${ev.facts}, вопросов с ответственным и сроком: ${ev.qLines}${ev.stops.length ? `, канцелярита: ${ev.stops.length}` : ''}.`,
        mentor: ev.stops.length >= 4 ? 'Канцелярит прячет смысл: «было принято решение о целесообразности» звучит солидно, но никто не скажет, что именно решили. Пишите так, как сказали бы Нине вслух.' : (!ok && ev.qLines < 2 ? 'Открытый вопрос без хозяина и срока не закроется никогда: каждый будет уверен, что его делает кто-то другой.' : null)
      };
    },
    explain: `<p>Эталонное письмо — в эталоне ответа. Почему оно устроено так:</p>
      <ul class="checks">
        <li><b>Тема — краткий итог и просьба:</b> «оплата на месте остаётся — прошу подтвердить до 27.10». Через месяц письмо найдётся поиском.</li>
        <li><b>Факты с цифрами:</b> 9 пекарен, 2 часа сверки, цель 15 минут, 40 % покупателей старше 55, два чека по 54-ФЗ. Цифры — то, о чём потом не спорят.</li>
        <li><b>Решения отдельно</b> — и вместе с критериями: решение без критерия — повод вернуться к спору.</li>
        <li><b>Открытые вопросы — кто и до когда.</b> Вопрос без хозяина не закрывается. Аналитик тоже в списке: «варианты с ценой пришлю я».</li>
        <li><b>Просьба подтвердить</b> с датой и правилом молчания: «если правок нет, считаем согласованным». Так письмо становится согласованием (PRACTICES §3).</li>
        <li><b>Без канцелярита:</b> «в ходе совещания» → «на встрече», «было принято решение о целесообразности» → «решили», «в рабочем порядке» → «кто и до когда».</li>
      </ul>
      <p>Источники: PRACTICES §2.3 (письмо-итог в течение суток); Максим Ильяхов, Людмила Сарычева — «Пиши, сокращай» и «Новые правила деловой переписки» (одна мысль — один абзац, конкретика вместо оценок, без канцелярита).</p>`,
    refNote: 'Проверка — по признакам, а не по смыслу: любое письмо, где есть цифры-факты, «решили», не меньше двух строк «кто — до когда», просьба поправить и нет канцелярита, будет засчитано. Смысл сверяйте с заметками.',
    report: ans => { const ev = ltEval(ans); return `Тема: ${(ans && ans.subj) || '—'}\n\n${(ans && ans.text) || '—'}\n\nПризнаки: ${ev.C.map(c => `${c.ok ? '✓' : '✗'} ${c.t}`).join('; ')}`; }
  };

  // =====================================================================
  // Практика 4. Скажите «нет» Рите
  // =====================================================================
  const NO_ROWS = [
    { id: 'n1', t: '«Нет. Это не входит в объём первой версии, обсуждать не будем»', ok: 'pos' },
    { id: 'n2', t: '«Окей, пять минут — сделаем, раз нужно»', ok: 'cap' },
    { id: 'n3', t: '«Скидки — это маркетинг, к системе этот вопрос не относится»', ok: 'away' }
  ];
  const NO_CH = [
    { v: 'pos', t: 'Позиция без интереса и вариантов' },
    { v: 'cap', t: 'Уступка без цены и последствий' },
    { v: 'away', t: 'Уход от ответственности' },
    { v: 'good', t: 'Хороший ответ — можно отправлять' }
  ];
  const RE_OPTLINE = /^\s*(\d+[.)]|[-—•–])\s+\S/gm;
  function noEval(ans) {
    const a = ans || {}, M = a.m || {}, t = String(a.text || '');
    const diag = NO_ROWS.filter(r => M[r.id] === r.ok).length / NO_ROWS.length;
    const optLines = (t.match(RE_OPTLINE) || []).length;
    const opts = optLines >= 2 || (/(два|три|несколько|оба|пару) вариант/i.test(t) && /(^|[^а-яё])(или|либо)(?![а-яё])/i.test(t));
    const K = [
      { id: 'k1', t: 'Признаёте интерес Риты', ok: /остатк|списан|распрод|вечерн|меньше выбрас|понимаю|понятн/i.test(t), hint: 'Чего Рита хочет на самом деле? Не скидки ради скидки — а чего? Покажите, что услышали.' },
      { id: 'k2', t: 'Называете цену или последствия', ok: new RegExp(`недел|(^|[^а-яё])дн(я|ей)(?![а-яё])|срок|план выпечки|Галин|утренн|ждать|сдвин|стоит|оценк|цен[аыу]`, 'i').test(t), crit: 1, hint: 'Что будет с планом выпечки и утренними продажами? Сколько это работы и что сдвинется?' },
      { id: 'k3', t: 'Предлагаете хотя бы два варианта', ok: opts, crit: 1, hint: 'Дайте выбор: каждый вариант — отдельной строкой («1) …», «2) …»). Например, «не сейчас, а проверить так-то» и «сейчас, но ценой того-то».' },
      { id: 'k4', t: 'Решение — за тем, кто вправе решать', ok: /Нин|владел|решит|решать|решение за|вынес|на встрече/i.test(t), crit: 1, hint: 'Кто решает, что войдёт в первую версию? Не вы и не Рита.' },
      { id: 'k5', t: 'Без голого «нельзя»', ok: t.trim().length > 0 && !/нельзя|невозможно|не входит|не положено|не обсуждается|не моя|не наше дело|не ко мне/i.test(t), crit: 1, hint: '«Нельзя» и «не входит» закрывают разговор. Как сказать то же самое через варианты?' },
      { id: 'k6', t: 'Тон без упрёков', ok: t.trim().length > 0 && !/опять|сколько можно|вы всегда|ты всегда|не понимаешь|не понимаете|глупост|бред|ерунд/i.test(t), hint: 'Рита — не враг: у неё тоже интерес. Уберите упрёк.' },
      { id: 'k7', t: 'Развёрнуто: от 250 знаков', ok: t.trim().length >= 250, hint: 'Слишком коротко — в одну строку варианты с ценой не уместить.' }
    ];
    const n = K.filter(k => k.ok).length;
    return { diag, K, n, score: diag * 0.3 + n / K.length * 0.7, critOk: K.filter(k => k.crit).every(k => k.ok) };
  }
  const NO_REF = 'Рита, идея понятная: меньше остатков вечером — меньше списаний, а это главная боль Нины Сергеевны.\nНо это не пять минут: Галина Ивановна опасается, что покупатели начнут ждать 19:00, утренние продажи упадут и план выпечки сломается. Плюс правила скидки, чеки и проверка — Дима даст оценку.\nПредлагаю два варианта:\n1) В первую версию не берём. После запуска — пилот в одной пекарне на 2 недели: смотрим, сколько остатков ушло и не просели ли продажи днём.\n2) Если скидка нужна к 1 марта — берём, но вместо чего-то из первой версии или со сдвигом срока. Цену принесу вместе с Димой.\nВынесу оба варианта Нине Сергеевне на ближайшую встречу — решать ей. Подготовишь, сколько выпечки остаётся вечером?';
  const noTask = {
    id: 'no', title: 'Скажите «нет» Рите — с вариантами и ценой',
    simple: howTalk.simple,
    lead: ui.brief({
      situation: 'Вечер пятницы. Рита пишет в общий чат проекта: «Пока все в сборе — давайте в первую версию ещё скидку 30 % на выпечку после 19:00! Распродадим остатки, это же пять минут работы!». Галина Ивановна на прошлой неделе говорила: «Тогда все будут ждать 19:00, и план выпечки сломается». В чат уже накидали три черновика ответа.',
      todo: [
        'Шаг 1: определите, что не так с каждым из трёх черновиков.',
        'Шаг 2: напишите свой ответ Рите. Следите за живой проверкой рядом с полем: интерес Риты, цена и последствия, хотя бы два варианта, кто решает, без голого «нельзя».',
        'Нажмите «Проверить». Засчитывается от 80 %, и выполнены главные признаки: цена, варианты, кто решает, без «нельзя».'
      ],
      look: 'Проверка ищет признаки по словам: варианты удобнее писать отдельными строками «1) …», «2) …». Хороший ответ не запрещает и не уступает — он даёт выбор с ценой тому, кто вправе выбирать.'
    }),
    blank: () => ({ m: {}, text: '' }),
    reference: () => ({ m: Object.fromEntries(NO_ROWS.map(r => [r.id, r.ok])), text: NO_REF }),
    render(el, ctx) {
      el.classList.add('biz-root');
      const a = ctx.ans; a.m = a.m || {}; if (a.text == null) a.text = '';
      const judged = !!(ctx.result || ctx.readonly);
      el.innerHTML = `<div class="stack">
        ${ui.say('rita', 'Пока все в сборе — давайте в первую версию ещё скидку 30 % на выпечку после 19:00! Распродадим остатки, это же пять минут работы!')}
        <div class="biz-lbl">Шаг 1 · Что не так с черновиками</div><div data-m></div>
        <div class="biz-lbl">Шаг 2 · Ваш ответ Рите</div>
        <div class="biz-ed"><textarea data-t rows="10" placeholder="Рита, … (что услышали; чего это стоит; вариант 1, вариант 2; кто решает)" ${ctx.readonly ? 'readonly' : ''}>${esc(a.text)}</textarea><div class="stack tight"><div class="biz-lbl">Живая проверка</div><ul class="checks biz-chk" data-k></ul></div></div>
      </div>`;
      let mrev = null;
      if (judged) { mrev = {}; NO_ROWS.forEach(r => { if (a.m[r.id]) mrev[r.id] = { s: a.m[r.id] === r.ok ? 'ok' : 'bad' }; }); }
      ui.match(TR.$('[data-m]', el), { rows: NO_ROWS.map(r => ({ id: r.id, t: esc(r.t) })), choices: NO_CH, value: a.m, readonly: ctx.readonly, reveal: mrev, placeholder: 'Что не так…', onChange: v => { a.m = v; ctx.save(); } });
      function draw() {
        const ev = noEval(a);
        TR.$('[data-k]', el).innerHTML = ev.K.map(k => `<li class="${k.ok ? '' : k.crit ? 'bad' : 'warn'}"><b>${esc(k.t)}</b>${k.ok || !a.text.trim() ? '' : `<div class="small muted">${esc(k.hint)}</div>`}</li>`).join('');
      }
      if (!ctx.readonly) el.addEventListener('input', e => { if (!e.target.matches('[data-t]')) return; a.text = e.target.value; ctx.save(); draw(); });
      draw();
    },
    check(ans) {
      const ev = noEval(ans), notes = [], M = (ans && ans.m) || {};
      NO_ROWS.forEach((r, i) => { if (M[r.id] !== r.ok) notes.push({ ok: false, html: `Черновик ${i + 1}: ${M[r.id] === 'good' ? 'Рита прочитает это и… что сделает дальше? Есть ли у неё выбор и понятна ли цена?' : 'перечитайте: он закрывает разговор, соглашается не глядя или отдаёт вопрос «не нам»?'}` }); });
      if (!String((ans && ans.text) || '').trim()) notes.push({ ok: false, html: 'Ответ Рите не написан.' });
      else ev.K.forEach(k => { if (!k.ok) notes.push({ ok: k.crit ? false : 'warn', html: `<b>${esc(k.t)}.</b> ${esc(k.hint)}` }); });
      const ok = ev.score >= 0.8 && ev.critOk;
      if (ok && !notes.length) notes.push({ ok: true, html: 'Интерес Риты услышан, цена названа, выбор есть, решение — за Ниной.' });
      return {
        ok, score: ev.score, notes,
        summary: `Диагноз черновиков: ${Math.round(ev.diag * 3)} из 3. Признаков хорошего «нет»: ${ev.n} из ${ev.K.length}.`,
        mentor: /нельзя|невозможно|не входит/i.test(String((ans && ans.text) || '')) ? '«Нельзя» почти всегда неправда: можно, но чем-то придётся заплатить. Назовите цену — и пусть решает тот, кто платит.' : null
      };
    },
    explain: `<p><b>Три черновика — три типичные ошибки.</b> «Не входит, обсуждать не будем» — позиция: Рита пойдёт к Нине, и спор решится без аргументов. «Окей, пять минут» — уступка без цены: платить будут цех, утренние продажи и срок 1 марта. «Это маркетинг» — уход от ответственности: скидка меняет план выпечки, чеки и правила системы, значит, это и вопрос аналитика.</p>
      <p><b>Хорошее «нет» — это «да, но вот цена».</b> Пять частей: признать интерес (меньше остатков — меньше списаний, это БЦ-1), назвать цену и последствия (возражение Галины Ивановны, работа команды, сдвиг срока), дать хотя бы два варианта (пилот после запуска или сейчас вместо чего-то), оставить решение владельцу продукта, предложить следующий шаг (данные об остатках от Риты). Так вы не ссоритесь и не сдаётесь.</p>
      <p>Это тот же спор Риты и Галины Ивановны, что в блокноте (DOMAIN §5): аналитик не выбирает победителя, а готовит выбор для Нины. Источники: PRACTICES §3 («как сказать „нет“»); Фишер и Юри — интересы, а не позиции; варианты до выбора.</p>`,
    report: ans => { const ev = noEval(ans), M = (ans && ans.m) || {}; return NO_ROWS.map(r => `- ${r.t} → ${(NO_CH.find(c => c.v === M[r.id]) || {}).t || '—'} ${M[r.id] === r.ok ? '✓' : '✗'}`).join('\n') + `\n\nОтвет Рите:\n${(ans && ans.text) || '—'}\n\nПризнаки: ${ev.K.map(k => `${k.ok ? '✓' : '✗'} ${k.t}`).join('; ')}`; }
  };

  // =====================================================================
  // Практика 5. Ответ Олегу Петровичу своими словами
  // =====================================================================
  const OL_RUBRIC = [
    'Не принимает сторону и не обещает «тихо переписать» требование: объём первой версии утверждает Нина Сергеевна, требования меняются только через неё и открыто',
    'Признаёт интерес Олега Петровича — не сверять руками 2 часа каждое утро и не получить штраф за чеки — и показывает, что решение встречи бьёт именно в эту проблему: оплата на месте через кассу «КассаПро» по коду заказа, в сводку для 1С автоматически',
    'Опирается на объективные критерии, о которых договорились: в пилоте сверка не дольше 15 минут в день и все чеки по 54-ФЗ; через месяц смотрим цифры вместе',
    'Предлагает путь, если сомнения остаются: пусть Олег Петрович назовёт условия, при которых вариант не работает, — их добавят в критерии пилота и вынесут Нине с вариантами',
    'Тон уважительный, коротко и ясно, без канцелярита и без обиды; разговор возвращается в открытый рабочий канал, а не в тайную договорённость'
  ];
  const OL_REF = 'Олег Петрович, понимаю ваше опасение: два часа сверки каждое утро — ровно то, что мы и хотим убрать. Но написать «только онлайн» в обход Нины Сергеевны я не могу: объём первой версии утверждает она, и тихо менять решения было бы нечестно и по отношению к вам — так же тихо могут поменять то, что важно вам. На встрече мы выбрали вариант именно под вашу проблему: оплата на месте идёт через кассу «КассаПро» по коду заказа и сама попадает в сводку для 1С. И договорились о критериях: в пилоте сверка не дольше 15 минут в день и все чеки по 54-ФЗ — через месяц смотрим цифры вместе. Если сомнения остаются — напишите, пожалуйста, при каких условиях, по-вашему, оплата на месте всё-таки сломает сверку. Я добавлю это в критерии пилота и вынесу Нине Сергеевне с вариантами на ближайшей встрече — так ваши условия точно попадут в решение.';
  const whyTask = {
    id: 'why', title: 'Ответьте Олегу Петровичу: «вы же понимаете, что я прав»',
    simple: howTalk.simple,
    lead: ui.brief({
      situation: 'Суббота, 10:12. Олег Петрович пишет вам лично, мимо общего чата: «Давайте честно: вы же понимаете, что я прав. Оплата на месте — это снова ручная сверка. Напишите в требованиях „только онлайн“, а Нине я сам объясню». Ксения, когда вы показываете ей сообщение: «Ответьте сами. Это проверка не знаний, а позиции аналитика».',
      todo: [
        'Напишите ответ Олегу Петровичу: 5–8 предложений, от 300 символов. Он главный бухгалтер — пишите сухо, по делу, с цифрами.',
        'Нажмите «Проверить с Ксенией (Claude)» или «Сверить с эталоном самому» и честно отметьте раскрытые пункты. Засчитывается от 60 %.'
      ],
      lookTitle: 'На что опереться',
      look: 'Интересы и позиции (теория и переговоры), RACI решений из понедельника (кто решает), письмо-итог (что уже договорено и записано), «нет» с вариантами.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: OL_REF, self: OL_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('biz-root');
      el.insertAdjacentHTML('beforeend', ui.say('oleg', 'Давайте честно: вы же понимаете, что я прав. Оплата на месте — это снова ручная сверка. Напишите в требованиях «только онлайн», а Нине я сам объясню.'));
      const j = document.createElement('div'); j.style.marginTop = '12px'; el.appendChild(j);
      ui.justify(j, {
        id: 'biz-why', q: 'Ваш ответ Олегу Петровичу',
        qPlain: 'Главный бухгалтер сети пекарен в личном сообщении просит аналитика тайно поменять требование «оплата на месте» на «только онлайн», в обход владелицы, которая решила иначе. Ответьте ему: не принимая сторону и не обещая переписать требование тайно; признав его интерес (не сверять продажи руками, не получить штраф за чеки) и показав, что решение встречи (оплата на месте через кассу по коду заказа, автоматически в сводку) закрывает этот интерес; опираясь на договорённые критерии пилота (сверка до 15 минут, чеки по 54-ФЗ); предложив путь, если сомнения остаются; уважительно и коротко.',
        rubric: OL_RUBRIC, reference: OL_REF, value: ctx.ans.j, readonly: ctx.readonly, minLen: 300,
        placeholder: 'Олег Петрович, … (что понимаете; почему не можете в обход; что уже решили под его проблему; какие критерии; что предложить)',
        onChange: v => { ctx.ans.j = v; ctx.save(); ctx.decide('Ответ Олегу Петровичу', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j);
      return {
        ok: s >= 0.6, score: s,
        summary: s ? `Оценка ответа: ${Math.round(s * 100)} %.` : 'Напишите ответ (от 300 символов) и проверьте его с Ксенией или сверьте с эталоном сами.',
        notes: s && s < 0.6 ? [{ ok: false, html: 'Олегу Петровичу важно не «кто победил», а чтобы сверка ушла. Покажите, что решение встречи — про его проблему, и дайте ему законный путь повлиять: критерии пилота и разговор с Ниной.' }] : []
      };
    },
    explain: '<p>Это проверка позиции аналитика. Согласиться — значит тайно переписать решение владелицы: доверие Нины потеряно, а завтра так же «тихо» перепишут то, что важно Олегу Петровичу. Отказать сухо — значит получить противника проекта. Сильный ответ делает третье: признаёт интерес, показывает, что принятое решение под этот интерес и сделано (оплата на месте через кассу по коду заказа, в сводку сама), опирается на договорённые критерии (15 минут, 54-ФЗ) и даёт законный путь — условия в критерии пилота и разговор с Ниной на встрече.</p><p>Опора: RACI решений (по оплате решает Нина, Олег Петрович — советник), Фишер и Юри (интересы, объективные критерии, отделять людей от проблемы), письмо-итог как зафиксированная договорённость. Пишите так же, как письмо-итог: коротко, ясно, без канцелярита (Ильяхов и Сарычева).</p>',
    report: ans => (ans && ans.j && ans.j.text) ? ans.j.text : '—'
  };

  // =====================================================================
  TR.stage({
    id: ID, act: 3, order: 260, slot: 'Пт 15:00', title: 'Работа с бизнесом',
    when: 'пятница, 23 октября, 15:00 · «Квант Софт», в 16:00 — встреча в офисе «Колоса» на Московском шоссе',
    intro: [
      { who: 'ksenia', html: 'За неделю вы нашли заинтересованных лиц, научились спрашивать, поговорили с Ниной и отстояли смену на Покровке. Осталось главное — договориться. В 16:00 встреча с Ниной Сергеевной и Олегом Петровичем про оплату на месте. Ведёте вы.' },
      { who: 'oleg', html: 'Скажу сразу: если оставите оплату на месте, я опять буду каждое утро сверять руками.' },
      { who: 'nina', html: 'А я своих покупателей не брошу. Сорок процентов постоянных — люди в возрасте.' }
    ],
    facts: ['F-pay', 'F-54fz', 'F-1c', 'F-elder', 'F-peak', 'F-batch', 'F-cutoff', 'F-net'],
    glossary: [
      { term: 'Повестка встречи', simple: 'Список тем с минутами и целью: что сегодня решаем и в каком порядке.', tech: 'Документ подготовки встречи: цель, участники и роли (ведущий, секретарь, принимающий решение), пункты с таймингом. Рассылается заранее (PRACTICES §2.1).' },
      { term: 'Письмо-итог', simple: 'Записка на холодильнике после семейного совета: что решили, кто что делает и к какому сроку.', tech: 'Follow-up — письмо-резюме в течение суток после встречи: факты с цифрами, решения, открытые вопросы с ответственными и сроками, просьба подтвердить (PRACTICES §2.3). Подтверждённое письмо — способ согласовать требования.' },
      { term: 'Согласование требований', simple: '«Да» от того, кто вправе решать, — записанное, а не сказанное в коридоре.', tech: 'Требование согласовано, когда его подтвердил тот, кто вправе решать (A в RACI): письмо, протокол, статус в реестре требований (PRACTICES §3).' },
      { term: 'Управление ожиданиями', simple: 'Заранее сказать, чего не будет в торте, чтобы на празднике не было слёз.', tech: 'Заранее и регулярно сообщать, что будет и чего не будет в версии, сроки и цену изменений; показывать работающее на демо; фиксировать решения письменно.' },
      { term: 'Позиция и интерес', simple: 'Позиция — «отдай апельсин», интерес — «мне нужна корка для пирога».', tech: 'По Фишеру и Юри позиция — то, что человек решил и требует; интерес — почему он этого хочет (потребности, опасения). Договариваться по интересам, а не по позициям (Getting to Yes).' },
      { term: 'Объективный критерий', simple: 'Не «поверьте», а «через месяц посмотрим на весы».', tech: 'Независимый от воли сторон стандарт для решения: цифры, закон, рыночная практика, данные пилота. Четвёртый принцип Фишера и Юри.' },
      { term: '«Парковка»', simple: 'Отдельный листок на доске для важных, но не сегодняшних тем.', tech: 'Parking lot — приём ведения встречи: посторонние темы фиксируют и обсуждают позже, чтобы не сорвать повестку.' },
      { term: 'Канцелярит', simple: '«В ходе совещания было принято решение о целесообразности» вместо «решили».', tech: 'Термин Корнея Чуковского: казённые обороты, отглагольные существительные, пустые слова. Прячет смысл и ответственность; в деловых письмах его убирают (Ильяхов, Сарычева).' },
      { term: 'Демо', simple: 'Дегустация: дать попробовать и спросить, подходит ли к вашему празднику, а не «вкусно ли».', tech: 'Показ работающего результата заказчику (в Scrum — Sprint Review в конце спринта). Аналитик просит выполнить реальную задачу и спрашивает о реальном использовании, а не «нравится ли».' }
    ],
    outro: 'Работа с бизнесом — это договорённости, которые переживают встречу: цель и повестка до, интересы и варианты во время, решение по объективным критериям, письмо-итог с ответственными и сроками после. На «давайте ещё» отвечаем вариантами с ценой, решение оставляем тому, кто вправе решать, а на демо спрашиваем, как человек будет этим пользоваться, а не «нравится ли». Неделя 3 позади: на следующей превращаем всё, что выяснили, в истории, сценарии и требования.',
    tasks: [howMeet, howYes, howTalk, agendaTask, talksTask, letterTask, noTask, whyTask]
  });
})();
