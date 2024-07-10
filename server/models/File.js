// models/File.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  content: {
    type: Buffer,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
