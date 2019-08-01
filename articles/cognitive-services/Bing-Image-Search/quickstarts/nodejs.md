---
title: "Quickstart: Search for images - Bing Image Search REST API and Node.js"
titleSuffix: Azure Cognitive Services
description: Use this quickstart to send image search requests to the Bing Image Search REST API using JavaScript, and receive JSON responses.
services: cognitive-services
documentationcenter: ''
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-image-search
ms.topic: quickstart
ms.date: 02/06/2019
ms.author: aahi
ms.custom: seodec2018
---

# Quickstart: Search for images using the Bing Image Search REST API and Node.js

Use this quickstart to start sending search requests to the Bing Image Search API. This JavaScript application sends a search query to the API, and displays the URL of the first image in the results. While this application is written in Javascript, the API is a RESTful web service compatible with most programming languages.

The source code for this sample is available [on GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/nodejs/Search/BingImageSearchv7Quickstart.js) with additional error handling and annotations.

## Prerequisites

* The latest version of [Node.js](https://nodejs.org/en/download/).

* The [JavaScript Request Library](https://github.com/request/request)  
  [!INCLUDE [cognitive-services-bing-image-search-signup-requirements](../../../../includes/cognitive-services-bing-image-search-signup-requirements.md)]

See also [Cognitive Services Pricing - Bing Search API](https://azure.microsoft.com/pricing/details/cognitive-services/search-api/).

## Create and initialize the application

1. Create a new JavaScript file in your favorite IDE or editor, and set the strictness and https requirements.

    ```javascript
    'use strict';
    let https = require('https');
    ```

2. Create variables for the API endpoint, image API search path, your subscription key, and search term.
    ```javascript
    let subscriptionKey = 'enter key here';
    let host = 'api.cognitive.microsoft.com';
    let path = '/bing/v7.0/images/search';
    let term = 'tropical ocean';
    ```

## Construct the search request and query.

1. Use the variables from the last step to format a search URL for the API request. Your search term must be URL-encoded before being sent to the API.

    ```javascript
    let request_params = {
        method : 'GET',
        hostname : host,
        path : path + '?q=' + encodeURIComponent(search),
        headers : {
        'Ocp-Apim-Subscription-Key' : subscriptionKey,
        }
    };
    ```

2. Use the request library to send your query to the API. `response_handler` will be defined in the next section.
    ```javascript
    let req = https.request(request_params, response_handler);
    req.end();
    ```

## Handle and parse the response

1. define a function named `response_handler` that takes an HTTP call, `response`, as a parameter. Do the following steps within this function:

    1. Define a variable to contain the body of the JSON response.  
        ```javascript
        let response_handler = function (response) {
            let body = '';
        };
        ```

    2. Store the body of the response when the **data** flag is called
        ```javascript
        response.on('data', function (d) {
            body += d;
        });
        ```

    3. When an **end** flag is signaled, get the first result from the JSON response. Print the URL for the first image, along with the total number of returned images.

        ```javascript
        response.on('end', function () {
            let firstImageResult = imageResults.value[0];
            console.log(`Image result count: ${imageResults.value.length}`);
            console.log(`First image thumbnail url: ${firstImageResult.thumbnailUrl}`);
            console.log(`First image web search url: ${firstImageResult.webSearchUrl}`);
         });
        ```

## Example JSON response

Responses from the Bing Image Search API are returned as JSON. This sample response has been truncated to show a single result.

```json
{
"_type":"Images",
"instrumentation":{
    "_type":"ResponseInstrumentation"
},
"readLink":"images\/search?q=tropical ocean",
"webSearchUrl":"https:\/\/www.bing.com\/images\/search?q=tropical ocean&FORM=OIIARP",
"totalEstimatedMatches":842,
"nextOffset":47,
"value":[
    {
        "webSearchUrl":"https:\/\/www.bing.com\/images\/search?view=detailv2&FORM=OIIRPO&q=tropical+ocean&id=8607ACDACB243BDEA7E1EF78127DA931E680E3A5&simid=608027248313960152",
        "name":"My Life in the Ocean | The greatest WordPress.com site in ...",
        "thumbnailUrl":"https:\/\/tse3.mm.bing.net\/th?id=OIP.fmwSKKmKpmZtJiBDps1kLAHaEo&pid=Api",
        "datePublished":"2017-11-03T08:51:00.0000000Z",
        "contentUrl":"https:\/\/mylifeintheocean.files.wordpress.com\/2012\/11\/tropical-ocean-wallpaper-1920x12003.jpg",
        "hostPageUrl":"https:\/\/mylifeintheocean.wordpress.com\/",
        "contentSize":"897388 B",
        "encodingFormat":"jpeg",
        "hostPageDisplayUrl":"https:\/\/mylifeintheocean.wordpress.com",
        "width":1920,
        "height":1200,
        "thumbnail":{
        "width":474,
        "height":296
        },
        "imageInsightsToken":"ccid_fmwSKKmK*mid_8607ACDACB243BDEA7E1EF78127DA931E680E3A5*simid_608027248313960152*thid_OIP.fmwSKKmKpmZtJiBDps1kLAHaEo",
        "insightsMetadata":{
        "recipeSourcesCount":0,
        "bestRepresentativeQuery":{
            "text":"Tropical Beaches Desktop Wallpaper",
            "displayText":"Tropical Beaches Desktop Wallpaper",
            "webSearchUrl":"https:\/\/www.bing.com\/images\/search?q=Tropical+Beaches+Desktop+Wallpaper&id=8607ACDACB243BDEA7E1EF78127DA931E680E3A5&FORM=IDBQDM"
        },
        "pagesIncludingCount":115,
        "availableSizesCount":44
        },
        "imageId":"8607ACDACB243BDEA7E1EF78127DA931E680E3A5",
        "accentColor":"0050B2"
    }]
}
```

## Next steps

> [!div class="nextstepaction"]
> [Create a single-page app](../tutorial-bing-image-search-single-page-app.md)

## See also

* [What is Bing Image Search?](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/overview)  
* [Try an online interactive demo](https://azure.microsoft.com/services/cognitive-services/bing-image-search-api/) 
* [Pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/search-api/) for the Bing Search APIs. 
* [Get a free Cognitive Services access key](https://azure.microsoft.com/try/cognitive-services/?api=bing-image-search-api)  
* [Azure Cognitive Services Documentation](https://docs.microsoft.com/azure/cognitive-services)
* [Bing Image Search API reference](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference)
