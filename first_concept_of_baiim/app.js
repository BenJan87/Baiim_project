const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
const encoder = bodyParser.urlencoded();
const app = express();

// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    hostname: "localhost",
    user: "root",
    password: "root123",
    database: "baiim"
});


connection.connect((err) => {
    if (err) {console.log("\nSomething wrong...");throw err}
    else {console.log("\nConnected to baiim sql database")}
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/main_page.html");
});


app.post("/redirect", (req, res) => {
    var page = req.body.parameter;
    res.redirect(page);
});

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/login_page.html");
});

app.post("/login",encoder, (req, res) => {
    var username = req.body.username;
    var passwd = req.body.password;

    connection.query("SELECT * FROM baiim.hashes where mail = ? and passwd = ?",[username, passwd], function(err, result, fields){
        if (result.length) {
            res.redirect("/welcome-page");
            app.get("/welcome-page", (req, res) => {
                res.sendFile(__dirname + "/after_log_page.html");
            });
        }
        else {
            res.redirect("/login");
        }
    });
});

app.get("/new-user", (req, res) => {
    res.sendFile(__dirname + "/new_user_page.html");
});

app.post("/new-user",encoder, (req, res) => {
    var newUsername = req.body.new_username;
    var newPassword = req.body.new_password;

    let checkingMail = "SELECT * FROM baiim.hashes WHERE mail = ?";
    let add_mail_passwd = "INSERT INTO baiim.hashes (mail, passwd) VALUES (?, ?)"

    connection.query(checkingMail, [newUsername], function(err, result, fields){
        if (result.length) {
            res.redirect("/new-user");
        }
        else {
            connection.query(add_mail_passwd, [newUsername, newPassword], function(err, result, fields) {
                res.redirect("/user-added")
            })
        }
    });
});

app.get("/user-added", (req, res) => {
    res.sendFile(__dirname + "/after_adding_user_page.html");
});


app.listen(3000);