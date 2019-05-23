'use strict';

const AWS = require('aws-sdk')
const util = require('util')

module.exports.start = async (event) => {
  const domain = event.requestContext.domainName;
  const stage  = event.requestContext.stage;
  const connectionId = event.requestContext.connectionId;
  const pushUrl = util.format("https://%s/%s", domain, stage);

  try {
    await new Promise((resolve, reject) => {
      const connectionGateway = new AWS.ApiGatewayManagementApi({'apiVersion': '2029', endpoint: pushUrl});
      connectionGateway.postToConnection({
        ConnectionId: connectionId,
        Data: `#${connectionId} connected to chat`
      }, (err, data) => {
        if (err) {
          console.log('some error');
          console.log(err);
          reject(err);
        }
  
        resolve(data);
      })
    });
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }

  return {
    statusCode: 200
  };

};
