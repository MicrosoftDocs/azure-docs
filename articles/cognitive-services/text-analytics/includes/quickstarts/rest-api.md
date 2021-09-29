---
title: "Quickstart: Using cURL to call the Text Analytics REST API"
titleSuffix: Azure Cognitive Services
description: This quickstart shows how to quickly get started using the Text Analytics API in Azure Cognitive Services.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: quickstart
ms.date: 09/23/2021
ms.author: aahi
---


#### [Version 3.2-preview.1](#tab/version-3-2)

[v3.2 Reference documentation](https://westus2.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-2-Preview-1)

#### [Version 3.1](#tab/version-3-1)

[v3 Reference documentation](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1) 

---

## Prerequisites

* The current version of [cURL](https://curl.haxx.se/).
* [!INCLUDE [contributor-requirement](../../../includes/quickstarts/contributor-requirement.md)]
* Once you have your Azure subscription, <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Text Analytics resource"  target="_blank">create a Text Analytics resource </a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Text Analytics API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

> [!NOTE]
> * The following BASH examples use the `\` line continuation character. If your console or terminal uses a different line continuation character, use that character.
> * You can find language specific samples on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code).
> * Go to the Azure portal and find the key and endpoint for the Text Analytics resource you created in the prerequisites. They will be located on the resource's **key and endpoint** page, under **resource management**. Then replace the strings in the code below with your key and endpoint.
To call the Text Analytics API, you need the following information:


|parameter  |Description  |
|---------|---------|
|`-X POST <endpoint>`     | Specifies your endpoint for accessing the API.        |
|`-H Content-Type: application/json`     | The content type for sending JSON data.          |
|`-H "Ocp-Apim-Subscription-Key:<key>`    | Specifies the key for accessing the API.        |
|`-d <documents>`     | The JSON containing the documents you want to send.         |

The following cURL commands are executed from a BASH shell. Edit these commands with your own resource name, resource key, and JSON values.

## Sentiment Analysis and opinion mining

[!INCLUDE [REST API quickstart instructions](rest-api-instructions.md)]

> [!NOTE]
> The below examples include a request for the Opinion Mining feature of Sentiment Analysis using the `opinionMining=true` parameter, which provides granular information about assessments (adjectives) related to targets (nouns) in the text.

#### [version 3.2-preview.1](#tab/version-3-2)

```bash
curl -X POST https://<your-text-analytics-endpoint-here>/text/analytics/v3.2-preview.1/sentiment?opinionMining=true \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: <your-text-analytics-key-here>" \
-d '{ documents: [{ id: "1", text: "The customer service here is really good."}]}'
```

#### [version 3.1](#tab/version-3-1)

```bash
curl -X POST https://<your-text-analytics-endpoint-here>/text/analytics/v3.1/sentiment?opinionMining=true \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: <your-text-analytics-key-here>" \
-d '{ documents: [{ id: "1", text: "The customer service here is really good."}]}'
```

---

### JSON response

[!INCLUDE [REST API response is the same for both versions](../rest-api-response-same.md)]

```json
{
   "documents":[
      {
         "id":"1",
         "sentiment":"positive",
         "confidenceScores":{
            "positive":1.0,
            "neutral":0.0,
            "negative":0.0
         },
         "sentences":[
            {
               "sentiment":"positive",
               "confidenceScores":{
                  "positive":1.0,
                  "neutral":0.0,
                  "negative":0.0
               },
               "offset":0,
               "length":41,
               "text":"The customer service here is really good.",
               "targets":[
                  {
                     "sentiment":"positive",
                     "confidenceScores":{
                        "positive":1.0,
                        "negative":0.0
                     },
                     "offset":4,
                     "length":16,
                     "text":"customer service",
                     "relations":[
                        {
                           "relationType":"assessment",
                           "ref":"#/documents/0/sentences/0/assessments/0"
                        }
                     ]
                  }
               ],
               "assessments":[
                  {
                     "sentiment":"positive",
                     "confidenceScores":{
                        "positive":1.0,
                        "negative":0.0
                     },
                     "offset":36,
                     "length":4,
                     "text":"good",
                     "isNegated":false
                  }
               ]
            }
         ],
         "warnings":[
            
         ]
      }
   ],
   "errors":[
      
   ],
   "modelVersion":"2020-04-01"
}
``` 

## Language detection

[!INCLUDE [REST API quickstart instructions](rest-api-instructions.md)]

#### [version 3.2-preview.1](#tab/version-3-2)

```bash
curl -X POST https://<your-text-analytics-endpoint-here>/text/analytics/v3.2-preview.1/languages/ \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: <your-text-analytics-key-here>" \
-d '{ documents: [{ id: "1", text: "This is a document written in English."}]}'
```

#### [version 3.1](#tab/version-3-1)

```bash
curl -X POST https://<your-text-analytics-endpoint-here>/text/analytics/v3.1/languages/ \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: <your-text-analytics-key-here>" \
-d '{ documents: [{ id: "1", text: "This is a document written in English."}]}'
```

---

### JSON response

[!INCLUDE [REST API response is the same for both versions](../rest-api-response-same.md)]

```json
{
   "documents":[
      {
         "id":"1",
         "detectedLanguage":{
            "name":"English",
            "iso6391Name":"en",
            "confidenceScore":1.0
         },
         "warnings":[
            
         ]
      }
   ],
   "errors":[
      
   ],
   "modelVersion":"2021-01-05"
}
```

## Named Entity Recognition (NER)

[!INCLUDE [REST API quickstart instructions](rest-api-instructions.md)]

#### [version 3.2-preview.1](#tab/version-3-2)

```bash
curl -X POST https://<your-text-analytics-endpoint-here>/text/analytics/v3.2-preview.1/entities/recognition/general \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: <your-text-analytics-key-here>" \
-d '{ documents: [{ id: "1", language:"en", text: "I had a wonderful trip to Seattle last week."}]}'
```

#### [version 3.1](#tab/version-3-1)

```bash
curl -X POST https://<your-text-analytics-endpoint-here>/text/analytics/v3.1/entities/recognition/general \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: <your-text-analytics-key-here>" \
-d '{ documents: [{ id: "1", language:"en", text: "I had a wonderful trip to Seattle last week."}]}'
```

---

### JSON response

[!INCLUDE [REST API response is the same for both versions](../rest-api-response-same.md)]

```json
{
   "documents":[
      {
         "id":"1",
         "entities":[
            {
               "text":"Seattle",
               "category":"Location",
               "subcategory":"GPE",
               "offset":26,
               "length":7,
               "confidenceScore":0.99
            },
            {
               "text":"last week",
               "category":"DateTime",
               "subcategory":"DateRange",
               "offset":34,
               "length":9,
               "confidenceScore":0.8
            }
         ],
         "warnings":[
            
         ]
      }
   ],
   "errors":[
      
   ],
   "modelVersion":"2021-01-15"
}

```

## Personally Identifiable Information (PII) recognition

[!INCLUDE [REST API quickstart instructions](rest-api-instructions.md)]

#### [version 3.2-preview.1](#tab/version-3-2)

```bash
curl -X POST https://your-text-analytics-endpoint-here>/text/analytics/v3.2-preview.1/entities/recognition/pii \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: <your-text-analytics-key-here>" \
-d '{ documents: [{ id: "1", language:"en", text: "Call our office at 312-555-1234, or send an email to support@contoso.com"}]}'
```

#### [version 3.1](#tab/version-3-1)

```bash
curl -X POST https://your-text-analytics-endpoint-here>/text/analytics/v3.1/entities/recognition/pii \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: <your-text-analytics-key-here>" \
-d '{ documents: [{ id: "1", language:"en", text: "Call our office at 312-555-1234, or send an email to support@contoso.com"}]}'
```

---

### JSON response

[!INCLUDE [REST API response is the same for both versions](../rest-api-response-same.md)]

```json
{
   "documents":[
      {
         "redactedText":"Call our office at ************, or send an email to *******************",
         "id":"1",
         "entities":[
            {
               "text":"312-555-1234",
               "category":"PhoneNumber",
               "offset":19,
               "length":12,
               "confidenceScore":0.8
            },
            {
               "text":"support@contoso.com",
               "category":"Email",
               "offset":53,
               "length":19,
               "confidenceScore":0.8
            }
         ],
         "warnings":[
            
         ]
      }
   ],
   "errors":[
      
   ],
   "modelVersion":"2021-01-15"
}
```

## Entity linking

[!INCLUDE [REST API quickstart instructions](rest-api-instructions.md)]

#### [version 3.2-preview.1](#tab/version-3-2)

```bash
curl -X POST https://<your-text-analytics-endpoint-here>/text/analytics/v3.2-preview.1/entities/linking \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: <your-text-analytics-key-here>" \
-d '{ documents: [{ id: "1", language:"en", text: "Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975."}]}'
```

#### [version 3.1](#tab/version-3-1)

```bash
curl -X POST https://<your-text-analytics-endpoint-here>/text/analytics/v3.1/entities/linking \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: <your-text-analytics-key-here>" \
-d '{ documents: [{ id: "1", language:"en", text: "Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975."}]}'
```

---

### JSON response

[!INCLUDE [REST API response is the same for both versions](../rest-api-response-same.md)]

```json
{
   "documents":[
      {
         "id":"1",
         "entities":[
            {
               "bingId":"a093e9b9-90f5-a3d5-c4b8-5855e1b01f85",
               "name":"Microsoft",
               "matches":[
                  {
                     "text":"Microsoft",
                     "offset":0,
                     "length":9,
                     "confidenceScore":0.48
                  }
               ],
               "language":"en",
               "id":"Microsoft",
               "url":"https://en.wikipedia.org/wiki/Microsoft",
               "dataSource":"Wikipedia"
            },
            {
               "bingId":"0d47c987-0042-5576-15e8-97af601614fa",
               "name":"Bill Gates",
               "matches":[
                  {
                     "text":"Bill Gates",
                     "offset":25,
                     "length":10,
                     "confidenceScore":0.52
                  }
               ],
               "language":"en",
               "id":"Bill Gates",
               "url":"https://en.wikipedia.org/wiki/Bill_Gates",
               "dataSource":"Wikipedia"
            },
            {
               "bingId":"df2c4376-9923-6a54-893f-2ee5a5badbc7",
               "name":"Paul Allen",
               "matches":[
                  {
                     "text":"Paul Allen",
                     "offset":40,
                     "length":10,
                     "confidenceScore":0.54
                  }
               ],
               "language":"en",
               "id":"Paul Allen",
               "url":"https://en.wikipedia.org/wiki/Paul_Allen",
               "dataSource":"Wikipedia"
            },
            {
               "bingId":"52535f87-235e-b513-54fe-c03e4233ac6e",
               "name":"April 4",
               "matches":[
                  {
                     "text":"April 4",
                     "offset":54,
                     "length":7,
                     "confidenceScore":0.38
                  }
               ],
               "language":"en",
               "id":"April 4",
               "url":"https://en.wikipedia.org/wiki/April_4",
               "dataSource":"Wikipedia"
            }
         ],
         "warnings":[
            
         ]
      }
   ],
   "errors":[
      
   ],
   "modelVersion":"2020-02-01"
}
```

## Key phrase extraction

[!INCLUDE [REST API quickstart instructions](rest-api-instructions.md)]

#### [version 3.2-preview.1](#tab/version-3-2)

```bash
curl -X POST https://<your-text-analytics-endpoint-here>/text/analytics/v3.2-preview.1/keyPhrases \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: <your-text-analytics-key-here>" \
-d '{ documents: [{ id: "1", language:"en", text: "I had a wonderful trip to Seattle last week."}]}'
```

#### [version 3.1](#tab/version-3-1)

```bash
curl -X POST https://<your-text-analytics-endpoint-here>/text/analytics/v3.1/keyPhrases \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: <your-text-analytics-key-here>" \
-d '{ documents: [{ id: "1", language:"en", text: "I had a wonderful trip to Seattle last week."}]}'
```

---

### JSON response

[!INCLUDE [REST API response is the same for both versions](../rest-api-response-same.md)]


```json
{
   "documents":[
      {
         "id":"1",
         "keyPhrases":[
            "wonderful trip",
            "Seattle"
         ],
         "warnings":[
            
         ]
      }
   ],
   "errors":[
      
   ],
   "modelVersion":"2021-06-01"
}
```

## Text analytics for health


[!INCLUDE [REST API quickstart instructions](rest-api-instructions.md)]

#### [version 3.2-preview.1](#tab/version-3-2)

```bash
curl -i -X POST https://your-text-analytics-endpoint-here/text/analytics/v3.2-preview.1/entities/health/jobs \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: your-text-analytics-key-here" \
-d '{ documents: [{ id: "1", language:"en", text: "Subject was administered 100mg remdesivir intravenously over a period of 120 min"}]}'
```

Get the `operation-location` from the response header. The value will look similar to the following URL:

```rest
https://your-resource.cognitiveservices.azure.com/text/analytics/v3.2-preview.1/entities/health/jobs/12345678-1234-1234-1234-12345678
```

To get the results of the request, use the following cURL command. Be sure to replace `my-job-id` with the numerical ID value you received from the previous `operation-location` response header:

```bash
curl -X GET  https://your-text-analytics-endpoint-here/text/analytics/v3.2-preview.1/entities/health/jobs/my-job-id \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: your-text-analytics-key-here"
```

#### [version 3.1](#tab/version-3-1)

```bash
curl -i -X POST https://your-text-analytics-endpoint-here/text/analytics/v3.1/entities/health/jobs \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: your-text-analytics-key-here" \
-d '{ documents: [{ id: "1", language:"en", text: "Subject was administered 100mg remdesivir intravenously over a period of 120 min"}]}'
```

Get the `operation-location` from the response header. The value will look similar to the following URL:

```rest
https://your-resource.cognitiveservices.azure.com/text/analytics/v3.1/entities/health/jobs/12345678-1234-1234-1234-12345678
```

To get the results of the request, use the following cURL command. Be sure to replace `my-job-id` with the numerical ID value you received from the previous `operation-location` response header:

```bash
curl -X GET  https://your-text-analytics-endpoint-here/text/analytics/v3.1/entities/health/jobs/my-job-id \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: your-text-analytics-key-here"
```

---

### JSON response

[!INCLUDE [REST API response is the same for both versions](../rest-api-response-same.md)]

```json
{
   "jobId":"12345678-1234-1234-1234-12345678",
   "lastUpdateDateTime":"2021-08-02T21:32:43Z",
   "createdDateTime":"2021-08-02T21:32:04Z",
   "expirationDateTime":"2021-08-03T21:32:04Z",
   "status":"succeeded",
   "errors":[
      
   ],
   "results":{
      "documents":[
         {
            "id":"1",
            "entities":[
               {
                  "offset":25,
                  "length":5,
                  "text":"100mg",
                  "category":"Dosage",
                  "confidenceScore":1.0
               },
               {
                  "offset":31,
                  "length":10,
                  "text":"remdesivir",
                  "category":"MedicationName",
                  "confidenceScore":1.0,
                  "name":"remdesivir",
                  "links":[
                     {
                        "dataSource":"UMLS",
                        "id":"C4726677"
                     },
                     {
                        "dataSource":"DRUGBANK",
                        "id":"DB14761"
                     },
                     {
                        "dataSource":"GS",
                        "id":"6192"
                     },
                     {
                        "dataSource":"MEDCIN",
                        "id":"398132"
                     },
                     {
                        "dataSource":"MMSL",
                        "id":"d09540"
                     },
                     {
                        "dataSource":"MSH",
                        "id":"C000606551"
                     },
                     {
                        "dataSource":"MTHSPL",
                        "id":"3QKI37EEHE"
                     },
                     {
                        "dataSource":"NCI",
                        "id":"C152185"
                     },
                     {
                        "dataSource":"NCI_FDA",
                        "id":"3QKI37EEHE"
                     },
                     {
                        "dataSource":"NDDF",
                        "id":"018308"
                     },
                     {
                        "dataSource":"RXNORM",
                        "id":"2284718"
                     },
                     {
                        "dataSource":"SNOMEDCT_US",
                        "id":"870592005"
                     },
                     {
                        "dataSource":"VANDF",
                        "id":"4039395"
                     }
                  ]
               },
               {
                  "offset":42,
                  "length":13,
                  "text":"intravenously",
                  "category":"MedicationRoute",
                  "confidenceScore":0.99
               },
               {
                  "offset":73,
                  "length":7,
                  "text":"120 min",
                  "category":"Time",
                  "confidenceScore":0.98
               }
            ],
            "relations":[
               {
                  "relationType":"DosageOfMedication",
                  "entities":[
                     {
                        "ref":"#/results/documents/0/entities/0",
                        "role":"Dosage"
                     },
                     {
                        "ref":"#/results/documents/0/entities/1",
                        "role":"Medication"
                     }
                  ]
               },
               {
                  "relationType":"RouteOfMedication",
                  "entities":[
                     {
                        "ref":"#/results/documents/0/entities/1",
                        "role":"Medication"
                     },
                     {
                        "ref":"#/results/documents/0/entities/2",
                        "role":"Route"
                     }
                  ]
               },
               {
                  "relationType":"TimeOfMedication",
                  "entities":[
                     {
                        "ref":"#/results/documents/0/entities/1",
                        "role":"Medication"
                     },
                     {
                        "ref":"#/results/documents/0/entities/3",
                        "role":"Time"
                     }
                  ]
               }
            ],
            "warnings":[
               
            ]
         }
      ],
      "errors":[
         
      ],
      "modelVersion":"2021-05-15"
   }
}
```
---

## Text summarization

#### [version 3.2-preview.1](#tab/version-3-2)

```bash
curl -i -X POST https://your-text-analytics-endpoint-here/text/analytics/v3.2-preview.1/analyze \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: your-text-analytics-key-here" \
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

```rest
https://your-resource.cognitiveservices.azure.com/text/analytics/v3.2-preview.1/analyze/jobs/12345678-1234-1234-1234-12345678
```

To get the results of the request, use the following cURL command. Be sure to replace `my-job-id` with the numerical ID value you received from the previous `operation-location` response header:

```bash
curl -X GET    https://your-text-analytics-endpoint-here/text/analytics/v3.2-preview.1/analyze/jobs/my-job-id \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: your-text-analytics-key-here"
```


### Output

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

#### [version 3.1](#tab/version-3-1)

This feature is not available in version 3.1.

---