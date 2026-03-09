const xlsx = require('xlsx');
const path = require('path');

const excelFilePath = path.join('c:\\Users\\JohnR\\Projects\\El Health and Wellness\\Assets', 'Product List.xlsx');
const workbook = xlsx.readFile(excelFilePath);
const sheetName = workbook.SheetNames[0];
const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

for (let i = 0; i < 40; i++) {
  console.log(`Row ${i}:`, JSON.stringify(rawData[i]));
}
