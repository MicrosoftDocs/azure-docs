---
titleSuffix: Azure AI services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 03/17/2023
ms.author: aahi
ms.custom: language-service-clu 
---

When you send a successful project import request, the full request URL for checking the import job's status (including your endpoint, project name, and job ID) is contained in the response's `operation-location` header. 

Use the following **GET** request to query the status of your import job. You can use the URL you received from the previous step, or replace the placeholder values with your own values. 

```rest
{ENDPOINT}/language/authoring/analyze-conversations/projects/{PROJECT-NAME}/import/jobs/{JOB-ID}?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |
|`{JOB-ID}`     | The ID for locating your import job status.  | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx` |
|`{API-VERSION}`     | The [version](../../../concepts/model-lifecycle.md#api-versions) of the API you are calling. | `2023-04-01` |

#### Headers

Use the following header to authenticate your request. 

|Key|Description|Value|
|--|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.| `{YOUR-PRIMARY-RESOURCE-KEY}` |

#### Response body

Once you send the request, you'll get the following response. Keep polling this endpoint until the status parameter changes to "succeeded".


```json
{
  "jobId": "xxxxx-xxxxx-xxxx-xxxxx",
  "createdDateTime": "2022-04-18T15:17:20Z",
  "lastUpdatedDateTime": "2022-04-18T15:17:22Z",
  "expirationDateTime": "2022-04-25T15:17:20Z",
  "status": "succeeded"
}
```

