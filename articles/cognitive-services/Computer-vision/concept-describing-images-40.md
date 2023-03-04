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

# Image captions (version 4.0 preview)

Computer Vision can analyze an image and generate a human-readable phrase that describes its contents. The new Florence captioning model available in version 4.0 is greatly improved from the previous 3.2 model.

Dense captioning, a similar feature, lets you generate detailed captions for individual objects that are found in an image. It's similar to [object detection](concept-object-detection-40.md) but uses the latest Florence AI models to generate rich captions, instead of simply naming the objects. The API returns the bounding box coordinates (in pixels) for each major object (up to 10 per image), plus a caption.

At this time, English is the only supported language for captioning.

Try out the image captioning features quickly and easily in your browser using Vision Studio.

> [!div class="nextstepaction"]
> [Try Vision Studio](https://portal.vision.cognitive.azure.com/)

## Caption example

#### [Image captions](#tab/image)

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

#### [Dense captions](#tab/dense)

The following JSON response illustrates what the Analysis 4.0 API returns when generating dense captions for the example image.

![Photo of a tractor on a farm](./Images/farm.png)

```json
{
  "descriptionDense": {
    "captions": [
      {
        "text": "a woman sitting at a table with a laptop",
        "confidence": 0.5821409225463867,
        "boundingBox": {
          "x": 0,
          "y": 0,
          "w": 1038,
          "h": 672
        }
      },
      {
        "text": "a laptop on a table",
        "confidence": 0.5349870324134827,
        "boundingBox": {
          "x": 436,
          "y": 344,
          "w": 381,
          "h": 239
        }
      },
      {
        "text": "a plant in a pot",
        "confidence": 0.5180337429046631,
        "boundingBox": {
          "x": 638,
          "y": 22,
          "w": 388,
          "h": 633
        }
      },
      {
        "text": "a woman smiling with her hands together",
        "confidence": 0.46921396255493164,
        "boundingBox": {
          "x": 0,
          "y": 93,
          "w": 449,
          "h": 565
        }
      },
      {
        "text": "a potted plant on a table",
        "confidence": 0.5263017416000366,
        "boundingBox": {
          "x": 791,
          "y": 437,
          "w": 238,
          "h": 229
        }
      },
      {
        "text": "a close up of a keyboard",
        "confidence": 0.5036352872848511,
        "boundingBox": {
          "x": 363,
          "y": 572,
          "w": 225,
          "h": 65
        }
      },
      {
        "text": "a woman smiling with her hands together",
        "confidence": 0.5039903521537781,
        "boundingBox": {
          "x": 0,
          "y": 0,
          "w": 705,
          "h": 419
        }
      },
      {
        "text": "a close up of a keyboard",
        "confidence": 0.5640218257904053,
        "boundingBox": {
          "x": 529,
          "y": 492,
          "w": 144,
          "h": 80
        }
      },
      {
        "text": "a woman sitting at a desk with her hands together",
        "confidence": 0.5284122824668884,
        "boundingBox": {
          "x": 0,
          "y": 56,
          "w": 894,
          "h": 593
        }
      },
      {
        "text": "a woman smiling with earrings",
        "confidence": 0.31606525182724,
        "boundingBox": {
          "x": 171,
          "y": 97,
          "w": 214,
          "h": 224
        }
      }
    ]
  },
  "metadata": {
    "height": 672,
    "width": 1038,
    "format": "Png"
  },
  "modelVersion": "2021-05-01"
}
```

---

## Use the API

#### [Image captions](#tab/image)

> [!IMPORTANT]
> Image captioning in Image Analysis 4.0 is only available in the following geographic regions: East US, France Central, Korea Central, North Europe, Southeast Asia, West Europe, West US. You need to create a resource in one of these regions in order to use the feature.
>
> If you need to use a Computer Vision resource outside these regions and want to perform image captioning, please use [Image Analysis 3.2](concept-describing-images.md) which is available in all Computer Vision regions.  

The image captioning feature is part of the [Analyze Image](https://aka.ms/vision-4-0-ref) API. Include `Caption` in the **features** query parameter. Then, when you get the full JSON response, parse the string for the contents of the `"captionResult"` section.

#### [Dense captions](#tab/dense)

The dense captioning feature is part of the [Analyze Image](https://aka.ms/vision-4-0-ref) API. You can call this API using REST. Include `denseCaptions` in the **features** query parameter. Then, when you get the full JSON response, parse the string for the contents of the `"denseCaptionsResult"` section.

---

## Next steps

* Learn the related concept of [object detection](concept-object-detection-40.md).
* [Quickstart: Image Analysis REST API or client libraries](./quickstarts-sdk/image-analysis-client-library-40.md?pivots=programming-language-csharp)