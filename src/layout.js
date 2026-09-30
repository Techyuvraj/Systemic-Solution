import { brand, services, siteCta, servicesPage } from './content.js';
import { sprite, icon } from './icons.js';
import { SITE_URL } from './config.js';

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const tel = (p) => 'tel:' + p.replace(/[^\d+]/g, '');

const logoMark = `<svg class="logo-mark" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><defs><linearGradient id="lg-mark" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22D3EE"/><stop offset=".35" stop-color="#2F7BFF"/><stop offset=".7" stop-color="#8B3DFF"/><stop offset="1" stop-color="#E03BD0"/></linearGradient></defs><rect width="48" height="48" rx="12" fill="#0A1030" stroke="rgba(148,163,255,.22)"/><path d="M35 10H20.5a7 7 0 0 0 0 14h7a7 7 0 0 1 0 14H13" fill="none" stroke="url(#lg-mark)" stroke-width="4.6" stroke-linecap="round"/><circle cx="35" cy="10" r="3.4" fill="#22D3EE"/><circle cx="13" cy="38" r="3.4" fill="#E03BD0"/></svg>`;

// Placeholder mark + wordmark. Swap for the official logo file when supplied.
export const logo = (extra = '') =>
  `<a class="logo ${extra}" href="/" aria-label="${brand.name} — Home">${logoMark}<span class="logo-word"><span class="logo-a">Systemic</span><span class="logo-b">Solution</span></span></a>`;

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
    <a class="btn btn-primary btn-sm header-cta" href="/contact/">Get a Free Consultation</a>
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
      <div class="btn-row">
        <a class="btn btn-primary" href="/request-a-quote/">Request a Quote ${icon('arrow')}</a>
        <a class="btn btn-ghost" href="/contact/">Contact Us</a>
      </div>
    </div>
    <div class="footer-grid">
      <div class="footer-brand">
        ${logo()}
        <p>Modern websites, e-commerce solutions, creative designs and engaging videos — everything your business needs to grow online.</p>
      </div>
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
      <nav class="footer-col" aria-label="Legal">
        <p class="footer-h">Legal</p>
        <ul role="list"><li><a href="/privacy-policy/">Privacy Policy</a></li><li><a href="/terms-and-conditions/">Terms &amp; Conditions</a></li><li><a href="/refund-cancellation-policy/">Refund / Cancellation Policy</a></li></ul>
      </nav>
      <div class="footer-col footer-contact">
        <p class="footer-h">Contact</p>
        <ul role="list">
          ${brand.phones.map((p) => `<li><a href="${tel(p)}">${icon('phone', 'ico ico-sm')} ${p}</a></li>`).join('')}
          <li><a href="mailto:${brand.email}">${icon('mail', 'ico ico-sm')} ${brand.email.replace('@', '@<wbr>')}</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© <span data-year>${new Date().getFullYear()}</span> ${brand.name}. All rights reserved.</p>
      <a href="#main" class="to-top">Back to top ${icon('arrow-ur', 'ico ico-sm')}</a>
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
  logo: SITE_URL + '/assets/img/logo-mark.svg',
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
<link rel="icon" href="/assets/img/logo-mark.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap">
<link rel="stylesheet" href="/assets/css/main.css">
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
