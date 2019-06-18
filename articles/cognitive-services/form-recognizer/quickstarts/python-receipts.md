---
title: "Quickstart: Extract receipt data using Python - Form Recognizer"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll use the Form Recognizer REST API with Python to extract data from images of sales receipts.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: form-recognizer
ms.topic: quickstart
ms.date: 06/18/2019
ms.author: pafarley
#Customer intent: As a developer or data scientist familiar with Python, I want to learn how to use Form Recognizer to extract my receipt data.
---

# Quickstart: Extract receipt data using the Form Recognizer REST API with Python

In this quickstart, you'll use the Azure Form Recognizer REST API with Python to extract and identify relevant information in sales receipts.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites
To complete this quickstart, you must have:
- Access to the Form Recognizer limited-access preview. To get access to the preview, fill out and submit the [Form Recognizer access request](https://aka.ms/FormRecognizerRequestAccess) form.
- [Python](https://www.python.org/downloads/) installed (if you want to run the sample locally).
- A URL for an image of a receipt. You can use a [sample image](tbd) for this quickstart.

## Create a Form Recognizer resource

[!INCLUDE [create resource](../includes/create-resource.md)]

## Analyze a receipt

To start analyzing a receipt, you call the **Analyze Receipt** API using the cURL command below. Before you run the command, make these changes:

1. Replace `<Endpoint>` with the endpoint that you obtained from your Form Recognizer subscription key. You can find it on your Form Recognizer resource **Overview** tab.
1. Replace `<your receipt URL>` with the URL address of a receipt image.
1. Replace `<subscription key>` with the subscription key you copied from the previous step.

    ```python
    import http.client, urllib.request, urllib.parse, urllib.error, base64

    source = r"<your receipt URL>"
    body = {"url": source}

    headers = {
        # Request headers
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': '<subscription key>',
    }

    params = urllib.parse.urlencode({
    })

    try:
        conn = http.client.HTTPSConnection('<Endpoint>')
        conn.request("POST", "/formrecognizer/v1.0-preview/prebuilt/receipt/asyncBatchAnalyze?%s" % params, body, headers)
        response = conn.getresponse()
        data = response.read()
        print(data)
        conn.close()
    except Exception as e:
        print("[Errno {0}] {1}".format(e.errno, e.strerror))
    ```

1. Save the code in a file with a .py extension. For example, *form-recognizer-receipts.py*.
1. Open a command prompt window.
1. At the prompt, use the `python` command to run the sample. For example, `python form-recognizer-receipts.py`.

You'll receive a `202 (Success)` response that includes an **Operation-Location** header. The value of this header contains an operation ID that you can use to query the status of the operation and get the results. In the following example, the string after `operations/` is the operation ID.

```console
https://cognitiveservice/formrecognizer/v1.0-preview/prebuilt/receipt/operations/54f0b076-4e38-43e5-81bd-b85b8835fdfb
```

## Get the receipt results

After you've called the **Analyze Receipt** API, you call the **Get Receipt Result** API to get the status of that operation.

```python
import http.client, urllib.request, urllib.parse, urllib.error, base64

headers = {
    # Request headers
    'Ocp-Apim-Subscription-Key': '{subscription key}',
}

params = urllib.parse.urlencode({
})

try:
    conn = http.client.HTTPSConnection('fr-receipt2.azure-api.net')
    conn.request("GET", "/formrecognizer/v1.0-preview/prebuilt/receipt/operations/{operationId}?%s" % params, "{body}", headers)
    response = conn.getresponse()
    data = response.read()
    print(data)
    conn.close()
except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))
```



1. Replace `<operationId>` with the operation ID from the previous step.

    ```python
    ########### Python Form Recognizer Get receipt results #############

    # Endpoint URL
    url = base_url + "/operations/" + "<operationId>"
    
    while True:
        try:
            getResultResponse = http_post(url = url, headers = headers)
            analysis = getResultResponse.json()
            if "status" in analysis and analysis['status'] not in ['NotStarted','Running']
                break
            time.sleep(1)
        except Exception as e:
            print(str(e))
    
    print("Response status code: %d" % getResultResponse.status_code)
    print("Response body: %s" % getResultResponse.json())
    ```

1. Save the code in a file with a .py extension. For example, *form-recognize-analyze.py*.
1. Open a command prompt window.
1. At the prompt, use the `python` command to run the sample. For example, `python form-recognize-analyze.py`.

### Examine the response

A success response is returned in JSON. It represents the key-value pairs and tables extracted from the form:

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

In this quickstart, you used the Form Recognizer REST API with Python to train a model and run it in a sample scenario. Next, see the reference documentation to explore the Form Recognizer API in more depth.

> [!div class="nextstepaction"]
> [REST API reference documentation](https://aka.ms/form-recognizer/api)
