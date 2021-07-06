const express = require('express');
const app = require('../server.js');
const envelopesRouter = express.Router();

const db = require('./queries.js');

envelopesRouter.get('', db.getAllEnvelopesFromDatabase);

envelopesRouter.post('', db.addEnvelopeToDatabase);

envelopesRouter.get('/total', db.getTotalBudget);

envelopesRouter.get('/:id', db.getEnvelopeFromDatabaseById);

envelopesRouter.post('/:id', db.substractMoneyFromEnvelopeById);

envelopesRouter.delete('/:id', db.deleteEnvelopeFromDatabaseById)

module.exports = envelopesRouter;