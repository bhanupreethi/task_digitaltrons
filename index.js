 
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const authController = require('./controller/auth');

var app = express();

app.use(express.urlencoded({ extended : false}));
app.use(express.json());

app.post('/add',authController.add);
app.post('/delete',authController.delete);
app.post('/show',authController.show);
app.post('/move',authController.move);
app.post('/addUser',authController.addUser);

var db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'bhanup',
    database : 'nodejs_users'
});


db.connect((err)=>{
    if(err) console.log(err);
    console.log('DB Conn\'d');
})

app.listen(8036, (error,data)=>{
    if(error)  
        console.log(error);
    console.log('Conn\'d');
});