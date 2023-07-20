---
titleSuffix: Azure AI services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 05/06/2022
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
|`{API-VERSION}`     | The version of the API you are calling. See [Model lifecycle](../../../concepts/model-lifecycle.md#choose-the-model-version-used-on-your-data) to learn more about other available API versions.  | `2022-05-01` |

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
        "projectKind": "CustomEntityRecognition",
        "storageInputContainerName": "{CONTAINER-NAME}",
        "projectName": "{PROJECT-NAME}",
        "multilingual": false,
        "description": "Project description",
        "language": "{LANGUAGE-CODE}"
    }
```

|Value | Placeholder  | Description | Example |
|---------|---------|---------|---------|
| `projectKind` | `CustomEntityRecognition` | Your project kind. | `CustomEntityRecognition` |
| `storageInputContainerName` | `{CONTAINER-NAME}` | The name of your Azure storage container where you have uploaded your documents.   | `myContainer` |
| `projectName` | `{PROJECT-NAME}` | The name of your project. This value is case-sensitive. | `myProject` |
| `multilingual` | `true`| A boolean value that enables you to have documents in multiple languages in your dataset and when your model is deployed you can query the model in any supported language (not necessarily included in your training documents. For more information about multilingual support, see [Language support](../../language-support.md#multi-lingual-option). | `true`|
| `language` | `{LANGUAGE-CODE}` |  A string specifying the language code for the documents used in your project. If your project is a multilingual project, choose the [language code](../../language-support.md) of the majority of the documents. |`en-us`|

Once you send your API request, you will receive a `200` response indicating success and JSON response body with your project details.
