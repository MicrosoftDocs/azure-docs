---
title: Analyze a shelf image using pretrained models
titleSuffix: Azure AI services
description: Use the Product Understanding API to analyze a shelf image and receive rich product data.
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: how-to
ms.date: 04/26/2023
ms.author: pafarley
ms.custom: references_regions, build-2023, build-2023-dataai
---

# Analyze a shelf image using pretrained models

The fastest way to start using Product Recognition is to use the built-in pretrained AI models. With the Product Understanding API, you can upload a shelf image and get the locations of products and gaps.

:::image type="content" source="../media/shelf/shelf-analysis-pretrained.png" alt-text="Photo of a retail shelf with products and gaps highlighted with rectangles.":::

> [!NOTE]
> The brands shown in the images are not affiliated with Microsoft and do not indicate any form of endorsement of Microsoft or Microsoft products by the brand owners, or an endorsement of the brand owners or their products by Microsoft.

## Prerequisites
* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/) 
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="create a Vision resource"  target="_blank">create a Vision resource</a> in the Azure portal. It must be deployed in the **East US** or **West US 2** region. After it deploys, select **Go to resource**.
  * You'll need the key and endpoint from the resource you create to connect your application to the Azure AI Vision service. You'll paste your key and endpoint into the code below later in the guide.
* An Azure Storage resource with a blob storage container. [Create one](/azure/storage/common/storage-account-create?tabs=azure-portal)
* [cURL](https://curl.haxx.se/) installed. Or, you can use a different REST platform, like Postman, Swagger, or the REST Client extension for VS Code.
* A shelf image. You can download our [sample image](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/ComputerVision/shelf-analysis/shelf.png) or bring your own images. The maximum file size per image is 20 MB.

## Analyze shelf images

To analyze a shelf image, do the following steps:

1. Upload the images you'd like to analyze to your blob storage container, and get the absolute URL.
1. Copy the following `curl` command into a text editor.

    ```bash
    curl.exe -H "Ocp-Apim-Subscription-Key: <subscriptionKey>" -H "Content-Type: application/json" "https://<endpoint>/vision/v4.0-preview.1/operations/shelfanalysis-productunderstanding:analyze" -d "{
        'url':'<your_url_string>'
    }"
    ```
1. Make the following changes in the command where needed:
    1. Replace the value of `<subscriptionKey>` with your Vision resource key.
    1. Replace the value of `<endpoint>` with your Vision resource endpoint. For example: `https://YourResourceName.cognitiveservices.azure.com`.
    1. Replace the `<your_url_string>` contents with the blob URL of the image
1. Open a command prompt window.
1. Paste your edited `curl` command from the text editor into the command prompt window, and then run the command.


## Examine the response

A successful response is returned in JSON. The product understanding API results are returned in a `ProductUnderstandingResultApiModel` JSON field:

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

See the following sections for definitions of each JSON field.

### Product Understanding Result API model

Results from the product understanding operation.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| `imageMetadata` | [ImageMetadataApiModel](#image-metadata-api-model) | The image metadata information such as height, width and format. | Yes |
| `products` |[DetectedObjectApiModel](#detected-object-api-model) | Products detected in the image. | Yes |
| `gaps` | [DetectedObjectApiModel](#detected-object-api-model) | Gaps detected in the image. | Yes |

### Image Metadata API model

The image metadata information such as height, width and format.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| `width` | integer | The width of the image in pixels. | Yes |
| `height` | integer | The height of the image in pixels. | Yes |

### Detected Object API model

Describes a detected object in an image.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| `id` | string | ID of the detected object. | No |
| `boundingBox` | [BoundingBoxApiModel](#bounding-box-api-model) | A bounding box for an area inside an image. | Yes |
| `classifications` | [ImageClassificationApiModel](#image-classification-api-model) | Classification confidences of the detected object. | Yes |

### Bounding Box API model

A bounding box for an area inside an image.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| `x` | integer | Left-coordinate of the top left point of the area, in pixels. | Yes |
| `y` | integer | Top-coordinate of the top left point of the area, in pixels. | Yes |
| `w` | integer | Width measured from the top-left point of the area, in pixels. | Yes |
| `h` | integer | Height measured from the top-left point of the area, in pixels. | Yes |

### Image Classification API model

Describes the image classification confidence of a label.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| `confidence` | float | Confidence of the classification prediction. | Yes |
| `label` | string | Label of the classification prediction. | Yes |

## Next steps

In this guide, you learned how to make a basic analysis call using the pretrained Product Understanding REST API. Next, learn how to use a custom Product Recognition model to better meet your business needs.

> [!div class="nextstepaction"]
> [Train a custom model for Product Recognition](../how-to/shelf-model-customization.md)

* [Image Analysis overview](../overview-image-analysis.md)
