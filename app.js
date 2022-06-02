const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const routes = require('./routes/contact');

const app = express();
const port = 3000;

// konfigurasi flash
app.use(cookieParser('secrert'));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('foto'));
app.use(express.urlencoded({ extended: true }));

// setup method override
app.use(methodOverride('_method'));

app.use('/', routes);

app.use((req, res) => {
  res.status(404);
  res.send('<h1 style="text-align: center";>404</h1>');
});

app.listen(port, () => {
  console.log(`Contact App | listening at http://localhost:${port}`);
});
