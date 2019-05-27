'use strict';

const AWS = require('aws-sdk')
const util = require('util')
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.sendMessage = async (event) => {
  const responseData = JSON.parse(event.body);
  const domain = event.requestContext.domainName;
  const stage  = event.requestContext.stage;
  const connectionId = event.requestContext.connectionId;
  // const pushUrl = util.format(util.format("https://%s/%s", domain, stage));
  const pushUrl = `https://${domain}/${stage}`;

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
        chatId: "somechatid",
        connectionId:  connectionId,
        message: responseData.value,
        type: responseData.type,
        clientID: responseData.clientID,
        timestamp: Math.floor(new Date() / 1000)
    }
  }

  const queryParams = {
    TableName: process.env.DYNAMODB_TABLE,
    KeyConditionExpression: 'chatId = :hkey',
    ExpressionAttributeValues: {
      ':hkey': 'somechatid',
    }
  }

  try {
    await new Promise((resolve, reject) => {
      dynamoDb.put(params, (error) => {
        if(error) {
          console.log(error);
          reject(error);
        }

        resolve();  
      });
    })

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
          value: data.message,
          type: data.type,
          connectionId: data.connectionId,
          clientID: data.clientID
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
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }

  return {
    statusCode: 200
  };

};
