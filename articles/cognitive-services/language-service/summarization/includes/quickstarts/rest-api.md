---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 05/11/2022
ms.author: aahi
ms.custom: ignite-fall-2021, event-tier1-build-2022
---

## Prerequisites

* The current version of [cURL](https://curl.haxx.se/).
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">create a Language resource </a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Example request

> [!NOTE]
> * The following BASH examples use the `\` line continuation character. If your console or terminal uses a different line continuation character, use that character.
> * You can find language specific samples on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code).
> * Go to the Azure portal and find the key and endpoint for the Language resource you created in the prerequisites. They will be located on the resource's **key and endpoint** page, under **resource management**. Then replace the strings in the code below with your key and endpoint.
To call the API, you need the following information:

Choose the type of summarization you would like to perform, and select one of the tabs below to see an example API call:

|Feature  |Description  |
|---------|---------|
|Document summarization     | Use extractive text summarization to produce a summary of important or relevant information within a document.        |
|Conversation summarization     | Use abstractive text summarization to produce a summary of issues and resolutions in transcripts between customer-service agents, and customers.         |

# [Document summarization](#tab/document-summarization)

[Reference documentation](https://westus2.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1/)

|parameter  |Description  |
|---------|---------|
|`-X POST <endpoint>`     | Specifies your endpoint for accessing the API.        |
|`-H Content-Type: application/json`     | The content type for sending JSON data.          |
|`-H "Ocp-Apim-Subscription-Key:<key>`    | Specifies the key for accessing the API.        |
|`-d <documents>`     | The JSON containing the documents you want to send.         |

The following cURL commands are executed from a BASH shell. Edit these commands with your own resource name, resource key, and JSON values.


## Document summarization

[!INCLUDE [REST API quickstart instructions](../../../includes/rest-api-instructions.md)]

```bash
curl -i -X POST https://your-text-analytics-endpoint-here/text/analytics/v3.2-preview.1/analyze \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: your-key-here" \
-d \
' 
{
  "analysisInput": {
    "documents": [
      {
        "language": "en",
        "id": "1",
        "text": "At Microsoft, we have been on a quest to advance AI beyond existing techniques, by taking a more holistic, human-centric approach to learning and understanding. As Chief Technology Officer of Azure AI Cognitive Services, I have been working with a team of amazing scientists and engineers to turn this quest into a reality. In my role, I enjoy a unique perspective in viewing the relationship among three attributes of human cognition: monolingual text (X), audio or visual sensory signals, (Y) and multilingual (Z). At the intersection of all three, there’s magic—what we call XYZ-code as illustrated in Figure 1—a joint representation to create more powerful AI that can speak, hear, see, and understand humans better. We believe XYZ-code will enable us to fulfill our long-term vision: cross-domain transfer learning, spanning modalities and languages. The goal is to have pre-trained models that can jointly learn representations to support a broad range of downstream AI tasks, much in the way humans do today. Over the past five years, we have achieved human performance on benchmarks in conversational speech recognition, machine translation, conversational question answering, machine reading comprehension, and image captioning. These five breakthroughs provided us with strong signals toward our more ambitious aspiration to produce a leap in AI capabilities, achieving multi-sensory and multilingual learning that is closer in line with how humans learn and understand. I believe the joint XYZ-code is a foundational component of this aspiration, if grounded with external knowledge sources in the downstream AI tasks."
      }
    ]
  },
  "tasks": {
    "extractiveSummarizationTasks": [
      {
        "parameters": {
          "model-version": "latest",
          "sentenceCount": 3,
          "sortBy": "Offset"
        }
      }
    ]
  }
}
'
```

Get the `operation-location` from the response header. The value will look similar to the following URL:

```http
https://your-resource.cognitiveservices.azure.com/text/analytics/v3.2-preview.1/analyze/jobs/12345678-1234-1234-1234-12345678
```

To get the results of the request, use the following cURL command. Be sure to replace `my-job-id` with the numerical ID value you received from the previous `operation-location` response header:

```bash
curl -X GET    https://your-text-analytics-endpoint-here/text/analytics/v3.2-preview.1/analyze/jobs/my-job-id \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: your-key-here"
```


### JSON response

```json
{
   "jobId":"da3a2f68-eb90-4410-b28b-76960d010ec6",
   "lastUpdateDateTime":"2021-08-24T19:15:47Z",
   "createdDateTime":"2021-08-24T19:15:28Z",
   "expirationDateTime":"2021-08-25T19:15:28Z",
   "status":"succeeded",
   "errors":[
      
   ],
   "displayName":"NA",
   "tasks":{
      "completed":1,
      "failed":0,
      "inProgress":0,
      "total":1,
      "extractiveSummarizationTasks":[
         {
            "lastUpdateDateTime":"2021-08-24T19:15:48.0011189Z",
            "taskName":"ExtractiveSummarization_latest",
            "state":"succeeded",
            "results":{
               "documents":[
                  {
                     "id":"1",
                     "sentences":[
                        {
                           "text":"At Microsoft, we have been on a quest to advance AI beyond existing techniques, by taking a more holistic, human-centric approach to learning and understanding.",
                           "rankScore":1.0,
                           "offset":0,
                           "length":160
                        },
                        {
                           "text":"In my role, I enjoy a unique perspective in viewing the relationship among three attributes of human cognition: monolingual text (X), audio or visual sensory signals, (Y) and multilingual (Z).",
                           "rankScore":0.9582327572675664,
                           "offset":324,
                           "length":192
                        },
                        {
                           "text":"At the intersection of all three, there’s magic—what we call XYZ-code as illustrated in Figure 1—a joint representation to create more powerful AI that can speak, hear, see, and understand humans better.",
                           "rankScore":0.9294747193132348,
                           "offset":517,
                           "length":203
                        }
                     ],
                     "warnings":[
                        
                     ]
                  }
               ],
               "errors":[
                  
               ],
               "modelVersion":"2021-08-01"
            }
         }
      ]
   }
}
```

# [Conversation summarization](#tab/conversation-summarization)

[Reference documentation](https://go.microsoft.com/fwlink/?linkid=2195178)

|parameter  |Description  |
|---------|---------|
|`-X POST <endpoint>`     | Specifies your endpoint for accessing the API.        |
|`-H Content-Type: application/json`     | The content type for sending JSON data.          |
|`-H "Ocp-Apim-Subscription-Key:<key>`    | Specifies the key for accessing the API.        |
|`-d <documents>`     | The JSON containing the documents you want to send.         |

The following cURL commands are executed from a BASH shell. Edit these commands with your own resource name, resource key, and JSON values.

## Conversation summarization

[!INCLUDE [REST API quickstart instructions](../../../includes/rest-api-instructions.md)]

```bash
curl -i -X POST https://your-language-endpoint-here/language/analyze-conversations?api-version=2022-05-15-preview \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: your-key-here" \
-d \
' 
{
    "displayName": "Analyze conversations from 123",
    "analysisInput": {
        "conversations": [
            {
                "modality": "text",
                "id": "conversation1",
                "language": "en",
                "conversationItems": [
                    {
                        "text": "Hello, you’re chatting with Rene. How may I help you?",
                        "id": "1",
                        "role": "Agent",
                        "participantId": "Agent_1"
                    },
                    {
                        "text": "Hi, I tried to set up wifi connection for Smart Brew 300 espresso machine, but it didn’t work.",
                        "id": "2",
                        "role": "Customer",
                        "participantId": "Customer_1"
                    },
                    {
                        "text": "I’m sorry to hear that. Let’s see what we can do to fix this issue. Could you please try the following steps for me? First, could you push the wifi connection button, hold for 3 seconds, then let me know if the power light is slowly blinking on and off every second?",
                        "id": "3",
                        "role": "Agent",
                        "participantId": "Agent_1"
                    },
                    {
                        "text": "Yes, I pushed the wifi connection button, and now the power light is slowly blinking.",
                        "id": "4",
                        "role": "Customer",
                        "participantId": "Customer_1"
                    },
                    {
                        "text": "Great. Thank you! Now, please check in your Contoso Coffee app. Does it prompt to ask you to connect with the machine?",
                        "id": "5",
                        "role": "Agent",
                        "participantId": "Agent_1"
                    },
                    {
                        "text": "No. Nothing happened.",
                        "id": "6",
                        "role": "Customer",
                        "participantId": "Customer_1"
                    },
                    {
                        "text": "I’m very sorry to hear that. Let me see if there’s another way to fix the issue. Please hold on for a minute.",
                        "id": "7",
                        "role": "Agent",
                        "participantId": "Agent_1"
                    }
                ]
            }
        ]
    },
    "tasks": [
        {
            "taskName": "analyze 1",
            "kind": "ConversationalSummarizationTask",
            "parameters": {
                "modelVersion": "2022-05-15-preview",
                "summaryAspects": [
                    "Issue",
                    "Resolution"
                ]
            }
        }
    ]
}
'
```

Get the `operation-location` from the response header. The value will look similar to the following URL:

```http
https://your-language-endpoint-here/language/analyze-conversations/jobs/12345678-1234-1234-1234-12345678
```

To get the results of the request, use the following cURL command. Be sure to replace `my-job-id` with the numerical ID value you received from the previous `operation-location` response header:

```bash
curl -X GET    https://your-language-endpoint-here/language/analyze-conversations/jobs/my-job-id \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: your-key-here"
```


### JSON response

```json
{
    "jobId": "28261846-59bc-435a-a73a-f47c2feb245e",
    "lastUpdatedDateTime": "2022-05-11T23:16:48Z",
    "createdDateTime": "2022-05-11T23:16:44Z",
    "expirationDateTime": "2022-05-12T23:16:44Z",
    "status": "succeeded",
    "errors": [],
    "displayName": "Analyze conversations from 123",
    "tasks": {
        "completed": 1,
        "failed": 0,
        "inProgress": 0,
        "total": 1,
        "items": [
            {
                "kind": "conversationalSummarizationResults",
                "taskName": "analyze 1",
                "lastUpdateDateTime": "2022-05-11T23:16:48.9553011Z",
                "status": "succeeded",
                "results": {
                    "conversations": [
                        {
                            "id": "conversation1",
                            "summaries": [
                                {
                                    "aspect": "issue",
                                    "text": "Customer tried to set up wifi connection for Smart Brew 300 medication machine, but it didn't work"
                                },
                                {
                                    "aspect": "resolution",
                                    "text": "Asked customer to try the following steps | Asked customer for the power light | Helped customer to connect to the machine"
                                }
                            ],
                            "warnings": []
                        }
                    ],
                    "errors": [],
                    "modelVersion": "2022-05-15-preview"
                }
            }
        ]
    }
}
```

---
