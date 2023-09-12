---
title: Prepare images for Product Recognition
titleSuffix: Azure AI services
description: Use the stitching and rectification APIs to prepare organic photos of retail shelves for accurate image analysis.
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-vision
ms.topic: how-to
ms.date: 07/10/2023
ms.author: ginle
ms.custom: references_regions, build-2023
---

# Shelf Image Composition (preview)

Part of the Product Recognition workflow involves fixing and modifying the input images so the service can perform correctly. 

This guide shows you how to use the **Stitching API** to combine multiple images of the same physical shelf: this gives you a composite image of the entire retail shelf, even if it's only viewed partially by multiple different cameras.

This guide also shows you how to use the **Rectification API** to correct for perspective distortion when you stitch together different images.

## Prerequisites
* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/) 
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="create a Vision resource"  target="_blank">create a Vision resource</a> in the Azure portal. It must be deployed in the **East US** or **West US 2** region. After it deploys, select **Go to resource**.
  * You'll need the key and endpoint from the resource you create to connect your application to the Azure AI Vision service. You'll paste your key and endpoint into the code below later in the quickstart.
* An Azure Storage resource with a blob storage container. [Create one](/azure/storage/common/storage-account-create?tabs=azure-portal)
* [cURL](https://curl.haxx.se/) installed. Or, you can use a different REST platform, like Postman, Swagger, or the REST Client extension for VS Code.
* A set of photos that show adjacent parts of the same shelf. A 50% overlap between images is recommended. You can download and use the sample "unstitched" images from [GitHub](https://github.com/Azure-Samples/cognitive-services-sample-data-files/tree/master/ComputerVision/shelf-analysis).


## Use the Stitching API

The Stitching API combines multiple images of the same physical shelf.

:::image type="content" source="../media/shelf/image-stitching.png" alt-text="Three photos of shelves, next to their combined composite photo.":::

> [!NOTE]
> The brands shown in the images are not affiliated with Microsoft and do not indicate any form of endorsement of Microsoft or Microsoft products by the brand owners, or an endorsement of the brand owners or their products by Microsoft.

To run the image stitching operation on a set of images, follow these steps:

1. Upload the images you'd like to stitch together to your blob storage container, and get the absolute URL for each image. You can stitch up to 10 images at once.
1. Copy the following `curl` command into a text editor.

    ```bash
    curl.exe -H "Ocp-Apim-Subscription-Key: <subscriptionKey>" -H "Content-Type: application/json" "https://<endpoint>/computervision/imagecomposition:stitch?api-version=2023-04-01-preview" --output <your_filename> -d "{
        'images': [
            {
            'url':'<your_url_string>'
            },
            {
            'url':'<your_url_string_2>'
            },
            ...
        ]
    }"
    ```
1. Make the following changes in the command where needed:
    1. Replace the value of `<subscriptionKey>` with your Vision resource key.
    1. Replace the value of `<endpoint>` with your Vision resource endpoint. For example: `https://YourResourceName.cognitiveservices.azure.com`.
    1. Replace the `<your_url_string>` contents with the blob URLs of the images. The images should be ordered left to right and top to bottom, according to the physical spaces they show.
    1. Replace `<your_filename>` with the name and extension of the file where you'd like to get the result (for example, `download.jpg`).
1. Open a command prompt window.
1. Paste your edited `curl` command from the text editor into the command prompt window, and then run the command.

## Examine the stitching response

The API returns a `200` response, and the new file is downloaded to the location you specified.

## Use the Rectification API

After you complete the stitching operation, we recommend you do the rectification operation for optimal analysis results. 

:::image type="content" source="../media/shelf/rectification.png" alt-text="Photos of a retail shelf, before and after the rectify operation.":::

> [!NOTE]
> The brands shown in the images are not affiliated with Microsoft and do not indicate any form of endorsement of Microsoft or Microsoft products by the brand owners, or an endorsement of the brand owners or their products by Microsoft.

To correct the perspective distortion in the composite image, follow these steps:

1. Upload the image you'd like to rectify to your blob storage container, and get the absolute URL.
1. Copy the following `curl` command into a text editor.

    ```bash
    curl.exe -H "Ocp-Apim-Subscription-Key: <subscriptionKey>" -H "Content-Type: application/json" "https://<endpoint>/computervision/imagecomposition:rectify?api-version=2023-04-01-preview" --output <your_filename> -d "{
      'url': '<your_url_string>',
      'controlPoints': {
        'topLeft': {
          'x': 0.1,
          'y': 0.1
        },
        'topRight': {
          'x': 0.2,
          'y': 0.2
        },
        'bottomLeft': {
          'x': 0.3,
          'y': 0.3
        },
        'bottomRight': {
          'x': 0.4,
          'y': 0.4
        }
      }
    }"
    ```
1. Make the following changes in the command where needed:
    1. Replace the value of `<subscriptionKey>` with your Vision resource key.
    1. Replace the value of `<endpoint>` with your Vision resource endpoint. For example: `https://YourResourceName.cognitiveservices.azure.com`.
    1. Replace `<your_url_string>` with the blob storage URL of the image.
    1. Replace the four control point coordinates in the request body. X is the horizontal coordinate and Y is vertical. The coordinates are normalized, so 0.5,0.5 indicates the center of the image, and 1,1 indicates the bottom right corner, for example. Set the coordinates to define the four corners of the shelf fixture as it appears in the image.
    
       :::image type="content" source="../media/shelf/rectify.png" alt-text="Photo of a shelf with its four corners outlined.":::

       > [!NOTE]
       > The brands shown in the images are not affiliated with Microsoft and do not indicate any form of endorsement of Microsoft or Microsoft products by the brand owners, or an endorsement of the brand owners or their products by Microsoft.

    1. Replace `<your_filename>` with the name and extension of the file where you'd like to get the result (for example, `download.jpg`).
1. Open a command prompt window.
1. Paste your edited `curl` command from the text editor into the command prompt window, and then run the command.


## Examine the rectification response

The API returns a `200` response, and the new file is downloaded to the location you specified.

## Next steps

In this guide, you learned how to prepare shelf photos for analysis. Next, call the Product Understanding API to get analysis results.

> [!div class="nextstepaction"]
> [Analyze a shelf image](./shelf-analyze.md)

* [Image Analysis overview](../overview-image-analysis.md)
