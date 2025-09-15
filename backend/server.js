// backend/server.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Authentication middleware (example)
const authenticate = (req, res, next) => {
    // Implement your authentication logic here
    next();
};

// Basic routes structure
app.get('/', (req, res) => {
    res.send('Welcome to the Inventory Management System');
});

// Example route to get items
app.get('/items', authenticate, async (req, res) => {
    const { data, error } = await supabase
        .from('items')
        .select('*');
    
    if (error) return res.status(400).send(error);
    res.send(data);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
