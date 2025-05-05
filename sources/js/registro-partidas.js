const API_BASE_URL = 'https://phpstack-1076337-5399863.cloudwaysapps.com';
const API_TOKEN = 'fyWGkq96GJroFQBn07JGDJL2Qp7aoYVaqduQKOF5HGO97AdbGagdOeoynKyF';
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

document.addEventListener('DOMContentLoaded', () => {
    loadRecords();
    setInterval(loadRecords, REFRESH_INTERVAL);
});

// Función para cargar registros desde la API
async function loadRecords() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/classification/${API_TOKEN}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const apiData = await response.json();
        const records = processApiRecords(apiData);
        renderRecords(records);
    } catch (error) {
        console.error('Error cargando registros:', error);
        showError('Los crónicos de la oscuridad no pueden ser escuchados ahora...');
    }
}

// Procesar datos de la API y convertirlos a objetos simples
function processApiRecords(apiData) {
    let records = [];

    if (apiData.data && Array.isArray(apiData.data)) {
        records = apiData.data.map(item => ({
            name: item.name || "Jugador Anónimo",
            puntuacion: item.puntuacion || 0
        }));
    }

    // Si no hay registros, mostrar uno por defecto
    if (records.length === 0) {
        records = [{
            name: "Jugador Anónimo",
            puntuacion: 1000
        }];
    }

    return records;
}

// Renderizar registros en el DOM
function renderRecords(records) {
    const tbody = document.querySelector('.records-table tbody');
    tbody.innerHTML = '';

    records.forEach(record => {
        const tr = document.createElement('tr');
        tr.className = 'shadow-record';
        tr.innerHTML = `
            <td>${escapeHtml(record.name)}</td>
            <td>${escapeHtml(record.puntuacion.toString())}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Escapar HTML para prevenir XSS
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Mostrar mensaje de error
function showError(message) {
    alert(`Error: ${message}`);
}