var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const schema = new Schema({
  username: { type: String, required: true },
  riders: {
    type: [{
      type: String, required: true
    }],
    required: true
  },
  leavingDate: { type: Date, required: true},
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
});

module.exports = mongoose.model('History', schema);
