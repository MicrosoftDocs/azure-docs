---
title: What is Bing Visual Search?
titleSuffix: Azure Cognitive Services
description: Bing Visual Search provides details or insights about an image such as similar images or shopping sources.
services: cognitive-services
author: swhite-msft
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-visual-search
ms.topic: overview
ms.date: 04/10/2018
ms.author: scottwhi
---

# What is the Bing Visual Search API?

The Bing Visual Search API provides similar image details to those shown on Bing.com/images. By uploading an image or providing a URL to one, this API can identify a variety of details about it, including visually similar images, shopping sources, webpages that include the image, and more. If you use the [Bing Image Search API](../bing-image-search/overview.md), you can use insight tokens attached to the API's search results instead of uploading an image.

## Insights

The following are the insights that Visual Search lets you discover:

| Insight                              | Description |
|--------------------------------------|-------------|
| Visually similar images              | A list of images that are visually similar to the input image. |
| Visually similar products            | Products that are visually similar to the product shown.            |
| Shopping sources                     | Places where you can buy the item shown in the input image.            |
| Related searches                     | Related searches made by others or that are based on the contents of the image.            |
| Web pages that include the image     | Webpages that include the input image.            |
| Recipes                              | Webpages that include recipes for making the dish shown in the input image            |

In addition to these insights, Visual Search also returns a diverse set of terms (tags) derived from the input image. These tags allow users to explore concepts found in the image. For example, if the input image is of a famous athlete, one of the tags could be the name of the athlete, another tag could be Sports. Or, if the input image is of an apple pie, the tags could be Apple Pie, Pies, Desserts, so users can explore related concepts.

The Visual Search results also include bounding boxes for regions of interest in the image. For example, if the image contains several celebrities, the results may include bounding boxes for each of the recognized celebrities in the image. Or, if Bing recognizes a product or clothing in the image, the result may include a bounding box for the recognized product or clothing item.

> [!IMPORTANT]
> If you get image insights using the Bing Image Search API, consider switching to the Bing Visual Search API, which provides more comprehensive insights.

## Workflow

The Bing Visual Search API is a RESTful web service, making it easy to call from any programming language that can make HTTP requests and parse JSON. You can use the service using either the REST API, or the SDK.

1. Create a Cognitive Services API account with access to the Bing Search APIs. If you don't have an Azure subscription, you can create an account for free.
2. Send a request to the API, with a valid search query.
3. Process the API response by parsing the returned JSON message.


## Next steps

First, try the Bing Image Search API [interactive demo](https://azure.microsoft.com/services/cognitive-services/bing-visual-search/).
This demo shows how you can quickly customize a search query and scour the web for images.

When you are ready to call the API, create a [Cognitive services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account). If you don't have an Azure subscription, you can [create an account](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api) for free.

To get started quickly with your first request, see the quickstarts: [C#](quickstarts/csharp.md) | [Java](quickstarts/java.md) | [node.js](quickstarts/nodejs.md) | [Python](quickstarts/python.md).


## See also

* The [Bing Visual Search reference](https://docs.microsoft.com/rest/api/cognitiveservices/bingvisualsearch/images/visualsearch) documentation contains definitions and information on the endpoints, headers, API responses, and query parameters that you can use to request image-based search results.

* The [Bing Use and Display Requirements](./use-and-display-requirements.md) specify acceptable uses of the content and information gained through the Bing search APIs.
