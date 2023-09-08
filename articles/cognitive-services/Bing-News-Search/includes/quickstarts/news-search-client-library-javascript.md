---
title: Bing News Search JavaScript client library quickstart 
titleSuffix: Azure AI services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 03/12/2020
ms.author: aahi
ms.custom: devx-track-js
---

Use this quickstart to begin searching for news with the Bing News Search client library for JavaScript. While Bing News Search has a REST API compatible with most programming languages, the client library provides an easy way to integrate the service into your applications. The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-node-sdk-samples/blob/master/Samples/newsSearch.js).

## Prerequisites

* The latest version of [Node.js](https://nodejs.org/en/download/).
* The [Bing News Search SDK for JavaScript](https://www.npmjs.com/package/@azure/cognitiveservices-newssearch)
     *  To install, run `npm install @azure/cognitiveservices-newssearch`
* The `CognitiveServicesCredentials` class from `@azure/ms-rest-azure-js` package to authenticate the client.
     * To install, run `npm install @azure/ms-rest-azure-js`

[!INCLUDE [cognitive-services-bing-news-search-signup-requirements](~/includes/cognitive-services-bing-news-search-signup-requirements.md)]

## Create and initialize the application

1. Create an instance of the `CognitiveServicesCredentials`. Create variables for your subscription key, and a search term.

    ```javascript
    const CognitiveServicesCredentials = require('@azure/ms-rest-azure-js').CognitiveServicesCredentials;
    let credentials = new CognitiveServicesCredentials('YOUR-ACCESS-KEY');
    let search_term = 'Winter Olympics'
    ```

2. instantiate the client:
    
    ```javascript
    const NewsSearchAPIClient = require('@azure/cognitiveservices-newssearch');
    let client = new NewsSearchAPIClient(credentials);
    ```

## Send a search query

1. Use the client to search with a query term, in this case "Winter Olympics":
    
    ```javascript
    client.newsOperations.search(search_term).then((result) => {
        console.log(result.value);
    }).catch((err) => {
        throw err;
    });
    ```

The code prints `result.value` items to the console without parsing any text. The results, if any per category, will include:

- `_type: 'NewsArticle'`
- `_type: 'WebPage'`
- `_type: 'VideoObject'`
- `_type: 'ImageObject'`

## Next steps

> [!div class="nextstepaction"]
> [Create a single-page web app](../../tutorial-bing-news-search-single-page-app.md)
