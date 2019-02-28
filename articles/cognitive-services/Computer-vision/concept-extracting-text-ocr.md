---
title: Extracting text with optical character recognition (OCR) - Computer Vision
titleSuffix: Azure Cognitive Services
description: Concepts related to extracting text with optical character recognition (OCR) using the Computer Vision API.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 02/11/2019
ms.author: pafarley
ms.custom: seodec18
---

# Extract text with optical character recognition

Computer Vision's optical character recognition (OCR) feature detects text content in an image and converts the identified text into a machine-readable character stream. You can use the result for many purposes such as search, medical records, security, and banking. 

OCR supports 25 languages: Arabic, Chinese Simplified, Chinese Traditional, Czech, Danish, Dutch, English, Finnish, French, German, Greek, Hungarian, Italian, Japanese, Korean, Norwegian, Polish, Portuguese, Romanian, Russian, Serbian (Cyrillic and Latin), Slovak, Spanish, Swedish, and Turkish. OCR automatically detects the language of the detected text.

If necessary, OCR corrects the rotation of the recognized text by returning the rotational offset in degrees about the horizontal image axis. OCR also provides the frame coordinates of each word as seen in the following illustration.

![A diagram depicting an image being rotated and its text being read and delineated](./Images/vision-overview-ocr.png)

## Image requirements

Computer Vision can extract text using OCR from images that meet the following requirements:

* The image must be presented in JPEG, PNG, GIF, or BMP format
* The size of the input image must be between 50 x 50 and 4200 x 4200 pixels
* The text in the image can be rotated by any multiple of 90 degrees plus a small angle of up to 40 degrees.

## Improving OCR accuracy

The accuracy of text recognition depends on the quality of the image. An inaccurate reading may be caused by the following:

* Blurry images.
* Handwritten or cursive text.
* Artistic font styles.
* Small text size.
* Complex backgrounds, shadows, or glare over text or perspective distortion.
* Oversized or missing capital letters at the beginnings of words
* Subscript, superscript, or strikethrough text.

### OCR limitations

On images where text is dominant, false positives may come from partially recognized words. On some images, especially photos without any text, precision can vary a lot depending on the type of image.

## Next steps

See the [OCR reference documentation](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fc) to learn more.
