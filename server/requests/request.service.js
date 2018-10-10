const config = require('../config.json');
const db = require('../helpers/db');
const Ride = db.Ride;

module.exports = {
  createRide,
  updateRide,
  findRides,
  searchRides
};

async function createRide(rideInfo) {
  var ride = new Ride(rideInfo);
  return ride.save();
}

async function updateRide(rideInfo) {
  var ride = await Ride.findOne({ _id: rideInfo.id });
  Object.assign(ride, rideInfo);
  return ride.save();
};

async function findRides(username) {
  // todo ensure username match the user's token
  return Ride.find({ username: username });
}

async function searchRides(criteria) {
  return Ride.find({
    $and: [
      {
        "leavingDate": {$gt: criteria.leavingDate}
      }
    ]
  })
}
