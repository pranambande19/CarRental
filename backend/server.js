const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const carRoutes = require('./routes/carRoutes');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');  

app.use('/api/cars', carRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);  

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Car Rental API is running!' });
});

// Test database connection
const db = require('./config/database');

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});