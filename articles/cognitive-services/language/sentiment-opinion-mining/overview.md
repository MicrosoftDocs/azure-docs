---
title: Sentiment Analysis and Opinion mining in Azure Language services
titleSuffix: Azure Cognitive Services
description: Learn about text mining with the Text Analytics API. Use it for sentiment analysis, language detection, and other forms of Natural Language Processing.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: overview
ms.date: 07/09/2021
ms.author: aahi
keywords: text mining, sentiment analysis, text analytics
---

# What is the Sentiment Analysis and Opinion Mining API?

Azure Language services is a cloud-based service that provides Natural Language Processing (NLP) features for text mining and text analysis, including: sentiment analysis opinion mining.

This documentation contains the following types of articles:
* [Quickstarts](quickstart.md) are step-by-step instructions that let you make calls to the service and get results in a short period of time. 
* [How-to guides](how-to-call.md) contain instructions for using the service in more specific or customized ways.
* [Concepts](../overview.md) provide in-depth explanations of the service's functionality and features.
* [Tutorials](../overview.md) are longer guides that show you how to use this service as a component in broader business solutions.

## Sentiment analysis

Use sentiment analysis and find out what people think of your brand or topic by mining the text for clues about positive or negative sentiment. 

The feature provides sentiment labels (such as "negative", "neutral" and "positive") based on the highest confidence score found by the service at a sentence and document-level. This feature also returns confidence scores between 0 and 1 for each document & sentences within it for positive, neutral and negative sentiment. You can also be run the service on premises [using a container](how-tos/text-analytics-how-to-install-containers.md).

## Opinion mining

Starting in the v3.1 preview, opinion mining is a feature of Sentiment Analysis. Also known as Aspect-based Sentiment Analysis in Natural Language Processing (NLP), this feature provides more granular information about the opinions related to words (such as the attributes of products or services) in text.

These features are a part of Azure Language services, which is a part [Azure Cognitive Services](../overview.md), a collection of machine learning and AI algorithms in the cloud for your development projects. You can use these features with the [REST API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-V3-0/) and [client library](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-V3-0/).

## Responsible AI 

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Read the following articles to learn about responsible AI use and deployment in your systems:

* [Transparency note for Language services](../overview.md)
* [Transparency note for Sentiment Analysis and Opinion Mining](../overview.md)
* [Integration and responsible use](../overview.md)
* [Data, privacy and security](../overview.md)

## Next steps

Follow a quickstart to implement and run a service in your preferred development language.

* [Quickstart: Sentiment Analysis and opinion mining](quickstart.md)