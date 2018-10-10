require('rootpath')();
const express = require('express');
const cors = require('cors'); // allows cross origin resources sharing
const bodyParser = require('body-parser'); // auto parse request body

const jwt = require('../helpers/jwt'); // javascrip web token functions
const errorHandler = require('../helpers/error-handler');
const dbs = require('../helpers/db');
const config = require('../config.json');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/api/users', require('../users/users.controller'));
app.use('/api/requests', require('../requests/request.controller'));

// global error handler
// app.use(errorHandler);

// start server
module.exports.start = function start() {
  const port = process.env.NODE_ENV === 'production' ? 80 : (config.port || 3334);
  const server = app.listen(port, function () {
    console.log('Connected to database: ' + config.db.uri);
    console.log('Server listening on port ' + port);
  });
};
