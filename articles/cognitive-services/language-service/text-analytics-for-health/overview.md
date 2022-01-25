---
title: What is the Text Analytics for health in Azure Cognitive Service for Language?
titleSuffix: Azure Cognitive Services
description: An overview of Text Analytics for health in Azure Cognitive Services, which helps you extract medical information from unstructured text, like clinical documents.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: overview
ms.date: 11/19/2021
ms.author: aahi
ms.custom: language-service-health, ignite-fall-2021
---

# What is Text Analytics for health in Azure Cognitive Service for Language?

[!INCLUDE [service notice](includes/service-notice.md)]

Text Analytics for health is one of the features offered by [Azure Cognitive Service for Language](../overview.md), a collection of machine learning and AI algorithms in the cloud for developing intelligent applications that involve written language. 

Text Analytics for health extracts and labels relevant medical information from unstructured texts such as doctor's notes, discharge summaries, clinical documents, and electronic health records.

This documentation contains the following types of articles:

* [**Quickstarts**](quickstart.md) are getting-started instructions to guide you through making requests to the service.
* [**How-to guides**](how-to/call-api.md) contain instructions for using the service in more specific or customized ways.
* The [**conceptual articles**](concepts/health-entity-categories.md) provide in-depth explanations of the service's functionality and features.

> [!VIDEO https://docs.microsoft.com/Shows/AI-Show/Introducing-Text-Analytics-for-Health/player]

## Features

[!INCLUDE [Text Analytics for health](includes/features.md)]

[!INCLUDE [Typical workflow for pre-configured language features](../includes/overview-typical-workflow.md)]

## Deploy on premises using Docker containers

Use the available Docker container to [deploy this feature on-premises](how-to/use-containers.md). These docker containers enable you to bring the service closer to your data for compliance, security, or other operational reasons.

## Responsible AI 

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Read the [transparency note for Text Analytics for health](/legal/cognitive-services/language-service/transparency-note-health?context=/azure/cognitive-services/language-service/context/context) to learn about responsible AI use and deployment in your systems. You can also see the following articles for more information:

[!INCLUDE [Responsible AI links](../includes/overview-responsible-ai-links.md)]

## Next steps

There are two ways to get started using the entity linking feature:
* [Language Studio](../language-studio.md), which is a web-based platform that enables you to try several Azure Cognitive Service for Language features without needing to write code.
* The [quickstart article](quickstart.md) for instructions on making requests to the service using the REST API and client library SDK.  
