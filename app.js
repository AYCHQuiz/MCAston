var express = require('express');

var app = express();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
});

var mongo_url = process.env.MONGOLAB_URI || 'mongodb://localhost/test';
var collections = ['mcas'];
var db = require('mongojs').connect(mongo_url, collections);

app.get('/', function(request, response){
  n = Math.floor(Math.random()*1236);
  db.mcas.find().skip(n).limit(1, function(err, docs){
    response.render('index', {imgur: docs[0].imgur});
  });
});

var port = process.env.PORT || 5000;
app.listen(port, function(){
  console.log("Listening on " + port);
});
