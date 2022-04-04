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
ms.date: 03/16/2022
ms.author: aahi
ms.custom: language-service-summarization, ignite-fall-2021
---

# What is text summarization (preview) in Azure Cognitive Service for Language?

Text summarization is one of the features offered by [Azure Cognitive Service for Language](../overview.md), a collection of machine learning and AI algorithms in the cloud for developing intelligent applications that involve written language. Use this article to learn more about this feature, and how to use it in your applications. 

This documentation contains the following article types:

* [**Quickstarts**](quickstart.md) are getting-started instructions to guide you through making requests to the service.
* [**How-to guides**](how-to/call-api.md) contain instructions for using the service in more specific or customized ways.
## Text summarization feature

Text summarization uses extractive text summarization to produce a summary of a document. It extracts sentences that collectively represent the most important or relevant information within the original content. This feature is designed to shorten content that could be considered too long to read. For example, it can condense articles, papers, or documents to key sentences.

As an example, consider the following paragraph of text:

*"We’re delighted to announce that Cognitive Service for Language service now supports extractive summarization! In general, there are two approaches for automatic text summarization: extractive and abstractive. This feature provides extractive summarization. Text summarization is a feature that produces a text summary by extracting sentences that collectively represent the most important or relevant information within the original content. This feature is designed to shorten content that could be considered too long to read. Extractive summarization condenses articles, papers, or documents to key sentences."*

The text summarization feature would simplify the text into the following key sentences:

:::image type="content" source="media/feature-example.png" alt-text="A simple example of the text summarization feature." lightbox="media/feature-example.png":::

## Key features

Text summarization supports the following features:

* **Extracted sentences**: These sentences collectively convey the main idea of the document. They’re original sentences extracted from the input document’s content.
* **Rank score**: The rank score indicates how relevant a sentence is to a document's main topic. Text summarization ranks extracted sentences, and you can determine whether they're returned in the order they appear, or according to their rank.
* **Maximum sentences**: Determine the maximum number of sentences to be returned. For example, if you request a three-sentence summary Text summarization will return the three highest scored sentences.
* **Positional information**: The start position and length of extracted sentences.

## Get started with text summarization

To use this feature, you submit raw unstructured text for analysis and handle the API output in your application. Analysis is performed as-is, with no additional customization to the model used on your data. There are two ways to use text summarization:


|Development option  |Description  | Links | 
|---------|---------|---------|
| Language Studio    | A web-based platform that enables you to try text summarization without needing writing code. | • [Language Studio website](https://language.cognitive.azure.com/tryout/summarization) <br> • [Quickstart: Use the Language studio](../language-studio.md) |
| REST API or Client library (Azure SDK)     | Integrate text summarization into your applications using the REST API, or the client library available in a variety of languages. | • [Quickstart: Use text summarization](quickstart.md) |

## Input requirements and service limits

* Text summarization takes raw unstructured text for analysis. See [Data and service limits](../concepts/data-limits.md) in the how-to guide for more information.
* Text summarization works with a variety of written languages. See [language support](language-support.md) for more information.

## Reference documentation and code samples

As you use text summarization in your applications, see the following reference documentation and samples for Azure Cognitive Services for Language:

|Development option / language  |Reference documentation |Samples  |
|---------|---------|---------|
|REST API     | [REST API documentation](https://westus2.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-2-Preview-2/operations/Analyze)        |         |
|C#     | [C# documentation](/dotnet/api/azure.ai.textanalytics?view=azure-dotnet-preview&preserve-view=true)        | [C# samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics/samples)        |
| Java     | [Java documentation](/java/api/overview/azure/ai-textanalytics-readme?view=azure-java-preview&preserve-view=true)        | [Java Samples](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/textanalytics/azure-ai-textanalytics/src/samples) |
|JavaScript     | [JavaScript documentation](/javascript/api/overview/azure/ai-text-analytics-readme?view=azure-node-preview&preserve-view=true)        | [JavaScript samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/textanalytics/ai-text-analytics/samples/v5) |
|Python | [Python documentation](/python/api/overview/azure/ai-textanalytics-readme?view=azure-python-preview&preserve-view=true)        | [Python samples](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/textanalytics/azure-ai-textanalytics/samples) |

## Responsible AI 

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it’s deployed. Read the [transparency note for text summarization](/legal/cognitive-services/language-service/transparency-note-extractive-summarization?context=/azure/cognitive-services/language-service/context/context) to learn about responsible AI use and deployment in your systems. You can also see the following articles for more information:

[!INCLUDE [Responsible AI links](../includes/overview-responsible-ai-links.md)]
