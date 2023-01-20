---
title: Smart-cropped thumbnails - Computer Vision
titleSuffix: Azure Cognitive Services
description: Concepts related to generating thumbnails for images using the Computer Vision API.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 03/11/2018
ms.author: pafarley
ms.custom: seodec18, ignite-2022
---

# Smart-cropped thumbnails

A thumbnail is a reduced-size representation of an image. Thumbnails are used to represent images and other data in a more economical, layout-friendly way. The Computer Vision API uses smart cropping to create intuitive image thumbnails that include the most important regions of an image with priority given to any detected faces.



The Computer Vision smart-cropping utility takes one or more aspect ratios in the range [0.75, 1.80] and returns the bounding box coordinates (in pixels) of the region(s) identified. Your app can then crop and return the image using those coordinates.

> [!IMPORTANT]
> This feature uses face detection to help determine important regions in the image. The detection does not involve distinguishing one face from another face, predicting or classifying facial attributes, or creating a facial template (a unique set of numbers generated from an image that represents the distinctive features of a face).


## Use the API


The smart cropping feature is available through the [Analyze](https://aka.ms/vision-4-0-ref) API. You can call this API using REST. Include `SmartCrops` in the **visualFeatures** query parameter. Also include a **smartcrops-aspect-ratios** query parameter, and set it to a decimal value for the aspect ratio you want (defined as width / height). Multiple aspect ratio values should be comma-separated.


* [Generate a thumbnail (how-to)](./how-to/generate-thumbnail.md)
