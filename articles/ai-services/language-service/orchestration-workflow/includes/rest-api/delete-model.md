---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 01/27/2022 
ms.author: aahi
ms.custom: ignite-fall-2021
---



Create a **DELETE** request using the following URL, headers, and JSON body to delete a model.


### Request URL

```rest
{ENDPOINT}/language/authoring/analyze-conversations/projects/{projectName}/models/{trainedModelLabel}?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.   | `myProject` |
|`{trainedModelLabel}`     | The name for your model name. This value is case-sensitive.   | `model1` |
|`{API-VERSION}`     | The [version](../../../concepts/model-lifecycle.md#api-versions) of the API you are calling. | `2023-04-01` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|


Once you send your API request, you will receive a `204` response indicating success, which means your model has been deleted.
