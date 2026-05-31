const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  questionsCount: { type: Number, required: true },
  status: { type: String, enum: ['Active', 'Draft'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Assessment', AssessmentSchema);