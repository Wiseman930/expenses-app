"use strict";

module.exports = function waitersWorking(db) {
  function registerAll(firstName, lastName, Email, code) {
    var insertRegisters;
    return regeneratorRuntime.async(function registerAll$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(db.none('INSERT INTO register(first_name, last_name, email, code) values($1, $2, $3, $4)', [firstName, lastName, Email, code]));

          case 2:
            insertRegisters = _context.sent;

          case 3:
          case "end":
            return _context.stop();
        }
      }
    });
  }

  function allocateExpense(expense_type, expesne_amount, expense_date, user_id) {
    var allocate_expenses;
    return regeneratorRuntime.async(function allocateExpense$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(db.none('INSERT INTO allocate (expense, amount, expense_date, users_id) values($1, $2, $3, $4)', [expense_type, expesne_amount, expense_date, user_id]));

          case 2:
            allocate_expenses = _context2.sent;

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    });
  }

  function dropdownExpenses() {
    var dropdown;
    return regeneratorRuntime.async(function dropdownExpenses$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return regeneratorRuntime.awrap(db.manyOrNone('SELECT * FROM expenses'));

          case 2:
            dropdown = _context3.sent;
            return _context3.abrupt("return", dropdown);

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    });
  }

  function expenseData(user_id) {
    var user_data;
    return regeneratorRuntime.async(function expenseData$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return regeneratorRuntime.awrap(db.manyOrNone("SELECT allocate.id, allocate.amount, allocate.expense_date, expenses.id, expenses.all_expenses, register.id\n        FROM allocate\n        INNER JOIN register ON allocate.users_id = register.id\n        INNER JOIN expenses ON allocate.expense = expenses.id WHERE register.id = $1", [user_id]));

          case 2:
            user_data = _context4.sent;
            return _context4.abrupt("return", user_data);

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    });
  }

  return {
    registerAll: registerAll,
    allocateExpense: allocateExpense,
    dropdownExpenses: dropdownExpenses,
    expenseData: expenseData
  };
};