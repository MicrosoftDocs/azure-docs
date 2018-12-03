---
title: Resize and crop Bing thumbnails - Bing Image Search API
description: Learn how to resize and crop thumbnails included in a response from the Bing Image Search API.
services: cognitive-services
author: swhite-msft
manager: cgronlun
ms.assetid: F4FFAE91-A003-4F7C-8E60-83A142485E28
ms.service: cognitive-services
ms.component: bing-image-search
ms.topic: conceptual
ms.date: 04/15/2017
ms.author: scottwhi
---

# Resizing and cropping thumbnail images

Upon processing a search query, Bing will generate thumbnail information for all images in its [response](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/concepts/bing-image-search-get-images#bing-image-search-response-format). This information can be used to display all, or a subset of the returned thumbnails. If you display a subset, provide a option to view the remaining images.


<!-- Removing image until we can replace it with a sanatized version.
![Expanded view of thumbnail image](../bing-web-search/media/cognitive-services-bing-web-api/bing-web-image-thumbnail-expansion.PNG)
-->

If the user clicks the thumbnail, you can use [contentUrl](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#image-contenturl) to display the full-size image to the user. Be sure to attribute the image.

If `shoppingSourcesCount` or `recipeSourcesCount` are greater than zero, add badging, such as a shopping cart, to the thumbnail to indicate that shopping or recipes exist for the item in the image.

<!-- this is a sanitized version but we're removing all images for now until everything is sanitized.
![Shopping sources badge](./media/cognitive-services-bing-images-api/bing-images-shopping-source.PNG)
-->

To get insights about the image, such as web pages that include the image or people that were recognized in the image, use [imageInsightsToken](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#image-imageinsightstoken). For details, see [Image Insights](image-insights.md).

## Resizing and cropping thumbnails

You can also resize and expand thumbnails, such as when a user's cursor hovers above it.
> [!NOTE]
> Be sure to attribute the image if you expand it. For example, by extracting the host from [hostPageDisplayUrl](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#image-hostpagedisplayurl) and displaying it below the image.

[!INCLUDE [cognitive-services-bing-resize-crop-thumbnails](../../../includes/cognitive-services-bing-resize-crop-thumbnails.md)]
