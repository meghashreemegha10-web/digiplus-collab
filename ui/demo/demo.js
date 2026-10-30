/**
 * GLOBAL DIGI PULSE — INTERACTIVE DEMO CONTROLLER
 * Full 10-Step Customer Journey State Engine & Interaction Controller
 */

const DEMO_STEPS = [
  {
    stepNum: 1,
    phase: 'ENTRY',
    badge: 'STEP 01 • WEBSITE ENTRY & VALUE DISCOVERY',
    title: 'Land on Global Digi Pulse & Discover the Ecosystem',
    desc: 'The visitor arrives on the official homepage. They are greeted by the flagship headline, verified social proof metrics, and three specialized learning tracks designed to scale digital advertising.',
    ctaText: 'Explore Available Masterclasses →',
    urlPath: 'https://globaldigipulse.com/index.html',
    hudTag: 'LANDING PAGE • HERO ECOSYSTEM',
    cards: [
      { icon: '🌟', title: 'Curated Social Proof', desc: 'Over 12,400+ active marketers enrolled with 4.9/5 verified community rating.' },
      { icon: '🚀', title: 'Clear Value Proposition', desc: 'Direct access to proven 3-second hook frameworks and ban-proof BM compliance.' },
      { icon: '⚡', title: 'Zero Friction Entry', desc: 'Instant 1-click exploration into the complete marketing curriculum without mandatory registration walls.' }
    ]
  },
  {
    stepNum: 2,
    phase: 'SELECTION',
    badge: 'STEP 02 • SERVICE & CURRICULUM SELECTION',
    title: 'Select Your Specialized Growth Masterclass Track',
    desc: 'The user browses the targeted curriculum modules. Each track addresses a specific bottleneck: viral creative fatigue, BM tax & compliance, or high-intent video ad scaling.',
    ctaText: 'Confirm Selection & Proceed to Checkout →',
    urlPath: 'https://globaldigipulse.com/index.html#curriculum',
    hudTag: 'CURRICULUM CATALOG • TRACK SELECTOR',
    cards: [
      { icon: '📷', title: 'Track 1: Instagram Hooks', desc: 'Deploy 84.5% scroll-stopping psychological angles for viral Reels and Stories.' },
      { icon: '🌐', title: 'Track 2: Verified BM & GST', desc: 'Configure enterprise-grade Facebook Business Managers and legally waive 18% GST ad tax.' },
      { icon: '▶️', title: 'Track 3: YouTube Skippable', desc: 'Master in-stream video ads, search intent clustering, and scale conversions with maximum ROAS.' }
    ]
  },
  {
    stepNum: 3,
    phase: 'CHECKOUT',
    badge: 'STEP 03 • TRANSPARENT ORDER BREAKDOWN',
    title: 'Review Syllabus, Special Member Pricing & GST Waiver',
    desc: 'The user transitions to the dedicated checkout page. The system calculates transparent introductory discounts (80% Off) and applies certified 18% GST tax exemption savings.',
    ctaText: 'Select Payment Method & Pay ₹499 →',
    urlPath: 'https://globaldigipulse.com/html/IntroPage.html?option=1',
    hudTag: 'ORDER CHECKOUT • 18% GST WAIVED',
    cards: [
      { icon: '💰', title: '80% Member Fee Waiver', desc: 'Standard curriculum fee discounted from ₹2,499 to ₹499 for lifetime video access.' },
      { icon: '🛡️', title: 'Certified GST Tax Savings', desc: 'Saves ₹18,000 on every ₹1,00,000 in ad spend directly on Meta billing invoices.' },
      { icon: '🔒', title: '256-Bit Encrypted Gateways', desc: 'Full support for Instant UPI, Credit/Debit cards, and NetBanking with bank-grade security.' }
    ]
  },
  {
    stepNum: 4,
    phase: 'PAYMENT',
    badge: 'STEP 04 • INSTANT UPI QR CLEARANCE',
    title: 'Scan Dynamic UPI QR & Real-Time Webhook Verification',
    desc: 'The system renders a dynamic UPI QR code. The user scans the code using GPay, PhonePe, Paytm, or BHIM. Automated webhooks listen and clear the transaction instantaneously.',
    ctaText: 'Simulate UPI Clearance & Issue Fast-Pass →',
    urlPath: 'https://globaldigipulse.com/html/ScanAndPay.html',
    hudTag: 'SECURE GATEWAY • LIVE UPI WEBHOOK',
    cards: [
      { icon: '📱', title: 'Universal UPI Compatibility', desc: 'Instantly readable by all Indian banking apps, UPI IDs, and digital wallets.' },
      { icon: '⚡', title: 'Sub-Second Webhook Sync', desc: 'Eliminates screenshot review queues with automated server payment verification.' },
      { icon: '🧾', title: 'Official Digital Receipt', desc: 'Generates instant GSTIN-compliant payment verification and session authorizations.' }
    ]
  },
  {
    stepNum: 5,
    phase: 'ONBOARDING',
    badge: 'STEP 05 • AUTOMATED FAST-PASS ACTIVATION',
    title: 'Instant Fast-Pass Student Credentials Provisioned',
    desc: 'Payment confirmation triggers automatic session provisioning. The system creates the student ID, assigns credentials, and prepares immediate single sign-on access.',
    ctaText: 'Proceed to Student Portal Login →',
    urlPath: 'https://globaldigipulse.com/html/WelcomePage.html',
    hudTag: 'ACCOUNT PROVISIONING • FAST-PASS ISSUED',
    cards: [
      { icon: '⚡', title: 'Instant 5-Second Dispatch', desc: 'Direct credential generation eliminates long registration forms and verification delays.' },
      { icon: '🔐', title: 'Encrypted Single Sign-On', desc: 'Dedicated token authorization valid for lifetime access across desktop and mobile devices.' },
      { icon: '📁', title: 'Curriculum Vault Pre-Loaded', desc: 'All masterclass videos, Notion blueprints, and SOP checklists unlocked immediately.' }
    ]
  },
  {
    stepNum: 6,
    phase: 'AUTHENTICATION',
    badge: 'STEP 06 • MEMBER PORTAL LOGIN',
    title: 'Secure Student Authentication & Session Validation',
    desc: 'The user logs into the member portal using their verified fast-pass credentials. Single sign-on validates identity and unlocks the private execution workspace.',
    ctaText: 'Sign In to Student Workspace →',
    urlPath: 'https://globaldigipulse.com/html/LoginPage.html',
    hudTag: 'MEMBER AUTHENTICATION • SSO GATEWAY',
    cards: [
      { icon: '👤', title: 'Pre-Filled Fast-Pass Keys', desc: 'Authorized credentials automatically sync for 1-click frictionless sign-in.' },
      { icon: '🛡️', title: 'Session Token Protection', desc: 'Multi-layer session integrity shielding student privacy and account safety.' },
      { icon: '🔑', title: 'Instant Password Recovery', desc: 'Built-in OTP credential recovery if students ever misplace login access.' }
    ]
  },
  {
    stepNum: 7,
    phase: 'WORKSPACE',
    badge: 'STEP 07 • STUDENT DASHBOARD OVERVIEW',
    title: 'Access Your Member Hub & Learning Roadmap',
    desc: 'Upon successful login, the member enters their dedicated dashboard. Key metrics, enrolled modules, upcoming curriculum lessons, and direct launch actions are immediately visible.',
    ctaText: 'Launch Video Masterclass Studio →',
    urlPath: 'https://globaldigipulse.com/html/Dashboard.html',
    hudTag: 'MEMBER DASHBOARD • WORKSPACE HUB',
    cards: [
      { icon: '📊', title: 'Live Progress Tracking', desc: 'Visual milestones showing completed modules, active courses, and quiz assessments.' },
      { icon: '🎯', title: 'Personalized Action Queue', desc: 'Next recommended lesson pre-queued for seamless continuation.' },
      { icon: '💬', title: 'Direct Mentor Support', desc: '24/7 dedicated support channel for quick campaign troubleshooting and asset reviews.' }
    ]
  },
  {
    stepNum: 8,
    phase: 'CURRICULUM',
    badge: 'STEP 08 • VIDEO MASTERCLASS & THEORY BLUEPRINTS',
    title: 'Stream Full HD Video Lessons & Download SOP Toolkits',
    desc: 'The user streams high-definition video masterclasses covering tactical implementation. Accompanying theoretical blueprints, Notion campaign matrices, and UGC scripts are available on-demand.',
    ctaText: 'Proceed to Campaign Builder Studio →',
    urlPath: 'https://globaldigipulse.com/html/CampainPage.html',
    hudTag: 'HD VIDEO PLAYER • THEORY BLUEPRINTS',
    cards: [
      { icon: '▶️', title: '1080p HD Video Playback', desc: 'Tactical video lessons featuring step-by-step screen recording and variable playback speeds.' },
      { icon: '📚', title: 'Downloadable Notion SOPs', desc: 'Pre-built campaign trackers, hook testing matrices, and audit worksheets.' },
      { icon: '🎬', title: 'Plug & Play UGC Scripts', desc: 'Proven creator scripts engineered specifically for high-conversion direct response.' }
    ]
  },
  {
    stepNum: 9,
    phase: 'EXECUTION',
    badge: 'STEP 09 • CAMPAIGN BUILDER & AI OPTIMIZATION',
    title: 'Configure Meta Ad Campaigns & Autonomous AI Bidding',
    desc: 'The user transitions to hands-on execution. They choose campaign goals, set daily budgets, configure 3-second hook angles, and preview automated AI scaling up to 6.4X ROAS.',
    ctaText: 'Deploy Campaign with 6.4X ROAS →',
    urlPath: 'https://globaldigipulse.com/html/BusinessAccount.html',
    hudTag: 'CAMPAIGN BUILDER • AI BIDDING ENGINE',
    cards: [
      { icon: '🎯', title: 'Dynamic Objective Mapping', desc: 'Tailor campaigns for high-intent lead generation, DTC purchase scaling, or viral reach.' },
      { icon: '⚡', title: 'Predictive AI Smart Bidding', desc: 'Autonomous algorithm adjusts bid caps dynamically to prevent budget burning overnight.' },
      { icon: '📈', title: 'Real-Time ROAS Projection', desc: 'Instant calculation of estimated leads, acquisition costs, and revenue multiples.' }
    ]
  },
  {
    stepNum: 10,
    phase: 'COMPLETION',
    badge: 'STEP 10 • SUCCESSFUL LAUNCH & GRADUATION',
    title: 'Campaign Live, 6.4X ROAS Verified & Certificate Issued',
    desc: 'The complete user journey concludes. The ad campaign is deployed with full Meta CAPI telemetry, 18% GST waiver active, and the student receives their verified Certificate of Completion.',
    ctaText: 'Restart Complete Journey Walkthrough ↺',
    urlPath: 'https://globaldigipulse.com/html/ThankYouPage.html',
    hudTag: 'JOURNEY COMPLETED • CERTIFICATE ISSUED',
    cards: [
      { icon: '🏆', title: 'Verified Certification', desc: 'Official Certificate of Achievement issued in Social Media Marketing & Meta Ads Mastery.' },
      { icon: '🛡️', title: 'Ban-Proof Account Guard', desc: 'Enterprise backup admin architecture safeguarding active ad accounts from random bans.' },
      { icon: '📈', title: 'Continuous Scaling Playbook', desc: 'Lifetime access to community updates, new hook drops, and algorithm adaptivity.' }
    ]
  }
];

let currentStep = 0;
let selectedTrackOption = 1;
let selectedGateway = 'upi';
let campaignDailyBudget = 1500;
let qrTimerSeconds = 299;
let qrTimerInterval = null;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  renderTimelineNodes();
  goToStep(0);
  setupEventListeners();
});

// Render Timeline Nodes in Navigation Bar
function renderTimelineNodes() {
  const track = document.getElementById('timelineStepsTrack');
  if (!track) return;

  track.innerHTML = '';
  DEMO_STEPS.forEach((step, idx) => {
    const node = document.createElement('button');
    node.type = 'button';
    node.className = 'step-node' + (idx === 0 ? ' is-active' : '');
    node.id = 'stepNode' + idx;
    node.onclick = () => goToStep(idx);

    node.innerHTML = `
      <span class="step-node-num">${step.stepNum < 10 ? '0' + step.stepNum : step.stepNum}</span>
      <span>${step.phase}</span>
    `;

    track.appendChild(node);

    if (idx < DEMO_STEPS.length - 1) {
      const arrow = document.createElement('span');
      arrow.className = 'step-connector-arrow';
      arrow.textContent = '→';
      track.appendChild(arrow);
    }
  });

  // Render Bottom Dock Dots
  const dockDots = document.getElementById('dockDots');
  if (dockDots) {
    dockDots.innerHTML = '';
    DEMO_STEPS.forEach((_, idx) => {
      const dot = document.createElement('span');
      dot.className = 'dock-dot' + (idx === 0 ? ' is-active' : '');
      dot.id = 'dockDot' + idx;
      dot.onclick = () => goToStep(idx);
      dockDots.appendChild(dot);
    });
  }
}

// Navigate to a specific step (0-9)
function goToStep(index) {
  if (index < 0 || index >= DEMO_STEPS.length) return;
  currentStep = index;
  const data = DEMO_STEPS[index];

  // 1. Update Top Header Progress
  const progressText = document.getElementById('progressStepText');
  const progressFill = document.getElementById('progressBarFill');
  if (progressText) progressText.innerHTML = `Step <strong>${data.stepNum}</strong> of 10`;
  if (progressFill) progressFill.style.width = `${((index + 1) / 10) * 100}%`;

  // 2. Update Timeline Nodes
  for (let i = 0; i < DEMO_STEPS.length; i++) {
    const node = document.getElementById('stepNode' + i);
    const dot = document.getElementById('dockDot' + i);
    if (node) {
      node.classList.remove('is-active', 'is-completed');
      if (i === index) node.classList.add('is-active');
      else if (i < index) node.classList.add('is-completed');
    }
    if (dot) {
      dot.classList.remove('is-active');
      if (i === index) dot.classList.add('is-active');
    }
  }

  // 3. Update Text & Meta
  const badgeEl = document.getElementById('stageStepBadge');
  const titleEl = document.getElementById('stageMainTitle');
  const descEl = document.getElementById('stageMainDesc');
  const ctaBtn = document.getElementById('stagePrimaryBtn');
  const ctaText = document.getElementById('stagePrimaryBtnText');
  const hudUrl = document.getElementById('screenHudUrl');
  const hudTag = document.getElementById('screenHudTag');

  if (badgeEl) badgeEl.innerHTML = `<span>${data.badge}</span>`;
  if (titleEl) {
    titleEl.style.opacity = '0';
    setTimeout(() => {
      titleEl.textContent = data.title;
      titleEl.style.opacity = '1';
    }, 100);
  }
  if (descEl) {
    descEl.style.opacity = '0';
    setTimeout(() => {
      descEl.textContent = data.desc;
      descEl.style.opacity = '1';
    }, 100);
  }
  if (ctaText) ctaText.textContent = data.ctaText;
  if (hudUrl) hudUrl.textContent = data.urlPath;
  if (hudTag) hudTag.textContent = data.hudTag;

  // 4. Update Screen Views
  for (let i = 0; i < 10; i++) {
    const view = document.getElementById('journeyView' + i);
    if (view) {
      if (i === index) {
        view.classList.add('is-active');
      } else {
        view.classList.remove('is-active');
      }
    }
  }

  // 5. Update 3 Feature Cards
  for (let c = 0; c < 3; c++) {
    const cardTitle = document.getElementById('demoCardTitle' + c);
    const cardDesc = document.getElementById('demoCardDesc' + c);
    if (cardTitle && data.cards[c]) {
      cardTitle.innerHTML = `<span>${data.cards[c].icon}</span> <span>${data.cards[c].title}</span>`;
    }
    if (cardDesc && data.cards[c]) {
      cardDesc.textContent = data.cards[c].desc;
    }
  }

  // 6. Update Bottom Dock Buttons
  const btnPrev = document.getElementById('btnDockPrev');
  const nextLabel = document.getElementById('btnDockNextLabel');
  if (btnPrev) {
    btnPrev.style.visibility = (index === 0) ? 'hidden' : 'visible';
  }
  if (nextLabel) {
    if (index < DEMO_STEPS.length - 1) {
      const nextStep = DEMO_STEPS[index + 1];
      nextLabel.textContent = `Next: Step ${nextStep.stepNum} (${nextStep.phase})`;
    } else {
      nextLabel.textContent = 'Restart Journey ↺';
    }
  }

  // Step-Specific Behaviors
  if (index === 3) {
    startQrCountdown();
  } else {
    stopQrCountdown();
  }

  if (index === 7) {
    const v = document.getElementById('curriculumVideoPlayer');
    if (v) v.play().catch(() => {});
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function navigateStep(direction) {
  let next = currentStep + direction;
  if (next >= DEMO_STEPS.length) {
    goToStep(0);
    return;
  }
  if (next < 0) next = 0;
  goToStep(next);
}

// Setup Event Listeners
function setupEventListeners() {
  // Keyboard Left / Right arrow navigation
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight') navigateStep(1);
    if (e.key === 'ArrowLeft') navigateStep(-1);
  });
}

// Step 2: Course Selection
function selectCourseTrack(optionId) {
  selectedTrackOption = optionId;
  const cards = document.querySelectorAll('.course-select-card');
  cards.forEach((c, idx) => {
    c.classList.toggle('is-selected', idx === optionId - 1);
  });

  const titles = [
    'Instagram 3-Sec Hook Formulas & Reels',
    'Verified Facebook BM & 18% GST Exemption',
    'YouTube Skippable Video Ads & ROAS'
  ];
  const summaryTitle = document.getElementById('checkoutSelectedCourseTitle');
  if (summaryTitle) summaryTitle.textContent = titles[optionId - 1];
}

// Step 3: Gateway Selection
function selectGateway(method) {
  selectedGateway = method;
  const tabs = document.querySelectorAll('.gateway-tab-btn');
  tabs.forEach(t => t.classList.remove('is-active'));
  const activeTab = document.getElementById('tabGateway_' + method);
  if (activeTab) activeTab.classList.add('is-active');

  const upiPane = document.getElementById('gatewayPaneUPI');
  const cardPane = document.getElementById('gatewayPaneCard');
  const netPane = document.getElementById('gatewayPaneNet');

  if (upiPane) upiPane.style.display = (method === 'upi') ? 'block' : 'none';
  if (cardPane) cardPane.style.display = (method === 'card') ? 'block' : 'none';
  if (netPane) netPane.style.display = (method === 'net') ? 'block' : 'none';
}

// Step 4: UPI Countdown & Simulated Webhook
function startQrCountdown() {
  stopQrCountdown();
  qrTimerSeconds = 299;
  const timerEl = document.getElementById('qrCountdownText');
  qrTimerInterval = setInterval(() => {
    qrTimerSeconds--;
    if (qrTimerSeconds <= 0) {
      stopQrCountdown();
      if (timerEl) timerEl.textContent = '00:00 (Expired)';
      return;
    }
    const mins = Math.floor(qrTimerSeconds / 60);
    const secs = qrTimerSeconds % 60;
    if (timerEl) {
      timerEl.textContent = `0${mins}:${secs < 10 ? '0' + secs : secs}`;
    }
  }, 1000);
}

function stopQrCountdown() {
  if (qrTimerInterval) {
    clearInterval(qrTimerInterval);
    qrTimerInterval = null;
  }
}

function simulatePaymentWebhook() {
  const statusBadge = document.getElementById('qrWebhookStatusBadge');
  const btn = document.getElementById('btnSimulatePayment');

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span>⚡ Communicating with Bank Webhook...</span>';
  }

  if (statusBadge) {
    statusBadge.innerHTML = `
      <span class="video-hud-pulse" style="background:#38bdf8;"></span>
      <span style="color:#38bdf8;">Processing Webhook from UPI Network...</span>
    `;
  }

  setTimeout(() => {
    if (statusBadge) {
      statusBadge.innerHTML = `
        <span style="color:#34d399; font-weight:800;">✓ ₹499.00 Payment Confirmed & Validated!</span>
      `;
      statusBadge.style.background = 'rgba(52, 211, 153, 0.15)';
      statusBadge.style.borderColor = 'rgba(52, 211, 153, 0.4)';
    }

    if (btn) {
      btn.innerHTML = '<span>✓ Success! Issuing Fast-Pass...</span>';
      btn.style.background = 'linear-gradient(135deg, #10b981, #0284c7)';
    }

    setTimeout(() => {
      goToStep(4);
    }, 1100);
  }, 1400);
}

// Step 5: Copy Fast-Pass
function copyCredentials() {
  const text = "Username: Shriya\nPassword: Megha@14\nPortal: https://globaldigipulse.com/LoginPage.html";
  navigator.clipboard.writeText(text).then(() => {
    showToast('✓ Credentials copied to clipboard!');
  }).catch(() => {
    showToast('✓ Username: Shriya | Password: Megha@14');
  });
}

// Step 6: Form Validation & Login Simulation
function handleLoginSubmit(e) {
  if (e) e.preventDefault();
  const usernameInput = document.getElementById('loginDemoUsername');
  const passwordInput = document.getElementById('loginDemoPassword');
  const alertBox = document.getElementById('loginDemoAlert');
  const btn = document.getElementById('btnLoginSubmitDemo');

  const username = usernameInput ? usernameInput.value.trim() : '';
  const password = passwordInput ? passwordInput.value.trim() : '';

  if (!username || !password) {
    if (alertBox) {
      alertBox.style.display = 'block';
      alertBox.style.color = '#f87171';
      alertBox.textContent = 'Please enter your username and password.';
    }
    return false;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span>Validating Fast-Pass Session...</span>';
  }

  setTimeout(() => {
    if (alertBox) {
      alertBox.style.display = 'block';
      alertBox.style.color = '#34d399';
      alertBox.textContent = '✓ Session Validated! Redirecting to Workspace...';
    }

    setTimeout(() => {
      goToStep(6);
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<span>Sign In to Student Workspace →</span>';
      }
    }, 1000);
  }, 1000);

  return false;
}

// Password toggle
function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input) {
    if (input.type === 'password') {
      input.type = 'text';
      if (btn) btn.textContent = '🙈';
    } else {
      input.type = 'password';
      if (btn) btn.textContent = '👁️';
    }
  }
}

// Step 8: Video chapter selection
function selectCurriculumLesson(lessonNum, videoUrl, title) {
  const player = document.getElementById('curriculumVideoPlayer');
  const source = document.getElementById('curriculumVideoSource');
  const titleEl = document.getElementById('curriculumPlayingTitle');

  if (titleEl) titleEl.textContent = title;
  if (player && source && videoUrl) {
    source.src = videoUrl;
    player.load();
    player.play().catch(() => {});
  }

  const items = document.querySelectorAll('.lesson-playlist-item');
  items.forEach((item, idx) => {
    item.classList.toggle('is-playing', idx === lessonNum - 1);
  });
}

// Step 9: Campaign Builder Dynamic Calculations
function updateBudgetProjection(amount) {
  campaignDailyBudget = parseInt(amount, 10);
  const budgetVal = document.getElementById('budgetSliderValue');
  const estReach = document.getElementById('projReach');
  const estLeads = document.getElementById('projLeads');
  const estRoas = document.getElementById('projRoas');

  if (budgetVal) budgetVal.textContent = '₹' + campaignDailyBudget.toLocaleString('en-IN');
  if (estReach) estReach.textContent = (campaignDailyBudget * 8.5).toLocaleString('en-IN') + ' - ' + (campaignDailyBudget * 14).toLocaleString('en-IN');
  if (estLeads) estLeads.textContent = Math.round(campaignDailyBudget / 2.6).toLocaleString('en-IN') + ' high-intent leads';
  if (estRoas) estRoas.textContent = '6.4X verified';
}

function selectCampaignObjective(objName) {
  const btns = document.querySelectorAll('.campaign-obj-btn');
  btns.forEach(b => b.classList.remove('is-active'));
  const target = document.getElementById('btnObj_' + objName);
  if (target) target.classList.add('is-active');
}

function selectHookStyle(hookName) {
  const btns = document.querySelectorAll('.hook-formula-btn');
  btns.forEach(b => b.classList.remove('is-active'));
  const target = document.getElementById('btnHook_' + hookName);
  if (target) target.classList.add('is-active');

  const adHeadline = document.getElementById('previewAdHeadline');
  if (adHeadline) {
    if (hookName === 'curiosity') {
      adHeadline.textContent = '"Stop running Meta ads until you change this single 3-second setting..."';
    } else if (hookName === 'problem') {
      adHeadline.textContent = '"Here is how we slashed our Cost-Per-Lead to ₹2.60 in 48 hours..."';
    } else {
      adHeadline.textContent = '"From spending ₹50K without profit to scaling at 6.4X ROAS in 14 days."';
    }
  }
}

// Step 10: Download simulated certificate
function downloadCertificate() {
  showToast('🎓 Downloading Verified Certificate of Completion (PDF)...');
  setTimeout(() => {
    showToast('✓ Certificate saved to your device!');
  }, 1200);
}

// Simple Toast Notification
function showToast(message) {
  let toast = document.getElementById('demoToastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'demoToastNotification';
    toast.style.position = 'fixed';
    toast.style.bottom = '85px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = '#0d0a21';
    toast.style.border = '1px solid #7c5cff';
    toast.style.color = '#fff';
    toast.style.padding = '0.65rem 1.4rem';
    toast.style.borderRadius = '999px';
    toast.style.fontSize = '0.875rem';
    toast.style.fontWeight = '600';
    toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.7), 0 0 20px rgba(124,92,255,0.4)';
    toast.style.zIndex = '9999';
    toast.style.transition = 'all 0.3s ease';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.visibility = 'visible';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.visibility = 'hidden';
  }, 2600);
}
