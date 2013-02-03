var express = require('express');
var app = express.createServer(express.logger());

var MongoClient = require('mongodb').MongoClient;
var mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost/test';
MongoClient.connect(mongoURI, function(err, db) {
    console.log(mongoURI);
    db.collectionNames(function(err, collections) {
	console.log(collections);
      });
    app.get('/', function(request, response) {
    db.collection("mcas").findOne(function(err, result) {
	response.send(result);
      });
    });
  });



var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
    });
