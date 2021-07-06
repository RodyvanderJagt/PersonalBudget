const express = require('express');
const transactionsRouter = express.Router();

const db = require('./queries.js');

transactionsRouter.get('', db.getAllTransactionsFromDatabase);

transactionsRouter.get('/:id', db.getTransactionFromDatabaseById);

transactionsRouter.post('', db.createTransaction);

module.exports = transactionsRouter;