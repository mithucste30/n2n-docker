var Queue = require('bull');
var worker = require('./worker');

var redisHost = process.env.REDIS_MASTER_SERVICE_HOST || '127.0.0.1'

var shotQueue = Queue('webshot request', 6379, redisHost);
var responseQueue = Queue('webshot finished', 6379, redisHost);

shotQueue.process(2, function (job, done) {
  console.log('queue request to process ', job.data.url);
  worker(job.data.url, function (err, results) {
    if (err) {
      console.log('error processing', err);
      return done(err);
    }
    console.log('succesfully processed ', job.data.url);
    responseQueue.add(results);
    done(null, results);
  });
});
