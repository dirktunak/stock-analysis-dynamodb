const batchWriter = require('./batchWriter')

jest.mock('../dynamoDbWriter')

const validQuote = {
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
const length0 = []
const length24 = new Array(24).fill(validQuote)
const length25 = new Array(25).fill(validQuote)
const length26 = new Array(26).fill(validQuote)

describe('dyanmoDbWriter', () => {
    const spyOnGroupBy25 = jest.spyOn(batchWriter, 'groupBy25')
    let expectCalledGroupBy25 = 0
    const spyOnBatchWriteData = jest.spyOn(batchWriter, 'batchWriteData')
    let expectCalledBatchWriteData = 0
    describe('writeData', () => {
        it('should call groupBy25 1x, batchWriteData 0x for 0 data points', done => {
            batchWriter.writeData(length0).then(() => {
                expectCalledGroupBy25 += 1
                expect(spyOnGroupBy25).toHaveBeenCalledTimes(expectCalledGroupBy25)
                expect(spyOnBatchWriteData).toHaveBeenCalledTimes(expectCalledBatchWriteData)
                done()
            })
        })
        it('should call groupBy25 1x, batchWriteData 1x for 24 data points', done => {
            batchWriter.writeData(length24).then(() => {
                expectCalledGroupBy25 += 1
                expectCalledBatchWriteData += 1
                expect(spyOnGroupBy25).toHaveBeenCalledTimes(expectCalledGroupBy25)
                expect(spyOnBatchWriteData).toHaveBeenCalledTimes(expectCalledBatchWriteData)
                done()
            })
        })
        it('should call groupBy25 2x, batchWriteData 1x for 25 data points', done => {
            batchWriter.writeData(length25).then(() => {
                expectCalledGroupBy25 += 2
                expectCalledBatchWriteData += 1
                expect(spyOnGroupBy25).toHaveBeenCalledTimes(expectCalledGroupBy25)
                expect(spyOnBatchWriteData).toHaveBeenCalledTimes(expectCalledBatchWriteData)
                done()
            })
        })
        it('should call groupBy25 2x, batchWriteData 2x for 26 data points', done => {
            batchWriter.writeData(length26).then(() => {
                expectCalledGroupBy25 += 2
                expect(spyOnGroupBy25).toHaveBeenCalledTimes(expectCalledGroupBy25)
                expectCalledBatchWriteData += 2
                expect(spyOnBatchWriteData).toHaveBeenCalledTimes(expectCalledBatchWriteData)
                done()
            })
        })
    })
    describe('batchWriteData', () => {
        it('', () => {
            expect(true).toBe(true)
        })
    })
})
