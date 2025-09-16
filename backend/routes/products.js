// REST API routes for Products
const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');

// GET all products
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('products')
        .select('*');
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST a new product
router.post('/', async (req, res) => {
    const { name, sku, quantity, price, supplier_id } = req.body;
    const { data, error } = await supabase
        .from('products')
        .insert([{ name, sku, quantity, price, supplier_id }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data[0]);
});

// PUT update product by ID
router.put('/:id', async (req, res) => {
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
});

// DELETE product by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .select();

    if (error) return res.status(500).json({ error: error.message });
    if (!data || data.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
});

module.exports = router;