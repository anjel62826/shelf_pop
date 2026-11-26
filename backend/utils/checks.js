const { CATEGORIES } = require('../models/categories');
const { today, parseDay } = require('./dates');

// Returns the trimmed string, or '' when the value is not a string
const clean = (value) => (typeof value === 'string' ? value.trim() : '');

function isValidCopies(value) {
  const isNumberLike = typeof value === 'number' || (typeof value === 'string' && value.trim() !== '');
  const n = Number(value);
  return isNumberLike && Number.isInteger(n) && n >= 1 && n <= 20;
}

// Each function returns an error message, or null when the input is fine
function checkDetails(body) {
  if (!clean(body.title)) return 'Title is required';
  if (!clean(body.author)) return 'Author is required';
  if (!isValidCopies(body.totalCopies)) return 'Total Copies must be a whole number from 1 to 20';
  return null;
}

function checkNewBook(body) {
  const error = checkDetails(body);
  if (error) return error;
  if (!/^(\d{10}|\d{13})$/.test(clean(body.isbn))) return 'ISBN must be exactly 10 or 13 digits';
  if (!CATEGORIES.includes(body.category)) return `Category must be one of: ${CATEGORIES.join(', ')}`;
  return null;
}

function checkIssue(body) {
  if (!clean(body.memberName)) return 'Member Name is required';
  if (!clean(body.memberId)) return 'Member ID is required';
  if (body.issueDate !== undefined && body.issueDate !== '') {
    const date = parseDay(body.issueDate);
    if (!date) return 'Issue Date must be a valid date (YYYY-MM-DD)';
    if (date > today()) return 'Issue Date cannot be in the future';
  }
  return null;
}

module.exports = { clean, checkDetails, checkNewBook, checkIssue };
