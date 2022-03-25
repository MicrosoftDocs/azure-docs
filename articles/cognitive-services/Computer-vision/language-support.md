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
ms.date: 02/04/2022
ms.author: pafarley
---

# Language support for Computer Vision

Some capabilities of Computer Vision support multiple languages; any capabilities not mentioned here only support English.

## Optical Character Recognition (OCR)

The Computer Vision OCR APIs support many languages. Read can extract text from images and documents with mixed languages, including from the same text line, without requiring a language parameter. See the [Optical Character Recognition (OCR) overview](overview-ocr.md) for more information.

> [!NOTE]
> **Language code optional**
>
> Read OCR's deep-learning-based universal models extract all multi-lingual text in your documents, including text lines with mixed languages, and do not require specifying a language code. Do not provide the language code as the parameter unless you are sure about the language and want to force the service to apply only the relevant model. Otherwise, the service may return incomplete and incorrect text.

See [How to specify the model version](./Vision-API-How-to-Topics/call-read-api.md#determine-how-to-process-the-data-optional) to use the new languages.

### Handwritten languages

The following table lists the languages supported by Read for handwritten text.

|Language| Language code (optional) | Language| Language code (optional) |
|:-----|:----:|:-----|:----:|
|English|`en`|Japanese (preview) |`ja`|
|Chinese Simplified (preview)  |`zh-Hans`|Korean (preview)|`ko`|
|French (preview) |`fr`|Portuguese (preview)|`pt`|
|German (preview) |`de`|Spanish (preview) |`es`|
|Italian (preview) |`it`|

### Print languages (preview)

This section lists the supported languages in the latest preview.

|Language| Code (optional) |Language| Code (optional) |
|:-----|:----:|:-----|:----:|
|Angika (Devanagiri) | `anp`|Lakota | `lkt`
|Arabic | `ar`|Latin | `la`
|Awadhi-Hindi (Devanagiri) | `awa`|Lithuanian | `lt`
|Azerbaijani (Latin) | `az`|Lower Sorbian | `dsb`
|Bagheli | `bfy`|Lule Sami | `smj`
|Belarusian (Cyrillic)  | `be`, `be-cyrl`|Mahasu Pahari (Devanagiri) | `bfz`
|Belarusian (Latin) | `be`, `be-latn`|Maltese | `mt`
|Bhojpuri-Hindi (Devanagiri) | `bho`|Malto (Devanagiri) | `kmj`
|Bodo (Devanagiri) | `brx`|Maori | `mi`
|Bosnian (Latin) | `bs`|Marathi | `mr`
|Brajbha | `bra`|Mongolian (Cyrillic)  | `mn`
|Bulgarian  | `bg`|Montenegrin (Cyrillic)  | `cnr-cyrl`
|Bundeli | `bns`|Montenegrin (Latin) | `cnr-latn`
|Buryat (Cyrillic) | `bua`|Nepali | `ne`
|Chamling | `rab`|Niuean | `niu`
|Chhattisgarhi (Devanagiri)| `hne`|Nogay | `nog`
|Croatian | `hr`|Northern Sami (Latin) | `sme`
|Dari | `prs`|Ossetic  | `os`
|Dhimal (Devanagiri) | `dhi`|Pashto | `ps`
|Dogri (Devanagiri) | `doi`|Persian | `fa`
|Erzya (Cyrillic) | `myv`|Punjabi (Arabic) | `pa`
|Faroese | `fo`|Ripuarian | `ksh`
|Gagauz (Latin) | `gag`|Romanian | `ro`
|Gondi (Devanagiri) | `gon`|Russian | `ru`
|Gurung (Devanagiri) | `gvr`|Sadri  (Devanagiri) | `sck`
|Halbi (Devanagiri) | `hlb`|Samoan (Latin) | `sm`
|Haryanvi | `bgc`|Sanskrit (Devanagari) | `sa`
|Hawaiian | `haw`|Santali(Devanagiri) | `sat`
|Hindi | `hi`|Serbian (Latin) | `sr`, `sr-latn`
|Ho(Devanagiri) | `hoc`|Sherpa (Devanagiri) | `xsr`
|Icelandic | `is`|Sirmauri (Devanagiri) | `srx`
|Inari Sami | `smn`|Skolt Sami | `sms`
|Jaunsari (Devanagiri) | `Jns`|Slovak | `sk`
|Kangri (Devanagiri) | `xnr`|Somali (Arabic) | `so`
|Karachay-Balkar  | `krc`|Southern Sami | `sma`
|Kara-Kalpak (Cyrillic) | `kaa-cyrl`|Tajik (Cyrillic)  | `tg`
|Kazakh (Cyrillic)  | `kk-cyrl`|Thangmi | `thf`
|Kazakh (Latin) | `kk-latn`|Tongan | `to`
|Khaling | `klr`|Turkmen (Latin) | `tk`
|Korku | `kfq`|Tuvan | `tyv`
|Koryak | `kpy`|Urdu  | `ur`
|Kosraean | `kos`|Uyghur (Arabic) | `ug`
|Kumyk (Cyrillic) | `kum`|Uzbek (Arabic) | `uz-arab`
|Kurdish (Arabic) | `ku-arab`|Uzbek (Cyrillic)  | `uz-cyrl`
|Kurukh (Devanagiri) | `kru`|Welsh | `cy`
|Kyrgyz (Cyrillic)  | `ky`

### Print languages (GA)

This section lists the supported languages in the latest GA version.

|Language| Code (optional) |Language| Code (optional) |
|:-----|:----:|:-----|:----:|
|Afrikaans|`af`|Japanese | `ja` |
|Albanian |`sq`|Javanese | `jv` |
|Asturian |`ast`|K'iche'  | `quc` |
|Basque  |`eu`|Kabuverdianu | `kea` |
|Bislama   |`bi`|Kachin (Latin) | `kac` |
|Breton    |`br`|Kara-Kalpak (Latin) | `kaa` |
|Catalan    |`ca`|Kashubian | `csb` |
|Cebuano    |`ceb`|Khasi  | `kha` |
|Chamorro  |`ch`|Korean | `ko` |
|Chinese Simplified | `zh-Hans`|Kurdish (Latin) | `ku-latn`
|Chinese Traditional | `zh-Hant`|Luxembourgish  | `lb` |
|Cornish     |`kw`|Malay (Latin) | `ms` |
|Corsican      |`co`|Manx  | `gv` |
|Crimean Tatar (Latin)|`crh`|Neapolitan   | `nap` |
|Czech | `cs` |Norwegian | `no` |
|Danish | `da` |Occitan | `oc` |
|Dutch | `nl` |Polish | `pl` |
|English | `en` |Portuguese | `pt` |
|Estonian  |`et`|Romansh  | `rm` |
|Fijian |`fj`|Scots  | `sco` |
|Filipino  |`fil`|Scottish Gaelic  | `gd` |
|Finnish | `fi` |Slovenian  | `sl` |
|French | `fr` |Spanish | `es` |
|Friulian  | `fur` |Swahili (Latin)  | `sw` |
|Galician   | `gl` |Swedish | `sv` |
|German | `de` |Tatar (Latin)  | `tt` |
|Gilbertese    | `gil` |Tetum    | `tet` |
|Greenlandic   | `kl` |Turkish | `tr` |
|Haitian Creole  | `ht` |Upper Sorbian  | `hsb` |
|Hani  | `hni` |Uzbek (Latin)     | `uz` |
|Hmong Daw (Latin)| `mww` |Volapük   | `vo` |
|Hungarian | `hu` |Walser    | `wae` |
|Indonesian   | `id` |Western Frisian | `fy` |
|Interlingua  | `ia` |Yucatec Maya | `yua` |
|Inuktitut (Latin) | `iu` |Zhuang | `za` |
|Irish    | `ga` |Zulu  | `zu` |
|Italian | `it` |

## Image analysis

Some features of the [Analyze - Image](https://westcentralus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-1-ga/operations/56f91f2e778daf14a499f21b) API can return results in other languages, specified with the `language` query parameter. Other actions return results in English regardless of what language is specified, and others throw an exception for unsupported languages. Actions are specified with the `visualFeatures` and `details` query parameters; see the [Overview](overview-image-analysis.md) for a list of all the actions you can do with image analysis. Languages for tagging are only available in API version 3.2 or later.

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
