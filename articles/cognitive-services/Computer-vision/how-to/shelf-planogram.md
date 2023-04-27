---
title: tbd
titleSuffix: Azure Cognitive Services
description: tbd
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: how-to
ms.date: 04/26/2023
ms.author: pafarley
---

# Planogram tbd

A planogram is a diagram that indicates the correct placement of retail products on shelves. The Shelf Analysis Planogram Matching API lets you compare shelf analysis results from a camera feed to planogram input data. It returns the positions of the detected products relative to the planogram positions.

## Prerequisites
* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/) 
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="Create a Computer Vision resource"  target="_blank">create a Computer Vision resource </a> in the Azure portal. It must be deployed in the **East US** or **West US 2** region. After it deploys, select **Go to resource**.
  * You'll need the key and endpoint from the resource you create to connect your application to the Computer Vision service. You'll paste your key and endpoint into the code below later in the quickstart.
* An Azure Storage resource with a blob storage container. [Create one](tbd)
* [cURL](https://curl.haxx.se/) installed. Or, you can use a different REST platform, like Postman, Swagger, or the REST Client extension for VS Code.
* A set of training images. You can use our [sample image sets](tbd) or bring your own images. The maximum file size per image is 20MB.

## Prepare a planogram schema

```json
{
  "detectedProducts": {
    "imageMetadata": {
      "width": 21,
      "height": 25
    },
    "products": [
      {
        "id": "string",
        "boundingBox": {
          "x": 123,
          "y": 234,
          "w": 34,
          "h": 45
        },
        "classifications": [
          {
            "confidence": 0.8,
            "label": "string"
          }
        ]
      }
    ],
    "gaps": [
      {
        "id": "string",
        "boundingBox": {
          "x": 12,
          "y": 123,
          "w": 1234,
          "h": 123
        },
        "classifications": [
          {
            "confidence": 0.9,
            "label": "string"
          }
        ]
      }
    ]
  },
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
}
```


##### Planogram Matching Request API Model

Input to pass into the planogram matching operation.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| detectedProducts | [ProductUnderstandingResultApiModel](#product-understanding-result-api-model) |  Describes the planogram for planogram matching operations.| Yes |
| planogram | [PlanogramApiModel](#planogram-api-model) | Describes a product in the planogram. | Yes |

##### Planogram API Model

Describes the planogram for planogram matching operations.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| width | double | Width of the planogram. | Yes |
| height | double | Height of the planogram. | Yes |
| products | [ProductApiModel](#product-api-model) | List of products in the planogram. | Yes |
| fixtures | [FixtureApiModel](#fixture-api-model) | List of fixtures in the planogram. | Yes |
| positions | [PositionApiModel](#position-api-model)| List of positions in the planogram. | Yes |

##### Product API Model

Describes a product in the planogram.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string | Id of the product. | Yes |
| name | string | Name of the product. | Yes |
| w | double | Width of the product. | Yes |
| h | double | Height of the fixture. | Yes |

##### Fixture API Model

Describes a fixture in a planogram.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string | Id of the fixture. | Yes |
| w | double | Width of the fixture. | Yes |
| h | double | Height of the fixture. | Yes |
| x | double | Left offset from the origin, in unit of in inches or centimeters. | Yes |
| y | double | Top offset from the origin, in unit of in inches or centimeters. | Yes |

##### Position API Model

Describes a product position in a planogram.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string | Id of the position. | Yes |
| productId | string | Id of the product. | Yes |
| fixtureId | string | Id of the fixture that the product is on. | Yes |
| x | double | Left offset from the origin, in unit of in inches or centimeters. | Yes |
| y | double | Top offset from the origin, in unit of in inches or centimeters. | Yes |


## Analyze shelf images

To analyze a shelf image, do the following steps:

1. Copy the following `curl` command into a text editor.

    ```bash
    curl.exe -H "Ocp-Apim-Subscription-Key: <subscriptionKey>" -H "Content-Type: application/json" "https://<endpoint>/vision/v4.0-preview.1/operations/shelfanalysis-planogrammatching:analyze" -d 
    "{
      'detectedProducts': {
        'imageMetadata': {
          'width': 21,
          'height': 25
        },
        'products': [
          {
            'id': 'string',
            'boundingBox': {
              'x': 123,
              'y': 234,
              'w': 34,
              'h': 45
            },
            'classifications': [
              {
                'confidence': 0.8,
                'label': 'string'
              }
            ]
          }
        ],
        'gaps': [
          {
            'id': 'string',
            'boundingBox': {
              'x': 12,
              'y': 123,
              'w': 1234,
              'h': 123
            },
            'classifications': [
              {
                'confidence': 0.9,
                'label': 'string'
              }
            ]
          }
        ]
      },
      'planogram': {
        'width': 100.0,
        'height': 50.0,
        'products': [
          {
            'id': 'string',
            'name': 'string',
            'w': 12.34,
            'h': 123.4
          }
        ],
        'fixtures': [
          {
            'id': 'string',
            'w': 2.0,
            'h': 10.0,
            'x': 0.0,
            'y': 3.0
          }
        ],
        'positions': [
          {
            'id': 'string',
            'productId': 'string',
            'fixtureId': 'string',
            'x': 12.0,
            'y': 34.0
          }
        ]
      }
    }"
    ```
1. Make the following changes in the command where needed:
    1. Replace the value of `<subscriptionKey>` with your Computer Vision resource key.
    1. Replace the value of `<endpoint>` with your Computer Vision resource endpoint. For example: `https://YourResourceName.cognitiveservices.azure.com`.
    1. Upload your sample image to your blob storage container, and get the absolute URL. Replace `<your_url_string>`.
    1. tbd replace body with planogram
1. Open a command prompt window.
1. Paste your edited `curl` command from the text editor into the command prompt window, and then run the command.



## Examine the response

A successful response is returned in JSON. The planogram matching API results will return output following the `PlanogramMatchingResultApiModel` JSON field:

```json
{
  "matchedResultsPerPosition": [
    {
      "positionId": "string",
      "detectedObject": {
        "id": "string",
        "boundingBox": {
          "x": 12,
          "y": 1234,
          "w": 123,
          "h": 12345
        },
        "classifications": [
          {
            "confidence": 0.9,
            "label": "string"
          }
        ]
      }
    }
  ]
}
```

See the following sections for definitions of each JSON field.


##### Planogram Matching Result API Model

Results from the planogram matching operation.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| matchedResultsPerPosition | [PlanogramMatchingPositionApiModel](#planogrammatchingpositionapimodel) | The matched detected object information for each planogram position. | No |

##### Planogram Matching Position API Model

Paired planogram position ID and corresponding detected object from product understanding result.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| positionId | string | The position ID from the planogram matched to the corresponding detected object. | No |
| detectedObject | [DetectedObjectApiModel](#detected-object-api-model) | Describes a detected object in an image. | No |

## Next steps

In this guide, you learned how to make a basic shelf analysis call using the pre-trained Product Understanding REST API. Next, learn how to use a custom shelf analysis model to better meet your business needs.

> [!div class="nextstepaction"]
> [tbd](tbd)

* [Image Analysis overview](../overview-image-analysis.md)
