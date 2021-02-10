# task_digitaltrons

npm install 
npm start / nodemon

DB Querys : (MYSQL)
Tables - angelList_Task,users
create table angelList_Task(id int auto_increment,Type varchar(30),name varchar(30),parent varchar(30),user varchar(30))
create table users(id int auto_increment,name varchar(30),mail varchar(50))

API's :
1. addUser - for adding users.
2. add - for adding new file/folder into the database and notifing the other users through mail.
3. delete - for removing the file/folder.
4. move - for moving file/fiolder from one place to another.



