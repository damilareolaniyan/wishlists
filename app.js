
if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const wishlistsRoutes = require('./routes/wishlist') 
const userRoutes = require('./routes/users')
const newRoutes = require('./routes/list')
//Connecting to our MongoURI

const dbUrl = process.env.DB_URL;
//'mongodb://localhost:27017/segun'

 

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"))
db.once("open", ()=>{
    console.log("Database Connected")
})
const app = express();


//Setting Our View Engines
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))

//Making the form show
app.use(express.urlencoded({ extended: true }))
//Calling our method overide
app.use(methodOverride('_method'));

const secret = process.env.SECRET || 'secretsecured'
const store = new MongoStore({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function(e){
    console.log("SESSION STORE ERROR", e);
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now()+ 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//Locals
app.use((req, res, next) =>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

//Routes
app.use('/', userRoutes)
app.use('/', wishlistsRoutes)
//app.use('/', newRoutes)

//Home 
app.get('/', async (req, res) =>{

     res.render('wishlist/homes')
})


//404 Route
app.use((req, res) =>{
    res.status(404).render('wishlist/404')
});
const port = process.env.PORT || 3000

app.listen(port, () =>{
    console.log(`Server Started on Port ${port}`)
})
