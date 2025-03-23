document.addEventListener('DOMContentLoaded', () => {
    const spreadsheetDataUrl = 'https://script.google.com/macros/s/AKfycbxpWjhfwkDUWL_UGHSl0oSmb7C622EfZgg4C4-Ps2JhItM15URpSHG_jwM_NVVxlvVP9A/exec'; // <-- ¡REEMPLAZA ESTO CON TU URL DE APP SCRIPT!
    const searchInput = document.getElementById('searchInput');
    const dataTableBody = document.querySelector('#dataTable tbody');
    const dataTableHeaderRow = document.querySelector('#dataTable thead tr');
    const loadingMessage = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');
    let allData = []; // Almacenar todos los datos obtenidos para filtrar

    function fetchData() {
        loadingMessage.style.display = 'block';
        errorMessage.style.display = 'none';

        fetch(spreadsheetDataUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                loadingMessage.style.display = 'none';
                if (data.error) {
                    errorMessage.style.display = 'block';
                    errorMessage.textContent = `Error al cargar datos: ${data.error}`;
                } else if (data.data && data.headers) {
                    allData = data.data; // Guarda todos los datos
                    renderTableHeader(data.headers);
                    renderTableRows(data.data);
                } else {
                    errorMessage.style.display = 'block';
                    errorMessage.textContent = 'Formato de datos inválido recibido.';
                }
            })
            .catch(error => {
                loadingMessage.style.display = 'none';
                errorMessage.style.display = 'block';
                errorMessage.textContent = 'Error de red: ' + error.message;
                console.error('Error fetching data:', error);
            });
    }

    function renderTableHeader(headers) {
        dataTableHeaderRow.innerHTML = ''; // Limpiar encabezados previos
        headers.forEach(headerText => {
            const header = document.createElement('th');
            header.textContent = headerText;
            dataTableHeaderRow.appendChild(header);
        });
    }

    function renderTableRows(rowData) {
        dataTableBody.innerHTML = ''; // Limpiar filas previas
        if (rowData.length === 0) {
            const noDataRow = document.createElement('tr');
            const noDataCell = document.createElement('td');
            noDataCell.setAttribute('colspan', dataTableHeaderRow.cells.length); // Colspan para que ocupe todas las columnas
            noDataCell.textContent = 'No hay datos disponibles.';
            noDataRow.appendChild(noDataCell);
            dataTableBody.appendChild(noDataRow);
            return;
        }

        rowData.forEach(row => {
            const rowElement = document.createElement('tr');
            for (const key in row) {
                const cell = document.createElement('td');
                cell.textContent = row[key];
                rowElement.appendChild(cell);
            }
            dataTableBody.appendChild(rowElement);
        });
    }

    function filterTable(searchTerm) {
        const filteredData = allData.filter(row => {
            const searchableText = Object.values(row).join(' ').toLowerCase(); // Combina todos los valores de la fila en un string para buscar
            return searchableText.includes(searchTerm.toLowerCase());
        });
        renderTableRows(filteredData);
    }

    searchInput.addEventListener('input', (event) => {
        filterTable(event.target.value);
    });

    fetchData(); // Cargar datos al cargar la página
});
