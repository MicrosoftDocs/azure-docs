---
title: Image descriptions - Azure AI Vision
titleSuffix: Azure AI services
description: Concepts related to the image description feature of the Azure AI Vision API.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 07/04/2023
ms.author: pafarley
ms.custom: seodec18, ignite-2022
---

# Image descriptions

Azure AI Vision can analyze an image and generate a human-readable phrase that describes its contents. The algorithm returns several descriptions based on different visual features, and each description is given a confidence score. The final output is a list of descriptions ordered from highest to lowest confidence.

At this time, English is the only supported language for image description.

Try out the image captioning features quickly and easily in your browser using Vision Studio.

> [!div class="nextstepaction"]
> [Try Vision Studio](https://portal.vision.cognitive.azure.com/)

## Image description example

The following JSON response illustrates what the Analyze API returns when describing the example image based on its visual features.

![A black and white picture of buildings in Manhattan](./Images/bw_buildings.png)

```json
{
   "description":{
      "tags":[
         "outdoor",
         "city",
         "white"
      ],
      "captions":[
         {
            "text":"a city with tall buildings",
            "confidence":0.48468858003616333
         }
      ]
   },
   "requestId":"7e5e5cac-ef16-43ca-a0c4-02bd49d379e9",
   "metadata":{
      "height":300,
      "width":239,
      "format":"Png"
   },
   "modelVersion":"2021-05-01"
}
```

## Use the API

The image description feature is part of the [Analyze Image](https://westcentralus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/56f91f2e778daf14a499f21b) API. You can call this API through a native SDK or through REST calls. Include `Description` in the **visualFeatures** query parameter. Then, when you get the full JSON response, parse the string for the contents of the `"description"` section.

* [Quickstart: Image Analysis REST API or client libraries](./quickstarts-sdk/image-analysis-client-library.md?pivots=programming-language-csharp)

## Next steps

Learn the related concepts of [tagging images](concept-tagging-images.md) and [categorizing images](concept-categorizing-images.md).
