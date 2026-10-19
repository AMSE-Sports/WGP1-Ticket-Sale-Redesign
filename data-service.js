"use strict";

(function createWgpDataService() {
  const config = window.WGP1_SUPABASE_CONFIG || {};
  const queueKey = "wgp1-jwc26-pending-transactions";

  function isConfigured() {
    return Boolean(config.enabled && config.url && config.anonKey);
  }

  function queueLocally(transaction) {
    const queue = JSON.parse(localStorage.getItem(queueKey) || "[]");
    queue.push({ queuedAt: new Date().toISOString(), transaction });
    localStorage.setItem(queueKey, JSON.stringify(queue.slice(-200)));
  }

  async function saveTransaction(transaction) {
    if (!isConfigured()) {
      queueLocally(transaction);
      return { saved: false, queued: true, reason: "database-not-configured" };
    }

    const response = await fetch(`${config.url}/rest/v1/rpc/create_ticket_transaction`, {
      method: "POST",
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ payload: transaction })
    });

    if (!response.ok) {
      const message = await response.text();
      queueLocally(transaction);
      throw new Error(message || `Database request failed (${response.status})`);
    }

    return { saved: true, queued: false, saleId: await response.json() };
  }

  window.WGP1_DATA_SERVICE = Object.freeze({ isConfigured, saveTransaction });
})();
