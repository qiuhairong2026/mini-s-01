const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const { message } = JSON.parse(event.body);
  const apiKey = process.env.VOLC_API_KEY;
  try {
    const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "Doubao-Seedance-2.5",
        messages: [{ role: "user", content: message }]
      })
    });
    const data = await res.json();
    return {
      statusCode: 200,
      headers: {"Access-Control-Allow-Origin":"*"},
      body: JSON.stringify({ reply: data.choices[0].message.content })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({error:"连接出错，请稍后再试"}) };
  }
};
