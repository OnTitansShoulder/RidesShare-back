const config = require('../config.js');
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
      console.error('Could not connect to MongoDB!\n' + err);
    });
}

if (mongoose.connection.readyState == 0) {
  connect();
}

module.exports = {
    User: require('../users/user.model'),
    Ride: require('../requests/ride.model'),
    RideReq: require('../requests/ridereq.model'),
    ReqHistory: require('../requests/history.model')
};
