const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');

const keys = require('./config/keys');
require('./models/User'); //need to run this before passport
require('./services/passport');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, {useMongoClient: true});

const app = express();

app.use(bodyParser.json());

app.use(
  cookieSession({
    maxAge: 7 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

//following tell passport to use cookie
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
// above is same as:
//const authRoutes = require('.routes/authRoutes');
//authRoutes(app)

if (process.env.NODE_ENV === 'production') {
  // Express will sever production assets
  // such as main.js or main.css
  app.user(express.static('client/build'));
  // Express will sever the index.html file
  // if it donest recognize the route
  const path = require('path');
  app.get('*',(req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })

}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
