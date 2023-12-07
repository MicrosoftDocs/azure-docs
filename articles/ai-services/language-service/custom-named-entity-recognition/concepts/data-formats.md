---
title: Custom NER data formats
titleSuffix: Azure AI services
description: Learn about the data formats accepted by custom NER.
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 10/17/2022
ms.author: aahi
ms.custom: language-service-custom-ner, ignite-fall-2021, event-tier1-build-2022
---

# Accepted custom NER data formats

If you are trying to [import your data](../how-to/create-project.md#import-project) into custom NER, it has to follow a specific format. If you don't have data to import, you can [create your project](../how-to/create-project.md) and use Language Studio to [label your documents](../how-to/tag-data.md).

## Labels file format

Your Labels file should be in the `json` format below to be used in [importing](../how-to/create-project.md#import-project) your labels into a project.

```json
{
  "projectFileVersion": "2022-05-01",
  "stringIndexType": "Utf16CodeUnit",
  "metadata": {
    "projectKind": "CustomEntityRecognition",
    "storageInputContainerName": "{CONTAINER-NAME}",
    "projectName": "{PROJECT-NAME}",
    "multilingual": false,
    "description": "Project-description",
    "language": "en-us",
    "settings": {}
  },
  "assets": {
    "projectKind": "CustomEntityRecognition",
    "entities": [
      {
        "category": "Entity1"
      },
      {
        "category": "Entity2"
      }
    ],
    "documents": [
      {
        "location": "{DOCUMENT-NAME}",
        "language": "{LANGUAGE-CODE}",
        "dataset": "{DATASET}",
        "entities": [
          {
            "regionOffset": 0,
            "regionLength": 500,
            "labels": [
              {
                "category": "Entity1",
                "offset": 25,
                "length": 10
              },
              {
                "category": "Entity2",
                "offset": 120,
                "length": 8
              }
            ]
          }
        ]
      },
      {
        "location": "{DOCUMENT-NAME}",
        "language": "{LANGUAGE-CODE}",
        "dataset": "{DATASET}",
        "entities": [
          {
            "regionOffset": 0,
            "regionLength": 100,
            "labels": [
              {
                "category": "Entity2",
                "offset": 20,
                "length": 5
              }
            ]
          }
        ]
      }
    ]
  }
}

```

|Key  |Placeholder  |Value  | Example |
|---------|---------|----------|--|
| `multilingual` | `true`| A boolean value that enables you to have documents in multiple languages in your dataset and when your model is deployed you can query the model in any supported language (not necessarily included in your training documents). See [language support](../language-support.md#multi-lingual-option) to learn more about multilingual support. | `true`|
|`projectName`|`{PROJECT-NAME}`|Project name|`myproject`|
| storageInputContainerName|`{CONTAINER-NAME}`|Container name|`mycontainer`|
| `entities` | | Array containing all the entity types you have in the project. These are the entity types that will be extracted from your documents into.|  |
| `documents` | | Array containing all the documents in your project and list of the entities labeled within each document. | [] |
| `location` | `{DOCUMENT-NAME}` |  The location of the documents in the storage container. Since all the documents are in the root of the container this should be the document name.|`doc1.txt`|
| `dataset` | `{DATASET}` |  The test set to which this file will go to when split before training. Learn more about data splitting [here](../how-to/train-model.md#data-splitting) . Possible values for this field are `Train` and `Test`.      |`Train`|
| `regionOffset` |  |  The inclusive character position of the start of the text.      |`0`|
| `regionLength` |  |  The length of the bounding box in terms of UTF16 characters. Training only considers the data in this region.      |`500`|
| `category` |  |  The type of entity associated with the span of text specified. | `Entity1`|
| `offset` |  |  The start position for the entity text. | `25`|
| `length` |  |  The length of the entity in terms of UTF16 characters. | `20`|
| `language` | `{LANGUAGE-CODE}` |  A string specifying the language code for the document used in your project. If your project is a multilingual project, choose the language code of the majority of the documents. See [Language support](../language-support.md) for more information about supported language codes. |`en-us`|



## Next steps
* You can import your labeled data into your project directly. Learn how to [import project](../how-to/create-project.md#import-project)
* See the [how-to article](../how-to/tag-data.md)  more information about labeling your data. When you're done labeling your data, you can [train your model](../how-to/train-model.md).  
