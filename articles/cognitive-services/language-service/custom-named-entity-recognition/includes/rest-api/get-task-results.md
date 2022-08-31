---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 04/06/2022
ms.author: aahi
---

`{YOUR-ENDPOINT}/text/analytics/v3.2-preview.2/analyze/jobs/<jobId>`.

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your key that provides access to this API.|

### Response Body

The response will be a JSON document with the following parameters

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

## Clean up resources

When you no longer need your project, you can delete it with the following **DELETE** request. Replace the placeholder values with your own values.   

```rest
{YOUR-ENDPOINT}/language/text/authoring/v1.0-preview.2/projects/{PROJECT-NAME}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| The key to your resource. Used for authenticating your API requests.|
