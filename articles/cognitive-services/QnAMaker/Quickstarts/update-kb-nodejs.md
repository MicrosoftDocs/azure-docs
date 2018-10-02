---
title: "Quickstart: Update knowledge base - REST, Node.js - QnA Maker"
titleSuffix: Azure Cognitive Services
description: This quickstart walks you through programmatically updating an existing QnA maker knowledge base (KB).  This JSON allows you to update a KB by adding new data sources, changing data sources, or deleting data sources.
services: cognitive-services
author: diberry
manager: cgronlun

ms.service: cognitive-services
ms.component: qna-maker
ms.topic: quickstart
ms.date: 10/02/2018
ms.author: diberry
---

# Quickstart: Update a Qna Maker knowledge base in Node.js

This quickstart walks you through programmatically updating an existing QnA maker knowledge base (KB).  This JSON allows you to update a KB by adding new data sources, changing data sources, or deleting data sources.

This API is equivalent to editing, then using the **Save and train** button in the QnA Maker portal.

This quickstart calls Qna Maker APIs:
* [Update](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da7600) - The model for the knowledge base is defined in the JSON sent in the body of the API request. 
* [Get Operation Details](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/operations_getoperationdetails)

[!INCLUDE [Code is available in Azure-Samples Github repo](../../../../includes/cognitive-services-qnamaker-nodejs-repo-note.md)]

## Prerequisites

* [Node.js 6+](https://nodejs.org/en/download/)
* You must have a [Qna Maker service](../How-To/set-up-qnamaker-service-azure.md). To retrieve your key, select **Keys** under **Resource Management** in your dashboard. 
* Qna Maker knowledge base (KB) ID found in the URL in the kbid query string parameter as shown below.

    ![QnA Maker knowledge base ID](../media/qnamaker-quickstart-kb/qna-maker-id.png)

If you don't have a knowledge base yet, you can create a sample one to use for this quickstart: [Create a new knowledge base](create-new-kb-nodejs.md).

## Create a knowledge base Node.js file

Create a file named `update-knowledge-base.js`.

## Add the required dependencies

```nodejs
'use strict';

let fs = require ('fs');
let https = require ('https');
```

## Add required constants

```nodejs
// Represents the various elements used to create HTTP request URIs
// for QnA Maker operations.
let host = 'westus.api.cognitive.microsoft.com';
let service = '/qnamaker/v4.0';
let method = '/knowledgebases/';

// Build your path URL.
let path = service + method + kb;

// Replace this with a valid subscription key.
let subscriptionKey = '<your-qna-maker-subscription-key>';
```

## Add knowledge base ID

After the previous constants, add the knowledge base ID:

```nodejs
// Replace this with a valid knowledge base ID.
let kb = 'ADD ID HERE';
```

## Add the KB update definition

After the constants, add the following KB update definition. The update definition has three sections:

* add
* update
* delete

Each section can be used in the same single request to the API. 

```nodejs
// Dictionary that holds the knowledge base. Modify knowledge base here.
let update_definition = {
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
    'urls': []
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
```

## Add supporting functions

Next, add the following supporting functions.

1. Add the following function to print out JSON in a readable format:

    ```nodejs
    // Formats and indents JSON for display.
    let pretty_print = function(s) {
        return JSON.stringify(JSON.parse(s), null, 4);
    }
    ```

2. Add the following functions to manage the HTTP response to get the creation operation status:

    ```nodejs
    // Call 'callback' after we have the entire response.
    let response_handler = function (callback, response) {
        let body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
        // Calls 'callback' with the status code, headers, and body of the response.
        callback ({ status : response.statusCode, headers : response.headers, body : body });
        });
        response.on('error', function(e) {
            console.log ('Error: ' + e.message);
        });
    };

    // HTTP response handler calls 'callback' after we have the entire response.
    let get_response_handler = function(callback) {
        // Return a function that takes an HTTP response and is closed over the specified callback.
        // This function signature is required by https.request, hence the need for the closure.
        return function(response) {
            response_handler(callback, response);
        }
    }
    ```

3. 
    ```

// Calls 'callback' after we have the entire GET request response.
let get = function(path, callback) {
    let request_params = {
        method : 'GET',
        hostname : host,
        path : path,
        headers : {
            'Ocp-Apim-Subscription-Key' : subscriptionKey,
        }
    };

    // Pass the callback function to the response handler.
    let req = https.request(request_params, get_response_handler(callback));
    req.end ();
}
```

## Add PATCH request to update KB

Add the following functions to make an HTTP PATCH request to update the knowledge base. The `Ocp-Apim-Subscription-Key` is the Qna Maker service key, used for authentication.

    ```nodejs
    // Calls 'callback' after we have the entire PATCH request response.
    let patch = function(path, content, callback) {
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
        let req = https.request(request_params, get_response_handler(callback));
        req.write(content);
        req.end ();
    }

    // Calls 'callback' after we have the response from the /knowledgebases PATCH method.
    let update_kb = function(path, req, callback) {
        console.log('Calling ' + host + path + '.');
        // Send the PATCH request.
        patch(path, req, function (response) {
            // Extract the data we want from the PATCH response and pass it to the callback function.
            callback({ operation : response.headers.location, response : response.body });
        });
    }
    ```

    This API call returns a JSON response that includes the operation ID. The operation ID is necessary to request status if the operation is not complete. 
    
    ```JSON
    {
      "operationState": "NotStarted",
      "createdTimestamp": "2018-10-02T01:23:00Z",
      "lastActionTimestamp": "2018-10-02T01:23:00Z",
      "userId": "335c3841df0b42cdb00f53a49d51a89c",
      "operationId": "e7be3897-88ff-44e5-a06c-01df0e05b78c"
    }
    ```

## Add GET request to determine operation status

The operation status may need to be requested again. 

```nodejs
// Calls 'callback' after we have the response from the GET request to check the status.
let check_status = function(path, callback) {
    console.log('Calling ' + host + path + '.');
    // Send the GET request.
    get(path, function (response) {
        // Extract the data we want from the GET response and pass it to the callback function.
        callback({ wait : response.headers['retry-after'], response : response.body });
    });
}
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

## Add update_kb method

The following method updates the KB and repeats checks on the status. Because the KB creation may take some time, you need to repeat calls to check the status until the status is either successful or fails.

```nodejs

// Convert the update_definition to a string.
let content = JSON.stringify(update_definition);

// Sends the request to update the knowledge base.
update_kb(path, content, function (result) {

    console.log(pretty_print(result.response));

    // Loop until the operation is complete.
    let loop = function() {

        // add operation ID to the path        
        path = service + result.operation;

        // Check the status of the operation.
        check_status(path, function(status) {

            // Write out the status.
            console.log(pretty_print(status.response));

            // Convert the status into an object and get the value of the operationState field.
            var state = (JSON.parse(status.response)).operationState;

            // If the operation isn't complete, wait and query again.
            if (state == 'Running' || state == 'NotStarted') {

                console.log('Waiting ' + status.wait + ' seconds...');
                setTimeout(loop, status.wait * 1000);
            }
        });
    }
    // Begin the loop.
    loop();
});
```

## Run the program

Enter the following command at a command-line to run the program. It will send the request to the Qna Maker API to update the KB, then it will poll for the results every 30 seconds. Each response is printed to the console window.

```bash
npm start
```

Once your knowledge base is updated, you can view it in your QnA Maker Portal, [My knowledge bases](https://www.qnamaker.ai/Home/MyServices) page. 

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)