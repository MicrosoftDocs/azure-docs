---
title: Brand detection - Computer Vision
titleSuffix: Azure Cognitive Services
description: Concepts related to brand/logo detection using the Computer Vision API.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 04/17/2019
ms.author: pafarley
---

# Detect popular brands in images

Brand detection is a specialized mode of [object detection](concept-object-detection.md) that uses a database of thousands of global logos to identify commercial brands in images or video. You can use this feature, for example, to discover which brands are most popular on social media or most prevalent in media product placement.

The Computer Vision service detects whether there are brand logos in a given image; if so, it returns the brand name, a confidence score, and the coordinates of a bounding box around the logo.

The built-in logo database covers popular brands in consumer electronics, clothing, and more. If you find that the brand you're looking for is not detected by the Computer Vision service, you may be better served creating and training your own logo detector using the [Custom Vision](https://docs.microsoft.com/azure/cognitive-services/Custom-Vision-Service/) service.

## Brand detection example

The following JSON responses illustrate what Computer Vision returns when detecting brands in the example images.

![A gray sweatshirt with a Microsoft label and logo on it](./Images/gray-shirt-logo.jpg)

```json
{
   "brands":[
      {
         "name":"Microsoft",
         "confidence":0.706,
         "rectangle":{
            "x":470,
            "y":862,
            "w":338,
            "h":327
         }
      }
   ],
   "requestId":"5fda6b40-3f60-4584-bf23-911a0042aa13",
   "metadata":{
      "width":2286,
      "height":1715,
      "format":"Jpeg"
   }
}
```
In some cases, the brand detector will pick up both the logo image and the stylized brand name as two separate logos.

![A red shirt with a Microsoft label and logo on it](./Images/red-shirt-logo.jpg)

```json
{
   "brands":[
      {
         "name":"Microsoft",
         "confidence":0.657,
         "rectangle":{
            "x":436,
            "y":473,
            "w":568,
            "h":267
         }
      },
      {
         "name":"Microsoft",
         "confidence":0.85,
         "rectangle":{
            "x":101,
            "y":561,
            "w":273,
            "h":263
         }
      }
   ],
   "requestId":"10dcd2d6-0cf6-4a5e-9733-dc2e4b08ac8d",
   "metadata":{
      "width":1286,
      "height":1715,
      "format":"Jpeg"
   }
}
```

## Use the API

The brand detection feature is part of the [Analyze Image](https://westcentralus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fa) API. You can call this API through a native SDK or through REST calls. Include `Brands` in the **visualFeatures** query parameter. Then, when you get the full JSON response, simply parse the string for the contents of the `"brands"` section.

* [Quickstart: Analyze an image (.NET SDK)](./quickstarts-sdk/csharp-analyze-sdk.md)
* [Quickstart: Analyze an image (REST API)](./quickstarts/csharp-analyze.md)
