const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { PDFDocument } = require('pdf-lib');
const nodemailer = require('nodemailer');
const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "OPTIONS, POST"
};

exports.handler = async function(event, context) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  console.log('DEBUG: fill-and-email invoked, httpMethod =', event.httpMethod, 'body =', event.body);
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  // Parse incoming payload
  let data;
  try {
    data = JSON.parse(event.body);
    console.log('DEBUG: parsed data =', data);
  } catch (err) {
    console.error('ERROR: parsing event.body', err);
    data = {};
  }

  // Use provided EDIPI or fall back to first mock DEERS record
  let edipi = data.edipi;
  if (!edipi || !mockDeers[edipi]) {
    const firstKey = Object.keys(mockDeers)[0];
    console.log(`DEBUG: EDIPI '${edipi}' invalid or missing, falling back to first mock DEERS EDIPI '${firstKey}'`);
    edipi = firstKey;
  }

  // Retrieve user data
  const user = mockDeers[edipi];
  console.log('DEBUG: user record =', user);
  if (!user) {
    return { statusCode: 404, headers: corsHeaders, body: JSON.stringify({ error: 'DEERS data not found for given EDIPI' }) };
  }

  // Always use default form 21-0538
  const selectedForm = {
    id: '4961',
    name: '21-0538',
    url: 'https://www.vba.va.gov/pubs/forms/VBA-21-0538-ARE.pdf'
  };
  console.log('DEBUG: selectedForm =', selectedForm);

  // Download the form PDF
  let pdfBytes;
  try {
    const response = await axios.get(selectedForm.url, { responseType: 'arraybuffer' });
    console.log('DEBUG: downloaded PDF status =', response.status, 'bytes =', response.data.byteLength);
    pdfBytes = response.data;
  } catch (err) {
    console.error('ERROR: downloading PDF', err);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'Failed to download form PDF' }) };
  }

  // Fill out PDF fields
  let filledPdfBytes;
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    console.log('DEBUG: PDF fields count =', fields.length);

    for (const field of fields) {
      const name = field.getName();
      let value = '';

      // Prioritize DEERS data, then payload
      if (user[name]) {
        value = user[name];
      } else if (data[name]) {
        value = data[name];
      } else {
        // Generate value via OpenAI
        try {
          const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: 'You are filling out PDF form fields for a veteran application.' },
              { role: 'user', content: `Generate a plausible value for the field named "${name}".` }
            ],
            max_tokens: 20
          });
          value = completion.choices[0].message.content.trim();
        } catch {
          value = '';
        }
      }
      console.log(`DEBUG: filling field ${name} with value =`, value);

      // Fill text fields only
      if (typeof field.setText === 'function') {
        try {
          field.setText(value);
        } catch (err) {
          // Handle ExceededMaxLengthError by truncating to allowed length
          const match = /maxLength=(\d+)/.exec(err.message);
          if (match) {
            const max = parseInt(match[1], 10);
            const truncated = value.slice(0, max);
            console.log(`DEBUG: Truncating value for field ${name} to ${max} chars:`, truncated);
            try {
              field.setText(truncated);
            } catch (err2) {
              console.error(`ERROR: Could not set truncated text for field ${name}:`, err2);
            }
          } else {
            console.error(`ERROR: setting field ${name}:`, err);
          }
        }
      }
    }

    filledPdfBytes = await pdfDoc.save();
    console.log('DEBUG: filled PDF bytes length =', filledPdfBytes.length);
  } catch (err) {
    console.error('ERROR: filling PDF form', err);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'Failed to fill PDF form' }) };
  }

  // Email the filled PDF
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: 'akulaakshay30@gmail.com', pass: process.env.GMAIL_PASSWORD }
    });

    const mailOptions = {
      from: 'akulaakshay30@gmail.com',
      to: 'akulaakshay30@gmail.com',
      subject: `Filled VA Form ${selectedForm.id}`,
      text: `Attached is the filled form ${selectedForm.name} for EDIPI ${edipi}.`,
      attachments: [
        {
          filename: `${selectedForm.id}.pdf`,
          content: filledPdfBytes,
          contentType: 'application/pdf'
        }
      ]
    };
    console.log('DEBUG: mailOptions =', { subject: mailOptions.subject, to: mailOptions.to, filename: mailOptions.attachments[0].filename });

    await transporter.sendMail(mailOptions);
    console.log('DEBUG: email sent successfully');
  } catch (err) {
    console.error('ERROR: sending email', err);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'Failed to send email' }) };
  }

  return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ message: 'Form filled and emailed successfully', formId: selectedForm.id }) };
};