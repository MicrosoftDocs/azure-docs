---
title: "Quickstart: Train with labels using the REST API and Python - Form Recognizer"
titleSuffix: Azure Cognitive Services
description: Learn how to use the Form Recognizer labeled data feature with the REST API and Python to train a custom model.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: quickstart
ms.date: 05/27/2020
ms.author: pafarley
ms.custom: tracking-python
---

# Train a Form Recognizer model with labels using REST API and Python

In this quickstart, you'll use the Form Recognizer REST API with Python to train a custom model with manually labeled data. See the [Train with labels](../overview.md#train-with-labels) section of the overview to learn more about this feature.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

To complete this quickstart, you must have:
- [Python](https://www.python.org/downloads/) installed (if you want to run the sample locally).
- A set of at least six forms of the same type. You'll use this data to train the model and test a form. You can use a [sample data set](https://go.microsoft.com/fwlink/?linkid=2090451) for this quickstart. Upload the training files to the root of a blob storage container in an Azure Storage account.

> [!NOTE]
> This quickstart uses remote documents accessed by URL. To use local files instead, see the [reference documentation](https://westus2.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-preview/operations/TrainCustomModelAsync).

## Create a Form Recognizer resource

[!INCLUDE [create resource](../includes/create-resource.md)]

## Set up training data

Next you'll need to set up the required input data. The labeled data feature has special input requirements beyond what's needed to train a custom model without labels.

Make sure all the training documents are of the same format. If you have forms in multiple formats, organize them into sub-folders based on common format. When you train, you'll need to direct the API to a sub-folder.

In order to train a model using labeled data, you'll need the following files as inputs in the sub-folder. You will learn how to create these file below.

* **Source forms** – the forms to extract data from. Supported types are JPEG, PNG, PDF, or TIFF.
* **OCR layout files** - these are JSON files that describe the sizes and positions of all readable text in each source form. You'll use the Form Recognizer Layout API to generate this data. 
* **Label files** - these are JSON files that describe the data labels that a user has entered manually.

All of these files should occupy the same sub-folder and be in the following format:

* input_file1.pdf 
* input_file1.pdf.ocr.json
* input_file1.pdf.labels.json 
* input_file2.pdf 
* input_file2.pdf.ocr.json
* input_file2.pdf.labels.json
* ...

> [!TIP]
> When you label forms using the Form Recognizer [sample labeling tool](./label-tool.md), the tool creates these label and OCR layout files automatically.

### Create the OCR output files

You need OCR result files in order for the service to consider the corresponding input files for labeled training. To obtain OCR results for a given source form, follow the steps below:

1. Call the **[Analyze Layout](https://westus2.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-preview/operations/AnalyzeLayoutAsync)** API on the read Layout container with the input file as part of the request body. Save the ID found in the response's **Operation-Location** header.
1. Call the **[Get Analyze Layout Result](https://westus2.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-preview/operations/GetAnalyzeLayoutResult)** API, using the operation ID from the previous step.
1. Get the response and write the content to a file. For each source form, the corresponding OCR file should have the original file name appended with `.ocr.json`. The OCR JSON output should have the following format. See the [sample OCR file](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/curl/form-recognizer/Invoice_1.pdf.ocr.json) for a full example. 

    ```json
    {
    "status": "succeeded",
    "createdDateTime": "2019-11-12T21:18:12Z",
    "lastUpdatedDateTime": "2019-11-12T21:18:17Z",
    "analyzeResult": {
        "version": "2.0.0",
        "readResults": [
            {
                "page": 1,
                "language": "en",
                "angle": 0,
                "width": 8.5,
                "height": 11,
                "unit": "inch",
                "lines": [
                    {
                        "language": "en",
                        "boundingBox": [
                            0.5384,
                            1.1583,
                            1.4466,
                            1.1583,
                            1.4466,
                            1.3534,
                            0.5384,
                            1.3534
                        ],
                        "text": "Contoso",
                        "words": [
                            {
                                "boundingBox": [
                                    0.5384,
                                    1.1583,
                                    1.4466,
                                    1.1583,
                                    1.4466,
                                    1.3534,
                                    0.5384,
                                    1.3534
                                ],
                                "text": "Contoso",
                                "confidence": 1
                            }
                        ]
                    },
                    ...
    ```

### Create the label files

Label files contain key-value associations that a user has entered manually. They are needed for labeled data training, but not every source file needs to have a corresponding label file. Source files without labels will be treated as ordinary training documents. We recommend five or more labeled files for reliable training. You can use a UI tool like the [sample labeling tool](./label-tool.md) to generate these files.

When you create a label file, you can optionally specify regions&mdash;exact positions of values on the document. This will give the training even higher accuracy. Regions are formatted as a set of eight values corresponding to four X,Y coordinates: top-left, top-right, bottom-right, and bottom-left. Coordinate values are between zero and one, scaled to the dimensions of the page.

For each source form, the corresponding label file should have the original file name appended with `.labels.json`. The label file should have the following format. See the [sample label file](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/curl/form-recognizer/Invoice_1.pdf.labels.json) for a full example.

```json
{
    "document": "Invoice_1.pdf",
    "labels": [
        {
            "label": "Provider",
            "key": null,
            "value": [
                {
                    "page": 1,
                    "text": "Contoso",
                    "boundingBoxes": [
                        [
                            0.06334117647058823,
                            0.1053,
                            0.17018823529411767,
                            0.1053,
                            0.17018823529411767,
                            0.12303636363636362,
                            0.06334117647058823,
                            0.12303636363636362
                        ]
                    ]
                }
            ]
        },
        {
            "label": "For",
            "key": null,
            "value": [
                {
                    "page": 1,
                    "text": "Microsoft",
                    "boundingBoxes": [
                        [
                            0.6122941176470589,
                            0.1374,
                            0.6841764705882353,
                            0.1374,
                            0.6841764705882353,
                            0.14682727272727272,
                            0.6122941176470589,
                            0.14682727272727272
                        ]
                    ]
                },
                {
                    "page": 1,
                    "text": "1020",
                    "boundingBoxes": [
                        [
                            0.6121882352941176,
                            0.156,
                            0.6462941176470588,
                            0.156,
                            0.6462941176470588,
                            0.1653181818181818,
                            0.6121882352941176,
                            0.1653181818181818
                        ]
                    ]
                },
                ...
```

> [!IMPORTANT]
> You can only apply one label to each text element, and each label can only be applied once per page. You cannot apply a label across multiple pages.


## Train a model using labeled data

To train a model with labeled data, call the **[Train Custom Model](https://westus2.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-preview/operations/TrainCustomModelAsync)** API by running the following python code. Before you run the code, make these changes:

1. Replace `<Endpoint>` with the endpoint URL for your Form Recognizer resource.
1. Replace `<SAS URL>` with the Azure Blob storage container's shared access signature (SAS) URL. To retrieve the SAS URL, open the Microsoft Azure Storage Explorer, right-click your container, and select **Get shared access signature**. Make sure the **Read** and **List** permissions are checked, and click **Create**. Then copy the value in the **URL** section. It should have the form: `https://<storage account>.blob.core.windows.net/<container name>?<SAS value>`.
1. Replace `<Blob folder name>` with the folder name in your blob container where the input data is located. Or, if your data is at the root, leave this blank and remove the `"prefix"` field from the body of the HTTP request.

```python
########### Python Form Recognizer Labeled Async Train #############
import json
import time
from requests import get, post

# Endpoint URL
endpoint = r"<Endpoint>"
post_url = endpoint + r"/formrecognizer/v2.0/custom/models"
source = r"<SAS URL>"
prefix = "<Blob folder name>"
includeSubFolders = False
useLabelFile = True

headers = {
    # Request headers
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '<subsription key>',
}

body =     {
    "source": source,
    "sourceFilter": {
        "prefix": prefix,
        "includeSubFolders": includeSubFolders
    },
    "useLabelFile": useLabelFile
}

try:
    resp = post(url = post_url, json = body, headers = headers)
    if resp.status_code != 201:
        print("POST model failed (%s):\n%s" % (resp.status_code, json.dumps(resp.json())))
        quit()
    print("POST model succeeded:\n%s" % resp.headers)
    get_url = resp.headers["location"]
except Exception as e:
    print("POST model failed:\n%s" % str(e))
    quit() 
```

## Get training results

After you've started the train operation, you use the returned ID to get the status of the operation. Add the following code to the bottom of your Python script. This uses the ID value from the training call in a new API call. The training operation is asynchronous, so this script calls the API at regular intervals until the training status is completed. We recommend an interval of one second or more.

```python 
n_tries = 15
n_try = 0
wait_sec = 5
max_wait_sec = 60
while n_try < n_tries:
    try:
        resp = get(url = get_url, headers = headers)
        resp_json = resp.json()
        if resp.status_code != 200:
            print("GET model failed (%s):\n%s" % (resp.status_code, json.dumps(resp_json)))
            quit()
        model_status = resp_json["modelInfo"]["status"]
        if model_status == "ready":
            print("Training succeeded:\n%s" % json.dumps(resp_json))
            quit()
        if model_status == "invalid":
            print("Training failed. Model is invalid:\n%s" % json.dumps(resp_json))
            quit()
        # Training still running. Wait and retry.
        time.sleep(wait_sec)
        n_try += 1
        wait_sec = min(2*wait_sec, max_wait_sec)     
    except Exception as e:
        msg = "GET model failed:\n%s" % str(e)
        print(msg)
        quit()
print("Train operation did not complete within the allocated time.")
```

When the training process is completed, you'll receive a `201 (Success)` response with JSON content like the following. The response has been shortened for simplicity.

```json
{ 
  "modelInfo":{ 
    "status":"ready",
    "createdDateTime":"2019-10-08T10:20:31.957784",
    "lastUpdatedDateTime":"2019-10-08T14:20:41+00:00",
    "modelId":"1cfb372bab404ba3aa59481ab2c63da5"
  },
  "trainResult":{ 
    "trainingDocuments":[ 
      { 
        "documentName":"invoices\\Invoice_1.pdf",
        "pages":1,
        "errors":[ 

        ],
        "status":"succeeded"
      },
      { 
        "documentName":"invoices\\Invoice_2.pdf",
        "pages":1,
        "errors":[ 

        ],
        "status":"succeeded"
      },
      { 
        "documentName":"invoices\\Invoice_3.pdf",
        "pages":1,
        "errors":[ 

        ],
        "status":"succeeded"
      },
      { 
        "documentName":"invoices\\Invoice_4.pdf",
        "pages":1,
        "errors":[ 

        ],
        "status":"succeeded"
      },
      { 
        "documentName":"invoices\\Invoice_5.pdf",
        "pages":1,
        "errors":[ 

        ],
        "status":"succeeded"
      }
    ],
    "errors":[ 

    ]
  },
  "keys":{ 
    "0":[ 
      "Address:",
      "Invoice For:",
      "Microsoft",
      "Page"
    ]
  }
}
```

Copy the `"modelId"` value for use in the following steps.

[!INCLUDE [analyze forms](../includes/python-custom-analyze.md)]

When the process is completed, you'll receive a `202 (Success)` response with JSON content in the following format. The response has been shortened for simplicity. The main key/value associations are in the `"documentResults"` node. The Layout API results (the content and positions of all the text in the document) are in the `"readResults"` node.

```json
{ 
    "analyzeResult":{ 
      "version":"2.0.0",
      "readResults":[ 
        { 
          "page":1,
          "language":"en",
          "angle":0,
          "width":8.5,
          "height":11,
          "unit":"inch",
          "lines":[ 
            { 
              "language":"en",
              "boundingBox":[ 
                0.5375,
                1.1349,
                2.6064,
                1.1349,
                2.6064,
                1.354,
                0.5375,
                1.354
              ],
              "text":"Contoso Suites",
              "words":[ 
                { 
                  "boundingBox":[ 
                    0.5375,
                    1.1402,
                    1.6595,
                    1.1402,
                    1.6595,
                    1.354,
                    0.5375,
                    1.354
                  ],
                  "text":"Contoso",
                  "confidence":1
                },
                { 
                  "boundingBox":[ 
                    1.758,
                    1.1349,
                    2.6064,
                    1.1349,
                    2.6064,
                    1.3534,
                    1.758,
                    1.3534
                  ],
                  "text":"Suites",
                  "confidence":1
                }
              ]
            },
            ...
          ]
        }
      ],
      "pageResults":[ 
        { 
          "page":1,
          "tables":[ 
            { 
              "rows":2,
              "columns":6,
              "cells":[ 
                { 
                  "rowIndex":0,
                  "columnIndex":0,
                  "text":"Invoice Number",
                  "boundingBox":[ 
                    0.5075,
                    2.8088,
                    1.9061,
                    2.8088,
                    1.9061,
                    3.3219,
                    0.5075,
                    3.3219
                  ],
                  "elements":[ 
                    "#/readResults/0/lines/7/words/0",
                    "#/readResults/0/lines/7/words/1"
                  ]
                },
                { 
                  "rowIndex":0,
                  "columnIndex":1,
                  "text":"Invoice Date",
                  "boundingBox":[ 
                    1.9061,
                    2.8088,
                    3.3074,
                    2.8088,
                    3.3074,
                    3.3219,
                    1.9061,
                    3.3219
                  ],
                  "elements":[ 
                    "#/readResults/0/lines/8/words/0",
                    "#/readResults/0/lines/8/words/1"
                  ]
                },
                ...        
              ]
            }
          ]
        }
      ],
      "documentResults":[ 
        { 
          "docType":"Analyze",
          "pageRange":[ 
            1,
            1
          ],
          "fields":{ 
            "total":{ 
              "type":"string",
              "valueString":"$22,123.24",
              "text":"$22,123.24",
              "boundingBox":[ 
                5.29,
                3.41,
                5.9750000000000009,
                3.41,
                5.9750000000000009,
                3.54,
                5.29,
                3.54
              ],
              "page":1,
              "confidence":1,
              "elements":[ 
                "#/analyzeResult/readResults/0/lines/15/words/0"
              ]
            },
            "invoice #":{ 
              "type":"string",
              "valueString":"7689302",
              "text":"7689302",
              "boundingBox":[ 
                0.54,
                3.41,
                1.065,
                3.41,
                1.065,
                3.515,
                0.54,
                3.515
              ],
              "page":1,
              "confidence":1,
              "elements":[ 
                "#/analyzeResult/readResults/0/lines/12/words/0"
              ]
            },
            "vat":{ 
              "type":"string",
              "valueString":"QR",
              "text":"QR",
              "boundingBox":[ 
                6.2250000000000009,
                3.41,
                6.425,
                3.41,
                6.425,
                3.52,
                6.2250000000000009,
                3.52
              ],
              "page":1,
              "confidence":0.9839357733726502,
              "elements":[ 
                "#/analyzeResult/readResults/0/lines/16/words/0"
              ]
            },
            ...
          }
        }
      ]
    },
    "status":"succeeded",
    "createdDateTime":"2019-11-12T21:26:19+00:00",
    "lastUpdatedDateTime":"2019-11-12T21:27:27.0488571+00:00"
}
```

## Improve results

Examine the `"confidence"` values for each key/value result under the `"documentResults"` node. You should also look at the confidence scores in the `"readResults"` node, which correspond to the Layout operation. The confidence of the layout results does not affect the confidence of the key/value extraction results, so you should check both.
* If the confidence scores for the Layout operation are low, try to improve the quality of your input documents (see [Input requirements](../overview.md#input-requirements)).
* If the confidence scores for the key/value extraction operation are low, ensure that the documents being analyzed are of the same type as documents used in the training set. If the documents in the training set have variations in appearance, consider splitting them into different folders and training one model for each variation.

### Avoid cluttered labels

Sometimes when you apply different labels within the same line of text, the service may merge those labels into one field. For example, in an address, you might label the city, state, and zip code as different fields, but during prediction those fields are not recognized separately.

We understand this scenario is essential for our customers, and we are working on improving this in the future. Currently, we recommend our users to label multiple cluttered fields as one field, and then separate the terms in a post-processing of the extraction results.

## Next steps

In this quickstart, you learned how to use the Form Recognizer REST API with Python to train a model with manually labeled data. Next, see the API reference documentation to explore the Form Recognizer API in more depth.

> [!div class="nextstepaction"]
> [REST API reference documentation](https://westus2.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-preview/operations/AnalyzeWithCustomForm)
