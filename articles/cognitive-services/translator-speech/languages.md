---
title: Supported languages - Translator Speech API
titlesuffix: Azure Cognitive Services
description: View languages supported by the Translator Speech API.
services: cognitive-services
author: Jann-Skotdal
manager: cgronlun

ms.service: cognitive-services
ms.component: translator-speech
ms.topic: conceptual
ms.date: 3/5/2018
ms.author: v-jansko
---
# Languages supported by the Translator Speech API

[!INCLUDE [Deprecation note](../../../includes/cognitive-services-translator-speech-deprecation-note.md)]

The following languages are supported for speech translation. If both languages are supported for speech translation, speech to speech or speech to text is available. If the target language is not supported for speech translation, only speech to text translation is available. 

| Speech language    |
|:----------- |
| Arabic (Modern Standard)      |
| Chinese (Mandarin)      |
| English      |
| French      |
| German      |
| Italian      |
| Japanese      |
| Portuguese (Brazilian)     |
| Russian      |
| Spanish      | 

The Translator Speech API supports the following languages as a target language for speech to text translation. 

| Text language    | Language code |
|:----------- |:-------------:|
| Afrikaans      | `af`          |
| Arabic       | `ar`          |
| Bangla      | `bn`          |
| Bosnian (Latin)      | `bs`          |
| Bulgarian      | `bg`          |
| Cantonese (Traditional)      | `yue`          |
| Catalan      | `ca`          |
| Chinese Simplified      | `zh-Hans`          | 
| Chinese Traditional      | `zh-Hant`          |
| Croatian      | `hr`          |
| Czech      | `cs`          |
| Danish      | `da`          |
| Dutch      | `nl`          |
| English      | `en`          |
| Estonian      | `et`          |
| Fijian      | `fj`          |
| Filipino      | `fil`          |
| Finnish      | `fi`          |
| French      | `fr`          |
| German      | `de`          |
| Greek      | `el`          |
| Haitian Creole      | `ht`          |
| Hebrew      | `he`          |
| Hindi      | `hi`          |
| Hmong Daw      | `mww`          |
| Hungarian      | `hu`          |
|Icelandic|`is`          |
| Indonesian      | `id`          |
| Italian      | `it`          |
| Japanese      | `ja`          |
| Kiswahili      | `sw`          |
| Klingon      | `tlh`          |
| Klingon (plqaD)      | `tlh-Qaak`          |
| Korean      | `ko`          |
| Latvian      | `lv`          |
| Lithuanian      | `lt`          |
| Malagasy      | `mg`          |
| Malay      | `ms`          |
| Maltese      | `mt`          |
| Norwegian      | `nb`          |
| Persian      | `fa`          |
| Polish      | `pl`          |
| Portuguese      | `pt`          |
| Queretaro Otomi      | `otq`          |
| Romanian      | `ro`          |
| Russian      | `ru`          |
| Samoan      | `sm`          |
| Serbian (Cyrillic)      | `sr-Cyrl`          |
| Serbian (Latin)      | `sr-Latn`          |
| Slovak     | `sk`          |
| Slovenian      | `sl`          |
| Spanish      | `es`          |
| Swedish      | `sv`          |
| Tahitian      | `ty`          |
| Tamil      | `ta`          |
| Thai      | `th`          |
| Tongan      | `to`          |
| Turkish      | `tr`          |
| Ukrainian      | `uk`          |
| Urdu      | `ur`          |
| Vietnamese      | `vi`          |
| Welsh      | `cy`          |
| Yucatec Maya      | `yua`          |

## Access the list programmatically

You can access the list of supported languages programmatically using the languages resource. The list provides the language code as well as the language name in English, or any other supported language. This list is automatically updated by the Translator Speech service as new languages become available.

The Languages resource returns the list of supported languages for speech, text, and text to speech. The Languages resource does not require authentication.

[Visit the API reference to try out the languages method](languages-reference.md)

## Access the list on the Microsoft Translator website

For a quick look at the languages, the Microsoft Translator website shows all the languages supported by the Translator Text and Speech APIs. This list does not include developer-specific information such as language codes.

[See the list of languages](https://www.microsoft.com/translator/languages.aspx) 
