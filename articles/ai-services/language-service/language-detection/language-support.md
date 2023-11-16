---
title: Language Detection language support
titleSuffix: Azure AI services
description: This article explains which natural languages are supported by the Language Detection API.
services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 10/24/2023
ms.author: jboback
ms.custom: language-service-language-detection, ignite-fall-2021
---

# Language support for Language Detection

Use this article to learn which natural languages that language detection supports.

The Language Detection feature can detect a wide range of languages, variants, dialects, and some regional/cultural languages, and return detected languages with their name and code. The returned language code parameters conform to [BCP-47](https://tools.ietf.org/html/bcp47) standard with most of them conforming to [ISO-639-1](https://www.iso.org/iso-639-language-codes.html) identifiers. 

If you have content expressed in a less frequently used language, you can try Language Detection to see if it returns a code. The response for languages that can't be detected is `unknown`.

## Languages supported by Language Detection

| Language            | Language Code |
|---------------------|---------------|
| Afrikaans           | `af`          |
| Albanian            | `sq`          |
| Amharic             | `am`          |
| Arabic              | `ar`          |
| Armenian            | `hy`          |
| Assamese            | `as`          |
| Azerbaijani         | `az`          |
| Bashkir             | `ba`          |
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
| Chuvash             | `cv`          |
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
| Faroese             | `fo`          |
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
| Odia                | `or`          |
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
| Upper Sorbian       | `hsb`          |
| Uyghur              | `ug`          |
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

## Romanized Indic Languages supported by Language Detection

| Language            | Language Code |
|---------------------|---------------|
| Assamese            | `as`          |
| Bengali             | `bn`          |
| Gujarati            | `gu`          |
| Hindi               | `hi`          |
| Kannada             | `kn`          |
| Malayalam           | `ml`          |
| Marathi             | `mr`          |
| Odia                | `or`          |
| Punjabi             | `pa`          |
| Tamil               | `ta`          |
| Telugu              | `te`          |
| Urdu                | `ur`          |

## Next steps

[Language detection overview](overview.md)
