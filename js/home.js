const pageSections = [...document.querySelectorAll('main section[id]')];
const navigationLinks = [...document.querySelectorAll('.nav-links a')];
const animatedSections = [...document.querySelectorAll('main section:not(#hero), .gallery-tile')];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const interactiveCards = [...document.querySelectorAll('.cards-section article, .split-section article, .gallery-tile')];
const programsToggle = document.querySelector('.nav-programs-toggle');
const programsMenu = document.querySelector('#programs-menu');

if (programsToggle && programsMenu) {
    programsToggle.addEventListener('click', () => {
        const isOpen = programsToggle.getAttribute('aria-expanded') === 'true';
        programsToggle.setAttribute('aria-expanded', String(!isOpen));
        programsMenu.hidden = isOpen;
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.nav-programs')) {
            programsToggle.setAttribute('aria-expanded', 'false');
            programsMenu.hidden = true;
        }
    });
}

document.documentElement.classList.add('js');

interactiveCards.forEach((card) => {
    card.classList.add('interactive-card');
    card.tabIndex = 0;

    if (prefersReducedMotion) {
        return;
    }

    card.addEventListener('pointermove', (event) => {
        const bounds = card.getBoundingClientRect();
        const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 6;
        const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -6;

        card.style.setProperty('--rotate-x', `${rotateX}deg`);
        card.style.setProperty('--rotate-y', `${rotateY}deg`);
    });

    card.addEventListener('pointerleave', () => {
        card.style.removeProperty('--rotate-x');
        card.style.removeProperty('--rotate-y');
    });
});

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12 });

    animatedSections.forEach((section) => {
        section.classList.add('reveal');
        revealObserver.observe(section);
    });
} else {
    animatedSections.forEach((section) => section.classList.add('is-visible'));
}

const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
    header.classList.toggle('is-scrolled', window.scrollY > 32);
}, { passive: true });

if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            navigationLinks.forEach((link) => {
                link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
            });
        });
    }, { rootMargin: '-35% 0px -55% 0px' });

    pageSections.forEach((section) => sectionObserver.observe(section));
}

const stats = [...document.querySelectorAll('.stats-section h3')];

stats.forEach((stat) => {
    const target = Number.parseInt(stat.textContent, 10);

    if (Number.isNaN(target)) {
        return;
    }

    stat.dataset.target = target;
    stat.textContent = prefersReducedMotion ? `${target}+` : '0+';
});

const statsSection = document.querySelector('.stats-section');

if (statsSection && !prefersReducedMotion && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
        if (!entries[0].isIntersecting) {
            return;
        }

        stats.forEach((stat) => {
            const target = Number(stat.dataset.target);
            const start = performance.now();

            const update = (now) => {
                const progress = Math.min((now - start) / 1100, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                stat.textContent = `${Math.floor(target * eased)}+`;

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            };

            requestAnimationFrame(update);
        });

        observer.disconnect();
    }, { threshold: 0.35 });

    statsObserver.observe(statsSection);
}

const contactForm = document.querySelector('.contact-section form');

contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    contactForm.classList.add('is-sent');
    contactForm.querySelector('button').innerHTML = 'Consulta enviada <span aria-hidden="true">&#10003;</span>';
});