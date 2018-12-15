---
title: Object detection - Computer Vision
titleSuffix: Azure Cognitive Services
description: Concepts related to object detection using the Computer Vision API.
services: cognitive-services
author: PatrickFarley
manager: cgronlun

ms.service: cognitive-services
ms.component: computer-vision
ms.topic: conceptual
ms.date: 12/03/2018
ms.author: pafarley
---

# Object detection

Object detection is similar to [tagging](concept-tagging-images.md), but the API returns the bounding box coordinates (in pixels) for each object found. For example, if an image contains a dog, cat and person, the Detect operation will list those objects together with their coordinates in the image. You can use this functionality to process the relationships between the objects in an image. It also lets you determine if there are multiple instances of the same tag in an image.

The Detect API applies tags based on the objects or living things identified in the image. Note that at this point, there is no formal relationship between the taxonomy used for tagging and the taxonomy used for object detection. At a conceptual level, the Detect API only finds objects and living things, while the Tag API can also include contextual terms like "indoor", which cannot be localized with bounding boxes.

## Object detection example

The following JSON response illustrates what Computer Vision returns when detecting objects in the example image.

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
   "requestId":"a7fde8fd-cc18-4f5f-99d3-897dcd07b308",
   "metadata":{
      "width":1260,
      "height":473,
      "format":"Jpeg"
   }
}
```

## Next steps

Learn concepts about [categorizing images](concept-categorizing-images.md) and [describing images](concept-describing-images.md).