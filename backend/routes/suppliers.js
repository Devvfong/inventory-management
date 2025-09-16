import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET all suppliers (admin only)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: {
        user: {
          select: { id: true, email: true, role: true }
        },
        _count: {
          select: { products: true }
        }
      },
    });

    res.json(suppliers);
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single supplier by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check access rights
    if (req.user.role === 'SUPPLIER' && (!req.user.supplier || req.user.supplier.id !== id)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, email: true, role: true }
        },
        products: true,
        _count: {
          select: { products: true, purchaseOrders: true }
        }
      },
    });

    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.json(supplier);
  } catch (error) {
    console.error('Get supplier error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update supplier by ID
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contactInfo, address } = req.body;

    // Check access rights
    if (req.user.role === 'SUPPLIER' && (!req.user.supplier || req.user.supplier.id !== id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const supplier = await prisma.supplier.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(contactInfo !== undefined && { contactInfo }),
        ...(address !== undefined && { address }),
      },
      include: {
        user: {
          select: { id: true, email: true, role: true }
        }
      },
    });

    res.json(supplier);
  } catch (error) {
    console.error('Update supplier error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;