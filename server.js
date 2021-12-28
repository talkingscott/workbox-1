const express = require('express');
const morgan = require('morgan');
const app = express();

const port = process.env.PORT || 3000;

app.use(morgan('combined'));
app.use(express.static(__dirname));

const server = app.listen(port, () => {
    console.log("Listening on port", server.address().port);
});
