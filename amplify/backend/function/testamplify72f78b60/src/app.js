/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_NOTILIST_ARN
	STORAGE_NOTILIST_NAME
Amplify Params - DO NOT EDIT */
/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/




var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

const AWS = require('aws-sdk')
var dynamodb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

// declare a new express app
var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

var tableName = process.env.STORAGE_NOTILIST_NAME;

/**********************
 * Example get method *
 **********************/

app.get('/expresss', function(req, res) {

  var notifyTrackerId = req.query.notifyTrackerId;
  var getItemParams = {
    Key: {
      notifyTrackerId: notifyTrackerId
    },
    TableName: tableName
  };
  console.log(req);
  dynamodb.get(getItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: 'Could not load items: ' + err.message });
    }
    else {
      if (data.Item) {
        res.json(data.Item);
      }
      else {
        res.statusCode = 500;
        res.json({ error: 'Item Not found' });
      }
    }
  });

  // res.json({success: 'get call succeed!', url: req.url});
});

app.put('/updateStatus', function(req, res) {


  var updateStatusParam = {
        TableName: tableName,
    Key: {
      notifyTrackerId: req.body.notifyTrackerId
    },
    UpdateExpression: "set notificationStatus = :notificationStatus",
    ExpressionAttributeValues: {
      ":notificationStatus": req.body.notificationStatus
    },
    ReturnValues: "UPDATED_NEW"
  };

    dynamodb.update(updateStatusParam, (err, data) => {
    if(err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url, body: req.body});
    } else{
      res.json({success: 'put call succeed!', url: req.url, body: data});
    }
  });

  // res.json({success: 'get call succeed!', url: req.url});
});

app.get('/expresss/user', function(req, res) {
  var userId = req.query.userId;
  var startDate = req.query.startDate;
  var queryParams = {
    KeyConditionExpression: "userId = :userId AND createdOn >= :startDate",
    ExpressionAttributeValues: {
      ":userId": userId,
      ":startDate": startDate
    },
    TableName: tableName,
    IndexName: "user-createdOn",
    ScanIndexForward: false
  };
  console.log(req);
  dynamodb.query(queryParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: 'Could not load items: ' + err.message });
    }
    else {
      if (data) {
        res.json(data.Items);
      }
      else {
        res.statusCode = 500;
        res.json({ error: 'Item Not found' });
      }
    }
  });

  // Add your code here
  //res.json({success: 'get call succeed!', url: req.url, body: req.query});
});

/****************************
 * Example post method *
 ****************************/

/****************************
 * Example put method *
 ****************************/

app.put('/expresss', function(req, res) {

  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }
  dynamodb.put(putItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url, body: putItemParams });
    }
    else {
      res.json({ success: 'put call succeed!', url: req.url, body: req.body })
    }
  });

  // Add your code here
  //res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put('/updateNested', function(req, res) {
// this code for reference
//   var table = "UserNotifications";
// const notificationMessage = {
//   "messageBody": "user1",
//   "nestedExample": {"today": "free"},
//   "trackingId" : "tr001"
// };

// const messageList = [notificationMessage];
 
// var userFederatedId = "user111" ;

//         var params = {
//             Key: {
//             "userFederatedId": userFederatedId
//             }, 
//             TableName: table,
//             UpdateExpression: "SET notificationList = list_append(notificationList, :notificationMessage)",
//               ExpressionAttributeValues: {
//                 ":notificationMessage" : messageList
//               },
//               ReturnValues: "ALL_NEW"
//           };

//         var result = await docClient.update(params).promise();
        
//         return result;
//   // Add your code here
  //res.json({success: 'put call succeed!', url: req.url, body: req.body})
});



app.use('/', function(req, res) {
  // Add your code here
  res.json({ success: 'Invalid path, Check the url', url: req.url });
});


app.listen(3000, function() {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app

//Content-Type: application/json



// for get 
// notifyTrackerId = "tr008"


//for put
// {
//   "category": "Trasactional",
//   "channel": "INAPP",
//   "createdOn": "2020-05-15T13:48:59Z",
//   "message": "test1",
//   "notifyTrackerId": "tr008",
//   "status": "READ",
//   "userId": "user003"
// }


//for get/user
//   userId=user001&startDate=2020-02-15T13:48:59Z

// update status

// {
//   "notifyTrackerId": "tr008",
//   "notificationStatus": "DELETE"
// }