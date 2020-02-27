---
title: What's new in the Text Analytics API
titleSuffix: Text Analytics - Azure Cognitive Services
description: This article provides you with information about new releases and features for the Azure Cognitive Services Text Analytics.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 02/06/2020
ms.author: aahi
---

# What's new in the Text Analytics API?

The Text Analytics API is updated on an ongoing basis. To stay up-to-date with recent developments, this article provides you with information about new releases and features.

## February 2020

### SDK support for Text Analytics API v3 Public Preview

As part of the [unified Azure SDK release](https://techcommunity.microsoft.com/t5/azure-sdk/january-2020-unified-azure-sdk-release/ba-p/1097290), the Text Analytics API v3 SDK is now available as a public preview for the following programming languages:
   * [C#](https://docs.microsoft.com/azure/cognitive-services/text-analytics/quickstarts/text-analytics-sdk?tabs=version-3&pivots=programming-language-csharp)
   * [Python](https://docs.microsoft.com/azure/cognitive-services/text-analytics/quickstarts/text-analytics-sdk?tabs=version-3&pivots=programming-language-python)
   * [JavaScript (Node.js)](https://docs.microsoft.com/azure/cognitive-services/text-analytics/quickstarts/text-analytics-sdk?tabs=version-3&pivots=programming-language-javascript)
   * [Java](https://docs.microsoft.com/azure/cognitive-services/text-analytics/quickstarts/text-analytics-sdk?tabs=version-3&pivots=programming-language-java)

> [!div class="nextstepaction"]
> [Learn more about Text Analytics API v3 SDK](https://docs.microsoft.com/azure/cognitive-services/text-analytics/quickstarts/text-analytics-sdk?tabs=version-3)

### Named Entity Recognition v3 public preview

Additional entity types are now available in the Named Entity Recognition (NER) v3 public preview service as we expand the detection of general and personal information entities found in text. This update introduces [model version](how-tos/text-analytics-how-to-entity-linking.md#named-entity-recognition-versions-and-features) `2020-02-01`, which includes:

* Recognition of the following general entity types (English only):
    * PersonType
    * Product
    * Event
    * Geopolitical Entity (GPE) as a subtype under Location
    * Skill

* Recognition of the following personal information entity types (English only):
    * Person
    * Organization
    * Age as a subtype under Quantity
    * Date as a subtype under DateTime
    * Email 
    * Phone Number (US only)
    * URL
    * IP Address

> [!div class="nextstepaction"]
> [Learn more about Named Entity Recognition v3](how-tos/text-analytics-how-to-entity-linking.md#named-entity-recognition-versions-and-features)

### October 2019

#### Named Entity Recognition (NER)

* A [new endpoint](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-0-Preview-1/operations/EntitiesRecognitionPii) for recognizing personal information entity types (English only)

* Separate endpoints for [entity recognition](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-0-Preview-1/operations/EntitiesRecognitionGeneral) and [entity linking](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-0-Preview-1/operations/EntitiesLinking).

* [Model version](how-tos/text-analytics-how-to-entity-linking.md#named-entity-recognition-versions-and-features) `2019-10-01`, which includes:
    * Expanded detection and categorization of entities found in text. 
    * Recognition of the following new entity types:
        * Phone number
        * IP address

Entity linking supports English and Spanish. NER language support varies by the entity type.

#### Sentiment Analysis v3 public preview

* A [new endpoint](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-0-Preview-1/operations/Sentiment) for analyzing sentiment.
* [Model version](how-tos/text-analytics-how-to-sentiment-analysis.md#sentiment-analysis-versions-and-features) `2019-10-01`, which includes:

    * Significant improvements in the accuracy and detail of the API's text categorization and scoring.
    * Automatic labeling for different sentiments in text.
    * Sentiment analysis and output on a document and sentence level. 

It supports English (`en`), Japanese (`ja`), Chinese Simplified (`zh-Hans`),  Chinese Traditional (`zh-Hant`), French (`fr`), Italian (`it`), Spanish (`es`), Dutch (`nl`), Portuguese (`pt`), and German (`de`), and is available in the following regions: `Australia East`, `Central Canada`, `Central US`, `East Asia`, `East US`, `East US 2`, `North Europe`, `Southeast Asia`, `South Central US`, `UK South`, `West Europe`, and `West US 2`. 

> [!div class="nextstepaction"]
> [Learn more about Sentiment Analysis v3](how-tos/text-analytics-how-to-sentiment-analysis.md#sentiment-analysis-versions-and-features)

## Next steps

* [What is the Text Analytics API?](overview.md)  
* [Example user scenarios](text-analytics-user-scenarios.md)
* [Sentiment analysis](how-tos/text-analytics-how-to-sentiment-analysis.md)
* [Language detection](how-tos/text-analytics-how-to-language-detection.md)
* [Entity recognition](how-tos/text-analytics-how-to-entity-linking.md)
* [Key phrase extraction](how-tos/text-analytics-how-to-keyword-extraction.md)
