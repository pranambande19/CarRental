const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register user
const registerUser = async (req, res) => {
    try {
        const { full_name, email, password, phone, address } = req.body;
        
        // Split full_name into first_name and last_name
        const nameParts = full_name.trim().split(' ');
        const first_name = nameParts[0];
        const last_name = nameParts.slice(1).join(' ') || '';
        
        // Create username from email (part before @)
        const username = email.split('@')[0];
        
        // Check if user already exists
        db.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            
            if (results.length > 0) {
                return res.status(400).json({ message: 'User already exists with this email or username' });
            }
            
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Insert user with the correct column names
            const insertQuery = 'INSERT INTO users (username, email, password, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?, ?)';
            db.query(insertQuery, [username, email, hashedPassword, first_name, last_name, phone], (err, results) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                
                res.status(201).json({ 
                    message: 'User registered successfully',
                    userId: results.insertId 
                });
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login user
const loginUser = (req, res) => {
    try {
        const { email, password } = req.body;
        
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            
            if (results.length === 0) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            
            const user = results[0];
            const isPasswordValid = await bcrypt.compare(password, user.password);
            
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            
            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            
            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    full_name: `${user.first_name} ${user.last_name}`.trim(),
                    email: user.email,
                    role: user.role
                }
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser
};