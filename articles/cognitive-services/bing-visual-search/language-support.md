---
title: Language support - Bing Visual Search API
titleSuffix: Azure Cognitive Services
description: A list of natural languages, countries and regions that are supported by the Bing Visual Search API. The Bing Visual Search API supports more than three dozen countries/regions, many with more than one language.
services: cognitive-services

manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-visual-search
ms.topic: conceptual
ms.date: 09/25/2018

---
# Language and region support for the Bing Visual Search API

[!INCLUDE [Bing move notice](../Bing-Web-Search/includes/bing-move-notice.md)]

Bing Visual Search API supports more than three dozen countries/regions, many with more than one language. Each request should include the user's country/region and language of choice. Knowing the user's market helps Bing return appropriate results. If you don't specify a country/region and language, Bing makes a best effort to determine the user's country/region and language. Because the results may contain links to Bing, knowing the country/region and language may provide a preferred localized Bing user experience if the user clicks the Bing links.

To specify the country/region and language, set the `mkt` (market) query parameter to a code from the **Markets** table below. The market specifies both a country/region and language. If the user prefers to see display text in a different language, set `setLang` query parameter to the appropriate language code.

Alternatively, you can specify the country/region using the `cc` query parameter. If you specify a country/region, you must also specify one or more language codes using the `Accept-Language` HTTP header. The supported languages vary by country/region; they are given for each country in the Markets table.



> [!NOTE]
> The following market restrictions apply:
>
> - Image recognition annotations are available in English only.
> - Recipe, shopping, and pages-including insights are available in the en-US market only.


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
|Türkiye|TR|
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
|Türkiye|Turkish|tr-TR|
|United Kingdom|English|en-GB|
|United States|English|en-US|
|United States|Spanish|es-US|