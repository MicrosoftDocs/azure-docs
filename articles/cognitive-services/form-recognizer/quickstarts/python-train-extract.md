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
- A set of at least five forms of the same type. You will use this data to train the model. You can use a [sample data set](https://go.microsoft.com/fwlink/?linkid=2090451) for this quickstart. Upload the training files to the root of a blob storage container in an Azure Storage account.

## Create a Form Recognizer resource

[!INCLUDE [create resource](../includes/create-resource.md)]

## Train a Form Recognizer model

First, you'll need a set of training data in an Azure Storage blob container. You should have a minimum of five filled-in forms (PDF documents and/or images) of the same type/structure as your main input data. Or, you can use a single empty form with two filled-in forms. The empty form's file name needs to include the word "empty." See [Build a training data set for a custom model](../build-training-data-set.md) for tips and options for putting together your training data.

> [!NOTE]
> You can use the labeled data feature to manually label some or all of your training data beforehand. This is a more complex process but results in a better trained model. See the [Train with labels](../overview.md#train-with-labels) section of the overview to learn more.

To train a Form Recognizer model with the documents in your Azure blob container, call the **TrainC Custom Model** API by running the following python code. Before you run the code, make these changes:

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
        conn.request("POST", "/formrecognizer/v2.0-preview/custom/models", body, headers)
        response = conn.getresponse()
        data = response.read()
        operationURL = "" + response.getheader("Location")
        print ("Location header: " + operationURL)
        conn.close()
    except Exception as e:
        print(str(e))
    ```
1. Save the code in a file with a .py extension. For example, *form-recognizer-train.py*.
1. Open a command prompt window.
1. At the prompt, use the `python` command to run the sample. For example, `python form-recognizer-train.py`.

## Get training results

After you've started the train operation, you use the returned ID to get the status of the operation. Add the following code to the bottom of your Python script. This extracts the ID value from the training call and passes it to a new API call. The training operation is asynchronous, so this script calls the API at regular intervals until the training status is completed. We recommend an interval of one second or more.

```python 
operationId = operationURL.split("operations/")[1]

conn = http.client.HTTPSConnection('<Endpoint>')
while True:
    try:
        conn.request("GET", f"/formrecognizer/v2.0-preview/custom/models/{operationId}", "", headers)
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

Copy the `"modelId"` value for use in the following steps.

[!INCLUDE [analyze forms](../includes/python-custom-analyze.md)]

## Next steps

In this quickstart, you used the Form Recognizer REST API with Python to train a model and run it in a sample scenario. Next, see the reference documentation to explore the Form Recognizer API in more depth.

> [!div class="nextstepaction"]
> [REST API reference documentation](https://aka.ms/form-recognizer/api)
