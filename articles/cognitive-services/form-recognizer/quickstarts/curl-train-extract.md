---
title: "Quickstart: Train a model and extract form data using cURL - Form Recognizer"
titleSuffix: Azure Cognitive Services
description: Use the Form Recognizer REST API with cURL to train a model and extract data from forms.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: form-recognizer
ms.topic: quickstart
ms.date: 04/04/2019
ms.author: pafarley
---

# Quickstart: Train a form understanding model and extract form data using cURL

In this quickstart, you will train and score forms to extract key-value pairs and tables using Form Understanding's REST API with cURL.

## Prerequisites

* You must have [cURL](https://curl.haxx.se/windows/).
* You must have a subscription key for Form Understanding. To get a subscription key, see Obtaining Subscription Keys.
* You must install and configure the Form Understanding private preview container. To do so, see [Use containers](form-understanding-how-to-install.md)
* You must have a minimum set of five forms of the same type located in the container's mounted **/input** directory. You can use a [sample dataset](sample_data.zip) for this quickstart.

## Create a training dataset

First, you will create a new dataset process request. The training dataset should consist of a minimum of five forms (PDF documents and/or images) of the same type (structure) or an empty form (the empty form's filename must include the word empty).

A dataset is created by pointing to a mount location to the `Forms` REST API via the `dataRef` parameter and giving a unique name. When executed the API returns a `202` http response and a response json that contains the identifier for the new dataset that is being processed.
To run the sample command, do the following steps:

1. Copy the following command into a text editor

    ```bash
    curl -X POST "http://localhost:5000/forms/v1.0/dataset" --data "{\"name\": \"<dataset name>\",\"dataRef\": \"/input/<dataset path>\"}" -H "Content-Type: application/json"
    ```

1. Make the following changes to the command:

   * Replace `<dataset name>` with a name for the dataset
   * Replace `<dataset path>` with the path to your training dataset

   **NOTE:** The `dataRef` parameter is always relative to the input mount root path, which is **/input** by default. Therefore, all `dataRef` attribute values are relative to this path. For example, if the value is `/input/dataset`, it's expected that the **/dataset** folder is present under the path that was mapped to **/input**.
1. Open a command prompt window, paste the command from the text editor, and run the command.
1. You should receive a `202 (Accepted)` response with the following JSON output:

    ```json
    {"purpose":"train","state":"created","id":1,"name":"<dataset name>","dataRef":"/input/<dataset path>"}
    ```

1. Take note of the `"id"` value; you will need it for the following steps.

## Train a Form understanding model

To train a new Form understanding model using the documents in the dataset, execute the following cURL command. Replace `<id>` with your dataset ID:

```bash
curl -X POST --data "" "http://localhost:5000/forms/v1.0/dataset/<id>/train"
```

You will receive a `200 (Success)` response with the following JSON output:

```json
{"modelVersion":{"versionId":1,"modelId":1,"modelRef":"/output/datasets/<dataset name>/models/1260d261-2737-4b29-ac18-b578fab103b1.gz","isActive":true}}
```

Take note of the `"modelId"` value; you will need it for the following steps.
  
## Extract key-value pairs and tables from forms

Next, you will score all the documents in the dataset (batch scoring). Copy the following command, replacing `<model Id>` with your model ID and `<id>` with your dataset ID. Then execute the command.

```bash
curl -X POST --data "{\"modelId\": <model Id> }" "http://localhost:5000/forms/v1.0/dataset/<id>/score"
```

### Examine the response

A successful response is returned in JSON and represents the extracted key-value pairs and tables for all documents in the dataset.

```bash
{  
  "documents":[  
    {  
      "dataRef":"/tmp/tmpsqme4w7n/4c73a76f-fa4e-4b5f-97a1-267f0fbf089e.pdf",
      "pages":[  
        {  
          "number":1,
          "height":792,
          "width":612,
          "clusterId":0,
          "keyValuePairs":[  
            {  
              "key":[  
                {  
                  "text":"Invoice For:",
                  "boundingBox":[  
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
              "value":[  
                {  
                  "text":"Contoso",
                  "boundingBox":[  
                    374,
                    687.9,
                    414.4,
                    687.9,
                    414.4,
                    673.7,
                    374,
                    673.7
                  ],
                  "confidence":0.7
                },
                {  
                  "text":"456 49th st",
                  "boundingBox":[  
                    374.3,
                    673.5,
                    425.8,
                    673.5,
                    425.8,
                    659.2,
                    374.3,
                    659.2
                  ],
                  "confidence":0.7
                },
                {  
                  "text":"New York, NY 87643",
                  "boundingBox":[  
                    374.2,
                    658.9,
                    469.3,
                    658.9,
                    469.3,
                    645.3,
                    374.2,
                    645.3
                  ],
                  "confidence":0.7
                }
              ]
            },
            ...
```

## Next steps

Try Form Understanding on your data and explore the Form Understanding API.