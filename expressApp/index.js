const awsAPI = require('./awsAPI.js');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = 80;

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.get('/:id', async (req, res) => {
    let id = req.params.id;

    let data = (await awsAPI.getDBItemData('HealtheRemind', 'id', id)).Item;

    res.send(data);
});

app.post('/:id', async (req, res) => {
    let id = req.params.id;

    await awsAPI.setDBItemUpdate(
        'HealtheRemind',
        'id',
        id,
        {
            prescriptions: [],
            appointments: [],
            notes: []
        }
    )
    
    res.send({});
});

app.put('/:id/:type/:index', async (req, res) => {
    let id = req.params.id;
    let type = req.params.type;
    let index = req.params.index;
    let data = req.body;

    if(type == 'prescription'){
        await awsAPI.setDBItemData(
            'HealtheRemind',
            'id',
            id,
            `SET prescriptions[${index}]=:prescription`,
            {},
            {
                ':prescription': data
            }
        );
    }
    else if(type == 'appointment'){
        await awsAPI.setDBItemData(
            'HealtheRemind',
            'id',
            id,
            `SET appointments[${index}]=:appointment`,
            {},
            {
                ':appointment': data
            }
        );
    }
    
    res.send({});
});

app.delete('/:id/:type/:index', async (req, res) => {
    let id = req.params.id;
    let type = req.params.type;
    let index = req.params.index;

    if(type == 'prescription'){
        await awsAPI.setDBItemData(
            'HealtheRemind',
            'id',
            id,
            `REMOVE prescriptions[${index}]`,
            {},
            {}
        );
    }
    else if(type == 'appointment'){
        await awsAPI.setDBItemData(
            'HealtheRemind',
            'id',
            id,
            `REMOVE appointments[${index}]`,
            {},
            {}
        );
    }
    
    res.send({
        id: id,
        type: type,
        index: index
    });
});

app.listen(port, () => console.log(`App listening on http://localhost:${port}`))
