---
title: "Quickstart: Publish Knowledge Base - REST, Node.js - Qna Maker"
titleSuffix: Azure Cognitive Services 
description: This quickstart walks you through programmatically publishing your knowledge base (KB). Publishing pushes the latest version of the knowledge base to a dedicated Azure Search index and creates an endpoint that can be called in your application or chat bot.
services: cognitive-services
author: diberry
manager: cgronlun

ms.service: cognitive-services
ms.technology: qna-maker
ms.topic: quickstart
ms.date: 10/02/2018
ms.author: diberry
---

# Quickstart: Publish a Qna Maker knowledge base in Node.js

This quickstart walks you through programmatically publishing your knowledge base (KB). Publishing pushes the latest version of the knowledge base to a dedicated Azure Search index and creates an endpoint that can be called in your application or chat bot.

This quickstart calls Qna Maker APIs:
* [Publish](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75fe) - this API doesn't require any information in the body of the request.


[!INCLUDE [Code is available in Azure-Samples Github repo](../../../../includes/cognitive-services-qnamaker-nodejs-repo-note.md)]

## Prerequisites

* [Node.js 6+](https://nodejs.org/en/download/)
* You must have a [Qna Maker service](../How-To/set-up-qnamaker-service-azure.md). To retrieve your key, select **Keys** under **Resource Management** in your dashboard. 
* Qna Maker knowledge base (KB) ID found in the URL in the kbid query string parameter as shown below.

    ![QnA Maker knowledge base ID](../media/qnamaker-quickstart-kb/qna-maker-id.png)

If you don't have a knowledge base yet, you can create a sample one to use for this quickstart: [Create a new knowledge base](create-new-kb-nodejs.md).

## Create a knowledge base Node.js file

Create a file named `update-knowledge-base.js`.

## Add required dependencies

``` Node.js
'use strict';

let fs = require ('fs');
let https = require ('https');
```

## Add required constants

```nodejs
// **********************************************
// *** Update or verify the following values. ***
// **********************************************

let host = 'westus.api.cognitive.microsoft.com';
let service = '/qnamaker/v4.0';
let method = '/knowledgebases/';
var path = service + method + kb;

// Replace this with a valid subscription key.
let subscriptionKey = 'ENTER KEY HERE';
```

## Add knowledge base ID

```nodejs
// NOTE: Replace this with a valid knowledge base ID.
let kb = 'ENTER ID HERE';
```

## Add supporting functions and structures

```nodejs
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

```

## Add main code to publish KB

```nodejs
publish_kb (path, '', function (result) {
    console.log (pretty_print(result));
});
```

## Run the program

Build and run the program. It will automatically send the request to the Qna Maker API to publish the KB, then the response is printed to the console window.

Once your knowledge base is published, you can query it from the endpoint with a client application or chat bot. 

```bash
npm start
```

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)