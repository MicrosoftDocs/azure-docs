---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 05/17/2022
ms.author: aahi
---

Submit a **PATCH** request using the following URL, headers, and JSON body to create a new project.

### Request URL

Use the following URL when creating your API request. Replace the placeholder values below with your own values. 

```rest
{ENDPOINT}/language/authoring/analyze-conversations/projects/{PROJECT-NAME}?api-version={API-VERSION}
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

### Body

Use the following sample JSON as your body.

```json
{
  "projectName": "{PROJECT-NAME}",
  "language": "{LANGUAGE-CODE}",
  "projectKind": "Orchestration",
  "description": "Project description"
 }
```

|Key  |Placeholder  |Value  | Example |
|---------|---------|----------|--|
| `projectName` | `{PROJECT-NAME}` | The name of your project. This value is case-sensitive. | `EmailApp` |
| `language` | `{LANGUAGE-CODE}` |  A string specifying the language code for the utterances used in your project. If your project is a multilingual project, choose the [language code](../../language-support.md) of the majority of the utterances. |`en-us`|

