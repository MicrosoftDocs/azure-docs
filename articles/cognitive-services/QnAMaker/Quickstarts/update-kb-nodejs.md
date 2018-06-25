---
title: Update Knowledge Base, Node.js Quickstart - Azure Cognitive Services | Microsoft Docs
description: How to update a knowledge base in Node.js for QnA Maker.
services: cognitive-services
author: noellelacharite
manager: nolachar

ms.service: cognitive-services
ms.technology: qna-maker
ms.topic: quickstart
ms.date: 06/18/2018
ms.author: nolachar
---

# Update a knowledge base in Node.js

The following code updates an existing knowledge base, using the [Update](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da7600) method.

1. Create a new Node.js project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```nodejs
'use strict';

let fs = require ('fs');
let https = require ('https');

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace this with a valid subscription key.
let subscriptionKey = 'ENTER KEY HERE';

// NOTE: Replace this with a valid knowledge base ID.
let kb = 'ENTER ID HERE';

let host = 'westus.api.cognitive.microsoft.com';
let service = '/qnamaker/v4.0';
let method = '/knowledgebases/';

let pretty_print = function (s) {
	return JSON.stringify(JSON.parse(s), null, 4);
}

// callback is the function to call when we have the entire response.
let response_handler = function (callback, response) {
    let body = '';
    response.on ('data', function (d) {
        body += d;
    });
    response.on ('end', function () {
// Call the callback function with the status code, headers, and body of the response.
		callback ({ status : response.statusCode, headers : response.headers, body : body });
    });
    response.on ('error', function (e) {
        console.log ('Error: ' + e.message);
    });
};

// Get an HTTP response handler that calls the specified callback function when we have the entire response.
let get_response_handler = function (callback) {
// Return a function that takes an HTTP response, and is closed over the specified callback.
// This function signature is required by https.request, hence the need for the closure.
	return function (response) {
		response_handler (callback, response);
	}
}

// callback is the function to call when we have the entire response from the PATCH request.
let patch = function (path, content, callback) {
	let request_params = {
		method : 'PATCH',
		hostname : host,
		path : path,
		headers : {
			'Content-Type' : 'application/json',
			'Content-Length' : content.length,
			'Ocp-Apim-Subscription-Key' : subscriptionKey,
		}
	};

// Pass the callback function to the response handler.
	let req = https.request (request_params, get_response_handler (callback));
	req.write (content);
	req.end ();
}

// callback is the function to call when we have the entire response from the GET request.
let get = function (path, callback) {
	let request_params = {
		method : 'GET',
		hostname : host,
		path : path,
		headers : {
			'Ocp-Apim-Subscription-Key' : subscriptionKey,
		}
	};

// Pass the callback function to the response handler.
	let req = https.request (request_params, get_response_handler (callback));
	req.end ();
}

// callback is the function to call when we have the response from the /knowledgebases PATCH method.
let update_kb = function (path, req, callback) {
	console.log ('Calling ' + host + path + '.');
// Send the PATCH request.
	patch (path, req, function (response) {
// Extract the data we want from the PATCH response and pass it to the callback function.
		callback ({ operation : response.headers.location, response : response.body });
	});
}

// callback is the function to call when we have the response from the GET request to check the status.
let check_status = function (path, callback) {
	console.log ('Calling ' + host + path + '.');
// Send the GET request.
	get (path, function (response) {
// Extract the data we want from the GET response and pass it to the callback function.
		callback ({ wait : response.headers['retry-after'], response : response.body });
	});
}

let req = {
  'add': {
    'qnaList': [
      {
        'id': 1,
        'answer': 'You can change the default message if you use the QnAMakerDialog. See this for details: https://docs.botframework.com/en-us/azure-bot-service/templates/qnamaker/#navtitle',
        'source': 'Custom Editorial',
        'questions': [
          'How can I change the default message from QnA Maker?'
        ],
        'metadata': []
      }
    ],
    'urls': [
      'https://docs.microsoft.com/en-us/azure/cognitive-services/Emotion/FAQ'
    ]
  },
  'update' : {
    'name' : 'New KB Name'
  },
  'delete': {
    'ids': [
      0
    ]
  }
};

var path = service + method + kb;
// Convert the request to a string.
let content = JSON.stringify(req);
update_kb (path, content, function (result) {
	console.log (pretty_print(result.response));
// Loop until the operation is complete.
	let loop = function () {
		path = service + result.operation;
// Check the status of the operation.
		check_status (path, function (status) {
// Write out the status.
			console.log (pretty_print(status.response));
// Convert the status into an object and get the value of the operationState field.
			var state = (JSON.parse(status.response)).operationState;
// If the operation isn't complete, wait and query again.
			if (state == 'Running' || state == 'NotStarted') {
				console.log ('Waiting ' + status.wait + ' seconds...');
				setTimeout(loop, status.wait * 1000);
			}
		});
	}
// Begin the loop.
	loop();
});
```

## The update knowledge base response

A successful response is returned in JSON, as shown in the following example:

```json
{
  "operationState": "NotStarted",
  "createdTimestamp": "2018-04-13T01:49:48Z",
  "lastActionTimestamp": "2018-04-13T01:49:48Z",
  "userId": "2280ef5917bb4ebfa1aae41fb1cebb4a",
  "operationId": "5156f64e-e31d-4638-ad7c-a2bdd7f41658"
}
...
{
  "operationState": "Succeeded",
  "createdTimestamp": "2018-04-13T01:49:48Z",
  "lastActionTimestamp": "2018-04-13T01:49:50Z",
  "resourceLocation": "/knowledgebases/140a46f3-b248-4f1b-9349-614bfd6e5563",
  "userId": "2280ef5917bb4ebfa1aae41fb1cebb4a",
  "operationId": "5156f64e-e31d-4638-ad7c-a2bdd7f41658"
}
Press any key to continue.
```

## Get request status

You can call the [Operation](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/operations_getoperationdetails) method to check the status of a request to create or update a knowledge base. To see how this method is used, please see the sample code for the [Create](#Create) or [Update](#Update) method.

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)