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
  const bad = el.matches(':user-invalid') || el.classList.contains('is-invalid');
  bad ? el.setAttribute('aria-invalid', 'true') : el.removeAttribute('aria-invalid');
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

    if (endpoint) {
      submitBtn.disabled = true;
      try {
        const res = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        conds.forEach((c) => (c.hidden = true));
        show('Thank you — your enquiry has been sent.', "We'll get back to you with the next steps.");
      } catch {
        show('Your enquiry could not be sent.', 'Please try again, or contact us directly by phone or email.', { error: true });
      } finally {
        submitBtn.disabled = false;
      }
      return;
    }

    // No backend connected yet: hand the enquiry to the visitor's email app.
    const to = 'mysystemicsolution@gmail.com';
    const name = form.querySelector('[name="name"]')?.value || '';
    const href = `mailto:${to}?subject=${encodeURIComponent(`${form.dataset.subject} — ${name}`)}&body=${encodeURIComponent(body)}`;
    statusBox.querySelector('[data-fs-mailto]').href = href;
    statusBox.querySelector('[data-fs-copy]').onclick = async (ev) => {
      try { await navigator.clipboard.writeText(body); ev.currentTarget.lastChild.textContent = ' Copied'; } catch { /* clipboard unavailable */ }
    };
    window.location.href = href;
    show(
      'Almost there — please send the email.',
      `Your email app should open with your enquiry filled in. Press Send there to deliver it to ${to}. If nothing opened, copy the enquiry text and email it to us.`,
      { actions: true }
    );
  });
});

/* ---------- Custom cursor (fine pointers only, respects reduced motion) ---------- */
if (matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
  const dot = Object.assign(document.createElement('div'), { className: 'cursor-dot' });
  const ring = Object.assign(document.createElement('div'), { className: 'cursor-ring' });
  dot.setAttribute('aria-hidden', 'true');
  ring.setAttribute('aria-hidden', 'true');
  document.body.append(ring, dot);
  document.documentElement.classList.add('has-cursor');

  const interactive = 'a, button, summary, label, [role="button"], input[type="checkbox"], input[type="radio"], select';
  const textual = 'input:not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable]';
  let x = 0, y = 0, rx = 0, ry = 0, raf = 0, seen = false;

  const tick = () => {
    rx += (x - rx) * 0.18;
    ry += (y - ry) * 0.18;
    ring.style.translate = `${rx}px ${ry}px`;
    raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.1 ? requestAnimationFrame(tick) : 0;
  };

  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX; y = e.clientY;
    if (!seen) { rx = x; ry = y; seen = true; }
    dot.style.translate = `${x}px ${y}px`;
    document.documentElement.classList.add('cursor-visible');
    const t = e.target instanceof Element ? e.target : null;
    ring.classList.toggle('is-hover', !!t?.closest(interactive));
    document.documentElement.classList.toggle('cursor-text', !!t?.closest(textual));
    if (!raf) raf = requestAnimationFrame(tick);
  }, { passive: true });
  addEventListener('pointerdown', () => ring.classList.add('is-down'));
  addEventListener('pointerup', () => ring.classList.remove('is-down'));
  document.addEventListener('pointerleave', () => document.documentElement.classList.remove('cursor-visible'));
}
