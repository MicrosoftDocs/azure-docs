---
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 05/06/2022
ms.author: aahi
---


To get custom named entity recognition project details, submit a **GET** request using the following URL and headers. Replace the placeholder values with your own values.   

```rest
{ENDPOINT}/language/authoring/analyze-text/projects/{PROJECT-NAME}?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |
|`{API-VERSION}`     | The version of the API you are calling. The value referenced here is for the latest released [model version](../../../concepts/model-lifecycle.md#choose-the-model-version-used-on-your-data).  | `2022-03-01-preview` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| The key to your resource. Used for authenticating your API requests.|

### Response Body

Once you send the request, you will get the following response. 
```json
{
  "createdDateTime": "2022-04-23T13:39:09.384Z",
  "lastModifiedDateTime": "2022-04-23T13:39:09.384Z",
  "lastTrainedDateTime": "2022-04-23T13:39:09.384Z",
  "lastDeployedDateTime": "2022-04-23T13:39:09.384Z",
  "projectKind": "customNamedEntityRecognition",
  "storageInputContainerName": "string",
  "settings": {},
  "projectName": "string",
  "multilingual": true,
  "description": "string",
  "language": "string"
}

```
|Value | Placeholder  | Description | Example |
|---------|---------|---------|---------|
| `projectKind` | `customNamedEntityRecognition` | Your project kind. | `customNamedEntityRecognition` |
| `storageInputContainerName` | `{CONTAINER-NAME}` | The name of your Azure storage container where you have uploaded your documents.   | `myContainer` |
| `projectName` | `{PROJECT-NAME}` | The name of your project. This value is case-sensitive. | `myProject` |
| `multilingual` | `true`| A boolean value that enables you to have documents in multiple languages in your dataset and when your model is deployed you can query the model in any supported language (not necessarily included in your training documents. For more information about multilingual support, see [Language support](../../language-support.md#multi-lingual-option). | `true`|
| `language` | `{LANGUAGE-CODE}` |  A string specifying the language code for the documents used in your project. If your project is a multilingual project, choose the [language code](../../language-support.md) of the majority of the documents. |`en-us`|

Once you send your API request, you will receive a `202` response indicating success and JSON response body with your project details.
