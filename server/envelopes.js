const express = require('express');
const app = require('../server.js');
const envelopesRouter = express.Router();

const {
    getAllFromDatabase,
    addToDatabase,
    getTotalBudget,
    getFromDatabaseById,
    deleteFromDatabaseById} = require('./db.js')

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
    instance = req.body;
    if(!isNaN(parseFloat(instance.cost)) && isFinite(instance.cost)){
        if (instance.cost > req.envelope.budget) {
            throw new Error("Cost exceeds current budget");
        } else {
            req.envelope.budget -= instance.cost;
        }
    } else {
        throw new Error('Cost must be a number');
    }
    res.send(req.envelope);
})

envelopesRouter.delete('/:id', (req, res) => {
    const isDeleted = deleteFromDatabaseById(req.params.id);
    isDeleted ? res.status(204) : res.status(500);
    res.send();
})




module.exports = envelopesRouter;