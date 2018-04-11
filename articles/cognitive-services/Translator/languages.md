---
title: Supported languages in the Microsoft Translator API | Microsoft Docs
description: View languages supported by the Microsoft Translator Text API.
services: cognitive-services
author: Jann-Skotdal
manager: chriswendt1

ms.service: cognitive-services
ms.technology: translator
ms.topic: article
ms.date: 10/30/2017
ms.author: v-jansko
---

# Supported languages in the Microsoft Translator Text API 
The Microsoft Translator Text API supports the following languages for text to text translation using statistical machine translation (SMT). 

| Language    | Language code |
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

## Neural Machine Translation systems

The following languages are supported for Neural Machine Translation. The neural system can be used by adding "generalnn" to the category parameter of the API call. You may use the "generalnn" category for any of the supported languages, even if there is no neural translation system handling it. 

| Language    | Language code |
|:----------- |:-------------:|
| Arabic       | `ar`          |
| Bulgarian       | `bg`          |
| Chinese Simplified      | `zh-Hans`          | 
| Czech      | `cs`          |
| Danish      | `da`          |
| Dutch      | `nl`          |
| English      | `en`          |
| French      | `fr`          |
| German      | `de`          |
| Hindi      | `hi`          |
| Italian      | `it`          |
| Japanese      | `ja`          |
| Korean      | `ko`          |
| Norwegian      | `nb`          |
| Polish      | `pl`          |
| Portuguese      | `pt`          |
| Romanian      | `ro`          |
| Russian      | `ru`          |
| Spanish      | `es`          |
| Swedish      | `sv`          |
| Turkish      | `tr`          |


## Access the list programmatically

You can access the list of supported languages programmatically using the Languages resource. The list provides the language code as well as the language name in English, or any other supported language. This list is automatically updated by the Microsoft Translator service as new languages become available.

The Languages resource returns the list of supported languages for text and speech translation. The Languages resource 
does not require authentication.

To access the list, add 'text' in the 'Scope' parameter of the Languages resource reference page. After you have entered the scope parameter, select the **Try it out!** button. The service returns the supported languages in JSON format. The response is visible in the 'Response Body' section. 

[Visit the API reference to try out the languages method](http://docs.microsofttranslator.com/languages.html)

## Access the list on the Microsoft Translator website

For a quick look at the languages, the Microsoft Translator website shows all the languages supported by the Translator Text and Speech APIs. This list does not include developer-specific information such as language codes.

[See the list of languages](https://www.microsoft.com/translator/languages.aspx)

## Languages detected by the Detect() method

The following languages can be detected by the Detect() method. Detect () may detect languages that Microsoft Translator cannot translate. 

| Language    | 
|:----------- |
| Afrikaans |
| Albanian | 
| Arabic |
| Basque |
| Belarusian |
| Bulgarian |
| Catalan |
| Chinese |
| Chinese_Simplified |
| Chinese_Traditional |
| Croatian |
| Czech |
| Danish |
| Dutch |
| English |
| Esperanto |
| Estonian |
| Finnish |
| French |
| Galician |
| German |
| Greek |
| Haitian_Creole |
| Hebrew |
| Hindi |
| Hungarian |
| Icelandic |
| Indonesian |
| Irish |
| Italian |
| Japanese |
| Korean |
| Kurdish_Arabic |
| Kurdish_Latin |
| Latin |
| Latvian |
| Lithuanian |
| Macedonian |
| Malay |
| Maltese |
| Norwegian |
| Norwegian_Nynorsk |
| Pashto |
| Persian |
| Polish |
| Portuguese |
| Romanian |
| Russian |
| Serbian_Cyrillic |
| Serbian_Latin |
| Slovak |
| Slovenian |
| Somali |
| Spanish |
| Swahili |
| Swedish |
| Tagalog |
| Thai |
| Turkish |
| Ukrainian |
| Urdu |
| Uzbek_Cyrillic |
| Uzbek_Latin |
| Vietnamese |
| Welsh |
| Yiddish |
