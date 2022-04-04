---
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 11/17/2021
ms.author: aahi
---

#### Custom text classification task results

The response returned from the Get result call will be a JSON document with the following parameters:

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
    "customMultiClassificationTasks": [
    {
        "lastUpdateDateTime": "2021-05-19T14:32:25.579Z",
        "name": "MyJobName",
        "status": "completed",
        "results": {
            "documents": [
                {
                    "id": "doc1",
                    "classes": [
                        {
                            "category": "Class_1",
                            "confidenceScore": 0.0551877357
                        }
                    ],
                    "warnings": []
                },
                {
                    "id": "doc2",
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
