/* Неделя 5, среда 10:00: аналитик, разработчики и дизайнер.
   Теория: передача задачи — лаборатория «через забор или через груминг + три амиго» (торт с фото: сколько вопросов
   всплыло в спринте, сколько переделок и дней), вопросы в течение дня и журнал решений (соседний пример — химчистка
   «Белый лист»), оценка с тимлидом и владельцем продукта (декомпозиция, риски, спайк); «что, а не как» — тренажёр фразы
   «сделайте на Kafka» и когда «как» всё-таки требование; что нужно дизайнеру — пять состояний экрана, условия работы
   человека, макет и спецификация.
   Практика: 8 вопросов Димы из чата спринта (ответить самому / спросить бизнес / решает команда) с журналом решений;
   переписать «технические указания» в требования и отличить ограничения; лаборатория «спецификация экрана выдачи для
   Сони» с живым макетом по состояниям; Definition of Ready — какие истории брать в спринт; ответ Игорю своими словами. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'devs';

  if (!document.getElementById('devs-css')) document.head.insertAdjacentHTML('beforeend', `<style id="devs-css">
    .devs-root, .devs-root .stack > * { min-width: 0; }
    .devs-root .seg button { white-space: normal; text-align: left; }
    .devs-lbl { font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .devs-lbl.ok { color: var(--ok); } .devs-lbl.bad { color: var(--bad); } .devs-lbl.warn { color: var(--warn); }
    .devs-two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); gap: 16px; align-items: start; }
    .devs-two > * { min-width: 0; }
    .devs-story { border: 1px solid color-mix(in srgb, var(--warn) 45%, var(--border)); background: color-mix(in srgb, var(--warn) 9%, var(--surface)); border-radius: 12px; padding: 10px 14px; font-size: 15px; line-height: 1.5; }
    .devs-story b { color: var(--accent); font-weight: 600; }
    .devs-sws { display: grid; gap: 6px; }
    .devs-sw { display: grid; grid-template-columns: 34px minmax(0, 1fr); gap: 10px; align-items: center; padding: 8px 10px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); text-align: left; color: var(--text); width: 100%; font-size: 14px; line-height: 1.35; }
    .devs-sw .k { width: 34px; height: 20px; border-radius: 99px; background: var(--surface-3); border: 1px solid var(--border-strong); position: relative; }
    .devs-sw .k::after { content: ""; position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: var(--text-muted); transition: left .15s; }
    .devs-sw[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .devs-sw[aria-pressed="true"] .k { background: var(--accent); border-color: var(--accent); }
    .devs-sw[aria-pressed="true"] .k::after { left: 16px; background: var(--surface); }
    .devs-sw small { display: block; color: var(--text-2); font-size: 12.5px; }
    .devs-sw:disabled { opacity: .55; }
    .devs-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
    .devs-stats .stat .v { font-size: 18px; }
    .devs-track { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 4px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface-2); padding: 8px; }
    .devs-col { display: grid; gap: 6px; align-content: start; min-height: 96px; padding: 4px; border-radius: 8px; min-width: 0; }
    .devs-col.sp { background: color-mix(in srgb, var(--warn) 7%, transparent); }
    .devs-col header { font: 600 10.5px/1.25 var(--f-mono); letter-spacing: .04em; text-transform: uppercase; color: var(--text-muted); text-align: center; min-height: 28px; }
    .devs-dots { display: flex; flex-wrap: wrap; gap: 4px; justify-content: center; }
    .devs-dot { width: 26px; height: 26px; border-radius: 50%; display: inline-grid; place-items: center; font: 700 12px/1 var(--f-mono); border: 1.5px solid; background: var(--surface); }
    .devs-dot.ok { color: var(--ok); border-color: var(--ok); background: var(--ok-soft); }
    .devs-dot.info { color: var(--info); border-color: var(--info); background: var(--info-soft); }
    .devs-dot.warn { color: var(--warn); border-color: var(--warn); background: var(--warn-soft); }
    .devs-dot.bad { color: var(--bad); border-color: var(--bad); background: var(--bad-soft); }
    .devs-ql { display: grid; gap: 5px; }
    .devs-q { display: grid; grid-template-columns: 30px minmax(0, 1fr); gap: 8px; align-items: start; font-size: 13.5px; line-height: 1.4; padding: 6px 8px; border-radius: 9px; background: var(--surface); border: 1px solid var(--border); }
    .devs-q .w { color: var(--text-2); font-size: 12.5px; }
    .devs-shelves { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    .devs-shelf { border: 1px solid var(--border); border-radius: 10px; padding: 9px 11px; background: var(--surface); display: grid; gap: 4px; font-size: 13.5px; align-content: start; }
    .devs-shelf b { font: 600 14px/1.3 var(--f-brand); }
    .devs-day { display: grid; gap: 8px; }
    .devs-ev { display: grid; grid-template-columns: 52px minmax(0, 1fr); gap: 10px; border: 1px solid var(--border); border-left: 4px solid var(--border-strong); border-radius: 10px; padding: 9px 12px; background: var(--surface); font-size: 14px; }
    .devs-ev.ok { border-left-color: var(--ok); } .devs-ev.bad { border-left-color: var(--bad); }
    .devs-ev .t { font: 600 13px/1.5 var(--f-mono); color: var(--text-muted); }
    .devs-ev .r { color: var(--text-2); font-size: 13.5px; }
    .devs-bar { position: relative; height: 34px; border-radius: 9px; background: var(--surface-3); border: 1px solid var(--border); overflow: hidden; }
    .devs-bar i { position: absolute; top: 4px; bottom: 4px; border-radius: 6px; background: color-mix(in srgb, var(--warn) 55%, transparent); border: 1px solid var(--warn); transition: left .3s, width .3s; }
    .devs-bar i.ok { background: color-mix(in srgb, var(--ok) 45%, transparent); border-color: var(--ok); }
    .devs-bar span { position: absolute; top: 50%; transform: translateY(-50%); font: 600 12px/1 var(--f-mono); color: var(--text); white-space: nowrap; }
    .devs-axis { display: flex; justify-content: space-between; font: 11px/1.2 var(--f-mono); color: var(--text-muted); }
    .devs-sl { display: grid; gap: 6px; }
    .devs-sli { display: grid; grid-template-columns: 26px minmax(0, 1fr) auto; gap: 8px; align-items: start; border: 1px solid var(--border); border-radius: 9px; padding: 7px 10px; background: var(--surface); font-size: 13.5px; }
    .devs-sli .n { font: 700 12px/1.6 var(--f-mono); color: var(--text-muted); }
    .devs-sli .e { font: 600 12.5px/1.6 var(--f-mono); white-space: nowrap; }
    .devs-sli .u { grid-column: 2 / -1; font-size: 12.5px; }
    .devs-sli .u.warn { color: var(--warn); } .devs-sli .u.info { color: var(--info); } .devs-sli .u.ok { color: var(--ok); }
    .devs-chat { display: grid; gap: 10px; }
    .devs-steps { display: grid; gap: 8px; }
    .devs-req { border: 1px solid var(--ok); background: var(--ok-soft); border-radius: 10px; padding: 10px 12px; font-size: 14.5px; line-height: 1.5; }
    .devs-bad { border: 1px solid var(--bad); background: var(--bad-soft); border-radius: 10px; padding: 10px 12px; font-size: 14.5px; }
    .devs-flips { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; }
    .devs-flip { border: 1px solid var(--border); border-radius: 10px; padding: 10px 12px; background: var(--surface); display: grid; gap: 8px; align-content: start; font-size: 14px; min-width: 0; }
    .devs-flip.ok { border-color: var(--ok); } .devs-flip.bad { border-color: var(--bad); }
    .devs-flip .q { font-weight: 600; }
    .devs-flip .btns { display: flex; flex-wrap: wrap; gap: 6px; }
    .devs-phone { width: 100%; max-width: 300px; margin: 0 auto; border: 2px solid var(--border-strong); border-radius: 26px; padding: 12px 10px 16px; background: var(--surface); display: grid; gap: 8px; min-height: 330px; align-content: start; }
    .devs-phone .bar { display: flex; justify-content: space-between; font: 600 11px/1 var(--f-mono); color: var(--text-muted); padding: 0 6px; }
    .devs-phone h5 { font: 700 16px/1.2 var(--f-brand); padding: 0 6px; }
    .devs-pc { border: 1px solid var(--border); border-radius: 10px; padding: 8px 10px; background: var(--surface-2); display: grid; gap: 2px; font-size: 13px; }
    .devs-pc b { font-size: 14px; }
    .devs-sk { height: 52px; border-radius: 10px; background: linear-gradient(90deg, var(--surface-2), var(--surface-3), var(--surface-2)); background-size: 200% 100%; animation: devs-sk 1.4s linear infinite; }
    @keyframes devs-sk { to { background-position: -200% 0; } }
    .devs-ph-msg { display: grid; gap: 6px; place-items: center; text-align: center; padding: 18px 10px; font-size: 13.5px; color: var(--text-2); }
    .devs-ph-msg .i { font-size: 30px; }
    .devs-ph-err { font: 12px/1.4 var(--f-mono); color: var(--bad); background: var(--bad-soft); border: 1px solid var(--bad); border-radius: 8px; padding: 10px; }
    .devs-ph-ban { font-size: 12.5px; border-radius: 8px; padding: 6px 9px; }
    .devs-ph-ban.warn { background: var(--warn-soft); color: var(--warn); } .devs-ph-ban.ok { background: var(--ok-soft); color: var(--ok); }
    .devs-mini-btn { border-radius: 10px; padding: 9px; font-weight: 600; text-align: center; background: var(--accent); color: var(--accent-text); font-size: 13.5px; }
    .devs-cake { border: 1px solid var(--border-strong); border-radius: 12px; padding: 12px; background: var(--surface); display: grid; gap: 8px; transition: all .2s; }
    .devs-cake .nm { font-weight: 600; transition: font-size .2s; }
    .devs-cake .ctl { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
    .devs-cake .cb { font-size: 12px; display: inline-flex; gap: 5px; align-items: center; color: var(--text-2); }
    .devs-cake .cb i { width: 12px; height: 12px; border: 1px solid var(--border-strong); border-radius: 3px; display: inline-block; }
    .devs-cake .inp { border: 1px solid var(--border-strong); border-radius: 6px; padding: 3px 6px; font-size: 11.5px; color: var(--text-muted); min-width: 110px; }
    .devs-cake .big { border-radius: 12px; padding: 14px 18px; font: 700 18px/1 var(--f-brand); background: var(--ok); color: var(--surface); }
    .devs-cake .flag { border-radius: 8px; padding: 6px 10px; font-weight: 700; background: var(--warn-soft); color: var(--warn); border: 2px solid var(--warn); }
    .devs-callouts { position: relative; }
    .devs-co { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) 26px; gap: 6px; align-items: center; }
    .devs-co > button.n { width: 24px; height: 24px; border-radius: 50%; border: 1px solid var(--accent); background: var(--accent-soft); color: var(--accent); font: 700 12px/1 var(--f-mono); padding: 0; }
    .devs-co > button.n[aria-pressed="true"] { background: var(--accent); color: var(--accent-text); }
    /* чат спринта */
    .devs-msg { display: grid; gap: 8px; border: 1px solid var(--border); border-radius: 12px; padding: 10px 12px; background: var(--surface); }
    .devs-msg.ok { border-color: var(--ok); } .devs-msg.bad { border-color: var(--bad); } .devs-msg.warn { border-color: var(--warn); }
    .devs-msg .hd { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; }
    .devs-msg .hd b { font: 600 13.5px/1.2 var(--f-brand); }
    .devs-msg .hd span { font: 12px/1 var(--f-mono); color: var(--text-muted); }
    .devs-msg .tx { font-size: 14.5px; line-height: 1.45; }
    .devs-ch { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
    .devs-ch select { max-width: 100%; }
    .devs-rep { border-radius: 4px 12px 12px 12px; padding: 8px 11px; background: var(--surface-2); border: 1px solid var(--border); font-size: 13.5px; line-height: 1.45; justify-self: end; max-width: 92%; }
    .devs-rep .who { font: 600 11px/1.4 var(--f-mono); letter-spacing: .06em; text-transform: uppercase; color: var(--accent); }
    .devs-jr { overflow-x: auto; }
    /* переписать указания */
    .devs-rw { border: 1px solid var(--border); border-radius: 12px; padding: 10px 12px; background: var(--surface); display: grid; gap: 8px; }
    .devs-rw.ok { border-color: var(--ok); } .devs-rw.bad { border-color: var(--bad); } .devs-rw.warn { border-color: var(--warn); }
    .devs-rw .src { font-size: 14.5px; line-height: 1.45; padding: 6px 10px; border-left: 3px solid var(--violet); background: var(--violet-soft); border-radius: 0 8px 8px 0; }
    .devs-opt { display: grid; grid-template-columns: 20px minmax(0, 1fr); gap: 8px; align-items: start; padding: 7px 10px; border: 1px solid var(--border); border-radius: 9px; background: var(--surface-2); text-align: left; color: var(--text); width: 100%; font-size: 13.5px; line-height: 1.4; }
    .devs-opt .mk { width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--border-strong); margin-top: 1px; }
    .devs-opt[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .devs-opt[aria-pressed="true"] .mk { border-color: var(--accent); background: var(--accent); box-shadow: inset 0 0 0 3px var(--surface); }
    .devs-opt.ok { border-color: var(--ok); background: var(--ok-soft); } .devs-opt.bad { border-color: var(--bad); background: var(--bad-soft); }
    /* лаборатория экрана */
    .devs-lab { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); gap: 16px; align-items: start; }
    .devs-lab > * { min-width: 0; }
    .devs-blk { border: 1px solid var(--border); border-radius: 12px; padding: 10px 12px; background: var(--surface); display: grid; gap: 6px; }
    .devs-ck { display: grid; grid-template-columns: 20px minmax(0, 1fr); gap: 8px; align-items: start; padding: 6px 8px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface-2); text-align: left; color: var(--text); width: 100%; font-size: 13.5px; line-height: 1.35; }
    .devs-ck .mk { width: 16px; height: 16px; border-radius: 4px; border: 2px solid var(--border-strong); margin-top: 1px; }
    .devs-ck[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .devs-ck[aria-pressed="true"] .mk { background: var(--accent); border-color: var(--accent); }
    .devs-ck.ok { border-color: var(--ok); } .devs-ck.bad { border-color: var(--bad); background: var(--bad-soft); }
    .devs-st { display: grid; gap: 4px; border-top: 1px dashed var(--border); padding-top: 6px; }
    .devs-st:first-of-type { border-top: 0; padding-top: 0; }
    .devs-opt.sm { font-size: 12.5px; padding: 5px 8px; }
    .devs-tab { border: 2px solid var(--border-strong); border-radius: 18px; background: var(--surface); padding: 10px; display: grid; gap: 8px; position: sticky; top: 64px; }
    .devs-tb-top { display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; font: 600 12px/1.3 var(--f-mono); color: var(--text-2); }
    .devs-tb-net { padding: 3px 8px; border-radius: 99px; background: var(--ok-soft); color: var(--ok); }
    .devs-tb-net.off { background: var(--warn-soft); color: var(--warn); }
    .devs-tb-body { display: grid; grid-template-columns: minmax(0, 1fr) 118px; gap: 8px; align-items: start; min-height: 230px; }
    .devs-tb-body.nopad { grid-template-columns: minmax(0, 1fr); }
    .devs-tb-list { display: grid; gap: 6px; align-content: start; min-width: 0; }
    .devs-oc { border: 1px solid var(--border); border-radius: 10px; padding: 7px 9px; background: var(--surface-2); display: grid; gap: 4px; font-size: 12.5px; min-width: 0; }
    .devs-oc .cd { font: 700 19px/1 var(--f-mono); letter-spacing: .03em; }
    .devs-oc .ln { display: flex; flex-wrap: wrap; gap: 4px 8px; align-items: center; }
    .devs-oc .pay { font-weight: 600; } .devs-oc .pay.due { color: var(--warn); } .devs-oc .pay.ok { color: var(--ok); }
    .devs-oc .bx { display: flex; gap: 5px; flex-wrap: wrap; }
    .devs-b { border-radius: 8px; font-weight: 700; background: var(--accent); color: var(--accent-text); text-align: center; }
    .devs-b.big { padding: 9px 12px; font-size: 14px; flex: 1 1 auto; }
    .devs-b.sml { padding: 2px 6px; font-size: 10px; }
    .devs-b.alt { background: var(--surface-3); color: var(--text); border: 1px solid var(--border-strong); }
    .devs-pad { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 4px; align-content: start; }
    .devs-pad span { border-radius: 8px; background: var(--surface-3); border: 1px solid var(--border-strong); text-align: center; font: 700 15px/30px var(--f-mono); }
    .devs-pad .dsp { grid-column: 1 / -1; font: 700 15px/30px var(--f-mono); text-align: center; border-radius: 8px; border: 1px solid var(--border-strong); background: var(--surface-2); }
    .devs-inp { border: 1px solid var(--border-strong); border-radius: 6px; padding: 4px 8px; font-size: 11px; color: var(--text-muted); background: var(--surface-2); }
    .devs-hole { outline: 2px dashed var(--bad); outline-offset: 2px; border-radius: 8px; }
    .devs-holeT { font-size: 12px; color: var(--bad); background: var(--bad-soft); border-radius: 7px; padding: 4px 8px; line-height: 1.35; }
    .devs-goodT { font-size: 12px; color: var(--ok); background: var(--ok-soft); border-radius: 7px; padding: 4px 8px; line-height: 1.35; }
    .devs-scr-msg { display: grid; gap: 6px; place-items: center; text-align: center; padding: 22px 10px; border-radius: 10px; background: var(--surface-2); font-size: 13.5px; }
    .devs-scr-msg .i { font-size: 28px; }
    .devs-scr-msg.white { background: var(--surface); color: transparent; min-height: 150px; border: 1px dashed var(--border); }
    .devs-scr-msg.err { background: var(--bad-soft); color: var(--bad); font-family: var(--f-mono); }
    .devs-ov { display: grid; gap: 6px; place-items: center; min-height: 150px; border-radius: 10px; background: var(--scrim); color: var(--text); font-weight: 600; }
    .devs-done { display: grid; place-items: center; gap: 6px; padding: 24px 10px; border-radius: 12px; background: var(--ok-soft); border: 2px solid var(--ok); color: var(--ok); font: 700 22px/1.2 var(--f-brand); text-align: center; }
    .devs-modal { display: grid; gap: 8px; place-items: center; padding: 16px; border-radius: 12px; border: 1px solid var(--border-strong); background: var(--surface-2); box-shadow: var(--shadow); font-size: 13px; text-align: center; }
    .devs-holes { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
    .devs-root .devs-tabsel { display: flex; flex-wrap: wrap; gap: 4px; }
    .devs-tabsel button { border: 1px solid var(--border); background: var(--surface-2); color: var(--text-2); border-radius: 8px; padding: 4px 8px; font-size: 12.5px; font-weight: 600; }
    .devs-tabsel button[aria-pressed="true"] { border-color: var(--accent); color: var(--accent); background: var(--accent-soft); }
    .devs-tabsel button.h { border-color: var(--bad); color: var(--bad); }
    .devs-tabsel button.h[aria-pressed="true"] { background: var(--bad-soft); }
    /* готовность историй */
    .devs-dor { display: grid; gap: 3px; font-size: 13px; }
    .devs-dor > div { display: grid; grid-template-columns: 96px minmax(0, 1fr); gap: 8px; }
    .devs-dor .k { color: var(--text-muted); font: 600 10.5px/1.6 var(--f-mono); letter-spacing: .05em; text-transform: uppercase; }
    .devs-cap { display: grid; gap: 6px; }
    .devs-mhint { display: none; }
    @media (max-width: 860px) { .devs-two, .devs-lab { grid-template-columns: minmax(0, 1fr); } .devs-tab { position: static; } .devs-mhint { display: block; position: sticky; top: 56px; z-index: 2; } }
    @media (max-width: 620px) {
      .devs-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .devs-shelves { grid-template-columns: minmax(0, 1fr); }
      .devs-col header { font-size: 9.5px; letter-spacing: 0; }
      .devs-dot { width: 22px; height: 22px; font-size: 11px; }
      .devs-tb-body { grid-template-columns: minmax(0, 1fr); }
      .devs-pad { grid-template-columns: repeat(6, minmax(0, 1fr)); }
      .devs-pad .dsp { grid-column: 1 / -1; }
      .devs-dor > div { grid-template-columns: minmax(0, 1fr); gap: 0; }
    }
  </style>`);

  const chip = (t, k) => `<span class="chip ${k || ''}">${t}</span>`;
  const half = x => (Math.round(x * 2) / 2).toLocaleString('ru-RU');
  const sysBtn = (view, t) => `<button type="button" class="btn sm" data-sys="${esc(view)}">🥐 ${esc(t || 'Открыть систему «Колос»')}</button>`;
  const bindSys = el => TR.on(el, 'click', '[data-sys]', (e, b) => { if (TR.system) TR.system.open(b.dataset.sys); else ui.toast('Живая система «Колос» не подключена в этом окне', 'warn'); });

  // =====================================================================
  // Теория 1. Передача задачи: через забор или через груминг
  // =====================================================================
  const HO_PR = [
    { id: 'groom', t: 'Груминг за неделю до спринта', s: 'аналитик, Дима и Лера разбирают историю; вопросы к Нине и Галине Ивановне уходят заранее', cost: '1,5 часа команды' },
    { id: 'amigos', t: 'Три амиго в первый день', s: 'аналитик + разработчик + Лера, 30 минут над историей', cost: '30 минут на троих' },
    { id: 'examples', t: 'Критерии с примерами на границах', s: '47 / 48 / 49 часов до праздника, 25-й и 26-й торт', cost: '1 час аналитика' },
    { id: 'mock', t: 'Макет Сони со всеми состояниями', s: 'фото не загрузилось, лимит исчерпан, нет связи', cost: 'полдня Сони' },
    { id: 'daily', t: 'Ответы в течение дня + журнал решений', s: '«не знаю — узнаю к 15:00», решения записаны', cost: 'аналитик на связи' }
  ];
  const HO_ST = [
    { id: 'pre', t: 'До спринта' }, { id: 'start', t: 'День 1' }, { id: 'dev', t: 'Разработка', sp: 1 },
    { id: 'test', t: 'Тест у Леры', sp: 1 }, { id: 'demo', t: 'Демо у Нины', sp: 1 }
  ];
  const HO_ORD = HO_ST.map(s => s.id);
  const HO_Q = [
    { n: 1, t: 'А если до праздника меньше 48 часов? А ровно 48?', who: 'Лера', c: [['examples', 'pre'], ['amigos', 'start']], late: 'test' },
    { n: 2, t: 'А если на эту дату уже 25 тортов?', who: 'бэкенд', c: [['groom', 'pre'], ['examples', 'pre'], ['amigos', 'start']], late: 'demo' },
    { n: 3, t: 'Фото не загрузилось — что видит покупатель?', who: 'Соня', c: [['mock', 'pre'], ['amigos', 'start']], late: 'test' },
    { n: 4, t: 'Сколько знаков надписи помещается на торт?', who: 'фронтенд', c: [['groom', 'pre']], late: 'dev', biz: 'Галина Ивановна' },
    { n: 5, t: 'Клиент отменил после предоплаты 50 % — возвращаем?', who: 'Лера', c: [['groom', 'pre']], late: 'demo', biz: 'Нина Сергеевна' },
    { n: 6, t: 'Какой чек при предоплате — «предоплата» по 54-ФЗ?', who: 'бэкенд', c: [['groom', 'pre'], ['amigos', 'start']], late: 'test' },
    { n: 7, t: 'Кто переводит торт в «Готов» — кондитер или технолог?', who: 'бэкенд', c: [['groom', 'pre']], late: 'dev', biz: 'Галина Ивановна' },
    { n: 8, t: 'В цехе пропала связь — кондитер видит фото и надпись?', who: 'фронтенд', c: [['mock', 'pre'], ['amigos', 'start']], late: 'demo' },
    { n: 9, t: 'Фото с iPhone в формате HEIC не открывается на планшете цеха', who: 'фронтенд', c: [], late: 'dev' }
  ];
  const PR_NAME = { groom: 'на груминге', amigos: 'на трёх амиго', examples: 'когда писали примеры', mock: 'когда Соня рисовала состояния' };
  function hoRun(on) {
    return HO_Q.map(q => {
      let st = q.late, by = null;
      q.c.forEach(([p, s]) => { if (on[p] && HO_ORD.indexOf(s) < HO_ORD.indexOf(st)) { st = s; by = p; } });
      let cost = 0, txt = '', k = 'ok';
      if (st === 'pre') txt = `Всплыл ${PR_NAME[by]}. ${q.biz ? `Ответ ${q.biz === 'Нина Сергеевна' ? 'Нины Сергеевны' : 'Галины Ивановны'} пришёл до спринта.` : 'Ответ готов до спринта.'}`;
      else if (st === 'start') { txt = 'Всплыл на трёх амиго: обсудили за пять минут, записали в критерии.'; k = 'info'; }
      else if (st === 'dev') {
        cost = on.daily ? 0.25 : 1; k = 'warn';
        txt = q.biz ? `Разработчик ждёт, что скажет ${q.biz}. ${on.daily ? 'Аналитик: «узнаю к 15:00» — ответ в тот же день.' : 'Ответ пришёл на следующий день — или разработчик угадал сам.'}`
          : on.daily ? 'Спросили в чате — аналитик и команда решили за пару часов, записали в журнал.' : 'Спросили в чате, ответа нет до завтра. Разработчик сделал «как сам понял».';
      } else if (st === 'test') { cost = 1; k = 'bad'; txt = 'Лера нашла на тесте. Код уже написан — переделка, 1 день.'; }
      else { cost = 2; k = 'bad'; txt = 'Нина увидела на демо: «Это не то». История не принята, переделка в следующем спринте — 2 дня.'; }
      return { q, st, cost, txt, k };
    });
  }
  function drawHandoff(pane, ctx) {
    const a = ctx.ans || {}; const on = Object.assign({}, a.ho || {});
    pane.innerHTML = `<div class="stack">
      <div class="devs-story"><span class="devs-lbl">История в спринте · план 8 дней</span><div><b>Как</b> покупатель, <b>я хочу</b> заказать торт с фото-образцом и надписью, <b>чтобы</b> получить именно тот торт, который задумал.</div></div>
      <div class="row"><button type="button" class="btn sm" data-pre="fence">🧱 Через забор</button><button type="button" class="btn sm" data-pre="all">🤝 Груминг + три амиго</button><span class="small dim">или включайте практики по одной</span></div>
      <div class="devs-two">
        <div class="devs-sws" data-sws></div>
        <div class="stack tight"><div class="devs-stats" data-st></div><div class="devs-track" data-tr></div></div>
      </div>
      <details class="more"><summary>Какие вопросы всплыли и где</summary><div class="devs-ql" data-ql></div></details>
      <div data-verdict></div>
    </div>`;
    function draw() {
      TR.$('[data-sws]', pane).innerHTML = HO_PR.map(p => `<button type="button" class="devs-sw" data-p="${p.id}" aria-pressed="${!!on[p.id]}"><span class="k" aria-hidden="true"></span><span><b>${esc(p.t)}</b><small>${esc(p.s)} · цена: ${esc(p.cost)}</small></span></button>`).join('');
      const run = hoRun(on);
      const inSprint = run.filter(r => ['dev', 'test', 'demo'].includes(r.st)).length;
      const redo = run.filter(r => ['test', 'demo'].includes(r.st)).length;
      const extra = run.reduce((s, r) => s + r.cost, 0), demo = run.some(r => r.st === 'demo');
      TR.$('[data-st]', pane).innerHTML = `<div class="stat"><span class="k">В спринте</span><span class="v ${inSprint > 3 ? 'bad' : inSprint > 1 ? 'warn' : 'ok'}">${inSprint}</span><span class="s">вопросов всплыло</span></div>
        <div class="stat"><span class="k">Переделки</span><span class="v ${redo ? 'bad' : 'ok'}">${redo}</span><span class="s">после кода</span></div>
        <div class="stat"><span class="k">Срок</span><span class="v ${extra > 3 ? 'bad' : extra > 1 ? 'warn' : 'ok'}">${half(8 + extra)}</span><span class="s">дней из 8</span></div>
        <div class="stat"><span class="k">Демо</span><span class="v ${demo ? 'bad' : 'ok'}">${demo ? '✕' : '✓'}</span><span class="s">${demo ? 'не принято' : 'принято'}</span></div>`;
      TR.$('[data-tr]', pane).innerHTML = HO_ST.map(s => `<div class="devs-col ${s.sp ? 'sp' : ''}"><header>${esc(s.t)}</header><div class="devs-dots">${run.filter(r => r.st === s.id).map(r => `<span class="devs-dot ${r.k}" title="${esc(r.q.t)}">${r.q.n}</span>`).join('')}</div></div>`).join('');
      TR.$('[data-ql]', pane).innerHTML = run.map(r => `<div class="devs-q"><span class="devs-dot ${r.k}">${r.q.n}</span><div><b>«${esc(r.q.t)}»</b> <span class="w">— спросил(а): ${esc(r.q.who)}</span><div class="w">${esc(r.txt)}${r.cost ? ` <b>+${half(r.cost)} дн.</b>` : ''}</div></div></div>`).join('');
      const n = HO_PR.filter(p => on[p.id]).length;
      TR.$('[data-verdict]', pane).innerHTML = n === 0
        ? ui.note('bad', 'Через забор', `Аналитик написал постановку и «перекинул» её разработчикам. Все девять вопросов всё равно прозвучали — только поздно: ${inSprint} в спринте, ${redo} после того, как код уже написан. Вместо 8 дней — ${half(8 + extra)}.`)
        : n === HO_PR.length ? ui.note('ok', 'Груминг + три амиго', `Вопросы те же, но почти все заданы до кода. Остался один, которого никто не мог предвидеть (формат фото с iPhone), — и на него ответили в тот же день. Цена — около трёх часов разговоров вместо 12 дней переделок и ожидания.`)
          : ui.note('info', 'Смотрите, какой вопрос куда сдвинулся', 'Каждая практика ловит свои вопросы. Вопросы к бизнесу ловит только груминг: Нине и Галине Ивановне нужно время на ответ. Вопросы, которых никто не предвидел, будут всегда — их спасают быстрые ответы в течение дня.');
    }
    TR.on(pane, 'click', '[data-p]', (e, b) => { on[b.dataset.p] = !on[b.dataset.p]; if (ctx.ans) { ctx.ans.ho = Object.assign({}, on); ctx.save(); } draw(); });
    TR.on(pane, 'click', '[data-pre]', (e, b) => { HO_PR.forEach(p => { on[p.id] = b.dataset.pre === 'all'; }); if (ctx.ans) { ctx.ans.ho = Object.assign({}, on); ctx.save(); } draw(); });
    draw();
  }

  const DAY = [
    { at: '10:05', q: 'Сколько дней храним готовую вещь бесплатно?', kind: 'req', sh: 'Ответ есть в требованиях',
      bad: ['Аналитик на встречах до вечера, ответ в 17:40.', 'Разработчик не дождался и поставил 14 дней «как в прошлом проекте». В требованиях — 30.'],
      good: ['«Есть в требованиях: 30 дней, раздел „Хранение“, пункт 4». Ответ за две минуты со ссылкой.', 'Сделано правильно с первого раза.'],
      j: ['Хранение готовой вещи', '30 дней бесплатно', 'требования, раздел «Хранение»'] },
    { at: '11:20', q: 'Пятно не вывелось — клиент платит полную цену?', kind: 'biz', sh: 'Решает бизнес',
      bad: ['«Сделайте пока как думаете, потом поправим».', 'Разработчик решил: скидка 50 %. На демо владелица: «С чего вдруг? Мы просто не берём доплату за выведение пятен». Переделка.'],
      good: ['«Не знаю — это решает владелица. Узнаю и отвечу до 15:00. Пока делайте остальное».', 'В 14:30 владелица ответила. Решение — в журнал и в критерии приёмки.'],
      j: ['Пятно не вывелось', 'доплату за выведение не берём, остальное по прайсу', 'владелица, чат 14:30'] },
    { at: '13:40', q: 'Фото вещей храним в базе или в файловом хранилище?', kind: 'team', sh: 'Решает команда',
      bad: ['«Берите базу, я так привык».', 'Аналитик решил за команду. Через месяц база распухла, переносить фото — неделя работы.'],
      good: ['«Это ваше решение. От меня — требование: до 10 фото на заказ, видны 90 дней после выдачи».', 'Команда выбрала способ сама и знает, под какие условия.'],
      j: ['Хранение фото', 'решает команда; требование: до 10 фото, 90 дней', 'тимлид'] },
    { at: '16:10', q: 'А почему за пятно нет скидки? Кто так решил?', kind: 'log', sh: 'Журнал решений',
      bad: ['Через неделю никто не помнит: в чате 400 сообщений.', 'Спор на полчаса и второй звонок владелице.'],
      good: ['Ссылка на запись в журнале решений — ответ за минуту.', 'Решение не пересматривают случайно: видно, кто и когда решил.'] }
  ];
  function drawDay(pane) {
    let mode = 'bad';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Соседний пример — приложение химчистки «Белый лист». Один день аналитика в спринте: вопросы от разработчиков приходят в чат. Переключите, как отвечать.</p>
      <div class="devs-shelves">
        <div class="devs-shelf"><span>📗</span><b>Ответ есть в требованиях</b><span class="small muted">Отвечаю сразу и даю ссылку. Если ответ «есть», но его не нашли — значит, требование надо сделать заметнее.</span></div>
        <div class="devs-shelf"><span>📮</span><b>Решает бизнес</b><span class="small muted">«Не знаю — узнаю к 15:00». Спрашиваю владельца правила, не решаю за него, ответ записываю.</span></div>
        <div class="devs-shelf"><span>🔧</span><b>Решает команда</b><span class="small muted">Это «как сделать». Аналитик даёт требование и условия, способ выбирают разработчики.</span></div>
      </div>
      ${ui.seg('dm', [{ v: 'bad', t: '✕ Как ломается' }, { v: 'good', t: '✓ Как правильно' }], mode, 'accent')}
      <div class="devs-day" data-day></div>
      <div data-jr></div>
    </div>`;
    function draw() {
      TR.$('[data-day]', pane).innerHTML = DAY.map(d => `<div class="devs-ev ${mode === 'good' ? 'ok' : 'bad'}"><span class="t">${d.at}</span><div class="stack tight"><div><b>«${esc(d.q)}»</b> ${chip(esc(d.sh), d.kind === 'biz' ? 'warn' : d.kind === 'team' ? 'info' : d.kind === 'log' ? '' : 'ok')}</div><div>${esc(d[mode][0])}</div><div class="r">→ ${esc(d[mode][1])}</div></div></div>`).join('');
      TR.$('[data-jr]', pane).innerHTML = mode === 'good'
        ? `<div class="eyebrow">Журнал решений · химчистка</div>${ui.table(['Когда', 'Вопрос', 'Решение', 'Кто решил, источник'], DAY.filter(d => d.j).map(d => [d.at, esc(d.j[0]), esc(d.j[1]), esc(d.j[2])]))}<p class="small muted">Журнал — простая таблица в Confluence или прямо в задаче. Главное — одна запись на решение, дата, кто решил и где об этом сказано.</p>`
        : ui.note('bad', 'Итог дня', 'Два разработчика угадали, одно решение принял аналитик за команду, ничего не записано. Каждое «потом поправим» — день переделки через неделю.');
    }
    ui.onSeg(pane, (n, v) => { if (n === 'dm') { mode = v; draw(); } });
    draw();
  }

  const EST = [
    { id: 's1', t: 'Заявка на торт: не раньше чем за 48 часов, не больше 25 тортов в день', r0: [4, 6], val: 1 },
    { id: 's2', t: 'Фото-образец и надпись — на планшете кондитера', r0: [3, 8], r1: [4, 5], unk: 'Фото с телефонов бывают тяжёлыми и в формате HEIC — откроет ли их планшет цеха, никто не проверял', val: 3 },
    { id: 's3', t: 'Предоплата 50 % и чек «предоплата» через «КассаПро»', r0: [5, 15], r1: [6, 8], unk: 'Как API «КассаПро» проводит предоплату — песочницу вендора ещё не смотрели', risk: 'Сертификация «КассаПро» — 3 недели. Идёт параллельно, но держит дату запуска', val: 2 },
    { id: 's4', t: 'Статусы торта и SMS «Готов»', r0: [3, 5], val: 4 }
  ];
  function drawEstimate(pane) {
    const s = { cut: false, risk: false, spike: false, order: false };
    pane.innerHTML = `<div class="stack">
      <div class="devs-story"><span class="devs-lbl">Эпик на оценке</span><div>Торты через приложение: фото-образец, надпись, предоплата 50 %, проверка 48 часов и лимита 25 тортов в день.</div></div>
      <div class="row" data-btns></div>
      <div class="stack tight"><div class="devs-bar" data-bar></div><div class="devs-axis"><span>0</span><span>10</span><span>20</span><span>30</span><span>40 дней</span></div></div>
      <div data-who></div>
      <div class="devs-sl" data-sl></div>
      ${ui.note('info', 'Часы или сторипоинты?', 'Единого мнения нет. Одни команды оценивают в часах и днях, другие — в сторипоинтах: условных единицах сложности относительно знакомой задачи. Важнее другое: оценивает тот, кто делает, — Дима с командой. Аналитик не называет срок за разработчиков, он делает задачу оцениваемой.')}
    </div>`;
    function rng() {
      if (!s.cut) return [10, 40];
      let lo = 0, hi = 0;
      EST.forEach(x => { const r = s.spike && x.r1 ? x.r1 : x.r0; lo += r[0]; hi += r[1]; });
      if (s.spike) { lo += 2; hi += 2; }
      return [lo, hi];
    }
    function draw() {
      const B = [['cut', '✂ Разрезать на части', true], ['risk', '⚠ Назвать риски', s.cut], ['spike', '🔦 Неизвестное — в спайк', s.cut], ['order', '👑 Нина выбирает порядок', s.cut]];
      TR.$('[data-btns]', pane).innerHTML = B.map(([k, t, en]) => `<button type="button" class="btn sm" data-es="${k}" aria-pressed="${s[k]}" ${en ? '' : 'disabled'}>${t}</button>`).join('');
      const [lo, hi] = rng(), X = v => Math.min(100, v / 42 * 100);
      TR.$('[data-bar]', pane).innerHTML = `<i class="${hi - lo <= 8 ? 'ok' : ''}" style="left:${X(lo)}%;width:${Math.max(2, X(hi) - X(lo))}%"></i><span style="left:${Math.min(70, X(lo) + 1)}%">${lo}–${hi} дней${s.spike ? ' (вкл. спайк 2 дня)' : ''}</span>`;
      const who = !s.cut ? ui.say('dima', 'Целиком? От двух недель до двух месяцев. Честно — не знаю: там касса, фото, лимиты… Разрежьте — оценю по частям.')
        : !s.spike ? ui.say('dima', s.risk ? 'Риски вижу. Но разброс по фото и по «КассаПро» всё ещё большой: это не оценка, а гадание. Дайте два дня разведки.' : 'Уже лучше. Но про фото и «КассаПро» я по-прежнему гадаю.')
          : ui.say('dima', 'После спайка разброс узкий — под это можно планировать спринты. Сертификацию «КассаПро» Игорь заложит отдельно.');
      TR.$('[data-who]', pane).innerHTML = who + (s.order ? ui.say('nina', 'Первой — заявка с 48 часами и лимитом: без неё к 8 Марта снова потеряем торты. Потом предоплата, потом фото, SMS — последним.') : '');
      const list = s.order ? EST.slice().sort((x, y) => x.val - y.val) : EST;
      TR.$('[data-sl]', pane).innerHTML = !s.cut ? '<p class="small dim">Пока это один большой кусок — «батон целиком».</p>'
        : `<div class="eyebrow">Части эпика${s.order ? ' · в порядке ценности' : ''}</div>` + list.map((x, i) => {
          const r = s.spike && x.r1 ? x.r1 : x.r0;
          return `<div class="devs-sli"><span class="n">${s.order ? i + 1 : '·'}</span><span>${esc(x.t)}</span><span class="e">${r[0]}–${r[1]} дн.</span>
            ${s.risk && x.unk && !s.spike ? `<span class="u warn">Неизвестно: ${esc(x.unk)}</span>` : ''}
            ${s.spike && x.unk ? `<span class="u info">Спайк ответил: проверили в песочнице — разброс сузился</span>` : ''}
            ${s.risk && x.risk ? `<span class="u warn">Риск: ${esc(x.risk)}</span>` : ''}</div>`;
        }).join('') + (s.spike ? `<div class="devs-sli"><span class="n">🔦</span><span>Спайк: два дня разведки — загрузить фото HEIC на планшет цеха и провести предоплату в песочнице «КассаПро»</span><span class="e">2 дн.</span></div>` : '');
    }
    TR.on(pane, 'click', '[data-es]', (e, b) => { const k = b.dataset.es; s[k] = !s[k]; if (k === 'cut' && !s.cut) { s.risk = s.spike = s.order = false; } draw(); });
    draw();
  }

  const howHandoff = {
    id: 'how-handoff', covers: ['chat', 'dor', 'why'], title: 'Как это работает: передача задачи — не через забор', free: true, noReset: true,
    simple: {
      icon: '🤝',
      plain: 'Задачу мало написать — её надо передать так, чтобы вопросы прозвучали до того, как написан код. Вопросы всё равно будут. Вопрос только — когда: на разговоре до спринта ответ стоит минуты, на тесте и на демо — дни переделки.',
      analogy: 'Кондитеру можно сунуть под дверь листок «торт на субботу, шоколадный». А можно за пять минут до начала вместе прочитать заказ: «надпись поместится? фото есть? предоплату взяли?». Вопросы те же — только торт не придётся перепекать.',
      tech: '<b>Передача задачи</b> (handoff) «через забор» — документ уходит дальше без разговора. Лучше: <b>уточнение бэклога</b> (refinement, «груминг») за неделю-две до спринта, <b>три амиго</b> (аналитик или владелец продукта + разработчик + тестировщик) перед стартом, <b>спецификация на примерах</b> (Гойко Аджич), ответы в течение дня и <b>журнал решений</b>. Готовность истории к спринту команда фиксирует в <b>Definition of Ready</b>. Оценку даёт команда; аналитик помогает разрезать задачу, назвать риски и вынести неизвестное в <b>спайк</b> — короткую разведку.'
    },
    lead: ui.brief({
      situation: 'Второй спринт. Команда Димы делает заказ торта через приложение. Сравните два пути одной и той же истории: аналитик «перекидывает» постановку через забор — или включает груминг, три амиго, примеры, макет со всеми состояниями и быстрые ответы.',
      todo: [
        'Вкладка «Через забор или через груминг»: нажмите «🧱 Через забор», затем «🤝 Груминг + три амиго». Потом включайте практики по одной и смотрите, какой вопрос куда сдвигается на дорожке.',
        'Вкладка «Вопрос в течение дня»: переключите «Как ломается» и «Как правильно» и сравните итог дня.',
        'Вкладка «Оценка»: нажимайте кнопки по порядку — разрезать, назвать риски, спайк, порядок от Нины — и следите за полосой разброса.'
      ],
      look: 'Кружок с номером — вопрос. Зелёный — найден до спринта, синий — в первый день, жёлтый — в разработке, красный — после кода. Числа дней — модель для учёбы, а не замер. Позиция аналитика: он ведёт задачу до приёмки — готовит груминг, собирает трёх амиго, отвечает в течение дня и записывает решения.'
    }),
    render(el, ctx) {
      el.classList.add('devs-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'ho', t: 'Через забор или через груминг', render: p => drawHandoff(p, ctx) },
        { id: 'day', t: 'Вопрос в течение дня', render: drawDay },
        { id: 'est', t: 'Оценка: Дима, Нина и неизвестное', render: drawEstimate }
      ], 'ho');
    }
  };

  // =====================================================================
  // Теория 2. «Что», а не «как»
  // =====================================================================
  const KAFKA = [
    { q: 'Галина Ивановна, что для вас важно, когда предзаказы уходят в цех?', a: 'Чтобы ни один не потерялся по дороге. Я в 23:00 фиксирую план выпечки.' },
    { q: 'А что будет, если заказ потеряется?', a: 'Его нет в плане — круассаны утром не испекут. Покупатель придёт к пустой полке, а деньги уже заплатил.' },
    { q: 'А если в 23:00 планшет в цехе без связи?', a: 'План должен загрузиться, как только связь появится. Ни один принятый заказ не должен пропасть.' }
  ];
  const KAFKA_REQ = 'Все предзаказы на завтра, принятые до 22:30, входят в план выпечки, который фиксируется в 23:00. Если планшет цеха без связи, план загружается, как только связь появится; ни один принятый заказ не теряется.';
  function drawKafka(pane) {
    let step = 0, eyes = false;
    pane.innerHTML = `<div class="stack">
      <div class="devs-bad"><span class="devs-lbl bad">В постановке стажёра</span><div>«Заказы в цех передавать через Kafka».</div></div>
      <div class="row"><button type="button" class="btn sm primary" data-k="next">Спросить Галину Ивановну →</button><button type="button" class="btn sm ghost" data-k="reset">⟲ Сначала</button><label class="toggle"><input type="checkbox" data-k="eyes"> <span>Глазами Димы</span></label></div>
      <div class="devs-steps" data-ks></div>
      <div data-ke></div>
    </div>`;
    function draw() {
      let h = KAFKA.slice(0, step).map(x => ui.say('me', esc(x.q)) + ui.say('galya', esc(x.a))).join('');
      if (step > KAFKA.length - 1) h += `<div class="devs-req"><span class="devs-lbl ok">Требование: что и зачем</span><div>${esc(KAFKA_REQ)}</div></div>`;
      if (!step) h = '<p class="small dim">Kafka — программа-очередь для передачи сообщений между частями системы. Хорошая. Но это <b>способ</b>. Чтобы найти цель, аналитик идёт к тому, кому это нужно, — к Галине Ивановне — и спрашивает «зачем» и «что будет, если…». Нажмите кнопку.</p>';
      TR.$('[data-ks]', pane).innerHTML = h;
      TR.$('[data-ke]', pane).innerHTML = !eyes ? '' : step < KAFKA.length
        ? ui.say('dima', 'Kafka? У нас её нет: это отдельный сервер, настройка, дежурства — плюс недели работы. И я не понимаю, что вам на самом деле нужно. Может, хватит обычной таблицы в базе?')
        : ui.say('dima', 'Вот теперь понятно: правило 22:30, план в 23:00 и ни одного потерянного заказа. Сделаем таблицей заказов и задачей по расписанию — способ выберем сами. А Лера проверит на 22:29 и 22:31 и с выключенной связью.');
      const b = TR.$('[data-k="next"]', pane); if (b) b.disabled = step >= KAFKA.length;
    }
    pane.addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (!b || b.tagName === 'INPUT') return; if (b.dataset.k === 'next') step = Math.min(KAFKA.length, step + 1); if (b.dataset.k === 'reset') step = 0; draw(); });
    pane.addEventListener('change', e => { if (e.target.dataset.k === 'eyes') { eyes = e.target.checked; draw(); } });
    draw();
  }
  const CONS = [
    { id: 'pd', t: 'Персональные данные покупателей храним на серверах в России.', ok: 'con', why: 'Ограничение: так требует 152-ФЗ. Записываем с источником — закон.' },
    { id: 'pg', t: 'База данных — PostgreSQL.', ok: 'how', why: 'Указание: это выбор Димы и архитектора. У «Колоса» нет причины требовать именно эту базу.' },
    { id: 'os', t: 'Приложение покупателя — для iOS и Android.', ok: 'con', why: 'Ограничение заказчика: у покупателей телефоны обоих видов. Причина понятна и записана.' },
    { id: 'react', t: 'Экран кассира написать на React.', ok: 'how', why: 'Указание: инструмент выбирает команда. Аналитику важно, что экран работает на планшете у кассы.' },
    { id: 'onec', t: 'Сводку продаж выгружать в формате, который принимает 1С:Бухгалтерия.', ok: 'con', why: 'Ограничение внешнего интерфейса: 1С у «Колоса» уже есть, менять её никто не будет.' }
  ];
  function drawCons(pane) {
    const pick = {};
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Иногда «как» — тоже требование. Это <b>ограничение</b>: его нельзя «оптимизировать», потому что за ним закон, договор или уже существующая система. Решите про каждую карточку.</p>
      <div class="devs-flips" data-fl></div>
      <div data-fs></div>
    </div>`;
    function draw() {
      TR.$('[data-fl]', pane).innerHTML = CONS.map(c => {
        const p = pick[c.id], st = p ? (p === c.ok ? 'ok' : 'bad') : '';
        return `<div class="devs-flip ${st}"><div class="q">«${esc(c.t)}»</div>${p ? `<div class="small"><b>${p === c.ok ? '✓' : '✕'}</b> ${esc(c.why)}</div>` : `<div class="btns"><button type="button" class="btn xs" data-cn="${c.id}" data-v="how">Указание — переписать</button><button type="button" class="btn xs" data-cn="${c.id}" data-v="con">Ограничение — оставить</button></div>`}</div>`;
      }).join('');
      const done = Object.keys(pick).length;
      TR.$('[data-fs]', pane).innerHTML = done < CONS.length ? `<p class="small dim">Решено ${done} из ${CONS.length}.</p>`
        : ui.note('info', 'Признаки ограничения', 'Закон (54-ФЗ, 152-ФЗ); договор или регламент внешней системы («КассаПро», 1С); уже существующая система заказчика; осознанное решение заказчика с причиной. Ограничение записывают отдельным разделом и <b>с источником</b> — чтобы через год никто его случайно не «улучшил». Всё остальное «как» — решение команды.');
    }
    TR.on(pane, 'click', '[data-cn]', (e, b) => { pick[b.dataset.cn] = b.dataset.v; draw(); });
    draw();
  }
  const howWhat = {
    id: 'how-what', covers: ['chat', 'rewrite'], title: 'Как это работает: «что», а не «как»', free: true, noReset: true,
    simple: {
      icon: '🎯',
      plain: 'Аналитик пишет, что должно получиться и зачем. Как это сделать внутри — решают разработчики: они знают свои инструменты лучше. Исключение — когда способ задан законом, договором или существующей системой: тогда это ограничение, и его записывают с источником.',
      analogy: 'Заказчик торта говорит кондитеру: «на 12 человек, без орехов, к субботе 15:00». Он не говорит, в какой миске мешать крем. Но если у ребёнка аллергия, «без орехов» — не вкус, а жёсткое условие: его не обсуждают.',
      tech: 'Требование описывает поведение и результат, а не устройство (Вигерс: проектные решения — не требования, пока они не ограничение). <b>Ограничение</b> (constraint) — заданное извне условие на решение: закон (54-ФЗ, 152-ФЗ), регламент внешней системы, существующая инфраструктура. «Сделайте на Kafka» в постановке лишает команду выбора, а Леру — проверяемого критерия.'
    },
    lead: ui.brief({
      situation: 'Стажёр до вас писал постановки с готовыми решениями. Дима раздражён: «Нам диктуют, как делать, а что нужно бизнесу — непонятно».',
      todo: [
        'Вкладка «„Сделайте на Kafka“»: нажимайте «Спросить Галину Ивановну →», пока из способа не получится требование. Включите «Глазами Димы» и сравните его реакцию до и после.',
        'Вкладка «Когда „как“ — это требование»: решите про пять карточек — указание или ограничение.'
      ],
      look: 'Приём «спросить зачем» превращает способ в цель: зачем → что будет, если не сделать → в каких условиях. Позиция аналитика: он отвечает за «что» и «зачем» и за ограничения с источником; «как» отдаёт команде и проверяет, что требование выполнено.'
    }),
    render(el) {
      el.classList.add('devs-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'kafka', t: '«Сделайте на Kafka»', render: drawKafka },
        { id: 'cons', t: 'Когда «как» — это требование', render: drawCons }
      ], 'kafka');
    }
  };

  // =====================================================================
  // Теория 3. Что нужно дизайнеру
  // =====================================================================
  const PH_ST = [{ v: 'normal', t: 'Обычное' }, { v: 'empty', t: 'Пусто' }, { v: 'loading', t: 'Загрузка' }, { v: 'error', t: 'Ошибка' }, { v: 'offline', t: 'Нет связи' }, { v: 'success', t: 'Успех' }];
  const PH = {
    empty: { bad: ['<div class="devs-scr-msg white">.</div>', 'Разработчик не знал, что рисовать, — экран просто белый. Клиент думает, что приложение сломалось.'],
      good: ['<div class="devs-ph-msg"><span class="i">🧺</span><b>Заказов пока нет</b><span>Сдайте вещи в любом пункте — заказ появится здесь</span></div><div class="devs-mini-btn">Адреса пунктов</div>', 'В спецификации: «Если заказов нет — объяснить, где они появятся, и дать следующий шаг»'] },
    loading: { bad: ['<div class="devs-ph-msg"><span class="i">⏳</span><span>Загрузка…</span></div>', 'Крутилка на пустом экране. Если сервер молчит — крутится вечно.'],
      good: ['<div class="devs-sk"></div><div class="devs-sk"></div><div class="small dim" style="text-align:center">Обновляем…</div>', 'В спецификации: «Заготовки карточек; если ответа нет 10 секунд — показать ошибку»'] },
    error: { bad: ['<div class="devs-ph-err">Error 500: NullPointerException at OrderService.java:118</div>', 'Технический текст для программиста. Клиенту непонятно, что делать.'],
      good: ['<div class="devs-ph-ban warn">Не удалось обновить. Показаны данные на 09:40</div><div class="devs-pc"><b>Пальто</b><span>готово · заберите до 14 декабря</span></div><div class="devs-mini-btn">Повторить</div>', 'В спецификации: что случилось, что с данными, что делать'] },
    offline: { bad: ['<div class="devs-ph-msg"><span class="i">⛔</span><b>Нет соединения</b><span>Приложение будет закрыто</span></div>', 'Нет интернета — нет ничего, даже того, что уже было на экране.'],
      good: ['<div class="devs-ph-ban warn">📵 Нет интернета. Показан список на 09:40</div><div class="devs-pc"><b>Пальто</b><span>готово · заберите до 14 декабря</span></div>', 'В спецификации: «Без связи — последний сохранённый список с временем, кнопки, которым нужен сервер, неактивны»'] },
    success: { bad: ['<div class="devs-pc"><b>Пальто</b><span>готово · заберите до 14 декабря</span></div><div class="devs-mini-btn">Заберу завтра</div><div class="small dim" style="text-align:center">(ничего не произошло)</div>', 'Нажали — ничего не изменилось. Клиент жмёт ещё трижды: три одинаковые заявки.'],
      good: ['<div class="devs-ph-ban ok">✓ Готово: ждём вас завтра с 9:00</div><div class="devs-pc"><b>Пальто</b><span>заберёте завтра</span></div>', 'В спецификации: «После нажатия — подтверждение на экране; повторное нажатие не создаёт вторую заявку»'] }
  };
  const PH_NORMAL = '<div class="devs-pc"><b>Пальто</b><span>готово · заберите до 14 декабря</span></div><div class="devs-pc"><b>Рубашки ×3</b><span>в работе · будут 10 декабря</span></div><div class="devs-mini-btn">Заберу завтра</div>';
  function drawStates(pane) {
    let st = 'empty', mode = 'bad';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Соседний пример — экран «Мои заказы» в приложении химчистки. Макет обычно рисуют для удачного случая. Остальные состояния кто-то всё равно «нарисует» — если не Соня по спецификации, то разработчик по наитию.</p>
      ${ui.seg('ps', PH_ST, st)}
      ${ui.seg('pm', [{ v: 'bad', t: '✕ Состояние не описано' }, { v: 'good', t: '✓ Описано в спецификации' }], mode, 'accent')}
      <div class="devs-two"><div data-ph></div><div data-pn></div></div>
    </div>`;
    function draw() {
      const body = st === 'normal' ? PH_NORMAL : PH[st][mode][0];
      TR.$('[data-ph]', pane).innerHTML = `<div class="devs-phone"><div class="bar"><span>09:41</span><span>${st === 'offline' ? '✈ нет сети' : '4G ▮▮▮'}</span></div><h5>Мои заказы</h5>${body}</div>`;
      TR.$('[data-pn]', pane).innerHTML = st === 'normal' ? ui.note('info', 'Обычное состояние', 'Его рисуют всегда. Проблема в остальных пяти: про них в макете обычно ничего нет.')
        : ui.note(mode === 'good' ? 'ok' : 'bad', mode === 'good' ? 'Что написал аналитик' : 'Что получилось без описания', esc(PH[st][mode][1]))
        + ui.note('info', 'Пять вопросов к каждому экрану', '<ul class="checks"><li>Что видит человек, если данных нет (пусто)?</li><li>…пока данные грузятся?</li><li>…если сервер ответил ошибкой?</li><li>…если пропала связь?</li><li>…после успешного действия?</li></ul>');
    }
    ui.onSeg(pane, (n, v) => { if (n === 'ps') st = v; if (n === 'pm') mode = v; draw(); });
    draw();
  }
  const ENV = [
    { id: 'gloves', t: 'Руки в креме и в перчатках', req: 'Крупные кнопки, ни одного поля для текста и мелкой галочки' },
    { id: 'far', t: 'Планшет на стене, в двух метрах', req: 'Крупный шрифт для названия и времени, высокий контраст' },
    { id: 'noise', t: 'Шумят миксеры и печи', req: 'Звук не главный: новый заказ — цветом и значком' },
    { id: 'novice', t: 'Новый кондитер видит экран впервые', req: 'Подписи простыми словами: «Готов», а не «Set status: DONE»' }
  ];
  function drawEnv(pane) {
    const on = {};
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Соседний пример внутри «Колоса» — карточка торта на планшете кондитера в цехе. Включайте условия, в которых работает человек, и смотрите, как меняется карточка и что появляется в требованиях для Сони.</p>
      <div class="devs-two"><div class="devs-sws" data-env></div><div class="stack tight"><div data-cake></div><div data-reqs></div></div></div>
    </div>`;
    function draw() {
      TR.$('[data-env]', pane).innerHTML = ENV.map(x => `<button type="button" class="devs-sw" data-en="${x.id}" aria-pressed="${!!on[x.id]}"><span class="k" aria-hidden="true"></span><span><b>${esc(x.t)}</b></span></button>`).join('');
      const nm = on.far ? 'font-size:22px' : 'font-size:14px';
      TR.$('[data-cake]', pane).innerHTML = `<div class="devs-cake">
        <div class="row between"><span class="nm" style="${nm}">Шоколадный, 2 кг · к 15:00</span>${on.noise ? '<span class="flag">● НОВЫЙ</span>' : '<span class="small dim">🔔 дзынь</span>'}</div>
        <div class="small muted">Надпись: «С юбилеем, мама» · фото-образец 📷</div>
        <div class="ctl">${on.gloves ? `<span class="big">${on.novice ? 'Готов' : 'DONE'}</span>` : `<span class="cb"><i></i>${on.novice ? 'Готов' : 'Set status: DONE'}</span><span class="inp">комментарий…</span>`}</div>
      </div>`;
      const rq = ENV.filter(x => on[x.id]);
      TR.$('[data-reqs]', pane).innerHTML = rq.length ? `<div class="eyebrow">Требования для Сони</div><ul class="checks">${rq.map(x => `<li>${esc(x.req)}</li>`).join('')}</ul>` : '<p class="small dim">Условий нет — и карточка «как в офисе»: мелкая галочка, поле для комментария, звук.</p>';
    }
    TR.on(pane, 'click', '[data-en]', (e, b) => { on[b.dataset.en] = !on[b.dataset.en]; draw(); });
    draw();
  }
  const CO = [
    { n: 1, el: '<b>Пальто, 1 шт.</b>', q: 'Откуда список вещей? А если вещей 12 — всё перечислять?', s: 'Из квитанции приёмщицы. Больше трёх вещей — «Пальто и ещё 11».' },
    { n: 2, el: '<span class="chip ok">Готово</span>', q: 'Какие ещё бывают статусы? А зелёный цвет — дальтоникам?', s: 'Статусы: Принят → В работе → Готово → Выдан. Цвет — только вместе со словом.' },
    { n: 3, el: '<span class="small">заберите до 14 декабря</span>', q: 'Как считается дата? А если уже просрочено?', s: 'Дата готовности + 30 дней. После — «Хранение платное с 15 декабря».' },
    { n: 4, el: '<span class="small">к оплате 1 200 ₽</span>', q: 'А если уже оплачено онлайн? Откуда сумма?', s: 'Прайс + доплаты приёмщицы. Оплачено — «Оплачено», без суммы.' },
    { n: 5, el: '<span class="devs-mini-btn" style="display:inline-block;padding:5px 10px">Заберу завтра</span>', q: 'Что происходит после нажатия? А без связи? А если нажать дважды?', s: 'Приёмщица видит отметку. Повторное нажатие не создаёт вторую заявку. Без связи кнопка неактивна с подсказкой.' }
  ];
  function drawMock(pane) {
    let mode = 'mock', cur = 1;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Макет отвечает на вопрос «как выглядит в одном удачном случае». Спецификация — «откуда данные, по каким правилам и что во всех остальных случаях». Нажимайте на номера.</p>
      ${ui.seg('mm', [{ v: 'mock', t: 'Только макет' }, { v: 'spec', t: 'Макет + спецификация' }], mode, 'accent')}
      <div class="devs-two"><div class="devs-callouts"><div class="devs-phone" style="min-height:0"><div class="bar"><span>09:41</span><span>4G ▮▮▮</span></div><h5>Заказ № 1047</h5><div class="devs-pc stack tight" data-co></div></div></div><div data-cn></div></div>
    </div>`;
    function draw() {
      TR.$('[data-co]', pane).innerHTML = CO.map(c => `<div class="devs-co"><div>${c.el}</div><button type="button" class="n" data-cc="${c.n}" aria-pressed="${cur === c.n}">${c.n}</button></div>`).join('');
      const c = CO.find(x => x.n === cur);
      TR.$('[data-cn]', pane).innerHTML = mode === 'mock'
        ? ui.say('dima', esc(c.q)) + '<p class="small dim">По одной картинке разработчик может только гадать. Каждый ответ «на глаз» — потенциальный баг.</p>'
        : ui.note('ok', `Спецификация · элемент ${c.n}`, esc(c.s)) + '<p class="small dim">Соне спецификация нужна как вход до макета: сценарий, роли, данные, состояния, ограничения. Разработчику — макет и спецификация вместе.</p>';
    }
    ui.onSeg(pane, (n, v) => { if (n === 'mm') { mode = v; draw(); } });
    TR.on(pane, 'click', '[data-cc]', (e, b) => { cur = +b.dataset.cc; draw(); });
    draw();
  }
  const howDesign = {
    id: 'how-design', covers: ['screen'], title: 'Как это работает: что дизайнеру нужно от аналитика', free: true, noReset: true,
    simple: {
      icon: '🎨',
      plain: 'Дизайнеру мало «нарисуй кнопку». Ему нужно: кто пользуется экраном и зачем, какие данные на экране, все состояния — что видно, когда пусто, грузится, ошибка, нет связи и когда всё получилось, — и в каких условиях работает человек.',
      analogy: 'Оформитель витрины спрашивает не «какого цвета полка», а «что на ней лежит утром и вечером, что ставить, когда круассаны кончились, видно ли ценники с улицы». Иначе к 10:30 витрина пустая и непонятно, вернётся ли выпечка.',
      tech: 'Вход дизайнеру: сценарий и роли (кто, зачем, в каком порядке), <b>данные на экране</b> (что, откуда, правила), <b>состояния</b> (empty, loading, error, offline, success — «пусто, загрузка, ошибка, нет связи, успех»), ограничения среды и доступности. Макет и <b>спецификация экрана</b> дополняют друг друга: макет показывает вид, спецификация — поведение и данные. Источник: Вигерс и Битти, гл. о прототипах и пользовательских интерфейсах; практика «состояний экрана» в UX.'
    },
    lead: ui.brief({
      situation: 'Соня получила задачу «нарисуй экран выдачи, как в тетрадке» и пришла с вопросами: «А что видит кассир, если заказов нет? Если связи нет? Где ошибка?». Прежде чем писать спецификацию для неё, посмотрите, что дизайнеру нужно от аналитика.',
      todo: [
        'Вкладка «Пять состояний»: переберите состояния экрана химчистки и переключите «не описано / описано».',
        'Вкладка «Где работает человек»: включайте условия работы кондитера и смотрите, как меняется карточка торта и требования.',
        'Вкладка «Макет и спецификация»: нажимайте на номера в режиме «Только макет», потом — «Макет + спецификация».'
      ],
      look: 'Позиция аналитика: он приходит к дизайнеру не с картинкой, а со сценарием, данными, состояниями и ограничениями. Артефакт — спецификация экрана: по ней Соня рисует, Дима делает, Лера проверяет.'
    }),
    render(el) {
      el.classList.add('devs-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'st', t: 'Пять состояний', render: drawStates },
        { id: 'env', t: 'Где работает человек', render: drawEnv },
        { id: 'mock', t: 'Макет и спецификация', render: drawMock }
      ], 'st');
    }
  };

  // =====================================================================
  // Практика 1. Чат спринта: 8 вопросов Димы
  // =====================================================================
  const BIZ = { nina: 'Нина Сергеевна', pavel: 'Павел', galya: 'Галина Ивановна', oleg: 'Олег Петрович' };
  const BIZ_DAT = { nina: 'Нины Сергеевны', pavel: 'Павла', galya: 'Галины Ивановны', oleg: 'Олега Петровича' };
  const CAT = [{ v: 'self', t: '📗 Отвечу сам' }, { v: 'biz', t: '📮 Спрошу бизнес' }, { v: 'team', t: '🔧 Решает команда' }];
  const CAT_NAME = { self: 'ответ уже есть в требованиях', biz: 'решает бизнес', team: 'решает команда' };
  const CHAT = [
    { id: 'c1', at: '10:12', q: 'Неоплаченный заказ на 08:00–08:30 — во сколько переводим в «Не выкуплен»? В 08:30?', ok: 'self',
      self: 'Держим 30 минут после конца интервала: для 08:00–08:30 — до 09:00, потом «Не выкуплен» и выпечка на витрину. Правило из блокнота, ссылку кладу в журнал.',
      sj: 'до 09:00 (конец интервала + 30 мин), потом «Не выкуплен»', jt: 'Когда неоплаченный становится «Не выкуплен»' },
    { id: 'c2', at: '10:40', q: 'Заказ на завтра в 22:30:00 ровно — ещё принимаем или уже нет? В постановке «до 22:30», Лера спрашивает, что считать.', ok: 'biz', who: ['nina', 'galya'], due: '15:00',
      self: 'Принимаем, конечно: «до» значит включительно.', sj: '«до» = включительно (решил аналитик)', jt: 'Граница 22:30:00' },
    { id: 'c3', at: '11:05', q: 'Чеки в «КассаПро» отправляем через очередь — RabbitMQ или Kafka? Ты как думаешь?', ok: 'team',
      self: 'Берите Kafka, я читал, что она быстрее.', sj: 'Kafka (решил аналитик)',
      team: 'Это ваше решение. От меня — требование: при обрыве связи до 15 минут чеки не теряются и уходят, когда связь вернётся; выдача в пик не ждёт кассу.', jt: 'Очередь для отправки чеков' },
    { id: 'c4', at: '11:30', q: 'Может, на экране кассира искать заказ по имени? Код К-247 диктовать неудобно.', ok: 'self',
      self: 'Нет: на Покровке однофамильцы и «Лены» путаются, пакеты подписывают маркером — и всё равно путают. Поэтому короткий код: три цифры на крупной клавиатуре, без набора имени.',
      sj: 'поиск по короткому коду, не по имени (наблюдение на Покровке)', jt: 'Поиск заказа на кассе' },
    { id: 'c5', at: '12:10', q: 'Торт отменили после предоплаты 50 % — деньги возвращаем? Про отмену тортов в постановке ни слова.', ok: 'biz', who: ['nina'], due: '16:00',
      self: 'Наверное, возвращаем — так честнее.', sj: 'возвращаем (решил аналитик)', jt: 'Возврат предоплаты за торт' },
    { id: 'c6', at: '13:20', q: 'При оплате на месте пробиваем чек «предоплата» при оформлении? Олег Петрович что-то говорил про 54-ФЗ.', ok: 'self',
      self: 'Нет. При оплате на месте чек один — полного расчёта при выдаче. Чек «предоплата» — только когда покупатель платит онлайн заранее. Так требует 54-ФЗ.',
      sj: 'один чек полного расчёта при выдаче (54-ФЗ)', jt: 'Чеки при оплате на месте' },
    { id: 'c7', at: '14:00', q: 'Список заказов на экране кассира обновлять раз в 10 секунд или пусть сервер сам присылает изменения?', ok: 'team',
      self: 'Раз в 10 секунд — так проще.', sj: 'раз в 10 секунд (решил аналитик)',
      team: 'Это ваше решение. От меня — требование: кассир ничего не нажимает, чтобы увидеть новые заказы, и обновление не мешает выдаче в пик.', jt: 'Обновление списка у кассира' },
    { id: 'c8', at: '15:40', q: 'Сколько знаков разрешаем в надписи на торте? Поставим 255, как обычно?', ok: 'biz', who: ['galya'], due: 'завтра 11:00',
      self: 'Ставьте 255, больше никто не напишет.', sj: '255 знаков (решил аналитик)', jt: 'Длина надписи на торте' }
  ];
  function chatReply(c, a) {
    const v = a.c && a.c[c.id];
    if (!v) return '';
    if (v === 'self') return c.self;
    if (v === 'team') return c.team || 'Решайте сами, как удобнее, — потом поправим.';
    const w = a.w && a.w[c.id];
    return w ? `Не знаю — это решает ${BIZ[w]}. Узнаю и отвечу до ${c.due || '15:00'}. Пока делайте остальное.` : 'Спрошу у бизнеса… (выберите, у кого)';
  }
  function chatEval(a) {
    a = a || {}; const c = a.c || {}, w = a.w || {}, per = {};
    let sum = 0, critical = 0;
    CHAT.forEach(q => {
      const v = c[q.id];
      if (!v) { per[q.id] = { s: 'none', p: 0 }; return; }
      if (v !== q.ok) { per[q.id] = { s: 'bad', p: 0, v }; if (v === 'self' && q.ok === 'biz') critical++; return; }
      if (q.ok === 'biz') { const good = q.who.includes(w[q.id]); per[q.id] = { s: good ? 'ok' : 'warn', p: good ? 1 : 0.5, v }; sum += good ? 1 : 0.5; return; }
      per[q.id] = { s: 'ok', p: 1, v }; sum += 1;
    });
    return { per, score: sum / CHAT.length, critical };
  }
  const chatTask = {
    id: 'chat', title: 'Чат спринта: восемь вопросов Димы',
    simple: howHandoff.simple,
    lead: ui.brief({
      situation: 'Вторник второго спринта. Вы весь день на встречах, а в чат команды «Колос · спринт 2» Дима и разработчики накидали восемь вопросов. Двое уже стоят: без ответа дальше не пишут. Ксения: «Разложите их по трём полкам — и не решайте за других».',
      todo: [
        'Под каждым сообщением нажмите одну кнопку: «📗 Отвечу сам» (ответ уже есть в требованиях и блокноте), «📮 Спрошу бизнес» (правило решает «Колос») или «🔧 Решает команда» (это «как сделать»).',
        'Если выбрали «📮 Спрошу бизнес» — в списке выберите, кто в «Колосе» решает это правило.',
        'Читайте свой ответ в чате и журнал решений внизу: так его увидит Дима.',
        'Нажмите «Проверить». Засчитывается от 80 % и если нигде не решили правило бизнеса сами.'
      ],
      look: 'Подсказка: в блокноте есть 22:30, 30 минут, 54-ФЗ и наблюдение на Покровке. Чего в блокноте нет — того аналитик не придумывает. Позиция аналитика: он отвечает в течение дня, честно говорит «не знаю — узнаю к 15:00», не решает за бизнес и за команду и всё записывает в журнал решений.'
    }),
    blank: () => ({ c: {}, w: {} }),
    reference: () => ({ c: Object.fromEntries(CHAT.map(q => [q.id, q.ok])), w: Object.fromEntries(CHAT.filter(q => q.ok === 'biz').map(q => [q.id, q.who[0]])) }),
    render(el, ctx) {
      el.classList.add('devs-root');
      const a = ctx.ans; a.c = a.c || {}; a.w = a.w || {};
      const rv = !!(ctx.result || ctx.readonly);
      el.innerHTML = `<div class="stack"><div class="eyebrow">Чат «Колос · спринт 2» · вторник</div><div class="devs-chat" data-msgs></div><div class="eyebrow">Журнал решений · спринт 2</div><div class="devs-jr" data-jr></div></div>`;
      function draw() {
        const ev = chatEval(a);
        TR.$('[data-msgs]', el).innerHTML = CHAT.map(q => {
          const v = a.c[q.id], s = rv ? ev.per[q.id].s : '';
          const rep = chatReply(q, a);
          return `<div class="devs-msg ${s === 'none' ? 'bad' : s}"><div class="hd"><b>Дима</b><span>${q.at}</span></div><div class="tx">${esc(q.q)}</div>
            <div class="devs-ch">${CAT.map(c => `<button type="button" class="btn xs" data-ch="${q.id}" data-v="${c.v}" aria-pressed="${v === c.v}" ${ctx.readonly ? 'disabled' : ''}>${c.t}</button>`).join('')}
            ${v === 'biz' ? `<select data-w="${q.id}" aria-label="Кто решает" ${ctx.readonly ? 'disabled' : ''}><option value="">Кого спросить…</option>${Object.keys(BIZ).map(k => `<option value="${k}" ${a.w[q.id] === k ? 'selected' : ''}>${BIZ[k]}</option>`).join('')}</select>` : ''}</div>
            ${rep ? `<div class="devs-rep"><div class="who">Вы</div>${esc(rep)}</div>` : ''}</div>`;
        }).join('');
        const rows = CHAT.filter(q => a.c[q.id]).map(q => {
          const v = a.c[q.id], w = a.w[q.id];
          const dec = v === 'self' ? q.sj : v === 'biz' ? (w ? `ждём ответ ${BIZ_DAT[w]} до ${q.due || '15:00'}` : 'ждём ответ — кого спросить?') : `решает команда${q.team ? '; требование записано' : ''}`;
          const who = v === 'self' ? 'аналитик' : v === 'biz' ? (w ? BIZ[w] : '—') : 'Дима и команда';
          return [q.at, esc(q.jt), esc(dec), esc(who)];
        });
        TR.$('[data-jr]', el).innerHTML = rows.length ? ui.table(['Когда', 'Вопрос', 'Решение / статус', 'Кто решает'], rows) : '<p class="small dim">Журнал пуст: ответьте хотя бы на один вопрос.</p>';
      }
      el.addEventListener('click', e => {
        const b = e.target.closest('[data-ch]'); if (!b || ctx.readonly) return;
        a.c[b.dataset.ch] = b.dataset.v; if (b.dataset.v !== 'biz') delete a.w[b.dataset.ch];
        ctx.save(); ctx.decide('Чат спринта: ' + b.dataset.ch, CAT_NAME[b.dataset.v]); draw();
      });
      el.addEventListener('change', e => {
        const s = e.target.closest('[data-w]'); if (!s || ctx.readonly) return;
        if (s.value) a.w[s.dataset.w] = s.value; else delete a.w[s.dataset.w];
        ctx.save(); draw();
      });
      draw();
    },
    check(ans) {
      const ev = chatEval(ans), notes = [];
      const n = id => CHAT.findIndex(q => q.id === id) + 1;
      const empty = CHAT.filter(q => ev.per[q.id].s === 'none');
      if (empty.length) notes.push({ ok: false, html: `Без ответа ${empty.length} ${TR.plural(empty.length, 'вопрос', 'вопроса', 'вопросов')}: ${empty.map(q => '№' + n(q.id)).join(', ')}. Молчание в чате — тоже ответ: разработчик решит сам.` });
      CHAT.forEach(q => {
        const p = ev.per[q.id];
        if (p.s === 'bad') {
          if (q.ok === 'biz' && p.v === 'self') notes.push({ ok: false, html: `Вопрос №${n(q.id)}: вы ответили сами, но такого правила в блокноте нет — вы его придумали. Кто в «Колосе» отвечает за это решение?` });
          else if (q.ok === 'biz') notes.push({ ok: false, html: `Вопрос №${n(q.id)}: это не «как сделать», а правило, от которого зависят деньги или работа людей. Можно ли отдать его на усмотрение разработчика?` });
          else if (q.ok === 'team') notes.push({ ok: false, html: `Вопрос №${n(q.id)} — про то, как устроено внутри. Чьё это решение? И что тогда остаётся аналитику — какое требование он даёт вместо способа?` });
          else notes.push({ ok: false, html: `Вопрос №${n(q.id)}: ответ уже есть в блокноте. ${p.v === 'biz' ? 'Зачем спрашивать «Колос» второй раз — что подумает Нина Сергеевна о вопросе, на который уже отвечали?' : 'Если отдать его команде, правило «Колоса» решат на глаз.'}` });
        } else if (p.s === 'warn') notes.push({ ok: 'warn', html: `Вопрос №${n(q.id)}: полка верная, но тот ли человек? Кто в «Колосе» знает это правило лучше всех — и кто вправе его менять?` });
      });
      if (!notes.length) notes.push({ ok: true, html: 'Все восемь вопросов на своих полках, журнал заполнен.' });
      const ok = ev.score >= 0.8 && !ev.critical;
      return {
        ok, score: ev.score, notes,
        summary: `Верно разложено: ${String(Math.round(ev.score * 16) / 2).replace('.', ',')} из 8.${ev.critical ? ` Правил бизнеса, которые вы решили сами: ${ev.critical}.` : ''}`,
        mentor: ev.critical ? 'Самая дорогая ошибка — уверенно ответить за бизнес. Разработчик сделает, Лера проверит по вашему ответу, а Нина Сергеевна узнает на демо. Честное «не знаю — узнаю к 15:00» дешевле.' : null
      };
    },
    explain: `<ul class="checks">
        <li><b>Отвечу сам (№1, 4, 6).</b> 30 минут после интервала, код вместо имени, чек при оплате на месте — всё уже в блокноте. Ответ сразу и со ссылкой: разработчик не ждёт, а Нина не слышит один и тот же вопрос дважды. Если такие вопросы повторяются — требование плохо видно, его стоит поднять выше в постановке.</li>
        <li><b>Спрошу бизнес (№2, 5, 8).</b> «Ровно в 22:30:00» — граница правила Нины (можно спросить и Галину Ивановну: её план в 23:00 — причина правила). Возврат предоплаты за торт — деньги, решает владелица. Длина надписи — сколько помещается на торте, знает цех. Ответ «не знаю — узнаю к 15:00» честный и с обещанием срока.</li>
        <li><b>Решает команда (№3, 7).</b> Очередь сообщений и способ обновления списка — «как». Аналитик не выбирает инструмент, а даёт условия: чеки не теряются при обрыве до 15 минут, кассир ничего не нажимает, чтобы увидеть заказ.</li>
      </ul>
      <p>Журнал решений — не бюрократия: через неделю Лера спросит, почему в 22:30:00 заказ отклонён, и ответ будет ссылкой, а не спором. Решение по 22:30 Нина подтвердила в тот же день: <b>в 22:30:00 приём на завтра уже закрыт</b>. Оно пригодится на тренировке с QA.</p>
      <p class="small muted">Источники: Карл Вигерс, Кандас Хоканссон, «Software Requirements Essentials» — отслеживать открытые вопросы и решения; Гойко Аджич, «Specification by Example».</p>`,
    report: ans => { const ev = chatEval(ans); return CHAT.map((q, i) => `${i + 1}. ${q.q} → ${ans && ans.c && ans.c[q.id] ? CAT_NAME[ans.c[q.id]] + (ans.w && ans.w[q.id] ? ' (' + BIZ[ans.w[q.id]] + ')' : '') : '—'} ${ev.per[q.id].s === 'ok' ? '✓' : '✗'}`).join('\n'); }
  };

  // =====================================================================
  // Практика 2. Технические указания → требования
  // =====================================================================
  const SRC = [{ v: 'law', t: 'Закон (54-ФЗ)' }, { v: 'vendor', t: 'Договор и регламент «КассаПро»' }, { v: 'team', t: 'Решение команды' }, { v: 'taste', t: 'Пожелание без причины' }];
  const RW = [
    { id: 'r1', src: 'Кнопку «Выдать» сделайте зелёной, 80 пикселей, в правом нижнем углу.', kind: 'how', opts: [
      { t: 'Кассир в перчатках выдаёт заказ одним касанием крупной кнопки, без набора текста; размер, цвет и место кнопки решает дизайнер.', ok: true },
      { t: 'Кнопка «Выдать» — 80 пикселей, зелёная, справа внизу, чтобы было удобно.' },
      { t: 'Экран выдачи должен быть удобным и понятным для кассиров.' }] },
    { id: 'r2', src: 'Сделайте cron-задачу в 23:00: она копирует заказы на завтра в Excel и отправляет технологу на почту.', kind: 'how', opts: [
      { t: 'В 23:00 все предзаказы на завтра, принятые до 22:30, автоматически входят в план выпечки, который технолог видит на планшете цеха.', ok: true },
      { t: 'Каждый вечер в 23:00 запускается скрипт, который выгружает таблицу Excel технологу.' },
      { t: 'Технолог должен своевременно получать информацию о заказах.' }] },
    { id: 'r3', src: 'Поставьте на планшет кассира локальную базу SQLite и синхронизацию раз в минуту.', kind: 'how', opts: [
      { t: 'Планшет кассира должен работать без интернета всегда и без сбоев.' },
      { t: 'При обрыве связи до 15 минут кассир продолжает собирать и выдавать заказы; когда связь вернётся, действия и чеки досылаются без потерь.', ok: true },
      { t: 'Синхронизация планшета с сервером — раз в минуту через локальную базу.' }] },
    { id: 'r4', src: 'Проверку 22:30 сделайте в приложении: после 22:30 кнопка «Завтра» серая.', kind: 'how', opts: [
      { t: 'После 22:30 кнопка «Завтра» серая и не нажимается.' },
      { t: 'Система должна по возможности ограничивать поздние заказы.' },
      { t: 'С 22:30 заказ на завтра не принимается ни в одном канале — в приложении любой версии, на сайте и у кассира; покупатель видит, что приём закрыт, и может взять из уже запланированного.', ok: true }] },
    { id: 'r5', src: 'Чеки пробивайте только через публичный API «КассаПро» — никаких обходных путей.', kind: 'con', srcOk: 'vendor' },
    { id: 'r6', src: 'Сделайте поиск заказа по фамилии с автодополнением.', kind: 'how', opts: [
      { t: 'Поиск по фамилии должен работать быстро.' },
      { t: 'Кассир находит заказ по короткому коду (К-247), набирая цифры на крупной клавиатуре, — без имени и без ввода текста.', ok: true },
      { t: 'Кассир ищет заказ удобным для себя способом.' }] },
    { id: 'r7', src: 'При онлайн-оплате пробивайте чек «предоплата», при выдаче — чек полного расчёта.', kind: 'con', srcOk: 'law' },
    { id: 'r8', src: 'Пусть сервер раз в 30 секунд проверяет неоплаченные заказы и удаляет просроченные.', kind: 'how', opts: [
      { t: 'Просроченные заказы удаляются автоматически каждые 30 секунд.' },
      { t: 'Система должна оперативно освобождать выпечку из неоплаченных заказов.' },
      { t: 'Неоплаченный предзаказ через 30 минут после конца интервала получает статус «Не выкуплен», выпечка возвращается в продажу; заказ не удаляется и виден в истории.', ok: true }] }
  ];
  function rwEval(a) {
    a = a || {}; const k = a.k || {}, o = a.o || {}, s = a.s || {}, per = {};
    let sum = 0, conMiss = 0;
    RW.forEach(r => {
      const kv = k[r.id];
      if (!kv) { per[r.id] = { s: 'none', p: 0 }; if (r.kind === 'con') conMiss++; return; }
      if (kv !== r.kind) { per[r.id] = { s: 'bad', p: 0, why: 'kind' }; if (r.kind === 'con') conMiss++; return; }
      const done = r.kind === 'how' ? o[r.id] != null : !!s[r.id];
      const second = r.kind === 'how' ? !!(done && r.opts[o[r.id]] && r.opts[o[r.id]].ok) : s[r.id] === r.srcOk;
      per[r.id] = { s: second ? 'ok' : 'warn', p: second ? 1 : 0.5, why: done ? 'second' : 'empty' };
      sum += per[r.id].p;
    });
    return { per, score: sum / RW.length, conMiss };
  }
  const rwTask = {
    id: 'rewrite', title: 'Технические указания → требования',
    simple: howWhat.simple,
    lead: ui.brief({
      situation: 'Стажёр, который вёл «Колос» до вас, оставил в постановках восемь «указаний» разработчикам. Дима: «Половина — как нам писать код. А что нужно бизнесу, я должен угадывать. Хотя пара пунктов, похоже, по делу». Разберите наследство.',
      todo: [
        'Для каждой строки нажмите: «Указание — переписать» или «Ограничение — оставить».',
        'Для указания выберите формулировку требования, в которой есть «что» и «зачем», а способа и слов-ловушек нет.',
        'Для ограничения выберите источник: откуда оно и почему его нельзя «улучшить».',
        'Нажмите «Проверить». Засчитывается от 80 % и если оба настоящих ограничения не потеряны.'
      ],
      look: 'Проверка требования — вопрос Леры: «Как я это проверю на тесте?». Проверка ограничения — «Кто накажет, если сделать иначе?». Позиция аналитика: он отвечает за «что» и «зачем», а «как» — у команды; ограничения записывает отдельно, с источником.'
    }),
    blank: () => ({ k: {}, o: {}, s: {} }),
    reference: () => ({ k: Object.fromEntries(RW.map(r => [r.id, r.kind])), o: Object.fromEntries(RW.filter(r => r.kind === 'how').map(r => [r.id, r.opts.findIndex(x => x.ok)])), s: Object.fromEntries(RW.filter(r => r.kind === 'con').map(r => [r.id, r.srcOk])) }),
    render(el, ctx) {
      el.classList.add('devs-root');
      const a = ctx.ans; a.k = a.k || {}; a.o = a.o || {}; a.s = a.s || {};
      const rv = !!(ctx.result || ctx.readonly), D = ctx.readonly ? 'disabled' : '';
      function draw() {
        const ev = rwEval(a);
        el.innerHTML = `<div class="stack">${RW.map((r, i) => {
          const kv = a.k[r.id], st = rv ? ev.per[r.id].s : '';
          let body = '';
          if (kv === 'how') body = r.opts ? `<div class="eyebrow">Требование вместо указания</div>${r.opts.map((x, j) => ({ x, j })).sort((p, q) => TR.hash(r.id + p.j) - TR.hash(r.id + q.j)).map(({ x, j }) => {
            const on = a.o[r.id] === j, mk = rv && on ? (x.ok ? 'ok' : 'bad') : '';
            return `<button type="button" class="devs-opt ${mk}" data-o="${r.id}" data-j="${j}" aria-pressed="${on}" ${D}><span class="mk" aria-hidden="true"></span><span>${esc(x.t)}</span></button>`;
          }).join('')}` : '<p class="small dim">Переписать не получится: формулировки «без способа» здесь нет. Может, это вовсе не указание?</p>';
          if (kv === 'con') body = `<div class="eyebrow">Источник ограничения</div><div class="row">${SRC.map(x => `<button type="button" class="btn xs" data-s="${r.id}" data-v="${x.v}" aria-pressed="${a.s[r.id] === x.v}" ${D}>${esc(x.t)}</button>`).join('')}</div>`;
          return `<div class="devs-rw ${st === 'none' ? 'bad' : st}"><div class="row between"><span class="devs-lbl">Строка ${i + 1}</span><div class="row"><button type="button" class="btn xs" data-k="${r.id}" data-v="how" aria-pressed="${kv === 'how'}" ${D}>Указание — переписать</button><button type="button" class="btn xs" data-k="${r.id}" data-v="con" aria-pressed="${kv === 'con'}" ${D}>Ограничение — оставить</button></div></div>
            <div class="src">«${esc(r.src)}»</div>${body}</div>`;
        }).join('')}</div>`;
      }
      el.addEventListener('click', e => {
        if (ctx.readonly) return;
        const k = e.target.closest('[data-k]'), o = e.target.closest('[data-o]'), s = e.target.closest('[data-s]');
        if (k) { a.k[k.dataset.k] = k.dataset.v; ctx.decide('Указание или ограничение: ' + k.dataset.k, k.dataset.v === 'how' ? 'указание' : 'ограничение'); }
        else if (o) { a.o[o.dataset.o] = +o.dataset.j; }
        else if (s) { a.s[s.dataset.s] = s.dataset.v; }
        else return;
        ctx.save(); draw();
      });
      draw();
    },
    check(ans) {
      const ev = rwEval(ans), notes = [];
      RW.forEach((r, i) => {
        const p = ev.per[r.id], n = i + 1;
        if (p.s === 'none') notes.push({ ok: false, html: `Строка ${n} без решения.` });
        else if (p.s === 'bad' && r.kind === 'how') notes.push({ ok: false, html: `Строка ${n}: какой закон, договор или существующая система заставляет делать именно так? Если причины нет — это выбор команды, а не условие «Колоса».` });
        else if (p.s === 'bad') notes.push({ ok: false, html: `Строка ${n}: можно ли сделать иначе и не нарушить закон или договор? Если нельзя — это не указание, его нельзя «переписать».` });
        else if (p.s === 'warn' && r.kind === 'how') notes.push({ ok: 'warn', html: p.why === 'empty' ? `Строка ${n}: выберите формулировку требования.` : `Строка ${n}: в выбранной формулировке остался способ или слово, которое не проверить. Как Лера проверит её на тесте?` });
        else if (p.s === 'warn') notes.push({ ok: 'warn', html: p.why === 'empty' ? `Строка ${n}: укажите источник ограничения.` : `Строка ${n}: откуда это ограничение? Кто накажет «Колос», если сделать иначе?` });
      });
      if (!notes.length) notes.push({ ok: true, html: 'Шесть указаний стали требованиями, два ограничения сохранены с источником.' });
      return {
        ok: ev.score >= 0.8 && !ev.conMiss, score: ev.score, notes,
        summary: `Строк разобрано верно: ${RW.filter(r => ev.per[r.id].s === 'ok').length} из ${RW.length}.`,
        mentor: ev.conMiss ? 'Осторожно с «переписать всё». Чек «предоплата» и публичный API «КассаПро» — не вкус стажёра: за первым стоит закон, за вторым — договор и сертификация вендора. Если их «освободить», команда честно найдёт обходной путь, и «Колос» получит штраф или отказ в сертификации.' : null
      };
    },
    explain: `<ul class="checks">
        <li><b>Шесть указаний — способы.</b> Зелёная кнопка 80 пикселей, cron и Excel, SQLite, серая кнопка в приложении, поиск по фамилии, удаление каждые 30 секунд. За каждым — цель: выдать в перчатках одним касанием, план выпечки в 23:00, работа без связи до 15 минут, правило 22:30 в любом канале, код вместо имени, статус «Не выкуплен».</li>
        <li><b>Как отличить хорошее требование.</b> В нём есть кто, что и при каких условиях, есть числа из блокнота и нет способа. Плохие варианты ломаются одним из двух способов: способ остался другими словами («скрипт выгружает Excel») или исчезла мера («своевременно», «удобно», «всегда и без сбоев»).</li>
        <li><b>Серая кнопка — ловушка.</b> Если правило 22:30 описать как вид экрана, старая версия приложения и кассир его обойдут. Требование говорит о поведении системы во всех каналах.</li>
        <li><b>Два ограничения.</b> Чеки «предоплата» и «полный расчёт» — 54-ФЗ. Только публичный API «КассаПро» — договор и сертификация вендора (3 недели). Их записывают в раздел «Ограничения» с источником.</li>
      </ul>
      <p class="small muted">Источники: Карл Вигерс, Джой Битти, «Разработка требований к программному обеспечению» — ограничения и почему проектным решениям не место в требованиях; ISO/IEC/IEEE 29148 — требование однозначное и проверяемое.</p>`,
    report: ans => { const ev = rwEval(ans); return RW.map((r, i) => `${i + 1}. «${r.src}» → ${ans && ans.k && ans.k[r.id] ? (ans.k[r.id] === 'how' ? 'указание' : 'ограничение') : '—'} ${ev.per[r.id].s === 'ok' ? '✓' : '✗'}`).join('\n'); }
  };

  // =====================================================================
  // Практика 3. Лаборатория: спецификация экрана выдачи для Сони
  // =====================================================================
  const SC_F = [
    { id: 'code', t: 'Код заказа крупно: К-247', good: true },
    { id: 'name', t: 'Имя и фамилия покупателя — крупно, главный признак', good: false },
    { id: 'slot', t: 'Интервал выдачи: 08:00–08:30', good: true },
    { id: 'items', t: 'Состав: позиции и количество', good: true },
    { id: 'phone', t: 'Телефон покупателя полностью', good: false },
    { id: 'pay', t: 'Оплата: «оплачено» или «к оплате 360 ₽»', good: true },
    { id: 'uuid', t: 'Номер заказа в базе: 9b1c27d0-a3f8-…', good: false },
    { id: 'hold', t: 'У неоплаченного: «держим до 09:00»', good: true }
  ];
  const SC_A = [
    { id: 'search', t: 'Поле поиска по имени с экранной клавиатурой', good: false },
    { id: 'pad', t: 'Крупная цифровая клавиатура для кода', good: true },
    { id: 'collect', t: 'Кнопка «Собрать» — одно касание', good: true },
    { id: 'comment', t: 'Поле «Комментарий кассира» у каждого заказа', good: false },
    { id: 'issue', t: 'Кнопка «Выдать» — одно касание; у неоплаченного сначала «Принять оплату»', good: true }
  ];
  const SC_C = [
    { id: 'gloves', t: 'Руки в муке и в перчатках — крупные кнопки, никакого набора текста', good: true },
    { id: 'pc', t: 'Кассир работает за компьютером — можно горячие клавиши и мелкие таблицы', good: false },
    { id: 'noise', t: 'У кассы шумно — новый заказ и подтверждение видны на экране, звук не главный', good: true },
    { id: 'peak', t: 'Пик 07:30–09:00, очередь 8–12 человек — выдать в одно-два касания', good: true },
    { id: 'dark', t: 'Тёмная тема «как у Додо» — так красивее', good: false },
    { id: 'staff', t: 'Кассиры новые каждый месяц, обучение 1 день — подписи простыми словами', good: true }
  ];
  const SC_ORD = [
    { code: 'К-245', name: 'Елена Смирнова', phone: '+7 910 555-12-45', uuid: '7f3a9c1e-4b2d', items: 'Круассан ×2 · Капучино ×1', due: '' },
    { code: 'К-247', name: 'Елена Смирнова', phone: '+7 920 555-77-01', uuid: '9b1c27d0-a3f8', items: 'Бородинский ×1 · Слойка с вишней ×2', due: '360 ₽' },
    { code: 'К-249', name: 'Ольга Петрова', phone: '+7 903 555-30-90', uuid: '0c4e88f2-71aa', items: 'Круассан ×6', due: '' }
  ];
  const SC_S = [
    { id: 'empty', t: 'Пусто', q: 'в интервале 08:00–08:30 заказов нет', def: 'white', opts: [
      { v: 'a', t: 'Пустой экран: раз заказов нет, показывать нечего', cons: 'Белый экран — кассир думает, что планшет завис, и зовёт Павла', view: 'white' },
      { v: 'b', t: '«В 08:00–08:30 заказов нет» и кнопка ближайшего интервала с заказами', ok: true, cons: 'Пусто — не тупик: экран подсказывает, где ближайшие заказы', view: 'emptyGood' },
      { v: 'c', t: 'Таблица с заголовками и пустыми строками', cons: 'Пустая таблица: непонятно, заказов нет или они не загрузились', view: 'emptyTable' }] },
    { id: 'loading', t: 'Загрузка', q: 'список обновляется', def: 'spin', opts: [
      { v: 'a', t: 'Весь экран закрывает крутилка, пока сервер не ответит', cons: 'В пик очередь ждёт, пока крутится колесо: выдать ничего нельзя', view: 'spin' },
      { v: 'b', t: 'Старый список остаётся, кнопки работают, в углу — значок «обновляем»', ok: true, cons: 'Обновление не мешает выдаче: кассир его почти не замечает', view: 'loadGood' }] },
    { id: 'error', t: 'Ошибка', q: 'сервер ответил ошибкой', def: 'err', opts: [
      { v: 'a', t: 'Окно «Error 500. Обратитесь к администратору»', cons: 'Кассир не знает, что делать; администратора в пекарне нет', view: 'err' },
      { v: 'b', t: 'Экран сам перезагружается каждые 5 секунд', cons: 'Список мигает и пропадает — посреди выдачи', view: 'reload' },
      { v: 'c', t: '«Сервер не ответил. Показан список на 08:00. Выдавать можно» — кнопки работают', ok: true, cons: 'Ошибка сервера не останавливает выдачу в пик', view: 'errGood' }] },
    { id: 'offline', t: 'Нет связи', q: 'модем отвалился на 10–15 минут', def: 'offBad', opts: [
      { v: 'a', t: 'Плашка «Нет связи — работаю офлайн · в очереди: 2», кнопки работают, действия и чеки уходят, когда связь вернётся', ok: true, cons: 'Обрыв на 10–15 минут — обычный режим, а не авария', view: 'offGood' },
      { v: 'b', t: '«Нет интернета. Повторите позже», кнопки неактивны', cons: 'Каждый обрыв модема — 10–15 минут без выдачи, очередь на улицу', view: 'offBad' }] },
    { id: 'success', t: 'Успех', q: 'кассир нажал «Выдать»', def: 'none', opts: [
      { v: 'a', t: 'Окно «Операция выполнена успешно» с кнопкой «ОК»', cons: 'Лишнее касание на каждый заказ — в пик это минуты очереди', view: 'modal' },
      { v: 'b', t: 'Заказ просто исчезает из списка', cons: 'Выдал или промахнулся? Кассир нажимает ещё раз — уже по соседнему заказу', view: 'none' },
      { v: 'c', t: 'Крупная отметка «К-247 выдан ✓» на 2 секунды, затем следующий заказ — без лишних касаний', ok: true, cons: 'Видно издалека и в шуме; руки свободны для следующего пакета', view: 'done' }] }
  ];
  const SC_VIEWS = [{ v: 'normal', t: 'Обычное' }].concat(SC_S.map(s => ({ v: s.id, t: s.t })));
  const DEF_CONS = { white: 'Белый экран — кассир думает, что планшет завис', spin: 'Крутилка на весь экран — в пик выдать нельзя', err: 'Технический текст ошибки, кассир не знает, что делать', offBad: 'Без связи всё встало: очередь ждёт модем', none: 'После «Выдать» ничего не видно — выдал или нет?' };
  function scEval(a) {
    a = a || {}; const f = a.f || {}, ac = a.a || {}, st = a.st || {}, c = a.c || {};
    const part = (list, sel) => { const g = list.filter(x => x.good), gHit = g.filter(x => sel[x.id]).length, bHit = list.filter(x => !x.good && sel[x.id]).length; return { gHit, gAll: g.length, bHit, r: Math.max(0, (gHit - bHit) / g.length) }; };
    const pf = part(SC_F, f), pa = part(SC_A, ac), pc = part(SC_C, c);
    const sOk = SC_S.filter(s => { const o = s.opts.find(x => x.v === st[s.id]); return o && o.ok; }).length;
    const score = pf.r * 0.25 + pa.r * 0.15 + (sOk / SC_S.length) * 0.4 + pc.r * 0.2;
    const holes = { normal: [] };
    const H = t => holes.normal.push(t);
    if (!f.code) H('Нет кода заказа — как отличить пакет К-247 от К-245?');
    if (f.name) H('Имя крупно — две «Елены Смирновы» в одном интервале');
    if (!f.slot) H('Не видно интервала — какой заказ выдавать сейчас?');
    if (!f.items) H('Нет состава — что собирать в пакет?');
    if (f.phone) H('Телефон целиком на экране у очереди — лишние персональные данные');
    if (!f.pay) H('Не видно оплаты — брать деньги или нет?');
    if (f.uuid) H('Служебный номер из базы — кассиру он ничего не говорит');
    if (!f.hold) H('Не видно, до скольких держим неоплаченный заказ');
    if (!ac.pad && !ac.search) H('Нечем найти заказ — листать карточки в пик?');
    if (ac.search) H('Поиск по имени — набирать текст в перчатках и путать однофамильцев');
    if (!ac.collect) H('Нет кнопки «Собрать» — как отметить, что пакет готов?');
    if (!ac.issue) H('Нет кнопки «Выдать» — заказ так и висит в списке');
    if (ac.comment) H('Поле для текста — в перчатках его никто не заполнит');
    if (!c.gloves) H('Кнопки мелкие: Соня не знала про перчатки');
    if (!c.noise) H('Новый заказ — только звуком: в шуме у кассы не слышно');
    if (!c.peak) H('Выдача в три касания: «Выдать» → «Подтвердить» → «ОК»');
    if (!c.staff) H('Подписи на жаргоне: новый кассир не поймёт «ISSUE»');
    if (c.pc) H('Горячие клавиши и мелкие таблицы — у кассы нет клавиатуры и мыши');
    if (c.dark) H('Тёмная тема «как у Додо» — вкус, а не условие работы');
    SC_S.forEach(s => {
      const o = s.opts.find(x => x.v === st[s.id]);
      holes[s.id] = !o ? [`Состояние «${s.t}» не описано: Соня не знает, что рисовать, разработчик сделает как умеет. ${DEF_CONS[s.def]}`] : o.ok ? [] : [o.cons];
    });
    const nHoles = Object.values(holes).reduce((n, l) => n + l.length, 0);
    return { pf, pa, pc, sOk, score, holes, nHoles };
  }
  function scCard(o, a, mode) {
    const f = a.f || {}, ac = a.a || {}, c = a.c || {};
    const L = c.staff ? { col: 'Собрать', iss: 'Выдать', pay: 'Принять оплату' } : { col: 'COLLECT', iss: 'ISSUE', pay: 'PAYMENT' };
    const sz = c.gloves ? 'big' : 'sml', hb = c.gloves ? '' : 'devs-hole';
    let h = '<div class="ln">';
    if (f.code) h += `<span class="cd">${o.code}</span>`;
    if (f.name) h += `<span class="cd devs-hole" style="font-size:15px">${esc(o.name)}</span>`;
    if (f.slot) h += '<span class="small dim">08:00–08:30</span>';
    h += '</div>';
    if (f.phone) h += `<div class="small devs-hole">${esc(o.phone)}</div>`;
    if (f.uuid) h += `<div class="small mono dim devs-hole">${esc(o.uuid)}</div>`;
    h += f.items ? `<div>${esc(o.items)}</div>` : '<div class="devs-hole small dim">состав?</div>';
    if (f.pay) h += o.due ? `<div class="pay due">К оплате ${o.due}${f.hold ? ' · держим до 09:00' : ''}</div>` : '<div class="pay ok">Оплачено</div>';
    else h += '<div class="devs-hole small dim">оплата?</div>';
    if (ac.comment) h += '<div class="devs-inp devs-hole">Комментарий кассира…</div>';
    const btns = [];
    if (ac.collect) btns.push(`<span class="devs-b ${sz} alt ${hb}">${L.col}</span>`);
    if (ac.issue) btns.push(`<span class="devs-b ${sz} ${hb}">${o.due ? L.pay : L.iss}${c.peak ? '' : ' → ⋯ → ОК'}</span>`);
    if (btns.length) h += `<div class="bx">${btns.join('')}</div>`;
    else h += '<div class="devs-hole small dim">как отметить «выдан»?</div>';
    return `<div class="devs-oc" ${mode === 'dim' ? 'style="opacity:.55"' : ''}>${h}</div>`;
  }
  function scList(a, mode) { return SC_ORD.map(o => scCard(o, a, mode)).join(''); }
  function scView(a, view) {
    const c = a.c || {};
    const msg = (i, t, s, k) => `<div class="devs-scr-msg ${k || ''}"><span class="i">${i}</span><b>${t}</b>${s ? `<span class="small">${s}</span>` : ''}</div>`;
    const V = {
      white: '<div class="devs-scr-msg white">.</div>',
      emptyGood: msg('🧺', 'В 08:00–08:30 заказов нет', '') + `<span class="devs-b ${c.gloves ? 'big' : 'sml'}">Ближайшие: 08:30–09:00 · 4 заказа</span>`,
      emptyTable: ui.table(['Код', 'Состав', 'Оплата'], [['', '', ''], ['', '', '']]),
      spin: '<div class="devs-ov"><span style="font-size:26px">⏳</span><span>Загрузка…</span></div>',
      loadGood: '<div class="small dim" style="text-align:right">⟳ обновляем…</div>' + scList(a),
      err: '<div class="devs-scr-msg err">Error 500. Internal Server Error.<br>Обратитесь к администратору.</div>',
      reload: '<div class="devs-ov"><span>Перезагрузка через 5…</span></div>',
      errGood: '<div class="devs-ph-ban warn">⚠ Сервер не ответил. Показан список на 08:00. Выдавать можно</div>' + scList(a),
      offGood: scList(a),
      offBad: msg('📵', 'Нет интернета', 'Повторите позже') + scList(a, 'dim'),
      modal: scList(a, 'dim') + '<div class="devs-modal"><span>Операция выполнена успешно</span><span class="devs-b sml">ОК</span></div>',
      none: SC_ORD.filter(o => o.code !== 'К-247').map(o => scCard(o, a)).join('') + '<div class="small dim" style="text-align:center">(К-247 исчез — выдан?)</div>',
      done: `<div class="devs-done">К-247 выдан ✓<span class="small" style="font-weight:500">следующий заказ через 2 секунды</span></div>`
    };
    if (view === 'normal') return { body: scList(a), off: false };
    const S = SC_S.find(s => s.id === view), o = S.opts.find(x => x.v === (a.st || {})[view]);
    const key = o ? o.view : S.def;
    return { body: V[key] || '', off: view === 'offline' && key === 'offGood', offAny: view === 'offline', pad: key !== 'done' };
  }
  function scMock(a, view, ev) {
    const ac = a.a || {}, c = a.c || {};
    const v = scView(a, view);
    const pad = ac.pad && v.pad !== false ? `<div class="devs-pad"><span class="dsp">К-2_ _</span>${['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✓'].map(d => `<span>${d}</span>`).join('')}</div>` : '';
    const search = ac.search ? '<div class="devs-inp devs-hole">🔍 Поиск по имени…</div>' : '';
    const net = v.offAny ? (v.off ? `<span class="devs-tb-net off">Нет связи — работаю офлайн · в очереди: 2</span>` : '<span class="devs-tb-net off">Нет связи</span>') : '<span class="devs-tb-net">● В сети</span>';
    const fresh = view === 'normal' ? (c.noise ? '<span class="chip warn">● Новый: К-251</span>' : '<span class="small dim devs-hole">🔔 дзынь — новый заказ</span>') : '';
    const hs = ev.holes[view] || [];
    const S = SC_S.find(s => s.id === view), o = S && S.opts.find(x => x.v === (a.st || {})[view]);
    return `<div class="devs-tab ${c.dark ? '' : ''}"><div class="devs-tb-top"><span>Покровка · 08:00–08:30</span>${fresh}${net}</div>
      ${search}<div class="devs-tb-body ${pad ? '' : 'nopad'}"><div class="devs-tb-list">${v.body}</div>${pad}</div></div>
      ${hs.length ? hs.map(t => `<div class="devs-holeT">✕ ${esc(t)}</div>`).join('') : `<div class="devs-goodT">✓ ${o && o.ok ? esc(o.cons) : view === 'normal' ? 'В обычном состоянии дыр нет: Соне есть что рисовать, Диме — что делать.' : ''}</div>`}`;
  }
  const scTask = {
    id: 'screen', title: 'Лаборатория: спецификация экрана выдачи для Сони',
    simple: howDesign.simple,
    lead: ui.brief({
      situation: 'Соня рисует экран выдачи предзаказов для кассира на Покровке. Утром — пик 07:30–09:00 и очередь 8–12 человек, руки в муке и перчатках, у кассы шумно, модем отваливается на 10–15 минут, кассиры новые каждый месяц. Соня: «Дайте спецификацию: что на экране и что видит кассир в каждом состоянии. Иначе я нарисую только удачный случай».',
      todo: [
        'Слева отметьте, какие данные показать на карточке заказа и какие действия дать кассиру. Лишнее не отмечайте.',
        'В блоке «Состояния экрана» выберите поведение для каждого из пяти состояний: пусто, загрузка, ошибка, нет связи, успех.',
        'Отметьте условия работы кассира, которые надо передать Соне.',
        'Справа — макет, который рисуется из ваших ответов. Переключайте состояния над планшетом: красные вкладки и пунктир — дыры в спецификации. Добейтесь, чтобы дыр не осталось.',
        'Нажмите «Проверить». Засчитывается от 85 %, если верно описаны хотя бы четыре состояния из пяти и имя покупателя не стало главным признаком.'
      ],
      look: 'Макет «врёт» так же, как будет врать настоящий экран: если состояние не описано, показано, что сделает разработчик по наитию. Позиция аналитика: он не рисует экран — он даёт Соне сценарий, данные, состояния и ограничения. Артефакт — спецификация экрана выдачи.'
    }),
    blank: () => ({ f: {}, a: {}, st: {}, c: {} }),
    reference: () => ({
      f: Object.fromEntries(SC_F.filter(x => x.good).map(x => [x.id, true])),
      a: Object.fromEntries(SC_A.filter(x => x.good).map(x => [x.id, true])),
      st: Object.fromEntries(SC_S.map(s => [s.id, s.opts.find(o => o.ok).v])),
      c: Object.fromEntries(SC_C.filter(x => x.good).map(x => [x.id, true]))
    }),
    render(el, ctx) {
      el.classList.add('devs-root');
      const a = ctx.ans; a.f = a.f || {}; a.a = a.a || {}; a.st = a.st || {}; a.c = a.c || {};
      const rv = !!(ctx.result || ctx.readonly), D = ctx.readonly ? 'disabled' : '';
      let view = 'normal';
      el.innerHTML = `<div class="stack"><div class="devs-lab"><div class="stack tight" data-ed></div><div class="stack tight" data-mk></div></div>
        <div class="row">${sysBtn('screens/cash/an/offline', 'Сравнить с планшетом кассира в системе «Колос»')}<span class="small dim">в системе — тот же экран в режиме «Глазами аналитика», состояние «Нет связи»</span></div></div>`;
      bindSys(el);
      const grp = (g, list, sel, title) => `<div class="devs-blk"><div class="eyebrow">${title}</div>${list.map(x => {
        const on = !!sel[x.id], mk = rv && on ? (x.good ? 'ok' : 'bad') : '';
        return `<button type="button" class="devs-ck ${mk}" data-tg="${g}" data-id="${x.id}" aria-pressed="${on}" ${D}><span class="mk" aria-hidden="true"></span><span>${esc(x.t)}</span></button>`;
      }).join('')}</div>`;
      function drawEd() {
        const nh = scEval(a).nHoles;
        TR.$('[data-ed]', el).innerHTML = `<div class="devs-mhint">${chip(nh ? `дыр в макете: ${nh} · макет — ниже` : 'дыр нет · макет — ниже', nh ? 'bad' : 'ok')}</div>` + grp('f', SC_F, a.f, 'Данные на карточке заказа') + grp('a', SC_A, a.a, 'Действия на экране')
          + `<div class="devs-blk"><div class="eyebrow">Состояния экрана · нажмите вариант ещё раз, чтобы снять</div>${SC_S.map(s => {
            return `<div class="devs-st"><div class="small"><b>${esc(s.t)}</b> — ${esc(s.q)}${a.st[s.id] ? '' : ' · <span class="dim">не описано</span>'}</div>${s.opts.map(x => {
              const on = a.st[s.id] === x.v, mk = rv && on ? (x.ok ? 'ok' : 'bad') : '';
              return `<button type="button" class="devs-opt sm ${mk}" data-sst="${s.id}" data-v="${x.v}" aria-pressed="${on}" ${D}><span class="mk" aria-hidden="true"></span><span>${esc(x.t)}</span></button>`;
            }).join('')}</div>`;
          }).join('')}</div>`
          + grp('c', SC_C, a.c, 'Условия работы кассира — что передать Соне');
      }
      function drawMk() {
        const ev = scEval(a);
        TR.$('[data-mk]', el).innerHTML = `<div class="devs-holes"><span class="eyebrow">Макет Сони по вашей спецификации</span>${chip(ev.nHoles ? `дыр: ${ev.nHoles}` : 'дыр нет', ev.nHoles ? 'bad' : 'ok')}</div>
          <div class="devs-tabsel" role="group" aria-label="Состояние экрана">${SC_VIEWS.map(v => `<button type="button" data-view="${v.v}" aria-pressed="${view === v.v}" class="${(ev.holes[v.v] || []).length ? 'h' : ''}">${esc(v.t)}${(ev.holes[v.v] || []).length ? ' ✕' : ''}</button>`).join('')}</div>
          ${scMock(a, view, ev)}`;
      }
      el.addEventListener('click', e => {
        const v = e.target.closest('[data-view]'); if (v) { view = v.dataset.view; drawMk(); return; }
        const b = e.target.closest('[data-tg]'); if (!b || ctx.readonly) return;
        const g = b.dataset.tg, id = b.dataset.id;
        a[g][id] = !a[g][id]; if (!a[g][id]) delete a[g][id];
        ctx.save(); drawEd(); drawMk();
      });
      el.addEventListener('click', e => {
        const s = e.target.closest('[data-sst]'); if (!s || ctx.readonly) return;
        const id = s.dataset.sst;
        if (a.st[id] === s.dataset.v) delete a.st[id]; else a.st[id] = s.dataset.v;
        view = id; ctx.save(); ctx.decide('Экран выдачи: состояние ' + id, a.st[id] || 'не описано');
        drawEd(); drawMk();
      });
      drawEd(); drawMk();
    },
    check(ans) {
      const ev = scEval(ans), a = ans || {}, f = a.f || {}, ac = a.a || {}, c = a.c || {}, st = a.st || {}, notes = [];
      if (ev.pf.gHit < ev.pf.gAll) notes.push({ ok: false, html: `Данных на карточке не хватает: ${ev.pf.gAll - ev.pf.gHit}. Пройдите путь кассира: найти пакет → понять, что в нём → брать ли деньги → до скольких его держать.` });
      if (f.name) notes.push({ ok: false, html: 'Имя крупно — главный признак? Вспомните наблюдение на Покровке: что там происходило с пакетами, подписанными маркером?' });
      if (f.phone || f.uuid) notes.push({ ok: 'warn', html: 'На карточке есть данные, которые кассиру не нужны. Кто ещё видит экран у кассы — и что из этого служебное?' });
      if (!ac.pad && !ac.search) notes.push({ ok: false, html: 'Чем кассир найдёт заказ, когда покупатель назвал код?' });
      if (ac.search || ac.comment) notes.push({ ok: false, html: 'Среди действий есть набор текста. Получится ли печатать в перчатках, в муке, при очереди из десяти человек?' });
      if (!ac.collect || !ac.issue) notes.push({ ok: false, html: 'Каких кнопок не хватает, чтобы пакет прошёл путь «Принят → Собран → Выдан»?' });
      SC_S.forEach(s => {
        const o = s.opts.find(x => x.v === st[s.id]);
        if (!o) notes.push({ ok: false, html: `Состояние «${s.t}» не описано. Откройте его над макетом — что сделает разработчик, если вы промолчите?` });
        else if (!o.ok) notes.push({ ok: false, html: `Состояние «${s.t}»: представьте 08:15, очередь 10 человек. Что будет с выдачей при таком поведении экрана?` });
      });
      if (ev.pc.gHit < ev.pc.gAll) notes.push({ ok: 'warn', html: `Соня не узнает про ${ev.pc.gAll - ev.pc.gHit} ${TR.plural(ev.pc.gAll - ev.pc.gHit, 'условие', 'условия', 'условий')} работы кассира. Вспомните смену в пекарне: руки, шум, пик, новички.` });
      if (c.pc || c.dark) notes.push({ ok: 'warn', html: 'Среди условий есть то, что не соответствует пекарне или является вкусом, а не условием работы.' });
      if (!notes.length) notes.push({ ok: true, html: 'Спецификация полная: данные, действия, все пять состояний и условия работы кассира.' });
      const ok = ev.score >= 0.85 && ev.sOk >= 4 && !f.name;
      return {
        ok, score: ev.score, notes,
        summary: `Данные: ${ev.pf.gHit} из ${ev.pf.gAll}, лишних ${ev.pf.bHit}. Действия: ${ev.pa.gHit} из ${ev.pa.gAll}, лишних ${ev.pa.bHit}. Состояния: ${ev.sOk} из ${SC_S.length}. Условия: ${ev.pc.gHit} из ${ev.pc.gAll}, лишних ${ev.pc.bHit}. Дыр в макете: ${ev.nHoles}.`,
        mentor: ev.sOk < 3 ? 'Обычное состояние нарисуют и без вас. Ваша работа — остальные пять: именно там кассир в пик остаётся один на один с белым экраном.' : null
      };
    },
    explain: `<ul class="checks">
        <li><b>Данные — по пути кассира.</b> Найти пакет (код К-247, а не имя: «Лены» и однофамильцы путаются), понять, что собирать (состав), брать ли деньги (оплачено / к оплате), до скольких держать неоплаченный (конец интервала + 30 минут). Телефон и служебный номер — лишние: экран видит очередь.</li>
        <li><b>Действия — без набора текста.</b> Крупная цифровая клавиатура, «Собрать» и «Выдать» в одно касание; у неоплаченного сначала оплата — чек полного расчёта по 54-ФЗ.</li>
        <li><b>Пять состояний.</b> Пусто — подсказать ближайший интервал. Загрузка — не блокировать выдачу. Ошибка — честно сказать, какие данные показаны, и дать работать. Нет связи — офлайн-режим с очередью действий и чеков: на Покровке это обычная ситуация, а не авария. Успех — крупная отметка без лишнего «ОК».</li>
        <li><b>Условия работы — тоже требования.</b> Перчатки, шум, пик и новички каждый месяц — из наблюдения на смене. Без них Соня нарисует «офисный» экран.</li>
      </ul>
      <p>Макет и спецификация живут вместе: Соня рисует по спецификации, Дима делает по макету и спецификации, Лера проверяет каждое состояние. Откройте планшет кассира в системе «Колос» и включите «Глазами аналитика» — там та же логика.</p>
      <p class="small muted">Источники: Карл Вигерс, Джой Битти, «Разработка требований к программному обеспечению» — спецификация пользовательского интерфейса и прототипы; практика описания состояний экрана (empty, loading, error, offline, success) в UX-дизайне.</p>`,
    report: ans => { const ev = scEval(ans), a = ans || {}; return `Данные: ${SC_F.filter(x => (a.f || {})[x.id]).map(x => x.t).join('; ') || '—'}\nДействия: ${SC_A.filter(x => (a.a || {})[x.id]).map(x => x.t).join('; ') || '—'}\nСостояния: ${SC_S.map(s => { const o = s.opts.find(x => x.v === (a.st || {})[s.id]); return s.t + ' — ' + (o ? o.t : 'не описано'); }).join('; ')}\nУсловия: ${SC_C.filter(x => (a.c || {})[x.id]).map(x => x.t).join('; ') || '—'}\nДыр: ${ev.nHoles}`; }
  };

  // =====================================================================
  // Практика 4. Definition of Ready: какие истории брать в спринт
  // =====================================================================
  const DOR_CH = [
    { v: 'go', t: 'Готова — берём в спринт' },
    { v: 'biz', t: 'Не готова: открытый вопрос к бизнесу' },
    { v: 'spike', t: 'Не готова: сначала спайк (разведка)' },
    { v: 'split', t: 'Не готова: большая — разрезать' },
    { v: 'mock', t: 'Не готова: нет макета состояний' }
  ];
  const DOR = [
    { id: 'd1', t: 'Кассир находит предзаказ по коду и отмечает «Выдан»', crit: 'есть: код из трёх цифр, выдача в одно касание, неоплаченный — сначала оплата', mock: 'есть, все пять состояний', est: '5 сторипоинтов', open: 'нет', sp: 5, ok: 'go' },
    { id: 'd2', t: 'Чек полного расчёта при выдаче через «КассаПро»', crit: 'есть: чек по 54-ФЗ при выдаче', mock: 'не нужен', est: 'Дима: «Не оценю. Как API „КассаПро“ ведёт себя при обрыве связи — не знаем, песочницу не смотрели»', open: 'технический, у команды', sp: null, ok: 'spike' },
    { id: 'd3', t: 'Покупатель отменяет предзаказ', crit: 'есть: бесплатно не позже чем за 2 часа до интервала; возврат на ту же карту за 3 рабочих дня', mock: 'есть', est: '5 сторипоинтов', open: 'Лера: «Оплата на месте, отмена за час — что делаем?» В правиле об этом ни слова', sp: 5, ok: 'biz' },
    { id: 'd4', t: 'Предзаказ целиком: пекарня, интервал, корзина, оплата, код, SMS', crit: 'частично', mock: 'есть', est: '40 сторипоинтов; команда успевает около 30 за спринт', open: 'нет', sp: 40, ok: 'split' },
    { id: 'd5', t: 'Экран кассира работает без связи', crit: 'есть: обрыв до 15 минут, действия и чеки досылаются без потерь', mock: 'Соня: «Нарисовала только обычное состояние. Что видит кассир офлайн — не знаю»', est: '8 сторипоинтов', open: 'нет', sp: 8, ok: 'mock' },
    { id: 'd6', t: 'Приём заказов на завтра закрывается в 22:30', crit: 'есть, с примерами 22:29 / 22:30 / 22:31; решение по 22:30:00 — в журнале', mock: 'текст предупреждения согласован', est: '3 сторипоинта', open: 'нет', sp: 3, ok: 'go' },
    { id: 'd7', t: 'Кассир оформляет предзаказ по телефону за покупателя', crit: 'есть: пекарня и ближайший интервал подставлены, оплата на месте', mock: 'есть, все состояния', est: '8 сторипоинтов', open: 'нет', sp: 8, ok: 'go' },
    { id: 'd8', t: 'Сводка продаж в 1С к 09:00 следующего дня', crit: 'есть: одна сводка по всем пекарням', mock: 'не нужен', est: 'Дима: «Оценим, когда увидим формат»', open: 'Образца файла для 1С нет — его обещал прислать Олег Петрович', sp: null, ok: 'biz' }
  ];
  const DOR_LIST = ['История понятна команде: кто, что и зачем', 'Есть критерии приёмки с примерами на границах', 'Если нужен макет — он есть со всеми состояниями', 'Нет открытых вопросов к бизнесу', 'Неизвестное разведано, команда может оценить', 'Оценена и влезает в спринт'];
  function dorEval(a) {
    const v = (a && a.v) || {}, per = {};
    let good = 0, badGo = 0;
    DOR.forEach(d => { const x = v[d.id]; per[d.id] = !x ? 'none' : x === d.ok ? 'ok' : 'bad'; if (x === d.ok) good++; if (x === 'go' && d.ok !== 'go') badGo++; });
    return { per, good, badGo, score: good / DOR.length };
  }
  const dorTask = {
    id: 'dor', title: 'Definition of Ready: что берём в третий спринт',
    lead: ui.brief({
      situation: 'Завтра планирование третьего спринта. Игорь торопит: «Берём побольше — до пилота 1 февраля немного». Ксения: «Берём только готовое. Договорённость команды о готовности висит над доской». Перед вами восемь историй из бэклога с заметками после груминга.',
      todo: [
        'Прочитайте карточку истории: критерии, макет, оценка, открытые вопросы.',
        'Для каждой выберите в списке: «Готова — берём» или почему не готова — вопрос к бизнесу, нужен спайк, разрезать, нет макета.',
        'Внизу следите, сколько сторипоинтов набирается в спринт: команда успевает около 30.',
        'Нажмите «Проверить». Засчитывается от 7 из 8 и если в спринт не попала ни одна неготовая история.'
      ],
      look: 'Сверяйте каждую карточку с шестью пунктами готовности над списком. Позиция аналитика: он готовит истории к грумингу и планированию — критерии, примеры, макет с Соней, ответы бизнеса — и честно говорит, что ещё не готово.'
    }),
    simple: {
      icon: '✅',
      plain: 'Definition of Ready — договорённость команды: какую историю можно брать в спринт. Если взять неготовую, спринт уйдёт на ожидание ответов и переделки.',
      analogy: 'Тесто ставят в печь, когда оно подошло. Не подошло — ждать в печи бесполезно: только займёте место, а хлеб выйдет плохим.',
      tech: 'Definition of Ready (DoR) — практика команд, в Scrum Guide 2020 её нет: там сказано лишь, что элементы бэклога, которые команда может сделать за спринт, считаются готовыми к выбору. Критики DoR предупреждают: если превратить его в «ворота», вернётся передача через забор. Рядом — Definition of Done и INVEST.'
    },
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(DOR.map(d => [d.id, d.ok])) }),
    render(el, ctx) {
      el.classList.add('devs-root');
      const a = ctx.ans; a.v = a.v || {};
      const rv = !!(ctx.result || ctx.readonly);
      el.innerHTML = `<div class="stack">
        <div class="devs-blk"><div class="eyebrow">Definition of Ready · команда «Колоса»</div><ul class="checks">${DOR_LIST.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
        <div data-m></div><div class="devs-cap" data-cap></div></div>`;
      const ev0 = dorEval(a);
      const reveal = rv ? Object.fromEntries(DOR.map(d => [d.id, { s: ev0.per[d.id] === 'ok' ? 'ok' : 'bad' }])) : null;
      ui.match(TR.$('[data-m]', el), {
        rows: DOR.map(d => ({ id: d.id, t: `<b>${esc(d.t)}</b><div class="devs-dor"><div><span class="k">Критерии</span><span>${esc(d.crit)}</span></div><div><span class="k">Макет</span><span>${esc(d.mock)}</span></div><div><span class="k">Оценка</span><span>${esc(d.est)}</span></div><div><span class="k">Вопросы</span><span>${esc(d.open)}</span></div></div>` })),
        choices: DOR_CH, value: a.v, readonly: ctx.readonly, reveal, placeholder: 'Решение…',
        onChange: v => { a.v = v; ctx.save(); drawCap(); }
      });
      function drawCap() {
        const go = DOR.filter(d => a.v[d.id] === 'go');
        const sp = go.reduce((s, d) => s + (d.sp || 0), 0), unk = go.filter(d => d.sp == null).length;
        TR.$('[data-cap]', el).innerHTML = `<div class="row between"><span class="eyebrow">В третий спринт берём</span>${chip(`${sp} из ~30 сторипоинтов${unk ? ` + ${unk} без оценки` : ''}`, sp > 30 || unk ? 'bad' : sp ? 'ok' : '')}</div>${ui.meter(Math.min(1, sp / 30), sp > 30 ? 'bad' : 'ok')}
          ${go.length ? `<ul class="checks">${go.map(d => `<li class="${d.sp == null ? 'bad' : ''}">${esc(d.t)} — ${d.sp == null ? 'без оценки' : d.sp + ' SP'}</li>`).join('')}</ul>` : '<p class="small dim">Пока ничего не взято.</p>'}
          ${sp > 30 ? ui.note('bad', 'Спринт не влезает', 'Команда успевает около 30 сторипоинтов. Что из взятого слишком большое?') : ''}`;
      }
      drawCap();
    },
    check(ans) {
      const ev = dorEval(ans), notes = [];
      const n = id => DOR.findIndex(d => d.id === id) + 1;
      DOR.forEach(d => {
        const p = ev.per[d.id], v = ((ans && ans.v) || {})[d.id];
        if (p === 'none') notes.push({ ok: false, html: `История №${n(d.id)} без решения.` });
        else if (p === 'bad' && v === 'go') notes.push({ ok: false, html: `История №${n(d.id)} «${esc(d.t)}» взята в спринт. Пройдите по шести пунктам готовности: какой не выполнен?` });
        else if (p === 'bad' && d.ok === 'go') notes.push({ ok: 'warn', html: `История №${n(d.id)}: что именно ей мешает? Если все шесть пунктов выполнены — держать её за бортом значит терять спринт.` });
        else if (p === 'bad') notes.push({ ok: 'warn', html: `История №${n(d.id)} действительно не готова, но причина другая. Перечитайте строку, где написано, чего не хватает, — и кто это может дать.` });
      });
      if (!notes.length) notes.push({ ok: true, html: 'Три истории — в спринт, пять — на доработку с понятной причиной.' });
      return {
        ok: ev.good >= 7 && !ev.badGo, score: ev.score, notes,
        summary: `Верно: ${ev.good} из ${DOR.length}. Неготовых историй в спринте: ${ev.badGo}.`,
        mentor: ev.badGo ? 'Неготовая история в спринте выглядит как экономия времени, а на деле — его кража: разработчики ждут ответов, Лера проверяет по догадкам, демо срывается. Лучше взять меньше, но довести до «готово».' : null
      };
    },
    explain: `<ul class="checks">
        <li><b>Готовы №1, 6, 7</b> — 16 сторипоинтов из ~30. Остаток спринта команда доберёт, когда спайк и ответы бизнеса закроют вопросы.</li>
        <li><b>№2 — спайк.</b> Неизвестна техника: поведение API «КассаПро» при обрыве связи. Два дня разведки в песочнице — и Дима оценит. Сертификация вендора идёт три недели, её Игорь закладывает отдельно.</li>
        <li><b>№3 и №8 — вопрос к бизнесу.</b> Отмена при оплате на месте позже 2 часов — правило молчит, решает Нина. Формат файла для 1С — нужен образец от Олега Петровича. Аналитик отправляет вопросы сегодня, с датой ответа.</li>
        <li><b>№4 — разрезать.</b> 40 сторипоинтов при скорости около 30 — не влезет в спринт. Режут поперёк, по шагам пути покупателя (тренировка «User story», SPIDR).</li>
        <li><b>№5 — нет макета состояний.</b> Именно офлайн-состояние здесь главное, а его нет. Сначала спецификация для Сони — ту, что вы сделали в лаборатории.</li>
      </ul>
      <p>Честная оговорка: Definition of Ready — договорённость команды, а не правило Scrum. Некоторые команды от него отказываются, чтобы он не превратился в «ворота» с проверкой бумажек. Работает, когда это повод поговорить, а не повод не брать задачу.</p>
      <p class="small muted">Источники: Scrum Guide 2020 (Product Backlog refinement); Майк Кон, «Пользовательские истории»; практика спайков из XP (Кент Бек).</p>`,
    report: ans => { const ev = dorEval(ans); return DOR.map((d, i) => `${i + 1}. ${d.t} → ${((ans && ans.v) || {})[d.id] ? DOR_CH.find(c => c.v === ans.v[d.id]).t : '—'} ${ev.per[d.id] === 'ok' ? '✓' : '✗'}`).join('\n'); }
  };

  // =====================================================================
  // Практика 5. Ответ Игорю своими словами
  // =====================================================================
  const W_RUBRIC = [
    'Вопросы всё равно прозвучат — важно когда: до кода (минуты) или на тесте и демо (дни переделки); есть пример из лаборатории или «Колоса»',
    'Разработчикам нужны однозначные правила и критерии с примерами, быстрые ответы в течение дня и журнал решений; аналитик не решает за бизнес',
    'Дизайнеру нужны сценарий, данные на экране, все состояния (пусто, загрузка, ошибка, нет связи, успех) и условия работы (перчатки, шум, пик)',
    'Игорю и Нине аналитик даёт оценимые части, риски и неизвестное (спайк) — от этого зависят сроки и деньги при оплате по часам',
    'Аналитик пишет «что» и «зачем», а «как» оставляет команде; ограничения — с источником (54-ФЗ, «КассаПро»)',
    'Честно: документ полезен, но без разговора не работает; разговоры держат короткими (три амиго — около 30 минут)'
  ];
  const W_REF = 'Игорь, ТЗ я напишу, но одного документа мало. Вопросы всё равно прозвучат — вопрос только когда. В истории про торт их было девять: если отдать постановку «через забор», шесть всплывают после того, как код написан, и срок растёт с 8 до 20 дней. С грумингом и тремя амиго те же вопросы звучат до спринта, а цена — около трёх часов разговоров. Дальше: разработчикам нужны правила с примерами на границах (22:29, 22:30, 22:31) и ответы в течение дня. Если я молчу, они решают сами, а правила вроде возврата предоплаты за торт решает Нина, не мы. Соне нужны все состояния экрана и условия у кассы — перчатки, шум, обрывы модема, иначе она нарисует только удачный случай, а белый экран кассир увидит в пик. Вам и Нине я помогаю с оценкой: режем эпик на части, называем риски вроде сертификации «КассаПро» и выносим неизвестное в спайк. При оплате по часам это дешевле, чем переделка. При этом я не диктую команде, как писать код: даю «что» и «зачем», а ограничения — с источником, как 54-ФЗ. Разговоры держу короткими: три амиго — полчаса на историю.';
  const whyTask = {
    id: 'why', title: 'Ответ Игорю: зачем аналитику разговаривать с командой',
    simple: howHandoff.simple,
    lead: ui.brief({
      situation: 'Игорь в коридоре: «Слушайте, у нас оплата по факту часов. Аналитик сидит на грумингах, на трёх амиго, отвечает в чате, рисует с Соней состояния. Может, пусть просто напишет ТЗ целиком и отдаст — ребята сами разберутся? Дешевле же».',
      todo: [
        'Ответьте Игорю своими словами: 6–10 предложений, от 300 символов.',
        'Опирайтесь на то, что видели сегодня: лабораторию «через забор», чат Димы, экран для Сони, готовность историй.',
        'Нажмите «Проверить с Ксенией (Claude)» или «Сверить с эталоном самому», затем «Проверить». Засчитывается от 60 %.'
      ],
      look: 'Игорь думает деньгами и сроками — говорите на его языке: дни переделки, риски, оценка. Позиция аналитика: он не «пишет документ и уходит», а ведёт задачу вместе с командой.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: W_REF, self: W_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('devs-root');
      const a = ctx.ans; a.j = a.j || {};
      el.innerHTML = ui.say('igor', 'Аналитик сидит на грумингах, на трёх амиго, отвечает в чате, рисует с Соней состояния. Может, пусть просто напишет ТЗ целиком и отдаст — ребята сами разберутся? Дешевле же.') + '<div style="margin-top:12px"></div>';
      const j = document.createElement('div'); el.appendChild(j);
      ui.justify(j, {
        id: 'devs-why', q: 'Ответ Игорю: почему аналитику мало «написать ТЗ и отдать»?', placeholder: 'Игорь, …',
        qPlain: 'Ответьте руководителю проекта, который предлагает сэкономить: пусть аналитик просто напишет ТЗ и отдаст разработчикам, без грумингов, трёх амиго и ответов в чате. Объясните на кейсе сети пекарен, что аналитик даёт разработчикам, дизайнеру и PM и почему это дешевле.',
        rubric: W_RUBRIC, reference: W_REF, value: a.j, readonly: ctx.readonly, minLen: 300,
        onChange: v => { a.j = v; ctx.save(); ctx.decide('Ответ Игорю про работу с командой', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j), t = ((ans && ans.j && ans.j.text) || '').trim();
      const notes = [];
      if (t.length < 300) notes.push({ ok: false, html: `Ответ короче 300 символов (${t.length}). Игорь не поверит общим словам — нужны цифры и примеры.` });
      if (!(ans && ans.j && (ans.j.ai || ans.j.self))) notes.push({ ok: false, html: 'Проверьте ответ: «Проверить с Ксенией» или «Сверить с эталоном самому» — и отметьте пункты, которые у вас есть.' });
      else if (s < 0.6) notes.push({ ok: false, html: 'Пока мало пунктов. Подумайте о каждом, кто ждёт от аналитика: разработчики, Соня, сам Игорь с Ниной. И о том, когда звучат вопросы.' });
      else notes.push({ ok: true, html: `Ответ: ${Math.round(s * 100)} %.` });
      return { ok: s >= 0.6 && t.length >= 300, score: s, notes };
    },
    explain: `<p>Сильный ответ PM говорит на его языке: дни, деньги, риски. Главная мысль — <b>вопросы не исчезают, если их не задать; они просто становятся дороже</b>. Документ полезен, но это вход в разговор, а не его замена.</p>
      <p>Хорошо, если в ответе есть по одному конкретному «что даю» для каждого: разработчикам — правила с примерами и ответы в течение дня, Соне — состояния и условия работы, Игорю и Нине — оценимые части и спайк вместо гадания. И честная цена: разговоры тоже стоят часов, поэтому их держат короткими.</p>
      <p class="small muted">Источники: Гойко Аджич, «Specification by Example»; Карл Вигерс, Кандас Хоканссон, «Software Requirements Essentials»; практика трёх амиго.</p>`,
    report: ans => `Ответ Игорю: ${(ans && ans.j && ans.j.text) || '—'}`
  };

  // =====================================================================
  TR.stage({
    id: ID, act: 5, order: 430, slot: 'Ср 10:00', title: 'Аналитик, разработчики и дизайнер',
    when: 'среда, 10:00 · второй спринт · стол команды «Колоса» в опенспейсе «Квант Софт»',
    intro: [
      { who: 'dima', html: 'Второй спринт. Вчера в чате восемь вопросов от ребят, половина висит без ответа. Ещё неделя так — и мы встанем.' },
      { who: 'sonya', html: 'А мне прислали: «нарисуй экран выдачи, как в тетрадке». А что видит кассир, если заказов нет? Если связи нет? Где ошибка?' },
      { who: 'ksenia', html: 'Сегодня — о том, как аналитик работает с теми, кто строит: разработчиками, тимлидом, дизайнером и владельцем продукта. Передать задачу — не значит перекинуть её через забор.' }
    ],
    facts: ['F-cutoff', 'F-hold', 'F-54fz', 'F-cake48', 'F-cakecap', 'F-plan', 'F-peak', 'F-obs-hands', 'F-obs-names', 'F-net', 'F-obs-modem', 'F-staff'],
    glossary: [
      { term: 'Передача задачи (handoff)', simple: 'Момент, когда задача переходит из рук в руки: от аналитика к дизайнеру, разработчику, тестировщику.', tech: '«Через забор» — передача документа без разговора: вопросы всплывают поздно и дорого. Лечится совместной работой: уточнение бэклога, три амиго, спецификация на примерах.' },
      { term: 'Уточнение бэклога (груминг, refinement)', simple: 'Разговор команды о будущих историях за неделю-две до спринта: вопросы, примеры, нарезка, оценка.', tech: 'Product Backlog Refinement — в Scrum Guide 2020 постоянная деятельность, а не отдельное событие. «Груминг» — жаргонное название.' },
      { term: 'Три амиго', simple: 'Аналитик, разработчик и тестировщик вместе читают историю до начала работы.', tech: 'Three Amigos: три взгляда — бизнес (зачем), разработка (как и что мешает), тестирование (что может пойти не так). Обычно 15–30 минут на историю.' },
      { term: 'Журнал решений', simple: 'Таблица: какой был вопрос, что решили, кто решил и когда.', tech: 'Decision log — хранит договорённости, которые иначе тонут в чатах; на запись ссылаются из требования или задачи.' },
      { term: 'Ограничение (constraint)', simple: 'Условие, которое нельзя «улучшить»: закон, договор, уже существующая система.', tech: 'Заданное извне требование к самому решению: 54-ФЗ, 152-ФЗ, регламент «КассаПро», формат 1С. Записывается отдельно и с источником (Вигерс, Битти).' },
      { term: 'Спецификация экрана', simple: 'Описание экрана для дизайнера, разработчика и тестировщика: зачем он, какие данные, что делают кнопки, какие состояния.', tech: 'Дополняет макет: источники данных и правила, все состояния (пусто, загрузка, ошибка, нет связи, успех), условия работы и доступность.' },
      { term: 'Состояния экрана', simple: 'Что видит человек не только в удачный момент, но и когда пусто, грузится, ошибка, нет связи, всё получилось.', tech: 'Empty, loading, error, offline, success. Неописанное состояние разработчик всё равно «нарисует» — по-своему.' },
      { term: 'Definition of Ready', simple: 'Договорённость команды, когда история готова к спринту.', tech: 'Типичные пункты: понятна, есть критерии с примерами, макет (если нужен), нет открытых вопросов к бизнесу, неизвестное разведано, оценена и влезает в спринт. В Scrum Guide 2020 не определён — это практика команд.' },
      { term: 'Спайк (spike)', simple: 'Короткая разведка, чтобы узнать неизвестное и потом оценить задачу.', tech: 'Ограниченная по времени задача (обычно 1–3 дня): проверить API, формат файла, библиотеку. Результат — знание и оценка, а не функция для пользователя. Термин из XP.' },
      { term: 'Сторипоинт (story point)', simple: 'Условная единица сложности задачи по сравнению со знакомой задачей.', tech: 'Относительная оценка объёма, сложности и неопределённости. Единого мнения нет: одни команды оценивают в часах, другие — в сторипоинтах, третьи отказываются от оценок.' }
    ],
    outro: 'Передача задачи — разговор, а не конверт под дверью. Вопросы всплывут всё равно; ваша работа — чтобы они всплыли до кода: груминг, три амиго, примеры на границах, макет со всеми состояниями. Вы отвечаете в течение дня, честно говорите «не знаю — узнаю к 15:00», не решаете за бизнес и за команду и пишете «что», а не «как». Завтра — Лера и приёмка: как из этих же требований получаются тесты.',
    tasks: [howHandoff, howWhat, howDesign, chatTask, rwTask, scTask, dorTask, whyTask]
  });
})();
