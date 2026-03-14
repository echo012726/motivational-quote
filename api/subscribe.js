/**
 * Subscribe API Endpoint
 * Handles subscription requests and stores subscribers
 * 
 * POST /api/subscribe
 * Body: { "email": "user@example.com", "name": "John", "frequency": "daily" }
 */

const fs = require('fs');
const path = require('path');

const SUBSCRIBERS_FILE = path.join(__dirname, 'subscribers.json');

// Load subscribers
function loadSubscribers() {
    if (!fs.existsSync(SUBSCRIBERS_FILE)) {
        return [];
    }
    try {
        const data = fs.readFileSync(SUBSCRIBERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

// Save subscribers
function saveSubscribers(subscribers) {
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
}

// Validate email
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Handler for POST request
async function handleSubscribe(request) {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }
    
    if (request.method !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
    
    try {
        const body = JSON.parse(request.body || '{}');
        const { email, name, frequency = 'daily' } = body;
        
        // Validate required fields
        if (!email || !isValidEmail(email)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Valid email is required' })
            };
        }
        
        // Load existing subscribers
        const subscribers = loadSubscribers();
        
        // Check if already subscribed
        const existingIndex = subscribers.findIndex(s => s.email.toLowerCase() === email.toLowerCase());
        
        if (existingIndex >= 0) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    message: 'You\'re already subscribed!',
                    subscriber: subscribers[existingIndex]
                })
            };
        }
        
        // Add new subscriber
        const newSubscriber = {
            email: email.toLowerCase(),
            name: name || '',
            frequency,
            subscribedAt: new Date().toISOString(),
            status: 'active'
        };
        
        subscribers.push(newSubscriber);
        saveSubscribers(subscribers);
        
        console.log(`✅ New subscriber: ${email} (${frequency})`);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: 'Successfully subscribed!',
                subscriber: newSubscriber
            })
        };
        
    } catch (error) {
        console.error('Subscribe error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
}

// Handler for GET request (list subscribers - protected)
async function handleGetSubscribers(request) {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    };
    
    // In production, add authentication
    const subscribers = loadSubscribers();
    
    // Return sanitized list (without full email for privacy in logs)
    const sanitized = subscribers.map(s => ({
        email: s.email.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
        name: s.name,
        frequency: s.frequency,
        status: s.status
    }));
    
    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
            count: subscribers.length,
            subscribers: sanitized 
        })
    };
}

module.exports = { handleSubscribe, handleGetSubscribers, loadSubscribers };
