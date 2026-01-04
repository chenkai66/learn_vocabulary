const XLSX = require('xlsx');
const themes = require('./themes_data.js');

// Create a workbook and add a worksheet
const workbook = XLSX.utils.book_new();
const worksheet = XLSX.utils.json_to_sheet(themes.map(theme => ({ Theme: theme })));

// Add the worksheet to the workbook
XLSX.utils.book_append_sheet(workbook, worksheet, 'Themes');

// Write the workbook to a file
XLSX.writeFile(workbook, 'vocabulary_themes.xlsx');

console.log('Excel file "vocabulary_themes.xlsx" has been generated with', themes.length, 'themes.');