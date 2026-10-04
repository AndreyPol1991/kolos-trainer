/* Неделя 4, среда 10:00 — «Нефункциональные требования».
   Теория (соседние примеры — сайт продажи билетов концертного зала и служба такси):
   почему НФТ не видно на демо и восемь категорий (переключатель «демо / старт продаж / полгода», «НФТ записаны»);
   четыре части меры — метрика, порог, условия, способ проверки — и лазейки подрядчика; перцентили на 200 замерах
   («ровно» и «с хвостом», ползунок перцентиля); девятки → часы простоя и цена каждой девятки, окно обслуживания;
   сценарий атрибута качества (источник → стимул → среда → артефакт → отклик → мера), способы проверки,
   компромиссы между требованиями.
   Практика на «Колосе»: конструктор измеримых НФТ из четырёх пожеланий Нины; лаборатория «торг за девятки»
   (бюджет на качество, утренний пик); план проверки для Леры (сценарий обрыва связи на Покровке + способы проверки);
   споры между НФТ и как их развести; ответ Нине своими словами («почему не 100 % и не мгновенно»). */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'nfr';

  if (!document.getElementById('nfr-css')) document.head.insertAdjacentHTML('beforeend', `<style id="nfr-css">
    .nfr-root, .nfr-root .stack > * { min-width: 0; }
    .nfr-root .seg button { white-space: normal; text-align: left; }
    .nfr-lbl { font: 600 11px/1.35 var(--f-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--text-muted); }
    .nfr-cats { display: grid; gap: 6px; }
    .nfr-cat { display: grid; grid-template-columns: 200px minmax(0, 1fr) auto; grid-template-areas: "t d s"; gap: 4px 12px; align-items: start; padding: 8px 12px; border: 1px solid var(--border); border-left: 4px solid var(--border-strong); border-radius: 10px; background: var(--surface); font-size: 13.5px; line-height: 1.4; }
    .nfr-cat > * { min-width: 0; }
    .nfr-cat .t { grid-area: t; font-weight: 600; }
    .nfr-cat .t small { display: block; font-weight: 400; color: var(--text-muted); font-size: 12px; }
    .nfr-cat .d { grid-area: d; color: var(--text-2); }
    .nfr-cat .s { grid-area: s; }
    .nfr-cat.bad { border-left-color: var(--bad); background: color-mix(in srgb, var(--bad-soft) 55%, var(--surface)); }
    .nfr-cat.ok { border-left-color: var(--ok); }
    .nfr-cat.dim .d { color: var(--text-muted); }
    .nfr-parts { display: flex; flex-wrap: wrap; gap: 6px; }
    .nfr-part { border: 1px solid var(--border-strong); background: var(--surface-2); border-radius: 9px; padding: 6px 12px; font-size: 13.5px; font-weight: 600; color: var(--text-2); text-align: left; }
    .nfr-part span { font-weight: 400; color: var(--text-muted); }
    .nfr-part[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); }
    .nfr-sent { border: 1px solid var(--border); border-radius: 12px; background: var(--surface); padding: 12px 14px; font-size: 15px; line-height: 1.6; }
    .nfr-sent .pm { color: var(--info); font-weight: 600; } .nfr-sent .pt { color: var(--accent); font-weight: 600; }
    .nfr-sent .pc { color: var(--violet); font-weight: 600; } .nfr-sent .pv { color: var(--warn); font-weight: 600; }
    .nfr-sent .vague { color: var(--bad); text-decoration: underline wavy; text-underline-offset: 3px; text-decoration-thickness: 1px; }
    .nfr-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
    .nfr-2 > * { min-width: 0; }
    .nfr-ppl { display: grid; grid-template-columns: repeat(20, minmax(0, 1fr)); gap: 3px; max-width: 520px; }
    .nfr-ppl i { display: block; aspect-ratio: 1; border-radius: 3px; background: var(--ok); opacity: .35; }
    .nfr-ppl i.s { background: var(--warn); } .nfr-ppl i.vs { background: var(--bad); }
    .nfr-ppl i.in { opacity: 1; }
    .nfr-range { width: 100%; accent-color: var(--accent); }
    .nfr-stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px; }
    .nfr-stats .stat .v { font-size: 17px; }
    .nfr-stats .stat .s { line-height: 1.35; }
    .nfr-cost { display: grid; gap: 6px; }
    .nfr-cost .r { display: grid; grid-template-columns: 70px minmax(0, 1fr) 46px; gap: 8px; align-items: center; font-size: 13px; }
    .nfr-cost .r .b { height: 10px; border-radius: 5px; background: var(--surface-3); overflow: hidden; }
    .nfr-cost .r .b i { display: block; height: 100%; background: var(--warn); border-radius: 5px; opacity: .6; }
    .nfr-cost .r.on { font-weight: 700; } .nfr-cost .r.on .b i { background: var(--accent); opacity: 1; }
    .nfr-chain { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 8px; }
    .nfr-box { border: 1px solid var(--border); border-radius: 10px; background: var(--surface); padding: 8px 10px; display: grid; gap: 4px; align-content: start; min-width: 0; font-size: 13px; line-height: 1.4; }
    .nfr-box .k { font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .nfr-box .q { font-size: 12px; color: var(--text-muted); }
    .nfr-box .v { font-weight: 600; color: var(--text); overflow-wrap: anywhere; }
    .nfr-box.on { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent) inset; }
    .nfr-box.ghost .v { color: var(--text-muted); font-weight: 400; }
    .nfr-meths { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 8px; }
    .nfr-meth { border: 1px solid var(--border); border-radius: 10px; background: var(--surface); padding: 10px 12px; display: grid; gap: 4px; align-content: start; font-size: 13px; line-height: 1.45; }
    .nfr-meth b { font: 600 14px/1.3 var(--f-brand); }
    .nfr-meth .y { color: var(--ok); } .nfr-meth .n { color: var(--text-muted); }
    .nfr-mini { display: grid; gap: 6px; padding: 10px 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); }
    .nfr-mini .fb { font-size: 13px; }
    .nfr-mini .fb.ok { color: var(--ok); } .nfr-mini .fb.bad { color: var(--bad); }
    .nfr-pills { display: flex; flex-wrap: wrap; gap: 6px; }
    .nfr-pill { text-align: left; border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text); border-radius: 10px; padding: 6px 10px; font-size: 13.5px; line-height: 1.35; max-width: 100%; white-space: normal; overflow-wrap: anywhere; }
    .nfr-pill:hover:not(:disabled) { border-color: var(--text-muted); }
    .nfr-pill[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); box-shadow: 0 0 0 1px var(--accent) inset; }
    .nfr-pill.ok { border-color: var(--ok); background: var(--ok-soft); box-shadow: none; }
    .nfr-pill.bad { border-color: var(--bad); background: var(--bad-soft); box-shadow: none; }
    .nfr-pill.warn { border-color: var(--warn); background: var(--warn-soft); box-shadow: none; }
    .nfr-pill:disabled { cursor: default; opacity: 1; }
    .nfr-pill.sm { font-size: 12.5px; padding: 4px 9px; }
    .nfr-slot { display: grid; gap: 6px; padding: 10px 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); }
    .nfr-slot .h { display: flex; flex-wrap: wrap; gap: 2px 10px; align-items: baseline; }
    .nfr-slot .h b { font: 600 14px/1.3 var(--f-brand); }
    .nfr-slot .h span { font-size: 12.5px; color: var(--text-muted); }
    .nfr-slot .why { font-size: 13px; color: var(--text-2); border-left: 3px solid var(--border-strong); padding-left: 8px; }
    .nfr-wtabs { display: flex; flex-wrap: wrap; gap: 6px; }
    .nfr-wtab { border: 1px solid var(--border-strong); background: var(--surface-2); border-radius: 10px; padding: 6px 12px; font-size: 13.5px; text-align: left; color: var(--text-2); display: grid; gap: 1px; }
    .nfr-wtab small { font: 500 11px/1.2 var(--f-mono); color: var(--text-muted); }
    .nfr-wtab[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--text); }
    .nfr-wtab.ok { border-color: var(--ok); } .nfr-wtab.bad { border-color: var(--bad); } .nfr-wtab.warn { border-color: var(--warn); }
    .nfr-lab { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); gap: 16px; align-items: start; }
    .nfr-lab > * { min-width: 0; }
    .nfr-knob { display: grid; gap: 4px; }
    .nfr-knob .k { font-size: 13.5px; font-weight: 600; }
    .nfr-knob .k span { font-weight: 400; color: var(--text-muted); font-size: 12.5px; }
    .nfr-pair { border: 1px solid var(--border); border-radius: 12px; background: var(--surface); padding: 10px 12px; display: grid; gap: 8px; }
    .nfr-pair.ok { border-color: var(--ok); } .nfr-pair.bad { border-color: var(--bad); } .nfr-pair.warn { border-color: var(--warn); }
    .nfr-pair .why { font-size: 13px; color: var(--text-2); border-left: 3px solid var(--border-strong); padding-left: 8px; }
    .nfr-vs { display: grid; grid-template-columns: minmax(0, 1fr) 24px minmax(0, 1fr); gap: 8px; align-items: center; }
    .nfr-vs > div { border: 1px solid var(--border); border-radius: 9px; padding: 7px 10px; background: var(--surface-2); font-size: 13.5px; line-height: 1.4; min-width: 0; }
    .nfr-vs > div small { display: block; font: 600 10.5px/1.4 var(--f-mono); letter-spacing: .06em; text-transform: uppercase; color: var(--violet); }
    .nfr-vs > span { text-align: center; font-weight: 700; color: var(--text-muted); }
    .nfr-bars { display: grid; gap: 7px; }
    .nfr-bars .r { display: grid; grid-template-columns: 120px minmax(0, 1fr) 44px; gap: 8px; align-items: center; font-size: 13px; }
    .nfr-bars .r .tnum { text-align: right; }
    @media (max-width: 860px) {
      .nfr-lab, .nfr-2 { grid-template-columns: minmax(0, 1fr); }
      .nfr-chain { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 560px) {
      .nfr-cat { grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "t s" "d d"; }
      .nfr-chain { grid-template-columns: minmax(0, 1fr); }
      .nfr-vs { grid-template-columns: minmax(0, 1fr); }
      .nfr-vs > span { line-height: 1; }
      .nfr-ppl { gap: 2px; }
      .nfr-bars .r { grid-template-columns: 96px minmax(0, 1fr) 40px; }
    }
  </style>`);

  // ---------- общие помощники ----------
  const fresh = fn => pane => { const d = document.createElement('div'); pane.appendChild(d); fn(d); };
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  const n1 = x => String(Math.round(x * 10) / 10).replace('.', ',');
  const fmtH = h => { if (h >= 1) return n1(h) + ' ч'; const m = h * 60; if (m >= 1) return Math.round(m) + ' мин'; return Math.round(m * 60) + ' с'; };
  const secT = x => (x < 1 ? x.toFixed(2) : x.toFixed(1)).replace('.', ',') + ' с';
  const quizRef = cfg => cfg.options.map((o, i) => o.ok ? i : -1).filter(i => i >= 0);
  // кнопки-«таблетки» выбора: key — куда писать ответ, mark — отметки после проверки только у выбранного варианта
  const pills = (key, opts, cur, o) => `<div class="nfr-pills" role="group">${opts.map(x => `<button type="button" class="nfr-pill ${o && o.sm ? 'sm' : ''} ${o && o.mark && o.mark[x.v] ? o.mark[x.v] : ''}" data-pk="${esc(key)}" data-pv="${esc(x.v)}" aria-pressed="${cur === x.v}" ${o && o.readonly ? 'disabled' : ''}>${esc(x.t)}</button>`).join('')}</div>`;
  const segBtns = (key, opts, cur, ro) => `<div class="seg accent" role="group">${opts.map(x => `<button type="button" data-pk="${esc(key)}" data-pv="${esc(x.v)}" aria-pressed="${cur === x.v}" ${ro ? 'disabled' : ''}>${esc(x.t)}</button>`).join('')}</div>`;
  const markOf = s => s >= 1 ? 'ok' : s > 0 ? 'warn' : 'bad';

  // =====================================================================
  // Теория 1. Невидимые требования и четыре части меры (сайт продажи билетов)
  // =====================================================================
  const CATS = [
    { id: 'perf', t: 'Производительность', q: 'Сколько ждать и сколько выдержит?', demo: 'Страница открывается за полсекунды: зритель один, интернет офисный.',
      peak: { bad: 'В 10:00 «Купить» жмут 5 000 человек: ответ по 30 секунд, люди жмут повторно — двойные брони.', ok: '95 % нажатий «Купить» — быстрее 2 с при 5 000 зрителей за первые 10 минут; проверено нагрузочным тестом.' } },
    { id: 'avail', t: 'Доступность (готовность)', q: 'Когда работает и сколько может простоять?', demo: 'Работает — его только что включили.',
      peak: { bad: 'Обновление выкатили в 09:50 — старт продаж сорван на час, в соцсетях скандал.', ok: 'Обновления — только ночью, 03:00–04:00; в дни старта продаж выкатки запрещены.' },
      half: { bad: 'Сайт упал в субботу вечером — чинить некому до понедельника.', ok: 'Доступность 99,9 % в месяц; дежурный инженер на связи и в выходные.' } },
    { id: 'rel', t: 'Надёжность', q: 'Что будет при сбое и что не потеряется?', demo: 'Сбоев нет — их никто не устраивал.',
      peak: { bad: 'Деньги списались, связь оборвалась — билета нет, а место уже продано другому.', ok: 'Если оплата прошла, а ответ потерялся, место держится 15 минут и подтверждается по уведомлению банка.' } },
    { id: 'sec', t: 'Безопасность и защита данных', q: 'Кто что видит и что под замком?', demo: 'Входит один тестовый зритель с паролем 1234.',
      peak: { bad: 'Боты скупают первый ряд за 3 секунды — перекупщики продают билеты втрое дороже.', ok: 'Не больше 4 билетов в одни руки; подозрительные серии запросов отсекаются.' },
      half: { bad: 'Утекла база с телефонами зрителей — штраф и новости.', ok: 'Телефоны и имена хранятся зашифрованными, доступ — по ролям, действия пишутся в журнал.' } },
    { id: 'usab', t: 'Удобство и доступность для людей', q: 'Справится ли человек сам, без помощи?', demo: 'Показывает разработчик — он знает, куда нажимать.',
      peak: { bad: 'Пожилой зритель не нашёл на телефоне, как выбрать место, звонит в кассу — а там занято.', ok: '9 из 10 зрителей впервые покупают билет за 3 минуты без подсказок; крупный шрифт и контраст.' } },
    { id: 'maint', t: 'Сопровождаемость', q: 'Легко ли менять и чинить?', demo: 'На демо ничего не меняют.',
      half: { bad: 'Чтобы поменять цену на балкон, нужен программист и неделя.', ok: 'Цены и схему зала меняет администратор в настройках, без программиста.' } },
    { id: 'compat', t: 'Совместимость', q: 'Уживается ли с чужими системами и устройствами?', demo: 'Показывают на новом ноутбуке.',
      peak: { bad: 'На старых Android схема зала не грузится — часть зрителей не может купить.', ok: 'Работает на Android и iOS последних пяти лет и в двух главных браузерах.' },
      half: { bad: 'Касса зала обновилась — обмен с сайтом сломался, места продаются дважды.', ok: 'Обмен с кассой зала описан; изменения у кассы проверяют на стенде заранее.' } },
    { id: 'law', t: 'Законы и регуляторика', q: 'Что велит закон?', demo: 'Закон на демо никто не проверяет.',
      half: { bad: 'Телефоны зрителей собирали без согласия — жалоба и штраф по 152-ФЗ.', ok: 'Согласие на обработку персональных данных — до покупки; данные хранятся в России.' } }
  ];
  const SCENES = [{ v: 'demo', t: 'Демо в переговорной' }, { v: 'peak', t: 'Старт продаж, 10:00' }, { v: 'half', t: 'Через полгода' }];
  function drawDemo(pane) {
    let sc = 'demo', on = false;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Сайт продажи билетов городского концертного зала. На демо всё прекрасно. Переключите момент и посмотрите, когда «проявляются» нефункциональные требования.</p>
      <div class="row">${ui.seg('sc', SCENES, sc, 'accent')}</div>
      <label class="toggle"><input type="checkbox" data-on> <span>НФТ записаны заранее — с цифрами и способом проверки</span></label>
      <div data-sum></div>
      <div class="nfr-cats" data-cats></div>
      ${ui.note('info', 'Связь с «Видами требований»', 'Первые семь строк — характеристики качества из ISO/IEC 25010, которые вы проходили во вторник второй недели («Виды требований»). Законы — не характеристика качества, а ограничение, но живут рядом с НФТ: их тоже не видно на демо. Сегодня идём дальше — как записать каждое так, чтобы его можно было построить и проверить.')}
    </div>`;
    function draw() {
      let broken = 0, shown = 0;
      TR.$('[data-cats]', pane).innerHTML = CATS.map(c => {
        let cls = 'dim', chip = ui.status('не видно', ''), d = c.demo;
        if (sc !== 'demo') {
          const e = c[sc];
          if (!e) { chip = ui.status('пока тихо', ''); d = sc === 'peak' ? 'В день старта не проявляется — всплывёт позже.' : 'Уже проявилось раньше или проявится в другой момент.'; }
          else if (on) { cls = 'ok'; chip = ui.status('в порядке', 'ok'); d = e.ok; shown++; }
          else { cls = 'bad'; chip = ui.status('сломалось', 'bad'); d = e.bad; broken++; shown++; }
        }
        return `<div class="nfr-cat ${cls}"><span class="t">${esc(c.t)}<small>${esc(c.q)}</small></span><span class="s">${chip}</span><span class="d">${esc(d)}</span></div>`;
      }).join('');
      TR.$('[data-sum]', pane).innerHTML = sc === 'demo'
        ? ui.note('warn', 'На демо всё работает', 'Один зритель, офисный интернет, разработчик сам жмёт кнопки, закон никто не проверяет. Нефункциональных требований просто нет на экране — поэтому заказчик о них не пишет, а команда о них забывает.')
        : on ? ui.note('ok', `Проявилось ${shown} из ${CATS.length} — и всё в порядке`, 'Те же события, но каждое качество заранее записано числом, с условиями и способом проверки, — и проверено до старта. Это и есть работа аналитика с НФТ.')
          : ui.note('bad', `Сломалось ${broken} из ${CATS.length}`, 'Ни одна из этих поломок не была видна на демо. Включите «НФТ записаны заранее» и сравните.');
    }
    ui.onSeg(pane, (n, v) => { if (n === 'sc') { sc = v; draw(); } });
    TR.$('[data-on]', pane).addEventListener('change', e => { on = e.target.checked; draw(); });
    draw();
  }

  const PARTS = [
    { id: 'm', t: 'Метрика', q: 'что именно меряем', txt: 'время от нажатия «Купить» до экрана оплаты', gain: 'ясно, что засекать: от нажатия до экрана оплаты, а не «скорость сайта вообще».', hole: 'Что засекаем — открытие главной страницы? Подрядчик выберет то, что быстрее, и честно сдаст работу.' },
    { id: 't', t: 'Порог', q: 'какое число — успех', txt: 'у 95 % нажатий — не дольше 2 секунд', gain: 'есть число, с которым сравнить результат; доля 95 % не даёт одному случайному медленному ответу провалить тест.', hole: '«Быстро» — это 2 секунды или 10? На приёмке каждый назовёт своё число.' },
    { id: 'c', t: 'Условия', q: 'нагрузка, время, устройство', txt: 'при 5 000 зрителей за первые 10 минут продаж, с мобильного интернета', gain: 'понятно, на какую нагрузку строить и в каких условиях мерить.', hole: 'Подрядчик замерил ночью, один, по офисному Wi-Fi: 0,3 с. Тест пройден, а в 10:00 сайт лёг.' },
    { id: 'v', t: 'Способ проверки', q: 'как и кто докажет', txt: 'нагрузочный тест на стенде до старта продаж, затем мониторинг в первый день', gain: 'заранее договорились, кто, когда и чем меряет, — спорить на приёмке не о чем.', hole: 'Кто, когда и чем меряет? На приёмке подрядчик принесёт свой замер, а зал — жалобы зрителей.' }
  ];
  function drawParts(pane) {
    const on = { m: false, t: false, c: false, v: false };
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Тот же сайт билетов. Директор зала пишет: «Сайт должен работать быстро». Добавляйте части меры и смотрите, что меняется для Леры и Димы и какие лазейки остаются у подрядчика.</p>
      <div class="nfr-parts">${PARTS.map(p => `<button type="button" class="nfr-part" data-part="${p.id}" aria-pressed="false">+ ${esc(p.t)} <span>· ${esc(p.q)}</span></button>`).join('')}</div>
      <div class="nfr-sent" data-sent aria-live="polite"></div>
      <div class="nfr-2"><div data-ml></div><div data-md></div></div>
      <ul class="checks" data-holes></ul>
    </div>`;
    const P = id => PARTS.find(p => p.id === id);
    function draw() {
      const subj = on.m ? `<span class="pm">${esc(cap(P('m').txt))}</span>` : '<span class="vague">Сайт продаж работает</span>';
      const thr = on.t ? ` — <span class="pt">${esc(P('t').txt)}</span>` : ' <span class="vague">быстро</span>';
      const cond = on.c ? ` <span class="pc">${esc(P('c').txt)}</span>` : '';
      const ver = on.v ? ` Проверка: <span class="pv">${esc(P('v').txt)}</span>.` : '';
      TR.$('[data-sent]', pane).innerHTML = subj + thr + cond + '.' + ver;
      const lera = (Number(on.m) + Number(on.t) + Number(on.c) + Number(on.v)) / 4, dima = (Number(on.m) + Number(on.t) + Number(on.c)) / 3;
      const k = r => r >= 1 ? 'ok' : r >= 0.5 ? 'warn' : 'bad';
      TR.$('[data-ml]', pane).innerHTML = `<div class="stat"><span class="k">Лера может проверить</span><span class="v ${k(lera)}">${Math.round(lera * 100)} %</span>${ui.meter(lera, k(lera) === 'ok' ? '' : k(lera))}<span class="s">${lera >= 1 ? '«Напишу тест: 5 000 виртуальных зрителей, засекаю, смотрю 95 % ответов».' : '«Не могу поставить “прошёл / не прошёл”».'}</span></div>`;
      TR.$('[data-md]', pane).innerHTML = `<div class="stat"><span class="k">Дима может оценить</span><span class="v ${k(dima)}">${Math.round(dima * 100)} %</span>${ui.meter(dima, k(dima) === 'ok' ? '' : k(dima))}<span class="s">${dima >= 1 ? '«Понимаю, на что строить: посчитаю серверы под 5 000 зрителей за 10 минут».' : '«На что строить — на одного зрителя или на пять тысяч?»'}</span></div>`;
      TR.$('[data-holes]', pane).innerHTML = PARTS.map(p => on[p.id] ? `<li><b>${esc(p.t)}:</b> ${esc(p.gain)}</li>` : `<li class="bad"><b>Нет части «${esc(p.t)}».</b> ${esc(p.hole)}</li>`).join('');
    }
    TR.on(pane, 'click', '[data-part]', (e, b) => { const id = b.dataset.part; on[id] = !on[id]; b.setAttribute('aria-pressed', String(on[id])); draw(); });
    draw();
  }

  const howWhy = {
    id: 'how-why', covers: ['measure'], title: 'Как это работает: невидимые требования и четыре части меры', free: true, noReset: true,
    simple: {
      icon: '🕯️',
      plain: 'Нефункциональные требования говорят не что делает система, а насколько хорошо: как быстро, сколько может простоять, что будет при сбое, кто не увидит чужого, легко ли людям. На показе их не видно — там один человек и быстрый интернет. Видно их в первый же пиковый день.',
      analogy: 'Духовой шкаф в магазине красивый и включается. А держит ли он 180 градусов три часа подряд, сколько противней влезает и не греется ли дверца — узнаёте уже на кухне, перед праздником. Поэтому опытный пекарь спрашивает это до покупки — и цифрами.',
      tech: 'НФТ — требования к атрибутам качества и условиям работы системы (Вигерс и Битти; характеристики — ISO/IEC 25010). Измеримое НФТ содержит <b>метрику</b> (что меряем), <b>порог</b> (какое значение — успех), <b>условия</b> (нагрузка, время, среда, устройство) и <b>способ проверки</b> — тогда оно проверяемо по ISO/IEC/IEEE 29148. Похожая идея — язык Planguage Тома Гилба: шкала, способ замера, целевой уровень.'
    },
    lead: ui.brief({
      situation: 'Соседний пример — сайт продажи билетов городского концертного зала. Продажи на большой концерт открываются в 10:00, и за первые 10 минут приходят 5 000 зрителей. Две вкладки: почему НФТ не видно на демо и из каких четырёх частей состоит измеримое НФТ.',
      todo: [
        'Вкладка «Не видно на демо»: переключайте момент — «Демо в переговорной», «Старт продаж, 10:00», «Через полгода» — и смотрите, какие категории ломаются. Затем включите «НФТ записаны заранее».',
        'Вкладка «Четыре части меры»: добавляйте к фразе «сайт должен работать быстро» метрику, порог, условия и способ проверки. Следите за шкалами Леры и Димы и за лазейками подрядчика.'
      ],
      look: 'Красная полоса слева — категория, которая сломалась в этот момент. В предложении части меры подсвечены своим цветом, а размытые слова — волнистой линией.'
    }),
    render(el) {
      el.classList.add('nfr-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'demo', t: 'Не видно на демо', render: fresh(drawDemo) },
        { id: 'parts', t: 'Четыре части меры', render: fresh(drawParts) }
      ], 'demo');
    }
  };

  // =====================================================================
  // Теория 2. Перцентили и девятки (служба такси)
  // =====================================================================
  function times(kind) {
    const a = [];
    for (let i = 0; i < 200; i++) {
      const u = (i + 0.5) / 200;
      a.push(kind === 'even' ? 0.7 + 0.3 * u : (u < 0.9 ? 0.3 + 0.4 * (u / 0.9) : 2.5 + 2.5 * ((u - 0.9) / 0.1)));
    }
    return a;
  }
  const pctl = (a, p) => a[Math.max(0, Math.min(a.length - 1, Math.ceil(p / 100 * a.length) - 1))];
  const avg = a => a.reduce((s, x) => s + x, 0) / a.length;
  function axisSVG(a, p) {
    const W = 440, H = 92, X = v => 18 + Math.min(v, 5.2) / 5.2 * 408;
    const m = avg(a), pv = pctl(a, p);
    let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:520px;display:block" role="img" aria-label="Время ответа по шкале от 0 до 5 секунд">`;
    s += `<line x1="18" y1="56" x2="426" y2="56" style="stroke:var(--border-strong);stroke-width:1.5"/>`;
    [0, 1, 2, 3, 4, 5].forEach(v => { s += `<line x1="${X(v)}" y1="56" x2="${X(v)}" y2="61" style="stroke:var(--border-strong)"/><text x="${X(v)}" y="76" text-anchor="middle" style="fill:var(--text-muted);font-size:14px">${v} с</text>`; });
    a.forEach(v => { s += `<line x1="${X(v)}" y1="40" x2="${X(v)}" y2="54" style="stroke:${v > 2.5 ? 'var(--bad)' : v > 1 ? 'var(--warn)' : 'var(--ok)'};stroke-width:1.2;opacity:.45"/>`; });
    s += `<line x1="${X(1)}" y1="30" x2="${X(1)}" y2="56" style="stroke:var(--text-muted);stroke-width:1;stroke-dasharray:2 3"/>`;
    s += `<line x1="${X(m)}" y1="14" x2="${X(m)}" y2="56" style="stroke:var(--violet);stroke-width:2;stroke-dasharray:5 4"/><text x="${X(m) + 4}" y="13" style="fill:var(--violet);font-size:14px;font-weight:600">среднее ${secT(m)}</text>`;
    s += `<line x1="${X(pv)}" y1="22" x2="${X(pv)}" y2="56" style="stroke:var(--accent);stroke-width:2.5"/><text x="${Math.min(X(pv) + 4, 340)}" y="32" style="fill:var(--accent);font-size:14px;font-weight:600">p${p} = ${secT(pv)}</text>`;
    return s + '</svg>';
  }
  function drawPct(pane) {
    let kind = 'tail', p = 95;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Приложение такси. Засекли 200 нажатий «Заказать машину» — сколько секунд каждый пассажир ждал ответа. Квадратик — один пассажир; они выстроены от самого быстрого к самому медленному. Зелёные — быстрее секунды, жёлтые — дольше, красные — дольше 2,5 секунды.</p>
      <div class="row"><span class="small dim">Распределение:</span>${ui.seg('pd', [{ v: 'even', t: 'Ровно' }, { v: 'tail', t: 'С хвостом' }], kind, 'accent')}</div>
      <label class="stack tight"><span class="small" data-pl></span><input type="range" class="nfr-range" min="50" max="99" value="95" data-p aria-label="Перцентиль"></label>
      <div class="nfr-ppl" data-ppl aria-hidden="true"></div>
      <div class="board" data-ax style="padding:6px 8px"></div>
      <div class="nfr-stats" data-st></div>
      <div data-req></div>
    </div>`;
    function draw() {
      const a = times(kind), m = avg(a), pv = pctl(a, p), k = Math.ceil(p / 100 * a.length);
      const slow = a.filter(x => x > 1).length, vslow = a.filter(x => x > 2.5).length;
      TR.$('[data-pl]', pane).innerHTML = `Перцентиль <b>p${p}</b>: ${p} % пассажиров (${k} из 200) ждали не дольше <b>${secT(pv)}</b>. Яркие квадратики — эти ${k}.`;
      TR.$('[data-ppl]', pane).innerHTML = a.map((x, i) => `<i class="${x > 2.5 ? 'vs' : x > 1 ? 's' : ''} ${i < k ? 'in' : ''}"></i>`).join('');
      TR.$('[data-ax]', pane).innerHTML = axisSVG(a, p);
      TR.$('[data-st]', pane).innerHTML = [['Среднее', secT(m)], ['Медиана · p50', secT(pctl(a, 50))], [`p${p}`, secT(pv)], ['Дольше 1 с', `${slow} из 200`], ['Дольше 2,5 с', `${vslow} из 200`]]
        .map(([kk, v]) => `<div class="stat"><span class="k">${esc(kk)}</span><span class="v">${esc(v)}</span></div>`).join('');
      const r1 = m <= 1, r2 = pctl(a, 95) <= 1;
      TR.$('[data-req]', pane).innerHTML = `<ul class="checks"><li class="${r1 ? '' : 'bad'}">Требование «в среднем быстрее 1 с» — ${r1 ? 'выполнено' : 'не выполнено'} (среднее ${secT(m)}).</li><li class="${r2 ? '' : 'bad'}">Требование «95 % ответов быстрее 1 с» — ${r2 ? 'выполнено' : 'не выполнено'} (p95 = ${secT(pctl(a, 95))}).</li></ul>`
        + (kind === 'tail'
          ? ui.note('warn', 'Среднее обмануло', `Среднее — ${secT(m)}, требование «в среднем» выполнено. Но ${vslow} пассажиров из 200 — каждый десятый — ждали от 2,5 до 5 секунд. Именно они жмут кнопку ещё раз, уходят к конкуренту и пишут отзывы. Перцентиль этот хвост видит, среднее — нет. Подвиньте ползунок с p90 на p91 — и посмотрите, как прыгает время.`)
          : ui.note('ok', 'Когда среднее и перцентиль согласны', 'Ответы ровные — и среднее, и p95 меньше секунды. Но заранее вы не знаете, какое распределение будет у вашей системы под нагрузкой. Поэтому требование пишут перцентилем: оно честно в обоих случаях.'));
    }
    ui.onSeg(pane, (n, v) => { if (n === 'pd') { kind = v; draw(); } });
    TR.$('[data-p]', pane).addEventListener('input', e => { p = +e.target.value; draw(); });
    draw();
  }

  const NINES = [
    { v: '99', a: 0.99, need: 'Один сервер, обновления днём, чиним в рабочее время', cost: 1, an: 'почти целая рабочая смена' },
    { v: '99.5', a: 0.995, need: 'Обновления — только ночью, в окне; мониторинг с оповещением; резервные копии; чиним за пару часов', cost: 1.5, an: 'один долгий вечер' },
    { v: '99.9', a: 0.999, need: 'Два сервера вместо одного; выкатка без остановки; дежурный инженер на телефоне', cost: 3, an: 'обеденный перерыв' },
    { v: '99.99', a: 0.9999, need: 'Два дата-центра, автоматическое переключение, дежурство круглые сутки — человек руками уже не успевает', cost: 10, an: 'пока дежурный проснётся от звонка' }
  ];
  const pctT = v => String(v).replace('.', ',') + ' %';
  function drawNines(pane) {
    let cur = '99.5', win = false;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">То же такси. Директор говорит: «Сервис должен работать всегда». Аналитик переводит проценты в часы — так понятно, о чём договариваемся. Месяц считаем по 30 дней, это 720 часов.</p>
      ${ui.seg('nn', NINES.map(n => ({ v: n.v, t: pctT(n.v) })), cur, 'accent')}
      <div class="nfr-stats" data-st></div>
      <div data-need></div>
      <div class="stack tight"><div class="nfr-lbl">Цена на пальцах: во сколько раз дороже, чем 99 %</div><div class="nfr-cost" data-cost></div><div class="small dim">Порядок, а не прайс: настоящие цифры считает архитектор под конкретную систему.</div></div>
      <label class="toggle"><input type="checkbox" data-win> <span>Окно обслуживания — 1 час каждую ночь — считать простоем</span></label>
      <div data-wn></div>
    </div>`;
    function draw() {
      const n = NINES.find(x => x.v === cur), down = 1 - n.a;
      const mo = 720 * down, wk = 168 * down, yr = 8760 * down;
      TR.$('[data-st]', pane).innerHTML = [['Простой в месяц', fmtH(mo)], ['В неделю', fmtH(wk)], ['В год', fmtH(yr) + (yr >= 24 ? ` · ≈ ${n1(yr / 24)} сут.` : '')]]
        .map(([k, v]) => `<div class="stat"><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></div>`).join('');
      TR.$('[data-need]', pane).innerHTML = ui.note('info', `${pctT(n.v)} — что нужно, чтобы это обещать`, `${esc(n.need)}. На пальцах: ${fmtH(mo)} простоя в месяц — это ${esc(n.an)}.`);
      TR.$('[data-cost]', pane).innerHTML = NINES.map(x => `<div class="r ${x.v === cur ? 'on' : ''}"><span>${pctT(x.v)}</span><span class="b"><i style="width:${x.cost * 10}%"></i></span><span class="tnum">×${String(x.cost).replace('.', ',')}</span></div>`).join('');
      TR.$('[data-wn]', pane).innerHTML = win
        ? ui.note('bad', 'Так не сходится', `Окно — 1 час × 30 ночей = 30 часов в месяц. А при ${pctT(n.v)} допустимо всего ${fmtH(mo)}. Если окно считать простоем, обещание невыполнимо с первой же ночи. Поэтому в требовании пишут прямо: «окно обслуживания … в расчёт доступности не входит».`)
        : ui.note('ok', 'Окно записано условием', `Ночное окно не входит в расчёт: ${pctT(n.v)} считаем по остальному времени. Это условие пишут в самом требовании — иначе на приёмке каждый посчитает по-своему. И ещё одно правило: 100 % не обещает никто. Принцип из практики SRE (книга Google «Site Reliability Engineering»): каждая следующая девятка дороже, а пользователь может её не заметить — его телефон и мобильная сеть ломаются чаще.`);
    }
    ui.onSeg(pane, (nm, v) => { if (nm === 'nn') { cur = v; draw(); } });
    TR.$('[data-win]', pane).addEventListener('change', e => { win = e.target.checked; draw(); });
    draw();
  }

  const howNumbers = {
    id: 'how-numbers', covers: ['nines'], title: 'Как это работает: перцентили и «девятки»', free: true, noReset: true,
    simple: {
      icon: '⏱️',
      plain: '«В среднем» прячет тех, кому плохо. Поэтому скорость записывают так: «95 из 100 получают ответ быстрее секунды». А проценты доступности переводят в часы простоя — тогда видно, о чём договариваемся и сколько это стоит.',
      analogy: 'Очередь в поликлинике «в среднем 10 минут» — а один пациент сидел час. Честнее сказать: «95 из 100 ждали не дольше 15 минут». А «аптека открыта 99 % времени» — это больше семи часов закрытых дверей в месяц.',
      tech: '<b>Перцентиль p</b> — значение, не больше которого время у p % запросов (p50 — медиана, p95, p99). Среднее чувствительно к хвосту и не показывает его. <b>Доступность</b> = время работы / всё время за период; 99,5 % за 30 дней — 3,6 ч простоя, 99,9 % — 43 минуты. Каждая «девятка» уменьшает допустимый простой в 10 раз и заметно дорожает (практика SRE, Google). Окно обслуживания либо входит в расчёт, либо явно исключается — это пишут в требовании.'
    },
    lead: ui.brief({
      situation: 'Соседний пример — служба такси. Директор хочет «чтобы не тормозило» и «работало всегда». Две вкладки: как честно записать скорость (перцентиль вместо среднего) и что на самом деле значат проценты доступности.',
      todo: [
        'Вкладка «Перцентили»: переключите «Ровно» и «С хвостом» — сравните среднее, p95 и два требования внизу. Двигайте ползунок перцентиля от 50 до 99, особенно между 90 и 91.',
        'Вкладка «Девятки → часы»: переключайте 99 %, 99,5 %, 99,9 %, 99,99 % и смотрите на часы простоя, на то, что нужно для обещания, и на цену. Включите «окно обслуживания считать простоем».'
      ],
      look: 'Фиолетовая пунктирная линия — среднее, зелёная сплошная — выбранный перцентиль, серая точечная — порог 1 секунда. Шкала цены — во сколько раз дороже, чем 99 %.'
    }),
    render(el) {
      el.classList.add('nfr-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'pct', t: 'Перцентили', render: fresh(drawPct) },
        { id: 'nines', t: 'Девятки → часы', render: fresh(drawNines) }
      ], 'pct');
    }
  };

  // =====================================================================
  // Теория 3. Сценарий атрибута качества, способы проверки, компромиссы (такси)
  // =====================================================================
  const QAS_PARTS = [
    { id: 'src', t: 'Источник', q: 'кто или что вызывает событие', why: 'Кто или что запускает событие: люди, другая система, оборудование, злоумышленник. От источника зависит, что считать нормой.' },
    { id: 'stim', t: 'Стимул', q: 'что случилось', why: 'Само событие: нажатие, отказ, атака, изменение. Без него непонятно, на что система должна отвечать.' },
    { id: 'env', t: 'Среда', q: 'в какой обстановке', why: 'Обстановка: пик или ночь, обычный режим или авария. Без среды замер «ночью и в одиночку» пройдёт любой тест.' },
    { id: 'art', t: 'Артефакт', q: 'какая часть системы', why: 'Какая часть системы под ударом: вся система, один экран, одна интеграция. Так понятно, что строить и что проверять.' },
    { id: 'resp', t: 'Отклик', q: 'что делает система', why: 'Что система должна сделать — поведение, которое видно снаружи.' },
    { id: 'meas', t: 'Мера отклика', q: 'как поймём, что хорошо', why: 'Число, по которому Лера поставит «прошёл / не прошёл».' }
  ];
  const QAS_EX = {
    perf: { t: 'Скорость', v: { src: 'пассажиры такси', stim: 'нажимают «Заказать машину» — до 3 000 заказов в час', env: 'вечер пятницы, дождь, мобильный интернет', art: 'сервис подбора машины', resp: 'находит машину и показывает время подачи', meas: '95 % ответов — быстрее 2 секунд' },
      s: 'В вечер пятницы, в дождь, пассажиры жмут «Заказать машину» — до 3 000 заказов в час с мобильного интернета; сервис подбора находит машину и показывает время подачи, и 95 % ответов приходят быстрее 2 секунд.' },
    avail: { t: 'Сбой', v: { src: 'сервер подбора машины', stim: 'внезапно отключается', env: 'обычный рабочий день', art: 'сервис заказа такси', resp: 'переключается на запасной сервер и не теряет принятые заказы', meas: 'перерыв в приёме — не дольше 1 минуты, потерянных заказов — ноль' },
      s: 'В обычный рабочий день сервер подбора машины внезапно отключается; сервис заказа переключается на запасной сервер и не теряет принятые заказы: перерыв в приёме — не дольше минуты, потерянных заказов — ноль.' },
    sec: { t: 'Защита', v: { src: 'злоумышленник', stim: 'перебирает коды из SMS, чтобы войти в чужой аккаунт', env: 'в любое время', art: 'проверка входа в приложение', resp: 'после 5 неверных кодов блокирует вход на 15 минут и сообщает владельцу', meas: 'ни одного входа подбором; владелец узнаёт в течение минуты' },
      s: 'Злоумышленник в любое время перебирает коды из SMS, чтобы войти в чужой аккаунт; после 5 неверных кодов вход блокируется на 15 минут, а владелец получает сообщение в течение минуты — ни одного входа подбором.' }
  };
  function drawChain(pane) {
    let ex = 'perf', shown = 0;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Служба такси. Дима просит записать сложное качество сценарием: что случилось, в какой обстановке, с какой частью системы, что она делает и как это измерить. Это язык архитекторов — так НФТ превращается и в решение, и в тест.</p>
      <div class="row">${ui.seg('qx', Object.keys(QAS_EX).map(k => ({ v: k, t: QAS_EX[k].t })), ex, 'accent')}</div>
      <div class="row"><button type="button" class="btn sm primary" data-q="step">Шаг →</button><button type="button" class="btn sm ghost" data-q="all">Показать всё</button><button type="button" class="btn sm ghost" data-q="reset">⟲ Сначала</button><span class="small dim tnum" data-qn></span></div>
      <div class="nfr-chain" data-ch></div>
      <div data-qnote aria-live="polite"></div>
    </div>`;
    function draw() {
      const e = QAS_EX[ex];
      TR.$('[data-ch]', pane).innerHTML = QAS_PARTS.map((p, i) => `<div class="nfr-box ${i < shown ? '' : 'ghost'} ${i === shown - 1 ? 'on' : ''}"><span class="k">${i + 1} · ${esc(p.t)}</span><span class="q">${esc(p.q)}</span><span class="v">${i < shown ? esc(cap(e.v[p.id])) : '…'}</span></div>`).join('');
      TR.$('[data-qn]', pane).textContent = `${shown} / 6`;
      TR.$('[data-qnote]', pane).innerHTML = shown === 0 ? ui.note('info', 'С чего начать', 'Нажмите «Шаг →»: части появятся по очереди, с пояснением, зачем каждая.')
        : shown < 6 ? ui.note('info', QAS_PARTS[shown - 1].t, esc(QAS_PARTS[shown - 1].why))
          : ui.note('ok', 'Сценарий целиком', `${esc(e.s)}<br><span class="small muted">Дима берёт такой сценарий в архитектуру, а Лера превращает его в тест: стимул и среду она воспроизводит на стенде, меру — сравнивает с результатом.</span>`);
    }
    ui.onSeg(pane, (n, v) => { if (n === 'qx') { ex = v; shown = 0; draw(); } });
    TR.on(pane, 'click', '[data-q]', (e, b) => { const q = b.dataset.q; if (q === 'step') shown = Math.min(6, shown + 1); if (q === 'all') shown = 6; if (q === 'reset') shown = 0; draw(); });
    draw();
  }

  const METHODS = [
    { id: 'load', t: 'Нагрузочный тест', ico: '🏋️', what: 'На стенде программа-робот изображает тысячи пользователей; засекаем время ответа и ищем, где система «сдаётся».', y: 'скорость и ёмкость — до запуска', n: 'долгую доступность: месяц работы тестом не заменишь' },
    { id: 'mon', t: 'Мониторинг в работе', ico: '📈', what: 'Система работает, автоматические проверки каждую минуту считают ответы и простои; в конце месяца — отчёт.', y: 'доступность за период, реальную скорость у живых людей', n: 'ничего до запуска — это проверка по факту' },
    { id: 'fail', t: 'Тест на отказ', ico: '🔌', what: 'Намеренно ломаем: отключаем связь, выключаем сервер — и смотрим, что делает система и что теряется.', y: 'надёжность: поведение при сбое и восстановление', n: 'скорость и удобство' },
    { id: 'ux', t: 'Юзабилити-тест', ico: '👵', what: 'Живые люди из нужной группы выполняют задачу без подсказок; наблюдаем, засекаем время и ошибки.', y: 'удобство, обучаемость, доступность для людей', n: 'нагрузку и защиту данных' },
    { id: 'audit', t: 'Аудит', ico: '🔍', what: 'Проверяем документы, настройки, договоры и журналы: где лежат данные, у кого доступ, что записано.', y: 'законы, защиту данных, соблюдение правил', n: 'скорость и удобство' },
    { id: 'demo', t: 'Демонстрация на стенде', ico: '🖥️', what: 'Показываем по чек-листу: «вот настройка — меняем — вот результат», «вот экран — поля для набора текста нет».', y: 'наличие свойства: «можно поменять без программиста», «нет набора текста»', n: 'поведение под нагрузкой и за долгий срок' }
  ];
  const MINI = [
    { id: 'x1', t: 'Время подачи машины по умолчанию администратор меняет в настройках, без программиста', ok: 'demo' },
    { id: 'x2', t: 'Пассажир старше 60 лет впервые заказывает такси сам — не дольше 2 минут', ok: 'ux' },
    { id: 'x3', t: 'Сервис заказа доступен 99,9 % времени в месяц', ok: 'mon' }
  ];
  function drawMeth(pane) {
    const got = {};
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Шесть способов доказать, что НФТ выполнено. Ни один не годится для всего: у каждого своя сильная сторона. Аналитик пишет способ проверки прямо в требовании — чтобы Лера и подрядчик не спорили на приёмке.</p>
      <div class="nfr-meths">${METHODS.map(m => `<div class="nfr-meth"><b>${m.ico} ${esc(m.t)}</b><span>${esc(m.what)}</span><span class="y">✓ Докажет: ${esc(m.y)}</span><span class="n">✕ Не докажет: ${esc(m.n)}</span></div>`).join('')}</div>
      <div class="nfr-lbl">Попробуйте на такси: чем проверить?</div>
      <div class="stack tight" data-mini></div>
    </div>`;
    function draw() {
      TR.$('[data-mini]', pane).innerHTML = MINI.map(x => {
        const g = got[x.id], m = METHODS.find(mm => mm.id === g), good = g === x.ok;
        return `<div class="nfr-mini"><b style="font-size:14px">${esc(x.t)}</b>${pills('mini|' + x.id, METHODS.map(mm => ({ v: mm.id, t: mm.t })), g, { sm: true, mark: g ? { [g]: good ? 'ok' : 'bad' } : null })}${g ? `<div class="fb ${good ? 'ok' : 'bad'}">${good ? '✓ Да: ' + esc(m.y) + '.' : '✕ Не то: этот способ докажет «' + esc(m.y) + '». А что здесь нужно доказать?'}</div>` : ''}</div>`;
      }).join('');
    }
    TR.on(pane, 'click', '[data-pk]', (e, b) => { const id = b.dataset.pk.split('|')[1]; got[id] = b.dataset.pv; draw(); });
    draw();
  }

  const TRADE = {
    login: { t: 'Вход в приложение', o: [
      { v: 'none', t: 'без входа', u: 100, s: 10, m: 'Без входа любой, кто взял телефон, закажет поездку за чужой счёт.' },
      { v: 'month', t: 'пароль раз в месяц', u: 85, s: 70, m: '' },
      { v: 'every', t: 'код из SMS при каждом заказе', u: 40, s: 95, m: 'Код на каждый заказ: в дождь у подъезда ждать SMS — бесит, часть пассажиров уходит.' }] },
    speed: { t: 'Подбор машины, 95 % быстрее', o: [
      { v: '3', t: '3 с', f: 45, c: 10, m: 'Три секунды на «Заказать» — пассажир жмёт ещё раз, появляются двойные заказы.' },
      { v: '1', t: '1 с', f: 85, c: 30, m: '' },
      { v: '03', t: '0,3 с', f: 92, c: 70, m: 'Разницу между 1 с и 0,3 с пассажир почти не замечает, а стоит она вдвое дороже.' }] },
    avail: { t: 'Доступность в месяц', o: [
      { v: '99', t: '99 %', r: 50, c: 10, m: 'Семь часов в месяц без такси — кто-то застрянет ночью у вокзала.' },
      { v: '999', t: '99,9 %', r: 85, c: 35, m: '' },
      { v: '9999', t: '99,99 %', r: 95, c: 90, m: 'Каждая следующая девятка — в разы дороже: два дата-центра и дежурство круглые сутки.' }] }
  };
  function drawTrade(pane) {
    const st = { login: 'every', speed: '03', avail: '9999' };
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Требования к качеству тянут одеяло друг у друга. Выкрутите всё на максимум — и посмотрите, что станет с удобством и ценой. Потом найдите баланс.</p>
      <div class="nfr-2"><div class="stack">${Object.keys(TRADE).map(k => `<div class="nfr-knob"><span class="k">${esc(TRADE[k].t)}</span>${ui.seg(k, TRADE[k].o.map(o => ({ v: o.v, t: o.t })), st[k], 'accent')}</div>`).join('')}</div>
      <div class="stack tight"><div class="nfr-bars" data-bars></div></div></div>
      <ul class="checks" data-msg></ul>
      ${ui.note('info', 'Как разводят споры', 'Строгость — там, где риск (оплата новой картой, вход с нового телефона), мягкость — там, где риска нет (повтор привычной поездки). Порог скорости — там, где человек разницу замечает, а не «чем быстрее, тем лучше». Девятки — столько, сколько стоит час простоя для бизнеса. Аналитик готовит варианты с ценой, а выбирает владелец продукта.')}
    </div>`;
    function draw() {
      const L = TRADE.login.o.find(o => o.v === st.login), S = TRADE.speed.o.find(o => o.v === st.speed), A = TRADE.avail.o.find(o => o.v === st.avail);
      const cost = Math.round((S.c + A.c) / 2);
      const bar = (t, v, bad) => { const k = bad ? (v > 60 ? 'bad' : v > 35 ? 'warn' : '') : (v < 50 ? 'bad' : v < 75 ? 'warn' : ''); return `<div class="r"><span>${esc(t)}</span>${ui.meter(v / 100, k)}<span class="tnum">${v}</span></div>`; };
      TR.$('[data-bars]', pane).innerHTML = bar('Удобство', L.u) + bar('Защита', L.s) + bar('Скорость', S.f) + bar('Надёжность', A.r) + bar('Стоимость', cost, true);
      const msgs = [L, S, A].filter(o => o.m).map(o => `<li class="warn">${esc(o.m)}</li>`);
      TR.$('[data-msg]', pane).innerHTML = msgs.length ? msgs.join('') : '<li>Баланс: защита без кода на каждый заказ, скорость, которую замечает человек, и девятки по карману. Ни одна шкала не в нуле — это и есть компромисс.</li>';
    }
    ui.onSeg(pane, (n, v) => { if (st[n] != null) { st[n] = v; draw(); } });
    draw();
  }

  const howQas = {
    id: 'how-qas', covers: ['verify', 'conflicts', 'explain'], title: 'Как это работает: сценарий качества, способы проверки и компромиссы', free: true, noReset: true,
    simple: {
      icon: '🧯',
      plain: 'Сложное НФТ удобно записать маленькой историей: что случилось, в какой обстановке, с какой частью системы, что она должна сделать и как мы это измерим. Потом решить, чем проверять: нагрузкой, наблюдением за работой, живыми людьми или проверкой документов. И помнить, что требования к качеству тянут одеяло друг у друга.',
      analogy: 'Пожарные учения в цеху: «в 14:00, в смену, срабатывает датчик дыма у печи — все выходят за 3 минуты». Не «у нас безопасно», а сценарий, который можно прогнать и засечь. А вторую дверь, которая ускоряет выход, нельзя оставлять открытой — сквозняк студит тесто: безопасность спорит с технологией.',
      tech: '<b>Сценарий атрибута качества</b> (Басс, Клементс, Кацман, «Архитектура программного обеспечения на практике», SEI): источник стимула → стимул → среда → артефакт → отклик → мера отклика. <b>Способы проверки</b> по ISO/IEC/IEEE 29148: осмотр (инспекция), анализ, демонстрация, испытание; для НФТ на практике — нагрузочный тест, тест на отказ, мониторинг в эксплуатации, юзабилити-тест, аудит. <b>Компромиссы</b> между атрибутами (trade-off) выявляют заранее и решают с владельцем продукта.'
    },
    lead: ui.brief({
      situation: 'Соседний пример — служба такси. Три вкладки: как записать качество сценарием из шести частей, чем доказать, что требование выполнено, и почему нельзя выкрутить всё качество на максимум.',
      todo: [
        'Вкладка «Шесть частей сценария»: выберите пример (скорость, сбой, защита) и пройдите кнопкой «Шаг →» все шесть частей. Прочитайте пояснения и итоговый сценарий.',
        'Вкладка «Чем проверить»: прочитайте карточки способов и попробуйте подобрать способ для трёх требований такси.',
        'Вкладка «Тянут одеяло»: начните с «всё на максимум», посмотрите на шкалы и найдите баланс, при котором ни одна шкала не проваливается.'
      ],
      look: 'В цепочке зелёная рамка — часть, которая появилась последней. На шкалах «Стоимость» — чем больше, тем хуже, остальные — чем больше, тем лучше.'
    }),
    render(el) {
      el.classList.add('nfr-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'chain', t: 'Шесть частей сценария', render: fresh(drawChain) },
        { id: 'meth', t: 'Чем проверить', render: fresh(drawMeth) },
        { id: 'trade', t: 'Тянут одеяло', render: fresh(drawTrade) }
      ], 'chain');
    }
  };

  // =====================================================================
  // Практика 1. Конструктор: из пожеланий Нины — в измеримые НФТ
  // =====================================================================
  const SLOTS = [
    { id: 'm', t: 'Метрика', q: 'что именно меряем' },
    { id: 't', t: 'Порог', q: 'какое значение считаем успехом' },
    { id: 'c', t: 'Условия', q: 'нагрузка, время, устройство, для чего' },
    { id: 'v', t: 'Способ проверки', q: 'как и когда докажем' }
  ];
  const WISH = [
    { id: 'speed', short: 'Чтобы не тормозило', who: 'nina', said: '«Главное — чтобы не тормозило. Рита говорит, через год будет до тысячи двухсот заказов в день».', src: 'интервью с Ниной, F-speed', iso: 'производительность',
      o: {
        m: [{ v: 'a', t: 'время от нажатия «Оформить» до экрана оплаты в приложении', s: 1 },
          { v: 'b', t: 'скорость работы приложения', s: 0, why: 'Что именно засекать? «Скорость приложения» секундомером не измерить — нужен конкретный отрезок «от … до …».' },
          { v: 'c', t: 'мощность серверов', s: 0, why: 'Это решение Димы, а не то, что чувствует покупатель. Мерить нужно то, что видит человек у кассы или дома.' }],
        t: [{ v: 'a', t: 'в среднем не дольше 1 с', s: 0.5, why: 'Среднее прячет хвост: «в среднем секунда», а каждый десятый ждёт пять. Вспомните квадратики в теории про перцентили.' },
          { v: 'b', t: 'у 95 % нажатий — не дольше 1 с', s: 1 },
          { v: 'c', t: 'мгновенно', s: 0, why: '«Мгновенно» — слово-ловушка: Лера не сможет поставить «прошёл / не прошёл».' },
          { v: 'd', t: 'у 100 % нажатий — не дольше 0,1 с', s: 0, why: 'Выполнимо ли? Сто процентов и десятую долю секунды на мобильном интернете не обещает никто — и стоит это как вся первая версия.' }],
        c: [{ v: 'a', t: 'до 400 заказов в час, утренний пик 07:30–09:00, мобильный интернет покупателя', s: 1 },
          { v: 'b', t: 'в обычном режиме работы', s: 0, why: 'Ночью одному покупателю любое приложение отвечает быстро. А когда у Покровки очередь?' },
          { v: 'c', t: 'до 1 200 заказов в час', s: 0.5, why: 'Перечитайте F-speed: 1 200 — это за день. Сколько в час в пик? Лишний запас Дима посчитает втрое дороже.' }],
        v: [{ v: 'a', t: 'нагрузочный тест на стенде до запуска — 400 заказов в час, смотрим 95-й перцентиль; затем мониторинг в пилоте', s: 1 },
          { v: 'b', t: 'Нина Сергеевна посмотрит на демо', s: 0, why: 'На демо один человек и офисный Wi-Fi — там «не тормозит» всё.' },
          { v: 'c', t: 'через месяц спросим покупателей, не тормозит ли', s: 0.5, why: 'Опрос покажет недовольство, но поздно и без цифры. Как доказать порог ещё до запуска?' }]
      } },
    { id: 'always', short: 'Чтобы работало всегда', who: 'nina', said: '«Всё должно работать всегда и без сбоев» — пункт 9 письма. И на встрече: «заказывать в приложении — круглосуточно».', src: 'письмо Нины (п. 9), F-hours', iso: 'надёжность: готовность',
      o: {
        m: [{ v: 'a', t: 'доля времени в месяц, когда покупатель может оформить заказ в приложении', s: 1 },
          { v: 'b', t: 'отсутствие сбоев', s: 0, why: 'Сбоев «нет» не бывает ни у кого. Что можно посчитать — так это долю времени, когда заказ можно оформить.' },
          { v: 'c', t: 'время работы серверов', s: 0.5, why: 'Сервер может работать, а оформление — нет (например, сломалась оплата). Мерить надо то, что видит покупатель.' }],
        t: [{ v: 'a', t: '100 %', s: 0, why: '100 % не обещает никто — даже банки. Такое обещание нельзя ни выполнить, ни честно проверить.' },
          { v: 'b', t: 'не меньше 99,5 % — не больше ~3,6 ч простоя в месяц', s: 1 },
          { v: 'c', t: 'не меньше 99 % за год', s: 0.5, why: 'Посчитайте: 1 % года — почти 88 часов, и они могут прийтись на 7 марта. А год — слишком долгий срок, чтобы вовремя заметить беду.' },
          { v: 'd', t: 'не меньше 99,99 %', s: 0.5, why: 'Четыре минуты простоя в месяц — уровень банков: два дата-центра и дежурство круглые сутки. По карману ли это бюджету 6 млн ₽?' }],
        c: [{ v: 'a', t: 'круглосуточно; окно обслуживания 01:00–02:30 простоем не считается', s: 1 },
          { v: 'b', t: 'круглосуточно, без перерывов на обслуживание', s: 0, why: 'Когда тогда обновлять систему? Перечитайте F-hours: ночью есть окно, о котором договорились.' },
          { v: 'c', t: 'с 07:00 до 21:00, пока открыты пекарни', s: 0, why: 'Пекарни закрываются, а заказы в приложении принимают круглосуточно — и на завтра до 22:30 (F-hours, F-cutoff).' }],
        v: [{ v: 'a', t: 'мониторинг: автоматическая проверка оформления каждую минуту, отчёт о простоях за месяц', s: 1 },
          { v: 'b', t: 'нагрузочный тест перед запуском', s: 0.5, why: 'Нагрузочный тест покажет скорость в пик, но не долю времени за месяц. Как посчитать простои за месяц работы?' },
          { v: 'c', t: 'в конце месяца спросить кассиров', s: 0, why: 'Кассиры не видят ночные простои приложения и не считают минуты.' }]
      } },
    { id: 'elder', short: 'Удобно для бабушек', who: 'nina', said: '«Удобно для бабушек» — пункт 10 письма. «У нас сорок процентов постоянных — старше пятидесяти пяти».', src: 'письмо Нины (п. 10), F-elder', iso: 'удобство и доступность для людей',
      o: {
        m: [{ v: 'a', t: 'доля покупателей 55+, оформивших первый предзаказ без помощи, и время оформления', s: 1 },
          { v: 'b', t: 'красота и современность дизайна', s: 0, why: '«Красиво» — вкус, его не проверить. Что должен суметь человек?' },
          { v: 'c', t: 'размер шрифта на экранах', s: 0.5, why: 'Крупный шрифт — хорошее средство, но не результат: шрифт можно сделать крупным, а человек всё равно запутается. Что он должен суметь?' }],
        t: [{ v: 'a', t: 'всем понравилось', s: 0, why: 'Как Лера посчитает «понравилось»? Нужна цифра: сколько человек справились и за сколько минут.' },
          { v: 'b', t: 'не меньше 4 из 5, каждый — не дольше 5 минут', s: 1 },
          { v: 'c', t: '5 из 5 — не дольше 1 минуты', s: 0.5, why: 'Выполнимо ли? Минута на самый первый заказ — мало даже для молодых. Слишком строгий порог провалит хорошее приложение.' }],
        c: [{ v: 'a', t: 'первый заказ, свой смартфон, без инструкции и подсказок', s: 1 },
          { v: 'b', t: 'после обучения в пекарне', s: 0, why: 'Покупателей не учат, как кассиров. Анна Павловна откроет приложение дома, сама.' },
          { v: 'c', t: 'на планшете разработчика, с подсказками', s: 0, why: 'На чужом устройстве и с подсказкой справится кто угодно. В каких условиях будет настоящий покупатель?' }],
        v: [{ v: 'a', t: 'юзабилити-тест до пилота: 5 постоянных покупательниц 55+, наблюдаем и засекаем', s: 1 },
          { v: 'b', t: 'Нина Сергеевна посмотрит и скажет', s: 0, why: 'Нина видит приложение глазами владелицы, а не покупательницы без опыта со смартфоном. Кто должен пройти проверку?' },
          { v: 'c', t: 'анкета в приложении: «Удобно ли вам?»', s: 0.5, why: 'Анкету заполнят те, кто справился. Кто запутался — просто закроет приложение, и вы их не услышите.' }]
      } },
    { id: 'secure', short: 'Чтобы было безопасно', who: 'oleg', said: '«Нина Сергеевна сказала “чтобы было безопасно”. Для меня это значит: телефоны, имена и дни рождения покупателей — по 152-ФЗ. Согласие, хранение в России, удаление по запросу».', src: 'Олег Петрович, F-pd', iso: 'защищённость и закон',
      o: {
        m: [{ v: 'a', t: 'где хранятся персональные данные покупателей и за сколько дней их удаляют по запросу', s: 1 },
          { v: 'b', t: 'уровень безопасности системы', s: 0, why: '«Уровень безопасности» одним числом не измерить. Что именно защищаем и от чего?' },
          { v: 'c', t: 'длина пароля администратора', s: 0.5, why: 'Одна мера защиты — полезная, но узкая. Олег Петрович говорил о данных покупателей: телефон, имя, день рождения.' }],
        t: [{ v: 'a', t: 'максимально надёжно', s: 0, why: '«Максимально» — слово-ловушка: где граница и как её проверить?' },
          { v: 'b', t: 'только на серверах в России; удаление — не позже 30 дней с запроса', s: 1 },
          { v: 'c', t: 'удаление по запросу, когда будет время', s: 0, why: '152-ФЗ требует удалять данные по запросу в срок. «Когда будет время» — не срок.' }],
        c: [{ v: 'a', t: 'телефон, имя и день рождения; согласие — до сбора; запрос — через приложение или кассу', s: 1 },
          { v: 'b', t: 'если покупатель пожалуется в соцсетях', s: 0, why: 'Закон не ждёт жалобы в соцсетях. При каком событии система обязана удалить данные?' },
          { v: 'c', t: 'только для покупателей приложения', s: 0.5, why: 'А те, кто заказал по телефону через кассира? Их телефон — тоже персональные данные.' }],
        v: [{ v: 'a', t: 'аудит: где стоят серверы, журнал запросов на удаление; плюс демонстрация удаления на стенде', s: 1 },
          { v: 'b', t: 'нагрузочный тест', s: 0, why: 'Нагрузка проверяет скорость. Где лежат данные и удалены ли они, показывают документы, настройки и журнал.' },
          { v: 'c', t: 'спросить разработчиков, всё ли защищено', s: 0, why: 'Разработчики честно скажут «да». Как это доказать Олегу Петровичу и проверяющему?' }]
      } }
  ];
  const LERA_Q = { m: 'Что мне засекать или проверять?', t: 'С каким числом сравнивать?', c: 'В каких условиях мерить: когда, при какой нагрузке, на чём, для каких данных?', v: 'Чем и когда я это проверю?' };
  const optOf = (w, sid, v) => w.o[sid].find(x => x.v === v) || null;
  function wEval(w, a) {
    a = a || {};
    const rows = SLOTS.map(s => { const o = optOf(w, s.id, a[s.id]); return { s, o, sc: o ? o.s : 0, empty: !o }; });
    return { rows, score: rows.reduce((x, r) => x + r.sc, 0) / SLOTS.length, zeros: rows.filter(r => !r.empty && r.sc === 0).length, empty: rows.filter(r => r.empty).length };
  }
  function msEval(ans) {
    const v = (ans && ans.w) || {};
    const per = WISH.map(w => ({ w, e: wEval(w, v[w.id]) }));
    return { per, score: per.reduce((s, x) => s + x.e.score, 0) / WISH.length, bad: per.reduce((s, x) => s + x.e.zeros + x.e.empty, 0) };
  }
  function msPreview(w, wa) {
    const g = id => { const o = optOf(w, id, (wa || {})[id]); return o ? o.t : null; };
    const m = g('m'), t = g('t'), c = g('c'), v = g('v');
    if (!m && !t && !c && !v) return `<span class="vague">${esc(w.short)}</span>`;
    return `${m ? `<span class="pm">${esc(cap(m))}</span>` : '<span class="vague">что меряем?</span>'} — ${t ? `<span class="pt">${esc(t)}</span>` : '<span class="vague">какой порог?</span>'}; условия: ${c ? `<span class="pc">${esc(c)}</span>` : '<span class="vague">какие?</span>'}. Проверка: ${v ? `<span class="pv">${esc(v)}</span>` : '<span class="vague">как?</span>'}.`;
  }
  const measureTask = {
    id: 'measure', title: 'Конструктор: из пожеланий Нины — в измеримые НФТ',
    simple: howWhy.simple,
    lead: ui.brief({
      situation: 'Дима ждёт от вас раздел нефункциональных требований — без него он не оценит архитектуру. На руках четыре пожелания: «чтобы не тормозило», «чтобы работало всегда», «удобно для бабушек» и «чтобы было безопасно» (его Олег Петрович уже перевёл на язык 152-ФЗ). Ксения: «Соберите каждое из четырёх частей. Числа предлагаем мы, утверждает Нина, — но предлагать надо честные».',
      todo: [
        'Вверху выберите пожелание (кнопки 1–4).',
        'Для каждого соберите четыре части: «Метрика», «Порог», «Условия», «Способ проверки» — нажмите по одному варианту в каждой. Ниже, в «Что получилось», появится требование целиком, а Лера спросит, чего не хватает.',
        'Соберите все четыре пожелания и нажмите «Проверить». Засчитывается от 80 %, если ни одна часть не выбрана «мимо» и вариантов «с изъяном» не больше двух. После проверки под выбранными вариантами появятся пояснения.'
      ],
      look: 'Опирайтесь на договорённости «Колоса»: через год — до 1 200 предзаказов в день и до 400 в час в утренний пик; заказы в приложении — круглосуточно, ночью с 01:00 до 02:30 систему можно обслуживать; 40 % постоянных клиентов старше 55 лет; персональные данные — по 152-ФЗ. Варианты с изъяном засчитываются наполовину: «в среднем», «за год», «размер шрифта» — близко, но не то.'
    }),
    blank: () => ({ w: {} }),
    reference: () => ({ w: Object.fromEntries(WISH.map(w => [w.id, Object.fromEntries(SLOTS.map(s => [s.id, w.o[s.id].find(x => x.s === 1).v]))])) }),
    render(el, ctx) {
      el.classList.add('nfr-root');
      const a = ctx.ans; a.w = a.w || {};
      WISH.forEach(w => { a.w[w.id] = a.w[w.id] || {}; });
      let cur = WISH.some(w => w.id === a.tab) ? a.tab : WISH[0].id;
      const touched = new Set();
      const judged = !!(ctx.result || ctx.readonly);
      el.innerHTML = '<div class="stack"><div class="nfr-wtabs" data-wt></div><div data-wb></div></div>';
      function drawTabs() {
        TR.$('[data-wt]', el).innerHTML = WISH.map((w, i) => {
          const e = wEval(w, a.w[w.id]), filled = SLOTS.filter(s => a.w[w.id][s.id]).length;
          const mk = judged && !SLOTS.some(s => touched.has(w.id + s.id)) ? (e.empty || e.zeros ? 'bad' : e.score === 1 ? 'ok' : 'warn') : '';
          return `<button type="button" class="nfr-wtab ${mk}" data-wtab="${w.id}" aria-pressed="${w.id === cur}"><span>${i + 1}. ${esc(w.short)}</span><small>выбрано ${filled} из 4</small></button>`;
        }).join('');
      }
      function drawBody() {
        const w = WISH.find(x => x.id === cur), wa = a.w[w.id];
        const miss = SLOTS.find(s => !wa[s.id]);
        const e = wEval(w, wa);
        const lera = miss ? LERA_Q[miss.id] : (judged && e.score === 1 && !SLOTS.some(s => touched.has(w.id + s.id)) ? 'Это я проверю: тест напишу прямо по этим цифрам и условиям.' : 'Собрано. Перечитайте глазами тестировщика: что я сделаю, что увижу и с каким числом сравню?');
        TR.$('[data-wb]', el).innerHTML = `<div class="stack">
          ${ui.say(w.who, esc(w.said))}
          <div class="small dim">Источник: ${esc(w.src)} · характеристика: ${esc(w.iso)}</div>
          ${SLOTS.map(s => {
            const sel = optOf(w, s.id, wa[s.id]), show = judged && sel && !touched.has(w.id + s.id);
            return `<div class="nfr-slot"><div class="h"><b>${esc(s.t)}</b><span>${esc(s.q)}</span></div>${pills(w.id + '|' + s.id, TR.shuffle(w.o[s.id], 'nfr-ms-' + w.id + s.id), wa[s.id], { readonly: ctx.readonly, mark: show ? { [sel.v]: markOf(sel.s) } : null })}${show && sel.s < 1 ? `<div class="why">${esc(sel.why)}</div>` : ''}</div>`;
          }).join('')}
          <div class="nfr-lbl">Что получилось</div>
          <div class="nfr-sent">${msPreview(w, wa)}</div>
          ${ui.say('lera', esc(lera))}
        </div>`;
      }
      TR.on(el, 'click', '[data-wtab]', (e, b) => { cur = b.dataset.wtab; a.tab = cur; ctx.save(); drawTabs(); drawBody(); });
      TR.on(el, 'click', '[data-pk]', (e, b) => {
        if (ctx.readonly) return;
        const [wid, sid] = b.dataset.pk.split('|');
        a.w[wid][sid] = b.dataset.pv; touched.add(wid + sid); ctx.save();
        drawTabs(); drawBody();
      });
      drawTabs(); drawBody();
    },
    check(ans) {
      const ev = msEval(ans), notes = [];
      ev.per.forEach(({ w, e }) => {
        if (e.empty === SLOTS.length) { notes.push({ ok: false, html: `«${esc(w.short)}»: ничего не выбрано.` }); return; }
        const emp = e.rows.filter(r => r.empty).map(r => r.s.t.toLowerCase());
        const bad = e.rows.filter(r => !r.empty && r.sc === 0).map(r => r.s.t.toLowerCase());
        const half = e.rows.filter(r => r.sc === 0.5).map(r => r.s.t.toLowerCase());
        if (!emp.length && !bad.length && !half.length) { notes.push({ ok: true, html: `«${esc(w.short)}»: все четыре части измеримы и проверяемы.` }); return; }
        const parts = [];
        if (emp.length) parts.push('не выбрано — ' + emp.join(', '));
        if (bad.length) parts.push('мимо — ' + bad.join(', '));
        if (half.length) parts.push('близко, но с изъяном — ' + half.join(', '));
        notes.push({ ok: emp.length || bad.length ? false : 'warn', html: `«${esc(w.short)}»: ${parts.join('; ')}. Пояснения — под выбранными вариантами.` });
      });
      const sp = ((ans && ans.w) || {}).speed || {}, al = ((ans && ans.w) || {}).always || {};
      const halves = ev.per.reduce((s, x) => s + x.e.rows.filter(r => r.sc === 0.5).length, 0);
      const ok = ev.bad === 0 && halves <= 2 && ev.score >= 0.8;
      if (!ev.bad && halves > 2) notes.unshift({ ok: false, html: `Вариантов «с изъяном» — ${halves}; для зачёта — не больше двух. Какие из них Лера проверит, но получит не то, что нужно Нине?` });
      const good = ev.per.reduce((s, x) => s + x.e.rows.filter(r => r.sc === 1).length, 0);
      return {
        ok, score: ev.score, notes,
        summary: `Частей точно в цель: ${good} из ${WISH.length * SLOTS.length}. Общий балл: ${Math.round(ev.score * 100)} %.`,
        mentor: sp.t === 'a' ? 'Про «в среднем»: Нине важны не средние покупатели, а те, кто стоит в очереди у Покровки и ждёт пять секунд. Как записать порог, чтобы их было видно?'
          : (al.t === 'a' || sp.t === 'd') ? 'Сто процентов звучат красиво, но их нельзя ни выполнить, ни проверить. Честное число с понятной ценой — это уважение к заказчику, а не уступка.'
            : ok ? 'Хорошо. Помните: цифры предлагает аналитик, а утверждает Нина — у каждой цифры есть цена. И у каждого НФТ должен быть хозяин-источник: Нина, Олег Петрович, наблюдение в пекарне.' : null
      };
    },
    explain: `<p>Каждое пожелание превращается в строку реестра нефункциональных требований. Так их и записывают в спецификации — отдельно от функций, с источником и способом проверки:</p>
      ${ui.table(['ID', 'Характеристика', 'Метрика и порог', 'Условия', 'Проверка', 'Источник'], [
        ['НФТ-1', 'Производительность', 'время от «Оформить» до экрана оплаты: у 95 % — не дольше 1 с', 'до 400 заказов в час, пик 07:30–09:00, мобильный интернет', 'нагрузочный тест до запуска; мониторинг в пилоте', 'Нина, F-speed'],
        ['НФТ-2', 'Надёжность: готовность', 'доля времени, когда можно оформить заказ: не меньше 99,5 % в месяц (≈ 3,6 ч простоя)', 'круглосуточно; окно 01:00–02:30 не считается', 'мониторинг каждую минуту, отчёт за месяц', 'Нина, п. 9; F-hours'],
        ['НФТ-3', 'Удобство для людей', 'доля покупателей 55+, оформивших первый заказ без помощи: не меньше 4 из 5, не дольше 5 минут', 'первый заказ, свой смартфон, без подсказок', 'юзабилити-тест до пилота на 5 покупательницах', 'Нина, п. 10; F-elder'],
        ['НФТ-4', 'Защищённость / закон', 'персональные данные — только на серверах в России; удаление — не позже 30 дней с запроса', 'телефон, имя, день рождения; согласие до сбора; запрос через приложение или кассу', 'аудит серверов и журнала; демонстрация удаления', 'Олег Петрович, F-pd']
      ])}
      <p>Почему именно так. <b>Метрика</b> — то, что видит человек («от нажатия до экрана оплаты»), а не устройство системы («мощность серверов»). <b>Порог</b> — долей случаев, а не средним, и без «100 %»: среднее прячет хвост, сотня невыполнима. <b>Условия</b> — самая частая дыра: без пика 07:30–09:00 тест «ночью в одиночку» пройдёт любой. <b>Способ проверки</b> — свой для каждого качества: скорость — нагрузкой, готовность — мониторингом за месяц, удобство — живыми людьми, закон — аудитом.</p>
      <p>Отдельно от НФТ-3 остаётся функциональное требование «заказ по телефону через кассира» (F-elder): удобное приложение не заменит тех, у кого смартфона нет вовсе. Источники: Вигерс и Битти, глава об атрибутах качества; ISO/IEC/IEEE 29148:2018 (проверяемое требование); Том Гилб, Planguage.</p>`,
    refNote: 'Цифры 95 % быстрее 1 с при 400 заказах в час, 99,5 %, окно 01:00–02:30, хранение в России и удаление за 30 дней — договорённости «Колоса» (DOMAIN §7). «4 из 5 за 5 минут» — предложение аналитика: его нужно согласовать с Ниной Сергеевной.',
    report: ans => WISH.map(w => { const wa = ((ans && ans.w) || {})[w.id] || {}; const e = wEval(w, wa); return `- «${w.short}» (${Math.round(e.score * 100)} %): ${SLOTS.map(s => { const o = optOf(w, s.id, wa[s.id]); return `${s.t.toLowerCase()} — ${o ? o.t : '—'}${o ? (o.s === 1 ? ' ✓' : o.s ? ' ≈' : ' ✗') : ''}`; }).join('; ')}`; }).join('\n')
  };

  // =====================================================================
  // Практика 2. Лаборатория «Торг за девятки»
  // =====================================================================
  const AV = [{ v: '99', t: '99 %', a: 0.99, cost: 200 }, { v: '99.5', t: '99,5 %', a: 0.995, cost: 400 }, { v: '99.9', t: '99,9 %', a: 0.999, cost: 900 }, { v: '99.99', t: '99,99 %', a: 0.9999, cost: 2000 }];
  const SP = [{ v: '3', t: '3 с', s: 3, cost: 100 }, { v: '2', t: '2 с', s: 2, cost: 200 }, { v: '1', t: '1 с', s: 1, cost: 400 }, { v: '0.5', t: '0,5 с', s: 0.5, cost: 900 }];
  const LD = [{ v: '200', t: '200 в час', n: 200, k: 0.6 }, { v: '400', t: '400 в час', n: 400, k: 1 }, { v: '700', t: '700 в час', n: 700, k: 1.5 }];
  const WN = [{ v: 'out', t: 'не считаем простоем' }, { v: 'in', t: 'считаем простоем' }];
  const Q_BUDGET = 1200;
  const DEMAND = [45, 70, 95, 100, 100, 90, 75, 55, 40, 30];
  const CUT = [{ t: 'сводная выгрузка в 1С', c: 140 }, { t: 'заказ по телефону через кассира', c: 140 }, { t: 'оплата при получении', c: 140 }, { t: 'экран выдачи для кассира', c: 280 }, { t: 'заказ торта с фото', c: 420 }, { t: 'онлайн-оплата', c: 280 }, { t: 'сам предзаказ', c: 560 }];
  const CONS = {
    a: { '99': ['bad', 'Простой до 7,2 ч в месяц — почти целая смена. Если хоть час придётся на 07:30–09:00, это до 400 потерянных заказов и очередь на Покровке.'],
      '99.5': ['ok', 'До 3,6 ч простоя в месяц; ремонт и обновления — ночью, в окне. Совпадает с договорённостью «Колоса».'],
      '99.9': ['warn', 'До 43 минут в месяц — приятно, но вы платите за минуты в три часа ночи, когда заказов почти нет. Нужны второй сервер и дежурный.'],
      '99.99': ['warn', 'До 4 минут в месяц — уровень банков: два дата-центра и дежурство круглые сутки. Для сети пекарен — переплата.'] },
    s: { '3': ['bad', 'В пик ответы по 3 с: покупатели жмут «Оформить» ещё раз — двойные заказы и разборы у кассы.'],
      '2': ['warn', 'Пауза в 2 с заметна: в очереди у двери часть покупателей бросит оформление.'],
      '1': ['ok', '95 % ответов быстрее секунды — человек почти не замечает ожидания.'],
      '0.5': ['warn', 'Полсекунды против секунды покупатель почти не почувствует, а цена — больше чем вдвое.'] },
    l: { '200': ['bad', 'В пик до 400 заказов в час (F-speed), а система рассчитана на 200: с 07:30 ответы растягиваются до 10 с, часть заказов теряется.'],
      '400': ['ok', 'Пик 400 заказов в час выдерживает — по прогнозу на год вперёд.'],
      '700': ['ok', 'Держит пик с запасом на рост до 15 пекарен (F-scale) — в полтора раза дороже по скорости.'] },
    w: { in: ['bad', 'Окно 01:00–02:30 каждую ночь — это 45 часов в месяц. Если считать его простоем, недостижимы даже 99 % (7,2 ч): требования противоречат друг другу.'],
      out: ['ok', 'Окно обслуживания записано условием: в это время приложение честно пишет «приём заказов возобновится в 02:30», а в расчёт доступности окно не входит.'] }
  };
  function labEval(a) {
    a = a || {};
    const A = AV.find(x => x.v === a.a), S = SP.find(x => x.v === a.s), L = LD.find(x => x.v === a.l), W = a.w;
    const cost = (A ? A.cost : 0) + (S ? Math.round(S.cost * (L ? L.k : 1)) : 0);
    const cond = { a: !!A && A.a >= 0.995, s: !!S && S.s <= 1, l: !!L && L.n >= 400, w: W === 'out', b: !!(A && S && L) && cost <= Q_BUDGET };
    const met = Object.keys(cond).filter(k => cond[k]).length;
    return { A, S, L, W, cost, cond, met, score: met / 5, all: met === 5 };
  }
  function peakSVG(L) {
    const W = 420, H = 190, X0 = 32, Y0 = 160, bw = 28, gap = 7, max = 200;
    const y = v => Y0 - v / max * 140;
    const capQ = L ? L.n / 4 : 0;
    let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:560px;display:block" role="img" aria-label="Заказы в утренний пик по 15 минут и сколько выдержит система">`;
    [0, 50, 100, 150, 200].forEach(v => { s += `<line x1="${X0}" y1="${y(v)}" x2="${W - 6}" y2="${y(v)}" style="stroke:var(--border);stroke-width:1"/><text x="${X0 - 6}" y="${y(v) + 4}" text-anchor="end" style="fill:var(--text-muted);font-size:12px">${v}</text>`; });
    DEMAND.forEach((d, i) => {
      const x = X0 + 10 + i * (bw + gap), okH = Math.min(d, capQ), over = Math.max(0, d - capQ);
      if (okH > 0) s += `<rect x="${x}" y="${y(okH)}" width="${bw}" height="${Y0 - y(okH)}" rx="3" style="fill:var(--ok);opacity:.7"/>`;
      if (over) s += `<rect x="${x}" y="${y(d)}" width="${bw}" height="${y(okH) - y(d)}" rx="3" style="fill:var(--bad)"/>`;
      if (i % 2 === 0) s += `<text x="${x + bw / 2}" y="${Y0 + 17}" text-anchor="middle" style="fill:var(--text-muted);font-size:12px">${['07:00', '07:30', '08:00', '08:30', '09:00'][i / 2]}</text>`;
    });
    if (L) s += `<line x1="${X0}" y1="${y(capQ)}" x2="${W - 6}" y2="${y(capQ)}" style="stroke:var(--accent);stroke-width:2;stroke-dasharray:6 4"/><text x="${W - 8}" y="${y(capQ) - 6}" text-anchor="end" style="fill:var(--accent);font-size:13px;font-weight:600;paint-order:stroke;stroke:var(--code-bg);stroke-width:4px">выдержит ${capQ} за 15 минут</text>`;
    return s + '</svg>';
  }
  const ninesTask = {
    id: 'nines', title: 'Лаборатория: торг за девятки',
    simple: howNumbers.simple,
    lead: ui.brief({
      situation: 'Нина Сергеевна: «Хочу, чтобы работало на сто процентов и мгновенно». Игорь: «Из 6 млн ₽ на качество — серверы, резервирование, мониторинг, нагрузочные тесты — у нас 1,2 млн. Остальное — обследование и функции первой версии». Дима: «Скажите, что строить: от этого зависит архитектура». Цены в лаборатории — условные оценки Димы.',
      todo: [
        'В левой колонке (на телефоне — сверху) выберите четыре вещи: доступность приёма заказов, скорость (95 % ответов быстрее …), нагрузку, на которую строим, и как считаем ночное окно 01:00–02:30.',
        'Рядом смотрите на утренний пик: зелёное — заказы, которые система выдержит, красное — те, что не выдержит. Ниже — цена качества и последствия каждого выбора.',
        'Найдите набор, при котором пик держится, простой не грозит утру, окно не противоречит доступности и цена укладывается в 1,2 млн ₽. Нажмите «Проверить».'
      ],
      look: 'Пунктир — сколько заказов за 15 минут выдержит система; столбики — сколько заказов приходит с 07:00 до 09:30 (в пик — до 100 за 15 минут, то есть 400 в час). Начальное положение — желание Нины: «почти сто процентов и мгновенно».'
    }),
    blank: () => ({ a: '99.99', s: '0.5', l: '400', w: 'in' }),
    reference: () => ({ a: '99.5', s: '1', l: '400', w: 'out' }),
    render(el, ctx) {
      el.classList.add('nfr-root');
      const a = ctx.ans;
      const knob = (id, title, sub, opts) => `<div class="nfr-knob"><span class="k">${esc(title)} <span>· ${esc(sub)}</span></span>${segBtns('lab|' + id, opts, a[id], ctx.readonly)}</div>`;
      el.innerHTML = `<div class="stack">
        <div class="nfr-lab">
          <div class="stack">
            ${knob('a', 'Доступность приёма заказов', 'в месяц', AV)}
            ${knob('s', '95 % ответов быстрее', 'в утренний пик', SP)}
            ${knob('l', 'Строим на нагрузку', 'заказов в час', LD)}
            ${knob('w', 'Окно обслуживания 01:00–02:30', 'каждую ночь', WN)}
            <div data-bud></div>
          </div>
          <div class="stack tight"><div class="nfr-lbl">Утро 07:00–09:30: заказов за 15 минут</div><div class="board" data-peak style="padding:8px"></div><div class="nfr-stats" data-st></div></div>
        </div>
        <ul class="checks" data-cons></ul>
        <div class="stack tight" data-who></div>
      </div>`;
      function draw() {
        const ev = labEval(a);
        const over = Math.max(0, ev.cost - Q_BUDGET);
        let cut = [], sum = 0;
        for (const c of CUT) { if (sum >= over) break; cut.push(c.t); sum += c.c; }
        TR.$('[data-bud]', el).innerHTML = `<div class="stat"><span class="k">Цена качества</span><span class="v ${over ? 'bad' : ''}">${ev.cost.toLocaleString('ru-RU')} из ${Q_BUDGET.toLocaleString('ru-RU')} тыс. ₽</span>${ui.meter(Math.min(1, ev.cost / Q_BUDGET), over ? 'bad' : ev.cost > Q_BUDGET * 0.85 ? 'warn' : '')}<span class="s">${over ? `Не хватает ${over.toLocaleString('ru-RU')} тыс. ₽. Игорь заберёт их из функций первой версии: выпадет ${esc(cut.join(', '))}.` : `Остаток ${(Q_BUDGET - ev.cost).toLocaleString('ru-RU')} тыс. ₽ — резерв на риски и сертификацию «КассаПро».`}</span></div>`;
        TR.$('[data-peak]', el).innerHTML = peakSVG(ev.L);
        const capQ = ev.L ? ev.L.n / 4 : 0, lost = DEMAND.reduce((s, d) => s + Math.max(0, d - capQ), 0);
        const down = ev.A ? 720 * (1 - ev.A.a) : 0;
        TR.$('[data-st]', el).innerHTML = [
          ['Простой в месяц', ev.A ? (a.w === 'in' ? `${fmtH(down)} + окно 45 ч` : fmtH(down)) : '—', a.w === 'in' ? 'bad' : ev.cond.a ? '' : 'bad'],
          ['Не выдержит утром', lost ? `${lost} заказов` : '0', lost ? 'bad' : 'ok'],
          ['Ответ в пик', ev.S ? (lost ? 'до 10 с' : ev.S.t) : '—', lost || !ev.cond.s ? 'bad' : '']
        ].map(([k, v, c]) => `<div class="stat"><span class="k">${esc(k)}</span><span class="v ${c}">${esc(v)}</span></div>`).join('');
        TR.$('[data-cons]', el).innerHTML = ['a', 's', 'l', 'w'].map(k => { const c = CONS[k][a[k]]; return c ? `<li class="${c[0] === 'ok' ? '' : c[0]}">${esc(c[1])}</li>` : ''; }).join('');
        let who;
        if (ev.all) who = ui.say('dima', 'Понимаю, что строить: под 400 заказов в час, с мониторингом и ночным окном. В смету влезаем, и резерв остаётся.') + ui.say('nina', 'Ночью можно, утром — нельзя. Так понятно. Такие цифры подпишу.');
        else if (over) who = ui.say('igor', 'На это денег нет. Либо меньше девяток и долей секунды, либо режем функции первой версии — выбирайте, что Нине важнее.');
        else if (a.w === 'in') who = ui.say('lera', 'Окно — 45 часов в месяц, а простоя можно меньше четырёх? Такое требование я не проверю: оно невыполнимо в принципе.');
        else if (!ev.cond.l) who = ui.say('dima', 'Под 200 в час строить могу. Но в 07:30 ляжем — Рита же говорила про 400 в час через год.');
        else if (!ev.cond.a) who = ui.say('nina', 'Семь часов простоя в месяц? А если это случится в восемь утра на Покровке?');
        else if (!ev.cond.s) who = ui.say('pavel', 'Две-три секунды на каждый заказ — у меня очередь до дверей, люди уйдут.');
        TR.$('[data-who]', el).innerHTML = who || '';
      }
      TR.on(el, 'click', '[data-pk]', (e, b) => {
        if (ctx.readonly) return;
        const k = b.dataset.pk.split('|')[1];
        TR.$$('button', b.parentElement).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        a[k] = b.dataset.pv; ctx.save();
        const ev = labEval(a);
        ctx.decide('Девятки и скорость', `${ev.A ? ev.A.t : '—'}; 95 % быстрее ${ev.S ? ev.S.t : '—'}; нагрузка ${ev.L ? ev.L.t : '—'}; окно ${a.w === 'out' ? 'не считаем' : 'считаем'}; цена ${ev.cost} тыс. ₽`);
        draw();
      });
      draw();
    },
    check(ans) {
      const ev = labEval(ans), notes = [];
      if (!ev.cond.a) notes.push({ ok: false, html: 'Доступность: переведите проценты в часы. Сколько простоя в месяц — и что будет, если он придётся на 07:30–09:00?' });
      if (!ev.cond.s) notes.push({ ok: false, html: 'Скорость: что делает покупатель в очереди у двери, когда ответ дольше секунды?' });
      if (!ev.cond.l) notes.push({ ok: false, html: 'Нагрузка: перечитайте F-speed — сколько заказов в час будет в утренний пик через год? Посмотрите на красные столбики.' });
      if (!ev.cond.w) notes.push({ ok: false, html: 'Окно: сложите ночные окна за месяц и сравните с допустимым простоем. Как записать окно, чтобы оно не спорило с доступностью?' });
      if (!ev.cond.b) notes.push({ ok: false, html: `Бюджет: набор стоит ${ev.cost} тыс. ₽ при ${Q_BUDGET}. Какая ручка дороже всего — и что она даёт покупателю в пик, а что — в три часа ночи?` });
      if (ev.all) notes.push({ ok: true, html: `Пик держится, утро не под угрозой, окно не спорит с доступностью, цена — ${ev.cost} тыс. ₽ из ${Q_BUDGET}.` });
      if (ev.all && ans && ans.l === '700') notes.push({ ok: 'info', html: 'Запас на 700 заказов в час засчитан: он влезает в бюджет и готовит систему к 15 пекарням. Но это решение Нины — запас стоит денег уже сейчас.' });
      return {
        ok: ev.all, score: ev.score, notes,
        summary: `Выполнено условий: ${ev.met} из 5. Цена качества: ${ev.cost} тыс. ₽ из ${Q_BUDGET}.`,
        mentor: (ans && (ans.a === '99.99' || ans.s === '0.5')) ? 'Нина просила «сто процентов и мгновенно». Наша работа — показать, сколько стоит каждая девятка и каждая доля секунды, и предложить уровень, который закрывает её бизнес: пик, праздники, Покровку. Решает она — но с ценой перед глазами.' : null
      };
    },
    explain: `<p>Торг за девятки — это не жадность и не перестраховка, а поиск уровня, при котором бизнес Нины защищён, а деньги не уходят на то, чего никто не заметит.</p>
      ${ui.table(['Ручка', 'Выбор', 'Почему так'], [
        ['Доступность', '99,5 % в месяц', '≈ 3,6 ч простоя, и все работы — ночью. 99 % — до 7,2 ч, рискуем утром. 99,9 % вдвое дороже ради минут в три часа ночи.'],
        ['Скорость', '95 % быстрее 1 с', 'Секунду человек почти не замечает. 2–3 с в очереди — двойные нажатия. Полсекунды — больше чем вдвое дороже, а разницы не видно.'],
        ['Нагрузка', '400 заказов в час (или 700 с запасом)', 'Пик через год — до 400 в час (F-speed). 200 — экономия, которая ломается в 07:30. 700 — запас на 15 пекарен, если Нина готова платить сейчас.'],
        ['Окно', 'не считаем простоем', '45 часов окон в месяц несовместимы ни с каким процентом. Окно записывают условием в самом требовании.']
      ])}
      <p>Обратите внимание: <b>все четыре цифры живут вместе</b>. «99,5 %» без окна — противоречие, «1 с» без нагрузки — пустое обещание, любая цифра без цены — подарок, который съест функции первой версии. Поэтому аналитик приносит Нине не одно число, а 2–3 варианта: что каждый даёт, сколько стоит и чем рискуем. Выбирает она.</p>
      <p>Цены в лаборатории — условные; принцип — общий: каждая следующая девятка и каждая доля секунды дорожают в разы (практика SRE, книга Google «Site Reliability Engineering», глава о целях уровня обслуживания).</p>`,
    refNote: 'Цены — условные оценки для тренировки. 99,5 %, 95 % быстрее 1 с при 400 заказах в час и окно 01:00–02:30 — договорённости «Колоса» (DOMAIN §7). Вариант «700 в час» тоже засчитывается: это запас на рост до 15 пекарен, и он влезает в бюджет.',
    report: ans => { const ev = labEval(ans); return `Доступность ${ev.A ? ev.A.t : '—'}, 95 % быстрее ${ev.S ? ev.S.t : '—'}, нагрузка ${ev.L ? ev.L.t : '—'}, окно ${ans && ans.w === 'out' ? 'не считаем' : 'считаем'} простоем. Цена ${ev.cost} тыс. ₽ из ${Q_BUDGET}. Условий выполнено: ${ev.met} из 5.`; }
  };

  // =====================================================================
  // Практика 3. План проверки для Леры: сценарий обрыва связи + способы проверки
  // =====================================================================
  const QV = [
    { id: 'src', t: 'Источник', q: 'кто или что вызывает событие', o: [
      { v: 'a', t: 'мобильный модем кассы на Покровке', s: 1 },
      { v: 'b', t: 'покупатель в очереди', s: 0, why: 'Покупатель здесь ни при чём: событие вызывает не человек. Что на Покровке ломается само?' },
      { v: 'c', t: '«КассаПро» выпустила обновление', s: 0.5, why: 'Так тоже бывает, но это другой сценарий. Что на Покровке случается регулярно (F-net)?' }] },
    { id: 'stim', t: 'Стимул', q: 'что случилось', o: [
      { v: 'a', t: 'связь пропадает на 10–15 минут', s: 1 },
      { v: 'b', t: 'касса работает медленнее обычного', s: 0, why: '«Медленно» — это про скорость. А что именно случается с модемом?' },
      { v: 'c', t: 'во всей пекарне отключили свет', s: 0, why: 'Без света касса не работает вовсе — это другой сценарий. Что происходит со связью?' }] },
    { id: 'env', t: 'Среда', q: 'в какой обстановке', o: [
      { v: 'a', t: 'утренний пик 07:30–09:00, в очереди 8–12 человек', s: 1 },
      { v: 'b', t: 'ночью, пекарня закрыта', s: 0, why: 'Ночью обрыв никто не заметит. В какой момент он обходится дороже всего?' },
      { v: 'c', t: 'на стенде у разработчиков', s: 0, why: 'Стенд — место проверки, а не обстановка сценария. Когда это случается в жизни?' }] },
    { id: 'art', t: 'Артефакт', q: 'какая часть системы', o: [
      { v: 'a', t: 'экран кассира и касса «КассаПро» на точке', s: 1 },
      { v: 'b', t: 'вся система «Колос»', s: 0.5, why: 'Слишком широко: сервер и приложение покупателя в это время работают. Какая часть на Покровке остаётся без связи?' },
      { v: 'c', t: 'приложение покупателя', s: 0, why: 'Приложение покупателя ходит через мобильный интернет покупателя. У кого пропадает связь?' }] },
    { id: 'resp', t: 'Отклик', q: 'что делает система', o: [
      { v: 'a', t: 'кассир продолжает выдавать предзаказы по коду и принимать оплату; чеки копятся и уходят, когда связь вернётся', s: 1 },
      { v: 'b', t: 'экран показывает «Нет связи» и ждёт, пока она вернётся', s: 0, why: 'Пятнадцать минут ожидания в пик — очередь до дверей. Что кассир должен продолжать делать?' },
      { v: 'c', t: 'кассир записывает заказы в тетрадь', s: 0, why: 'Тетрадь — то, от чего «Колос» уходит (F-cakeloss). Что должна делать сама система?' }] },
    { id: 'meas', t: 'Мера отклика', q: 'как поймём, что хорошо', o: [
      { v: 'a', t: 'выдача не останавливается; все чеки досланы после возврата связи, ни один не потерян', s: 1 },
      { v: 'b', t: 'система быстро восстанавливается', s: 0, why: '«Быстро» — ловушка. Какие числа и какие потери допустимы?' },
      { v: 'c', t: 'потеряно не больше 5 % чеков', s: 0, why: 'По 54-ФЗ чек нужен на каждую продажу. Сколько чеков можно потерять?' }] }
  ];
  const VM_CH = [{ v: 'load', t: 'Нагрузочный тест' }, { v: 'mon', t: 'Мониторинг в работе' }, { v: 'fail', t: 'Тест на отказ' }, { v: 'ux', t: 'Юзабилити-тест' }, { v: 'audit', t: 'Аудит' }, { v: 'demo', t: 'Демонстрация на стенде' }];
  const VM_WHY = { load: 'проверяет скорость и ёмкость под нагрузкой', mon: 'считает простои и реальную скорость за период работы', fail: 'намеренно ломает связь или сервер', ux: 'проверяет, справляются ли живые люди', audit: 'проверяет документы, настройки и журналы', demo: 'показывает свойство на стенде по чек-листу' };
  const VM = [
    { id: 'v1', t: '95 % ответов приложения быстрее 1 с при 400 заказах в час', ok: ['load'], half: { mon: 'Мониторинг подтвердит это в работе. Но как убедиться до запуска, не дожидаясь первого утреннего пика?' } },
    { id: 'v2', t: 'Приём заказов доступен 99,5 % времени в месяц; окно 01:00–02:30 не считается', ok: ['mon'] },
    { id: 'v3', t: 'Обрыв связи до 15 минут не останавливает выдачу; чеки досылаются без потерь', ok: ['fail'] },
    { id: 'v4', t: 'Новый кассир осваивает экран выдачи за одну смену обучения', ok: ['ux'], half: { demo: 'Демонстрация покажет экран, но не то, справится ли новичок. Кто должен пройти проверку?' } },
    { id: 'v5', t: 'На экране выдачи кассир не набирает текст: только крупные кнопки и сканер кода', ok: ['demo', 'ux'] },
    { id: 'v6', t: 'Персональные данные покупателей хранятся только на серверах в России', ok: ['audit'] },
    { id: 'v7', t: 'По запросу покупателя его данные удаляются не позже чем через 30 дней', ok: ['demo', 'audit'] },
    { id: 'v8', t: 'Время приёма заказов на завтра (22:30) администратор меняет в настройках, без программиста', ok: ['demo'] }
  ];
  function vEval(ans) {
    const q = (ans && ans.q) || {}, m = (ans && ans.m) || {};
    const qr = QV.map(s => { const o = s.o.find(x => x.v === q[s.id]); return { s, o, sc: o ? o.s : 0 }; });
    const mr = VM.map(r => { const g = m[r.id]; const st = !g ? 'empty' : r.ok.includes(g) ? 'ok' : r.half && r.half[g] ? 'warn' : 'bad'; return { r, g, st, sc: st === 'ok' ? 1 : st === 'warn' ? 0.5 : 0 }; });
    const qS = qr.reduce((x, y) => x + y.sc, 0) / QV.length, mS = mr.reduce((x, y) => x + y.sc, 0) / VM.length;
    return { qr, mr, qS, mS, score: qS * 0.4 + mS * 0.6 };
  }
  const verifyTask = {
    id: 'verify', title: 'План проверки для Леры: сценарий и способы',
    simple: howQas.simple,
    lead: ui.brief({
      situation: 'На Покровке и ещё в двух точках нет проводного интернета: касса работает через мобильный модем, и связь пропадает на 10–15 минут (F-net). Павел видел, как кассир переводит кассу в офлайн и потом досылает чеки (F-obs-modem). Дима: «Опишите мне это сценарием — я заложу офлайн-режим в архитектуру». Лера: «А мне — чем проверять каждое НФТ из списка».',
      todo: [
        'Часть 1: соберите сценарий атрибута качества из шести частей — в каждой нажмите один вариант. Ниже появится сценарий целиком.',
        'Часть 2: для восьми НФТ «Колоса» выберите в списке способ проверки, которым Лера докажет выполнение. Где честно подходят два способа, засчитываются оба.',
        'Нажмите «Проверить». Засчитывается от 80 %.'
      ],
      look: 'Способы проверки — из теории: нагрузочный тест, мониторинг в работе, тест на отказ, юзабилити-тест, аудит, демонстрация. Спрашивайте себя: можно ли это доказать до запуска — и чем? Кнопка вверху открывает экран кассира без связи в живой системе «Колос».'
    }),
    blank: () => ({ q: {}, m: {} }),
    reference: () => ({ q: Object.fromEntries(QV.map(s => [s.id, s.o.find(o => o.s === 1).v])), m: Object.fromEntries(VM.map(r => [r.id, r.ok[0]])) }),
    render(el, ctx) {
      el.classList.add('nfr-root');
      const a = ctx.ans; a.q = a.q || {}; a.m = a.m || {};
      const judged = !!(ctx.result || ctx.readonly), touched = new Set();
      el.innerHTML = `<div class="stack">
        ${TR.system ? '<div class="row"><button type="button" class="btn sm" data-sys>Открыть систему «Колос»: экран кассира без связи</button></div>' : ''}
        <div class="nfr-lbl">Часть 1 · Сценарий для Димы: обрыв связи на Покровке</div>
        <div class="stack tight" data-qs></div>
        <div class="nfr-sent" data-qsent></div>
        <div class="nfr-lbl">Часть 2 · Чем Лера проверит каждое НФТ</div>
        <div data-m></div>
      </div>`;
      function drawQ() {
        TR.$('[data-qs]', el).innerHTML = QV.map((s, i) => {
          const sel = s.o.find(o => o.v === a.q[s.id]), show = judged && sel && !touched.has(s.id);
          return `<div class="nfr-slot"><div class="h"><b>${i + 1} · ${esc(s.t)}</b><span>${esc(s.q)}</span></div>${pills('q|' + s.id, TR.shuffle(s.o, 'nfr-qv-' + s.id), a.q[s.id], { readonly: ctx.readonly, mark: show ? { [sel.v]: markOf(sel.s) } : null })}${show && sel.s < 1 ? `<div class="why">${esc(sel.why)}</div>` : ''}</div>`;
        }).join('');
        const g = id => { const s = QV.find(x => x.id === id), o = s.o.find(x => x.v === a.q[id]); return o ? o.t : null; };
        const part = (id, cls) => g(id) ? `<span class="${cls}">${esc(g(id))}</span>` : '<span class="vague">…</span>';
        TR.$('[data-qsent]', el).innerHTML = `<b>Сценарий:</b> источник — ${part('src', 'pm')}; стимул — ${part('stim', 'pm')}; среда — ${part('env', 'pc')}; артефакт — ${part('art', 'pc')}; отклик — ${part('resp', 'pt')}; мера — ${part('meas', 'pv')}.`;
      }
      function drawM() {
        let rv = null;
        if (judged) {
          rv = {};
          vEval(a).mr.forEach(x => { if (x.g) rv[x.r.id] = { s: x.st === 'empty' ? 'bad' : x.st, why: x.st === 'warn' ? x.r.half[x.g] : x.st === 'bad' && !ctx.readonly ? `«${(VM_CH.find(c => c.v === x.g) || {}).t}» ${VM_WHY[x.g]}. Это ли нужно доказать?` : '' }; });
        }
        ui.match(TR.$('[data-m]', el), { rows: VM.map(r => ({ id: r.id, t: esc(r.t) })), choices: VM_CH, value: a.m, reveal: rv, readonly: ctx.readonly, placeholder: 'Способ проверки…', onChange: v => { a.m = v; ctx.save(); } });
      }
      TR.on(el, 'click', '[data-pk]', (e, b) => {
        if (ctx.readonly) return;
        const sid = b.dataset.pk.split('|')[1];
        a.q[sid] = b.dataset.pv; touched.add(sid); ctx.save(); drawQ();
      });
      const sb = TR.$('[data-sys]', el); if (sb) sb.addEventListener('click', () => { if (TR.system) TR.system.open('screens/cash/an/offline'); });
      drawQ(); drawM();
    },
    check(ans) {
      const ev = vEval(ans), notes = [];
      const qEmpty = ev.qr.filter(x => !x.o), mEmpty = ev.mr.filter(x => x.st === 'empty');
      if (qEmpty.length) notes.push({ ok: false, html: `Сценарий: не выбрано — ${qEmpty.map(x => '«' + esc(x.s.t) + '»').join(', ')}.` });
      ev.qr.forEach(x => { if (x.o && x.sc < 1) notes.push({ ok: x.sc ? 'warn' : false, html: `Сценарий, «${esc(x.s.t)}»: ${esc(x.o.why)}` }); });
      if (mEmpty.length) notes.push({ ok: false, html: `Способ проверки не выбран у ${mEmpty.length} из ${VM.length} НФТ.` });
      ev.mr.forEach(x => {
        const short = x.r.t.length > 70 ? x.r.t.slice(0, 68) + '…' : x.r.t;
        if (x.st === 'empty') return;
        if (x.st === 'warn') notes.push({ ok: 'warn', html: `«${esc(short)}» — ${esc(x.r.half[x.g])}` });
        else if (x.st === 'bad') notes.push({ ok: false, html: `«${esc(short)}» — ${esc((VM_CH.find(c => c.v === x.g) || {}).t)} ${VM_WHY[x.g]}. Это ли нужно доказать здесь?` });
      });
      if (!notes.length) notes.push({ ok: true, html: 'Сценарий собран целиком, у каждого НФТ — свой способ проверки.' });
      return {
        ok: ev.score >= 0.8, score: ev.score, notes,
        summary: `Сценарий: ${ev.qr.filter(x => x.sc === 1).length} из ${QV.length} частей. Способы проверки: ${ev.mr.filter(x => x.st === 'ok').length} из ${VM.length}.`,
        mentor: ev.mr.some(x => x.r.id === 'v2' && x.g === 'load') ? 'Нагрузочный тест длится часы, а 99,5 % — обещание на месяц. Чем можно доказать обещание на целый месяц работы — и кто будет считать?' : null
      };
    },
    explain: `<p><b>Сценарий для Димы.</b> Источник — мобильный модем кассы на Покровке; стимул — связь пропадает на 10–15 минут; среда — утренний пик, очередь 8–12 человек; артефакт — экран кассира и касса «КассаПро» на точке; отклик — выдача по коду и оплата продолжаются, чеки копятся; мера — выдача не останавливается, все чеки досланы, ни один не потерян. Из такого сценария Дима понимает, что строить (экран кассира хранит заказы дня и очередь чеков), а Лера — как проверить: выдернуть модем на стенде в «пиковом» прогоне.</p>
      ${ui.table(['НФТ', 'Чем проверить', 'Почему'], [
        ['95 % быстрее 1 с при 400 в час', 'Нагрузочный тест', 'до запуска; мониторинг потом подтвердит'],
        ['99,5 % в месяц, окно не считается', 'Мониторинг в работе', 'месяц тестом не заменишь'],
        ['Обрыв до 15 минут без потери чеков', 'Тест на отказ', 'намеренно отключаем связь'],
        ['Новый кассир — за одну смену', 'Юзабилити-тест', 'с настоящими новичками, а не с тем, кто экран рисовал'],
        ['Без набора текста, крупные кнопки', 'Демонстрация (или юзабилити-тест)', 'по чек-листу экранов — поля для набора нет'],
        ['Данные — только в России', 'Аудит', 'где стоят серверы, договор с хостингом'],
        ['Удаление за 30 дней', 'Демонстрация и аудит', 'удалить на стенде и проверить журнал запросов'],
        ['22:30 меняется без программиста', 'Демонстрация', 'администратор меняет в настройках при Лере']
      ])}
      <p>Почему аналитик пишет способ проверки сам: так требование становится договором. Подрядчик знает, как его будут принимать, Лера заранее готовит стенд и данные, а Нина понимает, что «работает всегда» проверяется не на демо, а отчётом за месяц. Методы проверки — по ISO/IEC/IEEE 29148 (осмотр, анализ, демонстрация, испытание); сценарий атрибута качества — Басс, Клементс, Кацман, «Архитектура программного обеспечения на практике».</p>`,
    report: ans => { const ev = vEval(ans); return 'Сценарий: ' + ev.qr.map(x => `${x.s.t.toLowerCase()} — ${x.o ? x.o.t : '—'}${x.o ? (x.sc === 1 ? ' ✓' : x.sc ? ' ≈' : ' ✗') : ''}`).join('; ') + '\n' + ev.mr.map(x => `- ${x.r.t} → ${x.g ? (VM_CH.find(c => c.v === x.g) || {}).t : '—'} ${x.st === 'ok' ? '✓' : x.st === 'warn' ? '≈' : '✗'}`).join('\n'); }
  };

  // =====================================================================
  // Практика 4. НФТ тянут одеяло: найдите споры и разведите их
  // =====================================================================
  const VERD = [{ v: 'clash', t: 'Спорят' }, { v: 'cond', t: 'Уживаются, если записать условие' }, { v: 'fine', t: 'Не спорят' }];
  const PAIRS = [
    { id: 'p1', a: { k: 'защита', t: 'Покупатель подтверждает вход кодом из SMS при каждом заказе' }, b: { k: 'удобство', t: 'Постоянный покупатель повторяет заказ в 3 касания' }, ok: 'clash', fix: [
      { v: 'a', t: 'Помнить телефон 30 дней; код из SMS — только на новом телефоне и при оплате новой картой', s: 1 },
      { v: 'b', t: 'Убрать вход по коду совсем — удобство важнее', s: 0, why: 'Тогда любой, кто взял телефон или подобрал номер, закажет за чужой счёт и увидит чужие данные.' },
      { v: 'c', t: 'Оставить оба как есть — разработчики разберутся', s: 0, why: 'Разработчик выберет одно наугад, а Лера найдёт «баг» в любом варианте.' }] },
    { id: 'p2', a: { k: 'скорость', t: '95 % ответов быстрее 1 с при 400 заказах в час' }, b: { k: 'стоимость', t: 'На качество первой версии — не больше 1,2 млн ₽' }, ok: 'clash', fix: [
      { v: 'a', t: 'Строгий порог — для оформления и оплаты; для истории заказов хватит 3 с; нагрузка — по прогнозу на год, а не на 15 пекарен', s: 1 },
      { v: 'b', t: 'Заменить порог на «в среднем 1 с» — так дешевле', s: 0, why: 'Дешевле только на бумаге: среднее спрячет хвост, и в пик каждый десятый будет ждать по 3–5 секунд.' },
      { v: 'c', t: 'Молча взять деньги из функций — Нина не заметит', s: 0, why: 'Заметит на запуске, когда функции не будет. Обмен «качество на функции» решает владелец продукта — открыто.' }] },
    { id: 'p3', a: { k: 'удобство', t: 'Кассир работает без набора текста: только крупные кнопки' }, b: { k: 'защита', t: 'Каждую выдачу кассир подтверждает своим паролем' }, ok: 'clash', fix: [
      { v: 'a', t: 'Кассир входит один раз в начале смены по PIN-коду на крупных кнопках; выдача — по коду заказа или сканеру', s: 1 },
      { v: 'b', t: 'Пароль на каждую выдачу, но покороче', s: 0, why: 'Руки в муке и перчатках, очередь 8–12 человек (F-obs-hands): даже короткий пароль на каждую выдачу тормозит пик.' },
      { v: 'c', t: 'Без входа вообще — так быстрее', s: 0, why: 'Тогда не понять, кто выдал заказ: споры и ошибки останутся без следа.' }] },
    { id: 'p4', a: { k: 'доступность', t: 'Заказы в приложении принимаются круглосуточно' }, b: { k: 'сопровождаемость', t: 'Обслуживание системы — с 01:00 до 02:30' }, ok: 'cond', fix: [
      { v: 'a', t: 'Окно 01:00–02:30 не входит в расчёт 99,5 %; в окно приложение пишет «приём заказов возобновится в 02:30»', s: 1 },
      { v: 'b', t: 'Обслуживать систему днём, когда удобно разработчикам', s: 0, why: 'Днём — пекарни и пик. Ночное окно ровно для того и согласовано (F-hours).' },
      { v: 'c', t: 'Отказаться от обслуживания: обновления не нужны', s: 0, why: 'Без обновлений нет ни исправлений ошибок, ни защиты.' }] },
    { id: 'p5', a: { k: 'закон: 152-ФЗ', t: 'По запросу покупателя его персональные данные удаляются за 30 дней' }, b: { k: 'закон: 54-ФЗ и учёт', t: 'Чеки и документы о расчётах бухгалтерия обязана хранить годами' }, ok: 'cond', fix: [
      { v: 'a', t: 'Удалить профиль (имя, телефон, день рождения), а в чеках и учёте оставить только то, что требует закон', s: 1 },
      { v: 'b', t: 'Не удалять ничего — чеки важнее', s: 0, why: '152-ФЗ требует удалить данные по запросу. Что из данных покупателя закон о расчётах на самом деле требует хранить?' },
      { v: 'c', t: 'Удалить всё, вместе с чеками', s: 0, why: 'Чеки и учёт — тоже закон. Олег Петрович получит дыру в отчётности.' }] },
    { id: 'p6', a: { k: 'закон: 54-ФЗ', t: 'При предоплате — чек «предоплата», при выдаче — чек полного расчёта' }, b: { k: 'удобство', t: 'Новый кассир осваивает экран выдачи за одну смену' }, ok: 'fine', fix: [
      { v: 'a', t: 'Отказаться от чека «предоплата» — кассиру проще', s: 0, why: '54-ФЗ не обсуждается. И подумайте: кто на самом деле выбирает, какой чек пробить?' },
      { v: 'b', t: 'Учить кассира два дня вместо одного', s: 0, why: 'Обучение — один день (F-staff). А нужно ли кассиру вообще думать о типе чека?' },
      { v: 'c', t: 'Пусть кассир сам выбирает тип чека', s: 0, why: 'Ошибка новичка — нарушение закона. Кто может выбрать тип чека без ошибок — человек или система по статусу заказа?' }] },
    { id: 'p7', a: { k: 'надёжность', t: 'Без связи касса продолжает выдавать предзаказы' }, b: { k: 'целостность данных', t: 'Один заказ нельзя выдать дважды' }, ok: 'clash', fix: [
      { v: 'a', t: 'Без связи выдаёт только планшет этой пекарни по списку заказов, загруженному утром; отметки «Выдан» сверяются, когда связь вернётся', s: 1 },
      { v: 'b', t: 'Без связи выдачу запретить', s: 0, why: 'Модем на Покровке отваливается регулярно на 10–15 минут (F-net): запрет — это очередь до дверей.' },
      { v: 'c', t: 'Пусть выдают как получится, потом разберёмся', s: 0, why: '«Потом» — это двойная выдача и спор с покупателем, которому не досталось.' }] }
  ];
  function pEval(p, x) {
    x = x || {};
    if (!x.v) return { sc: 0, vs: 'empty', f: null };
    let vsc = 0, vs = 'bad';
    if (x.v === p.ok) { vsc = 1; vs = 'ok'; } else if (p.ok !== 'fine' && x.v !== 'fine') { vsc = 0.5; vs = 'warn'; }
    if (x.v === 'fine') return { sc: p.ok === 'fine' ? 1 : 0, vs, f: null };
    if (p.ok === 'fine') return { sc: 0, vs, f: p.fix.find(o => o.v === x.f) || null };
    const f = p.fix.find(o => o.v === x.f) || null;
    return { sc: vsc * 0.5 + (f ? f.s : 0) * 0.5, vs, f };
  }
  const VHINT = {
    'clash>fine': 'Попробуйте выполнить оба требования сразу — в утренний пик, у кассы. Получается без потерь?',
    'cond>fine': 'На первый взгляд они спорят. Что нужно дописать в требование, чтобы выполнялись оба?',
    'fine>clash': 'Спросите: если выполнить одно, мешает ли это другому? Кто на самом деле делает работу — человек или система?',
    'fine>cond': 'Спросите: если выполнить одно, мешает ли это другому? Кто на самом деле делает работу — человек или система?',
    'clash>cond': 'Почти: одним условием тут не обойтись — одно требование прямо мешает другому. Нужен компромисс.',
    'cond>clash': 'Почти: спор кажущийся — его снимает одно уточнение в тексте требования.'
  };
  const conflictsTask = {
    id: 'conflicts', title: 'НФТ тянут одеяло: найдите споры и разведите их',
    simple: howQas.simple,
    lead: ui.brief({
      situation: 'Черновик НФТ «Колоса» собран из разных источников: Нина, Олег Петрович, Павел, Дима, ваши наблюдения на Покровке. Ксения: «Перед встречей с Ниной проверьте пары. Где требования спорят — принесите компромисс. Где спор только кажется — допишите условие. Иначе Дима выберет сам, а Лера найдёт “баг” в любом варианте».',
      todo: [
        'Для каждой из семи пар выберите: «Спорят», «Уживаются, если записать условие» или «Не спорят».',
        'Если выбрали первое или второе, ниже появится «Как развести?» — выберите лучший вариант.',
        'Нажмите «Проверить». Засчитывается от 80 %.'
      ],
      look: 'Спорят — когда выполнить одно, не ухудшив другое, нельзя: нужен компромисс. Уживаются с условием — когда спор снимает одно уточнение в тексте. Не спорят — когда работу берёт на себя система или требования про разное. Подсказки — во вкладке теории «Тянут одеяло».'
    }),
    blank: () => ({ p: {} }),
    reference: () => ({ p: Object.fromEntries(PAIRS.map(p => [p.id, p.ok === 'fine' ? { v: 'fine' } : { v: p.ok, f: p.fix.find(o => o.s === 1).v }])) }),
    render(el, ctx) {
      el.classList.add('nfr-root');
      const a = ctx.ans; a.p = a.p || {};
      const judged = !!(ctx.result || ctx.readonly), touched = new Set();
      el.innerHTML = `<div class="stack">${PAIRS.map(p => `<div class="nfr-pair" data-pair="${p.id}"></div>`).join('')}</div>`;
      function drawPair(p) {
        const x = a.p[p.id] || {}, box = TR.$(`[data-pair="${p.id}"]`, el);
        const ev = judged && !touched.has(p.id) && x.v ? pEval(p, x) : null;
        box.className = 'nfr-pair' + (ev ? ' ' + (ev.sc >= 0.99 ? 'ok' : ev.sc >= 0.5 ? 'warn' : 'bad') : '');
        const vMark = ev ? (ev.vs === 'ok' ? '✓ ' : ev.vs === 'warn' ? '≈ ' : '✕ ') : '';
        const fShow = ev && ev.f;
        box.innerHTML = `<div class="nfr-vs"><div><small>${esc(p.a.k)}</small>${esc(p.a.t)}</div><span aria-hidden="true">↔</span><div><small>${esc(p.b.k)}</small>${esc(p.b.t)}</div></div>
          <div class="row">${segBtns(p.id + '|v', VERD, x.v, ctx.readonly)}${ev ? `<span class="small ${ev.vs === 'ok' ? '' : 'dim'}">${vMark}${ev.vs === 'ok' ? 'вердикт верный' : ev.vs === 'warn' ? 'близко' : 'вердикт неверный'}</span>` : ''}</div>
          ${ev && ev.vs !== 'ok' && !ctx.readonly ? `<div class="why">${esc(VHINT[p.ok + '>' + x.v] || '')}</div>` : ''}
          ${x.v && x.v !== 'fine' ? `<div class="nfr-lbl">Как развести?</div>${pills(p.id + '|f', TR.shuffle(p.fix, 'nfr-fx-' + p.id), x.f, { readonly: ctx.readonly, mark: fShow ? { [ev.f.v]: markOf(ev.f.s) } : null })}${fShow && ev.f.s < 1 && !ctx.readonly ? `<div class="why">${esc(ev.f.why)}</div>` : ''}` : ''}`;
      }
      TR.on(el, 'click', '[data-pk]', (e, b) => {
        if (ctx.readonly) return;
        const [pid, fld] = b.dataset.pk.split('|');
        a.p[pid] = a.p[pid] || {};
        a.p[pid][fld] = b.dataset.pv;
        if (fld === 'v' && b.dataset.pv === 'fine') delete a.p[pid].f;
        touched.add(pid); ctx.save();
        drawPair(PAIRS.find(p => p.id === pid));
      });
      PAIRS.forEach(drawPair);
    },
    check(ans) {
      const v = (ans && ans.p) || {};
      const ev = PAIRS.map(p => ({ p, x: v[p.id] || {}, e: pEval(p, v[p.id]) }));
      const score = ev.reduce((s, y) => s + y.e.sc, 0) / PAIRS.length, notes = [];
      ev.forEach(({ p, x, e }, i) => {
        const nm = `Пара ${i + 1} («${esc(p.a.k)}» ↔ «${esc(p.b.k)}»)`;
        if (!x.v) return;
        if (e.vs !== 'ok') notes.push({ ok: e.vs === 'warn' ? 'warn' : false, html: `${nm}: ${esc(VHINT[p.ok + '>' + x.v] || '')}` });
        if (x.v !== 'fine' && p.ok !== 'fine') {
          if (!x.f) notes.push({ ok: false, html: `${nm}: не выбрано, как развести.` });
          else if (e.f && e.f.s < 1) notes.push({ ok: false, html: `${nm}: ${esc(e.f.why)}` });
        }
      });
      const noV = ev.filter(y => !y.x.v).length;
      if (noV) notes.unshift({ ok: false, html: `Вердикт не выбран у ${noV} из ${PAIRS.length} пар.` });
      if (!notes.length) notes.push({ ok: true, html: 'Все семь пар разобраны: где спор — компромисс, где кажущийся спор — условие.' });
      const fineWrong = ev.some(y => y.p.ok === 'fine' && y.x.v && y.x.v !== 'fine');
      return {
        ok: score >= 0.8, score, notes,
        summary: `Верных вердиктов: ${ev.filter(y => y.e.vs === 'ok').length} из ${PAIRS.length}. Общий балл: ${Math.round(score * 100)} %.`,
        mentor: fineWrong ? 'Не каждый закон спорит с удобством. Спросите, кто на самом деле выполняет требование — человек у кассы или система. Иногда лучший компромисс — переложить сложность с человека на систему.'
          : ev.some(y => y.p.ok === 'clash' && y.x.v === 'fine') ? 'Споры между НФТ не видны в отдельных строках — только в паре и в конкретной обстановке: пик, очередь, руки в муке. Прогоняйте пары через утро на Покровке.' : null
      };
    },
    explain: `${ui.table(['Пара', 'Вердикт', 'Как развести'], [
        ['Код из SMS на каждый заказ ↔ повтор в 3 касания', 'спорят: защита ↔ удобство', 'строгость по риску: код — на новом телефоне и новой карте'],
        ['95 % быстрее 1 с ↔ 1,2 млн ₽ на качество', 'спорят: скорость ↔ стоимость', 'строгий порог — там, где человек ждёт (оформление, оплата); нагрузка — по прогнозу'],
        ['Без набора текста ↔ пароль на каждую выдачу', 'спорят: удобство ↔ защита', 'вход раз за смену по PIN на крупных кнопках'],
        ['Круглосуточно ↔ окно 01:00–02:30', 'уживаются с условием', 'окно не входит в 99,5 %, в окно — честное сообщение'],
        ['Удалить данные за 30 дней ↔ хранить чеки годами', 'уживаются с условием', 'удаляем профиль, в чеках — только то, что требует закон'],
        ['Два вида чеков ↔ новичок за одну смену', 'не спорят', 'тип чека выбирает система по статусу заказа'],
        ['Выдача без связи ↔ нельзя выдать дважды', 'спорят: надёжность ↔ целостность', 'офлайн — только на планшете этой пекарни, сверка после связи']
      ])}
      <p>Три приёма, которые работают почти всегда: <b>развести по ситуациям</b> (строго там, где риск, мягко — где его нет), <b>дописать условие</b> (что не считается, для каких данных, в какое время) и <b>переложить сложность с человека на систему</b> (тип чека, PIN вместо пароля). Последнее слово — за Ниной как владельцем продукта: аналитик приносит варианты с ценой и последствиями и записывает решение.</p>
      <p>Последняя пара — одна из самых известных развилок в устройстве систем (её называют теоремой CAP): при обрыве связи приходится выбирать между «продолжать работать» и «гарантировать одинаковые данные везде». Аналитик не решает это за архитектора, но обязан вынести на стол правило для бизнеса: кто выдаёт заказы без связи и как потом сверяемся. Источник по компромиссам атрибутов — Басс, Клементс, Кацман, «Архитектура программного обеспечения на практике»; Вигерс и Битти — раздел о конфликтах атрибутов качества.</p>`,
    report: ans => PAIRS.map((p, i) => { const x = ((ans && ans.p) || {})[p.id] || {}; const e = pEval(p, x); return `${i + 1}. ${p.a.t} ↔ ${p.b.t}: ${(VERD.find(d => d.v === x.v) || { t: '—' }).t}${x.f ? '; ' + (p.fix.find(o => o.v === x.f) || { t: '' }).t : ''} (${Math.round(e.sc * 100)} %)`; }).join('\n')
  };

  // =====================================================================
  // Практика 5. Ответ Нине: почему не 100 % и не мгновенно
  // =====================================================================
  const EX_RUBRIC = [
    'Объясняет, почему 100 % не обещает никто, и переводит 99,5 % в часы: не больше ~3,6 часа простоя в месяц, а плановые работы — ночью 01:00–02:30 и в расчёт не входят',
    'Объясняет «95 % быстрее секунды» без жаргона: 95 из 100 нажатий быстрее секунды, остальные — чуть дольше, а не «ждут вечно»; почему не «в среднем»',
    'Говорит о цене: каждая следующая девятка и каждая доля секунды дорожают в разы; 99,99 % или полсекунды съели бы деньги функций первой версии из бюджета 6 млн ₽',
    'Привязывает цифры к её бизнесу: утренний пик 07:30–09:00 и до 400 заказов в час, Покровка с модемом и досылом чеков, покупатели постарше',
    'Говорит, как проверим и кто решает: нагрузочный тест до запуска, мониторинг и отчёт каждый месяц; если нужно строже — посчитаем цену, решение за Ниной'
  ];
  const EX_REF = 'Нина Сергеевна, сто процентов не обещает никто — ни банки, ни крупные магазины: любая система иногда останавливается. Поэтому мы записываем честно и так, чтобы можно было проверить. 99,5 % — это не больше трёх с половиной часов простоя в месяц, а все плановые работы — ночью, с часа до половины третьего, и в этот расчёт они не входят. Утром в пик система должна работать. «95 % быстрее секунды» значит: из ста нажатий девяносто пять проходят быстрее секунды, остальные — чуть дольше, но не минуты. Почему не «в среднем»: среднее прячет тех, кто ждёт по пять секунд, а мы обещаем, что таких почти нет. Почему не строже: каждая следующая «девятка» и каждая доля секунды дорожают в разы — 99,99 % требуют двух дата-центров и дежурства круглые сутки. Эти деньги пришлось бы забрать из бюджета первой версии, и выпали бы, например, заказ через кассира или выгрузка в 1С. Наши цифры рассчитаны на ваш пик: до 400 заказов в час с 07:30 до 09:00; на Покровке касса без связи продолжит выдавать заказы и дошлёт чеки. Проверим до запуска нагрузочным тестом, а потом каждый месяц будем присылать отчёт о простоях и скорости. Если захотите строже — посчитаем, сколько это стоит, и решите вы.';
  const explainTask = {
    id: 'explain', title: 'Ответьте Нине: почему не 100 % и не мгновенно',
    simple: {
      icon: '🗣️',
      plain: 'Заказчик слышит в процентах торговлю: «почему не все сто?». Ваша задача — перевести проценты в часы и секунды его бизнеса, показать цену и оставить решение за ним.',
      analogy: 'Хозяйка просит печь, которая «никогда не ломается». Честный мастер скажет: «Такой нет. Эта ломается раз в год, чинится за ночь, а запасная стоит как вторая печь — нужна ли она?»',
      tech: 'Согласование уровня обслуживания с заказчиком: перевод доступности в допустимый простой за период, перцентильные пороги вместо средних, явные исключения (окно обслуживания), стоимость каждого уровня, способ контроля (мониторинг, отчёт) и право владельца продукта выбрать уровень. В договорах это оформляют как SLA — соглашение об уровне обслуживания.'
    },
    lead: ui.brief({
      situation: 'Ксения отправила Нине Сергеевне черновик НФТ. Через полчаса — ответ в чате. Игорь: «Ответьте вы. Нам нужно её согласие на эти цифры до конца обследования — иначе Дима не закончит оценку».',
      todo: [
        'Прочитайте сообщение Нины.',
        'Напишите ответ: 7–10 предложений, от 300 символов. Говорите про её пекарни, утро и деньги, а не про «перцентили» и «SLA».',
        'Нажмите «Проверить с Ксенией (Claude)» или «Сверить с эталоном самому» и честно отметьте раскрытые пункты. Засчитывается от 60 %.'
      ],
      lookTitle: 'На что опереться',
      look: 'Теория про перцентили и девятки (часы простоя, цена каждой девятки), лаборатория «торг за девятки» (что выпадет из первой версии при переплате) и сценарий обрыва связи на Покровке.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: EX_REF, self: EX_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('nfr-root');
      el.insertAdjacentHTML('beforeend', ui.say('nina', 'Вы мне прислали: «95 % ответов быстрее секунды» и «99,5 % времени». А остальные пять процентов покупателей что — пусть ждут? И почему не сто процентов? Я плачу за работающую систему, а не за проценты.'));
      const j = document.createElement('div'); j.style.marginTop = '12px'; el.appendChild(j);
      ui.justify(j, {
        id: 'nfr-explain', q: 'Ответ Нине: почему 95 % и 99,5 %, а не 100 % и «мгновенно»?',
        qPlain: 'Ответьте владелице сети пекарен, которая не понимает, почему в требованиях «95 % быстрее секунды» и «99,5 % времени», а не 100 %. Без жаргона объясните, что значат эти цифры в часах и секундах, почему не 100 % и не «в среднем», сколько стоит каждая следующая «девятка» и что выпало бы из первой версии, как цифры связаны с её утренним пиком и Покровкой, как это проверят и кто решает.',
        rubric: EX_RUBRIC, reference: EX_REF, value: ctx.ans.j, readonly: ctx.readonly, minLen: 300,
        placeholder: 'Нина Сергеевна, … (своими словами: что значат цифры, почему не 100 %, сколько стоит строже, как проверим, кто решает)',
        onChange: v => { ctx.ans.j = v; ctx.save(); ctx.decide('Ответ Нине про девятки', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j);
      return {
        ok: s >= 0.6, score: s,
        summary: s ? `Оценка ответа: ${Math.round(s * 100)} %.` : 'Напишите ответ (от 300 символов) и проверьте его с Ксенией или сверьте с эталоном сами.',
        notes: s && s < 0.6 ? [{ ok: false, html: 'Нину убеждают не проценты, а её утро: переведите 99,5 % в часы, покажите, когда эти часы случаются, и сколько стоила бы каждая лишняя девятка.' }] : []
      };
    },
    explain: '<p>Сильный ответ не спорит с Ниной, а <b>переводит</b>: проценты — в часы и секунды её утра, «почему не 100» — в цену и в то, что выпадет из первой версии. Он честен: 100 % не бывает, а «в среднем» прячет недовольных. И он оставляет решение за ней: «хотите строже — посчитаем цену».</p><p>Так работает согласование уровня обслуживания: в больших проектах его оформляют как SLA (соглашение об уровне обслуживания) с внутренними целями команды (SLO). В «Колосе» это пока две строки в НФТ и ежемесячный отчёт — но логика та же: число, период, исключения, способ контроля и цена.</p>',
    report: ans => (ans.j && ans.j.text) ? ans.j.text : '—'
  };

  // =====================================================================
  TR.stage({
    id: ID, act: 4, order: 330, slot: 'Ср 10:00', title: 'Нефункциональные требования',
    when: 'среда, 28 октября, 10:00 · переговорная «Квант Софт»',
    intro: [
      { who: 'dima', html: 'Функции я понял. Теперь главное для меня: на какую нагрузку строить и сколько простоя нам простят. «Чтобы не тормозило» в архитектуру не заложишь — мне нужны числа. От них зависит, один у нас сервер или два, и сколько это стоит.' },
      { who: 'lera', html: 'А мне — как это проверить. «95 % быстрее секунды при 400 заказах в час» я проверю нагрузочным тестом. «Работает всегда» — не проверю ничем.' },
      { who: 'ksenia', html: 'Сегодня — нефункциональные требования всерьёз. Как сделать их измеримыми, что такое перцентили и «девятки», как записать сценарий качества и что делать, когда требования тянут одеяло друг у друга. Цифры предлагаем мы, утверждает Нина, цену считает Дима, проверяет Лера.' }
    ],
    facts: ['F-speed', 'F-peak', 'F-hours', 'F-net', 'F-obs-modem', 'F-pd', 'F-54fz', 'F-staff', 'F-obs-hands', 'F-elder', 'F-budget'],
    glossary: [
      { term: 'Измеримое НФТ', simple: 'Не «чтобы не тормозило», а «95 из 100 заказов — быстрее секунды в утренний пик».', tech: 'Нефункциональное требование, у которого есть метрика, порог, условия и способ проверки. Только такое можно оценить при проектировании и проверить на приёмке (ISO/IEC/IEEE 29148 — свойство «проверяемое»).' },
      { term: 'Метрика', simple: 'Что именно засекаем: от нажатия «Оформить» до экрана оплаты.', tech: 'Измеряемая величина, которой выражают атрибут качества: время отклика, доля времени доступности, доля пользователей, справившихся с задачей, срок удаления данных.' },
      { term: 'Порог', simple: 'Какое число считаем успехом: «не дольше 1 секунды у 95 %».', tech: 'Целевое (или минимально допустимое) значение метрики, с которым сравнивают результат проверки. Записывается с долей случаев или периодом, без слов «быстро», «максимально», «100 %».' },
      { term: 'Перцентиль', simple: '«95 из 100 покупателей ждали не дольше секунды». Остальные пять — чуть дольше.', tech: 'Значение, не больше которого показатель у заданной доли наблюдений: p50 — медиана, p95, p99. В отличие от среднего, показывает «хвост» медленных ответов.' },
      { term: 'Доступность (готовность)', simple: 'Сколько времени система открыта для заказов. 99,5 % в месяц — это не больше 3,6 часа простоя.', tech: 'Доля времени за период, когда система выполняет свою функцию: время работы / всё время. В ГОСТ Р ИСО/МЭК 25010 — «готовность», подхарактеристика надёжности. Не путать с доступностью для людей (удобство).' },
      { term: '«Девятки»', simple: '99 %, 99,9 %, 99,99 % — каждая девятка урезает простой вдесятеро и стоит в разы дороже.', tech: 'Жаргонное название уровней доступности по числу девяток. 99 % ≈ 7,2 ч простоя за 30 дней, 99,9 % ≈ 43 мин, 99,99 % ≈ 4 мин. Принцип SRE: уровень выбирают по цене простоя для бизнеса, а не «чем больше, тем лучше».' },
      { term: 'Окно обслуживания', simple: 'Ночь с 01:00 до 02:30, когда систему можно обновлять, — и в простой это не считается.', tech: 'Заранее согласованный интервал плановых работ. В требовании к доступности явно указывают, входит ли окно в расчёт; иначе требования противоречат друг другу.' },
      { term: 'Сценарий атрибута качества', simple: 'Учения: «в пик пропала связь на Покровке — касса продолжает выдачу, ни один чек не потерян».', tech: 'Запись требования к качеству из шести частей: источник стимула, стимул, среда, артефакт, отклик, мера отклика (Басс, Клементс, Кацман, SEI). Используется в архитектуре и для тестов.' },
      { term: 'Нагрузочный тест', simple: 'Программа-робот изображает утренний пик, а мы засекаем, держится ли система.', tech: 'Проверка производительности и ёмкости под заданной нагрузкой на стенде до запуска: время отклика по перцентилям, точка отказа, поведение при росте нагрузки.' },
      { term: 'Мониторинг', simple: 'Автоматический «дежурный», который каждую минуту проверяет, работает ли заказ, и считает простои.', tech: 'Непрерывный сбор показателей работающей системы (доступность, время отклика, ошибки) с оповещениями и отчётами за период. Единственный способ подтвердить НФТ, заданные на месяц или год.' }
    ],
    outro: 'НФТ — это обещание с цифрами: что меряем, какой порог, в каких условиях и как проверим. «В среднем» прячет тех, кому плохо, поэтому говорим перцентилями; проценты переводим в часы простоя и честно считаем цену каждой девятки. Сложные случаи записываем сценарием качества, а споры между требованиями разводим условиями и компромиссами — и выносим решение Нине с ценой. Завтра — процессы «как есть» и «как будет», а в пятницу решим главное: что из всего этого делать к 1 марта.',
    tasks: [howWhy, howNumbers, howQas, measureTask, ninesTask, verifyTask, conflictsTask, explainTask]
  });
})();
