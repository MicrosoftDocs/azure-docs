---
title: What is document and conversation summarization (preview)?
titleSuffix: Azure Cognitive Services
description: Learn about summarizing text.
services: cognitive-services
author: jboback
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: overview
ms.date: 09/26/2022
ms.author: jboback
ms.custom: language-service-summarization, ignite-fall-2021, event-tier1-build-2022
---

# What is document and conversation summarization (preview)?

[!INCLUDE [availability](includes/regional-availability.md)]

Summarization is one of the features offered by [Azure Cognitive Service for Language](../overview.md), a collection of machine learning and AI algorithms in the cloud for developing intelligent applications that involve written language. Use this article to learn more about this feature, and how to use it in your applications.

# [Document summarization](#tab/document-summarization)

This documentation contains the following article types:

* **[Quickstarts](quickstart.md?pivots=rest-api&tabs=document-summarization)** are getting-started instructions to guide you through making requests to the service.
* **[How-to guides](how-to/document-summarization.md)** contain instructions for using the service in more specific or customized ways.

Document summarization uses natural language processing techniques to generate a summary for documents. There are two general approaches to automatic summarization, both of which are supported by the API: extractive and abstractive. 

Extractive summarization extracts sentences that collectively represent the most important or relevant information within the original content. Abstractive summarization generates a summary with concise, coherent sentences or words which is not simply extract sentences from the original document. These features are designed to shorten content that could be considered too long to read.

## Key features

There are two types of document summarization this API provides:

* **Extractive summarization**: Produces a summary by extracting salient sentences within the document.
    * Multiple extracted sentences: These sentences collectively convey the main idea of the document. They’re original sentences extracted from the input document’s content.
    * Rank score: The rank score indicates how relevant a sentence is to a document's main topic. Document summarization ranks extracted sentences, and you can determine whether they're returned in the order they appear, or according to their rank.
    * Multiple returned sentences: Determine the maximum number of sentences to be returned. For example, if you request a three-sentence summary extractive summarization will return the three highest scored sentences.
    * Positional information: The start position and length of extracted sentences.
* **Abstractive summarization**: Generates a summary that may not use the same words as those in the document, but captures the main idea.
    * Single returned sentences: Abstractive summarization returns a single sentence that summarizes the entire text within the document. 
    * Contextual input range: The range of the input document that was used to generated the summary.

As an example, consider the following paragraph of text:

*"Document summarization uses natural language processing techniques to generate a summary for documents. There are two general approaches to automatic summarization, extractive and abstractive. Extractive summarization extracts sentences that collectively represent the most important or relevant information within the original content, and abstractive summarization generates a summary with concise, coherent sentences or words which is not simply extract sentences from the original document. These features are designed to shorten content that could be considered too long to read."*

The document summarization feature would simplify the text into the following key sentences:

**Extractive summarization**:
- "Document summarization uses natural language processing techniques to generate a summary for documents."
- "There are two general approaches to auto summarization, extractive and abstractive."
- "Extractive summarization extracts sentences that collectively represent the most important or relevant information within the original content and abstractive summarization generates a summary with concise, coherent sentences or words words which is not simply extract sentences from the original document."

**Abstractive summarization**:
- "Document summarization uses natural language processing techniques to generate a summary for documents."
- "There are two general approaches to auto summarization, extractive and abstractive."
- "These features are designed to shorten content that could be considered too long to read."


# [Conversation summarization](#tab/conversation-summarization)

> [!IMPORTANT]
> Conversation summarization is only available in English.

This documentation contains the following article types:

* **[Quickstarts](quickstart.md?pivots=rest-api&tabs=conversation-summarization)** are getting-started instructions to guide you through making requests to the service.
* **[How-to guides](how-to/conversation-summarization.md)** contain instructions for using the service in more specific or customized ways.

## Key features

Conversation summarization supports the following features:

* **Issue/resolution summarization**: A call center specific feature that gives a summary of issues and resolutions in conversations between customer-service agents and your customers.
* **Chapter title summarization**: Gives suggested chapter titles of the input conversation.
* **Narrative summarization**: Gives call notes, meeting notes or chat summaries of the input conversation.

## When to use issue resolution summarization

* When there are aspects of an “issue” and “resolution”, such as:
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
| Customer wants to use the wifi connection on their Smart Brew 300. But it didn't work. |  One or two sentences     | issue  |
| Checked if the power light is blinking slowly. Checked the Contoso coffee app. It had no prompt. Tried to do a factory reset. | One or more sentences, generated from multiple lines of the transcript.    | resolution |

---

## Get started with summarization

# [Document summarization](#tab/document-summarization)

To use this feature, you submit raw unstructured text for analysis and handle the API output in your application. Analysis is performed as-is, with no additional customization to the model used on your data. There are two ways to use summarization:

|Development option  |Description  | Links |
|---------|---------|---------|
| Language Studio    | A web-based platform that enables you to try document summarization without needing writing code. | • [Language Studio website](https://language.cognitive.azure.com/tryout/summarization) <br> • [Quickstart: Use Language Studio](../language-studio.md) |
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
* Summarization works with a variety of written languages. See [language support](language-support.md?tabs=document-summarization) for more information.

# [Conversation summarization](#tab/conversation-summarization)

* Conversation summarization takes structured text for analysis. See the [data and service limits](../concepts/data-limits.md) for more information.
* Conversation summarization accepts text in English. See [language support](language-support.md?tabs=conversation-summarization) for more information.

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
