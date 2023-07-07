---
title: Check planogram compliance with Image Analysis
titleSuffix: Azure AI services
description: Learn how to use the Planogram Matching API to check that a retail shelf in a photo matches its planogram layout.
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.custom: build-2023
ms.topic: how-to
ms.date: 05/02/2023
ms.author: pafarley
---

# Check planogram compliance with Image Analysis

A planogram is a diagram that indicates the correct placement of retail products on shelves. The Image Analysis Planogram Matching API lets you compare analysis results from a photo to the store's planogram input. It returns an account of all the positions in the planogram, and whether a product was found in each position.

:::image type="content" source="../media/shelf/planogram.png" alt-text="Photo of a retail shelf with detected products outlined and planogram position rectangles outlined separately.":::

> [!NOTE]
> The brands shown in the images are not affiliated with Microsoft and do not indicate any form of endorsement of Microsoft or Microsoft products by the brand owners, or an endorsement of the brand owners or their products by Microsoft.

## Prerequisites
* You must have already set up and run basic [Product Understanding analysis](./shelf-analyze.md) with the Product Understanding API.
* [cURL](https://curl.haxx.se/) installed. Or, you can use a different REST platform, like Postman, Swagger, or the REST Client extension for VS Code.

## Prepare a planogram schema

You need to have your planogram data in a specific JSON format. See the sections below for field definitions.

```json
"planogram": {
  "width": 100.0,
  "height": 50.0,
  "products": [
    {
      "id": "string",
      "name": "string",
      "w": 12.34,
      "h": 123.4
    }
  ],
  "fixtures": [
    {
      "id": "string",
      "w": 2.0,
      "h": 10.0,
      "x": 0.0,
      "y": 3.0
    }
  ],
  "positions": [
    {
      "id": "string",
      "productId": "string",
      "fixtureId": "string",
      "x": 12.0,
      "y": 34.0
    }
  ]
}
```

The X and Y coordinates are relative to a top-left origin, and the width and height extend each bounding box down and to the right. The following diagram shows examples of the coordinate system.

:::image type="content" source="../media/shelf/planogram-coordinates.png" alt-text="Diagram of a shelf image with fixtures and products highlighted and their coordinates shown.":::

> [!NOTE]
> The brands shown in the images are not affiliated with Microsoft and do not indicate any form of endorsement of Microsoft or Microsoft products by the brand owners, or an endorsement of the brand owners or their products by Microsoft.

Quantities in the planogram schema are in nonspecific units. They can correspond to inches, centimeters, or any other unit of measurement. The matching algorithm calculates the relationship between the photo analysis units (pixels) and the planogram units.

### Planogram API Model

Describes the planogram for planogram matching operations.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| `width` | double | Width of the planogram. | Yes |
| `height` | double | Height of the planogram. | Yes |
| `products` | [ProductApiModel](#product-api-model) | List of products in the planogram. | Yes |
| `fixtures` | [FixtureApiModel](#fixture-api-model) | List of fixtures in the planogram. | Yes |
| `positions` | [PositionApiModel](#position-api-model)| List of positions in the planogram. | Yes |

### Product API Model

Describes a product in the planogram.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| `id` | string | ID of the product. | Yes |
| `name` | string | Name of the product. | Yes |
| `w` | double | Width of the product. | Yes |
| `h` | double | Height of the fixture. | Yes |

### Fixture API Model

Describes a fixture (shelf or similar hardware) in a planogram.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| `id` | string | ID of the fixture. | Yes |
| `w` | double | Width of the fixture. | Yes |
| `h` | double | Height of the fixture. | Yes |
| `x` | double | Left offset from the origin, in units of in inches or centimeters. | Yes |
| `y` | double | Top offset from the origin, in units of inches or centimeters. | Yes |

### Position API Model

Describes a product's position in a planogram.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| `id` | string | ID of the position. | Yes |
| `productId` | string | ID of the product. | Yes |
| `fixtureId` | string | ID of the fixture that the product is on. | Yes |
| `x` | double | Left offset from the origin, in units of in inches or centimeters. | Yes |
| `y` | double | Top offset from the origin, in units of inches or centimeters. | Yes |

## Get analysis results

Next, you need to do a [Product Understanding](./shelf-analyze.md) API call with a [custom model](./shelf-model-customization.md). 

The returned JSON text should be a `"detectedProducts"` structure. It shows all the products that were detected on the shelf, with the product-specific labels you used in the training stage.

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

## Prepare the matching request

Join the JSON content of your planogram schema with the JSON content of the analysis results, like this:

```json
"planogram": {
  "width": 100.0,
  "height": 50.0,
  "products": [
    {
      "id": "string",
      "name": "string",
      "w": 12.34,
      "h": 123.4
    }
  ],
  "fixtures": [
    {
      "id": "string",
      "w": 2.0,
      "h": 10.0,
      "x": 0.0,
      "y": 3.0
    }
  ],
  "positions": [
    {
      "id": "string",
      "productId": "string",
      "fixtureId": "string",
      "x": 12.0,
      "y": 34.0
    }
  ]
},
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

This is the text you'll use in your API request body.

## Call the planogram matching API

1. Copy the following `curl` command into a text editor.

    ```bash
    curl.exe -H "Ocp-Apim-Subscription-Key: <subscriptionKey>" -H "Content-Type: application/json" "https://<endpoint>/vision/v4.0-preview.1/operations/shelfanalysis-planogrammatching:analyze" -d "<body>"
    ```
1. Make the following changes in the command where needed:
    1. Replace the value of `<subscriptionKey>` with your Vision resource key.
    1. Replace the value of `<endpoint>` with your Vision resource endpoint. For example: `https://YourResourceName.cognitiveservices.azure.com`.
    1. Replace the value of `<body>` with the joined JSON string you prepared in the previous section. 
1. Open a command prompt window.
1. Paste your edited `curl` command from the text editor into the command prompt window, and then run the command.

## Examine the response

A successful response is returned in JSON, showing the products (or gaps) detected at each planogram position. See the sections below for field definitions.

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

### Planogram Matching Position API Model

Paired planogram position ID and corresponding detected object from product understanding result.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| `positionId` | string | The position ID from the planogram matched to the corresponding detected object. | No |
| `detectedObject` | DetectedObjectApiModel | Describes a detected object in an image. | No |

## Next steps

* [Image Analysis overview](../overview-image-analysis.md)
