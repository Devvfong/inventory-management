import React, { useState, useEffect } from 'react'
import { suppliersAPI } from '../services/api'

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadSuppliers()
  }, [])

  const loadSuppliers = async () => {
    try {
      const response = await suppliersAPI.getAll()
      setSuppliers(response.data)
    } catch (err) {
      setError('Failed to load suppliers')
      console.error('Error loading suppliers:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading suppliers...</div>
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
          <p className="text-gray-600">Manage your suppliers</p>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Supplier List</h2>
          </div>
          <div className="p-6">
            {suppliers.length === 0 ? (
              <p className="text-gray-500">No suppliers found. Add your first supplier!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suppliers.map((supplier) => (
                  <div key={supplier.id} className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900">{supplier.name}</h3>
                    <p className="text-sm text-gray-600">Contact: {supplier.contact}</p>
                    <p className="text-sm text-gray-600">Email: {supplier.email}</p>
                    <p className="text-sm text-gray-600">Address: {supplier.address}</p>
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

export default SupplierList