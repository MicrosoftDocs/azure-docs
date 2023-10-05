---
title: Bing Image Search C# client library quickstart 
titleSuffix: Azure AI services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 01/05/2022
ms.author: aahi
---

Use this quickstart to make your first image search using the Bing Image Search client library. 

The client search library is a wrapper for the REST API and contains the same features. 

You'll create a C# application sends an image search query, parses the JSON response, and displays the URL of the first image returned.

## Prerequisites

* If you're using Windows, any edition of [Visual Studio 2017 or later](https://visualstudio.microsoft.com/vs/whatsnew/)
* If you're using macOS or Linux, [VS Code](https://code.visualstudio.com) with [.NET Core installed](https://dotnet.microsoft.com/learn/dotnet/hello-world-tutorial/install)
* [A free Azure subscription](https://azure.microsoft.com/free/dotnet)

See also [Azure AI services pricing - Bing Search API](https://azure.microsoft.com/pricing/details/cognitive-services/search-api/).

## Create a console project

First, create a new C# console application.

# [Visual Studio](#tab/visualstudio)

1. Create a new console solution named *BingImageSearch* in Visual Studio.
    
1. Add the [Cognitive Image Search NuGet package](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Search.ImageSearch)
    1. Right-click your project in **Solution Explorer**.
    1. Select **Manage NuGet Packages**.
    1. Search for and select *Microsoft.Azure.CognitiveServices.Search.ImageSearch*, and then install the package.
    
# [VS Code](#tab/vscode)

1. Open up the terminal window in VS Code.
1. Create a new console project named *BingImageSearch* by entering the following code in the terminal window:
    
    ```bash
    dotnet new console -n BingImageSearch
    ```
1. Open the *BingImageSearch* folder in VS Code.
1. Add the [Cognitive Image Search NuGet package](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Search.ImageSearch) NuGetPackage by entering the following code in the terminal window:

    ```bash
    dotnet add package Microsoft.Azure.CognitiveServices.Search.ImageSearch
    ```

---

## Initialize the application


1. Replace all of the `using` statements in *Program.cs* with the following code:

    ```csharp
    using System;
    using System.Linq;
    using Microsoft.Azure.CognitiveServices.Search.ImageSearch;
    using Microsoft.Azure.CognitiveServices.Search.ImageSearch.Models;
    ```

1. In the `Main` method of your project, create variables for your valid subscription key, the image results to be returned by Bing, and a search term. Then instantiate the image search client using the key.

    ```csharp
    static async Task Main(string[] args)
    {
        //IMPORTANT: replace this variable with your Cognitive Services subscription key
        string subscriptionKey = "ENTER YOUR KEY HERE";
        //stores the image results returned by Bing
        Images imageResults = null;
        // the image search term to be used in the query
        string searchTerm = "canadian rockies";
        
        //initialize the client
        //NOTE: If you're using version 1.2.0 or below for the Bing Image Search client library, 
        // use ImageSearchAPI() instead of ImageSearchClient() to initialize your search client.
        
        var client = new ImageSearchClient(new ApiKeyServiceClientCredentials(subscriptionKey));
    }
    ```
    
## Send a search query using the client
    
Still in the `Main` method, use the client to search with a query text:
    
```csharp
// make the search request to the Bing Image API, and get the results"
imageResults = await client.Images.SearchAsync(query: searchTerm).Result; //search query
```

## Parse and view the first image result

Parse the image results returned in the response. 

If the response contains search results, store the first result and print out some of its details.

```csharp
if (imageResults != null)
{
    //display the details for the first image result.
    var firstImageResult = imageResults.Value.First();
    Console.WriteLine($"\nTotal number of returned images: {imageResults.Value.Count}\n");
    Console.WriteLine($"Copy the following URLs to view these images on your browser.\n");
    Console.WriteLine($"URL to the first image:\n\n {firstImageResult.ContentUrl}\n");
    Console.WriteLine($"Thumbnail URL for the first image:\n\n {firstImageResult.ThumbnailUrl}");
    Console.WriteLine("Press any key to exit ...");
    Console.ReadKey();
}
```

## Next steps

> [!div class="nextstepaction"]
> [Bing Image Search single-page app tutorial](../../tutorial-bing-image-search-single-page-app.md)

## See also

* [What is Bing Image Search?](../../overview.md)  
* [Try an online interactive demo](https://azure.microsoft.com/services/cognitive-services/bing-image-search-api/)  
* [.NET samples for the Azure AI services SDK](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/BingSearchv7)
* [Azure AI services documentation](../../../../ai-services/index.yml)
* [Bing Image Search API reference](/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference)
