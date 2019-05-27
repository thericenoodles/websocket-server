'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
require('./patch.js');

module.exports.sendMessage = async (event) => {
    const responseData = JSON.parse(event.body);
    const domain = event.requestContext.domainName;
    const stage  = event.requestContext.stage;
    const connectionId = event.requestContext.connectionId;
    // const pushUrl = util.format(util.format("https://%s/%s", domain, stage));
    const pushUrl = `https://${domain}/${stage}`;

    const queryParams = {
      TableName: process.env.DYNAMODB_TABLE,
      KeyConditionExpression: 'chatId = :hkey',
      ExpressionAttributeValues: {
        ':hkey': 'defaultchatid',
      }
    }

    const dbItems = await new Promise((resolve, reject) => {
      dynamoDb.query(queryParams, (error, data) => {
        console.log(data.Items);
        if(error) {
          console.log(error);
          reject(error);
        }

        resolve(data.Items);
      })
    })

    await new Promise((resolve, reject) => {
      const connectionGateway = new AWS.ApiGatewayManagementApi({'apiVersion': '2029', endpoint: pushUrl});
      dbItems.forEach((data) => {
        const responseMsg = {
          value: responseData.message,
          type: responseData.type,
          connectionId: data.connectionId,
          clientID: responseData.clientID
        }

        connectionGateway.postToConnection({
          ConnectionId: data.connectionId,
          Data: JSON.stringify(responseMsg)
        }, (err, data) => {
          if (err) {
            console.log('some error');
            console.log(err);
            reject(err);
          }
    
          resolve(data);
        })
      })
    });

    return {
      statusCode: 200
    };

};
