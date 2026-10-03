import * as C from './content.js';
import { icon } from './icons.js';
import { page, breadcrumbs, breadcrumbLd, esc, tel } from './layout.js';
import { SITE_URL } from './config.js';

const { brand, services } = C;
const svc = (slug) => services.find((s) => s.slug === slug);
const pad = (n) => String(n).padStart(2, '0');

/* ---------- shared pieces ---------- */

const img = (file, alt, { w = 600, h = 460, eager = false, cls = '' } = {}) =>
  `<img class="${cls}" src="/assets/img/${file}" alt="${esc(alt)}" width="${w}" height="${h}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;

const eyebrow = (t) => `<p class="eyebrow">${t}</p>`;

const ctaBlock = (text, primary, secondary) => `
<section class="section cta-block" aria-labelledby="cta-h">
  <div class="container">
    <div class="cta-card reveal">
      <div class="cta-glow" aria-hidden="true"></div>
      <h2 id="cta-h" class="cta-text">${text}</h2>
      <div class="btn-row">
        <a class="btn btn-primary btn-lg" href="${primary.href}">${primary.label} ${icon('arrow')}</a>
        ${secondary ? `<a class="btn btn-ghost btn-lg" href="${secondary.href}">${secondary.label}</a>` : ''}
      </div>
    </div>
  </div>
</section>`;

const faqItems = (ids) =>
  C.faqs.items
    .filter((f) => !ids || ids.includes(f.id))
    .map(
      (f) => `<details class="acc" id="faq-${f.id}">
  <summary class="acc-q"><h3>${f.q}</h3><span class="acc-icon" aria-hidden="true">${icon('plus', 'ico')}</span></summary>
  <div class="acc-a"><p>${f.a}</p></div>
</details>`
    )
    .join('');

const faqSection = (ids, title = 'Frequently Asked Questions') => `
<section class="section" aria-labelledby="faq-h">
  <div class="container split-faq">
    <div class="reveal">
      ${eyebrow('FAQs')}
      <h2 id="faq-h" class="h2">${title}</h2>
      <a class="link-arrow" href="/faqs/">View all FAQs ${icon('arrow')}</a>
    </div>
    <div class="acc-group reveal">${faqItems(ids)}</div>
  </div>
</section>`;

const pageHero = ({ trail, label, h1, intro, visual, cls = '' }) => `
<section class="page-hero ${cls}">
  <div class="hero-bg" aria-hidden="true"><span class="orb orb-1"></span><span class="orb orb-2"></span><span class="grid-lines"></span></div>
  <div class="container page-hero-inner${visual ? ' has-visual' : ''}">
    <div class="page-hero-copy">
      ${breadcrumbs(trail)}
      ${label ? eyebrow(label) : ''}
      <h1 class="h1">${h1}</h1>
      ${intro ? `<p class="lead">${intro}</p>` : ''}
    </div>
    ${visual ? `<div class="page-hero-visual">${visual}</div>` : ''}
  </div>
</section>`;

const serviceLd = (s, description) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: s.name,
  description,
  provider: { '@type': 'Organization', name: brand.name, url: SITE_URL + '/' },
  url: `${SITE_URL}/${s.slug}/`,
});

const iconList = (items, cls = '') =>
  `<ul class="icon-list ${cls}" role="list">${items
    .map(([t, ic], i) => `<li class="reveal" style="--i:${i}"><span class="il-ico">${icon(ic)}</span><span>${t}</span></li>`)
    .join('')}</ul>`;

const relatedServices = (current) => `
<section class="section related" aria-labelledby="rel-h">
  <div class="container">
    <div class="section-head reveal"><h2 id="rel-h" class="h3">Other services</h2><a class="link-arrow" href="/services/">View All Services ${icon('arrow')}</a></div>
    <ul class="related-grid" role="list">
      ${services
        .filter((s) => s.slug !== current)
        .map(
          (s) => `<li class="reveal"><a class="related-card" href="/${s.slug}/"><span class="rc-ico">${icon(s.icon)}</span><span class="rc-name">${s.name}</span><span class="rc-desc">${s.short}</span>${icon('arrow-ur', 'ico rc-arrow')}</a></li>`
        )
        .join('')}
    </ul>
  </div>
</section>`;

/* ---------- HOME ---------- */

// Decorative shapes dropped between the hero words (GSAP-style "flair").
// Pure brand-palette SVG, aria-hidden, animated by main.js when GSAP loads.
const flair = {
  windmill: `<svg class="flair flair-windmill" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><g class="spin"><path d="M50 50V0a50 50 0 0 1 50 50z" fill="var(--cyan)"/><path d="M50 50h50a50 50 0 0 1-50 50z" fill="var(--violet)"/><path d="M50 50v50A50 50 0 0 1 0 50z" fill="var(--magenta)"/><path d="M50 50H0A50 50 0 0 1 50 0z" fill="var(--electric)"/></g></svg>`,
  star: `<svg class="flair flair-star" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><g class="spin" fill="none" stroke="var(--magenta)" stroke-width="13" stroke-linecap="round"><path d="M50 8v84M8 50h84M20 20l60 60M80 20 20 80"/></g></svg>`,
  bolt: `<svg class="flair flair-bolt" viewBox="0 0 60 100" aria-hidden="true" focusable="false"><path class="draw" d="M38 4 8 58h22l-8 38 30-56H30z" fill="none" stroke="var(--cyan)" stroke-width="4" stroke-linejoin="round"/></svg>`,
  worm: `<svg class="flair flair-worm" viewBox="0 0 120 60" aria-hidden="true" focusable="false"><defs><linearGradient id="fw" x1="0" x2="1"><stop offset="0" stop-color="var(--violet)"/><stop offset="1" stop-color="var(--electric)"/></linearGradient></defs><path class="wiggle" d="M10 40c10-26 20-26 30 0s20 26 30 0 20-26 30 0" fill="none" stroke="url(#fw)" stroke-width="16" stroke-linecap="round"/></svg>`,
  circles: `<svg class="flair flair-circles" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><circle class="pulse" cx="50" cy="50" r="46" fill="var(--electric)"/><circle class="pulse" cx="50" cy="50" r="30" fill="var(--violet)"/><circle class="pulse" cx="50" cy="50" r="14" fill="var(--cyan)"/></svg>`,
};

// Accent colour per service row / highlight, cycling through the brand palette.
const accents = ['cyan', 'violet', 'magenta', 'electric'];

// Per-service artwork for the "tools"-style rows.
const svcArt = {
  'web-development': `<svg viewBox="0 0 240 160" aria-hidden="true" focusable="false"><rect x="20" y="22" width="200" height="120" rx="14" fill="none" stroke="currentColor" stroke-width="3"/><path d="M20 50h200" stroke="currentColor" stroke-width="3"/><circle cx="38" cy="36" r="5" fill="currentColor"/><circle cx="54" cy="36" r="5" fill="currentColor" opacity=".6"/><circle cx="70" cy="36" r="5" fill="currentColor" opacity=".3"/><path class="art-a" d="m92 78-22 18 22 18M148 78l22 18-22 18" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path class="art-b" d="m130 72-20 48" stroke="currentColor" stroke-width="7" stroke-linecap="round"/></svg>`,
  'ecommerce-development': `<svg viewBox="0 0 240 160" aria-hidden="true" focusable="false"><path class="art-a" d="M70 58h100l-10 76H80z" fill="currentColor" opacity=".9"/><path d="M96 58v-8a24 24 0 0 1 48 0v8" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><circle class="art-b" cx="186" cy="44" r="16" fill="none" stroke="currentColor" stroke-width="4"/><circle class="art-b" cx="44" cy="120" r="10" fill="currentColor" opacity=".5"/></svg>`,
  'graphic-design': `<svg viewBox="0 0 240 160" aria-hidden="true" focusable="false"><circle class="art-a" cx="92" cy="80" r="44" fill="currentColor" opacity=".85"/><rect class="art-b" x="118" y="44" width="78" height="78" rx="10" fill="none" stroke="currentColor" stroke-width="5" transform="rotate(12 157 83)"/><path class="art-a" d="M40 136 70 100l20 36z" fill="currentColor" opacity=".4"/></svg>`,
  'video-editing': `<svg viewBox="0 0 240 160" aria-hidden="true" focusable="false"><rect x="34" y="30" width="172" height="100" rx="18" fill="none" stroke="currentColor" stroke-width="4"/><path class="art-a" d="m104 58 44 22-44 22z" fill="currentColor"/><path class="art-b" d="M34 146h172" stroke="currentColor" stroke-width="4" stroke-linecap="round" opacity=".35"/><path class="art-b" d="M34 146h84" stroke="currentColor" stroke-width="6" stroke-linecap="round"/></svg>`,
};

// Highlights phrases inside the intro paragraph, each in its own accent.
const highlight = (text, phrases) =>
  phrases.reduce((t, p, i) => t.replace(p, `<span class="hl hl-${accents[i % accents.length]}">${p}</span>`), text);

const subtitle = (text, id, tag = 'h2') => `<${tag}${id ? ` id="${id}"` : ''} class="gs-sub">${text}</${tag}>`;

const home = () => {
  const h = C.home;
  // "Build Your Digital Presence" | "With Systemic Solution"
  const [lead, tail] = h.hero.title.split(' With ');
  const words = lead.split(' ');
  const body = `
<section class="gs-hero" aria-labelledby="hero-h">
  <div class="container">
    <h1 id="hero-h" class="gs-hero-title" data-hero-title>
      <span class="hl-line"><span class="w">${words[0]}</span>${flair.windmill}<span class="w">${words[1]}</span></span>
      <span class="hl-line hl-indent"><span class="w">${words[2]}</span>${flair.star}</span>
      <span class="hl-line">${flair.bolt}<span class="w">${words[3]}</span>${flair.worm}</span>
      <span class="gs-hero-tail">With ${tail}</span>
    </h1>
    <div class="gs-hero-foot" data-hero-foot>
      <p class="gs-hero-text">${h.hero.text}</p>
      <div class="btn-row">
        <a class="btn btn-ghost btn-lg" href="/services/">Explore Services</a>
        <a class="btn btn-primary btn-lg" href="/contact/">${h.hero.cta} ${icon('arrow')}</a>
      </div>
    </div>
  </div>
</section>

<section class="section gs-intro" aria-labelledby="intro-h">
  <div class="container">
    ${subtitle('Introduction', 'intro-h')}
    <p class="gs-intro-text" data-split-reveal>${highlight(h.intro, ['modern, responsive', 'website development', 'e-commerce solutions', 'graphic design', 'video editing'])}</p>
  </div>
</section>

<section class="gs-why" aria-labelledby="why-h" data-hscroll>
  <div class="gs-why-pin">
    <div class="container gs-why-head">
      ${subtitle('Why Systemic Solution?', 'why-h')}
      <a class="link-arrow" href="/about/">About Us ${icon('arrow')}</a>
    </div>
    <ul class="gs-why-track" role="list" data-hscroll-track>
      ${h.why
        .map(
          (w, i) => `<li class="gs-why-item a-${accents[i % accents.length]}"><span class="gs-why-ico">${icon(w.icon)}</span><span class="gs-why-n" aria-hidden="true">${pad(i + 1)}</span><h3 class="gs-why-t">${w.t}</h3></li>`
        )
        .join('')}
    </ul>
  </div>
</section>

<section class="section gs-tools" aria-labelledby="svc-h">
  <div class="container">
    <div class="gs-tools-head">
      ${subtitle('Our Services', 'svc-h')}
      <a class="link-arrow" href="/services/">View All Services ${icon('arrow')}</a>
    </div>
    <ol class="gs-tools-rows" role="list">
      ${services
        .map(
          (s, i) => `<li class="gs-tool a-${accents[i % accents.length]} reveal">
        <a class="gs-tool-art" href="/${s.slug}/" tabindex="-1" aria-hidden="true">${svcArt[s.slug]}</a>
        <h3 class="gs-tool-name"><a href="/${s.slug}/">${s.name}</a></h3>
        <p class="gs-tool-text">${s.short}</p>
        <a class="btn btn-ghost gs-tool-btn" href="/${s.slug}/">${s.name} ${icon('arrow')}</a>
      </li>`
        )
        .join('')}
    </ol>
  </div>
</section>

<section class="section gs-process" aria-labelledby="pt-h">
  <div class="container">
    <div class="gs-tools-head">
      ${subtitle(C.processPage.h1, 'pt-h')}
      <a class="link-arrow" href="/process/">Our Process ${icon('arrow')}</a>
    </div>
    <ol class="gs-cards" role="list">
      ${C.processPage.steps
        .map(
          (st, i, all) => `<li class="gs-card a-${accents[i % accents.length]}" style="--i:${i}">
        <span class="gs-card-top"><span class="gs-card-ico">${icon(st.icon)}</span><span class="gs-card-n" aria-hidden="true">${pad(i + 1)}/${pad(all.length)}</span></span>
        <h3 class="gs-card-t">${st.t}</h3>
        <p>${st.d}</p>
      </li>`
        )
        .join('')}
    </ol>
  </div>
</section>

<section class="section gs-showcase" aria-labelledby="wt-h">
  <div class="container">
    ${subtitle(C.portfolio.h1, 'wt-h')}
    <p class="gs-showcase-text reveal">${C.portfolio.intro}</p>
    <ul class="gs-pills reveal" role="list">${C.portfolio.categories.map((c, i) => `<li><a class="a-${accents[i % accents.length]}" href="/portfolio/#${slugify(c)}">${c}</a></li>`).join('')}</ul>
    <a class="btn btn-ghost" href="/portfolio/">Portfolio ${icon('arrow')}</a>
  </div>
</section>

<section class="section gs-price" aria-labelledby="pb-h">
  <div class="container">
    <a class="gs-price-card reveal" href="/pricing/">
      <h2 id="pb-h" class="gs-price-title">${C.pricing.h1}</h2>
      <p class="gs-price-amt"><span>1 Page Website — Starting from</span><strong>${C.pricing.websites[0].price}</strong></p>
      <span class="gs-price-go" aria-hidden="true">${icon('arrow-ur')}</span>
    </a>
  </div>
</section>

${ctaBlock(h.closing, { href: '/contact/', label: 'Contact Us' }, { href: '/request-a-quote/', label: 'Request a Quote' })}`;
  return page({ path: '/', seo: h.seo, body, bodyClass: 'is-home' });
};

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/* ---------- ABOUT ---------- */

const about = () => {
  const a = C.about;
  const trail = [{ name: 'About Us', href: '/about/' }];
  const body = `
${pageHero({
  trail,
  label: 'About Us',
  h1: a.h1,
  intro: a.body[0],
  visual: img('illo-about.svg', 'Abstract illustration of connected web, e-commerce, design and video services around the Systemic Solution mark', { w: 600, h: 600, eager: true }),
  cls: 'about-hero',
})}

<section class="section" aria-label="Our focus">
  <div class="container about-focus">
    <p class="statement reveal">${a.body[1]}</p>
    <ul class="focus-pills reveal" role="list">
      <li>${icon('layout', 'ico ico-sm')} clean design</li>
      <li>${icon('devices', 'ico ico-sm')} responsive experiences</li>
      <li>${icon('message', 'ico ico-sm')} clear communication</li>
      <li>${icon('target', 'ico ico-sm')} business objectives</li>
    </ul>
  </div>
</section>

<section class="section approach" aria-labelledby="ap-h">
  <div class="container approach-grid">
    <div class="approach-head">
      <div class="sticky reveal">
        ${eyebrow('How we think')}
        <h2 id="ap-h" class="h2">Our Approach</h2>
        <a class="link-arrow" href="/process/">Our Process ${icon('arrow')}</a>
      </div>
    </div>
    <ol class="approach-list" role="list">
      ${a.approach
        .map(
          (s, i) => `<li class="approach-item reveal"><span class="ap-num">${pad(i + 1)}</span><span class="ap-ico">${icon(s.icon)}</span><div><h3 class="h4">${s.t}</h3><p>${s.d}</p></div></li>`
        )
        .join('')}
    </ol>
  </div>
</section>

<section class="section mission" aria-labelledby="mi-h">
  <div class="container">
    <figure class="mission-card reveal">
      <h2 id="mi-h" class="eyebrow">Our Mission</h2>
      <blockquote><p>${a.mission}</p></blockquote>
    </figure>
  </div>
</section>

${ctaBlock(a.cta, { href: '/contact/', label: 'Contact Us' }, { href: '/services/', label: 'Our Services' })}`;
  return page({ path: '/about/', seo: a.seo, body, ld: [breadcrumbLd(trail)] });
};

/* ---------- SERVICES ---------- */

const offerFor = { 'web-development': C.webDev.offer, 'ecommerce-development': C.ecommerce.offer, 'graphic-design': C.graphic.offer, 'video-editing': C.video.offer };

const servicesOverview = () => {
  const p = C.servicesPage;
  const trail = [{ name: 'Services', href: '/services/' }];
  const body = `
${pageHero({ trail, label: 'Our Services', h1: p.h1, intro: p.intro, cls: 'center-hero' })}

<nav class="svc-jump container" aria-label="Services on this page">
  <ul role="list">${services.map((s, i) => `<li><a href="#${s.slug}"><span>${pad(i + 1)}</span>${s.name}</a></li>`).join('')}</ul>
</nav>

${services
  .map(
    (s, i) => `
<section class="section svc-feature${i % 2 ? ' flip' : ''}" id="${s.slug}" aria-labelledby="${s.slug}-h">
  <div class="container svc-feature-grid">
    <div class="svc-feature-media reveal">
      <span class="svc-feature-num" aria-hidden="true">${pad(i + 1)}</span>
      ${img(s.illo, `Illustration representing ${s.name.toLowerCase()} by Systemic Solution`)}
    </div>
    <div class="svc-feature-copy reveal">
      <span class="chip-ico">${icon(s.icon)}</span>
      <h2 id="${s.slug}-h" class="h2">${s.name}</h2>
      <p class="lead">${s.overview}</p>
      <ul class="check-list" role="list">${offerFor[s.slug].slice(0, 4).map(([t]) => `<li>${icon('check', 'ico ico-sm')}${t}</li>`).join('')}</ul>
      <a class="btn btn-ghost" href="/${s.slug}/">Explore ${s.name} ${icon('arrow')}</a>
    </div>
  </div>
</section>`
  )
  .join('')}

${ctaBlock(p.cta, { href: '/request-a-quote/', label: 'Request a Quote' }, { href: '/pricing/', label: 'View Pricing' })}`;
  return page({ path: '/services/', seo: p.seo, body, ld: [breadcrumbLd(trail)] });
};

/* ---------- WEB DEVELOPMENT ---------- */

const svcHero = (s, h1, intro, label) =>
  pageHero({
    trail: [{ name: 'Services', href: '/services/' }, { name: s.name, href: `/${s.slug}/` }],
    label: label || s.name,
    h1,
    intro,
    visual: img(s.illo, `Illustration representing ${s.name.toLowerCase()} services`, { eager: true }),
    cls: 'svc-hero',
  });

const svcTrail = (s) => [{ name: 'Services', href: '/services/' }, { name: s.name, href: `/${s.slug}/` }];

const webDevelopment = () => {
  const w = C.webDev;
  const s = svc('web-development');
  const body = `
${svcHero(s, w.h1, w.intro)}

<section class="section" aria-labelledby="wo-h">
  <div class="container offer-split">
    <div class="reveal">${eyebrow('Web Development')}<h2 id="wo-h" class="h2">What We Offer</h2></div>
    ${iconList(w.offer, 'two-col')}
  </div>
</section>

<section class="section flow-section" aria-labelledby="dp-h">
  <div class="container">
    <div class="section-head reveal"><div>${eyebrow('Workflow')}<h2 id="dp-h" class="h2">Our Development Process</h2></div><a class="link-arrow" href="/process/">Our Process ${icon('arrow')}</a></div>
    <ol class="flow" role="list">
      ${w.process.map((t, i) => `<li class="flow-step reveal" style="--i:${i}"><span class="flow-num">${pad(i + 1)}</span><span class="flow-t">${t}</span></li>`).join('')}
    </ol>
  </div>
</section>

<section class="section" aria-labelledby="rd-h">
  <div class="container media-split">
    <div class="reveal">${img('illo-responsive.svg', 'The same website layout adapting across desktop, tablet and phone screens', { w: 600, h: 400 })}</div>
    <div class="reveal">
      ${eyebrow('Responsive')}
      <h2 id="rd-h" class="h2">Why Responsive Design Matters</h2>
      <p class="lead">${w.responsive}</p>
      <ul class="device-tags" role="list"><li>${icon('phone-v', 'ico ico-sm')} phones</li><li>${icon('layout', 'ico ico-sm')} tablets</li><li>${icon('devices', 'ico ico-sm')} desktops</li></ul>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="wp-h">
  <div class="container">
    <div class="section-head reveal"><div>${eyebrow('Pricing')}<h2 id="wp-h" class="h2">Website Packages</h2></div><a class="link-arrow" href="/pricing/">View Pricing ${icon('arrow')}</a></div>
    ${packageCards(true)}
  </div>
</section>

${faqSection(['website-cost', 'domain-hosting', 'revisions'])}
${relatedServices(s.slug)}
${ctaBlock(w.cta, { href: '/request-a-quote/', label: 'Request a Quote' }, { href: '/contact/', label: 'Contact Us' })}`;
  return page({ path: `/${s.slug}/`, seo: w.seo, body, ld: [breadcrumbLd(svcTrail(s)), serviceLd(s, w.seo.description)] });
};

const packageCards = (compact = false) => `
<ul class="pkg-grid${compact ? ' compact' : ''}" role="list">
  ${C.pricing.websites
    .map(
      (p, i) => `<li class="pkg reveal${i === 2 ? ' pkg-accent' : ''}" style="--i:${i}">
    <div class="pkg-top"><span class="pkg-pages" aria-hidden="true">${p.pages}</span><h3 class="pkg-name">${p.name}</h3></div>
    <p class="pkg-price"><span class="pkg-from">Starting from</span><span class="pkg-amt">${p.price}</span></p>
    <a class="pkg-link" href="/request-a-quote/?service=web-development&amp;package=${encodeURIComponent(p.name)}">Request a Quote ${icon('arrow', 'ico ico-sm')}<span class="sr-only"> for ${p.name}</span></a>
  </li>`
    )
    .join('')}
</ul>`;

/* ---------- E-COMMERCE ---------- */

const ecommerceDevelopment = () => {
  const e = C.ecommerce;
  const s = svc('ecommerce-development');
  const body = `
${svcHero(s, e.h1, e.intro)}

<section class="section" aria-labelledby="es-h">
  <div class="container">
    <div class="section-head reveal"><div>${eyebrow('E-Commerce Development')}<h2 id="es-h" class="h2">E-Commerce Services</h2></div></div>
    <ul class="tile-grid five" role="list">
      ${e.offer.map(([t, ic], i) => `<li class="tile reveal" style="--i:${i}"><span class="tile-ico">${icon(ic)}</span><span class="tile-n" aria-hidden="true">${pad(i + 1)}</span><h3 class="tile-t">${t}</h3></li>`).join('')}
    </ul>
  </div>
</section>

<section class="section" aria-label="Store operations">
  <div class="container duo">
    <article class="panel panel-grad reveal" aria-labelledby="pu-h">
      <span class="chip-ico">${icon('repeat')}</span>
      <h2 id="pu-h" class="h3">Product Update Process</h2>
      <p>${e.updateProcess}</p>
      <ol class="mini-steps" role="list" aria-label="Product update handover">
        <li><span>${icon('box', 'ico ico-sm')}</span>Demo product setup</li>
        <li><span>${icon('file', 'ico ico-sm')}</span>Product update process documentation</li>
      </ol>
    </article>
    <article class="panel reveal" aria-labelledby="tp-h">
      <span class="chip-ico chip-muted">${icon('info')}</span>
      <h2 id="tp-h" class="h3">Third-Party Services</h2>
      <p>${e.thirdParty}</p>
    </article>
  </div>
</section>

<section class="section" aria-labelledby="ep-h">
  <div class="container">
    <div class="price-hero reveal">
      <div>${eyebrow('Pricing')}<h2 id="ep-h" class="h3">E-Commerce</h2></div>
      <p class="price-big"><span class="pkg-from">Starting from</span><span class="grad-text">${C.pricing.ecommerce.price}</span></p>
      <p class="muted">${C.pricing.ecommerce.rest.charAt(0).toUpperCase() + C.pricing.ecommerce.rest.slice(1)}</p>
      <a class="btn btn-ghost" href="/pricing/">View Pricing ${icon('arrow')}</a>
    </div>
  </div>
</section>

${faqSection(['ecommerce', 'product-updates', 'domain-hosting'])}
${relatedServices(s.slug)}
${ctaBlock(e.cta, { href: '/request-a-quote/?service=ecommerce-development', label: 'Request a Quote' }, { href: '/contact/', label: 'Contact Us' })}`;
  return page({ path: `/${s.slug}/`, seo: e.seo, body, ld: [breadcrumbLd(svcTrail(s)), serviceLd(s, e.seo.description)] });
};

/* ---------- GRAPHIC DESIGN ---------- */

const graphicDesign = () => {
  const g = C.graphic;
  const s = svc('graphic-design');
  const body = `
${svcHero(s, g.h1, g.intro)}

<section class="section" aria-labelledby="gs-h">
  <div class="container">
    <div class="section-head reveal"><div>${eyebrow('Graphic Design')}<h2 id="gs-h" class="h2">Graphic Design Services</h2></div></div>
    <ul class="bento-design" role="list">
      ${g.offer.map(([t, ic], i) => `<li class="bd-tile reveal bd-${i + 1}" style="--i:${i}"><span class="tile-ico">${icon(ic)}</span><h3 class="tile-t">${t}</h3></li>`).join('')}
    </ul>
  </div>
</section>

<section class="section" aria-labelledby="da-h">
  <div class="container approach-orbit">
    <div class="orbit reveal" aria-hidden="true">
      <span class="orbit-core">${icon('pen')}</span>
      ${g.approachTerms.map((t, i) => `<span class="orbit-term o-${i + 1}">${t}</span>`).join('')}
    </div>
    <div class="reveal">
      ${eyebrow('Process')}
      <h2 id="da-h" class="h2">Our Design Approach</h2>
      <p class="lead">${g.approach}</p>
      <ul class="focus-pills" role="list">${g.approachTerms.map((t) => `<li>${icon('check', 'ico ico-sm')} ${t}</li>`).join('')}</ul>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="gp-h">
  <div class="container">
    <div class="note-band reveal">
      <span class="chip-ico">${icon('info')}</span>
      <div><h2 id="gp-h" class="h4">Graphic Design &amp; Video Editing pricing</h2><p>${C.pricing.creative}</p></div>
      <a class="btn btn-ghost btn-sm" href="/pricing/">View Pricing</a>
    </div>
  </div>
</section>

${faqSection(['graphic-design', 'revisions', 'client-provides'])}
${relatedServices(s.slug)}
${ctaBlock(g.cta, { href: '/request-a-quote/?service=graphic-design', label: 'Request a Quote' }, { href: '/portfolio/', label: 'Portfolio' })}`;
  return page({ path: `/${s.slug}/`, seo: g.seo, body, ld: [breadcrumbLd(svcTrail(s)), serviceLd(s, g.seo.description)] });
};

/* ---------- VIDEO EDITING ---------- */

const videoEditing = () => {
  const v = C.video;
  const s = svc('video-editing');
  const body = `
${svcHero(s, v.h1, v.intro)}

<section class="section" aria-labelledby="vs-h">
  <div class="container">
    <div class="section-head reveal"><div>${eyebrow('Video Editing')}<h2 id="vs-h" class="h2">Video Editing Services</h2></div></div>
    <ol class="tracks" role="list">
      ${v.offer
        .map(
          ([t, ic], i) => `<li class="track reveal" style="--i:${i}"><span class="track-tc" aria-hidden="true">00:${pad(i * 6)}</span><span class="track-ico">${icon(ic)}</span><h3 class="track-t">${t}</h3><span class="track-bar" aria-hidden="true" style="--w:${38 + ((i * 23) % 55)}%"></span></li>`
        )
        .join('')}
    </ol>
  </div>
</section>

<section class="section" aria-labelledby="vp-h">
  <div class="container factors">
    <div class="reveal">
      ${eyebrow('Pricing')}
      <h2 id="vp-h" class="h2">What Affects Pricing?</h2>
      <p class="lead">${v.pricing}</p>
      <a class="link-arrow" href="/pricing/">View Pricing ${icon('arrow')}</a>
    </div>
    <ul class="factor-cloud reveal" role="list">
      ${v.pricingTerms.map((t, i) => `<li style="--i:${i}">${t}</li>`).join('')}
    </ul>
  </div>
</section>

${faqSection(['video-editing', 'revisions', 'quotation'])}
${relatedServices(s.slug)}
${ctaBlock(v.cta, { href: '/request-a-quote/?service=video-editing', label: 'Request a Quote' }, { href: '/contact/', label: 'Contact Us' })}`;
  return page({ path: `/${s.slug}/`, seo: v.seo, body, ld: [breadcrumbLd(svcTrail(s)), serviceLd(s, v.seo.description)] });
};

/* ---------- PORTFOLIO ---------- */

const catIcon = {
  'Brochure Design': 'file',
  'Logo Design': 'pen',
  'Mockup': 'box',
  'Social Post': 'image',
  'Video Editing': 'film',
  'Visiting Card': 'card',
  'Webpage Design': 'layout',
};

const portfolioPage = () => {
  const p = C.portfolio;
  const trail = [{ name: 'Portfolio', href: '/portfolio/' }];
  const cards = p.projects.length
    ? p.projects
        .map((pr) => {
          if (pr.type === 'video') {
            return `<li class="work-card work-card-video" data-cat="${slugify(pr.category)}" data-type="video" id="${pr.id}">
        <button type="button" class="work-card-trigger" data-video-trigger
          data-video-src="${pr.videoUrl}"
          data-title="${esc(pr.title)}"
          data-cat="${pr.category}"
          data-desc="${esc(pr.summary)}"
          aria-label="Play video: ${esc(pr.title)}">
          <figure>
            <div class="work-media">
              <img src="${pr.image}" alt="${esc(pr.alt)}" loading="lazy" decoding="async" width="800" height="600">
              <div class="video-play-center" aria-hidden="true">
                <span class="video-play-ripple"></span>
                <span class="video-play-icon">${icon('play', 'ico')}</span>
              </div>
              <div class="work-media-overlay" aria-hidden="true">
                <span class="work-view-btn work-view-btn-video">
                  ${icon('play', 'ico ico-sm')} <span>Watch Video</span>
                </span>
                <span class="work-badge-video">${pr.duration || '0:10 HD'}</span>
              </div>
            </div>
            <figcaption>
              <div class="work-meta">
                <span class="work-cat"><span class="live-dot" aria-hidden="true"></span> ${pr.category}</span>
                <span class="work-dims">HD Video • 10s</span>
              </div>
              <h3 class="h4 work-title">${pr.title}</h3>
              ${pr.summary ? `<p class="work-summary">${pr.summary}</p>` : ''}
            </figcaption>
          </figure>
        </button>
      </li>`;
          }

          return `<li class="work-card ${pr.isTall ? 'is-tall-design' : ''}" data-cat="${slugify(pr.category)}" data-type="image" id="${pr.id}">
        <button type="button" class="work-card-trigger" data-lightbox-trigger
          data-id="${pr.id}"
          data-src="${pr.image}"
          data-title="${esc(pr.title)}"
          data-cat="${pr.category}"
          data-desc="${esc(pr.summary || '')}"
          data-dims="${pr.dimensions || ''}"
          data-tall="${pr.isTall ? 'true' : 'false'}"
          aria-label="View ${esc(pr.title)} in full size">
          <figure>
            <div class="work-media">
              <img src="${pr.image}" alt="${esc(pr.alt)}" loading="lazy" decoding="async" width="800" height="600">
              <div class="work-media-overlay" aria-hidden="true">
                <span class="work-view-btn">
                  ${icon('eye', 'ico ico-sm')} <span>View Full</span>
                </span>
                ${pr.isTall ? '<span class="work-badge-tall">Full Page</span>' : ''}
              </div>
            </div>
            <figcaption>
              <div class="work-meta">
                <span class="work-cat">${pr.category}</span>
                ${pr.dimensions ? `<span class="work-dims">${pr.dimensions}</span>` : ''}
              </div>
              <h3 class="h4 work-title">${pr.title}</h3>
              ${pr.summary ? `<p class="work-summary">${pr.summary}</p>` : ''}
            </figcaption>
          </figure>
        </button>
      </li>`;
        })
        .join('')
    : p.categories
        .map(
          (c, i) => `<li class="work-card is-placeholder" data-cat="${slugify(c)}" id="${slugify(c)}">
      <div class="work-media ph-${(i % 4) + 1}" aria-hidden="true"><span class="ph-ico">${icon(catIcon[c] || 'layout')}</span><span class="ph-lines"></span></div>
      <div class="work-cap"><span class="work-cat">${c}</span><p class="ph-note">Project to be added</p></div>
    </li>`
        )
        .join('');

  const body = `
${pageHero({ trail, label: 'Portfolio', h1: p.h1, intro: p.intro, cls: 'center-hero' })}

<section class="section work" aria-labelledby="pc-h">
  <div class="container">
    <h2 id="pc-h" class="sr-only">Portfolio Categories</h2>
    <div class="filters reveal" role="group" aria-label="Filter projects by category" data-filters>
      <button type="button" class="filter" aria-pressed="true" data-filter="all">All</button>
      ${p.categories.map((c) => `<button type="button" class="filter" aria-pressed="false" data-filter="${slugify(c)}">${c}</button>`).join('')}
    </div>
    <p class="sr-only" aria-live="polite" data-filter-status></p>
    <ul class="work-grid" role="list" data-work-grid>${cards}</ul>
  </div>
</section>

<!-- Lightbox Modal for Images -->
<div class="pf-modal pf-lightbox-modal" id="portfolio-lightbox" role="dialog" aria-modal="true" aria-label="Portfolio Image Viewer" hidden>
  <div class="pf-modal-backdrop" data-close-lightbox></div>
  <div class="pf-modal-container">
    <div class="pf-modal-header">
      <div class="pf-modal-info">
        <span class="pf-modal-cat" data-lb-cat></span>
        <h3 class="pf-modal-title" data-lb-title></h3>
      </div>
      <div class="pf-modal-actions">
        <button type="button" class="pf-modal-btn pf-modal-zoom-btn" data-lb-toggle-view title="Toggle View Mode (Fit / Full Height)" aria-label="Toggle View Mode">
          <span data-lb-view-mode>Full Height</span>
        </button>
        <a href="#" class="pf-modal-btn pf-modal-external-btn" data-lb-open-tab target="_blank" rel="noopener" title="Open high-res original in new tab" aria-label="Open high-res original in new tab">
          ${icon('arrow-ur', 'ico ico-sm')} <span>High-Res</span>
        </a>
        <button type="button" class="pf-modal-btn pf-modal-close" data-close-lightbox aria-label="Close dialog">
          ${icon('close', 'ico')}
        </button>
      </div>
    </div>
    
    <div class="pf-lightbox-body" data-lb-body>
      <button type="button" class="pf-nav-btn pf-nav-prev" data-lb-prev aria-label="Previous image">
        ${icon('chevron', 'ico pf-rotate-prev')}
      </button>
      
      <div class="pf-img-stage" data-lb-stage>
        <img src="" alt="" class="pf-full-img" data-lb-img>
      </div>
      
      <button type="button" class="pf-nav-btn pf-nav-next" data-lb-next aria-label="Next image">
        ${icon('chevron', 'ico pf-rotate-next')}
      </button>
    </div>

    <div class="pf-modal-footer">
      <p class="pf-modal-desc" data-lb-desc></p>
      <div class="pf-modal-meta-right">
        <span class="pf-modal-dims" data-lb-dims></span>
        <span class="pf-modal-counter" data-lb-counter>1 / 1</span>
      </div>
    </div>
  </div>
</div>

<!-- Video Popup Modal -->
<div class="pf-modal pf-video-modal" id="portfolio-video-modal" role="dialog" aria-modal="true" aria-label="Portfolio Video Player" hidden>
  <div class="pf-modal-backdrop" data-close-video></div>
  <div class="pf-modal-container pf-video-container">
    <div class="pf-modal-header">
      <div class="pf-modal-info">
        <span class="pf-modal-cat" data-vid-cat>Video Editing</span>
        <h3 class="pf-modal-title" data-vid-title>Cinematic Film Logo Reveal</h3>
      </div>
      <button type="button" class="pf-modal-btn pf-modal-close" data-close-video aria-label="Close video player">
        ${icon('close', 'ico')}
      </button>
    </div>

    <div class="pf-video-body">
      <div class="pf-video-wrapper">
        <video class="pf-player" data-video-player controls playsinline preload="metadata">
          <source src="/assets/portfolio/video-editing/film-logo-reveal.mp4" type="video/mp4">
          Your browser does not support HTML5 video.
        </video>
      </div>
    </div>

    <div class="pf-modal-footer">
      <p class="pf-modal-desc" data-vid-desc></p>
      <div class="pf-modal-meta-right">
        <span class="pf-video-quality-tag"><span class="live-dot" aria-hidden="true"></span> HD 720p • 10s</span>
      </div>
    </div>
  </div>
</div>

<section class="section" aria-labelledby="cs-h">
  <div class="container cs-split">
    <div class="reveal">
      ${eyebrow('Case studies')}
      <h2 id="cs-h" class="h2">Project Case Study Template</h2>
    </div>
    <ol class="cs-list reveal" role="list">
      ${p.caseStudyTemplate.map((t, i) => `<li><span>${pad(i + 1)}</span>${t}</li>`).join('')}
    </ol>
  </div>
</section>

${ctaBlock(p.cta, { href: '/contact/', label: 'Contact Us' }, { href: '/request-a-quote/', label: 'Request a Quote' })}`;
  return page({ path: '/portfolio/', seo: p.seo, body, ld: [breadcrumbLd(trail)] });
};

/* ---------- PRICING ---------- */

const pricingPage = () => {
  const p = C.pricing;
  const trail = [{ name: 'Pricing', href: '/pricing/' }];
  const body = `
${pageHero({ trail, label: 'Pricing', h1: p.h1, intro: p.intro, cls: 'center-hero' })}

<section class="section" aria-labelledby="wpk-h">
  <div class="container">
    <div class="section-head reveal"><div>${eyebrow(`${icon('code', 'ico ico-sm')} Web Development`)}<h2 id="wpk-h" class="h2">Website Packages</h2></div><a class="link-arrow" href="/web-development/">Web Development ${icon('arrow')}</a></div>
    ${packageCards()}
  </div>
</section>

<section class="section" aria-labelledby="pec-h">
  <div class="container price-rows">
    <article class="price-row reveal" aria-labelledby="pec-h">
      <span class="chip-ico">${icon('cart')}</span>
      <div class="pr-body"><h2 id="pec-h" class="h3">E-Commerce</h2><p>${p.ecommerce.text}</p></div>
      <p class="pr-amt"><span class="pkg-from">Starting from</span><span class="grad-text">${p.ecommerce.price}</span></p>
      <a class="btn btn-ghost btn-sm" href="/ecommerce-development/">E-Commerce Development</a>
    </article>
    <article class="price-row reveal" aria-labelledby="pgv-h">
      <span class="chip-ico">${icon('palette')}</span>
      <div class="pr-body"><h2 id="pgv-h" class="h3">Graphic Design &amp; Video Editing</h2><p>${p.creative}</p></div>
      <p class="pr-amt pr-quote">Quoted per deliverable</p>
      <div class="pr-links"><a class="btn btn-ghost btn-sm" href="/graphic-design/">Graphic Design</a><a class="btn btn-ghost btn-sm" href="/video-editing/">Video Editing</a></div>
    </article>
  </div>
</section>

<section class="section" aria-labelledby="rv-h">
  <div class="container duo">
    <article class="panel reveal" aria-labelledby="rv-h">
      <h2 id="rv-h" class="h3">Revision Policy</h2>
      <ol class="rev-track" role="list">
        <li class="rev free"><span class="rev-dot">${icon('check', 'ico ico-sm')}</span><span class="rev-t">Round 1</span><span class="rev-s">Included free</span></li>
        <li class="rev free"><span class="rev-dot">${icon('check', 'ico ico-sm')}</span><span class="rev-t">Round 2</span><span class="rev-s">Included free</span></li>
        <li class="rev paid"><span class="rev-dot">${icon('plus', 'ico ico-sm')}</span><span class="rev-t">Round 3 onward</span><span class="rev-s">Payable</span></li>
      </ol>
      <p>${p.revision}</p>
    </article>
    <article class="panel panel-warn reveal" aria-labelledby="im-h">
      <span class="chip-ico chip-muted">${icon('info')}</span>
      <h2 id="im-h" class="h3">Important</h2>
      <p>${p.important}</p>
    </article>
  </div>
</section>

${faqSection(['website-cost', 'domain-hosting', 'revisions'])}
${ctaBlock(p.cta, { href: '/request-a-quote/', label: 'Request a Quote' }, { href: '/contact/', label: 'Contact Us' })}`;
  return page({ path: '/pricing/', seo: p.seo, body, ld: [breadcrumbLd(trail)] });
};

/* ---------- PROCESS ---------- */

const processPage = () => {
  const p = C.processPage;
  const trail = [{ name: 'Our Process', href: '/process/' }];
  const body = `
${pageHero({ trail, label: 'Our Process', h1: p.h1, cls: 'center-hero' })}

<section class="section timeline-section" aria-label="Process stages">
  <div class="container">
    <ol class="timeline" role="list">
      ${p.steps
        .map(
          (s, i) => `<li class="tl-step reveal" style="--i:${i}">
        <span class="tl-node"><span class="tl-num">${pad(i + 1)}</span></span>
        <div class="tl-body"><span class="tl-ico">${icon(s.icon)}</span><h2 class="h4">${s.t}</h2><p>${s.d}</p></div>
      </li>`
        )
        .join('')}
    </ol>
  </div>
</section>

<section class="section" aria-labelledby="tm-h">
  <div class="container">
    <div class="note-band big reveal">
      <span class="chip-ico">${icon('clock')}</span>
      <div><h2 id="tm-h" class="h3">Timeline</h2><p>${p.timeline}</p></div>
    </div>
  </div>
</section>

${ctaBlock(p.cta, { href: '/request-a-quote/', label: 'Request a Quote' }, { href: '/contact/', label: 'Contact Us' })}`;
  return page({ path: '/process/', seo: p.seo, body, ld: [breadcrumbLd(trail)] });
};

/* ---------- FAQS ---------- */

const faqsPage = () => {
  const f = C.faqs;
  const trail = [{ name: 'FAQs', href: '/faqs/' }];
  const body = `
${pageHero({ trail, label: 'FAQs', h1: 'Frequently Asked Questions', cls: 'center-hero' })}

<section class="section" aria-label="Questions and answers">
  <div class="container faq-layout">
    <div class="acc-group">${faqItems()}</div>
    <aside class="faq-aside" aria-labelledby="fa-h">
      <div class="panel panel-grad sticky">
        <h2 id="fa-h" class="h4">${f.items.find((x) => x.id === 'quotation').q}</h2>
        <p>${f.items.find((x) => x.id === 'quotation').a}</p>
        <ul class="contact-mini" role="list">
          ${brand.phones.map((p) => `<li><a href="${tel(p)}">${icon('phone', 'ico ico-sm')} ${p}</a></li>`).join('')}
          <li><a href="mailto:${brand.email}">${icon('mail', 'ico ico-sm')} ${brand.email}</a></li>
        </ul>
        <a class="btn btn-primary" href="/request-a-quote/">Request a Quote ${icon('arrow')}</a>
      </div>
    </aside>
  </div>
</section>`;
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: f.items.map((x) => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a } })),
  };
  return page({ path: '/faqs/', seo: f.seo, body, ld: [breadcrumbLd(trail), faqLd] });
};

/* ---------- FORMS ---------- */

const field = ({ id, label, type = 'text', required = false, auto, placeholder = '', err, hint, rows, attrs = '' }) => {
  const req = required ? ' required' : '';
  const described = [hint ? `${id}-hint` : '', `${id}-err`].filter(Boolean).join(' ');
  const control =
    type === 'textarea'
      ? `<textarea id="${id}" name="${id}" rows="${rows || 5}"${req} aria-describedby="${described}" placeholder="${placeholder}" ${attrs}></textarea>`
      : `<input id="${id}" name="${id}" type="${type}"${req}${auto ? ` autocomplete="${auto}"` : ''} aria-describedby="${described}" placeholder="${placeholder}" ${attrs}>`;
  return `<div class="field">
  <label for="${id}">${label}${required ? ' <span class="req" aria-hidden="true">*</span>' : ' <span class="opt">(Optional)</span>'}</label>
  ${hint ? `<p class="hint" id="${id}-hint">${hint}</p>` : ''}
  ${control}
  <p class="err" id="${id}-err">${icon('info', 'ico ico-sm')} ${err || 'This field is required.'}</p>
</div>`;
};

const serviceOptions = [...services.map((s) => [s.slug, s.name]), ['complete-package', 'Complete digital package']];

const formStatus = () => `
<div class="form-status" data-form-status tabindex="-1" hidden>
  <span class="chip-ico">${icon('send')}</span>
  <div>
    <p class="fs-title" data-fs-title></p>
    <p class="fs-text" data-fs-text></p>
    <div class="fs-actions" data-fs-actions hidden>
      <a class="btn btn-ghost btn-sm" data-fs-mailto href="mailto:${brand.email}">${icon('mail', 'ico ico-sm')} Open email again</a>
      <button class="btn btn-ghost btn-sm" type="button" data-fs-copy>${icon('copy', 'ico ico-sm')} Copy enquiry text</button>
    </div>
  </div>
</div>`;

// data-endpoint: set to a form backend URL (Formspree, Netlify, own API…) to
// POST submissions. While empty, the form opens a pre-filled email instead.
const contactForm = () => `
<form class="form" data-enquiry-form data-form-type="contact" data-endpoint="" data-subject="Website enquiry" novalidate>
  <div class="form-grid">
    ${field({ id: 'name', label: 'Name', required: true, auto: 'name', err: 'Please enter your name.' })}
    ${field({ id: 'business', label: 'Business / Company Name', required: true, auto: 'organization', err: 'Please enter your business or company name.' })}
    ${field({ id: 'email', label: 'Email', type: 'email', required: true, auto: 'email', err: 'Please enter a valid email address.' })}
    ${field({ id: 'phone', label: 'Phone', type: 'tel', required: true, auto: 'tel', err: 'Please enter a phone number.', attrs: 'inputmode="tel" pattern="[0-9+\\(\\)\\s\\-]{7,}"' })}
    <div class="field span-2">
      <label for="service">Service Required <span class="req" aria-hidden="true">*</span></label>
      <div class="select-wrap"><select id="service" name="service" required aria-describedby="service-err">
        <option value="">Select a service</option>
        ${serviceOptions.map(([v, n]) => `<option value="${v}">${n}</option>`).join('')}
      </select>${icon('chevron', 'ico ico-sm')}</div>
      <p class="err" id="service-err">${icon('info', 'ico ico-sm')} Please choose a service.</p>
    </div>
    <div class="span-2">${field({ id: 'details', label: 'Project Details', type: 'textarea', required: true, err: 'Please tell us a little about your project.' })}</div>
    ${field({ id: 'timeline', label: 'Expected Timeline', required: true, err: 'Please share your expected timeline.' })}
    ${field({ id: 'budget', label: 'Budget Range' })}
  </div>
  <p class="form-note">${C.contact.cta}</p>
  <button class="btn btn-primary btn-lg" type="submit">Send Enquiry ${icon('send')}</button>
  ${formStatus()}
</form>`;

/* ---------- CONTACT ---------- */

const contactPage = () => {
  const c = C.contact;
  const trail = [{ name: 'Contact Us', href: '/contact/' }];
  const body = `
<section class="page-hero contact-hero">
  <div class="hero-bg" aria-hidden="true"><span class="orb orb-1"></span><span class="orb orb-2"></span><span class="grid-lines"></span></div>
  <div class="container contact-grid">
    <div class="contact-copy">
      ${breadcrumbs(trail)}
      ${eyebrow('Contact Us')}
      <h1 class="h1">${c.h1}</h1>
      <p class="lead">${c.intro}</p>
      <h2 class="h4 cd-h">Contact Details</h2>
      <ul class="contact-cards" role="list">
        ${brand.phones.map((p, i) => `<li><a class="cc" href="${tel(p)}"><span class="cc-ico">${icon('phone')}</span><span><span class="cc-l">Phone ${i + 1}</span><span class="cc-v">${p}</span></span></a></li>`).join('')}
        <li class="cc-wide"><a class="cc" href="mailto:${brand.email}"><span class="cc-ico">${icon('mail')}</span><span><span class="cc-l">Email</span><span class="cc-v">${brand.email}</span></span></a></li>
      </ul>
    </div>
    <div class="form-card">
      <h2 class="h3">Send your requirements</h2>
      ${contactForm()}
    </div>
  </div>
</section>`;
  return page({ path: '/contact/', seo: c.seo, body, ld: [breadcrumbLd(trail)] });
};

/* ---------- REQUEST A QUOTE ---------- */

const quotePage = () => {
  const q = C.quote;
  const trail = [{ name: 'Request a Quote', href: '/request-a-quote/' }];
  const body = `
${pageHero({ trail, label: 'Request a Quote', h1: q.h1, intro: q.intro, cls: 'center-hero compact' })}

<section class="section quote-section" aria-label="Quotation request form">
  <div class="container quote-grid">
    <form class="form form-card" data-enquiry-form data-form-type="quote" data-endpoint="" data-subject="Quotation request" novalidate>
      <fieldset class="q-step">
        <legend><span class="q-num">01</span> Your details</legend>
        <div class="form-grid">
          ${field({ id: 'name', label: 'Name', required: true, auto: 'name', err: 'Please enter your name.' })}
          ${field({ id: 'business', label: 'Business / Company Name', required: true, auto: 'organization', err: 'Please enter your business or company name.' })}
          ${field({ id: 'email', label: 'Email', type: 'email', required: true, auto: 'email', err: 'Please enter a valid email address.' })}
          ${field({ id: 'phone', label: 'Phone', type: 'tel', required: true, auto: 'tel', err: 'Please enter a phone number.', attrs: 'inputmode="tel" pattern="[0-9+\\(\\)\\s\\-]{7,}"' })}
        </div>
      </fieldset>

      <fieldset class="q-step" aria-describedby="service-err">
        <legend><span class="q-num">02</span> Service Required <span class="req" aria-hidden="true">*</span></legend>
        <div class="svc-pick" data-svc-pick>
          ${serviceOptions
            .map(
              ([v, n], i) => `<label class="pick"><input type="radio" name="service" value="${v}" required${i === 0 ? ' aria-describedby="service-err"' : ''}><span class="pick-box">${icon(v === 'complete-package' ? 'layers' : svc(v).icon)}<span>${n}</span></span></label>`
            )
            .join('')}
        </div>
        <p class="err err-group" id="service-err">${icon('info', 'ico ico-sm')} Please choose a service.</p>

        <div class="cond" data-cond="web-development" hidden>
          <label for="package">Website package <span class="opt">(Optional)</span></label>
          <div class="select-wrap"><select id="package" name="package">
            <option value="">Not sure yet</option>
            ${C.pricing.websites.map((p) => `<option value="${p.name}">${p.name} — Starting from ${p.price}</option>`).join('')}
          </select>${icon('chevron', 'ico ico-sm')}</div>
          <p class="hint">Website pricing depends on the number of pages, features and integrations.</p>
        </div>
        <div class="cond" data-cond="ecommerce-development" hidden>
          ${field({ id: 'products', label: 'Product count', type: 'text', hint: 'Planning an online store? Contact us with your product count and requirements.' })}
        </div>
        <div class="cond" data-cond="graphic-design" hidden>
          ${field({ id: 'deliverables', label: 'Deliverables and quantity', hint: 'Graphic design is quoted according to the deliverable, complexity, quantity and revision requirements.' })}
        </div>
        <div class="cond" data-cond="video-editing" hidden>
          ${field({ id: 'footage', label: 'Footage requirements', hint: 'Pricing depends on raw footage length, final video duration, number of clips, subtitles, motion graphics, voice-over, thumbnail requirements and editing complexity.' })}
          ${field({ id: 'format', label: 'Expected output format' })}
        </div>
      </fieldset>

      <fieldset class="q-step">
        <legend><span class="q-num">03</span> Project</legend>
        ${field({ id: 'details', label: 'Project Details', type: 'textarea', required: true, rows: 6, err: 'Please describe your project requirements.', hint: 'Your project requirements and expected deliverables.' })}
        <div class="form-grid">
          ${field({ id: 'timeline', label: 'Expected Timeline', required: true, err: 'Please share your preferred timeline.' })}
          ${field({ id: 'budget', label: 'Budget Range' })}
        </div>
      </fieldset>

      <button class="btn btn-primary btn-lg" type="submit">Request a Quote ${icon('send')}</button>
      ${formStatus()}
    </form>

    <aside class="quote-aside" aria-label="Quotation information">
      <div class="panel">
        <h2 class="h4">How can I request a quotation?</h2>
        <p>${q.how}</p>
        <ul class="contact-mini" role="list">
          ${brand.phones.map((p) => `<li><a href="${tel(p)}">${icon('phone', 'ico ico-sm')} ${p}</a></li>`).join('')}
          <li><a href="mailto:${brand.email}">${icon('mail', 'ico ico-sm')} ${brand.email}</a></li>
        </ul>
      </div>
      <div class="panel">
        <h2 class="h4">Revision Policy</h2>
        <p>${C.pricing.revision}</p>
      </div>
      <div class="panel">
        <h2 class="h4">Important</h2>
        <p>${C.pricing.important}</p>
        <a class="link-arrow" href="/pricing/">View Pricing ${icon('arrow')}</a>
      </div>
    </aside>
  </div>
</section>`;
  return page({ path: '/request-a-quote/', seo: q.seo, body, ld: [breadcrumbLd(trail)] });
};

/* ---------- LEGAL ---------- */

const legalPage = (l) => {
  const trail = [{ name: l.title, href: `/${l.slug}/` }];
  const fill = (t) => t.replace('{email}', `<a href="mailto:${brand.email}">${brand.email}</a>`);
  const body = `
${pageHero({ trail, label: 'Legal', h1: l.title, cls: 'legal-hero compact' })}
<section class="section legal" aria-label="${l.title}">
  <div class="container legal-grid">
    <nav class="legal-toc" aria-label="On this page">
      <div class="sticky">
        <p class="toc-h">On this page</p>
        <ol role="list">${l.sections.map(([h], i) => `<li><a href="#s-${i + 1}">${i + 1}. ${h}</a></li>`).join('')}</ol>
      </div>
    </nav>
    <article class="prose">
      <p class="updated">${icon('clock', 'ico ico-sm')} Last Updated: ${l.updated}</p>
      ${l.sections
        .map(
          ([h, blocks], i) => `<section id="s-${i + 1}" aria-labelledby="s-${i + 1}-h"><h2 id="s-${i + 1}-h">${i + 1}. ${h}</h2>${blocks
            .map((b) => (Array.isArray(b) ? `<ul>${b.map((li) => `<li>${li}</li>`).join('')}</ul>` : `<p>${fill(b)}</p>`))
            .join('')}</section>`
        )
        .join('')}
    </article>
  </div>
</section>`;
  return page({ path: `/${l.slug}/`, seo: l.seo, body, ld: [breadcrumbLd(trail)] });
};

/* ---------- 404 ---------- */

const notFound = () =>
  page({
    path: '/404.html',
    seo: { title: 'Page not found | Systemic Solution', description: 'The page you are looking for could not be found.' },
    body: `<section class="page-hero center-hero nf"><div class="hero-bg" aria-hidden="true"><span class="orb orb-1"></span><span class="orb orb-2"></span></div>
  <div class="container"><p class="nf-code grad-text" aria-hidden="true">404</p><h1 class="h1">Page not found</h1>
  <div class="btn-row center"><a class="btn btn-primary" href="/">Home ${icon('arrow')}</a><a class="btn btn-ghost" href="/services/">Our Services</a><a class="btn btn-ghost" href="/contact/">Contact Us</a></div></div></section>`,
  }).replace('<link rel="canonical"', '<meta name="robots" content="noindex"><link rel="canonical"');

export const pages = [
  ['/', home],
  ['/about/', about],
  ['/services/', servicesOverview],
  ['/web-development/', webDevelopment],
  ['/ecommerce-development/', ecommerceDevelopment],
  ['/graphic-design/', graphicDesign],
  ['/video-editing/', videoEditing],
  ['/portfolio/', portfolioPage],
  ['/pricing/', pricingPage],
  ['/process/', processPage],
  ['/faqs/', faqsPage],
  ['/contact/', contactPage],
  ['/request-a-quote/', quotePage],
  ...C.legal.map((l) => [`/${l.slug}/`, () => legalPage(l)]),
];

export const extraPages = [['404.html', notFound]];
