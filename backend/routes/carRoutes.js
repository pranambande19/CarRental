const express = require('express');
const router = express.Router();
const { getAllCars, getCarById, getCategories } = require('../controllers/carController');

router.get('/', getAllCars);
router.get('/categories', getCategories);
router.get('/:id', getCarById);

module.exports = router;