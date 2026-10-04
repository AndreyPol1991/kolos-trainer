/* Неделя 3, четверг 06:00 — «Смена в пекарне» (наблюдение, job shadowing).
   Теория (соседний пример — пункт выдачи заказов, ПВЗ): зачем смотреть, если можно спросить (рассказ оператора
   против смены глазами, четыре причины, почему люди не расскажут); как наблюдать (не мешать, записывать по времени,
   вопросы в паузах, лестница выводов, этика и эффект наблюдателя); что делать с увиденным (заметка → потребность →
   требование → кто проверит; противоречия: позиции, интересы, варианты, кто решает).
   Практика на «Колосе»: главная лаборатория — утренняя смена на Покровке 06:00–11:30 (перемотка времени, сцены,
   заметки наблюдателя, разговоры в паузах с Павлом, Галиной Ивановной и Олегом Петровичем — факты F-obs-* и факты
   тем «Производство», «Пекарни и остатки», «Деньги и учёт»); наблюдение или вывод (раскладка + мини-редактор);
   «говорят» против «делают»; от наблюдения к требованию; противоречия заинтересованных лиц и письмо Нине. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'observe';

  if (!document.getElementById('obs-css')) document.head.insertAdjacentHTML('beforeend', `<style id="obs-css">
    .obs-root, .obs-root .stack > * { min-width: 0; }
    .obs-root .seg button { white-space: normal; text-align: left; }
    .obs-lbl { font: 600 11px/1.35 var(--f-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--text-muted); }
    .obs-quote { border-left: 4px solid var(--violet); background: var(--surface); border-radius: 0 10px 10px 0; padding: 10px 14px; font-size: 15px; }
    .obs-quote small { display: block; color: var(--text-muted); font-size: 12.5px; margin-top: 4px; }
    /* теория: рассказ против смены */
    .obs-flow { display: grid; gap: 6px; }
    .obs-step { display: grid; grid-template-columns: 26px minmax(0, 1fr); gap: 8px; align-items: start; padding: 8px 10px; border: 1px solid var(--border); border-left: 4px solid var(--border-strong); border-radius: 10px; background: var(--surface); color: var(--text); font-size: 14px; line-height: 1.45; text-align: left; width: 100%; }
    .obs-step .n { font: 600 12px/1.6 var(--f-mono); color: var(--text-muted); text-align: center; }
    .obs-step.hid { cursor: pointer; background: var(--surface-2); }
    .obs-step.hid:hover { border-color: var(--text-muted); }
    .obs-step.obvious { border-left-color: var(--violet); } .obs-step.work { border-left-color: var(--warn); } .obs-step.cond { border-left-color: var(--info); } .obs-step.exc { border-left-color: var(--bad); }
    .obs-step[aria-pressed="true"] { box-shadow: 0 0 0 2px var(--accent) inset; }
    .obs-tag { display: inline-block; margin-left: 6px; font: 600 10.5px/1.5 var(--f-mono); letter-spacing: .05em; text-transform: uppercase; padding: 0 7px; border-radius: 99px; border: 1px solid currentColor; vertical-align: 1px; }
    .obs-tag.obvious { color: var(--violet); } .obs-tag.work { color: var(--warn); } .obs-tag.cond { color: var(--info); } .obs-tag.exc { color: var(--bad); }
    .obs-cmp { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr); gap: 14px; align-items: start; }
    .obs-cmp > * { min-width: 0; }
    .obs-flips { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 10px; }
    .obs-flip { text-align: left; border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text); border-radius: 12px; padding: 12px; min-height: 140px; display: grid; gap: 6px; align-content: start; font-size: 14px; line-height: 1.45; width: 100%; }
    .obs-flip:hover { border-color: var(--text-muted); }
    .obs-flip .q { font: 600 15px/1.35 var(--f-brand); }
    .obs-flip .k { font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--text-muted); }
    .obs-flip[aria-pressed="true"] { background: var(--violet-soft); border-color: var(--violet); }
    .obs-flip[aria-pressed="true"] .k { color: var(--violet); }
    /* теория: мини-симулятор и лестница */
    .obs-mom { border: 1px solid var(--border); border-radius: 12px; background: var(--surface); padding: 12px; display: grid; gap: 10px; }
    .obs-mom .t { font: 700 15px/1.3 var(--f-mono); color: var(--accent); }
    .obs-opts { display: grid; gap: 6px; }
    .obs-opt { text-align: left; border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text); border-radius: 10px; padding: 8px 12px; font-size: 14px; line-height: 1.45; width: 100%; }
    .obs-opt:hover:not(:disabled) { border-color: var(--accent); }
    .obs-opt.ok { border-color: var(--ok); background: var(--ok-soft); } .obs-opt.bad { border-color: var(--bad); background: var(--bad-soft); } .obs-opt.warn { border-color: var(--warn); background: var(--warn-soft); }
    .obs-opt:disabled { cursor: default; }
    .obs-trust { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 10px; align-items: center; font-size: 13px; }
    .obs-trust b { font: 600 14px/1 var(--f-mono); }
    .obs-ladder { display: grid; gap: 6px; }
    .obs-rung { display: grid; grid-template-columns: 30px minmax(0, 1fr); gap: 8px; align-items: start; padding: 8px 10px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); font-size: 14px; line-height: 1.45; }
    .obs-rung .i { font: 700 13px/1.5 var(--f-mono); color: var(--text-muted); text-align: center; }
    .obs-rung.top { border-color: var(--bad); background: color-mix(in srgb, var(--bad-soft) 60%, var(--surface)); }
    .obs-rung.base { border-color: var(--ok); background: color-mix(in srgb, var(--ok-soft) 60%, var(--surface)); }
    .obs-rung.q { border-style: dashed; border-color: var(--info); }
    .obs-rung .k { display: block; font: 600 10.5px/1.4 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .obs-checks { display: grid; gap: 6px; }
    .obs-check { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 8px; align-items: start; padding: 8px 10px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); font-size: 14px; line-height: 1.45; cursor: pointer; }
    .obs-check input { accent-color: var(--accent); width: 16px; height: 16px; margin-top: 3px; }
    .obs-check.on.good { border-color: var(--ok); } .obs-check.on.bad { border-color: var(--bad); background: var(--bad-soft); }
    .obs-check small { display: block; color: var(--text-muted); font-size: 12.5px; margin-top: 2px; }
    /* теория: цепочка и слои */
    .obs-chain { display: grid; gap: 8px; }
    .obs-link { display: grid; grid-template-columns: 112px minmax(0, 1fr); gap: 4px 12px; padding: 9px 12px; border: 1px solid var(--border); border-left: 4px solid var(--border-strong); border-radius: 10px; background: var(--surface); font-size: 14px; line-height: 1.45; }
    .obs-link .k { font: 600 10.5px/1.6 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .obs-link.s0 { border-left-color: var(--violet); } .obs-link.s1 { border-left-color: var(--warn); } .obs-link.s2 { border-left-color: var(--accent); } .obs-link.s3 { border-left-color: var(--info); }
    .obs-link.fut { opacity: .38; }
    .obs-layers { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .obs-side { border: 1px solid var(--border); border-radius: 12px; background: var(--surface); padding: 10px 12px; display: grid; gap: 6px; align-content: start; font-size: 14px; line-height: 1.45; min-width: 0; }
    .obs-side h4 { font: 600 14.5px/1.3 var(--f-brand); }
    .obs-side .pos { font-weight: 600; }
    .obs-side .int { color: var(--text-2); border-left: 3px solid var(--warn); padding-left: 8px; }
    .obs-varis { display: grid; gap: 6px; }
    .obs-vari { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 4px 10px; padding: 8px 10px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); font-size: 14px; line-height: 1.45; }
    .obs-vari small { grid-column: 1 / -1; color: var(--text-muted); font-size: 12.5px; }
    /* лаборатория: смена */
    .obs-tl { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 10px; align-items: center; }
    .obs-tl input[type=range] { width: 100%; accent-color: var(--accent); }
    .obs-times { display: flex; flex-wrap: wrap; gap: 4px; }
    .obs-time { border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text-2); border-radius: 7px; padding: 2px 7px; font: 600 11.5px/1.5 var(--f-mono); position: relative; }
    .obs-time[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); }
    .obs-time.talk::after { content: ""; position: absolute; top: -3px; right: -3px; width: 7px; height: 7px; border-radius: 50%; background: var(--info); }
    .obs-time.has { border-color: color-mix(in srgb, var(--ok) 55%, var(--border-strong)); }
    .obs-scene { border: 1px solid var(--border); border-radius: 14px; background: var(--surface); overflow: hidden; }
    .obs-scene-h { display: flex; flex-wrap: wrap; gap: 6px 14px; align-items: center; padding: 10px 14px; border-bottom: 1px solid var(--border); background: var(--surface-2); }
    .obs-clock { font: 700 26px/1 var(--f-mono); color: var(--text); letter-spacing: .02em; }
    .obs-scene-h h4 { font: 600 16px/1.3 var(--f-brand); flex: 1 1 180px; min-width: 0; }
    .obs-desc { padding: 10px 14px 0; font-size: 14.5px; line-height: 1.55; color: var(--text-2); }
    .obs-art { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); gap: 10px; padding: 12px 14px; }
    .obs-art > * { min-width: 0; }
    .obs-col { display: grid; gap: 10px; align-content: start; min-width: 0; }
    .obs-zone { border: 1px dashed var(--border-strong); border-radius: 10px; padding: 8px 10px; display: grid; gap: 6px; align-content: start; min-width: 0; background: var(--surface); }
    .obs-zone .lbl { font: 600 10.5px/1.2 var(--f-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--text-muted); }
    .obs-shelf { display: grid; grid-template-columns: 24px minmax(0, 1fr) minmax(54px, 34%); gap: 6px; align-items: center; font-size: 13px; }
    .obs-shelf .e { font-size: 17px; line-height: 1; text-align: center; }
    .obs-bar { height: 9px; background: var(--surface-3); border-radius: 5px; overflow: hidden; }
    .obs-bar i { display: block; height: 100%; background: var(--accent); border-radius: 5px; }
    .obs-bar.low i { background: var(--warn); }
    .obs-shelf.none { color: var(--bad); }
    .obs-ppl { display: flex; flex-wrap: wrap; gap: 6px; }
    .obs-pp { display: inline-flex; align-items: center; gap: 5px; border: 1px solid var(--border); border-radius: 99px; padding: 2px 9px 2px 6px; font-size: 12.5px; background: var(--surface-2); }
    .obs-kassa { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; }
    .obs-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--ok); flex: none; }
    .obs-dot.offline { background: var(--bad); box-shadow: 0 0 0 3px var(--bad-soft); } .obs-dot.idle { background: var(--text-muted); }
    .obs-bags { display: flex; flex-wrap: wrap; gap: 4px; }
    .obs-bag { border: 1px solid var(--border-strong); border-radius: 5px 5px 9px 9px; padding: 3px 7px 2px; font: 600 11.5px/1.3 var(--f-mono); background: var(--surface-2); color: var(--text-2); }
    .obs-bag.dup { border-color: var(--warn); color: var(--warn); background: var(--warn-soft); }
    .obs-bag.floor { border-style: dashed; }
    .obs-q { display: flex; flex-wrap: wrap; gap: 1px; font-size: 15px; line-height: 1.1; }
    .obs-fx { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 14px 10px; }
    .obs-voices { display: grid; gap: 8px; padding: 0 14px 12px; }
    .obs-voice { font-size: 14px; line-height: 1.5; padding: 6px 10px; border-radius: 10px; background: var(--surface-2); border: 1px solid var(--border); }
    .obs-voice b { font-weight: 600; color: var(--text-2); }
    .obs-notes { display: grid; gap: 6px; }
    .obs-note { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 8px; align-items: start; text-align: left; border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text); border-radius: 10px; padding: 8px 10px; font-size: 14px; line-height: 1.45; width: 100%; }
    .obs-note:hover:not(:disabled) { border-color: var(--text-muted); }
    .obs-note .mk { width: 18px; height: 18px; border: 1.5px solid var(--border-strong); border-radius: 5px; margin-top: 1px; display: grid; place-items: center; font-size: 12px; line-height: 1; }
    .obs-note[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .obs-note[aria-pressed="true"] .mk { border-color: var(--accent); background: var(--accent); color: var(--accent-text); }
    .obs-note[aria-pressed="true"] .mk::after { content: "✓"; }
    .obs-note.ok { border-color: var(--ok); background: var(--ok-soft); } .obs-note.bad { border-color: var(--bad); background: var(--bad-soft); } .obs-note.warn { border-color: var(--warn); background: var(--warn-soft); }
    .obs-note:disabled { cursor: default; }
    .obs-talk { border: 1px solid color-mix(in srgb, var(--info) 40%, var(--border)); border-radius: 12px; background: var(--surface); padding: 12px; display: grid; gap: 10px; }
    .obs-talk.closed { border-style: dashed; border-color: var(--border-strong); color: var(--text-muted); font-size: 14px; }
    .obs-person { display: grid; gap: 8px; border-top: 1px solid var(--border); padding-top: 10px; }
    .obs-person:first-of-type { border-top: 0; padding-top: 0; }
    .obs-person .hd { display: flex; flex-wrap: wrap; gap: 6px 12px; align-items: center; justify-content: space-between; font-size: 13.5px; }
    .obs-qs { display: grid; gap: 6px; }
    .obs-qb { text-align: left; border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text); border-radius: 10px; padding: 7px 11px; font-size: 14px; line-height: 1.4; width: 100%; }
    .obs-qb:hover:not(:disabled) { border-color: var(--info); }
    .obs-qb:disabled { opacity: .5; cursor: default; }
    .obs-qb small { display: block; color: var(--text-muted); font-size: 12px; }
    .obs-log { display: grid; gap: 10px; }
    .obs-book { border: 1px solid var(--border); border-radius: 12px; background: var(--surface-2); padding: 12px; display: grid; gap: 8px; }
    .obs-entry { display: grid; grid-template-columns: 50px minmax(0, 1fr) auto; gap: 8px; align-items: start; font-size: 13.5px; line-height: 1.45; padding: 5px 0; border-bottom: 1px dashed var(--border); }
    .obs-entry:last-child { border-bottom: 0; }
    .obs-entry .tm { font: 600 12px/1.6 var(--f-mono); color: var(--text-muted); }
    .obs-entry.ok .tx { color: var(--ok); } .obs-entry.bad .tx { color: var(--bad); }
    .obs-entry button { border: 0; background: none; color: var(--text-muted); font-size: 15px; line-height: 1; padding: 2px 4px; }
    .obs-entry button:hover { color: var(--bad); }
    .obs-cnt { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .obs-lab { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 16px; align-items: start; }
    .obs-lab > * { min-width: 0; }
    /* практика */
    .obs-sd { display: grid; gap: 8px; }
    .obs-sdr { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.2fr) minmax(130px, .7fr); gap: 8px 10px; align-items: center; padding: 9px 10px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); }
    .obs-sdr > * { min-width: 0; }
    .obs-sdr.ok { border-color: var(--ok); } .obs-sdr.bad { border-color: var(--bad); } .obs-sdr.warn { border-color: var(--warn); }
    .obs-sdr .who { font-size: 12px; color: var(--text-muted); }
    .obs-sdr .said { font-size: 14px; line-height: 1.45; }
    .obs-sdr select { width: 100%; min-width: 0; }
    .obs-sdr .why { grid-column: 1 / -1; font-size: 13px; color: var(--text-2); }
    .obs-rw { display: grid; gap: 8px; padding: 10px 12px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); }
    .obs-rw .from { font-size: 15px; } .obs-rw .from s { color: var(--bad); }
    .obs-rw textarea { width: 100%; min-height: 64px; }
    .obs-crit { display: flex; flex-wrap: wrap; gap: 6px; }
    .obs-crit .chip { white-space: normal; }
    .obs-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 8px; }
    .obs-card { text-align: left; border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text); border-radius: 12px; padding: 10px 12px; display: grid; gap: 4px; font-size: 14px; line-height: 1.45; width: 100%; position: relative; }
    .obs-card:hover:not(:disabled) { border-color: var(--text-muted); }
    .obs-card .who { font: 600 11px/1.3 var(--f-mono); letter-spacing: .06em; text-transform: uppercase; color: var(--text-muted); }
    .obs-card.pick { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-glow); }
    .obs-card .pn { position: absolute; top: 8px; right: 10px; font: 700 12px/1 var(--f-mono); padding: 3px 7px; border-radius: 99px; color: var(--accent-text); }
    .obs-card.ok { border-color: var(--ok); } .obs-card.bad { border-color: var(--bad); }
    .obs-card:disabled { cursor: default; }
    @media (min-width: 901px) { .obs-sidecol { position: sticky; top: 72px; max-height: calc(100vh - 90px); overflow-y: auto; padding-right: 2px; } }
    @media (max-width: 900px) { .obs-lab { grid-template-columns: minmax(0, 1fr); } }
    @media (max-width: 640px) {
      .obs-cmp, .obs-art, .obs-layers { grid-template-columns: minmax(0, 1fr); }
      .obs-sdr { grid-template-columns: minmax(0, 1fr); }
      .obs-link { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .obs-clock { font-size: 22px; }
      .obs-entry { grid-template-columns: 42px minmax(0, 1fr) auto; }
    }
  </style>`);

  // ---------- общие помощники ----------
  const fresh = fn => pane => { const d = document.createElement('div'); pane.appendChild(d); fn(d); };
  const quizRef = cfg => cfg.options.map((o, i) => o.ok ? i : -1).filter(i => i >= 0);
  const pct = x => Math.round(x * 100) + ' %';
  const clamp = x => Math.max(0, Math.min(1, x));
  const PCOL = ['var(--accent)', 'var(--info)', 'var(--violet)', 'var(--warn)', 'var(--pink)', 'var(--cyan)'];

  // =====================================================================
  // Теория 1. Зачем смотреть, если можно спросить (соседний пример — пункт выдачи заказов)
  // =====================================================================
  const TAGS = {
    obvious: { t: 'очевидное', d: 'Для человека это «само собой» — он не считает нужным говорить.' },
    work: { t: 'обходной путь', d: 'Делают в обход правил или программы — и не считают это частью процесса.' },
    cond: { t: 'условия', d: 'Шум, теснота, занятые руки, очередь — то, в чём работают каждый день и перестали замечать.' },
    exc: { t: 'исключение', d: 'Что делают, когда что-то ломается. «Это же редко» — поэтому не рассказывают.' }
  };
  const PVZ_SAID = [
    'Клиент называет код получения или показывает его на телефоне',
    'Нахожу номер ячейки в программе',
    'Сканирую штрихкод посылки',
    'Отдаю посылку, клиент подтверждает на экране'
  ];
  const PVZ_SEEN = [
    { t: 'Клиент называет код получения' },
    { t: 'Оператор ищет ячейку — но крупные коробки не влезают в ячейки и стоят на полу у стены', tag: 'obvious', why: 'Оператор работает так каждый день и даже не замечает: «Ну крупные же всегда на полу».', req: 'В карточке посылки нужно место хранения «зона у стены», а не только номер ячейки.' },
    { t: 'Сканер не дотягивается до коробок на полу — номер посылки (14 цифр) вводят руками, за час — две ошибки', tag: 'cond', why: 'Для оператора это просто «неудобно», а не «процесс». На интервью он сказал «сканирую».', req: 'Поиск посылки по последним 4 цифрам или по телефону клиента.' },
    { t: 'Постоянной клиентке выдаёт по фамилии, без кода: «Я же её знаю»', tag: 'work', why: 'Так нельзя по правилам — поэтому на интервью об этом молчат.', req: 'Вопрос владельцу: допустима ли выдача постоянным без кода? Если нет — как ускорить проверку.' },
    { t: 'Клеит на монитор стикер «Иванова — заберёт вечером, не возвращать»', tag: 'work', why: 'Неформальная бронь: в программе такой функции нет, и люди придумали свою.', req: 'Отметка «клиент предупредил, заберёт позже», продлевающая срок хранения.' },
    { t: 'Программа зависла на 10 минут — оператор пишет выдачи в тетрадь, вечером переносит', tag: 'exc', why: '«Это же редко» — а за смену случилось один раз.', req: 'Выдача без связи и досылка отметок после восстановления.' },
    { t: 'Отдаёт посылку, клиент подтверждает на экране' }
  ];
  function drawPvz(pane) {
    let mode = 'said', pick = -1;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Пункт выдачи заказов маркетплейса. Аналитик сначала спросил оператора, как устроена выдача, а потом простоял у стойки вечернюю смену. Сравните.</p>
      <div class="row">${ui.seg('pm', [{ v: 'said', t: 'Как рассказал оператор' }, { v: 'seen', t: 'Что видно за смену' }], mode, 'accent')}</div>
      <div class="obs-cmp"><div class="obs-flow" data-flow></div><div data-side></div></div>
    </div>`;
    function draw() {
      const flow = TR.$('[data-flow]', pane), side = TR.$('[data-side]', pane);
      if (mode === 'said') {
        flow.innerHTML = PVZ_SAID.map((t, i) => `<div class="obs-step"><span class="n">${i + 1}</span><span>${esc(t)}</span></div>`).join('');
        side.innerHTML = ui.note('info', 'На интервью', 'Четыре аккуратных шага — так выдача устроена «по инструкции». Оператор не врёт: он честно рассказывает, как должно быть. Теперь переключитесь на смену.');
        return;
      }
      flow.innerHTML = PVZ_SEEN.map((s, i) => s.tag
        ? `<button type="button" class="obs-step hid ${s.tag}" data-pi="${i}" aria-pressed="${pick === i}"><span class="n">${i + 1}</span><span>${esc(s.t)}<span class="obs-tag ${s.tag}">${esc(TAGS[s.tag].t)}</span></span></button>`
        : `<div class="obs-step"><span class="n">${i + 1}</span><span>${esc(s.t)}</span></div>`).join('');
      const s = PVZ_SEEN[pick];
      side.innerHTML = s && s.tag
        ? `<div class="stack tight"><div class="obs-lbl">${esc(TAGS[s.tag].t)}</div>${ui.note('warn', 'Почему не рассказал', esc(s.why))}${ui.note('ok', 'Что из этого вырастет', esc(s.req))}<p class="small muted">${esc(TAGS[s.tag].d)}</p></div>`
        : ui.note('info', 'Нажмите на цветной шаг', 'На интервью было 4 шага, глазами — 7. Пять цветных — то, о чём оператор не сказал. Нажмите любой: увидите, почему он промолчал и какое требование отсюда вырастет.');
    }
    ui.onSeg(pane, (n, v) => { mode = v; pick = -1; draw(); });
    TR.on(pane, 'click', '[data-pi]', (e, b) => { pick = +b.dataset.pi; draw(); });
    draw();
  }
  const WHY4 = [
    { k: 'Очевидное', q: '«Ну это все знают»', a: '<b>Проклятие знания.</b> Опытный человек не замечает того, что делает каждый день. Оператор не скажет «крупные коробки стоят на полу» — для него это не информация. <b>Что делать:</b> смотреть и спрашивать «а что происходит между…?».' },
    { k: 'Обходной путь', q: '«Вообще так нельзя, но…»', a: 'Обход правил неловко признавать начальству и чужому человеку. А часто его и не считают частью работы: «это я так, по-человечески». <b>Что делать:</b> не осуждать — обходной путь показывает, чего не хватает в процессе.' },
    { k: 'Автоматизм', q: '«Руки сами делают»', a: 'Навык не проговаривается: человек не помнит, что локтем придерживает дверь склада, потому что руки заняты коробкой. <b>Что делать:</b> смотреть на руки и на тело, а не только слушать.' },
    { k: '«Это мелочь»', q: '«Да это же редко»', a: 'Человек не знает, что для системы это важно. Тетрадь на случай зависания — «мелочь», а для системы это целый режим работы без связи. <b>Что делать:</b> спрашивать «а что вы делаете, когда…?» и записывать исключения.' }
  ];
  function drawWhy4(pane) {
    const open = new Set();
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Четыре причины, по которым самое важное не прозвучит на интервью. Нажмите на карточку — она перевернётся.</p>
      <div class="obs-flips" data-fl></div>
      ${ui.note('info', 'Это не значит, что интервью не нужно', 'Интервью даёт цели, правила и «почему». Наблюдение даёт «как на самом деле». Хороший аналитик берёт оба: спросил — посмотрел — сверил. Расхождения между словами и делом — самое ценное, что вы принесёте со смены.')}
    </div>`;
    function draw() {
      TR.$('[data-fl]', pane).innerHTML = WHY4.map((c, i) => `<button type="button" class="obs-flip" data-fi="${i}" aria-pressed="${open.has(i)}"><span class="k">${esc(c.k)}</span>${open.has(i) ? `<span>${c.a}</span>` : `<span class="q">${esc(c.q)}</span><span class="small dim">Нажмите, чтобы перевернуть</span>`}</button>`).join('');
    }
    TR.on(pane, 'click', '[data-fi]', (e, b) => { const i = +b.dataset.fi; if (open.has(i)) open.delete(i); else open.add(i); draw(); });
    draw();
  }
  const howWhy = {
    id: 'how-why', covers: ['shift'], title: 'Как это работает: зачем смотреть, если можно спросить', free: true, noReset: true,
    simple: {
      icon: '👀',
      plain: 'Люди хорошо рассказывают, как работа устроена «по правилам», и плохо — как она идёт на самом деле. Очевидное они пропускают, обходные пути не считают работой, а мелочи забывают. Поэтому иногда надо не спрашивать, а постоять рядом и посмотреть.',
      analogy: 'Бабушка диктует рецепт пирога: «мука, яйца, сахар». А когда печёт сама — бросает щепотку соли, подливает молоко «на глаз» и ставит противень на верхнюю полку. В рецепте этого нет — это видно только на кухне.',
      tech: '<b>Наблюдение</b> (observation, job shadowing — «тень сотрудника») — техника выявления из BABOK v3: аналитик смотрит, как человек выполняет работу в его настоящей обстановке. Даёт <b>неявные требования</b>, обходные пути, условия среды и исключения; подтверждает или опровергает сказанное на интервью. Близкая техника — <b>контекстное исследование</b> (contextual inquiry, Бейер и Хольцблатт): наблюдение в паре «мастер — ученик».'
    },
    lead: ui.brief({
      situation: 'Соседний пример — пункт выдачи заказов (ПВЗ). Аналитик сначала поговорил с оператором, потом простоял у стойки вечернюю смену. Рассказ и смена отличаются.',
      todo: [
        'Вкладка «Рассказ и смена»: переключите «Как рассказал оператор» → «Что видно за смену». Нажмите на каждый цветной шаг.',
        'Вкладка «Почему не расскажут»: переверните четыре карточки.'
      ],
      look: 'Цвет шага — тип находки: фиолетовый — очевидное, жёлтый — обходной путь, синий — условия работы, красный — исключение. Справа — почему человек промолчал и какое требование из этого вырастет.'
    }),
    render(el) {
      el.classList.add('obs-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'pvz', t: 'Рассказ и смена', render: fresh(drawPvz) },
        { id: 'why', t: 'Почему не расскажут', render: fresh(drawWhy4) }
      ], 'pvz');
    }
  };

  // =====================================================================
  // Теория 2. Как наблюдать: не мешать, записывать по времени, спрашивать в паузах
  // =====================================================================
  const MOMS = [
    { t: '18:05', s: 'Очередь — 6 человек. Оператор ищет крупную коробку среди тех, что стоят на полу.', o: [
      { t: 'Молча записать: «18:05 — ищет коробку на полу, очередь 6 человек, ушло 2 минуты»', k: 'ok', d: 2, r: 'Вы ничего не изменили в работе — и у вас есть точная запись со временем и цифрами.' },
      { t: 'Спросить оператора прямо сейчас: «Почему коробки на полу?»', k: 'bad', d: -15, r: 'Оператор отвлёкся, очередь выросла до восьми, клиенты косятся на вас. Ответ получите скомканный: «Ну некуда же!»' },
      { t: 'Помочь поднять коробку', k: 'warn', d: -5, r: 'По-человечески понятно, но теперь вы видите работу «с помощником», а не как она идёт без вас.' },
      { t: 'Снять очередь на телефон — для отчёта', k: 'bad', d: -20, r: 'Клиенты не давали согласия на съёмку. Оператор напрягся: «Это для начальства?» — дальше он работает «по инструкции».' }
    ] },
    { t: '18:20', s: 'Пауза: клиентов нет. Оператор пьёт чай.', o: [
      { t: '«Я видел, что крупные коробки стоят у стены. Расскажите, как так получается?»', k: 'ok', d: 10, r: 'Вопрос о том, что вы видели, открытый и без оценки. Оператор рассказывает: ячейки рассчитаны на мелкие посылки, а крупных стало втрое больше.' },
      { t: '«Вам ведь неудобно так работать, правда?»', k: 'bad', d: -5, r: 'Наводящий вопрос: человек кивнёт, а вы так и не узнали, что именно неудобно.' },
      { t: '«Давайте предложим владельцу новый стеллаж?»', k: 'warn', d: -2, r: 'Решение раньше понимания. Может, дело не в стеллаже, а в том, что крупные посылки везут в этот пункт вместо соседнего.' }
    ] },
    { t: '18:40', s: 'Программа зависла. Оператор достаёт тетрадь.', o: [
      { t: 'Записать по шагам: что делает, сколько длилось, что потом с тетрадью', k: 'ok', d: 2, r: 'Исключение поймано: 10 минут без программы, 4 выдачи в тетради, перенос вечером.' },
      { t: 'Подсказать: «Перезагрузите, у меня так всегда помогает»', k: 'bad', d: -10, r: 'Вы вмешались и не увидели, как оператор справляется сам. А это и было самое ценное.' }
    ] },
    { t: '19:00', s: 'Постоянная клиентка: «Мне как обычно, Иванова». Оператор отдаёт посылку без кода.', o: [
      { t: 'Записать: «19:02 — выдал по фамилии без кода и без сканирования, клиентка постоянная»', k: 'ok', d: 2, r: 'Факт без оценки. Позже выясните, почему так делают и что об этом думает владелец.' },
      { t: 'Записать: «Оператор нарушает правила выдачи»', k: 'warn', d: -10, r: 'Это оценка, а не наблюдение. И опасная: если записи попадут начальству «по фамилиям», обходы от вас спрячут.' }
    ] },
    { t: '21:00', s: 'Смена закончилась.', o: [
      { t: 'Поблагодарить и пересказать: «Правильно понимаю, что крупные коробки всегда у стены, а при зависании — тетрадь?»', k: 'ok', d: 8, r: 'Проверили понимание и показали, что записываете процесс, а не ошибки людей. Оператор добавляет: «И в пятницу — вдвое больше».' },
      { t: 'Уйти молча — всё и так понятно', k: 'bad', d: -5, r: 'Часть выводов останется вашими догадками, а оператор так и не узнает, зачем вы стояли рядом.' }
    ] }
  ];
  function drawMoments(pane) {
    const pick = {};
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Вечерняя смена в ПВЗ, пять моментов. Выберите, что делаете, и посмотрите, что из этого выйдет. Шкала сверху — доверие смены: с ним вам покажут настоящую работу, без него — «работу по инструкции».</p>
      <div class="obs-trust" data-tr></div>
      <div class="stack" data-m></div>
    </div>`;
    function draw() {
      const tr = Math.max(0, Math.min(100, 50 + Object.keys(pick).reduce((s, k) => s + MOMS[k].o[pick[k]].d, 0)));
      TR.$('[data-tr]', pane).innerHTML = `<span>Доверие смены</span>${ui.meter(tr / 100, tr >= 60 ? 'ok' : tr >= 40 ? 'warn' : 'bad')}<b>${tr}</b>`;
      TR.$('[data-m]', pane).innerHTML = MOMS.map((m, i) => {
        const p = pick[i], o = p != null ? m.o[p] : null;
        return `<div class="obs-mom"><div class="row"><span class="t">${esc(m.t)}</span><span>${esc(m.s)}</span></div>
          <div class="obs-opts">${m.o.map((x, j) => `<button type="button" class="obs-opt ${p === j ? x.k : ''}" data-mi="${i}" data-mo="${j}">${esc(x.t)}</button>`).join('')}</div>
          ${o ? ui.note(o.k === 'ok' ? 'ok' : o.k === 'warn' ? 'warn' : 'bad', o.k === 'ok' ? 'Так и надо' : o.k === 'warn' ? 'С оговоркой' : 'Так не надо', esc(o.r)) : ''}</div>`;
      }).join('');
    }
    TR.on(pane, 'click', '[data-mi]', (e, b) => { pick[+b.dataset.mi] = +b.dataset.mo; draw(); });
    draw();
  }
  const LADDER = [
    { top: 'Оператор нервничает', base: 'За 5 минут трижды переспросил код у клиента и один раз уронил коробку', vers: ['Он новенький, вторая неделя', 'У стойки шумно — плохо слышно код', 'Он устал к концу смены'], ask: '«Я заметил, что код пришлось переспрашивать. Так часто бывает?»' },
    { top: 'Склад маленький', base: '12 коробок стоят на полу, свободных ячеек — ноль', vers: ['Ячеек действительно мало', 'Крупные посылки не помещаются в ячейки любого размера', 'Сегодня пятница — завал, в другие дни свободно'], ask: '«Сколько коробок обычно стоит на полу во вторник?»' },
    { top: 'Программа неудобная', base: 'Чтобы найти посылку по фамилии, оператор открыл 3 экрана и потратил 40 секунд', vers: ['Поиск по фамилии спрятан глубоко', 'Оператор не знает про быстрый поиск', 'Фамилия написана с ошибкой — поиск не находит'], ask: '«Покажете, как вы обычно ищете посылку, если клиент забыл код?»' }
  ];
  function drawLadder(pane) {
    let cur = 0, step = 0;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Лестница выводов (Крис Аргирис): мы видим факт, выбираем из него кусочек, придаём ему смысл — и вот уже вывод. В заметках наблюдателя нужно стоять на нижней ступеньке. Начните с вывода сверху и спуститесь.</p>
      <div class="row">${ui.seg('lc', LADDER.map((x, i) => ({ v: i, t: '«' + x.top + '»' })), cur, 'accent')}</div>
      <div class="obs-ladder" data-l></div>
      <div class="row"><button type="button" class="btn sm primary" data-ld>Спуститься на ступеньку ↓</button><button type="button" class="btn sm ghost" data-lr>Сначала</button></div>
      ${ui.note('info', 'Правило заметки наблюдателя', 'Кто, что сделал, когда, сколько раз или минут, дословные слова — в кавычках. Свои догадки — отдельно, с пометкой «вывод?», и проверить вопросом в паузе.')}
    </div>`;
    function draw() {
      const x = LADDER[cur];
      const rungs = [
        `<div class="obs-rung top"><span class="i">↑</span><span><span class="k">Вывод (так записывать не надо)</span>«${esc(x.top)}»</span></div>`,
        step >= 1 ? `<div class="obs-rung"><span class="i">?</span><span><span class="k">А что ещё это может значить</span>${x.vers.map(v => '• ' + esc(v)).join('<br>')}</span></div>` : '',
        step >= 2 ? `<div class="obs-rung base"><span class="i">●</span><span><span class="k">Что видно (так записывать)</span>${esc(x.base)}</span></div>` : '',
        step >= 3 ? `<div class="obs-rung q"><span class="i">💬</span><span><span class="k">Вопрос в паузе, чтобы выбрать версию</span>${esc(x.ask)}</span></div>` : ''
      ];
      TR.$('[data-l]', pane).innerHTML = rungs.join('');
      TR.$('[data-ld]', pane).disabled = step >= 3;
    }
    ui.onSeg(pane, (n, v) => { cur = +v; step = 0; draw(); });
    TR.on(pane, 'click', '[data-ld]', () => { step = Math.min(3, step + 1); draw(); });
    TR.on(pane, 'click', '[data-lr]', () => { step = 0; draw(); });
    draw();
  }
  const ETH = [
    { t: 'Договориться с владельцем и управляющим: когда прийти, сколько быть, где стоять', g: 1, d: 'Без этого вас просто не пустят за стойку — или пустят в самый неудобный момент.' },
    { t: 'Объяснить смене цель: «Смотрю на процесс, а не на вас. Никого не оцениваю»', g: 1, d: 'Люди перестают работать «на камеру» быстрее, если понимают, зачем вы здесь.' },
    { t: 'Пообещать, что записи обезличены и не уйдут начальству «по фамилиям»', g: 1, d: 'Только так вам покажут обходные пути — самое ценное.' },
    { t: 'Не снимать посетителей; фото — только мест и вещей, с разрешения', g: 1, d: 'Посетители согласия не давали. Фото стойки без людей — можно, если разрешили.' },
    { t: 'Не вмешиваться и не помогать «под руку»; вопросы — в паузах', g: 1, d: 'Иначе вы увидите работу «при аналитике», а не обычную.' },
    { t: 'Прийти «тайным покупателем», никого не предупредив', g: 0, d: 'Нечестно по отношению к смене, и вы не сможете задать ни одного вопроса в паузе.' },
    { t: 'Записывать фамилии тех, кто нарушает правила, — для отчёта владельцу', g: 0, d: 'Доверие кончится в тот же день, а обходные пути от вас спрячут навсегда.' }
  ];
  function drawEthics(pane) {
    const on = new Set();
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Что сделать до смены и во время неё. Отметьте то, что сделали бы вы, — шкала покажет, насколько смена будет вам доверять.</p>
      <div class="obs-trust" data-tr></div>
      <div class="obs-checks" data-c></div>
      ${ui.note('warn', 'Эффект наблюдателя', 'Люди, на которых смотрят, работают иначе — аккуратнее, «по инструкции» (так называемый хоторнский эффект). Помогает: прийти заранее и остаться подольше — через полчаса к вам привыкают; прийти в пик, когда «играть» некогда; держаться в стороне.')}
    </div>`;
    function draw() {
      let tr = 30; on.forEach(i => { tr += ETH[i].g ? 14 : -25; });
      tr = Math.max(0, Math.min(100, tr));
      TR.$('[data-tr]', pane).innerHTML = `<span>Доверие смены</span>${ui.meter(tr / 100, tr >= 60 ? 'ok' : tr >= 40 ? 'warn' : 'bad')}<b>${tr}</b>`;
      TR.$('[data-c]', pane).innerHTML = ETH.map((x, i) => `<label class="obs-check ${on.has(i) ? 'on' : ''} ${x.g ? 'good' : 'bad'}"><input type="checkbox" data-ei="${i}" ${on.has(i) ? 'checked' : ''}><span>${esc(x.t)}${on.has(i) ? `<small>${esc(x.d)}</small>` : ''}</span></label>`).join('');
    }
    pane.addEventListener('change', e => { const c = e.target.closest('[data-ei]'); if (!c) return; const i = +c.dataset.ei; if (c.checked) on.add(i); else on.delete(i); draw(); });
    draw();
  }
  const howHow = {
    id: 'how-how', covers: ['interp', 'saydo'], title: 'Как это работает: не мешать, записывать по времени, спрашивать в паузах', free: true, noReset: true,
    simple: {
      icon: '📝',
      plain: 'На смене вы — тень: стоите в стороне, не помогаете и не отвлекаете. Записываете не впечатления, а факты: кто, что сделал, во сколько, сколько раз. Вопросы копите и задаёте, когда спадёт поток. И заранее договариваетесь со сменой: смотрите на процесс, а не на людей.',
      analogy: 'Как стажёр на кухне ресторана в первый день: шеф разрешил постоять у плиты, но в запаре под руку не лезут. Записываешь «соус на 3-й минуте, огонь убавил дважды», а не «шеф нервный». Спросить «почему убавил?» можно, когда разойдутся заказы.',
      tech: 'BABOK v3 различает <b>активное</b> наблюдение (аналитик задаёт вопросы по ходу, может просить показать) и <b>пассивное</b> (не вмешивается, вопросы — после). Заметки — по времени, с цифрами и дословными цитатами; выводы отделяют от фактов (<b>лестница выводов</b>, Крис Аргирис). Учитывают <b>эффект наблюдателя</b> (люди при свидетелях работают «по инструкции»). Этика: согласие, обезличенные записи, без съёмки посетителей. Опора — PRACTICES.md §2.4.'
    },
    lead: ui.brief({
      situation: 'Снова пункт выдачи заказов, вечерняя смена. Три вкладки: что делать в моменте, как записывать и как договориться со сменой.',
      todo: [
        '«Смена ПВЗ: пять моментов»: в каждом выберите действие и прочитайте последствия. Следите за шкалой доверия.',
        '«Лестница выводов»: для каждого вывода нажимайте «Спуститься на ступеньку», пока не дойдёте до вопроса в паузе.',
        '«Этика»: отметьте, что сделали бы до и во время смены.'
      ],
      look: 'Зелёное — так и надо, жёлтое — с оговоркой, красное — так не надо. На лестнице верх — вывод (красный), низ — наблюдение (зелёный): в заметках стоим внизу.'
    }),
    render(el) {
      el.classList.add('obs-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'mom', t: 'Смена ПВЗ: пять моментов', render: fresh(drawMoments) },
        { id: 'lad', t: 'Лестница выводов', render: fresh(drawLadder) },
        { id: 'eth', t: 'Этика', render: fresh(drawEthics) }
      ], 'mom');
    }
  };

  // =====================================================================
  // Теория 3. Что делать с увиденным: требования и противоречия
  // =====================================================================
  const CHAINS = [
    { v: 'floor', t: 'Коробки на полу', s: [
      ['Наблюдение', '18:05 — 12 коробок у стены, сканер не дотягивается, номер вводят руками; за час — 2 ошибки ввода'],
      ['Потребность', 'Быстро и без ошибок найти посылку, даже если она не в ячейке'],
      ['Требование', 'Поиск посылки по последним 4 цифрам номера или по телефону клиента; в карточке — место хранения «зона у стены»'],
      ['Кому и как проверить', 'Дизайнеру — экран поиска; тестировщику — критерий «посылку вне ячейки находят меньше чем за 10 секунд»']
    ] },
    { v: 'note', t: 'Стикер «заберёт вечером»', s: [
      ['Наблюдение', '19:10 — на мониторе стикер «Иванова — заберёт вечером, не возвращать»; таких стикеров три'],
      ['Потребность', 'Придержать посылку для клиента, который предупредил, что задержится'],
      ['Требование', 'Отметка «клиент предупредил» продлевает срок хранения на сутки — это бизнес-правило, его утверждает владелец'],
      ['Кому и как проверить', 'Владельцу — решение о правиле; разработчику — отметка и срок; тестировщику — «на 8-й день с отметкой посылка не уходит на возврат»']
    ] },
    { v: 'hang', t: 'Тетрадь при зависании', s: [
      ['Наблюдение', '18:40–18:50 — программа зависла, 4 выдачи записаны в тетрадь, вечером перенесены вручную'],
      ['Потребность', 'Выдавать посылки, даже когда нет связи, и ничего не потерять'],
      ['Требование', 'Выдача без связи: список посылок смены хранится на устройстве, отметки о выдаче досылаются после восстановления'],
      ['Кому и как проверить', 'Тимлиду — это нефункциональное требование к надёжности; тестировщику — сценарий «обрыв связи на 15 минут»']
    ] }
  ];
  function drawChain(pane) {
    let cur = 'floor', step = 0;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Заметка наблюдателя — ещё не требование. Между ними — вопрос «зачем люди так делают?». Выберите заметку из ПВЗ и пройдите цепочку.</p>
      <div class="row">${ui.seg('ch', CHAINS.map(c => ({ v: c.v, t: c.t })), cur, 'accent')}</div>
      <div class="obs-chain" data-c></div>
      <div class="row"><button type="button" class="btn sm primary" data-cn>Дальше →</button><button type="button" class="btn sm ghost" data-cr>Сначала</button></div>
      <div data-cnote></div>
    </div>`;
    function draw() {
      const c = CHAINS.find(x => x.v === cur);
      TR.$('[data-c]', pane).innerHTML = c.s.map((r, i) => `<div class="obs-link s${i} ${i > step ? 'fut' : ''}"><span class="k">${esc(r[0])}</span><span>${i > step ? '…' : esc(r[1])}</span></div>`).join('');
      TR.$('[data-cn]', pane).disabled = step >= 3;
      TR.$('[data-cnote]', pane).innerHTML = step >= 3 ? ui.note('ok', 'Не забудьте источник', 'Рядом с требованием пишут, откуда оно: «наблюдение, ПВЗ, пятница, 18:05». Это трассируемость: через месяц кто-нибудь спросит «а кто это придумал?» — и вы покажете запись.') : '';
    }
    ui.onSeg(pane, (n, v) => { cur = v; step = 0; draw(); });
    TR.on(pane, 'click', '[data-cn]', () => { step = Math.min(3, step + 1); draw(); });
    TR.on(pane, 'click', '[data-cr]', () => { step = 0; draw(); });
    draw();
  }
  const LAYERS = [{ v: 'pos', t: '1. Позиции' }, { v: 'int', t: '2. Интересы' }, { v: 'var', t: '3. Варианты' }, { v: 'who', t: '4. Кто решает' }];
  function drawLayers(pane) {
    let cur = 'pos';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">На смене выяснилось: оператор и владелец ПВЗ хотят противоположного. Пройдите по слоям слева направо.</p>
      <div class="row">${ui.seg('ly', LAYERS, cur, 'accent')}</div>
      <div data-ly></div>
    </div>`;
    function draw() {
      const k = LAYERS.findIndex(l => l.v === cur);
      const sideA = `<div class="obs-side"><h4>Оператор</h4><div class="pos">«Вечером нужен второй человек»</div>${k >= 1 ? '<div class="int">Интерес: очередь не дольше 10 минут, не выслушивать жалобы, успевать разбирать поставку</div>' : ''}</div>`;
      const sideB = `<div class="obs-side"><h4>Владелец</h4><div class="pos">«Второго оператора не дам»</div>${k >= 1 ? '<div class="int">Интерес: фонд оплаты труда, точка должна окупаться</div>' : ''}</div>`;
      let h = `<div class="obs-layers">${sideA}${sideB}</div>`;
      if (k === 0) h += ui.note('warn', 'Тупик', 'Позиция — то, что человек решил. Позиции противоположны: «нужен» против «не дам». Если спорить позициями, кто-то проиграет. Перейдите к интересам.');
      if (k === 1) h += ui.note('info', 'Интересы не противоречат друг другу', 'Позиция — что человек решил, интерес — почему он так решил. Короткая очередь и окупаемость могут жить вместе. Значит, есть варианты.');
      if (k >= 2) h += `<div class="obs-varis">
        <div class="obs-vari"><span>Быстрый поиск посылки и предсортировка днём</span>${ui.status('дёшево', 'ok')}<small>Снимает 2–3 минуты с каждой крупной выдачи; второй человек не нужен</small></div>
        <div class="obs-vari"><span>Второй оператор только в пятницу с 18:00 до 20:00</span>${ui.status('средне', 'warn')}<small>8 часов в месяц вместо 80</small></div>
        <div class="obs-vari"><span>Постамат для мелких посылок у входа</span>${ui.status('дорого', 'bad')}<small>Разгружает очередь, но стоит денег и места</small></div></div>`;
      if (k === 3) h += ui.note('ok', 'Решает владелец — аналитик готовит', 'Аналитик не выбирает победителя и не прячет спор. Он записывает обе позиции, выясняет интересы, приносит варианты с ценой и последствиями и выносит на решение тому, кто вправе решать, — здесь владельцу. Решение фиксирует в протоколе и в требованиях.');
      TR.$('[data-ly]', pane).innerHTML = h;
    }
    ui.onSeg(pane, (n, v) => { cur = v; draw(); });
    draw();
  }
  const howUse = {
    id: 'how-use', covers: ['toreq', 'conflict'], title: 'Как это работает: от заметки к требованию, от спора к решению', free: true, noReset: true,
    simple: {
      icon: '🧩',
      plain: 'Заметка «кассир ищет пакет» — ещё не требование. Сначала понимаем, зачем люди так делают, потом пишем, что должна уметь система, и указываем, откуда это взялось. А если два человека хотят противоположного — это не ошибка, а находка: аналитик выясняет, почему каждый этого хочет, готовит варианты с ценой и отдаёт решение тому, кто вправе решать.',
      analogy: 'Повар просит новую плиту, хозяйка говорит «денег нет». Спорить «плита или нет» бесполезно. Повару нужно успевать к обеду, хозяйке — не влезть в долги. Вариант: заготовки с вечера, вторая конфорка напрокат на выходные. Выбирает хозяйка, но уже из вариантов, а не из «да» или «нет».',
      tech: 'Цепочка «наблюдение → потребность → требование → проверка» с указанием источника — основа <b>трассируемости</b> (ISO/IEC/IEEE 29148). Противоречия между заинтересованными лицами разбирают по Фишеру и Юри («Переговоры без поражения»): отделять людей от проблемы, обсуждать <b>интересы, а не позиции</b>, придумывать варианты до выбора, опираться на объективные критерии. Решение — за владельцем продукта; аналитик готовит варианты и фиксирует итог.'
    },
    lead: ui.brief({
      situation: 'Пункт выдачи заказов: три заметки со смены и один спор — оператор просит второго человека на вечер, владелец не даёт.',
      todo: [
        '«От заметки к требованию»: выберите заметку и нажимайте «Дальше», пока не дойдёте до проверки.',
        '«Противоречие»: переключайте слои 1 → 4 и смотрите, что появляется на каждом.'
      ],
      look: 'В цепочке четыре звена: фиолетовое — наблюдение, жёлтое — потребность, зелёное — требование, синее — кому и как проверить. В противоречии варианты появляются только на слое интересов — не раньше.'
    }),
    render(el) {
      el.classList.add('obs-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'chain', t: 'От заметки к требованию', render: fresh(drawChain) },
        { id: 'lay', t: 'Противоречие', render: fresh(drawLayers) }
      ], 'chain');
    }
  };

  // =====================================================================
  // Практика 1. Главная лаборатория: утренняя смена на Покровке 06:00–11:30
  // =====================================================================
  const OBS_F = ['F-obs-verbal', 'F-obs-hands', 'F-obs-shelf', 'F-obs-names', 'F-obs-modem', 'F-obs-second', 'F-obs-paper'];
  const OBS_FLAG = ['F-obs-verbal', 'F-obs-hands', 'F-obs-shelf'];
  const TALK_F = ['F-stock', 'F-staff', 'F-peak', 'F-net', 'F-hold', 'F-batch', 'F-shift', 'F-plan', 'F-weather', 'F-1c', 'F-54fz', 'F-refund'];
  const TALK_FLAG = ['F-stock', 'F-peak', 'F-hold', 'F-batch', 'F-plan', 'F-54fz'];
  const TALK_NEED = 9;
  // короткие подписи фактов — свои, чтобы check не зависел от реестра
  const FL = {
    'F-obs-verbal': '«отложи мне» — предзаказ уже есть', 'F-obs-hands': 'руки в перчатках, шум — крупные кнопки', 'F-obs-shelf': 'нет места под заказы — пакеты под прилавком',
    'F-obs-names': 'пакеты по именам путают — нужен код', 'F-obs-modem': 'касса уходит в офлайн', 'F-obs-second': 'пустая витрина до 11:00 — временно', 'F-obs-paper': 'списания забывают записать',
    'F-stock': 'остатки никто не ведёт', 'F-staff': '2 кассира, обучение 1 день', 'F-peak': 'пик 07:30–09:00, очередь 8–12', 'F-net': 'модем, обрывы 10–15 минут', 'F-hold': 'держим 30 минут после интервала',
    'F-batch': 'круассаны не раньше 07:30', 'F-shift': 'цех с 03:00, развоз 06:30 и 11:00', 'F-plan': 'план в 23:00 «на глаз»', 'F-weather': 'погода меняет спрос',
    'F-1c': 'сводка в 1С к 09:00, сейчас 2 ч руками', 'F-54fz': '54-ФЗ: чек «предоплата» и чек полного расчёта', 'F-refund': 'возврат на карту за 3 дня'
  };
  const TOPIC_OF = { 'F-stock': 'Пекарни и остатки', 'F-staff': 'Пекарни и остатки', 'F-net': 'Пекарни и остатки', 'F-peak': 'Предзаказ', 'F-hold': 'Предзаказ', 'F-batch': 'Производство', 'F-shift': 'Производство', 'F-plan': 'Производство', 'F-weather': 'Производство', 'F-1c': 'Деньги и учёт', 'F-54fz': 'Деньги и учёт', 'F-refund': 'Деньги и учёт' };

  const Q = {
    'p1-stock': { who: 'pavel', q: 'Как вы вечером понимаете, сколько чего осталось на витрине?', f: ['F-stock'] },
    'p1-staff': { who: 'pavel', q: 'Как вы учите новых кассиров? Сколько на это уходит?', f: ['F-staff'] },
    'p1-paper': { who: 'pavel', q: 'Я видел, что вчерашнее ушло в приют. Как это потом записывают?', f: ['F-obs-paper'] },
    'p1-lead': { who: 'pavel', q: 'Вам ведь давно нужна программа для учёта, да?', bad: 1, a: 'Ну… нужна, наверное. Всем нужна.', why: 'Наводящий вопрос: человек кивнёт из вежливости, а вы ничего не узнали.' },
    'g1-batch': { who: 'galya', q: 'Во сколько круассаны обычно появляются на Покровке?', f: ['F-batch'] },
    'g1-shift': { who: 'galya', q: 'Как устроен развоз: сколько машин и рейсов за утро?', f: ['F-shift'] },
    'g1-plan': { who: 'galya', q: 'Как вы решаете, сколько чего печь на завтра?', f: ['F-plan'] },
    'g1-promise': { who: 'galya', q: 'Если клиент закажет круассан к 07:05 — привезёте?', bad: 1, a: 'К семи ноль пяти? Ничего я вам сейчас обещать не буду. Машины грузим, некогда.', why: 'Обещание внутри вопроса, да ещё в самый неудобный момент.' },
    'p2-peak': { who: 'pavel', q: 'Расскажите про последний раз, когда очередь стала совсем длинной: во сколько, сколько человек?', f: ['F-peak'] },
    'p2-net': { who: 'pavel', q: 'В 08:20 касса осталась без связи. Так часто бывает? Что вы тогда делаете?', f: ['F-net'] },
    'p2-hold': { who: 'pavel', q: 'Что вы делаете, если человек не пришёл за отложенным?', f: ['F-hold'] },
    'p2-staff': { who: 'pavel', q: 'Как вы учите новых кассиров?', f: ['F-staff'] },
    'p2-shelf': { who: 'pavel', q: 'В пик Света несколько раз искала пакеты под прилавком. Куда можно было бы ставить заказы?', f: ['F-obs-shelf'] },
    'p2-button': { who: 'pavel', q: 'Сделать вам большую кнопку «Выдать заказ»?', bad: 1, a: 'Не знаю. Покажете — скажу. Вы сначала разберитесь, как у нас всё устроено.', why: 'Решение внутри вопроса: обсуждаете кнопку, не узнав, что мешает.' },
    'p2-db': { who: 'pavel', q: 'Какую базу данных лучше взять для заказов?', bad: 1, a: 'Это вы у меня спрашиваете? Я управляющий, а не программист.', why: 'Вопрос не по адресу: это работа команды, а не управляющего.' },
    'o-1c': { who: 'oleg', q: 'Как вы сейчас сводите продажи точек за день?', f: ['F-1c'] },
    'o-54': { who: 'oleg', q: 'Какие чеки нужны по закону, если покупатель платит заранее?', f: ['F-54fz'] },
    'o-refund': { who: 'oleg', q: 'Как сейчас делаете возврат, если покупатель отказался?', f: ['F-refund'] },
    'o-pay': { who: 'oleg', q: 'Какая оплата заказов удобнее вам для сверки — и почему?', pos: 1, a: 'Только онлайн. Наличные на месте — это опять ручная сверка по каждой точке. Нина Сергеевна, знаю, со мной не согласна.', why: 'Фактов нет, зато есть позиция Олега Петровича — пригодится, когда будете разбирать противоречия.' },
    'o-lead': { who: 'oleg', q: 'Вы же не против, если оплата будет только картой?', bad: 1, a: 'Я только за. Но это вы Нину Сергеевну спросите.', why: 'Наводящий вопрос: вы подсказали ответ.' },
    'g2-weather': { who: 'galya', q: 'Почему сегодня утром десертов меньше, чем обычно?', f: ['F-weather'] },
    'g2-plan': { who: 'galya', q: 'Как вы решаете, сколько чего печь на завтра?', f: ['F-plan'] },
    'g2-batch': { who: 'galya', q: 'Во сколько круассаны обычно появляются на Покровке?', f: ['F-batch'] },
    'g2-shift': { who: 'galya', q: 'Сколько машин и рейсов развоза за утро?', f: ['F-shift'] },
    'g2-recook': { who: 'galya', q: 'Можно, чтобы цех допекал заказы в течение дня?', bad: 1, a: 'Второй раз за день печь не будем. Что заказали до вечера — в план, остальное — с витрины.', why: 'Решение внутри вопроса. Сначала узнайте, как цех планирует, — потом обсуждайте, что можно поменять.' }
  };
  const PAUSE = {
    p1: { hint: 'До открытия у Павла пять минут — на два вопроса.', people: [{ who: 'pavel', max: 2, qs: ['p1-stock', 'p1-staff', 'p1-paper', 'p1-lead'] }] },
    g1: { hint: 'Галина Ивановна на громкой связи, грузят машины — на два вопроса.', people: [{ who: 'galya', max: 2, qs: ['g1-batch', 'g1-shift', 'g1-plan', 'g1-promise'] }] },
    p2: { hint: 'Пик спал. Павел — на три вопроса, Олег Петрович по телефону — на два.', people: [{ who: 'pavel', max: 3, qs: ['p2-peak', 'p2-net', 'p2-hold', 'p2-staff', 'p2-shelf', 'p2-button', 'p2-db'] }, { who: 'oleg', max: 2, qs: ['o-1c', 'o-54', 'o-refund', 'o-pay', 'o-lead'] }] },
    g2: { hint: 'Галина Ивановна звонит узнать, что осталось к обеду, — на два вопроса.', people: [{ who: 'galya', max: 2, qs: ['g2-weather', 'g2-plan', 'g2-batch', 'g2-shift', 'g2-recook'] }] }
  };
  const B = (t, o) => Object.assign({ t }, o || {});
  const SC = [
    { t: '06:00', title: 'За час до открытия', kassa: 'idle', vit: null, q: 0, bags: [], fx: ['🌧 на улице дождь', '🧺 вчерашние лотки — к выходу'],
      desc: 'Павел открывает заднюю дверь. Света и новенькая кассирша (вторая неделя в «Колосе») включают кофемашину и кассу. Павел выносит вчерашнее и вписывает что-то в журнал списаний.',
      voices: [{ p: 'pavel', t: 'Проходите. Только к витрине не вставайте — в семь открываемся. Вчерашнее сейчас уйдёт в приют.' }],
      notes: [
        { id: 'n-paper', k: 'key', f: 'F-obs-paper', t: '06:10 — в пакет для приюта ушли 9 батонов и 6 багетов. В журнале списаний за вчера 5 строк, багетов среди них нет' },
        { id: 'n-start', k: 'ok', t: '06:05 — кассиры включили кофемашину и кассу, Павел пересчитал размен' },
        { id: 'i-sloppy', k: 'interp', t: 'Павел небрежно относится к учёту списаний' }
      ], talk: 'p1' },
    { t: '06:30', title: 'Звонок из цеха', kassa: 'on', vit: null, q: 0, bags: [], fx: ['📞 громкая связь с цехом'],
      desc: 'У Павла звонит телефон — Галина Ивановна. Павел включает громкую связь и кивает вам: можно спросить, пока грузят машины.',
      voices: [{ p: 'galya', t: 'Павел, машины вышли. Круассаны — вторым рейсом, как обычно.' }],
      notes: [
        { id: 'n-call', k: 'ok', t: '06:31 — технолог по телефону: круассаны приедут вторым рейсом' },
        { id: 'i-ceh', k: 'interp', t: 'Цех не успевает — плохо организован' }
      ], talk: 'g1' },
    { t: '06:55', title: 'Приехала машина', kassa: 'on', vit: { b: 3, c: 0, r: 2, d: 2 }, q: 0, bags: [], fx: ['🚚 первая машина'],
      desc: 'Водитель заносит лотки: хлеб, батоны, булочки, бородинский, немного десертов. Кассиры в перчатках раскладывают всё на витрине и сразу встают к кассам.',
      notes: [
        { id: 'n-truck', k: 'ok', t: '06:55 — привезли хлеб, булочки и бородинский; круассанов в машине нет' },
        { id: 'n-flour', k: 'key', f: 'F-obs-hands', t: '06:58 — кассиры выкладывают хлеб в перчатках, перчатки в муке; к кассе встают, не снимая их' },
        { id: 'i-slowlay', k: 'interp', t: 'Выкладка идёт слишком медленно' }
      ] },
    { t: '07:05', title: 'Открылись', kassa: 'on', vit: { b: 3, c: 0, r: 2, d: 2 }, q: 3, bags: [B('Лена'), B('Ира')],
      desc: 'Первые покупатели. Хлеб есть, круассанов нет. Света достаёт из-под прилавка два пакета, отложенных вчера по телефону, и убирает обратно.',
      voices: [{ n: 'Покупатель', t: 'А круассаны есть?' }, { n: 'Света, кассир', t: 'Минут через пятнадцать будут!' }],
      notes: [
        { id: 'n-nocro', k: 'ok', t: '07:05 и 07:12 — двое спросили круассаны: один взял хлеб, второй ушёл без покупки' },
        { id: 'i-angry', k: 'interp', t: 'Покупатели недовольны ассортиментом' },
        { id: 's-timer', k: 'sol', t: 'Нужно показывать в приложении, когда привезут круассаны' }
      ] },
    { t: '07:20', title: 'Круассаны', kassa: 'on', vit: { b: 3, c: 4, r: 2, d: 2 }, q: 6, bags: [B('Лена'), B('Ира'), B('Лена', { dup: 1 })], fx: ['🚚 второй рейс: круассаны'],
      desc: 'Вторым рейсом приехал лоток круассанов. Света выкладывает их, очередь растёт. Новенькая принимает звонок и подписывает ещё один пакет.',
      notes: [
        { id: 'n-cro', k: 'ok', t: '07:20 — привезли первый лоток круассанов' },
        { id: 'i-few', k: 'interp', t: 'Круассанов привозят мало' }
      ] },
    { t: '07:40', title: 'Пик', busy: 1, kassa: 'on', vit: { b: 2, c: 3, r: 2, d: 2 }, q: 11, bags: [B('Лена', { dup: 1 }), B('Ира'), B('Лена', { dup: 1 }), B('Сергей Н.')],
      desc: 'Очередь — 11 человек, у кофемашины шумно. За десять минут Света четыре раза наклоняется под прилавок: ищет пакеты с отложенными заказами. Новенькая на второй кассе пробивает, не снимая перчаток.',
      voices: [{ n: 'Света, кассир', t: 'Сейчас-сейчас, где-то тут был ваш пакет…' }, { n: 'Покупатель из очереди', t: 'Девушка, мне только кофе!' }],
      notes: [
        { id: 'n-shelf', k: 'key', f: 'F-obs-shelf', t: '07:40–07:50 — Света 4 раза наклонялась под прилавок искать пакет с заказом; очередь в это время ждала' },
        { id: 'n-touch', k: 'key', f: 'F-obs-hands', t: '07:46 — новенькая дважды промахнулась по мелкой кнопке на экране кассы в перчатке, потом сняла перчатку' },
        { id: 'n-noise', k: 'key', f: 'F-obs-hands', t: '07:48 — у кофемашины громко: кассир дважды переспросила заказ' },
        { id: 'i-fuss', k: 'interp', t: 'Кассир суетится и работает медленно' },
        { id: 'i-kassa', k: 'interp', t: 'Касса неудобная' },
        { id: 's-person', k: 'sol', t: 'В пик нужен отдельный человек на выдачу заказов' }
      ],
      acts: [
        { id: 'a-ask', k: 'viol', t: 'Спросить Свету прямо сейчас, где лежат заказы', r: { p: 'pavel', t: 'Не сейчас! Видите — очередь. Потом.' }, why: 'Вопрос в пик отвлекает кассира: очередь стоит, а вы видите уже не обычную работу, а работу «при аналитике».' },
        { id: 'a-film', k: 'viol', t: 'Снять очередь на телефон — для отчёта', r: { p: 'ksenia', t: 'Уберите телефон: покупатели не давали согласия на съёмку. Фото — только мест и вещей, без людей и с разрешения Павла.' }, why: 'Съёмка людей без согласия — нарушение этики наблюдения (и 152-ФЗ о персональных данных).' },
        { id: 'a-ok', k: 'ok', t: 'Молча записать время и что видно', r: { p: 'ksenia', t: 'Правильно. Вопросы — в паузе, когда спадёт очередь.' } }
      ] },
    { t: '08:10', title: '«Отложи мне бородинский»', busy: 1, kassa: 'on', vit: { b: 2, c: 2, r: 1, d: 2 }, q: 9, bags: [B('Лена', { dup: 1 }), B('Ира'), B('Лена', { dup: 1 }), B('Сергей Н.'), B('Анна П.')],
      desc: 'К кассе подходит Анна Павловна. Света подписывает маркером пакет, кладёт туда буханку и убирает под прилавок. Денег не берёт.',
      voices: [{ p: 'anna', t: 'Светочка, отложи мне, пожалуйста, бородинский на вечер, я после работы зайду.' }, { n: 'Света, кассир', t: 'Конечно, Анна Павловна!' }],
      notes: [
        { id: 'n-verbal', k: 'key', f: 'F-obs-verbal', t: '08:10 — постоянная покупательница попросила отложить бородинский на вечер; кассир подписала пакет и убрала под прилавок, оплаты не было' },
        { id: 'i-kind', k: 'interp', t: 'Кассиры по-дружески относятся к постоянным покупателям' },
        { id: 's-elder', k: 'sol', t: 'Пожилым нужна отдельная простая версия приложения' }
      ] },
    { t: '08:20', title: 'Модем', busy: 1, kassa: 'offline', vit: { b: 2, c: 2, r: 1, d: 2 }, q: 8, bags: [B('Лена', { dup: 1 }), B('Ира'), B('Лена', { dup: 1 }), B('Сергей Н.'), B('Анна П.')],
      desc: 'На экране кассы — «Нет связи». Света переводит кассу в офлайн-режим, продажи идут, чеки копятся. В 08:32 связь возвращается, и чеки уходят сами.',
      voices: [{ n: 'Света, кассир', t: 'Опять модем! Ничего, пробиваю офлайн — потом сами уйдут.' }],
      notes: [
        { id: 'n-modem', k: 'key', f: 'F-obs-modem', t: '08:20–08:32 — касса без связи 12 минут; кассир перевела её в офлайн-режим, продажи шли, после 08:32 чеки ушли сами' },
        { id: 'i-net', k: 'interp', t: 'Интернет в пекарне плохой' },
        { id: 's-wire', k: 'sol', t: 'Нужно провести проводной интернет' }
      ] },
    { t: '08:40', title: 'Три Лены', busy: 1, kassa: 'on', vit: { b: 1, c: 1, r: 1, d: 1 }, q: 7, bags: [B('Лена', { dup: 1 }), B('Ира'), B('Лена', { dup: 1 }), B('Сергей Н.'), B('Анна П.'), B('Лена', { dup: 1, floor: 1 }), B('Ольга', { floor: 1 })],
      desc: 'За заказом пришла Лена. Под прилавком семь пакетов, три подписаны «Лена». Света открывает два, чтобы понять, какой отдать.',
      voices: [{ n: 'Покупательница', t: 'Я Лена, у меня два круассана и багет.' }, { n: 'Света, кассир', t: 'Лена… Лена… Секунду.' }],
      notes: [
        { id: 'n-names', k: 'key', f: 'F-obs-names', t: '08:40 — под прилавком три пакета с надписью «Лена»; кассир открыла два, чтобы понять, какой отдать' },
        { id: 'n-floor', k: 'key', f: 'F-obs-shelf', t: '08:42 — под прилавком семь пакетов, два стоят на полу у ног кассира' },
        { id: 'i-lena', k: 'interp', t: 'Покупательница Лена раздражена' }
      ] },
    { t: '09:15', title: 'Пик спал', kassa: 'on', vit: { b: 1, c: 1, r: 1, d: 1 }, q: 1, bags: [B('Ира'), B('Лена'), B('Сергей Н.'), B('Анна П.'), B('Ольга', { floor: 1 })], fx: ['☕ Павел с кофе', '📞 звонит Олег Петрович'],
      desc: 'Очередь рассосалась. Павел наливает себе кофе. Звонит Олег Петрович — ему нужна вчерашняя выручка. Павел протягивает вам трубку: «Поговорите, вы же хотели».',
      notes: [
        { id: 'n-calm', k: 'ok', t: '09:10 — в очереди 1–2 человека, новенькая ушла раскладывать десерты' }
      ], talk: 'p2' },
    { t: '10:30', title: 'Пустая витрина', kassa: 'on', vit: { b: 1, c: 0, r: 1, d: 1 }, q: 2, bags: [B('Ира'), B('Сергей Н.'), B('Анна П.'), B('Ольга')],
      desc: 'Круассанов и багетов на витрине нет. Покупатель спрашивает багет — Света отвечает: «После одиннадцати привезут».',
      voices: [{ n: 'Покупатель', t: 'Багетов нет? Жаль.' }],
      notes: [
        { id: 'n-empty', k: 'ok', t: '10:30 — на витрине нет круассанов и багетов; покупателям отвечают «после одиннадцати привезут»' },
        { id: 'i-more', k: 'interp', t: 'Выпечки не хватает — цеху надо печь больше' }
      ] },
    { t: '11:10', title: 'Второй развоз', kassa: 'on', vit: { b: 4, c: 4, r: 2, d: 3 }, q: 3, bags: [B('Ира'), B('Сергей Н.'), B('Анна П.'), B('Ольга')], fx: ['🚚 вторая машина', '📞 цех на связи'],
      desc: 'Пришла вторая машина. К 11:15 круассаны и багеты снова на витрине. Павел сверяет накладную. Звонит Галина Ивановна — узнать, что осталось к обеду.',
      notes: [
        { id: 'n-second', k: 'key', f: 'F-obs-second', t: '11:05 — вторая машина; к 11:15 круассаны и багеты снова на витрине: пустота в 10:30 была временной' },
        { id: 'n-invoice', k: 'ok', t: '11:10 — Павел сверяет накладную с привезённым' }
      ], talk: 'g2' },
    { t: '11:30', title: 'Конец наблюдения', kassa: 'on', vit: { b: 4, c: 3, r: 2, d: 3 }, q: 2, bags: [B('Ира'), B('Сергей Н.'), B('Анна П.'), B('Ольга')], end: 1,
      desc: 'Ксения смотрит на часы: «Пора. Сядем в кафе напротив и разберём блокнот: что из этого — факты для проекта».', notes: [] }
  ];
  SC.forEach((s, i) => { s.i = i; (s.notes || []).forEach(n => { n.sc = i; }); });
  const NOTES_ALL = SC.reduce((a, s) => a.concat(s.notes || []), []);
  const ACTS_ALL = SC.reduce((a, s) => a.concat(s.acts || []), []);
  const OBS_HINT = {
    'F-obs-paper': 'До открытия сравните, что уносят в приют, и что записано в журнале списаний.',
    'F-obs-hands': 'Что на руках у кассиров? Как они попадают по экрану и слышат ли покупателя?',
    'F-obs-shelf': 'В пик смотрите не на очередь, а на руки кассира: куда она тянется и сколько раз?',
    'F-obs-verbal': 'Что происходило у кассы около 08:10? Покупательница о чём-то попросила — и это уже процесс, которого нет ни в одной программе.',
    'F-obs-modem': 'Что случилось с кассой в 08:20 и как кассир выкрутилась?',
    'F-obs-names': 'Как подписаны пакеты под прилавком и что делает кассир, когда приходит Лена?',
    'F-obs-second': 'В 10:30 витрина пустая. Перемотайте дальше: так и осталось?'
  };

  function labEval(ans) {
    const a = ans || {}, notes = new Set(a.notes || []), acts = new Set(a.acts || []);
    const obsGot = new Set(), talkGot = new Set(), interp = [], sol = [], bad = [];
    let okN = 0;
    NOTES_ALL.forEach(n => {
      if (!notes.has(n.id)) return;
      if (n.k === 'key') obsGot.add(n.f); else if (n.k === 'ok') okN++; else if (n.k === 'interp') interp.push(n); else if (n.k === 'sol') sol.push(n);
    });
    (a.asked || []).forEach(id => {
      const q = Q[id]; if (!q) return;
      if (q.bad) bad.push(q);
      (q.f || []).forEach(f => { if (OBS_F.includes(f)) obsGot.add(f); else if (TALK_F.includes(f)) talkGot.add(f); });
    });
    const viol = ACTS_ALL.filter(x => acts.has(x.id) && x.k === 'viol');
    const obsCov = obsGot.size / OBS_F.length, talkCov = Math.min(1, talkGot.size / TALK_NEED);
    const flagObs = OBS_FLAG.filter(f => obsGot.has(f)).length, flagTalk = TALK_FLAG.filter(f => talkGot.has(f)).length;
    const score = clamp(0.6 * obsCov + 0.4 * talkCov - 0.06 * (interp.length + sol.length) - 0.1 * viol.length - 0.03 * bad.length);
    return { obsGot, talkGot, interp, sol, bad, viol, okN, obsCov, talkCov, flagObs, flagTalk, score };
  }
  const usedIn = (a, p) => (a.asked || []).filter(id => p.qs.includes(id)).length;

  function shiftRef() {
    const keyRows = NOTES_ALL.filter(n => n.k === 'key').map(n => [esc(SC[n.sc].t), esc(n.t), `<span class="fchip">${esc(FL[n.f])}</span>`]);
    const qRows = [];
    Object.keys(PAUSE).forEach(pid => PAUSE[pid].people.forEach(p => p.qs.forEach(id => {
      const q = Q[id]; if (!q.f || !q.f.length || !REF_ASK.includes(id)) return;
      qRows.push([esc(SC.find(s => s.talk === pid).t), esc(TR.PEOPLE[q.who].name), esc(q.q), q.f.map(f => `<span class="fchip">${esc(FL[f])}</span>`).join(' ')]);
    })));
    return `<div class="stack">
      <div class="obs-lbl">Что записать в блокнот (наблюдения, из которых растут требования)</div>
      ${ui.table(['Время', 'Заметка', 'Факт'], keyRows)}
      <p class="small muted">Ещё верные, но «фоновые» заметки: приезд машин, звонок цеха, двое без круассанов в 07:05, пустая витрина в 10:30, сверка накладной. Их записывать полезно — они дают картину утра.</p>
      <div class="obs-lbl">Что спросить в паузах (один из лучших наборов)</div>
      ${ui.table(['Пауза', 'Кому', 'Вопрос', 'Факт'], qRows)}
      ${ui.note('info', 'Чего не делать', 'Не записывать выводы («суетится», «неудобная», «плохой интернет») и решения («нужна полка», «провести интернет»). Не спрашивать кассира в пик и не снимать очередь. Не задавать наводящих вопросов и вопросов не по адресу.')}
    </div>`;
  }
  const REF_ASK = ['p1-stock', 'p1-staff', 'g1-batch', 'g1-plan', 'p2-peak', 'p2-net', 'p2-hold', 'o-54', 'o-1c', 'g2-weather', 'g2-shift'];

  function sceneArt(s) {
    const SH = [{ k: 'b', e: '🥖', t: 'Хлеб и багеты' }, { k: 'c', e: '🥐', t: 'Круассаны' }, { k: 'r', e: '🍞', t: 'Бородинский' }, { k: 'd', e: '🍰', t: 'Десерты' }];
    const vit = s.vit
      ? SH.map(x => { const v = s.vit[x.k] || 0; return `<div class="obs-shelf ${v ? '' : 'none'}"><span class="e" aria-hidden="true">${x.e}</span><span>${esc(x.t)}${v ? '' : ' — <b>нет</b>'}</span><span class="obs-bar ${v <= 1 ? 'low' : ''}"><i style="width:${v * 25}%"></i></span></div>`; }).join('')
      : '<div class="small dim">Пусто: ждём первую машину из цеха.</div>';
    const kassa = s.kassa === 'idle' ? '<span class="obs-kassa"><i class="obs-dot idle"></i>Касса выключена</span>'
      : s.kassa === 'offline' ? '<span class="obs-kassa" style="color:var(--bad)"><i class="obs-dot offline"></i>«КассаПро»: нет связи — офлайн</span>'
      : '<span class="obs-kassa"><i class="obs-dot"></i>«КассаПро»: на связи</span>';
    const bags = s.bags.length ? s.bags.map(b => `<span class="obs-bag ${b.dup ? 'dup' : ''} ${b.floor ? 'floor' : ''}" title="${b.floor ? 'на полу' : 'под прилавком'}">🛍 ${esc(b.t)}</span>`).join('') : '<span class="small dim">пусто</span>';
    const fl = s.bags.filter(b => b.floor).length;
    const queue = s.q ? `<div class="obs-q" aria-hidden="true">${'🧍'.repeat(Math.min(12, s.q))}</div><span class="small"><b>${s.q}</b> ${TR.plural(s.q, 'человек', 'человека', 'человек')}</span>` : '<span class="small dim">никого</span>';
    return `<div class="obs-art">
      <div class="obs-col"><div class="obs-zone"><span class="lbl">Витрина</span>${vit}</div>
        <div class="obs-zone"><span class="lbl">Очередь</span>${queue}</div></div>
      <div class="obs-col"><div class="obs-zone"><span class="lbl">Прилавок</span><div class="obs-ppl"><span class="obs-pp">👨 Павел</span><span class="obs-pp">👩 Света · касса 1</span><span class="obs-pp">👩 новенькая · касса 2</span></div>${kassa}</div>
        <div class="obs-zone"><span class="lbl">Под прилавком${fl ? ` · ${fl} на полу` : ''}</span><div class="obs-bags">${bags}</div></div></div>
    </div>`;
  }
  const voiceHTML = v => v.p ? ui.say(v.p, esc(v.t)) : `<div class="obs-voice"><b>${esc(v.n)}:</b> «${esc(v.t)}»</div>`;

  const shiftTask = {
    id: 'shift', title: 'Лаборатория: смена на Покровке с 06:00 до 11:30',
    simple: howWhy.simple,
    lead: ui.brief({
      situation: 'Четверг, 22 октября, 06:00. Вы с Ксенией на Покровке — самой загруженной пекарне «Колоса». Павел разрешил постоять у прилавка до второго развоза. Смену предупредили: вы смотрите на процесс, а не на людей. Утренний пик — с 07:30 до 09:00.',
      todo: [
        'Перематывайте смену: кнопки «← Раньше» и «Дальше →», ползунок или время в ленте. В каждой сцене — пекарня, реплики и варианты заметок.',
        'В блоке «Заметки наблюдателя» отметьте то, что стоит записать в блокнот. Записывайте наблюдения — не выводы и не решения.',
        'Где у времени в ленте синяя точка — пауза: можно спросить Павла, Галину Ивановну или Олега Петровича. Вопросов в паузе мало — выбирайте.',
        'В 11:30 нажмите «Разобрать блокнот с Ксенией», затем «Проверить». Засчитывается от 75 %, если записаны три самых важных наблюдения и из разговоров есть хотя бы 4 критичных факта.'
      ],
      look: 'Рядом со сценой (на телефоне — ниже) — ваш блокнот по времени и счётчики. Наблюдение — это кто, что сделал, когда, сколько раз; «суетится», «неудобно» — выводы, «нужна полка» — решение. Вмешательство в работу и съёмка покупателей снижают оценку. Факты из разговоров сразу уходят в блокнот проекта (кнопка «Блокнот» вверху).'
    }),
    blank: () => ({ sc: 0, notes: [], acts: [], asked: [] }),
    reference: () => ({ sc: SC.length - 1, notes: NOTES_ALL.filter(n => n.k === 'key' || n.k === 'ok').map(n => n.id), acts: ['a-ok'], asked: REF_ASK.slice(), debrief: true }),
    render(el, ctx) {
      el.classList.add('obs-root');
      const a = ctx.ans; a.notes = a.notes || []; a.acts = a.acts || []; a.asked = a.asked || []; if (a.sc == null) a.sc = 0;
      if (ctx.readonly) { el.innerHTML = shiftRef(); return; }
      const judged = ctx.result ? labEval(a) : null;
      const unlockNotes = () => NOTES_ALL.forEach(n => { if (n.k === 'key' && a.notes.includes(n.id)) TR.facts.unlock(n.f, 'ask'); });
      if (a.debrief || ctx.result) unlockNotes();
      el.innerHTML = `<div class="stack">
        <div class="obs-tl"><button type="button" class="btn sm" data-go="-1">← Раньше</button><input type="range" min="0" max="${SC.length - 1}" step="1" value="${a.sc}" data-rng aria-label="Время смены"><button type="button" class="btn sm" data-go="1">Дальше →</button></div>
        <div class="obs-times" data-times></div>
        <div class="obs-lab"><div class="stack" data-main></div><div class="stack obs-sidecol" data-side></div></div>
      </div>`;
      const go = i => { a.sc = Math.max(0, Math.min(SC.length - 1, i)); ctx.save(); TR.$('[data-rng]', el).value = a.sc; drawTimes(); drawMain(); };
      function drawTimes() {
        TR.$('[data-times]', el).innerHTML = SC.map((s, i) => { const has = (s.notes || []).some(n => a.notes.includes(n.id)); return `<button type="button" class="obs-time ${s.talk ? 'talk' : ''} ${has ? 'has' : ''}" data-ti="${i}" aria-pressed="${a.sc === i}" title="${esc(s.title)}${s.talk ? ' · пауза для вопросов' : ''}">${esc(s.t)}</button>`; }).join('');
      }
      function talkHTML(s) {
        if (!s.talk) return `<div class="obs-talk closed">${s.busy ? '⏳ Идёт пик — сейчас не до разговоров. Запишите вопрос и задайте его в паузе.' : s.end ? 'Смена для вас закончилась — вопросы, если остались, теперь только письмом.' : 'Пауз для разговора сейчас нет — смотрите и записывайте.'}</div>`;
        const P = PAUSE[s.talk];
        return `<div class="obs-talk"><div class="row between"><span class="obs-lbl">Пауза: можно спросить</span><span class="small dim">${esc(P.hint)}</span></div>
          ${P.people.map(p => {
            const used = usedIn(a, p), left = p.max - used;
            const log = a.asked.filter(id => p.qs.includes(id)).map(id => {
              const q = Q[id], ans = q.a || (TR.FACTS[q.f[0]] && TR.FACTS[q.f[0]].answer) || '';
              const chips = (q.f || []).map(f => `<span class="fchip ${TR.FACTS[f] && TR.FACTS[f].flag ? 'flag' : ''}">в блокнот: ${esc(FL[f] || f)}</span>`).join(' ');
              return ui.say('me', esc(q.q), { noWho: true }) + ui.say(q.who, esc(ans) + (chips ? `<div class="facts-row" style="margin-top:6px">${chips}</div>` : '') + (q.bad || q.pos ? `<div class="small dim" style="margin-top:6px">${esc(q.why)}</div>` : ''));
            }).join('');
            return `<div class="obs-person"><div class="hd"><b>${esc(TR.PEOPLE[p.who].name)}${p.who === 'galya' || p.who === 'oleg' ? ' · по телефону' : ''}</b><span class="small ${left ? '' : 'dim'}">${left ? `вопросов осталось: ${left} из ${p.max}` : 'время на вопросы вышло'}</span></div>
              ${log ? `<div class="obs-log">${log}</div>` : ''}
              ${left ? `<div class="obs-qs">${p.qs.filter(id => !a.asked.includes(id)).map(id => { const known = (Q[id].f || []).some(f => a.asked.some(x => (Q[x].f || []).includes(f))); return `<button type="button" class="obs-qb" data-q="${id}">${esc(Q[id].q)}${known ? '<small>это уже выяснили в другой паузе</small>' : ''}</button>`; }).join('')}</div>` : ''}</div>`;
          }).join('')}</div>`;
      }
      function drawMain() {
        const s = SC[a.sc];
        const marks = id => { if (!judged || !a.notes.includes(id)) return ''; const n = NOTES_ALL.find(x => x.id === id); return n.k === 'key' || n.k === 'ok' ? 'ok' : 'bad'; };
        const acted = (s.acts || []).filter(x => a.acts.includes(x.id));
        TR.$('[data-main]', el).innerHTML = `<div class="obs-scene">
            <div class="obs-scene-h"><span class="obs-clock">${esc(s.t)}</span><h4>${esc(s.title)}</h4>${s.busy ? ui.status('пик', 'warn') : s.talk ? ui.status('пауза', 'ok') : ''}</div>
            <div class="obs-desc">${esc(s.desc)}</div>
            ${sceneArt(s)}
            ${s.fx && s.fx.length ? `<div class="obs-fx">${s.fx.map(x => `<span class="chip">${esc(x)}</span>`).join('')}</div>` : ''}
            ${s.voices && s.voices.length ? `<div class="obs-voices">${s.voices.map(voiceHTML).join('')}</div>` : ''}
          </div>
          ${s.notes.length ? `<div class="stack tight"><div class="obs-lbl">Заметки наблюдателя — что записать в блокнот</div><div class="obs-notes">${s.notes.map(n => `<button type="button" class="obs-note ${marks(n.id)}" data-n="${n.id}" aria-pressed="${a.notes.includes(n.id)}"><span class="mk"></span><span>${esc(n.t)}</span></button>`).join('')}</div></div>` : ''}
          ${s.acts ? `<div class="stack tight"><div class="obs-lbl">Что делаете прямо сейчас?</div><div class="obs-opts">${s.acts.map(x => `<button type="button" class="obs-opt ${a.acts.includes(x.id) ? (x.k === 'ok' ? 'ok' : 'bad') : ''}" data-act="${x.id}" ${a.acts.includes(x.id) ? 'disabled' : ''}>${esc(x.t)}</button>`).join('')}</div>${acted.map(x => ui.say(x.r.p, esc(x.r.t))).join('')}</div>` : ''}
          ${talkHTML(s)}
          ${s.end ? endHTML() : ''}`;
      }
      function endHTML() {
        if (!a.debrief) return `<div class="row"><button type="button" class="btn primary" data-deb>Разобрать блокнот с Ксенией</button><span class="small dim">Записанные наблюдения превратятся в факты блокнота проекта.</span></div>`;
        const ev = labEval(a);
        const got = OBS_F.filter(f => ev.obsGot.has(f));
        return `<div class="stack tight">${ui.say('ksenia', got.length ? `Из вашего блокнота в блокнот проекта уходят ${got.length} ${TR.plural(got.length, 'наблюдение', 'наблюдения', 'наблюдений')} — о них никто не сказал бы на интервью. ${ev.interp.length + ev.sol.length ? 'А некоторые записи — пока выводы или решения: на проверке посмотрим, какие.' : 'Выводов вместо наблюдений я не вижу — хорошо.'}` : 'Пока в блокноте нет наблюдений, из которых вырастут требования. Перемотайте смену и посмотрите внимательнее: руки кассира, пакеты, касса, витрина.')}
          ${got.length ? `<div class="facts-row">${got.map(f => `<span class="fchip ${OBS_FLAG.includes(f) ? 'flag' : ''}">${esc(FL[f])}</span>`).join('')}</div>` : ''}</div>`;
      }
      function drawSide() {
        const ev = labEval(a);
        const list = NOTES_ALL.filter(n => a.notes.includes(n.id)).sort((x, y) => x.sc - y.sc);
        const talk = TALK_F.filter(f => ev.talkGot.has(f));
        TR.$('[data-side]', el).innerHTML = `<div class="obs-cnt">
            <div class="stat"><span class="k">Записей</span><span class="v">${list.length}</span></div>
            <div class="stat"><span class="k">Фактов из бесед</span><span class="v">${talk.length}</span></div>
            <div class="stat"><span class="k">Вопросов мимо</span><span class="v ${ev.bad.length ? 'warn' : ''}">${ev.bad.length}</span></div>
            <div class="stat"><span class="k">Нарушений</span><span class="v ${ev.viol.length ? 'bad' : ''}">${ev.viol.length}</span></div>
          </div>
          <div class="obs-book"><div class="obs-lbl">Блокнот наблюдателя</div>
            ${list.length ? list.map(n => `<div class="obs-entry ${judged ? (n.k === 'key' || n.k === 'ok' ? 'ok' : 'bad') : ''}"><span class="tm">${esc(SC[n.sc].t)}</span><span class="tx">${esc(n.t)}</span><button type="button" data-rm="${n.id}" aria-label="Вычеркнуть" title="Вычеркнуть">×</button></div>`).join('') : '<p class="small dim">Пока пусто. Отмечайте заметки в сценах — они появятся здесь по времени.</p>'}
          </div>
          <div class="stack tight"><div class="obs-lbl">Из разговоров в паузах</div>${talk.length ? `<div class="facts-row">${talk.map(f => `<span class="fchip ${TALK_FLAG.includes(f) ? 'flag' : ''}">${esc(FL[f])}</span>`).join('')}</div>` : '<p class="small dim">Паузы — в 06:00, 06:30, 09:15 и 11:10 (синие точки в ленте).</p>'}</div>`;
      }
      function drawAll() { drawTimes(); drawMain(); drawSide(); }
      TR.$('[data-rng]', el).addEventListener('input', e => go(+e.target.value));
      TR.on(el, 'click', '[data-go]', (e, b) => go(a.sc + (+b.dataset.go)));
      TR.on(el, 'click', '[data-ti]', (e, b) => go(+b.dataset.ti));
      TR.on(el, 'click', '[data-n]', (e, b) => {
        const id = b.dataset.n;
        a.notes = a.notes.includes(id) ? a.notes.filter(x => x !== id) : a.notes.concat(id);
        ctx.save(); ctx.decide('Смена: записей в блокноте', a.notes.length); drawTimes(); drawMain(); drawSide();
      });
      TR.on(el, 'click', '[data-rm]', (e, b) => { a.notes = a.notes.filter(x => x !== b.dataset.rm); ctx.save(); drawAll(); });
      TR.on(el, 'click', '[data-act]', (e, b) => {
        const x = ACTS_ALL.find(y => y.id === b.dataset.act); if (!x || a.acts.includes(x.id)) return;
        a.acts = a.acts.concat(x.id); if (x.k === 'viol') TR.score(-2, 0, 'наблюдение: ' + x.t);
        ctx.save(); drawMain(); drawSide();
      });
      TR.on(el, 'click', '[data-q]', (e, b) => {
        const id = b.dataset.q, q = Q[id]; if (!q || a.asked.includes(id)) return;
        const P = PAUSE[SC[a.sc].talk]; const p = P && P.people.find(x => x.qs.includes(id)); if (!p || usedIn(a, p) >= p.max) return;
        a.asked = a.asked.concat(id);
        if (q.bad) TR.score(-2, 0, 'вопрос мимо: ' + q.q);
        (q.f || []).forEach(f => { if (TR.facts.unlock(f, 'ask')) TR.score(TR.FACTS[f] && TR.FACTS[f].flag ? 1 : 0, 5, null); });
        ctx.save(); ctx.decide('Смена: вопросы в паузах', a.asked.map(x => Q[x].q).join(' | ')); drawMain(); drawSide();
      });
      TR.on(el, 'click', '[data-deb]', () => { a.debrief = true; unlockNotes(); ctx.save(); drawMain(); drawSide(); });
      drawAll();
    },
    check(ans) {
      const ev = labEval(ans), notes = [];
      OBS_F.forEach(f => {
        if (ev.obsGot.has(f)) notes.push({ ok: true, html: `Наблюдение: ${esc(FL[f])}${OBS_FLAG.includes(f) ? ' ⚑' : ''}.` });
        else notes.push({ ok: OBS_FLAG.includes(f) ? false : 'warn', html: `Не замечено${OBS_FLAG.includes(f) ? ' важное' : ''}: ${esc(OBS_HINT[f])}` });
      });
      if (ev.interp.length) notes.push({ ok: false, html: `Выводы вместо наблюдений (${ev.interp.length}): ${ev.interp.slice(0, 2).map(n => '«' + esc(n.t) + '»').join(', ')}${ev.interp.length > 2 ? '…' : ''}. Что именно вы видели — кто, что сделал, когда, сколько раз?` });
      if (ev.sol.length) notes.push({ ok: false, html: `Решения вместо наблюдений (${ev.sol.length}): ${ev.sol.slice(0, 2).map(n => '«' + esc(n.t) + '»').join(', ')}. Решения появятся потом — на смене записываем то, что видно.` });
      if (ev.viol.length) notes.push({ ok: false, html: `Нарушений правил наблюдения: ${ev.viol.length}. ${ev.viol.map(x => esc(x.why)).join(' ')}` });
      const missT = TALK_F.filter(f => !ev.talkGot.has(f)), missTopics = Array.from(new Set(missT.map(f => TOPIC_OF[f])));
      notes.push({ ok: ev.flagTalk >= 4 ? (ev.talkGot.size >= TALK_NEED ? true : 'warn') : false, html: `Из разговоров в паузах: ${ev.talkGot.size} ${TR.plural(ev.talkGot.size, 'факт', 'факта', 'фактов')} из ${TALK_F.length}, критичных — ${ev.flagTalk} из ${TALK_FLAG.length}.${missTopics.length && ev.talkGot.size < TALK_NEED ? ' Где выяснено не всё: ' + missTopics.map(esc).join(', ') + '. Вопросы о конкретном прошлом («расскажите про последний раз…») работают лучше, чем «как обычно».' : ''}` });
      if (ev.bad.length) notes.push({ ok: 'warn', html: `Вопросов мимо: ${ev.bad.length} — наводящие, с решением внутри или не по адресу. Каждый съел драгоценную минуту паузы.` });
      const ok = ev.score >= 0.75 && ev.flagObs === OBS_FLAG.length && ev.flagTalk >= 4;
      return {
        ok, score: ev.score, notes,
        summary: `Наблюдений, из которых растут требования: ${ev.obsGot.size} из ${OBS_F.length}. Фактов из бесед: ${ev.talkGot.size}. Выводов и решений в блокноте: ${ev.interp.length + ev.sol.length}. Нарушений: ${ev.viol.length}.`,
        mentor: ev.viol.length ? 'Вмешательство и съёмка стоят дороже, чем кажется: смена перестанет показывать вам настоящую работу. Вопросы — в паузах, фото — только мест, с разрешения.'
          : ok ? 'Видите, сколько всего вы узнали, ничего не спросив? «Отложи мне бородинский», три «Лены», пакеты на полу, касса без связи — Нина об этом не знает, а Павел не считает важным. Это и есть неявные требования.'
          : ev.flagObs < OBS_FLAG.length ? 'Посмотрите на смену глазами кассира: что у неё в руках, куда она тянется, о чём её просят. Самое важное происходит не у витрины, а за прилавком.' : null
      };
    },
    explain: `${ui.table(['Время', 'Наблюдение', 'Что из него вырастет'], [
        ['06:10', 'в приют ушло 15 штук, в журнале — 5 строк', 'учёт списаний в планшете при закрытии (БЦ-1, списания 12 % → 7 %)'],
        ['06:58 · 07:46 · 07:48', 'перчатки в муке, промахи по кнопкам, шум', 'экран кассира: крупные кнопки, без набора текста'],
        ['07:40 · 08:42', '4 раза под прилавок за 10 минут, пакеты на полу', 'место хранения заказа и подсказка «где лежит»'],
        ['08:10', '«отложи мне бородинский» — без оплаты', 'предзаказ уже существует: кассир оформляет заказ за покупателя'],
        ['08:20', 'касса без связи 12 минут, офлайн', 'выдача заказов без связи, досылка'],
        ['08:40', 'три пакета «Лена»', 'короткий код заказа вместо имени'],
        ['10:30 → 11:15', 'пустая витрина, потом снова полная', '«будет после 11:00» вместо «нет в наличии»']
      ])}
      <p><b>Почему так.</b> Ни одно из этих наблюдений не прозвучало бы на интервью: для Павла и Светы это обычное утро. Неявные требования видны только на месте — в шуме, в перчатках, в очереди из 11 человек (PRACTICES.md §2.4).</p>
      <p><b>Если иначе.</b> Запишете «кассир суетится» — дизайнеру нечего с этим делать. Запишете «4 раза за 10 минут под прилавок» — у Сони появится задача «место хранения и поиск заказа». Спросите кассира в пик — увидите работу «при аналитике». Снимете очередь — нарушите права покупателей.</p>
      <p><b>Разговоры в паузах</b> закрывают то, что глазами не увидеть: план выпечки в 23:00, развоз, 54-ФЗ, сводку в 1С. Лучше всего работают вопросы о том, что вы только что видели, и о конкретном прошлом. Источники: BABOK v3 — техника «Наблюдение»; PRACTICES.md §1.5 и §2.4.</p>`,
    report: ans => {
      const a = ans || {}, ev = labEval(a);
      const list = NOTES_ALL.filter(n => (a.notes || []).includes(n.id)).sort((x, y) => x.sc - y.sc);
      return `Записано в блокнот: ${list.length} (наблюдений-фактов ${ev.obsGot.size} из ${OBS_F.length}, выводов ${ev.interp.length}, решений ${ev.sol.length})\n`
        + list.map(n => `- ${SC[n.sc].t} — ${n.t} ${n.k === 'key' || n.k === 'ok' ? '✓' : '✗'}`).join('\n')
        + `\nВопросы в паузах:\n` + ((a.asked || []).map(id => `- ${TR.PEOPLE[Q[id].who].name}: ${Q[id].q}${Q[id].bad ? ' ✗ мимо' : ''}`).join('\n') || '—')
        + `\nНарушения: ${ev.viol.map(x => x.t).join('; ') || 'нет'}`;
    }
  };

  // =====================================================================
  // Практика 2. Наблюдение или вывод: раскладка + мини-редактор
  // =====================================================================
  const IB = [
    { id: 'obs', t: 'Наблюдение', sub: 'что видно и слышно: кто, что сделал, когда, сколько раз, дословные слова' },
    { id: 'int', t: 'Вывод или оценка', sub: 'как вы это поняли: «медленно», «неудобно», «нервничает»' },
    { id: 'sol', t: 'Решение', sub: 'что сделать: кнопка, полка, касса' }
  ];
  const II = [
    { id: 'i1', t: '07:52 — кассир дважды переспросила заказ: у кофемашины громко', ok: 'obs' },
    { id: 'i2', t: 'За 10 минут пика трое спросили, есть ли круассаны', ok: 'obs' },
    { id: 'i3', t: 'В журнале списаний за вторник 4 строки, за понедельник — ни одной', ok: 'obs' },
    { id: 'i4', t: 'Павел за утро дважды звонил в цех узнать, где машина', ok: 'obs' },
    { id: 'i5', t: 'Покупатель в очереди сказал: «Я тут каждый день, а очередь всё та же»', ok: 'obs' },
    { id: 'i6', t: 'Кассиры перегружены', ok: 'int' },
    { id: 'i7', t: 'Покупатели нервничают в очереди', ok: 'int' },
    { id: 'i8', t: 'Экран кассы неудобный', ok: 'int' },
    { id: 'i9', t: 'Павел не доверяет цеху', ok: 'int' },
    { id: 'i10', t: 'Нужна отдельная касса для выдачи заказов', ok: 'sol' },
    { id: 'i11', t: 'Сделать в приложении таймер очереди', ok: 'sol' },
    { id: 'i12', t: 'Поставить полку для заказов у входа', ok: 'sol' }
  ];
  const IHINT = {
    obs: 'Здесь есть время, число или дословные слова? Это можно проверить, если стоять рядом? Даже если в цитате звучит оценка — записать её дословно и есть наблюдение.',
    int: 'Это можно увидеть глазами — или это ваше объяснение увиденному? Что конкретно должен был сделать человек, чтобы вы так решили?',
    sol: 'Это описание того, что происходит, — или уже предложение, что сделать?'
  };
  const RW = [
    { id: 'r1', from: 'Кассир суетится', ctx: 'Вы стояли у кассы в пик, с 07:40 до 07:50.', ph: '07:40–07:50 — кассир…', ex: '07:40–07:50 — кассир 4 раза наклонялась под прилавок искать пакет с заказом, очередь в это время ждала' },
    { id: 'r2', from: 'Покупатели злятся из-за очереди', ctx: 'Вы смотрели на очередь с 08:00 до 08:10.', ph: '08:00–08:10 — …', ex: '08:00–08:10 — двое ушли из очереди без покупки, один сказал: «Опять десять человек»' }
  ];
  const EVAL = ['суетит', 'суета', 'медленн', 'неудобн', 'плох', 'нерв', 'злит', 'злят', 'злой', 'злая', 'злые', 'раздраж', 'хаос', 'бардак', 'тормоз', 'долго', 'быстро', 'устал', 'перегруж', 'неорганиз', 'ужас', 'кошмар', 'недовол', 'груб', 'неумел', 'растерян', 'неаккуратн', 'небрежн'];
  const COUNTW = ['один', 'одна', 'одно', 'одного', 'одну', 'два', 'две', 'двое', 'три', 'трое', 'четыре', 'четверо', 'пять', 'пятеро', 'шесть', 'семь', 'восемь', 'девять', 'десять', 'дважды', 'трижды', 'четырежды'];
  function rwEval(text) {
    const raw = String(text || '').trim(), n = TR.norm(raw);
    const long = raw.length >= 25;
    const time = /\d{1,2}[:.]\d{2}/.test(raw) || /минут|секунд|час/.test(n);
    const rest = raw.replace(/\d{1,2}[:.]\d{2}/g, ' ');
    const num = /\d/.test(rest) || n.split(' ').some(w => COUNTW.includes(w));
    const evalW = EVAL.filter(w => n.includes(w));
    const noEval = !evalW.length && raw.length > 0;
    const score = long ? ((time ? 1 : 0) + (num ? 1 : 0) + (noEval ? 1 : 0)) / 3 : 0;
    return { long, time, num, noEval, evalW, score };
  }
  function interpEval(ans) {
    const v = (ans && ans.v) || {}, r = (ans && ans.rw) || {};
    const rows = II.map(x => ({ x, g: v[x.id], s: !v[x.id] ? 'empty' : v[x.id] === x.ok ? 'ok' : 'bad' }));
    const part = rows.filter(q => q.s === 'ok').length / II.length;
    const rws = RW.map(w => ({ w, e: rwEval(r[w.id]) }));
    const rw = rws.reduce((s, q) => s + q.e.score, 0) / RW.length;
    return { rows, part, rws, rw, score: part * 0.7 + rw * 0.3 };
  }
  const critChips = e => `<span class="chip ${e.time ? 'ok' : ''}">${e.time ? '✓' : '○'} есть время</span><span class="chip ${e.num ? 'ok' : ''}">${e.num ? '✓' : '○'} есть число: сколько раз, человек, минут</span><span class="chip ${e.noEval ? 'ok' : e.evalW.length ? 'bad' : ''}">${e.noEval ? '✓ без оценок' : e.evalW.length ? '✗ оценка: «' + esc(e.evalW[0]) + '…»' : '○ без оценок'}</span><span class="chip ${e.long ? 'ok' : ''}">${e.long ? '✓' : '○'} от 25 символов</span>`;
  const interpTask = {
    id: 'interp', title: 'Наблюдение или вывод?',
    simple: howHow.simple,
    lead: ui.brief({
      situation: 'В среду Игорь заходил на Покровку за кофе и между делом прислал в чат проекта двенадцать «наблюдений». Ксения: «Половина — не наблюдения. Разберите, а два вывода перепишите так, чтобы Соня могла с ними работать».',
      todo: [
        'Шаг 1: разложите 12 записей Игоря по трём корзинам — нажмите карточку, потом корзину (на компьютере можно перетаскивать).',
        'Шаг 2: перепишите два вывода в наблюдения. Пишите то, что можно было увидеть или услышать: время, кто, что сделал, сколько раз, дословные слова. Под полем видно, каких признаков не хватает.',
        'Нажмите «Проверить». Засчитывается от 80 %: раскладка — 70 % оценки, переписанные заметки — 30 %.'
      ],
      look: 'Простая проверка: можно ли это сфотографировать или записать на диктофон? Если да — наблюдение. Если это объяснение увиденного — вывод. Если это «что сделать» — решение. Признаки под полем проверяются автоматически по словам — это подсказка, а не приговор.'
    }),
    blank: () => ({ v: {}, rw: {} }),
    reference: () => ({ v: Object.fromEntries(II.map(x => [x.id, x.ok])), rw: Object.fromEntries(RW.map(w => [w.id, w.ex])) }),
    render(el, ctx) {
      el.classList.add('obs-root');
      const a = ctx.ans; a.v = a.v || {}; a.rw = a.rw || {};
      let reveal = null;
      if (ctx.result) { reveal = {}; interpEval(a).rows.forEach(r => { if (r.g) reveal[r.x.id] = r.s; }); }
      el.innerHTML = `<div class="stack">
        <div class="obs-lbl">Шаг 1 · Записи Игоря</div><div data-s></div>
        <div class="obs-lbl">Шаг 2 · Перепишите вывод в наблюдение</div>
        <div class="stack" data-rw></div>
      </div>`;
      ui.sort(TR.$('[data-s]', el), { items: II.map(x => ({ id: x.id, t: esc(x.t) })), buckets: IB, value: a.v, reveal, readonly: ctx.readonly, seed: 'obs-interp', onChange: v => { a.v = v; ctx.save(); } });
      TR.$('[data-rw]', el).innerHTML = RW.map(w => `<div class="obs-rw"><div class="from">Было: <s>${esc(w.from)}</s></div><div class="small muted">${esc(w.ctx)}</div>
        <textarea data-rw="${w.id}" placeholder="${esc(w.ph)}" ${ctx.readonly ? 'readonly' : ''} aria-label="Наблюдение вместо «${esc(w.from)}»">${esc(a.rw[w.id] || '')}</textarea>
        <div class="obs-crit" data-cr="${w.id}">${critChips(rwEval(a.rw[w.id]))}</div></div>`).join('');
      el.addEventListener('input', e => {
        const t = e.target.closest('textarea[data-rw]'); if (!t || ctx.readonly) return;
        a.rw[t.dataset.rw] = t.value; ctx.save();
        TR.$(`[data-cr="${t.dataset.rw}"]`, el).innerHTML = critChips(rwEval(t.value));
      });
    },
    check(ans) {
      const ev = interpEval(ans), notes = [];
      const empty = ev.rows.filter(r => r.s === 'empty').length;
      if (empty) notes.push({ ok: false, html: `Не разложено ${empty} из ${II.length}.` });
      ev.rows.filter(r => r.s === 'bad').forEach(r => notes.push({ ok: false, html: `«${esc(r.x.t)}» — ${IHINT[r.x.ok]}` }));
      ev.rws.forEach(q => {
        const e = q.e;
        if (!e.long) { notes.push({ ok: false, html: ((ans || {}).rw || {})[q.w.id] ? `«${esc(q.w.from)}»: чуть подробнее — от 25 символов: кто, что сделал, когда, сколько раз.` : `«${esc(q.w.from)}»: перепишите своими словами — хотя бы одно предложение.` }); return; }
        const miss = [];
        if (!e.time) miss.push('когда это было (время или «за сколько минут»)');
        if (!e.num) miss.push('сколько раз или сколько человек');
        if (!e.noEval) miss.push(`без оценки — слово «${esc(e.evalW[0])}…» снова вывод`);
        notes.push(miss.length ? { ok: 'warn', html: `«${esc(q.w.from)}»: не хватает — ${miss.join('; ')}.` } : { ok: true, html: `«${esc(q.w.from)}» переписано в наблюдение.` });
      });
      const ok = ev.score >= 0.8;
      return {
        ok, score: ev.score, notes,
        summary: `Раскладка: ${ev.rows.filter(r => r.s === 'ok').length} из ${II.length}. Переписанные заметки: ${pct(ev.rw)}.`,
        mentor: ev.rows.some(r => r.x.id === 'i5' && r.s === 'bad') ? 'Цитата покупателя — наблюдение, даже если в ней звучит его оценка. Вы не делаете вывод, вы дословно записываете, что он сказал.' : ok ? 'Теперь у Сони есть с чем работать: «4 раза за 10 минут под прилавок» — это задача для экрана. «Кассир суетится» — нет.' : null
      };
    },
    explain: `${ui.table(['Корзина', 'Записи'], [
        ['Наблюдение', 'переспросила дважды; трое спросили круассаны; журнал за понедельник пуст; Павел дважды звонил в цех; дословная фраза покупателя'],
        ['Вывод или оценка', 'кассиры перегружены; покупатели нервничают; экран неудобный; Павел не доверяет цеху'],
        ['Решение', 'отдельная касса для выдачи; таймер очереди; полка у входа']
      ])}
      <p><b>Почему это важно.</b> Вывод нельзя проверить и нельзя передать дальше: «экран неудобный» — для кого, чем, когда? Наблюдение можно: «07:46 — дважды промахнулась по кнопке в перчатке». Из него дизайнер сделает крупные кнопки, а Лера — проверку. Решения на смене вредны вдвойне: «полка у входа» закрывает разговор раньше, чем вы поняли, что мешает (а на Покровке полку ставить некуда).</p>
      <p><b>Как переписывать.</b> Спуститесь по лестнице выводов: что именно человек сделал, во сколько, сколько раз, что сказал дословно. Например: «07:40–07:50 — кассир 4 раза наклонялась под прилавок искать пакет, очередь ждала». Свою догадку можно оставить — с пометкой «вывод?» и вопросом в паузе. Источник: лестница выводов Криса Аргириса; PRACTICES.md §1.5, §2.4.</p>`,
    report: ans => { const ev = interpEval(ans); return ev.rows.map(r => `- ${r.x.t} → ${(IB.find(b => b.id === r.g) || { t: '—' }).t} ${r.s === 'ok' ? '✓' : '✗'}`).join('\n') + '\n' + ev.rws.map(q => `Переписано «${q.w.from}»: ${((ans || {}).rw || {})[q.w.id] || '—'} (${pct(q.e.score)})`).join('\n'); }
  };

  // =====================================================================
  // Практика 3. «Говорят» против «делают»
  // =====================================================================
  const EVD = [
    { v: 'e-verbal', t: '08:10 — Анна Павловна попросила отложить бородинский; Света подписала пакет и убрала под прилавок' },
    { v: 'e-names', t: '08:40 — три пакета «Лена»; Света открыла два, чтобы понять, какой отдать' },
    { v: 'e-hands', t: '07:46 — новенькая в перчатке дважды промахнулась по кнопке и сняла перчатку' },
    { v: 'e-modem', t: '08:20–08:32 — касса без связи, работала офлайн, чеки ушли потом' },
    { v: 'e-shelf', t: '07:40–07:50 — Света 4 раза искала пакет под прилавком, очередь ждала' },
    { v: 'e-second', t: '11:05 — второй развоз, к 11:15 круассаны снова на витрине' },
    { v: 'e-paper', t: '06:10 — в приют ушло 15 штук, в журнале списаний 5 строк' },
    { v: 'e-cro', t: '07:20 — привезли первый лоток круассанов' }
  ];
  const VD = [{ v: 'yes', t: 'Подтвердилось' }, { v: 'part', t: 'Верно, но не всё' }, { v: 'diff', t: 'Расходится: делают иначе' }];
  const SD = [
    { id: 'sd1', who: 'pavel', when: 'на встрече в понедельник', said: 'Предзаказов у нас нет — только торты в тетради.', ev: 'e-verbal', vd: 'diff', hint: 'Есть ли в смене момент, когда покупатель заранее просит что-то для себя придержать?', why: 'Устный предзаказ уже существует: «отложи мне» — без оплаты и без записи. Предзаказ в системе заменит привычку, а не появится с нуля, и кассир должен уметь оформить его за покупателя.' },
    { id: 'sd2', who: 'pavel', when: 'утром до открытия', said: 'Пакеты у нас подписаны — мы их не путаем.', ev: 'e-names', vd: 'diff', hint: 'Как подписаны пакеты — и что делала Света, когда пришла покупательница с частым именем?', why: 'Подписаны — да, но по имени: три «Лены» — и кассир открывает пакеты. Нужен короткий код заказа.' },
    { id: 'sd3', who: 'rita', when: 'в чате проекта', said: 'Кассир за минуту вобьёт заказ в программу: имя, телефон — и готово.', ev: 'e-hands', vd: 'diff', hint: 'Что было у кассиров на руках и как у них получалось нажимать на экран?', why: 'В перчатках и муке набирать текст у кассы не получается. Экран кассира — крупные кнопки, без набора.' },
    { id: 'sd4', who: 'nina', when: 'на интервью', said: 'Касса у нас облачная, работает всегда.', ev: 'e-modem', vd: 'part', alt: { diff: 0.5 }, hint: 'Что случилось с кассой в начале девятого — и остановились ли продажи?', why: 'Облачная — да, и продажи действительно не встали. Но связь рвётся, касса уходит в офлайн. «Всегда» держится на офлайн-режиме — экран выдачи заказов должен уметь так же.' },
    { id: 'sd5', who: 'pavel', when: 'на встрече в понедельник', said: 'В пик кассиру не до предзаказов.', ev: 'e-shelf', vd: 'yes', hint: 'Что делала Света в самый пик, кроме того, что пробивала покупки?', why: 'Подтвердилось: 4 раза за 10 минут под прилавок, очередь стоит. Выдача заказа не должна задерживать очередь (F-peak).' },
    { id: 'sd6', who: 'nina', when: 'на интервью', said: 'Если в половине одиннадцатого круассанов нет — значит, распродали, на сегодня всё.', ev: 'e-second', vd: 'diff', hint: 'Перемотайте смену после 10:30: витрина так и осталась пустой?', why: 'После второго развоза в 11:00 витрина снова полная. «Нет в наличии» в 10:30 — временно, и приложение не должно говорить «закончились».' },
    { id: 'sd7', who: 'pavel', when: 'утром до открытия', said: 'Списания пишем каждый вечер — всё учтено.', ev: 'e-paper', vd: 'diff', alt: { part: 1 }, hint: 'Сравните, что ушло в приют, и что записано в журнале.', why: 'Пишут — да, но не всё: в приют ушло 15 штук, в журнале 5 строк. Для цели «списания 12 % → 7 %» нужен точный учёт.' }
  ];
  const SDQ = {
    q: 'Почему «говорят» так часто расходится с «делают»?', multi: true, seed: 'obs-sdq',
    options: [
      { t: 'Очевидное для себя люди не проговаривают — «это же все знают»', ok: 1, why: 'Да: проклятие знания.' },
      { t: 'Обходные пути неловко признавать — или их вообще не считают частью работы', ok: 1, why: 'Да: «отложи мне» для Светы — просто доброта, а не процесс.' },
      { t: 'Люди рассказывают, как должно быть по правилам, а не как есть', ok: 1, why: 'Да: Павел честно описал, как задумано.' },
      { t: 'Сотрудники специально обманывают аналитика', why: 'Почти никогда. Они честно рассказывают, как понимают свою работу. Подозрительность испортит отношения.' },
      { t: 'Значит, интервью бесполезно — хватит одного наблюдения', why: 'Нет: наблюдение показывает «что», интервью — «почему». Нужны оба и сверка между ними.' }
    ]
  };
  function sdEval(ans) {
    const e = (ans && ans.e) || {}, d = (ans && ans.d) || {};
    const rows = SD.map(r => {
      const eo = e[r.id] === r.ev, dv = d[r.id], dpt = dv === r.vd ? 1 : (r.alt && r.alt[dv]) || 0;
      return { r, eo, eg: e[r.id], dv, dpt, s: !e[r.id] || !dv ? 'empty' : eo && dpt === 1 ? 'ok' : eo || dpt ? 'warn' : 'bad' };
    });
    const ep = rows.filter(x => x.eo).length / SD.length, dp = rows.reduce((s, x) => s + x.dpt, 0) / SD.length;
    const q = ui.quizScore(SDQ, (ans && ans.q) || []);
    return { rows, ep, dp, q, score: ep * 0.5 + dp * 0.3 + q.score * 0.2 };
  }
  const saydoTask = {
    id: 'saydo', title: '«Говорят» против «делают»',
    simple: howWhy.simple,
    lead: ui.brief({
      situation: 'Вечером после смены Ксения открывает две колонки: что люди говорили на встречах этой недели и что вы увидели утром. «Самое ценное — там, где колонки не сходятся».',
      todo: [
        'Для каждой из семи фраз выберите в первом списке, какое наблюдение со смены её проверяет (одно наблюдение — лишнее).',
        'Во втором списке выберите вывод: подтвердилось, верно, но не всё, или расходится.',
        'Ответьте на вопрос внизу (можно несколько вариантов) и нажмите «Проверить». Засчитывается от 80 %.'
      ],
      look: '«Подтвердилось» — слова и дело совпали. «Верно, но не всё» — сказанное правда, но важная часть осталась за кадром. «Расходится» — на деле работают иначе. Ни один вариант не значит, что человек соврал.'
    }),
    blank: () => ({ e: {}, d: {}, q: [] }),
    reference: () => ({ e: Object.fromEntries(SD.map(r => [r.id, r.ev])), d: Object.fromEntries(SD.map(r => [r.id, r.vd])), q: quizRef(SDQ) }),
    render(el, ctx) {
      el.classList.add('obs-root');
      const a = ctx.ans; a.e = a.e || {}; a.d = a.d || {}; a.q = a.q || [];
      const ev = ctx.result ? sdEval(a) : null;
      const evs = TR.shuffle(EVD, 'obs-evd');
      el.innerHTML = `<div class="stack"><div class="obs-sd">${SD.map(r => {
          const x = ev && ev.rows.find(y => y.r.id === r.id), cls = x && x.s !== 'empty' ? x.s : '';
          return `<div class="obs-sdr ${cls}" data-row="${r.id}"><div><div class="who">${esc(TR.PEOPLE[r.who].name)} · ${esc(r.when)}</div><div class="said">«${esc(r.said)}»</div></div>
            <select data-e="${r.id}" aria-label="Наблюдение для фразы" ${ctx.readonly ? 'disabled' : ''}><option value="">Что увидели…</option>${evs.map(o => `<option value="${o.v}" ${a.e[r.id] === o.v ? 'selected' : ''}>${esc(o.t)}</option>`).join('')}</select>
            <select data-d="${r.id}" aria-label="Вывод" ${ctx.readonly ? 'disabled' : ''}><option value="">Вывод…</option>${VD.map(o => `<option value="${o.v}" ${a.d[r.id] === o.v ? 'selected' : ''}>${esc(o.t)}</option>`).join('')}</select>
            ${ctx.readonly ? `<div class="why">${esc(r.why)}</div>` : x && x.s !== 'ok' && x.s !== 'empty' ? `<div class="why">${esc(r.hint)}</div>` : ''}</div>`;
        }).join('')}</div><div class="card flat" data-q></div></div>`;
      el.addEventListener('change', e => {
        const s = e.target.closest('select'); if (!s || ctx.readonly) return;
        if (s.dataset.e) a.e[s.dataset.e] = s.value; if (s.dataset.d) a.d[s.dataset.d] = s.value;
        const row = s.closest('.obs-sdr'); row.classList.remove('ok', 'bad', 'warn'); const w = TR.$('.why', row); if (w) w.remove();
        ctx.save();
      });
      ui.quiz(TR.$('[data-q]', el), Object.assign({}, SDQ, { value: a.q, readonly: ctx.readonly, reveal: ctx.result, onChange: v => { a.q = v; ctx.save(); } }));
    },
    check(ans) {
      const ev = sdEval(ans), notes = [];
      const empty = ev.rows.filter(x => x.s === 'empty').length;
      if (empty) notes.push({ ok: false, html: `Не заполнено строк: ${empty} из ${SD.length}.` });
      ev.rows.forEach(x => {
        if (x.s === 'empty' || x.s === 'ok') return;
        if (!x.eo) notes.push({ ok: false, html: `«${esc(x.r.said)}» — наблюдение не то. ${esc(x.r.hint)}` });
        else if (x.dpt < 1) notes.push({ ok: x.dpt ? 'warn' : false, html: `«${esc(x.r.said)}» — наблюдение верное, а вывод ${x.dpt ? 'спорный' : 'нет'}. Сказанное — правда целиком, наполовину или на деле работают иначе?` });
      });
      notes.push(ev.q.ok ? { ok: true, html: 'Вопрос: верно.' } : { ok: false, html: 'Вопрос: из трёх верных причин ни одна не про злой умысел. И подумайте, что даёт интервью, чего не даёт наблюдение.' });
      const ok = ev.score >= 0.8;
      return {
        ok, score: ev.score, notes,
        summary: `Наблюдения подобраны: ${ev.rows.filter(x => x.eo).length} из ${SD.length}. Выводы: ${pct(ev.dp)}. Вопрос: ${ev.q.ok ? 'верно' : 'неверно'}.`,
        mentor: ok ? 'Заметьте: из семи фраз подтвердилась одна. Это не значит, что люди врут, — они рассказывают, как понимают свою работу. Поэтому сказанное на интервью аналитик сверяет с увиденным.' : null
      };
    },
    explain: `${ui.table(['Говорят', 'Увидели', 'Вывод'], SD.map(r => [`${esc(TR.PEOPLE[r.who].name)}: «${esc(r.said)}»`, esc(EVD.find(e => e.v === r.ev).t), `<b>${esc(VD.find(v => v.v === r.vd).t)}</b>${r.alt ? ' <span class="small dim">(спорно)</span>' : ''}<div class="small muted">${esc(r.why)}</div>`]))}
      <p>«Говорят ≠ делают» — один из главных пунктов чек-листа ловушек (PRACTICES.md §1.5). Подтверждать сказанное наблюдением — привычка аналитика, а не недоверие к людям. Спорные места засчитываются оба: «касса работает всегда» можно считать и «верно, но не всё», и «расходится»; «списания пишем» — и «расходится», и «верно, но не всё».</p>
      <p>Что делать с расхождениями: не уличать человека, а принести факт и спросить «почему так?» — в паузе или на следующей встрече. Ответ почти всегда — потребность, которую система должна закрыть.</p>`,
    report: ans => sdEval(ans).rows.map(x => `- «${x.r.said}» → ${(EVD.find(e => e.v === x.eg) || { t: '—' }).t} · ${(VD.find(v => v.v === x.dv) || { t: '—' }).t} ${x.s === 'ok' ? '✓' : x.s === 'warn' ? '≈' : '✗'}`).join('\n')
  };

  // =====================================================================
  // Практика 4. От наблюдения к требованию
  // =====================================================================
  const RQ = [
    { v: 'r-big', s: 'Крупные кнопки без набора текста', t: 'Экран кассира: крупные кнопки, выдача заказа в одно касание, без набора текста' },
    { v: 'r-code', s: 'Короткий код заказа', t: 'Короткий код заказа — на пакете, в приложении и в SMS; кассир находит заказ по коду' },
    { v: 'r-place', s: 'Место хранения заказа', t: 'При сборке заказ получает номер корзины или ячейки; экран выдачи показывает, где лежит пакет' },
    { v: 'r-offline', s: 'Работа без связи', t: 'Экран выдачи работает без связи: заказы смены хранятся на планшете, отметки «Выдан» досылаются после восстановления' },
    { v: 'r-phone', s: 'Заказ через кассира', t: 'Кассир оформляет предзаказ за покупателя у прилавка или по телефону — с оплатой на месте' },
    { v: 'r-soon', s: '«Будет после 11:00»', t: 'Остатки на сегодня учитывают второй развоз: вместо «нет в наличии» — «будет после 11:00»' },
    { v: 'r-waste', s: 'Списания в планшете', t: 'Списания отмечают в планшете при закрытии — по позициям из остатков, а не ручкой в журнале' },
    { v: 'x-camera', s: 'Камера над кассой', t: 'Камера над кассой — следить, как кассиры выдают заказы' },
    { v: 'x-person', s: 'Отдельный сотрудник на выдачу', t: 'Отдельный сотрудник на выдачу заказов в утренний пик' }
  ];
  const OB = [
    { id: 'o-hands', t: 'У кассы шумно, руки в муке и перчатках: промахиваются по мелким кнопкам, переспрашивают', ok: 'r-big' },
    { id: 'o-names', t: 'Три пакета «Лена» — кассир открывает пакеты, чтобы понять, какой отдать', ok: 'r-code' },
    { id: 'o-shelf', t: 'Пакеты под прилавком, часть на полу; в пик кассир ищет их по 4 раза за 10 минут', ok: 'r-place', alt: { 'r-code': 0.5 } },
    { id: 'o-modem', t: 'Связь пропадает на 10–15 минут — касса работает офлайн', ok: 'r-offline' },
    { id: 'o-verbal', t: '«Отложи мне бородинский» — устная бронь без оплаты', ok: 'r-phone' },
    { id: 'o-second', t: 'До 11:00 витрина пустеет, после второго развоза — снова полная', ok: 'r-soon' },
    { id: 'o-paper', t: 'Списания пишут ручкой после закрытия, часть забывают', ok: 'r-waste' }
  ];
  const OHINT = {
    'r-big': 'Что мешает кассиру нажимать и печатать? Какой экран это выдержит?',
    'r-code': 'Имя повторяется. Чем ещё можно отличить один заказ от другого — коротко и без путаницы?',
    'r-place': 'Проблема не в том, чей пакет, а в том, где он лежит. Что подскажет кассиру место?',
    'r-offline': 'Что должно происходить с выдачей заказов, когда связи нет 15 минут?',
    'r-phone': 'Покупатель уже «заказывает» устно через кассира. Что система должна дать кассиру?',
    'r-soon': 'Что увидит покупатель в приложении в 10:30 — и правда ли это?',
    'r-waste': 'Где и когда списания должны записываться, чтобы их не забывали?'
  };
  const RQQ = {
    q: 'Как лучше записать требование из наблюдения про три «Лены»?', seed: 'obs-rqq',
    options: [
      { t: 'При оформлении заказу присваивается короткий код; код печатается на пакете и показывается покупателю в приложении и SMS; кассир находит заказ по коду. Источник: наблюдение, Покровка, 22.10, 08:40', ok: 1, why: 'Да: понятно, что должно получиться, это можно проверить, и указан источник.' },
      { t: 'Сделать удобную выдачу заказов', why: 'Неизмеримо: что значит «удобную»? Лера не сможет это проверить.' },
      { t: 'Подписывать пакеты полностью: фамилия, имя, отчество', why: 'То же решение «по имени», только длиннее: однофамильцы останутся, а маркером в пик никто не напишет «Елена Викторовна Смирнова».' },
      { t: 'Внедрить на пакетах RFID-метки и считыватель у кассы', why: 'Дорогое техническое решение вместо требования. Сначала — что должно получиться (быстро и без ошибок найти заказ), а как — решит команда.' }
    ]
  };
  function trEval(ans) {
    const v = (ans && ans.v) || {};
    const rows = OB.map(o => { const g = v[o.id], p = g === o.ok ? 1 : (o.alt && o.alt[g]) || 0; return { o, g, p, s: !g ? 'empty' : p === 1 ? 'ok' : p ? 'warn' : 'bad' }; });
    const part = rows.reduce((s, r) => s + r.p, 0) / OB.length, q = ui.quizScore(RQQ, (ans && ans.q) || []);
    return { rows, part, q, score: part * 0.8 + q.score * 0.2 };
  }
  const toreqTask = {
    id: 'toreq', title: 'От наблюдения к требованию',
    simple: howUse.simple,
    lead: ui.brief({
      situation: 'Соня собирает макет экрана кассира, Дима — оценку. Ксения: «Каждое наблюдение со смены должно куда-то привести — к экрану, к правилу или к работе без связи. Иначе зачем мы вставали в пять утра?»',
      todo: [
        'Прочитайте направления требований в рамке.',
        'Для каждого из семи наблюдений выберите в списке, к какому требованию оно ведёт. Два направления — лишние.',
        'Ответьте на вопрос о формулировке и нажмите «Проверить». Засчитывается от 80 %.'
      ],
      look: 'Требование отвечает на вопрос «что должно получиться у человека», а не «что купить». Лишние варианты — не требования к системе, а решения о людях и контроле.'
    }),
    blank: () => ({ v: {}, q: [] }),
    reference: () => ({ v: Object.fromEntries(OB.map(o => [o.id, o.ok])), q: quizRef(RQQ) }),
    render(el, ctx) {
      el.classList.add('obs-root');
      const a = ctx.ans; a.v = a.v || {}; a.q = a.q || [];
      let reveal = null;
      if (ctx.result) { reveal = {}; trEval(a).rows.forEach(r => { if (r.g) reveal[r.o.id] = { s: r.s, why: r.s === 'ok' ? '' : r.s === 'warn' ? 'Код поможет понять, чей пакет, но не где он лежит. Чего не хватает кассиру, который в пик лезет под прилавок?' : r.g === 'x-person' ? 'Это позиция Павла о людях, а не требование к системе — и Нина против. Это противоречие, о нём следующее задание.' : r.g === 'x-camera' ? 'Контроль за людьми не решает проблему и убивает доверие смены.' : OHINT[r.o.ok] }; }); }
      el.innerHTML = `<div class="stack">
        <div class="card flat"><div class="obs-lbl">Направления требований</div><div class="stack tight">${TR.shuffle(RQ, 'obs-rq').map(r => `<div class="small"><b>${esc(r.s)}.</b> ${esc(r.t)}</div>`).join('')}</div></div>
        <div data-m></div><div class="card flat" data-q></div></div>`;
      ui.match(TR.$('[data-m]', el), { rows: OB.map(o => ({ id: o.id, t: esc(o.t) })), choices: TR.shuffle(RQ, 'obs-rq').map(r => ({ v: r.v, t: r.s })), value: a.v, reveal, readonly: ctx.readonly, placeholder: 'К какому требованию…', onChange: v => { a.v = v; ctx.save(); } });
      ui.quiz(TR.$('[data-q]', el), Object.assign({}, RQQ, { value: a.q, readonly: ctx.readonly, reveal: ctx.result, onChange: v => { a.q = v; ctx.save(); } }));
    },
    check(ans) {
      const ev = trEval(ans), notes = [];
      const empty = ev.rows.filter(r => r.s === 'empty').length;
      if (empty) notes.push({ ok: false, html: `Не выбрано для ${empty} из ${OB.length} наблюдений.` });
      ev.rows.forEach(r => {
        if (r.s === 'warn') notes.push({ ok: 'warn', html: `«${esc(r.o.t)}» — близко: код поможет понять, чей пакет, но не где он лежит.` });
        else if (r.s === 'bad') notes.push({ ok: false, html: `«${esc(r.o.t)}» — ${r.g === 'x-person' || r.g === 'x-camera' ? 'это решение о людях, а не требование к системе.' : esc(OHINT[r.o.ok])}` });
      });
      notes.push(ev.q.ok ? { ok: true, html: 'Формулировка: верно.' } : { ok: false, html: 'Формулировка: какую из них Лера сможет проверить, а Дима — оценить, не выбирая за него технологию?' });
      const ok = ev.score >= 0.8;
      return {
        ok, score: ev.score, notes,
        summary: `Наблюдение → требование: ${ev.rows.filter(r => r.s === 'ok').length} из ${OB.length}. Формулировка: ${ev.q.ok ? 'верно' : 'неверно'}.`,
        mentor: ev.rows.some(r => r.g === 'x-camera') ? 'Камера — это контроль за людьми, а не помощь им. Смена, которая узнает, что после вашего визита повесили камеру, больше ничего вам не покажет.' : ok ? 'Каждое требование теперь знает, откуда оно: «наблюдение, Покровка, 22.10». Через месяц, когда Дима спросит «а зачем код из четырёх знаков?», вы покажете запись.' : null
      };
    },
    explain: `${ui.table(['Наблюдение', 'Требование', 'Кому в команде'], [
        ['Перчатки, мука, шум', 'Крупные кнопки, выдача в одно касание, без набора', 'Соне — макет экрана кассира'],
        ['Три «Лены»', 'Короткий код заказа на пакете и в приложении', 'Соне и Диме; Лере — проверка «два заказа на одно имя»'],
        ['Пакеты под прилавком и на полу', 'Номер корзины или ячейки при сборке, подсказка «где лежит»', 'Соне — экран сборки; Павлу — где физически хранить'],
        ['Модем, 10–15 минут без связи', 'Выдача без связи, досылка отметок', 'Диме — это нефункциональное требование к надёжности'],
        ['«Отложи мне бородинский»', 'Заказ через кассира, оплата на месте', 'в MVP (DOMAIN §4); связано с F-elder — 40 % постоянных старше 55'],
        ['Пустая витрина до 11:00', '«Будет после 11:00» вместо «нет в наличии»', 'Диме — остатки с учётом второго развоза'],
        ['Списания забывают', 'Списания в планшете при закрытии', 'Should в первой версии; цель БЦ-1: списания 12 % → 7 %']
      ])}
      <p><b>Почему не камера и не отдельный человек.</b> Это решения о людях, а не требования к системе. Камера убивает доверие смены. Отдельный сотрудник — позиция Павла, против которой Нина: это противоречие, его решает владелец продукта, а не аналитик в одиночку.</p>
      <p><b>Почему код, а не ФИО на пакете.</b> Требование описывает результат (найти заказ быстро и без ошибок) и проверяется, а технологию — наклейка, QR, метки — выбирает команда. Источник рядом с требованием — основа трассируемости (ISO/IEC/IEEE 29148).</p>`,
    report: ans => trEval(ans).rows.map(r => `- ${r.o.t} → ${(RQ.find(x => x.v === r.g) || { s: '—' }).s} ${r.s === 'ok' ? '✓' : r.s === 'warn' ? '≈' : '✗'}`).join('\n')
  };

  // =====================================================================
  // Практика 5. Противоречия заинтересованных лиц + письмо Нине
  // =====================================================================
  const CC = [
    { id: 'c-rita-sale', who: 'rita', t: 'Скидка 30 % на выпечку после 19:00 в приложении — и списаний не будет!' },
    { id: 'c-galya-sale', who: 'galya', t: 'Будет скидка вечером — все станут ждать 19:00, а мой план выпечки сломается.' },
    { id: 'c-pavel-person', who: 'pavel', t: 'В утренний пик кассиру не до предзаказов — пусть выдаёт отдельный человек.' },
    { id: 'c-nina-person', who: 'nina', t: 'Лишнего человека в смену не дам.' },
    { id: 'c-oleg-pay', who: 'oleg', t: 'Только онлайн-оплата — иначе снова ручная сверка.' },
    { id: 'c-nina-pay', who: 'nina', t: 'Бабушки платят наличными — оплата на месте должна остаться.' },
    { id: 'c-nina-time', who: 'nina', t: 'Клиент выбирает точное время, хоть 07:05.' },
    { id: 'c-galya-time', who: 'galya', t: 'Раньше 07:30 круассан не гарантирую.' },
    { id: 'c-rita-vk', who: 'rita', t: 'Хочу кнопку «заказать» прямо в постах ВКонтакте.' },
    { id: 'c-oleg-1c', who: 'oleg', t: 'Сводка продаж в 1С нужна к 09:00 следующего дня.' }
  ];
  const CPAIRS = [['c-rita-sale', 'c-galya-sale'], ['c-pavel-person', 'c-nina-person'], ['c-oleg-pay', 'c-nina-pay'], ['c-nina-time', 'c-galya-time']];
  const CSTEPS = [
    { id: 'st1', t: 'Записать обе позиции дословно — кто и когда сказал' },
    { id: 'st2', t: 'Выяснить интересы за позициями: «для чего вам это?»' },
    { id: 'st3', t: 'Собрать факты и цифры: 40 % постоянных старше 55, 2 часа ручной сверки, первая партия в 07:20' },
    { id: 'st4', t: 'Подготовить 2–3 варианта с ценой и последствиями' },
    { id: 'st5', t: 'Вынести на решение владельцу продукта — Нине, вместе с обеими сторонами' },
    { id: 'st6', t: 'Записать решение в протокол и в требования, сообщить всем' }
  ];
  const CJ_RUBRIC = [
    'Называет 2–3 конкретных наблюдения со смены — со временем или числами: «отложи мне бородинский», три пакета «Лена», касса без связи 12 минут, пустая витрина до второго развоза',
    'Объясняет, почему этого не было на интервью: для сотрудников это привычное утро или обходной путь',
    'Переводит наблюдения в последствия для системы на языке Нины: крупные кнопки без набора текста, короткий код вместо имени, работа без связи, место для заказов, заказ через кассира',
    'Выносит одно противоречие с интересами обеих сторон (например, Олегу — не сверять руками, Нине — не потерять пожилых покупателей) и 2 варианта с ценой',
    'Оставляет решение за Ниной и предлагает следующий шаг (встреча, срок); пишет без жаргона'
  ];
  const CJ_REF = 'Нина Сергеевна, добрый день! Вчера с шести утра мы с Ксенией были на Покровке и увидели то, о чём на встречах не говорят, — для ребят это просто обычное утро. Предзаказ у вас уже есть: Анна Павловна просит Свету «отложить бородинский на вечер», и пакет ждёт её под прилавком. В пик таких пакетов было семь, три подписаны «Лена» — Света открывала их, чтобы понять, какой отдать, а очередь в это время стояла. В 08:20 касса на 12 минут осталась без связи и работала офлайн. Для системы это значит: экран кассира — с крупными кнопками и без набора текста (у ребят руки в муке и перчатках); у каждого заказа — короткий код вместо имени; выдача работает и без интернета; кассир умеет оформить заказ за покупателя. И один вопрос, который решить можете только вы. Олег Петрович хочет только онлайн-оплату, чтобы не сверять наличные руками; вы хотите оставить оплату на месте ради пожилых покупателей. Правы оба. Вариант 1: оплата на месте остаётся, но проходит через кассу «КассаПро» и сама попадает в сводку — сверка для Олега Петровича почти не растёт, разработка немного дольше. Вариант 2: оплата на месте только для заказов через кассира, в приложении — только онлайн. Предлагаю в понедельник на 20 минут обсудить вместе с Олегом Петровичем — подготовлю оба варианта с ценой.';
  function cfEval(ans) {
    const a = ans || {}, pairs = Array.isArray(a.pairs) ? a.pairs : [];
    const key = p => p.slice().sort().join('|'), good = new Set(CPAIRS.map(key));
    const okP = pairs.filter(p => good.has(key(p))).length, badP = pairs.length - okP;
    const pairS = clamp(okP / CPAIRS.length - 0.15 * badP);
    const ord = Array.isArray(a.order) && a.order.length === CSTEPS.length ? ui.orderScore(a.order, CSTEPS.map(s => s.id)) : 0;
    const js = ui.justifyScore(a.j);
    return { pairs, okP, badP, pairS, ord, js, score: pairS * 0.35 + ord * 0.2 + js * 0.45 };
  }
  const conflictTask = {
    id: 'conflict', title: 'Противоречия и письмо Нине',
    simple: howUse.simple,
    lead: ui.brief({
      situation: 'Пятница, утро. В блокноте недели — интервью с Ниной, смена на Покровке, разговоры с Павлом, Галиной Ивановной, Олегом Петровичем и чат с Ритой. Ксения: «Найдите, где люди хотят противоположного. И напишите Нине, что мы увидели на смене и что ей придётся решить».',
      todo: [
        'Шаг 1: соедините в пары высказывания, которые противоречат друг другу: нажмите одну карточку, потом вторую. Нажатие на карточку из пары разбивает пару. Две карточки — без пары.',
        'Шаг 2: расставьте шаги работы аналитика с противоречием по порядку (стрелками или перетаскиванием).',
        'Шаг 3: напишите Нине письмо-итог смены: 2–3 наблюдения, что они меняют, и одно противоречие с вариантами. Проверьте с Ксенией или сверьте с эталоном сами.',
        'Нажмите «Проверить». Засчитывается от 75 %, если найдено хотя бы 3 пары и письмо набрало от 60 %.'
      ],
      look: 'Противоречие — когда выполнить одно значит нарушить другое. «Хочу кнопку в ВК» и «сводка к 09:00» никому не мешают. Письмо — для Нины: без слов «требование», «интерфейс», «офлайн-режим».'
    }),
    blank: () => ({ pairs: [], j: {} }),
    reference: () => ({ pairs: CPAIRS.map(p => p.slice()), order: CSTEPS.map(s => s.id), j: { text: CJ_REF, self: CJ_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('obs-root');
      const a = ctx.ans; a.pairs = Array.isArray(a.pairs) ? a.pairs : []; a.j = a.j || {};
      const judged = !!ctx.result;
      const cards = TR.shuffle(CC, 'obs-cc');
      const key = p => p.slice().sort().join('|'), good = new Set(CPAIRS.map(key));
      let pick = null;
      el.innerHTML = `<div class="stack">
        <div class="obs-lbl">Шаг 1 · Найдите пары противоречий</div>
        <div class="obs-cards" data-cards></div>
        <div class="small dim" data-ph></div>
        <div class="obs-lbl">Шаг 2 · Что аналитик делает с противоречием — по порядку</div>
        <div data-ord></div>
        <div class="obs-lbl">Шаг 3 · Письмо Нине Сергеевне</div>
        <div data-j></div>
      </div>`;
      function drawCards() {
        TR.$('[data-cards]', el).innerHTML = cards.map(c => {
          const pi = a.pairs.findIndex(p => p.includes(c.id)), p = a.pairs[pi];
          const mark = judged && p ? (good.has(key(p)) ? 'ok' : 'bad') : '';
          return `<button type="button" class="obs-card ${pick === c.id ? 'pick' : ''} ${mark}" data-cc="${c.id}" ${ctx.readonly ? 'disabled' : ''}><span class="who">${esc(TR.PEOPLE[c.who].name)}</span><span>«${esc(c.t)}»</span>${p ? `<span class="pn" style="background:${PCOL[pi % PCOL.length]}">${pi + 1}</span>` : ''}</button>`;
        }).join('');
        TR.$('[data-ph]', el).textContent = ctx.readonly ? '' : pick ? 'Теперь нажмите вторую карточку пары.' : `Пар собрано: ${a.pairs.length}.`;
      }
      TR.on(el, 'click', '[data-cc]', (e, b) => {
        if (ctx.readonly) return;
        const id = b.dataset.cc, pi = a.pairs.findIndex(p => p.includes(id));
        if (pi >= 0) { a.pairs.splice(pi, 1); pick = null; }
        else if (!pick) pick = id;
        else if (pick === id) pick = null;
        else { a.pairs.push([pick, id]); pick = null; }
        ctx.save(); drawCards();
      });
      drawCards();
      ui.order(TR.$('[data-ord]', el), { items: CSTEPS.map(s => ({ id: s.id, t: esc(s.t) })), value: a.order, readonly: ctx.readonly, seed: 'obs-steps', reveal: judged && Array.isArray(a.order) ? Object.fromEntries(a.order.map((id, i) => [id, CSTEPS[i].id === id ? 'ok' : 'bad'])) : null, onChange: v => { a.order = v; ctx.save(); } });
      ui.justify(TR.$('[data-j]', el), {
        id: 'obs-nina', q: 'Письмо Нине: что увидели на смене, что это меняет и что ей решить',
        qPlain: 'Напишите владелице сети пекарен письмо-итог утренней смены в пекарне: назовите 2–3 конкретных наблюдения, объясните, почему они не прозвучали на интервью, переведите их в последствия для будущей системы её языком, вынесите одно противоречие между сотрудниками с интересами обеих сторон и двумя вариантами с ценой, оставьте решение за ней и предложите следующий шаг.',
        rubric: CJ_RUBRIC, reference: CJ_REF, value: a.j, readonly: ctx.readonly, minLen: 300,
        placeholder: 'Нина Сергеевна, добрый день! Вчера с шести утра… (что увидели; почему об этом не говорили; что это значит для системы; какое противоречие решить вам и какие есть варианты)',
        onChange: v => { a.j = v; ctx.save(); ctx.decide('Письмо Нине после смены', v.text || ''); }
      });
    },
    check(ans) {
      const ev = cfEval(ans), notes = [];
      notes.push(ev.okP === CPAIRS.length && !ev.badP ? { ok: true, html: 'Все четыре пары противоречий найдены.' } : { ok: ev.okP >= 3 ? 'warn' : false, html: `Пары: верных ${ev.okP} из ${CPAIRS.length}${ev.badP ? `, лишних или неверных ${ev.badP}` : ''}. Противоречие — когда выполнить одно значит нарушить другое. Ищите, кто о чём спорит: деньги, люди, время, план цеха.` });
      notes.push(ev.ord >= 0.9 ? { ok: true, html: 'Порядок шагов: верно.' } : { ok: ev.ord >= 0.7 ? 'warn' : false, html: `Порядок шагов: ${pct(ev.ord)}. Можно ли готовить варианты, не узнав, зачем каждой стороне её позиция? И кто выбирает вариант?` });
      notes.push(ev.js >= 0.6 ? { ok: true, html: `Письмо: ${pct(ev.js)}.` } : { ok: false, html: ev.js ? `Письмо: ${pct(ev.js)}. Нине нужны конкретные картинки со смены, их смысл для её бизнеса и выбор с ценой — а решение за ней.` : 'Письмо: напишите от 300 символов и проверьте с Ксенией или сверьте с эталоном.' });
      const ok = ev.score >= 0.75 && ev.okP >= 3 && ev.js >= 0.6;
      return {
        ok, score: ev.score, notes,
        summary: `Пары: ${ev.okP} из ${CPAIRS.length}. Порядок: ${pct(ev.ord)}. Письмо: ${pct(ev.js)}.`,
        mentor: ok ? 'Противоречия — не ссора, а находка. Найдено на обследовании — стоит разговора; найдено на демо — стоит спринта.' : ev.badP ? 'Не всякое разное желание — противоречие. Рита хочет кнопку в ВК, Олег — сводку к девяти: их можно сделать обе, ничем не жертвуя.' : null
      };
    },
    explain: `${ui.table(['Противоречие', 'Интересы', 'Что может предложить аналитик (решает Нина)'], [
        ['Рита: скидка 30 % после 19:00 ↔ Галина Ивановна: «план сломается»', 'Рита — снизить списания и привлечь вечерних покупателей; Галина — предсказуемый план', 'скидка только на то, что осталось на витрине к 20:30, без анонса заранее; или пилот в одной пекарне на месяц с замером'],
        ['Павел: отдельный человек на выдачу ↔ Нина: «лишнего не дам»', 'Павел — очередь не стоит; Нина — фонд оплаты труда', 'экран сборки заранее + место хранения + код: выдача за секунды без лишнего человека; второй человек только в праздники'],
        ['Олег: только онлайн ↔ Нина: оплата на месте', 'Олег — не сверять руками; Нина — не потерять покупателей 55+', 'оплата на месте через «КассаПро» с автоматической сводкой; или на месте — только для заказов через кассира'],
        ['Нина: точное время хоть 07:05 ↔ Галина: не раньше 07:30', 'Нина — удобство покупателя; Галина — не обещать невозможного', 'получасовые интервалы; круассаны недоступны в интервал 07:00–07:30 (критерий из DOMAIN §7)']
      ])}
      <p><b>Порядок работы:</b> записать позиции → выяснить интересы → собрать факты → варианты с ценой → решение владельца продукта → протокол и требования. Аналитик не выбирает победителя и не прячет спор до демо (Фишер и Юри, «Переговоры без поражения»; PRACTICES.md §3).</p>
      <p><b>Письмо</b> работает, когда в нём картинки, а не термины: «три пакета „Лена“» Нина увидит сразу, «нужна идентификация заказов» — нет. И когда выбор оставлен ей: она владелец продукта.</p>`,
    report: ans => { const ev = cfEval(ans), a = ans || {}; return `Пары: ${(ev.pairs || []).map(p => p.map(id => (CC.find(c => c.id === id) || {}).t).join(' ↔ ')).join('; ') || '—'} (верных ${ev.okP})\nПорядок: ${(a.order || []).map(id => (CSTEPS.find(s => s.id === id) || {}).t).join(' → ') || '—'}\nПисьмо Нине:\n${(a.j && a.j.text) || '—'}`; }
  };

  // =====================================================================
  TR.stage({
    id: ID, act: 3, order: 240, slot: 'Чт 06:00', title: 'Смена в пекарне',
    when: 'четверг, 22 октября, 06:00 · пекарня «Колос» на Покровке, у прилавка',
    intro: [
      { who: 'ksenia', html: 'Сегодня без переговорной. В шесть утра мы на Покровке и смотрим утреннюю смену до второго развоза. Интервью рассказало нам, как всё <i>должно</i> быть. Смена покажет, как <i>есть</i>.' },
      { who: 'pavel', html: 'Только под ногами не путайтесь. В половине восьмого тут не до вас.' },
      { who: 'ksenia', html: 'Ваша задача — заметить то, о чём никто не скажет на интервью, записать по времени и в паузах расспросить Павла, Галину Ивановну и Олега Петровича. Потом превратим заметки в требования и найдём, где люди хотят противоположного.' }
    ],
    facts: ['F-obs-verbal', 'F-obs-hands', 'F-obs-shelf', 'F-obs-names', 'F-obs-modem', 'F-obs-second', 'F-obs-paper', 'F-peak'],
    glossary: [
      { term: 'Наблюдение (job shadowing)', simple: 'Постоять рядом и посмотреть, как человек работает на самом деле, а не как рассказывает.', tech: 'Техника выявления требований (BABOK v3): аналитик наблюдает выполнение работы в реальной среде. Даёт неявные требования, обходные пути, условия работы; подтверждает или опровергает сказанное на интервью.' },
      { term: 'Неявное требование', simple: '«Хлеб должен быть свежим» — никто не скажет, но без этого всё бессмысленно. Или «руки в перчатках» у кассы.', tech: 'Требование, которое заинтересованные лица считают само собой разумеющимся и не формулируют; выявляется наблюдением, вопросами «а что если…» и при нарушении.' },
      { term: 'Обходной путь', simple: '«Отложи мне бородинский» — предзаказа нет, а люди всё равно заказывают, по-своему.', tech: 'Workaround — способ, которым пользователи выполняют работу в обход правил или возможностей системы. Указывает на неудовлетворённую потребность — будущее требование.' },
      { term: 'Активное и пассивное наблюдение', simple: 'Активное — спрашиваете по ходу. Пассивное — молчите и смотрите, вопросы потом.', tech: 'BABOK v3: active/noticeable — наблюдатель задаёт вопросы во время работы; passive/unnoticeable — не вмешивается, вопросы после. Пассивное точнее показывает обычную работу, активное быстрее объясняет «почему».' },
      { term: 'Наблюдение и вывод', simple: '«4 раза за 10 минут под прилавок» — наблюдение. «Кассир суетится» — вывод.', tech: 'Наблюдение — проверяемый факт: кто, что сделал, когда, сколько раз, дословные слова. Вывод (интерпретация) — смысл, который придал наблюдатель. В заметках их разделяют (лестница выводов, Крис Аргирис).' },
      { term: 'Эффект наблюдателя', simple: 'При чужом человеке все работают «по инструкции». Через полчаса привыкают.', tech: 'Изменение поведения людей, когда они знают, что за ними наблюдают (хоторнский эффект). Снижают: приходят заранее, остаются дольше, наблюдают в пик, держатся в стороне.' },
      { term: 'Контекстное исследование', simple: 'Как ученик у мастера: смотрите, как он работает, и в паузах спрашиваете «почему так?».', tech: 'Contextual inquiry (Хью Бейер, Карен Хольцблатт): наблюдение и беседа на рабочем месте пользователя в модели «мастер — ученик».' },
      { term: 'Противоречие требований', simple: 'Олег хочет только онлайн-оплату, Нина — оплату на месте. Обе вместе в лоб не выполнить.', tech: 'Ситуация, когда выполнение одного требования нарушает другое. Свойство «непротиворечивость набора» (ISO/IEC/IEEE 29148). Разрешается через интересы, варианты и решение владельца продукта.' },
      { term: 'Позиция и интерес', simple: 'Позиция — «только онлайн». Интерес — «не сверять руками два часа».', tech: 'Фишер и Юри («Переговоры без поражения»): позиция — то, что человек решил; интерес — почему он так решил. Переговоры по интересам открывают варианты, которых нет в позициях.' }
    ],
    outro: 'Теперь вы знаете, чем смена отличается от рассказа о смене. Неявные требования не прозвучат на интервью — их видно руками кассира, пакетами на полу и кассой без связи. Наблюдение записываем по времени и с цифрами, выводы держим отдельно, вопросы задаём в паузах, людей не снимаем. Каждая заметка ведёт к требованию с источником, а противоречия — к вариантам с ценой и решению Нины. Завтра в 11:00 — обзор техник выявления: когда смотреть, когда спрашивать, когда раздавать анкету и собирать воркшоп.',
    tasks: [howWhy, howHow, howUse, shiftTask, interpTask, saydoTask, toreqTask, conflictTask]
  });
})();
