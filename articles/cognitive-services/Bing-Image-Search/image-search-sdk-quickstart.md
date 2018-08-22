---
title: "Quickstart: Request and filter images using the SDK using C#"
description: In this quickstart, you request and filter the images returned by Bing Image Search, using C#.
titleSuffix: Azure cognitive services setup Image search SDK C# console application
services: cognitive-services
author: aahill
manager: cagronlund
ms.service: cognitive-services
ms.component: bing-image-search
ms.topic: article
ms.date: 01/29/2018
ms.author: aahi
---

# Quickstart: Request and filter images using the SDK and C#

Use this quickstart to send search queries, find trending images, and extract image details with the Bing Image Search SDK. The source code for this C# sample is available [on GitHub](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/BingSearchv7/BingImageSearch) with a console interface to explore the examples described here.

## Prerequisites

* The [Cognitive Image Search NuGet package](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Search.ImageSearch/1.2.0).

To install the Bing Image Search SDK in visual studio, use the `Manage NuGet Packages` option from the Solution Explorer in Visual Studio.

## Example 1: Search for images on the web with a client

To begin creating an image search client, add the following `using` directives to your project in order to create an instance of the `ImageSearchAPI` client:

```csharp
using Microsoft.Azure.CognitiveServices.Search.ImageSearch;
using Microsoft.Azure.CognitiveServices.Search.ImageSearch.Models;
```

Next, instantiate the client, using a valid Azure subscription key:

```csharp
var client = new ImageSearchAPI(new ApiKeyServiceClientCredentials("YOUR-ACCESS-KEY"));
```

## Send a search query using the client

Use the client to search with a query text:

```csharp

// Search for "Yosemite National Park"
var imageResults = client.Images.SearchAsync(query: "Canadian Rockies").Result;
Console.WriteLine("Search images for query \"canadian rockies\"");

```
## Parse the image results

Parse the image results returned in the response.

```csharp

if (imageResults.Value.Count > 0){
    var firstImageResult = imageResults.Value.First();

    Console.WriteLine($"\r\nImage result count: {imageResults.Value.Count}");
    Console.WriteLine($"First image insights token: {firstImageResult.ImageInsightsToken}");
    Console.WriteLine($"First image thumbnail url: {firstImageResult.ThumbnailUrl}");
    Console.WriteLine($"First image content url: {firstImageResult.ContentUrl}");
}
else{
    Console.WriteLine("Couldn't find image results!");
}
Console.WriteLine($"\r\nImage result total estimated matches: {imageResults.TotalEstimatedMatches}");

```

### Parse the pivot suggestions

Parse any pivot suggestions returned in the response:

```csharp

if (imageResults.PivotSuggestions.Count > 0){
    var firstPivot = imageResults.PivotSuggestions.First();

    Console.WriteLine($"Pivot suggestion count: {imageResults.PivotSuggestions.Count}");
    Console.WriteLine($"First pivot: {firstPivot.Pivot}");

    if (firstPivot.Suggestions.Count > 0){
        var firstSuggestion = firstPivot.Suggestions.First();

        Console.WriteLine($"Suggestion count: {firstPivot.Suggestions.Count}");
        Console.WriteLine($"First suggestion text: {firstSuggestion.Text}");
        Console.WriteLine($"First suggestion web search url: {firstSuggestion.WebSearchUrl}");
    }else{
        Console.WriteLine("Couldn't find suggestions!");
    }
}

```

### Parse the query expansions

Parse any query expansions returned in the result:

```csharp
if (imageResults.QueryExpansions.Count > 0){
    var firstQueryExpansion = imageResults.QueryExpansions.First();

    Console.WriteLine($"\r\nQuery expansion count: {imageResults.QueryExpansions.Count}");
    Console.WriteLine($"First query expansion text: {firstQueryExpansion.Text}");
    Console.WriteLine($"First query expansion search link: {firstQueryExpansion.SearchLink}");
}else{
    Console.WriteLine("Couldn't find query expansions!");
}
```

## Search options

The Bing image Search SDK and API provides several features along with image results. The following examples describe features of the `ImageSrchSDK` class.

## Example 2: Filtering and narrowing search results 

When using the Bing Image Search API or SDK, you can filter image results based on a variety of different attributes. This example searches for images based on "studio ghibli" that are filtered for animated .gifs with a wide aspect ratio. 

```csharp
var imageResults = client.Images.SearchAsync(query: "studio ghibli", imageType: ImageType.AnimatedGif, aspect: ImageAspect.Wide).Result;

//get the first image result
var firstImageResult = imageResults.Value.First();
//print out the image's details
Console.WriteLine($"First image insightsToken: {firstImageResult.ImageInsightsToken}");
Console.WriteLine($"First image thumbnail url: {firstImageResult.ThumbnailUrl}");
Console.WriteLine($"First image web search url: {firstImageResult.WebSearchUrl}");
```

## Example 3: Search for trending images

When using the Bing Image Search API or SDK, you can find trending images across different categories and tiles using the `TrendingAsync()` method. This method returns currently trending images separated into a one or more [categories](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#category). These categories contain images and URLs to more images on the subject.

```csharp
var trendingResults = client.Images.TrendingAsync().Result;
Console.WriteLine($"\r\nCategory count: {trendingResults.Categories.Count}");
//get the first category
var firstCategory = trendingResults.Categories[0];
Console.WriteLine($"First category title: {firstCategory.Title}");

//get the first Tile
var firstTile = firstCategory.Tiles[0];
Console.WriteLine($"First tile text: {firstTile.Query.Text}");
Console.WriteLine($"First tile url: {firstTile.Query.WebSearchUrl}");
```

## Example 4: Find details and insights about Bing images 

The Bing Image Search API can provide you with a variety of information about the details of images found on Bing. This example searches images for "Degas", and then gets details from Azure Cognitive Services about the first image.

First make the search with the image client using the `DetailsAsync()` method. 

```csharp
var modules = new List<string>() { ImageInsightModule.All };
var imageDetail = client.Images.DetailsAsync(query: "degas", insightsToken: firstImage.ImageInsightsToken, modules: modules).Result;
```

You can then access the image details by printing them.

```javascript

// Best representative query
Console.WriteLine($"\r\nBest representative query text: {imageDetail.BestRepresentativeQuery.Text}");
Console.WriteLine($"Best representative query web search url: {imageDetail.BestRepresentativeQuery.WebSearchUrl}");

// Caption 
Console.WriteLine($"\r\nImage caption: {imageDetail.ImageCaption.Caption}");
Console.WriteLine($"Image caption data source url: {imageDetail.ImageCaption.DataSourceUrl}");

// Pages that include the image
var firstPage = imageDetail.PagesIncluding.Value[0];
Console.WriteLine($"\r\nPages including count: {imageDetail.PagesIncluding.Value.Count}");
Console.WriteLine($"First page content url: {firstPage.ContentUrl}");
Console.WriteLine($"First page name: {firstPage.Name}");
Console.WriteLine($"First page date published: {firstPage.DatePublished}");

// Related searches 
var firstRelatedSearch = imageDetail.RelatedSearches.Value[0];
Console.WriteLine($"\r\nRelated searches count: {imageDetail.RelatedSearches.Value.Count}");
Console.WriteLine($"First related search text: {firstRelatedSearch.Text}");
Console.WriteLine($"First related search web search url: {firstRelatedSearch.WebSearchUrl}");

// Visually similar images
var firstVisuallySimilarImage = imageDetail.VisuallySimilarImages.Value[0];
Console.WriteLine($"\r\nVisually similar images count: {imageDetail.RelatedSearches.Value.Count}");
Console.WriteLine($"First visually similar image name: {firstVisuallySimilarImage.Name}");
Console.WriteLine($"First visually similar image content url: {firstVisuallySimilarImage.ContentUrl}");
Console.WriteLine($"First visually similar image size: {firstVisuallySimilarImage.ContentSize}");

// Image tags
var firstTag = imageDetail.ImageTags.Value[0];
Console.WriteLine($"\r\nImage tags count: {imageDetail.ImageTags.Value.Count}");
Console.WriteLine($"First tag name: {firstTag.Name}");
```

## Next steps

[Cognitive services .NET SDK samples](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/BingSearchv7)