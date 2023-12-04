---
title: Product Recognition - Image Analysis 4.0
titleSuffix: Azure AI services
description: Learn concepts related to the Product Recognition feature set of Image Analysis 4.0 - usage and limits.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.topic: conceptual
ms.date: 05/03/2023
ms.author: pafarley
ms.custom: references_regions, build-2023, build-2023-dataai
---

# Product Recognition (version 4.0 preview)

The Product Recognition APIs let you analyze photos of shelves in a retail store. You can detect the presence of products and get their bounding box coordinates. Use it in combination with model customization to train a model to identify your specific products. You can also compare Product Recognition results to your store's planogram document.

Try out the capabilities of Product Recognition quickly and easily in your browser using Vision Studio.

> [!div class="nextstepaction"]
> [Try Vision Studio](https://portal.vision.cognitive.azure.com/)

:::image type="content" source="media/shelf/shelf-analysis-pretrained.png" alt-text="Photo of a shelf with products and gaps outlined in rectangles.":::

> [!NOTE]
> The brands shown in the images are not affiliated with Microsoft and do not indicate any form of endorsement of Microsoft or Microsoft products by the brand owners, or an endorsement of the brand owners or their products by Microsoft.

> [!IMPORTANT]
> You can train a custom model for product recognition using either the [Custom Vision service](/azure/ai-services/custom-vision-service/overview) or the Image Analysis 4.0 Product Recognition APIs. The following table compares the two services.
>
> [!INCLUDE [custom-vision-shelf-compare](includes/custom-vision-shelf-compare.md)]


## Product Recognition features

### Shelf Image Composition

The [stitching and rectification APIs](./how-to/shelf-modify-images.md) let you modify images to improve the accuracy of the Product Understanding results. You can use these APIs to:
* Stitch together multiple images of a shelf to create a single image.
* Rectify an image to remove perspective distortion.

### Shelf Product Recognition (pretrained model)

The [Product Understanding API](./how-to/shelf-analyze.md) lets you analyze a shelf image using the out-of-box pretrained model. This operation detects products and gaps in the shelf image and returns the bounding box coordinates of each product and gap, along with a confidence score for each.

The following JSON response illustrates what the Product Understanding API returns.

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

### Shelf Product Recognition - Custom (customized model)

The Product Understanding API can also be used with a [custom trained model](./how-to/shelf-model-customization.md) to detect your specific products. This operation returns the bounding box coordinates of each product and gap, along with the label of each product.

The following JSON response illustrates what the Product Understanding API returns when used with a custom model.

```json
"detectedProducts": {
  "imageMetadata": {
    "width": 21,
    "height": 25
  },
  "products": [
    {
      "id": "01",
      "boundingBox": {
        "x": 123,
        "y": 234,
        "w": 34,
        "h": 45
      },
      "classifications": [
        {
          "confidence": 0.8,
          "label": "Product1"
        }
      ]
    }
  ],
  "gaps": [
    {
      "id": "02",
      "boundingBox": {
        "x": 12,
        "y": 123,
        "w": 1234,
        "h": 123
      },
      "classifications": [
        {
          "confidence": 0.9,
          "label": "Product1"
        }
      ]
    }
  ]
}
```

### Shelf Planogram Compliance (preview)

The [Planogram matching API](./how-to/shelf-planogram.md) lets you compare the results of the Product Understanding API to a planogram document. This operation matches each detected product and gap to its corresponding position in the planogram document.

It returns a JSON response that accounts for each position in the planogram document, whether it's occupied by a product or gap.

```json
{
  "matchedResultsPerPosition": [
    {
      "positionId": "01",
      "detectedObject": {
        "id": "01",
        "boundingBox": {
          "x": 12,
          "y": 1234,
          "w": 123,
          "h": 12345
        },
        "classifications": [
          {
            "confidence": 0.9,
            "label": "Product1"
          }
        ]
      }
    }
  ]
}
```

## Limitations

* Product Recognition is only available in the **East US** and **West US 2** Azure regions.
* Shelf images can be up to 20 MB in size. The recommended size is 4 MB.
* We recommend you do [stitching and rectification](./how-to/shelf-modify-images.md) on the shelf images before uploading them for analysis.
* Using a [custom model](./how-to/shelf-model-customization.md) is optional in Product Recognition, but it's required for the [planogram matching](./how-to/shelf-planogram.md) function.


## Next steps

Get started with Product Recognition by trying out the stitching and rectification APIs. Then do basic analysis with the Product Understanding API.
* [Prepare images for Product Recognition](./how-to/shelf-modify-images.md)
* [Analyze a shelf image](./how-to/shelf-analyze.md)
