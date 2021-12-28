/**
 * @file server.js
 *
 * @brief The server for our app.
 *
 * This is a simple Express app that serves static content from the webpack
 * build output directory and implements a single API call.
 */
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const app = express();
const apiv1 = express.Router();

const port = process.env.PORT || 3000;

apiv1.post('/barcode', (req, res, next) => {
    console.log(req.body);
    res.sendStatus(200);
    res.end();
});

app.use(morgan('combined'));
app.use(express.json());
app.use('/api/v1', apiv1);
app.use(express.static(path.resolve(__dirname, 'dist')));

const server = app.listen(port, () => {
    console.log("Listening on port", server.address().port);
});
