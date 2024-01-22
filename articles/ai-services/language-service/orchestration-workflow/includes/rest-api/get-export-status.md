---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 12/19/2023
ms.author: aahi
---
Use the following **GET** request to query the status of your export job. You can use the URL you received from the previous step, or replace the placeholder values below with your own values. 

```rest
{ENDPOINT}/language/authoring/analyze-conversations/projects/{PROJECT-NAME}/export/jobs/{JOB-ID}?api-version={API-VERSION}
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

```json
{
  "resultUrl": "{Endpoint}/language/authoring/analyze-conversations/projects/{PROJECT-NAME}/export/jobs/xxxxxx-xxxxx-xxxxx-xx/result?api-version={API-VERSION}",
  "jobId": "xxxx-xxxxx-xxxxx-xxx",
  "createdDateTime": "2022-04-18T15:23:07Z",
  "lastUpdatedDateTime": "2022-04-18T15:23:08Z",
  "expirationDateTime": "2022-04-25T15:23:07Z",
  "status": "succeeded"
}
```

Use the URL from the `resultUrl` key in the body to view the exported assets from this job.

### Get export results

Submit a **GET** request using the `{RESULT-URL}` you received from the previous step to view the results of the export job.

#### Headers

Use the following header to authenticate your request. 

|Key|Description|Value|
|--|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.| `{PRIMARY-RESOURCE-KEY}` |
