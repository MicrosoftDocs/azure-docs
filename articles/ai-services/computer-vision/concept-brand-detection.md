---
title: Brand detection - Azure AI Vision
titleSuffix: Azure AI services
description: Learn about brand and logo detection, a specialized mode of object detection, using the Azure AI Vision API.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.topic: conceptual
ms.date: 07/05/2022
ms.author: pafarley
---

# Brand detection

Brand detection is a specialized mode of [object detection](concept-object-detection.md) that uses a database of thousands of global logos to identify commercial brands in images or video. You can use this feature, for example, to discover which brands are most popular on social media or most prevalent in media product placement.

The Azure AI Vision service detects whether there are brand logos in a given image; if there are, it returns the brand name, a confidence score, and the coordinates of a bounding box around the logo.

The built-in logo database covers popular brands in consumer electronics, clothing, and more. If you find that the brand you're looking for is not detected by the Azure AI Vision service, you could also try creating and training your own logo detector using the [Custom Vision](../custom-vision-service/index.yml) service.

## Brand detection example

The following JSON responses illustrate what Azure AI Vision returns when detecting brands in the example images.

![A red shirt with a Microsoft label and logo on it](./Images/red-shirt-logo.jpg)

```json
"brands":[  
   {  
      "name":"Microsoft",
      "rectangle":{  
         "x":20,
         "y":97,
         "w":62,
         "h":52
      }
   }
]
```

In some cases, the brand detector will pick up both the logo image and the stylized brand name as two separate logos.

![A gray sweatshirt with a Microsoft label and logo on it](./Images/gray-shirt-logo.jpg)

```json
"brands":[  
   {  
      "name":"Microsoft",
      "rectangle":{  
         "x":58,
         "y":106,
         "w":55,
         "h":46
      }
   },
   {  
      "name":"Microsoft",
      "rectangle":{  
         "x":58,
         "y":86,
         "w":202,
         "h":63
      }
   }
]
```

## Use the API

The brand detection feature is part of the [Analyze Image](https://westcentralus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/56f91f2e778daf14a499f21b) API. You can call this API through a native SDK or through REST calls. Include `Brands` in the **visualFeatures** query parameter. Then, when you get the full JSON response, simply parse the string for the contents of the `"brands"` section.

* [Quickstart: Vision REST API or client libraries](./quickstarts-sdk/image-analysis-client-library.md?pivots=programming-language-csharp)
