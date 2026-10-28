/**
 * GLOBAL DIGI PULSE — MODERN INTERACTIVE APPLICATION ENGINE
 * Features:
 * 1. Ambient Dynamic Canvas Visualizer
 * 2. Realistic Speech Narration Engine (Instructor Explaining Course)
 * 3. Interactive Live ROAS & Sales Calculator
 * 4. Special Offer Countdown Timer
 * 5. Authentication & Modal Controllers
 * 6. Payment Flow Simulator
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. AMBIENT PARTICLES & WAVEFORM CANVAS
  // =========================================================================
  const canvas = document.getElementById('ambientCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 28;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? 'rgba(0, 242, 254, ' : 'rgba(121, 40, 202, ',
        alpha: Math.random() * 0.4 + 0.1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4
      });
    }

    function renderAmbientParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();
      });

      requestAnimationFrame(renderAmbientParticles);
    }
    renderAmbientParticles();
  }

  // =========================================================================
  // 2. VIDEO PLAYER & MODAL CONTROLS (ONLY AUTHENTIC ORIGINAL VIDEOS)
  // =========================================================================
  window.playSimulatedVoice = function() {
    // Keep clean - only authentic original video from website
    window.openVideoModal('Complete Masterclass Overview', 'Instructor orientation walkthrough', 'https://archive.org/download/short-video.jpg/short%20video2.jpg.mp4');
  };

  // =========================================================================
  // 3. INTERACTIVE LIVE ROAS & AD CALCULATOR (SINGLE & MULTI-SLIDER SUITE)
  // =========================================================================
  const adBudgetSlider = document.getElementById('adBudgetSlider');
  const budgetDisplay = document.getElementById('budgetDisplay');
  const aovSlider = document.getElementById('aovSlider');
  const aovDisplay = document.getElementById('aovDisplay');
  const cvrSlider = document.getElementById('cvrSlider');
  const cvrDisplay = document.getElementById('cvrDisplay');
  const cpcSlider = document.getElementById('cpcSlider');
  const cpcDisplay = document.getElementById('cpcDisplay');

  const calcViews = document.getElementById('calcViews');
  const calcLeads = document.getElementById('calcLeads');
  const calcRevenue = document.getElementById('calcRevenue');
  const calcCPA = document.getElementById('calcCPA');
  const calcROAS = document.getElementById('calcROAS');
  const calcProfit = document.getElementById('calcProfit');
  const calcRoasBadge = document.getElementById('calcRoasBadge');

  function updateCalculator() {
    if (!adBudgetSlider) return;
    const budget = parseInt(adBudgetSlider.value, 10);
    if (budgetDisplay) budgetDisplay.textContent = '₹' + budget.toLocaleString('en-IN');

    const aov = aovSlider ? parseInt(aovSlider.value, 10) : 1500;
    if (aovDisplay) aovDisplay.textContent = '₹' + aov.toLocaleString('en-IN');

    const cvr = cvrSlider ? parseFloat(cvrSlider.value) : 2.5;
    if (cvrDisplay) cvrDisplay.textContent = cvr.toFixed(1) + '%';

    const cpc = cpcSlider ? parseFloat(cpcSlider.value) : 8;
    if (cpcDisplay) cpcDisplay.textContent = '₹' + cpc.toFixed(1);

    // Dynamic modeling
    const clicks = Math.round(budget / cpc);
    const orders = Math.max(1, Math.round(clicks * (cvr / 100)));
    const revenue = Math.round(orders * aov);
    const roas = (revenue / budget).toFixed(2);
    const netProfit = revenue - budget;
    const cpa = (budget / orders).toFixed(2);

    if (calcViews) calcViews.textContent = (clicks * 12).toLocaleString('en-IN') + '+';
    if (calcLeads) calcLeads.textContent = orders.toLocaleString('en-IN') + ' Orders';
    if (calcRevenue) calcRevenue.textContent = '₹' + revenue.toLocaleString('en-IN');
    if (calcCPA) calcCPA.textContent = '₹' + cpa;
    if (calcROAS) calcROAS.textContent = roas + 'x';
    if (calcProfit) {
      calcProfit.textContent = (netProfit >= 0 ? '+₹' : '-₹') + Math.abs(netProfit).toLocaleString('en-IN');
      calcProfit.style.color = netProfit >= 0 ? 'var(--emerald-green)' : 'var(--coral-red)';
    }

    if (calcRoasBadge) {
      if (roas >= 4.0) {
        calcRoasBadge.innerHTML = '🔥 Highly Profitable • <strong>' + roas + 'x ROAS</strong>';
        calcRoasBadge.className = 'calc-roas-status profitable';
      } else if (roas >= 2.0) {
        calcRoasBadge.innerHTML = '⚡ Scalable & Stable • <strong>' + roas + 'x ROAS</strong>';
        calcRoasBadge.className = 'calc-roas-status profitable';
      } else {
        calcRoasBadge.innerHTML = '⚠️ Needs Ad Optimization • <strong>' + roas + 'x ROAS</strong>';
        calcRoasBadge.className = 'calc-roas-status';
        calcRoasBadge.style.background = 'rgba(245, 158, 11, 0.15)';
        calcRoasBadge.style.color = 'var(--gold-amber)';
      }
    }
  }

  [adBudgetSlider, aovSlider, cvrSlider, cpcSlider].forEach(slider => {
    if (slider) {
      slider.addEventListener('input', updateCalculator);
    }
  });

  if (adBudgetSlider) {
    updateCalculator();
  }

  // =========================================================================
  // 4. SPECIAL OFFER COUNTDOWN TIMER (06:59 countdown)
  // =========================================================================
  const countdownTimer = document.getElementById('countdownTimer');
  let secondsRemaining = 6 * 60 + 59; // 06:59

  function updateCountdown() {
    if (!countdownTimer) return;
    if (secondsRemaining <= 0) {
      secondsRemaining = 15 * 60; // reset for perpetual urgency
    }
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    countdownTimer.textContent = 
      String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
    secondsRemaining--;
  }

  setInterval(updateCountdown, 1000);

  // =========================================================================
  // 5. NAVBAR SCROLL EFFECT
  // =========================================================================
  const mainNavbar = document.getElementById('mainNavbar');
  window.addEventListener('scroll', () => {
    if (mainNavbar) {
      if (window.scrollY > 40) {
        mainNavbar.classList.add('scrolled');
      } else {
        mainNavbar.classList.remove('scrolled');
      }
    }
  });

  // Password visibility toggle
  const heroTogglePwd = document.getElementById('heroTogglePwd');
  const heroPassword = document.getElementById('heroPassword');
  if (heroTogglePwd && heroPassword) {
    heroTogglePwd.addEventListener('click', () => {
      const isPassword = heroPassword.type === 'password';
      heroPassword.type = isPassword ? 'text' : 'password';
      heroTogglePwd.textContent = isPassword ? '🙈' : '👁️';
    });
  }

  const heroOverlayTogglePwd = document.getElementById('heroOverlayTogglePwd');
  const heroOverlayPassword = document.getElementById('heroOverlayPassword');
  if (heroOverlayTogglePwd && heroOverlayPassword) {
    heroOverlayTogglePwd.addEventListener('click', () => {
      const isPassword = heroOverlayPassword.type === 'password';
      heroOverlayPassword.type = isPassword ? 'text' : 'password';
      heroOverlayTogglePwd.textContent = isPassword ? '🙈' : '👁️';
    });
  }

  // =========================================================================
  // 6. MODALS MANAGEMENT
  // =========================================================================
  window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (modalId === 'loginModal') {
        const u = document.getElementById('heroUsername');
        const p = document.getElementById('heroPassword');
        if (u) u.value = 'Shriya';
        if (p) p.value = 'Megha@14';
      }
    }
  };

  window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (modalId === 'videoPreviewModal') {
        const vidEl = document.getElementById('samplePreviewVideo');
        if (vidEl) {
          vidEl.pause();
        }
      }
    }
  };

  // Close modals on clicking backdrop
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        window.closeModal(overlay.id);
      }
    });
  });

  // Video Preview Modal trigger with dynamic source support
  window.openVideoModal = function(title, description, videoSrc) {
    const titleEl = document.getElementById('videoModalTitle');
    const descEl = document.getElementById('videoModalDesc');
    const vidEl = document.getElementById('samplePreviewVideo');
    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = description;
    if (vidEl) {
      if (videoSrc) {
        vidEl.src = videoSrc;
      }
      vidEl.currentTime = 0;
      vidEl.play().catch(() => {});
    }
    openModal('videoPreviewModal');
  };

  // Navigation and button click triggers
  const navLoginBtn = document.getElementById('navLoginBtn');
  const hotspotLoginBtn = document.getElementById('hotspotLoginBtn');
  const footerLoginLink = document.getElementById('footerLoginLink');
  const openRegisterLink = document.getElementById('openRegisterLink');
  const openForgotLink = document.getElementById('openForgotLink');
  
  const navEnrollBtn = document.getElementById('navEnrollBtn');
  const heroEnrollBtn = document.getElementById('heroEnrollBtn');
  const hotspotEnrollBtn = document.getElementById('hotspotEnrollBtn');
  const mobileEnrollBtn = document.getElementById('mobileEnrollBtn');

  const heroPreviewBtn = document.getElementById('heroPreviewBtn');
  const hotspotPreviewBtn = document.getElementById('hotspotPreviewBtn');
  const mobilePreviewBtn = document.getElementById('mobilePreviewBtn');

  const hotspotAudioBtn = document.getElementById('hotspotAudioBtn');
  const mobileAudioBtn = document.getElementById('mobileAudioBtn');

  // Member Login Modals
  [navLoginBtn, hotspotLoginBtn, footerLoginLink].forEach(btn => {
    if (btn) btn.addEventListener('click', (e) => {
      e.preventDefault();
      const u = document.getElementById('heroUsername');
      const p = document.getElementById('heroPassword');
      if (u) u.value = 'Shriya';
      if (p) p.value = 'Megha@14';
      openModal('loginModal');
    });
  });

  // Enroll & Payment Modals
  window.openPaymentModal = function() {
    openModal('paymentModal');
  };

  [navEnrollBtn, heroEnrollBtn, hotspotEnrollBtn, mobileEnrollBtn].forEach(btn => {
    if (btn) btn.addEventListener('click', (e) => {
      e.preventDefault();
      openPaymentModal();
    });
  });

  // Video Previews
  [heroPreviewBtn, hotspotPreviewBtn, mobilePreviewBtn].forEach(btn => {
    if (btn) btn.addEventListener('click', (e) => {
      e.preventDefault();
      openVideoModal(
        'Complete Masterclass Overview',
        'Learn how to sell your products online like a pro across YouTube, Instagram, and Facebook.',
        'https://archive.org/download/short-video.jpg/short%20video2.jpg.mp4'
      );
    });
  });



  if (openRegisterLink) {
    openRegisterLink.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal('loginModal');
      openModal('registerModal');
    });
  }

  if (openForgotLink) {
    openForgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal('loginModal');
      openModal('forgotModal');
    });
  }

  // Smooth scroll for hero scroll indicator
  const heroScrollDown = document.getElementById('heroScrollDown');
  if (heroScrollDown) {
    heroScrollDown.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('ecosystem') || document.getElementById('about-surprise');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // =========================================================================
  // 7. FORM SUBMISSIONS & AUTHENTICATION
  // =========================================================================
  window.quickLoginAsShriya = function() {
    localStorage.setItem('userId', 'shriya_user_01');
    localStorage.setItem('accessGranted', 'true');
    localStorage.setItem('scanPaid', 'true');
    localStorage.setItem('campaignPaid', 'true');
    localStorage.setItem('paymentStatus', '1499');
    window.location.href = '/IntroPage.html';
  };

  const heroOverlayLoginForm = document.getElementById('heroOverlayLoginForm');
  if (heroOverlayLoginForm) {
    heroOverlayLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.quickLoginAsShriya();
    });
  }

  const modalQuickShriyaBtn = document.getElementById('modalQuickShriyaBtn');
  if (modalQuickShriyaBtn) {
    modalQuickShriyaBtn.addEventListener('click', () => {
      const uInput = document.getElementById('heroUsername');
      const pInput = document.getElementById('heroPassword');
      if (uInput) uInput.value = 'Shriya';
      if (pInput) pInput.value = 'Megha@14';
      if (heroLoginForm) heroLoginForm.dispatchEvent(new Event('submit'));
    });
  }

  const heroLoginForm = document.getElementById('heroLoginForm');
  if (heroLoginForm) {
    heroLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = (document.getElementById('heroUsername').value || '').trim();
      const submitBtn = heroLoginForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<span>Verifying credentials...</span>';
      submitBtn.disabled = true;

      try {
        const res = await fetch("/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            username: username, 
            password: document.getElementById('heroPassword').value 
          })
        });

        const data = await res.json().catch(() => null);

        if (data && data.success) {
          submitBtn.innerHTML = '<span>Access Granted! Redirecting...</span>';
          submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
          localStorage.setItem('userId', data.userId || 'shriya_user_01');
          localStorage.setItem('accessGranted', 'true');
          localStorage.setItem('scanPaid', 'true');
          localStorage.setItem('campaignPaid', 'true');
          localStorage.setItem('paymentStatus', '1499');
          setTimeout(() => {
            window.location.href = '/IntroPage.html';
          }, 800);
        } else {
          submitBtn.innerHTML = '<span>Invalid Credentials</span>';
          submitBtn.style.background = '#ef4444';
          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }, 1800);
        }
      } catch (err) {
        submitBtn.innerHTML = '<span>Login error. Try again</span>';
        submitBtn.style.background = '#ef4444';
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 1800);
      }
    });
  }

  // Registration Form
  const modalRegisterForm = document.getElementById('modalRegisterForm');
  const regMessage = document.getElementById('regMessage');
  if (modalRegisterForm) {
    modalRegisterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('regUsername').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value;

      regMessage.style.color = 'var(--cyan-pulse)';
      regMessage.textContent = 'Creating account...';

      try {
        const res = await fetch('/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (data && data.success) {
          regMessage.style.color = 'var(--emerald-green)';
          regMessage.textContent = 'Account created successfully! Redirecting to sign in...';
          setTimeout(() => {
            closeModal('registerModal');
            regMessage.textContent = '';
            modalRegisterForm.reset();
            openModal('loginModal');
          }, 1200);
        } else {
          regMessage.style.color = '#ef4444';
          regMessage.textContent = (data && data.message) || 'Registration failed.';
        }
      } catch (err) {
        regMessage.style.color = '#ef4444';
        regMessage.textContent = 'Server error during registration.';
      }
    });
  }

  // Forgot Password Form
  const modalForgotForm = document.getElementById('modalForgotForm');
  const forgotMessage = document.getElementById('forgotMessage');
  if (modalForgotForm) {
    modalForgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('forgotEmail').value.trim();
      forgotMessage.style.color = 'var(--cyan-pulse)';
      forgotMessage.textContent = 'Sending reset instructions to your email...';

      try {
        const res = await fetch('/forgot-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (data && data.success && data.resetLink) {
          forgotMessage.style.color = 'var(--emerald-green)';
          forgotMessage.innerHTML = `Recovery link: <a href="${data.resetLink}" style="color:var(--cyan-pulse); text-decoration:underline;">Click here to reset password</a>`;
        } else {
          forgotMessage.style.color = '#ef4444';
          forgotMessage.textContent = (data && data.error) || 'Failed to find account.';
        }
      } catch (err) {
        forgotMessage.style.color = '#ef4444';
        forgotMessage.textContent = 'Server error during recovery.';
      }
    });
  }

  // Payment Simulation
  const simulatePayBtn = document.getElementById('simulatePayBtn');
  const paymentStatus = document.getElementById('paymentStatus');
  if (simulatePayBtn) {
    simulatePayBtn.addEventListener('click', () => {
      simulatePayBtn.disabled = true;
      simulatePayBtn.innerHTML = '<span>Activating Course Modules...</span>';
      paymentStatus.style.color = 'var(--gold-amber)';
      paymentStatus.textContent = 'Unlocking 4K Masterclass...';

      setTimeout(() => {
        simulatePayBtn.innerHTML = '<span>Access Unlocked! Redirecting...</span>';
        simulatePayBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        paymentStatus.style.color = 'var(--emerald-green)';
        paymentStatus.innerHTML = '🎉 <strong>Full Access Granted!</strong> Redirecting to training...';

        localStorage.setItem('scanPaid', 'true');
        localStorage.setItem('campaignPaid', 'true');
        localStorage.setItem('accessGranted', 'true');

        setTimeout(() => {
          window.location.href = '/IntroPage.html';
        }, 1200);
      }, 1000);
    });
  }

  // Instant Scroll Handler for Deep Links and Headless Verification
  const urlParams = new URLSearchParams(window.location.search);
  const scrollTarget = urlParams.get('scroll') || (window.location.hash ? window.location.hash.substring(1) : null);
  if (scrollTarget) {
    const el = document.getElementById(scrollTarget);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
      }, 80);
    }
  }

});

