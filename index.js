const express = require('express');
const BigQueryConnector = require('./BigQueryConnector');
const app = express();

const port = 8080;
BigQueryConnector.getGcnInspirationData();

app.get('/', async (req, res) => {
    try {
        const data = await BigQueryConnector.getGcnInspirationData();
        return res.status(200).send(JSON.stringify(data));
    } catch (error) {
        console.log(error);
        return res.status(418).send(`I'm a teapot and my lid fell off`);
    }
});

app.listen(port, () => { 
    console.log(`Example app listening on port ${port}!`)
});