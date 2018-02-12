---
title: Web search SDK Node quickstart | Microsoft Docs
description: Setup for Web search SDK console application.
titleSuffix: Azure cognitive services Web search SDK Node quickstart
services: cognitive-services
author: mikedodaro
manager: rosh
ms.service: cognitive-services
ms.technology: bing-web-search
ms.topic: article
ms.date: 02/12/2018
ms.author: v-gedod
---

#News Search SDK Node quickstart

The Bing Web Search SDK contains the functionality of the REST API for web queries and parsing results. 

##Application dependencies

To set up a console application using the Bing Web Search SDK, run `npm install azure-cognitiveservices-websearch` in your development environment.

##News Search client
Get a [Cognitive Services access key](https://azure.microsoft.com/en-us/try/cognitive-services/) under *Search*. Create an instance of the `CognitiveServicesCredentials`:
```
const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
let credentials = new CognitiveServicesCredentials('YOUR-ACCESS-KEY');
```
Then, instantiate the client, and search for results:
```
const WebSearchAPIClient = require('azure-cognitiveservices-websearch');
let webSearchApiClient = new WebSearchAPIClient(credentials);

webSearchAPIClient.web.search('seahawks').then((result) => {
 console.log(result.queryContext);
 console.log(result.images.value);
 console.log(result.webPages.value);
 console.log(result.news.value);
}).catch((err) => {
 throw err;
})

```
The code prints `result.value` items to the console without parsing any text.

![Video results](media/video-search-sdk-quickstart-node-results.png)

##Next steps

[Cognitive services Node.js SDK samples](https://github.com/Azure-Samples/cognitive-services-node-sdk-samples)