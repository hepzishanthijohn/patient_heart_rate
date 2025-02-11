const express = require('express');
require("dotenv").config();
const connectDB = require('./db')
const bodyParser = require('body-parser');
const userRoutes = require('./routes/authRoutes');  // Corrected import path
const heartRateRoutes = require('./routes/heartRateRoutes');
const patientRoutes = require('./routes/patientRoutes');
const errorHandler = require('./middleware/errorHandler');

//connect to database
connectDB();


const app = express();

app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send(`Patient heart rate checking
    for registration => use : "POST/api/users/register
    for login => use : POST/api/users/login
    for create patients => use : POST/api/patients/patients
    for getting all patients details =>use : GET/api/patients/patients
    for creating the heartRate of patients => use: POST/api/heartRates
    for getting the heartRate of patiens => use: GET/api/heartRates/:patientId
    
    BEFORE CREATING OR VIEW THE PATIENT MUST BE LOGIN`);
});

// Routes
app.use('/api/users', userRoutes);  // Use authRoutes here
app.use('/api/heartRates', heartRateRoutes);
app.use('/api/patients', patientRoutes);

// Error handling middleware
app.use(errorHandler);
// Use JSON parser middleware
app.use(express.json());

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
