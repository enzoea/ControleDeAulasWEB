export const PM_SELECTED_KEY = 'pm_selected_days';

export function setSelectedDays(diasISO: string[]) {
  try { localStorage.setItem(PM_SELECTED_KEY, JSON.stringify(diasISO)); } catch {}
}

export function getSelectedDays(): string[] {
  try {
    const raw = localStorage.getItem(PM_SELECTED_KEY);
    if (!raw) return [];
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [];
  } catch { return []; }
}

export function clearSelectedDays() {
  try { localStorage.removeItem(PM_SELECTED_KEY); } catch {}
}