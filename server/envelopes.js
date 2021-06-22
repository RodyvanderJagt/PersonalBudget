const express = require('express');
const app = require('../server.js');
const envelopesRouter = express.Router();

const {
    getAllFromDatabase,
    addToDatabase,
    getTotalBudget,
    getFromDatabaseById,
    deleteFromDatabaseById,
    addMoneyToEnvelopeById} = require('./db.js')

envelopesRouter.get('', (req, res) => {
    res.send(getAllFromDatabase());
});

envelopesRouter.post('', (req, res) => {
    const addEnvelope = addToDatabase(req.body);
    res.status(201).send(addEnvelope);
})

envelopesRouter.get('/total-budget', (req, res) => {
    res.send(getTotalBudget());
})


envelopesRouter.param('id', (req, res, next, id) => {
    const envelope = getFromDatabaseById(id);
    if (envelope) {
        req.envelope = envelope;
        next();
    } else {
        res.status(404).send();
    }
})

envelopesRouter.get('/:id', (req, res) => {
    res.send(req.envelope);
});

envelopesRouter.post('/:id', (req, res) => {
    addMoneyToEnvelopeById(req.params.id, -req.body.amount)
    res.send(req.envelope);
})

envelopesRouter.delete('/:id', (req, res) => {
    const isDeleted = deleteFromDatabaseById(req.params.id);
    isDeleted ? res.status(204) : res.status(500);
    res.send();
})

envelopesRouter.post('/transfer/:from/:to', (req, res) => {
    const fromEnvelope = getFromDatabaseById(req.params.from);
    const toEnvelope = getFromDatabaseById(req.params.to);
    if (fromEnvelope && toEnvelope) {
        addMoneyToEnvelopeById(fromEnvelope.id, -req.body.amount);
        addMoneyToEnvelopeById(toEnvelope.id, req.body.amount);
        res.send();
    } else {
        res.status(404).send();
    }
})



module.exports = envelopesRouter;