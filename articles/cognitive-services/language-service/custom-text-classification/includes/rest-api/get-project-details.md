---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 05/05/2022
ms.author: aahi
---

Use the following **GET** request to get your project details. Replace the placeholder values below with your own values. 

```rest
{ENDPOINT}/language/authoring/analyze-text/projects/{PROJECT-NAME}?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |
|`{API-VERSION}`     | The version of the API you are calling. The value referenced here is for the latest version released. Learn more about other available [API versions](../../../concepts/model-lifecycle.md#choose-the-model-version-used-on-your-data)  | `2022-03-01-preview` |

#### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|

#### Response body

```json
    {
        "createdDateTime": "2021-10-19T23:24:41.572Z",
        "lastModifiedDateTime": "2021-10-19T23:24:41.572Z",
        "lastTrainedDateTime": "2021-10-19T23:24:41.572Z",
        "lastDeployedDateTime": "2021-10-19T23:24:41.572Z",
        "modelType": "{MODEL-TYPE}",
        "storageInputContainerName": "{CONTAINER-NAME}",
        "name": "myProject",
        "multiLingual": true,
        "description": "string",
        "language": "en-us",
        "settings": {}
    }
```
