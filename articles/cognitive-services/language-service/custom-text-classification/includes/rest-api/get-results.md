---
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 09/28/2022
ms.author: aahi
---

Use the following **GET** request to query the status/results of the text classification task. 

```rest
{ENDPOINT}/language/analyze-text/jobs/{JOB-ID}?api-version={API-VERSION}
```
|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{API-VERSION}`     | The version of the API you're calling. The value referenced here is for the latest released [model version](../../../concepts/model-lifecycle.md#choose-the-model-version-used-on-your-data) version.  | `2022-05-01` |

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your key that provides access to this API.|

### Response body

The response will be a JSON document with the following parameters.

# [Multi label classification](#tab/multi-classification)

```json
{
  "createdDateTime": "2021-05-19T14:32:25.578Z",
  "displayName": "MyJobName",
  "expirationDateTime": "2021-05-19T14:32:25.578Z",
  "jobId": "xxxx-xxxxxx-xxxxx-xxxx",
  "lastUpdateDateTime": "2021-05-19T14:32:25.578Z",
  "status": "succeeded",
  "tasks": {
    "completed": 1,
    "failed": 0,
    "inProgress": 0,
    "total": 1,
    "items": [
      {
        "kind": "customMultiClassificationTasks",
        "taskName": "Classify documents",
        "lastUpdateDateTime": "2020-10-01T15:01:03Z",
        "status": "succeeded",
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
            }
          ],
          "errors": [],
          "modelVersion": "2020-04-01"
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
  "displayName": "MyJobName",
  "expirationDateTime": "2021-05-19T14:32:25.578Z",
  "jobId": "xxxx-xxxxxx-xxxxx-xxxx",
  "lastUpdateDateTime": "2021-05-19T14:32:25.578Z",
  "status": "succeeded",
  "tasks": {
    "completed": 1,
    "failed": 0,
    "inProgress": 0,
    "total": 1,
    "items": [
      {
        "kind": "customSingleClassificationTasks",
        "taskName": "Classify documents",
        "lastUpdateDateTime": "2020-10-01T15:01:03Z",
        "status": "succeeded",
        "results": {
          "documents": [
            {
              "id": "{DOC-ID}",
              "class": [
                  {
                      "category": "Class_1",
                      "confidenceScore": 0.0551877357
                  }
              ],
              "warnings": []
            }
          ],
          "errors": [],
          "modelVersion": "2020-04-01"
        }
      }
    ]
  }
}

```

---
