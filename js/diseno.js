// Contenido que aparece en la ruleta de testimonios.
const testimonials = [
    {
        quote: 'El Instituto Huanta me dio una base sólida en diseño y programación web. La formación práctica me prepara para trabajar en la industria tecnológica.',
        name: 'Bruno Perez',
        role: 'Egresado de Diseño y Programación Web'
    },
    {
        quote: 'Estudiar en el Instituto Huanta ha sido una experiencia enriquecedora. Los profesores siempre están dispuestos a ayudarnos y el enfoque práctico me permite aplicar lo aprendido.',
        name: 'Roy Lamilla',
        role: 'Estudiante de Diseño y Programación Web'
    },
    {
        quote: 'Me encanta cómo el Instituto Huanta nos motiva a ser creativos mientras aprendemos a programar. Estoy emocionada por las oportunidades que esta carrera está abriendo para mí.',
        name: 'Denilson Atopillo',
        role: 'Estudiante de Diseño y Programación Web'
    }
];

const profileTabs = [...document.querySelectorAll('[data-tabs] .profile-tab')];
const profilePanels = [...document.querySelectorAll('[data-tabs] .profile-panel-content')];
profileTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        const selectedPanel = tab.dataset.tab;

        profileTabs.forEach((item) => {
            const isSelected = item === tab;
            item.classList.toggle('is-active', isSelected);
            item.setAttribute('aria-selected', String(isSelected));
        });

        profilePanels.forEach((panel) => {
            panel.hidden = panel.dataset.panel !== selectedPanel;
        });
    });
});

const skillButtons = [...document.querySelectorAll('[data-skill]')];
const skillPreview = document.querySelector('[data-skill-preview]');
const skillImage = document.querySelector('[data-skill-image]');
const skillTitle = document.querySelector('[data-skill-title]');
const skillDescription = document.querySelector('[data-skill-description]');

const skills = {
    creatividad: {
        title: 'Creatividad',
        description: 'Transformar ideas en interfaces y experiencias digitales originales, utiles y atractivas.',
        image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1000&q=85',
        alt: 'Bocetos de una interfaz digital creativa'
    },
    innovacion: {
        title: 'Innovacion',
        description: 'Probar nuevas herramientas y soluciones para mejorar la forma en que las personas usan la tecnologia.',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=85',
        alt: 'Estudiante trabajando en un proyecto de tecnologia'
    },
    equipo: {
        title: 'Trabajo en equipo',
        description: 'Colaborar, compartir ideas y organizar tareas para convertir un proyecto web en una solucion real.',
        image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85',
        alt: 'Equipo colaborando alrededor de una mesa'
    }
};

skillButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const skill = skills[button.dataset.skill];
        if (!skill) {
            return;
        }

        skillButtons.forEach((item) => item.classList.toggle('is-active', item === button));
        skillImage.src = skill.image;
        skillImage.alt = skill.alt;
        skillTitle.textContent = skill.title;
        skillDescription.textContent = skill.description;
        skillPreview.hidden = false;
        skillPreview.classList.remove('skill-preview-refresh');
        void skillPreview.offsetWidth;
        skillPreview.classList.add('skill-preview-refresh');
    });
});

const testimonialCards = [...document.querySelectorAll('.testimonial-card')];
const testimonialWindow = document.querySelector('.testimonial-window');
const dots = [...document.querySelectorAll('.roulette-dots button')];
let currentTestimonial = 0;
let rotationTimer;

// Reordena las tarjetas y destaca siempre el testimonio central.
const showTestimonial = (index, direction = 'next') => {
    currentTestimonial = (index + testimonials.length) % testimonials.length;
    testimonialWindow.dataset.direction = direction;

    testimonialCards.forEach((card, cardIndex) => {
        const offset = cardIndex - 1;
        const testimonialIndex = (currentTestimonial + offset + testimonials.length) % testimonials.length;
        const testimonial = testimonials[testimonialIndex];
        card.innerHTML = `<span class="quote-mark" aria-hidden="true">“</span><p>${testimonial.quote}</p><h3>${testimonial.name}</h3><span>${testimonial.role}</span>`;
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

// Reinicia el ciclo después de una selección manual o un gesto táctil.
const restartRotation = () => {
    window.clearInterval(rotationTimer);
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

const competencyTabs = [...document.querySelectorAll('.competency-tab')];
const competencyPanels = [...document.querySelectorAll('.competency-panel')];

const showCompetency = (tabIndex) => {
    competencyTabs.forEach((tab, index) => {
        const isActive = index === tabIndex;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
    });

    competencyPanels.forEach((panel, index) => {
        const isActive = index === tabIndex;
        panel.classList.toggle('is-active', isActive);
        panel.hidden = !isActive;
    });
};

competencyTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => showCompetency(index));
    tab.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
            return;
        }

        event.preventDefault();
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        const nextIndex = (index + direction + competencyTabs.length) % competencyTabs.length;
        competencyTabs[nextIndex].focus();
        showCompetency(nextIndex);
    });
});

const schedules = {
    I: [
        ['08:00 - 08:45', 'Redes e internet', 'Arquitectura de computadoras', 'Introducción de base de datos', 'Fundamentos de programación', 'Análisis y diseño de sistemas'],
        ['08:45 - 09:30', 'Redes e internet', 'Arquitectura de computadoras', 'Introducción de base de datos', 'Fundamentos de programación', 'Análisis y diseño de sistemas'],
        ['09:30 - 10:15', 'Redes e internet', 'Arquitectura de computadoras', 'Introducción de base de datos', 'Fundamentos de programación', 'Análisis y diseño de sistemas'],
        ['10:45 - 11:30', 'Análisis y diseño de sistemas', 'Comunicación oral', 'Introducción de base de datos', 'Fundamentos de programación', 'Aplicaciones en internet'],
        ['11:30 - 12:15', 'Análisis y diseño de sistemas', 'Comunicación oral', 'Redes e internet', 'Fundamentos de programación', 'Aplicaciones en internet']
    ],
    III: [
        ['08:00 - 08:45', 'Diseño de interfaces web', 'Pruebas de software', 'Administración de base de datos', 'Diseño de interfaces web', 'Programación de aplicaciones web'],
        ['08:45 - 09:30', 'Diseño de interfaces web', 'Pruebas de software', 'Administración de base de datos', 'Diseño de interfaces web', 'Programación de aplicaciones web'],
        ['09:30 - 10:15', 'Administración de base de datos', 'Pruebas de software', 'Administración de base de datos', 'Diseño de interfaces web', 'Programación de aplicaciones web'],
        ['10:45 - 11:30', 'Administración de base de datos', 'Diseño de interfaces web', 'Administración de base de datos', 'Inglés para la comunicación oral', 'Programación de aplicaciones web'],
        ['11:30 - 12:15', 'Programación de aplicaciones web', 'Diseño de interfaces web', 'Administración de base de datos', 'Inglés para la comunicación oral', 'Programación de aplicaciones web']
    ],
    V: [
        ['08:00 - 08:45', 'Oportunidades de negocios', 'Programación de aplicaciones móviles', 'Diagramación digital', 'Diagramación digital', 'Programación de aplicaciones móviles'],
        ['08:45 - 09:30', 'Oportunidades de negocios', 'Programación de aplicaciones móviles', 'Diagramación digital', 'Diagramación digital', 'Programación de aplicaciones móviles'],
        ['09:30 - 10:15', 'Oportunidades de negocios', 'Marketing digital', 'Diagramación digital', 'Diseño de soluciones web', 'Programación de aplicaciones móviles'],
        ['10:45 - 11:30', 'Gestión y administración de sitios web', 'Marketing digital', 'Solución de problemas', 'Diseño de soluciones web', 'Programación de aplicaciones móviles'],
        ['11:30 - 12:15', 'Gestión y administración de sitios web', 'Marketing digital', 'Solución de problemas', 'Diseño de soluciones web', 'Programación de aplicaciones móviles']
    ]
};

const scheduleModal = document.querySelector('[data-schedule-modal]');
const scheduleBody = document.querySelector('[data-schedule-body]');
const scheduleOpen = document.querySelector('[data-schedule-open]');
const scheduleClose = document.querySelector('[data-schedule-close]');
const scheduleTabs = [...document.querySelectorAll('[data-schedule-tab]')];
const quickInfoModal = document.getElementById('quickInfoModal');
const quickInfoClose = document.querySelector('.quick-info-close');
const quickOpenButton = document.querySelector('[data-quick-open]');

const renderSchedule = (semester) => {
    scheduleBody.innerHTML = schedules[semester].map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('');
    scheduleTabs.forEach((tab) => {
        const active = tab.dataset.scheduleTab === semester;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
    });
};

scheduleOpen.addEventListener('click', () => {
    scheduleModal.hidden = false;
    document.body.classList.add('modal-open');
    renderSchedule('I');
});

scheduleClose.addEventListener('click', () => {
    scheduleModal.hidden = true;
    document.body.classList.remove('modal-open');
});

scheduleTabs.forEach((tab) => tab.addEventListener('click', () => renderSchedule(tab.dataset.scheduleTab)));

const openQuickInfo = () => {
    if (quickInfoModal) {
        quickInfoModal.hidden = false;
        document.body.classList.add('modal-open');
    }
};

const closeQuickInfo = () => {
    if (quickInfoModal) {
        quickInfoModal.hidden = true;
        document.body.classList.remove('modal-open');
    }
};

quickInfoClose?.addEventListener('click', closeQuickInfo);
quickOpenButton?.addEventListener('click', openQuickInfo);
quickInfoModal?.addEventListener('click', (event) => {
    if (event.target === quickInfoModal) {
        closeQuickInfo();
    }
});

document.addEventListener('keydown', (event) => {
    const isTypingTarget = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName || '');

    if (event.key.toLowerCase() === 'q' && !isTypingTarget) {
        event.preventDefault();
        openQuickInfo();
    }

    if (event.key === 'Escape') {
        closeQuickInfo();
        if (scheduleModal && !scheduleModal.hidden) {
            scheduleModal.hidden = true;
        }
    }
});