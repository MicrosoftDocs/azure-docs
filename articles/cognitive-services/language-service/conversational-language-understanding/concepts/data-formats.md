---
title: conversational language understanding data formats
titleSuffix: Azure Cognitive Services
description: Learn about the data formats accepted by conversational language understanding.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 05/13/2022
ms.author: aahi
ms.custom: language-service-custom-clu
---

# Data formats accepted by conversational language understanding


If you're uploading your data into CLU it has to follow a specific format, use this article to learn more about accepted data formats.

## Import project file format

If you're [importing a project](../how-to/create-project.md#import-project) into CLU the file uploaded has to be in the following format.

```json
{
  "api-version":"{API-VERSION}" ,
    "stringIndexType": "Utf16CodeUnit",
    "metadata": {
        "projectKind": "conversation",
        "settings": {
            "confidenceThreshold": "{CONFIDENCE-THRESHOLD}"
        },
        "projectName": "{PROJECT-NAME}",
        "multilingual": true,
        "description": "Trying out CLU",
        "language": "{LANGUAGE-CODE}"
    },
  "assets": {
    "intents": [
      {
        "category": "intent1"
      },
      {
        "category": "intent2"
      }
    ],
    "entities": [
      {
        "category": "entity1"
      }
    ],
    "utterances": [
      {
        "text": "{Utterance-Text}",
        "language": "{LANGUAGE-CODE}",
        "dataset": "{DATASET}",
        "intent": "intent1",
        "entities": [
          {
            "category": "entity1",
            "offset": 5,
            "length": 5
          }
        ]
      },
      {
        "text": "{Utterance-Text}",
        "language": "{LANGUAGE-CODE}",
        "dataset": "{DATASET}",
        "intent": "intent2",
        "entities": []
      }
    ]
  }
}

```

|Key  |Placeholder  |Value  | Example |
|---------|---------|----------|--|
| `api-version` | `{API-VERSION}`     | The version of the API you're calling. The value referenced here is for the latest released [model version](../../concepts/model-lifecycle.md#choose-the-model-version-used-on-your-data) released.  | `2022-03-01-preview` |
|`confidenceThreshold`|`{CONFIDENCE-THRESHOLD}`|This is the threshold score below which the intent will be predicted as [none intent](none-intent.md)|`0.7`|
| `projectName` | `{PROJECT-NAME}` | The name of your project. This value is case-sensitive. | `EmailApp` |
| `multilingual` | `true`| A boolean value that enables you to have documents in multiple languages in your dataset and when your model is deployed you can query the model in any supported language (not necessarily included in your training documents. See [Language support](../language-support.md#multi-lingual-option) for more information about supported language codes.  | `true`|
| `language` | `{LANGUAGE-CODE}` |  A string specifying the language code for the utterances used in your project. If your project is a  multilingual project, choose the [language code](../language-support.md) of the majority of the utterances. |`en-us`|
| `intents` | `[]` | Array containing all the intents you have in the project. These are the intent types that will be extracted from your utterances.| `[]` |
| `entities` | `[]` | Array containing all the entities in your project. These are the entities that will be extracted from your utterances.| `[]` |
| `dataset` | `{DATASET}` |  The test set to which this utterance will go to when split before training. Learn more about data splitting [here](../how-to/train-model.md#data-splitting) . Possible values for this field are `Train` and `Test`.      |`Train`|
| `category` | ` ` |  The type of entity associated with the span of text specified. | `Entity1`|
| `offset` | ` ` |  The inclusive character position of the start of the entity.      |`5`|
| `length` | ` ` |  The character length of the entity.      |`5`|
| `language` | `{LANGUAGE-CODE}` |  A string specifying the language code for the utterances used in your project. If your project is a multilingual project, choose the [language code](../language-support.md) of the majority of the utterances. |`en-us`|

## Utterance file format

CLU offers the option to upload your utterance directly to the project rather than typing them in one by one. You can find this option in the [data labeling](../how-to/tag-utterances.md) page for your project.

```json
[
    {
        "text": "{Utterance-Text}",
        "language": "{LANGUAGE-CODE}",
        "dataset": "{DATASET}",
        "intent": "{intent}",
        "entities": [
            {
                "entityName": "{entity}",
                "offset": 19,
                "length": 10
            }
        ]
    },
    {
        "text": "{Utterance-Text}",
        "language": "{LANGUAGE-CODE}",
        "dataset": "{DATASET}",
        "intent": "{intent}",
        "entities": [
            {
                "entityName": "{entity}",
                "offset": 20,
                "length": 10
            },
            {
                "entityName": "{entity}",
                "offset": 31,
                "length": 5
            }
        ]
    }
]

```

|Key  |Placeholder  |Value  | Example |
|---------|---------|----------|--|
|`text`|`{Utterance-Text}`|Your utterance text|Testing|
| `language` | `{LANGUAGE-CODE}` |  A string specifying the language code for the utterances used in your project. If your project is a multilingual project, choose the language code of the majority of the utterances. See [Language support](../language-support.md) for more information about supported language codes. |`en-us`|
| `dataset` | `{DATASET}` |  The test set to which this utterance will go to when split before training. Learn more about data splitting [here](../how-to/train-model.md#data-splitting) . Possible values for this field are `Train` and `Test`.      |`Train`|
|`intent`|`{intent}`|The assigned intent| intent1|
|`entity`|`{entity}`|Entity to be extracted| entity1|
| `category` | ` ` |  The type of entity associated with the span of text specified. | `Entity1`|
| `offset` | ` ` |  The inclusive character position of the start of the text.      |`0`|
| `length` | ` ` |  The length of the bounding box in terms of UTF16 characters. Training only considers the data in this region.      |`500`|


## Next steps

* You can import your labeled data into your project directly. See [import project](../how-to/create-project.md#import-project) for more information.
* See the [how-to article](../how-to/tag-utterances.md) more information about labeling your data. When you're done labeling your data, you can [train your model](../how-to/train-model.md).  
