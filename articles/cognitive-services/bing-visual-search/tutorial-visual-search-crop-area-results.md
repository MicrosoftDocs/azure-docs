---
title: "Tutorial: Crop an image with the Bing Visual Search SDK"
description: Use the Bing Visual Search SDK to get insights from specific ares on an image.
services: cognitive-services
titleSuffix: Azure Cognitive Services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-visual-search
ms.topic: article
ms.date: 04/26/2019
ms.author: rosh
---

# Tutorial: Crop an image with the Bing Visual Search SDK for C#

The Bing Visual Search SDK enables you to crop an image before finding similar online images. This application crops a single person from an image containing several people, and then returns search results containing similar images found online.

The full source code for this application is available with additional error handling and annotations on [GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/Tutorials/Bing-Visual-Search/BingVisualSearchCropImage.cs).

This tutorial illustrates how to:

> [!div class="checklist"]
> * Send a request using the Bing Visual Search SDK
> * Crop an area of image to search with Bing Visual Search
> * Receive and handle the response
> * Find the URLs of action items in the response

## Prerequisites

* Any edition of [Visual Studio 2019](https://www.visualstudio.com/downloads/).
* If you are using Linux/MacOS, this application can be run using [Mono](https://www.mono-project.com/).
* The [NuGet Custom Search](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Search.CustomSearch/1.2.0) package installed.
    - From the Solution Explorer in Visual Studio, right-click on your project and select **Manage NuGet Packages** from the menu. Install the `Microsoft.Azure.CognitiveServices.Search.CustomSearch` package. Installing the NuGet Custom Search package also installs the following assemblies:
        - Microsoft.Rest.ClientRuntime
        - Microsoft.Rest.ClientRuntime.Azure
        - Newtonsoft.Json

[!INCLUDE [cognitive-services-bing-image-search-signup-requirements](../../../includes/cognitive-services-bing-visual-search-signup-requirements.md)]

## Specify the image crop area

This application crops an area of this image of the Microsoft senior leadership team. This crop area is defined using upper-left and lower-right coordinates, represented as a percentage of the whole image:  

![Microsoft Senior Leadership Team](./media/MS_SrLeaders.jpg)

This image is cropped by creating an `ImageInfo` object from the crop area, and loading the `ImageInfo` object into a `VisualSearchRequest`. The `ImageInfo` object also includes the URL of the image:

```csharp
CropArea CropArea = new CropArea(top: (float)0.01, bottom: (float)0.30, left: (float)0.01, right: (float)0.20);
string imageURL = "https://docs.microsoft.com/azure/cognitive-services/bing-visual-search/media/ms_srleaders.jpg";
ImageInfo imageInfo = new ImageInfo(cropArea: CropArea, url: imageURL);

VisualSearchRequest visualSearchRequest = new VisualSearchRequest(imageInfo: imageInfo);
```

## Search for images similar to the crop area

The variable `VisualSearchRequest` contains information about the image's crop area and its URL. The `VisualSearchMethodAsync()` method gets the results:

```csharp
Console.WriteLine("\r\nSending visual search request with knowledgeRequest that contains URL and crop area");
var visualSearchResults = client.Images.VisualSearchMethodAsync(knowledgeRequest: visualSearchRequest).Result;

```

## Get the URL data from `ImageModuleAction`

Bing Visual Search results are `ImageTag` objects. Each tag contains a list of `ImageAction` objects. Each `ImageAction` contains a `Data` field, which is a list of values that depend on the type of action.

You can print the various types with the following code:

```csharp
Console.WriteLine("\r\n" + "ActionType: " + i.ActionType + " -> WebSearchUrl: " + i.WebSearchUrl);
```

The complete application returns:

|ActionType  |URL  | |
|---------|---------|---------|
|PagesIncluding WebSearchURL     |         |
|MoreSizes WebSearchURL     |         |  
|VisualSearch WebSearchURL    |         |
|ImageById WebSearchURL     |         |  
|RelatedSearches WebSearchURL     |         |
|Entity -> WebSearchUrl     | https://www.bing.com/cr?IG=E40D0E1A13404994ACB073504BC937A4&CID=03DCF882D7386A442137F49BD6596BEF&rd=1&h=BvvDoRtmZ35Xc_UZE4lZx6_eg7FHgcCkigU1D98NHQo&v=1&r=https%3a%2f%2fwww.bing.com%2fsearch%3fq%3dSatya%2bNadella&p=DevEx,5380.1        |
|TopicResults -> WebSearchUrl    |  https://www.bing.com/cr?IG=E40D0E1A13404994ACB073504BC937A4&CID=03DCF882D7386A442137F49BD6596BEF&rd=1&h=3QGtxPb3W9LemuHRxAlW4CW7XN4sPkUYCUynxAqI9zQ&v=1&r=https%3a%2f%2fwww.bing.com%2fdiscover%2fnadella%2bsatya&p=DevEx,5382.1        |
|ImageResults -> WebSearchUrl    |  https://www.bing.com/cr?IG=E40D0E1A13404994ACB073504BC937A4&CID=03DCF882D7386A442137F49BD6596BEF&rd=1&h=l-WNHO89Kkw69AmIGe2MhlUp6MxR6YsJszgOuM5sVLs&v=1&r=https%3a%2f%2fwww.bing.com%2fimages%2fsearch%3fq%3dSatya%2bNadella&p=DevEx,5384.1        |

As shown above, the `Entity` ActionType contains a Bing search query that returns information about a recognizable person, place, or thing. The `TopicResults` and `ImageResults` types contain queries for related images. The URLs in the list link  to Bing search results.

## Get URLs for `PagesIncluding` `ActionType` images

Getting the actual image URLs requires a cast that reads an `ActionType` as `ImageModuleAction`, which contains a `Data` element with a list of values. Each value is the URL of an image. The following casts the `PagesIncluding` action type to `ImageModuleAction` and reads the values:

```csharp
    if (i.ActionType == "PagesIncluding")
    {
        foreach(ImageObject o in (i as ImageModuleAction).Data.Value)
        {
            Console.WriteLine("ContentURL: " + o.ContentUrl);
        }
    }
```

## Next steps
> [!div class="nextstepaction"]
> [Create a Visual Search single-page web app](tutorial-bing-visual-search-single-page-app.md)

## See also
> [What is the Bing Visual Search API?](https://docs.microsoft.com/azure/cognitive-services/bing-visual-search/overview)
