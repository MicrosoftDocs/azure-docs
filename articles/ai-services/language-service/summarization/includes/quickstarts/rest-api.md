---
#services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.custom:
  - build-2024
ms.topic: include
ms.date: 12/19/2023
ms.author: jboback
---

# [Text summarization](#tab/text-summarization)

# [Conversation summarization](#tab/conversation-summarization)

# [Document summarization](#tab/document-summarization)

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
> * The following BASH exaples use the `\` line continuation character. If your console or terminal uses a different line continuation character, use that character.
> * You can find language specific samples on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code).
To call the API, you need the following information:

Choose the type of summarization you would like to perform, and select one of the tabs below to see an example API call:

| Feature | Description |
|---------|-------------|
|Text summarization     | Use extractive text summarization to produce a summary of important or relevant information within a document.        |
|Conversation summarization     | Use abstractive text summarization to produce a summary of issues and resolutions in transcripts between customer-service agents, and customers.         |

# [Text summarization](#tab/text-summarization)

|parameter  |Description  |
|---------|---------|
|`-X POST <endpoint>`     | Specifies your endpoint for accessing the API.        |
|`-H Content-Type: application/json`     | The content type for sending JSON data.          |
|`-H "Ocp-Apim-Subscription-Key:<key>`    | Specifies the key for accessing the API.        |
|`-d <documents>`     | The JSON containing the documents you want to send.         |

The following cURL commands are executed from a BASH shell. Edit these commands with your own JSON values.

## Text summarization

### Text extractive summarization example

The following example will get you started with text extractive summarization:

1. Copy the command below into a text editor. The BASH example uses the `\` line continuation character. If your console or terminal uses a different line continuation character, use that character instead.

```bash
curl -i -X POST $LANGUAGE_ENDPOINT/language/analyze-text/jobs?api-version=2023-04-01 \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: $LANGUAGE_KEY" \
-d \
' 
{
  "displayName": "Text ext Summarization Task Example",
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
      "taskName": "Text Extractive Summarization Task 1",
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

### Text extractive summarization example JSON response

```json
{
    "jobId": "56e43bcf-70d8-44d2-a7a7-131f3dff069f",
    "lastUpdateDateTime": "2022-09-28T19:33:43Z",
    "createdDateTime": "2022-09-28T19:33:42Z",
    "expirationDateTime": "2022-09-29T19:33:42Z",
    "status": "succeeded",
    "errors": [],
    "displayName": "Text ext Summarization Task Example",
    "tasks": {
        "completed": 1,
        "failed": 0,
        "inProgress": 0,
        "total": 1,
        "items": [
            {
                "kind": "ExtractiveSummarizationLROResults",
                "taskName": "Text Extractive Summarization Task 1",
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

# [Document summarization](#tab/document-summarization)

### Summarization sample document

For this project, you need a **source document** uploaded to your **source container**. You can download our [Microsoft Word sample document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/Language/native-document-summarization.docx) or [Adobe PDF](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/Language/native-document-summarization.pdf) for this quickstart. The source language is English.

### Build the POST request

1. Using your preferred editor or IDE, create a new directory for your app named `native-document`.
1. Create a new json file called **document-summarization.json** in your **native-document** directory.

1. Copy and paste the Document Summarization **request sample** into your `document-summarization.json` file. Replace **`{your-source-container-SAS-URL}`** and **`{your-target-container-SAS-URL}`** with values from your Azure portal Storage account containers instance:

  ***Request sample***

  ```json
  {
   "kind": "ExtractiveSummarization",
   "parameters": {
        "sentenceCount": 6
    },
   "analysisInput":{
        "documents":[
            {
          "source":{
            "location":"{your-source-blob-SAS-URL}"
          },
          "targets":
            {
              "location":"{your-target-container-SAS-URL}",
            }
            }
        ]
    }
  }
  ```

### Run the POST request

Before you run the **POST** request, replace `{your-language-resource-endpoint}` and `{your-key}` with the endpoint value from your Azure portal Language resource instance.

  > [!IMPORTANT]
  > Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](/azure/key-vault/general/overview). For more information, *see* Azure AI services [security](/azure/ai-services/security-features).

  ***PowerShell***

  ```powershell
   cmd /c curl "{your-language-resource-endpoint}/language/analyze-documents/jobs?api-version=2023-11-15-preview" -i -X POST --header "Content-Type: application/json" --header "Ocp-Apim-Subscription-Key: {your-key}" --data "@document-summarization.json"
  ```

  ***command prompt / terminal***

  ```bash
  curl -v -X POST "{your-language-resource-endpoint}/language/analyze-documents/jobs?api-version=2023-11-15-preview" --header "Content-Type: application/json" --header "Ocp-Apim-Subscription-Key: {your-key}" --data "@document-summarization.json"
  ```

Here's a sample response:

   ```http
   HTTP/1.1 202 Accepted
   Content-Length: 0
   operation-location: https://{your-language-resource-endpoint}/language/analyze-documents/jobs/f1cc29ff-9738-42ea-afa5-98d2d3cabf94?api-version=2023-11-15-preview
   apim-request-id: e7d6fa0c-0efd-416a-8b1e-1cd9287f5f81
   x-ms-region: West US 2
   Date: Thu, 25 Jan 2024 15:12:32 GMT
   ```

### POST response (jobId)

You receive a 202 (Success) response that includes a read-only Operation-Location header. The value of this header contains a jobId that can be queried to get the status of the asynchronous operation and retrieve the results using a GET request:

  :::image type="content" source="../../../native-document-support/media/operation-location-result-id.png" alt-text="Screenshot showing the operation-location value in the POST response.":::

### Get analyze results (GET request)

1. After your successful **POST** request, poll the operation-location header returned in the POST request to view the processed data.

1. Here's the structure of the **GET** request:

   ```http
   GET {cognitive-service-endpoint}/language/analyze-documents/jobs/{jobId}?api-version=2023-11-15-preview
   ```

1. Before you run the command, make these changes:

    * Replace {**jobId**} with the Operation-Location header from the POST response.

    * Replace {**your-language-resource-endpoint**} and {**your-key**} with the values from your Language service instance in the Azure portal.

### Get request

```powershell
    cmd /c curl "{your-language-resource-endpoint}/language/analyze-documents/jobs/{jobId}?api-version=2023-11-15-preview" -i -X GET --header "Content-Type: application/json" --header "Ocp-Apim-Subscription-Key: {your-key}"
```

```bash
    curl -v -X GET "{your-language-resource-endpoint}/language/analyze-documents/jobs/{jobId}?api-version=2023-11-15-preview" --header "Content-Type: application/json" --header "Ocp-Apim-Subscription-Key: {your-key}"
```

#### Examine the response

You receive a 200 (Success) response with JSON output. The **status** field indicates the result of the operation. If the operation isn't complete, the value of **status** is "running" or "notStarted", and you should call the API again, either manually or through a script. We recommend an interval of one second or more between calls.

#### Sample response

```json
{
  "jobId": "f1cc29ff-9738-42ea-afa5-98d2d3cabf94",
  "lastUpdatedDateTime": "2024-01-24T13:17:58Z",
  "createdDateTime": "2024-01-24T13:17:47Z",
  "expirationDateTime": "2024-01-25T13:17:47Z",
  "status": "succeeded",
  "errors": [],
  "tasks": {
    "completed": 1,
    "failed": 0,
    "inProgress": 0,
    "total": 1,
    "items": [
      {
        "kind": "ExtractiveSummarizationLROResults",
        "lastUpdateDateTime": "2024-01-24T13:17:58.33934Z",
        "status": "succeeded",
        "results": {
          "documents": [
            {
              "id": "doc_0",
              "source": {
                "kind": "AzureBlob",
                "location": "https://myaccount.blob.core.windows.net/sample-input/input.pdf"
              },
              "targets": [
                {
                  "kind": "AzureBlob",
                  "location": "https://myaccount.blob.core.windows.net/sample-output/df6611a3-fe74-44f8-b8d4-58ac7491cb13/ExtractiveSummarization-0001/input.result.json"
                }
              ],
              "warnings": []
            }
          ],
          "errors": [],
          "modelVersion": "2023-02-01-preview"
        }
      }
    ]
  }
}
```

---
