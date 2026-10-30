-- WGP#1 isolated sample dashboard dataset.
-- Destructive by request: removes all existing sales, attendees and ticket items,
-- then creates exactly 500 form-compatible visitors for 13–17 Jan 2027.
-- staff_profiles and authentication users are preserved.

begin;

truncate table public.ticket_sales cascade;

create temporary table sample500_seed on commit drop as
with base as (
  select
    n,
    'SAMPLE500-' || lpad(n::text, 4, '0') as transaction_id,
    'SAMPLE500-A-' || lpad(n::text, 4, '0') as attendee_ref,
    ('2027-01-13 09:00:00+07'::timestamptz
      + ((n - 1) % 5) * interval '1 day'
      + ((n * 37) % 540) * interval '1 minute') as submitted_at,
    (array['en','th','zh','ja','ko','fr','es'])[1 + ((n - 1) % 7)] as interface_language,
    (array['Ticket Staff 1','Ticket Staff 2','Ticket Staff 3','Ticket Staff 4'])[1 + ((n - 1) % 4)] as staff_name,
    case
      when n % 23 = 0 then 'complimentary'
      when n % 3 = 0 then 'cash'
      else 'qr-transfer'
    end as payment_method,
    (array['Anan','Mali','Narin','Pim','Arun','Lina','Kenji','Mei','Minjun','Sofia','Lucas','Emma','Liam','Chloe','Mateo','Amelia','Noah','Yuna','Leo','Maya'])[1 + ((n * 7) % 20)] as first_name,
    (array['Sukjai','Wongsa','Tanaka','Sato','Kim','Lee','Chen','Wang','Martin','Dubois','Smith','Brown','Garcia','Lopez','Miller','Wilson','Davis','Taylor','Anderson','Moore'])[1 + ((n * 11) % 20)] as last_name,
    (array['under-10','10-19','10-19','20-39','20-39','20-39','20-39','40-59','40-59','60-plus'])[1 + ((n * 3) % 10)] as age_group,
    (array['male','female','female','male','not-specified'])[1 + ((n * 7) % 5)] as gender,
    ((n * 37) % 100) as country_bucket,
    n % 3 = 0 as marketing_consent
  from generate_series(1, 500) as series(n)
), profile as (
  select
    b.*,
    case
      when country_bucket < 40 then 'TH'
      when country_bucket < 49 then 'CN'
      when country_bucket < 57 then 'KR'
      when country_bucket < 65 then 'JP'
      when country_bucket < 71 then 'US'
      when country_bucket < 76 then 'GB'
      when country_bucket < 81 then 'AU'
      when country_bucket < 85 then 'DE'
      when country_bucket < 89 then 'FR'
      when country_bucket < 92 then 'SG'
      when country_bucket = 92 then 'IN'
      when country_bucket = 93 then 'MY'
      when country_bucket = 94 then 'ID'
      when country_bucket = 95 then 'PH'
      when country_bucket = 96 then 'VN'
      when country_bucket = 97 then 'CA'
      when country_bucket = 98 then 'IT'
      else 'ES'
    end as country_code,
    case
      when country_bucket < 40 then 'Thailand'
      when country_bucket < 49 then 'China'
      when country_bucket < 57 then 'South Korea'
      when country_bucket < 65 then 'Japan'
      when country_bucket < 71 then 'United States'
      when country_bucket < 76 then 'United Kingdom'
      when country_bucket < 81 then 'Australia'
      when country_bucket < 85 then 'Germany'
      when country_bucket < 89 then 'France'
      when country_bucket < 92 then 'Singapore'
      when country_bucket = 92 then 'India'
      when country_bucket = 93 then 'Malaysia'
      when country_bucket = 94 then 'Indonesia'
      when country_bucket = 95 then 'Philippines'
      when country_bucket = 96 then 'Vietnam'
      when country_bucket = 97 then 'Canada'
      when country_bucket = 98 then 'Italy'
      else 'Spain'
    end as country_name,
    case
      when n % 5 = 0 then 'weekday-day'
      when n % 5 = 1 then 'weekend-day'
      when n % 5 = 2 then 'weekday-pass'
      when n % 5 = 3 then 'pro-weekend'
      else 'all-event'
    end as ticket_type,
    case
      when n % 5 = 0 then 'Single Day — Weekday'
      when n % 5 = 1 then 'Single Day — Weekend'
      when n % 5 = 2 then 'Weekday Package'
      when n % 5 = 3 then 'Pro Weekend'
      else 'All Event Pass'
    end as ticket_name,
    case
      when payment_method = 'complimentary' then 0::numeric
      when n % 5 = 0 then 250::numeric
      when n % 5 = 1 then 350::numeric
      when n % 5 = 2 then 400::numeric
      when n % 5 = 3 then 500::numeric
      else 750::numeric
    end as unit_price
  from base b
)
select * from profile;

insert into public.ticket_sales (
  transaction_id, event_year, data_mode, interface_language, submitted_at,
  attendee_count, staff_name, payment_method, ticket_quantity,
  calculated_total, amount_paid, note
)
select
  transaction_id, 2027, 'sample-dashboard-500', interface_language, submitted_at,
  1, staff_name, payment_method, 1, unit_price, unit_price,
  '[SAMPLE ONLY] Isolated 500-visitor dashboard test'
from sample500_seed;

insert into public.attendees (
  sale_id, attendee_ref, first_name, last_name, age_group, gender,
  country_code, country_name, previous_attendance, marketing_sources,
  contact_email, guardian, privacy
)
select
  s.id,
  d.attendee_ref,
  d.first_name,
  d.last_name,
  d.age_group,
  d.gender,
  d.country_code,
  d.country_name,
  case when d.n % 4 = 0 then 'returning' else 'first-time' end,
  case d.n % 7
    when 0 then array['online-social','friend-family']::text[]
    when 1 then array['online-social']::text[]
    when 2 then array['pattaya-promotion']::text[]
    when 3 then array['friend-family']::text[]
    when 4 then array['previous-event']::text[]
    when 5 then array['newspaper-television']::text[]
    else array['online-social','pattaya-promotion']::text[]
  end,
  case when d.marketing_consent then 'sample' || lpad(d.n::text, 4, '0') || '@example.com' else null end,
  case
    when d.age_group in ('under-10','10-19') then jsonb_build_object(
      'name', 'Sample Guardian ' || lpad(d.n::text, 4, '0'),
      'relationship', case when d.n % 2 = 0 then 'parent' else 'legal-guardian' end,
      'phone', '080000' || lpad(d.n::text, 4, '0'),
      'confirmed', true
    )
    else null
  end,
  jsonb_build_object(
    'acknowledged', true,
    'mediaConsent', true,
    'marketingConsent', d.marketing_consent,
    'noticeVersion', 'JWC26-DRAFT-06',
    'recordedAt', d.submitted_at,
    'language', d.interface_language,
    'sample', true,
    'dataset', 'sample-dashboard-500'
  )
from sample500_seed d
join public.ticket_sales s on s.transaction_id = d.transaction_id;

insert into public.ticket_items (
  sale_id, ticket_type, ticket_name, unit_price, quantity, line_total
)
select
  s.id, d.ticket_type, d.ticket_name, d.unit_price, 1, d.unit_price
from sample500_seed d
join public.ticket_sales s on s.transaction_id = d.transaction_id;

commit;

select
  count(*) as sample_transactions,
  sum(attendee_count) as sample_visitors,
  sum(ticket_quantity) as sample_tickets,
  sum(amount_paid) as sample_revenue,
  min(submitted_at) as first_sample_sale,
  max(submitted_at) as last_sample_sale
from public.ticket_sales
where data_mode = 'sample-dashboard-500';

select
  (submitted_at at time zone 'Asia/Bangkok')::date as event_date,
  count(*) as visitors,
  sum(amount_paid) as revenue
from public.ticket_sales
where data_mode = 'sample-dashboard-500'
group by 1
order by 1;
