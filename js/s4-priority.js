/* Неделя 4, пятница 10:00 — «Ценность и приоритеты».
   Теория (соседний пример — сеть автомоек «Блеск»): паспорт ценности фичи (для кого, метрика, цель, цена, риск);
   модель Кано для приоритизации (пары вопросов и таблица оценки); калькулятор RICE; стоимость задержки и WSJF
   («зимняя мойка горит, бонусы — нет»); матрица «ценность / трудозатраты»; MoSCoW и ловушка «всё Must»
   (правило DSDM ~60 %); MVP — «скейтборд, а не колесо» и три школы; расползание объёма («ещё одна маленькая
   хотелка») и как сказать «не сейчас» через варианты с ценой.
   Практика на «Колосе»: RICE для 5 фич против интуиции + стоимость задержки (WSJF); матрица ценность/трудозатраты;
   главная лаборатория — MVP к 1 марта по MoSCoW (ёмкость 15 недель, бюджет, цели БЦ-1…БЦ-4, «что сломается»);
   спор «Рита хочет баллы в MVP»; ответ Нине своими словами, почему доставка и баллы — не в первой версии. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'priority';

  if (!document.getElementById('prio-css')) document.head.insertAdjacentHTML('beforeend', `<style id="prio-css">
    .prio-root, .prio-root .stack > * { min-width: 0; }
    .prio-root .seg button { white-space: normal; text-align: left; }
    .prio-lbl { font: 600 11px/1.35 var(--f-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--text-muted); }
    .prio-quote { border-left: 4px solid var(--violet); background: var(--surface); border-radius: 0 10px 10px 0; padding: 10px 14px; font-size: 15px; }
    .prio-quote small { display: block; color: var(--text-muted); font-size: 12.5px; margin-top: 4px; }
    .prio-pass { display: grid; gap: 6px; }
    .prio-pass .r { display: grid; grid-template-columns: 190px minmax(0, 1fr); gap: 4px 12px; padding: 8px 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); font-size: 14px; }
    .prio-pass .r .k { font: 600 11px/1.5 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .prio-pass .r.q { border-color: var(--warn); background: color-mix(in srgb, var(--warn-soft) 55%, var(--surface)); }
    .prio-pass .r.q .v { color: var(--warn); font-weight: 600; }
    .prio-kq { display: grid; gap: 4px; }
    .prio-kq .k { font-size: 13.5px; font-weight: 600; }
    .prio-kres { border: 1px solid var(--border); border-left: 5px solid var(--border-strong); border-radius: 10px; background: var(--surface); padding: 10px 14px; display: grid; gap: 4px; }
    .prio-kres .c { font: 700 17px/1.3 var(--f-brand); }
    .prio-ktbl td.on { background: var(--accent-soft); box-shadow: inset 0 0 0 2px var(--accent); font-weight: 700; }
    .prio-ktbl td, .prio-ktbl th { text-align: center; }
    .prio-ktbl td:first-child, .prio-ktbl th:first-child { text-align: left; }
    .prio-rcards { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 10px; }
    .prio-rc { border: 1px solid var(--border); border-radius: 12px; background: var(--surface); padding: 10px 12px; display: grid; gap: 8px; align-content: start; min-width: 0; }
    .prio-rc.ok { border-color: var(--ok); } .prio-rc.bad { border-color: var(--bad); } .prio-rc.warn { border-color: var(--warn); }
    .prio-rc h4 { font: 600 15px/1.3 var(--f-brand); }
    .prio-rc .cue { font-size: 13px; color: var(--text-2); line-height: 1.45; border-left: 3px solid var(--violet); padding-left: 8px; }
    .prio-rc .ctl { display: grid; gap: 4px; }
    .prio-rc .ctl .k { font-size: 12.5px; color: var(--text-muted); }
    .prio-rc .sc { font: 600 13px/1.4 var(--f-mono); color: var(--text-2); }
    .prio-rc .sc b { color: var(--accent); font-size: 15px; }
    .prio-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .prio-chips .chip { white-space: normal; }
    .prio-btns { display: flex; flex-wrap: wrap; gap: 4px; }
    .prio-btn { border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text); border-radius: 8px; padding: 4px 9px; font-size: 13px; line-height: 1.3; text-align: left; }
    .prio-btn:hover:not(:disabled) { border-color: var(--text-muted); }
    .prio-btn[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); font-weight: 600; }
    .prio-btn.ok { border-color: var(--ok); background: var(--ok-soft); color: var(--ok); }
    .prio-btn.bad { border-color: var(--bad); background: var(--bad-soft); color: var(--bad); }
    .prio-btn.warn { border-color: var(--warn); background: var(--warn-soft); color: var(--warn); }
    .prio-btn:disabled { cursor: default; opacity: 1; }
    .prio-range { width: 100%; accent-color: var(--accent); }
    .prio-rank { display: grid; gap: 4px; }
    .prio-rank .r { display: grid; grid-template-columns: 26px minmax(0, 1fr) auto; gap: 8px; align-items: center; padding: 6px 10px; border: 1px solid var(--border); border-radius: 9px; background: var(--surface); font-size: 14px; }
    .prio-rank .r .n { font: 700 13px/1 var(--f-mono); color: var(--text-muted); }
    .prio-rank .r .v { font: 600 13px/1 var(--f-mono); color: var(--accent); }
    .prio-cap { display: grid; gap: 4px; }
    .prio-cap .bar { position: relative; height: 16px; border-radius: 8px; background: var(--surface-3); overflow: hidden; display: flex; }
    .prio-cap .bar i { display: block; height: 100%; }
    .prio-cap .bar i.m { background: var(--accent); } .prio-cap .bar i.s { background: var(--info); } .prio-cap .bar i.c { background: var(--violet); opacity: .6; } .prio-cap .bar i.over { background: var(--bad); }
    .prio-cap .bar b { position: absolute; top: 0; bottom: 0; width: 2px; background: var(--text); opacity: .7; }
    .prio-cap .bar b.cap { background: var(--bad); opacity: 1; width: 3px; }
    .prio-cap .lg { display: flex; flex-wrap: wrap; gap: 4px 14px; font-size: 12.5px; color: var(--text-2); }
    .prio-cap .lg i { display: inline-block; width: 10px; height: 10px; border-radius: 3px; margin-right: 5px; vertical-align: -1px; }
    .prio-msr { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 6px 10px; align-items: center; padding: 6px 10px; border: 1px solid var(--border); border-radius: 9px; background: var(--surface); font-size: 14px; }
    .prio-msr small { color: var(--text-muted); font-family: var(--f-mono); font-size: 12px; margin-left: 6px; }
    .prio-scroll { overflow-x: auto; max-width: 100%; padding-bottom: 2px; }
    .prio-mvp { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; }
    .prio-st { border: 1px solid var(--border); border-radius: 10px; background: var(--surface); padding: 8px; display: grid; gap: 3px; text-align: center; align-content: start; font-size: 12.5px; line-height: 1.35; min-width: 0; }
    .prio-st .e { font-size: 24px; line-height: 1.2; font-family: var(--f-mono); color: var(--text); }
    .prio-st b { font-size: 13px; }
    .prio-st.on { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent) inset; }
    .prio-st.fut { opacity: .35; }
    .prio-st .can { color: var(--text-2); } .prio-st .can.no { color: var(--bad); } .prio-st .can.yes { color: var(--ok); }
    .prio-creq { display: grid; grid-template-columns: 70px minmax(0, 1fr) auto; gap: 6px 10px; align-items: center; padding: 8px 10px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); font-size: 14px; }
    .prio-creq .w { font: 600 12px/1.3 var(--f-mono); color: var(--text-muted); }
    .prio-creq.take { border-color: var(--warn); } .prio-creq.swap { border-color: var(--ok); }
    .prio-lab { display: grid; grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr); gap: 16px; align-items: start; }
    .prio-lab > * { min-width: 0; }
    .prio-lab .buckets { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .prio-lab .bucket[data-b="M"] { border-color: color-mix(in srgb, var(--accent) 45%, var(--border)); }
    .prio-goals { display: grid; gap: 6px; }
    .prio-goal { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 2px 8px; padding: 7px 10px; border: 1px solid var(--border); border-left: 4px solid var(--border-strong); border-radius: 9px; background: var(--surface); font-size: 13.5px; line-height: 1.4; }
    .prio-goal small { grid-column: 1 / -1; color: var(--text-2); font-size: 12.5px; }
    .prio-goal.ok { border-left-color: var(--ok); } .prio-goal.warn { border-left-color: var(--warn); } .prio-goal.bad { border-left-color: var(--bad); }
    .prio-mx .buckets { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .prio-mx .bucket[data-b="quick"] { border-color: color-mix(in srgb, var(--ok) 40%, var(--border)); }
    .prio-mx .bucket[data-b="trap"] { border-color: color-mix(in srgb, var(--bad) 35%, var(--border)); }
    .prio-axis { display: flex; flex-wrap: wrap; gap: 4px 16px; font: 600 12px/1.4 var(--f-mono); color: var(--text-muted); }
    .prio-meters { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .prio-opts { display: grid; gap: 6px; }
    .prio-opt { text-align: left; border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text); border-radius: 10px; padding: 8px 12px; font-size: 14px; line-height: 1.45; width: 100%; }
    .prio-opt:hover { border-color: var(--accent); }
    .prio-mine { display: flex; flex-wrap: wrap; gap: 6px; justify-content: flex-end; align-items: center; }
    @media (max-width: 900px) { .prio-lab { grid-template-columns: minmax(0, 1fr); } }
    @media (max-width: 560px) {
      .prio-pass .r { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .prio-mvp { grid-template-columns: repeat(5, 92px); gap: 4px; }
      .prio-st { padding: 6px 4px; font-size: 12px; }
      .prio-st .e { font-size: 20px; }
      .prio-creq { grid-template-columns: minmax(0, 1fr); }
      .prio-mx .buckets { grid-template-columns: minmax(0, 1fr); }
      .prio-lab .bucket { padding: 8px 6px; }
      .prio-lab .tok { font-size: 13px; padding: 5px 7px; }
      .prio-meters { grid-template-columns: minmax(0, 1fr); }
    }
  </style>`);

  // ---------- общие помощники ----------
  const fresh = fn => pane => { const d = document.createElement('div'); pane.appendChild(d); fn(d); };
  const nf = x => String(Math.round(x * 10) / 10).replace('.', ',');
  const big = x => Math.round(x).toLocaleString('ru-RU');
  const quizRef = cfg => cfg.options.map((o, i) => o.ok ? i : -1).filter(i => i >= 0);
  const btns = (key, opts, cur, o) => `<div class="prio-btns" role="group">${opts.map(x => `<button type="button" class="prio-btn ${o && o.mark && o.mark[x.v] ? o.mark[x.v] : ''}" data-pk="${esc(key)}" data-pv="${esc(x.v)}" aria-pressed="${String(cur) === String(x.v)}" ${o && o.readonly ? 'disabled' : ''} ${x.d ? `title="${esc(x.d)}"` : ''}>${esc(x.t)}</button>`).join('')}</div>`;
  // полоса ёмкости: сегменты по неделям, отметки долей ёмкости; при перегрузе — красная черта на границе ёмкости
  function capBar(segs, cap, marks) {
    const total = segs.reduce((s, x) => s + x.w, 0), scale = Math.max(cap, total);
    let h = '<div class="bar">';
    let used = 0;
    segs.forEach(x => {
      if (!x.w) return;
      const inCap = Math.max(0, Math.min(x.w, cap - used)), out = x.w - inCap;
      if (inCap) h += `<i class="${x.cls}" style="width:${inCap / scale * 100}%"></i>`;
      if (out) h += `<i class="over" style="width:${out / scale * 100}%"></i>`;
      used += x.w;
    });
    (marks || []).forEach(m => { h += `<b style="left:${m * cap / scale * 100}%"></b>`; });
    if (total > cap) h += `<b class="cap" style="left:calc(${cap / scale * 100}% - 1px)"></b>`;
    return h + '</div>';
  }

  // =====================================================================
  // Теория 1. Ценность фичи, Кано, RICE, стоимость задержки (автомойки «Блеск»)
  // =====================================================================
  const PF = [{ k: 'who', t: 'Для кого' }, { k: 'metric', t: 'Метрика' }, { k: 'goal', t: 'Цель бизнеса' }, { k: 'cost', t: 'Сколько стоит' }, { k: 'risk', t: 'Чем рискуем, если не сделать' }];
  const PASS = [
    { id: 'book', t: 'Онлайн-запись на время', said: 'Хочу, чтобы записывались через приложение — как в салон красоты.', kind: 'ok',
      p: { who: 'водители, которые в субботу ждут в очереди по 40 минут', metric: 'время ожидания в субботу; доля машин по записи', goal: 'выручка +10 % за сезон: по субботам моем больше машин', cost: '3 недели команды', risk: 'каждую субботу часть водителей разворачивается у ворот — к конкуренту' },
      v: 'Все пять ответов есть. Такую фичу можно честно сравнивать с другими — по формуле или на встрече.' },
    { id: 'bonus', t: 'Бонусы за мойки', said: 'У всех есть бонусы — и нам надо.', kind: 'warn',
      p: { who: 'постоянные клиенты — но сколько их, никто не считал', metric: '?', goal: '? «как у всех»', cost: '4 недели команды', risk: '? неизвестно' },
      v: 'Это гипотеза, а не доказанная ценность. Ответ аналитика — не «нет», а «давайте узнаем»: сколько постоянных, как часто приезжают. Тогда и решать.' },
    { id: 'dark', t: 'Тёмная тема', said: 'Сын сказал, сейчас модно тёмное.', kind: 'bad',
      p: { who: '?', metric: '?', goal: '?', cost: '1 неделя', risk: 'ничего не теряем' },
      v: 'Ценность не видна. Спросите «зачем?» — может, за этим есть потребность (мойщики работают ночью, и экран слепит?). Нет потребности — фича подождёт.' }
  ];
  function drawPass(pane) {
    let f = 'book', view = 'said';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Сеть автомоек «Блеск». Владелец приносит три просьбы. Сравнивать «хочу» с «хочу» невозможно — аналитик превращает каждую в паспорт ценности из пяти вопросов.</p>
      <div class="row">${ui.seg('pf', PASS.map(x => ({ v: x.id, t: x.t })), f, 'accent')}</div>
      <div class="row">${ui.seg('pv', [{ v: 'said', t: 'Как сказали' }, { v: 'pass', t: 'Паспорт ценности' }], view)}</div>
      <div data-out></div>
    </div>`;
    function draw() {
      const x = PASS.find(p => p.id === f);
      TR.$('[data-out]', pane).innerHTML = view === 'said'
        ? `<div class="stack"><div class="prio-quote">«${esc(x.said)}»<small>— владелец сети автомоек</small></div>${ui.note('info', 'Что здесь не так', 'Это просьба, а не ценность: непонятно, кому станет лучше, как мы это заметим, к какой цели ведёт, сколько стоит и что потеряем, если не делать. Откройте «Паспорт ценности».')}</div>`
        : `<div class="stack"><div class="prio-pass">${PF.map(k => { const v = x.p[k.k], q = /^\?/.test(v); return `<div class="r ${q ? 'q' : ''}"><span class="k">${esc(k.t)}</span><span class="v">${esc(v)}</span></div>`; }).join('')}</div>${ui.note(x.kind, x.kind === 'ok' ? 'Ценность понятна' : x.kind === 'warn' ? 'Гипотеза' : 'Ценность не видна', esc(x.v))}</div>`;
    }
    ui.onSeg(pane, (n, v) => { if (n === 'pf') f = v; if (n === 'pv') view = v; draw(); });
    draw();
  }

  const KA = [{ v: 'like', t: 'Нравится' }, { v: 'must', t: 'Так и должно быть' }, { v: 'neu', t: 'Всё равно' }, { v: 'live', t: 'Терплю' }, { v: 'dis', t: 'Не нравится' }];
  const KMID = { like: 'R', must: 'I', neu: 'I', live: 'I', dis: 'M' };
  const KT = { like: { like: 'Q', must: 'A', neu: 'A', live: 'A', dis: 'O' }, must: KMID, neu: KMID, live: KMID, dis: { like: 'R', must: 'R', neu: 'R', live: 'R', dis: 'Q' } };
  const KC = {
    M: { t: 'Обязательное', d: 'Есть — не замечают, нет — злятся. Делать первым: без этого уйдут.', col: 'var(--violet)' },
    O: { t: 'Одномерное', d: 'Чем больше, тем довольнее. Делать столько, сколько позволяет бюджет.', col: 'var(--info)' },
    A: { t: 'Привлекательное', d: 'Нет — не расстроятся, есть — восхищает. Одно-два для отличия, если останется место.', col: 'var(--ok)' },
    I: { t: 'Безразличное', d: 'Никому нет дела. Не делать.', col: 'var(--text-muted)' },
    R: { t: 'Обратное', d: 'Раздражает тех, кто ответил. Не делать — или делать отключаемым.', col: 'var(--bad)' },
    Q: { t: 'Сомнительный ответ', d: 'Человек противоречит себе — вопрос поняли неверно, переспросите.', col: 'var(--warn)' }
  };
  const KEX = [
    { v: 'clean', t: 'Чистый салон после мойки', f: 'must', d: 'dis' },
    { v: 'speed', t: 'Мойка за 15 минут', f: 'like', d: 'dis' },
    { v: 'coffee', t: 'Кофе в зоне ожидания', f: 'like', d: 'neu' },
    { v: 'music', t: 'Громкая музыка на мойке', f: 'neu', d: 'neu' }
  ];
  function drawKano(pane) {
    let ex = 'clean', f = 'must', d = 'dis';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">В «Видах требований» вы различали явные, неявные и восхищающие. Здесь — как из этого получить порядок работ. Клиентам задают пару вопросов про одно свойство: «если оно есть — как вам?» и «если его нет — как вам?». По таблице Кано пара ответов даёт категорию.</p>
      <div class="row"><span class="small dim">Пример:</span>${ui.seg('kx', KEX.map(x => ({ v: x.v, t: x.t })), ex, 'accent')}</div>
      <div class="prio-kq"><span class="k" data-kf></span><div data-f></div></div>
      <div class="prio-kq"><span class="k" data-kd></span><div data-d></div></div>
      <div data-res></div>
      <details class="more"><summary>Таблица Кано целиком</summary><div data-tbl></div></details>
    </div>`;
    function draw() {
      const x = KEX.find(e => e.v === ex), c = KT[f][d], k = KC[c];
      TR.$('[data-kf]', pane).textContent = `Если на мойке есть «${x.t.toLowerCase()}» — как вам?`;
      TR.$('[data-kd]', pane).textContent = `Если «${x.t.toLowerCase()}» нет — как вам?`;
      TR.$('[data-f]', pane).innerHTML = btns('kf', KA, f);
      TR.$('[data-d]', pane).innerHTML = btns('kd', KA, d);
      TR.$('[data-res]', pane).innerHTML = `<div class="prio-kres" style="border-left-color:${k.col}"><span class="small dim">Категория по Кано</span><span class="c" style="color:${k.col}">${esc(k.t)}</span><span>${esc(k.d)}</span></div>`
        + ui.note('info', 'Порядок по Кано', 'Сначала обязательные (без них уйдут), потом одномерные (сколько позволит бюджет), потом одно-два привлекательных для отличия. Безразличные и обратные — не делать. И помните: восхищение стареет — через пару лет привлекательное становится обязательным.');
      TR.$('[data-tbl]', pane).innerHTML = `<div class="tbl-wrap"><table class="tbl prio-ktbl"><thead><tr><th>Есть ↓ / нет →</th>${KA.map(a => `<th>${esc(a.t)}</th>`).join('')}</tr></thead><tbody>${KA.map(r => `<tr><td><b>${esc(r.t)}</b></td>${KA.map(cc => `<td class="${r.v === f && cc.v === d ? 'on' : ''}">${esc(KC[KT[r.v][cc.v]].t.split(' ')[0])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    }
    ui.onSeg(pane, (n, v) => { if (n === 'kx') { ex = v; const x = KEX.find(e => e.v === v); f = x.f; d = x.d; draw(); } });
    TR.on(pane, 'click', '[data-pk]', (e, b) => { if (b.dataset.pk === 'kf') f = b.dataset.pv; else d = b.dataset.pv; draw(); });
    draw();
  }

  const I_SCALE = [{ v: 3, t: '3 · огромное' }, { v: 2, t: '2 · большое' }, { v: 1, t: '1 · среднее' }, { v: 0.5, t: '0,5 · малое' }, { v: 0.25, t: '0,25 · минимальное' }];
  const C_SCALE = [{ v: 100, t: '100 % · есть данные' }, { v: 80, t: '80 % · косвенные признаки' }, { v: 50, t: '50 % · мнение' }];
  const E_SCALE = [{ v: 0.5, t: '0,5' }, { v: 1, t: '1' }, { v: 2, t: '2' }, { v: 3, t: '3' }, { v: 4, t: '4' }, { v: 6, t: '6' }];
  const rice = (r, i, c, e) => r * i * (c / 100) / e;
  function drawRice(pane) {
    const st = { book: { r: 1200, i: 2, c: 80, e: 3, t: 'Онлайн-запись' }, bonus: { r: 3000, i: 0.5, c: 50, e: 4, t: 'Бонусы за мойки' }, remind: { r: 2500, i: 1, c: 80, e: 0.5, t: 'Напоминание «пора помыть» через 2 недели' } };
    pane.innerHTML = `<div class="stack">
      <p class="small muted">RICE придумали в компании Intercom: <b>R</b>each — охват (сколько людей за период), <b>I</b>mpact — влияние на цель, если сработает, <b>C</b>onfidence — уверенность в оценках, <b>E</b>ffort — трудозатраты. Балл = R × I × C ÷ E. Меняйте оценки автомоек и смотрите на рейтинг.</p>
      <div class="prio-rank" data-rank></div>
      <div class="prio-rcards" data-c></div>
      ${ui.note('info', 'Что важно знать', 'Охват и трудозатраты считают, влияние и уверенность — договариваются. Формула не отменяет разговор, а делает его честным: все видят, откуда число. Заметьте, как дешёвое напоминание обгоняет большую онлайн-запись: RICE любит дешёвое и массовое. И чего формула не видит вовсе — срока: об этом следующая вкладка.')}
    </div>`;
    function draw() {
      const ids = Object.keys(st), sc = id => rice(st[id].r, st[id].i, st[id].c, st[id].e);
      TR.$('[data-rank]', pane).innerHTML = ids.slice().sort((a, b) => sc(b) - sc(a)).map((id, k) => `<div class="r"><span class="n">${k + 1}</span><span>${esc(st[id].t)}</span><span class="v">${big(sc(id))}</span></div>`).join('');
      TR.$('[data-c]', pane).innerHTML = ids.map(id => { const x = st[id]; return `<div class="prio-rc"><h4>${esc(x.t)}</h4>
        <label class="ctl"><span class="k">Охват: <b>${big(x.r)}</b> водителей за квартал</span><input type="range" class="prio-range" min="100" max="5000" step="100" value="${x.r}" data-rr="${id}" aria-label="Охват"></label>
        <div class="ctl"><span class="k">Влияние</span>${btns(id + '|i', I_SCALE, x.i)}</div>
        <div class="ctl"><span class="k">Уверенность</span>${btns(id + '|c', C_SCALE, x.c)}</div>
        <div class="ctl"><span class="k">Трудозатраты, недель</span>${btns(id + '|e', E_SCALE, x.e)}</div>
        <div class="sc">${big(x.r)} × ${nf(x.i)} × ${x.c} % ÷ ${nf(x.e)} = <b>${big(sc(id))}</b></div></div>`; }).join('');
    }
    TR.on(pane, 'click', '[data-pk]', (e, b) => { const [id, k] = b.dataset.pk.split('|'); st[id][k] = +b.dataset.pv; draw(); });
    pane.addEventListener('change', e => { const r = e.target.closest('[data-rr]'); if (r) { st[r.dataset.rr].r = +r.value; draw(); } });
    pane.addEventListener('input', e => { const r = e.target.closest('[data-rr]'); if (r) { st[r.dataset.rr].r = +r.value; const card = r.closest('.prio-rc'); const k = card && card.querySelector('.ctl .k b'); if (k) k.textContent = big(+r.value); } });
    draw();
  }

  function codSVG(d) {
    const W = 440, H = 176, X = w => 26 + w / 24 * 400;
    const relW = 2 + d, relB = 4 + d;
    let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:620px;display:block" role="img" aria-label="Ценность двух фич во времени при задержке">`;
    ['окт', 'ноя', 'дек', 'янв', 'фев', 'мар', 'апр'].forEach((m, i) => { s += `<line x1="${X(i * 4)}" y1="20" x2="${X(i * 4)}" y2="150" style="stroke:var(--border);stroke-width:1"/><text x="${i === 6 ? X(24) - 2 : X(i * 4) + 3}" y="166" ${i === 6 ? 'text-anchor="end"' : ''} style="fill:var(--text-muted);font-size:12px">${m}</text>`; });
    // зимняя мойка: сезон 4–20
    s += `<text x="26" y="16" style="fill:var(--text);font-size:12.5px;font-weight:600">Зимняя мойка днища — сезон ноябрь–март</text>`;
    s += `<rect x="${X(4)}" y="24" width="${X(20) - X(4)}" height="36" rx="5" style="fill:var(--info-soft);stroke:var(--info);stroke-dasharray:4 3"/>`;
    const g0 = Math.max(4, relW);
    if (relW > 4) s += `<rect x="${X(4)}" y="28" width="${X(Math.min(20, relW)) - X(4)}" height="28" rx="4" style="fill:var(--bad);opacity:.8"/>`;
    if (g0 < 20) s += `<rect x="${X(g0)}" y="28" width="${X(20) - X(g0)}" height="28" rx="4" style="fill:var(--ok);opacity:.8"/>`;
    s += `<line x1="${X(Math.min(24, relW))}" y1="20" x2="${X(Math.min(24, relW))}" y2="64" style="stroke:var(--text);stroke-width:2"/>`;
    // бонусы
    s += `<text x="26" y="88" style="fill:var(--text);font-size:12.5px;font-weight:600">Бонусы за мойки — ценность ровная, круглый год</text>`;
    if (d) s += `<rect x="${X(4)}" y="98" width="${X(Math.min(24, relB)) - X(4)}" height="28" rx="4" style="fill:var(--bad);opacity:.8"/>`;
    if (relB < 24) s += `<rect x="${X(relB)}" y="98" width="${X(24) - X(relB)}" height="28" rx="4" style="fill:var(--ok);opacity:.55"/>`;
    s += `<line x1="${X(Math.min(24, relB))}" y1="92" x2="${X(Math.min(24, relB))}" y2="132" style="stroke:var(--text);stroke-width:2"/>`;
    return s + '</svg>';
  }
  function drawCod(pane) {
    let d = 0;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Две фичи автомоек. «Зимняя мойка днища от реагентов» приносит около 50 тыс. ₽ в неделю, но только с ноября по март. «Бонусы» — около 10 тыс. ₽ в неделю круглый год. Двигайте задержку и смотрите, что сгорает. Цифры условные.</p>
      <label class="stack tight"><span class="small" data-dl></span><input type="range" class="prio-range" min="0" max="18" value="0" data-d aria-label="Задержка, недель"></label>
      <div class="board" style="padding:8px" data-g></div>
      <div class="row small"><span class="chip ok">зелёное — ценность получена</span><span class="chip bad">красное — сгорело из-за задержки</span><span class="chip info">пунктир — сезон</span></div>
      <div class="grid2" data-st></div>
      <div data-w></div>
    </div>`;
    function draw() {
      const relW = 2 + d, gained = Math.max(0, 20 - Math.max(4, relW)) * 50, lostW = 800 - gained, lostB = d * 10;
      TR.$('[data-dl]', pane).innerHTML = `Задержка релиза: <b>${d} ${TR.plural(d, 'неделя', 'недели', 'недель')}</b>`;
      TR.$('[data-g]', pane).innerHTML = codSVG(d);
      TR.$('[data-st]', pane).innerHTML = `<div class="stat"><span class="k">Зимняя мойка: сгорело</span><span class="v ${lostW ? 'bad' : 'ok'}">${lostW} тыс. ₽</span><span class="s">${relW >= 20 ? 'сезон сгорел целиком' : d <= 2 ? 'пока не горит: сезон ещё не начался' : '50 тыс. ₽ за каждую неделю сезона'}</span></div><div class="stat"><span class="k">Бонусы: сгорело</span><span class="v ${lostB ? 'warn' : 'ok'}">${lostB} тыс. ₽</span><span class="s">10 тыс. ₽ за неделю — и через полгода бонусы стоят столько же</span></div>`;
      TR.$('[data-w]', pane).innerHTML = ui.table(['Фича', 'Стоимость задержки, тыс. ₽ в неделю', 'Размер работы, недель', 'WSJF = задержка ÷ размер'], [['Зимняя мойка', d <= 2 ? '50 (с ноября)' : '50', '2', '<b>25</b>'], ['Бонусы', '10', '4', '<b>2,5</b>']])
        + ui.note('info', 'Стоимость задержки и WSJF', 'Стоимость задержки (Cost of Delay, Дон Рейнертсен) — сколько ценности теряем за каждую неделю ожидания. Она бывает ровной (бонусы) и «горящей» (сезон, праздник, закон). WSJF (взвешенный «сначала короткая работа», так его считают в SAFe) делит стоимость задержки на размер работы: вперёд идёт то, что горит и делается быстро. В SAFe стоимость задержки обычно оценивают не в рублях, а в относительных баллах: ценность для бизнеса + срочность + снижение риска.')
        + ui.note('warn', 'RICE или WSJF?', 'Единого мнения нет. RICE отвечает на вопрос «что даст больше пользы на единицу труда», WSJF — «что дороже всего откладывать». Продуктовые команды чаще считают RICE, в SAFe — WSJF; многие используют обе формулы как повод для разговора, а не как приговор.');
    }
    TR.$('[data-d]', pane).addEventListener('input', e => { d = +e.target.value; draw(); });
    draw();
  }

  const howValue = {
    id: 'how-value', covers: ['rice'], title: 'Как это работает: ценность фичи, Кано, RICE и стоимость задержки', free: true, noReset: true,
    simple: {
      icon: '⚖️',
      plain: 'Ценность фичи — это не «очень хочу», а ответы на пять вопросов: для кого, что изменится и чем это измерить, к какой цели бизнеса ведёт, сколько стоит и что потеряем, если не сделать. Когда ответы есть, фичи можно сравнивать — формулой или хотя бы честно. И не забывать про время: что-то можно отложить без потерь, а что-то сгорает.',
      analogy: 'Хозяйка выбирает, что купить в пекарню: новую печь, кофемашину или вывеску. «Хочу» — у всех трёх. Но печь снимет очередь утром, кофемашина добавит к чеку, а вывеска… просто красивая. И печь нужна до праздника, а вывеска подождёт.',
      tech: 'Ценность связывают с бизнес-целью и метрикой (Impact Mapping, Гойко Аджич). <b>Модель Кано</b> (1984): обязательные → одномерные → привлекательные; безразличные и обратные не делают. <b>RICE</b> (Intercom): охват × влияние × уверенность ÷ трудозатраты. <b>Стоимость задержки</b> (Cost of Delay, Дон Рейнертсен) — потери за единицу времени ожидания; <b>WSJF</b> = стоимость задержки ÷ размер работы (SAFe). Источники — DOMAIN §9: «Приоритизация».'
    },
    lead: ui.brief({
      situation: 'Соседний пример — сеть автомоек «Блеск». Владелец хочет онлайн-запись, бонусы, тёмную тему и зимнюю мойку днища — а команда одна. Четыре вкладки: паспорт ценности, модель Кано, калькулятор RICE и стоимость задержки.',
      todo: [
        '«Паспорт ценности»: для каждой из трёх просьб переключите «Как сказали» → «Паспорт ценности». Где поля с вопросом, ценность не доказана.',
        '«Кано»: выберите пример и посмотрите категорию; поменяйте ответы на два вопроса и найдите все пять категорий.',
        '«RICE»: меняйте охват, влияние, уверенность и трудозатраты — следите, как меняется рейтинг вверху.',
        '«Стоимость задержки»: двигайте задержку от 0 до 18 недель и сравните, что сгорает у зимней мойки и у бонусов.'
      ],
      look: 'Жёлтая рамка в паспорте — вопрос без ответа. В RICE формула показана с числами — видно, какой множитель решает. На графике задержки красное — сгоревшая ценность.'
    }),
    render(el) {
      el.classList.add('prio-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'pass', t: 'Паспорт ценности', render: fresh(drawPass) },
        { id: 'kano', t: 'Кано: что первым', render: fresh(drawKano) },
        { id: 'rice', t: 'RICE', render: fresh(drawRice) },
        { id: 'cod', t: 'Стоимость задержки', render: fresh(drawCod) }
      ], 'pass');
    }
  };

  // =====================================================================
  // Теория 2. Ценность / трудозатраты, MoSCoW и «всё Must», MVP
  // =====================================================================
  const QUAD = {
    quick: { t: 'Быстрые победы', d: 'Много ценности, мало труда — делать первыми.' },
    big: { t: 'Большие ставки', d: 'Много ценности и много труда — планировать, резать на части, начинать вовремя.' },
    fill: { t: 'Мелочи', d: 'Мало ценности, мало труда — в паузах, если есть время.' },
    trap: { t: 'Ловушки', d: 'Мало ценности, много труда — не брать, пока не изменится ценность или цена.' }
  };
  const MXN = [
    { id: 'remind', n: 1, t: 'Напоминание «пора помыть»', v: 8, e: 1 },
    { id: 'book', n: 2, t: 'Онлайн-запись', v: 8.6, e: 7 },
    { id: 'dark', n: 3, t: 'Тёмная тема', v: 2, e: 1.6 },
    { id: 'car', n: 4, t: 'Приложение для экрана автомобиля', v: 2.4, e: 9 },
    { id: 'photo', n: 5, t: 'Фото машины после мойки', v: 3.6, e: 2.6 },
    { id: 'sub', n: 6, t: 'Подписка «безлимит»', v: 7, e: 8 }
  ];
  const quadOf = (v, e) => v >= 5 ? (e < 5 ? 'quick' : 'big') : (e < 5 ? 'fill' : 'trap');
  function drawMxn(pane) {
    let sel = 'book', fixed = false;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Те же автомойки. Каждая фича — точка: выше — ценнее, правее — дороже. Нажмите на точку или строку списка.</p>
      <label class="toggle"><input type="checkbox" data-fx> <span>Дима переоценил онлайн-запись: не 7, а 3 недели — сделаем сначала запись без оплаты</span></label>
      <div class="grid2" style="align-items:start"><div class="board" style="padding:6px" data-g></div><div class="stack tight" data-l></div></div>
      <div data-i></div>
    </div>`;
    function pts() { return MXN.map(p => Object.assign({}, p, p.id === 'book' && fixed ? { e: 3 } : {})); }
    function draw() {
      const P = pts(), W = 300, H = 260, X = e => 34 + e / 10 * 256, Y = v => 236 - v / 10 * 222;
      let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:420px;display:block" role="img" aria-label="Матрица ценность и трудозатраты">`;
      s += `<rect x="${X(0)}" y="${Y(10)}" width="${X(5) - X(0)}" height="${Y(5) - Y(10)}" style="fill:var(--ok-soft)"/><rect x="${X(5)}" y="${Y(5)}" width="${X(10) - X(5)}" height="${Y(0) - Y(5)}" style="fill:var(--bad-soft)"/>`;
      s += `<line x1="${X(5)}" y1="${Y(10)}" x2="${X(5)}" y2="${Y(0)}" style="stroke:var(--border-strong)"/><line x1="${X(0)}" y1="${Y(5)}" x2="${X(10)}" y2="${Y(5)}" style="stroke:var(--border-strong)"/>`;
      s += `<rect x="${X(0)}" y="${Y(10)}" width="${X(10) - X(0)}" height="${Y(0) - Y(10)}" style="fill:none;stroke:var(--border-strong)"/>`;
      [['Быстрые победы', 0.2, 9.6], ['Большие ставки', 5.2, 9.6], ['Мелочи', 0.2, 0.5], ['Ловушки', 5.2, 0.5]].forEach(([t, e, v]) => { s += `<text x="${X(e)}" y="${Y(v) + 4}" style="fill:var(--text-muted);font-size:12px;font-weight:600">${t}</text>`; });
      s += `<text x="${X(10)}" y="${H - 4}" text-anchor="end" style="fill:var(--text-muted);font-size:11.5px">трудозатраты →</text><text x="12" y="${Y(10)}" transform="rotate(-90 12 ${Y(10)})" text-anchor="end" style="fill:var(--text-muted);font-size:11.5px">← ценность</text>`;
      P.forEach(p => { const on = p.id === sel; s += `<g data-dot="${p.id}" style="cursor:pointer"><circle cx="${X(p.e)}" cy="${Y(p.v)}" r="${on ? 13 : 11}" style="fill:${on ? 'var(--accent)' : 'var(--surface)'};stroke:var(--accent);stroke-width:2"/><text x="${X(p.e)}" y="${Y(p.v) + 4.5}" text-anchor="middle" style="fill:${on ? 'var(--accent-text)' : 'var(--text)'};font-size:13px;font-weight:700">${p.n}</text></g>`; });
      TR.$('[data-g]', pane).innerHTML = s + '</svg>';
      TR.$('[data-l]', pane).innerHTML = P.map(p => `<button type="button" class="prio-btn" data-dot="${p.id}" aria-pressed="${p.id === sel}">${p.n}. ${esc(p.t)} · <span class="small dim">${esc(QUAD[quadOf(p.v, p.e)].t.toLowerCase())}</span></button>`).join('');
      const p = P.find(x => x.id === sel), q = QUAD[quadOf(p.v, p.e)];
      TR.$('[data-i]', pane).innerHTML = ui.note(quadOf(p.v, p.e) === 'trap' ? 'bad' : quadOf(p.v, p.e) === 'quick' ? 'ok' : 'info', `${p.n}. ${p.t} — ${q.t.toLowerCase()}`, esc(q.d) + (p.id === 'book' && fixed ? ' Обратите внимание: та же фича стала быстрой победой, когда её разрезали — сначала запись, оплата потом. Большие ставки часто так и делают.' : ''));
    }
    TR.on(pane, 'click', '[data-dot]', (e, b) => { sel = b.dataset.dot; draw(); });
    TR.$('[data-fx]', pane).addEventListener('change', e => { fixed = e.target.checked; draw(); });
    draw();
  }

  const MSN = [{ id: 'book', t: 'Онлайн-запись', w: 3 }, { id: 'pay', t: 'Оплата в приложении', w: 2 }, { id: 'remind', t: 'Напоминание «пора помыть»', w: 0.5 }, { id: 'bonus', t: 'Бонусы за мойки', w: 4 }, { id: 'review', t: 'Отзывы с фото', w: 1.5 }, { id: 'dark', t: 'Тёмная тема', w: 0.5 }, { id: 'sub', t: 'Подписка «безлимит»', w: 3 }];
  const MS4 = [{ v: 'M', t: 'M' }, { v: 'S', t: 'S' }, { v: 'C', t: 'C' }, { v: 'W', t: 'W' }];
  function drawMsn(pane) {
    const st = Object.fromEntries(MSN.map(x => [x.id, 'M'])), CAPN = 10;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Автомойки, релиз к зимнему сезону: у команды 10 недель. Владелец: «Всё важно!» — поэтому сейчас всё помечено Must. Раскладывайте: <b>M</b>ust — без этого релиз бессмыслен, <b>S</b>hould — важно, но можно чуть позже, <b>C</b>ould — если останется время, <b>W</b>on't — не в этот раз.</p>
      <div class="stack tight" data-rows></div>
      <div class="prio-cap" data-cap></div>
      <div data-msg></div>
    </div>`;
    function draw() {
      TR.$('[data-rows]', pane).innerHTML = MSN.map(x => `<div class="prio-msr"><span>${esc(x.t)}<small>${nf(x.w)} нед.</small></span>${btns(x.id, MS4, st[x.id])}</div>`).join('');
      const sum = k => MSN.filter(x => st[x.id] === k).reduce((s, x) => s + x.w, 0);
      const m = sum('M'), s = sum('S'), c = sum('C');
      TR.$('[data-cap]', pane).innerHTML = `<div class="small"><b>Must: ${nf(m)} нед. из ${CAPN}</b> (${Math.round(m / CAPN * 100)} %) · Must + Should: ${nf(m + s)} · Could: ${nf(c)}</div>${capBar([{ w: m, cls: 'm' }, { w: s, cls: 's' }, { w: c, cls: 'c' }], CAPN, [0.6])}<div class="lg"><span><i style="background:var(--accent)"></i>Must</span><span><i style="background:var(--info)"></i>Should</span><span><i style="background:var(--violet)"></i>Could</span><span><i style="background:var(--text)"></i>черта — 60 % ёмкости</span><span><i style="background:var(--bad)"></i>не влезает</span></div>`;
      TR.$('[data-msg]', pane).innerHTML = m > CAPN ? ui.note('bad', 'Всё — Must', 'Если всё обязательно, то ничего не обязательно: срок сорван заранее, а когда время кончится, команда не будет знать, что резать. Это не приоритеты, а список желаний.')
        : m > CAPN * 0.6 ? ui.note('warn', 'Тесно', `Must занимает ${Math.round(m / CAPN * 100)} %. Любая неожиданность — болезнь, ошибка, задержка у партнёра — и обязательное не успеть. В методе DSDM, откуда пришёл MoSCoW, советуют держать Must не больше 60 % трудозатрат, а около 20 % оставлять на Could как запас.`)
          : ui.note('ok', 'Есть запас', 'Must помещается с запасом. Если что-то пойдёт не так, режем Could, потом Should — а обязательное остаётся. Именно так MoSCoW защищает срок.');
    }
    TR.on(pane, 'click', '[data-pk]', (e, b) => { st[b.dataset.pk] = b.dataset.pv; draw(); });
    draw();
  }

  const MVP_W = [{ e: '◯', t: 'Колесо' }, { e: '◯─◯', t: 'Ось с колёсами' }, { e: '▭', t: 'Шасси' }, { e: '▭▭', t: 'Кузов без мотора' }, { e: '🚗', t: 'Машина' }];
  const MVP_R = [{ e: '🛹', t: 'Скейтборд', can: 'доехать до соседнего дома' }, { e: '🛴', t: 'Самокат', can: 'быстрее и держась за руль' }, { e: '🚲', t: 'Велосипед', can: 'далеко и не устать' }, { e: '🏍️', t: 'Мотоцикл', can: 'быстро и с мотором' }, { e: '🚗', t: 'Машина', can: 'с крышей — оказалось, это важно' }];
  const SCHOOLS = {
    ries: { t: 'Эрик Рис', d: '«Бережливый стартап»: MVP — версия, которая с наименьшими усилиями даёт проверенное знание о клиентах. Это может быть даже не программа: страница с кнопкой «Записаться», «консьерж» (делаем руками за клиента), видеоролик. Цель — учиться, а не продавать.' },
    proj: { t: 'Проектная практика', d: 'MVP — первая версия, которой реально пользуются и которая приносит ценность: самая маленькая из полезных. Так это слово обычно понимают заказчики и подрядчики — и так мы используем его в «Колосе»: MVP к 1 марта.' },
    mmp: { t: 'MMP и MLP', d: 'Минимальный продаваемый продукт (marketable) — с ним не стыдно выйти к покупателям; минимальный любимый (lovable) — не просто работает, а нравится. Это ответ на перекос «минимальный = сырой».' }
  };
  function drawMvp(pane) {
    let step = 1, sch = 'proj';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Знаменитая картинка Хенрика Книберга (2016). Клиенту нужно добраться из точки А в точку Б. Двигайте релизы и сравните, что он может в каждом.</p>
      <label class="stack tight"><span class="small" data-sl></span><input type="range" class="prio-range" min="1" max="5" value="1" data-s aria-label="Номер релиза"></label>
      <div class="prio-lbl">Неправильно: по частям</div><div class="prio-scroll"><div class="prio-mvp" data-w></div></div>
      <div class="prio-lbl">Правильно: каждый релиз — целый, хоть и маленький</div><div class="prio-scroll"><div class="prio-mvp" data-r></div></div>
      <div data-n></div>
      <div class="prio-lbl">Что называют MVP — честно о разных школах</div>
      <div class="row">${ui.seg('sch', Object.keys(SCHOOLS).map(k => ({ v: k, t: SCHOOLS[k].t })), sch, 'accent')}</div>
      <div data-sch></div>
    </div>`;
    function draw() {
      TR.$('[data-sl]', pane).innerHTML = `Релиз <b>${step}</b> из 5`;
      TR.$('[data-w]', pane).innerHTML = MVP_W.map((x, i) => `<div class="prio-st ${i + 1 === step ? 'on' : i + 1 > step ? 'fut' : ''}"><span class="e">${x.e}</span><b>${esc(x.t)}</b><span class="can ${i < 4 ? 'no' : 'yes'}">${i < 4 ? 'ехать нельзя' : 'наконец едет'}</span></div>`).join('');
      TR.$('[data-r]', pane).innerHTML = MVP_R.map((x, i) => `<div class="prio-st ${i + 1 === step ? 'on' : i + 1 > step ? 'fut' : ''}"><span class="e">${x.e}</span><b>${esc(x.t)}</b><span class="can yes">${esc(x.can)}</span></div>`).join('');
      TR.$('[data-n]', pane).innerHTML = step < 5 ? ui.note('warn', `После релиза ${step}`, `Сверху клиент всё ещё ходит пешком и не может сказать, то ли мы строим. Снизу он уже ${esc(MVP_R[step - 1].can)} — и рассказывает, чего ему не хватает. Скейтборд — не «плохая машина», а самый маленький способ доехать и узнать правду.`)
        : ui.note('ok', 'Обе дороги привели к машине', 'Но сверху клиент ждал все пять релизов и только в конце узнал, что ему нужна крыша. Снизу он ездил с первого релиза, а крышу мы добавили, потому что услышали его. В пекарне это пробная партия нового круассана в одной точке. Половина круассана — не MVP.');
      TR.$('[data-sch]', pane).innerHTML = ui.note('info', SCHOOLS[sch].t, esc(SCHOOLS[sch].d) + '<br><span class="small muted">Единого определения нет: перед разговором о MVP договоритесь, что вы под ним понимаете.</span>');
    }
    TR.$('[data-s]', pane).addEventListener('input', e => { step = +e.target.value; draw(); });
    ui.onSeg(pane, (n, v) => { if (n === 'sch') { sch = v; draw(); } });
    draw();
  }

  const howMoscow = {
    id: 'how-moscow', covers: ['matrix', 'mvp'], title: 'Как это работает: ценность и трудозатраты, MoSCoW, MVP', free: true, noReset: true,
    simple: {
      icon: '🧺',
      plain: 'Самые выгодные — фичи с большой ценностью и малыми затратами: их делают первыми. MoSCoW делит всё на «обязательно», «важно», «хорошо бы» и «не в этот раз» — и обязательным не может быть всё. MVP — самая маленькая версия, которая уже приносит пользу и проверяет главную догадку.',
      analogy: 'Маленькая витрина утром: хлеб — обязательно, круассаны — да, макаруны — если останется место, свадебный торт — не сегодня. А открывая новую точку, сначала ставят прилавок с хлебом и кофе, а не строят ресторан.',
      tech: '<b>Матрица ценность / трудозатраты</b> (value vs effort): быстрые победы, большие ставки, мелочи (fill-ins), ловушки (money pit). <b>MoSCoW</b> (метод DSDM): Must / Should / Could / Won\'t (this time); DSDM советует держать Must не больше ~60 % трудозатрат, Could ~20 % — как запас. <b>MVP</b> — у Эрика Риса версия для проверки гипотезы с наименьшими усилиями; в проектной практике — первая полезная версия для пользователей.'
    },
    lead: ui.brief({
      situation: 'Снова автомойки «Блеск». Три вкладки: куда на матрице попадают фичи и что делать с каждым квадратом; почему «всё Must» ломает срок; что такое MVP и почему это не «плохой продукт».',
      todo: [
        '«Ценность / трудозатраты»: нажимайте точки и читайте, что делать с каждым квадратом. Включите переоценку Димы и посмотрите, куда переедет онлайн-запись.',
        '«MoSCoW и всё Must»: сейчас всё помечено M. Переключайте M / S / C / W и доведите Must до 60 % ёмкости или ниже.',
        '«MVP»: двигайте релиз от 1 до 5 и сравните две дороги. Потом прочитайте три школы.'
      ],
      look: 'На полосе ёмкости тёмная черта — 60 %, красная черта и красный хвост — то, что не влезает в 10 недель.'
    }),
    render(el) {
      el.classList.add('prio-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'mx', t: 'Ценность / трудозатраты', render: fresh(drawMxn) },
        { id: 'ms', t: 'MoSCoW и «всё Must»', render: fresh(drawMsn) },
        { id: 'mvp', t: 'MVP: скейтборд, а не колесо', render: fresh(drawMvp) }
      ], 'mx');
    }
  };

  // =====================================================================
  // Теория 3. «Ещё одна маленькая хотелка» и как сказать «не сейчас»
  // =====================================================================
  const CREEP = [
    { id: 'r1', w: 1, t: 'Выбор любимого мойщика', d: 2 },
    { id: 'r2', w: 2, t: 'Фото машины после мойки', d: 3 },
    { id: 'r3', w: 3, t: 'Кнопка «Позвонить администратору»', d: 1 },
    { id: 'r4', w: 4, t: 'Отзывы со звёздочками', d: 3 },
    { id: 'r5', w: 5, t: 'Тёмная тема — «сын просил»', d: 2 },
    { id: 'r6', w: 6, t: 'Скидка в день рождения', d: 3 }
  ];
  function drawCreep(pane) {
    const dec = {};
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Релиз онлайн-записи автомоек — через 8 недель, к зимнему сезону. Каждую неделю владелец приносит «ещё одну мелочь». Решайте по одной.</p>
      <div class="stack tight" data-rq></div>
      <div class="prio-cap" data-cap></div>
      <div data-msg></div>
    </div>`;
    function draw() {
      TR.$('[data-rq]', pane).innerHTML = CREEP.map(x => `<div class="prio-creq ${dec[x.id] || ''}"><span class="w">неделя ${x.w}</span><span>«${esc(x.t)}» <span class="small dim">· всего ${x.d} ${TR.plural(x.d, 'день', 'дня', 'дней')}</span></span>${btns(x.id, [{ v: 'take', t: 'Взять сразу — это же мелочь' }, { v: 'swap', t: 'Оценить и обменять' }], dec[x.id])}</div>`).join('');
      const extra = CREEP.filter(x => dec[x.id] === 'take').reduce((s, x) => s + x.d, 0), took = CREEP.filter(x => dec[x.id] === 'take').length, sw = CREEP.filter(x => dec[x.id] === 'swap').length;
      TR.$('[data-cap]', pane).innerHTML = `<div class="small"><b>План: 40 рабочих дней.</b> Сверху взято: ${extra} ${TR.plural(extra, 'день', 'дня', 'дней')} · релиз ${extra ? `сдвигается на ${nf(extra / 5)} нед.` : 'в срок'}</div>${capBar([{ w: 40, cls: 'm' }, { w: extra, cls: 'c' }], 40, [])}`;
      const all = Object.keys(dec).length === CREEP.length;
      TR.$('[data-msg]', pane).innerHTML = took >= 3 ? ui.note('bad', 'Так и расползается объём', `Каждая просьба — «всего пара дней». Вместе — ${extra} рабочих дней: релиз уезжает на ${nf(extra / 5)} недели, и первые недели зимнего сезона машины снова стоят в очереди. Ни одна мелочь не была плохой — плохо было брать без цены.`)
        : all ? ui.note('ok', 'Срок защищён', `Вы обменяли ${sw} из ${CREEP.length}: каждую просьбу оценили, записали и вынесли владельцу с вопросом «что убираем взамен или берём в следующий релиз?». Ни одна хорошая идея не потерялась — они в бэклоге с оценкой.`)
          : ui.note('info', '«Оценить и обменять» — это не «нет»', 'Просьбу записывают, оценивают и показывают владельцу цену: «это 3 дня; к сезону успеем, если отложим отзывы, — или в следующий релиз». Решает он — но видя, что меняется.');
    }
    TR.on(pane, 'click', '[data-pk]', (e, b) => { dec[b.dataset.pk] = b.dataset.pv; draw(); });
    draw();
  }
  const NOS = [
    { v: 'pos', t: '«Этого нет в договоре»', reply: 'Бонусов в договоре нет, обсуждать нечего.', react: 'Владелец: «Тогда зачем мне аналитик? Найду того, кто сделает». Бонусы всё равно появятся — через голову, без оценки.', kind: 'bad', lab: 'Позиция: «нет» без причин' },
    { v: 'cap', t: '«Да, конечно»', reply: 'Конечно, добавим — это же мелочь.', react: 'Владелец доволен. Через месяц: бонусы заняли 4 недели, онлайн-запись не успела к сезону, по субботам снова очередь.', kind: 'bad', lab: 'Уступка: «да» без цены' },
    { v: 'opt', t: 'Варианты с ценой', reply: 'Бонусы — это 4 недели. К сезону успеем, если отложим отзывы и подписку. Или сначала месяц соберём данные: сколько у вас постоянных и как часто они приезжают, — и решим. Как вам удобнее?', react: 'Владелец: «Давайте сначала данные — а запись пусть успеет к сезону». Решение его, но с ценой и последствиями перед глазами.', kind: 'ok', lab: 'Разговор об интересах: варианты, цена, решение — за владельцем' }
  ];
  function drawNo(pane) {
    let cur = 'pos';
    pane.innerHTML = `<div class="stack">
      <div class="prio-quote">«Добавьте бонусы в этот релиз — это же мелочь!»<small>— владелец сети автомоек</small></div>
      <div class="row">${ui.seg('no', NOS.map(x => ({ v: x.v, t: x.t })), cur, 'accent')}</div>
      <div data-o></div>
    </div>`;
    function draw() {
      const x = NOS.find(n => n.v === cur);
      TR.$('[data-o]', pane).innerHTML = `${ui.say('me', esc(x.reply))}${ui.note(x.kind, x.lab, esc(x.react))}${x.kind === 'ok' ? ui.note('info', 'Почему это работает', 'Так советуют Фишер и Юри («Переговоры без поражения»): обсуждать интересы, а не позиции, и приносить несколько вариантов. Владельцу нужны не «бонусы», а постоянные клиенты; аналитику нужен не «отказ», а срок. Варианты с ценой удовлетворяют оба интереса.') : ''}`;
    }
    ui.onSeg(pane, (n, v) => { if (n === 'no') { cur = v; draw(); } });
    draw();
  }
  const howCreep = {
    id: 'how-creep', covers: ['rita', 'nina'], title: 'Как это работает: «ещё одна маленькая хотелка» и как сказать «не сейчас»', free: true, noReset: true,
    simple: {
      icon: '🎂',
      plain: 'Объём проекта расползается не от одной большой просьбы, а от десятка маленьких: «это же на полдня». Каждая по отдельности безобидна, вместе — сорванный срок. Защита — не «нет», а вопрос: какую цель это двигает, сколько стоит и что убираем взамен.',
      analogy: 'Заказ торта: «а можно ещё розочку? а надпись золотом? а третий ярус, он же маленький?» К субботе торт не успевает, а цена выросла вдвое — хотя каждая просьба была мелочью.',
      tech: '<b>Расползание объёма</b> (scope creep) — неуправляемое добавление требований без пересмотра сроков, бюджета и ресурсов (PMBOK). Защита: базовая версия объёма, запрос на изменение, анализ влияния, обмен «новое вместо старого» и решение владельца продукта. Аргументы — через ценность и цели; «нет» — как варианты с ценой (Фишер и Юри: интересы, а не позиции).'
    },
    lead: ui.brief({
      situation: 'Снова автомойки. Две вкладки: как восемь недель превращаются в одиннадцать из-за «мелочей» и как отвечать на «добавьте, это же мелочь», не ссорясь и не сдаваясь.',
      todo: [
        '«Ещё одна маленькая хотелка»: для каждой из шести просьб выберите «Взять сразу» или «Оценить и обменять». Следите за полосой срока. Потом попробуйте наоборот.',
        '«Как сказать “не сейчас”»: переключите три ответа и сравните реакцию владельца и последствия.'
      ],
      look: 'Красный хвост на полосе — дни сверх плана, красная черта — исходный срок релиза.'
    }),
    render(el) {
      el.classList.add('prio-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'creep', t: 'Ещё одна маленькая хотелка', render: fresh(drawCreep) },
        { id: 'no', t: 'Как сказать «не сейчас»', render: fresh(drawNo) }
      ], 'creep');
    }
  };

  // =====================================================================
  // Практика 1. RICE для пяти фич против интуиции + стоимость задержки
  // =====================================================================
  const RF = [
    { id: 'cake', t: 'Заказ торта с фото и предоплатой 50 %', r: 2000, rU: 'заказов тортов за квартал (до 25 в день)', e: 6, i: 3, c: 100,
      cue: 'БЦ-3 — ни одного потерянного торта к 8 Марта. Сейчас теряют 2–3 заказа в неделю, в прошлом году к празднику потеряли 9 из 140 и получили скандал в соцсетях. Всё это видно по тетради и жалобам.' },
    { id: 'points', t: 'Баллы лояльности (5 %, оплата до 30 % чека)', r: 20000, rU: 'покупателей приложения за квартал — оценка Риты', e: 6, i: 0.5, c: 50,
      cue: 'Рита: «как в Спортмастере — все будут возвращаться». Бумажными карточками «7-й кофе в подарок» пользуются, но сколько людей — никто не считал. Нина: «за хлебом приходят не ради баллов».' },
    { id: 'sms', t: 'SMS «Заказ готов»', r: 15000, rU: 'предзаказов и тортов за квартал', e: 2, i: 0.5, c: 80,
      cue: 'Удобство, а не цель: заказ и без SMS ждёт покупателя в выбранный интервал. Павел: «бывает, приходят за тортом, а он ещё в цехе». Сколько таких случаев — не считали, но кассиры подтверждают.' },
    { id: 'vk', t: 'Ссылка на предзаказ из постов ВКонтакте', r: 3000, rU: 'переходов из постов за квартал — оценка', e: 1, i: 1, c: 80,
      cue: '18 тыс. подписчиков, и заказы уже пишут в личные сообщения — спрос виден. Ссылка ведёт прямо в предзаказ и работает на БЦ-2 (выручка). Сколько людей перейдёт — пока неизвестно.' },
    { id: 'evening', t: 'Скидка на выпечку после 19:00', r: 4000, rU: 'вечерних покупателей за квартал — оценка', e: 3, i: 1, c: 50,
      cue: 'Рита: распродадим остатки — меньше списаний (БЦ-1). Галина Ивановна: все будут ждать 19:00, утренние продажи упадут, план выпечки сломается. Данных нет ни у одной.' }
  ];
  const WS = { cake: { bv: 20, tc: 20, rr: 13, sz: 8 }, points: { bv: 5, tc: 1, rr: 2, sz: 8 }, sms: { bv: 3, tc: 2, rr: 2, sz: 3 }, vk: { bv: 5, tc: 1, rr: 1, sz: 2 }, evening: { bv: 3, tc: 2, rr: 1, sz: 3 } };
  const wsjf = id => (WS[id].bv + WS[id].tc + WS[id].rr) / WS[id].sz;
  const RQ = {
    q: 'RICE поставил торт третьим, а WSJF — первым. Почему?', seed: 'prio-rq',
    options: [
      { t: 'WSJF учитывает срочность: после 8 Марта ценность торта в приложении резко падает до следующего праздника, а баллы через месяц стоят столько же', ok: 1, why: 'Да: стоимость задержки торта огромна именно сейчас — праздник не перенести.' },
      { t: 'RICE посчитан с ошибкой — торт всегда должен быть первым', why: 'RICE посчитан честно. Он просто не спрашивает «что будет, если подождать».' },
      { t: 'Торт дешевле в разработке', why: 'Наоборот: торт — одна из самых дорогих фич в списке.' },
      { t: 'WSJF всегда точнее RICE, поэтому RICE можно не считать', why: 'Единого мнения нет: формулы отвечают на разные вопросы, и обе — повод для разговора, а не приговор.' }
    ]
  };
  const idxOf = (arr, v) => arr.findIndex(x => x.v === v);
  function riceEval(ans) {
    const a = ans || {}, I = a.i || {}, C = a.c || {};
    const rows = RF.map(f => {
      const di = I[f.id] == null ? null : Math.abs(idxOf(I_SCALE, I[f.id]) - idxOf(I_SCALE, f.i));
      const dc = C[f.id] == null ? null : Math.abs(idxOf(C_SCALE, C[f.id]) - idxOf(C_SCALE, f.c));
      const pt = d => d == null || d < 0 ? 0 : d === 0 ? 1 : d === 1 ? 0.5 : 0;
      return { f, si: pt(di), sc: pt(dc), di, dc, iv: I[f.id], cv: C[f.id] };
    });
    const part = rows.reduce((s, r) => s + r.si + r.sc, 0) / (RF.length * 2);
    const q = ui.quizScore(RQ, a.q || []);
    return { rows, part, q, score: part * 0.8 + q.score * 0.2 };
  }
  const riceTask = {
    id: 'rice', title: 'RICE для пяти фич: формула против интуиции',
    simple: howValue.simple,
    lead: ui.brief({
      situation: 'Перед сборкой MVP Нина, Рита и Павел спорят, какая из пяти фич важнее, — каждый тянет свою. Игорь: «Давайте не спорить на эмоциях — посчитайте RICE». Охват и трудозатраты уже есть: охват оценили Рита и Павел, трудозатраты в человеко-неделях — Дима. Влияние и уверенность — за вами, по фактам из карточек. Цифры охвата — оценки для упражнения, а не факты канона.',
      todo: [
        'Шаг 1: расставьте пять фич по интуиции — от самой ценной к наименее ценной (стрелками или перетаскиванием). Это не оценивается: это точка отсчёта.',
        'Шаг 2: в каждой карточке выберите «Влияние» и «Уверенность» по тексту в фиолетовой рамке. Балл RICE пересчитается сразу.',
        'Шаг 3: сравните интуицию и RICE, нажмите «Добавить стоимость задержки (WSJF)» и ответьте на вопрос. Нажмите «Проверить». Засчитывается от 80 % и верный ответ на вопрос.'
      ],
      look: 'Влияние — насколько сдвинется цель, если фича сработает: 3 — огромное (прямо закрывает бизнес-цель или снимает скандал), 0,5 — малое (удобство, на цели почти не влияет). Уверенность — на чём держится оценка: 100 % — данные (цифры, записи), 80 % — косвенные признаки, 50 % — мнение.'
    }),
    blank: () => ({ i: {}, c: {}, q: [] }),
    reference: () => ({ order: ['cake', 'vk', 'sms', 'evening', 'points'], i: Object.fromEntries(RF.map(f => [f.id, f.i])), c: Object.fromEntries(RF.map(f => [f.id, f.c])), q: quizRef(RQ), ws: true }),
    render(el, ctx) {
      el.classList.add('prio-root');
      const a = ctx.ans; a.i = a.i || {}; a.c = a.c || {}; a.q = a.q || [];
      const judged = !!(ctx.result || ctx.readonly), touched = new Set();
      el.innerHTML = `<div class="stack">
        <div class="prio-lbl">Шаг 1 · Ваша интуиция: от самой ценной к наименее ценной (не оценивается)</div>
        <div data-ord></div>
        <div class="prio-lbl">Шаг 2 · Влияние и уверенность — по фактам из карточек</div>
        <div class="prio-rcards" data-cards></div>
        <div class="prio-lbl">Шаг 3 · Интуиция, RICE и стоимость задержки</div>
        <div data-cmp></div>
        <div class="card flat" data-q></div>
      </div>`;
      const score = f => (a.i[f.id] != null && a.c[f.id] != null) ? rice(f.r, a.i[f.id], a.c[f.id], f.e) : null;
      function drawCards() {
        TR.$('[data-cards]', el).innerHTML = RF.map(f => {
          const ev = riceEval(a).rows.find(r => r.f.id === f.id), s = score(f);
          const mi = judged && !touched.has(f.id + 'i') && a.i[f.id] != null ? { [a.i[f.id]]: ev.si === 1 ? 'ok' : ev.si ? 'warn' : 'bad' } : null;
          const mc = judged && !touched.has(f.id + 'c') && a.c[f.id] != null ? { [a.c[f.id]]: ev.sc === 1 ? 'ok' : ev.sc ? 'warn' : 'bad' } : null;
          return `<div class="prio-rc"><h4>${esc(f.t)}</h4><div class="cue">${esc(f.cue)}</div>
            <div class="prio-chips"><span class="chip">Охват: ${big(f.r)} — ${esc(f.rU)}</span><span class="chip">Трудозатраты: ${nf(f.e)} чел.-нед.</span></div>
            <div class="ctl"><span class="k">Влияние</span>${btns(f.id + '|i', I_SCALE, a.i[f.id], { readonly: ctx.readonly, mark: mi })}</div>
            <div class="ctl"><span class="k">Уверенность</span>${btns(f.id + '|c', C_SCALE, a.c[f.id], { readonly: ctx.readonly, mark: mc })}</div>
            <div class="sc">${s == null ? 'RICE: выберите влияние и уверенность' : `${big(f.r)} × ${nf(a.i[f.id])} × ${a.c[f.id]} % ÷ ${nf(f.e)} = <b>${big(s)}</b>`}</div></div>`;
        }).join('');
      }
      function drawCmp() {
        const order = Array.isArray(a.order) && a.order.length === RF.length ? a.order : RF.map(f => f.id);
        const all = RF.every(f => score(f) != null);
        const rr = all ? RF.slice().sort((x, y) => score(y) - score(x)).map(f => f.id) : null;
        const wr = RF.slice().sort((x, y) => wsjf(y.id) - wsjf(x.id)).map(f => f.id);
        const rows = RF.map(f => [esc(f.t), String(order.indexOf(f.id) + 1), all ? `${rr.indexOf(f.id) + 1} <span class="small dim">(${big(score(f))})</span>` : '—', a.ws ? `${wr.indexOf(f.id) + 1} <span class="small dim">(${nf(wsjf(f.id))})</span>` : '·']);
        const wsTbl = a.ws ? ui.table(['Фича', 'Ценность', 'Срочность', 'Снижение риска', 'Стоимость задержки', 'Размер', 'WSJF'], RF.map(f => { const w = WS[f.id]; return [esc(f.t), w.bv, w.tc, w.rr, `<b>${w.bv + w.tc + w.rr}</b>`, w.sz, `<b>${nf(wsjf(f.id))}</b>`]; }))
          + '<p class="small muted">Баллы WSJF — относительные (1, 2, 3, 5, 8, 13, 20), их поставили Ксения с Игорем. Срочность торта — 20: после 8 Марта праздник не перенести. Снижение риска — 13: скандал в соцсетях и потерянное доверие.</p>' : '';
        TR.$('[data-cmp]', el).innerHTML = `${ui.table(['Фича', 'Интуиция', 'RICE', 'WSJF'], rows)}
          ${all ? '' : '<p class="small dim">Колонка RICE заполнится, когда во всех карточках будут выбраны влияние и уверенность.</p>'}
          <div class="row"><button type="button" class="btn sm" data-ws ${ctx.readonly ? 'disabled' : ''}>${a.ws ? 'Скрыть стоимость задержки' : 'Добавить стоимость задержки (WSJF)'}</button></div>${wsTbl}`;
      }
      ui.order(TR.$('[data-ord]', el), { items: RF.map(f => ({ id: f.id, t: esc(f.t) })), value: a.order, readonly: ctx.readonly, seed: 'prio-intuit', onChange: v => { a.order = v; ctx.save(); ctx.decide('Интуиция: порядок фич', v.map(id => RF.find(f => f.id === id).t).join(' → ')); drawCmp(); } });
      ui.quiz(TR.$('[data-q]', el), Object.assign({}, RQ, { value: a.q, readonly: ctx.readonly, reveal: ctx.result, onChange: v => { a.q = v; ctx.save(); } }));
      TR.on(el, 'click', '[data-pk]', (e, b) => {
        if (ctx.readonly) return;
        const [id, k] = b.dataset.pk.split('|');
        a[k][id] = +b.dataset.pv; touched.add(id + k); ctx.save(); drawCards(); drawCmp();
      });
      TR.on(el, 'click', '[data-ws]', () => { if (ctx.readonly) return; a.ws = !a.ws; ctx.save(); drawCmp(); });
      drawCards(); drawCmp();
    },
    check(ans) {
      const ev = riceEval(ans), notes = [];
      const miss = ev.rows.filter(r => r.iv == null || r.cv == null).length;
      if (miss) notes.push({ ok: false, html: `Не заполнено влияние или уверенность у ${miss} из ${RF.length} фич.` });
      ev.rows.forEach(r => {
        if (r.iv != null && r.si < 1) notes.push({ ok: r.si ? 'warn' : false, html: `«${esc(r.f.t)}», влияние${r.si ? ' (близко)' : ''}: если фича сработает, насколько сдвинется цель Нины? Закрывает ли она бизнес-цель напрямую или это удобство?` });
        if (r.cv != null && r.sc < 1) notes.push({ ok: r.sc ? 'warn' : false, html: `«${esc(r.f.t)}», уверенность${r.sc ? ' (близко)' : ''}: на чём держится оценка — на цифрах и записях, на косвенных признаках или на чьём-то мнении?` });
      });
      notes.push(ev.q.ok ? { ok: true, html: 'Вопрос: верно — WSJF видит срочность, которой нет в RICE.' } : { ok: false, html: 'Вопрос: откройте таблицу WSJF. В какой колонке торт резко отличается от остальных?' });
      const ok = ev.score >= 0.8 && ev.q.ok;
      const pts = ev.rows.find(r => r.f.id === 'points');
      return {
        ok, score: ev.score, notes,
        summary: `Влияние и уверенность: ${Math.round(ev.part * 100)} %. Вопрос: ${ev.q.ok ? 'верно' : 'неверно'}.`,
        mentor: pts && pts.cv === 100 ? 'Рита очень уверена — но уверенность в RICE это данные, а не громкость голоса. Сколько людей пользуется бумажными карточками, никто не считал.'
          : ok ? 'Заметьте: формула не согласилась с интуицией, и это нормально. Вопрос не «кто прав», а «чего не видит каждый»: интуиция не видит дешёвых массовых фич, RICE не видит сроков.' : null
      };
    },
    explain: `${ui.table(['Фича', 'Влияние', 'Уверенность', 'RICE', 'WSJF'], RF.map(f => [esc(f.t), nf(f.i), f.c + ' %', big(rice(f.r, f.i, f.c, f.e)), nf(wsjf(f.id))]))}
      <p><b>Что показал RICE.</b> Наверх вышли дешёвые и массовые фичи: SMS «Заказ готов» (охват 15 тыс., 2 недели) и ссылка из ВКонтакте (1 неделя). Торт — третий: охват маленький, работа большая. Баллы проиграли не из-за «плохой идеи», а из-за уверенности 50 %: за огромным охватом Риты нет данных.</p>
      <p><b>Что добавил WSJF.</b> Торт — первый: стоимость задержки огромна именно сейчас, 8 Марта не перенести, а скандал прошлого года — риск, который надо снять. SMS и баллы через месяц стоят столько же. Поэтому в MVP к 1 марта торт — Must, а SMS — Should.</p>
      <p><b>Честно о формулах.</b> RICE отвечает на «что даст больше на единицу труда», WSJF — на «что дороже всего откладывать». Ни одна не знает про закон (чеки по 54-ФЗ не «оценивают» — их делают) и про зависимости (без предзаказа нет и ссылки на предзаказ). Формулы — повод для разговора с Ниной, а решение — её. Источники: Intercom (RICE), Дон Рейнертсен «Принципы потока разработки продуктов» (стоимость задержки), SAFe (WSJF).</p>`,
    refNote: 'Порядок «интуиции» в эталоне — один из возможных: шаг 1 не оценивается. Охват — оценки Риты и Павла для упражнения, трудозатраты — оценки Димы.',
    report: ans => { const ev = riceEval(ans), a = ans || {}; return `Интуиция: ${(a.order || []).map(id => (RF.find(f => f.id === id) || {}).t).join(' → ') || '—'}\n` + ev.rows.map(r => `- ${r.f.t}: влияние ${r.iv != null ? nf(r.iv) : '—'}${r.si === 1 ? ' ✓' : r.si ? ' ≈' : ' ✗'}, уверенность ${r.cv != null ? r.cv + ' %' : '—'}${r.sc === 1 ? ' ✓' : r.sc ? ' ≈' : ' ✗'}`).join('\n') + `\nВопрос про WSJF: ${ev.q.ok ? 'верно' : 'неверно'}.`; }
  };

  // =====================================================================
  // Практика 2. Матрица «ценность / трудозатраты»
  // =====================================================================
  const MQ = [
    { id: 'quick', t: 'Быстрые победы', sub: 'ценность высокая · затраты малые' },
    { id: 'big', t: 'Большие ставки', sub: 'ценность высокая · затраты большие' },
    { id: 'fill', t: 'Мелочи', sub: 'ценность низкая · затраты малые' },
    { id: 'trap', t: 'Ловушки', sub: 'ценность низкая · затраты большие' }
  ];
  const MI = [
    { id: 'plan', t: 'Предзаказы — в план выпечки автоматически', sub: 'без этого предзаказ могут не испечь (F-plan) · 0,5 нед.', ok: 'quick' },
    { id: 'c1', t: 'Сводная выгрузка продаж в 1С', sub: 'БЦ-4: сверка 2 ч → 15 мин · 0,5 нед.', ok: 'quick' },
    { id: 'phone', t: 'Заказ по телефону через кассира', sub: '40 % постоянных клиентов — 55+, многие без смартфона · 0,5 нед.', ok: 'quick' },
    { id: 'cake', t: 'Заказ торта с фото и предоплатой', sub: 'БЦ-3: ни одного потерянного торта · 1,5 нед.', ok: 'big' },
    { id: 'stock', t: 'Учёт остатков и списаний в планшете', sub: 'БЦ-1: списания 12 % → 7 % · 1,5 нед.', ok: 'big' },
    { id: 'weather', t: 'Прогноз плана выпечки с учётом погоды', sub: 'БЦ-1, но пока гипотеза: данных нет · 2 нед.', ok: 'big', alt: { trap: 'Похоже на ловушку: данных о погоде и продажах ещё нет. Но если сработает, БЦ-1 сдвинется сильно — поэтому чаще это большая ставка, которую начинают с проверки гипотезы.' } },
    { id: 'repeat', t: '«Повторить прошлый заказ»', sub: 'удобно постоянным, цели почти не двигает · 0,5 нед.', ok: 'fill' },
    { id: 'dark', t: 'Тёмная тема приложения', sub: 'нравится Рите, цели не двигает · 0,5 нед.', ok: 'fill' },
    { id: 'sub', t: 'Подписка «хлеб каждое утро»', sub: 'нужна своя доставка, спрос не проверен · 2 нед. + доставка', ok: 'trap' },
    { id: 'watch', t: 'Приложение для смарт-часов', sub: 'идея Риты «как у больших сетей», целей нет · 3 нед.', ok: 'trap' },
    { id: 'points', t: 'Баллы лояльности', sub: 'эффект не доказан, данных нет · 2,5 нед.', ok: 'trap', alt: { big: 'Рита сказала бы «большая ставка» — и это честный спор. Но пока данных нет, ожидаемая ценность низкая: сначала собрать данные о возвращаемости.' } }
  ];
  const MHINT = {
    quick: 'Сколько это стоит — полнедели? А что сломается без этого или какую цель Нины это двигает?',
    big: 'Цель Нины за этим есть — но сколько недель на это нужно?',
    fill: 'Кому это нужно и какую цель двигает? Если никакую, а стоит дёшево — это…',
    trap: 'Какую цель Нины это двигает — и что известно о спросе? А сколько недель?'
  };
  const MXQ = {
    q: 'Как работать с четырьмя квадратами?', seed: 'prio-mxq',
    options: [
      { t: 'Быстрые победы — сразу; большие ставки — планировать и резать на части, начинать вовремя; мелочи — в паузах; ловушки — не брать, пока не изменятся ценность или цена', ok: 1, why: 'Да: так время уходит на ценность, а не на «удобное».' },
      { t: 'Сначала большие ставки — они самые ценные, остальное потом', why: 'Пока делаете большую ставку, дешёвые победы с той же ценностью простаивают. И большие ставки рискованнее.' },
      { t: 'Сначала мелочи — их быстро сделать, будет что показать на демо', why: 'Демо будет, а цели Нины не сдвинутся.' },
      { t: 'Ловушки — в конец бэклога, когда-нибудь сделаем', why: '«Когда-нибудь» съест время без ценности. Ловушку не откладывают, а перепроверяют: может, её можно сделать дешевле или ценность иная.' }
    ]
  };
  function mxEval(ans) {
    const v = (ans && ans.v) || {};
    const rows = MI.map(x => { const g = v[x.id]; const s = g === x.ok ? 'ok' : x.alt && x.alt[g] ? 'warn' : g ? 'bad' : 'empty'; return { x, g, s, pts: s === 'ok' ? 1 : s === 'warn' ? 0.5 : 0 }; });
    const part = rows.reduce((s, r) => s + r.pts, 0) / MI.length, q = ui.quizScore(MXQ, (ans && ans.q) || []);
    return { rows, part, q, score: part * 0.8 + q.score * 0.2 };
  }
  const matrixTask = {
    id: 'matrix', title: 'Матрица «ценность / трудозатраты»',
    simple: howMoscow.simple,
    lead: ui.brief({
      situation: 'Игорь принёс на доску одиннадцать карточек — всё, что за неделю предложили Нина, Рита, Галина Ивановна, Олег Петрович и вы. Ксения: «Прежде чем делить на Must и Could, разложите по матрице. Ценность — это цели БЦ-1…БЦ-4, закон и покупатели, которых нельзя потерять. Трудозатраты — оценки Димы».',
      todo: [
        'Разложите 11 карточек по четырём квадратам: нажмите карточку, потом квадрат (на компьютере можно перетаскивать).',
        'Ответьте на вопрос под матрицей.',
        'Нажмите «Проверить». Засчитывается от 80 %, верный ответ на вопрос и если ничего ценного не попало в «мелочи» или «ловушки». Где практики честно спорят, второй квадрат даёт половину балла.'
      ],
      lookTitle: 'Подсказка',
      look: 'Трудозатраты: до 1 недели — малые, от 1,5 недели — большие. Ценность высокая — если двигает цель Нины, нужна по закону или без неё теряем покупателей; низкая — если «приятно», но цели не двигает, или спрос не проверен.'
    }),
    blank: () => ({ v: {}, q: [] }),
    reference: () => ({ v: Object.fromEntries(MI.map(x => [x.id, x.ok])), q: quizRef(MXQ) }),
    render(el, ctx) {
      el.classList.add('prio-root');
      const a = ctx.ans; a.v = a.v || {}; a.q = a.q || [];
      let reveal = null;
      if (ctx.result) { reveal = {}; mxEval(a).rows.forEach(r => { if (r.g) reveal[r.x.id] = r.s; }); }
      el.innerHTML = '<div class="stack"><div class="prio-axis"><span>↑ верхний ряд — ценность высокая</span><span>→ правый столбец — затраты большие</span></div><div class="prio-mx" data-s></div><div class="card flat" data-q></div></div>';
      ui.sort(TR.$('[data-s]', el), { items: MI.map(x => ({ id: x.id, t: esc(x.t), sub: esc(x.sub) })), buckets: MQ, value: a.v, reveal, readonly: ctx.readonly, seed: 'prio-mx', onChange: v => { a.v = v; ctx.save(); } });
      ui.quiz(TR.$('[data-q]', el), Object.assign({}, MXQ, { value: a.q, readonly: ctx.readonly, reveal: ctx.result, onChange: v => { a.q = v; ctx.save(); } }));
    },
    check(ans) {
      const ev = mxEval(ans), notes = [];
      const empty = ev.rows.filter(r => r.s === 'empty').length;
      if (empty) notes.push({ ok: false, html: `Не разложено ${empty} из ${MI.length}.` });
      ev.rows.forEach(r => {
        if (r.s === 'warn') notes.push({ ok: 'warn', html: `«${esc(r.x.t)}» — ${esc(r.x.alt[r.g])}` });
        else if (r.s === 'bad') notes.push({ ok: false, html: `«${esc(r.x.t)}» — ${MHINT[r.x.ok]}` });
      });
      notes.push(ev.q.ok ? { ok: true, html: 'Вопрос: верно.' } : { ok: false, html: 'Вопрос: что будет с целями Нины, если начать с мелочей или с самого дорогого?' });
      const crit = ev.rows.filter(r => (r.x.ok === 'quick' || r.x.ok === 'big') && (r.g === 'fill' || r.g === 'trap') && r.s === 'bad');
      const ok = ev.score >= 0.8 && ev.q.ok && !crit.length;
      if (crit.length && ev.score >= 0.8) notes.unshift({ ok: false, html: 'Почти: но ценное записано в малоценное. Перечитайте подписи под карточками — что будет с целями Нины и покупателями без них?' });
      const phoneLow = ev.rows.find(r => r.x.id === 'phone' && (r.g === 'fill' || r.g === 'trap'));
      return {
        ok, score: ev.score, notes,
        summary: `По местам: ${ev.rows.filter(r => r.s === 'ok').length} из ${MI.length}, близко: ${ev.rows.filter(r => r.s === 'warn').length}.`,
        mentor: phoneLow ? 'Заказ через кассира выглядит «скучным», но без него теряем постоянных клиентов старше 55 — это 40 % постоянных. Ценность меряют не тем, насколько фича современная, а тем, что будет без неё.' : null
      };
    },
    explain: `${ui.table(['Квадрат', 'Карточки', 'Что делать'], [
        ['Быстрые победы', 'план выпечки из предзаказов; выгрузка в 1С; заказ через кассира', 'в первую версию без раздумий: дёшево и закрывает цели'],
        ['Большие ставки', 'заказ торта; учёт остатков и списаний; прогноз по погоде', 'планировать: торт — к 8 Марта; остатки — следом; погоду — начать с проверки гипотезы на данных'],
        ['Мелочи', '«повторить заказ»; тёмная тема', 'в паузах, если останется время; хорошие кандидаты в Could'],
        ['Ловушки', 'подписка; смарт-часы; баллы (пока)', 'не брать сейчас; вернуться, когда появятся данные или дешёвый способ']
      ])}
      <p>Матрица не заменяет MoSCoW, а готовит к нему: быстрые победы почти всегда становятся Must или Should, ловушки — Won't. Спорные места — честно спорные: баллы для Риты — большая ставка, для аналитика без данных — ловушка. Решает это не матрица, а данные — и Нина. Самая коварная ошибка — считать «скучное» малоценным: заказ через кассира стоит полнедели и удерживает 40 % постоянных клиентов.</p>`,
    report: ans => mxEval(ans).rows.map(r => `- ${r.x.t} → ${(MQ.find(q => q.id === r.g) || { t: '—' }).t} ${r.s === 'ok' ? '✓' : r.s === 'warn' ? '≈' : '✗'}`).join('\n')
  };

  // =====================================================================
  // Практика 3. Главная лаборатория: MVP к 1 марта по MoSCoW
  // =====================================================================
  const CAP = 15, WEEK_K = 280, FIXED_K = 600 + 1200, BUDGET_K = 6000;
  const MB = [
    { id: 'M', t: 'Must — обязательно', sub: 'без этого запуск 1 марта бессмыслен' },
    { id: 'S', t: 'Should — важно', sub: 'нужно, но можно чуть позже' },
    { id: 'C', t: 'Could — если останется время', sub: 'первое, что режем' },
    { id: 'W', t: "Won't — не в этот раз", sub: 'осознанно откладываем' }
  ];
  const FEAT = [
    { id: 'pre', t: 'Предзаказ на завтра и на сегодня из остатков', w: 2, g: 'БЦ-2', must: true, miss: 'Нет самого продукта: заказать заранее нельзя — БЦ-2 не двигается.' },
    { id: 'slot', t: 'Выбор пекарни и получасового интервала', w: 0.5, g: 'БЦ-2', must: true, miss: 'Покупатель не может сказать, где и когда заберёт заказ (F-slot): предзаказ теряет смысл.' },
    { id: 'pay', t: 'Онлайн-оплата картой и СБП', w: 1, g: 'БЦ-2, БЦ-4', must: true, miss: 'Нет онлайн-оплаты: торт без предоплаты 50 % не принять (F-cake48), а Олег Петрович сверяет оплату руками.' },
    { id: 'cash', t: 'Оплата при получении', w: 0.5, g: 'покупатели 55+', must: true, miss: 'Кто платит наличными, не может оформить заказ — Нина на это не согласится (F-pay).' },
    { id: 'fz54', t: 'Чеки по 54-ФЗ через «КассаПро»', w: 1.5, g: 'закон, БЦ-4', must: true, miss: 'Без чеков «предоплата» и полного расчёта запускаться нельзя: нарушение 54-ФЗ (F-54fz).' },
    { id: 'cake', t: 'Заказ торта с фото и надписью, предоплата 50 %', w: 1.5, g: 'БЦ-3', must: true, miss: 'Торты остаются в тетради: к 8 Марта снова потерянные заказы и скандал (БЦ-3, F-cakeloss).' },
    { id: 'desk', t: 'Экран сборки и выдачи заказов для кассира', w: 1, g: 'БЦ-2, БЦ-3', must: true, miss: 'Кассиру не видно заказов: пакеты под прилавком, путаница в пик (F-obs-shelf).' },
    { id: 'plan', t: 'Предзаказы автоматически в план выпечки', w: 0.5, g: 'БЦ-1', must: true, miss: 'Галина Ивановна в 23:00 считает план «на глаз» — предзаказы могут не испечь (F-plan).' },
    { id: 'c1', t: 'Сводная выгрузка продаж в 1С', w: 0.5, g: 'БЦ-4', must: true, miss: 'Олег Петрович по-прежнему сводит продажи руками — теперь ещё и онлайн-оплаты (БЦ-4).' },
    { id: 'phone', t: 'Заказ по телефону через кассира', w: 0.5, g: 'покупатели 55+', must: true, miss: 'Без заказа через кассира теряем постоянных клиентов старше 55 — это 40 % постоянных, многие без смартфона (F-elder).' },
    { id: 'stock', t: 'Учёт остатков на витрине и списаний в планшете', w: 1.5, g: 'БЦ-1', ok: ['S'], half: { M: 'Ценно для БЦ-1, но Must растёт; это допустимо, только если Нина согласна рискнуть запасом.', C: 'Можно, но тогда БЦ-1 двигается медленно: план учтёт предзаказы, а списаний по-прежнему не видно.' }, bad: 'Списания — первая боль Нины (БЦ-1, ≈ 1,1 млн ₽ в месяц). Совсем без учёта цель не двигается.' },
    { id: 'push', t: 'Push и SMS «Заказ готов»', w: 0.5, g: 'удобство', ok: ['S', 'C'], half: { W: 'Можно и позже, но это дешёвое удобство: полнедели.' }, bad: 'Заказ и без SMS ждёт в своём интервале — к 1 марта это не обязательно.' },
    { id: 'vk', t: 'Ссылка на заказ из постов ВКонтакте', w: 0.5, g: 'БЦ-2', ok: ['S', 'C'], half: { W: 'Можно и позже, но 18 тыс. подписчиков уже пишут заказы в личку — ссылка дешёвая.' }, bad: 'Без ссылки предзаказ всё равно работает — это ускоритель, а не основа.' },
    { id: 'points', t: 'Баллы лояльности', w: 2.5, g: 'БЦ-2?', ok: ['C', 'W'], half: { S: 'Эффект не доказан, данных нет, а это 2,5 недели. По плану баллы — во II квартале 2027.' }, bad: 'Баллы в обязательном: Must растёт на 2,5 недели, а цели к 1 марта не двигаются. По плану — II квартал 2027.' },
    { id: 'evening', t: 'Скидка на выпечку после 19:00', w: 0.5, g: 'БЦ-1?', ok: ['C', 'W'], half: { S: 'Спорная акция: Галина Ивановна против, план выпечки может сломаться. Сначала решение Нины.' }, bad: 'Спорная акция: Галина Ивановна против, план может сломаться. В обязательное — точно нет.' },
    { id: 'repeat', t: '«Повторить прошлый заказ»', w: 0.5, g: 'удобство', ok: ['C'], half: { S: 'Приятно постоянным, но цели не двигает — скорее Could.', W: 'Можно и отложить, хотя стоит дёшево — хороший кандидат в Could.' }, bad: 'Удобство без цели — не обязательное.' },
    { id: 'weather', t: 'Прогноз плана выпечки с учётом погоды', w: 2, g: 'БЦ-1?', ok: ['C', 'W'], half: { S: 'Пока гипотеза без данных — 2 недели на догадку рано.' }, bad: 'Гипотеза без данных — в обязательное рано.' },
    { id: 'deliv', t: 'Своя доставка хлеба', w: 4, g: 'БЦ-2', ok: ['W'], half: { C: '4 недели «если останется время» не останутся. Доставка — во II квартале 2027, это решение уже есть.' }, bad: 'Доставка — 4 недели и своя логистика (тёплый хлеб за 60 минут, 2 курьера). По плану — II квартал 2027 (F-delivery).' },
    { id: 'sub', t: 'Подписка «хлеб каждое утро»', w: 2, g: 'БЦ-2?', ok: ['W'], half: { C: 'Без своей доставки подписка не работает — это не «если останется время».' }, bad: 'Подписка требует доставки, которой нет, — в первую версию её не взять.' }
  ];
  const MUSTF = FEAT.filter(f => f.must);
  function mvpEval(ans) {
    const v = (ans && ans.v) || {};
    const sum = k => FEAT.filter(f => v[f.id] === k).reduce((s, f) => s + f.w, 0);
    const m = sum('M'), s = sum('S'), c = sum('C');
    const mustIn = MUSTF.filter(f => v[f.id] === 'M');
    const others = FEAT.filter(f => !f.must).map(f => { const g = v[f.id]; const st = !g ? 'empty' : f.ok.includes(g) ? 'ok' : f.half[g] ? 'warn' : 'bad'; return { f, g, st, pts: st === 'ok' ? 1 : st === 'warn' ? 0.5 : 0 }; });
    const capOk = m <= CAP * 0.75 ? (m + s <= CAP ? 1 : 0.5) : 0;
    const score = 0.5 * mustIn.length / MUSTF.length + 0.3 * others.reduce((x, o) => x + o.pts, 0) / others.length + 0.2 * capOk;
    const money = (m + s) * WEEK_K + FIXED_K;
    return { v, m, s, c, mustIn, others, capOk, score, money, ok: mustIn.length === MUSTF.length && m <= CAP * 0.75 && m + s <= CAP && score >= 0.8 };
  }
  function goalsOf(v) {
    const inM = id => v[id] === 'M', inMS = id => v[id] === 'M' || v[id] === 'S';
    const G = [];
    G.push(['БЦ-1 · списания 12 % → 7 %', inM('plan') ? (inMS('stock') ? ['ok', 'План учитывает предзаказы, остатки и списания видны в планшете'] : ['warn', 'План учитывает предзаказы, но списаний по-прежнему не видно — цель двигается медленно']) : ['bad', 'Предзаказы не попадают в план — цель не двигается']]);
    G.push(['БЦ-2 · выручка +15 %', inM('pre') && inM('slot') && (inM('pay') || inM('cash')) ? ['ok', 'Предзаказ работает: заказать заранее и забрать без очереди. Доставка — во II квартале'] : ['bad', 'Предзаказа в рабочем виде нет']]);
    G.push(['БЦ-3 · ни одного потерянного торта к 8 Марта', inM('cake') && inM('desk') && inM('pay') ? ['ok', 'Торт — в системе с фото и предоплатой, кассир видит заказы'] : inM('cake') ? ['warn', 'Торт в системе, но без предоплаты или без экрана выдачи — дыры остаются'] : ['bad', 'Торты по-прежнему в тетради']]);
    G.push(['БЦ-4 · сверка 2 ч → 15 мин', inM('c1') && inM('fz54') ? ['ok', 'Сводка в 1С и чеки — автоматически'] : inM('c1') || inM('fz54') ? ['warn', 'Сверка ускорится лишь частично'] : ['bad', 'Олег Петрович сводит руками']]);
    G.push(['Закон · 54-ФЗ', inM('fz54') ? ['ok', 'Чеки «предоплата» и полного расчёта пробиваются'] : ['bad', 'Запуск без чеков незаконен']]);
    G.push(['Покупатели 55+ · 40 % постоянных', inM('phone') && inM('cash') ? ['ok', 'Можно заказать по телефону через кассира и заплатить на месте'] : inM('phone') || inM('cash') ? ['warn', 'Остался только один из двух привычных способов'] : ['bad', 'Без смартфона и карты заказать нельзя']]);
    return G;
  }
  const mvpTask = {
    id: 'mvp', title: 'Главная лаборатория: MVP к 1 марта',
    simple: howMoscow.simple,
    lead: ui.brief({
      situation: 'В понедельник Нина подписывает объём первой версии. Игорь: «До 1 марта у команды около 15 недель работы — ноябрь, декабрь, январь, февраль минус новогодние каникулы. Неделя команды стоит примерно 280 тыс. ₽; плюс обследование 600 тыс. и 1,2 млн на качество — это весь бюджет 6 млн ₽». Нина Сергеевна на прошлой встрече: «Всё важно! Всё к 1 марта!» — поэтому сейчас все 19 карточек лежат в Must.',
      todo: [
        'Переложите карточки по четырём корзинам MoSCoW: нажмите карточку, потом корзину (на компьютере можно перетаскивать). У каждой карточки — оценка Димы в неделях и цель, которую она двигает.',
        'Следите за полосой ёмкости, деньгами, целями БЦ-1…БЦ-4 и списком «Что сломается»: он показывает, что будет, если обязательного не окажется в Must.',
        'Добейтесь, чтобы Must + Should влезали в 15 недель, Must занимал не больше 75 %, цели были закрыты и ничего не ломалось. Нажмите «Проверить». Засчитывается от 80 %.'
      ],
      look: 'Ориентир DSDM — Must около 60 % ёмкости: остальное — запас на сертификацию «КассаПро» (3 недели у вендора), болезни и ошибки пилота. Could — первое, что режем, если не успеваем. Won\'t — не «никогда», а «не в этот раз»: доставка и баллы по плану — во II квартале 2027.'
    }),
    blank: () => ({ v: Object.fromEntries(FEAT.map(f => [f.id, 'M'])) }),
    reference: () => ({ v: Object.fromEntries(FEAT.map(f => [f.id, f.must ? 'M' : f.ok[0]])) }),
    render(el, ctx) {
      el.classList.add('prio-root');
      const a = ctx.ans; a.v = a.v || {};
      let reveal = null;
      if (ctx.result) { reveal = {}; const ev = mvpEval(a); MUSTF.forEach(f => { if (a.v[f.id]) reveal[f.id] = a.v[f.id] === 'M' ? 'ok' : 'bad'; }); ev.others.forEach(o => { if (o.g) reveal[o.f.id] = o.st; }); }
      el.innerHTML = `<div class="stack">
        <div class="prio-cap" data-capt></div>
        <div class="prio-lab">
          <div data-s></div>
          <div class="stack" data-dash></div>
        </div>
      </div>`;
      function draw() {
        const ev = mvpEval(a), v = a.v;
        const pct = Math.round(ev.m / CAP * 100);
        TR.$('[data-capt]', el).innerHTML = `<div class="small"><b>Ёмкость до 1 марта: ${CAP} недель.</b> Must — ${nf(ev.m)} нед. (${pct} %) · Must + Should — ${nf(ev.m + ev.s)} нед. · Could — ${nf(ev.c)} нед.</div>${capBar([{ w: ev.m, cls: 'm' }, { w: ev.s, cls: 's' }, { w: ev.c, cls: 'c' }], CAP, [0.6, 0.75])}<div class="lg"><span><i style="background:var(--accent)"></i>Must</span><span><i style="background:var(--info)"></i>Should</span><span><i style="background:var(--violet)"></i>Could</span><span><i style="background:var(--text)"></i>черты — 60 % и 75 %</span><span><i style="background:var(--bad)"></i>не влезает до 1 марта</span></div>`;
        const left = CAP - ev.m - ev.s;
        let fit = [], rest = Math.max(0, left);
        FEAT.filter(f => v[f.id] === 'C').forEach(f => { if (f.w <= rest + 1e-9) { fit.push(f.t); rest -= f.w; } });
        const breaks = MUSTF.filter(f => v[f.id] !== 'M').map(f => `<li class="bad">${esc(f.miss)}</li>`);
        FEAT.filter(f => (f.id === 'deliv' || f.id === 'sub' || f.id === 'points') && (v[f.id] === 'M' || v[f.id] === 'S')).forEach(f => breaks.push(`<li class="warn">«${esc(f.t)}» в ${v[f.id] === 'M' ? 'Must' : 'Should'}: +${nf(f.w)} нед. — ${f.id === 'points' ? 'эффект не доказан, по плану это II квартал' : 'нужна своя доставка, по плану это II квартал'}.</li>`));
        if (ev.m > CAP) breaks.unshift(`<li class="bad">Must — ${nf(ev.m)} недель при ёмкости ${CAP}: к 1 марта не будет даже обязательного. Если всё — Must, ничего не Must.</li>`);
        else if (ev.m + ev.s > CAP) breaks.unshift(`<li class="bad">Must + Should — ${nf(ev.m + ev.s)} недель: к 1 марта не успеваем то, что считали важным.</li>`);
        else if (ev.m > CAP * 0.75) breaks.unshift(`<li class="warn">Must занимает ${pct} %: любая задержка (сертификация «КассаПро», болезнь) — и обязательное не успеть.</li>`);
        const moneyOver = ev.money > BUDGET_K;
        let who = '';
        if (ev.m > CAP) who = ui.say('nina', 'Всё важно! Всё к 1 марта!') + ui.say('igor', `Тогда к 1 марта не будет ничего: ${nf(ev.m)} недель в ${CAP} не влезают. Давайте решим, без чего запуск бессмыслен.`);
        else if (ev.ok) who = ui.say('igor', `Это реально: обязательное — ${pct} % ёмкости, есть запас на сертификацию «КассаПро» и пилот 1 февраля.`);
        else if (MUSTF.some(f => v[f.id] !== 'M')) who = ui.say('ksenia', 'Срок держится — но посмотрите на «Что сломается». Обязательное — это не «самое дорогое» и не «самое модное», а то, без чего запуск 1 марта бессмыслен или незаконен.');
        TR.$('[data-dash]', el).innerHTML = `
          <div class="stat"><span class="k">Деньги</span><span class="v ${moneyOver ? 'bad' : ''}">${big(ev.money)} из ${big(BUDGET_K)} тыс. ₽</span>${ui.meter(Math.min(1, ev.money / BUDGET_K), moneyOver ? 'bad' : '')}<span class="s">(Must + Should) × 280 тыс. ₽ + обследование 600 тыс. + качество 1 200 тыс.</span></div>
          <div class="stat"><span class="k">Запас до 1 марта</span><span class="v ${left < 0 ? 'bad' : ''}">${left < 0 ? 'нет: −' + nf(-left) : nf(left)} нед.</span><span class="s">${left > 0 ? (fit.length ? 'Если всё пойдёт гладко, влезут Could: ' + esc(fit.join(', ')) : 'Запас — на риски: сертификация «КассаПро», ошибки пилота') : 'Could не влезет, а риски закрыть нечем'}</span></div>
          <div class="prio-lbl">Цели и обязательства</div>
          <div class="prio-goals">${goalsOf(v).map(([t, [k0, d0]]) => [t, ev.m > CAP && k0 === 'ok' ? ['warn', 'На бумаге — да, но Must не влезает в 15 недель: к 1 марта это не успеть'] : [k0, d0]]).map(([t, [k, d]]) => `<div class="prio-goal ${k}"><span>${esc(t)}</span>${ui.status(k === 'ok' ? 'закрыта' : k === 'warn' ? 'частично' : 'нет', k)}<small>${esc(d)}</small></div>`).join('')}</div>
          <div class="prio-lbl">Что сломается</div>
          ${breaks.length ? `<ul class="checks">${breaks.join('')}</ul>` : '<ul class="checks"><li>Ничего: обязательное в Must, срок и деньги держатся.</li></ul>'}
          ${who}`;
      }
      ui.sort(TR.$('[data-s]', el), { items: FEAT.map(f => ({ id: f.id, t: esc(f.t), sub: `${nf(f.w)} нед. · ${esc(f.g)}` })), buckets: MB, value: a.v, reveal, readonly: ctx.readonly, seed: 'prio-mvp', onChange: v => { a.v = v; ctx.save(); ctx.decide('MVP к 1 марта: Must', FEAT.filter(f => v[f.id] === 'M').map(f => f.t).join('; ') || '—'); draw(); } });
      draw();
    },
    check(ans) {
      const ev = mvpEval(ans), notes = [];
      const outM = MUSTF.filter(f => ev.v[f.id] !== 'M');
      if (outM.length) notes.push({ ok: false, html: `Вне Must ${outM.length} ${TR.plural(outM.length, 'карточка, без которой', 'карточки, без которых', 'карточек, без которых')} запуск ломается. Откройте список «Что сломается» — что в нём написано красным?` });
      if (ev.m > CAP) notes.push({ ok: false, html: `Must — ${nf(ev.m)} недель при ёмкости ${CAP}. Спросите про каждую карточку в Must: запуск 1 марта бессмыслен или незаконен без неё?` });
      else if (ev.m > CAP * 0.75) notes.push({ ok: false, html: `Must занимает ${Math.round(ev.m / CAP * 100)} % ёмкости — запаса на риски почти нет. Что из Must на самом деле «важно, но можно чуть позже»?` });
      if (ev.m + ev.s > CAP && ev.m <= CAP) notes.push({ ok: false, html: `Must + Should — ${nf(ev.m + ev.s)} недель: к 1 марта не влезают. Что из Should можно сделать «если останется время»?` });
      const eo = ev.others.filter(o => o.st === 'empty').length;
      if (eo) notes.push({ ok: false, html: `Не разложено ${eo} ${TR.plural(eo, 'карточка', 'карточки', 'карточек')}.` });
      ev.others.forEach(o => {
        if (o.st === 'warn') notes.push({ ok: 'warn', html: `«${esc(o.f.t)}» — ${esc(o.f.half[o.g])}` });
        else if (o.st === 'bad') notes.push({ ok: false, html: `«${esc(o.f.t)}» — ${esc(o.f.bad)}` });
      });
      if (ev.ok) notes.unshift({ ok: true, html: `MVP собран: Must — ${nf(ev.m)} нед. (${Math.round(ev.m / CAP * 100)} %), Must + Should — ${nf(ev.m + ev.s)} из ${CAP}, все цели и обязательства закрыты.` });
      const ptsM = ev.v.points === 'M', delM = ev.v.deliv === 'M';
      return {
        ok: ev.ok, score: ev.score, notes,
        summary: `Обязательных в Must: ${ev.mustIn.length} из ${MUSTF.length}. Must — ${nf(ev.m)} нед., Must + Should — ${nf(ev.m + ev.s)} из ${CAP}.`,
        mentor: ev.m > CAP ? 'Нина сказала «всё важно» — и это нормально: для заказчика всё важно. Наша работа — показать, что будет к 1 марта при каждом выборе, и помочь выбрать. MoSCoW работает, только когда Must — не всё.'
          : (ptsM || delM) ? 'Баллы и доставка — хорошие идеи, просто не к 1 марта: они не двигают цели первой версии, а время съедают. «Не в этот раз» — не «никогда».'
            : outM.some(f => f.id === 'phone') ? 'Заказ через кассира легко выкинуть: он «не цифровой». Но без него 40 % постоянных клиентов — те, кому за 55, — остаются за бортом. MVP — минимальный, но жизнеспособный для всех, кого нельзя потерять.' : null
      };
    },
    explain: `<p><b>Эталон:</b> Must — 10 карточек на 9,5 недели (63 % ёмкости): предзаказ, интервал, онлайн-оплата и оплата на месте, чеки по 54-ФЗ, торт, экран кассира, план выпечки, выгрузка в 1С, заказ через кассира. Should — учёт остатков, SMS «готов», ссылка из ВКонтакте (2,5 недели). Could — баллы, скидка после 19:00, «повторить заказ», прогноз по погоде. Won't — своя доставка и подписка. Must + Should = 12 из 15 недель: 3 недели запаса на сертификацию «КассаПро», пилот и ошибки.</p>
      ${ui.table(['Почему в Must', 'Что будет без этого'], [
        ['Предзаказ, интервал, оплата', 'нет продукта: БЦ-2 не двигается'],
        ['Чеки по 54-ФЗ', 'запуск незаконен — не обсуждается, даже если «не ценно»'],
        ['Торт с фото и предоплатой', '8 Марта без потерь — главный срок проекта (БЦ-3)'],
        ['Экран кассира', 'пакеты под прилавком и путаница в пик'],
        ['План выпечки, выгрузка в 1С', 'дёшево (по полнедели) и закрывают БЦ-1 и БЦ-4'],
        ['Заказ через кассира и оплата на месте', '40 % постоянных клиентов — старше 55, многие без смартфона']
      ])}
      <p>Чему учит лаборатория. <b>MVP — не «плохой продукт», а самый маленький, который уже работает для всех, кого нельзя потерять</b>: поэтому в нём «скучный» заказ через кассира и нет «модных» баллов. <b>Must определяется не ценой и не модой, а вопросом «запуск без этого бессмыслен или незаконен?»</b>. <b>Запас — не лень, а страховка</b>: сертификация у вендора, пилот 1 февраля, болезни. И Won't — это решение, а не забвение: доставка и баллы записаны во II квартал 2027.</p>
      <p>Канон объёма — DOMAIN §4 «MVP к 1 марта». Источник метода — DSDM (MoSCoW и правило «Must не больше ~60 % трудозатрат»).</p>`,
    refNote: 'Must — по канону DOMAIN §4. Также засчитываются: SMS и ссылка ВКонтакте в Could; баллы, скидка после 19:00 и прогноз по погоде в Won\'t; учёт остатков в Must (наполовину — Must растёт до 73 %).',
    report: ans => { const ev = mvpEval(ans); return MB.map(b => `${b.t}: ${FEAT.filter(f => ev.v[f.id] === b.id).map(f => f.t).join('; ') || '—'}`).join('\n') + `\nMust ${nf(ev.m)} нед., Must + Should ${nf(ev.m + ev.s)} из ${CAP}; деньги ${ev.money} тыс. ₽.`; }
  };

  // =====================================================================
  // Практика 4. Спор: Рита хочет баллы в MVP
  // =====================================================================
  const RT = [
    { id: 't1', rita: 'Баллы — это же ядро! У Додо есть, у Спортмастера есть. Без баллов приложение никто не скачает.', o: [
      { v: 'val', k: 'ok', t: 'Давай сверимся с целями к 1 марта: торты без потерь к 8 Марта, предзаказ без очереди, сверка для Олега Петровича. Скачивать будут ради предзаказа — круассаны не кончатся. А какую метрику и какую цель двигают баллы?', re: 'Хм… Ну хорошо, цели. Но баллы — это же про то, чтобы возвращались!', who: 'rita', dr: 0, dg: 5 },
      { v: 'pos', k: 'pos', t: 'Баллов нет в объёме первой версии. Обсуждать нечего.', re: 'Ах так? Тогда я иду к Нине Сергеевне — она-то баллы хотела!', who: 'rita', dr: -25, dg: 0 },
      { v: 'cap', k: 'cap', t: 'Ладно, раз у всех есть — добавлю в обязательное.', re: 'Ура! Я знала, что ты поймёшь!', who: 'rita', dr: 10, dg: -25 }] },
    { id: 't2', rita: 'Возвращаемость! С баллами люди будут приходить чаще, это все знают.', o: [
      { v: 'val', k: 'ok', t: 'Хорошая гипотеза — давай её проверим. Сейчас данных нет: бумажные карточки никто не считал. В первой версии появятся телефон покупателя с согласием по 152-ФЗ и история заказов — через пару месяцев увидим, кто и как часто возвращается. Тогда баллы будут не наугад.', re: 'То есть я приду к Нине с цифрами? Это мне нравится.', who: 'rita', dr: 10, dg: 5 },
      { v: 'pos', k: 'pos', t: '«Все знают» — не аргумент. Забудь.', re: 'Знаешь что, с тобой невозможно разговаривать.', who: 'rita', dr: -25, dg: 0 },
      { v: 'cap', k: 'cap', t: 'Давай тогда сделаем баллы «по-быстрому», без правил, — потом доделаем.', re: 'Отлично! Начисляем всем по 5 %, с первого дня!', who: 'rita', dr: 5, dg: -20 }] },
    { id: 't3', rita: 'Ну это же маленькая доработка! Недельку, не больше.', o: [
      { v: 'val', k: 'ok', t: 'Дима оценил баллы в 2,5 недели: начисление 5 %, оплата баллами до 30 % чека, перенос бумажных карточек, согласие по 152-ФЗ. Обязательное уже занимает почти две трети времени до 1 марта. Если берём баллы — что убираем взамен: торты к 8 Марта? Заказ через кассира для покупателей постарше?', re: 'Нет, торты трогать нельзя… Ладно, это не неделька.', who: 'rita', dr: 0, dg: 10 },
      { v: 'cap', k: 'cap', t: 'Неделька — не страшно, как-нибудь втиснем.', re: 'Супер! Я уже придумала акцию к запуску!', who: 'rita', dr: 10, dg: -25 },
      { v: 'pos', k: 'pos', t: 'Нет. Я сказал(а) — нет.', re: 'Ну и ладно. Поговорю с Игорем.', who: 'rita', dr: -20, dg: 0 }] },
    { id: 't4', rita: 'Хорошо, без баллов. Но давай хотя бы скидку 30 % после 19:00 — это вообще пять минут!', o: [
      { v: 'val', k: 'ok', t: 'Тут не пять минут кода, а решение для бизнеса: Галина Ивановна говорит, что все будут ждать 19:00 и план выпечки сломается. Давай вынесем это Нине Сергеевне вместе с Галиной Ивановной: плюс для списаний и риск для утренних продаж, — пусть решит владелица.', re: 'Справедливо. Подготовлю, сколько остатков мы выбрасываем вечером.', who: 'rita', dr: 5, dg: 10 },
      { v: 'cap', k: 'cap', t: 'Скидку сделаем, Галина Ивановна привыкнет.', re: 'Ура! Анонс в сторис уже готов!', who: 'rita', dr: 10, dg: -20 },
      { v: 'pos', k: 'pos', t: 'Скидки — не моя забота, это маркетинг.', re: 'То есть аналитику всё равно, что будет с продажами?', who: 'rita', dr: -15, dg: -5 }] },
    { id: 'fin', rita: 'Ладно. Что ты предложишь Нине Сергеевне?', o: [
      { v: 'val', k: 'ok', t: 'К 1 марта — без баллов: бумажные карточки остаются. В первой версии собираем телефон и историю заказов с согласием. Баллы — во II квартале 2027, когда будут данные о возвращаемости; Рита заранее предлагает, по какой метрике поймём, что баллы сработали.', re: 'Вот это я понимаю — с цифрами и сроком. Согласна.', who: 'nina', dr: 10, dg: 15 },
      { v: 'cap', k: 'cap', t: 'Баллы — в обязательное, а торты — во II квартал: их всё равно немного.', re: 'Как это — торты потом? А 8 Марта? Мы же ради этого всё начинали!', who: 'nina', dr: 10, dg: -30 },
      { v: 'cap2', k: 'cap', t: 'И баллы, и всё обязательное — а срок сдвинуть на апрель.', re: 'В апреле 8 Марта уже прошло. Нет.', who: 'nina', dr: 5, dg: -30 }] }
  ];
  const RT_HINT = {
    pos: 'Как Рита это услышит? Она пойдёт к Нине жаловаться — и спор решится без аргументов. Что можно сказать про цели, цифры и данные?',
    cap: 'Рита довольна — а что будет с 1 марта и целями Нины? Посчитайте, что выпадет из обязательного или что сломается.'
  };
  function ritaEval(ans) {
    const s = (ans && ans.s) || {};
    const rows = RT.map(t => { const o = t.o.find(x => x.v === s[t.id]); return { t, o, ok: !!o && o.k === 'ok' }; });
    let rel = 60, goals = 70;
    rows.forEach(r => { if (r.o) { rel += r.o.dr; goals += r.o.dg; } });
    rel = Math.max(0, Math.min(100, rel)); goals = Math.max(0, Math.min(100, goals));
    const good = rows.filter(r => r.ok).length;
    return { rows, good, rel, goals, score: good / RT.length, fin: rows[rows.length - 1].ok };
  }
  const ritaTask = {
    id: 'rita', title: 'Спор: Рита хочет баллы в MVP',
    simple: howCreep.simple,
    lead: ui.brief({
      situation: 'После планёрки Рита ловит вас у кофемашины. В черновике MVP баллов нет — они в Could и по плану во II квартале 2027. Рита уверена, что без баллов приложение провалится, и готова идти к Нине. Ксения: «Не спорьте о вкусах — говорите о целях, данных и цене. И не забудьте, что Рита — не враг: у неё тоже есть интерес».',
      todo: [
        'Прочитайте реплику Риты и выберите свой ответ из трёх. Рита отреагирует, и разговор пойдёт дальше — всего пять ходов, последний — что вы предложите Нине.',
        'Следите за двумя шкалами: «Отношения с Ритой» и «Цели к 1 марта». Хороший разговор держит обе.',
        'Нажмите «Проверить». Засчитывается, если хотя бы 4 из 5 ответов — через ценность и цели и последний ход верный. Кнопка «Начать разговор заново» сбрасывает ходы.'
      ],
      look: 'Три типа ответов: через цели, данные и цену; «нет, потому что нет» (позиция); «ладно, давай» (уступка без цены). Как это выглядит — во вкладке теории «Как сказать “не сейчас”».'
    }),
    blank: () => ({ s: {} }),
    reference: () => ({ s: Object.fromEntries(RT.map(t => [t.id, 'val'])) }),
    render(el, ctx) {
      el.classList.add('prio-root');
      const a = ctx.ans; a.s = a.s || {};
      el.innerHTML = '<div class="stack"><div class="prio-meters" data-mt></div><div class="stack" data-chat></div><div class="row" data-rs></div></div>';
      function draw() {
        const ev = ritaEval(a), judged = !!(ctx.result || ctx.readonly);
        const k = v => v >= 60 ? '' : v >= 40 ? 'warn' : 'bad';
        TR.$('[data-mt]', el).innerHTML = `<div class="stat"><span class="k">Отношения с Ритой</span><span class="v ${k(ev.rel)}">${ev.rel}</span>${ui.meter(ev.rel / 100, k(ev.rel))}</div><div class="stat"><span class="k">Цели к 1 марта</span><span class="v ${k(ev.goals)}">${ev.goals}</span>${ui.meter(ev.goals / 100, k(ev.goals))}</div>`;
        let h = '';
        for (let i = 0; i < RT.length; i++) {
          const t = RT[i], pick = a.s[t.id], o = t.o.find(x => x.v === pick);
          h += ui.say('rita', esc(t.rita));
          if (o) {
            const mk = judged ? (o.k === 'ok' ? ui.status('через ценность', 'ok') : ui.status(o.k === 'pos' ? 'позиция' : 'уступка', 'bad')) : '';
            h += ui.say('me', esc(o.t) + (mk ? `<div>${mk}</div>` : ''));
            h += ui.say(o.who, esc(o.re));
            continue;
          }
          if (ctx.readonly) break;
          const order = TR.shuffle(t.o.map(x => x.v), 'prio-rt-' + t.id);
          h += `<div class="prio-opts">${order.map(v => { const x = t.o.find(y => y.v === v); return `<button type="button" class="prio-opt" data-rt="${t.id}|${x.v}">${esc(x.t)}</button>`; }).join('')}</div>`;
          break;
        }
        TR.$('[data-chat]', el).innerHTML = h;
        TR.$('[data-rs]', el).innerHTML = !ctx.readonly && Object.keys(a.s).length ? '<button type="button" class="btn sm ghost" data-reset>⟲ Начать разговор заново</button>' : '';
      }
      TR.on(el, 'click', '[data-rt]', (e, b) => {
        if (ctx.readonly) return;
        const [tid, v] = b.dataset.rt.split('|');
        a.s[tid] = v; ctx.save();
        if (tid === 'fin') ctx.decide('Предложение Нине про баллы', RT[RT.length - 1].o.find(x => x.v === v).t);
        draw();
      });
      TR.on(el, 'click', '[data-reset]', () => { if (ctx.readonly) return; a.s = {}; ctx.save(); draw(); });
      draw();
    },
    check(ans) {
      const ev = ritaEval(ans), notes = [];
      const done = ev.rows.filter(r => r.o).length;
      if (done < RT.length) notes.push({ ok: false, html: `Разговор не закончен: ${done} из ${RT.length} ходов.` });
      ev.rows.forEach((r, i) => { if (r.o && !r.ok) notes.push({ ok: false, html: `Ход ${i + 1}: ${RT_HINT[r.o.k]}` }); });
      if (ev.good === RT.length) notes.push({ ok: true, html: 'Все пять ходов — через цели, данные и цену. Рита осталась союзником, а 1 марта защищено.' });
      return {
        ok: ev.good >= 4 && ev.fin, score: ev.score, notes,
        summary: `Ответов через ценность: ${ev.good} из ${RT.length}. Отношения с Ритой: ${ev.rel}, цели к 1 марта: ${ev.goals}.`,
        mentor: ev.rows.some(r => r.o && r.o.k === 'pos') ? 'Рита не враг: ей нужны постоянные покупатели, а не «баллы любой ценой». Когда вы говорите про её интерес и предлагаете путь к нему — данные, срок, метрику, — она перестаёт воевать.'
          : ev.rows.some(r => r.o && r.o.k === 'cap') ? 'Уступка кажется дружелюбной, но платят за неё Нина и 8 Марта. «Да» без цены — это тоже решение за владельца продукта, только тайное.' : null
      };
    },
    explain: `<p>Пять ходов — пять приёмов, которые работают с любым «а давайте ещё»:</p>
      <ol>
        <li><b>Цель вместо вкуса.</b> Не «баллы не нужны», а «какую цель первой версии они двигают?». Цели к 1 марта — торты, предзаказ, сверка.</li>
        <li><b>Данные вместо «все знают».</b> Гипотезу Риты не отвергают, а проверяют: первая версия соберёт телефоны (с согласием) и историю заказов.</li>
        <li><b>Цена и обмен.</b> «Недельку» превращают в оценку Димы (2,5 недели) и вопрос «что убираем взамен?» — так останавливают расползание объёма.</li>
        <li><b>Конфликт — владельцу.</b> Скидка после 19:00 — спор Риты и Галины Ивановны; аналитик не выбирает победителя, а готовит решение для Нины с плюсами и рисками.</li>
        <li><b>Предложение с датой и метрикой.</b> «Не сейчас» звучит как план: II квартал 2027, данные о возвращаемости, метрика успеха от Риты.</li>
      </ol>
      <p>Опора — Фишер и Юри «Переговоры без поражения» (интересы, а не позиции; варианты до выбора; объективные критерии) и практика управления изменениями: базовая версия объёма, анализ влияния, решение владельца продукта.</p>`,
    report: ans => ritaEval(ans).rows.map((r, i) => `${i + 1}. ${r.o ? r.o.t : '—'} ${r.o ? (r.ok ? '✓' : '✗') : ''}`).join('\n')
  };

  // =====================================================================
  // Практика 5. Ответ Нине: почему доставка и баллы — не в первой версии
  // =====================================================================
  const NI_RUBRIC = [
    'Говорит «не в первой версии», а не «выкинули»: доставка и баллы — во II квартале 2027, как договаривались; бумажные карточки и курьеры для тортов пока остаются',
    'Связывает с целями и сроком: к 1 марта — то, что двигает цели и 8 Марта (предзаказ, торты без потерь, чеки, сверка); торты к празднику «горят», а баллы и доставка — нет',
    'Говорит о ёмкости и цене: до 1 марта около 15 недель работы команды, обязательное уже занимает около двух третей; доставка (~4 недели) и баллы (~2,5 недели) не влезают без того, чтобы выкинуть торты или заказ через кассира',
    'Показывает риск и данные: эффект баллов не доказан, а первая версия соберёт данные (телефоны с согласием, история заказов); доставка требует своей логистики — тёплый хлеб за 60 минут, 2 курьера',
    'Предлагает варианты с ценой и оставляет решение за Ниной: что пришлось бы убрать взамен, если всё же нужно сейчас, и когда вернуться к доставке и баллам'
  ];
  const NI_REF = 'Нина Сергеевна, мы ничего не выкинули: доставка и баллы стоят во втором квартале, как и договаривались, а бумажные карточки и курьеры для тортов пока работают как работали. К 1 марта у команды около пятнадцати недель, и почти две трети уже заняты тем, без чего запуск не имеет смысла: предзаказ без очереди, торты с предоплатой и фото, чтобы к 8 Марта не потерять ни одного, чеки по закону и сводка для Олега Петровича. Торты к празднику горят: опоздаем — праздник не перенесёшь. Баллы и доставка через месяц будут стоить столько же. При этом доставка — это примерно четыре недели и своя логистика: тёплый хлеб надо довезти за час, а курьеров у нас двое. Баллы — около двух с половиной недель, и пока мы не знаем, вернут ли они покупателей: бумажные карточки никто не считал. Первая версия как раз соберёт эти данные — телефоны с согласием и историю заказов, — и к весне Рита придёт с цифрами. Если вы решите, что баллы или доставка нужны уже к 1 марта, это возможно, но взамен придётся убрать, например, торты или заказ через кассира для покупателей постарше. Решение ваше — я подготовлю оба варианта с ценой.';
  const ninaTask = {
    id: 'nina', title: 'Ответьте Нине: почему доставка и баллы — не в первой версии',
    simple: {
      icon: '🗣️',
      plain: 'Заказчик слышит «не в первой версии» как «выкинули». Ваша задача — показать, что это решение ради её же целей, назвать цену и дату и оставить выбор за ней.',
      analogy: 'Хозяйка новой пекарни хочет к открытию и витрину, и доставку, и бонусные карты. Мастер говорит: «К открытию — печь, витрина и касса: без них не откроемся. Доставку — через три месяца, когда поймём спрос. Хотите доставку сразу — тогда открываемся на месяц позже. Как решите?»',
      tech: 'Обоснование приоритетов перед владельцем продукта: связь объёма с бизнес-целями и сроком, ёмкость и стоимость, стоимость задержки (что «горит»), риски и недостающие данные, варианты с ценой («что взамен»), решение за владельцем продукта (Scrum Guide 2020: Product Owner отвечает за порядок бэклога).'
    },
    lead: ui.brief({
      situation: 'Нина Сергеевна увидела черновик объёма первой версии и написала в чат. Игорь: «Ответьте вы — вы собирали MVP. Она должна подписать объём в понедельник и не чувствовать, что её обделили».',
      todo: [
        'Прочитайте сообщение Нины.',
        'Напишите ответ: 7–10 предложений, от 300 символов. Говорите про её цели, 8 Марта и деньги — без слов MoSCoW, RICE и WSJF.',
        'Нажмите «Проверить с Ксенией (Claude)» или «Сверить с эталоном самому» и честно отметьте раскрытые пункты. Засчитывается от 60 %.'
      ],
      lookTitle: 'На что опереться',
      look: 'Лаборатория MVP (ёмкость 15 недель, что сломается без обязательного), RICE и стоимость задержки (почему торт «горит», а баллы — нет), спор с Ритой (данные вместо «все знают»).'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: NI_REF, self: NI_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('prio-root');
      el.insertAdjacentHTML('beforeend', ui.say('nina', 'Посмотрела ваш список. Рита говорит, что без баллов приложение никто не скачает, а Лёша спрашивает про доставку хлеба. Я же писала — доставку тоже! Почему вы их выкинули?'));
      const j = document.createElement('div'); j.style.marginTop = '12px'; el.appendChild(j);
      ui.justify(j, {
        id: 'prio-nina', q: 'Ответ Нине: почему доставка и баллы — не в первой версии?',
        qPlain: 'Ответьте владелице сети пекарен, которая считает, что доставку и баллы «выкинули» из первой версии. Без жаргона объясните, что они не выкинуты, а отложены на второй квартал; свяжите объём к 1 марта с её целями и 8 Марта; назовите ёмкость команды и цену; покажите, каких данных не хватает для баллов и что нужно для доставки; предложите варианты с ценой и оставьте решение за ней.',
        rubric: NI_RUBRIC, reference: NI_REF, value: ctx.ans.j, readonly: ctx.readonly, minLen: 300,
        placeholder: 'Нина Сергеевна, … (своими словами: не выкинули, а когда; почему сейчас другое; сколько это стоит; какие варианты; кто решает)',
        onChange: v => { ctx.ans.j = v; ctx.save(); ctx.decide('Ответ Нине про доставку и баллы', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j);
      return {
        ok: s >= 0.6, score: s,
        summary: s ? `Оценка ответа: ${Math.round(s * 100)} %.` : 'Напишите ответ (от 300 символов) и проверьте его с Ксенией или сверьте с эталоном сами.',
        notes: s && s < 0.6 ? [{ ok: false, html: 'Нину убедит не метод, а её же цели: 8 Марта, торты, очередь, сверка. Покажите, что выпало бы из первой версии ради доставки и баллов, — и дайте ей выбрать.' }] : []
      };
    },
    explain: '<p>Сильный ответ начинает с главного страха заказчика — «выкинули» — и снимает его датой: II квартал 2027. Дальше — её цели и её праздник, а не наши методы: торты к 8 Марта горят, баллы и доставка — нет. Потом честная цена: ёмкость, недели, что пришлось бы убрать взамен. И последнее слово — за ней.</p><p>Это та же логика, что во всей тренировке: ценность (цели и метрики), стоимость задержки (что горит), ёмкость (MoSCoW и запас), данные вместо мнений. Но для Нины всё это звучит без единого термина — в этом и есть работа аналитика как переводчика.</p>',
    report: ans => (ans.j && ans.j.text) ? ans.j.text : '—'
  };

  // =====================================================================
  TR.stage({
    id: ID, act: 4, order: 350, slot: 'Пт 10:00', title: 'Ценность и приоритеты',
    when: 'пятница, 30 октября, 10:00 · переговорная «Квант Софт», на доске — карточки фич',
    intro: [
      { who: 'igor', html: 'В понедельник Нина Сергеевна подписывает объём первой версии. Денег — 6 млн ₽ на год, до 1 марта — около 15 недель работы команды. А список хотелок — на двадцать с лишним недель.' },
      { who: 'rita', html: 'Только баллы не трогайте! Без баллов приложение никто не скачает.' },
      { who: 'ksenia', html: 'Сегодня учимся решать, что делать первым, а что — потом: ценность фичи, модель Кано, RICE и стоимость задержки, матрица «ценность / трудозатраты», MoSCoW и MVP. И главное — как защитить решение перед Ритой и Ниной не словом «нельзя», а целями и цифрами.' }
    ],
    facts: ['F-deadline', 'F-budget', 'F-elder', 'F-cakeloss', 'F-loyalty', 'F-delivery', 'F-plan', 'F-1c', 'F-54fz', 'F-vk'],
    glossary: [
      { term: 'Ценность фичи', simple: 'Не «хочу», а ответ: кому станет лучше, как заметим, к какой цели ведёт, сколько стоит и что потеряем без неё.', tech: 'Вклад функции в бизнес-цели и потребности заинтересованных лиц, выраженный через метрику; сопоставляется со стоимостью и рисками (Impact Mapping, Гойко Аджич; BABOK — оценка ценности решения).' },
      { term: 'Приоритизация', simple: 'Решить, что ставим на маленькую витрину первым, а что — завтра.', tech: 'Определение порядка реализации требований по ценности, стоимости, рискам, срочности и зависимостям. Решение принимает владелец продукта, аналитик готовит основания.' },
      { term: 'MoSCoW', simple: 'Хлеб — обязательно, круассаны — да, макаруны — если останется место, свадебный торт — не сегодня.', tech: 'Метод приоритизации из DSDM: Must have, Should have, Could have, Won\'t have (this time). DSDM рекомендует держать Must не больше ~60 % трудозатрат, Could ~20 % — как запас на риски.' },
      { term: 'Модель Кано', simple: 'Чистый салон после мойки ждут молча, кофе в зоне ожидания — радует, а громкой музыке нет дела никому.', tech: 'Модель Нориаки Кано (1984): обязательные, одномерные, привлекательные, безразличные и обратные свойства. Категорию определяют парой вопросов («если есть» / «если нет») и таблицей оценки. Порядок: обязательные → одномерные → привлекательные.' },
      { term: 'RICE', simple: 'Сколько людей заметит × насколько сильно × насколько мы уверены ÷ сколько работы.', tech: 'Формула приоритизации (Intercom): Reach × Impact × Confidence ÷ Effort. Охват — за период, влияние — по шкале 0,25–3, уверенность — 50/80/100 %, трудозатраты — в человеко-неделях или месяцах.' },
      { term: 'Стоимость задержки', simple: 'Торт к 8 Марта «горит»: опоздал — праздник не перенесёшь. Баллы через месяц стоят столько же.', tech: 'Cost of Delay (Дон Рейнертсен) — ценность, теряемая за единицу времени ожидания. Бывает ровной, растущей и «с дедлайном» (сезон, праздник, закон).' },
      { term: 'WSJF', simple: 'Сначала то, что дороже всего откладывать и быстрее всего сделать.', tech: 'Weighted Shortest Job First (SAFe, по идеям Рейнертсена): стоимость задержки ÷ размер работы. В SAFe стоимость задержки = ценность для бизнеса + срочность + снижение риска, в относительных баллах.' },
      { term: 'Матрица «ценность / трудозатраты»', simple: 'Четыре угла доски: быстрые победы, большие ставки, мелочи и ловушки.', tech: 'Матрица value vs effort: быстрые победы (высокая ценность, малые затраты), большие ставки (высокая, большие), мелочи (низкая, малые), ловушки (низкая, большие). Используется для первичной сортировки перед MoSCoW.' },
      { term: 'MVP', simple: 'Пробная партия нового круассана в одной пекарне. Половина круассана — не MVP.', tech: 'Minimum Viable Product. У Эрика Риса («Бережливый стартап») — версия, позволяющая с минимальными усилиями проверить гипотезу; в проектной практике — первая версия, которая уже приносит ценность пользователям. Единого определения нет — договариваются заранее.' },
      { term: 'Расползание объёма', simple: '«А можно ещё розочку?» — и торт не успевает к субботе.', tech: 'Scope creep — неуправляемое добавление требований без пересмотра сроков, бюджета и ресурсов. Защита: базовая версия объёма, запрос на изменение, анализ влияния, обмен «новое вместо старого», решение владельца продукта.' }
    ],
    outro: 'Приоритет — не то, о чём громче просят, а ценность: для кого, какая цель и метрика, сколько стоит, чем рискуем и сколько теряем, если ждать. Формулы — RICE, WSJF, матрица — не приговор, а повод для честного разговора. MoSCoW работает, только когда Must — не всё. MVP — самая маленькая версия, которая уже работает для всех, кого нельзя потерять. А на «ещё одну маленькую хотелку» отвечаем вопросом: какую цель двигает и что убираем взамен. Сегодня в 15:00 — документы аналитика: куда всё это записать и кому что отдать.',
    tasks: [howValue, howMoscow, howCreep, riceTask, matrixTask, mvpTask, ritaTask, ninaTask]
  });
})();
