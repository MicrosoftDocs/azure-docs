---
title: "Quickstart: Train a model and extract form data using cURL - Form Recognizer"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you will use the Form Recognizer REST API with cURL to train a model and extract data from forms.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: form-recognizer
ms.topic: quickstart
ms.date: 04/15/2019
ms.author: pafarley
#Customer intent: As a developer or data scientist familiar with cURL, I want to learn how to use Form Recognizer to extract my form data.
---

# Quickstart: Train a Form Recognizer model and extract form data using REST API with cURL

In this quickstart, you will use using Form Recognizer's REST API with cURL to train and score forms to extract key-value pairs and tables.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* You got access to the Form Recognizer limited-access preview. To get access to the preview, please fill out and submit the [Cognitive Services Form Recognizer access request](https://aka.ms/FormRecognizerRequestAccess) form. 
* You must have [cURL](https://curl.haxx.se/windows/).
* You must have a subscription key for Form Recognizer. Follow the instructions in [Create a Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) to subscribe to Form Recognizer and get your key.
* You must have a minimum set of five forms of the same type. You can use a [sample dataset](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/curl/form-recognizer/sample_data.zip) for this quickstart.

## Train a Form Recognizer model

First, you will need a set of training data. You can use data in an Azure Blob or your own local training data. You should have a minimum of five sample forms (PDF documents and/or images) of the same type/structure as your main input data. Alternatively, you can use a single empty form; the form's filename includes the word "empty."

To train a Form Recognizer model using the documents in your Azure Blob container, call the **Train** API by executing the cURL command below. Before running the command, make the following changes:

* Replace `<Azure region>` with the Azure region where you obtained your Form Recognizer subscription key. You can find it in your Form Recognizer resource overview tab.
* Replace `<SAS URL>` with an Azure Blob Storage container shared access signature (SAS) URL where the training data is located.  

```bash
curl -X POST "http://<Azure region>/formrecognizer/v1.0-preview/custom/train" -H "accept: application/json" -H "Content-Type: application/json-patch+json" -d "{ \"source\": \"<SAS URL>\"}"
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

Next, you will analyze a document and extract key-value pairs and tables from it. Call the **Model - Analyze** API by executing the cURL command below. Before running the command, make the following changes:

* Replace `<Azure region>` with the Azure region where you obtained your Form Recognizer subscription key.
* Replace `<modelID>` with the model ID you received in the previous step of training the model.
* Replace `</path/to/my/Invoice_1.pdf>` with the path to the file you would like to analyze from the sample data.
* Replace `<pdf>` with the file type you are analyzing. Supported values are `pdf`, `image/jpeg`, and `image/png`.

```bash
curl -X POST "http://<Azure region>/formrecognizer/v1.0-preview/custom/model/<modelID>/analyze" -H "accept: application/json" -H "Content-Type: multipart/form-data" -F "form=@</path/to/my/Invoice_1.pdf>;type=application/<pdf>"
```

### Examine the response

A successful response is returned in JSON and represents the extracted key-value pairs and tables for all documents in the dataset.

```bash
{
  "formResults": {
    "documents": [
      {
        "dataRef": "streamed-in.pdf",
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
                      642.9,
                      85,
                      642.9,
                      85,
                      631.9,
                      57.4,
                      631.9
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
        ]
      }
    ]
  },
  "scoreReport": [
    {
      "dataRef": "streamed-in.pdf",
      "errors": [],
      "pages": 1,
      "status": "success"
    }
  ],
  "totalPages": 1,
  "processReport": [
    {
      "dataRef": "streamed-in.pdf",
      "errors": [],
      "pages": 1,
      "status": "success"
    }
  ]
}
```

## Next steps

In this guide, you used the Form Recognizer REST APIs with cURL to train a model and run it in a sample case. Next, see the reference documentation to explore the Form Recognizer API in more depth.

> [!div class="nextstepaction"]
> [REST API reference documentation](https://aka.ms/form-recognizer/api)