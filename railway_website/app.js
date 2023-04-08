const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
const encoder = bodyParser.urlencoded();
const app = express();
const session = require('express-session');
const crypto = require('crypto')

app.use(session({
    secret: 'keyboard cat',
    resave: false, 
    saveUninitialized: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    // database connection here
});


function authenticate(req, res, next) {
    if (req.session.loggedIn && req.session.page === 'basic') {
        next();
    } else {
        res.redirect('/login');
    }
}

function authenticate_totp(req, res, next) {
    if (req.session.loggedIn && req.session.page === 'totp') {
      next();
    } else {
      res.redirect('/totp-login');
    }
}

function authenticate_hotp(req, res, next) {
    if (req.session.loggedIn && req.session.page === 'hotp') {
      next();
    } else {
      res.redirect('/hotp-login');
    }
}

function authenticate_ocra(req, res, next) {
    if (req.session.loggedIn && req.session.page === 'ocra') {
      next();
    } else {
      res.redirect('/ocra-login');
    }
}

function hashString(string) {
    return crypto.createHash('sha256').update(string).digest('hex');
}

connection.connect((err) => {
    if (err) {console.log("\nSomething wrong..."); throw err}
    else {console.log("\nConnected to baiim sql database")}
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/main_page.html");
});


app.post("/redirect", (req, res) => {
    var page = req.body.parameter;
    res.redirect(page);
});

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/pages/login_page.html");
});

app.post("/login", encoder, (req, res) => {
    var username = req.body.username;
    var passwd = req.body.password;

    hashPassword = hashString(passwd);

    connection.query("SELECT * FROM railway.users where email = ? and passwd = ?",[username, hashPassword], function(err, result, fields){
        if (result.length > 0) {
            req.session.loggedIn = true;
            req.session.page = 'basic';
            res.redirect("/welcome-page");
        }
        else {
            res.send(`<script>alert('Incorrect password or email, try insert them again');window.location.href = '/login';</script>`)
        }
    });
});

app.get("/hotp-login", (req, res) =>{
    res.sendFile(__dirname + "/pages/login-hotp-page.html")
});

app.post("/hotp-login", (req, res) => {
    var username = req.body.username;
    var passwd = req.body.password;
    var hotpInput = Number(req.body.hotp);

    hashPassword = hashString(passwd);


    function otp(key, msg) {
        const hash = Buffer.from(crypto
            .createHmac('sha256', key)
            .update(msg.toString())
            .digest().slice(-4)).readUInt32BE(0, 4, true);
        return (hash % 1000000).toString();
    }

    function hotp(key, msg) { 
        return otp(key, msg.toString(10));
    }


    
    connection.query("SELECT * FROM railway.users where email = ? and passwd = ?",[username, hashPassword], function(err, result, fields){
        if (result.length > 0 ) {
            
            let flag = 0;
            for (let i = 0; i < 10; i++) {
                console.log(result[0].hotp_count + i)
                let tmpHotp = hotp(result[0].private_key, result[0].hotp_count + i);
                console.log(tmpHotp);
                
                if (hotpInput == tmpHotp) {
                    flag = 1
                    let hoptQuery = "UPDATE railway.users SET hotp_count = hotp_count + ? WHERE email = ? AND passwd = ?";
                    connection.query(hoptQuery, [i + 1, username, hashPassword], function(err, result, fields) {
                        req.session.page = 'hotp';
                        req.session.loggedIn = true;
                        res.redirect("/welcome-page-hotp");
                    });
                    break;
                }
            
            }

            if (flag === 0) {
                res.send(`<script>alert('Incorrect HOTP code, try insert it again');window.location.href = '/hotp-login';</script>`)
            }
            
        }
        
        else {
            res.send(`<script>alert('Incorrect password or email, try insert them again');window.location.href = '/hotp-login';</script>`)
            
        }
    });
});

app.get("/totp-login", (req, res) =>{
    res.sendFile(__dirname + "/pages/login-totp-page.html")
});

app.post("/totp-login", (req, res) => {
    var username = req.body.username;
    var passwd = req.body.password;
    var totpInput = req.body.totp;

    hashPassword = hashString(passwd);



    function otp(key, msg) {
        const hash = Buffer.from(crypto
            .createHmac('sha256', key)
            .update(msg.toString())
            .digest().slice(-4)).readUInt32BE(0, 4, true);
        return (hash % 1000000).toString();
    }

    function totp(key) {
        const currentTime = Math.floor(Date.now() / 1000);
        const timeStepSize = 30;   
        return otp(key, Math.floor(currentTime / timeStepSize).toString(10));
    }
  


    connection.query("SELECT * FROM railway.users where email = ? and passwd = ?",[username, hashPassword], function(err, result, fields){
        if (result.length > 0 ) {

            let tmpTotp = totp(result[0].private_key);

            if (totpInput == tmpTotp) {
                req.session.page = 'totp';
                req.session.loggedIn = true;
                res.redirect("/welcome-page-totp");
            
            }
            else {
                res.send(`<script>alert('Incorrect TOTP code, try insert it again');window.location.href = '/totp-login';</script>`)
            }
        }
        else {
            
            res.send(`<script>alert('Incorrect password or email, try insert them again');window.location.href = '/totp-login';</script>`)
            
        }
    });
});

app.get("/ocra-login", (req, res) => {
    res.sendFile(__dirname + "/pages/login-ocra-page.html") // <-- !!!!!
});

app.post("/ocra-login", (req, res) => {
    var username = req.body.username;
    var passwd = req.body.password;
    var ocraInput = req.body.ocra;
    var ocraMsg = req.body.ocraMsg;

    hashPassword = hashString(passwd);


    function otp(key, msg) {
        const hash = Buffer.from(crypto
            .createHmac('sha256', key)
            .update(msg.toString())
            .digest().slice(-4)).readUInt32BE(0, 4, true);
        return (hash % 1000000).toString();
    }

    function ocra(key, msg) { 
        return otp(key, msg.toString(10));
    }



    connection.query("SELECT * FROM railway.users where email = ? and passwd = ?",[username, hashPassword], function(err, result, fields){
        if (result.length > 0 ) {

            let tmpOcra = ocra(result[0].private_key, ocraMsg);
            
            if (ocraInput == tmpOcra) {
                req.session.page = 'ocra';
                req.session.loggedIn = true;
                res.redirect("/welcome-page-ocra");
            
            }
            else {
                res.send(`<script>alert('Incorrect Ocra code, try insert it again');window.location.href = '/ocra-login';</script>`)
            }
        }
        else {
            
            res.send(`<script>alert('Incorrect password or email, try insert them again');window.location.href = '/ocra-login';</script>`)
            
        }
    });
});


app.get("/welcome-page", authenticate, (req, res) => {
    res.sendFile(__dirname + "/pages/after_log_page.html");
});

app.get("/welcome-page-hotp", authenticate_hotp, (req, res) => {
    res.sendFile(__dirname + "/pages/after_log_hotp.html");
});

app.get("/welcome-page-totp", authenticate_totp, (req, res) => {
    res.sendFile(__dirname + "/pages/after_log_totp.html");
});

app.get("/welcome-page-ocra", authenticate_ocra, (req, res) => {
    res.sendFile(__dirname + "/pages/after_log_page_ocra.html");
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
      res.redirect('/');
    });
});

app.get("/new-user", (req, res) => {
    res.sendFile(__dirname + "/pages/new_user_page.html");
});

app.post("/new-user",encoder, (req, res) => {
    var newUsername = req.body.new_username;
    var newPassword = req.body.new_password;

    hashPassword = hashString(newPassword)
    const privateKey = Array(20)
    .fill(null)
    .map(() => {
        const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        return possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
    })
    .join('');
    
    let checkingMail = "SELECT * FROM railway.users WHERE email = ?";
    let add_mail_passwd = "INSERT INTO railway.users (email, passwd, private_key, hotp_count) VALUES (?, ?, ?, 0)"
    
    connection.query(checkingMail, [newUsername], function(err, result, fields){
        if (result.length > 0) {
            res.send('<script>alert("User already exists"); window.location.href = "/new-user";</script>')
        }
        else {
            connection.query(add_mail_passwd, [newUsername, hashPassword, privateKey], function(err, result, fields) {
                res.send(`<script>alert("User Added");alert("${privateKey}");window.location.href = "/login";</script>`)
            })
        }
    });
});

app.get("/user-added", (req, res) => {
    res.sendFile(__dirname + "/pages/after_adding_user_page.html");
});

app.listen(3000, () => {
    console.log('App listening on port 3000');
});
