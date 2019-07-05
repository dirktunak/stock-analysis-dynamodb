const jsonValidator = require('./jsonValidator')

describe('jsonValidator', () => {
    describe('validateQuote', () => {
        const quote = {
            date: '2019-05-29',
            open: 181.49,
            close: 183.21,
            high: 185.56,
            low: 179,
            volume: 29487373,
            uOpen: 178.76,
            uClose: 185.42,
            uHigh: 183.21,
            uLow: 184,
            uVolume: 29303374,
            change: 0,
            changePercent: 0,
            label: 'May 29',
            changeOverTime: 0
        }
        it('should return true for a quote', () => {
            expect(jsonValidator.validateQuote(quote)).toBe(true)
        })
        it('should return false for anything else', () => {
            expect(jsonValidator.validateQuote({ date: 23 })).toBe(false)
        })
    })
})
