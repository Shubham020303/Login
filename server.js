const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bcrypt = require('bcrypt');
const userSchema = require('./schemas/user-schema');
// userSchema = require('./schemas/user-schema');

mongoose.connect("mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false", { useUnifiedTopology: true, useNewUrlParser: true });

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

app.get('/', (req, res) => {
     res.render('index.ejs');
});

app.get('/login', (req, res) => {
     res.render('login.ejs');
});

app.post('/login', async (req, res) => {
     try {
          const { email, name, password } = req.body;
          console.log("result from try", req.body);
          fetchData(email, password, res);
          // res.redirect('/');
     } catch (error) {
          res.redirect('/login');
          console.log("result from catch", req.body);
     }
});

app.get('/register', (req, res) => {
     res.render('register.ejs');
});

app.post('/register', async (req, res) => {
     try {
          const { email, name, password } = req.body;
          const hashedPassword = await bcrypt.hash(password, 10);
          console.log("hashed", hashedPassword);
          connectToDB(email, name, hashedPassword);
          res.redirect('/login');
          console.log("req.body from try", req.body);
     } catch {
          console.log("req.body from catch", req.body);
          res.redirect('/register');
     }
});

app.listen(3000);

const connectToDB = async (email, name, pwd) => {
     const user1 = {
          email: email,
          username: name,
          password: pwd
     }
     await new userSchema(user1).save();
};

const fetchData = async (email1, pwd, res) => {
     const result = await userSchema.findOne({
          email: email1,
     });
     const isMatch = await bcrypt.compare(pwd, result.password);
     if (!isMatch) {
          console.log("wrong");
          res.redirect('/login');
     }
     else {
          console.log("result from fetchData", result);
          res.redirect('/');
          return result;
     }
}