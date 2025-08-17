const db = require('../config/database');

// Get all cars
const getAllCars = (req, res) => {
    const query = `
        SELECT c.*, c.make as brand, c.daily_rate as price_per_day, 
               c.status as available, c.category
        FROM cars c 
        WHERE c.status = 'available'
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        // Transform the data to match our expected format
        const transformedResults = results.map(car => ({
            id: car.id,
            name: `${car.make} ${car.model}`,
            brand: car.make,
            model: car.model,
            year: car.year,
            color: car.color,
            price_per_day: car.daily_rate,
            category_name: car.category,
            image_url: car.image_url,
            seats: car.seats,
            fuel_type: car.fuel_type,
            transmission: car.transmission,
            available: car.status === 'available',
            description: car.description,
            created_at: car.created_at
        }));
        
        res.json(transformedResults);
    });
};

// Get car by ID
const getCarById = (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM cars WHERE id = ?`;
    
    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }
        
        const car = results[0];
        const transformedResult = {
            id: car.id,
            name: `${car.make} ${car.model}`,
            brand: car.make,
            model: car.model,
            year: car.year,
            color: car.color,
            price_per_day: car.daily_rate,
            category_name: car.category,
            image_url: car.image_url,
            seats: car.seats,
            fuel_type: car.fuel_type,
            transmission: car.transmission,
            available: car.status === 'available',
            description: car.description,
            created_at: car.created_at
        };
        
        res.json(transformedResult);
    });
};

// Get all categories
const getCategories = (req, res) => {
    const query = 'SELECT * FROM categories';
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

module.exports = {
    getAllCars,
    getCarById,
    getCategories
};