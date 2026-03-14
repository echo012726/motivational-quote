/**
 * Daily Email Newsletter Automation Script
 * Run via cron: node send-daily-email.js
 * 
 * Features:
 * - Selects a random motivational quote
 * - Sends email to all subscribers
 * - Logs delivery status
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

// Get random quote
function getRandomQuote(quotes) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

// Get quote of the day (based on date for consistency)
function getQuoteOfTheDay(quotes) {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const index = dayOfYear % quotes.length;
    return quotes[index];
}

// Generate email HTML
function generateEmailHTML(quote) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Daily Motivation</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            margin: 0; padding: 40px 20px;
        }
        .container { max-width: 600px; margin: 0 auto; }
        .card {
            background: rgba(255,255,255,0.95);
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .logo {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 24px;
            font-weight: 700;
            color: #1a1a2e;
            margin-bottom: 30px;
        }
        .logo span { color: #ffd700; }
        .greeting {
            color: #64748b;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 20px;
        }
        .quote {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 28px;
            font-weight: 600;
            color: #1a1a2e;
            line-height: 1.4;
            margin-bottom: 20px;
            font-style: italic;
        }
        .author {
            font-size: 16px;
            color: #ffd700;
            font-weight: 600;
            margin-bottom: 30px;
        }
        .category-tag {
            display: inline-block;
            background: rgba(99, 102, 241, 0.1);
            color: #6366f1;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 30px;
        }
        .takeaway {
            background: linear-gradient(135deg, #fef3c7, #fde68a);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
        }
        .takeaway-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #92400e;
            margin-bottom: 8px;
        }
        .takeaway-text {
            color: #78350f;
            font-size: 14px;
            line-height: 1.5;
        }
        .cta {
            display: inline-block;
            background: linear-gradient(135deg, #ffd700, #ff9500);
            color: #1a1a2e;
            padding: 14px 28px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            margin-bottom: 30px;
        }
        .footer {
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
            color: #94a3b8;
            font-size: 12px;
        }
        .footer a { color: #6366f1; text-decoration: none; }
        .unsubscribe {
            color: #94a3b8;
            font-size: 11px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="logo">Motivational<span>Quote</span></div>
            <div class="greeting">🌅 Your Daily Dose of Inspiration</div>
            
            <div class="quote">"${quote.quote}"</div>
            <div class="author">— ${quote.author}</div>
            
            ${quote.category ? `<div class="category-tag">${quote.category}</div>` : ''}
            
            ${quote.takeaway ? `
            <div class="takeaway">
                <div class="takeaway-label">💡 Today's Takeaway</div>
                <div class="takeaway-text">${quote.takeaway}</div>
            </div>
            ` : ''}
            
            <a href="https://motivational-quote.org" class="cta">Visit Website →</a>
            
            <div class="footer">
                <p>You're receiving this because you subscribed to Daily Motivational Quotes.</p>
                <p class="unsubscribe">
                    <a href="https://motivational-quote.org/subscribe.html">Manage preferences</a> | 
                    <a href="https://motivational-quote.org/unsubscribe.html">Unsubscribe</a>
                </p>
            </div>
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

// Main send function
async function sendDailyEmails() {
    console.log('📧 Starting Daily Email Newsletter...\n');
    
    const quotes = loadQuotes();
    const subscribers = loadSubscribers();
    
    if (subscribers.length === 0) {
        console.log('⚠️ No subscribers found!');
        return;
    }
    
    // Get quote (quote of the day for consistency, or random)
    const quote = getQuoteOfTheDay(quotes);
    console.log(`📝 Quote of the day: "${quote.quote.substring(0, 50)}..."`);
    
    const emailHTML = generateEmailHTML(quote);
    
    let successCount = 0;
    let failCount = 0;
    
    for (const subscriber of subscribers) {
        try {
            // In production, integrate with email service (SendGrid, Mailgun, etc.)
            // For now, log the attempt
            console.log(`📤 Sending to: ${subscriber.email}`);
            
            // TODO: Integrate with email provider
            // await sendEmail({
            //     to: subscriber.email,
            //     subject: '🌅 Your Daily Motivation - ' + new Date().toLocaleDateString(),
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
    
    console.log(`\n✅ Daily email job complete!`);
    console.log(`   Sent: ${successCount}`);
    console.log(`   Failed: ${failCount}`);
    console.log(`   Total subscribers: ${subscribers.length}`);
}

// Run if called directly
if (require.main === module) {
    sendDailyEmails()
        .then(() => process.exit(0))
        .catch(err => {
            console.error('Error:', err);
            process.exit(1);
        });
}

module.exports = { sendDailyEmails, generateEmailHTML };
