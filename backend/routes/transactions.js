// REST API routes for Inventory Transactions
const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');

// GET all transactions
router.get('/', async (req, res) => {
    // Example of joining with products table to get product name
    const { data, error } = await supabase
        .from('transactions')
        .select(`
            *,
            products ( name )
        `);

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST a new transaction (stock in/out)
router.post('/', async (req, res) => {
    const { product_id, type, quantity, note } = req.body;

    // TODO: Add logic to update the product's quantity in the 'products' table
    // This should be done in a database transaction to ensure data integrity.

    const { data, error } = await supabase
        .from('transactions')
        .insert([{ product_id, type, quantity, note }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data[0]);
});

module.exports = router;