const _ = require('lodash')

const jsonValidator = require('../jsonValidator/jsonValidator')
const DynamoDBWriter = require('../dynamoDbWriter')

const dbWriter = new DynamoDBWriter.DynamoDBWriter()

const dataToWrite = []

function validate(quote) {
    return jsonValidator.validateQuote(quote)
}

function batchWriteData(data) {
    dbWriter.dynamoDbBatchWrite(data)
}

function groupBy25() {
    return new Promise(resolve => {
        if (dataToWrite.length >= 25) {
            batchWriter.batchWriteData(dataToWrite.splice(0, 25))
            batchWriter.groupBy25().then(() => resolve())
        } else if (dataToWrite.length > 0) {
            _.debounce(data => {
                batchWriter.batchWriteData(data)
                resolve()
            }, 100)(dataToWrite.splice(0, dataToWrite.length))
        } else {
            resolve()
        }
    })
}

function writeData(data) {
    data.forEach(value => {
        if (!validate(value)) {
            throw new Error('incorrect format')
        }
        dataToWrite.push(value)
    })
    return batchWriter.groupBy25()
}

const batchWriter = {
    writeData,
    groupBy25,
    batchWriteData
}

module.exports = batchWriter
