---
title: "REST API (V4) - Node.js - QnA Maker"
titleSuffix: Azure Cognitive Services 
description: Get Node.js REST-based information and code samples to help you quickly get started using the Microsoft Translator Text API in Microsoft Cognitive Services on Azure.
services: cognitive-services
author: diberry
manager: nitinme

ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: quickstart
ms.date: 02/13/2019
ms.author: diberry
ms.custom: seodec18
---
# How to use the QnA Maker REST API with Node.js 
<a name="HOLTop"></a>

This article shows you how to use the [Microsoft QnA Maker API](../Overview/overview.md) with Node.js to do the following.

- [Create a new knowledge base.](#Create)
- [Update an existing knowledge base.](#Update)
- [Get the status of a request to create or update a knowledge base.](#Status)
- [Publish an existing knowledge base.](#Publish)
- [Replace the contents of an existing knowledge base.](#Replace)
- [Download the contents of a knowledge base.](#GetQnA)
- [Get answers to a question using a knowledge base.](#GetAnswers)
- [Get information about a knowledge base.](#GetKB)
- [Get information about all knowledge bases belonging to the specified user.](#GetKBsByUser)
- [Delete a knowledge base.](#Delete)
- [Get the current endpoint keys.](#GetKeys)
- [Re-generate the current endpoint keys.](#PutKeys)
- [Get the current set of case-insensitive word alterations.](#GetAlterations)
- [Replace the current set of case-insensitive word alterations.](#PutAlterations)

[!INCLUDE [Code is available in Azure-Samples GitHub repo](../../../../includes/cognitive-services-qnamaker-nodejs-repo-note.md)]

## Prerequisites

You will need [Node.js 6](https://nodejs.org/en/download/) to run this code.

You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Microsoft QnA Maker API**. You will need a paid subscription key from your [Azure dashboard](https://portal.azure.com/#create/Microsoft.CognitiveServices).

<a name="Create"></a>

## Create knowledge base

The following code creates a new knowledge base, using the [Create](https://go.microsoft.com/fwlink/?linkid=2092179) method.

1. Create a new Node.js project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```javascript
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
			'Content-Length' : Buffer.byteLength(content),
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
      "answer": "You can use our REST APIs to manage your Knowledge Base. See here for details: https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase/update",
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
    "https://docs.microsoft.com/azure/cognitive-services/qnamaker/faqs",
    "https://docs.microsoft.com/bot-framework/resources-bot-framework-faq"
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

**Create knowledge base response**

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

[Back to top](#HOLTop)

<a name="Update"></a>

## Update knowledge base

The following code updates an existing knowledge base, using the [Update](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase/update) method.

1. Create a new Node.js project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```javascript
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
			'Content-Length' : Buffer.byteLength(content),
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
        'answer': 'You can change the default message if you use the QnAMakerDialog. See this for details: https://docs.botframework.com/azure-bot-service/templates/qnamaker/#navtitle',
        'source': 'Custom Editorial',
        'questions': [
          'How can I change the default message from QnA Maker?'
        ],
        'metadata': []
      }
    ],
    'urls': [
      'https://docs.microsoft.com/azure/cognitive-services/Emotion/FAQ'
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

**Update knowledge base response**

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

[Back to top](#HOLTop)

<a name="Status"></a>

## Get request status

You can call the [Operation](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/operations/getdetails) method to check the status of a request to create or update a knowledge base. To see how this method is used, please see the sample code for the [Create](#Create) or [Update](#Update) method.

[Back to top](#HOLTop)

<a name="Publish"></a>

## Publish knowledge base

The following code publishes an existing knowledge base, using the [Publish](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase/publish) method.

1. Create a new Node.js project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```javascript
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

// callback is the function to call when we have the entire response from the POST request.
let post = function (path, content, callback) {
	let request_params = {
		method : 'POST',
		hostname : host,
		path : path,
		headers : {
			'Content-Type' : 'application/json',
			'Content-Length' : Buffer.byteLength(content),
			'Ocp-Apim-Subscription-Key' : subscriptionKey,
		}
	};

// Pass the callback function to the response handler.
	let req = https.request (request_params, get_response_handler (callback));
	req.write (content);
	req.end ();
}

// callback is the function to call when we have the response from the /knowledgebases POST method.
let publish_kb = function (path, req, callback) {
	console.log ('Calling ' + host + path + '.');
// Send the POST request.
	post (path, req, function (response) {
// Extract the data we want from the POST response and pass it to the callback function.
		if (response.status == '204') {
			let result = {'result':'Success'};
			callback (JSON.stringify(result));
		}
		else {
			callback (response.body);
		}
	});
}

var path = service + method + kb;
publish_kb (path, '', function (result) {
	console.log (pretty_print(result));
});
```

**Publish knowledge base response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
  "result": "Success."
}
```

[Back to top](#HOLTop)

<a name="Replace"></a>

## Replace knowledge base

The following code replaces the contents of the specified knowledge base, using the [Replace](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase/replace) method.

1. Create a new Node.js project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```javascript
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

// callback is the function to call when we have the entire response from the PUT request.
let put = function (path, content, callback) {
	let request_params = {
		method : 'PUT',
		hostname : host,
		path : path,
		headers : {
			'Content-Type' : 'application/json',
			'Content-Length' : Buffer.byteLength(content),
			'Ocp-Apim-Subscription-Key' : subscriptionKey,
		}
	};

// Pass the callback function to the response handler.
	let req = https.request (request_params, get_response_handler (callback));
	req.write (content);
	req.end ();
}

// callback is the function to call when we have the response from the /knowledgebases PUT method.
let replace_kb = function (path, req, callback) {
	console.log ('Calling ' + host + path + '.');
// Send the PUT request.
	put (path, req, function (response) {
// Extract the data we want from the PUT response and pass it to the callback function.
		if (response.status == '204') {
			let result = {'result':'Success'};
			callback (JSON.stringify(result));
		}
		else {
			callback (response.body);
		}
	});
}

let req = {
  'qnaList': [
    {
      'id': 0,
      'answer': 'You can use our REST APIs to manage your Knowledge Base. See here for details: https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase/update',
      'source': 'Custom Editorial',
      'questions': [
        'How do I programmatically update my Knowledge Base?'
      ],
      'metadata': [
        {
          'name': 'category',
          'value': 'api'
        }
      ]
    }
  ]
};

var path = service + method + kb;
// Convert the request to a string.
let content = JSON.stringify(req);
replace_kb (path, content, function (result) {
	console.log (pretty_print(result));
});
```

**Replace knowledge base response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
    "result": "Success."
}
```

[Back to top](#HOLTop)

<a name="GetQnA"></a>

## Download the contents of a knowledge base

The following code downloads the contents of the specified knowledge base, using the [Download knowledge base](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase/download) method.

1. Create a new Node.js project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```javascript
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

// NOTE: Replace this with "test" or "prod".
let env = "test";

let host = 'westus.api.cognitive.microsoft.com';
let service = '/qnamaker/v4.0';
let method = `/knowledgebases/${kb}/${env}/qna/`;

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

// callback is the function to call when we have the response from the /knowledgebases GET method.
let get_qna = function (path, callback) {
	console.log ('Calling ' + host + path + '.');
// Send the GET request.
	get (path, function (response) {
// Extract the data we want from the GET response and pass it to the callback function.
		callback ({ operation : response.headers.location, response : response.body });
	});
}

var path = service + method;
get_qna (path, function (result) {
	console.log (pretty_print(result.response));
});
```

**Download knowledge base response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
  "qnaDocuments": [
    {
      "id": 1,
      "answer": "You can use our REST APIs to manage your Knowledge Base. See here for details: https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase/update",
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
    },
    {
      "id": 2,
      "answer": "QnA Maker provides an FAQ data source that you can query from your bot or application. Although developers will find this useful, content owners will especially benefit from this tool. QnA Maker is a completely no-code way of managing the content that powers your bot or application.",
      "source": "https://docs.microsoft.com/azure/cognitive-services/qnamaker/faqs",
      "questions": [
        "Who is the target audience for the QnA Maker tool?"
      ],
      "metadata": []
    },
...
  ]
}
```

[Back to top](#HOLTop)

<a name="GetAnswers"></a>

## Get answers to a question using a knowledge base

The following code gets answers to a question using the specified knowledge base, using the **Generate answers** method.

1. Create a new Node.js project in your favorite IDE.
1. Add the code provided below.
1. Replace the `host` value with the Website name for your QnA Maker subscription. For more information see [Create a QnA Maker service](../How-To/set-up-qnamaker-service-azure.md).
1. Replace the `endpoint_key` value with a valid endpoint key for your subscription. Note this is not the same as your subscription key. You can get your endpoint keys using the [Get endpoint keys](#GetKeys) method.
1. Replace the `kb` value with the ID of the knowledge base you want to query for answers. Note this knowledge base must already have been published using the [Publish](#Publish) method.
1. Run the program.

```javascript
'use strict';

let fs = require ('fs');
let https = require ('https');

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// NOTE: Replace this with a valid host name.
let host = "ENTER HOST HERE";

// NOTE: Replace this with a valid endpoint key.
// This is not your subscription key.
// To get your endpoint keys, call the GET /endpointkeys method.
let endpoint_key = "ENTER KEY HERE";

// NOTE: Replace this with a valid knowledge base ID.
// Make sure you have published the knowledge base with the
// POST /knowledgebases/{knowledge base ID} method.
let kb = "ENTER KB ID HERE";

let method = "/qnamaker/knowledgebases/" + kb + "/generateAnswer";

let question = {
    'question': 'Is the QnA Maker Service free?',
    'top': 3
};

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
			'Content-Length' : Buffer.byteLength(content),
			'Authorization' : 'EndpointKey ' + endpoint_key,
		}
	};

// Pass the callback function to the response handler.
	let req = https.request (request_params, get_response_handler (callback));
	req.write (content);
	req.end ();
}

// callback is the function to call when we have the response from the /knowledgebases POST method.
let get_answers = function (path, req, callback) {
	console.log ('Calling ' + host + path + '.');
// Send the POST request.
	post (path, req, function (response) {
		callback (response.body);
	});
}

// Convert the request to a string.
let content = JSON.stringify(question);
get_answers (method, content, function (result) {
// Write out the response from the /knowledgebases/create method.
	console.log (pretty_print(result));
});
```

**Get answers response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
  "answers": [
    {
      "questions": [
        "Can I use BitLocker with the Volume Shadow Copy Service?"
      ],
      "answer": "Yes. However, shadow copies made prior to enabling BitLocker will be automatically deleted when BitLocker is enabled on software-encrypted drives. If you are using a hardware encrypted drive, the shadow copies are retained.",
      "score": 17.3,
      "id": 62,
      "source": "https://docs.microsoft.com/windows/security/information-protection/bitlocker/bitlocker-frequently-asked-questions",
      "metadata": []
    },
...
  ]
}
```

[Back to top](#HOLTop)

<a name="GetKB"></a>

## Get information about a knowledge base

The following code gets information about the specified knowledge base, using the [Get knowledge base details](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase/getdetails) method.

1. Create a new Node.js project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```javascript
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

// callback is the function to call when we have the response from the /knowledgebases GET method.
let get_kb = function (path, callback) {
	console.log ('Calling ' + host + path + '.');
// Send the GET request.
	get (path, function (response) {
// Extract the data we want from the GET response and pass it to the callback function.
		callback ({ operation : response.headers.location, response : response.body });
	});
}

var path = service + method + kb;
get_kb (path, function (result) {
	console.log (pretty_print(result.response));
});
```

**Get knowledge base details response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
  "id": "140a46f3-b248-4f1b-9349-614bfd6e5563",
  "hostName": "https://qna-docs.azurewebsites.net",
  "lastAccessedTimestamp": "2018-04-12T22:58:01Z",
  "lastChangedTimestamp": "2018-04-12T22:58:01Z",
  "name": "QnA Maker FAQ",
  "userId": "2280ef5917bb4ebfa1aae41fb1cebb4a",
  "urls": [
    "https://docs.microsoft.com/azure/cognitive-services/qnamaker/faqs",
    "https://docs.microsoft.com/bot-framework/resources-bot-framework-faq"
  ],
  "sources": [
    "Custom Editorial"
  ]
}
```

[Back to top](#HOLTop)

<a name="GetKBsByUser"></a>

## Get all knowledge bases for a user

The following code gets information about all knowledge bases for a specified user, using the [Get knowledge bases for user](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase/listall) method.

1. Create a new Node.js project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```javascript
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

// callback is the function to call when we have the response from the /knowledgebases GET method.
let get_kbs = function (path, callback) {
	console.log ('Calling ' + host + path + '.');
// Send the GET request.
	get (path, function (response) {
// Extract the data we want from the GET response and pass it to the callback function.
		callback ({ operation : response.headers.location, response : response.body });
	});
}

var path = service + method;
get_kbs (path, function (result) {
	console.log (pretty_print(result.response));
});
```

**Get knowledge bases for user response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
  "knowledgebases": [
    {
      "id": "081c32a7-bd05-4982-9d74-07ac736df0ac",
      "hostName": "https://qna-docs.azurewebsites.net",
      "lastAccessedTimestamp": "2018-04-12T11:51:58Z",
      "lastChangedTimestamp": "2018-04-12T11:51:58Z",
      "name": "QnA Maker FAQ",
      "userId": "2280ef5917bb4ebfa1aae41fb1cebb4a",
      "urls": [],
      "sources": []
    },
    {
      "id": "140a46f3-b248-4f1b-9349-614bfd6e5563",
      "hostName": "https://qna-docs.azurewebsites.net",
      "lastAccessedTimestamp": "2018-04-12T22:58:01Z",
      "lastChangedTimestamp": "2018-04-12T22:58:01Z",
      "name": "QnA Maker FAQ",
      "userId": "2280ef5917bb4ebfa1aae41fb1cebb4a",
      "urls": [
        "https://docs.microsoft.com/azure/cognitive-services/qnamaker/faqs",
        "https://docs.microsoft.com/bot-framework/resources-bot-framework-faq"
      ],
      "sources": [
        "Custom Editorial"
      ]
    },
...
  ]
}
Press any key to continue.
```

[Back to top](#HOLTop)

<a name="Delete"></a>

## Delete a knowledge base

The following code deletes the specified knowledge base, using the [Delete knowledge base](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase/delete) method.

1. Create a new Node.js project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```javascript
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

// callback is the function to call when we have the entire response from the DELETE request.
let http_delete = function (path, content, callback) {
	let request_params = {
		method : 'DELETE',
		hostname : host,
		path : path,
		headers : {
			'Content-Type' : 'application/json',
			'Content-Length' : Buffer.byteLength(content),
			'Ocp-Apim-Subscription-Key' : subscriptionKey,
		}
	};

// Pass the callback function to the response handler.
	let req = https.request (request_params, get_response_handler (callback));
	req.write (content);
	req.end ();
}

// callback is the function to call when we have the response from the /knowledgebases DELETE method.
let delete_kb = function (path, req, callback) {
	console.log ('Calling ' + host + path + '.');
// Send the DELETE request.
	http_delete (path, req, function (response) {
// Extract the data we want from the DELETE response and pass it to the callback function.
		if (response.status == '204') {
			let result = {'result':'Success'};
			callback (JSON.stringify(result));
		}
		else {
			callback (response.body);
		}
	});
}

var path = service + method + kb;
delete_kb (path, '', function (result) {
	console.log (pretty_print(result));
});
```

**Delete knowledge base response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
  "result": "Success."
}
```

[Back to top](#HOLTop)

<a name="GetKeys"></a>

## Get endpoint keys

The following code gets the current endpoint keys, using the [Get endpoint keys](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/endpointkeys/getkeys) method.

1. Create a new Node.js project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```javascript
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
let method = '/endpointkeys/';

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

// callback is the function to call when we have the response from the /knowledgebases GET method.
let get_keys = function (path, callback) {
	console.log ('Calling ' + host + path + '.');
// Send the GET request.
	get (path, function (response) {
// Extract the data we want from the GET response and pass it to the callback function.
		callback ({ operation : response.headers.location, response : response.body });
	});
}

var path = service + method;
get_keys (path, function (result) {
	console.log (pretty_print(result.response));
});
```

**Get endpoint keys response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
  "primaryEndpointKey": "ac110bdc-34b7-4b1c-b9cd-b05f9a6001f3",
  "secondaryEndpointKey": "1b4ed14e-614f-444a-9f3d-9347f45a9206"
}
```

[Back to top](#HOLTop)

<a name="PutKeys"></a>

## Refresh endpoint keys

The following code regenerates the current endpoint keys, using the [Refresh endpoint keys](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/endpointkeys/refreshkeys) method.

1. Create a new Node.js project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```javascript
'use strict';

let fs = require ('fs');
let https = require ('https');

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace this with a valid subscription key.
let subscriptionKey = 'ENTER KEY HERE';

// NOTE: Replace this with "PrimaryKey" or "SecondaryKey."
let key_type = "PrimaryKey";

let host = 'westus.api.cognitive.microsoft.com';
let service = '/qnamaker/v4.0';
let method = '/endpointkeys/';

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
			'Content-Length' : Buffer.byteLength(content),
			'Ocp-Apim-Subscription-Key' : subscriptionKey,
		}
	};

// Pass the callback function to the response handler.
	let req = https.request (request_params, get_response_handler (callback));
	req.write (content);
	req.end ();
}

// callback is the function to call when we have the response from the /knowledgebases PATCH method.
let refresh_keys = function (path, req, callback) {
	console.log ('Calling ' + host + path + '.');
// Send the PATCH request.
	patch (path, req, function (response) {
// Extract the data we want from the PATCH response and pass it to the callback function.
		if (response.status == '204') {
			let result = {'result':'Success'};
			callback (JSON.stringify(result));
		}
		else {
			callback (response.body);
		}
	});
}

let req = {
  'wordAlterations': [
    {
      'alterations': [
        'botframework',
        'bot frame work'
      ]
    }
  ]
};

var path = service + method + key_type;
// Convert the request to a string.
let content = JSON.stringify(req);
refresh_keys (path, content, function (result) {
	console.log (pretty_print(result));
});
```

**Refresh endpoint keys response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
  "primaryEndpointKey": "ac110bdc-34b7-4b1c-b9cd-b05f9a6001f3",
  "secondaryEndpointKey": "1b4ed14e-614f-444a-9f3d-9347f45a9206"
}
```

[Back to top](#HOLTop)

<a name="GetAlterations"></a>

## Get word alterations

The following code gets the current word alterations, using the [Download alterations](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/alterations/get) method.

1. Create a new Node.js project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```javascript
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
let method = '/alterations/';

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

// callback is the function to call when we have the response from the /knowledgebases GET method.
let get_alterations = function (path, callback) {
	console.log ('Calling ' + host + path + '.');
// Send the GET request.
	get (path, function (response) {
// Extract the data we want from the GET response and pass it to the callback function.
		callback ({ operation : response.headers.location, response : response.body });
	});
}

var path = service + method;
get_alterations (path, function (result) {
	console.log (pretty_print(result.response));
});
```

**Get word alterations response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
  "wordAlterations": [
    {
      "alterations": [
        "botframework",
        "bot frame work"
      ]
    }
  ]
}
```

[Back to top](#HOLTop)

<a name="PutAlterations"></a>

## Replace word alterations

The following code replaces the current word alterations, using the [Replace alterations](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/alterations/replace) method.

1. Create a new Node.js project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```javascript
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
let method = '/alterations/';

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

// callback is the function to call when we have the entire response from the PUT request.
let put = function (path, content, callback) {
	let request_params = {
		method : 'PUT',
		hostname : host,
		path : path,
		headers : {
			'Content-Type' : 'application/json',
			'Content-Length' : Buffer.byteLength(content),
			'Ocp-Apim-Subscription-Key' : subscriptionKey,
		}
	};

// Pass the callback function to the response handler.
	let req = https.request (request_params, get_response_handler (callback));
	req.write (content);
	req.end ();
}

// callback is the function to call when we have the response from the /knowledgebases PUT method.
let put_alterations = function (path, req, callback) {
	console.log ('Calling ' + host + path + '.');
// Send the PUT request.
	put (path, req, function (response) {
// Extract the data we want from the PUT response and pass it to the callback function.
		if (response.status == '204') {
			let result = {'result':'Success'};
			callback (JSON.stringify(result));
		}
		else {
			callback (response.body);
		}
	});
}

let req = {
  'wordAlterations': [
    {
      'alterations': [
        'botframework',
        'bot frame work'
      ]
    }
  ]
};

var path = service + method;
// Convert the request to a string.
let content = JSON.stringify(req);
put_alterations (path, content, function (result) {
	console.log (pretty_print(result));
});
```

**Replace word alterations response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
  "result": "Success."
}
```

[Back to top](#HOLTop)

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://go.microsoft.com/fwlink/?linkid=2092179)

## See also 

[QnA Maker overview](../Overview/overview.md)
