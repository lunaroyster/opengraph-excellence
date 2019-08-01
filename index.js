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
  try {
    let r = await axios.get(url, {
      headers: {
        ...(agent ? {'User-Agent': agent} : {}),
        Accept: '*/*',
      }
    });
    return {
      userAgent: r.config.headers['User-Agent'],
      length: r.data.length,
      hash: crypto.createHash('md5').update(r.data).digest('hex'),
      // data: r.data,
    };
  } catch (e) {
    console.log(e)
    return {
      message: e.message,
    }
  }
}

app.use('/prerendering', async (req, res) => {
  const { url } = req.query;
  let results = [];
  results.push(await fetchAsAgent(url, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36'));
  results.push(await fetchAsAgent(url, 'Twitterbot'));
  results.push(await fetchAsAgent(url, 'DiscordBot'));
  results.push(await fetchAsAgent(url, 'GoogleBot'));
  res.send({results});
})

const server = app.listen(process.env.PORT || 8080, 'localhost');