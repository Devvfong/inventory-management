// Axios service for API calls to backend
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Products API functions
export const getProducts = () => api.get('/products');
export const createProduct = (productData) => api.post('/products', productData);
export const updateProduct = (id, productData) => api.put(`/products/${id}`, productData);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Suppliers API functions
export const getSuppliers = () => api.get('/suppliers');
export const createSupplier = (supplierData) => api.post('/suppliers', supplierData);
export const updateSupplier = (id, supplierData) => api.put(`/suppliers/${id}`, supplierData);
export const deleteSupplier = (id) => api.delete(`/suppliers/${id}`);

// Transactions API functions
export const getTransactions = () => api.get('/transactions');
export const createTransaction = (transactionData) => api.post('/transactions', transactionData);

export default api;