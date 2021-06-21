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

Computer Vision's OCR APIs support several languages. They do not require you to specify a language code. See the [Optical Character Recognition (OCR) overview](overview-ocr.md) for more information.

|Language| Language code | Read 3.2 | OCR API | Read 3.0/3.1 |
|:-----|:----:|:-----:|:---:|:---:|
|Afrikaans|`af`|✔ | | |
|Albanian |`sq`|✔ | | |
|Arabic | `ar`|  | ✔ | |
|Asturian |`ast`|✔ | | |
|Basque  |`eu`| ✔ | | |
|Bislama   |`bi`|✔ | | |
|Breton    |`br`|✔ | | |
|Catalan    |`ca`|✔ | | |
|Cebuano    |`ceb`|✔ | | |
|Chamorro  |`ch`|✔| | |
|Chinese Simplified | `zh-Hans`|✔ |✔ | |
|Chinese Traditional | `zh-Hant`|✔ |✔ | |
|Cornish     |`kw`|✔ | | |
|Corsican      |`co`|✔ | | |
|Crimean Tatar Latin  |`crh`| ✔ | | |
|Czech | `cs` |✔ | ✔ | |
|Danish | `da` |✔ | ✔ | |
|Dutch | `nl` |✔ |✔ |✔ |
|English (incl. handwritten) | `en` |✔ |✔ (print only)|✔ |
|Estonian  |`et`|✔ | | |
|Fijian |`fj`|✔ | | |
|Filipino  |`fil`|✔ | | |
|Finnish | `fi` |✔ |✔ | |
|French | `fr` |✔ |✔ |✔ |
|Friulian  | `fur` |✔ | | |
|Galician   | `gl` |✔ | | |
|German | `de` |✔ |✔ |✔ |
|Gilbertese    | `gil` |✔ | | |
|Greek | `el` | |✔ | |
|Greenlandic   | `kl` |✔ | | |
|Haitian Creole  | `ht` |✔ | | |
|Hani  | `hni` |✔ | | |
|Hmong Daw Latin | `mww` | ✔ | | |
|Hungarian | `hu` | ✔ |✔ | |
|Indonesian   | `id` |✔ | | |
|Interlingua  | `ia` |✔ | | |
|Inuktitut Latin  | `iu` | ✔ | | |
|Irish    | `ga` |✔ | | |
|Italian | `it` |✔ |✔ |✔ |
|Japanese | `ja` |✔ |✔ | |
|Javanese | `jv` |✔ | | |
|K'iche'  | `quc` |✔ | | |
|Kabuverdianu | `kea` |✔ | | |
|Kachin Latin | `kac` |✔ | | |
|Kara-Kalpak | `kaa` | ✔ | | |
|Kashubian | `csb` |✔ | | |
|Khasi  | `kha` | ✔ | | |
|Korean | `ko` |✔ |✔ | |
|Kurdish Latin | `kur` |✔ | | |
|Luxembourgish  | `lb` | ✔ | | |
|Malay Latin  | `ms` | ✔ | | |
|Manx  | `gv` | ✔ | | |
|Neapolitan   | `nap` | ✔ | | |
|Norwegian | `nb` | | ✔ | |
|Norwegian | `no` | ✔ | | |
|Occitan | `oc` | ✔ | | |
|Polish | `pl` | ✔ |✔ | |
|Portuguese | `pt` |✔ |✔ |✔ |
|Romanian | `ro` | | ✔ | |
|Romansh  | `rm` | ✔ | | |
|Russian | `ru` | |✔ | |
|Scots  | `sco` | ✔ | | |
|Scottish Gaelic  | `gd` |✔ | | |
|Serbian Cyrillic | `sr-Cyrl` | |✔ | |
|Serbian Latin | `sr-Latn` | |✔ | |
|Slovak | `sk` | |✔ | |
|Slovenian  | `slv` | ✔ || |
|Spanish | `es` |✔ |✔ |✔ |
|Swahili Latin  | `sw` |✔ | | |
|Swedish | `sv` |✔ |✔ | |
|Tatar Latin  | `tat` | ✔ | | |
|Tetum    | `tet` |✔ |  | |
|Turkish | `tr` |✔ | ✔ | |
|Upper Sorbian  | `hsb` |✔ |  | |
|Uzbek Latin     | `uz` |✔ |  | |
|Volapük   | `vo` | ✔ | | |
|Walser    | `wae` | ✔ | | |
|Western Frisian | `fy` | ✔ | | |
|Yucatec Maya | `yua` | ✔ | | |
|Zhuang | `za` |✔ |  | |
|Zulu  | `zu` | ✔ | | |

## Image analysis

Some actions of the [Analyze - Image](https://westcentralus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-1-ga/operations/56f91f2e778daf14a499f21b) API can return results in other languages, specified with the `language` query parameter. Other actions return results in English regardless of what language is specified, and others throw an exception for unsupported languages. Actions are specified with the `visualFeatures` and `details` query parameters; see the [Overview](overview-image-analysis.md) for a list of all the actions you can do with image analysis.

|Language | Language code | Categories | Tags | Description | Adult | Brands | Color | Faces | ImageType | Objects | Celebrities | Landmarks |
|:---|:---:|:----:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|Chinese | `zh`    | ✔ | ✔| ✔|-|-|-|-|-|❌|✔|✔|
|English | `en`   | ✔ | ✔| ✔|✔|✔|✔|✔|✔|✔|✔|✔|
|Japanese | `ja`   | ✔ | ✔| ✔|-|-|-|-|-|❌|✔|✔|
|Portuguese | `pt` | ✔ | ✔| ✔|-|-|-|-|-|❌|✔|✔|
|Spanish | `es`    | ✔ | ✔| ✔|-|-|-|-|-|❌|✔|✔|
