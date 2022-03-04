---
title: What's new in Azure Cognitive Service for Language?
titleSuffix: Azure Cognitive Services
description: Find out about new releases and features for the Azure Cognitive Service for Language.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: overview
ms.date: 01/07/2022
ms.author: aahi
ms.custom: ignite-fall-2021
---

# What's new in Azure Cognitive Service for Language?

Azure Cognitive Service for Language is updated on an ongoing basis. To stay up-to-date with recent developments, this article provides you with information about new releases and features.

## December 2021

* The version 3.1-preview.x REST endpoints and 5.1.0-beta.x client library have been retired. Please upgrade to the General Available version of the API(v3.1). If you're using the client libraries, use package version 5.1.0 or higher. See the [migration guide](./concepts/migrate-language-service-latest.md) for details.

## November 2021

* Based on ongoing customer feedback, we have increased the character limit per document for Text Analytics for health from 5,120 to 30,720.

* Azure Cognitive Service for Language release, with support for:
    * [Question Answering (now Generally Available)](question-answering/overview.md) 
    * [Sentiment Analysis and opinion mining](sentiment-opinion-mining/overview.md)
    * [Key Phrase Extraction](key-phrase-extraction/overview.md)
    * [Named Entity Recognition (NER), Personally Identifying Information (PII)](named-entity-recognition/overview.md)
    * [Language Detection](language-detection/overview.md)
    * [Text Analytics for health](text-analytics-for-health/overview.md)
    * [Text summarization preview](text-summarization/overview.md)
    * [Custom Named Entity Recognition (Custom NER) preview](custom-named-entity-recognition/overview.md)
    * [Custom Text Classification preview](custom-classification/overview.md)
    * [Conversational Language Understanding preview](conversational-language-understanding/overview.md)

* Preview model version `2021-10-01-preview` for [Sentiment Analysis and Opinion mining](sentiment-opinion-mining/overview.md), which provides:
    * Improved prediction quality.
    * [Additional language support](sentiment-opinion-mining/language-support.md?tabs=sentiment-analysis) for the opinion mining feature.
    * For more information, see the [project z-code site](https://www.microsoft.com/research/project/project-zcode/).
    * To use this [model version](sentiment-opinion-mining/how-to/call-api.md#specify-the-sentiment-analysis-model), you must specify it in your API calls, using the model version parameter. 

* SDK support for sending requests to custom models:
    * [Custom Named Entity Recognition](custom-named-entity-recognition/how-to/call-api.md?tabs=client#use-the-client-libraries)
    * [Custom text classification](custom-classification/how-to/call-api.md?tabs=api#use-the-client-libraries)
    * [Custom language understanding](conversational-language-understanding/how-to/deploy-query-model.md#use-the-client-libraries-azure-sdk)
 
## Next steps

* [What is Azure Cognitive Service for Language?](overview.md)