const express = require('express');
const router = express.Router();
const requestService = require('./request.service');
const userService = require('../users/user.service');

// routes
router.post('/rides', searchRide); // search ride with criteria
// router.get('/ride/:id', getById); // find ride by id
router.post('/myrides', findUserRides);
router.put('/ride', createRide); // create one ride
router.post('/ride', updateRide); // update one ride
router.post('/history', rideHistory); // get user's ride history

module.exports = router;

function searchRide(req, res, next) {
  console.log(req.body.criteria);
  requestService.searchRides(req.body.criteria)
    .then((data) => res.json(data))
    .catch(err => next(err));
}

function findUserRides(req, res, next) {
  requestService.findRides(req.body.username)
    .then((rides) => res.json(rides))
    .catch(err => next(err));
}

function rideHistory(req, res, next) {
  res.json('not implemented');
}

function createRide(req, res, next) {
  console.log(req.body.rideInfo);
  requestService.createRide(req.body.rideInfo)
    .then(() => res.json("Success!"))
    .catch(err => next(err));
}

function updateRide(req, res, next) {
  requestService.updateRide(req.body.updates)
    .then(() => res.json("Success!"))
    .catch(err => next(err) );
}
