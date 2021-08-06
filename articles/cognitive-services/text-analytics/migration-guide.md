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
---

# Migrate to version 3.x of the Text Analytics API

If you're using version 2.1 of the Text Analytics API, this article will help you upgrade your application to use version 3.x. Version 3.1 and 3.0 are generally available and introduce new features such as expanded [Named Entity Recognition (NER)](how-tos/text-analytics-how-to-entity-linking.md#named-entity-recognition-features-and-versions) and [model versioning](concepts/model-versioning.md). Version of v3.1 is also available, which adds features such as [opinion mining](how-tos/text-analytics-how-to-sentiment-analysis.md#sentiment-analysis-versions-and-features) and [Personally Identifying Information](how-tos/text-analytics-how-to-entity-linking.md?tabs=version-3-1#personally-identifiable-information-pii) detection. The models used in v2 or 3.1-preview.x will not receive future updates. 

## [Sentiment analysis](#tab/sentiment-analysis)

> [!TIP]
> Want to use the latest version of the API in your application? See the [sentiment analysis](how-tos/text-analytics-how-to-sentiment-analysis.md) how-to article  and [quickstart](quickstarts/client-libraries-rest-api.md) for information on the current version of the API. 

### Feature changes 

Sentiment Analysis in version 2.1 returns sentiment scores between 0 and 1 for each document sent to the API, with scores closer to 1 indicating more positive sentiment. Version 3 instead returns sentiment labels (such as "positive" or "negative")  for both the sentences and the document as a whole, and their associated confidence scores. 

### Steps to migrate

#### REST API

If your application uses the REST API, update its request endpoint to the v3 endpoint for sentiment analysis. For example:`https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.1/sentiment`. You will also need to update the application to use the sentiment labels returned in the [API's response](how-tos/text-analytics-how-to-sentiment-analysis.md#view-the-results). 

See the reference documentation for examples of the JSON response.
* [Version 2.1](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/56f30ceeeda5650db055a3c9)
* [Version 3.0](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-0/operations/Sentiment) 
* [Version 3.1](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1/operations/Sentiment)

#### Client libraries

[!INCLUDE [Client library migration information](includes/client-library-migration-section.md)]

## [NER and entity linking](#tab/named-entity-recognition)

> [!TIP]
> Want to use the latest version of the API in your application? See the [NER and entity linking](how-tos/text-analytics-how-to-entity-linking.md) how-to article and [quickstart](quickstarts/client-libraries-rest-api.md) for information on the current version of the API. 

### Feature changes

In version 2.1, the Text Analytics API uses one endpoint for Named Entity Recognition (NER) and entity linking. Version 3 provides expanded named entity detection, and uses separate endpoints for NER and entity linking requests. In v3.1, NER can additionally detect personal `pii` and health `phi` information. 

### Steps to migrate

#### REST API

If your application uses the REST API, update its request endpoint to the v3 endpoints for NER and/or entity linking.

Entity Linking
* `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.1/entities/linking`

NER
* `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.1/entities/recognition/general`

You will also need to update your application to use the [entity categories](named-entity-types.md) returned in the [API's response](how-tos/text-analytics-how-to-entity-linking.md#view-results).

See the reference documentation for examples of the JSON response.
* [Version 2.1](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/5ac4251d5b4ccd1554da7634)
* [Version 3.0](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-0/operations/EntitiesRecognitionGeneral) 
* [Version 3.1](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1/operations/EntitiesRecognitionGeneral)

#### Client libraries

[!INCLUDE [Client library migration information](includes/client-library-migration-section.md)]

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
> Want to use the latest version of the API in your application? See the [language detection](how-tos/text-analytics-how-to-language-detection.md) how-to article and [quickstart](quickstarts/client-libraries-rest-api.md) for information on the current version of the API. 

### Feature changes 

The language detection feature output has changed in v3. The JSON response will contain `ConfidenceScore` instead of `score`. V3 also only returns one language in a  `detectedLanguage` attribute for each document.

### Steps to migrate

#### REST API

If your application uses the REST API, update its request endpoint to the v3 endpoint for language detection. For example:`https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.1/languages`. You will also need to update the application to use `ConfidenceScore` instead of `score` in the [API's response](how-tos/text-analytics-how-to-language-detection.md#step-3-view-the-results). 

See the reference documentation for examples of the JSON response.
* [Version 2.1](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/56f30ceeeda5650db055a3c7)
* [Version 3.0](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-0/operations/Languages) 
* [Version 3.1](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1/operations/Languages)

#### Client libraries

[!INCLUDE [Client library migration information](includes/client-library-migration-section.md)]

## [Key phrase extraction](#tab/key-phrase-extraction)

> [!TIP]
> Want to use the latest version of the API in your application? See the [key phrase extraction](how-tos/text-analytics-how-to-keyword-extraction.md) how-to article and [quickstart](quickstarts/client-libraries-rest-api.md) for information on the current version of the API. 

### Feature changes 

The key phrase extraction feature has not changed in v3 outside of the endpoint version.

### Steps to migrate

#### REST API

If your application uses the REST API, update its request endpoint to the v3 endpoint for key phrase extraction. For example: `https://<your-custom-subdomain>.api.cognitiveservices.azure.com/text/analytics/v3.0/keyPhrases`

See the reference documentation for examples of the JSON response.
* [Version 2.1](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/56f30ceeeda5650db055a3c6)
* [Version 3.0](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-0/operations/KeyPhrases) 
* [Version 3.1](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1/operations/KeyPhrases)

#### Client libraries

[!INCLUDE [Client library migration information](includes/client-library-migration-section.md)]

---

## See also

* [What is the Text Analytics API](overview.md)
* [Language support](language-support.md)
* [Model versioning](concepts/model-versioning.md)
