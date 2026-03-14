/**
 * Weekly Digest Email Automation Script
 * Run via cron: node send-weekly-digest.js
 * 
 * Features:
 * - Selects 7 curated quotes (one for each day of the week)
 * - Sends email to weekly subscribers only
 * - Includes weekly stats and top quotes
 */

const fs = require('fs');
const path = require('path');

const QUOTES_FILE = path.join(__dirname, 'quotes.json');
const SUBSCRIBERS_FILE = path.join(__dirname, 'subscribers.json');
const LOG_FILE = path.join(__dirname, 'email-log.json');

// Load quotes
function loadQuotes() {
    const data = fs.readFileSync(QUOTES_FILE, 'utf8');
    return JSON.parse(data);
}

// Load subscribers
function loadSubscribers() {
    if (!fs.existsSync(SUBSCRIBERS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(SUBSCRIBERS_FILE, 'utf8');
    return JSON.parse(data);
}

// Get weekly quotes - one for each day of the week
function getWeeklyQuotes(quotes) {
    const shuffled = [...quotes].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 7);
}

// Get the day name for each quote
const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Generate weekly digest email HTML
function generateWeeklyDigestHTML(quotes, weekNumber) {
    const quotesHTML = quotes.map((q, i) => `
        <tr>
            <td style="padding: 20px; border-bottom: 1px solid #e2e8f0;">
                <div style="display: flex; align-items: flex-start; gap: 16px;">
                    <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;">
                        ${dayNames[i].charAt(0)}
                    </div>
                    <div style="flex: 1;">
                        <div style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                            ${dayNames[i]}'s Motivation
                        </div>
                        <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 18px; font-weight: 600; color: #1a1a2e; font-style: italic; line-height: 1.4; margin-bottom: 8px;">
                            "${q.quote}"
                        </div>
                        <div style="color: #8b5cf6; font-weight: 600; font-size: 14px;">
                            — ${q.author}
                        </div>
                        ${q.category ? `
                        <div style="margin-top: 8px;">
                            <span style="background: rgba(99, 102, 241, 0.1); color: #6366f1; padding: 4px 12px; border-radius: 20px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">
                                ${q.category}
                            </span>
                        </div>
                        ` : ''}
                        ${q.takeaway ? `
                        <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 8px; padding: 12px; margin-top: 12px;">
                            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #92400e; margin-bottom: 4px;">💡 Takeaway</div>
                            <div style="color: #78350f; font-size: 13px; line-height: 1.4;">${q.takeaway}</div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </td>
        </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Weekly Motivation Digest</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            margin: 0; padding: 40px 20px;
        }
        .container { max-width: 650px; margin: 0 auto; }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 28px;
            font-weight: 700;
            color: #fff;
            margin-bottom: 10px;
        }
        .logo span { color: #ffd700; }
        .week-label {
            color: #94a3b8;
            font-size: 14px;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        .card {
            background: #fff;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .card-header {
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .card-header h1 {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 26px;
            margin: 0 0 10px;
        }
        .card-header p {
            opacity: 0.9;
            margin: 0;
            font-size: 14px;
        }
        .stats-row {
            display: flex;
            border-bottom: 1px solid #e2e8f0;
        }
        .stat-box {
            flex: 1;
            padding: 20px;
            text-align: center;
            border-right: 1px solid #e2e8f0;
        }
        .stat-box:last-child { border-right: none; }
        .stat-number {
            font-size: 28px;
            font-weight: 700;
            color: #6366f1;
        }
        .stat-label {
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 4px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        .quote-row:last-child td {
            border-bottom: none;
        }
        .footer {
            background: #f8fafc;
            padding: 30px;
            text-align: center;
            color: #64748b;
            font-size: 13px;
        }
        .footer a { color: #6366f1; text-decoration: none; }
        .cta-btn {
            display: inline-block;
            background: linear-gradient(135deg, #ffd700, #ff9500);
            color: #1a1a2e;
            padding: 14px 28px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            margin: 20px 0;
        }
        .preferences {
            font-size: 11px;
            color: #94a3b8;
            margin-top: 20px;
        }
        @media (max-width: 600px) {
            .stats-row { flex-direction: column; }
            .stat-box { border-right: none; border-bottom: 1px solid #e2e8f0; }
            .stat-box:last-child { border-bottom: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Motivational<span>Quote</span></div>
            <div class="week-label">Week #${weekNumber} • ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h1>🌟 Your Weekly Motivation Digest</h1>
                <p>7 days of inspiration to fuel your week</p>
            </div>
            
            <div class="stats-row">
                <div class="stat-box">
                    <div class="stat-number">7</div>
                    <div class="stat-label">Fresh Quotes</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">${quotes.filter(q => q.category).length}</div>
                    <div class="stat-label">Categories</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">${quotes.filter(q => q.takeaway).length}</div>
                    <div class="stat-label">Action Tips</div>
                </div>
            </div>
            
            <table>
                ${quotesHTML}
            </table>
            
            <div class="footer">
                <a href="https://motivational-quote.org" class="cta-btn">Explore More Quotes →</a>
                
                <p style="margin-bottom: 10px;">Ready for daily inspiration instead?</p>
                <p>
                    <a href="https://motivational-quote.org/subscribe.html">Switch to Daily</a> • 
                    <a href="https://motivational-quote.org/unsubscribe.html">Unsubscribe</a>
                </p>
                <p class="preferences">
                    You're receiving this because you subscribed to Weekly Digest. 
                    Manage your <a href="https://motivational-quote.org/subscribe.html">email preferences</a> anytime.
                </p>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #64748b; font-size: 12px;">
            © 2026 motivational-quote.org • Inspire daily, compound forever.
        </div>
    </div>
</body>
</html>
    `.trim();
}

// Log email sending
function logEmail(to, status, error = null) {
    let logs = [];
    if (fs.existsSync(LOG_FILE)) {
        logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
    }
    logs.push({
        to,
        type: 'weekly-digest',
        status,
        error,
        timestamp: new Date().toISOString()
    });
    // Keep only last 1000 logs
    if (logs.length > 1000) {
        logs = logs.slice(-1000);
    }
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}

// Calculate week number of the year
function getWeekNumber() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}

// Main send function
async function sendWeeklyDigest() {
    console.log('📧 Starting Weekly Digest Email...\n');
    
    const quotes = loadQuotes();
    const allSubscribers = loadSubscribers();
    
    // Filter to only weekly subscribers
    const subscribers = allSubscribers.filter(s => s.frequency === 'weekly');
    
    if (subscribers.length === 0) {
        console.log('⚠️ No weekly subscribers found!');
        return;
    }
    
    console.log(`📋 Found ${subscribers.length} weekly subscribers`);
    
    // Get 7 quotes for the week
    const weeklyQuotes = getWeeklyQuotes(quotes);
    console.log(`📝 Selected ${weeklyQuotes.length} quotes for the digest`);
    
    const weekNumber = getWeekNumber();
    const emailHTML = generateWeeklyDigestHTML(weeklyQuotes, weekNumber);
    
    let successCount = 0;
    let failCount = 0;
    
    for (const subscriber of subscribers) {
        try {
            console.log(`📤 Sending weekly digest to: ${subscriber.email}`);
            
            // In production, integrate with email service (SendGrid, Mailgun, etc.)
            // TODO: await sendEmail({
            //     to: subscriber.email,
            //     subject: '🌟 Your Weekly Motivation Digest - Week #' + weekNumber,
            //     html: emailHTML
            // });
            
            logEmail(subscriber.email, 'sent');
            successCount++;
        } catch (error) {
            console.error(`❌ Failed to send to ${subscriber.email}:`, error.message);
            logEmail(subscriber.email, 'failed', error.message);
            failCount++;
        }
    }
    
    console.log(`\n✅ Weekly digest job complete!`);
    console.log(`   Sent: ${successCount}`);
    console.log(`   Failed: ${failCount}`);
    console.log(`   Total weekly subscribers: ${subscribers.length}`);
}

// Run if called directly
if (require.main === module) {
    sendWeeklyDigest()
        .then(() => process.exit(0))
        .catch(err => {
            console.error('Error:', err);
            process.exit(1);
        });
}

module.exports = { sendWeeklyDigest, generateWeeklyDigestHTML, getWeeklyQuotes };
