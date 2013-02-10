var express = require('express');

var app = express();

app.configure(function(){
  app.set('secret', process.env.MONGOLAB_URI || 'mongodb://localhost/test');
  app.set('collections', ['mcas']);
  app.set('port', process.env.PORT || 5000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.limit('1kb'));
  app.use(express.bodyParser());
  app.use(express.cookieParser(app.get('secret')));
  app.use(express.session());
  app.use(express.static(__dirname + '/public'));
});

var db = require('mongojs').connect(app.get('secret'), app.get('collections'));

app.get('/', function(request, response){
  if (request.session.imgur){
    response.render('index', {imgur: request.session.imgur});
  } else {
    n = Math.floor(Math.random()*1236);
    db.mcas.find().skip(n).limit(1, function(err, docs){
      var imgur = docs[0].imgur;
      request.session.imgur = imgur;
      response.render('index', {imgur: imgur});
    });
  };
});

app.get('/do/:id', function(request, response){
  db.mcas.find({id: parseInt(request.params.id)}, function(err, docs){
    var imgur = docs[0].imgur;
    request.session.imgur = imgur;
    //response.send(imgur);
    response.render('index', {imgur: imgur});
  });
});

app.post('/', function(request, response){
  db.mcas.find({imgur: request.session.imgur}, function(err, docs){
    userAnswer = request.body.answer;
    correctAnswer = docs[0].answer;
    n = Math.floor(Math.random()*1236);
    db.mcas.find().skip(n).limit(1, function(err, docs){
      var imgur = docs[0].imgur;
      request.session.imgur = imgur;
      response.send({userAnswer: userAnswer,
                     correctAnswer: correctAnswer,
                     nextImgur: imgur});
    });
  });
});

app.get('*', function(request, response){
  response.status(404);
  response.send('What is the sound of one hand clapping?');
});

app.listen(app.get('port'), function(){
  console.log("Listening on " + app.get('port'));
  //console.log(app.routes);
});
