const express = require('express');
const app = require('../server.js');
const envelopesRouter = express.Router();

const {
    getAllFromDatabase,
    addToDatabase,
    getFromDatabaseById} = require('./db.js')



envelopesRouter.get('', (req, res) => {
    res.send(getAllFromDatabase());
});

envelopesRouter.post('', (req, res) => {
    const addEnvelope = addToDatabase(req.body);
    res.status(201).send(addEnvelope);
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





module.exports = envelopesRouter;