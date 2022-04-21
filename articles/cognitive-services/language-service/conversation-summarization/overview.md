---
title: What is conversation summarization in Azure Cognitive Service for Language (preview)?
titleSuffix: Azure Cognitive Services
description: Learn about summarizing conversations.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: overview
ms.date: 03/16/2022
ms.author: aahi
ms.custom: language-service-conversation-summarization
---

# What is conversation summarization (preview) in Azure Cognitive Service for Language?

Conversation summarization is one of the features offered by [Azure Cognitive Service for Language](../overview.md), a collection of machine learning and AI algorithms in the cloud for developing intelligent applications that involve written language. Use this article to learn more about this feature, and how to use it in your applications. 

This documentation contains the following article types:

* [**Quickstarts**](quickstart.md) are getting-started instructions to guide you through making requests to the service.
* [**How-to guides**](how-to/call-api.md) contain instructions for using the service in more specific or customized ways.

## Conversation summarization feature

Conversation summarization is a broad topic, encompassing ... 

Conversation summarization uses abstractive text summarization to produce a summary of issues and resolutions in transcripts of web chats and service call transcripts between customer-service agents, and your customers. 

:::image type="content" source="media/feature-diagram.svg" alt-text="A diagram showing an example of sending data to conversation summarization.":::
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

## Get started with conversation summarization

To use this feature, you submit raw unstructured text for analysis and handle the API output in your application. Analysis is performed as-is, with no additional customization to the model used on your data. There are two ways to use conversation summarization:


|Development option  |Description  | Links | 
|---------|---------|---------|
| Language Studio    | A web-based platform that enables you to try conversation summarization without needing writing code. | • [Language Studio website](https://language.cognitive.azure.com/tryout/summarization) <br> • [Quickstart: Use the Language studio](../language-studio.md) |
| REST API     | Integrate conversation summarization into your applications using the REST API. | [Quickstart: Use conversation summarization](quickstart.md) |

## Input requirements and service limits

* Conversation summarization takes raw unstructured text for analysis. See the [data and service limits](../concepts/data-limits.md) in the how-to guide for more information.
* See [language support](language-support.md) for more information.

## Reference documentation and code samples

As you use text summarization in your applications, see the following reference documentation and samples for Azure Cognitive Services for Language:

|Development option / language  |Reference documentation |Samples  |
|---------|---------|---------|
|REST API     | [REST API documentation](https://westus2.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-2-Preview-2/operations/Analyze)        |         |

## Responsible AI 

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it’s deployed. Read the [transparency note for conversation summarization](/legal/cognitive-services/language-service/transparency-note-extractive-summarization?context=/azure/cognitive-services/language-service/context/context) to learn about responsible AI use and deployment in your systems. You can also see the following articles for more information:

[!INCLUDE [Responsible AI links](../includes/overview-responsible-ai-links.md)]
