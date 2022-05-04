---
title: Language support - Form Recognizer
titleSuffix: Azure Applied AI Services
description: Learn more about the human languages that are available with Form Recognizer.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: overview
ms.date: 04/22/2022
ms.author: lajanuar
---

# Language support for Form Recognizer

This article covers the supported languages for text and field **extraction (by feature)** and **[detection (Read only)](#detected-languages-read-api)**. Both groups are mutually exclusive.

<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD024 -->

## Read, layout, and custom form (template) model

The following lists include the currently GA languages in for the v2.1 version and the most recent v3.0 preview. These languages are supported by Read, Layout, and Custom form (template) model features.

> [!NOTE]
> **Language code optional**
>
> Form Recognizer's deep learning based universal models extract all multi-lingual text in your documents, including text lines with mixed languages, and do not require specifying a language code. Do not provide the language code as the parameter unless you are sure about the language and want to force the service to apply only the relevant model. Otherwise, the service may return incomplete and incorrect text.

To use the preview languages, refer to the [v3.0 REST API migration guide](/rest/api/media/#changes-to-the-rest-api-endpoints) to understand the differences from the v2.1 GA API and explore the [v3.0 preview SDK quickstarts](quickstarts/try-v3-python-sdk.md).

### Handwritten text (preview and GA)

The following table lists the supported languages for extracting handwritten texts.

|Language| Language code (optional) | Language| Language code (optional) |
|:-----|:----:|:-----|:----:|
|English|`en`|Japanese (preview) |`ja`|
|Chinese Simplified (preview)  |`zh-Hans`|Korean (preview)|`ko`|
|French (preview) |`fr`|Portuguese (preview)|`pt`|
|German (preview) |`de`|Spanish (preview) |`es`|
|Italian (preview) |`it`|

### Print text (preview)

This section lists the supported languages for extracting printed texts in the latest preview.

|Language| Code (optional) |Language| Code (optional) |
|:-----|:----:|:-----|:----:|
|Angika (Devanagari) | `anp`|Lakota | `lkt`
|Arabic | `ar`|Latin | `la`
|Awadhi-Hindi (Devanagari) | `awa`|Lithuanian | `lt`
|Azerbaijani (Latin) | `az`|Lower Sorbian | `dsb`
|Bagheli | `bfy`|Lule Sami | `smj`
|Belarusian (Cyrillic)  | `be`, `be-cyrl`|Mahasu Pahari (Devanagari) | `bfz`
|Belarusian (Latin) | `be`, `be-latn`|Maltese | `mt`
|Bhojpuri-Hindi (Devanagari) | `bho`|Malto (Devanagari) | `kmj`
|Bodo (Devanagari) | `brx`|Maori | `mi`
|Bosnian (Latin) | `bs`|Marathi | `mr`
|Brajbha | `bra`|Mongolian (Cyrillic)  | `mn`
|Bulgarian  | `bg`|Montenegrin (Cyrillic)  | `cnr-cyrl`
|Bundeli | `bns`|Montenegrin (Latin) | `cnr-latn`
|Buryat (Cyrillic) | `bua`|Nepali | `ne`
|Chamling | `rab`|Niuean | `niu`
|Chhattisgarhi (Devanagari)| `hne`|Nogay | `nog`
|Croatian | `hr`|Northern Sami (Latin) | `sme`
|Dari | `prs`|Ossetic  | `os`
|Dhimal (Devanagari) | `dhi`|Pashto | `ps`
|Dogri (Devanagari) | `doi`|Persian | `fa`
|Erzya (Cyrillic) | `myv`|Punjabi (Arabic) | `pa`
|Faroese | `fo`|Ripuarian | `ksh`
|Gagauz (Latin) | `gag`|Romanian | `ro`
|Gondi (Devanagari) | `gon`|Russian | `ru`
|Gurung (Devanagari) | `gvr`|Sadri  (Devanagari) | `sck`
|Halbi (Devanagari) | `hlb`|Samoan (Latin) | `sm`
|Haryanvi | `bgc`|Sanskrit (Devanagari) | `sa`
|Hawaiian | `haw`|Santali(Devanagiri) | `sat`
|Hindi | `hi`|Serbian (Latin) | `sr`, `sr-latn`
|Ho(Devanagiri) | `hoc`|Sherpa (Devanagari) | `xsr`
|Icelandic | `is`|Sirmauri (Devanagari) | `srx`
|Inari Sami | `smn`|Skolt Sami | `sms`
|Jaunsari (Devanagari) | `Jns`|Slovak | `sk`
|Kangri (Devanagari) | `xnr`|Somali (Arabic) | `so`
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
|Kurukh (Devanagari) | `kru`|Welsh | `cy`
|Kyrgyz (Cyrillic)  | `ky`

### Print text (GA)

This section lists the supported languages for extracting printed texts in the latest GA version.

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

## Custom neural model

Language| Locale code |
|:-----|:----:|
|English (United States)|en-us|

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
|Spanish (preview) | es |

## ID documents

This technology is currently available for US driver licenses and the biographical page from international passports (excluding visa and other travel documents).

## General Document

Language| Locale code |
|:-----|:----:|
|English (United States)|en-us|

## Detected languages: Read API

The [Read API](concept-read.md) supports detecting the following languages in your documents. This list may include languages not currently supported for text extraction.

> [!NOTE]
> **Language detection**
>
> Form Recognizer read model can _detect_ possible presence of languages and returns language codes for detected languages. To determine if text can also be 
> extracted for a given language, see previous sections.


| Language            | Code |
|---------------------|---------------|
| Afrikaans           | `af`          |
| Albanian            | `sq`          |
| Amharic             | `am`          |
| Arabic              | `ar`          |
| Armenian            | `hy`          |
| Assamese            | `as`          |
| Azerbaijani         | `az`          |
| Basque              | `eu`          |
| Belarusian          | `be`          |
| Bengali             | `bn`          |
| Bosnian             | `bs`          |
| Bulgarian           | `bg`          |
| Burmese             | `my`          |
| Catalan             | `ca`          |
| Central Khmer       | `km`          |
| Chinese             | `zh`          |
| Chinese Simplified  | `zh_chs`      |
| Chinese Traditional | `zh_cht`      |
| Corsican            | `co`          |
| Croatian            | `hr`          |
| Czech               | `cs`          |
| Danish              | `da`          |
| Dari                | `prs`         |
| Divehi              | `dv`          |
| Dutch               | `nl`          |
| English             | `en`          |
| Esperanto           | `eo`          |
| Estonian            | `et`          |
| Fijian              | `fj`          |
| Finnish             | `fi`          |
| French              | `fr`          |
| Galician            | `gl`          |
| Georgian            | `ka`          |
| German              | `de`          |
| Greek               | `el`          |
| Gujarati            | `gu`          |
| Haitian             | `ht`          |
| Hausa               | `ha`          |
| Hebrew              | `he`          |
| Hindi               | `hi`          |
| Hmong Daw           | `mww`         |
| Hungarian           | `hu`          |
| Icelandic           | `is`          |
| Igbo                | `ig`          |
| Indonesian          | `id`          |
| Inuktitut           | `iu`          |
| Irish               | `ga`          |
| Italian             | `it`          |
| Japanese            | `ja`          |
| Javanese            | `jv`          |
| Kannada             | `kn`          |
| Kazakh              | `kk`          |
| Kinyarwanda         | `rw`          |
| Kirghiz             | `ky`          |
| Korean              | `ko`          |
| Kurdish             | `ku`          |
| Lao                 | `lo`          |
| Latin               | `la`          |
| Latvian             | `lv`          |
| Lithuanian          | `lt`          |
| Luxembourgish       | `lb`          |
| Macedonian          | `mk`          |
| Malagasy            | `mg`          |
| Malay               | `ms`          |
| Malayalam           | `ml`          |
| Maltese             | `mt`          |
| Maori               | `mi`          |
| Marathi             | `mr`          |
| Mongolian           | `mn`          |
| Nepali              | `ne`          |
| Norwegian           | `no`          |
| Norwegian Nynorsk   | `nn`          |
| Oriya               | `or`          |
| Pasht               | `ps`          |
| Persian             | `fa`          |
| Polish              | `pl`          |
| Portuguese          | `pt`          |
| Punjabi             | `pa`          |
| Queretaro Otomi     | `otq`         |
| Romanian            | `ro`          |
| Russian             | `ru`          |
| Samoan              | `sm`          |
| Serbian             | `sr`          |
| Shona               | `sn`          |
| Sindhi              | `sd`          |
| Sinhala             | `si`          |
| Slovak              | `sk`          |
| Slovenian           | `sl`          |
| Somali              | `so`          |
| Spanish             | `es`          |
| Sundanese           | `su`          |
| Swahili             | `sw`          |
| Swedish             | `sv`          |
| Tagalog             | `tl`          |
| Tahitian            | `ty`          |
| Tajik               | `tg`          |
| Tamil               | `ta`          |
| Tatar               | `tt`          |
| Telugu              | `te`          |
| Thai                | `th`          |
| Tibetan             | `bo`          |
| Tigrinya            | `ti`          |
| Tongan              | `to`          |
| Turkish             | `tr`          |
| Turkmen             | `tk`          |
| Ukrainian           | `uk`          |
| Urdu                | `ur`          |
| Uzbek               | `uz`          |
| Vietnamese          | `vi`          |
| Welsh               | `cy`          |
| Xhosa               | `xh`          |
| Yiddish             | `yi`          |
| Yoruba              | `yo`          |
| Yucatec Maya        | `yua`         |
| Zulu                | `zu`          |
