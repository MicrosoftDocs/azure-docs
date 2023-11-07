---
title: Language support - Translator
titleSuffix: Azure AI services
description: Azure AI Translator supports the following languages for text to text translation using Neural Machine Translation (NMT).
services: cognitive-services
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: reference
ms.date: 11/06/2023
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

|Language|Language code|Cloud – Text Translation and Document Translation|Containers – Text Translation|Custom Translator|Auto Language Detection|Dictionary|
|:----|:----|:----|:----|:----|:----|:----|
|Afrikaans|af|✔|✔|✔|✔|✔|
|Albanian|sq|✔|✔| |✔| |
|Amharic|am|✔|✔| |✔| |
|Arabic|ar|✔|✔|✔|✔|✔|
|Armenian|hy|✔|✔| |✔| |
|Assamese|as|✔|✔|✔|✔| |
|Azerbaijani (Latin)|az|✔|✔| |✔| |
|Bangla|bn|✔|✔|✔|✔|✔|
|Bashkir|ba|✔|✔| |✔| |
|Basque|eu|✔|✔| |✔| |
|Bhojpuri|bho|✔|✔ | | | |
|Bodo|brx    |✔|✔ | | | |
|Bosnian (Latin)|bs|✔|✔|✔|✔|✔|
|Bulgarian|bg|✔|✔|✔|✔|✔|
|Cantonese (Traditional)|yue|✔|✔| |✔| |
|Catalan|ca|✔|✔|✔|✔|✔|
|Chinese (Literary)|lzh|✔|✔| | | |
|Chinese Simplified|zh-Hans|✔|✔|✔|✔|✔|
|Chinese Traditional|zh-Hant|✔|✔|✔|✔| |
|chiShona|sn|✔|✔| | | |
|Croatian|hr|✔|✔|✔|✔|✔|
|Czech|cs|✔|✔|✔|✔|✔|
|Danish|da|✔|✔|✔|✔|✔|
|Dari|prs|✔|✔| |✔| |
|Divehi|dv|✔|✔| |✔| |
|Dogri|doi|✔| | | | |
|Dutch|nl|✔|✔|✔|✔|✔|
|English|en|✔|✔|✔|✔|✔|
|Estonian|et|✔|✔|✔|✔| |
|Faroese|fo|✔|✔| |✔| |
|Fijian|fj|✔|✔|✔|✔| |
|Filipino|fil|✔|✔|✔| | |
|Finnish|fi|✔|✔|✔|✔|✔|
|French|fr|✔|✔|✔|✔|✔|
|French (Canada)|fr-ca|✔|✔| | | |
|Galician|gl|✔|✔| |✔| |
|Georgian|ka|✔|✔| |✔| |
|German|de|✔|✔|✔|✔|✔|
|Greek|el|✔|✔|✔|✔|✔|
|Gujarati|gu|✔|✔|✔|✔| |
|Haitian Creole|ht|✔|✔| |✔|✔|
|Hausa|ha|✔|✔| |✔| |
|Hebrew|he|✔|✔|✔|✔|✔|
|Hindi|hi|✔|✔|✔|✔|✔|
|Hmong Daw (Latin)|mww|✔|✔| |✔|✔|
|Hungarian|hu|✔|✔|✔|✔|✔|
|Icelandic|is|✔|✔|✔|✔|✔|
|Igbo|ig|✔|✔| |✔| |
|Indonesian|id|✔|✔|✔|✔|✔|
|Inuinnaqtun|ikt|✔|✔| | | |
|Inuktitut|iu|✔|✔|✔|✔| |
|Inuktitut (Latin)|iu-Latn|✔|✔| |✔| |
|Irish|ga|✔|✔|✔|✔| |
|Italian|it|✔|✔|✔|✔|✔|
|Japanese|ja|✔|✔|✔|✔|✔|
|Kannada|kn|✔|✔|✔|✔| |
|Kashmiri|ks|✔|✔ | | | |
|Kazakh|kk|✔|✔| |✔| |
|Khmer|km|✔|✔| |✔| |
|Kinyarwanda|rw|✔|✔| |✔| |
|Klingon|tlh-Latn|✔| | |✔|✔|
|Klingon (plqaD)|tlh-Piqd|✔| | |✔| |
|Konkani|gom|✔|✔| | | |
|Korean|ko|✔|✔|✔|✔|✔|
|Kurdish (Central)|ku|✔|✔| |✔| |
|Kurdish (Northern)|kmr|✔|✔| | | |
|Kyrgyz (Cyrillic)|ky|✔|✔| |✔| |
|Lao|lo|✔|✔| |✔| |
|Latvian|lv|✔|✔|✔|✔|✔|
|Lithuanian|lt|✔|✔|✔|✔|✔|
|Lingala|ln|✔|✔| | | |
|Lower Sorbian|dsb|✔| | | | |
|Luganda|lug|✔|✔| | | |
|Macedonian|mk|✔|✔| |✔| |
|Maithili|mai|✔|✔| | | |
|Malagasy|mg|✔|✔|✔|✔| |
|Malay (Latin)|ms|✔|✔|✔|✔|✔|
|Malayalam|ml|✔|✔|✔|✔| |
|Maltese|mt|✔|✔|✔|✔|✔|
|Maori|mi|✔|✔|✔|✔| |
|Marathi|mr|✔|✔|✔|✔| |
|Mongolian (Cyrillic)|mn-Cyrl|✔|✔| |✔| |
|Mongolian (Traditional)|mn-Mong|✔|✔| | | |
|Myanmar|my|✔|✔| |✔| |
|Nepali|ne|✔|✔| |✔| |
|Norwegian|nb|✔|✔|✔|✔|✔|
|Nyanja|nya|✔|✔| | | |
|Odia|or|✔|✔|✔|✔| |
|Pashto|ps|✔|✔| |✔| |
|Persian|fa|✔|✔|✔|✔|✔|
|Polish|pl|✔|✔|✔|✔|✔|
|Portuguese (Brazil)|pt|✔|✔|✔|✔|✔|
|Portuguese (Portugal)|pt-pt|✔|✔| | | |
|Punjabi|pa|✔|✔|✔|✔| |
|Queretaro Otomi|otq|✔|✔| |✔| |
|Romanian|ro|✔|✔|✔|✔|✔|
|Rundi|run|✔|✔| | | |
|Russian|ru|✔|✔|✔|✔|✔|
|Samoan (Latin)|sm|✔|✔|✔|✔| |
|Serbian (Cyrillic)|sr-Cyrl|✔|✔| |✔| |
|Serbian (Latin)|sr-Latn|✔|✔|✔|✔|✔|
|Sesotho|st|✔|✔| | | |
|Sesotho sa Leboa|nso|✔|✔| | | |
|Setswana|tn|✔|✔| | | |
|Sindhi|sd|✔|✔| |✔| |
|Sinhala|si|✔|✔| |✔| |
|Slovak|sk|✔|✔|✔|✔|✔|
|Slovenian|sl|✔|✔|✔|✔|✔|
|Somali (Arabic)|so|✔|✔| |✔| |
|Spanish|es|✔|✔|✔|✔|✔|
|Swahili (Latin)|sw|✔|✔|✔|✔|✔|
|Swedish|sv|✔|✔|✔|✔|✔|
|Tahitian|ty|✔|✔|✔|✔| |
|Tamil|ta|✔|✔|✔|✔|✔|
|Tatar (Latin)|tt|✔|✔| |✔| |
|Telugu|te|✔|✔|✔|✔| |
|Thai|th|✔|✔|✔|✔|✔|
|Tibetan|bo|✔|✔| |✔| |
|Tigrinya|ti|✔|✔| |✔| |
|Tongan|to|✔|✔|✔|✔| |
|Turkish|tr|✔|✔|✔|✔|✔|
|Turkmen (Latin)|tk|✔|✔| |✔| |
|Ukrainian|uk|✔|✔|✔|✔|✔|
|Upper Sorbian|hsb|✔|✔| |✔| |
|Urdu|ur|✔|✔|✔|✔|✔|
|Uyghur (Arabic)|ug|✔|✔| |✔| |
|Uzbek (Latin)|uz|✔|✔| |✔| |
|Vietnamese|vi|✔|✔|✔|✔|✔|
|Welsh|cy|✔|✔|✔|✔|✔|
|Xhosa|xh|✔|✔| |✔| |
|Yoruba|yo|✔|✔| |✔| |
|Yucatec Maya|yua|✔|✔| |✔| |
|Zulu|zu|✔|✔| |✔| |

## Document Translation: scanned PDF support

|Language|Language Code|Supported as source language for scanned PDF?|Supported as target language for scanned PDF?|
|:----|:----:|:----:|:----:|
|Afrikaans|`af`|Yes|Yes|
|Albanian|`sq`|Yes|Yes|
|Amharic|`am`|No|No|
|Arabic|`ar`|Yes|Yes|
|Armenian|`hy`|No|No|
|Assamese|`as`|No|No|
|Azerbaijani (Latin)|`az`|Yes|Yes|
|Bangla|`bn`|No|No|
|Bashkir|`ba`|No|Yes|
|Basque|`eu`|Yes|Yes|
|Bosnian (Latin)|`bs`|Yes|Yes|
|Bulgarian|`bg`|Yes|Yes|
|Cantonese (Traditional)|`yue`|No|Yes|
|Catalan|`ca`|Yes|Yes|
|Chinese (Literary)|`lzh`|No|Yes|
|Chinese Simplified|`zh-Hans`|Yes|Yes|
|Chinese Traditional|`zh-Hant`|Yes|Yes|
|Croatian|`hr`|Yes|Yes|
|Czech|`cs`|Yes|Yes|
|Danish|`da`|Yes|Yes|
|Dari|`prs`|No|No|
|Divehi|`dv`|No|No|
|Dutch|`nl`|Yes|Yes|
|English|`en`|Yes|Yes|
|Estonian|`et`|Yes|Yes|
|Faroese|`fo`|Yes|Yes|
|Fijian|`fj`|Yes|Yes|
|Filipino|`fil`|Yes|Yes|
|Finnish|`fi`|Yes|Yes|
|French|`fr`|Yes|Yes|
|French (Canada)|`fr-ca`|Yes|Yes|
|Galician|`gl`|Yes|Yes|
|Georgian|`ka`|No|No|
|German|`de`|Yes|Yes|
|Greek|`el`|No|No|
|Gujarati|`gu`|No|No|
|Haitian Creole|`ht`|Yes|Yes|
|Hebrew|`he`|No|No|
|Hindi|`hi`|Yes|Yes|
|Hmong Daw (Latin)|`mww`|Yes|Yes|
|Hungarian|`hu`|Yes|Yes|
|Icelandic|`is`|Yes|Yes|
|Indonesian|`id`|Yes|Yes|
|Interlingua|`ia`|Yes|Yes|
|Inuinnaqtun|`ikt`|No|Yes|
|Inuktitut|`iu`|No|No|
|Inuktitut (Latin)|`iu-Latn`|Yes|Yes|
|Irish|`ga`|Yes|Yes|
|Italian|`it`|Yes|Yes|
|Japanese|`ja`|Yes|Yes|
|Kannada|`kn`|No|Yes|
|Kazakh (Cyrillic)|`kk`, `kk-cyrl`|Yes|Yes|
|Kazakh (Latin)|`kk-latn`|Yes|Yes|
|Khmer|`km`|No|No|
|Klingon|`tlh-Latn`|No|No|
|Klingon (plqaD)|`tlh-Piqd`|No|No|
|Korean|`ko`|Yes|Yes|
|Kurdish (Arabic) (Central)|`ku-arab`,`ku`|No|No|
|Kurdish (Latin) (Northern)|`ku-latn`, `kmr`|Yes|Yes|
|Kyrgyz (Cyrillic)|`ky`|Yes|Yes|
|Lao|`lo`|No|No|
|Latvian|`lv`|No|Yes|
|Lithuanian|`lt`|Yes|Yes|
|Macedonian|`mk`|No|Yes|
|Malagasy|`mg`|No|Yes|
|Malay (Latin)|`ms`|Yes|Yes|
|Malayalam|`ml`|No|Yes|
|Maltese|`mt`|Yes|Yes|
|Maori|`mi`|Yes|Yes|
|Marathi|`mr`|Yes|Yes|
|Mongolian (Cyrillic)|`mn-Cyrl`|Yes|Yes|
|Mongolian (Traditional)|`mn-Mong`|No|No|
|Myanmar (Burmese)|`my`|No|No|
|Nepali|`ne`|Yes|Yes|
|Norwegian|`nb`|Yes|Yes|
|Odia|`or`|No|No|
|Pashto|`ps`|No|No|
|Persian|`fa`|No|No|
|Polish|`pl`|Yes|Yes|
|Portuguese (Brazil)|`pt`, `pt-br`|Yes|Yes|
|Portuguese (Portugal)|`pt-pt`|Yes|Yes|
|Punjabi|`pa`|No|Yes|
|Queretaro Otomi|`otq`|No|Yes|
|Romanian|`ro`|Yes|Yes|
|Russian|`ru`|Yes|Yes|
|Samoan (Latin)|`sm`|Yes|Yes|
|Serbian (Cyrillic)|`sr-Cyrl`|No|Yes|
|Serbian (Latin)|`sr`, `sr-latn`|Yes|Yes|
|Slovak|`sk`|Yes|Yes|
|Slovenian|`sl`|Yes|Yes|
|Somali|`so`|No|Yes|
|Spanish|`es`|Yes|Yes|
|Swahili (Latin)|`sw`|Yes|Yes|
|Swedish|`sv`|Yes|Yes|
|Tahitian|`ty`|No|Yes|
|Tamil|`ta`|No|Yes|
|Tatar (Latin)|`tt`|Yes|Yes|
|Telugu|`te`|No|Yes|
|Thai|`th`|No|No|
|Tibetan|`bo`|No|No|
|Tigrinya|`ti`|No|No|
|Tongan|`to`|Yes|Yes|
|Turkish|`tr`|Yes|Yes|
|Turkmen (Latin)|`tk`|Yes|Yes|
|Ukrainian|`uk`|No|Yes|
|Upper Sorbian|`hsb`|Yes|Yes|
|Urdu|`ur`|No|No|
|Uyghur (Arabic)|`ug`|No|No|
|Uzbek (Latin)|`uz`|Yes|Yes|
|Vietnamese|`vi`|No|Yes|
|Welsh|`cy`|Yes|Yes|
|Yucatec Maya|`yua`|Yes|Yes|
|Zulu|`zu`|Yes|Yes|

## Transliteration

The [Transliterate operation](reference/v3-0-transliterate.md) in the Text Translation feature supports the following languages. In the `To/From`, `<-->` indicates that the language can be transliterated from or to either of the scripts listed. The `-->` indicates that the language can only be transliterated from one script to the other.

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

## Other Azure AI services

Add more capabilities to your apps and workflows by utilizing other Azure AI services with Translator. Language support for other services:

* [Azure AI Vision](../computer-vision/language-support.md)
* [Speech](../speech-service/language-support.md)
* [Language service](../language-service/concepts/language-support.md)

View all [Azure AI services](../index.yml).

## Next steps

* [Text Translation reference](reference/v3-0-reference.md)
* [Document Translation reference](document-translation/reference/rest-api-guide.md)
* [Custom Translator overview](custom-translator/overview.md)
