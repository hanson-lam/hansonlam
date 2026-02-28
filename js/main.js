/* ==========================================================================
   main.js — Site-wide JavaScript
   - Nav scroll state (box shadow)
   - Active nav link (IntersectionObserver)
   - Mobile menu toggle
   - Typing animation for hero tagline
   - Scroll-reveal animation
   ========================================================================== */

(function () {
    'use strict';

    /* --------------------------------------------------------------------------
       Scroll-reveal: fade + slide up on enter viewport (animate once)

       - [data-reveal]         → single element, animates immediately
       - [data-reveal-stagger] → children animate row-by-row, detected via
                                 offsetTop so it works at any column count
                                 and with any number of children.
       -------------------------------------------------------------------------- */
    const HEADING_DELAY = 0;    // ms: heading starts immediately
    const STAGGER_BASE = 250;  // ms: first row starts after heading
    const STAGGER_STEP = 200;  // ms: each subsequent row adds this

    /**
     * Group elements by their vertical row position (offsetTop).
     * Returns an array of arrays, one per row.
     */
    function getRows(children) {
        const rows = [];
        let currentRow = [];
        let currentTop = null;

        Array.from(children).forEach((child) => {
            const top = child.offsetTop;
            if (currentTop === null || Math.abs(top - currentTop) > 4) {
                // New row (allow 4px tolerance for subpixel rendering)
                if (currentRow.length) rows.push(currentRow);
                currentRow = [child];
                currentTop = top;
            } else {
                currentRow.push(child);
            }
        });
        if (currentRow.length) rows.push(currentRow);
        return rows;
    }

    function applyStaggerDelays(container) {
        const rows = getRows(container.children);
        rows.forEach((row, rowIndex) => {
            const delay = STAGGER_BASE + rowIndex * STAGGER_STEP;
            row.forEach((el) => {
                el.style.transitionDelay = `${delay}ms`;
            });
        });
    }

    const revealEls = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');

    if (revealEls.length) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        if (el.hasAttribute('data-reveal-stagger')) {
                            applyStaggerDelays(el);
                        }
                        el.classList.add('is-visible');
                        revealObserver.unobserve(el);
                    }
                });
            },
            { threshold: 0.1 }
        );
        revealEls.forEach((el) => revealObserver.observe(el));
    }

    /* --------------------------------------------------------------------------
       Nav: add shadow on scroll
       -------------------------------------------------------------------------- */
    const nav = document.querySelector('.nav');

    if (nav) {
        const onScroll = () => {
            nav.classList.toggle('scrolled', window.scrollY > 8);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* --------------------------------------------------------------------------
       Nav: mobile menu toggle
       -------------------------------------------------------------------------- */
    const menuBtn = document.querySelector('#nav-menu-btn');
    const mobileNav = document.querySelector('#nav-mobile');

    if (menuBtn && mobileNav) {
        menuBtn.addEventListener('click', () => {
            const isOpen = mobileNav.classList.toggle('open');
            menuBtn.setAttribute('aria-expanded', isOpen);
        });

        mobileNav.querySelectorAll('.nav__link').forEach((link) => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                menuBtn.setAttribute('aria-expanded', false);
            });
        });
    }

    /* --------------------------------------------------------------------------
       Smooth scroll polyfill for older iOS Safari (pre-15.4)
       CSS scroll-behavior is ignored on older Safari; this JS version works
       universally across all devices and browsers.
       -------------------------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* --------------------------------------------------------------------------
       Nav: active section tracking via IntersectionObserver
       -------------------------------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link[data-section]');

    if (sections.length && navLinks.length) {
        const setActive = (id) => {
            navLinks.forEach((link) => {
                link.classList.toggle('active', link.dataset.section === id);
            });
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActive(entry.target.id);
                });
            },
            {
                rootMargin: `-${nav ? nav.offsetHeight : 60}px 0px -55% 0px`,
                threshold: 0,
            }
        );

        sections.forEach((s) => observer.observe(s));
        // Set initial active state
        setActive('home');
    }

    /* --------------------------------------------------------------------------
       Copy email to clipboard
       -------------------------------------------------------------------------- */
    const copyEmailBtn = document.querySelector('#copy-email-btn');

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', async () => {
            const email = copyEmailBtn.dataset.email;
            const tooltip = copyEmailBtn.querySelector('.copy-tooltip');

            try {
                await navigator.clipboard.writeText(email);
            } catch {
                // Fallback for older browsers / iOS < 13.4
                const ta = document.createElement('textarea');
                ta.value = email;
                ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            }

            // Show tooltip
            if (tooltip) {
                tooltip.classList.add('visible');
                setTimeout(() => tooltip.classList.remove('visible'), 2000);
            }
        });
    }

    /* --------------------------------------------------------------------------
       Typing animation for hero tagline
       -------------------------------------------------------------------------- */
    const taglineEl = document.querySelector('#hero-tagline');
    const cursorEl = document.querySelector('#hero-cursor');

    if (taglineEl) {
        const phrases = [
            'Software Engineer',
            'AI Enthusiast',
            'Avid Boba Drinker',
            'Future Founder :)',
            'Reluctant Runner',
            'Building New Things',
            'Yogi'
        ];

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPausing = false;

        const TYPE_SPEED = 80;   // ms per character typed
        const DELETE_SPEED = 40;   // ms per character deleted
        const PAUSE_AFTER = 1000; // ms to pause at end of phrase
        const PAUSE_BEFORE = 400;  // ms to pause before retyping

        const tick = () => {
            const current = phrases[phraseIndex];

            if (isPausing) {
                isPausing = false;
                isDeleting = true;
                setTimeout(tick, PAUSE_BEFORE);
                return;
            }

            if (isDeleting) {
                charIndex--;
                taglineEl.textContent = current.slice(0, charIndex);

                if (charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    setTimeout(tick, TYPE_SPEED);
                } else {
                    setTimeout(tick, DELETE_SPEED);
                }
            } else {
                charIndex++;
                taglineEl.textContent = current.slice(0, charIndex);

                if (charIndex === current.length) {
                    isPausing = true;
                    setTimeout(tick, PAUSE_AFTER);
                } else {
                    setTimeout(tick, TYPE_SPEED);
                }
            }
        };

        setTimeout(tick, 600);
    }
})();
