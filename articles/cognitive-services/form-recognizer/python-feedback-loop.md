---
title: "How to use the Feedback Loop REST API with Python - Form Recognizer"
titleSuffix: Azure Cognitive Services
description: Learn how to use the Form Recognizer Feedback Loop feature with the REST API and Python to train a custom model.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 10/16/2019
ms.author: pafarley

---

# Train a Form Recognizer model using the Feedback Loop REST API with Python

In this quickstart, you'll use the Form Recognizer Feedback Loop REST API with Python to train a custom model with manual input. See the [Feedback Loop conceptual guide](./feedback-loop.md) for an overview of this feature.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

To complete this quickstart, you must have:
- Access to the Form Recognizer limited-access preview. To get access to the preview, fill out and submit the [Form Recognizer access request](https://aka.ms/FormRecognizerRequestAccess) form.
- [Python](https://www.python.org/downloads/) installed (if you want to run the sample locally).
- A set of at least 11 forms of the same type. You will use this data to train the model and test a form. You can use a [sample data set](https://go.microsoft.com/fwlink/?linkid=2090451) for this quickstart. Upload the training files to the root of a blob storage container in an Azure Storage account.

## Set up training data

First you'll need to set up the required input data. The Feedback Loop feature has special input requirements beyond those needed to train a custom model. 

First, make sure all the training documents are of the same format. If you have forms in multiple formats, organize them into sub-folders based on common format. When you train, you'll need to direct the API to a sub-folder.

In order to train a model using the Feedback Loop, you'll need the following files as inputs in the sub-folder. You will learn how to create these file below.

1.	**Source forms** – the forms to extract data from. Supported types are JPEG, PNG, BMP, PDF, or TIFF.
1.	**OCR files** - JSON files that describe all of the readable text in each source form. in the Form Recognizer read Layout OCR format output format 
1.	**Label files** - JSON files that describe data labels which a user has entered manually.

All of these files should occupy the same sub-folder and be in the following format:

* input_file1.pdf 
* input_file1.pdf.ocr.json
* input_file1.pdf.labels.json 
* input_file2.pdf 
* input_file2.pdf.ocr.json
* input_file2.pdf.labels.json
* ...

<!-- When labeling using the Form Recognizer Feedback Loop Sample UX, the sample UX creates these label and OCR files in the relevant blob container folder. -->

### Create the OCR output files

OCR result files are needed for the service to consider the corresponding input files in Feedback Loop training. To obtain OCR results for a given source form, follow the steps below:

* Call the **/formrecognizer/v2.0-preview/readLayout/asyncAnalyze** API on the read Layout container with the input file as part of the request body. Save the ID found in the response's **Location** header.
* Call the **/formrecognizer/v2.0-preview/readLayout/asyncAnalyzeOperations/{id}** API, using operation ID from the previous step.
* Get the response and write the contents to a file. For each source form, the corresponding OCR file should have the original file name appended with `.ocr.json`. The OCR JSON output should have the following format: 

    ```json
    {
        "status": "Succeeded",
        "createdDateTime": "2019-09-24T20:20:51.1234794+00:00",
        "lastUpdatedDateTime": "2019-09-24T20:20:52.6971409+00:00",
        "analyzeResult": {
            "version": "2.0",
            "readResults": [
                {
                    "page": 1,
                    "angle": -0.11,
                    "width": 8.5,
                    "height": 11,
                    "unit": "inch",
                    "language": "en",
                    "lines": [
                        {
                            "boundingBox": [2.8267,1.0367,5.6733,1.0367,5.6733,1.21,2.8267,1.21],
                            "text": "Credit Card Authorization Form",
                            "words": [
                                {
                                    "boundingBox": [2.8499,1.0392,3.4099,1.0387,3.4089,1.2095,2.8503,1.2038],
                                    "text": "Credit",
                                    "confidence": 0.992
                                },
                                {
                                    "boundingBox": [3.4422,1.0387,3.873,1.0385,3.8708,1.2124,3.4411,1.2098],
                                    "text": "Card",
                                    "confidence": 0.995
                                },
                                ...
    ```

### Create the label files

Label files contain key-value associations that a user has entered manually. They are needed for Feedback Loop training, but not every source file needs to have a corresponding label file. Source files without labels will be treated as ordinary training documents. We recommend 10 or more labeled files for reliable Feedback Loop training.

When you create a label file, you can optionally specify regions&mdash;exact positions of values on the document. This will give the training even higher accuracy. Regions are formatted as a set of eight values corresponding to four X,Y coordinates: top-left, top-right, bottom-right, and bottom-left. Coordinate values are between zero and one, scaled to the dimensions of the page.

For each source form, the corresponding label file should have the original file name appended with `.labels.json`. The label file should have the following format. See the [sample label file](Form_01.pdf.labels.json) for a full example.

```json
{
    "version": "v1.0",
    "docName": "Form_01.pdf",
    "labels": [
        {
            "fieldKey": "Card Type",
            "fieldValue": "Master Card",
            "fieldValues": [
                "Master",
                "Card"
            ],
            "regions": [
                {
                    "pageNumber": 1,
                    "polygon": [0.18432941176470588,
                        0.23235454545454545,
                        0.24398823529411764,
                        0.23258181818181817,
                        0.24320000000000003,
                        0.24736363636363637,
                        0.18363529411764706,
                        0.2483818181818182
                    ]
                },
                {
                    "pageNumber": 1,
                    "polygon": [
                        0.24796470588235292,
                        0.23260000000000003,
                        0.2864,
                        0.23278181818181817,
                        0.28555294117647056,
                        0.2460181818181818,
                        0.24716470588235295,
                        0.24726363636363635
                    ]
                }
            ]
        },
```

## Train a model using Feedback Loop

To train a model with Feedback Loop, call the **Train Custom Model** API by running the following python code. Before you run the code, make these changes:

1. Replace `<Endpoint>` with the endpoint URL for your Form Recognizer resource.
1. Replace `<SAS URL>` with the Azure Blob storage container's shared access signature (SAS) URL. To retrieve the SAS URL, open the Microsoft Azure Storage Explorer, right-click your container, and select **Get shared access signature**. Make sure the **Read** and **List** permissions are checked, and click **Create**. Then copy the value in the **URL** section. It should have the form: `https://<storage account>.blob.core.windows.net/<container name>?<SAS value>`.
1. Replace `<prefix>` with the folder name in your blob container where the input data is located

```python
########### Python Form Recognizer Feedback Loop Async Train #############
from requests import post as http_post

# Endpoint URL
base_url = r"<Endpoint>" + "/formrecognizer/v2.0-preview/custom"
source = "<SAS URL>"
prefix = "<folder name>"
includeSubFolders = "false"
useLabelFile = "true"

headers = {
    # Request headers
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '<Subscription Key>',
}

url = base_url + "/asyncTrain" 
body = 	{
    "source": source,
    "sourceFilter": {
    "prefix": prefix,
    "includeSubFolders": includeSubFolders
    },
    "useLabelFile": useLabelFile
}

try:
    resp = http_post(url = url, json = body, headers = headers)
    print("Response status code: %d" % resp.status_code)
    print("Response header: %s" % resp.headers) 
except Exception as e:
    print(str(e))
```

## Get training results

After you've started the train operation, you use the returned ID to get the status of the operation. Add the following code to the bottom of your Python script. This extracts the ID value from the training call and passes it to a new API call. The training operation is asynchronous, so this script calls the API at regular intervals until the training status is completed. We recommend an interval of one second or more.

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

From here, you can copy the `"modelId"` value and use it in additional API calls to analyze form documents. Follow the same process as in the [Python train and extract quickstart](./quickstarts/python-train-extract.md).

## Next steps

In this guide, you learned how to use the Form Recognizer Feedback Loop REST API with Python to train a model with user-entered data. Next, see the [API reference documentation](https://aka.ms/form-recognizer/api) to explore the Form Recognizer API in more depth.
