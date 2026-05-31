const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['Video', 'Notes', 'Quiz', 'Lab'], default: 'Video' },
  completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Tracks student completions dynamically
  content: { type: String } // Stores extracted PDF notes or HTML
});

const ModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lessons: [LessonSchema]
});

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  duration: { type: Number, required: true }, // in weeks
  instructor: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['Active', 'Draft'], default: 'Active' },
  modules: [ModuleSchema]
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);