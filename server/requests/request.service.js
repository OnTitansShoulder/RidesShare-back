var async = require('async');
const db = require('../helpers/db');
const userService = require('../users/user.service');
const Ride = db.Ride;
const RideReq = db.RideReq;
const ReqHistory = db.ReqHistory;

module.exports = {
  createRide,
  createRideReq,
  updateRide,
  updateRideReq,
  updateReqHistory,
  findRides,
  findRideReqs,
  findSharedRides,
  findReqHistory,
  getRatingAsDriver,
  getProfile,
  searchRides,
  deleteRide
};

async function createRide(rideInfo) {
  var ride = new Ride(rideInfo);
  return ride.save();
}

async function createRideReq(reqInfo) {
  var rideReq = new RideReq(reqInfo);
  return rideReq.save();
}

function updateRide(id, updates) {
  return Ride.findOneAndUpdate({ _id: id }, updates);
};

function updateRideReq(id, updates) {
  return RideReq.findOneAndUpdate({ _id: id }, updates);
}

function updateReqHistory(id, updates) {
  return ReqHistory.findOneAndUpdate({ _id: id }, updates);
}

function findRides(username) {
  return RideReq.find({ driver: username }).lean();
}

function findRideReqs(username) {
  return RideReq.find({ rider: username }).lean();
}

function findSharedRides(username) {
  return Ride.find({ username: username });
}

function findReqHistory(username) {
  return new Promise(function (resolve, reject) {
    async.waterfall([
      function (done) {
        let result = {
          asDriver: [],
          asRider: []
        };
        ReqHistory.find({ driver: username }).lean()
          .exec((err, data) => {
            result.asDriver = data;
            done(err, result);
          });
      },
      function (result, done) {
        ReqHistory.find({ rider: username }).lean()
          .exec((err, data) => {
            if (err) done(err);
            result.asRider = data;
            resolve(result);
          });
      }
    ], (err) => reject(err));
  });
}

function getRatingAsDriver(username) {
  return ReqHistory.aggregate([
    {$match: {
      'driver': username,
      'riderComment.star': {$gte: 0}
    }},
    {$group: {
      '_id': "$driver",
      'avgRating': {$avg: "$riderComment.star"}
    }},
    {$project: {
      'driver': "$_id",
      'avgRating': 1
    }}
  ]);
}

function getRatingAsRider(username) {
  return ReqHistory.aggregate([
    {$match: {
      'rider': username,
      'driverComment.star': {$gte: 0}
    }},
    {$group: {
      '_id': "$rider",
      'avgRating': {$avg: "$driverComment.star"}
    }},
    {$project: {
      'rider': "$_id",
      'avgRating': 1
    }}
  ]);
}

function getProfile(username) {
  return new Promise(function (resolve, reject) {
    async.waterfall([
      function (done) { // get user profile Img
        console.log("get user info");
        userService.getByUN(username)
          .then((userInfo) => {
            done(null, userInfo);
          }).catch(err => done(err));
      },
      function (userInfo, done) { // get user score from req-history
        console.log("get driver");
        userInfo['driverRating'] = 5;
        userInfo['riderRating'] = 5;
        getRatingAsDriver(username)
          .then(rating => {
            if (rating.length > 0)
              userInfo['driverRating'] = rating[0].avgRating;
            done(null, userInfo);
          }).catch(err => done(err));
      },
      function (userInfo, done) { // get user score from req-history
        console.log("get rider");
        getRatingAsRider(username)
          .then(rating => {
            if (rating.length > 0)
              userInfo['riderRating'] = rating[0].avgRating;
            done(null, userInfo);
          }).catch(err => done(err));
      },
      function (result) { // send off
        console.log("send off");
        resolve(result);
      }
    ], (err) => reject(err));
  });
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
  return Ride.find({
    $and: [
      { "searchable": true },
      { "leavingDate": {$gt: leaveDateFrom} },
      { "leavingDate": {$lt: leaveDateTo} },
      {"fromLocation.lat": {$gt: latFromA}},
      {"fromLocation.lat": {$lt: latFromB}},
      {"fromLocation.lng": {$gt: lngFromA}},
      {"fromLocation.lng": {$lt: lngFromB}},
      {"toLocation.lat": {$gt: latToA}},
      {"toLocation.lat": {$lt: latToB}},
      {"toLocation.lng": {$gt: lngToA}},
      {"toLocation.lng": {$lt: lngToB}}
    ]
  }).lean();
}

async function deleteRide(id) {
  return Ride.findOneAndDelete({ _id: id });
}
