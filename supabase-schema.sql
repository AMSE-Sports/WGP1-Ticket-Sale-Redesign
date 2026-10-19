-- WGP#1 2026 isolated TEST database. Run in the test project's SQL Editor only.
create extension if not exists pgcrypto;

create table if not exists public.ticket_sales (
  id uuid primary key default gen_random_uuid(), transaction_id text not null unique,
  event_year integer not null, data_mode text not null default 'test', interface_language text,
  submitted_at timestamptz not null, attendee_count integer not null check (attendee_count > 0),
  staff_name text not null, payment_method text not null, ticket_quantity integer not null check (ticket_quantity >= 0),
  calculated_total numeric(12,2) not null check (calculated_total >= 0), amount_paid numeric(12,2) not null check (amount_paid >= 0),
  note text, created_at timestamptz not null default now()
);

create table if not exists public.attendees (
  id uuid primary key default gen_random_uuid(), sale_id uuid not null references public.ticket_sales(id) on delete cascade,
  attendee_ref text, first_name text not null, last_name text not null, age_group text not null, gender text not null,
  country_code text not null, country_name text, previous_attendance text not null,
  marketing_sources text[] not null default '{}', contact_email text, guardian jsonb, privacy jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.ticket_items (
  id uuid primary key default gen_random_uuid(), sale_id uuid not null references public.ticket_sales(id) on delete cascade,
  ticket_type text not null, ticket_name text not null, unit_price numeric(12,2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0), line_total numeric(12,2) not null check (line_total >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.staff_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade, display_name text not null,
  role text not null default 'viewer' check (role in ('viewer','manager','admin')),
  active boolean not null default true, created_at timestamptz not null default now()
);

create index if not exists ticket_sales_submitted_at_idx on public.ticket_sales(submitted_at desc);
create index if not exists ticket_sales_staff_idx on public.ticket_sales(staff_name);
create index if not exists attendees_sale_idx on public.attendees(sale_id);
create index if not exists attendees_country_idx on public.attendees(country_code);
create index if not exists ticket_items_sale_idx on public.ticket_items(sale_id);

alter table public.ticket_sales enable row level security;
alter table public.attendees enable row level security;
alter table public.ticket_items enable row level security;
alter table public.staff_profiles enable row level security;

create or replace function public.is_active_staff() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.staff_profiles where user_id = auth.uid() and active = true);
$$;

drop policy if exists "staff read sales" on public.ticket_sales;
create policy "staff read sales" on public.ticket_sales for select to authenticated using (public.is_active_staff());
drop policy if exists "staff read attendees" on public.attendees;
create policy "staff read attendees" on public.attendees for select to authenticated using (public.is_active_staff());
drop policy if exists "staff read ticket items" on public.ticket_items;
create policy "staff read ticket items" on public.ticket_items for select to authenticated using (public.is_active_staff());
drop policy if exists "staff read own profile" on public.staff_profiles;
create policy "staff read own profile" on public.staff_profiles for select to authenticated using (user_id = auth.uid());

create or replace function public.create_ticket_transaction(payload jsonb) returns uuid
language plpgsql security definer set search_path = public as $$
declare new_sale_id uuid; attendee jsonb; item jsonb; payload_attendee_count integer; payload_ticket_quantity integer;
begin
  payload_attendee_count := jsonb_array_length(coalesce(payload->'attendees', '[]'::jsonb));
  payload_ticket_quantity := coalesce((payload->'sale'->>'ticketQuantity')::integer, 0);
  if payload_attendee_count < 1 then raise exception 'At least one attendee is required'; end if;
  if payload_attendee_count <> coalesce((payload->>'attendeeCount')::integer, -1) then raise exception 'Attendee count mismatch'; end if;
  if payload_attendee_count <> payload_ticket_quantity then raise exception 'Ticket quantity must match attendee count'; end if;
  if nullif(trim(payload->'sale'->>'staff'), '') is null then raise exception 'Staff is required'; end if;

  insert into public.ticket_sales (transaction_id,event_year,data_mode,interface_language,submitted_at,attendee_count,staff_name,payment_method,ticket_quantity,calculated_total,amount_paid,note)
  values (payload->>'transactionId',(payload->>'eventYear')::integer,coalesce(payload->>'dataMode','test'),payload->>'interfaceLanguage',(payload->>'submittedAt')::timestamptz,payload_attendee_count,payload->'sale'->>'staff',payload->'sale'->>'paymentMethod',payload_ticket_quantity,coalesce((payload->'sale'->>'calculatedTotal')::numeric,0),coalesce((payload->'sale'->>'amountPaid')::numeric,0),nullif(trim(payload->'sale'->>'note'),''))
  returning id into new_sale_id;

  for attendee in select value from jsonb_array_elements(payload->'attendees') loop
    insert into public.attendees (sale_id,attendee_ref,first_name,last_name,age_group,gender,country_code,country_name,previous_attendance,marketing_sources,contact_email,guardian,privacy)
    values (new_sale_id,attendee->>'attendeeId',attendee->>'firstName',attendee->>'lastName',attendee->>'ageGroup',attendee->>'gender',attendee->>'countryCode',attendee->>'countryName',attendee->>'previousAttendance',array(select jsonb_array_elements_text(coalesce(attendee->'marketingSources','[]'::jsonb))),nullif(trim(attendee->>'contactEmail'),''),attendee->'guardian',attendee->'privacy');
  end loop;

  for item in select value from jsonb_array_elements(payload->'sale'->'ticketItems') loop
    insert into public.ticket_items (sale_id,ticket_type,ticket_name,unit_price,quantity,line_total)
    values (new_sale_id,item->>'ticketType',item->>'ticketName',(item->>'unitPrice')::numeric,(item->>'quantity')::integer,(item->>'lineTotal')::numeric);
  end loop;
  return new_sale_id;
end;
$$;

revoke all on function public.create_ticket_transaction(jsonb) from public;
grant execute on function public.create_ticket_transaction(jsonb) to anon, authenticated;
grant execute on function public.is_active_staff() to authenticated;

-- After creating a dashboard user in Authentication > Users, run once:
-- insert into public.staff_profiles (user_id, display_name, role)
-- values ('AUTH-USER-UUID', 'Dashboard Admin', 'admin');
