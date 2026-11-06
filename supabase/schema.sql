-- Run this in your Supabase SQL editor

create type division as enum ('bodybuilding', 'fitness', 'other');

-- Public profiles (extends Supabase auth.users)
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique not null,
  avatar_url text,
  created_at timestamptz default now()
);

-- Coaches
create table coaches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  division division not null,
  bio text,
  avatar_url text,
  avg_rating numeric(3,2) default 0,
  review_count int default 0,
  created_at timestamptz default now()
);

-- Reviews
create table reviews (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references coaches on delete cascade,
  user_id uuid not null references profiles on delete cascade,
  rating int not null check (rating between 1 and 5),
  body text not null,
  created_at timestamptz default now(),
  unique (coach_id, user_id)  -- one review per user per coach
);

-- Auto-update avg_rating and review_count on coaches
create or replace function update_coach_rating()
returns trigger language plpgsql as $$
begin
  update coaches set
    avg_rating = (select avg(rating) from reviews where coach_id = coalesce(new.coach_id, old.coach_id)),
    review_count = (select count(*) from reviews where coach_id = coalesce(new.coach_id, old.coach_id))
  where id = coalesce(new.coach_id, old.coach_id);
  return new;
end;
$$;

create trigger on_review_change
after insert or update or delete on reviews
for each row execute function update_coach_rating();

-- RLS
alter table profiles enable row level security;
alter table coaches enable row level security;
alter table reviews enable row level security;

create policy "Public read profiles" on profiles for select using (true);
create policy "Own profile" on profiles for all using (auth.uid() = id);

create policy "Public read coaches" on coaches for select using (true);

create policy "Public read reviews" on reviews for select using (true);
create policy "Authenticated insert review" on reviews for insert with check (auth.uid() = user_id);
create policy "Own review update/delete" on reviews for all using (auth.uid() = user_id);
