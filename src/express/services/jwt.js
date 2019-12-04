const jwt = require('jsonwebtoken')

function jwtSignSync(username, ...rest) {
    return jwt.sign({ data: { username, ...rest } }, 'shhhhh', { expiresIn: '1hr' })
}

function jwtSignAsync(username, ...rest) {
    jwt.sign({ data: { username, ...rest } }, 'shhhhh', { expiresIn: '1hr' }, (err, token) => {
        console.log('asyncToken', token)
    })
}

function jwtVerifySync(token) {
    return new Promise((resolve, reject) => {
        try {
            resolve(jwt.verify(token, 'shhhhh'))
        } catch (err) {
            reject(err)
        }
    })
}
function jwtVerifyAsync(token) {
    jwt.verify(token, 'shhhhh', (err, decoded) => {
        console.log(decoded) // bar
    })
}

module.exports = {
    jwtSignSync,
    jwtSignAsync,
    jwtVerifySync,
    jwtVerifyAsync
}
