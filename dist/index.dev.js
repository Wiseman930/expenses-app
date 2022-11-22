"use strict";

var express = require("express");

var exphbs = require("express-handlebars");

var bodyParser = require("body-parser");

var flash = require("express-flash");

var session = require("express-session");

var app = express();

var myFunction = require('./expenses');

var shortCode = require('short-unique-id');

var pgp = require("pg-promise")();

var uid = new shortCode({
  length: 6
});
var useSSL = false;
var local = process.env.LOCAL || false;

if (process.env.DATABASE_URL && !local) {
  useSSL = true;
}

var DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:pg1999@localhost:5432/expenses";
var config = {
  connectionString: DATABASE_URL
  /* ssl: {
     rejectUnauthorized: false,
   },*/

};
var db = pgp(config);
var expensesFunction = myFunction(db);
app.engine("handlebars", exphbs.engine({
  defaultLayout: "main"
}));
app.use(session({
  secret: "string for session in http",
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.set("view engine", "handlebars");
app.use(express["static"]("public"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.get('/', function (req, res) {
  res.render('register');
});
app.post('/waiter', function _callee(req, res) {
  var firstName, lastName, Email, code, format, emailFormat, wordCount, emailCount;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          firstName = req.body.fname;
          lastName = req.body.lname;
          Email = req.body.Email;
          code = uid();
          format = /^[A-Za-z]+$/;
          emailFormat = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
          _context.next = 8;
          return regeneratorRuntime.awrap(db.one('SELECT COUNT(*) FROM register WHERE first_name=$1', [firstName.toUpperCase()]));

        case 8:
          wordCount = _context.sent;
          _context.next = 11;
          return regeneratorRuntime.awrap(db.one('SELECT COUNT(*) FROM register WHERE email=$1', [Email.toUpperCase()]));

        case 11:
          emailCount = _context.sent;

          if (format.test(firstName) == true && format.test(lastName) == true && emailFormat.test(Email) == true && wordCount.count == 0 && emailCount.count == 0) {
            expensesFunction.registerAll(firstName.toUpperCase(), lastName.toUpperCase(), Email.toUpperCase(), code);
            req.flash('code', "This is your login code : " + code);
            res.redirect('/');
          } else if (format.test(firstName) == false && format.test(lastName) == false && emailFormat.test(Email) == false) {
            req.flash('errors', 'Enter your first name, last name and email');
            res.redirect('/');
          } else if (firstName == '' || lastName == '' || Email == '') {
            req.flash('errors', 'Enter your first name, last name and email');
            res.redirect('/');
          } else if (wordCount.count !== 0 || emailCount.count !== 0) {
            req.flash('errors', "One of the credntials already exist");
            res.redirect('/');
          }

        case 13:
        case "end":
          return _context.stop();
      }
    }
  });
});
app.get('/login', function (req, res) {
  res.render('login');
});
app.get('/allocate', function _callee2(req, res) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.t0 = res;
          _context2.t1 = req.session.user;
          _context2.next = 4;
          return regeneratorRuntime.awrap(expensesFunction.dropdownExpenses());

        case 4:
          _context2.t2 = _context2.sent;
          _context2.t3 = {
            user: _context2.t1,
            dropdown: _context2.t2
          };

          _context2.t0.render.call(_context2.t0, 'allocate', _context2.t3);

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
});
app.post('/allocate_user', function _callee3(req, res) {
  var session_data, user_id, expense_type, expesne_amount, expense_date;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          session_data = req.session.user;

          if (session_data != undefined) {
            user_id = session_data.id;
          }

          expense_type = req.body.expense;
          expesne_amount = req.body.Amount;
          expense_date = req.body.date; // console.log(expense_type, expesne_amount, expense_date)

          _context3.next = 7;
          return regeneratorRuntime.awrap(expensesFunction.allocateExpense(expense_type, expesne_amount, expense_date, user_id));

        case 7:
          res.redirect('allocate');

        case 8:
        case "end":
          return _context3.stop();
      }
    }
  });
});
app.post('/login', function _callee4(req, res) {
  var codeNumber, codeCount, user;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          codeNumber = req.body.codeNumber;
          _context4.next = 3;
          return regeneratorRuntime.awrap(db.one('SELECT COUNT(*) FROM register WHERE code=$1', [codeNumber]));

        case 3:
          codeCount = _context4.sent;

          if (!(codeNumber != '')) {
            _context4.next = 8;
            break;
          }

          _context4.next = 7;
          return regeneratorRuntime.awrap(db.oneOrNone('SELECT * FROM register WHERE code=$1', [codeNumber]));

        case 7:
          user = _context4.sent;

        case 8:
          if (codeCount.count == 1) {
            req.session.user = user;
            res.redirect('allocate');
          } else if (codeCount.count == 0) {
            req.flash('errors', "Enter Login code");
            res.redirect('login');
          }

        case 9:
        case "end":
          return _context4.stop();
      }
    }
  });
});
app.get('/user_data', function _callee5(req, res) {
  var session_data, user_id, data;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          session_data = req.session.user;

          if (session_data != undefined) {
            user_id = session_data.id;
          }

          _context5.next = 4;
          return regeneratorRuntime.awrap(expensesFunction.expenseData(user_id));

        case 4:
          data = _context5.sent;
          res.render('user_data', {
            data: data
          });

        case 6:
        case "end":
          return _context5.stop();
      }
    }
  });
});
var PORT = process.env.PORT || 3007;
app.listen(PORT, function () {
  console.log('App starting on port', PORT);
});