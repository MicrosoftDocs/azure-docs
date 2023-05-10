---
title: Remove the background in images
titleSuffix: Azure Cognitive Services
description: Learn how to call the Segment API to isolate and remove the background from images.
services: cognitive-services
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: how-to
ms.date: 03/03/2023
ms.custom: references_regions
---

# Remove the background from images

This article demonstrates how to call the Image Analysis 4.0 API to segment an image. It also shows you how to parse the returned information.

This guide assumes you've already [created a Computer Vision resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision) and obtained a key and endpoint URL.

> [!IMPORTANT]
> These APIs are only available in the following geographic regions: East US, France Central, Korea Central, North Europe, Southeast Asia, West Europe, West US.

## Submit data to the service

When calling the **[Segment](https://centraluseuap.dev.cognitive.microsoft.com/docs/services/unified-vision-apis-public-preview-2023-02-01-preview/operations/63e6b6d9217d201194bbecbd)** API,  you specify the image's URL by formatting the request body like this: `{"url":"https://docs.microsoft.com/azure/cognitive-services/computer-vision/images/windows-kitchen.jpg"}`.

To analyze a local image, you'd put the binary image data in the HTTP request body.

## Determine how to process the data

### Select a mode 


|URL parameter  |Value  |Description  |
|---------|---------|---------|
|`mode`     |   `backgroundRemoval`      |    Outputs an image of the detected foreground object with a transparent background.     |
|`mode`     |     `foregroundMatting`    | Outputs a grayscale alpha matte image showing the opacity of the detected foreground object.       |


A populated URL for backgroundRemoval would look like this: `https://{endpoint}/computervision/imageanalysis:segment?api-version=2023-02-01-preview&mode=backgroundRemoval`

## Get results from the service

This section shows you how to parse the results of the API call.

The service returns a `200` HTTP response, and the body contains the returned image in the form of a binary stream. The following is an example of the 4-channel PNG image response for the `backgroundRemoval` mode:

:::image type="content" source="../media/background-removal/building-1-result.png" alt-text="Photo of a city, with the background transparent.":::

The following is an example of the 1-channel PNG image response for the `foregroundMatting` mode:

:::image type="content" source="../media/background-removal/building-1-matte.png" alt-text="Alpha matte of the city photograph.":::

The API will return an image the same size as the original for the `foregroundMatting` mode, but at most 16 megapixels (preserving image aspect ratio) for the `backgroundRemoval` mode.

## Error codes

See the following list of possible errors and their causes:

- `400 - InvalidRequest`
    - `Value for mode is invalid.` Ensure you have selected exactly one of the valid options for the `mode` parameter.
    - `This operation is not enabled in this region.` Ensure that your resource is in one of the geographic regions where the API is supported.
    - `The image size is not allowed to be zero or larger than {number} bytes.` Ensure your image is within the specified size limits.
    - `The image dimension is not allowed to be smaller than {min number of pixels} and larger than {max number of pixels}`. Ensure both dimensions of the image are within the specified dimension limits.
    - `Image format is not valid.` Ensure the input data is a valid JPEG, GIF, TIFF, BMP, or PNG image.
- `500`
    - `InternalServerError.` The processing resulted in an internal error.
- `503`
    - `ServiceUnavailable.` The service is unavailable.

## Next steps

[Background removal concepts](../concept-background-removal.md)


