// Fallback data for veterans rucksack
const veteranServices = require('../veteran_services.json');

exports.handler = async function(event, context) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, body: '' };
  }
  // Check GET
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }
  
  // Upstash URL and token
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  
  // Ensure env vars
  if (!redisUrl || !redisToken) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Missing Upstash environment variables' }) };
  }
  
  try {
    // Construct baseUrl
    const baseUrl = redisUrl.startsWith('http://') || redisUrl.startsWith('https://') ? redisUrl : `https://${redisUrl}`;
    const scanUrl = `${baseUrl}/scan/0?match=*&count=100`;
    const scanRes = await fetch(scanUrl, { headers: { Authorization: `Bearer ${redisToken}` } });
    const scanJson = await scanRes.json();
    const keys = scanJson.data || [];
    // Fallback if no keys
    if (keys.length === 0) {
      const fallback = veteranServices.map(s => ({ name: s.name, website: s.website || '#', phone: s.phone || 'N/A' }));
      return { statusCode: 200, body: JSON.stringify(fallback) };
    }
    // Fetch each key's value
    const items = [];
    for (const key of keys) {
      const getRes = await fetch(`${baseUrl}/get/${encodeURIComponent(key)}`, { headers: { Authorization: `Bearer ${redisToken}` } });
      const getJson = await getRes.json();
      let value = getJson.result;
      try { value = JSON.parse(value); } catch {}
      items.push(value);
    }
    return { statusCode: 200, body: JSON.stringify(items) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}; 