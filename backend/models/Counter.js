// Remembers the last sequence number used for each category
const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: String,
  seq: { type: Number, default: 0 },
});

counterSchema.statics.nextBookCode = async function (category) {
  const prefix = category.slice(0, 3).toUpperCase();
  // $inc is atomic, so two requests never get the same number
  const counter = await this.findOneAndUpdate(
    { _id: prefix },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `LB-${prefix}-${String(counter.seq).padStart(3, '0')}`;
};

module.exports = mongoose.model('Counter', counterSchema);
