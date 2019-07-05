const express = require('express')
const AWS = require('aws-sdk')
const path = require('path')

const app = (module.exports = express())
const hasher = require('pbkdf2-password')({ digest: 'sha1' })
const session = require('express-session')

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

app.use(express.urlencoded({ extended: false }))
app.use(
    session({
        resave: false,
        saveUninitialized: true,
        secret: 'express server temp secret'
    })
)

const users = {
    derek: {
        name: 'derek'
    }
}

function generateUser(username, password) {
    users[username] = { name: username }
    return new Promise((resolve, reject) => {
        hasher({ password }, (err, pass, salt, hash) => {
            if (err) {
                return reject(new Error('error generating hash password'))
            }
            users[username].salt = salt
            users[username].hash = hash
            console.log(JSON.stringify(users, null, 4))
            resolve(username)
        })
    })
}

function authenticate(username, password) {
    const user = users[username]
    console.log('authenticate user', user)
    return new Promise((resolve, reject) => {
        hasher({ password, salt: user.salt }, (err, pass, salt, hash) => {
            if (err) {
                console.log(err)
                throw err
            }
            if (hash === user.hash) {
                console.log(`login as ${user.name}`)
                resolve({ user: user.name })
            } else {
                console.log('will reject')
                reject(Error('User and Password combo invalid'))
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
        res.redirect('/')
    })
})

app.post('/login', (req, res) => {
    console.log('login', 'username', req.body.username)
    console.log('login', 'password', req.body.password)
    authenticate(req.body.username, req.body.password)
        .then(user => {
            console.log('login', 'attempting to regenerate session')
            req.session.regenerate(() => {
                req.session.user = user
                console.log(`login successful as user: ${JSON.stringify(user, null, 4)}`)
            })
            res.redirect('/')
        })
        .catch(err => {
            req.session.regenerate(() => {
                req.session.error = err
            })
        })
})

app.post('/signup', (req, res) => {
    console.log('signup', 'username', req.body.username)
    console.log('signup', 'password', req.body.password)
    generateUser(req.body.username, req.body.password)
        .then(user => {
            console.log('signup', 'attempting to regenerate session')
            req.session.regenerate(() => {
                req.session.user = user
                console.log(`signup successful as user: ${JSON.stringify(user, null, 4)}`)
            })
            res.redirect('/')
        })
        .catch(err => {
            req.session.regenerate(() => {
                req.session.error = err
            })
        })
})

app.listen(3000, () => console.log('Server running on port 3000'))
