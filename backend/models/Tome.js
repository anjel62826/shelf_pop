// Tome = one book title in the library
const mongoose = require('mongoose');
const { CATEGORIES } = require('./categories');

const tomeSchema = new mongoose.Schema(
  {
    bookCode: { type: String, required: true, unique: true, immutable: true },
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    isbn: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      match: [/^(\d{10}|\d{13})$/, 'ISBN must be exactly 10 or 13 digits'],
    },
    category: { type: String, required: true, enum: CATEGORIES, immutable: true },
    totalCopies: {
      type: Number,
      required: true,
      min: [1, 'Total Copies must be at least 1'],
      max: [20, 'Total Copies cannot exceed 20'],
    },
    availableCopies: { type: Number, required: true, min: 0, max: 20 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tome', tomeSchema);
