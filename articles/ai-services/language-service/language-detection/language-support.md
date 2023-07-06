---
title: Language Detection language support
titleSuffix: Azure AI services
description: This article explains which natural languages are supported by the Language Detection API.
services: cognitive-services
author: jboback
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: jboback
ms.custom: language-service-language-detection, ignite-fall-2021
---

# Language support for Language Detection

Use this article to learn which natural languages are supported by Language Detection.


> [!NOTE]
> Languages are added as new [model versions](how-to/call-api.md#specify-the-language-detection-model) are released. The current model version for Language Detection is `2022-10-01`.

The Language Detection feature can detect a wide range of languages, variants, dialects, and some regional/cultural languages, and return detected languages with their name and code. The returned language code parameters conform to [BCP-47](https://tools.ietf.org/html/bcp47) standard with most of them conforming to [ISO-639-1](https://www.iso.org/iso-639-language-codes.html) identifiers. 

If you have content expressed in a less frequently used language, you can try Language Detection to see if it returns a code. The response for languages that cannot be detected is `unknown`.

## Languages supported by Language Detection

| Language            | Language Code | Starting with model version: |
|---------------------|---------------|------------------------------|
| Afrikaans           | `af`          |                              |
| Albanian            | `sq`          |                              |
| Amharic             | `am`          | 2021-01-05                   |
| Arabic              | `ar`          |                              |
| Armenian            | `hy`          |                              |
| Assamese            | `as`          | 2021-01-05                   |
| Azerbaijani         | `az`          | 2021-01-05                   |
| Bashkir             | `ba`          | 2022-10-01                   |
| Basque              | `eu`          |                              |
| Belarusian          | `be`          |                              |
| Bengali             | `bn`          |                              |
| Bosnian             | `bs`          | 2020-09-01                   |
| Bulgarian           | `bg`          |                              |
| Burmese             | `my`          |                              |
| Catalan             | `ca`          |                              |
| Central Khmer       | `km`          |                              |
| Chinese             | `zh`          |                              |
| Chinese Simplified  | `zh_chs`      |                              |
| Chinese Traditional | `zh_cht`      |                              |
| Chuvash             | `cv`          | 2022-10-01                   |
| Corsican            | `co`          | 2021-01-05                   |
| Croatian            | `hr`          |                              |
| Czech               | `cs`          |                              |
| Danish              | `da`          |                              |
| Dari                | `prs`         | 2020-09-01                   |
| Divehi              | `dv`          |                              |
| Dutch               | `nl`          |                              |
| English             | `en`          |                              |
| Esperanto           | `eo`          |                              |
| Estonian            | `et`          |                              |
| Faroese             | `fo`          | 2022-10-01                   |
| Fijian              | `fj`          | 2020-09-01                   |
| Finnish             | `fi`          |                              |
| French              | `fr`          |                              |
| Galician            | `gl`          |                              |
| Georgian            | `ka`          |                              |
| German              | `de`          |                              |
| Greek               | `el`          |                              |
| Gujarati            | `gu`          |                              |
| Haitian             | `ht`          |                              |
| Hausa               | `ha`          | 2021-01-05                   |
| Hebrew              | `he`          |                              |
| Hindi               | `hi`          |                              |
| Hmong Daw           | `mww`         | 2020-09-01                   |
| Hungarian           | `hu`          |                              |
| Icelandic           | `is`          |                              |
| Igbo                | `ig`          | 2021-01-05                   |
| Indonesian          | `id`          |                              |
| Inuktitut           | `iu`          |                              |
| Irish               | `ga`          |                              |
| Italian             | `it`          |                              |
| Japanese            | `ja`          |                              |
| Javanese            | `jv`          | 2021-01-05                   |
| Kannada             | `kn`          |                              |
| Kazakh              | `kk`          | 2020-09-01                   |
| Kinyarwanda         | `rw`          | 2021-01-05                   |
| Kirghiz             | `ky`          | 2022-10-01                   |
| Korean              | `ko`          |                              |
| Kurdish             | `ku`          |                              |
| Lao                 | `lo`          |                              |
| Latin               | `la`          |                              |
| Latvian             | `lv`          |                              |
| Lithuanian          | `lt`          |                              |
| Luxembourgish       | `lb`          | 2021-01-05                   |
| Macedonian          | `mk`          |                              |
| Malagasy            | `mg`          | 2020-09-01                   |
| Malay               | `ms`          |                              |
| Malayalam           | `ml`          |                              |
| Maltese             | `mt`          |                              |
| Maori               | `mi`          | 2020-09-01                   |
| Marathi             | `mr`          | 2020-09-01                   |
| Mongolian           | `mn`          | 2021-01-05                   |
| Nepali              | `ne`          | 2021-01-05                   |
| Norwegian           | `no`          |                              |
| Norwegian Nynorsk   | `nn`          |                              |
| Odia                | `or`          |                              |
| Pasht               | `ps`          |                              |
| Persian             | `fa`          |                              |
| Polish              | `pl`          |                              |
| Portuguese          | `pt`          |                              |
| Punjabi             | `pa`          |                              |
| Queretaro Otomi     | `otq`         | 2020-09-01                   |
| Romanian            | `ro`          |                              |
| Russian             | `ru`          |                              |
| Samoan              | `sm`          | 2020-09-01                   |
| Serbian             | `sr`          |                              |
| Shona               | `sn`          | 2021-01-05                   |
| Sindhi              | `sd`          | 2021-01-05                   |
| Sinhala             | `si`          |                              |
| Slovak              | `sk`          |                              |
| Slovenian           | `sl`          |                              |
| Somali              | `so`          |                              |
| Spanish             | `es`          |                              |
| Sundanese           | `su`          | 2021-01-05                   |
| Swahili             | `sw`          |                              |
| Swedish             | `sv`          |                              |
| Tagalog             | `tl`          |                              |
| Tahitian            | `ty`          | 2020-09-01                   |
| Tajik               | `tg`          | 2021-01-05                   |
| Tamil               | `ta`          |                              |
| Tatar               | `tt`          | 2021-01-05                   |
| Telugu              | `te`          |                              |
| Thai                | `th`          |                              |
| Tibetan             | `bo`          | 2021-01-05                   |
| Tigrinya            | `ti`          | 2021-01-05                   |
| Tongan              | `to`          | 2020-09-01                   |
| Turkish             | `tr`          | 2021-01-05                   |
| Turkmen             | `tk`          | 2021-01-05                   |
| Upper Sorbian       | `hsb`          | 2022-10-01                   |
| Uyghur              | `ug`          | 2022-10-01                   |
| Ukrainian           | `uk`          |                              |
| Urdu                | `ur`          |                              |
| Uzbek               | `uz`          |                              |
| Vietnamese          | `vi`          |                              |
| Welsh               | `cy`          |                              |  
| Xhosa               | `xh`          | 2021-01-05                   |
| Yiddish             | `yi`          |                              |
| Yoruba              | `yo`          | 2021-01-05                   |
| Yucatec Maya        | `yua`         |                              |  
| Zulu                | `zu`          | 2021-01-05                   |

## Romanized Indic Languages supported by Language Detection

| Language            | Language Code | Starting with model version: |
|---------------------|---------------|------------------------------|
| Assamese            | `as`          | 2022-10-01                   |
| Bengali             | `bn`          | 2022-10-01                   |
| Gujarati            | `gu`          | 2022-10-01                   |
| Hindi               | `hi`          | 2022-10-01                   |
| Kannada             | `kn`          | 2022-10-01                   |
| Malayalam           | `ml`          | 2022-10-01                   |
| Marathi             | `mr`          | 2022-10-01                   |
| Odia                | `or`          | 2022-10-01                   |
| Punjabi             | `pa`          | 2022-10-01                   |
| Tamil               | `ta`          | 2022-10-01                   |
| Telugu              | `te`          | 2022-10-01                   |
| Urdu                | `ur`          | 2022-10-01                   |

## Next steps

[Language detection overview](overview.md)
