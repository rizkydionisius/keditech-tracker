-- Create team_members table
create table team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  avatar_url text
);

-- Create monthly_kpis table
create table monthly_kpis (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references team_members(id) on delete cascade,
  month_key text not null, -- Format 'YYYY-MM'
  kpi_label text not null,
  kpi_value numeric not null,
  kpi_previous_value numeric not null,
  -- For simplified history tracking in this prototype, we're just going to store the history array as JSONB if needed,
  -- or we rely on queries to fetch multiple months. 
  -- However, the user request specified specific columns.
  -- To match the mockData "kpi_history" array feature we added for analytics, 
  -- we should probably have a separate table or just query previous months dynamically.
  -- But to follow the user's specific request structure (which didn't explicitly ask for a history table),
  -- we will stick to their request but maybe add a JSONB column for the history array to keep it simple for the seed/fetch.
  history_data jsonb 
);

-- Create projects table
create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references team_members(id) on delete cascade,
  month_key text not null, -- Format 'YYYY-MM'
  project_name text not null,
  status text not null, -- 'GREEN', 'YELLOW', 'RED'
  description text
);
