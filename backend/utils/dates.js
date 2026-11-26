// Dates are stored as midnight UTC of a calendar day, so day maths stays exact
const DAY = 24 * 60 * 60 * 1000;
const LOAN_DAYS = 14;
const FINE_PER_DAY = 5;

// Today's calendar date on this computer
function today() {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

// Turns "YYYY-MM-DD" into a Date. Returns null for bad dates such as 2026-02-30
function parseDay(text) {
  if (typeof text !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(text)) return null;
  const date = new Date(`${text}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== text) return null;
  return date;
}

function addDays(date, days) {
  return new Date(date.getTime() + days * DAY);
}

// Rs 5 for every day after the due date, 0 if on time
function calcFine(dueDate, returnDate) {
  const lateDays = Math.round((returnDate - dueDate) / DAY);
  return lateDays > 0 ? lateDays * FINE_PER_DAY : 0;
}

module.exports = { LOAN_DAYS, today, parseDay, addDays, calcFine };
