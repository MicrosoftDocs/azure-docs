---
title: What is the Named Entity Recognition (NER) feature and Personally Identifying Information (PII) detection in Azure Cognitive Service for language?
titleSuffix: Azure Cognitive Services
description: An overview of the Named Entity Recognition feature in Azure Cognitive Services, which helps you extract entities and sensitive information (PII) in text.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: overview
ms.date: 09/30/2021
ms.author: aahi
---

# What is Named Entity Recognition (NER) and Personally Identifiable Information (PII) detection in Azure Cognitive Service for language?

Named Entity Recognition(NER) is one of the features offered by [Azure Cognitive Services for language](../overview.md), a collection of machine learning and AI algorithms in the cloud for developing intelligent applications that involve written language. The NER feature can identify and categorize entities in unstructured text.

* [**Quickstarts**](quickstart.md) are getting-started instructions to guide you through making requests to the service.
* [**How-to guides**](how-to-call.md) contain instructions for using the service in more specific or customized ways.
* The [**conceptual articles**](concepts/named-entity-categories.md) provide in-depth explanations of the service's functionality and features.

## Named Entity Recognition (NER)

NER can identify and place entities in your text into predefined categories, such as people, places, organizations, and quantities. 

## Personally Identifying Information (PII) recognition

Identify, and redact PII that occurs in text, such as phone numbers, email addresses, and other identification information. 

[!INCLUDE [Typical workflow for pre-configured language features](../includes/overview-typical-workflow.md)]

## Responsible AI 

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Read the [transparency note for NER and PII](/legal/cognitive-services/language-service/transparency-note-named-entity-recognition?context=/azure/cognitive-services/language/context/context) to learn about responsible AI use and deployment in your systems. You can also see the following articles for more information:

[!INCLUDE [Responsible AI links](../includes/overview-responsible-ai-links.md)]

## Next steps

There are two ways to get started using the entity linking feature:
1. [Language Studio](../concepts/language-studio.md), which is a web-based platform that enables you to try several Azure Cognitive Service for language features without needing to write code.
2. The [quickstart article](quickstart.md) for instructions on making requests to the service using the REST API and client library SDK.  