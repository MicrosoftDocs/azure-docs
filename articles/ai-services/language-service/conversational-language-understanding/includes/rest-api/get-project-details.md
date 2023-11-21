---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 05/16/2022
ms.author: aahi
---

Use the following **GET** request to get your project details. You can use the URL you received from the previous step, or replace the placeholder values below with your own values. 

```rest
{ENDPOINT}/language/authoring/analyze-conversations/projects/{PROJECT-NAME}?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |
|`{API-VERSION}`     | The [version](../../../concepts/model-lifecycle.md#api-versions) of the API you are calling. | `2023-04-01` |

#### Headers

Use the following header to authenticate your request. 

|Key|Description|Value|
|--|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.| `{YOUR-PRIMARY-RESOURCE-KEY}` |

#### Response body

```json
{
  "createdDateTime": "2022-04-18T13:53:03Z",
  "lastModifiedDateTime": "2022-04-18T13:53:03Z",
  "lastTrainedDateTime": "2022-04-18T14:14:28Z",
  "lastDeployedDateTime": "2022-04-18T14:49:01Z",
  "projectKind": "Conversation",
  "projectName": "{PROJECT-NAME}",
  "multilingual": true,
  "description": "This is a sample conversation project.",
  "language": "{LANGUAGE-CODE}"
}
```
