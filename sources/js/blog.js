import { ApiToken, PostsGet } from './modelos.js';

const API_BASE_URL = 'https://phpstack-1076337-5399863.cloudwaysapps.com';
const API_TOKEN = new ApiToken('pHJNhm719MN5LCVqE839lOse0qvlbL1lBXndZmAWoJfiPXZFQHmgNQrzUHYS');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadPosts();
    } catch (error) {
        console.error('Error inicializando:', error);
        showError('La oscuridad interrumpe la conexión...');
    }
});

// Función para cargar publicaciones desde la API
async function loadPosts() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/posts/${API_TOKEN.token}`);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const apiData = await response.json();
        const posts = processApiPosts(apiData);
        renderPosts(posts);

    } catch (error) {
        console.error('Error cargando publicaciones:', error);
        showError('Los ecos del blog no pueden ser escuchados ahora...');
    }
}

// Procesar datos de la API y convertirlos a objetos PostsGet
function processApiPosts(apiData) {
    let posts = [];

    if (apiData.start) {
        if (Array.isArray(apiData.start)) {
            posts = apiData.start.map(item => new PostsGet(
                item.title || "Título desconocido",
                item.content || "Contenido no disponible"
            ));
        } else if (typeof apiData.start === 'object') {
            posts = [new PostsGet(
                apiData.start.title || "Título desconocido",
                apiData.start.content || "Contenido no disponible"
            )];
        }
    }

    // Si no hay publicaciones, mostrar una por defecto
    if (posts.length === 0) {
        posts = [new PostsGet(
            "Eco de la Oscuridad",
            "Un susurro perdido en el blog..."
        )];
    }

    return posts;
}

// Renderizar publicaciones en el DOM
function renderPosts(posts) {
    const container = document.getElementById('posts-container');
    container.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('article');
        postElement.className = 'post-card';
        postElement.innerHTML = `
            <h3>${escapeHtml(post.data.title)}</h3>
            <p>${escapeHtml(post.data.content)}</p>
            <a href="#" class="read-more">Leer más</a>
        `;
        container.appendChild(postElement);
    });
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