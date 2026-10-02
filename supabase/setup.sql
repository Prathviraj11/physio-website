-- ============================================================
--  Supabase setup — run this in:
--  Supabase Dashboard  >  your project  >  SQL Editor  >  New query  >  Run
-- ============================================================

-- 1. Create the testimonials table
create table if not exists public.testimonials (
  id         uuid primary key default gen_random_uuid(),
  name       text        not null check (char_length(name)   between 1 and 100),
  rating     int         not null check (rating between 1 and 5),
  review     text        not null check (char_length(review) between 1 and 2000),
  created_at timestamptz not null default now()
);

-- 2. Row-Level Security: deny all direct client access.
--    Only the /api serverless functions (which use the service_role
--    key) may read/write.
alter table public.testimonials enable row level security;

-- 3. A friendly index so the newest testimonials come back fast.
create index if not exists testimonials_created_at_idx
  on public.testimonials (created_at desc);

-- Done. You now have a table that your API can read/write.
