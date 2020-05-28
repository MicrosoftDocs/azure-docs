---
title: Localization support | Microsoft Azure Maps
description: In this article, you'll learn about supported languages for the services in Microsoft Azure Maps.
author: philmea
ms.author: philmea
ms.date: 11/20/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Localization support in Azure Maps

Azure Maps supports various languages and views based on country/region. This article provides the supported languages and views to help guide your Azure Maps implementation.


## Azure Maps supported languages

Azure Maps have been localized in variety languages across its services. The following table provides the supported language codes for each service.  
  

| ID         | Name                   |  Maps | Search | Routing | Weather | Traffic incidents | JS map control |
|------------|------------------------|:-----:|:------:|:-------:|:--------:|:-----------------:|:--------------:|
| af-ZA      | Afrikaans              |       |    ✓   |    ✓    |         |                   |                |
| ar-SA      | Arabic                 |   ✓   |    ✓   |    ✓    |    ✓      |         ✓         |        ✓       |
| bn-BD      | Bangla (Bangladesh)    |       |       |         |     ✓    |                   |                |
| bn-IN      | Bangla (India)         |       |       |         |     ✓    |                   |                |
| bs-BA      | Bosnian                 |       |       |         |     ✓    |                   |                |
| eu-ES      | Basque                 |       |    ✓   |         |         |                   |                |
| bg-BG      | Bulgarian              |   ✓   |    ✓   |    ✓    |     ✓     |                   |        ✓       |
| ca-ES      | Catalan                |       |    ✓   |         |    ✓      |                   |                |
| zh-HanS    | Chinese (Simplified)   |       |  zh-CN |         |     zh-CN   |                   |                |
| zh-HanT    | Chinese (Hong Kong SAR)  |  |   |    |    zh-HK   |                   |           |
| zh-HanT    | Chinese (Taiwan)  | zh-TW |  zh-TW |  zh-TW  |    zh-TW   |                   |      zh-TW     |
| hr-HR      | Croatian               |       |    ✓   |         |    ✓      |                   |                |
| cs-CZ      | Czech                  |   ✓   |    ✓   |    ✓    |    ✓      |         ✓         |        ✓       |
| da-DK      | Danish                 |   ✓   |    ✓   |    ✓    |     ✓     |         ✓         |        ✓       |
| nl-BE      | Dutch (Belgium)        |       |    ✓   |         |      ✓    |                   |                |
| nl-NL      | Dutch (Netherlands)    |   ✓   |    ✓   |    ✓    |     ✓     |         ✓         |        ✓       |
| en-AU      | English (Australia)    |   ✓   |    ✓   |    ✓    |     ✓     |         ✓         |        ✓       |
| en-NZ      | English (New Zealand)  |   ✓   |    ✓   |    ✓    |     ✓     |         ✓         |        ✓       |
| en-GB      | English (Great Britain) |   ✓   |    ✓   |    ✓    |     ✓     |         ✓         |        ✓       |
| en-US      | English (USA)          |   ✓   |    ✓   |    ✓    |      ✓    |         ✓         |        ✓       |
| et-EE      | Estonian               |       |    ✓   |         |      ✓    |         ✓         |                |
| fil-PH     | Filipino               |       |       |         |     ✓    |                   |                |
| fi-FI      | Finnish                |   ✓   |    ✓   |    ✓    |      ✓    |         ✓         |        ✓       |
| fr-FR      | French                 |   ✓   |    ✓   |    ✓    |      ✓    |         ✓         |        ✓       |
| fr-CA      | French (Canada)      |       |    ✓   |         |     ✓     |                   |                |
| gl-ES      | Galician               |       |    ✓   |         |         |                   |                |
| de-DE      | German                 |   ✓   |    ✓   |    ✓    |   ✓      |         ✓         |        ✓       |
| el-GR      | Greek                  |   ✓   |    ✓   |    ✓    |    ✓     |         ✓         |        ✓       |
| gu-IN      | Gujarati                |       |       |         |     ✓    |                   |                |
| he-IL      | Hebrew                 |       |    ✓   |         |     ✓    |         ✓         |                |
| hi-IN      | Hindi                  |       |        |         |     ✓    |                   |                |
| hu-HU      | Hungarian              |   ✓   |    ✓   |    ✓    |     ✓    |         ✓         |        ✓       |
| is-IS      | Icelandic              |       |       |         |     ✓    |                   |                |
| id-ID      | Indonesian             |   ✓   |    ✓    |    ✓    |     ✓    |         ✓         |        ✓       |
| it-IT      | Italian                |   ✓   |    ✓   |    ✓    |      ✓   |         ✓         |        ✓       |
| ja-JP      | Japanese               |       |        |         |     ✓    |                   |                |
| kn-IN      | Kannada                |       |       |         |     ✓    |                   |                |
| kk-KZ      | Kazakh                 |       |    ✓   |         |     ✓    |                   |                |
| ko-KR      | Korean                 |   ✓   |        |    ✓    |     ✓    |                   |        ✓       |
| es-419     | Latin American Spanish |       |    ✓   |         |         |                   |                |
| lv-LV      | Latvian                |       |    ✓   |         |     ✓    |         ✓         |                |
| lt-LT      | Lithuanian             |   ✓   |    ✓   |    ✓    |     ✓    |         ✓         |        ✓       |
| mk-MK      | Macedonian             |       |       |         |     ✓    |                   |                |
| ms-MY      | Malay (Latin)          |   ✓   |    ✓   |    ✓    |    ✓   |                   |        ✓       |
| mr-IN      | Marathi                 |       |       |         |     ✓    |                   |                |
| nb-NO      | Norwegian Bokmål       |   ✓   |    ✓   |    ✓    |      ✓   |         ✓         |        ✓       |
| NGT        | Neutral Ground Truth - Official languages for all regions in local scripts if available |   ✓     |        |         |       |        |      ✓          |
| NGT-Latn   | Neutral Ground Truth - Latin exonyms. Latin script will be used if available |   ✓     |        |         |         |                |        ✓         |
| pl-PL      | Polish                 |   ✓   |    ✓   |    ✓    |     ✓    |         ✓         |        ✓       |
| pt-BR      | Portuguese (Brazil)    |   ✓   |    ✓   |    ✓    |      ✓   |                   |        ✓       |
| pt-PT      | Portuguese (Portugal)  |   ✓   |    ✓   |    ✓    |      ✓   |         ✓         |        ✓       |
| pa-IN      | Punjabi                 |       |       |         |     ✓    |                   |                |
| ro-RO      | Romanian               |       |    ✓    |         |     ✓    |         ✓         |                |
| ru-RU      | Russian                |   ✓   |    ✓   |    ✓    |      ✓   |         ✓         |        ✓       |
| sr-Cyrl-RS | Serbian (Cyrillic)     |       |   sr-RS  |         |    sr-RS     |                   |                |
| sr-Latn-RS | Serbian (Latin)        |       |       |         |     sr-latn    |                   |                |
| sk-SK      | Slovak             |   ✓   |    ✓   |    ✓    |     ✓    |         ✓         |        ✓       |
| sl-SL      | Slovenian              |   ✓   |    ✓   |    ✓    |     ✓    |                   |        ✓       |
| es-ES      | Spanish                |   ✓   |    ✓   |    ✓    |     ✓    |         ✓         |        ✓       |
| es-MX      | Spanish (Mexico)       |   ✓   |        |    ✓    |     ✓    |                   |        ✓       |
| sv-SE      | Swedish                |   ✓   |    ✓   |    ✓    |     ✓    |         ✓         |        ✓       |
| ta-IN      | Tamil (India)                 |       |       |         |     ✓    |                   |                |
| te-IN      | Telugu (India)                 |       |       |         |     ✓    |                   |                |
| th-TH      | Thai                   |   ✓   |    ✓   |    ✓    |     ✓    |         ✓         |        ✓       |
| tr-TR      | Turkish                |   ✓   |    ✓   |    ✓    |     ✓    |         ✓         |        ✓       |
| uk-UA      | Ukrainian               |       |    ✓   |         |     ✓    |                   |                |
| ur-PK      | Urdu                 |       |       |         |     ✓    |                   |                |
| uz-Latn-UZ | Uzbek                 |       |       |         |     ✓    |                   |                |
| vi-VN      | Vietnamese             |       |    ✓   |         |      ✓    |                  |                |


## Azure Maps supported views

> [!Note]
> On August 1, 2019, Azure Maps was released in the following countries/regions:
>  * Argentina
>  * India
>  * Morocco
>  * Pakistan
>
> After August 1, 2019, the **View** parameter will define the returned map content for the new regions/countries listed above. Azure Maps **View** parameter (also referred to as "user region parameter") is a two letter ISO-3166 Country Code that will show the correct maps for that country/region specifying which set of geopolitically disputed content is returned via Azure Maps services, including borders and labels displayed on the map. 

Make sure you set up the **View** parameter as required for the REST APIs and the SDKs, which your services are using.
>  
>
>  **Rest APIs:**
>  
>  Ensure that you have set up the View parameter as required. View parameter specifies which set of geopolitically disputed content is returned via Azure Maps services. 
>
>  Affected Azure Maps REST Services:
>    
>    * Get Map Tile
>    * Get Map Image 
>    * Get Search Fuzzy
>    * Get Search POI
>    * Get Search POI Category
>    * Get Search Nearby
>    * Get Search Address
>    * Get Search Address Structured
>    * Get Search Address Reverse
>    * Get Search Address Reverse Cross Street
>    * Post Search Inside Geometry
>    * Post Search Address Batch Preview
>    * Post Search Address Reverse Batch Preview
>    * Post Search Along Route
>    * Post Search Fuzzy Batch Preview
>
>    
>  **SDKs:**
>
>  Ensure that you have set up the **View** parameter as required, and you have the latest version of Web SDK and Android SDK. Affected SDKs:
>
>    * Azure Maps Web SDK
>    * Azure Maps Android SDK

By default, the View parameter is set to **Unified**, even if you haven't defined it in the request. Determine the location of your users. Then, set the **View** parameter correctly for that location. Alternatively, you can set 'View=Auto', which will return the map data based on the IP address of the request.  The **View** parameter in Azure Maps must be used in compliance with applicable laws, including those laws about mapping of the country/region where maps, images, and other data and third-party content that you're authorized to access via Azure Maps is made available.


The following table provides supported views.

| View         | Description                            |  Maps | Search | JS Map Control |
|--------------|----------------------------------------|:-----:|:------:|:--------------:|
| AE           | United Arab Emirates (Arabic View)    |   ✓   |        |     ✓          |
| AR           | Argentina (Argentinian View)           |   ✓   |    ✓   |     ✓          |
| BH           | Bahrain (Arabic View)                 |   ✓   |        |     ✓          |
| IN           | India (Indian View)                    |   ✓   |   ✓     |     ✓          |
| IQ           | Iraq (Arabic View)                    |   ✓   |        |     ✓          |
| JO           | Jordan (Arabic View)                  |   ✓   |        |     ✓          |
| KW           | Kuwait (Arabic View)                  |   ✓   |        |     ✓          |
| LB           | Lebanon (Arabic View)                 |   ✓   |        |     ✓          |
| MA           | Morocco (Moroccan View)                |   ✓   |   ✓     |     ✓          |
| OM           | Oman (Arabic View)                    |   ✓   |        |     ✓          |
| PK           | Pakistan (Pakistani View)              |   ✓   |    ✓    |     ✓          |
| PS           | Palestinian Authority (Arabic View)    |   ✓   |        |     ✓          |
| QA           | Qatar (Arabic View)                   |   ✓   |        |     ✓          |
| SA           | Saudi Arabia (Arabic View)            |   ✓   |        |     ✓          |
| SY           | Syria (Arabic View)                   |   ✓   |        |     ✓          |
| YE           | Yemen (Arabic View)                   |   ✓   |        |     ✓          |
| Auto         | Return the map data based on the IP address of the request.|   ✓   |    ✓   |     ✓          |
| Unified      | Unified View (Others)                  |   ✓   |   ✓     |     ✓          |
