---
title: Bing Entity Search JavaScript client library quickstart 
titleSuffix: Azure AI services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 03/06/2020
ms.author: aahi
ms.custom: devx-track-js
---

Use this quickstart to begin searching for entities with the Bing Entity Search client library for JavaScript. While Bing Entity Search has a REST API compatible with most programming languages, the client library provides an easy way to integrate the service into your applications. The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-node-sdk-samples/blob/master/Samples/entitySearch.js).

## Prerequisites

* The latest version of [Node.js](https://nodejs.org/en/download/).
* The [Bing Entity Search SDK for JavaScript](https://www.npmjs.com/package/@azure/cognitiveservices-entitysearch)
     *  To install, run `npm install @azure/cognitiveservices-entitysearch`
* The `CognitiveServicesCredentials` class from `@azure/ms-rest-azure-js` package to authenticate the client.
     * To install, run `npm install @azure/ms-rest-azure-js`

[!INCLUDE [cognitive-services-bing-news-search-signup-requirements](~/includes/cognitive-services-bing-entity-search-signup-requirements.md)]


## Create and initialize the application

1. Create a new JavaScript file in your favorite IDE or editor, and add the following requirements.

    ```javascript
    const CognitiveServicesCredentials = require('@azure/ms-rest-azure-js').CognitiveServicesCredentials;
    const EntitySearchAPIClient = require('@azure/cognitiveservices-entitysearch');
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
> [Create a single-page web app](../../tutorial-bing-entities-search-single-page-app.md)

* [What is the Bing Entity Search API?](../../overview.md)
