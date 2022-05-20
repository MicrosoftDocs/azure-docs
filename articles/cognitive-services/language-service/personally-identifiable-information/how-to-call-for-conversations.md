---
title: How to detect Personally Identifiable Information (PII) in conversations.
titleSuffix: Azure Cognitive Services
description: This article will show you how to extract PII from chat and spoken transcripts and redact identifiable information.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 05/10/2022
ms.author: aahi
ms.reviewer: bidishac
---


# How to detect and redact Personally Identifying Information (PII) in conversations

The Conversational PII feature can evaluate conversations to extract sensitive information (PII) in the content across several pre-defined categories and redact them. This API operates on both transcribed text (referenced as transcripts) and chats.
For transcripts, the API also enables redaction of audio segments, which contains the PII information by providing the audio timing information for those audio segments.

## Determine how to process the data (optional)

### Specify the PII detection model

By default, this feature will use the latest available AI model on your input. You can also configure your API requests to use a specific [model version](../concepts/model-lifecycle.md).

### Input languages

Currently the conversational PII preview API only supports English language and is available in the following three regions East US, North Europe and UK south.

## Submitting data

You can submit the input to the API as list of conversation items. Analysis is performed upon receipt of the request. Because the API is asynchronous, there may be a delay between sending an API request, and receiving the results. For information on the size and number of requests you can send per minute and second, see the data limits below.

When using the async feature, the API results are available for 24 hours from the time the request was ingested, and is indicated in the response. After this time period, the results are purged and are no longer available for retrieval.

When you submit data to conversational PII, we can send one conversation (chat or spoken) per request.

The API will attempt to detect all the [defined entity categories](concepts/conversations-entity-categories.md) for a given conversation input. If you want to specify which entities will be detected and returned, use the optional `piiCategories` parameter with the appropriate entity categories.

For spoken transcripts, the entities detected will be returned on the `redactionSource` parameter value provided. Currently, the supported values for `redactionSource` are `text`, `lexical`, `itn`, and `maskedItn` (which maps to Microsoft Speech to Text API's `display`\\`displayText`, `lexical`, `itn` and `maskedItn` format respectively). Additionally, for the spoken transcript input, this API will also provide audio timing information to empower audio redaction. For using the audioRedaction feature, use the optional `includeAudioRedaction` flag with `true` value. The audio redaction is performed based on the lexical input format.


## Getting PII results

When you get results from PII detection, you can stream the results to an application or save the output to a file on the local system. The API response will include [recognized entities](concepts/conversations-entity-categories.md), including their categories and subcategories, and confidence scores. The text string with the PII entities redacted will also be returned.

## Examples

# [Client libraries (Azure SDK)](#tab/client-libraries)

1. Go to your resource overview page in the [Azure portal](https://portal.azure.com/#home)

2. From the menu on the left side, select **Keys and Endpoint**. You will need one of the keys and the endpoint to authenticate your API requests.

3. Download and install the client library package for your language of choice:
    
    |Language  |Package version  |
    |---------|---------|
    |.NET     | [5.2.0-beta.2](https://www.nuget.org/packages/Azure.AI.TextAnalytics/5.2.0-beta.2)        |
    |Java     | [5.2.0-beta.2](https://mvnrepository.com/artifact/com.azure/azure-ai-textanalytics/5.2.0-beta.2)        |
    |JavaScript     |  [5.2.0-beta.2](https://www.npmjs.com/package/@azure/ai-text-analytics/v/5.2.0-beta.2)       |
    |Python     | [5.2.0b2](https://pypi.org/project/azure-ai-textanalytics/5.2.0b2/)         |
    
4. After you've installed the client library, use the following samples on GitHub to start calling the API.
    
    * [C#](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/textanalytics/Azure.AI.TextAnalytics/samples/Sample9_RecognizeCustomEntities.md)
    * [Java](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/textanalytics/azure-ai-textanalytics/src/samples/java/com/azure/ai/textanalytics/lro/RecognizeCustomEntities.java)
    * [JavaScript](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/textanalytics/ai-text-analytics/samples/v5/javascript/customText.js)
    * [Python](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/textanalytics/azure-ai-textanalytics/samples/sample_recognize_custom_entities.py)
    
5. See the following reference documentation for more information on the client, and return object:
    
    * [C#](/dotnet/api/azure.ai.textanalytics?view=azure-dotnet-preview&preserve-view=true)
    * [Java](/java/api/overview/azure/ai-textanalytics-readme?view=azure-java-preview&preserve-view=true)
    * [JavaScript](/javascript/api/overview/azure/ai-text-analytics-readme?view=azure-node-preview&preserve-view=true)
    * [Python](/python/api/azure-ai-textanalytics/azure.ai.textanalytics?view=azure-python-preview&preserve-view=true)
    
# [REST API](#tab/rest-api)


```bash
curl -i -X POST https://your-language-endpoint-here/language/analyze-conversations?api-version=2022-05-15-preview \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: your-key-here" \
-d \
' 
{
    "displayName": "Analyze conversations from example",
    "analysisInput": {
        "conversations": [
            {
                "id": "23611680-c4eb-4705-adef-4aa1c17507b5",
                "language": "en",
                "modality": "text",
                "conversationItems": [
                    {
                        "participantId": "customer_1",
                        "id": "a064adff-01a0-4ea0-bab1-36d7e7dd9afb",
                        "text": "Hi."
                    },
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
                    },
                    {
                        "participantId": "agent_1",
                        "id": "677103a7-5474-47c9-819d-2b985099a3a7",
                        "text": "Hi John, how can I help you today?"
                    },
                    {
                        "participantId": "customer_1",
                        "id": "700a6d34-829a-40fe-a440-24591789e0f2",
                        "text": "I would like to update my email address."
                    },
                    {
                        "participantId": "agent_1",
                        "id": "a04ac2fd-2efb-45a5-96bd-7e324056678b",
                        "text": "Sure."
                    },
                    {
                        "participantId": "agent_1",
                        "id": "522fd785-02f6-49bf-a825-1bb175b4d7b6",
                        "text": "What is your email address?"
                    },
                    {
                        "participantId": "customer_1",
                        "id": "26104a65-b591-48db-bc27-43535e9de7f5",
                        "text": "My email address is john.doe@email.com."
                    },
                    {
                        "participantId": "agent_1",
                        "id": "9bb403b9-d2b6-44e3-ab65-354d6ad304f3",
                        "text": "Sure, anything else?"
                    },
                    {
                        "participantId": "customer_1",
                        "id": "fc615891-990f-4e35-8ece-cfcc5f8a01bd",
                        "text": "No."
                    },
                    {
                        "participantId": "agent_1",
                        "id": "33981e22-9333-40ef-8aec-d05209f49cdc",
                        "text": "Thank you for your call."
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
'
```

Get the `operation-location` from the response header. The value will look similar to the following URL:

```http
https://your-language-endpoint/language/analyze-conversations/jobs/12345678-1234-1234-1234-12345678
```

To get the results of the request, use the following cURL command. Be sure to replace `my-job-id` with the numerical ID value you received from the previous `operation-location` response header:

```bash
curl -X GET    https://your-language-endpoint/language/analyze-conversations/jobs/my-job-id \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: your-key-here"
```


### JSON response

```json
curl -i -X POST https://your-language-endpoint-here/language/analyze-conversations/jobs/my-job-id \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: your-key-here" \
-d \
' 
{
    "displayName": "Analyze conversations from example",
    "analysisInput": {
        "conversations": [
            {
                "id": "12345678-a1b2-4705-adef-4aa1c17507b5",
                "language": "en",
                "modality": "transcript",
                "conversationItems": [
                    {
                        "participantId": "customer_1",
                        "id": "a064adff-01a0-4ea0-bab1-36d7e7dd9afb",
                        "text": "Hi.",
                        "lexical": "hi",
                        "itn": "hi",
                        "maskedItn": "hi",
                        "audioTimings": [
                            {
                                "word": "hi",
                                "offset": 14800000,
                                "duration": 5700000
                            }
                        ]
                    },
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
                    },
                    {
                        "participantId": "agent_1",
                        "id": "677103a7-5474-47c9-819d-2b985099a3a7",
                        "text": "Hi John, how can I help you today?",
                        "lexical": "hi john how can i help you today",
                        "itn": "hi john how can i help you today",
                        "maskedItn": "hi john how can i help you today",
                        "audioTimings": [
                            {
                                "word": "hi",
                                "offset": 5600000,
                                "duration": 1300000
                            },
                            {
                                "word": "john",
                                "offset": 7000000,
                                "duration": 4300000
                            },
                            {
                                "word": "how",
                                "offset": 11800000,
                                "duration": 2100000
                            },
                            {
                                "word": "can",
                                "offset": 14000000,
                                "duration": 1100000
                            },
                            {
                                "word": "i",
                                "offset": 15200000,
                                "duration": 700000
                            },
                            {
                                "word": "help",
                                "offset": 16000000,
                                "duration": 1900000
                            },
                            {
                                "word": "you",
                                "offset": 18000000,
                                "duration": 1100000
                            },
                            {
                                "word": "today",
                                "offset": 19200000,
                                "duration": 2800000
                            }
                        ]
                    },
                    {
                        "participantId": "customer_1",
                        "id": "700a6d34-829a-40fe-a440-24591789e0f2",
                        "text": "I would like to update my email address.",
                        "lexical": "i would like to update my email address",
                        "itn": "i would like to update my email address",
                        "maskedItn": "i would like to update my email address",
                        "audioTimings": [
                            {
                                "word": "i",
                                "offset": 7500000,
                                "duration": 900000
                            },
                            {
                                "word": "would",
                                "offset": 8500000,
                                "duration": 2000000
                            },
                            {
                                "word": "like",
                                "offset": 10600000,
                                "duration": 1600000
                            },
                            {
                                "word": "to",
                                "offset": 12300000,
                                "duration": 900000
                            },
                            {
                                "word": "update",
                                "offset": 13300000,
                                "duration": 3500000
                            },
                            {
                                "word": "my",
                                "offset": 16900000,
                                "duration": 2100000
                            },
                            {
                                "word": "email",
                                "offset": 19100000,
                                "duration": 3100000
                            },
                            {
                                "word": "address",
                                "offset": 22300000,
                                "duration": 4100000
                            }
                        ]
                    },
                    {
                        "participantId": "agent_1",
                        "id": "a04ac2fd-2efb-45a5-96bd-7e324056678b",
                        "text": "Sure.",
                        "lexical": "sure",
                        "itn": "sure",
                        "maskedItn": "sure",
                        "audioTimings": [
                            {
                                "word": "sure",
                                "offset": 8800000,
                                "duration": 4400000
                            }
                        ]
                    },
                    {
                        "participantId": "agent_1",
                        "id": "522fd785-02f6-49bf-a825-1bb175b4d7b6",
                        "text": "What's your email address?",
                        "lexical": "what's your email address",
                        "itn": "what's your email address",
                        "maskedItn": "what's your email address",
                        "audioTimings": [
                            {
                                "word": "what's",
                                "offset": 5000000,
                                "duration": 2000000
                            },
                            {
                                "word": "your",
                                "offset": 7100000,
                                "duration": 1500000
                            },
                            {
                                "word": "email",
                                "offset": 8700000,
                                "duration": 2300000
                            },
                            {
                                "word": "address",
                                "offset": 11100000,
                                "duration": 3700000
                            }
                        ]
                    },
                    {
                        "participantId": "customer_1",
                        "id": "26104a65-b591-48db-bc27-43535e9de7f5",
                        "text": "My email address is john.doe@email.com.",
                        "lexical": "my email address is john doe at email dot com",
                        "itn": "my email address is john.doe@email.com",
                        "maskedItn": "my email address is john.doe@email.com",
                        "audioTimings": [
                            {
                                "word": "my",
                                "offset": 30300000,
                                "duration": 3000000
                            },
                            {
                                "word": "email",
                                "offset": 33400000,
                                "duration": 3000000
                            },
                            {
                                "word": "address",
                                "offset": 36500000,
                                "duration": 3700000
                            },
                            {
                                "word": "is",
                                "offset": 40300000,
                                "duration": 2700000
                            },
                            {
                                "word": "john",
                                "offset": 43100000,
                                "duration": 3900000
                            },
                            {
                                "word": "doe",
                                "offset": 47100000,
                                "duration": 5300000
                            },
                            {
                                "word": "at",
                                "offset": 52500000,
                                "duration": 4900000
                            },
                            {
                                "word": "email",
                                "offset": 59500000,
                                "duration": 7100000
                            },
                            {
                                "word": "dot",
                                "offset": 67300000,
                                "duration": 3300000
                            },
                            {
                                "word": "com",
                                "offset": 70700000,
                                "duration": 2900000
                            }
                        ]
                    },
                    {
                        "participantId": "agent_1",
                        "id": "9bb403b9-d2b6-44e3-ab65-354d6ad304f3",
                        "text": "Sure, anything else?",
                        "lexical": "sure anything else",
                        "itn": "sure anything else",
                        "maskedItn": "sure anything else",
                        "audioTimings": [
                            {
                                "word": "sure",
                                "offset": 20100000,
                                "duration": 6500000
                            },
                            {
                                "word": "anything",
                                "offset": 28700000,
                                "duration": 4900000
                            },
                            {
                                "word": "else",
                                "offset": 33700000,
                                "duration": 3800000
                            }
                        ]
                    },
                    {
                        "participantId": "customer_1",
                        "id": "fc615891-990f-4e35-8ece-cfcc5f8a01bd",
                        "text": "No.",
                        "lexical": "no",
                        "itn": "no",
                        "maskedItn": "no",
                        "audioTimings": [
                            {
                                "word": "no",
                                "offset": 12500000,
                                "duration": 3600000
                            }
                        ]
                    },
                    {
                        "participantId": "agent_1",
                        "id": "33981e22-9333-40ef-8aec-d05209f49cdc",
                        "text": "Thank you for your call.",
                        "lexical": "thank you for your call",
                        "itn": "thank you for your call",
                        "maskedItn": "thank you for your call",
                        "audioTimings": [
                            {
                                "word": "thank",
                                "offset": 14500000,
                                "duration": 2600000
                            },
                            {
                                "word": "you",
                                "offset": 17200000,
                                "duration": 1200000
                            },
                            {
                                "word": "for",
                                "offset": 18500000,
                                "duration": 1100000
                            },
                            {
                                "word": "your",
                                "offset": 19700000,
                                "duration": 1700000
                            },
                            {
                                "word": "call",
                                "offset": 21500000,
                                "duration": 2300000
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

```

---

## Service and data limits

[!INCLUDE [service limits article](../includes/service-limits-link.md)]

