---
title: "Quickstart: Extract receipt data using cURL - Form Recognizer"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll use the Form Recognizer REST API with cURL to extract data from images of sales receipts.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: quickstart
ms.date: 10/03/2019
ms.author: pafarley
#Customer intent: As a developer or data scientist familiar with cURL, I want to learn how to use a prebuilt Form Recognizer model to extract my receipt data.
---

# Quickstart: Extract receipt data using the Form Recognizer REST API with cURL

In this quickstart, you'll use the Azure Form Recognizer REST API with cURL to extract and identify relevant information in sales receipts.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

To complete this quickstart, you must have:
- Access to the Form Recognizer limited-access preview. To get access to the preview, fill out and submit the [Form Recognizer access request](https://aka.ms/FormRecognizerRequestAccess) form.
- [cURL](https://curl.haxx.se/windows/) installed.
- A URL for an image of a receipt. You can use a [sample image](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/curl/form-recognizer/contoso-receipt.png?raw=true) for this quickstart.

## Create a Form Recognizer resource

[!INCLUDE [create resource](../includes/create-resource.md)]

## Analyze a receipt

To start analyzing a receipt, you call the **Analyze Receipt** API using the cURL command below. Before you run the command, make these changes:

1. Replace `<Endpoint>` with the endpoint that you obtained with your Form Recognizer subscription key. You can find it on your Form Recognizer resource **Overview** tab.
1. Replace `<your receipt URL>` with the URL address of a receipt image.
1. Replace `<subscription key>` with the subscription key you copied from the previous step.

```bash
curl -i -X POST "https://<Endpoint>/formrecognizer/v2.0-preview/prebuilt/receipt/analyze" -H "Content-Type: application/json" -H "Ocp-Apim-Subscription-Key: <subscription key>" --data-ascii "{ \"url\": \"<your receipt URL>\"}"
```

You'll receive a `201 (Success)` response that includes an **Location** header. The value of this header contains an operation ID that you can use to query the status of the asynchronous operation and get the results. In the following example, the string after `operations/` is the operation ID.

```console
https://cognitiveservice/formrecognizer/v2.0-preview/prebuilt/receipt/operations/54f0b076-4e38-43e5-81bd-b85b8835fdfb
```

## Get the receipt results

After you've called the **Analyze Receipt** API, you call the **Get Receipt Result** API to get the status of the operation and the extracted data. Before you run the command, make these changes:

1. Replace `<Endpoint>` with the endpoint that you obtained with your Form Recognizer subscription key. You can find it on your Form Recognizer resource **Overview** tab.
1. Replace `<operationId>` with the operation ID from the previous step.
1. Replace `<subscription key>` with your subscription key.

```bash
curl -X GET "https://<Endpoint>/formrecognizer/v2.0-preview/prebuilt/receipt/analyzeResults/<operationId>" -H "Ocp-Apim-Subscription-Key: <subscription key>"
```

### Examine the response

You'll receive a `200 (Success)` response with JSON output. The first field, `"status"`, indicates the status of the operation. If the operation is complete, the `"recognitionResults"` field contains every line of text that was extracted from the receipt, and the `"understandingResults"` field contains key/value information for the most relevant parts of the receipt. If the operation is not complete, the value of `"status"` will be `"running"` or `"notStarted"`, and you should call the API again, either manually or through a script. We recommend an interval of one second or more between calls.

See the following receipt image and its corresponding JSON output. The output has been shortened for readability.

![A receipt from Contoso store](../media/contoso-receipt.png)

```json
{
  "status": "succeeded",
  "createdDateTime": "2019-10-16T09:08:06.52Z",
  "lastUpdatedDateTime": "2019-10-16T09:08:06.98Z",
  "analyzeResult": { 
    "version":"2.0",
    "readResults":[ 
      { 
        "page":1,
        "angle":0.3165,
        "width":1688,
        "height":3000,
        "unit":"pixel",
        "language":"en",
        "lines":[ 
          { 
            "text":"Contoso",
            "boundingBox":[ 
              617,
              291,
              1050,
              279,
              1054,
              384,
              620,
              397
            ],
            "words":[ 
              { 
                "text":"Contoso",
                "boundingBox":[ 
                  619,
                  293,
                  1051,
                  284,
                  1053,
                  383,
                  621,
                  399
                ],
                "confidence":0.9905
              }
            ]
          },
          ...
        ]
      }
    ],
    "documentResults":[ 
      { 
        "docType":"prebuilt:receipt",
        "pageRange":[ 
          1,
          1
        ],
        "fields":{ 
          "ReceiptType":{ 
            "type":"string",
            "valueString":"Itemized",
            "pageNumber":1,
            "confidence":0.991940975189209
          },
          "MerchantName":{ 
            "type":"string",
            "valueString":"Contoso",
            "text":"Contoso",
            "boundingBox":[ 
              330,
              590,
              502.272644,
              600.547363,
              498.906647,
              655.5249,
              326.634,
              644.9776
            ],
            "pageNumber":1,
            "confidence":0.048439331352710724,
            "elements":[ 
              "#/readResults/0/lines/1/words/0"
            ]
          },
          "MerchantAddress":{ 
            "type":"string",
            "valueString":"123 Main Street Redmond, WA 98052",
            "text":"123 Main Street Redmond, WA 98052",
            "boundingBox":[ 
              318.0899,
              689.9097,
              753.7846,
              697.9188,
              750.6947,
              866.0091,
              315,
              858
            ],
            "pageNumber":1,
            "confidence":0.68994146585464478,
            "elements":[ 
              "#/readResults/0/lines/2/words/0",
              "#/readResults/0/lines/2/words/1",
              "#/readResults/0/lines/2/words/2",
              "#/readResults/0/lines/3/words/0",
              "#/readResults/0/lines/3/words/1",
              "#/readResults/0/lines/3/words/2"
            ]
          },
          "MerchantPhoneNumber":{ 
            "type":"phoneNumber",
            "text":"123-456-7890",
            "boundingBox":[ 
              308.268616,
              1003.98456,
              617.031433,
              1010.51123,
              615.7628,
              1070.52673,
              307,
              1064
            ],
            "pageNumber":1,
            "confidence":1,
            "elements":[ 
              "#/readResults/0/lines/4/words/0"
            ]
          },
          "TransactionDate":{ 
            "type":"date",
            "valueDate":"2019-06-10",
            "text":"6/10/2019",
            "boundingBox":[ 
              306.1577,
              1223.4967,
              512,
              1224,
              511.8411,
              1289.002,
              305.998779,
              1288.49866
            ],
            "pageNumber":1,
            "confidence":0.99991607666015625,
            "elements":[ 
              "#/readResults/0/lines/5/words/0"
            ]
          },
          "TransactionTime":{ 
            "type":"time",
            "valueTime":"13:59:00",
            "text":"13:59",
            "boundingBox":[ 
              524,
              1225,
              629.019,
              1227.00989,
              627.7942,
              1291.00562,
              522.7752,
              1288.99573
            ],
            "pageNumber":1,
            "confidence":0.98649173974990845,
            "elements":[ 
              "#/readResults/0/lines/5/words/1"
            ]
          },
          "Items":{ 
            "type":"array",
            "valueArray":[ 
              { 
                "type":"object",
                "valueObject":{ 
                  "Name":{ 
                    "type":"string",
                    "valueString":"8GB RAM (Black)",
                    "text":"8GB RAM (Black)",
                    "boundingBox":[ 
                      370.704559,
                      1781.30469,
                      731,
                      1785,
                      730.2923,
                      1854.00293,
                      369.996826,
                      1850.30762
                    ],
                    "pageNumber":1,
                    "confidence":0.2663407027721405,
                    "elements":[ 
                      "#/readResults/0/lines/9/words/0",
                      "#/readResults/0/lines/9/words/1",
                      "#/readResults/0/lines/9/words/2"
                    ]
                  },
                  "TotalPrice":{ 
                    "type":"number",
                    "valueNumber":999,
                    "text":"$999.00",
                    "boundingBox":[ 
                      942.147,
                      1781.32581,
                      1135.95691,
                      1789.07825,
                      1132.85144,
                      1866.714,
                      939.041565,
                      1858.96167
                    ],
                    "pageNumber":1,
                    "confidence":0.45141306519508362,
                    "elements":[ 
                      "#/readResults/0/lines/10/words/0",
                      "#/readResults/0/lines/10/words/1"
                    ]
                  }
                },
                "pageNumber":1
              },
              ...
            ],
            "pageNumber":1
          },
          "Subtotal":{ 
            "type":"number",
            "valueNumber":1098.99,
            "text":"1098.99",
            "boundingBox":[ 
              964.73114,
              2251.99316,
              1132.73071,
              2246.97827,
              1135,
              2323,
              967.0004,
              2328.015
            ],
            "pageNumber":1,
            "confidence":0.96126359701156616,
            "elements":[ 
              "#/readResults/0/lines/14/words/1"
            ]
          },
          "Tax":{ 
            "type":"number",
            "valueNumber":104.4,
            "text":"$104.40",
            "boundingBox":[ 
              948.058533,
              2366.65137,
              1133.05762,
              2361.61743,
              1135,
              2433,
              950.0009,
              2438.034
            ],
            "pageNumber":1,
            "confidence":0.78252553939819336,
            "elements":[ 
              "#/readResults/0/lines/16/words/0",
              "#/readResults/0/lines/16/words/1"
            ]
          },
          "Total":{ 
            "type":"number",
            "valueNumber":1203.39,
            "text":"1203.39",
            "boundingBox":[ 
              962.011047,
              2593.89551,
              1124,
              2611,
              1116.81091,
              2679.08545,
              954.821838,
              2661.9812
            ],
            "pageNumber":1,
            "confidence":0.9648091197013855,
            "elements":[ 
              "#/readResults/0/lines/18/words/1"
            ]
          }
        }
      }
    ]
  }
}
```

## Next steps

In this quickstart, you used the Form Recognizer REST API with cURL to extract the contents of a sales receipt. Next, see the reference documentation to explore the Form Recognizer API in more depth.

> [!div class="nextstepaction"]
> [REST API reference documentation](https://westus2.dev.cognitive.microsoft.com/docs/services/form-recognizer-api/operations/AnalyzeReceipt)
