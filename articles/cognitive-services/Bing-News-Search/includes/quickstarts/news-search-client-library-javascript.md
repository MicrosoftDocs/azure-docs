---
title: Bing News Search JavaScript client library quickstart 
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 03/12/2020
ms.author: aahi
---

Use this quickstart to begin searching for news with the Bing News Search client library for JavaScript. While Bing News Search has a REST API compatible with most programming languages, the client library provides an easy way to integrate the service into your applications. The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-node-sdk-samples/blob/master/Samples/newsSearch.js).

## Prerequisites

* [Node.js](https://nodejs.org/en/)

To set up a console application using the Bing News Search client library:
1. Run `npm install ms-rest-azure` in your development environment.
2. Run `npm install azure-cognitiveservices-newssearch` in your development environment.


[!INCLUDE [cognitive-services-bing-news-search-signup-requirements](~/includes/cognitive-services-bing-news-search-signup-requirements.md)]

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
> [Create a single-page web app](../../tutorial-bing-news-search-single-page-app.md)
