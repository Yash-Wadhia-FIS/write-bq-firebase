const express = require('express');
const cors = require('cors');
const { BigQuery } = require('@google-cloud/bigquery');

const {writeToFirebaseDb} = require('./firebase');

const bigquery = new BigQuery({
    projectId: 'ai-lab-280706',
})

const app = express();
app.use(cors());

app.get('/update-to-firebase', async (req, res, next) => {
    const inference_query = `SELECT * FROM ai-lab-280706.retail_ai.inference LIMIT 100`;
    const product_query = `SELECT * FROM ai-lab-280706.retail_ai.product LIMIT 100`;
    let inference_data = [];
    let product_data = [];
    bigquery
        .query(inference_query)
        .then((rows) => {
            inference_data = [...rows[0]]
        }).then(() => {
            bigquery
                .query(product_query)
                .then((rows) => {
                    product_data = [...rows[0]]
                }).then(() => {
                    let result = product_data.map((data) => {
                        let match = inference_data.find((_data) => _data.name === data.name);
                        if (match) {
                            return {
                                ...data,
                                quantity: 1,
                            }
                        } else {
                            return {
                                ...data,
                                quantity: 0,
                            }
                        }
                    });
                    writeToFirebaseDb(result)
                    .then((result) => {
                        res.status(200).send(result);
                    })
                    .catch((err) => {
                        res.send(err)
                    })
                });
        });
});

app.get('/', (req, res) => {
    res.send('Function to deploy images to bucket');
});

app.listen(3000, function (err) {
    if (err) console.log(err)
    console.log('Server listening on Port 3000');
});
