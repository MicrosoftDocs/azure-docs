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

# Recognize printed and handwritten text

Computer Vision provides a number of services that detect and extract printed or handwritten text that appears in images. This feature is useful in a variety of scenarios such as notetaking, medical records, security, and banking. The following sections detail three different APIs, each with their own preferable use cases.

## OCR (optical character recognition) API

Computer Vision's optical character recognition (OCR) feature detects text content in an image and converts the identified text into a machine-readable character stream. You can use the result for many purposes such as search, medical records, security, and banking. 

OCR supports 25 languages: Arabic, Chinese Simplified, Chinese Traditional, Czech, Danish, Dutch, English, Finnish, French, German, Greek, Hungarian, Italian, Japanese, Korean, Norwegian, Polish, Portuguese, Romanian, Russian, Serbian (Cyrillic and Latin), Slovak, Spanish, Swedish, and Turkish. OCR automatically detects the language of the detected text.

If necessary, OCR corrects the rotation of the recognized text by returning the rotational offset in degrees about the horizontal image axis. OCR also provides the frame coordinates of each word as seen in the following illustration.

![A diagram depicting an image being rotated and its text being read and delineated](./Images/vision-overview-ocr.png)

See the [OCR reference docs](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fc) to learn more.

### Image requirements

Computer Vision can extract text using OCR from images that meet the following requirements:

* The image must be presented in JPEG, PNG, GIF, or BMP format
* The size of the input image must be between 50 x 50 and 4200 x 4200 pixels
* The text in the image can be rotated by any multiple of 90 degrees plus a small angle of up to 40 degrees.

### Limitations

On photographs where text is dominant, false positives may come from partially recognized words. On some photographs, especially photos without any text, precision can vary a lot depending on the type of image.

## Recognize Text API

The Recognize Text API is very similar to optical character recognition, but unlike OCR it executes asynchronously and uses updated recognition models. See the [Recognize Text API reference docs](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/587f2c6a154055056008f200) to learn more.

> [!NOTE]
> This feature is currently in preview and is only available for English text.

### Requirements

The RecognizeText API works with images that meet the following requirements:

- The image must be presented in JPEG, PNG, or BMP format
- The file size of the image must be less than 4 megabytes (MB)
- The dimensions of the image must be between 50 x 50 and 4200 x 4200 pixels

## Read API

The Read API is similar to optical character recognition but is optimized for text-heavy images (such as documents that have been digitally scanned). It executes asynchronously because on larger documents it can take several minutes to return a result.

The Read operation maintains the original line groupings of recognized words in its output. Each line comes with bounding box coordinates, and each word within the line also has its own coordinates. If a word was recognized with low confidence, that information is conveyed as well. See the Read API reference docs to learn more.

> [!NOTE]
> This feature is currently in preview and is only available for English text.

## Improve results

The accuracy of text recognition operations depends on the quality of the images. An inaccurate reading may be caused by the following situations:

* Blurry images.
* Handwritten or cursive text.
* Artistic font styles.
* Small text size.
* Complex backgrounds, shadows, or glare over text or perspective distortion.
* Oversized or missing capital letters at the beginnings of words
* Subscript, superscript, or strikethrough text.


## Next steps

Follow the [Extract handwritten text](./quickstarts-sdk/csharp-hand-text-sdk.md) quickstart to implement text recognition in a simple C# app.