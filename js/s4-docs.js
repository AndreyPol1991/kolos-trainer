/* Неделя 4, пятница 15:00 — «Документы аналитика».
   Теория: полка документов (BRD, ФТ/SRS, ТЗ по ГОСТ 34.602-2020, PRD, бэклог, глоссарий, спецификация экрана, протокол —
   кто пишет, кто читает, когда, что внутри, фрагмент на «Колосе»), переключатель «каскад / Scrum / гибрид», «живой или
   подписываемый» (что происходит при изменении); ТЗ по ГОСТ — когда нужно и разделы, оглавление ФТ «убери раздел —
   кто пострадает» (соседний пример — онлайн-запись в салон «Локон»), лестница детализации; документ глазами Нины,
   Димы, Леры и Сони; спецификация экрана с живым макетом и состояниями (салон «Локон»).
   Практика на «Колосе»: сопоставить фрагменты документам; поправить оглавление ФТ на предзаказ (лишние и недостающие
   разделы); мини-редактор спецификации экрана кассира «Выдача заказа» с живым макетом; лаборатория «документ не тому
   читателю» (кнопка «всем одно ТЗ на 120 страниц»); набор документов «Колосу» с учётом договора в два этапа. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'docs';

  if (!document.getElementById('dc-css')) document.head.insertAdjacentHTML('beforeend', `<style id="dc-css">
    .dc-root, .dc-root .stack > * { min-width: 0; }
    .dc-root .seg button { white-space: normal; text-align: left; }
    .dc-lbl { font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .dc-two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px; align-items: start; }
    .dc-two > * { min-width: 0; }
    .dc-two.ed { grid-template-columns: minmax(0, 1.15fr) minmax(0, .85fr); }
    .dc-shelf { display: flex; flex-wrap: wrap; gap: 6px; align-items: flex-end; padding: 10px 10px 0; border-bottom: 6px solid var(--border-strong); border-radius: 10px 10px 4px 4px; background: linear-gradient(var(--surface-2), var(--surface)); }
    .dc-book { display: grid; align-content: end; justify-items: start; gap: 2px; min-width: 76px; padding: 8px 10px; border: 1px solid var(--border-strong); border-bottom: 0; border-left: 5px solid var(--info); border-radius: 6px 6px 0 0; background: var(--surface); color: var(--text); text-align: left; }
    .dc-book b { font: 700 14px/1.1 var(--f-brand); }
    .dc-book small { font-size: 11px; color: var(--text-muted); }
    .dc-book.sign { border-left-color: var(--warn); } .dc-book.both { border-left-color: var(--violet); }
    .dc-book[aria-pressed="true"] { background: var(--accent-soft); border-color: var(--accent); border-left-width: 5px; transform: translateY(-4px); }
    .dc-book.off { opacity: .35; } .dc-book.main { box-shadow: 0 0 0 2px var(--accent) inset; }
    .dc-card { border: 1px solid var(--border-strong); border-radius: 12px; background: var(--surface); padding: 12px 14px; display: grid; gap: 8px; }
    .dc-card > * { min-width: 0; }
    .dc-card h4 { font: 600 16px/1.25 var(--f-brand); margin: 0; }
    .dc-kv { display: grid; grid-template-columns: 120px minmax(0, 1fr); gap: 6px 10px; font-size: 13.5px; line-height: 1.45; }
    .dc-kv > * { min-width: 0; }
    .dc-kv > b { font: 600 10.5px/1.7 var(--f-mono); letter-spacing: .05em; text-transform: uppercase; color: var(--text-muted); }
    .dc-kv ul { margin: 0; padding-left: 18px; }
    .dc-frag { border-left: 3px solid var(--accent); background: var(--surface-2); border-radius: 0 8px 8px 0; padding: 8px 12px; font-size: 13.5px; line-height: 1.5; }
    .dc-frag.mono { font-family: var(--f-mono); font-size: 12.5px; white-space: pre-wrap; }
    .dc-chips { display: flex; flex-wrap: wrap; gap: 4px; }
    .dc-chips .chip { white-space: normal; }
    .dc-tl { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(150px, 1fr); gap: 8px; overflow-x: auto; padding-bottom: 4px; }
    .dc-ph { border: 1px solid var(--border); border-radius: 10px; background: var(--surface); padding: 8px 10px; display: grid; gap: 6px; align-content: start; }
    .dc-ph h5 { margin: 0; font: 600 13px/1.25 var(--f-brand); }
    .dc-ph .sub { font-size: 11.5px; color: var(--text-muted); }
    .dc-ph .chip { white-space: normal; font-size: 12px; }
    .dc-ph.fix { border-color: color-mix(in srgb, var(--warn) 50%, var(--border)); }
    .dc-steps { display: grid; gap: 4px; counter-reset: s; }
    .dc-steps div { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 8px; align-items: start; padding: 6px 10px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); font-size: 13.5px; }
    .dc-steps div::before { counter-increment: s; content: counter(s); width: 20px; height: 20px; border-radius: 50%; display: grid; place-items: center; background: var(--accent-soft); color: var(--accent); font: 700 11px/1 var(--f-mono); }
    .dc-sec { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 4px 10px; align-items: start; padding: 7px 10px; border: 1px solid var(--border); border-radius: 9px; background: var(--surface); font-size: 13.5px; }
    .dc-sec > * { min-width: 0; }
    .dc-sec.off { border-color: var(--bad); background: var(--bad-soft); }
    .dc-sec.off .t { text-decoration: line-through; color: var(--text-muted); }
    .dc-sec .brk { grid-column: 1 / -1; font-size: 13px; color: var(--bad); }
    .dc-sec .rd { grid-column: 1 / -1; font-size: 12px; color: var(--text-muted); }
    .dc-ladder { display: grid; gap: 8px; }
    .dc-rung { display: grid; grid-template-columns: 34px minmax(0, 1fr); gap: 10px; align-items: start; padding: 10px 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); opacity: .45; }
    .dc-rung > * { min-width: 0; }
    .dc-rung.on { opacity: 1; border-color: var(--accent); background: var(--accent-soft); }
    .dc-rung .n { width: 30px; height: 30px; border-radius: 8px; display: grid; place-items: center; background: var(--surface-3); font: 700 13px/1 var(--f-mono); }
    .dc-doc { display: grid; gap: 6px; }
    .dc-blk { padding: 8px 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); font-size: 13.5px; line-height: 1.5; transition: opacity .15s; }
    .dc-blk .h { font: 600 10.5px/1.5 var(--f-mono); letter-spacing: .06em; text-transform: uppercase; color: var(--text-muted); }
    .dc-blk.hi { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent) inset; }
    .dc-blk.lo { opacity: .38; }
    .dc-blk pre.code { margin-top: 4px; }
    .dc-mock { border: 10px solid var(--surface-3); border-radius: 18px; background: var(--bg); padding: 10px; display: grid; gap: 8px; font-size: 13px; min-height: 220px; align-content: start; }
    .dc-mock .bar { display: flex; justify-content: space-between; gap: 8px; font: 600 12px/1.3 var(--f-mono); color: var(--text-2); }
    .dc-mock .row1 { display: grid; grid-template-columns: 52px minmax(0, 1fr) auto; gap: 8px; align-items: center; padding: 7px 9px; border: 1px solid var(--border); border-radius: 9px; background: var(--surface); }
    .dc-mock .row1 > * { min-width: 0; }
    .dc-mock .big { font: 700 15px/1.2 var(--f-mono); }
    .dc-mock .dc-ordc { display: grid; gap: 4px; padding: 8px 10px; border: 1px solid var(--border); border-radius: 9px; background: var(--surface); }
    .dc-mock .dc-ordc .fld { padding: 3px 6px; }
    .dc-mock .fld { padding: 5px 8px; border: 1px dashed transparent; border-radius: 7px; }
    .dc-mock .fld.hl { border-color: var(--accent); background: var(--accent-soft); }
    .dc-mock .fld.bad { border-color: var(--bad); background: var(--bad-soft); }
    .dc-mock .kb { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 4px; }
    .dc-mock .kb span { display: grid; place-items: center; height: 30px; border-radius: 7px; background: var(--surface-3); font: 700 14px/1 var(--f-mono); }
    .dc-mock .st { display: grid; gap: 6px; justify-items: center; text-align: center; padding: 18px 10px; border: 1px dashed var(--border-strong); border-radius: 10px; color: var(--text-2); }
    .dc-mock .st.bad { border-color: var(--bad); color: var(--bad); }
    .dc-mock .st .i { font-size: 26px; }
    .dc-mock .sk { height: 30px; border-radius: 8px; background: var(--surface-3); opacity: .7; }
    .dc-mock .btnx { justify-self: stretch; text-align: center; padding: 9px; border-radius: 9px; background: var(--accent); color: var(--accent-text); font-weight: 700; }
    .dc-spec td.click { cursor: pointer; }
    .dc-spec tr.hl td { background: var(--accent-soft); }
    .dc-fl { display: grid; gap: 6px; }
    .dc-fr { display: grid; grid-template-columns: minmax(0, 1fr) 142px 158px 28px; gap: 6px; align-items: center; padding: 6px 8px; border: 1px solid var(--border); border-radius: 9px; background: var(--surface); font-size: 13px; line-height: 1.35; }
    .dc-fr > * { min-width: 0; }
    .dc-fr select { font-size: 12.5px; padding: 5px 6px; }
    .dc-fr.ok { border-color: var(--ok); } .dc-fr.warn { border-color: var(--warn); } .dc-fr.bad { border-color: var(--bad); background: var(--bad-soft); }
    .dc-fr .why { grid-column: 1 / -1; font-size: 12.5px; color: var(--text-2); }
    .dc-ib { min-width: 28px; height: 28px; border-radius: 7px; border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text); font-size: 13px; padding: 0 6px; }
    .dc-ib:disabled { opacity: .35; }
    .dc-pal { display: flex; flex-wrap: wrap; gap: 6px; }
    .dc-pal .btn { white-space: normal; text-align: left; }
    .dc-sts { display: grid; gap: 6px; }
    .dc-sr { display: grid; gap: 6px; padding: 8px 10px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); font-size: 13px; }
    .dc-sr.ok { border-color: var(--ok); } .dc-sr.bad { border-color: var(--bad); }
    .dc-sr .opts { display: grid; gap: 4px; }
    .dc-opt { text-align: left; padding: 6px 9px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface-2); color: var(--text); font-size: 12.5px; line-height: 1.35; width: 100%; }
    .dc-opt[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .dc-toc { display: grid; gap: 4px; }
    .dc-ti { display: grid; grid-template-columns: 26px minmax(0, 1fr) auto; gap: 4px 8px; align-items: center; padding: 6px 8px; border: 1px solid var(--border); border-radius: 9px; background: var(--surface); font-size: 13px; line-height: 1.35; }
    .dc-ti > * { min-width: 0; }
    .dc-ti .n { font: 700 11.5px/1 var(--f-mono); color: var(--text-muted); text-align: center; }
    .dc-ti .ctl { display: flex; gap: 3px; }
    .dc-ti .rd { grid-column: 2 / -1; font-size: 11.5px; color: var(--text-muted); }
    .dc-ti.ok { border-color: var(--ok); } .dc-ti.bad { border-color: var(--bad); background: var(--bad-soft); } .dc-ti.warn { border-color: var(--warn); }
    .dc-readers { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); gap: 10px; }
    .dc-rd { display: grid; gap: 8px; padding: 10px 12px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); align-content: start; }
    .dc-rd > * { min-width: 0; }
    .dc-rd.ok { border-color: var(--ok); } .dc-rd.warn { border-color: var(--warn); } .dc-rd.bad { border-color: var(--bad); }
    .dc-rd .need { font-size: 13px; color: var(--text-2); }
    .dc-rd .cons { font-size: 12.5px; color: var(--bad); }
    .dc-rd .say { margin: 0; }
    .dc-sum { display: flex; flex-wrap: wrap; gap: 6px; }
    .dc-sum .chip { white-space: normal; }
    @media (max-width: 860px) {
      .dc-two, .dc-two.ed { grid-template-columns: minmax(0, 1fr); }
    }
    @media (max-width: 560px) {
      .dc-kv { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .dc-kv > b { margin-top: 6px; }
      .dc-fr { grid-template-columns: minmax(0, 1fr) 28px; }
      .dc-fr .nm { grid-column: 1; } .dc-fr > button { grid-column: 2; grid-row: 1; }
      .dc-fr select { grid-column: 1 / -1; }
      .dc-ti { grid-template-columns: 20px minmax(0, 1fr); }
      .dc-ti .ctl { grid-column: 2; }
    }
  </style>`);

  // ---------- общие помощники ----------
  const fresh = fn => pane => { const d = document.createElement('div'); pane.appendChild(d); fn(d); };
  const chip = (t, k) => `<span class="chip ${k || ''}">${t}</span>`;
  const sysBtn = (view, label, note) => `<div class="row"><button type="button" class="btn sm" data-sys="${esc(view)}">${esc(label)}</button>${note ? `<span class="small muted">${note}</span>` : ''}</div>`;
  const onSys = root => TR.on(root, 'click', '[data-sys]', (e, b) => { if (TR.system && TR.system.open) TR.system.open(b.dataset.sys); else ui.toast('Живая система «Колос» ещё собирается — загляните позже', 'warn'); });
  const KIND = { sign: { t: '✍ подписываемый', k: 'warn' }, live: { t: '🌱 живой', k: 'info' }, both: { t: '✍ / 🌱 бывает и так, и так', k: '' } };

  // =====================================================================
  // Теория 1. Полка документов, каскад / Scrum / гибрид, живой или подписываемый
  // =====================================================================
  const DOCS = [
    { id: 'brd', sh: 'BRD', t: 'Бизнес-требования (BRD)', en: 'Business Requirements Document', kind: 'sign',
      plain: 'Зачем проект бизнесу: цели в цифрах, проблемы, границы — что входит и что нет, кто заинтересован, ограничения.',
      who: 'Аналитик (часто бизнес-аналитик) по итогам интервью и обследования.', read: ['заказчик', 'руководитель проекта', 'спонсор'],
      when: 'В начале проекта, до разработки. Подписывают, когда договорились о целях и границах.',
      inside: ['Цели и метрики успеха', 'Проблемы и потребности', 'Границы: что входит и что нет', 'Заинтересованные лица', 'Ограничения: бюджет, сроки, законы'],
      frag: 'БЦ-3. Ни одного потерянного заказа торта к 8 Марта 2027. Сейчас теряется 2–3 заказа в неделю. В границах первой версии: предзаказ и торты. Вне границ: своя доставка хлеба.' },
    { id: 'srs', sh: 'ФТ', t: 'Функциональные требования (ФТ, SRS)', en: 'Software Requirements Specification', kind: 'both',
      plain: 'Что делает система: роли, сценарии, правила, данные, статусы, интеграции, нефункциональные требования.',
      who: 'Системный аналитик, проверяют разработчики и тестировщик.', read: ['разработчики', 'тестировщик', 'архитектор', 'дизайнер'],
      when: 'Перед разработкой. В каскаде — целиком и с подписью, в Agile — частями к ближайшим спринтам.',
      inside: ['Роли и сценарии', 'Бизнес-правила', 'Функции системы', 'Данные и статусы', 'Интеграции', 'Нефункциональные требования'],
      frag: 'ФТ-21. Система не принимает заказ торта, если до даты выдачи меньше 48 часов, и предлагает ближайшую доступную дату.' },
    { id: 'tz', sh: 'ТЗ', t: 'Техническое задание по ГОСТ 34.602-2020', en: 'ТЗ на создание автоматизированной системы', kind: 'sign',
      plain: 'Договорной документ о создании системы целиком: цели, требования, порядок работ, приёмка, документирование.',
      who: 'Аналитик вместе с заказчиком и исполнителем.', read: ['заказчик', 'исполнитель', 'приёмочная комиссия'],
      when: 'До начала создания системы; часто — приложение к договору. Подписывают обе стороны.',
      inside: ['Общие сведения', 'Цели и назначение', 'Характеристика объекта автоматизации', 'Требования к системе', 'Работы, порядок разработки и приёмки', 'Документирование и источники'],
      frag: '4.2. Требования к функциям, выполняемым системой. 4.2.1. Подсистема «Предзаказ» должна обеспечивать приём заказов на следующий день до 22:30 по местному времени пекарни.' },
    { id: 'prd', sh: 'PRD', t: 'Продуктовый документ (PRD)', en: 'Product Requirements Document', kind: 'live',
      plain: 'Документ продакт-менеджера об одной фиче или релизе: для кого, какая проблема, как измерим успех, что не делаем.',
      who: 'Продакт-менеджер; аналитик помогает с требованиями.', read: ['команда продукта', 'дизайнер', 'разработчики', 'маркетинг'],
      when: 'Перед работой над фичей; живёт и правится, пока фича в работе.',
      inside: ['Проблема и для кого', 'Цель и метрика', 'Решение и сценарии', 'Что не входит', 'Открытые вопросы'],
      frag: 'Фича «Повторить прошлый заказ». Для кого: постоянные покупатели с приложением. Проблема: каждое утро собирают одну и ту же корзину. Метрика: доля повторных заказов. Не делаем: подписку.' },
    { id: 'bl', sh: 'Бэклог', t: 'Бэклог продукта с историями', en: 'Product Backlog', kind: 'live',
      plain: 'Упорядоченный список всего, что нужно сделать: истории с критериями приёмки, ошибки, технические задачи.',
      who: 'Владелец продукта отвечает за порядок; аналитик пишет и уточняет истории.', read: ['владелец продукта', 'разработчики', 'тестировщик'],
      when: 'Всё время. Верх бэклога уточняют к ближайшим спринтам.',
      inside: ['Истории «Как … я хочу … чтобы …»', 'Критерии приёмки', 'Приоритет и оценка', 'Связь с эпиками'],
      frag: 'Как технолог, я хочу видеть предзаказы на завтра в плане выпечки к 23:00, чтобы не пересчитывать Excel. Приоритет: Must.' },
    { id: 'gl', sh: 'Глоссарий', t: 'Глоссарий проекта', en: 'Glossary', kind: 'live',
      plain: 'Словарь проекта: одно слово — одно значение для всех.', who: 'Аналитик, пополняет с первой встречи.', read: ['все'],
      when: 'С первой встречи и до конца проекта.', inside: ['Термин', 'Определение', 'Синонимы, которых избегаем', 'Пример'],
      frag: 'Интервал выдачи — получасовой отрезок с 07:00 до 21:00, в который покупатель забирает предзаказ.' },
    { id: 'scr', sh: 'Экран', t: 'Спецификация экрана', en: 'UI specification', kind: 'live',
      plain: 'Что на экране: поля, обязательность, откуда данные, правила, все состояния (пусто, загрузка, ошибка, успех).',
      who: 'Аналитик вместе с дизайнером.', read: ['дизайнер', 'фронтенд-разработчик', 'тестировщик'],
      when: 'Перед тем как рисовать макет и делать экран; к ближайшему спринту.',
      inside: ['Назначение экрана и кто им пользуется', 'Поля: обязательность, источник, правила', 'Действия', 'Состояния экрана', 'Ссылка на макет'],
      frag: 'Экран цеха, поле «Фото-образец»: только просмотр, источник — заказ торта; если фото нет — надпись «Клиент не прислал фото».' },
    { id: 'mom', sh: 'Протокол', t: 'Протокол встречи', en: 'Meeting minutes', kind: 'both',
      plain: 'Что решили, кто что делает и к какому сроку, какие вопросы остались открытыми.',
      who: 'Аналитик или ведущий встречи, в тот же день.', read: ['участники встречи', 'заказчик'],
      when: 'Сразу после встречи. Решения из протокола потом попадают в требования.',
      inside: ['Дата и участники', 'Решения', 'Задачи: кто и к какому сроку', 'Открытые вопросы'],
      frag: 'Интервью с Н. С. Решили: заказ на завтра — до 22:30. Открытый вопрос: держим ли оплаченный заказ после интервала? Ответственный — Ксения.' }
  ];
  const DOC = Object.fromEntries(DOCS.map(d => [d.id, d]));
  function drawShelf(pane) {
    let cur = 'brd';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Полка документов аналитика. Цвет корешка: оранжевый — подписываемый документ, синий — живой (правят по ходу), фиолетовый — бывает и так, и так. Нажмите на корешок.</p>
      <div class="dc-shelf" data-sh></div><div data-card></div></div>`;
    function draw() {
      TR.$('[data-sh]', pane).innerHTML = DOCS.map(d => `<button type="button" class="dc-book ${d.kind}" data-doc="${d.id}" aria-pressed="${d.id === cur}"><b>${esc(d.sh)}</b><small>${esc(d.t.replace(/\s*\(.*\)$/, ''))}</small></button>`).join('');
      const d = DOC[cur];
      TR.$('[data-card]', pane).innerHTML = `<div class="dc-card"><h4>${esc(d.t)} <span class="small muted">· ${esc(d.en)}</span></h4>
        <div class="dc-kv"><b>Простыми словами</b><span>${esc(d.plain)}</span>
          <b>Кто пишет</b><span>${esc(d.who)}</span>
          <b>Кто читает</b><span class="dc-chips">${d.read.map(r => chip(esc(r), 'info')).join('')}</span>
          <b>Когда</b><span>${esc(d.when)}</span>
          <b>Что внутри</b><ul>${d.inside.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
          <b>Какой</b><span>${chip(KIND[d.kind].t, KIND[d.kind].k)}</span>
          <b>На «Колосе»</b><div class="dc-frag">${esc(d.frag)}</div></div></div>`;
    }
    TR.on(pane, 'click', '[data-doc]', (e, b) => { cur = b.dataset.doc; draw(); });
    draw();
  }
  const MODES = {
    water: { t: 'Каскад', phases: [
      { h: 'Обследование', d: [['brd', 'main', '✍']] },
      { h: 'Требования', d: [['tz', 'main', '✍'], ['srs', 'main', '✍'], ['gl', '']] },
      { h: 'Проектирование', d: [['scr', 'main']] },
      { h: 'Разработка', d: [['mom', '']] },
      { h: 'Испытания и приёмка', d: [['tz', '', '✍']] }],
      main: ['brd', 'tz', 'srs', 'scr'], off: ['bl', 'prd'],
      note: 'Требования собирают целиком заранее и подписывают — это базовая версия. Изменение после подписи — запрос на изменение и новая версия. Сильная сторона — понятная цена и объём для договора. Слабая — документ стареет, пока идёт разработка.' },
    scrum: { t: 'Scrum', phases: [
      { h: 'Старт продукта', d: [['prd', 'main'], ['gl', '']] },
      { h: 'Каждый спринт', d: [['bl', 'main'], ['scr', 'main'], ['srs', '']] },
      { h: 'Обзор спринта', d: [['mom', '']] }],
      main: ['bl', 'prd', 'scr'], off: ['tz', 'brd'],
      note: 'Главный документ — бэклог: живой, упорядоченный, верх уточняют к ближайшим спринтам. Спецификации экранов и правил живут в вики и правятся по ходу. Документов меньше, но они не исчезают: «работающий продукт важнее исчерпывающей документации» — это «важнее», а не «вместо».' },
    hybrid: { t: 'Гибрид', phases: [
      { h: 'Обследование · фиксированная цена', fix: true, d: [['brd', 'main', '✍'], ['mom', '']] },
      { h: 'Разработка спринтами · оплата по факту', d: [['bl', 'main'], ['scr', 'main'], ['srs', ''], ['gl', '']] },
      { h: 'Пакет с фиксированным объёмом', fix: true, d: [['srs', 'main', '✍']] }],
      main: ['brd', 'bl', 'scr', 'srs'], off: ['tz'],
      note: 'Там, где фиксированная цена, нужен фиксированный и подписанный объём. Там, где оплата по факту, — живой бэклог и живые спецификации. Гибрид — самый частый случай в жизни.' }
  };
  function drawModes(pane) {
    let mode = 'water';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Набор документов зависит от того, как устроены договор и разработка. Переключайте подход: на полке подсветятся главные документы, ниже — когда их пишут и где ставят подпись ✍.</p>
      <div class="row">${ui.seg('m', [{ v: 'water', t: '🏛 Каскад' }, { v: 'scrum', t: '🔁 Scrum' }, { v: 'hybrid', t: '🧩 Гибрид' }], mode, 'accent')}</div>
      <div class="dc-shelf" data-sh></div><div class="dc-tl" data-tl></div><div data-nt></div></div>`;
    function draw() {
      const M = MODES[mode];
      TR.$('[data-sh]', pane).innerHTML = DOCS.map(d => `<span class="dc-book ${d.kind} ${M.main.includes(d.id) ? 'main' : ''} ${M.off.includes(d.id) ? 'off' : ''}"><b>${esc(d.sh)}</b><small>${M.main.includes(d.id) ? 'главный' : M.off.includes(d.id) ? 'обычно не нужен' : 'по необходимости'}</small></span>`).join('');
      TR.$('[data-tl]', pane).innerHTML = M.phases.map(p => `<div class="dc-ph ${p.fix ? 'fix' : ''}"><h5>${esc(p.h)}</h5><div class="dc-chips">${p.d.map(([id, k, s]) => chip(`${s ? s + ' ' : ''}${esc(DOC[id].sh)}`, k === 'main' ? 'ok' : '')).join('')}</div></div>`).join('');
      TR.$('[data-nt]', pane).innerHTML = ui.note(mode === 'hybrid' ? 'info' : '', M.t, esc(M.note));
    }
    ui.onSeg(pane, (n, v) => { mode = v; draw(); });
    draw();
  }
  const CHANGE = {
    sign: { t: 'Подписанный документ', steps: ['Заказчик просит: отменять бесплатно не за 3 часа, а за 6', 'Аналитик оформляет запрос на изменение', 'Команда оценивает влияние: что переделать, сколько стоит', 'Новая версия документа с листом изменений', 'Подписи обеих сторон; если меняется цена — дополнение к договору', 'Разработка по новой версии'],
      plus: ['Юридическая сила: понятно, о чём договорились', 'Базовая версия — видно, что изменилось и сколько стоит', 'Подходит для фиксированной цены и приёмки'],
      minus: ['Медленно: изменение идёт через подписи', 'Пока идёт разработка, документ отстаёт от жизни'] },
    live: { t: 'Живая вики-страница', steps: ['Заказчик просит: отменять бесплатно не за 3 часа, а за 6', 'Аналитик правит правило на странице', 'История изменений сохраняет старую версию, команде уходит уведомление', 'История попадает в бэклог, обсуждают на уточнении', 'Разработка в ближайшем спринте'],
      plus: ['Быстро и всегда актуально', 'Всё в одном месте, со ссылками на истории и макеты', 'Подходит для оплаты по факту и спринтов'],
      minus: ['Нет юридической силы: «а мы так не договаривались»', 'Без базовой версии легко «поплыть» и не заметить, как вырос объём'] }
  };
  function drawChange(pane) {
    let mode = 'sign';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Соседний пример — салон красоты «Локон», правило бесплатной отмены записи. Через шесть недель после начала работ заказчик его меняет. Что произойдёт с документом?</p>
      <div class="row">${ui.seg('c', [{ v: 'sign', t: '✍ Подписанный документ' }, { v: 'live', t: '🌱 Живая вики-страница' }], mode, 'accent')}</div><div data-c></div></div>`;
    function draw() {
      const C = CHANGE[mode];
      TR.$('[data-c]', pane).innerHTML = `<div class="dc-two"><div class="stack tight"><div class="dc-lbl">${esc(C.t)}: что происходит</div><div class="dc-steps">${C.steps.map(s => `<div><span>${esc(s)}</span></div>`).join('')}</div></div>
        <div class="stack tight">${ui.note('ok', 'Сильные стороны', `<ul class="checks">${C.plus.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`)}${ui.note('warn', 'Слабые стороны', `<ul class="checks">${C.minus.map(x => `<li class="warn">${esc(x)}</li>`).join('')}</ul>`)}</div></div>
        ${ui.note('info', 'Что выбирают', 'Обычно оба. Подписывают то, что служит договором: итог обследования, объём пакета с фиксированной ценой, критерии приёмки. Всё, что уточняется по ходу, живёт в вики со ссылкой на подписанную базовую версию.')}`;
    }
    ui.onSeg(pane, (n, v) => { mode = v; draw(); });
    draw();
  }
  const howShelf = {
    id: 'how-shelf', covers: ['match', 'set'], title: 'Как это работает: полка документов', free: true, noReset: true,
    simple: {
      icon: '📚',
      plain: 'У аналитика не один «главный документ», а полка: у каждого документа свой читатель, своё время и своя степень подробности.',
      analogy: 'В пекарне тоже много бумаг: договор аренды подписывают раз и надолго, меню на доске переписывают каждый день, техкарту читает пекарь, а ценники — покупатель. Никто не пишет одну бумагу «для всех».',
      tech: 'BRD — бизнес-требования; SRS/ФТ — требования к системе (ISO/IEC/IEEE 29148:2018 описывает спецификации бизнес-требований, требований заинтересованных лиц и требований к ПО); ТЗ по ГОСТ 34.602-2020 — техническое задание на автоматизированную систему; PRD — продуктовый документ; бэклог продукта (Scrum Guide 2020); глоссарий; спецификация экрана; протокол встречи. Выбор форматов под читателей — задача BABOK v3 «Планирование управления информацией бизнес-анализа».'
    },
    lead: ui.brief({
      situation: 'Ксения ставит на стол стопку распечаток: «Нина просит „ТЗ“, Дима — истории, Лера — критерии. Все правы. Давайте разберём, что вообще лежит на полке у аналитика».',
      todo: [
        'Вкладка «Полка»: нажимайте корешки — кто пишет, кто читает, когда, что внутри, фрагмент на «Колосе».',
        'Вкладка «Каскад, Scrum, гибрид»: переключайте подход и смотрите, какие документы становятся главными и где подпись.',
        'Вкладка «Живой или подписываемый»: что происходит, когда меняется правило.'
      ],
      look: 'Подсветка на полке — главные документы подхода, бледные — обычно не нужны. ✍ — где документ подписывают.'
    }),
    render(el) {
      el.classList.add('dc-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'shelf', t: 'Полка', render: fresh(drawShelf) },
        { id: 'modes', t: 'Каскад, Scrum, гибрид', render: fresh(drawModes) },
        { id: 'chg', t: 'Живой или подписываемый', render: fresh(drawChange) }
      ], 'shelf');
    }
  };

  // =====================================================================
  // Теория 2. ТЗ по ГОСТ, оглавление ФТ, лестница детализации (соседний пример — салон «Локон»)
  // =====================================================================
  const GOST = [
    ['Общие сведения', 'Название системы, заказчик и исполнитель, основания для работ, сроки.'],
    ['Цели и назначение создания системы', 'Зачем система и какие процессы она автоматизирует.'],
    ['Характеристика объекта автоматизации', 'Как предприятие работает сейчас — сюда ложатся процессы «как есть».'],
    ['Требования к автоматизированной системе', 'К системе в целом, к функциям, к видам обеспечения — сюда ложатся функциональные и нефункциональные требования.'],
    ['Состав и содержание работ по созданию системы', 'Стадии и этапы, что сдаётся на каждом.'],
    ['Порядок разработки системы', 'Как организована разработка.'],
    ['Порядок контроля и приёмки', 'Виды испытаний, кто принимает, какие документы предъявляют.'],
    ['Подготовка объекта автоматизации к вводу в действие', 'Обучение людей, перенос данных, оборудование.'],
    ['Требования к документированию', 'Какие документы на систему будут и по каким стандартам.'],
    ['Источники разработки', 'На какие документы и материалы опирались.']
  ];
  const GQ = [
    { id: 'gov', t: 'Заказчик — государственная организация, закупка по 44-ФЗ или 223-ФЗ' },
    { id: 'ref', t: 'Договор прямо ссылается на ГОСТ 34' },
    { id: 'big', t: 'Создаём автоматизированную систему предприятия целиком, с приёмочными испытаниями' },
    { id: 'agile', t: 'Разработка спринтами, объём уточняется по ходу' }
  ];
  function drawGost(pane) {
    const S = { gov: false, ref: false, big: false, agile: true };
    pane.innerHTML = `<div class="stack">
      <p class="small muted">ГОСТ 34.602-2020 «Техническое задание на создание автоматизированной системы» заменил ГОСТ 34.602-89. Национальные стандарты в России применяют добровольно: обязательным ТЗ по ГОСТ становится, когда на него ссылается договор или этого требуют правила закупки. Отметьте, что верно для проекта.</p>
      <div class="stack tight">${GQ.map(q => `<label class="toggle"><input type="checkbox" data-q="${q.id}" ${S[q.id] ? 'checked' : ''}> <span>${esc(q.t)}</span></label>`).join('')}</div>
      <div data-v></div>
      <details class="more"><summary>Основные разделы ТЗ по ГОСТ 34.602-2020</summary><div><div class="dc-steps">${GOST.map(([h, d]) => `<div><span><b>${esc(h)}.</b> ${esc(d)}</span></div>`).join('')}</div></div></details></div>`;
    function draw() {
      let k, t, h;
      if (S.gov || S.ref) { k = 'warn'; t = 'Нужно ТЗ по ГОСТ'; h = S.gov ? 'В госзакупках ТЗ по ГОСТ 34 требуют очень часто, а приёмка идёт строго по нему. Пишите по разделам стандарта, а подробности функций — в приложениях.' : 'Раз договор ссылается на стандарт, приёмка пойдёт по нему. Отступление от структуры — повод не принять работу.'; }
      else if (S.big && !S.agile) { k = 'info'; t = 'Можно и стоит'; h = 'Большая система, каскад и приёмочные испытания — ГОСТ даёт проверенную структуру, ничего важного не забудете.'; }
      else { k = 'ok'; t = 'ТЗ по ГОСТ не обязательно'; h = 'Коммерческий проект, объём уточняется по ходу: хватит бизнес-требований, бэклога и живых спецификаций. Разделы ГОСТ можно взять как чек-лист: про приёмку, обучение и документирование часто забывают.'; }
      TR.$('[data-v]', pane).innerHTML = ui.note(k, t, esc(h));
    }
    pane.addEventListener('change', e => { const c = e.target.closest('[data-q]'); if (!c) return; S[c.dataset.q] = c.checked; draw(); });
    draw();
  }
  const LOK_TOC = [
    { id: 'intro', t: 'Введение: назначение документа и читатели', brk: 'Читатель не понимает, для кого документ и что в нём искать: заказчик читает раздел про API, разработчик — про цели.', rd: 'все' },
    { id: 'gl', t: 'Глоссарий: «окно», «запись», «неявка»', brk: 'Разработчик понял «окно» как свободный час, а заказчик — как промежуток длиной в услугу. Две разные функции по одному слову.', rd: 'все' },
    { id: 'ctx', t: 'Бизнес-контекст и цели (ссылка на бизнес-требования)', brk: 'Команда не знает «зачем»: спорные решения принимают наугад, а ценность фичи никто не проверит.', rd: 'заказчик, команда' },
    { id: 'roles', t: 'Роли: клиент, администратор, мастер', brk: 'Непонятно, кто что может: может ли мастер сам отменить запись? Права придумает разработчик.', rd: 'разработчики, тестировщик' },
    { id: 'uc', t: 'Сценарии: записаться, перенести, отменить', brk: 'Есть отдельные правила, но нет пути человека: в каком порядке, что видит, где ветки.', rd: 'разработчики, дизайнер, тестировщик' },
    { id: 'rules', t: 'Бизнес-правила: отмена за 3 часа, напоминание за сутки', brk: 'Цифры разбросаны по тексту или живут в головах. Тестировщик не найдёт границу 3 часа.', rd: 'разработчики, тестировщик' },
    { id: 'st', t: 'Статусы записи', brk: 'Каждый экран показывает статус по-своему: «отменена», «удалена», «снята» — это одно или три разных?', rd: 'разработчики, тестировщик' },
    { id: 'scr', t: 'Экраны (ссылки на спецификации)', brk: 'Дизайнер рисует по догадкам, требования и макет расходятся.', rd: 'дизайнер, фронтенд' },
    { id: 'int', t: 'Интеграции: SMS-шлюз, онлайн-касса', brk: 'Про чужие системы вспомнят на тестах: что отправляем, что делать, если SMS-шлюз не ответил.', rd: 'разработчики' },
    { id: 'nfr', t: 'Нефункциональные требования', brk: 'В субботу утром запись «ложится» — а никто не записал, сколько клиентов одновременно должно выдерживать.', rd: 'разработчики, руководитель проекта' },
    { id: 'oq', t: 'Открытые вопросы', brk: 'Неясности прячутся в тексте как решённые. Их найдут на демо — дорого.', rd: 'заказчик, команда' }
  ];
  function drawToc(pane) {
    const off = {};
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Соседний пример — функциональные требования к онлайн-записи в салон «Локон». Это типичное оглавление ФТ. Нажимайте «Убрать» — кто пострадает без раздела?</p>
      <div class="stack tight" data-t></div><div data-s></div></div>`;
    function draw() {
      TR.$('[data-t]', pane).innerHTML = LOK_TOC.map((s, i) => `<div class="dc-sec ${off[s.id] ? 'off' : ''}"><span class="t">${i + 1}. ${esc(s.t)}</span><button type="button" class="btn xs ${off[s.id] ? '' : 'ghost'}" data-off="${s.id}">${off[s.id] ? 'Вернуть' : 'Убрать'}</button><span class="rd">читают: ${esc(s.rd)}</span>${off[s.id] ? `<span class="brk">✕ ${esc(s.brk)}</span>` : ''}</div>`).join('');
      const n = Object.values(off).filter(Boolean).length;
      TR.$('[data-s]', pane).innerHTML = n ? ui.note(n >= 3 ? 'bad' : 'warn', `Убрано разделов: ${n}`, 'Раздел отвечает на вопрос конкретного читателя. Нет раздела — вопрос остаётся, только ответ на него даст разработчик в коде или тестировщик в баг-репорте.') : ui.note('info', 'Чего в ФТ нет', 'ФТ отвечает на вопрос «что делает система». Деньги, сроки, люди, «как написать код» и рекламные тексты живут в других документах — в ФТ на них в лучшем случае ссылка.');
    }
    TR.on(pane, 'click', '[data-off]', (e, b) => { off[b.dataset.off] = !off[b.dataset.off]; draw(); });
    draw();
  }
  const RUNGS = [
    { n: 1, t: 'Бизнес-требования', rd: 'владелица салона', txt: 'Снизить долю неявок клиентов с 15 % до 5 % за полгода.' },
    { n: 2, t: 'Функциональные требования', rd: 'разработчики, тестировщик', txt: 'Система отправляет клиенту SMS-напоминание за 24 часа до записи. Клиент может отменить запись бесплатно не позднее чем за 3 часа до начала.' },
    { n: 3, t: 'Спецификация экрана', rd: 'дизайнер, фронтенд-разработчик', txt: 'Экран «Мои записи»: кнопка «Отменить» активна, если до начала больше 3 часов; иначе — подсказка «Отменить можно по телефону салона».' },
    { n: 4, t: 'Критерии приёмки и тест', rd: 'тестировщик', txt: 'Дано: запись на 15:00, сейчас 12:00. Когда клиент нажимает «Отменить». Тогда запись отменена. Дано: сейчас 12:01 — Тогда кнопка неактивна, видна подсказка.' }
  ];
  function drawLadder(pane) {
    let cur = 1;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Одна потребность салона «Локон» — «клиенты не приходят» — на четырёх уровнях подробности. Переключайте уровень: меняется и текст, и читатель.</p>
      <div class="row">${ui.seg('l', RUNGS.map(r => ({ v: String(r.n), t: r.n + ' · ' + r.t })), '1', 'accent')}</div>
      <div class="dc-ladder" data-l></div><div data-n></div></div>`;
    function draw() {
      TR.$('[data-l]', pane).innerHTML = RUNGS.map(r => `<div class="dc-rung ${r.n === cur ? 'on' : ''}"><span class="n">${r.n}</span><span class="stack tight" style="gap:4px"><b>${esc(r.t)}</b><span>${esc(r.txt)}</span><span class="small muted">читает: ${esc(r.rd)}</span></span></div>`).join('');
      TR.$('[data-n]', pane).innerHTML = ui.note(cur === 1 ? 'info' : cur === 4 ? 'ok' : '', cur === 1 ? 'Слишком мало для разработки' : cur === 4 ? 'Слишком много для заказчика' : 'Свой уровень — свой читатель', cur === 1 ? 'Владелице хватит цели. Разработчику из неё ничего не сделать, тестировщику — нечем проверить.' : cur === 4 ? 'Тестировщику нужна ровно такая точность. Владелица утонет в «12:00 и 12:01» и не поймёт, решили ли её проблему.' : 'Каждый уровень вырастает из предыдущего и ссылается на него. «Один документ для всех» не работает: или заказчик тонет в деталях, или тестировщику их не хватает.');
    }
    ui.onSeg(pane, (n, v) => { cur = +v; draw(); });
    draw();
  }
  const howInside = {
    id: 'how-inside', covers: ['toc'], title: 'Как это работает: что внутри — ТЗ, ФТ и уровень детализации', free: true, noReset: true,
    simple: {
      icon: '🗂️',
      plain: 'Внутри документа — разделы, и каждый отвечает на вопрос своего читателя. Чем ближе к разработке, тем подробнее.',
      analogy: 'Рецепт торта для владелицы — «шоколадный, на 12 человек, к субботе». Для кондитера — граммы, температура, время. Для контролёра — «срез ровный, крем не течёт при +20». Это один торт, но три разных текста.',
      tech: '<b>ТЗ по ГОСТ 34.602-2020</b> — разделы: общие сведения; цели и назначение; характеристика объекта автоматизации; требования к системе; состав и содержание работ; порядок разработки; порядок контроля и приёмки; подготовка объекта к вводу в действие; требования к документированию; источники разработки. <b>ФТ (SRS)</b> по духу ISO/IEC/IEEE 29148 — введение, термины, роли, сценарии, правила, данные и статусы, интерфейсы, нефункциональные требования. Уровни детализации — по Вигерсу: бизнес → пользовательские → функциональные.'
    },
    lead: ui.brief({
      situation: 'Игорь: «Нина хочет „настоящее ТЗ, как у больших“. Нам оно нужно?» Ксения: «Сначала разберёмся, что внутри у ТЗ и у ФТ и почему у них разная подробность». Соседний пример — онлайн-запись в салон красоты «Локон».',
      todo: [
        'Вкладка «ТЗ по ГОСТ»: отметьте условия проекта — когда ТЗ по ГОСТ нужно, а когда хватит другого. Раскройте разделы стандарта.',
        'Вкладка «Оглавление ФТ»: уберите несколько разделов — кто пострадает?',
        'Вкладка «Лестница детализации»: пройдите четыре уровня одной потребности.'
      ],
      look: 'Красным — убранные разделы и последствия. На лестнице подсвечен текущий уровень и его читатель.'
    }),
    render(el) {
      el.classList.add('dc-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'gost', t: 'ТЗ по ГОСТ', render: fresh(drawGost) },
        { id: 'toc', t: 'Оглавление ФТ', render: fresh(drawToc) },
        { id: 'lad', t: 'Лестница детализации', render: fresh(drawLadder) }
      ], 'gost');
    }
  };

  // =====================================================================
  // Теория 3. Документ глазами читателя; спецификация экрана с живым макетом (салон «Локон»)
  // =====================================================================
  const BLK = [
    { id: 'goal', h: 'Зачем', html: 'Покупатель меняет планы — пусть отменит заказ сам, а выпечка не пропадёт: её успеют продать с витрины. Это работает на цель «списания 12 % → 7 %».' },
    { id: 'rule', h: 'Правило', html: 'Отмена бесплатна не позже чем за 2 часа до начала интервала. Позже деньги за свежую выпечку не возвращают. Возврат — на ту же карту в течение 3 рабочих дней.' },
    { id: 'flow', h: 'Сценарий', html: '1. Покупатель открывает заказ. 2. Система показывает, до какого времени отмена бесплатна. 3. Покупатель подтверждает отмену. 4. Система переводит заказ в «Отменён клиентом» и запускает возврат.' },
    { id: 'screen', h: 'Экран', html: 'Экран заказа: кнопка «Отменить» видна до конца интервала. После границы двух часов — предупреждение «Деньги за выпечку не вернутся».' },
    { id: 'api', h: 'Данные и API', code: 'POST /orders/К-247/cancel\n→ 200 { "status": "Отменён клиентом",\n        "refund": { "amount": 420, "days": 3 } }' },
    { id: 'ac', h: 'Критерии приёмки', html: 'Дано: интервал 08:00–08:30, сейчас 05:59. Когда покупатель отменяет заказ. Тогда деньги возвращаются полностью. Дано: сейчас 06:01. Тогда отмена без возврата, с предупреждением.' },
    { id: 'oq', h: 'Открытый вопрос', html: 'Что, если заказ отменяет пекарня — не испекли? Возврат сразу и полностью?' }
  ];
  const READERS = {
    nina: { hi: ['goal', 'rule'], who: 'nina', look: 'что покупатель может отменить и не потеряет ли она деньги на выпечке', skip: 'сценарий по шагам, API, критерии', say: 'Мне главное — что человек может отменить и я не теряю деньги на выпечке. Скобки и кавычки — это не мне.' },
    dima: { hi: ['rule', 'flow', 'api', 'oq'], who: 'dima', look: 'правило с точной границей, статус, данные, что делать с возвратом', skip: '«зачем» — прочтёт один раз', say: 'Граница «2 часа» считается от начала интервала — хорошо. Какой статус, что в ответе, что с возвратом — вот это моё. И открытый вопрос надо закрыть до спринта.' },
    lera: { hi: ['rule', 'ac', 'oq'], who: 'lera', look: 'границы и примеры, по которым можно проверить', skip: 'экран и API — посмотрит позже', say: '05:59 — можно, 06:01 — нельзя. А ровно 06:00? Критерии должны отвечать и на это. Граница — самое интересное место.' },
    sonya: { hi: ['flow', 'screen'], who: 'sonya', look: 'путь человека и что он видит на каждом шаге', skip: 'API и критерии', say: 'Где покупатель узнаёт, до какого времени отмена бесплатна? И что видит после 06:00 — кнопку с предупреждением или серую кнопку?' }
  };
  function drawReader(pane) {
    let cur = 'nina';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Фрагмент ФТ «Колоса» — отмена предзаказа. Один и тот же текст читают четыре человека. Переключайте читателя: подсветится то, что он ищет, остальное побледнеет.</p>
      <div class="row">${ui.seg('r', [{ v: 'nina', t: 'Нина Сергеевна' }, { v: 'dima', t: 'Дима' }, { v: 'lera', t: 'Лера' }, { v: 'sonya', t: 'Соня' }], cur, 'accent')}</div>
      <div class="dc-two"><div class="dc-doc" data-d></div><div class="stack tight" data-r></div></div></div>`;
    function draw() {
      const R = READERS[cur];
      TR.$('[data-d]', pane).innerHTML = BLK.map(b => `<div class="dc-blk ${R.hi.includes(b.id) ? 'hi' : 'lo'}"><div class="h">${esc(b.h)}</div>${b.code ? ui.code(b.code, 'text') : `<div>${esc(b.html)}</div>`}</div>`).join('');
      TR.$('[data-r]', pane).innerHTML = `${ui.say(R.who, esc(R.say))}<div class="dc-kv"><b>Ищет</b><span>${esc(R.look)}</span><b>Пропускает</b><span>${esc(R.skip)}</span></div>
        ${ui.note('info', 'Что из этого следует', 'Одна страница ФТ может служить нескольким читателям, если в ней есть ясные разделы и каждый находит своё. Но Нине целиком эта страница не нужна: ей — короткая выжимка в бизнес-требованиях со ссылкой сюда.')}`;
    }
    ui.onSeg(pane, (n, v) => { cur = v; draw(); });
    draw();
  }
  const LSPEC = [
    { id: 'date', f: 'Дата', r: 'Да', s: 'Система: сегодня, можно листать', rule: 'По умолчанию — сегодня' },
    { id: 'time', f: 'Время записи', r: 'Да', s: 'Данные записи', rule: 'Сортировка по времени' },
    { id: 'client', f: 'Клиент: имя', r: 'Да', s: 'Данные клиента', rule: 'Только имя и первая буква фамилии' },
    { id: 'svc', f: 'Услуга и мастер', r: 'Да', s: 'Справочник услуг, расписание', rule: '—' },
    { id: 'status', f: 'Статус', r: 'Да', s: 'Вычисляет система', rule: '«Ждём», «Пришёл», «Не пришёл» через 15 минут' },
    { id: 'note', f: 'Комментарий клиента', r: 'Нет', s: 'Ввод клиента при записи', rule: 'Пусто — строку не показываем' },
    { id: 'btn', f: 'Кнопка «Пришёл»', r: '—', s: 'Действие администратора', rule: 'Активна с начала записи' }
  ];
  const LSTATES = [{ v: 'normal', t: 'Обычное' }, { v: 'empty', t: 'Пусто' }, { v: 'loading', t: 'Загрузка' }, { v: 'error', t: 'Нет связи' }, { v: 'ok', t: 'Успех' }];
  function lokMock(state, hl) {
    const f = id => `fld ${hl === id ? 'hl' : ''}`;
    let body;
    if (state === 'empty') body = `<div class="st"><span class="i">📭</span><b>На сегодня записей нет</b><span class="small">Ближайшая запись — завтра в 10:00</span></div><div class="btnx">Записать клиента</div>`;
    else if (state === 'loading') body = '<div class="sk"></div><div class="sk"></div><div class="sk"></div><div class="small muted" style="text-align:center">Загружаем записи…</div>';
    else if (state === 'error') body = `<div class="st bad"><span class="i">📶</span><b>Нет связи</b><span class="small">Показываем записи на 09:12. Отметки «Пришёл» сохранятся и отправятся, когда связь вернётся.</span></div>`;
    else body = [['10:00', 'Ирина К.', 'Стрижка · мастер Оля', state === 'ok' ? '✓ Пришла' : 'Ждём', 'Принесёт фото'], ['11:30', 'Марина С.', 'Окрашивание · мастер Вера', 'Ждём', '']].map((r, i) => `<div class="row1"><span class="big ${f('time')}">${r[0]}</span><span class="stack tight" style="gap:2px"><span class="${f('client')}"><b>${r[1]}</b></span><span class="small ${f('svc')}">${r[2]}</span>${r[4] ? `<span class="small muted ${f('note')}">${r[4]}</span>` : ''}</span><span class="stack tight" style="gap:4px;justify-items:end"><span class="chip ${r[3].startsWith('✓') ? 'ok' : ''} ${f('status')}">${r[3]}</span>${i === 0 && state !== 'ok' ? `<span class="btn xs primary ${f('btn')}">Пришёл</span>` : ''}</span></div>`).join('') + (state === 'ok' ? '<div class="small" style="color:var(--ok)">✓ Отмечено: Ирина К. пришла в 10:02</div>' : '');
    return `<div class="dc-mock"><div class="bar"><span class="${f('date')}">Сегодня, ср</span><span>Записи · салон «Локон»</span></div>${body}</div>`;
  }
  function drawSpec(pane) {
    let state = 'normal', hl = null;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Соседний пример — экран администратора салона «Локон» «Записи на сегодня». Слева — спецификация, справа — макет по ней. Нажмите строку спецификации — поле подсветится на макете. Переключайте состояния экрана.</p>
      <div class="row">${ui.seg('s', LSTATES, state, 'accent')}</div>
      <div class="dc-two ed"><div class="dc-spec" data-t></div><div data-m></div></div>
      ${ui.note('info', 'Три вопроса к каждому полю', '<b>Обязательное?</b> — может ли поле быть пустым и что тогда показываем. <b>Откуда данные?</b> — вводит человек, приходит из базы, считает система или чужая система. <b>Какие правила?</b> — формат, сортировка, когда меняется. И отдельно — <b>состояния экрана</b>: пусто, загрузка, ошибка, успех. Про них забывают чаще всего.')}</div>`;
    function draw() {
      TR.$('[data-t]', pane).innerHTML = ui.table(['Поле', 'Обяз.', 'Источник', 'Правило'], LSPEC.map(x => [`<span data-hl="${x.id}">${esc(x.f)}</span>`, esc(x.r), esc(x.s), esc(x.rule)]), { rowClass: r => (r[0].includes(`data-hl="${hl}"`) ? 'hl' : '') });
      TR.$('[data-m]', pane).innerHTML = lokMock(state, hl);
    }
    pane.addEventListener('click', e => { const td = e.target.closest('.dc-spec tr'); if (!td) return; const s = TR.$('[data-hl]', td); if (!s) return; hl = hl === s.dataset.hl ? null : s.dataset.hl; if (state !== 'normal' && state !== 'ok') { state = 'normal'; TR.$$('[data-seg="s"] button', pane).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === 'normal'))); } draw(); });
    ui.onSeg(pane, (n, v) => { state = v; draw(); });
    draw();
  }
  const howReader = {
    id: 'how-reader', covers: ['screen', 'lab'], title: 'Как это работает: читатель и спецификация экрана', free: true, noReset: true,
    simple: {
      icon: '👓',
      plain: 'Прежде чем писать, спросите: кто будет читать и что он ищет? От ответа зависят и документ, и подробность.',
      analogy: 'Меню для гостя, техкарта для повара и накладная для бухгалтера описывают один и тот же суп. Дайте гостю техкарту — он не закажет. Дайте повару меню — суп выйдет «на глаз».',
      tech: 'Аудитория определяет формат и уровень детализации (BABOK v3: «Планирование управления информацией бизнес-анализа»). <b>Спецификация экрана</b> — для каждого поля: обязательность, источник данных, правила и формат; для экрана — все состояния (пусто, загрузка, ошибка, успех) и действия.'
    },
    lead: ui.brief({
      situation: 'Ксения кладёт на стол одну страницу ФТ «Колоса» про отмену предзаказа и зовёт Нину, Диму, Леру и Соню: «Прочитайте и скажите, что вы в ней ищете». Потом — соседний пример спецификации экрана.',
      todo: [
        'Вкладка «Глазами читателя»: переключайте читателя и сравните, что каждый ищет и что пропускает.',
        'Вкладка «Спецификация экрана»: нажимайте строки спецификации и переключайте состояния экрана «Локона».'
      ],
      look: 'Подсвеченные блоки — то, что читатель ищет. На макете подсвечено поле из выбранной строки спецификации.'
    }),
    render(el) {
      el.classList.add('dc-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'rd', t: 'Глазами читателя', render: fresh(drawReader) },
        { id: 'sp', t: 'Спецификация экрана', render: fresh(drawSpec) }
      ], 'rd');
    }
  };

  // =====================================================================
  // Практика 1. Чей это фрагмент?
  // =====================================================================
  const M_CH = [
    { v: 'brd', t: 'Бизнес-требования (BRD)' }, { v: 'srs', t: 'Функциональные требования (ФТ, SRS)' }, { v: 'tz', t: 'ТЗ по ГОСТ 34.602-2020' }, { v: 'prd', t: 'Продуктовый документ (PRD)' },
    { v: 'bl', t: 'Бэклог с историями' }, { v: 'gl', t: 'Глоссарий' }, { v: 'scr', t: 'Спецификация экрана' }, { v: 'mom', t: 'Протокол встречи' }
  ];
  const M_ROWS = [
    { id: 'q1', ok: 'brd', t: 'Проблема: к 9 утра популярное заканчивается, клиенты уходят к конкурентам. Цель БЦ-2: выручка сети +15 % за 12 месяцев. Заинтересованные лица: владелица, управляющие, технолог, бухгалтер.', h: 'Здесь цели бизнеса, проблема и заинтересованные лица — ни одной функции системы. Кто читает такой документ и подписывает?' },
    { id: 'q2', ok: 'srs', t: 'ФТ-14. Неоплаченный предзаказ система держит 30 минут после конца интервала выдачи, затем переводит в статус «Не выкуплен» и возвращает позиции в продажу.', h: 'Номер требования, правило с цифрой, статус — что делает система. В каком документе собраны такие требования?' },
    { id: 'q3', ok: 'tz', t: 'Порядок контроля и приёмки автоматизированной системы: виды, состав и методы испытаний; состав приёмочной комиссии; перечень документов, предъявляемых при приёмке.', h: '«Автоматизированная система», «приёмочная комиссия», «виды испытаний» — язык какого стандарта?' },
    { id: 'q4', ok: 'prd', t: 'Фича «Ссылка на заказ из поста ВКонтакте». Для кого: 18 тыс. подписчиков группы. Проблема: пишут заказ в личку, его переносят руками. Метрика: доля заказов из ВКонтакте. Не делаем: оплату внутри ВКонтакте.', h: 'Одна фича: для кого, проблема, метрика, «не делаем». Чей это документ — продакта или договорной?' },
    { id: 'q5', ok: 'bl', t: 'Как кассир, я хочу найти заказ по короткому коду, чтобы выдать его, не открывая пакеты. Критерий: дано заказ К-247 в статусе «Собран», когда кассир вводит К-247, тогда видит состав и кнопку «Выдать».', h: '«Как … я хочу … чтобы…» с критериями — где живут такие карточки?' },
    { id: 'q6', ok: 'gl', t: 'Код заказа — короткий код вида К-247, по которому кассир находит предзаказ, не открывая пакеты. Не путать с номером чека.', h: 'Слово и его единственное значение, плюс «не путать с…». Что это за документ?' },
    { id: 'q7', ok: 'scr', t: 'Поле «Код заказа»: обязательное, ввод крупными кнопками на экране, формат К-247. Если заказ не найден — сообщение «Заказ не найден» и поиск по имени.', h: 'Поле, обязательность, способ ввода, сообщение об ошибке — подробности одного экрана. Где их описывают?' },
    { id: 'q8', ok: 'mom', t: 'Встреча по оплате на месте. Участники: Нина Сергеевна, Олег Петрович, Павел, Ксения. Решили: оплата на месте остаётся для заказов по телефону. Ответственный за правила сверки — Олег Петрович. Открытый вопрос: принимаем ли наличные курьеру?', h: 'Участники, «решили», ответственный, открытый вопрос — что это за запись?' },
    { id: 'q9', ok: 'srs', t: 'Сценарий «Выдать заказ». Основной актор — кассир. Предусловие: заказ в статусе «Собран». Основной поток: 1. Кассир вводит код. 2. Система показывает состав и статус оплаты. 3. Кассир выдаёт заказ…', h: 'Сценарий использования с актором, предусловием и потоком — в каком документе собирают сценарии?' }
  ];
  const matchTask = {
    id: 'match', title: 'Чей это фрагмент?',
    simple: howShelf.simple,
    lead: ui.brief({
      situation: 'В общей папке проекта «Колос» кто-то перемешал файлы: остались только обрывки текста без названий. Игорь: «Разложите по документам, мне в понедельник сдавать отчёт по обследованию».',
      todo: [
        'Прочитайте девять фрагментов.',
        'В каждой строке выберите, из какого документа фрагмент. Один документ может встретиться дважды.',
        'Нажмите «Проверить». Засчитывается от 7 верных из 9.'
      ],
      look: 'Смотрите на язык и подробность: цели бизнеса, номер требования с правилом, «Как … я хочу…», поле экрана, «решили — ответственный», «автоматизированная система». Это подписи документов.'
    }),
    blank: () => ({ m: {} }),
    reference: () => ({ m: Object.fromEntries(M_ROWS.map(r => [r.id, r.ok])) }),
    render(el, ctx) {
      el.classList.add('dc-root');
      const a = ctx.ans; a.m = a.m || {};
      let rev = null;
      if (ctx.result || ctx.readonly) { rev = {}; M_ROWS.forEach(r => { if (a.m[r.id]) rev[r.id] = { s: a.m[r.id] === r.ok ? 'ok' : 'bad' }; }); }
      const box = document.createElement('div'); el.appendChild(box);
      ui.match(box, { rows: M_ROWS.map(r => ({ id: r.id, t: `<div class="dc-frag">${esc(r.t)}</div>` })), choices: M_CH, value: a.m, reveal: rev, readonly: ctx.readonly, placeholder: 'Из какого документа?', onChange: v => { a.m = v; ctx.save(); } });
    },
    check(ans) {
      const m = (ans && ans.m) || {}, notes = [];
      const good = M_ROWS.filter(r => m[r.id] === r.ok).length, empty = M_ROWS.filter(r => !m[r.id]).length;
      if (empty) notes.push({ ok: false, html: `Не выбрано: ${empty} из ${M_ROWS.length}.` });
      M_ROWS.forEach((r, i) => { if (m[r.id] && m[r.id] !== r.ok) notes.push({ ok: false, html: `Фрагмент ${i + 1}: ${esc(r.h)}` }); });
      const brdPrd = M_ROWS.some(r => (r.ok === 'brd' && m[r.id] === 'prd') || (r.ok === 'prd' && m[r.id] === 'brd'));
      if (good === M_ROWS.length) notes.push({ ok: true, html: 'Все девять фрагментов на своих полках.' });
      return {
        ok: good >= 7, score: good / M_ROWS.length, notes,
        summary: `Верно: ${good} из ${M_ROWS.length}.`,
        mentor: brdPrd ? 'BRD и PRD правда похожи — в разных компаниях их границы гуляют. Различие обычно такое: BRD — про цели всего проекта и его границы, PRD — про одну фичу или релиз продукта: для кого, метрика, что не делаем.' : null
      };
    },
    explain: `${ui.table(['Фрагмент', 'Документ', 'Подпись документа'], [
        ['Проблема, цель БЦ-2, заинтересованные лица', 'Бизнес-требования', 'цели бизнеса и границы, ни одной функции'],
        ['ФТ-14, 30 минут, «Не выкуплен»', 'ФТ', 'номер, правило с цифрой, статус'],
        ['Порядок контроля и приёмки', 'ТЗ по ГОСТ 34.602-2020', 'раздел стандарта, «автоматизированная система»'],
        ['Ссылка из поста ВКонтакте', 'PRD', 'одна фича: для кого, метрика, «не делаем»'],
        ['«Как кассир, я хочу…» с критерием', 'Бэклог', 'история и критерии приёмки'],
        ['Код заказа — …', 'Глоссарий', 'термин, значение, «не путать с»'],
        ['Поле «Код заказа»', 'Спецификация экрана', 'поле, обязательность, ввод, ошибка'],
        ['Встреча по оплате на месте', 'Протокол', 'участники, решения, ответственный, открытый вопрос'],
        ['Сценарий «Выдать заказ»', 'ФТ', 'сценарии использования живут в ФТ']
      ])}
      <p>Документ узнают по языку и подробности, а не по названию файла. Это пригодится на первой работе: в любой компании своя папка с чужими документами, и разобраться в ней — первая задача нового аналитика.</p>
      <p>Честно о спорном: BRD и PRD в разных компаниях пересекаются, а сценарии иногда выносят в отдельный документ. Различие держится на вопросе «про весь проект или про одну фичу» и «для договора или для команды».</p>
      <p class="small muted">Источники: ISO/IEC/IEEE 29148:2018 — виды спецификаций требований; ГОСТ 34.602-2020 — разделы ТЗ; Scrum Guide 2020 — бэклог продукта.</p>`,
    report: ans => M_ROWS.map((r, i) => `- ${i + 1}: ${((M_CH.find(c => c.v === ((ans.m || {})[r.id])) || { t: '—' }).t)} ${(ans.m || {})[r.id] === r.ok ? '✓' : '✗'}`).join('\n')
  };

  // =====================================================================
  // Практика 2. Оглавление ФТ на предзаказ: лишние и недостающие разделы
  // =====================================================================
  const TOC = [
    { id: 't1', t: 'Введение: назначение документа, читатели, как читать', rd: 'все' },
    { id: 't2', t: 'Глоссарий: предзаказ, интервал выдачи, код заказа', rd: 'все' },
    { id: 't3', t: 'Бизнес-контекст и цели: ссылка на бизнес-требования (БЦ-1, БЦ-2)', rd: 'Нина, Игорь, команда' },
    { id: 't4', t: 'Роли: покупатель, кассир, технолог, бухгалтер', rd: 'Дима, Лера, Соня' },
    { id: 't5', t: 'Сценарии: оформить, выдать, отменить предзаказ; заказ по телефону', rd: 'Дима, Лера, Соня' },
    { id: 't6', t: 'Бизнес-правила: 22:30, интервал 30 минут, хранение 30 минут, отмена за 2 часа', rd: 'Дима, Лера' },
    { id: 't7', t: 'Статусная модель предзаказа', rd: 'Дима, Лера' },
    { id: 't8', t: 'Экраны: ссылки на спецификации экранов покупателя и кассира', rd: 'Соня, Дима' },
    { id: 't9', t: 'Интеграции: «ПэйМост», «КассаПро» (54-ФЗ), сводка в 1С', rd: 'Дима, Олег Петрович' },
    { id: 't10', t: 'Нефункциональные требования: скорость, доступность, 152-ФЗ', rd: 'Дима, Игорь' },
    { id: 't11', t: 'Критерии приёмки и как их проверять', rd: 'Лера, Нина' },
    { id: 't12', t: 'Открытые вопросы и допущения', rd: 'все' },
    { id: 'x1', t: 'Бюджет и график платежей по этапам', rd: 'Игорь, Нина', bad: 'деньги и сроки — в договоре и плане проекта, это документы Игоря.' },
    { id: 'x2', t: 'Протокол интервью с Ниной Сергеевной целиком', rd: 'участники', bad: 'протокол — отдельный документ. В ФТ попадают принятые решения, со ссылкой на протокол.' },
    { id: 'x3', t: 'Код расчёта интервалов на Java', rd: 'Дима', bad: 'код пишут разработчики. Аналитик описывает правило, а не реализацию.' },
    { id: 'x4', t: 'Тексты сторис для ВКонтакте', rd: 'Рита', bad: 'это маркетинг Риты, а не требования к системе.' },
    { id: 'x5', t: 'Оценка задач в часах по разработчикам', rd: 'Дима, Игорь', bad: 'оценка живёт в бэклоге и плане спринта — это работа команды Димы.' }
  ];
  const TC = Object.fromEntries(TOC.map(x => [x.id, x]));
  const T_REQ = TOC.filter(x => !x.bad).map(x => x.id);
  const T_DRAFT = ['t1', 'x1', 't5', 't6', 'x3', 't8', 't12'];
  function tEval(a) {
    const list = ((a && a.list) || []).filter(id => TC[id]);
    const have = T_REQ.filter(id => list.includes(id)), extra = list.filter(id => TC[id].bad);
    const pairs = [['t2', 't5'], ['t3', 't5'], ['t4', 't5'], ['t5', 't8']];
    const pOk = pairs.filter(([x, y]) => list.includes(x) && list.includes(y) && list.indexOf(x) < list.indexOf(y)).length;
    const first = list[0] === 't1', last = list[list.length - 1] === 't12';
    const orderS = (pOk + (first ? 1 : 0) + (last ? 1 : 0)) / (pairs.length + 2);
    const score = Math.max(0, Math.min(1, (have.length / T_REQ.length) * 0.5 + orderS * 0.25 + (extra.length ? 0 : 0.25) - extra.length * 0.06));
    return { list, have, extra, first, last, orderS, score, miss: T_REQ.filter(id => !list.includes(id)) };
  }
  const tocTask = {
    id: 'toc', title: 'Поправьте оглавление ФТ на предзаказ',
    simple: howInside.simple,
    lead: ui.brief({
      situation: 'Стажёр из соседнего проекта набросал оглавление функциональных требований на предзаказ «Колоса» — его черновик уже в редакторе. Дима: «В ФТ я ищу правила, статусы и интеграции, а тут бюджет и код». Лера: «И где критерии приёмки?»',
      todo: [
        'Уберите ✕ разделы, которым не место в ФТ.',
        'Добавьте недостающие разделы из «Запаса» кнопкой «+». Рядом с разделом — кто его читает.',
        'Расставьте порядок стрелками ↑ ↓: введение — первым, открытые вопросы — последними, словарь, контекст и роли — до сценариев.',
        'Нажмите «Проверить». Засчитывается, когда все 12 нужных разделов на месте, лишних нет и введение с открытыми вопросами стоят по краям.'
      ],
      look: 'ФТ отвечает на вопрос «что делает система». Если раздел нужен, но не здесь, спросите себя: в каком документе он живёт — и кто его читатель?'
    }),
    blank: () => ({ list: T_DRAFT.slice() }),
    reference: () => ({ list: T_REQ.slice() }),
    render(el, ctx) {
      el.classList.add('dc-root');
      const a = ctx.ans; a.list = Array.isArray(a.list) ? a.list.filter(id => TC[id]) : T_DRAFT.slice();
      const ev = (ctx.result || ctx.readonly) ? tEval(a) : null;
      const order = TR.shuffle(TOC.map(x => x.id), 'dc-toc');
      el.innerHTML = `<div class="dc-two"><div class="stack tight"><div class="dc-lbl">Оглавление ФТ «Предзаказ»</div><div class="dc-toc" data-l></div><div class="dc-sum" data-k></div></div><div class="stack tight"><div class="dc-lbl">Запас разделов</div><div class="dc-toc" data-p></div></div></div>`;
      function draw() {
        TR.$('[data-l]', el).innerHTML = a.list.map((id, i) => {
          const s = TC[id], k = ev ? (s.bad ? 'bad' : '') : '';
          return `<div class="dc-ti ${k}"><span class="n">${i + 1}</span><span>${esc(s.t)}</span>${ctx.readonly ? '<span></span>' : `<span class="ctl"><button type="button" class="dc-ib" data-mv="${i}|-1" aria-label="Выше" ${i === 0 ? 'disabled' : ''}>↑</button><button type="button" class="dc-ib" data-mv="${i}|1" aria-label="Ниже" ${i === a.list.length - 1 ? 'disabled' : ''}>↓</button><button type="button" class="dc-ib" data-rm="${i}" aria-label="Убрать">✕</button></span>`}<span class="rd">читают: ${esc(s.rd)}</span></div>`;
        }).join('') || '<div class="small dim">Оглавление пусто.</div>';
        const rest = order.filter(id => !a.list.includes(id));
        TR.$('[data-p]', el).innerHTML = rest.map(id => `<div class="dc-ti"><span class="n">+</span><span>${esc(TC[id].t)}</span>${ctx.readonly ? '<span></span>' : `<span class="ctl"><button type="button" class="dc-ib" data-add="${id}" aria-label="Добавить">+</button></span>`}<span class="rd">читают: ${esc(TC[id].rd)}</span></div>`).join('') || '<div class="small dim">Запас пуст.</div>';
        TR.$('[data-k]', el).innerHTML = `${chip('разделов: ' + a.list.length, 'info')}${chip('первый: ' + (a.list[0] ? TC[a.list[0]].t.split(':')[0] : '—'), '')}${chip('последний: ' + (a.list.length ? TC[a.list[a.list.length - 1]].t.split(':')[0] : '—'), '')}`;
      }
      if (!ctx.readonly) el.addEventListener('click', e => {
        const mv = e.target.closest('[data-mv]');
        if (mv) { const [i, d] = mv.dataset.mv.split('|').map(Number), j = i + d; if (j < 0 || j >= a.list.length) return; [a.list[i], a.list[j]] = [a.list[j], a.list[i]]; ctx.save(); draw(); return; }
        const rm = e.target.closest('[data-rm]'); if (rm) { a.list.splice(+rm.dataset.rm, 1); ctx.save(); draw(); return; }
        const ad = e.target.closest('[data-add]'); if (ad) { a.list.push(ad.dataset.add); ctx.save(); ctx.decide('Оглавление ФТ', a.list.map(id => TC[id].t.split(':')[0]).join(' → ')); draw(); }
      });
      draw();
    },
    check(ans) {
      const ev = tEval(ans), notes = [];
      ev.extra.forEach(id => notes.push({ ok: false, html: `«${esc(TC[id].t)}» — не для ФТ. Подумайте, кто читает этот раздел и в каком документе он живёт.` }));
      if (ev.miss.length) notes.push({ ok: false, html: `Не хватает разделов: ${ev.miss.length}. ${ev.miss.includes('t11') ? 'Лера спрашивала, как проверять. ' : ''}${ev.miss.includes('t9') ? 'С какими чужими системами обменивается предзаказ? ' : ''}${ev.miss.includes('t2') ? 'Одно слово — одно значение для всех: где это записано? ' : ''}${ev.miss.includes('t10') ? 'А «насколько быстро и надёжно»? ' : ''}`.trim() });
      if (!ev.first) notes.push({ ok: 'warn', html: 'Первым читатель должен узнать, для кого документ и как его читать.' });
      if (!ev.last) notes.push({ ok: 'warn', html: 'Что ещё не решено — обычно в конце, чтобы список был виден и пополнялся.' });
      if (ev.orderS < 1 && ev.first && ev.last) notes.push({ ok: 'warn', html: 'Сценарии опираются на слова, цели и роли — они должны стоять раньше. А экраны обычно после сценариев.' });
      const ok = ev.have.length === T_REQ.length && !ev.extra.length && ev.first && ev.last && ev.score >= 0.85;
      if (ok) notes.push({ ok: true, html: 'Оглавление собрано: каждый раздел отвечает на вопрос своего читателя.' });
      return {
        ok, score: ev.score, notes,
        summary: `Нужных разделов: ${ev.have.length} из ${T_REQ.length}. Лишних: ${ev.extra.length}. Порядок: ${Math.round(ev.orderS * 100)} %.`,
        mentor: ev.extra.includes('x3') ? 'Код в ФТ — частая ошибка новичков, которые пришли из разработки. Аналитик пишет «что и по каким правилам», а «как» — решает команда. Иначе Дима получает готовое решение вместо требования.' : null
      };
    },
    explain: `<ol class="checks">${T_REQ.map(id => `<li>${esc(TC[id].t)} <span class="small muted">— ${esc(TC[id].rd)}</span></li>`).join('')}</ol>
      <p>Каждый раздел отвечает на вопрос конкретного читателя: Диме — правила, статусы, интеграции; Лере — правила с цифрами и критерии; Соне — сценарии и ссылки на экраны; Нине и Игорю — контекст и цели.</p>
      <p>Лишнее не выбрасывают, а кладут на свою полку: бюджет — в договор и план проекта, протокол — отдельно со ссылкой на решение, оценку — в бэклог, сторис — маркетингу. Код аналитик не пишет: он описывает правило, а реализацию выбирает команда.</p>
      <p>Порядок в середине может отличаться: кто-то ставит статусы перед правилами, кто-то экраны после интеграций. Важно, чтобы слова, цели и роли шли раньше сценариев, а открытые вопросы не терялись в середине.</p>
      <p class="small muted">Источники: ISO/IEC/IEEE 29148:2018 — состав спецификации требований к ПО; Карл Вигерс — шаблон спецификации требований.</p>`,
    refNote: 'Середину оглавления можно переставлять: засчитывается, если введение первое, открытые вопросы последние, а глоссарий, контекст и роли — раньше сценариев.',
    report: ans => tEval(ans).list.map((id, i) => `${i + 1}. ${TC[id].t}${TC[id].bad ? ' ✗ лишний' : ''}`).join('\n') || '—'
  };

  // =====================================================================
  // Практика 3. Спецификация экрана кассира «Выдача заказа» (мини-редактор с живым макетом)
  // =====================================================================
  const SRC = [{ v: 'input', t: 'Вводит кассир' }, { v: 'order', t: 'Данные заказа' }, { v: 'calc', t: 'Вычисляет система' }, { v: 'paym', t: '«ПэйМост»: платёж' }, { v: 'kassa', t: '«КассаПро»: чек' }];
  const REQ = [{ v: 'y', t: 'Обязательное' }, { v: 'n', t: 'Необязательное' }];
  const FIELDS = [
    { id: 'f1', t: 'Код заказа (поиск)', r: ['y'], s: ['input'], h: 'Без кода кассир не найдёт заказ. Кто его вводит?' },
    { id: 'f2', t: 'Имя покупателя', r: ['y'], s: ['order'], h: 'Имя есть в каждом заказе. Откуда оно на экране — вводит кассир или уже лежит в заказе?' },
    { id: 'f3', t: 'Интервал выдачи', r: ['y'], s: ['order'], h: 'Интервал выбирают при оформлении. Где он хранится?' },
    { id: 'f4', t: 'Состав заказа: позиции и количество', r: ['y'], s: ['order'], h: 'Без состава нечего выдавать. Кто его знает?' },
    { id: 'f5', t: 'Статус оплаты: «Оплачен» / «Ждёт оплаты на месте»', r: ['y'], s: ['order', 'paym'], h: 'Статус оплаты нужен у каждого заказа. Откуда система его знает?' },
    { id: 'f6', t: 'Сумма к оплате на месте', r: ['y', 'n'], s: ['calc'], h: 'Сумму кассир не вводит руками: её считают по составу и оплатам.' },
    { id: 'f7', t: 'Комментарий покупателя', r: ['n'], s: ['order'], h: 'Комментарий бывает не у всех. Может ли поле быть пустым?' },
    { id: 'f8', t: 'Сколько осталось до «Не выкуплен»', r: ['y'], s: ['calc'], h: 'Это время никто не вводит: его считают от конца интервала.' },
    { id: 'd1', t: 'Дата рождения покупателя', bad: 'для выдачи заказа не нужна. По 152-ФЗ на экране — только те персональные данные, без которых не обойтись.' },
    { id: 'd2', t: 'Номер карты покупателя полностью', bad: 'данные карты живут у «ПэйМоста», а не на экране кассира. Показывать их нельзя.' },
    { id: 'd3', t: 'План выпечки на завтра', bad: 'это экран цеха и технолога, а не выдачи заказа.' }
  ];
  const FL = Object.fromEntries(FIELDS.map(f => [f.id, f]));
  const F_REQ = FIELDS.filter(f => !f.bad);
  const STATES = [
    { id: 'st1', t: 'Пусто: на ближайший интервал заказов нет', o: ['«Заказов к выдаче нет» и ближайший интервал, в котором они есть', 'Пустой белый экран', 'Сообщение «Ошибка: нет данных»'] },
    { id: 'st2', t: 'Код не найден', o: ['Ошибка 404', '«Заказ не найден» — проверить код или найти по имени', 'Ничего не происходит'] },
    { id: 'st3', t: 'Нет связи: модем отвалился', o: ['Экран блокируется, пока связь не вернётся', 'Окно «Ошибка сети, обратитесь к администратору»', 'Загруженные заказы видны; отметку «Выдан» сохраняем и дошлём, когда связь вернётся'] },
    { id: 'st4', t: 'Заказ не оплачен', o: ['Сумма к оплате крупно; выдача — после оплаты на кассе', 'Кнопка «Выдать» как обычно', 'Заказ скрыт из списка'] },
    { id: 'st5', t: 'Успех: заказ выдан', o: ['Зелёная галочка без текста', '«Выдан», чек полного расчёта отправлен в «КассаПро»', 'Экран закрывается'] },
    { id: 'st6', t: 'Не выкуплен: прошло 30 минут после интервала', o: ['Заказ висит в списке как обычно', 'Заказ удаляется без следа', 'Заказ помечен «Не выкуплен», выпечку можно вернуть на витрину'] }
  ];
  const ST_OK = { st1: 0, st2: 1, st3: 2, st4: 0, st5: 1, st6: 2 };
  const ST_H = {
    st1: 'Что подумает кассир при белом экране или «ошибке», если заказов просто нет?',
    st2: 'Кассиру в перчатках и в очереди нужно понять, что делать дальше, а не код ошибки.',
    st3: 'Модем на Покровке отваливается на 10–15 минут. Продажи при этом не встают — а выдача?',
    st4: 'Кто-то платит на месте. Можно ли отдать заказ до оплаты — и куда пропадёт заказ, если его спрятать?',
    st5: 'Что важно знать кассиру и бухгалтеру после выдачи? По 54-ФЗ при выдаче — чек полного расчёта.',
    st6: 'Что происходит с выпечкой через 30 минут после интервала по правилам «Колоса»?'
  };
  const NOTES = [
    { id: 'n1', t: 'Крупные кнопки, без набора текста: руки в муке и перчатках', ok: true },
    { id: 'n2', t: 'Экран открывается сразу на заказах ближайшего интервала — без лишних нажатий в пик', ok: true },
    { id: 'n3', t: 'Главный способ поиска — по имени покупателя', ok: false, h: 'однофамильцы и тёзки путаются — для этого и придумали код заказа' },
    { id: 'n4', t: 'Код вводят с обычной клавиатуры планшета', ok: false, h: 'в перчатках по мелкой клавиатуре не попасть' },
    { id: 'n5', t: 'Новый кассир разбирается за день обучения: подсказки прямо на экране', ok: true }
  ];
  function sEval(a) {
    const f = (a && a.f) || {}, st = (a && a.st) || {}, nt = (a && a.nt) || {};
    const inc = Object.keys(f).filter(id => FL[id]);
    const have = F_REQ.filter(x => inc.includes(x.id)), dis = FIELDS.filter(x => x.bad && inc.includes(x.id));
    const fr = have.map(x => ({ x, rOk: x.r.includes(f[x.id].r), sOk: x.s.includes(f[x.id].s), r: f[x.id].r, s: f[x.id].s }));
    const rsS = F_REQ.length ? fr.reduce((s, y) => s + (y.rOk ? 0.5 : 0) + (y.sOk ? 0.5 : 0), 0) / F_REQ.length : 0;
    const stOk = STATES.filter(x => st[x.id] === ST_OK[x.id]);
    const ntOk = NOTES.filter(x => !!nt[x.id] === x.ok).length;
    const score = Math.max(0, Math.min(1, (have.length / F_REQ.length) * 0.2 + rsS * 0.3 + (stOk.length / STATES.length) * 0.3 + (ntOk / NOTES.length) * 0.2 - dis.length * 0.08));
    return { inc, have, dis, fr, rsS, stOk, ntOk, score, f, st, nt };
  }
  const SAMPLE = { f1: '<span class="big">К-245</span>', f2: '<b>Анна Павловна</b>', f3: '08:00–08:30', f4: 'Круассан × 2 · Бородинский × 1', f5: '<span class="chip warn">Ждёт оплаты на месте</span>', f6: 'К оплате: <b>350 ₽</b>', f7: '<span class="small muted">«Бородинский нарезать»</span>', f8: '<span class="small">до «Не выкуплен»: 24 мин</span>', d1: 'Дата рождения: 12.03.1958', d2: 'Карта: 2200 1234 5678 9012', d3: 'План выпечки на завтра: круассаны 180…' };
  function cashMock(a, view, ev) {
    const f = (a && a.f) || {}, st = (a && a.st) || {}, nt = (a && a.nt) || {};
    const fld = id => f[id] ? `<div class="fld ${ev && FL[id].bad ? 'bad' : ''}">${SAMPLE[id]}</div>` : '';
    const stateBox = (sid, icon) => { const i = st[sid]; const s = STATES.find(x => x.id === sid); return i == null ? `<div class="st bad"><span class="i">❓</span><b>Состояние не описано</b><span class="small">${esc(s.t)}: что увидит кассир?</span></div>` : `<div class="st ${ev && i !== ST_OK[sid] ? 'bad' : ''}"><span class="i">${icon}</span><b>${esc(s.o[i])}</b></div>`; };
    let body;
    if (view === 'normal') {
      const keypad = nt.n1 && !nt.n4 ? `<div class="kb">${'1234567890'.split('').map(d => `<span>${d}</span>`).join('')}</div>` : nt.n4 ? '<div class="small muted">⌨ обычная клавиатура планшета</div>' : '';
      body = `${f.f1 ? `<div class="fld">Код заказа: ${SAMPLE.f1}</div>${keypad}` : '<div class="small muted">Поиска по коду нет — как найти заказ?</div>'}
        <div class="dc-ordc"><div class="row" style="gap:8px"><span class="big">${f.f1 ? 'К-245' : '—'}</span>${fld('f2')}${fld('f3')}</div>${fld('f4')}${fld('f7')}${fld('d1')}${fld('d2')}<div class="row" style="gap:6px">${fld('f5')}${fld('f6')}${fld('f8')}</div></div>${fld('d3')}
        <div class="btnx">Выдать</div>`;
    } else body = stateBox(view, { st1: '📭', st2: '🔎', st3: '📶', st4: '💳', st5: '✅', st6: '⏰' }[view]);
    return `<div class="dc-mock"><div class="bar"><span>Выдача · Покровка</span><span>${nt.n2 ? 'интервал 08:00–08:30' : 'все заказы дня'}</span></div>${body}</div>`;
  }
  const screenTask = {
    id: 'screen', title: 'Спецификация экрана кассира «Выдача заказа»',
    simple: howReader.simple,
    lead: ui.brief({
      situation: 'Соня садится за макет экрана кассира: «Мне нужна спецификация: какие поля, откуда данные, что обязательно и что видит кассир, когда всё идёт не так». На Покровке утренний пик 07:30–09:00, очередь 8–12 человек, у кассы руки в муке и перчатках, модем отваливается на 10–15 минут, неоплаченный заказ держат 30 минут после интервала.',
      todo: [
        '«Поля»: добавьте нужные поля кнопкой «+», у каждого выберите обязательность и источник данных. Лишние поля не добавляйте.',
        '«Состояния»: для каждого из шести состояний выберите, что увидит кассир.',
        '«Требования к экрану»: отметьте те, что верны для кассы «Колоса».',
        'Справа — живой макет: переключайте вид и смотрите, что получилось. Нажмите «Проверить». Засчитывается от 80 %, если нет лишних полей и верны хотя бы пять состояний из шести.'
      ],
      look: 'Источник данных — откуда значение берётся: вводит кассир, лежит в заказе, считает система или приходит от чужой системы. Макет рисуется только из вашей спецификации — если поле не описано, его на экране нет.'
    }),
    blank: () => ({ f: {}, st: {}, nt: {} }),
    reference: () => ({ f: Object.fromEntries(F_REQ.map(x => [x.id, { r: x.r[0], s: x.s[0] }])), st: Object.assign({}, ST_OK), nt: Object.fromEntries(NOTES.map(x => [x.id, x.ok])) }),
    render(el, ctx) {
      el.classList.add('dc-root');
      const a = ctx.ans; a.f = a.f || {}; a.st = a.st || {}; a.nt = a.nt || {};
      const ev = (ctx.result || ctx.readonly) ? sEval(a) : null;
      let view = 'normal';
      const order = TR.shuffle(FIELDS.map(x => x.id), 'dc-fields');
      el.innerHTML = `<div class="stack">${sysBtn('screens/cash', 'Открыть систему «Колос»: планшет кассира', 'Сравните свою спецификацию с экраном кассира в живой системе.')}
        <div class="dc-two ed"><div class="stack">
          <div class="stack tight"><div class="dc-lbl">Поля</div><div class="dc-fl" data-fl></div><div class="dc-pal" data-pal></div></div>
          <div class="stack tight"><div class="dc-lbl">Состояния экрана</div><div class="dc-sts" data-st></div></div>
          <div class="stack tight"><div class="dc-lbl">Требования к экрану</div><div class="stack tight" data-nt></div></div>
        </div><div class="stack tight"><div class="dc-lbl">Живой макет</div>
          <div class="row">${ui.seg('v', [{ v: 'normal', t: 'Заказ' }].concat(STATES.map((s, i) => ({ v: s.id, t: String(i + 1) + ' · ' + s.t.split(':')[0] }))), view, 'accent')}</div>
          <div data-mk></div><div class="dc-sum" data-k></div></div></div></div>`;
      function draw() {
        TR.$('[data-fl]', el).innerHTML = order.filter(id => a.f[id]).map(id => {
          const x = FL[id], v = a.f[id];
          let k = '', why = '';
          if (ev) { if (x.bad) { k = 'bad'; why = 'Лишнее: ' + x.bad; } else { const rOk = x.r.includes(v.r), sOk = x.s.includes(v.s); k = rOk && sOk ? 'ok' : 'warn'; if (!(rOk && sOk)) why = x.h; } }
          return `<div class="dc-fr ${k}"><span class="nm">${esc(x.t)}</span>
            <select data-r="${id}" aria-label="Обязательность" ${ctx.readonly ? 'disabled' : ''}><option value="">Обязательное?</option>${REQ.map(o => `<option value="${o.v}" ${v.r === o.v ? 'selected' : ''}>${o.t}</option>`).join('')}</select>
            <select data-s="${id}" aria-label="Источник" ${ctx.readonly ? 'disabled' : ''}><option value="">Откуда данные?</option>${SRC.map(o => `<option value="${o.v}" ${v.s === o.v ? 'selected' : ''}>${esc(o.t)}</option>`).join('')}</select>
            ${ctx.readonly ? '<span></span>' : `<button type="button" class="dc-ib" data-rm="${id}" aria-label="Убрать поле">✕</button>`}${why && !ctx.readonly ? `<span class="why">${esc(why)}</span>` : ''}</div>`;
        }).join('') || '<div class="small dim">Полей пока нет — добавьте из списка ниже.</div>';
        TR.$('[data-pal]', el).innerHTML = ctx.readonly ? '' : order.filter(id => !a.f[id]).map(id => `<button type="button" class="btn xs ghost" data-add="${id}">+ ${esc(FL[id].t)}</button>`).join('');
        TR.$('[data-st]', el).innerHTML = STATES.map((s, si) => {
          const v = a.st[s.id], k = ev ? (v === ST_OK[s.id] ? 'ok' : 'bad') : '';
          return `<div class="dc-sr ${k}"><b>${si + 1}. ${esc(s.t)}</b><div class="opts">${s.o.map((o, i) => `<button type="button" class="dc-opt" data-so="${s.id}|${i}" aria-pressed="${v === i}" ${ctx.readonly ? 'disabled' : ''}>${esc(o)}</button>`).join('')}</div>${ev && v !== ST_OK[s.id] && !ctx.readonly ? `<span class="small">${esc(ST_H[s.id])}</span>` : ''}</div>`;
        }).join('');
        TR.$('[data-nt]', el).innerHTML = NOTES.map(n => `<label class="toggle"><input type="checkbox" data-n="${n.id}" ${a.nt[n.id] ? 'checked' : ''} ${ctx.readonly ? 'disabled' : ''}> <span>${esc(n.t)}${ev && !!a.nt[n.id] !== n.ok && !ctx.readonly ? ` <span class="small" style="color:var(--bad)">— ${n.ok ? 'а это ведь про кассу «Колоса»' : esc(n.h)}</span>` : ''}</span></label>`).join('');
        paint();
      }
      function paint() {
        TR.$('[data-mk]', el).innerHTML = cashMock(a, view, ev);
        const inc = Object.keys(a.f), full = inc.filter(id => a.f[id].r && a.f[id].s).length, sts = Object.keys(a.st).length;
        TR.$('[data-k]', el).innerHTML = `${chip('полей: ' + inc.length, 'info')}${chip('обязательность и источник: ' + full + ' из ' + inc.length, full === inc.length && inc.length ? 'ok' : 'warn')}${chip('состояний описано: ' + sts + ' из ' + STATES.length, sts === STATES.length ? 'ok' : 'warn')}${chip('требований к экрану: ' + Object.values(a.nt).filter(Boolean).length, '')}`;
      }
      if (!ctx.readonly) {
        el.addEventListener('click', e => {
          const ad = e.target.closest('[data-add]'); if (ad) { a.f[ad.dataset.add] = { r: '', s: '' }; ctx.save(); draw(); return; }
          const rm = e.target.closest('[data-rm]'); if (rm) { delete a.f[rm.dataset.rm]; ctx.save(); draw(); return; }
          const so = e.target.closest('[data-so]'); if (so) { const [sid, i] = so.dataset.so.split('|'); a.st[sid] = +i; ctx.save(); view = sid; TR.$$('[data-seg="v"] button', el).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === sid))); draw(); }
        });
        el.addEventListener('change', e => {
          const r = e.target.closest('[data-r]'), s = e.target.closest('[data-s]'), n = e.target.closest('[data-n]');
          if (r) a.f[r.dataset.r].r = r.value; if (s) a.f[s.dataset.s].s = s.value; if (n) a.nt[n.dataset.n] = n.checked;
          if (r || s || n) { ctx.save(); ctx.decide('Спецификация экрана кассира', Object.keys(a.f).map(id => FL[id].t).join('; ')); paint(); }
        });
      }
      ui.onSeg(el, (n, v) => { view = v; paint(); });
      draw();
    },
    check(ans) {
      const ev = sEval(ans), notes = [];
      const miss = F_REQ.filter(x => !ev.inc.includes(x.id));
      if (miss.length) notes.push({ ok: false, html: `Не хватает полей: ${miss.length}. Пройдите выдачу глазами кассира: как он найдёт заказ, поймёт, кому и что отдать, оплачен ли он и сколько ещё его держать?` });
      ev.dis.forEach(x => notes.push({ ok: false, html: `«${esc(x.t)}» — ${esc(x.bad)}` }));
      ev.fr.filter(y => !y.r || !y.s).forEach(y => notes.push({ ok: false, html: `«${esc(y.x.t)}»: не указаны ${!y.r && !y.s ? 'обязательность и источник' : !y.r ? 'обязательность' : 'источник'}.` }));
      ev.fr.filter(y => y.r && y.s && !(y.rOk && y.sOk)).forEach(y => notes.push({ ok: 'warn', html: `«${esc(y.x.t)}»: ${esc(y.x.h)}` }));
      STATES.filter(x => ev.st[x.id] !== ST_OK[x.id]).forEach(x => notes.push({ ok: false, html: `Состояние «${esc(x.t)}»: ${ev.st[x.id] == null ? 'не описано.' : esc(ST_H[x.id])}` }));
      NOTES.filter(x => !!ev.nt[x.id] !== x.ok).forEach(x => notes.push({ ok: 'warn', html: x.ok ? `«${esc(x.t)}» — это верно для кассы «Колоса». Вспомните смену на Покровке.` : `«${esc(x.t)}» — ${esc(x.h)}.` }));
      const ok = ev.score >= 0.8 && !ev.dis.length && ev.stOk.length >= 5;
      if (ok) notes.push({ ok: true, html: 'Спецификация готова: Соня может рисовать, а Лера — писать проверки.' });
      if (ev.f.f5 && ev.f.f5.s === 'paym') notes.push({ ok: 'info', html: 'Статус оплаты приходит от «ПэйМоста», но на экран попадает из нашего заказа — засчитываются оба варианта.' });
      return {
        ok, score: ev.score, notes,
        summary: `Нужных полей: ${ev.have.length} из ${F_REQ.length}, лишних: ${ev.dis.length}. Обязательность и источники верны на ${Math.round(ev.rsS * 100)} %. Состояния: ${ev.stOk.length} из ${STATES.length}.`,
        mentor: ev.stOk.length < 4 ? 'Состояния — то, о чём забывают чаще всего, а кассир встречает их каждый день: пустой интервал, неверный код, обрыв связи. Если их не описать, Соня нарисует только «счастливый» экран, а разработчик покажет «Ошибка 503».' : null
      };
    },
    explain: `${ui.table(['Поле', 'Обязательное', 'Источник'], F_REQ.map(x => [esc(x.t), x.r.length > 1 ? 'да / нет — по ситуации' : x.r[0] === 'y' ? 'да' : 'нет', x.s.map(v => SRC.find(o => o.v === v).t).join(' или ')]))}
      <ul class="checks">${STATES.map(s => `<li><b>${esc(s.t)}</b> — ${esc(s.o[ST_OK[s.id]])}</li>`).join('')}</ul>
      <p>Каждое решение спецификации опирается на наблюдение и блокнот: крупные кнопки — руки в муке; код вместо имени — однофамильцы и тёзки; экран на ближайшем интервале — утренний пик; офлайн-режим — модем на Покровке; «Не выкуплен» через 30 минут — правило «Колоса»; чек полного расчёта — 54-ФЗ.</p>
      <p>Лишние поля — не мелочь. Дата рождения и номер карты на экране кассира — нарушение принципа «только нужные данные» из 152-ФЗ и риск утечки. Хорошая спецификация так же внимательна к тому, чего на экране нет.</p>
      <p class="small muted">Источники: Карл Вигерс — спецификация интерфейса и словарь данных; Соня в неделе 5 разберёт с вами макеты и пользовательские пути подробнее.</p>`,
    refNote: '«Сумма к оплате» может быть обязательной или необязательной — смотря как вы её понимаете (показываем всегда или только для неоплаченных). Источник статуса оплаты — заказ или «ПэйМост».',
    report: ans => { const ev = sEval(ans); return ev.inc.map(id => `- ${FL[id].t}: ${(REQ.find(o => o.v === ev.f[id].r) || { t: '—' }).t}, ${(SRC.find(o => o.v === ev.f[id].s) || { t: '—' }).t}${FL[id].bad ? ' ✗ лишнее' : ''}`).join('\n') + '\n' + STATES.map(s => `- ${s.t}: ${ev.st[s.id] != null ? s.o[ev.st[s.id]] : '—'} ${ev.st[s.id] === ST_OK[s.id] ? '✓' : '✗'}`).join('\n'); }
  };

  // =====================================================================
  // Практика 4. Лаборатория «Документ не тому читателю»
  // =====================================================================
  const L_DOCS = [{ v: 'brd', t: 'Бизнес-требования и объём MVP' }, { v: 'srs', t: 'ФТ на предзаказ' }, { v: 'tz', t: 'ТЗ по ГОСТ на 120 страниц' }, { v: 'bl', t: 'Бэклог с историями и критериями' }, { v: 'scr', t: 'Спецификация экрана кассира' }, { v: 'mom', t: 'Протокол встречи об оплате на месте' }, { v: 'gl', t: 'Глоссарий' }, { v: 'prd', t: 'PRD фичи «Ссылка из ВКонтакте»' }];
  const L_READ = [
    { id: 'nina', need: 'Подписать итог обследования: что войдёт в первую версию к 1 марта и зачем.', cons: 'Итог обследования не подписан: этап 1 не закрыт, оплата 600 тыс. ₽ задерживается, разработка не начинается.', ok: 'Этап 1 закрыт подписью.',
      fit: { brd: 2, mom: 1, prd: 1, srs: 0, tz: 0, bl: 0, scr: 0, gl: 0 },
      say: { brd: 'Вот это я понимаю: цели, что будет к 1 марта, что потом. Подписываю.', mom: 'Решения вижу, но где картина целиком — что я получу к 1 марта?', prd: 'Про одну ссылку понятно. А про весь проект?', srs: 'Тону в статусах и правилах. Где тут про мои торты?', tz: 'Сто двадцать страниц. Подпишу не читая — а потом окажется, что торты не там.', bl: 'Сто карточек «Как … я хочу…». А что в итоге будет к 1 марта?', scr: 'Поля, источники, состояния… Это не мне.', gl: 'Словарик — хорошо. А подписывать что?' } },
    { id: 'dima', need: 'Оценить предзаказ и взять первые истории в спринт.', cons: 'Оценка «на глаз»: спринт сорвётся, Игорь узнает о перерасходе на демо.', ok: 'Оценка есть, истории в спринте.',
      fit: { bl: 2, srs: 2, scr: 1, tz: 1, prd: 1, brd: 0, mom: 0, gl: 0 },
      say: { bl: 'Истории с критериями — оцениваю и беру в спринт.', srs: 'Правила, статусы, интеграции — можно оценивать.', scr: 'Экран вижу, а правила 22:30 и 30 минут где?', tz: 'Нужное где-то в разделе про функции, остальное — не мне. Час ищу.', prd: 'Одна фича, и та не в первой версии. А предзаказ?', brd: 'Цели хорошие, но что строить? Оценить нельзя.', mom: 'Протокол встречи — а где поля и правила?', gl: 'Словарь полезен, но оценивать по нему нечего.' } },
    { id: 'lera', need: 'Написать тесты на правила 22:30 и 30 минут.', cons: 'Тесты по догадкам: ошибку на границе 22:30 найдут покупатели на пилоте.', ok: 'Тесты на границы написаны.',
      fit: { srs: 2, bl: 2, scr: 1, tz: 1, brd: 0, mom: 0, gl: 0, prd: 0 },
      say: { srs: 'Правила с цифрами — пишу тесты на 22:29, 22:30 и 22:31.', bl: 'Истории с «Дано / Когда / Тогда» — то, что надо.', scr: 'Поля и состояния есть, а граница 22:30?', tz: 'Где-то здесь есть требования… но без примеров и границ.', brd: 'Где критерии? «Увеличить выручку на 15 %» — как это проверить тестом?', mom: 'Решения записаны, а как проверить — нет.', gl: 'Слова понятны, тестов из них не напишешь.', prd: 'Это другая фича.' } },
    { id: 'sonya', need: 'Нарисовать экран кассира для выдачи заказов.', cons: 'Экран без состояний: в пик модем отвалится, и кассир увидит белый экран.', ok: 'Макет со всеми состояниями.',
      fit: { scr: 2, srs: 1, bl: 1, prd: 0, brd: 0, tz: 0, mom: 0, gl: 0 },
      say: { scr: 'Поля, источники, все состояния — рисую.', srs: 'Сценарии есть, а что именно на экране — придумываю сама.', bl: 'История есть, а состояния экрана?', prd: 'Это про приложение покупателя, не про кассу.', brd: 'Цели вижу, а экран — нет.', tz: 'Сто двадцать страниц и ни одного поля экрана.', mom: 'Про оплату на месте понятно, а про экран?', gl: 'Слова пригодятся для подписей кнопок. И всё.' } },
    { id: 'oleg', need: 'Убедиться, что решение про оплату на месте и сверку записано.', cons: 'Через месяц спор «мы так не договаривались» — и снова ручная сверка по 2 часа.', ok: 'Решение записано, ответственный назначен.',
      fit: { mom: 2, brd: 1, srs: 1, tz: 1, bl: 0, scr: 0, gl: 0, prd: 0 },
      say: { mom: 'Решение, ответственный, срок — записано. Спасибо.', brd: 'Цель «сверка за 15 минут» вижу, а что решили про оплату на месте?', srs: 'Где-то в интеграциях с 1С… найду, если покажете раздел.', tz: 'В ГОСТе я разбираюсь, но это решение тут не записано.', bl: 'Карточки для программистов. Мне — решение.', scr: 'Экран кассира? Мне бы про деньги.', gl: 'Словарь — хорошо, но что решили?', prd: 'Это не про оплату на месте.' } }
  ];
  function lEval(a) {
    const g = (a && a.g) || {};
    const rows = L_READ.map(r => ({ r, d: g[r.id], f: g[r.id] ? r.fit[g[r.id]] : -1 }));
    const pts = rows.reduce((s, x) => s + Math.max(0, x.f), 0);
    return { rows, pts, score: pts / (L_READ.length * 2), zero: rows.filter(x => x.f <= 0).length, good: rows.filter(x => x.f === 2).length };
  }
  const labTask = {
    id: 'lab', title: 'Лаборатория: документ не тому читателю',
    simple: howReader.simple,
    lead: ui.brief({
      situation: 'Понедельник, конец обследования. Пятерым людям нужно по документу, и у каждого своя задача на эту неделю. Игорь: «А может, всем одно ТЗ на 120 страниц — и дело с концом?» Проверьте это сами.',
      todo: [
        'Нажмите «Всем одно ТЗ на 120 страниц» и прочитайте реакции.',
        'Теперь в каждой карточке выберите, какой документ отдать этому человеку. Реакция и последствия появляются сразу.',
        'Добейтесь, чтобы у всех пятерых работа пошла. Нажмите «Проверить». Засчитывается от 80 %, если никто не остался с бесполезным документом.'
      ],
      look: 'Зелёная рамка — документ решает задачу человека, жёлтая — помогает частично, красная — не помогает, и тогда видно, что сломается. Один документ можно отдать нескольким.'
    }),
    blank: () => ({ g: {} }),
    reference: () => ({ g: { nina: 'brd', dima: 'bl', lera: 'srs', sonya: 'scr', oleg: 'mom' } }),
    render(el, ctx) {
      el.classList.add('dc-root');
      const a = ctx.ans; a.g = a.g || {};
      el.innerHTML = `<div class="stack"><div class="row">${ctx.readonly ? '' : '<button type="button" class="btn sm danger" data-all>Всем одно ТЗ на 120 страниц</button><button type="button" class="btn sm ghost" data-clr>Очистить</button>'}</div><div class="dc-sum" data-sum></div><div class="dc-readers" data-rs></div></div>`;
      function draw() {
        const ev = lEval(a);
        TR.$('[data-rs]', el).innerHTML = ev.rows.map(x => {
          const r = x.r, k = x.f === 2 ? 'ok' : x.f === 1 ? 'warn' : x.f === 0 ? 'bad' : '';
          return `<div class="dc-rd ${k}"><div class="row" style="gap:8px"><b>${esc(TR.PEOPLE[r.id].name)}</b><span class="small muted">${esc(TR.PEOPLE[r.id].role)}</span></div>
            <div class="need">Задача: ${esc(r.need)}</div>
            <select data-g="${r.id}" aria-label="Документ для: ${esc(TR.PEOPLE[r.id].name)}" ${ctx.readonly ? 'disabled' : ''}><option value="">Какой документ отдать?</option>${L_DOCS.map(d => `<option value="${d.v}" ${x.d === d.v ? 'selected' : ''}>${esc(d.t)}</option>`).join('')}</select>
            ${x.d ? ui.say(r.id, esc(r.say[x.d])) : ''}
            ${x.f === 0 ? `<div class="cons">✕ ${esc(r.cons)}</div>` : x.f === 2 ? `<div class="small" style="color:var(--ok)">✓ ${esc(r.ok)}</div>` : ''}
            ${x.d ? ui.meter(x.f / 2, x.f === 2 ? 'ok' : x.f === 1 ? 'warn' : 'bad') : ''}</div>`;
        }).join('');
        const lab = [['nina', 'Этап 1 подписан'], ['dima', 'Спринт оценён'], ['lera', 'Тесты на границы'], ['sonya', 'Макет с состояниями'], ['oleg', 'Решение записано']];
        TR.$('[data-sum]', el).innerHTML = lab.map(([id, t]) => { const x = ev.rows.find(y => y.r.id === id); return chip((x.f === 2 ? '✓ ' : x.f === 1 ? '~ ' : x.f === 0 ? '✕ ' : '○ ') + t, x.f === 2 ? 'ok' : x.f === 1 ? 'warn' : x.f === 0 ? 'bad' : ''); }).join('');
      }
      if (!ctx.readonly) {
        TR.on(el, 'click', '[data-all]', () => { L_READ.forEach(r => { a.g[r.id] = 'tz'; }); ctx.save(); draw(); });
        TR.on(el, 'click', '[data-clr]', () => { a.g = {}; ctx.save(); draw(); });
        el.addEventListener('change', e => { const s = e.target.closest('[data-g]'); if (!s) return; if (s.value) a.g[s.dataset.g] = s.value; else delete a.g[s.dataset.g]; ctx.save(); ctx.decide('Документы читателям', L_READ.map(r => TR.PEOPLE[r.id].name + ': ' + ((L_DOCS.find(d => d.v === a.g[r.id]) || { t: '—' }).t)).join('; ')); draw(); });
      }
      draw();
    },
    check(ans) {
      const ev = lEval(ans), notes = [];
      const allTz = L_READ.every(r => (ans.g || {})[r.id] === 'tz');
      ev.rows.forEach(x => {
        const nm = esc(TR.PEOPLE[x.r.id].name);
        if (x.f < 0) notes.push({ ok: false, html: `${nm}: документ не выбран.` });
        else if (x.f === 0) notes.push({ ok: false, html: `${nm}: этот документ не помогает. Ещё раз прочитайте задачу на неделю — что именно надо сделать?` });
        else if (x.f === 1) notes.push({ ok: 'warn', html: `${nm}: помогает частично. Есть документ, где нужное лежит целиком.` });
      });
      const ok = ev.score >= 0.8 && ev.zero === 0;
      if (ok) notes.push({ ok: true, html: 'У каждого — свой документ, у всех пятерых работа идёт.' });
      return {
        ok, score: ev.score, notes,
        summary: `Работа пошла у ${ev.good} из ${L_READ.length}, частично — у ${ev.rows.filter(x => x.f === 1).length}, встала — у ${ev.zero}.`,
        mentor: allTz ? 'Видите, что сделало «одно ТЗ на всех»? Нина подписала не читая, Лера не нашла границ, Соня — полей. Один документ для всех не работает: у каждого читателя свой вопрос и свой уровень подробности.' : null
      };
    },
    explain: `${ui.table(['Кто', 'Задача', 'Лучший документ', 'Тоже годится'], [
        ['Нина Сергеевна', 'подписать итог обследования', 'Бизнес-требования и объём MVP', 'протокол — частично'],
        ['Дима', 'оценить и взять в спринт', 'Бэклог с историями и критериями', 'ФТ'],
        ['Лера', 'тесты на 22:30 и 30 минут', 'ФТ с правилами', 'бэклог с критериями'],
        ['Соня', 'экран кассира', 'Спецификация экрана', 'ФТ и бэклог — частично'],
        ['Олег Петрович', 'решение про оплату на месте', 'Протокол встречи', 'бизнес-требования, ФТ — частично']
      ])}
      <p>«Одно ТЗ на 120 страниц для всех» проваливается у каждого по-своему: заказчик подписывает не читая, разработчик час ищет нужный раздел, тестировщик не находит границ, дизайнер — полей, бухгалтер — решения. Это не значит, что большой документ плох. Это значит, что у каждого читателя свой вход в него — или свой документ.</p>
      <p>Позиция аналитика: перед тем как писать, спросить «кто будет читать и что он должен сделать после чтения». Ответ определяет и формат, и подробность.</p>
      <p class="small muted">Источник: BABOK v3 — «Планирование управления информацией бизнес-анализа»: формат, уровень детализации и способ хранения выбирают под аудиторию.</p>`,
    refNote: 'Засчитываются и другие сочетания: Диме — ФТ, Лере — бэклог с критериями. Главное — ни у кого не осталось бесполезного документа.',
    report: ans => lEval(ans).rows.map(x => `- ${TR.PEOPLE[x.r.id].name}: ${(L_DOCS.find(d => d.v === x.d) || { t: '—' }).t} ${x.f === 2 ? '✓' : x.f === 1 ? '~' : '✗'}`).join('\n')
  };

  // =====================================================================
  // Практика 5. Какой набор документов «Колосу» — своими словами
  // =====================================================================
  const S_RUBRIC = [
    'Этап 1 (обследование, фиксированная цена 600 тыс. ₽): подписываемый итог — бизнес-требования с целями и границами, процессы «как есть» и «как будет», согласованный объём первой версии к 1 марта',
    'Этап 2 (разработка спринтами по 2 недели, оплата по факту): живой бэклог с историями и критериями приёмки, спецификации экранов и правил в вики, правятся по ходу',
    'Пакет интеграции с «КассаПро» с фиксированным объёмом — отдельная подписываемая спецификация интеграции: фиксированная цена требует фиксированного объёма',
    'Общие для всех: глоссарий и протоколы встреч; ТЗ по ГОСТ не обязательно — коммерческий проект, не госзаказ, разделы ГОСТ можно взять как чек-лист',
    'Каждому читателю — свой документ и уровень: Нине — бизнес-требования, Диме и Лере — истории, правила, критерии, Соне — спецификации экранов, Олегу Петровичу — протоколы и раздел про чеки и 1С'
  ];
  const S_REF = 'Предлагаю набор под наш договор в два этапа. Обследование — фиксированная цена 600 тыс. ₽, поэтому его итог — подписываемый документ: бизнес-требования с целями БЦ-1…БЦ-4 и границами, процессы «как есть» и «как будет» и согласованный объём первой версии к 1 марта. Нина подпишет его — это и закрытие этапа, и базовая версия. Разработка идёт спринтами по две недели с оплатой по факту, поэтому дальше нам нужен не толстый документ, а живой бэклог: истории с критериями приёмки для Димы и Леры, спецификации экранов для Сони и правила в вики, которые правим к каждому спринту. Исключение — интеграция с «КассаПро»: это пакет с фиксированным объёмом и сертификацией у вендора, поэтому на неё пишем отдельную спецификацию и подписываем её, иначе фиксированную цену не назвать. Для всех — общий глоссарий и протоколы встреч с решениями, ответственными и сроками; протоколы особенно важны Олегу Петровичу. ТЗ по ГОСТ 34.602 нам не обязательно: проект коммерческий, договор на стандарт не ссылается. Но его разделы возьмём как чек-лист — про приёмку и обучение кассиров легко забыть.';
  const setTask = {
    id: 'set', title: 'Какой набор документов нужен «Колосу»',
    simple: howShelf.simple,
    lead: ui.brief({
      situation: 'Игорь готовит план на этап разработки: «Нина просит „ТЗ“, Дима — истории, Лера — критерии, Олег Петрович — чтобы всё было записано. Напишите, какие документы мы ведём, когда и для кого. И учтите договор».',
      todo: [
        'Напишите записку Игорю: 6–10 предложений, от 300 символов.',
        'Разберите оба этапа договора и пакет «КассаПро»: что подписываем, что живёт и правится, кто что читает. Скажите, нужно ли ТЗ по ГОСТ.',
        'Нажмите «Проверить с Ксенией (Claude)» или «Сверить с эталоном самому» и честно отметьте раскрытые пункты. Засчитывается от 60 %.'
      ],
      lookTitle: 'На что опереться',
      look: 'Договор: обследование — 3 недели, фиксированная цена 600 тыс. ₽ (описать процессы и согласовать объём первой версии); разработка — оплата по факту, спринты по 2 недели, демо в конце каждого; интеграция с «КассаПро» — отдельный пакет с фиксированным объёмом, у вендора сертификация 3 недели. Вкладки теории «Каскад, Scrum, гибрид» и «Живой или подписываемый».'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: S_REF, self: S_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('dc-root');
      el.insertAdjacentHTML('beforeend', `<div class="talk">${ui.say('igor', 'Какие документы ведём, когда и для кого? И чтобы по договору всё сходилось.')}${ui.say('nina', 'Мне нужен документ, который я подпишу. Настоящий.')}</div>`);
      const j = document.createElement('div'); j.style.marginTop = '12px'; el.appendChild(j);
      ui.justify(j, {
        id: 'dc-set', q: 'Записка Игорю: какой набор документов «Колосу» и почему?', placeholder: 'Игорь, предлагаю…',
        qPlain: 'Напишите записку руководителю проекта для сети пекарен: какой набор документов вести на проекте с договором в два этапа. Первый этап — обследование с фиксированной ценой (нужен подписываемый итог: бизнес-требования, процессы, объём первой версии). Второй — разработка спринтами с оплатой по факту (живой бэклог с историями и критериями, спецификации экранов в вики). Отдельно — пакет интеграции с кассами с фиксированным объёмом (подписываемая спецификация). Общие — глоссарий и протоколы. Нужно ли ТЗ по ГОСТ 34.602 и кому какой документ читать.',
        rubric: S_RUBRIC, reference: S_REF, value: ctx.ans.j, readonly: ctx.readonly, minLen: 300,
        onChange: v => { ctx.ans.j = v; ctx.save(); ctx.decide('Набор документов «Колоса»', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j);
      return {
        ok: s >= 0.6, score: s,
        summary: s ? `Оценка записки: ${Math.round(s * 100)} %.` : 'Напишите записку (от 300 символов) и проверьте её с Ксенией или сверьте с эталоном сами.',
        notes: s && s < 0.6 ? [{ ok: false, html: 'Начните с договора: где фиксированная цена — там подпись и фиксированный объём, где оплата по факту — там живые документы. Потом пройдитесь по читателям.' }] : []
      };
    },
    explain: '<p>Набор документов вытекает из договора и читателей, а не из привычки. Где фиксированная цена — обследование и пакет «КассаПро» — нужен подписанный объём: иначе нечего принимать и не на что опереться при споре. Где оплата по факту — разработка спринтами — живые документы, которые успевают за изменениями.</p><p>Нина получает то, что просила, — «настоящий документ» с подписью, только называется он бизнес-требованиями и объёмом первой версии, а не ТЗ по ГОСТ. Дима, Лера и Соня получают то, по чему работают каждый день. Олег Петрович — записанные решения.</p><p class="small muted">Источники: ГОСТ 34.602-2020 — когда ТЗ на автоматизированную систему уместно; Agile-манифест — «работающий продукт важнее исчерпывающей документации»; Scrum Guide 2020 — бэклог продукта; BABOK v3 — выбор форматов под аудиторию.</p>',
    report: ans => (ans.j && ans.j.text) ? ans.j.text : '—'
  };

  // =====================================================================
  TR.stage({
    id: ID, act: 4, order: 360, slot: 'Пт 15:00', title: 'Документы аналитика',
    when: 'пятница, 30 октября, 15:00 · переговорная «Квант Софт», на столе — стопка распечаток',
    intro: [
      { who: 'igor', html: 'Обследование подходит к концу. Нина Сергеевна спрашивает, где «ТЗ»: по договору первый этап закрывается подписанным документом.' },
      { who: 'dima', html: 'Только не стостраничник, пожалуйста. Мне — истории и экраны с полями.' },
      { who: 'lera', html: 'А мне — правила с цифрами и критерии приёмки. Иначе я проверяю догадки.' },
      { who: 'ksenia', html: 'Значит, документов будет несколько, и у каждого свой читатель. Сегодня — полка документов аналитика: что на ней стоит, кто что читает, когда документ подписывают, а когда он живёт и меняется. И соберём набор для «Колоса» с учётом нашего договора.' }
    ],
    facts: ['F-obs-hands', 'F-obs-names', 'F-peak', 'F-hold', 'F-pay', 'F-net', 'F-staff', 'F-pd'],
    glossary: [
      { term: 'Бизнес-требования (BRD)', simple: 'Зачем проект бизнесу: цели в цифрах, проблемы, что входит и что нет.', tech: 'Business Requirements Document: цели и метрики, проблемы и потребности, границы, заинтересованные лица, ограничения. Читают заказчик и руководитель проекта, обычно подписывают.' },
      { term: 'Функциональные требования (ФТ, SRS)', simple: 'Что делает система: сценарии, правила, данные, интеграции.', tech: 'Software Requirements Specification — спецификация требований к ПО (ISO/IEC/IEEE 29148:2018): функции, правила, данные, интерфейсы, нефункциональные требования. Читают разработчики, тестировщик, дизайнер.' },
      { term: 'ТЗ по ГОСТ 34.602-2020', simple: 'Договорной документ о создании системы целиком — по разделам стандарта.', tech: 'Техническое задание на создание автоматизированной системы: общие сведения, цели, характеристика объекта, требования, работы, порядок разработки, контроль и приёмка, подготовка к вводу, документирование, источники. Обязательно, когда этого требует договор или правила закупки.' },
      { term: 'Продуктовый документ (PRD)', simple: 'Документ продакта об одной фиче или релизе: для кого, проблема, метрика, что не делаем.', tech: 'Product Requirements Document — в продуктовых компаниях; живёт, пока фича в работе. Границы с BRD в разных компаниях разные.' },
      { term: 'Бэклог продукта', simple: 'Упорядоченный список всего, что нужно сделать: истории, ошибки, задачи.', tech: 'Product Backlog (Scrum Guide 2020): живой артефакт, за порядок отвечает владелец продукта; верх уточняют к ближайшим спринтам.' },
      { term: 'Глоссарий проекта', simple: 'Словарь: одно слово — одно значение для всех.', tech: 'Термины предметной области с определениями, синонимами, которых избегают, и примерами. Ведут с первой встречи.' },
      { term: 'Спецификация экрана', simple: 'Что на экране: поля, откуда данные, что обязательно, все состояния.', tech: 'Для каждого поля — обязательность, источник данных, формат и правила; для экрана — действия и состояния (пусто, загрузка, ошибка, успех). Читают дизайнер, фронтенд-разработчик, тестировщик.' },
      { term: 'Протокол встречи', simple: 'Что решили, кто что делает и к какому сроку.', tech: 'Дата, участники, решения, задачи с ответственными и сроками, открытые вопросы. Решения из протокола потом попадают в требования.' },
      { term: 'Живая документация', simple: 'Документы, которые правят по ходу работы, обычно в вики.', tech: 'Страницы с историей изменений и ссылками на истории и макеты; актуальны, но без юридической силы. Обычно опираются на подписанную базовую версию.' },
      { term: 'Подписываемый документ', simple: 'Документ, о котором договорились стороны и поставили подписи.', tech: 'Служит договором и базовой версией: изменения — через запрос на изменение и новую версию. Нужен там, где фиксированная цена и приёмка.' }
    ],
    outro: 'Теперь у вас в голове полка документов аналитика: бизнес-требования, ФТ, ТЗ по ГОСТ, PRD, бэклог, глоссарий, спецификация экрана, протокол — кто их пишет, кто читает и когда. Вы знаете, что подписывают там, где фиксированная цена, а по ходу спринтов ведут живые документы; что «одно ТЗ для всех» не работает; и как описать экран кассира так, чтобы Соня нарисовала, а Лера проверила. Неделя 4 закончена. Дальше — неделя 5: Scrum изнутри, где бэклог и живые спецификации заработают по-настоящему.',
    tasks: [howShelf, howInside, howReader, matchTask, tocTask, screenTask, labTask, setTask]
  });
})();
