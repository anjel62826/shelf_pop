const mongoose = require('mongoose');
const Tome = require('../models/Tome');
const Lending = require('../models/Lending');
const { findTome } = require('./tomeController');
const { reply } = require('../utils/reply');
const { clean, checkIssue } = require('../utils/checks');
const { LOAN_DAYS, today, parseDay, addDays, calcFine } = require('../utils/dates');

// POST /api/books/:id/issue
async function issueTome(req, res) {
  const book = await findTome(req.params.id);
  if (!book) return reply(res, 404, 'Book not found');

  const body = req.body || {};
  const error = checkIssue(body);
  if (error) return reply(res, 400, error);

  const memberId = clean(body.memberId).toUpperCase();
  if (await Lending.exists({ book: book._id, memberId, status: 'Issued' })) {
    return reply(res, 409, 'This member already holds an unreturned copy of this book');
  }

  // Take one copy only if one is available. This is a single atomic step
  const updated = await Tome.findOneAndUpdate(
    { _id: book._id, availableCopies: { $gt: 0 } },
    { $inc: { availableCopies: -1 } },
    { new: true }
  );
  if (!updated) return reply(res, 409, 'No copies are available');

  const issueDate = body.issueDate ? parseDay(body.issueDate) : today();
  try {
    const loan = await Lending.create({
      book: book._id,
      memberName: body.memberName,
      memberId,
      issueDate,
      dueDate: addDays(issueDate, LOAN_DAYS),
    });
    return reply(res, 201, 'Book issued', loan);
  } catch (err) {
    // Give the copy back if the loan could not be saved
    await Tome.updateOne({ _id: book._id }, { $inc: { availableCopies: 1 } });
    throw err;
  }
}

// PATCH /api/loans/:id/return
async function returnLoan(req, res) {
  const { id } = req.params;
  const loan = mongoose.isValidObjectId(id) ? await Lending.findById(id) : null;
  if (!loan) return reply(res, 404, 'Loan not found');

  const returnDate = today();
  // The status condition stops the same loan being returned twice
  const returned = await Lending.findOneAndUpdate(
    { _id: loan._id, status: 'Issued' },
    { status: 'Returned', returnDate, fine: calcFine(loan.dueDate, returnDate) },
    { new: true }
  );
  if (!returned) return reply(res, 409, 'This loan is already returned');

  // Add the copy back, but never go above Total Copies
  await Tome.updateOne(
    { _id: loan.book, $expr: { $lt: ['$availableCopies', '$totalCopies'] } },
    { $inc: { availableCopies: 1 } }
  );
  return reply(res, 200, `Book returned. Fine: Rs ${returned.fine}`, returned);
}

// GET /api/books/:id/loans
async function loanHistory(req, res) {
  const book = await findTome(req.params.id);
  if (!book) return reply(res, 404, 'Book not found');

  const loans = await Lending.find({ book: book._id }).sort({ createdAt: -1 });
  const now = today();
  const data = loans.map((loan) => ({
    ...loan.toObject(),
    isOverdue: loan.status === 'Issued' && loan.dueDate < now,
  }));
  return reply(res, 200, 'Loan history fetched', data);
}

module.exports = { issueTome, returnLoan, loanHistory };
