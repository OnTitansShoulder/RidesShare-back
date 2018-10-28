var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const schema = new Schema({
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
  leavingDate: { type: Date, required: true },
  fromLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  toLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  fromAddress: { type: String, required: true },
  toAddress: { type: String, required: true },
  seats: { type: Number, required: true },
  username: { type: String, required: true }
});

schema.set('toJSON', { virtuals: true });
schema.pre('save', function (next) {
  this.updatedDate = new Date();
  next();
});

module.exports = mongoose.model('Ride', schema);
