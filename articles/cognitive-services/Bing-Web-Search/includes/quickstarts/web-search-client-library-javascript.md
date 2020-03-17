---
title: Bing Web Search JavaScript client library quickstart 
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 03/05/2020
ms.author: aahi
---

The Bing Web Search client library makes it easy to integrate Bing Web Search into your Node.js application. In this quickstart, you'll learn how to instantiate a client, send a request, and print the response.

Want to see the code right now? Samples for the [Bing Search client libraries for JavaScript](https://github.com/Azure-Samples/cognitive-services-node-sdk-samples/tree/master/Samples) are available on GitHub.

## Prerequisites
Here are a few things that you'll need before running this quickstart:

* [Node.js 6](https://nodejs.org/en/download/) or later
* A subscription key  

[!INCLUDE [bing-web-search-quickstart-signup](~/includes/bing-web-search-quickstart-signup.md)]


## Set up your development environment

Let's start by setting up the development environment for our Node.js project.

1. Create a new directory for your project:

    ```console
    mkdir YOUR_PROJECT
    ```

1. Create a new package file:

    ```console
    cd YOUR_PROJECT
    npm init
    ```

1. Now, let's install some azure modules and add them to the `package.json`:

    ```console
    npm install --save azure-cognitiveservices-websearch
    npm install --save ms-rest-azure
    ```

## Create a project and declare required modules

In the same directory as your `package.json`, create a new Node.js project using your favorite IDE or editor. For example: `sample.js`.

Next, copy this code into your project. It loads the modules installed in the previous section.

```javascript
const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
const WebSearchAPIClient = require('azure-cognitiveservices-websearch');
```

## Instantiate the client

This code instantiates a client and using the `azure-cognitiveservices-websearch` module. Make sure that you enter a valid subscription key for your Azure account before continuing.

```javascript
let credentials = new CognitiveServicesCredentials('YOUR-ACCESS-KEY');
let webSearchApiClient = new WebSearchAPIClient(credentials);
```

## Make a request and print the results

Use the client to send a search query to Bing Web Search. If the response includes results for any of the items in the `properties` array, the `result.value` is printed to console.

```javascript
webSearchApiClient.web.search('seahawks').then((result) => {
    let properties = ["images", "webPages", "news", "videos"];
    for (let i = 0; i < properties.length; i++) {
        if (result[properties[i]]) {
            console.log(result[properties[i]].value);
        } else {
            console.log(`No ${properties[i]} data`);
        }
    }
}).catch((err) => {
    throw err;
})
```

## Run the program

The final step is to run your program!

## Clean up resources

When you're done with this project, make sure to remove your subscription key from the program's code.

## Next steps

> [!div class="nextstepaction"]
> [Cognitive Services Node.js SDK samples](https://github.com/Azure-Samples/cognitive-services-node-sdk-samples)

## See also

* [Azure Node SDK reference](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-websearch/)
