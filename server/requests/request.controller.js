const express = require('express');
const router = express.Router();
const requestService = require('./request.service');
const userService = require('../users/user.service');

// routes
router.post('/rides', searchRide); // search ride with criteria
router.get('/ride/:id', getById); // find ride by id
router.put('/ride', updateRide); // create/update one ride
router.post('/history', rideHistory); // get user's ride history

function searchRide(req, res, next) {
  
}

function rideHistory(req, res, next) {

}

function updateRide(req, res, next) {
  requestService.upsert(req.body)
    .then(() => res.json("Success!"))
    .catch(err =>
      console.log(err);
      next(err));
}
