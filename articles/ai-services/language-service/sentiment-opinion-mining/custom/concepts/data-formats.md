---
title: Custom sentiment analysis data formats
titleSuffix: Azure AI services
description: Learn about the data formats accepted by custom sentiment analysis.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 07/19/2023
ms.author: aahi
ms.custom: language-service-custom-ner, ignite-fall-2021, event-tier1-build-2022
---

# Accepted custom sentiment analysis data formats

If you are trying to [import your data](../how-to/create-project.md#import-a-custom-sentiment-analysis-project) into custom sentiment analysis, it has to follow a specific format. If you don't have data to import, you can [create your project](../how-to/create-project.md) and use Language Studio to [label your documents](../how-to/label-data.md).

## Labels file format

Your Labels file should be in the `json` format below to be used in [importing](../how-to/create-project.md#import-a-custom-sentiment-analysis-project) your labels into a project.

```json
{
    "projectFileVersion": "2023-04-15-preview",
    "stringIndexType": "Utf16CodeUnit",
    "metadata": {
        "projectKind": "CustomTextSentiment",
        "storageInputContainerName": "custom-sentiment-2",
        "projectName": "sa-test",
        "multilingual": false,
        "description": "",
        "language": "en-us"
    },
    "assets": {
        "projectKind": "CustomTextSentiment",
        "documents": [
            {
                "location": "document_1.txt",
                "language": "en-us",
                "sentimentSpans": [
                    {
                        "category": "positive",
                        "offset": 0,
                        "length": 60
                    },
                    {
                        "category": "neutral",
                        "offset": 61,
                        "length": 31
                    }
                ],
                "dataset": "Train"
            },
            {
                "location": "document_2.txt",
                "language": "en-us",
                "sentimentSpans": [
                    {
                        "category": "positive",
                        "offset": 0,
                        "length": 50
                    },
                    {
                        "category": "positive",
                        "offset": 51,
                        "length": 49
                    },
                    {
                        "category": "positive",
                        "offset": 101,
                        "length": 26
                    }
                ],
                "dataset": "Train"
            }
        ]
    }
}

```

|Key  |Placeholder  |Value  | Example |
|---------|---------|----------|--|
| `multilingual` | `true`| A boolean value that enables you to have documents in multiple languages in your dataset and when your model is deployed you can query the model in any supported language (not necessarily included in your training documents). See [language support](../../language-support.md#multi-lingual-option-custom-sentiment-analysis-only) to learn more about multilingual support. | `true`|
|`projectName`|`{PROJECT-NAME}`|Project name|`myproject`|
| storageInputContainerName|`{CONTAINER-NAME}`|Container name|`mycontainer`|
| `sentimentSpans` | | Array containing all the sentiments and their locations in the document. |  |
| `documents` | | Array containing all the documents in your project and list of the entities labeled within each document. | [] |
| `location` | `{DOCUMENT-NAME}` |  The location of the documents in the storage container. Since all the documents are in the root of the container this should be the document name.|`doc1.txt`|
| `dataset` | `{DATASET}` |  The test set to which this file will go to when split before training. Learn more about data splitting [here](../how-to/train-model.md#data-splitting) . Possible values for this field are `Train` and `Test`.      |`Train`|
| `offset` |  |  The inclusive character position of the start of a sentiment in the text.      |`0`|
| `length` |  |  The length of the bounding box in terms of UTF16 characters. Training only considers the data in this region.      |`500`|
| `category` |  |  The sentiment associated with the span of text specified. | `positive`|
| `offset` |  |  The start position for the entity text. | `25`|
| `length` |  |  The length of the entity in terms of UTF16 characters. | `20`|
| `language` | `{LANGUAGE-CODE}` |  A string specifying the language code for the document used in your project. If your project is a multilingual project, choose the language code of the majority of the documents. See [Language support](../../language-support.md) for more information about supported language codes. |`en-us`|



## Next steps
* You can import your labeled data into your project directly. Learn how to [import project](../how-to/create-project.md#import-a-custom-sentiment-analysis-project)
* See the [how-to article](../how-to/label-data.md)  more information about labeling your data. When you're done labeling your data, you can [train your model](../how-to/train-model.md).  
