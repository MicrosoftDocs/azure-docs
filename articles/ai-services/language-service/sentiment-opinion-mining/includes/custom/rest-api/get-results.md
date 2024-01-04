---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 12/19/2023
ms.author: aahi
---


Use the following **GET** request to query the status/results of the custom entity recognition task. 

```rest
{ENDPOINT}/language/analyze-text/jobs/{JOB-ID}?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{API-VERSION}`     | The version of the API you're calling. The value referenced here is for the latest version released. <!--See [Model lifecycle](../../../concepts/model-lifecycle.md#choose-the-model-version-used-on-your-data) to learn more about other available API versions.-->  | `2023-04-15-preview` |

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your key that provides access to this API.|

### Response Body

The response is a JSON document with the following parameters

```json
{
  "createdDateTime": "2021-05-19T14:32:25.578Z",
  "displayName": "MyJobName",
  "expirationDateTime": "2021-05-19T14:32:25.578Z",
  "jobId": "xxxx-xxxx-xxxxx-xxxxx",
  "lastUpdateDateTime": "2021-05-19T14:32:25.578Z",
  "status": "succeeded",
  "tasks": {
    "completed": 1,
    "failed": 0,
    "inProgress": 0,
    "total": 1,
    "items": [
      {
        "kind": "EntityRecognitionLROResults",
        "taskName": "Recognize Entities",
        "lastUpdateDateTime": "2020-10-01T15:01:03Z",
        "status": "succeeded",
        "results": {
          "documents": [
            {
              "entities": [
                {
                  "category": "Event",
                  "confidenceScore": 0.61,
                  "length": 4,
                  "offset": 18,
                  "text": "trip"
                },
                {
                  "category": "Location",
                  "confidenceScore": 0.82,
                  "length": 7,
                  "offset": 26,
                  "subcategory": "GPE",
                  "text": "Seattle"
                },
                {
                  "category": "DateTime",
                  "confidenceScore": 0.8,
                  "length": 9,
                  "offset": 34,
                  "subcategory": "DateRange",
                  "text": "last week"
                }
              ],
              "id": "1",
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

