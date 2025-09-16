// Node.js + Express backend for Inventory Management System
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import API routes
const productRoutes = require('./routes/products');
const supplierRoutes = require('./routes/suppliers');
const transactionRoutes = require('./routes/transactions');

const app = express();

// Include middleware: CORS, JSON parser
app.use(cors());
app.use(express.json());

// Register API routes for products, suppliers, and transactions
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/transactions', transactionRoutes);

// A simple root route to check if the server is running
app.get('/', (req, res) => {
    res.send('Inventory Management System backend is alive!');
});

// Listen on environment port or 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});