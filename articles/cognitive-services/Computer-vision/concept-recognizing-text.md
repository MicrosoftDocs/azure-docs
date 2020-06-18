---
title: Printed, handwritten text recognition - Computer Vision
titleSuffix: Azure Cognitive Services
description: Concepts related to recognizing printed and handwritten text in images using the Computer Vision API.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 04/17/2019
ms.author: pafarley
ms.custom: seodec18
---

# Recognize printed and handwritten text

Computer Vision provides a number of services that detect and extract printed or handwritten text that appears in images. This is useful in a variety of scenarios such as note taking, medical records, security, and banking. The following three sections detail three different text recognition APIs, each optimized for different use cases.

## Read API

The Read API detects text content in an image using our latest recognition models and converts the identified text into a machine-readable character stream. It's optimized for text-heavy images (such as documents that have been digitally scanned) and for images with a lot of visual noise. It will determine which recognition model to use for each line of text, supporting images with both printed and handwritten text. The Read API executes asynchronously because larger documents can take several minutes to return a result.

The Read operation maintains the original line groupings of recognized words in its output. Each line comes with bounding box coordinates, and each word within the line also has its own coordinates. If a word was recognized with low confidence, that information is conveyed as well. See the [Read API v2.0 reference docs](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/2afb498089f74080d7ef85eb) or [Read API v3.0 reference docs](https://aka.ms/computer-vision-v3-ref) to learn more.

The Read operation can recognize text in English, Spanish, German, French, Italian, Portuguese, and Dutch.

### Image requirements

The Read API works with images that meet the following requirements:

- The image must be presented in JPEG, PNG, BMP, PDF, or TIFF format.
- The dimensions of the image must be between 50 x 50 and 10000 x 10000 pixels. PDF pages must be 17 x 17 inches or smaller.
- The file size of the image must be less than 20 megabytes (MB).

### Limitations

If you are using a free-tier subscription, the Read API will only process the first two pages of a PDF or TIFF document. With a paid subscription, it will process up to 200 pages. Also note that the API will detect a maximum of 300 lines per page.

## OCR (optical character recognition) API

Computer Vision's optical character recognition (OCR) API is similar to the Read API, but it executes synchronously and is not optimized for large documents. It uses an earlier recognition model but works with more languages; see [Language support](language-support.md#text-recognition) for a full list of the supported languages.

If necessary, OCR corrects the rotation of the recognized text by returning the rotational offset in degrees about the horizontal image axis. OCR also provides the frame coordinates of each word, as seen in the following illustration.

![An image being rotated and its text being read and delineated](./Images/vision-overview-ocr.png)

See the [OCR reference docs](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fc) to learn more.

### Image requirements

The OCR API works on images that meet the following requirements:

* The image must be presented in JPEG, PNG, GIF, or BMP format.
* The size of the input image must be between 50 x 50 and 4200 x 4200 pixels.
* The text in the image can be rotated by any multiple of 90 degrees plus a small angle of up to 40 degrees.

### Limitations

On photographs where text is dominant, false positives may come from partially recognized words. On some photographs, especially photos without any text, precision can vary depending on the type of image.

## Recognize Text API

> [!NOTE]
> The Recognize Text API is being deprecated in favor of the Read API. The Read API has similar capabilities and is updated to handle PDF, TIFF, and multi-page files.

The Recognize Text API is similar to OCR, but it executes asynchronously and uses updated recognition models. See the [Recognize Text API reference docs](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/587f2c6a154055056008f200) to learn more.

### Image requirements

The Recognize Text API works with images that meet the following requirements:

- The image must be presented in JPEG, PNG, or BMP format.
- The dimensions of the image must be between 50 x 50 and 4200 x 4200 pixels.
- The file size of the image must be less than 4 megabytes (MB).

## Limitations

The accuracy of text recognition operations depends on the quality of the images. The following factors may cause an inaccurate reading:

* Blurry images.
* Handwritten or cursive text.
* Artistic font styles.
* Small text size.
* Complex backgrounds, shadows, or glare over text or perspective distortion.
* Oversized or missing capital letters at the beginnings of words.
* Subscript, superscript, or strikethrough text.

## Next steps

Follow the [Extract text (Read)](./QuickStarts/CSharp-hand-text.md) quickstart to implement text recognition in a simple C# app.
