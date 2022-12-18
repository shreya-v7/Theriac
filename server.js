const express = require('express');
const ejs = require('ejs');
const path = require('path');
const app = express();

const { google } = require("googleapis");
const request = require("request");
const cors = require("cors");
const urlParse = require("url-parse");
const queryParse = require("query-string");
const axios = require("axios");
const { response } = require('express');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


require('dotenv').config();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const MongoDBURI = process.env.MONGO_URI || 'mongodb+srv://shreya:shreya@cluster0.xazu1vc.mongodb.net/test';

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
// listen on port 3000
app.listen(process.env.PORT || 3000, () => {
  console.log('Express app listening on port 3000');
});


app.get("/profile/steps", (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    "526239954558-s67oqg3k5r1hea9ngvqe4kp40ngckhot.apps.googleusercontent.com",
    "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",
    "http://localhost:3000/profile/steps"
  )
  const scopes = ["https://www.googleapis.com/auth/fitness.activity.read profile email openid"]
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    state: JSON.stringify({
      callbackUrl: req.body.callbackUrl,
      userID: req.body.userid
    })
  })
  request(url, (err, response, body) => {
    console.log("error", err);
    res.send({ url });
  })
})