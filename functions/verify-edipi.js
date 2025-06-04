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

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const { edipi } = data;
  if (!edipi) {
    return { statusCode: 400, body: JSON.stringify({ error: 'EDIPI number is required' }) };
  }

  const user = mockDeers[edipi];
  if (!user) {
    return { statusCode: 404, body: JSON.stringify({ error: 'EDIPI not found' }) };
  }

  // Generate a mock magic link that leads to the DEERS verification page
  const baseUrl = process.env.BASE_URL || (process.env.URL ? `https://${process.env.URL}` : 'http://localhost:8888');
  const magicLink = `${baseUrl}/verify.html?edipi=${edipi}`;

  // Send magic link email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: 'akulaakshay30@gmail.com', pass: process.env.GMAIL_PASSWORD }
  });

  const mailOptions = {
    from: 'akulaakshay30@gmail.com',
    to: user.email,
    subject: 'Your VetBlade Magic Link',
    text: `Hello ${user.first_name} ${user.last_name},

Click the link below to access your DEERS information:

${magicLink}

This link will expire in 15 minutes.

Thank you,
VetBlade Team`  
  };

  try {
    await transporter.sendMail(mailOptions);
    return { statusCode: 200, body: JSON.stringify({ message: 'Magic link sent', email: user.email }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}; 