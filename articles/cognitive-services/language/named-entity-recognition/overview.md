---
title: Named Entity Recognition (NER) and Personally Identifiable Information (PII) - Azure Cognitive Services
titleSuffix: Azure Cognitive Services
description: Learn how to extract entities and PII using the Language Services API.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: overview
ms.date: 07/15/2021
ms.author: aahi
keywords: text mining, sentiment analysis, text analytics
---

# What is the Named Entity Recognition and Personally Identifiable Information API?

This API is a cloud-based service that provides Natural Language Processing (NLP) features for text mining and text analysis.

The API is a part of [Azure Cognitive Services](../../index.yml), a collection of cloud-based machine learning and AI algorithms for your development projects. You can use these features with the REST API, or the client libraries.

This documentation contains the following types of articles:

* [How-to guides](./how-to-call.md) contain instructions for using the service in more specific or customized ways.

## Named Entity Recognition (NER)

Named Entity Recognition (NER) can Identify and categorize entities in your text as people, places, organizations, quantities, Well-known entities are also recognized and linked to more information on the web.

## Personally Identifying Information (PII)

Identify, and redact PII that occurs in text, such as phone numbers, email addresses, and other identification information. 

## Typical workflow

To use the API, you submit data for analysis and handle outputs in your application. Analysis is performed as-is, with no additional customization to the model used on your data.

1. Create an Azure resource for Language Services. Afterwards, get the key and endpoint generated for you to authenticate your requests.

2. Formulate a request using either the REST API or the client library for: C#, Java, JavaScript or Python. You can also call the API asynchronously to combine requests to multiple [Language Services](../overview.md) features in a single call.

3. Send the request containing your data as raw unstructured text. Your key and endpoint will be used for authentication.

4. Stream or store the response locally. The result will be the recognized entities in the text you send.  


## Responsible AI 

An AI system includes not only the technology, but also: the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Read the following articles to learn about responsible AI use and deployment in your systems:

* [Transparency note for Language services](../overview.md)
* [Transparency note for NER and PII](../overview.md)
* [Integration and responsible use](../overview.md)
* [Data, privacy, and security](../overview.md)

## Next steps

Follow a quickstart to implement and run a service in your preferred development language.

* [Quickstart: Sentiment Analysis and opinion mining](../overview.md)