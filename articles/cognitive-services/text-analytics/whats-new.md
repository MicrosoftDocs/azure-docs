---
title: What's new in the Text Analytics API
titlesuffix: Text Analytics - Azure Cognitive Services
description: Learn about new developments with the Text Analytics service
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 11/04/2019
ms.author: aahi
---

# What's new in the Text Analytics API?

The Text Analytics API is updated on an ongoing basis. To stay up-to-date with recent developments, this article provides you with information about new releases and features.

## Named Entity Recognition v3 public preview - October 2019

The next version of Named Entity Recognition(NER) is now available for public preview, and provides expanded detection and categorization of entities found in text. It provides:

* Recognition of the following new entity types:
    * Phone number
    * IP address

* A new endpoint for recognizing personal information entity types (English only)
* Separate endpoints for entity recognition and entity linking.

Entity linking supports English and Spanish. NER language support varies by the entity type. For more information, see the link below. 

> [!div class="nextstepaction"]
> [Learn more about Named Entity Recognition v3](how-tos/text-analytics-how-to-entity-linking.md#named-entity-recognition-v3-public-preview)

## Sentiment Analysis v3 public preview - October 2019

The next version of Sentiment Analysis is now available for public preview, and provides significant improvements in the accuracy and detail of the API's text categorization and scoring. It additionally provides:

* Automatic labeling for different sentiments in text.
* Sentiment analysis and output on a document and sentence level. 

It supports English (`en`), Japanese (`ja`), Chinese Simplified (`zh-Hans`),  Chinese Traditional (`zh-Hant`), French (`fr`), Italian (`it`), Spanish (`es`), Dutch (`nl`), Portuguese (`pt`), and German (`de`), and is available in the following regions: `Australia East`, `Central Canada`, `Central US`, `East Asia`, `East US`, `East US 2`, `North Europe`, `Southeast Asia`, `South Central US`, `UK South`, `West Europe`, and `West US 2`.

> [!div class="nextstepaction"]
> [Learn more about Sentiment Analysis v3](how-tos/text-analytics-how-to-sentiment-analysis.md#sentiment-analysis-v3-public-preview)

## Next Steps

* [What is the Text Analytics API?](overview.md)  
* [Example user scenarios](text-analytics-user-scenarios.md)
* [Sentiment analysis](how-tos/text-analytics-how-to-sentiment-analysis.md)
* [Language detection](how-tos/text-analytics-how-to-language-detection.md)
* [Entity recognition](how-tos/text-analytics-how-to-entity-linking.md)
* [Key phrase extraction](how-tos/text-analytics-how-to-keyword-extraction.md)
