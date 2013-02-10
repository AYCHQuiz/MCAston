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
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(do404);
});

function do404(request, response, next){
    response.status(404);
    response.send('What is the sound of one hand clapping?');
  }

var db = require('mongojs').connect(app.get('secret'), app.get('collections'));

app.get('/', function(request, response){
  if (!request.session.attempts){
    request.session.attempts = [0,0,0,0,0,0,0,0,0,0,0];
    request.session.corrects = [0,0,0,0,0,0,0,0,0,0,0];
  };
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

app.get('/do/:id', function(request, response, next){
  db.mcas.find({id: parseInt(request.params.id)}, function(err, docs){
    if (docs.length == 0){
      do404(request, response);
    } else {
      var imgur = docs[0].imgur;
      request.session.imgur = imgur;
      response.render('single', {imgur: imgur});
    };
  });
});

app.post('/', function(request, response){
  if (!request.session.attempts){
    request.session.attempts = [0,0,0,0,0,0,0,0,0,0,0];
    request.session.corrects = [0,0,0,0,0,0,0,0,0,0,0];
  };
  db.mcas.find({imgur: request.session.imgur}, function(err, docs){
    userAnswer = request.body.answer;
    oldQuestion = docs[0];
    correctAnswer = oldQuestion.answer;
    oldGrade = oldQuestion.grade;
    request.session.attempts[oldGrade]+=1;
    if (userAnswer == correctAnswer){
      request.session.corrects[oldGrade]+=1;
    };
    oldYear = oldQuestion.year;
    oldID = oldQuestion.id;
    n = Math.floor(Math.random()*1236);
    db.mcas.find().skip(n).limit(1, function(err, docs){
      var imgur = docs[0].imgur;
      request.session.imgur = imgur;
      response.send({userAnswer: userAnswer,
                     correctAnswer: correctAnswer,
                     nextImgur: imgur,
                     oldGrade: oldGrade,
                     oldYear: oldYear,
                     oldID: oldID,
                     attempts: request.session.attempts,
                     corrects: request.session.corrects});
    });
  });
});

app.listen(app.get('port'), function(){
  console.log("Listening on " + app.get('port'));
});
