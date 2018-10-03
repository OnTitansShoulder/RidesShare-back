var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const schema = new Schema({
    username: { type: String, unique: true, required: true, trim: true},
    hash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    university: { type: String, required: true},
    createdDate: { type: Date, default: Date.now },
    /* For reset password */
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);
