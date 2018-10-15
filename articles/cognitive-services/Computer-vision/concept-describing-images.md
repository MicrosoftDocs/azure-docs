---
title: Describing images - Computer Vision
titleSuffix: Azure Cognitive Services
description: Concepts related to describing images using the Computer Vision API.
services: cognitive-services
author: PatrickFarley
manager: cgronlun

ms.service: cognitive-services
ms.component: computer-vision
ms.topic: conceptual
ms.date: 08/29/2018
ms.author: pafarley
---

# Describing images

Computer Vision's algorithms analyze the content in an image. This analysis forms the foundation for a 'description' displayed as human-readable language in complete sentences. The description summarizes what is found in the image. Computer Vision's algorithms generate various descriptions based on the visual features identified in the image. Each description is evaluated and a confidence score generated. A list is then returned ordered from highest confidence score to lowest.

## Image description example

The following JSON response illustrates what Computer Vision returns when describing the example image based on its visual features.

![B&W Buildings](./Images/bw_buildings.png)

```json
{
    "description": {
        "tags": ["outdoor", "building", "photo", "city", "white", "black", "large", "sitting", "old", "water", "skyscraper", "many", "boat", "river", "group", "street", "people", "field", "tall", "bird", "standing"],
        "captions": [
            {
                "text": "a black and white photo of a city",
                "confidence": 0.95301952483304808
            },
            {
                "text": "a black and white photo of a large city",
                "confidence": 0.94085190563213816
            },
            {
                "text": "a large white building in a city",
                "confidence": 0.93108362931954824
            }
        ]
    },
    "requestId": "b20bfc83-fb25-4b8d-a3f8-b2a1f084b159",
    "metadata": {
        "height": 300,
        "width": 239,
        "format": "Jpeg"
    }
}
```

## Next steps

Learn concepts about [tagging images](concept-tagging-images.md) and [categorizing images](concept-categorizing-images.md).