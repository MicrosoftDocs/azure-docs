---
title: "Quickstart: Analyze a local image - REST, cURL - Computer Vision"
titleSuffix: "Azure Cognitive Services"
description: In this quickstart, you analyze a local image using Computer Vision with cURL in Cognitive Services.
services: cognitive-services
author: noellelacharite
manager: nolachar
ms.service: cognitive-services
ms.component: computer-vision
ms.topic: quickstart
ms.date: 08/28/2018
ms.author: v-deken
---
# Quickstart: Analyze a local image - REST, cURL - Computer Vision

In this quickstart, you analyze a local image to extract visual features using Computer Vision. To analyze a remote image, see [Analyze a remote image with cURL](curl-analyze.md).

## Prerequisites

To use Computer Vision, you need a subscription key; see [Obtaining Subscription Keys](../Vision-API-How-to-Topics/HowToSubscribe.md).

## Analyze a local image

This sample is similar to [Analyze a remote image with cURL](curl-analyze.md) except the image to analyze is read locally from disk. Three changes are required:

- Change the Content-Type to `"Content-Type: application/octet-stream"`.
- Change the `-d` switch to `--data-binary`.
- Specify the image to analyze using the following syntax: `@C:/Pictures/ImageToAnalyze.jpg`.

To run the sample, do the following steps:

1. Copy the following code into an editor.
1. Replace `<Subscription Key>` with your valid subscription key.
1. Change the Request URL (`https://westcentralus.api.cognitive.microsoft.com/vision/v2.0`) to use the location where you obtained your subscription keys, if necessary.
1. Replace `<Image To Analyze>` with the local image you want to analyze.
1. Optionally, change the response language (`language=en`).
1. Open a command window on a computer with cURL installed.
1. Paste the code in the window and run the command.

>[!NOTE]
>You must use the same location in your REST call as you used to obtain your subscription keys. For example, if you obtained your subscription keys from westus, replace "westcentralus" in the URL below with "westus".

```json
curl -H "Ocp-Apim-Subscription-Key: <Subscription Key>" -H "Content-Type: application/octet-stream" "https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/analyze?visualFeatures=Categories,Description&details=Landmarks&language=en" --data-binary <Image To Analyze>
```

## Analyze Image response

A successful response is returned in JSON, for example:

```json
{
  "categories": [
    {
      "name": "outdoor_water",
      "score": 0.9921875,
      "detail": {
        "landmarks": []
      }
    }
  ],
  "description": {
    "tags": [
      "nature",
      "water",
      "waterfall",
      "outdoor",
      "rock",
      "mountain",
      "rocky",
      "grass",
      "hill",
      "covered",
      "hillside",
      "standing",
      "side",
      "group",
      "walking",
      "white",
      "man",
      "large",
      "snow",
      "grazing",
      "forest",
      "slope",
      "herd",
      "river",
      "giraffe",
      "field"
    ],
    "captions": [
      {
        "text": "a large waterfall over a rocky cliff",
        "confidence": 0.916458423253597
      }
    ]
  },
  "requestId": "b6e33879-abb2-43a0-a96e-02cb5ae0b795",
  "metadata": {
    "height": 959,
    "width": 1280,
    "format": "Jpeg"
  }
}
```

## Next steps

Explore the Computer Vision APIs used to analyze an image, detect celebrities and landmarks, create a thumbnail, and extract printed and handwritten text. To rapidly experiment with the Computer Vision APIs, try the [Open API testing console](https://westcentralus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fa/console).

> [!div class="nextstepaction"]
> [Explore Computer Vision APIs](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44)
