---
title: Background removal - Image Analysis
titleSuffix: Azure Cognitive Services
description: Learn about background removal, an operation of Image Analysis
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 03/02/2023
ms.author: pafarley
---

# Background removal (preview)

The Image Analysis service can divide images into multiple segments or regions. This helps the user identify different objects or parts of the image. Background removal creates an alpha matte that separates the foreground object from the background in an image.

This feature provides two possible outputs based on the customer's needs:

- The foreground object of the image without the background. This edited image shows the foreground object and makes the background transparent, allowing the foreground to be placed on a new background. 
- An alpha matte that shows the opacity of the detected foreground object. This matte can be used to separate the foreground object from the background for further processing.

This service is currently in preview, and the API may change in the future.

## Background removal examples

The following example images illustrate what the Image Analysis service returns when removing the background of an image and creating an alpha matte. 

|Original image  |With background removed  |Alpha matte  |
|---------|---------|---------|
| :::image type="content" source="media/background-removal/building1.png" alt-text="Photo of a city near water.":::    |  :::image type="content" source="media/background-removal/building1-result.png" alt-text="Photo of a city near water; sky is whited out.":::       |   :::image type="content" source="media/background-removal/building1-matte.png" alt-text="Alpha matte of a city skyline.":::      |
|   :::image type="content" source="media/background-removal/person5.png" alt-text="Photo of a group of people using a tablet.":::  |    :::image type="content" source="media/background-removal/person5-result.png" alt-text="Photo of a group of people using a tablet; background is whited out.":::     |   :::image type="content" source="media/background-removal/person5-matte.png" alt-text="Alpha matte of a group of people.":::      |


## Limitations

The background removal operations automatically identify the main foreground object to separate it from the background. This functionality works best for categories such as people, animals, buildings and environmental structures, furniture, vehicles, food, personal belongings, and text and graphics. Sometimes, in ambiguous cases, objects that are not prominent in the foreground may not be identified as part of the foreground.

The background removal operation does not use foreground estimation. Therefore, the result images may show some visual artifacts around thin and detailed structures, such as hair or fur, when overlaid against backgrounds that are very different from the original background. 

The background removal operations have noticeable latency, taking several seconds for large images. We suggest experimenting with integrating both modes into your workflow to find the best usage for your needs (for instance, calling background removal on the original image versus calling foreground matting on the downsampled image, then resizing the alpha matte to the original size and applying it to the original image).

## Use the API

The background removal and foreground matting features are available through the [Analyze Image](https://aka.ms/vision-4-0-ref) API. Call `imageanalysis:segment` with your original image in the request body.

## Next steps

* [Quickstart: Image Analysis REST API or client libraries](./quickstarts-sdk/image-analysis-client-library-40.md?pivots=programming-language-csharp)