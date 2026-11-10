import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const money = v => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v / 100);
const sleep = ms => new Promise(r => setTimeout(r, ms));

const PRODUCTS = [
  { id: 'instagram', type: 'course', title: 'Instagram 3-Second Hook Formulas & High-Converting Video Ads', description: 'Reels & creative masterclass — full-length lessons, lifetime access.', amount: 49900, hub: 'BusinessAccount.html' },
  { id: 'facebook', type: 'course', title: 'Verified Facebook Business Manager, GST Exemption & Account Recovery', description: 'Enterprise BM setup, GST exemption & recovery masterclass, lifetime access.', amount: 49900, hub: 'WelcomePage.html' },
  { id: 'youtube', type: 'course', title: 'YouTube Skippable Ads Setup, Slashing CPL & Scaled Conversions', description: 'Video ROI scaling masterclass — skippable ads, smart bidding, lifetime access.', amount: 49900, hub: 'CampainPage.html' }
];

const HUB_BY_OPTION = { 1: 'BusinessAccount.html', 2: 'WelcomePage.html', 3: 'CampainPage.html' };
const HUB_BY_PRODUCT = { instagram: 'BusinessAccount.html', facebook: 'WelcomePage.html', youtube: 'CampainPage.html' };

function unlockFor(productId) {
  const optionId = productId === 'instagram' ? 1 : productId === 'facebook' ? 2 : 3;
  sessionStorage.setItem(`unlocked_option_${optionId}`, 'true');
  localStorage.setItem(`unlocked_option_${optionId}`, 'true');
  localStorage.setItem(`unlocked_platform_${optionId}`, 'true');
  localStorage.setItem('accessGranted', 'true');
  localStorage.setItem('scanPaid', 'true');
  localStorage.setItem('campaignPaid', 'true');
  localStorage.setItem('paymentStatus', '1499');
  localStorage.setItem('gdp_last_purchase', JSON.stringify({ productId, at: Date.now() }));
}

function App() {
  const params = useMemo(() => new URLSearchParams(location.search), []);
  const [selected, setSelected] = useState(() => {
    const p = params.get('product');
    if (p && PRODUCTS.some(x => x.id === p)) return p;
    const o = params.get('option');
    if (o === '2') return 'facebook';
    if (o === '3') return 'youtube';
    return 'instagram';
  });
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState('form');
  const [message, setMessage] = useState('');
  const [method, setMethod] = useState('card');
  const [card, setCard] = useState({ number: '4242 4242 4242 4242', name: 'DEMO USER', expiry: '12/29', cvv: '123', upi: 'demo@okaxis', bank: 'HDFC Bank' });
  const [profile, setProfile] = useState(() => ({ user: { name: localStorage.getItem('name') || 'Member', email: localStorage.getItem('email') || 'member@globaldigipulse.com' }, mode: 'sandbox', billing: { entitlements: { instagram: localStorage.getItem('unlocked_option_1') === 'true', facebook: localStorage.getItem('unlocked_option_2') === 'true', youtube: localStorage.getItem('unlocked_option_3') === 'true' }, orders: JSON.parse(localStorage.getItem('gdp_orders') || '[]') } }));

  const product = useMemo(() => PRODUCTS.find(p => p.id === selected), [selected]);
  const owned = id => localStorage.getItem(`unlocked_option_${id === 'instagram' ? 1 : id === 'facebook' ? 2 : 3}`) === 'true';
  const field = (key, value) => setCard(c => ({ ...c, [key]: value }));

  function valid() {
    if (method === 'upi') return card.upi.includes('@');
    if (method === 'net') return !!card.bank;
    return card.number.replace(/\D/g, '').length >= 16 && card.name.trim().length > 2 && /^\d{2}\/\d{2}$/.test(card.expiry) && /^\d{3,4}$/.test(card.cvv);
  }

  useEffect(() => {
    if (params.get('intent') !== 'hub' || !product) return;
    const optionId = product.id === 'instagram' ? 1 : product.id === 'facebook' ? 2 : 3;
    const alreadyOwned = localStorage.getItem(`unlocked_option_${optionId}`) === 'true' || localStorage.getItem('accessGranted') === 'true';
    if (!alreadyOwned) return;
    setBusy(true); setPhase('processing'); setMessage('Verifying your access…');
    const t = setTimeout(async () => {
      unlockFor(product.id);
      setPhase('success'); setMessage('Payment already complete. Access granted.');
      await sleep(2800);
      location.href = '/' + product.hub;
    }, 1600);
    return () => clearTimeout(t);
  }, [product, params]);

  async function pay() {
    if (!product || owned(product.id)) { setMessage('This masterclass is already unlocked.'); return; }
    if (!valid()) { setMessage('Enter valid demo payment details.'); return; }
    setBusy(true); setPhase('processing'); setMessage('Encrypting payment details…');
    try {
      const r = await fetch('/create-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: localStorage.getItem('userId') || '', amount: product.amount, purpose: 'course_' + product.id, method }) });
      const data = await r.json();
      if (!r.ok) throw Error(data.error || 'Order failed');
      await sleep(850); setMessage(method === 'net' ? 'Connecting to your bank securely…' : method === 'upi' ? 'Awaiting UPI authorization…' : 'Authorizing payment…');
      await sleep(1150);
      const done = await fetch('/verify-payment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ razorpay_payment_id: 'pay_sandbox_' + Date.now(), razorpay_order_id: data.id, razorpay_signature: 'sandbox', userId: localStorage.getItem('userId') || '' }) });
      const result = await done.json();
      if (!done.ok || result.success === false) throw Error(result.error || result.message || 'Verification failed');
      unlockFor(product.id);
      const orders = JSON.parse(localStorage.getItem('gdp_orders') || '[]');
      orders.unshift({ id: data.id, course_id: product.id, amount: product.amount, status: 'paid', created_at: new Date().toISOString() });
      localStorage.setItem('gdp_orders', JSON.stringify(orders.slice(0, 20)));
      setPhase('success'); setMessage('Payment successful. Access granted.');
      await sleep(2800);
      location.href = '/' + product.hub;
    } catch (e) {
      setPhase('form'); setMessage(e.message || 'Payment failed. Please retry.');
    } finally { setBusy(false); }
  }

  return <>
    <header>
      <a href="/IntroPage.html" className="brand">⚡ GLOBAL DIGI PULSE</a>
      <span>Secure checkout</span>
      <div>{profile.user.email}</div>
    </header>
    <main>
      {phase !== 'form' ? <section className={`payment-state ${phase}`}>
        {phase === 'success' ? <>
          <svg className="check-svg" viewBox="0 0 100 100" aria-hidden="true">
            <circle className="check-circle" cx="50" cy="50" r="46" />
            <path className="check-mark" d="M28 52 L44 68 L74 36" fill="none" />
          </svg>
          <h1>Payment Successful</h1>
          <p>{message}</p>
          <div className="confetti"><b /><b /><b /><b /><b /><b /><b /><b /><b /><b /><b /><b /></div>
          <span className="redirect-note">Unlocking your masterclass hub…</span>
        </> : <>
          <div className="state-icon"><i /></div>
          <h1>Processing payment</h1>
          <p>{message}</p>
          <div className="state-lines"><b /><b /><b /></div>
        </>}
      </section> : <>
        <section className="intro">
          <div>
            <p>Choose your access</p>
            <h1>One checkout.<br />Your growth system.</h1>
            <span>Unlock the full masterclass with instant secure access — card or UPI.</span>
          </div>
          <aside>
            <b>Sandbox checkout</b>
            <small>Use the prefilled demo details. They are never sent or stored.</small>
          </aside>
        </section>
        <section className="plans">
          {PRODUCTS.map(p => <button key={p.id} className={`${selected === p.id ? 'selected ' : ''}${owned(p.id) ? 'owned' : ''}`} onClick={() => setSelected(p.id)}>
            <span>Lifetime course</span>
            <h2>{p.title}</h2>
            <p>{p.description}</p>
            <strong>{money(p.amount)}</strong>
            {owned(p.id) && <em>✓ Already unlocked</em>}
          </button>)}
        </section>
        <section className="checkout">
          <div className="pay-form">
            <h2>Payment details</h2>
            <div className="methods">
              <button className={method === 'card' ? 'active' : ''} onClick={() => setMethod('card')}>💳 Debit / Credit Card</button>
              <button className={method === 'upi' ? 'active' : ''} onClick={() => setMethod('upi')}>⚡ UPI</button>
              <button className={method === 'net' ? 'active' : ''} onClick={() => setMethod('net')}>🏦 Net Banking</button>
            </div>
            {method === 'card' ? <>
              <label>Card number<input value={card.number} onChange={e => field('number', e.target.value)} inputMode="numeric" /></label>
              <label>Name on card<input value={card.name} onChange={e => field('name', e.target.value)} /></label>
              <div className="split">
                <label>Expiry<input value={card.expiry} onChange={e => field('expiry', e.target.value)} /></label>
                <label>CVV<input value={card.cvv} onChange={e => field('cvv', e.target.value)} type="password" /></label>
              </div>
            </> : method === 'upi' ? <label>UPI ID<input value={card.upi} onChange={e => field('upi', e.target.value)} placeholder="name@bank" /></label> : <>
              <label>Select your bank
                <select value={card.bank} onChange={e => field('bank', e.target.value)}>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>State Bank of India</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                  <option>Punjab National Bank</option>
                </select>
              </label>
              <small className="net-note">You will be redirected to your bank's secure page to authorize this payment.</small>
            </>}
            {message && <div className="message">{message}</div>}
          </div>
          <div className="total">
            <h2>Order summary</h2>
            <p>{product?.title}</p>
            <span>One-time payment · lifetime access</span>
            <strong>{product ? money(product.amount) : '—'}</strong>
            <button disabled={busy || owned(product?.id)} onClick={pay}>{owned(product?.id) ? 'Already unlocked' : busy ? 'Processing…' : `Proceed to Pay ${product ? money(product.amount) : ''}`}</button>
            <small>🔒 Your payment credentials are not stored by Global Digi Pulse.</small>
          </div>
        </section>
      </>}
    </main>
    <footer>256-bit encrypted transport · Sandbox checkout · No payment credentials stored</footer>
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
