---
title: Image descriptions - Image Analysis 4.0
titleSuffix: Azure Cognitive Services
description: Concepts related to the image description feature of the Image Analysis 4.0 API.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 01/24/2023
ms.author: pafarley
ms.custom: seodec18, ignite-2022
---

# Image description generation (version 4.0)

Computer Vision can analyze an image and generate a human-readable phrase that describes its contents. The algorithm returns several descriptions based on different visual features, and each description is given a confidence score. The final output is a list of descriptions ordered from highest to lowest confidence.

At this time, English is the only supported language for image description.

Try out the image captioning features quickly and easily in your browser using Vision Studio.

> [!div class="nextstepaction"]
> [Try Vision Studio](https://portal.vision.cognitive.azure.com/)

## Image description example

The following JSON response illustrates what the Analyze API returns when describing the example image based on its visual features.

![A black and white picture of buildings in Manhattan](./Images/bw_buildings.png)


```json
{
    "metadata":
    {
        "width": 239,
        "height": 300
    },
    "descriptionResult":
    {
        "values":
        [
            {
                "text": "a city with tall buildings",
                "confidence": 0.3551448881626129
            }
        ]
    }
}
```

## Use the API

The image description feature is part of the [Analyze Image](https://aka.ms/vision-4-0-ref) API. You can call this API using REST. Include `Description` in the **features** query parameter. Then, when you get the full JSON response, parse the string for the contents of the `"description"` section.



* [Quickstart: Image Analysis REST API or client libraries](./quickstarts-sdk/image-analysis-client-library-40.md?pivots=programming-language-csharp)

## Next steps

Learn the related concepts of [tagging images](concept-tagging-images-40.md).
