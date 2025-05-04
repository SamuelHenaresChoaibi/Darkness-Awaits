import { ApiToken, ClasificacionGet, ClasificacionPost } from './modelos.js';

const API_BASE_URL = 'https://phpstack-1076337-5399863.cloudwaysapps.com/';
const API_TOKEN = new ApiToken('pHJNhm719MN5LCVqE839lOse0qvlbL1lBXndZmAWoJfiPXZFQHmgNQrzUHYS');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadRecords();
        const form = document.getElementById('registroForm');
        form.addEventListener('submit', handleRecordSubmit);
    } catch (error) {
        console.error('Error inicializando:', error);
        showError('La oscuridad interrumpe la conexión...');
    }
});

// Función para cargar registros desde la API
async function loadRecords() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/classifications/${API_TOKEN.token}`);

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

// Procesar datos de la API y convertirlos a objetos ClasificacionGet
function processApiRecords(apiData) {
    let records = [];

    if (apiData.start) {
        if (Array.isArray(apiData.start)) {
            records = apiData.start.map(item => new ClasificacionGet(
                item.name || "Jugador Anónimo",
                item.puntuacion || 0,
                item.nivel || 0
            ));
        } else if (typeof apiData.start === 'object') {
            records = [new ClasificacionGet(
                apiData.start.name || "Jugador Anónimo",
                apiData.start.puntuacion || 0,
                apiData.start.nivel || 0
            )];
        }
    }

    // Si no hay registros, mostrar uno por defecto
    if (records.length === 0) {
        records = [new ClasificacionGet(
            "Jugador Anónimo",
            1000,
            5
        )];
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
            <td>${escapeHtml(record.data.name)}</td>
            <td>${escapeHtml(record.data.puntuacion.toString())}</td>
            <td>${escapeHtml(record.data.nivel.toString())}</td>
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

        const newRecord = new ClasificacionPost(API_TOKEN.token, name, score, level);
        await postRecord(newRecord);
        showSuccess(newRecord.getSuccess());

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
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            api_token: record.api_token,
            name: record.name,
            puntuacion: record.puntuacion,
            nivel: record.nivel
        })
    });

    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
}

// Funciones auxiliares
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function showError(message) {
    alert(`Error: ${message}`);
}

function showSuccess(message) {
    alert(`Éxito: ${message}`);
}