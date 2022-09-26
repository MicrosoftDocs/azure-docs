---
title: What is sentiment analysis and opinion mining in Azure Cognitive Service for Language?
titleSuffix: Azure Cognitive Services
description: An overview of the sentiment analysis feature in Azure Cognitive Services, which helps you find out what people think of a topic by mining text for clues.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: overview
ms.date: 07/27/2022
ms.author: aahi
ms.custom: language-service-sentiment-opinion-mining, ignite-fall-2021
---

# What is sentiment analysis and opinion mining in Azure Cognitive Service for Language?

Sentiment analysis and opinion mining are features offered by [Azure Cognitive Service for Language](../overview.md), a collection of machine learning and AI algorithms in the cloud for developing intelligent applications that involve written language. These features help you find out what people think of your brand or topic by mining text for clues about positive or negative sentiment, and can associate them with specific aspects of the text. 

Both sentiment analysis and opinion mining work with a variety of [written languages](./language-support.md).

* [**Quickstarts**](quickstart.md) are getting-started instructions to guide you through making requests to the service.
* [**How-to guides**](how-to/call-api.md) contain instructions for using the service in more specific or customized ways.

## Sentiment analysis 

The sentiment analysis feature provides sentiment labels (such as "negative", "neutral" and "positive") based on the highest confidence score found by the service at a sentence and document-level. This feature also returns confidence scores between 0 and 1 for each document & sentences within it for positive, neutral and negative sentiment. 

### Deploy on premises using Docker containers

Use the available Docker container to [deploy sentiment analysis on-premises](how-to/use-containers.md). These docker containers enable you to bring the service closer to your data for compliance, security, or other operational reasons.

## Opinion mining

Opinion mining is a feature of sentiment analysis. Also known as aspect-based sentiment analysis in Natural Language Processing (NLP), this feature provides more granular information about the opinions related to words (such as the attributes of products or services) in text.

[!INCLUDE [Typical workflow for pre-configured language features](../includes/overview-typical-workflow.md)]

## Responsible AI 

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Read the [transparency note for sentiment analysis](/legal/cognitive-services/language-service/transparency-note-sentiment-analysis?context=/azure/cognitive-services/language-service/context/context) to learn about responsible AI use and deployment in your systems. You can also see the following articles for more information:

[!INCLUDE [Developer reference](../includes/reference-samples-text-analytics.md)] 

## Next steps

There are two ways to get started using the entity linking feature:
* [Language Studio](../language-studio.md), which is a web-based platform that enables you to try several Language service features without needing to write code.
* The [quickstart article](quickstart.md) for instructions on making requests to the service using the REST API and client library SDK.  
