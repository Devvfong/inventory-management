import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash the default password
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Create supplier user
  const supplierUser = await prisma.user.upsert({
    where: { email: 'supplier@example.com' },
    update: {},
    create: {
      email: 'supplier@example.com',
      password: hashedPassword,
      role: 'SUPPLIER',
    },
  });

  console.log('✅ Supplier user created:', supplierUser.email);

  // Create supplier profile
  const supplier = await prisma.supplier.upsert({
    where: { userId: supplierUser.id },
    update: {},
    create: {
      name: 'Demo Supplier Co.',
      contactInfo: 'contact@demosupplier.com',
      address: '123 Business Street, City, State 12345',
      userId: supplierUser.id,
    },
  });

  console.log('✅ Supplier profile created:', supplier.name);

  // Create warehouse
  const warehouse = await prisma.warehouse.upsert({
    where: { id: 'main-warehouse' },
    update: {},
    create: {
      id: 'main-warehouse',
      name: 'Main Warehouse',
      location: 'Downtown Location',
      capacity: 10000,
    },
  });

  console.log('✅ Warehouse created:', warehouse.name);

  // Create sample products
  const products = [
    {
      name: 'Laptop Computer',
      sku: 'LAP-001',
      description: 'High-performance laptop for business use',
      price: 999.99,
    },
    {
      name: 'Wireless Mouse',
      sku: 'MOU-001',
      description: 'Ergonomic wireless mouse',
      price: 29.99,
    },
    {
      name: 'USB Cable',
      sku: 'CAB-001',
      description: 'USB-C to USB-A cable, 6ft',
      price: 9.99,
    },
  ];

  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { sku: productData.sku },
      update: {},
      create: {
        ...productData,
        supplierId: supplier.id,
      },
    });

    // Create stock items for each product
    await prisma.stockItem.upsert({
      where: {
        productId_warehouseId: {
          productId: product.id,
          warehouseId: warehouse.id,
        },
      },
      update: {},
      create: {
        quantity: Math.floor(Math.random() * 100) + 50, // Random quantity between 50-149
        reorderLevel: 10,
        maxStockLevel: 200,
        productId: product.id,
        warehouseId: warehouse.id,
      },
    });

    console.log('✅ Product and stock created:', product.name);
  }

  console.log('🎉 Database seeded successfully!');
  console.log('\n📝 Default login credentials:');
  console.log('👤 Admin: admin@example.com / Password123!');
  console.log('🏪 Supplier: supplier@example.com / Password123!');
  console.log('\n⚠️  IMPORTANT: Change these passwords in production!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });