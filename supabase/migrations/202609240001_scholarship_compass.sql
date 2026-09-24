create extension if not exists pgcrypto;

create table if not exists public.scholarship_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source_type text not null check (source_type in ('government','university','official-program','ranking','destination-data')),
  base_url text not null unique,
  trust_score integer not null default 80 check (trust_score between 0 and 100),
  crawl_policy jsonb not null default '{}'::jsonb,
  last_crawled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.universities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text not null,
  continent text not null,
  official_url text,
  global_rank integer,
  ranking_source text,
  ranking_year integer,
  ranking_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (name, country)
);

create table if not exists public.scholarships (
  id uuid primary key default gen_random_uuid(),
  university_id uuid references public.universities(id) on delete set null,
  source_id uuid references public.scholarship_sources(id) on delete restrict,
  name text not null,
  provider text not null,
  country text not null,
  continent text not null,
  degrees text[] not null default '{}',
  fields text[] not null default '{}',
  funding_type text not null check (funding_type in ('full','partial','tuition-waiver','stipend','other')),
  funding_percent_min numeric(5,2),
  funding_percent_max numeric(5,2),
  stipend_amount numeric(14,2),
  stipend_currency text,
  stipend_period text,
  coverage text,
  official_url text not null unique,
  application_deadline timestamptz,
  intake_year integer,
  status text not null default 'needs-review' check (status in ('open','closed','upcoming','needs-review')),
  eligibility_summary text,
  raw_payload jsonb not null default '{}'::jsonb,
  first_seen_at timestamptz not null default now(),
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists scholarships_filter_idx on public.scholarships (status, continent, intake_year);
create index if not exists scholarships_degrees_gin on public.scholarships using gin (degrees);
create index if not exists scholarships_fields_gin on public.scholarships using gin (fields);

create table if not exists public.scholarship_eligibility (
  id uuid primary key default gen_random_uuid(),
  scholarship_id uuid not null references public.scholarships(id) on delete cascade,
  nationality_rules jsonb not null default '{}'::jsonb,
  minimum_gpa numeric(6,2),
  gpa_scale numeric(6,2),
  language_requirements jsonb not null default '{}'::jsonb,
  work_years_min numeric(4,1),
  research_required boolean not null default false,
  publications_required boolean not null default false,
  extracurricular_weight text,
  age_rules jsonb not null default '{}'::jsonb,
  other_requirements jsonb not null default '{}'::jsonb,
  verified_at timestamptz,
  unique (scholarship_id)
);

create table if not exists public.destination_profiles (
  id uuid primary key default gen_random_uuid(),
  country text not null,
  city text,
  monthly_cost_min numeric(12,2),
  monthly_cost_max numeric(12,2),
  currency text not null default 'USD',
  career_summary text,
  quality_of_life_summary text,
  international_student_summary text,
  source_url text,
  verified_at timestamptz,
  unique (country, city)
);

create table if not exists public.student_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_email text not null,
  profile_data jsonb not null,
  completion_percent integer not null default 0 check (completion_percent between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists student_profiles_owner_idx on public.student_profiles (lower(owner_email));

create table if not exists public.recommendation_runs (
  id uuid primary key default gen_random_uuid(),
  owner_email text not null,
  student_profile_id uuid references public.student_profiles(id) on delete set null,
  methodology_version text not null,
  input_snapshot jsonb not null,
  status text not null default 'completed' check (status in ('queued','researching','ranking','completed','failed')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.recommendation_items (
  id uuid primary key default gen_random_uuid(),
  owner_email text not null,
  recommendation_run_id uuid not null references public.recommendation_runs(id) on delete cascade,
  scholarship_id uuid references public.scholarships(id) on delete set null,
  rank integer not null,
  match_score numeric(5,2) not null,
  funding_estimate jsonb not null default '{}'::jsonb,
  strengths jsonb not null default '[]'::jsonb,
  gaps jsonb not null default '[]'::jsonb,
  evidence jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (recommendation_run_id, rank)
);

create table if not exists public.crawl_jobs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.scholarship_sources(id) on delete set null,
  target_url text not null,
  status text not null default 'queued' check (status in ('queued','running','completed','failed','blocked')),
  attempt_count integer not null default 0,
  discovered_count integer not null default 0,
  error_summary text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.scholarship_sources enable row level security;
alter table public.universities enable row level security;
alter table public.scholarships enable row level security;
alter table public.scholarship_eligibility enable row level security;
alter table public.destination_profiles enable row level security;
alter table public.student_profiles enable row level security;
alter table public.recommendation_runs enable row level security;
alter table public.recommendation_items enable row level security;
alter table public.crawl_jobs enable row level security;

create policy "public read verified scholarships" on public.scholarships for select using (status in ('open','upcoming','needs-review'));
create policy "public read universities" on public.universities for select using (true);
create policy "public read destinations" on public.destination_profiles for select using (true);
create policy "users read own profiles" on public.student_profiles for select using (lower(owner_email) = lower(coalesce(auth.jwt() ->> 'email','')));
create policy "users insert own profiles" on public.student_profiles for insert with check (lower(owner_email) = lower(coalesce(auth.jwt() ->> 'email','')));
create policy "users update own profiles" on public.student_profiles for update using (lower(owner_email) = lower(coalesce(auth.jwt() ->> 'email','')));
create policy "users read own runs" on public.recommendation_runs for select using (lower(owner_email) = lower(coalesce(auth.jwt() ->> 'email','')));
create policy "users read own recommendations" on public.recommendation_items for select using (lower(owner_email) = lower(coalesce(auth.jwt() ->> 'email','')));

comment on table public.scholarships is 'Normalized scholarship catalog. Only server-side ingestion may write.';
comment on table public.crawl_jobs is 'Crawler queue. target_url must be selected from the trusted source registry, never raw user input.';
