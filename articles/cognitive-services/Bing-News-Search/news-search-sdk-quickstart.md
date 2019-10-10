---
title: "Quickstart: Perform a news search using the Bing News Search SDK for C#"
titleSuffix: Azure Cognitive Services
description: Use this quickstart to search for news using the Bing News Search SDK for C#, and process the response.
services: cognitive-services
author: aahill
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-news-search
ms.topic: quickstart
ms.date: 06/18/2019
ms.author: aahi
ms.custom: seodec2018
---

# Quickstart: Perform a news search with the Bing News Search SDK for C#

Use this quickstart to begin searching for news with the Bing News Search SDK for C#. While Bing News Search has a REST API compatible with most programming languages, the SDK provides an easy way to integrate the service into your applications. The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/BingSearchv7/BingNewsSearch).

## Prerequisites

* Any edition of [Visual Studio 2017 or later](https://www.visualstudio.com/downloads/).
* The [Json.NET](https://www.newtonsoft.com/json) framework, available as a NuGet package.
* If you are using Linux/MacOS, this application can be run using [Mono](https://www.mono-project.com/).

* The [Bing News Search SDK NuGet package](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Search.NewsSearch/1.2.0). Installing this package also installs the following:
    * Microsoft.Rest.ClientRuntime
    * Microsoft.Rest.ClientRuntime.Azure
    * Newtonsoft.Json

To set up a console application using the Bing News Search SDK, browse to the `Manage NuGet Packages` option from the Solution Explorer in Visual Studio.  Add the `Microsoft.Azure.CognitiveServices.Search.NewsSearch` package.

[!INCLUDE [cognitive-services-bing-news-search-signup-requirements](../../../includes/cognitive-services-bing-news-search-signup-requirements.md)]

See also [Cognitive Services Pricing - Bing Search API](https://azure.microsoft.com/pricing/details/cognitive-services/search-api/).

## Create and initialize a project

1. Create a new C# console solution in Visual Studio. Then add the following into the main code file.
    
    ```csharp
    using System;
    using System.Linq;
    using Microsoft.Azure.CognitiveServices.Search.NewsSearch;
    ```

2. Create a variable for your API key, a search term, and then instantiate the news search client with it.

    ```csharp
    var key = "YOUR-ACCESS-KEY";
    var searchTerm = "Quantum Computing";
    var client = new NewsSearchClient(new ApiKeyServiceClientCredentials(key));
    ```

## Send a request, and parse the result

1. Use the client to send a search request to the Bing News Search service:
    ```csharp
    var newsResults = client.News.SearchAsync(query: searchTerm, market: "en-us", count: 10).Result;
    ```

2. If any results were returned, parse them:

    ```csharp
    if (newsResults.Value.Count > 0)
    {
        var firstNewsResult = newsResults.Value[0];
    
        Console.WriteLine($"TotalEstimatedMatches value: {newsResults.TotalEstimatedMatches}");
        Console.WriteLine($"News result count: {newsResults.Value.Count}");
        Console.WriteLine($"First news name: {firstNewsResult.Name}");
        Console.WriteLine($"First news url: {firstNewsResult.Url}");
        Console.WriteLine($"First news description: {firstNewsResult.Description}");
        Console.WriteLine($"First news published time: {firstNewsResult.DatePublished}");
        Console.WriteLine($"First news provider: {firstNewsResult.Provider[0].Name}");
    }
    
    else
    {
        Console.WriteLine("Couldn't find news results!");
    }
    Console.WriteLine("Enter any key to exit...");
    Console.ReadKey();
    ```

## Next steps

> [!div class="nextstepaction"]
> [Create a single-page web app](tutorial-bing-news-search-single-page-app.md)
