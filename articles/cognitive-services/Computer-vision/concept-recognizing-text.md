---
title: Recognize printed, handwritten text - Computer Vision
titleSuffix: Azure Cognitive Services
description: Concepts related to recognizing printed and handwritten text in images using the Computer Vision API.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 08/29/2018
ms.author: pafarley
ms.custom: seodec18
---

# Recognizing printed and handwritten text

Computer Vision can detect and extract printed or handwritten text from images of various objects with different surfaces and backgrounds, such as receipts, posters, business cards, letters, and whiteboards.

The text recognition feature is very similar to [optical character recognition (OCR)](concept-extracting-text-ocr.md), but unlike OCR it executes asynchronously and uses updated recognition models.

> [!NOTE]
> This technology is currently in preview and is only available for English text.

## Text recognition requirements

Computer Vision can recognize printed and handwritten text in images that meet the following requirements:

- The image must be presented in JPEG, PNG, or BMP format
- The file size of the image must be less than 4 megabytes (MB)
- The dimensions of the image must be between 50 x 50 and 4200 x 4200 pixels

## Next steps

See the [Recognize text reference documentation](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/587f2c6a154055056008f200) to learn more.