---
title: Background removal - Image Analysis
titleSuffix: Azure AI services
description: Learn about background removal, an operation of Image Analysis
#services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.topic: conceptual
ms.date: 03/02/2023
ms.author: pafarley
ms.custom: references_regions
---

# Background removal (version 4.0 preview)

The Image Analysis service can divide images into multiple segments or regions to help the user identify different objects or parts of the image. Background removal creates an alpha matte that separates the foreground object from the background in an image.

> [!div class="nextstepaction"]
> [Call the Background removal API](./how-to/background-removal.md)

This feature provides two possible outputs based on the customer's needs:

- The foreground object of the image without the background. This edited image shows the foreground object and makes the background transparent, allowing the foreground to be placed on a new background. 
- An alpha matte that shows the opacity of the detected foreground object. This matte can be used to separate the foreground object from the background for further processing.

This service is currently in preview, and the API may change in the future.

## Background removal examples

The following example images illustrate what the Image Analysis service returns when removing the background of an image and creating an alpha matte. 


|Original image  |With background removed  |Alpha matte  |
|:---------:|:---------:|:---------:|
| :::image type="content" source="media/background-removal/building-1.png" alt-text="Photo of a city near water.":::    |  :::image type="content" source="media/background-removal/building-1-result.png" alt-text="Photo of a city near water; sky is transparent.":::       |   :::image type="content" source="media/background-removal/building-1-matte.png" alt-text="Alpha matte of a city skyline.":::      |
|   :::image type="content" source="media/background-removal/person-5.png" alt-text="Photo of a group of people using a tablet.":::  |    :::image type="content" source="media/background-removal/person-5-result.png" alt-text="Photo of a group of people using a tablet; background is transparent.":::     |   :::image type="content" source="media/background-removal/person-5-matte.png" alt-text="Alpha matte of a group of people.":::      |
|   :::image type="content" source="media/background-removal/bears.png" alt-text="Photo of a group of bears in the woods.":::  |    :::image type="content" source="media/background-removal/bears-result.png" alt-text="Photo of a group of bears; background is transparent.":::     |   :::image type="content" source="media/background-removal/bears-alpha.png" alt-text="Alpha matte of a group of bears.":::      |


## Limitations

It's important to note the limitations of background removal:

* Background removal works best for categories such as people and animals, buildings and environmental structures, furniture, vehicles, food, text and graphics, and personal belongings.
* Objects that aren't prominent in the foreground may not be identified as part of the foreground.
* Images with thin and detailed structures, like hair or fur, may show some artifacts when overlaid on backgrounds with strong contrast to the original background.
* The latency of the background removal operation will be higher, up to several seconds, for large images. We suggest you experiment with integrating both modes into your workflow to find the best usage for your needs (for instance, calling background removal on the original image versus calling foreground matting on a downsampled version of the image, then resizing the alpha matte to the original size and applying it to the original image).

## Use the API

The background removal feature is available through the [Segment](https://centraluseuap.dev.cognitive.microsoft.com/docs/services/unified-vision-apis-public-preview-2023-02-01-preview/operations/63e6b6d9217d201194bbecbd) API (`imageanalysis:segment`). You can call this API through the REST API or the Vision SDK. See the [Background removal how-to guide](./how-to/background-removal.md) for more information.

## Next steps

* [Call the background removal API](./how-to/background-removal.md)
