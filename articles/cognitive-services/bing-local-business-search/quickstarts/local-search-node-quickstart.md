---
title: Quickstart - Send a query to the API using Node.js - Bing Local Business Search
titleSuffix: Azure Cognitive Services
description: Use this quickstart to begin sending requests to the Bing Local Business Search API, which is an Azure Cognitive Service.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-local-business
ms.topic: quickstart
ms.date: 05/12/2020
ms.author: aahi
---

# Quickstart: Send a query to the Bing Local Business Search API using Node.js

Use this quickstart to learn how to send requests to the Bing Local Business Search API, which is an Azure Cognitive Service. Although this simple application is written in Node.js, the API is a RESTful Web service compatible with any programming language capable of making HTTP requests and parsing JSON.

This example application gets local response data from the API for a search query.

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The latest version of [Node.js](https://nodejs.org/en/download/).
* The [JavaScript Request Library](https://github.com/request/request).
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesBingSearch-v7"  title="Create a Bing Search resource"  target="_blank">create a Bing Search resource <span class="docon docon-navigate-external x-hidden-focus"></span></a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.


## Code scenario

The following code defines and sends the request, which is implemented in the following steps:

1. Declare variables to specify the endpoint by host and path.
2. Specify the query, and add the query parameter.
3. Create a handler function for the response.
4. Define the Search function that creates the request and adds the `Ocp-Apim-Subscription-Key` header.
5. Run the search function.


```javascript
'use strict';

let https = require('https');

// Replace the subscriptionKey string value with your valid subscription key.
let subscriptionKey = 'your-access-key';

let host = 'api.cognitive.microsoft.com/bing';
let path = '/v7.0/localbusinesses/search';

let mkt = 'en-US';
let q = 'hotel in Bellevue';

let params = '?q=' + encodeURI(q) + "&mkt=" + mkt;

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

* [Local Business Search C# quickstart](local-quickstart.md)
* [Local Business Search Java quickstart](local-search-java-quickstart.md)
* [Local Business Search Python quickstart](local-search-python-quickstart.md)
