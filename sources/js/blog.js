const API_BASE_URL = 'https://phpstack-1076337-5399863.cloudwaysapps.com';
const API_TOKEN = 'fyWGkq96GJroFQBn07JGDJL2Qp7aoYVaqduQKOF5HGO97AdbGagdOeoynKyF';

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
        const response = await fetch(`${API_BASE_URL}/api/posts/${API_TOKEN}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

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

// Procesar datos de la API y convertirlos a objetos simples
function processApiPosts(apiData) {
    let posts = [];

    if (apiData.data && Array.isArray(apiData.data)) {
        posts = apiData.data.map(item => ({
            title: item.title || "Sin notícias",
            content: item.content || "Aún no hay ninguna noticia"
        }));
    }

    // Si no hay registros, mostrar uno por defecto
    if (posts.length === 0) {
        posts = [{
            title: "Sin notícias",
            content: "Aún no hay ninguna noticia o actualización disponible."
        }];
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
            <h3>${escapeHtml(post.title)}</h3>
            <div>${parseHtmlContent(post.content)}</div>
            <a href="#" class="read-more">Leer más</a>
        `;
        container.appendChild(postElement);
    });
}

// Parse HTML content safely
function parseHtmlContent(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.innerHTML;
}

// Escapar HTML para prevenir XSS in titles
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