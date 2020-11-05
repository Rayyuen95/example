const express = require('express')
const app = express()
const initializePassport = require('./passport-config')
const passport = require('passport')
initializePassport(passport, email => {
     user.find(user => user.email === email)
})
const flash = require('express-flash')
const session = require('express-session')
const mongoose = require('mongoose')
const articleRouter = require('./routes/articles')
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
const { registerValidation, loginValidation } = require('./routes/validation');
const methodOverride = require('method-override')
const Article = require("./models/article")
const User = require('./models/user')
dotenv.config();
mongoose.connect(process.env.DB_CONNECT,
    { useNewUrlParser: true,
      useUnifiedTopology:true,
      useCreateIndex:true },
    () => console.log('connect to db!'));
app.use(methodOverride('_method'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET
}))


app.get('/login', (req, res) => {
    res.render("login/login.ejs")
})
app.get('/register', (req, res) => {
    res.render("login/register.ejs")
})

app.post('/register', async (req, res) => {
     //Validat the data before be a user
     const { error } = registerValidation(req.body);
     if (error) return res.status(400).send(error.details[0].message);
 
     //Checking if the user is already exist
     const emailExist = await User.findOne({ email: req.body.email });
     if (emailExist) return res.status(400).send('Email already exists!');
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const register = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        const savedRegister = await register.save();
        console.log(savedRegister);
        res.redirect('/login')
    }catch(e){
        res.redirect('/resgister')
    }
    
})

app.post('/login', (req, res) => {
    
})

app.get('/', async (req,res)=>{
    const articles = await Article.find().sort({
        createdAt: 'desc'
    })
    res.render('articles/index',{articles: articles})
})



app.listen(5000)
app.use('/articles', articleRouter)
