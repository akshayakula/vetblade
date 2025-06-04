const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

exports.handler = async function(event, context) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const { name, website, phone } = data;
    if (!name || !website || !phone) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Name, website, and phone are required' }) };
    }

    // Generate a unique key with prefix
    const keySuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const key = `rucksack:${keySuffix}`;

    const item = { name, website, phone };
    // Store the item in Upstash Redis
    const res = await fetch(`${redisUrl}/set/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${redisToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value: JSON.stringify(item) }),
    });
    const json = await res.json();

    if (res.status !== 200) {
      return { statusCode: res.status, body: JSON.stringify({ error: json.error || 'Failed to store item' }) };
    }

    return { statusCode: 200, body: JSON.stringify(item) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};