const express = require('express');

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
})

const server = app.listen(process.env.PORT || 8080, 'localhost');