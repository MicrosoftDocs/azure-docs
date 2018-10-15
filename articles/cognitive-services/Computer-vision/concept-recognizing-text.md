---
title: Recognizing printed and handwritten text - Computer Vision
titleSuffix: Azure Cognitive Services
description: Concepts related to recognizing printed and handwritten text in images using the Computer Vision API.
services: cognitive-services
author: PatrickFarley
manager: cgronlun

ms.service: cognitive-services
ms.component: computer-vision
ms.topic: conceptual
ms.date: 08/29/2018
ms.author: pafarley
---

# Recognizing printed and handwritten text

Computer Vision can detect and extract printed or handwritten text from images of various objects with different surfaces and backgrounds, such as receipts, posters, business cards, letters, and whiteboards.

Text recognition saves time and effort. You can be more productive by taking an image of text rather than transcribing it. Text recognition makes it possible to digitize notes. This digitization allows you to implement quick and easy search. It also reduces paper clutter.

## Text recognition requirements

Computer Vision can recognize printed and handwritten text in images that meet the following requirements:

- The image must be presented in JPEG, PNG, or BMP format
- The file size of the image must be less than 4 megabytes (MB)
- The dimensions of the image must be between 50 x 50 and 4200 x 4200 pixels

> [!NOTE]
> This technology is currently in preview and is only available for English text.

## Next steps

Learn concepts about [extracting text with OCR](concept-extracting-text-ocr.md).
