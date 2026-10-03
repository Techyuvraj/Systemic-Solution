-- ====================================================================
-- Automated Email Notification Trigger for Systemic Solution
-- Whenever an enquiry is inserted into Supabase, this trigger
-- automatically sends a branded HTML email to mysystemicsolution@gmail.com
-- ====================================================================
-- Requirements:
-- 1. Free API key from Resend: https://resend.com (100 free emails/day)
-- 2. Paste your Resend API key into line 25 below (starts with re_...)
-- 3. Run this script in the Supabase SQL Editor
-- ====================================================================

-- Step 1: Enable the pg_net HTTP extension (built into Supabase)
create extension if not exists pg_net;

-- Step 2: Create the trigger function
create or replace function public.send_enquiry_notification()
returns trigger as $$
declare
  resend_api_key text := 'YOUR_RESEND_API_KEY'; -- e.g. 're_123456789'
  notification_email text := 'mysystemicsolution@gmail.com';
  email_subject text;
  badge_color text;
  form_label text;
  html_body text;
begin
  -- Determine form label & styling
  if new.form_type = 'quote' then
    form_label := 'Quotation Request';
    badge_color := '#8b5cf6';
  else
    form_label := 'Website Enquiry';
    badge_color := '#00e5ff';
  end if;

  email_subject := '✨ New ' || form_label || ' from ' || new.name || ' (' || coalesce(new.business, 'Individual') || ')';

  -- Build Responsive Brand HTML Email Template
  html_body := '<!DOCTYPE html>'
    || '<html><head><meta charset="utf-8"><style>'
    || 'body{margin:0;padding:0;background-color:#060a1c;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#f1f5f9;}'
    || '.wrapper{background-color:#060a1c;padding:32px 16px;}'
    || '.card{max-width:580px;margin:0 auto;background:#0d1527;border:1px solid #1e293b;border-radius:14px;overflow:hidden;box-shadow:0 12px 30px rgba(0,0,0,0.5);}'
    || '.bar{height:4px;background:linear-gradient(90deg,#00e5ff,#3b82f6,#8b5cf6);}'
    || '.header{padding:28px 24px 20px;border-bottom:1px solid #1e293b;}'
    || '.badge{display:inline-block;font-size:11px;font-weight:700;text-transform:uppercase;color:' || badge_color || ';background:rgba(0,229,255,0.08);border:1px solid rgba(0,229,255,0.25);padding:4px 10px;border-radius:20px;margin-bottom:8px;}'
    || '.title{font-size:20px;font-weight:700;color:#ffffff;margin:4px 0;}'
    || '.body{padding:24px;}'
    || '.sec{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#00e5ff;margin:0 0 12px 0;}'
    || '.tbl{width:100%;border-collapse:separate;border-spacing:0 6px;margin-bottom:20px;}'
    || '.tbl td{padding:10px 12px;background:#141f36;border-radius:6px;font-size:14px;}'
    || '.lbl{width:36%;color:#94a3b8;font-weight:500;}'
    || '.val{color:#ffffff;font-weight:600;}'
    || '.val a{color:#00e5ff;text-decoration:none;}'
    || '.box{background:#141f36;border-left:3px solid #00e5ff;padding:14px;border-radius:4px;margin-bottom:24px;font-size:14px;line-height:1.5;color:#e2e8f0;white-space:pre-wrap;}'
    || '.btn{display:inline-block;background:#00e5ff;color:#060a1c !important;font-weight:700;font-size:13px;padding:10px 20px;border-radius:6px;text-decoration:none;margin-right:8px;margin-bottom:8px;}'
    || '.btn-sec{display:inline-block;background:#1e293b;color:#ffffff !important;font-weight:600;font-size:13px;padding:10px 18px;border-radius:6px;border:1px solid #334155;text-decoration:none;margin-right:8px;margin-bottom:8px;}'
    || '.foot{padding:20px;border-top:1px solid #1e293b;background:#090e1a;text-align:center;font-size:12px;color:#64748b;}'
    || '</style></head><body>'
    || '<div class="wrapper"><div class="card">'
    || '<div class="bar"></div>'
    || '<div class="header">'
    || '<span class="badge">' || form_label || '</span>'
    || '<h1 class="title">New Submission Received</h1>'
    || '<p style="margin:0;font-size:13px;color:#94a3b8;">A visitor submitted details on systemic-solution.com</p>'
    || '</div>'
    || '<div class="body">'
    || '<div class="sec">Client Information</div>'
    || '<table class="tbl" role="presentation">'
    || '<tr><td class="lbl">Client Name</td><td class="val">' || coalesce(new.name, '—') || '</td></tr>'
    || '<tr><td class="lbl">Business</td><td class="val">' || coalesce(new.business, '—') || '</td></tr>'
    || '<tr><td class="lbl">Email</td><td class="val"><a href="mailto:' || coalesce(new.email, '') || '">' || coalesce(new.email, '—') || '</a></td></tr>'
    || '<tr><td class="lbl">Phone</td><td class="val"><a href="tel:' || coalesce(new.phone, '') || '">' || coalesce(new.phone, '—') || '</a></td></tr>'
    || '</table>'
    || '<div class="sec">Project Scope</div>'
    || '<table class="tbl" role="presentation">'
    || '<tr><td class="lbl">Service</td><td class="val">' || coalesce(new.service, '—') || '</td></tr>';

  if new.package is not null and new.package <> '' then
    html_body := html_body || '<tr><td class="lbl">Package</td><td class="val">' || new.package || '</td></tr>';
  end if;
  if new.products is not null and new.products <> '' then
    html_body := html_body || '<tr><td class="lbl">Products</td><td class="val">' || new.products || '</td></tr>';
  end if;
  if new.deliverables is not null and new.deliverables <> '' then
    html_body := html_body || '<tr><td class="lbl">Deliverables</td><td class="val">' || new.deliverables || '</td></tr>';
  end if;
  if new.footage is not null and new.footage <> '' then
    html_body := html_body || '<tr><td class="lbl">Footage Info</td><td class="val">' || new.footage || '</td></tr>';
  end if;

  html_body := html_body
    || '<tr><td class="lbl">Timeline</td><td class="val">' || coalesce(new.timeline, '—') || '</td></tr>'
    || '<tr><td class="lbl">Budget Range</td><td class="val">' || coalesce(new.budget, '—') || '</td></tr>'
    || '</table>'
    || '<div class="sec">Project Requirements</div>'
    || '<div class="box">' || coalesce(new.details, 'No details provided.') || '</div>'
    || '<div style="text-align:center;padding-top:8px;">'
    || '<a class="btn" href="mailto:' || coalesce(new.email, '') || '?subject=Re:%20Systemic%20Solution%20Enquiry">Reply to Client</a>'
    || '<a class="btn-sec" href="tel:' || coalesce(new.phone, '') || '">Call Client</a>'
    || '<a class="btn-sec" href="https://supabase.com/dashboard/project/addimjcmwkvxbehudush/editor" target="_blank">View in Supabase</a>'
    || '</div>'
    || '</div>'
    || '<div class="foot">Systemic Solution Lead Notification &bull; Delivered to ' || notification_email || '</div>'
    || '</div></div></body></html>';

  -- Send request to Resend API asynchronously
  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || resend_api_key,
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', 'Systemic Solution <onboarding@resend.dev>',
      'to', jsonb_build_array(notification_email),
      'reply_to', new.email,
      'subject', email_subject,
      'html', html_body
    )
  );

  return new;
exception
  when others then
    -- Log error in PostgreSQL log but never block the database row insertion
    raise warning 'Failed to send email notification: %', SQLERRM;
    return new;
end;
$$ language plpgsql security definer;

-- Step 3: Attach the trigger to enquiries table
drop trigger if exists trg_send_enquiry_notification on public.enquiries;
create trigger trg_send_enquiry_notification
  after insert on public.enquiries
  for each row
  execute function public.send_enquiry_notification();
