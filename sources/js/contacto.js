const API_BASE_URL = 'https://phpstack-1076337-5399863.cloudwaysapps.com';
const API_TOKEN = 'fyWGkq96GJroFQBn07JGDJL2Qp7aoYVaqduQKOF5HGO97AdbGagdOeoynKyF';

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('form-contact');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
});

async function handleContactSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const nombre = formData.get('nom');
    const email = formData.get('correu');
    const asunto = formData.get('asunto');
    const mensaje = formData.get('comentari');
    
    if (!nombre || !email || !mensaje) {
        showError('Por favor, completa todos los campos del formulario');
        return;
    }
    
    if (!validateEmail(email)) {
        showError('Por favor, introduce un email válido');
        return;
    }
    
    const contactData = {
        api_token: API_TOKEN,
        nombre: nombre,
        email: email,
        asunto: asunto,
        mensaje: mensaje
    };
    
    try {
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="btn-text">Enviando...</span><span class="pentagram"></span>';
        
        const response = await sendContactToApi(contactData);
        
        form.reset();
        
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        showError('Error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.');
    } finally {
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span class="btn-text">Invocar Respuesta</span><span class="pentagram"></span>';
    }
}

async function sendContactToApi(contactData) {
    const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData)
    });
    
    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }
    
    return await response.json();
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(message) {
    alert(`Error: ${message}`);
}

function showSuccess(message) {
    alert(`Éxito: ${message}`);
}