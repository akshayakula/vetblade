const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

exports.handler = async function(event, context) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, body: '' };
  }
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    // Scan for keys with prefix 'rucksack:' across all pages
    let cursor = '0';
    const keys = [];
    do {
      const scanRes = await fetch(`${redisUrl}/scan/${cursor}?match=rucksack:*&count=100`, {
        headers: { Authorization: `Bearer ${redisToken}` }
      });
      const scanJson = await scanRes.json();
      const data = scanJson.data || [];
      keys.push(...data);
      cursor = scanJson.cursor;
    } while (cursor !== '0');

    // Fetch each key's value
    const items = [];
    for (const key of keys) {
      const getRes = await fetch(`${redisUrl}/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${redisToken}` }
      });
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