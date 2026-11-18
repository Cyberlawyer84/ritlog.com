(() => {
  // Taal en map van de beelden komen van <html lang> en <body data-scr>.
  const EN = document.documentElement.lang === 'en';
  const t = (nl, en) => EN ? en : nl;
  const SCR = document.body.dataset.scr || 'scr/nl/';
  // Alle maten in iOS-punten van de iPhone 17 (402 x 874).
  const TABS = [
    { r: [24, 790, 118, 862], go: 'home', label: 'Home' },
    { r: [118, 790, 202, 862], go: 'ritten', label: t('Ritten', 'Trips') },
    { r: [202, 790, 286, 862], go: 'inzicht', label: t('Inzicht', 'Insights') },
    { r: [286, 790, 380, 862], go: 'instellingen', label: t('Instellingen', 'Settings') },
  ];
  const tabs = TABS.map(t => ({ ...t, tr: 'fade' }));

  // Elke toestand: welk beeld, welke tekst eronder, welke klikvlakken, welke knop de hint aanwijst.
  const S = {
    home: {
      img: () => saved ? 'home-na' : 'home', step: 1,
      cap: () => saved
        ? t('Opgeslagen. Home toont meteen de nieuwe kilometerstand en de route. Kijk nu bij Ritten.',
            'Saved. Home instantly shows the new odometer reading and the route. Now have a look at Trips.')
        : t('Je rijdt naar het gerechtshof. Als je aankomt, vraagt RitLog of je de rit wilt registreren.',
            'You’re driving to court. When you arrive, RitLog asks whether you want to log the trip.'),
      hot: () => [
        { r: [18, 724, 322, 778], go: 'rit-0', tr: 'sheet', label: t('Rit registreren', 'Log trip') },
        { r: [330, 724, 384, 778], hint: true, label: t('Tankbeurt of kosten', 'Fuel or expenses') },
        ...tabs,
      ],
      hint: () => saved ? 3 : 0,              // na opslaan: tab Ritten
    },
    'rit-0': {
      img: 'rit-0', step: 2,
      cap: t('Tik op ‘Naar’. De demo typt de bestemming voor je.', 'Tap ‘To’. The demo types the destination for you.'),
      hot: [
        { r: [36, 254, 366, 304], seq: 'naar', label: t('Naar: bestemming invullen', 'To: enter destination') },
        { r: [0, 0, 402, 62], go: 'home', tr: 'close', label: t('Sluiten', 'Close') },
      ],
      hint: 0,
    },
    'rit-1': {
      img: 'rit-1', step: 2,
      cap: t('Kilometerstand, afstand en vertrektijd staan er al. Tik op ‘Label’ voor een dossiernaam.', 'Odometer, distance and departure time are already filled in. Tap ‘Label’ to add a case name.'),
      hot: [
        { r: [36, 393, 366, 443], seq: 'label', label: t('Label invullen', 'Enter label') },
        { r: [0, 0, 402, 62], go: 'home', tr: 'close', label: t('Sluiten', 'Close') },
      ],
      hint: 0,
    },
    'rit-2': {
      img: 'rit-2', step: 3,
      cap: t('Alles staat erin. Tik op Opslaan.', 'All done. Tap Save.'),
      hot: [
        { r: [206, 766, 384, 820], go: 'home', tr: 'close', save: true, label: t('Opslaan', 'Save') },
        { r: [20, 766, 196, 820], go: 'home', tr: 'close', label: t('Annuleren', 'Cancel') },
      ],
      hint: 0,
    },
    ritten: {
      img: 'ritten', step: 4,
      cap: t('Al je ritten per dag, met kilometers en vergoeding. Tik rechtsboven op het deelicoon om te exporteren.', 'All your trips by day, with kilometres and allowance. Tap the share icon at the top right to export.'),
      hot: [
        { r: [330, 68, 388, 126], go: 'exp-pdf', tr: 'sheet', label: t('Exporteren', 'Export') },
        { r: [274, 68, 330, 126], hint: true, label: t('Filter', 'Filter') },
        ...tabs,
      ],
      hint: 0,
    },
    'exp-pdf': {
      img: 'exp-pdf', step: 5,
      cap: t('Kies bestandstype, periode en categorie. CSV voor Excel, PDF voor je administratie.', 'Choose file type, period and category. CSV for Excel, PDF for your records.'),
      hot: [
        { r: [20, 252, 382, 300], go: 'exp-typemenu', tr: 'fade', label: t('Bestandstype', 'File type') },
        { r: [16, 78, 106, 122], go: 'ritten', tr: 'close', label: t('Gereed', 'Done') },
      ],
      scrollDown: 'exp-pdf2', hint: 0,
      auto: { to: 'exp-pdf2', after: 2200, tr: 'scrollup' },
    },
    'exp-typemenu': {
      img: 'exp-typemenu', step: 5,
      cap: t('CSV voor Excel, PDF voor je administratie.', 'CSV for Excel, PDF for your records.'),
      hot: [
        { r: [96, 262, 330, 302], go: 'exp-pdf', tr: 'fade', label: 'CSV' },
        { r: [96, 304, 330, 346], go: 'exp-pdf', tr: 'fade', label: 'PDF' },
      ],
      elsewhere: 'exp-pdf', hint: 1,
    },
    'exp-pdf2': {
      img: 'exp-pdf2', step: 5,
      cap: t('Je ziet direct hoeveel ritten en kilometers erin komen. Tik op ‘Exporteer en Deel’.', 'You can see right away how many trips and kilometres are included. Tap ‘Export and share’.'),
      hot: [
        { r: [20, 764, 382, 822], go: 'deel', tr: 'sheet', label: t('Exporteer en Deel', 'Export and share') },
        { r: [16, 78, 106, 122], go: 'ritten', tr: 'close', label: t('Gereed', 'Done') },
      ],
      scrollUp: 'exp-pdf', hint: 0,
    },
    deel: {
      img: 'deel', step: 5,
      cap: t('Mail het naar je boekhouder of bewaar het in Bestanden. Tik op Voorvertoning.', 'Email it to your accountant or save it to Files. Tap Preview.'),
      hot: [
        { r: [28, 626, 112, 716], go: 'pdf', tr: 'fade', label: t('Voorvertoning', 'Preview') },
        { r: [114, 626, 200, 716], hint: true, label: t('Meer', 'More') },
        { r: [24, 750, 384, 852], hint: true, label: t('Kopieer, Markeringen, Druk af, Bewaar in Bestanden', 'Copy, Markup, Print, Save to Files') },
        { r: [0, 0, 402, 520], go: 'exp-pdf2', tr: 'close', label: t('Sluiten', 'Close') },
      ],
      hint: 0,
    },
    pdf: {
      img: 'pdf', step: 5,
      cap: t('Een nette rittenregistratie als PDF-export. Tik linksboven om terug te gaan.', 'A tidy trip log as a PDF export. Tap the top left to go back.'),
      hot: [
        { r: [0, 28, 80, 54], go: 'ritten', tr: 'fade', label: t('Terug naar RitLog', 'Back to RitLog') },
        { r: [68, 60, 120, 110], go: 'ritten', tr: 'fade', label: t('Terug', 'Back') },
      ],
      hint: 0,
    },
    inzicht: {
      img: 'inzicht', step: 6,
      cap: t('Inzicht: totalen, verdeling en hoogtepunten. Scroll in het scherm voor de grafieken.', 'Insights: totals, breakdown and highlights. Scroll the screen for the charts.'),
      hot: [...tabs], scrollDown: 'inzicht2', hint: null,
    },
    inzicht2: {
      img: 'inzicht2', step: 6,
      cap: t('Ritten per weekdag en kilometers per maand.', 'Trips per weekday and kilometres per month.'),
      hot: [...tabs], scrollUp: 'inzicht', hint: null,
    },
    instellingen: {
      img: 'instellingen', step: 0,
      cap: t('Instellingen: uiterlijk, taal, voertuigen, categorieën en tarieven.', 'Settings: appearance, language, vehicles, categories and rates.'),
      hot: [...tabs], hint: null,
    },
  };

  // Wat de demo voor je "typt".
  const SEQ = {
    naar: [['rit-typ1', 250, t('Je typt de eerste letters…', 'You type the first few letters…')], ['rit-typ2', 700, t('RitLog zoekt in je eigen locaties en in Apple Kaarten.', 'RitLog searches your own locations and Apple Maps.')],
           ['@tap', 900, [200, 335]], ['rit-1', 350]],
    label: [['rit-lab1', 250, t('Een label koppelt de rit aan een dossier.', 'A label links the trip to a case.')], ['rit-lab2', 750], ['rit-2', 900]],
  };

  const IMGS = ['home', 'home-na', 'rit-0', 'rit-typ1', 'rit-typ2', 'rit-1', 'rit-lab1', 'rit-lab2', 'rit-2', 'ritten',
    'exp-pdf', 'exp-typemenu', 'exp-pdf2', 'deel', 'pdf', 'inzicht', 'inzicht2', 'instellingen'];
  IMGS.forEach(n => { const i = new Image(); i.src = `${SCR}${n}.webp`; });

  const screen = document.getElementById('screen');
  const island = screen.querySelector('.island');
  const notif = document.getElementById('notif');
  const ring = document.getElementById('ring');
  const cap = document.getElementById('cap');
  const stepBtns = [...document.querySelectorAll('#steps button')];
  const val = v => typeof v === 'function' ? v() : v;
  const pct = (r) => ({ left: r[0] / 4.02 + '%', top: r[1] / 8.74 + '%', width: (r[2] - r[0]) / 4.02 + '%', height: (r[3] - r[1]) / 8.74 + '%' });

  let cur = null, saved = false, busy = false, timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const stopTimers = () => { timers.forEach(clearTimeout); timers = []; };

  function setImage(name, tr) {
    const old = [...screen.querySelectorAll('.layer')];
    const img = document.createElement('img');
    img.className = 'layer'; img.alt = ''; img.src = `${SCR}${name}.webp`;
    if (tr === 'close' && old.length) {
      // Het oude blad schuift weg en onthult het nieuwe scherm eronder.
      screen.insertBefore(img, old[0]);
      const top = old[old.length - 1];
      old.slice(0, -1).forEach(o => o.remove());
      top.classList.add('out-sheet');
      top.addEventListener('animationend', () => top.remove(), { once: true });
      setTimeout(() => top.remove(), 450);
      return;
    }
    screen.insertBefore(img, island);
    const cls = { fade: 'in-fade', type: 'in-type', sheet: 'in-sheet', scrollup: 'in-scrollup', scrolldown: 'in-scrolldown' }[tr];
    if (cls) {
      img.classList.add(cls);
      const done = () => { old.forEach(o => o.remove()); img.classList.remove(cls); };
      img.addEventListener('animationend', done, { once: true });
      setTimeout(done, 500);               // vangnet als de animatie niet afloopt (tab op de achtergrond)
    } else old.forEach(o => o.remove());
  }

  function go(name, tr) {
    stopTimers(); busy = false; hideNotif();
    const st = S[name]; cur = name;
    setImage(val(st.img), tr);
    cap.textContent = val(st.cap);
    screen.querySelectorAll('.hot').forEach(h => h.remove());
    val(st.hot).forEach(h => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'hot'; b.setAttribute('aria-label', h.label || '');
      Object.assign(b.style, pct(h.r));
      b.addEventListener('click', e => { e.stopPropagation(); press(h, e); });
      screen.insertBefore(b, ring);
    });
    stepBtns.forEach((b, i) => { if (i + 1 === st.step) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    if (name === 'home' && !saved) later(showNotif, 1200);
    if (st.auto) later(() => { if (cur === name) go(st.auto.to, st.auto.tr); }, st.auto.after);
  }

  function tapAt(x, y) {
    const t = document.createElement('div'); t.className = 'tap';
    t.style.left = x / 4.02 + '%'; t.style.top = y / 8.74 + '%';
    screen.appendChild(t); setTimeout(() => t.remove(), 500);
  }

  function press(h, e) {
    if (busy) return;
    if (e && e.clientX) {
      const b = screen.getBoundingClientRect();
      tapAt((e.clientX - b.left) / b.width * 402, (e.clientY - b.top) / b.height * 874);
    }
    if (h.hint) return showHint(t('Dit deel zit niet in de demo.', 'This part isn’t in the demo.'));
    if (h.save) saved = true;
    if (h.seq) return play(SEQ[h.seq]);
    if (h.go) go(h.go, h.tr);
  }

  function play(seq) {
    busy = true; let t = 0;
    seq.forEach(([what, wait, extra]) => {
      t += wait;
      later(() => {
  // Taal en map van de beelden komen van <html lang> en <body data-scr>.
  const EN = document.documentElement.lang === 'en';
  const t = (nl, en) => EN ? en : nl;
  const SCR = document.body.dataset.scr || 'scr/nl/';
        if (what === '@tap') return tapAt(extra[0], extra[1]);
        const last = what === seq[seq.length - 1][0];
        if (last) { busy = false; go(what, 'fade'); return; }
        setImage(what, 'type');
        if (extra) cap.textContent = extra;
      }, t);
    });
  }

  function showHint(msg) {
    const st = S[cur];
    let target = null;
    if (cur === 'home' && notif.classList.contains('on')) target = notif;
    else {
      const idx = val(st.hint);
      if (idx != null) target = screen.querySelectorAll('.hot')[idx];
    }
    if (msg) { cap.textContent = msg; later(() => { if (S[cur] === st) cap.textContent = val(st.cap); }, 1800); }
    if (!target) return;
    const sb = screen.getBoundingClientRect(), tb = target.getBoundingClientRect();
    Object.assign(ring.style, { left: tb.left - sb.left - 4 + 'px', top: tb.top - sb.top - 4 + 'px', width: tb.width + 8 + 'px', height: tb.height + 8 + 'px' });
    ring.classList.remove('on'); void ring.offsetWidth; ring.classList.add('on');
  }

  function showNotif() { notif.classList.add('on'); notif.tabIndex = 0; cap.textContent = t('Je bent er. Tik op de melding.', 'You’ve arrived. Tap the notification.'); }
  function hideNotif() { notif.classList.remove('on'); notif.tabIndex = -1; }
  notif.addEventListener('click', e => { e.stopPropagation(); if (busy) return; go('rit-1', 'sheet'); });
  notif.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); notif.click(); } });

  // Tik naast een knop: wijs de volgende stap aan.
  screen.addEventListener('click', e => {
    if (busy) return;
    const b = screen.getBoundingClientRect();
    tapAt((e.clientX - b.left) / b.width * 402, (e.clientY - b.top) / b.height * 874);
    const st = S[cur];
    if (st.elsewhere) return go(st.elsewhere, 'fade');
    if (st.scrollDown) return go(st.scrollDown, 'scrollup');
    showHint();
  });

  // Scrollen in het scherm (muiswiel of veeg).
  let wheelLock = 0;
  const scroll = dir => {
    if (busy || Date.now() < wheelLock) return;
    const st = S[cur]; const to = dir > 0 ? st.scrollDown : st.scrollUp;
    if (!to) return;
    wheelLock = Date.now() + 600;
    go(to, dir > 0 ? 'scrollup' : 'scrolldown');
  };
  screen.addEventListener('wheel', e => {
    const st = S[cur];
    if (st.scrollDown || st.scrollUp) { e.preventDefault(); if (Math.abs(e.deltaY) > 4) scroll(Math.sign(e.deltaY)); }
  }, { passive: false });
  let y0 = null;
  screen.addEventListener('touchstart', e => { y0 = e.touches[0].clientY; }, { passive: true });
  screen.addEventListener('touchmove', e => { const st = S[cur]; if ((st.scrollDown || st.scrollUp) && e.cancelable) e.preventDefault(); }, { passive: false });
  screen.addEventListener('touchend', e => {
    if (y0 == null) return; const dy = y0 - e.changedTouches[0].clientY; y0 = null;
    if (Math.abs(dy) > 30) scroll(Math.sign(dy));
  });

  stepBtns.forEach(b => b.addEventListener('click', () => {
    const to = b.dataset.go;
    if (to === 'aankomst') { saved = false; go('home', 'fade'); return; }
    if (to === 'rit-2') saved = false;
    go(to, to.startsWith('rit') || to === 'exp-pdf' ? 'sheet' : 'fade');
  }));
  document.getElementById('reset').addEventListener('click', () => { saved = false; go('home', 'fade'); });

  go('home');
})();
