// Email subscription API handler for Vercel
// Integrates with ConvertKit, Mailchimp, or any email service

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, name } = req.body;
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  // Store email (example: Airtable, Google Sheets, or email service)
  // For now, return success - connect to your preferred service below:
  
  /* 
  // Option 1: ConvertKit
  const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
  const FORM_ID = process.env.CONVERTKIT_FORM_ID;
  await fetch(`https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: CONVERTKIT_API_KEY, email, name })
  });
  */

  /* 
  // Option 2: Mailchimp
  const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
  const LIST_ID = process.env.MAILCHIMP_LIST_ID;
  // ... Mailchimp integration
  */

  /* 
  // Option 3: Simple Google Sheets (via Apps Script)
  const SHEET_URL = 'YOUR_GOOGLE_SHEET_WEBHOOK_URL';
  await fetch(SHEET_URL, {
    method: 'POST',
    body: JSON.stringify({ email, name, date: new Date().toISOString() })
  });
  */

  console.log(`New subscriber: ${email}${name ? ' (' + name + ')' : ''}`);
  
  return res.status(200).json({ 
    success: true, 
    message: 'Successfully subscribed! Check your inbox for confirmation.' 
  });
}
