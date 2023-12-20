---
title: Smart-cropped thumbnails - Image Analysis 4.0
titleSuffix: Azure AI services
description: Concepts related to generating thumbnails for images using the Image Analysis 4.0 API.
#services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.topic: conceptual
ms.date: 01/24/2023
ms.author: pafarley
ms.custom: seodec18, ignite-2022
---

# Smart-cropped thumbnails (version 4.0 preview)

A thumbnail is a reduced-size representation of an image. Thumbnails are used to represent images and other data in a more economical, layout-friendly way. The Azure AI Vision API uses smart cropping to create intuitive image thumbnails that include the most important regions of an image with priority given to any detected faces.

The Azure AI Vision smart-cropping utility takes one or more aspect ratios in the range [0.75, 1.80] and returns the bounding box coordinates (in pixels) of the region(s) identified. Your app can then crop and return the image using those coordinates.

> [!IMPORTANT]
> This feature uses face detection to help determine important regions in the image. The detection does not involve distinguishing one face from another face, predicting or classifying facial attributes, or creating a facial template (a unique set of numbers generated from an image that represents the distinctive features of a face).

## Examples

The generated bounding box can vary widely depending on what you specify for aspect ratio, as shown in the following images.

| Aspect ratio | Bounding box |
|-------|-----------|
| original | :::image type="content" source="Images/cropped-original.png" alt-text="Photo of a man with a dog at a table."::: |
| 0.75 |  :::image type="content" source="Images/cropped-075-bb.png" alt-text="Photo of a man with a dog at a table. A 0.75 ratio bounding box is drawn."::: |
| 1.00 |  :::image type="content" source="Images/cropped-1-0-bb.png" alt-text="Photo of a man with a dog at a table. A 1.00 ratio bounding box is drawn."::: |
| 1.50 |  :::image type="content" source="Images/cropped-150-bb.png" alt-text="Photo of a man with a dog at a table. A 1.50 ratio bounding box is drawn."::: |


## Use the API

The smart cropping feature is available through the [Analyze Image API](https://aka.ms/vision-4-0-ref). Include `SmartCrops` in the **features** query parameter. Also include a **smartcrops-aspect-ratios** query parameter, and set it to a decimal value for the aspect ratio you want (defined as width / height) in the range [0.75, 1.80]. Multiple aspect ratio values should be comma-separated. If no aspect ratio value is provided the API will return a crop with an aspect ratio that best preserves the image’s most important region.  

## Next steps

* [Call the Analyze Image API](./how-to/call-analyze-image-40.md)
