const express = require('express');
const tomes = require('../controllers/tomeController');
const { issueTome, loanHistory } = require('../controllers/lendingController');

const router = express.Router();

router.get('/', tomes.listTomes);
router.post('/', tomes.addTome);
router.get('/:id', tomes.getTome);
router.put('/:id', tomes.editTome);
router.delete('/:id', tomes.removeTome);
router.post('/:id/issue', issueTome);
router.get('/:id/loans', loanHistory);

module.exports = router;
