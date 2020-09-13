const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.getDBItemData = (table, primaryKeyTitle, primaryKey) => {
    let params = {
        TableName: table,
        Key: {}
    };
    params.Key[primaryKeyTitle] = primaryKey;
    
    return new Promise(resolve => {
        docClient.get(params, function(err, data){
            if(err){
                console.log(err);
                console.log(`[${table}] - FAIL getDBItemData`);
                resolve(err);
            }else{
                console.log(`[${table}] - SUCCESS getDBItemData`);
                resolve(data);
            }
        });
    });
};

exports.setDBItemData = (table, primaryKeyTitle, primaryKey, updateExpression, expressionAttr, expressionVal) => {
    let params = {
        TableName: table,
        Key: {},
        UpdateExpression: updateExpression,
        ReturnValues: "UPDATED_NEW"
    };
    params.Key[primaryKeyTitle] = primaryKey;
    
    if(Object.keys(expressionAttr).length > 0)
        params.ExpressionAttributeNames = expressionAttr;
    if(Object.keys(expressionVal).length > 0)
        params.ExpressionAttributeValues = expressionVal;
        
    return new Promise(resolve => {
        docClient.update(params, function(err, res){
            if(err){
                console.log(err);
                console.log(`[${table}] - FAIL setDBItemData`);
                resolve(err);
            }
            else{
                console.log(`[${table}] - SUCCESS setDBItemData`);
                resolve();
            }
        });
    });
};

exports.setDBItemUpdate = (table, primaryKeyTitle, primaryKey, items) => {
    let params = {
        TableName: table,
        Item: items
    };
    params.Item[primaryKeyTitle] = primaryKey;

    return new Promise(resolve => {
        docClient.put(params, function(err, res){
            if(err){
                console.log(err);
                console.log(`[${table}] - FAIL setDBItemUpdate`);
                resolve(err);
            }
            else{
                console.log(`[${table}] - SUCCESS setDBItemUpdate`);
                resolve();
            }
        });
    });
};