import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, isAdmin, isSupplier } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET all purchase orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const where = {};
    
    // If user is a supplier, filter by their supplier ID
    if (req.user.role === 'SUPPLIER' && req.user.supplier) {
      where.supplierId = req.user.supplier.id;
    }

    const purchaseOrders = await prisma.purchaseOrder.findMany({
      where,
      include: {
        supplier: {
          select: { id: true, name: true }
        },
        lines: {
          include: {
            product: {
              select: { id: true, name: true, sku: true }
            }
          }
        },
        _count: {
          select: { lines: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(purchaseOrders);
  } catch (error) {
    console.error('Get purchase orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single purchase order by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        supplier: {
          select: { id: true, name: true, contactInfo: true }
        },
        lines: {
          include: {
            product: {
              select: { id: true, name: true, sku: true, description: true }
            }
          }
        }
      },
    });

    if (!purchaseOrder) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }

    // Check if user has access to this purchase order
    if (req.user.role === 'SUPPLIER' && req.user.supplier && purchaseOrder.supplierId !== req.user.supplier.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(purchaseOrder);
  } catch (error) {
    console.error('Get purchase order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create new purchase order
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { supplierId, orderNumber, expectedDate, lines } = req.body;

    // Validate input
    if (!supplierId || !orderNumber || !lines || lines.length === 0) {
      return res.status(400).json({ error: 'Supplier ID, order number, and lines are required' });
    }

    // Check if order number already exists
    const existingOrder = await prisma.purchaseOrder.findUnique({
      where: { orderNumber },
    });

    if (existingOrder) {
      return res.status(400).json({ error: 'Purchase order with this order number already exists' });
    }

    // Calculate total amount
    let totalAmount = 0;
    for (const line of lines) {
      totalAmount += parseFloat(line.unitPrice) * parseInt(line.quantity);
    }

    // Create purchase order with lines in a transaction
    const purchaseOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.purchaseOrder.create({
        data: {
          orderNumber,
          supplierId,
          totalAmount,
          expectedDate: expectedDate ? new Date(expectedDate) : null,
        },
      });

      const orderLines = await Promise.all(
        lines.map((line) =>
          tx.purchaseOrderLine.create({
            data: {
              purchaseOrderId: order.id,
              productId: line.productId,
              quantity: parseInt(line.quantity),
              unitPrice: parseFloat(line.unitPrice),
            },
          })
        )
      );

      return { ...order, lines: orderLines };
    });

    // Fetch the complete purchase order with relations
    const completePurchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { id: purchaseOrder.id },
      include: {
        supplier: {
          select: { id: true, name: true }
        },
        lines: {
          include: {
            product: {
              select: { id: true, name: true, sku: true }
            }
          }
        }
      },
    });

    res.status(201).json(completePurchaseOrder);
  } catch (error) {
    console.error('Create purchase order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update purchase order status
router.put('/:id/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, receivedDate } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updateData = { status };
    if (status === 'RECEIVED' && receivedDate) {
      updateData.receivedDate = new Date(receivedDate);
    }

    const purchaseOrder = await prisma.purchaseOrder.update({
      where: { id },
      data: updateData,
      include: {
        supplier: {
          select: { id: true, name: true }
        },
        lines: {
          include: {
            product: {
              select: { id: true, name: true, sku: true }
            }
          }
        }
      },
    });

    res.json(purchaseOrder);
  } catch (error) {
    console.error('Update purchase order status error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Purchase order not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;