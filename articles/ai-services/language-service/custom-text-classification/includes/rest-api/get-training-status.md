---
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 04/05/2022
ms.author: aahi
---

Use the following **GET** request to get the status of your model's training progress. Replace the placeholder values below with your own values. 

### Request URL

```rest
{ENDPOINT}/language/authoring/analyze-text/projects/{PROJECT-NAME}/train/jobs/{JOB-ID}?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name of your project. This value is case-sensitive.   | `myProject` |
|`{JOB-ID}`     | The ID for locating your model's training status. This value is in the `location` header value you received in the previous step.  | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx` |
|`{API-VERSION}`     | The version of the API you are calling. The value referenced here is for the latest version released. See [model lifecycle](../../../concepts/model-lifecycle.md#choose-the-model-version-used-on-your-data) to learn more about other available API versions.  | `2022-05-01` |

#### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|

#### Response Body

Once you send the request, you’ll get the following response. 

```json
{
  "result": {
    "modelLabel": "{MODEL-NAME}",
    "trainingConfigVersion": "{CONFIG-VERSION}",
    "estimatedEndDateTime": "2022-04-18T15:47:58.8190649Z",
    "trainingStatus": {
      "percentComplete": 3,
      "startDateTime": "2022-04-18T15:45:06.8190649Z",
      "status": "running"
    },
    "evaluationStatus": {
      "percentComplete": 0,
      "status": "notStarted"
    }
  },
  "jobId": "{JOB-ID}",
  "createdDateTime": "2022-04-18T15:44:44Z",
  "lastUpdatedDateTime": "2022-04-18T15:45:48Z",
  "expirationDateTime": "2022-04-25T15:44:44Z",
  "status": "running"
}

```
