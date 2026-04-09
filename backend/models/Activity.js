const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  color: {
    type: String, // e.g. "text-green-400"
    required: true,
  },
  icon: {
    type: String, // svg path
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Activity', ActivitySchema);
