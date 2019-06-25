---
title: "Find similar images from previous searches using ImageInsightsToken - Bing Visual Search"
titleSuffix: Azure Cognitive Services
description: Use the Bing Visual Search SDK to get URLs of images specified by ImageInsightsToken.
services: cognitive-services
author: aahill
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-visual-search
ms.topic: article
ms.date: 06/18/2019
ms.author: rosh
---
# Find similar images from previous searches using ImageInsightsToken

The Visual Search SDK enables you to find images online from previous searches that return an `ImageInsightsToken`. This application gets an `ImageInsightsToken` and uses the token in a subsequent search. It then sends the `ImageInsightsToken` to Bing and returns results that include Bing Search URLs and URLs of similar images found online.

The full source code for this tutorial can be found with additional error handling and annotations on [GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/Tutorials/Bing-Visual-Search/BingVisualSearchInsightsTokens.cs).

## Prerequisites

* Any edition of [Visual Studio 2019](https://www.visualstudio.com/downloads/).
* If you are using Linux/MacOS, you can run this application using [Mono](https://www.mono-project.com/).
* The NuGet Visual Search and Image Search packages.
    - From the Solution Explorer in Visual Studio, right-click on your project and select **Manage NuGet Packages** from the menu. Install the `Microsoft.Azure.CognitiveServices.Search.CustomSearch` package, and the `Microsoft.Azure.CognitiveServices.Search.ImageSearch` package. Installing the NuGet packages also installs the following:
        - Microsoft.Rest.ClientRuntime
        - Microsoft.Rest.ClientRuntime.Azure
        - Newtonsoft.Json


[!INCLUDE [cognitive-services-bing-visual-search-signup-requirements](../../../includes/cognitive-services-bing-visual-search-signup-requirements.md)]

## Get the ImageInsightsToken from the Bing Image Search SDK

This application uses an `ImageInsightsToken` obtained through the [Bing Image Search SDK](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/image-search-sdk-quickstart). In a new C# console application, create a client to call the API using `ImageSearchClient()`. Then use `SearchAsync()` with your query:

```csharp
var client = new ImageSearchClient(new Microsoft.Azure.CognitiveServices.Search.ImageSearch.ApiKeyServiceClientCredentials(subKey));
var imageResults = client.Images.SearchAsync(query: "canadian rockies").Result;
Console.WriteLine("Search images for query \"canadian rockies\"");
```

Store the first search result using `imageResults.Value.First()`, and then store the image insight's `ImageInsightsToken`.

```csharp
String insightTok = "None";
if (imageResults.Value.Count > 0)
{
    var firstImageResult = imageResults.Value.First();
    insightTok = firstImageResult.ImageInsightsToken;
}
else
{
    insightTok = "None found";
    Console.WriteLine("Couldn't find image results!");
}
```

This `ImageInsightsToken` is sent to Bing Visual Search in a request.

## Add the ImageInsightsToken to a Visual Search request

Specify the `ImageInsightsToken` for a Visual Search request by creating an `ImageInfo` object from the `ImageInsightsToken` contained in responses from Bing Visual Search.

```csharp
ImageInfo ImageInfo = new ImageInfo(imageInsightsToken: insightsTok);
```

## Use Bing Visual Search to find images from an ImageInsightsToken

The `VisualSearchRequest` object contains information about the image in `ImageInfo` to be searched. The `VisualSearchMethodAsync()` method gets the results. You don't have to provide an image binary, as the image is represented by the token.

```csharp
VisualSearchRequest VisualSearchRequest = new VisualSearchRequest(ImageInfo);

var visualSearchResults = client.Images.VisualSearchMethodAsync(knowledgeRequest: VisualSearchRequest).Result;

```

## Iterate through the Visual Search results

Visual Search results are `ImageTag` objects. Each tag contains a list of `ImageAction` objects. Each `ImageAction` contains a `Data` field, which is a list of values that depend on the type of action. You can iterate through the `ImageTag` objects in `visualSearchResults.Tags`, for instance, and get the `ImageAction` tag within it. The sample below prints the details of `PagesIncluding` actions:

```csharp
if (visualSearchResults.Tags.Count > 0)
{
    // List of tags
    foreach (ImageTag t in visualSearchResults.Tags)
    {
        foreach (ImageAction i in t.Actions)
        {
            Console.WriteLine("\r\n" + "ActionType: " + i.ActionType + " WebSearchURL: " + i.WebSearchUrl);

            if (i.ActionType == "PagesIncluding")
            {
                foreach (ImageObject o in (i as ImageModuleAction).Data.Value)
                {
                    Console.WriteLine("ContentURL: " + o.ContentUrl);
                }
            }
        }
    }
}
```

### PagesIncluding ActionTypes

Getting the actual image URLs from action types requires a cast that reads an `ActionType` as `ImageModuleAction`, which contains a `Data` element with a list of values. Each value is the URL of an image.  The following casts the `PagesIncluding` action type to `ImageModuleAction` and reads the values:

```csharp
    if (i.ActionType == "PagesIncluding")
    {
        foreach(ImageObject o in (i as ImageModuleAction).Data.Value)
        {
            Console.WriteLine("ContentURL: " + o.ContentUrl);
        }
    }
```

For more information about these data types, see [Images - Visual Search](https://docs.microsoft.com/rest/api/cognitiveservices/bingvisualsearch/images/visualsearch).

## Returned URLs

The complete application returns the following URLs:

|ActionType  |URL  | |
|---------|---------|---------|
|MoreSizes -> WebSearchUrl     |         |
|VisualSearch -> WebSearchUrl     |         |
|ImageById -> WebSearchUrl    |         |
|RelatedSearches -> WebSearchUrl:    |         |
|DocumentLevelSuggestions -> WebSearchUrl:     |         |
|TopicResults -> WebSearchUrl    | https://www.bing.com/cr?IG=3E32CC6CA5934FBBA14ABC3B2E4651F9&CID=1BA795A21EAF6A63175699B71FC36B7C&rd=1&h=BcQifmzdKFyyBusjLxxgO42kzq1Geh7RucVVqvH-900&v=1&r=https%3a%2f%2fwww.bing.com%2fdiscover%2fcanadian%2brocky&p=DevEx,5823.1       |
|ImageResults -> WebSearchUrl    |  https://www.bing.com/cr?IG=3E32CC6CA5934FBBA14ABC3B2E4651F9&CID=1BA795A21EAF6A63175699B71FC36B7C&rd=1&h=PV9GzMFOI0AHZp2gKeWJ8DcveSDRE3fP2jHDKMpJSU8&v=1&r=https%3a%2f%2fwww.bing.com%2fimages%2fsearch%3fq%3doutdoor&p=DevEx,5831.1       |

As shown above, the `TopicResults` and `ImageResults` types contain queries for related images. The URLs link to Bing search results.

## Next steps

> [!div class="nextstepaction"]
> [Create a Visual Search single-page web app](tutorial-bing-visual-search-single-page-app.md)
