const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'mysystemicsolution@gmail.com';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = req.body || {};
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

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
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

    if (!resendRes.ok) {
      const err = await resendRes.text();
      return res.status(500).json({ error: err });
    }

    const data = await resendRes.json();
    return res.status(200).json({ ok: true, id: data.id });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
