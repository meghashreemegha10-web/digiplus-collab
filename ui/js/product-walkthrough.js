/**
 * Global Digi Pulse — GuidedCursorDemo / ProductWalkthrough Component
 * Standalone scripted fake-cursor product walkthrough for the interactive demo container.
 * Zero external animation dependencies — uses native Web Animations API & CSS transitions.
 */

(function (global) {
  'use strict';

  // Natural acceleration/deceleration easing curve
  const DEFAULT_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

  /**
   * Calculate target coordinates from the live DOM using getBoundingClientRect()
   * Prevents fake cursor from drifting or clicking the wrong place on different screens.
   *
   * @param {HTMLElement} container
   * @param {HTMLElement} target
   * @returns {{x: number, y: number}}
   */
  function getTargetPoint(container, target) {
    if (!container || !target) return { x: 0, y: 0 };
    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    return {
      x: targetRect.left - containerRect.left + targetRect.width / 2,
      y: targetRect.top - containerRect.top + targetRect.height / 2,
    };
  }

  // Configurable declarative timeline stepping through the process with arrows
  const DEFAULT_TIMELINE = [
    { target: '[data-demo-target="register-submit"]', action: 'move', duration: 760, pauseAfter: 180 },
    { target: '[data-demo-target="register-submit"]', action: 'click', pauseAfter: 900 },
    { target: '[data-demo-target="login-submit"]', action: 'move', duration: 760, pauseAfter: 180 },
    { target: '[data-demo-target="login-submit"]', action: 'click', pauseAfter: 1000 },
    { target: '[data-demo-target="facebook-course"]', action: 'move', duration: 850, pauseAfter: 180 },
    { target: '[data-demo-target="facebook-course"]', action: 'click', pauseAfter: 1000 },
    { target: '[data-demo-target="facebook-option"]', action: 'move', duration: 720, pauseAfter: 180 },
    { target: '[data-demo-target="facebook-option"]', action: 'click', pauseAfter: 480 },
    { target: '[data-demo-target="upi-option"]', action: 'move', duration: 580, pauseAfter: 150 },
    { target: '[data-demo-target="upi-option"]', action: 'click', pauseAfter: 600 },
    { target: '[data-demo-target="payment-submit"]', action: 'move', duration: 720, pauseAfter: 180 },
    { target: '[data-demo-target="payment-submit"]', action: 'click', pauseAfter: 3100 },
    { target: '[data-demo-target="unlocked-active"]', action: 'move', duration: 780, pauseAfter: 2600 }
  ];

  class ProductWalkthrough {
    /**
     * @param {HTMLElement|string} container - The demo wrapper element
     * @param {Object} options - Configuration options
     */
    constructor(container, options = {}) {
      this.container = typeof container === 'string' ? document.querySelector(container) : container;
      if (!this.container) return;

      this.options = Object.assign(
        {
          timeline: DEFAULT_TIMELINE,
          loopDelay: 2800,
          intersectionThreshold: 0.4,
          autoStart: true
        },
        options
      );

      this.currentX = 0;
      this.currentY = 0;
      this.isPlaying = false;
      this.isPausedByUser = false;
      this.hasStartedInViewport = false;
      this.abortController = null;
      this.observer = null;
      this.resizeObserver = null;

      this.initDOM();
      this.bindEvents();

      // Respect prefers-reduced-motion
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.applyFinalState();
        return;
      }

      if (this.options.autoStart) {
        this.initIntersectionObserver();
      }
    }

    /**
     * Build the fake cursor, ripple, and replay button elements
     */
    initDOM() {
      if (getComputedStyle(this.container).position === 'static') {
        this.container.style.position = 'relative';
      }

      // 1. Create Cursor Overlay with crisp high-contrast SVG arrow
      this.cursorEl = document.createElement('div');
      this.cursorEl.className = 'demo-cursor demo-cursor-overlay';
      this.cursorEl.setAttribute('aria-hidden', 'true');
      this.cursorEl.innerHTML = `
        <svg class="demo-cursor-arrow" viewBox="0 0 32 32" aria-hidden="true">
          <path d="M3 2 25 17 15 20 10 29Z" fill="#ffffff" stroke="#0a0f1d" stroke-width="2" stroke-linejoin="round" />
        </svg>
        <span class="demo-cursor-touch-dot" aria-hidden="true"></span>
      `;

      // 2. Create Click Ripple
      this.rippleEl = document.createElement('span');
      this.rippleEl.className = 'demo-click-ripple';
      this.rippleEl.setAttribute('aria-hidden', 'true');

      // 3. Create Unobtrusive Replay Control
      this.replayBtn = document.createElement('button');
      this.replayBtn.type = 'button';
      this.replayBtn.className = 'demo-replay-control';
      this.replayBtn.setAttribute('aria-label', 'Replay interactive walkthrough demo');
      this.replayBtn.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
          <path d="M3 3v5h5"></path>
        </svg>
        <span>Replay Walkthrough</span>
      `;

      this.container.appendChild(this.cursorEl);
      this.container.appendChild(this.rippleEl);
      this.container.appendChild(this.replayBtn);
    }

    /**
     * Bind listeners for user interaction, visibility changes, and resize
     */
    bindEvents() {
      this.handleUserInteraction = this.handleUserInteraction.bind(this);
      this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
      this.handleResize = this.handleResize.bind(this);
      this.handleViewportPosition = this.handleViewportPosition.bind(this);
      this.replayWalkthrough = this.replayWalkthrough.bind(this);

      // Replay button click
      this.replayBtn.addEventListener('click', this.replayWalkthrough);

      // User interaction inside demo pauses the automated walkthrough
      this.container.addEventListener('pointerdown', this.handleUserInteraction, { capture: true, passive: true });
      this.container.addEventListener('keydown', this.handleUserInteraction, { capture: true, passive: true });

      // Page visibility listener
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
      window.addEventListener('scroll', this.handleViewportPosition, { passive: true });

      // Resize listener
      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(this.handleResize);
        this.resizeObserver.observe(this.container);
      } else {
        window.addEventListener('resize', this.handleResize);
      }
      window.addEventListener('resize', this.handleViewportPosition);
    }

    /**
     * Start only when the demo itself is properly framed in the viewport.
     * Reaching the section heading alone must never begin the walkthrough.
     */
    initIntersectionObserver() {
      if (!('IntersectionObserver' in window)) {
        this.start();
        return;
      }

      this.observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            const rect = entry.boundingClientRect;
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            const center = rect.top + rect.height / 2;
            const isDemoPage = typeof window !== 'undefined' && (window.location.pathname.includes('demo') || window.location.pathname.endsWith('demo.html'));
            const centered = isDemoPage ? true : (center >= viewportHeight * 0.38 && center <= viewportHeight * 0.68);
            const enoughVisible = isDemoPage ? (entry.intersectionRatio >= 0.1) : (entry.intersectionRatio >= 0.78);

            if (entry.isIntersecting && enoughVisible && centered) {
              if (!this.isPlaying && !this.isPausedByUser) {
                if (!this.hasStartedInViewport && typeof global.goToStep === 'function') {
                  global.goToStep(0);
                  this.container.scrollTop = 0;
                }
                this.hasStartedInViewport = true;
                this.start();
              }
            } else if (this.isPlaying && !isDemoPage) {
              // Pause as soon as the demo is no longer properly framed.
              this.pause();
            }
          });
        },
        { threshold: [0, 0.1, 0.4, 0.6, 0.78, 0.9, 1] }
      );

      this.observer.observe(this.container);
    }

    handleViewportPosition() {
      if (!this.container || this.isPausedByUser || document.hidden) return;
      if (this.viewportRaf) return;
      this.viewportRaf = requestAnimationFrame(() => {
        this.viewportRaf = 0;
        const rect = this.container.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const ratio = visibleHeight / Math.max(1, rect.height);
        const center = rect.top + rect.height / 2;
        const isDemoPage = typeof window !== 'undefined' && (window.location.pathname.includes('demo') || window.location.pathname.endsWith('demo.html'));
        const ready = isDemoPage ? (ratio >= 0.1) : (ratio >= 0.78 && center >= viewportHeight * 0.38 && center <= viewportHeight * 0.68);

        if (ready && !this.isPlaying) {
          if (!this.hasStartedInViewport && typeof global.goToStep === 'function') {
            global.goToStep(0);
            this.container.scrollTop = 0;
          }
          this.hasStartedInViewport = true;
          this.start();
        } else if (!ready && this.isPlaying && !isDemoPage) {
          this.pause();
        }
      });
    }

    /**
     * Calculate target coordinates using live DOM getBoundingClientRect()
     */
    getTargetPoint(targetEl) {
      const pt = getTargetPoint(this.container, targetEl);
      // Safe clamp inside visible container bounds
      const containerRect = this.container.getBoundingClientRect();
      const clampedX = Math.max(12, Math.min(containerRect.width - 24, pt.x));
      const clampedY = Math.max(12, Math.min(containerRect.height - 24, pt.y));
      return { x: clampedX, y: clampedY };
    }

    /**
     * Async sleep with cancellation support
     */
    sleep(ms, signal) {
      return new Promise((resolve, reject) => {
        if (signal && signal.aborted) {
          reject(new DOMException('Walkthrough aborted', 'AbortError'));
          return;
        }

        const timer = setTimeout(() => {
          resolve();
        }, ms);

        if (signal) {
          signal.addEventListener(
            'abort',
            () => {
              clearTimeout(timer);
              reject(new DOMException('Walkthrough aborted', 'AbortError'));
            },
            { once: true }
          );
        }
      });
    }

    /**
     * Start the automated walkthrough timeline
     */
    async start() {
      if (this.isPlaying) return;

      if (this.abortController) {
        this.abortController.abort();
      }
      this.abortController = new AbortController();
      const { signal } = this.abortController;

      this.isPlaying = true;
      this.isPausedByUser = false;
      this.replayBtn.classList.remove('is-visible');

      try {
        await this.runLoop(signal);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('[ProductWalkthrough error]:', err);
        }
      } finally {
        this.isPlaying = false;
      }
    }

    /**
     * Main timeline execution loop
     */
    async runLoop(signal) {
      const firstStep = this.options.timeline[0];
      const initialTarget = this.resolveTarget(firstStep.target);

      const containerRect = this.container.getBoundingClientRect();
      if (initialTarget) {
        const pt = this.getTargetPoint(initialTarget);
        this.currentX = Math.max(20, pt.x - 70);
        this.currentY = Math.max(20, pt.y + 40);
      } else {
        this.currentX = containerRect.width * 0.5;
        this.currentY = containerRect.height * 0.4;
      }

      this.setCursorPosition(this.currentX, this.currentY);
      this.cursorEl.classList.add('is-visible');
      await this.sleep(300, signal);

      while (!signal.aborted) {
        // Execute each timeline step sequentially
        for (let i = 0; i < this.options.timeline.length; i++) {
          if (signal.aborted) return;
          const step = this.options.timeline[i];
          await this.executeStep(step, signal);
        }

        // Wait loopDelay before repeating
        await this.sleep(this.options.loopDelay, signal);

        // Reset discreetly back to Step 1
        await this.discreetReset(signal);
      }
    }

    /**
     * Resolve target DOM element
     */
    resolveTarget(selectorOrEl) {
      if (!selectorOrEl) return null;
      if (typeof selectorOrEl === 'string') {
        return this.container.querySelector(selectorOrEl) || document.querySelector(selectorOrEl);
      }
      return selectorOrEl;
    }

    /**
     * Execute a single timeline step (move or click)
     */
    async executeStep(step, signal) {
      const targetEl = this.resolveTarget(step.target);
      if (!targetEl) return;

      await this.ensureTargetVisible(targetEl, signal);

      const dest = this.getTargetPoint(targetEl);

      if (step.action === 'move') {
        await this.animateCursorMove(dest.x, dest.y, step.duration || 800, signal);
        if (step.pauseAfter) {
          await this.sleep(step.pauseAfter, signal);
        }
      } else if (step.action === 'click') {
        await this.simulateClick(targetEl, signal);
        if (step.pauseAfter) {
          await this.sleep(step.pauseAfter, signal);
        }
      }
    }

    async ensureTargetVisible(targetEl, signal) {
      const containerRect = this.container.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const fullyVisible = targetRect.top >= containerRect.top + 8 && targetRect.bottom <= containerRect.bottom - 8;
      if (fullyVisible) return;

      // The screenshot states are scaled canvases; if a target still falls
      // outside the fixed stage, gently scroll the stage instead of moving
      // the page and recalculate only after the scroll settles.
      if (this.container.scrollHeight > this.container.clientHeight) {
        const desired = targetEl.offsetTop - this.container.clientHeight / 2 + targetEl.offsetHeight / 2;
        this.container.scrollTo({ top: Math.max(0, desired), behavior: 'smooth' });
        await this.sleep(360, signal);
      }
    }

    /**
     * Smooth curved cursor movement using Web Animations API
     */
    animateCursorMove(endX, endY, duration, signal) {
      return new Promise((resolve, reject) => {
        if (signal.aborted) {
          reject(new DOMException('Aborted', 'AbortError'));
          return;
        }

        const startX = this.currentX;
        const startY = this.currentY;
        const dx = endX - startX;
        const dy = endY - startY;
        const dist = Math.hypot(dx, dy);

        // Direction angle and natural subtle tilt (-18deg to +18deg)
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const tilt = Math.max(-18, Math.min(18, (angle - 45) * 0.35));

        // Gentle perpendicular curve to avoid mechanical straight lines
        const perpFactor = Math.min(28, dist * 0.12);
        const midX = (startX + endX) / 2 - (dy / (dist || 1)) * perpFactor;
        const midY = (startY + endY) / 2 + (dx / (dist || 1)) * perpFactor;

        // Keyframe definitions (cursor tip aligns precisely with target)
        const keyframes = [
          { transform: `translate3d(${startX - 3}px, ${startY - 2}px, 0) rotate(${tilt * 0.5}deg)` },
          { transform: `translate3d(${midX - 3}px, ${midY - 2}px, 0) rotate(${tilt}deg)`, offset: 0.55 },
          { transform: `translate3d(${endX - 3}px, ${endY - 2}px, 0) rotate(0deg)` }
        ];

        const anim = this.cursorEl.animate(keyframes, {
          duration: Math.max(450, duration),
          easing: DEFAULT_EASING,
          fill: 'forwards'
        });

        const onAbort = () => {
          anim.cancel();
          reject(new DOMException('Aborted', 'AbortError'));
        };

        signal.addEventListener('abort', onAbort, { once: true });

        anim.onfinish = () => {
          signal.removeEventListener('abort', onAbort);
          this.currentX = endX;
          this.currentY = endY;
          this.setCursorPosition(endX, endY);
          resolve();
        };
      });
    }

    /**
     * Position cursor directly without animation
     */
    setCursorPosition(x, y) {
      this.cursorEl.style.transform = `translate3d(${x - 3}px, ${y - 2}px, 0)`;
    }

    /**
     * Trigger click feedback: cursor scale, target pressed state, and ripple
     */
    async simulateClick(targetEl, signal) {
      // 1. Cursor scales down to ~0.88
      this.cursorEl.classList.add('is-clicking');

      // 2. Click ripple centered at cursor tip
      this.rippleEl.style.left = `${this.currentX}px`;
      this.rippleEl.style.top = `${this.currentY}px`;
      this.rippleEl.classList.remove('is-rippling');
      void this.rippleEl.offsetWidth; // Force reflow
      this.rippleEl.classList.add('is-rippling');

      // 3. Brief pressed state on target element
      targetEl.classList.add('demo-target-pressed');
      this.isSyntheticClick = true;

      // 4. Trigger target's real click handler safely
      try {
        if (typeof targetEl.click === 'function') {
          targetEl.click();
        } else {
          targetEl.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        }
      } catch (e) {
        console.warn('[ProductWalkthrough click dispatch]:', e);
      }
      this.isSyntheticClick = false;

      // Panel-changing clicks replace the visible journey state. Let layout,
      // fonts, and images settle before resolving the next live target.
      await this.sleep(260, signal);
      if (typeof global.fitActiveJourneyShot === 'function') {
        global.fitActiveJourneyShot();
        await this.sleep(80, signal);
      }
      this.container.scrollTop = 0;

      await this.sleep(180, signal);

      // Return cursor to scale 1 and remove target pressed class
      this.cursorEl.classList.remove('is-clicking');
      targetEl.classList.remove('demo-target-pressed');

      await this.sleep(160, signal);
    }

    /**
     * Handle manual user clicks/touches inside the demo container
     */
    handleUserInteraction(e) {
      if (this.isSyntheticClick) return;
      if (e.target && (e.target === this.replayBtn || this.replayBtn.contains(e.target))) {
        return;
      }

      if (this.isPlaying) {
        this.pause();
        this.isPausedByUser = true;
        this.cursorEl.classList.remove('is-visible');
        this.replayBtn.classList.add('is-visible');
      }
    }

    /**
     * Replay button clicked by user
     */
    replayWalkthrough() {
      this.isPausedByUser = false;
      this.start();
    }

    /**
     * Page visibility change handler
     */
    handleVisibilityChange() {
      if (document.hidden) {
        if (this.isPlaying) {
          this.pause();
        }
      } else {
        if (!this.isPlaying && !this.isPausedByUser) {
          this.start();
        }
      }
    }

    /**
     * Recalculate coordinates on window/container resize
     */
    handleResize() {
      if (!this.container) return;
      const containerRect = this.container.getBoundingClientRect();
      this.currentX = Math.max(10, Math.min(containerRect.width - 24, this.currentX));
      this.currentY = Math.max(10, Math.min(containerRect.height - 24, this.currentY));
      this.setCursorPosition(this.currentX, this.currentY);
    }

    /**
     * Pause automated walkthrough
     */
    pause() {
      if (this.abortController) {
        this.abortController.abort();
      }
      this.isPlaying = false;
      this.cursorEl.classList.remove('is-visible');
    }

    /**
     * Discreet reset between loops back to Step 1
     */
    async discreetReset(signal) {
      if (typeof global.goToStep === 'function') {
        global.goToStep(0);
      }
      const resetTarget = this.resolveTarget('[data-demo-target="step-01"]');
      if (resetTarget) {
        const pt = this.getTargetPoint(resetTarget);
        this.currentX = pt.x;
        this.currentY = pt.y;
        this.setCursorPosition(this.currentX, this.currentY);
      }
      await this.sleep(200, signal);
    }

    /**
     * Immediate final state for prefers-reduced-motion: reduce
     */
    applyFinalState() {
      if (this.cursorEl) this.cursorEl.style.display = 'none';
      if (this.rippleEl) this.rippleEl.style.display = 'none';
      if (this.replayBtn) this.replayBtn.style.display = 'none';

      // Activate Step 05 final state
      if (typeof global.goToStep === 'function') {
        global.goToStep(4);
      }
    }

    /**
     * Clean up all observers, listeners, and elements
     */
    destroy() {
      this.pause();
      if (this.observer) this.observer.disconnect();
      if (this.resizeObserver) this.resizeObserver.disconnect();
      window.removeEventListener('resize', this.handleResize);
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
      window.removeEventListener('scroll', this.handleViewportPosition);
      window.removeEventListener('resize', this.handleViewportPosition);

      if (this.container) {
        this.container.removeEventListener('pointerdown', this.handleUserInteraction, { capture: true });
        this.container.removeEventListener('keydown', this.handleUserInteraction, { capture: true });
      }

      if (this.cursorEl && this.cursorEl.parentNode) this.cursorEl.parentNode.removeChild(this.cursorEl);
      if (this.rippleEl && this.rippleEl.parentNode) this.rippleEl.parentNode.removeChild(this.rippleEl);
      if (this.replayBtn && this.replayBtn.parentNode) this.replayBtn.parentNode.removeChild(this.replayBtn);
    }
  }

  // Aliases for framework & module compatibility
  global.getTargetPoint = getTargetPoint;
  global.ProductWalkthrough = ProductWalkthrough;
  global.GuidedCursorDemo = ProductWalkthrough;
  global.DemoCursorOverlay = ProductWalkthrough;

  // Auto-initialize on any container with [data-cursor-demo]
  function autoInit() {
    const demoContainers = document.querySelectorAll('[data-cursor-demo]');
    demoContainers.forEach(container => {
      if (!container._productWalkthroughInstance) {
        container._productWalkthroughInstance = new ProductWalkthrough(container);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }
})(typeof window !== 'undefined' ? window : this);
