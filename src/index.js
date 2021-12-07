const express = require('express')
const morgan = require('morgan')
const handlebars = require('express-handlebars')
const path = require('path')
const flash = require('connect-flash')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')
const bodyParser =require('body-parser');
const {database} = require('./keys')
const passport = require('passport')

//init
const app = express()
require('./config/passport')

//settings
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', handlebars({
    defaultLayout: "main",
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./config/handlebars')
}))
app.set('view engine','.hbs')

//middleware
app.use(session({
    secret: 'init-session',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}))
app.use(flash())
app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(bodyParser.urlencoded({extended:false}));
app.set(bodyParser.json());
app.use(passport.initialize())
app.use(passport.session())

//global variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success')
    app.locals.message = req.flash('message')
    app.locals.user = req.user
    next();
})

//routes

app.use(require('./routes/public'))
app.use(require('./routes/authentication'))
app.use('/administrador', require('./routes/administrador'))
app.use('/operador', require('./routes/operador'))
app.use('/adopcion', require('./routes/adopcion'))

//public
app.use(express.static(path.join(__dirname, 'public')))

//starting server
app.listen(app.get('port'), () => {
    console.log('Server on PORT ', app.get('port'))
})