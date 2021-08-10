---
title: What is the Text Summarization API?
titleSuffix: Azure Cognitive Services
description: Learn about summarizing text with Language Services.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: overview
ms.date: 07/09/2021
ms.author: aahi
---

# What is the Text Summarization API?

Extractive summarization is a feature in Language Services that produces a summary by extracting sentences that collectively represent the most important or relevant information within the original content.

This feature is designed to help address the problem with content that users think is too long to read. Extractive summarization condenses articles, papers, or documents to key sentences.

* [How-to guides](how-to/call-api.md) contain instructions for using the service in more specific or customized ways.

This feature is a part of Azure Language services, which is a part [Azure Cognitive Services](../overview.md), a collection of machine learning and AI algorithms in the cloud for your development projects. You can use these features with the REST API and client library.

## Typical workflow
The workflow is simple: you submit data for analysis and handle outputs in your code. Analyzers are consumed as-is, with no additional configuration or customization.

1. Create an Azure resource for Language Services. Afterwards, get the key and endpoint generated for you to authenticate your requests.

2. Formulate a request containing your data as raw unstructured text, using either the REST API or client library.

3. Send the request to the endpoint established during sign-up.

4. Stream or store the response locally. The result will be a collection of summarized sentences extracted by your text. 

## Responsible AI 

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Read the following articles to learn about responsible AI use and deployment in your systems:

* [Transparency note for Language services](/legal/cognitive-services/text-analytics/transparency-note)
* [Transparency note for Sentiment Analysis and Opinion Mining](/legal/cognitive-services/text-analytics/transparency-note-sentiment-analysis)
* [Integration and responsible use](/legal/cognitive-services/text-analytics/guidance-integration-responsible-use)
* [Data, privacy, and security](/legal/cognitive-services/text-analytics/data-privacy)
