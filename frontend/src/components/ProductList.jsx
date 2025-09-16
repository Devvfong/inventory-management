import React, { useState, useEffect } from 'react'
import { productsAPI } from '../services/api'

const ProductList = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAll()
      setProducts(response.data)
    } catch (err) {
      setError('Failed to load products')
      console.error('Error loading products:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading products...</div>
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your inventory products</p>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Product List</h2>
          </div>
          <div className="p-6">
            {products.length === 0 ? (
              <p className="text-gray-500">No products found. Create your first product!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                    <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                    <p className="text-sm text-gray-600">Price: ${product.price}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductList