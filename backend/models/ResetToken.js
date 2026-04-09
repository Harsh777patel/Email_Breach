const mongoose = require('mongoose');

const ResetTokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // Token expires in 10 minutes
  }
});

module.exports = mongoose.model('ResetToken', ResetTokenSchema);
