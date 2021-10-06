---
title: Form Recognizer general document model
titleSuffix: Azure Applied AI Services
description: Concepts encompassing data extraction and analysis using prebuilt general document model
author: vkurpad
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 10/05/2021
ms.author: lajanuar
recommendations: false
---
<!-- markdownlint-disable MD033 -->

# Form Recognizer general document model

General document is a new capability in Form Recognizer that uses a pre-trained model to extract key value pairs and entities from documents. If you are looking for general key value pairs in documents, you no longer need to train a custom model. Analyze the document with general document to extract most key value pairs.

Benefits of general document
1.	No need to train a custom model to extract key value pairs
2.	Single API to extract key value pairs, entities, text, tables and structure from documents
3.	Pre-trained model that will be periodically trained on new data to improve coverage and accuracy
4.	Supports structured, semi-structured and unstructured documents


## Using general document

General document is only released in the v3.0(preview) API. For more information on using the v3.0(preview) API, see [the migration guide](v3-migration-guide.md).

General document is a pre-trained model and can be directly invoked via the REST API. 

### General document model data extraction

| **Model**   | **Text extraction** |**Key-Value pairs** |**Selection Marks**   | **Tables**   |**Entities** |
| --- | :---: |:---:| :---: | :---: |:---: |
|General document  | ✓  |  ✓ | ✓  | ✓  | ✓  |



```json
POST https://{host}/formrecognizer/documentModels/prebuilt-document:analyze?api-version=2021-09-30-preview
body = { 
    "urlSource": "{documentURL}"
    }
```
The response contains a `Operation-Location` header with the value of endpoint to query for the results.

Sample Get analyze results (value of `Operation-Location`) 

```json
https://{host}.cognitiveservices.azure.com/formrecognizer/documentModels/prebuilt-document/analyzeResults/{request_id}?api-version=2021-09-30-preview

```
Sample response 

```json
{
    "status": "succeeded",
    "createdDateTime": "2021-09-28T16:52:51Z",
    "lastUpdatedDateTime": "2021-09-28T16:53:08Z",
    "analyzeResult": {
        "apiVersion": "2021-09-30-preview",
        "modelId": "prebuilt-document",
        "stringIndexType": "textElements",
        "content": "content extracted",
        "pages": [
            {
                "pageNumber": 1,
                "angle": 0,
                "width": 8.4722,
                "height": 11,
                "unit": "inch",
                "words": [
                    {
                        "content": "Case",
                        "boundingBox": [
                            1.3578,
                            0.2244,
                            1.7328,
                            0.2244,
                            1.7328,
                            0.3502,
                            1.3578,
                            0.3502
                        ],
                        "confidence": 1,
                        "span": {
                            "offset": 0,
                            "length": 4
                        }
                    }

                ],
                "lines": [
                    {
                        "content": "Case",
                        "boundingBox": [
                            1.3578,
                            0.2244,
                            3.2879,
                            0.2244,
                            3.2879,
                            0.3502,
                            1.3578,
                            0.3502
                        ],
                        "spans": [
                            {
                                "offset": 0,
                                "length": 22
                            }
                        ]
                    }
                ]
            }
           
        ],
        "tables": [
            {
                "rowCount": 8,
                "columnCount": 3,
                "cells": [
                    {
                        "kind": "columnHeader",
                        "rowIndex": 0,
                        "columnIndex": 0,
                        "rowSpan": 1,
                        "columnSpan": 1,
                        "content": "Applicant's Name:",
                        "boundingRegions": [
                            {
                                "pageNumber": 1,
                                "boundingBox": [
                                    1.9198,
                                    4.277,
                                    3.3621,
                                    4.2715,
                                    3.3621,
                                    4.5034,
                                    1.9198,
                                    4.5089
                                ]
                            }
                        ],
                        "spans": [
                            {
                                "offset": 578,
                                "length": 17
                            }
                        ]
                    }
                ],
                "spans": [
                    {
                        "offset": 578,
                        "length": 300
                    },
                    {
                        "offset": 1358,
                        "length": 10
                    }
                ]
            }
        ],
        "keyValuePairs": [
            {
                "key": {
                    "content": "Case",
                    "boundingRegions": [
                        {
                            "pageNumber": 1,
                            "boundingBox": [
                                1.3578,
                                0.2244,
                                1.7328,
                                0.2244,
                                1.7328,
                                0.3502,
                                1.3578,
                                0.3502
                            ]
                        }
                    ],
                    "spans": [
                        {
                            "offset": 0,
                            "length": 4
                        }
                    ]
                },
                "value": {
                    "content": "A Case",
                    "boundingRegions": [
                        {
                            "pageNumber": 1,
                            "boundingBox": [
                                1.8026,
                                0.2276,
                                3.2879,
                                0.2276,
                                3.2879,
                                0.3502,
                                1.8026,
                                0.3502
                            ]
                        }
                    ],
                    "spans": [
                        {
                            "offset": 5,
                            "length": 17
                        }
                    ]
                },
                "confidence": 0.867
            }
        ],
        "entities": [
            {
                "category": "Person",
                "content": "Jim Smith",
                "boundingRegions": [
                    {
                        "pageNumber": 1,
                        "boundingBox": [
                            3.4672,
                            4.3255,
                            5.7118,
                            4.3255,
                            5.7118,
                            4.4783,
                            3.4672,
                            4.4783
                        ]
                    }
                ],
                "confidence": 0.93,
                "spans": [
                    {
                        "offset": 596,
                        "length": 21
                    }
                ]
            }
        ],
        "styles": [
            {
                "isHandwritten": true,
                "confidence": 0.95,
                "spans": [
                    {
                        "offset": 565,
                        "length": 12
                    },
                    {
                        "offset": 3493,
                        "length": 1
                    }
                ]
            }
        ]
    }
}

```

## Scenarios

General document is ideal for when specific, common key value pairs need to be extracted from a document. For example, you need to extract the customer ID from all orders to determine how to route the order.

Knowledge mining is another scenario where general document can help infer context from a large corpus of documents by extracting key value pairs. Validating the values with extracted entities and associated types could further improve the experience.

## Considerations

Extracting entities can be useful in scenarios where you want to validate extracted values. The entities are extracted on the entire contents of the documents and not just the extracted values.

Keys are spans of text extracted from the document, for semi structured documents, keys may need to be mapped to an existing dictionary of keys.

Expect to see key value pairs with a key, but no value. For example if a user chose to not provide an email address on the form.

## Next steps

Learn more about the Form Recognizer client library by exploring our API reference documentation.

> [!div class="nextstepaction"]
> [Form Recognizer API reference](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm)

> [Try general document in the Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio)
