const config = require('../config.json');
const db = require('../helpers/db');
const Ride = db.Ride;

module.exports = {
  upsert,
  inactivate
};

async function upsert(rideInfo) {
  return Ride.findOneAndUpdate({ username: rideInfo.username },
    rideInfo, { upsert: true });
};

async function inactivate(id) {
  await Ride.findOneAndUpdate({ _id: id }, { active: false }, {});
}
