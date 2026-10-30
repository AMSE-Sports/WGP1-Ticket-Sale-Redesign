"use strict";

// Keep a dashboard-local fallback because some mobile content blockers prevent
// the separate `supabase-config.js` file from loading. The publishable key is
// intentionally public; database access remains protected by Supabase RLS.
const config = window.WGP1_SUPABASE_CONFIG || Object.freeze({
  enabled: true,
  url: "https://nianjgspxofnlqbdmzyo.supabase.co",
  anonKey: "sb_publishable_4HqdTIdWgUOHdG-OGinFYA_1MBJ3hBh",
  mode: "test",
});
const sessionKey = "wgp1-dashboard-session";
const loginAliases = Object.freeze({
  admin: "admin@wgp1.local",
  "admin@wgp1.local": "admin@wgp1.local",
});
const eventDays = Object.freeze([
  { key: "2027-01-13", day: "DAY 1", label: "13 JAN" },
  { key: "2027-01-14", day: "DAY 2", label: "14 JAN" },
  { key: "2027-01-15", day: "DAY 3", label: "15 JAN" },
  { key: "2027-01-16", day: "DAY 4", label: "16 JAN" },
  { key: "2027-01-17", day: "DAY 5", label: "17 JAN" },
]);
const state = {
  sales: [],
  attendees: [],
  tickets: [],
  filteredSales: [],
  tableExpanded: false,
};
const $ = (id) => document.getElementById(id);
const money = (value) =>
  `${Number(value || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })} THB`;
const number = (value) => Number(value || 0).toLocaleString("en-US");
const escapeCsv = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const bangkokPartsFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Bangkok",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
const heatmapDateFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Bangkok",
  weekday: "short",
  day: "2-digit",
  month: "short",
});

function configured() {
  return Boolean(config.enabled && config.url && config.anonKey);
}
function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem(sessionKey) || "null");
  } catch {
    return null;
  }
}
function setSession(session) {
  sessionStorage.setItem(sessionKey, JSON.stringify(session));
}
function clearSession() {
  sessionStorage.removeItem(sessionKey);
}
function show(id) {
  ["setup-panel", "login-panel", "password-panel", "dashboard"].forEach(
    (name) => $(name).classList.toggle("hidden", name !== id),
  );
}

async function api(path, token, options = {}) {
  const response = await fetch(`${config.url}${path}`, {
    ...options,
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(
      body?.msg ||
        body?.message ||
        body?.error_description ||
        body?.error ||
        `Request failed (${response.status})`,
    );
  }
  return response.status === 204 ? null : response.json();
}

async function login(email, password) {
  const session = await api(
    "/auth/v1/token?grant_type=password",
    config.anonKey,
    { method: "POST", body: JSON.stringify({ email, password }) },
  );
  setSession(session);
  return session;
}

function resolveLoginEmail(username) {
  return loginAliases[String(username || "").trim().toLowerCase()] || null;
}

function readInviteSession() {
  const params = new URLSearchParams(window.location.hash.slice(1));
  const accessToken = params.get("access_token");
  const type = params.get("type");
  if (!accessToken || !["invite", "recovery"].includes(type)) return false;
  setSession({
    access_token: accessToken,
    refresh_token: params.get("refresh_token"),
    token_type: params.get("token_type") || "bearer",
    expires_in: Number(params.get("expires_in") || 0),
    password_setup_required: true,
  });
  history.replaceState(
    {},
    document.title,
    `${location.pathname}${location.search}`,
  );
  show("password-panel");
  return true;
}

async function updatePassword(password) {
  const session = getSession();
  if (!session?.access_token)
    throw new Error(
      "This invitation link is no longer active. Please request a new invitation.",
    );
  await api("/auth/v1/user", session.access_token, {
    method: "PUT",
    body: JSON.stringify({ password }),
  });
  setSession({ ...session, password_setup_required: false });
}

async function loadData() {
  const session = getSession();
  if (!session?.access_token) {
    show("login-panel");
    return;
  }
  $("refresh-data").disabled = true;
  try {
    const [sales, attendees, tickets] = await Promise.all([
      api(
        "/rest/v1/ticket_sales?select=*&order=submitted_at.desc&limit=5000",
        session.access_token,
      ),
      api(
        "/rest/v1/attendees?select=id,sale_id,age_group,gender,country_code,country_name,previous_attendance,marketing_sources&limit=10000",
        session.access_token,
      ),
      api("/rest/v1/ticket_items?select=*&limit=10000", session.access_token),
    ]);
    state.sales = sales;
    state.attendees = attendees;
    state.tickets = tickets;
    populateStaff();
    applyFilters();
    show("dashboard");
    $("sign-out").classList.remove("hidden");
    $("connection-status").className = "status live";
    $("connection-status").textContent = "Live test data";
    $("last-updated").textContent =
      `Updated ${new Date().toLocaleString("en-GB")}`;
  } catch (error) {
    if (/JWT|token|401/i.test(error.message)) {
      clearSession();
      show("login-panel");
    } else {
      alert(`Unable to load analytics: ${error.message}`);
    }
  } finally {
    $("refresh-data").disabled = false;
  }
}

function populateStaff() {
  const current = $("filter-staff").value;
  const names = [
    ...new Set(state.sales.map((sale) => sale.staff_name).filter(Boolean)),
  ].sort();
  const select = $("filter-staff");
  select.textContent = "";
  const all = document.createElement("option");
  all.value = "";
  all.textContent = "All staff";
  select.appendChild(all);
  names.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  });
  $("filter-staff").value = names.includes(current) ? current : "";
}

function applyFilters() {
  const from = $("filter-from").value
    ? new Date(`${$("filter-from").value}T00:00:00+07:00`)
    : null;
  const to = $("filter-to").value
    ? new Date(`${$("filter-to").value}T23:59:59.999+07:00`)
    : null;
  const staff = $("filter-staff").value;
  const payment = $("filter-payment").value;
  state.filteredSales = state.sales.filter((sale) => {
    const date = new Date(sale.submitted_at);
    return (
      (!from || date >= from) &&
      (!to || date <= to) &&
      (!staff || sale.staff_name === staff) &&
      (!payment || sale.payment_method === payment)
    );
  });
  state.tableExpanded = false;
  renderDashboard();
}

function nonDateFilteredSales() {
  const staff = $("filter-staff").value;
  const payment = $("filter-payment").value;
  return state.sales.filter(
    (sale) =>
      (!staff || sale.staff_name === staff) &&
      (!payment || sale.payment_method === payment),
  );
}

function eventDayKey(value) {
  return bangkokDateParts(value).dateKey;
}

function quickMenuSelection() {
  const from = $("filter-from").value;
  const to = $("filter-to").value;
  if (!from && !to) return "total";
  return from === to && eventDays.some((day) => day.key === from) ? from : "";
}

function renderEventDayMenu() {
  const root = $("event-day-menu");
  const sales = nonDateFilteredSales();
  const selected = quickMenuSelection();
  const items = [
    { key: "total", day: "ALL EVENT", label: "TOTAL", sales },
    ...eventDays.map((day) => ({
      ...day,
      sales: sales.filter((sale) => eventDayKey(sale.submitted_at) === day.key),
    })),
  ];
  root.textContent = "";
  items.forEach((item) => {
    const revenue = item.sales.reduce(
      (sum, sale) => sum + Number(sale.amount_paid || 0),
      0,
    );
    const tickets = item.sales.reduce(
      (sum, sale) => sum + Number(sale.ticket_quantity || 0),
      0,
    );
    const button = document.createElement("button");
    button.type = "button";
    button.className = `event-day-card${selected === item.key ? " active" : ""}`;
    button.setAttribute("aria-pressed", selected === item.key ? "true" : "false");
    button.innerHTML = `
      <span>${item.day}</span>
      <strong>${item.label}</strong>
      <b>${money(revenue)}</b>
      <small>${number(tickets)} tickets · ${number(item.sales.length)} sales</small>
    `;
    button.addEventListener("click", () => {
      if (item.key === "total") {
        $("filter-from").value = "";
        $("filter-to").value = "";
      } else {
        $("filter-from").value = item.key;
        $("filter-to").value = item.key;
      }
      applyFilters();
    });
    root.appendChild(button);
  });
}

function countBy(items, valueFn, amountFn = () => 1) {
  return items.reduce((result, item) => {
    const values = valueFn(item);
    const keys = Array.isArray(values) ? values : [values];
    keys
      .filter(Boolean)
      .forEach(
        (key) =>
          (result[key] = (result[key] || 0) + Number(amountFn(item) || 0)),
      );
    return result;
  }, {});
}

function renderBars(id, values, formatter = number, limit = 8) {
  const entries = Object.entries(values)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
  const root = $(id);
  root.textContent = "";
  if (!entries.length) {
    root.innerHTML = '<div class="chart-empty">No data for this filter</div>';
    return;
  }
  const max = Math.max(...entries.map(([, value]) => value), 1);
  entries.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "bar-row";
    const labelNode = document.createElement("span");
    labelNode.className = "bar-label";
    labelNode.title = label;
    labelNode.textContent = label;
    const track = document.createElement("span");
    track.className = "bar-track";
    const fill = document.createElement("span");
    fill.className = "bar-fill";
    fill.style.width = `${Math.max(2, (value / max) * 100)}%`;
    track.appendChild(fill);
    const valueNode = document.createElement("strong");
    valueNode.className = "bar-value";
    valueNode.textContent = formatter(value);
    row.append(labelNode, track, valueNode);
    root.appendChild(row);
  });
}

function bangkokDateParts(value) {
  const parts = Object.fromEntries(
    bangkokPartsFormatter
      .formatToParts(new Date(value))
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
  return {
    dateKey: `${parts.year}-${parts.month}-${parts.day}`,
    minuteOfDay: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

function minuteLabel(startMinute, bucketSize) {
  const format = (minute) =>
    `${String(Math.floor(minute / 60) % 24).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
  return `${format(startMinute)}–${format(startMinute + bucketSize)}`;
}

function renderTimeHeatmap(sales) {
  const root = $("time-heatmap");
  root.textContent = "";
  if (!sales.length) {
    root.innerHTML = '<div class="chart-empty">No data for this filter</div>';
    $("peak-period").textContent = "—";
    $("busiest-day").textContent = "—";
    $("average-frequency").textContent = "—";
    return;
  }

  const bucketSize = Number($("time-bucket").value || 60);
  const buckets = new Map();
  const dayTotals = new Map();
  const observedMinutes = [];
  sales.forEach((sale) => {
    const { dateKey, minuteOfDay } = bangkokDateParts(sale.submitted_at);
    const bucketStart = Math.floor(minuteOfDay / bucketSize) * bucketSize;
    const key = `${dateKey}|${bucketStart}`;
    const current = buckets.get(key) || { tickets: 0, transactions: 0 };
    current.tickets += Number(sale.ticket_quantity || 0);
    current.transactions += 1;
    buckets.set(key, current);
    const day = dayTotals.get(dateKey) || { tickets: 0, transactions: 0 };
    day.tickets += Number(sale.ticket_quantity || 0);
    day.transactions += 1;
    dayTotals.set(dateKey, day);
    observedMinutes.push(bucketStart);
  });

  const dates = [...dayTotals.keys()].sort();
  const firstMinute = Math.min(8 * 60, ...observedMinutes);
  const finalMinute = Math.max(18 * 60, ...observedMinutes.map((v) => v + bucketSize));
  const timeRows = [];
  for (let minute = firstMinute; minute < finalMinute; minute += bucketSize)
    timeRows.push(minute);
  const maxTickets = Math.max(
    1,
    ...[...buckets.values()].map((bucket) => bucket.tickets),
  );
  const grid = document.createElement("div");
  grid.className = "time-heatmap";
  grid.style.setProperty("--day-count", dates.length);
  grid.style.minWidth = `${150 + dates.length * 168}px`;
  const corner = document.createElement("div");
  corner.className = "heatmap-corner";
  grid.appendChild(corner);
  dates.forEach((dateKey) => {
    const day = document.createElement("div");
    day.className = "heatmap-day";
    day.textContent = heatmapDateFormatter.format(
      new Date(`${dateKey}T00:00:00+07:00`),
    );
    grid.appendChild(day);
  });
  timeRows.forEach((minute) => {
    const time = document.createElement("div");
    time.className = "heatmap-time";
    time.textContent = minuteLabel(minute, bucketSize);
    grid.appendChild(time);
    dates.forEach((dateKey) => {
      const value = buckets.get(`${dateKey}|${minute}`) || {
        tickets: 0,
        transactions: 0,
      };
      const level = value.tickets
        ? Math.max(1, Math.ceil((value.tickets / maxTickets) * 4))
        : 0;
      const cell = document.createElement("div");
      cell.className = `heatmap-cell level-${level}`;
      cell.setAttribute(
        "aria-label",
        `${dateKey}, ${minuteLabel(minute, bucketSize)}: ${value.tickets} tickets from ${value.transactions} transactions`,
      );
      cell.title = `${value.tickets} tickets · ${value.transactions} transactions`;
      const tickets = document.createElement("strong");
      tickets.textContent = number(value.tickets);
      const frequency = document.createElement("small");
      frequency.textContent = `${number(value.transactions)} sale${value.transactions === 1 ? "" : "s"}`;
      cell.append(tickets, frequency);
      grid.appendChild(cell);
    });
  });
  root.appendChild(grid);

  const peak = [...buckets.entries()].sort(
    (a, b) =>
      b[1].tickets - a[1].tickets ||
      b[1].transactions - a[1].transactions,
  )[0];
  const [peakDate, peakMinute] = peak[0].split("|");
  $("peak-period").textContent = `${heatmapDateFormatter.format(new Date(`${peakDate}T00:00:00+07:00`))}, ${minuteLabel(Number(peakMinute), bucketSize)} · ${number(peak[1].tickets)} tickets`;
  const busiest = [...dayTotals.entries()].sort(
    (a, b) => b[1].tickets - a[1].tickets,
  )[0];
  $("busiest-day").textContent = `${heatmapDateFormatter.format(new Date(`${busiest[0]}T00:00:00+07:00`))} · ${number(busiest[1].tickets)} tickets`;
  const activeBuckets = [...buckets.values()].filter(
    (bucket) => bucket.transactions > 0,
  );
  const averageTransactions =
    activeBuckets.reduce((sum, bucket) => sum + bucket.transactions, 0) /
    activeBuckets.length;
  $("average-frequency").textContent = `${averageTransactions.toFixed(1)} transactions / active period`;
}

function renderDashboard() {
  const sales = state.filteredSales;
  const saleIds = new Set(sales.map((sale) => sale.id));
  const attendees = state.attendees.filter((person) =>
    saleIds.has(person.sale_id),
  );
  const tickets = state.tickets.filter((ticket) => saleIds.has(ticket.sale_id));
  const revenue = sales.reduce(
    (sum, sale) => sum + Number(sale.amount_paid),
    0,
  );
  const ticketCount = tickets.reduce(
    (sum, ticket) => sum + Number(ticket.quantity),
    0,
  );
  const returning = attendees.filter(
    (person) => person.previous_attendance === "returning",
  ).length;
  $("kpi-revenue").textContent = money(revenue);
  $("kpi-tickets").textContent = number(ticketCount);
  $("kpi-visitors").textContent = number(attendees.length);
  $("kpi-transactions").textContent = number(sales.length);
  $("kpi-average").textContent = money(
    sales.length ? revenue / sales.length : 0,
  );
  $("kpi-returning").textContent =
    `${attendees.length ? Math.round((returning / attendees.length) * 100) : 0}%`;

  renderEventDayMenu();

  renderBars(
    "chart-daily",
    countBy(
      sales,
      (sale) =>
        new Date(sale.submitted_at).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        }),
      (sale) => sale.amount_paid,
    ),
    money,
    10,
  );
  renderBars(
    "chart-country",
    countBy(
      attendees,
      (person) => person.country_name || person.country_code || "Unknown",
    ),
    number,
    Number.POSITIVE_INFINITY,
  );
  renderBars(
    "chart-age",
    countBy(attendees, (person) => person.age_group),
  );
  const sourceNames = {
    "online-social": "Online Social",
    "pattaya-promotion": "Pattaya Advertising",
    "friend-family": "Friend or Family",
    "previous-event": "Previous WGP#1 Event",
    "newspaper-television": "Newspaper or Television",
  };
  renderBars(
    "chart-source",
    countBy(attendees, (person) =>
      (person.marketing_sources || []).map(
        (source) => sourceNames[source] || source,
      ),
    ),
  );
  renderBars(
    "chart-ticket",
    countBy(
      tickets,
      (ticket) => ticket.ticket_name,
      (ticket) => ticket.quantity,
    ),
  );
  renderTimeHeatmap(sales);
  renderTable(sales);
  $("result-count").textContent = `${number(sales.length)} records`;
}

function renderTable(sales) {
  const body = $("sales-table");
  body.textContent = "";
  const visibleSales = state.tableExpanded ? sales : sales.slice(0, 10);
  visibleSales.forEach((sale) => {
    const row = document.createElement("tr");
    const values = [
      new Date(sale.submitted_at).toLocaleString("en-GB"),
      sale.transaction_id,
      sale.staff_name,
      sale.payment_method,
      number(sale.attendee_count),
      number(sale.ticket_quantity),
      money(sale.amount_paid),
    ];
    values.forEach((value, index) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      if (index === values.length - 1) cell.className = "amount";
      row.appendChild(cell);
    });
    body.appendChild(row);
  });
  if (!sales.length)
    body.innerHTML =
      '<tr><td colspan="7" class="muted">No transactions found</td></tr>';
  const toggle = $("toggle-sales-table");
  toggle.classList.toggle("hidden", sales.length <= 10);
  toggle.textContent = state.tableExpanded
    ? "Show latest 10"
    : `Show all ${number(sales.length)}`;
}

function exportCsv() {
  const columns = [
    "submitted_at",
    "transaction_id",
    "staff_name",
    "payment_method",
    "attendee_count",
    "ticket_quantity",
    "calculated_total",
    "amount_paid",
    "note",
  ];
  const csv = [
    columns.join(","),
    ...state.filteredSales.map((row) =>
      columns.map((column) => escapeCsv(row[column])).join(","),
    ),
  ].join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(
    new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }),
  );
  link.download = `wgp1-ticket-sales-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

$("login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  $("login-error").classList.add("hidden");
  const button = event.currentTarget.querySelector("button");
  button.disabled = true;
  try {
    const email = resolveLoginEmail($("login-username").value);
    if (!email) throw new Error("Invalid username or password.");
    await login(email, $("login-password").value);
    $("login-password").value = "";
    await loadData();
  } catch (error) {
    $("login-error").textContent = "Invalid username or password.";
    $("login-error").classList.remove("hidden");
  } finally {
    button.disabled = false;
  }
});
$("password-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  $("password-error").classList.add("hidden");
  const password = $("new-password").value;
  const confirmation = $("confirm-password").value;
  if (password !== confirmation) {
    $("password-error").textContent = "Passwords do not match.";
    $("password-error").classList.remove("hidden");
    return;
  }
  const button = event.currentTarget.querySelector("button");
  button.disabled = true;
  try {
    await updatePassword(password);
    $("new-password").value = "";
    $("confirm-password").value = "";
    await loadData();
  } catch (error) {
    $("password-error").textContent = error.message || "Unable to set password";
    $("password-error").classList.remove("hidden");
  } finally {
    button.disabled = false;
  }
});
$("sign-out").addEventListener("click", () => {
  clearSession();
  $("sign-out").classList.add("hidden");
  show("login-panel");
});
$("refresh-data").addEventListener("click", loadData);
$("export-csv").addEventListener("click", exportCsv);
$("time-bucket").addEventListener("change", () =>
  renderTimeHeatmap(state.filteredSales),
);
$("toggle-sales-table").addEventListener("click", () => {
  state.tableExpanded = !state.tableExpanded;
  renderTable(state.filteredSales);
});
["filter-from", "filter-to", "filter-staff", "filter-payment"].forEach((id) =>
  $(id).addEventListener("change", applyFilters),
);

if (!configured()) show("setup-panel");
else if (readInviteSession()) {
} else if (getSession()?.password_setup_required) show("password-panel");
else if (getSession()?.access_token) loadData();
else show("login-panel");
