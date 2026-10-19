const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobileNavToggle = document.querySelector('[data-mobile-nav-toggle]');
const siteNavigation = document.querySelector('#site-navigation');
const mobileNavLabel = document.querySelector('[data-menu-label]');

const setMobileNavigation = (isOpen) => {
    mobileNavToggle?.setAttribute('aria-expanded', String(isOpen));
    mobileNavToggle?.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    mobileNavLabel?.replaceChildren(document.createTextNode(isOpen ? 'Cerrar' : 'Menú'));
    siteNavigation?.classList.toggle('is-open', isOpen);
};

mobileNavToggle?.addEventListener('click', () => {
    setMobileNavigation(mobileNavToggle.getAttribute('aria-expanded') !== 'true');
});

siteNavigation?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMobileNavigation(false));
});

const revealTargets = [...document.querySelectorAll('.program-detail, .graduate-profile-visual, .graduate-profile-heading, .profile-tabs, .future-copy, .study-heading, .profile-card, .semester-plan, .testimonials-heading, .testimonial-roulette')];

if (prefersReducedMotion || document.hidden || !('IntersectionObserver' in window)) {
    revealTargets.forEach((target) => target.classList.add('page-reveal-visible'));
} else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('page-reveal-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.14, rootMargin: '0px 0px -4% 0px' });

    revealTargets.forEach((target, index) => {
        target.classList.add('page-reveal');
        target.style.setProperty('--reveal-delay', `${(index % 4) * 65}ms`);
        revealObserver.observe(target);
    });
}

const profileTabs = [...document.querySelectorAll('[data-tabs] .profile-tab')];
const profilePanels = [...document.querySelectorAll('[data-tabs] .profile-panel-content')];

profileTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        profileTabs.forEach((item) => {
            const isSelected = item === tab;
            item.classList.toggle('is-active', isSelected);
            item.setAttribute('aria-selected', String(isSelected));
        });

        profilePanels.forEach((panel) => {
            panel.hidden = panel.dataset.panel !== tab.dataset.tab;
        });
    });
});

const testimonials = [
    {
        quote: 'La formación en Producción Agropecuaria me permitió aprender haciendo, conocer de cerca los cultivos y aplicar técnicas que ayudan a mejorar el trabajo en el campo.',
        name: 'José Luis Castro',
        role: 'Estudiante de Producción Agropecuaria'
    },
    {
        quote: 'En el programa he fortalecido mis conocimientos sobre producción agrícola y pecuaria. Las prácticas me motivan a seguir aprendiendo y aportar al desarrollo de mi comunidad.',
        name: 'Darwin Mendez',
        role: 'Estudiante de Producción Agropecuaria'
    },
    {
        quote: 'La carrera brinda herramientas para trabajar de manera responsable en el campo. Me gusta aprender sobre el manejo de los cultivos y cómo lograr una producción sostenible.',
        name: 'Ronald Guzman',
        role: 'Estudiante de Producción Agropecuaria'
    }
];

const testimonialCards = [...document.querySelectorAll('.testimonial-card')];
const testimonialWindow = document.querySelector('.testimonial-window');
const dots = [...document.querySelectorAll('.roulette-dots button')];
let currentTestimonial = 0;
let rotationTimer;

const showTestimonial = (index, direction = 'next') => {
    currentTestimonial = (index + testimonials.length) % testimonials.length;
    testimonialWindow.dataset.direction = direction;

    testimonialCards.forEach((card, cardIndex) => {
        const offset = cardIndex - 1;
        const testimonialIndex = (currentTestimonial + offset + testimonials.length) % testimonials.length;
        const testimonial = testimonials[testimonialIndex];
        const quoteMark = document.createElement('span');
        const quote = document.createElement('p');
        const name = document.createElement('h3');
        const role = document.createElement('span');

        quoteMark.className = 'quote-mark';
        quoteMark.setAttribute('aria-hidden', 'true');
        quoteMark.textContent = '“';
        quote.textContent = testimonial.quote;
        name.textContent = testimonial.name;
        role.textContent = testimonial.role;
        card.replaceChildren(quoteMark, quote, name, role);
        card.classList.toggle('is-active', offset === 0);
        card.classList.toggle('is-left', offset === -1);
        card.classList.toggle('is-right', offset === 1);
    });

    dots.forEach((dot, dotIndex) => {
        const isSelected = dotIndex === currentTestimonial;
        dot.classList.toggle('is-active', isSelected);
        dot.setAttribute('aria-selected', String(isSelected));
    });
};

const restartRotation = () => {
    window.clearInterval(rotationTimer);
    if (prefersReducedMotion || document.hidden) {
        return;
    }
    rotationTimer = window.setInterval(() => showTestimonial(currentTestimonial + 1), 5000);
};

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showTestimonial(index, index < currentTestimonial ? 'prev' : 'next');
        restartRotation();
    });
});

let touchStartX = 0;

testimonialWindow.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

testimonialWindow.addEventListener('touchend', (event) => {
    const distance = event.changedTouches[0].screenX - touchStartX;
    if (Math.abs(distance) < 45) {
        return;
    }
    showTestimonial(currentTestimonial + (distance < 0 ? 1 : -1), distance < 0 ? 'next' : 'prev');
    restartRotation();
}, { passive: true });

showTestimonial(0);
restartRotation();
testimonialWindow.addEventListener('pointerenter', () => window.clearInterval(rotationTimer));
testimonialWindow.addEventListener('pointerleave', restartRotation);
testimonialWindow.addEventListener('focusin', () => window.clearInterval(rotationTimer));
testimonialWindow.addEventListener('focusout', (event) => {
    if (!testimonialWindow.contains(event.relatedTarget)) {
        restartRotation();
    }
});

const scheduleModal = document.querySelector('[data-schedule-modal]');
const scheduleOpen = document.querySelector('[data-schedule-open]');
const scheduleClose = document.querySelector('[data-schedule-close]');
const quickInfoModal = document.getElementById('quickInfoModal');
const quickInfoClose = document.querySelector('.quick-info-close');
const quickOpenButton = document.querySelector('[data-quick-open]');

const openModal = (modal) => {
    if (modal) {
        modal.hidden = false;
        document.body.classList.add('modal-open');
    }
};

const closeModal = (modal) => {
    if (modal) {
        modal.hidden = true;
        document.body.classList.remove('modal-open');
    }
};

scheduleOpen?.addEventListener('click', () => openModal(scheduleModal));
scheduleClose?.addEventListener('click', () => closeModal(scheduleModal));
quickOpenButton?.addEventListener('click', () => openModal(quickInfoModal));
quickInfoClose?.addEventListener('click', () => closeModal(quickInfoModal));

[scheduleModal, quickInfoModal].forEach((modal) => {
    modal?.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal(modal);
        }
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        setMobileNavigation(false);
        closeModal(scheduleModal);
        closeModal(quickInfoModal);
    }

    const isTypingTarget = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName || '');
    if (event.key.toLowerCase() === 'q' && !isTypingTarget) {
        event.preventDefault();
        openModal(quickInfoModal);
    }
});
