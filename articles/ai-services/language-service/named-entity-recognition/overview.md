---
title: What is the Named Entity Recognition (NER) feature in Azure AI Language?
titleSuffix: Azure AI services
description: An overview of the Named Entity Recognition feature in Azure AI services, which helps you extract categories of entities in text.
#services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: overview
ms.date: 12/19/2023
ms.author: jboback
ms.custom: language-service-ner
---

# What is Named Entity Recognition (NER) in Azure AI Language?

Named Entity Recognition (NER) is one of the features offered by [Azure AI Language](../overview.md), a collection of machine learning and AI algorithms in the cloud for developing intelligent applications that involve written language. The NER feature can identify and categorize entities in unstructured text. For example: people, places, organizations, and quantities. The prebuilt NER feature has a pre-set list of [recognized entities](concepts/named-entity-categories.md). The custom NER feature allows you to train the model to recognize specialized entities specific to your use case.

* [**Quickstarts**](quickstart.md) are getting-started instructions to guide you through making requests to the service.
* [**How-to guides**](how-to-call.md) contain instructions for using the service in more specific or customized ways.
* The [**conceptual articles**](concepts/named-entity-categories.md) provide in-depth explanations of the service's functionality and features.

> [!NOTE]
> [Entity Resolution](concepts/entity-resolutions.md) was upgraded to the [Entity Metadata](concepts/entity-metadata.md) starting in API version 2023-04-15-preview. If you are calling the preview version of the API equal or newer than 2023-04-15-preview, please check out the [Entity Metadata](concepts/entity-metadata.md) article to use the resolution feature.

[!INCLUDE [Typical workflow for pre-configured language features](../includes/overview-typical-workflow.md)]

## Get started with named entity recognition

[!INCLUDE [development options](./includes/development-options.md)]

[!INCLUDE [Developer reference](../includes/reference-samples-text-analytics.md)] 

## Responsible AI 

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Read the [transparency note for NER](/legal/cognitive-services/language-service/transparency-note-named-entity-recognition?context=/azure/ai-services/language-service/context/context) to learn about responsible AI use and deployment in your systems. You can also see the following articles for more information:

[!INCLUDE [Responsible AI links](../includes/overview-responsible-ai-links.md)]

## Scenarios

*	Enhance search capabilities and search indexing - Customers can build knowledge graphs based on entities detected in documents to enhance document search as tags.
*	Automate business processes - For example, when reviewing insurance claims, recognized entities like name and location could be highlighted to facilitate the review. Or a support ticket could be generated with a customer's name and company automatically from an email.
*	Customer analysis – Determine the most popular information conveyed by customers in reviews, emails, and calls to determine the most relevant topics that get brought up and determine trends over time. 

## Next steps

There are two ways to get started using the Named Entity Recognition (NER) feature:
* [Language Studio](../language-studio.md), which is a web-based platform that enables you to try several Azure AI Language features without needing to write code.
* The [quickstart article](quickstart.md) for instructions on making requests to the service using the REST API and client library SDK.  
