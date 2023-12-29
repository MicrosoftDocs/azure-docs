---
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 12/19/2023
ms.author: aahi
---


Create a **POST** request by using the following URL, headers, and JSON body to cancel a training job. 

### Request URL

Use the following URL when creating your API request. Replace the placeholder values below with your own values. 

```rest
{Endpoint}/language/authoring/analyze-text/projects/{PROJECT-NAME}/train/jobs/{JOB-ID}/:cancel?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.   | `EmailApp` |
|`{JOB-ID}`       | This value is the training job ID.|  `XXXXX-XXXXX-XXXX-XX`|
|`{API-VERSION}`     | The version of the API you're calling. The value referenced is for the latest released [model version](../../../concepts/model-lifecycle.md#choose-the-model-version-used-on-your-data).  | `2022-05-01` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|
 
After you send your API request, you'll receive a 202 response with an `Operation-Location` header used to check the status of the job.
