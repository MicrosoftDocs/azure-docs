---
title: Bing Video Search JavaScript client library quickstart 
titleSuffix: Azure AI services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 03/19/2020
ms.author: aahi
ms.custom: devx-track-js
---

Use this quickstart to begin searching for news with the Bing Video Search client library for JavaScript. While Bing Video Search has a REST API compatible with most programming languages, the client library provides an easy way to integrate the service into your applications. The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-node-sdk-samples/blob/master/Samples/videoSearch.js). It contains more annotations and features.

## Prerequisites

* The latest version of [Node.js](https://nodejs.org/en/download/).
* The [Bing Video Search SDK for JavaScript](https://www.npmjs.com/package/@azure/cognitiveservices-videosearch)
     *  To install, run `npm install @azure/cognitiveservices-videosearch`
* The `CognitiveServicesCredentials` class from `@azure/ms-rest-azure-js` package to authenticate the client.
     * To install, run `npm install @azure/ms-rest-azure-js`

[!INCLUDE [cognitive-services-bing-video-search-signup-requirements](~/includes/cognitive-services-bing-video-search-signup-requirements.md)]

## Create and initialize the application

1. Create a new JavaScript file in your favorite IDE or editor, and add a `require()` statement for the Bing Video Search client library, and `CognitiveServicesCredentials` module. Create a variable for your subscription key. 
    
    ```javascript
    const CognitiveServicesCredentials = require('@azure/ms-rest-azure-js').CognitiveServicesCredentials;
    const VideoSearchAPIClient = require('@azure/cognitiveservices-videosearch');
    ```

2. Create an instance of `CognitiveServicesCredentials` with your key. Then use it to create an instance of the video search client.

    ```javascript
    let credentials = new CognitiveServicesCredentials('YOUR-ACCESS-KEY');
    let client = new VideoSearchAPIClient(credentials);
    ```

## Send the search request

1. Use `client.videosOperations.search()` to send a search request to the Bing Video Search API. When the search results are returned, use `.then()` to log the result.
    
    ```javascript
    client.videosOperations.search('Interstellar Trailer').then((result) => {
        console.log(result.value);
    }).catch((err) => {
        throw err;
    });
    ```

## Next steps

> [!div class="nextstepaction"]
> [Create a single page web app](../../tutorial-bing-video-search-single-page-app.md)

## See also 

* [What is the Bing Video Search API?](../../overview.md)
* [Azure AI services .NET SDK samples](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/BingSearchv7)
