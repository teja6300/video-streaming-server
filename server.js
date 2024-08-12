const express = require('express');
const request = require('request'); 
const app = express();
const PORT = process.env.PORT || 3000;

const videoUrls = [
  "https://d1mq5dy0cocnal.cloudfront.net/assets/1276861b-96ed-4618-a774-02e554987342/HLS/master.m3u8",
  "https://d1mq5dy0cocnal.cloudfront.net/assets/3e24d510-5b5d-4746-9340-2061964ca318/HLS/master.m3u8",
  "https://d1mq5dy0cocnal.cloudfront.net/assets/8854f3e7-43ad-46d5-9eb7-9ebf9c819a4d/HLS/master.m3u8",
  "https://d1mq5dy0cocnal.cloudfront.net/assets/c08a5097-71db-4942-957a-1a7a0df34c49/HLS/master.m3u8",
  "https://d1mq5dy0cocnal.cloudfront.net/assets/022d9744-d5da-4157-b9e0-3f94bbd994e5/HLS/master.m3u8"
];

app.use(express.static('public'));

app.get('/video-urls', (req, res) => {
  res.json(videoUrls);
});

app.get('/video-proxy', (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl || !videoUrls.includes(videoUrl)) {
    return res.status(400).send('Invalid video URL');
  }

  request(videoUrl)
    .on('response', (response) => {
      res.setHeader('Content-Type', response.headers['content-type']);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    })
    .on('error', (err) => {
      console.error('Error while proxying video:', err);
      res.sendStatus(500);
    })
    .pipe(res);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
