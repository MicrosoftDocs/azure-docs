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
ms.date: 07/06/2021
ms.author: aahi
ms.custom: ignite-fall-2021
---

# Migrate from version 2 of the Text Analytics API

If your applications are using version 2.1 of the Text Analytics API, this article will help you upgrade your applications to use the latest version of the features, which are now a part of [Azure Cognitive Service for language](../overview.md).

## Features

Select one of the features below to see information you can use to update your application.

## [Sentiment analysis](#tab/sentiment-analysis)

> [!TIP]
> Want to use the latest version of the API in your application? See the [sentiment analysis](../sentiment-opinion-mining/how-to/call-api.md) how-to article  and [quickstart](../sentiment-opinion-mining/quickstart.md) for information on the current version of the API. 

## Feature changes 

Sentiment Analysis in version 2.1 returns sentiment scores between 0 and 1 for each document sent to the API, with scores closer to 1 indicating more positive sentiment. The current version of this feature returns sentiment labels (such as "positive" or "negative")  for both the sentences and the document as a whole, and their associated confidence scores. 

## Steps to migrate

### REST API

If your application uses the REST API, update its request endpoint to use the [current endpoint](../sentiment-opinion-mining/quickstart.md?pivots=rest-api) for sentiment analysis. For example:`https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.1/sentiment`. You will also need to update the application to use the sentiment labels returned in the [API's response](../sentiment-opinion-mining/how-to/call-api.md). 

See the reference documentation for examples of the JSON response.
* [Version 2.1](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/56f30ceeeda5650db055a3c9)
* [Version 3.0](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-0/operations/Sentiment) 
* [Version 3.1](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1/operations/Sentiment)

### Client libraries

To use the latest version of the sentiment analysis client library, you will need to download the latest software package in the `Azure.AI.TextAnalytics` namespace. The [quickstart article](../sentiment-opinion-mining/quickstart.md) lists the commands you can use for your preferred language, with example code.

## [NER and entity linking](#tab/named-entity-recognition)

> [!TIP]
> Want to use the latest version of the API in your application? See the following articles for information on the current version of the APIs:
> NER:
> * [Quickstart](../named-entity-recognition/quickstart.md)
> * [how to call the API](../named-entity-recognition/how-to-call.md) 
> Entity linking
> * [Quickstart](../entity-linking/quickstart.md)
> * [how to call the API](../entity-linking/how-to/call-api.md)

## Feature changes

In version 2.1, the Text Analytics API uses one endpoint for Named Entity Recognition (NER) and entity linking. The current version of this feature provides expanded named entity detection, and uses separate endpoints for NER and entity linking requests. Additionally, you can use another feature offered in the Language service that lets you detect [detect personal (pii) and health (phi) information](../personally-identifiable-information/overview.md). 

## Steps to migrate

### REST API

If your application uses the REST API, update its request endpoint to the [current endpoints](../named-entity-recognition/quickstart.md?pivots=rest-api) for NER and/or entity linking. For example:

Entity Linking
* `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.1/entities/linking`

NER
* `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.1/entities/recognition/general`

You will also need to update your application to use the [entity categories](../named-entity-recognition/concepts/named-entity-categories.md) returned in the [API's response](../named-entity-recognition/how-to-call.md).

See the reference documentation for examples of the JSON response.
* [Version 2.1](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/5ac4251d5b4ccd1554da7634)
* [Version 3.0](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-0/operations/EntitiesRecognitionGeneral) 
* [Version 3.1](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1/operations/EntitiesRecognitionGeneral)

### Client libraries

To use the latest version of the NER and entity linking client libraries, you will need to download the latest software package in the `Azure.AI.TextAnalytics` namespace. The quickstart article for [Named Entity Recognition](../named-entity-recognition/quickstart.md) and [entity linking](../entity-linking/quickstart.md) lists the commands you can use for your preferred language, with example code.

#### Version 2.1 entity categories

The following table lists the entity categories returned for NER v2.1.

| Category   | Description                          |
|------------|--------------------------------------|
| Person   |   Names of people.  |
|Location    | Natural and human-made landmarks, structures, geographical features, and geopolitical entities |
|Organization | Companies, political groups, musical bands, sport clubs, government bodies, and public organizations. Nationalities and religions are not included in this entity type. |
| PhoneNumber | Phone numbers (US and EU phone numbers only). |
| Email | Email addresses. |
| URL | URLs to websites. |
| IP | Network IP addresses. |
| DateTime | Dates and times of day.| 
| Date | Calender dates. |
| Time | Times of day |
| DateRange | Date ranges. |
| TimeRange | Time ranges. |
| Duration | Durations. |
| Set | Set, repeated times. |
| Quantity | Numbers and numeric quantities. |
| Number | Numbers. |
| Percentage | Percentages.|
| Ordinal | Ordinal numbers. |
| Age | Ages. |
| Currency | Currencies. |
| Dimension | Dimensions and measurements. |
| Temperature | Temperatures. |

## [Language detection](#tab/language-detection)

> [!TIP]
> Want to use the latest version of the API in your application? See the [language detection](../language-detection/how-to/call-api.md) how-to article and [quickstart](../language-detection/quickstart.md) for information on the current version of the API. 

## Feature changes 

The language detection feature output has changed in the current version. The JSON response will contain `ConfidenceScore` instead of `score`. The current version also only returns one language in a  `detectedLanguage` attribute for each document.

## Steps to migrate

### REST API

If your application uses the REST API, update its request endpoint to the [current endpoint](../language-detection/quickstart.md?pivots=rest-api) for language detection. For example:`https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.1/languages`. You will also need to update the application to use `ConfidenceScore` instead of `score` in the [API's response](../language-detection/how-to/call-api.md). 

See the reference documentation for examples of the JSON response.
* [Version 2.1](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/56f30ceeeda5650db055a3c7)
* [Version 3.0](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-0/operations/Languages) 
* [Version 3.1](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1/operations/Languages)

#### Client libraries

To use the latest version of the sentiment analysis client library, you will need to download the latest software package in the `Azure.AI.TextAnalytics` namespace. The [quickstart article](../language-detection/quickstart.md) lists the commands you can use for your preferred language, with example code.

## [Key phrase extraction](#tab/key-phrase-extraction)

> [!TIP]
> Want to use the latest version of the API in your application? See the [key phrase extraction](../key-phrase-extraction/how-to/call-api.md) how-to article and [quickstart](../key-phrase-extraction/quickstart.md) for information on the current version of the API. 

## Feature changes 

The key phrase extraction feature currently has not changed outside of the endpoint version.

## Steps to migrate

### REST API

If your application uses the REST API, update its request endpoint to the [current endpoint](../key-phrase-extraction/quickstart.md?pivots=rest-api) for key phrase extraction. For example: `https://<your-custom-subdomain>.api.cognitiveservices.azure.com/text/analytics/v3.1/keyPhrases`

See the reference documentation for examples of the JSON response.
* [Version 2.1](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/56f30ceeeda5650db055a3c6)
* [Version 3.0](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-0/operations/KeyPhrases) 
* [Version 3.1](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1/operations/KeyPhrases)

### Client libraries

To use the latest version of the sentiment analysis client library, you will need to download the latest software package in the `Azure.AI.TextAnalytics` namespace. The [quickstart article](../key-phrase-extraction/quickstart.md) lists the commands you can use for your preferred language, with example code.

---

## See also

* [What is Azure Cognitive Service for language?](../overview.md)
