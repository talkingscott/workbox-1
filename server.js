/**
 * @file server.js
 *
 * @brief The server for our app.
 *
 * This is a simple Express app that serves static content from the webpack
 * build output directory and implements a single API call.
 */
const fs = require('fs/promises');
const http = require('http');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const app = express();
const apiv1 = express.Router();

const port = process.env.PORT || 3000;

const storeRequest = async (request) => {
    let fd;
    try {
        fd = await fs.open('requests.ndjson', 'a')
        await fd.write(`${JSON.stringify(request)}\n`, 'utf-8');
    } catch (err) {
        console.log('Error in storeRequest', err);
    } finally {
        await fd?.close();
    }
};

apiv1.post('/qrcode', (req, res, next) => {
    const received = Date.now();
    const ip = req.ip;
    const payload = req.body;
    const data = { ...payload, ...{ ip, received } }
    console.log(data);
    storeRequest(data);
    res.sendStatus(200);
    res.end();
});

app.enable('trust proxy');

app.use(morgan('dev'));
app.use(express.json());
app.use('/api/v1', apiv1);
app.use(express.static(path.resolve(__dirname, 'dist')));

const httpServer = http.createServer(app);

console.log('Listen on port', port);
httpServer.listen(port);
