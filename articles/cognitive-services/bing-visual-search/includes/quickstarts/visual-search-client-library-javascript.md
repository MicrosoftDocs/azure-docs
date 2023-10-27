---
title: Bing Visual Search JavaScript client library quickstart 
titleSuffix: Azure AI services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 03/26/2020
ms.author: aahi
ms.custom: devx-track-js
---

Use this quickstart to begin getting image insights from the Bing Visual Search service, using the JavaScript client library. While Bing Visual Search has a REST API compatible with most programming languages, the client library provides an easy way to integrate the service into your applications. The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-node-sdk-samples/blob/master/Samples/visualSearch.js). 

[Reference documentation](/javascript/api/@azure/cognitiveservices-visualsearch/) | | [Package (NPM)](https://www.npmjs.com/package/@azure/cognitiveservices-visualsearch) | [Samples](https://github.com/Azure-Samples/cognitive-services-node-sdk-samples/)

## Prerequisites

* The latest version of [Node.js](https://nodejs.org/en/download/).
* The [Bing Visual Search SDK for JavaScript](https://www.npmjs.com/package/@azure/cognitiveservices-visualsearch)
     *  To install, run `npm install @azure/cognitiveservices-visualsearch`
* The `CognitiveServicesCredentials` class from `@azure/ms-rest-azure-js` package to authenticate the client.
     * To install, run `npm install @azure/ms-rest-azure-js`

[!INCLUDE [cognitive-services-bing-visual-search-signup-requirements](~/includes/cognitive-services-bing-visual-search-signup-requirements.md)]

<a name="client"></a>

## Create and initialize the application

1. Create a new JavaScript file in your favorite IDE or editor, and add the following requirements. Then create variables for your subscription key, Custom Configuration ID, and file path to the image you want to upload. 

    ```javascript
    const os = require("os");
    const async = require('async');
    const fs = require('fs');
    const Search = require('@azure/cognitiveservices-visualsearch');
    const CognitiveServicesCredentials = require('@azure/ms-rest-azure-js').CognitiveServicesCredentials;
    
    let keyVar = 'YOUR-VISUAL-SEARCH-ACCESS-KEY';
    let credentials = new CognitiveServicesCredentials(keyVar);
    let filePath = "../Data/image.jpg";
    ```

2. Instantiate the client.

    ```javascript
    let visualSearchClient = new Search.VisualSearchClient(credentials);
    ```

## Search for images

1. Use `fs.createReadStream()` to read in your image file, and create variables for your search request and results. Then use the client to search images.

    ```javascript
    let fileStream = fs.createReadStream(filePath);
    let visualSearchRequest = JSON.stringify({});
    let visualSearchResults;
    try {
        visualSearchResults = await visualSearchClient.images.visualSearch({
            image: fileStream,
            knowledgeRequest: visualSearchRequest
        });
        console.log("Search visual search request with binary of image");
    } catch (err) {
        console.log("Encountered exception. " + err.message);
    }
    ```

2. Parse the results of the previous query:

    ```javascript
    // Visual Search results
    if (visualSearchResults.image.imageInsightsToken) {
        console.log(`Uploaded image insights token: ${visualSearchResults.image.imageInsightsToken}`);
    }
    else {
        console.log("Couldn't find image insights token!");
    }
    
    // List of tags
    if (visualSearchResults.tags.length > 0) {
        let firstTagResult = visualSearchResults.tags[0];
        console.log(`Visual search tag count: ${visualSearchResults.tags.length}`);
    
        // List of actions in first tag
        if (firstTagResult.actions.length > 0) {
            let firstActionResult = firstTagResult.actions[0];
            console.log(`First tag action count: ${firstTagResult.actions.length}`);
            console.log(`First tag action type: ${firstActionResult.actionType}`);
        }
        else {
            console.log("Couldn't find tag actions!");
        }
    
    }
    else {
        console.log("Couldn't find image tags!");
    }
    
    ```

## Next steps

> [!div class="nextstepaction"]
> [Build a single-page web app](../../tutorial-bing-visual-search-single-page-app.md)
