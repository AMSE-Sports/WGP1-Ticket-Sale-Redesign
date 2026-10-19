# WGP#1 Ticket Sale — 2026 Development Copy

This repository is an isolated development copy of `AMSE-Sports/WGP1-Ticket-Sale`.

## Development safeguards

- The original 2025 repository is not modified.
- The 2026 page runs in local development mode.
- Until the isolated test database is configured, registrations are queued in browser `localStorage`.
- `supabase-schema.sql` creates separate sales, attendee, ticket-item and staff-access tables with Row Level Security.
- `dashboard.html` provides the English-only Staff Analytics Dashboard with filters and CSV export.
- The production Supabase project and tables are not used by this copy.
- Ticket dates and prices are draft configuration values in `app.js`.

## Registration flow

1. Each visitor completes an individual registration and privacy acknowledgement.
2. Additional visitors can be added one at a time to the same sale.
3. A handover screen separates the visitor and staff sections.
4. Staff allocate ticket types, verify quantities and record payment.
5. Ticket quantity must equal the number of registered visitors.

## Test database setup

1. Create a separate Supabase test project.
2. Run `supabase-schema.sql` in its SQL Editor.
3. Add the project URL and public anon key to `supabase-config.js`, then set `enabled` to `true`.
4. Create an Authentication user for the dashboard and add its UUID to `staff_profiles` using the final statement documented in the schema.
5. Complete a test transaction and verify the sale in `dashboard.html`.

Before production launch, confirm the 2026 schedule, prices, staff accounts, Privacy Notice, data-retention policy and production database migration.
