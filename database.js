require('dotenv').config();
const { MongoClient } = require('mongodb')

const URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.gxappgd.mongodb.net/?retryWrites=true&w=majority`

let dbConnection;

module.exports = {
    connectToDb: (callback) => {
        MongoClient.connect(URL)
        .then((cleint) => {
            dbConnection = cleint.db();
            return callback();
        })
        .catch(err => {
            console.log(err);
            return callback(err);
        })
    },
    getDb: () => dbConnection
}