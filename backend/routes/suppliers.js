// REST API routes for Suppliers
const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');

// GET all suppliers
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('suppliers')
            .select('*');

        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    } catch (error) {
        console.error('Get suppliers error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST a new supplier
router.post('/', async (req, res) => {
    try {
        const { name, contact, email, address } = req.body;
        
        // Add created_by field if user is authenticated
        const supplierData = { name, contact, email, address };
        if (req.user) {
            supplierData.created_by = req.user.id;
        }

        const { data, error } = await supabase
            .from('suppliers')
            .insert([supplierData])
            .select();

        if (error) return res.status(500).json({ error: error.message });
        res.status(201).json(data[0]);
    } catch (error) {
        console.error('Create supplier error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT update supplier by ID
router.put('/:id', async (req, res) => {
    try {
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
    } catch (error) {
        console.error('Update supplier error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE supplier by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('suppliers')
            .delete()
            .eq('id', id)
            .select();

        if (error) return res.status(500).json({ error: error.message });
        if (!data || data.length === 0) return res.status(404).json({ error: 'Supplier not found' });
        res.json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        console.error('Delete supplier error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;