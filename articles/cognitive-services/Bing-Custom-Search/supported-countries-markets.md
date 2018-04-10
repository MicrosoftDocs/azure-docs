---
title: Supported countries and languages for Bing Custom Search API on Azure | Microsoft Docs
description: Find out which countries and languages are supported by the Bing Custom Search API.
services: cognitive-services
author: mikedodaro
manager: ronakshah

ms.service: cognitive-services
ms.technology: bing-custom-search
ms.topic: article
ms.date: 10/19/2017
ms.author: v-gedod
---
# Bing Custom Search countries and languages

The Bing Custom Search API supports more than three dozen countries, many with more than one language. 

You can specify a country using the `cc` query parameter. If you specify a country, you must also specify one or more language codes using the `Accept-Language` header. The supported languages vary by country; they are given for each country in the **Markets** table.

Alternatively, you can specify the market by the `mkt` query parameter with a code from the **Markets** table. Use the country code `cc` and the `Accept-Language header` if you specify multiple languages. Otherwise, you should use the `mkt` and `setLang query` parameters.

The `Accept-Language` header and the `setLang` query parameter are mutually exclusive—do not specify both. For details, see [Accept-Language](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-custom-search-api-v7-reference#acceptlanguage).

## Countries

|Country|Code|
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
|Hong Kong|HK|
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

|Country|Language|Market Code|
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
|Hong Kong|Traditional Chinese|zh-HK|
|India|English|en-IN|
|Indonesia|English|en-ID|
|Italy|Italian|it-IT|
|Japan|Japanese|ja-JP|
|Korea|Korean|ko-KR|
|Malaysia|English|en-MY|
|Mexico|Spanish|es-MX|
|Netherlands|Dutch|nl-NL|
|New Zealand|English|en-NZ|
|Norway|Norwegian|no-NO|
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