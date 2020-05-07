---
title: Bing Video Search JavaScript client library quickstart 
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 03/19/2020
ms.author: aahi
---

Use this quickstart to begin searching for news with the Bing Video Search client library for JavaScript. While Bing Video Search has a REST API compatible with most programming languages, the client library provides an easy way to integrate the service into your applications. The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-node-sdk-samples/blob/master/Samples/videoSearch.js). It contains more annotations and features.

## Prerequisites

- [Node.js](https://www.nodejs.org/)

To set up a console application using the Bing Video Search client library:
* Run `npm install ms-rest-azure` in your development environment.
* Run `npm install azure-cognitiveservices-videosearch` in your development environment.

[!INCLUDE [cognitive-services-bing-video-search-signup-requirements](~/includes/cognitive-services-bing-video-search-signup-requirements.md)]

## Create and initialize the application

1. Create a new JavaScript file in your favorite IDE or editor, and add a `require()` statement for the Bing Video Search client library, and `CognitiveServicesCredentials` module. Create a variable for your subscription key. 
    
    ```javascript
    const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
    const VideoSearchAPIClient = require('azure-cognitiveservices-videosearch');
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
* [Cognitive services .NET SDK samples](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/BingSearchv7)