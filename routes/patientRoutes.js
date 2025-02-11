const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const jwt = require('jsonwebtoken');  // Import jwt for token verification

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Get token from Authorization header
  
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token using JWT_SECRET
      req.userId = decoded.userId; // Attach userId from the token to the request object
      next();  // Move to the next middleware or route handler
    } catch (err) {
      return res.status(400).json({ message: 'Invalid token.' });
    }
  };

// Add a new patient (Only the authenticated user can add their own patients)
router.post('/patients', verifyToken, async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, heartRate } = req.body;
    const userId = req.userId;  // Extract userId from the request object

    // Validate input data (can be extended with express-validator if needed)
    if (!firstName || !lastName || !dateOfBirth || !heartRate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new patient document linked to the logged-in user
    const newPatient = new Patient({
      userId, 
      firstName,
      lastName,
      dateOfBirth,
      heartRate
    });

    await newPatient.save();
    res.status(201).json({ message: 'Patient added successfully', patient: newPatient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding patient', error });
  }
});

// Get all patients for a specific user
router.get('/patients', verifyToken, async (req, res) => {
  try {
    const userId = req.userId; // Ensure userId is attached to the request object via middleware

    // Find all patients for the logged-in user
    const patients = await Patient.find({ userId });

    if (!patients.length) {
      return res.status(404).json({ message: 'No patients found' });
    }

    res.status(200).json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving patients', error });
  }
});

// Get patient details by patientId
router.get('/patients/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;  // Ensure userId is attached to the request object via middleware
    const { id } = req.params;

    // Find the patient by id and ensure it's associated with the logged-in user
    const patient = await Patient.findOne({ _id: id, userId });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found or unauthorized access' });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving patient', error });
  }
});

module.exports = router;
