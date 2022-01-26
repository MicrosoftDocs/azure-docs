---
title: What is text summarization in Azure Cognitive Service for Language (preview)?
titleSuffix: Azure Cognitive Services
description: Learn about summarizing text.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: overview
ms.date: 01/26/2022
ms.author: aahi
ms.custom: language-service-summarization, ignite-fall-2021
---

# What is text summarization (preview) in Azure Cognitive Service for Language?

Text summarization is one of the features offered by [Azure Cognitive Service for Language](../overview.md), a collection of machine learning and AI algorithms in the cloud for developing intelligent applications that involve written language. 

This feature uses text summarization to produce a summary of a document. It extracts sentences that collectively represent the most important or relevant information within the original content. This feature is designed to shorten content that could be considered too long to read. For example, it can condense articles, papers, or documents to key sentences.
<!--
:::image type="content" source="media/feature-example.png" alt-text="A diagram of the text analytics feature.":::
-->

For example, consider the following paragraph of text:

*"We’re delighted to announce that Text Analytics now supports extractive summarization. In general, there are two approaches for automatic text summarization: extractive and abstractive. The Text Analytics API provides extractive summarization. Text Analytics for Extractive Summarization is a feature that produces a text summary by extracting sentences that collectively represent the most important or relevant information within the original content. This feature is designed to shorten content that could be considered too long to read. Extractive summarization condenses articles, papers, or documents to key sentences."*

The text summarization feature would simplify the text into the following key sentences:

:::image type="content" source="media/feature-example-2.png" alt-text="A simple example of the text summarization feature." lightbox="media/feature-example-2.png":::

This documentation contains the following article types:

* [**Quickstarts**](quickstart.md) are getting-started instructions to guide you through making requests to the service.
* [**How-to guides**](how-to/call-api.md) contain instructions for using the service in more specific or customized ways.

## Features

Text summarization supports the following features:

* **Extracted sentences**: These sentences collectively convey the main idea of the document. They are original sentences extracted from the input document’s content.
* **Rank score**: The rank score indicates how relevant a sentence is to a document's main topic. Text summarization ranks extracted sentences, and you can determine whether they're returned in the order they appear, or according to their rank.
* **Maximum sentences**: Determine the maximum number of sentences to be returned. For example, if you request a three-sentence summary Text summarization will return the three highest scored sentences.

## Use text summarization

To use this feature, you submit raw unstructured text for analysis and handle the API output in your application. Analysis is performed as-is, with no additional customization to the model used on your data. There are two ways to use text summarization:

### Language studio

[Language Studio](https://language.cognitive.azure.com/tryout/summarization) is a web-based platform that enables you to try several Azure Cognitive Service for Language features without needing to write code. use the [language studio quickstart](../language-studio.md) to learn about....

### REST API or Client library (Azure SDK)

The [text summarization quickstart](quickstart.md) for instructions on making requests to the service using the REST API, or the client library available in a variety of languages.  

<!--[!INCLUDE [Typical workflow for pre-configured language features](../includes/overview-typical-workflow.md)]-->

### Deploy on premises using Docker containers

*for example only - summarization doesn't have a container*

Use the available Docker container to deploy this feature on-premises. These docker containers enable you to bring the service closer to your data for compliance, security, or other operational reasons.

## Responsible AI 

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Read the [transparency note for language detection](/legal/cognitive-services/language-service/transparency-note-extractive-summarization?context=/azure/cognitive-services/language-service/context/context) to learn about responsible AI use and deployment in your systems. You can also see the following articles for more information:

[!INCLUDE [Responsible AI links](../includes/overview-responsible-ai-links.md)]

<!--
## Next steps

There are two ways to get started using the text summarization feature:
* [Language Studio](../language-studio.md), which is a web-based platform that enables you to try several Azure Cognitive Service for Language features without needing to write code.
* The [quickstart article](quickstart.md) for instructions on making requests to the service using the REST API and client library SDK.  
-->