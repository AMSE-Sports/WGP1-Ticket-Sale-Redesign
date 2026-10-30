-- WGP#1 dashboard dataset: 300 synthetic sales outside the event dates.
-- Safe to rerun: DEMO300 transaction IDs and attendee references are unique.
begin;

with sale_seed as (
  select
    n,
    'DEMO300-' || lpad(n::text, 4, '0') as transaction_id,
    ('2026-08-01 08:00:00+07'::timestamptz
      + ((n - 1) % 92) * interval '1 day'
      + ((n * 7) % 10) * interval '1 hour'
      + ((n * 13) % 60) * interval '1 minute') as submitted_at,
    1 + (n % 4) as attendee_count,
    (array['Demo Staff A','Demo Staff B','Demo Staff C','Demo Staff D'])[1 + (n % 4)] as staff_name,
    case
      when n % 19 = 0 then 'complimentary'
      when n % 3 = 0 then 'cash'
      else 'qr-transfer'
    end as payment_method,
    (array['en','th','zh','ja','fr','de','es'])[1 + (n % 7)] as interface_language
  from generate_series(1, 300) as series(n)
), sale_details as (
  select
    s.*,
    case
      when payment_method = 'complimentary' then 'complimentary'
      else (array['weekday-day','weekend-day','weekday-pass','pro-weekend','all-event'])[1 + (n % 5)]
    end as ticket_type,
    case
      when payment_method = 'complimentary' then 'Complimentary'
      else (array['Single Day — Weekday','Single Day — Weekend','Weekday Package','Pro Weekend','All Event Pass'])[1 + (n % 5)]
    end as ticket_name,
    case
      when payment_method = 'complimentary' then 0::numeric
      else (array[250,350,400,500,750]::numeric[])[1 + (n % 5)]
    end as unit_price
  from sale_seed s
)
insert into public.ticket_sales (
  transaction_id, event_year, data_mode, interface_language, submitted_at,
  attendee_count, staff_name, payment_method, ticket_quantity,
  calculated_total, amount_paid, note
)
select
  transaction_id, 2026, 'sample-demo-300', interface_language, submitted_at,
  attendee_count, staff_name, payment_method, attendee_count,
  unit_price * attendee_count, unit_price * attendee_count,
  '[SAMPLE DATA] 300-sale dashboard simulation'
from sale_details
on conflict (transaction_id) do nothing;

with sale_seed as (
  select
    n,
    'DEMO300-' || lpad(n::text, 4, '0') as transaction_id,
    1 + (n % 4) as attendee_count,
    case
      when n % 19 = 0 then 'complimentary'
      else (array['weekday-day','weekend-day','weekday-pass','pro-weekend','all-event'])[1 + (n % 5)]
    end as ticket_type,
    case
      when n % 19 = 0 then 'Complimentary'
      else (array['Single Day — Weekday','Single Day — Weekend','Weekday Package','Pro Weekend','All Event Pass'])[1 + (n % 5)]
    end as ticket_name,
    case
      when n % 19 = 0 then 0::numeric
      else (array[250,350,400,500,750]::numeric[])[1 + (n % 5)]
    end as unit_price
  from generate_series(1, 300) as series(n)
)
insert into public.ticket_items (
  sale_id, ticket_type, ticket_name, unit_price, quantity, line_total
)
select
  s.id, d.ticket_type, d.ticket_name, d.unit_price,
  d.attendee_count, d.unit_price * d.attendee_count
from sale_seed d
join public.ticket_sales s on s.transaction_id = d.transaction_id
where not exists (
  select 1 from public.ticket_items i where i.sale_id = s.id
);

with sale_seed as (
  select
    n,
    'DEMO300-' || lpad(n::text, 4, '0') as transaction_id,
    1 + (n % 4) as attendee_count
  from generate_series(1, 300) as series(n)
), attendee_seed as (
  select
    s.n,
    s.transaction_id,
    attendee_no,
    ((s.n * 37 + attendee_no * 11) % 100) as country_bucket
  from sale_seed s
  cross join lateral generate_series(1, s.attendee_count) as attendee(attendee_no)
), attendee_details as (
  select
    a.*,
    case
      when country_bucket < 35 then 'TH'
      when country_bucket < 45 then 'CN'
      when country_bucket < 52 then 'KR'
      when country_bucket < 59 then 'JP'
      when country_bucket < 65 then 'US'
      when country_bucket < 70 then 'GB'
      when country_bucket < 75 then 'AU'
      when country_bucket < 79 then 'DE'
      when country_bucket < 83 then 'FR'
      when country_bucket < 86 then 'SG'
      when country_bucket < 89 then 'RU'
      when country_bucket < 91 then 'IN'
      when country_bucket = 91 then 'MY'
      when country_bucket = 92 then 'ID'
      when country_bucket = 93 then 'PH'
      when country_bucket = 94 then 'VN'
      when country_bucket = 95 then 'CA'
      when country_bucket = 96 then 'IT'
      when country_bucket = 97 then 'ES'
      when country_bucket = 98 then 'AE'
      else 'NL'
    end as country_code,
    case
      when country_bucket < 35 then 'Thailand'
      when country_bucket < 45 then 'China'
      when country_bucket < 52 then 'South Korea'
      when country_bucket < 59 then 'Japan'
      when country_bucket < 65 then 'United States'
      when country_bucket < 70 then 'United Kingdom'
      when country_bucket < 75 then 'Australia'
      when country_bucket < 79 then 'Germany'
      when country_bucket < 83 then 'France'
      when country_bucket < 86 then 'Singapore'
      when country_bucket < 89 then 'Russia'
      when country_bucket < 91 then 'India'
      when country_bucket = 91 then 'Malaysia'
      when country_bucket = 92 then 'Indonesia'
      when country_bucket = 93 then 'Philippines'
      when country_bucket = 94 then 'Vietnam'
      when country_bucket = 95 then 'Canada'
      when country_bucket = 96 then 'Italy'
      when country_bucket = 97 then 'Spain'
      when country_bucket = 98 then 'United Arab Emirates'
      else 'Netherlands'
    end as country_name
  from attendee_seed a
)
insert into public.attendees (
  sale_id, attendee_ref, first_name, last_name, age_group, gender,
  country_code, country_name, previous_attendance, marketing_sources,
  contact_email, guardian, privacy
)
select
  s.id,
  'DEMO300-A-' || lpad(a.n::text, 4, '0') || '-' || a.attendee_no,
  'Sample',
  'Visitor ' || lpad(a.n::text, 4, '0') || '-' || a.attendee_no,
  (array['under-10','10-19','20-39','20-39','20-39','40-59','40-59','60-plus'])[1 + ((a.n + a.attendee_no) % 8)],
  case when (a.n + a.attendee_no) % 2 = 0 then 'female' else 'male' end,
  a.country_code,
  a.country_name,
  case when (a.n + a.attendee_no) % 4 = 0 then 'returning' else 'first-time' end,
  case ((a.n + a.attendee_no) % 7)
    when 0 then array['online-social','friend-family']::text[]
    when 1 then array['online-social']::text[]
    when 2 then array['pattaya-promotion']::text[]
    when 3 then array['friend-family']::text[]
    when 4 then array['previous-event']::text[]
    when 5 then array['newspaper-television']::text[]
    else array['online-social','pattaya-promotion']::text[]
  end,
  null,
  null,
  jsonb_build_object(
    'noticeVersion', 'JWC26-DRAFT-06',
    'mediaConsent', true,
    'sample', true,
    'dataset', 'sample-demo-300'
  )
from attendee_details a
join public.ticket_sales s on s.transaction_id = a.transaction_id
where not exists (
  select 1
  from public.attendees p
  where p.sale_id = s.id
    and p.attendee_ref = 'DEMO300-A-' || lpad(a.n::text, 4, '0') || '-' || a.attendee_no
);

commit;

select
  count(*) as sample_transactions,
  coalesce(sum(attendee_count), 0) as sample_visitors,
  coalesce(sum(ticket_quantity), 0) as sample_tickets,
  coalesce(sum(amount_paid), 0) as sample_revenue,
  min(submitted_at) as first_sample_sale,
  max(submitted_at) as last_sample_sale
from public.ticket_sales
where data_mode = 'sample-demo-300';
