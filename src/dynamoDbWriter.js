const AWS = require('aws-sdk')

const serverConstants = require('./serverConstants')
const logger = require('./logger')

class DynamoDBWriter {
    constructor() {
        AWS.config.update({
            region: serverConstants.region,
            endpoint: serverConstants.endpoint
        })
        AWS.config.loadFromPath('../.aws/config.json')

        this.dynamoDB = new AWS.DynamoDB.DocumentClient()
    }

    dynamoDbBatchWrite(listOfQuotes) {
        const quotes = []
        listOfQuotes.forEach(quote => {
            quotes.push(this.transformQuote(quote))
        })
        const tableName = serverConstants.stockQuotes
        const params = {
            RequestItems: {
                [tableName]: quotes
            }
        }
        this.dynamoDB.batchWrite(params, err => {
            if (err) {
                logger.error('Unable to add stock', '. Error JSON:', JSON.stringify(err, null, 2))
            } else {
                logger.log('PutItem succeeded:')
            }
        })
    }

    transformQuote(quote) {
        return {
            PutRequest: {
                Item: {
                    tickerdate: `${quote.ticker}${quote.date}`,
                    ticker: quote.ticker,
                    date: quote.date,
                    open: quote.open,
                    close: quote.close,
                    high: quote.high,
                    low: quote.low,
                    volume: quote.volume,
                    change: quote.change,
                    changePercent: quote.changePercent
                }
            }
        }
    }
}

module.exports = {
    DynamoDBWriter
}
