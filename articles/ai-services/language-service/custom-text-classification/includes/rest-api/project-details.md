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


To get custom text classification project details, submit a **GET** request using the following URL and headers. Replace the placeholder values with your own values.   

```rest
{ENDPOINT}/language/authoring/analyze-text/projects/{PROJECT-NAME}?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |
|`{API-VERSION}`     | The version of the API you're calling. The value referenced here is for the latest released [model version](../../../concepts/model-lifecycle.md#choose-the-model-version-used-on-your-data). | `2022-05-01` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|

### Response Body

Once you send the request, you will get the following response. 
```json
{
  "createdDateTime": "2022-04-23T13:39:09.384Z",
  "lastModifiedDateTime": "2022-04-23T13:39:09.384Z",
  "lastTrainedDateTime": "2022-04-23T13:39:09.384Z",
  "lastDeployedDateTime": "2022-04-23T13:39:09.384Z",
  "projectKind": "customSingleLabelClassification",
  "storageInputContainerName": "{CONTAINER-NAME}",
  "projectName": "{PROJECT-NAME}",
  "multilingual": true,
  "description": "Project description",
  "language": "{LANGUAGE-CODE}"
}

```

|Value | placeholder  | Description | Example |
|---------|---------|---------|---------|
| `projectKind` | `customSingleLabelClassification` | Your project kind. | This value can be `customSingleLabelClassification` or `customMultiLabelClassification`. |
| `storageInputContainerName` | `{CONTAINER-NAME}` | The name of your Azure storage container where you have uploaded your documents.   | `myContainer` |
| `projectName` | `{PROJECT-NAME}` | The name of your project. This value is case-sensitive. | `myProject` |
| `multilingual` | | A boolean value that enables you to have documents in multiple languages in your dataset. When your model is deployed, you can query the model in any supported language (not necessarily included in your training documents. For more information on multilingual support, see [language support](../../language-support.md#multi-lingual-option).  | `true`|
| `language` | `{LANGUAGE-CODE}` |  A string specifying the language code for the documents used in your project. If your project is a multilingual project, choose the language code of the majority of the documents. See [language support](../../language-support.md) to learn more about supported language codes. |`en-us`|

Once you send your API request, you'll receive a `200` response indicating success and JSON response body with your project details.
