document.addEventListener('DOMContentLoaded', function() {
    // Linterna Effect
    document.addEventListener("mousemove", (e) => {
        const linterna = document.getElementById("linterna");
        linterna.style.top = `${e.clientY}px`;
        linterna.style.left = `${e.clientX}px`;
    });

    // Mute Button
    const audio = document.getElementById("background-music");
    const muteButton = document.getElementById("mute-button");
    
    // Try to autoplay music (may be blocked by browser)
    audio.volume = 0.3; // Set lower volume
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            // Auto-play was prevented, show muted button
            audio.muted = true;
            muteButton.textContent = " 🔇 ";
        });
    }

    muteButton.addEventListener("click", () => {
        if (audio.muted) {
            audio.muted = false;
            muteButton.textContent = " 🔊 ";
        } else {
            audio.muted = true;
            muteButton.textContent = " 🔇 ";
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animate elements when they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .testimonial-card, .gallery-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Set initial state for animated elements
    document.querySelectorAll('.feature-card, .testimonial-card, .gallery-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Run once on load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Pulse animation for download buttons
    setInterval(() => {
        const downloadBtns = document.querySelectorAll('.download-btn');
        downloadBtns.forEach(btn => {
            btn.style.animation = 'pulse 2s infinite';
        });
    }, 3000);
});