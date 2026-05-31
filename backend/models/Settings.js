const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  singletonId: { type: String, default: 'global', unique: true },
  instituteName: { type: String, default: 'LEOTECH COMPUTERS' },
  logoSrc: { type: String, default: null },
  footerData: { type: mongoose.Schema.Types.Mixed, default: {} },
  landingData: { type: mongoose.Schema.Types.Mixed, default: {} },
  paymentSettings: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
