-- Run this in your Supabase SQL editor (separate from schema.sql)

-- Allow authenticated users to insert coaches
create policy "Authenticated insert coach" on coaches
  for insert with check (auth.uid() is not null);

-- Storage: create avatars bucket
insert into storage.buckets (id, name, public)
  values ('avatars', 'avatars', true)
  on conflict do nothing;

-- Storage RLS
create policy "Public read avatars" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Authenticated upload avatars" on storage.objects
  for insert with check (bucket_id = 'avatars' and auth.uid() is not null);

create policy "Authenticated update avatars" on storage.objects
  for update using (bucket_id = 'avatars' and auth.uid() is not null);
