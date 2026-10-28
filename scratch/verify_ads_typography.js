const http = require('http');
const fs = require('fs');
const path = require('path');

async function testUrl(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${urlPath}`, (res) => {
      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          contentType: res.headers['content-type'],
          contentLength: Buffer.concat(data).length,
          bodyText: Buffer.concat(data).toString('utf8')
        });
      });
    }).on('error', reject);
  });
}

async function runVerification() {
  console.log('=== STARTING ADS TYPOGRAPHY & ASSET VERIFICATION ===\n');
  let allPassed = true;

  // 1. Verify Stylesheet links on all pages
  const pages = [
    { name: 'IntroPage.html', path: '/html/IntroPage.html', expectedCss: 'magical-world.css?v=9.0' },
    { name: 'WelcomePage.html', path: '/html/WelcomePage.html', expectedCss: 'magical-world.css?v=9.0' },
    { name: 'CampainPage.html', path: '/html/CampainPage.html', expectedCss: 'magical-world.css?v=9.0' },
    { name: 'BusinessAccount.html', path: '/html/BusinessAccount.html', expectedCss: 'magical-world.css?v=9.0' },
    { name: 'ScanAndPay.html', path: '/html/ScanAndPay.html', expectedCss: 'magical-world.css?v=9.0' },
    { name: 'ThankYouPage.html', path: '/html/ThankYouPage.html', expectedCss: 'magical-world.css?v=9.0' },
    { name: 'Homepage (index.html)', path: '/', expectedCss: 'styles.css?v=21.0' }
  ];

  for (const page of pages) {
    const res = await testUrl(page.path);
    const hasCss = res.bodyText.includes(page.expectedCss);
    if (res.statusCode === 200 && hasCss) {
      console.log(`[PASS] ${page.name}: HTTP 200 & references ${page.expectedCss}`);
    } else {
      console.error(`[FAIL] ${page.name}: HTTP ${res.statusCode}, hasCss: ${hasCss}`);
      allPassed = false;
    }
  }

  // 2. Verify all 6 Advertising Background Images via HTTP
  const assets = [
    '/assets/ads_social_matrix.jpg',
    '/assets/ads_meta_command.jpg',
    '/assets/ads_youtube_campaign.jpg',
    '/assets/ads_enterprise_boardroom.jpg',
    '/assets/ads_global_ecosystem.jpg',
    '/assets/ads_strategy_victory.jpg'
  ];

  console.log('\n--- Checking Background Image Assets ---');
  for (const asset of assets) {
    const res = await testUrl(asset);
    if (res.statusCode === 200 && res.contentType.includes('image') && res.contentLength > 500000) {
      console.log(`[PASS] ${asset}: HTTP 200, ${res.contentType}, size: ${(res.contentLength / 1024 / 1024).toFixed(2)} MB`);
    } else {
      console.error(`[FAIL] ${asset}: HTTP ${res.statusCode}, size: ${res.contentLength}`);
      allPassed = false;
    }
  }

  // 3. Inspect styles.css typography
  console.log('\n--- Checking styles.css Typography ---');
  const stylesCss = fs.readFileSync(path.join(__dirname, '../ui/styles.css'), 'utf8');
  const checksStyles = [
    { label: 'html base font-size 16px', match: /html\s*\{[^}]*font-size:\s*16px/ },
    { label: 'body base font-size 16px', match: /body\s*\{[^}]*font-size:\s*16px/ },
    { label: 'brand main 1.55rem', match: /\.brand-main\s*\{[^}]*font-size:\s*1\.55rem/ },
    { label: 'nav-item 1.05rem', match: /\.nav-item\s*\{[^}]*font-size:\s*1\.05rem/ },
    { label: 'btn-member-login 1.05rem', match: /\.btn-member-login\s*\{[^}]*font-size:\s*1\.05rem/ },
    { label: 'hero pill text 1.15rem', match: /\.hero-pill-text\s*\{[^}]*font-size:\s*1\.15rem/ },
    { label: 'login card title 1.65rem', match: /\.login-card-title\s*\{[^}]*font-size:\s*1\.65rem/ },
    { label: 'card-login-btn 1.12rem', match: /\.card-login-btn\s*\{[^}]*font-size:\s*1\.12rem/ },
    { label: 'pillar-title 1.15rem', match: /\.pillar-title\s*\{[^}]*font-size:\s*1\.15rem/ },
    { label: 'surprise-main-title 1.65rem', match: /\.surprise-main-title[^{]*\{[^}]*clamp\(1\.65rem/ },
    { label: 'pricing-box h2 1.75rem', match: /\.pricing-box h2\s*\{[^}]*font-size:\s*1\.75rem/ },
    { label: 'price-active 2.25rem', match: /\.price-active\s*\{[^}]*font-size:\s*2\.25rem/ }
  ];

  for (const c of checksStyles) {
    if (c.match.test(stylesCss)) {
      console.log(`[PASS] styles.css: ${c.label}`);
    } else {
      console.error(`[FAIL] styles.css: ${c.label}`);
      allPassed = false;
    }
  }

  // 4. Inspect magical-world.css typography
  console.log('\n--- Checking magical-world.css Typography ---');
  const magicCss = fs.readFileSync(path.join(__dirname, '../ui/css/magical-world.css'), 'utf8');
  const checksMagic = [
    { label: 'html base 16px', match: /html\s*\{[^}]*font-size:\s*16px\s*!important/ },
    { label: 'body base 16px', match: /body\s*\{[^}]*font-size:\s*16px\s*!important/ },
    { label: 'h1 clamp(2.6rem, 4.5vw, 3.6rem)', match: /h1[^{]*\{[^}]*clamp\(2\.6rem,\s*4\.5vw,\s*3\.6rem\)/ },
    { label: 'paragraph 1.32rem', match: /p,\s*\.sub-title[^{]*\{[^}]*font-size:\s*1\.32rem/ },
    { label: 'action buttons 1.4rem', match: /\.intro-btn[^{]*\{[^}]*font-size:\s*1\.4rem/ },
    { label: 'pill buttons 1.22rem', match: /\.pill-bg button[^{]*\{[^}]*font-size:\s*1\.22rem/ },
    { label: 'icon circle 52px', match: /\.icon-circle\s*\{[^}]*width:\s*52px/ },
    { label: 'magical nav badge 1.15rem', match: /\.magical-nav-badge\s*\{[^}]*font-size:\s*1\.15rem/ },
    { label: 'footer line 1.08rem', match: /\.footer-line[^{]*\{[^}]*font-size:\s*1\.08rem/ },
    { label: 'popup buttons 1.08rem', match: /\[id\$=\x22-popup\x22\] button\s*\{[^}]*font-size:\s*1\.08rem/ }
  ];

  for (const c of checksMagic) {
    if (c.match.test(magicCss)) {
      console.log(`[PASS] magical-world.css: ${c.label}`);
    } else {
      console.error(`[FAIL] magical-world.css: ${c.label}`);
      allPassed = false;
    }
  }

  console.log(`\n=== OVERALL RESULT: ${allPassed ? 'ALL TESTS PASSED SUCCESSFULLY!' : 'SOME TESTS FAILED'} ===`);
  process.exit(allPassed ? 0 : 1);
}

runVerification().catch(err => {
  console.error('Fatal error during verification:', err);
  process.exit(1);
});
