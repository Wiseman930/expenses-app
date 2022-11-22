
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const session = require("express-session");
let app = express();
const myFunction = require('./expenses')
let shortCode = require('short-unique-id')


const pgp = require("pg-promise")();

let uid = new shortCode({length: 6})


let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
  useSSL = true;
}
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:pg1999@localhost:5432/expenses";

const config = {
  connectionString: DATABASE_URL,
 /* ssl: {
    rejectUnauthorized: false,
  },*/
};

const db = pgp(config);
const expensesFunction = myFunction(db);

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.use(
    session({
      secret: "string for session in http",
      resave: false,
      saveUninitialized: true,
    })
  );
  app.use(flash());
  app.set("view engine", "handlebars");
  app.use(express.static("public"));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

app.get('/', function (req, res) {

  res.render('register');
  });
app.post('/waiter', async function (req, res) {

  let firstName = req.body.fname
  let lastName = req.body.lname
  let Email = req.body.Email
  let code = uid()
  let format = /^[A-Za-z]+$/
  let emailFormat = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/
  let wordCount = await db.one('SELECT COUNT(*) FROM register WHERE first_name=$1', [firstName.toUpperCase()])
  let emailCount = await db.one('SELECT COUNT(*) FROM register WHERE email=$1', [Email.toUpperCase()])


  if (format.test(firstName) == true && format.test(lastName) == true && emailFormat.test(Email) == true && wordCount.count == 0 && emailCount.count == 0) {

   expensesFunction.registerAll(firstName.toUpperCase(), lastName.toUpperCase(), Email.toUpperCase(), code)
   req.flash('code', "This is your login code : " + code)
   res.redirect('/');
  }
  else if (format.test(firstName) == false && format.test(lastName) == false && emailFormat.test(Email) == false){
    req.flash('errors', 'Enter your first name, last name and email')
    res.redirect('/')
  }
  else if (firstName == '' || lastName == '' || Email == ''){
    req.flash('errors', 'Enter your first name, last name and email')
    res.redirect('/')
  }
  else if (wordCount.count !== 0 || emailCount.count !== 0) {

    req.flash('errors', "One of the credntials already exist")
    res.redirect('/');
   }

});

app.get('/login', function (req, res) {
         
  res.render('login');
  });

app.get('/allocate', async function (req, res) {

  res.render('allocate', {
    user: req.session.user,
    dropdown: await expensesFunction.dropdownExpenses()
  });
});

app.post('/allocate_user', async function (req, res) {
  let session_data = req.session.user;
  let user_id;
  if(session_data != undefined){
  user_id = session_data.id;
  }

  let expense_type = req.body.expense;
  let expesne_amount = req.body.Amount;
  let expense_date = req.body.date;
 // console.log(expense_type, expesne_amount, expense_date)

  await expensesFunction.allocateExpense(expense_type, expesne_amount, expense_date, user_id)
  res.redirect('allocate')
  });


app.post('/login',async function (req, res) {
  let codeNumber = req.body.codeNumber
  let codeCount = await db.one('SELECT COUNT(*) FROM register WHERE code=$1', [codeNumber])

  let user;
  if(codeNumber != ''){
  user = await db.oneOrNone('SELECT * FROM register WHERE code=$1', [codeNumber])
  }

  if(codeCount.count == 1){
    req.session.user = user
    res.redirect('allocate')
  }
  else if (codeCount.count == 0){
    req.flash('errors', "Enter Login code")
    res.redirect('login')
  }
  });

  app.get('/user_data', async function (req, res) {
    let session_data = req.session.user;
    let user_id;
    if(session_data != undefined){
    user_id = session_data.id;
    }
    let data = await expensesFunction.expenseData(user_id)

    res.render('user_data', {
      data
    });
  });

let PORT = process.env.PORT || 3007;

app.listen(PORT, function(){
  console.log('App starting on port', PORT);
});