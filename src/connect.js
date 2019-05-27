'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.connect = async (event) => {
    const connectionId = event.requestContext.connectionId;

    console.log("connect");
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
          chatId: "defaultchatid",
          connectionId:  connectionId,
          timestamp: Math.floor(new Date() / 1000)
      }
    };

    await new Promise((resolve, reject) => {
      dynamoDb.put(params, (error) => {
        if(error) {
          reject(error);
        }

        resolve();  
      });
    }).catch(error => console.log(error));

    return {
      statusCode: 200
    };

};
