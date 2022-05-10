---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 11/02/2021
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
  "analysisInput": {
    "documents": [
      {
        "language": "en",
        "id": "1",
        "text": "At Microsoft, we have been on a quest to advance AI beyond existing techniques, by taking a more holistic, human-centric approach to learning and understanding. As Chief Technology Officer of Azure AI Cognitive Services, I have been working with a team of amazing scientists and engineers to turn this quest into a reality. In my role, I enjoy a unique perspective in viewing the relationship among three attributes of human cognition: monolingual text (X), audio or visual sensory signals, (Y) and multilingual (Z). At the intersection of all three, there’s magic—what we call XYZ-code as illustrated in Figure 1—a joint representation to create more powerful AI that can speak, hear, see, and understand humans better. We believe XYZ-code will enable us to fulfill our long-term vision: cross-domain transfer learning, spanning modalities and languages. The goal is to have pretrained models that can jointly learn representations to support a broad range of downstream AI tasks, much in the way humans do today. Over the past five years, we have achieved human performance on benchmarks in conversational speech recognition, machine translation, conversational question answering, machine reading comprehension, and image captioning. These five breakthroughs provided us with strong signals toward our more ambitious aspiration to produce a leap in AI capabilities, achieving multisensory and multilingual learning that is closer in line with how humans learn and understand. I believe the joint XYZ-code is a foundational component of this aspiration, if grounded with external knowledge sources in the downstream AI tasks."
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
