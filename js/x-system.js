/* Раздел «Система „Колос“ вживую» — мини-проект будущей системы сети пекарен для новичков-аналитиков.
   Вкладки: «Экраны» (телефон покупателя, планшеты кассира и цеха, режим «Глазами аналитика» и состояния экранов),
   «Как это связано» (схема: экраны → бэкенд и модули → база → внешние системы, карточки блоков),
   «Живой сценарий» (заказ бежит по схеме шаг за шагом, параллельно меняются база, экран кассира, план цеха, статус;
   варианты «Что если»), «Данные» (таблицы базы, один заказ глазами покупателя и базы, схема связей),
   «Статусы» (диаграммы состояний предзаказа и торта с кликабельными переходами).
   API: TR.system.open(view) — полноэкранный оверлей; TR.system.mount(el, { view, compact, only, onChange }) — встраивание.
   view — 'screens' | 'map' | 'live' | 'data' | 'status', можно с уточнениями: 'live/12/fail', 'screens/cash/an/offline'.
   Состояние — только в памяти модуля. Цифры и правила — канон _dev/DOMAIN.md. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;

  if (!document.getElementById('ksys-css')) document.head.insertAdjacentHTML('beforeend', `<style id="ksys-css">
  /* ---------- оверлей и каркас ---------- */
  .ksys-ov { position: fixed; inset: 0; z-index: 68; background: var(--bg); overflow-y: auto; overflow-x: hidden; overscroll-behavior: contain; padding: env(safe-area-inset-top, 0px) env(safe-area-inset-right, 0px) env(safe-area-inset-bottom, 0px) env(safe-area-inset-left, 0px); }
  .ksys-ov::before { content: ""; position: fixed; inset: 0; pointer-events: none; background: radial-gradient(800px 420px at 85% -10%, var(--glow-a), transparent 70%), radial-gradient(700px 380px at 10% 110%, var(--glow-b), transparent 70%); }
  .ksys-ov-in { position: relative; max-width: 1240px; margin: 0 auto; padding: 0 20px 64px; }
  .ksys-root { position: relative; display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; min-width: 0; }
  .ksys-root > *, .ksys-pane > *, .ksys-v > * { min-width: 0; }
  .ksys-bar { position: sticky; top: 0; z-index: 6; display: flex; align-items: center; gap: 12px; padding: 10px 0; background: color-mix(in srgb, var(--bg) 90%, transparent); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-bottom: 1px solid var(--border); }
  .ksys-bar.flat { position: static; background: none; backdrop-filter: none; -webkit-backdrop-filter: none; border-bottom: 0; padding: 0; }
  .ksys-brand { display: flex; align-items: center; gap: 8px; font: 700 16px/1.2 var(--f-brand); white-space: nowrap; flex: none; }
  .ksys-tabs { display: flex; gap: 6px; overflow-x: auto; flex: 1 1 auto; min-width: 0; padding: 2px; scrollbar-width: thin; }
  .ksys-tab { display: inline-flex; align-items: center; gap: 7px; border: 1px solid var(--border); background: var(--surface); color: var(--text-2); border-radius: 10px; padding: 7px 12px; font-weight: 600; font-size: 14px; white-space: nowrap; flex: none; }
  .ksys-tab:hover { color: var(--text); border-color: var(--border-strong); }
  .ksys-tab[aria-selected="true"] { background: var(--accent-soft); border-color: var(--accent); color: var(--accent); box-shadow: 0 0 0 1px var(--accent) inset; }
  .ksys-tab .i { font-size: 15px; }
  .ksys-x { flex: none; }
  .ksys-head { display: grid; gap: 6px; padding-top: 14px; }
  .ksys-head h1 { font: 700 clamp(26px, 3.6vw, 38px)/1.1 var(--f-brand); letter-spacing: -.01em; }
  .ksys-head h1 em { font-style: normal; background: var(--brand); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .ksys-head p { color: var(--text-2); max-width: 82ch; }
  .ksys-an4 { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
  .ksys-an4 button { text-align: left; display: grid; grid-template-columns: 30px minmax(0, 1fr); gap: 0 8px; align-items: center; border: 1px solid var(--border); background: var(--surface); border-radius: 10px; padding: 8px 10px; color: var(--text); }
  .ksys-an4 button:hover { border-color: var(--accent); }
  .ksys-an4 .i { grid-row: span 2; font-size: 20px; }
  .ksys-an4 b { font: 600 13.5px/1.25 var(--f-brand); }
  .ksys-an4 small { color: var(--text-2); font-size: 12.5px; line-height: 1.3; }
  .ksys-pane { display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; min-width: 0; scroll-margin-top: 70px; }
  .ksys-v { display: grid; grid-template-columns: minmax(0, 1fr); gap: 14px; min-width: 0; }
  .ksys-seg { max-width: 100%; }
  .ksys-seg button { white-space: nowrap; }
  .ksys-flash { animation: ksys-flash 1.3s ease-out 1; }
  @keyframes ksys-flash { 0% { box-shadow: 0 0 0 3px var(--warn); } 100% { box-shadow: 0 0 0 0 transparent; } }
  .ksys-spin { width: 24px; height: 24px; border-radius: 50%; border: 3px solid var(--surface-3); border-top-color: var(--accent); animation: ksys-rot 1s linear infinite; display: inline-block; flex: none; }
  @keyframes ksys-rot { to { transform: rotate(360deg); } }
  .ksys-f { display: inline-flex; align-items: center; gap: 6px; border: 1px solid color-mix(in srgb, var(--warn) 45%, var(--border)); background: var(--warn-soft); color: var(--warn); border-radius: 99px; padding: 1px 8px; font: 600 11.5px/1.5 var(--f-mono); max-width: 100%; text-align: left; }
  .ksys-f span { font: 500 12px/1.3 var(--f-body); color: var(--text-2); }
  .ksys-f:hover { border-color: var(--warn); }
  .ksys-pop { position: absolute; z-index: 20; display: grid; gap: 6px; background: var(--surface); border: 1px solid var(--border-strong); border-radius: 12px; box-shadow: var(--shadow-lg); padding: 10px 12px; font-size: 14px; }
  .ksys-legend { display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: 12.5px; color: var(--text-2); }
  .ksys-legend span { display: inline-flex; align-items: center; gap: 6px; }
  .ksys-legend i { width: 10px; height: 10px; border-radius: 3px; background: var(--k); flex: none; }
  .ksys-legend span.fin::before { content: ""; width: 14px; height: 10px; border: 3px double var(--text-2); border-radius: 3px; }
  .ksys-legend.wide { margin-top: 8px; }
  .ksys-stt { display: inline-block; font: 600 12px/1 var(--f-mono); padding: 5px 9px; border-radius: 99px; background: var(--surface-3); color: var(--text); white-space: nowrap; }
  .ksys-stt.ok { background: var(--ok-soft); color: var(--ok); } .ksys-stt.warn { background: var(--warn-soft); color: var(--warn); } .ksys-stt.bad { background: var(--bad-soft); color: var(--bad); }
  .ksys-code { font: 700 34px/1.1 var(--f-mono); letter-spacing: .04em; color: var(--text); }
  .ksys-code.sm { font-size: 22px; }
  .nowrap { white-space: nowrap; }

  /* ---------- метки «Глазами аналитика» ---------- */
  .ksys-k-rule { --k: var(--warn); } .ksys-k-data { --k: var(--info); } .ksys-k-state { --k: var(--violet); } .ksys-k-int { --k: var(--cyan); }
  .ksys-pin { display: none; position: absolute; top: -9px; right: -9px; z-index: 4; width: 20px; height: 20px; border-radius: 50%; place-items: center; background: var(--k); color: var(--bg); font: 700 11px/1 var(--f-mono); box-shadow: 0 0 0 2px var(--bg); cursor: pointer; }
  .ksys-pin.st { display: grid; position: static; flex: none; box-shadow: none; }
  .ksys-an .ksys-pp { position: relative; outline: 1.5px dashed var(--k); outline-offset: 2px; }
  .ksys-an .ksys-pin { display: grid; }
  .ksys-an span.ksys-pp, .ksys-an small.ksys-pp { padding-right: 12px; }
  .ksys-ping { animation: ksys-ping 1.4s ease-out 1; }
  @keyframes ksys-ping { 0%, 40% { box-shadow: 0 0 0 4px var(--k); } 100% { box-shadow: 0 0 0 0 transparent; } }

  /* ---------- 1. Экраны ---------- */
  .ksys-scr-top { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: space-between; }
  .ksys-devs { display: flex; flex-wrap: wrap; gap: 6px; }
  .ksys-dv { display: inline-flex; align-items: center; gap: 8px; border: 1px solid var(--border-strong); background: var(--surface); border-radius: 12px; padding: 9px 14px; font-weight: 600; color: var(--text-2); }
  .ksys-dv[aria-pressed="true"] { border-color: var(--info); background: var(--info-soft); color: var(--info); box-shadow: 0 0 0 1px var(--info) inset; }
  .ksys-dv .sh { display: none; }
  .ksys-antg { display: inline-flex; align-items: center; gap: 10px; border: 1px solid var(--border-strong); background: var(--surface); border-radius: 99px; padding: 7px 14px 7px 8px; font-weight: 600; color: var(--text); }
  .ksys-antg .sw { width: 36px; height: 20px; border-radius: 99px; background: var(--surface-3); border: 1px solid var(--border-strong); position: relative; transition: background .2s; flex: none; }
  .ksys-antg .sw::after { content: ""; position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: var(--text-muted); transition: transform .2s, background .2s; }
  .ksys-antg[aria-pressed="true"] { border-color: var(--warn); background: var(--warn-soft); }
  .ksys-antg[aria-pressed="true"] .sw { background: var(--warn); border-color: var(--warn); }
  .ksys-antg[aria-pressed="true"] .sw::after { transform: translateX(16px); background: var(--bg); }
  .ksys-scr-ctl { display: flex; flex-wrap: wrap; gap: 8px 18px; align-items: center; }
  .ksys-ctl { display: flex; flex-wrap: wrap; gap: 6px 8px; align-items: center; min-width: 0; }
  .ksys-scr { display: grid; gap: 18px; align-items: start; }
  .ksys-scr.is-phone { grid-template-columns: 340px minmax(0, 1fr); }
  .ksys-scr.is-cash, .ksys-scr.is-shop { grid-template-columns: minmax(0, 1fr) minmax(280px, 360px); }
  .ksys-devbox { min-width: 0; display: grid; justify-items: center; padding: 10px 0; }
  .ksys-side { display: grid; gap: 12px; min-width: 0; }
  .ksys-side-c { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 12px 14px; display: grid; gap: 8px; min-width: 0; }
  .ksys-side-c h3 { font: 600 17px/1.25 var(--f-brand); }
  .ksys-side-an { border-color: color-mix(in srgb, var(--warn) 45%, var(--border)); background: var(--warn-soft); justify-items: start; }
  .ksys-tips { margin: 0; padding-left: 20px; display: grid; gap: 6px; font-size: 14px; }
  .ksys-sim { display: grid; gap: 8px; border-top: 1px dashed var(--border); padding-top: 10px; }
  .ksys-pis { display: grid; gap: 6px; }
  .ksys-pi { display: grid; grid-template-columns: 20px minmax(0, 1fr); gap: 10px; align-items: start; padding: 8px 10px; border: 1px solid var(--border); border-left: 3px solid var(--k); border-radius: 9px; background: var(--surface-2); cursor: pointer; font-size: 13.5px; line-height: 1.4; }
  .ksys-pi:hover { border-color: var(--k); }
  .ksys-pi.hl { background: color-mix(in srgb, var(--k) 12%, var(--surface-2)); border-color: var(--k); }
  .ksys-pi-b { display: grid; gap: 3px; min-width: 0; }
  .ksys-pi-k { font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--k); }
  .ksys-pi-m { display: flex; flex-wrap: wrap; gap: 5px; align-items: center; }
  .ksys-pi-m code { font-size: 11.5px; overflow-wrap: anywhere; }
  .ksys-sts { display: grid; gap: 6px; }
  .ksys-sti { display: grid; gap: 2px; text-align: left; border: 1px solid var(--border); border-radius: 9px; padding: 7px 10px; background: var(--surface-2); color: var(--text); font-size: 13.5px; }
  .ksys-sti span { color: var(--text-2); font-size: 12.5px; }
  .ksys-sti em { font-style: normal; font-size: 12.5px; color: var(--violet); border-top: 1px dashed var(--border); padding-top: 4px; margin-top: 2px; }
  .ksys-sti[aria-pressed="true"] { border-color: var(--violet); background: var(--violet-soft); }

  /* телефон */
  .ksys-phone { width: 320px; max-width: 100%; border-radius: 40px; padding: 10px; background: var(--surface-3); border: 1px solid var(--border-strong); box-shadow: var(--shadow-lg); }
  .ksys-ph-scr { position: relative; border-radius: 31px; overflow: hidden; background: var(--bg); height: 640px; display: grid; grid-template-rows: auto auto minmax(0, 1fr) auto; border: 1px solid var(--border); font-size: 14px; }
  .ksys-ph-sb { display: flex; justify-content: space-between; align-items: center; padding: 9px 20px 5px; font: 600 11.5px/1 var(--f-mono); color: var(--text); background: var(--surface); }
  .ksys-ph-sb .notch { width: 78px; height: 20px; border-radius: 12px; background: var(--surface-3); }
  .ksys-ph-hd { display: grid; gap: 6px; padding: 4px 14px 10px; background: var(--surface); border-bottom: 1px solid var(--border); }
  .ksys-ph-brand { display: flex; align-items: center; gap: 6px; font: 700 15px/1 var(--f-brand); }
  .ksys-logo { width: 24px; height: 24px; border-radius: 7px; display: grid; place-items: center; background: color-mix(in srgb, var(--p3) 25%, var(--surface)); font-size: 14px; }
  .ksys-ph-steps { margin-left: auto; display: flex; gap: 4px; }
  .ksys-ph-steps i { width: 16px; height: 4px; border-radius: 4px; background: var(--surface-3); }
  .ksys-ph-steps i.done { background: color-mix(in srgb, var(--accent) 55%, var(--surface-3)); } .ksys-ph-steps i.on { background: var(--accent); }
  .ksys-ph-title { display: flex; align-items: center; gap: 8px; font: 600 15px/1.25 var(--f-brand); min-width: 0; }
  .ksys-ph-title span { min-width: 0; overflow-wrap: anywhere; }
  .ksys-ph-back { width: 30px; height: 30px; border-radius: 50%; border: 1px solid var(--border-strong); background: var(--surface-2); flex: none; padding: 0; }
  .ksys-ph-body { overflow-y: auto; overflow-x: hidden; padding: 12px 12px 16px; display: grid; gap: 9px; align-content: start; scrollbar-width: thin; }
  .ksys-ph-ft { display: grid; gap: 6px; padding: 10px 12px 14px; background: var(--surface); border-top: 1px solid var(--border); }
  .ksys-ph-ft small { color: var(--text-muted); font-size: 12px; text-align: center; }
  .ksys-ph-btn { min-height: 44px; border-radius: 12px; border: 0; background: var(--accent); color: var(--accent-text); font-weight: 700; font-size: 14.5px; padding: 8px 12px; }
  .ksys-ph-btn:disabled { background: var(--surface-3); color: var(--text-muted); opacity: 1; }
  .ksys-ph-btn.ghost { background: var(--surface-2); color: var(--text); border: 1px solid var(--border-strong); }
  .ksys-ph-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
  .ksys-ph-2 button:not(.ksys-ph-btn) { border: 1px solid var(--border-strong); background: var(--surface); border-radius: 9px; padding: 7px 8px; font-weight: 600; font-size: 13px; }
  .ksys-ph-h2 { font: 600 13px/1.3 var(--f-brand); color: var(--text-2); margin-top: 4px; display: flex; gap: 8px; align-items: baseline; justify-content: space-between; }
  .ksys-ph-h2 small { font: 400 11.5px/1.2 var(--f-body); color: var(--text-muted); }
  .ksys-ph-list { display: grid; gap: 6px; }
  .ksys-ph-opt { display: grid; gap: 1px; text-align: left; border: 1px solid var(--border); border-radius: 11px; padding: 8px 11px; background: var(--surface); color: var(--text); min-width: 0; }
  .ksys-ph-opt b { font-weight: 600; font-size: 14px; }
  .ksys-ph-opt small { color: var(--text-muted); font-size: 12px; line-height: 1.3; }
  .ksys-ph-opt[aria-pressed="true"] { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent) inset; background: var(--accent-soft); }
  .ksys-ph-opt:disabled { opacity: .55; }
  .ksys-ph-opt.radio { grid-template-columns: 18px minmax(0, 1fr); column-gap: 9px; }
  .ksys-ph-opt.radio::before { content: ""; grid-row: span 2; width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--border-strong); align-self: center; }
  .ksys-ph-opt.radio[aria-pressed="true"]::before { border-color: var(--accent); background: radial-gradient(circle, var(--accent) 45%, transparent 50%); }
  .ksys-ph-more { font-size: 12.5px; color: var(--text-muted); padding: 2px 4px; }
  .ksys-ph-days { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
  .ksys-ph-note { border-radius: 10px; padding: 8px 10px; font-size: 12.5px; line-height: 1.4; background: var(--info-soft); border: 1px solid color-mix(in srgb, var(--info) 30%, transparent); }
  .ksys-ph-note.warn { background: var(--warn-soft); border-color: color-mix(in srgb, var(--warn) 35%, transparent); }
  .ksys-ph-note.bad { background: var(--bad-soft); border-color: color-mix(in srgb, var(--bad) 35%, transparent); }
  .ksys-ph-note .ksys-ph-2 { margin-top: 8px; }
  .ksys-slots { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 5px; }
  .ksys-slot { display: grid; gap: 0; justify-items: center; border: 1px solid var(--border); border-radius: 9px; padding: 6px 2px; background: var(--surface); font: 600 12.5px/1.2 var(--f-mono); color: var(--text); min-width: 0; }
  .ksys-slot small { font: 500 10px/1.2 var(--f-body); color: var(--warn); }
  .ksys-slot[aria-pressed="true"] { border-color: var(--accent); background: var(--accent); color: var(--accent-text); }
  .ksys-slot[aria-pressed="true"] small { color: var(--accent-text); }
  .ksys-prod { display: grid; grid-template-columns: 40px minmax(0, 1fr) auto; grid-template-areas: "i n p" "i a q"; column-gap: 9px; row-gap: 3px; align-items: center; padding: 7px 9px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); }
  .ksys-prod-ico { grid-area: i; width: 40px; height: 40px; border-radius: 10px; display: grid; place-items: center; font-size: 22px; background: color-mix(in srgb, var(--p3) 16%, var(--surface-2)); }
  .ksys-prod-n { grid-area: n; font-size: 13.5px; font-weight: 600; line-height: 1.25; min-width: 0; }
  .ksys-prod-a { grid-area: a; font-size: 11.5px; color: var(--text-muted); line-height: 1.25; justify-self: start; min-width: 0; }
  .ksys-prod-p { grid-area: p; font: 600 13px/1 var(--f-mono); justify-self: end; white-space: nowrap; }
  .ksys-qty { grid-area: q; display: flex; align-items: center; gap: 6px; justify-self: end; }
  .ksys-qty button { width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--border-strong); background: var(--surface-2); font-weight: 700; padding: 0; }
  .ksys-qty span { min-width: 1.4ch; text-align: center; font-weight: 700; }
  .ksys-prod.off .ksys-prod-ico, .ksys-prod.off .ksys-prod-n, .ksys-prod.off .ksys-prod-p { opacity: .5; }
  .ksys-prod.off .ksys-prod-a { color: var(--bad); }
  .ksys-ph-cake { display: grid; grid-template-columns: 28px minmax(0, 1fr); gap: 8px; align-items: center; padding: 8px 10px; border: 1px dashed var(--border-strong); border-radius: 12px; font-size: 20px; }
  .ksys-ph-cake div { display: grid; gap: 1px; font-size: 13px; }
  .ksys-ph-cake small { font-size: 11.5px; color: var(--text-muted); line-height: 1.3; }
  .ksys-ph-sum { display: flex; justify-content: space-between; gap: 8px; font-size: 13.5px; }
  .ksys-ph-card { display: grid; gap: 4px; border: 1px solid var(--border); border-radius: 12px; padding: 10px 11px; background: var(--surface); font-size: 13.5px; }
  .ksys-ph-li { display: flex; justify-content: space-between; gap: 8px; align-items: center; font-size: 13.5px; }
  .ksys-ph-li.tot { border-top: 1px dashed var(--border); padding-top: 5px; margin-top: 2px; }
  .ksys-ph-okbox { display: grid; justify-items: center; gap: 4px; text-align: center; padding: 6px 0 4px; }
  .ksys-ph-okbox small { color: var(--text-muted); font-size: 12px; }
  .ksys-ph-okic { width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center; font-size: 24px; font-weight: 700; background: var(--ok-soft); color: var(--ok); }
  .ksys-ph-okbox.canc .ksys-ph-okic { background: var(--bad-soft); color: var(--bad); }
  .ksys-st-msg { display: grid; justify-items: center; text-align: center; gap: 6px; padding: 24px 10px; color: var(--text-2); font-size: 13.5px; }
  .ksys-st-msg .ico { font-size: 34px; }
  .ksys-st-msg b { color: var(--text); font-size: 15px; }
  .ksys-st-msg .ksys-ph-btn { margin-top: 6px; min-width: 160px; }
  .ksys-skel { display: grid; gap: 8px; }
  .ksys-skel i { display: block; height: 44px; border-radius: 10px; background: linear-gradient(90deg, var(--surface-2), var(--surface-3), var(--surface-2)); background-size: 200% 100%; animation: ksys-sh 1.4s linear infinite; }
  .ksys-skel i.s { height: 22px; width: 60%; }
  .ksys-skel.cards i { height: 96px; }
  @keyframes ksys-sh { to { background-position: -200% 0; } }
  /* страница «ПэйМост» — чужой экран */
  .ksys-pm { position: absolute; inset: 40px 0 0; z-index: 5; display: grid; grid-template-rows: auto minmax(0, 1fr); background: var(--surface-2); border-top: 3px solid var(--violet); border-radius: 18px 18px 0 0; box-shadow: 0 -10px 30px rgba(0, 0, 0, .25); animation: ksys-up .25s ease-out; }
  @keyframes ksys-up { from { transform: translateY(30px); opacity: 0; } }
  .ksys-pm-url { font: 600 11.5px/1 var(--f-mono); color: var(--text-2); text-align: center; padding: 10px; border-bottom: 1px solid var(--border); }
  .ksys-pm-b { overflow-y: auto; padding: 14px; display: grid; gap: 9px; align-content: start; }
  .ksys-pm-logo { font: 700 20px/1 var(--f-brand); color: var(--violet); letter-spacing: .02em; }
  .ksys-pm-sum { font: 700 26px/1.1 var(--f-mono); }
  .ksys-pm-f { display: grid; gap: 2px; border: 1px solid var(--border-strong); border-radius: 9px; padding: 7px 10px; background: var(--surface); font-size: 13px; }
  .ksys-pm-f span { font-size: 11.5px; color: var(--text-muted); }
  .ksys-pm-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .ksys-pm-btn { min-height: 44px; border-radius: 10px; border: 0; background: var(--violet); color: var(--bg); font-weight: 700; font-size: 14.5px; }
  .ksys-pm-alt { border: 1px dashed var(--bad); background: var(--bad-soft); color: var(--bad); border-radius: 10px; padding: 7px; font-size: 13px; font-weight: 600; }
  .ksys-pm-note { font-size: 11.5px; color: var(--text-muted); text-align: center; }
  .ksys-qr { width: 120px; height: 120px; justify-self: center; border-radius: 8px; border: 6px solid var(--surface); background: repeating-conic-gradient(var(--text) 0 25%, var(--surface) 0 50%) 0 0 / 20px 20px; }

  /* планшеты */
  .ksys-tdev { width: 100%; max-width: 820px; border-radius: 26px; padding: 14px; background: var(--surface-3); border: 1px solid var(--border-strong); box-shadow: var(--shadow-lg); }
  .ksys-tscr { border-radius: 14px; overflow: hidden; background: var(--bg); border: 1px solid var(--border); display: grid; align-content: start; min-height: 480px; }
  .ksys-tb-top { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; padding: 10px 14px; background: var(--surface); border-bottom: 1px solid var(--border); }
  .ksys-tb-brand { font: 700 15px/1.2 var(--f-brand); }
  .ksys-tb-clock { font: 600 14px/1 var(--f-mono); color: var(--text-2); }
  .ksys-net { margin-left: auto; font-weight: 600; font-size: 13px; color: var(--ok); background: var(--ok-soft); border-radius: 99px; padding: 5px 10px; }
  .ksys-net.off { color: var(--warn); background: var(--warn-soft); }
  .ksys-tb-ban { margin: 10px 14px 0; border-radius: 10px; padding: 9px 12px; font-size: 13.5px; border: 1px solid var(--border); background: var(--surface-2); }
  .ksys-tb-ban.ok { background: var(--ok-soft); border-color: color-mix(in srgb, var(--ok) 35%, transparent); }
  .ksys-tb-ban.bad { background: var(--bad-soft); border-color: color-mix(in srgb, var(--bad) 35%, transparent); }
  .ksys-tb-ban.warn { background: var(--warn-soft); border-color: color-mix(in srgb, var(--warn) 35%, transparent); }
  .ksys-tb-ban.info { background: var(--info-soft); border-color: color-mix(in srgb, var(--info) 30%, transparent); }
  .ksys-big { min-height: 52px; border-radius: 12px; border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text); font-weight: 700; font-size: 16px; padding: 8px 18px; }
  .ksys-big.primary { background: var(--accent); border-color: transparent; color: var(--accent-text); }
  .ksys-big.ghost { background: var(--surface); }
  .ksys-big.sm { min-height: 40px; font-size: 14px; padding: 6px 12px; }
  .ksys-big[aria-pressed="true"] { border-color: var(--info); background: var(--info-soft); color: var(--info); }
  .ksys-cash { display: grid; grid-template-columns: minmax(0, 1fr) 210px; gap: 14px; padding: 12px 14px 16px; align-items: start; }
  .ksys-cash-l { display: grid; gap: 10px; min-width: 0; }
  .ksys-ivs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
  .ksys-iv { display: grid; gap: 1px; text-align: center; border: 1px solid var(--border); border-radius: 11px; padding: 7px 4px; background: var(--surface); color: var(--text); min-width: 0; }
  .ksys-iv b { font-size: 14px; font-family: var(--f-mono); }
  .ksys-iv small { font-size: 11.5px; color: var(--text-muted); }
  .ksys-iv[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); box-shadow: 0 0 0 1px var(--accent) inset; }
  .ksys-ocs { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 8px; }
  .ksys-oc { display: grid; gap: 6px; align-content: start; border: 1px solid var(--border); border-radius: 12px; padding: 10px; background: var(--surface); min-width: 0; }
  .ksys-oc.mine { border-color: var(--info); box-shadow: 0 0 0 1px var(--info) inset; }
  .ksys-oc.done { opacity: .65; }
  .ksys-oc-h { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
  .ksys-oc-code { font: 700 24px/1 var(--f-mono); margin-right: auto; }
  .ksys-oc-it { font-size: 13.5px; }
  .ksys-oc-st { font-size: 12.5px; }
  .ksys-oc-a { display: grid; }
  .ksys-oc-done { font-size: 13px; color: var(--ok); font-weight: 600; }
  .ksys-hold { border: 1px dashed var(--warn); background: var(--warn-soft); border-radius: 10px; padding: 8px 10px; font-size: 13px; }
  .ksys-kp { display: grid; gap: 8px; }
  .ksys-kp-scr { border: 1px solid var(--border-strong); border-radius: 10px; padding: 8px 10px; background: var(--surface); font-size: 22px; display: flex; gap: 8px; align-items: baseline; justify-content: center; }
  .ksys-kp-scr .dim { font-size: 12px; }
  .ksys-kp-g { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
  .ksys-kp-g button { min-height: 50px; border-radius: 11px; border: 1px solid var(--border-strong); background: var(--surface); font: 700 20px/1 var(--f-mono); color: var(--text); }
  .ksys-kp-g button:active { background: var(--accent-soft); }
  .ksys-shop { display: grid; gap: 16px; padding: 12px 14px 16px; }
  .ksys-shop section { display: grid; gap: 8px; min-width: 0; }
  .ksys-shop h4 { font: 600 15px/1.25 var(--f-brand); }
  .ksys-plan { display: grid; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; background: var(--surface); }
  .ksys-plan-r { display: grid; grid-template-columns: minmax(110px, 1.2fr) 74px 124px 62px minmax(60px, 1.3fr); gap: 12px; align-items: center; padding: 7px 12px; border-top: 1px solid var(--border); font-size: 14px; }
  .ksys-plan-r:first-child { border-top: 0; }
  .ksys-plan-r.h { background: var(--surface-2); font: 600 12px/1.3 var(--f-body); color: var(--text-2); padding-top: 11px; }
  .ksys-plan-r > span:not(.bar):nth-child(2), .ksys-plan-r > b, .ksys-plan-r > span:nth-child(3) { text-align: right; justify-self: end; }
  .ksys-plan-r .chg { color: var(--info); font-weight: 600; }
  .ksys-plan-r .plus { color: var(--accent); font-weight: 600; display: grid; justify-items: end; }
  .ksys-plan-r .plus em { font-style: normal; font-size: 11px; color: var(--info); }
  .ksys-plan-r .bar { display: flex; height: 10px; border-radius: 5px; overflow: hidden; background: var(--surface-3); }
  .ksys-plan-r .bar i { display: block; height: 100%; background: color-mix(in srgb, var(--text-muted) 55%, transparent); }
  .ksys-plan-r .bar i.pre { background: var(--accent); }
  .ksys-plan-r.h .bar { background: none; }
  .ksys-plan-f { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; font-size: 13.5px; }
  .ksys-cakes-h { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; }
  .ksys-cap { display: grid; grid-template-columns: auto 110px; gap: 8px; align-items: center; font-size: 13.5px; }
  .ksys-cks { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 8px; }
  .ksys-ck { display: grid; grid-template-columns: 86px minmax(0, 1fr); gap: 10px; border: 1px solid var(--border); border-radius: 12px; padding: 9px; background: var(--surface); align-items: start; }
  .ksys-ck-b { display: grid; gap: 3px; min-width: 0; font-size: 13px; }
  .ksys-ck-b small { color: var(--text-2); font-size: 12px; }
  .ksys-ck-b small.ok { color: var(--ok); }
  .ksys-ck-b .ksys-big { margin-top: 4px; }
  .ksys-ck-txt { font: 600 14px/1.3 var(--f-brand); font-style: italic; }
  .ksys-cake { position: relative; width: 86px; height: 86px; border-radius: 10px; overflow: hidden; border: 1px solid var(--border); background: repeating-linear-gradient(45deg, var(--surface-2) 0 7px, var(--surface-3) 7px 14px); }
  .ksys-cake i { position: absolute; left: 50%; transform: translateX(-50%); display: block; }
  .ksys-cake .pl { bottom: 15px; width: 72px; height: 6px; border-radius: 6px; background: var(--border-strong); }
  .ksys-cake .t1 { bottom: 20px; width: 58px; height: 22px; border-radius: 5px 5px 2px 2px; background: var(--c1); }
  .ksys-cake .t2 { bottom: 41px; width: 40px; height: 17px; border-radius: 5px 5px 2px 2px; background: var(--c2); }
  .ksys-cake .cr { bottom: 55px; width: 44px; height: 5px; border-radius: 5px; background: var(--surface); }
  .ksys-cake .cd { bottom: 59px; width: 4px; height: 12px; border-radius: 2px; background: var(--p3); }
  .ksys-cake small { position: absolute; left: 0; right: 0; bottom: 0; font-size: 9px; line-height: 13px; text-align: center; background: color-mix(in srgb, var(--bg) 75%, transparent); color: var(--text-2); }
  .ksys-load { display: grid; gap: 6px; border: 1px solid var(--border); border-radius: 12px; padding: 10px 12px; background: var(--surface); font-size: 13.5px; }
  .ksys-load-r { display: grid; grid-template-columns: 80px minmax(0, 1fr) 64px; gap: 10px; align-items: center; }
  .ksys-load-r .tnum { text-align: right; }

  /* ---------- 2. Схема ---------- */
  .ksys-map-top { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: space-between; }
  .ksys-map-top p { flex: 1 1 380px; }
  .ksys-board { overflow-x: auto; overflow-y: hidden; scrollbar-width: thin; }
  .ksys-board > svg { display: block; width: 100%; min-width: 760px; height: auto; }
  .ksys-board.sm > svg { min-width: 720px; }
  .ksys-colt { font: 600 11px var(--f-mono); letter-spacing: .12em; fill: var(--text-muted); }
  .ksys-note { font-size: 11.5px; fill: var(--text-muted); }
  .ksys-be { fill: color-mix(in srgb, var(--accent) 5%, transparent); stroke: color-mix(in srgb, var(--accent) 45%, var(--border)); stroke-width: 1.5; stroke-dasharray: 7 5; }
  .ksys-bet { font: 700 15px var(--f-brand); fill: var(--text); }
  .ksys-bes { font-size: 11.5px; fill: var(--text-2); }
  .ksys-e { fill: none; stroke: var(--border-strong); stroke-width: 1.6; }
  .ksys-e.in { stroke-dasharray: 3 4; }
  .ksys-e.bus { stroke: color-mix(in srgb, var(--cyan) 60%, var(--border)); stroke-width: 3; }
  .ksys-e.dash { stroke-dasharray: 6 5; }
  .ksys-node { cursor: pointer; outline: none; }
  .ksys-node .bx { fill: color-mix(in srgb, var(--nc) 9%, var(--surface)); stroke: color-mix(in srgb, var(--nc) 50%, var(--border)); stroke-width: 1.4; transition: stroke-width .2s; }
  .ksys-node .bx.top { fill: color-mix(in srgb, var(--nc) 18%, var(--surface)); }
  .ksys-node .st { fill: var(--nc); }
  .ksys-node .ti { font-size: 18px; }
  .ksys-node .tt { font: 600 13px var(--f-body); fill: var(--text); }
  .ksys-node .ts { font-size: 11.5px; fill: var(--text-2); }
  .ksys-node:hover .bx, .ksys-node:focus-visible .bx { stroke: var(--nc); stroke-width: 2.2; }
  .ksys-node.sel .bx { stroke: var(--nc); stroke-width: 3; }
  .ksys-node.on .bx { stroke: var(--nc); stroke-width: 2.8; fill: color-mix(in srgb, var(--nc) 20%, var(--surface)); }
  .ksys-hop { fill: none; stroke: var(--accent); stroke-width: 3.2; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 9 6; animation: ksys-march .8s linear infinite; }
  .ksys-hop.res { stroke: var(--info); }
  .ksys-hop.ok { stroke: var(--ok); } .ksys-hop.bad { stroke: var(--bad); } .ksys-hop.warn { stroke: var(--warn); }
  @keyframes ksys-march { to { stroke-dashoffset: -15; } }
  .ksys-dot { fill: var(--accent); stroke: var(--bg); stroke-width: 2.5; }
  .ksys-dot.res { fill: var(--info); } .ksys-dot.ok { fill: var(--ok); } .ksys-dot.bad { fill: var(--bad); } .ksys-dot.warn { fill: var(--warn); }
  .ksys-hl rect { fill: var(--surface); stroke: var(--border-strong); }
  .ksys-hl text { font: 600 12.5px var(--f-body); fill: var(--text); }
  .ksys-ring { fill: none; stroke: var(--accent); stroke-width: 3; stroke-dasharray: 8 5; animation: ksys-march .8s linear infinite; }
  .ksys-ring.bad { stroke: var(--bad); } .ksys-ring.warn { stroke: var(--warn); } .ksys-ring.ok { stroke: var(--ok); }
  .ksys-tbadge { font-size: 18px; }
  .ksys-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 14px 16px; display: grid; gap: 10px; min-width: 0; }
  .ksys-card-empty { font-size: 14px; display: block; }
  .ksys-card-empty > p, .ksys-card-empty > .ksys-legend { margin-top: 8px; }
  .ksys-card-empty > .btn { margin-left: 6px; }
  .ksys-card-h { display: flex; align-items: center; gap: 12px; }
  .ksys-card-h > div { flex: 1; min-width: 0; }
  .ksys-card-h h3 { font: 600 19px/1.25 var(--f-brand); }
  .ksys-card-ico { width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center; font-size: 22px; background: var(--surface-2); border: 1px solid var(--border); flex: none; }
  .ksys-card-g { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px; }
  .ksys-does { display: grid; gap: 8px; align-content: start; background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; padding: 12px; min-width: 0; }
  .ksys-does .eyebrow { color: var(--accent); }
  .ksys-does .btn { justify-self: start; }
  .ksys-ctr { display: grid; gap: 6px; }
  .ksys-ctr-r { display: grid; grid-template-columns: 120px minmax(0, 1fr); gap: 8px; font-size: 13.5px; }
  .ksys-ctr-r span { font: 600 10.5px/1.6 var(--f-mono); letter-spacing: .06em; text-transform: uppercase; color: var(--text-muted); }
  .ksys-ctr-r b { font-weight: 500; }
  .ksys-ctr-r.bad span { color: var(--bad); }
  .ksys-fl { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }

  /* ---------- 3. Живой сценарий ---------- */
  .ksys-live { display: grid; gap: 14px; min-width: 0; }
  .ksys-wif { display: grid; gap: 8px; }
  .ksys-wifs { display: flex; flex-wrap: wrap; gap: 6px; }
  .ksys-wf { display: inline-flex; align-items: center; gap: 6px; border: 1px solid var(--border-strong); background: var(--surface); color: var(--text-2); border-radius: 99px; padding: 6px 12px; font-size: 13.5px; font-weight: 600; }
  .ksys-wf:hover { color: var(--text); border-color: var(--text-muted); }
  .ksys-wf[aria-pressed="true"] { border-color: var(--violet); background: var(--violet-soft); color: var(--violet); box-shadow: 0 0 0 1px var(--violet) inset; }
  .ksys-lv-main { display: grid; grid-template-columns: minmax(0, 2.5fr) minmax(300px, 1fr); gap: 14px; align-items: start; }
  @media (min-width: 1101px) { .ksys-root.in-ov .ksys-step { position: sticky; top: 70px; max-height: calc(100vh - 86px); overflow-y: auto; } }
  .ksys-lv-map { display: grid; gap: 10px; min-width: 0; }
  .ksys-ctl-row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
  .ksys-tl { display: flex; gap: 10px; overflow-x: auto; padding: 4px 2px 6px; align-items: flex-end; scrollbar-width: thin; }
  .ksys-tlg { display: grid; gap: 4px; flex: none; }
  .ksys-tlt { font: 600 10.5px/1 var(--f-mono); color: var(--text-muted); white-space: nowrap; }
  .ksys-tlds { display: flex; gap: 3px; }
  .ksys-tld, .ksys-tld0 { width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid var(--border-strong); background: var(--surface); padding: 0; flex: none; }
  .ksys-tld0 { width: 22px; height: 22px; font-size: 12px; line-height: 1; color: var(--text-2); align-self: flex-end; }
  .ksys-tld.ok { border-color: var(--ok); } .ksys-tld.bad { border-color: var(--bad); } .ksys-tld.warn { border-color: var(--warn); }
  .ksys-tld.past { background: color-mix(in srgb, var(--accent) 45%, var(--surface)); border-color: var(--accent); }
  .ksys-tld[aria-current="true"] { background: var(--accent); border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }
  .ksys-step { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 14px 16px; display: grid; gap: 9px; align-content: start; min-width: 0; }
  .ksys-step h3 { font: 600 18px/1.3 var(--f-brand); }
  .ksys-step p { font-size: 14px; }
  .ksys-step .btn { justify-self: start; }
  .ksys-step-h { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; }
  .ksys-time { font: 700 13px/1 var(--f-mono); padding: 5px 8px; border-radius: 7px; background: var(--surface-3); }
  .ksys-who { font-size: 13px; font-weight: 600; color: var(--text-2); margin-right: auto; }
  .ksys-route2 { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
  .ksys-route2 .ar { font-weight: 700; color: var(--text-2); }
  .ksys-nt { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; border: 1px solid color-mix(in srgb, var(--nc) 55%, var(--border)); background: color-mix(in srgb, var(--nc) 10%, var(--surface)); border-radius: 8px; padding: 3px 8px; }
  .ksys-nt i { width: 8px; height: 8px; border-radius: 2px; background: var(--nc); }
  .ksys-step-t.ok { color: var(--ok); } .ksys-step-t.bad { color: var(--bad); } .ksys-step-t.warn { color: var(--warn); }
  .ksys-rules { display: grid; gap: 5px; }
  .ksys-rule { display: grid; grid-template-columns: 20px minmax(0, 1fr) auto; gap: 8px; align-items: center; padding: 6px 9px; border-radius: 9px; font-size: 13.5px; background: var(--info-soft); border: 1px solid color-mix(in srgb, var(--info) 25%, transparent); }
  .ksys-rule .mk { width: 20px; height: 20px; border-radius: 50%; display: grid; place-items: center; font-weight: 700; font-size: 12px; background: var(--info); color: var(--bg); }
  .ksys-rule.ok { background: var(--ok-soft); border-color: color-mix(in srgb, var(--ok) 30%, transparent); } .ksys-rule.ok .mk { background: var(--ok); }
  .ksys-rule.bad { background: var(--bad-soft); border-color: color-mix(in srgb, var(--bad) 30%, transparent); } .ksys-rule.bad .mk { background: var(--bad); }
  .ksys-step pre.code { font-size: 12px; max-height: 260px; }
  .ksys-wgs { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
  .ksys-wg { display: grid; grid-template-rows: auto minmax(0, 1fr); gap: 8px; border: 1px solid var(--border); border-radius: 12px; padding: 10px 12px; background: var(--surface); min-width: 0; }
  .ksys-wg.wide { grid-column: 1 / -1; }
  .ksys-wg-h { font: 600 11px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
  .ksys-wg-b { display: grid; gap: 6px; align-content: start; min-width: 0; font-size: 13.5px; }
  .ksys-wg-b .btn { justify-self: start; }
  .ksys-mp { justify-self: center; width: 190px; border-radius: 22px; padding: 6px; background: var(--surface-3); border: 1px solid var(--border-strong); }
  .ksys-mp-sb { font: 600 10px/1 var(--f-mono); text-align: center; color: var(--text-2); padding: 3px 0 5px; }
  .ksys-mp-b { border-radius: 16px; background: var(--bg); border: 1px solid var(--border); min-height: 128px; padding: 10px; display: grid; gap: 5px; align-content: center; justify-items: center; text-align: center; font-size: 12.5px; }
  .ksys-mp-t { font-weight: 700; }
  .ksys-mp-btn { border: 0; border-radius: 10px; background: var(--accent); color: var(--accent-text); font-weight: 700; padding: 7px 10px; font-size: 12.5px; }
  .ksys-mp-pm { display: grid; gap: 2px; border-top: 3px solid var(--violet); background: var(--surface-2); border-radius: 10px; padding: 8px 10px; width: 100%; }
  .ksys-mp-pm b { color: var(--violet); font-family: var(--f-brand); }
  .ksys-mp-ok { color: var(--ok); font-weight: 700; } .ksys-mp-bad { color: var(--bad); font-weight: 700; } .ksys-mp-warn { color: var(--warn); font-weight: 700; }
  .ksys-mp-sms { display: grid; gap: 2px; text-align: left; background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px 12px 12px 4px; padding: 8px 10px; }
  .ksys-kv { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 4px 10px; font-size: 13px; }
  .ksys-kv > span:nth-child(odd) { color: var(--text-muted); }
  .ksys-mc { display: grid; gap: 4px; border: 1px solid var(--border); border-radius: 10px; padding: 6px; background: var(--bg); }
  .ksys-mc.off { border-color: var(--warn); }
  .ksys-mc-top { font-size: 11.5px; color: var(--ok); font-weight: 600; }
  .ksys-mc.off .ksys-mc-top { color: var(--warn); }
  .ksys-mc-r { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 6px; align-items: center; font-size: 12px; padding: 3px 4px; border-radius: 6px; }
  .ksys-mc-r .chip { font-size: 11px; padding: 1px 7px; }
  .ksys-mc-r.mine { background: var(--info-soft); }
  .ksys-mc-hint { font-size: 12px; color: var(--warn); font-weight: 600; }
  .ksys-pmini { font-size: 14px; }
  .ksys-wg-b .chip { justify-self: start; white-space: normal; }
  .ksys-chain { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
  .ksys-chain span { border: 1px solid var(--border); border-radius: 99px; padding: 4px 10px; font-size: 13px; color: var(--text-muted); background: var(--surface-2); }
  .ksys-chain span.done { color: var(--text); border-color: color-mix(in srgb, var(--accent) 45%, var(--border)); }
  .ksys-chain span.cur { color: var(--accent-text); background: var(--accent); border-color: var(--accent); font-weight: 700; }
  .ksys-chain span.cur.bad { background: var(--bad); border-color: var(--bad); color: var(--bg); }
  .ksys-chain i { font-style: normal; color: var(--text-muted); }
  .ksys-end { border-radius: 14px; padding: 14px 16px; display: grid; gap: 10px; border: 1px solid var(--border); background: var(--surface); }
  .ksys-end.ok { background: var(--ok-soft); border-color: color-mix(in srgb, var(--ok) 35%, transparent); }
  .ksys-end.warn { background: var(--warn-soft); border-color: color-mix(in srgb, var(--warn) 35%, transparent); }
  .ksys-end.bad { background: var(--bad-soft); border-color: color-mix(in srgb, var(--bad) 35%, transparent); }

  /* ---------- 4. Данные ---------- */
  .ksys-dbar { display: flex; flex-wrap: wrap; gap: 8px 14px; align-items: center; justify-content: space-between; border: 1px solid var(--border); background: var(--surface); border-radius: 12px; padding: 9px 12px; }
  .ksys-dbody { display: grid; gap: 12px; min-width: 0; }
  .ksys-tcs { display: grid; grid-template-columns: repeat(auto-fill, minmax(440px, 1fr)); gap: 14px; grid-auto-flow: dense; }
  .ksys-tc.wide { grid-column: 1 / -1; }
  .ksys-tc { display: grid; gap: 6px; align-content: start; min-width: 0; }
  .ksys-tc-h { display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px; }
  .ksys-tc-h b { font: 600 15px/1.25 var(--f-brand); }
  .ksys-tc-h code { font-size: 11.5px; color: var(--text-muted); }
  .ksys-root table.ksys-tbl { font-size: 12.5px; }
  .ksys-root .ksys-tbl th, .ksys-root .ksys-tbl td { padding: 5px 8px; white-space: nowrap; }
  .ksys-root .ksys-tbl th { text-transform: none; letter-spacing: 0; font: 600 11.5px/1.3 var(--f-mono); }
  .ksys-tbl tr.mine td:first-child { box-shadow: inset 3px 0 0 var(--info); }
  .ksys-tbl tr.hl td { background: var(--warn-soft); }
  .ksys-tbl td.ksys-cellhl { background: var(--warn-soft); box-shadow: inset 0 0 0 1.5px var(--warn); font-weight: 600; }
  .ksys-rcpt { max-width: 460px; display: grid; gap: 2px; border: 1px solid var(--border); border-radius: 16px; padding: 12px; background: var(--surface); box-shadow: var(--shadow); }
  .ksys-rcpt-h { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 2px 6px 8px; border-bottom: 1px dashed var(--border); margin-bottom: 4px; }
  .ksys-rcpt-h b { font: 700 18px/1.2 var(--f-brand); }
  .ksys-rc { display: grid; grid-template-columns: minmax(0, 1fr) auto 20px; gap: 10px; align-items: center; text-align: left; border: 1px solid transparent; background: none; border-radius: 9px; padding: 7px 8px; font-size: 14px; color: var(--text); }
  .ksys-rc > span:first-child { color: var(--text-2); }
  .ksys-rc > span:nth-child(2) { text-align: right; }
  .ksys-rc i { font-style: normal; opacity: .35; }
  .ksys-rc:hover { border-color: var(--warn); background: var(--warn-soft); }
  .ksys-rc:hover i { opacity: 1; }
  .ksys-pick { border-radius: 12px; padding: 10px 12px; background: var(--warn-soft); border: 1px solid color-mix(in srgb, var(--warn) 35%, transparent); font-size: 14px; }
  .ksys-dbv { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px; }
  .ksys-erl { border: 1px solid var(--border); border-radius: 12px; padding: 10px 12px; background: var(--surface); }

  /* ---------- 5. Статусы ---------- */
  .ksys-sm-start { fill: var(--text); }
  .ksys-sm-ln { stroke: var(--text-2); stroke-width: 1.6; }
  .ksys-sm-t { cursor: pointer; outline: none; }
  .ksys-sm-t .hit { stroke: transparent; stroke-width: 16; fill: none; }
  .ksys-sm-t .ln { stroke: var(--text-2); stroke-width: 1.6; fill: none; }
  .ksys-sm-t .lb { font-size: 12px; fill: var(--text-2); paint-order: stroke; stroke: var(--code-bg); stroke-width: 4px; stroke-linejoin: round; }
  .ksys-sm-t.on .ln { stroke: var(--accent); stroke-width: 2.6; }
  .ksys-sm-t.on .lb { fill: var(--accent); font-weight: 600; }
  .ksys-sm-t:hover .ln, .ksys-sm-t:focus-visible .ln, .ksys-sm-t.sel .ln { stroke: var(--warn); stroke-width: 3; }
  .ksys-sm-t:hover .lb, .ksys-sm-t.sel .lb { fill: var(--warn); font-weight: 600; }
  .ksys-sm-n { cursor: pointer; outline: none; }
  .ksys-sm-n .bx { fill: var(--surface); stroke: var(--border-strong); stroke-width: 1.5; }
  .ksys-sm-n .in { fill: none; stroke: var(--border-strong); stroke-width: 1; }
  .ksys-sm-n .nt { font: 600 13px var(--f-body); fill: var(--text); }
  .ksys-sm-n.neg .bx { fill: color-mix(in srgb, var(--bad) 8%, var(--surface)); stroke: color-mix(in srgb, var(--bad) 45%, var(--border)); }
  .ksys-sm-n.vis .bx { fill: color-mix(in srgb, var(--accent) 12%, var(--surface)); stroke: color-mix(in srgb, var(--accent) 60%, var(--border)); }
  .ksys-sm-n.cur .bx { fill: var(--accent); stroke: var(--accent); }
  .ksys-sm-n.cur .nt { fill: var(--accent-text); }
  .ksys-sm-n.cur.neg .bx { fill: var(--bad); stroke: var(--bad); }
  .ksys-sm-n.cur.neg .nt { fill: var(--bg); }
  .ksys-sm-n .pulse { fill: none; stroke: var(--accent); stroke-width: 2; opacity: .6; animation: ksys-pulse 1.6s ease-out infinite; transform-box: fill-box; transform-origin: center; }
  .ksys-sm-n.neg .pulse { stroke: var(--bad); }
  @keyframes ksys-pulse { from { opacity: .8; transform: scale(.96); } to { opacity: 0; transform: scale(1.08); } }
  .ksys-sm-n:hover .bx, .ksys-sm-n:focus-visible .bx, .ksys-sm-n.sel .bx { stroke: var(--warn); stroke-width: 2.6; }
  .ksys-trk { display: grid; grid-template-columns: 190px minmax(0, 1fr); gap: 6px 14px; font-size: 14px; }
  .ksys-trk > span { font: 600 10.5px/1.7 var(--f-mono); letter-spacing: .06em; text-transform: uppercase; color: var(--text-muted); }
  .ksys-trk > b { font-weight: 500; }

  /* ---------- адаптив ---------- */
  @media (max-width: 1100px) {
    .ksys-lv-main { grid-template-columns: minmax(0, 1fr); }
    .ksys-wgs { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 980px) {
    .ksys-scr.is-phone, .ksys-scr.is-cash, .ksys-scr.is-shop { grid-template-columns: minmax(0, 1fr); }
    .ksys-card-g { grid-template-columns: minmax(0, 1fr); }
    .ksys-an4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 760px) {
    .ksys-brand .lg, .ksys-x .lg { display: none; }
    .ksys-cash { grid-template-columns: minmax(0, 1fr); }
    .ksys-kp { order: -1; grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr); align-items: start; }
    .ksys-tcs, .ksys-dbv { grid-template-columns: minmax(0, 1fr); }
    .ksys-trk { grid-template-columns: minmax(0, 1fr); gap: 2px; }
    .ksys-trk > b { margin-bottom: 6px; }
  }
  @media (max-width: 560px) {
    .ksys-ov-in { padding: 0 12px 48px; }
    .ksys-bar { gap: 8px; }
    .ksys-tab { padding: 6px 9px; font-size: 13px; }
    .ksys-dv .lg { display: none; } .ksys-dv .sh { display: inline; }
    .ksys-dv { padding: 8px 11px; }
    .ksys-wgs { grid-template-columns: minmax(0, 1fr); }
    .ksys-tdev { padding: 8px; border-radius: 18px; }
    .ksys-tb-top, .ksys-cash, .ksys-shop { padding-left: 10px; padding-right: 10px; }
    .ksys-net { margin-left: 0; }
    .ksys-kp { grid-template-columns: minmax(0, 1fr); }
    .ksys-ocs { grid-template-columns: minmax(0, 1fr); }
    .ksys-plan-r { grid-template-columns: minmax(0, 1fr) 40px 82px 40px; padding: 7px 9px; font-size: 13px; gap: 8px; }
    .ksys-plan-r.h { font-size: 11px; }
    .ksys-plan-r .bar { display: none; }
    .ksys-cks { grid-template-columns: minmax(0, 1fr); }
    .ksys-load-r { grid-template-columns: 70px minmax(0, 1fr) 60px; }
    .ksys-ctr-r { grid-template-columns: minmax(0, 1fr); gap: 0; }
    .ksys-ivs { grid-template-columns: minmax(0, 1fr); }
    .ksys-iv { grid-template-columns: auto minmax(0, 1fr); text-align: left; gap: 8px; align-items: center; padding: 7px 10px; }
    .ksys-phone { width: 310px; }
    .ksys-ph-scr { height: 600px; }
    .ksys-head { padding-top: 10px; }
    .ksys-board > svg { min-width: 860px; }
    .ksys-board.sm > svg { min-width: 900px; }
  }
  </style>`);

  // =====================================================================
  // Справочники кейса (цифры и правила — DOMAIN.md; цены и адреса — нейтральные примеры)
  // =====================================================================
  const BAK = [
    { id: 1, name: 'Покровка', addr: 'Большая Покровская', net: 'мобильный модем' },
    { id: 2, name: 'Рождественская', addr: 'улица Рождественская', net: 'проводной' },
    { id: 3, name: 'Гагарина', addr: 'проспект Гагарина', net: 'мобильный модем' }
  ];
  // today — сколько на витрине Покровки в 10:30; free — свободно в уже утверждённом плане (после 22:30);
  // base — план по статистике на всю сеть; pre — предзаказы других покупателей на завтра
  const PROD = [
    { id: 11, name: 'Круассан классический', sh: 'Круассан', price: 120, ico: '🥐', from: '07:30', today: 0, free: 3, base: 820, pre: 46, kind: 'выпечка' },
    { id: 12, name: 'Хлеб бородинский', sh: 'Бородинский', price: 90, ico: '🍞', today: 6, free: 0, base: 410, pre: 18, kind: 'хлеб' },
    { id: 13, name: 'Багет', sh: 'Багет', price: 90, ico: '🥖', today: 4, free: 5, base: 360, pre: 12, kind: 'хлеб' },
    { id: 14, name: 'Пирожок с капустой', sh: 'Пирожок', price: 60, ico: '🥟', today: 9, free: 6, base: 520, pre: 15, kind: 'выпечка' },
    { id: 15, name: 'Эклер', sh: 'Эклер', price: 110, ico: '🧁', today: 5, free: 2, base: 300, pre: 6, kind: 'десерт' }
  ];
  const byP = id => PROD.find(p => p.id === +id) || PROD[0];
  const bakN = id => BAK.find(b => b.id === +id) || BAK[0];
  const hm = s => { const a = String(s).split(':'); return (+a[0]) * 60 + (+a[1] || 0); };
  const fm = n => String(Math.floor(n / 60) % 24).padStart(2, '0') + ':' + String(((n % 60) + 60) % 60).padStart(2, '0');
  const SLOTS = []; for (let m = 7 * 60; m < 21 * 60; m += 30) SLOTS.push(fm(m));
  const ivl = s => `${s}–${fm(hm(s) + 30)}`;
  const CLOCKS = [{ v: '10:30', t: 'пн 10:30' }, { v: '21:40', t: 'пн 21:40' }, { v: '22:40', t: 'пн 22:40' }];
  const CODE = 'К-247';
  const DEF = { bak: 1, day: 'tomorrow', slot: '08:00', items: [{ id: 11, q: 2 }, { id: 12, q: 1 }, { id: 13, q: 1 }], pay: 'card', status: 'Оплачен', late: false, code: CODE };
  const rub = n => Number(n).toLocaleString('ru-RU') + ' ₽';
  const sumOf = items => items.reduce((s, x) => s + byP(x.id).price * x.q, 0);
  const itemsText = items => items.map(x => byP(x.id).sh + (x.q > 1 ? ' ×' + x.q : '')).join(' · ');
  const PAYT = { card: 'картой онлайн', sbp: 'по СБП', cash: 'на месте при получении' };
  const PAID = s => s === 'Оплачен';

  // =====================================================================
  // Память раздела (только в памяти модуля, без localStorage)
  // =====================================================================
  const MEM = {
    view: 'screens',
    dev: 'phone', analyst: false, sstate: 'normal', clock: '21:40',
    ph: { scr: 'where', bak: 1, day: 'tomorrow', slot: null, cart: {}, pay: 'card', sheet: false, err: '', confirm: false },
    order: null,
    cash: { st: {}, q: '', iv: 1, pend: {}, queue: 0, sent: '' },
    shop: { rain: false, cakes: { 'Т-029': 'Готов', 'Т-031': 'В производстве', 'Т-032': 'Предоплачен' }, thu: 23, msg: null },
    map: { sel: null },
    live: { variant: 'normal', step: 0 },
    data: { sub: 'tables', mode: 'client', pick: null },
    st: { model: 'order', sel: null }
  };
  // заказ, по которому идёт живой сценарий: собранный на телефоне или заказ по умолчанию
  const curOrder = () => {
    const o = MEM.order;
    if (!o) return Object.assign({ own: false }, TR.clone(DEF));
    return Object.assign({ own: true }, TR.clone(o));
  };

  // =====================================================================
  // Помощники разметки
  // =====================================================================
  const KIND = {
    rule: { t: 'Правило', ico: '📏' },
    data: { t: 'Данные', ico: '📒' },
    state: { t: 'Состояние', ico: '🌓' },
    int: { t: 'Интеграция', ico: '🔌' }
  };
  const fchip = (id, long) => {
    const f = TR.FACTS && TR.FACTS[id];
    return `<button type="button" class="ksys-f" data-fact="${esc(id)}" title="${esc(f ? f.text : id)}">${esc(id)}${long && f && f.short ? `<span>${esc(f.short)}</span>` : ''}</button>`;
  };
  const facts = (list, long) => (list || []).map(id => fchip(id, long)).join('');
  // всплывающая карточка факта блокнота
  function factPop(root, btn) {
    const old = TR.$('.ksys-pop', root);
    const id = btn.dataset.fact, f = TR.FACTS && TR.FACTS[id];
    if (old) { const same = old.dataset.for === id; old.remove(); if (same) return; }
    if (!f) return;
    const who = TR.PEOPLE && TR.PEOPLE[f.who];
    const pop = TR.el(`<div class="ksys-pop" role="note" data-for="${esc(id)}"><div class="row between"><b class="mono">${esc(id)}${f.flag ? ' ⚑' : ''}</b><button type="button" class="btn xs ghost" data-popx aria-label="Закрыть">✕</button></div><div>${esc(f.text)}</div>${who ? `<div class="small dim">Кто сказал: ${esc(who.name)} — ${esc(who.role)}. Факт из блокнота требований.</div>` : ''}</div>`);
    root.appendChild(pop);
    const rr = root.getBoundingClientRect(), br = btn.getBoundingClientRect();
    const w = Math.min(340, rr.width - 16);
    let left = br.left - rr.left; if (left + w > rr.width - 8) left = Math.max(8, rr.width - 8 - w);
    pop.style.width = w + 'px'; pop.style.left = left + 'px'; pop.style.top = (br.bottom - rr.top + 6) + 'px';
  }
  // метки «Глазами аналитика»: элементы с data-ap получают номер и цвет вида
  function decorate(box, pins) {
    TR.$$('[data-ap]', box).forEach(el => {
      const p = pins.find(x => x.n === +el.dataset.ap); if (!p) return;
      el.classList.add('ksys-pp', 'ksys-k-' + p.k);
      if (!TR.$(':scope > .ksys-pin', el)) el.insertAdjacentHTML('beforeend', `<span class="ksys-pin" data-pin="${p.n}" role="button" tabindex="0" aria-label="Метка ${p.n}: ${esc(p.t)}">${p.n}</span>`);
    });
  }
  const json = o => ui.code(JSON.stringify(o, null, 2), 'json');
  const reduced = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };
  // мигнуть элементом, когда он изменился
  const flash = el => { if (!el) return; el.classList.remove('ksys-flash'); void el.offsetWidth; el.classList.add('ksys-flash'); };

  // =====================================================================
  // 1. Экраны: телефон покупателя, планшет кассира, планшет цеха
  // =====================================================================
  const DEVS = [
    { v: 'phone', ico: '📱', t: 'Телефон покупателя', sh: 'Телефон' },
    { v: 'cash', ico: '🧾', t: 'Планшет кассира', sh: 'Кассир' },
    { v: 'shop', ico: '🥖', t: 'Планшет цеха', sh: 'Цех' }
  ];
  const STATES = [{ v: 'normal', t: 'Обычное' }, { v: 'empty', t: 'Пусто' }, { v: 'loading', t: 'Загрузка' }, { v: 'error', t: 'Ошибка' }, { v: 'offline', t: 'Нет связи' }];
  const segA = (a, opts, cur, cls) => `<div class="seg ksys-seg ${cls || ''}" role="group">${opts.map(o => `<button type="button" data-a="${a}" data-v="${esc(o.v)}" aria-pressed="${String(o.v) === String(cur)}">${o.t}</button>`).join('')}</div>`;

  const PINS = {
    'phone:where': [
      { n: 1, k: 'data', t: 'Список пекарен: название, адрес, часы работы', db: 'Пекарня.название · Пекарня.адрес · Пекарня.часы_работы' },
      { n: 2, k: 'rule', t: '«Сегодня» — только то, что уже лежит на витрине. Пекарни открыты 07:00–21:00: вечером «сегодня» недоступно', f: ['F-cutoff'], db: 'Остаток.количество' },
      { n: 3, k: 'rule', t: '«Завтра» — до 22:30: в 23:00 технолог фиксирует план выпечки. Позже — только из того, что уже запланировано', f: ['F-cutoff'] },
      { n: 4, k: 'rule', t: 'Интервалы по 30 минут, с 07:00 до 21:00', f: ['F-slot'], db: 'в базе не хранятся: считаются из Пекарня.часы_работы' },
      { n: 5, k: 'rule', t: 'В 07:00–07:30 круассанов нет: первая партия на точке бывает около 07:20', f: ['F-batch'], db: 'Товар.доступен_с' }
    ],
    'phone:cat': [
      { n: 1, k: 'data', t: 'Цена товара', db: 'Товар.цена' },
      { n: 2, k: 'data', t: 'Сколько можно взять. Три разных источника: «испечём» — на завтра до 22:30, «на витрине» — на сегодня, «из запланированного» — после 22:30', db: 'Остаток.количество · План выпечки' },
      { n: 3, k: 'rule', t: 'Круассан недоступен в интервал 07:00–07:30', f: ['F-batch'], db: 'Товар.доступен_с = 07:30' },
      { n: 4, k: 'rule', t: 'Торт — отдельное оформление: не раньше чем за 48 часов, предоплата 50 %', f: ['F-cake48'] },
      { n: 5, k: 'data', t: 'Корзина живёт только в телефоне: пока заказ не оформлен, в базе о нём ничего нет', db: '— (только в телефоне)' }
    ],
    'phone:pay': [
      { n: 1, k: 'rule', t: 'Платить можно онлайн (карта, СБП) или на месте при получении — нужны оба варианта', f: ['F-pay'], db: 'Оплата.способ' },
      { n: 2, k: 'rule', t: 'Бесплатная отмена — не позже чем за 2 часа до начала интервала', f: ['F-cancel'] },
      { n: 3, k: 'rule', t: 'Оплата на месте: держим 30 минут после конца интервала, потом выпечка уходит в продажу', f: ['F-hold'] },
      { n: 4, k: 'int', t: 'Номер карты вводят на странице «ПэйМост» — это экран чужой системы. Сервер «Колоса» карту не видит и не хранит', db: 'Оплата.id_в_ПэйМост' },
      { n: 5, k: 'data', t: 'Итог считает сервер, а не телефон: цены могли поменяться, пока корзина лежала', db: 'Предзаказ.сумма' }
    ],
    'phone:done': [
      { n: 1, k: 'data', t: 'Короткий код вместо имени: однофамильцы и тёзки у кассы больше не путаются', f: ['F-obs-names'], db: 'Предзаказ.код' },
      { n: 2, k: 'data', t: 'Статус заказа — одно из значений статусной модели (вкладка «Статусы»)', db: 'Предзаказ.статус' },
      { n: 3, k: 'int', t: 'Чек «предоплата» пробивает облачная касса «КассаПро»; при оплате на месте чек один — при выдаче', f: ['F-54fz'], db: 'Чек.тип' },
      { n: 4, k: 'rule', t: 'Отмена: за 2 часа до интервала и раньше — с возвратом на ту же карту за 3 рабочих дня; позже — без возврата', f: ['F-cancel', 'F-refund'] },
      { n: 5, k: 'int', t: 'SMS «заказ собран» отправит SMS-шлюз по номеру покупателя', db: 'Покупатель.телефон' }
    ],
    cash: [
      { n: 1, k: 'rule', t: 'Крупные кнопки и ни одного поля для текста: у кассы шумно, руки в муке и перчатках, кассиры новые каждый месяц', f: ['F-obs-hands', 'F-staff'] },
      { n: 2, k: 'rule', t: 'Поиск по коду заказа, а не по имени', f: ['F-obs-names'], db: 'Предзаказ.код' },
      { n: 3, k: 'data', t: 'Заказы этой пекарни на сегодня, разложенные по интервалам', db: 'Предзаказ: пекарня_id, дата, интервал, статус' },
      { n: 4, k: 'rule', t: 'Собрать и выдать — по одному касанию: в пик 07:30–09:00 очередь 8–12 человек', f: ['F-peak'] },
      { n: 5, k: 'rule', t: 'Неоплаченный заказ держим 30 минут после конца интервала, потом — «Не выкуплен», выпечка на витрину', f: ['F-hold'] },
      { n: 6, k: 'int', t: '«Выдать» → чек полного расчёта в «КассаПро»', f: ['F-54fz'], db: 'Чек.тип = полный расчёт' },
      { n: 7, k: 'state', t: 'Нет связи: планшет работает офлайн, запоминает действия и досылает их вместе с чеками', f: ['F-net', 'F-obs-modem'] },
      { n: 8, k: 'rule', t: 'Заказ по телефону: кассир оформляет за тех, у кого нет смартфона', f: ['F-elder'] }
    ],
    shop: [
      { n: 1, k: 'rule', t: 'Предзаказы добавляются к плану автоматически — никакого Excel', f: ['F-plan'] },
      { n: 2, k: 'data', t: 'База — по продажам прошлой недели', db: 'План выпечки.база' },
      { n: 3, k: 'data', t: 'Предзаказы — сумма всех позиций заказов на завтра по всем пекарням', db: 'План выпечки.предзаказы = сумма Позиция предзаказа.количество' },
      { n: 4, k: 'rule', t: 'План фиксируется в 23:00 — поэтому заказы на завтра принимают до 22:30', f: ['F-plan', 'F-cutoff'] },
      { n: 5, k: 'rule', t: 'Погоду учитывает человек: технолог правит базу вручную', f: ['F-weather'] },
      { n: 6, k: 'data', t: 'Фото-образец и надпись — прямо на планшете кондитера, а не в личном мессенджере', f: ['F-cakephoto'], db: 'Торт.фото · Торт.надпись' },
      { n: 7, k: 'rule', t: 'Не больше 25 тортов в день (в праздники до 60 с дополнительной сменой)', f: ['F-cakecap'] },
      { n: 8, k: 'rule', t: 'Торт — не раньше чем за 48 часов, с предоплатой 50 %', f: ['F-cake48'] }
    ]
  };

  // состояния экранов: что видит человек (ttl, txt) и что за этим стоит для аналитика (sys)
  const STX = {
    'phone:where': {
      empty: { ico: '🗓', ttl: 'Свободных интервалов нет', txt: 'На сегодня все интервалы уже прошли. Можно заказать на завтра.', btn: 'Выбрать завтра', sys: 'Пусто — не тупик: экран подсказывает следующий шаг.' },
      loading: { ttl: 'Загружаем пекарни и интервалы…', sys: 'Пока ждём сервер — серые заготовки, а не белый лист. Сколько ждать допустимо — нефункциональное требование: 95 % ответов быстрее 1 секунды.' },
      error: { ico: '⚠️', ttl: 'Не получилось загрузить интервалы', txt: 'Попробуйте ещё раз через минуту.', btn: 'Повторить', sys: 'Ошибка говорит, что случилось и что делать, — без «Error 500».' },
      offline: { ico: '📵', ttl: 'Нет интернета', txt: 'Свободные интервалы знает только сервер — без связи заказ не оформить.', btn: 'Повторить', sys: 'Что работает без связи, а что нет, решают аналитик и дизайнер вместе.' }
    },
    'phone:cat': {
      empty: { ico: '🧺', ttl: 'На витрине пусто', txt: 'До второго развоза в 11:00 витрина пустеет. Загляните после 11:00 или закажите на завтра.', sys: '«Пусто» в 10:30 — временно (F-obs-second): экран объясняет, когда станет лучше.' },
      loading: { ttl: 'Загружаем каталог…', sys: 'Заготовки карточек вместо пустого экрана.' },
      error: { ico: '⚠️', ttl: 'Каталог не загрузился', txt: 'Корзина сохранена. Попробуйте ещё раз.', btn: 'Повторить', sys: 'Ошибка каталога не должна стирать корзину: она хранится в телефоне.' },
      offline: { ico: '📵', ttl: 'Нет интернета', txt: 'Показываем каталог, сохранённый в 21:12. Цены и остатки могли измениться — заказать можно, когда появится связь.', sys: 'Старые данные показывать можно, но честно: с временем и без кнопки «Оформить».' }
    },
    'phone:pay': {
      empty: { ico: '🛒', ttl: 'Корзина пуста', txt: 'Добавьте выпечку, чтобы перейти к оплате.', btn: 'В каталог', sys: 'Сюда не должны попадать с пустой корзиной, но если попали — экран не ломается.' },
      loading: { ttl: 'Ждём ответ банка…', txt: 'Не закрывайте экран.', sys: 'Ответ «ПэйМост» может идти несколько секунд. Повторное нажатие не должно списать деньги дважды.' },
      error: { ico: '💳', ttl: 'Оплата не прошла', txt: 'Банк отклонил операцию. Деньги не списаны. Попробуйте другую карту или оплатите на месте.', btn: 'Оплатить на месте', sys: 'Хороший текст ошибки отвечает на три вопроса: что случилось, что с деньгами, что делать дальше.' },
      offline: { ico: '📵', ttl: 'Связь пропала во время оплаты', txt: 'Если деньги списались, заказ появится в «Моих заказах» в течение минуты. Не нажимайте «Оплатить» ещё раз.', sys: 'Самое опасное место: деньги могли уйти, а ответ — нет. Правду знает уведомление от «ПэйМост», а не телефон.' }
    },
    'phone:done': {
      empty: { ico: '📭', ttl: 'Заказов пока нет', txt: 'Здесь появятся ваши заказы и их коды.', btn: 'Сделать заказ', sys: 'Первый вход в «Мои заказы» — тоже состояние, его тоже рисуют.' },
      loading: { ttl: 'Обновляем статус…', sys: 'Статус меняется на сервере — экран его переспрашивает.' },
      error: { ico: '⚠️', ttl: 'Статус не обновился', txt: 'Показываем последний известный. Код К-247 действителен.', sys: 'Код заказа виден всегда: без него у кассы будет очередь.' },
      offline: { ico: '📵', ttl: 'Нет интернета', txt: 'Код К-247 сохранён в телефоне — кассиру этого хватит.', sys: 'В очереди у кассы интернет может не ловить: код хранится в самом телефоне.' }
    },
    cash: {
      empty: { ico: '🧺', ttl: 'В этом интервале заказов нет', txt: 'Ближайшие — в следующем интервале.', sys: 'Пусто — подсказать, где ближайшие заказы.' },
      loading: { ttl: 'Обновляем список…', sys: 'Список обновляется сам — кассир ничего не нажимает.' },
      error: { ico: '⚠️', ttl: 'Сервер не ответил', txt: 'Показан список на начало интервала. Выдавать можно.', sys: 'Ошибка сервера не останавливает выдачу в пик.' },
      offline: { ico: '📵', ttl: 'Нет связи — работаю офлайн', txt: 'Кнопки работают. Действия и чеки уйдут, когда связь вернётся.', sys: 'Модем на Покровке отваливается на 10–15 минут — это обычный режим, а не авария.' }
    },
    shop: {
      empty: { ico: '📋', ttl: 'План на завтра ещё не утверждён', txt: 'План фиксируется в 23:00. Пока — черновик по статистике, предзаказы ещё идут.', sys: 'До 23:00 цифры меняются — экран честно пишет «черновик».' },
      loading: { ttl: 'Загружаем план…', sys: 'Заготовки строк вместо пустой таблицы.' },
      error: { ico: '⚠️', ttl: 'План не загрузился', txt: 'Показан план, сохранённый в 23:00.', sys: 'В 03:00 цех встаёт по плану, даже если сервер молчит.' },
      offline: { ico: '📵', ttl: 'Нет связи', txt: 'Показан план, загруженный в 23:00. Отметки «Готов» уйдут, когда связь вернётся.', sys: 'Отметки кондитера не теряются: планшет их запоминает.' }
    }
  };

  const ABOUT = {
    phone: {
      t: 'Телефон покупателя', who: 'покупатели «Колоса»', an: 'витрина и прилавок: выбрать, заплатить, получить код',
      what: 'Это <b>фронтенд</b> — то, что видит человек. Само приложение ничего не решает: про интервалы, остатки и оплату оно спрашивает <b>сервер</b>, а сервер — <b>базу данных</b>.',
      tips: [
        'Соберите свой заказ на завтра: пекарня → интервал → выпечка → оплата. В конце будет код заказа — его подхватит «Живой сценарий».',
        'Выберите интервал 07:00 и откройте каталог. Что стало с круассанами и почему?',
        'Переведите часы на 22:40. Что изменилось в «Завтра» и в цифрах каталога?',
        'Переведите часы на 10:30 и выберите «Сегодня». Откуда теперь берутся цифры «сколько осталось»?',
        'На странице оплаты нажмите «Смоделировать отказ банка». Что увидит покупатель?'
      ]
    },
    cash: {
      t: 'Планшет кассира', who: 'кассиры-бариста, по 2 в смене', an: 'тетрадь заказов у кассы, только умная: сама показывает, что выдавать сейчас',
      what: 'Тоже фронтенд, только для сотрудника. Главное здесь — скорость в утренний пик и работа без связи: на Покровке интернет через мобильный модем.',
      tips: [
        'Наберите код на крупной клавиатуре: 2 → 4 → 7. Имя не нужно.',
        'Нажмите «Собрать», потом «Выдать». У заказа «к оплате» сначала берут деньги.',
        'Включите состояние «Нет связи» и выдайте заказ. Потом верните «Обычное» — что стало с очередью?'
      ]
    },
    shop: {
      t: 'Планшет цеха', who: 'технолог Галина Ивановна и кондитеры', an: 'доска с заказами в цеху',
      what: 'Экран показывает то, что посчитал бэкенд: план выпечки и торты. Технолог правит план, но больше не пересчитывает его руками в Excel.',
      tips: [
        'Посмотрите колонку «+ Предзаказы»: столько добавили к обычному плану заказы покупателей.',
        'Включите «Дождь завтра». Что поменялось и почему это ручная правка, а не правило?',
        'Отметьте торт «Начать» и «Готов». Потом попробуйте принять заявку на торт — на среду и на четверг.'
      ]
    }
  };

  // ---------- телефон покупателя ----------
  function availOf(p) {
    const ph = MEM.ph, late = MEM.clock === '22:40' && ph.day === 'tomorrow';
    if (ph.slot && p.from && hm(ph.slot) < hm(p.from)) return { ok: false, max: 0, t: 'не в этот интервал: первая партия около 07:20' };
    if (ph.day === 'today') return p.today > 0 ? { ok: true, max: p.today, t: `на витрине: ${p.today}` } : { ok: false, max: 0, t: 'на витрине 0 · привезут после 11:00' };
    if (late) return p.free > 0 ? { ok: true, max: p.free, t: `из запланированного: ${p.free}` } : { ok: false, max: 0, t: 'в плане свободных нет' };
    return { ok: true, max: 20, t: 'испечём к вашему интервалу' };
  }
  function clampCart() {
    const c = MEM.ph.cart;
    Object.keys(c).forEach(id => { const a = availOf(byP(id)); c[id] = Math.max(0, Math.min(c[id], a.max)); if (!c[id]) delete c[id]; });
  }
  const cartList = () => PROD.filter(p => MEM.ph.cart[p.id] > 0).map(p => ({ id: p.id, q: MEM.ph.cart[p.id] }));
  const daySlots = () => MEM.ph.day === 'today' ? SLOTS.filter(s => hm(s) > hm(MEM.clock)) : SLOTS;
  const dayLbl = d => d === 'today' ? 'сегодня, пн 5 октября' : 'вт 6 октября';
  const phScr = () => (MEM.ph.scr === 'done' && !MEM.order) ? 'where' : MEM.ph.scr;
  const devKey = () => MEM.dev === 'phone' ? 'phone:' + phScr() : MEM.dev;

  function phHead(title, back) {
    const steps = ['where', 'cat', 'pay', 'done'], i = steps.indexOf(phScr());
    return `<div class="ksys-ph-hd">
      <div class="ksys-ph-brand"><span class="ksys-logo" aria-hidden="true">🌾</span><b>Колос</b><span class="ksys-ph-steps" aria-hidden="true">${steps.map((s, k) => `<i class="${k < i ? 'done' : k === i ? 'on' : ''}"></i>`).join('')}</span></div>
      <div class="ksys-ph-title">${back ? `<button type="button" class="ksys-ph-back" data-a="ph-go" data-v="${back}" aria-label="Назад">←</button>` : ''}<span>${title}</span></div>
    </div>`;
  }
  function stateBody(key) {
    const s = STX[key] && STX[key][MEM.sstate]; if (!s) return '';
    if (MEM.sstate === 'loading') return `<div class="ksys-skel" aria-hidden="true"><i></i><i class="s"></i><i></i><i class="s"></i><i></i></div><div class="ksys-st-msg"><span class="ksys-spin" aria-hidden="true"></span><b>${esc(s.ttl)}</b>${s.txt ? `<span>${esc(s.txt)}</span>` : ''}</div>`;
    return `<div class="ksys-st-msg ${MEM.sstate}"><span class="ico" aria-hidden="true">${s.ico || ''}</span><b>${esc(s.ttl)}</b>${s.txt ? `<span>${esc(s.txt)}</span>` : ''}${s.btn ? `<button type="button" class="ksys-ph-btn ghost" data-a="noop">${esc(s.btn)}</button>` : ''}</div>`;
  }
  function phWhere() {
    const ph = MEM.ph, c = MEM.clock, late = c === '22:40', todayOk = c === '10:30';
    const bak = BAK.map(b => `<button type="button" class="ksys-ph-opt" data-a="ph-bak" data-v="${b.id}" aria-pressed="${ph.bak === b.id}"><b>${esc(b.name)}</b><small>${esc(b.addr)} · 07:00–21:00</small></button>`).join('');
    const days = `<div class="ksys-ph-days">
      <button type="button" class="ksys-ph-opt" data-a="ph-day" data-v="today" aria-pressed="${ph.day === 'today'}" ${todayOk ? '' : 'disabled'} data-ap="2"><b>Сегодня</b><small>${todayOk ? 'из того, что на витрине' : 'пекарни закрыты с 21:00'}</small></button>
      <button type="button" class="ksys-ph-opt" data-a="ph-day" data-v="tomorrow" aria-pressed="${ph.day === 'tomorrow'}" data-ap="3"><b>Завтра</b><small>${late ? 'только запланированное' : 'вт 6 октября'}</small></button></div>`;
    let note = '';
    if (late && ph.day === 'tomorrow') note = '<div class="ksys-ph-note warn">⏰ Приём заказов на завтра закрыт в 22:30. Можно забрать только то, что уже запланировано в выпечку.</div>';
    else if (ph.day === 'today') note = '<div class="ksys-ph-note">🧺 На сегодня — только то, что уже лежит на витрине.</div>';
    const slots = daySlots().map(s => `<button type="button" class="ksys-slot" data-a="ph-slot" data-v="${s}" aria-pressed="${ph.slot === s}" title="${ivl(s)}" ${s === '07:00' ? 'data-ap="5"' : ''}>${s}${hm(s) < hm('07:30') ? '<small>без 🥐</small>' : ''}</button>`).join('');
    return `<div class="ksys-ph-h2">Где заберёте?</div><div class="ksys-ph-list" data-ap="1">${bak}<div class="ksys-ph-more">+ ещё 6 пекарен</div></div>
      <div class="ksys-ph-h2">Когда?</div>${days}${note}
      <div class="ksys-ph-h2">Начало интервала <small>интервал — 30 минут</small></div><div class="ksys-slots" data-ap="4">${slots}</div>`;
  }
  function phCat() {
    const ph = MEM.ph;
    const rows = PROD.map((p, i) => {
      const a = availOf(p), q = ph.cart[p.id] || 0;
      const ap = p.id === 11 ? 'data-ap="3"' : i === 1 ? 'data-ap="2"' : '';
      return `<div class="ksys-prod ${a.ok ? '' : 'off'}">
        <span class="ksys-prod-ico" aria-hidden="true">${p.ico}</span>
        <b class="ksys-prod-n">${esc(p.name)}</b>
        <span class="ksys-prod-p tnum" ${i === 0 ? 'data-ap="1"' : ''}>${rub(p.price)}</span>
        <small class="ksys-prod-a" ${ap}>${esc(a.t)}</small>
        <div class="ksys-qty"><button type="button" data-a="ph-q" data-v="${p.id}:-1" ${q ? '' : 'disabled'} aria-label="Убрать: ${esc(p.sh)}">−</button><span class="tnum">${q}</span><button type="button" data-a="ph-q" data-v="${p.id}:1" ${a.ok && q < a.max ? '' : 'disabled'} aria-label="Добавить: ${esc(p.sh)}">+</button></div>
      </div>`;
    }).join('');
    return `<div class="ksys-ph-h2">Хлеб и выпечка</div>${rows}
      <div class="ksys-ph-cake" data-ap="4"><span aria-hidden="true">🎂</span><div><b>Торт на заказ</b><small>не раньше чем за 48 часов, предоплата 50 % — отдельное оформление</small></div></div>`;
  }
  function phPay() {
    const ph = MEM.ph, items = cartList(), sum = sumOf(items), b = bakN(ph.bak);
    const start = hm(ph.slot || '08:00');
    const opts = [['card', 'Картой онлайн', 'сразу, на странице банка'], ['sbp', 'СБП', 'через приложение вашего банка'], ['cash', 'На месте при получении', 'наличными или картой на кассе']];
    return `${ph.err ? '<div class="ksys-ph-note bad">💳 <b>Оплата не прошла.</b> Банк отклонил операцию, деньги не списаны. Попробуйте другую карту или выберите «На месте».</div>' : ''}
      <div class="ksys-ph-card"><div class="small dim">${esc(b.name)} · ${dayLbl(ph.day)} · ${ivl(ph.slot || '08:00')}</div>
        ${items.map(x => `<div class="ksys-ph-li"><span>${esc(byP(x.id).sh)}${x.q > 1 ? ' ×' + x.q : ''}</span><span class="tnum">${rub(byP(x.id).price * x.q)}</span></div>`).join('')}
        <div class="ksys-ph-li tot" data-ap="5"><b>Итого</b><b class="tnum">${rub(sum)}</b></div></div>
      <div class="ksys-ph-h2">Как оплатите?</div>
      <div class="ksys-ph-list" data-ap="1">${opts.map(o => `<button type="button" class="ksys-ph-opt radio" data-a="ph-pm" data-v="${o[0]}" aria-pressed="${ph.pay === o[0]}"><b>${o[1]}</b><small>${o[2]}</small></button>`).join('')}</div>
      ${ph.pay === 'cash'
        ? `<div class="ksys-ph-note" data-ap="3">⏳ Держим заказ до ${fm(start + 60)} — 30 минут после конца интервала. Потом выпечка уйдёт на витрину.</div>`
        : `<div class="ksys-ph-note" data-ap="2">↩ Отмена бесплатно до ${ph.day === 'today' ? fm(start - 120) : fm(start - 120) + ' вторника'} — за 2 часа до интервала.</div>`}`;
  }
  function pmSheet() {
    const sum = sumOf(cartList()), sbp = MEM.ph.pay === 'sbp';
    return `<div class="ksys-pm" data-ap="4" role="dialog" aria-label="Страница платёжного шлюза «ПэйМост»">
      <div class="ksys-pm-url">🔒 pay.paymost.ru</div>
      <div class="ksys-pm-b">
        <div class="ksys-pm-logo">ПэйМост</div>
        <div class="small">Получатель: сеть пекарен «Колос»</div>
        <div class="ksys-pm-sum tnum">${rub(sum)}</div>
        ${sbp ? '<div class="ksys-pm-f"><span>Отсканируйте код в приложении банка</span></div><div class="ksys-qr" aria-hidden="true"></div>'
        : '<div class="ksys-pm-f"><span>Номер карты</span><b class="mono">2200 •••• •••• 4417</b></div><div class="ksys-pm-row"><div class="ksys-pm-f"><span>Срок</span><b class="mono">08/29</b></div><div class="ksys-pm-f"><span>CVC</span><b class="mono">•••</b></div></div>'}
        <button type="button" class="ksys-pm-btn" data-a="pm-ok">${sbp ? 'Подтвердить в банке' : 'Оплатить ' + rub(sum)}</button>
        <button type="button" class="ksys-pm-alt" data-a="pm-fail">Смоделировать отказ банка</button>
        <div class="ksys-pm-note">Это экран чужой системы — платёжного шлюза. «Колос» номер карты не видит.</div>
      </div></div>`;
  }
  const untilStart = o => o.day === 'today' ? hm(o.slot) - hm(MEM.clock) : 1440 - hm(MEM.clock) + hm(o.slot);
  function phDone() {
    const o = MEM.order, b = bakN(o.bak), sum = sumOf(o.items), canc = o.status === 'Отменён клиентом';
    const free = untilStart(o) >= 120, paid = o.pay !== 'cash';
    let conf = '';
    if (MEM.ph.confirm && !canc) {
      conf = free
        ? `<div class="ksys-ph-note warn">Отменить заказ? До начала интервала больше 2 часов${paid ? ` — ${rub(sum)} вернутся на ту же карту в течение 3 рабочих дней` : ''}.<div class="ksys-ph-2"><button type="button" data-a="ph-cancel-yes">Отменить</button><button type="button" data-a="ph-cancel-no">Оставить</button></div></div>`
        : `<div class="ksys-ph-note bad">До начала интервала меньше 2 часов: выпечка уже испечена под вас. ${paid ? `Отменить можно, но ${rub(sum)} не вернутся.` : 'Отменить можно.'}<div class="ksys-ph-2"><button type="button" data-a="ph-cancel-yes">Отменить${paid ? ' без возврата' : ''}</button><button type="button" data-a="ph-cancel-no">Оставить</button></div></div>`;
    }
    const stCls = canc ? 'bad' : PAID(o.status) ? 'ok' : 'warn';
    return `<div class="ksys-ph-okbox ${canc ? 'canc' : ''}"><div class="ksys-ph-okic" aria-hidden="true">${canc ? '↩' : '✓'}</div><b>${canc ? 'Заказ отменён' : 'Заказ принят'}</b>
        <div class="ksys-code" data-ap="1">${CODE}</div><small>Покажите код кассиру — имя называть не нужно</small></div>
      <div class="ksys-ph-li"><span>Статус</span><span class="ksys-stt ${stCls}" data-ap="2">${esc(o.status)}</span></div>
      <div class="ksys-ph-card"><div class="small dim">${esc(b.name)}, ${esc(b.addr)}</div><div><b>${dayLbl(o.day)}, ${ivl(o.slot)}</b></div>
        <div class="small">${esc(itemsText(o.items))}</div><div class="ksys-ph-li tot"><span>${o.pay === 'cash' ? 'К оплате на месте' : 'Оплачено ' + PAYT[o.pay]}</span><b class="tnum">${rub(sum)}</b></div></div>
      ${canc ? `<div class="ksys-ph-note" data-ap="4">${paid ? (o.refund ? `↩ ${rub(sum)} вернутся на карту в течение 3 рабочих дней.` : '↩ Отменён позже чем за 2 часа — деньги не возвращаются.') : 'Заказ снят — выпечка уйдёт на витрину.'}</div>`
        : `<div class="ksys-ph-note" data-ap="3">🧾 ${paid ? 'Чек «предоплата» — в SMS и на почте.' : 'Чек пробьют на кассе при выдаче.'}</div>
           ${o.late ? '<div class="ksys-ph-note warn">Собран из уже запланированной выпечки — в план цеха не добавлялся.</div>' : ''}
           <div class="ksys-ph-note" data-ap="5">🔔 Когда заказ соберут, придёт SMS.</div>`}
      ${conf}`;
  }
  function phoneHTML() {
    const ph = MEM.ph, scr = phScr(), key = 'phone:' + scr, st = MEM.sstate, dis = st !== 'normal';
    const b = bakN(ph.bak), n = cartList().reduce((s, x) => s + x.q, 0), sum = sumOf(cartList());
    let hd = '', body = '', ft = '';
    const D = dis ? 'disabled' : '';
    if (scr === 'where') {
      hd = phHead('Где и когда заберёте', null); body = phWhere();
      ft = `<button type="button" class="ksys-ph-btn" data-a="ph-go" data-v="cat" ${ph.slot && !dis ? '' : 'disabled'}>Дальше: выбрать выпечку →</button><small>${ph.slot ? `${esc(b.name)} · ${dayLbl(ph.day)} · ${ivl(ph.slot)}` : 'Выберите время начала интервала'}</small>`;
    } else if (scr === 'cat') {
      hd = phHead(`${esc(b.name)} · ${ph.day === 'today' ? 'сегодня' : 'вт'} · ${ivl(ph.slot)}`, 'where'); body = phCat();
      ft = `<div class="ksys-ph-sum" data-ap="5"><span>Корзина: ${n} шт.</span><b class="tnum">${rub(sum)}</b></div><button type="button" class="ksys-ph-btn" data-a="ph-go" data-v="pay" ${n && !dis ? '' : 'disabled'}>К оплате →</button>`;
    } else if (scr === 'pay') {
      hd = phHead('Оплата', 'cat'); body = phPay();
      ft = `<button type="button" class="ksys-ph-btn" data-a="ph-pay" ${D}>${ph.pay === 'cash' ? 'Оформить заказ' : 'Оплатить ' + rub(sum)}</button>`;
    } else {
      const o = MEM.order, canc = o.status === 'Отменён клиентом';
      hd = phHead('Мой заказ', null); body = phDone();
      ft = canc ? `<button type="button" class="ksys-ph-btn" data-a="ph-new" ${D}>Новый заказ</button>`
        : `<div class="ksys-ph-2"><button type="button" class="ksys-ph-btn ghost" data-a="ph-cancel" data-ap="4" ${D}>Отменить</button><button type="button" class="ksys-ph-btn ghost" data-a="ph-new" ${D}>Новый заказ</button></div><button type="button" class="ksys-ph-btn" data-a="go-live">Что было «за стеной»? →</button>`;
    }
    if (dis) body = stateBody(key);
    const sheet = ph.sheet && scr === 'pay' && !dis ? pmSheet() : '';
    return `<div class="ksys-phone"><div class="ksys-ph-scr">
      <div class="ksys-ph-sb"><span class="tnum">${MEM.clock}</span><span class="notch" aria-hidden="true"></span><span>${st === 'offline' ? '✈ нет сети' : '4G ▮▮▮'}</span></div>
      ${hd}<div class="ksys-ph-body">${body}</div><div class="ksys-ph-ft">${ft}</div>${sheet}</div></div>`;
  }
  function placeOrder(status) {
    const ph = MEM.ph;
    MEM.order = { bak: ph.bak, day: ph.day, slot: ph.slot, items: cartList(), pay: ph.pay, status, late: MEM.clock === '22:40' && ph.day === 'tomorrow', at: MEM.clock, code: CODE, refund: false };
    MEM.cash.st = {}; MEM.cash.pend = {}; MEM.cash.iv = 1; MEM.cash.q = '';
    MEM.live = { variant: MEM.order.late ? 'late' : 'normal', step: 0 };
    ph.scr = 'done'; ph.sheet = false; ph.err = ''; ph.confirm = false;
  }

  // ---------- планшет кассира ----------
  function cashData() {
    const o = MEM.order && MEM.order.status !== 'Отменён клиентом' ? MEM.order : null;
    const slot = o ? o.slot : DEF.slot, bak = bakN(o ? o.bak : 1), s = hm(slot);
    const prev = s - 30 >= 420 ? fm(s - 30) : null, next = s + 30 < 1260 ? fm(s + 30) : null;
    const noCro = t => hm(t) < hm('07:30');
    const L = [];
    if (prev) L.push({ code: 'К-238', iv: prev, items: [{ id: noCro(prev) ? 13 : 11, q: 4 }], pay: 'card', st: 'Выдан' }, { code: 'К-241', iv: prev, items: [{ id: 12, q: 1 }, { id: 14, q: 3 }], pay: 'cash', st: 'Принят пекарней', hold: true });
    L.push({ code: 'К-243', iv: slot, items: [{ id: 12, q: 2 }], pay: 'card', st: 'Собран' });
    L.push({ code: 'К-245', iv: slot, items: noCro(slot) ? [{ id: 14, q: 2 }, { id: 15, q: 1 }] : [{ id: 11, q: 1 }, { id: 14, q: 2 }, { id: 15, q: 1 }], pay: 'cash', st: 'Принят пекарней' });
    L.push({ code: 'К-246', iv: slot, items: [{ id: 13, q: 2 }], pay: 'sbp', st: 'Принят пекарней' });
    L.push({ code: CODE, iv: slot, items: o ? o.items : DEF.items, pay: o ? o.pay : DEF.pay, st: 'Принят пекарней', mine: !!o });
    if (next) L.push({ code: 'К-249', iv: next, items: [{ id: noCro(next) ? 13 : 11, q: 6 }], pay: 'card', st: 'Принят пекарней' }, { code: 'К-252', iv: next, items: [{ id: 15, q: 2 }], pay: 'cash', st: 'Принят пекарней' });
    L.forEach(x => { if (MEM.cash.st[x.code]) x.st = MEM.cash.st[x.code]; });
    return { list: L, slot, prev, next, bak, now: fm(s + 5) };
  }
  function ocHTML(x, first) {
    const sum = sumOf(x.items), online = x.pay !== 'cash', pend = MEM.cash.pend[x.code];
    let act = '';
    if (x.st === 'Принят пекарней') act = `<button type="button" class="ksys-big" data-a="c-col" data-v="${x.code}" ${first.col ? '' : 'data-ap="4"'}>Собрать</button>`, first.col = true;
    else if (x.st === 'Собран') act = `<button type="button" class="ksys-big primary" data-a="c-iss" data-v="${x.code}" ${first.iss ? '' : 'data-ap="6"'}>${online ? 'Выдать' : `Принять ${rub(sum)} и выдать`}</button>`, first.iss = true;
    else if (x.st === 'Выдан') act = `<span class="ksys-oc-done">✓ Выдан · ${pend ? '⏳ чек в очереди' : 'чек полного расчёта пробит'}</span>`;
    return `<div class="ksys-oc ${x.mine ? 'mine' : ''} ${x.st === 'Выдан' ? 'done' : ''}">
      <div class="ksys-oc-h"><b class="ksys-oc-code">${x.code}</b>${x.mine ? '<span class="chip info">ваш заказ</span>' : ''}<span class="chip ${online ? 'ok' : 'warn'}">${online ? 'оплачен' : 'к оплате ' + rub(sum)}</span></div>
      <div class="ksys-oc-it">${esc(itemsText(x.items))}</div>
      <div class="ksys-oc-st"><span class="dim">Статус:</span> <b>${esc(x.st)}</b>${pend ? ' <span class="chip warn">⏳ не отправлено</span>' : ''}</div>
      <div class="ksys-oc-a">${act}</div></div>`;
  }
  function cashHTML() {
    const D = cashData(), st = MEM.sstate, off = st === 'offline', q = MEM.cash.q;
    const ivs = [D.prev, D.slot, D.next], cur = ivs[MEM.cash.iv] || D.slot;
    const cnt = s => D.list.filter(x => x.iv === s).length;
    let list = q ? D.list.filter(x => x.code.slice(2).startsWith(q)) : D.list.filter(x => x.iv === cur);
    if (st === 'empty' && !q) list = [];
    const first = {};
    let cards;
    if (st === 'loading') cards = '<div class="ksys-skel cards" aria-hidden="true"><i></i><i></i><i></i></div><div class="ksys-st-msg"><span class="ksys-spin" aria-hidden="true"></span><b>Обновляем список…</b></div>';
    else if (!list.length) cards = st === 'empty' ? `<div class="ksys-st-msg empty"><span class="ico" aria-hidden="true">🧺</span><b>В этом интервале заказов нет</b><span>Ближайшие — ${D.next ? ivl(D.next) : 'завтра'}.</span></div>` : '<div class="ksys-st-msg"><b>Нет заказа с таким кодом</b><span>Проверьте цифры или сотрите их кнопкой «С».</span></div>';
    else cards = list.map(x => ocHTML(x, first)).join('');
    const hold = D.list.find(x => x.hold && x.st === 'Принят пекарней');
    const banner = st === 'error' ? `<div class="ksys-tb-ban bad">⚠️ Сервер не ответил — показан список на ${D.slot}. Выдавать можно.</div>`
      : off ? `<div class="ksys-tb-ban warn">📵 Нет связи — работаю офлайн. Кнопки работают: действия и чеки уйдут, когда связь вернётся.</div>`
        : MEM.cash.sent ? `<div class="ksys-tb-ban ok">📶 ${esc(MEM.cash.sent)}</div>` : '';
    return `<div class="ksys-tdev"><div class="ksys-tscr">
      <div class="ksys-tb-top"><span class="ksys-tb-brand">🌾 Колос · ${esc(D.bak.name)} · касса 1</span><span class="ksys-tb-clock tnum">вт ${D.now}</span>
        <span class="ksys-net ${off ? 'off' : ''}" data-ap="7">${off ? `⚠ Нет связи — работаю офлайн${MEM.cash.queue ? ' · в очереди: ' + MEM.cash.queue : ''}` : '● В сети'}</span>
        <button type="button" class="ksys-big ghost sm" data-a="c-phone" data-ap="8">☎ Заказ по телефону</button></div>
      ${MEM.cash.phone ? '<div class="ksys-tb-ban info">☎ Кассир оформляет заказ за покупателя: пекарня и ближайший интервал уже выбраны, выпечку отмечают крупными кнопками, оплата — на месте. В этом макете экран не нарисован — его описывают отдельной спецификацией.</div>' : ''}
      ${banner}
      <div class="ksys-cash">
        <div class="ksys-cash-l">
          <div class="ksys-ivs" data-ap="3">${ivs.map((s, i) => s ? `<button type="button" class="ksys-iv" data-a="c-iv" data-v="${i}" aria-pressed="${!q && MEM.cash.iv === i}"><b class="tnum">${ivl(s)}</b><small>${i === 1 ? 'сейчас · ' : ''}${cnt(s)} ${TR.plural(cnt(s), 'заказ', 'заказа', 'заказов')}</small></button>` : '').join('')}</div>
          ${q ? `<div class="small dim">Поиск по коду «К-${esc(q)}»: ${list.length} ${TR.plural(list.length, 'заказ', 'заказа', 'заказов')}</div>` : ''}
          <div class="ksys-ocs">${cards}</div>
          ${hold && !q ? `<div class="ksys-hold" data-ap="5">⏳ <b>${hold.code}</b> (${ivl(hold.iv)}, к оплате ${rub(sumOf(hold.items))}) не забрали. Держим до ${fm(hm(D.slot) + 30)}, потом — «Не выкуплен», выпечку на витрину.</div>` : ''}
        </div>
        <div class="ksys-kp"><div class="ksys-kp-scr" data-ap="2" aria-live="polite"><span class="dim">Код</span> <b class="mono">К-${esc(q.padEnd(3, '·'))}</b></div>
          <div class="ksys-kp-g" data-ap="1">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => `<button type="button" data-a="c-d" data-v="${d}">${d}</button>`).join('')}<button type="button" data-a="c-d" data-v="del" aria-label="Стереть цифру">⌫</button><button type="button" data-a="c-d" data-v="0">0</button><button type="button" data-a="c-d" data-v="clr" aria-label="Очистить">С</button></div></div>
      </div></div></div>`;
  }

  // ---------- планшет цеха ----------
  const CAKES = [
    { code: 'Т-029', txt: 'Любимой бабушке', fill: 'медовик', kg: '1 кг', to: 'к 11:00 · Рождественская', c1: 'var(--p3)', c2: 'var(--p5)' },
    { code: 'Т-031', txt: 'С юбилеем, мама!', fill: 'шоколадный с вишней', kg: '2 кг', to: 'к 15:00 · Покровка', c1: 'var(--p5)', c2: 'var(--p1)' },
    { code: 'Т-032', txt: 'Арсению 7 лет', fill: 'ванильный с клубникой', kg: '1,5 кг', to: 'к 17:30 · доставка курьером', c1: 'var(--p1)', c2: 'var(--p2)' }
  ];
  const CAKE_NEXT = { 'Предоплачен': ['В производстве', 'Начать'], 'В производстве': ['Готов', 'Готов'] };
  function planRows(rain, o) {
    return PROD.map(p => {
      const base = rain ? Math.round(p.base * (p.kind === 'хлеб' ? 1.1 : p.kind === 'десерт' ? 0.9 : 1)) : p.base;
      const mine = o ? (o.items.find(x => x.id === p.id) || { q: 0 }).q : 0;
      return { p, base, pre: p.pre + mine, mine, tot: base + p.pre + mine, ch: base !== p.base };
    });
  }
  const planOrder = () => { const o = MEM.order; return o && o.status !== 'Отменён клиентом' && !o.late && o.day === 'tomorrow' ? o : null; };
  function shopHTML() {
    const s = MEM.shop, st = MEM.sstate, rows = planRows(s.rain, planOrder());
    const max = Math.max(...rows.map(r => r.tot)), preSum = rows.reduce((a, r) => a + r.pre, 0), mineSum = rows.reduce((a, r) => a + r.mine, 0);
    let plan;
    if (st === 'loading') plan = '<div class="ksys-skel" aria-hidden="true"><i></i><i></i><i></i><i></i></div>';
    else plan = `<div class="ksys-plan" role="table" aria-label="План выпечки на вторник">
        <div class="ksys-plan-r h" role="row"><span>Товар</span><span data-ap="2">База</span><span data-ap="3">+ Предзаказы</span><span>Итого</span><span class="bar"></span></div>
        ${rows.map(r => `<div class="ksys-plan-r" role="row"><span><span aria-hidden="true">${r.p.ico}</span> ${esc(r.p.sh)}</span><span class="tnum ${r.ch ? 'chg' : ''}">${r.base}</span><span class="tnum plus">+${r.pre}${r.mine ? `<em>ваш +${r.mine}</em>` : ''}</span><b class="tnum">${r.tot}</b><span class="bar" aria-hidden="true"><i style="width:${(r.base / max * 100).toFixed(1)}%"></i><i class="pre" style="width:${(r.pre / max * 100).toFixed(1)}%"></i></span></div>`).join('')}
      </div>
      <div class="ksys-plan-f"><span data-ap="1">🧺 Предзаказы добавили к плану <b>+${preSum} шт.</b> по всей сети${mineSum ? `, из них ваш заказ — <b>+${mineSum}</b>` : ''}. Сами, в 23:00.</span>
        <button type="button" class="ksys-big ghost sm" data-a="s-rain" aria-pressed="${s.rain}" data-ap="5">🌧 Дождь завтра: ${s.rain ? 'учтён' : 'учесть'}</button></div>
      ${s.rain ? '<div class="small muted">Технолог поправила базу вручную: хлеб +10 %, десерты −10 %. Предзаказы не трогаем — их уже заказали.</div>' : ''}`;
    const cakes = CAKES.map((c, i) => {
      const cs = s.cakes[c.code], nx = CAKE_NEXT[cs];
      return `<div class="ksys-ck" ${i === 1 ? 'data-ap="6"' : ''}><div class="ksys-cake" style="--c1:${c.c1};--c2:${c.c2}" aria-hidden="true"><i class="pl"></i><i class="t1"></i><i class="t2"></i><i class="cr"></i><i class="cd"></i><small>фото-образец</small></div>
        <div class="ksys-ck-b"><div class="row"><b class="mono">${c.code}</b><span class="chip ${cs === 'Готов' ? 'ok' : cs === 'В производстве' ? 'warn' : ''}">${esc(cs)}</span></div>
          <div class="ksys-ck-txt">«${esc(c.txt)}»</div><small>${esc(c.fill)} · ${esc(c.kg)}</small><small>${esc(c.to)}</small>
          ${nx ? `<button type="button" class="ksys-big sm" data-a="k-st" data-v="${c.code}">${nx[1]}</button>` : '<small class="ok">✓ SMS покупателю отправлено</small>'}</div></div>`;
    }).join('');
    const load = [['вт 6 окт', 18], ['ср 7 окт', 21], ['чт 8 окт', s.thu]];
    const ban = st === 'offline' ? '<div class="ksys-tb-ban warn">📵 Нет связи. Показан план, загруженный в 23:00. Отметки «Готов» уйдут, когда связь вернётся.</div>'
      : st === 'error' ? '<div class="ksys-tb-ban bad">⚠️ План не обновился — показан сохранённый в 23:00.</div>' : '';
    const draft = st === 'empty';
    return `<div class="ksys-tdev"><div class="ksys-tscr">
      <div class="ksys-tb-top"><span class="ksys-tb-brand">🥖 Цех · Московское шоссе</span><span class="ksys-tb-clock tnum">пн ${draft ? '22:15' : '23:00'}</span>
        <span class="ksys-net ${draft ? 'off' : ''}" data-ap="4">${draft ? '✎ черновик — утвердится в 23:00' : '✓ план на вт 6 октября утверждён в 23:00'}</span></div>
      ${ban}
      <div class="ksys-shop">
        <section><h4>План выпечки на вторник · вся сеть</h4>${plan}</section>
        <section><div class="ksys-cakes-h"><h4>Торты на вт 6 октября</h4><span class="ksys-cap" data-ap="7"><b class="tnum">18 из 25</b>${ui.meter(18 / 25)}</span></div>
          <div class="ksys-cks">${cakes}</div>
          <div class="ksys-load" data-ap="8"><b>Загрузка по тортам</b>${load.map(l => `<div class="ksys-load-r"><span>${l[0]}</span>${ui.meter(l[1] / 25, l[1] >= 25 ? 'bad' : l[1] >= 22 ? 'warn' : '')}<span class="tnum">${l[1]} из 25</span></div>`).join('')}</div>
        </section>
      </div></div></div>`;
  }
  function cakeSim() {
    const m = MEM.shop.msg;
    return `<div class="ksys-sim"><div class="small"><b>Смоделируйте заявку на торт.</b> Сейчас понедельник, 21:40.</div>
      <div class="row"><button type="button" class="btn sm" data-a="k-req" data-v="wed">Торт на ср 7 октября</button><button type="button" class="btn sm" data-a="k-req" data-v="thu">Торт на чт 8 октября</button></div>
      ${m ? ui.note(m.ok ? 'ok' : 'bad', m.ok ? 'Принят' : 'Отклонён', m.html) : ''}</div>`;
  }

  // ---------- боковая панель ----------
  function piHTML(p) {
    return `<div class="ksys-pi ksys-k-${p.k}" data-pi="${p.n}" role="button" tabindex="0"><span class="ksys-pin st">${p.n}</span>
      <div class="ksys-pi-b"><span class="ksys-pi-k">${KIND[p.k].ico} ${KIND[p.k].t}</span><span>${esc(p.t)}</span>
      ${p.f || p.db ? `<span class="ksys-pi-m">${facts(p.f)}${p.db ? `<code>${esc(p.db)}</code>` : ''}</span>` : ''}</div></div>`;
  }
  function sideHTML() {
    const a = ABOUT[MEM.dev];
    if (!MEM.analyst) return `<div class="ksys-side-c"><div class="eyebrow">Что это</div><h3>${a.t}</h3><p class="small">${a.what}</p>
        <p class="small muted"><b>Кто пользуется:</b> ${a.who}. <b>В пекарне это</b> ${a.an}.</p></div>
      <div class="ksys-side-c"><div class="eyebrow">Попробуйте</div><ol class="ksys-tips">${a.tips.map(t => `<li>${t}</li>`).join('')}</ol>${MEM.dev === 'shop' ? cakeSim() : ''}</div>
      <div class="ksys-side-c ksys-side-an"><b>🔍 Глазами аналитика</b><span class="small muted">Включите — на экране появятся метки: какое правило здесь работает, откуда берутся данные и какие у экрана состояния.</span><button type="button" class="btn sm primary" data-a="an">Включить</button></div>`;
    const key = devKey(), pins = PINS[key] || [], sx = STX[key] || {};
    const cnt = k => pins.filter(p => p.k === k).length;
    return `<div class="ksys-side-c"><div class="eyebrow">Глазами аналитика · ${a.t}</div>
        <div class="ksys-legend">${['rule', 'data', 'int', 'state'].filter(cnt).map(k => `<span class="ksys-k-${k}"><i></i>${KIND[k].t}: ${cnt(k)}</span>`).join('')}</div>
        <p class="small muted">Цифры на экране — метки. Нажмите на метку или на строку: покажу, где это.</p>
        <div class="ksys-pis">${pins.map(piHTML).join('')}</div></div>
      <div class="ksys-side-c"><div class="eyebrow">Состояния экрана</div><p class="small muted">Экран бывает не только «красивым». Каждое состояние рисуют и описывают — иначе программист придумает его сам.</p>
        <div class="ksys-sts">${STATES.map(s => { const x = sx[s.v]; return `<button type="button" class="ksys-sti" data-a="sst" data-v="${s.v}" aria-pressed="${MEM.sstate === s.v}"><b>${s.t}</b><span>${s.v === 'normal' ? 'то, что нарисовано в макете' : x ? esc(x.ttl) : '—'}</span>${x && x.sys && MEM.sstate === s.v ? `<em>${esc(x.sys)}</em>` : ''}</button>`; }).join('')}</div></div>
      <div class="ksys-side-c small muted">Из меток и состояний складывается <b>спецификация экрана</b>: поле → откуда данные → какое правило → что видно в каждом состоянии. Её читают дизайнер Соня, разработчики и тестировщица Лера.</div>`;
  }

  function renderScreens(box, inst) {
    function draw() {
      const nb = TR.$('.ksys-ph-body', box), keep = nb ? nb.scrollTop : 0, was = box.dataset.scr;
      const dev = MEM.dev;
      box.innerHTML = `<div class="ksys-scr-top">
          <div class="ksys-devs" role="group" aria-label="Устройство">${DEVS.map(d => `<button type="button" class="ksys-dv" data-a="dev" data-v="${d.v}" aria-pressed="${dev === d.v}"><span aria-hidden="true">${d.ico}</span><span class="lg">${d.t}</span><span class="sh">${d.sh}</span></button>`).join('')}</div>
          <button type="button" class="ksys-antg" data-a="an" aria-pressed="${MEM.analyst}"><span class="sw" aria-hidden="true"></span>Глазами аналитика</button>
        </div>
        <div class="ksys-scr-ctl">${dev === 'phone' ? `<div class="ksys-ctl"><span class="small dim">🕘 Время в сюжете</span>${segA('clock', CLOCKS, MEM.clock)}</div>` : ''}
          <div class="ksys-ctl"><span class="small dim">Состояние экрана</span>${segA('sst', STATES, MEM.sstate)}</div></div>
        <div class="ksys-scr is-${dev}">
          <div class="ksys-devbox ${MEM.analyst ? 'ksys-an' : ''}">${dev === 'phone' ? phoneHTML() : dev === 'cash' ? cashHTML() : shopHTML()}</div>
          <aside class="ksys-side" aria-label="Пояснения к экрану">${sideHTML()}</aside>
        </div>`;
      decorate(TR.$('.ksys-devbox', box), PINS[devKey()] || []);
      const nb2 = TR.$('.ksys-ph-body', box); if (nb2 && was === devKey()) nb2.scrollTop = keep;
      box.dataset.scr = devKey();
    }
    function act(a, v) {
      const ph = MEM.ph;
      switch (a) {
        case 'dev': MEM.dev = v; MEM.sstate = 'normal'; MEM.cash.sent = ''; break;
        case 'an': MEM.analyst = !MEM.analyst; break;
        case 'clock': MEM.clock = v; if (v !== '10:30' && ph.day === 'today') { ph.day = 'tomorrow'; } if (ph.slot && !daySlots().includes(ph.slot)) ph.slot = null; clampCart(); if (ph.scr !== 'done' && !ph.slot) ph.scr = 'where'; break;
        case 'sst':
          if (MEM.dev === 'cash' && MEM.sstate === 'offline' && v !== 'offline' && MEM.cash.queue) {
            const ev = MEM.cash.queue, ch = Object.keys(MEM.cash.pend).length;
            MEM.cash.sent = `Связь вернулась: отправлено событий — ${ev}, чеков полного расчёта — ${ch}. Ничего не потерялось.`;
            MEM.cash.queue = 0; MEM.cash.pend = {};
          } else MEM.cash.sent = '';
          MEM.sstate = v; break;
        case 'ph-bak': ph.bak = +v; break;
        case 'ph-day': ph.day = v; if (ph.slot && !daySlots().includes(ph.slot)) ph.slot = null; clampCart(); break;
        case 'ph-slot': ph.slot = v; clampCart(); break;
        case 'ph-go': if (v === 'cat' && !ph.slot) return; ph.scr = v; ph.sheet = false; if (v !== 'pay') ph.err = ''; break;
        case 'ph-q': { const [id, d] = v.split(':').map(Number), a2 = availOf(byP(id)); ph.cart[id] = Math.max(0, Math.min(a2.max, (ph.cart[id] || 0) + d)); if (!ph.cart[id]) delete ph.cart[id]; break; }
        case 'ph-pm': ph.pay = v; ph.err = ''; break;
        case 'ph-pay': if (!cartList().length) return; if (ph.pay === 'cash') placeOrder('Ждёт оплаты на месте'); else { ph.sheet = true; ph.err = ''; } break;
        case 'pm-ok': placeOrder('Оплачен'); break;
        case 'pm-fail': ph.sheet = false; ph.err = 'fail'; break;
        case 'ph-cancel': ph.confirm = true; break;
        case 'ph-cancel-no': ph.confirm = false; break;
        case 'ph-cancel-yes': if (MEM.order) { MEM.order.refund = untilStart(MEM.order) >= 120 && MEM.order.pay !== 'cash'; MEM.order.status = 'Отменён клиентом'; } ph.confirm = false; break;
        case 'ph-new': ph.scr = 'where'; ph.cart = {}; ph.slot = null; ph.err = ''; ph.sheet = false; ph.confirm = false; break;
        case 'go-live': inst.show('live'); return;
        case 'c-iv': MEM.cash.iv = +v; MEM.cash.q = ''; break;
        case 'c-d': { let q = MEM.cash.q; if (v === 'del') q = q.slice(0, -1); else if (v === 'clr') q = ''; else if (q.length < 3) q += v; MEM.cash.q = q; break; }
        case 'c-col': case 'c-iss': {
          MEM.cash.st[v] = a === 'c-col' ? 'Собран' : 'Выдан';
          if (MEM.sstate === 'offline') { MEM.cash.queue++; if (a === 'c-iss') MEM.cash.pend[v] = true; }
          if (v === CODE && MEM.order) MEM.order.status = MEM.cash.st[v];
          break;
        }
        case 'c-phone': MEM.cash.phone = !MEM.cash.phone; break;
        case 's-rain': MEM.shop.rain = !MEM.shop.rain; break;
        case 'k-st': { const nx = CAKE_NEXT[MEM.shop.cakes[v]]; if (nx) MEM.shop.cakes[v] = nx[0]; break; }
        case 'k-req':
          if (v === 'wed') MEM.shop.msg = { ok: false, html: 'До среды, 7 октября, меньше 48 часов: цех не успеет. Заявка получает статус «Отклонён» сразу, ещё до предоплаты (F-cake48).' };
          else if (MEM.shop.thu < 25) { MEM.shop.thu++; MEM.shop.msg = { ok: true, html: `На четверг, 8 октября, — больше 48 часов, место есть: <b>${MEM.shop.thu} из 25</b>. Дальше — согласование надписи и предоплата 50 %.` }; }
          else MEM.shop.msg = { ok: false, html: 'На четверг уже 25 тортов — это потолок цеха (F-cakecap). Система не даст принять 26-й: статус «Отклонён: нет мощности». В праздники с дополнительной сменой — до 60.' };
          break;
        default: return;
      }
      draw();
    }
    box.addEventListener('click', e => {
      const pin = e.target.closest('.ksys-pin');
      if (pin && box.contains(pin) && !pin.classList.contains('st')) {
        e.preventDefault(); e.stopPropagation();
        const it = TR.$(`.ksys-pi[data-pi="${pin.dataset.pin}"]`, box);
        if (it) { TR.$$('.ksys-pi.hl', box).forEach(x => x.classList.remove('hl')); it.classList.add('hl'); flash(it); try { it.scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' }); } catch (er) { } }
        return;
      }
      const pi = e.target.closest('.ksys-pi');
      if (pi && !e.target.closest('[data-fact]')) {
        const el = TR.$(`.ksys-devbox [data-ap="${pi.dataset.pi}"]`, box);
        TR.$$('.ksys-pi.hl', box).forEach(x => x.classList.remove('hl')); pi.classList.add('hl');
        if (el) { el.classList.remove('ksys-ping'); void el.offsetWidth; el.classList.add('ksys-ping'); try { el.scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' }); } catch (er) { } }
        else ui.toast('Этой метки нет на текущем экране — она появится в другом состоянии или на другом шаге', 'warn');
        return;
      }
      const b = e.target.closest('[data-a]');
      if (b && box.contains(b) && !b.disabled) act(b.dataset.a, b.dataset.v);
    });
    box.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const t = e.target.closest('.ksys-pin, .ksys-pi'); if (!t) return;
      e.preventDefault(); t.click();
    });
    draw();
  }

  // =====================================================================
  // 2. Как это связано: схема «экраны — бэкенд — база — внешние системы»
  // =====================================================================
  const VB = { w: 956, h: 560 };
  const BE = { x: 262, y: 40, w: 330, h: 384 };
  const SW = 214, MW = 250, EW = 280;
  const N = {
    app: { x: 10, y: 96, w: SW, h: 64, k: 'scr', ico: '📱', t: 'Приложение покупателя', s: 'iOS и Android' },
    site: { x: 10, y: 174, w: SW, h: 64, k: 'scr', ico: '🌐', t: 'Сайт', s: 'тот же заказ в браузере' },
    cash: { x: 10, y: 252, w: SW, h: 64, k: 'scr', ico: '🧾', t: 'Планшет кассира', s: 'сборка и выдача у кассы' },
    shop: { x: 10, y: 330, w: SW, h: 64, k: 'scr', ico: '🥖', t: 'Планшет цеха', s: 'план выпечки и торты' },
    api: { x: 248, y: 96, w: 30, h: 316, k: 'api', ico: '', t: 'API', s: '' },
    catalog: { x: 316, y: 98, w: MW, h: 54, k: 'mod', ico: '📋', t: 'Каталог и остатки', s: 'товары, цены, витрина' },
    orders: { x: 316, y: 162, w: MW, h: 54, k: 'mod', ico: '🧺', t: 'Заказы', s: 'правила, коды, статусы' },
    pay: { x: 316, y: 226, w: MW, h: 54, k: 'mod', ico: '💳', t: 'Оплаты', s: 'деньги, чеки, сводка в 1С' },
    plan: { x: 316, y: 290, w: MW, h: 54, k: 'mod', ico: '📈', t: 'План выпечки', s: 'база + предзаказы в 23:00' },
    notify: { x: 316, y: 354, w: MW, h: 54, k: 'mod', ico: '🔔', t: 'Уведомления', s: 'SMS «заказ собран»' },
    db: { x: 262, y: 466, w: 270, h: 80, k: 'db', ico: '📒', t: 'База данных', s: 'заказы, товары, остатки, покупатели' },
    vk: { x: 666, y: 64, w: EW, h: 58, k: 'ext', ico: '💬', t: 'ВКонтакте', s: 'ссылка на заказ из постов' },
    paymost: { x: 666, y: 138, w: EW, h: 58, k: 'ext', ico: '🏦', t: '«ПэйМост»', s: 'платёжный шлюз: карта и СБП' },
    kassapro: { x: 666, y: 212, w: EW, h: 58, k: 'ext', ico: '🧮', t: '«КассаПро»', s: 'облачные кассы: чеки по 54-ФЗ' },
    onec: { x: 666, y: 286, w: EW, h: 58, k: 'ext', ico: '📊', t: '1С:Бухгалтерия', s: 'сводка продаж к 09:00' },
    sms: { x: 666, y: 360, w: EW, h: 58, k: 'ext', ico: '✉️', t: 'SMS-шлюз', s: 'SMS покупателю' }
  };
  const KCOL = { scr: 'var(--info)', mod: 'var(--accent)', db: 'var(--cyan)', ext: 'var(--violet)', api: 'var(--warn)' };
  const BUS = 298, APIX = 263;
  const VX = { 'catalog-vk': 622, 'pay-paymost': 610, 'pay-kassapro': 622, 'pay-onec': 634, 'notify-sms': 622 };
  const EDGES = [
    ['app', 'api'], ['site', 'api'], ['cash', 'api'], ['shop', 'api'],
    ['catalog', 'vk', 'dash'], ['pay', 'paymost'], ['pay', 'kassapro'], ['pay', 'onec'], ['notify', 'sms']
  ];
  const cyOf = n => n.y + n.h / 2;
  const PT = { r: n => [n.x + n.w, cyOf(n)], l: n => [n.x, cyOf(n)], t: n => [n.x + n.w / 2, n.y], b: n => [n.x + n.w / 2, n.y + n.h] };
  // маршрут между двумя блоками: ломаная по «улицам» схемы, чтобы линии не шли сквозь блоки
  function route(a, b) {
    const A = N[a], B = N[b]; if (!A || !B || a === b) return null;
    const ka = A.k, kb = B.k;
    if (ka === 'scr' && kb === 'mod') return [PT.r(A), [APIX, cyOf(A)], [APIX, cyOf(B)], PT.l(B)];
    if (ka === 'mod' && kb === 'scr') return route(b, a).reverse();
    if (ka === 'mod' && kb === 'db') return [PT.l(A), [BUS, cyOf(A)], [BUS, B.y + 8]];
    if (ka === 'db' && kb === 'mod') return route(b, a).reverse();
    if (ka === 'mod' && kb === 'ext') { const vx = VX[a + '-' + b] || 622; return [PT.r(A), [vx, cyOf(A)], [vx, cyOf(B)], PT.l(B)]; }
    if (ka === 'ext' && kb === 'mod') return route(b, a).reverse();
    if (ka === 'mod' && kb === 'mod') return [PT.r(A), [580, cyOf(A)], [580, cyOf(B)], PT.r(B)];
    if (ka === 'scr' && kb === 'ext') return [PT.l(A), [4, cyOf(A)], [4, 10], [646, 10], [646, cyOf(B)], PT.l(B)];
    if (ka === 'ext' && kb === 'scr') return [PT.b(A), [A.x + A.w / 2, 553], [4, 553], [4, cyOf(B)], PT.l(B)];
    if (ka === 'scr' && kb === 'api') return [PT.r(A), [B.x, cyOf(A)]];
    return [[A.x + A.w / 2, A.y + A.h / 2], [B.x + B.w / 2, B.y + B.h / 2]];
  }
  function rpath(pts, r) {
    r = r || 10;
    const p = pts.filter((q, i) => !i || Math.hypot(q[0] - pts[i - 1][0], q[1] - pts[i - 1][1]) > 0.5);
    let d = `M${p[0][0]} ${p[0][1]}`;
    for (let i = 1; i < p.length - 1; i++) {
      const [x0, y0] = p[i - 1], [x1, y1] = p[i], [x2, y2] = p[i + 1];
      const d1 = Math.hypot(x1 - x0, y1 - y0), d2 = Math.hypot(x2 - x1, y2 - y1), rr = Math.min(r, d1 / 2, d2 / 2);
      const ax = x1 - (x1 - x0) / d1 * rr, ay = y1 - (y1 - y0) / d1 * rr, bx = x1 + (x2 - x1) / d2 * rr, by = y1 + (y2 - y1) / d2 * rr;
      d += ` L${ax.toFixed(1)} ${ay.toFixed(1)} Q${x1} ${y1} ${bx.toFixed(1)} ${by.toFixed(1)}`;
    }
    const l = p[p.length - 1]; return d + ` L${l[0]} ${l[1]}`;
  }
  function nodeSVG(id) {
    const n = N[id], c = KCOL[n.k];
    if (n.k === 'api') return `<g class="ksys-node" data-node="api" style="--nc:${c}" tabindex="0" role="button" aria-label="API — окошко выдачи">
      <rect class="bx" x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="9"/>
      <text x="${n.x + n.w / 2}" y="${n.y + n.h / 2}" transform="rotate(-90 ${n.x + n.w / 2} ${n.y + n.h / 2})" text-anchor="middle" dominant-baseline="central" class="tt">API · окошко выдачи</text></g>`;
    if (n.k === 'db') {
      const rx = n.w / 2, ry = 11;
      return `<g class="ksys-node" data-node="db" style="--nc:${c}" tabindex="0" role="button" aria-label="База данных">
        <path class="bx" d="M${n.x} ${n.y + ry} a${rx} ${ry} 0 0 1 ${n.w} 0 v${n.h - ry * 2} a${rx} ${ry} 0 0 1 ${-n.w} 0 z"/>
        <ellipse class="bx top" cx="${n.x + rx}" cy="${n.y + ry}" rx="${rx}" ry="${ry}"/>
        <text x="${n.x + 52}" y="${n.y + 44}" class="tt">${esc(n.t)}</text><text x="${n.x + 52}" y="${n.y + 62}" class="ts">${esc(n.s)}</text>
        <text x="${n.x + 16}" y="${n.y + 54}" class="ti">${n.ico}</text></g>`;
    }
    return `<g class="ksys-node k-${n.k}" data-node="${id}" style="--nc:${c}" tabindex="0" role="button" aria-label="${esc(n.t)}">
      <rect class="bx" x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="10"/>
      <rect class="st" x="${n.x}" y="${n.y + 8}" width="4" height="${n.h - 16}" rx="2"/>
      <text x="${n.x + 14}" y="${cyOf(n) + 6}" class="ti">${n.ico}</text>
      <text x="${n.x + 42}" y="${cyOf(n) - 4}" class="tt">${esc(n.t)}</text>
      <text x="${n.x + 42}" y="${cyOf(n) + 13}" class="ts">${esc(n.s)}</text></g>`;
  }
  function mapSVG() {
    let s = `<svg class="ksys-svg" viewBox="0 0 ${VB.w} ${VB.h}" role="img" aria-label="Схема системы «Колос»: экраны, бэкенд с модулями, база данных и внешние системы">
      <defs><marker id="ksys-ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" style="fill:var(--text-muted)"/></marker></defs>
      <text x="10" y="30" class="ksys-colt">ЭКРАНЫ · ФРОНТЕНД</text>
      <text x="262" y="30" class="ksys-colt">СЕРВЕР · БЭКЕНД</text>
      <text x="666" y="30" class="ksys-colt">ВНЕШНИЕ СИСТЕМЫ · ИНТЕГРАЦИИ</text>
      <text x="10" y="62" class="ksys-note">👤 люди нажимают кнопки</text>
      <text x="10" y="80" class="ksys-note">покупатель · кассир · технолог</text>
      <rect class="ksys-be" x="${BE.x}" y="${BE.y}" width="${BE.w}" height="${BE.h}" rx="14"/>
      <text x="${BE.x + 24}" y="${BE.y + 24}" class="ksys-bet">⚙ Бэкенд «Колос-заказы»</text>
      <text x="${BE.x + 24}" y="${BE.y + 42}" class="ksys-bes">кухня за стеной: правила, расчёты, статусы</text>
      <g class="ksys-edges">`;
    ['catalog', 'orders', 'pay', 'plan', 'notify'].forEach(m => { const y = cyOf(N[m]); s += `<line x1="${N.api.x + N.api.w}" y1="${y}" x2="${N[m].x}" y2="${y}" class="ksys-e in"/>`; });
    s += `<path d="M${BUS} ${cyOf(N.catalog)} V${N.db.y + 8}" class="ksys-e bus"/><text x="${BUS + 8}" y="${N.db.y - 10}" class="ksys-note">чтение и запись</text>`;
    EDGES.forEach(e => { const pts = route(e[0], e[1]); if (pts) s += `<path d="${rpath(pts)}" class="ksys-e ${e[2] || ''}" marker-end="url(#ksys-ar)"><title>${esc(N[e[0]].t)} ↔ ${esc(N[e[1]].t)}</title></path>`; });
    s += '</g><g class="ksys-nodes">' + Object.keys(N).map(nodeSVG).join('') + '</g><g class="ksys-hops"></g></svg>';
    return s;
  }
  // подсветить шаг сценария на схеме: путь, бегущая точка, подпись
  function hopOn(svg, st, opt) {
    const layer = TR.$('.ksys-hops', svg); if (!layer) return;
    const token = (svg._tok = (svg._tok || 0) + 1);
    layer.innerHTML = '';
    TR.$$('.ksys-node.on', svg).forEach(g => g.classList.remove('on', 'to'));
    if (!st || !st.from) return;
    const gA = TR.$(`[data-node="${st.from}"]`, svg), gB = st.to && TR.$(`[data-node="${st.to}"]`, svg);
    gA && gA.classList.add('on'); if (gB) gB.classList.add('on', 'to');
    const kind = st.kind || (st.dir === 'res' ? 'res' : '');
    if (!st.to || st.to === st.from) {
      const n = N[st.from];
      layer.innerHTML = `<rect class="ksys-ring ${kind}" x="${n.x - 5}" y="${n.y - 5}" width="${n.w + 10}" height="${n.h + 10}" rx="14"/>${st.who === 'timer' ? `<text x="${n.x + n.w - 6}" y="${n.y + 2}" class="ksys-tbadge">⏰</text>` : ''}`;
      return;
    }
    const pts = route(st.from, st.to); if (!pts) return;
    layer.innerHTML = `<path class="ksys-hop ${st.dir === 'res' ? 'res' : ''} ${kind}" d="${rpath(pts)}"/><g class="ksys-hl"><rect rx="9"/><text></text></g><circle class="ksys-dot ${kind}" r="7"/>${st.who === 'timer' ? `<text x="${N[st.from].x + N[st.from].w - 6}" y="${N[st.from].y + 2}" class="ksys-tbadge">⏰</text>` : ''}`;
    const path = TR.$('path', layer), dot = TR.$('circle', layer), lab = TR.$('.ksys-hl', layer);
    let L = 0; try { L = path.getTotalLength(); } catch (e) { L = 0; }
    const at = f => { try { return path.getPointAtLength(L * f); } catch (e) { const p = pts[pts.length - 1]; return { x: p[0], y: p[1] }; } };
    if (st.lbl) {
      const m = at(st.lp || 0.5), t = TR.$('text', lab); t.textContent = st.lbl;
      let w = st.lbl.length * 6.9 + 16; try { w = t.getComputedTextLength() + 18; } catch (e) { }
      const x = Math.max(4, Math.min(VB.w - w - 4, m.x - w / 2)), y = Math.max(4, Math.min(VB.h - 26, m.y - 30));
      const r = TR.$('rect', lab); r.setAttribute('x', x); r.setAttribute('y', y); r.setAttribute('width', w); r.setAttribute('height', 22);
      t.setAttribute('x', x + w / 2); t.setAttribute('y', y + 15); t.setAttribute('text-anchor', 'middle');
    } else lab.remove();
    const put = f => { const p = at(f); dot.setAttribute('cx', p.x.toFixed(1)); dot.setAttribute('cy', p.y.toFixed(1)); };
    if (!L || reduced() || (opt && opt.still)) { put(1); return; }
    const dur = Math.max(650, Math.min(1500, L * 2.1)), t0 = performance.now();
    put(0);
    const tick = now => {
      if (svg._tok !== token) return;
      const f = Math.min(1, (now - t0) / dur), e = f < .5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
      put(e); if (f < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  // держать текущий шаг в поле зрения, когда схема шире экрана
  function hopScroll(board, st) {
    if (!board || !st || !st.from || board.scrollWidth <= board.clientWidth + 4) return;
    const svg = TR.$('svg', board); if (!svg) return;
    const k = svg.getBoundingClientRect().width / VB.w;
    const xs = [N[st.from], N[st.to || st.from]].filter(Boolean).map(n => n.x + n.w / 2);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2 * k;
    try { board.scrollTo({ left: Math.max(0, cx - board.clientWidth / 2), behavior: reduced() ? 'auto' : 'smooth' }); } catch (e) { board.scrollLeft = cx - board.clientWidth / 2; }
  }

  // ---------- карточки блоков ----------
  const CONTRACT = ['кто кого вызывает и когда', 'адрес и формат запроса', 'поля и их смысл', 'ответы и коды ошибок', 'повторы и тайм-ауты', 'что делаем, если чужая система молчит'];
  const INFO = {
    app: { plain: 'Программа в телефоне покупателя. Показывает каталог, собирает корзину и отправляет заказ на сервер. Сама ничего не решает и не хранит — только спрашивает и красиво показывает ответ.', an: 'Витрина и прилавок: на них смотрят и показывают пальцем, но пекут не здесь.', who: 'покупатели, в том числе пришедшие по ссылке из ВКонтакте', data: 'каталог, корзина, интервал, код заказа, статус', art: 'Спецификация экрана', does: 'Поля экрана, откуда берутся данные, какие правила видит человек, все состояния (пусто, загрузка, ошибка, нет связи) и пользовательский путь: от «хочу круассан» до кода К-247.', go: { view: 'screens', dev: 'phone', t: 'Открыть телефон покупателя' } },
    site: { plain: 'Тот же заказ, только в браузере, без установки приложения. Это отдельный фронтенд: его делают и обновляют отдельно, но ходит он в тот же бэкенд.', an: 'Второе окошко той же пекарни — с улицы.', who: 'покупатели без приложения; переходы из постов ВКонтакте', data: 'то же, что в приложении', art: 'Спецификация экрана', does: 'Что на сайте так же, а что иначе. Главное — правила не дублировать на сайте: их проверяет бэкенд, один раз для всех входов.' },
    cash: { plain: 'Веб-приложение на планшете у кассы: заказы ближайшего интервала, поиск по коду, крупные кнопки «Собрать» и «Выдать». Через него же кассир оформляет заказ по телефону за тех, у кого нет смартфона.', an: 'Тетрадь заказов у кассы, только умная: сама показывает, что выдавать сейчас.', who: 'кассиры-бариста: по 2 в смене, новые каждый месяц, обучение — 1 день', data: 'заказы интервала, статусы, оплата на месте', f: ['F-obs-hands', 'F-staff', 'F-elder', 'F-net'], art: 'Спецификация экрана', does: 'Крупные кнопки без набора текста, что видно в пик, как работать без связи, что делать с невыкупленными заказами.', go: { view: 'screens', dev: 'cash', t: 'Открыть планшет кассира' } },
    shop: { plain: 'Планшет в цехе: план выпечки на завтра (база по статистике + предзаказы) и торты с фото-образцом и надписью.', an: 'Доска с заказами в цеху.', who: 'технолог Галина Ивановна, кондитеры', data: 'план выпечки, торты, загрузка цеха', f: ['F-plan', 'F-weather', 'F-cakephoto', 'F-cakecap'], art: 'Спецификация экрана', does: 'Как читается план, когда он утверждается, что можно поправить руками (погода), как кондитер видит торт и отмечает «Готов».', go: { view: 'screens', dev: 'shop', t: 'Открыть планшет цеха' } },
    api: { plain: 'Не отдельная программа, а договорённость: какие запросы бэкенд принимает и что отвечает. Все экраны говорят с сервером только через эту «дверь».', an: 'Окошко выдачи с правилами: что можно попросить и в каком виде.', who: 'программы, не люди: приложение, сайт, планшеты', data: 'запросы и ответы: «создать заказ», «заказы интервала», «отменить»', art: 'Описание API', does: 'Методы на пальцах: что передаём, что получаем, какие ошибки (например, «приём на завтра закрыт в 22:30»). Подробно API разбирают в тренажёре «Пульс».' },
    orders: { plain: 'Сердце системы: принимает заказы, проверяет правила, выдаёт короткий код и ведёт статусы — от «Создан» до «Выдан».', an: 'Старший смены: принимает заказы и следит, чтобы ни один не потерялся.', who: 'все экраны — через API', data: 'Предзаказ, Позиция предзаказа', f: ['F-cutoff', 'F-slot', 'F-batch', 'F-cancel', 'F-hold'], art: 'Бизнес-правила и статусная модель', does: 'Правила (22:30, интервал 30 минут, круассаны с 07:30, отмена за 2 часа, держим 30 минут) и статусы: кто, когда и при каком условии переводит заказ.', go: { view: 'status', t: 'Открыть статусы заказа' } },
    catalog: { plain: 'Товары, цены и остатки на витрине. Отвечает на вопросы «что можно заказать» и «сколько осталось».', an: 'Прейскурант и полки витрины.', who: 'приложение, сайт, кассир; ссылки из ВКонтакте', data: 'Товар, Остаток', f: ['F-stock', 'F-obs-second', 'F-batch'], art: 'Правила и модель данных', does: 'Откуда берутся остатки (сейчас их никто не ведёт), как часто обновляются, что показывать в 10:30, когда витрина пустая до второго развоза.' },
    pay: { plain: 'Всё про деньги: платежи через «ПэйМост», чеки через «КассаПро», возвраты и ночная сводка в 1С.', an: 'Бухгалтерия при кассе.', who: 'сам бэкенд; Олег Петрович — через 1С', data: 'Оплата, Чек', f: ['F-pay', 'F-54fz', 'F-refund', 'F-1c'], art: 'Правила и контракты интеграций', does: 'Когда и какой чек пробивать, что делать, если шлюз или касса не ответили, как вернуть деньги, что попадает в сводку.' },
    plan: { plain: 'В 23:00 складывает все предзаказы на завтра и добавляет их к плану по статистике. Технолог видит готовые цифры, а не пересчитывает Excel.', an: 'Технолог с калькулятором, который никогда не засыпает.', who: 'технолог, цех', data: 'План выпечки, Торт', f: ['F-plan', 'F-cutoff', 'F-weather', 'F-cakecap'], art: 'Правила расчёта', does: 'Формулу плана, время утверждения, ручные правки, ограничение «25 тортов в день».' },
    notify: { plain: 'Сообщает людям о событиях: «заказ собран», «торт готов». Сам SMS не отправляет — просит SMS-шлюз.', an: 'Колокольчик над прилавком.', who: 'покупатели', data: 'шаблоны сообщений, телефон покупателя', f: ['F-pd'], art: 'Правила уведомлений', does: 'Какие события, какой текст, когда не отправлять (заказ уже выдан), что если SMS не дошло. В первой версии это «Should» — можно чуть позже.' },
    db: { plain: 'Хранит всё, что надо помнить: заказы, товары, остатки, покупателей, оплаты и чеки. Экраны в базу не ходят — только бэкенд.', an: 'Склад и журнал: что лежит и что записано.', who: 'только бэкенд', data: '10 таблиц — смотрите вкладку «Данные»', f: ['F-pd'], art: 'Модель данных', does: 'Сущности и связи, обязательные поля, что и сколько хранить. Персональные данные — по 152-ФЗ: в России, с согласием, удаление по запросу.', go: { view: 'data', t: 'Открыть таблицы базы' } },
    vk: { plain: 'Группа «Колоса» — 18 тысяч подписчиков. В посте ссылка, которая открывает сайт или приложение сразу на нужном товаре.', an: 'Рекламный щит с QR-кодом: ведёт прямо к прилавку.', who: 'маркетолог Рита и подписчики', f: ['F-vk'], ext: { send: 'ссылку вида kolos.ru/p/kruassan?from=vk', get: 'карточку товара по ссылке; бэкенд запоминает, что заказ пришёл из ВКонтакте', fail: 'товара больше нет — показать каталог, а не ошибку' }, json: { link: 'https://kolos.ru/p/kruassan?from=vk', opens: 'карточка товара', source: 'vk' } },
    paymost: { plain: 'Чужой платёжный шлюз: принимает карту или СБП и сообщает результат. Деньги и данные карт — у него, не у «Колоса».', an: 'Банк-инкассатор: деньги идут через него, а пекарня получает квитанцию.', who: 'покупатели (страница оплаты) и модуль «Оплаты»', f: ['F-pay', 'F-refund'], ext: { send: 'создать платёж: сумма, код заказа, куда вернуть покупателя; вернуть деньги', get: 'ссылку на страницу оплаты, затем уведомление «оплачено» или «отклонено»', fail: 'нет ответа — заказ остаётся «Создан», покупатель видит понятный текст; уведомление может прийти дважды — второй раз ничего не делать' }, json: { amount: 420, currency: 'RUB', order: 'К-247', return_url: 'kolos://order/К-247' } },
    kassapro: { plain: 'Облачные кассы «Колоса». Пробивают чеки по 54-ФЗ: «предоплата» при оплате онлайн и «полный расчёт» при выдаче.', an: 'Кассовый аппарат, который стоит не у прилавка, а «в облаке».', who: 'модуль «Оплаты», кассы пекарен', f: ['F-54fz', 'F-obs-modem'], ext: { send: 'чек: тип, позиции, сумма, способ оплаты', get: 'номер фискального документа', fail: 'нет ответа — чек в очередь «дослать» без потери. Подключение — только по публичному API вендора и после его проверки: 3 недели' }, json: { type: 'prepayment', order: 'К-247', sum: 420, items: [{ name: 'Круассан', qty: 2, price: 120 }] } },
    onec: { plain: '1С:Бухгалтерия Олега Петровича. Каждую ночь получает одну сводку продаж за день — вместо двух часов ручной сверки утром.', an: 'Ежедневная накладная для бухгалтерии.', who: 'главный бухгалтер Олег Петрович', f: ['F-1c'], ext: { send: 'сводку за день: продажи по пекарням, товарам и способам оплаты', get: '«принято» или список ошибок', fail: 'не приняла — повторить до 09:00 и предупредить Олега Петровича' }, json: { date: '2026-10-06', bakeries: 9, lines: 'продажи по товарам и способам оплаты' } },
    sms: { plain: 'Сервис, который рассылает SMS. Бэкенд даёт ему номер и текст — дальше это работа шлюза и оператора связи.', an: 'Почтальон: что дали — то и отнёс.', who: 'модуль «Уведомления»', f: ['F-pd'], ext: { send: 'номер и текст «Заказ К-247 собран»', get: '«принято к отправке», позже — «доставлено» или «не доставлено»', fail: 'не доставлено — заказ всё равно ждёт покупателя: SMS — подсказка, а не условие выдачи' }, json: { to: '+7 9•• •••-••-47', text: 'Колос: заказ К-247 собран. Ждём вас до 08:30.' } }
  };
  const KNAME = { scr: 'Экран (фронтенд)', mod: 'Модуль бэкенда', db: 'База данных', ext: 'Внешняя система', api: 'Программный интерфейс' };
  function cardHTML(id) {
    if (!id) return `<div class="ksys-card-empty"><b>Нажмите на любой блок схемы.</b> Откроется карточка: что это простыми словами, на что похоже в пекарне, кто этим пользуется и что про это пишет аналитик.
      <div class="ksys-legend wide"><span style="--k:var(--info)"><i></i>экраны — их видят люди</span><span style="--k:var(--accent)"><i></i>модули бэкенда — правила и расчёты</span><span style="--k:var(--cyan)"><i></i>база данных — память</span><span style="--k:var(--violet)"><i></i>внешние системы — чужие, со своими правилами</span><span style="--k:var(--warn)"><i></i>API — дверь, через которую ходят экраны</span></div>
      <p class="small muted">Заметьте: ни один экран не связан с базой напрямую, и ни один экран не ходит во внешние системы сам. Кроме одного места — страницы оплаты «ПэйМост». Почему — в живом сценарии.</p></div>`;
    const n = N[id], x = INFO[id];
    const ext = x.ext ? `<div class="ksys-ctr"><div class="ksys-ctr-r"><span>Мы отправляем</span><b>${esc(x.ext.send)}</b></div><div class="ksys-ctr-r"><span>Нам отвечают</span><b>${esc(x.ext.get)}</b></div><div class="ksys-ctr-r bad"><span>Если молчит</span><b>${esc(x.ext.fail)}</b></div></div>` : '';
    return `<div class="ksys-card-h"><span class="ksys-card-ico" aria-hidden="true">${n.ico || '🚪'}</span><div><div class="eyebrow">${KNAME[n.k]}</div><h3>${esc(n.t === 'API' ? 'API — окошко выдачи' : n.t)}</h3></div><button type="button" class="btn ghost xs" data-a="m-x" aria-label="Закрыть карточку">✕</button></div>
      <div class="ksys-card-g">
        <div class="stack tight"><p><b>Простыми словами.</b> ${esc(x.plain)}</p><p class="muted"><b>В пекарне это</b> ${esc(x.an.charAt(0).toLowerCase() + x.an.slice(1))}</p>
          <p class="small"><b>Кто пользуется:</b> ${esc(x.who)}</p>${x.data ? `<p class="small"><b>Какие данные:</b> ${esc(x.data)}</p>` : ''}
          ${x.f ? `<div class="ksys-fl"><span class="small dim">Факты из блокнота:</span>${facts(x.f, true)}</div>` : ''}</div>
        <div class="ksys-does"><div class="eyebrow">Что описывает аналитик → ${esc(x.ext ? 'Контракт интеграции' : x.art)}</div>
          ${x.ext ? `${ext}<div class="small muted">В контракте фиксируют: ${CONTRACT.join(' · ')}.</div>${x.json ? `<div class="code-cap">Пример сообщения (упрощённо)</div>${json(x.json)}` : ''}` : `<p class="small">${esc(x.does)}</p>`}
          ${x.go ? `<button type="button" class="btn sm" data-a="m-go" data-v="${id}">${esc(x.go.t)} →</button>` : ''}</div>
      </div>`;
  }
  function renderMap(box, inst) {
    box.innerHTML = `<div class="ksys-map-top"><p class="small muted">Слева — то, что видят люди. В середине — сервер «за стеной»: он один на все экраны. Справа — чужие системы, с которыми «Колос» договаривается. Внизу — память.</p>
        <button type="button" class="btn sm primary" data-a="m-live">▶ Посмотреть, как бежит заказ</button></div>
      <div class="board ksys-board">${mapSVG()}</div>
      <div class="ksys-card" data-card aria-live="polite"></div>`;
    const svg = TR.$('svg', box), card = TR.$('[data-card]', box);
    const pick = id => {
      MEM.map.sel = id;
      TR.$$('.ksys-node', svg).forEach(g => g.classList.toggle('sel', g.dataset.node === id));
      card.innerHTML = cardHTML(id);
    };
    box.addEventListener('click', e => {
      const g = e.target.closest('[data-node]');
      if (g) { pick(g.dataset.node); if (window.innerWidth < 900) try { card.scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' }); } catch (er) { } return; }
      const b = e.target.closest('[data-a]'); if (!b) return;
      if (b.dataset.a === 'm-x') pick(null);
      if (b.dataset.a === 'm-live') inst.show('live');
      if (b.dataset.a === 'm-go') { const go = INFO[b.dataset.v].go; if (go.dev) { MEM.dev = go.dev; MEM.sstate = 'normal'; } inst.show(go.view); }
    });
    svg.addEventListener('keydown', e => { const g = e.target.closest('[data-node]'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); pick(g.dataset.node); } });
    pick(MEM.map.sel);
  }

  // =====================================================================
  // 3. Живой сценарий: шаги заказа по схеме + «Что если»
  // =====================================================================
  const VARIANTS = [
    { id: 'normal', ico: '✅', t: 'Обычный путь', d: 'Весь путь заказа: от нажатия «Заказать» вечером до ночной сводки в 1С.' },
    { id: 'fail', ico: '💳', t: 'Оплата не прошла', d: 'Банк отклонил карту. Что видит покупатель, что происходит с заказом и с чеками?' },
    { id: 'late', ico: '🌙', t: 'Заказ в 22:40 на завтра', d: 'Покупатель опоздал к 22:30. Правило на сервере не даёт сломать план выпечки — и не отпускает покупателя ни с чем.' },
    { id: 'noshow', ico: '🚶', t: 'Клиент не пришёл', d: 'Заказ с оплатой на месте, а покупатель так и не появился. Кто и когда снимает заказ — и куда девается выпечка?' },
    { id: 'cancel3', ico: '↩', t: 'Отмена за 3 часа', d: 'Покупатель отменяет заранее — по правилу деньги возвращаются.' },
    { id: 'cancel1', ico: '⏱', t: 'Отмена за 1 час', d: 'Покупатель отменяет поздно — по правилу без возврата. Что должен увидеть человек до нажатия?' },
    { id: 'offline', ico: '📵', t: 'У кассы пропал интернет', d: 'Модем на точке отвалился в пик. Выдача не останавливается — как?' },
    { id: 'bypass', ico: '🐞', t: 'Правило 22:30 — только в приложении', d: 'Представьте, что правило проверяет телефон, а сервер — нет. И у части покупателей старая версия приложения.' }
  ];
  const WHO = { person: '👤 Человек', system: '⚙ Система', timer: '⏰ Таймер', event: '⚡ Событие' };
  const DIRT = { req: 'запрос', res: 'ответ', evt: 'уведомление', self: 'внутри' };
  function world0() {
    return { clock: '', status: null, trail: [], pre: null, items: [], payment: null, checks: [], plan: { fixed: false, mine: false, reserve: false, miss: false }, stock: 0, cashier: { shown: false, offline: false, queue: 0, local: null, hint: '' }, phone: 'cart', onec: false };
  }
  const setSt = (w, s) => { w.status = s; if (w.pre) w.pre.status = s; if (w.trail[w.trail.length - 1] !== s) w.trail.push(s); };
  const qtyAll = o => o.items.reduce((s, x) => s + x.q, 0);
  const mainItem = o => o.items.find(x => x.id === 11) || o.items[0];
  const atBak = b => b.name === 'Покровка' ? 'на Покровке' : `в пекарне «${b.name}»`;

  function preFx(o, extra) { return w => { w.pre = Object.assign({ code: CODE, sum: sumOf(o.items), pay: o.pay, slot: o.slot, bak: o.bak }, extra || {}); w.items = o.items.slice(); setSt(w, 'Создан'); }; }
  function segOrder(o, at) {
    const sum = sumOf(o.items), cro = o.items.some(x => x.id === 11), t = at.slice(3);
    return [
      { at, from: 'app', to: 'orders', dir: 'req', who: 'person', by: 'покупатель', ttl: 'Покупатель нажал «Заказать»', lbl: 'создать заказ',
        txt: 'Приложение собирает всё, что вы выбрали, в короткое сообщение и отправляет на сервер через интернет — через API. Дальше покупатель видит только крутящийся значок.',
        json: { bakery_id: o.bak, date: '2026-10-06', slot: ivl(o.slot), items: o.items.map(x => ({ product_id: x.id, qty: x.q })), pay: o.pay },
        fx: w => { w.phone = 'sending'; } },
      { at, from: 'orders', dir: 'self', who: 'system', ttl: 'Модуль «Заказы» проверяет правила',
        txt: 'Прежде чем что-то записать, сервер сверяет заказ с правилами «Колоса». Правила живут здесь — одни и те же для приложения, сайта и планшета кассира.',
        rules: [[true, `${t} — раньше 22:30: приём на завтра открыт`, 'F-cutoff'], [true, `Интервал ${ivl(o.slot)} — в часах работы 07:00–21:00`, 'F-slot'], cro ? [true, `Круассаны — не раньше 07:30: интервал ${ivl(o.slot)} подходит`, 'F-batch'] : ['info', 'Круассанов в заказе нет — правило 07:30 не нужно', 'F-batch']] },
      { at, from: 'orders', to: 'catalog', dir: 'req', who: 'system', ttl: '«Есть ли такие товары и почём?»', lbl: 'проверить товары',
        txt: 'Заказы спрашивают соседний модуль «Каталог и остатки»: есть ли эти товары в ассортименте вторника и не поменялись ли цены.' },
      { at, from: 'catalog', to: 'orders', dir: 'res', who: 'system', kind: 'ok', ttl: `Всё есть, сумма ${rub(sum)}`, lbl: `ок, ${rub(sum)}`,
        txt: 'Каталог заглянул в базу (таблица «Товар») и ответил. Сумму считает сервер, а не телефон: цены могли поменяться, пока корзина лежала.',
        json: { available: true, total: sum } },
      { at, from: 'orders', to: 'db', dir: 'req', who: 'system', ttl: 'Заказ записан в базу: «Создан»', lbl: 'записать заказ',
        txt: `Теперь заказ не потеряется, даже если дальше что-то сломается. Ему выдан короткий код ${CODE} — по нему кассир найдёт пакет, имя не нужно.`,
        rules: [['info', 'Короткий код вместо имени на пакете', 'F-obs-names']],
        json: { table: 'Предзаказ', code: CODE, bakery_id: o.bak, slot: ivl(o.slot), status: 'Создан', sum },
        fx: preFx(o) }
    ];
  }
  function segPayOnline(o, at, fail) {
    const sum = sumOf(o.items), sbp = o.pay === 'sbp';
    const a = [
      { at, from: 'pay', to: 'paymost', dir: 'req', who: 'system', ttl: '«Оплаты» просят «ПэйМост» создать платёж', lbl: `платёж ${rub(sum)}`,
        txt: 'Модуль «Заказы» передал заказ модулю «Оплаты». Тот обращается к чужой системе — платёжному шлюзу «ПэйМост» — по его API. Это и есть интеграция.',
        json: { amount: sum, currency: 'RUB', order: CODE, method: sbp ? 'sbp' : 'card', return_url: 'kolos://order/' + CODE },
        fx: w => { w.payment = { ext: 'pm_81f3', sum, status: 'ожидает', method: o.pay }; } },
      { at, from: 'paymost', to: 'pay', dir: 'res', who: 'system', ttl: '«ПэйМост» вернул ссылку на страницу оплаты', lbl: 'ссылка на оплату',
        txt: 'Шлюз создал платёж и прислал ссылку. Сервер передаёт её приложению, и приложение открывает страницу «ПэйМост».',
        json: { payment_id: 'pm_81f3', pay_url: 'https://pay.paymost.ru/pm_81f3' }, fx: w => { w.phone = 'paypage'; } },
      { at, from: 'app', to: 'paymost', dir: 'req', who: 'person', by: 'покупатель', ttl: sbp ? 'Покупатель подтверждает платёж в своём банке' : 'Покупатель вводит карту на странице «ПэйМост»', lbl: sbp ? 'СБП' : 'данные карты', lp: 0.3,
        txt: 'Единственное место, где экран говорит с внешней системой напрямую. Номер карты уходит в шлюз мимо сервера «Колоса»: нет карт на сервере — нечего украсть.', fx: w => { w.phone = 'paying'; } }
    ];
    if (fail) return a;
    return a.concat([
      { at, from: 'paymost', to: 'pay', dir: 'evt', who: 'system', kind: 'ok', ttl: 'Уведомление: «платёж прошёл»', lbl: 'оплачено',
        txt: '«ПэйМост» сам сообщает серверу результат — отдельным сообщением, когда событие случилось. Сервер верит только ему, а не телефону: сказать «я оплатил» может кто угодно.',
        json: { event: 'payment.succeeded', payment_id: 'pm_81f3', order: CODE, amount: sum } },
      { at, from: 'pay', to: 'db', dir: 'req', who: 'system', ttl: 'Статус «Оплачен»', lbl: 'записать: оплачен',
        txt: 'Только после уведомления от шлюза заказ становится «Оплачен». Оплата хранится отдельной записью — со своим статусом и номером платежа в «ПэйМост».',
        fx: w => { w.payment.status = 'успешно'; setSt(w, 'Оплачен'); } },
      { at, from: 'pay', to: 'kassapro', dir: 'req', who: 'system', ttl: 'Чек «предоплата» — в «КассаПро»', lbl: 'чек «предоплата»',
        txt: 'Деньги получены раньше, чем выпечка отдана. По 54-ФЗ на это пробивается чек «предоплата». Его пробивает облачная касса «КассаПро» по своему API.',
        rules: [[true, 'Оплата заранее → чек «предоплата»', 'F-54fz']],
        json: { type: 'prepayment', order: CODE, sum, items: o.items.map(x => ({ name: byP(x.id).sh, qty: x.q, price: byP(x.id).price })) } },
      { at, from: 'kassapro', to: 'pay', dir: 'res', who: 'system', kind: 'ok', ttl: 'Чек пробит', lbl: 'ФД 10482',
        txt: 'Касса вернула номер фискального документа (ФД). Его храним вместе с чеком — пригодится бухгалтерии и при возврате.',
        fx: w => { w.checks.push({ type: 'предоплата', sum, status: 'пробит', fd: '10482' }); } },
      { at, from: 'orders', to: 'app', dir: 'res', who: 'system', kind: 'ok', ttl: 'Покупатель видит «Заказ принят»', lbl: `${CODE} · оплачен`,
        txt: 'Приложение спрашивает у сервера статус и показывает код. Из всех шагов до этой минуты покупатель видел два: нажатие и этот экран.',
        fx: w => { w.phone = 'ok'; } }
    ]);
  }
  function segPayCash(o, at) {
    const s0 = hm(o.slot);
    return [
      { at, from: 'orders', to: 'db', dir: 'req', who: 'system', ttl: 'Оплата на месте: «Ждёт оплаты на месте»', lbl: 'записать статус',
        txt: 'Покупатель выбрал оплату при получении. «ПэйМост» не нужен, и чек пока не пробиваем: денег не получали — чек будет один, при выдаче.',
        rules: [[true, 'Оплата на месте разрешена', 'F-pay'], ['info', `Держим 30 минут после интервала — до ${fm(s0 + 60)}`, 'F-hold']],
        fx: w => { w.payment = { ext: '—', sum: sumOf(o.items), status: 'на месте', method: 'cash' }; setSt(w, 'Ждёт оплаты на месте'); } },
      { at, from: 'orders', to: 'app', dir: 'res', who: 'system', kind: 'ok', ttl: 'Покупатель видит «Заказ принят»', lbl: `${CODE} · на месте`,
        txt: `Экран показывает код и предупреждает: заказ держат до ${fm(s0 + 60)}.`, fx: w => { w.phone = 'okcash'; } }
    ];
  }
  function segPlan(o) {
    const mi = mainItem(o), P = byP(mi.id), pre = P.pre + mi.q;
    return [
      { at: 'пн 23:00', from: 'plan', to: 'db', dir: 'req', who: 'timer', ttl: 'Таймер 23:00: собрать предзаказы на завтра', lbl: 'предзаказы на вт?',
        txt: 'Ровно в 23:00 модуль «План выпечки» сам, без человека, складывает предзаказы на вторник по всем 9 пекарням. Поэтому приём закрыт в 22:30: полчаса — запас.',
        rules: [[true, '23:00 — время утверждать план', 'F-plan']] },
      { at: 'пн 23:00', from: 'db', to: 'plan', dir: 'res', who: 'system', kind: 'ok', ttl: `${P.sh}: по предзаказам — ${pre} шт.`, lbl: `${P.sh.toLowerCase()}: ${pre}`,
        txt: `База сложила позиции всех заказов на вторник. Ваши ${mi.q} шт. — среди них.`, json: { date: '2026-10-06', product: P.sh, preorders: pre } },
      { at: 'пн 23:00', from: 'plan', to: 'db', dir: 'req', who: 'system', ttl: 'План записан, заказы — «Принят пекарней»', lbl: 'план + статусы',
        txt: 'План на вторник сохранён, а все учтённые заказы получили статус «Принят пекарней»: теперь их точно испекут.',
        fx: w => { w.plan.fixed = true; w.plan.mine = true; setSt(w, 'Принят пекарней'); } },
      { at: 'пн 23:00', from: 'plan', to: 'shop', dir: 'res', who: 'system', ttl: 'План — на планшете цеха', lbl: 'план на вт',
        txt: `Галина Ивановна видит: ${P.sh.toLowerCase()} — ${P.base} по статистике + ${pre} по предзаказам = ${P.base + pre}. Переписывать руками ничего не нужно.`,
        rules: [[true, 'Предзаказы — в план автоматически', 'F-plan']] }
    ];
  }
  const segPlanQuick = o => [{ at: 'пн 23:00', from: 'plan', to: 'shop', dir: 'res', who: 'timer', ttl: 'В 23:00 заказ попал в план и стал «Принят пекарней»', lbl: 'план на вт',
    txt: 'Таймер сложил предзаказы и утвердил план — как в обычном пути (здесь свёрнуто в один шаг).', rules: [[true, 'Предзаказы — в план автоматически', 'F-plan']],
    fx: w => { w.plan.fixed = true; w.plan.mine = true; setSt(w, 'Принят пекарней'); } }];
  const segBake = () => [{ at: 'вт 03:00', from: 'shop', dir: 'self', who: 'person', by: 'цех', ttl: 'Цех печёт по плану',
    txt: 'Цех встаёт в 03:00. В 06:30 две машины везут выпечку по пекарням. Первая партия на точке — около 07:20, поэтому раньше 07:30 круассаны не обещают.',
    rules: [['info', 'Цех с 03:00, развоз в 06:30', 'F-shift'], ['info', 'Первая партия около 07:20', 'F-batch']] }];
  function segQuick(o, at) {
    const sum = sumOf(o.items);
    return [{ at, from: 'app', to: 'orders', dir: 'req', who: 'person', by: 'покупатель', ttl: 'Заказ оформлен и оплачен онлайн', lbl: 'заказ + оплата',
      txt: 'Все шаги — как в обычном пути: правила, запись «Создан», «ПэйМост», «Оплачен», чек «предоплата». Здесь они свёрнуты в один, чтобы быстрее дойти до главного.',
      fx: w => { preFx(o)(w); w.payment = { ext: 'pm_81f3', sum, status: 'успешно', method: o.pay }; setSt(w, 'Оплачен'); w.checks.push({ type: 'предоплата', sum, status: 'пробит', fd: '10482' }); w.phone = 'ok'; } }];
  }
  function segMorning(o) {
    const s0 = hm(o.slot), sum = sumOf(o.items), cash = o.pay === 'cash', b = bakN(o.bak);
    return [
      { at: 'вт ' + fm(s0 - 5), from: 'orders', to: 'cash', dir: 'res', who: 'system', ttl: 'Заказ появился у кассира', lbl: `заказы ${ivl(o.slot)}`,
        txt: `За несколько минут до интервала планшет кассира ${atBak(b)} показывает заказы ${ivl(o.slot)}. Код — крупно, кнопки — крупные: у кассы руки в перчатках.`,
        rules: [['info', 'Крупные кнопки, без набора текста', 'F-obs-hands']], fx: w => { w.cashier.shown = true; } },
      { at: 'вт ' + fm(s0 + 2), from: 'cash', to: 'orders', dir: 'req', who: 'person', by: 'кассир', ttl: 'Кассир нажал «Собрать»', lbl: '«Собрать»',
        txt: 'Кассир сложил пакет и нажал одну кнопку. Сервер записывает новый статус.', json: { code: CODE, action: 'collect' }, fx: w => setSt(w, 'Собран') },
      { at: 'вт ' + fm(s0 + 2), from: 'notify', to: 'sms', dir: 'req', who: 'system', ttl: '«Уведомления» просят SMS-шлюз написать покупателю', lbl: 'SMS «собран»',
        txt: 'Модуль «Заказы» сообщил модулю «Уведомления»: заказ собран. Тот отправляет SMS через чужой SMS-шлюз — сам SMS он отправлять не умеет.',
        json: { to: '+7 9•• •••-••-47', text: `Колос: заказ ${CODE} собран. Ждём вас до ${fm(s0 + 30)}.` } },
      { at: 'вт ' + fm(s0 + 3), from: 'sms', to: 'app', dir: 'res', who: 'system', ttl: 'SMS пришло на телефон', lbl: 'SMS', lp: 0.55,
        txt: 'Шлюз передал сообщение оператору связи, оператор — на телефон покупателя. Это уже не наш сервер и не наша зона ответственности — но описать, что делать, если SMS не дошло, должны мы.', fx: w => { w.phone = 'sms'; } },
      { at: 'вт ' + fm(s0 + 14), from: 'cash', to: 'orders', dir: 'req', who: 'person', by: 'кассир', ttl: cash ? `Покупатель заплатил ${rub(sum)}, кассир нажал «Выдать»` : 'Покупатель назвал код — кассир нажал «Выдать»', lbl: '«Выдать»',
        txt: `«${CODE}» — пакет — «Выдать». Без имён и поиска по фамилии. В пик 07:30–09:00 это несколько секунд, очередь не стоит.`,
        rules: [['info', 'Выдача не задерживает очередь', 'F-peak']], json: { code: CODE, action: 'issue', paid_now: cash ? sum : 0 },
        fx: w => { setSt(w, 'Выдан'); w.phone = 'done'; if (cash && w.payment) w.payment.status = 'оплачено на кассе'; } },
      { at: 'вт ' + fm(s0 + 14), from: 'pay', to: 'kassapro', dir: 'req', who: 'system', ttl: cash ? 'Один чек — полный расчёт' : 'Чек полного расчёта', lbl: 'чек «полный расчёт»',
        txt: cash ? 'Денег заранее не было, поэтому чек один — полного расчёта, в момент выдачи.' : 'Выпечка отдана — по 54-ФЗ пробивается второй чек: полный расчёт. В нём засчитывается уже внесённая предоплата.',
        rules: [[true, cash ? 'Оплата при выдаче → один чек полного расчёта' : 'Выдача после предоплаты → чек полного расчёта', 'F-54fz']],
        json: { type: 'full_payment', order: CODE, sum, prepaid: cash ? 0 : sum } },
      { at: 'вт ' + fm(s0 + 14), from: 'kassapro', to: 'pay', dir: 'res', who: 'system', kind: 'ok', ttl: 'Чек пробит', lbl: 'ФД 10533',
        fx: w => { w.checks.push({ type: 'полный расчёт', sum, status: 'пробит', fd: '10533' }); } }
    ];
  }
  const seg1C = () => [
    { at: 'ср 02:45', from: 'pay', to: 'onec', dir: 'req', who: 'timer', ttl: 'Ночью: сводка продаж за вторник — в 1С', lbl: 'сводка за вт',
      txt: 'После ночного окна обслуживания (01:00–02:30) сервер собирает одну сводку по всем 9 пекарням: сколько чего продано и как оплачено.',
      rules: [[true, 'Одна сводка за день — к 09:00', 'F-1c']], json: { date: '2026-10-06', bakeries: 9, lines: 'продажи по товарам и способам оплаты' } },
    { at: 'ср 02:45', from: 'onec', to: 'pay', dir: 'res', who: 'system', kind: 'ok', ttl: '1С приняла сводку', lbl: 'принято',
      txt: 'В 09:00 Олег Петрович открывает 1С — продажи уже там. Было 2 часа ручной сверки каждое утро, цель — 15 минут.', fx: w => { w.onec = true; } }
  ];

  function buildSteps(v, o0) {
    const o = TR.clone(o0); o.day = 'tomorrow';
    const notes = [];
    if (!o.own) notes.push('Это пример заказа. Соберите свой на вкладке «Экраны» — сценарий подхватит его.');
    else if (o0.day === 'today') notes.push('Ваш заказ был на сегодня — сценарий показывает его как заказ на завтра: так виден шаг «план выпечки».');
    if (v === 'noshow' && o.pay !== 'cash') { o.pay = 'cash'; notes.push('В этом варианте оплата — на месте: правило «держим 30 минут» касается неоплаченных заказов.'); }
    if (['fail', 'cancel3', 'cancel1', 'offline', 'bypass', 'late'].includes(v) && o.pay === 'cash') { o.pay = 'card'; notes.push('В этом варианте оплата — картой онлайн.'); }
    if (v === 'late') {
      let it = o.items.map(x => ({ id: x.id, q: Math.min(x.q, byP(x.id).free) })).filter(x => x.q > 0);
      if (!it.length) it = [{ id: 11, q: 2 }];
      if (JSON.stringify(it) !== JSON.stringify(o.items)) notes.push('После 22:30 часть товаров берётся только из запланированного — состав заказа поменяется на шаге 6.');
      o.late = it;
    }
    const s0 = hm(o.slot), sum = sumOf(o.items), n = qtyAll(o), b = bakN(o.bak);
    let steps = [], end = null;
    if (v === 'normal') {
      steps = [...segOrder(o, 'пн 21:40'), ...(o.pay === 'cash' ? segPayCash(o, 'пн 21:40') : segPayOnline(o, 'пн 21:40')), ...segPlan(o), ...segBake(), ...segMorning(o), ...seg1C()];
      end = { kind: 'ok', html: `Заказ прошёл весь путь — ${steps.length} шагов через экраны, модули бэкенда, базу и четыре внешние системы. Покупатель видел три момента: «Заказать», «Заказ принят» и SMS. Всё остальное — «за стеной», и всё это описывает аналитик: <b>правила</b> (22:30, 07:30, 30 минут), <b>статусы</b>, <b>контракты</b> с «ПэйМост», «КассаПро», 1С и SMS-шлюзом, <b>экраны</b> кассира и цеха.` };
    } else if (v === 'fail') {
      steps = [...segOrder(o, 'пн 21:40'), ...segPayOnline(o, 'пн 21:40', true),
        { at: 'пн 21:41', from: 'paymost', to: 'pay', dir: 'evt', who: 'system', kind: 'bad', ttl: 'Уведомление: «платёж отклонён»', lbl: 'отклонено',
          txt: 'Банк покупателя отказал — например, не хватило денег. «ПэйМост» сообщает об этом так же, отдельным уведомлением.', json: { event: 'payment.failed', payment_id: 'pm_81f3', order: CODE, reason: 'insufficient_funds' } },
        { at: 'пн 21:41', from: 'pay', to: 'db', dir: 'req', who: 'system', kind: 'warn', ttl: 'Оплата — «отклонена», заказ остаётся «Создан»', lbl: 'записать: отклонено',
          txt: 'Деньги не списаны — значит, и чек «предоплата» не пробиваем: пробивать нечего. Заказ не удаляем: покупатель может заплатить иначе.', fx: w => { w.payment.status = 'отклонена'; } },
        { at: 'пн 21:41', from: 'orders', to: 'app', dir: 'res', who: 'system', kind: 'bad', ttl: 'Покупатель видит: «Оплата не прошла»', lbl: 'оплата не прошла',
          txt: 'Хороший экран ошибки отвечает на три вопроса: что случилось, что с деньгами, что делать дальше. Этот текст не придумывает программист «на ходу» — его описывают аналитик и дизайнер.', fx: w => { w.phone = 'fail'; } },
        { at: 'пн 21:42', from: 'app', to: 'orders', dir: 'req', who: 'person', by: 'покупатель', ttl: 'Покупатель выбрал «Оплачу на месте»', lbl: 'оплата на месте', json: { code: CODE, pay: 'cash' } },
        { at: 'пн 21:42', from: 'orders', to: 'db', dir: 'req', who: 'system', ttl: 'Статус «Ждёт оплаты на месте»', lbl: 'записать статус',
          rules: [[true, 'Оплата на месте разрешена', 'F-pay'], ['info', `Держим до ${fm(s0 + 60)} — 30 минут после интервала`, 'F-hold']],
          fx: w => { w.pre.pay = 'cash'; w.payment = { ext: '—', sum, status: 'на месте', method: 'cash' }; setSt(w, 'Ждёт оплаты на месте'); } },
        { at: 'пн 21:42', from: 'orders', to: 'app', dir: 'res', who: 'system', kind: 'ok', ttl: 'Заказ принят — с оплатой на месте', lbl: `${CODE} · на месте`, fx: w => { w.phone = 'okcash'; } },
        ...segPlanQuick(o)];
      end = { kind: 'warn', html: 'Оплата сорвалась, но заказ не потерялся: покупатель сменил способ оплаты. Чек «предоплата» не пробит — денег не было; утром на кассе будет один чек полного расчёта. <b>Что описывает аналитик:</b> текст ошибки, можно ли повторить и сменить способ оплаты. <b>Открытый вопрос к Нине Сергеевне:</b> сколько держать заказ «Создан», если покупатель не заплатил и не выбрал «на месте»? В правилах этого пока нет.' };
    } else if (v === 'late') {
      const oL = Object.assign({}, o, { items: o.late }), sumL = sumOf(oL.items);
      const freeJ = {}; PROD.forEach(p => { freeJ[p.sh] = p.free; });
      steps = [
        Object.assign({}, segOrder(o, 'пн 22:40')[0]),
        { at: 'пн 22:40', from: 'orders', dir: 'self', who: 'system', kind: 'bad', ttl: 'Проверка правил: 22:40 — позже 22:30',
          txt: 'Добавить заказ в план уже нельзя: в 23:00 его утверждают. Но и просто отказать — потерять покупателя. Критерий приёмки из сценария говорит: предложить то, что уже запланировано в выпечку.',
          rules: [[false, '22:40 — приём заказов на завтра закрыт в 22:30', 'F-cutoff']] },
        { at: 'пн 22:40', from: 'orders', to: 'catalog', dir: 'req', who: 'system', ttl: 'Что свободно в уже утверждённом плане?', lbl: 'свободно в плане?' },
        { at: 'пн 22:40', from: 'catalog', to: 'orders', dir: 'res', who: 'system', kind: 'ok', ttl: 'Свободно: круассанов 3, багетов 5, бородинского 0', lbl: 'свободно: 3, 5, 0…', json: freeJ },
        { at: 'пн 22:40', from: 'orders', to: 'app', dir: 'res', who: 'system', kind: 'warn', ttl: 'Покупатель видит предупреждение', lbl: 'приём закрыт',
          txt: '«Приём на завтра закрыт в 22:30. Можно забрать из уже запланированного». Это не сбой, а ожидаемый отказ: у него свой код и свой текст в описании API.',
          json: { error: 'cutoff_passed', message: 'Приём заказов на завтра закрыт в 22:30', can_reserve: freeJ }, fx: w => { w.phone = 'late'; } },
        { at: 'пн 22:41', from: 'app', to: 'orders', dir: 'req', who: 'person', by: 'покупатель', ttl: `Покупатель согласился: ${itemsText(oL.items)}`, lbl: 'взять из плана', json: { items: oL.items.map(x => ({ product_id: x.id, qty: x.q })), reserve_from_plan: true } },
        { at: 'пн 22:41', from: 'orders', to: 'db', dir: 'req', who: 'system', ttl: 'Записан «Создан» — с пометкой «резерв из плана»', lbl: 'записать: резерв', fx: preFx(oL, { reserve: true }) },
        { at: 'пн 22:42', from: 'paymost', to: 'pay', dir: 'evt', who: 'system', kind: 'ok', ttl: 'Оплата прошла, чек «предоплата» пробит', lbl: 'оплачено',
          txt: 'Оплата и чек — как в обычном пути (здесь свёрнуты в один шаг).',
          fx: w => { w.payment = { ext: 'pm_82a1', sum: sumL, status: 'успешно', method: o.pay }; setSt(w, 'Оплачен'); w.checks.push({ type: 'предоплата', sum: sumL, status: 'пробит', fd: '10487' }); w.phone = 'ok'; } },
        { at: 'пн 23:00', from: 'plan', to: 'db', dir: 'req', who: 'timer', ttl: 'План в 23:00: этот заказ не добавляется', lbl: 'план +0',
          txt: 'Заказ взял выпечку из того, что и так испекут. План не растёт. Если бы сервер принял заказ «как обычно», цех узнал бы о нём только утром.',
          fx: w => { w.plan.fixed = true; w.plan.reserve = true; setSt(w, 'Принят пекарней'); } }
      ];
      end = { kind: 'ok', html: 'Правило 22:30 сработало там, где должно, — на сервере. Покупатель не ушёл ни с чем, цех не получил сюрприз утром. <b>Что описывает аналитик:</b> что значит «уже запланировано» и откуда это число, текст предупреждения, ответ API на запоздавший заказ, что делать, если в плане пусто.' };
    } else if (v === 'noshow') {
      steps = [...segOrder(o, 'пн 21:40'), ...segPayCash(o, 'пн 21:40'), ...segPlanQuick(o), ...segMorning(o).slice(0, 4),
        { at: 'вт ' + fm(s0 + 30), from: 'orders', dir: 'self', who: 'timer', kind: 'warn', ttl: 'Интервал закончился — покупателя нет',
          txt: `Сервер включает отсчёт: неоплаченный заказ держим ещё 30 минут — до ${fm(s0 + 60)}. Пакет стоит под прилавком.`, rules: [['info', `Держим до ${fm(s0 + 60)}`, 'F-hold']] },
        { at: 'вт ' + fm(s0 + 60), from: 'orders', to: 'db', dir: 'req', who: 'timer', kind: 'bad', ttl: 'Статус «Не выкуплен»', lbl: 'записать: не выкуплен',
          txt: 'Никто не нажимает кнопку — статус меняет таймер. Человек тут не нужен: в пик кассиру не до этого.',
          rules: [[false, '30 минут после интервала прошли, оплаты нет', 'F-hold']], fx: w => setSt(w, 'Не выкуплен') },
        { at: 'вт ' + fm(s0 + 60), from: 'orders', to: 'cash', dir: 'res', who: 'system', kind: 'warn', ttl: 'Кассиру: выпечку — на витрину', lbl: `${CODE}: на витрину`,
          txt: `Планшет кассира подсказывает: пакет ${CODE} разобрать и выложить на витрину. Иначе выпечка зачерствеет под прилавком.`, fx: w => { w.cashier.hint = 'vitrina'; } },
        { at: 'вт ' + fm(s0 + 61), from: 'catalog', to: 'db', dir: 'req', who: 'system', ttl: `Остаток витрины: +${n} шт.`, lbl: `витрина +${n}`,
          txt: 'Модуль «Каталог и остатки» прибавил выпечку к остаткам — теперь её видят покупатели, которые заказывают «на сегодня».', fx: w => { w.stock = n; } }];
      end = { kind: 'warn', html: 'Таймер, а не человек, перевёл заказ в «Не выкуплен» ровно через 30 минут после интервала. Выпечка не пропала — ушла на витрину. <b>Открытый вопрос аналитика:</b> а если заказ был оплачен онлайн? Правило F-hold говорит только о неоплаченных — это надо уточнить у Нины Сергеевны и Павла.' };
    } else if (v === 'cancel3' || v === 'cancel1') {
      const early = v === 'cancel3', t = fm(s0 - (early ? 180 : 60)), lim = fm(s0 - 120);
      steps = [...segQuick(o, 'пн 21:40'), ...segPlanQuick(o),
        { at: 'вт ' + t, from: 'app', to: 'orders', dir: 'req', who: 'person', by: 'покупатель', ttl: 'Покупатель нажал «Отменить заказ»', lbl: 'отменить',
          txt: `До начала интервала ${ivl(o.slot)} — ${early ? '3 часа' : '1 час'}.`, json: { code: CODE, action: 'cancel' } },
        { at: 'вт ' + t, from: 'orders', dir: 'self', who: 'system', kind: early ? 'ok' : 'warn', ttl: 'Проверка правила отмены',
          txt: 'Правило про время — значит, проверяет его сервер по своим часам, а не телефон по своим.',
          rules: [early ? [true, `${t} — не позже ${lim} (за 2 часа до интервала): деньги вернём`, 'F-cancel'] : [false, `${t} — позже ${lim}: бесплатная отмена закончилась`, 'F-cancel']] }];
      if (early) {
        steps.push(
          { at: 'вт ' + t, from: 'orders', to: 'db', dir: 'req', who: 'system', kind: 'warn', ttl: 'Статус «Отменён клиентом»', lbl: 'записать: отменён', fx: w => setSt(w, 'Отменён клиентом') },
          { at: 'вт ' + t, from: 'pay', to: 'paymost', dir: 'req', who: 'system', ttl: `Вернуть ${rub(sum)} на ту же карту`, lbl: `возврат ${rub(sum)}`,
            rules: [[true, 'Возврат — на ту же карту, до 3 рабочих дней', 'F-refund']], json: { payment_id: 'pm_81f3', refund: sum }, fx: w => { w.payment.status = 'возврат'; } },
          { at: 'вт ' + t, from: 'pay', to: 'kassapro', dir: 'req', who: 'system', ttl: 'Чек возврата', lbl: 'чек «возврат»',
            txt: 'Деньги вернули — по 54-ФЗ на это тоже пробивается чек: «возврат прихода».', fx: w => { w.checks.push({ type: 'возврат', sum, status: 'пробит', fd: '10611' }); } },
          { at: 'вт ' + t, from: 'orders', to: 'app', dir: 'res', who: 'system', kind: 'ok', ttl: 'Покупатель видит: «Заказ отменён, деньги вернутся»', lbl: 'отменён', fx: w => { w.phone = 'cancel'; } },
          { at: 'вт ' + fm(Math.max(s0 - 175, 440)), from: 'catalog', to: 'db', dir: 'req', who: 'system', ttl: 'Выпечку уже испекли — она идёт на витрину', lbl: `витрина +${n}`,
            txt: 'План утвердили в 23:00, а отмена пришла позже. Отменённый заказ не уменьшает план — выпечка просто идёт в продажу.', fx: w => { w.stock = n; } });
        end = { kind: 'ok', html: 'Отмена вовремя — простой путь: статус, возврат, чек возврата. Но посмотрите на последний шаг: план утверждён в 23:00, поэтому выпечка всё равно испечена и уходит на витрину. <b>Что описывает аналитик:</b> правило времени, текст подтверждения, возврат через «ПэйМост», чек возврата через «КассаПро».' };
      } else {
        steps.push(
          { at: 'вт ' + t, from: 'orders', to: 'app', dir: 'res', who: 'system', kind: 'warn', ttl: 'Покупатель видит предупреждение — до отмены', lbl: 'без возврата?',
            txt: `«До интервала меньше 2 часов: выпечка уже испечена. Отменить без возврата ${rub(sum)}?» Покупатель должен узнать об этом ДО нажатия, а не из банковской выписки.`,
            json: { code: CODE, refund: 0, reason: 'less_than_2h' }, fx: w => { w.phone = 'cancelwarn'; } },
          { at: 'вт ' + t, from: 'app', to: 'orders', dir: 'req', who: 'person', by: 'покупатель', ttl: 'Покупатель всё равно отменил', lbl: 'отменить без возврата' },
          { at: 'вт ' + t, from: 'orders', to: 'db', dir: 'req', who: 'system', kind: 'warn', ttl: '«Отменён клиентом» — без возврата', lbl: 'записать: отменён', fx: w => { setSt(w, 'Отменён клиентом'); w.phone = 'cancelnr'; } },
          { at: 'вт ' + t, from: 'orders', to: 'cash', dir: 'res', who: 'system', kind: 'warn', ttl: `Кассиру: ${CODE} отменён — выпечку на витрину`, lbl: `${CODE}: отменён`,
            txt: 'Кассир не соберёт пакет, а выпечка уйдёт в продажу на витрину.', fx: w => { w.cashier.shown = true; w.cashier.hint = 'cancel'; w.stock = n; } });
        end = { kind: 'warn', html: 'Правило сработало: отмена есть, возврата нет — и покупатель предупреждён заранее. <b>Открытый вопрос к Олегу Петровичу:</b> какой чек пробить, если деньги остались у пекарни, а выпечку покупатель не забрал? Такие вопросы всплывают, только когда проходишь сценарий по шагам.' };
      }
    } else if (v === 'offline') {
      steps = [...segQuick(o, 'пн 21:40'), ...segPlanQuick(o),
        { at: 'вт ' + fm(s0 - 5), from: 'orders', to: 'cash', dir: 'res', who: 'system', ttl: 'Список интервала загружен на планшет', lbl: `заказы ${ivl(o.slot)}`,
          txt: 'Планшет заранее скачивает заказы ближайших интервалов — вместе с отметкой «оплачен». Это страховка на случай обрыва.', fx: w => { w.cashier.shown = true; } },
        { at: 'вт ' + fm(s0), from: 'cash', dir: 'self', who: 'event', kind: 'bad', ttl: 'Модем отвалился: нет связи',
          txt: `${b.net === 'проводной' ? 'Даже проводной интернет иногда пропадает.' : `${b.name === 'Покровка' ? 'На Покровке' : 'Здесь'} нет проводного интернета: касса и планшет работают через мобильный модем, обрывы по 10–15 минут.`}`,
          rules: [['info', 'Обрывы связи по 10–15 минут', 'F-net']], fx: w => { w.cashier.offline = true; } },
        { at: 'вт ' + fm(s0 + 2), from: 'cash', dir: 'self', who: 'person', by: 'кассир', kind: 'warn', ttl: '«Собрать» — сохранено на планшете',
          txt: 'Планшет не пишет «Ошибка сети» и не блокирует кнопки. Он запоминает действие, чтобы отправить потом.', rules: [['info', 'Касса уходит в офлайн и потом досылает', 'F-obs-modem']],
          fx: w => { w.cashier.queue = 1; w.cashier.local = 'Собран'; } },
        { at: 'вт ' + fm(s0 + 9), from: 'cash', dir: 'self', who: 'person', by: 'кассир', kind: 'warn', ttl: 'Покупатель назвал код — «Выдать» без связи',
          txt: 'Заказ оплачен заранее, и планшет это знает — выдать можно без сервера. А SMS «собран» не ушло: сервер пока не знает, что заказ собран.',
          fx: w => { w.cashier.queue = 2; w.cashier.local = 'Выдан'; w.phone = 'done'; } },
        { at: 'вт ' + fm(s0 + 14), from: 'cash', to: 'orders', dir: 'req', who: 'system', kind: 'ok', ttl: 'Связь вернулась: планшет досылает 2 события', lbl: 'досылка: 2 события',
          json: { events: [{ code: CODE, action: 'collect', at: fm(s0 + 2) }, { code: CODE, action: 'issue', at: fm(s0 + 9) }] }, fx: w => { w.cashier.offline = false; w.cashier.queue = 0; } },
        { at: 'вт ' + fm(s0 + 14), from: 'orders', to: 'db', dir: 'req', who: 'system', ttl: '«Собран» и «Выдан» — по времени нажатия', lbl: 'записать статусы',
          txt: `Статусы записываются со временем нажатия (${fm(s0 + 2)} и ${fm(s0 + 9)}), а не отправки. SMS «собран» сервер уже не шлёт: заказ выдан — сообщение только запутает.`,
          fx: w => { setSt(w, 'Собран'); setSt(w, 'Выдан'); w.cashier.local = null; } },
        { at: 'вт ' + fm(s0 + 14), from: 'pay', to: 'kassapro', dir: 'req', who: 'system', ttl: 'Чек полного расчёта — досылаем', lbl: 'чек (досылка)',
          rules: [[true, 'Чеки после обрыва досылаются без потери', 'F-obs-modem']], json: { type: 'full_payment', order: CODE, sum, issued_at: fm(s0 + 9) } },
        { at: 'вт ' + fm(s0 + 14), from: 'kassapro', to: 'pay', dir: 'res', who: 'system', kind: 'ok', ttl: 'Чек пробит', lbl: 'ФД 10540', fx: w => { w.checks.push({ type: 'полный расчёт', sum, status: 'пробит', fd: '10540' }); } }];
      end = { kind: 'ok', html: 'Обрыв связи — не авария, а обычный режим для трёх пекарен. Выдача не остановилась, ничего не потерялось. <b>Что описывает аналитик:</b> что планшет хранит у себя, какие кнопки работают без связи, как и в каком порядке досылаются события и чеки, что видит кассир. И нефункциональное требование: «чеки после обрыва досылаются в течение 15 минут — без потерь».' };
    } else if (v === 'bypass') {
      const mi = mainItem(o), P = byP(mi.id);
      steps = [
        { at: 'пн 23:00', from: 'plan', to: 'shop', dir: 'res', who: 'timer', ttl: 'План на вторник утверждён', lbl: 'план на вт',
          txt: `В 23:00 план зафиксирован: ${P.sh.toLowerCase()} — ${P.base} по статистике + ${P.pre} по предзаказам. Цех испечёт ровно столько.`, fx: w => { w.plan.fixed = true; } },
        Object.assign({}, segOrder(o, 'пн 23:20')[0], { ttl: 'Старая версия приложения отправляет заказ',
          txt: 'В новой версии кнопка «Завтра» после 22:30 неактивна. Но у части покупателей приложение не обновлялось полгода — там этой проверки нет, и запрос уходит на сервер.' }),
        { at: 'пн 23:20', from: 'orders', dir: 'self', who: 'system', kind: 'bad', ttl: 'Сервер правило не проверяет',
          txt: 'Сервер доверился телефону: раз запрос пришёл — значит, можно.', rules: [[false, '23:20 — позже 22:30, но сервер об этом «не знает»: проверку написали только в приложении', 'F-cutoff']] },
        { at: 'пн 23:20', from: 'orders', to: 'db', dir: 'req', who: 'system', kind: 'bad', ttl: 'Записан «Создан»', lbl: 'записать заказ', fx: preFx(o) },
        { at: 'пн 23:21', from: 'paymost', to: 'pay', dir: 'evt', who: 'system', kind: 'ok', ttl: 'Оплата прошла, чек «предоплата» пробит', lbl: 'оплачено',
          txt: 'Оплата и чек — как в обычном пути (свёрнуты в один шаг).',
          fx: w => { w.payment = { ext: 'pm_83c7', sum, status: 'успешно', method: o.pay }; setSt(w, 'Оплачен'); w.checks.push({ type: 'предоплата', sum, status: 'пробит', fd: '10491' }); } },
        { at: 'пн 23:21', from: 'orders', to: 'app', dir: 'res', who: 'system', kind: 'ok', ttl: 'Покупатель видит «Заказ принят» и спокойно спит', lbl: `${CODE} · оплачен`, fx: w => { w.phone = 'ok'; } },
        { at: 'пн 23:21', from: 'plan', dir: 'self', who: 'system', kind: 'bad', ttl: 'А план уже утверждён — заказа в нём нет',
          txt: 'План собрали в 23:00, заказ пришёл в 23:20. Цех испечёт ровно столько, сколько решили без него.', fx: w => { w.plan.miss = true; } },
        { at: 'вт ' + fm(s0 - 5), from: 'orders', to: 'cash', dir: 'res', who: 'system', kind: 'warn', ttl: 'Утром заказ у кассира, а выпечки под него нет', lbl: `заказы ${ivl(o.slot)}`, fx: w => { w.cashier.shown = true; } },
        { at: 'вт ' + fm(s0 + 2), from: 'cash', dir: 'self', who: 'person', by: 'кассир', kind: 'bad', ttl: `Кассир собирает ${CODE} с общей витрины`,
          txt: `Пакет собирают с витрины: минус ${n} шт. В утренний пик кому-то из очереди этой выпечки не хватит — тому, кто ничего не нарушал.`, fx: w => { w.stock = -n; setSt(w, 'Собран'); } }];
      end = { kind: 'bad', html: 'Заказ «проскочил», а план выпечки о нём не знал — пострадал случайный покупатель в очереди. Так ломается система, где правило живёт только в приложении: старые версии, сайт, планшет кассира — у каждого входа своя проверка или никакой. <b>Вывод: правила живут в бэкенде</b> — там, через что проходят все входы. В приложении проверка остаётся только для удобства (кнопка неактивна). Сравните с вариантом «Заказ в 22:40».' };
    }
    return { v, steps, end, o, notes };
  }
  function worldAt(S, k) {
    const w = world0();
    for (let i = 0; i < k && i < S.steps.length; i++) { const st = S.steps[i]; w.clock = st.at; if (st.fx) st.fx(w); }
    if (!k) w.clock = S.steps[0] ? S.steps[0].at : '';
    return w;
  }
  const liveS = () => buildSteps(MEM.live.variant, curOrder());

  // ---------- виджеты «что изменилось» ----------
  const nodeTag = id => { const n = N[id]; return `<span class="ksys-nt" style="--nc:${KCOL[n.k]}"><i></i>${esc(n.t === 'API' ? 'API' : n.t)}</span>`; };
  function phoneMini(w, S) {
    const o = S.o, sum = sumOf(w.items.length ? w.items : o.items), s0 = hm(o.slot);
    const scr = {
      cart: `<div class="ksys-mp-t">Корзина</div><div class="small">${esc(itemsText(o.items))}</div><div class="small dim">${esc(bakN(o.bak).name)} · вт · ${ivl(o.slot)}</div><button type="button" class="ksys-mp-btn" data-a="lv-play">Заказать · ${rub(sumOf(o.items))}</button>`,
      sending: '<span class="ksys-spin" aria-hidden="true"></span><div class="small">Отправляем заказ…</div>',
      paypage: `<div class="ksys-mp-pm"><span class="small">🔒 pay.paymost.ru</span><b>ПэйМост</b><span class="tnum">${rub(sum)}</span></div>`,
      paying: w.status === 'Оплачен'
        ? '<span class="ksys-spin" aria-hidden="true"></span><div class="small">Проверяем оплату…</div><div class="small dim">Сервер уже знает, что оплата прошла. Телефон узнает об этом при следующем запросе статуса.</div>'
        : '<span class="ksys-spin" aria-hidden="true"></span><div class="small">Ждём ответ банка…</div>',
      ok: `<div class="ksys-mp-ok">✓ Заказ принят</div><div class="ksys-code sm">${CODE}</div><div class="small">${w.status === 'Принят пекарней' ? 'Принят пекарней' : 'Оплачен'}</div>`,
      okcash: `<div class="ksys-mp-ok">✓ Заказ принят</div><div class="ksys-code sm">${CODE}</div><div class="small">К оплате на месте ${rub(sum)} · держим до ${fm(s0 + 60)}</div>`,
      fail: '<div class="ksys-mp-bad">✕ Оплата не прошла</div><div class="small">Деньги не списаны. Другая карта или оплата на месте?</div>',
      late: '<div class="ksys-mp-warn">⏰ Приём на завтра закрыт в 22:30</div><div class="small">Можно из запланированного: круассаны — 3, багеты — 5…</div>',
      sms: `<div class="ksys-mp-sms"><b>SMS · Колос</b>Заказ ${CODE} собран. Ждём вас до ${fm(s0 + 30)}.</div>`,
      done: '<div class="ksys-mp-ok">✓ Выдан</div><div class="small">Спасибо! Чек — в SMS.</div>',
      cancel: `<div class="ksys-mp-ok">↩ Заказ отменён</div><div class="small">${rub(sum)} вернутся на карту за 3 рабочих дня</div>`,
      cancelwarn: `<div class="ksys-mp-warn">До интервала меньше 2 часов</div><div class="small">Отменить без возврата ${rub(sum)}?</div>`,
      cancelnr: '<div class="ksys-mp-bad">Заказ отменён без возврата</div>'
    }[w.phone] || '';
    return `<div class="ksys-mp"><div class="ksys-mp-sb tnum">${esc(w.clock.slice(3))}</div><div class="ksys-mp-b">${scr}</div></div>`;
  }
  function dbMini(w) {
    if (!w.pre) return '<div class="small dim">В базе о заказе пока ничего нет: корзина живёт только в телефоне.</div>';
    const rows = [['Предзаказ', `${CODE} · <b>${esc(w.status)}</b>${w.pre.reserve ? ' · резерв из плана' : ''}`], ['Позиции', esc(itemsText(w.items))],
      ['Оплата', w.payment ? `${esc(w.payment.status)}${w.payment.ext !== '—' ? ' · <span class="mono">' + w.payment.ext + '</span>' : ''}` : '—'],
      ['Чеки', w.checks.length ? w.checks.map(c => esc(c.type)).join(', ') : '—']];
    if (w.stock) rows.push(['Остаток витрины', `${w.stock > 0 ? '+' : '−'}${Math.abs(w.stock)} шт.`]);
    if (w.onec) rows.push(['Сводка в 1С', 'отправлена']);
    return `<div class="ksys-kv">${rows.map(r => `<span>${r[0]}</span><span>${r[1]}</span>`).join('')}</div><button type="button" class="btn xs ghost" data-a="lv-data">Все таблицы →</button>`;
  }
  function cashMini(w, S) {
    const o = S.o;
    if (!w.cashier.shown) return '<div class="small dim">Планшет кассира пока не знает о заказе: он показывает заказы ближайшего интервала, а до него ещё далеко.</div>';
    const st = w.cashier.local || w.status, off = w.cashier.offline;
    const row = (c, t, s, mine) => `<div class="ksys-mc-r ${mine ? 'mine' : ''}"><b class="mono">${c}</b><span>${t}</span><span class="chip ${/Выдан|Собран/.test(s) ? 'ok' : /Не выкуплен|Отменён/.test(s) ? 'bad' : ''}">${esc(s)}</span></div>`;
    return `<div class="ksys-mc ${off ? 'off' : ''}"><div class="ksys-mc-top">${off ? `⚠ нет связи · в очереди: ${w.cashier.queue}` : '● в сети'} · ${ivl(o.slot)}</div>
      ${row('К-245', 'к оплате', 'Принят пекарней')}${row('К-246', 'оплачен', 'Принят пекарней')}${row(CODE, w.pre && w.pre.pay === 'cash' ? 'к оплате' : 'оплачен', st, true)}
      ${w.cashier.hint ? `<div class="ksys-mc-hint">${w.cashier.hint === 'vitrina' ? '→ разобрать пакет и выложить на витрину' : '→ заказ отменён: выпечку на витрину'}</div>` : ''}</div>`;
  }
  function planMini(w, S) {
    const mi = mainItem(S.o), P = byP(mi.id), add = w.plan.mine ? mi.q : 0;
    const line = `<div class="ksys-pmini"><span aria-hidden="true">${P.ico}</span> ${esc(P.sh)}: <span class="tnum">${P.base}</span> + <span class="tnum">${P.pre + add}</span> = <b class="tnum">${P.base + P.pre + add}</b></div>`;
    if (!w.plan.fixed) return `<div class="small">План на вторник — <b>черновик</b>, утвердится в 23:00.</div>${line}<div class="small dim">база по статистике + предзаказы</div>`;
    return `<div class="small">План на вт утверждён в 23:00</div>${line}${w.plan.mine ? `<span class="chip ok">ваш заказ: +${mi.q}</span>` : w.plan.reserve ? '<span class="chip info">резерв из плана: +0</span>' : w.plan.miss ? '<span class="chip bad">заказ не попал в план</span>' : '<span class="chip">без вашего заказа</span>'}`;
  }
  function statusMini(w) {
    const pay = w.trail.includes('Ждёт оплаты на месте') ? 'Ждёт оплаты на месте' : 'Оплачен';
    const chain = ['Создан', pay, 'Принят пекарней', 'Собран', 'Выдан'];
    const br = ['Отменён клиентом', 'Не выкуплен', 'Отменён пекарней'].find(s => w.status === s);
    return `<div class="ksys-chain">${chain.map(s => `<span class="${w.status === s ? 'cur' : w.trail.includes(s) ? 'done' : ''}">${esc(s)}</span>`).join('<i aria-hidden="true">→</i>')}${br ? `<i aria-hidden="true">↘</i><span class="cur bad">${esc(br)}</span>` : ''}</div>
      <button type="button" class="btn xs ghost" data-a="lv-status">Вся статусная модель →</button>`;
  }
  function stepHTML(S, k, st) {
    const V = VARIANTS.find(x => x.id === S.v);
    if (!st) {
      const o = S.o;
      return `<div class="eyebrow">Живой сценарий · ${esc(V.t)}</div><h3>Заказ ещё в корзине</h3>
        <p>${esc(bakN(o.bak).name)}, вт 6 октября, ${ivl(o.slot)}: ${esc(itemsText(o.items))} — ${rub(sumOf(o.items))}, ${PAYT[o.pay]}.</p>
        ${S.notes.length ? `<div class="small muted">${S.notes.map(esc).join(' ')}</div>` : '<div class="small muted">Это заказ, который вы собрали на вкладке «Экраны».</div>'}
        <p class="small">Нажмите «Заказать» или «▶ Играть». Следите сразу за всем: точка бежит по схеме, здесь — что происходит, ниже меняются база, экран кассира, план цеха и статус.</p>
        <button type="button" class="btn primary" data-a="lv-play">▶ Заказать</button>`;
    }
    const to = st.to && st.to !== st.from;
    return `<div class="ksys-step-h"><span class="ksys-time tnum">${esc(st.at)}</span><span class="ksys-who">${WHO[st.who] || ''}${st.by ? ': ' + esc(st.by) : ''}</span><span class="dim small tnum">шаг ${k} из ${S.steps.length}</span></div>
      <div class="ksys-route2">${nodeTag(st.from)}${to ? `<span class="ar" aria-hidden="true">${st.dir === 'res' ? '⇢' : '→'}</span>${nodeTag(st.to)}<span class="chip">${DIRT[st.dir] || 'запрос'}</span>` : '<span class="chip">действие внутри</span>'}</div>
      <h3 class="ksys-step-t ${st.kind || ''}">${esc(st.ttl)}</h3>
      ${st.txt ? `<p>${st.txt}</p>` : ''}
      ${st.rules ? `<div class="ksys-rules">${st.rules.map(r => `<div class="ksys-rule ${r[0] === true ? 'ok' : r[0] === false ? 'bad' : 'info'}"><span class="mk">${r[0] === true ? '✓' : r[0] === false ? '✕' : 'i'}</span><span>${esc(r[1])}</span>${r[2] ? fchip(r[2]) : ''}</div>`).join('')}</div>` : ''}
      ${st.json ? `<div class="code-cap">Что передаётся — для программы (упрощённо)</div>${json(st.json)}` : ''}`;
  }
  function tlHTML(S) {
    let h = '<button type="button" class="ksys-tld0" data-a="lv-go" data-k="0" title="К началу" aria-label="К началу сценария">⟲</button>', last = null;
    S.steps.forEach((st, i) => {
      if (st.at !== last) { h += `${last !== null ? '</div></div>' : ''}<div class="ksys-tlg"><span class="ksys-tlt tnum">${esc(st.at)}</span><div class="ksys-tlds">`; last = st.at; }
      h += `<button type="button" class="ksys-tld ${st.kind || ''}" data-a="lv-go" data-k="${i + 1}" title="${i + 1}. ${esc(st.ttl)}" aria-label="Шаг ${i + 1}: ${esc(st.ttl)}"></button>`;
    });
    return h + (last !== null ? '</div></div>' : '');
  }
  function flowHTML(S) {
    return ui.table(['№', 'Когда', 'Кто → кому', 'Что происходит', 'Правило'], S.steps.map((st, i) => [
      `<span class="tnum">${i + 1}</span>`, `<span class="tnum nowrap">${esc(st.at)}</span>`,
      `${esc(N[st.from].t)}${st.to && st.to !== st.from ? ' → ' + esc(N[st.to].t) : ''}`, esc(st.ttl),
      (st.rules || []).filter(r => r[2]).map(r => esc(r[2])).join(', ')]));
  }

  function renderLive(box, inst) {
    let S = liveS(), timer = null;
    box.innerHTML = `<div class="ksys-live">
      <div class="ksys-wif"><div class="eyebrow">Что если…</div><div class="ksys-wifs" role="group" aria-label="Варианты сценария">${VARIANTS.map(v => `<button type="button" class="ksys-wf" data-a="lv-var" data-v="${v.id}" aria-pressed="${MEM.live.variant === v.id}"><span aria-hidden="true">${v.ico}</span>${esc(v.t)}</button>`).join('')}</div>
        <p class="small muted" data-vdesc></p></div>
      <div class="ksys-lv-main">
        <div class="ksys-lv-map"><div class="board ksys-board">${mapSVG()}</div>
          <div class="ksys-ctl-row"><button type="button" class="btn sm primary" data-a="lv-play">▶ Играть</button><button type="button" class="btn sm" data-a="lv-prev">← Назад</button><button type="button" class="btn sm" data-a="lv-next">Шаг →</button><button type="button" class="btn sm ghost" data-a="lv-reset">⟲ Сначала</button><span class="small dim tnum" data-n></span></div>
          <div class="ksys-tl" data-tl></div></div>
        <div class="ksys-step" data-step aria-live="polite"></div>
      </div>
      <div class="ksys-wgs" data-wgs>
        <div class="ksys-wg" data-w="phone"><div class="ksys-wg-h">📱 Видит покупатель</div><div class="ksys-wg-b"></div></div>
        <div class="ksys-wg" data-w="db"><div class="ksys-wg-h">📒 База данных</div><div class="ksys-wg-b"></div></div>
        <div class="ksys-wg" data-w="cash"><div class="ksys-wg-h">🧾 Планшет кассира</div><div class="ksys-wg-b"></div></div>
        <div class="ksys-wg" data-w="plan"><div class="ksys-wg-h">🥖 План выпечки</div><div class="ksys-wg-b"></div></div>
        <div class="ksys-wg wide" data-w="status"><div class="ksys-wg-h">🚦 Статус заказа ${CODE}</div><div class="ksys-wg-b"></div></div>
      </div>
      <div data-end></div>
      <details class="more"><summary>Все шаги списком — так выглядит таблица потоков в спецификации</summary><div data-flow></div></details>
    </div>`;
    const svg = TR.$('svg', box), board = TR.$('.ksys-board', box), stepEl = TR.$('[data-step]', box), nEl = TR.$('[data-n]', box);
    const tl = TR.$('[data-tl]', box), endEl = TR.$('[data-end]', box), wgs = TR.$('[data-wgs]', box);
    const playBtn = TR.$('.ksys-ctl-row [data-a="lv-play"]', box);
    function setup() {
      const V = VARIANTS.find(x => x.id === MEM.live.variant);
      TR.$('[data-vdesc]', box).innerHTML = `<b>${esc(V.t)}.</b> ${esc(V.d)}`;
      tl.innerHTML = tlHTML(S);
      TR.$('[data-flow]', box).innerHTML = flowHTML(S);
      TR.$$('[data-a="lv-var"]', box).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === MEM.live.variant)));
      TR.$$('.ksys-wg', wgs).forEach(el => { el._h = undefined; });
    }
    function update(anim) {
      const k = Math.max(0, Math.min(MEM.live.step, S.steps.length)); MEM.live.step = k;
      const st = k ? S.steps[k - 1] : null, w = worldAt(S, k);
      hopOn(svg, st, { still: !anim });
      if (anim) hopScroll(board, st);
      stepEl.innerHTML = stepHTML(S, k, st);
      nEl.textContent = `${k} / ${S.steps.length}`;
      TR.$$('[data-k]', tl).forEach(b => { const i = +b.dataset.k; b.classList.toggle('past', i > 0 && i < k); b.setAttribute('aria-current', String(i === k)); });
      const cur = TR.$(`[data-k="${k}"]`, tl);
      if (cur && anim && tl.scrollWidth > tl.clientWidth) { try { tl.scrollTo({ left: cur.offsetLeft - tl.clientWidth / 2, behavior: reduced() ? 'auto' : 'smooth' }); } catch (e) { } }
      const parts = { phone: phoneMini(w, S), db: dbMini(w), cash: cashMini(w, S), plan: planMini(w, S), status: statusMini(w) };
      Object.keys(parts).forEach(id => {
        const el = TR.$(`[data-w="${id}"]`, wgs); if (!el) return;
        if (el._h !== parts[id]) { const had = el._h !== undefined; TR.$('.ksys-wg-b', el).innerHTML = parts[id]; el._h = parts[id]; if (had && anim) flash(el); }
      });
      TR.$('[data-a="lv-prev"]', box).disabled = k === 0;
      TR.$('[data-a="lv-next"]', box).disabled = k >= S.steps.length;
      endEl.innerHTML = k >= S.steps.length && S.end ? `<div class="ksys-end ${S.end.kind}"><div class="eyebrow">Итог варианта «${esc(VARIANTS.find(x => x.id === S.v).t)}»</div><p>${S.end.html}</p>
        <div class="row"><span class="small dim">Попробуйте другой исход:</span>${VARIANTS.filter(x => x.id !== S.v).slice(0, 4).map(x => `<button type="button" class="btn xs" data-a="lv-var" data-v="${x.id}">${x.ico} ${esc(x.t)}</button>`).join('')}</div></div>` : '';
    }
    function stop() { clearInterval(timer); timer = null; if (playBtn) playBtn.textContent = '▶ Играть'; }
    function next() { if (!box.isConnected) { stop(); return; } if (MEM.live.step >= S.steps.length) { stop(); return; } MEM.live.step++; update(true); if (MEM.live.step >= S.steps.length) stop(); }
    function play() {
      if (timer) { stop(); return; }
      if (MEM.live.step >= S.steps.length) { MEM.live.step = 0; update(false); }
      if (playBtn) playBtn.textContent = '⏸ Пауза';
      next(); timer = setInterval(next, 2300);
    }
    box.addEventListener('click', e => {
      const b = e.target.closest('[data-a]'); if (!b || !box.contains(b)) return;
      const a = b.dataset.a;
      if (a === 'lv-play') { if (b !== playBtn && timer) return; play(); }
      if (a === 'lv-next') { stop(); next(); }
      if (a === 'lv-prev') { stop(); MEM.live.step = Math.max(0, MEM.live.step - 1); update(true); }
      if (a === 'lv-reset') { stop(); MEM.live.step = 0; update(false); }
      if (a === 'lv-go') { stop(); MEM.live.step = +b.dataset.k; update(true); }
      if (a === 'lv-var') { stop(); MEM.live.variant = b.dataset.v; MEM.live.step = 0; S = liveS(); setup(); update(false); if (b.closest('[data-end]')) try { box.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' }); } catch (er) { } }
      if (a === 'lv-data') { stop(); inst.show('data'); }
      if (a === 'lv-status') { stop(); MEM.st.model = 'order'; inst.show('status'); }
    });
    box.addEventListener('keydown', e => {
      if (e.target.closest('input, textarea, select')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); stop(); next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); stop(); MEM.live.step = Math.max(0, MEM.live.step - 1); update(true); }
    });
    box._stop = stop;
    setup(); update(false);
  }

  // =====================================================================
  // 4. Данные: таблицы базы, один заказ глазами покупателя и базы, схема связей
  // =====================================================================
  const PAYN = { card: 'карта', sbp: 'СБП', cash: 'на месте' };
  function tablesOf(w, S) {
    const o = S.o, pre = w.pre, slot = o.slot, d = w.stock ? Math.sign(w.stock) : 0;
    const qOf = id => (w.items.find(x => x.id === id) || o.items.find(x => x.id === id) || { q: 0 }).q;
    return [
      { id: 'pre', t: 'Предзаказ', tech: 'preorder', what: 'сам заказ: кто, где, когда, в каком статусе', cols: ['id', 'код', 'покупатель_id', 'пекарня_id', 'дата', 'интервал', 'статус', 'сумма'], rows: [
        { k: 'o1045', c: [1045, 'К-245', 205, 1, '2026-10-06', ivl(slot), 'Ждёт оплаты на месте', 350] },
        { k: 'o1046', c: [1046, 'К-246', 311, 1, '2026-10-06', ivl(slot), w.plan.fixed ? 'Принят пекарней' : 'Оплачен', 180] },
        pre ? { k: 'o1047', c: [1047, CODE, 312, pre.bak, '2026-10-06', ivl(pre.slot), w.status, pre.sum], mine: true } : null] },
      { id: 'pos', t: 'Позиция предзаказа', tech: 'preorder_item', what: 'что именно в заказе и по какой цене', cols: ['предзаказ_id', 'товар_id', 'количество', 'цена'], rows: [
        { k: 'i1046', c: [1046, 13, 2, 90] }].concat(pre ? w.items.map(x => ({ k: 'i1047-' + x.id, c: [1047, x.id, x.q, byP(x.id).price], mine: true })) : []) },
      { id: 'payt', t: 'Оплата', tech: 'payment', what: 'деньги по заказу и их судьба', cols: ['id', 'предзаказ_id', 'способ', 'сумма', 'статус', 'id_в_ПэйМост'], rows: [
        { k: 'y881', c: [881, 1046, 'СБП', 180, 'успешно', 'pm_7a20'] },
        w.payment ? { k: 'y882', c: [882, 1047, PAYN[w.payment.method] || w.payment.method, w.payment.sum, w.payment.status, w.payment.ext], mine: true } : null] },
      { id: 'chk', t: 'Чек', tech: 'receipt', what: 'чеки по 54-ФЗ из «КассаПро»', cols: ['id', 'предзаказ_id', 'тип', 'сумма', 'статус', 'номер_ФД'], rows: [
        { k: 'h501', c: [501, 1046, 'предоплата', 180, 'пробит', '10477'] }].concat(w.checks.map((c, i) => ({ k: 'h' + (502 + i), c: [502 + i, 1047, c.type, c.sum, c.status, c.fd], mine: true }))) },
      { id: 'plan', t: 'План выпечки', tech: 'bake_plan', what: 'сколько печь завтра по всей сети: база + предзаказы', cols: ['дата', 'товар_id', 'база', 'предзаказы', 'итого', 'утверждён'], rows: PROD.map(p => {
        const m = w.plan.mine ? qOf(p.id) : 0;
        return { k: 'pl' + p.id, c: ['2026-10-06', p.id, p.base, p.pre + m, p.base + p.pre + m, w.plan.fixed ? 'пн 23:00' : '—'], mine: !!m };
      }) },
      { id: 'stock', t: 'Остаток', tech: 'stock', what: 'сколько лежит на витрине пекарни сейчас', cols: ['пекарня_id', 'товар_id', 'количество', 'обновлено'], rows: PROD.map(p => {
        const q = d && o.items.some(x => x.id === p.id) ? qOf(p.id) * d : 0;
        return { k: 'st' + p.id, c: [o.bak, p.id, Math.max(0, p.today + 12 + q), q ? w.clock.slice(3) : 'вт 07:20'], mine: !!q };
      }) },
      { id: 'cust', t: 'Покупатель', tech: 'customer', what: 'кто заказывает; персональные данные — по 152-ФЗ', cols: ['id', 'имя', 'телефон', 'согласие_ПД'], rows: [
        { k: 'c205', c: [205, 'Анна Павловна', '+7 9•• •••-••-12', 'да · заказывает через кассира'] },
        { k: 'c311', c: [311, 'Ирина', '+7 9•• •••-••-03', 'да'] },
        { k: 'c312', c: [312, 'Вы', '+7 9•• •••-••-47', 'да'], mine: true }] },
      { id: 'bak', t: 'Пекарня', tech: 'bakery', what: 'точки сети: 9 пекарен', cols: ['id', 'название', 'адрес', 'часы_работы', 'интернет'], rows: BAK.map(x => ({ k: 'b' + x.id, c: [x.id, x.name, x.addr, '07:00–21:00', x.net], mine: x.id === o.bak })).concat([{ k: 'bm', c: ['…', 'ещё 6 пекарен', '', '', ''] }]) },
      { id: 'prod', t: 'Товар', tech: 'product', what: 'ассортимент — около 120 позиций', cols: ['id', 'название', 'цена', 'доступен_с'], rows: PROD.map(p => ({ k: 'p' + p.id, c: [p.id, p.name, p.price, p.from || '—'], mine: o.items.some(x => x.id === p.id) })).concat([{ k: 'pm', c: ['…', 'ещё около 115 позиций', '', ''] }]) },
      { id: 'cake', t: 'Торт', tech: 'cake_order', what: 'торты на заказ: дата, надпись, фото-образец', cols: ['id', 'код', 'покупатель_id', 'дата', 'надпись', 'фото', 'статус'], rows: CAKES.map((c, i) => ({ k: 'k' + c.code, c: [77 + i, c.code, 400 + i, '2026-10-06', '«' + c.txt + '»', 'obr_' + c.code.slice(2) + '.jpg', MEM.shop.cakes[c.code]] })) }
    ];
  }
  function tblHTML(T, prev) {
    const rows = T.rows.filter(Boolean);
    return `<div class="ksys-tc ${T.id === 'pre' || T.id === 'cake' ? 'wide' : ''}" data-tbl="${T.id}"><div class="ksys-tc-h"><b>${esc(T.t)}</b><code>${esc(T.tech)}</code></div><div class="small muted">${esc(T.what)}</div>
      <div class="tbl-wrap"><table class="tbl ksys-tbl"><thead><tr>${T.cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => {
        const ch = prev && prev[r.k] !== JSON.stringify(r.c);
        return `<tr class="${ch ? 'hl' : ''} ${r.mine ? 'mine' : ''}">${r.c.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`;
      }).join('')}</tbody></table></div></div>`;
  }
  // один заказ: что видит покупатель и как это лежит в базе
  const PICKS = {
    code: 'Покупатель видит «К-247». База хранит то же в поле <code>Предзаказ.код</code> — и ещё внутренний номер <code>id = 1047</code>, который покупателю не нужен: по нему таблицы ссылаются друг на друга.',
    status: 'Статус — одно слово в поле <code>Предзаказ.статус</code>. Какие слова допустимы и как они сменяют друг друга, задаёт статусная модель (вкладка «Статусы»).',
    bak: 'Покупатель видит «Покровка, Большая Покровская». В заказе хранится только <code>пекарня_id</code>, а название и адрес база берёт из таблицы «Пекарня». Переименуют пекарню — поменяется в одном месте, а не в тысяче заказов.',
    when: 'Дата и интервал — два поля Предзаказа. «вт 6 октября» — это уже оформление на экране: в базе дата хранится как 2026-10-06.',
    items: 'Покупатель видит названия. В базе — строки «Позиции предзаказа»: <code>товар_id</code> и количество, а название подтягивается из таблицы «Товар». Цена копируется в позицию в момент заказа: подорожает круассан завтра — в вашем заказе останется старая цена.',
    sum: 'Итог хранится в <code>Предзаказ.сумма</code> — его посчитал сервер. Телефону на слово не верят.',
    pay: 'Как и чем оплачено — отдельная таблица «Оплата»: у неё свой статус и номер платежа в «ПэйМост». У одного заказа может быть несколько попыток оплаты — например, отклонённая и успешная.',
    chk: 'Чеки — отдельная таблица. У одного заказа их может быть два (предоплата и полный расчёт) или три (ещё и возврат).',
    cust: 'Своего номера в базе покупатель не видит, но заказ привязан к нему через <code>покупатель_id = 312</code>. Телефон и имя — персональные данные: по 152-ФЗ нужно согласие, хранение в России и удаление по запросу.'
  };
  function orderView(w, S) {
    if (!w.pre) {
      const k = S.steps.findIndex((st, i) => worldAt(S, i + 1).pre);
      return `<div class="ksys-card-empty"><b>Заказа в базе ещё нет.</b> На текущем шаге сценария он живёт только в телефоне — как корзина.${k >= 0 ? ` <button type="button" class="btn sm" data-a="d-goto" data-v="${S.steps.length}">Показать заказ в конце сценария</button>` : ''}</div>`;
    }
    const o = S.o, b = bakN(w.pre.bak), mode = MEM.data.mode, pk = MEM.data.pick;
    const seg = segA('d-mode', [{ v: 'client', t: '👤 Как видит покупатель' }, { v: 'db', t: '📒 Как хранит база' }], mode, 'accent');
    if (mode === 'client') {
      const rowB = (k, a, bb) => `<button type="button" class="ksys-rc" data-a="d-pick" data-v="${k}"><span>${a}</span><span>${bb}</span><i aria-hidden="true">🔍</i></button>`;
      return `${seg}<p class="small muted">Нажмите на любую строку — покажу, где это лежит в базе.</p>
        <div class="ksys-rcpt"><div class="ksys-rcpt-h"><b>Заказ ${CODE}</b><span class="ksys-stt">${esc(w.status)}</span></div>
          ${rowB('code', 'Код', `<b class="mono">${CODE}</b>`)}${rowB('status', 'Статус', esc(w.status))}${rowB('bak', 'Где', `${esc(b.name)}, ${esc(b.addr)}`)}${rowB('when', 'Когда', `вт 6 октября, ${ivl(w.pre.slot)}`)}
          ${w.items.map(x => rowB('items', `${esc(byP(x.id).name)}${x.q > 1 ? ' ×' + x.q : ''}`, rub(byP(x.id).price * x.q))).join('')}
          ${rowB('sum', '<b>Итого</b>', `<b>${rub(w.pre.sum)}</b>`)}${rowB('pay', 'Оплата', w.payment ? `${esc(PAYT[w.payment.method] || w.payment.method)}${w.payment.status !== 'на месте' ? ' · ' + esc(w.payment.status) : ''}` : '—')}
          ${rowB('chk', 'Чеки', w.checks.length ? w.checks.map(c => esc(c.type)).join(', ') : 'пока нет')}${rowB('cust', 'Покупатель', 'Вы, +7 9•• •••-••-47')}</div>`;
    }
    const td = (v, t) => `<td data-t="${t}">${esc(v)}</td>`;
    const tbl = (name, cols, rows) => `<div class="ksys-tc"><div class="ksys-tc-h"><b>${name}</b></div><div class="tbl-wrap"><table class="tbl ksys-tbl"><thead><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div></div>`;
    const html = `${seg}${pk ? `<div class="ksys-pick">${PICKS[pk]} <button type="button" class="btn xs ghost" data-a="d-mode" data-v="client">← к виду покупателя</button></div>` : '<p class="small muted">Один заказ — это строки в шести таблицах, связанные номерами. Переключитесь на вид покупателя и нажмите на строку — подсвечу нужные ячейки.</p>'}
      <div class="ksys-dbv">
        ${tbl('Предзаказ', ['id', 'код', 'покупатель_id', 'пекарня_id', 'дата', 'интервал', 'статус', 'сумма'], [`<tr>${td(1047, 'code')}${td(CODE, 'code')}${td(312, 'cust')}${td(w.pre.bak, 'bak')}${td('2026-10-06', 'when')}${td(ivl(w.pre.slot), 'when')}${td(w.status, 'status')}${td(w.pre.sum, 'sum')}</tr>`])}
        ${tbl('Позиция предзаказа', ['предзаказ_id', 'товар_id', 'количество', 'цена'], w.items.map(x => `<tr>${td(1047, 'items')}${td(x.id, 'items')}${td(x.q, 'items')}${td(byP(x.id).price, 'items')}</tr>`))}
        ${tbl('Товар', ['id', 'название', 'цена'], w.items.map(x => `<tr>${td(x.id, 'items')}${td(byP(x.id).name, 'items')}${td(byP(x.id).price, '')}</tr>`))}
        ${tbl('Пекарня', ['id', 'название', 'адрес'], [`<tr>${td(b.id, 'bak')}${td(b.name, 'bak')}${td(b.addr, 'bak')}</tr>`])}
        ${tbl('Покупатель', ['id', 'имя', 'телефон'], [`<tr>${td(312, 'cust')}${td('Вы', 'cust')}${td('+7 9•• •••-••-47', 'cust')}</tr>`])}
        ${tbl('Оплата', ['id', 'предзаказ_id', 'способ', 'статус', 'id_в_ПэйМост'], w.payment ? [`<tr>${td(882, 'pay')}${td(1047, 'pay')}${td(PAYN[w.payment.method] || w.payment.method, 'pay')}${td(w.payment.status, 'pay')}${td(w.payment.ext, 'pay')}</tr>`] : ['<tr><td colspan="5" class="dim">пока нет</td></tr>'])}
        ${tbl('Чек', ['id', 'тип', 'сумма', 'номер_ФД'], w.checks.length ? w.checks.map((c, i) => `<tr>${td(502 + i, 'chk')}${td(c.type, 'chk')}${td(c.sum, 'chk')}${td(c.fd, 'chk')}</tr>`) : ['<tr><td colspan="4" class="dim">пока нет</td></tr>'])}
      </div>`;
    return html;
  }
  const ER_ENT = [
    { id: 'cust', t: 'Покупатель', x: 290, y: 16, attrs: [{ n: 'id', k: 'PK' }, { n: 'имя' }, { n: 'телефон' }, { n: 'согласие_ПД' }] },
    { id: 'cake', t: 'Торт', x: 580, y: 16, attrs: [{ n: 'id', k: 'PK' }, { n: 'покупатель_id', k: 'FK' }, { n: 'пекарня_id', k: 'FK' }, { n: 'дата' }, { n: 'надпись' }, { n: 'фото' }, { n: 'статус' }] },
    { id: 'payt', t: 'Оплата', x: 20, y: 230, attrs: [{ n: 'id', k: 'PK' }, { n: 'предзаказ_id', k: 'FK' }, { n: 'способ' }, { n: 'сумма' }, { n: 'статус' }] },
    { id: 'pre', t: 'Предзаказ', x: 290, y: 230, w: 210, attrs: [{ n: 'id', k: 'PK' }, { n: 'код' }, { n: 'покупатель_id', k: 'FK' }, { n: 'пекарня_id', k: 'FK' }, { n: 'дата' }, { n: 'интервал' }, { n: 'статус' }, { n: 'сумма' }] },
    { id: 'bak', t: 'Пекарня', x: 580, y: 250, attrs: [{ n: 'id', k: 'PK' }, { n: 'название' }, { n: 'адрес' }, { n: 'часы_работы' }] },
    { id: 'chk', t: 'Чек', x: 20, y: 480, attrs: [{ n: 'id', k: 'PK' }, { n: 'предзаказ_id', k: 'FK' }, { n: 'тип' }, { n: 'сумма' }, { n: 'номер_ФД' }] },
    { id: 'pos', t: 'Позиция предзаказа', x: 330, y: 480, w: 210, attrs: [{ n: 'предзаказ_id', k: 'FK' }, { n: 'товар_id', k: 'FK' }, { n: 'количество' }, { n: 'цена' }] },
    { id: 'prod', t: 'Товар', x: 610, y: 480, attrs: [{ n: 'id', k: 'PK' }, { n: 'название' }, { n: 'цена' }, { n: 'доступен_с' }] },
    { id: 'stock', t: 'Остаток', x: 870, y: 360, attrs: [{ n: 'пекарня_id', k: 'FK' }, { n: 'товар_id', k: 'FK' }, { n: 'количество' }] },
    { id: 'plan', t: 'План выпечки', x: 610, y: 668, attrs: [{ n: 'дата' }, { n: 'товар_id', k: 'FK' }, { n: 'база' }, { n: 'предзаказы' }, { n: 'итого' }] }
  ];
  const ER_REL = [
    { a: 'cust', b: 'pre', ca: '1', cb: '0..N', t: 'делает' }, { a: 'bak', b: 'pre', ca: '1', cb: '0..N' }, { a: 'pre', b: 'pos', ca: '1', cb: '1..N', t: 'состоит из' },
    { a: 'prod', b: 'pos', ca: '1', cb: '0..N' }, { a: 'pre', b: 'payt', ca: '1', cb: '0..N' }, { a: 'pre', b: 'chk', ca: '1', cb: '0..N' },
    { a: 'bak', b: 'stock', ca: '1', cb: '0..N' }, { a: 'prod', b: 'stock', ca: '1', cb: '0..N' }, { a: 'prod', b: 'plan', ca: '1', cb: '0..N' },
    { a: 'cust', b: 'cake', ca: '1', cb: '0..N', t: 'заказывает' }, { a: 'bak', b: 'cake', ca: '1', cb: '0..N' }
  ];
  function renderData(box, inst) {
    function draw() {
      const S = liveS(), k = Math.min(MEM.live.step, S.steps.length), w = worldAt(S, k), st = k ? S.steps[k - 1] : null;
      const V = VARIANTS.find(x => x.id === S.v), sub = MEM.data.sub;
      let prev = null;
      if (k) { prev = {}; tablesOf(worldAt(S, k - 1), S).forEach(T => T.rows.filter(Boolean).forEach(r => { prev[r.k] = JSON.stringify(r.c); })); }
      let body = '';
      if (sub === 'tables') {
        body = `<p class="small muted">Жёлтым подсвечены строки, которые изменил последний шаг. Полоска слева — строки заказа ${CODE}. Имена таблиц и полей в настоящей базе обычно пишут латиницей (они в сером ярлыке) — здесь по-русски, чтобы было понятнее.</p>
          <div class="ksys-tcs">${tablesOf(w, S).map(T => tblHTML(T, prev)).join('')}</div>
          <p class="small muted">В модели «Колоса» есть ещё «Интервал выдачи» (его можно не хранить, а считать из часов работы пекарни) и «Списание» — появится вместе с учётом витрины.</p>`;
      } else if (sub === 'order') body = orderView(w, S);
      else body = `<div class="ksys-erl small muted"><b>Как читать.</b> Прямоугольник — сущность (будущая таблица), строки — её поля. <b>PK</b> — уникальный номер записи, <b>FK</b> — ссылка на запись в другой таблице. На концах линий: черта — «один», «воронья лапка» — «много», кружок — «может не быть». Например, у Предзаказа одна или много Позиций, а у Покупателя — ноль или много Предзаказов. Нажмите на сущность — покажу её таблицу с данными.</div><div data-er></div>`;
      box.innerHTML = `<div class="ksys-dbar"><div class="small">Данные после шага <b class="tnum">${k} из ${S.steps.length}</b> живого сценария «${esc(V.t)}»${st ? `: <i>${esc(st.ttl)}</i>` : ' — заказа ещё нет'}</div>
          <div class="row"><button type="button" class="btn xs" data-a="d-step" data-v="-1" ${k ? '' : 'disabled'}>← шаг</button><button type="button" class="btn xs" data-a="d-step" data-v="1" ${k < S.steps.length ? '' : 'disabled'}>шаг →</button><button type="button" class="btn xs ghost" data-a="d-live">Открыть сценарий</button></div></div>
        ${segA('d-sub', [{ v: 'tables', t: '🗂 Таблицы' }, { v: 'order', t: '🔁 Один заказ: покупатель и база' }, { v: 'er', t: '🔗 Схема связей' }], sub)}
        <div class="ksys-dbody">${body}</div>`;
      if (sub === 'er') {
        const el = TR.$('[data-er]', box);
        ui.er(el, { entities: TR.clone(ER_ENT), rels: ER_REL, width: 1080, height: 820, title: 'Сущности системы «Колос» и связи между ними', onClick: id => { MEM.data.sub = 'tables'; draw(); const t = TR.$(`[data-tbl="${id}"]`, box); if (t) { flash(t); try { t.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' }); } catch (e) { } } } });
      }
      if (sub === 'order' && MEM.data.mode === 'db' && MEM.data.pick) TR.$$(`[data-t="${MEM.data.pick}"]`, box).forEach(td => td.classList.add('ksys-cellhl'));
    }
    box.addEventListener('click', e => {
      const b = e.target.closest('[data-a]'); if (!b || !box.contains(b)) return;
      const a = b.dataset.a, v = b.dataset.v;
      if (a === 'd-sub') MEM.data.sub = v;
      else if (a === 'd-mode') { MEM.data.mode = v; if (v === 'client') MEM.data.pick = null; }
      else if (a === 'd-pick') { MEM.data.pick = v; MEM.data.mode = 'db'; }
      else if (a === 'd-step') MEM.live.step = Math.max(0, MEM.live.step + (+v));
      else if (a === 'd-goto') MEM.live.step = +v;
      else if (a === 'd-live') { inst.show('live'); return; }
      else return;
      draw();
    });
    draw();
  }

  // =====================================================================
  // 5. Статусы: диаграммы состояний предзаказа и торта
  // =====================================================================
  const WHOI = { person: '👤', system: '⚙', timer: '⏰' };
  const SM = {
    order: {
      t: 'Предзаказ', vb: [1000, 420], start: 'Создан', H: 46,
      nodes: { 'Создан': [40, 190, 150], 'Оплачен': [250, 108, 160], 'Ждёт оплаты на месте': [250, 272, 160], 'Принят пекарней': [470, 190, 160], 'Собран': [690, 190, 130], 'Выдан': [860, 190, 120], 'Отменён клиентом': [470, 30, 160], 'Отменён пекарней': [470, 352, 160], 'Не выкуплен': [690, 352, 130] },
      fin: ['Выдан', 'Отменён клиентом', 'Отменён пекарней', 'Не выкуплен'],
      tr: [
        { a: 'Создан', b: 'Оплачен', lbl: 'оплачено', who: 'system', by: 'система — по уведомлению «ПэйМост»', cond: 'Пришло уведомление «платёж прошёл». Телефону на слово не верим.', fx: 'Чек «предоплата» в «КассаПро»', f: ['F-pay', 'F-54fz'] },
        { a: 'Создан', b: 'Ждёт оплаты на месте', lbl: 'на месте', who: 'person', by: 'покупатель', cond: 'Выбрал «На месте при получении»', fx: 'Чека пока нет — он будет один, при выдаче', f: ['F-pay'] },
        { a: 'Создан', b: 'Создан', lbl: 'оплата не прошла', who: 'system', by: 'система — по уведомлению «ПэйМост»', cond: 'Банк отклонил платёж', fx: 'Покупатель видит «Оплата не прошла» и может выбрать другой способ. Сколько держать неоплаченный «Создан» — открытый вопрос', loop: true },
        { a: 'Оплачен', b: 'Принят пекарней', lbl: '23:00', who: 'timer', by: 'таймер', cond: 'В 23:00 заказ на завтра вошёл в план выпечки. Заказ на сегодня — сразу, из того, что на витрине', fx: 'План выпечки: + количество из заказа', f: ['F-plan', 'F-cutoff'] },
        { a: 'Ждёт оплаты на месте', b: 'Принят пекарней', lbl: '23:00', who: 'timer', by: 'таймер', cond: 'В 23:00 заказ вошёл в план выпечки', fx: 'Что заказ не оплачен, помнит таблица «Оплата» — статус заказа этого больше не показывает', f: ['F-plan'] },
        { a: 'Принят пекарней', b: 'Собран', lbl: '«Собрать»', who: 'person', by: 'кассир', cond: 'Кассир сложил пакет и нажал «Собрать»', fx: 'SMS покупателю «заказ собран»', f: ['F-obs-hands'] },
        { a: 'Собран', b: 'Выдан', lbl: '«Выдать»', who: 'person', by: 'кассир', cond: 'Покупатель назвал код. При оплате на месте — сначала оплата', fx: 'Чек полного расчёта в «КассаПро»', f: ['F-54fz', 'F-peak'] },
        { a: 'Оплачен', b: 'Отменён клиентом', lbl: 'отмена', who: 'person', by: 'покупатель', cond: 'Отменил до 23:00 — заказ ещё не в плане, возврат положен', fx: 'Возврат на ту же карту за 3 рабочих дня, чек возврата', f: ['F-cancel', 'F-refund'] },
        { a: 'Принят пекарней', b: 'Отменён клиентом', lbl: 'отмена', who: 'person', by: 'покупатель', cond: 'Не позже чем за 2 часа до интервала — с возвратом; позже — без возврата', fx: 'Выпечка уже в плане — уходит на витрину', f: ['F-cancel', 'F-refund'] },
        { a: 'Принят пекарней', b: 'Отменён пекарней', lbl: 'не испекли', who: 'person', by: 'сотрудник пекарни', cond: 'Не испекли или не привезли', fx: 'Возврат денег и извинения покупателю', f: ['F-refund'] },
        { a: 'Собран', b: 'Не выкуплен', lbl: '+30 минут', who: 'timer', by: 'таймер', cond: 'Заказ не оплачен, прошло 30 минут после конца интервала', fx: 'Выпечка — на витрину, остаток растёт', f: ['F-hold'] }
      ],
      info: {
        'Создан': 'Заказ записан, но ещё не оплачен и способ «на месте» не выбран. Кассир его не видит, в план он не попадает.',
        'Оплачен': 'Деньги пришли через «ПэйМост», чек «предоплата» пробит. Покупатель видит код и «Оплачен».',
        'Ждёт оплаты на месте': 'Покупатель заплатит при получении. Держим 30 минут после конца интервала. Отменить можно так же, как оплаченный, — только возвращать нечего.',
        'Принят пекарней': 'Заказ учтён в плане выпечки — его точно испекут. Кассир увидит его перед интервалом.',
        'Собран': 'Пакет собран, покупателю ушло SMS. Ждём покупателя.',
        'Выдан': 'Покупатель забрал заказ, пробит чек полного расчёта. Конечный статус: дальше переходов нет.',
        'Отменён клиентом': 'Покупатель отменил. За 2 часа до интервала и раньше — с возвратом, позже — без. Конечный статус.',
        'Отменён пекарней': 'Пекарня не смогла выполнить заказ. Деньги возвращают. Конечный статус.',
        'Не выкуплен': 'Неоплаченный заказ не забрали за 30 минут после интервала. Выпечка — на витрину. Сюда же попадает несобранный заказ из «Принят пекарней». Конечный статус.'
      }
    },
    cake: {
      t: 'Торт на заказ', vb: [1000, 390], start: 'Заявка', H: 46,
      nodes: { 'Заявка': [36, 178, 120], 'Согласован': [196, 178, 130], 'Предоплачен': [366, 178, 130], 'В производстве': [536, 178, 150], 'Готов': [726, 178, 110], 'Выдан': [872, 96, 110], 'Доставлен': [872, 262, 110], 'Отклонён': [36, 318, 120], 'Отменён': [281, 318, 130] },
      fin: ['Выдан', 'Доставлен', 'Отклонён', 'Отменён'],
      tr: [
        { a: 'Заявка', b: 'Согласован', lbl: 'согласовали', who: 'person', by: 'кассир или кондитер, после проверки системы', cond: 'Есть 48 часов и место в цехе; уточнили начинку, надпись и фото-образец', fx: 'Фото и надпись сохраняются — кондитер увидит их на планшете', f: ['F-cake48', 'F-cakecap', 'F-cakephoto'] },
        { a: 'Заявка', b: 'Отклонён', lbl: 'нет 48 ч или мест', who: 'system', by: 'система', cond: 'До даты меньше 48 часов или на эту дату уже 25 тортов', fx: 'Покупателю предлагают другую дату', f: ['F-cake48', 'F-cakecap'] },
        { a: 'Согласован', b: 'Предоплачен', lbl: 'предоплата 50 %', who: 'system', by: 'система — по уведомлению «ПэйМост»', cond: 'Пришла оплата половины суммы', fx: 'Чек «предоплата» в «КассаПро»', f: ['F-cake48', 'F-54fz'] },
        { a: 'Согласован', b: 'Отменён', lbl: 'передумал', who: 'person', by: 'покупатель', cond: 'Отказался до предоплаты', fx: 'Денег не было — возвращать нечего' },
        { a: 'Предоплачен', b: 'Отменён', lbl: 'отмена', who: 'person', by: 'покупатель', cond: 'Отменил после предоплаты', fx: 'Возвращать ли предоплату и до какого срока — правило не определено: открытый вопрос к Нине Сергеевне' },
        { a: 'Предоплачен', b: 'В производстве', lbl: '«Начать»', who: 'person', by: 'кондитер', cond: 'Кондитер взял торт в работу на планшете цеха', fx: 'Технолог видит загрузку цеха', f: ['F-cakephoto'] },
        { a: 'В производстве', b: 'Готов', lbl: '«Готов»', who: 'person', by: 'кондитер', cond: 'Торт готов', fx: 'SMS покупателю «торт готов»' },
        { a: 'Готов', b: 'Выдан', lbl: 'забрали', who: 'person', by: 'кассир', cond: 'Покупатель доплатил вторые 50 %', fx: 'Чек полного расчёта', f: ['F-54fz'] },
        { a: 'Готов', b: 'Доставлен', lbl: 'доставили', who: 'person', by: 'курьер Лёша', cond: 'Заказ с доставкой: курьер отметил «Доставлено»', fx: 'Доплата и чек — при передаче', f: ['F-delivery'] }
      ],
      info: {
        'Заявка': 'Покупатель или кассир оформил торт. Система проверяет 48 часов и мощность цеха.',
        'Согласован': 'Начинка, надпись и фото-образец уточнены. Ждём предоплату 50 %.',
        'Предоплачен': 'Половина суммы оплачена, чек «предоплата» пробит. Торт стоит в плане цеха.',
        'В производстве': 'Кондитер делает торт, видя фото и надпись на планшете.',
        'Готов': 'Торт готов, покупателю ушло SMS.',
        'Выдан': 'Покупатель забрал торт и доплатил. Конечный статус.',
        'Доставлен': 'Курьер доставил торт. Конечный статус.',
        'Отклонён': 'Система не приняла заявку: мало времени или нет мест. Конечный статус.',
        'Отменён': 'Покупатель отказался. Конечный статус.'
      }
    }
  };
  const smBox = (M, name) => { const [x, y, w] = M.nodes[name]; return { x, y, w, h: M.H, cx: x + w / 2, cy: y + M.H / 2 }; };
  function smClip(b, tx, ty) {
    const dx = tx - b.cx, dy = ty - b.cy; if (!dx && !dy) return { x: b.cx, y: b.cy };
    const s = Math.min((b.w / 2) / Math.abs(dx || 1e-9), (b.h / 2) / Math.abs(dy || 1e-9));
    return { x: b.cx + dx * s, y: b.cy + dy * s };
  }
  const trailHas = (trail, a, b) => trail.some((s, i) => i && trail[i - 1] === a && s === b);
  function smSVG(key, cur, trail, sel) {
    const M = SM[key], [W, H] = M.vb;
    let s = `<svg class="ksys-svg ksys-sm" viewBox="0 0 ${W} ${H}" role="img" aria-label="Диаграмма состояний: ${esc(M.t)}">
      <defs><marker id="ksys-sma-${key}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" style="fill:var(--text-2)"/></marker>
      <marker id="ksys-smo-${key}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" style="fill:var(--accent)"/></marker></defs>`;
    const s0 = smBox(M, M.start);
    s += `<circle cx="${s0.x - 22}" cy="${s0.cy}" r="7" class="ksys-sm-start"/><line x1="${s0.x - 15}" y1="${s0.cy}" x2="${s0.x - 2}" y2="${s0.cy}" class="ksys-sm-ln" marker-end="url(#ksys-sma-${key})"/>`;
    M.tr.forEach((t, i) => {
      const on = trailHas(trail, t.a, t.b), A = smBox(M, t.a), cls = `ksys-sm-t ${on ? 'on' : ''} ${sel === 't' + i ? 'sel' : ''}`;
      const mk = `url(#ksys-sm${on ? 'o' : 'a'}-${key})`, lab = `${WHOI[t.who]} ${t.lbl}`;
      if (t.loop) {
        const x1 = A.x + 34, x2 = A.x + A.w - 34, d = `M${x1} ${A.y} C${x1} ${A.y - 44}, ${x2} ${A.y - 44}, ${x2} ${A.y}`;
        s += `<g class="${cls}" data-tr="${i}" tabindex="0" role="button" aria-label="Переход ${esc(t.a)} → ${esc(t.b)}: ${esc(t.lbl)}"><path class="hit" d="${d}"/><path class="ln" d="${d}" marker-end="${mk}"/><text x="${A.cx}" y="${A.y - 40}" text-anchor="middle" class="lb">${esc(lab)}</text></g>`;
        return;
      }
      const B = smBox(M, t.b), p1 = smClip(A, B.cx, B.cy), p2 = smClip(B, A.cx, A.cy);
      let lx = (p1.x + p2.x) / 2, ly = (p1.y + p2.y) / 2, anc = 'middle';
      if (Math.abs(p1.y - p2.y) < 2) ly = Math.min(A.y, B.y) - 8;
      else if (Math.abs(p1.x - p2.x) < 2) { lx += 8; anc = 'start'; ly += 4; }
      else { const up = p2.y < p1.y, right = p2.x > p1.x; anc = right ? 'start' : 'end'; lx += right ? 9 : -9; ly += up ? 15 : -5; }
      s += `<g class="${cls}" data-tr="${i}" tabindex="0" role="button" aria-label="Переход ${esc(t.a)} → ${esc(t.b)}: ${esc(t.lbl)}"><line class="hit" x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}"/><line class="ln" x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" marker-end="${mk}"/><text x="${lx}" y="${ly}" text-anchor="${anc}" class="lb">${esc(lab)}</text></g>`;
    });
    Object.keys(M.nodes).forEach(name => {
      const b = smBox(M, name), isCur = cur === name, vis = trail.includes(name), fin = M.fin.includes(name);
      const words = name.split(' '), lines = name.length > 15 && words.length > 1 ? [words.slice(0, Math.ceil(words.length / 2)).join(' '), words.slice(Math.ceil(words.length / 2)).join(' ')] : [name];
      s += `<g class="ksys-sm-n ${isCur ? 'cur' : ''} ${vis ? 'vis' : ''} ${fin ? 'fin' : ''} ${/Отмен|Отклон|Не выкуп/.test(name) ? 'neg' : ''} ${sel === 'n' + name ? 'sel' : ''}" data-sn="${esc(name)}" tabindex="0" role="button" aria-label="Статус ${esc(name)}${isCur ? ' — текущий' : ''}">
        ${isCur ? `<rect class="pulse" x="${b.x - 6}" y="${b.y - 6}" width="${b.w + 12}" height="${b.h + 12}" rx="16"/>` : ''}
        <rect class="bx" x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="11"/>${fin ? `<rect class="in" x="${b.x + 3}" y="${b.y + 3}" width="${b.w - 6}" height="${b.h - 6}" rx="8"/>` : ''}
        ${lines.map((ln, j) => `<text x="${b.cx}" y="${b.cy + 5 + (j - (lines.length - 1) / 2) * 15}" text-anchor="middle" class="nt">${esc(ln)}</text>`).join('')}</g>`;
    });
    return s + '</svg>';
  }
  function smCard(key, sel, cur) {
    const M = SM[key];
    if (!sel) return `<div class="ksys-card-empty"><b>Нажмите на стрелку</b> — узнаете, кто переводит ${key === 'order' ? 'заказ' : 'торт'} в следующий статус и при каком условии. <b>Нажмите на статус</b> — что он значит.
      <div class="ksys-legend wide"><span>👤 человек нажимает кнопку</span><span>⚙ система — по событию</span><span>⏰ таймер — по времени</span><span class="fin">двойная рамка — конечный статус</span></div>
      <p class="small muted">Лера проверит тестом каждую стрелку — и каждую <i>ненарисованную</i>: можно ли из «Выдан» вернуться в «Собран»? Нет — значит, система обязана это запрещать. Поэтому статусную модель рисуют до разработки.</p></div>`;
    if (sel[0] === 't') {
      const t = M.tr[+sel.slice(1)];
      return `<div class="ksys-card-h"><span class="ksys-card-ico" aria-hidden="true">${WHOI[t.who]}</span><div><div class="eyebrow">Переход</div><h3>${esc(t.a)} → ${esc(t.b)}</h3></div><button type="button" class="btn ghost xs" data-a="s-x" aria-label="Закрыть">✕</button></div>
        <div class="ksys-trk"><span>Кто переводит</span><b>${WHO[t.who]} — ${esc(t.by)}</b><span>Когда и при каком условии</span><b>${esc(t.cond)}</b><span>Что ещё происходит</span><b>${esc(t.fx)}</b></div>
        ${t.f ? `<div class="ksys-fl"><span class="small dim">Опора — факты блокнота:</span>${facts(t.f, true)}</div>` : ''}`;
    }
    const name = sel.slice(1), from = M.tr.filter(t => t.b === name && t.a !== name).map(t => t.a), to = M.tr.filter(t => t.a === name && t.b !== name).map(t => t.b);
    return `<div class="ksys-card-h"><span class="ksys-card-ico" aria-hidden="true">${M.fin.includes(name) ? '🏁' : '🚦'}</span><div><div class="eyebrow">Статус${cur === name ? ' · текущий' : ''}</div><h3>${esc(name)}</h3></div><button type="button" class="btn ghost xs" data-a="s-x" aria-label="Закрыть">✕</button></div>
      <p>${esc(M.info[name])}</p>
      <div class="ksys-trk"><span>Откуда приходят</span><b>${from.length ? from.map(esc).join(', ') : (name === M.start ? 'это начало' : '—')}</b><span>Куда можно уйти</span><b>${to.length ? to.map(esc).join(', ') : 'никуда — конечный статус'}</b><span>В базе</span><b><code>${key === 'order' ? 'Предзаказ' : 'Торт'}.статус = «${esc(name)}»</code></b></div>`;
  }
  function renderStatus(box) {
    function draw() {
      const key = MEM.st.model, M = SM[key];
      let cur, trail, src;
      if (key === 'order') {
        const S = liveS(), w = worldAt(S, MEM.live.step), V = VARIANTS.find(x => x.id === S.v);
        cur = w.status; trail = w.trail.slice();
        src = cur ? `Подсвечен статус заказа ${CODE} из живого сценария «${esc(V.t)}», шаг ${MEM.live.step}: <b>${esc(cur)}</b>. Зелёные стрелки — путь, который заказ уже прошёл.` : `Заказ ${CODE} в живом сценарии ещё не создан — пройдите несколько шагов, и здесь подсветится его статус.`;
      } else {
        cur = MEM.shop.cakes['Т-031'];
        const chain = ['Заявка', 'Согласован', 'Предоплачен', 'В производстве', 'Готов'];
        trail = chain.slice(0, chain.indexOf(cur) + 1);
        src = `Подсвечен статус торта Т-031 «С юбилеем, мама!» с планшета цеха (вкладка «Экраны»): <b>${esc(cur)}</b>. Отметьте его «Готов» там — и статус сдвинется здесь.`;
      }
      box.innerHTML = `<div class="row between"><div>${segA('s-model', [{ v: 'order', t: '🧺 Предзаказ' }, { v: 'cake', t: '🎂 Торт на заказ' }], key, 'accent')}</div>
          ${key === 'order' ? '<div class="row"><button type="button" class="btn xs" data-a="s-step" data-v="-1">← шаг сценария</button><button type="button" class="btn xs" data-a="s-step" data-v="1">шаг сценария →</button></div>' : ''}</div>
        <p class="small muted">${src}</p>
        <div class="board ksys-board sm">${smSVG(key, cur, trail, MEM.st.sel)}</div>
        <div class="ksys-card">${smCard(key, MEM.st.sel, cur)}</div>
        <details class="more"><summary>Таблица переходов — так её пишут в спецификации</summary><div>${ui.table(['Из статуса', 'В статус', 'Кто', 'Условие', 'Что ещё происходит'], M.tr.map(t => [esc(t.a), esc(t.b), `${WHOI[t.who]} ${esc(t.by)}`, esc(t.cond), esc(t.fx)]))}</div></details>`;
    }
    const draw0 = draw;
    draw = function () {
      const old = TR.$('.ksys-board', box), keep = old ? old.scrollLeft : null, same = box._km === MEM.st.model;
      draw0(); box._km = MEM.st.model;
      const bd = TR.$('.ksys-board', box), c = TR.$('.ksys-sm-n.cur .bx', box);
      if (!bd || bd.scrollWidth <= bd.clientWidth + 4) return;
      if (keep != null && same) { bd.scrollLeft = keep; return; }
      if (c) { const r = c.getBoundingClientRect(), br = bd.getBoundingClientRect(); bd.scrollLeft += (r.left + r.width / 2) - (br.left + br.width / 2); }
    };
    box.addEventListener('click', e => {
      const g = e.target.closest('[data-tr], [data-sn]');
      if (g && box.contains(g)) { MEM.st.sel = g.dataset.tr != null ? 't' + g.dataset.tr : 'n' + g.dataset.sn; draw(); return; }
      const b = e.target.closest('[data-a]'); if (!b || !box.contains(b)) return;
      if (b.dataset.a === 's-model') { MEM.st.model = b.dataset.v; MEM.st.sel = null; }
      else if (b.dataset.a === 's-x') MEM.st.sel = null;
      else if (b.dataset.a === 's-step') { const S = liveS(); MEM.live.step = Math.max(0, Math.min(S.steps.length, MEM.live.step + (+b.dataset.v))); }
      else return;
      draw();
    });
    box.addEventListener('keydown', e => { const g = e.target.closest('[data-tr], [data-sn]'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); g.dispatchEvent(new MouseEvent('click', { bubbles: true })); } });
    draw();
  }

  // =====================================================================
  // Каркас раздела: вкладки, оверлей, встраивание в тренировку
  // =====================================================================
  const VIEWS = [
    { id: 'screens', ico: '📱', t: 'Экраны', r: renderScreens },
    { id: 'map', ico: '🔗', t: 'Как это связано', r: renderMap },
    { id: 'live', ico: '▶', t: 'Живой сценарий', r: renderLive },
    { id: 'data', ico: '📒', t: 'Данные', r: renderData },
    { id: 'status', ico: '🚦', t: 'Статусы', r: renderStatus }
  ];
  const ALIAS = { phone: 'screens', screen: 'screens', flow: 'map', scheme: 'map', arch: 'map', scenario: 'live', play: 'live', db: 'data', tables: 'data', statuses: 'status', states: 'status' };
  const normView = v => { v = String(v || '').toLowerCase(); v = ALIAS[v] || v; return VIEWS.some(x => x.id === v) ? v : null; };
  function demoOrder(upTo) {
    const ph = MEM.ph;
    if (!ph.slot) ph.slot = DEF.slot;
    if (!Object.keys(ph.cart).length) DEF.items.forEach(x => { ph.cart[x.id] = x.q; });
    if (upTo === 'done') { if (!MEM.order) placeOrder('Оплачен'); ph.scr = 'done'; }
    else { ph.scr = upTo === 'sheet' ? 'pay' : upTo; ph.sheet = upTo === 'sheet'; }
  }
  // параметры: строка вида «live/12/fail», «screens/cash/an/offline» или объект { view, step, variant, device, analyst, state }
  function applyOpts(o) {
    if (!o) return null;
    let view = null;
    const seg = typeof o === 'string' ? o.split(/[/:]/) : String(o.view || '').split(/[/:]/);
    view = normView(seg[0]);
    let step = null;
    seg.slice(1).filter(Boolean).forEach(p => {
      if (view === 'map' && N[p]) MEM.map.sel = p;
      else if (/^\d+$/.test(p)) step = +p;
      else if (VARIANTS.some(v => v.id === p)) { MEM.live.variant = p; MEM.live.step = 0; }
      else if (DEVS.some(d => d.v === p)) { MEM.dev = p; MEM.sstate = 'normal'; }
      else if (p === 'an') MEM.analyst = true;
      else if (STATES.some(s => s.v === p)) MEM.sstate = p;
      else if (p === 'cake' || p === 'order' && view === 'status') { MEM.st.model = p; MEM.st.sel = null; }
      else if (['tables', 'order', 'er'].includes(p)) MEM.data.sub = p;
      else if (['where', 'cat', 'pay', 'sheet', 'done'].includes(p)) demoOrder(p);
      else if (/^(10|21|22)[.-]?(30|40)$/.test(p)) { const c = p.replace(/[.-]/, ''); MEM.clock = c.slice(0, 2) + ':' + c.slice(2); }
      else if (N[p]) MEM.map.sel = p;
    });
    if (typeof o === 'object') {
      if (o.variant && VARIANTS.some(v => v.id === o.variant)) { MEM.live.variant = o.variant; MEM.live.step = 0; }
      if (o.device && DEVS.some(d => d.v === o.device)) { MEM.dev = o.device; MEM.sstate = 'normal'; }
      if (o.analyst != null) MEM.analyst = !!o.analyst;
      if (o.state && STATES.some(s => s.v === o.state)) MEM.sstate = o.state;
      if (o.step != null) step = +o.step;
    }
    if (step != null) MEM.live.step = Math.max(0, Math.min(step, liveS().steps.length));
    return view;
  }
  const INTRO = () => `<header class="ksys-head"><div class="eyebrow">Будущая система «Колос» · мини-проект «Квант Софт»</div>
      <h1>Система «Колос» <em>вживую</em></h1>
      <p>Экраны для людей, бэкенд за стеной, база данных и чужие системы — и как они разговаривают, когда покупатель нажимает «Заказать». Здесь всё нажимается.</p></header>
    ${ui.simple({ icon: '🏗', plain: 'Система «Колос» устроена как сама пекарня.', analogy: 'Экраны — витрина и прилавок: их видят люди. Бэкенд — кухня за стеной: там решают и считают. База данных — склад и журнал. Интеграции — договоры с поставщиками: у «ПэйМост», «КассаПро», 1С и SMS-шлюза свои правила.', tech: '<b>Клиент–сервер:</b> экраны (фронтенд) шлют запросы по API на сервер (бэкенд); сервер проверяет правила, пишет в базу и обращается к внешним системам. Аналитик описывает все четыре части.' })}
    <div class="ksys-an4">${[['app', '🪟', 'Экраны', 'витрина и прилавок'], ['orders', '👩‍🍳', 'Бэкенд', 'кухня за стеной'], ['db', '📒', 'База данных', 'склад и журнал'], ['paymost', '🤝', 'Интеграции', 'договоры с поставщиками']].map(x => `<button type="button" data-goto-node="${x[0]}"><span class="i" aria-hidden="true">${x[1]}</span><b>${x[2]}</b><small>${x[3]} →</small></button>`).join('')}</div>`;

  function mount(el, opts) {
    opts = opts || {};
    const views = Array.isArray(opts.only) && opts.only.length ? VIEWS.filter(v => opts.only.map(normView).includes(v.id)) : VIEWS;
    const fromOpts = applyOpts(opts);
    let cur = fromOpts && views.some(v => v.id === fromOpts) ? fromOpts : views.some(v => v.id === MEM.view) ? MEM.view : views[0].id;
    const ov = !!opts.overlay;
    const tabs = views.length > 1 ? `<div class="ksys-tabs" role="tablist" aria-label="Разделы системы">${views.map(v => `<button type="button" class="ksys-tab" role="tab" data-view="${v.id}" aria-selected="${v.id === cur}"><span class="i" aria-hidden="true">${v.ico}</span>${esc(v.t)}</button>`).join('')}</div>` : '';
    el.innerHTML = `<div class="ksys-root ${opts.compact ? 'compact' : ''} ${ov ? 'in-ov' : ''}">
      ${ov ? `<div class="ksys-bar"><span class="ksys-brand"><span aria-hidden="true">🏗</span><span class="lg">Система «Колос»</span></span>${tabs}<button type="button" class="btn sm ksys-x" data-ksys-close aria-label="Закрыть раздел (Esc)">✕<span class="lg"> Закрыть</span></button></div>${INTRO()}`
        : `${opts.compact ? '' : INTRO()}${tabs ? `<div class="ksys-bar flat">${tabs}</div>` : ''}`}
      <div class="ksys-pane"></div></div>`;
    const root = TR.$('.ksys-root', el), pane = TR.$('.ksys-pane', root);
    const inst = {
      el: root,
      get view() { return cur; },
      show(v, o2) {
        let id = normView(v);
        if (typeof v === 'string' && v.includes('/')) id = applyOpts(v) || id;
        if (o2) applyOpts(o2);
        id = id || cur;
        if (!views.some(x => x.id === id)) return;
        const old = pane.firstElementChild; if (old && old._stop) old._stop();
        const switching = id !== cur || !pane.firstElementChild;
        cur = id; MEM.view = id;
        TR.$$('[data-view]', root).forEach(b => b.setAttribute('aria-selected', String(b.dataset.view === id)));
        const tb = TR.$(`[data-view="${id}"]`, root); if (tb && tb.scrollIntoView && tb.parentElement.scrollWidth > tb.parentElement.clientWidth) { try { tb.parentElement.scrollTo({ left: tb.offsetLeft - 40 }); } catch (e) { } }
        const pop = TR.$('.ksys-pop', root); if (pop) pop.remove();
        pane.innerHTML = '';
        const box = document.createElement('div'); box.className = 'ksys-v ksys-v-' + id; pane.appendChild(box);
        try { VIEWS.find(x => x.id === id).r(box, inst); } catch (e) { console.error(e); box.innerHTML = ui.note('bad', 'Не получилось нарисовать раздел', esc(e.message)); }
        if (ov) { try { history.replaceState(null, '', '#system/' + id); } catch (e) { } }
        if (switching && pane.getBoundingClientRect().top < 0) { try { pane.scrollIntoView({ block: 'start' }); } catch (e) { } }
        if (opts.onChange) opts.onChange(id);
      },
      destroy() { const b = pane.firstElementChild; if (b && b._stop) b._stop(); el.innerHTML = ''; }
    };
    root.addEventListener('click', e => {
      const f = e.target.closest('[data-fact]');
      if (f && root.contains(f)) { e.preventDefault(); factPop(root, f); return; }
      const pop = TR.$('.ksys-pop', root);
      if (pop && (e.target.closest('[data-popx]') || !e.target.closest('.ksys-pop'))) pop.remove();
      const t = e.target.closest('[data-view]'); if (t && root.contains(t)) { inst.show(t.dataset.view); return; }
      const g = e.target.closest('[data-goto-node]'); if (g) { MEM.map.sel = g.dataset.gotoNode; inst.show('map'); return; }
      if (e.target.closest('[data-ksys-close]')) close();
    });
    inst.show(cur);
    return inst;
  }

  // ---------- полноэкранный оверлей ----------
  let OV = null;
  function onKey(e) {
    if (e.key !== 'Escape' || !OV) return;
    if (document.querySelector('.modal')) return;
    const pop = TR.$('.ksys-pop', OV.ov); if (pop) { pop.remove(); return; }
    close();
  }
  function open(view) {
    if (OV) { OV.inst.show(typeof view === 'string' ? view : view && view.view, typeof view === 'object' ? view : null); return OV.inst; }
    const ov = TR.el('<div class="ksys-ov" role="dialog" aria-modal="true" aria-label="Система «Колос» вживую"><div class="ksys-ov-in"></div></div>');
    document.body.appendChild(ov);
    const html = document.documentElement;
    OV = { ov, ovf: html.style.overflow, focus: document.activeElement, hash: location.hash };
    html.style.overflow = 'hidden';
    const o = view && typeof view === 'object' ? Object.assign({}, view) : { view };
    o.overlay = true;
    OV.inst = mount(TR.$('.ksys-ov-in', ov), o);
    document.addEventListener('keydown', onKey);
    setTimeout(() => { const x = TR.$('[data-ksys-close]', ov); if (x) try { x.focus({ preventScroll: true }); } catch (e) { } }, 0);
    TR.emit('system', 'open');
    return OV.inst;
  }
  function close() {
    if (!OV) return;
    const o = OV; OV = null;
    const b = TR.$('.ksys-pane', o.ov); if (b && b.firstElementChild && b.firstElementChild._stop) b.firstElementChild._stop();
    document.documentElement.style.overflow = o.ovf;
    o.ov.remove();
    document.removeEventListener('keydown', onKey);
    try { history.replaceState(null, '', o.hash && !/^#system/.test(o.hash) ? o.hash : '#home'); } catch (e) { }
    if (o.focus && o.focus.focus && document.contains(o.focus)) try { o.focus.focus({ preventScroll: true }); } catch (e) { }
    TR.emit('system', 'close');
  }

  TR.system = { open, close, mount, views: VIEWS.map(v => v.id), isOpen: () => !!OV };

  // адрес вида #system/live/12/fail открывает раздел сразу на нужном месте (точный #system открывает app.js)
  const bootHash = (location.hash || '').replace(/^#/, '');
  if (/^system[/:]./.test(bootHash)) setTimeout(() => { if (!OV) open(bootHash.replace(/^system[/:]/, '')); }, 0);
})();
