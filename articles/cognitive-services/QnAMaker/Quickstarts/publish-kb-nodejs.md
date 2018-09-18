---
title: "Quickstart: Node.js Publish Knowledge Base - Qna Maker"
titleSuffix: Azure Cognitive Services 
description: How to publish a knowledge base in Node.js for QnA Maker.
services: cognitive-services
author: diberry
manager: cjgronlund

ms.service: cognitive-services
ms.technology: qna-maker
ms.topic: quickstart
ms.date: 09/12/2018
ms.author: diberry
---

# Publish a knowledge base in Node.js

The following code publishes an existing knowledge base, using the [Publish](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75fe) method.

[!INCLUDE [Code is available in Azure-Samples Github repo](../../../../../includes/cognitive-services-qnamaker-nodejs-repo-note.md)]

If you don't have a knowledge base yet, you can create a sample one to use for this quickstart: [Create a new knowledge base](create-new-kb-nodejs.md).

1. Create a new Node project in your favorite IDE.
1. Add the code provided below.
1. Replace the `subscriptionKey` value with a valid subscription key.
1. Replace the `kb` value with a valid knowledge base ID. Find this value by going to one of your [QnA Maker knowledge bases](https://www.qnamaker.ai/Home/MyServices). Select the knowledge base you want to publish. Once on that page, find the 'kdid=' in the URL as shown below. Use its value for your code sample.

    ![QnA Maker knowledge base ID](../media/qnamaker-quickstart-kb/qna-maker-id.png)
1. Run the program.

``` Node.js
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
            'Content-Length' : content.length,
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

## Understand what QnA Maker returns

A successful response is returned in JSON, as shown in the following example:

```json
{
  "result": "Success."
}
```

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)