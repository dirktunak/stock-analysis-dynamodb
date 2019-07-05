function error(...message) {
    // eslint-disable-next-line no-console
    console.error(...message)
}

function log(...message) {
    // eslint-disable-next-line no-console
    console.log(...message)
}

module.exports = {
    error,
    log
}
