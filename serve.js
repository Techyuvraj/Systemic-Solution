// Minimal local preview server for dist/ with clean URLs (/about/ → about/index.html)
// and an automated email notification endpoint via Resend.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

// Load local .env if present
if (existsSync('.env')) {
  for (const line of readFileSync('.env', 'utf8').split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = (match[2] || '').trim().replace(/^['"]|['"]$/g, '');
    }
  }
}

const dist = fileURLToPath(new URL('./dist', import.meta.url));
const port = Number(process.env.PORT) || 4173;
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.xml': 'application/xml', '.txt': 'text/plain',
  '.mp4': 'video/mp4', '.m3u8': 'application/vnd.apple.mpegurl', '.ts': 'video/mp2t', '.json': 'application/json',
};

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'mysystemicsolution@gmail.com';

async function sendResendEmail(payload) {
  const formLabel = payload.form_type === 'quote' ? 'Quotation Request' : 'Website Enquiry';
  const badgeColor = payload.form_type === 'quote' ? '#8b5cf6' : '#00e5ff';

  let scopeRows = `<tr><td style="width:36%;color:#94a3b8;padding:8px 12px;background:#141f36;border-radius:6px;">Service</td><td style="color:#fff;font-weight:600;padding:8px 12px;background:#141f36;border-radius:6px;">${payload.service || '—'}</td></tr>`;
  if (payload.package) scopeRows += `<tr><td style="color:#94a3b8;padding:8px 12px;background:#141f36;border-radius:6px;">Package</td><td style="color:#fff;font-weight:600;padding:8px 12px;background:#141f36;border-radius:6px;">${payload.package}</td></tr>`;
  if (payload.products) scopeRows += `<tr><td style="color:#94a3b8;padding:8px 12px;background:#141f36;border-radius:6px;">Products</td><td style="color:#fff;font-weight:600;padding:8px 12px;background:#141f36;border-radius:6px;">${payload.products}</td></tr>`;
  if (payload.deliverables) scopeRows += `<tr><td style="color:#94a3b8;padding:8px 12px;background:#141f36;border-radius:6px;">Deliverables</td><td style="color:#fff;font-weight:600;padding:8px 12px;background:#141f36;border-radius:6px;">${payload.deliverables}</td></tr>`;
  if (payload.footage) scopeRows += `<tr><td style="color:#94a3b8;padding:8px 12px;background:#141f36;border-radius:6px;">Footage Info</td><td style="color:#fff;font-weight:600;padding:8px 12px;background:#141f36;border-radius:6px;">${payload.footage}</td></tr>`;
  scopeRows += `<tr><td style="color:#94a3b8;padding:8px 12px;background:#141f36;border-radius:6px;">Timeline</td><td style="color:#fff;font-weight:600;padding:8px 12px;background:#141f36;border-radius:6px;">${payload.timeline || '—'}</td></tr>`;
  scopeRows += `<tr><td style="color:#94a3b8;padding:8px 12px;background:#141f36;border-radius:6px;">Budget</td><td style="color:#fff;font-weight:600;padding:8px 12px;background:#141f36;border-radius:6px;">${payload.budget || 'Not specified'}</td></tr>`;

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#060a1c;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#f1f5f9;">
  <div style="background-color:#060a1c;padding:32px 16px;">
    <div style="max-width:580px;margin:0 auto;background:#0d1527;border:1px solid #1e293b;border-radius:14px;overflow:hidden;box-shadow:0 12px 30px rgba(0,0,0,0.5);">
      <div style="height:4px;background:linear-gradient(90deg,#00e5ff,#3b82f6,#8b5cf6);"></div>
      <div style="padding:28px 24px 20px;border-bottom:1px solid #1e293b;">
        <span style="display:inline-block;font-size:11px;font-weight:700;text-transform:uppercase;color:${badgeColor};background:rgba(0,229,255,0.08);border:1px solid rgba(0,229,255,0.25);padding:4px 10px;border-radius:20px;margin-bottom:8px;">${formLabel}</span>
        <h1 style="font-size:22px;font-weight:700;color:#ffffff;margin:4px 0;">New ${formLabel} Received</h1>
        <p style="margin:0;font-size:13px;color:#94a3b8;">A visitor submitted details on <a href="https://systemicsolution.in/" style="color:#00e5ff;text-decoration:none;font-weight:600;">systemicsolution.in</a></p>
      </div>
      <div style="padding:24px;">
        <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#00e5ff;margin:0 0 12px 0;">Client Information</div>
        <table style="width:100%;border-collapse:separate;border-spacing:0 6px;margin-bottom:20px;" role="presentation">
          <tr><td style="width:36%;color:#94a3b8;padding:8px 12px;background:#141f36;border-radius:6px;">Client Name</td><td style="color:#fff;font-weight:600;padding:8px 12px;background:#141f36;border-radius:6px;">${payload.name || '—'}</td></tr>
          <tr><td style="color:#94a3b8;padding:8px 12px;background:#141f36;border-radius:6px;">Business</td><td style="color:#fff;font-weight:600;padding:8px 12px;background:#141f36;border-radius:6px;">${payload.business || '—'}</td></tr>
          <tr><td style="color:#94a3b8;padding:8px 12px;background:#141f36;border-radius:6px;">Email</td><td style="color:#fff;font-weight:600;padding:8px 12px;background:#141f36;border-radius:6px;"><a href="mailto:${payload.email}" style="color:#00e5ff;text-decoration:none;">${payload.email || '—'}</a></td></tr>
          <tr><td style="color:#94a3b8;padding:8px 12px;background:#141f36;border-radius:6px;">Phone</td><td style="color:#fff;font-weight:600;padding:8px 12px;background:#141f36;border-radius:6px;"><a href="tel:${payload.phone}" style="color:#00e5ff;text-decoration:none;">${payload.phone || '—'}</a></td></tr>
        </table>

        <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#00e5ff;margin:0 0 12px 0;">Project Scope</div>
        <table style="width:100%;border-collapse:separate;border-spacing:0 6px;margin-bottom:20px;" role="presentation">
          ${scopeRows}
        </table>

        <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#00e5ff;margin:0 0 12px 0;">Project Requirements</div>
        <div style="background:#141f36;border-left:3px solid #00e5ff;padding:14px;border-radius:4px;margin-bottom:24px;font-size:14px;line-height:1.5;color:#e2e8f0;white-space:pre-wrap;">${payload.details || 'No details provided.'}</div>

        <div style="text-align:center;padding-top:8px;">
          <a href="mailto:${payload.email}?subject=Re:%20Systemic%20Solution%20Enquiry" style="display:inline-block;background:#00e5ff;color:#060a1c !important;font-weight:700;font-size:13px;padding:10px 20px;border-radius:6px;text-decoration:none;margin-right:8px;margin-bottom:8px;">Reply to Client</a>
          <a href="tel:${payload.phone}" style="display:inline-block;background:#1e293b;color:#ffffff !important;font-weight:600;font-size:13px;padding:10px 18px;border-radius:6px;border:1px solid #334155;text-decoration:none;margin-right:8px;margin-bottom:8px;">Call Client</a>
          <a href="https://supabase.com/dashboard/project/addimjcmwkvxbehudush/editor" target="_blank" style="display:inline-block;background:#1e293b;color:#ffffff !important;font-weight:600;font-size:13px;padding:10px 18px;border-radius:6px;border:1px solid #334155;text-decoration:none;margin-right:8px;margin-bottom:8px;">View in Supabase</a>
        </div>
      </div>
      <div style="padding:18px;border-top:1px solid #1e293b;background:#090e1a;text-align:center;font-size:12px;color:#64748b;">
        Systemic Solution Lead Notification &bull; Delivered to ${NOTIFICATION_EMAIL} &bull; <a href="https://systemicsolution.in/" style="color:#00e5ff;text-decoration:none;">systemicsolution.in</a>
      </div>
    </div>
  </div>
</body></html>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Systemic Solution <onboarding@resend.dev>',
      to: [NOTIFICATION_EMAIL],
      reply_to: payload.email || undefined,
      subject: `✨ New ${formLabel} from ${payload.name || 'Visitor'} (${payload.business || 'Individual'})`,
      html,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Resend API returned ${res.status}: ${errText}`);
  }
  return await res.json();
}

createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);

  // Email API endpoint
  if (req.method === 'POST' && url === '/api/send-enquiry-email') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const resendRes = await sendResendEmail(payload);
        console.log(`[Email Sent] Delivered enquiry notification to ${NOTIFICATION_EMAIL} (ID: ${resendRes?.id})`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, id: resendRes?.id }));
      } catch (err) {
        console.error('[Email Failed]:', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      }
    });
    return;
  }

  let file = normalize(join(dist, url));
  if (!file.startsWith(dist)) return res.writeHead(403).end();
  try {
    let fileStat = await stat(file);
    if (fileStat.isDirectory()) {
      if (!url.endsWith('/')) return res.writeHead(301, { Location: url + '/' }).end();
      file = join(file, 'index.html');
      fileStat = await stat(file);
    }
    const ext = extname(file);
    const contentType = types[ext] || 'application/octet-stream';
    const range = req.headers.range;

    if (range && ext === '.mp4') {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileStat.size - 1;
      const chunksize = end - start + 1;
      const { createReadStream } = await import('node:fs');
      const fileStream = createReadStream(file, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileStat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
      });
      fileStream.pipe(res);
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': fileStat.size,
      'Accept-Ranges': 'bytes',
    });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, { 'Content-Type': types['.html'] });
    res.end(await readFile(join(dist, '404.html')).catch(() => 'Not found'));
  }
}).listen(port, () => console.log(`Preview: http://localhost:${port}`));
