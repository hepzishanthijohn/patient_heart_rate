const mongoose = require('mongoose');

// Patient Schema
const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Link to the User model
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  heartRate: {
    type: Number,
    required: true
  },
  // Additional fields can be added here, such as medical history, etc.
});

module.exports = mongoose.model('Patient', patientSchema);
