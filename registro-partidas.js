const API_BASE_URL = 'https://phpstack-1076337-5399863.cloudwaysapps.com';
const API_TOKEN = 'fyWGkq96GJroFQBn07JGDJL2Qp7aoYVaqduQKOF5HGO97AdbGagdOeoynKyF';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadRecords();
        const form = document.getElementById('registroForm');
        if (form) {
            form.addEventListener('submit', handleRecordSubmit);
        }
    } catch (error) {
        console.error('Error inicializando:', error);
        showError('La oscuridad interrumpe la conexión...');
    }
});

// Función para cargar registros desde la API
async function loadRecords() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/classifications/${API_TOKEN}`, {
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

    if (apiData.start) {
        if (Array.isArray(apiData.start)) {
            records = apiData.start.map(item => ({
                name: item.name || "Jugador Anónimo",
                puntuacion: item.puntuacion || 0,
                nivel: item.nivel || 0
            }));
        } else if (typeof apiData.start === 'object') {
            records = [{
                name: apiData.start.name || "Jugador Anónimo",
                puntuacion: apiData.start.puntuacion || 0,
                nivel: apiData.start.nivel || 0
            }];
        }
    }

    // Si no hay registros, mostrar uno por defecto
    if (records.length === 0) {
        records = [{
            name: "Jugador Anónimo",
            puntuacion: 1000,
            nivel: 5
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
        const date = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
        tr.innerHTML = `
            <td>${escapeHtml(record.name)}</td>
            <td>${escapeHtml(record.puntuacion.toString())}</td>
            <td>${escapeHtml(record.nivel.toString())}</td>
            <td>${date}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Manejar envío de nuevo registro
async function handleRecordSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const name = formData.get('jugador') || "Jugador Anónimo";
    const score = parseInt(formData.get('puntuacion')) || 0;
    const level = parseInt(formData.get('nivel')) || 0;

    if (score <= 0 || level <= 0) {
        showError('La puntuación y el nivel deben ser mayores a 0.');
        return;
    }

    try {
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Inscribiendo en las sombras...';

        const newRecord = {
            api_token: API_TOKEN,
            name: name,
            puntuacion: score,
            nivel: level
        };
        await postRecord(newRecord);
        showSuccess('Registro inscrito con éxito en el altar.');

        await loadRecords();
        form.reset();
    } catch (error) {
        console.error('Error enviando registro:', error);
        showError('El registro se perdió en el vacío...');
    } finally {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Inscribir en el Altar';
        }
    }
}

// Función para enviar registro a la API
async function postRecord(record) {
    const response = await fetch(`${API_BASE_URL}/api/classifications`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(record)
    });

    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
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

// Mostrar mensaje de éxito
function showSuccess(message) {
    alert(`Éxito: ${message}`);
}