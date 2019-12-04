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
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization, Accept')
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

function protectRoute(req, res, next){
    const bearerHeader = req.headers.authorization
    if(!bearerHeader){
        res.send({error: 'login is required'})
    }
    jwt.jwtVerifySync(bearerHeader)
        .then(token => {
            req.username = token.data.username
            next()
        })
        .catch(err => {
            console.error(err)
            res.send({error: 'Bad authorization, try relogging.'})
        })
}

app.post('/addStock', protectRoute, (req, res) => {

    const requestURL = req.headers.referer
    if(isFrontend.isFrontend(requestURL)){
        res.send({ body: `Hello ${req.username}.  Successfully added ${req.body.stock} to your portfolio.` })
    }
    else{
        res.redirect('/')
    }
})

app.get('/addStock', (req, res) => {
    res.render('addStock')
})



app.listen(3000, () => console.log('Server running on port 3000'))
