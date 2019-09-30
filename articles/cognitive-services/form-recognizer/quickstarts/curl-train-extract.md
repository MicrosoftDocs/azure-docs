---
title: "Quickstart: Train a model and extract form data using cURL - Form Recognizer"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll use the Form Recognizer REST API with cURL to train a model and extract data from forms.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: quickstart
ms.date: 07/03/2019
ms.author: pafarley
#Customer intent: As a developer or data scientist familiar with cURL, I want to learn how to use Form Recognizer to extract my form data.
---

# Quickstart: Train a Form Recognizer model and extract form data by using the REST API with cURL

In this quickstart, you'll use the Azure Form Recognizer REST API with cURL to train and score forms to extract key-value pairs and tables.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites
To complete this quickstart, you must have:
- Access to the Form Recognizer limited-access preview. To get access to the preview, fill out and submit the [Form Recognizer access request](https://aka.ms/FormRecognizerRequestAccess) form.
- [cURL](https://curl.haxx.se/windows/) installed.
- A set of at least five forms of the same type. You will use this data to train the model. You can use a [sample data set](https://go.microsoft.com/fwlink/?linkid=2090451) for this quickstart. Upload the data to the root of a blob storage container in an Azure Storage account.

## Create a Form Recognizer resource

[!INCLUDE [create resource](../includes/create-resource.md)]

## Train a Form Recognizer model

First, you'll need a set of training data in an Azure Storage blob. You should have a minimum of five filled-in forms (PDF documents and/or images) of the same type/structure as your main input data. Or, you can use a single empty form with two filled-in forms. The empty form's file name needs to include the word "empty." See [Build a training data set for a custom model](../build-training-data-set.md) for tips and options for putting together your training data.

To train a Form Recognizer model with the documents in your Azure blob container, call the **Train** API by running the following cURL command. Before you run the command, make these changes:

1. Replace `<Endpoint>` with the endpoint that you obtained with your Form Recognizer subscription key. You can find it on your Form Recognizer resource **Overview** tab.
1. Replace `<subscription key>` with the subscription key you copied from the previous step.
1. Replace `<SAS URL>` with the Azure Blob storage container's shared access signature (SAS) URL. To retrieve the SAS URL, open the Microsoft Azure Storage Explorer, right-click your container, and select **Get shared access signature**. Make sure the **Read** and **List** permissions are checked, and click **Create**. Then copy the value in the **URL** section. It should have the form: `https://<storage account>.blob.core.windows.net/<container name>?<SAS value>`.

```bash
curl -X POST "https://<Endpoint>/formrecognizer/v1.0-preview/custom/models" -H "Content-Type: application/json" -H "Ocp-Apim-Subscription-Key: <subscription key>" --data-ascii "{ \"source\": \""<SAS URL>"\"}"
```

You'll receive a `201 (Success)` response with a **Location** header. The value of this header is the ID of the new model being trained. Pass this model ID into a new call to check the training status:

```bash
curl -X GET "https://<Endpoint>/formrecognizer/v1.0-preview/custom/models/<model ID>" -H "Content-Type: application/json" -H "Ocp-Apim-Subscription-Key: <subscription key>"
```

You'll receive a `200 (Success)` response with a JSON body in the following format. 

```json
{
  "modelId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "status": "creating",
  "createdDateTime": "2019-09-30T20:34:21.534Z",
  "lastUpdatedDateTime": "2019-09-30T20:34:21.534Z",
  "keys": {
    "clusters": {
      "additionalProp1": [
        "string"
      ],
      "additionalProp2": [
        "string"
      ],
      "additionalProp3": [
        "string"
      ]
    }
  },
  "trainResult": {
    "trainingDocuments": [
      {
        "documentName": "string",
        "pages": 0,
        "errors": [
          "string"
        ],
        "status": "succeeded"
      }
    ],
    "trainingFields": {
      "fields": [
        {
          "fieldName": "string",
          "accuracy": 0
        }
      ],
      "averageModelAccuracy": 0
    },
    "errors": [
      {
        "errorMessage": "string"
      }
    ]
  }
}
```

When the `"status"` value under each `"trainingDocuments"` entry is `"succeeded"`, then you are ready to query your model.

## Extract key-value pairs and tables from forms

Next, you'll analyze a document and extract key-value pairs and tables from it. Call the **Model - Analyze** API by running the cURL command that follows. Before you run the command, make these changes:

1. Replace `<Endpoint>` with the endpoint that you obtained from your Form Recognizer subscription key. You can find it on your Form Recognizer resource **Overview** tab.
1. Replace `<model ID>` with the model ID that you received in the previous section.
1. Replace `<path to your form>` with the file path of your form (for example, C:\temp\file.pdf).
1. Replace `<file type>` with the file type. Supported types: `application/pdf`, `image/jpeg`, `image/png`.
1. Replace `<subscription key>` with your subscription key.


```bash
curl -X POST "https://<Endpoint>/formrecognizer/v1.0-preview/custom/models/<model ID>/analyze" -H "Content-Type: multipart/form-data" -F "form=@\"<path to your form>\";type=<file type>" -H "Ocp-Apim-Subscription-Key: <subscription key>"
```

You'll receive a `201 (Success)` response with a **Location** header. The value of this header is an ID to track the result of the Analyze operation. Save this result ID for the next step.

### Get the Analyze results

Use the following API to query the results of the Analyze operation.

```bash
curl -X GET "https://<Endpoint>/formrecognizer/v1.0-preview/custom/models/<model ID>/analyzeResults/<result ID>" -H "Ocp-Apim-Subscription-Key: <subscription key>"
```

You'll receive a `200 (Success)` response with a JSON body in the following format. 

```bash
{
  "status": "notStarted",
  "createdDateTime": "2019-09-30T20:57:43.820Z",
  "lastUpdatedDateTime": "2019-09-30T20:57:43.820Z",
  "analyzeResult": {
    "version": "string",
    "readResults": [
      {
        "page": 0,
        "angle": 0,
        "width": 0,
        "height": 0,
        "unit": "pixel",
        "language": "en",
        "lines": [
          {
            "text": "string",
            "boundingBox": [
              0
            ],
            "language": "en",
            "words": [
              {
                "text": "string",
                "boundingBox": [
                  0
                ],
                "confidence": 0
              }
            ]
          }
        ]
      }
    ],
    "pageResults": [
      {
        "page": 0,
        "clusterId": 0,
        "keyValuePairs": [
          {
            "key": {
              "text": "string",
              "boundingBox": [
                0
              ],
              "elements": [
                "string"
              ],
              "words": [
                {
                  "text": "string",
                  "boundingBox": [
                    0
                  ],
                  "confidence": 0
                }
              ]
            },
            "value": {
              "text": "string",
              "boundingBox": [
                0
              ],
              "elements": [
                "string"
              ],
              "words": [
                {
                  "text": "string",
                  "boundingBox": [
                    0
                  ],
                  "confidence": 0
                }
              ]
            },
            "confidence": 0
          }
        ],
        "tables": [
          {
            "rows": 0,
            "columns": 0,
            "cells": [
              {
                "rowIndex": 0,
                "columnIndex": 0,
                "rowSpan": 0,
                "columnSpan": 0,
                "text": "string",
                "boundingBox": [
                  0
                ],
                "confidence": 0,
                "elements": [
                  "string"
                ],
                "words": [
                  {
                    "text": "string",
                    "boundingBox": [
                      0
                    ],
                    "confidence": 0
                  }
                ],
                "isHeader": false,
                "isFooter": false
              }
            ]
          }
        ]
      }
    ],
    "documentResults": [
      {
        "docType": "string",
        "pageRange": [
          0
        ],
        "fields": {
          "additionalProp1": {
            "type": "string",
            "valueString": "string",
            "valueDate": "2019-09-30",
            "valueTime": "string",
            "valuePhoneNumber": "string",
            "valueNumber": 0,
            "valueInteger": 0,
            "valueArray": [
              null
            ],
            "valueObject": {},
            "text": "string",
            "boundingBox": [
              0
            ],
            "confidence": 0,
            "elements": [
              "string"
            ]
          },
          "additionalProp2": {
            "type": "string",
            "valueString": "string",
            "valueDate": "2019-09-30",
            "valueTime": "string",
            "valuePhoneNumber": "string",
            "valueNumber": 0,
            "valueInteger": 0,
            "valueArray": [
              null
            ],
            "valueObject": {},
            "text": "string",
            "boundingBox": [
              0
            ],
            "confidence": 0,
            "elements": [
              "string"
            ]
          },
          "additionalProp3": {
            "type": "string",
            "valueString": "string",
            "valueDate": "2019-09-30",
            "valueTime": "string",
            "valuePhoneNumber": "string",
            "valueNumber": 0,
            "valueInteger": 0,
            "valueArray": [
              null
            ],
            "valueObject": {},
            "text": "string",
            "boundingBox": [
              0
            ],
            "confidence": 0,
            "elements": [
              "string"
            ]
          }
        }
      }
    ],
    "errors": [
      {
        "errorMessage": "string"
      }
    ]
  }
}
```

## Next steps

In this quickstart, you used the Form Recognizer REST API with cURL to train a model and run it in a sample scenario. Next, see the reference documentation to explore the Form Recognizer API in more depth.

> [!div class="nextstepaction"]
> [REST API reference documentation](https://aka.ms/form-recognizer/api)
