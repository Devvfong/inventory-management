// Node.js + Express backend for Inventory Management System
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import middleware
const verifyAuth = require('./middleware/verifyAuth');

// Import API routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const supplierRoutes = require('./routes/suppliers');
const transactionRoutes = require('./routes/transactions');

const app = express();

// Include middleware: CORS, JSON parser
app.use(cors());
app.use(express.json());

// Register authentication routes (no auth required)
app.use('/api/auth', authRoutes);

// Check if authentication is required for API routes
const authRequired = process.env.AUTH_REQUIRED === 'true';

// Apply auth middleware conditionally to API routes
if (authRequired) {
    app.use('/api/products', verifyAuth);
    app.use('/api/suppliers', verifyAuth);
    app.use('/api/transactions', verifyAuth);
}

// Register API routes for products, suppliers, and transactions
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/transactions', transactionRoutes);

// A simple root route to check if the server is running
app.get('/', (req, res) => {
    res.send('Inventory Management System backend is alive!');
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        authRequired: authRequired,
        timestamp: new Date().toISOString()
    });
});

// Listen on environment port or 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log(`Authentication required: ${authRequired}`);
});