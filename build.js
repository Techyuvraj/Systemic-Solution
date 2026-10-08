// Static site build: renders every page to dist/<slug>/index.html,
// copies assets, and writes sitemap.xml + robots.txt.
import { mkdirSync, writeFileSync, cpSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pages, extraPages } from './src/pages.js';
import { SITE_URL } from './src/config.js';

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, 'dist');

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

for (const [path, render] of pages) {
  const dir = join(out, path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), render());
}
for (const [file, render] of extraPages) {
  writeFileSync(join(out, file), render());
}

cpSync(join(root, 'assets'), join(out, 'assets'), { recursive: true });

// Assign smart priority & change frequency for SEO ranking
function getPageMeta(path) {
  if (path === '/') return { priority: '1.0', changefreq: 'weekly' };
  if (path === '/services/' || path.match(/^\/(web-development|ecommerce-development|graphic-design|video-editing)\//)) {
    return { priority: '0.9', changefreq: 'weekly' };
  }
  if (path.match(/^\/(portfolio|pricing|process)\//)) {
    return { priority: '0.8', changefreq: 'weekly' };
  }
  if (path.match(/^\/(contact|request-a-quote|faqs|about)\//)) {
    return { priority: '0.8', changefreq: 'monthly' };
  }
  if (path.match(/^\/(privacy-policy|terms-and-conditions|refund-cancellation-policy)\//)) {
    return { priority: '0.3', changefreq: 'yearly' };
  }
  return { priority: '0.7', changefreq: 'monthly' };
}

const today = new Date().toISOString().slice(0, 10);

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${pages
  .map(([p]) => {
    const meta = getPageMeta(p);
    return `  <url>
    <loc>${SITE_URL}${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${meta.changefreq}</changefreq>
    <priority>${meta.priority}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>
`;

const robotsTxt = `# Robots.txt for Systemic Solution
# Website: ${SITE_URL}

User-agent: *
Allow: /
Disallow: /api/
Disallow: /404.html

# Major Search Engine Crawlers
User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /assets/

User-agent: Bingbot
Allow: /

User-agent: Applebot
Allow: /

# Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml
`;

writeFileSync(join(out, 'sitemap.xml'), sitemapXml);
writeFileSync(join(out, 'robots.txt'), robotsTxt);

// Also write robots.txt and sitemap.xml to root for static serving flexibility
writeFileSync(join(root, 'robots.txt'), robotsTxt);
writeFileSync(join(root, 'sitemap.xml'), sitemapXml);

console.log(`✓ Built ${pages.length + extraPages.length} pages → dist/`);
console.log(`✓ Generated sitemap.xml with ${pages.length} URLs`);
console.log(`✓ Generated robots.txt pointing to ${SITE_URL}/sitemap.xml`);
