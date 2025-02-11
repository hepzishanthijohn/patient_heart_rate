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
  res.send('Patient heart rate checking');
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
