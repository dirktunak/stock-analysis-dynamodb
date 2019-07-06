const _ = require('lodash')
const hasher = require('pbkdf2-password')({ digest: 'sha1' })

const users = {}

function generateUser(username, password) {
    return new Promise((resolve, reject) => {
        if (!_.isUndefined(users[username])) {
            return reject(new Error('Username already taken'))
        }
        users[username] = { name: username }
        hasher({ password }, (err, pass, salt, hash) => {
            if (err) {
                return reject(new Error('error generating hash password'))
            }
            users[username].salt = salt
            users[username].hash = hash
            console.log('users', users)
            resolve(users[username])
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
                resolve(user)
            } else {
                reject(Error(errorMessage))
            }
        })
    })
}

module.exports = {
    generateUser,
    authenticate
}
