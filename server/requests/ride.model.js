var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const schema = new Schema({
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
    leavingDate: { type: Date, required: true },
    from: {
      address: { type: String, required: true },
      state: { type: String, default: 'FL' },
      zipcode: { type: String, required: true }
    },
    to: {
      address: { type: String, required: true },
      state: { type: String, default: 'FL' },
      zipcode: { type: String, required: true }
    },
    riders: {
      type: [{
        type: String, required: true
      }],
      default: []
    },
    pendingRiders: {
      type: [{
        type: String, required: true
      }],
      default: []
    },
    seats: { type: Number, required: true },
    username: { type: String, required: true }
});

schema.set('toJSON', { virtuals: true });
schema.virtual('fullFromAddr').get(function() {
  return [this.from.address, this.from.state, this.from.zipcode].join(' ');
});
schema.virtual('fullToAddr').get(function() {
  return [this.to.address, this.to.state, this.to.zipcode].join(' ');
});
schema.pre('save', function (next) {
  this.updatedDate = new Date();
  next();
});

module.exports = mongoose.model('Ride', schema);
