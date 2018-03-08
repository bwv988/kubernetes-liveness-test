// Demo for Kubernetes Liveness test.

const PORT = process.env.PORT || 8080;

var express = require('express');
var morgan = require('morgan');
var app = express();

app.use(morgan('common'));

app.get('/', function (req, res) {
  res.send('Application is running.\n');
});

app.get('/api/alive', function (req, res) {
  res.send('OK\n');
});

var server = app.listen(PORT, function () {
  console.log('Application launched.');
});


process.on('SIGINT', function onSigint () {
	console.info('Got SIGINT. Graceful shutdown ', new Date().toISOString());
  shutdown();
});


process.on('SIGTERM', function onSigterm () {
  console.info('Got SIGTERM. Graceful shutdown ', new Date().toISOString());
  shutdown();
})

function shutdown() {
  server.close(function onServerClosed (err) {
    if (err) {
      console.error(err);
      process.exitCode = 1;
		}
		process.exit();
  })
}

