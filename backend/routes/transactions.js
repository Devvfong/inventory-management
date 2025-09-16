// REST API routes for Inventory Transactions
const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');

// GET all transactions
router.get('/', async (req, res) => {
    try {
        // Join with products table to get product name
        const { data, error } = await supabase
            .from('transactions')
            .select(`
                *,
                products ( name )
            `);

        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST a new transaction (stock in/out)
router.post('/', async (req, res) => {
    try {
        const { product_id, type, quantity, note } = req.body;

        // Validate transaction type
        if (!['in', 'out'].includes(type)) {
            return res.status(400).json({ error: 'Transaction type must be "in" or "out"' });
        }

        // Add created_by field if user is authenticated
        const transactionData = { product_id, type, quantity, note };
        if (req.user) {
            transactionData.created_by = req.user.id;
        }

        // Start a transaction to update both transactions and products tables
        // Note: This is a simplified version. In production, you'd want to use database transactions
        
        // Insert the transaction record
        const { data: transactionResult, error: transactionError } = await supabase
            .from('transactions')
            .insert([transactionData])
            .select();

        if (transactionError) {
            return res.status(500).json({ error: transactionError.message });
        }

        // Update product quantity
        // Get current product quantity
        const { data: product, error: productFetchError } = await supabase
            .from('products')
            .select('quantity')
            .eq('id', product_id)
            .single();

        if (productFetchError) {
            return res.status(500).json({ error: 'Product not found' });
        }

        // Calculate new quantity
        const currentQuantity = product.quantity || 0;
        const newQuantity = type === 'in' 
            ? currentQuantity + parseInt(quantity)
            : currentQuantity - parseInt(quantity);

        // Prevent negative stock
        if (newQuantity < 0) {
            return res.status(400).json({ error: 'Insufficient stock for this transaction' });
        }

        // Update product quantity
        const { error: updateError } = await supabase
            .from('products')
            .update({ quantity: newQuantity })
            .eq('id', product_id);

        if (updateError) {
            return res.status(500).json({ error: 'Failed to update product quantity' });
        }

        res.status(201).json(transactionResult[0]);
    } catch (error) {
        console.error('Create transaction error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET transaction by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('transactions')
            .select(`
                *,
                products ( name, sku )
            `)
            .eq('id', id)
            .single();

        if (error) return res.status(500).json({ error: error.message });
        if (!data) return res.status(404).json({ error: 'Transaction not found' });
        
        res.json(data);
    } catch (error) {
        console.error('Get transaction error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;