/* =====================================================================
   Essential Massage by Mesha: site behaviour
   Vanilla JS, no dependencies. Every feature is progressive: the page
   reads and works without this file; this adds the polish and the
   booking / gift request flows.
   ===================================================================== */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;

  const PHONE = '+13312333613';

  /* Opening hours, America/Chicago. Key = day of week (0 = Sunday).
     [opens, closes] in 24h hours; null = closed. Keep in sync with the
     #hours-list markup and the JSON-LD in <head>. */
  const HOURS = { 0: [11, 15], 1: [10, 19], 2: null, 3: [11, 19], 4: null, 5: [10, 19], 6: [10, 18] };
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const money = n => '$' + Number(n).toLocaleString('en-US');
  const hourLabel = (h, forceMinutes = false) => {
    const hh = Math.floor(h);
    const mm = Math.round((h - hh) * 60);
    const suffix = hh >= 12 ? 'PM' : 'AM';
    const h12 = ((hh + 11) % 12) + 1;
    return mm || forceMinutes ? `${h12}:${String(mm).padStart(2, '0')} ${suffix}` : `${h12} ${suffix}`;
  };
  const smsHref = body => `sms:${PHONE}?&body=${encodeURIComponent(body)}`;

  /* ---------------------------------------------------------------
     Analytics / ad-conversion hooks.
     Pushes to dataLayer (GTM / GA4), gtag() and Meta fbq() if those
     tags have been installed; otherwise it is a harmless no-op.
     --------------------------------------------------------------- */
  window.dataLayer = window.dataLayer || [];
  function track(event, params = {}) {
    try {
      window.dataLayer.push({ event, ...params });
      if (typeof window.gtag === 'function') window.gtag('event', event, params);
    } catch (_) { /* never let analytics break the page */ }
  }
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-track]');
    if (!el) return;
    const label = el.dataset.label || el.textContent.trim().replace(/\s+/g, ' ').slice(0, 60);
    track(el.dataset.track, { label });
    if (el.dataset.fb && typeof window.fbq === 'function') window.fbq('track', el.dataset.fb, { content_name: label });
  });

  /* ---------------------------------------------------------------
     Time in Bolingbrook (visitors may be anywhere).
     --------------------------------------------------------------- */
  function chicagoNow() {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago', year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', hourCycle: 'h23', weekday: 'short'
    }).formatToParts(new Date());
    const get = type => parts.find(p => p.type === type).value;
    const hour = Number(get('hour')) % 24;
    return {
      y: Number(get('year')), m: Number(get('month')) - 1, d: Number(get('day')),
      dow: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')),
      mins: hour * 60 + Number(get('minute'))
    };
  }
  const NOW = chicagoNow();

  /* ---------------------------------------------------------------
     Open / closed status + today's row in the hours card
     --------------------------------------------------------------- */
  (function openStatus() {
    const today = HOURS[NOW.dow];
    let open = false, text = '', short = '';

    if (today && NOW.mins >= today[0] * 60 && NOW.mins < today[1] * 60) {
      open = true;
      text = `Open now · until ${hourLabel(today[1])}`;
      short = text;
    } else {
      for (let i = 0; i < 8; i++) {
        const dow = (NOW.dow + i) % 7;
        const h = HOURS[dow];
        if (!h || (i === 0 && NOW.mins >= h[0] * 60)) continue;
        const when = i === 0 ? 'today' : i === 1 ? 'tomorrow' : DAYS[dow].slice(0, 3);
        text = `Closed · opens ${when} ${hourLabel(h[0])}`;
        short = `Opens ${when} ${hourLabel(h[0])}`;
        break;
      }
    }

    const hero = $('#hero-status');
    if (hero) { hero.classList.toggle('is-closed', !open); $('.status-text', hero).textContent = short; }
    const visit = $('#visit-status');
    if (visit) { visit.classList.toggle('is-closed', !open); $('.status-text', visit).textContent = open ? 'Open now' : 'Closed now'; visit.title = text; }
    const row = $(`#hours-list li[data-day="${NOW.dow}"]`);
    if (row) row.classList.add('is-today');
  })();

  /* ---------------------------------------------------------------
     Header: glass on scroll + mobile action bar
     --------------------------------------------------------------- */
  const header = $('#header');
  const hero = $('#top');
  const mbar = $('#mbar');
  const bookSection = $('#booking');
  const footer = $('.footer');
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 8);
    if (mbar && hero) {
      // Step aside while the booking form is on screen so it never covers "Send request".
      const b = bookSection ? bookSection.getBoundingClientRect() : null;
      const inBooking = b && b.top < innerHeight * 0.8 && b.bottom > innerHeight * 0.2;
      const f = footer ? footer.getBoundingClientRect() : null;
      const atFooter = f && f.top < innerHeight - 40;
      mbar.classList.toggle('is-visible', y > hero.offsetHeight * 0.55 && !inBooking && !atFooter);
    }
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------------
     Mobile menu
     --------------------------------------------------------------- */
  const menuBtn = $('.menu-btn');
  const menu = $('#mobile-menu');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.inert = !open;
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) setTimeout(() => $('a', menu).focus({ preventScroll: true }), 60);
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
    menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
    addEventListener('keydown', e => {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) { setMenu(false); menuBtn.focus(); }
    });
    matchMedia('(min-width: 1080px)').addEventListener('change', e => { if (e.matches) setMenu(false); });
  }

  /* ---------------------------------------------------------------
     Highlight the nav link for the section in view
     --------------------------------------------------------------- */
  const navLinks = $$('.nav a');
  const linkFor = new Map(navLinks.map(a => [a.getAttribute('href').slice(1), a]));
  if ('IntersectionObserver' in window) {
    const navIO = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        navLinks.forEach(a => a.classList.remove('is-active'));
        linkFor.get(en.target.id)?.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(s => navIO.observe(s));
  }

  /* ---------------------------------------------------------------
     Scroll reveal
     --------------------------------------------------------------- */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-in'));
  }

  /* ---------------------------------------------------------------
     Cursor spotlight on cards (desktop only)
     --------------------------------------------------------------- */
  if (canHover) {
    document.addEventListener('pointermove', e => {
      const el = e.target.closest && e.target.closest('.spot');
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    }, { passive: true });
  }

  /* ---------------------------------------------------------------
     Service filter (segmented control with a sliding thumb)
     --------------------------------------------------------------- */
  const filters = $('.filters');
  const thumb = $('.filter-thumb');
  const filterBtns = $$('.filter');
  const svcCards = $$('.svc');
  const svcCount = $('#svc-count');
  const FILTER_NAMES = { massage: 'massage', recovery: 'recovery & wellness', sculpt: 'body sculpting' };

  function moveThumb() {
    const active = filterBtns.find(b => b.getAttribute('aria-pressed') === 'true');
    if (!active || !thumb) return;
    thumb.style.width = `${active.offsetWidth}px`;
    thumb.style.transform = `translateX(${active.offsetLeft - 5}px)`;
  }
  function applyFilter(f) {
    svcCards.forEach(c => { c.hidden = !(f === 'all' || c.dataset.cat === f); });
    const n = svcCards.filter(c => !c.hidden).length;
    svcCount.textContent = f === 'all' ? `Showing all ${n} services` : `Showing ${n} ${FILTER_NAMES[f]} service${n === 1 ? '' : 's'}`;
  }
  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    if (btn.getAttribute('aria-pressed') === 'true') return;
    filterBtns.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    moveThumb();
    const run = () => applyFilter(btn.dataset.filter);
    if (document.startViewTransition && !reduced) {
      svcCards.forEach((c, i) => { c.style.viewTransitionName = `svc-${i}`; });
      document.startViewTransition(run).finished.finally(() => {
        svcCards.forEach(c => { c.style.viewTransitionName = ''; });
      });
    } else {
      run();
    }
    if (filters.scrollWidth > filters.clientWidth) {
      filters.scrollTo({ left: btn.offsetLeft - 24, behavior: reduced ? 'auto' : 'smooth' });
    }
  }));
  if (filters) {
    requestAnimationFrame(() => { moveThumb(); filters.classList.add('is-ready'); });
    addEventListener('resize', moveThumb, { passive: true });
    document.fonts?.ready.then(moveThumb);
  }

  /* ---------------------------------------------------------------
     Package tiers (selectable)
     --------------------------------------------------------------- */
  $$('.pkg').forEach(pkg => {
    const tiers = $$('.tier', pkg);
    const pick = $('.pkg-pick b', pkg);
    tiers.forEach(t => t.addEventListener('click', () => {
      tiers.forEach(x => x.setAttribute('aria-pressed', String(x === t)));
      pick.textContent = `${t.dataset.qty} sessions · ${money(t.dataset.price)}`;
    }));
  });

  /* ---------------------------------------------------------------
     Booking request
     The service list is read from the service + package cards above,
     so prices only ever live in one place.
     --------------------------------------------------------------- */
  const form = $('#book-form');
  if (form) {
    const select = $('#book-service');
    const nameInput = $('#book-name');
    const calTitle = $('#cal-title');
    const calDays = $('#cal-days');
    const calPrev = $('#cal-prev');
    const calNext = $('#cal-next');
    const timesEl = $('#times');
    const sendBtn = $('#book-send');
    const copyBtn = $('#book-copy');
    const summary = $('#book-summary');
    const bookError = $('#book-error');
    const steps = $$('.book-step', form);
    const out = {
      service: $('#sum-service'), dur: $('#sum-dur'), day: $('#sum-day'),
      time: $('#sum-time'), price: $('#sum-price')
    };

    // Build the option list
    const options = [];
    svcCards.forEach(card => {
      card.dataset.options.split(';').forEach(pair => {
        const [mins, price] = pair.split('|').map(Number);
        options.push({
          id: `svc:${card.dataset.name}:${mins}`, cat: card.dataset.cat,
          name: card.dataset.name, mins, price
        });
      });
    });
    $$('.pkg').forEach(pkg => {
      $$('.tier', pkg).forEach(t => {
        options.push({
          id: `series:${pkg.dataset.series}:${t.dataset.qty}`, cat: 'series',
          name: pkg.dataset.series, mins: Number(pkg.dataset.dur),
          price: Number(t.dataset.price), qty: Number(t.dataset.qty)
        });
      });
    });
    const byId = new Map(options.map(o => [o.id, o]));
    const GROUPS = [['massage', 'Massage'], ['recovery', 'Recovery & Wellness'], ['sculpt', 'Body Sculpting'], ['series', 'Packages & Series']];
    GROUPS.forEach(([cat, label]) => {
      const group = document.createElement('optgroup');
      group.label = label;
      options.filter(o => o.cat === cat).forEach(o => {
        const text = o.qty
          ? `${o.name} · ${o.qty} sessions · ${money(o.price)}`
          : `${o.name} · ${o.mins} min · ${money(o.price)}`;
        group.append(new Option(text, o.id));
      });
      select.append(group);
    });

    const quick = $('#qb-service');
    if (quick) {
      [...select.querySelectorAll('optgroup')].forEach(g => quick.append(g.cloneNode(true)));
      $('#qb-go').addEventListener('click', () => { if (quick.value) choose(quick.value); });
      quick.addEventListener('change', () => { if (quick.value) $('#qb-go').focus({ preventScroll: true }); });
    }

    const state = { date: null, time: null };
    const view = { y: NOW.y, m: NOW.m };
    const MONTHS_AHEAD = 3;
    const current = () => byId.get(select.value);
    const isToday = (y, m, d) => y === NOW.y && m === NOW.m && d === NOW.d;
    const isPast = (y, m, d) => (y * 400 + m * 32 + d) < (NOW.y * 400 + NOW.m * 32 + NOW.d);

    function slotsFor(y, m, d) {
      const h = HOURS[new Date(y, m, d).getDay()];
      if (!h) return [];
      const dur = (current()?.mins || 60) / 60;
      const slots = [];
      for (let t = h[0]; t + dur <= h[1] + 1e-9; t += 1) slots.push(t);
      // Same-day requests need at least an hour's notice.
      return isToday(y, m, d) ? slots.filter(t => t * 60 >= NOW.mins + 60) : slots;
    }

    const dayLabel = ({ y, m, d }, style = 'short') => new Date(y, m, d).toLocaleDateString('en-US',
      style === 'long' ? { weekday: 'long', month: 'long', day: 'numeric' } : { weekday: 'short', month: 'short', day: 'numeric' });

    function renderCalendar() {
      calTitle.textContent = new Date(view.y, view.m, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      calDays.replaceChildren();
      const lead = new Date(view.y, view.m, 1).getDay();
      const count = new Date(view.y, view.m + 1, 0).getDate();
      for (let i = 0; i < lead; i++) calDays.append(document.createElement('span'));
      for (let d = 1; d <= count; d++) {
        const btn = document.createElement('button');
        const closed = !HOURS[new Date(view.y, view.m, d).getDay()];
        btn.type = 'button';
        btn.className = 'day';
        btn.textContent = d;
        btn.disabled = closed || isPast(view.y, view.m, d) || !slotsFor(view.y, view.m, d).length;
        if (isToday(view.y, view.m, d)) btn.classList.add('is-today');
        const selected = state.date && state.date.y === view.y && state.date.m === view.m && state.date.d === d;
        btn.setAttribute('aria-pressed', String(!!selected));
        btn.setAttribute('aria-label', dayLabel({ y: view.y, m: view.m, d }, 'long') + (closed ? ', closed' : btn.disabled ? ', unavailable' : ''));
        btn.addEventListener('click', () => {
          state.date = { y: view.y, m: view.m, d };
          state.time = null;
          renderCalendar(); renderTimes(); update();
          timesEl.querySelector('.time')?.focus({ preventScroll: true });
        });
        calDays.append(btn);
      }
      const monthIndex = view.y * 12 + view.m;
      const nowIndex = NOW.y * 12 + NOW.m;
      calPrev.disabled = monthIndex <= nowIndex;
      calNext.disabled = monthIndex >= nowIndex + MONTHS_AHEAD;
    }

    function renderTimes() {
      timesEl.replaceChildren();
      const note = text => { const p = document.createElement('p'); p.className = 'times-empty'; p.textContent = text; timesEl.append(p); };
      if (!state.date) return note('Pick a day to see start times.');
      const slots = slotsFor(state.date.y, state.date.m, state.date.d);
      if (!slots.length) return note('No start times left that day for this service. Try another day.');
      if (state.time !== null && !slots.includes(state.time)) state.time = null;
      slots.forEach(t => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'time';
        btn.textContent = hourLabel(t, true);
        btn.setAttribute('aria-pressed', String(state.time === t));
        btn.addEventListener('click', () => { state.time = t; renderTimes(); update(); });
        timesEl.append(btn);
      });
    }

    function message() {
      const o = current();
      const name = nameInput.value.trim();
      let text = "Hi Mesha! I'd like to book: ";
      if (!o) text += 'a session';
      else if (o.qty) text += `${o.name} series, ${o.qty} sessions (${money(o.price)})`;
      else text += `${o.name} (${o.mins} min, ${money(o.price)})`;
      if (state.date) text += `${o && o.qty ? ', first session' : ''} on ${dayLabel(state.date, 'long')}`;
      if (state.time !== null) text += ` around ${hourLabel(state.time, true)}`;
      text += '.';
      if (name) text += ` My name is ${name}.`;
      return text + ' (Sent from your website)';
    }

    function setOut(el, value, empty) {
      el.textContent = value || empty;
      el.classList.toggle('is-empty', !value);
    }
    function update() {
      const o = current();
      setOut(out.service, o ? (o.qty ? `${o.name} series` : o.name) : '', 'Not chosen yet');
      setOut(out.dur, o ? (o.qty ? `${o.qty} × ${o.mins} min` : `${o.mins} min`) : '', 'Not chosen');
      setOut(out.day, state.date ? dayLabel(state.date) : '', 'Not chosen');
      setOut(out.time, state.time !== null ? hourLabel(state.time, true) : '', 'Not chosen');
      setOut(out.price, o ? money(o.price) : '', 'Not chosen');
      sendBtn.href = smsHref(message());
      steps[0]?.classList.toggle('is-done', !!o);
      steps[1]?.classList.toggle('is-done', !!state.date && state.time !== null);
      steps[2]?.classList.toggle('is-done', nameInput.value.trim().length > 1);
    }

    function choose(id) {
      if (!byId.has(id)) return;
      select.value = id;
      select.dispatchEvent(new Event('change'));
      summary.classList.remove('flash');
      void summary.offsetWidth;
      summary.classList.add('flash');
    }

    select.addEventListener('change', () => {
      select.classList.remove('is-invalid');
      bookError.hidden = true;
      renderCalendar(); renderTimes(); update();
    });
    sendBtn.addEventListener('click', e => {
      if (current()) return;
      e.preventDefault();
      e.stopPropagation();          // not a real lead, so don't fire the conversion
      select.classList.add('is-invalid');
      bookError.hidden = false;
      select.focus();
    });
    nameInput.addEventListener('input', update);
    calPrev.addEventListener('click', () => { view.m--; if (view.m < 0) { view.m = 11; view.y--; } renderCalendar(); });
    calNext.addEventListener('click', () => { view.m++; if (view.m > 11) { view.m = 0; view.y++; } renderCalendar(); });
    form.addEventListener('submit', e => e.preventDefault());

    copyBtn?.addEventListener('click', async () => {
      const text = message();
      let ok = false;
      try { await navigator.clipboard.writeText(text); ok = true; } catch (_) {
        const ta = Object.assign(document.createElement('textarea'), { value: text });
        ta.style.cssText = 'position:fixed;opacity:0';
        document.body.append(ta); ta.select();
        try { ok = document.execCommand('copy'); } catch (__) { /* ignore */ }
        ta.remove();
      }
      const label = copyBtn.lastChild;
      const original = ' Copy';
      label.textContent = ok ? ' Copied!' : ' Press ⌘/Ctrl+C';
      copyBtn.classList.toggle('copied', ok);
      track('book_copy');
      setTimeout(() => { label.textContent = original; copyBtn.classList.remove('copied'); }, 2200);
    });

    // "Book" on a service card → preselect it
    document.addEventListener('click', e => {
      const svcLink = e.target.closest('[data-book]');
      if (svcLink) {
        const card = svcLink.closest('.svc');
        const first = card.dataset.options.split(';')[0].split('|')[0];
        choose(`svc:${card.dataset.name}:${first}`);
        track('book_intent', { label: card.dataset.name });
        return;
      }
      const seriesLink = e.target.closest('[data-book-series]');
      if (seriesLink) {
        const pkg = seriesLink.closest('.pkg');
        const tier = $('.tier[aria-pressed="true"]', pkg) || $('.tier', pkg);
        choose(`series:${pkg.dataset.series}:${tier.dataset.qty}`);
        track('book_intent', { label: `${pkg.dataset.series} series` });
      }
    });

    // Late in the month there may be only a day or two left to pick from.
    // Open on next month instead so the calendar isn't a wall of greyed-out days.
    const lastDay = new Date(NOW.y, NOW.m + 1, 0).getDate();
    let openDays = 0;
    for (let d = NOW.d; d <= lastDay; d++) if (slotsFor(NOW.y, NOW.m, d).length) openDays++;
    if (openDays < 6) { view.m = (NOW.m + 1) % 12; view.y = NOW.m === 11 ? NOW.y + 1 : NOW.y; }

    renderCalendar(); renderTimes(); update();
  }

  /* ---------------------------------------------------------------
     Gift certificate: live preview + text request
     --------------------------------------------------------------- */
  (function gift() {
    const amount = $('#gift-amount');
    if (!amount) return;
    const preview = $('#gift-preview');
    const hint = $('#gift-hint');
    const forInput = $('#gift-for');
    const forPreview = $('#gift-for-preview');
    const send = $('#gift-send');
    const MIN = 10, MAX = 2000;

    function sync() {
      const raw = amount.value.trim();
      const n = raw === '' ? null : Math.round(Number(raw));
      const valid = n === null || (Number.isFinite(n) && n >= MIN && n <= MAX);
      preview.textContent = money(n === null || !Number.isFinite(n) ? 120 : Math.max(0, Math.min(n, 99999)));
      amount.classList.toggle('is-invalid', !valid);
      amount.setAttribute('aria-invalid', String(!valid));
      hint.classList.toggle('is-error', !valid);
      hint.textContent = valid ? 'Any amount from $10 to $2,000.'
        : n < MIN ? 'The minimum is $10.' : 'The maximum online is $2,000. Call Mesha for larger amounts.';

      const who = forInput.value.trim();
      forPreview.textContent = who ? `For ${who}` : 'For someone special';

      send.setAttribute('aria-disabled', String(!valid));
      const amt = n !== null && valid ? `${money(n)} ` : '';
      send.href = smsHref(`Hi Mesha! I'd like to buy a ${amt}gift certificate${who ? ` for ${who}` : ''}. (Sent from your website)`);
    }
    amount.addEventListener('input', sync);
    forInput.addEventListener('input', sync);
    send.addEventListener('click', e => {
      if (send.getAttribute('aria-disabled') === 'true') { e.preventDefault(); e.stopImmediatePropagation(); amount.focus(); }
    }, true);
    sync();

    // Card tilt + light sweep that follows the pointer
    const stage = $('.gift-stage');
    const card = $('#gift-card');
    if (stage && card && canHover && !reduced) {
      stage.addEventListener('pointermove', e => {
        const r = stage.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--ry', `${(px - 0.5) * 14}deg`);
        card.style.setProperty('--rx', `${(0.5 - py) * 12}deg`);
        card.style.setProperty('--gx', `${100 - px * 100}%`);
      });
      stage.addEventListener('pointerleave', () => {
        ['--rx', '--ry', '--gx'].forEach(p => card.style.removeProperty(p));
      });
    }
  })();

  /* ---------------------------------------------------------------
     Welcome video: controls appear only once playback starts
     --------------------------------------------------------------- */
  (function welcome() {
    const video = $('#welcome-video');
    const play = $('#welcome-play');
    if (!video || !play) return;
    play.addEventListener('click', () => {
      video.controls = true;
      play.classList.add('is-hidden');
      video.play().catch(() => {});
      track('video_play', { label: 'welcome' });
    });
    video.addEventListener('ended', () => {
      video.controls = false;
      play.classList.remove('is-hidden');
    });
  })();

  /* Ambient promo loop: only plays while on screen, never with reduced motion */
  $$('video[data-ambient]').forEach(v => {
    if (reduced) { v.removeAttribute('autoplay'); v.pause(); return; }
    if (!('IntersectionObserver' in window)) return;
    new IntersectionObserver(([en]) => { en.isIntersecting ? v.play().catch(() => {}) : v.pause(); }).observe(v);
  });

  /* ---------------------------------------------------------------
     Gallery lightbox (<dialog>: focus trap + Esc for free)
     --------------------------------------------------------------- */
  (function lightbox() {
    const shots = $$('#gallery .shot');
    const dlg = $('#lightbox');
    if (!shots.length || !dlg) return;
    const img = $('#lb-img');
    const cap = $('#lb-cap');
    const count = $('#lb-count');
    let index = 0;

    function show(i) {
      index = (i + shots.length) % shots.length;
      const shot = shots[index];
      const thumbImg = $('img', shot);
      img.src = shot.dataset.full;
      img.alt = thumbImg.alt;
      cap.textContent = thumbImg.alt;
      count.textContent = `${index + 1} / ${shots.length}`;
      img.style.animation = 'none'; void img.offsetWidth; img.style.animation = '';
    }

    shots.forEach((shot, i) => shot.addEventListener('click', () => {
      if (typeof dlg.showModal !== 'function') { window.open(shot.dataset.full, '_blank', 'noopener'); return; }
      show(i);
      dlg.showModal();
      document.documentElement.style.overflow = 'hidden';
    }));
    dlg.addEventListener('close', () => { document.documentElement.style.overflow = ''; });
    $('#lb-close').addEventListener('click', () => dlg.close());
    $('#lb-prev').addEventListener('click', () => show(index - 1));
    $('#lb-next').addEventListener('click', () => show(index + 1));
    dlg.addEventListener('click', e => { if (e.target === dlg || e.target.tagName === 'FIGURE') dlg.close(); });
    dlg.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
    let startX = null;
    dlg.addEventListener('pointerdown', e => { startX = e.clientX; });
    dlg.addEventListener('pointerup', e => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
      startX = null;
    });
  })();

  /* Footer year */
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
