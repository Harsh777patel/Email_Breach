const mongoose = require('mongoose');

const StatSchema = new mongoose.Schema({
  emailsMonitored: { type: Number, default: 0 },
  breachesFound: { type: Number, default: 0 },
  passwordsAnalyzed: { type: Number, default: 0 },
});

module.exports = mongoose.model('Stat', StatSchema);
