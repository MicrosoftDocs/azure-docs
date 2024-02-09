---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 07/19/2023
ms.author: aahi
---

Create a **DELETE** request using the following URL, headers, and JSON body to delete a deployment.


### Request URL

```rest
{Endpoint}/language/authoring/analyze-text/projects/{PROJECT-NAME}/deployments/{deploymentName}?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.   | `myProject` |
|`{DEPLOYMENT-NAME}`     | The name for your deployment name. This value is case-sensitive.   | `prod` |
|`{API-VERSION}`     | The version of the API you are calling. The value referenced here is for the latest version released. See [Model lifecycle](../../../../concepts/model-lifecycle.md#choose-the-model-version-used-on-your-data) to learn more about other available API versions.  | `2023-04-15-preview` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|


Once you send your API request, you will receive a `202` response indicating success, which means your deployment has been deleted. A successful call results with an `Operation-Location` header used to check the status of the job.


