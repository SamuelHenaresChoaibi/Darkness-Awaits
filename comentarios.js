const API_BASE_URL = 'https://phpstack-1076337-5399863.cloudwaysapps.com';
const API_TOKEN = 'fyWGkq96GJroFQBn07JGDJL2Qp7aoYVaqduQKOF5HGO97AdbGagdOeoynKyF';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadComments();
        const form = document.getElementById('formularioComentario');
        if (form) {
            form.addEventListener('submit', handleCommentSubmit);
        }
    } catch (error) {
        console.error('Error inicializando:', error);
        showError('La oscuridad interrumpe la conexión...');
    }
});

// Función para cargar comentarios desde la API
async function loadComments() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/comments/${API_TOKEN}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const apiData = await response.json();
        const comments = processApiComments(apiData);
        renderComments(comments);
    } catch (error) {
        console.error('Error cargando comentarios:', error);
        showError('Los susurros no pueden ser escuchados ahora...');
    }
}

// Procesar datos de la API y convertirlos a objetos simples
function processApiComments(apiData) {
    let comments = [];

    if (apiData.data) {
        if (Array.isArray(apiData.data)) {
            comments = apiData.data.map(item => ({
                name: item.name || "Anónimo",
                content: item.content || "Susurro indescifrable"
            }));
        } else if (typeof apiData.data === 'object') {
            comments = [{
                name: apiData.data.name || "Anónimo",
                content: apiData.data.content || "Susurro indescifrable"
            }];
        }
    }

    // Si no hay comentarios, mostrar uno por defecto
    if (comments.length === 0) {
        comments = [{
            name: "Susurrante Anónimo",
            content: "Un eco desde el abismo..."
        }];
    }

    return comments;
}

// Renderizar comentarios en el DOM
function renderComments(comments) {
    const container = document.getElementById('comentariosLista');
    container.innerHTML = '';

    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'shadow-comment';
        commentElement.innerHTML = `
            <h4 class="comment-author">${escapeHtml(comment.name)}</h4>
            <p class="comment-text">${escapeHtml(comment.content)}</p>
            <p class="comment-signature">Invocado en la oscuridad</p>
        `;
        container.appendChild(commentElement);
    });
}

// Manejar envío de nuevo comentario
async function handleCommentSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const name = formData.get('nombre') || "Anónimo";
    const content = formData.get('comentario');

    if (!content) {
        showError('¡El susurro no puede estar vacío!');
        return;
    }

    try {
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando a las sombras...';

        const newComment = {
            api_token: API_TOKEN,
            name: name,
            content: content
        };
        const response = await postComment(newComment);

        await loadComments();
        form.reset();
    } catch (error) {
        console.error('Error enviando comentario:', error);
        showError('El susurro se perdió en el vacío...');
    } finally {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Invocar Susurro';
        }
    }
}

// Función para enviar comentario a la API
async function postComment(comment) {
    const response = await fetch(`${API_BASE_URL}/api/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(comment)
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