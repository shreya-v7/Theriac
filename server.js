const express = require('express');
const ejs = require('ejs');
const path = require('path');
const app = express();

require('dotenv').config();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const MongoDBURI = process.env.MONGO_URI || 'mongodb+srv://shreya:shreya@cluster0.xazu1vc.mongodb.net/test';

const { auth } = require('express-openid-connect');

mongoose.connect(MongoDBURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
});

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/views'));

const index = require('./routes/index');
app.use('/', index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'oX2cO-1-xW8G4R8DRy6XWw0LpUDkRrgOKdVEocB4TnCb8QleOn9L96kX1AqMyxAC',
  baseURL: 'http://localhost:3000',
  clientID: 'IT2YaZZyx6RxXHLJi5JzSzxGpfATF9et',
  issuerBaseURL: 'https://dev-p1moxcgohxphkmzy.us.auth0.com'
};

app.get('/test', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// listen on port 3000
app.listen(process.env.PORT || 3000, () => {
  console.log('Express app listening on port 3000');
});