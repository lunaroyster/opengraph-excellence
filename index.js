const express = require('express');
const crypto = require('crypto');
const axios = require('axios');

const app = new express();

app.use('/useragent', async (req, res) => {
  let useragent = req.headers['user-agent'];
  console.log(useragent);
  res.send(`
  <html>
    <head>
      <meta property="og:title" content="Your user agent is: ${useragent}">
      <meta property="og:description" content="Generated at ${new Date().toString()}">
      <meta name="twitter:card" content="summary_large_image">
    </head>
    <body>
      ${useragent}
    </body>
  </html>
  `);
});

const fetchAsAgent = async (url, agent) => {
  let r = await axios.get(url, {
    headers: {
      ...(agent ? {'User-Agent': agent} : {})
    }
  });
  return {
    userAgent: r.config.headers['User-Agent'],
    length: r.data.length,
    hash: crypto.createHash('md5').update(r.data).digest('hex'),
    // data: r.data,
  };
}

app.use('/prerendering', async (req, res) => {
  const { url } = req.query;
  let results = [];
  results.push(await fetchAsAgent(url));
  results.push(await fetchAsAgent(url, 'Twitterbot'));
  results.push(await fetchAsAgent(url, 'GoogleBot'));
  res.send({results});
})

const server = app.listen(process.env.PORT || 8080, 'localhost');