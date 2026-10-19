const pageSections = [...document.querySelectorAll('main section[id]')];
const navigationLinks = [...document.querySelectorAll('.nav-links a')];
const animatedSections = [...document.querySelectorAll('main section:not(#hero), .gallery-tile')];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const interactiveCards = [...document.querySelectorAll('.cards-section article, [data-tilt]')];

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

const heroShowcase = document.querySelector('[data-hero-showcase]');
const heroImage = heroShowcase?.querySelector('[data-hero-image]');
const heroCategory = heroShowcase?.querySelector('[data-hero-category]');
const heroTitle = heroShowcase?.querySelector('[data-hero-title]');
const heroSlideLinks = [...document.querySelectorAll('[data-hero-slide]')];

const showHeroSlide = (slide) => {
    if (!heroImage || !heroCategory || !heroTitle) {
        return;
    }

    heroImage.src = slide.dataset.image;
    heroImage.alt = slide.dataset.alt;
    heroCategory.textContent = slide.dataset.category;
    heroTitle.textContent = slide.dataset.title;
    if (!prefersReducedMotion) {
        heroImage.classList.remove('is-changing');
        requestAnimationFrame(() => heroImage.classList.add('is-changing'));
        window.setTimeout(() => heroImage.classList.remove('is-changing'), 500);
    }
};

heroSlideLinks.forEach((link) => {
    link.addEventListener('pointerenter', () => showHeroSlide(link));
    link.addEventListener('focus', () => showHeroSlide(link));
});

const programFilters = [...document.querySelectorAll('[data-program-filter]')];
const programCards = [...document.querySelectorAll('[data-program-card]')];
const programCount = document.querySelector('[data-program-count]');

programFilters.forEach((filter) => {
    filter.addEventListener('click', () => {
        const selectedCategory = filter.dataset.programFilter;
        let visibleCount = 0;

        programFilters.forEach((button) => {
            button.setAttribute('aria-pressed', String(button === filter));
        });

        programCards.forEach((card) => {
            const isVisible = selectedCategory === 'all' || card.dataset.category === selectedCategory;
            card.hidden = !isVisible;
            visibleCount += Number(isVisible);
        });

        if (programCount) {
            programCount.textContent = `${visibleCount} ${visibleCount === 1 ? 'programa' : 'programas'}`;
        }
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