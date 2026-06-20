// ─────────────────────────────────────────
// src/modules/stats.js
// ─────────────────────────────────────────

const pad = (n) => String(n ?? 0).padStart(2, '0');
const el  = (id) => document.getElementById(id);

/**
 * آپدیت آمار پایین صفحه
 * @param {{ total: number, completed: number, pending: number }} stats
 */
export function renderStats(stats) {
  if (el('stat-completed')) el('stat-completed').textContent = pad(stats.completed);
  if (el('stat-pending'))   el('stat-pending').textContent   = pad(stats.pending);
  if (el('stat-total'))     el('stat-total').textContent     = Number(stats.total).toLocaleString();
}