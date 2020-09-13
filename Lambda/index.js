const awsAPI = require('./awsAPI.js');

exports.handler = async (event) => {
    let method = event.http_method;
    let id = event.id;
    let type = event.type;
    let index = event.index;
    let body = event.body;
    
    switch(method){
        case 'GET': {
            let data = (await awsAPI.getDBItemData('HealtheRemind', 'id', id)).Item;
            
            return data;
        }
        case 'POST': {
            await awsAPI.setDBItemUpdate(
                'HealtheRemind',
                'id',
                id,
                {
                    prescriptions: [],
                    appointments: []
                }
            );
            
            return {};
        }
        case 'PUT': {
            if(type == 'prescription'){
                await awsAPI.setDBItemData(
                    'HealtheRemind',
                    'id',
                    id,
                    `SET prescriptions[${index}]=:prescription`,
                    {},
                    {
                        ':prescription': body
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
                        ':appointment': body
                    }
                );
            }
            
            return {};
        }
        case 'DELETE': {
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
            
            return {};
        }
    }

    return {};
};
