---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 03/16/2022
ms.author: aahi
ms.custom: ignite-fall-2021
---

[Reference documentation](https://westus2.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1/)


## Prerequisites

* The current version of [cURL](https://curl.haxx.se/).
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">create a Language resource </a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

> [!NOTE]
> * The following BASH examples use the `\` line continuation character. If your console or terminal uses a different line continuation character, use that character.
> * You can find language specific samples on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code).
> * Go to the Azure portal and find the key and endpoint for the Language resource you created in the prerequisites. They will be located on the resource's **key and endpoint** page, under **resource management**. Then replace the strings in the code below with your key and endpoint.
To call the API, you need the following information:


|parameter  |Description  |
|---------|---------|
|`-X POST <endpoint>`     | Specifies your endpoint for accessing the API.        |
|`-H Content-Type: application/json`     | The content type for sending JSON data.          |
|`-H "Ocp-Apim-Subscription-Key:<key>`    | Specifies the key for accessing the API.        |
|`-d <documents>`     | The JSON containing the documents you want to send.         |

The following cURL commands are executed from a BASH shell. Edit these commands with your own resource name, resource key, and JSON values.


## Text Summarization

[!INCLUDE [REST API quickstart instructions](../../../includes/rest-api-instructions.md)]

```bash
curl -i -X POST https://your-text-analytics-endpoint-here/text/analytics/v3.2-preview.1/analyze \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: your-key-here" \
-d \
' 
{
    "displayName": "Analyze test conversation",
    "analysisInput": {
        "conversations": [
            {
                "conversationItems": [
                    {
                        "text": "Hello, you’re chatting with Rene. How may I help you?",
                        "modality": "text",
                        "id": "1",
                        "participantId": "Agent"
                    },
                    {
                        "text": "Hi, I tried to set up wifi connection for Smart Brew 300 espresso machine, but it didn’t work.",
                        "modality": "text",
                        "id": "2",
                        "participantId": "Customer"
                    },
                    {
                        "text": "I’m sorry to hear that. Let’s see what we can do to fix this issue. Could you please try the following steps for me? First, could you push the wifi connection button, hold for 3 seconds, then let me know if the power light is slowly blinking on and off every second?",
                        "modality": "text",
                        "id": "3",
                        "participantId": "Agent"
                    },
                    {
                        "text": "Yes, I pushed the wifi connection button, and now the power light is slowly blinking.",
                        "modality": "text",
                        "id": "4",
                        "participantId": "Customer"
                    },
                    {
                        "text": "Great. Thank you! Now, please check in your Contoso Coffee app. Does it prompt to ask you to connect with the machine?",
                        "modality": "text",
                        "id": "5",
                        "participantId": "Agent"
                    },
                    {
                        "text": "No. Nothing happened.",
                        "modality": "text",
                        "id": "6",
                        "participantId": "Customer"
                    },
                    {
                        "text": "I’m very sorry to hear that. Let me see if there’s another way to fix the issue. Please hold on for a minute.",
                        "modality": "text",
                        "id": "7",
                        "participantId": "Agent"
                    },

                ],
                "modality": "text",
                "id": "conversation1",
                "language": "en"
            }
        ]
    },
    "tasks": [
        {
            "taskName": "analyze 1",
            "kind": "IssueResolutionSummarization",
            "parameters": {
                "modelVersion": "2022-04-01",
                "summaryAspects ": "issue, resolution"
            }
        }
    ]
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
    "displayName": "Analyze chat",
    "createdDateTime": "2022-04-01T15:00:45Z",
    "expirationDateTime": "2022-04-02T15:00:45Z",
    "jobId": "3e9e8518-492f-47f9-abd1-9a7468231086",
    "lastUpdateDateTime": "2022-04-01T15:00:49Z ",
    "status": "succeeded",
    "tasks": {
        "completed": 1,
        "failed": 0,
        "inProgress": 0,
        "total": 1,
        "items": [
            {
                "kind": "issueResolutionSummaryResults",
                "lastUpdateDateTime": "2022-04-01T15:00:49Z",
                "taskName": "analyze 1",
                "status": "succeeded",
                "results": {
                    "conversations": [
                        {
                            "id": "20220101meeting",
                            "summaries": [
                                {
                                    "aspect": "issue",
                                    "text": "Customer wants to use the wifi connection on their Smart Brew 300. They can’t connect it using the Contoso Coffee app"
                                },
                                {
                                    "aspect": "resolution",
                                    "text": "Tried pushing wifi button. Checked if the power light is blinking slowly."
                                }
                            ],
                            "warnings": [],
                            "statistics": {
                                "charactersCount": "123",
                                "transactionCount": "1"
                            }
                        }
                    ],
                    "errors": [],
                    "modelVersion": "2022-04-01"
                }
            }
        ]
    },
    "@nextLink": "<resource-endpoint>/language/analyze-conversation/jobs/12345678-123a-abc1-abd1-12345abcde?$skip=10&$top=10"
}
```
