const express = require('express');
const router = express.Router();
const requestService = require('./request.service');
const userService = require('../users/user.service');

// routes
router.post('/rides', searchRide, appendUsers); // search ride with criteria
// router.get('/ride/:id', getById); // find ride by id
router.put('/ride', createRide); // create one ride
router.put('/ridereq', createRideReq); // create one ride request
router.post('/myrides', findRides); // me as the driver
router.post('/myridereqs', findRideReqs); // me as the rider
router.post('/sharedrides', findSharedRides); // find the driver's shared rides
router.post('/ride', updateRide); // update one ride, or delete it
router.post('/ridereq', updateRideReq); // update one ridereq

module.exports = router;

function searchRide(req, res, next) {
  requestService.searchRides(req.body.criteria)
    .then((data) => {
      console.log(data);
      next(data);
    })
    .catch(err => res.status(422).send({ message: err }));
}

function appendUsers(rides, req, res, next) {
  var counter = rides.length;
  var result = [];
  if (rides.length < 1) return res.json(result);
  rides.forEach((ride) => {
    userService.getByUN(ride.username)
      .then((user) => {
        counter -= 1;
        ride.fullname = user.firstname + ' ' + user.lastname;
        result.push(ride);
        if (counter == 0) {
          res.json(result);
        }
      })
      .catch(err => counter -= 1);
  });
}

function findRides(req, res, next) {
  requestService.findRides(req.body.username)
    .then((rides) => { res.json(rides); })
    .catch(err => next(err));
}

function findRideReqs(req, res, next) {
  requestService.findRideReqs(req.body.username)
    .then((ridereqs) => {
      res.json(ridereqs);
    })
    .catch(err => next(err));
}

function findSharedRides(req, res, next) {
  requestService.findSharedRides(req.body.username)
    .then((rides) => { res.json(rides); })
    .catch(err => next(err));
}

function createRide(req, res, next) {
  requestService.createRide(req.body.rideInfo)
    .then(() => res.json("Success!"))
    .catch(err => next(err));
}

function createRideReq(req, res, next) {
  requestService.createRideReq(req.body.reqInfo)
    .then(() => res.json("Success!"))
    .catch(err => next(err));
}

function updateRide(req, res, next) {
  if (req.body.delete_one) {
    requestService.deleteRide(req.body.rideId)
      .then(() => res.json("Success!"))
      .catch(err => next(err) );
  } else {
    requestService.updateRide(req.body.rideId, req.body.updates)
      .then(() => res.json("Success!"))
      .catch(err => next(err) );
  }
}

function updateRideReq(req, res, next) {
  requestService.updateRideReq(req.body.ridereqId, req.body.updates)
    .then(() => res.json("Success!"))
    .catch(err => next(err) );
}
