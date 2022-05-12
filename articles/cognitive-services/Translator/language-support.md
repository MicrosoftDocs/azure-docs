---
title: Language support - Translator
titleSuffix: Azure Cognitive Services
description: Cognitive Services Translator supports the following languages for text to text translation using Neural Machine Translation (NMT).
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: reference
ms.date: 05/24/2022
ms.author: lajanuar
---
# Translator language support

**Translation - Cloud:** Cloud translation is available in all languages for the Translate operation of Text Translation and for Document Translation.

**Translation – Containers:** Language support for Containers.

**Custom Translator:** Custom Translator can be used to create customized translation models that you can then use to customize your translated output while using the Text Translation or Document Translation features.

**Auto Language Detection:** Automatically detect the language of the source text while using Text Translation or Document Translation.

**Dictionary:** Use the [Dictionary Lookup](reference/v3-0-dictionary-lookup.md) or [Dictionary Examples](reference/v3-0-dictionary-examples.md) operations from the Text Translation feature to display alternative translations from or to English and examples of words in context.

## Translation

> [!NOTE]
> Language code `pt` will default to `pt-br`, Portuguese (Brazil).
>
> ☼ Indicates the language is not available for scanned PDF document translation.

|Language | Language code | ☼ Cloud – Text Translation and Document Translation | Containers – Text Translation|Custom Translator|Auto Language Detection|Dictionary
|:-|:-:|:-:|:-:|:-:|:-:|:-:|
| Afrikaans  | `af` |✔|✔|✔|✔|✔|
| Albanian | `sq` |✔|✔||✔||
| Amharic ☼ | `am` |✔|✔||||
| Arabic | `ar` |✔|✔|✔|✔|✔|
| Armenian ☼ | `hy` |✔|✔||✔||
| Assamese ☼ | `as` |✔|✔|✔|||
| Azerbaijani (Latin) | `az` |✔|✔||||
| Bangla ☼ | `bn` |✔|✔|✔||✔|
| Bashkir ☼ | `ba` |✔|||||
| Basque | `eu` |✔|||||
| Bosnian (Latin) | `bs` |✔|✔|✔||✔|
| Bulgarian | `bg` |✔|✔|✔|✔|✔|
| Cantonese (Traditional) ☼ | `yue` |✔|✔||||
| Catalan | `ca` |✔|✔|✔|✔|✔|
| Chinese (Literary) | `lzh` |✔|||||
| Chinese Simplified | `zh-Hans` |✔|✔|✔|✔|✔|
| Chinese Traditional | `zh-Hant` |✔|✔|✔|✔||
| Croatian | `hr` |✔|✔|✔|✔|✔|
| Czech | `cs` |✔|✔|✔|✔|✔|
| Danish | `da` |✔|✔|✔|✔|✔|
| Dari | `prs` |✔|✔||||
| Divehi ☼ | `dv` |✔|||✔||
| Dutch | `nl` |✔|✔|✔|✔|✔|
| English | `en` |✔|✔|✔|✔|✔|
| Estonian | `et` |✔|✔|✔|✔||
| Faroese | `fo` |✔|||||
| Fijian | `fj` |✔|✔|✔|||
| Filipino | `fil` |✔|✔|✔|||
| Finnish | `fi` |✔|✔|✔|✔|✔|
| French | `fr` |✔|✔|✔|✔|✔|
| French (Canada) | `fr-ca` |✔|✔||||
| Galician | `gl` |✔|||||
| Georgian ☼ | `ka` |✔|||✔||
| German | `de` |✔|✔|✔|✔|✔|
| Greek ☼ | `el` |✔|✔|✔|✔|✔|
| Gujarati ☼ | `gu` |✔|✔|✔|✔||
| Haitian Creole | `ht` |✔|✔||✔|✔|
| Hebrew ☼ | `he` |✔|✔|✔|✔|✔|
| Hindi | `hi` |✔|✔|✔|✔|✔|
| Hmong Daw (Latin) | `mww` |✔|✔|||✔|
| Hungarian | `hu` |✔|✔|✔|✔|✔|
| Icelandic | `is` |✔|✔|✔|✔|✔|
| Indonesian | `id` |✔|✔|✔|✔|✔|
| Inuinnaqtun ☼ | `ikt` |✔|||||
| Inuktitut ☼ | `iu` |✔|✔|✔|✔||
| Inuktitut (Latin) | `iu-Latn` |✔|||||
| Irish | `ga` |✔|✔|✔|✔||
| Italian | `it` |✔|✔|✔|✔|✔|
| Japanese | `ja` |✔|✔|✔|✔|✔|
| Kannada ☼ | `kn` |✔|✔|✔|||
| Kazakh | `kk` |✔|✔||||
| Khmer ☼ | `km` |✔|✔||✔||
| Klingon | `tlh-Latn` |✔| ||✔|✔|
| Klingon (plqaD) ☼ | `tlh-Piqd` |✔| ||✔||
| Korean | `ko` |✔|✔|✔|✔|✔|
| Kurdish (Central)  | `ku` |✔|✔||✔||
| Kurdish (Northern) ☼ | `kmr` |✔|✔||||
| Kyrgyz (Cyrillic) | `ky` |✔|||||
| Lao ☼ | `lo` |✔|✔||✔||
| Latvian ☼| `lv` |✔|✔|✔|✔|✔|
| Lithuanian | `lt` |✔|✔|✔|✔|✔|
| Macedonian ☼ | `mk` |✔|||✔||
| Malagasy ☼ | `mg` |✔|✔|✔|||
| Malay (Latin) | `ms` |✔|✔|✔|✔|✔|
| Malayalam ☼ | `ml` |✔|✔|✔|||
| Maltese | `mt` |✔|✔|✔|✔|✔|
| Maori | `mi` |✔|✔|✔|||
| Marathi | `mr` |✔|✔|✔|||
| Mongolian (Cyrillic) ☼| `mn-Cyrl` |✔|||||
| Mongolian (Traditional) ☼ | `mn-Mong` |✔|||✔||
| Myanmar ☼ | `my` |✔|✔||✔||
| Nepali | `ne` |✔|✔||||
| Norwegian | `nb` |✔|✔|✔|✔|✔|
| Odia ☼ | `or` |✔|✔|✔|||
| Pashto | `ps` |✔|✔||✔||
| Persian | `fa` |✔|✔|✔|✔|✔|
| Polish | `pl` |✔|✔|✔|✔|✔|
| Portuguese (Brazil) | `pt` |✔|✔|✔|✔|✔|
| Portuguese (Portugal) | `pt-pt` |✔|✔||||
| Punjabi | `pa` |✔|✔|✔|||
| Queretaro Otomi ☼ | `otq` |✔|✔||||
| Romanian | `ro` |✔|✔|✔|✔|✔|
| Russian | `ru` |✔|✔|✔|✔|✔|
| Samoan (Latin) | `sm` |✔| |✔|||
| Serbian (Cyrillic) | `sr-Cyrl` |✔|✔||✔||
| Serbian (Latin) | `sr-Latn` |✔|✔|✔|✔|✔|
| Slovak | `sk` |✔|✔|✔|✔|✔|
| Slovenian | `sl` |✔|✔|✔|✔|✔|
| Somali (Arabic) | `so` |✔|||✔||
| Spanish | `es` |✔|✔|✔|✔|✔|
| Swahili (Latin) | `sw` |✔|✔|✔|✔|✔|
| Swedish | `sv` |✔|✔|✔|✔|✔|
| Tahitian ☼ | `ty` |✔| |✔|✔||
| Tamil ☼ | `ta` |✔|✔|✔||✔|
| Tatar (Latin) | `tt` |✔|||||
| Telugu ☼ | `te` |✔|✔|✔|||
| Thai ☼ | `th` |✔| |✔|✔|✔|
| Tibetan ☼ | `bo` |✔||||
| Tigrinya ☼ | `ti` |✔|✔||||
| Tongan | `to` |✔|✔|✔|||
| Turkish | `tr` |✔|✔|✔|✔|✔|
| Turkmen (Latin) | `tk` |✔||||
| Ukrainian | `uk` |✔|✔|✔|✔|✔|
| Upper Sorbian | `hsb` |✔|||||
| Urdu | `ur` |✔|✔|✔|✔|✔|
| Uyghur (Arabic) | `ug` |✔||||
| Uzbek (Latin | `uz` |✔|||✔||
| Vietnamese ☼ | `vi` |✔|✔|✔|✔|✔|
| Welsh | `cy` |✔|✔|✔|✔|✔|
| Yucatec Maya | `yua` |✔|✔||✔||
| Zulu | `zu` |✔|||||

## Transliteration

The [Transliterate operation](reference/v3-0-transliterate.md) in the Text Translation feature supports the following languages. In the "To/From", "<-->" indicates that the language can be transliterated from or to either of the scripts listed. The "-->" indicates that the language can only be transliterated from one script to the other.

| Language    | Language code | Script | To/From | Script|
|:----------- |:-------------:|:-------------:|:-------------:|:-------------:|
| Arabic | `ar` | Arabic `Arab` | <--> | Latin `Latn` |
| Assamese | `as` | Bengali `Beng` | <--> | Latin `Latn` |
| Bangla  | `bn` | Bengali `Beng` | <--> | Latin `Latn` |
|Belarusian| `be` | Cyrillic `Cyrl`  | <--> | Latin `Latn` |
|Bulgarian| `bg` | Cyrillic `Cyrl`  | <--> | Latin `Latn` |
| Chinese (Simplified) | `zh-Hans` | Chinese Simplified `Hans`| <--> | Latin `Latn` |
| Chinese (Simplified) | `zh-Hans` | Chinese Simplified `Hans`| <--> | Chinese Traditional `Hant`|
| Chinese (Traditional) | `zh-Hant` | Chinese Traditional `Hant`| <--> | Latin `Latn` |
| Chinese (Traditional) | `zh-Hant` | Chinese Traditional `Hant`| <--> | Chinese Simplified `Hans` |
|Greek| `el` | Greek `Grek`  | <--> | Latin `Latn` |
| Gujarati | `gu`  | Gujarati `Gujr` | <--> | Latin `Latn` |
| Hebrew | `he` | Hebrew `Hebr` | <--> | Latin `Latn` |
| Hindi | `hi` | Devanagari `Deva` | <--> | Latin `Latn` |
| Japanese | `ja` | Japanese `Jpan` | <--> | Latin `Latn` |
| Kannada | `kn` | Kannada `Knda` | <--> | Latin `Latn` |
|Kazakh| `kk` | Cyrillic `Cyrl`  | <--> | Latin `Latn` |
|Korean| `ko` | Korean `Kore`  | <--> | Latin `Latn` |
|Kyrgyz| `ky` | Cyrillic `Cyrl`  | <--> | Latin `Latn` |
|Macedonian| `mk` | Cyrillic `Cyrl`  | <--> | Latin `Latn` |
| Malayalam | `ml` | Malayalam `Mlym` | <--> | Latin `Latn` |
| Marathi | `mr` | Devanagari `Deva` | <--> | Latin `Latn` |
|Mongolian| `mn` | Cyrillic `Cyrl`  | <--> | Latin `Latn` |
| Odia | `or` | Oriya `Orya` | <--> | Latin `Latn` |
|Persian| `fa` | Arabic `Arab`  | <--> | Latin `Latn` |
| Punjabi | `pa` | Gurmukhi `Guru`  | <--> | Latin `Latn`  |
|Russian| `ru` | Cyrillic `Cyrl`  | <--> | Latin `Latn` |
| Serbian (Cyrillic) | `sr-Cyrl` | Cyrillic `Cyrl`  | --> | Latin `Latn` |
| Serbian (Latin) | `sr-Latn` | Latin `Latn` | --> | Cyrillic `Cyrl`|
|Sindhi| `sd` | Arabic `Arab`  | <--> | Latin `Latn` |
|Sinhala| `si` | Sinhala `Sinh`  | <--> | Latin `Latn` |
|Tajik| `tg` | Cyrillic `Cyrl`  | <--> | Latin `Latn` |
| Tamil | `ta` | Tamil `Taml` | <--> | Latin `Latn` |
|Tatar| `tt` | Cyrillic `Cyrl`  | <--> | Latin `Latn` |
| Telugu | `te` | Telugu `Telu` | <--> | Latin `Latn` |
| Thai | `th` | Thai `Thai` | --> | Latin `Latn` |
|Ukrainian| `uk` | Cyrillic `Cyrl`  | <--> | Latin `Latn` |
|Urdu| `ur` | Arabic `Arab`  | <--> | Latin `Latn` |

## Other Cognitive Services

Add more capabilities to your apps and workflows by utilizing other Cognitive Services with Translator. Language lists for other services are below.

* [Computer Vision](../computer-vision/language-support.md)
* [Speech](../speech-service/language-support.md)
* [Language service](../language-service/index.yml)
  * Select the feature you want to use, and then **Language support** on the left navigation menu.

View all [Cognitive Services](../index.yml).

## Next steps

* [Text Translation reference](reference/v3-0-reference.md)
* [Document Translation reference](document-translation/reference/rest-api-guide.md)
* [Custom Translator overview](custom-translator/overview.md)
