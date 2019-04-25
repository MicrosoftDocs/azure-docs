---
title: What is Project URL Preview?
titlesuffix: Azure Cognitive Services
description: Introduction to the Project URL Preview.
services: cognitive-services
author: mikedodaro
manager: nitinme

ms.service: cognitive-services
ms.subservice: url-preview
ms.topic: overview
ms.date: 03/16/2018
ms.author: rosh
---

# What is Project URL Preview?
The URL Preview endpoint takes a URL query parameter and returns a JSON response with the name of the target resource, a brief description, and a link to an image to display in a preview. The response also includes the [isFamilyFriendly](url-preview-reference.md#query-parameters) flag that indicates whether the URL contains adult, pirated, or other illegal content. 

To get URL preview results, submit a GET request, and include the *Ocp-Apim-Subscription-Key* header with a valid token:  
```
https://api.labs.cognitive.microsoft.com/urlpreview/v7.0/search?q=https://swiftkey.com

```
The response: 
```
HTTP Headers:
BingAPIs-TraceId: 3CC74C94769440C0851D9DF0869FCE7F
BingAPIs-SessionId: 52219085A6364692958C9C83983A0DBA
X-MSEdge-ClientID: 13D44DC2DE946B4B0F25460CDF036AD6
BingAPIs-Market: en-US
X-MSEdge-Ref: Ref A: 3CC74C94769440C0851D9DF0869FCE7F Ref B: CO1EDGE0315 Ref C: 2018-04-11T18:47:40Z
{
  "_type": "WebPage",
  "name": "SwiftKey - Smart prediction technology for easier mobile typing",
  "url": "https:\/\/swiftkey.com\/en",
  "description": "Discover the best Android and iPhone and iPad apps for faster, easier typing with emoji, colorful themes and more - download SwiftKey Keyboard free today.",
  "isFamilyFriendly": true,
  "primaryImageOfPage": {
    "contentUrl": "https:\/\/swiftkey.com\/images\/og\/default.jpg"
  }
}

```
## Scenarios 

The URL Preview API supports brief descriptions of Web resources. Developers use it to build rich preview experiences.  Users can share or bookmark webpages, news, blogs, forums, etc. This API can also be used for content moderation.    

Applications use URL Preview to send Web requests to the endpoint with a query assigned to the URL to preview.  The JSON response contains the preview information: name, description of the resource, *familyFriendly* flag, and links that provide access to a representative image and to the complete resource online. 

## Terms of use
Use only the data from Project URL Preview to display preview snippets and thumbnail images hyperlinked to their source sites, in end user-initiated URL sharing on social media, chat bot or similar offerings. D not copy, store, or cache any data you receive from Project URL Preview. Honor any requests to disable previews that you may receive from website or content owners.

You, or a third party on your behalf, may not use, retain, store, cache, share, or distribute any data from the URL Preview API for testing, developing, training, distributing or making available any non-Microsoft service or feature. 

## Throttling requests

[!INCLUDE [cognitive-services-bing-throttling-requests](../../../../includes/cognitive-services-bing-throttling-requests.md)]

## Next steps
- [C# quickstart](csharp.md)
- [Java quickstart](java-quickstart.md)
- [JavaScript quickstart](javascript.md)
- [Node quickstart](node-quickstart.md)
- [Python quickstart](python-quickstart.md)
