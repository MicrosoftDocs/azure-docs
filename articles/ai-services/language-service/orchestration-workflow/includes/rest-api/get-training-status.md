---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 05/17/2022
ms.author: aahi
---

Use the following **GET** request to get the status of your model's training progress. Replace the placeholder values below with your own values. 

### Request URL

```rest
{ENDPOINT}/language/authoring/analyze-conversations/projects/{PROJECT-NAME}/train/jobs/{JOB-ID}?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.   | `EmailApp` |
|`{JOB-ID}`     | The ID for locating your model's training status. This is in the `location` header value you received when submitted your training job.  | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx` |
|`{API-VERSION}`     | The [version](../../../concepts/model-lifecycle.md#api-versions) of the API you are calling. | `2023-04-01` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|


### Response Body

Once you send the request, you will get the following response. Keep polling this endpoint until the **status** parameter changes to "succeeded". 

```json
{
  "result": {
    "modelLabel": "{MODEL-LABEL}",
    "trainingConfigVersion": "{TRAINING-CONFIG-VERSION}",
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
  "jobId": "xxxxxx-xxxxx-xxxxxx-xxxxxx",
  "createdDateTime": "2022-04-18T15:44:44Z",
  "lastUpdatedDateTime": "2022-04-18T15:45:48Z",
  "expirationDateTime": "2022-04-25T15:44:44Z",
  "status": "running"
}
```

|Key  |Value  | Example |
|---------|----------|--|
| `modelLabel` |The model name| `Model1` |
| `trainingConfigVersion` | The training configuration version. By default, the [latest version](../../../concepts/model-lifecycle.md#choose-the-model-version-used-on-your-data) is used. | `2022-05-01` |
| `startDateTime` | The time training started  |`2022-04-14T10:23:04.2598544Z`|
| `status` | The status of the training job | `running`|
|`estimatedEndDateTime` | Estimated time for the training job to finish| `2022-04-14T10:29:38.2598544Z`|
|`jobId`| Your training job ID| `xxxxx-xxxx-xxxx-xxxx-xxxxxxxxx`|
|`createdDateTime`| Training job creation date and time | `2022-04-14T10:22:42Z`|
|`lastUpdatedDateTime`| Training job last updated date and time | `2022-04-14T10:23:45Z`|
|`expirationDateTime`| Training job expiration date and time | `2022-04-14T10:22:42Z`|
