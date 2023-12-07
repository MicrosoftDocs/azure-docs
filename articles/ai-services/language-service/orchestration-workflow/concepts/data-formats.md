---
title: Orchestration workflow data formats
titleSuffix: Azure AI services
description: Learn about the data formats accepted by orchestration workflow.
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 05/19/2022
ms.author: aahi
ms.custom:  language-service-orchestration
---

# Data formats accepted by orchestration workflow

When data is used by your model for learning, it expects the data to be in a specific format. When you tag your data in Language Studio, it gets converted to the JSON format described in this article. You can also manually tag your files.


## JSON file format

If you upload a tags file, it should follow this format.

```json
{
  "projectFileVersion": "{API-VERSION}",
  "stringIndexType": "Utf16CodeUnit",
  "metadata": {
    "projectKind": "Orchestration",
    "projectName": "{PROJECT-NAME}",
    "multilingual": false,
    "description": "This is a description",
    "language": "{LANGUAGE-CODE}"
  },
  "assets": {
    "projectKind": "Orchestration",
    "intents": [
      {
        "category": "{INTENT1}",
        "orchestration": {
          "targetProjectKind": "Luis|Conversation|QuestionAnswering",
          "luisOrchestration": {
            "appId": "{APP-ID}",
            "appVersion": "0.1",
            "slotName": "production"
          },
          "conversationOrchestration": {
            "projectName": "{PROJECT-NAME}",
            "deploymentName": "{DEPLOYMENT-NAME}"
          },
          "questionAnsweringOrchestration": {
            "projectName": "{PROJECT-NAME}"
          }
        }
      }
    ],
    "utterances": [
      {
        "text": "utterance 1",
        "language": "{LANGUAGE-CODE}",
        "dataset": "{DATASET}",
        "intent": "intent1"
      }
    ]
  }
}
```

|Key  |Placeholder  |Value  | Example |
|---------|---------|----------|--|
| `api-version` | `{API-VERSION}`     | The version of the API you are calling. The value referenced here is for the latest released [model version](../../concepts/model-lifecycle.md#choose-the-model-version-used-on-your-data) released. | `2022-03-01-preview` |
|`confidenceThreshold`|`{CONFIDENCE-THRESHOLD}`|This is the threshold score below which the intent will be predicted as [none intent](none-intent.md)|`0.7`|
| `projectName` | `{PROJECT-NAME}` | The name of your project. This value is case-sensitive. | `EmailApp` |
| `multilingual` | `false`| Orchestration doesn't support the multilingual feature  | `false`|
| `language` | `{LANGUAGE-CODE}` |  A string specifying the language code for the utterances used in your project. See [Language support](../language-support.md) for more information about supported language codes. |`en-us`|
| `intents` | `[]` | Array containing all the intent types you have in the project. These are the intents used in the orchestration project.| `[]` |


## Utterance format

```json
[
    {
        "intent": "intent1",
        "language": "{LANGUAGE-CODE}",
        "text": "{Utterance-Text}",
    },
    {
        "intent": "intent2",
        "language": "{LANGUAGE-CODE}",
        "text": "{Utterance-Text}",
    }
]

```



## Next steps
* You can import your labeled data into your project directly. Learn how to [import project](../how-to/create-project.md)
* See the [how-to article](../how-to/tag-utterances.md) more information about labeling your data. When you're done labeling your data, you can [train your model](../how-to/train-model.md).  
