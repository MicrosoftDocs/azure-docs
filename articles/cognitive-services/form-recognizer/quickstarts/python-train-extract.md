---
title: "Quickstart: Train a model and extract form data using REST API with Python - Form Recognizer"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you will use the Form Recognizer REST API with Python to train a model and extract data from forms.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: form-recognizer
ms.topic: quickstart
ms.date: 04/24/2019
ms.author: pafarley
#Customer intent: As a developer or data scientist familiar with Python, I want to learn how to use Form Recognizer to extract my form data.
---

# Quickstart: Train a Form Recognizer model and extract form data using REST API with Python

In this quickstart, you will use using Form Recognizer's REST API with Python to train and score forms to extract key-value pairs and tables.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

-  You must get access to the Form Recognizer limited-access preview. To get access to the preview, please fill out and submit the [Cognitive Services Form Recognizer access request](https://aka.ms/FormRecognizerRequestAccess) form. 
- You must have [Python](https://www.python.org/downloads/) installed if you want to run the sample locally.
- You must have a subscription key for Form Recognizer. To get a subscription key, see [Obtaining Subscription Keys](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account).
- You must have a minimum set of five forms of the same type. You can use a [sample dataset](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/curl/form-recognizer/sample_data.zip) for this quickstart.

## Create and run the sample

To create and run the sample, make the following changes to the code snippet below:

1. Replace the value of `<subscription_key>` with your subscription key.
1. Replace the value of `<Endpoint>` with the endpoint URL for the Form Recognizer resource in the Azure region where you obtained your subscription keys.
1. Replace `<SAS URL>` with an Azure Blob Storage container shared access signature (SAS) URL where the training data is located.  

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
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': '<Subscription Key>',
    }
    url = base_url + "/formrecognizer/v1.0-preview/custom/train" 
    body = {"source": source}
    try:
        resp = http_post(url = url, json = body, headers = headers)
        print("Response status code: %d" % resp.status_code)
        print("Response body: %s" % resp.json())
    except Exception as e:
        print(str(e))
    ####################################
    ```
1. Save the code as a file with an `.py` extension. For example, `form-recognize-train.py`.
1. Open a command prompt window.
1. At the prompt, use the `python` command to run the sample. For example, `python form-recognize-train.py`.

You will receive a `200 (Success)` response with the following JSON output:

```json
{
  "modelId": "59e2185e-ab80-4640-aebc-f3653442617b",
  "trainingDocuments": [
    {
      "documentName": "Invoice_1.pdf",
      "pages": 1,
      "errors": [],
      "status": "success"
    },
    {
      "documentName": "Invoice_2.pdf",
      "pages": 1,
      "errors": [],
      "status": "success"
    },
    {
      "documentName": "Invoice_3.pdf",
      "pages": 1,
      "errors": [],
      "status": "success"
    },
    {
      "documentName": "Invoice_4.pdf",
      "pages": 1,
      "errors": [],
      "status": "success"
    },
    {
      "documentName": "Invoice_5.pdf",
      "pages": 1,
      "errors": [],
      "status": "success"
    }
  ],
  "errors": []
}
```

Take note of the `"modelId"` value; you will need it for the following steps.
  
## Extract key-value pairs and tables from forms

Next, you will analyze a document and extract key-value pairs and tables from it. Call the **Model - Analyze** API by executing the Python script below. Before running the command, make the following changes:

1. Replace `<Endpoint>` with the endpoint you obtained with your Form Recognizer subscription key. You can find it in your Form Recognizer resource overview tab.
1. Replace `<File Path>` with the file path location or URL where the form to extract data is located.
1. Replace `<modelID>` with the model ID you received in the previous step of training the model.
1. Replace `<file type>` with the file type - supported types pdf, image/jpeg, image/png.
1. Replace `<subscription key>` with your subscription key.

    ```python
        ########### Python Form Recognizer Analyze #############
        from requests import post as http_post
    
        # PPE endpoint
        base_url = r"<Endpoint>"
        file_path = r"<File Path>"
        model_id = "<modelID>"
        headers = {
            # Request headers
            'Content-Type': 'application/<file type>',
            'Ocp-Apim-Subscription-Key': '<subscription key>',
        }
    
        try:
            url = base_url + "/model/" + model_id + "/analyze" 
            with open(file_path, "rb") as f:
                data_bytes = f.read()  
            resp = http_post(url = url, data = data_bytes, headers = headers)
            print("Response status code: %d" % resp.status_code)    
            print("Response body:\n%s" % resp.json())   
        except Exception as e:
            print(str(e))
        ####################################
    ```

1. Save the code as a file with an `.py` extension. For example, `form-recognize-analyze.py`.
1. Open a command prompt window.
1. At the prompt, use the `python` command to run the sample. For example, `python form-recognize-analyze.py`.

### Examine the response

A successful response is returned in JSON and represents the extracted key-value pairs and tables extracted from the form.

```bash
{
  "status": "success",
  "pages": [
    {
      "number": 1,
      "height": 792,
      "width": 612,
      "clusterId": 0,
      "keyValuePairs": [
        {
          "key": [
            {
              "text": "Address:",
              "boundingBox": [
                57.4,
                683.1,
                100.5,
                683.1,
                100.5,
                673.7,
                57.4,
                673.7
              ]
            }
          ],
          "value": [
            {
              "text": "1 Redmond way Suite",
              "boundingBox": [
                57.4,
                671.3,
                154.8,
                671.3,
                154.8,
                659.2,
                57.4,
                659.2
              ],
              "confidence": 0.86
            },
            {
              "text": "6000 Redmond, WA",
              "boundingBox": [
                57.4,
                657.1,
                146.9,
                657.1,
                146.9,
                645.5,
                57.4,
                645.5
              ],
              "confidence": 0.86
            },
            {
              "text": "99243",
              "boundingBox": [
                57.4,
                643.4,
                85,
                643.4,
                85,
                632.3,
                57.4,
                632.3
              ],
              "confidence": 0.86
            }
          ]
        },
        {
          "key": [
            {
              "text": "Invoice For:",
              "boundingBox": [
                316.1,
                683.1,
                368.2,
                683.1,
                368.2,
                673.7,
                316.1,
                673.7
              ]
            }
          ],
          "value": [
            {
              "text": "Microsoft",
              "boundingBox": [
                374,
                687.9,
                418.8,
                687.9,
                418.8,
                673.7,
                374,
                673.7
              ],
              "confidence": 1
            },
            {
              "text": "1020 Enterprise Way",
              "boundingBox": [
                373.9,
                673.5,
                471.3,
                673.5,
                471.3,
                659.2,
                373.9,
                659.2
              ],
              "confidence": 1
            },
            {
              "text": "Sunnayvale, CA 87659",
              "boundingBox": [
                373.8,
                659,
                479.4,
                659,
                479.4,
                645.5,
                373.8,
                645.5
              ],
              "confidence": 1
            }
          ]
        }
      ],
      "tables": [
        {
          "id": "table_0",
          "columns": [
            {
              "header": [
                {
                  "text": "Invoice Number",
                  "boundingBox": [
                    38.5,
                    585.2,
                    113.4,
                    585.2,
                    113.4,
                    575.8,
                    38.5,
                    575.8
                  ]
                }
              ],
              "entries": [
                [
                  {
                    "text": "34278587",
                    "boundingBox": [
                      38.5,
                      547.3,
                      82.8,
                      547.3,
                      82.8,
                      537,
                      38.5,
                      537
                    ],
                    "confidence": 1
                  }
                ]
              ]
            },
            {
              "header": [
                {
                  "text": "Invoice Date",
                  "boundingBox": [
                    139.7,
                    585.2,
                    198.5,
                    585.2,
                    198.5,
                    575.8,
                    139.7,
                    575.8
                  ]
                }
              ],
              "entries": [
                [
                  {
                    "text": "6/18/2017",
                    "boundingBox": [
                      139.7,
                      546.8,
                      184,
                      546.8,
                      184,
                      537,
                      139.7,
                      537
                    ],
                    "confidence": 1
                  }
                ]
              ]
            },
            {
              "header": [
                {
                  "text": "Invoice Due Date",
                  "boundingBox": [
                    240.5,
                    585.2,
                    321,
                    585.2,
                    321,
                    575.8,
                    240.5,
                    575.8
                  ]
                }
              ],
              "entries": [
                [
                  {
                    "text": "6/24/2017",
                    "boundingBox": [
                      240.5,
                      546.8,
                      284.8,
                      546.8,
                      284.8,
                      537,
                      240.5,
                      537
                    ],
                    "confidence": 1
                  }
                ]
              ]
            },
            {
              "header": [
                {
                  "text": "Charges",
                  "boundingBox": [
                    341.3,
                    585.2,
                    381.2,
                    585.2,
                    381.2,
                    575.8,
                    341.3,
                    575.8
                  ]
                }
              ],
              "entries": [
                [
                  {
                    "text": "$56,651.49",
                    "boundingBox": [
                      387.6,
                      546.4,
                      437.5,
                      546.4,
                      437.5,
                      537,
                      387.6,
                      537
                    ],
                    "confidence": 1
                  }
                ]
              ]
            },
            {
              "header": [
                {
                  "text": "VAT ID",
                  "boundingBox": [
                    442.1,
                    590,
                    474.8,
                    590,
                    474.8,
                    575.8,
                    442.1,
                    575.8
                  ]
                }
              ],
              "entries": [
                [
                  {
                    "text": "PT",
                    "boundingBox": [
                      447.7,
                      550.6,
                      460.4,
                      550.6,
                      460.4,
                      537,
                      447.7,
                      537
                    ],
                    "confidence": 1
                  }
                ]
              ]
            }
          ]
        }
      ]
    }
  ],
  "errors": []
}
```

## Next steps

In this guide, you used the Form Recognizer REST APIs with Python to train a model and run it in a sample case. Next, see the reference documentation to explore the Form Recognizer API in more depth.

> [!div class="nextstepaction"]
> [REST API reference documentation](https://aka.ms/form-recognizer/api)
