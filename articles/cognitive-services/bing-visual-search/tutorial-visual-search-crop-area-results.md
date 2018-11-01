---
title: "Tutorial: Image crop area and results - Bing Visual Search"
description: How to use the Bing Visual Search SDK to get URLs of images similar to crop area of uploaded image.
services: cognitive-services
author: mikedodaro
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-visual-search
ms.topic: tutorial
ms.date: 06/20/2018
ms.author: rosh
---
# Tutorial: Bing Visual Search SDK image crop area and results
The Visual Search SDK includes an option to select an area of an image and find images online that are similar to the crop area of the larger image.  This example specifies crop area showing one person from an image that contains several people.  The code sends the crop area and the URL of the larger image and returns results that include Bing Search URLs and URLs of similar images found online.

## Prerequisites

You will need [Visual Studio 2017](https://www.visualstudio.com/downloads/) to get this code running on Windows. (The free Community Edition will work.)

You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with Bing Search APIs. The [free trial](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api) is sufficient for this quickstart. You need the access key provided when you activate your free trial, or you may use a paid subscription key from your Azure dashboard.

## Application dependencies
To set up a console application using the Bing Web Search SDK, browse to the Manage NuGet Packages option from the Solution Explorer in Visual Studio. Add the Microsoft.Azure.CognitiveServices.Search.VisualSearch package.

Installing the NuGet Web Search SDK package also installs dependencies, including:

* Microsoft.Rest.ClientRuntime
* Microsoft.Rest.ClientRuntime.Azure
* Newtonsoft.Json

## Image and crop area
The following image shows the Microsoft senior leadership team.  Using the Visual Search SDK, we upload a crop area of the image and find other images and Web pages that include the entity in the selected area of the larger image.  In this case, the entity is a person.

![Microsoft Senior Leadership Team](./media/MS_SrLeaders.jpg)

## Specify the crop area as ImageInfo in VisualSearchRequest
This example uses a crop area of the previous image that specifies upper left and lower right coordinates by percentage of the whole image.  The following code creates an `ImageInfo` object from the crop area and loads the `ImageInfo` object into a `VisualSearchRequest`.  The `ImageInfo` object also includes the URL of the image online.

```
CropArea CropArea = new CropArea(top: (float)0.01, bottom: (float)0.30, left: (float)0.01, right: (float)0.20);
string imageURL = "https://docs.microsoft.com/azure/cognitive-services/bing-visual-search/media/ms_srleaders.jpg;
ImageInfo imageInfo = new ImageInfo(cropArea: CropArea, url: imageURL);

VisualSearchRequest visualSearchRequest = new VisualSearchRequest(imageInfo: imageInfo);
```
## Search for images similar to crop area
The `VisualSearchRequest` contains crop area information about the image and its URL.  The `VisualSearchMethodAsync` method gets the results.
```
Console.WriteLine("\r\nSending visual search request with knowledgeRequest that contains URL and crop area");
var visualSearchResults = client.Images.VisualSearchMethodAsync(knowledgeRequest: visualSearchRequest).Result; 

```

## Get the URL data from ImageModuleAction
Visual Search results are `ImageTag` objects.  Each tag contains a list of `ImageAction` objects.  Each `ImageAction` contains a `Data` field which is a list of values that depend on the type of action:

You can get the various types with the following code:
```
Console.WriteLine("\r\n" + "ActionType: " + i.ActionType + " -> WebSearchUrl: " + i.WebSearchUrl);

```
The complete application returns:

* ActionType: PagesIncluding WebSearchURL:
* ActionType: MoreSizes WebSearchURL:
* ActionType: VisualSearch WebSearchURL:
* ActionType: ImageById WebSearchURL: 
* ActionType: RelatedSearches  WebSearchURL:
* ActionType: Entity -> WebSearchUrl: https://www.bing.com/cr?IG=E40D0E1A13404994ACB073504BC937A4&CID=03DCF882D7386A442137F49BD6596BEF&rd=1&h=BvvDoRtmZ35Xc_UZE4lZx6_eg7FHgcCkigU1D98NHQo&v=1&r=https%3a%2f%2fwww.bing.com%2fsearch%3fq%3dSatya%2bNadella&p=DevEx,5380.1
* ActionType: TopicResults -> WebSearchUrl: https://www.bing.com/cr?IG=E40D0E1A13404994ACB073504BC937A4&CID=03DCF882D7386A442137F49BD6596BEF&rd=1&h=3QGtxPb3W9LemuHRxAlW4CW7XN4sPkUYCUynxAqI9zQ&v=1&r=https%3a%2f%2fwww.bing.com%2fdiscover%2fnadella%2bsatya&p=DevEx,5382.1
* ActionType: ImageResults -> WebSearchUrl: https://www.bing.com/cr?IG=E40D0E1A13404994ACB073504BC937A4&CID=03DCF882D7386A442137F49BD6596BEF&rd=1&h=l-WNHO89Kkw69AmIGe2MhlUp6MxR6YsJszgOuM5sVLs&v=1&r=https%3a%2f%2fwww.bing.com%2fimages%2fsearch%3fq%3dSatya%2bNadella&p=DevEx,5384.1

As shown in preceding list, the `Entity` `ActionType` contains a Bing Search query that returns information about a recognizable person, place, or thing.  The `TopicResults` and `ImageResults` types contain queries for related images. The URLs in the list link  to Bing search results.


## PagesIncluding ActionType URLs of images found by Visual Search

Getting the actual image URLs requires a cast that reads an `ActionType` as `ImageModuleAction`, which contains a `Data` element with a list of values.  Each value is the URL of an image.  The following casts the `PagesIncluding` action type to `ImageModuleAction` and reads the values.
```
    if (i.ActionType == "PagesIncluding")
    {
        foreach(ImageObject o in (i as ImageModuleAction).Data.Value)
        {
            Console.WriteLine("ContentURL: " + o.ContentUrl);
        }
    }
```

## Complete code

The following code runs previous examples. It sends an image binary in the body of the post request, along with a cropArea object, and prints out the Bing search URLs for each ActionType. If the ActionType is PagesIncluding, the code gets the ImageObject items in ImageObject Data.  The Data contains a list of values, which are the URLs of images on Web pages.  Copy and paste resulting Visual Search URLs to browser to show results. Copy and paste ContentUrl items to browser to show images.

```
using System;
using System.IO;
using System.Linq;
using Microsoft.Azure.CognitiveServices.Search.VisualSearch;
using Microsoft.Azure.CognitiveServices.Search.VisualSearch.Models;
using Microsoft.Azure.CognitiveServices.Search.ImageSearch;

namespace VisualSearchFeatures
{
    class Program
    {
        static void Main(string[] args)
        {
            String subscriptionKey = "YOUR-ACCESS-KEY";

            VisualSearchImageBinaryWithCropArea(subscriptionKey);

            Console.WriteLine("Any key to quit...");
            Console.ReadKey();

        }

        public static void VisualSearchImageBinaryWithCropArea(string subscriptionKey)
        {
            var client = new VisualSearchAPI(new Microsoft.Azure.CognitiveServices.Search.VisualSearch.ApiKeyServiceClientCredentials(subscriptionKey));

            try
            {
                CropArea CropArea = new CropArea(top: (float)0.01, bottom: (float)0.30, left: (float)0.01, right: (float)0.20);
                
                // The ImageInfo struct specifies the crop area in the image and the URL of the larger image. 
                string imageURL = "https://docs.microsoft.com/azure/cognitive-services/bing-visual-search/media/ms_srleaders.jpg";
                ImageInfo imageInfo = new ImageInfo(cropArea: CropArea, url: imageURL);
                
                VisualSearchRequest visualSearchRequest = new VisualSearchRequest(imageInfo: imageInfo);

                var visualSearchResults = client.Images.VisualSearchMethodAsync(knowledgeRequest: visualSearchRequest).Result; 

                Console.WriteLine("\r\nVisual search request with image from URL and crop area combined in knowledgeRequest");

                if (visualSearchResults == null)
                {
                    Console.WriteLine("No visual search result data.");
                }
                else
                {
                    // List of tags
                    if (visualSearchResults.Tags.Count > 0)
                    {

                        foreach(ImageTag t in visualSearchResults.Tags)
                        {
                            foreach (ImageAction i in t.Actions)
                            { 
                                Console.WriteLine("\r\n" + "ActionType: " + i.ActionType + " -> WebSearchUrl: " + i.WebSearchUrl);

                                if (i.ActionType == "PagesIncluding")
                                {
                                    foreach(ImageObject o in (i as ImageModuleAction).Data.Value)
                                    {
                                        Console.WriteLine("ContentURL: " + o.ContentUrl);
                                    }
                                }
                            }

                        }

                    }
                    else
                    {
                        Console.WriteLine("Couldn't find image tags!");
                    }
                }
            }

            catch (Exception ex)
            {
                Console.WriteLine("Encountered exception. " + ex.Message);
            }
        }
    }
}

```
## Next steps
[Visual Search response](https://docs.microsoft.com/azure/cognitive-services/bing-visual-search/overview#the-response)