module.exports = function waitersWorking(db){


   async function registerAll(firstName, lastName, Email, code){
        let insertRegisters = await db.none('INSERT INTO register(first_name, last_name, email, code) values($1, $2, $3, $4)', [firstName, lastName, Email, code])
    }
    async function allocateExpense(expense_type, expesne_amount, expense_date, user_id){
       // console.log(expense_type, expesne_amount, expense_date, user_id)
        let allocate_expenses = await db.none('INSERT INTO allocate (expense, amount, expense_date, users_id) values($1, $2, $3, $4)', [expense_type, expesne_amount, expense_date, user_id])
    }
    async function dropdownExpenses(){
        let dropdown = await db.manyOrNone('SELECT * FROM expenses')
        return dropdown;
    }
    async function expenseData(user_id){
        let user_data = await db.manyOrNone(`SELECT allocate.id, allocate.amount, allocate.expense_date, expenses.id, expenses.all_expenses, register.id
        FROM allocate
        INNER JOIN register ON allocate.users_id = register.id
        INNER JOIN expenses ON allocate.expense = expenses.id WHERE register.id = $1`, [user_id])
        return user_data
    }

    return {
        registerAll,
        allocateExpense,
        dropdownExpenses,
        expenseData
    }
}