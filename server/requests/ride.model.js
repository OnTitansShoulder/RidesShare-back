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
    }
    seats: { type: Number, required: true },
    username: { type: String, required: true },
    active: { type: Boolean, default: true }
});

schema.set('toJSON', { virtuals: true });
schema.virtual('fullFromAddr').get(function() {
  return [this.from.address, this.from.state, this.from.zipcode].join(' ');
});
schema.virtual('fullToAddr').get(function() {
  return [this.to.address, this.to.state, this.to.zipcode].join(' ');
});
schema.pre('save', function (next) {
  this.createdDate = new Date;
  next();
});

module.exports = mongoose.model('Ride', schema);
