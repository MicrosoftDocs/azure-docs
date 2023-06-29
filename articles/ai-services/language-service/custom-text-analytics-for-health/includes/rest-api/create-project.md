---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 04/14/2023
ms.author: aahi
---
To start creating a custom Text Analytics for health model, you need to create a project. Creating a project will let you label data, train, evaluate, improve, and deploy your models.

> [!NOTE]
> The project name is case-sensitive for all operations.

Create a **PATCH** request using the following URL, headers, and JSON body to create your project.

### Request URL

Use the following URL to create a project. Replace the placeholder values below with your own values. 

```rest
{Endpoint}/language/authoring/analyze-text/projects/{projectName}?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.   | `myProject` |
|`{API-VERSION}`     | The version of the API you are calling. The value referenced here is for the latest version released. See [Model lifecycle](../../../concepts/model-lifecycle.md#choose-the-model-version-used-on-your-data) to learn more about other available API versions.  | `2022-05-01` |


### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|

### Body

Use the following JSON in your request. Replace the placeholder values below with your own values.

```json
{
  "projectName": "{PROJECT-NAME}",
  "language": "{LANGUAGE-CODE}",
  "projectKind": "CustomHealthcare",
  "description": "Project description",
  "multilingual": "True",
  "storageInputContainerName": "{CONTAINER-NAME}"
}

```

|Key  |Placeholder|Value  | Example |
|---------|---------|---------|--|
| projectName | `{PROJECT-NAME}` | The name of your project. This value is case-sensitive. | `myProject` |
| language | `{LANGUAGE-CODE}` |  A string specifying the language code for the documents used in your project. If your project is a multilingual project, choose the language code of the majority of the documents. See [language support](../../language-support.md) to learn more about supported language codes. |`en-us`|
| projectKind | `CustomHealthcare` | Your project kind. | `CustomHealthcare` |
| multilingual | `true`| A boolean value that enables you to have documents in multiple languages in your dataset and when your model is deployed you can query the model in any supported language (not necessarily ones included in your training documents). See [language support](../../language-support.md) to learn more about multilingual support.  | `true`|
| storageInputContainerName | `{CONTAINER-NAME` | The name of your Azure storage container where you have uploaded your documents.   | `myContainer` |




This request will return a 201 response, which means that the project is created.


This request will return an error if:
* The selected resource doesn't have proper permission for the storage account. 

