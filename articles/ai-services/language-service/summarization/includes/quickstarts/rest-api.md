---
#services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 12/13/2023
ms.author: aahi
ms.custom: ignite-fall-2021, event-tier1-build-2022, ignite-2022
---

# [Document summarization](#tab/document-summarization)

[Reference documentation](https://go.microsoft.com/fwlink/?linkid=2211684)

# [Conversation summarization](#tab/conversation-summarization)

[Reference documentation](https://go.microsoft.com/fwlink/?linkid=2195178)

---

Use this quickstart to send text summarization requests using the REST API. In the following example, you will use cURL to summarize documents or text-based customer service conversations.

[!INCLUDE [Use Language Studio](../use-language-studio.md)]

## Prerequisites

* The current version of [cURL](https://curl.haxx.se/).
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">create a Language resource </a> in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`Free F0`) to try the service, and upgrade later to a paid tier for production.



## Setting up

[!INCLUDE [Create environment variables](../../../includes/environment-variables.md)]



## Example request

> [!NOTE]
> * The following BASH examples use the `\` line continuation character. If your console or terminal uses a different line continuation character, use that character.
> * You can find language specific samples on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code).
To call the API, you need the following information:

Choose the type of summarization you would like to perform, and select one of the tabs below to see an example API call:

|Feature  |Description  |
|---------|---------|
|Document summarization     | Use extractive text summarization to produce a summary of important or relevant information within a document.        |
|Conversation summarization     | Use abstractive text summarization to produce a summary of issues and resolutions in transcripts between customer-service agents, and customers.         |

# [Document summarization](#tab/document-summarization)

[Reference documentation](https://go.microsoft.com/fwlink/?linkid=2211684)

|parameter  |Description  |
|---------|---------|
|`-X POST <endpoint>`     | Specifies your endpoint for accessing the API.        |
|`-H Content-Type: application/json`     | The content type for sending JSON data.          |
|`-H "Ocp-Apim-Subscription-Key:<key>`    | Specifies the key for accessing the API.        |
|`-d <documents>`     | The JSON containing the documents you want to send.         |

The following cURL commands are executed from a BASH shell. Edit these commands with your own JSON values.

## Document summarization

### Document extractive summarization example

The following example will get you started with document extractive summarization:

1. Copy the command below into a text editor. The BASH example uses the `\` line continuation character. If your console or terminal uses a different line continuation character, use that character instead.

```bash
curl -i -X POST $LANGUAGE_ENDPOINT/language/analyze-text/jobs?api-version=2023-04-01 \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: $LANGUAGE_KEY" \
-d \
' 
{
  "displayName": "Document ext Summarization Task Example",
  "analysisInput": {
    "documents": [
      {
        "id": "1",
        "language": "en",
        "text": "At Microsoft, we have been on a quest to advance AI beyond existing techniques, by taking a more holistic, human-centric approach to learning and understanding. As Chief Technology Officer of Azure AI services, I have been working with a team of amazing scientists and engineers to turn this quest into a reality. In my role, I enjoy a unique perspective in viewing the relationship among three attributes of human cognition: monolingual text (X), audio or visual sensory signals, (Y) and multilingual (Z). At the intersection of all three, there’s magic—what we call XYZ-code as illustrated in Figure 1—a joint representation to create more powerful AI that can speak, hear, see, and understand humans better. We believe XYZ-code will enable us to fulfill our long-term vision: cross-domain transfer learning, spanning modalities and languages. The goal is to have pre-trained models that can jointly learn representations to support a broad range of downstream AI tasks, much in the way humans do today. Over the past five years, we have achieved human performance on benchmarks in conversational speech recognition, machine translation, conversational question answering, machine reading comprehension, and image captioning. These five breakthroughs provided us with strong signals toward our more ambitious aspiration to produce a leap in AI capabilities, achieving multi-sensory and multilingual learning that is closer in line with how humans learn and understand. I believe the joint XYZ-code is a foundational component of this aspiration, if grounded with external knowledge sources in the downstream AI tasks."
      }
    ]
  },
  "tasks": [
    {
      "kind": "ExtractiveSummarization",
      "taskName": "Document Extractive Summarization Task 1",
      "parameters": {
        "sentenceCount": 6
      }
    }
  ]
}
'
```

2. Open a command prompt window (for example: BASH).

3. Paste the command from the text editor into the command prompt window, then run the command.

4. Get the `operation-location` from the response header. The value will look similar to the following URL:

```http
https://<your-language-resource-endpoint>/language/analyze-text/jobs/12345678-1234-1234-1234-12345678?api-version=2023-04-01
```

5. To get the results of the request, use the following cURL command. Be sure to replace `<my-job-id>` with the numerical ID value you received from the previous `operation-location` response header:

```bash
curl -X GET $LANGUAGE_ENDPOINT/language/analyze-text/jobs/<my-job-id>?api-version=2023-04-01 \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: $LANGUAGE_KEY"
```

### Document extractive summarization example JSON response

```json
{
    "jobId": "56e43bcf-70d8-44d2-a7a7-131f3dff069f",
    "lastUpdateDateTime": "2022-09-28T19:33:43Z",
    "createdDateTime": "2022-09-28T19:33:42Z",
    "expirationDateTime": "2022-09-29T19:33:42Z",
    "status": "succeeded",
    "errors": [],
    "displayName": "Document ext Summarization Task Example",
    "tasks": {
        "completed": 1,
        "failed": 0,
        "inProgress": 0,
        "total": 1,
        "items": [
            {
                "kind": "ExtractiveSummarizationLROResults",
                "taskName": "Document Extractive Summarization Task 1",
                "lastUpdateDateTime": "2022-09-28T19:33:43.6712507Z",
                "status": "succeeded",
                "results": {
                    "documents": [
                        {
                            "id": "1",
                            "sentences": [
                                {
                                    "text": "At Microsoft, we have been on a quest to advance AI beyond existing techniques, by taking a more holistic, human-centric approach to learning and understanding.",
                                    "rankScore": 0.69,
                                    "offset": 0,
                                    "length": 160
                                },
                                {
                                    "text": "In my role, I enjoy a unique perspective in viewing the relationship among three attributes of human cognition: monolingual text (X), audio or visual sensory signals, (Y) and multilingual (Z).",
                                    "rankScore": 0.66,
                                    "offset": 324,
                                    "length": 192
                                },
                                {
                                    "text": "At the intersection of all three, there’s magic—what we call XYZ-code as illustrated in Figure 1—a joint representation to create more powerful AI that can speak, hear, see, and understand humans better.",
                                    "rankScore": 0.63,
                                    "offset": 517,
                                    "length": 203
                                },
                                {
                                    "text": "We believe XYZ-code will enable us to fulfill our long-term vision: cross-domain transfer learning, spanning modalities and languages.",
                                    "rankScore": 1.0,
                                    "offset": 721,
                                    "length": 134
                                },
                                {
                                    "text": "The goal is to have pre-trained models that can jointly learn representations to support a broad range of downstream AI tasks, much in the way humans do today.",
                                    "rankScore": 0.74,
                                    "offset": 856,
                                    "length": 159
                                },
                                {
                                    "text": "I believe the joint XYZ-code is a foundational component of this aspiration, if grounded with external knowledge sources in the downstream AI tasks.",
                                    "rankScore": 0.49,
                                    "offset": 1481,
                                    "length": 148
                                }
                            ],
                            "warnings": []
                        }
                    ],
                    "errors": [],
                    "modelVersion": "latest"
                }
            }
        ]
    }
}
```

# [Conversation summarization](#tab/conversation-summarization)

## Conversation issue and resolution summarization

The following example will get you started with conversation issue and resolution summarization:

1. Copy the command below into a text editor. The BASH example uses the `\` line continuation character. If your console or terminal uses a different line continuation character, use that character instead.

```bash
curl -i -X POST $LANGUAGE_ENDPOINT/language/analyze-conversations/jobs?api-version=2023-04-01 \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: $LANGUAGE_KEY" \
-d \
' 
{
  "displayName": "Conversation Task Example",
  "analysisInput": {
    "conversations": [
      {
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
            "text": "Great. Thank you! Now, please check in your Contoso Coffee app. Does it prompt to ask you to connect with the machine? ",
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
        ],
        "modality": "text",
        "id": "conversation1",
        "language": "en"
      }
    ]
  },
  "tasks": [
    {
      "taskName": "Conversation Task 1",
      "kind": "ConversationalSummarizationTask",
      "parameters": {
        "summaryAspects": ["issue"]
      }
    },
    {
      "taskName": "Conversation Task 2",
      "kind": "ConversationalSummarizationTask",
      "parameters": {
        "summaryAspects": ["resolution"],
        "sentenceCount": 1
      }
    }
  ]
}
'
```
Only the `resolution` aspect supports sentenceCount. If you do not specify the `sentenceCount` parameter, the model will determine the summary's length. Note that `sentenceCount` is just the approximation of sentence count of output summary, range 1 to 7.

2. Open a command prompt window (for example: BASH).

3. Paste the command from the text editor into the command prompt window, then run the command.

4. Get the `operation-location` from the response header. The value will look similar to the following URL:

```http
https://<your-language-resource-endpoint>/language/analyze-conversations/jobs/12345678-1234-1234-1234-12345678?api-version=2023-04-01
```

5. To get the results of the request, use the following cURL command. Be sure to replace `<my-job-id>` with the numerical ID value you received from the previous `operation-location` response header:

```bash
curl -X GET $LANGUAGE_ENDPOINT/language/analyze-conversations/jobs/<my-job-id>?api-version=2023-04-01 \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: $LANGUAGE_KEY"
```

### Conversation issue and resolution summarization example JSON response

```json
{
  "jobId": "02ec5134-78bf-45da-8f63-d7410291ec40",
  "lastUpdatedDateTime": "2022-09-29T17:43:02Z",
  "createdDateTime": "2022-09-29T17:43:01Z",
  "expirationDateTime": "2022-09-30T17:43:01Z",
  "status": "succeeded",
  "errors": [],
  "displayName": "Conversation Task Example",
  "tasks": {
    "completed": 2,
    "failed": 0,
    "inProgress": 0,
    "total": 2,
    "items": [
      {
        "kind": "conversationalSummarizationResults",
        "taskName": "Conversation Task 1",
        "lastUpdateDateTime": "2022-09-29T17:43:02.3584219Z",
        "status": "succeeded",
        "results": {
          "conversations": [
            {
              "summaries": [
                {
                  "aspect": "issue",
                  "text": "Customer wants to connect their Smart Brew 300 to their Wi-Fi. | The Wi-Fi connection didn't work."
                }
              ],
              "id": "conversation1",
              "warnings": []
            }
          ],
          "errors": [],
          "modelVersion": "latest"
        }
      },
      {
        "kind": "conversationalSummarizationResults",
        "taskName": "Conversation Task 2",
        "lastUpdateDateTime": "2022-09-29T17:43:02.2099663Z",
        "status": "succeeded",
        "results": {
          "conversations": [
            {
              "summaries": [
                {
                  "aspect": "resolution",
                  "text": "Asked customer to check if the power light is blinking on and off every second."
                }
              ],
              "id": "conversation1",
              "warnings": []
            }
          ],
          "errors": [],
          "modelVersion": "latest"
        }
      }
    ]
  }
}
```

---
