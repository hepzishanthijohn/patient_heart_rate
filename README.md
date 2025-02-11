# Patient Heart Rate API

This API allows users to register, login, manage patients, and record/get heart rate data.

## Endpoints

- **POST** `/api/users/register`: Register a new user.
- **POST** `/api/users/login`: Log in and receive a JWT token.
- **POST** `/api/patients`: Create a new patient.
- **GET** `/api/patients`: Get all patients for the logged-in user.
- **POST** `/api/heartRates`: Create a heart rate record for a patient.
- **GET** `/api/heartRates/:patientId`: Get the heart rate record of a specific patient.

## Running the Application

- Install dependencies: `npm install`
- Start the server: `npm start`
- The app will be available at `http://localhost:3000`.
