---
title: Image descriptions - Computer Vision
titleSuffix: Azure Cognitive Services
description: Concepts related to the image description feature of the Computer Vision API.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 02/11/2019
ms.author: pafarley
ms.custom: seodec18
---

# Describe images with human-readable language

Computer Vision can analyze an image and generate a human-readable sentence that describes its contents. The algorithm actually returns several descriptions based on different visual features, and each description is given a confidence score. The final output is a list of descriptions ordered from highest to lowest confidence.

## Image description example

The following JSON response illustrates what Computer Vision returns when describing the example image based on its visual features.

![A black and white picture of buildings in Manhattan](./Images/bw_buildings.png)

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

## Use the API

The image description feature is part of the [Analyze Image](https://westcentralus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2-ga/operations/56f91f2e778daf14a499f21b) API. You can call this API through a native SDK or through REST calls. Include `Description` in the **visualFeatures** query parameter. Then, when you get the full JSON response, simply parse the string for the contents of the `"description"` section.

* [Quickstart: Computer Vision REST API or client libraries](./quickstarts-sdk/client-library.md?pivots=programming-language-csharp)

## Next steps

Learn the related concepts of [tagging images](concept-tagging-images.md) and [categorizing images](concept-categorizing-images.md).
