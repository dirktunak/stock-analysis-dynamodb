const express = require('express')
const AWS = require('aws-sdk')
const path = require('path')
const bodyParser = require('body-parser')
const _ = require('lodash')
const app = (module.exports = express())

const userDatabase = require('./services/usersDatabase')
const isFrontend = require('./services/isFrontend')
const jwt = require('./services/jwt')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))

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

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/addStock', (req, res) => {
    res.render('addStock')
})

const users = {}

app.post('/logout', function(req, res) {
    if (isFrontend(req.headers.referer)) {
        res.send({ body: 'logged out' })
    } else {
        res.redirect('/')
    }
})

app.get('/logout', function(req, res) {
    if (isFrontend(req.headers.referer)) {
        res.send({ body: 'logged out' })
    } else {
        res.redirect('/')
    }
})

app.post('/login', (req, res) => {
    const requestURL = req.headers.referer
    const { username, password } = req.body
    console.log('login', 'username', username, 'password', password)
    userDatabase.authenticate(username, password, (user, error) => {
        if(user){
            const token = jwt.jwtSignSync(user.name)
            console.log(token)
            if(isFrontend.isFrontend(requestURL)){
                res.send({jwt: token})
            }
            else{
                res.redirect('/')
            }
        }
        else{
            res.send({error: error.message})
        }
    })
})

app.post('/register', (req, res) => {
    const requestURL = req.headers.referer
    const { username, password } = req.body
    console.log('signup', 'username', username, 'password', password)
    userDatabase.generateUser(username, password, (user, error) => {
        if(user){
            const token = jwt.jwtSignSync(user.name)
            console.log(token)
            if(isFrontend.isFrontend(requestURL)){
                console.log('sending token')
                res.send({jwt: token})
            }
            else{
                res.redirect('/')
            }
        }
        else{
            res.send({error: error.message})
        }
    })
})

app.post('/addStock', (req, res) => {
    console.log(req.body.stock)
    res.redirect('/')
})

app.listen(3000, () => console.log('Server running on port 3000'))
