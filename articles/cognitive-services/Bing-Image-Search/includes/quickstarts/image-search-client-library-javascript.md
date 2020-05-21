---
title: Bing Image Search JavaScript client library quickstart 
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 03/04/2020
ms.author: aahi
---

Use this quickstart to make your first image search using the Bing Image Search client library, which is a wrapper for the API and contains the same features. This simple JavaScript application sends an image search query, parses the JSON response, and displays the URL of the first image returned.

The source code for this sample is available on [GitHub](https://github.com/Azure-Samples/cognitive-services-node-sdk-samples/blob/master/Samples/imageSearch.js) with additional error handling and annotations.

## Prerequisites

* The [Cognitive Services Image Search SDK for Node.js](https://www.npmjs.com/package/@azure/cognitiveservices-imagesearch)
    * Install using `npm install @azure/cognitiveservices-imagesearch`
* The [Node.js Azure Rest](https://www.npmjs.com/package/ms-rest-azure) module
    * Install using `npm install ms-rest-azure`

[!INCLUDE [cognitive-services-bing-image-search-signup-requirements](~/includes/cognitive-services-bing-image-search-signup-requirements.md)]

## Create and initialize the application

1. Create a new JavaScript file in your favorite IDE or editor, and set the strictness, https, and other requirements.

    ```javascript
    'use strict';
    const ImageSearchAPIClient = require('@azure/cognitiveservices-imagesearch');
    const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
    ```

2. In the main method of your project, create variables for your valid subscription key, the image results to be returned by Bing, and a search term. Then instantiate the image search client using the key.

    ```javascript
    //replace this value with your valid subscription key.
    let serviceKey = "ENTER YOUR KEY HERE";

    //the search term for the request
    let searchTerm = "canadian rockies";

    //instantiate the image search client
    let credentials = new CognitiveServicesCredentials(serviceKey);
    let imageSearchApiClient = new ImageSearchAPIClient(credentials);

    ```

## Create an asynchronous helper function

1. Create a function to call the client asynchronously, and return the response from the Bing Image Search service.
    ```javascript
    //a helper function to perform an async call to the Bing Image Search API
    const sendQuery = async () => {
        return await imageSearchApiClient.imagesOperations.search(searchTerm);
    };
    ```
   ## Send a query and handle the response

1. Call the helper function and handle its `promise` to parse the image results returned in the response.

    If the response contains search results, store the first result and print out its details, such as a thumbnail URL, the original URL,along with the total number of returned images.
    ```javascript
    sendQuery().then(imageResults => {
        if (imageResults == null) {
        console.log("No image results were found.");
        }
        else {
            console.log(`Total number of images returned: ${imageResults.value.length}`);
            let firstImageResult = imageResults.value[0];
            //display the details for the first image result. After running the application,
            //you can copy the resulting URLs from the console into your browser to view the image.
            console.log(`Total number of images found: ${imageResults.value.length}`);
            console.log(`Copy these URLs to view the first image returned:`);
            console.log(`First image thumbnail url: ${firstImageResult.thumbnailUrl}`);
            console.log(`First image content url: ${firstImageResult.contentUrl}`);
        }
      })
      .catch(err => console.error(err))
    ```

## Next steps

> [!div class="nextstepaction"]
> [Bing Image Search single-page app tutorial](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/tutorial-bing-image-search-single-page-app)

## See also

* [What is Bing Image Search?](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/overview)
* [Try an online interactive demo](https://azure.microsoft.com/services/cognitive-services/bing-image-search-api/)
* [Get a free Cognitive Services access key](https://azure.microsoft.com/try/cognitive-services/?api=bing-image-search-api)
* [Node.js samples for the Azure Cognitive Services SDK](https://github.com/Azure-Samples/cognitive-services-node-sdk-samples)
* [Azure Cognitive Services Documentation](https://docs.microsoft.com/azure/cognitive-services)
* [Bing Image Search API reference](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference)
