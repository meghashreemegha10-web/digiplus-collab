// Trigger redeploy: 2026-03-28
require('dotenv').config();
const express = require('express');
const Stripe = require('stripe');
const QRCode = require('qrcode');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
const path = require('path');
const os = require('os');
const app = express();
const stripeKey = process.env.STRIPE_SECRET_KEY;
let stripe = null;
if (stripeKey) {
  stripe = Stripe(stripeKey);
}
const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
let razorpay = null;
if (razorpayKeyId && razorpayKeySecret) {
  razorpay = new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret
  });
}
if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith('SG.')) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const staticOptions = { dotfiles: 'allow' };
let activeSessionUserId = 'shriya_user_01';
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Serve static files (CSS, images, HTML, assets, etc.)
app.use('/ui', express.static(path.join(__dirname, '../ui'), staticOptions));
app.use('/assets', express.static(path.join(__dirname, '../ui/assets'), staticOptions));
app.use('/facebook_covers', express.static(path.join(__dirname, '../ui/facebook_covers'), staticOptions));
app.use('/images', express.static(path.join(__dirname, '../ui/images'), staticOptions));
app.use('/css', express.static(path.join(__dirname, '../ui/css'), staticOptions));
app.use('/js', express.static(path.join(__dirname, '../ui/js'), staticOptions));
app.use('/html', express.static(path.join(__dirname, '../ui/html'), staticOptions));
app.use(express.static(path.join(__dirname, '../ui'), staticOptions));
app.use(express.static(path.join(__dirname, '../ui/html'), staticOptions));

// Serve main modern frontend design at root
app.get(['/', '/index.html'], (req, res) => {
  res.sendFile(path.join(__dirname, '../ui/index.html'), staticOptions);
});

// Standalone Pages
app.get(['/courses', '/courses.html', '/syllabus'], (req, res) => {
  res.sendFile(path.join(__dirname, '../ui/courses.html'), staticOptions);
});

app.get(['/calculator', '/calculator.html', '/roas-calculator'], (req, res) => {
  res.sendFile(path.join(__dirname, '../ui/calculator.html'), staticOptions);
});

app.get(['/pricing', '/pricing.html', '/checkout'], (req, res) => {
  res.sendFile(path.join(__dirname, '../ui/pricing.html'), staticOptions);
});

// Member LoginPage & Auth Pages
app.get(['/LoginPage.html', '/LoginPage', '/login', '/login-page'], (req, res) => {
  res.sendFile(path.join(__dirname, '../ui/html/LoginPage.html'), staticOptions);
});

app.get(['/RegisterPage.html', '/RegisterPage', '/register-page'], (req, res) => {
  res.sendFile(path.join(__dirname, '../ui/html/RegisterPage.html'), staticOptions);
});

app.get(['/ScanAndPay.html', '/ScanAndPay', '/scan-and-pay'], (req, res) => {
  res.sendFile(path.join(__dirname, '../ui/html/ScanAndPay.html'), staticOptions);
});

// Favicon and icon routes
app.get(['/images/icon-7797704_640.JPG', '/favicon.ico', '/favicon.svg'], (req, res) => {
  res.sendFile(path.join(__dirname, '../ui/html/favicon.svg'), staticOptions);
});

// SEO routes
app.get(['/robots.txt', '/sitemap.xml'], (req, res) => {
  res.sendFile(path.join(__dirname, '..', req.path));
});

// One-Click Instant Authorized Login for Shriya
app.get(['/login-as-shriya', '/auto-login', '/member-access', '/direct-login'], (req, res) => {
  activeSessionUserId = 'shriya_user_01';
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Authorizing Shriya...</title>
</head>
<body style="background:#060913; color:#f8fafc; font-family:'Plus Jakarta Sans',sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; margin:0;">
  <div class="creative-bg"></div>
  <div style="position:relative; z-index:2; text-align:center; background:rgba(13,20,38,0.85); border:1px solid rgba(0,242,254,0.3); border-radius:24px; padding:40px; box-shadow:0 20px 50px rgba(0,0,0,0.7);">
    <div style="font-size:2.5rem; margin-bottom:12px;">⚡</div>
    <h2 style="background:linear-gradient(135deg,#fff,#00f2fe); -webkit-background-clip:text; -webkit-text-fill-color:transparent; font-size:1.8rem; margin:0 0 10px 0;">Logging in as Shriya...</h2>
    <p style="color:#94a3b8; font-size:1rem; margin:0 0 20px 0;">All 4 Video Portals & Masterclasses Unlocked</p>
    <div style="width:40px; height:40px; border:3px solid rgba(0,242,254,0.2); border-top-color:#00f2fe; border-radius:50%; animation:spin 0.8s linear infinite; margin:0 auto;"></div>
  </div>
  <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
  <script>
    localStorage.setItem('userId', 'shriya_user_01');
    localStorage.setItem('accessGranted', 'true');
    localStorage.setItem('scanPaid', 'true');
    localStorage.setItem('campaignPaid', 'true');
    localStorage.setItem('paymentStatus', '1499');
    setTimeout(() => {
      window.location.href = '/IntroPage.html';
    }, 600);
  </script>
</body>
</html>`);
});

// Email setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || ''
  }
});

// Twilio setup
const twilioSid = process.env.TWILIO_ACCOUNT_SID;
const twilioToken = process.env.TWILIO_AUTH_TOKEN;
let client = null;
if (twilioSid && twilioToken && twilioSid.startsWith('AC')) {
  client = twilio(twilioSid, twilioToken);
}

// Local JSON file storage fallback for users
const fs = require('fs');
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const usersFilePath = path.join(dataDir, 'users.json');

function getLocalUsers() {
  try {
    if (fs.existsSync(usersFilePath)) {
      const data = fs.readFileSync(usersFilePath, 'utf8');
      return JSON.parse(data || '[]');
    }
  } catch (e) {
    console.error('Error reading users.json:', e);
  }
  return [];
}

function saveLocalUsers(users) {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing users.json:', e);
  }
}

function wrapUserObject(u) {
  if (!u) return null;
  const userObj = { ...u };
  userObj.save = async function() {
    const all = getLocalUsers();
    const idx = all.findIndex(x => x._id === userObj._id);
    if (idx !== -1) {
      all[idx] = { ...userObj };
      delete all[idx].save;
      delete all[idx].select;
      saveLocalUsers(all);
    }
    return userObj;
  };
  userObj.select = function() {
    return userObj;
  };
  return userObj;
}

const LocalUserStore = {
  findOne(query) {
    const promise = (async () => {
      const users = getLocalUsers();
      let found = null;
      if (query.$or) {
        found = users.find(u => {
          return query.$or.some(clause => {
            if (clause.username) {
              if (clause.username.$regex) {
                const re = new RegExp(clause.username.$regex, clause.username.$options || 'i');
                return re.test(u.username);
              }
              return u.username.toLowerCase() === clause.username.toLowerCase();
            }
            if (clause.email) {
              if (clause.email.$regex) {
                const re = new RegExp(clause.email.$regex, clause.email.$options || 'i');
                return re.test(u.email);
              }
              return u.email.toLowerCase() === clause.email.toLowerCase();
            }
            return false;
          });
        });
      } else if (query.email) {
        found = users.find(u => u.email.toLowerCase() === query.email.toLowerCase());
      } else if (query.username) {
        found = users.find(u => u.username.toLowerCase() === query.username.toLowerCase());
      } else if (query.resetToken) {
        found = users.find(u => {
          if (u.resetToken !== query.resetToken) return false;
          if (query.resetTokenExpiry && query.resetTokenExpiry.$gt) {
            return new Date(u.resetTokenExpiry) > query.resetTokenExpiry.$gt;
          }
          return true;
        });
      }
      return wrapUserObject(found);
    })();
    promise.select = function() { return promise; };
    return promise;
  },
  async create(userData) {
    const users = getLocalUsers();
    const newUser = {
      _id: crypto.randomBytes(12).toString('hex'),
      username: userData.username,
      email: userData.email,
      password: userData.password,
      scanPaid: false,
      campaignPaid: false,
      accessGranted: false,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    saveLocalUsers(users);
    return wrapUserObject(newUser);
  },
  findById(id) {
    const promise = (async () => {
      const users = getLocalUsers();
      const found = users.find(u => u._id === id || u._id === String(id));
      return wrapUserObject(found);
    })();
    promise.select = function() { return promise; };
    return promise;
  },
  async findByIdAndUpdate(id, updates) {
    const users = getLocalUsers();
    const idx = users.findIndex(u => u._id === id || u._id === String(id));
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      saveLocalUsers(users);
      return wrapUserObject(users[idx]);
    }
    return null;
  }
};

// MongoDB connection
const mongoUri = process.env.MONGO_URL || 'mongodb://localhost:27017/globaldigipulse';

let warnedMongoFallback = false;
function connectWithRetry() {
  mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 })
    .then(() => console.log('MongoDB connected (mongoose)'))
    .catch(err => {
      if (!warnedMongoFallback) {
        console.log('MongoDB not connected; using local JSON store fallback (server/data/users.json)');
        warnedMongoFallback = true;
      }
      if (process.env.MONGO_URL) {
        setTimeout(connectWithRetry, 60000);
      }
    });
}
connectWithRetry();

let UserMongoose;
try {
  UserMongoose = require(path.join(__dirname, '../models/user.js/user.js'));
} catch (e) {
  const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    scanPaid: { type: Boolean, default: false },
    campaignPaid: { type: Boolean, default: false },
    accessGranted: { type: Boolean, default: false }
  });
  UserMongoose = mongoose.models.User || mongoose.model('User', userSchema);
}

const User = new Proxy({}, {
  get(target, prop) {
    if (mongoose.connection && mongoose.connection.readyState === 1 && UserMongoose) {
      return UserMongoose[prop];
    }
    return LocalUserStore[prop];
  }
});

// Stripe Checkout Session
if (stripe) {
app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: 'Your Product' },
        unit_amount: 1000, // $10.00
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000/cancel',
  });
  res.json({ id: session.id });
});

// QR Code Payment Link
app.get('/payment-qr', async (req, res) => {
  const paymentUrl = 'https://buy.stripe.com/YOUR_REAL_PAYMENT_LINK'; // <-- Replace with your real Stripe payment link
  const qr = await QRCode.toDataURL(paymentUrl);
  res.send(`<img src="${qr}" alt="Scan to Pay">`);
});
}

// Razorpay Order Creation
if (razorpay) {
app.post('/create-razorpay-order', async (req, res) => {
  const options = {
    amount: 1000, // Amount in paise (₹10.00)
    currency: "INR",
    receipt: "order_rcptid_11",
    notes: { brand: "GLOBAL DIGI PULSE" },
    name: "GLOBAL DIGI PULSE",
    description: "Access Program"
  };
  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
}

// Create Razorpay Payment Link for ₹999
app.post('/create-payment-link', async (req, res) => {
  try {
    const { userId, email } = req.body;
    const paymentLink = await razorpay.paymentLink.create({
      amount: 99900, // ₹999 in paise
      currency: 'INR',
      accept_partial: false,
      description: 'GLOBAL DIGI PULSE Access Program',
      customer: {
        name: userId || 'User',
        email: email || '',
      },
      notify: { sms: false, email: true },
      callback_url: 'http://localhost:3000/payment-success',
      callback_method: 'get',
    });
    res.json({ url: paymentLink.short_url });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create payment link', details: err.message });
  }
});

// Razorpay Webhook for payment confirmation
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET; // Set this in Razorpay dashboard and .env
  const signature = req.headers['x-razorpay-signature'];
  const body = req.body;

  // Verify webhook signature
  const expectedSignature = crypto.createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  if (signature === expectedSignature) {
    const event = JSON.parse(body);
    if (event.event === 'payment.captured') {
      // Payment successful, update your DB or trigger notification
      console.log('Payment confirmed:', event.payload.payment.entity);
      // Example: send email, update user status, etc.
    }
    res.status(200).send('Webhook received');
  } else {
    res.status(400).send('Invalid signature');
  }
});

// Razorpay webhook endpoint
app.post('/razorpay-webhook', express.json({ type: 'application/json' }), async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];
  const body = JSON.stringify(req.body);

  const expectedSignature = crypto.createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex');

  if (signature === expectedSignature) {
    const event = req.body.event;
    if (event === 'payment.captured') {
      const payment = req.body.payload.payment.entity;
      // Example: userId or purpose stored in payment.notes
      const userId = payment.notes && payment.notes.userId;
      const purpose = payment.notes && payment.notes.purpose;
      try {
        if (userId) {
          if (purpose === 'campaign') {
            await User.findByIdAndUpdate(userId, { campaignPaid: true });
            console.log('Marked campaignPaid for user', userId);
          } else if (purpose === 'scan') {
            await User.findByIdAndUpdate(userId, { scanPaid: true });
            console.log('Marked scanPaid for user', userId);
          } else {
            // Generic access flag for older payments
            await User.findByIdAndUpdate(userId, { accessGranted: true });
            console.log('Marked accessGranted for user', userId);
          }
        }
        // You can also send confirmation email here
      } catch (err) {
        console.error('Error updating user payment status:', err);
      }
    }
    res.status(200).send('Webhook received');
  } else {
    res.status(400).send('Invalid signature');
  }
});

// Owner notification endpoint
if (client) {
app.post('/payment-notify-owner', async (req, res) => {
  const { paymentId } = req.body;

  // Email notification
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'OWNER_EMAIL@gmail.com',
    subject: 'New Payment Received',
    text: `A new payment was received. Payment ID: ${paymentId}`
  };

  // SMS notification
  const smsOptions = {
    body: `New payment received! Payment ID: ${paymentId}`,
    from: 'YOUR_TWILIO_PHONE_NUMBER',
    to: 'OWNER_MOBILE_NUMBER'
  };

  try {
    await transporter.sendMail(mailOptions);
    await client.messages.create(smsOptions);
    res.status(200).json({ message: 'Owner notified via email and SMS.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send notifications.' });
  }
});
}

app.post('/send-login-thankyou', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required.' });

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(200).json({ message: 'Email skipped (no email credentials configured in .env).' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Thank You for Logging In',
    text: 'Thank you for logging in to GLOBAL DIGI PULSE! We appreciate your interest.'
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Thank you email sent.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

app.post('/send-register-thankyou', async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) return res.status(400).json({ error: 'Email, username, and password required.' });

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(200).json({ message: 'Email skipped (no email credentials configured in .env).' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Thank You for Registering',
    text: `Thank you for registering in GLOBAL DIGI PULSE!\n\nYour credentials:\nUsername: ${username}\nPassword: ${password}\n\nKeep your credentials safe.`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Registration email sent.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

// Registration endpoint
app.post('/register', async (req, res) => {
  let { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ success: false, message: 'Username, email, and password required.' });

  // Trim and lowercase username/email for duplicate check and saving
  username = username.trim().toLowerCase();
  email = email.trim().toLowerCase();

  try {
    // Check if user exists by username or email (case-insensitive)
    const existing = await User.findOne({
      $or: [
        { username: { $regex: `^${username}$`, $options: 'i' } },
        { email: { $regex: `^${email}$`, $options: 'i' } }
      ]
    });
    if (existing) {
      return res.json({ success: false, message: 'User or email already exists.' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Store user (save username/email as trimmed/lowercase)
    const newUser = await User.create({ username, email, password: hashedPassword });
    // Respond to client immediately
    res.json({ success: true, userId: newUser._id });
    // Send credentials email in background (non-blocking)
    const emailEndpoint = 'http://localhost:3000/send-register-thankyou';
    fetch(emailEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password })
    }).catch(err => console.error('Email send error:', err));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed.' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  let { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, message: 'Username and password required.' });

  username = String(username).trim();
  password = String(password).trim();

  // Instant guaranteed match for Shriya / Megha@14
  if (username.toLowerCase() === 'shriya' && (password === 'Megha@14' || password.toLowerCase() === 'megha@14')) {
    activeSessionUserId = 'shriya_user_01';
    return res.json({ 
      success: true, 
      accessGranted: true, 
      userId: 'shriya_user_01', 
      scanPaid: true, 
      campaignPaid: true, 
      paymentStatus: '1499' 
    });
  }

  try {
    // Find user by username or email (case-insensitive)
    const user = await User.findOne({
      $or: [
        { username: { $regex: `^${username}$`, $options: 'i' } },
        { email: { $regex: `^${username}$`, $options: 'i' } }
      ]
    });
    if (!user) {
      return res.json({ success: false, message: 'User not found.' });
    }
    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: 'Incorrect password.' });
    }
    // Send thank you email after successful login
    if (username.includes('@')) {
      fetch('http://localhost:3000/send-login-thankyou', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username })
      }).catch(() => {});
    }
    activeSessionUserId = user._id;
    res.json({ 
      success: true, 
      accessGranted: true, 
      userId: user._id, 
      scanPaid: true, 
      campaignPaid: true, 
      paymentStatus: '1499' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed.' });
  }
});

// Forgot user endpoint
app.post('/forgot-user', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    console.error('Forgot-user: Email required');
    return res.status(400).json({ success: false, error: 'Email required.' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.error('Forgot-user: User not found for email', email);
      return res.json({ success: false, error: 'User not found.' });
    }
    // Generate secure reset token
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour expiry
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();
    // Provide reset link in response (no email)
    // Use absolute URL for reset link
    const baseUrl = req.protocol + '://' + req.get('host');
    const resetLink = `${baseUrl}/reset-password.html?token=${resetToken}`;
    res.json({ success: true, resetLink });
  } catch (error) {
    console.error('Forgot-user: Server error', error);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
});

// Reset username and password endpoint
app.post('/reset-username-password', async (req, res) => {
  const { token, newUsername, newPassword } = req.body;
  if (!token || !newUsername || !newPassword) {
    return res.status(400).json({ success: false, error: 'Token, new username, and new password required.' });
  }
  try {
    const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: new Date() } });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired token.' });
    }
    // Check if new username is taken
    const existing = await User.findOne({ username: newUsername });
    if (existing && existing._id.toString() !== user._id.toString()) {
      return res.status(400).json({ success: false, error: 'Username already taken.' });
    }
    user.username = newUsername;
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error.' });
  }
});

// Create Razorpay order for custom amount, include userId and purpose in notes
app.post('/create-order', async (req, res) => {
  try {
    const { userId, amount, purpose } = req.body;
    if (!razorpay) {
      console.error('Razorpay not initialized. KeyId:', process.env.RAZORPAY_KEY_ID, 'KeySecret:', process.env.RAZORPAY_KEY_SECRET);
      return res.status(500).json({ error: 'Razorpay not initialized' });
    }
    // Determine purpose: prefer explicit 'purpose', else infer from amount
    let orderPurpose = 'access';
    if (purpose) orderPurpose = purpose;
    else if (amount === 149900) orderPurpose = 'campaign';
    else if (amount === 99900) orderPurpose = 'scan';

    try {
      const order = await razorpay.orders.create({
        amount: typeof amount === 'number' && amount > 0 ? amount : 99900, // Use provided amount (in paise) or default to ₹999
        currency: 'INR',
        payment_capture: 1,
        notes: { purpose: orderPurpose, userId: userId || '' }
      });
      console.log('Razorpay order created:', order);
      res.json(order);
    } catch (err) {
      console.error('Razorpay order error:', err, 'KeyId:', process.env.RAZORPAY_KEY_ID, 'KeySecret:', process.env.RAZORPAY_KEY_SECRET);
      res.status(500).json({ error: 'Failed to create order', details: err.message });
    }
  } catch (error) {
    console.error('General /create-order error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

app.get('/check-payment-status', async (req, res) => {
  const paymentId = req.query.payment_id;
  if (!paymentId) return res.json({ verified: false });
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    if (payment.amount === 100000 && payment.status === 'captured') {
      paymentStatus[paymentId] = true;
      res.json({ verified: true });
    } else {
      res.json({ verified: false });
    }
  } catch {
    res.json({ verified: false });
  }
});

// Reset password endpoint
app.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ success: false, error: 'Token and new password required.' });
  }
  try {
    const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: new Date() } });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired token.' });
    }
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error.' });
  }
});

// Serve ResetPassword.html for both /reset-password.html and /ResetPassword.html (case-insensitive)
app.get(/^\/reset-password\.html$/i, (req, res) => {
  res.sendFile(path.join(__dirname, '../ui/html/ResetPassword.html'), staticOptions);
});

// Razorpay Payment Verification Endpoint
app.post('/verify-payment', async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, userId } = req.body;
  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({ success: false, error: 'Missing payment verification data.' });
  }
  try {
    // Generate expected signature
    const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');
    if (generated_signature === razorpay_signature) {
      // Optionally, mark user as paid in DB
      if (userId) {
        await User.findByIdAndUpdate(userId, { accessGranted: true });
      }
      return res.json({ success: true });
    } else {
      return res.status(400).json({ success: false, error: 'Invalid signature.' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
});

// Utility endpoint: Fix accessGranted for users who have paid but missing flag
app.post('/fix-access-granted', async (req, res) => {
  try {
    // Find all payments with userId in notes and status 'captured'
    const payments = await razorpay.payments.all({ from: 0 }); // fetch all payments
    let updated = 0;
    for (const payment of payments.items) {
      if (payment.status === 'captured' && payment.notes && payment.notes.userId) {
        const user = await User.findById(payment.notes.userId);
        if (user && !user.accessGranted) {
          await User.findByIdAndUpdate(payment.notes.userId, { accessGranted: true });
          updated++;
        }
      }
    }
    res.json({ success: true, updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint to query user payment status
app.get('/user-access-status', async (req, res) => {
  const userId = req.query.userId || activeSessionUserId || 'shriya_user_01';
  try {
    const user = await User.findById(userId).select('scanPaid campaignPaid accessGranted');
    if (!user) return res.json({ scanPaid: true, campaignPaid: true, accessGranted: true });
    res.json({ scanPaid: !!user.scanPaid, campaignPaid: !!user.campaignPaid, accessGranted: !!user.accessGranted });
  } catch (err) {
    res.json({ scanPaid: true, campaignPaid: true, accessGranted: true });
  }
});

function getNetworkIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  const netIp = getNetworkIp();
  console.log(`\n==================================================`);
  console.log(`Global Digi Pulse server running at:`);
  console.log(`  - Local:   http://localhost:${PORT}/`);
  console.log(`  - Network: http://${netIp}:${PORT}/`);
  console.log(`==================================================\n`);
});
