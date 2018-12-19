---
title: "Tutorial: Find similar images from previous searches using ImageInsightsToken - Bing Visual Search"
titlesuffix: Azure Cognitive Services
description: Use the Bing Visual Search SDK to get URLs of images specified by ImageInsightsToken.
services: cognitive-services
author: mikedodaro
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-visual-search
ms.topic: tutorial
ms.date: 06/21/2018
ms.author: rosh
---
# Tutorial: Find similar images from previous searches using ImageInsightsToken

The Visual Search SDK enables you to find images online from previous searches that return an `ImageInsightsToken`.  This application gets an `ImageInsightsToken` and uses the token in a subsequent search. It then sends the `ImageInsightsToken` to Bing and returns results that include Bing Search URLs, and URLs of similar images found online.

## Prerequisites

* Any edition of [Visual Studio 2017](https://www.visualstudio.com/downloads/).
* If you are using Linux/MacOS, this application can be run using [Mono](http://www.mono-project.com/).
* The NuGet Visual Search and Image Search packages. 
    - From the Solution Explorer in Visual Studio, right-click on your project and select `Manage NuGet Packages` from the menu. Install the `Microsoft.Azure.CognitiveServices.Search.CustomSearch` package, and the `Microsoft.Azure.CognitiveServices.Search.ImageSearch` package. Installing the NuGet packages also installs the following:
        - Microsoft.Rest.ClientRuntime
        - Microsoft.Rest.ClientRuntime.Azure
        - Newtonsoft.Json


[!INCLUDE [cognitive-services-bing-image-search-signup-requirements](../../../includes/cognitive-services-bing-image-search-signup-requirements.md)]

## Get the ImageInsightsToken from Image Search

This example uses an `ImageInsightsToken` obtained through the [Bing Image Search SDK](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/image-search-sdk-quickstart).

The code searches for results on a query for 'Canadian Rockies' and gets an ImageInsightsToken. It prints the first image's insights token, thumbnail url, and image content url.  The method returns the `ImageInsightsToken`for use in a later Visual Search request.

```csharp
        private static String ImageResults(String subKey)
        {
            String insightTok = "None";
            try
            {
                var client = new ImageSearchAPI(new Microsoft.Azure.CognitiveServices.Search.ImageSearch.ApiKeyServiceClientCredentials(subKey)); //
                var imageResults = client.Images.SearchAsync(query: "canadian rockies").Result;
                Console.WriteLine("Search images for query \"canadian rockies\"");

                if (imageResults == null)
                {
                    Console.WriteLine("No image result data.");
                }
                else
                {
                    // Image results
                    if (imageResults.Value.Count > 0)
                    {
                        var firstImageResult = imageResults.Value.First();

                        Console.WriteLine($"\r\nImage result count: {imageResults.Value.Count}");
                        insightTok = firstImageResult.ImageInsightsToken;
                        Console.WriteLine($"First image insights token: {firstImageResult.ImageInsightsToken}");  
                        Console.WriteLine($"First image thumbnail url: {firstImageResult.ThumbnailUrl}");
                        Console.WriteLine($"First image content url: {firstImageResult.ContentUrl}");
                    }
                    else
                    {
                        insightTok = "None found";
                        Console.WriteLine("Couldn't find image results!");
                    }
                }
            }

            catch (Exception ex)
            {
                Console.WriteLine("\r\nEncountered exception. " + ex.Message);
            }

            return insightTok;
        }
```

Specify the ImageInsightsToken for a Visual Search request by creating an `ImageInfo` object from the `ImageInsightsToken` contained in responses from Bing Visual Search. 

```csharp
ImageInfo ImageInfo = new ImageInfo(imageInsightsToken: insightsTok);
```

## Use Bing Visual Search to find images from an ImageInsightsToken

The `VisualSearchRequest` object contains information about the image in `ImageInfo` to be searched. The `VisualSearchMethodAsync()` method gets the results.

```csharp
// An image binary is not necessary here, as the image is specified by insights token.
VisualSearchRequest VisualSearchRequest = new VisualSearchRequest(ImageInfo);

var visualSearchResults = client.Images.VisualSearchMethodAsync(knowledgeRequest: VisualSearchRequest).Result;
Console.WriteLine("\r\nVisual search request with knowledgeRequest");

```

## Get the URL data from ImageModuleAction

Visual Search results are `ImageTag` objects.  Each tag contains a list of `ImageAction` objects.  Each `ImageAction` contains a `Data` field which is a list of values that depend on the type of action:

You can get the various types with the following code:
```
Console.WriteLine("\r\n" + "ActionType: " + i.ActionType + " -> WebSearchUrl: " + i.WebSearchUrl);

```
The complete application returns:

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


## PagesIncluding ActionType URLs of images found by Visual Search

Getting the actual image URLs requires a cast that reads an `ActionType` as `ImageModuleAction`, which contains a `Data` element with a list of values.  Each value is the URL of an image.  The following casts the `PagesIncluding` action type to `ImageModuleAction` and reads the values.

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

## Next steps

> [!div class="nextstepaction"]
> [Build a single-page web app](tutorial-bing-visual-search-single-page-app.md)