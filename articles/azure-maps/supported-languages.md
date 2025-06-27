---
title: Localization support in Microsoft Azure Maps
description: Lists the regions Azure Maps supports with services such as maps, search, routing, weather, and traffic incidents, and shows how to set up the View parameter.
author: faterceros
ms.author: aterceros
ms.date: 06/12/2025
ms.topic: conceptual
ms.service: azure-maps
ms.subservice: general
zone_pivot_groups: azure-maps-coverage
---

# Localization support in Azure Maps

Azure Maps supports various languages and views based on country/region. This article provides the supported languages and views to help guide your Azure Maps implementation.

## Azure Maps supported languages

> [!NOTE]
> For supported cultures, street names are localized to the local language. For instance, if you request a location in France, the street names are in French. However, the level of localization for other data, such as country or region names, can vary by culture. For example, not every culture code can have a localized name for 'United States.'

Azure Maps is localized in variety languages across its services. The following table provides the supported language codes for each service.

::: zone pivot="service-previous"
<!------------------------REST API PREVIOUS VERSIONS ------------------------------------------------->

Azure Maps offers localization in a wide range of languages across its various services. The following table lists the supported language codes for previous versions of its services. The Route column includes routes for driving, truck routes, and walking.

| Culture    | Language                                 | Render | Search | Route | Traffic | Weather |
|------------|------------------------------------------|:------:|:------:|:-----:|:-------:|:-------:|
| af-ZA      | Afrikaans                                |      |  ✓     |    ✓    |         |        |
| ar         | Arabic                                   | ✓    |  ✓     |    ✓    |    ✓    |    ✓  |
| bg-BG      | Bulgarian                                | ✓    |  ✓     |    ✓    |         |  ✓     |
| bn-BD      | Bangla (Bangladesh)                      |      |        |          |         |  ✓     |
| bn-IN      | Bangla (India)                           |      |        |          |         |  ✓     |
| bs-BA      | Bosnian                                  |      |        |          |         |  ✓     |
| ca-ES      | Catalan                                  |      |  ✓     |          |         |  ✓     |
| cs-CZ      | Czech                                    | ✓    |  ✓     |    ✓    |    ✓    |  ✓     |
| da-DK      | Danish                                   | ✓    |  ✓     |    ✓    |    ✓    |  ✓     |
| de-DE      | German                                   | ✓    |  ✓     |    ✓    |    ✓    |  ✓     |
| el-GR      | Greek                                    | ✓    |  ✓     |    ✓    |    ✓    |  ✓     |
| en-AU      | English (Australia)                      | ✓    |  ✓     |         |         |    ✓    |
| en-NZ      | English (New Zealand)                    | ✓    |  ✓     |         |    ✓    |    ✓    |
| en-GB      | English (United Kingdom)                 | ✓    |  ✓     |    ✓    |    ✓    |  ✓     |
| en-US      | English (USA)                            | ✓    |  ✓     |    ✓    |    ✓    |    ✓    |
| es-419     | Spanish (Latin America)                  |      |  ✓     |         |          |    ✓    |
| es-ES      | Spanish (Spain)                          | ✓    |  ✓     |    ✓    |    ✓    |    ✓    |
| es-MX      | Spanish (Mexico)                         | ✓    |        |    ✓    |         |    ✓    |
| et-EE      | Estonian                                 |      |  ✓     |         |    ✓    |    ✓    |
| eu-ES      | Basque                                   |      |  ✓     |         |         |          |
| fi-FI      | Finnish                                  | ✓    |  ✓     |    ✓    |    ✓    |    ✓    |
| fil-PH     | Filipino                                 |      |        |          |         |    ✓    |
| fr-CA      | French (Canada)                          |      |  ✓     |          |         |    ✓    |
| fr-FR      | French (France)                          | ✓    |  ✓     |    ✓    |    ✓    |    ✓    |
| gl-ES      | Galician                                 |      |  ✓     |          |         |         |
| gu-IN      | Gujarati                                 |      |        |          |         |    ✓    |
| he-IL      | Hebrew                                   |      |  ✓     |          |  ✓     |    ✓    |
| hi-IN      | Hindi                                    |      |        |          |         |    ✓    |
| hr-HR      | Croatian                                 |      |  ✓     |          |         |    ✓    |
| hu-HU      | Hungarian                                | ✓    |  ✓     |    ✓    |    ✓    |    ✓    |
| id-ID      | Indonesian                               | ✓    |  ✓     |    ✓    |    ✓    |    ✓    |
| is-IS      | Icelandic                                |      |        |          |         |    ✓    |
| it-IT      | Italian                                  | ✓    |  ✓     |    ✓    |    ✓    |    ✓    |
| ja-JP      | Japanese                                 |      |        |          |         |    ✓    |
| kk-KZ      | Kazakh                                   |      |  ✓     |          |         |    ✓    |
| kn-IN      | Kannada                                  |      |        |          |         |    ✓    |
| ko-KR      | Korean                                   | ✓    |        |    ✓    |         |    ✓    |
| lt-LT      | Lithuanian                               | ✓    |  ✓     |    ✓    |    ✓    |    ✓    |
| lv-LV      | Latvian                                  |      |  ✓     |         |    ✓    |    ✓    |
| mk-MK      | Macedonian                               |      |        |          |         |    ✓    |
| mr-IN      | Marathi                                  |      |        |          |         |    ✓    |
| ms-MY      | Malay                                    | ✓    |  ✓     |    ✓    |         |    ✓    |
| nb-NO      | Norwegian Bokmål                         | ✓    |  ✓     |    ✓    |    ✓    |  ✓     |
| NGT        | Neutral Ground Truth (Local)<sup>1</sup> | ✓    |  ✓     |         |         |         |
| NGT-Latn   | Neutral Ground Truth (Latin)<sup>2</sup> | ✓    |  ✓     |         |         |         |
| nl-BE      | Dutch (Belgium)                          |      |  ✓     |         |         |    ✓    |
| nl-NL      | Dutch (Netherlands)                      | ✓    |  ✓     |    ✓    |    ✓    |    ✓    |
| pa-IN      | Punjabi                                  |      |        |          |         |    ✓    |
| pl-PL      | Polish                                   | ✓    |  ✓     |    ✓    |    ✓    |    ✓    |
| pt-BR      | Portuguese (Brazil)                      | ✓    |  ✓     |    ✓    |         |    ✓    |
| pt-PT      | Portuguese (Portugal)                    | ✓    |  ✓     |    ✓    |    ✓    |    ✓    |
| ro-RO      | Romanian                                 |      |  ✓     |          |    ✓    |    ✓    |
| ru-RU      | Russian                                  | ✓    |  ✓     |    ✓    |    ✓    |    ✓    |
| sk-SK      | Slovak                                   | ✓    |  ✓     |    ✓    |    ✓    |    ✓    |
| sl-SI      | Slovenian                                | ✓    |  ✓     |    ✓    |         |    ✓    |
| sr-Cyrl-RS | Serbian (Cyrillic)                       |      |  ✓     |          |         |    ✓    |
| sr-Latn-RS | Serbian (Latin)                          |      |        |          |         |    ✓    |
| sv-SE      | Swedish                                  | ✓    |  ✓     |    ✓    |    ✓    |    ✓    |
| ta-IN      | Tamil                                    |      |        |          |         |    ✓    |
| te-IN      | Telugu                                   |      |        |          |         |    ✓    |
| th-TH      | Thai                                     | ✓    |  ✓     |    ✓    |    ✓    |    ✓    |
| tr-TR      | Turkish                                  | ✓    |  ✓     |    ✓    |    ✓    |    ✓    |
| uk-UA      | Ukrainian                                |      |  ✓     |          |         |    ✓    |
| ur-PK      | Urdu                                     |      |        |          |         |    ✓    |
| uz-Latn-UZ | Uzbek                                    |      |        |          |         |    ✓    |
| vi-VN      | Vietnamese                               |      |  ✓     |          |         |    ✓    |
| zh-HanS-CN | Chinese (Simplified, China)              | ✓    |  ✓     |         |         |    ✓    |
| zh-HanT-HK | Chinese (Traditional, Hong Kong SAR)     |      |        |          |         |    ✓    |
| zh-HanT-TW | Chinese (Traditional, Taiwan)            | ✓    |  ✓     |    ✓    |         |    ✓    |

<sup>1</sup> Neutral Ground Truth (Local) - Official languages for all regions in local scripts if available<br>
<sup>2</sup> Neutral Ground Truth (Latin) - Latin exonyms are used if available

::: zone-end

::: zone pivot="service-latest"
<!------------------------REST API LATEST VERSIONS ------------------------------------------------->

> [!NOTE]
> The Weather service is not included in this section because it supports localization for cultures listed in the "Previous" tab of this article.

Azure Maps offers localization in a wide range of languages across its various services. The following table lists the supported language codes for the latest services. The Route column includes routes for both driving and walking.

| Language                                   | Search | Route | Traffic | Truck Route |
|--------------------------------------------|--------|-------|---------|-------------|
| Afrikaans                                  | ✓      | ✓     |         | ✓          |
| Albanian                                   | ✓      |       |         |             |
| Amharic                                    | ✓      |       |         |             |
| Arabic (Saudi Arabia)                      | ✓      |       |         | ✓           |
| Armenian                                   | ✓      | ✓     | ✓       |            |
| Assamese                                   | ✓      |       |         |             |
| Azerbaijani (Latin)                        | ✓      |       |         |             |
| Bangla (Bangladesh)                        | ✓      |       |         |             |
| Bangla (India)                             | ✓      |       |         |             |
| Basque                                     | ✓      |       |         |             |
| Belarusian                                 | ✓      |       |         |             |
| Bosnian (Latin)                            | ✓      |       |         |             |
| Bulgarian                                  | ✓      | ✓     |         | ✓          |
| Catalan Spanish                            | ✓      |       |         |             |
| Central Kurdish                            | ✓      |       |         |             |
| Chinese (Traditional)                      | ✓      |       |         |             |
| Chinese (Traditional, Taiwan)              | ✓      | ✓     |         | ✓          |
| Croatian                                   | ✓      |       |         |             |
| Czech                                      | ✓      | ✓     | ✓       | ✓          |
| Danish                                     | ✓      | ✓     | ✓       | ✓          |
| Dari                                       | ✓      |       |         |             |
| Dutch (Belgium)                            | ✓      |       |         |             |
| Dutch (Netherlands)                        | ✓      | ✓     | ✓       | ✓          |
| English (New Zealand)                      |        |       | ✓       |             |
| English (United Kingdom)                   | ✓      | ✓     | ✓       | ✓          |
| English (United States)                    | ✓      | ✓     | ✓       | ✓          |
| Estonian                                   | ✓      |       | ✓       |             |
| Filipino                                   | ✓      |       |         |             |
| Finnish                                    | ✓      | ✓     | ✓       | ✓          |
| French (Canada)                            | ✓      |       |         |             |
| French (France)                            | ✓      | ✓     | ✓       | ✓          |
| Galician                                   | ✓      |       |         |             |
| Georgian                                   | ✓      |       |         |             |
| German (Germany)                           | ✓      | ✓     | ✓       | ✓          |
| Greek                                      | ✓      | ✓     | ✓       | ✓          |
| Gujarati                                   | ✓      |       |         |             |
| Hausa (Latin)                              | ✓      |       |         |             |
| Hebrew                                     | ✓      |       | ✓       |             |
| Hindi                                      | ✓      |       |         |             |
| Hungarian                                  | ✓      | ✓     | ✓       | ✓          |
| Icelandic                                  | ✓      |       |         |             |
| Igbo                                       | ✓      |       |         |             |
| Indonesian                                 | ✓      | ✓     | ✓       | ✓          |
| Irish                                      | ✓      |       |         |             |
| isiXhosa                                   | ✓      |       |         |             |
| isiZulu                                    | ✓      |       |         |             |
| Italian (Italy)                            | ✓      | ✓     | ✓       | ✓          |
| Japanese                                   | ✓      |       |         |             |
| K’iche’                                    | ✓      |       |         |             |
| Kannada                                    | ✓      |       |         |             |
| Kazakh                                     | ✓      |       |         |             |
| Khmer                                      | ✓      |       |         |             |
| Kinyarwanda                                | ✓      |       |         |             |
| Kiswahili                                  | ✓      |       |         |             |
| Konkani                                    | ✓      |       |         |             |
| Korean                                     | ✓      | ✓     |         | ✓          |
| Kyrgyz                                     | ✓      |       |         |             |
| Latvian                                    | ✓      |       | ✓       |             |
| Lithuanian                                 | ✓      | ✓     | ✓       | ✓          |
| Luxembourgish                              | ✓      |       |         |             |
| Macedonian                                 | ✓      |       |         |             |
| Malay (Malaysia)                           | ✓      | ✓     |         | ✓          |
| Malayalam                                  | ✓      |       |         |             |
| Maltese                                    | ✓      |       |         |             |
| Maori                                      | ✓      |       |         |             |
| Marathi                                    | ✓      |       |         |             |
| Mongolian (Cyrillic)                       | ✓      |       |         |             |
| Nepali (Nepal)                             | ✓      |       |         |             |
| Norwegian (Bokmål)                         | ✓      | ✓     | ✓       | ✓          |
| Norwegian (Nynorsk)                        | ✓      |       |         |             |
| Odia                                       | ✓      |       |         |             |
| Persian                                    | ✓      |       |         |             |
| Polish                                     | ✓      | ✓     | ✓       | ✓          |
| Portuguese (Brazil)                        | ✓      | ✓     |         | ✓           |
| Portuguese (Portugal)                      | ✓      | ✓     | ✓       | ✓          |
| Punjabi (Arabic)                           | ✓      |       |         |             |
| Punjabi (Gurmukhi)                         | ✓      |       |         |             |
| Quechua (Peru)                             | ✓      |       |         |             |
| Romanian (Romania)                         | ✓      |       | ✓       |             |
| Russian                                    | ✓      | ✓     | ✓       | ✓          |
| Scottish Gaelic                            | ✓      |       |         |             |
| Serbian (Cyrillic, Bosnia and Herzegovina) | ✓      |       |         |             |
| Serbian (Cyrillic, Serbia)                 | ✓      |       |         |             |
| Serbian (Latin, Serbia)                    | ✓      |       |         |             |
| Sesotho sa Leboa                           | ✓      |       |         |             |
| Setswana                                   | ✓      |       |         |             |
| Sindhi (Arabic)                            | ✓      |       |         |             |
| Sinhala                                    | ✓      |       |         |             |
| Slovak                                     | ✓      | ✓     | ✓       | ✓          |
| Slovenian                                  | ✓      | ✓     |         | ✓          |
| Spanish (Mexico)                           | ✓      | ✓     |         | ✓          |
| Spanish (Spain)                            | ✓      | ✓     | ✓       | ✓          |
| Swedish (Sweden)                           | ✓      | ✓     | ✓       | ✓          |
| Tajik (Cyrillic)                           | ✓      |       |         |             |
| Tamil                                      | ✓      |       |         |             |
| Tatar (Cyrillic)                           | ✓      |       |         |             |
| Telugu                                     | ✓      |       |         |             |
| Thai                                       | ✓      | ✓     | ✓       | ✓          |
| Tigrinya                                   | ✓      |       |         |             |
| Turkish                                    | ✓      | ✓     | ✓       | ✓          |
| Turkmen (Latin)                            | ✓      |       |         |             |
| Ukrainian                                  | ✓      |       |         |             |
| Urdu                                       | ✓      |       |         |             |
| Uyghur                                     | ✓      |       |         |             |
| Uzbek (Latin)                              | ✓      |       |         |             |
| Valencian                                  | ✓      |       |         |             |
| Vietnamese                                 | ✓      |       |         |             |
| Welsh                                      | ✓      |       |         |             |
| Wolof                                      | ✓      |       |         |             |
| Yoruba                                     | ✓      |

<!----------------------------------------------------------------------------------------------------------
| Culture          |  Language                                    | Search, Route & Traffic |  Truck Route  |
|------------------|----------------------------------------------|:-----------------------:|:-------------:|
|  af              |  Afrikaans                                   |  ✓                      |  ✓           |
|  sq              |  Albanian                                    |  ✓                      |               |
|  am              |  Amharic                                     |  ✓                      |               |
|  ar-sa           |  Arabic (Saudi Arabia)                       |  ✓                      |  ✓           |
|  hy              |  Armenian                                    |  ✓                      |               |
|  as              |  Assamese                                    |  ✓                      |               |
|  az-Latn         |  Azerbaijani (Latin)                         |  ✓                      |               |
|  bn-BD           |  Bangla (Bangladesh)                         |  ✓                      |               |
|  bn-IN           |  Bangla (India)                              |  ✓                      |               |
|  eu              |  Basque                                      |  ✓                      |               |
|  be              |  Belarusian                                  |  ✓                      |               |
|  bs              |  Bosnian (Latin)                             |  ✓                      |               |
|  bg              |  Bulgarian                                   |  ✓                      |  ✓           |
|  ca              |  Catalan Spanish                             |  ✓                      |               |
|  ku-Arab         |  Central Kurdish                             |  ✓                      |               |
|  zh-Hant         |  Chinese (Traditional)                       |  ✓                      |               |
|  zh-HanT-TW      |  Chinese (Traditional, Taiwan)               |  ✓                      |  ✓           |
|  hr              |  Croatian                                    |  ✓                      |               |
|  cs              |  Czech                                       |  ✓                      |  ✓           |
|  da              |  Danish                                      |  ✓                      |  ✓           |
|  prs-Arab        |  Dari                                        |  ✓                      |               |
|  nl-BE           |  Dutch (Belgium)                             |  ✓                      |               |
|  nl-NL           |  Dutch (Netherlands)                         |  ✓                      |  ✓           |
|  en-GB           |  English (United Kingdom)                    |  ✓                      |  ✓           |
|  en-US           |  English (United States)                     |  ✓                      |  ✓           |
|  et              |  Estonian                                    |  ✓                      |               |
|  fil-Latn        |  Filipino                                    |  ✓                      |               |
|  fi              |  Finnish                                     |  ✓                      |  ✓           |
|  fr-CA           |  French (Canada)                             |  ✓                      |               |
|  fr-FR           |  French (France)                             |  ✓                      |  ✓           |
|  gl              |  Galician                                    |  ✓                      |               |
|  ka              |  Georgian                                    |  ✓                      |               |
|  de-de           |  German (Germany)                            |  ✓                      |  ✓           |
|  el              |  Greek                                       |  ✓                      |  ✓           |
|  gu              |  Gujarati                                    |  ✓                      |               |
|  ha-Latn         |  Hausa (Latin)                               |  ✓                      |               |
|  he              |  Hebrew                                      |  ✓                      |               |
|  hi              |  Hindi                                       |  ✓                      |               |
|  hu              |  Hungarian                                   |  ✓                      |  ✓           |
|  is              |  Icelandic                                   |  ✓                      |               |
|  ig-Latn         |  Igbo                                        |  ✓                      |               |
|  id              |  Indonesian                                  |  ✓                      |  ✓           |
|  ga              |  Irish                                       |  ✓                      |               |
|  xh              |  isiXhosa                                    |  ✓                      |               |
|  zu              |  isiZulu                                     |  ✓                      |               |
|  it              |  Italian (Italy)                             |  ✓                      |  ✓           |
|  ja              |  Japanese                                    |  ✓                      |               |
|  qut-Latn        |  K’iche’                                     |  ✓                      |               |
|  kn              |  Kannada                                     |  ✓                      |               |
|  kk              |  Kazakh                                      |  ✓                      |               |
|  km              |  Khmer                                       |  ✓                      |               |
|  rw              |  Kinyarwanda                                 |  ✓                      |               |
|  sw              |  Kiswahili                                   |  ✓                      |               |
|  kok             |  Konkani                                     |  ✓                      |               |
|  ko              |  Korean                                      |  ✓                      |  ✓           |
|  ky-Cyrl         |  Kyrgyz                                      |  ✓                      |               |
|  lv              |  Latvian                                     |  ✓                      |               |
|  lt              |  Lithuanian                                  |  ✓                      |  ✓           |
|  lb              |  Luxembourgish                               |  ✓                      |               |
|  mk              |  Macedonian                                  |  ✓                      |               |
|  ms              |  Malay (Malaysia)                            |  ✓                      |  ✓           |
|  ml              |  Malayalam                                   |  ✓                      |               |
|  mt              |  Maltese                                     |  ✓                      |               |
|  mi-Latn         |  Maori                                       |  ✓                      |               |
|  mr              |  Marathi                                     |  ✓                      |               |
|  mn-Cyrl         |  Mongolian (Cyrillic)                        |  ✓                      |               |
|  ne              |  Nepali (Nepal)                              |  ✓                      |               |
|  nb              |  Norwegian (Bokmål)                          |  ✓                      |  ✓           |
|  nn              |  Norwegian (Nynorsk)                         |  ✓                      |               |
|  or              |  Odia                                        |  ✓                      |               |
|  fa              |  Persian                                     |  ✓                      |               |
|  pl              |  Polish                                      |  ✓                      |  ✓           |
|  pt-BR           |  Portuguese (Brazil)                         |  ✓                      |  ✓           |
|  pt-PT           |  Portuguese (Portugal)                       |  ✓                      |  ✓           |
|  pa-Arab         |  Punjabi (Arabic)                            |  ✓                      |               |
|  pa              |  Punjabi (Gurmukhi)                          |  ✓                      |               |
|  quz             |  Quechua (Peru)                              |  ✓                      |               |
|  ro              |  Romanian (Romania)                          |  ✓                      |               |
|  ru              |  Russian                                     |  ✓                      |  ✓           |
|  gd-Latn         |  Scottish Gaelic                             |  ✓                      |               |
|  sr-Cyrl-BA      |  Serbian (Cyrillic, Bosnia and Herzegovina)  |  ✓                      |               |
|  sr-Cyrl-RS      |  Serbian (Cyrillic, Serbia)                  |  ✓                      |               |
|  sr-Latn-RS      |  Serbian (Latin, Serbia)                     |  ✓                      |               |
|  nso             |  Sesotho sa Leboa                            |  ✓                      |               |
|  tn              |  Setswana                                    |  ✓                      |               |
|  sd-Arab         |  Sindhi (Arabic)                             |  ✓                      |               |
|  si              |  Sinhala                                     |  ✓                      |               |
|  sk              |  Slovak                                      |  ✓                      |  ✓           |
|  sl              |  Slovenian                                   |  ✓                      |  ✓           |
|  es-MX           |  Spanish (Mexico)                            |  ✓                      |  ✓           |
|  es-ES           |  Spanish (Spain)                             |  ✓                      |  ✓           |
|  sv              |  Swedish (Sweden)                            |  ✓                      |  ✓           |
|  tg-Cyrl         |  Tajik (Cyrillic)                            |  ✓                      |               |
|  ta              |  Tamil                                       |  ✓                      |               |
|  tt-Cyrl         |  Tatar (Cyrillic)                            |  ✓                      |               |
|  te              |  Telugu                                      |  ✓                      |               |
|  th              |  Thai                                        |  ✓                      |  ✓           |
|  ti              |  Tigrinya                                    |  ✓                      |               |
|  tr              |  Turkish                                     |  ✓                      |  ✓           |
|  tk-Latn         |  Turkmen (Latin)                             |  ✓                      |               |
|  uk              |  Ukrainian                                   |  ✓                      |               |
|  ur              |  Urdu                                        |  ✓                      |               |
|  ug-Arab         |  Uyghur                                      |  ✓                      |               |
|  uz-Latn         |  Uzbek (Latin)                               |  ✓                      |               |
|  ca-ES-valencia  |  Valencian                                   |  ✓                      |               |
|  vi              |  Vietnamese                                  |  ✓                      |               |
|  cy              |  Welsh                                       |  ✓                      |               |
|  wo              |  Wolof                                       |  ✓                      |               |
|  yo-Latn         |  Yoruba                                      |  ✓                      |               |
------------------------------------------------------------------------------------------------------------->
::: zone-end

## Azure Maps supported views

You need to configure the View parameter as required for the REST APIs and the Web SDK, for the services being used.

Azure Maps **View** parameter (also referred to as "user region parameter") is a two letter ISO-3166 country/region Code that shows the correct maps for that country/region specifying which set of geopolitically disputed content is returned via Azure Maps services, including borders and labels displayed on the map.

### REST APIs
  
Configuring the View parameter is required. This parameter determines which set of geopolitically disputed content is returned by Azure Maps services.

Affected Azure Maps REST services:

::: zone pivot="service-previous"
<!------------------------REST API PREVIOUS VERSIONS ------------------------------------------------->

Search

* Get Search Fuzzy
* Get Search POI
* Get Search POI Category
* Get Search Nearby
* Get Search Address
* Get Search Address Structured
* Get Search Address Reverse
* Get Search Address Reverse Cross Street
* Post Search Inside Geometry
* Post Search Address Batch
* Post Search Address Reverse Batch
* Post Search Along Route
* Post Search Fuzzy Batch

Render

* Get Map Tile
* Get Map Image

::: zone-end

::: zone pivot="service-latest"
<!------------------------REST API LATEST VERSIONS ------------------------------------------------->

Search

* Get Geocoding
* Get Geocoding Batch
* Get Polygon
* Get Reverse Geocoding
* Get Reverse Geocoding Batch

Render

* Get Map Static Image
* Get Map Tile

::: zone-end

### SDKs

You need to have the latest version of Web SDK and configure the View parameter as required. This parameter determines which set of geopolitically disputed content the Azure Maps service returns.

By default, the View parameter is set to **Unified**, even if not defined in the request. Determine the location of your users. Then, set the **View** parameter correctly for that location. Alternatively, you can set 'View=Auto', which returns the map data based on the IP address of the request.  The **View** parameter in Azure Maps must be used in compliance with applicable laws, including those laws about mapping of the country/region where maps, images, and other data and third-party content that you're authorized to access via Azure Maps is made available.

The following table provides supported views.

::: zone pivot="service-previous"
<!------------------------REST API LATEST VERSIONS ------------------------------------------------->

| View    | Description                                                 | Maps | Search |
|---------|-------------------------------------------------------------|:----:|:------:|
| AE      | United Arab Emirates (Arabic View)                          |  ✓   |        |
| AR      | Argentina (Argentinian View)                                |  ✓   |  ✓     |
| BH      | Bahrain (Arabic View)                                       |  ✓   |        |
| IN      | India (Indian View)                                         |  ✓   |  ✓     |
| IQ      | Iraq (Arabic View)                                          |  ✓   |        |
| JO      | Jordan (Arabic View)                                        |  ✓   |        |
| KW      | Kuwait (Arabic View)                                        |  ✓   |        |
| LB      | Lebanon (Arabic View)                                       |  ✓   |        |
| MA      | Morocco (Moroccan View)                                     |  ✓   |  ✓     |
| OM      | Oman (Arabic View)                                          |  ✓   |        |
| PK      | Pakistan (Pakistani View)                                   |  ✓   |  ✓     |
| PS      | Palestinian Authority (Arabic View)                         |  ✓   |        |
| QA      | Qatar (Arabic View)                                         |  ✓   |        |
| SA      | Saudi Arabia (Arabic View)                                  |  ✓   |        |
| SY      | Syria (Arabic View)                                         |  ✓   |        |
| YE      | Yemen (Arabic View)                                         |  ✓   |        |
| Auto    | Automatically detect based on request                       |  ✓   |  ✓     |
| Unified | Unified View (Others)                                       |  ✓   |  ✓     |

::: zone-end

::: zone pivot="service-latest"
<!------------------------REST API LATEST VERSIONS ------------------------------------------------->

| View    | Description                                                 | Maps | Search |
|---------|-------------------------------------------------------------|:----:|:------:|
| AE      | United Arab Emirates (Arabic View)                          |  ✓   |        |
| AR      | Argentina (Argentinian View)                                |  ✓   |  ✓     |
| BH      | Bahrain (Arabic View)                                       |  ✓   |        |
| IN      | India (Indian View)                                         |  ✓   |  ✓     |
| IQ      | Iraq (Arabic View)                                          |  ✓   |        |
| JO      | Jordan (Arabic View)                                        |  ✓   |        |
| KW      | Kuwait (Arabic View)                                        |  ✓   |        |
| LB      | Lebanon (Arabic View)                                       |  ✓   |        |
| MA      | Morocco (Moroccan View)                                     |  ✓   |  ✓     |
| OM      | Oman (Arabic View)                                          |  ✓   |        |
| PK      | Pakistan (Pakistani View)                                   |  ✓   |  ✓     |
| PS      | Palestinian Authority (Arabic View)                         |  ✓   |        |
| QA      | Qatar (Arabic View)                                         |  ✓   |        |
| SA      | Saudi Arabia (Arabic View)                                  |  ✓   |        |
| SY      | Syria (Arabic View)                                         |  ✓   |        |
| US      | United States of America                                    |      |   ✓    |
| YE      | Yemen (Arabic View)                                         |  ✓   |        |
| Auto    | Automatically detect based on request                       |  ✓   |  ✓     |
| Unified | Unified View (Others)                                       |  ✓   |  ✓     |

::: zone-end
