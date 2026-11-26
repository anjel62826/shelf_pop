const express = require('express');
const { returnLoan } = require('../controllers/lendingController');

const router = express.Router();

router.patch('/:id/return', returnLoan);

module.exports = router;
