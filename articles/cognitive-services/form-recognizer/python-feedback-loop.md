---
title: "How to use the Feedback Loop REST API with Python - Form Recognizer"
titleSuffix: Azure Cognitive Services
description: Learn how to use custom training on your Form Recognizer custom models.
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

## Get the train results

After you've called the **Async Train** API, you call the **Get Train Status** API to get the status of the operation and the model data. Use the following code to get the train status and model ID. Replace the `<operation ID>` with the operation ID you recevied in the asyncTrain request. 

```python
import json
from requests import get as http_get

# Endpoint URL
base_url = r"http://localhost:5005" + "/formrecognizer/v2.0-preview"

url = base_url + "/asyncTrainOperations/<operation ID>" 

try:
    resp = http_get(url = url)
		
    print("Response status code: %d" % resp.status_code)
    print("url: %s" % resp.url)
    print("Response body: %s" % json.dumps(resp.json()))  
except Exception as e:
    print(str(e))
```

You'll receive a 200 (Success) response with the model details this JSON output:
```json
{
  "status": "Succeeded",
  "createdDateTime": "2019-09-25T21:35:08.1247958+00:00",
  "lastUpdatedDateTime": "2019-09-25T21:35:16.1592136+00:00",
  "trainResult": {
    "modelId": "b2bb0071-0a22-4cb0-aedb-482a9e3cdd93",
    "trainingDocuments": [
      {
        "documentName": "Form_01.pdf",
        "pages": 1,
        "status": "Success"
      },
      {
        "documentName": "Form_02.pdf",
        "pages": 1,
        "status": "Success"
      },
      {
        "documentName": "Form_03.pdf",
        "pages": 1,
        "status": "Success"
      },
      {
        "documentName": "Form_04.pdf",
        "pages": 1,
        "status": "Success"
      },
      {
        "documentName": "Form_05.pdf",
        "pages": 1,
        "status": "Success"
      },
      {
        "documentName": "Form_06.pdf",
        "pages": 1,
        "status": "Success"
      },
      {
        "documentName": "Form_07.pdf",
        "pages": 1,
        "status": "Success"
      },
      {
        "documentName": "Form_08.pdf",
        "pages": 1,
        "status": "Success"
      },
      {
        "documentName": "Form_09.pdf",
        "pages": 1,
        "status": "Success"
      },
      {
        "documentName": "Form_10.pdf",
        "pages": 1,
        "status": "Success"
      }
    ],
    "trainingFields": {
      "fields": [
        {
          "fieldName": "Card Type",
          "accuracy": 1
        },
        {
          "fieldName": "Cardholder Name",
          "accuracy": 1
        },
        {
          "fieldName": "Card Number",
          "accuracy": 1
        },
        {
          "fieldName": "Expiration Date",
          "accuracy": 1
        },
        {
          "fieldName": "Cardholder Zip Code",
          "accuracy": 1
        },
        {
          "fieldName": "Authorize",
          "accuracy": 1
        },
        {
          "fieldName": "Date",
          "accuracy": 1
        },
        {
          "fieldName": "Signature",
          "accuracy": 0.6
        }
      ],
      "averageModelAccuracy": 0.95
    },
    "errors": []
  }
}
```

Note the `"modelId"` value. You'll need it for the following steps.
  
## Extract key-value pairs from forms

Next, you'll analyze a document and extract key-value pairs from it. Call the **Async Analyze** API by running the Python script that follows. Before you run the command, make these changes:

1. Replace `<path to your form>` with the file path of your form (for example, C:\temp\file.pdf).
2. Replace `<modelID>` with the model ID you received in the previous section.


```python
	########### Python Form Recognizer Feedback Loop Async Analyze #############
	import json
	from requests import post as http_post

	# Endpoint
	base_url = r"http://localhost:5005" + "/formrecognizer/v2.0-preview/models"
	file_path = r"<path to your form>"
	model_id = "<model_id>"
	headers = {
	    # Request headers
	    'Content-Type': 'application/pdf'
	}

	try:
	    url = base_url + "/" + model_id + "/asyncAnalyze/?includeTextDetails=false"  


	    with open(file_path, "rb") as f:
		data_bytes = f.read()  
	    resp = http_post(url = url, files = dict(analyzeFile = (file_path, data_bytes, 'application/pdf')))

	    print("Response status code: %d" % resp.status_code)    
	    print("Response header: %s" % resp.headers)  
	except Exception as e:
	    print(str(e))
 ```

1. Save the code in a file with a .py extension. For example, *form-recognize-analyze.py*.
1. Open a command prompt window.
1. At the prompt, use the `python` command to run the sample. For example, `python form-recognize-analyze.py`.

You'll receive a `202 (Success)` response that includes an **Operation-Location** header, which the script will print to the console. This header contains an operation ID that you can use to query the status of the operation and get the analysis results. In the following example value, the string after `operations/` is the operation ID.

```console
operation-location: http://localhost:5005/formrecognizer/v2.0-preview/models/asyncAnalyzeOperations/<operationId>
```

## Get the analyze results

After you've called the **Async Analyze** API, you call the **Get Analyze Status** API to get the status of the operation and the model data. Use the following code to get the train status and model ID. Replace the `<operation ID>` with the operation ID you recevied in the asyncAnaluze request.  

```python
import json
from requests import get as http_get

# Endpoint URL
base_url = r"http://localhost:5005" + "/formrecognizer/v2.0-preview/models"

url = base_url + "/asyncAnalyzeOperations/<operation_ID>" 

try:
    resp = http_get(url = url)
		
    print("Response status code: %d" % resp.status_code)
    print("url: %s" % resp.url)
    print("Response body: %s" % json.dumps(resp.json()))  
except Exception as e:
    print(str(e))
	
```

### Examine the response

A success response is returned in JSON. It represents the key-value pairs extracted from the form:

```bash
{
  "analyzeResult": {
    "version": "2.0",
    "documentResults": [
      {
        "docType": "Analyze ",
        "pageRange": [
          1,
          1
        ],
        "fields": {
          "Card Type": {
            "type": "string",
            "valueString": "Visa",
            "text": "Visa",
            "boundingBox": [
              1.565,
              2.555,
              1.875,
              2.555,
              1.875,
              2.74,
              1.565,
              2.74
            ],
            "pageNumber": 1,
            "confidence": 1
          },
          "Cardholder Zip Code": {
            "type": "string",
            "valueString": "37867",
            "text": "37867",
            "boundingBox": [
              4.805,
              4.29,
              5.215,
              4.29,
              5.215,
              4.42,
              4.805,
              4.42
            ],
            "pageNumber": 1,
            "confidence": 1
          },
          "Expiration Date": {
            "type": "string",
            "valueString": "01/21",
            "text": "01/21",
            "boundingBox": [
              2.74,
              3.875,
              3.1,
              3.875,
              3.1,
              4.07,
              2.74,
              4.07
            ],
            "pageNumber": 1,
            "confidence": 1
          },
```

## Next steps

In this quickstart, you used the Form Recognizer Feedback Loop REST API with Python to train a model and extract key value pairs in a sample scenario. Next, see the [API reference documentation](http://localhost:5005/swagger) to explore the Form Recognizer Feedback Loop API in more depth.
