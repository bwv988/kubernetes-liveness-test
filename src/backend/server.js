// Demo for Kubernetes Liveness test.

const PORT = process.env.PORT || 8080;

var express = require('express');
var morgan = require('morgan');

// Use the Express fwk.
var app = express();

// Logger.
app.use(morgan('common'));

app.get('/', function (req, res) {
  res.send('Application is running.\n');
});

// Liveness probe.
app.get('/api/alive', function (req, res) {
  res.send('ALIVE\n');
});

// Readiness probe.
app.get('/api/ready', function (req, res) {
  res.send('READY\n');
});

// Manually shutdown.
app.get('/api/shutdown', function (req, res) {
  console.info('Shutting down...')
  shutdown(); 
});

var server = app.listen(PORT, function () {
  console.log('Application launched.');
});

// Signal handling.
process.on('SIGINT', function onSigint () {
	console.info('Got SIGINT. Graceful shutdown ', new Date().toISOString());
  shutdown();
});


process.on('SIGTERM', function onSigterm () {
  console.info('Got SIGTERM. Graceful shutdown ', new Date().toISOString());
  shutdown();
})

// Gracefully shutdown app.
function shutdown() {
  server.close(function onServerClosed (err) {
    if (err) {
      console.error(err);
      process.exitCode = 1;
		}
		process.exit();
  })
}

