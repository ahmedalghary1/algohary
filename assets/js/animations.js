/*
 * ELITE PORTFOLIO - ANIMATIONS
 * Hero Background Effects & Custom Animations
 */

'use strict';

// ========================================
// HERO PARTICLE SYSTEM
// ========================================
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 240, 255, ${particle.opacity})`;
            this.ctx.fill();

            // Draw connections
            this.particles.slice(index + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(0, 240, 255, ${0.1 * (1 - distance / 150)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        new ParticleSystem(canvas);
    }
});

// ========================================
// MOUSE PARALLAX EFFECT (Hero Section)
// ========================================
const hero = document.querySelector('.hero');
const heroMesh = document.querySelector('.hero-mesh');

if (hero && heroMesh) {
    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        const xPercent = (clientX / innerWidth - 0.5) * 2;
        const yPercent = (clientY / innerHeight - 0.5) * 2;

        heroMesh.style.transform = `translate(${xPercent * 20}px, ${yPercent * 20}px)`;
    });
}

// ========================================
// TYPING EFFECT (Optional for Hero Subtitle)
// ========================================
class TypeWriter {
    constructor(element, words, wait = 3000) {
        this.element = element;
        this.words = words;
        this.text = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullText = this.words[current];

        if (this.isDeleting) {
            this.text = fullText.substring(0, this.text.length - 1);
        } else {
            this.text = fullText.substring(0, this.text.length + 1);
        }

        this.element.textContent = this.text;

        let typeSpeed = 150;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.text === fullText) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.text === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Optional: Uncomment to enable typing effect
// document.addEventListener('DOMContentLoaded', () => {
//   const typeElement = document.querySelector('.type-effect');
//   if (typeElement) {
//     const words = typeElement.dataset.words.split(',');
//     new TypeWriter(typeElement, words, 2000);
//   }
// });

// ========================================
// BUTTON RIPPLE EFFECT
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn-ripple');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: translate(-50%, -50%);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `;

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// ========================================
// TILT EFFECT FOR CARDS (Optional)
// ========================================
class TiltEffect {
    constructor(element, settings = {}) {
        this.element = element;
        this.settings = {
            maxTilt: settings.maxTilt || 10,
            perspective: settings.perspective || 1000,
            scale: settings.scale || 1.05,
            speed: settings.speed || 400,
            ...settings
        };

        this.element.style.transformStyle = 'preserve-3d';
        this.element.style.transition = `transform ${this.settings.speed}ms ease-out`;

        this.init();
    }

    init() {
        this.element.addEventListener('mouseenter', () => {
            this.element.style.willChange = 'transform';
        });

        this.element.addEventListener('mousemove', (e) => this.handleMove(e));

        this.element.addEventListener('mouseleave', () => {
            this.element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
            this.element.style.willChange = 'auto';
        });
    }

    handleMove(e) {
        const rect = this.element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * this.settings.maxTilt;
        const rotateY = ((centerX - x) / centerX) * this.settings.maxTilt;

        this.element.style.transform = `
      perspective(${this.settings.perspective}px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(${this.settings.scale})
    `;
    }
}

// Optional: Uncomment to enable tilt effect on project cards
// document.addEventListener('DOMContentLoaded', () => {
//   const tiltCards = document.querySelectorAll('.project-card');
//   tiltCards.forEach(card => new TiltEffect(card, { maxTilt: 5, scale: 1.02 }));
// });

console.log('🎨 Animation System Loaded');
