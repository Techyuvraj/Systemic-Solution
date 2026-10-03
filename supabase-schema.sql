3-- ============================================================
-- Supabase Schema for Systemic Solution Forms
-- (Contact Form + Quotation Request Form)
-- ============================================================
-- How to apply:
-- 1. Go to your Supabase Project dashboard: https://supabase.com/dashboard
-- 2. Open "SQL Editor" from the left sidebar
-- 3. Click "New Query", paste this entire file, and click "Run"
-- ============================================================

-- 1. Create the enquiries table
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Form identification ('contact' or 'quote')
  form_type text not null,
  
  -- Common contact info
  name text not null,
  business text,
  email text not null,
  phone text not null,
  service text,
  
  -- Project specifications
  details text,
  timeline text,
  budget text,
  
  -- Quote-specific conditional fields
  package text,
  products text,
  deliverables text,
  footage text,
  format text,
  
  -- Full submission summary text for quick reading
  summary text,
  
  -- Lead management status
  status text default 'new' -- 'new', 'contacted', 'qualified', 'closed'
);

-- 2. Enable Row Level Security (RLS) for data protection
alter table public.enquiries enable row level security;

-- 3. Allow anonymous website visitors to INSERT their enquiry
-- (They can only insert their own submission; they cannot read or edit other entries)
drop policy if exists "Allow anonymous submissions" on public.enquiries;
create policy "Allow anonymous submissions"
on public.enquiries
for insert
to anon
with check (true);

-- 4. Allow authenticated admins (you logged into Supabase Studio) full read & write access
drop policy if exists "Allow authenticated full access" on public.enquiries;
create policy "Allow authenticated full access"
on public.enquiries
for all
to authenticated
using (true)
with check (true);

-- 5. Optional index for faster queries by creation date & form type
create index if not exists idx_enquiries_created_at on public.enquiries (created_at desc);
create index if not exists idx_enquiries_form_type on public.enquiries (form_type);
