---
title: What is document and conversation summarization (preview)?
titleSuffix: Azure Cognitive Services
description: Learn about summarizing text.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: overview
ms.date: 05/26/2022
ms.author: aahi
ms.custom: language-service-summarization, ignite-fall-2021, event-tier1-build-2022
---

# What is document and conversation summarization (preview)?

Document summarization is one of the features offered by [Azure Cognitive Service for Language](../overview.md), a collection of machine learning and AI algorithms in the cloud for developing intelligent applications that involve written language. Use this article to learn more about this feature, and how to use it in your applications. 

# [Document summarization](#tab/document-summarization)

This documentation contains the following article types:

* [**Quickstarts**](quickstart.md?pivots=rest-api&tabs=document-summarization) are getting-started instructions to guide you through making requests to the service.
* [**How-to guides**](how-to/document-summarization.md) contain instructions for using the service in more specific or customized ways.

Text summarization is a broad topic, consisting of several approaches to represent relevant information in text. The document summarization feature described in this documentation enables you to use extractive text summarization to produce a summary of a document. It extracts sentences that collectively represent the most important or relevant information within the original content. This feature is designed to shorten content that could be considered too long to read. For example, it can condense articles, papers, or documents to key sentences.

As an example, consider the following paragraph of text:

*"We’re delighted to announce that Cognitive Service for Language service now supports extractive summarization! In general, there are two approaches for automatic document summarization: extractive and abstractive. This feature provides extractive summarization. Document summarization is a feature that produces a text summary by extracting sentences that collectively represent the most important or relevant information within the original content. This feature is designed to shorten content that could be considered too long to read. Extractive summarization condenses articles, papers, or documents to key sentences."*

The document summarization feature would simplify the text into the following key sentences:

:::image type="content" source="media/document-summary-example.png" alt-text="A simple example of the document summarization feature." lightbox="media/document-summary-example.png":::

## Key features

Document summarization supports the following features:

* **Extracted sentences**: These sentences collectively convey the main idea of the document. They’re original sentences extracted from the input document’s content.
* **Rank score**: The rank score indicates how relevant a sentence is to a document's main topic. Document summarization ranks extracted sentences, and you can determine whether they're returned in the order they appear, or according to their rank.
* **Maximum sentences**: Determine the maximum number of sentences to be returned. For example, if you request a three-sentence summary Document summarization will return the three highest scored sentences.
* **Positional information**: The start position and length of extracted sentences.

# [Conversation summarization](#tab/conversation-summarization)

This documentation contains the following article types:

* [**Quickstarts**](quickstart.md?pivots=rest-api&tabs=conversation-summarization) are getting-started instructions to guide you through making requests to the service.
* [**How-to guides**](how-to/document-summarization.md) contain instructions for using the service in more specific or customized ways.

Conversation summarization is a broad topic, consisting of several approaches to represent relevant information in text. The conversation summarization feature described in this documentation enables you to use abstractive text summarization to produce a summary of issues and resolutions in transcripts of web chats and service call transcripts between customer-service agents, and your customers. 

:::image type="content" source="media/conversation-summary-diagram.svg" alt-text="A diagram for sending data to the conversation summarization feature.":::

## When to use conversation summarization

* When there are predefined aspects of an “issue” and “resolution”, such as:
    * The reason for a service chat/call (the issue).
    * That resolution for the issue. 
* You only want a summary that focuses on related information about issues and resolutions.
* When there are two participants in the conversation, and you want to summarize what each had said.

As an example, consider the following example conversation:

**Agent**: "*Hello, you’re chatting with Rene. How may I help you?*" 

**Customer**: "*Hi, I tried to set up wifi connection for Smart Brew 300 espresso machine, but it didn’t work.*" 

**Agent**: "*I’m sorry to hear that. Let’s see what we can do to fix this issue. Could you push the wifi connection button, hold for 3 seconds, then let me know if the power light is slowly blinking?*" 

**Customer**: "*Yes, I pushed the wifi connection button, and now the power light is slowly blinking.*" 

**Agent**: "*Great. Thank you! Now, please check in your Contoso Coffee app. Does it prompt to ask you to connect with the machine?*" 

**Customer**: "*No. Nothing happened.*" 

**Agent**: "*I see. Thanks. Let’s try if a factory reset can solve the issue. Could you please press and hold the center button for 5 seconds to start the factory reset.*"  

**Customer**: *"I’ve tried the factory reset and followed the above steps again, but it still didn’t work."* 

**Agent**: "*I’m very sorry to hear that. Let me see if there’s another way to fix the issue. Please hold on for a minute.*"

Conversation summarization feature would simplify the text into the following:

|Example summary  | Format | Conversation aspect |
|---------|----|----|
|  Customer wants to use the wifi connection on their Smart Brew 300. They can’t connect it using the Contoso Coffee app. |  One or two sentences     | issue  |
| Checked if the power light is blinking slowly. Tried to do a factory reset. | One or more sentences, generated from multiple lines of the transcript.    | resolution |

---

## Get started with summarization

# [Document summarization](#tab/document-summarization)

To use this feature, you submit raw unstructured text for analysis and handle the API output in your application. Analysis is performed as-is, with no additional customization to the model used on your data. There are two ways to use summarization:


|Development option  |Description  | Links | 
|---------|---------|---------|
| Language Studio    | A web-based platform that enables you to try document summarization without needing writing code. | • [Language Studio website](https://language.cognitive.azure.com/tryout/summarization) <br> • [Quickstart: Use the Language studio](../language-studio.md) |
| REST API or Client library (Azure SDK)     | Integrate document summarization into your applications using the REST API, or the client library available in a variety of languages. | • [Quickstart: Use document summarization](quickstart.md) |


# [Conversation summarization](#tab/conversation-summarization)

To use this feature, you submit raw text for analysis and handle the API output in your application. Analysis is performed as-is, with no additional customization to the model used on your data. There are two ways to use conversation summarization:


|Development option  |Description  | Links | 
|---------|---------|---------|
| REST API     | Integrate conversation summarization into your applications using the REST API. | [Quickstart: Use conversation summarization](quickstart.md) |

---

## Input requirements and service limits

# [Document summarization](#tab/document-summarization)

* Summarization takes raw unstructured text for analysis. See [Data and service limits](../concepts/data-limits.md) in the how-to guide for more information.
* Summarization works with a variety of written languages. See [language support](language-support.md) for more information.


# [Conversation summarization](#tab/conversation-summarization)

* Conversation summarization takes structured text for analysis. See the [data and service limits](../concepts/data-limits.md) for more information.
* Conversation summarization accepts text in English. See [language support](language-support.md) for more information.

---

## Reference documentation and code samples

As you use document summarization in your applications, see the following reference documentation and samples for Azure Cognitive Services for Language:

|Development option / language  |Reference documentation |Samples  |
|---------|---------|---------|
|REST API     | [REST API documentation](https://westus2.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-2-Preview-2/operations/Analyze)        |         |
|C#     | [C# documentation](/dotnet/api/azure.ai.textanalytics?view=azure-dotnet-preview&preserve-view=true)        | [C# samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics/samples)        |
| Java     | [Java documentation](/java/api/overview/azure/ai-textanalytics-readme?view=azure-java-preview&preserve-view=true)        | [Java Samples](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/textanalytics/azure-ai-textanalytics/src/samples) |
|JavaScript     | [JavaScript documentation](/javascript/api/overview/azure/ai-text-analytics-readme?view=azure-node-preview&preserve-view=true)        | [JavaScript samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/textanalytics/ai-text-analytics/samples/v5) |
|Python | [Python documentation](/python/api/overview/azure/ai-textanalytics-readme?view=azure-python-preview&preserve-view=true)        | [Python samples](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/textanalytics/azure-ai-textanalytics/samples) |

## Responsible AI 

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it’s deployed. Read the [transparency note for summarization](/legal/cognitive-services/language-service/transparency-note-extractive-summarization?context=/azure/cognitive-services/language-service/context/context) to learn about responsible AI use and deployment in your systems. You can also see the following articles for more information:

* [Transparency note for Azure Cognitive Service for Language](/legal/cognitive-services/language-service/transparency-note?context=/azure/cognitive-services/language-service/context/context)
* [Integration and responsible use](/legal/cognitive-services/language-service/guidance-integration-responsible-use-summarization?context=/azure/cognitive-services/language-service/context/context)
* [Characteristics and limitations of summarization](/legal/cognitive-services/language-service/characteristics-and-limitations-summarization?context=/azure/cognitive-services/language-service/context/context)
* [Data, privacy, and security](/legal/cognitive-services/language-service/data-privacy?context=/azure/cognitive-services/language-service/context/context)

