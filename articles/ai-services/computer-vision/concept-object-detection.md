---
title: Object detection - Azure AI Vision
titleSuffix: Azure AI services
description: Learn concepts related to the object detection feature of the Azure AI Vision API - usage and limits.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 11/03/2022
ms.author: pafarley
ms.custom: seodec18, ignite-2022
---

# Object detection

Object detection is similar to [tagging](concept-tagging-images.md), but the API returns the bounding box coordinates (in pixels) for each object found in the image. For example, if an image contains a dog, cat and person, the Detect operation will list those objects with their coordinates in the image. You can use this functionality to process the relationships between the objects in an image. It also lets you determine whether there are multiple instances of the same object in an image.

The object detection function applies tags based on the objects or living things identified in the image. There is currently no formal relationship between the tagging taxonomy and the object detection taxonomy. At a conceptual level, the object detection function only finds objects and living things, while the tag function can also include contextual terms like "indoor", which can't be localized with bounding boxes.

Try out the capabilities of object detection quickly and easily in your browser using Vision Studio.

> [!div class="nextstepaction"]
> [Try Vision Studio](https://portal.vision.cognitive.azure.com/)

## Object detection example

The following JSON response illustrates what the Analyze API returns when detecting objects in the example image.

![A woman using a Microsoft Surface device in a kitchen](./Images/windows-kitchen.jpg)


```json
{
   "objects":[
      {
         "rectangle":{
            "x":730,
            "y":66,
            "w":135,
            "h":85
         },
         "object":"kitchen appliance",
         "confidence":0.501
      },
      {
         "rectangle":{
            "x":523,
            "y":377,
            "w":185,
            "h":46
         },
         "object":"computer keyboard",
         "confidence":0.51
      },
      {
         "rectangle":{
            "x":471,
            "y":218,
            "w":289,
            "h":226
         },
         "object":"Laptop",
         "confidence":0.85,
         "parent":{
            "object":"computer",
            "confidence":0.851
         }
      },
      {
         "rectangle":{
            "x":654,
            "y":0,
            "w":584,
            "h":473
         },
         "object":"person",
         "confidence":0.855
      }
   ],
   "requestId":"25018882-a494-4e64-8196-f627a35c1135",
   "metadata":{
      "height":473,
      "width":1260,
      "format":"Jpeg"
   },
   "modelVersion":"2021-05-01"
}
```


## Limitations

It's important to note the limitations of object detection so you can avoid or mitigate the effects of false negatives (missed objects) and limited detail.

* Objects are generally not detected if they're small (less than 5% of the image).
* Objects are generally not detected if they're arranged closely together (a stack of plates, for example).
* Objects are not differentiated by brand or product names (different types of sodas on a store shelf, for example). However, you can get brand information from an image by using the [Brand detection](concept-brand-detection.md) feature.

## Use the API

The object detection feature is part of the [Analyze Image](https://westcentralus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/56f91f2e778daf14a499f21b) API. You can call this API through a native SDK or through REST calls. Include `Objects` in the **visualFeatures** query parameter. Then, when you get the full JSON response, parse the string for the contents of the `"objects"` section.


* [Quickstart: Vision REST API or client libraries](./quickstarts-sdk/image-analysis-client-library.md?pivots=programming-language-csharp)
