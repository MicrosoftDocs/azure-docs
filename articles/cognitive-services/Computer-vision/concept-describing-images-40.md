---
title: Image captions - Image Analysis 4.0
titleSuffix: Azure Cognitive Services
description: Concepts related to the image captioning feature of the Image Analysis 4.0 API.
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

# Image caption generation (version 4.0 preview)

Computer Vision can analyze an image and generate a human-readable phrase that describes its contents.

At this time, English is the only supported language for image captioning.

Try out the image captioning features quickly and easily in your browser using Vision Studio.

> [!div class="nextstepaction"]
> [Try Vision Studio](https://portal.vision.cognitive.azure.com/)

## Image caption example

The following JSON response illustrates what the Analysis 4.0 API returns when describing the example image based on its visual features.

![Photo of a man pointing at a screen](./Media/quickstarts/presentation.png)

```json
"captions": [
    {
        "text": "a man pointing at a screen",
        "confidence": 0.4891590476036072
    }
]
```

## Use the API

> [!IMPORTANT]
> Image captioning in Image Analysis 4.0 is only available in the following geographic regions: East US, France Central, Korea Central, North Europe, Southeast Asia, West Europe, West US. You need to create a resource in one of these regions in order to use the feature.
>
> If you need to use a Computer Vision resource outside these regions and want to perform image captioning, please use [Image Analysis 3.2](concept-describing-images.md) which is available in all Computer Vision regions.  

The image captioning feature is part of the [Analyze Image](https://aka.ms/vision-4-0-ref) API. Include `Caption` in the **features** query parameter. Then, when you get the full JSON response, parse the string for the contents of the `"caption"` section.

* [Quickstart: Image Analysis REST API or client libraries](./quickstarts-sdk/image-analysis-client-library-40.md?pivots=programming-language-csharp)

## Next steps

Learn the related concepts of [tagging images](concept-tagging-images-40.md).
