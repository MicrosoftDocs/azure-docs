---
title: Node quickstart for Microsoft Cognitive Services, Project Answer Search | Microsoft Docs
description: Get started using Project Answer Search, Microsoft Cognitive Services on Azure.
services: cognitive-services
author: mikedodaro
ms.service: cognitive-services
ms.technology: project-answer-search
ms.topic: article
ms.date: 04/13/2018
ms.author: rosh, v-gedod
---
# Project Answer Search Node quickstart

The following Node example creates a query for information about Yosemite National Park.

## Prerequisites

Get an access key for the free trial [Cognitive Services Labs](https://aka.ms/answersearchsubscription)

This example uses Node v8.9.4

## Code scenario 

The following code gets answers.
It is implemented in the following steps:
1. Declare variables to specify the endpoint by host and path.
2. Specify the query URL to preview, and add the query parameter.  
3. Create a handler function for the response.
4. Define the Search function that creates the request and adds the *Ocp-Apim-Subscription-Key* header.
5. Run the Search function. 

The complete code for this demo follows:

````
'use strict';

let https = require('https');

// Replace the subscriptionKey string value with your valid subscription key.
let subscriptionKey = 'YOUR-SUBSCRIPTION-KEY'; 

let host = 'api.labs.cognitive.microsoft.com';
let path = '/answerSearch/v7.0/search';

let mkt = 'en-us';
let q = 'Yosemite National Park';

let params = '?q=' + encodeURI(q) + '&mkt=en-us';

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

````

## Next steps
- [C# example code](c-sharp-quickstart.md)
- [Java quickstart](java-quickstart.md)
- [Python quickstart](python-quickstart.md)