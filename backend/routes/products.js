// REST API routes for Products
const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');

// GET all products
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*');
        
        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST a new product
router.post('/', async (req, res) => {
    try {
        const { name, sku, quantity, price, supplier_id } = req.body;
        
        // Add created_by field if user is authenticated
        const productData = { name, sku, quantity, price, supplier_id };
        if (req.user) {
            productData.created_by = req.user.id;
        }

        const { data, error } = await supabase
            .from('products')
            .insert([productData])
            .select();

        if (error) return res.status(500).json({ error: error.message });
        res.status(201).json(data[0]);
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT update product by ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, sku, quantity, price, supplier_id } = req.body;
        
        const { data, error } = await supabase
            .from('products')
            .update({ name, sku, quantity, price, supplier_id })
            .eq('id', id)
            .select();

        if (error) return res.status(500).json({ error: error.message });
        if (!data || data.length === 0) return res.status(404).json({ error: 'Product not found' });
        res.json(data[0]);
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE product by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('products')
            .delete()
            .eq('id', id)
            .select();

        if (error) return res.status(500).json({ error: error.message });
        if (!data || data.length === 0) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;