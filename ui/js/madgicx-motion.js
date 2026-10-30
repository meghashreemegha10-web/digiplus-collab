/**
 * Global Digi Pulse — Madgicx Motion & Animation Controller
 * Inspired by Madgicx.com interaction patterns.
 * Smooth viewport reveals, micro-interactions, spring physics, and performance optimizations.
 */
(function () {
  'use strict';

  function initMadgicxMotion() {
    // 1. Target high-impact elements to automatically enable smooth reveals
    const autoRevealSelectors = [
      '.hero-left-content',
      '.hero-login-overlay-card',
      '.trust-stat-box',
      '.section-container',
      '.option-card',
      '.learning-pipeline-bar',
      '.hero-pill-item',
      '.curriculum-module-card',
      '.walkthrough-preview-frame',
      '.header-section',
      '.button-sidebar',
      '.login-box'
    ];

    autoRevealSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        if (!el.classList.contains('mx-reveal') && !el.classList.contains('mx-reveal-left') && !el.classList.contains('mx-reveal-right')) {
          el.classList.add('mx-reveal');
        }
      });
    });

    // 2. Automatically assign stagger delays to siblings in grids and lists
    const gridContainers = [
      '.options-grid',
      '.trust-container',
      '.hero-left-pills',
      '.curriculum-grid',
      '.button-sidebar'
    ];

    gridContainers.forEach(containerSelector => {
      document.querySelectorAll(containerSelector).forEach(container => {
        const children = container.querySelectorAll('.mx-reveal, .option-card, .trust-stat-box, .hero-pill-item, .btn-group');
        children.forEach((child, index) => {
          const delayClass = `mx-delay-${Math.min((index % 4) + 1, 4)}`;
          child.classList.add(delayClass);
        });
      });
    });

    // 3. Viewport IntersectionObserver (Scroll-into-view with Madgicx physics)
    const revealElements = document.querySelectorAll('.mx-reveal, .mx-reveal-left, .mx-reveal-right, .mx-reveal-scale');
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('mx-in-view');
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px -40px 0px', threshold: 0.08 }
      );

      revealElements.forEach(el => {
        // If element is already within viewport on load, reveal immediately without delay
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('mx-in-view');
        } else {
          revealObserver.observe(el);
        }
      });
    } else {
      // Fallback for older browsers
      revealElements.forEach(el => el.classList.add('mx-in-view'));
    }

    // 4. Subtle 3D Spring Hover Tilt on Option Cards (Madgicx SaaS signature)
    const tiltCards = document.querySelectorAll('.option-card, .hero-login-overlay-card');
    tiltCards.forEach(card => {
      let isHovered = false;

      card.addEventListener('mouseenter', () => {
        isHovered = true;
      });

      card.addEventListener('mousemove', e => {
        if (!isHovered) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Gentle maximum 3deg tilt to preserve stability
        const rotateX = ((centerY - y) / centerY) * 2.5;
        const rotateY = ((x - centerX) / centerX) * 2.5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-7px) scale(1.006)`;
      });

      card.addEventListener('mouseleave', () => {
        isHovered = false;
        card.style.transform = '';
      });
    });

    // 5. Madgicx Tab Performance Manager (Pause animations on background tab)
    function syncVisibility() {
      document.documentElement.classList.toggle('mx-motion-paused', document.hidden);
    }
    document.addEventListener('visibilitychange', syncVisibility);
    syncVisibility();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMadgicxMotion);
  } else {
    initMadgicxMotion();
  }
})();

