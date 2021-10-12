---
title: Submit a Custom Named Entity Recognition (NER) task
titleSuffix: Azure Cognitive Services
description: Learn about sending a request for Custom Named Entity Recognition (NER).
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: aahi
---

# Submit a Custom Named Entity Recognition (NER) task

After deploying your model, it is ready to be used. You can only send entity recognition tasks through the API, not from Language Studio.

## Prerequisites

* A [Custom NER project](../quickstart.md) with:
    * [Tagged data](tag-data.md)
    * A successfully trained and deployed model 
* [cURL](https://curl.haxx.se/) installed

## Submit a job to the API

1. Go to your project in [Language Studio](https://language.azure.com/customText/projects/extraction).

2. Select **Deploy model** from the left side menu.

3. make sure your model you want to use is deployed, and click on **Get prediction URL**.

4. In the window that appears under the **Submit** pivot, and copy the sample request into a text editor. 

    :::image type="content" source="../media/get-prediction-url.png" alt-text="Screenshot showing the prediction request and URL" lightbox="../media/get-prediction-url.png":::

5. Replace `<YOUR_DOCUMENT_HERE>` with the actual text you want to extract entities from.

6. Submit the `POST` cURL request in your terminal or command prompt. You'll receive a 202 response if the request was successful.


    > [!NOTE]
    > When you send requests using the REST API, you will need to specify your API key, endpoint, and model ID. The example request in Language Studio contains these values. Additionally:
    > * You can find your model ID in **Deploy model**, after your model's status and deployment date.
    > * You can find your key and endpoint in **Project Settings**.


7. In the response header you receive, extract the value from `operation-location` which is formatted as: 

    ```rest
    <YOUR-ENDPOINT>/text/analytics/v3.1-preview.ct.1/analyze/jobs/<jobId>
    ```

    You'll use this endpoint and the `jobId` to get the entity extraction task results. 

## Retrieve the results of your job

1. Select **Retrieve** from the same window you got the example request you got earlier and copy the sample request into a text editor. 

    :::image type="content" source="../media/get-prediction-retrieval-url.png" alt-text="Screenshot showing the prediction retrieval request and URL" lightbox="../media/get-prediction-retrieval-url.png":::

2. Replace `<OPERATION_ID>` with the `jobId` from the previous step. 

3. Submit the `GET` cURL request in your terminal or command prompt. You'll receive a 202 response and JSON similar to the below, if the request was successful.

    ```json
    {
        "createdDateTime": "2021-05-19T14:32:25.578Z",
        "displayName": "MyJobName",
        "expirationDateTime": "2021-05-19T14:32:25.578Z",
        "jobId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "lastUpdateDateTime": "2021-05-19T14:32:25.578Z",
        "status": "completed",
        "errors": [],
        "tasks": {
            "details": {
                "name": "MyJobName",
                "lastUpdateDateTime": "2021-03-29T19:50:23Z",
                "status": "completed"
            },
            "completed": 1,
            "failed": 0,
            "inProgress": 0,
            "total": 1,
            "tasks": {
        "customEntityRecognitionTasks": [
            {
                "lastUpdateDateTime": "2021-05-19T14:32:25.579Z",
                "name": "MyJobName",
                "status": "completed",
                "results": {
                    "documents": [
                        {
                            "id": "doc1",
                            "entities": [
                                {
                                    "text": "Government",
                                    "category": "restaurant_name",
                                    "offset": 23,
                                    "length": 10,
                                    "confidenceScore": 0.0551877357
                                }
                            ],
                            "warnings": []
                        },
                        {
                            "id": "doc2",
                            "entities": [
                                {
                                    "text": "David Schmidt",
                                    "category": "artist",
                                    "offset": 0,
                                    "length": 13,
                                    "confidenceScore": 0.8022353
                                }
                            ],
                            "warnings": []
                        }
                    ],
                    "errors": [],
                    "statistics": {
                        "documentsCount":0,
                        "validDocumentsCount":0,
                        "erroneousDocumentsCount":0,
                        "transactionsCount":0
                    }
                        }
                    }
                ]
            }
        }
    ```

## Next steps

[Recommended practices](../concepts/recommended-practices.md)