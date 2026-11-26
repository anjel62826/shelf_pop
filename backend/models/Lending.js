// Lending = one loan of one copy to one member
const mongoose = require('mongoose');

const lendingSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Tome', required: true },
    memberName: { type: String, required: true, trim: true },
    memberId: { type: String, required: true, trim: true, uppercase: true },
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date, default: null },
    fine: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['Issued', 'Returned'], default: 'Issued' },
  },
  { timestamps: true }
);

// A member can hold only one unreturned copy of the same book
lendingSchema.index(
  { book: 1, memberId: 1 },
  { unique: true, partialFilterExpression: { status: 'Issued' } }
);

module.exports = mongoose.model('Lending', lendingSchema);
