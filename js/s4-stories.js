/* Неделя 4, понедельник 10:00: пользовательские истории (user story).
   Теория: формат «Как … я хочу … чтобы …» и работа каждой части, 3C, INVEST, типичные ошибки (соседний пример —
   онлайн-запись в парикмахерскую); эпик → история → задача, SPIDR («батон режут поперёк»), карта историй Паттона
   для предзаказа «Колоса» с линией MVP к 1 марта; критерии приёмки: правило и его граница, списком и Дано/Когда/Тогда,
   Example Mapping трёх амиго.
   Практика: собрать две истории из частей и убрать лишнее; 8 историй через INVEST; разрезать эпик «Предзаказ» по SPIDR;
   критерии Дано/Когда/Тогда для правил 22:30, 30 минут и 07:30 (мини-редактор с проверкой по признакам);
   лаборатория «Лера проверяет сборку» и ответ Нине своими словами. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'stories';

  if (!document.getElementById('sto-css')) document.head.insertAdjacentHTML('beforeend', `<style id="sto-css">
    .sto-root, .sto-root .stack > * { min-width: 0; }
    .sto-card, .sto-gw, .sto-irow, .sto-emboard, .sto-flip, .sto-rule, .sto-gq, .sto-node { grid-template-columns: minmax(0, 1fr); }
    .sto-card > *, .sto-gw > *, .sto-irow > *, .sto-emboard > *, .sto-flip > * { min-width: 0; }
    .sto-root .seg button { white-space: normal; text-align: left; }
    .sto-q { font: 600 11px/1.4 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .sto-grp { display: grid; gap: 5px; }
    .sto-two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px; align-items: start; }
    .sto-two > * { min-width: 0; }
    .sto-card { border: 1px solid var(--border-strong); border-radius: 12px; background: var(--surface); padding: 12px 14px; display: grid; gap: 8px; min-width: 0; }
    .sto-card.yel { background: color-mix(in srgb, var(--warn) 9%, var(--surface)); border-color: color-mix(in srgb, var(--warn) 45%, var(--border)); }
    .sto-story { font-size: 15.5px; line-height: 1.55; }
    .sto-story b { color: var(--accent); font-weight: 600; }
    .sto-story .bad { background: var(--bad-soft); color: var(--bad); border-radius: 4px; padding: 0 3px; }
    .sto-story .warn { background: var(--warn-soft); color: var(--warn); border-radius: 4px; padding: 0 3px; }
    .sto-story .ph { color: var(--text-muted); }
    .sto-back { border-top: 1px dashed var(--border-strong); padding-top: 8px; display: grid; gap: 4px; font-size: 13.5px; }
    .sto-line { font-size: 14px; line-height: 1.45; }
    .sto-guess { display: grid; gap: 6px; }
    .sto-gq { border: 1px solid var(--border); border-radius: 10px; padding: 8px 12px; background: var(--surface); font-size: 14px; display: grid; gap: 3px; }
    .sto-gq .g { color: var(--bad); }
    .sto-gq .g.x { text-decoration: line-through; color: var(--text-muted); }
    .sto-gq .a { color: var(--ok); }
    .sto-letters { display: flex; flex-wrap: wrap; gap: 6px; }
    .sto-letter { width: 48px; height: 48px; border-radius: 10px; border: 1px solid var(--border-strong); background: var(--surface-2); font: 700 21px/1 var(--f-brand); color: var(--text); }
    .sto-letter[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); }
    .sto-def { display: grid; grid-template-columns: 140px minmax(0, 1fr); gap: 6px 14px; font-size: 14px; }
    .sto-def > .k { font: 600 11px/1.5 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); padding-top: 2px; }
    .sto-def > .v { min-width: 0; }
    .sto-flips { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 10px; }
    .sto-flip { border: 1px solid var(--border); border-left: 4px solid var(--bad); border-radius: 10px; padding: 10px 12px; background: var(--surface); display: grid; gap: 6px; align-content: start; font-size: 14px; min-width: 0; }
    .sto-flip.fixed { border-left-color: var(--ok); }
    .sto-flip .btn { justify-self: start; }
    .sto-lbl { font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .sto-lbl.bad { color: var(--bad); } .sto-lbl.ok { color: var(--ok); }
    .sto-tree { display: grid; gap: 8px; }
    .sto-node { border: 1px solid var(--border); border-radius: 10px; padding: 8px 12px; background: var(--surface); text-align: left; color: var(--text); width: 100%; display: grid; gap: 2px; font-size: 14px; }
    .sto-node.epic { border-left: 4px solid var(--violet); }
    .sto-node.story { border-left: 4px solid var(--warn); }
    .sto-node.task { border-left: 4px solid var(--info); font-size: 13px; padding: 6px 10px; }
    .sto-node[aria-pressed="true"] { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent) inset; }
    .sto-kids { display: grid; gap: 6px; padding-left: 14px; margin-left: 10px; border-left: 2px dashed var(--border-strong); }
    .sto-loaf { border: 1px solid var(--border); border-radius: 12px; background: var(--surface-2); padding: 8px; overflow-x: auto; }
    .sto-loaf svg { display: block; margin: 0 auto; }
    .sto-slices { display: grid; gap: 6px; }
    .sto-slice { display: grid; grid-template-columns: 30px minmax(0, 1fr); gap: 8px; align-items: start; padding: 7px 10px; border: 1px solid var(--border); border-radius: 9px; background: var(--surface); font-size: 14px; }
    .sto-slice .n { font: 700 12px/1.6 var(--f-mono); color: var(--text-muted); }
    .sto-slice.bad { border-color: var(--bad); background: var(--bad-soft); }
    .sto-mapwrap { overflow-x: auto; border: 1px solid var(--border); border-radius: 12px; background: var(--surface-2); }
    .sto-map { display: grid; min-width: 760px; padding-bottom: 8px; }
    .sto-r5 { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; padding: 6px 10px; }
    .sto-act { border: 1px solid color-mix(in srgb, var(--violet) 55%, var(--border)); background: var(--violet-soft); border-radius: 9px; padding: 6px 8px; display: grid; gap: 4px; font: 600 13px/1.3 var(--f-brand); color: var(--text); }
    .sto-act .mv { display: flex; gap: 4px; }
    .sto-act .mv button { width: 26px; height: 24px; border-radius: 6px; border: 1px solid var(--border-strong); background: var(--surface); padding: 0; font-size: 12px; color: var(--text); }
    .sto-rel { padding: 8px 10px 0; font: 600 11px/1.4 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .sto-rel.mvp { color: var(--accent); }
    .sto-cell { min-height: 66px; border: 1px dashed var(--border-strong); border-radius: 9px; padding: 5px; display: grid; gap: 5px; align-content: start; background: var(--surface); }
    .sto-cell.target { outline: 2px dashed var(--accent); outline-offset: 1px; cursor: pointer; }
    .sto-cell.over, .sto-mpool.over { background: var(--accent-soft); }
    .sto-mvp { position: relative; border-top: 3px dashed var(--accent); margin: 14px 10px 4px; }
    .sto-mvp span { position: absolute; right: 8px; top: -12px; background: var(--surface-2); padding: 0 8px; font: 600 11px/1.6 var(--f-mono); color: var(--accent); letter-spacing: .06em; text-transform: uppercase; }
    .sto-sc { border: 1px solid var(--border-strong); border-left: 4px solid var(--warn); border-radius: 8px; padding: 5px 8px; background: var(--surface-2); font-size: 12.5px; line-height: 1.3; text-align: left; color: var(--text); width: 100%; cursor: grab; }
    .sto-sc.picked { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-glow); }
    .sto-sc.ok { border-color: var(--ok); background: var(--ok-soft); }
    .sto-sc.warn { border-color: var(--warn); background: var(--warn-soft); }
    .sto-sc.bad { border-color: var(--bad); background: var(--bad-soft); }
    .sto-mpool { display: flex; flex-wrap: wrap; gap: 6px; padding: 10px; border: 1px dashed var(--border-strong); border-radius: 12px; background: var(--surface); min-height: 48px; }
    .sto-mpool .sto-sc { width: auto; max-width: 250px; }
    .sto-mpool:empty::after { content: "Все карточки на карте"; color: var(--text-muted); font-size: 13px; align-self: center; }
    .sto-range { width: 100%; accent-color: var(--accent); }
    .sto-rule { display: grid; gap: 3px; padding: 8px 12px; border-radius: 9px; background: var(--info-soft); border: 1px solid color-mix(in srgb, var(--info) 35%, transparent); font-size: 14px; }
    .sto-em { display: grid; gap: 10px; }
    .sto-emboard { border: 1px solid var(--border); border-radius: 12px; background: var(--surface-2); padding: 10px; display: grid; gap: 10px; min-height: 150px; }
    .sto-emgrid { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: 10px; align-items: start; }
    .sto-emcols { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; align-items: start; }
    .sto-emcol { display: grid; gap: 6px; }
    .sto-k { border-radius: 8px; padding: 7px 10px; font-size: 13px; line-height: 1.35; border: 1px solid; color: var(--text); }
    .sto-k.y { background: color-mix(in srgb, var(--warn) 16%, var(--surface)); border-color: var(--warn); }
    .sto-k.b { background: var(--info-soft); border-color: var(--info); }
    .sto-k.g { background: var(--ok-soft); border-color: var(--ok); }
    .sto-k.r { background: var(--bad-soft); border-color: var(--bad); }
    .sto-k.new { box-shadow: 0 0 0 3px var(--accent-glow); }
    .sto-legend { display: flex; flex-wrap: wrap; gap: 4px 14px; font-size: 12.5px; color: var(--text-2); }
    .sto-legend b { font-family: var(--f-brand); color: var(--text); }
    .sto-inv { display: grid; gap: 8px; }
    .sto-irow { border: 1px solid var(--border); border-radius: 10px; padding: 9px 12px; background: var(--surface); display: grid; gap: 8px; }
    .sto-irow.ok { border-color: var(--ok); } .sto-irow.bad { border-color: var(--bad); } .sto-irow.warn { border-color: var(--warn); }
    .sto-itxt { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 8px; font-size: 14.5px; line-height: 1.45; }
    .sto-itxt .n { font: 600 12px/1.7 var(--f-mono); color: var(--text-muted); }
    .sto-ibtns { display: flex; flex-wrap: wrap; gap: 5px; }
    .sto-ib { min-width: 36px; height: 32px; border-radius: 8px; border: 1px solid var(--border-strong); background: var(--surface-2); font: 700 14px/1 var(--f-brand); color: var(--text); padding: 0 9px; }
    .sto-ib.wide { font: 600 12.5px/1 var(--f-body); }
    .sto-ib[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); }
    .sto-ib.r-ok { border-color: var(--ok); background: var(--ok-soft); color: var(--ok); }
    .sto-ib.r-bad { border-color: var(--bad); background: var(--bad-soft); color: var(--bad); }
    .sto-why { font-size: 13px; color: var(--text-2); }
    .sto-gw { border: 1px solid var(--border); border-radius: 12px; padding: 12px 14px; background: var(--surface); display: grid; gap: 10px; }
    .sto-gw.ok { border-color: var(--ok); } .sto-gw.warn { border-color: var(--warn); } .sto-gw.bad { border-color: var(--bad); }
    .sto-gwf { display: grid; grid-template-columns: 70px minmax(0, 1fr); gap: 6px 10px; align-items: start; }
    .sto-gwf .kw { font: 700 13px/2.6 var(--f-mono); color: var(--accent); }
    .sto-gwf textarea { min-height: 46px; }
    .sto-feats { display: flex; flex-wrap: wrap; gap: 6px; }
    .sto-feats .chip { white-space: normal; }
    .sto-lab { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); gap: 16px; align-items: start; }
    .sto-lab > * { min-width: 0; }
    .sto-crits { display: grid; gap: 6px; }
    .sto-crit { display: grid; grid-template-columns: 32px minmax(0, 1fr); gap: 8px; align-items: center; padding: 8px 10px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); text-align: left; color: var(--text); width: 100%; font-size: 13.5px; line-height: 1.35; }
    .sto-crit[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .sto-crit .sw { width: 30px; height: 18px; border-radius: 9px; background: var(--surface-3); border: 1px solid var(--border-strong); position: relative; }
    .sto-crit .sw::after { content: ""; position: absolute; top: 2px; left: 2px; width: 12px; height: 12px; border-radius: 50%; background: var(--text-muted); transition: left .15s; }
    .sto-crit[aria-pressed="true"] .sw { background: var(--accent); border-color: var(--accent); }
    .sto-crit[aria-pressed="true"] .sw::after { left: 14px; background: var(--surface); }
    .sto-crit.ok { border-color: var(--ok); } .sto-crit.bad { border-color: var(--bad); }
    .sto-tests { display: grid; gap: 6px; }
    .sto-test { display: grid; grid-template-columns: 24px minmax(0, 1fr); gap: 8px; padding: 7px 10px; border-left: 3px solid var(--border-strong); background: var(--surface); border-radius: 0 8px 8px 0; font-size: 13.5px; line-height: 1.4; transition: opacity .2s; }
    .sto-test.ok { border-left-color: var(--ok); }
    .sto-test.bad { border-left-color: var(--bad); background: var(--bad-soft); }
    .sto-test.warn { border-left-color: var(--warn); background: var(--warn-soft); }
    .sto-test .ic { font: 700 13px/1.4 var(--f-mono); }
    .sto-test.ok .ic { color: var(--ok); } .sto-test.bad .ic { color: var(--bad); } .sto-test.warn .ic { color: var(--warn); }
    .sto-test .tc { font-weight: 600; display: block; }
    .sto-test.pend { opacity: .25; }
    .sto-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    .sto-stats .stat .v { font-size: 18px; }
    @media (max-width: 760px) {
      .sto-two, .sto-lab, .sto-emgrid { grid-template-columns: minmax(0, 1fr); }
      .sto-def { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .sto-def > .v { margin-bottom: 8px; }
    }
    @media (max-width: 440px) {
      .sto-gwf { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .sto-gwf .kw { line-height: 1.5; }
      .sto-stats .stat { padding: 8px; }
      .sto-stats .stat .k { letter-spacing: .04em; }
      .sto-story { font-size: 14.5px; }
    }
  </style>`);

  // ---------- общие помощники ----------
  const fresh = fn => pane => { const d = document.createElement('div'); pane.appendChild(d); fn(d); };
  const chip = (t, k) => `<span class="chip ${k || ''}">${t}</span>`;
  // сценарий Gherkin с подсвеченными ключевыми словами
  const gk = (title, steps) => 'Сценарий: ' + title + '\n' + steps.map(([k, t]) => `  [[hl]]${k}[[/]] ${t}`).join('\n');
  const hm = q => { const h = Math.floor(q / 4), m = (q % 4) * 15; return `${h} ч${m ? ' ' + m + ' мин' : ''}`; };
  const clock = min => { const h = Math.floor(min / 60), m = min % 60; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`; };

  // =====================================================================
  // Теория 1. История — записка с «зачем» (соседний пример — онлайн-запись в парикмахерскую)
  // =====================================================================
  const P_ROLE = [
    { v: 'r1', t: 'клиентка, которая стрижётся раз в месяц у одного мастера', ok: true, r: 'Команда видит живого человека: у неё «свой» мастер — значит, первым делом показываем окна именно его.' },
    { v: 'r2', t: 'пользователь', r: '«Пользователь» — это кто: клиентка, мастер, администратор? Историю «для всех» делают для никого: непонятно, чьи привычки учитывать.' },
    { v: 'r3', t: 'система', r: 'Система ничего не хочет и пользы не получает. Роль в истории — тот, кому станет лучше.' }
  ];
  const P_WANT = [
    { v: 'w1', t: 'записаться к своему мастеру онлайн', ok: true, r: 'Сказано, что человек хочет сделать, — и ни слова о кнопках. Как именно, решат вместе с дизайнером.' },
    { v: 'w2', t: 'нажать синюю кнопку «Записаться» в шапке сайта', r: 'Это уже решение интерфейса. Дизайнер связан по рукам — а может, удобнее записываться прямо из мессенджера.' }
  ];
  const P_WHY = [
    { v: 'y1', t: 'не дозваниваться в салон в рабочее время', ok: true, r: 'Есть ценность, и её можно проверить. Разработчик сразу предлагает дешёвый первый шаг: запись через бот в мессенджере за неделю, а не сайт за месяц.' },
    { v: 'y2', t: 'записаться онлайн', r: '«Чтобы» повторяет «хочу» — ценности не видно. Нечем объяснить, почему это важнее других историй.' },
    { v: 'y3', t: '— без «чтобы»', r: 'Без цели команда сделает буквально написанное и не предложит вариант проще. А владелица салона не поймёт, за что платит.' }
  ];
  const P_WHY3 = [
    { v: 'a', t: 'не забыть про стрижку', sol: 'SMS за 2 часа до записи: «Ждём вас сегодня в 15:00».', cost: 'день работы' },
    { v: 'b', t: 'успеть перенести запись, если планы поменялись', sol: 'Напоминание за сутки со ссылкой «Перенести»: свободные окна мастера — прямо в сообщении.', cost: 'около недели' },
    { v: 'c', t: 'не ехать зря, если мастер заболел', sol: 'Сообщение сразу, как салон отменил запись, и предложение другого мастера на то же время.', cost: 'около двух недель' }
  ];
  function drawParts(pane) {
    const st = { r: 'r2', w: 'w2', y: 'y3', y3: 'a' };
    const opts = list => list.map(o => ({ v: o.v, t: esc(o.t) }));
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Соседний пример — онлайн-запись в парикмахерскую. Соберите историю из трёх частей и посмотрите, что команда поймёт из каждой версии.</p>
      <div class="sto-two">
        <div class="stack tight">
          <div class="sto-grp"><span class="sto-q">Как … — кто</span>${ui.seg('r', opts(P_ROLE), st.r, 'accent')}</div>
          <div class="sto-grp"><span class="sto-q">я хочу … — что</span>${ui.seg('w', opts(P_WANT), st.w, 'accent')}</div>
          <div class="sto-grp"><span class="sto-q">чтобы … — зачем</span>${ui.seg('y', opts(P_WHY), st.y, 'accent')}</div>
        </div>
        <div class="stack tight" data-out></div>
      </div>
      <div class="eyebrow">Одно «хочу» — три «чтобы»</div>
      <div class="sto-card yel"><div class="sto-story"><b>Как</b> клиентка, <b>я хочу</b> получать напоминание о записи, <b>чтобы</b> …</div>${ui.seg('y3', opts(P_WHY3), st.y3, 'accent')}<div data-out3></div></div>
    </div>`;
    function draw() {
      const r = P_ROLE.find(o => o.v === st.r), w = P_WANT.find(o => o.v === st.w), y = P_WHY.find(o => o.v === st.y);
      const good = [r, w, y].filter(o => o.ok).length, k = good === 3 ? 'ok' : good === 2 ? 'warn' : 'bad';
      const sp = o => o.ok ? esc(o.t) : `<span class="bad">${esc(o.t)}</span>`;
      TR.$('[data-out]', pane).innerHTML = `<div class="sto-card yel"><span class="sto-lbl">Карточка</span><div class="sto-story"><b>Как</b> ${sp(r)}, <b>я хочу</b> ${sp(w)}${y.v === 'y3' ? '.' : `, <b>чтобы</b> ${sp(y)}.`}</div></div>
        <div class="stat"><span class="k">Что поймёт команда</span><span class="v ${k}">${good} из 3 частей работают</span>${ui.meter(good / 3, k === 'ok' ? '' : k)}</div>
        <ul class="checks">${[r, w, y].map(o => `<li class="${o.ok ? '' : 'bad'}">${esc(o.r)}</li>`).join('')}</ul>`;
      const z = P_WHY3.find(o => o.v === st.y3);
      TR.$('[data-out3]', pane).innerHTML = `<div class="row top">${chip('Решение команды', 'info')}<span style="flex:1 1 200px;min-width:0">${esc(z.sol)}</span></div><div class="small muted">Цена: ${esc(z.cost)}. Одно и то же «хочу» — три разных решения. Без «чтобы» команда сделала бы самое очевидное, и не факт, что нужное.</div>`;
    }
    ui.onSeg(pane, (n, v) => { if (st[n] != null) { st[n] = v; draw(); } });
    draw();
  }

  const C3 = [
    { q: 'На какое время можно записаться?', g: 'Догадка разработчика: на любое, хоть на 21:45.', a: 'Окна по 30 минут, с 10:00 до 20:00.', who: 'Администратор' },
    { q: 'Показывать ли мастера, который в отпуске?', g: 'Догадка: показываем всех мастеров всегда.', a: 'Мастера в отпуске не показываем.', who: 'Мастер' },
    { q: 'Можно ли отменить запись? Бесплатно?', g: 'Догадка: отменить можно в любой момент.', a: 'Без штрафа — не позже чем за 3 часа до начала.', who: 'Владелица салона' },
    { q: 'Нужна ли регистрация?', g: 'Догадка: регистрация с паролем и почтой.', a: 'Нет: достаточно номера телефона.', who: 'Владелица салона' }
  ];
  function drawC3(pane) {
    let cur = 'card';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Три «C» Рона Джеффриса: <b>карточка</b> (Card), <b>разговор</b> (Conversation), <b>подтверждение</b> (Confirmation). Пройдите по шагам и посмотрите, что знает команда на каждом.</p>
      ${ui.seg('c3', [{ v: 'card', t: '1 · Карточка' }, { v: 'talk', t: '2 · Разговор' }, { v: 'conf', t: '3 · Подтверждение' }], cur, 'accent')}
      <div data-c3></div></div>`;
    function draw() {
      let h = `<div class="sto-card yel"><span class="sto-lbl">Карточка</span><div class="sto-story"><b>Как</b> клиентка, которая стрижётся у одного мастера, <b>я хочу</b> записаться к нему онлайн, <b>чтобы</b> не дозваниваться в салон в рабочее время.</div></div>`;
      if (cur === 'card') h += `<div class="eyebrow">Что команда додумала сама</div><div class="sto-guess">${C3.map(x => `<div class="sto-gq"><span class="small dim">${esc(x.q)}</span><span class="g">? ${esc(x.g)}</span></div>`).join('')}</div>${ui.note('warn', 'Карточка — не спецификация', 'Это напоминание о разговоре. Если разговора не было, разработчики честно заполнят пробелы догадками — и все четыре окажутся не такими, как в салоне.')}`;
      if (cur === 'talk') h += `<div class="eyebrow">Разговор: аналитик, разработчик, тестировщик и люди из салона</div><div class="sto-guess">${C3.map(x => `<div class="sto-gq"><span class="small dim">${esc(x.q)}</span><span class="g x">${esc(x.g)}</span><span class="a">✓ ${esc(x.who)}: «${esc(x.a)}»</span></div>`).join('')}</div>${ui.note('info', 'Что здесь делает аналитик', 'Собирает людей, задаёт вопросы «а если…», следит, чтобы отвечал тот, кто вправе решать, и записывает договорённости. Разговор важнее карточки: в нём рождается общее понимание.')}`;
      if (cur === 'conf') h += `<div class="eyebrow">Подтверждение: критерии приёмки на обороте карточки</div><ul class="checks">${C3.map(x => `<li>${esc(x.a)}</li>`).join('')}</ul>${ui.code(gk('отмена заранее — без штрафа', [['Дано', 'клиентка записана на 15:00'], ['Когда', 'она отменяет запись в 11:30'], ['Тогда', 'запись отменена без штрафа'], ['И', 'окно 15:00 снова свободно для записи']]), 'text', 'Один из критериев — в формате Дано / Когда / Тогда')}${ui.note('ok', 'Теперь историю можно брать в работу', 'Тестировщик знает, что проверять, разработчик — что делать, владелица — что примет. Договорённости из разговора не потеряются: они записаны и проверяемы.')}`;
      TR.$('[data-c3]', pane).innerHTML = `<div class="stack">${h}</div>`;
    }
    ui.onSeg(pane, (n, v) => { if (n === 'c3') { cur = v; draw(); } });
    draw();
  }

  const INV_L = [
    { l: 'I', en: 'Independent', ru: 'Независимая', q: 'Можно ли сделать и показать её, не дожидаясь другой истории?', bad: 'Как клиентка, я хочу видеть экран выбора мастера (сам выбор заработает в истории «Сохранить запись»).', good: 'Как клиентка, я хочу записаться к мастеру на свободное окно — от выбора до подтверждения, — чтобы не звонить в салон.', why: 'Сцепленные истории нельзя переставить в бэклоге: одна без другой ничего не даёт. Полной независимости не бывает («отменить» всегда после «записаться»), но без нужды истории не связывают.' },
    { l: 'N', en: 'Negotiable', ru: 'Обсуждаемая', q: 'Оставляет ли она место для разговора о том, как это сделать?', bad: 'Как клиентка, я хочу, чтобы при записи вызывался метод POST /bookings, а SMS уходила через шлюз «СМС-Центр».', good: 'Как клиентка, я хочу получить подтверждение записи, чтобы быть уверенной, что меня ждут.', why: 'История — не контракт с готовым решением. Если решение зашито заранее, команда не предложит вариант дешевле или удобнее.' },
    { l: 'V', en: 'Valuable', ru: 'Ценная', q: 'Кто заметит пользу, когда её сделают?', bad: 'Как разработчик, я хочу создать таблицу записей в базе данных.', good: 'Таблица — задача внутри истории «Записаться к мастеру онлайн». Ценность измеряют у клиентки или владелицы салона.', why: 'Если пользы не видит никто, кроме команды, это не история, а задача. Её делают в составе той истории, которой она нужна.' },
    { l: 'E', en: 'Estimable', ru: 'Оцениваемая', q: 'Может ли команда прикинуть, сколько это займёт?', bad: 'Как клиентка, я хочу, чтобы салон сам подбирал мне мастера по фото причёски.', good: 'Сначала разведка на два дня: можно ли это сделать и как. Потом — история с понятным объёмом.', why: 'Нельзя оценить то, что непонятно. Неизвестность снимают разведкой с ограниченным временем, а не надеждой.' },
    { l: 'S', en: 'Small', ru: 'Небольшая', q: 'Поместится ли она в один спринт — а лучше в несколько дней?', bad: 'Как клиентка, я хочу пользоваться всеми услугами салона онлайн.', good: 'Это эпик. Режем на истории: записаться, перенести, отменить, получить напоминание…', why: 'Большую историю не сделать за спринт, её трудно оценить и проверить. Маленькие истории дают результат каждые несколько дней.' },
    { l: 'T', en: 'Testable', ru: 'Проверяемая', q: 'Как тестировщик поймёт, что готово?', bad: 'Как клиентка, я хочу, чтобы запись была быстрой и удобной.', good: 'Критерии: запись — не больше трёх шагов; подтверждение приходит не позже чем через минуту.', why: '«Быстро» и «удобно» не проверить — вы это знаете по неделе 2. Нужны числа, условия и примеры.' }
  ];
  function drawInvest(pane) {
    let cur = 'I', mode = 'bad';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">INVEST — шесть вопросов к каждой истории (Билл Уэйк, 2003). Нажмите букву, потом переключите «Как ломается / Как правильно».</p>
      <div class="sto-letters">${INV_L.map(x => `<button type="button" class="sto-letter" data-l="${x.l}" aria-pressed="${x.l === cur}" title="${esc(x.en + ' — ' + x.ru)}">${x.l}</button>`).join('')}</div>
      <div data-inv></div>
      ${ui.note('info', 'Честно об INVEST', 'Это чек-лист, а не закон. Практики спорят, насколько история должна быть независимой и что считать «небольшой». Главное — задать шесть вопросов до того, как история попадёт в спринт.')}
    </div>`;
    function draw() {
      const x = INV_L.find(i => i.l === cur);
      TR.$('[data-inv]', pane).innerHTML = `<div class="sto-card"><div class="row between"><b style="font:600 17px/1.3 var(--f-brand)">${x.l} — ${esc(x.en)} · ${esc(x.ru)}</b>${ui.seg('m', [{ v: 'bad', t: 'Как ломается' }, { v: 'good', t: 'Как правильно' }], mode, 'accent')}</div>
        <div class="sto-def"><span class="k">Спросите себя</span><span class="v"><b>${esc(x.q)}</b></span>
        <span class="k">${mode === 'bad' ? 'Ломается' : 'Правильно'}</span><span class="v">${mode === 'bad' ? chip('✕', 'bad') + ' ' + esc(x.bad) : chip('✓', 'ok') + ' ' + esc(x.good)}</span>
        <span class="k">Почему</span><span class="v">${esc(x.why)}</span></div></div>`;
    }
    TR.on(pane, 'click', '[data-l]', (e, b) => { cur = b.dataset.l; TR.$$('[data-l]', pane).forEach(z => z.setAttribute('aria-pressed', String(z === b))); draw(); });
    ui.onSeg(pane, (n, v) => { if (n === 'm') { mode = v; draw(); } });
    draw();
  }

  const ERRS = [
    { t: '«Как система»', bad: 'Как система, я хочу отправлять SMS за сутки до записи.', good: 'Как клиентка, я хочу получить напоминание за сутки, чтобы успеть перенести запись.', why: 'Роль — тот, кому становится лучше. Система — исполнитель, а не выгодоприобретатель.' },
    { t: 'Без «чтобы»', bad: 'Как клиентка, я хочу видеть свободные окна мастера.', good: 'Как клиентка, я хочу видеть свободные окна мастера, чтобы выбрать время, не звоня в салон.', why: 'Без «зачем» нечем обосновать приоритет и не из чего выбрать решение. «Чтобы» — самая ценная часть истории.' },
    { t: 'Задача под видом истории', bad: 'Как разработчик, я хочу перейти на новую версию базы данных.', good: 'Это техническая задача. Её место — внутри истории, которой она нужна, или в техническом бэклоге с объяснением, что сломается без неё.', why: 'Некоторые команды пишут «технические истории» — это нормально, если понятно, зачем они бизнесу. Но выдавать задачу за голос клиента не стоит.' },
    { t: 'Слишком большая', bad: 'Как клиентка, я хочу управлять всеми записями, оплатами и бонусами онлайн.', good: 'Эпик. Режем: перенести запись; отменить запись; оплатить онлайн; посмотреть бонусы.', why: 'Такую историю не сделать за спринт и не оценить. Ей нужен нож — об этом следующий раздел теории.' },
    { t: 'Критерий «быстро»', bad: 'Критерий приёмки: запись работает быстро и удобно.', good: 'Подтверждение записи приходит не позже чем через 1 минуту; запись — не больше 3 шагов.', why: 'Тестировщик не проверит «быстро». Нужны число и условие — вспомните слова-ловушки из недели 2.' }
  ];
  function drawErrs(pane) {
    const fixed = {};
    pane.innerHTML = `<div class="stack"><p class="small muted">Пять ошибок, которые встречаются почти в каждом бэклоге. Нажмите «Починить» и сравните.</p><div class="sto-flips" data-fl></div></div>`;
    function draw() {
      TR.$('[data-fl]', pane).innerHTML = ERRS.map((x, i) => fixed[i]
        ? `<div class="sto-flip fixed"><span class="sto-lbl ok">${esc(x.t)} · починили</span><div>${esc(x.good)}</div><div class="small muted">${esc(x.why)}</div><button type="button" class="btn xs ghost" data-fx="${i}">← Как было</button></div>`
        : `<div class="sto-flip"><span class="sto-lbl bad">${esc(x.t)}</span><div>${esc(x.bad)}</div><button type="button" class="btn xs" data-fx="${i}">Починить →</button></div>`).join('');
    }
    TR.on(pane, 'click', '[data-fx]', (e, b) => { const i = +b.dataset.fx; fixed[i] = !fixed[i]; draw(); });
    draw();
  }

  const howStory = {
    id: 'how-story', covers: ['build', 'invest'], title: 'Как это работает: история — записка с «зачем»', free: true, noReset: true,
    simple: {
      icon: '📝',
      plain: 'Пользовательская история — короткая записка от имени того, кому нужна функция: кто он, что хочет сделать и зачем. Это не полное описание, а повод договориться: детали выясняют в разговоре и записывают как критерии приёмки.',
      analogy: 'Записка на холодильнике «Купи молоко — завтра блины для Маши» короче любого списка покупок, но из неё ясно главное — зачем. Нет молока — можно взять кефир, блины всё равно получатся. А если в записке только «молоко», вы будете искать его по всему городу.',
      tech: 'Формат «Как &lt;роль&gt;, я хочу &lt;действие&gt;, чтобы &lt;ценность&gt;» придумали в компании Connextra (2001), популяризовал Майк Кон («Пользовательские истории»). <b>3C</b> — Card, Conversation, Confirmation: карточка, разговор, подтверждение (Рон Джеффрис). <b>INVEST</b> — Independent, Negotiable, Valuable, Estimable, Small, Testable (Билл Уэйк, 2003).'
    },
    lead: ui.brief({
      situation: 'Соседний пример — онлайн-запись в парикмахерскую. Что такое требование и почему «быстро» и «удобно» — ловушки, вы уже знаете с недели 2. Здесь — как требование записывают историей и что делает каждая её часть.',
      todo: [
        'Вкладка «Кто · что · зачем»: переключайте варианты каждой части и читайте, что поймёт команда. Внизу — одно «хочу» с тремя разными «чтобы»: следите, как меняется решение.',
        'Вкладка «Три „C“»: пройдите шаги «Карточка → Разговор → Подтверждение» и посмотрите, сколько догадок остаётся у разработчиков на каждом.',
        'Вкладка «INVEST»: нажмите каждую из шести букв и сравните «Как ломается» и «Как правильно».',
        'Вкладка «Типичные ошибки»: почините пять плохих историй.'
      ],
      look: 'Зелёная шкала — сколько частей истории работают. Красным подсвечено то, что команде мешает.'
    }),
    render(el) {
      el.classList.add('sto-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'parts', t: 'Кто · что · зачем', render: fresh(drawParts) },
        { id: 'c3', t: 'Три «C»', render: fresh(drawC3) },
        { id: 'invest', t: 'INVEST', render: fresh(drawInvest) },
        { id: 'errs', t: 'Типичные ошибки', render: fresh(drawErrs) }
      ], 'parts');
    }
  };

  // =====================================================================
  // Теория 2. Эпик → история → задача, SPIDR, карта историй
  // =====================================================================
  const TREE_ST = [
    { t: 'Записаться к мастеру на свободное окно', tasks: ['Таблица записей в базе данных', 'Экран выбора окна', 'Проверка, что окно ещё свободно', 'Отправка подтверждения по SMS'] },
    { t: 'Перенести запись', tasks: ['Список «Мои записи»', 'Освобождение старого окна', 'Уведомление мастеру'] },
    { t: 'Отменить запись без штрафа за 3 часа', tasks: ['Правило «3 часа» в настройках', 'Подтверждение отмены', 'Освобождение окна'] },
    { t: 'Получить напоминание за сутки', tasks: ['Расписание рассылки', 'Текст сообщения', 'Ссылка «Перенести» в сообщении'] }
  ];
  const LVL = {
    epic: { t: 'Эпик', size: 'несколько спринтов: недели и месяцы', who: 'владелец продукта с аналитиком', val: 'да — но слишком крупно, чтобы сделать за один заход', where: 'бэклог продукта (в Jira — Epic)' },
    story: { t: 'История', size: 'от дня до нескольких дней, помещается в спринт', who: 'аналитик с владельцем продукта; уточняют втроём — с разработчиком и тестировщиком', val: 'да: после неё клиентке что-то стало удобнее, это можно показать', where: 'бэклог продукта (в Jira — Story)' },
    task: { t: 'Задача', size: 'часы', who: 'разработчики сами, когда планируют спринт', val: 'нет: таблица в базе сама по себе клиентке ничего не даёт', where: 'внутри истории (в Jira — Sub-task)' }
  };
  function drawTree(pane) {
    let lvl = 'story', open = 0, task = -1;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Нажимайте на эпик, истории и задачи. Справа — чем уровни отличаются.</p>
      <div class="sto-two"><div class="sto-tree" data-tr></div><div data-lv></div></div>
      ${ui.note('info', 'Честно о названиях', 'В Jira уровни называются Epic → Story → Sub-task, но в разных командах лестница бывает длиннее: инициатива → эпик → фича → история. Строгих правил нет. Важна мысль: ценность видна на уровне истории, а задачи — это «как сделать».')}
    </div>`;
    function draw() {
      TR.$('[data-tr]', pane).innerHTML = `<button type="button" class="sto-node epic" data-n="epic" aria-pressed="${lvl === 'epic'}"><span class="sto-lbl">Эпик</span>Онлайн-запись в салон</button>
        <div class="sto-kids">${TREE_ST.map((s, i) => `<button type="button" class="sto-node story" data-n="s${i}" aria-pressed="${lvl === 'story' && open === i}"><span class="sto-lbl">История ${i + 1}</span>${esc(s.t)}</button>
          ${open === i ? `<div class="sto-kids">${s.tasks.map((x, j) => `<button type="button" class="sto-node task" data-n="t${j}" aria-pressed="${lvl === 'task' && task === j}"><span class="sto-lbl">Задача</span>${esc(x)}</button>`).join('')}</div>` : ''}`).join('')}</div>`;
      const L = LVL[lvl];
      TR.$('[data-lv]', pane).innerHTML = `<div class="sto-card"><b style="font:600 17px/1.3 var(--f-brand)">${esc(L.t)}</b><div class="sto-def">
        <span class="k">Размер</span><span class="v">${esc(L.size)}</span>
        <span class="k">Кто пишет</span><span class="v">${esc(L.who)}</span>
        <span class="k">Польза клиентке видна?</span><span class="v">${lvl === 'task' ? chip('нет', 'bad') : chip('да', 'ok')} ${esc(L.val)}</span>
        <span class="k">Где живёт</span><span class="v">${esc(L.where)}</span></div></div>
        ${lvl === 'task' ? ui.note('warn', 'Задача — не история', '«Таблица записей» нужна, но клиентка её не увидит. Если такую задачу оформить отдельной историей «Как разработчик…», в бэклоге появится работа без ценности, и владелица не поймёт, за что платит.') : ''}`;
    }
    TR.on(pane, 'click', '[data-n]', (e, b) => {
      const n = b.dataset.n;
      if (n === 'epic') { lvl = 'epic'; task = -1; }
      else if (n[0] === 's') { const i = +n.slice(1); open = i; lvl = 'story'; task = -1; }
      else { lvl = 'task'; task = +n.slice(1); }
      draw();
    });
    draw();
  }

  // Батон: вертикальные ломтики — разрез поперёк (хорошо), горизонтальные — вдоль, по слоям (плохо)
  function loaf(v, h, title) {
    const W = 480, H = 170, L = 16, R = W - 16, T = 38, B = 152;
    const crust = 'color-mix(in srgb, var(--warn) 65%, var(--text-muted))', crumb = 'color-mix(in srgb, var(--warn) 15%, var(--surface))';
    let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W + 140}px;min-width:300px" role="img" aria-label="${esc(title || 'Эпик — как батон')}">`;
    s += `<path d="M${L + 28} ${B} Q${L} ${B} ${L} ${B - 28} L${L} ${T + 26} Q${L + 6} ${T - 18} ${L + 74} ${T - 20} L${R - 74} ${T - 20} Q${R - 6} ${T - 18} ${R} ${T + 26} L${R} ${B - 28} Q${R} ${B} ${R - 28} ${B} Z" style="fill:${crumb};stroke:${crust};stroke-width:5"/>`;
    for (let i = 0; i < 5; i++) { const x = L + 80 + i * ((R - L - 160) / 4); s += `<path d="M${x - 20} ${T + 4} q20 -14 40 0" style="fill:none;stroke:${crust};stroke-width:3;stroke-linecap:round;opacity:.65"/>`; }
    const iL = L + 8, iR = R - 8;
    if (v && v.length) {
      const n = v.length, w = (iR - iL) / n;
      for (let i = 1; i < n; i++) { const x = iL + w * i; s += `<line x1="${x}" y1="${T - 14}" x2="${x}" y2="${B + 8}" style="stroke:var(--text);stroke-width:2;stroke-dasharray:7 5"/>`; }
      v.forEach((lab, i) => { const x = iL + w * i + w / 2; s += `<circle cx="${x}" cy="${(T + B) / 2 + 6}" r="${n > 7 ? 13 : 17}" style="fill:var(--surface);stroke:var(--accent);stroke-width:2"/><text x="${x}" y="${(T + B) / 2 + 12}" text-anchor="middle" style="fill:var(--text);font:700 ${n > 7 ? 14 : 17}px var(--f-brand)">${esc(lab)}</text>`; });
    }
    if (h && h.length) {
      const n = h.length + 1, hh = (B - T) / n;
      for (let i = 1; i < n; i++) { const y = T + hh * i; s += `<line x1="${L - 6}" y1="${y}" x2="${R + 6}" y2="${y}" style="stroke:var(--bad);stroke-width:2.5;stroke-dasharray:9 6"/>`; s += `<text x="${L + 12}" y="${y - 6}" style="fill:var(--bad);font:600 14px var(--f-body);paint-order:stroke;stroke:${crumb};stroke-width:4px">✕ ${esc(h[i - 1])}</text>`; }
    }
    if ((!v || !v.length) && (!h || !h.length)) s += `<text x="${W / 2}" y="${(T + B) / 2 + 6}" text-anchor="middle" style="fill:var(--text-2);font:600 18px var(--f-brand)">${esc(title || 'Эпик целиком')}</text>`;
    return s + '</svg>';
  }

  const KNIVES = [
    { k: 'S', en: 'Spike', ru: 'разведка', q: 'Чего мы не знаем настолько, что не можем оценить?', parts: ['Разведка на 2 дня: можно ли брать окна мастеров из программы, в которой их ведёт администратор', 'Потом — сама история записи, уже с понятным объёмом'], note: 'Итог разведки — знание, а не функция: записка с вариантами. Время на неё ограничивают заранее.' },
    { k: 'P', en: 'Paths', ru: 'пути', q: 'Какими разными путями человек проходит сценарий?', parts: ['Запись на свободное окно — основной путь', 'Лист ожидания, если окон нет', 'Запись с предоплатой — для долгого окрашивания'], note: 'Сначала самый частый путь, остальные — следующими историями.' },
    { k: 'I', en: 'Interfaces', ru: 'интерфейсы', q: 'Через какие экраны, устройства, каналы это делают?', parts: ['Запись на сайте', 'Запись через бот в мессенджере', 'Запись по телефону: администратор вносит её за клиентку'], note: 'Смысл один, «входы» разные. Начинают с того, где больше всего клиенток.' },
    { k: 'D', en: 'Data', ru: 'данные', q: 'Можно ли начать с части данных?', parts: ['Сначала только стрижки', 'Потом окрашивание — у него другая длительность окна', 'Сначала один салон, потом вся сеть'], note: 'Узкий набор данных — быстрее первый результат. Остальное добавляют, не переделывая.' },
    { k: 'R', en: 'Rules', ru: 'правила', q: 'Можно ли сначала обойтись без какого-то правила?', parts: ['Запись на любое свободное окно — без ограничений', 'Правило: записаться можно не позже чем за 2 часа до начала', 'Правило: отмена без штрафа — за 3 часа'], note: 'Правило откладывают, если первое время без него можно жить: например, администратор пока следит вручную.' }
  ];
  const LAYERS = ['Все таблицы базы данных', 'Вся логика на сервере', 'Все экраны'];
  function drawSpidr(pane) {
    let cur = 'P';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Эпик «Онлайн-запись в салон» — целый батон. Майк Кон предлагает пять ножей SPIDR. Выберите нож — и посмотрите, на какие ломтики он режет. Последняя кнопка — как резать не надо.</p>
      <div class="row">${KNIVES.map(x => `<button type="button" class="btn sm" data-kn="${x.k}" aria-pressed="${x.k === cur}"><b>${x.k}</b> · ${esc(x.ru)}</button>`).join('')}<button type="button" class="btn sm danger" data-kn="X" aria-pressed="${cur === 'X'}">✕ вдоль, по слоям</button></div>
      <div data-sp></div>
    </div>`;
    function draw() {
      const x = KNIVES.find(i => i.k === cur);
      if (!x) {
        TR.$('[data-sp]', pane).innerHTML = `<div class="sto-loaf">${loaf(null, LAYERS, 'Батон, разрезанный вдоль')}</div>
          <div class="sto-slices">${LAYERS.map((p, i) => `<div class="sto-slice bad"><span class="n">${i + 1}</span><span>${esc(p)}</span></div>`).join('')}</div>
          ${ui.note('bad', 'Так режут неправильно', 'Ни один слой нельзя показать клиентке: ценность появится только после всех трёх, через месяц. Это «горизонтальная» нарезка по технике — у каждого ломтика одна корка или один мякиш, бутерброд не сделать.')}`;
        return;
      }
      TR.$('[data-sp]', pane).innerHTML = `<div class="sto-loaf">${loaf(x.parts.map((_, i) => String(i + 1)), null, 'Батон, разрезанный поперёк')}</div>
        <div class="sto-card"><b>${x.k} — ${esc(x.en)} · ${esc(x.ru)}</b><div class="small"><b>Вопрос ножа:</b> ${esc(x.q)}</div>
        <div class="sto-slices">${x.parts.map((p, i) => `<div class="sto-slice"><span class="n">${i + 1}</span><span>${esc(p)}</span></div>`).join('')}</div>
        <div class="small muted">${esc(x.note)}</div></div>
        ${ui.note('ok', 'Поперёк — значит, со всеми слоями', 'В каждом ломтике есть и экран, и логика, и данные — его можно показать на демо, и клиентка уже что-то может сделать. Это «вертикальная» нарезка.')}`;
    }
    TR.on(pane, 'click', '[data-kn]', (e, b) => { cur = b.dataset.kn; TR.$$('[data-kn]', pane).forEach(z => z.setAttribute('aria-pressed', String(z === b))); draw(); });
    draw();
  }

  // Карта историй предзаказа «Колоса» (Паттон): хребет, релизы, линия MVP
  const MAP_ACTS = [
    { id: 'a1', t: 'Войти' },
    { id: 'a2', t: 'Выбрать пекарню и время' },
    { id: 'a3', t: 'Собрать заказ' },
    { id: 'a4', t: 'Оплатить' },
    { id: 'a5', t: 'Получить заказ' }
  ];
  const MAP_RELS = [
    { id: 'r1', t: 'Релиз 1 · MVP к 1 марта 2027' },
    { id: 'r2', t: 'Релиз 2 · после запуска' },
    { id: 'r3', t: 'Не в этот раз' }
  ];
  const MAP_CARDS = [
    { id: 'm1', t: 'Войти по номеру телефона', a: 'a1', r: 'r1' },
    { id: 'm2', t: 'Открыть заказ по ссылке из поста ВКонтакте', a: 'a1', r: 'r2' },
    { id: 'm3', t: 'Выбрать пекарню из девяти', a: 'a2', r: 'r1' },
    { id: 'm4', t: 'Выбрать получасовой интервал с 07:00 до 21:00', a: 'a2', r: 'r1' },
    { id: 'm5', t: 'Заказать на сегодня из того, что есть на витрине', a: 'a2', r: 'r1' },
    { id: 'm6', t: 'Добавить выпечку в заказ', a: 'a3', r: 'r1' },
    { id: 'm7', t: '«Повторить прошлый заказ»', a: 'a3', r: 'r2' },
    { id: 'm8', t: 'Подписка «хлеб каждое утро»', a: 'a3', r: 'r3' },
    { id: 'm9', t: 'Оплатить картой или СБП', a: 'a4', r: 'r1' },
    { id: 'm10', t: 'Оплатить при получении', a: 'a4', r: 'r1' },
    { id: 'm11', t: 'Оплатить баллами до 30 % чека', a: 'a4', r: 'r2' },
    { id: 'm12', t: 'Назвать код и получить пакет на кассе', a: 'a5', r: 'r1' },
    { id: 'm13', t: 'SMS или push «Заказ готов»', a: 'a5', r: 'r2' },
    { id: 'm14', t: 'Доставка хлеба домой', a: 'a5', r: 'r3' }
  ];
  function drawMap(pane, ctx) {
    const A = (ctx && ctx.ans) || {};
    const st = A.map = A.map || {};
    if (!Array.isArray(st.order) || st.order.length !== MAP_ACTS.length) st.order = TR.shuffle(MAP_ACTS.map(x => x.id), 'sto-map-order');
    st.pos = st.pos || {};
    let picked = null, marks = null, dragId = null;
    const save = () => { try { ctx && ctx.save && ctx.save(); } catch (e) { } };
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Теперь на «Колосе». Карта историй Джеффа Паттона: сверху — <b>хребет</b>, действия покупателя слева направо; под каждым действием — карточки-истории; горизонтальные полосы — <b>релизы</b>. Линия MVP отделяет то, что должно работать к 1 марта 2027.</p>
      <ol class="small" style="margin:0;padding-left:20px;display:grid;gap:3px"><li>Стрелками ← → расставьте действия хребта в том порядке, в каком их проходит покупатель.</li><li>Нажмите карточку, потом ячейку: под каким действием и в каком релизе она живёт. На компьютере можно перетаскивать. Чтобы вернуть карточку в стопку, выберите её и нажмите на стопку.</li><li>Следите за «ходячим скелетом» под картой и нажмите «Проверить себя».</li></ol>
      <div class="sto-mpool" data-mpool></div>
      <div class="sto-mapwrap"><div class="sto-map" data-board></div></div>
      <div data-skel></div>
      <div class="row"><button type="button" class="btn sm primary" data-mp="check">Проверить себя</button><button type="button" class="btn sm ghost" data-mp="ref">Как разложила Ксения</button><button type="button" class="btn sm ghost" data-mp="reset">Сбросить</button></div>
      <div data-mres></div>
    </div>`;
    const card = c => `<button type="button" class="sto-sc ${picked === c.id ? 'picked' : ''} ${marks && marks[c.id] ? marks[c.id] : ''}" data-card="${c.id}" draggable="true">${esc(c.t)}</button>`;
    function draw() {
      const pool = TR.shuffle(MAP_CARDS, 'sto-map-pool').filter(c => !st.pos[c.id]);
      TR.$('[data-mpool]', pane).innerHTML = pool.map(card).join('');
      TR.$('[data-mpool]', pane).classList.toggle('target', !!picked);
      let h = `<div class="sto-r5">${st.order.map((id, i) => `<div class="sto-act"><span>${i + 1}. ${esc(MAP_ACTS.find(x => x.id === id).t)}</span><span class="mv"><button type="button" data-am="${id}|-1" ${i === 0 ? 'disabled' : ''} aria-label="Левее">←</button><button type="button" data-am="${id}|1" ${i === st.order.length - 1 ? 'disabled' : ''} aria-label="Правее">→</button></span></div>`).join('')}</div>`;
      MAP_RELS.forEach(r => {
        if (r.id === 'r2') h += `<div class="sto-mvp"><span>линия MVP · 1 марта 2027</span></div>`;
        h += `<div class="sto-rel ${r.id === 'r1' ? 'mvp' : ''}">${esc(r.t)}</div><div class="sto-r5">${st.order.map(aid => `<div class="sto-cell ${picked ? 'target' : ''}" data-cell="${aid}|${r.id}">${MAP_CARDS.filter(c => st.pos[c.id] === aid + '|' + r.id).map(card).join('')}</div>`).join('')}</div>`;
      });
      TR.$('[data-board]', pane).innerHTML = h;
      const cover = st.order.map(aid => ({ a: MAP_ACTS.find(x => x.id === aid), ok: MAP_CARDS.some(c => st.pos[c.id] === aid + '|r1') }));
      const all = cover.every(x => x.ok);
      TR.$('[data-skel]', pane).innerHTML = `<div class="sto-card"><span class="sto-lbl">Ходячий скелет: пройдёт ли покупатель путь целиком в релизе 1?</span><div class="row">${cover.map(x => chip((x.ok ? '✓ ' : '✕ ') + esc(x.a.t), x.ok ? 'ok' : 'bad')).join('')}</div>
        <div class="small ${all ? '' : 'muted'}">${all ? 'Да: под каждым действием хребта в первом релизе есть хотя бы одна карточка. Покупатель может войти, выбрать, собрать, оплатить и забрать — пусть пока и без удобств.' : 'Пока нет. Если под каким-то действием в первом релизе пусто, покупатель упрётся в стену на этом шаге — и вся работа до него не принесёт пользы.'}</div></div>`;
    }
    function place(id, cell) { if (cell) st.pos[id] = cell; else delete st.pos[id]; picked = null; marks = null; TR.$('[data-mres]', pane).innerHTML = ''; save(); draw(); }
    pane.addEventListener('click', e => {
      const mv = e.target.closest('[data-am]');
      if (mv) { const [id, d] = mv.dataset.am.split('|'), i = st.order.indexOf(id), j = i + (+d); if (j >= 0 && j < st.order.length) { [st.order[i], st.order[j]] = [st.order[j], st.order[i]]; save(); draw(); } return; }
      const c = e.target.closest('[data-card]');
      if (c) { picked = picked === c.dataset.card ? null : c.dataset.card; draw(); return; }
      const cell = e.target.closest('[data-cell]');
      if (cell && picked) { place(picked, cell.dataset.cell); return; }
      if (e.target.closest('[data-mpool]') && picked) { place(picked, null); return; }
      const b = e.target.closest('[data-mp]');
      if (!b) return;
      if (b.dataset.mp === 'reset') { st.pos = {}; st.order = TR.shuffle(MAP_ACTS.map(x => x.id), 'sto-map-order'); marks = null; TR.$('[data-mres]', pane).innerHTML = ''; save(); draw(); }
      if (b.dataset.mp === 'ref') { st.order = MAP_ACTS.map(x => x.id); MAP_CARDS.forEach(x => { st.pos[x.id] = x.a + '|' + x.r; }); marks = null; save(); draw(); TR.$('[data-mres]', pane).innerHTML = ui.note('info', 'Как разложила Ксения', 'В первом релизе — всё, без чего покупатель не пройдёт путь, и всё, что Нина отметила как обязательное (Must): вход, пекарня и интервал, заказ на сегодня из остатков, оплата онлайн и на месте, выдача по коду. Удобства (повторить заказ, SMS, ссылка из ВКонтакте, баллы) — во втором. Подписка и доставка хлеба — «не в этот раз». А заказ по телефону через кассира живёт на карте кассира — у него свой хребет.'); }
      if (b.dataset.mp === 'check') {
        marks = {};
        let ok = 0, half = 0;
        MAP_CARDS.forEach(x => { const p = st.pos[x.id]; if (!p) return; const [a, r] = p.split('|'); const s = a === x.a && r === x.r ? 'ok' : (a === x.a || r === x.r) ? 'warn' : 'bad'; marks[x.id] = s; if (s === 'ok') ok++; if (s === 'warn') half++; });
        const placed = Object.keys(st.pos).length, ordOk = st.order.join() === MAP_ACTS.map(x => x.id).join();
        draw();
        TR.$('[data-mres]', pane).innerHTML = ui.note(ok === MAP_CARDS.length && ordOk ? 'ok' : 'warn', `На своих местах ${ok} из ${MAP_CARDS.length}`, `${placed < MAP_CARDS.length ? `Разложено ${placed} из ${MAP_CARDS.length}. ` : ''}${half ? `Жёлтых — ${half}: верно что-то одно, действие или релиз. ` : ''}Хребет ${ordOk ? 'по порядку ✓' : 'пока не по порядку: представьте, как покупатель идёт по шагам, — что он делает сначала?'} Сомневаетесь с релизом — вспомните, что Нина отнесла к обязательному для 1 марта, а что к «можно позже».`);
      }
    });
    pane.addEventListener('dragstart', e => { const c = e.target.closest('[data-card]'); if (c) { dragId = c.dataset.card; e.dataTransfer.setData('text/plain', dragId); } });
    pane.addEventListener('dragover', e => { const z = e.target.closest('[data-cell], [data-mpool]'); if (z && dragId) { e.preventDefault(); z.classList.add('over'); } });
    pane.addEventListener('dragleave', e => { const z = e.target.closest('[data-cell], [data-mpool]'); if (z) z.classList.remove('over'); });
    pane.addEventListener('drop', e => { const z = e.target.closest('[data-cell], [data-mpool]'); if (!z || !dragId) return; e.preventDefault(); const id = dragId; dragId = null; place(id, z.dataset.cell || null); });
    draw();
  }

  const howSplit = {
    id: 'how-split', covers: ['split'], title: 'Как это работает: режем батон поперёк и раскладываем путь', free: true, noReset: true,
    simple: {
      icon: '🍞',
      plain: 'Большую хотелку (эпик) не сделать за один заход. Её режут на истории так, чтобы каждая сама по себе приносила пользу и её можно было показать. А чтобы за ломтиками не потерять картину целиком, истории раскладывают на карте: слева направо — путь человека, сверху вниз — что важнее.',
      analogy: 'Батон режут поперёк, а не вдоль: в каждом ломтике есть и корка, и мякиш — его можно намазать маслом и съесть. Разрежете вдоль — получится отдельно корка и отдельно мякиш, и ни то ни другое не бутерброд.',
      tech: '<b>Эпик</b> — большая история, которая не помещается в спринт; <b>история</b> — то, что команда делает за несколько дней; <b>задача</b> — техническая работа внутри истории. <b>SPIDR</b> (Майк Кон): Spike — разведка, Paths — пути, Interfaces — интерфейсы, Data — данные, Rules — правила. <b>Карта историй</b> (Джефф Паттон, «Пользовательские истории. Искусство гибкой разработки ПО»): хребет — действия пользователя по порядку, под ним — истории по важности, горизонтальные срезы — релизы; первый срез, через который можно пройти путь целиком, — «ходячий скелет».'
    },
    lead: ui.brief({
      situation: 'Дима: «Предзаказ — это не история, это три месяца работы». Сначала — на соседнем примере онлайн-записи в салон: уровни и пять ножей. Потом — карта историй уже для предзаказа «Колоса».',
      todo: [
        'Вкладка «Эпик → история → задача»: нажимайте на узлы дерева и сравнивайте уровни справа.',
        'Вкладка «SPIDR — пять ножей»: выберите каждый нож и посмотрите, на какие ломтики он режет эпик. Нажмите «✕ вдоль, по слоям» — так резать нельзя.',
        'Вкладка «Карта историй „Колоса“»: расставьте хребет, разложите 14 карточек по действиям и релизам, следите за «ходячим скелетом» и нажмите «Проверить себя».'
      ],
      look: 'На карте линия MVP — пунктир с подписью «1 марта 2027». Всё, что выше неё, должно работать к запуску во всех пекарнях. Что входит в объём первой версии, Нина согласовала по итогам обследования.'
    }),
    render(el, ctx) {
      el.classList.add('sto-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'tree', t: 'Эпик → история → задача', render: fresh(drawTree) },
        { id: 'spidr', t: 'SPIDR — пять ножей', render: fresh(drawSpidr) },
        { id: 'map', t: 'Карта историй «Колоса»', render: fresh(p => drawMap(p, ctx)) }
      ], 'tree');
    }
  };

  // =====================================================================
  // Теория 3. Критерии приёмки: граница, форматы, Example Mapping
  // =====================================================================
  function drawBound(pane) {
    let q = 20; // за сколько четвертей часа до записи (0..40)
    const ex = [];
    pane.innerHTML = `<div class="stack">
      <div class="sto-rule"><span class="sto-lbl">Правило салона</span><b>Отменить запись без штрафа можно не позже чем за 3 часа до начала.</b></div>
      <p class="small muted">Клиентка записана на 15:00. Двигайте ползунок — когда она отменяет запись — и записывайте примеры. Хороший набор примеров обязательно трогает границу правила.</p>
      <label class="field"><span data-hl></span><input type="range" class="sto-range" min="0" max="40" step="1" value="${40 - q}" data-h aria-label="Когда клиентка отменяет запись"></label>
      <div data-tl></div>
      <div class="row"><button type="button" class="btn sm primary" data-add>+ Записать как пример</button><button type="button" class="btn sm ghost" data-clr>Очистить примеры</button></div>
      <div data-ex></div>
      <div data-cov></div>
    </div>`;
    const res = x => x >= 12;
    function tl() {
      const W = 420, H = 70, L = 14, R = W - 14, X = v => R - (R - L) * v / 40;
      let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Шкала времени до записи">`;
      s += `<rect x="${X(40)}" y="22" width="${X(12) - X(40)}" height="16" rx="4" style="fill:var(--ok-soft);stroke:var(--ok)"/>`;
      s += `<rect x="${X(12)}" y="22" width="${X(0) - X(12)}" height="16" rx="4" style="fill:var(--bad-soft);stroke:var(--bad)"/>`;
      s += `<line x1="${X(12)}" y1="12" x2="${X(12)}" y2="48" style="stroke:var(--text);stroke-width:2"/><text x="${X(12)}" y="62" text-anchor="middle" style="fill:var(--text);font:600 12px var(--f-mono)">за 3 ч · 12:00</text>`;
      s += `<text x="${X(40)}" y="62" style="fill:var(--text-muted);font:12px var(--f-mono)">05:00 · за 10 ч</text><text x="${X(0)}" y="62" text-anchor="end" style="fill:var(--text-muted);font:12px var(--f-mono)">15:00</text>`;
      ex.forEach(v => { s += `<circle cx="${X(v)}" cy="30" r="5" style="fill:var(--accent)"/>`; });
      s += `<path d="M${X(q)} 6 l-7 -0 l7 12 l7 -12 z" style="fill:var(--text)"/>`;
      return s + '</svg>';
    }
    function draw() {
      const min = 15 * 60 - q * 15;
      TR.$('[data-hl]', pane).innerHTML = `Отменяет за <b>${hm(q)}</b> до записи — в ${clock(min)}`;
      TR.$('[data-tl]', pane).innerHTML = `<div class="sto-loaf">${tl()}</div><div class="row">${res(q) ? chip('✓ без штрафа', 'ok') : chip('✕ со штрафом', 'bad')}${q === 12 ? chip('ровно на границе', 'warn') : ''}</div>`;
      TR.$('[data-ex]', pane).innerHTML = ex.length ? ui.table(['Дано', 'Когда', 'Тогда'], ex.map(v => ['запись на 15:00', `отмена в ${clock(15 * 60 - v * 15)} (за ${hm(v)})`, res(v) ? 'без штрафа' : 'со штрафом'])) : '<p class="small dim">Примеров пока нет — поставьте ползунок и нажмите «Записать как пример».</p>';
      const near = ex.some(v => v === 12) && ex.some(v => v === 11 || v === 13 || v < 12);
      const both = ex.some(res) && ex.some(v => !res(v));
      TR.$('[data-cov]', pane).innerHTML = !ex.length ? '' : near && both ? ui.note('ok', 'Граница покрыта', 'Есть пример ровно на границе и рядом с ней с другой стороны. Так и проверит тестировщик: ошибки прячутся в «≥» вместо «>». Здесь «не позже чем за 3 часа» — значит, ровно в 12:00 ещё без штрафа.')
        : both ? ui.note('warn', 'Обе стороны есть, но далеко от границы', 'Что будет, если отменить ровно за 3 часа, в 12:00? А за 2 ч 45 мин? Именно здесь разработчик может написать «больше» вместо «больше или равно».')
          : ui.note('warn', 'Примеры только с одной стороны правила', 'А что по другую сторону? Пример, где правило не выполняется, так же важен, как пример, где выполняется.');
    }
    TR.$('[data-h]', pane).addEventListener('input', e => { q = 40 - (+e.target.value); draw(); });
    TR.on(pane, 'click', '[data-add]', () => { if (!ex.includes(q)) { ex.push(q); ex.sort((a, b) => b - a); } draw(); });
    TR.on(pane, 'click', '[data-clr]', () => { ex.length = 0; draw(); });
    draw();
  }

  const FMT_LIST = ['Отмена без штрафа — не позже чем за 3 часа до начала', 'Позже — удерживается штраф 50 % стоимости услуги', 'После отмены окно снова свободно для записи', 'Клиентка получает подтверждение отмены'];
  const FMT_GWT = gk('отмена заранее — без штрафа', [['Дано', 'клиентка записана на 15:00'], ['Когда', 'она отменяет запись в 12:00'], ['Тогда', 'запись отменена без штрафа'], ['И', 'окно 15:00 снова свободно для записи']]) + '\n\n' + gk('поздняя отмена — со штрафом', [['Дано', 'клиентка записана на 15:00'], ['Когда', 'она отменяет запись в 12:15'], ['Тогда', 'запись отменена'], ['И', 'клиентка видит, что удержан штраф 50 %']]);
  function drawFormats(pane) {
    let cur = 'list';
    pane.innerHTML = `<div class="stack">
      <div class="sto-card yel"><span class="sto-lbl">История</span><div class="sto-story"><b>Как</b> клиентка, <b>я хочу</b> отменить запись онлайн, <b>чтобы</b> освободить время и не платить штраф.</div></div>
      ${ui.seg('fm', [{ v: 'list', t: 'Списком правил' }, { v: 'gwt', t: 'Дано / Когда / Тогда' }, { v: 'qa', t: 'Как это читает тестировщик' }], cur, 'accent')}
      <div data-fm></div>
    </div>`;
    function draw() {
      let h = '';
      if (cur === 'list') h = `<ul class="checks">${FMT_LIST.map(x => `<li>${esc(x)}</li>`).join('')}</ul>${ui.note('info', 'Когда подходит список', 'Правила короткие и независимые, контекст очевиден. Быстро писать и читать. Но легко забыть границу и порядок событий.')}`;
      if (cur === 'gwt') h = `${ui.code(FMT_GWT, 'text', 'Формат Gherkin: ключевые слова есть и по-русски — Дано, Когда, Тогда, И, Но')}<ul class="checks"><li><b>Дано</b> — контекст: что уже есть до действия (время, заказ, статус).</li><li><b>Когда</b> — одно действие человека или событие.</li><li><b>Тогда</b> — проверяемый результат: что человек увидит, что изменится.</li></ul>${ui.note('info', 'Когда подходит Дано / Когда / Тогда', 'Важны контекст, время и порядок событий. Пример на границе (12:00 и 12:15) записан явно. Из таких сценариев разработчики делают автоматические тесты — это подход BDD, Behaviour-Driven Development.')}`;
      if (cur === 'qa') h = `${ui.table(['№', 'Что делаю', 'Что жду', 'Зачем'], [['1', 'Запись на 15:00, отменяю в 12:00', 'Без штрафа, окно 15:00 свободно', 'ровно на границе'], ['2', 'Запись на 15:00, отменяю в 12:15', 'Удержан штраф 50 %', 'сразу за границей'], ['3', 'Запись на 15:00, отменяю в 09:00', 'Без штрафа', 'обычный случай'], ['4', 'Отменяю чужую запись по ссылке', '?', 'красная карточка: правила нет']])}${ui.note('warn', 'Тест 4 — дыра', 'Тестировщик придумал случай, на который в критериях нет ответа. Хорошо, что до разработки: вопрос уйдёт владелице салона, а не будет решён разработчиком «на глаз».')}`;
      TR.$('[data-fm]', pane).innerHTML = `<div class="stack">${h}</div>`;
    }
    ui.onSeg(pane, (n, v) => { if (n === 'fm') { cur = v; draw(); } });
    draw();
  }

  const EM = [
    { c: 'y', t: 'Как клиентка, я хочу отменить запись онлайн, чтобы освободить время и не платить штраф', who: 'Аналитик', note: 'Аналитик кладёт на стол жёлтую карточку — историю — и ставит таймер на 25 минут. За столом три амиго: аналитик, разработчик, тестировщик.' },
    { c: 'b', col: 0, t: 'Без штрафа — не позже чем за 3 часа', who: 'Аналитик', note: 'Синяя карточка — правило. Под каждым правилом будут зелёные примеры.' },
    { c: 'g', col: 0, t: 'Запись на 15:00, отмена в 11:00 → без штрафа', who: 'Разработчик', note: 'Разработчик предлагает простой пример.' },
    { c: 'g', col: 0, t: 'Отмена в 12:00, ровно за 3 часа → без штрафа', who: 'Тестировщик', note: 'Тестировщик сразу идёт к границе: что ровно в 3 часа?' },
    { c: 'g', col: 0, t: 'Отмена в 12:15 → штраф 50 %', who: 'Тестировщик', note: 'И по другую сторону границы.' },
    { c: 'r', t: 'Если салон сам перенёс запись, а клиентка потом отменила — штраф берём?', who: 'Тестировщик', note: 'Красная карточка — вопрос, на который за столом никто не знает ответа. Его не решают «на глаз», а записывают для владелицы салона.' },
    { c: 'b', col: 1, t: 'После отмены окно снова свободно', who: 'Разработчик', note: 'Второе правило — от разработчика: он думает, что будет с освободившимся окном.' },
    { c: 'g', col: 1, t: 'Отменили 15:00 → другая клиентка видит окно 15:00', who: 'Аналитик', note: 'Пример к правилу.' },
    { c: 'r', t: 'Если на это время есть лист ожидания — кому сообщаем первым?', who: 'Разработчик', note: 'Ещё один вопрос. Две красные карточки — сигнал: история пока не готова к спринту.' }
  ];
  function drawEM(pane) {
    let shown = 1;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Example Mapping Мэтта Уинна: 25 минут, цветные карточки, три амиго. Нажимайте «Шаг →» и смотрите, как растёт доска.</p>
      <div class="sto-legend"><span><b>жёлтая</b> — история</span><span><b>синие</b> — правила</span><span><b>зелёные</b> — примеры</span><span><b>красные</b> — вопросы</span></div>
      <div class="row"><button type="button" class="btn sm primary" data-em="step">Шаг →</button><button type="button" class="btn sm ghost" data-em="reset">⟲ Сначала</button><button type="button" class="btn sm ghost" data-em="all">Показать всё</button><span class="small dim tnum" data-emn></span></div>
      <div class="sto-emboard" data-emb></div>
      <div data-emnote></div>
    </div>`;
    function draw() {
      const vis = EM.slice(0, shown), last = vis[vis.length - 1];
      const k = (x, i) => `<div class="sto-k ${x.c} ${i === shown - 1 ? 'new' : ''}">${esc(x.t)}</div>`;
      const rules = [0, 1].map(col => vis.map((x, i) => ({ x, i })).filter(o => o.x.col === col));
      const reds = vis.map((x, i) => ({ x, i })).filter(o => o.x.c === 'r');
      TR.$('[data-emb]', pane).innerHTML = `${k(vis[0], 0)}<div class="sto-emgrid"><div class="sto-emcols">${rules.filter(r => r.length).map(r => `<div class="sto-emcol">${r.map(o => k(o.x, o.i)).join('')}</div>`).join('') || '<span class="small dim">Правил пока нет</span>'}</div><div class="sto-emcol">${reds.length ? reds.map(o => k(o.x, o.i)).join('') : '<span class="small dim">Вопросов пока нет</span>'}</div></div>`;
      TR.$('[data-emn]', pane).textContent = `${shown} / ${EM.length}`;
      const nb = vis.filter(x => x.c === 'b').length, ng = vis.filter(x => x.c === 'g').length, nr = vis.filter(x => x.c === 'r').length;
      TR.$('[data-emnote]', pane).innerHTML = `${ui.note('info', last.who, esc(last.note))}${shown === EM.length ? ui.note(nr ? 'warn' : 'ok', `Итог: правил ${nb}, примеров ${ng}, вопросов ${nr}`, 'Красные карточки — история не готова: сначала ответы владелицы, потом спринт. Много синих — история большая, её стоит разрезать. Зелёные примеры почти дословно становятся критериями Дано / Когда / Тогда.') : ''}`;
    }
    TR.on(pane, 'click', '[data-em]', (e, b) => { const a = b.dataset.em; if (a === 'step') shown = Math.min(EM.length, shown + 1); if (a === 'reset') shown = 1; if (a === 'all') shown = EM.length; draw(); });
    draw();
  }

  const howAccept = {
    id: 'how-accept', covers: ['gwt', 'lab'], title: 'Как это работает: критерии приёмки на примерах', free: true, noReset: true,
    simple: {
      icon: '✅',
      plain: 'Критерии приёмки — условия, при которых история считается сделанной. Их пишут до разработки вместе с разработчиком и тестировщиком. Надёжнее всего — на конкретных примерах: что было, что сделал человек, что он увидел. И обязательно на границе правила.',
      analogy: 'В рецепте написано «выпекать до золотистой корочки». Опытный пекарь добавит пример: «при 180° — 25 минут; тесто прямо из холодильника — 30». С примером новичок не ошибётся, а без него каждый поймёт «золотистую» по-своему.',
      tech: 'Критерии записывают списком правил или сценариями <b>Given/When/Then</b> (Дано/Когда/Тогда) — формат языка Gherkin из BDD (Behaviour-Driven Development, Дэн Норт). Примеры берут на границах правил (анализ граничных значений). <b>Example Mapping</b> (Мэтт Уинн): жёлтая карточка — история, синие — правила, зелёные — примеры, красные — вопросы. <b>Спецификация на примерах</b> — Гойко Аджич. Обсуждают историю втроём — «три амиго»: аналитик, разработчик, тестировщик.'
    },
    lead: ui.brief({
      situation: 'Соседний пример — то же правило отмены записи в салоне. Дима повторяет: «Напишите критерии приёмки». Лера добавляет: «И с примерами на границе — там всегда ошибки».',
      todo: [
        'Вкладка «Правило и граница»: двигайте ползунок, записывайте примеры и добейтесь, чтобы граница была покрыта с обеих сторон.',
        'Вкладка «Списком или Дано / Когда / Тогда»: переключите три вида одних и тех же критериев и найдите дыру, которую увидел тестировщик.',
        'Вкладка «Example Mapping»: пройдите по шагам 25-минутную встречу трёх амиго и посмотрите, когда история готова к спринту.'
      ],
      look: 'Позиция аналитика: он приносит историю и правила, ведёт встречу трёх амиго, записывает примеры как критерии, а красные вопросы относит тому, кто вправе решать, — в «Колосе» это Нина, Павел или Галина Ивановна.'
    }),
    render(el) {
      el.classList.add('sto-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'bound', t: 'Правило и граница', render: fresh(drawBound) },
        { id: 'fmt', t: 'Списком или Дано / Когда / Тогда', render: fresh(drawFormats) },
        { id: 'em', t: 'Example Mapping', render: fresh(drawEM) }
      ], 'bound');
    }
  };

  // =====================================================================
  // Практика 1. Соберите две истории из частей
  // =====================================================================
  const BB = [
    { id: 'role', t: 'Как …', sub: 'лицо карточки: кто' },
    { id: 'want', t: 'я хочу …', sub: 'лицо карточки: что' },
    { id: 'why', t: 'чтобы …', sub: 'лицо карточки: зачем' },
    { id: 'back', t: 'Оборот: критерии приёмки', sub: 'правила, по которым проверят' },
    { id: 'out', t: 'Не в историю', sub: 'лишнее или не здесь' }
  ];
  const B_HINT = {
    role: 'кто здесь получает пользу? Его называют после «Как».',
    want: 'здесь сказано, что человек хочет сделать, — без кнопок и экранов. Какой части карточки это нужно?',
    why: 'здесь польза для человека. Где на карточке живёт «зачем»?',
    back: 'это правило, по которому Лера проверит готовность. Оно не лишнее — где на карточке живут такие правила?'
  };
  const BS = [
    { id: 'buyer', t: 'История 1 · покупатель', need: 'Постоянные покупатели хотят забирать выпечку без очереди и не бояться, что к 9 утра круассаны закончатся.', frags: [
      { id: 'b1', t: 'Как постоянный покупатель', ok: 'role' },
      { id: 'b2', t: 'Как система «Колос-заказы»', ok: 'out', h: 'система ничего не хочет и не получает пользы. От чьего имени эта история?' },
      { id: 'b3', t: 'Как пользователь', ok: 'out', h: '«пользователь» — это кто: покупатель, кассир, технолог? Чем точнее роль, тем понятнее, чьи привычки учитывать.' },
      { id: 'b4', t: 'я хочу заранее заказать выпечку к выбранному времени в своей пекарне', ok: 'want' },
      { id: 'b5', t: 'я хочу нажать кнопку «Заказать заранее» в правом верхнем углу главного экрана', ok: 'out', h: 'кнопка и угол экрана — решение интерфейса. Его предложит Соня в макете, а в истории — что человек хочет сделать.' },
      { id: 'b6', t: 'чтобы забрать её без очереди и быть уверенным, что круассаны не закончатся', ok: 'why' },
      { id: 'b7', t: 'чтобы оформить предзаказ', ok: 'out', h: 'это повторяет «хочу» другими словами. Какую пользу получит покупатель?' },
      { id: 'b8', t: 'чтобы заказ сохранился в базе данных', ok: 'out', h: 'покупателю всё равно, где хранится заказ. Чья это цель — пользователя или разработчика?' },
      { id: 'b9', t: 'Заказ на завтра принимается до 22:30', ok: 'back' },
      { id: 'b10', t: 'Интервал выдачи — 30 минут, с 07:00 до 21:00', ok: 'back' },
      { id: 'b11', t: 'Неоплаченный заказ держат 30 минут после конца интервала', ok: 'back' },
      { id: 'b12', t: 'Всё работает быстро и удобно', ok: 'out', h: 'как Лера это проверит? Слова-ловушки не становятся критерием, даже если положить их на оборот.' },
      { id: 'b13', t: 'Сделать на React Native и PostgreSQL', ok: 'out', h: 'это выбор технологий — решение команды Димы. Покупатель его не видит.' }
    ] },
    { id: 'cashier', t: 'История 2 · кассир', need: 'В утренний пик на Покровке очередь 8–12 человек, а пакеты с предзаказами подписывают маркером по имени — «Лены» путаются.', frags: [
      { id: 'c1', t: 'Как кассир на Покровке в утренний пик', ok: 'role' },
      { id: 'c2', t: 'Как Нина Сергеевна', ok: 'out', h: 'Нина — владелица и заказчик, но заказы у кассы выдаёт не она. Кто стоит у кассы в 8 утра?' },
      { id: 'c3', t: 'Как разработчик', ok: 'out', h: 'разработчик делает историю, а не пользуется ею. Кому станет лучше?' },
      { id: 'c4', t: 'я хочу найти предзаказ по короткому коду и отметить его выданным', ok: 'want' },
      { id: 'c5', t: 'я хочу, чтобы в базе был индекс по полю «код заказа»', ok: 'out', h: 'индекс в базе — техническая задача внутри истории. Кассир о нём не знает и знать не должен.' },
      { id: 'c6', t: 'чтобы выдать заказ за несколько секунд и не задерживать очередь', ok: 'why' },
      { id: 'c7', t: 'чтобы нажать «Выдан»', ok: 'out', h: 'нажать кнопку — действие, а не польза. Что выигрывают кассир и очередь?' },
      { id: 'c8', t: 'Если заказ ждёт оплаты на месте, кассир видит сумму к оплате', ok: 'back' },
      { id: 'c9', t: 'При выдаче пробивается чек полного расчёта (54-ФЗ)', ok: 'back' },
      { id: 'c10', t: 'Заказ, не выкупленный через 30 минут после конца интервала, по коду не выдаётся: выпечка уже в продаже', ok: 'back' },
      { id: 'c11', t: 'Экран кассира должен быть удобным', ok: 'out', h: '«удобным» — для кого и в чём? Лера такое не проверит.' },
      { id: 'c12', t: 'Обновить библиотеку поиска до последней версии', ok: 'out', h: 'это техническая работа команды. Кассир её не заметит — её место среди задач.' }
    ] }
  ];
  const BF = BS.flatMap(s => s.frags.map(f => Object.assign({ sid: s.id }, f)));
  const FRONT = ['role', 'want', 'why'];
  function bEval(v) {
    v = v || {};
    const rows = BF.map(f => ({ f, got: v[f.id], s: v[f.id] === f.ok ? 'ok' : v[f.id] ? 'bad' : 'empty' }));
    const slots = BS.map(s => { const r = {}; FRONT.forEach(b => { r[b] = s.frags.filter(f => v[f.id] === b); }); return { s, r }; });
    const front = slots.every(x => FRONT.every(b => x.r[b].length === 1 && x.r[b][0].ok === b));
    return { rows, slots, front, score: rows.filter(r => r.s === 'ok').length / BF.length };
  }
  function bPreview(s, v) {
    const part = b => {
      const fs = s.frags.filter(f => v[f.id] === b);
      if (!fs.length) return `<span class="ph">…</span>`;
      const strip = t => t.replace(/^(Как|я хочу|чтобы)\s+/, '');
      return fs.length > 1 ? `<span class="warn">${fs.map(f => esc(strip(f.t))).join(' / ')}</span>` : esc(strip(fs[0].t));
    };
    const back = s.frags.filter(f => v[f.id] === 'back');
    return `<div class="sto-card yel"><span class="sto-lbl">Лицо карточки</span><div class="sto-story"><b>Как</b> ${part('role')}, <b>я хочу</b> ${part('want')}, <b>чтобы</b> ${part('why')}.</div>
      <div class="sto-back"><span class="sto-lbl">Оборот: критерии приёмки</span>${back.length ? `<ul class="checks">${back.map(f => `<li>${esc(f.t)}</li>`).join('')}</ul>` : '<span class="small dim">Пока пусто</span>'}</div></div>`;
  }
  const buildTask = {
    id: 'build', title: 'Соберите две истории из частей',
    simple: howStory.simple,
    lead: ui.brief({
      situation: 'Ксения выписала на стикеры всё, что прозвучало на встречах про предзаказ, — вперемешку: роли, желания, цели, правила из блокнота и то, что предлагали Рита, Дима и Нина. Ксения: «Соберите из этого две истории — для покупателя и для кассира. Лицо карточки — кто, что, зачем. Правила — на оборот. Остальное — в корзину, даже если звучит солидно».',
      todo: [
        'Переключатель сверху — какая история сейчас собирается. Для каждой разложите стикеры по пяти корзинам: «Как …», «я хочу …», «чтобы …», «Оборот: критерии приёмки», «Не в историю». Нажмите стикер, потом корзину (на компьютере можно перетаскивать).',
        'Над корзинами — карточка, какой она получается. Прочитайте её вслух: звучит ли она как речь живого человека?',
        'Нажмите «Проверить». Засчитывается, если на лице обеих карточек по одной верной части в каждом слоте и всего верно от 85 %.'
      ],
      look: 'Правила «Колоса» из блокнота: заказ на завтра — до 22:30, интервал 30 минут с 07:00 до 21:00, неоплаченный заказ держат 30 минут после конца интервала, оплата на месте при получении, чек по 54-ФЗ при выдаче.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(BF.map(f => [f.id, f.ok])) }),
    render(el, ctx) {
      el.classList.add('sto-root');
      const a = ctx.ans; a.v = a.v || {};
      let cur = 'buyer';
      el.innerHTML = `<div class="stack">${ui.seg('bs', BS.map(s => ({ v: s.id, t: s.t })), cur, 'accent')}<div data-bneed></div><div data-bprev></div><div data-bsort></div></div>`;
      function draw() {
        const s = BS.find(x => x.id === cur);
        TR.$('[data-bneed]', el).innerHTML = `<div class="small"><b>Нужда:</b> ${esc(s.need)}</div>`;
        TR.$('[data-bprev]', el).innerHTML = bPreview(s, a.v);
        let reveal = null;
        if (ctx.result || ctx.readonly) { reveal = {}; bEval(a.v).rows.forEach(r => { if (r.got) reveal[r.f.id] = r.s; }); }
        ui.sort(TR.$('[data-bsort]', el), { items: s.frags.map(f => ({ id: f.id, t: esc(f.t) })), buckets: BB, value: a.v, reveal, readonly: ctx.readonly, seed: 'sto-build-' + s.id,
          onChange: v => { a.v = v; ctx.save(); TR.$('[data-bprev]', el).innerHTML = bPreview(s, a.v); } });
      }
      ui.onSeg(el, (n, v) => { if (n === 'bs') { cur = v; draw(); } });
      draw();
    },
    check(ans) {
      const v = (ans && ans.v) || {}, ev = bEval(v), notes = [];
      const empty = ev.rows.filter(r => r.s === 'empty').length;
      if (empty) notes.push({ ok: false, html: `Не разложено ${empty} из ${BF.length} стикеров.` });
      ev.slots.forEach(x => FRONT.forEach(b => {
        if (x.r[b].length > 1) notes.push({ ok: false, html: `${esc(x.s.t)}: в слоте «${esc(BB.find(z => z.id === b).t)}» ${x.r[b].length} части. У истории одна роль, одно действие и одна цель — оставьте самую точную.` });
      }));
      const bad = ev.rows.filter(r => r.s === 'bad');
      bad.slice(0, 7).forEach(r => notes.push({ ok: false, html: `«${esc(r.f.t)}» — ${r.f.ok === 'out' ? esc(r.f.h) : B_HINT[r.f.ok]}` }));
      if (bad.length > 7) notes.push({ ok: 'warn', html: `И ещё ${bad.length - 7} — перечитайте каждую карточку вслух.` });
      if (!bad.length && !empty) notes.push({ ok: true, html: 'Обе карточки собраны: на лице — кто, что и зачем, на обороте — правила «Колоса».' });
      const sysInRole = bad.some(r => ['b2', 'b3', 'c2', 'c3'].includes(r.f.id) && r.got === 'role');
      const techIn = bad.some(r => ['b5', 'b8', 'b13', 'c5', 'c12'].includes(r.f.id) && r.got !== 'out');
      return {
        ok: ev.front && ev.score >= 0.85, score: ev.score, notes,
        summary: `На своих местах ${ev.rows.filter(r => r.s === 'ok').length} из ${BF.length}. Лицо обеих карточек: ${ev.front ? 'собрано верно' : 'пока нет'}.`,
        mentor: sysInRole ? 'Прочитайте вслух: «Как система, я хочу…» — звучит странно, правда? Роль — живой человек, которому станет лучше. Остальные — исполнители или заказчики.'
          : techIn ? 'Кнопки, базы данных и библиотеки — это «как». История говорит «что» и «зачем», а «как» команда решит вместе с Соней и Димой.' : null
      };
    },
    explain: `<p>Лицо карточки — три части, и у каждой своя работа:</p>
      ${ui.table(['Часть', 'Покупатель', 'Кассир', 'Зачем она'], [
        ['Как …', 'постоянный покупатель', 'кассир на Покровке в утренний пик', 'Чьи привычки и условия учитывать: у кассира очередь 8–12 человек и руки в муке'],
        ['я хочу …', 'заранее заказать выпечку к выбранному времени в своей пекарне', 'найти предзаказ по короткому коду и отметить выданным', 'Что человек делает — без кнопок и технологий'],
        ['чтобы …', 'забрать без очереди и быть уверенным, что круассаны не закончатся', 'выдать заказ за несколько секунд и не задерживать очередь', 'Ценность: по ней выбирают решение и приоритет']
      ])}
      <p>На обороте — правила из блокнота: 22:30, интервалы по 30 минут, 30 минут ожидания, оплата на месте, чек по 54-ФЗ. Это и есть третье «C» — подтверждение.</p>
      <p>Лишнее бывает пяти сортов: роль без пользы («система», «разработчик», «Нина Сергеевна» у кассы), решение интерфейса (кнопка в углу), технология (React Native, индекс в базе), «чтобы», которое повторяет «хочу», и слова-ловушки («быстро», «удобно»). Посмотрите на «…чтобы круассаны не закончатся»: из этой цели следует, что предзаказ должен попадать в план выпечки, а не только резервироваться с витрины. Одна фраза цели — и у Димы другое решение.</p>
      <p class="small muted">Источники: Майк Кон, «Пользовательские истории» (формат и роли); Рон Джеффрис — 3C.</p>`,
    report: ans => { const v = (ans && ans.v) || {}; return BS.map(s => `**${s.t}**\n` + s.frags.map(f => `- ${f.t} → ${(BB.find(b => b.id === v[f.id]) || { t: '—' }).t} ${v[f.id] === f.ok ? '✓' : '✗'}`).join('\n')).join('\n'); }
  };

  // =====================================================================
  // Практика 2. Восемь историй через фильтр INVEST
  // =====================================================================
  const LETTERS = ['I', 'N', 'V', 'E', 'S', 'T'];
  const INV = [
    { id: 'i1', t: 'Как покупатель, я хочу заказывать выпечку и торты, копить баллы, получать доставку и скидку после 19:00, чтобы всё было в одном приложении.', bad: 'S', alt: ['E'], hint: 'Сколько спринтов на это уйдёт? Это одна история — или пять?', why: 'S — это эпик: предзаказ, торты, баллы, доставка, скидки. Режем на истории.' },
    { id: 'i2', t: 'Как разработчик, я хочу настроить таблицу заказов в базе данных, чтобы хранить предзаказы.', bad: 'V', alt: [], hint: 'Кто из «Колоса» заметит пользу, когда это сделают? Покупатель? Кассир?', why: 'V — пользы не видит никто, кроме команды. Это задача внутри истории про предзаказ.' },
    { id: 'i3', t: 'Как кассир, я хочу, чтобы экран выдачи работал быстро и удобно.', bad: 'T', alt: ['V'], hint: 'Как Лера проверит «быстро и удобно»? И где «чтобы»?', why: 'T — не проверить: «быстро» и «удобно» без чисел. И нет «чтобы».' },
    { id: 'i4', t: 'Как покупатель без смартфона, я хочу заказать выпечку на завтра по телефону через кассира, чтобы забрать её без очереди, как все.', bad: null, hint: 'Перечитайте: кто, что, зачем — на месте? Можно сделать за спринт и проверить?', why: 'В порядке: роль точная (40 % постоянных клиентов старше 55 лет), польза ясна, проверить можно.' },
    { id: 'i5', t: 'Как покупатель, я хочу видеть экран выбора интервала выдачи (сам выбор заработает в истории «Сохранение интервала»), чтобы потом выбрать время.', bad: 'I', alt: ['V'], hint: 'Можно ли сделать и показать эту историю на демо, не дожидаясь другой?', why: 'I — сцеплена с другой историей и одна ничего не даёт. Это нарезка по слоям: экран отдельно, сохранение отдельно.' },
    { id: 'i6', t: 'Как покупатель, я хочу, чтобы при оплате вызывался метод POST /payments шлюза «ПэйМост» с полями amount и orderId, чтобы оплатить заказ.', bad: 'N', alt: ['V'], hint: 'Осталось ли место для разговора с Димой о том, как это сделать?', why: 'N — решение зашито в историю, обсуждать нечего. Покупателю нужен оплаченный заказ, а не метод API.' },
    { id: 'i7', t: 'Как технолог, я хочу, чтобы система сама прогнозировала план выпечки по погоде, праздникам, школьным каникулам и курсу рубля, чтобы не было списаний.', bad: 'E', alt: ['S'], hint: 'Может ли Дима сказать, сколько это займёт? Что ему нужно узнать сначала?', why: 'E — непонятно, возможно ли это и как: нужна разведка. И слишком крупно.' },
    { id: 'i8', t: 'Как кассир, я хочу видеть список предзаказов на ближайший интервал с кодами, чтобы собрать пакеты заранее, до утреннего пика.', bad: null, hint: 'Перечитайте: кто, что, зачем — на месте? Можно сделать за спринт и проверить?', why: 'В порядке: роль, действие и польза ясны, история небольшая и проверяемая.' }
  ];
  function invRow(x, got) {
    got = got || [];
    if (!got.length) return { s: 'empty', pts: 0 };
    if (x.bad === null) return got.length === 1 && got[0] === 'ok' ? { s: 'ok', pts: 1 } : { s: 'bad', pts: 0 };
    if (got.includes('ok')) return { s: 'bad', pts: 0 };
    const extra = got.filter(l => l !== x.bad && !(x.alt || []).includes(l)).length;
    if (got.includes(x.bad)) { const pts = Math.max(0, 1 - 0.5 * extra); return { s: pts === 1 ? 'ok' : pts > 0 ? 'warn' : 'bad', pts }; }
    if (got.some(l => (x.alt || []).includes(l))) return { s: 'warn', pts: Math.max(0, 0.5 - 0.5 * extra) };
    return { s: 'bad', pts: 0 };
  }
  const invEval = m => INV.map(x => Object.assign({ x, got: (m || {})[x.id] || [] }, invRow(x, (m || {})[x.id])));
  const investTask = {
    id: 'invest', title: 'Восемь историй через фильтр INVEST',
    simple: howStory.simple,
    lead: ui.brief({
      situation: 'Рита, Олег Петрович и Дима за выходные «помогли» и дописали в бэклог свои истории. Дима: «Перед спринтом прогоните всё через INVEST. Что не проходит — назад, на доработку. Мне в спринт нужны только здоровые истории».',
      todo: [
        'Прочитайте каждую из восьми историй.',
        'Нажмите буквы INVEST, которые история нарушает (можно две), или «✓ В порядке», если она здорова.',
        'Нажмите «Проверить». Засчитывается от 80 %. Где практики честно видят две буквы, вторая засчитывается.'
      ],
      lookTitle: 'Подсказка',
      look: 'I — независимая, N — обсуждаемая, V — ценная, E — оцениваемая, S — небольшая, T — проверяемая. Для каждой буквы — свой вопрос из теории: можно ли показать без другой? есть ли место для разговора? кто заметит пользу? можно ли прикинуть размер? влезет ли в спринт? как проверит Лера?'
    }),
    blank: () => ({ m: {} }),
    reference: () => ({ m: Object.fromEntries(INV.map(x => [x.id, x.bad ? [x.bad] : ['ok']])) }),
    render(el, ctx) {
      el.classList.add('sto-root');
      const a = ctx.ans; a.m = a.m || {};
      el.innerHTML = `<div class="stack"><div class="sto-legend">${INV_L.map(x => `<span><b>${x.l}</b> — ${esc(x.ru.toLowerCase())}</span>`).join('')}</div><div class="sto-inv" data-inv></div></div>`;
      function draw() {
        const ev = (ctx.result || ctx.readonly) ? invEval(a.m) : null;
        TR.$('[data-inv]', el).innerHTML = INV.map((x, i) => {
          const got = a.m[x.id] || [], r = ev && ev[i];
          const mk = l => { if (!r || !got.includes(l)) return ''; if (l === 'ok') return x.bad === null ? 'r-ok' : 'r-bad'; return l === x.bad || (x.alt || []).includes(l) ? 'r-ok' : 'r-bad'; };
          return `<div class="sto-irow ${r && r.s !== 'empty' ? r.s : r ? 'bad' : ''}"><div class="sto-itxt"><span class="n">${i + 1}</span><span>${esc(x.t)}</span></div>
            <div class="sto-ibtns">${LETTERS.map(l => `<button type="button" class="sto-ib ${mk(l)}" data-iv="${x.id}|${l}" aria-pressed="${got.includes(l)}" title="${esc(INV_L.find(z => z.l === l).ru)}" ${ctx.readonly ? 'disabled' : ''}>${l}</button>`).join('')}<button type="button" class="sto-ib wide ${mk('ok')}" data-iv="${x.id}|ok" aria-pressed="${got.includes('ok')}" ${ctx.readonly ? 'disabled' : ''}>✓ В порядке</button></div>
            ${ctx.readonly ? `<div class="sto-why">${esc(x.why)}</div>` : ''}</div>`;
        }).join('');
      }
      TR.on(el, 'click', '[data-iv]', (e, b) => {
        if (ctx.readonly) return;
        const [id, l] = b.dataset.iv.split('|');
        let got = (a.m[id] || []).slice();
        if (l === 'ok') got = got.includes('ok') ? [] : ['ok'];
        else { got = got.filter(z => z !== 'ok'); got = got.includes(l) ? got.filter(z => z !== l) : got.concat(l); }
        a.m[id] = got; ctx.save(); draw();
      });
      draw();
    },
    check(ans) {
      const ev = invEval(ans && ans.m), score = ev.reduce((s, r) => s + r.pts, 0) / INV.length, notes = [];
      const empty = ev.filter(r => r.s === 'empty').length;
      if (empty) notes.push({ ok: false, html: `Без оценки ${empty} из ${INV.length} историй.` });
      ev.forEach((r, i) => {
        if (r.s === 'bad' && r.got.length) notes.push({ ok: false, html: `История ${i + 1}: ${esc(r.x.hint)}` });
        else if (r.s === 'warn') notes.push({ ok: 'warn', html: `История ${i + 1}: близко, но главная беда в другом. ${esc(r.x.hint)}` });
      });
      if (ev.every(r => r.s === 'ok')) notes.push({ ok: true, html: 'Все восемь — верно: шесть историй назад на доработку, две — в спринт.' });
      const healthyBad = ev.filter(r => r.x.bad === null && r.got.length && !r.got.includes('ok')).length;
      const sickOk = ev.filter(r => r.x.bad && r.got.includes('ok')).length;
      return {
        ok: score >= 0.8, score, notes,
        summary: `Верно ${ev.filter(r => r.s === 'ok').length} из ${INV.length}, близко ${ev.filter(r => r.s === 'warn').length}.`,
        mentor: sickOk ? 'Если история звучит солидно, это ещё не значит, что она здорова. Задайте ей шесть вопросов по очереди — хотя бы один обычно спотыкается.'
          : healthyBad ? 'Не ищите болезнь там, где её нет. Если кто, что и зачем на месте, историю можно сделать за спринт и проверить — она годится.' : null
      };
    },
    explain: `${ui.table(['№', 'Буква', 'Что не так', 'Что сделать'], [
        ['1', 'S (и E)', 'Эпик: предзаказ, торты, баллы, доставка, скидки', 'Разрезать на истории и разложить на карте: баллы и доставка — не в первом релизе'],
        ['2', 'V', 'Голос разработчика, пользы не видно', 'Это задача внутри истории про предзаказ'],
        ['3', 'T (и V)', '«Быстро и удобно», нет «чтобы»', 'Цель — «не задерживать очередь в пик»; критерии числом'],
        ['4', '—', 'Здорова: роль точная, польза ясна', 'В спринт'],
        ['5', 'I (и V)', 'Сцеплена с «Сохранением интервала», нарезка по слоям', 'Склеить в одну историю «выбрать интервал»'],
        ['6', 'N (и V)', 'Решение — метод API — зашито в историю', 'Оставить «оплатить заказ картой или СБП»; детали — Диме'],
        ['7', 'E (и S)', 'Непонятно, возможно ли это: нужна разведка', 'Сначала разведка; прогноз по погоде — в «можно, если останется время»'],
        ['8', '—', 'Здорова', 'В спринт']
      ])}
      <p>Обратите внимание на шестую историю: она выглядит самой «технически грамотной», но именно поэтому плоха. Покупателю нужен оплаченный заказ, а не метод API. Решение зашито, обсуждать нечего — Дима не предложит способ проще, а Лера будет проверять вызов метода вместо оплаты.</p>
      <p>INVEST — это вопросы, а не приговор: у хорошей истории могут быть мелкие шероховатости. Аналитик задаёт эти вопросы до спринта — на уточнении бэклога (refinement), а не в середине разработки. Источник: Билл Уэйк, «INVEST in Good Stories, and SMART Tasks» (2003).</p>`,
    report: ans => invEval(ans && ans.m).map((r, i) => `- ${i + 1}. ${r.got.join(', ') || '—'} ${r.s === 'ok' ? '✓' : r.s === 'warn' ? '≈' : '✗'}`).join('\n')
  };

  // =====================================================================
  // Практика 3. Разрежьте эпик «Предзаказ» (SPIDR)
  // =====================================================================
  const SPL_CH = [
    { v: 'S', t: 'S · разведка' }, { v: 'P', t: 'P · пути' }, { v: 'I', t: 'I · интерфейсы' },
    { v: 'D', t: 'D · данные' }, { v: 'R', t: 'R · правила' }, { v: 'X', t: '✕ вдоль, по слоям' }
  ];
  const SPL = [
    { id: 's1', t: 'Разведка на 3 дня: можно ли получать остатки витрины из «КассаПро» по их публичному API. Итог — записка Димы с вариантами', ok: 'S' },
    { id: 's2', t: 'Заказ на завтра — одной историей; заказ на сегодня из того, что уже есть на витрине, — следующей', ok: 'P', also: { D: 'засчитано: «из остатков витрины» — другой источник данных, так тоже можно смотреть.' } },
    { id: 's3', t: 'Оплата онлайн картой или СБП — одна история; оплата при получении — другая', ok: 'P' },
    { id: 's4', t: 'Предзаказ в приложении покупателя — одна история; тот же предзаказ по телефону через экран кассира — другая', ok: 'I' },
    { id: 's5', t: 'Сначала приложение на Android и iOS, сайт — позже', ok: 'I' },
    { id: 's6', t: 'Сначала только 2 пилотные пекарни; остальные семь — следующей историей', ok: 'D' },
    { id: 's7', t: 'Сначала без ограничения 22:30 — в пилоте технолог закрывает приём вручную; правило 22:30 — отдельной историей', ok: 'R' },
    { id: 's8', t: 'Правило «неоплаченный заказ держим 30 минут после конца интервала» — отдельной историей', ok: 'R' },
    { id: 's9', t: 'Спроектировать все таблицы базы данных для предзаказа', ok: 'X' },
    { id: 's10', t: 'Сделать все экраны предзаказа без логики, а логику — в следующем спринте', ok: 'X' }
  ];
  const SPL_HINT = {
    S: 'итог здесь — знание, а не функция. Каким ножом режут то, чего мы пока не знаем?',
    P: 'это разные пути через один и тот же сценарий. Какой нож делит по путям?',
    I: 'смысл тот же — меняется «вход»: экран, устройство, канал. Какой это нож?',
    D: 'начинаем с части данных — части пекарен или товаров. Какой нож?',
    R: 'сначала без правила, правило — потом. Какой нож?',
    X: 'можно ли показать этот ломтик Нине на демо? Что покупатель сможет сделать после такого спринта?'
  };
  function splEval(m) {
    m = m || {};
    return SPL.map(x => { const got = m[x.id]; if (got === x.ok) return { x, got, s: 'ok', pts: 1 }; if (x.also && x.also[got]) return { x, got, s: 'ok', pts: 1, info: x.also[got] }; return { x, got, s: got ? 'bad' : 'empty', pts: 0 }; });
  }
  const splitTask = {
    id: 'split', title: 'Разрежьте эпик «Предзаказ»',
    simple: howSplit.simple,
    lead: ui.brief({
      situation: 'На уточнении бэклога Дима, Лера и Ксения нарезали эпик «Предзаказ выпечки» на десять кусков — каждый предлагал свой. Ксения: «Подпишите, каким ножом SPIDR отрезан каждый кусок. И найдите куски, отрезанные вдоль, — их надо переделать, а то на демо Нине будет нечего показать».',
      todo: [
        'Для каждого из десяти кусков нажмите нож: S — разведка, P — пути, I — интерфейсы, D — данные, R — правила — или «✕ вдоль, по слоям», если кусок нельзя показать покупателю сам по себе.',
        'Сверху батон-эпик режется так, как вы решили: вертикальные ломтики — поперёк, красные полосы — вдоль.',
        'Нажмите «Проверить». Засчитывается от 80 %, если найден хотя бы один кусок, отрезанный вдоль.'
      ],
      look: 'Для каждого куска спросите: что покупатель или кассир сможет сделать, когда этот кусок готов? Если ничего — резали вдоль. Если что-то может — каким вопросом ножа его отрезали?'
    }),
    blank: () => ({ m: {} }),
    reference: () => ({ m: Object.fromEntries(SPL.map(x => [x.id, x.ok])) }),
    render(el, ctx) {
      el.classList.add('sto-root');
      const a = ctx.ans; a.m = a.m || {};
      el.innerHTML = `<div class="stack"><div class="sto-loaf" data-loaf></div><div class="sto-legend">${KNIVES.map(k => `<span><b>${k.k}</b> — ${esc(k.en)}, ${esc(k.ru)}</span>`).join('')}</div><div class="sto-inv" data-spl></div></div>`;
      function draw() {
        const v = SPL.filter(x => a.m[x.id] && a.m[x.id] !== 'X').map(x => a.m[x.id]);
        const h = SPL.filter(x => a.m[x.id] === 'X').map((x, i) => 'кусок ' + (SPL.indexOf(x) + 1));
        TR.$('[data-loaf]', el).innerHTML = loaf(v, h, 'Эпик «Предзаказ выпечки»');
        const ev = (ctx.result || ctx.readonly) ? splEval(a.m) : null;
        TR.$('[data-spl]', el).innerHTML = SPL.map((x, i) => {
          const got = a.m[x.id], r = ev && ev[i];
          return `<div class="sto-irow ${r ? (r.s === 'empty' ? 'bad' : r.s) : ''}"><div class="sto-itxt"><span class="n">${i + 1}</span><span>${esc(x.t)}</span></div>
            <div class="sto-ibtns">${SPL_CH.map(c => `<button type="button" class="sto-ib ${c.v === 'X' ? 'wide' : ''} ${r && got === c.v ? (r.s === 'ok' ? 'r-ok' : 'r-bad') : ''}" data-sl="${x.id}|${c.v}" aria-pressed="${got === c.v}" title="${esc(c.t)}" ${ctx.readonly ? 'disabled' : ''}>${c.v === 'X' ? '✕ вдоль' : c.v}</button>`).join('')}</div></div>`;
        }).join('');
      }
      TR.on(el, 'click', '[data-sl]', (e, b) => {
        if (ctx.readonly) return;
        const [id, v] = b.dataset.sl.split('|');
        if (a.m[id] === v) delete a.m[id]; else a.m[id] = v;
        ctx.save(); draw();
      });
      draw();
    },
    check(ans) {
      const ev = splEval(ans && ans.m), score = ev.reduce((s, r) => s + r.pts, 0) / SPL.length, notes = [];
      const empty = ev.filter(r => r.s === 'empty').length;
      if (empty) notes.push({ ok: false, html: `Без ножа ${empty} из ${SPL.length} кусков.` });
      ev.forEach((r, i) => {
        if (r.info) notes.push({ ok: 'info', html: `Кусок ${i + 1} — ${esc(r.info)}` });
        else if (r.s === 'bad') notes.push({ ok: false, html: r.x.ok !== 'X' && r.got === 'X' ? `Кусок ${i + 1}: этот ломтик можно показать на демо — кто-то уже сможет что-то сделать. Значит, резали поперёк. Каким ножом?` : `Кусок ${i + 1}: ${SPL_HINT[r.x.ok]}` });
      });
      const xFound = ev.filter(r => r.x.ok === 'X' && r.s === 'ok').length;
      if (!xFound) notes.push({ ok: false, html: 'Среди кусков есть отрезанные вдоль — по слоям техники. Найдите те, после которых покупателю нечего делать.' });
      if (ev.every(r => r.s === 'ok')) notes.push({ ok: true, html: 'Все десять подписаны верно; два куска «вдоль» — на переделку.' });
      return {
        ok: score >= 0.8 && xFound >= 1, score, notes,
        summary: `Верно ${ev.filter(r => r.s === 'ok').length} из ${SPL.length}. Кусков «вдоль» найдено: ${xFound} из 2.`,
        mentor: xFound < 2 ? 'Самый частый грех новичка — резать по слоям: «сначала база, потом экраны». Удобно разработчику, но Нина на демо увидит пустоту. Спросите про каждый кусок: что покупатель сможет сделать?' : null
      };
    },
    explain: `${ui.table(['Кусок', 'Нож', 'Почему'], [
        ['Разведка по остаткам «КассаПро»', 'S', 'Пока не знаем, отдаёт ли «КассаПро» остатки, — нельзя оценить «заказ на сегодня». Итог — знание'],
        ['На завтра / на сегодня из остатков', 'P (или D)', 'Разные пути: на завтра — в план выпечки, на сегодня — резерв с витрины'],
        ['Онлайн-оплата / оплата при получении', 'P', 'Два пути через оплату, у каждого свой чек и статус'],
        ['Приложение / по телефону через кассира', 'I', 'Один смысл, разные «входы»; второй нужен покупателям без смартфона'],
        ['Android и iOS сначала, сайт потом', 'I', 'Тот же предзаказ, другое устройство'],
        ['2 пилотные пекарни, потом остальные', 'D', 'Часть данных: пилот к 1 февраля, все 9 — к 1 марта'],
        ['Без правила 22:30, потом с ним', 'R', 'В пилоте технолог закрывает приём вручную'],
        ['Правило 30 минут отдельно', 'R', 'Сначала выдача, потом автоматический статус «Не выкуплен»'],
        ['Все таблицы базы', '✕', 'Покупатель ничего не может сделать — показывать нечего'],
        ['Все экраны без логики', '✕', 'Картинки без поведения: ни заказать, ни проверить']
      ])}
      <p>Ножи можно сочетать: сначала по путям, потом каждый путь — по правилам. Хороший ломтик проходит INVEST: его можно показать Нине на демо через две недели, а Лера может его проверить. Два куска «вдоль» не выбрасывают — их работа войдёт в задачи внутри поперечных историй.</p>
      <p class="small muted">Источник: Майк Кон, SPIDR — «Five Simple but Powerful Ways to Split User Stories» (Mountain Goat Software).</p>`,
    report: ans => splEval(ans && ans.m).map((r, i) => `- ${i + 1}. ${r.x.t} → ${r.got || '—'} ${r.s === 'ok' ? '✓' : '✗'}`).join('\n')
  };

  // =====================================================================
  // Практика 4. Критерии приёмки Дано / Когда / Тогда (мини-редактор)
  // =====================================================================
  const TRAPS = /(быстр|удобн|корректн|правильн|нормальн|как надо|должным образом|красив|понятн|и т\.?\s?д|и так далее|по возможности|оптимальн|интуитивн)/i;
  const RE_TIME = /\b([01]?\d|2[0-3])[:.]([0-5]\d)\b/g;
  const times = s => { const out = []; String(s || '').replace(RE_TIME, (m, h, mm) => { out.push(+h * 60 + (+mm)); return m; }); return out; };
  const GW = [
    { id: 'g1', fact: 'F-cutoff', short: 'приём заказа на завтра до 22:30', rule: 'Заказ на завтра принимается до 22:30: в 23:00 технолог фиксирует план выпечки.',
      bnd: (g, w) => times(g + ' ' + w).some(t => t >= 22 * 60 + 29 && t <= 22 * 60 + 31) || /ровно в 22|минут[уы]? (до|после) 22/i.test(g + ' ' + w),
      bndHint: 'Пример далеко от границы. Что будет в 22:29? А в 22:31? Поставьте время в «Дано» или «Когда» вплотную к 22:30.',
      ref: { g: 'сейчас 22:31, покупатель в приложении выбрал пекарню на Покровке', w: 'он пытается оформить заказ на завтра', t: 'заказ на завтра не принимается: система сообщает, что приём закрыт в 22:30, и предлагает только то, что уже запланировано в выпечку' } },
    { id: 'g2', fact: 'F-hold', short: 'неоплаченный заказ держат 30 минут', rule: 'Неоплаченный предзаказ держат 30 минут после конца интервала, потом выпечка уходит в продажу.',
      bnd: (g, w) => { const all = g + ' ' + w; if (/(29|30|31)\s*мин|полчаса|ровно/i.test(all)) return true; const m = all.match(/([01]?\d|2[0-3])[:.]([0-5]\d)\s*[–—-]\s*([01]?\d|2[0-3])[:.]([0-5]\d)/); if (!m) return false; const end = (+m[3]) * 60 + (+m[4]); return times(all).some(t => Math.abs(t - (end + 30)) <= 1); },
      bndHint: 'Где граница? Назовите конец интервала и момент ровно через 30 минут после него (или «через 30 минут»).',
      ref: { g: 'предзаказ на интервал 08:00–08:30 ждёт оплаты на месте, покупатель не пришёл', w: 'наступает 09:00 — прошло 30 минут после конца интервала', t: 'заказ получает статус «Не выкуплен», а выпечка возвращается на витрину в продажу' } },
    { id: 'g3', fact: 'F-batch', short: 'круассаны не раньше 07:30', rule: 'Круассаны к выдаче раньше 07:30 не обещаем: первая партия на точке бывает в 07:20.',
      bnd: (g, w, t) => times(g + ' ' + w + ' ' + t).some(x => x >= 7 * 60 + 20 && x <= 7 * 60 + 31),
      bndHint: 'Возьмите интервал вплотную к 07:30 — например, тот, что заканчивается в 07:30, или тот, что в 07:30 начинается.',
      ref: { g: 'покупатель оформляет заказ на завтра в пекарне на Покровке', w: 'он выбирает интервал 07:00–07:30 и ищет круассаны', t: 'круассаны в этом интервале недоступны, система подсказывает, что они есть с 07:30; в интервале 07:30–08:00 их можно добавить' } }
  ];
  const GF = [
    { id: 'ctx', t: 'Дано: контекст — время, заказ, статус', hint: 'В «Дано» нужен конкретный контекст: который час, какой заказ, какая пекарня или статус.' },
    { id: 'act', t: 'Когда: одно действие или событие', hint: 'В «Когда» — что делает человек или что наступает: «оформляет», «выбирает», «наступает 09:00».' },
    { id: 'res', t: 'Тогда: проверяемый результат', hint: 'В «Тогда» — что Лера увидит: принят или нет, какой статус, что показано. Без «быстро», «корректно», «правильно».' },
    { id: 'bnd', t: 'граничный случай', hint: '' }
  ];
  function gwEval(r, s) {
    s = s || {};
    const g = String(s.g || '').trim(), w = String(s.w || '').trim(), t = String(s.t || '').trim();
    const f = {
      ctx: g.length >= 12 && (times(g).length > 0 || /(заказ|интервал|пекарн|оплач|покупател|корзин|витрин|статус)/i.test(g)),
      act: w.length >= 8 && /(оформ|выбира|выбер|пытает|нажим|добавл|добав|приход|приш|наступ|прош|истек|истёк|заказыв|закаж|отправ|открыва|оплач|ищет|подтвержд|отменя|отмени)/i.test(w),
      res: t.length >= 12 && /(принят|принима|отклон|недоступ|не доступ|нельзя|не может|предлаг|сообща|предупрежд|показыва|видит|статус|не выкуп|в продаж|возвращ|появля|скрыт|подсказ|попада|блокир|не добав|отказ|можно|доступн|добавлен)/i.test(t) && !TRAPS.test(t),
      bnd: r.bnd(g, w, t)
    };
    const n = Object.values(f).filter(Boolean).length;
    return { f, n, pass: n === 4, empty: !g && !w && !t, trap: TRAPS.test(t) };
  }
  const gwText = s => gk('…', [['Дано', (s && s.g) || '…'], ['Когда', (s && s.w) || '…'], ['Тогда', (s && s.t) || '…']]).replace('Сценарий: …\n', '');
  function gwLive(r, s) {
    const ev = gwEval(r, s);
    const miss = GF.find(x => !ev.f[x.id]);
    const lera = ev.empty ? 'Жду сценарий. Начните с «Дано»: что уже есть до действия?' : ev.trap ? 'В «Тогда» есть слово, которое я не измерю. Что именно я увижу на экране?' : miss ? (miss.id === 'bnd' ? r.bndHint : miss.hint) : 'Этот тест я напишу. А соседнее значение по другую сторону границы проверю сама.';
    return `${ui.code(gk(r.short, [['Дано', (s && s.g) || '…'], ['Когда', (s && s.w) || '…'], ['Тогда', (s && s.t) || '…']]), 'text')}
      <div class="sto-feats">${GF.map(x => chip((ev.f[x.id] ? '✓ ' : '✕ ') + esc(x.t), ev.f[x.id] ? 'ok' : ev.empty ? '' : 'bad')).join('')}</div>${ui.say('lera', esc(lera))}`;
  }
  const gwtTask = {
    id: 'gwt', title: 'Критерии приёмки: Дано / Когда / Тогда',
    simple: howAccept.simple,
    lead: ui.brief({
      situation: 'История покупателя собрана, на обороте — правила. Лера: «Правило „до 22:30“ я так не проверю: мне нужен пример. Напишите по одному сценарию на три самых опасных правила — и обязательно у самой границы. Там всегда ошибки».',
      todo: [
        'Для каждого из трёх правил заполните три поля: «Дано» — контекст, «Когда» — действие или событие, «Тогда» — что увидит Лера.',
        'Под полями — сценарий в формате Gherkin, признаки, по которым проверяет редактор, и реплика Леры. Они меняются, пока вы пишете: добивайтесь четырёх зелёных признаков.',
        'Нажмите «Проверить». Засчитывается, если хотя бы два сценария проходят все четыре признака и общий балл от 80 %.'
      ],
      lookTitle: 'Правила из блокнота',
      look: 'Заказ на завтра — до 22:30, в 23:00 план выпечки фиксируется; на сегодня — только из витрины. Неоплаченный заказ держат 30 минут после конца интервала, потом — статус «Не выкуплен», выпечка в продажу. Первая партия круассанов на точке бывает в 07:20 — раньше 07:30 их не обещаем. Редактор проверяет признаки, а не смысл: перечитайте сценарий глазами Леры.'
    }),
    blank: () => ({ s: {} }),
    reference: () => ({ s: Object.fromEntries(GW.map(r => [r.id, Object.assign({}, r.ref)])) }),
    render(el, ctx) {
      el.classList.add('sto-root');
      const a = ctx.ans; a.s = a.s || {};
      el.innerHTML = `<div class="stack">${GW.map((r, i) => {
        const s = a.s[r.id] || {};
        return `<div class="sto-gw" data-gw="${r.id}"><div class="sto-rule"><span class="sto-lbl">Правило ${i + 1}</span><b>${esc(r.rule)}</b></div>
          <div class="sto-gwf">${[['g', 'Дано', 'сейчас …, покупатель …'], ['w', 'Когда', 'он … / наступает …'], ['t', 'Тогда', 'система … / заказ получает статус …']].map(([k, kw, ph]) => `<span class="kw">${kw}</span><textarea rows="2" data-gf="${r.id}|${k}" placeholder="${esc(ph)}" aria-label="${kw}: правило ${i + 1}" ${ctx.readonly ? 'readonly' : ''}>${esc(s[k] || '')}</textarea>`).join('')}</div>
          <div data-glive="${r.id}"></div></div>`;
      }).join('')}</div>`;
      const paint = id => {
        const r = GW.find(x => x.id === id), s = a.s[id] || {}, box = TR.$(`[data-gw="${id}"]`, el), ev = gwEval(r, s);
        TR.$(`[data-glive="${id}"]`, el).innerHTML = gwLive(r, s);
        box.classList.remove('ok', 'warn', 'bad');
        if (ctx.result || ctx.readonly) box.classList.add(ev.pass ? 'ok' : ev.n >= 2 ? 'warn' : 'bad');
      };
      GW.forEach(r => paint(r.id));
      if (ctx.readonly) return;
      el.addEventListener('input', e => {
        const ta = e.target.closest('[data-gf]'); if (!ta) return;
        const [id, k] = ta.dataset.gf.split('|');
        a.s[id] = Object.assign({}, a.s[id], { [k]: ta.value }); ctx.save(); paint(id);
      });
    },
    check(ans) {
      const S = (ans && ans.s) || {};
      const ev = GW.map(r => ({ r, e: gwEval(r, S[r.id]) }));
      const pass = ev.filter(x => x.e.pass).length, score = ev.reduce((s, x) => s + x.e.n / 4, 0) / GW.length;
      const notes = ev.map((x, i) => {
        if (x.e.empty) return { ok: false, html: `Правило ${i + 1} (${esc(x.r.short)}): сценария пока нет.` };
        if (x.e.pass) return { ok: true, html: `Правило ${i + 1} (${esc(x.r.short)}): контекст, действие, проверяемый результат и граница — на месте.` };
        const miss = GF.filter(f => !x.e.f[f.id]).map(f => f.id === 'bnd' ? x.r.bndHint : f.hint);
        return { ok: x.e.n >= 3 ? 'warn' : false, html: `Правило ${i + 1} (${esc(x.r.short)}): ${miss.map(esc).join(' ')}` };
      });
      const noBnd = ev.filter(x => !x.e.empty && !x.e.f.bnd).length;
      return {
        ok: pass >= 2 && score >= 0.8, score, notes,
        summary: `Сценариев со всеми четырьмя признаками: ${pass} из ${GW.length}. Общий балл: ${Math.round(score * 100)} %.`,
        mentor: noBnd >= 2 ? 'Пример «в 21:50 заказ принят» Лера проверит за минуту — и ошибку не найдёт. Ошибки живут у самой границы: 22:29 и 22:31, 08:59 и 09:00, 07:00–07:30 и 07:30–08:00.' : null
      };
    },
    explain: `<p>Канонические примеры «Колоса» — и почему они такие:</p>
      ${ui.code(gk('приём заказа на завтра закрыт', [['Дано', 'сейчас 22:31, покупатель выбрал пекарню на Покровке'], ['Когда', 'он пытается оформить заказ на завтра'], ['Тогда', 'заказ на завтра не принимается'], ['И', 'система сообщает, что приём закрыт в 22:30, и предлагает только то, что уже запланировано в выпечку']]) + '\n\n' + gk('неоплаченный заказ не выкуплен', [['Дано', 'предзаказ на 08:00–08:30 ждёт оплаты на месте, покупатель не пришёл'], ['Когда', 'наступает 09:00'], ['Тогда', 'заказ получает статус «Не выкуплен»'], ['И', 'выпечка возвращается на витрину в продажу']]) + '\n\n' + gk('круассаны не раньше 07:30', [['Дано', 'покупатель оформляет заказ на завтра'], ['Когда', 'он выбирает интервал 07:00–07:30'], ['Тогда', 'круассаны в этом интервале недоступны'], ['Но', 'в интервале 07:30–08:00 их можно добавить']]), 'text', 'Эталонные сценарии')}
      <ul class="checks">
        <li><b>Граница.</b> 22:31 вместо 22:40 из первого черновика Ксении: в 22:40 ошибку «больше» вместо «больше или равно» не поймать.</li>
        <li><b>Красная карточка.</b> А ровно в 22:30:00 заказ ещё принимается? «До 22:30» можно понять двояко. Это вопрос к Нине, а не решение разработчика — запишите его до спринта.</li>
        <li><b>Один сценарий — одно правило.</b> Если в «Тогда» три разных результата про разные правила — это три сценария.</li>
        <li><b>Без интерфейса.</b> «Система сообщает» вместо «появляется красная плашка»: как сообщить, решит Соня в макете.</li>
      </ul>
      <p class="small muted">Источники: формат Given/When/Then — Дэн Норт, BDD; язык Gherkin (есть русские ключевые слова); Гойко Аджич, «Specification by Example».</p>`,
    refNote: 'Формулировки — пример: засчитываются любые сценарии с контекстом, действием, проверяемым результатом и временем вплотную к границе правила.',
    report: ans => GW.map(r => { const s = ((ans && ans.s) || {})[r.id] || {}; const e = gwEval(r, s); return `- ${r.short}: Дано ${s.g || '—'} / Когда ${s.w || '—'} / Тогда ${s.t || '—'} ${e.pass ? '✓' : '✗ (' + e.n + '/4)'}`; }).join('\n')
  };

  // =====================================================================
  // Практика 5. Лаборатория «Лера проверяет сборку» + ответ Нине
  // =====================================================================
  const CRIT = [
    { id: 'k1', t: 'Заказ на завтра принимается до 22:30; позже — только то, что уже запланировано в выпечку, с предупреждением', good: true },
    { id: 'k2', t: 'Заказ на завтра принимается до 23:00', good: false },
    { id: 'k3', t: 'Интервал выдачи — 30 минут, с 07:00 до 21:00, в выбранной пекарне', good: true },
    { id: 'k4', t: 'В интервал 07:00–07:30 круассаны недоступны', good: true },
    { id: 'k5', t: 'Неоплаченный заказ держат 30 минут после конца интервала, потом — статус «Не выкуплен», выпечка в продажу', good: true },
    { id: 'k6', t: 'Если оплата не прошла, заказ не теряется: можно повторить оплату или выбрать оплату при получении', good: true },
    { id: 'k7', t: 'Отмена бесплатна не позже чем за 2 часа до начала интервала; позже деньги за выпечку не возвращаются', good: true },
    { id: 'k8', t: 'После оформления покупатель видит короткий код заказа; по нему кассир находит заказ', good: true },
    { id: 'k9', t: 'Приложение работает быстро и удобно', good: false },
    { id: 'k10', t: 'Кнопка «Заказать» — зелёная, в правом верхнем углу', good: false }
  ];
  const GOOD = CRIT.filter(c => c.good).map(c => c.id);
  function leraRun(sel) {
    const on = id => sel.includes(id);
    const T = [
      { t: '21:50 · заказ на завтра на интервал 08:00–08:30', r: () => ['ok', 'Принят и попал в план выпечки на 23:00. Это «счастливый путь» — его сделают правильно и без критериев.'] },
      { t: '22:40 · ещё один заказ на завтра', r: () => on('k1') && on('k2') ? ['bad', 'Два критерия спорят: 22:30 или 23:00? Дима выбрал 23:00 — заказ принят, а план выпечки уже считается. Лера завела дефект на требования.'] : on('k2') ? ['bad', 'Принят «до 23:00» — а Галина Ивановна уже считает план. Утром заказа нет, покупатель стоит у пустой полки.'] : on('k1') ? ['ok', 'На завтра не принят: система предупреждает о 22:30 и предлагает то, что уже в плане выпечки.'] : ['bad', 'Ограничения нет — заказ принят и в 22:40, и в 01:00. План выпечки давно зафиксирован: утром выпечки нет.'] },
      { t: 'Интервал 21:30–22:00 в пекарне на Покровке', r: () => on('k3') ? ['ok', 'Такого интервала нет: выдача с 07:00 до 21:00.'] : ['bad', 'Интервал выбран, заказ оплачен. Покупатель приходит в 21:40 к закрытой двери.'] },
      { t: 'Интервал 07:00–07:30, в корзине круассаны', r: () => on('k4') ? ['ok', 'Круассаны в этот интервал не предлагаются: первая партия — в 07:20.'] : ['bad', 'Заказ принят. Покупатель пришёл в 07:05 — круассаны ещё в машине. Жалоба в соцсетях.'] },
      { t: 'Заказ на 08:00–08:30 не оплачен, покупатель не пришёл; 09:00', r: () => on('k5') ? ['ok', 'Статус «Не выкуплен», выпечка вернулась на витрину.'] : ['bad', 'Заказ висит до вечера, пакет лежит под прилавком, в 21:00 — в списание.'] },
      { t: 'Банк отклонил оплату картой', r: () => on('k6') ? ['ok', 'Заказ сохранён, покупателю предложено повторить оплату или оплатить при получении.'] : ['bad', 'Покупатель видит «Ошибка» и пустую корзину. Собирает заказ заново — или уходит к конкурентам.'] },
      { t: 'Отмена за 1 час до начала интервала', r: () => on('k7') ? ['ok', 'Отмена принята, деньги за выпечку не возвращаются — покупатель видел это правило заранее.'] : ['bad', 'Разработчик вернул деньги «на всякий случай»: выпечка испечена и не продана — пекарня в минусе.'] },
      { t: '08:10, пик · кассир ищет заказ покупателя', r: () => on('k8') ? ['ok', 'Покупатель назвал код — заказ найден за секунды, очередь не стоит.'] : ['bad', 'Кода нет: кассир ищет по имени, две «Лены» — пакеты перепутаны.'] }
    ];
    if (on('k9')) T.push({ t: 'Лера проверяет «быстро и удобно»', r: () => ['warn', 'Не могу проверить: быстро — это сколько? Удобно — кому? Критерий вернула на доработку. Скорость запишем числом отдельно — это нефункциональное требование.'] });
    if (on('k10')) T.push({ t: 'Лера проверяет зелёную кнопку', r: () => ['warn', 'Зелёная, справа вверху — тест прошёл. Через неделю Соня перенесла кнопку вниз: тест упал, хотя для покупателя ничего не сломалось. Это решение макета, а не критерий истории.'] });
    return T.map(x => { const [s, txt] = x.r(); return { t: x.t, s, txt }; });
  }
  function labEval(a) {
    const sel = ((a && a.sel) || []).filter(id => CRIT.some(c => c.id === id));
    const goodSel = sel.filter(id => GOOD.includes(id)).length, badSel = sel.filter(id => !GOOD.includes(id));
    const run = leraRun(sel);
    const labScore = Math.max(0, Math.min(1, goodSel / GOOD.length - 0.25 * badSel.length));
    return { sel, goodSel, badSel, run, holes: run.filter(r => r.s === 'bad').length, warns: run.filter(r => r.s === 'warn').length, labScore };
  }
  const L_RUBRIC = [
    'Объясняет историю просто: кто, что и зачем на одной карточке; детали договариваемся в разговоре и записываем критериями (три «C»)',
    'Показывает пользу «чтобы» на примере «Колоса»: например, «чтобы круассаны не закончились» значит, что предзаказ должен попасть в план выпечки, а не только в резерв с витрины',
    'Называет критерии приёмки её же правилами (22:30, 30 минут, круассаны с 07:30) — по ним она сама примет работу на демо',
    'Показывает, что без критериев будут дыры: разработчик угадывает, а ошибку найдут на пилоте (пример из лаборатории)',
    'Объясняет пользу маленьких историй для неё — результат на демо каждые две недели, можно менять порядок, MVP к 1 марта — и предлагает следующий шаг с её участием'
  ];
  const L_REF = 'Нина Сергеевна, история — это не сочинение, а записка на одну карточку: кто, что хочет сделать и зачем. Например: «Как постоянный покупатель, я хочу заранее заказать выпечку к нужному времени, чтобы забрать её без очереди и быть уверенным, что круассаны не закончатся». «Чтобы» здесь главное: раз цель — чтобы круассаны не закончились, заказ должен попадать в план выпечки Галины Ивановны к 23:00, а не просто откладываться с витрины. Без этой фразы Дима сделал бы второе — и утром круассанов всё равно бы не хватило. На обороте карточки — ваши же правила: заказ на завтра до 22:30, неоплаченный держим 30 минут, круассаны не раньше 07:30. Это критерии приёмки: по ним Лера проверяет работу, а вы на демо сами видите, что всё сделано, как договорились. Мы проверили: если правила не записать, разработчик угадывает — принимает заказы после 22:30, держит неоплаченные пакеты до вечера, — и ошибку находят на пилоте, у покупателей. А маленькие истории значат, что каждые две недели на демо вы видите работающий кусок и можете поменять порядок, если что-то важнее. Предлагаю в четверг 30 минут с вами, Павлом и Галиной Ивановной: пройдём карточки предзаказа и подтвердим правила.';
  const labTask = {
    id: 'lab', title: 'Лаборатория: Лера проверяет сборку',
    simple: howAccept.simple,
    lead: ui.brief({
      situation: 'Дима: «Мы сделаем ровно то, что написано на обороте карточки, — и ничего сверх. Где критерия нет, решаем сами, как проще». Лера уже приготовила восемь тестов на историю покупателя. Ксения: «Выберите критерии и посмотрите, где Лера найдёт дыры. Лучше сейчас, чем на пилоте в феврале». А в конце — письмо от Нины.',
      todo: [
        'Слева включайте и выключайте критерии приёмки. Справа сразу пересобирается сборка: Лера прогоняет тесты, красные строки — дыры, жёлтые — критерий, который она не может или не должна проверять.',
        'Добейтесь, чтобы дыр не осталось, и уберите критерии, которые мешают. Кнопка «▶ Прогнать тесты заново» показывает прогон по шагам.',
        'Ниже ответьте Нине Сергеевне своими словами: 6–10 предложений, от 300 символов. Затем «Проверить с Ксенией (Claude)» или «Сверить с эталоном самому».',
        'Нажмите «Проверить». Засчитывается, если выбраны все нужные критерии (можно пропустить один), лишних нет, а ответ Нине — от 60 %.'
      ],
      look: 'Первый тест — «счастливый путь»: его сделают правильно и без критериев. Все дыры прячутся в ветках и на границах. Позиция аналитика: критерии пишет он вместе с тремя амиго, а утверждает владелец продукта.'
    }),
    blank: () => ({ sel: [], j: {} }),
    reference: () => ({ sel: GOOD.slice(), j: { text: L_REF, self: L_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('sto-root');
      const a = ctx.ans; a.sel = Array.isArray(a.sel) ? a.sel : []; a.j = a.j || {};
      let timer = null;
      el.innerHTML = `<div class="stack">
        <div class="sto-card yel"><span class="sto-lbl">История в спринте</span><div class="sto-story"><b>Как</b> постоянный покупатель, <b>я хочу</b> заранее заказать выпечку к выбранному времени в своей пекарне, <b>чтобы</b> забрать её без очереди и быть уверенным, что круассаны не закончатся.</div></div>
        <div class="sto-lab">
          <div class="stack tight"><div class="eyebrow">Оборот карточки: критерии</div><div class="sto-crits" data-crits></div></div>
          <div class="stack tight"><div class="row between"><span class="eyebrow">Отчёт Леры о сборке</span>${ctx.readonly ? '' : '<button type="button" class="btn xs" data-run>▶ Прогнать тесты заново</button>'}</div><div class="sto-stats" data-lst></div><div class="sto-tests" data-tests></div></div>
        </div>
        <div class="eyebrow">Письмо от Нины Сергеевны</div>
        <div data-nina></div>
      </div>`;
      function drawCrits() {
        const ev = (ctx.result || ctx.readonly) ? true : false;
        TR.$('[data-crits]', el).innerHTML = CRIT.map(c => {
          const on = a.sel.includes(c.id), mk = ev && on ? (c.good ? 'ok' : 'bad') : '';
          return `<button type="button" class="sto-crit ${mk}" data-cr="${c.id}" aria-pressed="${on}" ${ctx.readonly ? 'disabled' : ''}><span class="sw" aria-hidden="true"></span><span>${esc(c.t)}</span></button>`;
        }).join('');
      }
      function drawTests(anim) {
        const ev = labEval(a), run = ev.run;
        const ok = run.filter(r => r.s === 'ok').length;
        TR.$('[data-lst]', el).innerHTML = `<div class="stat"><span class="k">Пройдено</span><span class="v ok">${ok}</span></div><div class="stat"><span class="k">Дыры</span><span class="v ${ev.holes ? 'bad' : 'ok'}">${ev.holes}</span></div><div class="stat"><span class="k">Не проверить</span><span class="v ${ev.warns ? 'warn' : 'ok'}">${ev.warns}</span></div>`;
        const box = TR.$('[data-tests]', el);
        box.innerHTML = run.map(r => `<div class="sto-test ${r.s} ${anim ? 'pend' : ''}"><span class="ic">${r.s === 'ok' ? '✓' : r.s === 'bad' ? '✕' : '!'}</span><span><span class="tc">${esc(r.t)}</span>${esc(r.txt)}</span></div>`).join('');
        if (anim) {
          clearInterval(timer); let i = 0; const rows = TR.$$('.sto-test', box);
          timer = setInterval(() => { if (!document.body.contains(box) || i >= rows.length) { clearInterval(timer); return; } rows[i].classList.remove('pend'); i++; }, 260);
        }
      }
      TR.on(el, 'click', '[data-cr]', (e, b) => {
        if (ctx.readonly) return;
        const id = b.dataset.cr;
        a.sel = a.sel.includes(id) ? a.sel.filter(x => x !== id) : a.sel.concat(id);
        ctx.save(); ctx.decide('Критерии приёмки истории покупателя', CRIT.filter(c => a.sel.includes(c.id)).map(c => c.t).join('; ') || '—');
        drawCrits(); drawTests(false);
      });
      TR.on(el, 'click', '[data-run]', () => drawTests(true));
      drawCrits(); drawTests(false);
      const nb = TR.$('[data-nina]', el);
      nb.insertAdjacentHTML('beforeend', ui.say('nina', 'Игорь прислал мне ваши «истории»: «Как постоянный покупатель, я хочу… чтобы…». Это что, сочинение? Зачем эти «чтобы» — я и так знаю, зачем мне предзаказ. И что за «критерии приёмки» на обороте? Напишите нормальный список, что сделать, — я подпишу, и делайте.'));
      const j = document.createElement('div'); j.style.marginTop = '12px'; nb.appendChild(j);
      ui.justify(j, {
        id: 'sto-why', q: 'Ответ Нине: зачем истории с «чтобы» и критерии приёмки?', placeholder: 'Нина Сергеевна, …',
        qPlain: 'Ответьте владелице сети пекарен, которая считает пользовательские истории «сочинением» и просит просто список задач. Объясните без жаргона, что такое история и зачем в ней «чтобы» (на примере предзаказа и плана выпечки), что такое критерии приёмки и почему это её же правила (22:30, 30 минут, круассаны с 07:30), что будет без них, чем ей полезны маленькие истории, и предложите следующий шаг с её участием.',
        rubric: L_RUBRIC, reference: L_REF, value: a.j, readonly: ctx.readonly, minLen: 300,
        onChange: v => { a.j = v; ctx.save(); ctx.decide('Ответ Нине про истории', v.text || ''); }
      });
    },
    check(ans) {
      const ev = labEval(ans), js = ui.justifyScore(ans && ans.j), notes = [];
      if (ev.holes) notes.push({ ok: false, html: `В сборке осталось дыр: ${ev.holes}. Посмотрите на красные строки отчёта Леры: какое правило «Колоса» закрыло бы каждую?` });
      else notes.push({ ok: true, html: 'Дыр нет: каждое правило, которое проверяет Лера, записано на обороте.' });
      if (ev.badSel.includes('k2')) notes.push({ ok: false, html: 'Один из критериев спорит с правилом цеха. Посмотрите на тест «22:40»: когда технолог фиксирует план?' });
      if (ev.badSel.includes('k9')) notes.push({ ok: false, html: 'Один критерий Лера не может проверить. Какие слова в нём не измерить? Вспомните неделю 2.' });
      if (ev.badSel.includes('k10')) notes.push({ ok: 'warn', html: 'Один критерий — про внешний вид, а не про поведение. Чей это артефакт — истории или макета Сони?' });
      if (js < 0.6) notes.push({ ok: false, html: js ? 'Ответ Нине пока слабый. Возьмите её же слова: «зачем эти „чтобы“» — и ответьте примером про круассаны и план выпечки. А критерии покажите как её правила, по которым она примет работу.' : 'Ответ Нине ещё не написан или не проверен: от 300 символов, затем проверка с Ксенией или сверка с эталоном.' });
      else notes.push({ ok: true, html: `Ответ Нине: ${Math.round(js * 100)} %.` });
      const score = ev.labScore * 0.6 + js * 0.4;
      return {
        ok: ev.labScore >= 0.85 && !ev.badSel.length && js >= 0.6, score, notes,
        summary: `Критериев выбрано верных: ${ev.goodSel} из ${GOOD.length}, лишних: ${ev.badSel.length}. Дыр в сборке: ${ev.holes}.`,
        mentor: ev.holes >= 3 ? 'Обратите внимание: первый тест прошёл и без критериев. «Счастливый путь» разработчики делают правильно всегда. Критерии нужны для веток и границ — именно там и живут дыры.' : null
      };
    },
    explain: `<p>Что показала лаборатория:</p>
      <ul class="checks">
        <li><b>«Счастливый путь» не нуждается в критериях</b> — его сделают правильно и так. Все дыры — в ветках (оплата не прошла, не пришёл, отменил) и на границах (22:30, 07:30, 21:00).</li>
        <li><b>Неверный критерий хуже отсутствующего.</b> «До 23:00» разработчик честно реализует — и сломает план выпечки. Критерии согласуют с теми, кто знает правило: 22:30 назвала Нина, а 23:00 — время Галины Ивановны.</li>
        <li><b>Непроверяемый критерий — не критерий.</b> «Быстро и удобно» — нефункциональное требование без числа; его записывают отдельно и числом (среда, «Нефункциональные требования»).</li>
        <li><b>Цвет кнопки — решение макета.</b> Критерии описывают поведение, а не интерфейс: иначе каждая правка Сони ломает тесты.</li>
      </ul>
      <p>В ответе Нине сильнее всего работает её же язык: не «критерии приёмки», а «ваши правила, по которым вы примете работу на демо». И её главный страх — пустая полка утром.</p>
      <p class="small muted">Источники: Майк Кон, «Пользовательские истории»; Гойко Аджич, «Specification by Example»; практика трёх амиго.</p>`,
    report: ans => { const ev = labEval(ans); return `Критерии: ${CRIT.filter(c => ev.sel.includes(c.id)).map(c => c.t + (c.good ? '' : ' [лишний]')).join('; ') || '—'}\nДыр: ${ev.holes}, непроверяемых: ${ev.warns}\nОтвет Нине: ${(ans && ans.j && ans.j.text) || '—'}`; }
  };

  // =====================================================================
  TR.stage({
    id: ID, act: 4, order: 310, slot: 'Пн 10:00', title: 'User story',
    when: 'понедельник, 26 октября, 10:00 · переговорная «Квант Софт», стена со стикерами',
    intro: [
      { who: 'igor', html: 'Обследование закончено, Нина Сергеевна согласовала объём первой версии. Скоро первый спринт — Диме нужен бэклог, а не письмо на полстраницы.' },
      { who: 'dima', html: 'Мне нужны истории, которые влезают в спринт, и критерии приёмки к каждой. «Сделать предзаказ» — это не история, это три месяца работы.' },
      { who: 'ksenia', html: 'Что такое требование и почему «быстро» — ловушка, вы уже знаете. Сегодня — как требования записывают пользовательскими историями: из чего они состоят, как проверить их по INVEST, как резать большое на маленькое и раскладывать на карте, и как написать критерии, по которым Лера найдёт дыры до пилота, а не после.' }
    ],
    facts: ['F-cutoff', 'F-slot', 'F-hold', 'F-batch', 'F-cancel', 'F-pay', 'F-peak', 'F-obs-names'],
    glossary: [
      { term: 'Пользовательская история (user story)', simple: 'Записка от имени человека: кто он, что хочет сделать и зачем.', tech: 'Короткое описание функциональности с точки зрения того, кто получает пользу: «Как &lt;роль&gt;, я хочу &lt;действие&gt;, чтобы &lt;ценность&gt;». Сопровождается разговором и критериями приёмки (Майк Кон, «Пользовательские истории»).' },
      { term: '3C', simple: 'Карточка — повод поговорить; разговор — где рождается понимание; подтверждение — как проверим.', tech: 'Card, Conversation, Confirmation — три составляющие истории по Рону Джеффрису (2001).' },
      { term: 'INVEST', simple: 'Шесть вопросов к истории перед спринтом.', tech: 'Independent, Negotiable, Valuable, Estimable, Small, Testable — независимая, обсуждаемая, ценная, оцениваемая, небольшая, проверяемая (Билл Уэйк, 2003).' },
      { term: 'Эпик', simple: 'Целый батон: за раз не съесть, режут на ломтики.', tech: 'Большая история, которая не помещается в один спринт и разбивается на истории. Внутри истории разработчики заводят технические задачи — часы работы, без самостоятельной ценности для пользователя.' },
      { term: 'SPIDR', simple: 'Пять ножей, которыми эпик режут поперёк.', tech: 'Способы разбиения историй Майка Кона: Spike (разведка), Paths (пути), Interfaces (интерфейсы), Data (данные), Rules (правила). Антипример — нарезка по слоям техники: «сначала база, потом экраны».' },
      { term: 'Карта пользовательских историй (story map)', simple: 'Путь покупателя слева направо, под каждым шагом — карточки по важности, полосы — релизы.', tech: 'Техника Джеффа Паттона: хребет (backbone) — действия пользователя по порядку; под ними — истории; горизонтальные срезы — релизы. Первый срез, через который можно пройти путь целиком, называют «ходячим скелетом» (walking skeleton).' },
      { term: 'Критерии приёмки', simple: 'Правила на обороте карточки: по ним проверят, что сделано.', tech: 'Условия, при которых история считается выполненной. Согласуются до разработки, записываются списком правил или сценариями Дано / Когда / Тогда.' },
      { term: 'Given/When/Then (Дано/Когда/Тогда)', simple: 'Пример в три шага: что было, что сделали, что увидели.', tech: 'Формат сценария из BDD (Behaviour-Driven Development) и языка Gherkin: контекст → действие или событие → проверяемый результат. В Gherkin есть русские ключевые слова: Дано, Когда, Тогда, И, Но.' },
      { term: 'Example Mapping', simple: 'Двадцать пять минут с цветными карточками: история, правила, примеры, вопросы.', tech: 'Техника Мэтта Уинна для обсуждения истории тремя амиго: жёлтая — история, синие — правила, зелёные — примеры, красные — открытые вопросы. Много красных — история не готова к спринту.' },
      { term: 'Граничное значение', simple: '22:29, 22:30, 22:31 — именно там прячутся ошибки.', tech: 'Значение на границе правила и рядом с ней. Примеры и тесты берут прежде всего на границах — техника тест-дизайна «анализ граничных значений».' }
    ],
    outro: 'Теперь история для вас — не шаблон из трёх частей, а обещание разговора: кто, что и зачем на лице карточки, правила и примеры — на обороте. Вы умеете проверить её по INVEST, разрезать эпик поперёк, как батон, разложить путь покупателя на карте до линии MVP и написать критерии, по которым Лера найдёт дыры до пилота, а не после. Завтра — сценарии использования: когда одной карточки мало и нужны все ветки «Оформить предзаказ».',
    tasks: [howStory, howSplit, howAccept, buildTask, investTask, splitTask, gwtTask, labTask]
  });
})();
