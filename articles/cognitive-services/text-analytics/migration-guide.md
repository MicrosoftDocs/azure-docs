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

# Migrate to version 3.0 of the Text Analytics API

In this article, we'll discuss major changes in version 3 of the API, and considerations when migrating your applications. Text analytics v3 adds new features such as [model versioning](concepts/model-versioning.md) and expanded [entity recognition](how-tos/text-analytics-how-to-entity-linking.md#named-entity-recognition-versions-and-features).

Looking for example code that uses v2 of the API? There are several samples available on GitHub for the following SDKs: [C#](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/samples/TextAnalytics), [Go](https://github.com/Azure-Samples/azure-sdk-for-go-samples/blob/master/cognitiveservices/textanalytics.go), [JavaScript](https://github.com/Azure-Samples/cognitive-services-node-sdk-samples/blob/master/Samples/textAnalytics.js), [Python](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples/blob/master/samples/language/text_analytics_samples.py), and [Ruby](https://github.com/Azure-Samples/cognitive-services-ruby-sdk-samples/blob/master/samples/text_analytics.rb).


## Feature related changes

#### [Sentiment analysis](#tab/sentiment-analysis)

While sentiment analysis in v3 returns sentiment labels, version 2 returns a sentiment score between 0 and 1. Scores closer to 1 indicate positive sentiment, while scores closer to 0 indicate negative sentiment. Sentiment analysis is performed on the entire document, instead of individual entities in the text.

To migrate your application, update its request endpoint to the v3 endpoint for sentiment analysis. For example:`https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.0/sentiment`

You will also need to update your application to use the [sentiment labels](how-tos/text-analytics-how-to-sentiment-analysis.md#sentiment-scoring-and-labeling) returned by the API.

#### [NER and entity linking](#tab/named-entity-recognition)

## Named Entity recognition (NER) and entity linking

Version 3.0 of the API uses provides expanded named entity detection, and uses a separate endpoints for NER and entity linking requests. Version 2 uses a single endpoint. To migrate your application, update its request endpoint to the v3 endpoints for entity linking and NER where appropriate. For example:

Entity Linking
* `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.0/entities/linking`

NER
* `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.0/entities/recognition/general`

You will also need to update your application to use the entity categories returned in v3. See the [Named Entity Recognition](how-tos/text-analytics-how-to-entity-linking.md) article, and [supported v3 entity categories](named-entity-types.md) for more information.


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

## Language detection

Language detection has not changed in v3. To migrate your application, update its request endpoint to the v3 endpoint for this feature. For example:

`https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v2.1/languages`

#### [Key phrase extraction](#tab/key-phrase-extraction)

## Key phrase extraction

Key phrase extraction has not changed in v3. To migrate your application, update its request endpoint to the v3 endpoint for this feature. For example:

`https://<your-custom-subdomain>.api.cognitiveservices.azure.com/text/analytics/v3.0/keyPhrases`

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

## General changes

### SDK support

The Text Analytics client library is available in the following programming languages, as part of the Azure SDK.

| Programming language | Available for v2 | Available for v3.0 |
|----------------------|--------------------|--------------------|
| C#                   | ✔                  | ✔                  |
| Go                   | ✔                   |                    |
| Java                 | ✔                  | ✔                  |
| JavaScript           | ✔                  | ✔                  |
| Python               | ✔                  | ✔                  |
| Ruby                 | ✔                   |                    |

### Data limits

The limits on the number of documents you can send at once have changed. The limits for v2 of the API are below.  

| Endpoint | Max Documents Per Request | 
|----------|-----------|
| Language Detection | 1000 |
| Sentiment Analysis | 1000 |
| Key Phrase Extraction | 1000 |
| Named Entity Recognition | 1000 |
| Entity Linking | 1000 |

Your rate limit will vary with your pricing tier. See the [data and rate limits](concepts/data-limits.md) article for more information.

## See also

* [Text Analytics API v2 reference](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/)
* [What is the Text Analytics API](overview.md)
* [Language support](language-support.md)
* [Model versioning](concepts/model-versioning.md)