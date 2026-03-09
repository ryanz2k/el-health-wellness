const xlsx = require('xlsx');
const path = require('path');

const excelFilePath = path.join('c:\\Users\\JohnR\\Projects\\El Health and Wellness\\Assets', 'Product List.xlsx');
const workbook = xlsx.readFile(excelFilePath);
const sheetName = workbook.SheetNames[0];

// Let's get raw rows
const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

console.log("Headers (Row 0):", rawData[0]);
console.log("Headers 2 (Row 1):", rawData[1]);
console.log("Row 2:", rawData[2]);
console.log("Row 3:", rawData[3]);
console.log("Row 4:", rawData[4]);
console.log("Row 5:", rawData[5]);
console.log("Row 6:", rawData[6]);
console.log("Row 7:", rawData[7]);
