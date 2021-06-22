const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('', (req, res) => {
    res.send("Hello, World");
})

const envelopesRouter = require('./server/envelopes.js');
app.use('/envelopes', envelopesRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

module.exports = app;