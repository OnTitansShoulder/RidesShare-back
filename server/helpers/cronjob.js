'use strict'

var CronJob = require('cron').CronJob,
  http = require('http'),
  db = require('./db'),
  async = require('async'),
  Ride = db.Ride,
  RideReq = db.RideReq,
  ReqHistory = db.ReqHistory;

/**
 * This is a hit cron job that keeps itself awake at Heroku
 */
var hitService = new CronJob('0 */25 * * * *', function () {
  let options = {
    host: 'http://localhost:8080',
    path: '/'
  };
  http.get(options, function (res) {
    console.log('Just hit myself: ' + res.statusCode);
  });
}, null, false, 'America/New_York');

var recycleService = new CronJob('0 */15 * * * *', function () {
  console.log('Running a clean-up job for passed ride requests...');
  async.waterfall([
    function(done) {
      let present = new Date();
      RideReq.find({ $and: [{ 'leavingDate': { $lt: present } }, { 'status': 'ACCEPTED' }] })
        .select('-_id').lean()
        .exec(function (err, ridereqs) {
          if (err) {
            console.log(errorHandler.getErrorMessage(err));
            ridereqs = [];
          }
          console.log(ridereqs.length + " new completed rides found.");
          done(null, ridereqs, present);
        });
    },
    function (reqs, present, done) {
      var todo = reqs.length;
      if (todo == 0) { done(null, present); }
      reqs.forEach(function (req) {
        var history = new ReqHistory(req);
        history.save(function (err) {
          if (err) console.log(err);
          todo -= 1;
          if (todo == 0) {
            console.log(reqs.length + " new ride history entries recorded.");
            done(null, present);
          }
        });
      });
    },
    function (present, done) {
      RideReq.deleteMany({'leavingDate': { $lt: present }})
        .then((resp) => {
          console.log(resp.result.n + " past ride requests got cleaned up.");
          done(null, present);
        }).catch(err => console.log(err));
    },
    function (present, done) {
      console.log("level four");
      Ride.deleteMany({'leavingDate': { $lt: present }})
        .then((resp) => {
          console.log(resp.result.n + " past rides got cleaned up.");
          done();
        }).catch(err => console.log(err));
    },
    function () {
      console.log('Clean-up complete.');
    }
  ]);
}, null, true, 'America/Los_Angeles');

module.exports = { cronjobs: 'true'};
