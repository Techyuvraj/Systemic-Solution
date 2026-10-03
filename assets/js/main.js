// Systemic Solution — progressive enhancements. Everything works without JS
// except the mega menu toggle, filters and form submission helpers.
document.documentElement.classList.add('js');

/* ---------- Header scroll state ---------- */
const header = document.querySelector('[data-header]');
const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ---------- Mega menu ---------- */
document.querySelectorAll('[data-has-mega]').forEach((item) => {
  const btn = item.querySelector('.nav-trigger');
  let closeTimer;
  const set = (open) => {
    item.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
  };
  btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  const hover = matchMedia('(hover: hover)');
  item.addEventListener('pointerenter', (e) => { if (hover.matches && e.pointerType === 'mouse') { clearTimeout(closeTimer); set(true); } });
  item.addEventListener('pointerleave', (e) => { if (hover.matches && e.pointerType === 'mouse') closeTimer = setTimeout(() => set(false), 160); });
  item.addEventListener('focusout', (e) => { if (!item.contains(e.relatedTarget)) set(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && item.classList.contains('is-open')) { set(false); btn.focus(); }
  });
  document.addEventListener('click', (e) => { if (!item.contains(e.target)) set(false); });
});

/* ---------- Mobile nav ---------- */
const toggle = document.querySelector('[data-menu-toggle]');
const mobileNav = document.querySelector('[data-mobile-nav]');
if (toggle && mobileNav) {
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    mobileNav.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    header.classList.toggle('is-scrolled', open || window.scrollY > 12);
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileNav.hidden) { setMenu(false); toggle.focus(); }
  });
  matchMedia('(min-width: 1081px)').addEventListener('change', (e) => e.matches && setMenu(false));
}

/* ---------- Scroll reveal fallback (no scroll-driven animation support) ---------- */
if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)') && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
}

/* ---------- Active section highlighting (services jump nav, legal TOC) ---------- */
const spy = (linkSel) => {
  const links = [...document.querySelectorAll(linkSel)];
  if (!links.length || !('IntersectionObserver' in window)) return;
  const map = new Map(links.map((a) => [document.querySelector(a.getAttribute('href')), a]).filter(([s]) => s));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { links.forEach((l) => l.classList.remove('is-active')); map.get(en.target)?.classList.add('is-active'); }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  map.forEach((_, s) => io.observe(s));
};
spy('.svc-jump a');
spy('.legal-toc a');

/* ---------- Portfolio filter ---------- */
const filterWrap = document.querySelector('[data-filters]');
if (filterWrap) {
  const cards = [...document.querySelectorAll('[data-work-grid] > li')];
  const status = document.querySelector('[data-filter-status]');
  const apply = (cat) => {
    filterWrap.querySelectorAll('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === cat)));
    let n = 0;
    cards.forEach((c) => { const show = cat === 'all' || c.dataset.cat === cat; c.hidden = !show; n += show; });
    if (status) status.textContent = `Showing ${n} item${n === 1 ? '' : 's'}`;
  };
  filterWrap.addEventListener('click', (e) => {
    const b = e.target.closest('[data-filter]');
    if (!b) return;
    const run = () => apply(b.dataset.filter);
    document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches ? document.startViewTransition(run) : run();
  });
  const hash = location.hash.slice(1);
  if (hash && filterWrap.querySelector(`[data-filter="${CSS.escape(hash)}"]`)) apply(hash);
}

/* ---------- Forms ---------- */
// Sync aria-invalid with :user-invalid so assistive tech hears errors at the same time they appear.
const syncAria = (el) => {
  if (!el.matches?.('input, select, textarea')) return;
  try {
    const bad = el.matches(':user-invalid') || el.classList.contains('is-invalid');
    bad ? el.setAttribute('aria-invalid', 'true') : el.removeAttribute('aria-invalid');
  } catch {
    const bad = el.classList.contains('is-invalid') || (el.willValidate && !el.checkValidity());
    bad ? el.setAttribute('aria-invalid', 'true') : el.removeAttribute('aria-invalid');
  }
};
document.addEventListener('blur', (e) => syncAria(e.target), true);
document.addEventListener('input', (e) => {
  if (e.target.classList?.contains('is-invalid') && e.target.checkValidity()) {
    e.target.classList.remove('is-invalid');
    e.target.closest('.field')?.classList.remove('show-err');
  }
  if (e.target.getAttribute?.('aria-invalid') === 'true') syncAria(e.target);
});

document.querySelectorAll('[data-enquiry-form]').forEach((form) => {
  const statusBox = form.querySelector('[data-form-status]');
  const params = new URLSearchParams(location.search);

  // Service-specific fields on the quote form
  const conds = [...form.querySelectorAll('[data-cond]')];
  const showCond = () => {
    const val = form.querySelector('[name="service"]:checked')?.value;
    conds.forEach((c) => { c.hidden = c.dataset.cond !== val; });
    const step = form.querySelector('[data-svc-pick]')?.closest('.q-step');
    if (val && step) step.classList.remove('show-err');
  };
  form.addEventListener('change', (e) => { if (e.target.name === 'service') showCond(); });

  // Prefill from ?service= and ?package=
  const pre = params.get('service');
  if (pre) {
    const radio = form.querySelector(`input[name="service"][value="${CSS.escape(pre)}"]`);
    const select = form.querySelector(`select[name="service"]`);
    if (radio) radio.checked = true;
    else if (select && select.querySelector(`option[value="${CSS.escape(pre)}"]`)) select.value = pre;
    showCond();
  }
  const pkg = params.get('package');
  const pkgSel = form.querySelector('[name="package"]');
  if (pkg && pkgSel?.querySelector(`option[value="${CSS.escape(pkg)}"]`)) pkgSel.value = pkg;

  const collect = () => {
    const lines = [];
    const seen = new Set();
    [...form.elements].forEach((el) => {
      if (!el.name || seen.has(el.name) || el.type === 'submit' || el.closest('[hidden]')) return;
      let v = el.value;
      let label = form.querySelector(`label[for="${el.id}"]`)?.childNodes[0]?.textContent.trim() || el.name;
      if (el.type === 'radio') {
        seen.add(el.name);
        const c = form.querySelector(`[name="${el.name}"]:checked`);
        v = c ? c.closest('label').textContent.trim() : '';
        label = 'Service Required';
      } else if (el.tagName === 'SELECT') {
        v = el.value ? el.selectedOptions[0].textContent.trim() : '';
      }
      if (v) lines.push(`${label}: ${v}`);
    });
    return lines.join('\n');
  };

  const show = (title, text, { error = false, actions = false } = {}) => {
    statusBox.hidden = false;
    statusBox.classList.toggle('is-error', error);
    statusBox.querySelector('[data-fs-title]').textContent = title;
    statusBox.querySelector('[data-fs-text]').textContent = text;
    statusBox.querySelector('[data-fs-actions]').hidden = !actions;
    statusBox.focus();
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const controls = [...form.elements].filter((el) => el.willValidate && !el.closest('[hidden]'));
    const invalid = controls.filter((el) => !el.checkValidity());
    controls.forEach((el) => {
      const bad = !el.checkValidity();
      if (el.type === 'radio') {
        el.closest('.q-step')?.classList.toggle('show-err', bad);
        return;
      }
      el.classList.toggle('is-invalid', bad);
      el.closest('.field')?.classList.toggle('show-err', bad);
      bad ? el.setAttribute('aria-invalid', 'true') : el.removeAttribute('aria-invalid');
    });
    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    const endpoint = form.dataset.endpoint;
    const body = collect();
    const submitBtn = form.querySelector('[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';

    // Collect structured data for database/Supabase
    const collectData = () => {
      const data = {};
      const seen = new Set();
      [...form.elements].forEach((el) => {
        if (!el.name || seen.has(el.name) || el.type === 'submit' || el.closest('[hidden]')) return;
        if (el.type === 'radio') {
          seen.add(el.name);
          const c = form.querySelector(`[name="${el.name}"]:checked`);
          if (c && c.value) data[el.name] = c.value;
        } else if (el.tagName === 'SELECT') {
          if (el.value) data[el.name] = el.value;
        } else if (el.value?.trim()) {
          data[el.name] = el.value.trim();
        }
      });
      data.form_type = form.dataset.formType || (form.dataset.subject?.toLowerCase().includes('quote') ? 'quote' : 'contact');
      data.summary = body;
      return data;
    };

    // Supabase Submission
    const cfg = window.SUPABASE_CONFIG || {};
    const url = `${(cfg.url || 'https://addimjcmwkvxbehudush.supabase.co').replace(/\/+$/, '')}/rest/v1/${cfg.tableName || 'enquiries'}`;
    const anonKey = cfg.anonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkZGltamNtd2t2eGJlaHVkdXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwMDQyMzQsImV4cCI6MjEwNjU4MDIzNH0.bZQIvGYMRt_jbTPdCWeQpTPYx_gBHp904iiYpo4r6f4';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    try {
      const payload = collectData();
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const msg = errJson.message || `Error ${res.status}`;
        throw new Error(msg);
      }



      // Send branded notification email to mysystemicsolution@gmail.com
      try {
        await fetch('/api/send-enquiry-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (e) {
        console.warn('Email dispatch notification:', e);
      }

      form.reset();
      conds.forEach((c) => (c.hidden = true));
      show('Thank you — your enquiry has been sent.', "We'll review your details and get back to you shortly.");
    } catch (err) {
      console.error('Supabase submission failed:', err);
      const isRls = err.message && err.message.toLowerCase().includes('row-level security');
      const detail = isRls
        ? 'Database RLS policy is blocking inserts. Please run the SQL policy in Supabase.'
        : 'Please check your connection and try again, or contact us directly.';
      show('Your enquiry could not be sent.', detail, { error: true });
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    }
  });
});


/* ---------- GSAP motion (loaded from CDN; the page is complete without it) ---------- */
const startMotion = () => {
  const { gsap, ScrollTrigger, SplitText } = window;
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger, ...(SplitText ? [SplitText] : []));
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    document.documentElement.classList.add('gsap-on');

    // Hero: words rise in, flairs pop with an elastic ease, then loop gently
    const title = document.querySelector('[data-hero-title]');
    if (title) {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from(title.querySelectorAll('.w'), { yPercent: 60, opacity: 0, duration: 1.2, stagger: 0.09 })
        .from(title.querySelectorAll('.flair'), { scale: 0, rotate: -90, duration: 1.4, ease: 'elastic.out(1, 0.5)', stagger: 0.1 }, 0.35)
        .from('.gs-hero-tail', { opacity: 0, y: 20, duration: 0.9 }, 0.7)
        .from('[data-hero-foot] > *', { opacity: 0, y: 24, duration: 0.9, stagger: 0.1 }, 0.85);
      gsap.to('.flair-windmill .spin', { rotate: 360, duration: 14, repeat: -1, ease: 'none' });
      gsap.to('.flair-star .spin', { rotate: -360, duration: 10, repeat: -1, ease: 'none' });
      gsap.to('.flair-circles .pulse', { scale: 0.85, duration: 1.4, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.2, transformOrigin: '50% 50%' });
      gsap.to('.flair-worm .wiggle', { scaleX: 0.82, skewX: -8, duration: 1.1, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      const bolt = document.querySelector('.flair-bolt .draw');
      if (bolt) {
        const len = bolt.getTotalLength();
        gsap.fromTo(bolt, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.6, delay: 0.6, ease: 'power2.inOut' });
      }
    }

    // Intro paragraph: words light up as it scrolls through the viewport
    document.querySelectorAll('[data-split-reveal]').forEach((el) => {
      if (!SplitText) return;
      const split = new SplitText(el, { type: 'words', wordsClass: 'sw' });
      gsap.fromTo(split.words, { opacity: 0.16 }, {
        opacity: 1, stagger: 0.05, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
      });
    });

    // Generic reveals
    const show = (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08, overwrite: true });
    gsap.set('.reveal', { opacity: 0, y: 36 });
    ScrollTrigger.batch('.reveal', {
      start: 'top 88%',
      once: true,
      onEnter: show, onEnterBack: show, onLeave: show,
    });

    // Process cards: fan in with a slight rotation
    gsap.utils.toArray('.gs-card').forEach((card, i) => {
      gsap.from(card, { y: 80, rotate: i % 2 ? 3 : -3, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 90%' } });
    });

    // Service artwork shapes drift in
    gsap.utils.toArray('.gs-tool-art svg').forEach((svg) => {
      gsap.from(svg.querySelectorAll('.art-a, .art-b'), { scale: 0.4, opacity: 0, transformOrigin: '50% 50%', duration: 1.2, ease: 'back.out(1.8)', stagger: 0.12, scrollTrigger: { trigger: svg, start: 'top 85%' } });
    });

    // Footer wordmark slides up letter group by group
    gsap.from('.footer-word span', { yPercent: 40, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.15, scrollTrigger: { trigger: '.footer-word', start: 'top 95%' } });
  });

  // Why cards: pin the section and scroll the track sideways on wide screens
  mm.add('(min-width: 761px) and (prefers-reduced-motion: no-preference)', () => {
    const section = document.querySelector('[data-hscroll]');
    const track = section?.querySelector('[data-hscroll-track]');
    if (!track) return;
    section.classList.add('is-pinned');
    const distance = () => Math.max(0, track.scrollWidth - document.documentElement.clientWidth);
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: { trigger: section.querySelector('.gs-why-pin'), start: 'center center', end: () => '+=' + distance(), pin: true, scrub: 0.6, invalidateOnRefresh: true },
    });
    gsap.utils.toArray(track.children).forEach((card, i) => {
      gsap.from(card, { rotate: i % 2 ? 4 : -4, y: 40, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 100%', end: 'left 60%', scrub: true } });
    });
    return () => section.classList.remove('is-pinned');
  });

  // Fonts change line widths; re-measure once they are in
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
};
// Scripts are deferred and run in order, so GSAP is already defined here when it loaded.
startMotion();
