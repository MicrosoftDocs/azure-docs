---
title: Create a new knowledge base - quickstart Node.js - for Microsoft QnA Maker API (V4) - Azure Cognitive Services | Microsoft Docs
description: Create a knowledge base in Node.js to hold your FAQs or product manuals, so you can get started with QnA Maker.
services: cognitive-services
author: noellelacharite
manager: nolachar

ms.service: cognitive-services
ms.technology: qna-maker
ms.topic: quickstart
ms.date: 06/15/2018
ms.author: nolachar
---

# Create a new knowledge base in Node.js

## Prerequisites

You will need [Node.js 6](https://nodejs.org/en/download/) to run this code.

You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Microsoft QnA Maker API**. You will need a paid subscription key from your [Azure dashboard](https://portal.azure.com/#create/Microsoft.CognitiveServices).

## Create knowledge base

The following code creates a new knowledge base, using the [Create](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff) method.

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

let host = 'westus.api.cognitive.microsoft.com';
let service = '/qnamaker/v4.0';
let method = '/knowledgebases/create';

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

// callback is the function to call when we have the entire response from the POST request.
let post = function (path, content, callback) {
	let request_params = {
		method : 'POST',
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

// callback is the function to call when we have the response from the /knowledgebases/create POST method.
let create_kb = function (path, req, callback) {
	console.log ('Calling ' + host + path + '.');
// Send the POST request.
	post (path, req, function (response) {
// Extract the data we want from the POST response and pass it to the callback function.
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
  "name": "QnA Maker FAQ",
  "qnaList": [
    {
      "id": 0,
      "answer": "You can use our REST APIs to manage your Knowledge Base. See here for details: https://westus.dev.cognitive.microsoft.com/docs/services/58994a073d9e04097c7ba6fe/operations/58994a073d9e041ad42d9baa",
      "source": "Custom Editorial",
      "questions": [
        "How do I programmatically update my Knowledge Base?"
      ],
      "metadata": [
        {
          "name": "category",
          "value": "api"
        }
      ]
    }
  ],
  "urls": [
    "https://docs.microsoft.com/en-in/azure/cognitive-services/qnamaker/faqs",
    "https://docs.microsoft.com/en-us/bot-framework/resources-bot-framework-faq"
  ],
  "files": []
};

var path = service + method;
// Convert the request to a string.
let content = JSON.stringify(req);
create_kb (path, content, function (result) {
// Write out the response from the /knowledgebases/create method.
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

## The create knowledge base response

A successful response is returned in JSON, as shown in the following example:

```json
{
  "operationState": "NotStarted",
  "createdTimestamp": "2018-04-13T01:52:30Z",
  "lastActionTimestamp": "2018-04-13T01:52:30Z",
  "userId": "2280ef5917bb4ebfa1aae41fb1cebb4a",
  "operationId": "e88b5b23-e9ab-47fe-87dd-3affc2fb10f3"
}
...
{
  "operationState": "Running",
  "createdTimestamp": "2018-04-13T01:52:30Z",
  "lastActionTimestamp": "2018-04-13T01:52:30Z",
  "userId": "2280ef5917bb4ebfa1aae41fb1cebb4a",
  "operationId": "e88b5b23-e9ab-47fe-87dd-3affc2fb10f3"
}
...
{
  "operationState": "Succeeded",
  "createdTimestamp": "2018-04-13T01:52:30Z",
  "lastActionTimestamp": "2018-04-13T01:52:46Z",
  "resourceLocation": "/knowledgebases/b0288f33-27b9-4258-a304-8b9f63427dad",
  "userId": "2280ef5917bb4ebfa1aae41fb1cebb4a",
  "operationId": "e88b5b23-e9ab-47fe-87dd-3affc2fb10f3"
}
```

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)