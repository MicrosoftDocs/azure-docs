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
ms.date: 06/03/2020
ms.author: aahi
---

# What's new in the Text Analytics API?

The Text Analytics API is updated on an ongoing basis. To stay up-to-date with recent developments, this article provides you with information about new releases and features.

## May 2020

### Text Analytics API v3 General Availability

Text Analysis API v3 is now generally available with the following updates:

* Model version `2020-04-01`
* New [data limits](concepts/data-limits.md) for each feature
* Updated [language support](language-support.md) for [Sentiment Analysis (SA) v3](how-tos/text-analytics-how-to-sentiment-analysis.md)
* Separate endpoint for Entity Linking 
* New "Address" entity category in [Named Entity Recognition (NER) v3](how-tos/text-analytics-how-to-entity-linking.md).
* New subcategories in NER v3:
   * Location - Geographical
   * Location - Structural
   * Organization - Stock Exchange
   * Organization - Medical
   * Organization - Sports
   * Event - Cultural
   * Event - Natural
   * Event - Sports

The following properties in the JSON response have been added:
   * `SentenceText` in Sentiment Analysis
   * `Warnings` for each document 

The names of the following properties in the JSON response have been changed, where applicable:

* `score` has been renamed to `confidenceScore`
    * `confidenceScore` has two decimal points of precision. 
* `type` has been renamed to `category`
* `subtype` has been renamed to `subcategory`

[!INCLUDE [v3 region availability](includes/v3-region-availability.md)]

> [!div class="nextstepaction"]
> [Learn more about Text Analytics API v3](https://westus2.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-0/operations/Languages)

### Text Analytics API v3.1 Public Preview
   * New Sentiment Analysis feature - [Opinion Mining](how-tos/text-analytics-how-to-sentiment-analysis.md#opinion-mining)
   * New [Personal (`PII`) domain filter](how-tos/text-analytics-how-to-entity-linking.md#named-entity-recognition-versions-and-features) for protected health information (`PHI`).
   * New Personal (`PII`) categories:
      * International Classification of Diseases (ICD-9-CM)
      * International Classification of Diseases (ICD-10-CM)

> [!div class="nextstepaction"]
> [Learn more about Text Analytics API v3.1 Preview](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1-preview-1/operations/Languages)

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

Additional entity types are now available in the Named Entity Recognition (NER) v3 public preview service as we expand the detection of general and personal information entities found in text. This update introduces [model version](concepts/model-versioning.md) `2020-02-01`, which includes:

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

* [Model version](concepts/model-versioning.md) `2019-10-01`, which includes:
    * Expanded detection and categorization of entities found in text. 
    * Recognition of the following new entity types:
        * Phone number
        * IP address

Entity linking supports English and Spanish. NER language support varies by the entity type.

#### Sentiment Analysis v3 public preview

* A [new endpoint](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-0-Preview-1/operations/Sentiment) for analyzing sentiment.
* [Model version](concepts/model-versioning.md) `2019-10-01`, which includes:

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
