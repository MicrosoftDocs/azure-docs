---
title: "Quickstart: Create knowledge base - REST, Node.js - QnA Maker"
description: This quickstart walks you through creating a sample QnA maker knowledge base, programmatically, that will appear in your Azure Dashboard of your Cognitive Services API account.
services: cognitive-services
author: diberry
manager: cgronlun

ms.service: cognitive-services
ms.technology: qna-maker
ms.topic: quickstart
ms.date: 10/02/2018
ms.author: diberry
---

# Quickstart: Create a Qna Maker knowledge base in Node.js

This quickstart walks you through programmatically creating a sample QnA maker knowledge base. QnA Maker automatically extracts questions and answers from semi-structured content, like FAQs, from [data sources](../Concepts/data-sources-supported.md). The model for the knowledge base is defined in the JSON sent in the body of the API request. 

This quickstart calls Qna Maker APIs:
* [Create KB](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)
* [Get Operation Details](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/operations_getoperationdetails)

## Prerequisites

* [Node.js 6+](https://nodejs.org/en/download/)
* You must have a [Qna Maker service](../How-To/set-up-qnamaker-service-azure.md). To retrieve your key, select **Keys** under **Resource Management** in your dashboard. 

[!INCLUDE [Code is available in Azure-Samples Github repo](../../../../includes/cognitive-services-qnamaker-nodejs-repo-note.md)]

## Create a knowledge base Node.js file

Create a file named `create-new-knowledge-base.js`.

## Add the required dependencies

```nodejs
'use strict';

let fs = require ('fs');
let https = require ('https');
```

## Add the required constants

```nodejs
// Replace this with a valid subscription key.
let subscriptionKey = 'ADD KEY HERE';

// Represents the various elements used to create HTTP request URIs
// for QnA Maker operations.
let host = 'westus.api.cognitive.microsoft.com';
let service = '/qnamaker/v4.0';
let method = '/knowledgebases/';

// Build your path URL.
var path = service + method;

```

## Add the KB definition

After the constants, add the following KB definition:

```nodejs
// Dictionary that holds the knowledge base.
// The data source includes a QnA pair with metadata, the URL for the
// QnA Maker FAQ article, and the URL for the Azure Bot Service FAQ article.
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
```
## Add supporting functions and structures

Add the following supporting functions:

1. Add the following function to print out JSON in a readable format:

    ```nodejs
    // Formats and indents JSON for display.
    let pretty_print = function (s) {
        return JSON.stringify(JSON.parse(s), null, 4);
    };
    ```

2. Add the following function to manage the HTTP response to get the creation operation status:

    ```nodejs
    // The 'callback' is called from the entire response.
    let response_handler = function (callback, response) {
        let body = '';
        response.on('data', function (d) {
            body += d;
        });
        response.on('end', function () {
            // Call the 'callback' with the status code, headers, and body of the response.
            callback({ status: response.statusCode, headers: response.headers, body: body });
        });
        response.on('error', function (e) {
            console.log('Error: ' + e.message);
        });
    };
    
    // Get an HTTP response handler that calls 'callback' from the entire response.
    let get_response_handler = function (callback) {
        // Return a function that takes an HTTP response and is closed over the specified callback.
        // This function signature is required by https.request, hence the need for the closure.
        return function (response) {
            response_handler(callback, response);
        };
    };
    ```

    This API call returns a JSON response that includes the operation status: 

    ```JSON
    {
      "operationState": "NotStarted",
      "createdTimestamp": "2018-09-26T05:22:53Z",
      "lastActionTimestamp": "2018-09-26T05:22:53Z",
      "userId": "XXX9549466094e1cb4fd063b646e1ad6",
      "operationId": "177e12ff-5d04-4b73-b594-8575f9787963"
    }
    ```
    
    Repeat the call until success or failure: 
    
    ```JSON
    {
      "operationState": "Succeeded",
      "createdTimestamp": "2018-09-26T05:22:53Z",
      "lastActionTimestamp": "2018-09-26T05:23:08Z",
      "resourceLocation": "/knowledgebases/XXX7892b-10cf-47e2-a3ae-e40683adb714",
      "userId": "XXX9549466094e1cb4fd063b646e1ad6",
      "operationId": "177e12ff-5d04-4b73-b594-8575f9787963"
    }
    ```
    
3. Add the following function to make an HTTP POST request to create the knowledge base. The `Ocp-Apim-Subscription-Key` is the Qna Maker service key, used for authentication. 

    ```nodejs
    // Call 'callback' when we have the entire response from the POST request.
    let post = function (path, content, callback) {
        let request_params = {
            method: 'POST',
            hostname: host,
            path: path,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': content.length,
                'Ocp-Apim-Subscription-Key': subscriptionKey
            }
        };
    
        // Pass the 'callback' function to the response handler.
        let req = https.request(request_params, get_response_handler(callback));
        req.write(content);
        req.end();
    };
    ```

    This API call returns a JSON response that includes the operation ID. Use the operation ID to determine if the KB is successfully created. 
    
    ```JSON
    {
      "operationState": "NotStarted",
      "createdTimestamp": "2018-09-26T05:19:01Z",
      "lastActionTimestamp": "2018-09-26T05:19:01Z",
      "userId": "XXX9549466094e1cb4fd063b646e1ad6",
      "operationId": "8dfb6a82-ae58-4bcb-95b7-d1239ae25681"
    }
    ```

4. Add the following function to make an HTTP GET request. The `Ocp-Apim-Subscription-Key` is the Qna Maker service key, used for authentication. 

    ```nodejs
    // Call 'callback' when we have the entire response from the GET request.
    let get = function (path, callback) {
        let request_params = {
            method: 'GET',
            hostname: host,
            path: path,
            headers: {
                'Ocp-Apim-Subscription-Key': subscriptionKey
            }
        };
    
        // Pass the callback function to the response handler.
        let req = https.request(request_params, get_response_handler(callback));
        req.end();
    };
    ```

## Add a method to create KB

Add the following function to create the knowledge base, calling into the **post** method:

```nodejs
// Call 'callback' when we have the response from the /knowledgebases/create POST method.
let create_kb = function (path, req, callback) {
    console.log('Calling ' + host + path + '.');
    // Send the POST request.
    post(path, req, function (response) {
        // Extract the data we want from the POST response and pass it to the callback function.
        callback({ operation: response.headers.location, response: response.body });
    });
};
```

## Add method to determine creation status

Add the following function to check the status of the creation operation, calling into the **get** method
    
```nodejs
// Call 'callback' when we have the response from the GET request to check the status.
let check_status = function (path, callback) {
    console.log('Calling ' + host + path + '.');
    // Send the GET request.
    get(path, function (response) {
        // Extract the data we want from the GET response and pass it to the callback function.
        callback({ wait: response.headers['retry-after'], response: response.body });
    });
};
```

## Add create-kb method

The following method is the main method and creates the KB and repeats checks on the status. Because the KB creation may take some time, you need to repeat calls to check the status until the status is either successful or fails.

```nodejs
// Convert the request to a string.
let content = JSON.stringify(req);

create_kb(path, content, function (result) {

    // Formats and indents the JSON response from the /knowledgebases/create method for display.
    console.log(pretty_print(result.response));

    // Loop until the operation is complete.
    let loop = function () {
        path = service + result.operation;

        // Check the status of the operation.
        check_status(path, function (status) {

            // Formats and indents the JSON for display.
            console.log(pretty_print(status.response));

            // Convert the status into an object and get the value of the 'operationState'.
            var state = (JSON.parse(status.response)).operationState;

            // If the operation isn't complete, wait and query again.
            if (state === 'Running' || state === 'NotStarted') {
                console.log('Waiting ' + status.wait + ' seconds...');
                setTimeout(loop, status.wait * 1000);
            }
        });
    };

    // Begin the loop.
    loop();
});
```

## Run the program

Enter the following command at a command-line to run the program. It will send the request to the Qna Maker API to create the KB, then it will poll for the results every 30 seconds. Each response is printed to the console window.

```bash
npm start
```

Once your knowledge base is created, you can view it in your QnA Maker Portal, [My knowledge bases](https://www.qnamaker.ai/Home/MyServices) page. 

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)