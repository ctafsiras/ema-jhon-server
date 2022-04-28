const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 4000;
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://ema_jhon_first_db:${process.env.DB_PASS}@emajhonfirstcluster.88i2a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        client.connect()
        const productsCollection = client.db('emaJhonDataBase').collection('products');

        app.get('/products', async (req, res) => {
            console.log(req.query);
            const page = parseInt(req.query.page)
            const size = parseInt(req.query.size)
            const query = {}

            const cursor = productsCollection.find(query)

            let products;

            if (page || size) {
                products = await cursor.skip(page * size).limit(size).toArray();
            } else {

                products = await cursor.toArray();
            }
            res.send(products)
        })

        app.get('/productCount', async (req, res) => {
            const count = await productsCollection.estimatedDocumentCount();
            res.send({ count })
        })


        //data from keys
        app.post('/productByKeys', async (req, res) => {
            const keys = req.body;
            const ids = keys.map(id => ObjectId(id))
            const query = { _id: { $in: ids } }
            const cursor = productsCollection.find(query)
            const result = await cursor.toArray();
            console.log(result);
            res.send(result);
        })
    }
    finally {

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Success')
})

app.listen(port)