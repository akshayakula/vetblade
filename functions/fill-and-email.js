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

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  // Parse incoming payload
  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    data = {};
  }

  const edipi = data.edipi;
  if (!edipi) {
    return { statusCode: 400, body: JSON.stringify({ error: 'EDIPI is required' }) };
  }

  // Retrieve user data
  const user = mockDeers[edipi];
  if (!user) {
    return { statusCode: 404, body: JSON.stringify({ error: 'DEERS data not found for given EDIPI' }) };
  }

  // Load forms list
  let formsList;
  try {
    const formsPath = path.join(__dirname, 'va_forms.json');
    formsList = JSON.parse(fs.readFileSync(formsPath));
  } catch {
    return { statusCode: 500, body: JSON.stringify({ error: 'Could not load forms list' }) };
  }

  // Select form based on payload or randomly
  let selectedForm;
  if (data.formId) {
    selectedForm = formsList.find(f => f.id === data.formId);
  } else if (data.formName) {
    selectedForm = formsList.find(f => f.name === data.formName);
  }
  if (!selectedForm) {
    selectedForm = formsList[Math.floor(Math.random() * formsList.length)];
  }

  // Download the form PDF
  let pdfBytes;
  try {
    const response = await axios.get(selectedForm.url, { responseType: 'arraybuffer' });
    pdfBytes = response.data;
  } catch {
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to download form PDF' }) };
  }

  // Fill out PDF fields
  let filledPdfBytes;
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    const fields = form.getFields();

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

      // Fill text fields only
      if (typeof field.setText === 'function') {
        field.setText(value);
      }
    }

    filledPdfBytes = await pdfDoc.save();
  } catch {
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fill PDF form' }) };
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

    await transporter.sendMail(mailOptions);
  } catch {
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to send email' }) };
  }

  return { statusCode: 200, body: JSON.stringify({ message: 'Form filled and emailed successfully', formId: selectedForm.id }) };
};