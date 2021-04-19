const express = require('express');
const request = require('request');
const { pipeline, Transform } = require('stream');
const url = require('url');
const zlib = require('zlib');
const app = express();

app
  .use('/', express.static('pages/main'))
  .use('/chat', express.static('pages/chat'))
  .post('/zip', (req, res) => {
    req.pipe(zlib.createGzip()).pipe(res);
  })
  .post('/transform', (req, res) => {
    class Trf extends Transform {
      _transform(chunk, encoding, callback) {
        this.push(chunk.toString().split('').map( char => parseInt(char) + 1).join(''));
        callback();
      }
    }
    const plus_one = new Trf();
    pipeline(req, plus_one, res, () => console.log('done'));
  })
  .get('/pipe', (req, res) => {
    request(url.format({
      protocol: 'https',
      host: 'kodaktor.ru',
      pathname: '/g/forpipe'
    }))
      .pipe(res)
    })
    .use((req, res) => {
      res
      .status(404)
      .set({
        'Content-Type': 'text/html; charset=utf-8'
      })
      .send('<h1 style="aqua">Не найдено!</h1>');
    })
    .listen(process.env.PORT || 80);
    