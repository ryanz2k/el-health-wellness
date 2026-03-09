require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const xlsx = require('xlsx');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process...');
  
  // 1. Read Excel File
  const excelFilePath = path.join(__dirname, '../Assets', 'Product List.xlsx');
  console.log(`Reading from: ${excelFilePath}`);
  
  try {
    const workbook = xlsx.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    
    // Parse as 2D array to handle the weird formatting
    const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
    
    // Clear existing products
    await prisma.product.deleteMany({});
    console.log('Cleared existing products.');

    let successCount = 0;
    let currentCategory = "General";
    let currentBrand = null;
    
    // Start iterating after the "BRAND NAME" header row (find it first)
    let startIndex = rawData.findIndex(row => row[0] === "BRAND NAME");
    if (startIndex === -1) startIndex = 2; // fallback
    
    for (let i = startIndex + 1; i < rawData.length; i++) {
      const row = rawData[i];
      if (!row || row.length === 0) continue;
      
      // If the row only has 1 string, it's either a main category or brand header
      if (row.length === 1 && typeof row[0] === 'string') {
        const val = row[0].trim();
        currentCategory = val;
        continue;
      }
      
      // If it's a product row (Name, Composition, Strength, Packing, Dosage Form)
      if (row.length >= 2) {
        const productName = row[0];
        const composition = row[1] || "";
        const company = row[2] || "Generic";
        const form = row[3] || "";
        
        if (!productName || productName.toString().trim() === "") continue;
        
        try {
          await prisma.product.create({
            data: {
              name: productName.toString().trim(),
              description: `Composition: ${composition}. Form: ${form}.`,
              category: currentCategory,
              brand: company.toString().trim(),
              price: Math.floor(Math.random() * (2500 - 150) + 150), // Random PHP price 150 - 2500
              stock: 100,
              imageUrl: `/placeholder-${Math.floor(Math.random() * 4) + 1}.jpg`
            }
          });
          successCount++;
        } catch (err) {
          console.error(`Error adding product: ${productName}`);
        }
      }
    }
    
    console.log(`Seeding products complete. Added ${successCount} products.`);
    
    // Seed Dummy Orders
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    console.log('Cleared existing orders.');

    const allProducts = await prisma.product.findMany({ take: 50 });
    if (allProducts.length > 0) {
      for (let i = 0; i < 15; i++) {
        const orderItems = [];
        let orderTotal = 0;
        
        // Random 1 to 3 items per order
        const numItems = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < numItems; j++) {
          const product = allProducts[Math.floor(Math.random() * allProducts.length)];
          const qty = Math.floor(Math.random() * 3) + 1;
          orderTotal += product.price * qty;
          orderItems.push({
            productId: product.id,
            quantity: qty,
            price: product.price
          });
        }

        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // random date within last 30 days
        
        const statuses = ["PENDING", "PAID", "SHIPPED", "DELIVERED"];

        await prisma.order.create({
          data: {
            customerName: `Customer ${i + 1}`,
            customerEmail: `customer${i + 1}@example.com`,
            customerAddress: `${Math.floor(Math.random() * 9000) + 1000} Wellness Ave, City ${i + 1}`,
            totalAmount: orderTotal,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            createdAt: date,
            items: {
              create: orderItems
            }
          }
        });
      }
      console.log('Seeded 15 dummy orders.');
    }
    
  } catch (error) {
    console.error('Failed to read or parse Excel file:', error.message);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
