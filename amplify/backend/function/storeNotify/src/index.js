/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_NOTILIST_ARN
	STORAGE_NOTILIST_NAME
Amplify Params - DO NOT EDIT */

'use strict';

// Load the AWS SDK for JS
var AWS = require("aws-sdk");


// Set a region to interact with (make sure it's the same as the region of your table)
AWS.config.update({ region: process.env.REGION });

var docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

exports.handler = async(event) => {
    
    var table = process.env.STORAGE_NOTILIST_NAME;

    var message = JSON.parse(event.body);


    var params = {
        Item: {
            notifyTrackerId: message.notifyTrackerId
        },
        TableName: table
    };

    console.log(params);
    // Read user preference from dynamoDB
    var result = await docClient.put(params).promise();


    //return result;
    const response = {
        statusCode: 200,
        body: JSON.stringify(result),
    };
    return response;
};