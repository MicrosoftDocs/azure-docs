## Get answers to a question using a knowledge base

The following code gets answers to a question using the specified knowledge base, using the **Generate answers** method.

1. Create a new Node.js project in your favorite IDE.
1. Add the code provided below.
1. Replace the `host` value with the Website name for your QnA Maker subscription. For more information see [Create a QnA Maker service](../How-To/set-up-qnamaker-service-azure.md).
1. Replace the `endpoint_key` value with a valid endpoint key for your subscription. Note this is not the same as your subscription key. You can get your endpoint keys using the [Get endpoint keys](#GetKeys) method.
1. Replace the `kb` value with the ID of the knowledge base you want to query for answers. Note this knowledge base must already have been published using the [Publish](#Publish) method.
1. Run the program.

```nodejs
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
