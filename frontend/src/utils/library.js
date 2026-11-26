export const CATEGORIES = ['Fiction', 'Science', 'History', 'Technology', 'Biography', 'Other'];

// Spine and chip colour for each category (ink text is readable on all of them)
export const SPINE = {
  Fiction: '#FF8FAB',
  Science: '#06D6A0',
  History: '#FFD166',
  Technology: '#8ECDF5',
  Biography: '#C8B6FF',
  Other: '#E9DCC3',
};

// Today as YYYY-MM-DD in local time
export function todayKey() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function addDaysKey(key, days) {
  const d = new Date(`${key}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// "2026-11-26T00:00:00.000Z" becomes "26 Nov 2026"
export function showDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
  });
}
