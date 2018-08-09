---
title: Getting images from the web with the Bing Image Search API | Microsoft Docs
description: Use the Bing Image Search API to search for, and get relevant images from the web.
services: cognitive-services
author: aahill
manager: cgronlun
ms.assetid: AB1B9898-C94A-4B59-91A1-8623C94BA3D4
ms.service: cognitive-services
ms.component: bing-image-search
ms.topic: conceptual
ms.date: 8/8/2018
ms.author: aahi
---

# Getting images from the web with the Bing Image Search API

Using the Bing Image Search REST API, you can get images from the web that are related to the user's search term by sending the following GET request:

```http
GET https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=sailing+dinghies&mkt=en-us HTTP/1.1
Ocp-Apim-Subscription-Key: 123456789ABCDE
X-MSEdge-ClientIP: 999.999.999.999
X-Search-Location: lat:47.60357;long:-122.3295;re:100
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>
Host: api.cognitive.microsoft.com
```

> [!IMPORTANT]
> * All requests must be made from a server, and not from a client.
> * If it's your first time calling any of the Bing search APIs, don't include the client ID header. Only include the client ID if you've previously called a Bing API that returned a client ID for the user and device combination.
> * Images must be displayed in the order provided in the response.

## Getting images from a specific web domain

To get images from a specific domain, use the [site:](http://msdn.microsoft.com/library/ff795613.aspx) query operator.

```http
GET https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=sailing+dinghies+site:contososailing.com&mkt=en-us HTTP/1.1
```

> [!NOTE]
> Responses to queries using the `site:` operator may include adult content regardless of the [safeSearch](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#safesearch) setting. Only use `site:` if you are aware of the content on the domain.

The following example shows how to get small images from ContosoSailing.com that Bing has discovered in the past week.  

```http
GET https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=sailing+dinghies+site:contososailing.com&size=small&freshness=week&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
X-MSEdge-ClientIP: 999.999.999.999  
X-Search-Location: lat:47.60357;long:-122.3295;re:100  
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
Host: api.cognitive.microsoft.com  
```

## Filtering images

 By default, the Image Search API will return all images that are relevant to the query. If you want to filter the images Bing returns (for example, to return only images with a transparant background or specific size), you can use the following query parameters:

* [aspect](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#aspect)—Filter images by aspect ratio (for example, standard or wide screen images)
* [color](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#color)—Filter images by dominant color or black and white
* [freshness](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#freshness)—Filter images by age (for example, images discovered by Bing in the past week)
* [height](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#height), [width](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#width)—Filter images by width and height
* [imageContent](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#imagecontent)—Filter images by content (for example, images that show only a person's face)
* [imageType](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#imagetype)—Filter images by type (for example, clip art, animated GIFs, or transparent backgrounds)
* [license](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#license)—Filter images by the type of license associated with the site
* [size](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#size)—Filter images by size, such as small images up to 200x200 pixels

To get images from a specific domain, use the [site:](http://msdn.microsoft.com/library/ff795613.aspx) query operator.

    > [!NOTE]
    > Responses to queries using the `site:` operator may include adult content regardless of the [safeSearch](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#safesearch) setting. Only use `site:` if you are aware of the content on the domain.

The following example shows how to get small images from ContosoSailing.com that Bing has discovered in the past week.  

```http
GET https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=sailing+dinghies+site:contososailing.com&size=small&freshness=week&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
X-MSEdge-ClientIP: 999.999.999.999  
X-Search-Location: lat:47.60357;long:-122.3295;re:100  
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
Host: api.cognitive.microsoft.com  
```

## Bing Image Search response format

The response message from Bing contains an [Images](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#images) answer that contains a list of images that Azure cognitive services determined to be relevant to the query. Each [Image](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#image) object in the list includes the following information about the image: the URL, its size, its dimensions, its encoding format, a URL to a thumbnail of the image, and the thumbnail's dimensions.

```json
{
    "name": "Rich Passage Sailing Dinghy",
    "webSearchUrl": "https:\/\/www.bing.com\/cr?IG=73118C8B4E3...",
    "thumbnailUrl": "https:\/\/tse1.mm.bing.net\/th?id=OIP.GNarK7m...",
    "datePublished": "2011-10-29T11:26:00",
    "contentUrl": "http:\/\/www.bing.com\/cr?IG=73118C8B4E3D4C3...",
    "hostPageUrl": "http:\/\/www.bing.com\/cr?IG=73118C8B4E3D4C3687...",
    "contentSize": "79239 B",
    "encodingFormat": "jpeg",
    "hostPageDisplayUrl": "en.contoso.org\/wiki\/File:Rich_Passage...",
    "width": 526,
    "height": 688,
    "thumbnail": {
        "width": 229,
        "height": 300
    },
    "imageInsightsToken": "ccid_GNarK7ma*mid_CCF85447ADA6...",
    "insightsSourcesSummary": {
        "shoppingSourcesCount": 0,
        "recipeSourcesCount": 0
    },
    "imageId": "CCF85447ADA6FFF9E96E7DF0B796F7A86E34593",
    "accentColor": "376094"
},
```

## Displaying thumbnails

The information in the response can be used to display all, or a subset of the returned thumbnails. If you display a subset, provide a option to view the remaining images. 

You can also resize and expand thumbnails, such as when a user's cursor hovers above it. Be sure to attribute the image if you expand it. For example, by extracting the host from [hostPageDisplayUrl](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#image-hostpagedisplayurl) and displaying it below the image. 

For information about resizing the thumbnail, see [Resizing and Cropping Thumbnails](../resize-and-crop-thumbnails.md).

<!-- Removing image until we can replace it with a sanatized version.
![Expanded view of thumbnail image](../bing-web-search/media/cognitive-services-bing-web-api/bing-web-image-thumbnail-expansion.PNG)
-->

If the user clicks the thumbnail, you can use [contentUrl](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#image-contenturl) to display the full-size image to the user. Be sure to attribute the image.

If `shoppingSourcesCount` or `recipeSourcesCount` are greater than zero, add badging, such as a shopping cart, to the thumbnail to indicate that shopping or recipes exist for the item in the image.

<!-- this is a sanitized version but we're removing all images for now until everything is sanitized.
![Shopping sources badge](./media/cognitive-services-bing-images-api/bing-images-shopping-source.PNG)
-->

To get insights about the image, such as web pages that include the image or people that were recognized in the image, use [imageInsightsToken](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#image-imageinsightstoken). For details, see [Image Insights](../image-insights.md).