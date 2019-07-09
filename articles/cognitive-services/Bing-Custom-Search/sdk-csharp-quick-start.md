---
title: "Quickstart: Call your Bing Custom Search endpoint using the C# SDK | Microsoft Docs"
titleSuffix: Azure Cognitive Services
description: Use the Bing Custom Search SDK for C# to search your custom search instance.
services: cognitive-services
author: swhite-msft
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-custom-search
ms.topic: quickstart
ms.date: 06/18/2019
ms.author: scottwhi
---

# Quickstart: Call your Bing Custom Search endpoint using the C# SDK 

Use this quickstart to begin requesting search results from your Bing Custom Search instance, using the C# SDK. While Bing Custom Search has a REST API compatible with most programming languages, the Bing Custom Search SDK provides an easy way to integrate the service into your applications. The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/BingSearchv7/BingCustomWebSearch).

## Prerequisites

- A Bing Custom Search instance. See [Quickstart: Create your first Bing Custom Search instance](quick-start.md) for more information.
- Microsoft [.NET Core](https://www.microsoft.com/net/download/core)
- Any edition of [Visual Studio 2017 or later](https://www.visualstudio.com/downloads/)
- If you are using Linux/MacOS, this application can be run using [Mono](https://www.mono-project.com/).
- The [Bing Custom Search](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Search.CustomSearch/1.2.0)  NuGet package. 
    - From **Solution Explorer** in Visual Studio, right-click your project and select **Manage NuGet Packages** from the menu. Install the `Microsoft.Azure.CognitiveServices.Search.CustomSearch` package. Installing the NuGet Custom Search package also installs the following assemblies:
        - Microsoft.Rest.ClientRuntime
        - Microsoft.Rest.ClientRuntime.Azure
        - Newtonsoft.Json

[!INCLUDE [cognitive-services-bing-news-search-prerequisites](../../../includes/cognitive-services-bing-custom-search-signup-requirements.md)]


## Create and initialize the application

1. Create a new C# console application in Visual Studio. Then add the following packages to your project.

    ```csharp
    using System;
    using System.Linq;
    using Microsoft.Azure.CognitiveServices.Search.CustomSearch;
    ```

2. In the main method of your application, instantiate the search client with your API key.

    ```csharp
    var client = new CustomSearchAPI(new ApiKeyServiceClientCredentials("YOUR-SUBSCRIPTION-KEY"));
    ```

## Send the search request and receive a response
    
1. Send a search query using your client's `SearchAsync()` method, and save the response. Be sure to replace your `YOUR-CUSTOM-CONFIG-ID` with your instance's configuration ID (you can find the ID in the [Bing Custom Search portal](https://www.customsearch.ai/)). This example searches for "Xbox".

    ```csharp
    // This will look up a single query (Xbox).
    var webData = client.CustomInstance.SearchAsync(query: "Xbox", customConfig: Int32.Parse("YOUR-CUSTOM-CONFIG-ID")).Result;
    ```

2. The `SearchAsync()` method returns a `WebData` object. Use the object to iterate through any `WebPages` that were found. This code finds the first webpage result and prints the webpage's `Name` and `URL`.

    ```csharp
    if (webData?.WebPages?.Value?.Count > 0)
    {
        // find the first web page
        var firstWebPagesResult = webData.WebPages.Value.FirstOrDefault();

        if (firstWebPagesResult != null)
        {
            Console.WriteLine("Number of webpage results {0}", webData.WebPages.Value.Count);
            Console.WriteLine("First web page name: {0} ", firstWebPagesResult.Name);
            Console.WriteLine("First web page URL: {0} ", firstWebPagesResult.Url);
        }
        else
        {
            Console.WriteLine("Couldn't find web results!");
        }
    }
    else
    {
        Console.WriteLine("Didn't see any Web data..");
    }
    ```csharp

## Next steps

> [!div class="nextstepaction"]
> [Build a Custom Search web app](./tutorials/custom-search-web-page.md)
