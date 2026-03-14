/**
 * Unsubscribe API Endpoint
 * Handles unsubscription requests
 * 
 * POST /api/unsubscribe
 * Body: { "email": "user@example.com" }
 */

const fs = require('fs');
const path = require('path');

const SUBSCRIBERS_FILE = path.join(__dirname, 'subscribers.json');

function loadSubscribers() {
    if (!fs.existsSync(SUBSCRIBERS_FILE)) {
        return [];
    }
    try {
        return JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE, 'utf8'));
    } catch (e) {
        return [];
    }
}

function saveSubscribers(subscribers) {
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function handleUnsubscribe(request) {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };
    
    if (request.method === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }
    
    if (request.method !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }
    
    try {
        const body = JSON.parse(request.body || '{}');
        const { email } = body;
        
        if (!email || !isValidEmail(email)) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Valid email is required' }) };
        }
        
        const subscribers = loadSubscribers();
        const index = subscribers.findIndex(s => s.email.toLowerCase() === email.toLowerCase());
        
        if (index < 0) {
            return { 
                statusCode: 200, 
                headers, 
                body: JSON.stringify({ message: 'Already unsubscribed' }) 
            };
        }
        
        // Remove subscriber
        subscribers.splice(index, 1);
        saveSubscribers(subscribers);
        
        console.log(`❌ Unsubscribed: ${email}`);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Successfully unsubscribed' })
        };
        
    } catch (error) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
    }
}

module.exports = { handleUnsubscribe };
