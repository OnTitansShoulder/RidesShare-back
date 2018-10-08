const config = require('../config.json');
const mongoose = require('mongoose');

function connect(callback) {
  mongoose.Promise = global.Promise;
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
