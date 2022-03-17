---
title: Summarize text with the extractive summarization API
titleSuffix: Azure Cognitive Services
description: This article will show you how to summarize text with the extractive summarization API.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 03/16/2022
ms.author: aahi
ms.custom: language-service-summarization, ignite-fall-2021
---

# How to use text summarization (preview)

> [!IMPORTANT] 
> The extractive summarization feature is a preview capability provided “AS IS” and “WITH ALL FAULTS.” As such, Extractive Summarization (preview) should not be implemented or deployed in any production use. The customer is solely responsible for any use of extractive summarization. 

In general, there are two approaches for automatic text summarization: extractive and abstractive. This API provides extractive summarization.

Extractive summarization is a feature that produces a summary by extracting sentences that collectively represent the most important or relevant information within the original content.

This feature is designed to shorten content that users consider too long to read. Extractive summarization condenses articles, papers, or documents to key sentences.

The AI models used by the API are provided by the service, you just have to send content for analysis.

## Features

> [!TIP]
> If you want to start using this feature, you can follow the [quickstart article](../quickstart.md) to get started. You can also make example requests using [Language Studio](../../language-studio.md) without needing to write code.

The extractive summarization API uses natural language processing techniques to locate key sentences in an unstructured text document. These sentences collectively convey the main idea of the document.

Extractive summarization returns a rank score as a part of the system response along with extracted sentences and their position in the original documents. A rank score is an indicator of how relevant a sentence is determined to be, to the main idea of a document. The model gives a score between 0 and 1 (inclusive) to each sentence and returns the highest scored sentences per request. For example, if you request a three-sentence summary, the service returns the three highest scored sentences.

There is another feature in Azure Cognitive Service for Language, [key phrases extraction](./../../key-phrase-extraction/how-to/call-api.md), that can extract key information. When deciding between key phrase extraction and extractive summarization, consider the following:
* key phrase extraction returns phrases while extractive summarization returns sentences
* extractive summarization returns sentences together with a rank score, and. Top ranked sentences will be returned per request
* extractive summarization also returns the following positional information:
    * offset: The start position of each extracted sentence, and
    * Length: is the length of each extracted sentence.


## Determine how to process the data (optional)

### Specify the text summarization model

By default, text summarization will use the latest available AI model on your text. You can also configure your API requests to use a specific [model version](../../concepts/model-lifecycle.md).

### Input languages

When you submit documents to be processed by key phrase extraction, you can specify which of [the supported languages](../language-support.md) they're written in. if you don't specify a language, key phrase extraction will default to English. The API may return offsets in the response to support different [multilingual and emoji encodings](../../concepts/multilingual-emoji-support.md). 

## Submitting data

You submit documents to the API as strings of text. Analysis is performed upon receipt of the request. Because the API is [asynchronous](../../concepts/use-asynchronously.md), there may be a delay between sending an API request, and receiving the results.

When using this feature, the API results are available for 24 hours from the time the request was ingested, and is indicated in the response. After this time period, the results are purged and are no longer available for retrieval.

You can use the `sentenceCount` parameter to specify how many sentences will be returned, with `3` being the default. The range is from 1 to 20.

You can also use the `sortby` parameter to specify in what order the extracted sentences will be returned - either `Offset` or `Rank`, with `Offset` being the default. 


|parameter value  |Description  |
|---------|---------|
|Rank    | Order sentences according to their relevance to the input document, as decided by the service.        |
|Offset    | Keeps the original order in which the sentences appear in the input document.        |

## Getting text summarization results

When you get results from language detection, you can stream the results to an application or save the output to a file on the local system.

The following is an example of content you might submit for summarization, which is extracted using the Microsoft blog article [A holistic representation toward integrative AI](https://www.microsoft.com/research/blog/a-holistic-representation-toward-integrative-ai/). This article is only an example, the API can accept much longer input text. See the data limits section for more information.
 
*"At Microsoft, we have been on a quest to advance AI beyond existing techniques, by taking a more holistic, human-centric approach to learning and understanding. As Chief Technology Officer of Azure AI Cognitive Services, I have been working with a team of amazing scientists and engineers to turn this quest into a reality. In my role, I enjoy a unique perspective in viewing the relationship among three attributes of human cognition: monolingual text (X), audio or visual sensory signals, (Y) and multilingual (Z). At the intersection of all three, there’s magic—what we call XYZ-code as illustrated in Figure 1—a joint representation to create more powerful AI that can speak, hear, see, and understand humans better. We believe XYZ-code will enable us to fulfill our long-term vision: cross-domain transfer learning, spanning modalities and languages. The goal is to have pretrained models that can jointly learn representations to support a broad range of downstream AI tasks, much in the way humans do today. Over the past five years, we have achieved human performance on benchmarks in conversational speech recognition, machine translation, conversational question answering, machine reading comprehension, and image captioning. These five breakthroughs provided us with strong signals toward our more ambitious aspiration to produce a leap in AI capabilities, achieving multisensory and multilingual learning that is closer in line with how humans learn and understand. I believe the joint XYZ-code is a foundational component of this aspiration, if grounded with external knowledge sources in the downstream AI tasks."*

The extractive summarization API is performed upon receipt of the request by creating a job for the API backend. If the job succeeded, the output of the API will be returned. The output will be available for retrieval for 24 hours. After this time, the output is purged. Due to multilingual and emoji support, the response may contain text offsets. See [how to process offsets](../../concepts/multilingual-emoji-support.md) for more information.

Using the above example, the API might return the following summarized sentences:

*"At Microsoft, we have been on a quest to advance AI beyond existing techniques, by taking a more holistic, human-centric approach to learning and understanding."*

*"In my role, I enjoy a unique perspective in viewing the relationship among three attributes of human cognition: monolingual text (X), audio or visual sensory signals, (Y) and multilingual (Z)."*

*"At the intersection of all three, there’s magic—what we call XYZ-code as illustrated in Figure 1—a joint representation to create more powerful AI that can speak, hear, see, and understand humans better."*

## Service and data limits

[!INCLUDE [service limits article](../../includes/service-limits-link.md)]

## See also

* [Text Summarization overview](../overview.md)
