// Mock DEERS database (same as in verify-edipi.js)
const mockDeers = {
  '1234567890': {
    edipi: '1234567890',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
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
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const params = event.queryStringParameters || {};
  const edipi = params.edipi;
  if (!edipi) {
    return { statusCode: 400, body: JSON.stringify({ error: 'EDIPI query parameter is required' }) };
  }

  const record = mockDeers[edipi];
  if (!record) {
    return { statusCode: 404, body: JSON.stringify({ error: 'DEERS data not found for given EDIPI' }) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(record)
  };
}; 