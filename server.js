var express = require('express'),
app = express(),
notes = require('./routes/notes.js'),
bodyParser = require('body-parser'),
passport = require('passport'),
cookieParser = require('cookie-parser'),
session = require('express-session'),
methodOverride = require('method-override'),
LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
   done(null, user.username);
 });

passport.deserializeUser(function(id, done) {
  done(null, {username: id, email: id + '@example.com'});
});

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({resave: true, secret: 'Code Fellows',
 saveUninitialized: true, }));
app.use(passport.initialize());
app.use(passport.session());

var localPassportStrategy = new LocalStrategy(
  function(username, password, done) {
    console.log('in local strategy');
    notes.findByUsername(username, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Unknown user ' + username }); }
      if (user.password != password) {
        return done(null, false, { message: 'Invalid password' }); }
      return done(null, user);
    });

    var user = {
      username: username,
      email: username + '@example.com',
    };
    return done(null, user);
  });

passport.use(localPassportStrategy);

app.post('/login', passport.authenticate('local'), function(req, res) {
  console.log(req.user);
  res.redirect('/');
});

app.get('/', function(req, res) {
  res.send('Hello There: ' + req.user.username);
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/', function(request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('This is the homepage');
});

app.get('/notes', notes.findAll);
app.get('/notes/:id', notes.findById);
app.post('/notes', notes.addNote);
app.put('/notes/:id', notes.updateNote);
app.patch('/notes/:id', notes.updateNote);
app.delete('/notes/:id', notes.deleteNote);


app.listen(process.env.PORT || 3001, function() {
  console.log('Server has started on PORT 3001');
});
