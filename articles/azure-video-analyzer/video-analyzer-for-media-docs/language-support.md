<<<<<<< HEAD

---
title: Language support 
description: This article provides a comprehensive list of language support by service feature in Azure Video Analyzer for Media (formerly Video Indexer).
=======
---
title: Language support in Azure Video Analyzer for Media
description: This article provides a comprehensive list of language support by service features in Azure Video Analyzer for Media (formerly Video Indexer).
>>>>>>> cec84be48f1d6622b54bed7438b38af16b0b79b8
author: Juliako
manager: femila
ms.topic: conceptual
ms.author: juliako
ms.date: 02/02/2022
---

# Language support in Video Analyzer for Media

<<<<<<< HEAD
The artical provides tables of supported languages in the following featues in Azure Video Analyzer for Media: 
=======
This article provides a comprehensive list of language support by service features in Azure Video Analyzer for Media (formerly Video Indexer). For the list and definitions of all the features, see [Overview](video-indexer-overview.md).

## General language support

This section describes language support in Video Analyzer for Media.
>>>>>>> cec84be48f1d6622b54bed7438b38af16b0b79b8

- Transcription (source language of the video/audio file)
- Language identification (LID)
- Multi-language identification  (MLID)
<<<<<<< HEAD
- Translation. The table describes the supported languages. 

  The following insights are translated, otherwise will remain in English
=======
- Translation

  The following insights are translated, otherwise will remain in English:
>>>>>>> cec84be48f1d6622b54bed7438b38af16b0b79b8
  
    - Transcript
    - OCR
    - Keywords
    - Topics
    - Labels
    - [NEW] Frame Patters (Only to Hebrew as of now).

- Search in specific language
- Language customization
 
<<<<<<< HEAD

| Language                         | Code       | Transcription | LID   | MLID  | Translation | Customization (Speech custom model) |
|----------------------------------|------------|--------------------|-------|-------|-------------|-------------------------------------|
| Afrikaans                        | af-ZA      | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
| Arabic (Iraq)                    | ar-IQ      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| Arabic (Israel)                  | ar-IL      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| Arabic (Jordan)                  | ar-JO      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| Arabic (Kuwait)                  | ar-KW      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| Arabic (Lebanon)                 | ar-LB      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| Arabic (Oman)                    | ar-OM      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| Arabic (Palestinian Authority)   | ar-PS      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| Arabic (Qatar)                   | ar-QA      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| Arabic (Saudi Arabia)            | ar-SA      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| Arabic (United Arab Emirates)    | ar-AE      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| Arabic Egypt                     | ar-EG      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| Arabic Modern Standard (Bahrain) | ar-BH      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| Arabic Syrian Arab Republic      | ar-SY      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| Bangla                           | bn-BD      | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
| Bosnian                          | bs-Latn    | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
| Bulgarian                        | bg-BG      | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
| Catalan                          | ca-ES      | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
| Chinese (Cantonese Traditional)  | zh-HK      | TRUE               | FALSE | TRUE  | TRUE        | TRUE                                |
| Chinese (Simplified)             | zh-Hans    | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| Chinese (Traditional)            | zh-Hant    | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
| Croatian                         | hr-HR      | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
| Czech                            | cs-CZ      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| Danish                           | da-DK      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| Dutch                            | nl-NL      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| English Australia                | en-AU      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| English United Kingdom           | en-GB      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| English United States            | en-US      | TRUE               | TRUE  | TRUE  | TRUE        | TRUE                                |
| Estonian                         | et-EE      | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
| Fijian                           | en-FJ      | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
| Filipino                         | fil-PH     | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
| Finnish                          | fi-FI      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| French                           | fr-FR      | TRUE               | TRUE  | TRUE  | TRUE        | TRUE                                |
| French (Canada)                  | fr-CA      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| German                           | de-DE      | TRUE               | TRUE  | TRUE  | TRUE        | TRUE                                |
| Greek                            | el-GR      | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
| Haitian                          | fr-HT      | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
| Hebrew                           | he-IL      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| Hindi                            | hi-IN      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| Hungarian                        | hu-HU      | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
| Indonesian                       | id-ID      | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
| Italian                          | it-IT      | TRUE               | TRUE  | FALSE | TRUE        | TRUE                                |
| Japanese                         | ja-JP      | TRUE               | TRUE  | FALSE | TRUE        | TRUE                                |
| Kiswahili                        | sw-KE      | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
| Korean                           | ko-KR      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| Latvian                          | lv-LV      | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
| Lithuanian                       | lt-LT      | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
| Malagasy                         | mg-MG      | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
| Malay                            | ms-MY      | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
| Maltese                          | mt-MT      | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
| Norwegian                        | nb-NO      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| Persian                          | fa-IR      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| Polish                           | pl-PL      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| Portuguese                       | pt-BR      | TRUE               | TRUE  | FALSE | TRUE        | TRUE                                |
| Portuguese (Portugal)            | pt-PT      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| Romanian                         | ro-RO      | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
| Russian                          | ru-RU      | TRUE               | TRUE  | FALSE | TRUE        | TRUE                                |
| Samoan                           | en-WS      | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
| Serbian (Cyrillic)               | sr-Cyrl-RS | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
| Serbian (Latin)                  | sr-Latn-RS | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
| Slovak                           | sk-SK      | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
| Slovenian                        | sl-SI      | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
| Spanish                          | es-ES      | TRUE               | TRUE  | TRUE  | TRUE        | TRUE                                |
| Spanish (Mexico)                 | es-MX      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| Swedish                          | sv-SE      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| Tamil                            | ta-IN      | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
| Thai                             | th-TH      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| Tongan                           | to-TO      | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
| Turkish                          | tr-TR      | TRUE               | FALSE | FALSE | TRUE        | TRUE                                |
| Ukrainian                        | uk-UA      | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
| Urdu                             | ur-PK      | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
| Vietnamese                       | vi-VN      | FALSE              | FALSE | FALSE | TRUE        | TRUE                                |
=======
| **Language**                      | **Code**       | **Transcription** | **LID*   | **MLID**  | **Translation** | **Customization** (Speech custom model) |
|:------------:|:------------:|:--------------------:|:-------:|:-------:|:-------------:|:-------------------------------------:|
| Afrikaans                        | `af-ZA`      |                 |  |  | ✔        | ✔                                |
| Arabic (Iraq)                    | `ar-IQ`      | ✔               |  |  | ✔        | ✔                                |
| Arabic (Israel)                  | `ar-IL`      | ✔               |  |  | ✔        | ✔                                |
| Arabic (Jordan)                  | `ar-JO`      | ✔               |  |  | ✔        | ✔                                |
| Arabic (Kuwait)                  | `ar-KW`      | ✔               |  |  | ✔        | ✔                                |
| Arabic (Lebanon)                 | `ar-LB`      | ✔               |  |  | ✔        | ✔                                |
| Arabic (Oman)                    | `ar-OM`      | ✔               |  |  | ✔        | ✔                                |
| Arabic (Palestinian Authority)   | `ar-PS`      | ✔               |  |  | ✔        | ✔                                |
| Arabic (Qatar)                   | `ar-QA`      | ✔               |  |  | ✔        | ✔                                |
| Arabic (Saudi Arabia)            | `ar-SA`      | ✔               |  |  | ✔        | ✔                                |
| Arabic (United Arab Emirates)    | `ar-AE`      | ✔               |  |  | ✔        | ✔                                |
| Arabic Egypt                     | `ar-EG`      | ✔               |  |  | ✔        | ✔                                |
| Arabic Modern Standard (Bahrain) | `ar-BH`      | ✔               |  |  | ✔        | ✔                                |
| Arabic Syrian Arab Republic      | `ar-SY`      | ✔               |  |  | ✔        | ✔                                |
| Bangla                           | `bn-BD`      |                 |  |  | ✔        | ✔                                |
| Bosnian                          | `bs-Latn`    |                 |  |  | ✔        | ✔                                |
| Bulgarian                        | `bg-BG`      |                 |  |  | ✔        | ✔                                |
| Catalan                          | `ca-ES`      |                 |  |  | ✔        | ✔                                |
| Chinese (Cantonese Traditional)  | `zh-HK`      | ✔               |  | ✔  | ✔      | ✔                                |
| Chinese (Simplified)             | `zh-Hans`    | ✔               |  |  | ✔        | ✔                                |
| Chinese (Traditional)            | `zh-Hant`    |                 |  |  | ✔        | ✔                                |
| Croatian                         | `hr-HR`      |                 |  |  | ✔        | ✔                                |
| Czech                            | `cs-CZ`      | ✔               |  |  | ✔        | ✔                                |
| Danish                           | `da-DK`      | ✔               |  |  | ✔        | ✔                                |
| Dutch                            | `nl-NL`      | ✔               |  |  | ✔        | ✔                                |
| English Australia                | `en-AU`      | ✔               |  |  | ✔        | ✔                                |
| English United Kingdom           | `en-GB`      | ✔               |  |  | ✔        | ✔                                |
| English United States            | `en-US`      | ✔               | ✔  | ✔  | ✔    | ✔                                |
| Estonian                         | `et-EE`      |                 |  |  | ✔        | ✔                                |
| Fijian                           | `en-FJ`      |                 |  |  | ✔        | ✔                                |
| Filipino                         | `fil-PH`     |                 |  |  | ✔        | ✔                                |
| Finnish                          | `fi-FI`      | ✔               |  |  | ✔        | ✔                                |
| French                           | `fr-FR`      | ✔               | ✔  | ✔  | ✔    | ✔                                |
| French (Canada)                  | `fr-CA`      | ✔               |  |  | ✔        | ✔                                |
| German                           | `de-DE`      | ✔               | ✔  | ✔  | ✔    | ✔                                |
| Greek                            | `el-GR`      |                 |  |  | ✔        | ✔                                |
| Haitian                          | `fr-HT`      |                 |  |  | ✔        | ✔                                |
| Hebrew                           | `he-IL`      | ✔               |  |  | ✔        | ✔                                |
| Hindi                            | `hi-IN`      | ✔               |  |  | ✔        | ✔                                |
| Hungarian                        | `hu-HU`      |                 |  |  | ✔        | ✔                                |
| Indonesian                       | `id-ID`      |                 |  |  | ✔        | ✔                                |
| Italian                          | `it-IT`      | ✔               | ✔  |  | ✔      | ✔                                |
| Japanese                         | `ja-JP`      | ✔               | ✔  |  | ✔      | ✔                                |
| Kiswahili                        | `sw-KE`      |                 |  |  | ✔        | ✔                                |
| Korean                           | `ko-KR`      | ✔               |  |  | ✔        | ✔                                |
| Latvian                          | `lv-LV`      |                 |  |  | ✔        | ✔                                |
| Lithuanian                       | `lt-LT`      |                 |  |  | ✔        | ✔                                |
| Malagasy                         | `mg-MG`      |                 |  |  | ✔        | ✔                                |
| Malay                            | `ms-MY`      |                 |  |  | ✔        | ✔                                |
| Maltese                          | `mt-MT`      |                 |  |  | ✔        | ✔                                |
| Norwegian                        | `nb-NO`      | ✔               |  |  | ✔        | ✔                                |
| Persian                          | `fa-IR`      | ✔               |  |  | ✔        | ✔                                |
| Polish                           | `pl-PL`      | ✔               |  |  | ✔        | ✔                                |
| Portuguese                       | `pt-BR`      | ✔               | ✔  |  | ✔      | ✔                                |
| Portuguese (Portugal)            | `pt-PT`      | ✔               |  |  | ✔        | ✔                                |
| Romanian                         | `ro-RO`      |                 |  |  | ✔        | ✔                                |
| Russian                          | `ru-RU`      | ✔               | ✔  |  | ✔      | ✔                                |
| Samoan                           | `en-WS`      |                 |  |  | ✔        | ✔                                |
| Serbian (Cyrillic)               | `sr-Cyrl-RS` |                 |  |  | ✔        | ✔                                |
| Serbian (Latin)                  | `sr-Latn-RS` |                 |  |  | ✔        | ✔                                |
| Slovak                           | `sk-SK`      |                 |  |  | ✔        | ✔                                |
| Slovenian                        | `sl-SI`      |                 |  |  | ✔        | ✔                                |
| Spanish                          | `es-ES`      | ✔               | ✔  | ✔  | ✔        | ✔                            |
| Spanish (Mexico)                 | `es-MX`      | ✔               |  |  | ✔        | ✔                                |
| Swedish                          | `sv-SE`      | ✔               |  |  | ✔        | ✔                                |
| Tamil                            | `ta-IN`      |                 |  |  | ✔        | ✔                                |
| Thai                             | `th-TH`      | ✔               |  |  | ✔        | ✔                                |
| Tongan                           | `to-TO`      |                 |  |  | ✔        | ✔                                |
| Turkish                          | `tr-TR`      | ✔               |  |  | ✔        | ✔                                |
| Ukrainian                        | `uk-UA`      |                 |  |  | ✔        | ✔                                |
| Urdu                             | `ur-PK`      |                 |  |  | ✔        | ✔                                |
| Vietnamese                       | `vi-VN`      |                 |  |  | ✔        | ✔                                |

## Language support in frontend experiences

The following table describes language support in the Video Analyzer for Media frontend experiences.

* [portal](https://aka.ms/vi-portal-link) experience provided in the settings page
* [widgets](video-indexer-embed-widgets.md), as provided in the language dropdown in the insights widget

| **Language**                      | **Code**       | **Web experience** | **Widgets experience**   | 
|:------------:|:------------:|:--------------------:|:-------:|
| Afrikaans                        | `af-ZA`      |           | ✔ |  
| Arabic (Iraq)                    | `ar-IQ`      |           |  |
| Arabic (Israel)                  | `ar-IL`      |           |  | 
| Arabic (Jordan)                  | `ar-JO`      |           |  | 
| Arabic (Kuwait)                  | `ar-KW`      |           |  |  
| Arabic (Lebanon)                 | `ar-LB`      |           |  |
| Arabic (Oman)                    | `ar-OM`      |           |  | 
| Arabic (Palestinian Authority)   | `ar-PS`      |           |  | 
| Arabic (Qatar)                   | `ar-QA`      |           |  |
| Arabic (Saudi Arabia)            | `ar-SA`      |           |  | 
| Arabic (United Arab Emirates)    | `ar-AE`      |           |  | 
| Arabic Egypt                     | `ar-EG`      |           | ✔ |
| Arabic Modern Standard (Bahrain) | `ar-BH`      |           |  | 
| Arabic Syrian Arab Republic      | `ar-SY`      |           |  | 
| Bangla                           | `bn-BD`      |           |✔  |
| Bosnian                          | `bs-Latn`    |           | ✔ |  
| Bulgarian                        | `bg-BG`      |           |  ✔|  
| Catalan                          | `ca-ES`      |           | ✔ | 
| Chinese (Cantonese Traditional)  | `zh-HK`      |           | ✔ | 
| Chinese (Simplified)             | `zh-Hans`    |      ✔    |✔  |
| Chinese (Traditional)            | `zh-Hant`    |           |✔  |  
| Croatian                         | `hr-HR`      |           |  |
| Czech                            | `cs-CZ`      |    ✔      | ✔ | 
| Danish                           | `da-DK`      |           | ✔ | 
| Dutch                            | `nl-NL`      |   ✔       | ✔ | 
| English Australia                | `en-AU`      |           | ✔ |  
| English United Kingdom           | `en-GB`      |           |  ✔| 
| English United States            | `en-US`      |   ✔       |  ✔ | 
| Estonian                         | `et-EE`      |           |  ✔|  
| Fijian                           | `en-FJ`      |           |  ✔| 
| Filipino                         | `fil-PH`     |           |✔  | 
| Finnish                          | `fi-FI`      |           | ✔ | 
| French                           | `fr-FR`      |           | ✔  | 
| French (Canada)                  | `fr-CA`      | ✔         |✔  | 
| German                           | `de-DE`      | ✔         |  |
| Greek                            | `el-GR`      |           |✔  | 
| Haitian                          | `fr-HT`      |           | ✔ |
| Hebrew                           | `he-IL`      |           | ✔ |
| Hindi                            | `hi-IN`      | ✔         |✔  | 
| Hungarian                        | `hu-HU`      |  ✔        | ✔ | 
| Indonesian                       | `id-ID`      |           |  | 
| Italian                          | `it-IT`      |           |  ✔ | 
| Japanese                         | `ja-JP`      | ✔         | ✔  | 
| Kiswahili                        | `sw-KE`      | ✔         | ✔ | 
| Korean                           | `ko-KR`      |✔          |  ✔|  
| Latvian                          | `lv-LV`      |           |✔  |  
| Lithuanian                       | `lt-LT`      |           | ✔ |
| Malagasy                         | `mg-MG`      |           | ✔ | 
| Malay                            | `ms-MY`      |           |✔  | 
| Maltese                          | `mt-MT`      |           |  |
| Norwegian                        | `nb-NO`      |           | ✔ |
| Persian                          | `fa-IR`      |           |  |
| Polish                           | `pl-PL`      |  ✔        | ✔ | 
| Portuguese                       | `pt-BR`      | ✔         | ✔  | 
| Portuguese (Portugal)            | `pt-PT`      |           |✔  |  
| Romanian                         | `ro-RO`      |           |  ✔| 
| Russian                          | `ru-RU`      | ✔         | ✔  |
| Samoan                           | `en-WS`      |           |  | 
| Serbian (Cyrillic)               | `sr-Cyrl-RS` |           | ✔ | 
| Serbian (Latin)                  | `sr-Latn-RS` |           |  | 
| Slovak                           | `sk-SK`      |           | ✔ |
| Slovenian                        | `sl-SI`      |           | ✔ | 
| Spanish                          | `es-ES`      | ✔         |  ✔ |
| Spanish (Mexico)                 | `es-MX`      |           |  ✔| 
| Swedish                          | `sv-SE`      |  ✔        | ✔ | 
| Tamil                            | `ta-IN`      |           | ✔ | 
| Thai                             | `th-TH`      |           |✔  | 
| Tongan                           | `to-TO`      |           | ✔ |
| Turkish                          | `tr-TR`      | ✔         | ✔ | 
| Ukrainian                        | `uk-UA`      |           |✔  |  
| Urdu                             | `ur-PK`      |           | ✔ |  
| Vietnamese                       | `vi-VN`      |           | ✔ |


## Next steps

[Overview](video-indexer-overview.md)
>>>>>>> cec84be48f1d6622b54bed7438b38af16b0b79b8
