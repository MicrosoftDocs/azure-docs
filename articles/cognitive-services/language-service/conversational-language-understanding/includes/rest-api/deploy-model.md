---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 05/16/2022
ms.author: aahi
---

Create a **PUT** request using the following URL, headers, and JSON body to start deploying a conversational language understanding model.


#### Request URL

```rest
{ENDPOINT}/language/authoring/analyze-conversations/projects/{PROJECT-NAME}/deployments/{DEPLOYMENT-NAME}?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.   | `myProject` |
|`{DEPLOYMENT-NAME}`     | The name for your deployment. This value is case-sensitive.   | `staging` |
|`{API-VERSION}`     | The [version](../../../concepts/model-lifecycle.md#api-versions) of the API you are calling. | `2023-04-01` |


#### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|

#### Request Body

```json
{
  "trainedModelLabel": "{MODEL-NAME}",
}
```

|Key  |Placeholder  |Value  | Example |
|---------|---------|-----|----|
| trainedModelLabel | `{MODEL-NAME}` | The model name that will be assigned to your deployment. You can only assign successfully trained models. This value is case-sensitive.   | `myModel` |

Once you send your API request, you will receive a `202` response indicating success. In the response headers, extract the `operation-location` value. It will be formatted like this: 

```rest
{ENDPOINT}/language/authoring/analyze-conversations/projects/{PROJECT-NAME}/deployments/{DEPLOYMENT-NAME}/jobs/{JOB-ID}?api-version={API-VERSION}
``` 

You can use this URL to get the deployment job status.
