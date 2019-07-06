const frontendURL = {
    develop: 'http://localhost:8080/',
    production: ''
}

function isFrontend(url) {
    return url === frontendURL.develop || url === frontendURL.production
}

module.exports = {
    isFrontend
}
