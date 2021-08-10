---
title: Key Phrase Extraction in Azure Language services
titleSuffix: Azure Cognitive Services
description: Learn about Key Phrase Extraction with Language Services.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: overview
ms.date: 07/09/2021
ms.author: aahi
---

# What is the Key Phrase Extraction API?

Use Key Phrase Extraction to quickly identify the main concepts in text. For example, in the text "The food was delicious and there were wonderful staff", Key Phrase Extraction will return the main talking points: "food" and "wonderful staff".

This documentation contains the following types of articles:

* [How-to guides](how-to/call-api.md) contain instructions for using the service in more specific or customized ways.

This feature is a part of Azure Language services, which is a part [Azure Cognitive Services](../overview.md), a collection of machine learning and AI algorithms in the cloud for your development projects. You can use these features with the REST API and client library.

## Typical workflow

To use the API, you submit data for analysis and handle outputs in your application. Analysis is performed as-is, with no additional customization to the model used on your data.

1. Create an Azure resource for Language Services. Afterwards, get the key and endpoint generated for you to authenticate your requests.

2. Formulate a request using either the REST API or the client library for: C#, Java, JavaScript or Python. You can also call the API asynchronously to combine requests to multiple [Language Services](../overview.md) features in a single call.

3. Send the request containing your data as raw unstructured text. Your key and endpoint will be used for authentication.

4. Stream or store the response locally. The result will be a collection of important words and terms in your text. 

## Responsible AI 

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Read the following articles to learn about responsible AI use and deployment in your systems:

* [Transparency note for Language services](/legal/cognitive-services/text-analytics/transparency-note)
* [Transparency note for Sentiment Analysis and Opinion Mining](/legal/cognitive-services/text-analytics/transparency-note-sentiment-analysis)
* [Integration and responsible use](/legal/cognitive-services/text-analytics/guidance-integration-responsible-use)
* [Data, privacy and security](/legal/cognitive-services/text-analytics/data-privacy)
