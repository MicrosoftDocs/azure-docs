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

Computer Vision's OCR APIs support several languages. Read can extract text from images and documents with mixed languages, including same text line without requiring a language parameter. See the [Optical Character Recognition (OCR) overview](overview-ocr.md) for more information.

> [!NOTE]
> **Optional Language parameter**
>
> The Read API uses universal script models to extract all multi-lingual text in your images or documents, including mixed langauge text lines. Do not provide the language parameter unless you are sure that there is only one language in the image or document. Otherwise, the service may return incomplete and incorrect text.

See [How to specify the model version](./Vision-API-How-to-Topics/call-read-api.md#determine-how-to-process-the-data-optional) to use the preview languages. The preview model includes any enhancements to the currently GA languages.

### Handwritten text
|Language| Language code (optional) | Read |
|:-----|:----:|:-----|
|English|`en`|✅ |
|Chinese Simplified |`zh-Hans`|✅ (preview) |
|French|`fr`|✅ (preview)|
|German |`de`|✅ (preview) |
|Italian|`it`|✅ (preview) |
|Portuguese |`pt`|✅ (preview) |
|Spanish |`es`|✅ (preview) |

### Print text
|Language| Language code (optional) | Read | OCR |
|:-----|:----:|:-----|:---:|
|Afrikaans|`af`|✅ | |
|Albanian |`sq`|✅ | |
|Arabic | `ar`|  | ✅ |
|Asturian |`ast`|✅ | |
|Azerbaijani (Latin) | `az` | ✅ (preview) | |
|Basque  |`eu`| ✅ | |
|Belarusian (Cyrillic) | `be` |✅ (preview) | |
|Belarusian (Latin) | `be` |✅ (preview) | |
|Bislama   |`bi`|✅ | |
|Bosnian (Latin)   |`bs`|✅ (preview) | |
|Breton    |`br`|✅ | |
|Bulgarian |`bg`|✅ (preview) | |
|Buryat (Cyrillic)|`bua`|✅ (preview) | |
|Catalan    |`ca`|✅ | |
|Cebuano    |`ceb`|✅ | |
|Chamorro  |`ch`|✅| |
|Chinese Simplified | `zh-Hans`|✅ |✅ |
|Chinese Traditional | `zh-Hant`|✅ |✅ |
|Cornish     |`kw`|✅ | |
|Corsican      |`co`|✅ | |
|Crimean Tatar (Latin)|`crh`| ✅ | |
|Croatian |`hr`|✅ (preview) | |
|Czech | `cs` |✅ | ✅ |
|Danish | `da` |✅ | ✅ |
|Dutch | `nl` |✅ |✅ |
|English | `en` |✅ |✅|
|Erzya (Cyrillic) |`myv`|✅ (preview) | |
|Estonian  |`et`|✅ | |
|Faroese |`fo`|✅ (preview) | |
|Fijian |`fj`|✅ | |
|Filipino  |`fil`|✅ | |
|Finnish | `fi` |✅ |✅ |
|French | `fr` |✅ |✅ |
|Friulian  | `fur` |✅ | |
|Gagauz (Latin) |`gag`|✅ (preview) | |
|Galician   | `gl` |✅ | |
|German | `de` |✅ |✅ |
|Gilbertese    | `gil` |✅ | |
|Greek | `el` | |✅ |
|Greenlandic   | `kl` |✅ | |
|Haitian Creole  | `ht` |✅ | |
|Hani  | `hni` |✅ | |
|Hawaiian |`haw`|✅ (preview) | |
|Hmong Daw (Latin)| `mww` | ✅ | |
|Hungarian | `hu` | ✅ |✅ |
|Icelandic |`is`|✅ (preview) | |
|Inari Sami |`smn`|✅ (preview) | |
|Indonesian   | `id` |✅ | |
|Interlingua  | `ia` |✅ | |
|Inuktitut (Latin) | `iu` | ✅ | |
|Irish    | `ga` |✅ | |
|Italian | `it` |✅ |✅ |
|Japanese | `ja` |✅ |✅ |
|Javanese | `jv` |✅ | |
|K'iche'  | `quc` |✅ | |
|Kabuverdianu | `kea` |✅ | |
|Kachin (Latin) | `kac` |✅ | |
|Kara-Kalpak (Latin) | `kaa` | ✅ | |
|Kara-Kalpak (Cyrillic) | `kaa-cyrl` | ✅ (preview) | |
|Karachay-Balkar |`krc`|✅ (preview) | |
|Kashubian | `csb` |✅ | |
|Kazakh (Cyrillic) |`kk-cyrl`|✅ (preview) | |
|Kazakh (Latin) |`kk-latn`|✅ (preview) | |
|Khasi  | `kha` | ✅ | |
|Korean | `ko` |✅ |✅ |
|Koryak |`kpy`|✅ (preview) | |
|Kosraean |`kos`|✅ (preview) | |
|Kumyk (Cyrillic) |`kum`|✅ (preview) | |
|Kurdish (Latin)| `kur` |✅ | |
|Kyrgyz (Cyrillic) |`ky`|✅ (preview) | |
|Lakota |`lkt`|✅ (preview) | |
|Latin|`la`|✅ (preview) | |
|Lithuanian|`lt`|✅ (preview) | |
|Lower Sorbian|`dsb`|✅ (preview) | |
|Lule Sami|`smj`|✅ (preview) | |
|Luxembourgish  | `lb` | ✅ | |
|Malay (Latin) | `ms` | ✅ | |
|Maltese|`mt`|✅ (preview) | |
|Manx  | `gv` | ✅ | |
|Maori|`mi`|✅ (preview) | |
|Mongolian (Cyrillic)|`mn`|✅ (preview) | |
|Montenegrin (Cyrillic)|`cnr-cyrl`|✅ (preview) | |
|Montenegrin (Latin)|`cnr-latn`|✅ (preview) | |
|Neapolitan   | `nap` | ✅ | |
|Niuean|`niu`|✅ (preview) | |
|Nogay|`nog`|✅ (preview) | |
|Northern Sami (Latin)|`sme`|✅ (preview) | |
|Norwegian | `no` | ✅ | |
|Occitan | `oc` | ✅ | |
|Ossetic|`os`|✅ (preview) | |
|Polish | `pl` | ✅ |✅ |
|Portuguese | `pt` |✅ |✅ |
|Ripuarian|`ksh`|✅ (preview) | |
|Romanian | `ro` | ✅ (preview)| ✅|
|Romansh  | `rm` | ✅ | |
|Russian | `ru` |✅ (preview) |✅ |
|Samoan (Latin)|`sm`|✅ (preview) | |
|Scots  | `sco` | ✅ | |
|Scottish Gaelic  | `gd` |✅ | |
|Serbian (Cyrillic) | `sr-cyrl` | |✅ |
|Serbian (Latin) | `sr-latn` | ✅ (preview) |✅ |
|Skolt Sami|`sms`|✅ (preview) | |
|Slovak | `sk` | ✅ (preview) |✅ |
|Slovenian  | `slv` | ✅ ||
|Southern Sami|`sma`|✅ (preview) | |
|Spanish | `es` |✅ |✅ |
|Swahili (Latin)  | `sw` |✅ | |
|Swedish | `sv` |✅ |✅ |
|Tajik (Cyrillic)|`tg`|✅ (preview) | |
|Tatar (Latin)  | `tat` | ✅ |
|Tetum    | `tet` |✅ |  |
|Tongan|`to`|✅ (preview) | |
|Turkish | `tr` |✅ | ✅ |
|Turkmen (Latin)|`tk`|✅ (preview) | |
|Tuvan|`tyv`|✅ (preview) | |
|Upper Sorbian  | `hsb` |✅ |  |
|Uzbek (Cyrillic)  | `uz-cyrl` |✅ |  |
|Uzbek (Latin)     | `uz` |✅ |  |
|Volapük   | `vo` | ✅ | |
|Walser    | `wae` | ✅ | |
|Welsh     | `cy` |✅ (preview) |  |
|Western Frisian | `fy` | ✅ | |
|Yucatec Maya | `yua` | ✅ | |
|Zhuang | `za` |✅ |  |
|Zulu  | `zu` | ✅ | |

## Image analysis

Some actions of the [Analyze - Image](https://westcentralus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-1-ga/operations/56f91f2e778daf14a499f21b) API can return results in other languages, specified with the `language` query parameter. Other actions return results in English regardless of what language is specified, and others throw an exception for unsupported languages. Actions are specified with the `visualFeatures` and `details` query parameters; see the [Overview](overview-image-analysis.md) for a list of all the actions you can do with image analysis. Languages for tagging are only available in API version 3.2 or later.

|Language | Language code | Categories | Tags | Description | Adult | Brands | Color | Faces | ImageType | Objects | Celebrities | Landmarks |
|:---|:---:|:----:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|Arabic |`ar`| | ✅| |||||| |||
|Azeri (Azerbaijani) |`az`| | ✅| |||||| |||
|Bulgarian |`bg`| | ✅| |||||| |||
|Bosnian Latin |`bs`| | ✅| |||||| |||
|Catalan |`ca`| | ✅| |||||| |||
|Czech |`cs`| | ✅| |||||| |||
|Welsh |`cy`| | ✅| |||||| |||
|Danish |`da`| | ✅| |||||| |||
|German |`de`| | ✅| |||||| |||
|Greek |`el`| | ✅| |||||| |||
|English |`en`|✅ | ✅| ✅|✅|✅|✅|✅|✅|✅|✅|✅|
|Spanish |`es`|✅ | ✅| ✅|||||| |✅|✅|
|Estonian |`et`| | ✅| |||||| |||
|Basque |`eu`| | ✅| |||||| |||
|Finnish |`fi`| | ✅| |||||| |||
|French |`fr`| | ✅| |||||| |||
|Irish |`ga`| | ✅| |||||| |||
|Galician |`gl`| | ✅| |||||| |||
|Hebrew |`he`| | ✅| |||||| |||
|Hindi |`hi`| | ✅| |||||| |||
|Croatian |`hr`| | ✅| |||||| |||
|Hungarian |`hu`| | ✅| |||||| |||
|Indonesian |`id`| | ✅| |||||| |||
|Italian |`it`| | ✅| |||||| |||
|Japanese  |`ja`|✅ | ✅| ✅|||||| |✅|✅|
|Kazakh |`kk`| | ✅| |||||| |||
|Korean |`ko`| | ✅| |||||| |||
|Lithuanian |`It`| | ✅| |||||| |||
|Latvian |`Iv`| | ✅| |||||| |||
|Macedonian |`mk`| | ✅| |||||| |||
|Malay  Malaysia |`ms`| | ✅| |||||| |||
|Norwegian (Bokmal) |`nb`| | ✅| |||||| |||
|Dutch |`nl`| | ✅| |||||| |||
|Polish |`pl`| | ✅| |||||| |||
|Dari |`prs`| | ✅| |||||| |||
| Portuguese-Brazil|`pt-BR`| | ✅| |||||| |||
| Portuguese-Portugal |`pt`/`pt-PT`|✅ | ✅| ✅|||||| |✅|✅|
|Romanian |`ro`| | ✅| |||||| |||
|Russian |`ru`| | ✅| |||||| |||
|Slovak |`sk`| | ✅| |||||| |||
|Slovenian |`sl`| | ✅| |||||| |||
|Serbian - Cyrillic RS |`sr-Cryl`| | ✅| |||||| |||
|Serbian - Latin RS |`sr-Latn`| | ✅| |||||| |||
|Swedish |`sv`| | ✅| |||||| |||
|Thai |`th`| | ✅| |||||| |||
|Turkish |`tr`| | ✅| |||||| |||
|Ukrainian |`uk`| | ✅| |||||| |||
|Vietnamese |`vi`| | ✅| |||||| |||
|Chinese Simplified |`zh`/ `zh-Hans`|✅ | ✅| ✅|||||| |✅|✅|
|Chinese Traditional |`zh-Hant`| | ✅| |||||| |||
