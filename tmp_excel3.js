const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const excelFilePath = path.join('c:\\Users\\JohnR\\Projects\\El Health and Wellness\\Assets', 'Product List.xlsx');
const workbook = xlsx.readFile(excelFilePath);
const sheetName = workbook.SheetNames[0];

const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

fs.writeFileSync('c:\\Users\\JohnR\\Projects\\El Health and Wellness\\tmp_dump.json', JSON.stringify(rawData.slice(0, 15), null, 2));
