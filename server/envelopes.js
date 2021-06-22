const express = require('express');
const app = require('../server.js');
const envelopesRouter = express.Router();

const {
    getAllFromDatabase,
    addToDatabase} = require('./db.js')


//Simple endpoint
envelopesRouter.get('', (req, res) => {
    res.send("hello, envelopes!");
})

envelopesRouter.post('', (req, res) => {
    const addEnvelope = addToDatabase(req.body);
    res.status(201).send(addEnvelope);
})




module.exports = envelopesRouter;