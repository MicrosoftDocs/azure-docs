---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 05/17/2022
ms.author: aahi
---


### Request URL

Create a **POST** request using the following URL, headers, and JSON body to import your project. Use the following URL when creating your API request. Replace the placeholder values below with your own values. 

```rest
{ENDPOINT}/language/authoring/analyze-text/projects/{PROJECT-NAME}/:import?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.   | `EmailApp` |
|`{API-VERSION}`     | The version of the API you are calling. The value referenced here is for the latest released [model version](../../../concepts/model-lifecycle.md#choose-the-model-version-used-on-your-data). | `2022-03-01-preview` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|
| `format` | `clu` |

### Body

Use the following sample JSON as your body.

```json
{
  "api-version": "{API-VERSION}",
  "stringIndexType": "Utf16CodeUnit",
  "metadata": {
    "projectKind": "orchestration",
    "settings": {
      "confidenceThreshold": 0
    },
    "projectName": "{PROJECT-NAME}",
    "multilingual": true,
    "description": "Project description",
    "language": "{LANGUAGE-CODE}"
  },
  "assets": {
    "intents": [
      {
        "category": "string",
        "orchestration": {
          "kind": "luis",
          "luisOrchestration": {
            "appId": "00000000-0000-0000-0000-000000000000",
            "appVersion": "string",
            "slotName": "string"
          },
          "cluOrchestration": {
            "projectName": "string",
            "deploymentName": "string"
          },
          "qnaOrchestration": {
            "projectName": "string"
          }
        }
      }
    ],
    "utterances": [
      {
        "text": "Trying orchestration",
        "language": "{LANGUAGE-CODE}",
        "intent": "string"
      }
    ]
  }
}

```

|Key  |Placeholder  |Value  | Example |
|---------|---------|----------|--|
| `api-version` | `{API-VERSION}` | The version of the API you are calling. The version used here must be the same the API version in the URL. | `2022-03-01-preview` |
| `projectName` | `{PROJECT-NAME}` | The name of your project. This value is case-sensitive. | `EmailApp` |
| `language` | `{LANGUAGE-CODE}` |  A string specifying the language code for the utterances used in your project. If your project is a multilingual project, choose the [language code](../../language-support.md) of the majority of the utterances. |`en-us`|

