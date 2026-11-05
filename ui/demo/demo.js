/**
 * GLOBAL DIGI PULSE — INTERACTIVE DEMO CONTROLLER
 * Full 5-Step Customer Journey State Engine & Scripted Walkthrough
 * Exactly as presented in "Create Your Global Digi Pulse Account"
 */

const stepDefinitions = [
  {
    stepNum: '01',
    badge: '',
    title: 'Create Your Global Digi Pulse Account',
    desc: '',
    ctaText: 'Complete Registration →',
    ctaLink: '#curriculum',
    hudStep: 'STEP 01 • SIGN UP',
    hudUrl: 'https://globaldigipulse.com/RegisterPage.html',
    showBadge: false,
    cards: [
      { icon: '📚', title: '3 Specialized Masterclasses', desc: 'Choose between Instagram Reels Hooks, Enterprise Verified BM & GST, or YouTube Skippable Ad scaling.' },
      { icon: '💰', title: '80% Member Discount', desc: 'Access any complete masterclass track for ₹499 (Standard curriculum fee ₹2,499).' },
      { icon: '⚡', title: 'Direct Instant Selection', desc: 'One click routes your chosen option directly into the instant order checkout portal.' }
    ]
  },
  {
    stepNum: '02',
    badge: '⚡ STEP 02 • MEMBER LOGIN',
    title: 'Sign In to Continue Your Journey',
    desc: 'Use the newly created username and password to enter the member portal.',
    ctaText: 'Login to Member Portal →',
    ctaLink: '/html/IntroPage.html?option=1',
    hudStep: 'STEP 02 • LOGIN',
    hudUrl: 'https://globaldigipulse.com/LoginPage.html',
    showBadge: false,
    cards: [
      { icon: '⚡', title: 'Instant UPI & Card Gateways', desc: 'Zero-lag support for GPay, PhonePe, Paytm, BHIM, Credit/Debit Cards, and NetBanking.' },
      { icon: '🛡️', title: '18% GST Exemption Waived', desc: 'Official GSTIN tax exemption saves you ₹18,000 on every ₹1,00,000 ad spend directly on invoices.' },
      { icon: '🔒', title: 'Bank-Grade 256-Bit SSL', desc: 'End-to-end encrypted payment clearance with automated instant session activation.' }
    ]
  },
  {
    stepNum: '03',
    badge: '⚡ STEP 03 • MASTERCLASS CATALOG',
    title: 'Choose the Facebook Masterclass',
    desc: 'Open the Facebook Business Manager course from the three available member tracks.',
    ctaText: 'Watch Facebook Intro & Theory →',
    ctaLink: '/html/ScanAndPay.html',
    hudStep: 'STEP 03 • COURSES AVAILABLE',
    hudUrl: 'https://globaldigipulse.com/html/IntroPage.html',
    showBadge: false,
    cards: [
      { icon: '📱', title: 'Universal UPI QR Compatibility', desc: 'Zero-delay QR generated instantly, fully compatible with all Indian banking and UPI apps.' },
      { icon: '⚡', title: 'Real-Time Webhook Verification', desc: 'Automated server verification grants instant session tokens without manual payment screenshot reviews.' },
      { icon: '🧾', title: 'Automated Tax Invoice', desc: 'Receive instant digital payment receipts and tax-compliant invoices upon transaction clearance.' }
    ]
  },
  {
    stepNum: '04',
    badge: '⚡ STEP 04 • FACEBOOK CHECKOUT',
    title: 'Pay ₹499 with Instant UPI',
    desc: 'Confirm the Facebook option, keep Instant UPI selected, and unlock the full masterclass.',
    ctaText: 'Pay ₹499 & Unlock Facebook →',
    ctaLink: '/html/LoginPage.html',
    hudStep: 'STEP 04 • PAYMENT GATEWAY',
    hudUrl: 'https://globaldigipulse.com/html/IntroPage.html?option=2',
    showBadge: false,
    cards: [
      { icon: '⚡', title: 'Automated Credential Dispatch', desc: 'Student credentials and session tokens generated and provisioned in under 5 seconds.' },
      { icon: '🔐', title: 'Single Sign-On Security', desc: 'Dedicated student portal session keys with lifetime curriculum authorization.' },
      { icon: '🚀', title: 'Zero Signup Bottlenecks', desc: 'Bypass cumbersome registration forms and start learning immediately.' }
    ]
  },
  {
    stepNum: '05',
    badge: '⚡ STEP 05 • ACCESS GRANTED',
    title: 'Facebook Masterclass Unlocked',
    desc: 'Payment is confirmed and the complete strategy and blueprint theory is active for streaming.',
    ctaText: 'Masterclass Unlocked & Active →',
    ctaLink: '/html/CampainPage.html',
    hudStep: 'STEP 05 • STREAMING ACCESS ACTIVE',
    hudUrl: 'https://globaldigipulse.com/html/IntroPage.html#facebook',
    showBadge: true,
    cards: [
      { icon: '✓', title: 'Workspace Unlocked', desc: 'The member dashboard is ready without relying on a screen-recording video.' },
      { icon: '→', title: 'Next Lesson Ready', desc: 'Launch the next practical lesson directly from the live UI.' },
      { icon: '📈', title: 'Visible Progress', desc: 'Track course completion, watch time, and support access.' }
    ]
  }
];

let currentActiveStep = 0;

function resetPaymentConfirmation() {
  const shell = document.getElementById('journeyPaymentShell');
  const confirmation = document.getElementById('journeyPaymentConfirmation');
  const status = document.getElementById('journeyConfirmStatus');
  if (shell) shell.classList.remove('is-confirming', 'is-success');
  if (confirmation) confirmation.classList.remove('is-visible');
  if (status) status.textContent = 'Scanning secure UPI response…';
}

function runPaymentConfirmation(button) {
  const shell = document.getElementById('journeyPaymentShell');
  const confirmation = document.getElementById('journeyPaymentConfirmation');
  const status = document.getElementById('journeyConfirmStatus');
  if (!shell || !confirmation) return;
  button.disabled = true;
  shell.classList.add('is-confirming');
  confirmation.classList.add('is-visible');
  if (status) status.textContent = 'Scanning secure UPI response…';
  setTimeout(function() {
    if (status) status.textContent = 'Bank confirmation received';
    shell.classList.add('is-success');
  }, 1050);
  setTimeout(function() {
    button.disabled = false;
    goToStep(4);
  }, 2350);
}

function fitActiveJourneyShot() {
  const stage = document.getElementById('landingDemoStage');
  const shot = stage && stage.querySelector('.journey-shot.is-active');
  if (!stage || !shot) return;
  shot.style.setProperty('--journey-fit-scale', '1');
  const hud = stage.parentElement && stage.parentElement.querySelector('.video-step-hud');
  const hudReserve = hud ? Math.ceil(hud.getBoundingClientRect().height + 26) : 72;
  const centerOffset = Math.round(hudReserve / 2);
  shot.style.setProperty('--journey-center-offset', centerOffset + 'px');
  const availableWidth = Math.max(1, stage.clientWidth - 36);
  const availableHeight = Math.max(1, stage.clientHeight - hudReserve - 28);
  const naturalWidth = Math.max(1, shot.scrollWidth);
  const naturalHeight = Math.max(1, shot.scrollHeight);
  let scale = Math.min(1, availableWidth / naturalWidth, availableHeight / naturalHeight);
  if (shot.matches('.journey-shot--signup, .journey-shot--login, .journey-shot--courses')) {
    scale *= .92;
  }
  scale = Math.max(.38, scale);
  shot.style.setProperty('--journey-fit-scale', String(scale));

  const stageRect = stage.getBoundingClientRect();
  const controls = shot.querySelectorAll('[data-demo-target]');
  let controlBottom = 0;
  controls.forEach(function(control) {
    const rect = control.getBoundingClientRect();
    controlBottom = Math.max(controlBottom, rect.bottom);
  });
  if (controlBottom > stageRect.bottom - 18) {
    const safeTop = stageRect.top + hudReserve;
    const adjustment = (stageRect.bottom - 28 - safeTop) / Math.max(1, controlBottom - safeTop);
    scale = Math.max(.38, scale * adjustment);
    shot.style.setProperty('--journey-fit-scale', String(scale));
  }
}

function goToStep(index) {
  if (index < 0 || index >= stepDefinitions.length) return;
  currentActiveStep = index;
  const data = stepDefinitions[index];
  if (index !== 3) resetPaymentConfirmation();

  // 1. Update text content
  const badgeEl = document.getElementById('optStepBadge');
  const titleEl = document.getElementById('optStepTitle');
  const descEl = document.getElementById('optStepDesc');
  const ctaBtn = document.getElementById('optStepCtaBtn');
  const ctaText = document.getElementById('optStepCtaText');
  const hudStep = document.getElementById('videoHudStep');
  const hudUrl = document.getElementById('videoHudUrl');

  if (badgeEl) badgeEl.innerHTML = '<span>' + data.badge + '</span>';
  if (titleEl) {
    titleEl.style.opacity = '0';
    setTimeout(function() {
      titleEl.textContent = data.title;
      titleEl.style.opacity = '1';
    }, 120);
  }
  if (descEl) {
    descEl.style.opacity = '0';
    setTimeout(function() {
      descEl.textContent = data.desc;
      descEl.style.opacity = '1';
    }, 120);
  }
  if (ctaText) ctaText.textContent = data.ctaText;
  if (ctaBtn) ctaBtn.href = data.ctaLink;
  if (hudStep) hudStep.textContent = data.hudStep;
  if (hudUrl) hudUrl.textContent = data.hudUrl;

  // 2. Update 5 step buttons in the bar
  for (let i = 0; i < stepDefinitions.length; i++) {
    const btn = document.getElementById('stepBtn' + i);
    if (btn) {
      btn.classList.toggle('is-active', i === index);
    }
  }

  // 2b. Highlight step arrows
  const arrows = document.querySelectorAll('.opt-step-arrow');
  arrows.forEach((arr, i) => {
    arr.classList.toggle('is-active-arrow', i === index);
  });

  // 3. Switch live DOM demo state
  document.querySelectorAll('[data-landing-demo-view]').forEach(function(view, viewIndex) {
    view.classList.toggle('is-active', viewIndex === index);
  });
  requestAnimationFrame(fitActiveJourneyShot);

  // 4. Update Floating Badge for Step 5
  const floatingBadge = document.getElementById('optFloatingBadge');
  if (floatingBadge) {
    floatingBadge.style.display = data.showBadge ? 'flex' : 'none';
  }

  // 5. Update Top Header Progress Widget
  const progressText = document.getElementById('progressStepText');
  const progressFill = document.getElementById('progressBarFill');
  if (progressText) progressText.innerHTML = `Step <strong>${index + 1}</strong> of 5`;
  if (progressFill) progressFill.style.width = `${((index + 1) / 5) * 100}%`;

  // 6. Update 3 feature cards
  for (let c = 0; c < 3; c++) {
    const cTitle = document.getElementById('cardTitle' + c);
    const cDesc = document.getElementById('cardDesc' + c);
    if (cTitle && data.cards && data.cards[c]) {
      cTitle.innerHTML = '<span>' + data.cards[c].icon + '</span> <span>' + data.cards[c].title + '</span>';
    }
    if (cDesc && data.cards && data.cards[c]) {
      cDesc.textContent = data.cards[c].desc;
    }
  }

  // 7. Update Bottom Navigation Dock
  const btnPrev = document.getElementById('btnDockPrev');
  const btnNext = document.getElementById('btnDockNext');
  const nextLabel = document.getElementById('btnDockNextLabel');

  if (btnPrev) {
    btnPrev.style.visibility = index === 0 ? 'hidden' : 'visible';
  }
  if (nextLabel) {
    if (index < stepDefinitions.length - 1) {
      const nextStep = stepDefinitions[index + 1];
      nextLabel.textContent = `Next Step: ${index + 2}. ${nextStep.title.split('&')[0].trim()}`;
    } else {
      nextLabel.textContent = 'Finish Walkthrough • Enter Member Portal';
    }
  }
  if (btnNext) {
    btnNext.onclick = () => {
      if (index < stepDefinitions.length - 1) {
        goToStep(index + 1);
      } else {
        window.location.href = '/html/IntroPage.html?option=1';
      }
    };
  }

  // 8. Update Bottom Dock Dots
  const dots = document.querySelectorAll('.dock-dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('is-active', i === index);
  });
}

function navigateStep(direction) {
  const next = currentActiveStep + direction;
  if (next >= 0 && next < stepDefinitions.length) {
    goToStep(next);
  }
}

// Global exposure for walkthrough
window.goToStep = goToStep;
window.navigateStep = navigateStep;
window.fitActiveJourneyShot = fitActiveJourneyShot;
window.runPaymentConfirmation = runPaymentConfirmation;
window.resetPaymentConfirmation = resetPaymentConfirmation;

document.addEventListener('DOMContentLoaded', () => {
  goToStep(0);
  window.addEventListener('resize', fitActiveJourneyShot);
  setTimeout(() => {
    fitActiveJourneyShot();
    const stage = document.getElementById('landingDemoStage');
    if (stage && stage._productWalkthroughInstance) {
      stage._productWalkthroughInstance.start();
    }
  }, 200);
});
