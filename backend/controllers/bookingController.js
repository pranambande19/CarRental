const db = require('../config/database');

// Create a booking
const createBooking = (req, res) => {
    try {
        const { user_id, car_id, start_date, end_date, total_amount } = req.body;
        
        const checkAvailabilityQuery = `
            SELECT * FROM bookings 
            WHERE car_id = ? 
            AND status IN ('pending', 'confirmed') 
            AND (
                (start_date <= ? AND end_date >= ?) OR
                (start_date <= ? AND end_date >= ?) OR
                (start_date >= ? AND end_date <= ?)
            )
        `;
        
        db.query(checkAvailabilityQuery, [car_id, start_date, start_date, end_date, end_date, start_date, end_date], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            
            if (results.length > 0) {
                return res.status(400).json({ message: 'Car is not available for the selected dates' });
            }
            
            const insertQuery = 'INSERT INTO bookings (user_id, car_id, start_date, end_date, total_amount) VALUES (?, ?, ?, ?, ?)';
            db.query(insertQuery, [user_id, car_id, start_date, end_date, total_amount], (err, results) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                
                res.status(201).json({ 
                    message: 'Booking created successfully',
                    bookingId: results.insertId 
                });
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserBookings = (req, res) => {
    const { userId } = req.params;
    const query = `
        SELECT b.*, c.name as car_name, c.brand, c.model 
        FROM bookings b 
        JOIN cars c ON b.car_id = c.id 
        WHERE b.user_id = ?
        ORDER BY b.booking_date DESC
    `;
    
    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

module.exports = {
    createBooking,
    getUserBookings
};