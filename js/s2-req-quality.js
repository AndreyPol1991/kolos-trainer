/* Неделя 2, среда 10:00 — «Хорошее требование».
   Теория: свойства хорошего требования по ISO/IEC/IEEE 29148 на бланке торта и соседнем «планшете списаний» («сломать / починить»);
   лаборатория-подсветка слов-ловушек, «как это проверит Лера?» и формула проверяемой фразы;
   набор требований: противоречия, пробелы, трассируемость — на том же планшете списаний.
   Практика: найти нарушенное свойство в 9 требованиях «Колоса»; переписать пункты письма Нины в живом редакторе
   с проверкой по признакам; найти противоречия в наборе и решить, что с ними делать; ответить Нине своими словами. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;

  if (!document.getElementById('rqq-css')) document.head.insertAdjacentHTML('beforeend', `<style id="rqq-css">
    .rqq-root, .rqq-root .stack > * { min-width: 0; }
    .rqq-root .seg button { white-space: normal; text-align: left; }
    .rqq-root .btn { white-space: normal; }
    .rqq-h3 { margin: 2px 0 0; font: 600 18px/1.3 var(--f-brand); }
    .rqq-props { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 6px; }
    .rqq-pb { display: grid; justify-items: center; align-content: start; gap: 4px; padding: 8px 4px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); color: var(--text-2); font-size: 12.5px; line-height: 1.2; text-align: center; min-width: 0; position: relative; }
    .rqq-pb .ic { font-size: 18px; line-height: 1; }
    .rqq-pb .nm { min-width: 0; overflow-wrap: anywhere; }
    .rqq-pb[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--text); box-shadow: 0 0 0 1px var(--accent); }
    .rqq-pb.seen::after { content: "✓"; position: absolute; top: 3px; right: 6px; font-size: 11px; color: var(--ok); }
    .rqq-blank { border: 1px dashed var(--border-strong); border-radius: 10px; background: var(--surface); padding: 10px 12px; font-size: 15px; }
    .rqq-blank.bad { border-color: var(--bad); background: var(--bad-soft); }
    .rqq-blank.ok { border-color: var(--ok); background: var(--ok-soft); }
    .rqq-lbl { display: block; font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px; }
    .rqq-q { font-size: 14px; padding: 8px 12px; border-left: 3px solid var(--violet); background: var(--violet-soft); border-radius: 0 8px 8px 0; }
    mark.rqq-hl { border-radius: 4px; padding: 0 2px; cursor: help; color: inherit; }
    mark.rqq-hl.bad { background: var(--bad-soft); color: var(--bad); box-shadow: inset 0 -2px 0 var(--bad); }
    mark.rqq-hl.warn { background: var(--warn-soft); color: var(--warn); box-shadow: inset 0 -2px 0 var(--warn); }
    .rqq-text { font-size: 15.5px; line-height: 1.75; padding: 12px 14px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); overflow-wrap: anywhere; }
    .rqq-feats { display: flex; flex-wrap: wrap; gap: 6px; }
    .rqq-feats .chip { white-space: normal; text-align: left; }
    .rqq-feats .chip.rqq-o { border-style: dashed; }
    .rqq-traps { display: grid; gap: 6px; }
    .rqq-trap { display: grid; grid-template-columns: minmax(0, 150px) minmax(0, 1fr); gap: 4px 12px; align-items: baseline; padding: 7px 10px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); font-size: 13.5px; }
    .rqq-trap b { overflow-wrap: anywhere; }
    .rqq-trap b.bad { color: var(--bad); } .rqq-trap b.warn { color: var(--warn); }
    .rqq-flips { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .rqq-flip { text-align: left; display: grid; gap: 8px; align-content: start; padding: 12px 14px; border-radius: 12px; border: 1px solid var(--border); background: var(--surface); min-height: 130px; min-width: 0; font-size: 14px; }
    .rqq-flip:hover { border-color: var(--text-muted); }
    .rqq-flip[aria-pressed="true"] { border-color: var(--info); background: var(--info-soft); }
    .rqq-flip .rq { font-weight: 600; color: var(--text); }
    .rqq-formula { display: flex; flex-wrap: wrap; gap: 6px; align-items: stretch; }
    .rqq-sg { padding: 5px 9px; border-radius: 8px; font-size: 14px; border: 1px solid var(--border-strong); background: var(--surface); min-width: 0; }
    .rqq-sg small { display: block; font: 600 9.5px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .rqq-sg.c1 { border-color: var(--info); background: var(--info-soft); }
    .rqq-sg.c2 { border-color: var(--violet); background: var(--violet-soft); }
    .rqq-sg.c3 { border-color: var(--accent); background: var(--accent-soft); }
    .rqq-sg.c4 { border-color: var(--warn); background: var(--warn-soft); }
    .rqq-sg.c5 { border-color: var(--cyan); background: color-mix(in srgb, var(--cyan) 12%, var(--surface)); }
    .rqq-setbar { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    .rqq-setbar .v { font-size: 18px; }
    .rqq-set { display: grid; gap: 8px; }
    .rqq-sr { display: grid; grid-template-columns: 44px minmax(0, 1fr); gap: 4px 10px; padding: 9px 12px; border: 1px solid var(--border); border-left: 4px solid var(--border-strong); border-radius: 10px; background: var(--surface); font-size: 14px; }
    .rqq-sr .id { font: 600 12px/1.6 var(--f-mono); color: var(--text-muted); }
    .rqq-sr.bad { border-left-color: var(--bad); background: var(--bad-soft); }
    .rqq-sr.warn { border-left-color: var(--warn); }
    .rqq-sr.ok { border-left-color: var(--ok); }
    .rqq-sr.new { border-left-color: var(--ok); background: var(--ok-soft); }
    .rqq-sr.ghost { border-style: dashed; border-left-style: dashed; color: var(--text-muted); background: transparent; }
    .rqq-sr .meta { grid-column: 2; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
    .rqq-sr .chip { font-size: 12px; padding: 1px 8px; white-space: normal; }
    .rqq-rw { display: grid; gap: 10px; padding: 12px 14px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface-2); }
    .rqq-rw.ok { border-color: var(--ok); } .rqq-rw.bad { border-color: var(--bad); } .rqq-rw.warn { border-color: var(--warn); }
    .rqq-rw h4 { font: 600 15px/1.3 var(--f-brand); margin: 0; }
    .rqq-was { font-size: 15px; padding: 8px 12px; border-radius: 8px; background: var(--surface); border: 1px dashed var(--border-strong); }
    .rqq-mini { display: grid; grid-template-columns: 24px minmax(0, 1fr); gap: 8px; align-items: start; font-size: 13.5px; color: var(--text-2); }
    .rqq-mini .avatar { width: 24px; height: 24px; font-size: 9.5px; }
    .rqq-cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .rqq-card { text-align: left; display: grid; grid-template-columns: 28px minmax(0, 1fr); gap: 2px 10px; align-items: start; padding: 10px 12px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface); font-size: 14px; min-width: 0; }
    .rqq-card:hover:not(:disabled) { border-color: var(--text-muted); }
    .rqq-card:disabled { opacity: 1; cursor: default; }
    .rqq-card .L { width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; background: var(--surface-3); font: 700 13px/1 var(--f-brand); color: var(--text); grid-row: span 2; }
    .rqq-card .src { font-size: 12px; color: var(--text-muted); }
    .rqq-card[aria-pressed="true"] { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-glow); }
    .rqq-card.paired .L { background: var(--violet-soft); color: var(--violet); }
    .rqq-pairs { display: flex; flex-wrap: wrap; gap: 6px; }
    .rqq-pairs .chip { white-space: normal; }
    .rqq-pairs button.x { border: 0; background: none; padding: 0 2px; color: inherit; font-size: 14px; line-height: 1; }
    .rqq-letter { font-size: 14px; padding: 10px 14px; border-radius: 10px; background: var(--surface); border: 1px solid var(--border); display: grid; gap: 2px; }
    @media (max-width: 860px) { .rqq-props { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
    @media (max-width: 560px) {
      .rqq-props { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .rqq-pb { grid-template-columns: 22px minmax(0, 1fr); justify-items: start; align-items: center; text-align: left; padding: 7px 8px; }
      .rqq-flips, .rqq-cards { grid-template-columns: minmax(0, 1fr); }
      .rqq-setbar { gap: 6px; } .rqq-setbar .stat { padding: 8px; } .rqq-setbar .k { font-size: 9px; } .rqq-setbar .v { font-size: 15px; } .rqq-setbar .s { display: none; }
      .rqq-sr { grid-template-columns: minmax(0, 1fr); } .rqq-sr .meta { grid-column: 1; }
      .rqq-trap { grid-template-columns: minmax(0, 1fr); }
      .rqq-root .mrow { grid-template-columns: minmax(0, 1fr); }
    }
  </style>`);

  // ---------- общие помощники ----------
  const plainT = s => String(s || '').replace(/<[^>]+>/g, '');
  const chip = (txt, k) => `<span class="chip ${k || ''}">${txt}</span>`;
  const mini = (who, html) => { const p = TR.PEOPLE[who] || { ini: '?' }; return `<div class="rqq-mini"><span class="avatar" data-p="${esc(who)}" aria-hidden="true">${esc(p.ini)}</span><div>${html}</div></div>`; };

  // =====================================================================
  // Анализатор слов-ловушек (общий для теории и проверки практики; чистые функции)
  // =====================================================================
  const TRAPS = [
    { id: 'fast', src: 'быстр[а-яё]*', l: 'быстро', q: 'Быстро — это сколько секунд? При какой нагрузке и в какой доле случаев?', skip: (b, a) => /^\s*(?:чем\s*)?(?:за\s*)?\d/.test(a) || /^\s*платеж/i.test(a) },
    { id: 'conv', src: 'удобн[а-яё]*', l: 'удобно', q: 'Удобно кому и для какой задачи? Чем измерим: за сколько шагов или минут, с какой долей ошибок?' },
    { id: 'etc', src: 'и\\s*т\\.\\s*д\\.?|и\\s*т\\.\\s*п\\.?|и так далее|и тому подобное|и\\s*др\\.|и прочее|итд|etc\\.?', l: 'и т. д.', q: 'Что именно входит в список? Перечислите полностью: «и т. д.» каждый допишет по-своему.' },
    { id: 'poss', src: 'по\\s+(?:мере\\s+)?возможности|если\\s+возможно|при\\s+возможности', l: 'по возможности', q: 'А если невозможно — что тогда? Это обязательно или нет?' },
    { id: 'supp', src: 'поддержива[а-яё]*|поддержк[а-яё]*', l: 'поддерживать', q: '«Поддерживать» — не действие. Кто что делает: покупатель оплачивает? система передаёт? кассир выгружает?', skip: b => /служб[а-яё]*\s*$/i.test(b) },
    { id: 'always', src: 'всегда|никогда', l: 'всегда', q: 'Всегда — даже ночью, в окно обслуживания, при обрыве связи? Какая доля времени в месяц?' },
    { id: 'intu', src: 'интуитивн[а-яё]*', l: 'интуитивно', q: 'Интуитивно для кого? Как проверить: новый сотрудник справляется без подсказки — за сколько минут?' },
    { id: 'opt', src: 'оптимальн[а-яё]*|оптимизир[а-яё]*|наилучш[а-яё]*', l: 'оптимально', q: 'Оптимально по какому показателю? Меньше списаний? Меньше нехватки к 9 утра? Какое число?' },
    { id: 'pretty', src: 'красив[а-яё]*|привлекательн[а-яё]*|стильн[а-яё]*', l: 'красиво', q: 'Кто и по какому образцу решит, что красиво? Есть макет, согласованный с заказчиком?' },
    { id: 'like', src: '[Кк]ак\\s+(?:у|в)\\s+[«"]?[А-ЯЁA-Z][а-яёa-zA-Z-]*', cs: true, l: 'как у …', q: 'Что именно «как у них»? Какую задачу человека это решает? Опишите своё, а не чужое приложение.' },
    { id: 'easy', src: 'легк[а-яё]*|лёгк[а-яё]*|понятн[а-яё]*|просто(?![а-яё])', l: 'легко, понятно', q: 'Легко и понятно — для кого? Чем измерим?' },
    { id: 'rel', src: 'надёжн[а-яё]*|надежн[а-яё]*|без\\s+сбоев|бесперебойн[а-яё]*|стабильн[а-яё]*', l: 'надёжно, без сбоев', q: 'Сколько часов простоя в месяц допустимо? Что происходит при обрыве связи?' },
    { id: 'time', src: 'своевременн[а-яё]*|оперативн[а-яё]*|в\\s+разумн[а-яё]*\\s+срок[а-яё]*|в\\s+кратчайш[а-яё]*\\s+срок[а-яё]*', l: 'своевременно', q: 'К какому времени? За сколько минут до чего?' },
    { id: 'andor', src: 'и\\s*/\\s*или', l: 'и/или', q: 'И то и другое — или одно из двух?' },
    { id: 'eval', src: 'современн[а-яё]*|гибк[а-яё]*|эффективн[а-яё]*|качественн[а-яё]*|хорош[а-яё]*|нормальн[а-яё]*|комфортн[а-яё]*', l: 'оценочное слово', q: 'По какому признаку проверим? Назовите измеримый показатель.' },
    { id: 'inst', src: 'мгновенн[а-яё]*|моментальн[а-яё]*', l: 'мгновенно', q: 'Сколько секунд? «Мгновенно» не измерить секундомером.' },
    { id: 'need', src: 'при\\s+необходимости|если\\s+(?:это\\s+)?(?:потребуется|нужно|понадобится)|желательно|по\\s+желанию', l: 'при необходимости', q: 'Кто и как решает, что «нужно»? Это обязательно или нет?' },
    { id: 'max', src: 'максимально|минимально|как\\s+можно\\s+(?:быстрее|больше|меньше|раньше|скорее)', l: 'максимально', q: 'Какое число? «Максимально» в тесте не бывает.' },
    { id: 'suff', src: 'достаточн[а-яё]*|адекватн[а-яё]*|приемлем[а-яё]*', l: 'достаточно', q: 'Достаточно — это сколько?' },
    { id: 'many', src: 'нескольк[а-яё]*|много(?![а-яё])|многие|большинств[а-яё]*', kind: 'warn', l: 'несколько, много', q: 'Сколько именно?' },
    { id: 'approx', src: 'примерно|около|приблизительно|порядка', kind: 'warn', l: 'примерно', q: 'Какой допуск: плюс-минус сколько?' },
    { id: 'all', src: 'все|всё|всех|любой|любая|любое|любые|любых', kind: 'warn', l: 'всё, любой', q: 'Правда всё, без исключений? «Всё» — это что именно?' }
  ];
  TRAPS.forEach(t => { t.re = new RegExp('(?<![а-яёa-z0-9])(?:' + t.src + ')(?![а-яёa-z0-9])', t.cs ? 'gu' : 'giu'); });
  const ACTOR_RE = /(покупател|клиент|кассир|технолог|кондитер|бухгалтер|управляющ|курьер|систем|приложени|сервер|экран|планшет|пользовател|сотрудник|оператор|при[её]м заказ|сайт|отч[её]т|касс)/i;
  const COND_RE = /(?:^|[^а-яёa-z])(?:при|если|когда|после|до|в течение|не позднее|не раньше|не позже|не более|не менее|не дольше|не меньше|не больше|быстрее|в час|в день|в месяц|в сутки|за|с)(?![а-яёa-z])/i;
  const MODAL_RE = /(?:^|[^а-яё])(?:должен|должна|должно|должны|обязан[а-яё]*)(?![а-яё])/gi;

  function scan(text) {
    text = String(text == null ? '' : text);
    const hits = [];
    TRAPS.forEach(t => {
      t.re.lastIndex = 0; let m;
      while ((m = t.re.exec(text))) {
        if (!m[0]) { t.re.lastIndex++; continue; }
        const s = m.index, e = s + m[0].length;
        if (t.skip && t.skip(text.slice(Math.max(0, s - 30), s), text.slice(e, e + 30))) continue;
        hits.push({ s, e, w: m[0], t });
      }
    });
    hits.sort((x, y) => x.s - y.s || y.e - x.e);
    const list = []; let end = -1;
    hits.forEach(h => { if (h.s >= end) { list.push(h); end = h.e; } });
    return {
      text, hits: list, len: text.trim().length,
      bad: list.filter(h => h.t.kind !== 'warn'), warn: list.filter(h => h.t.kind === 'warn'),
      hasNum: /\d/.test(text), hasActor: ACTOR_RE.test(text), hasCond: COND_RE.test(text),
      modals: (text.match(MODAL_RE) || []).length
    };
  }
  function markup(sc) {
    let out = '', i = 0;
    sc.hits.forEach(h => { out += esc(sc.text.slice(i, h.s)) + `<mark class="rqq-hl ${h.t.kind === 'warn' ? 'warn' : 'bad'}" title="${esc(h.t.q)}">${esc(h.w)}</mark>`; i = h.e; });
    return out + esc(sc.text.slice(i));
  }
  function leraLine(sc) {
    if (!sc.len) return 'Жду формулировку.';
    if (sc.bad.length) { const h = sc.bad[0]; return `«${esc(h.w)}» — не проверю. ${esc(h.t.q)}`; }
    if (!sc.hasActor) return 'Слов-ловушек нет. Но кто это делает — покупатель, кассир, система? Без этого непонятно, что тестировать.';
    if (!sc.hasNum && !sc.hasCond) return 'Слов-ловушек нет. А с чем сравнить результат? Нужна цифра или точное условие.';
    if (sc.warn.length) return `Почти проверяемо. Уточню одно: «${esc(sc.warn[0].w)}» — ${esc(sc.warn[0].t.q)}`;
    return 'Это я могу проверить: понятно, кто действует, при каком условии и с чем сравнить результат.';
  }
  function trapList(sc) {
    const seen = new Set(), rows = [];
    sc.hits.forEach(h => { if (seen.has(h.t.id)) return; seen.add(h.t.id); rows.push(`<div class="rqq-trap"><b class="${h.t.kind === 'warn' ? 'warn' : 'bad'}">«${esc(h.w)}»</b><span>${esc(h.t.q)}</span></div>`); });
    return rows.length ? `<div class="rqq-traps">${rows.join('')}</div>` : '';
  }

  // =====================================================================
  // Свойства хорошего требования (ISO/IEC/IEEE 29148)
  // =====================================================================
  const PROPS = [
    {
      id: 'nec', t: 'Необходимое', en: 'necessary', ic: '❗',
      plain: 'Если его вычеркнуть, кто-то пострадает: у требования есть хозяин и причина.',
      q: 'Что сломается, если это вычеркнуть? Кто об этом просил и зачем?',
      lera: 'А ради чего это? Если цели нет, мне нечего проверять, кроме «оно есть».',
      cake: { bad: 'Посыпать торт золотой пищевой пылью — у конкурентов так.', fail: 'Клиентка этого не просила. Лишние деньги и час работы кондитера — и никто не рад.', good: 'Надпись белым кремом «С юбилеем, мама» — клиентка попросила по телефону.', ok: 'У пункта есть хозяйка и причина: без надписи клиентка торт не примет.' },
      it: { bad: 'Планшет списаний показывает прогноз погоды на неделю.', fail: 'Никто не просил, к цели «меньше выбрасывать» не ведёт. Разработчики тратят дни на лишнее.', good: 'Кассир выбирает причину списания из списка: не продано, брак, истёк срок.', ok: 'Нине нужно видеть, почему выбрасываем, — иначе списания не снизить. Источник и цель понятны.' }
    },
    {
      id: 'amb', t: 'Однозначное', en: 'unambiguous', ic: '🎯',
      plain: 'Понять можно только одним способом — и заказчик, и разработчик, и тестировщик поймут одинаково.',
      q: 'Могут ли двое прочитать это по-разному? Какие слова каждый поймёт по-своему?',
      lera: '«Вечером» — это во сколько? Мне нужна граница: что можно в 20:59 и что в 21:01.',
      cake: { bad: 'Торт к выходным.', fail: 'Кондитер испёк к субботе, а клиентка ждала в воскресенье. Оба правы — по-своему.', good: 'Торт к субботе, 10 октября, 15:00, выдача на Покровке.', ok: 'Дату, время и место невозможно понять двумя способами.' },
      it: { bad: 'Списания вносят вечером.', fail: 'Один кассир вносит в 18:00, другой — после закрытия. Цифры за день не сходятся, а нарушителей нет.', good: 'Кассир вносит списания после закрытия пекарни, с 21:00 до 21:30.', ok: 'Есть точное окно. Лера проверит 20:59, 21:10 и 21:31.' }
    },
    {
      id: 'cmp', t: 'Полное', en: 'complete', ic: '🧾',
      plain: 'Всего хватает, чтобы сделать без звонка автору.',
      q: 'Чего не хватает, чтобы сделать это, ни у кого не переспрашивая?',
      lera: 'А что именно вносят? Если поля не названы, я не знаю, что проверять.',
      cake: { bad: 'Торт шоколадный, к субботе 15:00.', fail: 'На сколько человек? Какая надпись? Кондитер звонит клиентке в пятницу вечером — та не берёт трубку.', good: 'Торт шоколадный, 2 кг (на 12 человек), надпись «С юбилеем, мама», к субботе 15:00.', ok: 'Кондитеру хватает всего, чтобы испечь без звонка.' },
      it: { bad: 'Кассир вносит списание.', fail: 'Что вносит — товар, количество, причину? Разработчик придумает сам, Олег Петрович увидит не то.', good: 'Кассир вносит списание: товар из списка, количество в штуках, причина из списка.', ok: 'Названы все поля: можно рисовать экран и писать проверку.' }
    },
    {
      id: 'sgl', t: 'Единичное', en: 'singular · атомарное', ic: '🔹',
      plain: 'Одно требование — одна мысль. Его можно выполнить целиком, а не наполовину.',
      q: 'Есть ли тут «и», «а также», «ещё»? Можно ли выполнить половину и не знать, сделано ли?',
      lera: 'Отчёт сделали, а уведомление нет. Требование выполнено? Мне нужен отдельный тест на каждую часть.',
      cake: { bad: 'Торт шоколадный на 12 человек, ещё 24 капкейка и доставка домой к 15:00.', fail: 'Капкейки испекли, про доставку забыли. Заказ выполнен или нет? Спорить можно бесконечно.', good: 'Три строки в бланке: торт — одна, капкейки — вторая, доставка — третья. У каждой свой исполнитель и своя отметка «готово».', ok: 'Каждую строку можно отметить отдельно — видно, что сделано, а что нет.' },
      it: { bad: 'Кассир вносит списания, видит отчёт за месяц, а Нина Сергеевна получает уведомление.', fail: 'Сделали внесение и отчёт, уведомление — нет. Статус требования «наполовину»? Таких статусов не бывает.', good: 'Три требования: «Кассир вносит списание…», «Кассир видит отчёт за месяц…», «Нина получает уведомление…».', ok: 'У каждого свой статус, своя оценка и своя проверка.' }
    },
    {
      id: 'fea', t: 'Выполнимое', en: 'feasible', ic: '🛠',
      plain: 'Можно сделать в наших условиях: деньги, сроки, техника, люди, законы.',
      q: 'Хватит ли денег, времени, мощности? Не мешает ли закон или чужая система?',
      lera: 'Если это нельзя сделать, то и проверять будет нечего — только провал.',
      cake: { bad: 'Трёхъярусный торт на 60 человек — к сегодняшнему вечеру.', fail: 'Торты принимают минимум за 48 часов. Пообещали — сорвали, клиентка без торта на юбилее.', good: 'Трёхъярусный торт на 60 человек — к субботе: заказ принят в среду, больше чем за 48 часов.', ok: 'Цех успевает: срок не меньше 48 часов.' },
      it: { bad: 'Планшеты списаний работают во всех 9 пекарнях с завтрашнего утра.', fail: 'Планшетов ещё нет, программу не написали, кассиров не обучили. Обещание сорвано в первый же день.', good: 'Планшеты списаний сначала запускаем в 2 пилотных пекарнях; срок согласуем после оценки Димы.', ok: 'Срок опирается на оценку команды, а не на желание.' }
    },
    {
      id: 'ver', t: 'Проверяемое', en: 'verifiable', ic: '🧪',
      plain: 'Можно проверить и получить ответ «да» или «нет».',
      q: 'Как это проверит Лера? Какой тест даст «да» или «нет»?',
      lera: '«Быстро» — это сколько? 1 секунда? 10? Пока нет числа, я не напишу тест.',
      cake: { bad: 'Торт должен быть вкусным и красивым.', fail: 'Клиентке не понравилось: «некрасиво». Спорить не с чем — критерия нет.', good: 'Торт по фото-образцу клиентки: цвет крема и надпись как на фото, вес 2 кг ± 50 г.', ok: 'Сверить с фото и взвесить может кто угодно — ответ «да» или «нет».' },
      it: { bad: 'Планшет должен работать быстро.', fail: 'Лера: «Быстро — это сколько?» Дима: «У меня быстро». Нина: «А у меня тормозит». Все правы.', good: 'После нажатия «Сохранить» списание появляется в отчёте не позже чем через 2 секунды.', ok: 'Есть действие, условие и число: замерь — и получишь «да» или «нет».' }
    },
    {
      id: 'cor', t: 'Корректное', en: 'correct', ic: '✔',
      plain: 'Это правда: так и есть на самом деле и так хочет источник.',
      q: 'Это правда? Совпадает ли с тем, что сказал источник? Кто это подтвердит?',
      lera: 'Формулировка чистая, тест напишу. Только проверю я не то, что нужно бизнесу.',
      cake: { bad: 'Надпись «С юбилеем, папа».', fail: 'Однозначно, полно, проверяемо — и неверно: клиентка просила «маме». Торт идеальный, но не тот.', good: 'Надпись «С юбилеем, мама» — как в сообщении клиентки; сверили с ней по телефону.', ok: 'Сверено с источником — это правда.' },
      it: { bad: 'Списания пишут в журнал в 18:00.', fail: 'Сделали напоминание на 18:00, а пекарня открыта до 21:00 и ещё три часа продаёт. Списания неверные.', good: 'Списания вносят после закрытия, в 21:00, — как сказал Павел и как видели на смене.', ok: 'Подтверждено и словами, и наблюдением.' }
    }
  ];
  const propT = id => (PROPS.find(p => p.id === id) || { t: '—' }).t;
  const SOURCES = `<details class="more"><summary>Что говорят источники: списки у авторов разные</summary><div>
    ${ui.table(['Источник', 'Одно требование', 'Набор требований'], [
      ['<b>ISO/IEC/IEEE 29148:2018</b><br><span class="small dim">международный стандарт инженерии требований</span>', 'необходимое, уместное (на своём уровне, без лишних деталей решения), однозначное, полное, единичное, выполнимое, проверяемое, корректное, соответствующее принятому шаблону', 'полный, непротиворечивый, выполнимый, понятный, проверяемый на соответствие потребностям'],
      ['<b>Вигерс и Битти</b><br><span class="small dim">«Разработка требований к программному обеспечению», 3-е изд.</span>', 'полное, корректное, выполнимое, необходимое, с приоритетом, однозначное, проверяемое', 'полный, непротиворечивый, изменяемый, трассируемый'],
      ['<b>BABOK Guide v3</b><br><span class="small dim">свод знаний бизнес-анализа, IIBA</span>', 'атомарное, полное, краткое, выполнимое, однозначное, тестируемое, с приоритетом, понятное', 'непротиворечивый']
    ])}
    <p class="small muted">В редакции 29148 2011 года «трассируемое» стояло в списке свойств каждого требования; в редакции 2018 года о трассировке говорят отдельно — как о связях требования с источником и с тем, что из него выросло. Названия у авторов разные, а ядро одно: <b>понять одинаково, сделать, проверить, и чтобы это было правдой и нужным</b>. На собеседовании достаточно назвать 5–7 свойств и привести пример к каждому.</p>
  </div></details>`;

  // =====================================================================
  // Теория 1. Свойства хорошего требования
  // =====================================================================
  const howProps = {
    id: 'how-props', covers: ['defects'], title: 'Как это работает: свойства хорошего требования', free: true, noReset: true,
    simple: {
      icon: '🎂',
      plain: 'Хорошее требование нужно, понимается одним способом, полно, говорит об одном, выполнимо, проверяемо и правдиво.',
      analogy: 'Заказ торта: «шоколадный, 2 кг, надпись „С юбилеем, мама“, к субботе 15:00, Покровка». Уберите любую часть или напишите «к выходным» — торт будет не тот.',
      tech: '<b>ISO/IEC/IEEE 29148:2018</b> перечисляет свойства отдельного требования: необходимое, уместное, однозначное, полное, единичное, выполнимое, проверяемое, корректное, соответствующее шаблону. Здесь — семь главных для старта. У Вигерса и в BABOK v3 списки чуть другие, суть та же.'
    },
    lead: ui.brief({
      situation: 'Соседние примеры, не из задания: бланк заказа торта и будущий «планшет списаний», где кассир вносит, что не продали. На каждом — по семь свойств хорошего требования.',
      todo: [
        'Нажимайте свойства по очереди. Для каждого переключайте «❌ сломать / ✅ починить» и смотрите, что случится со сломанной формулировкой.',
        'Переключите «Пример»: бланк торта или планшет списаний. Где пекарня и ИТ ломаются одинаково?',
        'Обратите внимание на вопрос к себе и реплику Леры — их вы будете задавать каждый день.',
        'В конце откройте «Что говорят источники» — списки свойств у разных авторов отличаются.'
      ],
      look: 'Красный бланк — сломанная формулировка и её последствие. Зелёный — исправленная. Одно требование может нарушать сразу несколько свойств; в задании ищите главное — то, что ломает работу первым.'
    }),
    render(el) {
      el.classList.add('rqq-root');
      const st = { i: 0, lens: 'cake', state: 'bad', seen: new Set([0]) };
      el.innerHTML = `<div class="stack">
        <div class="row"><span class="small dim">Пример:</span>${ui.seg('lens', [{ v: 'cake', t: '🎂 бланк заказа торта' }, { v: 'it', t: '📋 планшет списаний' }], st.lens)}</div>
        <div class="rqq-props" data-props></div>
        <div data-card></div>
        <div class="row between"><button type="button" class="btn sm ghost" data-nav="-1">← Назад</button><span class="small dim" data-cnt></span><button type="button" class="btn sm" data-nav="1">Дальше →</button></div>
        ${SOURCES}
      </div>`;
      function drawProps() {
        TR.$('[data-props]', el).innerHTML = PROPS.map((p, i) => `<button type="button" class="rqq-pb ${st.seen.has(i) && i !== st.i ? 'seen' : ''}" data-i="${i}" aria-pressed="${i === st.i}"><span class="ic" aria-hidden="true">${p.ic}</span><span class="nm">${esc(p.t)}</span></button>`).join('');
        TR.$('[data-cnt]', el).textContent = `Просмотрено: ${st.seen.size} из ${PROPS.length}`;
      }
      function drawCard() {
        const p = PROPS[st.i], ex = p[st.lens], bad = st.state === 'bad';
        TR.$('[data-card]', el).innerHTML = `<div class="card">
          <div><div class="eyebrow">Свойство ${st.i + 1} из ${PROPS.length} · ${esc(p.en)}</div><h3 class="rqq-h3">${p.ic} ${esc(p.t)}</h3></div>
          <div><b>${esc(p.plain)}</b></div>
          <div class="rqq-q"><b>Вопрос к себе:</b> ${esc(p.q)}</div>
          <div class="row"><span class="small dim">Формулировка:</span>${ui.seg('state', [{ v: 'bad', t: '❌ сломать' }, { v: 'good', t: '✅ починить' }], st.state)}</div>
          <div class="rqq-blank ${bad ? 'bad' : 'ok'}"><span class="rqq-lbl">${st.lens === 'cake' ? 'Бланк заказа торта' : 'Требование к планшету списаний'}</span>${esc(bad ? ex.bad : ex.good)}</div>
          ${bad ? ui.note('bad', 'Что случится', esc(ex.fail)) : ui.note('ok', 'Почему теперь хорошо', esc(ex.ok))}
          ${bad ? ui.say('lera', esc(p.lera)) : ''}
        </div>`;
        TR.$('[data-nav="-1"]', el).disabled = st.i === 0;
        TR.$('[data-nav="1"]', el).disabled = st.i === PROPS.length - 1;
      }
      const go = i => { st.i = Math.max(0, Math.min(PROPS.length - 1, i)); st.seen.add(st.i); st.state = 'bad'; drawProps(); drawCard(); };
      TR.on(el, 'click', '[data-i]', (e, b) => go(+b.dataset.i));
      TR.on(el, 'click', '[data-nav]', (e, b) => go(st.i + (+b.dataset.nav)));
      ui.onSeg(el, (n, v) => { if (n === 'lens') { st.lens = v; drawCard(); } if (n === 'state') { st.state = v; drawCard(); } });
      drawProps(); drawCard();
    }
  };

  // =====================================================================
  // Теория 2. Слова-ловушки: лаборатория-подсветка, «как проверит Лера», формула фразы
  // =====================================================================
  const PRESETS = [
    'Планшет списаний должен работать быстро и быть удобным для кассиров.',
    'Отчёт по списаниям должен поддерживать выгрузку в Excel, PDF и т. д.',
    'По возможности планшет всегда напоминает кассиру о списаниях.',
    'Интерфейс планшета должен быть интуитивно понятным для всех сотрудников.',
    'Система оптимально рассчитывает, сколько хлеба испечь завтра.',
    'Кассир вносит списание после закрытия, с 21:00 до 21:30: товар из списка, количество в штуках, причина из списка.'
  ];
  const FLIPS = [
    { t: 'Кассир вносит списание после закрытия, с 21:00 до 21:30: товар, количество в штуках, причина из списка.', ok: true,
      a: 'Проверю так: в 21:10 вношу «Круассан, 4 шт., не продано» — запись есть в отчёте с причиной и временем. А в 21:40 пробую ещё раз — что должно случиться? Спрошу у аналитика: после 21:30 вносить можно?' },
    { t: 'Отчёт по списаниям должен быть понятным.', ok: false,
      a: 'Не проверю: «понятным» — для кого и по какому признаку? Предложу вариант: Нина Сергеевна находит списания круассанов за вчера на Покровке не дольше чем за 1 минуту без подсказки.' },
    { t: 'Отчёт открывается не дольше чем через 2 секунды после нажатия «Отчёт» — для 9 пекарен и данных за 30 дней.', ok: true,
      a: 'Проверю так: открываю отчёт 20 раз на данных за 30 дней, засекаю каждый. Уточню у аналитика: «не дольше 2 секунд» — в каждом случае или в среднем?' },
    { t: 'Напоминание о списаниях по возможности приходит вечером.', ok: false,
      a: 'Не проверю: «по возможности» — значит, можно и не делать? «Вечером» — это 21:00 или 21:30? Два вопроса — две дыры.' }
  ];
  const howTraps = {
    id: 'how-traps', covers: ['rewrite', 'why-words'], title: 'Как это работает: слова-ловушки и «как это проверит Лера?»', free: true, noReset: true,
    simple: {
      icon: '🔍',
      plain: 'Есть слова, которые каждый понимает по-своему: «быстро», «удобно», «и т. д.». В требовании они прячут несогласие, которое всплывёт на приёмке.',
      analogy: '«Испеките торт побольше и повкуснее» — кондитер и клиентка представят разные торты. «2 кг, шоколадный, без орехов» — один и тот же.',
      tech: 'Неоднозначные слова — частая причина непроверяемых требований. У Вигерса и Битти есть целая таблица слов, которых стоит избегать: «быстрый», «удобный», «поддерживать», «оптимизировать», «по возможности», «и т. д.». Лечение — заменить слово мерой: кто, что делает, при каком условии, насколько и как проверим. Похожий шаблон для продвинутых — EARS (Алистер Мавин и коллеги, 2009): «Когда <событие>, <система> должна <действие>».'
    },
    lead: ui.brief({
      situation: 'Соседний пример — требования к планшету списаний. Лаборатория подсвечивает слова-ловушки и задаёт к каждому вопрос-уточнение — тот, который на встрече задали бы вы.',
      todo: [
        'Вкладка «Подсветка»: выбирайте готовые фразы и смотрите, какие слова загораются. Потом напишите свою — например, из жизни вашей компании — и исправьте её, пока подсветка не погаснет.',
        'Вкладка «Как проверит Лера?»: нажмите на каждую карточку. Чем отличаются требования, которые Лера может проверить?',
        'Вкладка «Формула фразы»: переключите «до / после» и посмотрите, из каких частей складывается проверяемая фраза.'
      ],
      look: 'Красное — слово-ловушка: в требовании его нужно заменить мерой. Жёлтое — сомнительное: проверьте, правда ли вы это имели в виду («все», «несколько», «примерно»). Наведите курсор на слово — появится вопрос. Подсветка — подсказка, а не судья: она не понимает смысла, только слова.'
    }),
    render(el) {
      el.classList.add('rqq-root');
      const tb = document.createElement('div'); el.appendChild(tb);
      ui.tabs(tb, [
        { id: 'lab', t: 'Подсветка', render: drawLab },
        { id: 'lera', t: 'Как проверит Лера?', render: drawFlips },
        { id: 'formula', t: 'Формула фразы', render: drawFormula }
      ], 'lab');
    }
  };
  function drawLab(pane) {
    let txt = PRESETS[0];
    pane.innerHTML = `<div class="stack">
      <div class="small dim">Готовые фразы о планшете списаний:</div>
      <div class="row">${PRESETS.map((p, i) => `<button type="button" class="btn xs" data-pre="${i}" aria-pressed="${i === 0}">Фраза ${i + 1}</button>`).join('')}</div>
      <label class="field"><span>Фраза (можно изменить или написать свою)</span><textarea rows="3" data-in>${esc(txt)}</textarea></label>
      <div data-out></div>
    </div>`;
    const out = TR.$('[data-out]', pane);
    function draw() {
      const sc = scan(txt);
      const feats = [
        [sc.bad.length === 0, sc.bad.length ? `ловушек: ${sc.bad.length}` : 'нет слов-ловушек'],
        [sc.hasActor, 'кто действует'],
        [sc.hasNum, 'есть цифра'],
        [sc.hasCond, 'есть условие или граница'],
        [sc.modals <= 1, sc.modals > 1 ? `«должен» ×${sc.modals}: одна ли мысль?` : 'одна мысль']
      ];
      out.innerHTML = `<div class="stack">
        <div class="rqq-text">${sc.len ? markup(sc) : '<span class="dim">Пусто — напишите фразу.</span>'}</div>
        <div class="rqq-feats">${feats.map(([ok, t]) => chip((ok ? '✓ ' : '✕ ') + esc(t), ok ? 'ok' : 'bad')).join('')}${sc.warn.length ? chip('! сомнительных: ' + sc.warn.length, 'warn') : ''}</div>
        ${trapList(sc)}
        ${ui.say('lera', leraLine(sc))}
      </div>`;
    }
    TR.on(pane, 'click', '[data-pre]', (e, b) => {
      txt = PRESETS[+b.dataset.pre];
      TR.$$('[data-pre]', pane).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      TR.$('[data-in]', pane).value = txt; draw();
    });
    pane.addEventListener('input', e => { if (e.target.matches('[data-in]')) { txt = e.target.value; TR.$$('[data-pre]', pane).forEach(x => x.setAttribute('aria-pressed', 'false')); draw(); } });
    draw();
  }
  function drawFlips(pane) {
    const open = new Set();
    function draw() {
      pane.innerHTML = `<div class="stack">
        <div class="small muted">Лера читает требование и сразу думает: <b>что я делаю → что вижу → с чем сравниваю</b>. Если на это нет ответа, требование не готово. Нажмите на карточку.</div>
        <div class="rqq-flips">${FLIPS.map((f, i) => open.has(i)
          ? `<button type="button" class="rqq-flip" data-f="${i}" aria-pressed="true"><span class="rqq-lbl">Ответ Леры</span>${mini('lera', esc(f.a))}<span>${chip(f.ok ? '✓ можно проверить' : '✕ проверить нельзя', f.ok ? 'ok' : 'bad')}</span></button>`
          : `<button type="button" class="rqq-flip" data-f="${i}" aria-pressed="false"><span class="rqq-lbl">Требование ${i + 1}</span><span class="rq">${esc(f.t)}</span><span class="small dim">Нажмите — что ответит Лера?</span></button>`).join('')}</div>
        ${open.size === FLIPS.length ? ui.note('info', 'Заметили?', 'Даже у хорошего требования Лера находит вопросы на границах: «а в 21:40?», «в каждом случае или в среднем?». Это нормально: хорошая формулировка не снимает все вопросы, но делает их видимыми. Лучше, чтобы Лера задала их вам на ревью требований, чем разработчику после кода.') : ''}
      </div>`;
    }
    TR.on(pane, 'click', '[data-f]', (e, b) => { const i = +b.dataset.f; if (open.has(i)) open.delete(i); else open.add(i); draw(); });
    draw();
  }
  function drawFormula(pane) {
    let mode = 'after';
    pane.innerHTML = `<div class="stack">
      <div class="row"><span class="small dim">Показать:</span>${ui.seg('fm', [{ v: 'before', t: 'до' }, { v: 'after', t: 'после' }], mode, 'accent')}</div>
      <div data-fm></div>
    </div>`;
    function draw() {
      TR.$('[data-fm]', pane).innerHTML = mode === 'before'
        ? `<div class="stack"><div class="rqq-text">${markup(scan('Планшет должен работать быстро.'))}</div>${ui.say('lera', 'Быстро — это сколько? Что именно делает планшет? При каком условии я засекаю время?')}</div>`
        : `<div class="stack">
          <div class="rqq-formula">
            <span class="rqq-sg c1"><small>когда, при каком условии</small>После нажатия «Сохранить»</span>
            <span class="rqq-sg c2"><small>кто или что</small>планшет</span>
            <span class="rqq-sg c3"><small>что делает</small>показывает списание в отчёте</span>
            <span class="rqq-sg c4"><small>насколько, мера</small>не позже чем через 2 секунды</span>
            <span class="rqq-sg c5"><small>как проверим</small>замер на 20 списаниях подряд</span>
          </div>
          ${ui.say('lera', 'Вот это я проверю: нажимаю «Сохранить» 20 раз, засекаю, сравниваю с 2 секундами.')}
          <div class="small muted">Не каждая фраза требует всех пяти частей: «Кассир выбирает причину из списка: не продано, брак, истёк срок» проверяема и без секунд. Но если в фразе есть оценочное слово — «быстро», «удобно», «надёжно», — его почти всегда нужно заменить мерой. А саму меру (2 секунды или 5) <b>предлагает аналитик, а решает заказчик</b>.</div>
        </div>`;
    }
    ui.onSeg(pane, (n, v) => { if (n === 'fm') { mode = v; draw(); } });
    draw();
  }

  // =====================================================================
  // Теория 3. Набор требований: противоречия, пробелы, трассируемость
  // =====================================================================
  const SET0 = [
    { id: 'S1', t: 'Списания вносит только управляющий пекарней.', src: 'Олег Петрович, встреча', fix: 'Управляющий утром видит вчерашние списания своей пекарни.' },
    { id: 'S2', t: 'Кассир вносит списания после закрытия, с 21:00 до 21:30.', src: 'Павел, смена на Покровке' },
    { id: 'S3', t: 'Списание: товар из списка, количество в штуках, причина из списка — не продано, брак, истёк срок.', src: 'Павел и Галина Ивановна' },
    { id: 'S4', t: 'Нина Сергеевна каждое утро видит отчёт: списания по пекарням за вчера в штуках и рублях.', src: 'Нина Сергеевна, интервью' },
    { id: 'S5', t: 'Планшет показывает прогноз погоды на неделю.', src: null },
    { id: 'S6', t: 'Если нет связи, планшет сохраняет списания и досылает их, когда связь появится.', src: 'Павел: «модем отваливается»' }
  ];
  const GAPS = [
    { id: 'S7', q: 'А если кассир ошибся — внёс 40 круассанов вместо 4?', t: 'Кассир может исправить своё списание до 09:00 следующего дня; в отчёте видно, что запись исправлена.', src: 'вопрос аналитика, ответ Павла' },
    { id: 'S8', q: 'А если кассир забыл внести списания?', t: 'В 21:30 планшет напоминает кассиру, если за смену не внесено ни одного списания.', src: 'вопрос аналитика, ответ Павла' }
  ];
  const howSet = {
    id: 'how-set', covers: ['conflicts'], title: 'Как это работает: хороший набор требований', free: true, noReset: true,
    simple: {
      icon: '🧩',
      plain: 'Требования проверяют не только по одному, но и вместе: не спорят ли они друг с другом, всё ли учли, у каждого ли есть источник.',
      analogy: 'Меню банкета: каждое блюдо по отдельности хорошее, но «всё без сахара» и «торт-безе» вместе не выйдут, а про напитки забыли совсем.',
      tech: 'Свойства <b>набора</b> требований: <b>непротиворечивость</b> (нет взаимоисключающих), <b>полнота</b> (учтены нужные случаи — насколько мы их знаем), <b>трассируемость</b> (у каждого требования есть источник и связь с целью). ISO/IEC/IEEE 29148:2018 и Вигерс называют их отдельно от свойств одного требования.'
    },
    lead: ui.brief({
      situation: 'Снова соседний пример — шесть требований к планшету списаний. Каждое по отдельности выглядит прилично. Посмотрим на них вместе, тремя «линзами».',
      todo: [
        'Линза «Противоречия»: найдите пару, которую нельзя выполнить одновременно, и разрешите её.',
        'Линза «Пробелы»: задайте вопросы «а если…» и допишите недостающие требования.',
        'Линза «Источники»: найдите требование без источника и выясните, откуда оно взялось.',
        'Счётчики сверху должны дойти до нуля.'
      ],
      look: 'Аналитик не решает противоречие сам: он находит его и несёт людям, у которых разные интересы. Пробелы находятся вопросами «а если…». Требование без источника — сирота: его не у кого уточнить и непонятно, зачем делать.'
    }),
    render(el) {
      el.classList.add('rqq-root');
      const st = { lens: 'conf', fixed: false, added: new Set(), asked: false, removed: false };
      el.innerHTML = `<div class="stack">
        <div data-bar></div>
        <div class="row"><span class="small dim">Линза:</span>${ui.seg('lens', [{ v: 'conf', t: '⚡ Противоречия' }, { v: 'gaps', t: '❓ Пробелы' }, { v: 'trace', t: '🔗 Источники' }], st.lens, 'accent')}</div>
        <div data-body></div>
      </div>`;
      function list() {
        const L = SET0.filter(s => !(s.id === 'S5' && st.removed)).map(s => Object.assign({}, s, s.id === 'S1' && st.fixed ? { t: s.fix, src: 'Павел и Нина Сергеевна, уточнение', fixed: true } : {}));
        GAPS.forEach(g => { if (st.added.has(g.id)) L.push({ id: g.id, t: g.t, src: g.src, isNew: true }); });
        return L;
      }
      function drawBar() {
        const c = st.fixed ? 0 : 1, g = GAPS.length - st.added.size, o = st.removed ? 0 : 1;
        TR.$('[data-bar]', el).innerHTML = `<div class="rqq-setbar">
          <div class="stat"><span class="k">Противоречий</span><span class="v ${c ? 'bad' : 'ok'}">${c}</span><span class="s">непротиворечивость</span></div>
          <div class="stat"><span class="k">Пробелов</span><span class="v ${g ? 'warn' : 'ok'}">${g}</span><span class="s">полнота</span></div>
          <div class="stat"><span class="k">Без источника</span><span class="v ${o ? 'bad' : 'ok'}">${o}</span><span class="s">трассируемость</span></div>
        </div>${!c && !g && !o ? `<div style="margin-top:8px">${ui.note('ok', 'Набор в порядке', 'Набор непротиворечив, полон настолько, насколько мы сейчас знаем, и у каждого требования есть источник. Заметьте: ни одно требование по отдельности не было «плохим» — дефекты жили между ними.')}</div>` : ''}`;
      }
      function row(s, cls, meta) { return `<div class="rqq-sr ${cls || ''}"><span class="id">${esc(s.id)}</span><div>${esc(s.t)}</div>${meta ? `<div class="meta">${meta}</div>` : ''}</div>`; }
      function drawBody() {
        const L = list(), body = TR.$('[data-body]', el);
        if (st.lens === 'conf') {
          body.innerHTML = `<div class="stack"><div class="rqq-set">${L.map(s => {
            const hot = !st.fixed && (s.id === 'S1' || s.id === 'S2');
            return row(s, hot ? 'bad' : s.fixed ? 'new' : '', hot ? chip('⚡ спорит с ' + (s.id === 'S1' ? 'S2' : 'S1'), 'bad') : s.fixed ? chip('исправлено после уточнения', 'ok') : '');
          }).join('')}</div>
          ${st.fixed ? ui.say('pavel', 'Вносит кассир — он закрывает смену. Я утром только смотрю, что вчера списали, и если что — разбираюсь.') + ui.note('ok', 'Противоречие снято', 'Аналитик не выбирал «правильного» сам: спросил тех, кто знает, как на самом деле, и записал одно правило. Олег Петрович, от которого пришло S1, тоже должен увидеть исправление — иначе он будет ждать другого.')
            : `${ui.note('bad', 'S1 и S2 нельзя выполнить вместе', 'Каждое однозначно и проверяемо. Но если вносит <i>только</i> управляющий, кассир вносить не может, — а S2 говорит обратное. Разработчик выберет наугад, Лера найдёт «баг» в любом варианте.')}
              <div class="row"><button type="button" class="btn sm primary" data-act="fix">Разрешить: спросить Павла и Нину Сергеевну</button></div>`}</div>`;
        } else if (st.lens === 'gaps') {
          body.innerHTML = `<div class="stack"><div class="rqq-set">${L.map(s => row(s, s.isNew ? 'new' : '', s.isNew ? chip('новое', 'ok') : '')).join('')}
            ${GAPS.filter(g => !st.added.has(g.id)).map(g => `<div class="rqq-sr ghost"><span class="id">?</span><div><b>${esc(g.q)}</b><div class="small">В наборе ответа нет. Что сделает система?</div></div><div class="meta"><button type="button" class="btn xs" data-gap="${g.id}">Спросить и дописать</button></div></div>`).join('')}</div>
            ${st.added.size === GAPS.length ? ui.note('ok', 'Пробелы закрыты', 'Полноту набора проверяют вопросами «а если…»: ошибся, забыл, нет связи, двое одновременно, ноль, отмена. Совсем полного набора не бывает — но каждый такой вопрос, заданный до кода, дешевле того же вопроса от Леры после.') : ui.note('warn', 'Полнота', 'Каждое требование полное, а набор — нет: в нём нет ответа на неудобные вопросы. Разработчик ответит на них сам — как сумеет.')}</div>`;
        } else {
          body.innerHTML = `<div class="stack"><div class="rqq-set">${L.map(s => {
            const orphan = s.id === 'S5';
            const meta = orphan
              ? chip('источник: ?', 'bad') + chip('цель: ?', 'bad') + (st.asked ? '' : `<button type="button" class="btn xs" data-act="ask">Спросить, откуда</button>`)
              : chip('источник: ' + esc(s.src), 'info') + chip('цель: БЦ-1 — меньше списаний', '');
            return row(s, orphan ? 'bad' : '', meta);
          }).join('')}</div>
          ${!st.removed && st.asked ? ui.say('dima', 'Это я добавил: видел в одном приложении, красиво смотрится. Никто не просил, если честно.') + `<div class="row"><button type="button" class="btn sm primary" data-act="drop">Убрать из набора (записать причину)</button></div>` : ''}
          ${st.removed ? ui.note('ok', 'Сирота найден', 'У каждого оставшегося требования есть источник и цель. Убранное не стирают молча: записывают «отклонено: нет источника и цели», чтобы через месяц не добавить снова. Подробно про статусы и связи — завтра, в тренировке «Жизнь требования».') : !st.asked ? ui.note('info', 'Трассируемость', 'У каждого требования должен быть ответ на два вопроса: <b>откуда оно</b> (кто сказал, где видели) и <b>зачем</b> (к какой цели ведёт). Найдите то, у которого ответа нет.') : ''}</div>`;
        }
      }
      TR.on(el, 'click', '[data-act]', (e, b) => {
        const a = b.dataset.act;
        if (a === 'fix') st.fixed = true;
        if (a === 'ask') st.asked = true;
        if (a === 'drop') st.removed = true;
        drawBar(); drawBody();
      });
      TR.on(el, 'click', '[data-gap]', (e, b) => { st.added.add(b.dataset.gap); drawBar(); drawBody(); });
      ui.onSeg(el, (n, v) => { if (n === 'lens') { st.lens = v; drawBody(); } });
      drawBar(); drawBody();
    }
  };

  // =====================================================================
  // Практика 1. Найдите дефект: какое свойство нарушено
  // =====================================================================
  const DEF = [
    { id: 'd1', t: 'Заказ на завтра принимается до вечера.', src: 'черновик после звонка Нины', ok: ['amb'], alt: ['ver'],
      hint: 'Представьте двух людей, которые читают это слово. Совпадёт ли у них время?', lera: 'До какого времени? Заказ в 22:31 — принять или нет?' },
    { id: 'd2', t: 'Приложение должно быстро показывать меню пекарни.', src: 'черновик после звонка Нины', ok: ['ver'], alt: ['amb'],
      hint: 'Какой тест даст ответ «да» или «нет»? С чем Лера сравнит результат?', lera: 'Быстро — это сколько секунд? При скольких покупателях одновременно?' },
    { id: 'd3', t: 'Покупатель заказывает торт, оплачивает предоплату 50 %, получает SMS о готовности, а кондитер видит фото-образец на планшете.', src: 'заметки Риты', ok: ['sgl'],
      hint: 'Посчитайте, сколько здесь разных действий разных людей. Что, если сделали всё, кроме одного?', lera: 'SMS не пришла, а всё остальное работает — требование выполнено? Мне нужен отдельный тест на каждую часть.' },
    { id: 'd4', t: 'При заказе торта покупатель указывает дату выдачи.', src: 'черновик стажёра', ok: ['cmp'],
      hint: 'Хватит ли кондитеру одной даты, чтобы испечь нужный торт? Что сейчас путают в тетради?', lera: 'А надпись, начинка, вес, фото-образец? Именно их сейчас путают в тетради.' },
    { id: 'd5', t: 'Приложение само по фотографии витрины считает остатки всех 120 позиций без единой ошибки.', src: 'идея с совещания', ok: ['fea'],
      hint: 'Подумайте о бюджете первого года, сроках и о том, умеет ли такое техника без ошибок.', lera: 'Если это не сделать за 6 млн ₽ к 1 марта — мне и проверять будет нечего.' },
    { id: 'd6', t: 'В приложении играет фоновая музыка, как в кофейне.', src: 'идея из чата проекта', ok: ['nec'],
      hint: 'Кто из заинтересованных об этом просил? К какой цели «Колоса» это ведёт?', lera: 'Кто это просил и какую цель «Колоса» это двигает? Проверить, что музыка играет, я могу, — но зачем?' },
    { id: 'd7', t: 'Заказ на завтра принимается до 23:00, потому что в 23:00 технолог фиксирует план выпечки.', src: 'черновик стажёра', ok: ['cor'],
      hint: 'Формулировка чистая и проверяемая. Сверьте её с источником: что будет с заказом в 22:59, если в 23:00 план уже фиксируют?', lera: 'Тест напишу — но правило не то: у Галины Ивановны приём до 22:30, иначе заказ не успеет в план.' },
    { id: 'd8', t: 'Покупатель может отменить заказ бесплатно заранее.', src: 'черновик после звонка Нины', ok: ['amb'], alt: ['ver'],
      hint: 'Одно слово здесь каждый поймёт по-своему. Какое?', lera: 'Заранее — это за сколько? За сутки? За час? Без границы я не проверю отмену в последнюю минуту.' },
    { id: 'd9', t: 'Экран кассира должен быть удобным для новых сотрудников.', src: 'пожелание Павла', ok: ['ver'], alt: ['amb'],
      hint: 'Как измерить «удобно»? Что Лера сделает, чтобы получить «да» или «нет»?', lera: 'Удобным — как я это измерю? Новый кассир справляется с выдачей заказа без подсказки — за сколько минут обучения?' }
  ];
  const defGood = (d, v) => d.ok.includes(v) || (d.alt || []).includes(v);
  const defectsTask = {
    id: 'defects', title: 'Найдите дефект: какое свойство нарушено',
    simple: howProps.simple,
    lead: ui.brief({
      situation: 'Стажёр «Квант Софт» набросал черновик требований «Колоса» после звонков и совещаний. Ксения просит пройтись по нему до ревью с Димой и Лерой: каждое из 9 требований нарушает одно из свойств хорошего требования.',
      todo: [
        'Прочитайте требование и выберите в списке главное нарушенное свойство: то, которое ломает работу первым.',
        'Перед выбором задайте себе вопрос Леры: «как я это проверю?» — и вопрос к себе из теории.',
        'Нажмите «Проверить». Засчитывается от 7 верных из 9. Где разумны два ответа, засчитываются оба.'
      ],
      look: 'Подсказка: однозначность и проверяемость часто ходят парой — неоднозначное обычно и не проверить. Но корректное требование может быть идеально сформулированным и при этом неверным: его проверяют сверкой с источником, а не чтением.'
    }),
    blank: () => ({ m: {} }),
    reference: () => ({ m: Object.fromEntries(DEF.map(d => [d.id, d.ok[0]])) }),
    render(el, ctx) {
      el.classList.add('rqq-root');
      const a = ctx.ans; a.m = a.m || {};
      let reveal = null;
      if (ctx.readonly) reveal = Object.fromEntries(DEF.map(d => [d.id, { s: 'ok', why: `<b>${esc(propT(d.ok[0]))}</b>${d.alt && d.alt.length ? ` (засчитывается и «${esc(propT(d.alt[0]))}»)` : ''}. Лера: «${esc(d.lera)}»` }]));
      else if (ctx.result) reveal = Object.fromEntries(DEF.map(d => {
        const v = a.m[d.id];
        if (!v) return [d.id, { s: 'warn', why: 'Не выбрано. ' + esc(d.hint) }];
        return [d.id, defGood(d, v) ? { s: 'ok', why: 'Лера: «' + esc(d.lera) + '»' } : { s: 'bad', why: esc(d.hint) }];
      }));
      const box = document.createElement('div'); el.appendChild(box);
      ui.match(box, {
        rows: DEF.map((d, i) => ({ id: d.id, t: `<span class="dim tnum">${i + 1}.</span> ${esc(d.t)}`, sub: 'откуда: ' + esc(d.src) })),
        choices: PROPS.map(p => ({ v: p.id, t: p.t })), value: a.m, reveal, readonly: ctx.readonly, placeholder: 'Что нарушено?',
        onChange: v => { a.m = v; ctx.save(); }
      });
    },
    check(ans) {
      const m = (ans && ans.m) || {};
      const ev = DEF.map(d => ({ d, v: m[d.id], ok: !!m[d.id] && defGood(d, m[d.id]) }));
      const good = ev.filter(x => x.ok).length, empty = ev.filter(x => !x.v).length;
      const notes = [];
      ev.filter(x => !x.ok && x.v).slice(0, 5).forEach(x => notes.push({ ok: false, html: `«${esc(x.d.t)}» — не «${esc(propT(x.v))}». ${esc(x.d.hint)}` }));
      if (empty) notes.push({ ok: 'warn', html: `Не выбрано: ${empty} из ${DEF.length}.` });
      const altUsed = ev.filter(x => x.ok && x.d.alt && x.d.alt.includes(x.v));
      if (altUsed.length) notes.push({ ok: 'info', html: `Засчитано и «${esc(propT(altUsed[0].v))}» в «${esc(altUsed[0].d.t)}»: неоднозначное обычно и непроверяемо. Но лечится оно уточнением слова — подумайте, какое свойство ломается первым.` });
      if (good === DEF.length) notes.push({ ok: true, html: 'Все девять дефектов найдены.' });
      const wrongCor = ev.find(x => x.d.id === 'd7' && x.v && !x.ok);
      return {
        ok: good >= 7, score: good / DEF.length, notes,
        summary: `Верно: ${good} из ${DEF.length}.`,
        mentor: good >= 7 ? null : wrongCor ? 'Посмотрите на требование про 23:00 ещё раз: читается оно безупречно. Тогда что с ним может быть не так? Сверьте его с тем, что говорит источник правила — Галина Ивановна.' : 'Для каждой строки задайте вопрос Леры: «как я это проверю?». Если проверить можно, но что-то всё равно не так — ищите дальше: нужно ли это, хватит ли данных, одна ли тут мысль, правда ли это.'
      };
    },
    explain: `<p>Чаще всего в живых требованиях ломаются <b>однозначность</b> и <b>проверяемость</b>: «до вечера», «заранее», «быстро», «удобно». Их лечат одинаково — заменяют слово границей или мерой: до 22:30, не позже чем за 2 часа до начала интервала, 1 секунда, 3 минуты.</p>
      <ul class="checks">
        <li><b>Единичное</b>: заказ торта, предоплата, SMS и планшет кондитера — четыре требования, у каждого свой тест и свой статус.</li>
        <li><b>Полное</b>: дата без надписи, начинки, веса и фото — ровно то, из-за чего «Колос» теряет 2–3 торта в неделю.</li>
        <li><b>Выполнимое</b>: распознавание 120 позиций по фото без ошибок не уложится в бюджет первого года и сроки.</li>
        <li><b>Необходимое</b>: у фоновой музыки нет хозяина и цели. Её не «запрещают» — её спрашивают: кто просил и зачем.</li>
        <li><b>Корректное</b>: «до 23:00» читается безупречно, но противоречит правилу Галины Ивановны — 22:30. Такие ошибки ловит не чтение, а сверка с источником.</li>
      </ul>
      <p>Источники: ISO/IEC/IEEE 29148:2018 — свойства отдельного требования; Вигерс и Битти, «Разработка требований к программному обеспечению», глава о том, как писать отличные требования; BABOK v3 — характеристики качества требований.</p>`,
    report: ans => DEF.map((d, i) => { const v = ((ans && ans.m) || {})[d.id]; return `${i + 1}. ${d.t} — ${v ? propT(v) : '—'}${v && defGood(d, v) ? ' ✓' : ' ✗'}`; }).join('\n')
  };

  // =====================================================================
  // Практика 2. Живой редактор: переписать пункты письма Нины
  // =====================================================================
  const has = re => tx => re.test(tx);
  const REW = [
    { id: 'r1', n: 'п. 1', was: 'Приложение как у Додо, чтобы было красиво…', focus: '«как у Додо» и «красиво»',
      ph: 'Какую задачу покупателя решает «как у Додо»? Чем измерить? Или с каким согласованным образцом сравнить?',
      feats: [
        { id: 'clean', t: 'нет слов-ловушек', req: true },
        { id: 'who', t: 'кто или что: покупатель, экран, макет', req: true, fn: has(/(покупател|клиент|пользовател|экран|макет|приложени)/i), hint: 'Чьё это требование: кто действует или что сравниваем?' },
        { id: 'measure', t: 'мера: цифра или согласованный образец', req: true, fn: tx => /\d/.test(tx) || (/макет/i.test(tx) && /(согласов|утвержд)/i.test(tx)), hint: 'С чем Лера сравнит результат: число (минуты, шаги) или согласованный с Ниной образец?' },
        { id: 'check', t: 'как проверим', req: false, fn: has(/(провер|тест|наблюд|замер|сравн|на \d+)/i), hint: 'Подскажите Лере, как проверять: на ком, сколько раз.' }
      ],
      ref: 'Новый покупатель оформляет первый предзаказ на завтра без подсказки не дольше чем за 3 минуты и не больше чем за 5 шагов. Проверяем до пилота на 10 покупателях пекарни на Покровке.' },
    { id: 'r2', n: 'п. 1', was: '…и быстро.', focus: '«быстро»',
      ph: 'Что именно должно быть быстрым? Сколько секунд? При какой нагрузке?',
      feats: [
        { id: 'clean', t: 'нет слов-ловушек', req: true },
        { id: 'what', t: 'что именно быстро: ответ, экран, оформление', req: true, fn: has(/(ответ|экран|страниц|меню|оформлени|оплат|загруз|открыва|поиск|показ)/i), hint: 'Что именно засекаем: открытие меню, ответ на нажатие, оформление заказа?' },
        { id: 'time', t: 'время с единицей: с, мс', req: true, fn: has(/\d+(?:[.,]\d+)?\s*(?:с(?![а-яё])|сек|секунд|мс|миллисекунд)/i), hint: 'Нужна цифра с единицей времени: сколько секунд?' },
        { id: 'load', t: 'при какой нагрузке', req: true, fn: has(/(в\s+час|в\s+минуту|в\s+секунду|одновременн|пик|нагрузк|\d+\s*(?:заказ|предзаказ|покупател|пользовател|запрос))/i), hint: 'Одному покупателю ночью любое приложение отвечает быстро. А в утренний пик?' },
        { id: 'share', t: 'доля случаев, например 95 %', req: false, fn: has(/(\d+(?:[.,]\d+)?\s*%|процент|\d+\s+из\s+\d+)/i), hint: 'Всегда ли — или в 95 % случаев? Без доли один медленный ответ провалит тест.' }
      ],
      ref: '95 % ответов приложения покупателю приходят быстрее чем за 1 секунду при нагрузке до 400 предзаказов в час.' },
    { id: 'r3', n: 'п. 3', was: 'Оплата картой.', focus: 'кто, чем, что дальше',
      ph: 'Кто платит, когда, какими способами, что получается после оплаты?',
      feats: [
        { id: 'clean', t: 'нет слов-ловушек', req: true },
        { id: 'who', t: 'кто платит', req: true, fn: has(/(покупател|клиент)/i), hint: 'Кто совершает действие?' },
        { id: 'card', t: 'карта', req: true, fn: has(/карт/i), hint: 'Сам способ из письма потерялся.' },
        { id: 'sbp', t: 'все способы онлайн-оплаты первой версии', req: true, fn: has(/(сбп|быстрых\s+платеж)/i), hint: 'Только картой? Перечитайте, какие способы онлайн-оплаты входят в первую версию.' },
        { id: 'result', t: 'что после оплаты: статус, чек', req: true, fn: has(/(статус|оплачен|чек|подтвержд|код заказа)/i), hint: 'Как Лера поймёт, что оплата прошла? Что меняется в заказе, что получает покупатель?' },
        { id: 'single', t: 'одна мысль', req: true, fn: tx => !/(налич|при\s+получении|на\s+месте)/i.test(tx) || /отдельн/i.test(tx), hint: 'Оплата при получении тоже нужна, но у неё другой сценарий и другой чек — это отдельное требование.' },
        { id: 'law', t: 'чек по 54-ФЗ', req: false, fn: has(/(54|предоплат)/i), hint: 'По закону при оплате заранее нужен особый чек — не забудьте о нём.' }
      ],
      ref: 'Покупатель оплачивает предзаказ при оформлении банковской картой или через СБП; после успешной оплаты заказ получает статус «Оплачен», а через «КассаПро» пробивается чек «предоплата» по 54-ФЗ.' },
    { id: 'r4', n: 'п. 9', was: 'Всё должно работать всегда и без сбоев.', focus: '«всё», «всегда», «без сбоев»',
      ph: 'Что именно должно быть доступно? Какую долю времени или сколько часов простоя за какой период допустим?',
      feats: [
        { id: 'clean', t: 'нет слов-ловушек', req: true },
        { id: 'what', t: 'что именно доступно', req: true, fn: has(/(при[её]м\s+заказ|оформлени|приложени|заказ|оплат|экран|касс|сайт)/i), hint: '«Всё» — это что? Приём заказов? Экран кассира? Выгрузка в 1С?' },
        { id: 'level', t: 'доля времени или часы простоя', req: true, fn: tx => /\d+(?:[.,]\d+)?\s*%/.test(tx) || /\d+(?:[.,]\d+)?\s*(?:ч(?![а-яё])|час|минут)/i.test(tx), hint: '100 % не бывает ни у кого. Какой процент времени или сколько часов простоя допустимо?' },
        { id: 'period', t: 'за какой период', req: true, fn: has(/(месяц|недел|год|сутк|квартал)/i), hint: '99 % в день и 99 % в год — очень разные обещания. За какой период считаем?' },
        { id: 'window', t: 'окно обслуживания', req: false, fn: has(/(обслуживан|плановы|01:00|1:00|окн)/i), hint: 'Когда систему можно останавливать для обновлений?' }
      ],
      ref: 'Приём заказов в приложении доступен не менее 99,5 % времени в месяц — не больше 3,6 часа простоя; плановые работы — только с 01:00 до 02:30.' },
    { id: 'r5', n: 'п. 10', was: 'Удобно для бабушек.', focus: '«удобно» и «бабушки»',
      ph: 'Кто именно (возраст, опыт)? Какую задачу решает? За сколько минут или шагов? Как проверим?',
      feats: [
        { id: 'clean', t: 'нет слов-ловушек', req: true },
        { id: 'who', t: 'кто именно: возраст, опыт', req: true, fn: has(/(55|60|65|70|пожил|старш|без\s+смартфон|пенсион|возраст|бабушк)/i), hint: 'Кто эти люди? Возраст, опыт со смартфоном?' },
        { id: 'task', t: 'какую задачу решает', req: true, fn: has(/(оформ|заказ|оплат|выбира|наход|забира)/i), hint: 'Удобно — делать что? Оформить предзаказ? Найти свой заказ?' },
        { id: 'measure', t: 'цифра: минуты, шаги, доля', req: true, fn: has(/\d/), hint: 'Чем измерить «удобно»: минуты, шаги, доля тех, кто справился сам?' },
        { id: 'check', t: 'как проверим', req: false, fn: has(/(провер|тест|наблюд|замер|на \d+|из \d+)/i), hint: 'На ком и как проверить до пилота?' }
      ],
      ref: 'Покупатель старше 55 лет, который раньше не заказывал в приложениях, оформляет предзаказ на завтра без посторонней помощи не дольше чем за 5 минут. Проверяем до пилота на 5 постоянных покупательницах.' }
  ];
  function evalRW(item, text) {
    const tx = String(text || ''), sc = scan(tx);
    const changed = sc.len >= 25 && TR.norm(tx) !== TR.norm(item.was);
    const res = item.feats.map(f => ({ f, ok: changed && (f.id === 'clean' ? sc.bad.length === 0 : !!f.fn(tx, sc)) }));
    const w = r => r.f.req ? 1 : 0.5, tot = res.reduce((s, r) => s + w(r), 0);
    const score = changed ? res.reduce((s, r) => s + (r.ok ? w(r) : 0), 0) / tot : 0;
    return { sc, res, changed, score, pass: changed && res.every(r => !r.f.req || r.ok) };
  }
  function rwLive(item, text) {
    const ev = evalRW(item, text), sc = ev.sc;
    const chips = ev.res.map(r => chip((r.ok ? '✓ ' : r.f.req ? '✕ ' : '○ ') + esc(r.f.t) + (r.f.req ? '' : ' (бонус)'), r.ok ? 'ok' : r.f.req && ev.changed ? 'bad' : 'rqq-o')).join('');
    let lera;
    if (!sc.len) lera = 'Жду вашу формулировку.';
    else if (!ev.changed) lera = sc.len < 25 ? 'Пока коротко — допишите: кто, что, насколько.' : 'Это то же самое, что в письме.';
    else if (sc.bad.length) lera = leraLine(sc);
    else { const miss = ev.res.find(r => r.f.req && !r.ok); lera = miss ? esc(miss.f.hint) : 'Это я проверю. ' + (ev.res.some(r => !r.f.req && !r.ok) ? esc(ev.res.find(r => !r.f.req && !r.ok).f.hint) : 'Тест напишу по цифрам и условиям из фразы.'); }
    return { ev, html: `<div class="stack tight">${sc.hits.length && ev.changed ? `<div class="rqq-text" style="font-size:14px;padding:8px 12px">${markup(sc)}</div>` : ''}<div class="rqq-feats">${chips}</div>${mini('lera', lera)}</div>` };
  }
  const rewriteTask = {
    id: 'rewrite', title: 'Переписать письмо Нины: живой редактор',
    simple: howTraps.simple,
    lead: ui.brief({
      situation: 'Письмо-«ТЗ» Нины Сергеевны уже разобрано по смыслу. Теперь Дима и Лера просят перевести пять самых размытых мест в требования, которые можно оценить и проверить. Вы пишете черновик — цифры потом согласуете с Ниной.',
      todo: [
        'Для каждого из пяти мест письма напишите в поле «Стало» одно проверяемое требование.',
        'Под полем — признаки, по которым проверяет редактор, и реплика Леры. Они меняются, пока вы пишете: добивайтесь, чтобы все обязательные признаки стали зелёными.',
        'Нажмите «Проверить». Засчитывается, если хотя бы 4 из 5 формулировок проходят все обязательные признаки и общий балл от 80 %.'
      ],
      lookTitle: 'На что опереться',
      look: 'Договорённости «Колоса»: через год — до 1 200 предзаказов в день и до 400 в час в утренний пик; в первую версию входит онлайн-оплата картой и СБП при оформлении и оплата при получении; по 54-ФЗ при предоплате пробивается чек «предоплата»; ночью с 01:00 до 02:30 систему можно обслуживать; 40 % постоянных клиентов старше 55 лет. Где цифры нет — предложите свою: её утвердит Нина. Редактор проверяет признаки, а не смысл, — перечитайте свою фразу глазами Леры.'
    }),
    blank: () => ({ t: {} }),
    reference: () => ({ t: Object.fromEntries(REW.map(r => [r.id, r.ref])) }),
    render(el, ctx) {
      el.classList.add('rqq-root');
      const a = ctx.ans; a.t = a.t || {};
      el.innerHTML = `<div class="stack">
        <div class="rqq-letter"><span class="rqq-lbl">Из письма Нины Сергеевны</span>${['1. Приложение как у Додо, чтобы было красиво и быстро.', '3. Оплата картой.', '9. Всё должно работать всегда и без сбоев.', '10. Удобно для бабушек.'].map(x => `<div>${markup(scan(x))}</div>`).join('')}</div>
        ${REW.map((r, i) => `<div class="rqq-rw" data-rw="${r.id}">
          <h4>${i + 1}. ${esc(r.n)}: ${esc(r.focus)}</h4>
          <div class="rqq-was"><span class="rqq-lbl">Было</span>${markup(scan(r.was))}</div>
          <label class="field"><span>Стало — ваше требование</span><textarea rows="3" data-tx="${r.id}" placeholder="${esc(r.ph)}" ${ctx.readonly ? 'readonly' : ''}>${esc(a.t[r.id] || '')}</textarea></label>
          <div data-live="${r.id}"></div>
        </div>`).join('')}
      </div>`;
      const paint = id => {
        const r = REW.find(x => x.id === id), box = TR.$(`[data-rw="${id}"]`, el), lv = rwLive(r, a.t[id]);
        TR.$(`[data-live="${id}"]`, el).innerHTML = lv.html;
        box.classList.remove('ok', 'bad', 'warn');
        if (ctx.result || ctx.readonly) box.classList.add(lv.ev.pass ? 'ok' : lv.ev.changed ? 'warn' : 'bad');
      };
      REW.forEach(r => paint(r.id));
      if (ctx.readonly) return;
      el.addEventListener('input', e => {
        const ta = e.target.closest('[data-tx]'); if (!ta) return;
        a.t[ta.dataset.tx] = ta.value; ctx.save(); paint(ta.dataset.tx);
      });
    },
    check(ans) {
      const t = (ans && ans.t) || {};
      const ev = REW.map(r => ({ r, e: evalRW(r, t[r.id]) }));
      const pass = ev.filter(x => x.e.pass).length, score = ev.reduce((s, x) => s + x.e.score, 0) / REW.length;
      const notes = ev.map(x => {
        if (!x.e.changed) return { ok: false, html: `${esc(x.r.n)} (${esc(x.r.focus)}): ${(t[x.r.id] || '').trim() ? 'формулировка слишком короткая или повторяет письмо.' : 'пока пусто.'}` };
        if (x.e.pass) return { ok: true, html: `${esc(x.r.n)} (${esc(x.r.focus)}): все обязательные признаки на месте.` };
        const miss = x.e.res.filter(r => r.f.req && !r.ok).map(r => r.f.id === 'clean' ? `остались слова-ловушки: ${x.e.sc.bad.map(h => '«' + esc(h.w) + '»').join(', ')}` : esc(r.f.hint));
        return { ok: x.e.score >= 0.6 ? 'warn' : false, html: `${esc(x.r.n)} (${esc(x.r.focus)}): ${miss.map(m => /[.?!»]$/.test(m) ? m : m + '.').join(' ')}` };
      });
      const ok = pass >= 4 && score >= 0.8;
      return {
        ok, score, notes,
        summary: `Проходят все обязательные признаки: ${pass} из ${REW.length}. Общий балл: ${Math.round(score * 100)} %.`,
        mentor: ok ? 'Хорошо. Помните: редактор проверяет слова и цифры, а не смысл. Перед ревью перечитайте каждую фразу глазами Леры: «что я делаю → что вижу → с чем сравниваю».' : 'Идите от вопроса Леры: что она сделает, что увидит и с какой цифрой сравнит. Если ответа нет — не хватает меры, условия или того, кто действует.'
      };
    },
    explain: `<p>Пять мест письма — пять типичных болезней: чужой образец («как у Додо»), вкус («красиво»), скорость без цифры («быстро»), способ без результата («оплата картой»), абсолют («всегда и без сбоев») и неизмеримое удобство («для бабушек»).</p>
      <ul class="checks">
        <li><b>«Как у Додо, красиво»</b> — за этим стоит потребность «просто заказать заранее». Её меряют минутами и шагами или сравнивают с макетами Сони, согласованными с Ниной.</li>
        <li><b>«Быстро»</b> — три вещи: что засекаем, сколько секунд, при какой нагрузке (и в какой доле случаев). Пример из договорённостей «Колоса»: 95 % ответов быстрее 1 секунды при 400 заказах в час.</li>
        <li><b>«Оплата картой»</b> — кто, какими способами (карта и СБП), что после оплаты (статус, чек «предоплата» по 54-ФЗ). Оплата при получении — отдельное требование.</li>
        <li><b>«Всегда и без сбоев»</b> — 100 % не обещает никто. Честная формулировка: доля времени за период и окно обслуживания (99,5 % в месяц ≈ 3,6 часа простоя, работы — с 01:00 до 02:30).</li>
        <li><b>«Удобно для бабушек»</b> — кто именно, какая задача, сколько минут, как проверим. А заказ по телефону через кассира — ещё одно, отдельное требование.</li>
      </ul>
      <p>Важно: цифры (3 минуты, 5 шагов, 99,5 %) <b>предлагает аналитик, а утверждает заказчик</b>: каждая цифра стоит денег. Источник списка слов-ловушек — таблица неоднозначных слов у Вигерса и Битти; свойство «проверяемое» — ISO/IEC/IEEE 29148:2018.</p>`,
    refNote: 'Цифры 3 минуты, 5 шагов и 5 минут — предложение аналитика: их нужно согласовать с Ниной Сергеевной. Цифры 1 секунда при 400 заказах в час и 99,5 % — из договорённостей «Колоса».',
    report: ans => REW.map(r => { const tx = ((ans && ans.t) || {})[r.id] || ''; const e = evalRW(r, tx); return `- ${r.n} (${r.focus}): ${tx.trim() || '—'}${e.pass ? ' ✓' : ' ✗'}`; }).join('\n')
  };

  // =====================================================================
  // Практика 3. Противоречия в наборе
  // =====================================================================
  const CF = [
    { id: 'a', L: 'А', t: 'Запуск — к Новому году.', src: 'письмо Нины Сергеевны' },
    { id: 'b', L: 'Б', t: 'Крайний срок — до 8 Марта.', src: 'письмо Нины Сергеевны' },
    { id: 'c', L: 'В', t: 'Оплата только онлайн — иначе снова ручная сверка.', src: 'Олег Петрович, главный бухгалтер' },
    { id: 'd', L: 'Г', t: 'Оплата на месте при получении должна остаться: многие постоянные покупатели платят наличными.', src: 'Нина Сергеевна' },
    { id: 'e', L: 'Д', t: 'Клиент выбирает точное время выдачи — хоть 07:05.', src: 'Нина Сергеевна' },
    { id: 'f', L: 'Е', t: 'Круассаны к точному времени раньше 07:30 не гарантирую: первая партия на точке бывает в 07:20.', src: 'Галина Ивановна, технолог' },
    { id: 'g', L: 'Ж', t: 'Заказ на завтра — до 22:30: в 23:00 фиксируется план выпечки.', src: 'Галина Ивановна' },
    { id: 'h', L: 'З', t: 'Торт принимаем минимум за 48 часов, предоплата 50 %.', src: 'Нина Сергеевна' },
    { id: 'i', L: 'И', t: 'Выдача предзаказа не должна задерживать очередь в утренний пик 07:30–09:00.', src: 'Павел, управляющий на Покровке' },
    { id: 'k', L: 'К', t: 'Пилот в 2 пекарнях — к 1 февраля 2027; все 9 пекарен и торты — к 1 марта 2027.', src: 'план проекта «Квант Софт»' }
  ];
  const cfL = id => (CF.find(c => c.id === id) || { L: '?' }).L;
  const CONFL = [
    { id: 'date', pairs: ['a-b', 'a-k'], t: 'сроки запуска' },
    { id: 'pay', pairs: ['c-d'], t: 'способ оплаты' },
    { id: 'time', pairs: ['e-f'], t: 'время выдачи' }
  ];
  const TENSION = { 'd-i': 'Оплата на месте в утренний пик может задержать очередь — это не противоречие, а риск. Запишите вопрос к Павлу.' };
  const FALSE = {
    'b-k': '1 марта — раньше 8 Марта: это запас на обкатку, а не противоречие.',
    'd-h': 'Предоплата — для тортов, оплата на месте — для предзаказа выпечки: это разные заказы.',
    'c-h': 'Предоплата за торт — тоже онлайн-оплата: эти два утверждения уживаются.',
    'f-g': '22:30 — приём заказов вечером, 07:30 — выпечка утром: они не спорят.',
    'e-g': '22:30 — когда принимают заказ, 07:05 — когда его забирают. Это разные моменты.',
    'e-i': 'Выбор времени и очередь в пик — про разное: противоречия нет.'
  };
  const pk = (x, y) => [x, y].sort().join('-');
  const pairKind = p => CONFL.find(c => c.pairs.includes(p)) ? 'ok' : TENSION[p] ? 'warn' : 'bad';
  const CQ = {
    q: 'Противоречие найдено. Что с ним делает аналитик? Отметьте всё верное.', multi: true, seed: 'rqq-cq',
    options: [
      { t: 'Показать обе позиции их авторам и выяснить, что за ними стоит: зачем Олегу Петровичу только онлайн, зачем Нине Сергеевне оплата на месте', ok: 1, why: 'Да: за позициями прячутся интересы. Олегу нужна не «только онлайн», а сверка без ручной работы.' },
      { t: 'Подготовить варианты с последствиями — например, оплата на месте остаётся, но кассир отмечает её в системе, и сверка не ручная — и вынести решение Нине Сергеевне как владельцу продукта', ok: 1, why: 'Да: аналитик не выбирает сам, а делает выбор понятным для того, кто решает.' },
      { t: 'Записать принятое решение с источником и поправить оба требования, чтобы в наборе осталось одно правило', ok: 1, why: 'Да: иначе через месяц противоречие вернётся из старой версии.' },
      { t: 'Выбрать вариант того, кто главнее, — Нины Сергеевны, и не тревожить Олега Петровича', why: 'Олег Петрович узнает о решении на сверке — и проблема ручной работы никуда не денется.' },
      { t: 'Оставить оба требования как есть — разработчики разберутся', why: 'Разработчик выберет наугад, а Лера найдёт «баг» в любом варианте.' },
      { t: 'Выбрать самому вариант, который проще сделать', why: 'Это решение за бизнес. Аналитик приносит варианты, а не выбирает между интересами заказчика.' }
    ]
  };
  const CQ_OK = CQ.options.map((o, i) => o.ok ? i : -1).filter(i => i >= 0);
  function cfEval(ans) {
    const pairs = Array.from(new Set(((ans && ans.pairs) || []).filter(p => /^[a-k]-[a-k]$/.test(p))));
    const found = CONFL.filter(c => c.pairs.some(p => pairs.includes(p)));
    const wrong = pairs.filter(p => pairKind(p) === 'bad'), tense = pairs.filter(p => pairKind(p) === 'warn');
    const sel = new Set((ans && ans.q) || []), qGood = CQ_OK.filter(i => sel.has(i)).length, qBad = [...sel].filter(i => !CQ_OK.includes(i)).length;
    const qScore = Math.max(0, (qGood - qBad) / CQ_OK.length), qOk = qGood === CQ_OK.length && qBad === 0;
    const pScore = Math.max(0, (found.length - wrong.length * 0.5) / CONFL.length);
    return { pairs, found, wrong, tense, qGood, qBad, qOk, score: pScore * 0.7 + qScore * 0.3 };
  }
  const conflictsTask = {
    id: 'conflicts', title: 'Найдите противоречия в наборе',
    simple: howSet.simple,
    lead: ui.brief({
      situation: 'Перед встречей с Ниной Сергеевной Ксения собрала на одну доску десять утверждений «Колоса» — из письма, встреч и плана проекта. По отдельности каждое звучит разумно. Ксения говорит: «Тут прячутся три спора. Найдите их до встречи, а не после запуска».',
      todo: [
        'Нажмите на карточку, затем на вторую — получится пара «эти два нельзя выполнить вместе». Повторное нажатие на пару в списке убирает её.',
        'Найдите три противоречия. Пары, которые выглядят похоже, но уживаются, не добавляйте — за них снимаются баллы.',
        'Ответьте на вопрос внизу: что аналитик делает с найденным противоречием.',
        'Нажмите «Проверить». Засчитывается, если найдены все три противоречия, лишних пар не больше одной и вопрос решён верно.'
      ],
      look: 'Проверка на противоречие: представьте, что оба утверждения уже сделаны. Если это невозможно — пара ваша. Если возможно, но неудобно или рискованно — это не противоречие, а вопрос к людям.'
    }),
    blank: () => ({ pairs: [], q: [] }),
    reference: () => ({ pairs: ['a-b', 'c-d', 'e-f'], q: CQ_OK.slice() }),
    render(el, ctx) {
      el.classList.add('rqq-root');
      const a = ctx.ans; a.pairs = a.pairs || []; a.q = a.q || [];
      let sel = null;
      const showKinds = !!(ctx.result || ctx.readonly);
      el.innerHTML = `<div class="stack">
        <div class="rqq-cards" data-cards></div>
        <div class="card flat"><div class="eyebrow">Пары «нельзя выполнить вместе»</div><div class="rqq-pairs" data-pairs></div></div>
        <div class="card flat" data-q></div>
      </div>`;
      function draw() {
        const inPair = new Set(a.pairs.flatMap(p => p.split('-')));
        TR.$('[data-cards]', el).innerHTML = CF.map(c => `<button type="button" class="rqq-card ${inPair.has(c.id) ? 'paired' : ''}" data-c="${c.id}" aria-pressed="${sel === c.id}" ${ctx.readonly ? 'disabled' : ''}><span class="L">${c.L}</span><span>${esc(c.t)}</span><span class="src">${esc(c.src)}</span></button>`).join('');
        TR.$('[data-pairs]', el).innerHTML = a.pairs.length ? a.pairs.map(p => {
          const [x, y] = p.split('-'), k = showKinds ? pairKind(p) : '';
          return `<span class="chip ${k === 'ok' ? 'ok' : k === 'warn' ? 'warn' : k === 'bad' ? 'bad' : 'info'}">${cfL(x)} ↔ ${cfL(y)}${ctx.readonly ? '' : ` <button type="button" class="x" data-rm="${p}" aria-label="Убрать пару">✕</button>`}</span>`;
        }).join('') : `<span class="small dim">${sel ? `Выбрана карточка ${cfL(sel)}. Нажмите вторую.` : 'Пока пусто. Нажмите карточку, затем вторую.'}</span>`;
      }
      draw();
      ui.quiz(TR.$('[data-q]', el), Object.assign({}, CQ, { value: a.q, readonly: ctx.readonly, reveal: ctx.readonly || ctx.result ? ctx.result || true : null, onChange: v => { a.q = v; ctx.save(); } }));
      if (ctx.readonly) return;
      TR.on(el, 'click', '[data-c]', (e, b) => {
        const id = b.dataset.c;
        if (!sel) sel = id;
        else if (sel === id) sel = null;
        else { const p = pk(sel, id); a.pairs = a.pairs.includes(p) ? a.pairs.filter(x => x !== p) : a.pairs.concat(p); sel = null; ctx.save(); }
        draw();
      });
      TR.on(el, 'click', '[data-rm]', (e, b) => { a.pairs = a.pairs.filter(x => x !== b.dataset.rm); ctx.save(); draw(); });
    },
    check(ans) {
      const ev = cfEval(ans), notes = [];
      CONFL.forEach(c => { if (!ev.found.includes(c)) notes.push({ ok: false, html: `Не найден спор про ${esc(c.t)}. ${c.id === 'date' ? 'Сравните даты в письме Нины между собой и с планом проекта.' : c.id === 'pay' ? 'Кто в «Колосе» думает о деньгах по-разному?' : 'Сравните обещания покупателю с возможностями цеха.'}` }); });
      ev.found.forEach(c => notes.push({ ok: true, html: `Найден спор про ${esc(c.t)}.` }));
      ev.wrong.forEach(p => { const [x, y] = p.split('-'); notes.push({ ok: false, html: `${cfL(x)} ↔ ${cfL(y)}: ${esc(FALSE[p] || 'эти два утверждения можно выполнить одновременно — представьте оба сделанными.')}` }); });
      ev.tense.forEach(p => { const [x, y] = p.split('-'); notes.push({ ok: 'info', html: `${cfL(x)} ↔ ${cfL(y)}: ${esc(TENSION[p])} Баллы не снимаем.` }); });
      if (!ev.qOk) notes.push({ ok: false, html: ev.qBad ? 'В вопросе отмечены действия, после которых решение за бизнес принимает не тот человек — или не принимает никто.' : `В вопросе отмечено верных действий: ${ev.qGood} из ${CQ_OK.length}. Что аналитик делает до решения, во время и после?` });
      const ok = ev.found.length === CONFL.length && ev.wrong.length <= 1 && ev.qOk;
      return {
        ok, score: ok ? Math.max(ev.score, 0.8) : Math.min(ev.score, 0.79), notes,
        summary: `Найдено споров: ${ev.found.length} из ${CONFL.length}. Лишних пар: ${ev.wrong.length}.`,
        mentor: ok ? null : 'Для каждой подозрительной пары представьте, что оба утверждения уже сделаны. Возможно такое одновременно? Если нет — это ваша пара. Ищите там, где у разных людей разные интересы: деньги, сроки, утро в пекарне.'
      };
    },
    explain: `<p>Три спора «Колоса»:</p>
      <ul class="checks">
        <li><b>Сроки.</b> «Запуск к Новому году» и «крайний срок до 8 Марта» — две разные даты одного и того же; а план проекта говорит: пилот 1 февраля, все пекарни 1 марта. Засчитывается и пара «к Новому году — план проекта». Решение уже есть в договоре — его нужно проговорить с Ниной, чтобы она не ждала запуска в декабре.</li>
        <li><b>Оплата.</b> Олег Петрович хочет только онлайн (боится ручной сверки), Нина — оплату на месте (боится потерять постоянных покупателей). Интересы совместимы: оплата на месте остаётся, но отмечается в системе — сверка автоматическая. Так и вошло в первую версию.</li>
        <li><b>Время.</b> «Хоть 07:05» против «круассаны не раньше 07:30». Компромисс — получасовые интервалы с 07:00, а круассаны доступны с интервала 07:30–08:00.</li>
      </ul>
      <p>Противоречия — это нормально: у людей разные интересы. Плохо, когда их находит разработчик или Лера, а не аналитик. Аналитик не выбирает сам: показывает обе позиции, собирает варианты с последствиями, решение принимает владелец продукта, итог записывают вместе с источником. Подробнее о переговорах — в неделях 3 и 5. Источник: свойство «непротиворечивый набор» — ISO/IEC/IEEE 29148:2018, Вигерс и Битти.</p>`,
    report: ans => { const ev = cfEval(ans); return `Пары: ${ev.pairs.map(p => p.split('-').map(cfL).join('↔') + (pairKind(p) === 'ok' ? ' ✓' : pairKind(p) === 'warn' ? ' ~' : ' ✗')).join(', ') || '—'}.\nВопрос: верных ${ev.qGood} из ${CQ_OK.length}, лишних ${ev.qBad}.`; }
  };

  // =====================================================================
  // Практика 4. Ответ Нине: зачем придираться к словам
  // =====================================================================
  const WW_RUBRIC = [
    'Разные люди понимают «быстро» и «удобно» по-разному — есть пример расхождения (одна секунда или десять, суббота или воскресенье)',
    'Неизмеримое нельзя проверить и принять: Лера не напишет тест, на приёмке будет спор',
    'Дима не сможет оценить объём и срок; расхождение найдут поздно — и исправлять будет дороже',
    'Предложение: не спорить со словами Нины, а вместе перевести их в цифры; цифры утверждает Нина',
    'Без жаргона, на языке Нины: пример из пекарни или с тортом'
  ];
  const WW_REF = 'Нина Сергеевна, я не придираюсь — я защищаю ваш запуск. «Быстро» для вас — одно, для Димы — другое, для Леры — третье: кто-то подумает про секунду, кто-то про десять. Если записать просто «быстро», Дима не сможет честно оценить работу, Лера — проверить, а на приёмке мы будем спорить, быстро это или нет, — уже за ваши деньги и перед 8 Марта. Это как торт «к выходным»: кондитер испечёт к субботе, а клиентка ждала в воскресенье. Поэтому я предлагаю не отказываться от ваших слов, а перевести их в цифры вместе с вами: например, «95 % ответов приложения быстрее секунды, даже когда утром 400 заказов в час». Цифры выбираете вы — я подготовлю варианты и скажу, что каждый стоит.';
  const wordsTask = {
    id: 'why-words', title: 'Ответить Нине: зачем «придираться к словам»',
    simple: {
      icon: '✉️',
      plain: 'Заказчику важно не «свойство проверяемости», а чтобы получилось то, что он хочет, вовремя и без споров на приёмке.',
      analogy: 'Объяснить клиентке, зачем кондитер переспрашивает «к выходным — это суббота или воскресенье?»: не из вредности, а чтобы торт был на столе вовремя.',
      tech: 'Аргументы: неоднозначное не проверить и не оценить; расхождение находится поздно — дороже; аналитик предлагает меру, заказчик утверждает. Опора — свойства «однозначное» и «проверяемое» (ISO/IEC/IEEE 29148:2018).'
    },
    lead: ui.brief({
      situation: 'Нина Сергеевна получила ваш черновик требований с вопросами к пунктам 1, 9 и 10 и пишет: «Вы придираетесь к словам. Все же понимают, что такое „быстро“ и „удобно“. Пишите как есть — некогда!»',
      todo: [
        'Напишите Нине 5–8 предложений без технического жаргона (от 250 символов).',
        'Объясните, чем ей грозит «как есть», и предложите, как сделать иначе — не споря с её словами.',
        'Нажмите «Проверить с Ксенией (Claude)» или «Сверить с эталоном самому» и честно отметьте раскрытые пункты. Засчитывается от 60 %.'
      ],
      lookTitle: 'На что опереться',
      look: 'Лаборатория «Подсветка» и живой редактор. Живые примеры: торт «к выходным», «быстро» у Нины, Димы и Леры, приёмка перед 8 Марта. Не учите Нину стандартам — говорите о её торте, деньгах и сроках.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: WW_REF, self: WW_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('rqq-root');
      el.insertAdjacentHTML('beforeend', ui.say('nina', 'Вы придираетесь к словам. Все же понимают, что такое «быстро» и «удобно». Пишите как есть — некогда!'));
      const j = document.createElement('div'); j.style.marginTop = '12px'; el.appendChild(j);
      ui.justify(j, {
        id: 'rqq-words', q: 'Зачем аналитик переводит «быстро» и «удобно» в цифры?', qPlain: 'Объясните владелице сети пекарен без жаргона, зачем аналитик не оставляет в требованиях слова «быстро» и «удобно», а переводит их в цифры, если ей кажется, что все и так понимают.',
        rubric: WW_RUBRIC, reference: WW_REF, value: ctx.ans.j, readonly: ctx.readonly, minLen: 250,
        placeholder: 'Нина Сергеевна, …',
        onChange: v => { ctx.ans.j = v; ctx.save(); ctx.decide('Ответ Нине: зачем точные слова', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j);
      return {
        ok: s >= 0.6, score: s,
        summary: s ? `Оценка ответа: ${Math.round(s * 100)} %.` : 'Напишите ответ (от 250 символов) и проверьте его с Ксенией или сверьте с эталоном сами.',
        notes: s && s < 0.6 ? [{ ok: false, html: 'Нине важно три вещи: что случится, если оставить «как есть» (живой пример), чем это грозит её деньгам и сроку, и что вы предлагаете взамен — так, чтобы решение осталось за ней.' }] : []
      };
    },
    explain: `<p>Сильный ответ заказчику не защищает стандарт, а защищает его интересы: «как есть» — значит, Дима оценит наугад, Лера не проверит, а спор «быстро или нет» случится на приёмке перед 8 Марта. Лучший ход — не отказ от слов Нины, а <b>перевод в цифры вместе с ней</b>: аналитик предлагает меру и цену, заказчик выбирает.</p>
      <p>И не перегибайте: слова «быстро» и «удобно» нормальны в разговоре и в бизнес-цели — их нельзя оставлять только в требованиях, по которым делают и проверяют. Подробно об измеримых нефункциональных требованиях — в неделе 4.</p>`,
    report: ans => (ans.j && ans.j.text) ? ans.j.text : '—'
  };

  // =====================================================================
  TR.stage({
    id: 'req-quality', act: 2, order: 130, slot: 'Ср 10:00', title: 'Хорошее требование',
    when: 'среда, 10:00 · переговорная «Квант Софт», письмо Нины на экране',
    intro: [
      { who: 'lera', html: 'Прочитала письмо Нины Сергеевны. «Красиво и быстро», «всегда и без сбоев», «удобно для бабушек». Как я это проверю? Мне нужен тест, который либо прошёл, либо нет.' },
      { who: 'ksenia', html: 'Лера задала главный вопрос дня. Мы уже разобрали, <i>что</i> просит Нина и какие это требования. Сегодня — <b>как</b> их записать: какие свойства у хорошего требования, какие слова выдают плохое и как переписать письмо так, чтобы Лера могла проверить, а Дима — оценить. Это ваша работа: вы пишете, Лера — ваш первый читатель.' }
    ],
    facts: [],
    glossary: [
      { term: 'Свойства хорошего требования', simple: 'Как у хорошего заказа торта: нужен, понятен одинаково, полон, выполним, его можно сверить.', tech: 'ISO/IEC/IEEE 29148:2018: одно требование — необходимое, уместное, однозначное, полное, единичное, выполнимое, проверяемое, корректное, соответствующее шаблону; набор — полный, непротиворечивый, выполнимый, понятный, проверяемый на соответствие потребностям.' },
      { term: 'Необходимое требование', simple: 'Если вычеркнуть — кто-то пострадает. У пункта в бланке торта есть хозяйка.', tech: 'Требование, без которого решение не удовлетворит потребность или цель; у него есть источник и причина.' },
      { term: 'Однозначное требование', simple: '«К субботе, 15:00», а не «к выходным».', tech: 'Требование, которое все читатели понимают одинаково; без слов, допускающих разное толкование.' },
      { term: 'Полное требование', simple: 'Кондитеру хватает бланка, чтобы испечь без звонка клиентке.', tech: 'Требование, содержащее всё, что нужно для реализации и проверки, без отсылок «уточнить потом».' },
      { term: 'Единичное (атомарное) требование', simple: 'Одна строка бланка — одно изделие: торт отдельно, капкейки отдельно.', tech: 'Требование, выражающее одну возможность или одно ограничение; его можно выполнить, оценить и проверить целиком.' },
      { term: 'Выполнимое требование', simple: 'Трёхъярусный торт — не к сегодняшнему вечеру, если цех берёт заказы за 48 часов.', tech: 'Требование, которое можно реализовать при существующих ограничениях: бюджет, сроки, технологии, люди, законы.' },
      { term: 'Проверяемое требование', simple: 'Торт можно сверить с фото и взвесить — ответ «да» или «нет».', tech: 'Требование, выполнение которого можно доказать проверкой, тестом, осмотром или анализом с однозначным результатом.' },
      { term: 'Корректное требование', simple: 'Надпись «маме», а не «папе» — как просила клиентка.', tech: 'Требование, точно отражающее потребность источника; проверяется сверкой с источником, а не чтением.' },
      { term: 'Непротиворечивость', simple: '«Всё без сахара» и «торт-безе» в одном меню не выйдут.', tech: 'Свойство набора требований: ни одно требование не исключает другое; противоречия разрешают с заинтересованными лицами.' },
      { term: 'Слова-ловушки', simple: '«Побольше и повкуснее» — каждый представит своё.', tech: 'Неоднозначные слова, делающие требование непроверяемым: «быстро», «удобно», «поддерживать», «оптимально», «по возможности», «и т. д.», «всегда». Заменяются мерой: кто, что, при каком условии, насколько.' }
    ],
    outro: 'Хорошее требование — как хороший заказ торта: нужно, понятно одинаково, полно, об одном, выполнимо, проверяемо и правдиво. Главный вопрос на каждый день — «как это проверит Лера?». Нет ответа — формулировка ещё не готова. Слова «быстро» и «удобно» не запрещены в разговоре с Ниной: их нельзя оставлять в требованиях, и меру предлагает аналитик, а утверждает заказчик. Завтра — жизнь требования: паспорт и атрибуты, статусы, базовая версия и трассировка — как проследить путь от цели Нины до теста Леры.',
    tasks: [howProps, howTraps, howSet, defectsTask, rewriteTask, conflictsTask, wordsTask]
  });
})();
