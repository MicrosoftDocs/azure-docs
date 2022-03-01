
---
title: Language support 
description: This article provides a comprehensive list of language support by service feature in Azure Video Analyzer for Media (formerly Video Indexer).
author: Juliako
manager: femila
ms.topic: conceptual
ms.author: juliako
ms.date: 02/02/2022
---

# Language support in Video Analyzer for Media

The artical provides tables of supported languages in the following featues in Azure Video Analyzer for Media: 

- Transcription (source language of the video/audio file)
- Language identification (LID)
- Multi-language identification  (MLID)
- Translation. The table describes the supported languages. 

  The following insights are translated, otherwise will remain in English
  
    - Transcript
    - OCR
    - Keywords
    - Topics
    - Labels
    - [NEW] Frame Patters (Only to Hebrew as of now).

- Search in specific language
- Language customization
 

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
