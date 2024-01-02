---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 12/19/2023
ms.author: aahi
---

Use the following **GET** request to query the status of the deployment job. You can use the URL you received from the previous step, or replace the placeholder values below with your own values. 

```rest
{ENDPOINT}/language/authoring/analyze-text/projects/{PROJECT-NAME}/deployments/{DEPLOYMENT-NAME}/jobs/{JOB-ID}?api-version={API-VERSION}
```

| Placeholder |Value | Example |
|---------|---------|---------|
| `{ENDPOINT}` | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
| `{PROJECT-NAME}` | The name of your project. This value is case-sensitive.   | `myProject` |
| `{DEPLOYMENT-NAME}`     | The name of your deployment. This value is case-sensitive.  | `staging` |
|`{JOB-ID}`     | The ID for locating your model's training status. This is in the `location` header value you received in the previous step.  | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx` |
|`{API-VERSION}`     | The version of the API you are calling. The value referenced here is for the latest version released. See [Model lifecycle](../../../concepts/model-lifecycle.md#choose-the-model-version-used-on-your-data) to learn more about other available API versions.  | `2022-05-01` |

#### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|


### Response Body

Once you send the request, you will get the following response. Keep polling this endpoint until the **status** parameter changes to "succeeded". You should get a `200` code to indicate the success of the request. 

```json
{
    "jobId":"{JOB-ID}",
    "createdDateTime":"{CREATED-TIME}",
    "lastUpdatedDateTime":"{UPDATED-TIME}",
    "expirationDateTime":"{EXPIRATION-TIME}",
    "status":"running"
}
```

