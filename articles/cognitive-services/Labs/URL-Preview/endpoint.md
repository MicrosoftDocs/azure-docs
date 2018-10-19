---
title: Project URL Preview endpoint
titlesuffix: Azure Cognitive Services
description: Summary of the URL Preview endpoint.
services: cognitive-services
author: mikedodaro
manager: cgronlun

ms.service: cognitive-services
ms.component: project-url-preview
ms.topic: reference
ms.date: 03/29/2018
ms.author: rosh, v-gedod
---

# Project URL Preview endpoint

The URL Preview API includes one endpoint.

## Endpoint
To get a URL Preview, send a request to the following endpoint. Use the headers and URL parameters for other specifications.

GET:
````
https://api.labs.cognitive.microsoft.com/urlpreview/v7.0/search?q=https://swiftkey.com

````

### Query parameters
|Name|Value|Type|Required|  
|----------|-----------|----------|--------------|  
|q|URL to preview|String |Yes|
|safeSearch|Illegal adult content, or pirated content, is blocked with error code 400, and the *isFamilyFriendly* flag is not returned. <p>For legal adult content, below is the behavior. Status code returns 200, and the *isFamilyFriendly* flag is set to false.<ul><li>safeSearch=strict: Title, description, URL and image will not be returned.</li><li>safeSearch=moderate; Get title, URL and description but not the descriptive image.</li><li>safeSearch=off; Get all the response objects/elements – title, URL, description, and image.</li></ul> |String|Not required. </br> Defaults to safeSearch=strict.| 

## Response object

The response includes HTTP headers and WebPage object with attributes as shown in the following example: `name`, `url`, `description`, `isFamilyFriendly`, and `primaryImageOfPage`.

````
BingAPIs-TraceId: 15AFE52A97AA422F960433A94803F6CE
BingAPIs-SessionId: 40587764F42142D3A8BA99F66B2B3BB6
X-MSEdge-ClientID: 0389E3EDED106B5E1424E82FEC436A56
BingAPIs-Market: en-US
X-MSEdge-Ref: Ref A: 15AFE52A97AA422F960433A94803F6CE Ref B: PAOEDGE0418 Ref C: 2018-03-30T16:36:27Z
{
  "_type": "WebPage",
  "name": "SwiftKey - Smart prediction technology for easier mobile ...",
  "url": "https://swiftkey.com/",
   "description": "Discover the best Android and iPhone and iPad apps for faster, easier typing with emoji, colorful themes and more - download SwiftKey Keyboard free today.",
  "isFamilyFriendly": true,
  "primaryImageOfPage": {
    "contentUrl": "https://swiftkey.com/images/og/default.jpg"
  }
}

````

## Next steps
- [C# quickstart](csharp.md)
- [Java quickstart](java-quickstart.md)
- [JavaScript quickstart](javascript.md)
- [Node quickstart](node-quickstart.md)
- [Python quickstart](python-quickstart.md)
