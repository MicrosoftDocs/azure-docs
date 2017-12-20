---
title: Supported languages in the Microsoft Translator API | Microsoft Docs
description: View languages supported by the Microsoft Translator Text API.
services: cognitive-services
author: jann-skotdal
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

The following languages are supported for Neural Machine Translation. The NMT system can be used by adding "generalnn" to the category parameter of the API call.

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

You can access the list of supported languages programmatically using the Languages API method on the Languages API reference page. This list provides the language code as well as the language name in English, or localized into another language. This list is automatically updated by the Microsoft Translator service as new languages become available.

The Languages API method returns the list of supported languages for each of the three groups. The languages method 
does not require an access token for authentication.

To access the list, in the 'Scope' parameter of the method of the Language API reference page, add 'text'. After you have entered the scope parameter, 
select the **Try it out!** button. The service returns the supported languages in JSON format. The response is visible
in the 'Response Body' section. 

Note that this method uses the Microsoft Translator Speech API to return the list of languages. The list of supported text languages is the same for the Text and Speech APIs, but the Speech API would be used for speech to text (or speech to speech) translation rather than text to text translation.

[Visit the API reference to try out the languages method](http://docs.microsofttranslator.com/languages.html)

## Access the list on the Microsoft Translator website

For a quick look at the languages, the Microsoft Translator website shows all the languages supported by the Translator Text and Speech APIs as well as specific language lists available in the Microsoft Translator apps. This list does not include developer specific information such as language codes.

[See the list of languages on our website](https://www.microsoft.com/translator/languages.aspx)

## Languages detected by the Detect() method

The following languages can be detected by the Detect() method. Note that Detect () may detect languages that Microsoft Translator cannot translate. 

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
