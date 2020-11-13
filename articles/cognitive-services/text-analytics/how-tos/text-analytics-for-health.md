---
title: How to use Text Analytics for health
titleSuffix: Azure Cognitive Services
description: Learn how to extract and label medical information from unstructured clinical text with Text Analytics for health. 
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 11/19/2020
ms.author: aahi
---

# How to: Use Text Analytics for health (preview)

> [!NOTE]
> The Text Analytics for health container has recently updated. See [What's new](../whats-new.md) for more information on recent changes. Remember to pull the latest container to use the updates listed.

> [!IMPORTANT] 
> Text Analytics for health is a preview capability provided “AS IS” and “WITH ALL FAULTS.” As such, **Text Analytics for health (preview) should not be implemented or deployed in any production use.** 
Text Analytics for health is not intended or made available for use as a medical device, clinical support, diagnostic tool, or other technology intended to be used in the diagnosis, cure, mitigation, treatment, or prevention of disease or other conditions, and no license or right is granted by Microsoft to use this capability for such purposes. This capability is not designed or intended to be implemented or deployed as a substitute for professional medical advice or healthcare opinion, diagnosis, treatment, or the clinical judgment of a healthcare professional, and should not be used as such. The customer is solely responsible for any use of Text Analytics for health. Microsoft does not warrant that Text Analytics for health or any materials provided in connection with the capability will be sufficient for any medical purposes or otherwise meet the health or medical requirements of any person. 


Text Analytics for health is a feature of the Text Analytics API service that extracts and labels relevant medical information from unstructured texts such as doctor's notes, discharge summaries, clinical documents, and electronic health records.  There are two ways to utilize this service: 

* The web-based API (asynchronous) 
* A Docker container (synchronous)   

## Features

Text Analytics for health performs Named Entity Recognition (NER), relation extraction, entity negation and entity linking on English-language text to uncover insights in unstructured clinical and biomedical text.

### [Named Entity Recognition](#tab/ner)

Named Entity Recognition detects words and phrases mentioned in unstructured text that can be associated with one or more semantic types, such as diagnosis, medication name, symptom/sign, or age.

> [!div class="mx-imgBorder"]
> ![Health NER](../media/ta-for-health/health-named-entity-recognition.png)

### [Relation Extraction](#tab/relation-extraction)

Relation extraction identifies meaningful connections between concepts mentioned in text. For example, a "time of condition" relation is found by associating a condition name with a time. 

> [!div class="mx-imgBorder"]
> ![Health RE](../media/ta-for-health/health-relation-extraction.png)


### [Entity Linking](#tab/entity-linking)

Entity Linking disambiguates distinct entities by associating named entities mentioned in text to concepts found in a predefined database of concepts. For example, the Unified Medical Language System (UMLS).

> [!div class="mx-imgBorder"]
> ![Health EL](../media/ta-for-health/health-entity-linking.png)

Text Analytics for health supports linking to the health and biomedical vocabularies found in the Unified Medical Language System ([UMLS](https://www.nlm.nih.gov/research/umls/sourcereleasedocs/index.html)) Metathesaurus Knowledge Source.

### [Negation Detection](#tab/negation-detection) 

The meaning of medical content is highly affected by modifiers such as negation, which can have critical implication if misdiagnosed. Text Analytics for health supports negation detection for the different entities mentioned in the text. 

> [!div class="mx-imgBorder"]
> ![Health NEG](../media/ta-for-health/health-negation.png)

---

See the [entity categories](../named-entity-types.md?tabs=health) returned by Text Analytics for health for a full list of supported entities.

### Supported languages and regions

Text Analytics for health only supports English language documents. 

The Text Analytics for health hosted web API is currently only available in these regions: West US 2, East US 2, Central US, North Europe and West Europe.

## Request access to the public preview

Fill out and submit the [Cognitive Services request form](https://aka.ms/csgate) to request access to the Text Analytics for health public preview. You will not be billed for Text Analytics for health usage. 

The form requests information about you, your company, and the user scenario for which you'll use the container. After you submit the form, the Azure Cognitive Services team will review it and email you with a decision.

> [!IMPORTANT]
> * On the form, you must use an email address associated with an Azure subscription ID.
> * The Azure resource you use must have been created with the approved Azure subscription ID. 
> * Check your email (both inbox and junk folders) for updates on the status of your application from Microsoft.

## Using the Docker container 

To run the Text Analytics for health container in your own environment, follow these [instructions to download and install the container](../how-tos/text-analytics-how-to-install-containers.md?tabs=healthcare).

## Sending a REST API request 

### Preparation

Text Analytics for health produces a higher-quality result when you give it smaller amounts of text to work on. This is opposite to some of the other Text Analytics features such as key phrase extraction which performs better on larger blocks of text. To get the best results from these operations, consider restructuring the inputs accordingly.

You must have JSON documents in this format: ID, text, and language. 

Document size must be under 5,120 characters per document. For the maximum number of documents permitted in a collection, see the [data limits](../concepts/data-limits.md?tabs=version-3) article under Concepts. The collection is submitted in the body of the request.

### Structure the API request for the hosted asynchronous web API

For both the container and hosted web API, you must create a POST request. You can [use Postman](text-analytics-how-to-call-api.md#set-up-a-request-in-postman), a cURL command or the **API testing console** in the [Text Analytics for health hosted API reference](https://westus2.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1-preview-3/operations/Health) to quickly construct and send a POST request to the hosted web API in your desired region. 

Below is an example of a JSON file attached to the Text Analytics for health API request's POST body:

```json
example.json

{
  "documents": [
    {
      "language": "en",
      "id": "1",
      "text": "Subject is taking 100mg of ibuprofen twice daily."
    }
  ]
}
```

### Hosted asynchronous web API response 

Since this POST request is used to submit a job for the asynchronous operation, there is no text in the response object.  However, you need the value of the operation-location KEY in the response headers to make a GET request to check the status of the job and the output.  Below is an example of the value of the operation-location KEY in the response header of the POST request:

`https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.1-preview.3/entities/health/jobs/<jobID>`

To check the job status, make a GET request to the URL in the value of the operation-location KEY header of the POST response.  The following states are used to reflect the status of a job: `NotStarted`, `running`, `succeeded`, `failed`, `rejected`, `cancelling`, and `cancelled`.  

You can cancel a job with a `NotStarted` or `running` status with a DELETE HTTP call to the same URL as the GET request.  More information on the DELETE call is available in the [Text Analytics for health hosted API reference](https://westus2.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1-preview-3/operations/CancelHealthJob).

The following is an example of the response of a GET request.  Please note that the output is available for retrieval until the `expirationDateTime` (24 hours from the time the job was created) has passed after which the output is purged.

```json
{
    "jobId": "c1e6a49f-fa6c-48fa-a1c4-97ed92d809bb",
    "lastUpdateDateTime": "2020-11-13T09:57:05Z",
    "createdDateTime": "2020-11-13T09:57:04Z",
    "expirationDateTime": "2020-11-14T09:57:04Z",
    "status": "succeeded",
    "errors": [],
    "results": {
        "documents": [
            {
                "id": "1",
                "entities": [
                    {
                        "offset": 18,
                        "length": 5,
                        "text": "100mg",
                        "category": "Dosage",
                        "confidenceScore": 1.0,
                        "isNegated": false
                    },
                    {
                        "offset": 27,
                        "length": 9,
                        "text": "ibuprofen",
                        "category": "MedicationName",
                        "confidenceScore": 1.0,
                        "isNegated": false,
                        "links": [
                            {
                                "dataSource": "UMLS",
                                "id": "C0020740"
                            },
                            {
                                "dataSource": "AOD",
                                "id": "0000019879"
                            },
                            {
                                "dataSource": "ATC",
                                "id": "M01AE01"
                            },
                            {
                                "dataSource": "CCPSS",
                                "id": "0046165"
                            },
                            {
                                "dataSource": "CHV",
                                "id": "0000006519"
                            },
                            {
                                "dataSource": "CSP",
                                "id": "2270-2077"
                            },
                            {
                                "dataSource": "DRUGBANK",
                                "id": "DB01050"
                            },
                            {
                                "dataSource": "GS",
                                "id": "1611"
                            },
                            {
                                "dataSource": "LCH_NW",
                                "id": "sh97005926"
                            },
                            {
                                "dataSource": "LNC",
                                "id": "LP16165-0"
                            },
                            {
                                "dataSource": "MEDCIN",
                                "id": "40458"
                            },
                            {
                                "dataSource": "MMSL",
                                "id": "d00015"
                            },
                            {
                                "dataSource": "MSH",
                                "id": "D007052"
                            },
                            {
                                "dataSource": "MTHSPL",
                                "id": "WK2XYI10QM"
                            },
                            {
                                "dataSource": "NCI",
                                "id": "C561"
                            },
                            {
                                "dataSource": "NCI_CTRP",
                                "id": "C561"
                            },
                            {
                                "dataSource": "NCI_DCP",
                                "id": "00803"
                            },
                            {
                                "dataSource": "NCI_DTP",
                                "id": "NSC0256857"
                            },
                            {
                                "dataSource": "NCI_FDA",
                                "id": "WK2XYI10QM"
                            },
                            {
                                "dataSource": "NCI_NCI-GLOSS",
                                "id": "CDR0000613511"
                            },
                            {
                                "dataSource": "NDDF",
                                "id": "002377"
                            },
                            {
                                "dataSource": "PDQ",
                                "id": "CDR0000040475"
                            },
                            {
                                "dataSource": "RCD",
                                "id": "x02MO"
                            },
                            {
                                "dataSource": "RXNORM",
                                "id": "5640"
                            },
                            {
                                "dataSource": "SNM",
                                "id": "E-7772"
                            },
                            {
                                "dataSource": "SNMI",
                                "id": "C-603C0"
                            },
                            {
                                "dataSource": "SNOMEDCT_US",
                                "id": "387207008"
                            },
                            {
                                "dataSource": "USP",
                                "id": "m39860"
                            },
                            {
                                "dataSource": "USPMG",
                                "id": "MTHU000060"
                            },
                            {
                                "dataSource": "VANDF",
                                "id": "4017840"
                            }
                        ]
                    },
                    {
                        "offset": 37,
                        "length": 11,
                        "text": "twice daily",
                        "category": "Frequency",
                        "confidenceScore": 1.0,
                        "isNegated": false
                    }
                ],
                "relations": [
                    {
                        "relationType": "DosageOfMedication",
                        "bidirectional": false,
                        "source": "#/results/documents/0/entities/0",
                        "target": "#/results/documents/0/entities/1"
                    },
                    {
                        "relationType": "FrequencyOfMedication",
                        "bidirectional": false,
                        "source": "#/results/documents/0/entities/2",
                        "target": "#/results/documents/0/entities/1"
                    }
                ],
                "warnings": []
            }
        ],
        "errors": [],
        "modelVersion": "2020-09-03"
    }
}
```


### Structure the API request for the container

You can [use Postman](text-analytics-how-to-call-api.md#set-up-a-request-in-postman) or the example cURL request below to submit a query to the container you deployed, replacing the `serverURL` variable with the appropriate value.  Note the version of the API in the URL for the container is different than the hosted API.

```bash
curl -X POST 'http://<serverURL>:5000/text/analytics/v3.2-preview.1/entities/health' --header 'Content-Type: application/json' --header 'accept: application/json' --data-binary @example.json

```

The following JSON is an example of a JSON file attached to the Text Analytics for health API request's POST body:

```json
example.json

{
  "documents": [
    {
      "language": "en",
      "id": "1",
      "text": "Patient reported itchy sores after swimming in the lake."
    },
    {
      "language": "en",
      "id": "2",
      "text": "Prescribed 50mg benadryl, taken twice daily."
    }
  ]
}
```

### Container response body

The following JSON is an example of the Text Analytics for health API response body from the containerized synchronous call:

```json
{
    "documents": [
        {
            "id": "1",
            "entities": [
                {
                    "id": "0",
                    "offset": 17,
                    "length": 11,
                    "text": "itchy sores",
                    "category": "SymptomOrSign",
                    "confidenceScore": 1.0,
                    "isNegated": false
                }
            ]
        },
        {
            "id": "2",
            "entities": [
                {
                    "id": "0",
                    "offset": 11,
                    "length": 4,
                    "text": "50mg",
                    "category": "Dosage",
                    "confidenceScore": 1.0,
                    "isNegated": false
                },
                {
                    "id": "1",
                    "offset": 16,
                    "length": 8,
                    "text": "benadryl",
                    "category": "MedicationName",
                    "confidenceScore": 1.0,
                    "isNegated": false,
                    "links": [
                        {
                            "dataSource": "UMLS",
                            "id": "C0700899"
                        },
                        {
                            "dataSource": "CHV",
                            "id": "0000044903"
                        },
                        {
                            "dataSource": "MMSL",
                            "id": "899"
                        },
                        {
                            "dataSource": "MSH",
                            "id": "D004155"
                        },
                        {
                            "dataSource": "NCI",
                            "id": "C300"
                        },
                        {
                            "dataSource": "NCI_DTP",
                            "id": "NSC0033299"
                        },
                        {
                            "dataSource": "PDQ",
                            "id": "CDR0000039163"
                        },
                        {
                            "dataSource": "PSY",
                            "id": "05760"
                        },
                        {
                            "dataSource": "RXNORM",
                            "id": "203457"
                        }
                    ]
                },
                {
                    "id": "2",
                    "offset": 32,
                    "length": 11,
                    "text": "twice daily",
                    "category": "Frequency",
                    "confidenceScore": 1.0,
                    "isNegated": false
                }
            ],
            "relations": [
                {
                    "relationType": "DosageOfMedication",
                    "bidirectional": false,
                    "source": "#/documents/1/entities/0",
                    "target": "#/documents/1/entities/1"
                },
                {
                    "relationType": "FrequencyOfMedication",
                    "bidirectional": false,
                    "source": "#/documents/1/entities/2",
                    "target": "#/documents/1/entities/1"
                }
            ]
        }
    ],
    "errors": [],
    "modelVersion": "2020-07-24"
}
```

### Negation detection output

When using negation detection, in some cases a single negation term may address several terms at once. The negation of a recognized entity is represented in the JSON output by the boolean value of the `isNegated` flag:

```json
{
  "id": "2",
  "offset": 90,
  "length": 10,
  "text": "chest pain",
  "category": "SymptomOrSign",
  "score": 0.9972,
  "isNegated": true,
  "links": [
    {
      "dataSource": "UMLS",
      "id": "C0008031"
    },
    {
      "dataSource": "CHV",
      "id": "0000023593"
    },
    ...
```

### Relation extraction output

Relation extraction output contains URI references to the *source* of the relation, and its *target*. Entities with relation role of `ENTITY` are assigned to the `target` field. Entities with relation role of `ATTRIBUTE` are assigned to the `source` field. Abbreviation relations contain bidirectional `source` and `target` fields, and `bidirectional` will be set to `true`. 

```json
"relations": [
                {
                    "relationType": "DosageOfMedication",
                    "bidirectional": false,
                    "source": "#/documents/1/entities/0",
                    "target": "#/documents/1/entities/1"
                },
                {
                    "relationType": "FrequencyOfMedication",
                    "bidirectional": false,
                    "source": "#/documents/1/entities/2",
                    "target": "#/documents/1/entities/1"
                }
            ]
  },
...
]
```

## See also

* [Text Analytics overview](../overview.md)
* [Named Entity categories](../named-entity-types.md)
* [What's new](../whats-new.md)
