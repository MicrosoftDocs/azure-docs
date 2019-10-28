---
title: "Quickstart: Search for videos using the Bing Video Search SDK for C#"
titleSuffix: Azure Cognitive Services
description: Use this quickstart to send video search requests using the Bing Video Search SDK for C#.
services: cognitive-services
author: aahill
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-video-search
ms.topic: quickstart
ms.date: 06/26/2019
ms.author: aahi
---

# Quickstart: Perform a video search with the Bing Video Search SDK for C#

Use this quickstart to begin searching for news with the Bing Video Search SDK for C#. While Bing Video Search has a REST API compatible with most programming languages, the SDK provides an easy way to integrate the service into your applications. The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/BingSearchv7/BingVideoSearch) with additional annotations, and features.

## Prerequisites

* Any edition of [Visual Studio 2017 or later](https://visualstudio.microsoft.com/downloads/).
* The Json.NET framework, available [as a NuGet package](https://www.nuget.org/packages/Newtonsoft.Json/).

To add the Bing Video Search SDK to your project, select **Manage NuGet Packages** from **Solution Explorer** in Visual Studio. Add the `Microsoft.Azure.CognitiveServices.Search.VideoSearch` package.

Installing the [[NuGet Video Search SDK package]](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Search.VideoSearch/1.2.0) also installs the following dependencies:

* Microsoft.Rest.ClientRuntime
* Microsoft.Rest.ClientRuntime.Azure
* Newtonsoft.Json

[!INCLUDE [cognitive-services-bing-video-search-signup-requirements](../../../../includes/cognitive-services-bing-video-search-signup-requirements.md)]


## Create and initialize a project

1. Create a new C# console solution in Visual Studio. Then add the following into the main code file.

    ```csharp
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Microsoft.Azure.CognitiveServices.Search.VideoSearch;
    using Microsoft.Azure.CognitiveServices.Search.VideoSearch.Models;
    ```

2. Instantiate the client by creating a new `ApiKeyServiceClientCredentials` object with your subscription key, and calling the constructor.

    ```csharp
    var client = new VideoSearchAPI(new ApiKeyServiceClientCredentials("YOUR-ACCESS-KEY"));
    ```

## Send a search request and process the results

1. Use the client to send a search request. Use "SwiftKey" for the search query.

    ```csharp
    var videoResults = client.Videos.SearchAsync(query: "SwiftKey").Result;
    ```

2. If any results were returned, get the first one with `videoResults.Value[0]`. Then print the video's ID, title, and url.

    ```csharp
    if (videoResults.Value.Count > 0)
    {
        var firstVideoResult = videoResults.Value[0];

        Console.WriteLine($"\r\nVideo result count: {videoResults.Value.Count}");
        Console.WriteLine($"First video id: {firstVideoResult.VideoId}");
        Console.WriteLine($"First video name: {firstVideoResult.Name}");
        Console.WriteLine($"First video url: {firstVideoResult.ContentUrl}");
    }
    else
    {
        Console.WriteLine("Couldn't find video results!");
    }
    ```

## Next steps

> [!div class="nextstepaction"]
> [Create a single page web app](../tutorial-bing-video-search-single-page-app.md)

## See also 

* [What is the Bing Video Search API?](../overview.md)
* [Cognitive services .NET SDK samples](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/BingSearchv7)
