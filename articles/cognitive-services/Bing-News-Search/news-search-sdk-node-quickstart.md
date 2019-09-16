---
title: "Quickstart: Perform a news search using the Bing News Search SDK for Node.js"
titleSuffix: Azure Cognitive Services
description: Use this quickstart to search for news using the Bing News Search SDK for Node.js, and process the response.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-news-search
ms.topic: quickstart
ms.date: 06/18/2019
ms.author: aahi
ms.custom: seodec2018
---

# Quickstart: Perform a news search with the Bing News Search SDK for Node.js

Use this quickstart to begin searching for news with the Bing News Search SDK for Node.js. While Bing News Search has a REST API compatible with most programming languages, the SDK provides an easy way to integrate the service into your applications. The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-node-sdk-samples/blob/master/Samples/newsSearch.js).

## Prerequisites

* [Node.js](https://nodejs.org/en/)

To set up a console application using the Bing News Search SDK:
1. Run `npm install ms-rest-azure` in your development environment.
2. Run `npm install azure-cognitiveservices-newssearch` in your development environment.


[!INCLUDE [cognitive-services-bing-news-search-signup-requirements](../../../includes/cognitive-services-bing-news-search-signup-requirements.md)]

## Create and initialize the application

1. Create an instance of the `CognitiveServicesCredentials`. Create variables for your subscription key, and a search term.

    ```javascript
    const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
    let credentials = new CognitiveServicesCredentials('YOUR-ACCESS-KEY');
    let search_term = 'Winter Olympics'
    ```

2. instantiate the client:
    
    ```javascript
    const NewsSearchAPIClient = require('azure-cognitiveservices-newssearch');
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
> [Create a single-page web app](tutorial-bing-news-search-single-page-app.md)
