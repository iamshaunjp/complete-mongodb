const express = require('express')
const { ObjectId } = require('mongodb')
const { connectToDb, getDb } = require('./database');


// init app & middleware
const app = express()
app.use(express.json())

// db connection
let db;
let PORT = process.env.PORT;
connectToDb((err) => {
    if (!err) {
        app.listen(PORT, () => {
            console.log(`Server in ${process.env.STATUS} mode, Listening on port: ${PORT}`);
        });
        db = getDb();
    }
})

// routes
app.get('/books', (req, res) => {
    const page = req.query.p || 0;
    const booksPerPage = 3 // books per page to show

    let books = [];

    db.collection('books')
    .find()
    .skip(page * booksPerPage) // return specific page requested
    .limit(booksPerPage) // show 3 books per page
    .forEach(book => books.push(book))
    .then(() => {
        res.status(200).json(books)
    })
    .catch(() => {
        res.status(500).json({error: "could not fetch"})
    });

})

app.post('/books', (req, res) => {
    const book = req.body

    db.collection('books')
    .insertOne(book)
    .then(result => {
        res.status(201).json(result);
    })
    .catch(err => {
        res.status(500).json({err: 'could not insert document'})
    })
})

app.get('/books/:id', (req, res) => {
    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
        .findOne({_id: new ObjectId(req.params.id)})
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(err => {
            res.status(500).json({error: "could not fetch"});
        });
    } else res.status(500).json({error: "invalid Id"});
})

app.delete('/books/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
        .deleteOne({_id: new ObjectId(req.params.id)})
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({error: "could not delete document"});
        });
    } else res.status(500).json({error: "invalid Id"});
    
})

app.patch("/books/:id", (req, res) => {
    const updates = req.body

    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
        .updateOne({_id: new ObjectId(req.params.id)}, {$set: updates})
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({error: "could not update document"});
        });
    } else res.status(500).json({error: "invalid Id"});
})