const HeartRate = require('../models/HeartRate');
const Patient = require('../models/Patient');
const express = require('express');
const router = express.Router();

// Record heart rate data
router.post('/', async (req, res) => {
  try {
    const { patientId, heartRate } = req.body;

    // Validate input data
    const { error } = HeartRate.validateHeartRate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const heartRateData = new HeartRate({ patientId, heartRate });
    await heartRateData.save();
    res.status(201).json({ message: 'Heart rate recorded successfully', heartRate: heartRateData });
  } catch (error) {
    res.status(500).json({ message: 'Error recording heart rate data', error });
  }
});

// Get heart rate data for a specific patient (by patientId)
router.get('/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;  // Get patientId from the URL parameter

    const heartRates = await HeartRate.find({ patientId });
    if (heartRates.length === 0) {
      return res.status(404).json({ message: 'No heart rate data found for this patient' });
    }

    res.status(200).json({ heartRates });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving heart rate data', error });
  }
});

module.exports = router;
