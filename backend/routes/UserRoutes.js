const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Activity = require('../models/Activity');
const Stat = require('../models/Stat');
const User = require('../models/usermodel');
const Feedback = require('../models/Feedback');
const ResetToken = require('../models/ResetToken');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { checkEmailBreach } = require('../utils/emailUtils');

// Make JWT Secret securely using the .env file
const JWT_SECRET = process.env.JWT_SECRET || 'cyberguard_ki_secret_key_123';

// --- HELPER FUNCTION: Record Activity ---
async function addActivity(action, status, isPositive, userId = null) {
  try {
    let color = isPositive ? "text-green-400 mt-0.5" : "text-red-400 mt-0.5";
    let icon = isPositive 
      ? "M5 13l4 4L19 7" // Checkmark
      : "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"; // Warning

    await Activity.create({ action, status, color, icon, user: userId });
  } catch (err) {
    console.error("Activity Logging failed (non-critical):", err.message);
  }
}

// [Email Breach Detection Module] - Uses xposedornot npm package (free, no API key needed)
router.post('/check-email', authMiddleware, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    let stat = await Stat.findOne() || new Stat();
    stat.emailsMonitored += 1;
    await stat.save();

    console.log(`[EMAIL CHECK] Checking breaches for: ${email}`);

    // Delegate to emailUtils which uses the xposedornot package
    const result = await checkEmailBreach(email);

    if (result.breached) {
      stat.breachesFound += result.breaches.length;
      await stat.save();
      await addActivity("Email Scan", `${email}: ${result.breaches.length} leaks found`, false, req.user._id);
    } else {
      await addActivity("Email Scan", `${email} is safe`, true, req.user._id);
    }

    // Normalise response to the shape the frontend expects
    const breaches = result.breaches.map(b => ({
      Name: b.breachName,
      BreachDate: b.year || 'Unknown',
      DataClasses: b.exposedData?.length ? b.exposedData : ["Email", "Account Info"]
    }));

    return res.json({
      status: result.breached ? 'breached' : 'safe',
      breaches,
      riskLevel: result.riskLevel,
      riskScore: result.riskScore,
      recommendations: result.recommendations,
    });

  } catch (err) {
    console.error("Email check failure:", err.message);
    res.status(500).json({ error: "Scan system failure: " + err.message });
  }
});

// Helper: stream-search rockyou.txt line by line (handles large file + CRLF)
function searchRockyou(filePath, password) {
  return new Promise((resolve) => {
    const fs = require('fs');
    const readline = require('readline');

    if (!fs.existsSync(filePath)) return resolve(false);

    const lower = password.toLowerCase();
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath, { encoding: 'utf8' }),
      crlfDelay: Infinity  // handles Windows \r\n properly
    });

    let found = false;
    rl.on('line', (line) => {
      if (found) return;
      // Compare both exact and lowercase (rockyou has mixed case)
      const trimmed = line.trim();
      if (trimmed === password || trimmed === lower) {
        found = true;
        rl.close();
      }
    });

    rl.on('close', () => resolve(found));
    rl.on('error', () => resolve(false));
  });
}

// [Breached Password Detection Module] - Local + Online
router.post('/check-password-breach', authMiddleware, async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: "Password required" });

  try {
    const path = require('path');
    const crypto = require('crypto');

    // --- HIBP online check (k-anonymity SHA1) ---
    const hashData = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
    const prefix = hashData.slice(0, 5);
    const suffix = hashData.slice(5);
    let onlineHits = 0;
    try {
      const resp = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`, { timeout: 8000 });
      for (const line of resp.data.split('\n')) {
        if (line.split(':')[0].trim() === suffix) {
          onlineHits = parseInt(line.split(':')[1].trim()) || 1;
          break;
        }
      }
    } catch (hibpErr) {
      console.error('[HIBP] API error:', hibpErr.message);
    }

    // --- Local rockyou.txt stream search ---
    const datasetPath = path.join(__dirname, '../../frontend/public/rockyou.txt');
    const localFound = await searchRockyou(datasetPath, password);

    let stat = await Stat.findOne() || new Stat();
    stat.passwordsAnalyzed += 1;
    await stat.save();

    const isBreached = onlineHits > 0 || localFound;
    let source = [];
    if (localFound) source.push("Local rockyou.txt");
    if (onlineHits > 0) source.push(`HIBP (${onlineHits.toLocaleString()} leaks)`);
    if (!isBreached) source.push("Not found in any database");

    const msg = localFound
      ? "LOCAL DATASET HIT!"
      : onlineHits > 0
        ? `Online Leaks: ${onlineHits}`
        : "Safe";

    await addActivity("PW Breach Check", msg, !isBreached, req.user._id);

    res.json({
      isBreached,
      count: onlineHits,
      foundInLocal: localFound,
      source: source.join(' + ')
    });

  } catch (err) {
    console.error("Password breach check failed:", err.message);
    res.status(500).json({ error: "Check failed: " + err.message });
  }
});

// [Admin Monitoring Module] - Root View (Sees EVERYTHING)
router.get('/admin/stats', authMiddleware, adminOnly, async (req, res) => {
  try {
    const stats = await Stat.findOne() || { emailsMonitored: 0, breachesFound: 0, passwordsAnalyzed: 0 };
    const logs = await Activity.find().populate('user', 'fullName email').sort({ createdAt: -1 }).limit(100);
    const usersCount = await User.countDocuments();
    const feedbacks = await Feedback.find().populate('user', 'fullName email').sort({ createdAt: -1 });
    res.json({ stats, logs, usersCount, feedbacks, systemHealth: "Optimal" });
  } catch (err) { res.status(500).json({ error: "Admin access failed" }); }
});

// [Feedback Module]
router.post('/feedback', authMiddleware, async (req, res) => {
  try {
    const feedback = await Feedback.create({ user: req.user._id, ...req.body });
    await addActivity("Feedback", `Rating: ${req.body.rating}/5 from ${req.user.email}`, true, req.user._id);
    res.status(201).json({ success: true, feedback });
  } catch (err) { res.status(500).json({ error: "Failed to submit feedback" }); }
});

// [Forgot Password Implementation]
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Email not found" });

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await ResetToken.deleteMany({ email }); 
    await ResetToken.create({ email, token: code });

    console.log(`\n[MOCK EMAIL] To: ${email} | CODE: ${code}\n`);
    res.json({ success: true, message: "Reset code sent to email." });
  } catch (err) { res.status(500).json({ error: "Server error" }); }
});

router.post('/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;
  try {
    const validToken = await ResetToken.findOne({ email, token: code });
    if (!validToken) return res.status(400).json({ error: "Invalid or expired code." });

    const user = await User.findOne({ email });
    user.password = newPassword;
    await user.save();
    await ResetToken.deleteMany({ email });
    res.json({ success: true, message: "Password updated successfully." });
  } catch (err) { res.status(500).json({ error: "Reset failed" }); }
});

router.post('/signup', async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: "User exists" });
    const role = email === 'admin@cyberguard.com' ? 'admin' : 'user';
    const user = await User.create({ fullName, email, password, role });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });
    await addActivity("Signup", `Registered as ${role}`, true, user._id);
    res.status(201).json({ success: true, token, user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role } });
  } catch (err) { res.status(500).json({ error: "Signup failed" }); }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
       await addActivity("Failed Login", `Login attempt: ${email}`, false);
       return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });
    await addActivity("User Login", "Session started", true, user._id);
    res.json({ success: true, token, user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role } });
  } catch (err) { res.status(500).json({ error: "Login failed" }); }
});

// [Dashboard Home]
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    let stats = await Stat.findOne() || new Stat();
    // USER ONLY sees their own activities
    const activities = await Activity.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10);
    res.json({ stats, activities });
  } catch (err) { res.status(500).json({ error: "Fetch failed" }); }
});

router.get('/recommendations/:level', async (req, res) => {
  const { level } = req.params;
  const recs = {
    "Low": ["Keep using unique passwords.", "Enable 2FA.", "Monthly scans recommended."],
    "Medium": ["Change password if reused.", "Review leak details.", "Enable 2FA now."],
    "High": ["Change all critical passwords.", "Monitor banking.", "Hardware 2FA."],
    "Very High": ["Consider credit freeze.", "Hard reset primary accounts.", "Audit app permissions."]
  };
  res.json({ recommendations: recs[level] || recs["Low"] });
});

module.exports = router;
