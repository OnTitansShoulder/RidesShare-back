var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const schema = new Schema({
  createdDate: { type: Date, default: Date.now },
  leavingDate: { type: Date, required: true },
  fromAddress: { type: String, required: true },
  toAddress: { type: String, required: true },
  rideId: { type: Schema.Types.ObjectId, required: true },
  driver: { type: String, required: true },
  driverName: { type: String, required: true },
  rider: { type: String, required: true },
  riderName: { type: String, required: true },
  comments: { type: String, required: true },
  status: { type: String, required: true }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('RideReq', schema);
