---
title: Migrate to the latest version of Azure Cognitive Service for Language
titleSuffix: Azure Cognitive Services
description: Learn how to move your Text Analytics applications to use the latest version of the Language Service.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: article
ms.date: 01/10/2022
ms.author: aahi
ms.custom: ignite-fall-2021
---

# Migrate to the latest version of Azure Cognitive Service for Language

> [!TIP]
> Just getting started with Azure Cognitive Service for Language? See the [overview article](../overview.md) for details on the service, available features, and links to quickstarts for sending your first API requests. 

If your applications are using an older version of the Text Analytics API (before v3.1), or client library (before stable v5.1.0), this article will help you upgrade your applications to use the latest version of the [Azure Cognitive Service for language](../overview.md) features.

## Features

Select one of the features below to see information you can use to update your application.

## [Sentiment analysis](#tab/sentiment-analysis)

> [!NOTE]
> * Want to use the latest version of the API in your application? See the [sentiment analysis](../sentiment-opinion-mining/how-to/call-api.md) how-to article  and [quickstart](../sentiment-opinion-mining/quickstart.md) for information on the current version of the API. 
> * The version `3.1-preview.x` REST API endpoints and `5.1.0-beta.x` client library has been deprecated.

## Feature changes from version 2.1

Sentiment Analysis in version 2.1 returns sentiment scores between 0 and 1 for each document sent to the API, with scores closer to 1 indicating more positive sentiment. The current version of this feature returns sentiment labels (such as "positive" or "negative")  for both the sentences and the document as a whole, and their associated confidence scores.

## Migrate to the current version

### REST API

If your application uses the REST API, update its request endpoint to use the [current endpoint](../sentiment-opinion-mining/quickstart.md?pivots=rest-api) for sentiment analysis. For example:`https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.1/sentiment`. You will also need to update the application to use the sentiment labels returned in the [API's response](../sentiment-opinion-mining/how-to/call-api.md). 

See the reference documentation for examples of the JSON response.
* [Version 2.1](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/56f30ceeeda5650db055a3c9)
* [Version 3.0](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-0/operations/Sentiment) 
* [Version 3.1](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1/operations/Sentiment)

### Client libraries

To use the latest version of the sentiment analysis client library, you will need to download the latest software package in the `Azure.AI.TextAnalytics` namespace. The [quickstart article](../sentiment-opinion-mining/quickstart.md) lists the commands you can use for your preferred language, with example code.

[!INCLUDE [SDK target versions](../includes/sdk-target-versions.md)]

## [NER, PII, and entity linking](#tab/named-entity-recognition)

> [!NOTE]
> Want to use the latest version of the API in your application? See the following articles for information on the current version of the APIs:
>
> * [NER quickstart](../named-entity-recognition/quickstart.md)
> * [Entity linking quickstart](../entity-linking/quickstart.md)
> * [Personally Identifying Information (PII) detection quickstart](../personally-identifiable-information/quickstart.md)
>
> The version `3.1-preview.x` REST API endpoints and `5.1.0-beta.x` client libraries has been deprecated.

## Feature changes from version 2.1

In version 2.1, the Text Analytics API uses one endpoint for Named Entity Recognition (NER) and entity linking. The current version of this feature provides expanded named entity detection, and uses separate endpoints for NER and entity linking requests. Additionally, you can use another feature offered in the Language service that lets you detect [detect personal (pii) and health (phi) information](../personally-identifiable-information/overview.md).

## Migrate to the current version

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

[!INCLUDE [SDK target versions](../includes/sdk-target-versions.md)]

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

> [!NOTE]
> * Want to use the latest version of the API in your application? See the [language detection](../language-detection/how-to/call-api.md) how-to article and [quickstart](../language-detection/quickstart.md) for information on the current version of the API. 
> * The version `3.1-preview.x` REST API endpoints and `5.1.0-beta.x` client libraries has been deprecated.

## Feature changes from version 2.1

The language detection feature output has changed in the current version. The JSON response will contain `ConfidenceScore` instead of `score`. The current version also only returns one language in a  `detectedLanguage` attribute for each document.

## Migrate to the current version

### REST API

If your application uses the REST API, update its request endpoint to the [current endpoint](../language-detection/quickstart.md?pivots=rest-api) for language detection. For example:`https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.1/languages`. You will also need to update the application to use `ConfidenceScore` instead of `score` in the [API's response](../language-detection/how-to/call-api.md). 

See the reference documentation for examples of the JSON response.
* [Version 2.1](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/56f30ceeeda5650db055a3c7)
* [Version 3.0](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-0/operations/Languages) 
* [Version 3.1](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1/operations/Languages)

#### Client libraries

To use the latest version of the sentiment analysis client library, you will need to download the latest software package in the `Azure.AI.TextAnalytics` namespace. The [quickstart article](../language-detection/quickstart.md) lists the commands you can use for your preferred language, with example code.

[!INCLUDE [SDK target versions](../includes/sdk-target-versions.md)]

## [Key phrase extraction](#tab/key-phrase-extraction)

> [!NOTE]
> * Want to use the latest version of the API in your application? See the [key phrase extraction](../key-phrase-extraction/how-to/call-api.md) how-to article and [quickstart](../key-phrase-extraction/quickstart.md) for information on the current version of the API. 
> * The version `3.1-preview.x` REST API endpoints and `5.1.0-beta.x` client library has been deprecated.

## Feature changes from version 2.1

The key phrase extraction feature currently has not changed outside of the endpoint version.

## Migrate to the current version

### REST API

If your application uses the REST API, update its request endpoint to the [current endpoint](../key-phrase-extraction/quickstart.md?pivots=rest-api) for key phrase extraction. For example: `https://<your-custom-subdomain>.api.cognitiveservices.azure.com/text/analytics/v3.1/keyPhrases`

See the reference documentation for examples of the JSON response.
* [Version 2.1](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/56f30ceeeda5650db055a3c6)
* [Version 3.0](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-0/operations/KeyPhrases) 
* [Version 3.1](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1/operations/KeyPhrases)

### Client libraries

To use the latest version of the sentiment analysis client library, you will need to download the latest software package in the `Azure.AI.TextAnalytics` namespace. The [quickstart article](../key-phrase-extraction/quickstart.md) lists the commands you can use for your preferred language, with example code.

[!INCLUDE [SDK target versions](../includes/sdk-target-versions.md)]

---

## See also

* [What is Azure Cognitive Service for language?](../overview.md)
