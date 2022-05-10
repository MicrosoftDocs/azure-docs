---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 05/09/2022
ms.author: aahi
---



Create a **POST** request using the following URL, headers, and JSON body to start a swap deployments job.


### Request URL

```rest
{ENDPOINT}/language/authoring/analyze-text/projects/{PROJECT-NAME}/deployments:swap?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.   | `myProject` |
|`{API-VERSION}`     | The version of the API you are calling. The value referenced here is for the latest version released. Learn more about other available [API versions](../../../concepts/model-lifecycle.md#api-versions)  | `2022-03-01-preview` |


### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|
|`Content-Type` | application/json |

### Request body

```json
{
  "firstDeploymentName": "{FIRST-DEPLOYMENT-NAME}",
  "secondDeploymentName": "{SECOND-DEPLOYMENT-NAME}"
}
```


|Key| value| Example|
|--|--|--|
|firstDeploymentName | The name for your first deployment. This value is case-sensitive.   | `production` |
|secondDeploymentName | The name for your second deployment. This value is case-sensitive.   | `staging` |


Once you send your API request, you will receive a `202` response indicating success.
