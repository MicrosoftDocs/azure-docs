---
title: Migrate to the latest version of Azure AI Language
titleSuffix: Azure AI services
description: Learn how to move your Text Analytics applications to use the latest version of the Language service.
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 012/19/2023
ms.author: aahi
ms.custom: ignite-fall-2021
---

# Migrate to the latest version of Azure AI Language

> [!TIP]
> Just getting started with Azure AI Language? See the [overview article](../overview.md) for details on the service, available features, and links to quickstarts for information on the current version of the API. 

If your applications are still using the Text Analytics API, or client library (before stable v5.1.0), this article will help you upgrade your applications to use the latest version of the [Azure AI language](../overview.md) features.

## Unified Language endpoint (REST API)

This section applies to applications that use the older `/text/analytics/...` endpoint format for REST API calls. For example:

```http
https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/<version>/<feature>
```

If your application uses the above endpoint format, the REST API endpoint for the following Language service features has changed:

* [Entity linking](../entity-linking/quickstart.md?pivots=rest-api)
* [Key phrase extraction](../key-phrase-extraction/quickstart.md?pivots=rest-api)
* [Language detection](../language-detection/quickstart.md?pivots=rest-api)
* [Named entity recognition (NER)](../named-entity-recognition/quickstart.md?pivots=rest-api)
* [Personally Identifying Information (PII) detection](../personally-identifiable-information/quickstart.md?pivots=rest-api)
* [Sentiment analysis and opinion mining](../sentiment-opinion-mining/quickstart.md?pivots=rest-api)
* [Text analytics for health](../text-analytics-for-health/quickstart.md?pivots=rest-api)

The Language service now provides a unified endpoint for sending REST API requests to these features. If your application uses the REST API, update its request endpoint to use the current endpoint:

```http
https://<your-language-resource-endpoint>/language/:analyze-text?api-version=2022-05-01
```

Additionally, the format of the JSON request body has changed. You'll need to update the request structure that your application sends to the API, for example the following entity recognition JSON body:

```json
{
    "kind": "EntityRecognition",
    "parameters": {
        "modelVersion": "latest"
    },
    "analysisInput":{
        "documents":[
            {
                "id":"1",
                "language": "en",
                "text": "I had a wonderful trip to Seattle last week."
            }
        ]
    }
}
```

Use the quickstarts linked above to see current example REST API calls for the feature(s) you're using, and the associated API output.

## Client libraries

To use the latest version of the client library, you will need to download the latest software package in the `Azure.AI.TextAnalytics` namespace. See the quickstart articles linked above for example code and instructions for using the client library in your preferred language.

<!--[!INCLUDE [SDK target versions](../includes/sdk-target-versions.md)]-->


## Version 2.1 functionality changes

If you're migrating an application from v2.1 of the API, there are several changes to feature functionality you should be aware of.

### Sentiment analysis v2.1

[Sentiment Analysis](../sentiment-opinion-mining/quickstart.md) in version 2.1 returns sentiment scores between 0 and 1 for each document sent to the API, with scores closer to 1 indicating more positive sentiment. The current version of this feature returns sentiment labels (such as "positive" or "negative")  for both the sentences and the document as a whole, and their associated confidence scores.

### NER, PII, and entity linking v2.1

In version 2.1, the Text Analytics API used one endpoint for Named Entity Recognition (NER) and entity linking. The current version of this feature provides expanded named entity detection, and has separate endpoints for [NER](../named-entity-recognition/quickstart.md?pivots=rest-api) and [entity linking](../entity-linking/quickstart.md?pivots=rest-api) requests. Additionally, you can use another feature offered in the Language service that lets you detect [detect personal (PII) and health (PHI) information](../personally-identifiable-information/overview.md).

You will also need to update your application to use the [entity categories](../named-entity-recognition/concepts/named-entity-categories.md) returned in the [API's response](../named-entity-recognition/how-to-call.md).

### Version 2.1 entity categories

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

### Language detection v2.1

The [language detection](../language-detection/quickstart.md) feature output has changed in the current version. The JSON response will contain `ConfidenceScore` instead of `score`. The current version also only returns one language for each document.

### Key phrase extraction v2.1

The key phrase extraction feature functionality currently has not changed outside of the endpoint and request format.

## See also

* [What is Azure AI Language?](../overview.md)
* [Language service developer guide](developer-guide.md)
* See the following reference documentation for information on previous API versions.
    * [Version 2.1](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/56f30ceeeda5650db055a3c9)
    * [Version 3.0](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-0/operations/Sentiment) 
    * [Version 3.1](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1/operations/Sentiment)
* Use the following quickstart guides to see examples for the current version of these features. 
    * [Entity linking](../entity-linking/quickstart.md)
    * [Key phrase extraction](../key-phrase-extraction/quickstart.md)
    * [Named entity recognition (NER)](../named-entity-recognition/quickstart.md)
    * [Language detection](../language-detection/quickstart.md)
    * [Personally Identifying Information (PII) detection](../personally-identifiable-information/quickstart.md)
    * [Sentiment analysis and opinion mining](../sentiment-opinion-mining/quickstart.md)
    * [Text analytics for health](../text-analytics-for-health/quickstart.md)
    
