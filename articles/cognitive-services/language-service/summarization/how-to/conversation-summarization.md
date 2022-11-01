---
title: Summarize text with the conversation summarization API
titleSuffix: Azure Cognitive Services
description: This article will show you how to summarize chat logs with the conversation summarization API.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 08/18/2022
ms.author: aahi
ms.custom: language-service-summarization, ignite-fall-2021, event-tier1-build-2022
---

# How to use conversation summarization (preview)

[!INCLUDE [availability](../includes/regional-availability.md)]

> [!IMPORTANT] 
> The conversation summarization feature is a preview capability provided “AS IS” and “WITH ALL FAULTS.” As such, Conversation Summarization (preview) should not be implemented or deployed in any production use. The customer is solely responsible for any use of conversation summarization. 

Conversation summarization is designed to summarize text chat logs between customers and customer-service agents. This feature is capable of providing both issues and resolutions present in these logs. 

The AI models used by the API are provided by the service, you just have to send content for analysis.

## Features

The conversation summarization API uses natural language processing techniques to locate key issues and resolutions in text-based chat logs. Conversation summarization will return issues and resolutions found from the text input.

There's another feature in Azure Cognitive Service for Language named [document summarization](../overview.md?tabs=document-summarization) that can summarize sentences from large documents. When you're deciding between document summarization and conversation summarization, consider the following points:
* Extractive summarization returns sentences that collectively represent the most important or relevant information within the original content.
* Conversation summarization returns summaries based on full chat logs including a reason for the chat (a problem), and the resolution. For example, a chat log between a customer and a customer service agent.

## Submitting data

You submit documents to the API as strings of text. Analysis is performed upon receipt of the request. Because the API is [asynchronous](../../concepts/use-asynchronously.md), there may be a delay between sending an API request and receiving the results.  For information on the size and number of requests you can send per minute and second, see the data limits below.

When you use this feature, the API results are available for 24 hours from the time the request was ingested, and is indicated in the response. After this time period, the results are purged and are no longer available for retrieval.

When you submit data to conversation summarization, we recommend sending one chat log per request, for better latency.

### Get summaries from text chats

You can use conversation summarization to get summaries from 2-person chats between customer service agents, and customers. To see an example using text chats, see the [quickstart article](../quickstart.md).

### Get summaries from speech transcriptions 

Conversation summarization also enables you to get summaries from speech transcripts by using the [Speech service's speech-to-text feature](../../../Speech-Service/call-center-overview.md). The following example shows a short conversation that you might include in your API requests.

```json
"conversations":[
   {
      "id":"abcdefgh-1234-1234-1234-1234abcdefgh",
      "language":"En",
      "modality":"transcript",
      "conversationItems":[
         {
            "modality":"transcript",
            "participantId":"speaker",
            "id":"12345678-abcd-efgh-1234-abcd123456",
            "content":{
               "text":"Hi.",
               "lexical":"hi",
               "itn":"hi",
               "maskedItn":"hi",
               "audioTimings":[
                  {
                     "word":"hi",
                     "offset":4500000,
                     "duration":2800000
                  }
               ]
            }
         }
      ]
   }
]
```

## Getting conversation summarization results

[!INCLUDE [availability](../includes/regional-availability.md)]

When you get results from language detection, you can stream the results to an application or save the output to a file on the local system.

The following text is an example of content you might submit for summarization. This is only an example, the API can accept much longer input text. See [data limits](../../concepts/data-limits.md) for more information.
 
**Agent**: "*Hello, how can I help you*?"

**Customer**: "*How can I upgrade my Contoso subscription? I've been trying the entire day.*"

**Agent**: "*Press the upgrade button please. Then sign in and follow the instructions.*"

Summarization is performed upon receipt of the request by creating a job for the API backend. If the job succeeded, the output of the API will be returned. The output will be available for retrieval for 24 hours. After this time, the output is purged. Due to multilingual and emoji support, the response may contain text offsets. See [how to process offsets](../../concepts/multilingual-emoji-support.md) for more information.

In the above example, the API might return the following summarized sentences:

|Summarized text  | Aspect |
|---------|----|
|  "Customer wants to upgrade their subscription. Customer doesn't know how."       | issue  |
| "Customer needs to press upgrade button, and sign in."     | resolution |


## See also

* [Summarization overview](../overview.md)