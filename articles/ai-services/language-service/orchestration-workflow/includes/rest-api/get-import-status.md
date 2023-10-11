---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 05/19/2022
ms.author: aahi
---
Use the following **GET** request to query the status of your import job. You can use the URL you received from the previous step, or replace the placeholder values below with your own values. 

```rest
{ENDPOINT}/language/authoring/analyze-conversations/projects/{PROJECT-NAME}/import/jobs/{JOB-ID}?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |
|`{JOB-ID}`     | The ID for locating your export job status. This is in the `location` header value you received in the previous step.  | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx` |
|`{API-VERSION}`     | The [version](../../../concepts/model-lifecycle.md#api-versions) of the API you are calling. | `2023-04-01` |

#### Headers

Use the following header to authenticate your request. 

|Key|Description|Value|
|--|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.| `{YOUR-PRIMARY-RESOURCE-KEY}` |

#### Response body

Once you send the request, you will get the following response. Keep polling this endpoint until the status parameter changes to "succeeded".


```json
{
  "jobId": "xxxxx-xxxxx-xxxx-xxxxx",
  "createdDateTime": "2022-04-18T15:17:20Z",
  "lastUpdatedDateTime": "2022-04-18T15:17:22Z",
  "expirationDateTime": "2022-04-25T15:17:20Z",
  "status": "succeeded"
}
```

