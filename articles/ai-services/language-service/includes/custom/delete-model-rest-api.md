---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 04/14/2023
ms.author: aahi
---

Create a **DELETE** request using the following URL, headers, and JSON body to delete a trained model.


### Request URL

```rest
{Endpoint}/language/authoring/analyze-text/projects/{PROJECT-NAME}/models/{trainedModelLabel}?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.   | `myProject` |
|`{trainedModelLabel}`     | The name for your model name. This value is case-sensitive.   | `model1` |
|`{API-VERSION}`     | The version of the API you're calling. The value referenced here is for the latest version released. See [Model lifecycle](../../concepts/model-lifecycle.md) to learn more about other available API versions.  | `2022-05-01` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|


Once you send your API request, you'll receive a `204` response indicating success, which means your trained model has been deleted.
