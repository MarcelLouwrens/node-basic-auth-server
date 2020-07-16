const express = require('express');
const http = require('http');
const bodyParser = require('body-parser'); // parse all requests as json
const morgan = require('morgan'); // middleware - logging
const cors = require('cors')

const mongoose = require('mongoose');

const app = express();
const router = require('./router');

// DB Setup
mongoose.connect('mongodb://localhost:auth/auth', { useUnifiedTopology: true, useNewUrlParser: true });

// App Setup

app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*'}));
router(app);

// Server Setup

const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log("Server listening on port:", port);