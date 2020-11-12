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
ms.date: 08/06/2020
ms.author: aahi
---

# How to: Use Text Analytics for health (preview)

> [!NOTE]
> The Text Analytics for health container has recently updated. See [What's new](../whats-new.md) for more information on recent changes. Remember to pull the latest container to use the updates listed.

> [!IMPORTANT] 
> Text Analytics for health is a preview capability provided “AS IS” and “WITH ALL FAULTS.” As such, **Text Analytics for health (preview) should not be implemented or deployed in any production use.** 
Text Analytics for health is not intended or made available for use as a medical device, clinical support, diagnostic tool, or other technology intended to be used in the diagnosis, cure, mitigation, treatment, or prevention of disease or other conditions, and no license or right is granted by Microsoft to use this capability for such purposes. This capability is not designed or intended to be implemented or deployed as a substitute for professional medical advice or healthcare opinion, diagnosis, treatment, or the clinical judgment of a healthcare professional, and should not be used as such. The customer is solely responsible for any use of Text Analytics for health. Microsoft does not warrant that Text Analytics for health or any materials provided in connection with the capability will be sufficient for any medical purposes or otherwise meet the health or medical requirements of any person. 


Text Analytics for health is a containerized service that extracts and labels relevant medical information from unstructured texts such as doctor's notes, discharge summaries, clinical documents, and electronic health records.  

## Features

The Text Analytics for health container currently performs Named Entity Recognition (NER), relation extraction, entity negation and entity linking for English-language text in your own development environment that meets your specific security and data governance requirements.

#### [Named Entity Recognition](#tab/ner)

Named Entity Recognition detects words and phrases mentioned in unstructured text that can be associated with one or more semantic types, such as diagnosis, medication name, symptom/sign, or age.

> [!div class="mx-imgBorder"]
> ![Health NER](../media/ta-for-health/health-named-entity-recognition.png)

#### [Relation Extraction](#tab/relation-extraction)

Relation extraction identifies meaningful connections between concepts mentioned in text. For example, a "time of condition" relation is found by associating a condition name with a time. 

> [!div class="mx-imgBorder"]
> ![Health RE](../media/ta-for-health/health-relation-extraction.png)


#### [Entity Linking](#tab/entity-linking)

Entity Linking disambiguates distinct entities by associating named entities mentioned in text to concepts found in a predefined database of concepts. For example, the Unified Medical Language System (UMLS).

> [!div class="mx-imgBorder"]
> ![Health EL](../media/ta-for-health/health-entity-linking.png)

Text Analytics for health supports linking to the health and biomedical vocabularies found in the Unified Medical Language System ([UMLS](https://www.nlm.nih.gov/research/umls/sourcereleasedocs/index.html)) Metathesaurus Knowledge Source.

#### [Negation Detection](#tab/negation-detection) 

The meaning of medical content is highly affected by modifiers such as negation, which can have critical implication if misdiagnosed. Text Analytics for health supports negation detection for the different entities mentioned in the text. 

> [!div class="mx-imgBorder"]
> ![Health NEG](../media/ta-for-health/health-negation.png)

---

See the [entity categories](../named-entity-types.md?tabs=health) returned by Text Analytics for health for a full list of supported entities.

## Supported languages

Text Analytics for health only supports English language documents.

## Request access to the public preview

Fill out and submit the [Cognitive Services request form](https://aka.ms/csgate) to request access to the Text Analytics for health public preview. You will not be billed for Text Analytics for health usage. 

[Instructions to download and install container](../how-tos/text-analytics-how-to-install-containers.md?tabs=healthcare)

[!INCLUDE [Authenticate to the container registry](../../../../includes/cognitive-services-containers-access-registry.md)]


## Example API request for the container

Use the example cURL request below to submit a query to the hosted web API you have deployed replacing the `serverURL` variable with the appropriate value.  Please note the version of the API in the URL

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

## API response body

The following JSON is an example of the Text Analytics for health API response body:

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
