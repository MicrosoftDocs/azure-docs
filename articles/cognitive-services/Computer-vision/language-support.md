---
title: Language support - Computer Vision
titleSuffix: Azure Cognitive Services
description: This article provides a list of natural languages supported by Computer Vision features; OCR, Image analysis.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 04/17/2019
ms.author: pafarley
---

# Language support for Computer Vision

Some features of Computer Vision support multiple languages; any features not mentioned here only support English.

## Optical Character Recognition (OCR)

Computer Vision's OCR APIs support several languages. They do not require you to specify a language code. See [Optical Character Recognition (OCR)](concept-recognizing-text.md) for more information.

|Language| Language code | OCR API | Read v3.0 | Read v3.1 public preview |
|:-----|:----:|:-----:|:---:|:---:|
|Arabic | `ar`|✔ | | |
|Chinese (Simplified) | `zh-Hans`|✔ | |✔ |
|Chinese (Traditional) | `zh-Hant`|✔ | | |
|Czech | `cs` |✔ | | |
|Danish | `da` |✔ | | |
|Dutch | `nl` |✔ |✔ |✔ |
|English | `en` |✔ |✔ |✔ |
|Finnish | `fi` |✔ | | |
|French | `fr` |✔ |✔ |✔ |
|German | `de` |✔ |✔ |✔ |
|Greek | `el` |✔ | | |
|Hungarian | `hu` |✔ | | |
|Italian | `it` |✔ |✔ |✔ |
|Japanese | `ja` |✔ | |✔ |
|Korean | `ko` |✔ | | |
|Norwegian | `nb` |✔ | | |
|Polish | `pl` |✔ | | |
|Portuguese | `pt` |✔ |✔ |✔ |
|Romanian | `ro` |✔ | | |
|Russian | `ru` |✔ | | |
|Serbian (Cyrillic) | `sr-Cyrl` |✔ | | |
|Serbian (Latin) | `sr-Latn` |✔ | | |
|Slovak | `sk` |✔ | | |
|Spanish | `es` |✔ |✔ |✔ |
|Swedish | `sw` |✔ | | |
|Turkish | `tr` |✔ | | |

## Image analysis

Some actions of the [Analyze - Image](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fa) API can return results in other languages, specified with the `language` query parameter. Other actions return results in English regardless of what language is specified, and others throw an exception for unsupported languages. Actions are specified with the `visualFeatures` and `details` query parameters; see the [Overview](overview.md) for a list of all the actions you can do with image analysis.

|Language | Language code | Categories | Tags | Description | Adult | Brands | Color | Faces | ImageType | Objects | Celebrities | Landmarks |
|:---|:---:|:----:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|Chinese | `zh`    | ✔ | ✔| ✔|-|-|-|-|-|❌|✔|✔|
|English | `en`   | ✔ | ✔| ✔|✔|✔|✔|✔|✔|✔|✔|✔|
|Japanese | `ja`   | ✔ | ✔| ✔|-|-|-|-|-|❌|✔|✔|
|Portuguese | `pt` | ✔ | ✔| ✔|-|-|-|-|-|❌|✔|✔|
|Spanish | `es`    | ✔ | ✔| ✔|-|-|-|-|-|❌|✔|✔|

## Next steps

Get started using the Computer Vision features mentioned in this guide.

* [Analyze a local image (REST)](./quickstarts/csharp-analyze.md)
* [Extract printed text (REST)](./quickstarts/csharp-print-text.md)
