const mongoose = require('mongoose');
const Joi = require('joi');  // Added Joi for input validation

const heartRateSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  heartRate: { type: Number, required: true, min: 30, max: 200 },  // Heart rate limits
  recordedAt: { type: Date, default: Date.now }
});

// Validate HeartRate input
heartRateSchema.statics.validateHeartRate = function (data) {
  const schema = Joi.object({
    patientId: Joi.string().required(),
    heartRate: Joi.number().min(30).max(200).required()
  });
  return schema.validate(data);
};

module.exports = mongoose.model('HeartRate', heartRateSchema);
