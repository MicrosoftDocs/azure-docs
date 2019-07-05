---
title: "Quickstart: Project URL Preview, Node.js"
titlesuffix: Azure Cognitive Services
description: Get started using the URL Preview in Microsoft Cognitive Services on Azure.
services: cognitive-services
author: mikedodaro
manager: nitinme

ms.service: cognitive-services
ms.subservice: url-preview
ms.topic: quickstart
ms.date: 03/16/2018
ms.author: rosh
---
# Quickstart: URL Preview with Node.js 

The following Node example creates a Url Preview for the SwiftKey Web site: https://swiftkey.com/en.

## Prerequisites

Get an access key for the free trial [Cognitive Services Labs](https://aka.ms/answersearchsubscription)

## Code scenario 

The following code gets URL Preview data.
It is implemented in the following steps:
1. Declare variables to specify the endpoint by host and path.
2. Specify the query URL to preview, and add the query parameter.  
3. Create a handler function for the response.
4. Define the Search function that creates the request and adds the *Ocp-Apim-Subscription-Key* header.
5. Run the Search function. 

The complete code for this demo follows:

```
'use strict';

let https = require('https');

// Replace the subscriptionKey string value with your valid subscription key.
let subscriptionKey = 'YOUR-ACCESS-KEY'; 
let host = 'api.labs.cognitive.microsoft.com';
let path = '/urlpreview/v7.0/search';

let mkt = 'en-US';
let q = 'https://swiftkey.com/';

let params = '?q=' + encodeURI(q);

let response_handler = function (response) {
    let body = '';
    response.on('data', function (d) {
        body += d;
    });
    response.on('end', function () {
        let body_ = JSON.parse(body);
        let body__ = JSON.stringify(body_, null, '  ');
        console.log(body__);
    });
    response.on('error', function (e) {
        console.log('Error: ' + e.message);
    });
};

let Search = function () {
    let request_params = {
        method: 'GET',
        hostname: host,
        path: path + params,
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey,
        }
    };

    let req = https.request(request_params, response_handler);
    req.end();
}

Search();

```

## Next steps
- [C# example code](csharp.md)
- [Java quickstart](java-quickstart.md)
- [JavaScript quickstart](javascript.md)
- [Python quickstart](python-quickstart.md)
