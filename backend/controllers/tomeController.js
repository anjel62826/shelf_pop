const mongoose = require('mongoose');
const Tome = require('../models/Tome');
const Lending = require('../models/Lending');
const Counter = require('../models/Counter');
const { reply } = require('../utils/reply');
const { clean, checkDetails, checkNewBook } = require('../utils/checks');

const PAGE_SIZE = 5;
const SORTS = {
  newest: { createdAt: -1, _id: -1 },
  title: { title: 1, _id: 1 },
  author: { author: 1, _id: 1 },
  available: { availableCopies: -1, _id: 1 },
};

// Used by every route that has :id in it
async function findTome(id) {
  return mongoose.isValidObjectId(id) ? Tome.findById(id) : null;
}

// GET /api/books?search=&category=&available=true&sort=&page=
async function listTomes(req, res) {
  const { search, category, available, sort } = req.query;
  const filter = {};

  if (category) filter.category = String(category);
  if (available === 'true') filter.availableCopies = { $gt: 0 };
  if (clean(search)) {
    // Escape special characters so the text is searched as typed
    const safe = clean(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(safe, 'i');
    filter.$or = [{ title: pattern }, { author: pattern }];
  }

  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const totalBooks = await Tome.countDocuments(filter);
  const books = await Tome.find(filter)
    .sort(SORTS[sort] || SORTS.newest)
    .skip((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE);

  return reply(res, 200, 'Books fetched', {
    books,
    page,
    totalPages: Math.max(Math.ceil(totalBooks / PAGE_SIZE), 1),
    totalBooks,
  });
}

// GET /api/books/:id
async function getTome(req, res) {
  const book = await findTome(req.params.id);
  if (!book) return reply(res, 404, 'Book not found');
  return reply(res, 200, 'Book fetched', book);
}

// POST /api/books
async function addTome(req, res) {
  const body = req.body || {};
  const error = checkNewBook(body);
  if (error) return reply(res, 400, error);

  const isbn = clean(body.isbn);
  if (await Tome.exists({ isbn })) return reply(res, 409, 'A book with this ISBN already exists');

  // Only these fields are taken from the client. bookCode and availableCopies are set here
  const book = await Tome.create({
    title: body.title,
    author: body.author,
    isbn,
    category: body.category,
    totalCopies: Number(body.totalCopies),
    availableCopies: Number(body.totalCopies),
    bookCode: await Counter.nextBookCode(body.category),
  });
  return reply(res, 201, `Book added with code ${book.bookCode}`, book);
}

// PUT /api/books/:id
async function editTome(req, res) {
  const book = await findTome(req.params.id);
  if (!book) return reply(res, 404, 'Book not found');

  const body = req.body || {};
  const locked = ['bookCode', 'isbn', 'category'].find(
    (field) => body[field] !== undefined && body[field] !== book[field]
  );
  if (locked) return reply(res, 400, `${locked} cannot be edited`);

  const error = checkDetails(body);
  if (error) return reply(res, 400, error);

  const total = Number(body.totalCopies);
  const issued = await Lending.countDocuments({ book: book._id, status: 'Issued' });
  if (total < issued) {
    return reply(res, 400, `Total Copies cannot be less than the ${issued} currently issued`);
  }

  book.title = body.title;
  book.author = body.author;
  book.totalCopies = total;
  book.availableCopies = total - issued;
  await book.save();
  return reply(res, 200, 'Book updated', book);
}

// DELETE /api/books/:id
async function removeTome(req, res) {
  const book = await findTome(req.params.id);
  if (!book) return reply(res, 404, 'Book not found');

  const issued = await Lending.countDocuments({ book: book._id, status: 'Issued' });
  if (issued > 0) return reply(res, 409, 'Cannot delete: this book has unreturned copies');

  // Returned loans are kept, so the total fine collected stays correct
  await book.deleteOne();
  return reply(res, 200, 'Book deleted', book);
}

module.exports = { findTome, listTomes, getTome, addTome, editTome, removeTome };
