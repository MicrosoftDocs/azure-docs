---
title: "Quickstart: Extract receipt data using cURL - Form Recognizer"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll use the Form Recognizer REST API with cURL to extract data from images of sales receipts.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: form-recognizer
ms.topic: quickstart
ms.date: 06/12/2019
ms.author: pafarley
#Customer intent: As a developer or data scientist familiar with cURL, I want to learn how to use a pre-trained Form Recognizer model to extract my receipt data.
---

# Quickstart: Extract receipt data using the Form Recognizer REST API with cURL

In this quickstart, you'll use the Azure Form Recognizer REST API with cURL to extract and identify relevant information in sales receipts.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites
To complete this quickstart, you must have:
- Access to the Form Recognizer limited-access preview. To get access to the preview, fill out and submit the [Form Recognizer access request](https://aka.ms/FormRecognizerRequestAccess) form.
- [cURL](https://curl.haxx.se/windows/) installed.
- A URL for an image of a receipt. You can use a [sample image](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/curl/form-recognizer/contoso-receipt.png) for this quickstart.

## Create a Form Recognizer resource

[!INCLUDE [create resource](../includes/create-resource.md)]

## Analyze a receipt

To start analyzing a receipt, you call the **Analyze Receipt** API using the cURL command below. Before you run the command, make these changes:

1. Replace `<Endpoint>` with the endpoint that you obtained from your Form Recognizer subscription key. You can find it on your Form Recognizer resource **Overview** tab.
1. Replace `<your receipt URL>` with the URL address of a receipt image.
1. Replace `<subscription key>` with the subscription key you copied from the previous step.

```bash
curl -v -X POST "https://<Endpoint>/formrecognizer/v1.0-preview/prebuilt/receipt/asyncBatchAnalyze" -H "Content-Type: application/json" -H "Ocp-Apim-Subscription-Key: <subscription key>" --data-ascii "{ \"url\": \"<your receipt URL>\"}"
```

You'll receive a `202 (Success)` response that includes an **Operation-Location** header. The value of this header contains an operation ID that you can use to query the status of the operation and get the results. In the following example, the string after `operations/` is the operation ID.

```console
https://cognitiveservice/formrecognizer/v1.0-preview/prebuilt/receipt/operations/54f0b076-4e38-43e5-81bd-b85b8835fdfb
```

## Get the receipt results

After you've called the **Analyze Receipt** API, you call the **Get Receipt Result** API to get the status of that operation.

1. Replace `<operationId>` with the operation ID from the previous step.
1. Replace `<subscription key>` with your subscription key.

```bash
curl -X POST "https://<Endpoint>/formrecognizer/v1.0-preview/prebuilt/receipt/operations/<operationId>" -H "Ocp-Apim-Subscription-Key: <subscription key>"
```

You'll receive a `200 (Success)` response with JSON output. The first field, `"status"`, indicates the status of the operation. If the operation is complete, the `"recognitionResults"` field contains every line of text that was extracted from the receipt, and the `"understandingResults"` field contains key/value information for the most relevant parts of the
See the following receipt image and its corresponding JSON output. The output has been shortened for scanability.

![A receipt from Contoso store](../media/contoso-receipt.png)

```json
{
  "status": "Succeeded",
  "recognitionResults": [
    {
      "page": 1,
      "clockwiseOrientation": 359.68,
      "width": 1440,
      "height": 2560,
      "unit": "pixel",
      "lines": [
        {
          "boundingBox": [
            541,
            563,
            842,
            562,
            843,
            666,
            542,
            666
          ],
          "text": "Serafina",
          "words": [
            {
              "boundingBox": [
                560,
                572,
                839,
                563,
                842,
                668,
                563,
                663
              ],
              "text": "Serafina",
              "confidenceScore": 0.39,
              "confidence": "Low"
            }
          ]
        },
        ...
      ]
    }
  ],
  "understandingResults": [
    {
      "pages": [
        1
      ],
      "fields": {
        "Subtotal": {
          "valueType": "numberValue",
          "value": 358.44,
          "text": "$358.44",
          "elements": [
            {
              "$ref": "#/recognitionResults/0/lines/56/words/0"
            },
            {
              "$ref": "#/recognitionResults/0/lines/56/words/1"
            },
            {
              "$ref": "#/recognitionResults/0/lines/56/words/2"
            }
          ]
        },
        "Total": {
          "valueType": "numberValue",
          "value": 463.61,
          "text": "$463.61",
          "elements": [
            {
              "$ref": "#/recognitionResults/0/lines/3/words/0"
            }
          ]
        },
        "Tax": {
          "valueType": "numberValue",
          "value": 42.53,
          "text": "$42.53",
          "elements": [
            {
              "$ref": "#/recognitionResults/0/lines/27/words/0"
            }
          ]
        },
        "MerchantAddress": {
          "valueType": "stringValue",
          "value": "2043 East lake Ave East Seattle, WA 98102",
          "text": "2043 East lake Ave East Seattle, WA 98102",
          "elements": [
            {
              "$ref": "#/recognitionResults/0/lines/12/words/0"
            },
            {
              "$ref": "#/recognitionResults/0/lines/12/words/1"
            },
            {
              "$ref": "#/recognitionResults/0/lines/12/words/2"
            },
            {
              "$ref": "#/recognitionResults/0/lines/12/words/3"
            },
            {
              "$ref": "#/recognitionResults/0/lines/12/words/4"
            },
            {
              "$ref": "#/recognitionResults/0/lines/33/words/0"
            },
            {
              "$ref": "#/recognitionResults/0/lines/33/words/1"
            },
            {
              "$ref": "#/recognitionResults/0/lines/33/words/2"
            }
          ]
        },
        "MerchantName": {
          "valueType": "stringValue",
          "value": "Serafina Osteria & Enoteca",
          "text": "Serafina Osteria & Enoteca",
          "elements": [
            {
              "$ref": "#/recognitionResults/0/lines/40/words/0"
            },
            {
              "$ref": "#/recognitionResults/0/lines/40/words/1"
            },
            {
              "$ref": "#/recognitionResults/0/lines/40/words/2"
            },
            {
              "$ref": "#/recognitionResults/0/lines/40/words/3"
            }
          ]
        },
        "MerchantPhoneNumber": {
          "valueType": "stringValue",
          "value": null,
          "text": "206.323 .0807",
          "elements": [
            {
              "$ref": "#/recognitionResults/0/lines/53/words/0"
            },
            {
              "$ref": "#/recognitionResults/0/lines/53/words/1"
            }
          ]
        },
        "TransactionDate": {
          "valueType": "stringValue",
          "value": "2018-06-06",
          "text": "06/06/18",
          "elements": [
            {
              "$ref": "#/recognitionResults/0/lines/51/words/0"
            }
          ]
        },
        "TransactionTime": {
          "valueType": "stringValue",
          "value": "13:11:00",
          "text": "1:11 PM",
          "elements": [
            {
              "$ref": "#/recognitionResults/0/lines/51/words/1"
            },
            {
              "$ref": "#/recognitionResults/0/lines/51/words/2"
            }
          ]
        }
      }
    }
  ]
}
```

## Next steps

In this quickstart, you used the Form Recognizer REST API with cURL to extract the contents of a sales receipt. Next, see the reference documentation to explore the Form Recognizer API in more depth.

> [!div class="nextstepaction"]
> [REST API reference documentation](https://westus2.dev.cognitive.microsoft.com/docs/services/form-recognizer-api/operations/AnalyzeReceipt)
