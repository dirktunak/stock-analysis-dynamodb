const jwt = require('jsonwebtoken')

function jwtSignSync(username, ...rest) {
    return jwt.sign({ data: {username, ...rest}}, 'shhhhh', { expiresIn: '1hr' })
}

function jwtSignAsync(username, ...rest) {
    jwt.sign({ data: {username, ...rest}}, 'shhhhh', { expiresIn: '1hr' }, (err, token) => {
        console.log('asyncToken', token)
    })
}

function jwtVerifySync(token) {
    return jwt.verify(token, 'shhhhh')
}
function jwtVerifyAsync(token) {
    jwt.verify(token, 'shhhhh', function(err, decoded) {
        console.log(decoded) // bar
      });
}

module.exports = {
    jwtSignSync,
    jwtSignAsync,
    jwtVerifySync,
    jwtVerifyAsync
}