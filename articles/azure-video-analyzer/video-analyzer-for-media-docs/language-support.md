---
title: Language support 
description: This article provides a comprehensive list of language support by service features in Azure Video Analyzer for Media (formerly Video Indexer).
author: Juliako
manager: femila
ms.topic: conceptual
ms.author: juliako
ms.date: 02/02/2022
---

# Language support in Video Analyzer for Media

This article provides a comprehensive list of language support by service features in Azure Video Analyzer for Media (formerly Video Indexer). For the list and definions of all the features, seee [Overview](video-indexer-overview.md).

- Transcription (source language of the video/audio file)
- Language identification (LID)
- Multi-language identification  (MLID)
- Translation

  The following insights are translated, otherwise will remain in English:
  
    - Transcript
    - OCR
    - Keywords
    - Topics
    - Labels
    - [NEW] Frame Patters (Only to Hebrew as of now).

- Search in specific language
- Language customization
 
| **Language**                      | **Code**       | **Transcription** | **LID*   | **MLID**  | **Translation** | **Customization** (Speech custom model) |
|:------------:|:------------:|:--------------------:|:-------:|:-------:|:-------------:|:-------------------------------------:|
| Afrikaans                        | `af-ZA`      |               |  |  | TRUE        | TRUE                                |
| Arabic (Iraq)                    | `ar-IQ`      | TRUE               |  |  | TRUE        | TRUE                                |
| Arabic (Israel)                  | `ar-IL`      | TRUE               |  |  | TRUE        | TRUE                                |
| Arabic (Jordan)                  | `ar-JO`      | TRUE               |  |  | TRUE        | TRUE                                |
| Arabic (Kuwait)                  | `ar-KW`      | TRUE               |  |  | TRUE        | TRUE                                |
| Arabic (Lebanon)                 | `ar-LB`      | TRUE               |  |  | TRUE        | TRUE                                |
| Arabic (Oman)                    | `ar-OM`      | TRUE               |  |  | TRUE        | TRUE                                |
| Arabic (Palestinian Authority)   | `ar-PS`      | TRUE               |  |  | TRUE        | TRUE                                |
| Arabic (Qatar)                   | `ar-QA`      | TRUE               |  |  | TRUE        | TRUE                                |
| Arabic (Saudi Arabia)            | `ar-SA`      | TRUE               |  |  | TRUE        | TRUE                                |
| Arabic (United Arab Emirates)    | `ar-AE`      | TRUE               |  |  | TRUE        | TRUE                                |
| Arabic Egypt                     | `ar-EG`      | TRUE               |  |  | TRUE        | TRUE                                |
| Arabic Modern Standard (Bahrain) | `ar-BH`      | TRUE               |  |  | TRUE        | TRUE                                |
| Arabic Syrian Arab Republic      | `ar-SY`      | TRUE               |  |  | TRUE        | TRUE                                |
| Bangla                           | `bn-BD`     |               |  |  | TRUE        | TRUE                                |
| Bosnian                          | `bs-Latn`    |               |  |  | TRUE        | TRUE                                |
| Bulgarian                        | `bg-BG`      |               |  |  | TRUE        | TRUE                                |
| Catalan                          | `ca-ES`      |               |  |  | TRUE        | TRUE                                |
| Chinese (Cantonese Traditional)  | `zh-HK`      | TRUE               |  | TRUE  | TRUE        | TRUE                                |
| Chinese (Simplified)             | `zh-Hans`    | TRUE               |  |  | TRUE        | TRUE                                |
| Chinese (Traditional)            | `zh-Hant`    |               |  |  | TRUE        | TRUE                                |
| Croatian                         | `hr-HR`      |               |  |  | TRUE        | TRUE                                |
| Czech                            | `cs-CZ`      | TRUE               |  |  | TRUE        | TRUE                                |
| Danish                           | `da-DK`      | TRUE               |  |  | TRUE        | TRUE                                |
| Dutch                            | `nl-NL`      | TRUE               |  |  | TRUE        | TRUE                                |
| English Australia                | `en-AU`      | TRUE               |  |  | TRUE        | TRUE                                |
| English United Kingdom           | `en-GB`      | TRUE               |  |  | TRUE        | TRUE                                |
| English United States            | `en-US`      | TRUE               | TRUE  | TRUE  | TRUE        | TRUE                                |
| Estonian                         | `et-EE`      |               |  |  | TRUE        | TRUE                                |
| Fijian                           | `en-FJ`      |               |  |  | TRUE        | TRUE                                |
| Filipino                         | `fil-PH`     |               |  |  | TRUE        | TRUE                                |
| Finnish                          | `fi-FI`      | TRUE               |  |  | TRUE        | TRUE                                |
| French                           | `fr-FR`      | TRUE               | TRUE  | TRUE  | TRUE        | TRUE                                |
| French (Canada)                  | `fr-CA`      | TRUE               |  |  | TRUE        | TRUE                                |
| German                           | `de-DE`      | TRUE               | TRUE  | TRUE  | TRUE        | TRUE                                |
| Greek                            | `el-GR`      |               |  |  | TRUE        | TRUE                                |
| Haitian                          | `fr-HT`      |               |  |  | TRUE        | TRUE                                |
| Hebrew                           | `he-IL`      | TRUE               |  |  | TRUE        | TRUE                                |
| Hindi                            | `hi-IN`      | TRUE               |  |  | TRUE        | TRUE                                |
| Hungarian                        | `hu-HU`      |               |  |  | TRUE        | TRUE                                |
| Indonesian                       | `id-ID`      |               |  |  | TRUE        | TRUE                                |
| Italian                          | `it-IT`      | TRUE               | TRUE  |  | TRUE        | TRUE                                |
| Japanese                         | `ja-JP`      | TRUE               | TRUE  |  | TRUE        | TRUE                                |
| Kiswahili                        | `sw-KE`      |               |  |  | TRUE        | TRUE                                |
| Korean                           | `ko-KR`      | TRUE               |  |  | TRUE        | TRUE                                |
| Latvian                          | `lv-LV`      |               |  |  | TRUE        | TRUE                                |
| Lithuanian                       | `lt-LT`      |               |  |  | TRUE        | TRUE                                |
| Malagasy                         | `mg-MG`      |               |  |  | TRUE        | TRUE                                |
| Malay                            | `ms-MY`      |               |  |  | TRUE        | TRUE                                |
| Maltese                          | `mt-MT`      |               |  |  | TRUE        | TRUE                                |
| Norwegian                        | `nb-NO`      | TRUE               |  |  | TRUE        | TRUE                                |
| Persian                          | `fa-IR`      | TRUE               |  |  | TRUE        | TRUE                                |
| Polish                           | `pl-PL`      | TRUE               |  |  | TRUE        | TRUE                                |
| Portuguese                       | `pt-BR`      | TRUE               | TRUE  |  | TRUE        | TRUE                                |
| Portuguese (Portugal)            | `pt-PT`      | TRUE               |  |  | TRUE        | TRUE                                |
| Romanian                         | `ro-RO`      |               |  |  | TRUE        | TRUE                                |
| Russian                          | `ru-RU`      | TRUE               | TRUE  |  | TRUE        | TRUE                                |
| Samoan                           | `en-WS`      |               | FALSE | FALSE | TRUE        | TRUE                                |
| Serbian (Cyrillic)               | `sr-Cyrl-RS` |               | FALSE | FALSE | TRUE        | TRUE                                |
| Serbian (Latin)                  | `sr-Latn-RS` |               | FALSE | FALSE | TRUE        | TRUE                                |
| Slovak                           | `sk-SK`      |               | FALSE | FALSE | TRUE        | TRUE                                |
| Slovenian                        | `sl-SI`      |               | FALSE | FALSE | TRUE        | TRUE                                |
| Spanish                          | `es-ES`      | TRUE               | TRUE  | TRUE  | TRUE        | TRUE                                |
| Spanish (Mexico)                 | `es-MX`      | TRUE               |  |  | TRUE        | TRUE                                |
| Swedish                          | `sv-SE`      | TRUE               |  |  | TRUE        | TRUE                                |
| Tamil                            | `ta-IN`      |               |  |  | TRUE        | TRUE                                |
| Thai                             | `th-TH`      | TRUE               |  |  | TRUE        | TRUE                                |
| Tongan                           | `to-TO`      |               |  |  | TRUE        | TRUE                                |
| Turkish                          | `tr-TR`      | TRUE               |  |  | TRUE        | TRUE                                |
| Ukrainian                        | `uk-UA`      |               |  |  | TRUE        | TRUE                                |
| Urdu                             | `ur-PK`      |               |  |  | TRUE        | TRUE                                |
| Vietnamese                       | `vi-VN`      |               |  |  | TRUE        | TRUE                                |

## Next steps

[Overview](video-indexer-overview.md)
