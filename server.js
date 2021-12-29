/**
 * @file server.js
 *
 * @brief The server for our app.
 *
 * This is a simple Express app that serves static content from the webpack
 * build output directory and implements a single API call.
 */
const fs = require('fs');
const http = require('http');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const app = express();
const apiv1 = express.Router();

const port = process.env.PORT || 3000;

// const credentials = {
//     key: fs.readFileSync('key.pem', 'utf8'),
//     cert: fs.readFileSync('cert.pem', 'utf8'),
// };

apiv1.post('/barcode', (req, res, next) => {
    console.log(req.body);
    res.sendStatus(200);
    res.end();
});

app.use(morgan('combined'));
app.use(express.json());
app.use('/api/v1', apiv1);
app.use(express.static(path.resolve(__dirname, 'dist')));

const httpServer = http.createServer(app);

console.log('Listen on port', port);
httpServer.listen(port);
