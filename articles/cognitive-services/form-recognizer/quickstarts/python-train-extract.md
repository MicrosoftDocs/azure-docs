---
title: "Quickstart: Train a model and extract form data using REST API with Python - Form Recognizer"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you will use the Form Recognizer REST API with Python to train a model and extract data from forms.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: form-recognizer
ms.topic: quickstart
ms.date: 04/15/2019
ms.author: pafarley
#Customer intent: As a developer or data scientist familiar with Python, I want to learn how to use Form Recognizer to extract my form data.
---

# Quickstart: Train a Form Recognizer model and extract form data using REST API with Python

In this quickstart, you will use using Form Recognizer's REST API with Python to train and score forms to extract key-value pairs and tables.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- You got access to the Form Recognizer limited-access preview. To get access to the preview, please fill out and submit the [Cognitive Services Form Recognizer access request](https://aka.ms/FormRecognizerRequestAccess) form. 
- You must have [Python](https://www.python.org/downloads/) installed if you want to run the sample locally.
- You must have a subscription key for Form Recognizer. To get a subscription key, see [Obtaining Subscription Keys](https://docs.microsoft.com/en-us/azure/cognitive-services/cognitive-services-apis-create-account).
- You must have a minimum set of five forms of the same type. You can use a [sample dataset](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/curl/form-recognizer/sample_data.zip) for this quickstart.

## Create and run the sample

To create and run the sample, do the following steps:

1. Replace the value of `<subscription_key>` with your subscription key.
2. Replace the value of `<Endpoint>` with the endpoint URL for the Form Recognizer resource in the Azure region where you obtained your subscription keys. 
3. Replace `<SAS URL>` with an Azure Blob Storage container shared access signature (SAS) URL where the training data is located.  
4. Save the code as a file with an `.py` extension. For example, `form-recognize-train.py`.
5. Open a command prompt window.
6. At the prompt, use the `python` command to run the sample. For example, `form-recognize-train.py`.

```python
########### Python Form Recognizer Train #############
from requests import delete as http_delete
from requests import get as http_get
from requests import post as http_post

# Endpoint URL
base_url = r"<Endpoint>"
source = r"<SAS URL>"
headers = {
    # Request headers
    'Content-Type': 'application/json-patch+json',
    'Ocp-Apim-Subscription-Key': '<Subscription-Key>',
}

url = base_url + "/formrecognizer/v1.0-preview/custom/train" 
body = {"source": <SAS URL>}
resp = http_post(url = url, json = body, headers = headers)
print("Response status code: %d" % resp.status_code)
try:
    print("Response body: %s" % resp.json())
except Exception as e:
    print(str(e))

####################################
```
You will receive a `200 (Success)` response with the following JSON output:

```json
{
  "modelId": "9299792c-03b4-4eea-b83e-afa403fcb406",
  "totalPages": 5,
  "processReport": [
    {
      "dataRef": "Invoice_1.pdf",
      "errors": [],
      "pages": 1,
      "status": "success"
    },
    {
      "dataRef": "Invoice_2.pdf",
      "errors": [],
      "pages": 1,
      "status": "success"
    },
    {
      "dataRef": "Invoice_3.pdf",
      "errors": [],
      "pages": 1,
      "status": "success"
    },
    {
      "dataRef": "Invoice_4.pdf",
      "errors": [],
      "pages": 1,
      "status": "success"
    },
    {
      "dataRef": "Invoice_5.pdf",
      "errors": [],
      "pages": 1,
      "status": "success"
    }
  ],
  "trainReport": {
    "errors": [],
    "pages": 0,
    "status": "success"
  }
}
```

Take note of the `"modelId"` value; you will need it for the following steps.
  
## Extract key-value pairs and tables from forms

Next, you will analyze a document and extract key-value pairs and tables from it. Call the **Model - Analyze** API by executing the Python script below. Before running the command, make the following changes:

* Replace `<Endpoint>` with the endpoint you obtained your Form Recognizer subscription key. You can find it in your Form Recognizer resource overview tab.
* Replace `<modelID>` with the model ID you received in the previous step of training the model.
* Replace `<SAS URL>` with an Azure Blob Storage container shared access signature (SAS) URL where the form to extract data is located. 
* Replace `<subscription key>` with your subscription key.

```python
