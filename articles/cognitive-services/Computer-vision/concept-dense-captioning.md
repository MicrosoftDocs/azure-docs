---
title: Dense captioning - Image Analysis 4.0
titleSuffix: Azure Cognitive Services
description: Learn concepts related to the dense captions feature of the Image Analysis 4.0 API - usage and limits.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 02/20/2023
ms.author: pafarley
---

# Dense captioning (version 4.0 preview)

Dense captioning lets you generate detailed captions for individual objects that are found in an image. It's similar to [object detection](concept-object-detection-40.md) but uses the latest Florence AI models to generate rich captions, instead of simply naming the objects. The API returns the bounding box coordinates (in pixels) for each object found in the image, plus a caption. You can use this functionality to generate descriptions of separate parts of an image.

The dense captioning function applies tags based on the objects or living things identified in the image.

Try out the capabilities of object detection quickly and easily in your browser using Vision Studio.

> [!div class="nextstepaction"]
> [Try Vision Studio](https://portal.vision.cognitive.azure.com/)

## Dense captioning example

The following JSON response illustrates what the Analysis 4.0 API returns when generating dense captions for the example image.

![A woman using a Microsoft Surface device in a kitchen](./Images/windows-kitchen.jpg)



```json
tbd
```

## Limitations

It's important to note the limitations of dense captioning so you can avoid or mitigate the effects of false negatives (missed objects) and limited detail.

* Objects are generally not detected if they're small (less than 5% of the image).
* Objects are generally not detected if they're arranged closely together (a stack of plates, for example).
* Objects are not differentiated by brand or product names (different types of sodas on a store shelf, for example). However, you can get brand information from an image by using the [Brand detection](concept-brand-detection.md) feature.

## Use the API

The dense captioning feature is part of the [Analyze Image](https://aka.ms/vision-4-0-ref) API. You can call this API using REST. Include `tbd` in the **features** query parameter. Then, when you get the full JSON response, parse the string for the contents of the `"tbd"` section.

* [Quickstart: Computer Vision REST API or client libraries](./quickstarts-sdk/image-analysis-client-library-40.md?pivots=programming-language-csharp)
