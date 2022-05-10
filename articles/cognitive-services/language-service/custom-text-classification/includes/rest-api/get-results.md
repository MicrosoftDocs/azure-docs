---
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 05/04/2022
ms.author: aahi
---


Use the following **GET** request to query the status/results of the custom classification task. You can use the endpoint you received from the previous step.

`{ENDPOINT}/text/analytics/v3.2-preview.2/analyze/jobs/<jobId>`.

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your Subscription key that provides access to this API.|

### Response body

The response will be a JSON document with the following parameters.

# [Multi label classification](#tab/multi-classification)

```json
{
    "createdDateTime": "2021-05-19T14:32:25.578Z",
    "displayName": "{JOB-NAME}",
    "expirationDateTime": "2021-05-19T14:32:25.578Z",
    "jobId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "lastUpdateDateTime": "2021-05-19T14:32:25.578Z",
    "status": "completed",
    "errors": [],
    "tasks": {
        "details": {
            "name": "{JOB-NAME}",
            "lastUpdateDateTime": "2021-03-29T19:50:23Z",
            "status": "completed"
        },
        "completed": 1,
        "failed": 0,
        "inProgress": 0,
        "total": 1,
        "tasks": {
    "customMultiClassificationTasks": [
        {
            "lastUpdateDateTime": "2021-05-19T14:32:25.579Z",
            "name": "{JOB-NAME}",
            "status": "completed",
            "results": {
                "documents": [
                    {
                        "id": "{DOC-ID}",
                        "classes": [
                            {
                                "category": "Class_1",
                                "confidenceScore": 0.0551877357
                            }
                        ],
                        "warnings": []
                    },
                    {
                        "id": "{DOC-ID}",
                        "classes": [
                            {
                                "category": "Class_1",
                                "confidenceScore": 0.0551877357
                            },
                                                        {
                                "category": "Class_2",
                                "confidenceScore": 0.0551877357
                            }
                        ],
                        "warnings": []
                    }
                ],
                "errors": [],
                "statistics": {
                    "documentsCount":0,
                    "erroneousDocumentsCount":0,
                    "transactionsCount":0
                }
                    }
                }
            ]
        }
    }
```

# [Single label classification](#tab/single-classification)


```json
{
    "createdDateTime": "2021-05-19T14:32:25.578Z",
    "displayName": "{JOB-NAME}",
    "expirationDateTime": "2021-05-19T14:32:25.578Z",
    "jobId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "lastUpdateDateTime": "2021-05-19T14:32:25.578Z",
    "status": "completed",
    "errors": [],
    "tasks": {
        "details": {
            "name": "{JOB-NAME}",
            "lastUpdateDateTime": "2021-03-29T19:50:23Z",
            "status": "completed"
        },
        "completed": 1,
        "failed": 0,
        "inProgress": 0,
        "total": 1,
        "tasks": {
    "customSingleClassificationTasks": [
        {
            "lastUpdateDateTime": "2021-05-19T14:32:25.579Z",
            "name": "{JOB-NAME}",
            "status": "completed",
            "results": {
                "documents": [
                    {
                        "id": "{DOC-ID}",
                        "classes": [
                            {
                                "category": "Class_1",
                                "confidenceScore": 0.0551877357
                            }
                        ],
                        "warnings": []
                    },
                    {
                        "id": "{DOC-ID}",
                        "classes": [
                            {
                                "category": "Class_2",
                                "confidenceScore": 0.0551877357
                            }
                        ],
                        "warnings": []
                    }
                ],
                "errors": [],
                "statistics": {
                    "documentsCount":0,
                    "erroneousDocumentsCount":0,
                    "transactionsCount":0
                }
                    }
                }
            ]
        }
    }
```

---
