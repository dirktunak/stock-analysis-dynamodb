var testHistoricalData = require('./testHistoricalData')
var serverConstants = require('./serverConstants')

var AWS = require("aws-sdk");
AWS.config.update({
    region: serverConstants.region,
    endpoint: serverConstants.endpoint
});
AWS.config.loadFromPath('../.aws/config.json');

var dynamoDB = new AWS.DynamoDB.DocumentClient();

const stock_quotes = testHistoricalData.testHistoricalData

function transformQuote(quote){
    return { 
        "PutRequest": { 
            "Item": { 
                "tickerdate" : `${quote.ticker}${quote.date}`,
                "ticker": quote.ticker,
                "date": quote.date,
                "open": quote.open,
                "close": quote.close,
                "high": quote.high,
                "low": quote.low,
                "volume": quote.volume,
                "change": quote.change,
                "changePercent": quote.changePercent
            }
        }
    }
}

function writeListOfQuotesToDynamo(ticker, listOfQuotes){
    var quotes = []
    listOfQuotes.forEach(function(quote){
        quotes.push(transformQuote({ticker, ...quote}))
    })
    const tableName = serverConstants.stockQuotes
    var params = {
        RequestItems: {
            'Stock_Quotes': quotes
        }
    }
    dynamoDB.batchWrite(params, function(err, data){
        if (err) {
            console.error("Unable to add stock", ticker, ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("PutItem succeeded:", ticker);
        }
    })
}

for(var ticker in stock_quotes){
    const listOfQuotes = stock_quotes[ticker]
    writeListOfQuotesToDynamo(ticker, listOfQuotes)
}

