---
title: What's New - Language Understanding (LUIS)
titleSuffix: Azure Cognitive Services
description: This article contains news about Language Understanding.
author: diberry
manager: nitinme
ms.custom: experiment-luis-0519
services: cognitive-services
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 11/04/2019
ms.author: diberry
---

# What's new in Language Understanding

Learn what's new in the service. These items include release notes, videos, blog posts, and other types of information. Bookmark this page to keep up-to-date with the service.  

## Release notes 

### November 4, 2019 - Ignite

* Improved developer productivity
    * General availability of our [prediction endpoint V3](luis-migration-api-v3.md). 
    * Ability to import and export apps with .lu ([LUDown](https://github.com/microsoft/botbuilder-tools/tree/master/packages/Ludown)) format. This paves the way for an effective CI/CD process. 
* Language expansion
    * [Arabic and Hindi](luis-language-support.md) in public preview.
* Prebuild models
    * [Prebuilt domains](luis-reference-prebuilt-domains.md) is now generally available (GA)
    * Japanese [prebuilt entities](luis-reference-prebuilt-entities.md#japanese-entity-support) - age, currency, number, percentage are not support in V3.
    * Italian [prebuilt entities](luis-reference-prebuilt-entities.md#italian-entity-support) - age, currency, dimension, number, percentage resolution changed from V2.
* Enhance user experience in [preview.luis.ai portal](https://preview.luis.ai) - revamped labeling experience to enable building and debugging complex models.
* Advance language understanding capabilities - [building sophisticated language models](luis-concept-entity-types.md) with less effort. 
* Defining machine learning features at the model level and enabling models to be used as signals to other model, like using entities as features to intents and to other entities.
* New, expanded [limits](luis-boundaries.md) - higher max for phrase lists and total phrases, new model as a feature limits
* Extract information from text in the format of deep hierarchy structure, making conversation applications more powerful.

    ![machine-learned entity image](./media/whats-new/deep-entity-extraction-example.png)

### September 3, 2019

* Azure authoring resource - [migrate now](luis-migration-authoring.md).
    * 500 apps per Azure resource
    * 100 versions per app
* Turkish support for prebuilt entities
* Italian support for datetimeV2

### July 23, 2019

* Update the [Recognizers-Text](https://github.com/microsoft/Recognizers-Text/releases/tag/dotnet-v1.2.3) to 1.2.3
    * Age, Temperature, Dimension, and Currency recognizers in Italian.
    * Improvement in Holiday recognition in English to correctly calculate Thanksgiving-based dates.
    * Improvements in French DateTime to reduce false positives of non-Date and non-Time entities.
    * Support for calendar/school/fiscal year and acronyms in English DateRange.
    * Improved PhoneNumber recognition in Chinese and Japanese.
    * Improved support for NumberRange in English.
    * Performance improvements.

### June 24, 2019

* [OrdinalV2 prebuilt entity](luis-reference-prebuilt-ordinal-v2.md) to support ordering such as next, previous, and last. English culture only.

### May 6, 2019 - //Build Conference

The following features were released at the Build 2019 Conference:

* [Preview of V3 API migration guide](luis-migration-api-v3.md)
* [Improved analytics dashboard](luis-how-to-use-dashboard.md)
* [Improved prebuilt domains](luis-reference-prebuilt-domains.md) 
* [Dynamic list entities](luis-migration-api-v3.md#dynamic-lists-passed-in-at-prediction-time)
* [External entities](luis-migration-api-v3.md#external-entities-passed-in-at-prediction-time)

## Blogs

[Bot Framework](https://blog.botframework.com/)

## Videos

### 2019 Build videos

[How to use Azure Conversational AI to scale your business for the next generation](https://www.youtube.com/watch?v=_k97jd-csuk&feature=youtu.be)

## Service updates

[Azure update announcements for Cognitive Services](https://azure.microsoft.com/updates/?product=cognitive-services)
