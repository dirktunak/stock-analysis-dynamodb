const express = require('express')
const AWS = require('aws-sdk')
const path = require('path')
const _ = require('lodash')
const bodyParser = require('body-parser')

const app = (module.exports = express())
const hasher = require('pbkdf2-password')({ digest: 'sha1' })
const session = require('express-session')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const frontendURL = {
    develop: 'http://localhost:8080/',
    production: ''
}

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
app.use(
    session({
        resave: false,
        saveUninitialized: true,
        secret: 'express server temp secret'
    })
)
app.use(function(req, res, next) {
    const err = req.session.error
    const msg = req.session.success
    delete req.session.error
    delete req.session.success
    res.locals.message = ''
    if (err) {
        res.locals.message = `<p class="msg error">${err}</p>`
    }
    if (msg) {
        res.locals.message = `<p class="msg success">${msg}</p>`
    }
    next()
})
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

const users = {
}

function generateUser(username, password) {
    return new Promise((resolve, reject) => {
        if(!_.isUndefined(users[username])){
            return reject(new Error('Username already taken'))
        }
        users[username] = { name: username }
        hasher({ password }, (err, pass, salt, hash) => {
            if (err) {
                return reject(new Error('error generating hash password'))
            }
            users[username].salt = salt
            users[username].hash = hash
            resolve(username)
        })
    })
}

function authenticate(username, password) {
    return new Promise((resolve, reject) => {
        const errorMessage = 'Username and password combo invalid'
        const user = users[username]
        if (!user || _.isUndefined(user)) {
            return reject(Error(errorMessage))
        }
        hasher({ password, salt: user.salt }, (err, pass, salt, hash) => {
            if (err) {
                throw err
            }
            if (hash === user.hash) {
                resolve({ user: user.name })
            } else {
                reject(Error(errorMessage))
            }
        })
    })
}

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/signup', (req, res) => {
    res.render('signup')
})

app.get('/logout', function(req, res) {
    req.session.destroy(function() {
        console.log('logout')
        res.redirect('/')
    })
})

function isFrontend(url) {
    return url === frontendURL.develop || url === frontendURL.production
}

app.post('/login', (req, res) => {
    const requestURL = req.headers.referer
    console.log('login', 'username', req.body.username, 'password', req.body.password)
    authenticate(req.body.username, req.body.password)
        .then(user => {
            req.session.regenerate(() => {
                req.session.user = user
                console.log(`login successful as user: ${JSON.stringify(user, null, 4)}`)
            })
            if (isFrontend(requestURL)) {
                res.send({
                    body: req.sessionID
                })
            } else {
                res.redirect('/')
            }
        })
        .catch(error => {
            console.log('failed login', error.message)
            if (isFrontend(requestURL)) {
                res.send({ body: error.message })
            } else {
                res.redirect('/')
            }
        })
})

app.post('/signup', (req, res) => {
    const requestURL = req.headers.referer
    console.log('signup', 'username', req.body.username, 'password', req.body.password)
    generateUser(req.body.username, req.body.password)
        .then(user => {
            console.log('signup', 'attempting to regenerate session')
            req.session.regenerate(() => {
                req.session.user = user
                console.log(`signup successful as user: ${JSON.stringify(user, null, 4)}`)
            })
            if (isFrontend(requestURL)) {
                res.send({
                    body: req.sessionID
                })
            } else {
                res.redirect('/')
            }
        })
        .catch(error => {
            console.log('failed signup', error.message)
            if (isFrontend(requestURL)) {
                res.send({ body: error.message })
            } else {
                res.redirect('/')
            }
        })
})

app.listen(3000, () => console.log('Server running on port 3000'))
