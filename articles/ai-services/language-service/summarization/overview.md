---
title: What is document and conversation summarization?
titleSuffix: Azure AI services
description: Learn about summarizing text.
services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: overview
ms.date: 01/12/2023
ms.author: jboback
ms.custom: language-service-summarization, ignite-fall-2021, event-tier1-build-2022, ignite-2022
---

# What is document and conversation summarization?

[!INCLUDE [availability](includes/regional-availability.md)]

Summarization is one of the features offered by [Azure AI Language](../overview.md), a collection of machine learning and AI algorithms in the cloud for developing intelligent applications that involve written language. Use this article to learn more about this feature, and how to use it in your applications.

Note that though the services are labeled document and conversation summarization, document summarization only accepts plain text blocks, and conversation summarization will accept various speech artifacts in order for the model to learn more. If you want to process a conversation but only care about text, you can use document summarization for that scenario.

Custom Summarization enables users to build custom AI models to summarize unstructured text, such as contracts or novels. By creating a Custom Summarization project, developers can iteratively label data, train, evaluate, and improve model performance before making it available for consumption. The quality of the labeled data greatly impacts model performance. To simplify building and customizing your model, the service offers a custom web portal that can be accessed through the [Language studio](https://aka.ms/languageStudio). You can easily get started with the service by following the steps in this [quickstart](custom/quickstart.md).

# [Document summarization](#tab/document-summarization)

This documentation contains the following article types:

* **[Quickstarts](quickstart.md?pivots=rest-api&tabs=document-summarization)** are getting-started instructions to guide you through making requests to the service.
* **[How-to guides](how-to/document-summarization.md)** contain instructions for using the service in more specific or customized ways.

Document summarization uses natural language processing techniques to generate a summary for documents. There are two general approaches to automatic summarization, both of which are supported by the API: extractive and abstractive. 

Extractive summarization extracts sentences that collectively represent the most important or relevant information within the original content. Abstractive summarization generates a summary with concise, coherent sentences or words which are not simply extract sentences from the original document. These features are designed to shorten content that could be considered too long to read.

## Key features

There are two types of document summarization this API provides:

* **Extractive summarization**: Produces a summary by extracting salient sentences within the document.
    * Multiple extracted sentences: These sentences collectively convey the main idea of the document. They’re original sentences extracted from the input document’s content.
    * Rank score: The rank score indicates how relevant a sentence is to a document's main topic. Document summarization ranks extracted sentences, and you can determine whether they're returned in the order they appear, or according to their rank.
    * Multiple returned sentences: Determine the maximum number of sentences to be returned. For example, if you request a three-sentence summary extractive summarization will return the three highest scored sentences.
    * Positional information: The start position and length of extracted sentences.
* **Abstractive summarization**: Generates a summary that may not use the same words as those in the document, but captures the main idea.
    * Summary texts: Abstractive summarization returns a summary for each contextual input range within the document. A long document may be segmented so multiple groups of summary texts may be returned with their contextual input range. 
    * Contextual input range: The range within the input document that was used to generate the summary text.

As an example, consider the following paragraph of text:

*"At Microsoft, we have been on a quest to advance AI beyond existing techniques, by taking a more holistic, human-centric approach to learning and understanding. As Chief Technology Officer of Azure AI services, I have been working with a team of amazing scientists and engineers to turn this quest into a reality. In my role, I enjoy a unique perspective in viewing the relationship among three attributes of human cognition: monolingual text (X), audio or visual sensory signals, (Y) and multilingual (Z). At the intersection of all three, there’s magic—what we call XYZ-code as illustrated in Figure 1—a joint representation to create more powerful AI that can speak, hear, see, and understand humans better. We believe XYZ-code will enable us to fulfill our long-term vision: cross-domain transfer learning, spanning modalities and languages. The goal is to have pre-trained models that can jointly learn representations to support a broad range of downstream AI tasks, much in the way humans do today. Over the past five years, we have achieved human performance on benchmarks in conversational speech recognition, machine translation, conversational question answering, machine reading comprehension, and image captioning. These five breakthroughs provided us with strong signals toward our more ambitious aspiration to produce a leap in AI capabilities, achieving multi-sensory and multilingual learning that is closer in line with how humans learn and understand. I believe the joint XYZ-code is a foundational component of this aspiration, if grounded with external knowledge sources in the downstream AI tasks."*

The document summarization API request is processed upon receipt of the request by creating a job for the API backend. If the job succeeded, the output of the API will be returned. The output will be available for retrieval for 24 hours. After this time, the output is purged. Due to multilingual and emoji support, the response may contain text offsets. See [how to process offsets](../concepts/multilingual-emoji-support.md) for more information.

Using the above example, the API might return the following summarized sentences:

**Extractive summarization**:
- "At Microsoft, we have been on a quest to advance AI beyond existing techniques, by taking a more holistic, human-centric approach to learning and understanding."
- "We believe XYZ-code will enable us to fulfill our long-term vision: cross-domain transfer learning, spanning modalities and languages."
- "The goal is to have pre-trained models that can jointly learn representations to support a broad range of downstream AI tasks, much in the way humans do today."

**Abstractive summarization**:
- "Microsoft is taking a more holistic, human-centric approach to learning and understanding. We believe XYZ-code will enable us to fulfill our long-term vision: cross-domain transfer learning, spanning modalities and languages. Over the past five years, we have achieved human performance on benchmarks in."

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

## When to use issue and resolution summarization

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

[!INCLUDE [development options](./includes/development-options.md)]


## Input requirements and service limits

# [Document summarization](#tab/document-summarization)

* Summarization takes raw unstructured text for analysis. See [Data and service limits](../concepts/data-limits.md) in the how-to guide for more information.
* Summarization works with a variety of written languages. See [language support](language-support.md?tabs=document-summarization) for more information.

# [Conversation summarization](#tab/conversation-summarization)

* Conversation summarization takes structured text for analysis. See the [data and service limits](../concepts/data-limits.md) for more information.
* Conversation summarization accepts text in English. See [language support](language-support.md?tabs=conversation-summarization) for more information.

---

## Reference documentation and code samples

As you use document summarization in your applications, see the following reference documentation and samples for Azure AI Language:

|Development option / language  |Reference documentation |Samples  |
|---------|---------|---------|
|REST API     | [REST API documentation](https://go.microsoft.com/fwlink/?linkid=2211684)        |         |
|C#     | [C# documentation](/dotnet/api/azure.ai.textanalytics?view=azure-dotnet-preview&preserve-view=true)        | [C# samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics/samples)        |
| Java     | [Java documentation](/java/api/overview/azure/ai-textanalytics-readme?view=azure-java-preview&preserve-view=true)        | [Java Samples](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/textanalytics/azure-ai-textanalytics/src/samples) |
|JavaScript     | [JavaScript documentation](/javascript/api/overview/azure/ai-text-analytics-readme?view=azure-node-preview&preserve-view=true)        | [JavaScript samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/textanalytics/ai-text-analytics/samples/v5) |
|Python | [Python documentation](/python/api/overview/azure/ai-textanalytics-readme?view=azure-python-preview&preserve-view=true)        | [Python samples](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/textanalytics/azure-ai-textanalytics/samples) |

## Responsible AI

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it’s deployed. Read the [transparency note for summarization](/legal/cognitive-services/language-service/transparency-note-extractive-summarization?context=/azure/ai-services/language-service/context/context) to learn about responsible AI use and deployment in your systems. You can also see the following articles for more information:

* [Transparency note for Azure AI Language](/legal/cognitive-services/language-service/transparency-note?context=/azure/ai-services/language-service/context/context)
* [Integration and responsible use](/legal/cognitive-services/language-service/guidance-integration-responsible-use-summarization?context=/azure/ai-services/language-service/context/context)
* [Characteristics and limitations of summarization](/legal/cognitive-services/language-service/characteristics-and-limitations-summarization?context=/azure/ai-services/language-service/context/context)
* [Data, privacy, and security](/legal/cognitive-services/language-service/data-privacy?context=/azure/ai-services/language-service/context/context)
