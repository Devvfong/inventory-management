// REST API routes for Suppliers
const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');

// GET all suppliers
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('suppliers')
        .select('*');

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST a new supplier
router.post('/', async (req, res) => {
    const { name, contact, email, address } = req.body;
    const { data, error } = await supabase
        .from('suppliers')
        .insert([{ name, contact, email, address }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data[0]);
});

// PUT update supplier by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, contact, email, address } = req.body;
    const { data, error } = await supabase
        .from('suppliers')
        .update({ name, contact, email, address })
        .eq('id', id)
        .select();

    if (error) return res.status(500).json({ error: error.message });
    if (!data || data.length === 0) return res.status(404).json({ error: 'Supplier not found' });
    res.json(data[0]);
});

// DELETE supplier by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id)
        .select();

    if (error) return res.status(500).json({ error: error.message });
    if (!data || data.length === 0) return res.status(404).json({ error: 'Supplier not found' });
    res.json({ message: 'Supplier deleted successfully' });
});

module.exports = router;