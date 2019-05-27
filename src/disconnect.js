'use strict';

const AWS = require('aws-sdk')

module.exports.disconnect = async (event) => {
    const connectionId = event.requestContext.connectionId;
  
    console.log("disconnect");
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            chatId: "defaultchatid",
            connectionId:  connectionId
        }
      };
  
      await new Promise((resolve, reject) => {
        dynamoDb.delete(params, (error) => {
          if(error) {
            reject(error);
          }
  
          resolve();  
        });
      }).catch(error => console.log(error));
  
      return {
        statusCode: 200
      };
}