const { Validator } = require('jsonschema')

const v = new Validator()

function validate(object, schema) {
    return v.validate(object, schema)
}

function validateQuote(object) {
    const quoteSchema = {
        id: '/Quote',
        type: 'object',
        properties: {
            date: { type: 'string' },
            open: { type: 'number' },
            close: { type: 'number' },
            high: { type: 'number' },
            low: { type: 'number' },
            volume: { type: 'integer' },
            uOpen: { type: 'number' },
            uClose: { type: 'number' },
            uHigh: { type: 'number' },
            uLow: { type: 'number' },
            uVolume: { type: 'integer' },
            change: { type: 'number' },
            changePercent: { type: 'number' },
            label: { type: 'string' },
            changeOverTime: { type: 'number' }
        }
    }
    return v.validate(object, quoteSchema).valid
}

module.exports = {
    validate,
    validateQuote
}
