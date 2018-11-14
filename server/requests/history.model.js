var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const schema = new Schema({
  createdDate: { type: Date, default: Date.now },
  leavingDate: { type: Date, required: true },
  fromAddress: { type: String, required: true },
  toAddress: { type: String, required: true },
  driver: { type: String, required: true },
  driverName: { type: String, required: true },
  driverComment: {
    comment: { type: String, default: '' },
    star: { type: Number, default: -1 }
  },
  rider: { type: String, required: true },
  riderName: { type: String, required: true },
  riderComment: {
    comment: { type: String, default: '' },
    star: { type: Number, default: -1 }
  }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('ReqHistory', schema);
