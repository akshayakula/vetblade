const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
// Load veteran services fallback data
const veteranServices = require('../veteran_services.json');

exports.handler = async function(event, context) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, body: '' };
  }

  // Debug presence of Upstash environment variables
  if (!redisUrl || !redisToken) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Missing Upstash environment variables",
        hasRedisUrl: !!redisUrl,
        hasRedisToken: !!redisToken
      })
    };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    // Ensure UPSTASH URL has protocol
    const baseUrl = redisUrl.startsWith('http://') || redisUrl.startsWith('https://') ? redisUrl : `https://${redisUrl}`;
    console.log("DEBUG: baseUrl =", baseUrl);
    // DEBUG: Construct scan URL (fetch all keys)
    const scanUrl = `${baseUrl}/scan/0?match=*&count=100`;
    console.log("DEBUG: scanUrl =", scanUrl);
    const scanRes = await fetch(scanUrl, {
      headers: { Authorization: `Bearer ${redisToken}` }
    });
    console.log("DEBUG: scanRes.status =", scanRes.status);
    const scanJson = await scanRes.json();
    console.log("DEBUG: scanJson =", scanJson);
    const keys = scanJson.data || [];
    console.log("DEBUG: keys length =", keys.length, "keys =", keys);

    // If no entries in Redis, return fallback from veteran_services.json
    if (keys.length === 0) {
      console.log("DEBUG: No keys found, using veteran_services.json fallback list");
      const fallback = veteranServices.map(s => ({
        name: s.name,
        website: s.website || '#',
        phone: s.phone || 'N/A'
      }));
      return { statusCode: 200, body: JSON.stringify(fallback) };
    }

    // Fetch each key's value
    const items = [];
    for (const key of keys) {
      console.log("DEBUG: fetching value for key =", key);
      const getRes = await fetch(`${baseUrl}/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${redisToken}` }
      });
      const getJson = await getRes.json();
      let value = getJson.result;
      try { value = JSON.parse(value); } catch {}
      items.push(value);
    }
    console.log("DEBUG: items fetched count =", items.length, "items =", items);

    return { statusCode: 200, body: JSON.stringify(items) };
  } catch (err) {
    console.log("DEBUG: handler error =", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}; 