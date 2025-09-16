import axios from 'axios'
import { supabase } from '../lib/supabaseClient'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`
      }
    } catch (error) {
      console.error('Error getting session:', error)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, sign out user
      await supabase.auth.signOut()
    }
    return Promise.reject(error)
  }
)

// Auth API calls
export const authAPI = {
  register: (email, password, name) => 
    api.post('/auth/register', { email, password, name }),
  
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
    
  getProfile: () => 
    api.get('/auth/me')
}

// Products API
export const productsAPI = {
  getAll: () => api.get('/products'),
  create: (product) => api.post('/products', product),
  update: (id, product) => api.put(`/products/${id}`, product),
  delete: (id) => api.delete(`/products/${id}`)
}

// Suppliers API
export const suppliersAPI = {
  getAll: () => api.get('/suppliers'),
  create: (supplier) => api.post('/suppliers', supplier),
  update: (id, supplier) => api.put(`/suppliers/${id}`, supplier),
  delete: (id) => api.delete(`/suppliers/${id}`)
}

// Transactions API
export const transactionsAPI = {
  getAll: () => api.get('/transactions'),
  create: (transaction) => api.post('/transactions', transaction),
  getById: (id) => api.get(`/transactions/${id}`)
}

export default api