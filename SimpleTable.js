const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const CSV_FILE = 'FNO.csv';
const OUTPUT_FILE = 'index.html';

// Function to generate HTML table
const generateTableHTML = (callback) => {
    let rows = [];
    let headers = [];

    fs.createReadStream(CSV_FILE)
        .pipe(csv())
        .on('headers', (headerList) => {
            headers = headerList;
        })
        .on('data', (row) => {
            rows.push(row);
        })
        .on('end', () => {
            let table = '<table border="1" style="border-collapse: collapse; width: 100%;">';
            table += '<thead><tr>';
            headers.forEach((header, index) => {
                table += `<th onclick="sortTable(${index})" style="cursor: pointer; background: #f2f2f2;">${header} ⬍</th>`;
            });
            table += '</tr></thead><tbody>';
            rows.forEach(row => {
                table += '<tr>';
                headers.forEach(header => {
                    table += `<td>${row[header]}</td>`;
                });
                table += '</tr>';
            });
            table += '</tbody></table>';

            // HTML file content
            const htmlContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>CSV Table</title>
                    <script>
                        function sortTable(columnIndex) {
                            const table = document.querySelector("table tbody");
                            const rows = Array.from(table.rows);
                            const isAscending = table.getAttribute("data-sort") !== "asc";

                            rows.sort((rowA, rowB) => {
                                const cellA = rowA.cells[columnIndex].innerText.trim();
                                const cellB = rowB.cells[columnIndex].innerText.trim();
                                const isNumeric = !isNaN(cellA) && !isNaN(cellB);
                                return isAscending
                                    ? (isNumeric ? cellA - cellB : cellA.localeCompare(cellB))
                                    : (isNumeric ? cellB - cellA : cellB.localeCompare(cellA));
                            });

                            table.innerHTML = "";
                            rows.forEach(row => table.appendChild(row));
                            table.setAttribute("data-sort", isAscending ? "asc" : "desc");
                        }
                    </script>
                </head>
                <body style="font-family: Arial, sans-serif; text-align: center;">
                    <h2>CSV Data Table (Sortable)</h2>
                    ${table}
                </body>
                </html>
            `;

            // Write to index.html
            fs.writeFileSync(OUTPUT_FILE, htmlContent);
            console.log(`Generated ${OUTPUT_FILE}. Ready to deploy!`);
        });
};

// Run the function
generateTableHTML();
