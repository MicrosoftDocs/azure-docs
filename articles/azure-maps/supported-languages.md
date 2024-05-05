---
title: Localization support in Microsoft Azure Maps
description: Lists the regions Azure Maps supports with services such as maps, search, routing, weather, and traffic incidents, and shows how to set up the View parameter.
author: eriklindeman
ms.author: eriklind
ms.date: 01/05/2022
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
---

# Localization support in Azure Maps

Azure Maps supports various languages and views based on country/region. This article provides the supported languages and views to help guide your Azure Maps implementation.

## Azure Maps supported languages

Azure Maps have been localized in variety languages across its services. The following table provides the supported language codes for each service.
  
| Code       | Name                                     | Maps | Search | Routing | Traffic | Weather |
|------------|------------------------------------------|:----:|:------:|:-------:|:-------:|:-------:|
| af-ZA      | Afrikaans                                |      |    ✓   |    ✓    |         |        |
| ar         | Arabic                                   | ✓    |    ✓   |    ✓    |    ✓    |    ✓  |
| bg-BG      | Bulgarian                                | ✓    |    ✓   |    ✓    |         |    ✓   |
| bn-BD      | Bangla (Bangladesh)                      |      |        |          |         |    ✓   |
| bn-IN      | Bangla (India)                           |      |        |          |         |    ✓   |
| bs-BA      | Bosnian                                  |      |        |          |         |    ✓   |
| ca-ES      | Catalan                                  |      |    ✓   |          |         |    ✓   |
| cs-CZ      | Czech                                    | ✓    |    ✓   |    ✓    |    ✓    |    ✓   |
| da-DK      | Danish                                   | ✓    |    ✓   |    ✓    |    ✓    |    ✓   |
| de-DE      | German                                   | ✓    |    ✓   |    ✓    |    ✓    |    ✓   |
| el-GR      | Greek                                    | ✓    |    ✓   |    ✓    |    ✓    |    ✓   |
| en-AU      | English (Australia)                      | ✓    |    ✓   |         |         |    ✓    |
| en-NZ      | English (New Zealand)                    | ✓    |    ✓   |         |    ✓    |    ✓    |
| en-GB      | English (United Kingdom)                 | ✓    |    ✓   |    ✓    |    ✓    |    ✓   |
| en-US      | English (USA)                            | ✓    |    ✓   |    ✓    |    ✓    |    ✓    |
| es-419     | Spanish (Latin America)                  |      |    ✓   |         |          |    ✓    |
| es-ES      | Spanish (Spain)                          | ✓    |    ✓   |    ✓    |    ✓    |    ✓    |
| es-MX      | Spanish (Mexico)                         | ✓    |        |    ✓    |         |    ✓    |
| et-EE      | Estonian                                 |      |    ✓   |         |    ✓    |    ✓    |
| eu-ES      | Basque                                   |      |    ✓   |         |         |          |
| fi-FI      | Finnish                                  | ✓    |    ✓   |    ✓    |    ✓    |    ✓    |
| fil-PH     | Filipino                                 |      |        |          |         |    ✓    |
| fr-CA      | French (Canada)                          |      |    ✓   |          |         |    ✓    |
| fr-FR      | French (France)                          | ✓    |    ✓   |    ✓    |    ✓    |    ✓    |
| gl-ES      | Galician                                 |      |    ✓   |          |         |         |
| gu-IN      | Gujarati                                 |      |        |          |         |    ✓    |
| he-IL      | Hebrew                                   |      |    ✓   |          |    ✓   |    ✓    |
| hi-IN      | Hindi                                    |      |        |          |         |    ✓    |
| hr-HR      | Croatian                                 |      |    ✓   |          |         |    ✓    |
| hu-HU      | Hungarian                                | ✓    |    ✓   |    ✓    |    ✓    |    ✓    |
| id-ID      | Indonesian                               | ✓    |    ✓   |    ✓    |    ✓    |    ✓    |
| is-IS      | Icelandic                                |      |        |          |         |    ✓    |
| it-IT      | Italian                                  | ✓    |    ✓   |    ✓    |    ✓    |    ✓    |
| ja-JP      | Japanese                                 |      |        |          |         |    ✓    |
| kk-KZ      | Kazakh                                   |      |    ✓   |          |         |    ✓    |
| kn-IN      | Kannada                                  |      |        |          |         |    ✓    |
| ko-KR      | Korean                                   | ✓    |        |    ✓    |         |    ✓    |
| lt-LT      | Lithuanian                               | ✓    |    ✓   |    ✓    |    ✓    |    ✓    |
| lv-LV      | Latvian                                  |      |    ✓   |         |    ✓    |    ✓    |
| mk-MK      | Macedonian                               |      |        |          |         |    ✓    |
| mr-IN      | Marathi                                  |      |        |          |         |    ✓    |
| ms-MY      | Malay                                    | ✓    |    ✓   |    ✓    |         |    ✓    |
| nb-NO      | Norwegian Bokmål                         | ✓    |    ✓   |    ✓    |    ✓    |    ✓   |
| NGT        | Neutral Ground Truth (Local)<sup>1</sup> | ✓    |    ✓   |         |         |         |
| NGT-Latn   | Neutral Ground Truth (Latin)<sup>2</sup> | ✓    |    ✓   |         |         |         |
| nl-BE      | Dutch (Belgium)                          |      |    ✓   |         |         |    ✓    |
| nl-NL      | Dutch (Netherlands)                      | ✓    |    ✓   |    ✓    |    ✓    |    ✓    |
| pa-IN      | Punjabi                                  |      |        |          |         |    ✓    |
| pl-PL      | Polish                                   | ✓    |    ✓   |    ✓    |    ✓    |    ✓    |
| pt-BR      | Portuguese (Brazil)                      | ✓    |    ✓   |    ✓    |         |    ✓    |
| pt-PT      | Portuguese (Portugal)                    | ✓    |    ✓   |    ✓    |    ✓    |    ✓    |
| ro-RO      | Romanian                                 |      |    ✓   |          |    ✓    |    ✓    |
| ru-RU      | Russian                                  | ✓    |    ✓   |    ✓    |    ✓    |    ✓    |
| sk-SK      | Slovak                                   | ✓    |    ✓   |    ✓    |    ✓    |    ✓    |
| sl-SI      | Slovenian                                | ✓    |    ✓   |    ✓    |         |    ✓    |
| sr-Cyrl-RS | Serbian (Cyrillic)                       |      |    ✓   |          |         |    ✓    |
| sr-Latn-RS | Serbian (Latin)                          |      |        |          |         |    ✓    |
| sv-SE      | Swedish                                  | ✓    |    ✓   |    ✓    |    ✓    |    ✓    |
| ta-IN      | Tamil                                    |      |        |          |         |    ✓    |
| te-IN      | Telugu                                   |      |        |          |         |    ✓    |
| th-TH      | Thai                                     | ✓    |    ✓   |    ✓    |    ✓    |    ✓    |
| tr-TR      | Turkish                                  | ✓    |    ✓   |    ✓    |    ✓    |    ✓    |
| uk-UA      | Ukrainian                                |      |    ✓   |          |         |    ✓    |
| ur-PK      | Urdu                                     |      |        |          |         |    ✓    |
| uz-Latn-UZ | Uzbek                                    |      |        |          |         |    ✓    |
| vi-VN      | Vietnamese                               |      |    ✓   |          |         |    ✓    |
| zh-HanS-CN | Chinese (Simplified, China)              | ✓    |    ✓   |         |         |    ✓    |
| zh-HanT-HK | Chinese (Traditional, Hong Kong SAR)     |      |        |          |         |    ✓    |
| zh-HanT-TW | Chinese (Traditional, Taiwan)            | ✓    |    ✓   |    ✓    |         |    ✓    |

<sup>1</sup> Neutral Ground Truth (Local) - Official languages for all regions in local scripts if available<br>
<sup>2</sup> Neutral Ground Truth (Latin) - Latin exonyms are used if available

## Routing v2 services (preview) supported languages

Azure Maps have been localized in variety languages across its services. The following table provides the supported language codes for the routing v2 services. The routing column in the following table includes routes for driving and walking.

| Culture        | Language                                   | Routing | Truck Routing |
|----------------|--------------------------------------------|:-------:|:-------------:|
| af             | Afrikaans                                  | ✓       | ✓             |
| am             | Amharic                                    | ✓       |               |
| ar-sa          | Arabic (Saudi Arabia)                      | ✓       | ✓             |
| as             | Assamese                                   | ✓       |               |
| az-Latn        | Azerbaijani (Latin)                        | ✓       |               |
| be             | Belarusian                                 | ✓       |               |
| bg             | Bulgarian                                  | ✓       | ✓             |
| bn-BD          | Bangla (Bangladesh)                        | ✓       |               |
| bn-IN          | Bangla (India)                             | ✓       |               |
| bs             | Bosnian (Latin)                            | ✓       |               |
| ca             | Catalan Spanish                            | ✓       |               |
| ca-ES-valencia | Valencian                                  | ✓       |               |
| cs             | Czech                                      | ✓       | ✓             |
| cy             | Welsh                                      | ✓       |               |
| da             | Danish                                     | ✓       | ✓             |
| de-de          | German (Germany)                           | ✓       | ✓             |
| el             | Greek                                      | ✓       | ✓             |
| en-GB          | English (United Kingdom)                   | ✓       | ✓             |
| en-US          | English (United States)                    | ✓       | ✓             |
| es-ES          | Spanish (Spain)                            | ✓       | ✓             |
| es-MX          | Spanish (Mexico)                           | ✓       | ✓             |
| et             | Estonian                                   | ✓       |               |
| eu             | Basque                                     | ✓       |               |
| fa             | Persian                                    | ✓       |               |
| fi             | Finnish                                    | ✓       | ✓             |
| fil-Latn       | Filipino                                   | ✓       |               |
| fr-FR          | French (France)                            | ✓       | ✓             |
| fr-CA          | French (Canada)                            | ✓       |               |
| ga             | Irish                                      | ✓       |               |
| gd-Latn        | Scottish Gaelic                            | ✓       |               |
| gl             | Galician                                   | ✓       |               |
| gu             | Gujarati                                   | ✓       |               |
| ha-Latn        | Hausa (Latin)                              | ✓       |               |
| he             | Hebrew                                     | ✓       |               |
| hi             | Hindi                                      | ✓       |               |
| hr             | Croatian                                   | ✓       |               |
| hu             | Hungarian                                  | ✓       | ✓             |
| hy             | Armenian                                   | ✓       |               |
| id             | Indonesian                                 | ✓       | ✓             |
| ig-Latn        | Igbo                                       | ✓       |               |
| is             | Icelandic                                  | ✓       |               |
| it             | Italian (Italy)                            | ✓       | ✓             |
| ja             | Japanese                                   | ✓       |               |
| ka             | Georgian                                   | ✓       |               |
| kk             | Kazakh                                     | ✓       |               |
| km             | Khmer                                      | ✓       |               |
| kn             | Kannada                                    | ✓       |               |
| ko             | Korean                                     | ✓       | ✓             |
| kok            | Konkani                                    | ✓       |               |
| ku-Arab        | Central Kurdish                            | ✓       |               |
| ky-Cyrl        | Kyrgyz                                     | ✓       |               |
| lb             | Luxembourgish                              | ✓       |               |
| lt             | Lithuanian                                 | ✓       | ✓             |
| lv             | Latvian                                    | ✓       |               |
| mi-Latn        | Maori                                      | ✓       |               |
| mk             | Macedonian                                 | ✓       |               |
| ml             | Malayalam                                  | ✓       |               |
| mn-Cyrl        | Mongolian (Cyrillic)                       | ✓       |               |
| mr             | Marathi                                    | ✓       |               |
| ms             | Malay (Malaysia)                           | ✓       | ✓             |
| mt             | Maltese                                    | ✓       |               |
| nb             | Norwegian (Bokmål)                         | ✓       | ✓             |
| ne             | Nepali (Nepal)                             | ✓       |               |
| nl-NL          | Dutch (Netherlands)                        | ✓       | ✓             |
| nl-BE          | Dutch (Belgium)                            | ✓       |               |
| nn             | Norwegian (Nynorsk)                        | ✓       |               |
| nso            | Sesotho sa Leboa                           | ✓       |               |
| or             | Odia                                       | ✓       |               |
| pa             | Punjabi (Gurmukhi)                         | ✓       |               |
| pa-Arab        | Punjabi (Arabic)                           | ✓       |               |
| pl             | Polish                                     | ✓       | ✓             |
| prs-Arab       | Dari                                       | ✓       |               |
| pt-BR          | Portuguese (Brazil)                        | ✓       | ✓             |
| pt-PT          | Portuguese (Portugal)                      | ✓       | ✓             |
| qut-Latn       | K’iche’                                    | ✓       |               |
| quz            | Quechua (Peru)                             | ✓       |               |
| ro             | Romanian (Romania)                         | ✓       |               |
| ru             | Russian                                    | ✓       | ✓             |
| rw             | Kinyarwanda                                | ✓       |               |
| sd-Arab        | Sindhi (Arabic)                            | ✓       |               |
| si             | Sinhala                                    | ✓       |               |
| sk             | Slovak                                     | ✓       | ✓             |
| sl             | Slovenian                                  | ✓       | ✓             |
| sq             | Albanian                                   | ✓       |               |
| sr-Cyrl-BA     | Serbian (Cyrillic, Bosnia and Herzegovina) | ✓       |               |
| sr-Cyrl-RS     | Serbian (Cyrillic, Serbia)                 | ✓       |               |
| sr-Latn-RS     | Serbian (Latin, Serbia)                    | ✓       |               |
| sv             | Swedish (Sweden)                           | ✓       | ✓             |
| sw             | Kiswahili                                  | ✓       |               |
| ta             | Tamil                                      | ✓       |               |
| te             | Telugu                                     | ✓       |               |
| tg-Cyrl        | Tajik (Cyrillic)                           | ✓       |               |
| th             | Thai                                       | ✓       | ✓             |
| ti             | Tigrinya                                   | ✓       |               |
| tk-Latn        | Turkmen (Latin)                            | ✓       |               |
| tn             | Setswana                                   | ✓       |               |
| tr             | Turkish                                    | ✓       | ✓             |
| tt-Cyrl        | Tatar (Cyrillic)                           | ✓       |               |
| ug-Arab        | Uyghur                                     | ✓       |               |
| uk             | Ukrainian                                  | ✓       |               |
| ur             | Urdu                                       | ✓       |               |
| uz-Latn        | Uzbek (Latin)                              | ✓       |               |
| vi             | Vietnamese                                 | ✓       |               |
| wo             | Wolof                                      | ✓       |               |
| xh             | isiXhosa                                   | ✓       |               |
| yo-Latn        | Yoruba                                     | ✓       |               |
| zh-Hant        | Chinese (Traditional)                      | ✓       |               |
| zh-HanT-TW     | Chinese (Traditional, Taiwan)              | ✓       | ✓             |
| zu             | isiZulu                                    | ✓       |

<!--| zh-Hans        | Chinese (Simplified)                       | ✓       |               |-->

## Azure Maps supported views

Make sure you set up the **View** parameter as required for the REST APIs and the SDKs, which your services are using.

Azure Maps **View** parameter (also referred to as "user region parameter") is a two letter ISO-3166 Country Code that shows the correct maps for that country/region specifying which set of geopolitically disputed content is returned via Azure Maps services, including borders and labels displayed on the map.

### REST APIs
  
Ensure that you have set up the View parameter as required. View parameter specifies which set of geopolitically disputed content is returned via Azure Maps services.

Affected Azure Maps REST services:

* Get Map Tile
* Get Map Image
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

### SDKs

Ensure that you have set up the **View** parameter as required, and you have the latest version of Web SDK and Android SDK. Affected SDKs:

* Azure Maps Web SDK
* Azure Maps Android SDK

By default, the View parameter is set to **Unified**, even if you haven't defined it in the request. Determine the location of your users. Then, set the **View** parameter correctly for that location. Alternatively, you can set 'View=Auto', which returns the map data based on the IP address of the request.  The **View** parameter in Azure Maps must be used in compliance with applicable laws, including those laws about mapping of the country/region where maps, images, and other data and third-party content that you're authorized to access via Azure Maps is made available.

The following table provides supported views.

| View    | Description                                                 | Maps | Search |
|---------|-------------------------------------------------------------|:----:|:------:|
| AE      | United Arab Emirates (Arabic View)                          |   ✓  |        |
| AR      | Argentina (Argentinian View)                                |   ✓  |    ✓   |
| BH      | Bahrain (Arabic View)                                       |   ✓  |        |
| IN      | India (Indian View)                                         |   ✓  |    ✓   |
| IQ      | Iraq (Arabic View)                                          |   ✓  |        |
| JO      | Jordan (Arabic View)                                        |   ✓  |        |
| KW      | Kuwait (Arabic View)                                        |   ✓  |        |
| LB      | Lebanon (Arabic View)                                       |   ✓  |        |
| MA      | Morocco (Moroccan View)                                     |   ✓  |    ✓   |
| OM      | Oman (Arabic View)                                          |   ✓  |        |
| PK      | Pakistan (Pakistani View)                                   |   ✓  |    ✓   |
| PS      | Palestinian Authority (Arabic View)                         |   ✓  |        |
| QA      | Qatar (Arabic View)                                         |   ✓  |        |
| SA      | Saudi Arabia (Arabic View)                                  |   ✓  |        |
| SY      | Syria (Arabic View)                                         |   ✓  |        |
| YE      | Yemen (Arabic View)                                         |   ✓  |        |
| Auto    | Automatically detect based on request                       |   ✓  |    ✓   |
| Unified | Unified View (Others)                                       |   ✓  |    ✓   |
