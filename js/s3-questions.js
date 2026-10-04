/* Неделя 3, вторник 10:00: искусство вопроса.
   Теория (соседний пример — автомойка «Пена», владелец Сергей Викторович):
   «один вопрос — три ответа», галерея типов вопросов, правила The Mom Test и калиброванные вопросы Восса;
   воронка (прямая и обратная), мягкие «5 почему», контекстно-свободные и мета-вопросы Гауса и Вайнберга;
   зеркало, пауза, лейбл, перефразирование и ловушки (слова-туман, проклятие знания, «говорят ≠ делают»).
   Практика на «Колосе»: разобрать 12 вопросов по типам; мини-редактор «переписать плохой вопрос» с живой
   проверкой признаков и реакцией Нины; воронка по теме «сорванные торты» с проигрыванием разговора;
   лаборатория «5 почему» с Галиной Ивановной про Excel; активное слушание на записи звонка Игоря и ответ Игорю. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'questions';

  if (!document.getElementById('qst-css')) document.head.insertAdjacentHTML('beforeend', `<style id="qst-css">
    .qst-root, .qst-root .stack > * { min-width: 0; }
    .qst-root .seg button { white-space: normal; text-align: left; }
    .qst-root .btn.wrap { white-space: normal; text-align: left; justify-content: flex-start; }
    .qst-lbl { font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .qst-lbl.ok { color: var(--ok); } .qst-lbl.bad { color: var(--bad); } .qst-lbl.warn { color: var(--warn); }
    .qst-h { font: 600 16px/1.3 var(--f-brand); }
    .qst-two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px; align-items: start; }
    .qst-two > * { min-width: 0; }
    .qst-card { border: 1px solid var(--border); border-radius: 12px; background: var(--surface); padding: 12px 14px; display: grid; gap: 8px; min-width: 0; }
    .qst-card.ok { border-color: color-mix(in srgb, var(--ok) 55%, var(--border)); }
    .qst-card.warn { border-color: color-mix(in srgb, var(--warn) 55%, var(--border)); }
    .qst-card.bad { border-color: color-mix(in srgb, var(--bad) 55%, var(--border)); }
    .qst-learn { display: flex; flex-wrap: wrap; gap: 6px; }
    .qst-learn .chip, .qst-feats .chip { white-space: normal; }
    .qst-meterrow { display: grid; grid-template-columns: 110px minmax(0, 1fr) 46px; gap: 8px; align-items: center; font-size: 13px; }
    .qst-meterrow b { text-align: right; font-family: var(--f-mono); font-weight: 600; }
    .qst-types { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 6px; }
    .qst-tb { border: 1px solid var(--border-strong); border-left: 4px solid var(--ok); border-radius: 9px; background: var(--surface); padding: 7px 10px; text-align: left; font-size: 13.5px; color: var(--text); width: 100%; line-height: 1.3; }
    .qst-tb.bad { border-left-color: var(--bad); }
    .qst-tb[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .qst-def { display: grid; grid-template-columns: 130px minmax(0, 1fr); gap: 6px 14px; font-size: 14px; }
    .qst-def > .k { font: 600 11px/1.5 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); padding-top: 2px; }
    .qst-def > .v { min-width: 0; }
    .qst-flips { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 10px; }
    .qst-flip { border: 1px solid var(--border); border-left: 4px solid var(--bad); border-radius: 10px; padding: 10px 12px; background: var(--surface); display: grid; gap: 6px; align-content: start; font-size: 14px; text-align: left; color: var(--text); width: 100%; line-height: 1.4; }
    .qst-flip.on { border-left-color: var(--ok); }
    .qst-flip.cf { border-left-color: var(--info); }
    .qst-flip.cf.on { border-left-color: var(--accent); background: var(--surface-2); }
    .qst-sw { display: grid; grid-template-columns: 32px minmax(0, 1fr); gap: 8px; align-items: center; padding: 8px 10px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); text-align: left; color: var(--text); width: 100%; font-size: 14px; line-height: 1.4; }
    .qst-sw .sw { width: 30px; height: 18px; border-radius: 9px; background: var(--surface-3); border: 1px solid var(--border-strong); position: relative; }
    .qst-sw .sw::after { content: ""; position: absolute; top: 2px; left: 2px; width: 12px; height: 12px; border-radius: 50%; background: var(--text-muted); transition: left .15s; }
    .qst-sw[aria-pressed="true"] { border-color: var(--accent); }
    .qst-sw[aria-pressed="true"] .sw { background: var(--accent); border-color: var(--accent); }
    .qst-sw[aria-pressed="true"] .sw::after { left: 14px; background: var(--surface); }
    .qst-sw .chip { margin-right: 4px; }
    .qst-funnel { border: 1px solid var(--border); border-radius: 12px; background: var(--surface-2); padding: 8px; }
    .qst-funnel svg { display: block; margin: 0 auto; }
    .qst-dlg { display: grid; gap: 10px; }
    .qst-tip { font-size: 13px; color: var(--text-2); border-left: 3px solid var(--border-strong); padding: 2px 0 2px 10px; margin-left: 50px; }
    .qst-tip.ok { border-left-color: var(--ok); } .qst-tip.bad { border-left-color: var(--bad); } .qst-tip.warn { border-left-color: var(--warn); }
    .qst-opts { display: grid; gap: 6px; }
    .qst-opt { border: 1px solid var(--border-strong); border-radius: 10px; background: var(--surface); padding: 9px 12px; text-align: left; font-size: 14px; color: var(--text); width: 100%; line-height: 1.4; }
    .qst-opt:hover:not(:disabled) { border-color: var(--accent); background: var(--surface-2); }
    .qst-opt[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .qst-feats { display: flex; flex-wrap: wrap; gap: 6px; }
    .qst-rw { border: 1px solid var(--border); border-radius: 12px; padding: 12px 14px; background: var(--surface); display: grid; gap: 8px; }
    .qst-rw.ok { border-color: var(--ok); } .qst-rw.warn { border-color: var(--warn); } .qst-rw.bad { border-color: var(--bad); }
    .qst-old { font-size: 15px; line-height: 1.45; color: var(--text); }
    .qst-old::before { content: "✕ "; color: var(--bad); font-weight: 700; }
    .qst-rw textarea { min-height: 54px; }
    .qst-fog { font-size: 15.5px; line-height: 1.9; }
    .qst-fog button { border: 0; border-bottom: 2px dashed var(--warn); background: none; padding: 0 2px; font: inherit; color: var(--text); cursor: pointer; }
    .qst-fog button.on { background: var(--warn-soft); color: var(--warn); border-bottom-style: solid; border-radius: 4px 4px 0 0; }
    .qst-cols { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 10px; }
    .qst-cols > * { min-width: 0; }
    .qst-lab { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); gap: 16px; align-items: start; }
    .qst-lab > * { min-width: 0; }
    .qst-ladder { display: grid; gap: 4px; }
    .qst-rung { display: grid; grid-template-columns: 24px minmax(0, 1fr); gap: 8px; align-items: start; padding: 6px 10px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); font-size: 13px; line-height: 1.35; color: var(--text-muted); }
    .qst-rung .n { font: 700 12px/1.5 var(--f-mono); }
    .qst-rung.done { color: var(--text); border-color: color-mix(in srgb, var(--ok) 45%, var(--border)); }
    .qst-rung.cur { color: var(--text); border-color: var(--accent); background: var(--accent-soft); }
    .qst-rung.root.done { background: var(--ok-soft); }
    .qst-wr { font-size: 13.5px; padding: 6px 10px; border-radius: 8px; background: var(--bad-soft); border: 1px solid color-mix(in srgb, var(--bad) 35%, transparent); }
    .qst-wr.x { text-decoration: line-through; opacity: .7; }
    .qst-range { width: 100%; accent-color: var(--accent); }
    .qst-moment { display: grid; gap: 8px; }
    .qst-play > * { animation: qst-in .35s ease both; }
    @keyframes qst-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
    @media (prefers-reduced-motion: reduce) { .qst-play > * { animation: none; } }
    @media (max-width: 760px) {
      .qst-two, .qst-lab, .qst-cols { grid-template-columns: minmax(0, 1fr); }
      .qst-def { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .qst-def > .v { margin-bottom: 8px; }
    }
    @media (max-width: 440px) {
      .qst-meterrow { grid-template-columns: 92px minmax(0, 1fr) 40px; }
      .qst-tip { margin-left: 0; }
      .qst-fog { font-size: 14.5px; }
    }
  </style>`);

  // ---------- общие помощники ----------
  const fresh = fn => pane => { const d = document.createElement('div'); pane.appendChild(d); fn(d); };
  const chip = (t, k) => `<span class="chip ${k || ''}">${t}</span>`;
  const person = (name, ini, role) => html => `<div class="say"><div class="avatar" data-p="x" aria-hidden="true">${esc(ini)}</div><div class="bubble"><div class="who"><b>${esc(name)}</b>${role ? ' · ' + esc(role) : ''}</div><div>${html}</div></div></div>`;
  const SERG = person('Сергей Викторович', 'СВ', 'владелец автомойки «Пена»');
  const KATYA = person('Катя', 'К', 'администратор «Пены», третий день на работе');
  const ME = html => ui.say('me', html, { noWho: true });
  const meterRow = (label, r, k) => `<div class="qst-meterrow"><span>${label}</span>${ui.meter(r, k)}<b class="tnum">${Math.round(r * 100)}%</b></div>`;

  // =====================================================================
  // Теория 1. Какие бывают вопросы (соседний пример — автомойка «Пена»)
  // =====================================================================
  const THREE = [
    { v: 'lead', t: 'Наводящий', q: 'Вам ведь нужна онлайн-запись, правда?', a: 'Да, конечно. Сейчас у всех онлайн-запись.', learn: [], rel: 0.1, k: 'bad',
      note: 'Узнали только то, что Сергей Викторович вежливый. Ни одной цифры, ни одной причины. Через полгода окажется, что онлайн-записью пользуются три человека.' },
    { v: 'open', t: 'Открытый', q: 'Как сейчас клиенты попадают к вам на мойку?', a: 'Приезжают и ждут в очереди. По выходным очередь бывает большая, люди нервничают.', learn: ['по выходным очередь', 'клиенты нервничают'], rel: 0.5, k: 'warn',
      note: 'Уже картина, но общая: «бывает», «большая». Это рассказ о том, «как обычно», а не факт. Хорошее начало — дальше нужна конкретика.' },
    { v: 'past', t: 'О прошлом опыте', q: 'Расскажите про прошлую субботу: что было с очередью?', a: 'В одиннадцать стояло семь машин, двое развернулись и уехали. А с часу до трёх — пусто, мойщики сидели без дела. Постоянный клиент ругался: ждал пятьдесят минут.', learn: ['пик — суббота около 11:00', '2 машины из 7 уехали', 'с 13:00 до 15:00 простой', 'постоянный клиент ждал 50 минут'], rel: 0.95, k: 'ok',
      note: 'Цифры, время, поведение — и неожиданная находка: беда не в записи, а в том, что нагрузка неравномерная. Может, нужна не онлайн-запись, а скидка на «тихие часы».' }
  ];
  function drawThree(pane) {
    let cur = 'lead';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Соседний пример: Сергей Викторович, владелец автомойки «Пена», хочет «онлайн-запись». Тема одна — формулировки три. Переключайте и смотрите, что вы на самом деле узнаёте.</p>
      ${ui.seg('f', THREE.map(x => ({ v: x.v, t: esc(x.t) })), cur, 'accent')}
      <div data-out></div></div>`;
    function draw() {
      const x = THREE.find(i => i.v === cur);
      TR.$('[data-out]', pane).innerHTML = `<div class="stack">${ME(esc(x.q))}${SERG(esc(x.a))}
        <div class="qst-card ${x.k}"><span class="qst-lbl">Что попадёт в блокнот</span>
          <div class="qst-learn">${x.learn.length ? x.learn.map(l => chip(esc(l), 'ok')).join('') : chip('ничего, кроме вежливого «да»', 'bad')}</div>
          ${meterRow('Можно верить', x.rel, x.k === 'ok' ? '' : x.k)}
          <div class="small">${esc(x.note)}</div></div></div>`;
    }
    ui.onSeg(pane, (n, v) => { if (n === 'f') { cur = v; draw(); } });
    draw();
  }

  const TYPES = [
    { id: 'open', t: 'Открытый', good: true, def: 'На него нельзя ответить «да» или «нет»: человек рассказывает своими словами.', ex: '«Как сейчас клиенты записываются на мойку?»', when: 'Начало темы, сбор общей картины.', risk: 'Долгий ответ «обо всём». Дальше сужайте уточняющими вопросами.' },
    { id: 'clar', t: 'Уточняющий', good: true, def: 'Превращает размытое слово в цифру, пример или правило.', ex: '«Вы сказали „долго ждут“ — это сколько минут?»', when: 'Услышали «быстро», «много», «всегда», «как обычно».', risk: 'Почти нет. Задавайте его чаще, чем кажется нужным.' },
    { id: 'closed', t: 'Закрытый', good: true, def: 'Ответ — «да», «нет» или одно значение.', ex: '«Вы работаете в воскресенье?»', when: 'Проверить и зафиксировать конкретный факт.', risk: 'Если задать слишком рано, разговор сузится, и вы не узнаете того, о чём не догадались спросить.' },
    { id: 'alt', t: 'Альтернативный', good: true, def: 'Предлагает выбрать из нескольких вариантов.', ex: '«Оплату берёте до мойки или после?»', when: 'Варианты известны, нужно выбрать.', risk: 'Можно упустить третий вариант. Добавляйте «или как-то иначе?».' },
    { id: 'hypo', t: 'Гипотетический («что если»)', good: true, def: 'Проверяет правило на крайнем случае.', ex: '«Что делать, если клиент записался и не приехал?»', when: 'Исключения, правила, крайние случаи.', risk: 'Не годится для прогнозов «а вы бы купили?»: о будущем люди фантазируют.' },
    { id: 'past', t: 'О прошлом опыте', good: true, def: 'Просит рассказать конкретный случай, который уже был.', ex: '«Расскажите про прошлую субботу: что было с очередью?»', when: 'Узнать реальное поведение, цифры и причины.', risk: 'Почти нет. Самый надёжный тип вопроса (Роб Фитцпатрик, Тереза Торрес).' },
    { id: 'lead', t: 'Наводящий', good: false, def: 'В вопросе уже спрятан «правильный» ответ.', ex: '«Вам ведь нужна онлайн-запись?»', fix: '«Как сейчас клиенты попадают на мойку?»', risk: 'Человек соглашается из вежливости — вы записываете не его мнение, а своё.' },
    { id: 'double', t: 'Двойной', good: false, def: 'Два вопроса в одном.', ex: '«Сколько у вас боксов и как вы принимаете оплату?»', fix: 'Два отдельных вопроса — по одному за раз.', risk: 'Ответят на вторую половину, первая потеряется.' },
    { id: 'sol', t: 'С решением внутри', good: false, def: 'Обсуждает готовую вещь, а не проблему.', ex: '«Сделать вам бота в мессенджере для записи?»', fix: '«Как клиенты сейчас договариваются о времени? Где это неудобно?»', risk: 'Заказчик скажет «давайте!» — и вы сделаете то, что не решает его проблему.' },
    { id: 'jargon', t: 'С жаргоном', good: false, def: 'В вопросе слова, которых собеседник не знает.', ex: '«Какой SLA нужен для онлайн-записи?»', fix: '«Что будет, если запись не работает час в субботу утром?»', risk: 'Человек стесняется переспросить и отвечает наугад — или раздражается.' },
    { id: 'addr', t: 'Не по адресу', good: false, def: 'Этот человек не может или не должен на него отвечать.', ex: 'Владельцу: «Какую базу данных выбрать?»', fix: 'Владельцу — про бизнес. Базу выбирает команда разработки.', risk: 'Вы перекладываете свою работу на заказчика и тратите его доверие.' }
  ];
  function drawTypes(pane) {
    let cur = 'open', fix = false;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Нажмите тип вопроса. Зелёная полоса — рабочие инструменты, красная — ловушки. У ловушки есть кнопка «Как починить».</p>
      <div class="qst-types">${TYPES.map(x => `<button type="button" class="qst-tb ${x.good ? '' : 'bad'}" data-ty="${x.id}" aria-pressed="${x.id === cur}">${esc(x.t)}</button>`).join('')}</div>
      <div data-tyout></div></div>`;
    function draw() {
      const x = TYPES.find(i => i.id === cur);
      TR.$('[data-tyout]', pane).innerHTML = `<div class="qst-card ${x.good ? 'ok' : 'bad'}"><div class="row between"><b class="qst-h">${esc(x.t)}</b>${chip(x.good ? 'инструмент' : 'ловушка', x.good ? 'ok' : 'bad')}</div>
        <div class="qst-def"><span class="k">Что это</span><span class="v">${esc(x.def)}</span>
        <span class="k">Пример</span><span class="v">${esc(x.ex)}</span>
        ${x.good ? `<span class="k">Когда хорош</span><span class="v">${esc(x.when)}</span>` : ''}
        <span class="k">Риск</span><span class="v">${esc(x.risk)}</span>
        ${!x.good && fix ? `<span class="k">Как починить</span><span class="v">${chip('✓', 'ok')} ${esc(x.fix)}</span>` : ''}</div>
        ${x.good ? '' : `<div><button type="button" class="btn sm" data-fix aria-pressed="${fix}">${fix ? 'Скрыть' : 'Как починить'}</button></div>`}</div>`;
    }
    TR.on(pane, 'click', '[data-ty]', (e, b) => { cur = b.dataset.ty; fix = false; TR.$$('[data-ty]', pane).forEach(z => z.setAttribute('aria-pressed', String(z === b))); draw(); });
    TR.on(pane, 'click', '[data-fix]', () => { fix = !fix; draw(); });
    draw();
  }

  const MOM = [
    { rule: 'О жизни человека, а не о вашей идее', bad: '«Как вам идея онлайн-записи?»', good: '«Как клиенты сейчас договариваются о времени мойки?»', why: 'Идею хвалят из вежливости, особенно если её придумали вы. О своей жизни человек рассказывает честно.' },
    { rule: 'О конкретном прошлом, а не о мнениях о будущем', bad: '«Будете ли вы пользоваться онлайн-записью?»', good: '«Когда клиент в последний раз уехал из очереди? Что было дальше?»', why: 'Люди плохо предсказывают своё поведение и хорошо помнят, что делали. «Буду» не стоит ничего, «сделал» — факт.' },
    { rule: 'Меньше говорить, больше слушать', bad: 'Аналитик десять минут рассказывает, как здорово работает онлайн-запись у конкурентов.', good: 'Аналитик задаёт вопрос и молчит. Сам говорит примерно пятую часть времени.', why: 'Пока говорите вы, вы ничего не узнаёте. А заказчик подстраивается под ваш рассказ.' }
  ];
  const CAL = [
    { bad: '«Вам подходит запись за сутки?»', good: '«Как клиенты сейчас решают, когда приехать?»', a: 'Человек не соглашается, а рассказывает: в ответе — ваши будущие требования.' },
    { bad: '«Сроки реальные?»', good: '«Что поможет нам успеть к весне?»', a: 'Собеседник сам ищет условия успеха и называет риски, о которых вы не знали.' },
    { bad: '«Вы довольны тем, как сейчас работает запись?»', good: '«Что в записи сейчас отнимает больше всего времени?»', a: 'Вместо «да, нормально» — конкретное место боли.' }
  ];
  function drawMom(pane) {
    const on = MOM.map(() => false), cal = CAL.map(() => false);
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Три правила из книги Роба Фитцпатрика «Спроси маму» (The Mom Test): даже мама, которая вас любит и хочет поддержать, не соврёт, если спрашивать правильно. Нажмите карточку — плохой вопрос станет хорошим.</p>
      <div class="qst-flips" data-momlist></div>
      <div class="eyebrow">Калиброванные вопросы: «как» и «что» вместо «да / нет» (Крис Восс)</div>
      <div class="stack tight" data-callist></div></div>`;
    function draw() {
      TR.$('[data-momlist]', pane).innerHTML = MOM.map((m, i) => `<button type="button" class="qst-flip ${on[i] ? 'on' : ''}" data-mi="${i}"><span class="qst-lbl ${on[i] ? 'ok' : 'bad'}">Правило ${i + 1} · ${on[i] ? 'так лучше' : 'так ломается'}</span><b>${esc(m.rule)}</b><span>${esc(on[i] ? m.good : m.bad)}</span>${on[i] ? `<span class="small muted">${esc(m.why)}</span>` : '<span class="small dim">Нажмите, чтобы починить</span>'}</button>`).join('');
      TR.$('[data-callist]', pane).innerHTML = CAL.map((c, i) => `<button type="button" class="qst-sw" data-ci="${i}" aria-pressed="${cal[i]}"><span class="sw" aria-hidden="true"></span><span>${cal[i] ? chip('как / что', 'ok') + esc(c.good) + `<span class="small muted" style="display:block;margin-top:4px">${esc(c.a)}</span>` : chip('да / нет', 'bad') + esc(c.bad)}</span></button>`).join('');
    }
    TR.on(pane, 'click', '[data-mi]', (e, b) => { const i = +b.dataset.mi; on[i] = !on[i]; draw(); });
    TR.on(pane, 'click', '[data-ci]', (e, b) => { const i = +b.dataset.ci; cal[i] = !cal[i]; draw(); });
    draw();
  }

  const howTypes = {
    id: 'how-types', covers: ['classify', 'rewrite'], title: 'Как это работает: какие бывают вопросы', free: true, noReset: true,
    simple: {
      icon: '❓',
      plain: 'Вопрос — главный инструмент аналитика. От того, как он сформулирован, зависит, что вы унесёте со встречи: факт, мнение или вежливое «да».',
      analogy: 'Как врач на приёме. «Болит здесь?» — пациент кивнёт, лишь бы не спорить. «Расскажите, когда заболело в последний раз и что вы в тот момент делали?» — и врач слышит то, что на самом деле важно.',
      tech: 'Рабочие типы: открытые, уточняющие, закрытые, альтернативные, гипотетические («что если»), о прошлом опыте. Ловушки: наводящие, двойные, с решением внутри, с жаргоном, не по адресу. Правила The Mom Test (Роб Фитцпатрик, «Спроси маму»): о жизни человека, а не о вашей идее; о конкретном прошлом, а не о мнениях о будущем; меньше говорить. Калиброванные вопросы «как/что» — Крис Восс, «Никогда не идите на компромисс».'
    },
    lead: ui.brief({
      situation: 'Завтра у вас первое интервью с Ниной Сергеевной. Позиция аналитика: выявление требований — это прежде всего вопросы. На встрече вы спрашиваете, слушаете и записываете; на выходе — факты с цифрами, уточнения и список открытых вопросов. Механику разберём на соседнем примере: автомойка «Пена», её владелец хочет «онлайн-запись».',
      todo: [
        'Вкладка «Один вопрос — три ответа»: переключайте формулировку и сравнивайте, что попадает в блокнот и насколько этому можно верить.',
        'Вкладка «Типы вопросов»: нажмите каждый тип. У ловушек откройте «Как починить».',
        'Вкладка «The Mom Test»: переверните три карточки-правила и переключите три закрытых вопроса в калиброванные.'
      ],
      look: 'Шкала «Можно верить» — насколько ответ похож на факт, а не на вежливость или фантазию. Красный — ловушка, зелёный — рабочий инструмент.'
    }),
    render(el) {
      el.classList.add('qst-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'three', t: 'Один вопрос — три ответа', render: fresh(drawThree) },
        { id: 'types', t: 'Типы вопросов', render: fresh(drawTypes) },
        { id: 'mom', t: 'The Mom Test', render: fresh(drawMom) }
      ], 'three');
    }
  };

  // =====================================================================
  // Теория 2. Воронка, «5 почему», контекстно-свободные вопросы
  // =====================================================================
  const FUN = {
    dir: [
      { lv: 'Широко', q: 'Расскажите, как устроена у вас обычная суббота.', a: 'С девяти до двенадцати — очередь, потом затишье, к вечеру снова народ.', note: 'Открытый вопрос: человек сам выбирает, с чего начать, и вы видите картину целиком.' },
      { lv: 'Глубже', q: 'Что происходит, когда очередь доходит до семи машин?', a: 'Кто-то уезжает. А постоянные звонят заранее: «Серёжа, я буду в одиннадцать» — и я держу им бокс.', note: 'Уточняющий вопрос о том, что человек уже назвал. Всплывает неявное: «бронь по звонку» уже существует.' },
      { lv: 'Конкретно', q: 'Сколько машин уехало из очереди в прошлую субботу?', a: 'Двое точно. Может, трое.', note: 'Закрытый вопрос фиксирует цифру. Теперь он к месту: понятно, что именно считать.' },
      { lv: 'Проверка', q: 'Правильно понимаю: в субботу с десяти до двенадцати уезжают две-три машины, а постоянные уже бронируют по телефону?', a: 'Да, именно так. Кстати, бронь по телефону я иногда забываю записать.', note: 'Резюме ловит недопонимание сразу — и часто приносит бонус: человек добавляет то, что забыл.' }
    ],
    rev: [
      { lv: 'Конкретно', q: 'Сколько боксов работает сегодня?', a: 'Три.', note: 'Катя зажата и отвечает односложно. Простой факт — лёгкий старт: на него нетрудно ответить.' },
      { lv: 'Глубже', q: 'А какой из трёх загружен больше всего?', a: 'Второй. Там пылесос мощнее, туда все просятся.', note: 'От факта — к деталям. Человек начинает рассказывать сам.' },
      { lv: 'Широко', q: 'Расскажите, как вы решаете, какую машину в какой бокс поставить?', a: 'Ой, это целая история! Сначала смотрю, кто с салоном, потом…', note: 'Теперь можно и широкий вопрос: разговор уже идёт.' },
      { lv: 'Проверка', q: 'Правильно понимаю: машины с салоном вы ставите во второй бокс, а остальные — куда свободно?', a: 'Да. Только если второй занят, они ждут — и злятся.', note: 'Резюме в конце — как и в прямой воронке. И снова бонус.' }
    ]
  };
  const BANDS = { dir: [[400, 310], [310, 220], [220, 140], [140, 80]], rev: [[120, 200], [200, 290], [290, 400], [230, 120]] };
  function funnelSvg(mode, n) {
    const W = 420, BH = 40, GAP = 5, H = 4 * (BH + GAP) + 6;
    let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px" role="img" aria-label="${mode === 'dir' ? 'Прямая воронка вопросов' : 'Обратная воронка вопросов'}">`;
    FUN[mode].forEach((st, i) => {
      const [t, b] = BANDS[mode][i], y = 3 + i * (BH + GAP), cx = W / 2;
      const done = i < n, cur = i === n - 1;
      const fill = cur ? 'var(--accent-soft)' : done ? 'color-mix(in srgb, var(--accent) 10%, var(--surface))' : 'var(--surface)';
      const stroke = cur ? 'var(--accent)' : done ? 'color-mix(in srgb, var(--accent) 50%, var(--border-strong))' : 'var(--border-strong)';
      s += `<path d="M${cx - t / 2} ${y} L${cx + t / 2} ${y} L${cx + b / 2} ${y + BH} L${cx - b / 2} ${y + BH} Z" style="fill:${fill};stroke:${stroke};stroke-width:${cur ? 2 : 1.2};${done || cur ? '' : 'stroke-dasharray:5 4'}"/>`;
      s += `<text x="${cx}" y="${y + BH / 2 + 5}" text-anchor="middle" style="fill:${done || cur ? 'var(--text)' : 'var(--text-muted)'};font:600 13.5px var(--f-brand)">${i + 1}. ${esc(st.lv)}</text>`;
    });
    return s + '</svg>';
  }
  function drawFunnel(pane) {
    let mode = 'dir', n = 0;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Воронка вопросов: широко → глубже → конкретно → проверка. Прямая — для разговорчивого собеседника (Сергей Викторович). Обратная — когда человек зажат (Катя, администратор, третий день на работе): начинают с простого факта.</p>
      <div class="row">${ui.seg('fm', [{ v: 'dir', t: 'Прямая · с владельцем' }, { v: 'rev', t: 'Обратная · с новеньким администратором' }], mode, 'accent')}</div>
      <div class="qst-two"><div class="stack tight"><div class="qst-funnel" data-fsvg></div>
        <div class="row"><button type="button" class="btn sm primary" data-fn="next">Задать следующий вопрос</button><button type="button" class="btn sm ghost" data-fn="reset">⟲ Сначала</button></div></div>
        <div class="qst-dlg" data-fdlg></div></div></div>`;
    function draw() {
      TR.$('[data-fsvg]', pane).innerHTML = funnelSvg(mode, n);
      const who = mode === 'dir' ? SERG : KATYA, list = FUN[mode];
      const cur = list[n - 1];
      TR.$('[data-fdlg]', pane).innerHTML = n ? list.slice(0, n).map(x => ME(esc(x.q)) + who(esc(x.a))).join('') + (cur ? ui.note(n === 4 ? 'ok' : 'info', `${n}. ${cur.lv}`, esc(cur.note)) : '') : ui.note('info', 'Начните', 'Нажмите «Задать следующий вопрос» и смотрите, как сужается разговор.');
      const nb = TR.$('[data-fn="next"]', pane); if (nb) nb.disabled = n >= 4;
    }
    ui.onSeg(pane, (k, v) => { if (k === 'fm') { mode = v; n = 0; draw(); } });
    TR.on(pane, 'click', '[data-fn]', (e, b) => { if (b.dataset.fn === 'next') n = Math.min(4, n + 1); else n = 0; draw(); });
    draw();
  }

  const WHY = [
    { soft: 'Что к этому привело — почему именно сейчас?', harsh: 'Почему?', a: 'Клиенты уезжают из очереди по субботам.', ah: 'Ну… потому что сейчас у всех онлайн-запись.' },
    { soft: 'А что происходит перед тем, как они уезжают?', harsh: 'Почему они уезжают?', a: 'Ждут больше получаса и начинают нервничать.', ah: 'Потому что долго. Это же очевидно.' },
    { soft: 'Что занимает эти полчаса?', harsh: 'Почему так долго?', a: 'Машина с химчисткой салона моется минут сорок. А салон заказывают почти все.', ah: 'Не знаю. Мойщики медленные, наверное.' },
    { soft: 'Как получается, что салон заказывают почти все?', harsh: 'Почему все заказывают салон?', a: 'Так администратор предлагает его каждому: у него процент с салона.', ah: 'Слушайте, вы меня допрашиваете?' },
    { soft: 'Для чего администратору процент именно с салона?', harsh: 'Почему вы так платите администратору?', a: 'Хм… Я сам так придумал, чтобы выручка росла. Выходит, сам себе и устроил очередь.', ah: '(молчит и смотрит на часы)' }
  ];
  function drawWhy(pane) {
    let mode = 'soft', n = 0;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Сергей Викторович: «Нам нужна онлайн-запись». Техника «5 почему» пришла из Тойоты: спрашивать о причине, пока не дойдёте до корня. Проиграйте её дважды — жёстко и мягко — и следите за шкалой открытости.</p>
      <div class="row">${ui.seg('wm', [{ v: 'harsh', t: 'Жёстко: «Почему?»' }, { v: 'soft', t: 'Мягко: «что к этому привело?»' }], mode, 'accent')}</div>
      <div class="row"><button type="button" class="btn sm primary" data-w="next">Спросить ещё</button><button type="button" class="btn sm ghost" data-w="reset">⟲ Сначала</button></div>
      <div data-wout></div></div>`;
    function draw() {
      const harsh = mode === 'harsh';
      const open = harsh ? Math.max(5, 100 - n * 22) : 100;
      let h = SERG('Нам нужна онлайн-запись.');
      for (let i = 0; i < n; i++) h += ME(esc(harsh ? WHY[i].harsh : WHY[i].soft)) + SERG(esc(harsh ? WHY[i].ah : WHY[i].a));
      let tail = '';
      if (n === 5 && !harsh) tail = ui.note('ok', 'Корень найден', 'Администратор получает процент с химчистки салона и предлагает её всем, поэтому в пик одна машина занимает бокс на сорок минут. Онлайн-запись очередь не убрала бы: субботние окна так же заняли бы долгие мойки. Решения совсем другие — салон в «тихие часы» или другая схема оплаты администратора.');
      if (harsh && n >= 3) tail = ui.note('bad', 'Человек закрылся', 'Голое «почему?» звучит как допрос: человек защищается, а не вспоминает. На третьем «почему» вы получаете «это же очевидно», на четвёртом — раздражение. До корня не дошли.');
      TR.$('[data-wout]', pane).innerHTML = `<div class="stack">${meterRow('Открытость', open / 100, open >= 70 ? '' : open >= 40 ? 'warn' : 'bad')}<div class="qst-dlg">${h}</div>${tail}</div>`;
      const nb = TR.$('[data-w="next"]', pane); if (nb) nb.disabled = n >= 5;
    }
    ui.onSeg(pane, (k, v) => { if (k === 'wm') { mode = v; n = 0; draw(); } });
    TR.on(pane, 'click', '[data-w]', (e, b) => { if (b.dataset.w === 'next') n = Math.min(5, n + 1); else n = 0; draw(); });
    draw();
  }

  const CF = [
    { g: 'О процессе', q: 'Кто будет пользоваться результатом?', a: 'Клиенты — записываться. Администратор — видеть, кто когда приедет. Мойщики — знать, что их ждёт.', why: 'Список пользователей — первая версия карты заинтересованных лиц.' },
    { g: 'О процессе', q: 'Что будет, если ничего не делать?', a: 'По субботам будем и дальше терять пару машин. Зато летом и так полно клиентов.', why: 'Показывает цену проблемы. Иногда — что проблема не такая уж срочная.' },
    { g: 'О процессе', q: 'Когда это нужно — и почему именно тогда?', a: 'К весне: в апреле все моют машины после зимы.', why: 'Срок с причиной — уже требование. Срок без причины — пожелание.' },
    { g: 'О продукте', q: 'Какую проблему это решит?', a: 'Очередь по субботам.', why: 'Связывает «хотелку» с проблемой. Дальше можно проверить, решит ли.' },
    { g: 'О продукте', q: 'Какие проблемы это может создать?', a: 'Хм. Записался и не приехал — бокс простаивает. Об этом я не думал.', why: 'Самый недооценённый вопрос: у любого решения есть побочные эффекты.' },
    { g: 'О продукте', q: 'Какие ограничения точно есть?', a: 'Денег — до ста тысяч. И администратор должен освоить это за день.', why: 'Ограничения отсекают лишние варианты ещё до проектирования.' },
    { g: 'Мета-вопросы', q: 'Вы тот, кто может на это ответить?', a: 'Про деньги — я. А как записывают сейчас — спросите Катю на ресепшене.', why: 'Проверяете, что говорите с нужным человеком.' },
    { g: 'Мета-вопросы', q: 'Мои вопросы — про вашу проблему?', a: 'Вообще, меня больше волнует, что мойщики в обед сидят без дела.', why: 'Даёт собеседнику повернуть разговор туда, где у него болит.' },
    { g: 'Мета-вопросы', q: 'Кто ещё может рассказать больше?', a: 'Бухгалтер — про выручку по дням. И пара постоянных клиентов.', why: 'Расширяет круг заинтересованных лиц.' },
    { g: 'Мета-вопросы', q: 'Что я должен был спросить, но не спросил?', a: 'Про зиму! Зимой у нас совсем другая картина.', why: 'Человек сам находит дыру в вашем списке тем. Задают в конце встречи.' }
  ];
  function drawCF(pane) {
    const on = CF.map(() => false);
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Дональд Гаус и Джеральд Вайнберг («Exploring Requirements») собрали вопросы, которые подходят к любому проекту — их задают в самом начале. Нажмите карточку, чтобы услышать ответ Сергея Викторовича и узнать, что даёт вопрос.</p>
      <div data-cfl></div></div>`;
    function draw() {
      const groups = [...new Set(CF.map(c => c.g))];
      TR.$('[data-cfl]', pane).innerHTML = groups.map(g => `<div class="stack tight"><div class="eyebrow">${esc(g)}</div><div class="qst-flips">${CF.map((c, i) => c.g !== g ? '' : `<button type="button" class="qst-flip cf ${on[i] ? 'on' : ''}" data-cf="${i}"><b>«${esc(c.q)}»</b>${on[i] ? `<span>${esc(c.a)}</span><span class="small muted">${esc(c.why)}</span>` : '<span class="small dim">Нажмите — ответ и зачем спрашивать</span>'}</button>`).join('')}</div></div>`).join('');
    }
    TR.on(pane, 'click', '[data-cf]', (e, b) => { const i = +b.dataset.cf; on[i] = !on[i]; draw(); });
    draw();
  }

  const howFunnel = {
    id: 'how-funnel', covers: ['funnel', 'why5'], title: 'Как это работает: воронка, «5 почему» и вопросы на любой проект', free: true, noReset: true,
    simple: {
      icon: '🔻',
      plain: 'Хороший разговор идёт от общего к частному: сначала человек рассказывает картину, потом вы уточняете детали, фиксируете цифры и в конце сверяете, правильно ли поняли. А если ответ звучит как готовое решение, вы мягко спрашиваете «что к этому привело?», пока не доберётесь до настоящей причины.',
      analogy: 'Как опытный продавец в обувном. Не «вам кроссовки сорок второго?», а «для чего обувь — бегать, гулять?», потом «по асфальту или по лесу?», потом размер и цвет, и в конце: «Значит, для бега по лесу, сорок второй, не тяжёлые?»',
      tech: 'Воронка вопросов: открытый → уточняющие → закрытые для фиксации → резюме. Обратная воронка — от конкретного к широкому, когда собеседник зажат. «5 почему» — техника поиска корневой причины (Тойота); на интервью спрашивают мягко: «что к этому привело?», «для чего это вам?». Контекстно-свободные и мета-вопросы — Дональд Гаус, Джеральд Вайнберг, «Exploring Requirements».'
    },
    lead: ui.brief({
      situation: 'Соседний пример — снова автомойка «Пена». Здесь видно, как вопросы складываются в разговор: в каком порядке их задавать и как добраться от «нам нужна онлайн-запись» до настоящей причины.',
      todo: [
        'Вкладка «Воронка»: нажимайте «Задать следующий вопрос» и смотрите, как сужается разговор. Переключитесь на обратную воронку с новеньким администратором.',
        'Вкладка «5 почему»: проиграйте цепочку жёстко, потом мягко. Сравните, где закончился разговор.',
        'Вкладка «Вопросы на любой проект»: переверните карточки, особенно мета-вопросы.'
      ],
      look: 'Подсвеченная полоса воронки — уровень, на котором вы сейчас. Шкала «Открытость» в «5 почему» показывает, готов ли человек рассказывать дальше.'
    }),
    render(el) {
      el.classList.add('qst-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'fun', t: 'Воронка', render: fresh(drawFunnel) },
        { id: 'why', t: '5 почему', render: fresh(drawWhy) },
        { id: 'cf', t: 'Вопросы на любой проект', render: fresh(drawCF) }
      ], 'fun');
    }
  };

  // =====================================================================
  // Теория 3. Слушать: зеркало, пауза, лейбл, перефразирование, ловушки
  // =====================================================================
  const MIR = [
    { v: 'mirror', t: 'Зеркало: «…тяжело?»', a: 'Тяжело — не то слово. Двое мойщиков на четыре бокса, и один по субботам всегда отпрашивается.', got: 0.8, k: 'ok', note: 'Повторили последнее слово с вопросительной интонацией — человек продолжил и раскрыл деталь: дело не только в записи, но и в людях.' },
    { v: 'label', t: 'Лейбл: «Похоже, суббота вас выматывает»', a: 'Да! Я по субботам сам на мойке стою, потому что некому. Какая уж тут онлайн-запись.', got: 0.9, k: 'ok', note: 'Назвали чувство — человек понял, что его услышали, и сказал главное.' },
    { v: 'pause', t: 'Промолчать', k: '' },
    { v: 'new', t: 'Новый вопрос: «Сколько у вас боксов?»', a: 'Четыре.', got: 0.15, k: 'bad', note: 'Нить оборвалась. «Тяжело» осталось нераскрытым — вы перескочили на свою тему.' },
    { v: 'advice', t: 'Совет: «Вам надо нанять ещё мойщика»', a: 'Спасибо, сам знаю.', got: 0.05, k: 'bad', note: 'Вы перешли от вопросов к лекции (Эдгар Шейн, «Скромное вопрошание»). Человек закрылся.' }
  ];
  function pauseRes(sec) {
    if (sec < 2) return { a: '(Сергей Викторович ждёт вашего следующего вопроса.)', got: 0.1, k: 'bad', note: 'Меньше двух секунд — это не пауза, а заминка. Человек ждёт, что вы продолжите.' };
    if (sec < 3) return { a: '…Ну, вот так.', got: 0.3, k: 'warn', note: 'Почти. Ещё секунда-две — и человек начал бы заполнять тишину.' };
    if (sec <= 6) return { a: '…Вообще, если честно, я не знаю, сколько мы теряем по субботам. Никто не считал.', got: 0.75, k: 'ok', note: 'Около четырёх секунд тишины (Крис Восс) — человек сам продолжает и говорит то, что не собирался.' };
    return { a: '…Алло, вы меня слышите?', got: 0.2, k: 'warn', note: 'Слишком долго: пауза превратилась в неловкость.' };
  }
  function drawMirror(pane) {
    let cur = null, sec = 4;
    pane.innerHTML = `<div class="stack">
      ${SERG('Ну, в субботу у нас, конечно, тяжело.')}
      <p class="small muted">Что вы сделаете? Выберите реакцию и посмотрите, сколько человек расскажет дальше.</p>
      <div class="qst-opts">${MIR.map(m => `<button type="button" class="qst-opt" data-mr="${m.v}">${esc(m.t)}</button>`).join('')}</div>
      <div data-mrout></div></div>`;
    function draw() {
      TR.$$('[data-mr]', pane).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mr === cur)));
      const out = TR.$('[data-mrout]', pane);
      if (!cur) { out.innerHTML = ''; return; }
      if (cur === 'pause') {
        out.innerHTML = `<div class="qst-card"><label class="small" for="qst-pause">Сколько секунд молчать: <b class="tnum" data-sec>${sec}</b></label>
          <input id="qst-pause" class="qst-range" type="range" min="0" max="8" step="1" value="${sec}" data-pause><div class="stack tight" data-pres></div></div>`;
        drawPause();
        return;
      }
      const m = MIR.find(x => x.v === cur);
      out.innerHTML = `<div class="qst-card ${m.k}">${ME(esc(m.t.replace(/^[^:]+:\s*/, '')))}${SERG(esc(m.a))}${meterRow('Что получили', m.got, m.k === 'ok' ? '' : m.k)}<div class="small">${esc(m.note)}</div></div>`;
    }
    function drawPause() {
      const r = pauseRes(sec), box = TR.$('[data-pres]', pane); if (!box) return;
      TR.$('[data-sec]', pane).textContent = sec;
      box.innerHTML = `${ME('<span class="dim">(молчите ' + sec + ' ' + TR.plural(sec, 'секунду', 'секунды', 'секунд') + ')</span>')}${SERG(esc(r.a))}${meterRow('Что получили', r.got, r.k === 'ok' ? '' : r.k)}<div class="small">${esc(r.note)}</div>`;
    }
    TR.on(pane, 'click', '[data-mr]', (e, b) => { cur = b.dataset.mr; draw(); });
    pane.addEventListener('input', e => { if (!e.target.matches('[data-pause]')) return; sec = +e.target.value; drawPause(); });
    draw();
  }

  const PARA = [
    { t: '«Правильно понимаю: по субботам нагрузка неравномерная — утром очередь и клиенты уезжают, а в обед простой. И вам нужно, чтобы клиенты распределялись по дню?»', k: 'ok', a: 'Да, именно! Хотя… распределять — это же не обязательно запись. Можно скидку на обеденные часы дать.', note: 'Перефразирование своими словами, без своих решений. Человек слышит свою мысль со стороны — и сам находит новый вариант.' },
    { t: '«То есть вам нужна онлайн-запись с напоминаниями и предоплатой?»', k: 'bad', a: 'Ну… наверное. Про предоплату я не говорил, но если надо…', note: 'Это не перефразирование, а ваше решение с вашими добавками. Человек соглашается из вежливости.' },
    { t: '«Понятно».', k: 'warn', a: '(переходит к другой теме)', note: '«Понятно» ничего не проверяет. Если вы поняли не так, это всплывёт только на демо.' }
  ];
  function drawPara(pane) {
    let cur = -1;
    pane.innerHTML = `<div class="stack">
      ${SERG('Короче, по субботам с утра очередь, люди нервничают, кто-то уезжает. А в обед — пусто, мойщики сидят. Вот я и подумал: сделаем запись, пусть приезжают по времени.')}
      <p class="small muted">Как вы проверите, что поняли правильно? Выберите вариант.</p>
      <div class="qst-opts">${PARA.map((p, i) => `<button type="button" class="qst-opt" data-pa="${i}">${esc(p.t)}</button>`).join('')}</div>
      <div data-paout></div>
      ${ui.note('info', 'Лейбл — назвать чувство', '«Похоже, вас злит, что мойщики простаивают» → «Да! Я плачу им за то, что они сидят». Лейбл начинают со слов «похоже», «кажется», «судя по всему» — и не говорят «я понимаю, что вы чувствуете». Цель — услышать от собеседника «да, именно так» (Крис Восс).')}</div>`;
    function draw() {
      TR.$$('[data-pa]', pane).forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.pa === cur)));
      const p = PARA[cur];
      TR.$('[data-paout]', pane).innerHTML = p ? `<div class="qst-card ${p.k}">${SERG(esc(p.a))}<div class="small">${esc(p.note)}</div></div>` : '';
    }
    TR.on(pane, 'click', '[data-pa]', (e, b) => { cur = +b.dataset.pa; draw(); });
    draw();
  }

  const FOG = [
    { w: 'Обычно', q: '«Как это было в прошлую субботу?»' },
    { w: 'быстро', q: '«Быстро — это сколько минут на одну машину?»' },
    { w: 'всегда', q: '«Когда клиент последний раз был недоволен? Что случилось?»' },
    { w: 'иногда', q: '«Как часто — сколько раз за последний месяц?»' },
    { w: 'много', q: '«Много — это сколько машин в очереди?»' },
    { w: 'как-нибудь', q: '«Как именно справляетесь — кто что делает?»' }
  ];
  function drawTraps(pane) {
    const hit = FOG.map(() => false); let curse = false, look = false;
    pane.innerHTML = `<div class="stack">
      <div class="qst-card"><span class="qst-lbl warn">Ловушка 1 · слова-туман</span>
        <div class="small muted">Нажмите на каждое размытое слово в ответе Сергея Викторовича — появится уточняющий вопрос.</div>
        <div class="qst-fog" data-fog></div><div data-fogq></div></div>
      <div class="qst-card"><span class="qst-lbl warn">Ловушка 2 · проклятие знания</span>
        ${SERG('Открываемся в девять. Утром моем, вечером закрываемся. Всё просто.')}
        <div><button type="button" class="btn sm wrap" data-curse aria-pressed="${curse}">Спросить: «А что происходит между двенадцатью и тремя?»</button></div><div data-curseout></div></div>
      <div class="qst-card"><span class="qst-lbl warn">Ловушка 3 · говорят ≠ делают</span>
        <div class="qst-cols"><div class="stack tight"><span class="eyebrow">Говорит</span>${SERG('Всех клиентов записываем в журнал.')}</div><div class="stack tight" data-does></div></div>
        <div><button type="button" class="btn sm" data-look aria-pressed="${look}">Посмотреть на месте</button></div></div>
    </div>`;
    function draw() {
      const words = ['', ' у нас всё ', ', клиенты ', ' довольны. Ну, ', ' бывает ', ' народу, но мы ', ' справляемся.'];
      TR.$('[data-fog]', pane).innerHTML = '«' + FOG.map((f, i) => esc(words[i]) + `<button type="button" class="${hit[i] ? 'on' : ''}" data-fw="${i}">${esc(f.w)}</button>`).join('') + esc(words[6]) + '»';
      const n = hit.filter(Boolean).length;
      TR.$('[data-fogq]', pane).innerHTML = `${meterRow('Найдено', n / FOG.length, n === FOG.length ? '' : 'warn')}${n ? `<ul class="checks">${FOG.map((f, i) => hit[i] ? `<li><b>${esc(f.w)}</b> → ${esc(f.q)}</li>` : '').join('')}</ul>` : ''}${n === FOG.length ? '<div class="small muted">В одной фразе — шесть слов, за которыми может прятаться что угодно. Каждое превращаем в цифру или конкретный случай.</div>' : ''}`;
      TR.$('[data-curseout]', pane).innerHTML = curse ? SERG('А, ну в два часа приезжает машина с химией, один бокс на час закрыт. Это все знают.') + '<div class="small muted">Для Сергея Викторовича это очевидно — поэтому он и не сказал. Ищите провалы во времени и в шагах: «а что происходит между…?». В «Колосе» так легко пропустить, например, второй развоз выпечки в 11:00.</div>' : '';
      TR.$('[data-does]', pane).innerHTML = `<span class="eyebrow">Делает</span>${look ? ui.note('warn', 'На ресепшене', 'Журнал пустой с прошлой недели. Катя помнит постоянных в лицо, остальных пишет на стикеры на мониторе.') + '<div class="small muted">Сказанное подтверждают наблюдением. В четверг вы пойдёте на смену в пекарню на Покровке именно за этим.</div>' : '<div class="small dim">Пока не видели своими глазами.</div>'}`;
      TR.$('[data-curse]', pane).setAttribute('aria-pressed', String(curse));
      TR.$('[data-look]', pane).setAttribute('aria-pressed', String(look));
    }
    TR.on(pane, 'click', '[data-fw]', (e, b) => { hit[+b.dataset.fw] = true; draw(); });
    TR.on(pane, 'click', '[data-curse]', () => { curse = !curse; draw(); });
    TR.on(pane, 'click', '[data-look]', () => { look = !look; draw(); });
    draw();
  }

  const howListen = {
    id: 'how-listen', covers: ['listen'], title: 'Как это работает: слушать так, чтобы рассказали больше', free: true, noReset: true,
    simple: {
      icon: '👂',
      plain: 'Половина информации приходит не от вопросов, а от того, как вы слушаете. Повторили последние слова, помолчали, назвали чувство, пересказали своими словами — и человек говорит то, о чём вы бы не догадались спросить.',
      analogy: 'Как хороший друг, которому вы жалуетесь на день. Он не перебивает советами, а переспрашивает: «…начальник опять?» — и вы сами рассказываете, что случилось на самом деле.',
      tech: 'Активное слушание: зеркало (повторить 1–3 последних слова с вопросительной интонацией), пауза около 4 секунд, лейбл («похоже, вас тревожит…») — Крис Восс; перефразирование и резюме («правильно понимаю, что…?»); «спрашивать, а не рассказывать» — Эдгар Шейн, «Скромное вопрошание». Ловушки: слова-туман, проклятие знания, «говорят ≠ делают».'
    },
    lead: ui.brief({
      situation: 'Соседний пример — снова автомойка «Пена». Вопрос задан, человек ответил. Что дальше? От вашей реакции зависит, продолжит ли он и скажет ли главное.',
      todo: [
        'Вкладка «Зеркало и пауза»: попробуйте все пять реакций. Для паузы подвигайте ползунок секунд.',
        'Вкладка «Перефразирование»: выберите, как сверить понимание, и сравните реакции.',
        'Вкладка «Ловушки»: найдите шесть слов-туманов, задайте вопрос о провале во времени и посмотрите, что делают на самом деле.'
      ],
      look: 'Шкала «Что получили» — сколько нового человек рассказал после вашей реакции.'
    }),
    render(el) {
      el.classList.add('qst-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'mir', t: 'Зеркало и пауза', render: fresh(drawMirror) },
        { id: 'para', t: 'Перефразирование', render: fresh(drawPara) },
        { id: 'traps', t: 'Ловушки', render: fresh(drawTraps) }
      ], 'mir');
    }
  };

  // =====================================================================
  // Практика 1. Разберите 12 вопросов по типам
  // =====================================================================
  const CHOICES = [
    { v: 'open', t: 'Открытый' }, { v: 'closed', t: 'Закрытый' }, { v: 'alt', t: 'Альтернативный' }, { v: 'clar', t: 'Уточняющий' },
    { v: 'hypo', t: 'Гипотетический («что если»)' }, { v: 'past', t: 'О прошлом опыте' }, { v: 'lead', t: 'Наводящий' },
    { v: 'double', t: 'Двойной' }, { v: 'sol', t: 'С решением внутри' }, { v: 'jargon', t: 'Жаргон или не по адресу' }
  ];
  const CLS = [
    { id: 'c1', t: '«Как сейчас кассир принимает заказ торта по телефону?»', ok: ['open'], hint: 'можно ли ответить на него одним словом?', why: 'Открытый: ответ — рассказ о процессе.' },
    { id: 'c2', t: '«Торт с надписью можно забрать в другой пекарне, не там, где заказывали?»', ok: ['closed'], hint: 'сколько вариантов ответа у этого вопроса?', why: 'Закрытый: «да» или «нет». Хорош, чтобы зафиксировать правило.' },
    { id: 'c3', t: '«За торт берёте предоплату или всю сумму при выдаче?»', ok: ['alt'], hint: 'обратите внимание на «или».', why: 'Альтернативный: выбор из двух. Не забудьте спросить «или как-то иначе?».' },
    { id: 'c4', t: 'Нина: «Утром очередь огромная». Вы: «Огромная — это сколько человек?»', ok: ['clar'], hint: 'что этот вопрос делает со словом «огромная»?', why: 'Уточняющий: превращает слово-туман в число.' },
    { id: 'c5', t: '«Что делать кассиру, если покупатель пришёл за предзаказом на час раньше?»', ok: ['hypo'], hint: 'это про то, что уже было, или про возможный случай?', why: 'Гипотетический «что если»: проверяет правило на крайнем случае.' },
    { id: 'c6', t: '«Расскажите про последний заказ торта, который сорвался: что произошло?»', ok: ['past', 'open'], hint: 'о каком времени этот вопрос?', why: 'О прошлом опыте: конкретный случай показывает реальный процесс (Тереза Торрес). Он ещё и открытый, но главное в нём — история.' },
    { id: 'c7', t: '«Вам ведь нужно приложение как у Додо?»', ok: ['lead', 'sol'], hint: 'какой ответ подсказан в самом вопросе?', why: 'Наводящий: «ведь» подсказывает ответ «да». Заодно и решение внутри.' },
    { id: 'c8', t: '«Сколько тортов вы делаете в день и как их доставляете?»', ok: ['double'], hint: 'сколько вопросов здесь спрятано?', why: 'Двойной: ответят на одну половину — скорее всего, на вторую.' },
    { id: 'c9', t: '«Сделать в приложении кнопку „Повторить заказ“?»', ok: ['sol', 'closed'], hint: 'что обсуждает вопрос — проблему или готовую вещь?', why: 'С решением внутри: Нина скажет «давайте!», а зачем эта кнопка — так и не узнаем. Формально он ещё и закрытый.' },
    { id: 'c10', t: 'Нине: «Какой SLA нужен для API приёма заказов?»', ok: ['jargon'], hint: 'знает ли Нина эти слова? И её ли это вопрос?', why: 'Жаргон и не по адресу: SLA и API Нина не знает. Цифры доступности аналитик выводит сам — из её бизнеса.' },
    { id: 'c11', t: '«Будут ли покупатели заказывать выпечку заранее, если появится приложение?»', ok: ['hypo', 'closed'], hint: 'о каком времени этот вопрос — и можно ли верить ответу?', why: 'Гипотетический — но о будущем поведении. По The Mom Test такому ответу верить нельзя: люди плохо предсказывают, что будут делать. Формально он ещё и закрытый.' },
    { id: 'c12', t: '«Что для вас будет означать, что проект удался?»', ok: ['open'], hint: 'можно ли ответить «да» или «нет»?', why: 'Открытый калиброванный «что»-вопрос (Крис Восс): человек сам называет критерии успеха.' }
  ];
  function clsEval(m) {
    let pts = 0; const res = {};
    CLS.forEach(r => {
      const v = m && m[r.id]; let s = 'none';
      if (v) { if (v === r.ok[0]) { pts += 1; s = 'ok'; } else if (r.ok.includes(v)) { pts += 0.75; s = 'warn'; } else s = 'bad'; }
      res[r.id] = s;
    });
    return { pts, score: pts / CLS.length, res };
  }
  const classifyTask = {
    id: 'classify', title: 'Разберите 12 вопросов по типам',
    simple: howTypes.simple,
    lead: ui.brief({
      situation: 'Завтра в 10:00 интервью с Ниной Сергеевной. Ксения собрала черновик вопросов от всей команды: что-то написал Игорь, что-то Дима, что-то вы сами. «Прежде чем брать список на встречу, разберёмся, что это за вопросы. Часть из них подарит нам только вежливое „да“».',
      todo: [
        'Для каждого из 12 вопросов выберите тип в выпадающем списке справа (на телефоне — под вопросом).',
        'Нажмите «Проверить». Засчитывается от 80 % верных ответов.'
      ],
      lookTitle: 'Как решать',
      look: 'Задайте себе три вопроса. Можно ли ответить «да» или «нет»? Есть ли в вопросе подсказка ответа или готовое решение? О каком времени он — о конкретном случае в прошлом, о возможной ситуации или о будущем поведении? Если вопрос попадает в две категории, выберите главную. После проверки у строк появятся пояснения: зелёные — почему верно, красные — куда смотреть.'
    }),
    blank: () => ({ m: {} }),
    reference: () => ({ m: Object.fromEntries(CLS.map(r => [r.id, r.ok[0]])) }),
    render(el, ctx) {
      el.classList.add('qst-root');
      const m = (ctx.ans && ctx.ans.m) || {}, ev = clsEval(m);
      let reveal = null;
      if (ctx.result || ctx.readonly) {
        reveal = {};
        CLS.forEach(r => {
          const s = ctx.readonly ? 'ok' : ev.res[r.id]; if (s === 'none') return;
          reveal[r.id] = { s, why: s === 'bad' ? 'Подсказка: ' + esc(r.hint) : (s === 'warn' ? 'Засчитано, но главное другое. ' : '') + esc(r.why) };
        });
      }
      const box = document.createElement('div'); el.appendChild(box);
      ui.match(box, { rows: CLS.map(r => ({ id: r.id, t: esc(r.t) })), choices: CHOICES, value: m, readonly: ctx.readonly, reveal, placeholder: 'Тип вопроса…', onChange: v => ctx.save({ m: v }) });
    },
    check(ans) {
      const m = (ans && ans.m) || {}, ev = clsEval(m), notes = [];
      CLS.forEach(r => {
        const s = ev.res[r.id];
        if (s === 'none') notes.push({ ok: false, html: `${esc(r.t)} — тип не выбран.` });
        else if (s === 'bad') notes.push({ ok: false, html: `${esc(r.t)} — ${esc(r.hint)}` });
        else if (s === 'warn') notes.push({ ok: 'warn', html: `${esc(r.t)} — засчитано, но посмотрите, что в нём главное.` });
      });
      const traps = ['c7', 'c8', 'c9', 'c10'].filter(id => ev.res[id] === 'ok' || ev.res[id] === 'warn').length;
      return {
        ok: ev.score >= 0.8, score: ev.score, notes: notes.slice(0, 7),
        summary: `Верно: ${Math.round(ev.score * 100)} %. Ловушек распознано: ${traps} из 4.`,
        mentor: traps < 3 ? 'Ловушки опаснее всего: на них Нина ответит вежливым «да», и вы унесёте со встречи собственную догадку. Ищите в вопросе «ведь», готовую вещь, два вопроса сразу и слова, которых Нина не знает.' : (ev.res.c11 === 'bad' ? 'Посмотрите ещё раз на вопрос про «будут ли заказывать заранее». О каком времени он — и что люди обычно отвечают на такие вопросы?' : null)
      };
    },
    explain: `<p>Каждый тип — инструмент для своей задачи. Открытые вопросы начинают тему, уточняющие превращают туман в цифры, закрытые и альтернативные фиксируют правила, «что если» проверяет крайние случаи, а истории о прошлом показывают реальное поведение.</p>
      <ul class="checks">
        <li><b>Самый коварный — №11.</b> «Будут ли покупатели заказывать заранее?» звучит разумно, но это вопрос о будущем поведении. Нина ответит «конечно, будут» — из веры в свою идею. Роб Фитцпатрик называет такие ответы ложным позитивом.</li>
        <li><b>Наводящий и с решением внутри часто ходят парой:</b> «Вам ведь нужно приложение как у Додо?» Нина с удовольствием согласится — она сама так написала в письме. А вы не узнаете, что на самом деле болит.</li>
        <li><b>Жаргон — это ещё и не по адресу.</b> Даже если Нина поймёт слово SLA, решать про доступность в цифрах — работа аналитика. У неё спрашивают, что будет с бизнесом, если приём заказов не работает час утром.</li>
        <li><b>№12 — калиброванный вопрос:</b> «что» вместо «да/нет». Нина сама назовёт критерии успеха — и они станут бизнес-целями проекта.</li>
      </ul>
      <p class="small muted">Источники: Роб Фитцпатрик, «Спроси маму» (The Mom Test); Тереза Торрес, «Continuous Discovery Habits»; Крис Восс, «Никогда не идите на компромисс».</p>`,
    report: ans => CLS.map(r => `- ${r.t} → ${(CHOICES.find(c => c.v === ((ans && ans.m) || {})[r.id]) || { t: '—' }).t}${r.ok.includes(((ans && ans.m) || {})[r.id]) ? '' : ' ✗'}`).join('\n')
  };

  // =====================================================================
  // Практика 2. Мини-редактор: переписать плохие вопросы
  // =====================================================================
  const RW = [
    { id: 'r1', bad: 'Вам ведь нужно приложение как у Додо?', issues: ['наводящий', 'решение внутри'], topic: /(покуп|клиент|заказ|очеред|круассан|выпеч|утр|приход|касс|забира|ухо)/, theme: 'как покупатели сейчас покупают выпечку и почему уходят',
      good: 'Как сейчас покупатель получает круассан, если пришёл в 9:10?', nina: 'Да никак! К девяти круассанов уже нет. Люди разворачиваются и уходят к конкурентам — я это из окна вижу каждое утро.' },
    { id: 'r2', bad: 'Какой SLA и сколько RPS должен держать бэкенд в утренний пик?', issues: ['жаргон', 'не по адресу', 'двойной'], topic: /(утр|пик|очеред|касс|человек|покупател|народ|горяч|люд)/, theme: 'что происходит утром в самое горячее время',
      good: 'Расскажите, что было у кассы на Покровке вчера с половины восьмого до девяти?', nina: 'Вчера? Очередь до двери, человек десять. Одна кассир на кофе, вторая на выпечке, и обе не успевают.' },
    { id: 'r3', bad: 'Будут ли покупатели пользоваться баллами?', issues: ['о будущем', 'закрытый'], topic: /(балл|карточ|лояльн|кофе|подар|постоянн|скидк|акци|бонус)/, theme: 'как сейчас поощряют постоянных покупателей',
      good: 'Что сейчас происходит с бумажными карточками «седьмой кофе в подарок» у постоянных покупателей?', nina: 'Многие теряют их через неделю. А у кого не теряются — в кошельке по нескольку штук, и кассир путается, какую штамповать.' },
    { id: 'r4', bad: 'Сколько тортов вы делаете в день, почему они теряются и кто в этом виноват?', issues: ['тройной', 'поиск виноватых'], topic: /(торт)/, theme: 'сорванные заказы тортов',
      good: 'Расскажите про последний сорванный заказ торта: что произошло по шагам?', nina: 'Пришла женщина за тортом на юбилей мамы, а у нас он записан на завтра. Кто записывал — не помнят, тетрадь вся исчёркана. Кондитер сделал торт за два часа, но надпись уже не та.' },
    { id: 'r5', bad: 'Сделаем Галине Ивановне выгрузку заказов в Excel?', issues: ['решение внутри', 'закрытый'], topic: /(галин|технолог|план|цех|выпеч|заказ|печ)/, theme: 'как технолог узнаёт о заказах, когда считает план выпечки',
      good: 'Как Галина Ивановна сейчас узнаёт о заказах, когда считает план выпечки на завтра?', nina: 'Девочки с касс звонят ей вечером и диктуют. Она пишет на листочек и прибавляет к плану. Ну и бывает — до кого-то не дозвонились.' }
  ];
  const RF = [
    { id: 'open', t: 'открытый', hint: 'начните с «как», «что», «расскажите» — так, чтобы не было ответа «да / нет».' },
    { id: 'nolead', t: 'без подсказки ответа', hint: 'уберите «ведь», «правда же», «не так ли», «да?» в конце — они подсказывают ответ.' },
    { id: 'nosol', t: 'без решения внутри', hint: 'в вопросе не должно быть готовой вещи: приложения, кнопки, экрана, Excel, выгрузки.' },
    { id: 'plain', t: 'без жаргона', hint: 'Нина не знает слов SLA, API, бэкенд — скажите это словами пекарни.' },
    { id: 'single', t: 'один вопрос', hint: 'оставьте один вопрос: остальные задайте следующими.' },
    { id: 'concrete', t: 'о реальном случае или о том, как сейчас', hint: 'спросите о конкретном случае или о том, как это происходит сейчас: «в последний раз», «вчера», «сейчас».' }
  ];
  const RF_ORDER = ['nolead', 'plain', 'nosol', 'single', 'open', 'concrete'];
  const OPEN_W = ['как', 'каким', 'какой', 'какая', 'какие', 'какое', 'каких', 'какую', 'каком', 'какими', 'что', 'чем', 'чего', 'чему', 'сколько', 'когда', 'почему', 'зачем', 'где', 'кто', 'кого', 'кому', 'кем', 'откуда', 'куда', 'отчего'];
  const OPEN_S = ['расскаж', 'опиш', 'покаж', 'вспомн', 'привед', 'подели', 'объясн'];
  const LEAD_PH = ['не так ли', 'правда же', 'не правда ли', 'разве не', 'вам же', 'вы же', 'конечно же', 'же нужн', 'согласитесь'];
  const SOL_S = ['приложени', 'кнопк', 'экран', 'excel', 'эксел', 'выгрузк', 'сделаем', 'сделать', 'сделайте', 'добавим', 'добавить', 'внедр', 'автоматиз', 'додо', 'пуш', 'push', 'планшет', 'бот', 'телеграм', 'чат-бот'];
  const JAR_X = ['api', 'апи', 'sla', 'rps', 'crm', 'mvp', 'ui', 'ux', 'json', 'rest', 'kpi'];
  const JAR_S = ['бэкенд', 'бекенд', 'backend', 'фронтенд', 'frontend', 'субд', 'эндпоинт', 'endpoint', 'интеграц', 'юзер', 'фич', 'бэклог', 'спринт', 'сервер', 'транзакц', 'юзкейс', 'дашборд', 'database'];
  const CONC_S = ['последн', 'прошл', 'вчера', 'позавчер', 'недавн', 'сейчас', 'сегодн', 'случа', 'пример', 'был', 'произош', 'происход'];
  const INTERR = '(как|что|сколько|когда|почему|зачем|кто|где|какие|какой|какая|каким|какую|куда|откуда)';
  const SKIP_HEAD = ['нина', 'сергеевна', 'галина', 'ивановна', 'павел', 'олег', 'петрович', 'рита', 'а', 'и', 'вот', 'скажите', 'подскажите', 'пожалуйста', 'так', 'ну'];
  function qFeatures(text) {
    const raw = String(text || '').trim(), n = TR.norm(raw), tk = n.split(' ').filter(Boolean);
    const head = tk.slice(); while (head.length && SKIP_HEAD.includes(head[0])) head.shift();
    const w0 = head[0] || '', w1 = head[1] || '';
    const isOpenWord = w => OPEN_W.includes(w) || OPEN_S.some(s => w.startsWith(s));
    const open = !tk.includes('ли') && (isOpenWord(w0) || (['в', 'с', 'о', 'на', 'по', 'при', 'для', 'из-за', 'от', 'за', 'про'].includes(w0) && isOpenWord(w1)));
    const lead = tk.includes('ведь') || tk.includes('наверняка') || LEAD_PH.some(p => (' ' + n + ' ').includes(' ' + p + ' ')) || /,\s*(да|правда|верно)\s*\?\s*$/i.test(raw);
    const sol = tk.some(t => SOL_S.some(s => t.startsWith(s)));
    const jar = tk.some(t => JAR_X.includes(t) || JAR_S.some(s => t.startsWith(s))) || /(^| )(база|базу|базы|базе|базой) данн/.test(n);
    const single = (raw.match(/\?/g) || []).length <= 1 && !new RegExp(' (и|или|а также|а) ' + INTERR + '( |$)').test(n);
    const concrete = tk.some(t => CONC_S.some(s => t.startsWith(s)));
    return { raw, n, empty: raw.length < 12, f: { open, nolead: !lead, nosol: !sol, plain: !jar, single, concrete } };
  }
  function rwEval(r, text) {
    const q = qFeatures(text);
    if (q.empty) return { empty: true, f: {}, k: 0, topical: false, pass: false, score: 0 };
    const k = RF.filter(x => q.f[x.id]).length, topical = r.topic.test(q.n);
    return { empty: false, f: q.f, k, topical, pass: k === RF.length && topical, score: (k / RF.length) * (topical ? 1 : 0.5) };
  }
  function ninaReact(r, ev) {
    if (ev.empty) return 'Нина ждёт вопроса.';
    if (!ev.f.nolead) return 'Да, конечно! (Кивает. Вы узнали только то, что она вежливая.)';
    if (!ev.f.plain) return 'Это вы сейчас с кем разговаривали? Скажите по-русски.';
    if (!ev.f.nosol) return 'Давайте! И ещё бы… (Нина с удовольствием обсуждает решение — а потребность так и не прозвучала.)';
    if (!ev.f.single) return '(Нина отвечает на последнюю часть вопроса. Первая потерялась.)';
    if (!ev.f.open) return '«Да». (Пауза. Нина ждёт следующего вопроса.)';
    if (!ev.topical) return 'Хороший вопрос, только про другое. Исходная тема была: ' + r.theme + '.';
    if (!ev.f.concrete) return 'Ну, обычно… наверное… (Нина рассуждает «как обычно» и «как будет» — без случаев и цифр.)';
    return r.nina;
  }
  function rwLive(r, text) {
    const ev = rwEval(r, text);
    return `<div class="qst-feats">${RF.map(x => chip((ev.f[x.id] ? '✓ ' : '✕ ') + esc(x.t), ev.empty ? '' : ev.f[x.id] ? 'ok' : 'bad')).join('')}${ev.empty ? '' : chip(ev.topical ? '✓ та же тема' : '✕ другая тема', ev.topical ? 'ok' : 'bad')}</div>${ui.say('nina', esc(ninaReact(r, ev)))}`;
  }
  const rewriteTask = {
    id: 'rewrite', title: 'Почините пять плохих вопросов',
    simple: howTypes.simple,
    lead: ui.brief({
      situation: 'Игорь прислал в чат проекта свои вопросы к завтрашнему интервью: «Накидал, чтобы не тратить время». Ксения: «Каждый из них Нина либо не поймёт, либо вежливо согласится. Перепишите так, чтобы она рассказала, как всё устроено на самом деле».',
      todo: [
        'Под каждым плохим вопросом напишите свой вариант на ту же тему.',
        'Под полем сразу видны признаки хорошего вопроса и реакция Нины. Добивайтесь, чтобы все признаки стали зелёными, а Нина начала рассказывать.',
        'Нажмите «Проверить». Засчитывается, если хотя бы четыре вопроса из пяти проходят все признаки, а общий балл — от 80 %.'
      ],
      lookTitle: 'Как устроен редактор',
      look: 'Редактор проверяет признаки по словам: начинается ли вопрос с «как», «что», «расскажите»; нет ли «ведь» и «да?» в конце; нет ли готовой вещи (приложение, кнопка, Excel) и жаргона; один ли это вопрос; есть ли «сейчас», «вчера», «в последний раз». Тема должна остаться той же — её подсказывает реакция Нины. Смысл редактор не понимает: перечитайте свой вопрос глазами Нины.'
    }),
    blank: () => ({ t: {} }),
    reference: () => ({ t: Object.fromEntries(RW.map(r => [r.id, r.good])) }),
    render(el, ctx) {
      el.classList.add('qst-root');
      const a = ctx.ans; a.t = a.t || {};
      el.innerHTML = `<div class="stack">${RW.map((r, i) => `<div class="qst-rw" data-rw="${r.id}">
        <div class="row between"><span class="qst-lbl">Вопрос ${i + 1}</span><span class="row" style="gap:4px">${r.issues.map(x => chip(esc(x), 'bad')).join('')}</span></div>
        <div class="qst-old">«${esc(r.bad)}»</div>
        <textarea rows="2" data-rwi="${r.id}" placeholder="Ваш вариант вопроса Нине…" aria-label="Новая формулировка вопроса ${i + 1}" ${ctx.readonly ? 'readonly' : ''}>${esc(a.t[r.id] || '')}</textarea>
        <div data-rwl="${r.id}"></div></div>`).join('')}</div>`;
      const paint = id => {
        const r = RW.find(x => x.id === id), ev = rwEval(r, a.t[id]), box = TR.$(`[data-rw="${id}"]`, el);
        TR.$(`[data-rwl="${id}"]`, el).innerHTML = rwLive(r, a.t[id]);
        box.classList.remove('ok', 'warn', 'bad');
        if (ctx.result || ctx.readonly) box.classList.add(ev.pass ? 'ok' : ev.score >= 0.6 ? 'warn' : 'bad');
      };
      RW.forEach(r => paint(r.id));
      if (ctx.readonly) return;
      el.addEventListener('input', e => {
        const ta = e.target.closest('[data-rwi]'); if (!ta) return;
        a.t[ta.dataset.rwi] = ta.value; ctx.save(); paint(ta.dataset.rwi);
      });
    },
    check(ans) {
      const t = (ans && ans.t) || {};
      const ev = RW.map(r => ({ r, e: rwEval(r, t[r.id]) }));
      const pass = ev.filter(x => x.e.pass).length, score = ev.reduce((s, x) => s + x.e.score, 0) / RW.length;
      const notes = ev.map((x, i) => {
        if (x.e.empty) return { ok: false, html: `Вопрос ${i + 1}: нового варианта пока нет.` };
        if (x.e.pass) return { ok: true, html: `Вопрос ${i + 1}: Нина начнёт рассказывать.` };
        const miss = RF_ORDER.map(id => RF.find(f => f.id === id)).filter(f => !x.e.f[f.id]);
        if (!miss.length) return { ok: 'warn', html: `Вопрос ${i + 1}: тема ушла в сторону. Исходный вопрос был про то, ${esc(x.r.theme)}.` };
        return { ok: x.e.k >= 5 ? 'warn' : false, html: `Вопрос ${i + 1}: ${esc(miss[0].hint)}${x.e.topical ? '' : ' И проверьте тему: исходный вопрос был про то, ' + esc(x.r.theme) + '.'}` };
      });
      return {
        ok: pass >= 4 && score >= 0.8, score, notes,
        summary: `Вопросов, которые проходят все признаки: ${pass} из ${RW.length}. Общий балл: ${Math.round(score * 100)} %.`,
        mentor: ev.filter(x => !x.e.empty && x.e.f.open && !x.e.f.concrete).length >= 2 ? 'Открытый вопрос «вообще» — уже хорошо, но Нина ответит, «как обычно», и о том, «как будет». Привяжите вопрос к реальности: «сейчас», «вчера», «последний раз».' : null
      };
    },
    explain: `<p>Как могли бы выглядеть исправленные вопросы:</p>
      <ul class="checks">
        <li>«Вам ведь нужно приложение как у Додо?» → <b>«Как сейчас покупатель получает круассан, если пришёл в 9:10?»</b> — о жизни покупателя, а не о вашей идее.</li>
        <li>«Какой SLA и сколько RPS…» → <b>«Расскажите, что было у кассы на Покровке вчера с половины восьмого до девяти?»</b> — нагрузку в цифрах аналитик выведет сам из её рассказа.</li>
        <li>«Будут ли пользоваться баллами?» → <b>«Что сейчас происходит с бумажными карточками у постоянных покупателей?»</b> — прошлое поведение вместо прогноза.</li>
        <li>Тройной вопрос про торты → <b>«Расскажите про последний сорванный заказ торта: что произошло по шагам?»</b> — одна история вместо трёх вопросов, и без поиска виноватых.</li>
        <li>«Сделаем выгрузку в Excel?» → <b>«Как Галина Ивановна сейчас узнаёт о заказах, когда считает план?»</b> — сначала процесс, решение потом.</li>
      </ul>
      <p>Заметьте: «кто виноват» убран не только ради одного вопроса. Поиск виноватых закрывает людей — они начинают защищаться, а не рассказывать (Эдгар Шейн, «Скромное вопрошание»).</p>
      <p class="small muted">Источники: Роб Фитцпатрик, «Спроси маму»; Тереза Торрес, «Continuous Discovery Habits»; PRACTICES: типы вопросов и ловушки.</p>`,
    refNote: 'Формулировки — пример. Засчитывается любой вопрос на ту же тему, который открытый, без подсказки ответа, без решения и жаргона, один и о реальном случае.',
    report: ans => RW.map((r, i) => { const t = ((ans && ans.t) || {})[r.id] || ''; const e = rwEval(r, t); return `- ${i + 1}. «${r.bad}» → «${t || '—'}» ${e.pass ? '✓' : '✗ (' + e.k + '/6' + (e.topical ? '' : ', другая тема') + ')'}`; }).join('\n')
  };

  // =====================================================================
  // Практика 3. Воронка по теме «сорванные торты»
  // =====================================================================
  const FBK = [
    { id: 'wide', t: '1 · Широко', sub: 'общая картина' },
    { id: 'deep', t: '2 · Глубже', sub: 'истории и детали' },
    { id: 'exact', t: '3 · Конкретно', sub: 'цифры и правила' },
    { id: 'check', t: '4 · Проверка', sub: 'резюме и мета-вопрос' },
    { id: 'skip', t: 'Не задавать', sub: 'ловушки' }
  ];
  const FN = [
    { id: 'f1', t: 'Расскажите, как сейчас принимают заказ торта — от звонка до выдачи.', ok: ['wide'], hint: 'с какого вопроса удобно начать, чтобы Нина сама выбрала, с чего рассказывать?', a: 'Звонят или пишут в мессенджер, девочки записывают в тетрадь на кассе, фото пересылают кондитеру, накануне Галина Ивановна переписывает всё на лист для цеха… Ох, сколько шагов, оказывается.', ins: 'процесс: звонок → тетрадь → мессенджер → лист для цеха' },
    { id: 'f2', t: 'Расскажите про последний сорванный заказ торта: что произошло по шагам?', ok: ['deep', 'wide'], hint: 'это история о конкретном случае — она углубляет общую картину.', a: 'Пришла женщина за тортом на юбилей мамы, а у нас он записан на завтра. Кто записывал — не помнят, тетрадь вся исчёркана.', ins: 'история: перепутали дату, тетрадь исчёркана' },
    { id: 'f3', t: 'На каком шаге заказ чаще всего теряется — в тетради, в мессенджере или в цеху?', ok: ['deep'], hint: 'вопрос опирается на уже рассказанное и копает в одно место.', a: 'Чаще всего — когда заказ приняли в мессенджере и не переписали в тетрадь. Фото вообще приходит девочкам в личный телефон.', ins: 'где теряется: мессенджер ↔ тетрадь, фото в личном телефоне' },
    { id: 'f4', t: 'Что было на 8 Марта в прошлом году, когда тортов стало много?', ok: ['deep'], hint: 'это история о самом тяжёлом случае — деталь общей картины.', a: 'Сто сорок тортов за три дня. Девять заказов потеряли, в соцсетях был скандал.', ins: '8 Марта: 140 тортов за 3 дня, 9 потеряно' },
    { id: 'f5', t: 'Сколько заказов тортов срывается за обычную неделю?', ok: ['exact'], hint: 'ответ на этот вопрос — одно число.', a: 'Два-три. Каждую неделю.', ins: '2–3 сорванных заказа в неделю' },
    { id: 'f6', t: 'За сколько времени до праздника вы готовы принять торт?', ok: ['exact'], hint: 'ответ — одно правило с цифрой.', a: 'Минимум за двое суток. И с предоплатой половины.', ins: 'торт — минимум за 48 часов, предоплата 50 %' },
    { id: 'f7', t: 'Правильно понимаю: торты срываются, потому что заказ живёт в тетради и в личных мессенджерах, и к 8 Марта это превращается в десятки потерь?', ok: ['check'], hint: 'чтобы сверить понимание, нужно, чтобы было что сверять.', a: 'Да, именно так. И ещё — кондитер узнаёт о надписи пересказом, а не видит сам.', ins: 'подтверждено + надпись кондитеру пересказывают' },
    { id: 'f8', t: 'Что я не спросил про торты, а это для вас важно?', ok: ['check'], hint: 'мета-вопрос задают, когда темы уже пройдены.', a: 'Спросите Галину Ивановну, сколько цех вообще может. В праздники мы берём больше, чем успеваем.', ins: 'кого спросить: Галина Ивановна — мощность цеха' },
    { id: 'f9', t: 'Вам ведь нужен раздел «Торты» в приложении, как у Додо?', ok: ['skip'], hint: 'какой ответ подсказан в самом вопросе?', bad: 'Да, конечно, как у Додо!', why: 'вежливое «да», ничего не узнали' },
    { id: 'f10', t: 'Сколько тортов вы делаете и как их доставляете?', ok: ['skip'], hint: 'сколько вопросов спрятано в одном?', bad: 'А возит их Лёша, на своей машине.', why: 'двойной: ответ только на вторую половину' },
    { id: 'f11', t: 'Какие поля должны быть в карточке заказа торта?', ok: ['skip'], hint: 'чья это работа — Нины или аналитика?', bad: 'Какие поля? Это ваша работа, я же не программист.', why: 'не по адресу: минус доверие' }
  ];
  function fnRun(m) {
    const seq = [];
    ['wide', 'deep', 'exact', 'check'].forEach(l => FN.filter(c => m[c.id] === l).forEach(c => seq.push(c)));
    const firstLv = seq.length ? m[seq[0].id] : null;
    const lines = [], got = [];
    seq.forEach((c, i) => {
      const lv = m[c.id];
      if (c.ok[0] === 'skip') { lines.push({ c, a: c.bad, k: 'bad', note: c.why }); return; }
      if (c.ok[0] === 'check' && i < 2) { lines.push({ c, a: 'Ну… вроде да. Мы же ещё толком ничего не обсудили.', k: 'warn', note: 'резюме раньше времени — сверять ещё нечего' }); return; }
      if (c.ok[0] === 'exact' && i === 0) { lines.push({ c, a: c.a, k: 'warn', note: 'начали с цифры: Нина ответила числом и замолчала, картины процесса нет' }); got.push(c.ins); return; }
      lines.push({ c, a: c.a, k: c.ok.includes(lv) ? 'ok' : 'warn', note: c.ok.includes(lv) ? '' : 'не на своём уровне воронки' });
      got.push(c.ins);
    });
    return { lines, got, firstLv, total: FN.filter(c => c.ins).length };
  }
  function fnEval(m) {
    let pts = 0; const res = {};
    FN.forEach(c => { const v = m[c.id]; let s = 'none'; if (v) { if (v === c.ok[0]) { pts += 1; s = 'ok'; } else if (c.ok.includes(v)) { pts += 0.75; s = 'warn'; } else s = 'bad'; } res[c.id] = s; });
    return { res, score: pts / FN.length, trapsIn: FN.filter(c => c.ok[0] === 'skip' && m[c.id] && m[c.id] !== 'skip').length };
  }
  const funnelTask = {
    id: 'funnel', title: 'Соберите воронку: сорванные торты',
    simple: howFunnel.simple,
    lead: ui.brief({
      situation: 'На интервью у вас будет минут восемь на торты — главную боль Нины перед 8 Марта. Ксения: «Соберите из этих карточек разговор: с чего начнёте, куда углубитесь, что зафиксируете цифрой и как проверите, что поняли. Три карточки на встречу брать нельзя — найдите их».',
      todo: [
        'Разложите 11 карточек по пяти корзинам: «Широко», «Глубже», «Конкретно», «Проверка» и «Не задавать». Нажмите карточку, потом корзину; на компьютере можно перетаскивать.',
        'Под раскладкой нажмите «▶ Проиграть разговор» — Ксения сыграет Нину и ответит на ваши вопросы в том порядке, который получился. Меняйте раскладку и проигрывайте снова.',
        'Нажмите «Проверить». Засчитывается от 85 % верных мест, и ни одна ловушка не должна попасть в разговор.'
      ],
      lookTitle: 'Как читать разговор',
      look: 'Вопросы звучат по корзинам: сначала «Широко», потом «Глубже», «Конкретно», «Проверка». Зелёная реплика — вопрос на своём месте, жёлтая — не на своём уровне, красная — ловушка. Шкала «Что узнали» — сколько важного Нина рассказала. Начнёте с цифры — получите цифру и тишину; резюме в начале — «мы же ещё ничего не обсудили».'
    }),
    blank: () => ({ m: {} }),
    reference: () => ({ m: Object.fromEntries(FN.map(c => [c.id, c.ok[0]])) }),
    render(el, ctx) {
      el.classList.add('qst-root');
      const a = ctx.ans; a.m = a.m || {};
      const sortBox = document.createElement('div'), simBox = document.createElement('div');
      el.appendChild(sortBox); el.appendChild(simBox);
      let reveal = null;
      if (ctx.result || ctx.readonly) { const ev = fnEval(a.m); reveal = {}; FN.forEach(c => { const s = ctx.readonly ? 'ok' : ev.res[c.id]; if (s !== 'none') reveal[c.id] = s; }); }
      function drawSim(play) {
        const r = fnRun(a.m);
        simBox.innerHTML = `<div class="stack" style="margin-top:12px">
          <div class="row between"><span class="eyebrow">Разговор с Ниной</span>${ctx.readonly ? '' : '<button type="button" class="btn sm primary" data-play>▶ Проиграть разговор</button>'}</div>
          ${meterRow('Что узнали', r.got.length / r.total, r.got.length >= r.total ? '' : 'warn')}
          ${r.lines.length ? `<div class="qst-dlg ${play ? 'qst-play' : ''}">${r.lines.map(x => `${ME(esc(x.c.t))}${ui.say('nina', esc(x.a))}${x.note ? `<div class="qst-tip ${x.k}">${esc(x.note)}</div>` : ''}`).join('')}</div>` : '<div class="small dim">Разложите карточки по уровням воронки — здесь появится разговор.</div>'}
          ${r.got.length ? `<div class="qst-learn">${r.got.map(g => chip(esc(g), 'ok')).join('')}</div>` : ''}</div>`;
        if (play) TR.$$('.qst-play > *', simBox).forEach((s, i) => { s.style.animationDelay = (i * 0.2) + 's'; });
      }
      ui.sort(sortBox, { items: FN.map(c => ({ id: c.id, t: esc(c.t) })), buckets: FBK, value: a.m, readonly: ctx.readonly, reveal, seed: 'qst-funnel', onChange: m => { a.m = m; ctx.save(); drawSim(false); } });
      TR.on(simBox, 'click', '[data-play]', () => drawSim(true));
      drawSim(false);
    },
    check(ans) {
      const m = (ans && ans.m) || {}, ev = fnEval(m), notes = [];
      FN.forEach(c => {
        const s = ev.res[c.id];
        if (s === 'none') notes.push({ ok: false, html: `«${esc(c.t)}» — не разложено.` });
        else if (s === 'bad') notes.push({ ok: false, html: `«${esc(c.t)}» — ${esc(c.hint)}` });
      });
      const r = fnRun(m);
      return {
        ok: ev.score >= 0.85 && !ev.trapsIn, score: ev.score, notes: notes.slice(0, 7),
        summary: `На своих местах: ${Math.round(ev.score * 100)} %. Ловушек в разговоре: ${ev.trapsIn}. Нина рассказала ${r.got.length} из ${r.total} важных вещей.`,
        mentor: r.firstLv === 'exact' ? 'Вы начали с цифры. Цифру вы получите — а картину процесса нет: Нина ответит «два-три» и будет ждать следующего вопроса. Сначала дайте ей рассказать.' : (ev.trapsIn ? 'В разговор попала ловушка. Проиграйте его и посмотрите, что ответила Нина на эту карточку.' : null)
      };
    },
    explain: `<p>Сильная воронка по тортам:</p>
      <ol>
        <li><b>Широко:</b> «Расскажите, как сейчас принимают заказ торта — от звонка до выдачи». Нина сама проходит все шаги: тетрадь, мессенджер, фото, лист для цеха.</li>
        <li><b>Глубже:</b> история о последнем сорванном заказе (Тереза Торрес), «на каком шаге теряется» и самое тяжёлое — 8 Марта. Тут всплывает то, чего нет в письме: фото приходит в личный телефон, кондитер узнаёт о надписи пересказом.</li>
        <li><b>Конкретно:</b> цифры и правила — 2–3 срыва в неделю, торт за 48 часов с предоплатой 50 %.</li>
        <li><b>Проверка:</b> резюме «правильно понимаю…» и мета-вопрос «что я не спросил?». Резюме приносит бонус, мета-вопрос — следующего собеседника: Галину Ивановну и мощность цеха.</li>
      </ol>
      <p>«Расскажите про последний сорванный заказ» засчитывается и как широкий вопрос: история — хороший способ начать тему. Ловушки не задают вовсе: наводящий даёт вежливое «да», двойной теряет половину, а поля карточки — работа аналитика, не Нины.</p>
      <p class="small muted">Источники: воронка вопросов и обратная воронка — практика интервью (PRACTICES §1.3); Тереза Торрес, «Continuous Discovery Habits»; мета-вопросы — Гаус и Вайнберг, «Exploring Requirements».</p>`,
    report: ans => { const m = (ans && ans.m) || {}; return FBK.map(b => `- ${b.t}: ${FN.filter(c => m[c.id] === b.id).map(c => '«' + c.t + '»').join('; ') || '—'}`).join('\n'); }
  };

  // =====================================================================
  // Практика 4. Лаборатория «5 почему»: Галина Ивановна и Excel
  // =====================================================================
  const ROOT_A = 'Чтобы предзаказы сами попадали в мой план. Переписывать руками я не буду: в одиннадцать вечера я уже ничего не вижу. Мне не Excel нужен — мне нужно, чтобы план сходился сам.';
  const W5_START = 'Нина Сергеевна написала, что мне нужен Excel со всеми заказами. Да, нужен. Что тут обсуждать?';
  const W5 = [
    { layer: 'Решение: «Excel со всеми заказами»', opts: [
      { id: 'g0', k: 'good', q: 'Расскажите, как вы вчера составляли план выпечки на завтра?', a: 'Вчера? В одиннадцать вечера села за Excel. Беру продажи прошлой недели, смотрю погоду — и прикидываю на глаз. Торты мне кассиры надиктовали по телефону, я их дописала на листок.', tip: 'История о последнем случае: вместо мнения — реальный процесс.' },
      { id: 'h0', k: 'harsh', q: 'Почему именно Excel? Это же прошлый век.', a: 'Потому что я в нём двадцать лет работаю. Вопрос закрыт?', d: -30, tip: '«Почему» с оценкой звучит как упрёк. Человек защищается, а не рассказывает.' },
      { id: 'l0', k: 'lead', q: 'То есть вам нужна выгрузка всех заказов в Excel каждый вечер, да?', a: 'Ну… да, наверное. Нина же так и написала.', d: -10, wrong: 'Технологу нужна ежевечерняя выгрузка заказов в Excel', tip: 'Наводящий вопрос: Галина Ивановна согласилась с вашей формулировкой. Это ваши слова, а не её потребность.' },
      { id: 's0', k: 'sol', q: 'Давайте мы вам вместо Excel сделаем экран на планшете?', a: 'Мне без разницы, на чём. Я в планшетах не разбираюсь — и не хочу.', d: -15, tip: 'Решение раньше проблемы: обсуждаете «на чём», не узнав «зачем».' }
    ] },
    { layer: 'Процесс: план в 23:00 «на глаз», торты — со слов кассиров', opts: [
      { id: 'g1', k: 'good', q: 'Что вы потом делаете с заказами, которые вам надиктовали?', a: 'Прибавляю к плану. Если на утро заказали круассаны — значит, для этой точки их надо испечь больше обычного. И машину загрузить правильно.', tip: 'Открытый вопрос о том, что человек уже назвал, — шаг вглубь.' },
      { id: 'h1', k: 'harsh', q: 'Почему по телефону? Это же неудобно.', a: 'Потому что так быстрее. Вы меня экзаменуете?', d: -25, tip: 'Опять «почему» с оценкой. Галина Ивановна начинает оправдываться.' },
      { id: 'l1', k: 'lead', q: 'Значит, главное — чтобы все заказы были в Excel, правильно?', a: 'Ну да. Я же сказала — Excel.', d: -10, wrong: 'Главное для технолога — видеть заказы в Excel', tip: 'Вы подставили свою формулировку — и получили её же обратно.' },
      { id: 's1', k: 'sol', q: 'А если кассиры будут сразу вносить заказы в общую таблицу в облаке?', a: 'Ещё одна таблица? Они и в тетрадь-то не всё записывают.', d: -10, tip: 'Снова решение вместо вопроса. Хотя попутно всплыло важное: в тетрадь записывают не всё.' }
    ] },
    { layer: 'Действие: предзаказы прибавляют к плану точки', opts: [
      { id: 'g2', k: 'good', q: 'Что будет, если какой-то заказ к вам не попадёт?', a: 'Утром на точке его не окажется. Покупатель заплатил, пришёл — а круассанов нет. И виновата, конечно, буду я.', tip: '«Что если» проверяет последствия и вскрывает риск.' },
      { id: 'h2', k: 'harsh', q: 'Почему вы до сих пор считаете на глаз, а не по формуле?', a: 'Потому что погода, праздники… Вы когда-нибудь пекли?', d: -30, tip: 'Упрёк в форме вопроса. Открытость падает.' },
      { id: 'l2', k: 'lead', q: 'Получается, вам нужна программа, которая сама прогнозирует план, да?', a: 'Ну… может быть. Если она умная.', d: -10, wrong: 'Технологу нужен автоматический прогноз плана выпечки', tip: 'Подсказали ответ — получили вежливое «может быть». Прогноз — ваша идея, а не её боль.' },
      { id: 's2', k: 'sol', q: 'Нужна ли вам интеграция плана выпечки с бэкендом заказов через API?', a: 'Я не понимаю ни слова. Можно по-русски?', d: -15, tip: 'Жаргон: Галина Ивановна не знает этих слов — и не обязана.' }
    ] },
    { layer: 'Риск: заказ потерялся — утром круассанов нет', opts: [
      { id: 'g3', k: 'good', root: true, q: 'Для чего вам видеть каждый заказ — что для вас в итоге самое важное?', a: ROOT_A, tip: 'Мягкое «для чего» — то же «почему», только без допроса.' },
      { id: 'm3', k: 'good', root: true, q: '…виноваты будете вы?', a: 'Конечно я! План мой. Поэтому мне и надо, чтобы ни один заказ не терялся по дороге: пусть предзаказы сами попадают в мой план. Переписывать руками я не буду — в одиннадцать вечера я уже ничего не вижу.', tip: 'Зеркало (Крис Восс): повторили последние слова — и Галина Ивановна договорила главное сама.' },
      { id: 'h3', k: 'harsh', q: 'Почему вы боитесь, что виноваты будете вы?', a: 'Это уже допрос. Давайте закончим.', d: -35, tip: 'Жёсткое «почему» о чувствах звучит как обвинение.' },
      { id: 'l3', k: 'lead', q: 'То есть Excel со всеми заказами и решит проблему, верно?', a: 'Наверное… Если там будут все.', d: -10, wrong: 'Excel со всеми заказами решит проблему технолога', tip: 'Вы вернули разговор к решению из письма — и Галина Ивановна вежливо согласилась.' }
    ] },
    { layer: 'Корень: предзаказы сами попадают в план выпечки', root: true, opts: [
      { id: 'g4', k: 'bonus', q: 'А что для вас самое страшное в предзаказах?', a: 'Что вы пообещаете покупателю круассан к семи утра. Первая партия на точке бывает в двадцать минут восьмого, а если машина в пробке — позже. Раньше половины восьмого я ничего не гарантирую.', tip: 'Корень найден — и один вопрос о страхах принёс ещё одно ограничение. Его тоже в блокнот.' }
    ] }
  ];
  const W5_ALL = W5.flatMap(L => L.opts);
  function w5Run(path) {
    const st = { lv: 0, open: 100, wrongs: [], leads: 0, harsh: 0, root: false, bonus: false, closed: false, fin: false, log: [] };
    (Array.isArray(path) ? path : []).forEach(id => {
      if (st.closed || st.fin) return;
      if (id === 'fin') { st.fin = st.log.length > 0; return; }
      const L = W5[st.lv]; if (!L) return;
      const o = L.opts.find(x => x.id === id); if (!o) return;
      st.log.push({ q: o.q, a: o.a, k: o.k, tip: o.tip });
      if (o.d) st.open = Math.max(0, st.open + o.d);
      if (o.k === 'harsh') st.harsh++;
      if (o.wrong) { st.leads++; if (!st.wrongs.includes(o.wrong)) st.wrongs.push(o.wrong); }
      if (o.k === 'good') { st.lv++; st.open = Math.min(100, st.open + 5); if (o.root) st.root = true; }
      if (o.k === 'bonus') { st.bonus = true; st.lv++; }
      if (st.open <= 30) { st.closed = true; st.log.push({ a: 'Всё, мне пора — у меня партия в печи.', k: 'end' }); }
    });
    return st;
  }
  function w5Concl(st) {
    if (st.root) return { ok: true, t: 'Предзаказы должны сами попадать в план выпечки — без переписывания руками.' };
    if (st.wrongs.length) return { ok: false, t: st.wrongs[st.wrongs.length - 1] + '.', why: 'Это ваша формулировка, с которой Галина Ивановна вежливо согласилась.' };
    const L = W5[Math.min(st.lv, W5.length - 1)];
    return { ok: false, t: L.layer.replace(/^[^:]+:\s*/, '') + '.', why: 'Это ещё не причина, а слой выше неё.' };
  }
  const why5Task = {
    id: 'why5', title: 'Лаборатория «5 почему»: Галина Ивановна и Excel',
    simple: howFunnel.simple,
    lead: ui.brief({
      situation: 'Пункт 5 письма Нины: «Чтобы технолог видел все заказы в Excel». Ксения: «Это решение, а не потребность. До смены в цеху ещё два дня — давайте отрепетируем разговор с Галиной Ивановной. Я буду играть её так, как она отвечает на самом деле. Неправильный вопрос даст вам неправильный ответ — и вы не заметите».',
      todo: [
        'Выбирайте вопрос из четырёх вариантов. Галина Ивановна отвечает, а Ксения коротко комментирует ход.',
        'Следите за шкалой «Открытость» и лестницей справа: где вы сейчас — на уровне решения, процесса или уже у корня.',
        'Когда решите, что докопались до сути, нажмите «Зафиксировать вывод». Если разговор зашёл в тупик, нажмите «Начать заново».',
        'Нажмите «Проверить». Засчитывается, если вывод — настоящая потребность технолога, а открытость не ниже 50 %.'
      ],
      lookTitle: 'Как читать лабораторию',
      look: 'Открытость падает от жёстких «почему» с оценкой, от готовых решений и жаргона. Ниже 30 % Галина Ивановна уходит к печи. Наводящий вопрос открытость почти не тратит — зато добавляет в блокнот запись, с которой она согласилась из вежливости. Такая запись — ложный ответ: выглядит как факт, но это ваши слова.'
    }),
    blank: () => ({ path: [] }),
    reference: () => ({ path: ['g0', 'g1', 'g2', 'g3', 'g4', 'fin'] }),
    render(el, ctx) {
      el.classList.add('qst-root');
      const a = ctx.ans; a.path = Array.isArray(a.path) ? a.path : [];
      el.innerHTML = `<div class="qst-lab"><div class="stack"><div class="qst-dlg" data-dlg></div><div data-opts></div></div><div class="stack tight" data-side></div></div>`;
      function draw() {
        const st = w5Run(a.path);
        let h = ui.say('galya', esc(W5_START));
        st.log.forEach(x => {
          if (x.q) h += ME(esc(x.q));
          h += ui.say('galya', esc(x.a));
          if (x.tip) h += `<div class="qst-tip ${x.k === 'good' || x.k === 'bonus' ? 'ok' : x.k === 'lead' ? 'warn' : 'bad'}"><b>Ксения:</b> ${esc(x.tip)}</div>`;
        });
        TR.$('[data-dlg]', el).innerHTML = h;
        const box = TR.$('[data-opts]', el);
        if (ctx.readonly) box.innerHTML = '';
        else if (st.closed || st.fin) {
          const c = w5Concl(st);
          box.innerHTML = `${st.fin ? ui.note(c.ok ? 'ok' : 'warn', 'Ваш вывод', esc(c.t) + (c.why ? ' <span class="small">' + esc(c.why) + '</span>' : '')) : ui.note('bad', 'Разговор окончен', 'Галина Ивановна ушла к печи. Вывода нет.')}
            <div class="row"><button type="button" class="btn sm" data-w5="restart">⟲ Начать разговор заново</button></div>`;
        } else {
          const L = W5[st.lv], opts = L ? TR.shuffle(L.opts, 'w5-' + st.lv) : [];
          box.innerHTML = `<div class="stack tight"><span class="eyebrow">Ваш следующий вопрос</span><div class="qst-opts">${opts.map(o => `<button type="button" class="qst-opt" data-w5="${o.id}">${esc(o.q)}</button>`).join('')}</div>
            <div class="row">${st.log.length ? '<button type="button" class="btn sm primary" data-w5="fin">Зафиксировать вывод</button>' : ''}${st.log.length ? '<button type="button" class="btn sm ghost" data-w5="restart">⟲ Начать заново</button>' : ''}</div></div>`;
        }
        const rungs = W5.map((L, i) => {
          const done = i < st.lv || (L.root && st.root), cur = i === st.lv && !L.root;
          return `<div class="qst-rung ${done ? 'done' : ''} ${cur ? 'cur' : ''} ${L.root ? 'root' : ''}"><span class="n">${i + 1}</span><span>${done || cur ? esc(L.layer) : esc(L.layer.split(':')[0]) + ': ?'}</span></div>`;
        }).join('');
        TR.$('[data-side]', el).innerHTML = `<span class="eyebrow">Открытость Галины Ивановны</span>${meterRow('Открытость', st.open / 100, st.open >= 70 ? '' : st.open >= 50 ? 'warn' : 'bad')}
          <span class="eyebrow" style="margin-top:8px">Лестница вниз: от решения к корню</span><div class="qst-ladder">${rungs}</div>
          ${st.bonus ? ui.note('ok', 'Бонус', 'Найдено ограничение: круассаны на точке не раньше 07:30.') : ''}
          <span class="eyebrow" style="margin-top:8px">Записи «со слов» Галины Ивановны</span>
          ${st.wrongs.length ? st.wrongs.map(w => `<div class="qst-wr ${st.root ? 'x' : ''}">✕ ${esc(w)}</div>`).join('') + (st.root ? '<div class="small muted">Зачёркнуто: корень показал, что это не её потребность.</div>' : '<div class="small muted">Это вежливые «да». Выглядят как факты, но это ваши формулировки.</div>') : '<div class="small dim">Ложных записей нет.</div>'}`;
      }
      if (!ctx.readonly) TR.on(el, 'click', '[data-w5]', (e, b) => {
        const v = b.dataset.w5;
        if (v === 'restart') a.path = []; else a.path = a.path.concat(v);
        ctx.save(); ctx.decide('5 почему: путь вопросов', a.path.map(id => { const o = W5_ALL.find(x => x.id === id); return o ? o.q : id === 'fin' ? '[вывод]' : id; }).join(' → '));
        draw();
      });
      draw();
    },
    check(ans) {
      const st = w5Run(ans && ans.path), notes = [];
      const depth = Math.min(4, st.lv) / 4;
      const score = Math.max(0, Math.min(1, 0.55 * depth + 0.25 * (st.open / 100) + 0.2 * (st.leads ? 0 : 1) + (st.bonus ? 0.05 : 0) - (st.fin ? 0 : 0.2)));
      if (!st.log.length) notes.push({ ok: false, html: 'Разговор ещё не начат: выберите первый вопрос.' });
      else if (st.closed) notes.push({ ok: false, html: 'Галина Ивановна закрылась и ушла к печи. Посмотрите, какие вопросы снижали открытость: что в них звучало — интерес или упрёк? Начните заново.' });
      else if (!st.fin) notes.push({ ok: false, html: 'Вывод не зафиксирован. Когда решите, что дошли до сути, нажмите «Зафиксировать вывод».' });
      else if (!st.root) notes.push({ ok: false, html: `Ваш вывод: «${esc(w5Concl(st).t)}» Спросите себя: это её слова или ваши? Это причина — или всё ещё способ? Excel, таблица, прогноз — это способы.` });
      else notes.push({ ok: true, html: 'Корень найден: Галине Ивановне нужен не Excel, а чтобы предзаказы сами попадали в план выпечки.' });
      if (st.leads) notes.push({ ok: 'warn', html: `Наводящих вопросов: ${st.leads}. В блокнот попали записи, с которыми Галина Ивановна согласилась из вежливости.` });
      if (st.harsh) notes.push({ ok: 'warn', html: `Жёстких «почему» с оценкой: ${st.harsh}. Каждое стоило открытости.` });
      if (st.fin && st.root && st.open < 50) notes.push({ ok: false, html: 'До корня дошли, но открытость ниже 50 %: к четвергу Галина Ивановна запомнит этот разговор как допрос.' });
      if (st.bonus) notes.push({ ok: 'info', html: 'Бонус: вопрос о страхах принёс ограничение «круассаны не раньше 07:30».' });
      return {
        ok: st.root && st.fin && !st.closed && st.open >= 50, score, notes,
        summary: `Глубина: ${Math.min(4, st.lv)} из 4 ступеней. Открытость: ${st.open} %. Ложных записей: ${st.wrongs.length}.`,
        mentor: st.fin && !st.root && st.wrongs.length ? 'Обратите внимание: ваш вывод звучит уверенно, и Галина Ивановна с ним «согласилась». Именно так неправильный вопрос даёт ложный ответ — и потом в требованиях появляется Excel, которым никто не пользуется.' : null
      };
    },
    explain: `<p>Путь к корню — четыре ступени вниз:</p>
      <ol>
        <li><b>Решение:</b> «Excel со всеми заказами». Так написано в письме, но это способ.</li>
        <li><b>Процесс:</b> «Расскажите, как вы вчера составляли план?» — история о последнем случае. План в 23:00 на глаз, торты надиктовывают по телефону.</li>
        <li><b>Действие:</b> «Что вы делаете с этими заказами?» — прибавляет к плану точки.</li>
        <li><b>Риск:</b> «Что будет, если заказ не попадёт?» — утром круассанов нет, виновата она.</li>
        <li><b>Корень:</b> «Для чего вам видеть каждый заказ?» или зеркало «…виноваты будете вы?» — «чтобы предзаказы сами попадали в план».</li>
      </ol>
      <p>Если бы мы записали «нужен Excel», команда сделала бы выгрузку, а Галина Ивановна по-прежнему переписывала бы заказы руками в 23:00. Настоящее требование — автоматически добавлять предзаказы к плану выпечки.</p>
      <p>«5 почему» на интервью не произносят буквально пять раз: голое «почему?» звучит как допрос. Работают «что к этому привело?», «для чего это вам?», «что будет, если…?» и зеркало. А наводящий вопрос опаснее грубого: грубый вы заметите по реакции, наводящий — нет.</p>
      <p class="small muted">Источники: «5 почему» — производственная система Тойоты; мягкие формулировки — PRACTICES §1.1; зеркало — Крис Восс; Эдгар Шейн, «Скромное вопрошание».</p>`,
    report: ans => { const st = w5Run(ans && ans.path); return `Путь: ${(ans && ans.path || []).map(id => { const o = W5_ALL.find(x => x.id === id); return o ? '«' + o.q + '»' : id === 'fin' ? '[вывод]' : id; }).join(' → ') || '—'}\nВывод: ${st.fin ? w5Concl(st).t : '—'}\nОткрытость: ${st.open} %, наводящих: ${st.leads}, жёстких: ${st.harsh}${st.closed ? ', собеседник закрылся' : ''}`; }
  };

  // =====================================================================
  // Практика 5. Активное слушание на записи звонка + ответ Игорю
  // =====================================================================
  const LM = [
    { ctx: 'Нина: «…и вот к восьмому марта мы девять заказов потеряли». Игорь: «Понятно. А сколько у вас пекарен?»', q: 'Что сказали бы вы на месте Игоря?', seed: 'qst-lm1', options: [
      { t: '«…девять заказов потеряли?» — и пауза', ok: 1, why: 'Зеркало: Нина продолжит — «Девять! А сколько клиентов после этого к нам не вернулось, я даже не знаю». Вот она, цена проблемы.' },
      { t: '«Ничего, с приложением такого не будет»', why: 'Обещание вместо вопроса. Разговор о потерях закончился, не начавшись, — а вы ещё и пообещали то, чего не знаете.' },
      { t: '«А сколько у вас пекарен?»', why: 'Так ответил Игорь: нить оборвалась на самом важном. А число пекарен известно и без Нины.' },
      { t: '«Это было в прошлом году?»', why: 'Закрытый вопрос: «Да». Дата и так понятна, а подробности остались за кадром.' }
    ] },
    { ctx: 'Нина: «Я каждое восьмое марта не сплю. Звонки, слёзы, отзывы в соцсетях…» Игорь: «Ну, это бывает. Давайте к срокам».', q: 'Что сказали бы вы?', seed: 'qst-lm2', options: [
      { t: '«Похоже, 8 Марта для вас — самое тревожное время в году»', ok: 1, why: 'Лейбл: Нина слышит, что её поняли — «Да, именно так. Если честно, я поэтому к вам и пришла». Это и есть главный критерий успеха проекта.' },
      { t: '«Не переживайте, мы всё сделаем»', why: 'Утешение и обещание. Нина не почувствует, что её услышали, а вы взяли обязательство вслепую.' },
      { t: '«Сколько звонков в день вы принимаете на 8 Марта?»', why: 'Цифра понадобится, но сейчас Нина говорит о чувствах. Сначала признайте их — иначе разговор станет допросом.' },
      { t: '«Соцсети — это вопрос к маркетологу»', why: 'Отфутболили главную боль владелицы. Доверие падает.' }
    ] },
    { ctx: 'Нина: «Заказы на торты принимаем как обычно». Игорь: «Ага».', q: 'Что сказали бы вы?', seed: 'qst-lm3', options: [
      { t: '«Как это выглядит? Расскажите про последний заказ торта — от звонка до выдачи»', ok: 1, why: '«Как обычно» — слово-туман. История о последнем случае превращает его в шаги процесса.' },
      { t: '«Ага, понятно»', why: '«Как обычно» осталось туманом: вы не знаете, что за ним стоит.' },
      { t: '«Как обычно — значит, всё хорошо?»', why: 'Наводящий вопрос: Нина ответит «ну да» — и вы потеряете тему, где теряются торты.' },
      { t: '«В какой CRM вы храните заказы?»', why: 'Жаргон: Нина не знает слова CRM. А заказы у неё в тетради.' }
    ] },
    { ctx: 'Нина десять минут рассказывала про предзаказ. Игорь: «Отлично, всё поняли, пришлём коммерческое предложение».', q: 'Что сказали бы вы перед прощанием?', seed: 'qst-lm4', options: [
      { t: '«Давайте сверюсь: правильно понимаю, что главное — чтобы утром популярное не заканчивалось, а торты к 8 Марта не терялись?»', ok: 1, why: 'Резюме: Нина подтвердит или поправит сразу, а не на демо через два месяца.' },
      { t: '«Что я не спросил, а это для вас важно?»', ok: 1, why: 'Мета-вопрос: Нина сама назовёт дыру в списке тем. Отличный финал встречи — хорошо бы вместе с резюме.' },
      { t: '«Всё понятно, спасибо!»', why: '«Всё понятно» ничего не проверяет. Недопонимание всплывёт позже — и дороже.' },
      { t: '«А почему вы раньше этим не занялись?»', why: 'Поиск виноватых в конце встречи. Нина уйдёт с неприятным осадком.' }
    ] }
  ];
  const L_RUBRIC = [
    'На вопрос о будущем («будут ли заказывать заранее?») Нина ответит из вежливости или веры в свою идею — это мнение, а не факт (The Mom Test)',
    'О прошлом люди рассказывают конкретно: что было, когда, сколько, почему',
    'Пример на «Колосе»: сорванный торт, круассаны к 9 утра или 8 Марта',
    'Из истории всплывают шаги, правила и неявные требования, о которых сами бы не догадались спросить',
    'Своя формулировка вопроса: открытая, о конкретном случае, без решения внутри'
  ];
  const L_REF = 'Игорь, на вопрос «будут ли клиенты заказывать заранее?» Нина ответит «конечно, будут» — из вежливости и потому, что это её идея. Это мнение о будущем, а люди плохо предсказывают своё поведение: Роб Фитцпатрик в The Mom Test называет такие ответы ложным позитивом. А о прошлом она расскажет конкретно: например, что вчера к девяти круассанов уже не было и люди разворачивались. Вот это факт: время, цифры, поведение. Из истории про последний сорванный торт всплывут шаги — тетрадь, мессенджер, лист для цеха — и места, где заказ теряется. Сами мы о них не догадались бы спросить. Поэтому завтра я спрошу: «Расскажите, что произошло с последним заказом торта, который сорвался?» — а потом уточню цифрами: сколько таких в неделю и что было к 8 Марта.';
  const listenTask = {
    id: 'listen', title: 'Слушать и отвечать: запись звонка Игоря',
    simple: howListen.simple,
    lead: ui.brief({
      situation: 'Ксения включает запись первого звонка Игоря с Ниной — ещё до договора. «Игорь — отличный руководитель проекта, но в четырёх местах он упустил главное. Что сказали бы вы?» Игорь, смеясь: «Да ладно. Завтра спроси Нину прямо: будут люди заказывать заранее или нет — и всё ясно».',
      todo: [
        'В каждом из четырёх моментов выберите, что сказали бы вы на месте Игоря.',
        'Ниже ответьте Игорю своими словами: почему вы завтра будете спрашивать о прошлых случаях, а не о будущем. От 250 символов. Затем «Проверить с Ксенией (Claude)» или «Сверить с эталоном самому».',
        'Нажмите «Проверить». Засчитывается, если верны хотя бы три момента из четырёх, а ответ Игорю — от 60 %.'
      ],
      lookTitle: 'На что опираться',
      look: 'В каждом моменте спросите себя: что сейчас чувствует Нина и что осталось недосказанным? Зеркало продолжает мысль, лейбл признаёт чувство, история раскрывает туман, резюме и мета-вопрос закрывают встречу. После проверки у выбранных вариантов появятся пояснения.'
    }),
    blank: () => ({ q: [[], [], [], []], j: {} }),
    reference: () => ({ q: LM.map(m => [m.options.findIndex(o => o.ok)]), j: { text: L_REF, self: L_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('qst-root');
      const a = ctx.ans; a.q = Array.isArray(a.q) ? a.q : [[], [], [], []]; a.j = a.j || {};
      el.innerHTML = `<div class="stack"><div class="stack" data-lm></div><div class="eyebrow" style="margin-top:6px">Ответ Игорю</div>${ui.say('igor', 'Зачем тебе завтра эти «расскажите про последний случай»? Спроси Нину прямо: «Будут ваши клиенты заказывать заранее?» Она скажет «да» — и поехали делать.')}<div data-j></div></div>`;
      const lm = TR.$('[data-lm]', el);
      LM.forEach((m, i) => {
        const card = document.createElement('div'); card.className = 'card flat qst-moment';
        card.innerHTML = `<span class="qst-lbl">Момент ${i + 1}</span><div class="small muted">${esc(m.ctx)}</div><div data-qz></div>`;
        lm.appendChild(card);
        ui.quiz(TR.$('[data-qz]', card), Object.assign({}, m, { value: a.q[i] || [], readonly: ctx.readonly, reveal: ctx.result || (ctx.readonly ? 'all' : null), onChange: v => { a.q[i] = v; ctx.save(); } }));
      });
      ui.justify(TR.$('[data-j]', el), {
        id: 'qst-igor', q: 'Почему спрашивать о прошлых случаях, а не о будущем?', placeholder: 'Игорь, …',
        qPlain: 'Руководитель проекта предлагает спросить владелицу пекарен прямо: «Будут ваши клиенты заказывать заранее?». Объясните ему, почему вопрос о будущем даёт ненадёжный ответ, чем лучше вопросы о прошлых конкретных случаях, приведите пример на кейсе пекарен «Колос» и предложите свою формулировку вопроса.',
        rubric: L_RUBRIC, reference: L_REF, value: a.j, readonly: ctx.readonly, minLen: 250,
        onChange: v => { a.j = v; ctx.save(); ctx.decide('Ответ Игорю: вопросы о прошлом', v.text || ''); }
      });
    },
    check(ans) {
      const q = (ans && ans.q) || [];
      const r = LM.map((m, i) => ui.quizScore(m, q[i]));
      const good = r.filter(x => x.ok).length, js = ui.justifyScore(ans && ans.j), notes = [];
      r.forEach((x, i) => { if (!(q[i] && q[i].length)) notes.push({ ok: false, html: `Момент ${i + 1}: вариант не выбран.` }); else if (!x.ok) notes.push({ ok: false, html: `Момент ${i + 1}: подумайте, что сейчас недосказано или что чувствует Нина. Пояснение — у выбранного варианта.` }); });
      if (good >= 3) notes.push({ ok: true, html: `Моментов разобрано верно: ${good} из 4.` });
      if (js < 0.6) notes.push({ ok: false, html: js ? 'Ответ Игорю пока слабый. Возьмите его же вопрос «будут ли заказывать заранее?» и покажите, какой ответ Нина даст из вежливости, а какой — если спросить о вчерашнем утре.' : 'Ответ Игорю ещё не написан или не проверен: от 250 символов, затем проверка с Ксенией или сверка с эталоном.' });
      else notes.push({ ok: true, html: `Ответ Игорю: ${Math.round(js * 100)} %.` });
      return { ok: good >= 3 && js >= 0.6, score: 0.5 * good / 4 + 0.5 * js, notes, summary: `Моменты: ${good} из 4. Ответ Игорю: ${Math.round(js * 100)} %.` };
    },
    explain: `<p>Во всех четырёх моментах Игорь делал одно и то же — спешил к своему следующему вопросу. А главное каждый раз было в том, что Нина только что сказала:</p>
      <ul class="checks">
        <li><b>Зеркало</b> на «девять заказов потеряли» — и Нина сама называет цену проблемы.</li>
        <li><b>Лейбл</b> на «не сплю каждое 8 Марта» — и звучит настоящая причина, по которой она пришла: страх повторения.</li>
        <li><b>История вместо тумана</b> на «как обычно» — и «обычно» превращается в шаги, где теряются торты.</li>
        <li><b>Резюме и мета-вопрос</b> перед прощанием — и недопонимание ловится сразу, а не на демо.</li>
      </ul>
      <p>Аналитик на интервью говорит примерно пятую часть времени. Остальное — слушает, переспрашивает и записывает.</p>
      <p class="small muted">Источники: Роб Фитцпатрик, «Спроси маму» (The Mom Test); Крис Восс, «Никогда не идите на компромисс» (зеркало, лейбл, калиброванные вопросы); Эдгар Шейн, «Скромное вопрошание».</p>`,
    report: ans => { const q = (ans && ans.q) || []; return LM.map((m, i) => `- Момент ${i + 1}: ${q[i] && q[i].length ? m.options[q[i][0]].t + (m.options[q[i][0]].ok ? ' ✓' : ' ✗') : '—'}`).join('\n') + `\nОтвет Игорю: ${(ans && ans.j && ans.j.text) || '—'}`; }
  };

  // =====================================================================
  TR.stage({
    id: ID, act: 3, order: 220, slot: 'Вт 10:00', title: 'Искусство вопроса',
    when: 'вторник, 20 октября, 10:00 · переговорная «Квант Софт»',
    intro: [
      { who: 'ksenia', html: 'Завтра в 10:00 — интервью с Ниной Сергеевной. Сорок минут, и она расскажет только то, о чём мы спросим. Сегодня тренируем главный инструмент аналитика — вопрос.' },
      { who: 'igor', html: 'Да чего тут тренировать? Спросим: «Вам нужно приложение?» Она скажет «да» — и поехали.' },
      { who: 'ksenia', html: 'Вот именно поэтому. На такой вопрос любой ответит «да» — и мы не узнаем ничего. Сегодня разберём, какие бывают вопросы и какие из них ловушки, как вести разговор воронкой, как мягко докопаться до причины и как слушать так, чтобы человек рассказал больше, чем собирался.' }
    ],
    facts: [],
    glossary: [
      { term: 'Открытый вопрос', simple: 'Вопрос, на который не ответишь «да» или «нет»: «Как сейчас принимают заказ торта?»', tech: 'Начинается с «как», «что», «расскажите». Открывает тему и даёт собеседнику выбрать, с чего начать.' },
      { term: 'Закрытый вопрос', simple: 'Вопрос с ответом «да», «нет» или одним значением.', tech: 'Фиксирует конкретный факт или правило. Хорош в конце темы, вреден в начале: сужает разговор.' },
      { term: 'Наводящий вопрос', simple: '«Вам же нравится с изюмом?» — человек кивнёт, даже если не любит изюм.', tech: 'Вопрос с подсказанным ответом («ведь», «правда же», «да?»). Даёт вежливое согласие вместо информации.' },
      { term: 'Уточняющий вопрос', simple: '«Быстро — это за сколько минут?»', tech: 'Превращает размытое слово (слово-туман) в цифру, пример или правило.' },
      { term: 'The Mom Test («Спроси маму»)', simple: 'Спрашивайте так, чтобы даже любящая мама не смогла вам соврать из вежливости.', tech: 'Правила Роба Фитцпатрика: говорить о жизни человека, а не о своей идее; о конкретном прошлом, а не о мнениях о будущем; меньше говорить, больше слушать.' },
      { term: 'Воронка вопросов', simple: 'От общего к частному: сначала картина, потом детали, цифры и сверка.', tech: 'Открытые вопросы → уточняющие → закрытые для фиксации → резюме. Обратная воронка — от простого факта к широкому, когда собеседник зажат.' },
      { term: '«5 почему»', simple: 'Спрашивать о причине, пока не дойдёте до корня, — но мягко, не как на допросе.', tech: 'Техника поиска корневой причины из производственной системы Тойоты. На интервью — «что к этому привело?», «для чего это вам?».' },
      { term: 'Калиброванный вопрос', simple: '«Как» и «что» вместо «да / нет»: «Что поможет нам успеть?»', tech: 'Открытый вопрос, который даёт собеседнику ощущение контроля и раскрывает информацию (Крис Восс, «Никогда не идите на компромисс»).' },
      { term: 'Активное слушание', simple: 'Слушать так, чтобы человек рассказал больше: повторить, помолчать, назвать чувство, пересказать.', tech: 'Зеркало (1–3 последних слова с вопросом), пауза около 4 секунд, лейбл («похоже, вас тревожит…»), перефразирование и резюме («правильно понимаю, что…?»).' },
      { term: 'Контекстно-свободные вопросы', simple: 'Вопросы, которые подходят к любому проекту: кто будет пользоваться, что будет, если ничего не делать, что я не спросил.', tech: 'Вопросы о процессе, о продукте и мета-вопросы из книги Дональда Гауса и Джеральда Вайнберга «Exploring Requirements».' }
    ],
    outro: 'Теперь у вас в руках не просто список вопросов, а инструменты: открытый вопрос начинает тему, история о последнем случае показывает реальность, уточняющий превращает туман в цифры, мягкое «что к этому привело?» ведёт к корню, а зеркало, пауза и резюме заставляют человека договорить. И вы знаете, на чём ломается разговор: наводящий вопрос, решение внутри, жаргон, два вопроса сразу. Завтра в 10:00 — всё это вживую, на сорок минут с Ниной Сергеевной.',
    tasks: [howTypes, howFunnel, howListen, classifyTask, rewriteTask, funnelTask, why5Task, listenTask]
  });
})();
