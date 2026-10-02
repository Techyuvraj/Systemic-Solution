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
for (const [file, render] of extraPages) writeFileSync(join(out, file), render());

cpSync(join(root, 'assets'), join(out, 'assets'), { recursive: true });

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(out, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map(([p]) => `  <url><loc>${SITE_URL}${p}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`
);
writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

console.log(`Built ${pages.length + extraPages.length} pages → dist/`);
