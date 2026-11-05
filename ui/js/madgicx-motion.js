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
      '.trust-metrics-section .trust-container',
      '.trust-stat-box',
      '.option-card',
      '.learning-pipeline-bar',
      '.curriculum-module-card',
      '.walkthrough-preview-frame',
      '.header-section',
      '.button-sidebar',
      '.login-box',
      '.surprise-glow-badge',
      '.surprise-main-title',
      '.surprise-intro-lead',
      '.surprise-card',
      '.section-curriculum .section-header > *',
      '.official-intro-video-wrapper',
      '.video-highlights-grid',
      '.highlight-item-card',
      '.section-optimization-showcase .section-container > *',
      '.opt-steps-bar',
      '.features-screen_component',
      '.features-screen_slot',
      '.separator_component',
      '.site-footer .footer-top',
      '.site-footer .footer-bottom'
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
      '.button-sidebar',
      '.surprise-grid',
      '.video-highlights-grid',
      '.features-screen_features',
      '.footer-links-grid'
    ];

    gridContainers.forEach(containerSelector => {
      document.querySelectorAll(containerSelector).forEach(container => {
        const children = container.querySelectorAll('.mx-reveal, .option-card, .trust-stat-box, .btn-group, .surprise-card, .highlight-item-card, .features-screen_slot, .footer-links-column');
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
    const tiltCards = document.querySelectorAll('.option-card, .hero-login-overlay-card, .surprise-card, .highlight-item-card, .trust-stat-box, .journey-course-card, .features-screen_slot');
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

    // 5. Hero depth motion: keep the original composition, but let the
    // background, copy, and platform overlays travel at separate rates.
    const hero = document.querySelector('.hero-showcase-section');
    const heroImage = document.querySelector('.hero-main-banner-img');
    const heroCopy = document.querySelector('.hero-left-content');
    const heroTiles = document.querySelectorAll('[data-hero-depth]');
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let heroRaf = 0;

    function renderHeroDepth() {
      heroRaf = 0;
      if (!hero || !heroImage || reducedMotion) return;
      const rect = hero.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height)));
      heroImage.style.transform = `scale(1.012) translate3d(0, ${progress * 18}px, 0)`;
      if (heroCopy) heroCopy.style.translate = `0 ${progress * 9}px`;
      heroTiles.forEach(tile => {
        const depth = Number(tile.dataset.heroDepth || 1);
        tile.style.marginTop = `${progress * depth * 14}px`;
      });
    }

    function requestHeroDepth() {
      if (!heroRaf) heroRaf = requestAnimationFrame(renderHeroDepth);
    }

    window.addEventListener('scroll', requestHeroDepth, { passive: true });
    window.addEventListener('resize', requestHeroDepth);
    renderHeroDepth();

    // Dedicated hero-pill entrance. Keeping this separate from the generic
    // reveal observer prevents mx-in-view's !important transform from
    // cancelling the staggered left-to-right keyframes.
    const heroPills = document.querySelector('.hero-left-pills');
    if (heroPills) {
      heroPills.querySelectorAll('.hero-pill-item').forEach(pill => {
        pill.classList.remove('mx-reveal', 'mx-in-view', 'mx-delay-1', 'mx-delay-2', 'mx-delay-3', 'mx-delay-4');
      });
      const pillObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
            heroPills.classList.add('hero-pills-animate');
            pillObserver.disconnect();
          }
        });
      }, { threshold: [0.35] });
      pillObserver.observe(heroPills);
    }

    // 6. Madgicx Tab Performance Manager (Pause animations on background tab)
    function syncVisibility() {
      document.documentElement.classList.toggle('mx-motion-paused', document.hidden);
    }
    document.addEventListener('visibilitychange', syncVisibility);
    syncVisibility();

    // 7. Interactive Number Counter Animation for Trust Metrics Section
    function initTrustCounter() {
      const metricsSection = document.querySelector('.trust-metrics-section');
      if (!metricsSection) return;

      let counted = false;
      if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
              counted = true;
              runNumberAnimation();
              counterObserver.disconnect();
            }
          });
        }, { threshold: 0.25 });
        counterObserver.observe(metricsSection);
      } else {
        runNumberAnimation();
      }

      function runNumberAnimation() {
        const statBoxes = document.querySelectorAll('.trust-stat-box');
        if (statBoxes.length >= 4) {
          const num1 = statBoxes[0].querySelector('.trust-stat-number');
          const num2 = statBoxes[1].querySelector('.trust-stat-number');
          const num3 = statBoxes[2].querySelector('.trust-stat-number');
          
          if (num1) animateCount(num1, 0, 12400, 1600, n => n.toLocaleString() + '+');
          if (num2) animateFloatCount(num2, 0.0, 4.9, 1400, n => n.toFixed(1) + ' ★★★★★');
          if (num3) animateFloatCount(num3, 0.0, 114.8, 1800, n => '₹' + n.toFixed(1) + ' Cr+');
        }
      }

      function animateCount(el, start, end, duration, formatFn) {
        const startTime = performance.now();
        function frame(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(start + (end - start) * ease);
          el.textContent = formatFn(current);
          if (progress < 1) requestAnimationFrame(frame);
          else el.textContent = formatFn(end);
        }
        requestAnimationFrame(frame);
      }

      function animateFloatCount(el, start, end, duration, formatFn) {
        const startTime = performance.now();
        function frame(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          const current = start + (end - start) * ease;
          el.textContent = formatFn(current);
          if (progress < 1) requestAnimationFrame(frame);
          else el.textContent = formatFn(end);
        }
        requestAnimationFrame(frame);
      }
    }
    initTrustCounter();

    // 8. Interactive Step Transition Hook for Section 5 (#optimization)
    if (typeof window.goToStep === 'function' && !window.__goToStepHooked) {
      const origGoToStep = window.goToStep;
      window.__goToStepHooked = true;
      window.goToStep = function(stepIdx) {
        const screen = document.getElementById('optAnimatedScreen');
        if (screen) {
          screen.classList.remove('step-animate');
          void screen.offsetWidth;
          screen.classList.add('step-animate');
        }
        return origGoToStep.apply(this, arguments);
      };
    }

  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMadgicxMotion);
  } else {
    initMadgicxMotion();
  }
})();
