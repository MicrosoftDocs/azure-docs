---
title: How to detect Personally Identifiable Information (PII) in conversations.
titleSuffix: Azure AI services
description: This article will show you how to extract PII from chat and spoken transcripts and redact identifiable information.
#services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: how-to
ms.date: 01/31/2023
ms.author: jboback
ms.reviewer: bidishac
---


# How to detect and redact Personally Identifying Information (PII) in conversations

The Conversational PII feature can evaluate conversations to extract sensitive information (PII) in the content across several pre-defined categories and redact them. This API operates on both transcribed text (referenced as transcripts) and chats.
For transcripts, the API also enables redaction of audio segments, which contains the PII information by providing the audio timing information for those audio segments.

## Determine how to process the data (optional)

### Specify the PII detection model

By default, this feature will use the latest available AI model on your input. You can also configure your API requests to use a specific [model version](../concepts/model-lifecycle.md).

### Language support

Currently the conversational PII preview API only supports English language.

### Region support

Currently the conversational PII preview API supports all Azure regions supported by the Language service.

## Submitting data

> [!NOTE]
> See the [Language Studio](../language-studio.md#valid-text-formats-for-conversation-features) article for information on formatting conversational text to submit using Language Studio. 

You can submit the input to the API as list of conversation items. Analysis is performed upon receipt of the request. Because the API is asynchronous, there may be a delay between sending an API request, and receiving the results. For information on the size and number of requests you can send per minute and second, see the data limits below.

When using the async feature, the API results are available for 24 hours from the time the request was ingested, and is indicated in the response. After this time period, the results are purged and are no longer available for retrieval.

When you submit data to conversational PII, you can send one conversation (chat or spoken) per request.

The API will attempt to detect all the [defined entity categories](concepts/conversations-entity-categories.md) for a given conversation input. If you want to specify which entities will be detected and returned, use the optional `piiCategories` parameter with the appropriate entity categories.

For spoken transcripts, the entities detected will be returned on the `redactionSource` parameter value provided. Currently, the supported values for `redactionSource` are `text`, `lexical`, `itn`, and `maskedItn` (which maps to Speech to text REST API's `display`\\`displayText`, `lexical`, `itn` and `maskedItn` format respectively). Additionally, for the spoken transcript input, this API will also provide audio timing information to empower audio redaction. For using the audioRedaction feature, use the optional `includeAudioRedaction` flag with `true` value. The audio redaction is performed based on the lexical input format.

> [!NOTE]
> Conversation PII now supports 40,000 characters as document size.


## Getting PII results

When you get results from PII detection, you can stream the results to an application or save the output to a file on the local system. The API response will include [recognized entities](concepts/conversations-entity-categories.md), including their categories and subcategories, and confidence scores. The text string with the PII entities redacted will also be returned.

## Examples

# [Client libraries (Azure SDK)](#tab/client-libraries)

1. Go to your resource overview page in the [Azure portal](https://portal.azure.com/#home)

2. From the menu on the left side, select **Keys and Endpoint**. You'll need one of the keys and the endpoint to authenticate your API requests.

3. Download and install the client library package for your language of choice:
    
    |Language  |Package version  |
    |---------|---------|
    |.NET     | [1.0.0](https://www.nuget.org/packages/Azure.AI.Language.Conversations/1.0.0)        |
    |Python     | [1.0.0](https://pypi.org/project/azure-ai-language-conversations/1.1.0b2)         |
    
4. See the following reference documentation for more information on the client, and return object:
    
    * [C#](/dotnet/api/azure.ai.language.conversations)
    * [Python](/python/api/azure-ai-language-conversations/azure.ai.language.conversations.aio)
    
# [REST API](#tab/rest-api)

## Submit transcripts using speech to text

Use the following example if you have conversations transcribed using the Speech service's [speech to text](../../Speech-Service/speech-to-text.md) feature:

```bash
curl -i -X POST https://your-language-endpoint-here/language/analyze-conversations/jobs?api-version=2022-05-15-preview \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: your-key-here" \
-d \
' 
{
    "displayName": "Analyze conversations from xxx",
    "analysisInput": {
        "conversations": [
            {
                "id": "23611680-c4eb-4705-adef-4aa1c17507b5",
                "language": "en",
                "modality": "transcript",
                "conversationItems": [
                    {
                        "participantId": "agent_1",
                        "id": "8074caf7-97e8-4492-ace3-d284821adacd",
                        "text": "Good morning.",
                        "lexical": "good morning",
                        "itn": "good morning",
                        "maskedItn": "good morning",
                        "audioTimings": [
                            {
                                "word": "good",
                                "offset": 11700000,
                                "duration": 2100000
                            },
                            {
                                "word": "morning",
                                "offset": 13900000,
                                "duration": 3100000
                            }
                        ]
                    },
                    {
                        "participantId": "agent_1",
                        "id": "0d67d52b-693f-4e34-9881-754a14eec887",
                        "text": "Can I have your name?",
                        "lexical": "can i have your name",
                        "itn": "can i have your name",
                        "maskedItn": "can i have your name",
                        "audioTimings": [
                            {
                                "word": "can",
                                "offset": 44200000,
                                "duration": 2200000
                            },
                            {
                                "word": "i",
                                "offset": 46500000,
                                "duration": 800000
                            },
                            {
                                "word": "have",
                                "offset": 47400000,
                                "duration": 1500000
                            },
                            {
                                "word": "your",
                                "offset": 49000000,
                                "duration": 1500000
                            },
                            {
                                "word": "name",
                                "offset": 50600000,
                                "duration": 2100000
                            }
                        ]
                    },
                    {
                        "participantId": "customer_1",
                        "id": "08684a7a-5433-4658-a3f1-c6114fcfed51",
                        "text": "Sure that is John Doe.",
                        "lexical": "sure that is john doe",
                        "itn": "sure that is john doe",
                        "maskedItn": "sure that is john doe",
                        "audioTimings": [
                            {
                                "word": "sure",
                                "offset": 5400000,
                                "duration": 6300000
                            },
                            {
                                "word": "that",
                                "offset": 13600000,
                                "duration": 2300000
                            },
                            {
                                "word": "is",
                                "offset": 16000000,
                                "duration": 1300000
                            },
                            {
                                "word": "john",
                                "offset": 17400000,
                                "duration": 2500000
                            },
                            {
                                "word": "doe",
                                "offset": 20000000,
                                "duration": 2700000
                            }
                        ]
                    }
                ]
            }
        ]
    },
    "tasks": [
        {
            "taskName": "analyze 1",
            "kind": "ConversationalPIITask",
            "parameters": {
                "modelVersion": "2022-05-15-preview",
                "redactionSource": "text",
                "includeAudioRedaction": true,
                "piiCategories": [
                    "all"
                ]
            }
        }
    ]
}
`
```

## Submit text chats

Use the following example if you have conversations that originated in text. For example, conversations through a text-based chat client.

```bash
curl -i -X POST https://your-language-endpoint-here/language/analyze-conversations/jobs?api-version=2022-05-15-preview \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: your-key-here" \
-d \
' 
{
    "displayName": "Analyze conversations from xxx",
    "analysisInput": {
        "conversations": [
            {
                "id": "23611680-c4eb-4705-adef-4aa1c17507b5",
                "language": "en",
                "modality": "text",
                "conversationItems": [
                    {
                        "participantId": "agent_1",
                        "id": "8074caf7-97e8-4492-ace3-d284821adacd",
                        "text": "Good morning."
                    },
                    {
                        "participantId": "agent_1",
                        "id": "0d67d52b-693f-4e34-9881-754a14eec887",
                        "text": "Can I have your name?"
                    },
                    {
                        "participantId": "customer_1",
                        "id": "08684a7a-5433-4658-a3f1-c6114fcfed51",
                        "text": "Sure that is John Doe."
                    }
                ]
            }
        ]
    },
    "tasks": [
        {
            "taskName": "analyze 1",
            "kind": "ConversationalPIITask",
            "parameters": {
                "modelVersion": "2022-05-15-preview"
            }
        }
    ]
}
`
```


## Get the result

Get the `operation-location` from the response header. The value will look similar to the following URL:

```rest
https://your-language-endpoint/language/analyze-conversations/jobs/12345678-1234-1234-1234-12345678
```

To get the results of the request, use the following cURL command. Be sure to replace `my-job-id` with the numerical ID value you received from the previous `operation-location` response header:

```bash
curl -X GET    https://your-language-endpoint/language/analyze-conversations/jobs/my-job-id \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: your-key-here"
```

---

## Service and data limits

[!INCLUDE [service limits article](../includes/service-limits-link.md)]

