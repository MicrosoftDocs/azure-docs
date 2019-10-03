---
title: "Quickstart: Train a model and extract form data using the REST API with Python - Form Recognizer"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll use the Form Recognizer REST API with Python to train a model and extract data from forms.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: quickstart
ms.date: 10/03/2019
ms.author: pafarley
#Customer intent: As a developer or data scientist familiar with Python, I want to learn how to use Form Recognizer to extract my form data.
---

# Quickstart: Train a Form Recognizer model and extract form data by using the REST API with Python

In this quickstart, you'll use the Azure Form Recognizer REST API with Python to train and score forms to extract key-value pairs and tables.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites
To complete this quickstart, you must have:
- Access to the Form Recognizer limited-access preview. To get access to the preview, fill out and submit the [Form Recognizer access request](https://aka.ms/FormRecognizerRequestAccess) form.
- [Python](https://www.python.org/downloads/) installed (if you want to run the sample locally).
- A set of at least five forms of the same type. You will use this data to train the model. You can use a [sample data set](https://go.microsoft.com/fwlink/?linkid=2090451) for this quickstart. Upload the data to the root of a blob storage container in an Azure Storage account.

## Create a Form Recognizer resource

[!INCLUDE [create resource](../includes/create-resource.md)]

## Train a Form Recognizer model

First, you'll need a set of training data in an Azure Storage blob container. You should have a minimum of five filled-in forms (PDF documents and/or images) of the same type/structure as your main input data. Or, you can use a single empty form with two filled-in forms. The empty form's file name needs to include the word "empty." See [Build a training data set for a custom model](../build-training-data-set.md) for tips and options for putting together your training data.

To train a Form Recognizer model with the documents in your Azure blob container, call the **Train** API by running the following python code. Before you run the code, make these changes:

1. Replace `<SAS URL>` with the Azure Blob storage container's shared access signature (SAS) URL. To retrieve the SAS URL, open the Microsoft Azure Storage Explorer, right-click your container, and select **Get shared access signature**. Make sure the **Read** and **List** permissions are checked, and click **Create**. Then copy the value in the **URL** section. It should have the form: `https://<storage account>.blob.core.windows.net/<container name>?<SAS value>`.
1. Replace `<Subscription key>` with the subscription key you copied from the previous step.
1. Replace `<Endpoint>` with the endpoint URL for your Form Recognizer resource.

    ```python
    ########### Python Form Recognizer Train #############
    import http.client, urllib.request, urllib.parse, urllib.error, base64

    # Endpoint URL
    source = r"<SAS URL>"
    headers = {
        # Request headers
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': '<Subscription Key>',
    }
    body = {"source": source}
    try:
        conn = http.client.HTTPSConnection('<Endpoint>')
        conn.request("POST", "/formrecognizer/v1.0-preview/custom/models", body, headers)
        response = conn.getresponse()
        data = response.read()
        operationURL = "" + response.getheader("Location")
        print ("Location header: " + operationURL)
        conn.close()
    except Exception as e:
        print(str(e))
    ```
1. Save the code in a file with a .py extension. For example, *form-recognize-train.py*.
1. Open a command prompt window.
1. At the prompt, use the `python` command to run the sample. For example, `python form-recognize-train.py`.

## Get the training result

After you've started the train operation, you use the returned ID to get the status of the operation. Add the following code to the bottom of your Python script. This extracts the ID value from the training call and passes it to a new API call. The training operation is asynchronous, so this script calls the API at regular intervals until the results are available. We recommend an interval of one second or more.

```python 
operationId = operationURL.split("operations/")[1]

conn = http.client.HTTPSConnection('<Endpoint>')
while True:
    try:
        conn.request("GET", f"/formrecognizer/v1.0-preview/custom/models/{operationId}", "", headers)
        responseString = conn.getresponse().read().decode('utf-8')
        responseDict = json.loads(responseString)
        conn.close()
        print(responseString)
        if 'status' in responseDict and responseDict['status'] not in ['creating','created']:
            break
        time.sleep(1)
    except Exception as e:
        print(e)
        exit()
```

When the training process is completed, you'll receive a `200 (Success)` response with JSON content like the following:

```json
{
  "modelId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "status": "creating",
  "createdDateTime": "2019-10-01T17:23:58.793Z",
  "lastUpdatedDateTime": "2019-10-01T17:23:58.793Z",
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

## Extract key-value pairs and tables from forms

Next, you'll use your trained model to analyze a document and extract key-value pairs and tables from it. Call the **Model - Analyze** API by running the following code in a new Python script. Before you run the script, make these changes:

1. Replace `<path to your form>` with the file path of your form (for example, C:\temp\file.pdf).
1. Replace `<modelID>` with the model ID you received in the previous section.
1. Replace `<Endpoint>` with the endpoint that you obtained with your Form Recognizer subscription key. You can find it on your Form Recognizer resource **Overview** tab.
1. Replace `<file type>` with the file type. Supported types: `application/pdf`, `image/jpeg`, `image/png`.
1. Replace `<subscription key>` with your subscription key.

    ```python
    ########### Python Form Recognizer Analyze #############
    import http.client, urllib.request, urllib.parse, urllib.error, base64
    
    # Endpoint URL
    file_path = r"<path to your form>"
    model_id = "<modelID>"
    headers = {
        # Request headers
        'Content-Type': '<file type>',
        'Ocp-Apim-Subscription-Key': '<subscription key>',
    }

    try:
        with open(file_path, "rb") as f:
            data_bytes = f.read()  
        body = data_bytes
        conn = http.client.HTTPSConnection('<Endpoint>')
        conn.request("POST", "/formrecognizer/v1.0-preview/custom/models/" + model_id + "/analyze", body, headers)
        response = conn.getresponse()
        data = response.read()
        operationURL = "" + response.getheader("Location")
        print ("Location header: " + operationURL)
        conn.close()
    except Exception as e:
        print(str(e))
    ```

1. Save the code in a file with a .py extension. For example, *form-recognize-analyze.py*.
1. Open a command prompt window.
1. At the prompt, use the `python` command to run the sample. For example, `python form-recognize-analyze.py`.

## Get the Analyze results

After you've started the Analyze operation, you use the returned ID to get the status of the operation. Add the following code to the bottom of your Python script. This extracts the ID value from the call and passes 
it to a new API call. The Analyze operation is asynchronous, so this script calls the API at regular intervals until the results are available. We recommend an interval of one second or more.

```python 
operationId = operationURL.split("operations/")[1]

conn = http.client.HTTPSConnection('<Endpoint>')
while True:
    try:
        conn.request("GET", "/formrecognizer/v1.0-preview/custom/models/" + model_id + "/analyzeResults/" + operationId, "", headers)
        responseString = conn.getresponse().read().decode('utf-8')
        responseDict = json.loads(responseString)
        conn.close()
        print(responseString)
        if 'status' in responseDict and responseDict['status'] not in ['notStarted','running']:
            break
        time.sleep(1)
    except Exception as e:
        print(e)
        exit()
```

When the process is completed, you'll receive a `200 (Success)` response with JSON content like the following:

```bash
{
  "status": "succeeded",
  "createdDateTime": "2019-10-02T22:45:48.418Z",
  "lastUpdatedDateTime": "2019-10-02T22:45:48.418Z",
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
            "valueDate": "2019-10-02",
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
            "valueDate": "2019-10-02",
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
            "valueDate": "2019-10-02",
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

In this quickstart, you used the Form Recognizer REST API with Python to train a model and run it in a sample scenario. Next, see the reference documentation to explore the Form Recognizer API in more depth.

> [!div class="nextstepaction"]
> [REST API reference documentation](https://aka.ms/form-recognizer/api)
