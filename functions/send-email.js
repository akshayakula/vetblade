const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  let data;
  try {
    data = JSON.parse(event.body);
    console.log('Received request body:', data);
  } catch (err) {
    data = {};
    console.log('No or invalid JSON body received. Proceeding with empty data.');
  }

  // Compose the email body from all possible fields, even if missing
  const fields = [
    'first_name',
    'last_name',
    'email',
    'military_status',
    'area_of_interest',
    'relevant_skills',
    'time_commitment',
    'preferred_volunteering_days',
    'additional_info',
    'text'
  ];
  let emailBody = '';
  for (const field of fields) {
    if (data[field]) {
      emailBody += `${field.replace(/_/g, ' ')}: ${data[field]}\n`;
    }
  }
  if (!emailBody) {
    emailBody = 'No data provided.';
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'akulaakshay30@gmail.com',
      pass: process.env.GMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from:'akulaakshay30@gmail.com',
    to: 'akulaakshay30@gmail.com',
    subject: 'Veterans Forge Interest',
    text: emailBody
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}; 