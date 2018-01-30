---
title: Web search SDK quickstart | Microsoft Docs
description: Setup for Web search SDK console application.
services: cognitive-services
author: mikedodaro
manager: rosh
ms.service: cognitive-services
ms.technology: bing-web-search
ms.topic: article
ms.date: 01/29/2018
ms.author: v-gedod
---

#Entity Search SDK quickstart

The Bing Web Search SDK contains the functionality of the REST API for web requests and parsing results. 

##Application dependencies

To set up a console application using the Bing Web Search SDK, browse to the `Manage NuGet Packages` option from the Solution Explorer in Visual Studio.  Add the `Microsoft.Azure.CognitiveServices.Search.EntitySearch` package.

[NuGet Entity Search package](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Search.EntitySearch/1.1.0-preview)

##Entity Search client
To create an instance of the `EntitySearchAPI` client, add using directives:
```
using Microsoft.Azure.CognitiveServices.Search.EntitySearch;
using Microsoft.Azure.CognitiveServices.Search.EntitySearch.Models;

```
Then, instantiate the client:
```
var client = new WebSearchAPI(new ApiKeyServiceClientCredentials("YOUR-ACCESS-KEY"));


```
Use the client to search with a query text:
```
var entityData = client.Entities.Search(query: "Tom Cruise");

```