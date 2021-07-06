const express = require('express');
const app = require('../server.js');
const envelopesRouter = express.Router();

const db = require('./queries.js');

envelopesRouter.get('', db.getAllFromDatabase);

envelopesRouter.post('', db.addToDatabase);

envelopesRouter.get('/total', db.getTotalBudget);

envelopesRouter.get('/:id', db.getFromDatabaseById);

envelopesRouter.post('/:id', db.substractMoneyFromEnvelopeById);

envelopesRouter.delete('/:id', db.deleteFromDatabaseById)

envelopesRouter.post('/transfer/:from/:to', db.transferMoneyById);

module.exports = envelopesRouter;