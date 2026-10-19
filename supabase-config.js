"use strict";

// Public browser configuration for the isolated WGP#1 test database.
// The anon key is designed to be public. Database security is enforced by RLS.
window.WGP1_SUPABASE_CONFIG = Object.freeze({
  enabled: true,
  url: "https://nianjgspxofnlqbdmzyo.supabase.co",
  anonKey: "sb_publishable_4HqdTIdWgUOHdG-OGinFYA_1MBJ3hBh",
  mode: "test"
});
