const express = require('express');
const app = require('../server.js');
const apiRouter = express.Router();

const apiRouter = require('./server/api');
app.use('/api', apiRouter);

module.exports = apiRouter;