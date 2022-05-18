---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 05/17/2022
ms.author: aahi
---

Create a **DELETE** request using the following URL, headers, and JSON body to delete an orchestration workflow project.


### Request URL

```rest
{ENDPOINT}/language/analyze-conversations/projects/{PROJECT-NAME}?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.   | `myProject` |
|`{API-VERSION}`     | The version of the API you are calling. The value refrenced here is for the latest version released. Learn more about other available [API versions](../../../concepts/model-lifecycle.md#api-versions)  | `2022-03-01-preview` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|
|`Content-Type` | application/json |


Once you send your API request, you will receive a `202` response indicating success, which means your project has been deleted.
