---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 12/19/2023
ms.author: aahi
---


Create a **POST** request using the following URL, headers, and JSON body to start a swap deployments job.


### Request URL

```rest
{ENDPOINT}/language/authoring/analyze-conversations/projects/{PROJECT-NAME}/deployments/:swap?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.   | `myProject` |
|`{API-VERSION}`     | The [version](../../../concepts/model-lifecycle.md#api-versions) of the API you are calling. | `2023-04-01` |


### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|

### Request Body

```json
{
  "firstDeploymentName": "{FIRST-DEPLOYMENT-NAME}",
  "secondDeploymentName": "{SECOND-DEPLOYMENT-NAME}"
}
```


|Key|Placeholder| Value| Example|
|--|--|--|--|
|firstDeploymentName |`{FIRST-DEPLOYMENT-NAME}`| The name for your first deployment. This value is case-sensitive.   | `production` |
|secondDeploymentName | `{SECOND-DEPLOYMENT-NAME}`|The name for your second deployment. This value is case-sensitive.   | `staging` |

Once you send your API request, you will receive a `202` response indicating success.
