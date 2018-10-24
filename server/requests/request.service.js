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
  var centerFrom = criteria.fromLocation;
  var centerTo = criteria.toLocation;
  var latFromA = centerFrom.lat - criteria.radius;
  var latFromB = centerFrom.lat + criteria.radius;
  var lngFromA = centerFrom.lng - criteria.radius;
  var lngFromB = centerFrom.lng + criteria.radius;
  var latToA = centerTo.lat - criteria.radius;
  var latToB = centerTo.lat + criteria.radius;
  var lngToA = centerTo.lng - criteria.radius;
  var lngToB = centerTo.lng + criteria.radius;
  var leaveDateFrom = new Date(criteria.leavingDate);
  var leaveDateTo = new Date(criteria.leavingDate);
  leaveDateFrom.setDate(leaveDateFrom.getDate() - criteria.altDays);
  leaveDateTo.setDate(leaveDateTo.getDate() + criteria.altDays);
  console.log(leaveDateFrom);
  console.log(leaveDateTo);
  return Ride.find({
    $and: [
      { "leavingDate": {$gt: leaveDateFrom} },
      { "leavingDate": {$lt: leaveDateTo} },
      {"fromLocation.lat": {$gt: latFromA}},
      {"fromLocation.lat": {$lt: latFromB}},
      {"fromLocation.lng": {$gt: lngFromA}},
      {"fromLocation.lng": {$lt: lngFromB}},
      {"toLocation.lat": {$gt: latToA}},
      {"toLocation.lat": {$lt: latToB}},
      {"toLocation.lng": {$gt: lngToA}},
      {"toLocation.lng": {$lt: lngToB}},
    ]
  });
}
