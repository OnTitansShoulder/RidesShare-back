var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const schema = new Schema({
  username: { type: String, unique: true, required: true, trim: true,
    index: { unique: true, sparse: true },
    lowercase: true
  },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phone: { type: String, required: true },
  university: { type: String, default: 'University of Florida'},
  roles: {
    type: [{
      type: String, enum: ['user', 'admin']
    }],
    default: ['user'], required: true
  },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
  hash: { type: String, required: true },
  /* For reset password */
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
});

schema.set('toJSON', { virtuals: true });
schema.virtual('fullname').get(function() {
  return this.firstname + ' ' + this.lastname;
});
schema.pre('save', function (next) {
  this.createdDate = new Date;
  next();
});

module.exports = mongoose.model('User', schema);
