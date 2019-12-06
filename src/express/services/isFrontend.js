const frontendURL = {
    develop: 'http://localhost:8080/',
    production: 'https://dirktunak.github.io/'
}

function isFrontend(url) {
    return url.includes(frontendURL.develop) || url.includes(frontendURL.production)
}

module.exports = {
    isFrontend
}
