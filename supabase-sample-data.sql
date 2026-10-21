-- WGP#1 dashboard demo data. Safe to run repeatedly: SAMPLE transaction IDs are unique.
begin;

with sample_sales(transaction_id, submitted_at, attendee_count, staff_name, payment_method, ticket_type, ticket_name, unit_price, interface_language) as (
  values
    ('SAMPLE-20261015-001', '2026-10-15 09:15:00+07'::timestamptz, 2, 'Demo Staff A', 'cash',          'weekend-day',  'Single Day — Weekend', 350::numeric, 'th'),
    ('SAMPLE-20261015-002', '2026-10-15 13:40:00+07'::timestamptz, 1, 'Demo Staff B', 'qr-transfer',   'all-event',    'All Event Pass',       750::numeric, 'ja'),
    ('SAMPLE-20261016-001', '2026-10-16 10:05:00+07'::timestamptz, 3, 'Demo Staff A', 'qr-transfer',   'weekend-day',  'Single Day — Weekend', 350::numeric, 'zh'),
    ('SAMPLE-20261016-002', '2026-10-16 15:20:00+07'::timestamptz, 2, 'Demo Staff C', 'cash',          'pro-weekend',  'Pro Weekend',          500::numeric, 'ko'),
    ('SAMPLE-20261017-001', '2026-10-17 11:30:00+07'::timestamptz, 1, 'Demo Staff B', 'complimentary', 'complimentary','Complimentary',           0::numeric, 'fr'),
    ('SAMPLE-20261017-002', '2026-10-17 16:10:00+07'::timestamptz, 2, 'Demo Staff A', 'qr-transfer',   'weekday-pass', 'Weekday Package',      400::numeric, 'en'),
    ('SAMPLE-20261018-001', '2026-10-18 09:45:00+07'::timestamptz, 4, 'Demo Staff C', 'cash',          'weekend-day',  'Single Day — Weekend', 350::numeric, 'th'),
    ('SAMPLE-20261018-002', '2026-10-18 14:25:00+07'::timestamptz, 1, 'Demo Staff B', 'qr-transfer',   'all-event',    'All Event Pass',       750::numeric, 'de'),
    ('SAMPLE-20261019-001', '2026-10-19 10:50:00+07'::timestamptz, 2, 'Demo Staff A', 'qr-transfer',   'pro-weekend',  'Pro Weekend',          500::numeric, 'en'),
    ('SAMPLE-20261019-002', '2026-10-19 15:35:00+07'::timestamptz, 1, 'Demo Staff C', 'cash',          'weekday-day',  'Single Day — Weekday', 250::numeric, 'en'),
    ('SAMPLE-20261020-001', '2026-10-20 12:05:00+07'::timestamptz, 2, 'Demo Staff B', 'qr-transfer',   'all-event',    'All Event Pass',       750::numeric, 'en'),
    ('SAMPLE-20261021-001', '2026-10-21 09:20:00+07'::timestamptz, 1, 'Demo Staff A', 'cash',          'weekend-day',  'Single Day — Weekend', 350::numeric, 'ru')
)
insert into public.ticket_sales (
  transaction_id, event_year, data_mode, interface_language, submitted_at,
  attendee_count, staff_name, payment_method, ticket_quantity,
  calculated_total, amount_paid, note
)
select
  transaction_id, 2026, 'sample-demo', interface_language, submitted_at,
  attendee_count, staff_name, payment_method, attendee_count,
  unit_price * attendee_count, unit_price * attendee_count,
  '[SAMPLE DATA] Dashboard preview'
from sample_sales
on conflict (transaction_id) do nothing;

with sample_sales(transaction_id, attendee_count, ticket_type, ticket_name, unit_price) as (
  values
    ('SAMPLE-20261015-001', 2, 'weekend-day',   'Single Day — Weekend', 350::numeric),
    ('SAMPLE-20261015-002', 1, 'all-event',     'All Event Pass',       750::numeric),
    ('SAMPLE-20261016-001', 3, 'weekend-day',   'Single Day — Weekend', 350::numeric),
    ('SAMPLE-20261016-002', 2, 'pro-weekend',   'Pro Weekend',          500::numeric),
    ('SAMPLE-20261017-001', 1, 'complimentary', 'Complimentary',           0::numeric),
    ('SAMPLE-20261017-002', 2, 'weekday-pass',  'Weekday Package',      400::numeric),
    ('SAMPLE-20261018-001', 4, 'weekend-day',   'Single Day — Weekend', 350::numeric),
    ('SAMPLE-20261018-002', 1, 'all-event',     'All Event Pass',       750::numeric),
    ('SAMPLE-20261019-001', 2, 'pro-weekend',   'Pro Weekend',          500::numeric),
    ('SAMPLE-20261019-002', 1, 'weekday-day',   'Single Day — Weekday', 250::numeric),
    ('SAMPLE-20261020-001', 2, 'all-event',     'All Event Pass',       750::numeric),
    ('SAMPLE-20261021-001', 1, 'weekend-day',   'Single Day — Weekend', 350::numeric)
)
insert into public.ticket_items (sale_id, ticket_type, ticket_name, unit_price, quantity, line_total)
select s.id, d.ticket_type, d.ticket_name, d.unit_price, d.attendee_count, d.unit_price * d.attendee_count
from sample_sales d
join public.ticket_sales s on s.transaction_id = d.transaction_id
where not exists (
  select 1 from public.ticket_items i where i.sale_id = s.id and i.ticket_type = d.ticket_type
);

with sample_attendees(transaction_id, attendee_ref, first_name, last_name, age_group, gender, country_code, country_name, previous_attendance, marketing_sources) as (
  values
    ('SAMPLE-20261015-001','SAMPLE-A01','Sample','Visitor 01','25-34','female','TH','Thailand','returning',array['online-social','previous-event']::text[]),
    ('SAMPLE-20261015-001','SAMPLE-A02','Sample','Visitor 02','35-44','male','TH','Thailand','first-time',array['friend-family']::text[]),
    ('SAMPLE-20261015-002','SAMPLE-A03','Sample','Visitor 03','25-34','male','JP','Japan','first-time',array['online-social']::text[]),
    ('SAMPLE-20261016-001','SAMPLE-A04','Sample','Visitor 04','18-24','female','CN','China','first-time',array['online-social']::text[]),
    ('SAMPLE-20261016-001','SAMPLE-A05','Sample','Visitor 05','25-34','male','CN','China','first-time',array['pattaya-promotion']::text[]),
    ('SAMPLE-20261016-001','SAMPLE-A06','Sample','Visitor 06','35-44','female','CN','China','returning',array['previous-event']::text[]),
    ('SAMPLE-20261016-002','SAMPLE-A07','Sample','Visitor 07','25-34','female','KR','South Korea','first-time',array['online-social','friend-family']::text[]),
    ('SAMPLE-20261016-002','SAMPLE-A08','Sample','Visitor 08','45-54','male','KR','South Korea','returning',array['previous-event']::text[]),
    ('SAMPLE-20261017-001','SAMPLE-A09','Sample','Visitor 09','35-44','female','FR','France','first-time',array['newspaper-television']::text[]),
    ('SAMPLE-20261017-002','SAMPLE-A10','Sample','Visitor 10','25-34','male','US','United States','first-time',array['online-social']::text[]),
    ('SAMPLE-20261017-002','SAMPLE-A11','Sample','Visitor 11','55-64','female','US','United States','returning',array['friend-family','previous-event']::text[]),
    ('SAMPLE-20261018-001','SAMPLE-A12','Sample','Visitor 12','18-24','female','TH','Thailand','first-time',array['online-social']::text[]),
    ('SAMPLE-20261018-001','SAMPLE-A13','Sample','Visitor 13','25-34','male','TH','Thailand','returning',array['previous-event']::text[]),
    ('SAMPLE-20261018-001','SAMPLE-A14','Sample','Visitor 14','35-44','female','TH','Thailand','first-time',array['pattaya-promotion']::text[]),
    ('SAMPLE-20261018-001','SAMPLE-A15','Sample','Visitor 15','under-18','male','TH','Thailand','first-time',array['friend-family']::text[]),
    ('SAMPLE-20261018-002','SAMPLE-A16','Sample','Visitor 16','45-54','male','DE','Germany','first-time',array['newspaper-television','online-social']::text[]),
    ('SAMPLE-20261019-001','SAMPLE-A17','Sample','Visitor 17','25-34','female','AU','Australia','first-time',array['online-social']::text[]),
    ('SAMPLE-20261019-001','SAMPLE-A18','Sample','Visitor 18','35-44','male','AU','Australia','returning',array['previous-event']::text[]),
    ('SAMPLE-20261019-002','SAMPLE-A19','Sample','Visitor 19','25-34','female','SG','Singapore','first-time',array['friend-family']::text[]),
    ('SAMPLE-20261020-001','SAMPLE-A20','Sample','Visitor 20','45-54','male','GB','United Kingdom','first-time',array['online-social','newspaper-television']::text[]),
    ('SAMPLE-20261020-001','SAMPLE-A21','Sample','Visitor 21','35-44','female','GB','United Kingdom','returning',array['previous-event']::text[]),
    ('SAMPLE-20261021-001','SAMPLE-A22','Sample','Visitor 22','25-34','male','RU','Russia','first-time',array['online-social']::text[])
)
insert into public.attendees (
  sale_id, attendee_ref, first_name, last_name, age_group, gender,
  country_code, country_name, previous_attendance, marketing_sources,
  contact_email, guardian, privacy
)
select
  s.id, a.attendee_ref, a.first_name, a.last_name, a.age_group, a.gender,
  a.country_code, a.country_name, a.previous_attendance, a.marketing_sources,
  null, null,
  jsonb_build_object('noticeVersion','JWC26-DRAFT-06','mediaConsent',true,'sample',true)
from sample_attendees a
join public.ticket_sales s on s.transaction_id = a.transaction_id
where not exists (
  select 1 from public.attendees p where p.sale_id = s.id and p.attendee_ref = a.attendee_ref
);

commit;

select
  count(*) filter (where data_mode = 'sample-demo') as sample_transactions,
  coalesce(sum(attendee_count) filter (where data_mode = 'sample-demo'), 0) as sample_visitors,
  coalesce(sum(amount_paid) filter (where data_mode = 'sample-demo'), 0) as sample_revenue
from public.ticket_sales;
