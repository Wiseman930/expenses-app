CREATE TABLE IF NOT EXISTS register (
    id SERIAL PRIMARY KEY,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    code text NOT NULL
);

CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    all_expenses text NOT NULL,
);

insert into expenses (id, Housing) values (1, 'Housing');
insert into expenses (id, Food_and_dining_out) values (2, 'Food and dining out');
insert into expenses (id, Transportation) values (3, 'Transportation');
insert into expenses (id, Cellphone) values (4, 'Cellphone');
insert into expenses (id, Health_insurance) values (5, 'Health insurence');
insert into expenses (id, Debt_payments) values (6, 'Debt Payments');

ALTER TABLE register ADD UNIQUE (first_name, last_name, email, code);

CREATE TABLE IF NOT EXISTS allocate (
    id SERIAL PRIMARY KEY,
    expense int NOT NULL,
    amount int NOT NULL,
    expense_date date NOT NULL,
    users_id int NOT NULL,
    foreign key (users_id) references register(id),
    foreign key (expense) references expenses(id)
);


