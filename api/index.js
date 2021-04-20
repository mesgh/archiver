const http = require('http');

module.exports = express => {
  const rtr = express.Router();
  rtr
    .route('/request/:N')
    .get((req, res) => {
      const { N } = req.params;
      const reg = /\w{4}/;
      let i = 0;
      let result;
      http.get(`http://kodaktor.ru/api2/buffer2/${N}`, rdStr => {
          rdStr.on('data', chunk => {
            const arr = chunk.toString().match(reg);
            if (arr) {
              result = {
                V2: i,
                string: arr[0]
              }
            }
            i++;
          });
          rdStr.on('end', () => {
            res.writeHead(200, {
              'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({ result }));
          });
        });
    });
  return rtr;
}

