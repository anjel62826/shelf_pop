const Tome = require('../models/Tome');
const Lending = require('../models/Lending');
const { reply } = require('../utils/reply');
const { today } = require('../utils/dates');

// GET /api/stats
async function getStats(req, res) {
  const [totalTitles, copies, issuedCopies, overdueLoans, fines] = await Promise.all([
    Tome.countDocuments(),
    Tome.aggregate([{ $group: { _id: null, sum: { $sum: '$totalCopies' } } }]),
    Lending.countDocuments({ status: 'Issued' }),
    Lending.countDocuments({ status: 'Issued', dueDate: { $lt: today() } }),
    Lending.aggregate([
      { $match: { status: 'Returned' } },
      { $group: { _id: null, sum: { $sum: '$fine' } } },
    ]),
  ]);

  return reply(res, 200, 'Stats fetched', {
    totalTitles,
    totalCopies: copies[0]?.sum || 0,
    issuedCopies,
    overdueLoans,
    totalFine: fines[0]?.sum || 0,
  });
}

module.exports = { getStats };
