require('dotenv').config()

const express = require('express');
const app = express();

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)

const envelopesRouter = require('./server/envelopes.js');
app.use('/envelopes', envelopesRouter);

const transactionsRouter = require('./server/transactions.js');
app.use('/transactions', transactionsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

module.exports = app;