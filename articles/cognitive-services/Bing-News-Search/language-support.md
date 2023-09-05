---
title: Language support - Bing News Search API
titleSuffix: Azure AI services
description: A list of natural languages, countries and regions that are supported by the Bing News Search API.
services: cognitive-services
author: aahill
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-news-search
ms.topic: conceptual
ms.date: 1/10/2019
ms.author: aahi
---

# Language and region support for the Bing News Search API

[!INCLUDE [Bing move notice](../bing-web-search/includes/bing-move-notice.md)]

The Bing News Search API supports numerous countries/regions, many with more than one language. Specifying a country/region with a query serves primarily to refine search results based on interests in that country/region. Additionally, the results may contain links to Bing, and these links may localize the Bing user experience according to the specified country/region or language.

You can specify a country/region using the `cc` query parameter. If you specify a country/region, you must also specify one or more language codes using the `Accept-Language` HTTP header. The supported languages vary by countr/region; they are given for each country/region in the Markets table.

Alternatively, you may specify the market using the `mkt` query parameter and a code from the **Markets** table. Specifying a market simultaneously specifies a country/region and a preferred language. The `setLang` query parameter may be set to a language code in this case; usually this is the same language specified by `mkt` unless the user prefers to see Bing in another language.

## Supported markets for news search endpoint

For the `/news/search` endpoint, the following table lists the market code values that you may use to specify the `mkt` query parameter. Bing returns content for only these markets. The list is subject to change.  

For a list of country/region codes that you may specify in the `cc` query parameter, see [Country Codes](#countrycodes).  

|Country/region|Language|Market code|  
|---------------------|--------------|-----------------|
|Denmark|Danish|da-DK|
|Austria|German|de-AT|
|Switzerland|German|de-CH|
|Germany|German|de-DE|
|Australia|English|en-AU|
|Canada|English|en-CA|
|United Kingdom|English|en-GB|
|Indonesia|English|en-ID|
|Ireland|English|en-IE|
|India|English|en-IN|
|Malaysia|English|en-MY|
|New Zealand|English|en-NZ|
|Republic of the Philippines|English|en-PH|
|Singapore|English|en-SG|
|United States|English|en-US|
|English|general|en-WW|
|English|general|en-XA|
|South Africa|English|en-ZA|
|Argentina|Spanish|es-AR|
|Chile|Spanish|es-CL|
|Spain|Spanish|es-ES|
|Mexico|Spanish|es-MX|
|United States|Spanish|es-US|
|Spanish|general|es-XL|
|Finland|Finnish|fi-FI|  
|France|French|fr-BE|
|Canada|French|fr-CA|
|Belgium|Dutch|nl-BE|
|Switzerland|French|fr-CH|
|France|French|fr-FR|  
|Italy|Italian|it-IT|
|Hong Kong SAR|Traditional Chinese|zh-HK|  
|Taiwan|Traditional Chinese|zh-TW|
|Japan|Japanese|ja-JP|  
|Korea|Korean|ko-KR|  
|Netherlands|Dutch|nl-NL|  
|People's republic of China|Chinese|zh-CN|  
|Brazil|Portuguese|pt-BR|
|Russia|Russian|ru-RU|  
|Sweden|Swedish|sv-SE|  
|Türkiye|Turkish|tr-TR|  

## Supported markets for news endpoint
For the `/news` endpoint, the following table lists the market code values that you may use to specify the `mkt` query parameter. Bing returns content for only these markets. The list is subject to change.  

For a list of country/region codes that you may specify in the `cc` query parameter, see [Country Codes](#countrycodes).  

|Country/region|Language|Market code|  
|---------------------|--------------|-----------------|
|Denmark|Danish|da-DK|
|Germany|German|de-DE|
|Australia|English|en-AU|
|United Kingdom|English|en-GB|
|United States|English|en-US|
|English|general|en-WW|
|Chile|Spanish|es-CL|
|Mexico|Spanish|es-MX|
|United States|Spanish|es-US|
|Finland|Finnish|fi-FI|  
|Canada|French|fr-CA|
|France|French|fr-FR|  
|Italy|Italian|it-IT|
|Brazil|Portuguese|pt-BR|
|People's republic of China|Chinese|zh-CN|

## Supported markets for news trending endpoint
For the `/news/trendingtopics` endpoint, the following table lists the market code values that you may use to specify the `mkt` query parameter. Bing returns content for only these markets. The list is subject to change.  

For a list of country/region codes that you may specify in the `cc` query parameter, see [Country Codes](#countrycodes).  

|Country/region|Language|Market code|  
|---------------------|--------------|-----------------|
|Germany|German|de-DE|
|Australia|English|en-AU|
|United Kingdom|English|en-GB|
|United States|English|en-US|
|Canada|English|en-CA|
|India|English|en-IN|
|France|French|fr-FR|
|Canada|French|fr-CA|
|Brazil|Portuguese|pt-BR|
|People's republic of China|Chinese|zh-CN|


<a name="countrycodes"></a>   
### Country codes  

The following are the country/region codes that you may specify in the `cc` query parameter. The list is subject to change.  

|Country/region|Country code|  
|---------------------|------------------|  
|Argentina|AR|  
|Australia|AU|  
|Austria|AT|  
|Belgium|BE|  
|Brazil|BR|  
|Canada|CA|  
|Chile|CL|  
|Denmark|DK|  
|Finland|FI|  
|France|FR|  
|Germany|DE|  
|Hong Kong SAR|HK|  
|India|IN|  
|Indonesia|ID|  
|Italy|IT|  
|Japan|JP|  
|Korea|KR|  
|Malaysia|MY|  
|Mexico|MX|  
|Netherlands|NL|  
|New Zealand|NZ|  
|Norway|NO|  
|People's Republic of China|CN|  
|Poland|PL|  
|Portugal|PT|  
|Republic of the Philippines|PH|  
|Russia|RU|  
|Saudi Arabia|SA|  
|South Africa|ZA|  
|Spain|ES|  
|Sweden|SE|  
|Switzerland|CH|  
|Taiwan|TW|  
|Türkiye|TR|  
|United Kingdom|GB|  
|United States|US|

## Next steps
For more information about the Bing News Search endpoints, see [News Search API v7 reference](/rest/api/cognitiveservices-bingsearch/bing-news-api-v7-reference).
