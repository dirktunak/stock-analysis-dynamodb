const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const fs = require('fs')
const https = require('https')

const app = express()

const userDatabase = require('./services/usersDatabase')
const isFrontend = require('./services/isFrontend')
const jwt = require('./services/jwt')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:8080', 'https://dirktunak.github.io']
    const origin = req.headers.origin
    if(allowedOrigins.indexOf(origin) > -1){
        res.header('Access-Control-Allow-Origin', origin)

    }
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Authorization, Accept'
    )
    next()
})

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/signin', (req, res) => {
    res.render('signin')
})

app.get('/signup', (req, res) => {
    res.render('signup')
})

app.post('/signout', (req, res) => {
    if (isFrontend(req.headers.referer)) {
        res.send({ body: 'logged out' })
    } else {
        res.redirect('/')
    }
})

app.get('/signout', (req, res) => {
    if (isFrontend(req.headers.referer)) {
        res.send({ body: 'logged out' })
    } else {
        res.redirect('/')
    }
})

app.post('/signin', (req, res) => {
    const requestURL = req.headers.referer
    const { username, password } = req.body
    userDatabase.authenticate(username, password, (user, error) => {
        if (user) {
            const token = jwt.jwtSignSync(user.name)
            if (isFrontend.isFrontend(requestURL)) {
                res.send({ jwt: token })
            } else {
                res.redirect('/')
            }
        } else {
            res.send({ error: error.message })
        }
    })
})

app.post('/signup', (req, res) => {
    const requestURL = req.headers.referer
    const { username, password } = req.body
    userDatabase.generateUser(username, password, (user, error) => {
        if (user) {
            const token = jwt.jwtSignSync(user.name)
            if (isFrontend.isFrontend(requestURL)) {
                res.send({ jwt: token })
            } else {
                res.redirect('/')
            }
        } else {
            res.send({ error: error.message })
        }
    })
})

function protectRoute(req, res, next) {
    const bearerHeader = req.headers.authorization
    if (!bearerHeader) {
        res.send({ error: 'signin is required' })
    }
    jwt.jwtVerifySync(bearerHeader)
        .then(token => {
            req.username = token.data.username
            next()
        })
        .catch(err => {
            console.error(err)
            res.send({ error: 'Bad authorization, try relogging.' })
        })
}

app.post('/addStock', protectRoute, (req, res) => {
    const requestURL = req.headers.referer
    if (isFrontend.isFrontend(requestURL)) {
        res.send({
            body: `Hello ${req.username}.  Successfully added ${req.body.stock} to your portfolio.`
        })
    } else {
        res.redirect('/')
    }
})

app.get('/addStock', (req, res) => {
    res.render('addStock')
})
https.createServer({
	key: fs.readFileSync('server.key'),
	cert: fs.readFileSync('server.cert')
}, app).listen(3000, () => console.log('Server running on port 3000'))
