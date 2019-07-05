---
title: "Quickstart: Send a search request with the Bing Entity Search SDK for Node.js"
titleSuffix: Azure Cognitive Services
description: Use this quickstart to search for entities with the Bing Entity Search SDK for Node.js
services: cognitive-services
author: aahill
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-entity-search
ms.topic: quickstart
ms.date: 02/01/2019
ms.author: aahi
---

# Quickstart: Send a search request with the Bing Entity Search SDK for Node.js

Use this quickstart to begin searching for entities with the Bing Entity Search SDK for Node.js. While Bing Entity Search has a REST API compatible with most programming languages, the SDK provides an easy way to integrate the service into your applications. The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-node-sdk-samples/blob/master/Samples/entitySearch.js).

## Prerequisites

* The latest version of [Node.js](https://nodejs.org/en/download/).

* The [Bing Entity Search SDK for Node.js](https://www.npmjs.com/package/azure-cognitiveservices-entitysearch)

To install the Bing Entity Search SDK:

1. Run `npm install ms-rest-azure` in your development environment.
2. Run `npm install azure-cognitiveservices-entitysearch` in your development environment.

[!INCLUDE [cognitive-services-bing-news-search-signup-requirements](../../../../includes/cognitive-services-bing-entity-search-signup-requirements.md)]


## Create and initialize the application

1. Create a new JavaScript file in your favorite IDE or editor, and add the following requirements. 
    
    ```javascript
    const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
    const EntitySearchAPIClient = require('azure-cognitiveservices-entitysearch');
    ```

2. Create an instance of `CognitiveServicesCredentials` using your subscription key. Then create an instance of the search client with it.

    ```javascript
    let credentials = new CognitiveServicesCredentials('YOUR-ACCESS-KEY');
    let entitySearchApiClient = new EntitySearchAPIClient(credentials);
    ```

## Send a request and receive a response

1. Send an entities search request with `entitiesOperations.search()`. After receiving a response, print out the `queryContext`, number of returned results, and the description of the first result.
      
    ```javascript
    entitySearchApiClient.entitiesOperations.search('seahawks').then((result) => {
        console.log(result.queryContext);
        console.log(result.entities.value);
        console.log(result.entities.value[0].description);
    }).catch((err) => {
        throw err;
    });
    ```

<!-- Removing until we can replace with a sanitized version.
![Entity results](media/entity-search-sdk-node-quickstart-results.png)
-->

## Next steps

> [!div class="nextstepaction"]
> [Create a single-page web app](../tutorial-bing-entities-search-single-page-app.md)

* [What is the Bing Entity Search API?](../overview.md )