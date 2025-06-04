const nodemailer = require('nodemailer');

// Mock DEERS database
const mockDeers = {
  '1234567890': {
    edipi: '1234567890',
    first_name: 'John',
    last_name: 'Doe',
    email: 'akulaakshay30@gmail.com',
    branch: 'Army',
    rank: 'Sergeant',
    eligibility: 'Eligible',
    deers_id: 'D1234567890'
  },
  '9876543210': {
    edipi: '9876543210',
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@example.com',
    branch: 'Navy',
    rank: 'Lieutenant',
    eligibility: 'Eligible',
    deers_id: 'D9876543210'
  }
};

// Handler for generating magic verification link for any EDIPI
exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: { 'Allow': 'POST' }, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  // Parse incoming payload
  let data;
  try {
    data = JSON.parse(event.body);
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  // Determine EDIPI: use provided or fallback to first mock record
  let edipi = data.edipi;
  if (!edipi || !mockDeers[edipi]) {
    const firstKey = Object.keys(mockDeers)[0];
    console.log(`DEBUG: EDIPI '${edipi}' invalid or missing, falling back to first mock DEERS '${firstKey}'`);
    edipi = firstKey;
  }

  const user = mockDeers[edipi];
  console.log(`DEBUG: using mock DEERS user =`, user);

  // Construct magic link for verification page
  const baseUrl = process.env.BASE_URL || (process.env.URL ? `https://${process.env.URL}` : 'http://localhost:8888');
  const magicLink = `${baseUrl}/verify.html?edipi=${encodeURIComponent(edipi)}`;

  // Prepare email credentials and transport
  const emailUser = process.env.EMAIL_USER || process.env.GMAIL_USER || 'akulaakshay30@gmail.com';
  const emailPass = process.env.EMAIL_PASSWORD || process.env.GMAIL_PASSWORD;
  console.log('DEBUG: email credentials =', { emailUser, passConfigured: !!emailPass });
  if (!emailPass) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Email password not configured' }) };
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: emailUser, pass: emailPass }
  });
  const mailOptions = {
    from: emailUser,
    to: user.email,
    subject: 'Your VetBlade Magic Link',
    text: `Hello ${user.first_name} ${user.last_name},\n\nClick to verify your DEERS data: ${magicLink}`
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('DEBUG: magic link email sent to', user.email);
    return { statusCode: 200, body: JSON.stringify({ magicLink, message: 'Magic link sent', email: user.email }) };
  } catch (err) {
    console.error('ERROR: sending magic link email', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to send email', details: err.message }) };
  }
}; 