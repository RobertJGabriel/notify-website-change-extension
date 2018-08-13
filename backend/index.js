'use strict'


const request = require('request');
const app = require('express')()

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});




// Default routing file
/**
 * @param  {} '/'
 * @param  {} (req
 * @param  {} res
 */
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(
    JSON.stringify({
      message: 'Nothing to see here!! 😘'
    })
  )
})


app.get('/router', (req, res) => {
  let url = req.query.url;
  console.log(url);
  if (typeof url === 'undefined' || url === null) {
    res.setHeader('Content-Type', 'application/json')
    res.send(
      JSON.stringify({
        message: 'No Paramater',
        length: 0,
        URL: url,
        html: ''
      })
    )
  }


  var options = {
    uri: url ,
    json: true
  };

  request(options, function (error, response, data) {

    if (!error && response.statusCode  == 200) {
      res.setHeader('Content-Type', 'application/json')
      res.send(
        JSON.stringify({
          message: response.headers['last-modified'],
          length: data.length,
          URL: url,
          html: data
        })
      )
    }else{
      res.setHeader('Content-Type', 'application/json')
      res.send(
        JSON.stringify({
          message: 'No Paramater',
          length: data.length,
          URL: url,
          html: data
        })
      );
    }

  });
});


/**
 * @param  {} 'port'
 * @param  {} process.env.PORT||5000
 */
app.set('port', process.env.PORT || 5000);

// Spin up the server
/**
 * @param  {} app.get('port'
 * @param  {} function(
 */
app.listen(app.get('port'), function () {
  console.log('running on port', app.get('port'))
});