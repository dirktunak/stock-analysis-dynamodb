const express = require('express')
const AWS = require('aws-sdk')
const path = require('path')
const bodyParser = require('body-parser')

const app = (module.exports = express())
const session = require('express-session')

const authenticate = require('./services/authenticate')
const isFrontend = require('./services/isFrontend')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

/*
const assert = require('assert')
const DynamoDBStore = require('connect-dynamodb')(session)
const serverConstants = require('../serverConstants')

const options = {
    table: 'sessions',
    AWSConfigPath: '../../.aws/config.json',
    client: new AWS.DynamoDB({ endpoint: serverConstants.endpoint })
}

app.use(
    session({
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true },
        store: new DynamoDBStore(options),
        secret: 'express server temp secret'
    })
)
*/

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: 'express server temp secret'
    })
)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/signup', (req, res) => {
    res.render('signup')
})

function restrict(req, res, next) {
    console.log(req.session.user)
    if (req.session.user) {
        next()
    } else {
        console.log('Access denied')
        req.session.error = 'Access denied!'
        res.redirect('/login')
    }
}

app.get('/addStock', restrict, (req, res) => {
    res.render('addStock')
})

app.post('/logout', function(req, res) {
    req.session.destroy(function() {
        if (isFrontend(req.headers.referer)) {
            res.send({ body: 'logged out' })
        } else {
            res.redirect('/')
        }
    })
})

app.post('/login', (req, res) => {
    const requestURL = req.headers.referer
    console.log('login', 'username', req.body.username, 'password', req.body.password)
    authenticate
        .authenticate(req.body.username, req.body.password)
        .then(user => {
            req.session.regenerate(() => {
                req.session.user = user
                console.log(`login successful as user: ${JSON.stringify(user, null, 4)}`)
                console.log(req.session.user)
                if (isFrontend.isFrontend(requestURL)) {
                    res.send({
                        body: req.sessionID
                    })
                } else {
                    res.redirect('/')
                }
            })
        })
        .catch(error => {
            console.log('failed login', error.message)
            if (isFrontend.isFrontend(requestURL)) {
                res.send({ body: error.message })
            } else {
                res.redirect('/')
            }
        })
})

app.post('/signup', (req, res) => {
    const requestURL = req.headers.referer
    console.log('signup', 'username', req.body.username, 'password', req.body.password)
    authenticate
        .generateUser(req.body.username, req.body.password)
        .then(user => {
            console.log('signup', 'attempting to regenerate session')
            req.session.regenerate(() => {
                req.session.user = user
                console.log(`signup successful as user: ${JSON.stringify(user, null, 4)}`)
                console.log(req.session.user)
                console.log(req.sessionID)
                /*
                console.debug(req.session)
                console.debug(req.session.cookie)
                console.debug(res)
                */
                if (isFrontend.isFrontend(requestURL)) {
                    res.send({
                        body: req.sessionID
                    })
                } else {
                    res.redirect('/')
                }
            })
        })
        .catch(error => {
            console.log('failed signup', error.message)
            if (isFrontend.isFrontend(requestURL)) {
                res.send({ body: error.message })
            } else {
                res.redirect('/')
            }
        })
})

app.post('/addStock', restrict, (req, res) => {
    console.log(req.body.stock)
    res.redirect('/')
})

app.listen(3000, () => console.log('Server running on port 3000'))
