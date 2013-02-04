var express = require('express');
var app = express.createServer(express.logger());

var mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost/test';
var collections = ['mcas'];
var db = require('mongojs').connect(mongoURI, collections);

app.get('/', function(request, response) {
  db.mcas.find().limit(1, function(err, doc) {
    response.send(doc);
  });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
