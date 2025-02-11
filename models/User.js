const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Joi = require('joi');  // Added Joi for input validation

// User Schema
const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true, 
    trim: true 
  },
  password: { type: String, required: true }
});

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Password comparison method
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// Validate User input (for registration)
userSchema.statics.validateUser = function (data) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });
  return schema.validate(data);
};

module.exports = mongoose.model('User', userSchema);
