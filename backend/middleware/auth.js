import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Middleware to verify JWT token
export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database to ensure they still exist
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { supplier: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Middleware to check if user is admin
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Middleware to check if user is supplier (or admin)
export const isSupplier = (req, res, next) => {
  if (req.user.role !== 'SUPPLIER' && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Supplier access required' });
  }
  next();
};

// Middleware to check if user owns the supplier or is admin
export const isOwnerOrAdmin = async (req, res, next) => {
  try {
    const { supplierId } = req.params;
    
    if (req.user.role === 'ADMIN') {
      return next();
    }

    if (req.user.role === 'SUPPLIER' && req.user.supplier && req.user.supplier.id === supplierId) {
      return next();
    }

    return res.status(403).json({ error: 'Access denied' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};