---
title: Bing News Search SDK
titleSuffix: Azure Cognitive Services
description: Bing News Search SDK for applications that search the web.
services: cognitive-services
author: mikedodaro
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-news-search
ms.topic: conceptual
ms.date: 1/24/2018
ms.author: v-gedod
---
# Bing Search SDK
The Bing News Search API samples include scenarios that:
1. Query news for search terms with `market` and `count` parameters, verify number of results, and print out `totalEstimatedMatches`, name, URL, description, published time, and name of provider of the first news result.
2. Query most recent news for search terms with `freshness` and `sortBy` parameters, verify number of results, and print out `totalEstimatedMatches`, URL, description, published time and name of provider of the first news result.
3. Query category news for `movie` and `TV entertainment` with safe search, verify number of results, and print out category, name, URL, description, published time and name of provider of the first news result.
4. Query news trending topics in Bing, verify number of results and print out name, text of query, `webSearchUrl`, `newsSearchUrl` and image URL of the first news result.

The Bing Search SDKs make web search functionality readily accessible in the following programming languages:
* Get started with [.NET samples](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/BingSearchv7)
    * [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Search.NewsSearch/1.2.0)
    * See also [.NET libraries](https://github.com/Azure/azure-sdk-for-net/tree/psSdkJson6/src/SDKs/CognitiveServices/dataPlane/Search/BingNewsSearch) for definitions and dependencies.
* Get started with [Node.js samples](https://github.com/Azure-Samples/cognitive-services-node-sdk-samples) 
    * See also [Node.js libraries](https://github.com/Azure/azure-sdk-for-node/tree/master/lib/services/newsSearch) for definitions and dependencies.
* Get started with [Java samples](https://github.com/Azure-Samples/cognitive-services-java-sdk-samples) 
    * See also [Java libraries](https://github.com/Azure-Samples/cognitive-services-java-sdk-samples/tree/master/Search/BingNewsSearch) for definitions and dependencies.
* Get started with [Python samples](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples) 
    * See also [Python libraries](https://github.com/Azure/azure-sdk-for-python/tree/master/azure-cognitiveservices-search-newssearch) for definitions and dependencies.

SDK samples for each language include a ReadMe file with details about prerequisites and installing/running the samples.