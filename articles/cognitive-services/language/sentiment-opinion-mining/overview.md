---
title: Sentiment analysis and opinion mining in Azure Language services
titleSuffix: Azure Cognitive Services
description: Learn about sentiment analysis and opinion mining with Language Services.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: overview
ms.date: 07/09/2021
ms.author: aahi
keywords: text mining, sentiment analysis, opinion mining
---

# What is the Sentiment Analysis and Opinion Mining API?

Azure Language services is a cloud-based service that provides Natural Language Processing (NLP) features for text mining and text analysis, including: sentiment analysis opinion mining.

This documentation contains the following types of articles:

* [How-to guides](how-to/call-api.md) contain instructions for using the service in more specific or customized ways.

## Sentiment analysis

Use sentiment analysis and find out what people think of your brand or topic by mining the text for clues about positive or negative sentiment. 

The feature provides sentiment labels (such as "negative", "neutral" and "positive") based on the highest confidence score found by the service at a sentence and document-level. This feature also returns confidence scores between 0 and 1 for each document & sentences within it for positive, neutral and negative sentiment. You can also be run the service on premises using a container.

## Opinion mining

Starting in the v3.1 preview, opinion mining is a feature of Sentiment Analysis. Also known as Aspect-based Sentiment Analysis in Natural Language Processing (NLP), this feature provides more granular information about the opinions related to words (such as the attributes of products or services) in text.

These features are a part of Azure Language services, which is a part [Azure Cognitive Services](../overview.md), a collection of machine learning and AI algorithms in the cloud for your development projects. You can use these features with the [REST API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-V3-0/) and [client library](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-V3-0/).

## Typical workflow

To use the API, you submit data for analysis and handle outputs in your application. Analysis is performed as-is, with no additional customization to the model used on your data.

1. Create an Azure resource for Language Services. Afterwards, get the key and endpoint generated for you to authenticate your requests.

2. Formulate a request using either the REST API or the client library for: C#, Java, JavaScript or Python. You can also call the API asynchronously to combine requests to multiple [Language Services](../overview.md) features in a single call.

3. Send the request containing your data as raw unstructured text. Your key and endpoint will be used for authentication.

4. Stream or store the response locally. The result will be the recognized sentiments and associated words in the text you send.  

## Responsible AI 

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Read the following articles to learn about responsible AI use and deployment in your systems:

* [Transparency note for Language services](/legal/cognitive-services/text-analytics/transparency-note)
* [Transparency note for Sentiment Analysis and Opinion Mining](/legal/cognitive-services/text-analytics/transparency-note-sentiment-analysis)
* [Integration and responsible use](/legal/cognitive-services/text-analytics/guidance-integration-responsible-use)
* [Data, privacy and security](/legal/cognitive-services/text-analytics/data-privacy)
