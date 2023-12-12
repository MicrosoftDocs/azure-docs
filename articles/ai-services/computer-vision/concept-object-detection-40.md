---
title: Object detection - Image Analysis 4.0
titleSuffix: Azure AI services
description: Learn concepts related to the object detection feature of the Image Analysis 4.0 API - usage and limits.
#services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.topic: conceptual
ms.date: 01/24/2023
ms.author: pafarley
ms.custom: seodec18, ignite-2022
---

# Object detection (version 4.0)

Object detection is similar to [tagging](concept-tag-images-40.md), but the API returns the bounding box coordinates (in pixels) for each object found in the image. For example, if an image contains a dog, cat and person, the object detection operation will list those objects with their coordinates in the image. You can use this functionality to process the relationships between the objects in an image. It also lets you determine whether there are multiple instances of the same object in an image.

The object detection function applies tags based on the objects or living things identified in the image. There is currently no formal relationship between the tagging taxonomy and the object detection taxonomy. At a conceptual level, the object detection function only finds objects and living things, while the tag function can also include contextual terms like "indoor", which can't be localized with bounding boxes.

Try out the capabilities of object detection quickly and easily in your browser using Vision Studio.

> [!div class="nextstepaction"]
> [Try Vision Studio](https://portal.vision.cognitive.azure.com/)

## Object detection example

The following JSON response illustrates what the Analysis 4.0 API returns when detecting objects in the example image. 

![A woman using a Microsoft Surface device in a kitchen](./Images/windows-kitchen.jpg)



```json
{
    "metadata":
    {
        "width": 1260,
        "height": 473
    },
    "objectsResult":
    {
        "values":
        [
            {
                "name": "kitchen appliance",
                "confidence": 0.501,
                "boundingBox": {"x":730,"y":66,"w":135,"h":85}
            },
            {
                "name": "computer keyboard",
                "confidence": 0.51,
                "boundingBox": {"x":523,"y":377,"w":185,"h":46}
            },
            {
                "name": "Laptop",
                "confidence": 0.85,
                "boundingBox": {"x":471,"y":218,"w":289,"h":226}
            },
            {
                "name": "person",
                "confidence": 0.855,
                "boundingBox": {"x":654,"y":0,"w":584,"h":473}
            }
        ]
    }
}
```

## Limitations

It's important to note the limitations of object detection so you can avoid or mitigate the effects of false negatives (missed objects) and limited detail.

* Objects are generally not detected if they're small (less than 5% of the image).
* Objects are generally not detected if they're arranged closely together (a stack of plates, for example).
* Objects are not differentiated by brand or product names (different types of sodas on a store shelf, for example). However, you can get brand information from an image by using the [Brand detection](concept-brand-detection.md) feature.

## Use the API

The object detection feature is part of the [Analyze Image](https://aka.ms/vision-4-0-ref) API. You can call this API using REST. Include `Objects` in the **features** query parameter. Then, when you get the full JSON response, parse the string for the contents of the `"objects"` section.

## Next steps

* [Call the Analyze Image API](./how-to/call-analyze-image-40.md)

