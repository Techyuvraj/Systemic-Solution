import { brand, services, siteCta, servicesPage, pricing } from './content.js';
import { sprite, icon } from './icons.js';
import { SITE_URL } from './config.js';

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// GSAP-style pill: label + circled arrow
export const pillIcon = () => `<span class="btn-circ" aria-hidden="true">${icon('arrow', 'ico')}</span>`;

export const tel = (p) => 'tel:' + p.replace(/[^\d+]/g, '');

export const logo = (extra = '') =>
  `<a class="logo ${extra}" href="/" aria-label="${brand.name} — Home"><img class="logo-img" src="/assets/img/logo-systemic-solution.png" alt="${brand.name}" width="1019" height="391" decoding="async"></a>`;

const nav = [
  { href: '/about/', label: 'About' },
  { href: '/services/', label: 'Services', mega: true },
  { href: '/portfolio/', label: 'Portfolio' },
  { href: '/pricing/', label: 'Pricing' },
  { href: '/process/', label: 'Process' },
  { href: '/faqs/', label: 'FAQs' },
  { href: '/contact/', label: 'Contact' },
];

const isCurrent = (path, href) => (path === href ? ' aria-current="page"' : '');
const serviceActive = (path) => path === '/services/' || services.some((s) => path === `/${s.slug}/`);

const megaMenu = () => `
<div class="mega" id="mega-services" data-mega>
  <div class="mega-inner">
    <ul class="mega-grid" role="list">
      ${services
        .map(
          (s) => `<li><a class="mega-item" href="/${s.slug}/">
        <span class="mega-ico">${icon(s.icon)}</span>
        <span class="mega-text"><span class="mega-name">${s.name}</span><span class="mega-desc">${s.short}</span></span>
      </a></li>`
        )
        .join('')}
    </ul>
    <div class="mega-side">
      <p class="mega-side-title">${servicesPage.h1}</p>
      <p class="mega-side-text">${servicesPage.intro}</p>
      <a class="link-arrow" href="/services/">View All Services ${icon('arrow')}</a>
      <ul class="mega-links" role="list">
        <li><a href="/pricing/">Pricing</a></li>
        <li><a href="/process/">Process</a></li>
        <li><a href="/request-a-quote/">Request a Quote</a></li>
      </ul>
    </div>
  </div>
</div>`;

export const header = (path) => `
<a class="skip-link" href="#main">Skip to content</a>
<a class="top-banner" href="/pricing/"><span class="tb-dot" aria-hidden="true"></span>${pricing.websites[0].name} — Starting from ${pricing.websites[0].price} <span class="tb-link">View Pricing</span></a>
<header class="site-header" data-header>
  <div class="container header-inner">
    ${logo()}
    <nav class="nav-desktop" aria-label="Primary">
      <ul class="nav-list" role="list">
        ${nav
          .map((n) =>
            n.mega
              ? `<li class="has-mega" data-has-mega>
            <button class="nav-link nav-trigger" type="button" aria-expanded="false" aria-controls="mega-services"${serviceActive(path) ? ' data-active' : ''}>${n.label} ${icon('chevron', 'ico ico-sm chev')}</button>
            ${megaMenu()}
          </li>`
              : `<li><a class="nav-link" href="${n.href}"${isCurrent(path, n.href)}>${n.label}</a></li>`
          )
          .join('')}
      </ul>
    </nav>
    <a class="btn btn-primary btn-sm header-cta" href="/contact/">Get a Free Consultation ${pillIcon()}</a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" data-menu-toggle>
      <span class="sr-only">Menu</span>${icon('menu', 'ico open-ico')}${icon('close', 'ico close-ico')}
    </button>
  </div>
  <div class="mobile-nav" id="mobile-nav" data-mobile-nav hidden>
    <nav aria-label="Mobile">
      <ul class="m-list" role="list">
        <li><a class="m-link" href="/"${isCurrent(path, '/')}>Home</a></li>
        ${nav
          .map((n) =>
            n.mega
              ? `<li><details class="m-acc"${serviceActive(path) ? ' open' : ''}><summary class="m-link">Services ${icon('chevron', 'ico ico-sm chev')}</summary>
              <ul class="m-sub" role="list">
                ${services.map((s) => `<li><a href="/${s.slug}/"${isCurrent(path, `/${s.slug}/`)}>${icon(s.icon, 'ico ico-sm')} ${s.name}</a></li>`).join('')}
                <li><a href="/services/"${isCurrent(path, '/services/')}>${icon('grid', 'ico ico-sm')} View All Services</a></li>
              </ul></details></li>`
              : `<li><a class="m-link" href="${n.href}"${isCurrent(path, n.href)}>${n.label}</a></li>`
          )
          .join('')}
      </ul>
      <div class="m-cta">
        <a class="btn btn-primary" href="/contact/">Get a Free Consultation</a>
        <a class="btn btn-ghost" href="/request-a-quote/">Request a Quote</a>
      </div>
    </nav>
  </div>
</header>`;

export const footer = () => `
<footer class="site-footer">
  <div class="container">
    <div class="footer-cta reveal">
      <p class="footer-cta-text">${siteCta}</p>
      <div class="footer-cta-go">
                <a class="btn btn-primary btn-lg" href="/request-a-quote/">Request a Quote ${pillIcon()}</a>
      </div>
    </div>
    <div class="footer-grid">
      <nav class="footer-col" aria-label="Company">
        <p class="footer-h">Company</p>
        <ul role="list"><li><a href="/about/">About Us</a></li><li><a href="/portfolio/">Portfolio</a></li><li><a href="/process/">Our Process</a></li><li><a href="/contact/">Contact Us</a></li></ul>
      </nav>
      <nav class="footer-col" aria-label="Services">
        <p class="footer-h">Services</p>
        <ul role="list">${services.map((s) => `<li><a href="/${s.slug}/">${s.name}</a></li>`).join('')}<li><a href="/services/">All Services</a></li></ul>
      </nav>
      <nav class="footer-col" aria-label="Resources">
        <p class="footer-h">Resources</p>
        <ul role="list"><li><a href="/pricing/">Pricing</a></li><li><a href="/faqs/">FAQs</a></li><li><a href="/request-a-quote/">Request a Quote</a></li></ul>
      </nav>
      <div class="footer-contact">
        <p class="footer-h">Call Us</p>
        <ul role="list">${brand.phones.map((p) => `<li><a href="${tel(p)}">${p}</a></li>`).join('')}</ul>
        <p class="footer-h">Say Hello</p>
        <a class="footer-mail" href="mailto:${brand.email}">${brand.email.replace('@', '@<wbr>')}</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p class="footer-word" aria-hidden="true"><span>Systemic</span><span>Solution</span></p>
      <div class="footer-meta">
        <p>${brand.name} © <span data-year>${new Date().getFullYear()}</span></p>
        <ul class="footer-legal" role="list"><li><a href="/privacy-policy/">Privacy Policy</a></li><li><a href="/terms-and-conditions/">Terms &amp; Conditions</a></li><li><a href="/refund-cancellation-policy/">Refund / Cancellation Policy</a></li></ul>
      </div>
      <a href="#main" class="to-top">Back to top ${icon('arrow-ur', 'ico')}</a>
    </div>
  </div>
</footer>`;

export const breadcrumbs = (trail) => `
<nav class="crumbs" aria-label="Breadcrumb"><ol role="list">
  <li><a href="/">Home</a></li>
  ${trail.map((t, i) => (i === trail.length - 1 ? `<li><span aria-current="page">${t.name}</span></li>` : `<li><a href="${t.href}">${t.name}</a></li>`)).join('')}
</ol></nav>`;

export const breadcrumbLd = (trail) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'Home', href: '/' }, ...trail].map((t, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: t.name,
    item: SITE_URL + t.href,
  })),
});

const orgLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: brand.name,
  url: SITE_URL + '/',
  logo: SITE_URL + '/assets/img/logo-systemic-solution.png',
  email: brand.email,
  telephone: brand.phones,
};

export const page = ({ path, seo, body, ld = [], bodyClass = '' }) => {
  const url = SITE_URL + path;
  const scripts = [orgLd, ...ld].map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(seo.title)}</title>
<meta name="description" content="${esc(seo.description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${brand.name}">
<meta property="og:title" content="${esc(seo.title)}">
<meta property="og:description" content="${esc(seo.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE_URL}/assets/img/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${brand.name} — web development, e-commerce, graphic design and video editing">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#060A1C">
<meta name="color-scheme" content="dark">
<link rel="icon" href="/assets/img/favicon.jpg" type="image/jpeg">
<link rel="apple-touch-icon" href="/assets/img/favicon.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wdth,wght@75..100,400..700&display=swap">
<link rel="stylesheet" href="/assets/css/main.css">
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js" defer></script>
<script src="/assets/js/supabase-config.js" defer></script>
<script src="/assets/js/main.js" defer></script>
${scripts}
</head>
<body class="${bodyClass}">
${sprite()}
${header(path)}
<main id="main" tabindex="-1">
${body}
</main>
${footer()}
</body>
</html>
`;
};
