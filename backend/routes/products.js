import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, isAdmin, isSupplier } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET all products
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { supplierId } = req.query;
    
    const where = {};
    
    // If user is a supplier, filter by their supplier ID
    if (req.user.role === 'SUPPLIER' && req.user.supplier) {
      where.supplierId = req.user.supplier.id;
    } else if (supplierId) {
      where.supplierId = supplierId;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        supplier: {
          select: { id: true, name: true }
        },
        stockItems: {
          include: {
            warehouse: {
              select: { id: true, name: true }
            }
          }
        }
      },
    });

    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single product by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        supplier: {
          select: { id: true, name: true }
        },
        stockItems: {
          include: {
            warehouse: {
              select: { id: true, name: true }
            }
          }
        }
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user has access to this product
    if (req.user.role === 'SUPPLIER' && req.user.supplier && product.supplierId !== req.user.supplier.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create new product
router.post('/', authenticateToken, isSupplier, async (req, res) => {
  try {
    const { name, sku, description, price } = req.body;

    // Validate input
    if (!name || !sku || !price) {
      return res.status(400).json({ error: 'Name, SKU, and price are required' });
    }

    // Determine supplier ID
    let supplierId;
    if (req.user.role === 'ADMIN') {
      supplierId = req.body.supplierId;
      if (!supplierId) {
        return res.status(400).json({ error: 'Supplier ID is required for admin' });
      }
    } else {
      supplierId = req.user.supplier.id;
    }

    // Check if SKU already exists
    const existingProduct = await prisma.product.findUnique({
      where: { sku },
    });

    if (existingProduct) {
      return res.status(400).json({ error: 'Product with this SKU already exists' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        description,
        price: parseFloat(price),
        supplierId,
      },
      include: {
        supplier: {
          select: { id: true, name: true }
        }
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update product by ID
router.put('/:id', authenticateToken, isSupplier, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sku, description, price } = req.body;

    // Find existing product
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user has access to update this product
    if (req.user.role === 'SUPPLIER' && req.user.supplier && existingProduct.supplierId !== req.user.supplier.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if SKU already exists (excluding current product)
    if (sku && sku !== existingProduct.sku) {
      const skuExists = await prisma.product.findUnique({
        where: { sku },
      });

      if (skuExists) {
        return res.status(400).json({ error: 'Product with this SKU already exists' });
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(sku && { sku }),
        ...(description !== undefined && { description }),
        ...(price && { price: parseFloat(price) }),
      },
      include: {
        supplier: {
          select: { id: true, name: true }
        }
      },
    });

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE product by ID
router.delete('/:id', authenticateToken, isSupplier, async (req, res) => {
  try {
    const { id } = req.params;

    // Find existing product
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user has access to delete this product
    if (req.user.role === 'SUPPLIER' && req.user.supplier && existingProduct.supplierId !== req.user.supplier.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.product.delete({
      where: { id },
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;