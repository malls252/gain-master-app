-- Create profiles table
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text,
  total_exp integer default 0,
  streak integer default 0,
  last_active_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create generic policies (allow users to read/update their own data)
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Create meal_plans table
create table public.meal_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  name text not null,
  foods jsonb default '[]'::jsonb,
  total_calories integer default 0,
  exp_reward integer default 15,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.meal_plans enable row level security;

create policy "Users can view their own meal plans" on public.meal_plans
  for select using (auth.uid() = user_id);

create policy "Users can insert their own meal plans" on public.meal_plans
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own meal plans" on public.meal_plans
  for delete using (auth.uid() = user_id);

-- Create daily_progress table
create table public.daily_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  date date not null,
  completed_item_ids text[] default array[]::text[],
  is_day_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date)
);

alter table public.daily_progress enable row level security;

create policy "Users can view their own progress" on public.daily_progress
  for select using (auth.uid() = user_id);

create policy "Users can insert/update their own progress" on public.daily_progress
  for all using (auth.uid() = user_id);

-- Create custom_tasks table
create table public.custom_tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  title text not null,
  description text,
  category text,
  exp_reward integer default 10,
  icon text,
  is_custom boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.custom_tasks enable row level security;

create policy "Users can view their own custom tasks" on public.custom_tasks
  for select using (auth.uid() = user_id);

create policy "Users can insert their own custom tasks" on public.custom_tasks
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own custom tasks" on public.custom_tasks
  for delete using (auth.uid() = user_id);

-- Create custom_foods table
create table public.custom_foods (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  name text not null,
  description text,
  calories integer,
  protein integer,
  carbs integer,
  fat integer,
  portion text,
  timing text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.custom_foods enable row level security;

create policy "Users can view their own custom foods" on public.custom_foods
  for select using (auth.uid() = user_id);

create policy "Users can insert their own custom foods" on public.custom_foods
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own custom foods" on public.custom_foods
  for delete using (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, total_exp, streak, last_active_date)
  values (new.id, new.raw_user_meta_data->>'username', 0, 0, current_date);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
