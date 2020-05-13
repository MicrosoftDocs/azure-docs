---
title: Migration guide for v2 of the Text Analytics API
titleSuffix: Azure Cognitive Services
description: Learn how to move your applications to use version 3 of the Text Analytics API.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: article
ms.date: 03/31/2020
ms.author: aahi
---

# Migrate to version 3 of the Text Analytics API

If you're using version 2.1 of the Text Analytics API, this article will help you upgrade your application to use version 3. Version 3 introduces new features such as [model versioning](concepts/model-versioning.md) and expanded [entity recognition](how-tos/text-analytics-how-to-entity-linking.md#named-entity-recognition-versions-and-features).

Looking for example code that uses v2.1 of the API? There are several samples available on GitHub for the following v2.1 SDKs: [C#](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/samples/TextAnalytics), [Go](https://github.com/Azure-Samples/azure-sdk-for-go-samples/blob/master/cognitiveservices/textanalytics.go), [JavaScript](https://github.com/Azure-Samples/cognitive-services-node-sdk-samples/blob/master/Samples/textAnalytics.js), [Python](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples/blob/master/samples/language/text_analytics_samples.py), and [Ruby](https://github.com/Azure-Samples/cognitive-services-ruby-sdk-samples/blob/master/samples/text_analytics.rb).

#### [Sentiment analysis](#tab/sentiment-analysis)

## Feature changes 

Sentiment Analysis version 2.1 returns sentiment scores between 0 and 1, with scores closer to 1 indicating more positive sentiment. Version 3 instead returns sentiment labels (such as "positive" or "negative") with their associated confidence scores. 

## Steps to migrate

### REST API

If your application uses the REST API, update its request endpoint to the v3 endpoint for sentiment analysis. For example:`https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.0/sentiment`. You will also need to update the application to use the sentiment labels returned in the [JSON response](how-tos/text-analytics-how-to-sentiment-analysis.md#view-the-results). 

### Client libraries

[!INCLUDE [Client library migration information](../includes/client-library-migration-section.md)]

#### [NER and entity linking](#tab/named-entity-recognition)

## Feature changes

In version 2.1, the Text Analytics API uses one endpoint for Named Entity Recognition (NER) and entity linking. Version 3.0 of the API provides expanded named entity detection, and uses a separate endpoints for NER and entity linking requests.

## Steps to migrate

### REST API

If your application uses the REST API, update its request endpoint to the v3 endpoints for NER and/or entity linking.

Entity Linking
* `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.0/entities/linking`

NER
* `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.0/entities/recognition/general`

You will also need to update your application to use the [entity categories](named-entity-types.md) returned in the [JSON response](how-tos/text-analytics-how-to-entity-linking.md#view-results).

### Client libraries

[!INCLUDE [Client library migration information](../includes/client-library-migration-section.md)]


### NER v2 entity categories

NER v2 is limited to the entity categories below.

> [!NOTE] 
> The full set of supported NER entities listed are available only for the English, Chinese-Simplified, French, German, and Spanish languages. Only the "Person", "Location" and "Organization" entities are returned for the other languages.

| Type  | Subcategories | Example |
|:-----------   |:------------- |:---------|
| Person        | N/A\*         | "Jeff", "Bill Gates"     |
| Location      | N/A\*         | "Redmond, Washington", "Paris"  |
| Organization  | N/A\*         | "Microsoft"   |
| Quantity      | Number        | "6", "six"     |
| Quantity      | Percentage    | "50%", "fifty percent"|
| Quantity      | Ordinal       | "2nd", "second"     |
| Quantity      | Age           | "90 day old", "30 years old"    |
| Quantity      | Currency      | "$10.99"     |
| Quantity      | Dimension     | "10 miles", "40 cm"     |
| Quantity      | Temperature   | "32 degrees"    |
| DateTime      | N/A\*         | "6:30PM February 4, 2012"      |
| DateTime      | Date          | "May 2nd, 2017", "05/02/2017"   |
| DateTime      | Time          | "8am", "8:00"  |
| DateTime      | DateRange     | "May 2nd to May 5th"    |
| DateTime      | TimeRange     | "6pm to 7pm"     |
| DateTime      | Duration      | "1 minute and 45 seconds"   |
| DateTime      | Set           | "every Tuesday"     |
| URL           | N/A\*         | "https:\//www.bing.com"    |
| Email         | N/A\*         | "support@contoso.com" |
| US Phone Number  | N/A\*         | (US phone numbers only) "(312) 555-0176" |
| IP Address    | N/A\*         | "10.0.0.100" |

\* Depending on the input and extracted entities, certain entities may omit the `SubType`.  


#### [Language detection](#tab/language-detection)

## Feature changes 

The language detection feature has not changed in v3 outside of the endpoint version, but the JSON response will contain `ConfidenceScore` instead of `score`. 

## Steps to migrate

### REST API

If your application uses the REST API, update its request endpoint to the v3 endpoint for language detection. For example:`https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.0/languages`. You will also need to update the application to use `ConfidenceScore` instead of `score` in the [JSON response](how-tos/text-analytics-how-to-language-detection.md#step-3-view-the-results). 

### Client libraries

[!INCLUDE [Client library migration information](../includes/client-library-migration-section.md)]


#### [Key phrase extraction](#tab/key-phrase-extraction)

## Feature changes 

The key phrase extraction feature has not changed in v3 outside of the endpoint version.

## Steps to migrate

### REST API

If your application uses the REST API, update its request endpoint to the v3 endpoint for key phrase extraction. For example: `https://<your-custom-subdomain>.api.cognitiveservices.azure.com/text/analytics/v3.0/keyPhrases`

### Client libraries

[!INCLUDE [Client library migration information](../includes/client-library-migration-section.md)]

---

### Version 2 language support

Language support has changed between v2 and v3. If you don't see your language supported in [version 3](language-support.md), consider using v2 for your application.   

#### [Sentiment analysis](#tab/sentiment-analysis)

| Language              | Language code |              Notes |
|:----------------------|:-------------:|:-------------------:|
| Chinese-Simplified*    |   `zh-hans`   | `zh` also accepted |
| Danish*                |     `da`      |                    |
| Dutch                 |     `nl`      |                    |
| English               |     `en`      |                    |
| Finnish*               |     `fi`      |                    |
| French*                |     `fr`      |                    |
| German*                |     `de`      |                   |
| Greek*                 |     `el`      |                    |
| Italian*               |     `it`      |                    |
| Japanese*              |     `ja`      |                    |
| Norwegian  (Bokmål)*   |     `no`      | `nb` also accepted |
| Polish*                |     `pl`      |                    |
| Portuguese (Portugal)* |    `pt-PT`    | `pt` also accepted |
| Russian*               |     `ru`      |                    |
| Spanish*               |     `es`      |                    |
| Swedish*               |     `sv`      |                    |
| Turkish*               |     `tr`      |                    |

\* Language is available in v2 as a public preview. 

#### [NER and entity linking](#tab/named-entity-recognition)

| Language              | Language code |       Notes        |
|:----------------------|:-------------:|:------------------:|
| Arabic*                |     `ar`      |                    |
| Czech*                 |     `cs`      |                    |
| Chinese-Simplified    |   `zh-hans`   | `zh` also accepted |
| Chinese-Traditional*   |   `zh-hant`   |                    |
| Danish*                |     `da`      |                    |
| Dutch*                 |     `nl`      |                    |
| English               |     `en`      |                    |
| Finnish*               |     `fi`      |                   |
| French                |     `fr`      |                    |
| German                |     `de`      |                    |
| Hebrew*                |     `he`      |                     |
| Hungarian*             |     `hu`      |                     |
| Italian*              |     `it`      |                     |
| Japanese*              |     `ja`      |                     |
| Korean*                |     `ko`      |                     |
| Norwegian  (Bokmål)*   |     `no`      |  `nb` also accepted |
| Polish*                |     `pl`      |                     |
| Portuguese (Portugal)* |    `pt-PT`    |  `pt` also accepted |
| Portuguese (Brazil)*   |    `pt-BR`    |                     |
| Russian*               |     `ru`      |                     |
| Spanish*               |     `es`      |                     |
| Swedish*               |     `sv`      |                     |
| Turkish*               |     `tr`      |                     |

\* Language is available in v2 as a public preview. 

### Entity linking v2 language support

| Language              | Language code |       Notes        |
|:----------------------|:-------------:|:------------------:|
| English               |     `en`      |                    |
| Spanish               |     `es`      |                    |

#### [Language detection](#tab/language-detection)

The Text Analytics API can detect a wide range of languages, variants, dialects, and some regional/cultural languages.  Language Detection returns the "script" of a language. For instance, for the phrase "I have a dog" it will return  `en` instead of  `en-US`. The only special case is Chinese, where the language detection capability will return `zh_CHS` or `zh_CHT` if it can determine the script given the text provided. In situations where a specific script cannot be identified for a Chinese document, it will return simply `zh`.

We don't publish the exact list of languages for this feature, but it can detect a wide range of languages, variants, dialects, and some regional/cultural languages. 

If you have content expressed in a less frequently used language, you can try Language Detection to see if it returns a code. The response for languages that cannot be detected is "unknown".

#### [Key phrase extraction](#tab/key-phrase-extraction)

| Language              | Language code |       Notes        |
|:----------------------|:-------------:|:------------------:|
| Dutch                 |     `nl`      |                    |
| English               |     `en`      |                    |
| Finnish               |     `fi`      |                    |
| French                |     `fr`      |                    |
| German                |     `de`      |                    |
| Italian               |     `it`      |                    |
| Japanese              |     `ja`      |                    |
| Korean                |     `ko`      |                    |
| Norwegian  (Bokmål)   |     `no`      | `nb` also accepted |
| Polish                |     `pl`      |                    |
| Portuguese (Portugal) |    `pt-PT`    | `pt` also accepted |
| Portuguese (Brazil)   |    `pt-BR`    |                    |
| Russian               |     `ru`      |                    |
| Spanish               |     `es`      |                    |
| Swedish               |     `sv`      |                    |

---

## See also

* [Text Analytics API v2 reference](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/)
* [What is the Text Analytics API](overview.md)
* [Language support](language-support.md)
* [Model versioning](concepts/model-versioning.md)