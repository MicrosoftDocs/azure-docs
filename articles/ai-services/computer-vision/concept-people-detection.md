---
title: People detection - Azure AI Vision
titleSuffix: Azure AI services
description: Learn concepts related to the people detection feature of the Azure AI Vision API - usage and limits.
#services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 09/12/2022
ms.author: pafarley
---

# People detection (version 4.0 preview)

Version 4.0 of Image Analysis offers the ability to detect people appearing in images. The bounding box coordinates of each detected person are returned, along with a confidence score. 

> [!IMPORTANT]
> We built this model by enhancing our object detection model for person detection scenarios. People detection does not involve distinguishing one face from another face, predicting or classifying facial attributes, or creating a facial template (a unique set of numbers generated from an image that represents the distinctive features of a face).

## People detection example

The following JSON response illustrates what the Analysis 4.0 API returns when describing the example image based on its visual features.

![Photo of four people.](./Images/family_photo.png)

```json
{
  "modelVersion": "2023-02-01-preview",
  "metadata": {
    "width": 300,
    "height": 231
  },
  "peopleResult": {
    "values": [
      {
        "boundingBox": {
          "x": 0,
          "y": 41,
          "w": 95,
          "h": 189
        },
        "confidence": 0.9474349617958069
      },
      {
        "boundingBox": {
          "x": 204,
          "y": 96,
          "w": 95,
          "h": 134
        },
        "confidence": 0.9470965266227722
      },
      {
        "boundingBox": {
          "x": 53,
          "y": 20,
          "w": 136,
          "h": 210
        },
        "confidence": 0.8943784832954407
      },
      {
        "boundingBox": {
          "x": 170,
          "y": 31,
          "w": 91,
          "h": 199
        },
        "confidence": 0.2713555097579956
      }
    ]
  }
}
```

## Use the API

The people detection feature is part of the [Image Analysis 4.0 API](https://aka.ms/vision-4-0-ref). Include `People` in the **features** query parameter. Then, when you get the full JSON response, parse the string for the contents of the `"people"` section.

## Next steps

* [Call the Analyze Image API](./how-to/call-analyze-image-40.md)
