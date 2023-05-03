---
title: Shelf Analysis - Image Analysis 4.0
titleSuffix: Azure Cognitive Services
description: Learn concepts related to Shelf Analysis feature set of Image Analysis 4.0 - usage and limits.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 05/03/2023
ms.author: pafarley
---

# Shelf Analysis (version 4.0 preview)

The Shelf Analysis APIs let you analyze photos of shelves in a retail store. You can detect the presence of products and get their bounding box coordinates. Use it in combination with model customization to train a model to identify your specific products. You can also compare Shelf Analysis results to your store's planogram document.

Try out the capabilities of Shelf Analysis quickly and easily in your browser using Vision Studio. TbD

> [!div class="nextstepaction"]
> [Try Vision Studio](https://portal.vision.cognitive.azure.com/)

:::image type="content" source="media/shelf/shelf-analysis-pretrained.png" alt-text="Photo of a shelf with products and gaps outlined in rectangles.":::

## Shelf Analysis example

The following JSON response illustrates what the Product Understanding API returns when detecting products on a store shelf using the pre-trained model.

```json
{
  "imageMetadata": {
    "width": 2000,
    "height": 1500
  },
  "products": [
    {
      "id": "string",
      "boundingBox": {
        "x": 1234,
        "y": 1234,
        "w": 12,
        "h": 12
      },
      "classifications": [
        {
          "confidence": 0.9,
          "label": "string"
        }
      ]
    }
  ],
  "gaps": [
    {
      "id": "string",
      "boundingBox": {
        "x": 1234,
        "y": 1234,
        "w": 123,
        "h": 123
      },
      "classifications": [
        {
          "confidence": 0.8,
          "label": "string"
        }
      ]
    }
  ]
}
```

## Limitations

* Shelf Analysis is only available in the **East US** and **West US 2** Azure regions.
* Shelf images can be up to 20MB in size. The recommended size is 4MB.
* We recommend you do [stitching and rectification](./how-to/shelf-modify-images.md) on the shelf images before uploading them for analysis.
* Using a [custom model](./how-to/shelf-model-customization.md) is optional in Shelf Analysis, but it's required for the [planogram matching](./how-to/shelf-planogram.md) function.



## Next steps

Get started with Shelf Analysis by trying out the stitching and rectification APIs. Then do basic analysis with the Product Understanding API.
* [Prepare images for Shelf Analysis](./how-to/shelf-modify-images.md)
* [Analyze a shelf image](./how-to/shelf-analyze.md)

