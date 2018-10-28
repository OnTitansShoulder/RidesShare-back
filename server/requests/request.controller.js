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
router.post('/ride', updateRide); // update one ride

module.exports = router;

function searchRide(req, res, next) {
  console.log(req.body.criteria);
  requestService.searchRides(req.body.criteria)
    .then((data) => next(data))
    .catch(err => res.status(422).send({ message: err }));
}

function appendUsers(rides, req, res, next) {
  var counter = rides.length;
  var result = [];
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
  console.log(req.body);
  requestService.findRides(req.body.username)
    .then((rides) => {
      console.log(rides);
      res.json(rides);
    })
    .catch(err => next(err));
}

function findRideReqs(req, res, next) {
  requestService.findRideReqs(req.body.username)
    .then((ridereqs) => {
      console.log(ridereqs);
      res.json(ridereqs);
    })
    .catch(err => next(err));
}

function createRide(req, res, next) {
  console.log(req.body.rideInfo);
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
  requestService.updateRide(req.body.updates)
    .then(() => res.json("Success!"))
    .catch(err => next(err) );
}
