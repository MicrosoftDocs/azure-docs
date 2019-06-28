---
title: Language support - Bing Image Search API
titleSuffix: Azure Cognitive Services
description: Find out which countries/regions and languages are supported by the Bing Image Search API.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-image-search
ms.topic: article
ms.date: 03/04/2019
ms.author: aahi
---

# Language and region support for the Bing Image Search API

The Bing Image Search API supports more than three dozen countries/regions, many with more than one language. Specifying a country/region with a query serves primarily to refine search results based on interests in that country/region. Additionally, the results may contain links to Bing, and these links may localize the Bing user experience according to the specified country/regions or language.

To specify the country/region and language, set the `mkt` (market) query parameter to a code from the **Markets** table below. The market specifies both a country/region and language. If the user prefers to see display text in a different language, set `setLang` query parameter to the appropriate language code.

Alternatively, you can specify the country/region using the `cc` query parameter. If you specify a country/region, you must also specify one or more language codes using the `Accept-Language` HTTP header. The supported languages vary by country/region; they are given for each country/region in the Markets table.

> [!NOTE]
> The Trending Images API currently supports only the following markets:
> - en-US (English, United States)
> - en-CA (English, Canada)
> - en-AU (English, Australia)
> - zh-CN (Chinese, China)

## Countries/Regions

|Country/region|Code|
|-------|----|
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
|China|CN|
|Poland|PL|
|Portugal|PT|
|Philippines|PH|
|Russia|RU|
|Saudi Arabia|SA|
|South Africa|ZA|
|Spain|ES|
|Sweden|SE|
|Switzerland|CH|
|Taiwan|TW|
|Turkey|TR|
|United Kingdom|GB|
|United States|US|


## Markets

|Country/region|Language|Market Code|
|-------|--------|-----------|
|Argentina|Spanish|es-AR|
|Australia|English|en-AU|
|Austria|German|de-AT|
|Belgium|Dutch|nl-BE|
|Belgium|French|fr-BE|
|Brazil|Portuguese|pt-BR|
|Canada|English|en-CA|
|Canada|French|fr-CA|
|Chile|Spanish|es-CL|
|Denmark|Danish|da-DK|
|Finland|Finnish|fi-FI|
|France|French|fr-FR|
|Germany|German|de-DE|
|Hong Kong SAR|Traditional Chinese|zh-HK|
|India|English|en-IN|
|Indonesia|English|en-ID|
|Italy|Italian|it-IT|
|Japan|Japanese|ja-JP|
|Korea|Korean|ko-KR|
|Malaysia|English|en-MY|
|Mexico|Spanish|es-MX|
|Netherlands|Dutch|nl-NL|
|New Zealand|English|en-NZ|
|China|Chinese|zh-CN|
|Poland|Polish|pl-PL|
|Portugal|Portuguese|pt-PT|
|Philippines|English|en-PH|
|Russia|Russian|ru-RU|
|Saudi Arabia|Arabic|ar-SA|
|South Africa|English|en-ZA|
|Spain|Spanish|es-ES|
|Sweden|Swedish|sv-SE|
|Switzerland|French|fr-CH|
|Switzerland|German|de-CH|
|Taiwan|Traditional Chinese|zh-TW|
|Turkey|Turkish|tr-TR|
|United Kingdom|English|en-GB|
|United States|English|en-US|
|United States|Spanish|es-US|

## Next steps
For more information about the Bing News Search endpoints, see [News Image Search API v7 reference](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference).
