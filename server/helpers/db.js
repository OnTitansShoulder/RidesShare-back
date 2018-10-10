const config = require('../config.json');
const mongoose = require('mongoose');
const b_Promise = require('bluebird');

function connect(callback) {
  mongoose.Promise = b_Promise;
  mongoose
    .connect(config.db.uri)
    .then(function (connection) {
      if (callback) callback(connection.db);
    })
    .catch(function (err) {
      console.error('Could not connect to MongoDB!');
    });
}

if (mongoose.connection.readyState == 0) {
  connect();
}

module.exports = {
    User: require('../users/user.model'),
    Ride: require('../requests/ride.model')
};
