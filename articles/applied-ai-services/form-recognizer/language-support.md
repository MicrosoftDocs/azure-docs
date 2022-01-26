---
title: Language support - Form Recognizer
titleSuffix: Azure Applied AI Services
description: Learn more about the human languages that are available with Form Recognizer.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: overview
ms.date: 10/07/2021
ms.author: lajanuar
---

# Language support for Form Recognizer

 This table lists the written languages supported by each Form Recognizer service.

<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD024 -->

## Layout and custom model

The following lists cover the currently GA languages in the the 2.1 version and new previews in the 3.0 preview version of Form Recognizer. These languages are supported by Layout and Custom models. The preview release may include enhancements to the currently GA languages.

> [!NOTE]
> **Language code optional**
>
> Form Recognizer's deep learning based universal models extract all multi-lingual text in your documents, including text lines with mixed languages, and do not require specifying a language code. Do not provide the language code as the parameter unless you are sure about the language and want to force the service to apply only the relevant model. Otherwise, the service may return incomplete and incorrect text.

To use the preview languages in Layout and custom models, refer to the [v3.0 REST API migration guide](/rest/api/media/#changes-to-the-rest-api-endpoints) to understand the differences from the v2.1 GA API and explore the [v3.0 preview SDK quickstarts](quickstarts/try-v3-python-sdk.md) and the [preview REST API quickstart](quickstarts/try-v3-rest-api.md).

### Handwritten languages
The following table lists the handwritten languages supported by Form Recognizer's Layout and Custom model features.

|Language| Language code (optional) | Preview?  |
|:-----|:----:|:----:|
|English|`en`||
|Chinese Simplified |`zh-Hans`| preview
|French |`fr`| preview
|German |`de`| preview
|Italian|`it`| preview
|Portuguese |`pt`| preview
|Spanish |`es`| preview

### Print languages
The following table lists the print languages supported by Form Recognizer's Layout and Custom model features.

|Language| Language code (optional) | Preview? |
|:-----|:----:|:----:|
|Afrikaans|`af`||
|Albanian |`sq`||
|Asturian |`ast`| |
|Azerbaijani (Latin) | `az` | preview |
|Basque  |`eu`| |
|Belarusian (Cyrillic) | `be` | preview |
|Belarusian (Latin) | `be` | preview |
|Bislama   |`bi`| |
|Bosnian (Latin)   |`bs`| preview |
|Breton    |`br`| |
|Bulgarian |`bg`| preview |
|Buryat (Cyrillic)|`bua`| preview |
|Catalan    |`ca`| |
|Cebuano    |`ceb`| |
|Chamorro  |`ch`| |
|Chinese Simplified | `zh-Hans`| |
|Chinese Traditional | `zh-Hant`| |
|Cornish     |`kw`| |
|Corsican      |`co`| |
|Crimean Tatar (Latin)|`crh`| |
|Croatian |`hr`| preview |
|Czech | `cs` | |
|Danish | `da` | |
|Dutch | `nl` | |
|English | `en` | |
|Erzya (Cyrillic) |`myv`| preview |
|Estonian  |`et`|  |
|Faroese |`fo`| preview |
|Fijian |`fj`| |
|Filipino  |`fil`| |
|Finnish | `fi` | |
|French | `fr` | |
|Friulian  | `fur` | |
|Gagauz (Latin) |`gag`| preview |
|Galician   | `gl` | |
|German | `de` | |
|Gilbertese    | `gil` | |
|Greenlandic   | `kl` | |
|Haitian Creole  | `ht` | |
|Hani  | `hni` | |
|Hawaiian |`haw`| preview |
|Hmong Daw (Latin)| `mww` | |
|Hungarian | `hu` | |
|Icelandic |`is`| preview |
|Inari Sami |`smn`| preview |
|Indonesian   | `id` | |
|Interlingua  | `ia` | |
|Inuktitut (Latin) | `iu` | |
|Irish    | `ga` | |
|Italian | `it` | |
|Japanese | `ja` | |
|Javanese | `jv` | |
|K'iche'  | `quc` | |
|Kabuverdianu | `kea` | |
|Kachin (Latin) | `kac` | |
|Karachay-Balkar |`krc`| preview |
|Kara-Kalpak (Latin) | `kaa` | |
|Kara-Kalpak (Cyrillic) | `kaa-cyrl` | preview |
|Kashubian | `csb` | |
|Kazakh (Cyrillic) |`kk-cyrl`| preview |
|Kazakh (Latin) |`kk-latn`| preview |
|Khasi  | `kha` |  |
|Korean | `ko` | |
|Koryak |`kpy`| preview |
|Kosraean |`kos`| preview |
|Kumyk (Cyrillic) |`kum`| preview |
|Kurdish (Latin)| `ku` | |
|Kyrgyz (Cyrillic) |`ky`| preview |
|Lakota |`lkt`| preview |
|Latin|`la`| preview |
|Lithuanian|`lt`| preview |
|Lower Sorbian|`dsb`| preview |
|Lule Sami|`smj`| preview |
|Luxembourgish  | `lb` |  |
|Malay (Latin) | `ms` |  |
|Maltese|`mt`| preview |
|Manx  | `gv` |  |
|Maori|`mi`| preview |
|Mongolian (Cyrillic)|`mn`| preview |
|Montenegrin (Cyrillic)|`cnr-cyrl`| preview |
|Montenegrin (Latin)|`cnr-latn`| preview |
|Neapolitan   | `nap` | |
|Niuean|`niu`| preview |
|Nogay|`nog`| preview |
|Northern Sami (Latin)|`sme`| preview |
|Norwegian | `no` |  |
|Occitan | `oc` | |
|Ossetic|`os`| preview |
|Polish | `pl` | |
|Portuguese | `pt` | |
|Ripuarian|`ksh`| preview |
|Romanian | `ro` | preview |
|Romansh  | `rm` | |
|Russian | `ru` | preview |
|Samoan (Latin)|`sm`| preview |
|Scots  | `sco` | |
|Scottish Gaelic  | `gd` | |
|Serbian (Latin) | `sr-latn` | preview |
|Skolt Sami|`sms`| preview |
|Slovak | `sk` | preview |
|Slovenian  | `sl` | |
|Southern Sami|`sma`| preview |
|Spanish | `es` | |
|Swahili (Latin)  | `sw` | |
|Swedish | `sv` | |
|Tajik (Cyrillic)|`tg`| preview |
|Tatar (Latin)  | `tt` | |
|Tetum    | `tet` |  |
|Tongan|`to`|(preview) |
|Turkish | `tr` | |
|Turkmen (Latin)|`tk`| preview |
|Tuvan|`tyv`| preview |
|Upper Sorbian  | `hsb` | |
|Uzbek (Cyrillic)  | `uz-cyrl` |  |
|Uzbek (Latin)     | `uz` |  |
|Volapük   | `vo` | |
|Walser    | `wae` |  |
|Welsh     | `cy` | preview |
|Western Frisian | `fy` |  |
|Yucatec Maya | `yua` |  |
|Zhuang | `za` | |
|Zulu  | `zu` |  |

## Receipt and business card models

>[!NOTE]
 > It's not necessary to specify a locale. This is an optional parameter. The Form Recognizer deep-learning technology will auto-detect the language of the text in your image.

Pre-Built Receipt and Business Cards support all English receipts and business cards with the following locales:

|Language| Locale code |
|:-----|:----:|
|English (Australia)|`en-au`|
|English (Canada)|`en-ca`|
|English (United Kingdom)|`en-gb`|
|English (India|`en-in`|
|English (United States)| `en-us`|

## Invoice model

Language| Locale code |
|:-----|:----:|
|English (United States)|en-us|

## ID documents

This technology is currently available for US driver licenses and the biographical page from international passports (excluding visa and other travel documents).

## General Document

Language| Locale code |
|:-----|:----:|
|English (United States)|en-us|

