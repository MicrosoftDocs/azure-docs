---
title: Extracting text with OCR - Computer Vision
titleSuffix: Azure Cognitive Services
description: Concepts related to extracting text with optical character recognition (OCR) using the Computer Vision API.
services: cognitive-services
author: PatrickFarley
manager: cgronlun

ms.service: cognitive-services
ms.component: computer-vision
ms.topic: conceptual
ms.date: 08/29/2018
ms.author: pafarley
---

# Extracting text with OCR

Optical character recognition (OCR) technology in Computer Vision detects text content in an image and extracts the identified text into a machine-readable character stream. You can use the result for search and numerous other purposes like medical records, security, and banking. It automatically detects the language. OCR saves time and provides convenience for users by allowing them to take photos of text instead of transcribing the text.

OCR supports 25 languages. These languages are: Arabic, Chinese Simplified, Chinese Traditional, Czech, Danish, Dutch, English, Finnish, French, German, Greek, Hungarian, Italian, Japanese, Korean, Norwegian, Polish, Portuguese, Romanian, Russian, Serbian (Cyrillic and Latin), Slovak, Spanish, Swedish, and Turkish.

If needed, OCR corrects the rotation of the recognized text, in degrees, around the horizontal image axis. OCR provides the frame coordinates of each word as seen in the following illustration.

![OCR Overview](./Images/vision-overview-ocr.png)

## OCR requirements

Computer Vision can extract text using OCR from images that meet the following requirements:

* The image must be presented in JPEG, PNG, GIF, or BMP format
* The size of the input image must be between 50 x 50 and 4200 x 4200 pixels


The input image can be rotated by any multiple of 90 degrees plus a small angle of up to 40 degrees.

## Improving OCR accuracy

The accuracy of text recognition depends on the quality of the image. An inaccurate reading may be caused by the following situations:

* Blurry images.
* Handwritten or cursive text.
* Artistic font styles.
* Small text size.
* Complex backgrounds, shadows, or glare over text or perspective distortion.
* Oversized or missing capital letters at the beginnings of words
* Subscript, superscript, or strikethrough text.

### OCR limitations

On photographs where text is dominant, false positives may come from partially recognized words. On some photographs, especially photos without any text, precision can vary a lot depending on the type of image.

## Next steps

Learn concepts about [recognizing printed and handwritten text](concept-recognizing-text.md).
