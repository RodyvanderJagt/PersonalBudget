const express = require('express');
const app = require('../server.js');
const envelopesRouter = express.Router();

const {
    getAllFromDatabase,
    addToDatabase} = require('./db.js')



envelopesRouter.get('', (req, res) => {
    res.send(getAllFromDatabase());
})

envelopesRouter.post('', (req, res) => {
    const addEnvelope = addToDatabase(req.body);
    res.status(201).send(addEnvelope);
})




module.exports = envelopesRouter;