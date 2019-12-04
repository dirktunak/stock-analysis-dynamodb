const hasher = require('pbkdf2-password')({ digest: 'sha1' })

const userDatabase = {}

function authenticate(username, password, callback) {
    const errorMessage = 'Username and password combo invalid'
    const user = userDatabase[username]
    if (!user) {
        return callback(null, new Error(errorMessage))
    }
    hasher({ password, salt: user.salt }, (err, pass, salt, hash) => {
        if (err) {
            throw err
        }
        if (hash === user.hash) {
            return callback(user, null)
        }
        return callback(null, new Error(errorMessage))
    })
}

function generateUser(username, password, callback) {
    if (userDatabase[username]) {
        return callback(null, new Error('Username already taken'))
    }
    hasher({ password }, (err, pass, salt, hash) => {
        if (err) {
            return callback(null, new Error('Error while generating hash'))
        }
        userDatabase[username] = { name: username }
        userDatabase[username].salt = salt
        userDatabase[username].hash = hash
        return callback(userDatabase[username], null)
    })
}

module.exports = {
    generateUser,
    authenticate
}
